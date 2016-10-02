/*!
 * Expanse, LLC
 * http://expansellc.io
 *
 * Copyright 2016
 * Released under the Apache 2 license
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * @authors Ryan Scott
 */
'use strict';
const logger = require('winston');
const https = require('https');
const identityProvider = {
  AMAZON_TOKEN: {
    host: 'api.amazon.com',
    path: '/auth/o2/tokeninfo?access_token=',
    port: 443
  },
  AMAZON_PROFILE: {
    host: 'api.amazon.com',
    path: '/user/profile',
    port: 443
  }
};

/**
 * This class setups and makes the API Call to Amazon to retrieve a
 * principalId for the authorizer.
 */
class AmznIdModule {
  /**
   * HTTP request to identity provider with supplied token.
   * If [principalId = 0] is returned, the token is invalid or the call otherwise failed.
   * @param token
   */
  callIdProvider(token) {
    return new Promise((resolve) => {
      const tokenedPath = identityProvider.AMAZON_TOKEN.path.concat(token);
      const disposableClone = {};
      Object.assign(disposableClone, identityProvider.AMAZON_TOKEN);
      disposableClone.path = tokenedPath;

      const req = https.request(disposableClone, (response) => {
        logger.info(`Token response code: ${response.statusCode}`);
        if (response.statusCode !== 200) {
          resolve(0);
        }

        let str = '';
        response.on('data', (chunk) => {
          logger.info(`Token data: ${chunk}`);
          str += chunk;
        });

        response.on('end', () => {
          resolve(str);
        });
      });

      req.on('error', (err) => {
        logger.info(`Problem with request: ${err.message}`);

        resolve(0);
      });

      req.end();
    }).then((tokenResponse) => new Promise((resolve) => {
      // TODO validate the client id in the tokenResponse
      const disposableClone = {};
      Object.assign(disposableClone, identityProvider.AMAZON_PROFILE);
      disposableClone.headers = {
        Authorization: 'Bearer '.concat(token)
      };

      const req = https.request(disposableClone, (response) => {
        logger.info(`Profile response code: ${response.statusCode}`);
        if (response.statusCode !== 200) {
          resolve(0);
        }

        let str = '';
        response.on('data', (chunk) => {
          logger.info(`Profile data: ${chunk}`);
          str += chunk;
        });

        response.on('end', () => {
          const principalId = AmznIdModule.retrievePrincipalId(str);

          resolve(principalId);
        });
      });

      req.on('error', (err) => {
        logger.info(`Problem with request: ${err.message}`);

        resolve(0);
      });

      req.end();
    }));
  }

  /**
   * Parses the response payload from Amazon for the user's email.
   */
  static retrievePrincipalId(payload) {
    let principalId = 0;
    const json = JSON.parse(payload);

    if (json.email) {
      principalId = json.email;
    }
    return principalId;
  }
}

module.exports = AmznIdModule;

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

/**
 * This class setups and makes the API Call to Amazon to retrieve a
 * principalId for the authorizer.
 */
class AmznIdModule {
  constructor(config) {
    this.identityProvider = config.getAmazon();
  }

  /**
   * HTTP request to identity provider with supplied token.
   * If [principalId = 0] is returned, the token is invalid or the call otherwise failed.
   * @param token
   */
  callIdProvider(token) {
    /**
     * Because of Promise.all failfast pattern, we are not offically rejecting
     * on failed network requests or 4xx responses.
     *
     * Downstream Promise.all() will handle gathering promise results
     * and building an accept or deny policies to pass back to handler.
     */
    return new Promise((resolve) => {
      logger.info('executor function within promise is being called to execute async code . . .', {
        context: 'amazon'
      });
      const tokenedPath = this.identityProvider.token.path.concat(token);
      const disposableClone = {};
      Object.assign(disposableClone, this.identityProvider.token);
      disposableClone.path = tokenedPath;

      const req = https.request(disposableClone, (response) => {
        logger.info(`Token response code: ${response.statusCode}`, {
          context: 'amazon'
        });
        if (response.statusCode !== 200) {
          resolve(0);
        }

        let str = '';
        response.on('data', (chunk) => {
          logger.info(`Token data: ${chunk}`, {
            context: 'amazon'
          });
          str += chunk;
        });

        response.on('end', () => {
          resolve(str);
        });
      });

      req.on('error', (err) => {
        logger.info(`Problem with request: ${err.message}`, {
          context: 'amazon'
        });

        resolve(0);
      });

      req.end();
    }).then(() => new Promise((resolve) => {
      logger.info('executor function within promise is being called to execute async code . . .', {
        context: 'amazon'
      });
      const disposableClone = {};
      Object.assign(disposableClone, this.identityProvider.profile);
      disposableClone.headers = {
        Authorization: 'Bearer '.concat(token)
      };

      const req = https.request(disposableClone, (response) => {
        logger.info(`Profile response code: ${response.statusCode}`, {
          context: 'amazon'
        });
        if (response.statusCode !== 200) {
          resolve(0);
        }

        let str = '';
        response.on('data', (chunk) => {
          logger.info(`Profile data: ${chunk}`, {
            context: 'amazon'
          });
          str += chunk;
        });

        response.on('end', () => {
          const principalId = AmznIdModule.retrievePrincipalId(str);

          resolve(principalId);
        });
      });

      req.on('error', (err) => {
        logger.info(`Problem with request: ${err.message}`, {
          context: 'amazon'
        });

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

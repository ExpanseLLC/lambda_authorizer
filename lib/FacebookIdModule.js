/*!
 * Expanse, LLC
 * http://expansellc.io
 *
 * Copyright 2016
 * Released under the Apache 2 license
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * @authors James Shank
 */
'use strict';
const logger = require('winston');
const https = require('https');

/**
 *  This class setups and makes the API Call to Facebook to retrieve
 *  a principalId for the authorizer.
 */
class FacebookIdModule {
  constructor(config) {
    this.identityProvider = config.getFacebook();
  }

  /**
   * HTTP request to identity provider with supplied token.
   * If [principalId = 0] is returned, the token is invalid or the call otherwise failed.
   * @param token
   * @returns principalId
   */
  callIdProvider(token) {
    const inputToken = `input_token=${token}`;
    const accessToken = '&access_token='
      .concat(this.identityProvider.appId)
      .concat('|')
      .concat(this.identityProvider.appSecret);
    const tokenedPath = this.identityProvider.path.concat(inputToken).concat(accessToken);
    const disposableClone = {};

    Object.assign(disposableClone, this.identityProvider);
    disposableClone.path = tokenedPath;

    /**
     * Because of Promise.all failfast pattern, we are not offically rejecting
     * on failed network requests or 4xx responses.
     *
     * Downstream Promise.all() will handle gathering promise results
     * and building an accept or deny policies to pass back to handler.
     */
    return new Promise((resolve) => {
      logger.info('executor function within promise is being called to execute async code . . .', {
        context: 'facebook'
      });

      const req = https.get(disposableClone, (response) => {
        logger.info(`STATUS: ${response.statusCode}`, {
          context: 'facebook'
        });
        if (response.statusCode !== 200) {
          resolve(0);
        }

        let str = '';
        response.on('data', (chunk) => {
          logger.info(`BODY: ${chunk}`, {
            context: 'facebook'
          });
          str += chunk;
        });

        response.on('end', () => {
          logger.info('No more data in response.', {
            context: 'facebook'
          });
          const principalId = FacebookIdModule.retrievePrincipalId(str);
          resolve(principalId);
        });
      });

      req.on('error', (err) => {
        logger.info(`problem with request: ${err.message}`, {
          context: 'facebook'
        });
        resolve(0);
      });

      req.end();
    });
  }

  static retrievePrincipalId(payload) {
    let principalId = 0;
    const json = JSON.parse(payload);

    if (json.data && json.data.is_valid && json.data.user_id) {
      principalId = json.data.user_id;
    }
    return principalId;
  }
}

module.exports = FacebookIdModule;

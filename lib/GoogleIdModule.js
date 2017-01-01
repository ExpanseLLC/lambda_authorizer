/*!
 * Expanse, LLC
 * http://expansellc.io
 *
 * Copyright 2016
 * Released under the Apache 2 license
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * @authors Meghan Erickson
 */
'use strict';
const logger = require('winston');
const https = require('https');

/**
 *  This class setups and makes the API Call to Google to retrieve
 *  a principalId for the authorizer.
 *  See the README for Google's Contract
 */
class GoogleIdModule {
  constructor(config) {
    this.identityProvider = config.getGoogle();
  }

  /**
   * HTTP request to identity provider with supplied token.
   * If [principalId = 0] is returned, the token is invalid or the call otherwise failed.
   * @return principalId
   * @param token
   */
  callIdProvider(token) {
    const tokenedPath = this.identityProvider.path.concat(token);
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
      logger.info('executor function within promise is being called to execute async code . . .');

      const req = https.request(disposableClone, (response) => {
        logger.info(`STATUS: ${response.statusCode}`);
        if (response.statusCode !== 200) {
          resolve(0);
        }

        let str = '';
        response.on('data', (chunk) => {
          logger.info(`BODY: ${chunk}`);
          str += chunk;
        });

        response.on('end', () => {
          logger.info('No more data in response.');
          const principalId = GoogleIdModule.retrievePrincipalId(str);
          resolve(principalId);
        });
      });

      req.on('error', (err) => {
        logger.info(`problem with request: ${err.message}`);
        resolve(0);
      });

      req.end();
    });
  }

  static retrievePrincipalId(payload) {
    let principalId = 0;
    const json = JSON.parse(payload);

    if (json.email) {
      principalId = json.email;
    }
    return principalId;
  }
}

module.exports = GoogleIdModule;

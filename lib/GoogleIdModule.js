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
    /**
     * HTTP request to identity provider with supplied token.
     * If [principalId = 0] is returned, the token is invalid or the call otherwise failed.
     * @return principalId
     * @param token
     */
    callIdProvider(token) {

        var tokenedPath = identityProvider.GOOGLEv3.path.concat(token);
        var disposableClone = {};
        Object.assign(disposableClone, identityProvider.GOOGLEv3);
        disposableClone.path = tokenedPath;

        /**
         * Because of Promise.all failfast pattern, we are not offically rejecting
         * on failed network requests or 4xx responses. 
         * 
         * Downstream Promise.all() will handle gathering promise results
         * and building an accept or deny policies to pass back to handler.
         */
        return new Promise (
            /*executor*/
            (resolve, reject) => {
                logger.info('executor function within promise is being called to execute async code . . .');

                var req = https.request(disposableClone, (response) => {
                    logger.info(`STATUS: ${response.statusCode}`);
                    if (response.statusCode !== 200) {
                        resolve(0);
                    }

                    var str = '';
                    response.on('data', (chunk) => {
                        logger.info(`BODY: ${chunk}`);
                        str += chunk;
                    });

                    response.on('end', () => {
                        logger.info('No more data in response.');
                        var principalId = GoogleIdModule.retrievePrincipalId(str);
                        resolve(principalId);
                    });
                });

                req.on('error', (err) => {
                    logger.info(`problem with request: ${err.message}`);
                    resolve(0);
                });

                req.end();
            }
        );
    }

    //todo parse the payload and return the payload.email
    static retrievePrincipalId(payload) {
        var principalId = 0;
        var json = JSON.parse(payload);

        if (json.email) {
            principalId = json.email;
        }
        return principalId;
    }
}

/**
 * Google Identity Provider Guide
 * https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
 * @type {{GOOGLEv3: string, . . . GooglevN: string}}
 */
var identityProvider = {
    GOOGLEv3: {
        host: "www.googleapis.com",
        path: "/oauth2/v3/tokeninfo?id_token=",
        port: 443
    }
};

module.exports = GoogleIdModule;
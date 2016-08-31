/**
 * Created by beezus on 8/31/16.
 */
'use strict';
const https = require('https');

/**
 *  This class setups and makes the API Call to Google to retrieve
 *  a principalId for the authorizer.
 *  See the README for Google's Contract
 */
class GoogleIdModule {

/**
  * HTTP request to identity provider with supplied token.
 *  If [principalId = -1] is returned, the token is invalid.
  * @return principalId
  * @param token
  */
    callIdProvider(token) {
        var principalId = -1;

        var tokenedPath = identityProvider.GOOGLE.path.concat(token);
        var disposableClone = {};
        Object.assign(disposableClone, identityProvider.GOOGLE);
        disposableClone.path = tokenedPath;

        var req = https.request(disposableClone, (response) => {
            var str = '';
            console.log(`STATUS: ${response.statusCode}`);

            response.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
                str += chunk;
            });

            response.on('end', () => {
                console.log('No more data in response.');
            });
        });

        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });

        req.end();
        return principalId;
    }
}

/**
 * TODO: add Facebook and Amazon Id Providers
 * Google Identity Provider Guide
 * https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
 * @type {{GOOGLE: string, FACEBOOK: string, AMAZON: string}}
 */
var identityProvider = {
    GOOGLE: {
        host: "www.googleapis.com",
        path:"/oauth2/v3/tokeninfo?id_token=",
        port: 443
    },
    FACEBOOK: {},
    AMAZON: {}
};

module.exports = GoogleIdModule;
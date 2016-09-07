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
 *  If [principalId = 0] is returned, the token is invalid or the call otherwise failed.
  * @return principalId
  * @param token
  */
    callIdProvider(token) {
    var tokenedPath = identityProvider.GOOGLEv3.path.concat(token);
    var disposableClone = {};
    Object.assign(disposableClone, identityProvider.GOOGLEv3);
    disposableClone.path = tokenedPath;
    var payload = null;
    var statusCode = 0;

    var promise = new Promise(
        /*executor*/
        function (resolve, reject) {
            console.log('executor function within promise is being called to execute async code . . .');

            var req = https.request(disposableClone, (response) => {
                var str = '';
                console.log(`STATUS: ${response.statusCode}`);

                statusCode = response.statusCode;
                response.on('data', (chunk) => {
                    console.log(`BODY: ${chunk}`);
                    str += chunk;
                });

                response.on('end', () => {
                    console.log('No more data in response.');
                    payload = str;
                });
            });

            req.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
            });

            req.end();
            resolve(payload);
        }
    );

    //async code terminated
    //the promise is fulfilled only if the token was valid.
    promise.then(
        (payloadVal) => {
            if (statusCode === 200) {
                return this.retrievePrincipalId(payloadVal);
            }

            //if the statuscode was 400 how to throw to the catch below?
        }
    ).catch(
        (reason) => {

            return 0;
        })
}


    retrievePrincipalId(payload) {

        var principalId = 0;
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
        path:"/oauth2/v3/tokeninfo?id_token=",
        port: 443
    }
};

module.exports = GoogleIdModule;
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
 *  TODO: Update the README with FB's Contract
 */
class FacebookIdModule {
    /**
     * HTTP request to identity provider with supplied token.
     * If [principalId = 0] is returned, the token is invalid or the call otherwise failed.
     * @param token
     * @returns principalId
     */
    callIdProvider(token) {

        var principalId = 0;
        var input_token='input_token=' + token;
        var access_token = '&access_token='
            .concat(identityProvider.FACEBOOK.appId)
            .concat('|')
            .concat(identityProvider.FACEBOOK.appSecret);

        var tokenedPath = identityProvider.FACEBOOK.path.concat(input_token).concat(access_token);
        var disposableClone = {};
        Object.assign(disposableClone, identityProvider.FACEBOOK);
        disposableClone.path = tokenedPath;
        return new Promise(
            /*executor*/
            function (resolve, reject) {
                var req = https.get(disposableClone, (response) => {
                    var str = '';

                    response.on('data', (chunk) => {
                        str += chunk;
                    });

                    response.on('error', () => {
                        resolve(principalId);
                    });

                    response.on('end', () => {
                        logger.info('No more data in response.');

                        var json = JSON.parse(str);

                        logger.info(json);

                        if (json.data && json.data.is_valid && json.data.user_id) {
                            principalId = json.data.user_id;
                        }
                        resolve(principalId);
                    });
                });
                req.end();

            });

    }
}

var identityProvider = {
    FACEBOOK: {
        host: "graph.facebook.com",
        path:"/debug_token?", //from what I can tell this is OK for production use
        port: 443,
        appId:'1219028494814465',
        appSecret:'8fb31f4e7ce440be94f25de797568fe2'
    }
}

/*/--Uncomment to test as a stand alone app
//need to populate authToken with a valid access token.  get this from the fb test console
var authToken = 'EAARUszBnjQEBAB7FuZB3lR7b1EHtwciPk6YOHZABxBOS19Iq4pM4nZCRonQ4Fd9rgdMGDufUPLISzZA2QFgpTTZBHYKrAv1VFd37k6E2NogZAZC4lPWOkEIVJYzFTqqLMnJzhgvGuARdW9i9N11I1g9Aye4PyAW7P2IWXyjXujEaAZDZD';

module.exports = FacebookIdModule;
this.facebookMod = new FacebookIdModule();


this.facebookMod.callIdProvider(authToken).then(function(providerId){

    logger.info(providerId);
}).catch(function(error){
    logger.info('error: ' + error);
});

/*
 response:

 {
 "data": {
 "app_id": "1219028494814465",
 "application": "ExpanseIO Test App",
 "expires_at": 1473112800,
 "is_valid": true,
 "scopes": [
 "email",
 "public_profile"
 ],
 "user_id": "2069358006536792"
 }
 }
 */

/**
 * Created by beezus on 8/25/16.
 */
'use strict';
var http = require('http');

class AuthorizerModule {

    authorize(event, context) {

        console.log('Client token: ' + event.authorizationToken);
        console.log('Method ARN: ' + event.methodArn);

        this.callIdProvider(event.authorizationToken);
        return { success: true };
    }

    /**
     * HTTP request to identity provider with supplied token.
     * @return principalId
     * @param identityProvider
     * @param token
     */
    callIdProvider(token) {
        var principalId = -1;

     var callback = function(response) {
            var str = '';
            console.log(response);
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                console.log(str);
            });
        };

        //try Google first
        var tokenedPath = identityProvider.GOOGLE.path.concat(token);
        var disposableClone = {};
        Object.assign(disposableClone, identityProvider.GOOGLE);
        disposableClone.path = tokenedPath;

        var req = http.request(disposableClone, callback);
        req.end();
        
        console.log(" principalId is " +principalId);
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
        host: "https://www.googleapis.com",
        path: "oauth2/v3/tokeninfo?id_token="
    },
    FACEBOOK: {},
    AMAZON: {}
};

module.exports = AuthorizerModule;
/**
 * Created by beezus on 8/25/16.
 */
'use strict';
const http = require('http');

class AuthorizerModule {

    authorize(event, context) {

        console.log('Client token: ' + event.authorizationToken);
        console.log('Method ARN: ' + event.methodArn);
        return { success: true };
    }

    /**
     * TODO: add Facebook and Amazon Id Providers
     * Google Identity Provider Guide
     * https://david-codes.hatanian.com/2014/07/22/google-apis-checking-scopes-contained.html
     * @type {{GOOGLE: string, FACEBOOK: string, AMAZON: string}}
     */
    identityProvider = {
        GOOGLE: "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=",
        FACEBOOK: "facebook_url",
        AMAZON: "amazon_url"
    };

    /**
     * HTTP request to identity provider with supplied token.
     * @return principalId
     * @param identityProvider
     * @param token
     */
    callIdProvider(identityProvider, token) {
        var principalId = -1;
        return principalId;
    }
}

module.exports = AuthorizerModule;
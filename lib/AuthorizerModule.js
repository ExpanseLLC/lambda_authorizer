/**
 * Created by beezus on 8/25/16.
 */
'use strict';
const https = require('https');
const GoogleIdModule = require('./GoogleIdModule');
const FacebookIdModule = require('./FacebookIdModule');
const AmznIdModule = require('./AmznIdModule');

const googleMod = new GoogleIdModule();
const facebookMod = new FacebookIdModule();
const amznMod = new AmznIdModule();

class AuthorizerModule {

    authorize(event, context) {

        console.log('Client token: ' + event.authorizationToken);
        console.log('Method ARN: ' + event.methodArn);
        var principalId = 0;

        principalId = googleMod.callIdProvider(event.authorizationToken);
        if (principalId) {
            this.buildPolicy(principalId);
            return { success: true };
        }

        principalId = facebookMod.callIdProvider(event.authorizationToken);
        if (principalId) {
            this.buildPolicy(principalId);
            return { success: true };
        }

        principalId = amznMod.callIdProvider(event.authorizationToken);
        if (principalId) {
            this.buildPolicy(principalId);
            return { success: true };
        }

        return { success: false };
    }

    /**
     * Let's build an amazon policy for apigateway
     * References: https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints/blob/master/blueprints/nodejs/index.js
     * @param principalId
     */
    buildPolicy(principalId) {
     //do cool stuff
    }
}

module.exports = AuthorizerModule;
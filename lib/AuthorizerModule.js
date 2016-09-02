/**
 * Created by beezus on 8/25/16.
 */
'use strict';
const https = require('https');
const GoogleIdModule = require('./GoogleIdModule');
const FacebookIdModule = require('./FacebookIdModule');
const AmznIdModule = require('./AmznIdModule');

class AuthorizerModule {

    /**
     * Creates a new AuthorizerModule and instantiates the IdProviderModules
     * @constructor
     */
    constructor() {
        this.googleMod = new GoogleIdModule();
        this.facebookMod = new FacebookIdModule();
        this.amznMod = new AmznIdModule();
    }

    authorize(event, context) {

        console.log('Client token: ' + event.authorizationToken);
        console.log('Method ARN: ' + event.methodArn);
        var principalId = 0;

        principalId = this.googleMod.callIdProvider(event.authorizationToken);
        if (principalId) {
            this.buildPolicy(principalId);
            return { success: true };
        }

        principalId = this.facebookMod.callIdProvider(event.authorizationToken);
        if (principalId) {
            this.buildPolicy(principalId);
            return { success: true };
        }

        principalId = this.amznMod.callIdProvider(event.authorizationToken);
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
     //sample arn: Sample arn: arn:aws:execute-api:us-west-2:xxxxxxxxx:kvmxspwm7g/*/GET/
    }
}

module.exports = AuthorizerModule;
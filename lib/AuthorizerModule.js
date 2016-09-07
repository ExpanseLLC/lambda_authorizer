/**
 * Created by beezus on 8/25/16.
 */
'use strict';
const https = require('https');
const GoogleIdModule = require('./GoogleIdModule');
const FacebookIdModule = require('./FacebookIdModule');
const AmznIdModule = require('./AmznIdModule');
const PolicyBuilder = require('./PolicyBuilderModule');

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

    /**
     * TODO: refactor all for promises contract
     * @param event
     * @param context
     * @returns {{success: boolean}}
     */
    authorize(event, context) {

        console.log('Client token: ' + event.authorizationToken);
        console.log('Method ARN: ' + event.methodArn);
        console.log('The context: ' + context);

        var principalId;
        
        principalId = this.googleMod.callIdProvider(event.authorizationToken)
            .then(
                (payloadVal) => {
                    return this.googleMod.retrievePrincipalId(payloadVal);
                }
            )
            .catch(
                (failedPrincipalId) => {  
                    console.log('There was an error fulfilling the promise');
                    return failedPrincipalId;
            });

        principalId = this.facebookMod.callIdProvider(event.authorizationToken);
        if (principalId) {
            this.buildPolicy(principalId, event);
            return { success: true };
        }

        principalId = this.amznMod.callIdProvider(event.authorizationToken);
        if (principalId) {
            this.buildPolicy(principalId, event);
            return { success: true };
        }

        return { success: false };
    }
    
    /**
     * Let's build an amazon policy for apigateway
     * References: https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints/blob/master/blueprints/nodejs/index.js
     * @param principalId
     */
    buildPolicy(principalId, event) {
        var policy = new PolicyBuilder(principalId, context, event).build();
        return policy;
    }
}

module.exports = AuthorizerModule;
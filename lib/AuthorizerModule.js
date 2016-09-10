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
     * TODO: refactor all for promises contract and tests since flow will be different
     * @param event
     * @param context
     * @returns {{success: boolean}}
     */
    authorize(event, context) {

        console.log('Client token: ' + event.authorizationToken);
        console.log('Method ARN: ' + event.methodArn);
        console.log('The context: ' + context);

        var googlePromise = this.googleMod.callIdProvider(event.authorizationToken)
            .then((principalId) => {
                return principalId;
            })
            .catch(
                (failedPrincipalId) => {
                    console.log('There was an error fulfilling the promise');
                    return failedPrincipalId;
            });

        //TODO refactor in promises and add to below array within Promise.all([ARRAY_OF_PROMISES])
        // var fbPrincipalId = this.facebookMod.callIdProvider(event.authorizationToken);
        // if (fbPrincipalId) {
        //     this.buildPolicy(fbPrincipalId, event);
        //     return { success: true };
        // }
        //
        // var amznPrincipalId = this.amznMod.callIdProvider(event.authorizationToken);
        // if (amznPrincipalId) {
        //     this.buildPolicy(amznPrincipalId, event);
        //     return { success: true };
        // }

        /**
         * Returns a promise
         */
        return Promise.all([googlePromise]).then(
            results => {
                console.log(results);
                for(var i = 0; i < results.length; i++) {
                    if (typeof results[i] === 'string' ) {
                        console.log(results[i]);
                        var policy = this.buildPolicy(results[i], event);
                       return policy;
                    }
                }
                return { success: false };
            }
        );
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
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

        logger.info('Client token: ' + event.authorizationToken);
        logger.info('Method ARN: ' + event.methodArn);
        logger.info('The context: ' + JSON.stringify(context));

        var googlePromise = this.googleMod.callIdProvider(event.authorizationToken)
            .then((principalId) => {
                return principalId;
            })
            .catch(
                (failedPrincipalId) => {
                    logger.info('There was an error fulfilling the promise');
                    return failedPrincipalId;
            });

        return Promise.all([googlePromise]).then(
            results => {
                logger.info('Results from the 3 Promise API Calls: ' + results);
                for(var i = 0; i < results.length; i++) {
                    if (typeof results[i] === 'string' ) {
                        var policy = this.buildPolicy(results[i], context, event);
                       return policy;
                    }
                }
                return this.buildPolicy(null, context, event);
            }
        );
    }
    
    /**
     * Let's build an amazon policy for apigateway
     * References: https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints/blob/master/blueprints/nodejs/index.js
     * @param principalId
     */
    buildPolicy(principalId, context, event) {
        var policy = new PolicyBuilder(principalId, context, event).build();
        return policy;
    }
}

module.exports = AuthorizerModule;
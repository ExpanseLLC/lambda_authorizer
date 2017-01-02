/*!
 * Expanse, LLC
 * http://expansellc.io
 *
 * Copyright 2016
 * Released under the Apache 2 license
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * @authors Meghan Erickson, Ryan Scott
 */
'use strict';
const logger = require('winston');
const ProviderConfig = require('../config/ProviderConfig');
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
    const config = new ProviderConfig();
    this.googleMod = new GoogleIdModule(config);
    this.facebookMod = new FacebookIdModule(config);
    this.amznMod = new AmznIdModule(config);
  }

  /**
   * Performs three async calls operations to validate the token with Google, Facebook, & Amazon.
   * @param event
   * @param context
   * @returns AWS policy document
   */
  authorize(event, context) {
    logger.info(`Client token: ${event.authorizationToken}`, {
      context: 'authorize'
    });
    logger.info(`Method ARN: ${event.methodArn}`, {
      context: 'authorize'
    });
    logger.info(`The context: ${JSON.stringify(context)}`, {
      context: 'authorize'
    });

    return Promise.all([
      this.googleMod.callIdProvider(event.authorizationToken),
      this.amznMod.callIdProvider(event.authorizationToken),
      this.facebookMod.callIdProvider(event.authorizationToken)
    ]).then((results) => {
      let principalId = null;

      for (let i = 0; i < results.length; i++) {
        if (typeof results[i] === 'string') {
          principalId = results[i];
        }
      }

      return this.buildPolicy(principalId, context, event);
    });
  }

  /**
   * Let's build an amazon policy for apigateway
   * References: https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints/blob/master/blueprints/nodejs/index.js
   * @param principalId
   * @param context
   * @param event
   */
  buildPolicy(principalId, context, event) {
    return new PolicyBuilder(principalId, context, event).build();
  }
}

module.exports = AuthorizerModule;

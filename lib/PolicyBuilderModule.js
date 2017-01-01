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
const ResourceGroup = require('./ResourceGroupModule');
/**
 *
 * This class will build a policy like below
 * The resulting policy is temporarily cached bn APIGateway & mapped to
 * the token carried in the requests
 * The cached policy duration is 3600 seconds max
 *   {
 *      "principalId": "xxxxxxxx",
 *      "policyDocument": {
 *          "Version": "2012-10-17",
 *          "Statement": [
 *           {
 *               "Effect": "Allow",
 *               "Action": [
 *                   "execute-api:Invoke"
 *                ],
 *                "Resource": [
 *                 "arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<httpVerb>/[<resource>/<httpVerb>/[...]]"
 *               ]
 *           }
 *           ]
 *      }
 *   }
 */
class PolicyBuilderModule {

  /**
   * Creates a new PolicyBuilder
   * @constructor
   * @param principalId - the principalId derived from Google, FB, Amzn,
      around which to build the policy.
   * @param context - the lambda context
   * @param event - the event passed in the lambda invocation
   */
  constructor(principalId, context, event) {
    /**
     * At this point the principalId is validated
     * @type {string}
     */
    this.principalId = principalId;

    /**
     * Lets keep an object reference to the event
     * @type {object}
     */
    this.event = event;

    /**
     *  The AWS accountId was retrieved from lambda event
     *  @type {string}
     */
    this.accountId = this.retrieveAccountId();

    /**
     * Which appids/resources this authorizer manages
     * @type {ResourceGroupModule}
     */
    this.resourceGroup = new ResourceGroup();

    /**
     * The AWS region, i.e. us-west-2, retrieved from lambda event
     * @type {string}
     */
    this.region = this.retrieveRegion();

    /**
     * Policy version used for the evaluation. Should always be "2012-10-17"
     * @type {string}
     * @default "2012-10-17"
     */
    this.version = '2012-10-17';

    /**
     * For now, we are only going to invoke apis.
     * Perhaps later this will be expanded upon.
     * @type {string}
     */
    this.action = 'execute-api:Invoke';

    /**
     * Allow or Deny access to the resource
     * @type {{ALLOW: string, DENY: string}}
     */
    this.effect = {
      ALLOW: 'ALLOW',
      DENY: 'DENY'
    };
  }

  build() {
    const policy = {
      policyDocument: {}
    };

    policy.policyDocument.Version = this.version;
    policy.policyDocument.Statement = new Array({});

    if (this.principalId && this.verifyResource()) {
      policy.principalId = this.principalId;
      policy.policyDocument.Statement[0].Effect = this.effect.ALLOW;
    } else {
      policy.principalId = '';
      policy.policyDocument.Statement[0].Effect = this.effect.DENY;
    }

    policy.policyDocument.Statement[0].Action = this.action;
    policy.policyDocument.Statement[0].Resource = this.constructArns();

    return policy;
  }

  /**
   * Is the requested resource in the
   * ResourceGroup this authorizer manages?
   * @type boolean
   */
  verifyResource() {
    let match = false;

    if (this.event) {
      const requestedApiId = this.event.methodArn
        .split(':')[5]
        .split('/')[0];

      const apiIds = this.resourceGroup.apiIds;

      apiIds.forEach((apiId) => {
        if (apiId.api_name === requestedApiId) {
          match = true;
        }
      });
    }
    return match;
  }


  /**
   * Below are all the helper functions to build the policy
   * @constructArn()
   * @retrieveAccountId(event)
   * @retrieveRegion(event)
   */

  /**
   * Let's grab the AWS Account Id for Policy Building
   * @returns {string} or {false}
   */
  retrieveAccountId() {
    if (this.event) {
      const methodArnArray = this.event.methodArn.split(':');
      return methodArnArray[4];
    }
    return false;
  }

  /**
   * Let's grab the AWS region for Policy Building
   * @param event
   * @returns {*}
   */
  retrieveRegion() {
    if (this.event) {
      const methodArnArray = this.event.methodArn.split(':');
      return methodArnArray[3];
    }
    return false;
  }

  /**
   * Construct an arn for which the policy affects
   * Example is: arn:aws:execute-api:us-west-2:<accountId>:kvmxspwm7g/<stage>/GET/
   * Format: arn:aws:execute-api:<regionId>:<accountId>:<appId>/<stage>/<httpVerb>/[<resource>/<httpVerb>/[...]]"
   */
  constructArns() {
    const Resource = [];

    if (this.event) {
      const arn = this.event.methodArn;
      logger.info(`The arn which was passed in via the event is: ${arn}`);
      Resource.push(arn.trim());
    } else {
      const colonDelimiter = ':';
      const slashDelimiter = '/';
      const apiIds = this.resourceGroup.apiIds;

      apiIds.forEach((apiId) => {
        logger.info(`apiId is ${JSON.stringify(apiId)}`);
        const arn = 'arn:aws:execute-api:'
          .concat(this.region)
          .concat(colonDelimiter)
          .concat(this.accountId)
          .concat(colonDelimiter)
          .concat(apiId.api_name)
          .concat(slashDelimiter)
          .concat(apiId.phase)
          .concat(slashDelimiter)
          .concat(apiId.verb)
          .concat(slashDelimiter);

        if (apiId.resource) {
          arn.concat(apiId.resource);
        }

        Resource.push(arn.trim());
      });
    }
    return Resource;
  }
}

module.exports = PolicyBuilderModule;

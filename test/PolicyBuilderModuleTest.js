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
const assert = require('chai').assert;
const PolicyBuilder = require('../lib/PolicyBuilderModule');

/**
 * A legit policy needs to be like so:
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
 *                 "arn:aws:execute-api:<regionId>:<accountId>:<appId>/<stage>/<httpVerb>/[<resource>/<httpVerb>/[...]]"
 *               ]
 *           }
 *           ]
 *      }
 *   }
 */
describe('PolicyBuilder Unit Tests', () => {
  const testPrincipalId = 'jenkypenky@gmail.com';
  const context = {};
  const event = {
    type: 'TOKEN',
    authorizationToken: 'fooToken',
    methodArn: 'arn:aws:execute-api:us-west-2:420465592407:0h00jda672/*/GET/null'
  };

  const effect = {
    ALLOW: 'ALLOW',
    DENY: 'DENY'
  };

  it('PolicyBuilder should have version of 2012-10-17', () => {
    const policyBuilder = new PolicyBuilder(testPrincipalId, context, event);
    const policy = policyBuilder.build();
    assert(policy.policyDocument.Version === '2012-10-17');
  });

  it('PolicyBuilder.retrieveAccountId() should return an accountId', () => {
    const policyBuilder = new PolicyBuilder(testPrincipalId, context, event);
    assert(policyBuilder.retrieveAccountId() === '420465592407');
  });

  it('PolicyBuilder.retrieveAccountId() returns false when receives undefined', () => {
    const policyBuilder = new PolicyBuilder(testPrincipalId, null, null);
    assert(policyBuilder.retrieveAccountId() === false);
  });

  it('PolicyBuilder.retrieveRegion() should return regionId', () => {
    const policyBuilder = new PolicyBuilder(testPrincipalId, context, event);
    assert(policyBuilder.retrieveRegion(event) === 'us-west-2');
  });

  it('PolicyBuilder.retrieveRegion() returns falsey when receives undefined', () => {
    const policyBuilder = new PolicyBuilder(testPrincipalId, context);
    assert(policyBuilder.retrieveRegion() === false);
  });

  it('PolicyBuilder should create deny policy if null principalId', () => {
    const policyBuilder = new PolicyBuilder(null, context, event);
    const policy = policyBuilder.build();
    assert(policy.policyDocument.Statement[0].Effect === effect.DENY);
  });
});

/**
 * Created by beezus on 9/3/16.
 */
'use strict';
const assert = require('chai').assert;
const sinon = require('sinon');
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

    var testPrincipalId = "jenkypenky@gmail.com";
    var context = {};
    var event = {
        type: 'TOKEN',
        authorizationToken: 'fooToken',
        methodArn: 'arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>'
    };

    it('PolicyBuilder should have version of 2012-10-17', () => {
        console.info("Policy Tests Running");
        var policyBuilder = new PolicyBuilder(testPrincipalId, context, event);
        var policy = policyBuilder.build();
        console.info('did we build a policy? huh? HUH?');
    });

    it('PolicyBuilder.retrieveAccountId() should return an accountId', () => {
        var policyBuilder = new PolicyBuilder(testPrincipalId, context, event);
        assert('<accountId>' === policyBuilder.retrieveAccountId(event));
    });

    it('PolicyBuilder.retrieveRegion() returns falsey when receives undefined', () => {
        var policyBuilder = new PolicyBuilder(testPrincipalId, context);
        assert( false === policyBuilder.retrieveRegion());
    });
});

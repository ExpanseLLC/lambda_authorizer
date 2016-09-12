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

    var testPrincipalId = 'jenkypenky@gmail.com';
    var context = {};
    var event = {
        type: 'TOKEN',
        authorizationToken: 'fooToken',
        methodArn: 'arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>'
    };

    var effect = {
        ALLOW : 'ALLOW',
        DENY : 'DENY'
    };

    it('PolicyBuilder should have version of 2012-10-17', () => {
        var policyBuilder = new PolicyBuilder(testPrincipalId, context, event);
        var policy = policyBuilder.build();
    });

    it('PolicyBuilder.retrieveAccountId() should return an accountId', () => {
        var policyBuilder = new PolicyBuilder(testPrincipalId, context, event);
        assert('<accountId>' === policyBuilder.retrieveAccountId(event));
    });

    it('PolicyBuilder.retrieveAccountId() returns false when receives undefined', () => {
        var policyBuilder = new PolicyBuilder(testPrincipalId, context);
        assert(false === policyBuilder.retrieveAccountId());
    });

    it('PolicyBuilder.retrieveRegion() should return regionId', () => {
        var policyBuilder = new PolicyBuilder(testPrincipalId, context, event);
        assert('<regionId>' === policyBuilder.retrieveRegion(event));
    });

    it('PolicyBuilder.retrieveRegion() returns falsey when receives undefined', () => {
        var policyBuilder = new PolicyBuilder(testPrincipalId, context);
        assert( false === policyBuilder.retrieveRegion());
    });

    it('PolicyBuilder should create deny policy if null principalId', () => {
        var policyBuilder = new PolicyBuilder(null, context, event);
        var policy = policyBuilder.build();
        assert( effect.DENY === policy.policyDocument.Effect );
    });
});

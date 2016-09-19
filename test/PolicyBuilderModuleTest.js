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
        methodArn: 'arn:aws:execute-api:us-west-2:420465592407:0h00jda672/*/GET/null'
    };

    var effect = {
        ALLOW : 'ALLOW',
        DENY : 'DENY'
    };

    /**
     * This policy was confirmed in Amazon's Policy Simulator:
     * https://policysim.aws.amazon.com/home/index.jsp?#
     * @type {{Version: string, Statement: *[]}}
     */
    var goodPolicy = {
        Version: '2012-10-17',
        Statement: [
            {
                Effect: 'ALLOW',
                Action: 'execute-api:Invoke',
                Resource: [
                    'arn:aws:execute-api:us-west-2:420465592407:0h00jda672/*/GET/'
                ]
            }
        ]
    };
    var goodArn = 'arn:aws:execute-api:us-west-2:420465592407:0h00jda672/*/GET/';

    var api_id = {
        api_name: '0h00jda672',
        description: 'LambdaMicroservice',
        verb: 'GET',
        phase: '*',  //all stages for now
        resource: 'null'
    };

    it('PolicyBuilder should have version of 2012-10-17', () => {
        var policyBuilder = new PolicyBuilder(testPrincipalId, context, event);
        var policy = policyBuilder.build();
    });

    it('PolicyBuilder.retrieveAccountId() should return an accountId', () => {
        var policyBuilder = new PolicyBuilder(testPrincipalId, context, event);
        assert('420465592407' === policyBuilder.retrieveAccountId());
    });

    it('PolicyBuilder.retrieveAccountId() returns false when receives undefined', () => {
        var policyBuilder = new PolicyBuilder(testPrincipalId, null, null);
        assert(false === policyBuilder.retrieveAccountId());
    });

    it('PolicyBuilder.retrieveRegion() should return regionId', () => {
        var policyBuilder = new PolicyBuilder(testPrincipalId, context, event);
        assert('us-west-2' === policyBuilder.retrieveRegion(event));
    });

    it('PolicyBuilder.retrieveRegion() returns falsey when receives undefined', () => {
        var policyBuilder = new PolicyBuilder(testPrincipalId, context);
        assert( false === policyBuilder.retrieveRegion());
    });

    it('PolicyBuilder should create deny policy if null principalId', () => {
        var policyBuilder = new PolicyBuilder(null, context, event);
        var policy = policyBuilder.build();
        assert( effect.DENY === policy.policyDocument.Statement[0].Effect );
    });
});

/**
 * Created by beezus on 8/31/16.
 */
'use strict';
const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const AuthorizerModule= require('../lib/AuthorizerModule');

var event = {
    type: 'TOKEN',
    authorizationToken: 'fooToken',
    methodArn: 'arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>'
    };

var context = {};

var accountId = '<accountId>';
var googPrincipalId = "jenkypenky@gmail.com";
var fbPrincipalId = "jenkypenky@facebook.com";
var amznPrincipalId = "jenkypenky@amazon.com";
var idProviderFunction = 'callIdProvider';


/**
 * TODO refactor to test promises contract
 */
describe('Authorizer Unit Tests on authorize()', () => {

    var buildPolicySpy = null;
    var authMod = new AuthorizerModule();

    beforeEach('reset the spy', () => {
        buildPolicySpy = sinon.spy(authMod, 'buildPolicy');
    });

    /** google token success test **/
    it('Authorizer authorize() flow should not call facebook or amazon id providers', () => {
        var stubPromise = new Promise(
            (resolve, reject) => {
                resolve(googPrincipalId);
            }
        );
        sinon.stub(authMod.googleMod, idProviderFunction, () => { return stubPromise; });

        return authMod.authorize(event, context)
            .then( result => {
                    assert(buildPolicySpy.called);
            });
    });

    afterEach(() => {
        buildPolicySpy.restore();
    });
});

// describe('Authorizer Unit Tests on buildPolicy()', () => {
//
//     var authMod = new AuthorizerModule();
//
//     it('Resulting tests from Authorizer buildPolicy()');
//
// });

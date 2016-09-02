/**
 * Created by beezus on 8/31/16.
 */
'use strict';
const assert = require('chai').assert;
const sinon = require('sinon');
const AuthorizerModule= require('../lib/AuthorizerModule');

var event = {
    type: 'TOKEN',
    authorizationToken: 'fooToken',
    methodArn: 'arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>'
    };

var context = {};
var googPrincipalId = "jenkypenky@gmail.com";
var fbPrincipalId = "jenkypenky@facebook.com";
var amznPrincipalId = "jenkypenky@amazon.com";
var idProviderFunction = 'callIdProvider';
var buildPolicySpy;

/**
 * If the IdProviderCaller (i.e. googleMod, fbMod, amznMod) are not stubbed they will return 0,
 * or unsuccessful result.
 * Stubs return success results.
 */
describe('Authorizer Unit Tests on authorize()', () => {

    var authMod = new AuthorizerModule();

    beforeEach('reset the spy', () => {
        buildPolicySpy = sinon.spy(authMod, 'buildPolicy');
    });

    /** google token success test **/
    it('Authorizer authorize() flow should not call facebook or amazon id providers', () => {
        sinon.stub(authMod.googleMod, idProviderFunction, () => { return googPrincipalId; });
        authMod.authorize(event, context);
        assert(buildPolicySpy.called);
        assert(buildPolicySpy.calledWith(googPrincipalId));
        assert(buildPolicySpy.neverCalledWith(fbPrincipalId));
        assert(buildPolicySpy.neverCalledWith(amznPrincipalId));
        authMod.googleMod.callIdProvider.restore();
    });

    /** facebook token success test **/
    it('Authorizer authorize() flow should not call google or amazon id providers', () => {
        sinon.stub(authMod.facebookMod, idProviderFunction, () => { return fbPrincipalId; });
        authMod.authorize(event, context);
        assert(buildPolicySpy.called);
        assert(buildPolicySpy.calledWith(fbPrincipalId));
        assert(buildPolicySpy.neverCalledWith(googPrincipalId));
        assert(buildPolicySpy.neverCalledWith(amznPrincipalId));
        authMod.facebookMod.callIdProvider.restore();
    });

    /** amazon token success test **/
    it('Authorizer authorize() flow should not call google or facebook id providers', () => {
        sinon.stub(authMod.amznMod, idProviderFunction, () => { return amznPrincipalId; });
        authMod.authorize(event, context);
        assert(buildPolicySpy.called);
        assert(buildPolicySpy.calledWith(amznPrincipalId));
        assert(buildPolicySpy.neverCalledWith(googPrincipalId));
        assert(buildPolicySpy.neverCalledWith(fbPrincipalId));
        authMod.amznMod.callIdProvider.restore();
    });

    afterEach(() => {
        buildPolicySpy.restore();
    });
});

describe('Authorizer Unit Tests on buildPolicy()', () => {

    var authMod = new AuthorizerModule();

});

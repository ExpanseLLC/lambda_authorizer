/**
 * Created by beezus on 8/31/16.
 */
'use strict'
const assert = require('chai').assert;
const sinon = require('sinon');
const AuthorizerModule= require('../lib/AuthorizerModule');
var authMod = new AuthorizerModule();

var event = {
    type: 'TOKEN',
    authorizationToken: 'fooToken',
    methodArn: 'arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>'
    };

var context = {};
var googPrincipalId = "jenkypenky@gmail.com";
var fbPrincipalId = "jenky@facebook.com";
var amznPrincipalId = "jenkypenky@amazon.com";
var idProviderFunction = 'callIdProvider';
var buildPolicySpy;

describe('Authorizer Unit Tests on authorize()', () => {
    before('setup', () => {
        console.info("Configuring Stubs");
        sinon.stub(authMod.googleMod, idProviderFunction, () => { return googPrincipalId; });
        sinon.stub(authMod.facebookMod, idProviderFunction, () => { return fbPrincipalId; });
        sinon.stub(authMod.amznMod, idProviderFunction, () => { return amznPrincipalId; });
    });

    beforeEach('reset the spy', () => {
        buildPolicySpy = sinon.spy(authMod, 'buildPolicy');
    });

    it('Authorizer authorize() flow should not call facebook or amazon id providers', () => {
        authMod.authorize(event, context);
        assert(buildPolicySpy.called);
        assert(buildPolicySpy.calledWith(googPrincipalId));
        assert(buildPolicySpy.neverCalledWith(fbPrincipalId));
        assert(buildPolicySpy.neverCalledWith(amznPrincipalId));
    });

    it('Authorizer authorize() flow should not call google or amazon id providers', () => {
        authMod.googleMod.callIdProvider.restore();
        authMod.authorize(event, context);
        assert(buildPolicySpy.called);
        assert(buildPolicySpy.calledWith(fbPrincipalId));
        assert(buildPolicySpy.neverCalledWith(googPrincipalId));
        assert(buildPolicySpy.neverCalledWith(amznPrincipalId));
    });

    it('Authorizer authorize() flow should not call google or facebook id providers', () => {
        authMod.facebookMod.callIdProvider.restore();
        authMod.authorize(event, context);
        assert(buildPolicySpy.called);
        assert(buildPolicySpy.calledWith(amznPrincipalId));
        assert(buildPolicySpy.neverCalledWith(googPrincipalId));
        assert(buildPolicySpy.neverCalledWith(fbPrincipalId));
    });

    afterEach(() => {
        buildPolicySpy.restore();
    });
});

/**
 * Mock objects are used to define expectations i.e: In this scenario I expect method A() to be called with such
 * and such parameters. Mocks record and verify such expectations.
 *
 * Stubs, on the other hand have a different purpose: they do not record or verify expectations,
 * but rather allow us to “replace” the behavior, state of the “fake”object in order to utilize a test scenario
 */
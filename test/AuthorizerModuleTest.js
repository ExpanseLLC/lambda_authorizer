/**
 * Created by beezus on 8/31/16.
 */
'use strict'
const assert = require('chai').assert;
const sinon = require('sinon');
const td = require('testdouble');
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
        console.info("Stubs are Setting Up");
        sinon.stub(authMod.googleMod, idProviderFunction, () => { return googPrincipalId; });
        sinon.stub(authMod.facebookMod, idProviderFunction, () => { return fbPrincipalId; });
        sinon.stub(authMod.amznMod, idProviderFunction, () => { return amznPrincipalId; });

        // set up a spy for authMod.buildPolicy()
        buildPolicySpy = sinon.spy(authMod, 'buildPolicy');
    });

    it('Authorizer authorize() flow in this case should never use facebook or amazon id providers', () => {
        authMod.authorize(event, context);
        assert(buildPolicySpy.called);
        assert(buildPolicySpy.neverCalledWith(fbPrincipalId));
        assert(buildPolicySpy.neverCalledWith(amznPrincipalId));
    });

    it('Authorizer authorize() flow in this case should never use google or amazon id providers', () => {
        authMod.googleMod.restore();
        authMod.authorize(event, context);
        assert(buildPolicySpy.called);
        assert(buildPolicySpy.neverCalledWith(googPrincipalId));
        assert(buildPolicySpy.neverCalledWith(amznPrincipalId));
    });

    // it('authorizer should run', () => {
    //     authMod.buildPolicy("foo@gmail.com");
    // });

    afterEach(() => {
        buildPolicySpy.called = false;
    });

    after('Run after each test', () => {
        console.info("Cleaning up after each method . . . ");
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
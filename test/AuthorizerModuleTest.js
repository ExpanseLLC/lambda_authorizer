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
const expect = require('chai').expect;
const sinon = require('sinon');
const AuthorizerModule = require('../lib/AuthorizerModule');

const event = {
  type: 'TOKEN',
  authorizationToken: 'fooToken',
  methodArn: 'arn:aws:execute-api:us-west-2:123456789012:0h00jda672/*/GET/'
};

const context = {};
const googPrincipalId = 'jenkypenky@gmail.com';
const fbPrincipalId = 'jenkypenky@facebook.com';
const amznPrincipalId = 'jenkypenky@amazon.com';
const idProviderFunction = 'callIdProvider';
const badPromise = new Promise((resolve) => {
  resolve(0);
});

describe('Authorizer Unit Tests on authorize()', () => {
  let sandbox;
  let buildPolicySpy = null;
  const authMod = new AuthorizerModule();

  beforeEach('reset the spy', () => {
    sandbox = sinon.sandbox.create();

    buildPolicySpy = sandbox.spy(authMod, 'buildPolicy');
  });

  it('Authorizer authorize() flow with valid Google', () => {
    const goodPromise = new Promise((resolve) => {
      resolve(googPrincipalId);
    });

    sandbox.stub(authMod.googleMod, idProviderFunction, () => goodPromise);
    sandbox.stub(authMod.amznMod, idProviderFunction, () => badPromise);
    sandbox.stub(authMod.facebookMod, idProviderFunction, () => badPromise);

    return authMod.authorize(event, context)
      .then((result) => {
        assert(buildPolicySpy.called);

        expect(result.principalId).to.equal(googPrincipalId);
      });
  });

  it('Authorizer authorize() flow with valid Amazon', () => {
    const goodPromise = new Promise((resolve) => {
      resolve(amznPrincipalId);
    });

    sandbox.stub(authMod.googleMod, idProviderFunction, () => badPromise);
    sandbox.stub(authMod.amznMod, idProviderFunction, () => goodPromise);
    sandbox.stub(authMod.facebookMod, idProviderFunction, () => badPromise);

    return authMod.authorize(event, context)
      .then((result) => {
        assert(buildPolicySpy.called);

        expect(result.principalId).to.equal(amznPrincipalId);
      });
  });

  // TODO enable when Facebook is working
  xit('Authorizer authorize() flow with valid Facebook', () => {
    const goodPromise = new Promise((resolve) => {
      resolve(fbPrincipalId);
    });

    sandbox.stub(authMod.googleMod, idProviderFunction, () => badPromise);
    sandbox.stub(authMod.amznMod, idProviderFunction, () => badPromise);
    sandbox.stub(authMod.facebookMod, idProviderFunction, () => goodPromise);

    return authMod.authorize(event, context)
      .then((result) => {
        assert(buildPolicySpy.called);

        expect(result.principalId).to.equal(fbPrincipalId);
      });
  });

  afterEach(() => {
    buildPolicySpy.restore();
    sandbox.restore();
  });
});

/**
 * Created by beezus on 8/31/16.
 */
'use strict'
const expect = require('chai').expect;
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

var googleModStub = {
    callIdProvider() {
        return "eb@gmail.com";
    }
};

describe('authorizer unit tests', () => {
    before('setup', () => {
        console.info("who knows");
    });

    it('authorizer should run', () => {

        authMod.buildPolicy("foo@gmail.com");
    });
});

/**
 * Mock objects are used to define expectations i.e: In this scenario I expect method A() to be called with such
 * and such parameters. Mocks record and verify such expectations.
 *
 * Stubs, on the other hand have a different purpose: they do not record or verify expectations,
 * but rather allow us to “replace” the behavior, state of the “fake”object in order to utilize a test scenario
 */
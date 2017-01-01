/*!
 * Expanse, LLC
 * http://expansellc.io
 *
 * Copyright 2016
 * Released under the Apache 2 license
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * @authors Ryan Scott
 */
'use strict';
const expect = require('chai').expect;
const nock = require('nock');
const ProviderConfig = require('../config/ProviderConfig');
const FacebookIdModule = require('../lib/FacebookIdModule');

describe('FacebookIdModule Unit Tests', () => {
  const faceMod = new FacebookIdModule(new ProviderConfig());
  const goodToken = 'good';
  const invalidToken = 'invalid';
  const expectedPrincipalId = 'jenkypenky@facebook.com';
  const validFacePayload = '{"data": {"app_id": "application.identifier","application": "ExpanseIO Test App","expires_at": 1473112800,"is_valid": true,"scopes": ["email","public_profile"],"user_id": "jenkypenky@facebook.com"}}';

  const invalidFacePayload = {
    error_description: 'Mock Invalid Value'
  };

  /** see this projects README for the Facebook Token Contract **/
  it('Mock 200 Response from Facebook Token API to FacebookIdModule', () => {
    nock('https://graph.facebook.com')
      .get('/debug_token')
      .query({
        input_token: goodToken,
        access_token: 'APPID_REPLACE_ME|SECRET_SSHHH'
      })
      .reply(200, validFacePayload);

    const result = faceMod.callIdProvider(goodToken);
    return result.then(data => {
      expect(data).to.equal(expectedPrincipalId);
    });
  });

  it('Mock 400 Response from Facebook Token API to FacebookIdModule', () => {
    nock('https://graph.facebook.com')
      .get('/debug_token')
      .query({
        input_token: invalidToken,
        access_token: 'APPID_REPLACE_ME|SECRET_SSHHH'
      })
      .reply(400, invalidFacePayload);

    const result = faceMod.callIdProvider(invalidToken);
    return result.catch(error => {
      expect(error).to.equal(0);
    });
  });

  it('A PrincipalId Should Be Derived from the Facebook Token Response', () => {
    const principalId = FacebookIdModule.retrievePrincipalId(validFacePayload);
    expect(principalId).to.equal(expectedPrincipalId);
  });
});

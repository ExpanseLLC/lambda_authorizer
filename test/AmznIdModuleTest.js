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
const AmznIdModule = require('../lib/AmznIdModule');

describe('AmznIdModule Unit Tests', () => {
  const amznMod = new AmznIdModule();
  const goodToken = 'good';
  const invalidToken = 'invalid';
  const expectedPrincipalId = 'jenkypenky@gmail.com';
  const validTokenPayload = '{"app_id": "amzn1.application.identifier","aud": "amzn1.application-oa2-client.identifier","exp": 818,"iat": 1475349936,"iss": "https://www.amazon.com","user_id": "amzn1.account.identifier"}';
  const invalidTokenPayload = '{"error_description": "Invalid mock value"}';
  const validProfilePayload = '{"email": "jenkypenky@gmail.com","name": "Jenky Penky","user_id": "amzn1.account.identifier"}';
  const invalidProfilePayload = '{"error_description": "Invalid mock value"}';

  it('Mock 200 response for both token and profile APIs', () => {
    nock('https://api.amazon.com')
      .get('/auth/o2/tokeninfo')
      .query({
        access_token: goodToken
      })
      .reply(200, validTokenPayload);

    nock('https://api.amazon.com', {
      reqheaders: {
        Authorization: 'Bearer '.concat(goodToken)
      }
    })
      .get('/user/profile')
      .reply(200, validProfilePayload);

    return amznMod.callIdProvider(goodToken)
      .then(data => {
        expect(data).to.equal(expectedPrincipalId);

        nock.cleanAll();
      });
  });

  it('Mock 400 response from token API to AmznIdModule', () => {
    nock('https://api.amazon.com')
      .get('/auth/o2/tokeninfo')
      .query({
        access_token: invalidToken
      })
      .reply(400, invalidTokenPayload);

    nock('https://api.amazon.com', {
      reqheaders: {
        Authorization: 'Bearer '.concat(invalidToken)
      }
    })
      .get('/user/profile')
      .reply(400, invalidProfilePayload);

    return amznMod.callIdProvider(invalidToken)
      .catch(error => {
        expect(error).to.equal(0);

        nock.cleanAll();
      });
  });

  it('A principalId should be derived from the token response', () => {
    const principalId = AmznIdModule.retrievePrincipalId(validProfilePayload);

    expect(principalId).to.equal(expectedPrincipalId);
  });
});

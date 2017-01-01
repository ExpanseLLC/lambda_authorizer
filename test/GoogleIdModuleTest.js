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
const expect = require('chai').expect;
const nock = require('nock');
const ProviderConfig = require('../config/ProviderConfig');
const GoogleIdModule = require('../lib/GoogleIdModule');

describe('GoogleIdModule Unit Tests', () => {
  const googMod = new GoogleIdModule(new ProviderConfig());
  const goodToken = 'good';
  const invalidToken = 'invalid';
  const expectedPrincipalId = 'jenkypenky@gmail.com';
  const validGoogPayload = '{"iss":"accounts.google.com","at_hash":"Tyxxxxx_xxx-xxxxxxx","aud":"mockClientId.apps.googleusercontent.com","sub":"xxxxx2166xxxxxxxxxxxx","email_verified":"true","azp":"blah-blah.apps.googleusercontent.com","email":"jenkypenky@gmail.com","iat":"1xxxxxxxx6","exp":"1xxxxxxxx6","name":"Jenkins","picture":"https://lh3.googleusercontent.com/jenkins/photo.jpg","given_name":"Jenky","family_name":"Penky","locale":"en","alg":"RS256","kid":"a3225a704cfoobarxxxxxxce1c8612b"}';

  const invalidGoogPayload = {
    error_description: 'Mock Invalid Value'
  };

  /** see this projects README for the Google Token Contract **/
  it('Mock 200 Response from Google Token API to GoogleIdModule', () => {
    nock('https://www.googleapis.com')
      .get('/oauth2/v3/tokeninfo')
      .query({
        id_token: goodToken
      })
      .reply(200, validGoogPayload);

    const result = googMod.callIdProvider(goodToken);
    return result.then(data => {
      expect(data).to.equal(expectedPrincipalId);
    });
  });

  it('Mock 400 Response from Google Token API to GoogleIdModule', () => {
    nock('https://www.googleapis.com')
      .get('/oauth2/v3/tokeninfo')
      .query({
        id_token: invalidToken
      })
      .reply(400, invalidGoogPayload);

    const result = googMod.callIdProvider(invalidToken);
    return result.catch(error => {
      expect(error).to.equal(0);
    });
  });

  it('A PrincipalId Should Be Derived from the Google Token Response', () => {
    const principalId = GoogleIdModule.retrievePrincipalId(validGoogPayload);
    expect(principalId).to.equal(expectedPrincipalId);
  });
});

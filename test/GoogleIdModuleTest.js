/**
 * Created by beezus on 9/5/16.
 */
'use strict';
const assert = require('chai').assert;
const sinon = require('sinon');
const GoogleIdModule = require('../lib/GoogleIdModule');

describe('GoogleIdModule Unit Tests', () => {

    var googMod = new GoogleIdModule();
    var expectedPrincipalId = 'jenkypenky@gmail.com';
    var validGoogPayload = {
        "iss": "accounts.google.com",
        "at_hash": "Tyxxxxx_xxx-xxxxxxx",
        "aud": "mockClientId.apps.googleusercontent.com",  //clientId proving call was made from our app
        "sub": "xxxxx2166xxxxxxxxxxxx",
        "email_verified": "true",
        "azp": "blah-blah.apps.googleusercontent.com",
        "email": "jenkypenky@gmail.com",
        "iat": "1xxxxxxxx6",
        "exp": "1xxxxxxxx6",
        "name": "Jenkins",
        "picture": "https://lh3.googleusercontent.com/jenkins/photo.jpg",
        "given_name": "Jenky",
        "family_name": "Penky",
        "locale": "en",
        "alg": "RS256",
        "kid": "a3225a704cfoobarxxxxxxce1c8612b"
    };

    it('A PrincipalId Should Be Derived from the Google Token Response', () => {
        googMod.retrievePrincipalId(validGoogPayload);
    });
});
/**
 * Created by beezus on 9/5/16.
 */
'use strict';
const assert = require('chai').assert;
const sinon = require('sinon');
const nock = require('nock');
const GoogleIdModule = require('../lib/GoogleIdModule');

describe('GoogleIdModule Unit Tests', () => {

    var googMod = new GoogleIdModule();
    var goodToken = 'good';

    var realToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg0Y2M5MzNmMDM1YjYyNjllNjgzZWUyMTVlOGVhM2Q4MTE2NGIxODkifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXRfaGFzaCI6Inl0Z2pJR2NBWWMxdHJ4amJLX0U0ZFEiLCJhdWQiOiI0NjEyMzY1NDU0NTAtNDhidXFjMmptMjBqZDIzMmhiOGo0ZHM5YmN1ZmdwNjUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTI2MTY2NTYxNDk1MTQ4OTc2NzEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiNDYxMjM2NTQ1NDUwLTQ4YnVxYzJqbTIwamQyMzJoYjhqNGRzOWJjdWZncDY1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiZW1haWwiOiJlcmlja3Nvbi5tZWdoYW5AZ21haWwuY29tIiwiaWF0IjoxNDczMjc4NTUwLCJleHAiOjE0NzMyODIxNTAsIm5hbWUiOiJNLiBMLkUuIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8tdlF4OXYtWG9lazAvQUFBQUFBQUFBQUkvQUFBQUFBQUFNeFkvTXdGU05qbmtZYnMvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6Ik0uIiwiZmFtaWx5X25hbWUiOiJMLkUuIiwibG9jYWxlIjoiZW4ifQ.lnDGnO376xuvlK7CjNhS9Gk1eklGDIwc4VC6fA_u2FzVdH7zV1iYiLYdna5rq59o9Me1VC6gGC4FU-FHMxQWEMjr7wC-YOfbOEnOSF8GiP_3NiMkpfkuSsIQOqaHxnjWe8PHLJHPkDrDL3xk0zwSxzyhdg-3b0oCGd9XK1C7dnK5mOYkSzAvLuyi0tKiGFgZiQUCV26e8L2-XA0IYIO1pji3j_wV7ijvJqDzQv7pOMAimzLtHpJ4DhdXItjvjxglK_CZVhQyN241cIeAQFqKvmT84Z7_2pJRO6GcXu9CDbRPStIwxaR8wXuwI6DKYDyMQYfSn_uDD15rUVXA0DMuVA';


    var invalidToken = 'invalid';
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
    
    var invalidGoogPayload = {"error_description": "Mock Invalid Value"};

    /** see this projects README for the Google Token Contract **/
    it('Mock 200 Response from Google Token API to GoogleIdModule', (done) => {
        nock('https://www.googleapis.com')
            .get('/oauth2/v3/tokeninfo')
            .query({id_token: goodToken})
            .reply(200, validGoogPayload);

        var result = googMod.callIdProvider(goodToken);
        result.then((data) => {
            expect(data).to.equal(expectedPrincipalId);
            done();
        });
    });

    it('Mock 400 Response from Google Token API to GoogleIdModule', (done) => {
        nock('https://www.googleapis.com')
            .get('/oauth2/v3/tokeninfo')
            .query({id_token: invalidToken})
            .reply(400, invalidGoogPayload);

        var result = googMod.callIdProvider(invalidToken);
        result.catch(error => {
            expect(error).to.equal(0);
            done();
        });
    });

    it('A PrincipalId Should Be Derived from the Google Token Response', () => {
        googMod.retrievePrincipalId(validGoogPayload);
    });
});
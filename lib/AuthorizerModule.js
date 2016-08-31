/**
 * Created by beezus on 8/25/16.
 */
'use strict';
const https = require('https');
const GoogleIdModule = require('./GoogleIdModule');
const FacebookIdModule = require('./FacebookIdModule');

const googleMod = new GoogleIdModule();
const facebookMod = new FacebookIdModule();

class AuthorizerModule {

    authorize(event, context) {

        console.log('Client token: ' + event.authorizationToken);
        console.log('Method ARN: ' + event.methodArn);

        var principalId = googleMod.callIdProvider(event.authorizationToken);
        return { success: true };
    }
}

module.exports = AuthorizerModule;
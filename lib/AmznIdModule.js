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
const https = require('https');

/**
 *  This class setups and makes the API Call to Amazon to retrieve
 *  a principalId for the authorizer.
 *  TODO: Update the README with AMZN's Contract
 */
class AmznIdModule {

    /**
     * TODO: Implement the below method
     * HTTP request to identity provider with supplied token.
     * If [principalId = 0] is returned, the token is invalid or the call otherwise failed.
     * @param token
     * @returns principalId
     */
    callIdProvider(token) {
        var principalId = 0;
        return principalId;
    }
}

var identityProvider = {
    AMAZON: {}
}

module.exports = AmznIdModule;
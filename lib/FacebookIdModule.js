/**
 * Created by beezus on 8/31/16.
 */
'use strict';
const https = require('https');

/**
 *  This class setups and makes the API Call to Facebook to retrieve
 *  a principalId for the authorizer.
 *  TODO: Update the README with FB's Contract
 */
class FacebookIdModule {

    /**
     * TODO: Implement the below method
     * HTTP request to identity provider with supplied token.
     * If [principalId = -1] is returned, the token is invalid.
     * @param token
     * @returns principalId
     */
    callIdProvider(token) {
        var principalId = -1;
        return principalId;
    }
}

module.exports = FacebookIdModule;
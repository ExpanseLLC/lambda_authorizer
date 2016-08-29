/**
 * Created by beezus on 8/25/16.
 */
'use strict';

class AuthorizerModule {

    authorize() {
        return { success: true };
    }
}

module.exports = AuthorizerModule;
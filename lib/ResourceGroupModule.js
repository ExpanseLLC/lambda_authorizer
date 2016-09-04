/**
 * Created by beezus on 9/3/16.
 */
'use strict';

/**
 * Each Authorizer gates a resource group
 * A ResourceGroup is a list of appids used to construct the arns placed in the ApiGateway policy
 * Later these could be ported into JSON files in S3 or stored in an external datastore
 */
class ResourceGroupModule {

    constructor() {
        /**
         * For testing, I configured a lamda proxy to Google
         * @type {{GOOGLE_PROXY: string}}
         */
        this.group = {
            GOOGLE_PROXY_APPID : "kvmxspwm7g"
        };
    }
}

module.exports = ResourceGroupModule;
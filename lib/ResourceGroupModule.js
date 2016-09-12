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
         * Existing HTTP verbs supported by API Gateway. This property is here
         * only to avoid spelling mistakes in the policy.
         *
         * @property HttpVerb
         * @type {Object}
         */
        this.httpVerb = {
            GET     : "GET",
            POST    : "POST",
            PUT     : "PUT",
            PATCH   : "PATCH",
            HEAD    : "HEAD",
            DELETE  : "DELETE",
            OPTIONS : "OPTIONS",
            ALL     : "*"
        };

        /**
         * For testing, I configured a lamda proxy to Google
         * @type {{GOOGLE_PROXY: string}}
         */
        this.api_ids = [
                { 
                    api_name: "kvmxspwm7g", 
                    description: "GOOGLE_PROXY",
                    verb: this.httpVerb.GET,
                    phase: "*",  //all stages for now
                    resource: null
                }
            ];
    }
}

module.exports = ResourceGroupModule;
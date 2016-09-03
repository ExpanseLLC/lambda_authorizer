'use strict';

/**
 * 
 * This class will build a policy like below
 * The resulting policy is temporarily cached bn APIGateway & mapped to the token
 * The cached policy duration is 3600 seconds max
 *   {
 *      "principalId": "xxxxxxxx",
 *      "policyDocument": {
 *          "Version": "2012-10-17",
 *          "Statement": [
 *           {
 *               "Effect": "Allow",
 *               "Action": [
 *                   "execute-api:Invoke"
 *                ],
 *                "Resource": [
 *                 "arn:aws:execute-api:<regionId>:<accountId>:<appId>/<stage>/<httpVerb>/[<resource>/<httpVerb>/[...]]"
 *               ]
 *           }
 *           ]
 *      }
 *   }
 */
class PolicyBuilderModule {

    /**
     * Creates a new PolicyBuilder
     * @constructor
     * @param principalId - the principalId derived from Google, FB, Amzn, around which to build the policy. 
     * @param context - the lambda context from which the accountId is derived
     */
    constructor(principalId, context, accountId) {

        /**
         * At this point the principalId is validated
         * @type {string}
         */
        this.principalId = principalId;

        /**
         *  The AWS accountId is retrieved from lamda event
         *  @type {string}
         */
        this.accountId = accountId;

        /**
         * Policy version used for the evaluation. Should always be "2012-10-17"
         * @type {string}
         * @default "2012-10-17"
         */
        const version = '2012-10-17';
    }

    build() {
        var policy = {};

        if (this.principalId) {
           //build an allow
            policy.principalId = this.principalId;
        }

        return policy;
    }
}

module.exports = PolicyBuilderModule;

/**
 * A set of existing HTTP verbs supported by API Gateway. This property is here
 * only to avoid spelling mistakes in the policy.
 *
 * @property HttpVerb
 * @type {Object}
 */
// AuthPolicy.HttpVerb = {
//     GET     : "GET",
//     POST    : "POST",
//     PUT     : "PUT",
//     PATCH   : "PATCH",
//     HEAD    : "HEAD",
//     DELETE  : "DELETE",
//     OPTIONS : "OPTIONS",
//     ALL     : "*"
// };


'use strict';
const ResourceGroup = require('./ResourceGroupModule');
/**
 * 
 * This class will build a policy like below
 * The resulting policy is temporarily cached bn APIGateway & mapped to the token carried in the requests
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
     * @param context - the lambda context
     */
    constructor(principalId, context, event) {

        /**
         * At this point the principalId is validated
         * @type {string}
         */
        this.principalId = principalId;

        /**
         *  The AWS accountId was retrieved from lambda event
         *  @type {string}
         */
        this.accountId = this.retrieveAccountId(event);

        /**
         * Which appids/resources this authorizer manages
         * @type {ResourceGroupModule}
         */
        this.resourceGroup = new ResourceGroup();

        /**
         * The AWS region, i.e. us-west-2, retrieved from lambda event
         * @type {string}
         */
        this.region = this.retrieveRegion(event);

        /**
         * Policy version used for the evaluation. Should always be "2012-10-17"
         * @type {string}
         * @default "2012-10-17"
         */
        this.version = '2012-10-17';

        /**
         * For now, we are only going to invoke apis.
         * Perhaps later this will be expanded upon.
         * @type {string}
         */
        this.action = 'execute-api:Invoke';

        /**
         * For now we'll get to this point when creating ALLOW policies,
         * but in the future may need to expand to DENY policies as well. . .
         *
         * @type {{ALLOW: string, DENY: string}}
         */
        this.effect = {
            ALLOW : 'ALLOW',
            DENY  : 'DENY'
        };
    }

    build() {
        var policy = {
            policyDocument: {}
        };

        if (this.principalId) {
            policy.principalId = this.principalId;
            policy.policyDocument.Effect = this.effect.ALLOW;
        } else {
            policy.principalId = '';
            policy.policyDocument.Effect = this.effect.DENY;
        }
        
        policy.policyDocument.Version = this.version;
        policy.policyDocument.Action = this.action;
        policy.policyDocument.Resource = this.constructArns();
        
        return policy;
    }

    /**
     * Below are all the helper functions to build the policy
     * @constructArn()
     * @retrieveAccountId(event)
     * @retrieveRegion(event)
     */

    /**
     * Let's grab the AWS Account Id for Policy Building
     * @param event
     * @returns {string} or {false}
     */
    retrieveAccountId(event) {
        
        if (event) {
            var methodArnArray = event.methodArn.split(':');
            return methodArnArray[4];
        }
       return false;
    }

    /**
     * Let's grab the AWS region for Policy Building
     * @param event
     * @returns {*}
     */
    retrieveRegion(event) {
        if (event) {
            var methodArnArray = event.methodArn.split(':');
            return methodArnArray[3];
        }
        return false;
    }
    
    /**
     * Construct an arn for which the policy affects
     * Example is: arn:aws:execute-api:us-west-2:<accountId>:kvmxspwm7g/<stage>/GET/
     * Format: arn:aws:execute-api:<regionId>:<accountId>:<appId>/<stage>/<httpVerb>/[<resource>/<httpVerb>/[...]]"
     */
    constructArns() {
        var colon_delimiter = ':';
        var slash_delimiter = '/';
        var api_ids = this.resourceGroup.api_ids;

        //the resources to go into the policy
        var Resource = [];

        api_ids.forEach((api_id) => {
            console.info('api_id is' + JSON.stringify(api_id));
            var arn = 'arn:aws:execute-api:'
                .concat(this.region)
                .concat(colon_delimiter)
                .concat(this.accountId)
                .concat(colon_delimiter)
                .concat(api_id.api_name)
                .concat(slash_delimiter)
                .concat(api_id.phase)
                .concat(slash_delimiter)
                .concat(api_id.verb)
                .concat(slash_delimiter);

            if (api_id.resource) {
                arn.concat(api_id.resource);
            }

            Resource.push(arn.trim());
        });
        return Resource;
    }
}

module.exports = PolicyBuilderModule;





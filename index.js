'use strict';
const Authorizer = require('./lib/AuthorizerModule');
const authorizer = new Authorizer();

console.log('Loading function');

exports.handler = (event, context) => {
  
  authorizer.authorize(event, context)
      .then( (policy) => {
        console.log('Success: Policy is '
            + JSON.stringify(policy));
          context.succeed(policy);
      } )
      .catch((error) => {
        console.log('Error: error is '
            + JSON.stringify(error));
          context.fail(error);
      });
};

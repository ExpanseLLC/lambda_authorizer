'use strict';
const Authorizer = require('./lib/AuthorizerModule');
const authorizer = new Authorizer();

console.log('Loading function');

exports.handler = (event, context) => {
  
  authorizer.authorize(event, context)
      .then( (policy) => {
        context.succeed(policy);
      } )
      .catch((error) => {
        context.fail(error.message);
      });
};

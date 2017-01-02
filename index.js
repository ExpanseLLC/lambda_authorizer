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
const logger = require('winston');
const Authorizer = require('./lib/AuthorizerModule');
const authorizer = new Authorizer();

exports.handler = (event, context) => {
  authorizer.authorize(event, context)
    .then((policy) => {
      logger.info(`Success: Policy is ${JSON.stringify(policy)}`, {
        context: 'index',
        timestamp: Date.now(),
        pid: process.pid
      });

      context.succeed(policy);
    })
    .catch((error) => {
      logger.info(`Error: error is ${JSON.stringify(error)}`, {
        context: 'index',
        timestamp: Date.now(),
        pid: process.pid
      });

      context.fail(error);
    });
};

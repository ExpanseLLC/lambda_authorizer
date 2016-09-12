'use strict';
const expect = require('chai').expect;
const LambdaTester = require('lambda-tester');
const index = require('../index.js');

describe('index within lambda context', () =>{
  it('handler should call authorizor', () => {
    return LambdaTester(index.handler)
        .event( {
            type: 'TOKEN',
            authorizationToken: 'TestToken',
            methodArn: 'arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>'
        } )
        .expectResult();F
  });

    it('index.js: handler invocation should succeed', () => {
        return LambdaTester(index.handler)
            .event( {
                type: 'TOKEN',
                authorizationToken: 'TestToken',
                methodArn: 'arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>'
            } )
            .expectResult(function(result){
                expect( result.message ).to.equal( 'Token is TestToken' );
            });
    });

    //TODO timeout() testing and configs
    it('index.js: handler invocation should timeout after N seconds', () => {
        return LambdaTester(index.handler)
            .event( {
                type: 'TOKEN',
                authorizationToken: 'TestToken',
                methodArn: 'arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>'
            } )
            .timeout( 1 /* fail if longer than 1 second */ )
            .expectResult();
    });

    //TODO verify context.fail()
    it('index.js: verify context fail', () => {
        return LambdaTester(index.handler)
            .event( {
                type: 'TOKEN',
                authorizationToken: 'TestToken',
                methodArn: 'arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>'
            })
            .expectResult();
    });

    //TODO verify context.succeed()
    it('index.js: verify context succeed', () => {
        return LambdaTester(index.handler)
            .event( {
                type: 'TOKEN',
                authorizationToken: 'TestToken',
                methodArn: 'arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>'
            })
            .expectResult();
    });
});



'use strict';
const expect = require('chai').expect;
const LambdaTester = require('lambda-tester');
const index = require('../index.js');


describe('index', () =>{
  it('handler should call authorizor', () =>{
    return LambdaTester(index.handler)
        .event( {
            type: 'TOKEN',
            authorizationToken: 'TestToken',
            methodArn: 'arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>'
        } )
        .expectResult();
  });

    it('handler invocation should succeed', () =>{
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

    it('handler invocation should succeed', () =>{
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
});


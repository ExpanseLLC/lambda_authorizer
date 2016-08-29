'use strict';
const expect = require('chai').expect;
const LambdaTester = require('lambda-tester');
const index = require('../index.js');
const handler = require('../index.js').handler;

describe('index', () =>{
  it('handler should call authorizor', () =>{
    return LambdaTester(handler)
        .event({ name: 'Meghan'})
        .expectResult();
  });

    it('handler invocation should succeed', () =>{
        return LambdaTester(handler)
            .event( { name: 'Meghan' } )
            .expectResult(function(result){
                expect( result.name ).to.equal( 'Meghan' );
            });
    });
});
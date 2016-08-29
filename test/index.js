'use strict';
const expect = require('chai').expect;
const LambdaTester = require('lambda-tester');
const index = require('../index.js');

describe('index', () =>{
  it('handler should call authorizor', () =>{
    return LambdaTester(index.handler)
        .event({ name: 'Meghan'})
        .expectResult();
  });

    it('handler invocation should succeed', () =>{
        return LambdaTester(index.handler)
            .event( { name: 'Meghan' } )
            .expectResult(function(result){
                expect( result.message ).to.equal( 'Welcome Meghan, to Lambda' );
            });
    });
});
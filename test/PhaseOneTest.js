//zestaw testów sprawdzających poprawność implementacji podziału sekwencji na słowa-ziarna używane w algorytmie BLAST
var test = require('unit.js');
var assert = test.assert;
var stringUtils = require('../js/StringUtils.js');


describe('String utils test - phase 1 of BLAST algorithm', function(){
	it('Token test', function(){
		//wyrywkowe sprawdzenie pojedynczego słowa-ziarna
		var token = stringUtils.getToken('ATTGC', 3, 1);
		
		test.string(token);
		
		assert.strictEqual(token, 'TTG');
		
		console.log(token);
		
		//i kolejnego dla pewności
		token = stringUtils.getToken('ATTGC', 3, 2);
		
		test.string(token);
		
		assert.strictEqual(token, 'TGC');
		
		console.log(token);
	});
	
	it('Tokenize test', function(){
		//sprawdzenie funkcji zwracającej tablicę słów-ziaren
		var tokens = stringUtils.tokenize('ATTGC', 3);
		
		test.array(tokens);
		
		assert.strictEqual(tokens.length, 3);
		
		assert.strictEqual(tokens[0], 'ATT');
		assert.strictEqual(tokens[1], 'TTG');
		assert.strictEqual(tokens[2], 'TGC');
		
		console.log(tokens);
	});
});
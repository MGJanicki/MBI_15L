var test = require('unit.js');
var assert = test.assert;
var highScoringPairs = require('../js/HighScoringPairs.js');

describe('High scoring pairs test', function(){
	
	//inicjalizacja macierzy podobieństwa wykorzystywanej do testów
	var scoringMatrix = [];
	for(i = 0; i < 4; i++)
	{
		scoringMatrix[i] = [];
		for(j = 0; j < 4; j++)
		{
			if(i === j)
			{
				scoringMatrix[i][j] = 1;
			}
			else
			{
				scoringMatrix[i][j] = 0;
			}
		}
	}
	
	console.log(scoringMatrix);
	
	it('One pair test', function(){
		//sprawdzenie pary identycznych sekwencji
		var score = highScoringPairs.score('ATTGC', 'ATTGC', scoringMatrix);
		
		test.number(score);
		
		assert.strictEqual(score, 5);
		
		console.log(score);
		
		//oraz trochę różniących się od siebie
		score = highScoringPairs.getToken('ATTGC', 'TTTTT', scoringMatrix);
		
		test.string(score);
		
		assert.strictEqual(score, 2);
		
		console.log(score);
	});
	
	it('Tokenize test', function(){
		//sprawdzenie funkcji zwracającej tablicę z wynikiem dla wysoko ocenianych par
		var pairs = highScoringPairs.findHSP('ATT', scoringMatrix, 2);
		
		test.array(pairs);
		
		assert.strictEqual(pairs["ATT"]["ATA"], 2);
		
		console.log(pairs);
	});
});
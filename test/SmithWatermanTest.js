var test = require('unit.js');
var assert = test.assert;
var smithWaterman = require('../js/SmithWaterman.js');

describe('Smith-Waterman algorithm implementation test', function(){
	
	//inicjalizacja macierzy podobieñstwa wykorzystywanej do testów
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
				scoringMatrix[i][j] = -1;
			}
		}
	}
	
	var gapCost = -1;
	
	it('Smith-Waterman algorithm test', function(){
		//test na podstawie przyk³adu ze slajdów do drugiego wyk³adu
		var results = smithWaterman.smithWaterman('GAAAGAT', 'GATGAA', scoringMatrix, gapCost);
		
		test.array(results);
		
		console.log(results);
		
		assert.strictEqual(results.length, 2);
		
		assert.strictEqual(results[0].index, 4);
		
		assert.strictEqual(results[0].score, 3);
		
		assert.strictEqual(results[0].sequenceLength, 3);
		
		assert.strictEqual(results[1].index, 0);
		
		assert.strictEqual(results[1].score, 3);
		
		assert.strictEqual(results[1].sequenceLength, 3);
	});
});
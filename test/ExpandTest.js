var test = require('unit.js');
var assert = test.assert;
var expand = require('../js/Expand.js');

describe('Seed expanding function test', function(){
	
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
	
	it('Seed expanding test', function(){
		//wyrywkowe sprawdzenie pojedynczego słowa-ziarna
		//expand(seed, sequence1, sequence2, seq1Index, seq2Index, similarityMatrix, oldScore);
		var expandedObject = expand.expand('AAT', 'AAATT', 'CGAAATTAGAC', 1, 4, scoringMatrix, 3);
		
		test.object(expandedObject);
		
		console.log(expandedObject);
		
		assert.strictEqual(expandedObject.newScore, 5);
		assert.strictEqual(expandedObject.newSeq1Index, 0);
		assert.strictEqual(expandedObject.newSeq2Index, 3);
		assert.strictEqual(expandedObject.newSeed, 'AAATT');
		
		//i kolejnego dla pewności
		token = stringUtils.getToken('ATTGC', 3, 2);
		
		test.string(token);
		
		assert.strictEqual(token, 'TGC');
		
		console.log(token);
	});
	
});
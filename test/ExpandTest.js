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
		var expandedObject = expand.expand('AAT', 'AAATT', 'CGAAATTAGAC', 1, 3, scoringMatrix, 3);
		
		test.object(expandedObject);
		
		console.log(expandedObject);
		
		assert.strictEqual(expandedObject.newScore, 5);
		assert.strictEqual(expandedObject.expandedLeft, true);
		assert.strictEqual(expandedObject.newSeed, 'AAATT');
		
		//nie można rozszerzyć w lewo, bo szukane słowo nie ma już symboli po lewej stronie
		var expandedObject = expand.expand('AAA', 'AAATT', 'CGAAATTAGAC', 0, 2, scoringMatrix, 3);
		
		test.object(expandedObject);
		
		console.log(expandedObject);
		
		assert.strictEqual(expandedObject.newScore, 4);
		assert.strictEqual(expandedObject.expandedLeft, false);
		assert.strictEqual(expandedObject.newSeed, 'AAAT');
		
		//nie można rozszerzyć w lewo, bo sekwencja na bazie nie ma już symboli po lewej stronie
		var expandedObject = expand.expand('AAT', 'AAATT', 'AATTAGAC', 1, 0, scoringMatrix, 3);
		
		test.object(expandedObject);
		
		console.log(expandedObject);
		
		assert.strictEqual(expandedObject.newScore, 4);
		assert.strictEqual(expandedObject.expandedLeft, false);
		assert.strictEqual(expandedObject.newSeed, 'AATT');
		
		//nie można rozszerzyć w prawo, bo sekwencja na bazie nie ma już symboli po prawej stronie
		var expandedObject = expand.expand('ATT', 'AAATT', 'CGAAATTAGAC', 2, 4, scoringMatrix, 3);
		
		test.object(expandedObject);
		
		console.log(expandedObject);
		
		assert.strictEqual(expandedObject.newScore, 4);
		assert.strictEqual(expandedObject.expandedLeft, true);
		assert.strictEqual(expandedObject.newSeed, 'AATT');
		
		//nie można rozszerzyć w prawo, bo sekwencja na bazie nie ma już symboli po prawej stronie
		var expandedObject = expand.expand('AAT', 'AAATT', 'CGAAAT', 1, 3, scoringMatrix, 3);
		
		test.object(expandedObject);
		
		console.log(expandedObject);
		
		assert.strictEqual(expandedObject.newScore, 4);
		assert.strictEqual(expandedObject.expandedLeft, true);
		assert.strictEqual(expandedObject.newSeed, 'AAAT');
	});
	
});
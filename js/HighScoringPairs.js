var utils = require('./Utils.js');

//funkcja oceny pary sekwencji dla zadanej macierzy podobieństwa
//założenie - sekwencje na wejściu są tej samej długości (w końcu sami produkujemy sequence2 na podstawie sequence1)
function score(sequence1, sequence2, scoringMatrix)
{
	var score = 0;
	var nucleotideIndex1; //indeks w macierzy podobieństwa nukleotydu z pierwszej sekwencji
	var nucleotideIndex2; //indeks w macierzy podobieństwa nukleotydu z drugiej sekwencji
	for(i = 0; i < sequence1.length; i++)
	{
		nucleotideIndex1 = utils.getNucletideIndex(sequence1[i]);
		nucleotideIndex2 = utils.getNucletideIndex(sequence2[i]);
		score = score + scoringMatrix[nucleotideIndex1][nucleotideIndex2];
	}
	return score;
}

//funkcja znajdująca wszystkie wysoko oceniane pary dla zadanej sekwencji
function findHSP(sequence, scoringMatrix, treshold)
{
	var hspArray = [];
	var sequenceArray = utils.generateAllSequences(sequence.length, 1);
	var pairScore;
	
	for(var i = 0; i < sequenceArray.length; i++)
	{
		pairScore = score(sequence, sequenceArray[i], scoringMatrix);
		//założenie - wartość progowa jest zaliczana do wysoko ocenianych par
		if(pairScore >= treshold)
		{
			hspArray[sequenceArray[i]] = pairScore;
		}
	}
	
	return hspArray;
}

exports.score = function(sequence1, sequence2, scoringMatrix)
{
	return score(sequence1, sequence2, scoringMatrix);
}

exports.findHSP = function(sequence, scoringMatrix, treshold)
{
	return findHSP(sequence, scoringMatrix, treshold)
}
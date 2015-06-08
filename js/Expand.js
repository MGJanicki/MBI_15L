var utils = require('./Utils.js');

/*
 * seed - słowo-ziarno 
 * sequence1 - szukane słowo
 * sequence2 - słowo z bazy
 * seq1Index - indeks słowa-ziarna w szukanym słowie
 * seq2Index - indeks słowa-ziarna w słowie z bazy
 * scoringMatrix - macierz podobieństwa wykorzyswtywana przy ocenie
 * oldScore - podobieństwo sekwencji przed rozszerzeniem
 * return - obiekt zawierający właściwości expandedLeft, newSeed, newScore zawierające informacje potrzebne do dalszego działania algorytmu
 */
function expand(seed, sequence1, sequence2, seq1Index, seq2Index, scoringMatrix, oldScore)
{
	var result = {expandedLeft: false, expandedRight: false, newSeed: seed, newScore: oldScore};
	
	//sprawdzam czy można rozszerzyć w lewo
	if(seq1Index !== 0 && seq2Index !== 0)
	{
		var tokenNucletide = sequence1.charAt(seq1Index - 1);
		var recordNucleotide = sequence2.charAt(seq2Index - 1);
		result.expandedLeft = true;		
		result.newSeed = tokenNucletide.concat(result.newSeed);		
		result.newScore = result.newScore + scoringMatrix[utils.getNucletideIndex(tokenNucletide)][utils.getNucletideIndex(recordNucleotide)];
	}
	
	//sprawdzam czy można rozszerzyć w prawo
	if(seq1Index + seed.length < sequence1.length && seq2Index + seed.length < sequence2.length)
	{
		var tokenNucletide = sequence1.charAt(seq1Index + seed.length);
		var recordNucleotide = sequence2.charAt(seq2Index + seed.length);
		result.expandedRight = true;
		result.newSeed = result.newSeed.concat(tokenNucletide);		
		result.newScore = result.newScore + scoringMatrix[utils.getNucletideIndex(tokenNucletide)][utils.getNucletideIndex(recordNucleotide)];
	}
	
	return result;
}

exports.expand = function(seed, sequence1, sequence2, seq1Index, seq2Index, scoringMatrix, oldScore)
{
	return expand(seed, sequence1, sequence2, seq1Index, seq2Index, scoringMatrix, oldScore);
}
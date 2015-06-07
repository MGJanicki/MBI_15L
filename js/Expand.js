var utils = require('./Utils.js');

/*
 * seed - słowo-ziarno 
 * sequence1 - szukane słowo
 * sequence2 - słowo z bazy
 * seq1Index - indeks słowa-ziarna w szukanym słowie
 * seq2Index - indeks słowa-ziarna w słowie z bazy
 * similarityMatrix - macierz podobieństwa wykorzyswtywana przy ocenie
 * oldScore - podobieństwo sekwencji przed rozszerzeniem
 * return - obiekt zawierający właściwości newSeq1Index, newSeq2Index, newSeed, newScore zawierające informacje potrzebne do dalszego działania algorytmu
 */
function expand(seed, sequence1, sequence2, seq1Index, seq2Index, similarityMatrix, oldScore)
{
	var result = {newSeq1Index: seq1Index, newSeq2Index: seq2Index, newSeed: seed, newScore: oldScore};
	return result;
}

exports.expand = function(seed, sequence1, sequence2, seq1Index, seq2Index, similarityMatrix, oldScore)
{
	return expand(seed, sequence1, sequence2, seq1Index, seq2Index, similarityMatrix, oldScore);
}
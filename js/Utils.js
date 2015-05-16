//funkcja pomocnicza zwracająca indeks macierzy podobieństwa dla nukleotydu
function getNucletideIndex(nucleotide)
{
	switch(nucleotide)
	{
		case 'A': return 0;
		case 'C': return 1;
		case 'G': return 2;
		case 'T': return 3;
	}
}

function getNucleotideForIndex(index)
{
	switch(index)
	{
		case 0: return 'A';
		case 1: return 'C';
		case 2: return 'G';
		case 3: return 'T';
	}
}

//rekurencyjna funkcja generująca wszystkie możliwe sekwencje o zadanej długości
function generateAllSequences(length, depth)
{
	if(length === depth)
	{
		return ['A', 'C', 'G', 'T'];
	}

	//tablice potrzebne przy generowaniu sekwencji - z wynikami działania poziom niżej oraz wyjściowa
	var returnArray = [];
	var partialSequencesArray = generateAllSequences(length, depth + 1);
	
	for(i = 0; i < partialSequencesArray.length; i++)
	{
		for(j = 0; j < 4; j++)
		{
			//doklejenie kolejnego nukleotydu do sekwencji - pętla w pętli zapewnia rozpatrzenie wszystkich możliwości
			returnArray.push(partialSequencesArray[i].concat(getNucleotideForIndex(j)));
		}
	}
	return returnArray;
}

exports.getNucletideIndex = function(nucleotide)
{
	return getNucletideIndex(nucleotide);
}

exports.generateAllSequences = function(length, depth)
{
	return generateAllSequences(length, depth);
}
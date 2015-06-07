var utils = require('./Utils.js'); //potrzebne, ¿eby okreœliæ indeks nukleotydu w macierzy
/*
* Komórka macierzy w algorytmie Smitha-Watermana sk³ada siê z dwóch elementów.
* Pierwszym z nich jest wartoœæ funkcji podobieñstwa (score), a drugim komórka która pos³u¿y³a 
* do wyznaczenia jej wartoœci (direction).
*/

/*
* Rezultatem dzia³ania algorytmu Smitha-Watermana jest tablica obiektów z najlepszymi lokalnymi
* dopasowaniami podobieñstwa. Na taki obiekt sk³ada siê informacja o indeksie w pierwszej sekwencji,
* ocena lokalnego podobieñstwa oraz d³ugoœæ sekwencji.
*/

/**
 * row - rz¹d, w którym znajduje siê aktualnie wype³niania komórka
 * column - kolumna, w którym znajduje siê aktualnie wype³niania komórka
 * similarityMatrix - uzupe³niana macierz
 * symbolCost - koszt symbolu pobrany z macierzy podobieñstwa
 * gapCost - koszt przerwy
 */
function similarityFunction(row, column, similarityMatrix, symbolCost, gapCost)
{
	//komorka macierzy bêd¹ca rezultatem funkcji wyliczaj¹cej podobieñstwo
	var result = {score: 0, row: -1, column: -1}; 

	//wartoœci potrzebne do znalezienia wyniku funkcji podobieñstwa F(i, j)
	var rowCost = similarityMatrix[row-1][column].score + gapCost;
	var columnCost = similarityMatrix[row][column-1].score + gapCost;
	var diagonalCost = similarityMatrix[row-1][column-1].score + symbolCost;	
	
	if(rowCost > result.score)
	{
		result.score = rowCost;
		result.row = row - 1;
		result.column = column;
	}
	
	if(columnCost > result.score)
	{
		result.score = columnCost;
		result.row = row;
		result.column = column - 1;
	}
	
	if(diagonalCost > result.score)
	{
		result.score = diagonalCost;
		result.row = row - 1;
		result.column = column - 1;
	}	
	
	return result;
}

/*
* Funkcja wyci¹ga z macierzy obiekt zawieraj¹cy d³ugoœæ i indeks pocz¹tku sekwencji
*/
function getSequence(row, column, similarityMatrix)
{
	var cell = similarityMatrix[row][column];
	//inicjalizacja zmiennej wynikowej
	var result = {score: similarityMatrix[row][column].score, sequenceLength: 0, index: -1};
	
	while(cell.row !== -1)
	{
		result.index = cell.column;
		result.sequenceLength++;
		cell = similarityMatrix[cell.row][cell.column];
	}
		
	return result;
}

/*
* Funkcja zwraca tablicê obiektów przechowuj¹cych informacje o najlepszych lokalnych podobieñstwach sekwencji.
* Obiekt sk³ada siê z trzech pól - indeksu symbolu w pierwszej sekwencji, od którego zaczyna siê sekwencja podobna,
* oceny sekwencji oraz jej d³ugoœci
*/
function getBest(similarityMatrix)
{
	var best = [];
	best.push({score: 0, row: -1, column: 0});
	//iteracja po komórkach macierzy z wynikami
	for(i = 1; i < similarityMatrix.length; i++)
	{
		for(j = 1; j < similarityMatrix[i].length; j++)
		{
			if(similarityMatrix[i][j].score > best[0].score)
			{
				best = [];
				best.push({score: similarityMatrix[i][j].score, row: i, column: j});
			}
			else if(similarityMatrix[i][j].score === best[0].score)
			{
				best.push({score: similarityMatrix[i][j].score, row: i, column: j});
			}
		}
	}
	
	var results = [];
	for(i = 0; i < best.length; i++)
	{
		results.push(getSequence(best[i].row, best[i].column, similarityMatrix));
	}
	
	return results;
}

//funkcja zwraca tablicê obiektów z najlepszymi lokalnymi dopasowaniami
function smithWaterman(sequence1, sequence2, scoringMatrix, gapCost)
{	
	//inicjalizacja macierzy s³u¿¹cej do porównania sekwencji
	var matrix = [];
	for(i = 0; i < sequence2.length + 1; i++)
	{
		matrix[i] = [];
		if(i > 0)
		{
			var seq2NucleotideIndex = utils.getNucletideIndex(sequence2.charAt(i - 1));
		}
		for(j = 0; j < sequence1.length + 1; j++)
		{		
			// inicjalizacja brzegów macierzy
			if(i === 0 || j === 0)
			{
				matrix[i][j] = {score: 0, row: -1, column: -1};
			}
			else
			{
				//wyznaczenie wartoœci komórek macierzy przy pomocy funkcji podobieñstwa F(i, j)
				var seq1NucleotideIndex = utils.getNucletideIndex(sequence1.charAt(j - 1));
				var symbolCost = scoringMatrix[seq1NucleotideIndex][seq2NucleotideIndex];							
				
				var score = similarityFunction(i, j, matrix, symbolCost, gapCost);
				
				matrix[i][j] = score;
			}			
		}
	}
	
	var results = getBest(matrix);
	return results;
}

exports.smithWaterman = function(sequence1, sequence2, scoringMatrix, gapCost)
{
	return smithWaterman(sequence1, sequence2, scoringMatrix, gapCost);
}
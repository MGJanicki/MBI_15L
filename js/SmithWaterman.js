var utils = require('./Utils.js'); //potrzebne, �eby okre�li� indeks nukleotydu w macierzy
/*
* Kom�rka macierzy w algorytmie Smitha-Watermana sk�ada si� z dw�ch element�w.
* Pierwszym z nich jest warto�� funkcji podobie�stwa (score), a drugim kom�rka kt�ra pos�u�y�a 
* do wyznaczenia jej warto�ci (direction).
*/

/*
* Rezultatem dzia�ania algorytmu Smitha-Watermana jest tablica obiekt�w z najlepszymi lokalnymi
* dopasowaniami podobie�stwa. Na taki obiekt sk�ada si� informacja o indeksie w pierwszej sekwencji,
* ocena lokalnego podobie�stwa oraz d�ugo�� sekwencji.
*/

/**
 * row - rz�d, w kt�rym znajduje si� aktualnie wype�niania kom�rka
 * column - kolumna, w kt�rym znajduje si� aktualnie wype�niania kom�rka
 * similarityMatrix - uzupe�niana macierz
 * symbolCost - koszt symbolu pobrany z macierzy podobie�stwa
 * gapCost - koszt przerwy
 */
function similarityFunction(row, column, similarityMatrix, symbolCost, gapCost)
{
	//komorka macierzy b�d�ca rezultatem funkcji wyliczaj�cej podobie�stwo
	var result = {score: 0, row: -1, column: -1}; 

	//warto�ci potrzebne do znalezienia wyniku funkcji podobie�stwa F(i, j)
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
* Funkcja wyci�ga z macierzy obiekt zawieraj�cy d�ugo�� i indeks pocz�tku sekwencji
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
* Funkcja zwraca tablic� obiekt�w przechowuj�cych informacje o najlepszych lokalnych podobie�stwach sekwencji.
* Obiekt sk�ada si� z trzech p�l - indeksu symbolu w pierwszej sekwencji, od kt�rego zaczyna si� sekwencja podobna,
* oceny sekwencji oraz jej d�ugo�ci
*/
function getBest(similarityMatrix)
{
	var best = [];
	best.push({score: 0, row: -1, column: 0});
	//iteracja po kom�rkach macierzy z wynikami
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

//funkcja zwraca tablic� obiekt�w z najlepszymi lokalnymi dopasowaniami
function smithWaterman(sequence1, sequence2, scoringMatrix, gapCost)
{	
	//inicjalizacja macierzy s�u��cej do por�wnania sekwencji
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
			// inicjalizacja brzeg�w macierzy
			if(i === 0 || j === 0)
			{
				matrix[i][j] = {score: 0, row: -1, column: -1};
			}
			else
			{
				//wyznaczenie warto�ci kom�rek macierzy przy pomocy funkcji podobie�stwa F(i, j)
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
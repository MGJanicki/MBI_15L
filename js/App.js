/***************************************
 *			START Utils.js		       *
 ***************************************/

/**
 * funkcja zwracająca indeks nukleotydu w macierzy podobienstwa
 */
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

/**
 * funkcja zwraca nukleotyd dla zadanego indeksu macierzy podobienstwa
 * jest wykorzystywana przy generowaniu wszystkich mozliwych sekwencji o zadnej długosci przy wyznaczaniu słow-ziaren
 */
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

/**
 * rekurencyjna funkcja generujaa wszystkie możliwe sekwencje o zadanej dlugosci
 */
function generateAllSequences(length, depth)
{
	if(length === depth)
	{
		return ['A', 'C', 'G', 'T'];
	}

	//tablice potrzebne przy generowaniu sekwencji - z wynikami dzialania poziom niżej oraz wyjsciowa
	var returnArray = [];
	var partialSequencesArray = generateAllSequences(length, depth + 1);
	
	for(i = 0; i < partialSequencesArray.length; i++)
	{
		for(j = 0; j < 4; j++)
		{
			//doklejenie kolejnego nukleotydu do sekwencji - petla w petli zapewnia rozpatrzenie wszystkich mozliwosci
			returnArray.push(partialSequencesArray[i].concat(getNucleotideForIndex(j)));
		}
	}
	return returnArray;
}

/***************************************
 *			END Utils.js		   	   *
 ***************************************/

/***************************************
 *			START Validator.js		   *
 ***************************************/

/**
 * funkcja sluzaca do walidacji wprowadzanych przez uzytkownika sekwencji 
 */
function validateSequence(sequence)
{
	//podniesienie tekstu do wilekich liter - mozna walidowac
	sequence = sequence.toUpperCase();
	for(i = 0; i < sequence.length; i++)
	{
		if(sequence[i] !== 'A' && sequence[i] !== 'C' && sequence[i]
			&& sequence[i] !== 'G' && sequence[i] !== 'T')
			{
				return false;
			}
	}
	return true;
}

/**
 * funkcja sprawdzajaca czy wprowadzona przez uzytkownika macierz podobienstwa zawiera wylacznie liczby
 */
function validateMatrix(matrix)
{
	for(i = 0; i < matrix.length; i++)
	{
		for(j = 0; j < matrix[i].length; j++)
		{
			if(isNaN(parseInt(matrix[i][j])))
			{
				return false;
			}
		}
	}
	return true;
}

/**
 * funkcja sprawdzajaca dlugosc slowa-ziarna - pole musi zostac wypelnione
 */
function validateInputLength(inputLength)
{
	return !isNaN(parseInt(inputLength)) && parseInt(inputLength) > 0;
}

/**
 * funkcja sprawdzajaca dlugosc szukanej sekwencji, ktora musi byc wieksza od dlugosci slowa-ziarna
 */
function validateSequenceLength(inputLength, sequenceLength)
{
	return !isNaN(inputLength) && !isNaN(sequenceLength) && sequenceLength > inputLength;
}

/**
 * funkcja do walidacji pol liczbowych, nazwa jest zaszloscia, oryginalnie miala sluzyc do walidacji parametru progowania T
 */
function validateMinimumScore(score)
{
	return !isNaN(parseInt(score));
}

/***************************************
 *			END Validator.js		   *
 ***************************************/

/***************************************
 *			START StringUtils.js		   *
 ***************************************/
 
/**
 * funkcja zwracajaca pojedyncze podslowo dla zadanej sekwencji
 */
function getToken(word, tokenLength, position)
{
	return word.substring(position, position + tokenLength);
}

/**
 * funkcja dzielaca zadana sekwencje na podslowa
 */
function tokenize(word, tokenLength)
{
	var tokens = [];
	for(var i = 0; i + tokenLength <= word.length; i++)
	{
		tokens.push(getToken(word, tokenLength, i));
	}
	return tokens;
}

/***************************************
 *			END StringUtils.js		   *
 ***************************************/
 
/***************************************
 *		START HighScoringPairs.js	   *
 ***************************************/

/**
 * funkcja oceny pary sekwencji dla zadanej macierzy podobienstwa
 * zalozenie - sekwencje na wejsciu sa tej samej dlugosci (w koncu sami produkujemy sequence2 na podstawie sequence1)
 */
function score(sequence1, sequence2, scoringMatrix)
{
	var score = 0;
	var nucleotideIndex1; //indeks w macierzy podobienstwa nukleotydu z pierwszej sekwencji
	var nucleotideIndex2; //indeks w macierzy podobienstwa nukleotydu z drugiej sekwencji
	for(i = 0; i < sequence1.length; i++)
	{
		nucleotideIndex1 = getNucletideIndex(sequence1[i]);
		nucleotideIndex2 = getNucletideIndex(sequence2[i]);
		score = score + parseInt(scoringMatrix[nucleotideIndex1][nucleotideIndex2]);
	}
	return score;
}

/**
 * funkcja znajdujaca wszystkie wysoko oceniane pary dla zadanej sekwencji
 */
function findHSP(sequence, scoringMatrix, treshold)
{
	var hspArray = [];
	var sequenceArray = generateAllSequences(sequence.length, 1);
	var pairScore;
	
	for(var i = 0; i < sequenceArray.length; i++)
	{
		pairScore = score(sequence, sequenceArray[i], scoringMatrix);
		//założenie - wartość progowa jest zaliczana do wysoko ocenianych par
		if(pairScore >= treshold)
		{
			hspArray.push({seed: pairScore, sequence: sequenceArray[i]});
		}
	}
	
	return hspArray;
}

/***************************************
 *		END HighScoringPairs.js	   	   *
 ***************************************/
 
/***************************************
 *		START Expand.js	   	   		   *
 ***************************************/
 
 /**
  * funkcja probujaca rozszerzyc zadane podslowo w obu kierunkach
  * wynikiem jej dzialania jest informacja o tym, czy sekwencja zostala rozszerzona w lewo i prawo
  * a takze sekwencja po rozszerzeniu i zaktualizowany wynik funkcji podobienstwa do sekwencji z bazy
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
		result.newScore = result.newScore + parseInt(scoringMatrix[getNucletideIndex(tokenNucletide)][getNucletideIndex(recordNucleotide)]);
	}
	
	//sprawdzam czy można rozszerzyć w prawo
	if(seq1Index + seed.length < sequence1.length && seq2Index + seed.length < sequence2.length)
	{
		var tokenNucletide = sequence1.charAt(seq1Index + seed.length);
		var recordNucleotide = sequence2.charAt(seq2Index + seed.length);
		result.expandedRight = true;
		result.newSeed = result.newSeed.concat(tokenNucletide);		
		result.newScore = result.newScore + parseInt(scoringMatrix[getNucletideIndex(tokenNucletide)][getNucletideIndex(recordNucleotide)]);
	}
	
	return result;
}
 
/***************************************
 *		END Expand.js			   	   *
 ***************************************/

/***************************************
 *		START SmithWaterman.js	   	   *
 ***************************************/
 
/*
* Komórka macierzy w algorytmie Smitha-Watermana składa się z dwóch elementów.
* Pierwszym z nich jest wartość funkcji podobieństwa (score), a drugim komórka która posłużyła 
* do wyznaczenia jej wartości (direction).
*/

/*
* Rezultatem działania algorytmu Smitha-Watermana jest tablica obiektów z najlepszymi lokalnymi
* dopasowaniami podobieństwa. Na taki obiekt składa się informacja o indeksie w pierwszej sekwencji,
* ocena lokalnego podobieństwa oraz długość sekwencji.
*/

/**
 * row - rząd, w którym znajduje się aktualnie wypełniania komórka
 * column - kolumna, w którym znajduje się aktualnie wypełniania komórka
 * similarityMatrix - uzupełniana macierz
 * symbolCost - koszt symbolu pobrany z macierzy podobieństwa
 * gapCost - koszt przerwy
 */
function similarityFunction(row, column, similarityMatrix, symbolCost, gapCost)
{
	//komorka macierzy będąca rezultatem funkcji wyliczającej podobieństwo
	var result = {score: 0, row: -1, column: -1}; 

	//wartości potrzebne do znalezienia wyniku funkcji podobieństwa F(i, j)
	var rowCost = similarityMatrix[row-1][column].score + gapCost;
	var columnCost = similarityMatrix[row][column-1].score + gapCost;
	var diagonalCost = similarityMatrix[row-1][column-1].score + symbolCost;	
	
	//te trzy ify dzialaja jak funkcja max(rowCost, columnCost, diagonalCost, 0)
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

/**
 * Funkcja wyciąga z macierzy obiekt zawierający długość i indeks początku sekwencji
 */
function getSequence(row, column, similarityMatrix)
{
	var cell = similarityMatrix[row][column];
	//inicjalizacja zmiennej wynikowej
	var result = {score: similarityMatrix[row][column].score, sequenceLength: 0, index: -1};
	
	//iteracja po przejsciach az do natrafienia na komorke z ktorej nie mozna prejsc dalej (z ocena 0)
	while(cell.row !== -1)
	{
		result.index = cell.column;
		result.sequenceLength++;
		cell = similarityMatrix[cell.row][cell.column];
	}
		
	return result;
}

/**
 * Funkcja zwraca tablicę obiektów przechowujących informacje o najlepszych lokalnych podobieństwach sekwencji.
 * Obiekt składa się z trzech pól - indeksu symbolu w pierwszej sekwencji, od którego zaczyna się sekwencja podobna,
 * oceny sekwencji oraz jej długości
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
			//nowy najlepszy wynik - zapominamy o starych
			if(similarityMatrix[i][j].score > best[0].score)
			{
				best = [];
				best.push({score: similarityMatrix[i][j].score, row: i, column: j});
			}
			//wyrownany najlepszy wynik - dodajemy go do listy znalezionych rozwiazan
			else if(similarityMatrix[i][j].score === best[0].score)
			{
				best.push({score: similarityMatrix[i][j].score, row: i, column: j});
			}
		}
	}
	
	//wyciagniecie sekwencji dla najlepszych wynikow
	var results = [];
	for(i = 0; i < best.length; i++)
	{
		results.push(getSequence(best[i].row, best[i].column, similarityMatrix));
	}
	
	return results;
}

//funkcja zwraca tablicę obiektów z najlepszymi lokalnymi dopasowaniami
function smithWaterman(sequence1, sequence2, scoringMatrix, gapCost)
{	
	//inicjalizacja macierzy służącej do porównania sekwencji
	var matrix = [];
	for(i = 0; i < sequence2.length + 1; i++)
	{
		matrix[i] = [];
		if(i > 0)
		{
			//sprawdzenie aktualnego nukleotydu - potrzebne do wyznaczenia kosztu symbolu
			var seq2NucleotideIndex = getNucletideIndex(sequence2.charAt(i - 1));
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
				//wyznaczenie wartości komórek macierzy przy pomocy funkcji podobieństwa F(i, j)
				var seq1NucleotideIndex = getNucletideIndex(sequence1.charAt(j - 1));
				var symbolCost = parseInt(scoringMatrix[seq1NucleotideIndex][seq2NucleotideIndex]);
				
				//wyznaczenie wartosci funkcji podobienstwa dla komorki [i][j]
				var score = similarityFunction(i, j, matrix, symbolCost, gapCost);
				
				matrix[i][j] = score;
			}			
		}
	}
	
	//zebranie najlepszych wynikow
	var results = getBest(matrix);
	return results;
}
 
/***************************************
 *		END SmithWaterman.js	   	   *
 ***************************************/
 
/***********************************************
 *	START Zmienne globalne używane w programie *
 ***********************************************/
﻿var shown = 'Info';
//domyslna baza rekordow
var defaultDatabaseSets = ["ATTGATTTAGTATATTATTAAATGTATATATTAATTCAATATTATTATTCTATTCATTTTTATTCATTTT",
    "ATTGATTTAGTATATGATTAAATGTATATATTAATTCAATATTATTATTCTATTCATTTTTATTCATTTT",
    "ATTGATTTAGTATATTGTTAAATGTATATATTAATTCAATTTTATTATTCTATTCATTTTTATTCATTTT",
    "ATTGATTTAGTTTATTATTAAAGGTATATATTAATTCAATATTATTATTCTATTCATTTTTTTTCATTTT",
    "AATGATTTAGTTTATTATTAAAGGTATATATTAATTCAATATTATTATTCTATTCATTTTTTTTCATTTT",
    "CAAGAAGCGATGGGAACGATGTAATCCATGAATACAGAAGATTCAATTGAAAAAGATCCTAATGATTCAT",
    "TTCATATTCAATTAAAATTGAAATTTTTTCATTCGCGAGGAGCCGGATGAGAAGAAACTCTCATGTCCGG",
    "CAAATTTATAATATATTAATCTATATATTAATTTAGAATTCTATTCTAATTCGAATTCAATTTTTAAATA"];
	
//domyslna macierz podobienstwa
var defaultMatrixValues = [
    [1, -1, -1, -1],
    [-1, 1, -1, -1],
    [-1, -1, 1, -1],
    [-1, -1, -1, 1]
];

//alfabet symboli opisujacych nukleotydy
var letters = ["A", "C", "G", "T"];

//macierz podobienstwa
var matrix = [
    [1, -1, -1, -1],
    [-1, 1, -1, -1],
    [-1, -1, 1, -1],
    [-1, -1, -1, 1]
];
var sequence = ""; //szukana sekwencja
var wordLength = ""; //dlugosc podslowa
var databaseSets; //baza rekordow
var tokens = []; //podslowa
var seeds; //slowa-ziarna
var searchResults; //wyniki wyszukiwania slow-ziaren w bazie
var tresholdC; //kryterium stopu dla rozszerzania (prog C)
var finished=false; //warunek zakonczenia rozszerzania na ekranie V
var gapPenalty; //koszt przerwy wykorzystywany w algorytmie Smitha-Watermana
var results; //wyniki oceny sekwencji algorytmem Smith-Watermana
var databaseOK = true; //flaga okreslajaca poprawnosc rekordow w bazie - wykorzystywana w walidacji

/***********************************************
 *	END Zmienne globalne używane w programie   *
 ***********************************************/

/**
 * funkcja wyswietlajaca konkretny ekran
 */
function show(subpageToShow) {
    document.getElementById(shown).style.display = 'none';
    document.getElementById(subpageToShow).style.display = 'block';
    shown = subpageToShow;
    return false;
}

/**
 * funkcja przygotowujaca do wyswietlenia ekran drugi z podslowami
 */
function prepareScreen2() {
    document.getElementById("sequenceLabel").innerHTML = sequence;
    document.getElementById("wordLengthLabel").innerHTML = wordLength.toString();
	//utworzenie tabelki z podslowami
    var table = document.getElementById("Tokens");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    for (var i = 0; i < tokens.length; ++i) {
        table.insertRow(table.rows.length).insertCell(0).appendChild(document.createTextNode(tokens[i]));
    }
}

/**
 * funkcja przygotowujaca do wyswietlenia ekran trzeci ze slowami-ziarnami
 */
function prepareScreen3() {
    var div = document.getElementById("TokensAndSeeds");
    //czyszczenie zawartości
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
	//utworzenie tabelek ze slowami ziarnami dla danego podslowa
    for (var i = 0; i < seeds.length ; ++i) {
        var panel = document.createElement("div");
        panel.className = "panel panel-default";
        var panelTitle = document.createElement("div");
        panelTitle.className = "panel-heading";
        var heading = document.createElement("h4");
        heading.innerHTML = tokens[i];
        panelTitle.appendChild(heading);
        var table = document.createElement('table');
        table.className = "table table-striped";
        for (var j = 0; j < seeds[i].length; j++) {
            table.insertRow(table.rows.length).insertCell(0).appendChild(document.createTextNode(seeds[i][j].sequence));
        }
        panel.appendChild(panelTitle);
        panel.appendChild(table);
        div.appendChild(panel);
    }
}

/** 
 * funkcja przygotowujaca do wyswietlenia ekran czwarty z dopasowaniem slow-ziaren do rekordow bazy
 */
function prepareScreen4() {
    var div = document.getElementById("SearchResults");
    //czyszczenie zawartości
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
	//utworzenie tabelek z lokalizacja podslowa w rekordach z bazy danych
    for (var i = 0; i < seeds.length ; ++i) {
        var panel = document.createElement("div");
        panel.className = "panel panel-default";
        var panelTitle = document.createElement("div");
        panelTitle.className = "panel-heading";
        var heading = document.createElement("h3");
        heading.innerHTML = tokens[i];
        panelTitle.appendChild(heading);
        panel.appendChild(panelTitle);
		//tabelka z lokalizacja slowa-ziarna w rekordzie z bazy
        for (var j = 0; j < seeds[i].length; ++j) {
            var innerPanel = document.createElement("div");
            innerPanel.className = "panel panel-default";
            var innerPanelTitle = document.createElement("div");
            innerPanelTitle.className = "panel-heading";
            var innerHeading = document.createElement("h4");
            innerHeading.innerHTML = seeds[i][j].sequence;
            innerPanelTitle.appendChild(innerHeading);
            innerPanel.appendChild(innerPanelTitle);
            var table = document.createElement('table');
            table.className = "table table-striped";
			//petla zaznaczajaca kolorem czerwonym znalezione w rekordzie slowa-ziarna
            for (var k = 0; k < searchResults[i][j].length; ++k) {
                var text = databaseSets[searchResults[i][j][k].DbSetNr];
                var index =searchResults[i][j][k].index;
                var seedLength=seeds[i][j].sequence.length;
                var coloured = text.substring(0, index)
                    + '<span style="color:#f00;">' + text.substring(index, index + seedLength) + '</span>'
                    + text.substring(index + seedLength);
                var cell = document.createElement("div");
                cell.innerHTML = coloured;
                table.insertRow(table.rows.length).insertCell(0)
                    .appendChild(cell);              
            }
            innerPanel.appendChild(table);
            panel.appendChild(innerPanel);
        }
        div.appendChild(panel);
    }
}

/**
 * funkcja przygotowujaca do wyswietlenia ekran piaty z wizualizacja procesu rozszerzania podslowa
 */
function prepareScreen5() {
    var div = document.getElementById("RatingRecords");
    //czyszczenie zawartości
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
	//petla po podslowach
    for (var i = 0; i < seeds.length; ++i) {
		//petla po slowach-ziarnach
        for (var j = 0; j < seeds[i].length; ++j) {
			//petla po wyszukanych bazodanowych rekordach
            for (var k = 0; k < searchResults[i][j].length; ++k) {
                var text = databaseSets[searchResults[i][j][k].DbSetNr];
                var seed = searchResults[i][j][k].seed;
                var index = searchResults[i][j][k].index;
				var leftOffset = searchResults[i][j][k].moveLeft;
                var header1 = document.createElement('h3');
                header1.innerHTML = "Podsłowo: " + tokens[i];
                var header2 = document.createElement('h3');
                header2.innerHTML = "Słowo- ziarno: " + seeds[i][j].sequence;
                var header3 = document.createElement('h4');
                header3.innerHTML = "Wynik: " + searchResults[i][j][k].score.toString();
                if (searchResults[i][j][k].score < tresholdC)
                    header3.innerHTML = header3.innerHTML +  '<span style="color:#f00;"> Rekord odrzucony</span>';
                var table = document.createElement('table');
                table.className = "table table-bordered";
                var row_0 = table.insertRow(table.rows.length);
                var row_1 = table.insertRow(table.rows.length);
				//petla po kolejnych nukleotydach w sekwencji
                for (var l = 0; l < text.length; ++l) {
					//wyswietlanie znalezionego rekordu z bazy
                    row_0.insertCell(l).appendChild(document.createTextNode(text[l]));
					//wyswietlanie rozszerzonego podslowa 
					//wyswietlenie pustych komorek
                    if (l < index - leftOffset || l >= index - leftOffset + seed.length) {
                        row_1.insertCell(l).appendChild(document.createTextNode(''));
                    }
					//wyswietlenie nukleotydu rozszerzonego podslowa
                    else {
                        row_1.insertCell(l).appendChild(document.createTextNode(seed[l - index + leftOffset]));
                    }
                }
                div.appendChild(header1);
                div.appendChild(header2);
                div.appendChild(header3);
                div.appendChild(table);
            }
        }
    }
}

/**
 * funkcja przetwarzajaca pojedynczy krok rozszerzania podslowa
 */
function processStep() {
    finished = true;
    for (var i = 0; i < searchResults.length; ++i) {
        for (var j = 0; j < searchResults[i].length; ++j) {
            for (var k = 0; k < searchResults[i][j].length; ++k) {
				//wyciagniecie z obiektow reprezentujacych znalezione rekordy informacji potrzebnych do rozszerzenia podslowa
                var searchedSeed = searchResults[i][j][k];
                var moveLeft = searchedSeed.moveLeft;
                var indexInDbSet = searchedSeed.index - moveLeft;
                var indexInSequence = i - moveLeft;
                var databaseSet = databaseSets[searchedSeed.DbSetNr];
                var seed = searchedSeed.seed;
                var currScore = searchedSeed.score;
                if (currScore >= tresholdC&&seed.length<sequence.length) { //przetwarzamy tylko rekordy o minimalnej zgodności
                    var result = expand(seed,sequence,databaseSet,indexInSequence, indexInDbSet, matrix,currScore);
					
					//jezeli udało się rozszerzyć chociaz jeden rekord to nie skonczylismy
					if(result.expandedLeft || result.expandedRight)
					{
						finished = false; 
					}
					
                    //logika aktualizujaca rekord w searchResults - do napisania
                    searchResults[i][j][k].score = result.newScore;
					//aktualizacja wskaznika pokazujacego o ile slowo zostalo rozszerzone w lewo
					if(result.expandedLeft)
					{
						searchResults[i][j][k].moveLeft = searchResults[i][j][k].moveLeft + 1; 
					}
					searchResults[i][j][k].seed = result.newSeed;                    
                }
            }
        }
    }
    if(finished) alert("Wykonano wszystkie kroki algorytmu, możesz przejść do kolejnego etapu.")
}

/**
 * funkcja podlaczona pod przycisk "Wykonaj krok" rozszrzajaca podslowa o 1 nukleotyd w obie strony i odswiezajaca widok
 */
function executeStep() {
    processStep();
    prepareScreen5();
}

/**
 * funkcja podlaczona pod przycisk "Przelicz wszystko" rozszerzajaca wszystkie podslowa 
 * az do spadku ponizej prog C lub osiagniecia pelnej zadanej sekwencji
 */
function executeAll() {
    //wykonaj wszystkie kroki do konca
    while (!finished) processStep();
    prepareScreen5();
}

/**
 * funkcja przygotowujaca do wyswietlenia ekran szosty z prezentacja wynikow lokalnej oceny podobienstwa sekwencji z rekordami na bazie
 */
function prepareScreen6() {
    document.getElementById("sequenceLabel2").innerHTML = sequence;
    document.getElementById("gapPenaltyLabel").innerHTML = gapPenalty;
	//czyszczenie zawartosci
    var table = document.getElementById("Results");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
	
	//utworzenie tabelki z wynikami
    for (var i = 0; i < results.length; ++i) {
        var row=table.insertRow(table.rows.length);
        var cell0 = row.insertCell(0).appendChild(document.createTextNode(results[i].sequence));
		var cell1 = row.insertCell(1).appendChild(document.createTextNode(results[i].score));
    }
}

/**
 * funkcja wyznaczajca wartosci oceny lokalnego podobienstwa dla zadanej sekwencji i rekordow po etapie rozszerzania
 */
function finish() {
    if (finished) {
        gapPenalty = document.getElementById("gapPenalty").value;
        //rekordy z bazy danych bez powtórzeń - filtracja wynikow rozszerzania
        var disctinctDbSetNrs = new Array();
        for (var i = 0; i < searchResults.length; ++i) {
            for (var j = 0; j < searchResults[i].length; ++j) {
                for (var k = 0; k < searchResults[i][j].length; ++k) {
                    if (searchResults[i][j][k].score > tresholdC) {
                        if (disctinctDbSetNrs.indexOf(searchResults[i][j][k].DbSetNr) == -1)
                            disctinctDbSetNrs.push(searchResults[i][j][k].DbSetNr);
                    }
                } 
            }
        }
		//wyznaczenie lokalnego podobienstwa
        results = new Array();
        for (var i=0; i < disctinctDbSetNrs.length; ++i) {
            var dbSequence = databaseSets[disctinctDbSetNrs[i]];			
            var result = smithWaterman(dbSequence, sequence, matrix, parseInt(gapPenalty));
            results.push({ sequence: dbSequence, score: result[0].score}); 
        }
        results.sort(function (a, b) { return parseInt(b.score) - parseInt(a.score) }); //sortowanie wynikow oceny podobienstwa (malejąco)
        prepareScreen6();
        show("Screen6");
    }
    else {
        alert('Nie wykonano wszystkich kroków algorytmu!');
    }
}

/**
 * funkcja obslugujaca zakonczenie konfiguracji na ekranie pierwszym i wyliczenie wartosci potrzebnych na ekranach II - IV
 */
function processScreen1() {
    finished = false;
	//wyciagniecie konfiguracji algorytmu z formatek
    matrix = new Array();
    for (var i = 0; i < letters.length; ++i) {
        matrix.push([]);
        for (var j = 0; j < letters.length; ++j) {
            matrix[i][j] = document.getElementById(letters[i] + "to" + letters[j]).value;
        }
    }
    sequence = document.getElementById("sequence").value;
    wordLength = document.getElementById('word_length').value;
	var tresholdT = parseInt(document.getElementById("TresholdT").value);
	tresholdC = parseInt(document.getElementById("TresholdC").value);
	var gapPenalty = parseInt(document.getElementById("gapPenalty").value);
	
	//walidacje danych wejściowych
    var err = "";
    if (!validateSequence(sequence)) err += "Nieprawidłowy ciąg wejściowy!\n";
    if (!validateInputLength(wordLength)) err += "Nieprawidłowa długość słowa!\n";
    if (!validateSequenceLength(wordLength, sequence.length)) err += "Długość słowa musi być mniejsza lub równa długości wyszukiwanej sekwencji!\n";
    if (!validateMatrix(matrix)) err += "Nieprawidłowe wartości w macierzy!\n";
	if (!validateMinimumScore(tresholdT)) err += "Niewłaściwa wartość progu T!\n";
	if (!validateMinimumScore(tresholdC)) err += "Niewłaściwa wartość progu C!\n";
	if (!validateMinimumScore(gapPenalty)) err += "Wartość kary za przerwę powinna być liczbą!\n";
	if (!databaseOK) err += "W bazie znajdują się błędne rekordy!\n";

	
    if (err == "") {
        //DZIAŁANIE ALGORYTMU
        sequence = sequence.toUpperCase();
        //PODZIAŁ NA PODSŁOWA
        tokens = tokenize(sequence, parseInt(wordLength))
        prepareScreen2();

        //GENERACJA GRUP SŁÓW - ZIAREN
        //obiekt seeds - tablica tablic, w każdym rzędzie tablica słów ziaren uzyskanych dla jednego podsłowa z obiektu tokens
        seeds = new Array();
		
        for (var i = 0; i < tokens.length; ++i) {            
            var seedsForToken = findHSP(tokens[i], matrix, tresholdT); //tutaj skrypt generujacy slowa ziarna dla token[i]
            seeds.push(seedsForToken);
        }
        prepareScreen3();
        //WYSZUKIWANIE CIAGÓW ZAWIERAJĄCYCH SŁOWA - ZIARNA
        //aktualizacja bazy danych zawierających rekordy
        databaseSets = new Array();
        var dnaRecords = document.getElementById("DNARecords");
        for (var i = 0; i < dnaRecords.rows.length; ++i) {
            databaseSets.push(dnaRecords.rows[i].cells[0].firstChild.value);
        }
        //searchResults jest tablicą wielowymiarowa: 
        //[indeks podslowa]
        //[indeks ziarna]
        //[[indeks slowa z bazy danych],[indeks ziarna w slowie z bazy],[dlugosc],[przesuniecie w lewo],[ocena]] 
        searchResults = new Array();
        for (var i = 0; i < tokens.length; ++i) {
            //podslowa
            var indexesForSubword = new Array();
            for (var j = 0; j < seeds[i].length; ++j) {
                var indexesForSeed = new Array();
                //slowa ziarna
                for (var k = 0; k < databaseSets.length; ++k) {
                    //slowa w bazie
                    databaseRecord = databaseSets[k];
                    var index = databaseRecord.indexOf(seeds[i][j].sequence);
					//offset pozwala okreslic indeks znalezionego slowa ziarna liczony od poczatku rekordu z bazy
					var offset = 0;
                    //wystapienie w roznych miejscach dla tego samego slowa
                    while (index > -1) {
                        var token = tokens[i];
                        var token_length = token.length;
						//lokalne skrocenie zmiennej pomocniczej zawierajacej rekord z bazy, aby nie wpasc w nieskonczona petle
                        var stringToCompare = databaseRecord.substring(index, index+token_length);
                        var rate = score(token,stringToCompare,matrix); 
                        indexesForSeed.push({ DbSetNr: k, seed: token, index: index + offset, moveLeft: 0, score: rate });
                        offset = offset + index + token_length;
                        databaseRecord = databaseRecord.substring(index + token_length);
                        index = databaseRecord.indexOf(seeds[i][j].sequence);
                    }
                }
                indexesForSubword.push(indexesForSeed);
            }
            searchResults.push(indexesForSubword);
        }
        prepareScreen4();

        //DODAWANIE KOLEJNYCH NUKLEOTYDÓW
        tresholdC = document.getElementById("TresholdC").value;
        prepareScreen5();
		//wyswietlenie ekranu II
        show("Screen2");
    }
	//obsluga bledow walidacji
    else {
        alert(err);
    }
}

/**
 * funkcja przywracajaca domyslne wartosci w macierzy podobienstwa
 */
function resetMatrix() {
    var id = "";
    for (var i = 0; i < letters.length; ++i) {
        for (var j = 0; j < letters.length; ++j) {
            id = letters[i] + "to" + letters[j];
            document.getElementById(id).value = defaultMatrixValues[i][j];
        }
    }
}

/**
 * funkcja usuwajaca rekord z bazy danych
 */
function deleteRow(button) {
    if (confirm("Czy na pewno chcesz usunąć rekord?")) {
        var i = button.parentNode.parentNode.rowIndex;
        document.getElementById('DNARecords').deleteRow(i);
    }
};

/**
 * funkcja dodajaca miejsce na wpowadzenie nowego rekordu do bazy danych 
 */
function addRow(table, text, disabled) {
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    cell1.style = "width: 95%";
    var element1 = document.createElement("input");
    element1.type = "text";
    element1.class = "form-control";
    element1.style = "width: 100%";
    if (disabled) element1.disabled = "true";
    element1.value = text;
	//popdiecie walidacji
	element1.onblur = function() {validateDatabaseChange()};
    cell1.appendChild(element1);
    var cell2 = row.insertCell(1);
    var element2 = document.createElement("a");
    element2.class = "btn btn-lg";
    element2.value = "Usuń";
	//podpiecie usuwania rekordu
    element2.onclick = function () { deleteRow(this); }
    element2.innerHTML="<span class='glyphicon glyphicon-trash' aria-hidden='true'></span>";
    cell2.appendChild(element2);
}

/**
 * funkcja walidujaca poprawnosc rekordow na bazie danych (moze dzialac wolno dla zmian w duzej bazie!)
 */
function validateDatabaseChange()
{
	databaseOK = true;
	var dnaRecords = document.getElementById("DNARecords");
	//walidacja kolejnych bazodanowych sekwencji
	for (var i = 0; i < dnaRecords.rows.length; ++i) 
	{
		if(!validateSequence(dnaRecords.rows[i].cells[0].firstChild.value))
		{
			databaseOK = false;
			break;
		}        
    }
}

/**
 * funkcja przywracajaca domyslne wartosci w bazie danych podpiera pod przycisk "Resetuj baze danych"
 */
function resetDNARecords() {
    var table = document.createElement('tbody');
    table.id = 'DNARecords';
    for (var i = 0; i < defaultDatabaseSets.length; ++i) {
        addRow(table, defaultDatabaseSets[i], true)
    }
    var old_tbody = document.getElementById('DNARecords');
    old_tbody.parentNode.replaceChild(table, old_tbody)
}

/**
 * funkcja podpieta pod przycisk "dodaj ciag"
 */
function addDNARecord() {
    var table = document.getElementById('DNARecords');
    addRow(table, "", false);
}

$(document).ready(function () {
    resetMatrix();
    resetDNARecords();
});
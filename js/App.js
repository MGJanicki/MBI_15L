/***************************************
 *			START Utils.js		       *
 ***************************************/
 
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

//rekurencyjna funkcja generujÄ…ca wszystkie moĹĽliwe sekwencje o zadanej dĹ‚ugoĹ›ci
function generateAllSequences(length, depth)
{
	if(length === depth)
	{
		return ['A', 'C', 'G', 'T'];
	}

	//tablice potrzebne przy generowaniu sekwencji - z wynikami dziaĹ‚ania poziom niĹĽej oraz wyjĹ›ciowa
	var returnArray = [];
	var partialSequencesArray = generateAllSequences(length, depth + 1);
	
	for(i = 0; i < partialSequencesArray.length; i++)
	{
		for(j = 0; j < 4; j++)
		{
			//doklejenie kolejnego nukleotydu do sekwencji - pÄ™tla w pÄ™tli zapewnia rozpatrzenie wszystkich moĹĽliwoĹ›ci
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
 
 function validateSequence(sequence)
{
	//podniesienie tekstu do wilekich liter - moĹĽna walidowaÄ‡
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

function validateInputLength(inputLength)
{
	return !isNaN(parseInt(inputLength)) && parseInt(inputLength) > 0;
}

function validateSequenceLength(inputLength, sequenceLength)
{
	return !isNaN(inputLength) && !isNaN(sequenceLength) && sequenceLength > inputLength;
}

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
 
function getToken(word, tokenLength, position)
{
	return word.substring(position, position + tokenLength);
}

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
 //funkcja oceny pary sekwencji dla zadanej macierzy podobieĹ„stwa
//zaĹ‚oĹĽenie - sekwencje na wejĹ›ciu sÄ… tej samej dĹ‚ugoĹ›ci (w koĹ„cu sami produkujemy sequence2 na podstawie sequence1)
function score(sequence1, sequence2, scoringMatrix)
{
	var score = 0;
	var nucleotideIndex1; //indeks w macierzy podobieĹ„stwa nukleotydu z pierwszej sekwencji
	var nucleotideIndex2; //indeks w macierzy podobieĹ„stwa nukleotydu z drugiej sekwencji
	for(i = 0; i < sequence1.length; i++)
	{
		nucleotideIndex1 = getNucletideIndex(sequence1[i]);
		nucleotideIndex2 = getNucletideIndex(sequence2[i]);
		score = score + parseInt(scoringMatrix[nucleotideIndex1][nucleotideIndex2]);
	}
	return score;
}

//funkcja znajdujÄ…ca wszystkie wysoko oceniane pary dla zadanej sekwencji
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

﻿var shown = 'Info';
var defaultDatabaseSets = ["ATTGATTTAGTATATTATTAAATGTATATATTAATTCAATATTATTATTCTATTCATTTTTATTCATTTT",
    "ATTGATTTAGTATATGATTAAATGTATATATTAATTCAATATTATTATTCTATTCATTTTTATTCATTTT",
    "ATTGATTTAGTATATTGTTAAATGTATATATTAATTCAATTTTATTATTCTATTCATTTTTATTCATTTT",
    "ATTGATTTAGTTTATTATTAAAGGTATATATTAATTCAATATTATTATTCTATTCATTTTTTTTCATTTT",
    "AATGATTTAGTTTATTATTAAAGGTATATATTAATTCAATATTATTATTCTATTCATTTTTTTTCATTTT",
    "CAAGAAGCGATGGGAACGATGTAATCCATGAATACAGAAGATTCAATTGAAAAAGATCCTAATGATTCAT",
    "TTCATATTCAATTAAAATTGAAATTTTTTCATTCGCGAGGAGCCGGATGAGAAGAAACTCTCATGTCCGG",
    "CAAATTTATAATATATTAATCTATATATTAATTTAGAATTCTATTCTAATTCGAATTCAATTTTTAAATA"];
var defaultMatrixValues = [
    [1, -1, -1, -1],
    [-1, 1, -1, -1],
    [-1, -1, 1, -1],
    [-1, -1, -1, 1]
];

var letters = ["A", "C", "G", "T"];

var matrix = [
    [1, -1, -1, -1],
    [-1, 1, -1, -1],
    [-1, -1, 1, -1],
    [-1, -1, -1, 1]
];
var sequence = "";
var wordLength = "";
var databaseSets;
var tokens = [];
var seeds;
var searchResults;
var tresholdC;
var finished=false;

function show(subpageToShow) {
    document.getElementById(shown).style.display = 'none';
    document.getElementById(subpageToShow).style.display = 'block';
    shown = subpageToShow;
    return false;
}

function refreshTokens() {
    var table = document.getElementById("Tokens");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    for (var i = 0; i < tokens.length; ++i) {
        table.insertRow(table.rows.length).insertCell(0).appendChild(document.createTextNode(tokens[i]));
    }
}

function prepareScreen2() {
    document.getElementById("sequenceLabel").innerHTML = sequence;
    document.getElementById("wordLengthLabel").innerHTML = wordLength.toString();
    refreshTokens();
}

function prepareScreen3() {
    var div = document.getElementById("TokensAndSeeds");
    //czyszczenie zawartości
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
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

function prepareScreen4() {
    var div = document.getElementById("SearchResults");
    //czyszczenie zawartości
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    for (var i = 0; i < seeds.length ; ++i) {
        var panel = document.createElement("div");
        panel.className = "panel panel-default";
        var panelTitle = document.createElement("div");
        panelTitle.className = "panel-heading";
        var heading = document.createElement("h3");
        heading.innerHTML = tokens[i];
        panelTitle.appendChild(heading);
        panel.appendChild(panelTitle);
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

function finish() {
    if (finished) {
        show("Screen6");
    }
    else {
        alert('Nie wykonano wszystkich kroków algorytmu!');
    }
}

function prepareScreen5() {
    var div = document.getElementById("RatingRecords");
    //czyszczenie zawartości
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    for (var i = 0; i < seeds.length; ++i) {
        for (var j = 0; j < seeds[i].length; ++j) {
            for (var k = 0; k < searchResults[i][j].length; ++k) {
                var text = databaseSets[searchResults[i][j][k].DbSetNr];
                var seed = searchResults[i][j][k].seed;
                var index = searchResults[i][j][k].index;
				var leftOffset = searchResults[i][j][k].moveLeft;
                var header1 = document.createElement('h3');
                header1.innerHTML = "Słowo- ziarno: " + seed;
                var header2 = document.createElement('h4');
                header2.innerHTML = "Wynik: " + searchResults[i][j][k].score.toString();
                if (searchResults[i][j][k].score < tresholdC)
                    header2.innerHTML = header2.innerHTML +  '<span style="color:#f00;"> Rekord odrzucony</span>';
                var table = document.createElement('table');
                table.className = "table table-bordered";
                var row_0 = table.insertRow(table.rows.length);
                var row_1 = table.insertRow(table.rows.length);
                for (var l = 0; l < text.length; ++l) {
                    row_0.insertCell(l).appendChild(document.createTextNode(text[l]));
                    if (l < index - leftOffset || l >= index - leftOffset + seed.length) {
                        row_1.insertCell(l).appendChild(document.createTextNode(''));
                    }
                    else {
                        row_1.insertCell(l).appendChild(document.createTextNode(seed[l - index + leftOffset]));
                    }
                }
                div.appendChild(header1);
                div.appendChild(header2);
                div.appendChild(table);
            }
        }
    }
}

function processStep() {
    finished = true;
    for (var i = 0; i < searchResults.length; ++i) {
        for (var j = 0; j < searchResults[i].length; ++j) {
            for (var k = 0; k < searchResults[i][j].length; ++k) {
                var searchedSeed = searchResults[i][j][k];
                var moveLeft = searchedSeed.moveLeft;
                var indexInDbSet = searchedSeed.index - moveLeft;
                var indexInSequence = i - moveLeft;
                var databaseSet = databaseSets[searchedSeed.DbSetNr];
                var seed = searchedSeed.seed;
                var currScore = searchedSeed.score;
                if (currScore >= tresholdC&&seed.length<sequence.length) { //przetwarzamy tylko rekordy o minimalnej zgodności
					//(seed, sequence1, sequence2, seq1Index, seq2Index, scoringMatrix, oldScore)
                    var result = expand(seed,sequence,databaseSet,indexInSequence, indexInDbSet, matrix,currScore);
					
					//jezeli udało się rozszerzyć chociaz jeden rekord to nie skonczylismy
					if(result.expandedLeft || result.expandedRight)
					{
						finished = false; 
					}
					
                    //logika aktualizujaca rekord w searchResults - do napisania
                    searchResults[i][j][k].score = result.newScore;
					if(result.expandedLeft)
					{
						searchResults[i][j][k].moveLeft = searchResults[i][j][k].moveLeft + 1; //trochę nie ufam operatorowi ++
					}
					searchResults[i][j][k].seed = result.newSeed;                    
                }
            }
        }
    }
}


function executeStep() {
    processStep();
    prepareScreen5();
}

function executeAll() {
    //wykonaj wszystkie kroki do konca
    while (!finished) processStep();
    prepareScreen5();
}

function processScreen1() {
    finished = false;
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
	
    var err = "";
    if (!validateSequence(sequence)) err += "Nieprawidłowy ciąg wejściowy! ";
    if (!validateInputLength(wordLength)) err += "Nieprawidłowa długość słowa! ";
    if (!validateSequenceLength(wordLength, sequence.length)) err += "Długość słowa musi być mniejsza lub równa długości wyszukiwanej sekwencji";
    if (!validateMatrix(matrix)) err += "Nieprawidłowe wartości w macierzy!" ;
	if (!validateMinimumScore(tresholdT)) err += "Niewłaściwa wartość progu T";

    if (err == "") {
        //DZIAŁANIE ALGORYTMU
        //wartosci testowe: GATTTAGTATTTTATTAAATGT, dlugosc= 7
        //PODZIAŁ NA PODSŁOWA
        tokens = tokenize(sequence, parseInt(wordLength)) //tutaj skrypt dzielacy na podslowa
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
					var offset = 0;
                    //wystapienie w roznych miejscach dla tego samego slowa
                    while (index > -1) {
                        var seed = seeds[i][j].sequence;
                        var seed_length = seed.length;
                        var stringToCompare = databaseRecord.substring(index, index+seed_length);
                        var rate = score(seed,stringToCompare,matrix); 
                        indexesForSeed.push({ DbSetNr: k, seed: seed, index: index + offset, moveLeft: 0, score: rate });
						offset = offset + index + seeds[i][j].sequence.length;
                        databaseRecord = databaseRecord.substring(index + seeds[i][j].sequence.length);
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
        show("Screen2");
    }
    else {
        alert(err);
    }
}

function resetMatrix() {
    var id = "";
    for (var i = 0; i < letters.length; ++i) {
        for (var j = 0; j < letters.length; ++j) {
            id = letters[i] + "to" + letters[j];
            document.getElementById(id).value = defaultMatrixValues[i][j];
        }
    }
}

function deleteRow(button) {
    if (confirm("Czy na pewno chcesz usunąć rekord?")) {
        var i = button.parentNode.parentNode.rowIndex;
        document.getElementById('DNARecords').deleteRow(i);
    }
};

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
    cell1.appendChild(element1);
    var cell2 = row.insertCell(1);
    var element2 = document.createElement("a");
    element2.class = "btn btn-lg";
    element2.value = "Usuń";
    element2.onclick = function () { deleteRow(this); }
    element2.innerHTML="<span class='glyphicon glyphicon-trash' aria-hidden='true'></span>";
    cell2.appendChild(element2);
}

function resetDNARecords() {
    var table = document.createElement('tbody');
    table.id = 'DNARecords';
    for (var i = 0; i < defaultDatabaseSets.length; ++i) {
        addRow(table, defaultDatabaseSets[i], true)
    }
    var old_tbody = document.getElementById('DNARecords');
    old_tbody.parentNode.replaceChild(table, old_tbody)
}

function addDNARecord() {
    var table = document.getElementById('DNARecords');
    addRow(table, "", false);
}

$(document).ready(function () {
    resetMatrix();
    resetDNARecords();
});
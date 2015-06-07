/***************************************
 *			START Validator.js		   *
 ***************************************/
 
 function validateSequence(sequence)
{
	//podniesienie tekstu do wilekich liter - można walidować
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
            table.insertRow(table.rows.length).insertCell(0).appendChild(document.createTextNode(seeds[i][j]));
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
            innerHeading.innerHTML = seeds[i][j];
            innerPanelTitle.appendChild(innerHeading);
            innerPanel.appendChild(innerPanelTitle);
            var table = document.createElement('table');
            table.className = "table table-striped";
            for (var k = 0; k < searchResults[i][j].length; ++k) {
                var text = databaseSets[searchResults[i][j][k][0]];
                var index =searchResults[i][j][k][1];
                var seedLength=seeds[i][j].length;
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

function processScreen1() {
    matrix = new Array();
    for (var i = 0; i < letters.length; ++i) {
        matrix.push([]);
        for (var j = 0; j < letters.length; ++j) {
            matrix[i][j] = document.getElementById(letters[i] + "to" + letters[j]).value;
        }
    }
    sequence = document.getElementById("sequence").value;
    wordLength = document.getElementById('word_length').value;
	
    var err = "";
    if (!validateSequence(sequence)) err += "Nieprawidłowy ciąg wejściowy! " //tutaj walidacja ciagu wejsciowego
    if (!validateInputLength(wordLength)) err += "Nieprawidłowa długość słowa! "
    if (!validateSequenceLength(wordLength, sequence.length)) err += "Długość słowa musi być mniejsza lub równa długości wyszukiwanej sekwencji"
    if (!validateMatrix(matrix)) err += "Nieprawidłowe wartości w macierzy!" //tutaj walidacja macierzy

    if (err == "") {
        //DZIAŁANIE ALGORYTMU
        //wartosci testowe: GATTTAGTATTTTATTAAATGT, dlugos= 7
        //PODZIAŁ NA PODSŁOWA
        tokens = ["GATTTAG", "ATTTAGT", "TTTAGTA", "TTAGTAT"] //tutaj skrypt dzielacy na podslowa
        prepareScreen2();

        //GENERACJA GRUP SŁÓW - ZIAREN
        //obiekt seeds - tablica tablic, w każdym rzędzie tablica słów ziaren uzyskanych dla jednego podsłowa z obiektu tokens
        seeds = new Array();
        for (var i = 0; i < tokens.length; ++i) {
            var tresholdT = document.getElementById("TresholdT");
            var seedsForToken = ["GATTTAG","ATTTAGT","TTTAGTA","TTAGTAT"]; //tutaj skrypt generujacy slowa ziarna dla token[i]
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
        //[indeks podslowa][indeks ziarna][[indeks slowa w bazie],[indeks ziarna w slowie z bazy]] 
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
                    var index = databaseRecord.indexOf(seeds[i][j])
                    //wystapienie w roznych miejscach dla tego samego slowa
                    while (index > -1) {
                        indexesForSeed.push([k,index]);
                        databaseRecord = databaseRecord.substring(index + seeds[i][j].length);
                        index = databaseRecord.indexOf(seeds[i][j])
                    }
                }
                indexesForSubword.push(indexesForSeed);
            }
            searchResults.push(indexesForSubword);
        }
        prepareScreen4();

        //DODAWANIE KOLEJNYCH NUKLEOTYDÓW
        tresholdC = document.getElementById("TresholdC");
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

//#region DNADatabase

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

//#end region

$(document).ready(function () {
    resetMatrix();
    resetDNARecords();
});
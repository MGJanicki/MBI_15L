var shown = 'Info';
var databaseSets = ["ATTGATTTAGTATATTATTAAATGTATATATTAATTCAATATTATTATTCTATTCATTTTTATTCATTTT",
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
var tokens = [];
var seeds;

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
    if (1 != 1) err += "Nieprawidłowy ciąg wejściowy! " //tutaj walidacja ciagu wejsciowego
    if (isNaN(parseInt(wordLength))) err += "Nieprawidłowa długość słowa! "
    if(parseInt(wordLength)>parseInt(sequence.length)) err += "Długość słowa musi być mniejsza lub równa długości wyszukiwanej sekwencji"
    if (1 != 1) err += "Nieprawidłowe wartości w macierzy!" //tutaj walidacja macierzy


    if (err == "") {
        //DZIAŁANIE ALGORYTMU
        //PODZIAŁ NA PODSŁOWA
        tokens = ['ACGTC', 'CCCAG', 'AAACTG', 'GTCSC'] //tutaj skrypt dzielacy na podslowa
        prepareScreen2();

        //GENERACJA GRUP SŁÓW - ZIAREN
        //obiekt seeds - tablica tablic, w każdym rzędzie tablica słów ziaren uzyskanych dla jednego podsłowa z obiektu tokens
        seeds = new Array();
        for (var i = 0; i < tokens.length; ++i) {
            var seedsForToken = ["AAAAA", "ACCGGT", "ACGTC", "ACGR"]; //tutaj skrypt generujacy slowa ziarna dla token[i]
            seeds.push(seedsForToken);
        }
        prepareScreen3();
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
    for (var i = 0; i < databaseSets.length; ++i) {
        addRow(table, databaseSets[i], true)
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

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

var matrix = [
    [1, -1, -1, -1],
    [-1, 1, -1, -1],
    [-1, -1, 1, -1],
    [-1, -1, -1, 1]
];

var letters = ["A", "C", "G", "T"];

function show(subpageToShow) {
    document.getElementById(shown).style.display = 'none';
    document.getElementById(subpageToShow).style.display = 'block';
    shown = subpageToShow;
    return false;
}

var sequence = "";

function processScreen1() {
    matrix = new Array();
    for (var i = 0; i < letters.length; ++i) {
        matrix.push([]);
        for (var j = 0; j < letters.length; ++j) {
            matrix[i][j] = document.getElementById(letters[i] + "to" + letters[j]).value;
        }
    }

    sequence = document.getElementById("sequence").value;
    var err = "";
    if (1 != 1) err += "Nieprawidłowy ciąg wejściowy! " //tutaj walidacja ciagu wejsciowego
    if(1!= 1) err+="Nieprawidłowe wartości w macierzy!" //tutaj walidacja macierzy

    if (err=="") { 
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
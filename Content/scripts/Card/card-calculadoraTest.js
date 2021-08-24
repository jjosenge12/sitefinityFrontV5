alert("hola!");

var valorPantalla = 0;
var numeroA;
var numeroB;
var operacion;
var enableB = false;
var ultimoTotal = 0;


function numero(dato) {
    var auxiliar = document.getElementById("pantalla").value;
    document.getElementById("pantalla").value = auxiliar + dato; 
    valorPantalla = document.getElementById("pantalla").value = auxiliar + dato;
}


function operacion(tipo) {
    numeroA = valorPantalla;
    operacion = tipo;
    if (numeroA != null && numeroA != 0)
        enableB = true;
}

function reset() {
    document.getElementById('pantalla').value = '';
    valorPantalla = 0;
    operacion = "";
    enableB = false;
}
function limpiar() {
    document.getElementById('pantalla').value = '';
}

function resultado() {
    numeroB = valorPantalla;
    calcular();
}

function calcular() {
    var total = 0;
    switch (operacion) {
        case "+":
            total = parseFloat(numeroA) + parseFloat(numeroB);
            break;
        case "-":
            total = parseFloat(numeroA) - parseFloat(numeroB);
            break;
        case "*":
            total = parseFloat(numeroA) * parseFloat(numeroB);
            break;
        case "/":
            total = parseFloat(numeroA) / parseFloat(numeroB);
            break;
    }
    ultimoTotal = total;
    reset();
    document.getElementById('pantalla').value = total;
    valorPantalla = ultimoTotal;
}
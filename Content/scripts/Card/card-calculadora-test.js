var valorPantalla = "";
var numeroA;
var numeroB;
var operacion;
var enableB = false;
var enableOperator = false;
var ultimoTotal = 0.0;
var auxiliar = "";
var auxiliar2 = "";


function numero(dato) {
    if (enableB === false) {
        if (document.getElementById("pantalla").value != "0")
            auxiliar = document.getElementById("pantalla").value;
        document.getElementById("pantalla").value = auxiliar + dato;
        valorPantalla = document.getElementById("pantalla").value;
    }
    else {
        auxiliar2 = auxiliar2 + dato;
        document.getElementById("pantalla").value = (document.getElementById("pantalla").value) + dato;
        console.log(auxiliar2);
    }
}


function operacion(tipo) {
    numeroA = valorPantalla;
    operador = tipo;
    if (numeroA != null && numeroA != 0 && enableOperator == false) {
        enableB = true
        enableOperator = true;
        document.getElementById("pantalla").value = (document.getElementById("pantalla").value) + " " + tipo;
    }
    else {
        borrar();
        borrar();
        document.getElementById("pantalla").value = (document.getElementById("pantalla").value) + " " + tipo;
    }
    console.log(numeroA);
}

function reset() {
    document.getElementById("pantalla").value = "0";
    enableB = false;
    enableOperator = false;
    valorPantalla = "";
    operador = null;
    auxiliar = "";
    auxiliar2 = "";
    numeroA = null;
    numeroB = null;
}

function borrar() {
    var ancho = document.getElementById("pantalla").value;
    if (ancho.length > 1) {
        document.getElementById("pantalla").value = ancho.substr(0, ancho.length - 1);
    }
    else {
        document.getElementById("pantalla").value = "0";
    }
}

function ultimoResultado() {
    if (document.getElementById("pantalla").value === "0") {
        document.getElementById("pantalla").value = ultimoTotal.toString();
        valorPantalla = document.getElementById("pantalla").value;
    }
    else {
        if (numeroA != null && numeroA != 0 && operador != null) {
            numero(ultimoTotal.toString());
        }
    }
}

function resultado() {
    numeroB = auxiliar2;
    calcular();
}

function calcular() {
    var total = 0;
    switch (operador) {
        case "+":
            total = parseFloat(numeroA) + parseFloat(numeroB);
            break;
        case "-":
            total = parseFloat(numeroA) - parseFloat(numeroB);
            break;
        case "x":
            total = parseFloat(numeroA) * parseFloat(numeroB);
            break;
        case "/":
            total = parseFloat(numeroA) / parseFloat(numeroB);
            break;
        default:
            document.getElementById("pantalla").value = "SYNTAX ERROR";
            break;
    }
    ultimoTotal = total;
    reset();
    document.getElementById("pantalla").value = total;
    console.log(ultimoTotal);
}
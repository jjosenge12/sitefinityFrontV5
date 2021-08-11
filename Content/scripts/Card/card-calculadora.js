var maxLength = 20, isResult = false, result = '0', syntaxError = false;

$(document).ready(function () {
    $(".calc-btn").click(function () {

        var value = $("#screen").html();

        switch (this.dataset.action) {
            case "number":
                if (value.length < maxLength) {
                    if ((value.length === 1 && value === '0') || isResult || syntaxError) {
                        $("#screen").html(this.innerHTML);
                        value = this.innerHTML;
                        isResult = false;
                        syntaxError = false;
                    }
                    else {
                        $("#screen").html(value + this.innerHTML);
                        value = value + this.innerHTML;
                    }
                }
                break;

            case "operator":
                if (value.length < maxLength) {
                    if (!syntaxError) {
                        $("#screen").html(value + this.innerHTML);
                        value = value + this.innerHTML;
                        isResult = false;
                        syntaxError = false;
                    }
                }
                break;

            case "clear":
                $("#screen").html('0');
                value = '0';
                isResult = false;
                syntaxError = false;
                break;

            case "backspace":
                if (value.length > 1 && !isResult && !syntaxError) {
                    value = value.substr(0, value.length - 1);
                    $("#screen").html(value);
                }
                else {
                    $("#screen").html('0');
                    value = '0';
                    isResult = false;
                    syntaxError = false;
                }
                break;
            case "calculate":
                let calculation = value.replaceAll('Ans', result);
                console.log(calculation);
                if (calculation.match(/^-?[0-9]+(.[0-9]+)?(((\+|-|×|÷){1}[0-9]+(.[0-9]+)?)+)?$/)) {
                    let res = String(calculate(calculation));
                    $("#screen").html(res);
                    value = res;
                    isResult = true;
                    result = res;
                    syntaxError = false;
                }
                else {
                    $("#screen").html('SYNTAX ERROR');
                    value = 'SYNTAX ERROR';
                    isResult = false;
                    syntaxError = true;
                }
                break;
        }
    });
});

const splitFirst = (string, regex) => {
    return [
        string.substr(0, string.indexOf(regex)),
        string.substr(string.indexOf(regex) + 1)
    ];
}

const calculate = (calculation) => {
    if (calculation.includes('+')) {
        let split = splitFirst(calculation, '+');
        return calculate(split[0]) + calculate(split[1]);
    }
    else if (calculation.includes('-')) {
        let split = splitFirst(calculation, '-');
        return calculate(split[0]) - calculate(split[1]);
    }
    else if (calculation.includes('÷')) {
        let split = splitFirst(calculation, '÷');
        return calculate(split[0]) / calculate(split[1]);
    }
    else if (calculation.includes('×')) {
        let split = splitFirst(calculation, '×');
        return calculate(split[0]) * calculate(split[1]);
    }
    else {
        return Number(calculation);
    }
}
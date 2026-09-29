const display =
    document.getElementById("display");

const expressionDisplay =
    document.getElementById("expression");

const keypad =
    document.querySelector(".keypad");

const scientificGrid =
    document.querySelector(".scientific-grid");

const degBtn =
    document.getElementById("degBtn");

const radBtn =
    document.getElementById("radBtn");

const memoryIndicator =
    document.getElementById("memoryIndicator");


let expression = "";

let lastAnswer = 0;

let memory = 0;

let angleMode = "DEG";

let justCalculated = false;


/* -----------------------------
   DISPLAY
----------------------------- */

function updateDisplay(value = expression || "0") {

    display.textContent = value;

    display.scrollLeft =
        display.scrollWidth;
}


/* -----------------------------
   NUMBER FORMAT
----------------------------- */

function formatNumber(number) {

    if (!Number.isFinite(number)) {

        throw new Error("Math Error");

    }

    if (Math.abs(number) < 1e-12) {

        number = 0;

    }

    return Number(
        number.toPrecision(12)
    ).toString();
}


/* -----------------------------
   FACTORIAL
----------------------------- */

function factorial(number) {

    if (
        !Number.isFinite(number) ||
        number < 0 ||
        !Number.isInteger(number)
    ) {

        throw new Error(
            "Factorial requires a positive integer"
        );

    }


    if (number > 170) {

        throw new Error(
            "Number too large"
        );

    }


    let result = 1;


    for (
        let i = 2;
        i <= number;
        i++
    ) {

        result *= i;

    }


    return result;
}


/* -----------------------------
   ANGLE CONVERSION
----------------------------- */

function toRadians(number) {

    if (angleMode === "DEG") {

        return number *
            Math.PI / 180;

    }

    return number;
}


function fromRadians(number) {

    if (angleMode === "DEG") {

        return number *
            180 / Math.PI;

    }

    return number;
}


/* -----------------------------
   ADD VALUE
----------------------------- */

function append(value) {

    if (
        justCalculated &&
        (
            /[0-9.]/.test(value) ||
            value === "π" ||
            value === "e"
        )
    ) {

        expression = "";

    }


    justCalculated = false;


    const last =
        expression.slice(-1);


    const operators =
        ["+", "−", "×", "÷", "^"];


    if (
        operators.includes(value) &&
        operators.includes(last)
    ) {

        expression =
            expression.slice(0, -1) +
            value;

    }

    else {

        expression += value;

    }


    updateDisplay();
}


/* -----------------------------
   CLEAR
----------------------------- */

function clearAll() {

    expression = "";

    expressionDisplay.textContent = "";

    justCalculated = false;

    updateDisplay();

}


/* -----------------------------
   DELETE
----------------------------- */

function deleteLast() {

    expression =
        expression.slice(0, -1);

    updateDisplay();

}


/* -----------------------------
   EVALUATOR
----------------------------- */

function calculateExpression(input) {

    let value = input;


    /* Operators */

    value =
        value.replaceAll("×", "*");

    value =
        value.replaceAll("÷", "/");

    value =
        value.replaceAll("−", "-");

    value =
        value.replaceAll("^", "**");


    /* Constants */

    value =
        value.replaceAll(
            "π",
            "Math.PI"
        );


    value =
        value.replace(
            /\be\b/g,
            "Math.E"
        );


    value =
        value.replace(
            /\bANS\b/g,
            `(${lastAnswer})`
        );


    /* Percent */

    value =
        value.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );


    /* Factorial */

    value =
        value.replace(
            /(\d+(?:\.\d+)?)!/g,
            (_, number) =>
                `factorial(${number})`
        );


    /* Scientific functions */

    value =
        value.replace(
            /sin\(/g,
            "sin("
        );


    value =
        value.replace(
            /cos\(/g,
            "cos("
        );


    value =
        value.replace(
            /tan\(/g,
            "tan("
        );


    value =
        value.replace(
            /asin\(/g,
            "asin("
        );


    value =
        value.replace(
            /acos\(/g,
            "acos("
        );


    value =
        value.replace(
            /atan\(/g,
            "atan("
        );


    value =
        value.replace(
            /log\(/g,
            "log10("
        );


    value =
        value.replace(
            /ln\(/g,
            "ln("
        );


    value =
        value.replace(
            /sqrt\(/g,
            "sqrt("
        );


    /* FUNCTIONS */

    const functions = {

        factorial,

        sin: number =>
            Math.sin(
                toRadians(number)
            ),

        cos: number =>
            Math.cos(
                toRadians(number)
            ),

        tan: number => {

            const radians =
                toRadians(number);


            if (
                Math.abs(
                    Math.cos(radians)
                ) < 1e-12
            ) {

                throw new Error(
                    "Undefined"
                );

            }


            return Math.tan(radians);

        },


        asin: number =>
            fromRadians(
                Math.asin(number)
            ),


        acos: number =>
            fromRadians(
                Math.acos(number)
            ),


        atan: number =>
            fromRadians(
                Math.atan(number)
            ),


        log10: number =>
            Math.log10(number),


        ln: number =>
            Math.log(number),


        sqrt: number =>
            Math.sqrt(number)

    };


    const fn =
        new Function(
            ...Object.keys(functions),
            `"use strict"; return (${value});`
        );


    return fn(
        ...Object.values(functions)
    );

}


/* -----------------------------
   CALCULATE
----------------------------- */

function calculate() {

    if (!expression) return;


    try {

        const oldExpression =
            expression;


        const result =
            calculateExpression(
                expression
            );


        expressionDisplay.textContent =
            oldExpression + " =";


        expression =
            formatNumber(result);


        lastAnswer =
            result;


        justCalculated = true;


        updateDisplay();

    }

    catch (error) {

        expressionDisplay.textContent =
            "Invalid expression";

        updateDisplay("Error");

        justCalculated = true;

    }

}


/* -----------------------------
   SCIENTIFIC FUNCTIONS
----------------------------- */

function scientificAction(action) {


    if (action === "pi") {

        append("π");

        return;

    }


    if (action === "e") {

        append("e");

        return;

    }


    if (action === "open") {

        append("(");

        return;

    }


    if (action === "close") {

        append(")");

        return;

    }


    if (action === "ans") {

        append("ANS");

        return;

    }


    if (action === "power") {

        append("^");

        return;

    }


    if (action === "square") {

        if (!expression) return;


        expression =
            `(${expression})^2`;


        updateDisplay();

        return;

    }


    if (action === "factorial") {

        if (!expression) return;


        expression =
            `(${expression})!`;


        updateDisplay();

        return;

    }


    if (action === "exp") {

        append("×10^");

        return;

    }


    const functions = {

        sin: "sin",

        cos: "cos",

        tan: "tan",

        asin: "asin",

        acos: "acos",

        atan: "atan",

        log: "log",

        ln: "ln",

        sqrt: "sqrt"

    };


    const functionName =
        functions[action];


    if (!functionName) return;


    const current =
        expression || "0";


    expression =
        `${functionName}(${current})`;


    calculate();

}


/* -----------------------------
   PERCENT
----------------------------- */

function percentage() {

    if (!expression) return;


    try {

        const result =
            calculateExpression(
                expression
            ) / 100;


        expressionDisplay.textContent =
            expression + "% =";


        expression =
            formatNumber(result);


        lastAnswer =
            result;


        justCalculated = true;


        updateDisplay();

    }

    catch {

        updateDisplay("Error");

    }

}


/* -----------------------------
   MEMORY
----------------------------- */

function memoryAction(action) {


    try {

        const current =
            expression
                ? calculateExpression(expression)
                : lastAnswer;


        if (action === "mc") {

            memory = 0;

        }


        if (action === "mr") {

            append(
                formatNumber(memory)
            );

        }


        if (action === "mplus") {

            memory += current;

        }


        if (action === "mminus") {

            memory -= current;

        }


        memoryIndicator
            .classList
            .toggle(
                "has-memory",
                memory !== 0
            );

    }

    catch {

        updateDisplay("Error");

    }

}


/* -----------------------------
   MAIN KEYPAD
----------------------------- */

keypad.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest("button");


        if (!button) return;


        const value =
            button.dataset.value;


        const action =
            button.dataset.action;


        if (value !== undefined) {

            append(value);

        }


        if (action === "clear") {

            clearAll();

        }


        if (action === "delete") {

            deleteLast();

        }


        if (action === "calculate") {

            calculate();

        }


        if (action === "percent") {

            percentage();

        }

    }
);


/* -----------------------------
   SCIENTIFIC BUTTONS
----------------------------- */

scientificGrid.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest("button");


        if (!button) return;


        const action =
            button.dataset.action;


        scientificAction(action);

    }
);


/* -----------------------------
   MEMORY BUTTONS
----------------------------- */

document
    .querySelector(".memory-row")
    .addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest("button");


            if (!button) return;


            memoryAction(
                button.dataset.action
            );

        }
    );


/* -----------------------------
   DEGREE / RADIAN
----------------------------- */

degBtn.addEventListener(
    "click",
    function() {

        angleMode = "DEG";

        degBtn.classList.add("active");

        radBtn.classList.remove("active");

    }
);


radBtn.addEventListener(
    "click",
    function() {

        angleMode = "RAD";

        radBtn.classList.add("active");

        degBtn.classList.remove("active");

    }
);


/* -----------------------------
   KEYBOARD SUPPORT
----------------------------- */

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key;


        if (/^[0-9.]$/.test(key)) {

            append(key);

        }


        else if (key === "+") {

            append("+");

        }


        else if (key === "-") {

            append("−");

        }


        else if (key === "*") {

            append("×");

        }


        else if (key === "/") {

            event.preventDefault();

            append("÷");

        }


        else if (key === "^") {

            append("^");

        }


        else if (
            key === "(" ||
            key === ")"
        ) {

            append(key);

        }


        else if (
            key === "Enter" ||
            key === "="
        ) {

            calculate();

        }


        else if (
            key === "Backspace"
        ) {

            deleteLast();

        }


        else if (
            key === "Escape"
        ) {

            clearAll();

        }


        else if (key === "%") {

            percentage();

        }

    }
);


/* INITIAL */

updateDisplay();
const calculator = {
  displayValue: "0",
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

const inputDigit = (digit) => {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue =
      displayValue === "0" ? digit : displayValue + digit;
    if (calculator.displayValue === "+/-") {
      handleSign();
    }
  }
};

const inputDecimal = (dot) => {
  if (calculator.waitingForSecondOperand === true) {
    calculator.displayValue = "0.";
    calculator.waitingForSecondOperand = false;
    return;
  }
  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
};

const handlePercent = () => {
  calculator.displayValue = (
    parseFloat(calculator.displayValue) / 100
  ).toString();
};

const handleSign = () => {
  calculator.displayValue = "0";
  calculator.displayValue = "-" + calculator.displayValue.replace("0", "");
};

const handleOperator = (nextOperator) => {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand === null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);

    if (operator === "/" && displayValue === "0") {
      calculator.displayValue = "Very funny";
      return;
    } else {
      calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
      calculator.firstOperand = result;
    }
  }
  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
};

const updateDisplay = () => {
  const display = document.querySelector(".calculator-screen");
  display.value = calculator.displayValue;
};

updateDisplay();

const keys = document.querySelector(".calculator-keys");

keys.addEventListener("click", (event) => {
  const { target } = event;

  if (!target.matches("button")) {
    return;
  }

  if (target.classList.contains("operator")) {
    handleOperator(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains("decimal")) {
    inputDecimal(target.value);
    updateDisplay();
    return;
  }
  if (target.classList.contains("percent")) {
    handlePercent(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains("all-clear")) {
    reset();
    updateDisplay();
    return;
  }
  inputDigit(target.value);
  updateDisplay();
});

const calculate = (firstOperand, secondOperand, operator) => {
  if (operator === "+") {
    return firstOperand + secondOperand;
  } else if (operator === "-") {
    return firstOperand - secondOperand;
  } else if (operator === "*") {
    return firstOperand * secondOperand;
  } else if (operator === "/") {
    return firstOperand / secondOperand;
  } else if (operator == "%") {
    return firstOperand / 100;
  }

  return secondOperand;
};

const reset = () => {
  calculator.displayValue = "0";
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
};

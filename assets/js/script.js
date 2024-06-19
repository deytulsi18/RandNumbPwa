/******* Getting the initial seed value from page load time *******/

let seed = Math.round(performance.now());
const MAX_NUM = Number.MAX_SAFE_INTEGER;
const maxLimitForNumberGeneration = 1e10;

/******* Function for getting execution time of some code snippet *******/

let doSomething = (limit) => {
  let num = 0;
  for (let i = 1; i <= limit; i++) {
    num += i;
  }
};

const getSomeCodeExecutionTime = () => {
  const startTime = Date.now();
  const timeElapsedSinceUnixEpoch = Date.now();
  const timeElapsedSincePageLoad = Math.round(performance.now());

  doSomething(
    (timeElapsedSinceUnixEpoch % 10) * 1e5 * (timeElapsedSincePageLoad % 10) * 7
  );

  const endTime = Date.now();

  const result = endTime - startTime;
  return result;
};

/******* Event Listner for generate button  *******/

const goButton = document.querySelector(".go-button");
const resultBox = document.querySelector(".result");

goButton.addEventListener("click", (e) => {
  resultBox.innerText = "?";
  resultBox.style.backgroundColor = `hsl(0, 0%, 35%)`;

  if (resultBox.classList.contains("rotation")) {
    resultBox.classList.remove("rotation");
    resultBox.classList.add("reverse-rotation");
  } else {
    resultBox.classList.remove("reverse-rotation");
    resultBox.classList.add("rotation");
  }

  goButton.classList.toggle("disable-click");
  goButton.innerText = "generating...";

  setTimeout(() => {
    getNumbers();
    goButton.innerText = "Go!!!";
    goButton.classList.toggle("disable-click");
  }, 1000);
});

/******* Event Listner for Input of Upper Limit *******/

let upperValue = document.querySelector("#upper-limit");

document.querySelectorAll(".value-change-button").forEach((elem) =>
  elem.addEventListener("click", (e) => {
    const type = e.target.getAttribute("data-type");

    if (type === "increment") {
      upperValue.value++;
    } else if (type === "decrement") {
      upperValue.value--;
    }
  })
);

/******* Function to check if a string is a valid Number *******/

let isNumeric = (str) => {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
};

/******* Function to get generate Random Number *******/

let getNumbers = () => {
  if (!isNumeric(upperValue.value)) {
    upperValue.value = 10;
  }

  upperValue.value = Math.floor(upperValue.value);

  if (upperValue.value < 1) {
    upperValue.value = 1;
  } else if (upperValue.value > maxLimitForNumberGeneration) {
    upperValue.value = maxLimitForNumberGeneration;
  }

  let timeElapsedSinceUnixEpoch = Date.now();

  let lowerLimit = 1;
  let upperLimit = document.querySelector("#upper-limit").value;

  let NoOfDigits = Math.ceil(Math.log10(upperLimit) + 0.001);

  // Adjusting the font size according to number of digits
  if (NoOfDigits >= 10) {
    resultBox.style.fontSize = "1.5rem";
  } else if (NoOfDigits >= 8) {
    resultBox.style.fontSize = "2rem";
  } else if (NoOfDigits >= 6) {
    resultBox.style.fontSize = "2.75rem";
  } else if (NoOfDigits >= 4) {
    resultBox.style.fontSize = "3.75rem";
  } else if (NoOfDigits < 4) {
    resultBox.style.fontSize = "5rem";
  }

  let SomeCodeExecutionTime = getSomeCodeExecutionTime();
  // console.log((seed % 1e9), (timeElapsedSinceUnixEpoch % 1e9), SomeCodeExecutionTime);

  const randomNumber =
    (((seed % 1e9) * (timeElapsedSinceUnixEpoch % 1e9)) % MAX_NUM) +
    SomeCodeExecutionTime;
  seed = randomNumber;

  const result = (randomNumber % upperLimit) + lowerLimit;
  // console.log(randomNumber, result)

  const colorNum = ((randomNumber % 10) + 1) * 36;

  document.querySelector("#result").innerText = result;
  document.querySelector("#result").style.backgroundColor = `hsl(${
    colorNum % 360
  }, 100%, 35%)`;
};

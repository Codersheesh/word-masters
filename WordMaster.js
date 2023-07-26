const wordURL = "https://words.dev-apis.com/word-of-the-day?random=1";
let i = 0;
let guessWord = "";
let guesses = 1;
let array = [];

/*calls api to get daily word and stores it in variable dailyWord as a string*/
async function getDailyWord(dailyWord) {
  const promise = await fetch(wordURL);
  const processedResponse = await promise.json();
  dailyWord = processedResponse.word;
  processLetters(dailyWord);
}

getDailyWord();

/*store each letter as it's own variable corresponding to its own square*/
function processLetters(word) {
  const L1 = word.substring(0, 1);
  const L2 = word.substring(1, 2);
  const L3 = word.substring(2, 3);
  const L4 = word.substring(3, 4);
  const L5 = word.substring(4, 5);
  array = [word, L1, L2, L3, L4, L5];
}

/*populating squares with letter*/
const letter = document.querySelectorAll(".letter");

document.addEventListener("keydown", function (event) {
  const keyName = event.key;

  if (isLetter(keyName)) {
    addLetter(keyName);
  } else if (keyName === "Enter" && guessWord.length === 5) {
    checkWord(guessWord);
  } else if (keyName === "Backspace") {
    BackSpace();
  } else {
    //do nothing
  }
});

/*verifying the key pressed if a letter*/
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

/*add letter to the square*/
function addLetter(keyName) {
  if (i + 1 <= 5 * guesses) {
    letter[i].innerHTML = keyName;
    guessWord += keyName;
    i++;
  } else {
    return;
  }
}

/*clear the latest letter from the grid*/
function BackSpace() {
  const prevLastLetter = 5 * (guesses - 1);
  if (i === 0) {
    return;
  } else if (i != prevLastLetter) {
    i--;
    letter[i].innerHTML = "";
    guessWord = guessWord.substring(0, guessWord.length - 1);
  }
}

/*guessing a valid word after all 5 letters have been entered*/
function Validation(wordValidation) {
  if (wordValidation) {
    correctGuess();
    guessWord = "";
    guesses++;
  } else {
    for (let i = 0; i < guessWord.length; i++) {
      letter[(guesses - 1) * 5 + i].classList.add("invalid");

      setTimeout(function () {
        letter[(guesses - 1) * 5 + i].classList.remove("invalid");
      }, 300);
    }
  }
}

/*Checking if the word used for guessing is a valid word*/
async function checkWord(guessWord) {
  const promise = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({
      word: guessWord,
    }),
    headers: {
      "Content-type": "application/json ; charset=UTF-8",
    },
  });
  const processedResponse = await promise.json();
  const realWord = processedResponse.validWord;
  Validation(realWord);
}

function correctGuess() {
  if (guessWord === array[0]) {
    alert("winner winner chicken dinner");
    i = 0;
    guesses = 0;
    cPosition = 0;
    wPosition = 0;
    letter.forEach((square) => {
      square.innerHTML = "";
      square.style.border = "";
    });
    getDailyWord();
  } else if (guesses === 6) {
    alert(`better luck next time loser. The word was "${array[0]}"`);
    i = 0;
    guesses = 0;
    cPosition = 0;
    wPosition = 0;
    letter.forEach((square) => {
      square.innerHTML = "";
      square.style.border = "";
    });
    getDailyWord();
  } else {
    letterPosition();
  }
}

/*identifying the correctly positioned letters*/
let cPosition = 0;
let wPosition = 0;

function letterPosition() {
  let remainingLetters = array.slice(1);
  for (let n = 0; n < guessWord.length; n++) {
    if (array[n + 1] === guessWord.substring(n, n + 1)) {
      letter[cPosition].style.border = "4px solid rgb(122, 184, 30)";
      remainingLetters[n] = 1;
    }
    cPosition++;
  }
  wrongPosition(remainingLetters);
}

function wrongPosition(remainingLetters) {
  for (let m = 0; m < guessWord.length; m++) {
    if (
      remainingLetters.includes(guessWord.substring(m, m + 1)) &&
      guessWord.substring(m, m + 1) !== array[m + 1]
    ) {
      letter[wPosition].style.border = "4px solid #e66100";
      wrongPlace = remainingLetters.indexOf(guessWord.substring(m, m + 1));
      remainingLetters[wrongPlace] = 0;
    }
    wPosition++;
  }
}

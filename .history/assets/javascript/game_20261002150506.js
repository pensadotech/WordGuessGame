// Word Guess Game 

// Obects ........................................................
// word Generator Object
const wordGenerator = {
  // Possible words to guess
  wordArr: [
    'javascript',
    'google',
    'amazon',
    'breakfast',
    'university',
    'northwood',
    'planet',
    'movies',
    'avengers'
  ],
  // function to get one random word
  getRandomWord() {
    // get a random number from 0 to array length
    const rndNum = Math.random() * this.wordArr.length;
    // transform the random nun into an integer
    const rndInt = Math.floor(rndNum);
    // get the word base on random number
    const theWord = this.wordArr[rndInt];
    // split word into a letter array
    const wordArr = theWord.split('');
    // return teh word as a letter array
    return wordArr;
  }
} // wordGenerator

// wordGame object 
let wordGuessGame = {
  // Properties
  isGameStarted: false,
  targetArr: [],
  answerArr: [],
  totalWins: 0,
  remGuesses: 12,
  prevLetters: [],
  remLetters: 0,
  // Game initialization
  initializeGame(gameType) {
    // Indicate game has started
    this.isGameStarted = true;
    // get secret word as an array
    this.targetArr = wordGenerator.getRandomWord();
    // Set under =line array for screen 
    this.setAnswerArray();
    // set initial values
    if (gameType === 'new') {
      this.totalWins = 0;
    }
    this.remGuesses = 12;
    this.prevLetters = []; // initialize array
    // set remainder letters to the total letters
    this.remLetters = this.answerArr.length;
    // Refresh page
    this.displayStatus();
    // set initial messages
    this.displayAuxMessage("Press any key to get started");
    this.displayGameMessage("Game Started!");

  },
  // function to set initial answer array
  setAnswerArray() {
    // create "_" for every target letetr 
    this.answerArr = this.targetArr.map(function () {
      return '_';
    });
  },
  // function to remove delimeter in array
  arrayToHtml(elementsArr, delimiter = ' ') {
    var newstr = '';
    elementsArr.forEach(function (element) {
      if (newstr === '') {
        newstr = element;
      } else {
        newstr = newstr + delimiter + element;
      }
    })

    return newstr;
  },
  displayStatus() {
    //total wins
    document.querySelector('#totalWins').innerHTML = this.totalWins.toString();
    // Secret word ( hidden represetnation)
    var tmpArrStr = this.arrayToHtml(this.answerArr);
    document.querySelector('#secretWord').innerHTML = tmpArrStr;
    // Remaining guesses   
    document.querySelector('#remGuesses').innerHTML = this.remGuesses.toString();
    // previous guesses
    tmpArrStr = this.arrayToHtml(this.prevLetters, ' ');
    document.querySelector('#prevGuesses').innerHTML = tmpArrStr;
  },
  displayGameMessage(message) {
    document.querySelector('#gameMsg').innerHTML = message;
  },
  displayAuxMessage(message) {
    document.querySelector('#auxMsg').innerHTML = message;
  },
  isValidKey(userGuess) {
    // it is a valid key if, 
    // 1. it is ENTER key, it is a number, a lower/upper case letter
    // make sure not spaces are valid
    userGuess = userGuess.trim();

    if (userGuess.length > 1) {
      // Evaulate keybord actions lik Backspace and such
      if (userGuess === "Enter") {
        return true;
      }
      return false;
    } else if ((userGuess.charCodeAt(0) >= 48 && userGuess.charCodeAt(0) <= 57) ||
      (userGuess.charCodeAt(0) >= 65 && userGuess.charCodeAt(0) <= 90) ||
      (userGuess.charCodeAt(0) >= 97 && userGuess.charCodeAt(0) <= 122)) {
      return true;
    }
    return false;
  },
  isRepeatedKey(userGuess) {
    // Is teh guess a repeated letter
    var isInArray = this.prevLetters.indexOf(userGuess);
    return isInArray < 0 ? false : true;
  },
  isLetterInWord(userGuess) {
    // Check if player guess is a letter in the secret word
    var isInWord = false;
    for (var i = 0; i < this.targetArr.length; i++) {
      // if the user guess mathces a leteter
      // replace the letter in the anwer array
      if (this.targetArr[i] === userGuess) {
        this.answerArr[i] = userGuess;
        this.remLetters--;
        isInWord = true;
      }
    }

    return isInWord;
  },
  // Process an incorrect guess
  incorrectGuessAction() {
    // reduce  possible guesses
    this.remGuesses--;
    // if player guessess reaches the maximum, player loses
    if (this.remGuesses === 0) {
      loseSound.play();
      // Terminate the game
      this.isGameStarted = false;
      this.displayGameMessage("You lose, Game over");
      this.displayAuxMessage("hit ENTER to start a new game");
      // end of the hame
    } else {
      badLetterSound.play();
      // Incorrect, but mmore chances
      this.displayAuxMessage("Wrong letter, try again ...");
    }

    document.getElementById('userGuess').value = '';
    this.displayStatus();
  },
  // Process an correct guess
  correctGuessAction() {
    if (this.remLetters === 0) {
      winSound.play();
      this.totalWins++;
      // User wins teh game
      this.displayGameMessage("You win!!! Congrats");
      this.displayAuxMessage("hit ENTER to start a new game");
      // Terminate the game
      this.isGameStarted = false;
    } else {
      goodLetterSound.play();
      this.displayAuxMessage("Cool you found a letter!");
    }

    document.getElementById('userGuess').value = '';
    this.displayStatus();
  }

} // wordGame object 

// Initialize game .................................... 
wordGuessGame.initializeGame('new');

// Sounds
goodLetterSound = new sound('./assets/sounds/goodletter.mp3');
winSound = new sound('./assets/sounds/win.mp3');
badLetterSound = new sound('./assets/sounds/badletter.mp3');
loseSound = new sound('./assets/sounds/lose.mp3');

// button submit .....................................
// For smal devices where events work differently
function userGuessInput() {
  // Get avalue in input
  let userGuess = document.getElementById("userGuess").value;
  userGuess = userGuess.trim();
  // Get first letter in input 
  userGuess = userGuess.substring(0, 1);
  // userGuess.charCodeAt(0)

  // remove entry from screen
  document.getElementById('userGuess').value = '';
  // Process the user guess
  ProcessUserInput(userGuess);
}

// Event key input ............................... 
// Thsi works fine with regular computers
document.onkeyup = function (event) {
  // Get user enetered key
  let userGuess = event.key;
  userGuess = userGuess.trim();

  // Only send value if not unidentified
  if (event.key !== 'Unidentified') {
    ProcessUserInput(userGuess);
  }
}

// Process user input guess ................................ 
function ProcessUserInput(userGuess) {

  // make sure to capture only lettters, numbers, and ENTER key
  if (!wordGuessGame.isValidKey(userGuess)) {
    document.getElementById('userGuess').value = '';
    return; // break , the key is invalid
  }

  if (userGuess === "Enter") {
    // if user hits ENTER, initialize game 
    wordGuessGame.initializeGame('restart');

  } else if (wordGuessGame.isGameStarted) {

    // Make any user entry lower case
    userGuess = userGuess.toLowerCase();

    // If repeated letter, skip
    if (wordGuessGame.isRepeatedKey(userGuess)) {
      document.getElementById('userGuess').value = '';
      wordGuessGame.displayAuxMessage("The key has been enter before, try again...");
      return; // break , repeated key
    }

    // Record entered letter in array
    wordGuessGame.prevLetters.push(userGuess);

    // Check if player guess is a letter in the secret word
    let isCorrectGuess = wordGuessGame.isLetterInWord(userGuess);

    // if not correct guess, increment player guesses and
    // check if remaining guesses are zero
    if (!isCorrectGuess) {
      // Process an incorrct guess    
      wordGuessGame.incorrectGuessAction();
    } else {
      wordGuessGame.correctGuessAction();
    }
  }

} //document.onkeyup

//  Functions ......................................................
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  }
  this.stop = function () {
    this.sound.pause();
  }
}
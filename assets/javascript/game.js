// ## Option Two: Word Guess Game (Challenge - Recommended)
// 1. [Watch the demo](hangman-game-demo.mov).
// 2. Choose a theme for your game! In the demo, we picked an 80s theme: 80s questions, 80s sound and an 80s aesthetic. You can choose any subject for your theme, though, so be creative!
// 3. Use key events to listen for the letters that your players will type.
// 4. Display the following on the page:
// 5. Press any key to get started!
// 6. Wins: (# of times user guessed the word correctly).
//    * If the word is `madonna`, display it like this when the game starts: `_ _ _ _ _ _ _`.
//    * As the user guesses the correct letters, reveal them: `m a d o _  _ a`.
// 7. Number of Guesses Remaining: (# of guesses remaining for the user).
// 8. Letters Already Guessed: (Letters the user has guessed, displayed like `L Z Y H`).
// 9. After the user wins/loses the game should automatically choose another word and make the user play it.

console.log("hangman game basic");

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
    // split word inot a letter array
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

    console.log("Game Started:" + this.isGameStarted)
    console.log("Secret word:" + this.targetArr);
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
    console.log("prvG:" + tmpArrStr)
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
    // if player guessess reaches the maximum, player looses
    if (this.remGuesses === 0) {
      // Terminate the game
      this.isGameStarted = false;
      this.displayGameMessage("You loose, Game over");
      this.displayAuxMessage("hit ENTER to start a new game");
      // end of the hame
      console.log("Game over: You loose!")
    } else {
      console.log("Your gues is not correct");
      // Incorrect, but mmore chances
      this.displayAuxMessage("Wrong letter, try again ...");
    }

    document.getElementById('userGuess').value = '';
    this.displayStatus();
  },
  // Process an correct guess
  correctGuessAction() {
    if (this.remLetters === 0) {
      this.totalWins++;
      // User wins teh game
      this.displayGameMessage("You win!!! Congrats");
      this.displayAuxMessage("hit ENTER to start a new game");
      // Terminate the game
      this.isGameStarted = false;
    } else {
      this.displayAuxMessage("Cool you found a letter!");
    }

    document.getElementById('userGuess').value = '';
    this.displayStatus();
  }

} // wordGame object 

// Initialize game 
wordGuessGame.initializeGame('new');

// wait for user keyboard event 
document.onkeyup = function (event) {
  
  // grabs the specific key that the user pressed
  let userGuess = event.key
  console.log('userGuess:' + userGuess);
  
  // make sure to capture only lettters, numbers, and ENTER key
  if (!wordGuessGame.isValidKey(userGuess)) {
    document.getElementById('userGuess').value = '';
    console.log('invalid key');
    return; // break , the key is invalid
  }

  if (userGuess === "Enter") {
    // if user hits ENTERN, initialize game 
    wordGuessGame.initializeGame('restart');

  } else if (wordGuessGame.isGameStarted) {

    // If repeated letter, skip
    if (wordGuessGame.isRepeatedKey(userGuess)) {
      console.log('repeated key');
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
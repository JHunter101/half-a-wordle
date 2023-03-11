const WORD_DATA_SET = require('./wd/WORD_DATA_SET.js')
// Function to submit a user's guess and update the game board and letter status
function SubmitWord (gameBoard, letterStatus, guess, goalWord) {
  // Function to determine if a guess is valid (i.e., uses only valid letters and is the correct length)
  function IsWordValid (guess, goalWord) {
    if (guess.length === goalWord.length) {
      if (WORD_DATA_SET.has(guess)) {
        return true
      }
    }
    return false
  }

  // Function to calculate the fitness of a guess (i.e., how many letters are in the correct position and how many are in the word but in the wrong position)
  function GetWordFitness (guess, goalWord) {
    const guessLetters = guess.split('')
    const goalLetters = goalWord.split('')
    const fitness = {}

    const guessLettersCounter = {}
    const goalLettersCounter = {}

    for (let i = 0; i < guessLetters.length; i++) {
      guessLettersCounter[guessLetters[i]] = guessLettersCounter[guessLetters[i]]
        ? guessLettersCounter[guessLetters[i]] + 1
        : 1

      goalLettersCounter[goalLetters[i]] = goalLettersCounter[goalLetters[i]]
        ? goalLettersCounter[goalLetters[i]] + 1
        : 1

      if (goalLetters.includes(guessLetters[i])) {
        if (guessLetters[i] === goalLetters[i]) {
          fitness[i] = 'found'
        } else {
          fitness[i] = 'seen'
        }
      } else {
        fitness[i] = 'unk'
      }
    }

    for (let i = guessLetters.length - 1; i >= 0; i--) {
      if (goalLetters.includes(guessLetters[i])) {
        if (!fitness[guessLetters] === 'found') {
          if (guessLettersCounter[guessLetters[i]] > goalLettersCounter[guessLetters[i]]) {
            fitness[i] = 'unk'
            guessLettersCounter[guessLetters[i]] -= 1
          }
        }
      }
    }

    return fitness
  }

  // Function to update the letter status based on the fitness of the guess
  function UpdateLetterStatus (letterStatus, guess, fitness) {
    for (const k in fitness) {
      if (fitness[k] === 'found') {
        letterStatus[guess[k]] = fitness[k]
      } else {
        if (fitness[k] === 'seen') {
          letterStatus[guess[k]] = fitness[k]
        } else if (fitness[k] === 'unk') {
          letterStatus[guess[k]] = fitness[k]
        }
      }
    }
    return letterStatus
  }

  // Function to update the game board based on the guess and its fitness
  function UpdateGameBoard (gameBoard, guess, fitness) {
    let y = 0
    while (gameBoard[y][0].letter !== '-') {
      y += 1
    }

    const wordLetters = guess.split('')
    for (let x = 0; x < wordLetters.length; x++) {
      gameBoard[y][x].letter = wordLetters[x]
      gameBoard[y][x].color = fitness[x]
    }

    return gameBoard
  }
  guess = guess.toLowerCase() // convert to lowercase to standardize input

  if (!IsWordValid(guess, goalWord)) {
    console.log('Invalid guess')
    return { gameBoard, letterStatus } // TO DO RETRY
  }

  const fitness = GetWordFitness(guess, goalWord)
  gameBoard = UpdateGameBoard(gameBoard, guess, fitness)
  letterStatus = UpdateLetterStatus(letterStatus, guess, fitness)
  return { gameBoard, letterStatus }
}

function InitGame (lCount, rows, preFilled, difficulty) {
  // Function to initialize the status of each letter
  function InitLetterStatus () {
    const letterStatus = {
      a: 'unk',
      b: 'unk',
      c: 'unk',
      d: 'unk',
      e: 'unk',
      f: 'unk',
      g: 'unk',
      h: 'unk',
      i: 'unk',
      j: 'unk',
      k: 'unk',
      l: 'unk',
      m: 'unk',
      n: 'unk',
      o: 'unk',
      p: 'unk',
      q: 'unk',
      r: 'unk',
      s: 'unk',
      t: 'unk',
      u: 'unk',
      v: 'unk',
      w: 'unk',
      x: 'unk',
      y: 'unk',
      z: 'unk'
    }
    return letterStatus
  }

  function InitBoard (letterStatus, goalWord, lCount, rows, preFilled = 6, difficulty) {
    const gameBoard = []
    for (let y = 0; y < rows; y++) {
      const row = []
      for (let x = 0; x < lCount; x++) {
        row[x] = {
          letter: '-',
          color: 'unk'
        }
      }
      gameBoard[y] = row
    }
    return PreFillBoard(gameBoard, letterStatus, goalWord, rows, preFilled, difficulty)
  }

  function GenerateWord (lCount, difficulty, goalWord = null) {
    function GetWordData (lCount, difficulty = 15) {
      const path = './wd/wd_' + String(difficulty) + 'K.js'
      const module = require(path)
      return module[lCount]
    }

    const words = GetWordData(lCount, difficulty)
    if (goalWord === null) {
      return words[Math.floor(Math.random() * words.length)]
    } else {
      // TODO SMART PICK
      const i1 = Math.floor(Math.random() * lCount)
      const i2 = Math.floor(Math.random() * lCount)
      const PARTIAL_WORD_DATA_SET = Array.from(WORD_DATA_SET).filter(word => word.split('').length === goalWord.length && word.includes(goalWord[i1]) && word.includes(goalWord[i2]))
      return PARTIAL_WORD_DATA_SET[Math.floor(Math.random() * PARTIAL_WORD_DATA_SET.length)]
    }
  }

  function PreFillBoard (gameBoard, letterStatus, goalWord, rows = 6, preFilled = 2, difficulty = 15) {
    if (preFilled === 0) {
      return { gameBoard, letterStatus }
    }
    const guess = GenerateWord(lCount, difficulty, goalWord)
    const newBoardAndStatus = SubmitWord(gameBoard, letterStatus, guess, goalWord)
    return PreFillBoard(newBoardAndStatus.gameBoard, newBoardAndStatus.letterStatus, goalWord, rows, preFilled - 1, difficulty)
  }

  const goalWord = GenerateWord(lCount, difficulty)
  console.log(goalWord)
  const letterStatus = InitLetterStatus()
  return InitBoard(letterStatus, goalWord, lCount, rows, preFilled, difficulty)
}

const lCount = 5
const difficulty = 15
const rows = 6
const preFilled = 2
const newBoardAndStatus = InitGame(lCount, rows, preFilled, difficulty)
const gameBoard = newBoardAndStatus.gameBoard
const letterStatus = newBoardAndStatus.letterStatus

if (gameBoard[gameBoard.length - 1][0].letter !== '-') {
  console.log('Done!')
}

console.log(gameBoard)
console.log(letterStatus)

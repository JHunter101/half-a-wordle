import { wordData } from './wd/wd.js'

function GetWordData (lCount, difficulty = 15) {
  return import('./wd/wd_' + String(difficulty) + 'K.js')
    .then(module => {
      return module.default[lCount]
    })
}

// Function to generate a random word of length lCount or use the provided goalWord if given
function GenerateWord (lCount, difficulty, goalWord = null) {
  const words = GetWordData(lCount, difficulty)
  if (goalWord === null) {
    return words[Math.floor(Math.random() * words.length)]
  } else {
    // TODO SMART PICK
    return words[Math.floor(Math.random() * words.length)]
  }
}

// Function to initialize the game board
function InitBoard (wordLength, rows) {
  const gameBoard = []
  for (let y = 0; y < rows; y++) {
    const row = []
    for (let x = 0; x < wordLength; x++) {
      row[x] = {
        letter: '-',
        color: 'unk'
      }
    }
    gameBoard[y] = row
  }

  return gameBoard
}

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

function PreFillBoard (gameBoard, goalWord, rows = 2, difficulty = 0) {
  let letterStatus = InitLetterStatus()
  for (let i = 0; i < rows; i++) {
    const guess = GenerateWord(5, goalWord) // generate a 5-letter word by default
    const fitness = GetWordFitness(guess, goalWord)
    UpdateGameBoard(gameBoard, guess, fitness)
    letterStatus = UpdateLetterStatus(letterStatus, fitness)
  }
  return (gameBoard, letterStatus)
}

// Function to submit a user's guess and update the game board and letter status
function SubmitWord (gameBoard, letterStatus, guess, goalWord) {
  guess = guess.toLowerCase() // convert to lowercase to standardize input

  if (!IsWordValid(guess)) {
    return // TO DO RETRY
  }

  const fitness = GetWordFitness(guess, goalWord)
  gameBoard = UpdateGameBoard(gameBoard, guess, fitness)
  letterStatus = UpdateLetterStatus(guess, fitness)
  return (gameBoard, letterStatus)
}

// Function to determine if a guess is valid (i.e., uses only valid letters and is the correct length)
function IsWordValid (guess) {
  const lCount = guess.length

  if (guess in wordData) {
    return true
  } else {
    return false
  }
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

  for (let i = guessLetters.length - 1; i >= 0; i++) {
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
function UpdateLetterStatus (letterStatus, fitness) {
  for (const k in fitness) {
    if (fitness[k] === 'found') {
      letterStatus[k] = fitness[k]
    } else {
      if (fitness[k] === 'seen') {
        letterStatus[k] = fitness[k]
      } else if (fitness[k] === 'unk') {
        letterStatus[k] = fitness[k]
      }
    }
  }
  return letterStatus
}

// Function to update the game board based on the guess and its fitness
function UpdateGameBoard (gameBoard, guess, fitness) {
  let y = 0
  while (gameBoard[y][0].letter === '-') {
    y += 1
  }

  const wordLetters = guess.split('')
  for (let x = 0; x < wordLetters.length; x++) {
    gameBoard[y][x].letter = wordLetters[x]
    gameBoard[y][x].color = fitness[x]
  }
  return gameBoard
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GLOBAL_WORD_DATA_SET_1 = require("../../res/ts/GLOBAL_WORD_DATA_SET");
const WD5K_1 = require("../../res/ts/WD5K");
const WD10K_1 = require("../../res/ts/WD10K");
const WD15K_1 = require("../../res/ts/WD15K");
const WD16K_1 = require("../../res/ts/WD16K");
function wordToRandom(str) {
    Math.seed = function (s) {
        function letterToNumber(str) {
            let result = 0;
            for (let i = 0; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                if (charCode >= 97 && charCode <= 122) {
                    // check if lowercase letter
                    result += charCode - 96; // subtract 96 to get 1-26 and convert to string
                }
                else {
                    result += charCode - 64;
                }
            }
            return result;
        }
        if (typeof s === 'string') {
            s = letterToNumber(s);
            console.log(s);
        }
        return function () {
            console.log(s);
            s = Math.sin(s) * 10000;
            return s - Math.floor(s);
        };
    };
    const random1 = Math.seed(str);
    const random2 = Math.seed(random1());
    Math.random = Math.seed(random2());
    return Math.random();
}
// Function to submit a user's guess and update the game board and letter status
function SubmitWord(gameBoard, letterStatus, guess, goalWord) {
    // Function to determine if a guess is valid (i.e., uses only valid letters and is the correct length)
    function IsWordValid(guess, goalWord) {
        if (guess.length === goalWord.length) {
            if (GLOBAL_WORD_DATA_SET_1.GLOBAL_WORD_DATA_SET.has(guess)) {
                return true;
            }
        }
        return false;
    }
    // Function to calculate the fitness of a guess (i.e., how many letters are in the correct position and how many are in the word but in the wrong position)
    function GetWordFitness(guess, goalWord) {
        const guessLetters = guess.split('');
        const goalLetters = goalWord.split('');
        const fitness = {};
        const guessLettersCounter = {};
        const goalLettersCounter = {};
        for (let i = 0; i < guessLetters.length; i++) {
            guessLettersCounter[guessLetters[i]] = guessLettersCounter[guessLetters[i]]
                ? guessLettersCounter[guessLetters[i]] + 1
                : 1;
            goalLettersCounter[guessLetters[i]] = goalLettersCounter[guessLetters[i]]
                ? goalLettersCounter[guessLetters[i]] + 1
                : 1;
            if (goalLetters.includes(guessLetters[i])) {
                if (guessLetters[i] === goalLetters[i]) {
                    fitness[i] = 'found';
                }
                else {
                    fitness[i] = 'seen';
                }
            }
            else {
                fitness[i] = 'unk';
            }
        }
        for (let i = guessLetters.length - 1; i >= 0; i--) {
            if (goalLetters.includes(guessLetters[i])) {
                if (!(fitness[i] === 'found')) {
                    if (guessLettersCounter[guessLetters[i]] >
                        goalLettersCounter[guessLetters[i]]) {
                        fitness[i] = 'unk';
                        guessLettersCounter[guessLetters[i]] -= 1;
                    }
                }
            }
        }
        return fitness;
    }
    // Function to update the letter status based on the fitness of the guess
    function UpdateLetterStatus(letterStatus, guess, fitness) {
        for (const k in fitness) {
            if (fitness[k] === 'found') {
                letterStatus[Array.from(guess)[k]] = fitness[k];
            }
            else {
                if (fitness[k] === 'seen') {
                    letterStatus[Array.from(guess)[k]] = fitness[k];
                }
                else if (fitness[k] === 'unk') {
                    letterStatus[Array.from(guess)[k]] = fitness[k];
                }
            }
        }
        return letterStatus;
    }
    // Function to update the game board based on the guess and its fitness
    function UpdateGameBoard(gameBoard, guess, fitness) {
        let y = 0;
        while (gameBoard[y][0].letter !== '-') {
            y += 1;
        }
        const wordLetters = guess.split('');
        for (let x = 0; x < wordLetters.length; x++) {
            gameBoard[y][x].letter = wordLetters[x];
            gameBoard[y][x].color = fitness[x];
        }
        return gameBoard;
    }
    guess = guess.toLowerCase(); // convert to lowercase to standardize input
    if (!IsWordValid(guess, goalWord)) {
        console.log('Invalid guess');
        return { gameBoard, letterStatus }; // TO DO RETRY
    }
    const fitness = GetWordFitness(guess, goalWord);
    gameBoard = UpdateGameBoard(gameBoard, guess, fitness);
    letterStatus = UpdateLetterStatus(letterStatus, guess, fitness);
    return { gameBoard, letterStatus };
}
function InitGame(lCount, rows, preFilled, difficulty) {
    // Function to initialize the status of each letter
    function InitLetterStatus() {
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
            z: 'unk',
        };
        return letterStatus;
    }
    function InitBoard(letterStatus, goalWord, lCount, rows = 6, preFilled = 2, difficulty) {
        const gameBoard = [];
        for (let y = 0; y < rows; y++) {
            const row = [];
            for (let x = 0; x < lCount; x++) {
                row[x] = {
                    letter: '-',
                    color: 'unk',
                };
            }
            gameBoard[y] = row;
        }
        return PreFillBoard(gameBoard, letterStatus, goalWord, rows, preFilled, difficulty);
    }
    function GenerateWord(lCount, difficulty, goalWord = '') {
        function GetWordData(lCount, difficulty = 15) {
            switch (difficulty) {
                case 5:
                    return WD5K_1.WD5K[lCount];
                case 15:
                    return WD10K_1.WD10K[lCount];
                case 25:
                    return WD15K_1.WD15K[lCount];
                default:
                    return WD16K_1.WD16K[lCount];
            }
        }
        const words = GetWordData(lCount, difficulty);
        if (goalWord === '') {
            return words[Math.floor(Math.random() * words.length)];
        }
        else {
            // TODO SMART PICK
            const i1 = Math.floor(wordToRandom(goalWord) * lCount);
            const i2 = Math.floor(wordToRandom(goalWord + goalWord) * lCount);
            const PARTIAL_WORD_DATA_SET = Array.from(GLOBAL_WORD_DATA_SET_1.GLOBAL_WORD_DATA_SET).filter((word) => word.split('').length === goalWord.length &&
                word.includes(goalWord[i1]) &&
                word.includes(goalWord[i2]));
            return PARTIAL_WORD_DATA_SET[Math.floor(Math.random() * PARTIAL_WORD_DATA_SET.length)];
        }
    }
    function PreFillBoard(gameBoard, letterStatus, goalWord, rows = 6, preFilled = 2, difficulty = 15) {
        if (preFilled === 0) {
            return {
                gameBoard,
                letterStatus,
                goalWord,
                lCount: rows,
                rows,
                preFilled,
                difficulty,
            };
        }
        const guess = GenerateWord(lCount, difficulty, goalWord);
        const newBoardAndStatus = SubmitWord(gameBoard, letterStatus, guess, goalWord);
        return PreFillBoard(newBoardAndStatus.gameBoard, newBoardAndStatus.letterStatus, goalWord, rows, preFilled - 1, difficulty);
    }
    const goalWord = GenerateWord(lCount, difficulty);
    console.log(goalWord);
    const letterStatus = InitLetterStatus();
    return InitBoard(letterStatus, goalWord, lCount, rows, preFilled, difficulty);
}
const lCount = 5;
const difficulty = 15;
const rows = 6;
const preFilled = 2;
const newBoardAndStatus = InitGame(lCount, rows, preFilled, difficulty);
const gameBoard = newBoardAndStatus.gameBoard;
const letterStatus = newBoardAndStatus.letterStatus;
if (gameBoard[gameBoard.length - 1][0].letter !== '-') {
    console.log('Done!');
}
console.log(gameBoard);
console.log(letterStatus);

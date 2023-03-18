window.addEventListener('load', (event) => {
    const lCount = 5;
    const rows = 6;
    sessionStorage.setItem('currentCellX', '0');
    sessionStorage.setItem('currentCellY', '0');
    onSight(lCount, rows);
    saveLocal({ lCount: lCount, difficulty: 16, rows: rows, preFilled: 2 }, { gameBoard: [], letterStatus: {}, goalWord: '' });
    InitGame();
});
// Import
import { GLOBAL_WORD_DATA_SET } from '../wd/GLOBAL_WORD_DATA_SET.js';
import { WD5K } from '../wd/WD5K.js';
import { WD10K } from '../wd/WD10K.js';
import { WD15K } from '../wd/WD15K.js';
import { WD16K } from '../wd/WD16K.js';
// Front-end
function onSight(lCount = 5, rows = 6) {
    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
        gameBoard.classList.add('grid');
        gameBoard.style.gridTemplateColumns = `repeat(${lCount}, minmax(0, 1fr))`;
        gameBoard.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
    }
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < lCount; x++) {
            const div = document.createElement('div');
            div.id = `b-cell-${y}${x}`;
            div.classList.add('board-cell');
            div.classList.add('grid-cell');
            const fontSize = 14 - lCount;
            div.style.fontSize = `${fontSize}vw`;
            if (gameBoard) {
                gameBoard.appendChild(div);
            }
        }
    }
    const keys = [
        'Q',
        'W',
        'E',
        'R',
        'T',
        'Y',
        'U',
        'I',
        'O',
        'P',
        '',
        'A',
        'S',
        'D',
        'F',
        'G',
        'H',
        'J',
        'K',
        'L',
        '',
        'Enter',
        'Z',
        'X',
        'C',
        'V',
        'B',
        'N',
        'M',
        'Del',
    ];
    const keyboard = document.getElementById('keyboard');
    if (keyboard) {
        keyboard.classList.add('grid');
    }
    keys.forEach((key) => {
        const kbd = document.createElement('kbd');
        kbd.classList.add('grid-cell');
        kbd.classList.add('keyboard-cell');
        if (['Enter', 'Del'].includes(key)) {
            kbd.classList.add('col-span-3');
        }
        else if (key !== '') {
            kbd.id = `k-cell-${key}`;
            kbd.classList.add('col-span-2');
        }
        kbd.addEventListener('click', function () {
            writeKey(key);
        });
        kbd.textContent = key;
        if (keyboard) {
            keyboard.appendChild(kbd);
        }
    });
}
document.addEventListener('keydown', (event) => {
    writeKey(event.key);
});
function writeKey(key) {
    const y = Number(sessionStorage.getItem('currentCellY'));
    const x = Number(sessionStorage.getItem('currentCellX'));
    const lCount = getFromSession('lCount');
    if (/^[a-zA-Z]$/.test(key)) {
        if (x < lCount) {
            updateLetter(y, x, key);
            sessionStorage.setItem('currentCellX', String(x + 1));
        }
    }
    if (/Backspace|Delete/.test(key)) {
        updateLetter(y, x - 1, '');
        if (x > 0) {
            sessionStorage.setItem('currentCellX', String(x - 1));
        }
    }
    if (/Enter/.test(key)) {
        let guess = '';
        for (let i = 0; i < lCount; i++) {
            const elem = document.getElementById(`b-cell-${y}${i}`);
            if (elem) {
                guess += elem.textContent;
            }
        }
        SubmitWord(guess);
    }
}
function updateLetter(y, x, letter, color = '') {
    letter = letter.toUpperCase();
    const cell = document.getElementById(`b-cell-${y}${x}`);
    if (cell) {
        cell.textContent = letter;
        if (color != '') {
            if (color == 'unk') {
                cell.style.backgroundColor = 'black';
            }
            if (color == 'seen') {
                cell.style.backgroundColor = '#b59f3b';
            }
            if (color == 'found') {
                cell.style.backgroundColor = '#538d4e';
            }
        }
    }
}
function updateLetterStatusColor(letter, color) {
    const cell = document.getElementById(`k-cell-${letter}`);
    if (cell) {
        if (color == 'unk') {
            cell.style.backgroundColor = 'black';
        }
        if (color == 'seen') {
            cell.style.backgroundColor = '#b59f3b';
        }
        if (color == 'found') {
            cell.style.backgroundColor = '#538d4e';
        }
    }
}
// Front to Back to Front
function saveLocal(gameSettings = null, gameStatus = null) {
    if (gameSettings !== null) {
        sessionStorage.setItem('gameSettings', JSON.stringify(gameSettings));
    }
    if (gameStatus !== null) {
        sessionStorage.setItem('gameStatus', JSON.stringify(gameStatus));
    }
}
function getFromSession(item) {
    switch (item) {
        case 'gameSettings':
            {
                const gameSettingsString = sessionStorage.getItem('gameSettings');
                if (gameSettingsString) {
                    return JSON.parse(gameSettingsString);
                }
            }
            break;
        case 'gameStatus':
            {
                const gameStatusString = sessionStorage.getItem('gameStatus');
                if (gameStatusString) {
                    return JSON.parse(gameStatusString);
                }
            }
            break;
        case 'gameBoard':
            {
                const gameStatusString = sessionStorage.getItem('gameStatus');
                if (gameStatusString) {
                    return JSON.parse(gameStatusString).gameBoard;
                }
            }
            break;
        case 'letterStatus':
            {
                const gameStatusString = sessionStorage.getItem('gameStatus');
                if (gameStatusString) {
                    return JSON.parse(gameStatusString).letterStatus;
                }
            }
            break;
        case 'goalWord':
            {
                const gameStatusString = sessionStorage.getItem('gameStatus');
                if (gameStatusString) {
                    return JSON.parse(gameStatusString).goalWord;
                }
            }
            break;
        case 'lCount':
            {
                const gameSettingsString = sessionStorage.getItem('gameSettings');
                if (gameSettingsString) {
                    return JSON.parse(gameSettingsString).lCount;
                }
            }
            break;
        case 'difficulty':
            {
                const gameSettingsString = sessionStorage.getItem('gameSettings');
                if (gameSettingsString) {
                    return JSON.parse(gameSettingsString).difficulty;
                }
            }
            break;
        case 'prefilled':
            {
                const gameSettingsString = sessionStorage.getItem('gameSettings');
                if (gameSettingsString) {
                    return JSON.parse(gameSettingsString).preFilled;
                }
            }
            break;
        case 'rows':
            {
                const gameSettingsString = sessionStorage.getItem('gameSettings');
                if (gameSettingsString) {
                    return JSON.parse(gameSettingsString).rows;
                }
            }
            break;
        default: {
            return null;
        }
    }
}
// Function to submit a user's guess and update the game board and letter status
function SubmitWord(guess) {
    const gameStatus = getFromSession('gameStatus');
    let gameBoard = gameStatus.gameBoard;
    let letterStatus = gameStatus.letterStatus;
    const goalWord = gameStatus.goalWord;
    // Function to determine if a guess is valid (i.e., uses only valid letters and is the correct length)
    function IsWordValid(guess, goalWord) {
        if (guess.length === goalWord.length) {
            if (GLOBAL_WORD_DATA_SET.has(guess)) {
                return true;
            }
        }
        // TODO: BAD INPUT
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
            updateLetter(Number(sessionStorage.getItem('currentCellY')), i, guessLetters[i], fitness[i]);
        }
        return fitness;
    }
    // Function to update the letter status based on the fitness of the guess
    function UpdateLetterStatus(letterStatus, guess, fitness) {
        for (const k in fitness) {
            const status = letterStatus[Array.from(guess)[k]];
            if (fitness[k] === 'found') {
                letterStatus[Array.from(guess)[k]] = fitness[k];
                updateLetterStatusColor(Array.from(guess)[k], fitness[k]);
            }
            else {
                if (fitness[k] === 'seen' && status != 'found') {
                    letterStatus[Array.from(guess)[k]] = fitness[k];
                    updateLetterStatusColor(Array.from(guess)[k], fitness[k]);
                }
                else if (fitness[k] === 'unk' &&
                    status != 'found' &&
                    status != 'seen') {
                    letterStatus[Array.from(guess)[k]] = fitness[k];
                    updateLetterStatusColor(Array.from(guess)[k], fitness[k]);
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
    guess = guess.toUpperCase(); // convert to lowercase to standardize input
    if (!IsWordValid(guess, goalWord)) {
        console.log('Invalid guess');
        return { gameBoard, letterStatus };
    }
    const fitness = GetWordFitness(guess, goalWord);
    gameBoard = UpdateGameBoard(gameBoard, guess, fitness);
    letterStatus = UpdateLetterStatus(letterStatus, guess, fitness);
    saveLocal(null, {
        gameBoard: gameBoard,
        letterStatus: letterStatus,
        goalWord: goalWord,
    });
    sessionStorage.setItem('currentCellY', String(Number(sessionStorage.getItem('currentCellY')) + 1));
    sessionStorage.setItem('currentCellX', '0');
    return { gameBoard, letterStatus };
}
function InitGame() {
    const gameSettings = getFromSession('gameSettings');
    const lCount = gameSettings.lCount;
    const rows = gameSettings.rows;
    const preFilled = gameSettings.preFilled;
    const difficulty = gameSettings.difficulty;
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
        let gameBoard = [];
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
        saveLocal(null, {
            gameBoard: gameBoard,
            letterStatus: {},
            goalWord: goalWord,
        });
        const postFillBoard = PreFillBoard(gameBoard, letterStatus, goalWord, rows, preFilled, difficulty);
        gameBoard = postFillBoard.gameBoard;
        letterStatus = postFillBoard.letterStatus;
        return { gameBoard, letterStatus };
    }
    function GenerateWord(lCount, difficulty, goalWord = '') {
        function GetWordData(lCount, difficulty = 15) {
            switch (difficulty) {
                case 5:
                    return WD5K[lCount];
                case 15:
                    return WD10K[lCount];
                case 25:
                    return WD15K[lCount];
                default:
                    return WD16K[lCount];
            }
        }
        const words = GetWordData(lCount, difficulty);
        if (goalWord === '') {
            return words[Math.floor(Math.random() * words.length)];
        }
        else {
            const i1 = Math.floor(Math.random() * lCount);
            const PARTIAL_WORD_DATA_SET = Array.from(GLOBAL_WORD_DATA_SET).filter((word) => word.split('').length === goalWord.length &&
                word.includes(goalWord[i1]));
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
        const newBoardAndStatus = SubmitWord(guess);
        return PreFillBoard(newBoardAndStatus.gameBoard, newBoardAndStatus.letterStatus, goalWord, rows, preFilled - 1, difficulty);
    }
    const goalWord = GenerateWord(lCount, difficulty);
    const letterStatus = InitLetterStatus();
    const gameBoardAndStatus = InitBoard(letterStatus, goalWord, lCount, rows, preFilled, difficulty);
    saveLocal(null, {
        gameBoard: gameBoardAndStatus.gameBoard,
        letterStatus: gameBoardAndStatus.letterStatus,
        goalWord: goalWord,
    });
}
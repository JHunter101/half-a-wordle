"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const inputDirPath = './res/csv/';
const outputDirPath = './res/ts/';
const GLOBAL_WORD_DATA_SET = new Set();
const GAME_WORD_DATA_SET = {};
let wordCount = 1;
function linearNormalize(x, xMin = 0, xMax = 500, yMin = 1, yMax = 10) {
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const y = ((x - xMin) / xRange) * yRange + yMin;
    return Math.ceil(y);
}
fs.createReadStream(path.join(inputDirPath, 'WORD_DATA.csv'))
    .pipe((0, csv_parser_1.default)())
    .on('data', (data) => {
    GLOBAL_WORD_DATA_SET.add(data.WORD);
    if (!GAME_WORD_DATA_SET[data.NLET]) {
        GAME_WORD_DATA_SET[data.NLET] = [];
    }
    for (let i = 0; i < linearNormalize(data.KFSMP); i++) {
        GAME_WORD_DATA_SET[data.NLET].push(data.WORD);
    }
    if (wordCount % 5000 === 0) {
        saveToFile(GAME_WORD_DATA_SET, 'WD' + Math.floor(wordCount / 1000) + 'K');
    }
    wordCount += 1;
})
    .on('end', function () {
    const fileName = 'GLOBAL_WORD_DATA_SET';
    const _GLOBAL_WORD_DATA_SET = JSON.stringify(Array.from(GLOBAL_WORD_DATA_SET));
    saveToFile(GAME_WORD_DATA_SET, 'WD' + Math.floor(wordCount / 1000) + 'K');
    fs.writeFile(path.join(outputDirPath, fileName + '.ts'), `/* eslint-disable semi */
      /* eslint-disable eol-last */
      /* eslint-disable object-curly-spacing */
      /* eslint-disable key-spacing */
      /* eslint-disable quote-props */
      /* eslint-disable comma-spacing */
      /* eslint-disable quotes */
      /* eslint-disable no-unused-vars */
      export const ${fileName} = new Set(${_GLOBAL_WORD_DATA_SET})
      `, function (err) {
        if (err)
            throw err;
        console.log(`${fileName} saved with ${GLOBAL_WORD_DATA_SET.size} words!`);
    });
});
// Define a function to save data to a file
function saveToFile(data, fileName) {
    const output = JSON.stringify(data);
    fs.writeFile(path.join(outputDirPath, fileName + '.ts'), `/* eslint-disable semi */
/* eslint-disable eol-last */
/* eslint-disable object-curly-spacing */
/* eslint-disable key-spacing */
/* eslint-disable quote-props */
/* eslint-disable comma-spacing */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
export type WordData = {
  [key: number]: string[];
};

export const ${fileName}: WordData = ${output}
`, function (err) {
        if (err)
            throw err;
        console.log(`${fileName} saved!`);
    });
}

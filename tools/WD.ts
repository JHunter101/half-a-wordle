import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

const inputDirPath = './res/csv/';
const outputDirPath = './res/ts/';

const GLOBAL_WORD_DATA_SET = new Set<string>();
const GAME_WORD_DATA_SET: gameWordData = {};

type inputWordData = {
  WORD: string;
  KFSMP: number;
  NLET: number;
};

type gameWordData = {
  [key: number]: string[];
};

let wordCount = 1;

function linearNormalize(x: number, xMin = 0, xMax = 500, yMin = 1, yMax = 10) {
  const xRange = xMax - xMin;
  const yRange = yMax - yMin;
  const y = ((x - xMin) / xRange) * yRange + yMin;
  return Math.ceil(y);
}

fs.createReadStream(path.join(inputDirPath, 'WORD_DATA.csv'))
  .pipe(csv())
  .on('data', (data: inputWordData) => {
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
    const _GLOBAL_WORD_DATA_SET = JSON.stringify(
      Array.from(GLOBAL_WORD_DATA_SET),
    );
    saveToFile(GAME_WORD_DATA_SET, 'WD' + Math.floor(wordCount / 1000) + 'K');

    fs.writeFile(
      path.join(outputDirPath, fileName + '.ts'),
      `/* eslint-disable semi */
      /* eslint-disable eol-last */
      /* eslint-disable object-curly-spacing */
      /* eslint-disable key-spacing */
      /* eslint-disable quote-props */
      /* eslint-disable comma-spacing */
      /* eslint-disable quotes */
      /* eslint-disable no-unused-vars */
      export const ${fileName} = new Set(${_GLOBAL_WORD_DATA_SET})
      `,
      function (err) {
        if (err) throw err;
        console.log(
          `${fileName} saved with ${GLOBAL_WORD_DATA_SET.size} words!`,
        );
      },
    );
  });

// Define a function to save data to a file
function saveToFile(data: gameWordData, fileName: string) {
  const output = JSON.stringify(data);
  fs.writeFile(
    path.join(outputDirPath, fileName + '.ts'),
    `/* eslint-disable semi */
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
`,
    function (err) {
      if (err) throw err;
      console.log(`${fileName} saved!`);
    },
  );
}

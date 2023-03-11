// Import required libraries
const fs = require('fs')
const path = require('path')

function parseCSV (str) {
  const arr = []
  let quote = false // 'true' means we're inside a quoted field

  // Iterate over each character, keep track of current row and column (of the returned array)
  for (let row = 0, col = 0, c = 0; c < str.length; c++) {
    const cc = str[c]; const nc = str[c + 1] // Current character, next character
    arr[row] = arr[row] || [] // Create a new row if necessary
    arr[row][col] = arr[row][col] || '' // Create a new column (start with empty string) if necessary

    // If the current character is a quotation mark, and we're inside a
    // quoted field, and the next character is also a quotation mark,
    // add a quotation mark to the current column and skip the next character
    if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; continue }

    // If it's just one quotation mark, begin/end quoted field
    if (cc === '"') { quote = !quote; continue }

    // If it's a comma and we're not in a quoted field, move on to the next column
    if (cc === ',' && !quote) { ++col; continue }

    // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
    // and move on to the next row and move to column 0 of that new row
    if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue }

    // If it's a newline (LF or CR) and we're not in a quoted field,
    // move on to the next row and move to column 0 of that new row
    if (cc === '\n' && !quote) { ++row; col = 0; continue }
    if (cc === '\r' && !quote) { ++row; col = 0; continue }

    // Otherwise, append the current character to the current column
    arr[row][col] += cc
  }
  return arr
}

// Define a function to save data to a file
function saveToFile (data, fileName) {
  data = JSON.stringify(data)
  fs.writeFile(path.join(__dirname, fileName + '.js'), `var ${fileName} = ${data};`, function (err) {
    if (err) throw err
    console.log(`${fileName} saved!`)
  })
}

// Define a function for linear normalization
function linearNormalize (x, xMin = 0, xMax = 1, yMin = 1, yMax = 10) {
  const xRange = xMax - xMin
  const yRange = yMax - yMin
  const y = ((x - xMin) / xRange) * yRange + yMin
  return Math.ceil(y)
}

// Read the word data from a CSV file
const wordData = parseCSV(fs.readFileSync(path.join(__dirname, 'word_data.csv'), 'utf8'), {
  headers: false,
  skip_empty_lines: true
})

// Filter out rows with missing values and short strings
const filteredData = wordData
  .filter((row) => row[0] && row[0].length >= 5 && row[0].length <= 12)

// Initialize an object for storing word data by length
const wordDataListJS = {}
for (let i = 5; i <= 12; i++) {
  wordDataListJS[i] = []
}

// Initialize a set for storing unique words
const wordDataSetJS = new Set()

// Loop through each row in the filtered data
let j = 0
const ticks = new Set([5000, 15000, 25000, 35000])
filteredData.forEach((row) => {
  if (ticks.has(j)) {
    console.log(j)
    saveToFile(wordDataListJS, ('WD_' + Math.floor(j / 1000) + 'K'))
  }
  j++

  const word = row[0]
  const wordLength = word.length

  // Add the word to the unique word set
  wordDataSetJS.add(word)
  const normalizedF = linearNormalize(row[1], 0, 1226734006, 1, 10)
  for (let i = 0; i < normalizedF; i++) {
    wordDataListJS[wordLength].push(word)
  }
})

// Save the word data list and set to separate files
saveToFile(Array.from(wordDataSetJS), 'WORD_DATA_SET')

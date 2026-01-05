const fs = require('fs');
const readline = require('readline');

let indexCache = null;

/**
 * Build alphabet index - find first occurrence of each letter
 */
function buildIndex(filePath) {
  return new Promise((resolve, reject) => {
    const index = {};
    let lineNumber = 0;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // Initialize all letters
    letters.forEach(letter => {
      index[letter] = undefined;
    });

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        const firstLetter = trimmedLine.charAt(0).toUpperCase();
        if (index[firstLetter] === undefined && letters.includes(firstLetter)) {
          index[firstLetter] = lineNumber;
        }
      }
      lineNumber++;
    });

    rl.on('close', () => {
      resolve(index);
    });

    rl.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Get alphabet index (with caching)
 */
async function getIndex(filePath) {
  if (indexCache) {
    return indexCache;
  }
  
  indexCache = await buildIndex(filePath);
  return indexCache;
}

module.exports = {
  getIndex,
  buildIndex
};
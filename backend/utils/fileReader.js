const fs = require('fs');
const readline = require('readline');

/**
 * Read specific lines from a file (for pagination)
 */
function readLines(filePath, startLine, count) {
  return new Promise((resolve, reject) => {
    const users = [];
    let currentLine = 0;
    let linesRead = 0;

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      if (currentLine >= startLine && linesRead < count) {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          users.push({
            id: currentLine + 1,
            name: trimmedLine
          });
          linesRead++;
        }
      }
      currentLine++;
    });

    rl.on('close', () => {
      resolve(users);
    });

    rl.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Count total lines in a file
 */
function countLines(filePath) {
  return new Promise((resolve, reject) => {
    let count = 0;
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    rl.on('line', () => {
      count++;
    });

    rl.on('close', () => {
      resolve(count);
    });

    rl.on('error', (error) => {
      reject(error);
    });
  });
}

module.exports = {
  readLines,
  countLines
};
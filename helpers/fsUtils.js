const fs = require("fs");
const util = require("util");

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);
/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

/**
 * Function to read data from a file and delete some content
 * @param {string} id The id we are searching for
 * @param {string} filePath The path to the file you want delete
 * @param {function(Error|null): void} callback The callback returns an error or null
 * @returns {void} Nothing
 */
const readAndDelete = (id, filePath, callback) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return callback(err);
    }

    let notes = JSON.parse(data);

    // Find the index of the note with the given id
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
      // Remove the note from the array
      notes.splice(index, 1);

      // Write the updated data back to the file
      fs.writeFile(filePath, JSON.stringify(notes), (err) => {
        if (err) {
          return callback(err);
        }

        callback(null);
      });
    } else {
      callback(null); // If note with given id doesn't exist, consider it a success
    }
  });
};

module.exports = { readFromFile, writeToFile, readAndAppend, readAndDelete };
const fs = require("fs");
const _find = require("lodash/find");

/**
 * Create a file with unique name according to the specified folder
 * @param {String} targetDir file path relative to the root ci folder
 * @returns Array: [Boolean,String]
 */
function createFileName(targetDir, ext = ".json") {
  const Moniker = require("moniker");

  if (fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir);
    var newFileName;

    try {
      do {
        newFileName = Moniker.choose() + ext;
      } while (_find(files, newFileName) !== undefined);

      return [true, newFileName];
    } catch (error) {
      return [false, error];
    }
  } else {
    return [false, "File path does not exist"];
  }
}

/**
 * Create file in the specified dir and write data to it
 * @param {String} filePath includes the file extension
 * @param {String|Object} fileData could be string or object
 * @param {*} args extra arguments ## 0(Boolean) = whether file might already exists
 * @returns {Array} [Boolean|String]
 */
function createFile(filePath, fileData, ...args) {
  if (typeof fileData === "object") {
    fileData = JSON.stringify(fileData);
  }

  try {
    const [fileExists] = getFileData(filePath);

    if (fileExists) {
      fs.unlinkSync(filePath);
    }

    fs.writeFileSync(filePath, fileData, {
      encoding: "utf8",
      flag: args[0] == true ? "w" : "wx"
    });

    return true;
  } catch (error) {
    console.error(error);
    return error;
  }
}

/**
 * get file contents
 * @param {String} filePathUrl path with the extension (.ext)
 * @returns {Array} [ifError:Boolean,fileData||error:String]
 */
function getFileData(filePathUrl) {
  try {
    const fileData = fs.readFileSync(filePathUrl, {
      encoding: "utf8",
      flag: "r"
    });

    return [true, fileData];
  } catch (error) {
    return [false, error];
  }
}

function getDirectoryFiles(directoryPath) {
  try {
    const directoryData = fs.readdirSync(directoryPath);

    return [true, directoryData];
  } catch (error) {
    return [false, error]
  }
}

// function dirExists(targetDir) {
// 	try {
// 		fs.accessSync(targetDir, fs.constants.W_OK | fs.constants.R_OK | fs.constants.F_OK);
// 		return true;
// 	} catch (error) {
// 		return false;
// 	}
// }

module.exports = {
  createFileName,
  createFile,
  getFileData,
  getDirectoryFiles
};

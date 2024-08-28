const fs = require("fs");
const path = require("path");
const fileExists = (filePath) => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

const readDirectory = (dir) => {
  try {
    return fs.readdirSync(dir);
  } catch (err) {
    return [];
  }
};

let oldDir = readDirectory("./WatchedFolder");

fs.watch("./WatchedFolder", (eventType, fileName) => {
  const date = new Date();
  if (path.extname(fileName)) {
    let newDir = readDirectory("./WatchedFolder");
    const renamed = newDir.find((file) => !oldDir.includes(file));

    //Check rename action
    if (renamed && oldDir.length === newDir.length) {
      console.log(`${fileName} was renamed to ${renamed} at ${date}`);
    } else {
      //Creation OR Deletion occuerd
      if (!(oldDir.length === newDir.length)) {
        if (fileExists(`./WatchedFolder/${fileName}`))
          console.log(`${fileName} was created at ${date}`);
        else {
          let found = false;
          for (const folder of newDir) {
            if (!path.extname(folder)) {
              if (fileExists(`./WatchedFolder/${folder}/${fileName}`)) {
                console.log(`${fileName} was moved to ${folder} at ${date}`);
                found = true;
              }
            }
          }
          if (!found) console.log(`${fileName} was deleted at ${date}`);
        }
      }
    }
    oldDir = newDir;
  }
});

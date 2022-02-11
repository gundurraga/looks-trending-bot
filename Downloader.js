const https = require("https");
const fs = require("fs");
const test = require("./test");

async function download(url, cb) {
  const req = https.get(url, async function (res) {
    let fileName = "file." + (await res.headers["content-type"].split("/")[1]);

    const fileStream = await fs.createWriteStream(fileName);
    res.pipe(fileStream);

    fileStream.on("error", function (error) {
      console.log("Error writing to the stream.", error);
    });
    fileStream.on("finish", function () {
      fileStream.close();
      console.log(`Successfully downloaded ${fileName}`);
      cb(fileName);
    });
  });
  req.on("error", function (error) {
    console.log("Error downloading the file.", error);
  });
}
let fileName = "file.png";
fileName = test.compress(fileName);
console.log(fileName);

module.exports.download = download;

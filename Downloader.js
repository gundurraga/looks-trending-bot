const https = require("https");
const fs = require("fs");

async function download(url) {
  var fileName = "file.png";
  const req = https.get(url, async function (res) {
    fileName = "file." + (await res.headers["content-type"].split("/")[1]);
    const fileStream = await fs.createWriteStream(fileName);
    res.pipe(fileStream);

    fileStream.on("error", function (error) {
      console.log("Error writing to the stream.");
      console.log(error);
    });
    fileStream.on("finish", async function () {
      fileStream.close();
      console.log(`Successfully download ${fileName}`);
    });
  });
  req.on("error", function (error) {
    console.log("Error downloading the file.");
    console.log(error);
  });
  return fileName;
}

module.exports.download = download;

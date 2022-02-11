const https = require("https");
const fs = require("fs");

async function download(url, cb) {
  const req = https.get(url, async function (res) {
    const fileName =
      "file." + (await res.headers["content-type"].split("/")[1]);

    if (filename === "file.png") {
      fileName = "file.webp";
    }

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

module.exports.download = download;

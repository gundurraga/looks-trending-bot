const https = require("https");
const fs = require("fs");

function download(url) {
  const req = https.get(url, function (res) {
    const fileStream = fs.createWriteStream("nft-img.webp");
    res.pipe(fileStream);

    fileStream.on("error", function (error) {
      console.log("Error writing to the stream.");
      console.log(error);
    });
    fileStream.on("finish", function () {
      fileStream.close();
      console.log("Downloaded image successfully.");
    });
  });

  req.on("error", function (error) {
    console.log("Error downloading the image.");
    console.log(error);
  });
}

module.exports.download = download;

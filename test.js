const fs = require("fs");
const request = require("request");
request
  .get({
    url: "https://looksrare.org/_next/image?url=https%3A%2F%2Fstatic.looksrare.org%2F0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270%2F16001252&w=3840&q=75",
  })
  .on("error", function (error) {
    console.log(error);
  })
  .on("response", function (res) {
    console.log(res.headers["content-type"].split("/")[1]);
    // it could also be content-dispostion or any other header, please check the headers first
  });

//TODO
//support svg
//CLEAN CODE

const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const { TwitterApi } = require("twitter-api-v2");

const Downloader = require("./Downloader");

dotenv.config({ path: "./config.env" });

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

let lastNFT = "";

async function twit(collection, nft, priceText, price, listingURL, fileName) {
  const mediaId = await client.v1.uploadMedia(fileName);

  let displayPrice = "";

  if (priceText) {
    displayPrice = "\n" + priceText + ": ♦️" + price;
  }

  await client.v1
    .tweet(collection + "\n" + nft + displayPrice + "\n#NFT #NFTCommunity", {
      media_ids: mediaId,
    })
    .then((val) => {
      client.v1
        .reply(listingURL, val.id_str)
        .then((val) => client.v2.like(val.user.id_str, val.id_str));
      client.v2.like(val.user.id_str, val.id_str);
      console.log("Twitted " + nft + " successfully.");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function scrapAndTwit() {
  let hour = new Date().getHours();
  let minutes = new Date().getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  console.log("-----------------------------------------------------");
  console.log(hour + ":" + minutes);

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
  } catch (e) {
    console.log("Error initialization puppeteer:", err);
    return;
  }

  await page.goto("https://looksrare.org", { waitUntil: "networkidle2" });
  let data = await page
    .evaluate(() => {
      let collection;
      let nft;
      let priceText;
      let price;
      let fileURL;
      let listingURL;

      collection = document.querySelector(
        'div[class="chakra-text css-1jjgvn4"]'
      ).innerText;

      nft = document.querySelector(
        'div[class="chakra-text css-6vo5mn"]'
      ).innerText;

      if (document.querySelector('div[class="chakra-text css-kw8lkc"]')) {
        priceText = document.querySelector(
          'div[class="chakra-text css-kw8lkc"]'
        ).innerText;
      }

      if (document.querySelector('div[class="chakra-text css-1byqfbw"]')) {
        price = document.querySelector(
          'div[class="chakra-text css-1byqfbw"]'
        ).innerText;
      } else {
        console.log("Price not available.");
      }

      fileURL = document.querySelector(
        'div[class="css-11c5cw0"] > span > img'
      ).src;

      listingURL = document.querySelector('div[class="css-1mx3pyi"] > a').href;

      return {
        collection,
        nft,
        priceText,
        price,
        fileURL,
        listingURL,
      };
    })
    .catch((err) => {
      console.log("Error", err);
      return;
    });

  await browser.close();

  if (lastNFT === data.nft) {
    console.log(`Trending NFT is the same: ${data.nft}.`);
    return;
  } else {
    Downloader.download(data.fileURL, (fileName) => {
      if (fileName === "file.svg+xml") {
        console.log("svg not supported yet.");
        return;
      }

      twit(
        data.collection,
        data.nft,
        data.priceText,
        data.price,
        data.listingURL,
        fileName
      );
    });
  }
  lastNFT = data.nft;
}

scrapAndTwit();

setInterval(() => {
  scrapAndTwit();
}, 300000); // 5 minutes

//TODO
//support svg
//CLEAN CODE
//fix twit looks info (puppeteer)
//use coingecko api

const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const { TwitterApi } = require("twitter-api-v2");

const Downloader = require("./Downloader");
const Hashtag = require("./Hashtag");
const { getLooksData } = require("./GetLooksData");

dotenv.config({ path: "./config.env" });

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

let lastNFT = "";

async function twitNFT(
  collection,
  nft,
  priceText,
  price,
  listingURL,
  fileName
) {
  const mediaId = await client.v1.uploadMedia(fileName);

  let displayPrice = "";
  let hashtags = Hashtag.hashtags();

  if (priceText) {
    displayPrice = "\n" + priceText + ": ♦️" + price;
  }

  await client.v1
    .tweet(collection + "\n" + nft + displayPrice + "\n" + hashtags, {
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
      return;
    });
}

async function twitLooks(price, marketCap, rank, apr) {
  await client.v1
    .tweet(
      "$LOOKS: " +
        price +
        "\nMarket Cap: " +
        marketCap +
        " (" +
        rank +
        ") \n" +
        apr +
        "\n #NFTCommunity @LooksRareNFT"
    )
    .then((val) => {
      client.v2.like(val.user.id_str, val.id_str);
      console.log("Twitted $LOOKS info successfully.");
    })
    .catch((err) => {
      console.log(err);
      return;
    });
}

function logTime() {
  let hour = new Date().getHours();
  let minutes = new Date().getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  console.log(hour + ":" + minutes);
}

async function scrapAndTwitLooks() {
  logTime();
  let looksInfo = await getLooksData();
  twitLooks(
    looksInfo.lPrice,
    looksInfo.lMarketCap,
    looksInfo.lRank,
    looksInfo.lAPR
  );
}

async function scrapAndTwitNFT() {
  logTime();

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

  await page
    .goto("https://looksrare.org", { waitUntil: "networkidle2" })
    .catch((err) => {
      console.log("Error loading looksrare", err);
      return;
    });
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

      if (document.querySelector('div[class="css-11c5cw0"] > span > img')) {
        fileURL = document.querySelector(
          'div[class="css-11c5cw0"] > span > img'
        ).src;
      } else {
        console.log("image not available");
        return;
      }

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
      console.log("Error evaluating website", err);
      return;
    });

  await browser.close();

  if (!data) {
    console.log("No data available");
    return;
  }

  if (lastNFT === data.nft) {
    console.log(`Trending NFT is the same: ${data.nft}.`);
    return;
  } else {
    Downloader.download(data.fileURL, (fileName) => {
      if (fileName === "file.svg+xml") {
        console.log("svg not supported yet.");
        return;
      }

      twitNFT(
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

let minute = 60000;

scrapAndTwitLooks();
scrapAndTwitNFT();

setInterval(() => {
  scrapAndTwitLooks();
}, 60 * minute);

setInterval(() => {
  scrapAndTwitNFT();
}, 5 * minute);

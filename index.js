//TODO
//like twit
//reply tweet wit nft url
//support video
//support svg

const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const Downloader = require("./Downloader");

dotenv.config({ path: "./config.env" });

const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

let lastCollection = "";
let collectionRepetition = 1;

async function twit(collection, nft, priceText, price) {
  const image = "nft-img.webp";

  const mediaId = await client.v1.uploadMedia(image);

  let displayPrice = "";

  if (priceText) {
    displayPrice = priceText + ": ♦️" + price;
  }

  const newTweet = await client.v1
    .tweet(
      collection + "\n" + nft + "\n" + displayPrice + "\n#NFT #LooksRare",
      {
        media_ids: mediaId,
      }
    )
    .then((val) => {
      // console.log(val);
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

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto("https://looksrare.org", { waitUntil: "networkidle2" });
  let data = await page.evaluate(() => {
    let collection;
    let nft;
    let priceText;
    let price;

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

    const imgURL = document.querySelector(
      'div[class="css-11c5cw0"] > span > img'
    ).src;

    return {
      collection,
      nft,
      priceText,
      price,
      imgURL,
    };
  });

  await browser.close();

  if (lastCollection === data.collection && collectionRepetition % 20 !== 0) {
    collectionRepetition++;
    console.log(
      `Trending NFT collection is the same: ${data.collection}. Repeated ${collectionRepetition} times.`
    );

    return;
  } else {
    await Downloader.download(data.imgURL);

    setTimeout(async () => {
      await twit(data.collection, data.nft, data.priceText, data.price);
    }, 5000);

    collectionRepetition = 1;
  }

  lastCollection = data.collection;
}

scrapAndTwit();

setInterval(() => {
  scrapAndTwit();
}, 540000); // 9 minutes

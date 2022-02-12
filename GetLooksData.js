const puppeteer = require("puppeteer");

async function getLooksData() {
  try {
    browser2 = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page2 = await browser2.newPage();
    await page2.setDefaultNavigationTimeout(0);
  } catch (e) {
    console.log("Error initialization puppeteer:", err);
    return;
  }

  await page2
    .goto("https://www.coingecko.com/en/coins/looksrare", {
      waitUntil: "networkidle2",
    })
    .catch((err) => {
      console.log("Error loading coingecko", err);
      return;
    });

  let looksData = await page2
    .evaluate(() => {
      let looksPrice;
      let marketCap;

      looksPrice = document.querySelector(
        'span[class="tw-text-gray-900 dark:tw-text-white tw-text-3xl"] > span'
      ).innerText;
      marketCap = document.querySelector(
        'span[class="tw-text-gray-900 dark:tw-text-white tw-float-right tw-font-medium"] > span'
      ).innerText;
      rank = document.querySelector(
        'div[class="tw-inline-flex tw-items-center tw-px-2 tw-py-0.5 tw-rounded-md tw-text-xs tw-font-medium tw-bg-gray-800 tw-text-gray-100 tw-mb-1 md:tw-mb-0 md:tw-mt-0 dark:tw-bg-gray-600 dark:tw-bg-opacity-40"]'
      ).innerText;

      return {
        looksPrice,
        marketCap,
        rank,
      };
    })
    .catch((err) => {
      console.log("Error evaluating website", err);
      return;
    });

  await page2
    .goto("https://looksrare.org/rewards", {
      waitUntil: "networkidle2",
    })
    .catch((err) => {
      console.log("Error loading looksrare", err);
      return;
    });

  let looksAPR = await page2
    .evaluate(() => {
      let apr;

      apr = document.querySelector(
        'h1[class="chakra-text css-15859p6"]'
      ).innerText;

      return {
        apr,
      };
    })
    .catch((err) => {
      console.log("Error evaluating website", err);
      return;
    });

  await browser2.close();

  let lPrice = looksData.looksPrice;
  let lMarketCap = looksData.marketCap;
  let lRank = looksData.rank;
  let lAPR = looksAPR.apr;

  return { lPrice, lMarketCap, lRank, lAPR };
}

module.exports.getLooksData = getLooksData;

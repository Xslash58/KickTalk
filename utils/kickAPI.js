import { connect } from "puppeteer-real-browser";

let browser, page, messagePage;

const init = async () => {
  const connection = await connect({
    headless: true,
    args: [
      "--window-position=50000,500000",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
    ],
    customConfig: {},
    turnstile: true,
    connectOption: {},
    disableXvfb: false,
    ignoreAllFlags: false,
  });

  browser = connection.browser;
  page = connection.page;
  console.log("Puppeteer: Browser initialized and ready to use");
};

const fetchData = async (url) => {
  if (!browser || !page) {
    throw new Error("Puppeteer: Browser not initialized. Call init() first.");
  }

  await page.bringToFront();
  await page.goto(url);
  console.log("Puppeteer: Navigated through Cloudflare protection");

  const bodyHandle = await page.$("body");
  const bodyHTML = await page.evaluate((body) => body.innerText, bodyHandle);
  const bodyJSON = JSON.parse(bodyHTML);

  console.log("Page body:", bodyHTML);

  return bodyJSON;
};

const sendMessage = async (channelId, message) => {
  if (!browser) {
    throw new Error("Puppeteer: Browser not initialized. Call init() first.");
  }

  if (!messagePage) {
    messagePage = await browser.newPage();
  }

  const targetUrl = `https://kick.com/api/v2/messages/send/${channelId}`;
  const currentUrl = messagePage.url();

  if (currentUrl !== targetUrl) {
    await messagePage.goto(targetUrl);
    currentChannelId = channelId;
  }

  await messagePage.evaluate((message) => {
    fetch("", {
      headers: {
        accept: "application/json",
        "accept-language": "en-US,en;q=0.9,ar;q=0.8",
        authorization: "Bearer 159273288|EhOEfzVSi3ywsq7z1PFLJvr4MXhfxNZ8l5V2BKgs",
        "cache-control": "max-age=0",
        cluster: "v2",
        "content-type": "application/json",
        "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
      body: JSON.stringify({ content: message, type: "message" }),
      method: "POST",
      credentials: "include",
    });
  }, message);
};

const closeBrowser = async () => {
  if (browser) {
    await browser.close();
    console.log("Browser closed");
  }
};

export { init, fetchData, sendMessage, closeBrowser };

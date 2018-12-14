const { URL } = require('url');
const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');
const ApiError = require('../common/models/api-errors');
const { isValidUrl } = require('../utils/common');

// domain => extractor
const extractorMap = new Map([
  ['jiqimao.tv', extractJiqimaoTv],
  ['youtu.be', extractYoutu],
  ['youtube.com', extractYoutube],
  ['www.youtube.com', extractYoutube],
]);

async function getBrowser() {
  return puppeteer.launch({
    executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
}

/**
 * TODO support other video types (other than HLS) of jiqimao.tv
 * TODO extract other info such as title
 */
async function extractJiqimaoTv(pageUrl) {
  let browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  let page = await browser.newPage();
  // jiqimao will request two HLS index files sequentially
  // here, we are only interested in the second one
  let firstIndexFileRequested = false;
  // video's url
  let url = null;
  // for now it's hardcoded
  let type = 'hls';
  // video's title (page's title)
  let title = undefined;
  
  page.on('request', request => {
    if (request.url().endsWith('.m3u8')) {
      if (firstIndexFileRequested) {
        url = request.url();
        page.evaluate('window.indexFileRequested = true');
      } else {
        firstIndexFileRequested = true;
      }
    }
  });

  try {
    await page.goto(pageUrl);
    title = await page.title();
    await page.waitForFunction('window.indexFileRequested === true');
    await browser.close();
    return { url, type, title };
  } catch (err) {
    if (err instanceof TimeoutError) {
      throw new ApiError.NotImplemented({
        message: "Failed to extract video info from given page URL."
      });
    }
    throw err;
  }
}

async function extractYoutu(pageUrl) {
  if (!isValidUrl(pageUrl)) {
    throw new ApiError.BadReq({ message: 'Invalid URL given.' });
  }

  let parsedUrl = new URL(pageUrl);
  let url = parsedUrl.pathname.slice(1);
  let type ='youtube';
  let title = await extractVideoTitle(pageUrl);

  if (url.length) {
    return { url, type, title };
  }
  throw new ApiError.BadReq();
}

async function extractYoutube(pageUrl) {
  if (!isValidUrl(pageUrl)) {
    throw new ApiError.BadReq({ message: 'Invalid URL given.' });
  }

  let parsedUrl = new URL(pageUrl);
  let url = parsedUrl.searchParams.get('v');
  let type ='youtube';
  let title = await extractVideoTitle(pageUrl);

  if (url && url.length) {
    return { url, type, title };
  }
  throw new ApiError.BadReq();
}

async function extractGeneric(pageUrl) {
  // TODO
  throw new ApiError.NotImplemented();
}

/**
 * Video info typically consists of `url` and `type`.
 * 
 * TODO provide and use other info such as user's agent and version
 * TODO find a way to cache the extraction results (considering extra info above)
 */
async function extractVideoInfo(pageUrl) {
  let parsedUrl = null;
  try {
    parsedUrl = new URL(pageUrl);
  } catch (err) {
    if (err instanceof TypeError) {
      throw new ApiError.BadReq({ message: 'Invalid URL given.' });
    }
    throw err;
  }

  let extractor = extractorMap.get(parsedUrl.hostname) || extractGeneric;
  return extractor(pageUrl);
}

async function extractVideoTitle(pageUrl) {
  if (!isValidUrl(pageUrl)) {
    throw new ApiError.BadReq({ message: 'Invalid URL given.' });
  }

  let browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  let page = await browser.newPage();
  await page.goto(pageUrl);
  let title = await page.title();
  await browser.close();
  return title;
}

exports.extractVideoInfo = extractVideoInfo;
exports.extractVideoTitle = extractVideoTitle;

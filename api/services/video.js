const { URL } = require('url');
const puppeteer = require('puppeteer');
const ApiError = require('../common/models/api-errors');

// domain => extractor
const extractorMap = new Map([
  ['jiqimao.tv', extractJiqimaoTv]
]);

/**
 * TODO support other video types (other than HLS) of jiqimao.tv
 * TODO handle and convert timeout error
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

  await page.goto(pageUrl);
  await page.waitForFunction('window.indexFileRequested === true');
  await browser.close();
  return { url, type };
}

async function extractGeneric(pageUrl) {
  // TODO
  return { url: 'https://test.video.url/', type: 'hls' };
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

exports.extractVideoInfo = extractVideoInfo;

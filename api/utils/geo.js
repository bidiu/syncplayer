/*
 * geographical utils in this file
 */

const axios = require('axios').default;
const env = require('../env/env');

const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${env.mapApiKey}`;

/**
 * Geocode an address to a coordinate with Google map API. 
 * Resolve the coded coordinate, or reject with any error.
 * 
 * Note that this is an async function, because it needs to
 * communicate with Google Map API.
 * 
 * Resovled value format:
 * 
 *    { lat: 65.4117967302915, lng: -95.6546153197085 }
 */
async function geocodeAddress(address, zip) {
  address = combineAddresses(address, zip);

  let url = encodeURI(`${geocodingUrl}&address=${address}`);

  return axios.get(url)
    .then((resp) => {
      let payload = resp.data;

      if (payload.status !== 'OK') {
        throw new Error('Can\'t geocode the given address. Status: ', payload.status);
      }
      return payload.results[0].geometry.location;
    });
}

/**
 * Resovled value format:
 * 
 *    { lat: 65.4117967302915, lng: -95.6546153197085 }
 */
function parseCoordinateStr(str, delimiter = ',') {
  let values = str.split(delimiter).map(v => v.trim());
  let coordinate = {};

  if (values.length !== 2 
    || values[0] === ''
    || isNaN(values[0])
    || values[1] === ''
    || isNaN(values[1])) {
    throw Error('Invalid coordinate string.');
  }

  return { lat: Number(values[0]), lng: Number(values[1]) };
}

/**
 * Return an image url which can be put in the `src` attribute
 * of an image.
 * 
 * @param {*} address address or coordinate (also known as marker)
 * @param {*} key     google api key
 */
function genStaticMapUrl(address, { size = '500x500' } = {}) {
  if (address === undefined) {
    return undefined;
  }

  let protocol = env.env === 'dev' ? 'http' : 'https';
  let host = 'maps.googleapis.com';
  let endpoint = '/maps/api/staticmap';
  let key = env.mapApiKey;

  let url = `${protocol}://${host}${endpoint}?key=${key}&markers=${address}&size=${size}`;
  return encodeURI(url);
}

/**
 * Combine human readable address and zipcode. It will take care of either
 * being undefined/null or empty string.
 * 
 * If both adress and zipcode are undefined/null, an error will be thrown.
 */
function combineAddresses(address, zipcode) {
  address = typeof address === 'string' ? address.trim() : undefined;
  zipcode = typeof address === 'string' ? zipcode.trim() : undefined;

  address = address || undefined;
  zipcode = zipcode || undefined;

  if (!address && !zipcode) { throw new Error('Invalid parameters.'); }

  let joint = address && zipcode ? ', ' : '';
  return (address || '') + joint + (zipcode || '');
}

exports.geocodeAddress = geocodeAddress;
exports.genStaticMapUrl = genStaticMapUrl;
exports.combineAddresses = combineAddresses;
exports.parseCoordinateStr = parseCoordinateStr;

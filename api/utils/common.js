const { URL } = require('url');

function compressDoc(doc) {
  for (let [k, v] of Object.entries(doc)) {
    if (typeof v === 'undefined') {
      delete doc[k];
    }
  }
  return doc;
}

const isValidJson = (json) => {
  if (typeof json !== 'string' || !json) {
    return false;
  }

  try {
    JSON.parse(json);
    return true;
  } catch (e) { }
  return false;
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;

  } catch (err) {
    if (err instanceof TypeError) {
      return false;
    }
    throw err;
  }
};

/**
 * From 0 (inclusive) to `max` (exclusive).
 */
const randomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

/**
 * Randomly pick `num` items from an array. Note that original array 
 * won't be altered. And also the order of items won't be preserved 
 * in the picked array.
 */
const pickItems = (array, num) => {
  let copiedArray = [...array];
  let picked = [];
  num = Math.min(array.length, num);
  for (let i = 0; i < num; i++) {
    picked.push(...copiedArray.splice(randomInt(copiedArray.length), 1));
  }
  return picked;
};

function mapToObj(map) {
  const out = Object.create(null);
  map.forEach((value, key) => {
    if (value instanceof Map) {
      out[key] = map_to_object(value);
    } else {
      out[key] = value;
    }
  });
  return out;
}

exports.compressDoc = compressDoc;
exports.isValidJson = isValidJson;
exports.isValidUrl = isValidUrl;
exports.randomInt = randomInt;
exports.pickItems = pickItems;
exports.mapToObj = mapToObj;

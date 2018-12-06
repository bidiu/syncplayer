/**
 * in ms
 */
const getCurTimestamp = (unit = 'ms') => {
  if (unit === 'ms') {
    return new Date().getTime();
  } else if (unit === 's') {
    return Math.round(new Date().getTime() / 1000);
  } else {
    throw new Error('Invalid unit: ' + unit + '.');
  }
}

exports.getCurTimestamp = getCurTimestamp;

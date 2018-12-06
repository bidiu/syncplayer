import { createLitemsg as _createLitemsg } from 'litemessage/dist/litemessage.umd';
import { equalArrays } from './commonUtils';
import { getCurTimestamp } from './timeUtils';

/**
 * Changes in order won't make this function return true.
 */
const peersChanged = (oldPeers, newPeers, extractScalar = p => p.uuid) => {
  return !equalArrays(oldPeers, newPeers, extractScalar);
};

const createLitemsg = (content) => {
  return _createLitemsg(1, getCurTimestamp(), content, '', '');
};

export { peersChanged, createLitemsg };

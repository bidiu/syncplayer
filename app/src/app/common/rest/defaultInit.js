import env from '../../env/environment';
import defaultHeaders from './defaultHeaders';

const defaultInit = {
  method: 'GET',
  headers: defaultHeaders,
  mode: 'cors',
  credentials: env.name === 'production' ? 'same-origin' : 'include',
  redirect: 'follow'
};

export default Object.freeze(defaultInit);

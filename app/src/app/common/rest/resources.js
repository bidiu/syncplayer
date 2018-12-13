import env from '../../env/environment';
import defaultInit from './defaultInit';

const API_BASE = env.apiBase;

const resouces = {
  createRoom({ videoUrl, videoType, pageUrl }) {
    let url = `${API_BASE}/rooms`;
    let body = JSON.stringify({ videoUrl, videoType, pageUrl });
    let init = { ...defaultInit, body, method: 'POST' };
    return new Request(url, init);
  },
  retrieveRoom(roomId) {
    let url = `${API_BASE}/rooms/${roomId}`;
    return new Request(url, defaultInit);
  }
};

export default Object.freeze(resouces);

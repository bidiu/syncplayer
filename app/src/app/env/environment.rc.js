export default {
  name: 'release candidate',
  apiBase: '/api/v1',
  syncServerUrl: process.env.REACT_APP_SYNC_SERVER_URL || 'ws://127.0.0.1:80/ws',
  demoVideoInfo: {
    videoUrl: 'EDPV-Syvx_k',
    videoType: 'youtube',
    pageUrl: undefined
  }
};

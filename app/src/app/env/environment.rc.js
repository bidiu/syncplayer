export default {
  name: 'release candidate',
  // initPeerUrls: [
  //   'ws://45.79.182.46:1113'
  // ],
  apiBase: '/api/v1',
  syncServerUrl: process.env.REACT_APP_SYNC_SERVER_URL || 'ws://127.0.0.1:80/ws',
  demoVideoInfo: {
    videoUrl: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
    videoType: 'mp4',
    pageUrl: undefined
  }
};

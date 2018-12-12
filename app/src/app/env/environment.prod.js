export default {
  name: 'production',
  initPeerUrls: [
    'ws://45.79.182.46:1113'
  ],
  apiBase: 'http://localhost:4010/api/v1',
  syncServerUrl: 'ws://localhost:4010',
  demoVideoInfo: {
    videoUrl: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
    videoType: 'mp4',
    pageUrl: undefined
  }
};

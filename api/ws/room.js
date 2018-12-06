const { mapToObj } = require('../utils/common');

const defaultPlayerInfo = Object.freeze({
  paused: true,
  // below is only for logging (only `pasued` matters here)
  currentTime: 0,
  timestamp: undefined,
});

/**
 * During the lifetime of a room, the video being played cannot
 * be changed.
 */
class Room {
  /**
   * You should provide the video info here, even though
   * it's not required.
   * 
   * @param {*} roomId 
   * @param {*} options
   *    videoInfo:   (optional) typically, url and type
   *    playerInfo:  (optional) paused, currentTime, timestamp
   */
  constructor(roomId, { videoInfo, playerInfo } = {}) {
    this.roomId = roomId;
    this.videoInfo = videoInfo;
    this.playerInfo = { ...defaultPlayerInfo, ...playerInfo };
    // uuid => peer
    this.peers = new Map();
  }

  join(peer) {
    let uuid = peer.uuid;

    if (!this.peers.has(uuid)) {
      this.peers.set(uuid, peer);
      return true;
    }
    return false;
  }

  leave(peer) {
    return this.peers.delete(peer.uuid);
  }

  /**
   * @param {*} nextPlayerInfo pasued?, currentTime?
   */
  updatePlayerInfo(nextPlayerInfo) {
    this.playerInfo = { ...this.playerInfo, ...nextPlayerInfo };
  }

  /**
   * Broadcast message inside the room.
   */
  broadcastMsg(msg, except = []) {
    if (!(except instanceof Array)) {
      except = [except];
    }
    let uuids = except.map(peer => peer.uuid);

    Array.from(this.peers.values())
      .filter(peer => !uuids.includes(peer.uuid))
      .forEach(peer => peer.sendJson(msg));
  }

  isEmpty() {
    return this.peers.size === 0;
  }

  close() {
    this.peers.clear();
    this.playerInfo = { ...defaultPlayerInfo };
  }

  toJSON() {
    return {
      roomId: this.roomId,
      videoInfo: this.videoInfo,
      playerInfo: this.playerInfo,
      peers: mapToObj(this.peers)
    };
  };
}

module.exports = Room;

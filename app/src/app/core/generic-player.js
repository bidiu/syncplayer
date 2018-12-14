/**
 * Types:
 *  - youtube
 *  - default (dplayer)
 */
class GenericPlayer {
  constructor(player, type) {
    this.player = player;
    this.type = type;
  }

  /**
   * video information
   */
  get video() {
    switch (this.type) {
      case 'youtube':
        return {
          // Because when `seeking`, `paused` will be triggered first,
          // so here the `paused` down below might be false positive.
          // Hoever, right now sync server will only consider `paused`
          // when action is `play` and `pause`, so that actually
          // should not be a visible problem.
          paused: [-1, 0, 2].includes(this.player.getPlayerState()),
          currentTime: this.player.getCurrentTime()
        };

      default:
        return {
          paused: this.player.video.paused,
          currentTime: this.player.video.currentTime
        };

    } // end of switch
  }

  play() {
    switch (this.type) {
      case 'youtube':
        this.player.playVideo();
        break;

      default:
        this.player.play();

    } // end of switch
  }

  pause() {
    switch (this.type) {
      case 'youtube':
        this.player.pauseVideo();
        break;

      default:
        this.player.pause();

    } // end of switch
  }

  toggle() {
    switch (this.type) {
      case 'youtube':
        if (this.video.paused) {
          this.play();
        } else {
          this.pause();
        }
        break;

      default:
        this.player.toggle();

    } // end of switch
  }

  /**
   * @param {number} time unit is second
   */
  seek(time) {
    switch (this.type) {
      case 'youtube':
        this.player.seekTo(time);
        break;

      default:
        this.player.seek(time);

    } // end of switch
  }
}

export default GenericPlayer;

import React, { Component } from 'react';
import {
  calcOffsetToDoc, calcOffsetToViewport, getDocDimension,
  getViewportDimension } from '../../../utils/domUtils';

import './Bubble.css';

const DEFAULT_GAP = 12;
// a very non-accurate estimated height
const DEFAULT_HEIGHT = 180;

/**
 * When using this component, you should provide an estimated width and height
 * for the enclosing bubble content (height is optional). The more accurate the
 * estimation is, the more precise the bubble is positioned.
 * 
 * Also note that the child of this component MUST be ONE custom component.
 */
class Bubble extends Component {
  constructor(props) {
    super(props);
    this.onContentClicked = this.onContentClicked.bind(this);
    this.onContentChildrenClicked = this.onContentChildrenClicked.bind(this);
    this.onOverlayClicked = this.onOverlayClicked.bind(this);
  }

  /**
   * Calculate the offset relative to enclosing positioned element.
   */
  calcOffsetForVerticalMode() {
    // baseEl is the base HTML element (native) the bubble will be positioned to
    let { offsetTop, offsetLeft, offsetHeight, offsetWidth } = this.props.baseEl;
    // width is the estimated width of the bubble (to be as accurate as possible)
    let width = this.props.width;
    // relative to enclosing positioned element
    let rawOffset = {
      top: offsetTop + offsetHeight + (this.props.gap || DEFAULT_GAP),
      left: offsetLeft + (offsetWidth / 2) - (width / 2)
    };

    this.bubblePosition = 'bottom';

    // adjusts the raw offset
    let offsetToDoc = calcOffsetToDoc(this.props.baseEl.offsetParent);
    let docDimension = getDocDimension();
    if (offsetToDoc.left + rawOffset.left < 0) {
      return { ...rawOffset, left: -offsetToDoc.left };
    }
    if (offsetToDoc.left + rawOffset.left + width > docDimension.width) {
      let delta = offsetToDoc.left + rawOffset.left + width - docDimension.width;
      return { ...rawOffset, left: rawOffset.left - delta }  
    }
    return rawOffset;
  }

  calcOffsetForHorizontalMode() {
    // baseEl is the base HTML element (native) the bubble will be positioned to
    let { offsetLeft, offsetWidth } = this.props.baseEl;
    // width is the estimated width of the bubble (to be as accurate as possible)
    let width = this.props.width;
    
    let gap = this.props.gap || DEFAULT_GAP;
    let offsetToDoc = calcOffsetToDoc(this.props.baseEl.offsetParent);
    let docDimension = getDocDimension();

    let rawOffset = null;
    if (offsetToDoc.left + offsetLeft + offsetWidth + gap + width <= docDimension.width) {
      this.bubblePosition = 'right';
      rawOffset = this.calcOffsetForRightCase();
    } else {
      this.bubblePosition = 'left';
      rawOffset = this.calcOffsetForLeftCase();
    }

    // rectify `top` offset in terms of viewport 
    let topConstraint = this.calcOffsetConstraintForHorizontalMode();
    if (rawOffset.top < topConstraint.min) {
      return { ...rawOffset, top: topConstraint.min };
    } else if (rawOffset.top > topConstraint.max) {
      return { ...rawOffset, top: topConstraint.max };
    } else {
      return rawOffset;
    }
  }

  calcOffsetForRightCase() {
    // baseEl is the base HTML element (native) the bubble will be positioned to
    let { offsetTop, offsetLeft, offsetHeight, offsetWidth } = this.props.baseEl;
    // height is the estimated height of the bubble (to be as accurate as possible)
    let height = this.props.height || DEFAULT_HEIGHT;
    let gap = this.props.gap || DEFAULT_GAP;

    return {
      left: offsetLeft + offsetWidth + gap,
      top: offsetTop + (offsetHeight / 2) - (height / 2)
    };
  }

  calcOffsetForLeftCase() {
    // baseEl is the base HTML element (native) the bubble will be positioned to
    let { offsetTop, offsetLeft, offsetHeight } = this.props.baseEl;
    // width is the estimated width of the bubble (to be as accurate as possible)
    let width = this.props.width;
    // height is the estimated height of the bubble (to be as accurate as possible)
    let height = this.props.height || DEFAULT_HEIGHT;
    let gap = this.props.gap || DEFAULT_GAP;

    return {
      left: offsetLeft - gap - width,
      top: offsetTop + (offsetHeight / 2) - (height / 2)
    };
  }

  /**
   * The constraint is only for `top`, not for `left`, and it's imposed
   * by viewport, not document. And also, constraint, at least right
   * now only applies when in `horizontal` mode.
   */
  calcOffsetConstraintForHorizontalMode() {
    let viewport = getViewportDimension();
    let offsetToViewport = calcOffsetToViewport(this.props.baseEl.offsetParent);
    let height = this.props.height || DEFAULT_HEIGHT;

    return {
      min: -offsetToViewport.top,
      max: viewport.height - height - offsetToViewport.top
    };
  }

  /**
   * This will be called when click event bubbles (event bubbling)
   * from childen to content container.
   */
  onContentClicked() {
    let handler = this.props.onContentClicked;
    if (typeof handler === 'function') {
      handler();
    }
  }

  onContentChildrenClicked() {
    let handler = this.props.onContentChildrenClicked;
    if (typeof handler === 'function') {
      handler();
    }
  }

  /**
   * Most of the time, you need to provide this, and
   * close (destroy) the bubble.
   */
  onOverlayClicked() {
    let handler = this.props.onOverlayClicked;
    if (typeof handler === 'function') {
      handler();
    }
  }

  render() {
    let children = this.props.children;
    let onContentChildrenClicked = this.onContentChildrenClicked;
    children = React.cloneElement(children, { onContentChildrenClicked })

    let contentStyle = null;
    let mode = this.props.mode || 'vertical';
    if (mode === 'vertical') {
      contentStyle = this.calcOffsetForVerticalMode();
    } else {
      contentStyle = this.calcOffsetForHorizontalMode();
    }

    let showOverlay = this.props.showOverlay || false;

    return (
      <div className={`Bubble Bubble-${this.bubblePosition}`}>
        <div className="Bubble-content ink-popup-focus"
          onClick={this.onContentClicked}
          style={contentStyle}>
          {children}
        </div>
        {showOverlay && (
          <div className="Bubble-overlay"
            onClick={this.onOverlayClicked}>
          </div>
        )}
      </div>
    );
  }
}

export default Bubble;

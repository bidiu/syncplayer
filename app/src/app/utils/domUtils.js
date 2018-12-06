import store from '../bootstrap/store';
import { hideScrollbar, showScrollbar } from '../common/state/newui/index';

const calcOffsetToDoc = (el) => {
  var rect = el.getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
};

const calcOffsetToViewport = (el) => {
  return el.getBoundingClientRect();
}

const getDocDimension = () => {
  let height = document.documentElement.scrollHeight;
  let width = document.documentElement.scrollWidth;
  return { height, width };
};

const getViewportDimension = (scrollbar = false) => {
  if (scrollbar) {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  } else {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    };
  }
};

const getScrollBarWidth = () => {
  let inner = document.createElement('p');
  inner.style.width = "100%";
  inner.style.height = "200px";

  let outer = document.createElement('div');
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild (inner);

  document.body.appendChild (outer);
  let w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  let w2 = inner.offsetWidth;
  if (w1 === w2) w2 = outer.clientWidth;
  document.body.removeChild (outer);
  return (w1 - w2);
};

/**
 * Suppose `overflow` is not hidden.
 */
const shouldWindowVerticalScrollBarShown = () => {
  return document.documentElement.scrollHeight > window.innerHeight;
};

const hideDocScrollBars = ({ x = true, y = true } = {}) => {
  if (x) {
    document.documentElement.style.overflowX = 'hidden';
    // document.documentElement.classList.add('hide-doc-scrollbar-x');
  }
  if (y) {
    document.documentElement.classList.add('prevent-body-scroll');
    document.body.classList.add('prevent-body-scroll');

    if (shouldWindowVerticalScrollBarShown()) {
      document.documentElement.style.paddingRight = getScrollBarWidth() + 'px';
      document.documentElement.classList.add('hide-doc-scrollbar-y');
      store.dispatch(hideScrollbar());
    }
  }
};

const showDocScrollBars = ({ x = true, y = true } = {}) => {
  if (x) {
    document.documentElement.style.overflowX = '';
    // document.documentElement.classList.remove('hide-doc-scrollbar-x');
  }
  if (y) {
    document.documentElement.classList.remove('prevent-body-scroll');
    document.body.classList.remove('prevent-body-scroll');

    document.documentElement.style.paddingRight = '0';
    document.documentElement.classList.remove('hide-doc-scrollbar-y');
    store.dispatch(showScrollbar());
  }
};

const getDocScrollPercentage = () => {
  let rootEl = document.documentElement;
  let viewportDimension = getViewportDimension();

  return {
    x: (rootEl.scrollLeft + viewportDimension.width) / rootEl.scrollWidth,
    y: (rootEl.scrollTop + viewportDimension.height) / rootEl.scrollHeight
  };
};

export {
  calcOffsetToDoc, calcOffsetToViewport, getDocDimension, getViewportDimension,
  hideDocScrollBars, showDocScrollBars, getDocScrollPercentage, getScrollBarWidth,
  shouldWindowVerticalScrollBarShown
};

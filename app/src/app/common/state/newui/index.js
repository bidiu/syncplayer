import { combineReducers } from 'redux';
import { genActionCreator, genActionTypeCreator } from '../../../utils/stateUtils';
import tab from './tab';
import scrollbar from './scrollbar';
import viewport from './viewport'

const genActionType = genActionTypeCreator('new_ui');

const SET_TAB = genActionType('set_tab');
const UNSET_TAB = genActionType('unset_tab');
const SET_SCROLLBAR_WIDTH = genActionType('set_scrollbar_width');
const HIDE_SCROLLBAR = genActionType('hide_scrollbar');
const SHOW_SCROLLBAR = genActionType('show_scrollbar');
const SET_VIEWPORT_SIZE = genActionType('set_viewport_size');

const setTab = genActionCreator(SET_TAB, 'tab');
const unsetTab = genActionCreator(UNSET_TAB);
const setScrollbarWidth = genActionCreator(SET_SCROLLBAR_WIDTH, 'width');
const hideScrollbar = genActionCreator(HIDE_SCROLLBAR);
const showScrollbar = genActionCreator(SHOW_SCROLLBAR);
const setViewportSize = genActionCreator(SET_VIEWPORT_SIZE, 'width', 'height');

const newui = combineReducers({ tab, scrollbar, viewport });

export {
  setTab, SET_TAB,
  unsetTab, UNSET_TAB,
  setScrollbarWidth, SET_SCROLLBAR_WIDTH,
  hideScrollbar, HIDE_SCROLLBAR,
  showScrollbar, SHOW_SCROLLBAR,
  setViewportSize, SET_VIEWPORT_SIZE,
};

export default newui;

import { combineReducers } from 'redux';
import { genActionCreator, genActionTypeCreator } from '../../../utils/stateUtils';
import tab from './tab';
import scrollbar from './scrollbar';

const genActionType = genActionTypeCreator('new_ui');

const SET_TAB = genActionType('set_tab');
const UNSET_TAB = genActionType('unset_tab');
const SET_SCROLLBAR_WIDTH = genActionType('set_scrollbar_width');
const HIDE_SCROLLBAR = genActionType('hide_scrollbar');
const SHOW_SCROLLBAR = genActionType('show_scrollbar');

const setTab = genActionCreator(SET_TAB, 'tab');
const unsetTab = genActionCreator(UNSET_TAB);
const setScrollbarWidth = genActionCreator(SET_SCROLLBAR_WIDTH, 'width');
const hideScrollbar = genActionCreator(HIDE_SCROLLBAR);
const showScrollbar = genActionCreator(SHOW_SCROLLBAR);

const newui = combineReducers({ tab, scrollbar });

export {
  setTab, SET_TAB,
  unsetTab, UNSET_TAB,
  setScrollbarWidth, SET_SCROLLBAR_WIDTH,
  hideScrollbar, HIDE_SCROLLBAR,
  showScrollbar, SHOW_SCROLLBAR,
};

export default newui;

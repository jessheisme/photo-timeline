import { layoutType, panelType } from '../core/layout/constants';

export const LAYOUT_KEY = 'app-layout';

export const APP_WIDTH = 800;
export const APP_HEIGHT = 600;

export const panels = {
  APP: 'app',
  SIDE_BAR: 'side-bar',
  MAIN_CONTENT: 'main-content',
};

export const initialLayout = {
  [panels.APP]: {
    key: panels.APP,
    layoutType: layoutType.ROW,
    children: [
      panels.SIDE_BAR,
      panels.MAIN_CONTENT,
    ],
  },
  [panels.SIDE_BAR]: {
    key: panels.SIDE_BAR,
    panelType: panelType.SIZE,
    defaultSize: 252,
    size: 252,
  },
  [panels.MAIN_CONTENT]: {
    key: panels.MAIN_CONTENT,
    panelType: panelType.GROW,
  },
  
}

export default {
  LAYOUT_KEY,
  initialKey: panels.APP,
  layout: initialLayout,
  width: APP_WIDTH,
  height: APP_HEIGHT,
  panels,
}
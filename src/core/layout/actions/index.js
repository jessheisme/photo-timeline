import {
  UPDATE_LAYOUT,
  TOGGLE_LAYOUT,
  TOGGLE_PANEL,  
} from '../constants/action-types';

export const updateLayout = (layoutKey, layout) => ({
  type: UPDATE_LAYOUT,
  payload: { layoutKey, layout },
});

export const toggleLayout = (layoutKey, toggleKey) => ({
  type: TOGGLE_LAYOUT,
  payload: { layoutKey, toggleKey },
});

export const togglePanel = (layoutKey, panelKey) => ({
  type: TOGGLE_PANEL,
  payload: { layoutKey, panelKey },
});
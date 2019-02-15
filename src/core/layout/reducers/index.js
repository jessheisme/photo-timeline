
import {
  UPDATE_LAYOUT,
  TOGGLE_LAYOUT,
  TOGGLE_PANEL,
} from '../constants/action-types';

const updateLayout = (state, layout) => {
    return {
      ...state,
      layout: {
        ...state.layout,
        ...layout,
      }
    };
};

const toggleLayout = (state, layoutKey, toggleKey) => {
  return {
    ...state,
    layout: {
      ...state.layout,
      ...state.layouts[toggleKey]
    },
  }
}


const togglePanel = (state, panelKey) => {
  return {
    ...state,
    layout: {
      ...Object.keys(state.layout).reduce((acc, key) => ({
        ...acc,
        [key]: {
          ...state.layout[key],
          ...(key === panelKey
            ? { size: (state.layout[key].size === 0
                ? state.layout[key].defaultSize
                : 0
              )}
            : {}
          ),
        },
      }), {}),
    }
  }
}

const generateLayoutReducer = (initialState) => (
  (state = initialState, action) => {
    switch (action.type) {
      case UPDATE_LAYOUT: {
        const { layoutKey, layout } = action.payload;
        if (state.LAYOUT_KEY === layoutKey) {
          return updateLayout(state, layout)
        }
        return state;
      }
      case TOGGLE_LAYOUT: {
        const { layoutKey, toggleKey} = action.payload;
        if (state.LAYOUT_KEY === layoutKey) {
          return toggleLayout(state, layoutKey, toggleKey)
        }
      }
      case TOGGLE_PANEL: {
        const { layoutKey, panelKey } = action.payload;
        if (state.LAYOUT_KEY === layoutKey) {
          return togglePanel(state, panelKey)
        }
        return state;
      }
      default:
        return state;
    }
  }
)

export default generateLayoutReducer;
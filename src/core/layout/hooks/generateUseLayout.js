import { useReducer, useMemo } from 'react';
import generateLayoutReducer from '../reducers';
import { getCalculatedLayout } from '../selectors';
import { togglePanel, updateLayout } from '../actions';

const generateUseLayout = (layoutConfig) => {
  const layoutReducer = generateLayoutReducer(layoutConfig);
  const useLayout = (props) => {
    const [state, dispatch] = useReducer(layoutReducer, layoutConfig);
    const layout = useMemo(() => getCalculatedLayout(state, props));
    return {
      layout,
      isPanelOpen: (panelKey) => {
        return !layout[panelKey].isHidden && layout[panelKey].size !== 0
      },
      updateLayout: (layout) => {
        dispatch(updateLayout(state.LAYOUT_KEY, layout))
      },
      togglePanel: (panelKey) => {
        dispatch(togglePanel(state.LAYOUT_KEY, panelKey))
      },
    };
  }
  return useLayout
}

export default generateUseLayout;

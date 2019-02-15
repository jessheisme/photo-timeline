import createCachedSelector from 're-reselect';
import {
  layoutType,
  panelType,
} from '../constants';

const defaults = {
  padding: 0,
  gridColumns: 3,
  gridPadding: 8,
  gridCellRatio: 16 / 9,
  offset: { x: 0, y: 0},
}

const getChildrenKeys = (layout) => {
  return layout && layout.children ? layout.children : [];
};

const isGrowType = (layout) => {
  return layout && layout.panelType === panelType.GROW;
}

const isSizeType = (layout) => {
  return layout && layout.panelType === panelType.SIZE;
}

const getSize = (layout) => {
  return (layout && isSizeType(layout) && layout.size) || 0;
}

const calculatePanel = (key, layoutMap, rect, finalLayout) => {
  const layout = layoutMap[key];
  const offset = { ...defaults.offset, ...(layout.offset || {}) };
  return {
    ...finalLayout,
    [layout.key]: {
      ...layout,
      ...rect,
      x: rect.x + offset.x,
      y: rect.y + offset.y,
      isHidden: rect.width === 0 || rect.height === 0,
    }
  };
}

const getGrowSize = (layout, childrenKeys, layoutMap, size) => {
  const padding = layout.padding || defaults.padding;
  const growKeys = childrenKeys.filter(k => isGrowType(layoutMap[k]));
  const totalSize = childrenKeys.reduce((acc, k) => acc + getSize(layoutMap[k]), 0);
  const remainingSize = size - totalSize - (padding * (childrenKeys.length + 1));
  const growSize = remainingSize / Math.max(1, growKeys.length);
  return growSize;
}

const calculateContainer = (key, layoutMap, rect, finalLayout) => {
  const {
    x,
    y,
    width,
    height,
  } = rect;
  const layout = layoutMap[key];
  const childrenKeys = getChildrenKeys(layout);
  return {
    ...finalLayout,
    [layout.key]: {
      ...layout,
      ...rect,
    },
    ...childrenKeys.reduce((acc, k) => {
      const childLayout = layoutMap[k];
      return {
        layout: calculateLayout(
          childLayout.key,
          layoutMap,
          {
            x,
            y,
            width,
            height,
          },
          acc.layout,
        ),
      }
    }, { layout: {} }).layout
  }
}

const calculateRow = (key, layoutMap, rect, finalLayout) => {
  const {
    x,
    y,
    width,
    height,
  } = rect;
  const layout = layoutMap[key];
  const padding = layout.padding || defaults.padding;
  const childrenKeys = getChildrenKeys(layout);
  const growSize = getGrowSize(layout, childrenKeys, layoutMap, width);
  const newHeight = height - (padding * 2);
  return {
    ...finalLayout,
    [layout.key]: {
      ...layout,
      ...rect,
    },
    ...childrenKeys.reduce((acc, k) => {
      const childLayout = layoutMap[k];
      const size = isGrowType(childLayout) ? growSize : getSize(childLayout);
      return {
        layout: calculateLayout(
          childLayout.key,
          layoutMap,
          {
            x: Math.max(acc.x, 0),
            y: y + padding,
            width: Math.min(size, width),
            height: newHeight,
          },
          acc.layout,
        ),
        x: acc.x + size + padding,
      }
    }, { layout: {}, x: x + padding }).layout
  };
};


const calculateColumn = (key, layoutMap, rect, finalLayout) => {
  const {
    x,
    y,
    width,
    height,
  } = rect;
  const layout = layoutMap[key];
  const padding = layout.padding || defaults.padding;
  const childrenKeys = getChildrenKeys(layout);
  const growSize = getGrowSize(layout, childrenKeys, layoutMap, height);
  return {
    ...finalLayout,
    [layout.key]: {
      ...layout,
      ...rect,
    },
    ...childrenKeys.reduce((acc, k) => {
      const childLayout = layoutMap[k];
      const size = isGrowType(childLayout) ? growSize : getSize(childLayout);
      const newWidth = width - (padding * 2);
      return {
        layout: calculateLayout(
          childLayout.key,
          layoutMap,
          {
            x: x + padding,
            y: acc.y,
            width: newWidth,
            height: size,
          },
          acc.layout,
        ),
        y: acc.y + size + padding,
      }
    }, { layout: {}, y: y + padding }).layout
  };
};

const calculateGrid = (key, layoutMap, rect, finalLayout) => {
  const {
    x,
    y,
    width,
  } = rect;
  const layout = layoutMap[key];
  const childrenKeys = getChildrenKeys(layout);
  const columns = layout.gridColumns || defaults.gridColumns;
  const padding = layout.gridPadding || defaults.gridPadding;
  const ratio = layout.gridCellRatio || defaults.gridCellRatio;
  const paddingSpace = (columns + 1) * padding;
  const cellWidth = (width - paddingSpace) / columns;
  const cellHeight = cellWidth / ratio;
  return {
    ...finalLayout,
    [layout.key]: {
      ...layout,
      ...rect,
    },
    ...childrenKeys.reduce((acc, k, i) => {
      const childLayout = layoutMap[k];
      const isLastCell = (i + 1) % columns === 0;
      return {
        layout: calculateLayout(
          childLayout.key,
          layoutMap,
          {
            x: acc.x,
            y: acc.y,
            width: cellWidth,
            height: cellHeight,
          },
          acc.layout,
        ),
        x: isLastCell ? padding : (acc.x + cellWidth + padding),
        y: isLastCell ? (acc.y + padding + cellHeight) : acc.y,
      }
    }, { layout: {}, x: x + padding, y: y + padding }).layout
  };
};

const calculateModal = (key, layoutMap, rect, finalLayout) => {
  const {
    x,
    y,
    width,
    height,
  } = rect;
  const layout = layoutMap[key];
  const childrenKeys = getChildrenKeys(layout);
  const modalWidth = layout.modalWidth || width;
  const modalHeight = layout.modalHeight || height;
  const modalX = x + ((width - modalWidth) / 2);
  const modalY = y + ((height - modalHeight) / 2);
  return {
    ...finalLayout,
    [layout.key]: {
      ...layout,
      ...rect,
    },
    ...childrenKeys.reduce((acc, k) => {
      const childLayout = layoutMap[k];
      return {
        layout: calculateLayout(
          childLayout.key,
          layoutMap,
          {
            x: modalX,
            y: modalY,
            width: modalWidth,
            height: modalHeight,
          },
          acc.layout,
        ),
      }
    }, { layout: {} }).layout
  }
}

const calculateFreeForm = (key, layoutMap, rect, finalLayout) => {
  const {
    x,
    y,
    width,
    height,
  } = rect;
  const layout = layoutMap[key];
  const childrenKeys = getChildrenKeys(layout);
  return {
    ...finalLayout,
    [layout.key]: {
      ...layout,
      ...rect,
    },
    ...childrenKeys.reduce((acc, k) => {
      const childLayout = layoutMap[k];
      return {
        layout: calculateLayout(
          childLayout.key,
          layoutMap,
          {
            x: childLayout.x || 0,
            y: childLayout.y || 0,
            width: childLayout.width || 0,
            height: childLayout.height || 0,
          },
          acc.layout,
        ),
      }
    }, { layout: {} }).layout
  }
}

const calculateDummy = (key, layoutMap, rect, finalLayout) => {
  const {
    x,
    y,
    width,
    height,
  } = rect;
  const layout = layoutMap[key];
  const childrenKeys = getChildrenKeys(layout);
  return {
    ...finalLayout,
    [layout.key]: {
      ...layout,
      ...rect,
    },
    ...childrenKeys.reduce((acc, k) => {
      const childLayout = layoutMap[k];
      return {
        layout: calculateLayout(
          childLayout.key,
          layoutMap,
          {
            x: childLayout.x || 0,
            y: childLayout.y || 0,
            width: childLayout.width || 0,
            height: childLayout.height || 0,
          },
          acc.layout,
        ),
      }
    }, { layout: {} }).layout
  }
}

const calculateLayout = (key, layoutMap, rect, finalLayout ) => {
  const layout = layoutMap[key];
  switch (layout.layoutType) {
    case layoutType.CONTAINER:
      return calculateContainer(key, layoutMap, rect, finalLayout);
    case layoutType.ROW:
      return calculateRow(key, layoutMap, rect, finalLayout);
    case layoutType.COLUMN:
      return calculateColumn(key, layoutMap, rect, finalLayout);
    case layoutType.GRID:
      return calculateGrid(key, layoutMap, rect, finalLayout);
    case layoutType.MODAL:
      return calculateModal(key, layoutMap, rect, finalLayout);
    case layoutType.FREEFORM:
      return calculateFreeForm(key, layoutMap, rect, finalLayout);
    case layoutType.DUMMY_CELL:
      return calculateDummy(key, layoutMap, rect, finalLayout);
    default:
      return calculatePanel(key, layoutMap, rect, finalLayout);
  }
}

export const getLayout = (state, props) => state[props.layoutKey];

export const getLayoutState = (state) => state;

export const getParentSize = (state, props = {}) => props.parentSize || {};

export const getPanelKey = (state, props = {}) => props.panelKey;

export const getCalculatedLayout = createCachedSelector(
  [getLayoutState, getParentSize],
  (layoutState, parentSize) => {
    return calculateLayout(
      layoutState.initialKey,
      layoutState.layout,
      {
        x: 0,
        y: 0,
        width: parentSize.width || layoutState.width,
        height: parentSize.height || layoutState.height,
      },
      {},
    )
  }
)((state) => state.LAYOUT_KEY)

export const getIsPanelOpen = createCachedSelector(
  [getCalculatedLayout],
  layout => !layout.isHidden
)((state, props) => props.panelKey)

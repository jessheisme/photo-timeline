# Layout

## Introduction
Layout is a smart layout engine that does exactly what you want to do.

## Getting Started

#### Install Layout
```javascript
// [TODO] JT
```

#### Create Layout Config
```javascript
// layoutConfig.js
import { layoutType, panelType } from 'layout/constants';

export const LAYOUT_KEY = 'app-layout';

export const APP_WIDTH = 1000;
export const APP_HEIGHT = 700;

export const panels = {
  APP: 'app',
  SIDE_BAR: 'side-bar'
  MAIN_VIEW: 'main-view'
};

export const initialLayout = {
  [panels.APP]: {
    key: panels.APP,
    layoutType: layoutType.ROW,
    children: [panels.SIDE_BAR, panels.MAIN_CONTENT],
  },
  [panels.SIDE_BAR]: {
    key: panels.SIDE_BAR,
    panelType: panelType.SIZE,
    defaultSize: 240,
    size: 240,
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
```

#### Add Layout to Reducer
```javascript
// reducers/index.js
import { combineReducers } from 'redux';
import generateLayoutReducer from 'layout/reducers';
import layoutConfig from './path/to/layoutConfig';

const appLayoutReducer = generateLayoutReducer(layoutConfig);

const rootReducer = (state = {}, action) => {
  return state;
};

export default combineReducers({
  root: rootReducer,
  [layoutConfig.LAYOUT_KEY]: appLayoutReducer,
});
```

#### Connect View Components
```javascript
// SideBar.js
import React from 'react';
import WithLayout from 'layout/hocs/WithLayout';

class SideBar extends React.Component {
    // SideBar Implementation
}
export default WithLayout(SideBar);
```
```javascript
// MainContent.js
import React from 'react';
import WithLayout from 'layout/hocs/WithLayout';

class MainContent extends React.Component {
    // SideBar Implementation
}
export default WithLayout(MainContent);
```

#### Render Components
```javascript
// App.js
import React from 'react';
import { LAYOUT_KEY, panels } from './path/to/layoutConfig';
import SideBar from './path/to/SideBar';
import MainContent from './path/to/MainContent';

class App extends React.Component {
    render() {
        <div>
            <SideBar
                layoutKey={LAYOUT_KEY}
                panelKey={panels.SIDE_BAR}
            />
            <MainContent
                layoutKey={LAYOUT_KEY}
                panelKey={panels.MAIN_CONTENT}
            />
        </div>
    }
}

```
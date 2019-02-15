import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { alignCenter, absoluteFill } from './mixins';
import generateUseLayout from './core/layout/hooks/generateUseLayout';
import layoutConfig, { panels } from './config/layoutConfig';
import useWindowSize from './hooks/useWindowSize';
import SideBar from './panels/SideBar';
import MainContent from './panels/MainContent';


const AppContainer = styled.div`
  ${absoluteFill()}
`

const useLayout = generateUseLayout(layoutConfig);

const App = () => {
  const windowSize = useWindowSize();
  const { layout, isPanelOpen, togglePanel } = useLayout({ parentSize: windowSize });
  return (
      <AppContainer>
        <SideBar
          layout={layout[panels.SIDE_BAR]}
          disableTransitions={windowSize.isResizing}
        />
        <MainContent
          layout={layout[panels.MAIN_CONTENT]}
          disableTransitions={windowSize.isResizing}
        />
      </AppContainer>
  );
}

export default App;
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { absoluteFill } from './mixins';
import generateUseLayout from './core/layout/hooks/generateUseLayout';
import useProject from './core/frameio/hooks/useProject';
import useFolderChildren from './core/frameio/hooks/useFolderChildren';
import layoutConfig, { panels } from './config/layoutConfig';
import useWindowSize from './hooks/useWindowSize';
import Splash from './components/Splash';
import SideBar from './panels/SideBar';
import Collection from './panels/Collection';
import { size } from './theme';

const PROJECT_ID = '05288114-98ab-4ba7-a124-22e4fbb72811';

const SIDE_BAR_WIDTH = 260;

const AppContainer = styled.div`
  ${absoluteFill()}
  overflow: hidden;
`

const SideBarContainer = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  width: ${SIDE_BAR_WIDTH}px;
`

const CollectionContainer = styled.div`
  position: absolute;
  left: ${SIDE_BAR_WIDTH}px;
  top: 0px;
  bottom: 0px;
  right: 0px;
`

const useLayout = generateUseLayout(layoutConfig);

const App = () => {

  const windowSize = useWindowSize();
  const app = useLayout({ parentSize: windowSize });

  const project = useProject(PROJECT_ID);

  const collections = useFolderChildren(project.current && project.current.root_asset_id);

  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  const collectionLength = collections.current.length;

  // Select First Collection
  useEffect(() => {
    if (!selectedCollectionId && collectionLength > 0) {
      setSelectedCollectionId(collections.current[0].id);
    }
  }, [collectionLength])
  
  const collection = useMemo(() => {
    return collections.current.filter(collection => collection.id === selectedCollectionId)[0];
  }, [selectedCollectionId]);

  return (
      <AppContainer>
        <SideBarContainer>
          <SideBar
            isLoaded={!!selectedCollectionId}
            selectedCollectionId={selectedCollectionId}
            collections={collections.current}
            selectCollection={setSelectedCollectionId}
          />
        </SideBarContainer>
        <CollectionContainer>
          <Collection
            width={windowSize.width - SIDE_BAR_WIDTH}
            windowSize={windowSize}
            collection={collection}
          />
        </CollectionContainer>
        <Splash
          isLoaded={!!selectedCollectionId}
        />
      </AppContainer>
  );
}

export default App;
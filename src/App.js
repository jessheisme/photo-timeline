import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import config from './core/frameio/config';
import useProject from './core/frameio/hooks/useProject';
import useFolderChildren from './core/frameio/hooks/useFolderChildren';
import useWindowSize from './hooks/useWindowSize';
import Splash from './components/Splash';
import Icon from './components/Icon';
import SideBar from './panels/SideBar';
import Collection from './panels/Collection';
import { absoluteFill, alignCenter } from './mixins';
import { size, color, transition } from './theme';

const SIDE_BAR_WIDTH = 260;

const MINI_SIDE_BAR_WIDTH = size.XLARGE;

const SMALL_SCREEN_WIDTH = 500;

const AppContainer = styled.div`
  ${absoluteFill()}
  overflow: hidden;
`

const MiniSideBar = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  width: 0px;
  overflow: hidden;
  cursor: pointer;
  background-color: ${color.white};
  transition: all ${transition};
  color: ${color.gray300};
  &:hover {
    color: ${color.black};
  }
  @media only screen and (max-width: ${SMALL_SCREEN_WIDTH}px) {
    width: ${MINI_SIDE_BAR_WIDTH}px;
  }
`

const MenuIconContainer = styled.div`
  position: relative;
  width: ${size.XLARGE}px;
  height: ${size.XLARGE}px;
  ${alignCenter()}
  cursor: pointer;
`

const SideBarContainer = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  @media only screen and (min-width: ${SMALL_SCREEN_WIDTH + 1}px) {
    left: 0px;
    width: ${SIDE_BAR_WIDTH}px;
  }
  @media only screen and (max-width: ${SMALL_SCREEN_WIDTH}px) {
    left: ${MINI_SIDE_BAR_WIDTH}px;
    right: 0px;
    z-index: 10;
    ${p => !p.isOpen && `
      opacity: 0;
      pointer-events: none;
    `}
  }
`

const CollectionContainer = styled.div`
  position: absolute;
  left: ${SIDE_BAR_WIDTH}px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  @media only screen and (max-width: ${SMALL_SCREEN_WIDTH}px) {
    left: ${MINI_SIDE_BAR_WIDTH}px;
  }
`

const App = () => {

  const windowSize = useWindowSize();

  const project = useProject(config.projectId);

  const collections = useFolderChildren(project.current && project.current.root_asset_id);

  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  const collectionLength = collections.current.length;

  const [sideBarOpen, setSideBarOpen] = useState(false);

  console.log(project)

  // Select First Collection
  useEffect(() => {
    if (!selectedCollectionId && collectionLength > 0) {
      setSelectedCollectionId(collections.current[0].id);
    }
  }, [collectionLength])
  
  const collection = useMemo(() => {
    return collections.current.filter(collection => collection.id === selectedCollectionId)[0];
  }, [selectedCollectionId]);

  const menuIcon = sideBarOpen ? 'x' : 'menu';

  const selectCollection = (collectionId) => {
    setSelectedCollectionId(collectionId)
    setTimeout(() => {
      setSideBarOpen(false);
    }, 0);
  }

  return (
      <AppContainer>
        <MiniSideBar
          onClick={() => {
            setSideBarOpen(!sideBarOpen);
          }}
        >
          <MenuIconContainer>
            <Icon icon={menuIcon} size={size.LARGE} />
          </MenuIconContainer>
        </MiniSideBar>
        <SideBarContainer
          isOpen={sideBarOpen}
        >
          <SideBar
            isLoaded={!!selectedCollectionId}
            selectedCollectionId={selectedCollectionId}
            collections={collections.current}
            selectCollection={selectCollection}
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
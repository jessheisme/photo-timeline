import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import useFolderChildren from '../../core/frameio/hooks/useFolderChildren';
import useModal from '../../hooks/useModal';
import usePersistance from '../../hooks/usePersistance';
import useMeasure from '../../hooks/useMeasure';
import Grid from '../../components/Grid';
import Modal from '../../components/Modal';
import AssetViewer from '../../components/AssetViewer';
import { absoluteFill, alignCenter } from '../../mixins';
import { size, color, transition } from '../../theme';

const Container = styled.div`
  ${absoluteFill()}
  background-color: ${color.white};
`

const ItemContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: inset 0px 0px 0px 2px ${color.white};
`

const LightBoxContainer = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: ${rgba(color.white, 0.6)};
`

const XContainer = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  width: ${size.XLARGE}px;
  height: ${size.XLARGE}px;
  ${alignCenter()};
  cursor: pointer;
`

const Collection = (props) => {
  const {
    windowSize,
    collection,
  } = props;

  const [containerRef, containerRect] = useMeasure();

  const collectionAssets = useFolderChildren(collection && collection.id);

  const [selectedItemId, setSelectedItemId] = useState(null);

  const onItemSelect = (itemId) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null)
    } else {
      setSelectedItemId(itemId)
    }
  }

  return (
    <Container ref={containerRef}>
      <Grid
        id={collection && collection.id}
        windowSize={windowSize}
        width={containerRect.width}
        columns={2}
        items={collectionAssets.current}
        selectedItemId={selectedItemId}
        onItemSelect={onItemSelect}
      >
        { (item, dims) => (
          <ItemContainer
            style={{
              backgroundImage: `url(${item.image_full}), url(${item.image_small})`,
              // backgroundImage: `url(${item.image_small})`,
              backgroundSize: item.id === selectedItemId ? 'contain' : 'cover',
              ...(item.id === selectedItemId && { boxShadow: 'none' }),
            }}
          />
        )}
      </Grid>
    </Container>
  )
}

export default Collection;
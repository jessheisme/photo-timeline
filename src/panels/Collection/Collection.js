import React, { useState } from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import useFolderChildren from '../../core/frameio/hooks/useFolderChildren';
import useMeasure from '../../hooks/useMeasure';
import Grid from '../../components/Grid';
import { absoluteFill, alignCenter } from '../../mixins';
import { size, color } from '../../theme';

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
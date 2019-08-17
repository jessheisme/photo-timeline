import React from 'react';
import styled from 'styled-components';
import { color } from '../../theme';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`

const AssetViewer = (props) => {

  const {
    asset,
  } = props;

  const imageSrc = asset && asset.image_full;
  

  if (!asset) return null;

  return (
    <Container
      style={{
        backgroundImage: `url(${asset.image_full})`
      }}
    />
  )
}

export default AssetViewer;
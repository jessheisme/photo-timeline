import React from 'react';
import styled from 'styled-components';
import { absoluteFill } from '../../mixins';
import { color } from '../../theme';
import { lighten, darken } from 'polished';

const SIDE_PANEL_WIDTH = 240;

const Container = styled.div`
  ${absoluteFill()}
  background-color: ${color.primaryBackground};
`

const SidePanel = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  width: ${SIDE_PANEL_WIDTH}px;
  background-color: ${darken(0.04, color.primaryBackground)};
`
const MainContent = styled.div`
  position: absolute;
  left: ${SIDE_PANEL_WIDTH}px;
  top: 0px;
  right: 0px;
  bottom: 0px;
`


const Components = () => {
  return (
    <Container>
      <SidePanel />
      <MainContent />
    </Container>
  )
}

export default Components;
import React from 'react';
import styled from 'styled-components';
import WithLayout from '../../core/layout/hocs/WithLayout';
import { absoluteFill } from '../../mixins';
import { color } from '../../theme';

const Container = styled.div`
  ${absoluteFill()}
  background-color: ${color.primaryBackground};
`

const MainContent = () => {
  return (
    <Container />
  )
}

export default WithLayout(MainContent);
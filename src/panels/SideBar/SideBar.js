import React from 'react';
import styled from 'styled-components';
import WithLayout from '../../core/layout/hocs/WithLayout';
import { absoluteFill } from '../../mixins';
import { color } from '../../theme';
import { darken } from 'polished';

const Container = styled.div`
  ${absoluteFill()}
  background-color: ${darken(0.04, color.primaryBackground)};
`

const SideBar = () => {
  return (
    <Container />
  )
}

export default WithLayout(SideBar);
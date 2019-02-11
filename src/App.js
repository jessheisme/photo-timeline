import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { alignCenter } from './mixins';
import Components from './panels/Components';

const APP_WIDTH = 800;
const APP_HEIGHT = 600;

const Wrapper = styled.div`
  ${alignCenter()}
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => darken(0.1, theme.color.primaryBackground) };
`;

const AppContainer = styled.div`
  ${alignCenter()}
  position: relative;
  width: ${APP_WIDTH}px;
  height: ${APP_HEIGHT}px;
  background-color: ${({ theme }) => theme.color.primaryBackground };
  border-radius: 6px;
`

class App extends React.Component {
  render() {
    return (
      <Wrapper>
        <AppContainer>
          <Components />
        </AppContainer>
      </Wrapper>
    );
  }
}

export default App;
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { FrameioProvider } from './core/frameio/context';
import { render } from 'react-dom';
import App from './App';
import * as theme from './theme';

const wrapper = document.getElementById('root');
wrapper ? render(
  <ThemeProvider theme={theme}>
    <FrameioProvider>
      <App />
    </FrameioProvider>
  </ThemeProvider>,
  wrapper
) : false;
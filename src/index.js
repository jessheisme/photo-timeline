import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { render } from 'react-dom';
import App from './App';
import * as theme from './theme';
import store from './core/store';

const wrapper = document.getElementById('root');
wrapper ? render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  wrapper
) : false;
import React, { useReducer } from 'react';
import uuidv4 from 'uuid/v4';
import config from '../config';

const connectionId = uuidv4();

const FrameioContext = React.createContext();

const requestHeaders = {
  Authorization: config.authToken,
  accept: 'application/json',
};

const fetchParams = {
  headers: requestHeaders,
}


export const FrameioProvider = (props) => {
  const value = { baseURL: config.baseURL, fetchParams, token: config.authToken, connectionId };
  return (
    <FrameioContext.Provider value={value}>{props.children}</FrameioContext.Provider>
  )
}

export default FrameioContext;
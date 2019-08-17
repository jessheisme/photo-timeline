import React, { useState, useReducer, useCallback } from 'react';
import uuidv4 from 'uuid/v4';
import { Socket } from 'phoenix';
import rootReducer, { initialState } from '../reducers';
import config from '../config';

const connectionId = uuidv4();

// const authToken = Cookie.get(config.authTokenKey);
const authToken = 'Bearer fio-u-ln4ogzvi1ZOCdic5UXCm4biCOghEUDOS_RlWqo3RPP93b_e8eMW86XIC_8vcGJlA';

const FrameioContext = React.createContext();

const requestHeaders = {
  Authorization: authToken,
  accept: 'application/json',
};

const fetchParams = {
  headers: requestHeaders,
}


export const FrameioProvider = (props) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const value = { state, dispatch, baseURL: config.baseURL, fetchParams, token: authToken, connectionId };
  return (
    <FrameioContext.Provider value={value}>{props.children}</FrameioContext.Provider>
  )
}

export default FrameioContext;
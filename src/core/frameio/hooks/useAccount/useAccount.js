
import { useState, useEffect, useContext } from 'react';
import { get } from 'lodash';
import axios from 'axios';
import FrameioContext from '../../context';

const useAccount = (accountId, entities = {}, overrides = {}) => {
  const { baseURL, fetchParams, socket, token } = useContext(FrameioContext)
  const [account, setAccount] = useState({});
  const [requesting, setRequesting] = useState(false);

  const isFeatureAvailable = (feature) => {
    const availableFeatures = get(account, 'plan.available_features', {});
    return !!availableFeatures[feature];
  } 

  useEffect(() => {
    if (!accountId || entities.account) return;
    setRequesting(true);
    axios.get(`${baseURL}/v2/accounts/${accountId}`, fetchParams)
      .then(response => {
        setAccount({ ...response.data, ...overrides });
        setRequesting(false);
      })
  }, [accountId])
  

  return {
    current: entities.account ? entities.account : account,
    isFeatureAvailable,
    requesting,
  }
}

export default useAccount;

import { useState, useEffect, useContext } from 'react';
import { get } from 'lodash';
import axios from 'axios';
import FrameioContext from '../../context';

const useAccounts = () => {
  const { baseURL, fetchParams, socket, token } = useContext(FrameioContext)
  const [accounts, setAccounts] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    setRequesting(true);
    axios.get(`${baseURL}/v2/accounts`, fetchParams)
      .then(response => {
        setAccounts([...response.data]);
        setRequesting(false);
        setRequested(true);
      })
  }, [])
  

  return {
    current: accounts,
    requesting,
    requested,
  }
}

export default useAccounts;
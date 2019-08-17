
import { useState, useEffect, useContext } from 'react';
import { get } from 'lodash';
import axios from 'axios';
import FrameioContext from '../../context';

const useAccountTeams = (accountId) => {
  const { baseURL, fetchParams, socket, token } = useContext(FrameioContext)
  const [teams, setTeams] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    setTeams([]);
    if (!accountId || accountId === 'null') return;
    setRequesting(true);
    setRequested(false);
    axios.get(`${baseURL}/v2/accounts/${accountId}/teams`, fetchParams)
      .then(response => {
        setTeams([...response.data]);
        setRequesting(false);
        setRequested(true);
      })
  }, [accountId])
  

  return {
    current: teams,
    requesting,
    requested,
  }
}

export default useAccountTeams;

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FrameioContext from '../../context';

const useTeam = (teamId, entities = {}, overrides = {}) => {
  const { baseURL, fetchParams, socket, token } = useContext(FrameioContext)
  const [team, setTeam] = useState({});
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!teamId || entities.team) return;
    setRequesting(true);
    axios.get(`${baseURL}/v2/teams/${teamId}`, fetchParams)
      .then(response => {
        setTeam({ ...response.data, ...overrides });
        setRequesting(false);
      })
  }, [teamId])

  return {
    current: entities.team ? entities.team : team,
    requesting,
  }
}

export default useTeam;
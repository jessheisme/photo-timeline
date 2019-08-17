
import { useState, useEffect, useContext } from 'react';
import FrameioContext from '../../context';

const useTeams = () => {
  const { baseURL, fetchParams } = useContext(FrameioContext)
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch(`${baseURL}/v2/teams`, fetchParams)
    .then(response => response.json())
    .then(teams => setTeams(teams))
  }, [])
  return {
    current: teams,
  };
}

export default useTeams;

import { useState, useEffect, useContext } from 'react';
import FrameioContext from '../../context';

const useProjects = (teamId) => {
  const { baseURL, fetchParams } = useContext(FrameioContext)
  const [projects, setProjects] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    setProjects([]);
    setRequested(false);
    if (!teamId) return;
    setRequesting(true);
    fetch(`${baseURL}/v2/teams/${teamId}/projects`, fetchParams)
    .then(response => response.json())
    .then(projects => {
      setProjects(projects)
      setRequesting(false);
      setRequested(true);
    })
  }, [teamId])
  
  return {
    current: projects,
    requesting,
    requested,
  }
}

export default useProjects;
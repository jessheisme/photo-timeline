
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FrameioContext from '../../context';

const useProject = (projectId, entities = {}, overrides = {}) => {
  const { baseURL, fetchParams, socket, token } = useContext(FrameioContext)
  const [project, setProject] = useState({});
  const [requested, setRequested] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!projectId || projectId === "null") return;
    setRequesting(true);
    axios.get(`${baseURL}/v2/projects/${projectId}`, fetchParams)
      .then(response => {
        setProject({ ...response.data, ...overrides });
        setRequesting(false);
        setRequested(true);
      })
  }, [projectId])

  return {
    current: entities.project ? entities.project : project,
    requesting,
    requested,
  }
}

export default useProject;
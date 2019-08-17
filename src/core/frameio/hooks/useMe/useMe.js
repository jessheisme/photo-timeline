
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FrameioContext from '../../context';

const useMe = () => {
  const { baseURL, fetchParams } = useContext(FrameioContext)
  const [user, setUser] = useState({});  
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    setRequesting(true);
    axios.get(`${baseURL}/v2/me`, fetchParams)
      .then(response => {
        setUser(response.data)
        setRequesting(false);
        setRequested(true);
      })
      .catch(err => {
        setRequesting(false);
        setRequested(true);
      })
  }, [])

  return {
    current: user,
    requesting,
    requested,
  }
}

export default useMe;
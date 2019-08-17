
import { useState, useEffect, useContext } from 'react';
import FrameioContext from '../../context';

const modF = asset => asset

const useFolderChildren = (folderId, modifier = modF) => {
  const { baseURL, fetchParams } = useContext(FrameioContext)
  const [children, setChildren] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!folderId) return;
    setRequesting(true);
    setChildren([]);
    fetch(`${baseURL}/v2/assets/${folderId}/children`, fetchParams)
    .then(response => response.json())
    .then(children => {
      setRequested(true);
      setRequesting(false);
      setChildren(children)
    })
  }, [folderId])
  return {
    current: children.errors ? [] : children,
    requesting,
    requested,
  };
}

export default useFolderChildren;

import { useState, useEffect, useContext } from 'react';
import FrameioContext from '../../context';

const useTranscriptLock = (assetId) => {
  const { baseURL, fetchParams } = useContext(FrameioContext)
  const [requestLockTick, setRequestLockTick] = useState(null);
  const [releaseLockTick, setReleaseLockTick] = useState(null);
  const [uploadTick, setUploadTick] = useState(null);
  const [uploadURL, setUploadURL] = useState();

  const request = () => setRequestLockTick(performance.now())
  useEffect(() => {
    if (assetId && requestLockTick) {
      fetch(`${baseURL}/v2/assets/${assetId}/transcript/upload`, { ...fetchParams, method: "PUT" })
        .then(response => response.json())
        .then(asset => setUploadURL(asset.transcript_upload))
    }
  }, [requestLockTick]);

  const release = () => setReleaseLockTick(performance.now())
  useEffect(() => {
    if (assetId && releaseLockTick) {
      fetch(`${baseURL}/v2/assets/${assetId}/transcript/uploaded`, { ...fetchParams, method: "PUT" })
        .then(response => response.json())
        .then(asset => setUploadURL(asset.transcript_upload))
    }
  }, [releaseLockTick]);

  const upload = () => setUploadTick(performance.now())
  useEffect(() => {
    if (assetId && releaseLockTick) {
      fetch(`${baseURL}/v2/assets/${assetId}/transcript/uploaded`, { ...fetchParams, method: "PUT" })
        .then(response => response.json())
        .then(asset => setUploadURL(asset.transcript_upload))
    }
  }, [uploadTick]);
  
  return {
    request,
    release,
    uploadURL,
    upload,
  };
}

export default useTranscriptLock;
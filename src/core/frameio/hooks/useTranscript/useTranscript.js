

import { useState, useEffect, useContext } from 'react';
import { get } from 'lodash';
import axios from 'axios';
import FrameioContext from '../../context';
import useMetadata, { METADATA } from '../useMetadata';
import useJSON from '../../../../hooks/useJSON';
import _useTranscript from '../../../../hooks/useTranscript';
import useTick from '../../../../hooks/useTick';
import { TRACK_TYPE } from '../../../timeline/constants/types';


const useTranscript = (asset) => {
  const { baseURL, fetchParams, socket, token } = useContext(FrameioContext);

  const [transcript, setTranscript] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [loaded, setLoaded] = useState(0);

  const transcriptUrl = asset.current && `${baseURL}/v2/assets/${asset.current.id}/transcript`;

  // const [isTimelineLoaded, timeline] = useJSON(transcriptUrl, transcriptUrl)

  const tick = useTick({ min: 0, max: 100, interval: 4000 });

  useEffect(() => {
    if (!asset.current || !asset.current.id) return;
    axios.get(transcriptUrl, fetchParams).then(response => setTranscript(response.data))
  }, [asset.current && asset.current.id]);

  const requestTranscript = (data) => {
    axios.post(transcriptUrl, data, fetchParams).then(response => response)
    setRequesting(true);
    tick.start();
  }

  return {
    current: transcript,
    request: requestTranscript,
    requesting,
    loaded: !!transcript,
    amountTranscribed: tick.current,
  };
}

export default useTranscript;
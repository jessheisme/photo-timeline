
import { useContext } from 'react';
import axios from 'axios';
import FrameioContext from '../../context';

const useTranslate = (asset) => {

  const { baseURL, fetchParams, socket, token } = useContext(FrameioContext)

  const get = (language = 'en') => {
    if (!asset) return;
    const translateURL = `${baseURL}/v2/assets/${asset.id}/translation`;
    const params = { language };
    axios.post(translateURL, params, fetchParams)
      .then(response => response);
  }
  return {
    get,
  };
}

export default useTranslate;
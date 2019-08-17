
import { useContext } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';
import FrameioContext from '../../context';

const useSubtitleExport = (asset) => {

  const { baseURL, fetchParams, socket, token } = useContext(FrameioContext)

  const get = (exportType, language='en') => {
    if (!asset) return;
    const type = exportType.toLowerCase();
    const transcriptBase = `${baseURL}/v2/assets/${asset.id}/transcript/export`;
    axios.get(`${transcriptBase}?language=${language}&export_type=${type}`, fetchParams)
      .then(response => {
        const blob = new Blob([response.data], {type: "text/plain;charset=utf-8"});
        console.log('heard!')
        FileSaver.saveAs(blob, `${asset.name}.${type}`);
      })
  }
  return {
    get,
  };
}

export default useSubtitleExport;
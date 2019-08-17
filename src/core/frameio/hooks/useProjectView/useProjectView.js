
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FrameioContext from '../../context';
import useFolderChildren from '../useFolderChildren';
import useProject from '../useProject';
import useEventBus from '../../../../hooks/useEventBus';


export const ACTION = {
  UPDATE: 'project-view-update',
};

const useProjectView = (viewId) => {
  const { baseURL, fetchParams, socket, token } = useContext(FrameioContext)
  const [projectView, setProjectView] = useState({});
  const [requested, setRequested] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const project = useProject(projectView && projectView.projectId)

  const assets = useFolderChildren(project.current && project.current.root_asset_id);

  const eventBus = useEventBus((msg) => {
    const {
      type,
      data,
    } = msg.data;
    switch (type) {
      case ACTION.UPDATE: {
        setProjectView(lastProjectView => ({
          ...lastProjectView,
          ...data,
        }))
        return;
      }
    }
  })

  useEffect(() => {
    setRequesting(true);
    setRequested(false);
    if (!viewId) return;
    setTimeout(() => {
      const projectViews = JSON.parse(localStorage.getItem('projectViews'));
      const item = Object.values(projectViews).reduce((acc, views) => {
        if (acc) return acc;
        return views.filter(view => view.id === viewId)[0];
      }, null)
      setProjectView(item || {});
      setRequested(true);
      setRequesting(false);
    }, 0)
  }, [viewId])
  
  const updateView = (viewData) => {
    setProjectView(lastProjectView => ({
      ...lastProjectView,
      ...viewData,
    }))
    eventBus.post(ACTION.UPDATE, viewData);
  }


  return {
    current: projectView,
    update: updateView,
    assets: assets.current,
    requesting: requesting && assets.requesting,
    requested: requested && assets.requested,
  }
}

export default useProjectView;
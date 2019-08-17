
import { useState, useEffect, useContext } from 'react';
import { uniqueId } from 'lodash';
import axios from 'axios';
import FrameioContext from '../../context';
import { VIEW, CARD } from '../../constants';

const testProjectId = "8c0a1763-a536-4c61-ba11-20e82adbf277";

const testMessage = "Hey guys, just add the files from todays shoot to this link. You should recieve an email confirmation when successful \n \n- John";

const useProjectViews = (projectId) => {
  const { baseURL, fetchParams, socket, token } = useContext(FrameioContext)
  const [projectViews, setProjectViews] = useState([]);
  const [requested, setRequested] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    setRequesting(true);
    setTimeout(() => {
      const newProjectViews = {
        [projectId]: [
          { id: getId(), name: "All Assets", type: VIEW.GRID, cardType: CARD.CLASSIC, projectId },
          ...(projectId === testProjectId) ? [
            // { id: getId(), name: "List", type: VIEW.LIST, projectId: testProjectId },
            // { id: getId(), name: "Cameras", type: VIEW.KANBAN, projectId: testProjectId },
            // { id: getId(), name: "Sales Reel", type: VIEW.REEL, projectId: testProjectId },
            // { id: getId(), name: "Personal Blog", type: VIEW.BLOG, projectId: testProjectId },
            // { id: getId(), name: "Dropzone", type: VIEW.DROP, projectId: testProjectId, message: testMessage },
          ] : []
        ],
      }
      setProjectViews(newProjectViews);
      localStorage.setItem('projectViews', JSON.stringify(newProjectViews));
      setRequesting(false);
      setRequested(true);
    }, 0)
  }, [projectId])

  const getId = () => {
    const id = uniqueId('view-')
    if (Object.values(projectViews)
      .map(views => views.some(v => v.id === id))
      .some(v => v)) return getId();
    return id;
  }

  const add = (projectView) => {
    const newProjectView = {
      id: getId(),
      projectId: projectId,
      cardType: CARD.CLASSIC,
      ...projectView,
    }
    const newProjectViews = {
      ...projectViews,
      [projectId]: [...projectViews[projectId], newProjectView],
    };
    setProjectViews(newProjectViews);
    localStorage.setItem('projectViews', JSON.stringify(newProjectViews));
    return newProjectView;
  }

  return {
    current: projectViews[projectId] || [],
    add,
    requesting,
    requested,
  }
}

export default useProjectViews;
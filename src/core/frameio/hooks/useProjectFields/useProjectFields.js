
import { useState, useEffect, useContext } from 'react';
import { uniqueId } from 'lodash';
import axios from 'axios';
import FrameioContext from '../../context';

const testProjectId = "8c0a1763-a536-4c61-ba11-20e82adbf277";

const useProjectFields = (projectId, shouldUpdate, mock = false) => {
  const { baseURL, fetchParams, socket, token } = useContext(FrameioContext)
  const [projectFields, setProjectFields] = useState([]);
  const [requested, setRequested] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    setRequesting(true);
    setTimeout(() => {
      if (mock) {
        const newProjectFields = {
          [projectId]: [
            ...(mock && projectId === testProjectId) ? [
              { id: 'field-1', name: "Reel", type: 'text', projectId: testProjectId },
              { id: 'field-2', name: "Camera", type: 'text', projectId: testProjectId },
            ] : []
          ],
        }
        setProjectFields(newProjectFields);
        localStorage.setItem('projectFields', JSON.stringify(newProjectFields));
      } else {
        const newProjectFields = JSON.parse(localStorage.getItem('projectFields'));
        setProjectFields(newProjectFields)
      }
      setRequesting(false);
      setRequested(true);
    }, 0)
  }, [projectId])

  useEffect(() => {
    if (shouldUpdate) {
      const newProjectFields = JSON.parse(localStorage.getItem('projectFields'));
      setProjectFields(newProjectFields)
    }
  }, [shouldUpdate])

  const getId = () => {
    const id = uniqueId('field-')
    if (Object.values(projectFields)
      .map(fields => fields.some(v => v.id === id))
      .some(v => v)) return getId();
    return id;
  }

  const add = (projectField) => {
    const newProjectField = {
      id: getId(),
      projectId: projectId,
      ...projectField,
    }
    const newProjectFields = {
      ...projectFields,
      [projectId]: [...projectFields[projectId], newProjectField],
    };
    setProjectFields(newProjectFields);
    localStorage.setItem('projectFields', JSON.stringify(newProjectFields));
    return newProjectField;
  }

  return {
    current: projectFields[projectId] || [],
    add,
    requesting,
    requested,
  }
}

export default useProjectFields;
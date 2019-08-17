import { useState, useEffect } from 'react';
import db from '../../../firebase/db';

const viewsRef = db.collection('views');

const useViews = (collectionId) => {

  const [views, setViews] = useState([]);
  const [requesting, setRequesting] = useState();
  const [requested, setRequested] = useState();

  useEffect(() => {
    setViews([]);
    if (!collectionId) return;
    setRequesting(true);
    viewsRef.where('collectionId', "==", collectionId)
    .get()
    .then(snap => {
      let tempViews = [];
      snap.forEach((doc) => {
        tempViews = [...tempViews, { id: doc.id, ...doc.data() }];
      });
      setViews(tempViews);
      setRequesting(false);
      setRequested(true);
    })
  }, [collectionId])

  const addView = (viewProps) => {
    viewsRef.add({
      collectionId,
      ...viewProps,
    })
  }

  return {
    current: views,
    add: addView,
    requested,
    requesting,
  }
}

export default useViews;
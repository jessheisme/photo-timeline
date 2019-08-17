import { useState, useEffect } from 'react';
import useFolderChildren from '../useFolderChildren';
import db from '../../../firebase/db';

const viewsRef = db.collection('views');

const useView = (viewId) => {

  const [view, setView] = useState({});
  const [requesting, setRequesting] = useState();
  const [requested, setRequested] = useState();

  const assets = useFolderChildren(view && view.collectionId);

  useEffect(() => {
    setView({});
    if (!viewId) return;
    setRequesting(true);
    setRequested(false);
    viewsRef.doc(viewId)
    .get()
    .then(snap => {
      setView({ ...snap.data() });
      setRequesting(false);
      setRequested(true)
    })
  }, [viewId])

  useEffect(() => {
    if (!viewId) return;
    const unsubscribe = viewsRef.doc(viewId).onSnapshot(snap => {
      setView({
        ...view,
        ...snap.data(),
      })
    })
    return () => unsubscribe();
  }, [viewId])

  const updateView = (viewProps) => {
    setView({
      ...view,
      ...viewProps,
    })
    viewsRef.doc(viewId).set({
      ...view,
      ...viewProps,
    })
  }

  return {
    current: { id: viewId, ...view },
    assets: assets.current,
    update: updateView,
    requested,
    requesting,
  }
}

export default useView;
import { useState, useEffect } from 'react';

const usePersistance = (item, duration = null) => {
  const [state, setState] = useState({ item, timeout: null})
  
  useEffect(() => {
    if (item && state.item !== item) {
      clearTimeout(state.timeout)
      setState({
        item,
        timeout: duration && setTimeout(() => {
          setState({
            item: null,
            timeout: null,
          })
        }, duration)
      }) 
    }
  }, [item]);

  return item ? item : state.item;
}

export default usePersistance;


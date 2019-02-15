import { useEffect, useState } from 'react';

const initialSize = {
  width: window.innerWidth,
  height: window.innerHeight,
}


const useWindowSize = () => {
  const [state, setState] = useState({
    ...initialSize,
    isResizing: false,
    timeout: false
  })
  const updateSize = () => {
    clearTimeout(state.timeout);
    const timeout = setTimeout(() => {
      setState({
        width: window.innerWidth,
        height: window.innerHeight,
        isResizing: false,
        timeout: null
      });
    }, 1000);
    requestAnimationFrame(() => {
      setState({
        width: window.innerWidth,
        height: window.innerHeight,
        isResizing: true,
        timeout,
      })
    })
  }
  useEffect(() => {
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
    }
  });
  return state;
}

export default useWindowSize;
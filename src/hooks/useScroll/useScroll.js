import { useState, useEffect, useRef } from 'react';

const useScroll = (props = {}) => {
  const {
    scrollRef: _scrollRef,
  } = props;

  const scrollRef = _scrollRef || useRef(null);
  const scrollTimeout = useRef(null);

  const [state, setState] = useState({
    scrollTop: 0,
    scrollLeft: 0,
    isScrolling: false,
    direction: 0,
  })

  const onScroll = (evt) => {
    const newScrollTop = evt.target.scrollTop;
    const newScrollLeft = evt.target.scrollLeft;

    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setState(previousState => ({
        ...previousState,
        isScrolling: false,
      }))
    }, 150)
    setState({
      direction: newScrollTop > state.scrollTop ? 1 : -1,
      scrollTop: newScrollTop,
      scrollLeft: newScrollLeft,
      isScrolling: true,
    })

  }

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.addEventListener('scroll', onScroll);
    return () => {
      scrollRef.current.removeEventListener('scroll', onScroll);
    } 
  }, [scrollRef.current])

  return {

    ...state,
    scrollRef,
  }
}

export default useScroll;
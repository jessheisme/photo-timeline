import { useState, useRef, useEffect } from 'react';
import { clamp } from 'lodash';
import useMeasure from '../useMeasure';

const useModal = (props = {}) => {

  const [state, setState] = useState({
    isOpen: false,
  });
  const [contentRef, contentRect] = useMeasure();
  const open = () => {
    setState({
      ...state,
      width: props.width || contentRect.width,
      height: props.height || contentRect.height,
    });
    setTimeout(() => {
      setState(state => ({
        ...state,
        width: props.width || contentRect.width,
        height: props.height || contentRect.height,
        isOpen: true,
      }))
    }, 0)
  }

  const close = () => {
    setState({
      ...state,
      isOpen: false,
    })
  }

  const toggleOpen = () => {
    if (!state.isOpen) {
      open();
    } else {
      close();
    }
    if (props.toggleOpen) props.toggleOpen();
  }

  useEffect(() => {
    if (props.isOpen && !state.isOpen) {
      open();
    } else if (!props.isOpen && state.isOpen) {
      close();
    }
  }, [props.isOpen]);

  const onClickOutside = (evt) => {
    const target = evt.target;
    if (props.disableClickOutside) return;
    if (state.isOpen && !contentRef.current.contains(target)) {
      toggleOpen();
    }
  }

  useEffect(() => {
    window.addEventListener('click', onClickOutside)
    return () => {
      window.removeEventListener('click', onClickOutside);
    }
  })

  return {
    ...state,
    contentRef,
    toggleOpen,
    open,
    close,
  }
}


export default useModal;
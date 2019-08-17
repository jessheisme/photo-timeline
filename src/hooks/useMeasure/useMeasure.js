import { useState, useEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const defaultRect = { x: 0, y: 0, width: 0, height: 0, left: 0, top: 0};

const useMeasure = (measureRef) => {
  const [ rect, setRect ] = useState(defaultRect);
  const ref = measureRef || useRef(null);
  useEffect(() => {
    if (!ref || !ref.current) return;
    const observer = new ResizeObserver(entries => {
      const newRect = ref.current.getBoundingClientRect();
      setRect(newRect)
    });
    observer.observe(ref.current);
    return () => {
      observer.unobserve(ref.current);
    }
  }, [])
  return [
    ref,
    rect,
  ]
}

export default useMeasure;
import { useState, useEffect, useMemo, useRef } from 'react';
import { get } from 'lodash';
import useFrameToClip from '../../../timeline/hooks/useFrameToClip';


const useClips = ({ tracks, speakerTrack }) => {

  const speakerAtFrame = useFrameToClip(speakerTrack);

  const clipsMap = useMemo(() => {
    return tracks.reduce((acc, track) => {
      const clips = track.children;
      return clips.reduce((acc2, clip, i) => {
        const previousClip = clips[i - 1];
        const nextClip = clips[i + 1];
        const speakerClip = speakerAtFrame.get(clip.sourceRange.startTime.value);
        const speaker = get(speakerClip, 'data.speaker');
        const clipObject = {
          ...clip,
          speaker,
          previousClipId: previousClip && previousClip.id,
          nextClipId: nextClip && nextClip.id,
        }
        acc2[clip.id] = clipObject;
        return acc2;
      }, acc);
    }, {})
  }, [tracks.length]);

  // const [clipsCache, setClipsCache] = useState(clipsMap);
  const clipsCache = useRef(clipsMap);
  const [clipsUpdate, setClipsUpdate] = useState(0);
  const [lastClipUpdated, setLastClipUpdated] = useState(null);
  const [clipToUpdate, setClipToUpdate] = useState(null);

  useEffect(() => {
    // setClipsCache(clipsMap);
    clipsCache.current = clipsMap
    setClipsUpdate(performance.now())
  }, [tracks.length])

  const [focusedClipId, setFocusedClipId] = useState(null);

  const [selectionStart, setSelectionStart] = useState(0);


  const getClipStart = (clipId) => {
    const clip = clipsCache.current[clipId];
    return get(clip, 'sourceRange.startTime.value', 0);
  }

  const getClipDuration = (clipId) => {
    const clip = clipsCache.current[clipId];
    return get(clip, 'sourceRange.duration.value', 0);
  }

  const getClipEnd = (clipId) => {
    const start = getClipStart(clipId);
    const duration = getClipDuration(clipId);
    return start + duration;
  }

  const getClipText = (clipId) => {
    const clip = clipsCache.current[clipId];
    return get(clip, 'data.text', '');
  }

  const getClip = (clipId) => {
    return clipsCache.current[clipId];
  }

  const setClipText = (clipId, text) => {
    const clip = clipsCache.current[clipId];
    if (!clip) return;
    setLastClipUpdated(clip.id)
    clipsCache.current[clip.id] = {
      ...clip,
      data: {
        ...(clip.data ? clip.data : {}),
        text,
      }
    }
  }

  const isFocused = (clipId) => {
    return clipId === focusedClipId;
  }

  const setFocused = (clipId) => {
    if (lastClipUpdated && clipId !== lastClipUpdated) {
      setClipToUpdate(lastClipUpdated);
      setLastClipUpdated(null)
    }
    setFocusedClipId(clipId)
  }

  const focusLeft = (clipId) => {
    const clip = clipsCache.current[clipId];
    if (!clip) return;
    const previousClipId = clip.previousClipId;
    const previousClip = clipsCache.current[previousClipId];
    if (previousClip.data.text === '') {
      return focusLeft(previousClipId)
    }
    setFocused(previousClipId)
    setSelectionStart(previousClip.data.text.length - 1)
  }

  const focusRight = (clipId) => {
    const clip = clipsCache.current[clipId];
    if (!clip) return;
    const nextClipId = clip.nextClipId;
    const nextClip = clipsCache.current[nextClipId];
    if (nextClip.data.text === '') {
      return focusRight(nextClipId)
    }
    setFocused(nextClipId)
    setSelectionStart(1)
  }

  const backspaceLeft = (clipId) => {
    const clip = clipsCache.current[clipId];
    if (!clip) return;
    const previousClipId = clip.previousClipId;
    const previousClip = clipsCache.current[previousClipId];
    if (previousClip.data.text === '') {
      return backspaceLeft(previousClipId)
    }
    const currentText = previousClip.data.text;
    setClipText(previousClipId, currentText.slice(0, -1))
    setFocused(previousClipId)
    setSelectionStart(previousClip.data.text.length - 1)
  }

  return {
    current: Object.values(clipsMap),
    cache: clipsCache.current,
    getClip,
    getClipText,
    setClipText,
    getClipStart,
    getClipDuration,
    focusedClipId,
    isFocused,
    setFocused,
    focusLeft,
    focusRight,
    backspaceLeft,
    selectionStart,
    setSelectionStart,
    lastUpdated: clipsUpdate,
    noFocus: !focusedClipId,
    lastClipUpdated,
    clipToUpdate,
  }

}

export default useClips;
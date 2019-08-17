import { useState, useEffect, useMemo } from 'react';

const speakerColors = [
  '#88c2ec',
  '#88eca9',
  '#eae6a1',
]

const getSpeakerName = (speakerId) => {
  const number = parseInt(speakerId.split('_').pop());
  return `Speaker ${number}`;
}

const getSpeakerColor = (speakerId) => {
  const number = parseInt(speakerId.split('_').pop());
  return speakerColors[number % 3];
}

const useSpeakers = ({ speakerTrack }) => {

  const speakers = useMemo(() => {
    if (!speakerTrack) return {};
    const _speakers = speakerTrack.children.reduce((acc, clip) => {
      const speakerId = clip.data.speaker;
      const speakerData = acc[speakerId] || {
        id: speakerId,
        name: getSpeakerName(speakerId),
        color: getSpeakerColor(speakerId),
        clips: []
      };
      return { ...acc, [speakerId]: { ...speakerData, clips: [...speakerData.clips, clip] } };
    }, {})
    return _speakers;
  }, [speakerTrack])

  const [speakersCache, setSpeakersCache] = useState(speakers);

  useEffect(() => {
    setSpeakersCache(speakers);
  }, [speakerTrack])

  const setName = (speakerId, name) => {
    setSpeakersCache(
      {
        ...speakersCache,
        [speakerId]: { ...speakersCache[speakerId], name },
      }
    )
  }

  return {
    current: speakersCache,
    setName,
  }
}

export default useSpeakers;

import { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { get, clamp } from 'lodash';
import axios from 'axios';
import * as Subtitle from 'subtitle';
import useMe from '../../hooks/useMe';
import { TRACK_TYPE } from '../../../timeline/constants/types';
import * as tl from '../../../timeline/reducers';
import * as tlutils from '../../../timeline/utils';
import useSpeakers from '../../hooks/useSpeakers';
import FrameioContext from '../../context';
import mockTranscript from '../../mocks/transcript';
import useEventBus from '../../../../hooks/useEventBus';


const mockEndpoint = false;

const EVENTS = {
  ADD_TRACK: 'AddTrack',
  CLIP_CREATED: 'ClipCreated',
  TRANSCODE_COMPLETE: 'TranscodeComplete',
  COMMENT_CREATED: 'CommentCreated',
  COMMENT_DELETED: 'CommentDeleted',
  TRACKS_ADDED: 'TracksAdded',
  TRANSCRIPT_MODIFICATION: 'TranscriptModification',
  ACQUIRE_LOCK: 'AcquireLock',
  RELEASE_LOCK: 'ReleaseLock',
  TRANSLATE_PROGRESS: 'TranslateProgress',

  SET_CLIP_TEXT: 'SetClipText',
  SELECT_TRACK: 'SelectTrack',
}

const useAsset = (assetId, debugKey) => {
  const { baseURL, fetchParams, socket, token, connectionId } = useContext(FrameioContext)
  const [asset, setAsset] = useState({});
  const [timeline, setTimeline] = useState(null);
  const [lastEdited, setLastEdited] = useState(0);
  const [comments, setComments] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [clipLocks, setClipLocks] = useState({});
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [translatingLanguages, setTranslatingLanguages] = useState({});
  const [captionRequestedLanguages, setCaptionRequestedLanguages] = useState({});
  const [timelineRequesting, setTimelineRequesting] = useState(false);
  const [timelineRequested, setTimelineRequested] = useState(false);
  const channel = useRef(null);

  const assetCommentsURL = `${baseURL}/v2/assets/${assetId}/comments`;
  const transcriptUrl = `${baseURL}/v2/assets/${assetId}/transcript`;
  const translateURL = `${baseURL}/v2/assets/${assetId}/translation`;
  const locksURL = `${baseURL}/v2/assets/${assetId}/transcript/locks`;

  const user = useMe();

  const tracks = useMemo(() => timeline ? timeline.rootStack.children : [], [timeline]);

  const transcriptTracks = useMemo(() => {
    return tracks.filter(t => t.trackType === TRACK_TYPE.TRANSCRIPT)
  }, [tracks]);

  const captionTracks = useMemo(() => {
    return tracks.filter(t => t.trackType === TRACK_TYPE.CAPTION)
  }, [tracks]);

  // Get speaker track fromt timeline.
  const speakerTrack = useMemo(() => {
    return tracks.filter(t => t.trackType === TRACK_TYPE.SPEAKER)[0]
  }, [tracks]);

  const speakers = useSpeakers({ speakerTrack });

  const defaultTrack = transcriptTracks[0] || captionTracks[0]

  const selectedTrack = tracks.filter(track => {
    return track.id === selectedTrackId
  })[0]

  useEffect(() => {
    if (!selectedTrackId && defaultTrack && defaultTrack.id) {
      setSelectedTrackId(defaultTrack.id)
    }
  }, [tracks.length])

  const markEdit = () => {
    setLastEdited(performance.now());
  }

  const hydrateAsset = (asset) => {
    return {
      ...asset,
      media: asset.h264_1080_best || asset.h264_720 || asset.h264_540 || asset.h264_360,
      frames: asset.frames || asset.duration * asset.fps,
      isAudio: get(asset, 'metadata.blob.is_audio', false),
      isVideo: get(asset, 'metadata.blob.is_video', false),
    }
  }

  const eventBus = useEventBus((msg, post) => {
    const {
      type,
      data,
    } = msg.data;
    if (!timeline) return;
    switch (type) {
      case EVENTS.SET_CLIP_TEXT: {
        const { clipId, text } = data;
        setTimeline(tl.setData(timeline, clipId, { text } ));
        const postData = {
          connection_id: connectionId,
          _type: 'update.clip',
          path: ["data", "text"],
          clip_id: clipId,
          value: text,
        }
        channel.current.push(EVENTS.TRANSCRIPT_MODIFICATION, postData, 10000);
        break;
      }
      case EVENTS.ADD_TRACK: {
        const track = data.track;
        setTimeline(tl.addTrack(timeline, track))
        post(EVENTS.SELECT_TRACK, { id: track.id })
        break;
      }
      case EVENTS.CLIP_CREATED: {
        const { trackId, clip } = data;
        setTimeline(tl.addClip(timeline, trackId, clip));
        break;
      }
      case EVENTS.SELECT_TRACK: {
        const trackId = data.id;
        setSelectedTrackId(trackId)
        break;
      }
    }
  })
  
  useEffect(() => {
    if (!assetId) return;
    setRequesting(true);
    setRequested(false);
    axios.get(`${baseURL}/v2/assets/${assetId}`, fetchParams)
      .then(response => {
        const asset = response.data;
        setAsset(hydrateAsset(asset))
        setRequesting(false);
        setRequested(true);
      })
  }, [assetId])

  useEffect(() => {
    if (!assetId) return;
    axios.get(assetCommentsURL, fetchParams).then(response => setComments(response.data));
  }, [assetId])

  useEffect(() => {
    if (!asset || !asset.id || !asset.has_transcript) return;
    if (mockEndpoint) {
      setTimeline(mockTranscript);
      setTimelineRequested(true);
      markEdit();
      return;
    }
    axios.get(transcriptUrl, fetchParams).then(response => {
      setTimeline(response.data);
      setTimelineRequested(true);
      markEdit()
    });
  }, [asset && asset.id, asset.has_transcript]);

  useEffect(() => {
    if (!asset || !asset.id || !asset.has_transcript) return;
    axios.get(locksURL, fetchParams).then(response => {
      const locks = response.data;
      setClipLocks({
        ...clipLocks,
        ...locks.reduce((acc, lock) => ({ ...acc, [lock.clip_id]: lock }), {})
      });
      markEdit();
    });
  }, [asset && asset.id, asset.has_transcript]);

  const requestTimeline = (data) => {
    setTimelineRequesting(true);
    axios.post(transcriptUrl, data, fetchParams).then(response => response);
  }

  const createCaptions = ({ language }) => {
    setCaptionRequestedLanguages({
      ...captionRequestedLanguages,
      [language]: true,
    })
    const data = {
      connection_id: connectionId,
      _type: 'create.captions',
      language,
    }
    channel.current.push(EVENTS.TRANSCRIPT_MODIFICATION, data, 10000);
  }

  const _setClipText = (clipId, text) => {
    setTimeline(lastTimeline => ({
      ...lastTimeline,
      rootStack: {
        ...lastTimeline.rootStack,
        children: lastTimeline.rootStack.children.map(track => ({
          ...track,
          children: track.children.map(clip => clip.id === clipId ? ({ ...clip, data: { text }}) : clip)
        })),
      },
    }));
    markEdit();
    const data = {
      connection_id: connectionId,
      _type: 'update.clip',
      path: ["data", "text"],
      clip_id: clipId,
      value: text,
    }
    channel.current.push(EVENTS.TRANSCRIPT_MODIFICATION, data, 10000);
  }

  const setClipStartTime = (clipId, startTime) => {
    setTimeline({
      ...timeline,
      rootStack: {
        ...timeline.rootStack,
        children: timeline.rootStack.children.map(track => ({
          ...track,
          children: track.children.map(clip => clip.id === clipId ? ({ ...clip, sourceRange: {
            ...clip.sourceRange,
            startTime: {
              ...clip.sourceRange.startTime,
              value: startTime,
            }
          }}) : clip)
        })),
      },
    });
    markEdit();
    const data = {
      connection_id: connectionId,
      _type: 'update.clip',
      path: ["sourceRange", "startTime", "value"],
      clip_id: clipId,
      value: startTime,
    }
    channel.current.push(EVENTS.TRANSCRIPT_MODIFICATION, data, 10000);
  }

  const setClipDuration = (clipId, duration) => {
    setTimeline({
      ...timeline,
      rootStack: {
        ...timeline.rootStack,
        children: timeline.rootStack.children.map(track => ({
          ...track,
          children: track.children.map(clip => clip.id === clipId ? ({ ...clip, sourceRange: {
            ...clip.sourceRange,
            duration: {
              ...clip.sourceRange.duration,
              value: duration,
            }
          }}) : clip)
        })),
      },
    });
    markEdit();
    const data = {
      connection_id: connectionId,
      _type: 'update.clip',
      path: ["sourceRange", "duration", "value"],
      clip_id: clipId,
      value: duration,
    }
    channel.current.push(EVENTS.TRANSCRIPT_MODIFICATION, data, 10000);
  }

  const acquireLock = (clipId) => {
    const data = {
      connection_id: connectionId,
      _type: 'acquire.lock',
      clip_id: clipId,
      user_id: user.current.id,
    }
    channel.current.push(EVENTS.TRANSCRIPT_MODIFICATION, data, 10000);
  }

  const releaseLock = (clipId) => {
    if (!channel.current) return;
    const data = {
      connection_id: connectionId,
      _type: 'release.lock',
      clip_id: clipId,
      user_id: user.current.id,
    }
    channel.current.push(EVENTS.TRANSCRIPT_MODIFICATION, data, 10000);
  }

  const setClipSourceRange = (clipId, sourceRange) => {
    setTimeline({
      ...timeline,
      rootStack: {
        ...timeline.rootStack,
        children: timeline.rootStack.children.map(track => ({
          ...track,
          children: track.children.map(clip => clip.id === clipId ? ({ ...clip, sourceRange }) : clip),
        })),
      },
    });
    markEdit();
    const data = {
      connection_id: connectionId,
      _type: 'update.clip',
      path: ["sourceRange"],
      clip_id: clipId,
      value: sourceRange,
    }
    channel.current.push(EVENTS.TRANSCRIPT_MODIFICATION, data, 10000);
  }

  const setClipText = (clipId, text) => {
    eventBus.post(EVENTS.SET_CLIP_TEXT, { clipId, text })
  }

  const addTrack = (trackData) => {
    const track = tlutils.getCaptionTrack(trackData);
    eventBus.post(EVENTS.ADD_TRACK, { track })
  }

  const createTrackWithSubtitleString = (trackData, subtitleString) => {
    const initialTrack = tlutils.getCaptionTrack(trackData);
    const subtitleClips = Subtitle.parse(subtitleString);
    const clips = subtitleClips.map(subtitle => {
      const startTime = Math.round(subtitle.start / 1000 * asset.fps);
      const endTime = Math.round(subtitle.end / 1000 * asset.fps);
      const duration = endTime - startTime;
      const clip = tlutils.getClip(
        asset,
        { startTime, duration, data: { text: subtitle.text }}
      );
      return clip;
    });
    const track = { ...initialTrack, children: clips };
    eventBus.post(EVENTS.ADD_TRACK, { track })
  }

  const addClipToTrack = (trackId, clipData) => {
    const clip = tlutils.getClip(asset, clipData);
    eventBus.post(EVENTS.CLIP_CREATED, { trackId, clip });
  }

  const createTranslation = (data) => {
    const language = data.language;
    setTranslatingLanguages(lastTranslatingLanguages => ({
      ...lastTranslatingLanguages,
      [language]: { percent: 0 },
    }))
    axios.post(translateURL, data, fetchParams).then(response => response);
  }


  const deleteClips = (clipIds = []) => {
    setTimeline({
      ...timeline,
      rootStack: {
        ...timeline.rootStack,
        children: timeline.rootStack.children.map(track => ({
          ...track,
          children: track.children.filter(clip => !clipIds.includes(clip.id)),
        })),
      },
    });
    markEdit();
    clipIds.forEach((clipId) => {
      const data = {
        connection_id: connectionId,
        _type: 'delete.clip',
        clip_id: clipId,
      }
      channel.current.push(EVENTS.TRANSCRIPT_MODIFICATION, data, 10000);
    })
  }


  useEffect(() => {
    if (!assetId) return;
    channel.current = socket.channel(`assets:${assetId}`, { user_token: `${token}` });

    channel.current.on(EVENTS.TRANSCODE_COMPLETE, msg => {
      const asset = msg.data;
      if (!asset || !asset.has_transcript) return;
      setAsset(hydrateAsset(asset))
      setTimelineRequesting(false);
    });
    channel.current.on(EVENTS.COMMENT_CREATED, msg => {
      const comment = msg.data;
      if (!comment) return;
      setComments([...comments.filter(c => c.id !== comment.id), comment])
    })
    channel.current.on(EVENTS.COMMENT_DELETED, msg => {
      const comment = msg.data;
      if (!comment) return;
      setComments([...comments.filter(c => c.id !== comment.id)])
    })

    channel.current.on(EVENTS.TRACKS_ADDED, msg => {
      const tracks = get(msg, 'data.tracks');
      if (!tracks) return;
      const language = get(tracks[0], 'language', null);
      setTimeline(lastTimeline => ({
        ...lastTimeline,
        rootStack: {
          ...lastTimeline.rootStack,
          children: [
            ...lastTimeline.rootStack.children,
            ...tracks,
          ]
        },
      }));
      markEdit();
      if (!language) return;
      setTranslatingLanguages(lastTranslatingLanguages => {
        return {
          ...lastTranslatingLanguages,
          [language]: { percent: 100 }
        }
      })
      setTimeout(() => {
        setTranslatingLanguages(lastTranslatingLanguages => {
          const translatingLanguages = { ...lastTranslatingLanguages };
          delete translatingLanguages[language];
          return translatingLanguages;
        });
      }, 2000);
    })

    channel.current.on(EVENTS.TRANSCRIPT_MODIFICATION, msg => {

      const type = get(msg, '_type', null);
      if (connectionId !== msg.connection_id || type === 'create.captions') {
        const path = get(msg, 'path', []).join('.');
        const value = get(msg, 'value', null);
        const clipId = get(msg, 'clip_id', null);
        const lock = get(msg, 'lock', null);
        if (type === 'acquire.lock' && lock) {
          setClipLocks({
            ...clipLocks,
            [lock.clip_id]: lock,
          })
          markEdit();
          return;
        }
        if (type === 'release.lock' && lock) {
          setClipLocks(_lastClipLocks => {
            const lastClipLocks = { ..._lastClipLocks };
            delete lastClipLocks[lock.clip_id];
            return lastClipLocks;
          })
          markEdit()
          return;
        }
        if (type === 'create.captions') {
          const track = get(msg, 'track', null);
          const deletedTrackId = get(msg, 'deleted_track', null);
          setTimeline({
            ...timeline,
            rootStack: {
              ...timeline.rootStack,
              children: [
                ...timeline.rootStack.children.filter(t => t.id !== deletedTrackId),
                track,
              ]
            },
          });
          markEdit()
          return;
        }
        if (!value || !clipId || path === "") return;
        switch (path) {
          case 'sourceRange': {
            setTimeline({
              ...timeline,
              rootStack: {
                ...timeline.rootStack,
                children: timeline.rootStack.children.map(track => ({
                  ...track,
                  children: track.children.map(clip => clip.id === clipId ? ({ ...clip, sourceRange: value }) : clip),
                })),
              },
            });
            markEdit();
            break;
          }
          case 'data.text': {
            setTimeline({
              ...timeline,
              rootStack: {
                ...timeline.rootStack,
                children: timeline.rootStack.children.map(track => ({
                  ...track,
                  children: track.children.map(clip => clip.id === clipId ? ({ ...clip, data: { text: value }}) : clip)
                })),
              },
            });
            markEdit();
            break;
          }
        }
      }
    })

    channel.current.on(EVENTS.TRANSLATE_PROGRESS, msg => {
      const data = get(msg, 'data');
      if (!data) return;
      const language = data.language;
      const total = data.total;
      const count = data.count;
      setTranslatingLanguages(lastTranslatingLanguages => {
        const lastPercent = lastTranslatingLanguages[language].percent || 0;
        const newPercent = Math.round(count / total * 100)
        const percent = clamp(Math.max(lastPercent, newPercent), 0, 100);
        return {
          ...lastTranslatingLanguages,
          [language]: { percent }
        }
      })
    })

    channel.current.on(EVENTS.ACQUIRE_LOCK, msg => {
      const lock = get(msg, 'data.lock');
      const lockConnectionId = get(lock, 'connection_id');
      if (!lock) return;
      if (connectionId !== lockConnectionId) {
        setClipLocks({
          ...clipLocks,
          [lock.clip_id]: lock,
        })
        markEdit();
      } else {
        setTimeout(() => {
          releaseLock(lock.clip_id);
          markEdit();
        }, 4000)
      }
    })

    channel.current.join()
    return () => channel.current.leave()
  }, [assetId, comments, timeline && timeline.id])

  const createComment = (comment) => {
    axios.post(assetCommentsURL, comment, fetchParams).then(response => response)
  }

  const deleteComment = (commentId) => {
    axios.delete(`${commentsURL}/${commentId}`, fetchParams).then(response => response)
  }

  const isCaptionTrack = (track) => {
    return track && track.trackType === TRACK_TYPE.CAPTION;
  }

  return {
    current: asset,
    comments: {
      current: comments,
      create: createComment,
      delete: deleteComment,
    },
    timeline: {
      current: timeline,
      tracks,
      selectedTrack,
      setSelectedTrack: setSelectedTrackId,
      transcriptTracks,
      captionTracks,
      speakers,
      speakerTrack,
      request: requestTimeline,
      requesting: timelineRequesting,
      requested: timelineRequested,
      setClipText,
      setClipStartTime,
      setClipDuration,
      setClipSourceRange,
      addTrack,
      addClipToTrack,
      deleteClips,
      markEdit,
      lastEdited,
      createTranslation,
      locks: clipLocks,
      acquireLock,
      releaseLock,
      translatingLanguages,
      captionRequestedLanguages,
      createCaptions,
      isCaptionTrack,
      createTrackWithSubtitleString,
    },
    requesting,
    requested,
  }
}

export default useAsset;
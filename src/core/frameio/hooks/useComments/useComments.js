
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FrameioContext from '../../context';

const EVENTS = {
  COMMENT_CREATED: 'CommentCreated',
  COMMENT_DELETED: 'CommentDeleted',
}

const useComments = (assetId) => {
  const { baseURL, fetchParams, socket, token } = useContext(FrameioContext)
  // const [comments, setComments] = useState([]);

  const assetCommentsURL = `${baseURL}/v2/assets/${assetId}/comments`;
  const commentsURL = `${baseURL}/v2/comments`;

  // useEffect(() => {
  //   if (!assetId) return;
  //   axios.get(assetCommentsURL, fetchParams).then(response => setComments(response.data))
  // }, [assetId])

  // useEffect(() => {
  //   if (!assetId) return;
  //   const channel = socket.channel(`assets:${assetId}`, { user_token: `${token}` });
  //   channel.on(EVENTS.COMMENT_CREATED, msg => {
  //     const comment = msg.data;
  //     if (!comment) return;
  //     setComments([...comments.filter(c => c.id !== comment.id), comment])
  //   })
  //   channel.on(EVENTS.COMMENT_DELETED, msg => {
  //     const comment = msg.data;
  //     if (!comment) return;
  //     setComments([...comments.filter(c => c.id !== comment.id)])
  //   })
  //   channel.join()
  //   return () => channel.leave()
  // }, [assetId, comments])

  const createComment = (comment) => {
    axios.post(assetCommentsURL, comment, fetchParams).then(response => response)
  }

  const deleteComment = (commentId) => {
    axios.delete(`${commentsURL}/${commentId}`, fetchParams).then(response => response)
  }

  return {
    // all: comments,
    create: createComment,
    delete: deleteComment,
  };
}

export default useComments;
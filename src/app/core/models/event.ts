export enum Event {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  COMMENT = 'comment',
  CLIENT_ERROR = 'connect_error',
  FETCH_COMMENTS = 'fetchComments',
  ADD_COMMENTS = 'addComment',
  DELETE_COMMENT = 'deleteComment',
  // ADD_REPLY = 'addReply',
  // DELETE_REPLY = 'deleteReply',
  // COMMENT_DELETED = 'commentDeleted',
  // REPLY_DELETED = 'replyDeleted',
  COMMENT_POSTED = 'commentPosted',
  // REPLY_POSTED = 'replyPosted'
}

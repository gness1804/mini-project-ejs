const deleteTalk = (title) => {
  request({
    pathname: talkURL(title),
    method: 'DELETE',
  }, reportError);
};

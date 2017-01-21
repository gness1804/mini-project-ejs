const talkURL = (title) => {
  return 'talks/' + encodeURIComponent(title);
};

module.exports = talkURL;

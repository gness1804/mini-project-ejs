const request = require('../skillsharing_client');
const reportError = require('./report-error');
const talkURL = require('./talk-url');

const deleteTalk = (title) => {
  request({
    pathname: talkURL(title),
    method: 'DELETE',
  }, reportError);
};

module.exports = deleteTalk;

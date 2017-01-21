const respondJSON = require('../server');

const sendTalks = (talks, response) => {
  respondJSON(response, 200, {
    serverTime: Date.now(),
    talks,
  });
};

module.exports = sendTalks;

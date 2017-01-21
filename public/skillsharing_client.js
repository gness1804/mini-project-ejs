var lastServerTime = 0;

function request(options, callback) {
  var req = new XMLHttpRequest();
  req.open(options.method || 'GET', options.pathname, true);
  req.addEventListener('load', function () {
    if (req.status < 400) {
      callback(null, req.responseText);
    } else {
      callback(new Error('Request failed: ' + req.statusText));
    }
  });
  req.addEventListener('error', function () {
    callback(new Error('Network error.'));
  });
  req.send(options.body || null);
}

request({
  pathname: 'talks',
}, function (error, response) {
  if (error) {
    reportError(error);
  } else {
    response = JSON.parse(response);
    displayTalks(response.talks);
    lastServerTime = response.serverTime;
    waitForChanges();
  }
});

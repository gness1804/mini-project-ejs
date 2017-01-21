var lastServerTime = 0;
var talkDiv = document.querySelector('#talks');
var shownTalks = {};

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

function reportError(error) {
  if (error) {
    document.getElementById('error-container').innerText = error.toString();
  }
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

//same problem here with not sure whether line 56 is within the else block or not
function displayTalks(talks) {
  talks.forEach(function(talk){
    var shown = shownTalks[talk.title];
    if (talk.deleted) {
      if (shown) {
        talkDiv.removeChild(shown);
        delete shownTalks[talk.title];
      }
    } else {
      var node = drawTalk(talk);
      if (shown) {
        talkDiv.replaceChild(node, shown);
      } else {
        talkDiv.appendChild(node);
      }
      shownTalks[talk.title] = node;
    }
  });
}

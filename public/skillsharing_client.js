import { reportError } from './helpers/report-error';

let lastServerTime = 0;
const talkDiv = document.querySelector('#talks');
let shownTalks = {};
const nameField = document.querySelector('#name');
const talkForm = document.querySelector('#newtalk');

const request = (options, callback) => {
  const req = new XMLHttpRequest();
  req.open(options.method || 'GET', options.pathname, true);
  req.addEventListener('load', () => {
    if (req.status < 400) {
      callback(null, req.responseText);
    } else {
      callback(new Error(`Request failed: ${req.statusText}`));
    }
  });
  req.addEventListener('error', () => {
    callback(new Error('Network error.'));
  });
  req.send(options.body || null);
};

request({
  pathname: 'talks',
},
  (error, response) => {
    if (error) {
      reportError(error);
    } else {
      response = JSON.parse(response);
      displayTalks(response.talks);
      lastServerTime = response.serverTime;
      waitForChanges();
    }
  });


const displayTalks = (talks) => {
  talks.forEach((talk) => {
    let shown = shownTalks[talk.title];
    if (talk.deleted) {
      if (shown) {
        talkDiv.removeChild(shown);
        delete shownTalks[talk.title];
      }
    } else {
      let node = drawTalk(talk);
      if (shown)
        talkDiv.replaceChild(node, shown);
      else
        talkDiv.appendChild(node);
      shownTalks[talk.title] = node;
    }
  });
};

function instantiateTemplate(name, values) {
  function instantiateText(text) {
    return text.replace(/\{\{(\w+)\}\}/g, function (_, name) {
      return values[name];
    });
  }
  function instantiate(node) {
    if (node.nodeType === document.ELEMENT_NODE) {
      var copy = node.cloneNode();
      for (var i = 0; i < node.childNodes.length; i++) {
        copy.appendChild(instantiate(node.childNodes[i]));
      }
      return copy;
    } else if (node.nodeType === document.TEXT_NODE) {
      return document.createTextNode(instantiateText(node.nodeValue));
    } else {
      return node;
    }
  }

  var template = document.querySelector('#template .' + name);
  return instantiate(template);
}

function drawTalk(talk) {
  var node = instantiateTemplate('talk', talk);
  var comments = node.querySelector('.comments');
  talk.comments.forEach(function (comment) {
    comments.appendChild(instantiateTemplate('comment', comment));
  });

  node.querySelector('button.del').addEventListener('click', deleteTalk.bind(null, talk.title));

  var form = node.querySelector('form');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    addComment(talk.title, form.elements.comment.value);
    form.reset();
  });
  return node;
}

function talkURL(title) {
  return 'talks/' + encodeURIComponent(title);
}

function deleteTalk(title) {
  request({
    pathname: talkURL(title),
    method: 'DELETE',
  }, reportError);
}

function addComment(title, comment) {
  var comment = {
    author: nameField.value,
    message: comment,
  };
  request({
    pathname: talkURL(title) + '/comments',
    body: JSON.stringify(comment),
    method: 'POST',
  }, reportError);
}

nameField.value = localStorage.getItem('name') || '';
nameField.addEventListener('change', function () {
  localStorage.setItem('name', nameField.value);
});

talkForm.addEventListener('submit', function (event) {
  event.preventDefault();
  request({
    pathname: talkURL(talkForm.elements.title.value),
    method: 'PUT',
    body: JSON.stringify({
      presenter: nameField.value,
      summary: talkForm.elements.summary.value,
    }),
  }, reportError);
  talkForm.reset();
});

function waitForChanges() {
  request({
    pathname: 'talks?changesSince=' + lastServerTime,
  }, function (error, response) {
    if (error) {
      setTimeout(waitForChanges, 2500);
      console.error(error.stack);
    } else {
      response = JSON.parse(response);
      displayTalks(response.talks);
      lastServerTime = response.serverTime;
      waitForChanges();
    }
  });
}

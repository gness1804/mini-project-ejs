const reportError = require('./helpers/report-error');
const talkURL = require('./helpers/talk-url');
const deleteTalk = require('./helpers/delete-talk');

let lastServerTime = 0;
const talkDiv = document.querySelector('#talks');
let shownTalks = Object.create(null);
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

const instantiateTemplate = (name, values) => {
  const instantiateText = (text) => {
    return text.replace(/\{\{(\w+)\}\}/g, (_, name) => {
      return values[name];
    });
  }
  const instantiate = (node) => {
    if (node.nodeType === document.ELEMENT_NODE) {
      let copy = node.cloneNode();
      for (let i = 0; i < node.childNodes.length; i++) {
        copy.appendChild(instantiate(node.childNodes[i]));
      }
      return copy;
    } else if (node.nodeType === document.TEXT_NODE) {
      return document.createTextNode(instantiateText(node.nodeValue));
    } else {
      return node;
    }
  };

  let template = document.querySelector('#template .' + name);
  return instantiate(template);
};

const drawTalk = (talk) => {
  let node = instantiateTemplate('talk', talk);
  let comments = node.querySelector('.comments');
  talk.comments.forEach((comment) => {
    comments.appendChild(instantiateTemplate('comment', comment));
  });

  node.querySelector('button.del').addEventListener('click', deleteTalk.bind(null, talk.title));

  let form = node.querySelector('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    addComment(talk.title, form.elements.comment.value);
    form.reset();
  });
  return node;
};

const addComment = (title, comment) => {
  let comment = {
    author: nameField.value,
    message: comment,
  };
  request({
    pathname: talkURL(title) + '/comments',
    body: JSON.stringify(comment),
    method: 'POST',
  },
  reportError);
};

nameField.value = localStorage.getItem('name') || '';

nameField.addEventListener('change', () => {
  localStorage.setItem('name', nameField.value);
});

talkForm.addEventListener('submit', (event) => {
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

const waitForChanges = () => {
  request({
    pathname: 'talks?changesSince=' + lastServerTime,
  },
  (error, response) => {
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
};

module.exports = request;

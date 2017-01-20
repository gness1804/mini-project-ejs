require('babel-register')({
  presets: [react, es2015]
});
require('babel-polyfill');

global.document = require('jsdom').jsdom(
  )

global.window = document.defaultView;
global.navigator = window.navigator;

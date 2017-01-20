const path = require('path');

module.exports = {
  entry: {
    main: ['babel-polyfill', './lib/index.js']
  },
output: {
     path: __dirname,
     filename: '[name].bundle.js',
   },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
      	  presets: ['es2015', 'react', 'stage-0']	
        },
      },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.scss$/, loader: 'style!css!sass' },
    ],
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss', '.css'],
  },
};

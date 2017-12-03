const debug = require('debug');
var log = debug('wp-creative-server-app');

module.exports = {
  context: __dirname,
  // devtool: debug ? "inline-sourcemap" : null,
  entry: './src/index.js',
  output: {
    path: `${__dirname}/public`,
    filename: "index.min.js"
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /app\/node_modules/,
      use: [{ 
        loader: 'babel-loader', 
        options: { 
          presets: ['es2015', 'react']
        }
      }]
    }]
  },
  // plugins: debug ? [] : [
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  // ],
};
const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './dist/sourceMap/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js'],
  },
};
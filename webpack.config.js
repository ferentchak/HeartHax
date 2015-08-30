var path = require("path");
var webpack = require("webpack");
module.exports = {
	cache: true,
  entry: {
    index: ["./src/js/index.js"]
  },
  output: {
    path: "dist/js",
    filename: "[name].js",
    publicPath: "js/"
  },
  files: {
    'dist/js/index.js': 'src/js/index.js'
  },
  resolve: {
    modulesDirectories: ["components", ".", "node_modules"],
    extensions: ["", ".webpack.js", ".web.js", ".js"]
  },
  module: {
    loaders: [
      // runtime=true tells 6to5 to expect a runtime, but we still need to bundle it.
      {
        test: /\.js$/,
        exclude: [/node_modules/, /__tests__/],
        loaders: ['react-hot','es6', 'jsx?harmony']
      },
      {
        test: /\.jsx$/,
        loader: 'jsx'
      },
      {
        test: /\.scss$/,
        loader: 'jsx'
      }
    ]
  },
  plugins: [],
  stats: {
    // Configure the console output
    colors: true,
    modules: true,
    reasons: true
  }
}

const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./FoodFinderz/frontend/src/index.js",
  output: {
    //path: path.resolve(__dirname, "./static/frontend"),
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        //exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sass|css)$/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  /*
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        //exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  */
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
};
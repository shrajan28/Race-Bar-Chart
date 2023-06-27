const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: path.resolve(__dirname, "src") + "/index.js",
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env"],
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
            plugins: ["@babel/plugin-syntax-jsx"],
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-syntax-jsx"],
          },
        },
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: { loader: "html-loader" },
      },
      // use the css loaders (first load the css, then inject the style)
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml)$/,
        use: ["url-loader"],
      },
    ],
  },
  externals: {
    react: "react",
  },
  mode: "production",
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".css"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "code",
    }),
  ],

  output: {
    path: path.resolve("build"),
    filename: "index.js",
    libraryTarget: "commonjs2",
  },
};

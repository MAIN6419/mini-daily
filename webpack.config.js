const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  experiments: {
    topLevelAwait: true,
  },
  mode: "production",
  entry: {
    commons: "./src/js/commons/commons.js",
    allDiary: "./src/js/allDiary/allDiary.js",
    chatting: "./src/js/chatting/chatting.js",
    chattingRoom: "./src/js/chattingRoom/chattingRoom.js",
    diary: "./src/js/diary/diary.js",
    findAccount: "./src/js/findAccount/findAccount.js",
    forune: "./src/js/fortune/fortune.js",
    home: "./src/js/home/home.js",
    login: "./src/js/login/login.js",
    myDiary: "./src/js/myDiary/myDiary.js",
    mypage: "./src/js/mypage/mypage.js",
    signup: "./src/js/signup/signup.js",
    write: "./src/js/write/write.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    clean: true,
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "img",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
      chunks: ["login"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/allDiary.html",
      filename: "allDiary.html",
      chunks: ["commons", "main", "allDiary"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/chatting.html",
      filename: "chatting.html",
      chunks: ["commons", "main", "chatting"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/chattingRoom.html",
      filename: "chattingRoom.html",
      chunks: ["commons", "main", "chattingRoom"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/diary.html",
      filename: "diary.html",
      chunks: ["commons", "main", "diary"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/findAccount.html",
      filename: "findAccount.html",
      chunks: ["commons", "main", "findAccount"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/fortune.html",
      filename: "fortune.html",
      chunks: ["commons", "main", "fortune"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/home.html",
      filename: "home.html",
      chunks: ["commons", "main", "home"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/myDiary.html",
      filename: "myDiary.html",
      chunks: ["commons", "main", "myDiary"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/mypage.html",
      filename: "mypage.html",
      chunks: ["commons", "main", "mypage"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/signup.html",
      filename: "signup.html",
      chunks: ["commons", "main", "signup"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/write.html",
      filename: "write.html",
      chunks: ["commons", "main", "write"],
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
  ],
};

const path = require("path");
// html 번들링 플러그인
const HtmlWebpackPlugin = require("html-webpack-plugin");
// css파일 추출 플러그인
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 파일 복사 플러그인
const CopyWebpackPlugin = require("copy-webpack-plugin");
// favicon 번들링 플러그인
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const { SourceMapDevToolPlugin } = require("webpack");
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
    fortune: "./src/js/fortune/fortune.js",
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
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
        ],
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
      {
        test: /\.m?js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
      favicon: './src/img/favicon.png',
      chunks: ["login"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/allDiary.html",
      filename: "allDiary.html",
      favicon: './src/img/favicon.png',
      chunks: ["commons", "main", "allDiary"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/chatting.html",
      filename: "chatting.html",
      favicon: './src/img/favicon.png',
      chunks: ["commons", "main", "chatting"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/chattingRoom.html",
      filename: "chattingRoom.html",
      favicon: './src/img/favicon.png',
      chunks: ["commons", "main", "chattingRoom"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/diary.html",
      filename: "diary.html",
      favicon: './src/img/favicon.png',
      chunks: ["commons", "main", "diary"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/findAccount.html",
      filename: "findAccount.html",
      favicon: './src/img/favicon.png',
      chunks: ["commons", "main", "findAccount"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/fortune.html",
      filename: "fortune.html",
      favicon: './src/img/favicon.png',
      chunks: ["commons", "main", "fortune"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/home.html",
      filename: "home.html",
      favicon: './src/img/favicon.png',
      chunks: ["commons", "main", "home"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/myDiary.html",
      filename: "myDiary.html",
      favicon: './src/img/favicon.png',
      chunks: ["commons", "main", "myDiary"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/mypage.html",
      filename: "mypage.html",
      favicon: './src/img/favicon.png',
      chunks: ["commons", "main", "mypage"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/signup.html",
      filename: "signup.html",
      favicon: './src/img/favicon.png',
      chunks: ["commons", "main", "signup"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/template/write.html",
      filename: "write.html",
      favicon: './src/img/favicon.png',
      chunks: ["commons", "main", "write"],
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./src/db/db.json"),
          to: path.resolve(__dirname, "dist/db"),
        },
      ],
    }),
    new FaviconsWebpackPlugin({
      logo: "./src/img/favicon.png", // 파비콘 이미지 파일 경로
      outputPath: "./dist/img/favicon", // 생성된 파비콘 파일의 출력 경로
      publicPath: "./favicon", // HTML에서 파비콘 파일에 접근할 때 사용할 경로
      prefix: "favicon/", // 생성된 파비콘 파일의 이름 앞에 추가될 경로 또는 폴더명
      favicons: {
        // 생성될 파비콘 이미지와 관련된 옵션
        appName: "My App", // 앱 이름
        appShortName: "App", // 앱 짧은 이름
        appDescription: "My awesome app", // 앱 설명
        // ... 기타 옵션 ...
      },
    }),
    new SourceMapDevToolPlugin({
      filename: "[file].map"
    }),
  ],
};

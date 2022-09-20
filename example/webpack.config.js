const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
module.exports = {
	mode: "development",
	entry: {
		bundle: path.resolve(__dirname, "src/index.js"),
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
		clean: true,
		assetModuleFilename: "[name][ext]",
	},
	devtool: "source-map",
	devServer: {
		static: {
			directory: path.resolve(__dirname, "dist"),
		},
		port: 3000,
		open: true,
		hot: true,
		compress: true,
		historyApiFallback: true,
		// watchFiles: true,
	},
	module: {
		exprContextCritical: false,
		rules: [
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
				generator: {
					filename: "assets/[name][ext]",
				},
			},
			{
				test: /\.wasm$/,
				type: "asset/resource",
				generator: {
					filename: "wasm/[name][ext]",
				},
			},
			{
				test: /\.json$/,
				type: "asset/resource",
				generator: {
					filename: "json/[name][ext]",
				},
			},
			{
				test: /\.js$/, // Sẽ sử dụng babel-loader cho những file .js
				exclude: /node_modules/, // Loại trừ thư mục node_modules
				use: {
					loader: "babel-loader",
				},
			},
		],
	},

	plugins: [
		new Dotenv(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src/index.html"),
			title: "BIM2Gantt",
			filename: "index.html",
		}),
	],
	resolve: {
		enforceExtension: false,
		extensions: [".js", ".json", ".wasm"],
	},
	optimization: {
		splitChunks: {
			chunks: "all",
		},
	},
};

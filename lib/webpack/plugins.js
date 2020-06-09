
const path = require('path');
const webpack = require('webpack');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const CopyPlugin = require('copy-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = ({ isProd, mode, rootDir, projectRoot, config, envError, version, appName, assetsUrl }) => {

	const plugins = [
    new CopyPlugin([{ from: 'public', to: '.' }], {
      context: projectRoot,
      ignore: ['*.html', '*.js', 'manifest.json']
    }),
    new HtmlWebpackPlugin({
      template: path.join('!!', path.join(rootDir, 'node_modules/html-webpack-plugin/lib/loader.js!'), projectRoot, 'public/index.html'),
      filename: 'index.html'
    }),
    new PreloadWebpackPlugin({
      fileWhitelist: [/\.otf/],
      rel: 'preload',
      as: 'font',
      include: 'allAssets'
    }),
    new webpack.DefinePlugin({
			process: JSON.stringify({
				env: {
					...config,
					NODE_ENV: mode,
					VERSION: version,
					name: appName,
				}
			})
		}),
		new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[name].[chunkhash].css',
    })
	];

	if (!envError) {
		plugins.push(new InterpolateHtmlPlugin(HtmlWebpackPlugin, config));
	}

	if (isProd) {
		plugins.push(new CleanWebpackPlugin({ verbose: true }));
    plugins.push(new webpack.HashedModuleIdsPlugin());
    plugins.push(new CompressionPlugin());
		plugins.push(new ManifestPlugin({
      seed: require(path.join(projectRoot, 'public/manifest.json')),
      fileName: 'manifest.json',
      basePath: assetsUrl
    }));

		if (process.env.ANALYZE === 'true') {
			plugins.push(new BundleAnalyzerPlugin());
		}
	} else {
		plugins.push(new ErrorOverlayPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
	}

	return plugins;
};


const TerserPlugin = require('terser-webpack-plugin');

const chunksGroupOptions = {
  chunks: 'all',
  minSize: 0,
  minChunks: 1,
  reuseExistingChunk: true,
  enforce: true
};

module.exports = ({ isProd }) => {
	if (isProd) {
		return {
			noEmitOnErrors: true,
			namedModules: true,
			runtimeChunk: 'single',
			minimizer: [
				new TerserPlugin({
					cache: true,
					parallel: true,
					sourceMap: true
				})
			],
			splitChunks: {
				chunks: 'all',
				maxInitialRequests: Infinity,
				cacheGroups: {
					vendor: Object.assign({}, {
							test: /[\\/]node_modules[\\/]/,
							name: 'vendors',
						},
						chunksGroupOptions
					),
					common: Object.assign({}, {
							test: /[\\/]node_modules[\\/]/,
							name: 'common',
						}, 
						chunksGroupOptions
					)
				}
			}
		};
	}
	
	return {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
	};
};

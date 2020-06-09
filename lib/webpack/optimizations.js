
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
					vendor: {
						test: /[\\/]node_modules[\\/](!@carvana)[\\/]/,
						name: 'vendors',
						...chunksGroupOptions
					},
					common: {
						test: /[\\/]node_modules[\\/](@carvana)[\\/]/,
						name: 'common',
						...chunksGroupOptions
					}
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

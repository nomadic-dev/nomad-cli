
const webpackConfig = require('./lib/webpack');
const merge = require('webpack-merge');

const carvanaWebpackInitializer = (config = {}) => {
	return merge(webpackConfig, config);
};

module.exports = {
	webpackConfig,
	carvanaWebpackInitializer,
};

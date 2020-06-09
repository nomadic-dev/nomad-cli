
const webpackConfig = require('./lib/webpack');
const merge = require('webpack-merge');

const webpackInitializer = (config = {}) => {
	return merge(webpackConfig, config);
};

module.exports = {
	webpackConfig,
	webpackInitializer,
};

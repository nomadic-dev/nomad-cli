

module.exports = ({ isProd, assetsUrl, outputPath }) => {
	if (isProd) {
		return {
      filename: 'js/[name].[chunkhash].js',
			path: outputPath,
			publicPath: `${assetsUrl}`
		};
	} else {
		return {
			filename: `js/[name].js`,
			pathinfo: true,
			path: outputPath,
			publicPath: '/'
		};
	}
};

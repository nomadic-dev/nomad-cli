
const path = require('path');

module.exports = ({ isProd, projectRoot }) => {
	if (!isProd) {
		return {
			open: false,
			port: 3000,
			contentBase: path.join(projectRoot, 'build'),
			historyApiFallback: {
				index: '/'
			},
			disableHostCheck: true,
			hot: true,
			overlay: {
				warnings: false,
				errors: true
			}
		};
	}
};

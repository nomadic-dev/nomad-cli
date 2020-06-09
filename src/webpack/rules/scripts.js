
const path = require('path');

module.exports = ({ isProd, rootDir }) => {
	return [
		{
			test: /^(?!.*\.test\.(j|t)sx?$).*\.m?(j|t)sx?$/,
			exclude: /node_modules\/.*/,
			use: [
				{
					loader: 'babel-loader',
					options: {
						cacheDirectory: !isProd,
						configFile: path.join(rootDir, 'lib/babel')
					}
				}
			]
		}
	];
};

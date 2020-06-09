
const path = require('path');

module.exports = ({ rootDir }) => {
	return [
		{
			test: /\.html$/,
			exclude: /(node_modules|vendor)/,
			loader: path.join(rootDir, 'node_modules/html-loader'),
			options: {
				attrs: [
					'img:src',
					'img:ng-src',
					'use:xlink:href',
					'use:href',
					'object:data',
					'link:href'
				]
			}
		}
	];
};

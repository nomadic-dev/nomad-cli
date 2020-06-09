
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = ({ isProd, projectRoot }) => {
	const styleLoader = !isProd ? 'style-loader' : MiniCssExtractPlugin.loader;
	const projectDir = path.join(projectRoot, 'src');

	return [
		// global css loader
		{
			test: [/\.scss$/i],
			exclude: /\.module\.scss$/i,
			use: [
				{ loader: styleLoader },
				{
					loader: 'css-loader',
					options: {
						sourceMap: true,
						importLoaders: 2,
						localsConvention: 'camelCase',
						modules: {
							mode: 'global',
							context: projectDir
						}
					}
				},
				{
					loader: 'resolve-url-loader',
					options: {
						root: projectDir,
					}
				},
				{
					loader: 'sass-loader',
					options: {
						implementation: require('sass'),
						sourceMap: true,
						sassOptions: {
							includePaths: [ projectDir ],
						}
					}
				}
			]
		},

		// module css loader
		{
			test: [/\.module\.scss$/i],
			use: [
				{ loader: styleLoader },
				{
					loader: 'css-loader',
					options: {
						sourceMap: true,
						importLoaders: 2,
						localsConvention: 'camelCase',
						modules: {
							mode: 'local',
							localIdentName: '[local]__[path]--[hash:base64:5]',
							context: projectDir,
						}
					}
				},
				{
					loader: 'resolve-url-loader',
					options: {
						root: projectDir,
					}
				},
				{
					loader: 'sass-loader',
					options: {
						implementation: require('sass'),
						sourceMap: true,
						sassOptions: {
							includePaths: [ projectDir ],
						}
					}
				}
			]
		},
	];
};

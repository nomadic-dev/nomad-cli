

module.exports = ({ isLocalBuild }) => {
	return [
		{
			test: /\.(png|jpe?g|gif)$/,
			use: [
				{
					loader: 'url-loader',
					options: {
						limit: 10000,
						fallback: 'file-loader',
						name: '[name].[hash].[ext]'
					}
				},
				{
					loader: 'image-webpack-loader',
					options: {
						disable: isLocalBuild,
						mozjpeg: {
							progressive: true,
							quality: 65
						},
						pngquant: {
							quality: [0.65, 0.9],
							speed: 4
						},
						gifsicle: {
							interlaced: false
						}
					}
				}
			]
		},
		{
			test: /\.svg$/,
			use: [
				{
					loader: '@svgr/webpack',
					options: {
						svgoConfig: {
							plugins: {
								removeViewBox: false
							}
						}
					}
				}
			]
		}
	];
};

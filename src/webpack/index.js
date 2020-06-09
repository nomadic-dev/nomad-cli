
const path = require('path');
const fg = require('fast-glob');
const rules = require('./rules');
const plugins = require('./plugins');
const optimization = require('./optimizations');
const output = require('./output');
const devServer = require('./dev-server');

const rootDir = path.resolve(path.join(__dirname, '../../'));
const projectRoot = process.cwd();
const pkg = require(path.join(projectRoot, 'package.json'));
const isLocalBuild = process.env.LOCAL === 'true';

const envPath = fg.sync(
  [
    `.env.${process.env.ENVIRONMENT}`,
    `.env.local`,
    `.env`,
  ],
  {
    dot: true,
    cwd: projectRoot,
    deep: 0
  }
)[0];

const env = require('dotenv').config({ path: envPath });

const config = {};
if (!env.error) {
  Object.keys(env.parsed).forEach(key => {
    config[key] = env.parsed[key];
	});
}

const appName = pkg.name || '';
const assetsUrl = process.env.CVNA_APP_PUBLIC_URL;
const outputPath = path.resolve(projectRoot, `build`);
const projectUrl = outputPath.replace(/[/\\\\]/, '');
const isProd = process.env.NODE_ENV === 'production';
const mode = isProd ? 'production' : 'development';

const options = {
	mode, projectRoot, projectUrl,
	outputPath, assetsUrl,
	isLocalBuild, isProd,
	appName,
	version: pkg.version,
	config,
	envError: env.error,
	rootDir
};

const entry = fg.sync('src/index.[jt]s', { absolute: true });


module.exports = {
	mode,
	entry,

	resolveLoader: {
		modules: [
			path.join(rootDir, 'node_modules'),
			path.join(projectRoot, 'node_modules')
		]
	},

	bail: isProd ? true : undefined,
  performance: isProd ? { hints: false } : undefined,

	output: output(options),

	devtool: isProd ? 'source-map' : 'eval-source-map',

	resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
		alias: {
			"app": path.resolve(projectRoot, 'src/')
		}
  },

	module: {
		rules: rules(options)
	},

	plugins: plugins(options),

	optimization: optimization(options),
	devServer: devServer(options),
};


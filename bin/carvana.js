#! /usr/bin/env node
const { spawn } = require('child_process');
const PKG = require('../package.json');
const path = require('path');

const [ COMMAND, ...ARGS ] = process.argv.slice(2);

const CLI_ROOT = path.resolve(path.join(__dirname, '../'));
const PROJ_ROOT = process.cwd();

const ARG_MAP = {
	'-e': 'environment',
  '--local': 'local',
	'--analyze': 'analyze',
	'--debugMode': 'debug',
};

const processArgs = () => {
	const result = {
		jest: false,
		analyze: false,
		debug: false,
		environment: 'development',
    local: false,
		additionalArgs: [],
	};

	let args = (ARGS || []).slice(0);
	if (args.length) {
		Object.keys(ARG_MAP).forEach(key => {
			const idx = args.indexOf(key);
			if (idx !== -1) {
				if (typeof result[ARG_MAP[key]] === 'boolean') {
					result[ARG_MAP[key]] = true;
					args = [].concat(args.slice(0, idx), args.slice(idx+1));
				} else {
					result[ARG_MAP[key]] = args[idx + 1];
					args = [].concat(args.slice(0, idx), args.slice(idx+2));
				}
			}
		});
	}

	if (args.length) {
		result.additionalArgs = args.slice(0);
	}

	return result;
};

const OPTS = processArgs();

const execCommand = (cmd) => {
  const isLocal = COMMAND !== 'build' || OPTS.local === true;

	const options = {
		cwd: process.cwd(),
		env: {
			...process.env,
      NODE_ENV: isLocal ? 'development' : 'production',
      ENVIRONMENT: OPTS.environment,
			LOCAL: isLocal,
			JEST: OPTS.jest,
			ANALYZE: OPTS.analyze,
			CLI_ROOT,
			PROJ_ROOT,
		},
		stdio: 'inherit'
	};

  if (OPTS.environment === 'jest') {
    options.env.NODE_ENV = 'test';
  }

	const [ runCMD, ...runARGS ] = cmd.split(' ');
	const allArgs = [].concat(runARGS, OPTS.additionalArgs);

	if (OPTS.debug) {
		console.log(runCMD, ...allArgs);
	}

	const child = spawn(runCMD, allArgs, options);
	child.on('exit', code => process.exit(code));
};

const runServer = () => {
	const devServerPath = path.join(CLI_ROOT, 'node_modules/webpack-dev-server/bin/webpack-dev-server.js');
	const webpackConfigPath = path.join(CLI_ROOT, 'lib/webpack/index.js');

	return execCommand(`node ${devServerPath} --config ${webpackConfigPath}`);
};

const runLinter = () => {
	console.log("CLI_ROOT", CLI_ROOT);
	console.log("PROJ_ROOT", PROJ_ROOT);

	const eslintPath = path.join(PROJ_ROOT, 'node_modules/eslint/bin/eslint.js');
	const srcPath = path.join(PROJ_ROOT, 'src/**/*.[jt]s?(x)');
	const configPath = path.join(PROJ_ROOT, '.eslintrc.js');

  return execCommand(`node ${eslintPath} -c ${configPath} ${srcPath}`);
};

const runTypeCheck = () => {
	const tscPath = path.join(CLI_ROOT, 'node_modules/typescript/bin/tsc');

  return execCommand(`node ${tscPath} -p ${PROJ_ROOT} --noEmit`);
};

const runSonarLint = () => {
	const eslintPath = path.join(CLI_ROOT, 'node_modules/eslint/bin/eslint.js');
	const srcPath = path.join(PROJ_ROOT, 'src/**/*.[jt]s?(x)');
	const sonarPath = path.join(CLI_ROOT, 'node_modules/eslint-formatter-sonarqube');
	const output = path.join(PROJ_ROOT, 'linting-results.json');
	const ignore = path.join(PROJ_ROOT, '.gitignore');

  return execCommand(`node ${eslintPath} -f ${sonarPath} -o ${output} --ignore-path ${ignore} ${srcPath}`);
};

const runTests = () => {
	const jestPath = path.join(CLI_ROOT, 'node_modules/jest/bin/jest.js');
	const jestConfigPath = path.join(CLI_ROOT, 'lib/jest/jest.config.js');
	OPTS.environment = 'jest';
	OPTS.jest = true;

	return execCommand(`node ${jestPath} -c ${jestConfigPath}`);
};

const runTestCoverage = () => {
	const jestPath = path.join(CLI_ROOT, 'node_modules/jest/bin/jest.js');
	const jestConfigPath = path.join(CLI_ROOT, 'lib/jest/jest.config.js');
	OPTS.environment = 'jest';
	OPTS.jest = true;

	return execCommand(`node ${jestPath} -c ${jestConfigPath} --coverage`);
};

const runBuild = () => {
	const webpackPath = path.join(CLI_ROOT, 'node_modules/webpack/bin/webpack.js');
	const webpackConfigPath = path.join(CLI_ROOT, 'lib/webpack/index.js');

	return execCommand(`node ${webpackPath} --config ${webpackConfigPath}`);
};

const installEslint = () => {
	// const options = processArgs();

	/**
	 * install yarn packages for eslint
	 *
	 * yarn add eslint @typescript-eslint/eslint-plugin eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-import
	 *
	 * add .eslintrc.js file with
	 *  {
	 *		extends: './node_modules/@carvana/webcli/eslint-config.js'
	 *	}
	 */
};

const runHelp = () => {
	console.log('Commands:');
	Object.keys(COMMAND_MAP).forEach((key) => {
		console.log(`  ${key}`);
	});
	console.log('----------------');
};


const COMMAND_MAP = {
	'serve': runServer,
	'server': runServer,
	'lint': runLinter,
	'typecheck': runTypeCheck,
	'test': runTests,
	'coverage': runTestCoverage,
	'sonar': runSonarLint,
	'build': runBuild,
	'install-eslint': installEslint,
	'help': runHelp
};

console.log(`Carvana CLI Tool\nversion: ${PKG.version}\n`);

const START_TIME = Date.now();

const dispatchCommand = (cmd) => {
	if (COMMAND_MAP[cmd] != null) {
		return COMMAND_MAP[cmd]();
	}
	return 0;
};

process.on('exit', (code) => {
	if (code === 0) {
		const END_TIME = Date.now();
    console.log(`✨  Carvana CLI Finished ${((END_TIME-START_TIME)/1000).toFixed(2)} Seconds`);
	} else {
		console.log(`Carvana CLI exited with code ${code}`);
	}
});

dispatchCommand(COMMAND);


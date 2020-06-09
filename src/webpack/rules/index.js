
const scripts = require('./scripts');
const styles = require('./styles');
const templates = require('./templates');
const fonts = require('./fonts');
const images = require('./images');

module.exports = (opts) => {
	const rules = [
		...scripts(opts),
		...styles(opts),
		...templates(opts),
		...fonts(opts),
		...images(opts)
	];
	
	return rules;
};

var path = require('path');

/**
 * Handlebar helper.
 */

module.exports = function(current, target) {
	if(!current || !target){
		return '';
	}
	current = path.normalize(current).slice(0);
	target = path.normalize(target).slice(0);
	current = path.dirname(current);
	return path.relative(current, target).replace(/\\/g, '/');
};

var path = require('path');

/**
 * Handlebar helper.
 */

module.exports = function(current, target, options){
	if(!current || !target){
		return '';
	}
	current = path.normalize(current).replace(/\\/g, '/').replace(/^(.*)\.html$/g, '$1/');
	target = path.normalize(target).replace(/\\/g, '/').replace(/^(.*)\.html$/g, '$1/');

	if (current.startsWith(target)) {
		return options.fn(this);
	}
	else {
		return options.inverse(this);
	}
};

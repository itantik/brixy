var path = require('./relativePath.js');

/**
 * Expose handlebar helper.
 */

module.exports = function(navPath, options){
	return options.fn(this).replace(/href="API_LINK\//g, 'class="api-link" href="' + path(navPath, '../API/') + '/');
};

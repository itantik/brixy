/**
 * Expose handlebar helper.
 */

module.exports = function(){
	var y = (new Date()).getFullYear();
	if (2015 != y)
		return '2015 - ' + y;
	return y;
};

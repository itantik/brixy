#include "../../../Brixy/includes/tester-launcher.jsxinc";

/**
 * Config properties:
 * {boolean} dialogOnFailure .. Shows the report dialog when test fails. Default is true.
 * {int} comparisonDepth .. Nesting level of the comparison of the objects. Default is 10.
 * {Object} assertLibrary .. Custom assert library. Default is 'brixy.tester.It'.
 * Any custom properties. In job file you will get each value via tester.getConfig('myOption').
 */
tester.run(File($.fileName).parent, {
	// Tester's configuration
	dialogOnFailure: true,
	//comparisonDepth: 10,

	// custom options
	appPath: File($.fileName).parent + '/../' // path to root application folder
});

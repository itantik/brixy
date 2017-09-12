<*:Don't use the backslash in path, instead, even on Windows use the forward slash.:><*:
In job files you can use tester.getConfig('appPath') as a relative path to application folder.:>
#include "<!:Path to Brixy folder:>/includes/tester-launcher.jsxinc";

/**
* Config properties:
* {boolean} dialogOnFailure .. Shows the report dialog when test fails. Default is true.
* {int} comparisonDepth .. Nesting level of the comparison of the objects. Default is 10.
* {Object} assertLibrary .. Custom assert library. Default is 'brixy.tester.It'.
* Any custom properties. In job file you will get each value via tester.getConfig('myOption').
*/
tester.run(File($.fileName).parent + '/<:Relative path to job folder:>', {
	// Tester's configuration
	dialogOnFailure: <if:Show dialog on error:>true<else::>false<end::>,
	//comparisonDepth: 10,

	// custom options
	<if:Relative path to root application folder:>appPath: File($.fileName).parent + '/<:Relative path to root application folder:>' // path to root application folder<end::>
});
<filename::>Tester.jsx<end::>
<*:Save as config.jsxinc to the main application folder.
:><*:In a persistent engine, setting ID prevents the creation of duplicate applications.
:><*:Autorun request is required as the first request, which the application automatically processes.
:>
// release exception reporter
BX.use('brixy', 'includes/releaseErrorReporter.jsxinc');

// application modules
BX.use('app'); // includes all files in 'app' folder

// create application
BX.apps.add({
<if:Application ID:>	id: '<:Application ID:>', // does not create a duplicate application with the same id (in a persistent engine)
<end::>
<if:Autorun request:>	autorun: '<:Autorun request:>',<else::>//	autorun: 'first.request',<end::>

	routes: {
	},

	events: {
	},

	services: {
	}
});
<title:Autorun request=Autorun request (route or module name of the first controller):>
<filename::>config.jsxinc<end::>
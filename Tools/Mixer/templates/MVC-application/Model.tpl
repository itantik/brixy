/**
* Module '<:Module name:>'
* 
* <if:Author:>@author <:Author:><end::>
*/
BX.module.define('<!:Module name:>', function() {
	
	function <!:Class name:>(<each:Inject dependencies:><:Inject dependencies:><separator:, :><end::>) {
		<if:Inject dependencies:>
		// injected dependencies<each:Inject dependencies:>
		this.<:Inject dependencies:> = <:Inject dependencies:>;<end::><end::>
	}
	<if:Inject dependencies:>
	// list of dependencies
	<:Class name:>.injection = [<each:Inject dependencies:>'<:Inject dependencies:>'<separator:, :><end::>];
	<end::>
	
	// publish
	return {
		Me: <:Class name:>
	};
});
<filename::><:Class name:>.jsxinc<end::>
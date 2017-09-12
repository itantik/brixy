<*:New controller is a subclass of the Controller.:>
/**
* Module '<:Module name of this controller:>'
* 
* <if:Author:>@author <:Author:><end::>
*/
BX.module.define('<!:Module name of this controller:>', function() {
	var MvcController = BX.module.Me('brixy.mvc.Controller');
	
	function <!:Class name of this controller:>(<each:Inject dependencies:><:Inject dependencies:><separator:, :><end::>) {
		MvcController.call(this); // parent constructor
		
		<if:Inject dependencies:>// injected dependencies<each:Inject dependencies:>
		this.<:Inject dependencies:> = <:Inject dependencies:>;<end::><end::>
	}
	
	BX.subclass(<:Class name of this controller:>, MvcController); // subclassing
	<if:Inject dependencies:>
	// list of dependencies
	<:Class name of this controller:>.injection = [<each:Inject dependencies:>'<:Inject dependencies:>'<separator:, :><end::>];
	<end::>
	/**
	* Default action of this controller.
	* @param {Object|null} [data] - Action data. (optional)
	* @return {string} - Next application request.
	*/
	<:Class name of this controller:>.prototype.actionDefault = function (data) {
		// set view
		<if:Default view (module name):>this.setView('<:Default view (module name):>'/*, arguments */);
		<else::>//this.setView('app.MyView', param);<end::>
		
		// next request
		//return 'request';
	};
	<each:Handlers:>
	/**
	* Handles the response of the view.
	* @param {View} - View.
	* @return {string} - Next application request.
	*/
	<:Class name of this controller:>.prototype.handle<:Handlers:> = function (view) {
		
		// next request
		//return 'request';
	};
	<end::>
	
	// publish the class
	return {
		Me: <:Class name of this controller:>
	};
});
<filename::><:Class name of this controller:>.jsxinc<end::>
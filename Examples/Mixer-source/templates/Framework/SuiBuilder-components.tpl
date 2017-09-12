/**
* Module '<:Module name:>'
* Defines components for SuiBuilder.
* 
* <if:Author:>@author <:Author:><end::>
*/
BX.module.define('<!:Module name:>', function() {

	// publish
	return {
	<each:Names of components:>
		<:Names of components:>: function(/* your arguments */) {
			var bu = this.builder,
				el = this.element,
				co = this.container;
			
			// do something with element or add a new component to container
			
		}<separator:,:>
	<end::>
	};
});

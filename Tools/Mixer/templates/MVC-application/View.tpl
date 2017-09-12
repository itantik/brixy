<*:New view is a subclass of the View.:>
BX.use('brixy', 'modules/mvc/View.jsxinc');
<if:Use SuiBuilder:>BX.use('brixy', 'includes/suiBuilderPack.jsxinc');
<end::>
/**
* Module '<:Module name of this view:>'
* 
* <if:Author:>@author <:Author:><end::>
*/
BX.module.define('<!:Module name of this view:>', function() {
	var MvcView = BX.module.Me('brixy.mvc.View');
	
	function <!:Class name of this view:>() {
		MvcView.call(this); // parent constructor
	}
	
	BX.subclass(<:Class name of this view:>, MvcView); // subclassing
	
	/**
	* Renders the view.
	* @return {string} - Next controller handler.
	*/
	<:Class name of this view:>.prototype.render = function( /* arguments */ ) {
		<if:Use SuiBuilder:>var Sui = BX.module.Me('brixy.ui.SuiBuilder'),
			b = new Sui();
		<if:Custom SuiBuilder components:>
		b.addComponents(components);
		<end::>
		b.window('dialog', 'Title')
			.row().alignChildren('top')
				.rowPanel()
					.staticText('Sample field:')
					.editText()
					.end()
				.column().alignChildren('fill')
					.button('OK').closeOnClick(true, 1)
					.button('Cancel').closeOnClick(false, 0)
		.showWindow();
		
		switch (b.result()) {
		case 1:
			// your code
			//return 'Submit'; // next controller handler
			break;
		default:
			return ''; // exit
		}
		<end::>
	};
	<if:Custom SuiBuilder components:>
	// custom SuiBuilder components
	var components = {<each:Custom SuiBuilder components:>
		
		<:Custom SuiBuilder components:>: function(/* arguments */) {
			var el = this.element,
				co = this.container;
			
			// do something with element or add a new component to container
			
		}<separator:,:><end::>
	};
	<end::>
	
	// publish
	return {
		Me: <:Class name of this view:>
	};
});
<filename::><:Class name of this view:>.jsxinc<end::>

// core library
#include '../../Brixy/includes/Brixy.jsxinc'

// SuiBuilder modules and core components
#include '../../Brixy/includes/suiBuilderPack.jsxinc'

// load module
var SuiBuilder = BX.module.Me('brixy.ui.SuiBuilder');

// create SuiBuilder's instance
var b = new SuiBuilder();

// create Window
b.window('dialog', 'Hello World')
	.row()
		.staticText('Hello World!')
		.button('OK')
	// show window
	.showWindow();

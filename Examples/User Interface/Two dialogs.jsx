
// core library
#include '../../Brixy/includes/Brixy.jsxinc'

// SuiBuilder modules and core components
#include '../../Brixy/includes/suiBuilderPack.jsxinc'

// load module
var SuiBuilder = BX.module.Me('brixy.ui.SuiBuilder');

// create SuiBuilder's instance
var dial = new SuiBuilder();

// create Window
dial.window('dialog', 'Personal data')
	.row().alignChildren('top')
		// left column
		.columnPanel()
			.row()
				.staticText('Your name:').labelFor('name')
				.editText('{properties:{readonly: true}}').set('characters', 20).id('name')
				.button('Change...').set('onClick', nameDialog)
				.end()
			.end()
		// buttons
		.column()
			.button('OK')
	// show window
	.showWindow();


// show the second dialog
function nameDialog() {
	var b = new SuiBuilder();
	// create Window
	b.window('dialog', 'Enter new name')
		.row().alignChildren('top')
			// left column
			.columnPanel().alignChildren('right')
				.row()
					.staticText('First name:').labelFor('first')
					.editText().set('characters', 20).id('first')
					.end()
				.row()
					.staticText('Surname:').labelFor('last')
					.editText().set('characters', 20).id('last')
					.end()
				.end()
			// buttons
			.column().alignChildren('fill')
				.button('OK').closeOnClick(true, 10)
				.button('Cancel')
		// show window
		.showWindow();
	
	// handle result
	switch (b.result()) {
	case 10:
		var first = b.get('first').text.replace(/^\s*(.*?)\s*$/g, '$1'); // trim spaces
		var last = b.get('last').text.replace(/^\s*(.*?)\s*$/g, '$1'); // trim spaces
		dial.get('name').text = (first ? first + ' ' : '') + last;
		break;
	}
}


// core library
#include '../../Brixy/includes/Brixy.jsxinc'

// SuiBuilder modules and core components
#include '../../Brixy/includes/suiBuilderPack.jsxinc'

// load module
var SuiBuilder = BX.module.Me('brixy.ui.SuiBuilder');

// create SuiBuilder's instance
var b = new SuiBuilder();

// create Window
b.window('dialog', 'Sample dialog')
	.row().alignChildren('top')
		// left column
		.columnPanel().alignChildren('left')
			.row()
				.staticText('Required value:')
				.editText().set('characters', 10).validator('required')
				.end()
			.row()
				.staticText('Leave empty:')
				.editText('remove me').set('characters', 10).validator('!required')
				.end()
			.row()
				.staticText('Integer from 0 to 10:')
				.editText().set('characters', 10).validator('range', 'text', 0, 10).validator('isinteger')
				.end()
			.staticText('Select:')
			.column().set('indent', 30).alignChildren('left').validator('itemselected', 'children')
				.radioButton('fruit')
				.radioButton('vegetables')
				.end()
			.row()
				.staticText('Color:')
				.dropDownList(['red', 'blue', 'yellow', 'black', 'white']).validator('required', 'selection', 'Please select the color.')
					.end()
				.end()
			.row().alignChildren('top')
				.staticText('City:')
				.listBox().validator('required', 'selection', 'Please select the city.')
					.item('New York')
					.item('Paris')
					.item('Singapore')
					.item('Sydney')
					.item('Tokio')
					.end()
				.end()
			.end()
		// buttons
		.column().alignChildren('fill')
			.button('Validate and close').closeOnClick(true, 10)
			.button('Close').closeOnClick(false, 11)
			.button('Cancel')
	// show window
	.showWindow();

// handle result
switch (b.result()) {
case 10:
	alert('Window closed. Validation passed.');
	break;
case 11:
	alert('Window closed. Validation is not required.');
	break;
}

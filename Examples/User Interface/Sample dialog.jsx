
// core library
#include '../../Brixy/includes/Brixy.jsxinc'

// SuiBuilder modules and core components
#include '../../Brixy/includes/suiBuilderPack.jsxinc'

// load module
var SuiBuilder = BX.module.Me('brixy.ui.SuiBuilder');

// define custom SuiBuilder components
var components = {
	myField: function (label, id) {
		this.builder.row()
			.staticText(label).set('characters', 14).labelFor(id)
			.editText().set('characters', 20).id(id)
			.end();
	}
};

// create SuiBuilder's instance
var b = new SuiBuilder();

// add custom components
b.addComponents(components);

// create Window
b.window('dialog', 'Sample dialog')
	.row().alignChildren('top')
		// left column
		.column().alignChildren('fill')
			.columnPanel().alignChildren('left')
				.row()
					.staticText('Your name:').labelFor('name')
					.editText().set('characters', 20).id('name')
					.button('Hello').set('onClick', function(){
						var name = b.get('name').text;
						alert(name ? 'Hello ' + name + '!' : 'Your name is not filled.');
					})
					.end()
				.checkbox('checkbox')
				.staticText('Radio group:')
				.column().set('indent', 30).alignChildren('left')
					.radioButton('first')
					.radioButton('second')
					.radioButton('third')
					.end()
				.dropDownList(['Drop-down list','-','one', 'two', 'three', 'four', 'five']).set('selection', 0)
					.item('six')
					.item('seven')
					.end()
				.end()
			.columnPanel('Custom components:').set('indent', 30)
				.myField('Favorite food:', 'my1')
				.myField('Drink:', 'my2')
				.end()
			.end()
		// buttons
		.column().alignChildren('fill')
			.button('OK').closeOnClick(false, 10)
			.button('Cancel')
	// show window
	.showWindow();

// handle result
switch (b.result()) {
case 10:
	var name = b.get('name').text;
	alert('Window closed.\n\nYour name is ' + (name ? name : 'not filled') + '.');
	break;
}


// core library
#include '../../Brixy/includes/Brixy.jsxinc'

// Debug modules
#include '../../Brixy/includes/debugPack.jsxinc'

// SuiBuilder modules and core components
#include '../../Brixy/includes/suiBuilderPack.jsxinc'

// initial records
BX.debug.summary.shot('On start');
BX.debug.timer.shot('From the start');

// test object
var test = {
	name: 'Test object',
	list: ['one', 'two', 'three', 'four', 'five', [1, 2, 3], {color: 'gold', temperature: 100}],
	children: {
		son: {
			name: 'Jim',
			age: 12
		},
		daughter: {
			name: 'Alice',
			age: 11
		}
	}
};

// load SuiBuilder module
var SuiBuilder = BX.module.Me('brixy.ui.SuiBuilder');

// create builder instance
var b = new SuiBuilder();

// create Window
b.window('dialog', 'Debug Tools')
	.row().alignChildren('top')
		// left column
		.columnPanel().alignChildren('fill')
			.button('Dump this button').set('onClick', function(){
				BX.debug.dump(this, 3);
			})
			.button('Dump the test object').set('onClick', function(){
				BX.debug.dump(test, 3);
			})
			.button('Call stack').set('onClick', function(){
				BX.debug.callStack();
			})
			.button('Timer').set('onClick', function(){
				BX.debug.timer.shot('From the start');
				BX.debug.timer.report(false);
			})
			.button('Summary').set('onClick', function(){
				BX.debug.summary.shot('On click');
				BX.debug.summary.report(false);
			})
			.button('System info').set('onClick', function(){
				BX.debug.showSystemInfo();
			})
			.end()
		// buttons
		.column()
			.button('OK')
	// show window
	.showWindow();

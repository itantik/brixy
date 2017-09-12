
// core library
#include '../../Brixy/includes/Brixy.jsxinc'

// SuiBuilder modules and core components
#include '../../Brixy/includes/suiBuilderPack.jsxinc'

// load debug reporter
BX.use('brixy', 'modules/err/DebugReporter.jsxinc');
// add to BX.error reporters
BX.error.addReporter('brixy.err.DebugReporter');

// load SuiBuilder module
var SuiBuilder = BX.module.Me('brixy.ui.SuiBuilder');

// create SuiBuilder's instance
var b = new SuiBuilder();

// create Window
b.window('dialog', 'Error chaining')
	.button('Simulate error...').set('onClick', simulateError)
	// show window
	.showWindow();


// invoke and catch error
function simulateError() {
	try {
		main();
	}
	catch (e) {
		// report errors
		BX.error.report(e);
	}
}

// helper methods
function main() {
	try {
		method1();
	}
	catch (e) {
		throw BX.error('main()', Error('Method failed.'), e);
	}
}
function method1() {
	try {
		method2();
	}
	catch (e) {
		throw BX.error('method1()', Error('Method failed.'), e);
	}
}
function method2() {
	try {
		method3();
	}
	catch (e) {
		throw BX.error('method2()', Error('Method failed.'), e);
	}
}
function method3() {
	var variable;
	try {
		variable.notDefinedMethod();
	}
	catch (e) {
		throw BX.error('method3()', Error('Method failed.'), e);
	}
}

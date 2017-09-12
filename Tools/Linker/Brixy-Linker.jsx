
// MVC application launcher
/**
 * Include this file into your main script file. You should pass the main script file to launch() method, e.g. `launch($.fileName)`.
 */

 var launch = launch || function (appFile) {

// core library
// Brixy core BX namespace.
/**
* Core namespace of the Brixy framework.
* @namespace BX
* @author Stanislav Antos
* @version 1.0.0
*/
var BX = BX || {
	
	
	/**
	* Returns a string representation of the object in the form of `"[object ClassName]"`.  
	* Base Extend Script `Object.prototype.toString()` method doesn't distinguish the type and always returns `"[object Object]"`.
	* @memberOf BX
	* @return {string}
	*/
	toString: function() {
		var n = this.constructor.name;
		return '[object ' + (n === 'anonymous' ? 'Object' : n) + ']';
	},

	/**
	* Subclassing. Adds the prototype of the parent class to the child class.  
	* `BX.subclass()` should be called before adding of child's prototype methods and properties.
	* 
	* @example
	* // parent class
	* function Parent(surname) {
	* 	this._surname = surname;
	* }
	* Parent.prototype.getSurname = function() {
	* 	return this._surname;
	* };
	* 
	* // subclass
	* function Child(name, surname) {
	* 	// you may call the Parent constructor (if needed)
	* 	Parent.call(this, surname);
	* 	this._name = name;
	* }
	* BX.subclass(Child, Parent); // subclassing
	* Child.prototype.getName = function() {
	* 	return this._name + ' ' + this._surname;
	* 	// or you may directly call the Parent method
	* 	return this._name + ' ' + Parent.prototype.getSurname.call(this);
	* };
	* 
	* @memberOf BX
	* @param {Function} Child
	* @param {Function} Parent
	*/
	subclass: function (Child, Parent) {
		var F = function() {};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;	
	},
	
	/**
	* Evaluates the file.
	* @memberOf BX
	* @param {File} file
	*/
	evalFile: function (file) {
		$.evalFile(file);
	}
};

/**
* @namespace BX.error
*/
BX.error || (function() {
	
	/**
	* ErrorItem object.
	* @class
	* @alias BX.error.ErrorItem
	* 
	* @property {string} location - Name of the module or method where the error has occurred.
	* @property {string} message - Description of the error.
	* @property {int} line - Line number where the error occured.
	* @property {string} fileName - Name of the source file.
	* 
	* @param {string} location - Name of the module or method where the error has occurred.
	* @param {Error|string} error - Description of the error.
	* @param {Error|string} [primeError] - A prime error that caused this exception. (optional)
	*/
	function ErrorItem(location, error, primeError) {
		var m = '',
			l,
			f;
			
		if (error) {
			if (error instanceof Error || error instanceof ErrorItem) {
				l = error.line;
				f = error.fileName;
				m = error.message;
			}
			else
				m = m + error; // convert to string
		}
		
		if (primeError) {
			m = m ? m + '\n' + primeError : primeError;
			
			if (primeError instanceof Error) { // raw error that caused the exception
				l = primeError.line;
				f = primeError.fileName;
			}
		}
		
		this.location = location;
		this.message = m;
		this.line = l;
		this.fileName = f;
	}
	
	/**
	* Returns the error string.
	* @return {string}
	*/
	ErrorItem.prototype.toString = function() {
		var f = this.fileName ? decodeURI(this.fileName) : '';
		
		return (this.location ? '-> ' + this.location + ':' : '') 
			+ (this.message ? '\n' + this.message : '') 
			+ (f ? '\nFile: ' + f.substr(f.lastIndexOf('/') + 1) : '') 
			+ (this.line ? '\nLine: ' + this.line : '');
	};
	
	/**
	* ErrorChain object wraps a chain of errors. Creation of the ErrorChain instance is possible without **new** keyword.  
	* There is available method `BX.error()` as a shortcut to `BX.error.ErrorChain()`.
	* 
	* @example <caption>Example 1:</caption>
	* throw BX.error('Application.run()', 'Run method failed.', Error('Something is wrong.'));
	* 
	* @example <caption>Example 2 - without the third parameter:</caption>
	* throw BX.error('Application.run()', 'Run method failed.');
	* // or better:
	* throw BX.error('Application.run()', Error('Run method failed.')); // Error object captures the line number and file name
	* 
	* @example <caption>Example 3 - try/catch block:</caption>
	* try {
	* 	// ...
	* }
	* catch (e) {
	* 	throw BX.error('Application.run()', Error('Run method failed.'), e); // chaining of the errors
	* }
	* 
	* @class
	* @alias BX.error.ErrorChain
	* @param {string} location - Name of the module or method where the error has occurred.
	* @param {Error|string} error - Description of the error.
	* @param {BX.error.ErrorChain|Error|string} [primeError] - A prime error that caused this exception. (optional)
	*/
	function ErrorChain(location, error, primeError) {
		if (primeError && typeof primeError.addError === 'function') { // error chaining (primeError may not be subclass of ErrorChain)
			primeError.addError(location, error);
			return primeError;
		}
		
		if (!(this instanceof ErrorChain)) // ErrorChain is called without 'new' keyword
			return new ErrorChain(location, error, primeError);
			
		this._errors = [];
		this._callStack = $.stack;
		this.addError(location, error, primeError);
	}
	
	/**
	* Adds new error to error list.
	* @param {string} location - Name of the module or method where the error has occurred.
	* @param {Error|string} error - Description of the error.
	* @param {BX.error.ErrorChain|Error|string} [primeError] - A prime error that caused this exception. (optional)
	*/
	ErrorChain.prototype.addError = function(location, error, primeError) {
		if (location || error)
			this._errors.push(new BX.error.ErrorItem(location, error, primeError));
	};
	
	/**
	* Returns call stack.
	* @return {string}
	*/
	ErrorChain.prototype.getCallStack = function() {
		return this._callStack;
	};
	
	/**
	* Returns error list.
	* @return {Array}
	*/
	ErrorChain.prototype.getErrors = function() {
		return this._errors;
	};
	
	/**
	* Returns the original error that caused the exception.
	* @return {BX.error.ErrorItem|null}
	*/
	ErrorChain.prototype.getPrimeError = function() {
		return this._errors.length ? this._errors[0] : null;
	};
	
	/**
	* Returns the error string.
	* @return {string}
	*/
	ErrorChain.prototype.toString = function() {
		return 'Error occured:\n\n' + (this._errors ? this._errors.join('\n\n') : '');
	};
	
	BX.error.ErrorChain = BX.error = ErrorChain;
	
	BX.error.ErrorItem = ErrorItem;
	
	// registered error reporters
	var _reporters = [];
	
	/**
	* Reports an error issue. Calls method `report(err)` on all registered reporters.
	* @param {*} err - Error object or message.
	*/
	BX.error.report = function(err) {
		if (err == undefined)
			return;
		
		var passed = false,
			hasOwn = Object.prototype.hasOwnProperty,
			r,
			i = 0,
			n = _reporters.length;
		
		// try to process at least one reporter
		for ( ; i < n; i++) {
			try {
				if (!hasOwn.call(_reporters, i))
					continue;
				r = _reporters[i];
				if (typeof r === 'string')
					r = BX.module(r).Me;
				if (typeof r === 'function')
					r = new r();
				r.report(err);
				passed || (passed = true);
			}
			catch (e) {
			}
		}
		
		if (!passed) // none reporter processed
			alert(err);
	};
	
	/**
	* Adds an error reporter. Reporter should have `report(err)` method.
	* @param {Object|Function|string} reporter - Reporter object or constructor or module name.
	*/
	BX.error.addReporter = function(reporter) {
		_reporters.push(reporter);
	};

})();

/**
* Module system.
* @namespace BX.module
*/
BX.module || (function() {

	var _modules = {};

	/**
	* Returns instance of the module.
	* If instance is defined as a creation function, it is invoked only on the first call of the get() method.
	* There is available method BX.module() as a shortcut to BX.module.module().
	* @memberOf BX.module
	* @param {string} name - Name of the module.
	* @return {*}
	*/
	function module(name) {
		try {
			if (!_modules.hasOwnProperty(name))
				throw Error('Module "' + name + '" is not defined.');

			return _modules[name].get();
		}
		catch (e) {
			throw new BX.error('BX.module()', Error('Cannot load module "' + name + '".'), e);
		}
	}

	/**
	 * Adds new module.
	 * @memberOf BX.module
	 * @method define
	 * @param {string} name - Name of the module.
	 * @param {*} factory - Module object or factory function.
	 * @param {string} [rewriteMode='error'] - How to redefine module if it already exists: `'error'` = throw an exception (default), `'skip'` = keep the old definition, `'rewrite'` = rewrite the old definition.
	 */
	module.define = function(name, factory, rewriteMode) {
		if (_modules.hasOwnProperty(name)) {
			switch (rewriteMode || 'error') {
				case 'skip':
					return;
				case 'error':
					throw new BX.error('BX.module.define()', 'Cannot define module.', Error('Module "' + name + '" already exists.'));
					break;
				case 'rewrite':
					break;
				default:
					throw new BX.error('BX.module.define()', 'Cannot properly redefine existing module "' + name + '". Unknown rewrite mode.');
			}
		}

		_modules[name] = new BX.module.Module(factory);
	};

	/**
	* Checks if the module exists.
	* @memberOf BX.module
	* @method exists
	* @param {string} name - Name of the module.
	* @return {boolean}
	*/
	module.exists = function(name) {
		return _modules.hasOwnProperty(name);
	};

	/**
	* Returns the list of the module names.
	* @memberOf BX.module
	* @method list
	* @return {Array}
	*/
	module.list = function() {
		var l = [];

		for (var m in _modules) {
			if (_modules.hasOwnProperty(m))
				l.push(m);
		}

		return l;
	};

	/**
	* Returns the property Me of the module.
	* Property Me should hold the constructor of the object wrapped by this module.
	* @memberOf BX.module
	* @method Me
	* @param {string} name - Module name.
	* @return {Function}
	* @throws Exception if module.Me is missing or is not a Function.
	*/
	module.Me = function(name) {
		var m = module(name);

		if (!m.hasOwnProperty('Me'))
			throw Error('Missing property "Me" of the module "' + name + '".');

		if (typeof m.Me !== 'function')
			throw Error('Property "Me" of the module "' + name + '" should be a Function.');

		return m.Me;
	};

	BX.module.module = BX.module = module;
})();

BX.module.Module || (function() {
	
	/**
	* Module item.
	* @class
	* @alias BX.module.Module
	* @param {*} factory - Module object or factory function.
	*/
	function Module(factory) {
		this._instance = factory;
	}
	
	/**
	* Gets module object.
	* @return {*}
	*/
	Module.prototype.get = function() {
		if (typeof this._instance === "function") {
				this._instance = this._instance();
		}
		this.get = getInstance;
		return this.get();
	};
	
	function getInstance() {
		return this._instance;
	}
	
	/**
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	Module.prototype.toString = BX.toString;
	
	BX.module.Module = Module;
})();

// disposable launcher


	// self-destruction
	launch = undefined;

	try {
		// Brixy Linker assign the main script file to the _LINKER_SCRIPT_FILE_ variable
		var _LINKER_SCRIPT_FILE_ = appFile;



		// load MVC framework
// MVC modules
/**
* Additional methods for work with Extend Script types.
* 
* @module 'brixy.es.types'
*/
BX.module.define('brixy.es.types', function() {
	
	/**
	* Tests if the value is a type of string.
	* 
	* @memberOf module:'brixy.es.types'
	* @param {*} value - Value to check.
	* @return {boolean}
	*/
	function isString(value) {
		var t = typeof value;
		
		return (t === 'string' || (t === 'object' && value instanceof String));
	}
	
	/**
	* Tests if the value is a type of number.
	* 
	* @memberOf module:'brixy.es.types'
	* @param {*} value - Value to check.
	* @return {boolean}
	*/
	function isNumber(value) {
		var t = typeof value;
		
		return (t === 'number' || (t === 'object' && value instanceof Number));
	}
	
	/**
	* Tests if the value is a type of boolean.
	* 
	* @memberOf module:'brixy.es.types'
	* @param {*} value - Value to check.
	* @return {boolean}
	*/
	function isBoolean(value) {
		var t = typeof value;
		
		return (t === 'boolean' || (t === 'object' && value instanceof Boolean));
	}
	
	/**
	* Returns the base type of the value.
	* 
	* @memberOf module:'brixy.es.types'
	* @param {*} value - Value to check.
	* @return {string}
	*/
	function baseType(value) {
		var t = typeof value,
			c = '';
		
		if (value == undefined) // undefined or null
			return 'undefined';
			
		if (t === 'object')
			c = value.constructor.name;
			
		if (t === 'string' || c === 'String')
			return 'string';
		if (t === 'number' || c === 'Number')
			return 'number';
		if (t === 'boolean' || c === 'Boolean')
			return 'boolean';
		if (c === 'Array') // doesn't check 'Array like' objects
			return 'array';
		if (value instanceof RegExp) // duality: (typeof /reguar/ === 'function') versus (/regular/ instanceof RegExp === true)
			return 'object';
		
		return t; // function or object or xml
	}
	
	/**
	* Returns class name of the value.
	* 
	* @memberOf module:'brixy.es.types'
	* @param {*} value - Value to check.
	* @return {string}
	*/
	function className(value) {
		
		if (value === undefined)
			return 'undefined';
			
		if (value === null)
			return 'null';
		
		switch (typeof value) {
			case 'string': return 'String';
			case 'number': return 'Number';
			case 'boolean': return 'Boolean';
			case 'function': return (value instanceof RegExp) ? 'RegExp' : 'Function';
			case 'xml': return 'XML';
			case 'object': return value.constructor.name;
			default: return typeof value; // unknown
		}
	}
	
	/**
	* Returns string representation of the value.
	* 
	* @memberOf module:'brixy.es.types'
	* @param {*} value - Value.
	* @param {string} [asClass] - If applied, the result string is decorated as if it were a given class. (optional)
	* @return {string}
	*/
	function valueString(value, asClass) {
		
		var c = asClass || className(value);
		switch (c) {
			case 'undefined':
			case 'null': return c;
			case 'String': return '"' + value + '"';
			case 'Number': return value;
			case 'Boolean': return value ? 'true' : 'false';
			case 'Function': return 'function' + (value.name === 'anonymous' ? '' : ' ' + value.name) + '()';
			case 'XML': return value.toXMLString();
			default: return value.toString();
		}
	}
	
	/**
	* Escapes the special regular expression characters. Prepares a string for use within a regular expression.  
	* Thanks to [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).
	* 
	* @memberOf module:'brixy.es.types'
	* @param {string} str - Source string.
	* @return {string} - Escaped string.
	*/
	function escapeRegexpStr(str) {
		// return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
		return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}
	
	
	// publish
	return {
		isString: isString,
		isNumber: isNumber,
		isBoolean: isBoolean,
		baseType: baseType,
		className: className,
		valueString: valueString,
		escapeRegexpStr: escapeRegexpStr
	};	
});

/**
* @module 'brixy.di.Container'
*/
BX.module.define('brixy.di.Container', function() {
	var types = BX.module('brixy.es.types');
	
	/*
	* Service object holds an instance.
	* 
	* @class
	* @alias module:'brixy.di.Container'~Service
	* @param {string|Object} service - Service name or module name or instance or config object {type: name, injection: []}.
	*/
	function Service(service) {
		if (service != undefined && typeof service === 'object' && service.hasOwnProperty('type')) {
			this._instance = service.type;
			
			if (service.hasOwnProperty('injection'))
				this._injection = Array.prototype.concat(service.injection);
		}
		else
			this._instance = service;
	}
	
	/*
	* Returns instance.
	* 
	* @param {module:'brixy.di.Container'~Container} container
	* @return {Object}
	*/
	Service.prototype.get = function(container) {
		if (this._locked)
			throw Error('Too many attempts to create service. Try to check the circular reference.');
		
		this._locked = true; // object is in the building phase
		this._instance = container.getInstance(this._instance, this._injection);
		this._locked = undefined;
		delete this._locked;
		
		if (this._injection) {
			this._injection = undefined;
			delete this._injection;
		}
		
		this.get = getInstance;
		return this.get();
	};
	
	function getInstance() {
		return this._instance;
	}
	
	/**
	* Dependency injection container.
	* 
	* @class
	* @alias module:'brixy.di.Container'~Container
	*/
	function Container() {
		this._services = {};
	}
	
	/**
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	Container.prototype.toString = BX.toString;
	
	/**
	* Registers new service.
	* 
	* @param {string} name - Service name.
	* @param {*} service - Module name (module.Me must refer to the object constructor) or service name or config object or service object.
	* @throws Exception
	*/
	Container.prototype.registerService = function(name, service) {
		this._services[name + ''] = new Service(service);
	};
	
	/**
	* Registers new services.
	* 
	* @param {object} services
	* @throws Exception
	*/
	Container.prototype.registerServices = function(services) {
		if (services != undefined && typeof services !== 'object')
			throw BX.error('brixy.di.Container.registerServices()', Error('Object is expected but ' + typeof services + ' is given.'));
			
		for (var s in services) {
			if (services.hasOwnProperty(s))
				this.registerService(s, services[s]);
		}
	};
	
	/**
	* Returns a service object.
	* 
	* @param {string} name - Service name.
	* @return {Object}
	* @throws Exception
	*/
	Container.prototype.getService = function(name) {
		name += '';
		
		try {
			return this._services[name].get(this);
		}
		catch (e) {
			var er;
			if (this._services.hasOwnProperty(name))
				er = 'Cannot get service "' + name + '".';
			else
				er = 'Service "' + name + '" is missing.';
			throw BX.error('brixy.di.Container.getService()', Error(er), e);
		}
	};
	
	/**
	* Creates the instance of the Type. Injects all dependencies that are specified by `Type.injection` property.
	* Optionally the `injection` argument may replace some of them.
	* 
	* @param {Function} Type - Constructor.
	* @param {Array} [injection] - Forced injection. Defined members will replace the corresponding `Type.injection` members. (optional)
	* @return {Object} - Instance of the Type.
	* @throws Exception
	*/
	Container.prototype.instanceByType = function(Type, injection) {
		if (typeof Type !== 'function')
			throw BX.error('brixy.di.Container.instanceByType()', Error('Function is expected but ' + Type + ' is given.'));
		
		var args,
			i,
			n;
		
		if ('injection' in Type)
			args = Array.prototype.concat(Type.injection);
			
		if (injection != undefined)
			injection = Array.prototype.concat(injection);
		
		if (!args && !injection)
			return new Type();
		
		if (!args) {
			args = injection;
		}
		else if (injection) {
			for (i = 0, n = injection.length; i < n; i++) {
				if (injection[i] != undefined)
					args[i] = injection[i];
			}
		}
			
		try {
			for (i = 0, n = args.length; i < n; i++) {
				args[i] = this.getInstance(args[i]);
			}
			
			return createInstance(Type, args);
		}
		catch (e) {
			throw BX.error('brixy.di.Container.instanceByType()', Error('Creating of the ' + Type.name + ' instance failed.'), e);
		}
	};
	
	/**
	* Creates the instance of the service or module.
	* Injects all dependencies that are specified by the `Type.injection` property.
	* Optionally, in case of module name, the `injection` argument may replace some of them.
	* 
	* @param {string} name - Service or module name.
	* @param {Array} [injection] - Forced injection. Defined members will replace the corresponding `Type.injection` members. Not applicable for the service. (optional)
	* @return {Object} - Service or module instance.
	* @throws Exception
	*/
	Container.prototype.instanceByName = function(name, injection) {
		try {
			if (this._services.hasOwnProperty(name + '')) { // service
				if (injection != undefined)
					throw Error('Cannot inject arguments into service.');
					
				return this.getService(name);
			}

			var Type = BX.module.Me(name); // module
		}
		catch (e) {
			throw BX.error('brixy.di.Container.instanceByName()', Error('Creating of the "' + name + '" instance failed.'), e);
		}
		
		return this.instanceByType(Type, injection);
	};
	
	/*
	* Calls the constructor with arguments array.
	* 
	* @param {Function} Type - Object constructor.
	* @param {array} args - Constructor arguments.
	* @return {Object} - New instance of the Type object.
	*/
	function createInstance(Type, args) {
		var F = function() {
			Type.apply(this, args);
		};
		F.prototype = Type.prototype;
		return new F();
	}
	
	/**
	* Returns the instance of the subject.  
	* In case of creating a new instance, it injects all dependencies that are specified by the `SubjectType.injection` property.  
	* Optionally the `injection` argument may replace some of them.  
	* 
	* Types of the subject:  
	* 1. service name: creates/returns instance of the service (`injection` argument is not applied)  
	* 2. module name: property `module.Me` is used as constructor of a new instance  
	* 3. function: is used as constructor of a new instance  
	* 4. object: is returned unchanged (`injection` argument is not applied)
	* 
	* @param {*} subject - Service name or module name or constructor function or subject instance.
	* @param {Array} [injection] - Forced injection. Defined members will replace the corresponding `Type.injection` members. Not applicable for the service or object. (optional)
	* @return {Object} - Instance of the subject.
	* @throws Exception
	*/
	Container.prototype.getInstance = function(subject, injection) {

		if (types.isString(subject))
			return this.instanceByName(subject, injection);
			
		if (typeof subject === 'function')
			return this.instanceByType(subject, injection);
	
		if (injection != undefined)
			throw BX.error('brixy.di.Container.getInstance()', Error('Creating of the ' + subject + ' instance failed.'), Error('Cannot inject arguments into object.'));
			
		return subject;
	};
	
	
	// publish the class
	return {
		/** 
		* Dependency injection Container class.
		* @memberOf module:'brixy.di.Container'
		* @type {module:'brixy.di.Container'~Container}
		*/
		Me: Container
	};
});

/**
* @module 'brixy.mvc.Router'
*/
BX.module.define('brixy.mvc.Router', function() {
	var types = BX.module('brixy.es.types');
		
	/**
	* Route object.
	* @class
	* @alias module:'brixy.mvc.Router'~Route
	* @param {Object|string} [config] - Initial setting. (optional)
	*/
	function Route(config) {
		this.controller = '';
		this.forward = '';
		this.action = '';
		this.data = null;
		
		this.refine(config);
	}
	
	/**
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	Route.prototype.toString = BX.toString;
	
	/**
	* Refines properties of the route.
	* @param {Object|string} config - Object may refine properties 'controller', 'forward', 'action', 'data'. String refines 'forward' property.
	*/
	Route.prototype.refine = function(config) {
		if (config && types.isString(config)) {
			this.forward = config;
			return;
		}
		else if (typeof config !== 'object')
			return;
		
		config.controller && (this.controller = config.controller);
		config.forward && (this.forward = config.forward);
		config.action && (this.action = config.action);
		
		if (config.data && typeof config.data === 'object' && config.data !== this.data)
			fillDataProps(config.data, this);
	};
	
	// create new data object, copy properties (don't modify the saved router data)
	function fillDataProps(data, route) {
		var p,
			d = route.data;
			
		route.data = {};
		if (d) {
			for (p in d) {
				route.data[p] = d[p];
			}
		}
		
		for (p in data) {
			route.data[p] = data[p];
		}
	}
	
	/**
	* Gets a human readable string representation of this route.  
	* Note: This is not an inverse operation to the `parseRequestString()` method.
	* @return {string}
	*/
	Route.prototype.toHumanString = function() {
		var r = '';
		
		if (this.controller)
		 	r += this.controller;
		else if (this.forward)
		 	r += this.forward;
		 	
		if (this.action)
		 	r += Route._actionSeparator + this.action;
		
		if (this.data)
		 	r += Route._dataSeparator + '...';
		
		return r;
	};
	
	/**
	* Checks if route has a valid format (ie. looks like Route).
	* @param {Object|string} route - Route object. Property 'controller' or 'forward' is required. String is shortcut to {forward: route}.
	* @throws Exception if route has an invalid format.
	*/
	Route.validate = function(route) {
		if (route && types.isString(route))
			return;
			
		if (typeof route !== 'object')
			throw Error('Object type is expected.');
		
		if (!('controller' in route) && !('forward' in route))
		 	throw Error('Missing "controller" or "forward" property.');
	};
	
	/* Action separator used in the request string. */
	Route._actionSeparator = ':';
	
	/* Data separator used in the request string. */
	Route._dataSeparator = '?';
	
	/**
	* Parses the request string to route-like object.  
	* Request format: `"controller:action?data"`. Controller part is required.  
	* 
	* | Part of request | Description |
	* | --- | --- |
	* | controller | shall not contain characters `:` and `?` |
	* | action separator | default is `:` |
	* | action | shall not contain character `?` |
	* | data separator | default is `?` |
	* | data | set of properties and its values in the form `property1=value1&property2=value2` |
	* 
	* @example <caption>Valid request strings:</caption>
	* "controller"
	* "controller:action"
	* "controller:action?par1=value1"
	* "controller?par1=value1"
	* "controller:action?par1=value1&par2=value2"
	* "controller:action?par1&par2=value2"
	* @param {string} request
	* @return {Object} - {controller: string, action: string, data: Object|null}
	* @throws Exception if request has an invalid format.
	*/
	Route.parseRequestString = function(request) {
		var a = '',
			d = null,
			c = String(request),
			ra = types.escapeRegexpStr(Route._actionSeparator),
			rd = types.escapeRegexpStr(Route._dataSeparator),
			r = c.match(RegExp('^([^' + ra + rd + ']+?)(?:' + ra + '([^' + rd + ']*))?(?:' + rd + '(.*))?$'));
			
		if (r) {
			c = r[1];
			a = r[2] || '';
			
			if (r[3]) { // fill data properties
				d = {};
				
				r[3].replace(RegExp('([^=&]+)(?:=([^&]*))?', 'g'), function($0, $1, $2) {
					d[$1] = $2;
				});
			}
		}
		
		if (!c)
			throw Error('Bad request format. Controller or route name is not specified.');
			
		return {controller: c, action: a, data: d};
	};
	
	
	/**
	* Router object. It holds a repository of named routes.
	* @class
	* @alias module:'brixy.mvc.Router'~Router
	* @param {Function} [RouteType={@link module:'brixy.mvc.Router'~Route}] - route constructor (optional)
	* @throws Exception
	*/
	function Router(RouteType) {
		if (RouteType == undefined)
			this._Route = Route;
		else if (typeof RouteType !== 'function')
			Error('Route must be a function.');
		else
			this._Route = RouteType;
			
		this._routes = {}; // own routes
	}
	
	/**
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	Router.prototype.toString = BX.toString;
	
	/**
	* Saves a set of routes and replaces existing route set. The correct format is verified.
	* @param {Object} routes - Set of routes in the form `{name1: route1, name2: route2, ...}`.
	* @throws Exception if routes has an invalid format.
	*/
	Router.prototype.setRoutes = function(routes) {
		try {
			if (!routes || typeof routes !== 'object')
				throw Error('Object type is expected.');
		
			var validateR = this._Route.validate,
				r;
			
			if (validateR) { // need validation
				for (r in routes) {
					if (routes.hasOwnProperty(r))
						validateR(routes[r]);
				}
			}
			this._routes = routes;
		}
		catch (e) {
			throw BX.error('brixy.mvc.Router.setRoutes()', Error('Routes object has an invalid format.' + (r ? ' Route "' + r + '" failed.' : '')), e);
		}
	};
	
	/**
	* Adds a new route. The correct format is verified.
	* @param {string} name - Route name.
	* @param {Object} route - Route object.
	* @throws Exception if route has an invalid format.
	*/
	Router.prototype.addRoute = function(name, route) {
		try {
			if (!name)
				throw Error('Route name is expected.');
				
			this._Route.validate(route);
			this._routes[name] = route;
		}
		catch (e) {
			throw BX.error('brixy.mvc.Router.addRoute()', Error('Route "' + name + '" has an invalid format.'), e);
		}
	};
	
	/**
	* Removes the route.
	* @param {string} name - Route name.
	*/
	Router.prototype.removeRoute = function(name) {
		if (this.hasRoute(name)) {
			this._routes[name] = undefined;
			delete this._routes[name];
		}
	};
	
	/**
	* Gets a saved Route object or null.
	* @param {string} name - Route name.
	* @return {Object|null} Route object or null.
	*/
	Router.prototype.getRoute = function(name) {
		if (this.hasRoute(name)) {
			var R = this._Route;
			return new R(this._routes[name]);
		}
		return null;
	};
	
	/**
	* Checks if the router has a saved route of this name.
	* @param {string} name - Route name.
	* @return {boolean}
	*/
	Router.prototype.hasRoute = function(name) {
		return this._routes.hasOwnProperty(name);
	};
	
	/**
	* Creates the Route object from request. This one is not saved as named route.
	* @param {string|Object} request - Request string or route-like object.
	* @return {Object} Route object.
	* @throws Exception on error.
	*/
	Router.prototype.createRoute = function(request) {
		var R = this._Route;
		
		if (!types.isString(request)) {
			if (request instanceof R) // is Route
				return request;
			
			try {
				R.validate(request); // looks like Route
				return new R(request);
			}
			catch (e) {
				throw BX.error('brixy.mvc.Router.createRoute()', Error('Request "' + request + '" is not a valid object.'), e);
			}
		}
			
		var req,
			route;
		
		try {
			req = R.parseRequestString(request);
			route = this.getRoute(req.controller);
			
			if (route) {
				req.controller = '';
				route.refine(req);
			}
			else {
				route = new R(req);
			}
		}
		catch (e) {
			throw BX.error('brixy.mvc.Router.createRoute()', Error('Cannot create a route from the request "' + request + '".'), e);
		}
		
		return route;
	};
	
	
	// publish the class
	return {
		/** 
		* Route class.
		* @memberOf module:'brixy.mvc.Router'
		* @type {module:'brixy.mvc.Router'~Route}
		*/
		Route: Route,
		/** 
		* Router class.
		* @memberOf module:'brixy.mvc.Router'
		* @type {module:'brixy.mvc.Router'~Router}
		*/
		Me: Router
	};
});

/**
* @module 'brixy.mvc.Controller'
*/
BX.module.define('brixy.mvc.Controller', function() {
	var types = BX.module('brixy.es.types');
	
	/**
	* Base Controller object.
	* @class
	* @alias module:'brixy.mvc.Controller'~Controller
	*/
	function Controller() {
		this._renderConfig = {
			view: null,
			params: null
		};
	}
	
	/**
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	Controller.prototype.toString = BX.toString;

	/**
	* Sets the view and params.
	* @param {View|string} view
	* @param {...*} [arg1, arg2, ...] - Parameters will be passed to `view.render()` method. (optional)
	*/
	Controller.prototype.setView = function(view /*, arg1, arg2, ... */) {
		if (view == undefined) {
			this._renderConfig.view = null;
			this._renderConfig.params = null;
			return;
		}

		this._renderConfig.view = view;
		this._renderConfig.params = (arguments.length > 1) ? [].slice.call(arguments, 1) : null;
	};
	
	/**
	* Returns controller's view.
	* @return {Object}
	*/
	Controller.prototype.getView = function() {
		var c = this._renderConfig;
		if (types.isString(c.view))
			c.view = new (BX.module.Me(c.view))();
			
		return c.view;
	};
	
	/**
	* Returns parameters that will be passed to the view.
	* @return {Array}
	*/
	Controller.prototype.getRenderParams = function() {
		return this._renderConfig.params;
	};
	
	/**
	* Renders the view.  
	* View class has to define a render method:  
	* `View.prototype.render = function(arg1, ar2, ...) {...};`
	* 
	* @return {*} - Returns the result of the view.render() method.
	* @throws Exception
	*/
	Controller.prototype.renderView = function() {
		var r,
			view;
		
		try {
			view = this.getView();
			if (!view)
				return;
			
			r = view.render.apply(view, this.getRenderParams());
		}
		catch (e) {
			if (view) {
				if (!('render' in view))
					r = 'View ' + view + '.render() method is not defined.';
				else
					r = 'View ' + view + '.render() error.';
			}
			else
				r = 'Cannot create a view.';
			throw BX.error('brixy.mvc.Controller.renderView()', Error(r), e);
		}
		
		return r;
	};
	
	/**
	* Runs the action.  
	* Subclass has to define a method for each action:  
	* `Ctrl.prototype.actionName = function(data) {...};`
	* 
	* @param {string} [action='Default'] - Controller's action. (optional)
	* @param {*} [data] - Action data. (optional)
	* @return {string|Object} - Next application request.
	* @throws Exception
	*/
	Controller.prototype.run = function(action, data) {
		var h,
			act = (action ? 'action' + action : 'actionDefault'),
			next = '';
		
		try {
			try {
				// process action
				next = this[act](data);
			}
			catch (e) {
				var er;
				if (act in this)
					er = 'Action ' + this.toString() + '.' + act + '() failed.';
				else
					er = this.toString() + '.' + act + '() method is not defined.';
				throw BX.error('brixy.mvc.Controller.run()', Error(er), e);
			}
			
			// show view
			h = this.renderView();
			if (h) {
				// process handler
				next = this.processHandler(h, this.getView()) || next;
			}
			this.setView(null); // clear a render config (view and params)
		}
		catch (e) {
			throw BX.error('brixy.mvc.Controller.run()', Error('Controller ' + this.toString() + ' failed. '), e);
		}
		
		return next;
	};
	
	/**
	* Runs the controller's handler.  
	* Subclass has to define a method for each handler:  
	* `Ctrl.prototype.handleName = function(view) {...};`
	* 
	* @param {string} handler - Handler name.
	* @param {Object} view
	* @return {string} - Result of handler.
	* @throws Exception
	*/
	Controller.prototype.processHandler = function(handler, view) {
		if (!handler)
			return '';
			
		handler = 'handle' + handler;
		
		try {
			return this[handler](view);
		}
		catch (e) {
			var er;
			if (handler in this)
				er = 'Handler ' + this.toString() + '.' + handler + '() failed.';
			else
				er = handler + '() method is not defined.';
			throw BX.error('brixy.mvc.Controller.' + handler + '()', Error(er), e);
		}
	};
	

	// publish the class
	return {
		/** 
		* Base controller class.
		* @memberOf module:'brixy.mvc.Controller'
		* @type {module:'brixy.mvc.Controller'~Controller}
		*/
		Me: Controller
	};
});
/**
* @module 'brixy.mvc.Application'
*/
BX.module.define('brixy.mvc.Application', function() {
	
	/**
	* Application class.  
	* Configuration object may either be empty or may override any default application settings.  
	* - Dependency injection container = `config.container` or 'brixy.di.Container'  
	* - Collection of services `config.services` is registered in the DI container
	* - Request router = `config.requestRouter` or 'brixy.mvc.Router'  
	* - Collection of routes `config.routes` is registered in the request router
	* - Event router = `config.eventRouter` or 'brixy.mvc.Router'  
	* - Collection of events `config.events` is registered in the event router
	* 
	* @class
	* @alias module:'brixy.mvc.Application'~Application
	* @param {Object} config - Configuration object.
	*/
	function Application(config) {
		if (!config || typeof config !== 'object')
			config = {};
		
		// DI container
		var container = config.container || 'brixy.di.Container';
		switch (typeof container) {
			case 'string':
				container = new (BX.module(container).Me)();
				break;
			case 'function':
				container = new container();
				break;
		}
		
		if ('services' in config)
			container.registerServices(config.services);
		
		this._requestRouter = container.getInstance(config.requestRouter || 'brixy.mvc.Router');
		this._eventRouter = config.eventRouter || 'brixy.mvc.Router'; // lazy creating
		this._eventRouterCreated = false;
		this._container = container;
		
		if ('routes' in config)
			this._requestRouter.setRoutes(config.routes);
		
		if ('events' in config)
			this.getEventRouter().setRoutes(config.events);
	}
	
	/**
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	Application.prototype.toString = BX.toString;
	
	/**
	* Returns dependency injection container.
	* @return {Object}
	*/
	Application.prototype.getContainer = function() {
		return this._container;
	};
	
	/**
	* Returns request router.
	* @return {Object}
	*/
	Application.prototype.getRequestRouter = function() {
		return this._requestRouter;
	};
	
	/**
	* Returns event router.
	* @return {Object}
	*/
	Application.prototype.getEventRouter = function() {
		if (!this._eventRouterCreated) {
			this._eventRouter = this.getContainer().getInstance(this._eventRouter);
			this._eventRouterCreated = true;
		}
		return this._eventRouter;
	};
	
	/**
	* Processes the request. Tries to convert any request to a request route.
	* @param {string|Object} request - Request string or route object.
	* @param {string|Object} [sender] - Controller that sent this request. (optional)
	* @throws Exception
	*/
	Application.prototype.processRequest = function(request, sender) {
		if (!request)
			return;
		
		try {
			var next = request,
				route,
				router = this.getRequestRouter(),
				c;
			
			while (next) {
				route = router.createRoute(next);
				
				if (route.controller) {
					c = (route.controller === 'this') ? sender : route.controller;
					c = sender = this.getContainer().getInstance(c);
					
					try {
						next = c.run(route.action, route.data) || route.forward;
					}
					catch (ee) {
						if (c && ('run' in c) && (typeof c.run === "function"))
							throw ee;
						else
							throw Error('Controller\'s ' + c + '.run() method is not defined.');
					}
				}
				else if (route.forward) {
					next = router.createRoute(route.forward);
					next.refine({action: route.action, data: route.data});
				}
				else
					next = null;
			}
		}
		catch (e) {
			try {
				next = next.toHumanString();
			}
			catch (ee) {
			}
			throw new BX.error('brixy.mvc.Application.processRequest()', Error('Processing of the request "' + next + '" failed.'), e);
		}
	};
	
	/**
	* Gets event route and forwards it to `processRequest()` method. Only event routes, that are registered in the event router, are allowed. 
	* `AppManager.processEvent()` uses this method as an entry point into the application.
	* @param {string} event - Event name.
	* @param {Object} [data] - Application can pass the data to the event handler. (optional)
	* @throws Exception
	*/
	Application.prototype.processEvent = function(event, data) {
		if (!event)
			return;
			
		try {
			var route = this.getEventRouter().getRoute(event);
			
			if (!route) // only saved routes are processed
				return;
				
			if (!data || typeof data !== 'object')
				data = {};
			data.event = event + '';
			
			route.refine({data: data});
			
			// forward request
			this.processRequest(route);
		}
		catch (e) {
			throw new BX.error('brixy.mvc.Application.processEvent()', Error('Processing of the event "' + event + '" failed.'), e);
		}
	};
	
	/**
	* Returns true if application can process the event. Only event routes, that are registered in the event router, are allowed.
	* @param {string} event - Event name.
	* @return {boolean}
	*/
	Application.prototype.listensEvent = function(event) {
		try {
			return this.getEventRouter().hasRoute(event);
		}
		catch (e) {
			return false;
		}
	};
	
	
	// publish
	return {
		/** 
		* Application class.
		* @memberOf module:'brixy.mvc.Application'
		* @type {module:'brixy.mvc.Application'~Application}
		*/
		Me: Application
	};
});

// application container
/**
* @module 'brixy.mvc.AppManager'
*/
BX.module.define('brixy.mvc.AppManager', function() {
	
	/*
	* Configuration wrapper.
	* @class
	* @param {Object} config
	*/
	function AppConfig(config) {
		this._app = null;
		this._config = config;
	}
	
	/*
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	AppConfig.prototype.toString = BX.toString;
	
	/*
	* Returns application. Creates new one if it doesn't exist.
	* @return {Object} - instance of the application
	*/
	AppConfig.prototype.getApp = function() {
		if (!this._app) {
			var c = this._config,
				a = c.hasOwnProperty('application') ? c.application : 'brixy.mvc.Application';
			
			if (typeof a === 'function') { // constructor
				this._app = new a(c);
			}
			else { // module name
				a = BX.module(a);
				this._app = new a.Me(c);
			}
		}
		
		return this._app;
	};
	
	/*
	* Returns application ID.
	* @return {string}
	*/
	AppConfig.prototype.getId = function() {
		var c = this._config;
		return c.hasOwnProperty('id') ? c.id : '';
	};
	
	/*
	* Returns true if application can process the event.
	* @param {string} event - event name
	* @return {boolean}
	*/
	AppConfig.prototype.listensEvent = function(event) {
		if (this._app)
			return this._app.listensEvent(event);
		
		var c = this._config;
		return c.hasOwnProperty('events') && c.events.hasOwnProperty(event);
	};
	
	/**
	* AppManager class.
	* @class
	* @alias module:'brixy.mvc.AppManager'~AppManager
	*/
	function AppManager() {
		this._apps = [];
	}
	
	/**
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	AppManager.prototype.toString = BX.toString;
	
	/**
	* Saves the configuration of a new application. Application instance will be created on the first request.  
	* Application is a class of 'brixy.mvc.Application' or `config.application`.  
	* If `config.autorun` is passed, application runs immediately with it as the first request.  
	* Application with the specified `config.id` is added only once.
	* 
	* @param {Object} config - Configuration object is used to create application.
	* @throws Exception on error.
	*/
	AppManager.prototype.add = function(config) {
		if (config.hasOwnProperty('id') && this.exists(config.id))
			return;
		
		var c = new AppConfig(config);
		this._apps.push(c);
		
		if (!config.hasOwnProperty('autorun'))
			return;
		
		try {
			c.getApp().processRequest(config.autorun);
		}
		catch (e) {
			throw new BX.error('brixy.mvc.AppManager.add()', Error('Application' + (config.id ? ' "' + config.id + '" ' : ' ') + 'failed.'), e);
		}
	};
	
	/**
	* Returns an application with the given id.
	* 
	* @param {*} id - Application ID.
	* @return {Object|null}
	*/
	AppManager.prototype.get = function(id) {
		var c = this._getConfig(id);
		if (c)
			return c.getApp();
		
		return null;
	};
	
	/**
	* Checks if there exists an application with the given id.
	* 
	* @param {*} id - Application ID.
	* @return {boolean}
	*/
	AppManager.prototype.exists = function(id) {
		return this._getConfig(id) != null;
	};
	
	/*
	* Returns a config object with the given id.
	* 
	* @param {*} id - Application ID.
	* @return {object}
	*/
	AppManager.prototype._getConfig = function(id) {
		if (!id && id !== 0)
			return null;
			
		var c,
			apps = this._apps,
			i = 0,
			n = apps.length;
		
		for ( ; i < n; i++) {
			c = apps[i];
			
			if (c.getId() === id)
				return c;
		}
		return null;
	};
	
	/**
	* Passes the request to the application of the ID. If the ID doesn't exist, does nothing.
	* 
	* @param {*} id - Application ID.
	* @param {string|Object} request - Request string or route object.
	* @throws Exception on error.
	*/
	AppManager.prototype.processRequest = function(id, request) {
		try {
			var a = this.get(id);
			if (a)
				a.processRequest(request);
		}
		catch (e) {
			throw new BX.error('brixy.mvc.AppManager.processRequest()', Error('Application "' + id + '" failed.'), e);
		}
	};
	
	/**
	* Processes the event. Passes the event to each application that listens it.
	* @param {string} event - Event name.
	* @param {Object} data - Application will pass the data to the event handler. (optional)
	*/
	AppManager.prototype.processEvent = function(event, data) {
		var c,
			apps = this._apps,
			i = 0,
			n = apps.length;
		
		try {
			for ( ; i < n; i++) {
				c = apps[i];
				
				if (c.listensEvent(event))
					c.getApp().processEvent(event, data);
			}
		}
		catch (e) {
			// report errors
			BX.error.report(e);
		}
	};
	
	
	// publish the class
	return {
		/** 
		* AppManager class.
		* @memberOf module:'brixy.mvc.AppManager'
		* @type {module:'brixy.mvc.AppManager'~AppManager}
		*/
		Me: AppManager
	};
});


/*
* 
*/
BX.apps || (function() {
	
	var am = new (BX.module('brixy.mvc.AppManager').Me)();
	
	/**
	* Namespace BX.apps holds an instance of the [AppManager]{@link module:'brixy.mvc.AppManager'~AppManager} class.
	* 
	* @namespace BX.apps
	* @borrows module:'brixy.mvc.AppManager'~AppManager#add as add
	* @borrows module:'brixy.mvc.AppManager'~AppManager#get as get
	* @borrows module:'brixy.mvc.AppManager'~AppManager#exists as exists
	* @borrows module:'brixy.mvc.AppManager'~AppManager#processRequest as processRequest
	* @borrows module:'brixy.mvc.AppManager'~AppManager#processEvent as processEvent
	*/
	BX.apps = {
		add: function(config) { return am.add(config); },
		get: function(id) { return am.get(id); },
		exists: function(id) { return am.exists(id); },
		processRequest: function(id, request) { am.processRequest(id, request); },
		processEvent: function(event, data) { am.processEvent(event, data); }
	};
	
})();










		// init application
// release error reporter

/**
* Defines helper methods for work with {@link module:'brixy.ui.SuiBuilder'~SuiBuilder} components.
* 
* @module 'brixy.ui.helpers'
*/
BX.module.define('brixy.ui.helpers', function() {
	
	/**
	* Doubles ampersands. 
	* ScriptUI fields use ampersand to marking a shortcut character.
	* 
	* @memberOf module:'brixy.ui.helpers'
	* @param {string} str
	* @return {string}
	*/
	function doubleAmps(str) {
		return str.replace(/(&)/g, '&&');
	}
	
	/*
	* Tests if string has form '{...}'.
	* 
	* @memberOf module:'brixy.ui.helpers'
	* @param {string} str - Tested string.
	* @return {bool}
	*/
	function isResourceString(str) {
		return str && str.constructor.name === 'String' && /^\s*\{.*\}\s*$/.test(str);
	}
	
	/**
	* Returns all selected elements from the group. Tests if the value property of the element is equal to true.
	* 
	* @memberOf module:'brixy.ui.helpers'
	* @param {ScriptUIcontrol} group
	* @return {Array}
	*/
	function selectedChildren(group) {
		var n = group.children.length,
			i = 0,
			sel = [];
			
		for ( ; i < n; i++) {
			if (group.children[i].value)
				sel.push(group.children[i]);
		}
		
		return sel;
	}

	
	// publish
	return {
		doubleAmps: doubleAmps,
		isResourceString: isResourceString,
		selectedChildren: selectedChildren
	};	
});

/**
* Validator object.
* 
* @module 'brixy.ui.SuiValidator'
*/
BX.module.define('brixy.ui.SuiValidator', function() {
	var types = BX.module('brixy.es.types');
	
	/*
	* Rule object holds settings for Validators methods.
	* @class
	* @param {ScriptUIcontrol} element - Tested element.
	* @param {function} validator - Validator method.
	* @param {boolean} negate - Negate the rule.
	* @param {string} property - Tested property of the element.
	* @param {Array} args - Additional parameters that will be passed to validator method. The last may be a custom error message.
	*/
	function Rule(element, validator, negate, property, args) {
		this.element = element;
		this.validator = validator;
		this.negate = negate;
		this.property = property;
		this.args = args;
	}
	
	/*
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	Rule.prototype.toString = BX.toString;
	
	/*
	* Gets an array of arguments for validator callback.
	* @return {Array}
	*/
	Rule.prototype.getArgs = function() {
		return [].concat(this.negate, this.element[this.property], this.args);
	};

	
	/*
	* CustomRule object holds settings for custom validator method.
	* @class
	* @param {ScriptUIcontrol} element - Tested element.
	* @param {function} validator - Validator method.
	* @param {Array} args - Additional parameters that will be passed to validator method.
	*/
	function CustomRule(element, validator, args) {
		this.element = element;
		this.validator = validator;
		this.args = args;
	}
	
	/*
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	CustomRule.prototype.toString = BX.toString;
	
	/*
	* Gets an array of arguments for validator callback.
	* @return {Array}
	*/
	CustomRule.prototype.getArgs = function() {
		return this.args;
	};
	
	/**
	* SuiValidator object.
	* @class
	* @alias module:'brixy.ui.SuiValidator'~SuiValidator
	*/
	function SuiValidator() {
		this._rules = [];
	}
	
	/**
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	SuiValidator.prototype.toString = BX.toString;
	
	/**
	* Validate all rules.
	* @return {boolean} Result of the validation.
	*/
	SuiValidator.prototype.validate = function() {
		try{
			for (var i = 0, n = this._rules.length; i < n; i++) {
				if (!this._validateRule(this._rules[i]))
					return false;
			}
		}
		catch(e){
			alert('Validation failed. ' + e);
			return false;
		}
		
		return true;
	};
	
	/*
	* Validates a rule.
	* @param {Rule} rule - Tested rule.
	* @return {boolean} Result of the validation.
	* @throws {string} Exception if validation failed.
	*/
	SuiValidator.prototype._validateRule = function(rule) {
		try {
			rule.validator.apply(rule.element, rule.getArgs());
		}
		catch (e) {
			alert(e || 'Validation failed.');
				
			if (rule.element.visible && ('active' in rule.element))
				rule.element.active = true;
			
			return false;
		}
	
		return true;
	};
	
	/**
	* Adds new rule.
	* @param {ScriptUIcontrol} element - Tested element.
	* @param {string|function} validator - Validator method.
	* @param {Array} [args] - Additional parameters will be passed to validator method. (optional)
	* @throws {string} Exception if a validator rule cannot be set.
	*/
	SuiValidator.prototype.addRule = function(element, validator, args) {
		// element
		if (!element || typeof element !== 'object')
			throw Error('Element is not defined.');
			
		var ctype = types.className(validator),
			negate = false,
			property = '';
		
		// validator is a string
		if (ctype === 'String') {
			validator = validator.toLowerCase();
			
			if (validator.length > 1) {
				negate = validator[0] === '!';
				if (negate)
					validator = validator.substring(1);
			}
			
			if (validator in Validators)
				validator = Validators[validator];
			else
				throw Error('Validator "' + validator + '" was not found.');
				
			// tested property
			if (!args || !args.length) { // not defined, try to find a 'text' or 'value' property
				if ('text' in element)
					property = 'text';
				else if ('value' in element)
					property = 'value';
				else
					throw Error('Tested property of the ' + element + ' is not defined.');
			}
			else
				property = args[0];
				
			if (!(property in element))
				throw Error('The tested property ' + element + '.' + property + ' is not defined. Please specify the property name as the second parameter.');
			
			// add rule
			this._rules.push(new Rule(element, validator, negate, property, [].slice.call(args, 1)));
		}
		// validator is a function
		else if (ctype === 'Function') {
			// add rule
			this._rules.push(new CustomRule(element, validator, [].concat(args)));
		}
		else
			throw Error('Validator method should be a function.');
	};
	
	
	// Static validator methods:
	
	/**
	* Validators namespace.
	* @namespace
	* @memberOf module:'brixy.ui.SuiValidator'
	*/
	var Validators = {
		
		/**
		* Tests if the value equals to the required value.
		* @param {boolean} negate - Negate the condition.
		* @param {*} value - Tested value.
		* @param {*} required - Required value.
		* @param {string} [message] - Custom error message. (optional)
		*/
		equal: function(negate, value, required, message) {
			if (!!negate !== (value == required))
				return;
			
			if (message)
				throw message;
				
			if (negate)
				throw 'This field should not be equal to ' + required + '.';
			
			throw 'Please enter ' + required + '.';
		},
		
		/**
		* Tests if the value has the required length.
		* @param {boolean} negate - Negate the condition.
		* @param {*} value - Tested value.
		* @param {int} [min=0] - Minimum length of the value. (optional)
		* @param {int} [max=min] - Maximum length of the value. (optional)
		* @param {string} [message] - Custom error message. (optional)
		*/
		haslength: function(negate, value, min, max, message) {
			var n = (value != undefined && value.length != undefined) ? value.length : 0;
			
			min = (min == undefined) ? 0 : min - 0;
			max = (max == undefined || max < min) ? min : max - 0;
			
			if (!!negate !== (n >= min && n <= max))
				return;
				
			if (message)
				throw message;
				
			if (min == max) {
				if (negate)
					throw 'A length should not be ' + min + '.';
				else
					throw 'A length should be ' + min + '.';
			}
			else {
				if (negate)
					throw 'A length should be less than ' + min + ' or greater than ' + max + '.';
				else
					throw 'A length should be between ' + min + ' and ' + max + '.';
			}
		},
		
		/**
		* Tests if the value occurs in the array.
		* @param {boolean} negate - Negate the condition.
		* @param {*} value - Tested value.
		* @param {Array} array - Array of values.
		* @param {string} [message] - Custom error message. (optional)
		*/
		inarray: function(negate, value, array, message) {
			var arr = (array == undefined) ? [] : [].concat(array),
				i = 0,
				n = arr.length,
				r = false;
			
			for ( ; i < n; i++) {
				if (value == arr[i]) {
					r = true;
					break;
				}
			}
			
			if (!!negate !== r)
				return;
				
			if (message)
				throw message;
				
			throw 'Please fill in a suitable value.';
		},
		
		/**
		* Tests if the value is decimal. Exponential notation is not allowed (e.g. 1.2e+25).
		* @param {boolean} negate - Negate the condition.
		* @param {*} value - Tested value.
		* @param {string} [decimalPoint=$.decimalPoint] - Decimal separator. (optional)
		* @param {string} [message] - Custom error message. (optional)
		*/
		isdecimal: function(negate, value, decimalPoint, message) {
			var dp = (!decimalPoint) ? $.decimalPoint : decimalPoint,
				reg = RegExp('^\\s*[-+]?\\d+(?:' + types.escapeRegexpStr(dp) + '\\d*)?\\s*$');
				
			if (!!negate !== reg.test(value))
				return;
				
			if (message)
				throw message;
				
			if (negate)
				throw 'Value should not be a decimal.';
			
			throw 'Please fill in a decimal value.';
		},
		
		/**
		* Tests if the value is integer. Exponential notation is not allowed (e.g. 1e+25).
		* @param {boolean} negate - Negate the condition.
		* @param {*} value - Tested value.
		* @param {string} [message] - Custom error message. (optional)
		*/
		isinteger: function(negate, value, message) {
			if (!!negate !== /^\s*[-+]?\d+\s*$/.test(value))
				return;
				
			if (message)
				throw message;
				
			if (negate)
				throw 'Value should not be an integer.';
			
			throw 'Please fill in an integer value.';
		},
		
		/**
		* Tests if the array contains a checked or selected item.
		* 
		* @example
		* column().validator('itemselected', 'children')
		* listBox().validator('itemselected', 'items')
		* // or:
		* listBox().validator('required', 'selection')
		* 
		* @param {boolean} negate - Negate the condition.
		* @param {Array} value - Tested array.
		* @param {string} [message] - Custom error message. (optional)
		*/
		itemselected: function(negate, value, message) {
			var i,
				n,
				v,
				r = false;
			
			if (value != undefined && value.length) {
				for (i = 0, n = value.length; i < n; i++) {
					v = value[i];
					if (v && (typeof v === 'object') && (v.value || v.selected)) {
						r = true;
						break;
					}
				}
			}
			
			if (!!negate !== r)
				return;
				
			if (message)
				throw message;
				
			if (negate)
				throw 'Items should not be selected.';
			
			throw 'Please select an item.';
		},

		/**
		 * Tests if the number is lesser than or equal to a given limit.
		 * @param {boolean} negate - Negate the condition.
		 * @param {*} value - Tested value.
		 * @param {*} [max=0] - Maximum value. (optional)
		 * @param {string} [message] - Custom error message. (optional)
		 */
		maximum: function(negate, value, max, message) {
			max = (max == undefined) ? 0 : max - 0;

			if (!!negate !== value <= max)
				return;

			if (message)
				throw message;

			if (negate)
				throw 'Please enter a value greater than ' + max + '.';
			else
				throw 'Please enter a value less than or equal to ' + max + '.';
		},

		/**
		* Tests if the value has maximum length.
		* @param {boolean} negate - Negate the condition.
		* @param {*} value - Tested value.
		* @param {int} [max=0] - Maximum length of the value. (optional)
		* @param {string} [message] - Custom error message. (optional)
		*/
		maxlength: function(negate, value, max, message) {
			Validators.haslength.call(this, negate, value, Number.MIN_VALUE, max, message);
		},

		/**
		 * Tests if the number is greater than or equal to a given limit.
		 * @param {boolean} negate - Negate the condition.
		 * @param {*} value - Tested value.
		 * @param {*} [min=0] - Minimum value. (optional)
		 * @param {string} [message] - Custom error message. (optional)
		 */
		minimum: function(negate, value, min, message) {
			min = (min == undefined) ? 0 : min - 0;

			if (!!negate !== value >= min)
				return;

			if (message)
				throw message;

			if (negate)
				throw 'Please enter a value lesser than ' + min + '.';
			else
				throw 'Please enter a value greater than or equal to ' + min + '.';
		},

		/**
		* Tests if the value has minimum length.
		* @param {boolean} negate - Negate the condition.
		* @param {*} value - Tested value.
		* @param {int} [min=0] - Minimum length of the value. (optional)
		* @param {string} [message] - Custom error message. (optional)
		*/
		minlength: function(negate, value, min, message) {
			Validators.haslength.call(this, negate, value, min, Number.MAX_VALUE, message);
		},
		
		/**
		* Tests if value matches the regular expression. Uses the Extend Script RegExp object.
		* @param {boolean} negate - Negate the condition.
		* @param {*} value - Tested value.
		* @param {RegExp|string} regexp - Regular expression or string. In case of string, the doubling of backslashles is necessary.
		* @param {string} [message] - Custom error message. (optional)
		*/
		pattern: function(negate, value, regexp, message) {
			var reg = (regexp instanceof RegExp) ? regexp : RegExp(regexp);
			
			if (!!negate !== reg.test(value))
				return;
				
			if (message)
				throw message;
				
			throw 'Please fill in the suitable value.';
		},
		
		/**
		* Tests if the value is in required range.
		* @param {boolean} negate - Negate the condition.
		* @param {*} value - Tested value.
		* @param {*} [min=0] - Minimum value. (optional)
		* @param {*} [max=min] - Maximum value. (optional)
		* @param {string} [message] - Custom error message. (optional)
		*/
		range: function(negate, value, min, max, message) {
			min = (min == undefined) ? 0 : min - 0;
			max = (max == undefined || max < min) ? min : max - 0;

			if (!!negate !== (value >= min && value <= max))
				return;
				
			if (message)
				throw message;
				
			if (min == max) {
				if (negate)
					throw 'A value should not be ' + min + '.';
				else
					throw 'Please enter ' + min + '.';
			}
			else {
				if (negate)
					throw 'Please enter a value less than ' + min + ' or greater than ' + max + '.';
				else
					throw 'Please enter a value between ' + min + ' and ' + max + '.';
			}
		},
		
		/**
		* Tests if the value is defined and is not empty string. Boolean values (true or false) are both OK.
		* 
		* @example
		* dropDownList().validator('required', 'selection')
		* editText().validator('required') // tests 'text' property
		* 
		* @param {boolean} negate - Negate the condition.
		* @param {*} value - Tested value.
		* @param {string} [message] - Custom error message. (optional)
		*/
		required: function(negate, value, message) {
			if (!!negate !== (value != undefined && value !== ''))
				return;
				
			if (message)
				throw message;
				
			if (negate)
				throw 'This field should be empty.';
				
			throw 'Please fill in the required value.';
		}
		
	};
	
	
	// publish
	return {
		Validators: Validators,
		/** 
		* SuiValidator class.
		* @memberOf module:'brixy.ui.SuiValidator'
		* @type {module:'brixy.ui.SuiValidator'~SuiValidator}
		*/
		Me: SuiValidator
	};
});


/**
* Defines base {@link module:'brixy.ui.SuiBuilder'~SuiBuilder} components.
* 
* @module 'brixy.ui.components.base'
*/
BX.module.define('brixy.ui.components.base', function() {
	var helpers = BX.module('brixy.ui.helpers'),
		SuiValidator = BX.module('brixy.ui.SuiValidator').Me;

	/*
	* Creates new standard ScriptUI element.
	* 
	* @param {ScriptUIcontrol} container - Container element.
	* @param {string} type - ScriptUI control type.
	* @param {string|Array<string>} resource - Text property or array of items or resource string. (optional)
	* @return {ScriptUIcontrol}
	*/
	function addSuiElement(container, type, resource) {
		var tx = false;
		
		if (resource == undefined) // undefined or null
			resource = '{}';
		else if (resource.constructor.name === 'Array')
			resource = '{properties: {items: ' + resource.toSource() + '}}';
		else if (!helpers.isResourceString(resource)) { // String
			tx = resource.toString();
			resource = '{}';
		}

		var e = container.add(type + resource);
		if (tx)
			e.text = tx;
			
		return e;
	}
	
	
	// publish
	return {

		/* ***** Base builder's methods. ***** */

		/**
		* Registers an event listener to the current element.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} eventName - Event name.
		* @param {function} callback - Event handler.
		* @param {boolean} capturePhase - When true, the handler is called only in the capturing phase of the event propagation. Default is false. (optional)
		* @throws {Error} Exception if callback is not a function.
		*/
		addEventListener: function(eventName, callback, capturePhase) {
			if (!callback)
				throw Error('Null is not a function.');
			if (typeof callback !== 'function')
				throw Error(callback + ' is not a function.');
			
			this.element.addEventListener(eventName, callback, capturePhase);
		},
		
		/**
		* The alignment style for current element.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string|Array<string>} alignment - Alignment style.
		*/
		align: function(alignment) {
			this.element.alignment = alignment;
		},
		
		/**
		* The alignment style for children elements.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {String|Array<string>} alignment - Alignment style.
		* @throws {Error} Exception if element doesn't support alignChildren property.
		*/
		alignChildren: function(alignment) {
			if ('alignChildren' in this.element)
				this.element.alignChildren = alignment;
			else
				throw Error('Method alignChildren() is invalid in this context.');
		},
		
		/**
		* Adds onClick event that closes a window with the result code. 
		* If validate is true, it runs a builder validate() method. Window remains open if validation failed.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {boolean} [validate] - Validate the controls before closing.
		* @param {int} [result] - Code returned by window. (optional)
		*/
		closeOnClick: function(validate, result) {
			var b = this;
			
			// InDesign CC (2015, Win): addEventListener('click', ...) doesn't work with OK and Cancel button
			this.element.onClick = function() {
				var w = b._containers[0];
				if (!w || w.constructor.name !== 'Window')
					throw Error('Window does not exist.');
					
				if (validate && b.validator && !b.validator.validate())
					return false;
			
				w.close((result == undefined) ? 1 : result);
			};
		},

		/**
		* Sets builder counter. It helps to identify builder method.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {int} counter - Your number.
		*/
		counter: function(counter) {
			var c = Number(counter);
			this._counter = c > 0 ? Math.floor(c) : 0;
		},
		
		/**
		* Doubles ampersands. 
		* ScriptUI fields use ampersand to marking a shortcut character.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [property='text'] - Property name. (optional)
		*/
		doubleAmps: function(property) {
			property = (property == undefined) ? 'text' : property + '';
				
			if (property in this.element)
				this.element[property] = helpers.doubleAmps(this.element[property]);
		},

		/**
		* Sets the parent container as the current container.
		* @memberOf module:'brixy.ui.components.base'
		*/
		end: function() {
			var c = this._containers,
				i = c.length;
				
			if (i > 1) { // don't delete the first container - Window
				this.element = c.pop();
				this.container = c[i-2]; // the last
			}
		},
		
		/**
		* Immediately executes the callback method.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {function} callback - Custom method (.execute(callback, par1, par2)). Keyword 'this' references the builder.
		* @param {...*} [pars, ...] - Additional parameters will be passed to callback method. (optional)
		* @throws {Error} Exception if callback is not a function.
		*/
		execute: function(callback /*, callback parameters */) {
			if (typeof callback !== 'function')
				throw Error(callback + ' is not a function.');
				
			callback.apply(this, [].slice.call(arguments, 1));
		},
		
		/**
		* Saves the current element into SuiBuilder's repository.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} id - ID of this element.
		* @throws {Error} Exception on error.
		*/
		id: function(id) {
			if (!id)
				throw Error('Invalid id key.');
			if (!this.element)
				throw Error('Element is undefined.');
				
			this._ids[id + ''] = this.element;
		},
		
		/**
		* Adds a click event listener that activates a target element.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} id - ID of target element.
		*/
		labelFor: function(id) {
			var b = this.builder;
			
			this.element.addEventListener('click', function(event) {
				try {
					var el = b.get(id);
					el.active = false;
					el.active = true;
				}
				catch (e) { // ignore all problems
				}
			});
		},
		
		/**
		* Sets the property/properties of the current element.
		* Does not check if this property exists in the element.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string|Object} property - Property name or Object of the property name-value pairs.
		* @param {*} [value] - Ignored if property is Object. (optional)
		*/
		set: function(property, value) {
			if (typeof property === 'object' && property.constructor.name !== 'String') {
				for (var p in property) {
					this.element[p] = property[p];
				}
			}
			else
				this.element[property + ''] = value;
		},
		
		/**
		* Shows the window.
		*
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [position] - The window position. Supported only 'center'. (optional)
		* @throws {Error} Exception if Window doesn't exist.
		*/
		showWindow: function(position) {
			if (!this._containers.length)
				throw Error('Window does not exist.');
			
			var w = this._containers[0];
			if (!w || w.constructor.name !== 'Window')
				throw Error('Window does not exist.');
			
			this._containers.length = 1;
			this.container = this.element = w;
			
			if (position === 'center')
				w.center();
			this._result = w.show();
		},
		
		/**
		* Sets the subitem of the multicolumn ListBox item.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {int} index - Index of the subitem. Note: subitem[0] is the second item of the ScriptUI ListBox row.
		* @param {string} text - Text of this subitem.
		* @param {string|File|ScriptUIImage} [image] - Image of this subitem. (optional)
		* @throws {Error} Exception if element doesn't have 'item' property.
		*/
		subItem: function(index, text, image) {
			if (this.element.type === 'item' && this.element.parent.type === 'listbox') {
				if (index >= this.element.subItems.length)
					throw Error('ListBox multicolumn row has just ' + this.element.subItems.length + ' subitems.');
					
				this.element.subItems[index].text = text;
				if (image)
					this.element.subItems[index].image = image;
			}
			else
				throw Error('Method subItem() is invalid in this context.');
		},
		
		/**
		* Sets the validation method on the current element.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string|function} callback - Validator method.
		* @param {...*} [args, ...] - Additional arguments will be passed to the callback method. (optional)
		* @throws {Error} Exception if a validator cannot be set.
		*/
		validator: function(callback /*, callback parameters */) {
			if (!this.validator)
				this.validator = new SuiValidator();
				
			this.validator.addRule(this.element, callback, [].slice.call(arguments, 1));
		},
	
	
		/* ***** Base builder's components. ***** */

		/**
		* Adds new Button element.  
		* Element component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [resource] - Text property or resource specification. (optional)
		*/
		button: function(resource) {
			this.element = addSuiElement(this.container, 'button', resource);
		},
		
		/**
		* Adds new Checkbox element.  
		* Element component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [resource] - Text property or resource specification. (optional)
		*/
		checkbox: function(resource) {
			this.element = addSuiElement(this.container, 'checkbox', resource);
		},
		
		/**
		* Adds new Group with orientation 'column'.  
		* Container component.
		* @memberOf module:'brixy.ui.components.base'
		*/
		column: function() {
			this.container = this.container.add("group {orientation: 'column'}");
		},
		
		/**
		* Adds new Panel with orientation 'column'.  
		* Container component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [title] - Panel title. (optional)
		*/
		columnPanel: function(title) {
			this.container = this.container.add("panel {orientation: 'column'}");
			this.container.text = title || '';
		},
		
		/**
		* Adds new DropDownList element. Specify items as the array parameter or use item() for adding further items.  
		* Container component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {Array|string} [resource] - Array of items or resource specification. (optional)
		*/
		dropDownList: function(resource) {
			this.container = addSuiElement(this.container, 'dropdownlist', resource);
		},
		
		/**
		* Adds new EditText element.  
		* Element component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [resource] - Text property or resource specification. (optional)
		*/
		editText: function(resource) {
			this.element = addSuiElement(this.container, 'edittext', resource);
		},
		
		/**
		* Adds new FlashPlayer element.  
		* Element component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string|File} [resource] - Resource string or file path or File to load. (optional)
		* @param {string|File} [file] - File path or File to load. (optional)
		*/
		flashPlayer: function(resource, file) {
			var f = null;
			
			if (resource == undefined) // undefined or null
				resource = '{}';
			else if (!helpers.isResourceString(resource)) {
				f = resource;
				resource = '{}';
			}
			if (file)
				f = file;

			this.element = this.container.add('flashplayer' + resource);
			if (f)
				this.element.loadMovie(f);
		},
		
		/**
		* Adds new Group element.  
		* Container component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [resource] - Creation properties. (optional)
		*/
		group: function(resource) {
			this.container = addSuiElement(this.container, 'group', resource);
		},
		
		/**
		* Adds new IconButton element.  
		* Element component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string|File|Array<string>|ScriptUIImage} [resource] - IconButton resource string or image path or Array|ScriptUIImage of the 4-state button images. (optional)
		*/
		iconButton: function(resource) {
			var im = null;
			
			if (resource == undefined) // undefined or null
				resource = '{}';
			else if (resource.constructor.name === 'Array') {
				im = ScriptUI.newImage(resource[0], resource[1], resource[2], resource[3]);
				resource = '{}';
			}
			else if (!helpers.isResourceString(resource)){
				im = resource;
				resource = '{}';
			}

			this.element = this.container.add('iconbutton' + resource);
			if (im)
				this.element.image = im;
		},
		
		/**
		* Adds new Image element.  
		* Element component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string|File|ScriptUIImage} [resource] - Image resource string or image file|path. (optional)
		*/
		image: function(resource) {
			var im = null;
			
			if (resource == undefined) // undefined or null
				resource = '{}';
			else if (!helpers.isResourceString(resource)) {
				im = resource;
				resource = '{}';
			}

			this.element = this.container.add('image' + resource);
			if (im)
				this.element.image = im;
		},
		
		/**
		* Adds new item to the ListBox, DropDownList or TreeView.  
		* Element component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string|Array<string>} text - Text of this item or array of strings for the columns of multicolumn ListBox row.
		* @param {int} [index] - The index of this item in the list of items. (optional)
		* @throws {Error} Exception if element doesn't have 'items' property.
		* @throws {Error} Exception if ListBox doesn't have enough columns.
		*/
		item: function(text, index) {
			var c = this.container,
				el,
				i,
				n;
				
			if ('items' in c) {
				if (text && text.constructor.name === 'Array' && text.length && c.type === 'listbox' && 'columns' in c) {
					n = text.length;
					if (n > c.columns.titles.length)
						throw Error('ListBox has ' + c.columns.titles.length + ' columns only.');
						
					el = c.add('item', text[0], index);
					for (i = 1; i < n; i++)
						el.subItems[i-1].text = text[i];
					
					this.element = el;
				}
				else
					this.element = c.add((text === '-' && c.type === 'dropdownlist') ? 'separator' : 'item', text, index);
			}
			else
				throw Error('Component type "item" is invalid in this context.');
		},
		
		/**
		* Adds new ListBox.  
		* Specify lines as the array parameter or use item() for adding further lines.  
		* In case of multiline ListBox specify the column titles as the array parameter. Use item() for adding new line. Use subItem() for setting of the item cell.  
		* Container component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string|Array<string>} [resource] -  Resource string or array of lines or array of column titles for the multicolumn ListBox. (optional)
		*/
		listBox: function(resource) {
			var pr = null;
			
			if (resource == undefined) // undefined or null
				resource = '{}';
			else if (resource.constructor.name === 'Array' && 'columns' in ListBox) {
				pr = { 
					numberOfColumns: resource.length, 
					showHeaders: true, 
					columnTitles: resource
				};
			}

			if (pr)
				this.container = this.container.add('listbox', undefined, '', pr);
			else
				this.container = this.container.add('listbox' + resource);
		},
		
		/**
		* Adds new node item into the TreeView.  
		* Container component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} text - Text of this item.
		* @param {int} [index] - The index of this node in the list of items (optional)
		* @throws {Error} Exception if element doesn't have 'items' property.
		*/
		nodeItem: function(text, index) {
			var c = this.container;
			if ('items' in c) {
				this.container = c.add('node', text, index);
			}
			else
				throw Error('Component type "nodeItem" is invalid in this context.');
		},
		
		/**
		* Adds new Panel element.  
		* Container component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [resource] - Text property or resource specification. (optional)
		*/
		panel: function(resource) {
			this.container = addSuiElement(this.container, 'panel', resource);
		},
		
		/**
		* Adds new Progressbar element.  
		* Element component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [resource] - Resource specification. (optional)
		*/
		progressBar: function(resource) {
			this.element = addSuiElement(this.container, 'progressbar', resource);
		},
		
		/**
		* Adds new RadioButton element.  
		* Element component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [resource] - Text property or resource specification. (optional)
		*/
		radioButton: function(resource) {
			this.element = addSuiElement(this.container, 'radiobutton', resource);
		},
		
		/**
		* Adds new Group with orientation 'row'.  
		* Container component.
		* @memberOf module:'brixy.ui.components.base'
		*/
		row: function() {
			this.container = this.container.add('group {orientation: "row"}');
		},
		
		/**
		* Adds new Panel with orientation 'row'.  
		* Container component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [title] - Panel title. (optional)
		*/
		rowPanel: function(title) {
			this.container = this.container.add('panel {orientation: "row"}');
			this.container.text = title || '';
		},
		
		/**
		* Adds new Scrollbar element.  
		* Element component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [resource] - Resource specification. (optional)
		*/
		scrollbar: function(resource) {
			this.element = addSuiElement(this.container, 'scrollbar', resource);
		},
		
		/**
		* Adds new Slider element.  
		* Element component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [resource] - Resource specification. (optional)
		*/
		slider: function(resource) {
			this.element = addSuiElement(this.container, 'slider', resource);
		},
		
		/**
		* Adds new Group with orientation 'stack'.  
		* Container component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		*/
		stack: function() {
			this.container = this.container.add('group {orientation: "stack"}');
		},
		
		/**
		* Adds new Panel with orientation 'stack'.  
		* Container component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [title] - Panel title. (optional)
		*/
		stackPanel: function(title) {
			this.container = this.container.add('panel {orientation: "stack"}');
			this.container.text = title || '';
		},
		
		/**
		* Adds new StaticText element.  
		* Element component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [resource] - Text property or resource specification. (optional)
		*/
		staticText: function(resource) {
			this.element = addSuiElement(this.container, 'statictext', resource);
		},
		
		/**
		* Adds new Tab element.  
		* Container component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [resource] - Text property or resource specification. (optional)
		*/
		tab: function(resource) {
			this.container = addSuiElement(this.container, 'tab', resource);
		},
		
		/**
		* Adds new TabbedPanel element.  
		* Container component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} [resource] - Text property or resource specification. (optional)
		*/
		tabbedPanel: function(resource) {
			this.container = addSuiElement(this.container, 'tabbedpanel', resource);
		},
		
		/**
		* Adds new TreeView element.  
		* Container component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {Array|string} [resource] - Array of items or resource specification. (optional)
		*/
		treeView: function(resource) {
			this.container = addSuiElement(this.container, 'treeview', resource);
		},
		
		/**
		* Creates new window with the standard ScriptUI Window parameters.
		* Window is the base element and it is only a single Window element in each SuiBuilder instance.  
		* Container component.
		* 
		* @memberOf module:'brixy.ui.components.base'
		* @param {string} type - Window type: 'window'|'palette'|'dialog'.
		* @param {string} [title] - Window title. (optional)
		* @param {Bounds} [bounds] - Position and size of the window. (optional)
		* @param {Object} [properties] - Creation-only properties. (optional)
		* @throws {Error} Exception if Window is not the first element in this builder.
		*/
		window: function(type, title, bounds, properties) {
			if (this.container)
				throw Error('Window must be the first component, some already exists.');
			
			if (title && !this.name)
				this.name = title;
				
			this.container = new Window(type, title, bounds, properties);
		}
		
	};

});

/**
* Easy and fun creation of Adobe ScriptUI user interface.
* 
* @module 'brixy.ui.SuiBuilder'
*/
BX.module.define('brixy.ui.SuiBuilder', function() {
	var baseComponents = BX.module('brixy.ui.components.base');
	
	/**
	* SuiBuilder object.
	* 
	* @class
	* @alias module:'brixy.ui.SuiBuilder'~SuiBuilder
	* @param {string} name - Builder's name. (optional)
	* 
	* @property {Object} _builder - Private builder object.
	* @property {string} _builder.name - Builder's name.
	* @property {component} _builder.element - Current SUI component.
	* @property {component} _builder.container - Current SUI container component.
	* @property {Object} _builder.validator - Validator object.
	* @property {SuiBuilder} _builder.builder - This SuiBuilder instance.
	*/
	function SuiBuilder(name) {
		this._builder = {
			name: name, // builder's name
			element: null, // current element
			container: null, // current container
			validator: null, // validator object
			builder: this, // SuiBuilder instance
			_containers: [], // the chain of the container components
			_ids: {}, // repository of the elements saved by the id() method
			_result: 0, // a result returned from the ScriptUI Window.show() method
			_counter: 0 // the number of the builder methods already executed
		};
	}
	
	/**
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	SuiBuilder.prototype.toString = BX.toString;
	
	/**
	* Returns saved element.
	* 
	* @param {string} id
	* @return {component}
	*/
	SuiBuilder.prototype.get = function (id) {
		return this._builder._ids[id];
	};
	
	/**
	* Returns all saved elements.
	* 
	* @return {Object}
	*/
	SuiBuilder.prototype.getAll = function () {
		return this._builder._ids;
	};
	
	/**
	* Returns a result of the ScriptUI window.show() method.
	* 
	* @return {int}
	*/
	SuiBuilder.prototype.result = function () {
		return this._builder._result;
	};
	
	/**
	* Adds methods into SuiBuilder instance. Existing methods are replaced.
	* 
	* @param {...Object} [components, ...] - Each argument is object with component definitions.
	*/
	SuiBuilder.prototype.addComponents = function (components /* components2, ... */) {
		var n = arguments.length,
			i = 0,
			comps;
			
		for ( ; i < n; i++) {
			comps = arguments[i];
			if (typeof comps === 'object') {
				for (var c in comps) {
					this.addComponent(c, comps[c]);
				}
			}
		}
	};
	
	/**
	* Adds method into SuiBuilder instance. Existing method are replaced.
	* 
	* @param {string} name - Component name.
	* @param {function} callback
	*/
	SuiBuilder.prototype.addComponent = function (name, callback) {
		if (!callback || typeof callback !== 'function')
			throw BX.error('brixy.ui.SuiBuilder.addComponent()', Error('Cannot add component "' + name + '".'), 'Callback must be a function. ' + callback + ' is given.');
			
		this[name] = function(/* custom parameters */) {
			return member.call(this, name, callback, arguments);
		};
	};
	
	/**
	* Adds methods into SuiBuilder prototype.
	* 
	* @param {Object} members - Methods.
	* @param {boolean} [replace=false] - If true, existing methods will be replaced. (optional)
	*/
	SuiBuilder.attach = function (members, replace) {
		if (typeof members === 'object') {
			for (var m in members) {
				if (replace || !(m in SuiBuilder.prototype))
					attachMember(m, members[m]);
			}
		}
	};
	
	/*
	* Adds a method into SuiBuilder prototype.
	* 
	* @param {string} name - Name of the method.
	* @param {function} callback - Method.
	*/
	function attachMember(name, callback) {
		if (!callback || typeof callback !== 'function')
			throw BX.error('brixy.ui.SuiBuilder.attachMember()', Error('Cannot add component "' + name + '".'), 'Callback must be a function. ' + callback + ' is given.');
			
		SuiBuilder.prototype[name] = function(/* custom parameters */) {
			return member.call(this, name, callback, arguments);
		};
	}
	
	/*
	* General builder method.
	* 
	* @param {string} name - Method name.
	* @param {function} callback - Method.
	* @param {Array} args - Arguments for callback.
	* @throws {BX.error.ErrorChain} Exception if component creation failed.
	* @return {SuiBuilder} Provides fluent interface.
	*/
	function member(name, callback, args) {
		try {
			var b = this._builder,
				n;
				
			b._counter++;
			
			callback.apply(b, args);
			
			if (b.container) {
				n = b._containers.length;
				if (!n || b._containers[n-1] !== b.container) {
					b._containers.push(b.container);
					b.element = b.container;
				}
			}
		}
		catch (e) {
			throw createMemberError(this, name, args, e);
		}
		return this;
	}
	
	/**
	* Removes methods from the SuiBuilder prototype.
	* 
	* @param {string|Array<string>} members - The list of the method names to detach.
	*/
	SuiBuilder.detach = function (members) {
		if (!members)
			return;
		
		if (members.constructor.name === 'String') { // one
			remove(members);
		}
		else if (members.constructor.name === 'Array') { // array
			for (var i = 0, n = members.length; i < n; i++) {
				remove(members[i]);
			}
		}
		
		function remove(name) {
			if (name in SuiBuilder.prototype) {
				SuiBuilder.prototype[name] = null;
				delete SuiBuilder.prototype[name];
			}
		}
	};
		
	/*
	* Error factory.
	* 
	* @param {SuiBuilder} builder - SuiBuilder object.
	* @param {string} functionName - Function name.
	* @param {Array} args - Function arguments.
	* @param {Error|string} error - Error message.
	* @return {BX.error.ErrorChain}
	*/
	function createMemberError(builder, functionName, args, error) {
		var method,
			message,
			s,
			ord,
			a = [],
			i,
			n,
			types = BX.module('brixy.es.types');
		
		// method name
		for (i = 0, n = args.length; i < n; i++) {
			a.push(types.valueString(args[i]));
		}
		method = functionName + '(' + a.join(', ') + ')';
		
		// convert _counter to ordinal number
		s = builder._builder._counter.toString(10);
		n = s.length;
		if (n > 1 && s[n-2] === '1')
			ord = s + 'th';
		else
			ord = s + ({1: 'st', 2: 'nd', 3: 'rd'}[s[n-1]] || 'th');

		// error message
		message = (builder._builder.name ? '"' + builder._builder.name + '": ' : 'SuiBuilder: ') + 'the ' + ord + ' method of builder chain failed.';
		
		return new BX.error.ErrorChain('brixy.ui.SuiBuilder.' + method, message, error);
	}
	
	
	// publish
	return {
		/** 
		* SuiBuilder class.
		* @memberOf module:'brixy.ui.SuiBuilder'
		* @type module:'brixy.ui.SuiBuilder'~SuiBuilder
		*/
		Me: SuiBuilder
	};
});

// SuiBuilder base components
BX.module('brixy.ui.SuiBuilder').Me.attach(BX.module('brixy.ui.components.base'), true);




/**
* Defines components for {@link module:'brixy.ui.SuiBuilder'~SuiBuilder}.
* 
* @module 'brixy.ui.components.colorize'
*/
BX.module.define('brixy.ui.components.colorize', function() {

	// publish
	return {

		/**
		* Sets foreground colors of the element.
		* 
		* @memberOf module:'brixy.ui.components.colorize'
		* @param {Array} enabled - Color for element when enabled or active.
		* @param {Array} disabled - Color for element when disabled or inactive.
		*/
		foregroundColor: function(enabled, disabled) {
			var gr = this.element.graphics,
				type = gr.PenType.SOLID_COLOR;
			
			disabled || (disabled = enabled);
			
			gr.foregroundColor = gr.newPen(type, enabled, 1);
			gr.disabledForegroundColor = gr.newPen(type, disabled, 1);
		},
		
		/**
		* Sets background colors of the element.
		* 
		* @memberOf module:'brixy.ui.components.colorize'
		* @param {Array} enabled - Color for element when enabled or active.
		* @param {Array} disabled - Color for element when disabled or inactive.
		*/
		backgroundColor: function(enabled, disabled) {
			var gr = this.element.graphics,
				type = gr.BrushType.SOLID_COLOR;
			
			disabled || (disabled = enabled);
			
			gr.backgroundColor = gr.newBrush(type, enabled);
			gr.disabledBackgroundColor = gr.newBrush(type, disabled);
		}
		
	};

});
/**
* @module 'brixy.fs.filesystem'
*/
BX.module.define('brixy.fs.filesystem', function() {
	

	/**
	* Opens the file-browsing dialog.
	* 
	* @memberOf module:'brixy.fs.filesystem'
	* @param {string} prompt - Prompt text of the dialog window.
	* @param {string} [filterString] - Filter of the showed files. String of Windows type is converted to a filter function on the OSX. (optional)
	* @param {boolean} [multiselect=false] - Allows selecting of multiple files. Default is false. (optional)
	* @return {File|Array|null} - Selected file or files.
	*/
	function openDialog(prompt, filterString, multiselect) {
		var ft;
		
		if (File.fs === 'Macintosh')
			ft = macFilterFunction(filterStringToReg(filterString));
		else
			ft = filterString;
		
		return File.openDialog(prompt, ft, multiselect);
	}

	/**
	* Opens the file-browsing dialog.
	* 
	* @memberOf module:'brixy.fs.filesystem'
	* @param {string} prompt - Prompt text of the dialog window.
	* @param {string} [filterString] - Filter of the showed files. String of Windows type is converted to a filter function on the OSX. (optional)
	* @param {File} [file] - If is presented, the dialog shows the file. (optional)
	* @return {File|null} - Selected file.
	*/
	function saveDialog(prompt, filterString, file) {
		var ft;
		
		if (File.fs === 'Macintosh')
			ft = macFilterFunction(filterStringToReg(filterString));
		else
			ft = filterString;
		
		if (file)
			return file.saveDlg(prompt, ft);
			
		return File.saveDialog(prompt, ft);
	}

	/**
	* Returns array of File.
	* 
	* @memberOf module:'brixy.fs.filesystem'
	* @param {Folder} folder - Folder.
	* @param {string|RegExp} [filter] - Filter of the selected files. Eg. "\*.jsx;\*.jsxinc;\*.js" (optional)
	* @param {boolean} [filesOnly=false] - If true, it skips folders. (optional)
	* @return {Array} - Array of selected files.
	*/
	function fileList(folder, filter, filesOnly) {
		var list,
			reg;
		
		reg = (filter instanceof RegExp) ? filter : filterStringToReg(filter || '');
		
		list = folder.getFiles(function (f) { 
			return (!filesOnly || (f instanceof File)) && reg.test(f.name);
		});
		
		if (!list)
			return [];
		
		return list;
	}

	/**
	* Returns array of Folders.
	* 
	* @memberOf module:'brixy.fs.filesystem'
	* @param {Folder} folder - Parent folder.
	* @return {Array} - Array of folders.
	*/
	function folderList(folder) {
		var list;
		
		list = folder.getFiles(function (f) { 
			return f instanceof Folder;
		});
		
		if (!list)
			return [];
		
		return list;
	}

	function macFilterFunction(regFilter) {
		
		return function (file) {
			while (file.alias) {
				file = file.resolve();
				if (file == null)
					return false;
			}
			
			return (file instanceof Folder) || regFilter.test(file.name);
		};
	}
	
	function filterStringToReg(filterString) {
		var r,
			reg;
		
		r = filterString.match(/[^:]*$/);
		if (r && r[0]) {
			reg = r[0].replace(/(\.)/g, '\\.').replace(/(\*)/g, '.*').replace(/(;)/g, '|');
		}
		else
			reg = '.*';
		
		return RegExp("^(" + reg + ")$", 'i');
	}

	
	// publish
	return {
		openDialog: openDialog,
		saveDialog: saveDialog,
		fileList: fileList,
		folderList: folderList
	};
});

/**
* @module 'brixy.debug.systemInfo'
*/
BX.module.define('brixy.debug.systemInfo', function() {
	
	/**
	* Gets array of system information, e.g. application name, version, locale, target engine...
	* 
	* @memberOf module:'brixy.debug.systemInfo'
	* @return {Array}
	*/
	function systemInfo() {
		var sysInfo = [],
			n;
		
		if ('activeScript' in app)
			sysInfo.push('Script: ' + app.activeScript.displayName);
		else {
			n = File($.fileName).displayName;
			if (n !== 'systemInfo.jsxinc')
				sysInfo.push('Script: ' + n);
		}
		
		sysInfo.push('OS: ' + $.os);
		sysInfo.push('Application: ' + app.name + ' ' + app.version);
		if ('scriptPreferences' in app && 'version' in app.scriptPreferences)
			sysInfo.push('Application scripting version: ' + app.scriptPreferences.version);
		sysInfo.push('Locale: ' + $.locale);
		if ('appEncoding' in $)
			sysInfo.push('Application\'s default character encoding: ' + $.appEncoding);
		sysInfo.push('Extended localization of the toString(): ' + $.localize);
		sysInfo.push('ExtendScript: ' + $.version + ' (build ' + $.build + ')');
		sysInfo.push('Target engine: ' + $.engineName);
		sysInfo.push('Strict mode: ' + $.strict);
		sysInfo.push('Debugging level: ' + $.level + ' (' + (['no debugging', 'break on runtime errors', 'full debug mode'][$.level] || 'unknown') + ')');
		n = [];
		$.flags & 0x0002 && n.push('2');
		$.flags & 0x0040 && n.push('64');
		$.flags & 0x0080 && n.push('128');
		$.flags & 0x0100 && n.push('256');
		$.flags & 0x0200 && n.push('512');
		sysInfo.push('Debug output flags: ' + $.flags + (n.length > 1 ? ' (' + n.join(' + ') + ')' : ''));
		sysInfo.push('ExtendScript memory cache: ' + $.memCache + ' bytes');
		sysInfo.push('Date: ' + (new Date()).toString());
		
		return sysInfo;
	}
	
	/**
	* Shows system information, e.g. application name, version, locale, target engine...
	* 
	* @memberOf module:'brixy.debug.systemInfo'
	*/
	function showSystemInfo() {
		alert(systemInfo().join('\n'));
	}

	// publish
	return {
		systemInfo: systemInfo,
		showSystemInfo: showSystemInfo
	};
});


/**
* @module 'brixy.err.helpers'
*/
BX.module.define('brixy.err.helpers', function() {
	
	/**
	* Save error and system information into a text file.
	* 
	* @memberOf module:'brixy.err.helpers'
	* @param {BX.error.ErrorChain} err
	* @param {string} description
	*/
	function saveErrorReport(err, description) {
		var filesystem = BX.module('brixy.fs.filesystem'),
			sysInfo = BX.module('brixy.debug.systemInfo').systemInfo().join('\n'),
			tx,
			cs = '',
			file;
		
		file = filesystem.saveDialog('Save error report', 'Text file:*.txt');
		
		if (!file)
			return;
			
		if (!(err instanceof BX.error.ErrorChain))
			err = new BX.error.ErrorChain('', err);
		
		if (typeof err.getCallStack === 'function')
			cs = err.getCallStack();
			
		tx = '========== System information: ==========\n\n' + sysInfo;
		if (cs)
			tx += '\n\n========== Call Stack: ==========\n\n' + cs;
		tx += '\n\n========== Errors: ==========\n\n' + err;
		if (description)
			tx += '\n\n========== Description: ==========\n\n' + description;
		
		file.open('w');
		file.writeln(tx);
		file.close();
	}
	
	
	// publish
	return {
		saveErrorReport: saveErrorReport
	};
});


/**
* @module 'brixy.err.ReleaseReporter'
*/
BX.module.define('brixy.err.ReleaseReporter', function() {
	var Sui = BX.module('brixy.ui.SuiBuilder').Me;
	
	Sui.attach(BX.module('brixy.ui.components.colorize'));
	
	/**
	* ReleaseReporter class.
	* @class
	* @alias module:'brixy.err.ReleaseReporter'~ReleaseReporter
	*/
	function ReleaseReporter() {
	}
	
	/**
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	ReleaseReporter.prototype.toString = BX.toString;

	/**
	* Shows report window.
	* 
	* @param {BX.error.ErrorChain|Error|string} err
	*/
	ReleaseReporter.prototype.report = function(err) {
		var b = new Sui();
		
		b.window('dialog', 'Error')
			.row().alignChildren('fill')
				.columnPanel().alignChildren('left')
					.staticText('An unexpected error occurred.').foregroundColor([1.0, 0.0, 0.0])
					.button('Save error report...').set('onClick', saveFile)
					.end()
				.column().alignChildren('fill')
					.button('OK').closeOnClick()
		.showWindow();
		
		function saveFile() {
			BX.module('brixy.err.helpers').saveErrorReport(err, '');
		}
	};
	
	
	// publish the class
	return {
		/** 
		* ReleaseReporter class.
		* @memberOf module:'brixy.err.ReleaseReporter'
		* @type {module:'brixy.err.ReleaseReporter'~ReleaseReporter}
		*/
		Me: ReleaseReporter
	};
});

	BX.error.addReporter('brixy.err.ReleaseReporter');

// application modules
/**
* @module 'brixy.debug.callStack'
*/
BX.module.define('brixy.debug.callStack', function() {

	/**
	* Shows a stack of method calls.
	* @memberOf module:'brixy.debug.callStack'
	* @param {string} [stack=$.stack] - Call stack. If not given, $.stack is used. (optional)
	*/
	function callStack(stack) {
		if (stack == undefined)
			stack = $.stack;
			
		var row,
			dial = new Window('dialog', 'Call stack'),
			panel = dial.add("panel {alignChildren: 'left', spacing: 2}"),
			gr = panel.graphics;
			
		gr.backgroundColor = gr.newBrush(gr.BrushType.SOLID_COLOR, [1.0, 1.0, 1.0]);
		gr.disabledBackgroundColor = gr.newBrush(gr.BrushType.SOLID_COLOR, [1.0, 1.0, 1.0]);

		var lines = (stack + '').split(/[\r\n]/),
			line,
			r,
			i = 0,
			n = lines.length;
		
		for ( ; i < n; i++) {
			line = lines[i];
			if (!line)
				continue;
				
			r = line.match(/^\[(.*)\]$/);
			if (r) {
				row = addFileRow(panel);
				addText(row, 'File: ' + r[1], [1.0, 0.0, 0.0]);
			}
			else {
				row = addMethodRow(panel);
				r = line.match(/^([^\(]*)(\(.*\))$/);
				if (r) {
					addText(row, r[1], [0.2, 0.2, 0.5]);
					addText(row, r[2], [0.5, 0.5, 0.5]);
				}
				else {
					addText(row, line, [0.2, 0.2, 0.5]);
				}
			}
		}
		
		dial.show();
	}
	
	function addFileRow(panel) {
		return panel.add('group {orientation: "row"}');
	}
	
	function addMethodRow(panel) {
		return panel.add('group {orientation: "row", indent: 10, spacing: 10}');
	}
	
	function addText(row, text, color) {
		var el = row.add('statictext');
		el.text = text.replace(/(&)/g, '&&');
		
		var gr = el.graphics;
		gr.foregroundColor = gr.newPen(gr.PenType.SOLID_COLOR, color, 1);
		gr.disabledForegroundColor = gr.newPen(gr.PenType.SOLID_COLOR, color, 1);
	}


	return {
		callStack: callStack
	};
});

/**
* @module 'brixy.err.DebugReporter'
*/
BX.module.define('brixy.err.DebugReporter', function() {
	var Sui = BX.module('brixy.ui.SuiBuilder').Me;
	
	Sui.attach(BX.module('brixy.ui.components.colorize'));
	
	/**
	* DebugReporter class.
	* @class
	* @alias module:'brixy.err.DebugReporter'~DebugReporter
	*/
	function DebugReporter() {
	}
	
	/**
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	DebugReporter.prototype.toString = BX.toString;

	/**
	* Shows report window.
	* 
	* @param {BX.error.ErrorChain|Error|string} err
	*/
	DebugReporter.prototype.report = function(err) {
		if (!(err instanceof BX.error.ErrorChain))
			err = new BX.error.ErrorChain('', err);
			
		var b = new Sui(),
			cs = (typeof err.getCallStack === 'function') ? err.getCallStack() : '',
			errs = (typeof err.getErrors === 'function') ? err.getErrors() : [];
		
		b.addComponents(components);
		
		b.window('dialog', 'Error report')
			.column().alignChildren('fill')
				.columnPanel().alignChildren('left').backgroundColor([1.0, 1.0, 1.0])
					.mainError(errs, cs)
					.end()
				.columnPanel().alignChildren('left').set('spacing', 4)
					.errorList(errs)
					.end()
				.row()
					.button('Save report...').set('helpTip', 'Error report and system information will be saved.').set('onClick', saveFile)
					.button('System info...').set('helpTip', 'Shows system information.').set('onClick', showSystemInfo)
					.end()
		.showWindow();
		
		function saveFile() {
			BX.module('brixy.err.helpers').saveErrorReport(err, '');
		}
		
		function showSystemInfo() {
			BX.module('brixy.debug.systemInfo').showSystemInfo();
		}
	};
	
	// define SuiBuilder components
	var components = {
		
		mainError: function (errors, callStack) {
			if (errors.length <= 0) {
				this.builder.staticLines('NO ERROR FOUND');
				return;
			}
			
			var er = errors[0];
			
			this.builder
				.staticLines(er.location, '-> ')
				.column().alignChildren('fill').set('spacing', 2)
					.staticLines(er.message, '', [1.0, 0.0, 0.0])
					.end()
				.row()
					.buttonsRow(er.fileName, er.line, callStack)
					.end();
		},

		errorList: function (errors) {
			var er,
				i,
				n = errors.length;
			
			for (i = 1; i < n; i++) {
				if (i > 1)
					this.builder.rowPanel().align('fill').end(); // separator line
				
				er = errors[i];
				
				this.builder
					.staticLines(er.location, '-> ')
					.staticLines(er.message)
					.row()
						.buttonsRow(er.fileName, er.line)
						.end();
			}
		},
	
		staticLines: function (str, prefix, color) {
			if (!str)
				return;
			
			if (!prefix)
				prefix = '';
				
			var lines = str.toString().split('\n'),
				i,
				n = lines.length;
			
			for (i = 0; i < n; i++) {
				if (lines[i] == '')
					continue;
				this.builder.staticText(prefix + lines[i]).doubleAmps();
				if (color)
					this.builder.foregroundColor(color);
			}
		},
		
		buttonsRow: function (file, line, callStack) {
			var f = file ? decodeURI(file) : '',
				fname = f ? f.substr(f.lastIndexOf('/') + 1) : '';
			
			if (/.+\.(jsxbin)$/i.test(file)) { // compiled file
				if (f)
					this.builder.staticText('File: ' + fname).doubleAmps()
					.set('helpTip', f);
				
				if (line)
					this.builder.staticText('Line: ' + line);
			}
			else {
				if (f)
					this.builder.button('File: ' + fname).doubleAmps()
					.set('helpTip', f)
					.set('fileName', file)
					.set('onClick', openFile);
					
				if (line)
					this.builder.button('Line: ' + line)
					.set('helpTip', 'Show code snippet.')
					.set('fileName', file)
					.set('line', line)
					.set('onClick', showCode);
			}
			
			if (callStack) {
				this.builder.button('Call stack')
				.set('helpTip', 'Show a call stack.')
				.set('callStack', callStack)
				.set('onClick', showCallStack);
			}
		},
		
		fileButton: function (file) {
			var f = file ? decodeURI(file) : '';
			if (f)  {
				this.builder.button('File: ' + f.substr(f.lastIndexOf('/') + 1)).doubleAmps()
					.set('helpTip', f)
					.set('fileName', file)
					.set('onClick', openFile);
			}
		}
		
	};
	
	function showCode() {
		var l = this.line,
			lmin = l - 10,
			lmax = l + 10,
			ch,
			i = 0,
			f,
			line;
		
		f = new File(this.fileName);
		if (!f.open('r')) {
			alert('File not found.');
			f.close();
			return;
		}
			
		var b = new Sui();
		
		b.addComponent('fileButton', components.fileButton);
		
		b.window('dialog', 'Code snippet - ' + f.displayName)
			.column().alignChildren('left')
				.columnPanel().alignChildren('left').set('spacing', 2).backgroundColor([1.0, 1.0, 1.0]);
					
				while (!f.eof) {
					i++;
					line = f.readln();
					if (i < lmin)
						continue;
					if (i > lmax)
						break;
					
					line = line.replace(/(\t)/g, '  ');
					ch = -1;
					while (line.charAt(++ch) === ' ');
					line = line.slice(ch);
					
					b.row().set('spacing', ch * 10 + 10)
						.staticText(i + ':').foregroundColor(i == l ? [1.0, 0.0, 0.0] : [0.6, 0.6, 0.6])				
						.staticText(line).doubleAmps().foregroundColor(i == l ? [1.0, 0.0, 0.0] : [0.2, 0.2, 0.5])
						.end();
				}
		
					b.end()
				.fileButton(this.fileName);
		b.showWindow();
		
		f.close();
	}
	
	function showCallStack() {
		BX.module('brixy.debug.callStack').callStack(this.callStack);
	}
	
	function openFile() {
		var f = new File(this.fileName);
		if (!f.execute())
			alert('File not found.');
	}
	
	
	// publish the class
	return {
		/** 
		* DebugReporter class.
		* @memberOf module:'brixy.err.DebugReporter'
		* @type {module:'brixy.err.DebugReporter'~DebugReporter}
		*/
		Me: DebugReporter
	};
});


/**
* 
*/
BX.module.define('app.linking.Controller', function() {
	var MvcController = BX.module.Me('brixy.mvc.Controller');
	
	function Controller(settings, linker) {
		MvcController.call(this); // parent constructor
		
		this.settings = settings; // service 'settings'
		this.linker = linker; // module 'app.model.Linker'
	}
	
	BX.subclass(Controller, MvcController); // subclassing
	
	Controller.injection = ['settings', 'app.model.Linker'];
	
	/**
	* First action of this controller.
	*/
	Controller.prototype.actionDefault = function () {
		var s = this.settings.getSetting();
		try {
			this.linker.link(s.sourceFile, s);
		}
		catch (e) {
			var r = new (BX.module.Me('brixy.err.DebugReporter'))();
			r.report(e);
			return 'app.settings.Controller';
		}
		
		this.setView('app.linking.View', s.sourceFile);
	};
	
	Controller.prototype.handleOK = function (view) {
		var file = view.targetFile;
		if (!file)
			return;
			
		file.encoding = this.settings.getSetting().targetEncoding;
		file.open('w');
		file.writeln(this.linker.getCode());
		file.close();
	};
	
	
	return {
		Me: Controller
	};
});
/**
* @module 'brixy.mvc.View'
*/
BX.module.define('brixy.mvc.View', function() {
	
	/**
	* Base View object.
	* @class
	* @alias module:'brixy.mvc.View'~View
	*/
	function View() {
	}
	
	/**
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	View.prototype.toString = BX.toString;
	
	/**
	* Subclass must override this method.
	* @param {...*} [arg1, arg2, ...] - Arguments passed from controller. (optional)
	* @return {string} - Name of the controller handler.
	*/
	View.prototype.render = function (/* arg1, arg2, ... */) {
		throw BX.error('brixy.mvc.View.render()', Error(this + '.render() method is not defined.'));
	};
	
	
	// publish the class
	return {
		/** 
		* Base View class.
		* @memberOf module:'brixy.mvc.View'
		* @type {module:'brixy.mvc.View'~View}
		*/
		Me: View
	};
});

/**
* 
*/
BX.module.define('app.linking.View', function() {
	
	var MvcView = BX.module.Me('brixy.mvc.View');
	
	function View() {
		MvcView.call(this); // parent constructor
		
		this.targetFile = null;
	}
	
	BX.subclass(View, MvcView); // subclassing
	
	View.prototype.render = function (sourceFile) {
		var filesystem = BX.module('brixy.fs.filesystem'),
			i,
			n;
		
		Folder.current = sourceFile.parent;
		
		i = sourceFile.displayName.lastIndexOf('.');
		n = (i >= 0) ? sourceFile.displayName.substring(0, i) : sourceFile.displayName;
		this.targetFile = File(Folder.current + '/' + n + '-linked.jsx');
		
		this.targetFile = filesystem.saveDialog('Save the linked file', 'ExtendScript file:*.jsx;*.jsxinc;*.js', this.targetFile);
		
		if (this.targetFile)
			return 'OK';
	};	

	
	return {
		Me: View
	};
});
/**
 * Warning: This module definition works in 'skip' rewrite mode. It does not throw an exception, if module already exists.
 * @module 'brixy.fs.FileLoader'
 */
BX.module.define('brixy.fs.FileLoader', function() {
	
	/**
	* FileLoader class. Subclass or instance should at least define own `onLoadFile(file)` method.
	* @class
	* @alias module:'brixy.fs.FileLoader'~FileLoader
	*/
	function FileLoader() {
		this._aliases = {}; // fullNames of the folder aliases
		this._loaded = []; // fullNames of the loaded files
	}
	
	/**
	* Returns a string representation of the object.
	* @method
	* @return {string}
	*/
	FileLoader.prototype.toString = BX.toString;
	
	/**
	* Creates alias of the folder path.
	* @param {string} alias - Folder shortcut.
	* @param {string} path - Folder path relative to the home folder (alias for '') or absolute path.
	* @throws Exception if folder doesn't exist.
	* @throws Exception if alias already exists for a different path.
	*/
	FileLoader.prototype.alias = function(alias, path) {
		if (arguments.length === 1) {
			path = alias;
			alias = '';
		}
		
		var a = 'a_' + alias,
			home = this.aliasPath(''),
			f,
			p = (path += '');
			
		if (home && p)
			p = '/' + p; // multiple / are ignored by Extend Script
		
		f = Folder(home + p); // relative to the home folder
		
		if (!f.exists)
			f = Folder(path); // or absolute path
			
		if (f instanceof File)
			f = f.parent;
			
		if (!f.exists)
			throw Error('Creating of the alias "' + alias + '" failed. Not found the "' + f.fullName + '".');
		
		if (this._aliases.hasOwnProperty(a)) {
			if (f.fullName != this._aliases[a])
				throw Error('Creating of the alias "' + alias + '" failed. Alias already exists with path:\n' + this._aliases[a]);
			
			return;
		}

		this._aliases[a] = f.fullName;
	};
	
	/**
	* Stores path to the included list to prevent the further loading.
	* Doesn't test if file exists.
	* @param {string} alias - Folder shortcut.
	* @param {string} path - File or folder path.
	* @throws Exception if alias doesn't exist.
	*/
	FileLoader.prototype.ignore = function(alias, path) {
		var a = this.aliasPath(alias),
			f,
			p = (path += '');
			
		if (a && p)
			p = '/' + p; // multiple / are ignored by Extend Script
			
		f = File(a + p); // relative to the alias
		
		if (!f.exists && !alias)
			f = File(path); // or absolute path
			
		if (!f.exists)
			throw Error('Cannot ignore alias "' + alias + '". Not found the file "' + f.fullName + '".');
		
		f = f.fullName; // keep the consistent encoding
		
		if (!this.isLoaded(f))
			this.addPath(f);
	};
	
	/**
	* Includes jsx|jsxinc|js|jsxbin file. Folders are traversed recursively.
	* Each file is included only once.
	* @param {string} alias - Folder shortcut.
	* @param {string} path - File or folder path.
	* @throws Exception if alias or file doesn't exist.
	*/
	FileLoader.prototype.load = function(alias, path) {
		var a = this.aliasPath(alias);
		
		path = (path == undefined) ? '' : path + '';
			
		if (a && path)
			path = '/' + path; // multiple / are ignored by Extend Script
			
		this.loadFile(File(a + path));
	};
	
	/**
	* Loads the file if it is of an allowed type. Each file is loaded only once.
	* @param {File|Folder} file - File or folder object.
	* @throws Exception if file doesn't exist.
	*/
	FileLoader.prototype.loadFile = function(file) {
		var path;
		
		file = File(file);
		if (!file.exists)
			throw Error('Not found the file "' + file.fullName + '".');

		if (this.isLoaded(path = file.fullName))
			return;
			
		this._loaded.push(path);
		
		if (file instanceof File) {
			if (this.isAllowedFile(path))
				this.onLoadFile(file);
		}
		else if (this.isAllowedFolder(path)) {
			this.onLoadFolder(file);
		}
	};
	
	/**
	* Does nothing.
	* Subclass or instance should define own onLoadFile method.
	* @param {File} file
	*/
	FileLoader.prototype.onLoadFile = function(file) {
	};
	
	/**
	* Loads files and folders. Folders are traversed recursively.
	* Subclass or instance may define own onLoadFolder method.
	* @param {Folder} folder
	*/
	FileLoader.prototype.onLoadFolder = function(folder) {
		var list;
		
		folder = Folder(folder);
		list = folder.getFiles();
		if (!list)
			return;
			
		for (var i = 0, n = list.length; i < n; i++) {
			this.loadFile(list[i]);
		}
	};
	
	/**
	* Filters the file. Subclass or instance may define own fileFilter method.
	* @param {string} path - Full path of the file.
	* @return {boolean}
	*/
	FileLoader.prototype.isAllowedFile = function(path) {
		return /.+\.(jsx|jsxinc|jsxbin|js)$/i.test(path);
	};
	
	/**
	* Filters the folder. Subclass or instance may define own fileFilter method.
	* @param {string} path - Full path of the folder.
	* @return {boolean}
	*/
	FileLoader.prototype.isAllowedFolder = function(path) {
		return true;
	};
	
	/**
	* Returns full path of the alias.
	* @param {string} alias
	* @throws Exception if alias doesn't exist.
	*/
	FileLoader.prototype.aliasPath = function(alias) {
		var a = 'a_' + alias;
			
		if (this._aliases.hasOwnProperty(a))
			return this._aliases[a];
		
		if (a === 'a_') // path to home folder may be undefined
			return '';
			
		throw Error('Alias "' + alias + '" does not exist.');
	};
	
	/**
	* Return the array of the included file paths.
	* @return {string[]} - Array of the included file paths.
	*/
	FileLoader.prototype.loadedPaths = function() {
		return Array.prototype.concat(this._loaded);
	};
	
	/**
	* Tests if the path is already included.
	* @param {string} path - Full path of the file.
	*/
	FileLoader.prototype.isLoaded = function(path) {
		var i = 0,
			n = this._loaded.length;
		
		for ( ; i < n; i++) {
			if (this._loaded[i] === path)
				return true;
		}
		
		return false;
	};
	
	/**
	* Adds the include path without applying of the file filter.
	* @param {string} path
	*/
	FileLoader.prototype.addPath = function(path) {
		this._loaded.push(path);
	};
	
	
	// publish
	return {
		/** 
		* FileLoader class.
		* @memberOf module:'brixy.fs.FileLoader'
		* @type {module:'brixy.fs.FileLoader'~FileLoader}
		*/
		Me: FileLoader
	};
}, 'skip'); // do not redefine existing module

BX.module.define('app.model.JsxLoader', function() {
	
	var FileLoader = BX.module.Me('brixy.fs.FileLoader');

/** JsxLoader:
* 
* #include:
* - include always
* - absolute path or relative to this file
* - parameters are double quoted / single quoted / not quoted
* - #include *.jsxbin -> app.doScript("jsxbin code"); (InDesign supports it)
* 
* BX.use / BX.use.use:
* - includes each file only once
* - parameters are double quoted / single quoted, not allowed character ')', allowed $.fileName as the second parameter
* - absolute path or relative to the home folder (alias = '')
* 
* BX.use.alias / BX.use.ignore:
* - parameters are double quoted / single quoted, not allowed character ')', allowed $.fileName as the second parameter
* - used only in Linker
* - not copied to the target file
* 
* Note:
* - does not recognize multiline form of calls like #include\n"file" or BX\n.use()
* - line can start with whitespace only
* 
* Linker comment directives:
* - only one directive on the line
* - line can start with whitespace only
* LINKER-DEL - not executed by the Linker, not copied to the target file
* LINKER-ADD - not executed by the Linker, but is copied to the target file
* LINKER-KEEP - is copied to the target file, also is executed by the Linker
* LINKER-APPLY - is executed by the Linker, but not copied to the target file
*/

	/**
	* JsxLoader constructor.
	* 
	* @class JsxLoader
	*/
	function JsxLoader(){
		FileLoader.call(this); // parent constructor
		
		this._sourcePath = ''; // full path to the main source file
		this._code = ''; // linked code

		this.options = {
			replaceCoreLib: false, // replace the "Brixy.jsxinc" with "BrixyCore.jsxinc" file in #include directives
			sourceEncoding: '' // '' automatic detection, UTF-8, ...
		};
		
	}
	
	BX.subclass(JsxLoader, FileLoader);
	
	/**
	* Returns linked code.
	* @return {string}
	*/
	JsxLoader.prototype.getCode = function() {
		return this._code;
	};
	
	/**
	* Removes aliases, loaded paths and linked code.
	*/
	JsxLoader.prototype.clear = function() {
		this._sourcePath = '';
		this._code = '';
		this._aliases = {};
		this._loaded = [];
	};
	
	/**
	* Sets loader options.
	* @param {Object} options
	*/
	JsxLoader.prototype.setOptions = function(options) {
		for (var p in options) {
			if (p in this.options)
				this.options[p] = options[p];
		}
		
		if (!File.isEncodingAvailable(this.options.sourceEncoding))
			this.options.sourceEncoding = '';
	};

	/**
	 * Makes the linking.
	 * @param {File} file
	 */
	JsxLoader.prototype.link = function(file) {
		this.clear();
		this._sourcePath = file.fullName;
		this.addPath(this._sourcePath);
		this.onLoadFile(file);
	};

	JsxLoader.regulars = {
		liDel: /^\s*(\/\*\s*LINKER-DEL\s*\*\/|\/\/\s*LINKER-DEL)/i,
		liKeep: /^\s*(\/\*\s*LINKER-KEEP\s*\*\/|\/\/\s*LINKER-KEEP)(.*)$/i,
		liAdd: /^\s*\/\/\s*LINKER-ADD(.*)$/i,
		liApply: /^\s*\/\/\s*LINKER-APPLY(.*)$/i,
		incl: /^\s*#include(?:\s*"([^"]*)"|\s*'([^']*)'|\s+([^\s;]+))/,
		use: /^\s*BX\s*\.\s*(?:(use)|use\s*\.\s*(use|alias|ignore))\s*\((.+?)\)/,
		useArg2: /^\s*("(.*)"|'(.*)')\s*,\s*("(.*)"|'(.*)'|(\$\s*\.\s*fileName)|(_LINKER_SCRIPT_FILE_))\s*$/,
		useArg1: /^\s*("(.*)"|'(.*)'|(\$\s*\.\s*fileName)|(_LINKER_SCRIPT_FILE_))\s*$/
	};
	
	/**
	* Copy contents of the file and included files to resulted code.
	* @param {File} file
	* @return {string}
	*/
	JsxLoader.prototype.onLoadFile = function(file) {
		try {
			this.openFile(file);
			
			if (/.+\.jsxbin$/i.test(file.name)) { // *.jsxbin file
				this._code += '\napp.doScript("' + file.read().replace(/(\n|\r)/g, '') + '");';
				
				file.close();
				return;
			}

			this.readFile(file);
			file.close();
		}
		catch (e) {
			throw new BX.error('app.model.JsxLoader.onLoadFile()', Error('Failed linking of the file: "' + file + '"'), e);
		}
	};
	
	/**
	* Reads the file.
	* @param {File} file
	* @return {string}
	*/
	JsxLoader.prototype.readFile = function(file) {
		var regs = JsxLoader.regulars,
			line,
			res,
			resKeep,
			s,
			f,
			p1,
			p2;
		
		while (!file.eof) {
			line = file.readln();
			
			if (line === '' || regs.liDel.test(line)) { // empty line or /*LINKER-DEL*/ or //LINKER-DEL
				this._code += '\n';
				continue;
			}
			
			res = line.match(regs.liAdd); // //LINKER-ADD
			if (res) {
				this._code += '\n' + res[1];
				continue;
			}
			
			resKeep = line.match(regs.liKeep); // /*LINKER-KEEP*/ or //LINKER-KEEP
			if (resKeep) {
				this._code += '\n' + resKeep[2];
				line = resKeep[2];
			}
			else {
				res = line.match(regs.liApply); // //LINKER-APPLY
				if (res) {
					line = res[1];
				}
			}
			
			res = line.match(regs.incl); // #include directive
			if (res) { // always loads the file
				f = createFile(file.parent, res[1] || res[2] || res[3]);
				if (this.options.replaceCoreLib && f.name === 'Brixy.jsxinc') { // replace core library
					f = createFile(f.parent, '/BrixyCore.jsxinc');
				}
				this.onLoadFile(f);
			}
			else {
				// BX.use, BX.use.use, BX.use.alias, BX.use.ignore
				res = line.match(regs.use);
				if (res) {
					s = res[3].match(regs.useArg2); // version with two arguments
					if (s) {
						p1 = s[2] || s[3];
						p2 = s[7] ? file.fullName : (s[8] ? this._sourcePath : s[5] || s[6]);
					}
					else {
						s = res[3].match(regs.useArg1); // version with single argument
						if (s) {
							p1 = '';
							p2 = s[4] ? file.fullName : (s[5] ? this._sourcePath : s[2] || s[3]);
						}
					}
				}
				
				if (res && s) {
					switch (res[2] || res[1]) {
					case 'use':
						this.load(p1, p2);
						break;
						
					case 'alias':
						this.alias(p1, p2);
						break;
						
					case 'ignore':
						this.ignore(p1, p2);
						break;
					}
				}
				else { // any other line
					if (!resKeep) // LINKER_KEEP line has already been added
						this._code += '\n' + line;
				}
			}	
		}
	};
	
	/**
	* Opens the file.
	* @param {File} file
	*/
	JsxLoader.prototype.openFile = function(file) {
		if (this.options.sourceEncoding)
			file.encoding = this.options.sourceEncoding;
		
		if (!file.open('r'))
			throw new BX.error('app.model.JsxLoader.openFile()', '', Error('Cannot open file "' + file + '"'));
	};
	
	/**
	* Creates File object.
	* @param {string|Folder} parent - Parent folder.
	* @param {string} path - File path.
	* @return {File}
	*/
	function createFile(parent, path) {
		var file = File(parent + '/' + path); // relative
		
		if (!file.exists)
			file = File(path); // absolute

		if (!file.exists)
			throw Error('File "' + path + '" doesn\'t exists.');

		if (file instanceof Folder)
			throw Error('Cannot link folder "' + path + '". File is expected.');
		
		return file;
	}
	
	
	return {
		Me: JsxLoader
	};
});

BX.module.define('app.model.Linker', function() {

	/**
	* Linker constructor.
	* 
	* @class Linker
	*/
	function Linker(loader){
		this._loader = loader;
	}
	
	Linker.injection = ['app.model.JsxLoader'];
	
	/**
	* Returns a string representation of the object.
	* @return {string}
	*/
	Linker.prototype.toString = BX.toString;
	
	Linker.prototype.link = function(file, options) {
		var loader = this._loader;
		
		try {
			if (!(file instanceof File) || !file.exists)
				throw Error('File not found.');
			
			loader.setOptions(options);
			loader.link(file);
		}
		catch (e) {
			throw new BX.error('app.model.Linker.link()', Error('Linker error.'), e);
		}
	};
	
	Linker.prototype.getCode = function() {
		return this._loader.getCode();
	};
	
	
	return {
		Me: Linker
	};
	
});

BX.module.define('app.model.Settings', function() {

	/**
	* Settings constructor.
	* 
	* @class Settings
	*/
	function Settings(){
		this._values = {
			sourceFile: null,
			replaceCoreLib: false,
			sourceEncoding: '',
			targetEncoding: 'UTF-8',
			encodingList: getLocalEncodings()
		};
		
	}
	
	/**
	* Returns a string representation of the object.
	* @return {string}
	*/
	Settings.prototype.toString = BX.toString;
	
	Settings.prototype.getSetting = function() {
		return this._values;
	};
	
	Settings.prototype.setValues = function(values) {
		for (var v in values) {
			if (v in this._values)
				this._values[v] = values[v];
		}
	};
	
	function getLocalEncodings () {
		var encs = allEncodings,
			e,
			i = 0,
			n = encs.length,
			r = ['','automatic','UTF-8','-'],
			av = File.isEncodingAvailable;
			
		for ( ; i < n; i++) {
			e = encs[i];
			if (av(e))
				r.push(e);
		}
		return r;
	}
	
	var allEncodings = ['UTF-8','UTF-16','UTF-16LE','UTF-16BE','CP1252','ISO-8859-1','MACINTOSH','ASCII','CP367','UCS2','UCS2LE','UCS2BE','UCS4','UCS4LE','UCS4BE','BINARY','UTF-7',
'ISO-8859-2','ISO-8859-3','ISO-8859-4','ISO-8859-5','ISO-8859-6','ISO-8859-7','ISO-8859-8','ISO-8859-9','ISO-8859-10','ISO-8859-13','ISO-8859-14','ISO-8859-15','ISO-8859-16',
'CP850','CP866','CP932','CP936','CP949','CP950','CP1250','CP1251','CP1252','CP1253','CP1254','CP1255','CP1256','CP1257','CP1258','CP1361','EUC-JP','EUC-KR','HZ',
'X-MAC-JAPANESE','X-MAC-GREEK','X-MAC-CYRILLIC','X-MAC-LATIN','X-MAC-ICELANDIC','X-MAC-TURKISH','CP437','CP709','EBCDIC','KOI-8R','KOI-8U','ISO-2022-JP','ISO-2022-KR',
'TIS-620','CP874','JP','JIS-X0201','JIS-X0208','JIS-X0212','CN','ISO-IR-16','KSC-5601','EUC-CN','EUC-TW'].sort();
	
	
	return {
		Me: Settings
	};
	
});
/**
* 
*/
BX.module.define('app.settings.Controller', function() {
	
	var MvcController = BX.module.Me('brixy.mvc.Controller');
	
	function Controller(settings) {
		MvcController.call(this); // parent constructor
		
		this.settings = settings; // service 'settings'
	}
	
	BX.subclass(Controller, MvcController); // subclassing
	
	Controller.injection = ['settings'];
	
	/**
	* First action of this controller.
	* 
	* @return {string} - Next controller.
	*/
	Controller.prototype.actionDefault = function () {
		this.setView('app.settings.View', this.settings.getSetting());
	};
	
	Controller.prototype.handleOK = function (view) {
		this.settings.setValues(view.settings);
		return 'app.linking.Controller';
	};

	
	return {
		Me: Controller
	};
});

/**
* 
*/
BX.module.define('app.settings.View', function() {
	
	var MvcView = BX.module.Me('brixy.mvc.View'),
		Sui = BX.module('brixy.ui.SuiBuilder').Me;
	
	function View() {
		MvcView.call(this); // parent constructor
		
		this.settings = {};
	}
	
	BX.subclass(View, MvcView); // subclassing
	
	View.prototype.render = function (settings) {
		var filesystem = BX.module('brixy.fs.filesystem'),
			b = new Sui('Linker'),
			file = settings.sourceFile ? settings.sourceFile : null;
		
		// dialog
		b.window('dialog', 'Brixy Linker')
			.row().alignChildren('top')
				.columnPanel().alignChildren('left').set('spacing', 20)
					.row()
						.staticText('Source file:')
						.editText('{characters: 35, properties: {readonly: true}}').id('source').set('text', file ? file.displayName : '').validator('required', 'text', 'Please choose a source script file.')
						.button('Browse...').set('onClick', selectSource)
						.end()
					.checkbox('Do not insert BX.use namespace to the linked file').id('replaceCoreLib').set('value', settings.replaceCoreLib).set('helpTip', 'It will include the "BrixyCore.jsxinc" file instead of the "Brixy.jsxinc" into the linked file.')
					.row()
						.staticText('Target encoding:').labelFor('targetEncoding')
						.editText('{characters: 15}').id('targetEncoding').set('text', settings.targetEncoding).set('helpTip', 'Encoding of linked file. Leave empty for automatic encoding.')
							.validator(function(){
								var text = this.text;
								
								if (text === '' || text === 'automatic')
									return;
								if (!File.isEncodingAvailable(text))
									throw 'Encoding "' + text + '" is not available on this machine.';
							})
						.dropDownList(settings.encodingList).set('selection', 0).set('helpTip', 'The list of available encodings.').set('onChange', function() {
								var t = this.selection.text;
								this.selection = 0;
								b.get('targetEncoding').text = t;
							})
							.end()
						.end()
					.end()
				.column()
					.button('{text: "OK", properties: {name: "ok"}}').closeOnClick(true, 1)
		.showWindow();

		if (b.result() != 1 || !file)
			return;
		
		this.settings = {
			sourceFile: file,
			replaceCoreLib: b.get('replaceCoreLib').value,
			targetEncoding: b.get('targetEncoding').text
		};
		
		return 'OK';
		
		/*
		* Select source file.
		*/
		function selectSource() {
			file = filesystem.openDialog('Open a script file', 'ExtendScript files:*.jsx;*.jsxinc;*.js;*.jsxbin', false);
			b.get('source').text = file ? file.displayName : '';
		}

	};	

	
	return {
		Me: View
	};
});

// create application
BX.apps.add({
	
	autorun: 'app.settings.Controller',
	
	services: {
		settings: 'app.model.Settings'
	}
});
	}
	catch (e) {
		// report errors
		BX.error.report(e);
	}

	// public interface
	return {
		processEvent: function (event, data) {
			BX.apps.processEvent(event, data);
		}
	};

};

launch($.fileName);

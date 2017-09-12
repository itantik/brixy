---
title: Standalone usage
draft: false
order: 1
edited: 2017/06/16
---
You can use DI `Container` [API](API_LINK/module-_brixy.di.Container_-Container.html) separately in your own applications. Simply load required module.

````javascript
// include core Brixy library
#include 'path/to/Brixy/includes/Brixy.jsxinc';
// include DI Container module
BX.use('brixy', 'modules/di/Container.jsxinc');

// create DI container
var container = new BX.module.Me('brixy.di.Container');
````

## Creating instances

`getInstance(subject, injection)` [API](API_LINK/module-_brixy.di.Container_-Container.html#getInstance) 

This method can create instance from:

| subject type | instance |
| --- | --- | --- |
| service name | creates/returns instance of the service (`injection` argument is not applied) |
| module name | property `Me` of this module is used as constructor of a new instance |
| Function | function is used as constructor of a new instance |
| Object | object is returned unchanged (`injection` argument is not applied) |

Example:

````javascript
// include core Brixy library
#include 'path/to/Brixy/includes/Brixy.jsxinc';
// include DI Container module
BX.use('brixy', 'modules/di/Container.jsxinc');

// define a module as wrapper of the class
BX.module.define('my.module', function() {
	
	// define MyClass
	function MyClass() {
	}
	
	// publish MyClass as module's 'Me' property
	return {
		Me: MyClass
	};
});

// DI container
var container = new BX.module.Me('brixy.di.Container');
// use DI container to create a new MyClass instance
var my = container.getInstance('my.module');
````

## Injection

Brixy DI container uses constructor injection. It looks for `'injection'` property which allows to resolve types of object dependencies. `'injection'` is array of constructors or module names that container instantiates and then passes as arguments to the object constructor.

Example:

````javascript
// define a module as wrapper of the class
BX.module.define('my.module', function() {
	
	// define MyClass with dependencies
	function MyClass(wantedOne, wantedTwo) {
		this.one = wantedOne;
		this.two = wantedTwo;
	}
	// specify types of dependecies
	MyClass.injection = ['module.One', 'module.Two'];
	
	// publish MyClass as module's 'Me' property
	return {
		Me: MyClass
	};
});

// use DI container to create a new MyClass instance
var my = container.getInstance('my.module');
````

## Services

DI container contains a repository for objects that can be used in various locations of your application. These objects are instanciated in case of the first use and are stored as named services throughout application life.

Services should be registered in DI Container.

Example:

````javascript
// register services
container.registerServices({
	'myService': 'service.module',
	'secondService': new AnotherServiceClass()
});

// define service module
BX.module.define('service.module', function() {
	
	// define ServiceClass
	function ServiceClass() {
	}
	// ...
	
	// publish ServiceClass as module's 'Me' property
	return {
		Me: ServiceClass
	};
});

// define a module
BX.module.define('my.module1', function() {
	
	// define MyClass with dependencies
	function MyClass(wantedOne, wantedTwo, module2) {
		this.one = wantedOne; // 'myService'
		this.two = wantedTwo; // 'secondService'
		this.module2 = module2; // new 'my.module2'.MyClass instance
	}
	// specify types of dependecies
	MyClass.injection = ['myService', 'secondService', 'my.module2'];
	
	// publish MyClass as module's 'Me' property
	return {
		Me: MyClass
	};
});

// define another module
BX.module.define('my.module2', function() {
	
	// define MyClass with dependencies
	function MyClass(wantedOne) {
		this.one = wantedOne; // 'myService'
	}
	// specify types of dependecies
	MyClass.injection = ['myService'];
	
	// publish MyClass as module's 'Me' property
	return {
		Me: MyClass
	};
});

// use DI container to create instances of two module's classes
var my1 = container.getInstance('my.module1');
var my2 = container.getInstance('my.module2');
// now my1 and my2 use the same 'service.module'.ServiceClass instance
alert(my1.one === my2.one); // true
````

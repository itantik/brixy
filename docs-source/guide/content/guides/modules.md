---
title: Module system
draft: false
order: 2
edited: 2016/07/16
---
Brixy implements own asynchronous module system. Module is a container of the code. It si an essential tool for making a **well maintainable code**.

The advantages of the modules:
- It hides variables and methods and **keeps clear your global scope**.
- It **prevents conflicts** with variable names.
- It allows to simply **separate** logic parts of your code.
- It allows to create **reusable** pieces of code.

Modules are implemented as function closures.

## Definition

`BX.module.define(name, methodOrObject, rewriteMode)` [API](API_LINK/BX.module.html#.define)

Example:
```javascript
BX.module.define('module.zoo', function() {
	
	// this code is hidden inside module
	
	// private variables
	var animals = [];
	
	// private methods
	function add(animal) {
		animals.push(animal);
	}
	function count() {
		return animals.length;
	}
	
	
	// exposed module property and methods
	return {
		add: add,
		count: count
	};
});
```

## Using

`BX.module(name)` [API](API_LINK/BX.module.html#.module)

Example:
```javascript
var myZoo = BX.module('module.zoo');

myZoo.add('elephant');
myZoo.add('lion');
myZoo.add('parrot');
alert('I have ' + myZoo.count() + ' animals.');

```

## Naming convention

Generally there is no restriction on the naming of your modules.

**A goog practice:** Try to mirror the folder structure in the module name. Eg. Source file `"model/people.jsxinc"` contains the module `"model.people"`.

**Brixy framework speciality:** The Route object [API](API_LINK/module-_brixy.mvc.Router_-Route.html#.parseRequestString) in MVC applications uses characters `:?=` for parsing application requests. Avoid using these characters in the names of modules, especially the controllers, that will be used as application requests.

## `"Me"` property

Module's `Me` property has special meaning in Brixy framework. Because many modules encapsulates a class definition, Brixy framework expects that class constructor method is assigned to the module's `Me` property. It allows to use the module name instead of the class.

Example:
```javascript
BX.module.define('shapes.Circle', function() {
	
	// constructor
	function Circle(radius) {
		this.radius = radius;
	}
	// methods
	Circle.prototype.circumference = function() {
		return 2 * 3.1415927 * this.radius;
	};
	Circle.prototype.area = function() {
		return 3.1415927 * this.radius * this.radius;
	};
	
	
	// exposed class
	return {
		Me: Circle
	};
});

var CircleClass = BX.module.Me('shapes.Circle');
var myCircle = new CircleClass(10);
alert(myCircle.circumference());
```


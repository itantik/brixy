---
title: DI in MVC application
draft: false
order: 2
edited: 2017/06/16
---
Brixy MVC application uses built-in DI `Container` [API](API_LINK/module-_brixy.di.Container_-Container.html) for creating all controllers and its dependencies.

## Controllers

Use `injection` property to inject dependencies to controller. Application automatically creates all dependecies and injects to controller.

````javascript
// controller module
BX.module.define('myController', function() {
	var MvcController = BX.module.Me('brixy.mvc.Controller');
	
	function Controller(module1, module2) {
		MvcController.call(this); // parent constructor
		
		// injected dependencies
		this.module1 = module1;
		this.module2 = module2;
	}
	
	BX.subclass(Controller, MvcController); // subclassing
	
	// list of dependencies
	Controller.injection = ['myModule1', 'myModule2'];
	
	// and the rest of the controller code...

});
````

## Services

You can register services in the application configuration object. Application automatically registers it in the DI Container. See [MVC configuration guide](../../mvc-application/configuration.html).
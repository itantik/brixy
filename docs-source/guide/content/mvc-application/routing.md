---
title: Routing
draft: false
order: 4
edited: 2016/11/27
---
Routing is a conversion from application request to controller action. Requests are sent from controllers (as the return of the methods `actionName()` and `handleName()`) to the application in the form of string or object.

## Request format

Full format of the string request: `"ControllerModule:Action?prop1=val1&prop2=val2"`

and equivalent object request: `{controller: "ControllerModule", action: "Action", data: {prop1: val1, prop2: val2}}`

- `"ControllerModule"` is module name of the controller. This is the only required part of the request string. It shall not contain characters `:` and `?`.
- `":"` is action separator.
- `"Action"` is name of the action method. If omitted, `"Default"` is used. It shall not contain character `?`.
- `"?"` is data separator.
- `"prop1=val1&prop2=val2"` optional data passed to the action method.

Valid examples of the request strings:

```javascript
"controller"
"controller:action"
"controller:action?par1=value1"
"controller?par1=value1"
"controller:action?par1=value1&par2=value2"
"controller:action?par1&par2=value2"
```

## Predefined routes

You can predefine common named requests. These general routes works as shortcuts to full requests. You can use these routes in many places of the application. When the controller name is changed, you need only change one route.

Define your routes in the _MyApp/config.jsxinc_ file.

Example:

````javascript
BX.apps.add({
	
	// ...
	
	routes: {
		Editor: 'app.editor.Controller',
		Presets: 'app.presets.Controller'
	}
	
	// ...
});
````

Your request in controller will look like: `"Editor"` or as object `{forward: "Editor"}`. Note the use of `forward` property instead of `controller`.

## Services in requests

If some controllers are defined as services in the dependency injection container, you can use the service name instead of the controller module name. 

Define your services in the _MyApp/config.jsxinc_ file.

Example:

````javascript
BX.apps.add({
	
	// ...
	
	services: {
		selectorCtrl: 'app.selector.Controller'
	}
	
	// ...
});
````

Corresponding request in controller will look like:

````javascript
Controller.prototype.actionDefault = function (data) {
	
	// ...
	
	// next application request
	return 'selectorCtrl';
	// or as object
	// return {controller: 'selectorCtrl'};
};
````

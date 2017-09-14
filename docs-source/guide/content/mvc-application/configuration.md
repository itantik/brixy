---
title: Configuration
draft: false
order: 3
edited: 2017/04/12
---
Configuration object is a seed of your application. 

Use `BX.apps.add(configuration)`[API](API_LINK/module-_brixy.mvc.AppManager_-AppManager.html#add) method to put your application into application manager repository. Application manager holds configuration object until the first application request. Just at that moment creates an application instance.

## Options

Configuration object can set any of these options:

| name | type | description |
| --- | --- | --- |
| `id` | string | Unique identifier of the application. Application manager prevents to create a duplicate application with the same id. |
| `autorun` | string | The first application request automatically sended by the application manager. |
| `routes` | Object | A set of predefined routes. Route is a shortcut to full application request. |
| `events` | Object | A set of application events. Event can call a route or application request. |
| `services` | Object | A set of services which will be registered in the dependency injection `Container` [API](API_LINK/module-_brixy.di.Container_-Container.html). |
| `application` | string or Function | Module name or constructor of the application object. Default is `'brixy.mvc.Application'` [API](API_LINK/module-_brixy.mvc.Application_.html). In most cases you will not need to change this. |
| `container` | string or Function or Object | Module name or constructor or instance of the dependency injection container. Default is `'brixy.di.Container'` [API](API_LINK/module-_brixy.di.Container_.html). In most cases you will not need to change this. |
| `requestRouter` | string or Function or Object | Module name or constructor or instance of the application request router. Default is `'brixy.mvc.Router'` [API](API_LINK/module-_brixy.mvc.Router_.html). In most cases you will not need to change this. |
| `eventRouter` | string or Function or Object | Module name or constructor or instance of the application event router. Default is `'brixy.mvc.Router'` [API](API_LINK/module-_brixy.mvc.Router_.html). In most cases you will not need to change this. |

Example:

````javascript
BX.apps.add({
	
	startup: 'app.editor.Controller'

});
````

Example:

````javascript
BX.apps.add({
	
	id: 'MyApp',
	
	startup: 'Presets',
	
	routes: {
		Editor: 'app.editor.Controller',
		Presets: 'app.presets.Controller'
	},
	
	services: {
		Settings: 'app.model.Settings',
		Store: 'app.model.Store'
	}

});
````

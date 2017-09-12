---
title: ScriptUI Builder
draft: false
order: 3
edited: 2017/01/20
---

`SuiBuilder`[API](API_LINK/module-_brixy.ui.SuiBuilder_-SuiBuilder.html) provides its own way of building a user interface based on the Adobe ScriptUI. It features:
- a prepared set of the Adobe ScriptUI components
- extensibility via custom components
- built-in validators
- well readable and maintainable [fluent interface](https://en.wikipedia.org/wiki/Fluent_interface) API design

## Including into application

Brixy framework offers a prepared script that includes `SuiBuilder` module and loads a set of base ScriptUI components and helpful debug methods.

Including in Brixy MVC application:
```javascript
BX.use('brixy', 'includes/suiBuilderPack.jsxinc');
```

Including in application not based on Brixy MVC application framework:
```javascript
// required core Brixy library
#include 'path/to/Brixy/includes/Brixy.jsxinc'

// SuiBuilder library
#include 'path/to/Brixy/includes/suiBuilderPack.jsxinc'
```

## First dialog window

Load module:
```javascript
var SuiBuilder = BX.module.Me('brixy.ui.SuiBuilder');
```

Create `SuiBuilder` instance:
```javascript
var b = new SuiBuilder();
```

For each dialog window we need one `SuiBuilder` instance. First of all we should create the window itself. The `window()` factory method creates new ScriptUI `Window` component:
```javascript
b.window('dialog', 'Hello World');
```

 Now we can add window's components by calling their factory methods. Create SuiBuilder `row` component. It is wrapper to the ScriptUI `group` component with orientation `'row'`. SuiBuilder always places new components inside the last created container component. So `row` is appended inside the window.
```javascript
b.row();
```

Now we will add SuiBuilder `staticText` component as wrapper to the ScriptUI `statictext` component. Because the `row` is recently created container component, new `staticText` component is appended as its child component.
```javascript
b.staticText('Hello World!');
```

Add SuiBuilder `button` component as wrapper to the ScriptUI `button`. Button is also added as child of the `row` component. Note that previous `staticText` is not container component.
```javascript
b.button('OK');
```

And finally show the window:
```javascript
b.showWindow();
```

Complete script:
```javascript
var b = new SuiBuilder();
b.window('dialog', 'Hello World')
	.row()
		.staticText('Hello World!')
		.button('OK')
	.showWindow();
```

Note the use of the [fluent interface](https://en.wikipedia.org/wiki/Fluent_interface) API design that allows you to chain method calls. It is clear and well readable code.

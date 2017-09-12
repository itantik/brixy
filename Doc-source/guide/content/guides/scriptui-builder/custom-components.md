---
title: Custom components
draft: false
order: 3
edited: 2017/01/24
---

SuiBuilder allows the registration of custom components in the form of factory methods. Many examples can be found in folder _Brixy/modules/ui/components_.

## Component's factory method

SuiBuilder calls the component's factory methods with context of the inner builder object, therefore factory methods have access to these properties:

| Property | Type | Description |
| ------ | ------ | ------ |
| `this.name` | string | builder's name |
| `this.element` | ScriptUI component | current element |
| `this.container` | ScriptUI component | current container component |
| `this.validator` | object | validator instance |
| `this.builder` | SuiBuilder | this SuiBuilder instance |

### Container component

Factory method should add a new component into the current container and assign it as the **current container**.

Example:
```javascript
function row() {
	this.container = this.container.add('group {orientation: "row"}');
}
```

### Element component

Factory method should add a new component into the current container and assign it as the **current element**.

Example:
```javascript
function myEditText(text, characters) {
	this.element = this.container.add('edittext', undefined, text);
	if (characters > 0) {
		this.element.characters = characters - 0;
	}
}
```

### Combined component

All factory methods may use another components or builder object.

Example:
```javascript
// create a list of names inside a panel
function listOfNames(arrayOfNames) {
	// create panel
	this.builder.columnPanel('Names:');
	// add lines
	for (var i = 0, n = arrayOfNames.length; i < n; i++) {
		this.builder.staticText(arrayOfNames[i]);
	}
	// close panel
	this.builder.end();
}
```

### Decorator method

Decorator method modifies the current element or does something else.

Example:
```javascript
function foregroundColor(color) {
	var gr = this.element.graphics;
	gr.foregroundColor = gr.newPen(gr.PenType.SOLID_COLOR, color, 1);
}
```

Example:
```javascript
function sayHello() {
	alert('Hello!');
}
```

## Registration of components

Before using custom components, it is necessary to register the factory methods. For this purpose SuiBuilder offers this methods:

`addComponent(name, factory)`[API](API_LINK/module-_brixy.ui.SuiBuilder_-SuiBuilder.html#addComponent) - registration of the factory method as new component with the given name in the SuiBuilder **instance**

`addComponents(components)`[API](API_LINK/module-_brixy.ui.SuiBuilder_-SuiBuilder.html#addComponents) - multiple registration of components in the SuiBuilder **instance**

`attach(members, replace)`[API](API_LINK/module-_brixy.ui.SuiBuilder_-SuiBuilder.html#.attach) - multiple registration of components in the SuiBuilder **prototype** makes components available all the application life in each SuiBuilder instance

Example:
```javascript
// define components
var components = {
	myComponent1: function() {
	  //...
	},
	myComponent2: function() {
	  //...
	}
};

var SuiBuilder = BX.module.Me('brixy.ui.SuiBuilder');
var b = new SuiBuilder();

// register components
b.addComponents(components);

// using
b.window('dialog', 'Title')
	.myComponent1()
	.myComponent2()
	.showWindow();
```

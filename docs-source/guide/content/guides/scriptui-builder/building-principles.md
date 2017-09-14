---
title: Building principles
draft: false
order: 1
edited: 2017/01/21
---

Each `SuiBuilder` object can create one dialog window. At the beginning of the building process it should create the window itself.

```javascript
var b = new SuiBuilder();
b.window('dialog', 'Title');
```

## Containers and elements

During the building process, the builder holds an actual reference to the **current container** component and a reference to the **current element** component.

Current element is recently created component. Current container is recently created container component.

Each new component is added into the current container component. This new component always becomes the new builder's current element. If new component is a container component, the builder also references it as the new current container.

Example:
```javascript
b.window('dialog', 'Title') // window is the current container
	.row() // added into window; row becomes the current container
		.columnPanel() // added into row; columnPanel becomes the current container
			.editText() // added into columnPanel
			.checkbox('Remember me') // added into columnPanel
			.end() // it closes columnPanel; row again becomes the current container
		.column() // added into row; column becomes the current container
			.button('OK') // added into column
			.button('Cancel') // added into column
	.showWindow(); // closes all; shows the window
```

## Decorators

Decorator methods don't create new components. In most cases, their purpose is to modify the current element component.

Example:
```javascript
b.window('dialog', 'Title')
	.row()
		.columnPanel()
			.alignChildren('left') // decorator; sets property 'alignChildren' of the columnPanel
			.editText()
				.id('name') // decorator; creates named reference for the editText
			.checkbox('Remember me')
				.set('value', true) // decorator; sets property 'value' of the checkbox
				.set('helpTip', 'Help text') // decorator; sets property 'helpTip' of the checkbox
			.end() // decorator; changes the current container
		.column()
			.button('OK')
			.button('Cancel')
	.showWindow(); // decorator; shows the window
```

## Window result

ScriptUI `Window.show()` method returns a result code after closing. This code is available via method `result()` of the SuiBuilder object. Decorator method `closeOnClick()` can add to component an onClick event that closes window with the given result code.

Example:
```javascript
b.window('dialog', 'Title')
	.column()
		.button('First').closeOnClick(true, 3)
		.button('Second').closeOnClick(true, 4)
	.showWindow();

switch (b.result()) {
	case 3:
		alert('First button clicked.');
		break;
	case 4:
		alert('Second button clicked.');
		break;
}
```

## Getting components

SuiBuilder `id(key)` method allows marking of components. After closing the window, components are accessible via `get(key)` method.

Example:
```javascript
b.window('dialog', 'Title')
	.row()
		.columnPanel()
			.editText().id('name') // marks the editText
			.checkbox('Remember me')
			.end()
		.column()
			.button('OK').closeOnClick(true, 1)
			.button('Cancel').closeOnClick(false, 0)
	.showWindow();

if (b.result() == 1) {
	var element = b.get('name'); // get the editText as raw ScriptUI element
	var name = element.text;
	// ...
}

```

Similarly, method `getAll()` returns all marked components.

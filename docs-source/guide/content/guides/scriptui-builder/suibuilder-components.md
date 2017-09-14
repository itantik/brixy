---
title: SuiBuilder components
draft: false
order: 2
edited: 2017/01/21
---

SuiBuilder contains a set of predefined Adobe ScriptUI components in the `'brixy.ui.components.base'`[API](API_LINK/module-_brixy.ui.components.base_.html) module. Note that some components are not supported in every target application.

In following examples, the `resource` argument means any valid resource string. It is an object written as string, e.g. `"{alignment: 'left', text: 'OK'}"`.

Code snippets assume that the `builder` is an instance of the `SuiBuilder` class, e.g.:

```javascript
var builder = new SuiBuilder();
builder.window('dialog', 'Title');
```

## Container components

### Window

```javascript
builder.window(type, 'Title', bounds, properties)
```


### Groups

```javascript
builder.group(resource).end()
```

```javascript
builder.panel(resource).end()
```

```javascript
builder.row().end() // group with orientation 'row'
```

```javascript
builder.rowPanel('Title').end() // panel with orientation 'row'
```

```javascript
builder.column().end() // group with orientation 'column'
```

```javascript
builder.columnPanel('Title').end() // panel with orientation 'column'
```

```javascript
builder.stack().end() // group with orientation 'stack'
```

```javascript
builder.stackPanel('Title').end() // panel with orientation 'stack'
```

### Tabbed panel

```javascript
builder.tabbedPanel(resource)
	.tab(resourceOrTabTitle)
		// ...
		.end()
	.tab(resourceOrTabTitle)
		// ...
		.end()
	.end()
```

### DropDown list

```javascript
builder.dropDownList(['First item', 'Second item']).end()
```

```javascript
builder.dropDownList(resource)
	// add new items:
	.item('First item')
	.item('Second item')
	.end()
```

### ListBox

```javascript
builder.listBox(resource)
	// add new lines:
	.item('First line')
	.item('Second line')
	.end()
```

Multicolumn ListBox (if supported in target application):
```javascript
builder.listBox(['First column', 'Second column', 'Third column'])
	// add first line:
	.item('First line')
		.subItem(0, 'Text in 2. column')
		.subItem(1, 'Text in 3. column')
	// add second line:
	.item('Second line')
		.subItem(0, 'Text in 2. column')
		.subItem(1, 'Text in 3. column')
	.end()
```

### TreeView

```javascript
builder.treeView(resource)
	.item('First item')
	.nodeItem('Sublist') // nodeItem is a container, therefore end() must close it
		.item('Aaa')
		.item('Bbb')
		.nodeItem('Sub-sublist')
			.item('John')
			.item('Jay')
			.item('Lenny')
			.end()
		.end()
	.item('Last item')
	.end()
```

## Element components

### Button

```javascript
builder.button('Caption')
```

```javascript
builder.button(resource)
```

### Checkbox

```javascript
builder.checkbox('Caption')
```

```javascript
builder.checkbox(resource)
```

### EditText

```javascript
builder.editText('Text')
```

```javascript
builder.editText(resource)
```

### StaticText

```javascript
builder.staticText('Text')
```

```javascript
builder.staticText(resource)
```

### FlashPlayer

```javascript
builder.flashPlayer(resource, file)
```

### IconButton

```javascript
builder.iconButton(resource)
```

```javascript
builder.iconButton([image1, image2, image3, image4]) // 4-state button
```

```javascript
builder.iconButton('path/to/image')
```

### Image

```javascript
builder.image(resource)
```

```javascript
builder.image(File)
```

```javascript
builder.image('path/to/image')
```

### ProgressBar

```javascript
builder.progressBar(resource)
```

### RadioButton

```javascript
builder.radioButton('Caption')
```

```javascript
builder.radioButton(resource)
```

Radio group:
```javascript
builder.columnPanel('Select:')
	.radioButton('choice 1')
	.radioButton('choice 2')
	.radioButton('choice 3')
	.end()
```

### Scrollbar

```javascript
builder.scrollbar(resource)
```

### Slider

```javascript
builder.slider(resource)
```

## Decorators

### Events

```javascript
// add event listener
builder.addEventListener(eventName, callback, capturePhase)
```

Note that event listeners differ from event-handlers like onClick, which are set as well as other properties via `builder.set('onClick', callback)`.

```javascript
// add onClick event, that closes the window with a result code
// it may invoke validation before closing
builder.closeOnClick(validate, result)
```

```javascript
// add special onClick event for label-like functionality
builder.labelFor(anotherElementId)

// click the staticText to set focus on editText
builder.staticText('Full name:').labelFor('name')
	.editText().id('name')
```

### Properties

```javascript
builder.align(alignment) // 'alignment' style of the element
```

```javascript
builder.alignChildren(alignment) // 'alignChildren' style of the element
```

```javascript
builder.doubleAmps(property) // doubles ampersand characters of the element's property
```

```javascript
builder.set(property, value) // sets the value of the element's property
```

```javascript
builder.set({property1: value1, property2: value2}) // sets given properties of the element's property
```

### Behaviors

```javascript
builder.counter(number) // sets the inner component counter
```

```javascript
builder.end() // closes the current container component
```

```javascript
builder.execute(callback) // immediatelly executes a callback
```

```javascript
builder.id(key) // marks the current element

// example:
builder.button('Save').id('saveButton')
// ...
// button is available:
var btn = builder.get('saveButton');
```

```javascript
builder.showWindow(position)
```

```javascript
builder.validator(callback) // registers a validator to the current element
```

```javascript
builder.validator(builtinValidator, property, arg, message)
```


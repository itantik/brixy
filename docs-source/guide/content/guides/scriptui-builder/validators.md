---
title: Validators
draft: false
order: 4
edited: 2017/01/23
---

Validators are special decorator methods. SuiBuilder calls all registered validator methods before closing the window. If some fails, the window remains open. Use method `closeOnClick(validate, result)` to activate a validation process.

Example:
```javascript
b.window('dialog', 'Title')
	.column().alignChildren('right')
		.row()
			.staticText('Name:')
			.editText()
				.validator('required') // editText must be filled
			.end()
		.row()
			.staticText('Age:')
			.editText() // we can combine more validators for single component
				.validator('isinteger', 'text', 'Please specify the age as an integer.') // editText must be integer
				.validator('minimum', 'text', 1) // editText must be at least 1
			.end()
		.row()
			.button('OK').closeOnClick(true, 1) // validation is executed after clicking
			.button('Cancel') // validation is not executed after clicking
	.showWindow();
```

In this example we defined one validator for the first editText. There are also two validators for the second editText. After clicking the OK button, validation process is executed. After clicking the Cancel button, the window is closed without validation.

## Built-in validators

SuiBuilder built-in `SuiValidator`[API](API_LINK/module-_brixy.ui.SuiValidator_-SuiValidator.html) contains a predefined set of `Validators`[API](API_LINK/module-_brixy.ui.SuiValidator_.Validators.html). You can use them with SuiBuilder `validator()` method.

General form of the validator calling: `validator(validatorName, testedProperty, [validatorParameters, ...] errorMessage)`.
- validatorName: the name of the SuiValidator's method, eg. `'required'`. Prefix the name with exclamation mark to test the opposite requirement, eg. `'!required'`.
- testedProperty: the name of the element's property that is tested, eg. `'text'` or `'value'`.
- validatorParameters: these parameters are passed to the validator method.
- errorMessage: optional error message that replaces a default error message.

### List of built-in validators

```javascript
// tests if element.testedProperty equals to requiredValue
validator('equal', testedProperty, requiredValue, errorMessage)
```

```javascript
// tests if element.testedProperty has the required length
validator('haslength', testedProperty, minLength, maxLength, errorMessage)
```

```javascript
// tests if element.testedProperty doesn't exceed the maximum length
validator('maxlength', testedProperty, maxLength, errorMessage)
```

```javascript
// tests if element.testedProperty has at least the minimum length
validator('minlength', testedProperty, minLength, errorMessage)
```

```javascript
// tests if element.testedProperty value occurs in the array
validator('inarray', testedProperty, array, errorMessage)
```

```javascript
// tests if element.testedProperty value is decimal
validator('isdecimal', testedProperty, decimalPoint, errorMessage)
```

```javascript
// tests if element.testedProperty value is integer
validator('isinteger', testedProperty, errorMessage)
```

```javascript
// tests if element.testedProperty is array and contains a checked or selected item
validator('itemselected', testedProperty, errorMessage)

// example:
column().validator('itemselected', 'children')
	.radioButton('Option 1')
	.radioButton('Option 2')
	.radioButton('Option 3')
	.end()
```

```javascript
// tests if element.testedProperty value doesn't exceed the maximum value
validator('maximum', testedProperty, maximum, errorMessage)
```

```javascript
// tests if element.testedProperty value equals to at least the minimum value
validator('minimum', testedProperty, minimum, errorMessage)
```

```javascript
// tests if element.testedProperty value is in required range
validator('range', testedProperty, minimum, maximum, errorMessage)
```

```javascript
// tests if element.testedProperty value matches the regular expression
validator('pattern', testedProperty, regexp, errorMessage)
```

```javascript
// tests if element.testedProperty value is defined and is not empty string
validator('required', testedProperty, errorMessage)
```

## Custom validators

In case that prepared validators are not sufficient, it is possible to define own.

Custom validator is a function. SuiValidator calls this function with the context of the current SuiBuilder's element. If validation failes, validator must throw an exception.

Example 1:
```javascript
b.window('dialog', 'Title')
	.column()
		.row()
			.staticText('Name 1:')
			.editText().id('name1')
			.end()
		.row()
			.staticText('Name 2:')
			.editText().id('name2')
			.end()
		.validator(myValidator) // custom validator
		.button('OK').closeOnClick(true, 1)
	.showWindow();

// custom validator definition
function myValidator() {
	var n1 = b.get('name1').text;
	var n2 = b.get('name2').text;
	
	if (n1 === '' && n2 === '') {
		throw 'Please enter at least one name.';
	}
}
```

Example 2:
```javascript
b.window('dialog', 'Title')
	.column()
		.row()
			.staticText('Name:')
			.editText().validator(myValidator) // custom validator
			.end()
		.button('OK').closeOnClick(true, 1)
	.showWindow();

// custom validator definition
function myValidator() {
	// 'this' refers to the custom element, i.e. editText
	var t = this.text;
	var first = (t.length > 0) ? t[0] : false;
	
	if (first !== false && first !== first.toLocaleUpperCase()) {
		throw 'The name must begin with a capital letter.';
	}
}
```

Example 3:
```javascript
b.window('dialog', 'Title')
	.column()
		.row()
			.staticText('Name:')
			.editText().validator(myValidator, 2) // custom validator, additional arguments are passed to validator
			.end()
		.button('OK').closeOnClick(true, 1)
	.showWindow();

// custom validator definition
function myValidator(minLength) {
	// 'this' refers to the custom element, i.e. editText
	var t = this.text;
	
	if (t.length < minLength) {
		throw 'Minimum length is ' + minLength + '.';
	}
}
```

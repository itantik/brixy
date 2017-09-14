---
layout: page.html
title: About Brixy 
draft: false
order: 1
---
Brixy is Extend Script module system and object oriented MVC framework bundled with useful development tools.

Although the framework is complete and ready to use, the work on this guide is still in progress. If you cannot find some topics here, you can study the code of the sample applications and helper tools or dive into framework  source code.

## Features

- **Module system.** Own asynchronous module implementation.

- **Smart file including.** In addition to Extend Script `#include` directive, Brixy offers `use()` method, that includes each file only once.

- **Model-View-Controller application architecture.** Choice for maintainable management of application life.

- **Dependency injection container.** Don't care how to couple module dependencies.

- **ScriptUI builder.** Easy creating of the ScriptUI user interface. Fluent interface, custom components, validators.

- **Rich debug tools.** Dumping of object properties, Call stack, Timer, Summary, System info.

- **Friendly error handling.** Customizable error reporting. Error chaining.

- **Decoupled modules.** You do not always use the entire framework. Use any modules that fit to your project.

- **Pure Extend Script.** Brixy uses only core Extend Script objects and does not modify their prototypes. No external dependencies, e.g. InDesign or Photoshop objects. Reporting tools uses ScriptUI classes.


## Bundled tools

All helper applications were created with Brixy framework. You are welcome to explore their source code.

- **Mixer.** Customizable wizard for creating a skeleton of source files.

- **Linker.** Joins many source files into a single file. Useful for a smooth code conversion from development to deployment version.

- **Tester.** Native Extend Script unit testing.


## Requirements

Brixy works with applications that support Extend Script.

Brixy is developed and mostly tested with Adobe InDesign. It should work from version CS4. Due to a different implementation of the ScriptUI accross applications, some issues may appear with tools that uses ScriptUI classes.


## Copyright

Stanislav Antos, 2013 - 2017

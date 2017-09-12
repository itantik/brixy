---
layout: page.html
title: Starter application
draft: false
order: 3
edited: 2016/11/17
---
You can find **Starter** application in the _Brixy/Examples_ folder. This is MVC application skeleton prepared for quick start of your new project.

## Startup

1. **Copy** the _Brixy/Examples/Starter_ folder to your script folder.
1. **Rename** your new _Starter_ folder to the _MyApp_.
1. **Rename** the _MyApp/Starter.jsx_ file to the _MyApp/MyApp.jsx_.This is the main script file of the application.
1. Open the _MyApp/MyApp.jsx_ file. **Correct the path** for including the application launcher _Brixy/includes/app-launcher.jsxinc_.
1. Open the _MyApp/tests/Tester.jsx_ file. **Correct the path** for including the tester launcher _Brixy/includes/tester-launcher.jsxinc_.

Now run _MyApp/MyApp.jsx_.

## Project structure

**Main script file:** _MyApp/MyApp.jsx_  
This script includes and runs the application launcher. Launcher takes care about loading core Brixy libraries and config file.

**Config file:** _MyApp/config.jsxinc_  
Config loads your own application modules, defines the application itself and its basic units, e.g. services, routes, events, startup route.

**Application modules:** _MyApp/app_  
This folder contains your own application modules.

**Model:** _MyApp/app/model_  
This folder contains all model modules.

**Controllers:** _MyApp/app/resultCtrl_, _MyApp/app/startupCtrl_  
Each of these folders contains a controller and its views. You will replace Startup controllers with your own.

**Unit tests:** _MyApp/tests_  
This folder contains test launcher _Tester.jsx_ and folder _jobs_ with test job files.

## Development

1. In most cases you don't need modify the **main script file** _MyApp/MyApp.jsx_, except for the correction of the path to _app-launcher.jsxinc_ file. For persistent applications you can insert Extend Script `#targetengine` directive at the beginning of the file.

1. Create application **model classes** and modules. Put them into _MyApp/app/model_ folder. Model is the logic core of the application. It holds data, settings, algorithms and other logic parts of the application.

1. Create **unit tests** of the model classes. These are the first use cases. Place test jobs into _MyApp/tests/jobs_ folder. _MyApp/tests/Tester.jsx_ script is prepared to execute all test jobs.

1. Add new model modules as **services** to the _MyApp/config.jsxinc_ file, so they can be used in the controllers.

1. Create **controllers** and its **views**. Controller communicates with the model and initializes views. Not every controller needs a view. Use dependency injection for passing model modules to the controller. Finally, as a result of its work, controller returns a new request route.

1. Modify _MyApp/config.jsxinc_ file: add **startup** controller, add request **routes** if needed.

1. Run _MyApp/MyApp.jsx_.

## Development tools

Brixy **Mixer** helps with creating of new source files of all types.

Debugging can be fun with Brixy **debug modules**: Dump, Call stack, Timer, Summary, System info, error reporting. See _Brixy/Examples/Debug tools_.

## Deployment

Use Brixy **Linker** tool to link all source files into one final independent script file.

---
title: Model - View - Controller
draft: false
order: 1
edited: 2016/11/18
---
Brixy application uses [Model - View - Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) (MVC) architecture. Its purpose is to separate the presentation and the logical part of the application. In fact, it is [Model - View - Presenter](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter) with passive views, but for simplicity we will call it MVC.

## Model

Model is the logic core of the application. It holds data, settings, algorithms and other logic parts of the application. It is independent of the rest of the application. It knows nothing about the rest of the application.

## View

View presents data and/or comunicates with the user. All data gets from the controller.

## Controller

Controller asks the model for data, passes data to the view and then sends them back to the model or invoke some model action. Not every controller needs the view. Finally, as a result of its work, controller returns a new application request.
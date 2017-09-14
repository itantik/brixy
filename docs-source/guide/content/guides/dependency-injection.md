---
title: Dependency injection
draft: false
order: 4
edited: 2017/04/12
---
[Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) is a software pattern whose purpose is to manage object dependencies. Brixy framework offers dependency injection `Container` [API](API_LINK/module-_brixy.di.Container_-Container.html) which works as a smart object factory:

- creates instances from various sources
- resolves and injects dependent objects
- holds service objects

Brixy MVC application uses built-in DI Container for creating all controllers and its dependencies. Of course, you can use DI Container separately in your own applications.
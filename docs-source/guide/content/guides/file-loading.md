---
title: File loading
draft: false
order: 1
edited: 2015/04/12
---
## Basic usage

`BX.use(alias, path)`[API](API_LINK/BX.use.html#.use)

Loads a singe file or all files from a folder (recursively). It loads each file **only once**, unlike Extend Script `#include` directive.

It resolves an absolute path, path relative to alias folder, path reative to main script file (in case of omitted alias parameter). Alias is some folder defined via `BX.alias(name, path)`[API](API_LINK/BX.use.html#.alias) method.

Example:
```javascript
// --- file1.jsx ---
alert('Hello from file 1');
```

```javascript
// --- file2.jsx ---
alert('Hello from file 2');
```

```javascript
// --- test.jsx ---
#include 'path/to/Brixy/includes/Brixy.jsxinc'; // necessary core Brixy library

#include 'file1.jsx'; // loads
#include 'file1.jsx'; // loads

BX.use('file2.jsx'); // loads
BX.use('file2.jsx'); // skips
```

test.jsx will output:
```output
-> Hello from file 1
-> Hello from file 1
-> Hello from file 2
```

## Folder aliases

`BX.use.alias(name, path)`[API](API_LINK/BX.use.html#.alias)

Alias defines a shortcut for a full folder path. It resolves an absolute path.

You may define the alias of the main script folder as `BX.use.alias('', path)` or `BX.use.alias(path)`.


## Ignoring of files

`BX.use.ignore(name, path)`[API](API_LINK/BX.use.html#.ignore)

If you want to skip certain files from loading, mark them by `BX.use.ignore(alias, path)` method.

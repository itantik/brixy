---
title: Linker
draft: false
order: 1
edited: 2016/11/05
---

Brixy Linker is a tool for joining multiple source files into a single file. You can find it in the _Brixy/Tools/Linker_ folder.

## How it works

Brixy Linker reads the source file line by line.

Standard code is copied to the target file.

Extend Script `#import` directives are replaced with the appropriate file contens.

Methods from the `BX.use` namespace are executed.

Special Brixy Linker comment directives are executed according to their purpose.

## `#include` directive

File is always included. Path should be an absolute or relative to the source file.

It is allowed only one directive on the line.

Compiled JSXBIN files: `#include "file.jsxbin"` files are converted to the `app.doScript("included jsxbin code");`. This call is supported only in some Adobe applications.

## `BX.use` methods

`BX.use()` and `BX.use.use()` methods are in the target file replaced with the appropriate file contens only once for each required file.

`BX.use.alias()` and `BX.use.ignore()` methods are executed by the Brixy Linker, but this lines are not copied to the target file.

It is allowed only one method on the line.
```javascript
// Linker does not recognize multiline form of calls like:
BX
.use("my/file.jsx");

// use this:
BX.use("my/file.jsx");
```

Parameters have to be single quoted or double quoted string and must not contain the `)` character. In addition, you can use `$.fileName` or `_LINKER_SCRIPT_FILE_` variable as a `path` parameter. Brixy Linker replaces the `$.fileName` with full path to the currently processed file and `_LINKER_SCRIPT_FILE_` variable with full path to the main linked file.


## Brixy Linker directives

Brixy Linker comment directives allows to add or remove the lines of code to the target file. Brixy Linker removes comment directives form the source code, the rest of the line is executed and / or copied to the target file.

Brixy Linker recognizes three development phases:

**Development phase** - Source code is split to many files. You are coding, debugging, fixing...

**Linking** - Brixy Linker has been started. It is joining the code into a single file.

**Release version** - The final single file was created. Now you have a standalone application that does not depend on other files.

Next table explains when the rest of the line after directive is executed:

|  | Development | Linking | Release |
| ------ | :-------: | :-------: | :-------: |
| `/* LINKER-DEL */` rest of the line | YES | - | - |
| `// LINKER-DEL` rest of the line | - | - | - |
| `// LINKER-ADD` rest of the line | - | - | YES |
| `// LINKER-APPLY` rest of the line | - | YES | - |
| `/* LINKER-KEEP */` rest of the line | YES | YES | YES |
| `// LINKER-KEEP` rest of the line | - | YES | YES |

It is allowed only one directive on the line. The line have to start with either a whitespace or comment directive.

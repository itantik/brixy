---
title: Installation
draft: false
order: 2
edited: 2016/05/04
---
Move Brixy folder into a folder destined by your Adobe application for location of extend scripts.

If your applications recognize the folder aliases, you may move Brixy folder to a common location (e.g. _Documents/Adobe scripts/Brixy_) and then put its alias inside Adobe application folder structure.

## Folder structure

```text
/Brixy              - framework source files
    /extras         - extensions to the core namespace
    /includes       - files prepared for easy including of the framework parts
    /modules        - core modules
    /tests          - tests of framework modules
    /BX.jsxinc      - core namespace and module system
    /BX.use.jsxinc  - BX.use extension
/docs               - API documentation and user guides
/docs-source        - sources and generators for the documentation
/Examples           - example applications
    /Debug tools    - using of the debug modules
    /Linker-source  - source of the Brixy Linker tool
    /Mixer-source   - source of the Brixy Mixer tool
    /Palette        - example of the palette application
    /Starter        - skeleton of the starter application
    /User Interface - using of the Brixy SuiBuilder module
/Tools              - development tools
    /Linker         - joining of the source files
    /Mixer          - generating of the source files
```

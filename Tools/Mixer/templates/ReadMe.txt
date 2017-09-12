Template macros:

TAGS

General form of tags: <!command:value:>
! ... optional, marks a required value
command ... [a-zA-Z_*]
value ... [^<] removes all endline characters, leaves trailing whitespaces, e.g. <:Hello:> differs from the <: Hello:>, but <:Hello:> equals to <:He\nllo\n:>
At least a command or value is required.

Valid examples: <!each:value:>, <each:value:>, <:value:>, <!:value:>, <end::>

VALUES

Simple value:
Shows the string value.
<:My value:> - String value.
<!:My value:> - Required value.

COMMANDS

Comment:
Brixy Mixer will show all comments in the edit dialog.
<*:Text:> - Endline characters are stripped.

Each block:
Iterate over array of string values. 
<each:Array name:>...<:Array name:>...<separator:, :>...<end::> - 'Each' block. Macro <:Array name:> inserts the actual string of the array in each iteration of the loop.
<!each:Array name:>...<:Array name:>...<separator:, :>...<end::> - Required 'each' block.
<separator:string:> - Separator macro inserts string in each iteration of the loop, except the last.

If block:
Passed if a condition is true or it is not empty string.
<if:Condition value name:>...<end::> - 'If' block.
<if:Condition value name:>...<else::>...<end::> - 'If/else' block.

Title:
<title:name=text:> - Brixy Mixer shows a 'text' in edit view, instead of a name of value. It allows using of shorter names of values in template.
Example:
<if:author:>Author: <:author:><end::>
<title:author=Author name:>

Filename:
<filename::>*.jsxinc<end::> - Template of the file name. '*' is replaced with the name that is found within input fields.


Nesting of blocks is allowed.

Default values:
defaults.xml file contains the saved default values of the macros.

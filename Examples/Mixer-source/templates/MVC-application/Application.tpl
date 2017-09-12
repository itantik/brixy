/**
* Main application file.
* <if:Author:>@author <:Author:><end::>
*/
<*:Main application file. Save it as *.jsx file.
:><*:Don't use the backslash in path, instead, even on Windows, use the forward slash.
:><*:You have to specify a public name for each application in a persistent engine.
:><if:Target engine:>#targetengine "<:Target engine:>";<end::>
// MVC application launcher
#include "<!:Path to Brixy folder:>/includes/app-launcher.jsxinc";

<if:Public application name:>var <:Public application name:> = <:Public application name:> || <else::><if:Target engine:>var Application = Application || <end::><end::>launch($.fileName);
<if:Public application name:>// <:Public application name:>.processEvent('eventName');<else::><if:Target engine:>// Application.processEvent('eventName');<end::><end::>
<filename::>*.jsx<end::>
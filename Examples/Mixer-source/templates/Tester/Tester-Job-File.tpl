<*:By default, the name of this file should end with "job.jsx" or "job.jsxinc" or "job.js".:><*:
If your test requires Brixy modules, specify the path to the Brixy folder.:>/*
* Available variables:
* tester - tester object
* job - current job
* it - shortcut to job.it
* file - full path to this file
* debug - BX.debug object
*/

<if:Path to Brixy folder:>#include "<:Path to Brixy folder:>/includes/Brixy.jsxinc"; // core Brixy library<end::>
<if:Set alias to root application folder (it uses tester.getConfig('appPath')):>BX.use.alias('', tester.getConfig('appPath')); // set alias to root application folder<end::>

<if:Job name (as it appears in the result dialog):>job.setName('<:Job name (as it appears in the result dialog):>');<end::>
<filename::>*-job.jsxinc<end::>
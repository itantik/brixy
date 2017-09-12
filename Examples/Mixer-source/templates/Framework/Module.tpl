/**
* Module '<:Module name:>'
* 
* <if:Author:>@author <:Author:><end::>
*/
BX.module.define('<!:Module name:>', function() {
	
	<if:Class name:>function <:Class name:>() {
		<if:Parent class:><:Parent class:>.call(this); // parent constructor<end::>
	}
	<if:Parent class:>
	BX.subclass(<:Class name:>, <:Parent class:>); // subclassing<end::>
	<end::>
	
	// publish<if:Class name:> the class<end::>
	return {
		<if:Class name:>Me: <:Class name:><end::>
	};
});
<if:Class name:><filename::><:Class name:>.jsxinc<end::><end::>
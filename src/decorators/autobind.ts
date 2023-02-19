namespace App {
	// --------------------------------------------------------------------------------------------
	// ---------------------------------------- DECORATORS ----------------------------------------
	// --------------------------------------------------------------------------------------------
	// Auto bind method decorator to resolve the problem of "this" keyword getting incorrect value
	// target: constructor or prototype of class object
	export const AutoBindThisKeyword = (
		_: any,
		__: string,
		methodDescriptor: PropertyDescriptor
	) => {
		const _originalMethod = methodDescriptor.value;
		const adjustedMethodDescriptor: PropertyDescriptor = {
			get() {
				const adjustedMethod = _originalMethod.bind(this);
				return adjustedMethod;
			},
		};
		return adjustedMethodDescriptor;
	};
}

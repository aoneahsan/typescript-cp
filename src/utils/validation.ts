// --------------------------------------------------------------------------------------------
// ---------------------------------------- VALIDATIONS ---------------------------------------
// --------------------------------------------------------------------------------------------

import { IValidatable } from '../interfaces/interfaces';

export const validateField = (_input: IValidatable) => {
	let _fieldIsValid = true;
	if (_input.required && !_input.value.toString().trim()) {
		_fieldIsValid = false;
	}

	if (_input.positive && typeof _input.value === 'number' && _input.value < 0) {
		_fieldIsValid = false;
	}

	return _fieldIsValid;
};

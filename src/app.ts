const dynamicPartToReplace = 'value'; // this should be what you use as dynamic part in 'EValidationRules' entries
const dynamicPartSeparator = ':';

enum EValidationRules {
	Required = 'Required', // for string
	MinLength = 'MinLength:value', // for string length
	MaxLength = 'MaxLength:value', // for string length
	Positive = 'Positive', // for number
	Min = 'Min:value', // for number
	Max = 'Max:value', // for number
}

interface IValidationRules {
	[className: string]: {
		[propertyName: string]: string[];
	};
}

const registeredValidationRules: IValidationRules = {};

// property decorator - the pattern i'm using here to create a property decorator is simple decorator function pattern
// target: constructor function or prototype of the class object (depending on whether it's a static or non static property where this decorator was applied)
// propertyName: name of the property where it was applied
function isRequired(target: any, propertyName: string) {
	const _className = target.constructor.name; // this is simple javascript as all objects (created from a class print) have a constructor function and also have a "name" property which is the name of the class it self.

	if (_className) {
		// first check if the "registeredValidationRules" object have a entry for this className already or not, if not, then initialized that using a empty object
		if (!registeredValidationRules[_className]) {
			registeredValidationRules[_className] = {};
		}

		// now check if the "registeredValidationRules[_className]" object have a entry for this propertyName already or not, if not, then initialized that using a empty array
		if (
			!registeredValidationRules[_className][propertyName] ||
			!registeredValidationRules[_className][propertyName].length
		) {
			registeredValidationRules[_className][propertyName] = [];
		}

		// now add the validation rule needed for this validator decorator and keep the already applied rules for the field
		registeredValidationRules[_className] = {
			...registeredValidationRules[_className],
			[propertyName]: [
				...registeredValidationRules[_className][propertyName],
				EValidationRules.Required,
			],
		};
	}
}

// property decorator - the pattern i'm using here to create a property decorator is "decorator factory pattern", as it return the actual decorator function
// will need to think how to complete this one, as the problem right now is that, the 'MinLength:value' will not be equal to 'MinLength:{some number here}' like 'MinLength:10'
// got one solution for this, let check if the validation rule includes rather than ==
function MinLength(_value: number) {
	if (_value < 0) {
		throw new Error('Should be greater than 0');
	}
	return (target: any, propertyName: string) => {
		const _className = target.constructor.name; // this is simple javascript as all objects (created from a class print) have a constructor function and also have a "name" property which is the name of the class it self.

		if (_className) {
			// first check if the "registeredValidationRules" object have a entry for this className already or not, if not, then initialized that using a empty object
			if (!registeredValidationRules[_className]) {
				registeredValidationRules[_className] = {};
			}

			// now check if the "registeredValidationRules[_className]" object have a entry for this propertyName already or not, if not, then initialized that using a empty array
			if (
				!registeredValidationRules[_className][propertyName] ||
				!registeredValidationRules[_className][propertyName].length
			) {
				registeredValidationRules[_className][propertyName] = [];
			}

			const minLengthValue = EValidationRules.MinLength.replace(
				dynamicPartToReplace,
				_value.toString()
			);

			// now add the validation rule needed for this validator decorator and keep the already applied rules for the field
			registeredValidationRules[_className] = {
				...registeredValidationRules[_className],
				[propertyName]: [
					...registeredValidationRules[_className][propertyName],
					minLengthValue,
				],
			};
		}
	};
}

function MaxLength(_value: number) {
	if (_value < 0) {
		throw new Error('Should be greater than 0');
	}
	return (target: any, propertyName: string) => {
		const _className = target.constructor.name; // this is simple javascript as all objects (created from a class print) have a constructor function and also have a "name" property which is the name of the class it self.

		if (_className) {
			// first check if the "registeredValidationRules" object have a entry for this className already or not, if not, then initialized that using a empty object
			if (!registeredValidationRules[_className]) {
				registeredValidationRules[_className] = {};
			}

			// now check if the "registeredValidationRules[_className]" object have a entry for this propertyName already or not, if not, then initialized that using a empty array
			if (
				!registeredValidationRules[_className][propertyName] ||
				!registeredValidationRules[_className][propertyName].length
			) {
				registeredValidationRules[_className][propertyName] = [];
			}

			const maxLengthValue = EValidationRules.MaxLength.replace(
				dynamicPartToReplace,
				_value.toString()
			);

			// now add the validation rule needed for this validator decorator and keep the already applied rules for the field
			registeredValidationRules[_className] = {
				...registeredValidationRules[_className],
				[propertyName]: [
					...registeredValidationRules[_className][propertyName],
					maxLengthValue,
				],
			};
		}
	};
}

// here i'm not using a decorator factory, but just a simple decorator function
function Positive(target: any, propertyName: string) {
	const _className = target.constructor.name; // this is simple javascript as all objects (created from a class print) have a constructor function and also have a "name" property which is the name of the class it self.

	if (_className) {
		// first check if the "registeredValidationRules" object have a entry for this className already or not, if not, then initialized that using a empty object
		if (!registeredValidationRules[_className]) {
			registeredValidationRules[_className] = {};
		}

		// now check if the "registeredValidationRules[_className]" object have a entry for this propertyName already or not, if not, then initialized that using a empty array
		if (
			!registeredValidationRules[_className][propertyName] ||
			!registeredValidationRules[_className][propertyName].length
		) {
			registeredValidationRules[_className][propertyName] = [];
		}

		// now add the validation rule needed for this validator decorator and keep the already applied rules for the field
		registeredValidationRules[_className] = {
			...registeredValidationRules[_className],
			[propertyName]: [
				...registeredValidationRules[_className][propertyName],
				EValidationRules.Positive,
			],
		};
	}
}

function Min(_value: number) {
	if (_value < 0) {
		throw new Error('Should be greater than 0');
	}
	return (target: any, propertyName: string) => {
		const _className = target.constructor.name; // this is simple javascript as all objects (created from a class print) have a constructor function and also have a "name" property which is the name of the class it self.

		if (_className) {
			// first check if the "registeredValidationRules" object have a entry for this className already or not, if not, then initialized that using a empty object
			if (!registeredValidationRules[_className]) {
				registeredValidationRules[_className] = {};
			}

			// now check if the "registeredValidationRules[_className]" object have a entry for this propertyName already or not, if not, then initialized that using a empty array
			if (
				!registeredValidationRules[_className][propertyName] ||
				!registeredValidationRules[_className][propertyName].length
			) {
				registeredValidationRules[_className][propertyName] = [];
			}

			const minValue = EValidationRules.Min.replace(
				dynamicPartToReplace,
				_value.toString()
			);

			// now add the validation rule needed for this validator decorator and keep the already applied rules for the field
			registeredValidationRules[_className] = {
				...registeredValidationRules[_className],
				[propertyName]: [
					...registeredValidationRules[_className][propertyName],
					minValue,
				],
			};
		}
	};
}

function Max(_value: number) {
	if (_value < 0) {
		throw new Error('Should be greater than 0');
	}
	return (target: any, propertyName: string) => {
		const _className = target.constructor.name; // this is simple javascript as all objects (created from a class print) have a constructor function and also have a "name" property which is the name of the class it self.

		if (_className) {
			// first check if the "registeredValidationRules" object have a entry for this className already or not, if not, then initialized that using a empty object
			if (!registeredValidationRules[_className]) {
				registeredValidationRules[_className] = {};
			}

			// now check if the "registeredValidationRules[_className]" object have a entry for this propertyName already or not, if not, then initialized that using a empty array
			if (
				!registeredValidationRules[_className][propertyName] ||
				!registeredValidationRules[_className][propertyName].length
			) {
				registeredValidationRules[_className][propertyName] = [];
			}

			const maxValue = EValidationRules.Max.replace(
				dynamicPartToReplace,
				_value.toString()
			);

			// now add the validation rule needed for this validator decorator and keep the already applied rules for the field
			registeredValidationRules[_className] = {
				...registeredValidationRules[_className],
				[propertyName]: [
					...registeredValidationRules[_className][propertyName],
					maxValue,
				],
			};
		}
	};
}

class Course {
	@MaxLength(100)
	@MinLength(10)
	@isRequired
	title: string;

	@Max(10000)
	@Min(5)
	@Positive
	price: number;

	constructor(_title: string, _price: number) {
		this.title = _title;
		this.price = _price;
	}
}

// if it returns "true" that means all properties have valid value, otherwise invalid value "false"
const validateClassPropertiesBasedObAppliedValidationDecorators = (
	classObj: any
): boolean => {
	const _className = classObj.constructor.name; // same as defined before, every class object in javascript have a constructor object and also a name property which is the name of the class

	if (_className) {
		const _classValidationRules = registeredValidationRules[_className];

		if (_classValidationRules && Object.keys(_classValidationRules).length) {
			let _allPropertiesAreValid = true;
			for (const _propertyName in _classValidationRules) {
				if (
					Object.prototype.hasOwnProperty.call(
						_classValidationRules,
						_propertyName
					) &&
					_classValidationRules[_propertyName].length
				) {
					const _propertyValidationRulesStrArr =
						_classValidationRules[_propertyName];
					_propertyValidationRulesStrArr.forEach((_validationRule) => {
						// EValidationRules.Required
						if (_validationRule.includes(EValidationRules.Required)) {
							_allPropertiesAreValid =
								_allPropertiesAreValid && !!classObj[_propertyName];
						}

						// EValidationRules.Positive
						else if (_validationRule.includes(EValidationRules.Positive)) {
							_allPropertiesAreValid =
								_allPropertiesAreValid && classObj[_propertyName] > 0;
						}

						// EValidationRules.MinLength
						else if (
							_validationRule.includes(
								EValidationRules.MinLength.replace(dynamicPartToReplace, '')
							)
						) {
							_allPropertiesAreValid =
								_allPropertiesAreValid &&
								(classObj[_propertyName] as string).length >=
									parseInt(_validationRule.split(dynamicPartSeparator)[1]);
						}

						// EValidationRules.MaxLength
						else if (
							_validationRule.includes(
								EValidationRules.MaxLength.replace(dynamicPartToReplace, '')
							)
						) {
							_allPropertiesAreValid =
								_allPropertiesAreValid &&
								(classObj[_propertyName] as string).length <=
									parseInt(_validationRule.split(dynamicPartSeparator)[1]);
						}

						// EValidationRules.Min
						else if (
							_validationRule.includes(
								EValidationRules.Min.replace(dynamicPartToReplace, '')
							)
						) {
							_allPropertiesAreValid =
								_allPropertiesAreValid &&
								parseInt(classObj[_propertyName]) >=
									parseInt(_validationRule.split(dynamicPartSeparator)[1]);
							console.log({
								message:
									'i checked for property validation rule [EValidationRules.Min] for this property with these values',
								_allPropertiesAreValid,
								_propertyName,
								propertyValue: parseInt(classObj[_propertyName]),
								minValueRequestedByRule: parseInt(
									_validationRule.split(dynamicPartSeparator)[1]
								),
							});
						}

						// EValidationRules.Max
						else if (
							_validationRule.includes(
								EValidationRules.Max.replace(dynamicPartToReplace, '')
							)
						) {
							_allPropertiesAreValid =
								_allPropertiesAreValid &&
								parseInt(classObj[_propertyName]) <=
									parseInt(_validationRule.split(dynamicPartSeparator)[1]);
						}
					});
				}
			}

			return _allPropertiesAreValid;
		} else {
			return true;
		}
	} else {
		return true;
	}
};

console.log({ registeredValidationRules });

const _courseForm = document.querySelector('form');

if (_courseForm) {
	_courseForm.addEventListener('submit', (event) => {
		event.preventDefault();

		const _courseTitleEl = document.querySelector(
			'input#title'
		) as HTMLInputElement;
		const _coursePriceEl = document.querySelector(
			'input#price'
		) as HTMLInputElement;

		if (_courseTitleEl && _coursePriceEl) {
			const _courseTitle = _courseTitleEl.value;
			const _coursePrice = +_coursePriceEl.value;

			const _newCourseObj = new Course(_courseTitle, _coursePrice);

			if (
				!validateClassPropertiesBasedObAppliedValidationDecorators(
					_newCourseObj
				)
			) {
				console.error({ message: 'Invalid course', _newCourseObj });
			} else {
				console.info({ message: 'Valid course', _newCourseObj });
			}
		} else {
			alert(
				'No input field found with id "title" or "price", can not continue.'
			);
		}
	});
}

// Decorators

// this way is known as decorator factory, because in the end decorator is just a function which takes in a function (constructor function of the class we use decorator at), and does it job
// please note: decorators name is not required to start as capital but it's just a coding standard and convention to do so (like in angular)
const Logger = (mes: string) => {
	console.log({ message: 'logger decorator initialized.' });

	return (constructor: Function) => {
		console.log({
			message: 'logger decorator applied to class',
			mes,
			class: constructor,
		});
	};
};

interface IPerson {
	name: string;
	price: number;
}
interface IPersonConstructable {
	new (n: string, p: number): IPerson;
}

// this is a class decorator
// hookId: this is id of the element in html file whose content you want to replace with the class "name" property value
const WithTemplate = (hookId: string) => {
	console.log({ message: 'WithTemplate decorator initialized.' });

	return (constructor: IPersonConstructable) => {
		const personObj = new constructor('Ahsan', 10);
		const elem = document.getElementById(hookId)!;
		elem.innerHTML = personObj.name;

		console.log({
			message: 'WithTemplate decorator applied to class',
			hookId,
			class: constructor,
		});
	};
};

// this is a property decorator
// target: it will be prototype of object if it's a instance of the class (mean a non-static property), and will be the constructor function if the property on which the decorator is applied is a static property
// propertyName: name of the property on which the decorator is applied.
const LogPropertyDecorator = (target: any, propertyName: string) => {
	console.log({
		message: 'LogPropertyDecorator applied on some property, see the details',
		target,
		propertyName,
	});
};

// this is a accessor decorator
// target: it will be prototype of object if it's a instance of the class (mean a non-static property), and will be the constructor function if the property on which the decorator is applied is a static property
// accessorName: name of the accessor function on which the decorator is applied.
// propertyDescriptor: the information about the accessor function it self
const LogAccessorDecorator = (
	target: any,
	accessorName: string,
	propertyDescriptor: PropertyDescriptor
) => {
	console.log({
		message: 'LogAccessorDecorator applied on some accessor, see the details',
		target,
		accessorName,
		propertyDescriptor,
	});
};

// this is a method decorator
// target: it will be prototype of object if it's a instance of the class (mean a non-static property), and will be the constructor function if the property on which the decorator is applied is a static property
// methodName: name of the method function on which the decorator is applied.
// methodDescriptor: the information about the method function it self
const LogMethodDecorator = (
	target: any,
	methodName: string,
	methodDescriptor: PropertyDescriptor
) => {
	console.log({
		message: 'LogMethodDecorator applied on some method, see the details',
		target,
		methodName,
		methodDescriptor,
	});
};

// this is a method decorator
// target: it will be prototype of object if it's a instance of the class (mean a non-static property), and will be the constructor function if the property on which the decorator is applied is a static property
// methodName: name of the method function, where one of it's parameter received this parameter decorator.
// positionOfParameter: the position of the parameter on which this decorator is applied
const LogParameterDescriptor = (
	target: any,
	methodName: string,
	positionOfParameter: number
) => {
	console.log({
		message:
			'LogParameterDescriptor applied on some parameter, see the details',
		target,
		methodName,
		positionOfParameter,
	});
};

// with Template Class decorator which will modify the class constructor it self and will return the modified constructor which will get used when user will create a instance of the class where this decorator is applied
const ModifyClassConstructorDecorator = (elementId: string) => {
	console.log({
		message: 'ModifyClassConstructorDecorator decorator defined.',
	});
	return <T extends { new (...args: any[]): { name: string } }>(
		classConstructorFun: T
	) => {
		console.log({
			message:
				'ModifyClassConstructorDecorator decorator called on some class with elementId: ' +
				elementId,
		});
		return class extends classConstructorFun {
			constructor(..._: any[]) {
				super(..._); // here because the class constructor where i applied this decorator needs these parameters so i need to pass these down to make sure it's get initialized properly, otherwise i will see undefined (as constructor of the inner/extended class does not gets these parameters which it needs)
				// super(); // if i comment the above line and uncomment this one you will see "undefined" in "#app" content as i'm not passing the "name" parameter/property value to class constructor (the extended class constructor ("super")).
				const _element = document.querySelector(`#${elementId}`);
				console.log({
					message:
						'ModifyClassConstructorDecorator decorator, class object created (on which this decorator was applied)',
					elementId,
					_element,
					name: this.name,
				});
				if (_element) {
					_element.innerHTML = this.name;
				}
			}
		};
	};
};

// create a class and apply decorators to that class to see them in action
@Logger('Just a message passed to logger decorator')
@ModifyClassConstructorDecorator('app')
class Person implements IPerson {
	@LogPropertyDecorator
	public _price: number;

	@LogAccessorDecorator
	set price(val: number) {
		if (val > 0) {
			this._price = val;
		} else {
			throw new Error('invalid price should be greater than 0.');
		}
	}

	get price() {
		return this._price;
	}
	constructor(public name: string, price: number) {
		this._price = price;
	}

	@LogMethodDecorator
	getPriceWithTax(@LogParameterDescriptor tax: number) {
		if (tax > 0) {
			return this._price * (1 + tax);
		} else {
			throw new Error('invalid tax should be greater than 0.');
		}
	}
}

console.log(
	'-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------'
);
const _person = new Person(
	'Ahsan is the name i passed when i created a object of person class',
	10
);
console.log({
	message: 'newly created person object',
	_person,
	personName: _person.name,
});
_person.name = 'okay now i see the name value :)'; // but it will not get rerendered on the frontend in the "#app" element as that is not configured

console.log({
	message:
		'person name updated, but frontend will still show the old value (if the value was passed to constructor by "ModifyClassConstructorDecorator" otherwise it will be "undefined".',
	_person,
	personName: _person.name,
});

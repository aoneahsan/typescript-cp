// // Decorators

// // this way is known as decorator factory, because in the end decorator is just a function which takes in a function (constructor function of the class we use decorator at), and does it job
// function Logger(mes: string) {
// 	console.log({ message: 'logger decorator initialized.' });

// 	return function (constructor: Function) {
// 		console.log({
// 			message: 'logger decorator applied to class',
// 			mes,
// 			class: constructor,
// 		});
// 	};
// }
// interface IPerson {
// 	name: string;
// }
// interface IPersonConstructable {
// 	new (n: string): IPerson;
// }

// function WithTemplate(hookId: string) {
// 	console.log({ message: 'WithTemplate decorator initialized.' });

// 	return function (constructor: IPersonConstructable) {
// 		const personObj = new constructor('Ahsan');
// 		const elem = document.getElementById(hookId)!;
// 		elem.innerHTML = personObj.name;

// 		console.log({
// 			message: 'WithTemplate decorator applied to class',
// 			hookId,
// 			class: constructor,
// 		});
// 	};
// }

// // create a class and apply decorators to that class to see them in action
// @Logger('Just a message passed to logger decorator')
// @WithTemplate('app')
// class Person implements IPerson {
// 	constructor(public name: string) {}
// }

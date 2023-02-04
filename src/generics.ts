// GENERICS

const arr = ['ahsan', '12'];
const arr1: Array<string> = ['ahsan', '12'];

const promises: Promise<string> = new Promise((res) => {
	setTimeout(() => {
		res('oka');
	}, 2300);
});

promises.then((result) => result.toUpperCase()); // any string operation works

// Creating my own generic
// function merge(obj1: object, obj2: object) {
// 	return Object.assign(obj1, obj2)
// }

// const mergeRes = merge({ name: 'ahsan' }, { age: 24 })
// console.log(mergeRes, mergeRes.)// does not give any auto complete or know anything about the result it will get.

function merge<U extends object, V extends object>(obj1: U, obj2: V) {
	return Object.assign(obj1, obj2);
}

const mergeRes = merge({ name: 'ahsan' }, { age: 24 });
console.log(mergeRes, mergeRes.name); // does give proper auto complete and knows what it will get in result (which is a intersection of type of both props)

// Creating a data storage with generic class
class DataStorage<T extends string | boolean | number> {
	private data: T[] = [];

	addItem(item: T): void {
		this.data.push(item);
	}

	removeItem<U extends boolean>(removeFromStart?: U): void {
		if (removeFromStart) {
			this.data.shift();
		} else {
			this.data.pop();
		}
	}

	removeExactItem(item: T): void {
		console.log({
			index: this.data.indexOf(item),
			c: this.data.indexOf(item) > -1,
		});
		if (this.data.indexOf(item) > -1) {
			this.data.splice(this.data.indexOf(item), 1);
		}
	}

	getItems(): T[] {
		return this.data;
	}
}

const textStorage = new DataStorage<string>();
const numberStorage = new DataStorage<number>();

textStorage.addItem('ahsan');
textStorage.addItem('ahsan');
textStorage.addItem('ahsan');
textStorage.addItem('ahsan3');
textStorage.addItem('ahsan');
textStorage.addItem('ahsan');
textStorage.addItem('ahsan');

textStorage.removeItem();
textStorage.removeItem(true);
textStorage.removeExactItem('ahsan3');

console.log({ res: textStorage.getItems() });

function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
	return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, 'a');
// getProperty(x, 'm'); // as the key not available in the object so it is not allowed this happened due to "Key extends keyof Type"

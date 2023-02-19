import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';

import { ProjectInput } from './components/project-input';
import { ProjectList } from './components/project-list';
import { EProjectStatus } from './utils/enums';

// --------------------------------------------------------------------------------------------
// ------------------------------------------ OBJECTS -----------------------------------------
// --------------------------------------------------------------------------------------------
new ProjectInput('project-input', 'app');
new ProjectList('project-list', 'app', EProjectStatus.active);
new ProjectList('project-list', 'app', EProjectStatus.finished);

// testing with "class-transform" package
class User {
	constructor(public id: string, public name: string, public age: number) {}

	getInfo() {
		return { id: this.id, name: this.name, age: this.age };
	}
}

const usersData = [
	{ id: 1, name: 'ahsan', age: 20 },
	{ id: 1, name: 'ahsan', age: 20 },
	{ id: 1, name: 'ahsan', age: 20 },
	{ id: 1, name: 'ahsan', age: 20 },
	{ id: 1, name: 'ahsan', age: 20 },
	{ id: 1, name: 'ahsan', age: 20 },
];

const formattedUsersData = plainToInstance(User, usersData);

for (let i = 0; i < formattedUsersData.length; i++) {
	const element = formattedUsersData[i];
	console.log({ element, info: element.getInfo() });
}

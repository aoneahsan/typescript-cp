import { AutoBindThisKeyword } from '../decorators/autobind.js';
import { IProject } from '../interfaces/interfaces.js';
import { projectState } from '../state/project.js';
import { EProjectStatus } from '../utils/enums.js';
import { validateField } from '../utils/validation.js';
import { Component } from './base-component.js';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	titleInputEl: HTMLInputElement | undefined;
	descriptionInputEl: HTMLInputElement | undefined;
	peopleInputEl: HTMLInputElement | undefined;

	constructor(templateId: string, hostId: string) {
		super(templateId, hostId, true, 'user-input');
		// first select all dom elements and store their reference in class properties
		this.configure();

		// now add the event handlers to form and input fields
		this.addEventHandlersToElements();
	}

	private addEventHandlersToElements() {
		this.componentEl?.addEventListener('submit', this.formSubmitHandler);
	}

	@AutoBindThisKeyword
	private formSubmitHandler(event: Event) {
		event.preventDefault();

		const _userInput = this.gatherUserInput();
		if (_userInput) {
			const _projectData: IProject = {
				id: Math.random().toString(),
				title: _userInput[0],
				description: _userInput[1],
				people: _userInput[2],
				status: EProjectStatus.active,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			projectState.addProject(_projectData);

			this.clearFormInputFields();
		}
	}

	private gatherUserInput(): [string, string, number] | void {
		const _title = this.titleInputEl?.value!;
		const _description = this.descriptionInputEl?.value!;
		const _people = this.peopleInputEl?.value!;

		if (
			validateField({ value: _title, required: true }) &&
			validateField({ value: _description, required: true }) &&
			validateField({ value: _people, required: true, positive: true })
		) {
			return [_title, _description, +_people];
		} else {
			alert('Invalid user input');
		}
	}

	private clearFormInputFields() {
		if (this.titleInputEl && this.descriptionInputEl && this.peopleInputEl) {
			this.titleInputEl.value = '';
			this.descriptionInputEl.value = '';
			this.peopleInputEl.value = '';
		}
	}

	configure() {
		if (this.componentEl) {
			// select input elements inside the form element
			this.titleInputEl = this.componentEl.querySelector(
				'#title'
			)! as HTMLInputElement;
			this.descriptionInputEl = this.componentEl.querySelector(
				'#description'
			)! as HTMLInputElement;
			this.peopleInputEl = this.componentEl.querySelector(
				'#people'
			)! as HTMLInputElement;
		}
	}
}

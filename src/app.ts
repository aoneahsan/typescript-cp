// --------------------------------------------------------------------------------------------
// ---------------------------------------- DECORATORS ----------------------------------------
// --------------------------------------------------------------------------------------------
// Auto bind method decorator to resolve the problem of "this" keyword getting incorrect value
// target: constructor or prototype of class object
const AutoBindThisKeyword = (
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

// --------------------------------------------------------------------------------------------
// ---------------------------------------- VALIDATIONS ---------------------------------------
// --------------------------------------------------------------------------------------------
interface IValidatable {
	value: string | number;
	required?: boolean;
	positive?: boolean;
}

const validateField = (_input: IValidatable) => {
	let _fieldIsValid = true;
	if (_input.required && !_input.value.toString().trim()) {
		_fieldIsValid = false;
	}

	if (_input.positive && typeof _input.value === 'number' && _input.value < 0) {
		_fieldIsValid = false;
	}

	return _fieldIsValid;
};

// --------------------------------------------------------------------------------------------
// ------------------------------------------ CLASSES -----------------------------------------
// --------------------------------------------------------------------------------------------
class ProjectInput {
	templateEl: HTMLTemplateElement | undefined;
	appDivEl: HTMLDivElement | undefined;
	projectInputFormEl: HTMLFormElement | undefined;
	titleInputEl: HTMLInputElement | undefined;
	descriptionInputEl: HTMLInputElement | undefined;
	peopleInputEl: HTMLInputElement | undefined;

	constructor(_appDivElId: string, _projectInputTemplateElId: string) {
		// first select all dom elements and store their reference in class properties
		this.selectDomElements(_appDivElId, _projectInputTemplateElId);

		// now add the event handlers to form and input fields
		this.addEventHandlersToElements();

		// now attach elements to dom
		this.attachProjectInputFormToDom();
	}

	private addEventHandlersToElements() {
		this.projectInputFormEl?.addEventListener('submit', this.formSubmitHandler);
	}

	@AutoBindThisKeyword
	private formSubmitHandler(event: Event) {
		event.preventDefault();

		const _userInput = this.gatherUserInput();
		console.log({ _userInput });

		this.clearFormInputFields();
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

	private selectDomElements(
		_appDivElId: string,
		_projectInputTemplateElId: string
	) {
		// select template and main app div element
		this.templateEl = document.getElementById(
			_projectInputTemplateElId
		)! as HTMLTemplateElement;
		this.appDivEl = document.getElementById(_appDivElId)! as HTMLDivElement;

		// get access to the form element inside the template element
		const _templateImportedNode = document.importNode(
			this.templateEl.content,
			true
		);

		this.projectInputFormEl =
			_templateImportedNode.firstElementChild! as HTMLFormElement;

		// this.projectInputFormEl.setAttribute('id', 'user-input');
		this.projectInputFormEl.id = 'user-input';

		// select input elements inside the form element
		this.titleInputEl = this.projectInputFormEl.querySelector(
			'#title'
		)! as HTMLInputElement;
		this.descriptionInputEl = this.projectInputFormEl.querySelector(
			'#description'
		)! as HTMLInputElement;
		this.peopleInputEl = this.projectInputFormEl.querySelector(
			'#people'
		)! as HTMLInputElement;
	}

	private attachProjectInputFormToDom() {
		if (this.appDivEl && this.projectInputFormEl) {
			this.appDivEl.insertAdjacentElement(
				'afterbegin',
				this.projectInputFormEl
			);
		} else {
			throw new Error(
				'Can not find either app div or form element in html file, please check.'
			);
		}
	}
}

class ProjectList {
	constructor(public type: 'Active' | 'Finished') {}
}

// --------------------------------------------------------------------------------------------
// ------------------------------------------ OBJECTS -----------------------------------------
// --------------------------------------------------------------------------------------------
const projectInput = new ProjectInput('app', 'project-input');

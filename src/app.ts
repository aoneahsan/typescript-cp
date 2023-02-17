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
// ----------------------------------- Project State Class ------------------------------------
// --------------------------------------------------------------------------------------------
enum EProjectType {
	active = 'active',
	finished = 'finished',
}
interface IProject {
	id: string;
	title: string;
	description: string;
	people: number;
	type: EProjectType;
	createdAt: Date;
	updatedAt: Date;
}
type IListenerFunc<T> = (projects: T[]) => void;
type IListener<T> = {
	listType: EProjectType;
	listenerFunc: IListenerFunc<T>;
};

class State<T> {
	protected listeners: IListener<T>[] = [];
	constructor() {}

	addListener(listType: EProjectType, listenerFunc: IListenerFunc<T>) {
		this.listeners.push({ listType, listenerFunc });
	}
}

class ProjectState extends State<IProject> {
	private static instance: ProjectState;
	private projects: IProject[] = [];
	constructor() {
		super();
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new ProjectState();
			return this.instance;
		} else {
			return this.instance;
		}
	}

	addProject(data: IProject) {
		this.projects.push(data);
		const _activeProjects = this.projects.filter(
			(el) => el.type === EProjectType.active
		);
		const _finishedProjects = this.projects.filter(
			(el) => el.type === EProjectType.finished
		);

		if (this.listeners.length) {
			for (let i = 0; i < this.listeners.length; i++) {
				const _listener = this.listeners[i];
				_listener.listenerFunc(
					_listener.listType === EProjectType.active
						? _activeProjects.slice()
						: _listener.listType === EProjectType.finished
						? _finishedProjects.slice()
						: []
				);
			}
		}
	}
}

const projectState = ProjectState.getInstance();

// --------------------------------------------------------------------------------------------
// ------------------------------------- Components CLASSES -----------------------------------
// --------------------------------------------------------------------------------------------
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	templateEl: HTMLTemplateElement | undefined;
	hostEl: T | undefined;
	componentEl: U | undefined;

	constructor(
		templateId: string,
		hostId: string,
		insertAtStart: boolean,
		componentElId?: string
	) {
		// select template and main app div element
		this.templateEl = document.getElementById(
			templateId
		)! as HTMLTemplateElement;
		this.hostEl = document.getElementById(hostId)! as T;

		// get access to the form element inside the template element
		const _templateImportedNode = document.importNode(
			this.templateEl.content,
			true
		);

		this.componentEl = _templateImportedNode.firstElementChild! as U;

		if (componentElId) {
			this.componentEl.id = 'user-input';
		}

		// now attach elements to dom
		this.attach(insertAtStart);
	}

	private attach(insertAtStart: boolean) {
		if (this.hostEl && this.componentEl) {
			this.hostEl.insertAdjacentElement(
				insertAtStart ? 'afterbegin' : 'beforeend',
				this.componentEl
			);
		} else {
			throw new Error(
				'Can not find either app div or form element in html file, please check.'
			);
		}
	}

	abstract configure(): void;
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
				type: EProjectType.active,
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

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
	assignedProjects: IProject[] = [];

	constructor(
		hostId: string,
		templateId: string,
		public projectListType: EProjectType
	) {
		super(templateId, hostId, false, `${projectListType}-projects`);
		// first select all dom elements and store their reference in class properties
		this.configure();

		// setup a listener for new projects
		projectState.addListener(
			this.projectListType,
			(projectsData: IProject[]) => {
				this.assignedProjects = projectsData;

				this.renderProjectsItems();
			}
		);
	}

	configure() {
		if (this.componentEl) {
			this.componentEl.querySelector(
				'h2'
			)!.innerHTML = `${this.projectListType.toUpperCase()} PROJECTS`;

			this.componentEl.querySelector(
				'ul'
			)!.id = `${this.projectListType}-projects-list`;
		}
	}

	private renderProjectsItems() {
		const _uListEl = document.getElementById(
			`${this.projectListType}-projects-list`
		);
		if (this.assignedProjects.length && _uListEl) {
			_uListEl.innerHTML = '';
			for (let i = 0; i < this.assignedProjects.length; i++) {
				const project = this.assignedProjects[i];
				const listItem = document.createElement('li');
				listItem.innerText = project.title;
				_uListEl.appendChild(listItem);
			}
		}
	}
}

// --------------------------------------------------------------------------------------------
// ------------------------------------------ OBJECTS -----------------------------------------
// --------------------------------------------------------------------------------------------
const projectInput = new ProjectInput('project-input', 'app');
const activeProjectList = new ProjectList(
	'project-list',
	'app',
	EProjectType.active
);
const finishedProjectList = new ProjectList(
	'project-list',
	'app',
	EProjectType.finished
);

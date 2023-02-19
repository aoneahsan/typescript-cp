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
enum EProjectStatus {
	active = 'active',
	finished = 'finished',
}
interface IProject {
	id: string;
	title: string;
	description: string;
	people: number;
	status: EProjectStatus;
	createdAt: Date;
	updatedAt: Date;
}
type IListenerFunc<T> = (projects: T[]) => void;
type IListener<T> = {
	listType: EProjectStatus;
	listenerFunc: IListenerFunc<T>;
};

class State<T> {
	protected listeners: IListener<T>[] = [];
	constructor() {}

	addListener(listType: EProjectStatus, listenerFunc: IListenerFunc<T>) {
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

		this.updateProjectsListUI();
	}

	projectExists(projectId: string) {
		if (projectId) {
			return this.projects.findIndex((el) => el.id === projectId) > -1;
		} else return false;
	}

	updateProjectStatus(projectId: string, newStatus: EProjectStatus) {
		if (this.projectExists(projectId)) {
			const _project = this.projects.find((el) => el.id === projectId);
			if (_project!.status !== newStatus) {
				this.projects = this.projects.map((el) => {
					if (el.id === projectId) {
						return {
							...el,
							status: newStatus,
						};
					} else return el;
				});

				this.updateProjectsListUI();
			}
		}
	}

	private updateProjectsListUI() {
		if (this.listeners.length) {
			const _activeProjects = this.projects.filter(
				(el) => el.status === EProjectStatus.active
			);
			const _finishedProjects = this.projects.filter(
				(el) => el.status === EProjectStatus.finished
			);

			for (let i = 0; i < this.listeners.length; i++) {
				const _listener = this.listeners[i];
				_listener.listenerFunc(
					_listener.listType === EProjectStatus.active
						? _activeProjects.slice()
						: _listener.listType === EProjectStatus.finished
						? _finishedProjects.slice()
						: []
				);
			}
		}
	}
}

const projectState = ProjectState.getInstance();

// --------------------------------------------------------------------------------------------
// ------------------------------------- Drab & Drop Logic ------------------------------------
// --------------------------------------------------------------------------------------------
interface IDraggable {
	dragStartHandler(event: DragEvent): void;
	dragEndHandler(event: DragEvent): void;
}

interface IDropable {
	dragOverHandler(event: DragEvent): void;
	dragLeaveHandler(event: DragEvent): void;
	dropHandler(event: DragEvent): void;
}

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
			this.componentEl.id = componentElId;
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

class ProjectItem
	extends Component<HTMLUListElement, HTMLLIElement>
	implements IDraggable
{
	projectTitleEl: HTMLHeadingElement | undefined;
	projectPeopleCountEl: HTMLHeadingElement | undefined;
	projectDescriptionEl: HTMLParagraphElement | undefined;

	get peopleCount() {
		return `${this.project.people} Person${
			this.project.people > 1 ? 's' : ''
		} Assigned.`;
	}

	constructor(templateId: string, hostId: string, private project: IProject) {
		super(templateId, hostId, false, project.id);

		this.configure();
	}

	@AutoBindThisKeyword
	dragStartHandler(event: DragEvent): void {
		if (event.dataTransfer) {
			event.dataTransfer.setData('text/plain', this.project.id);
			event.dataTransfer.effectAllowed = 'move';
		}
	}

	@AutoBindThisKeyword
	dragEndHandler(event: DragEvent): void {
		console.log({ eventName: 'dragEndHandler', event });
	}

	configure(): void {
		if (this.componentEl) {
			// add event listeners
			this.componentEl.addEventListener('dragstart', this.dragStartHandler);
			this.componentEl.addEventListener('dragend', this.dragEndHandler);

			// add other configuration logic
			this.projectTitleEl = this.componentEl.querySelector(
				'h2'
			)! as HTMLHeadingElement;
			this.projectPeopleCountEl = this.componentEl.querySelector(
				'h3'
			)! as HTMLHeadingElement;
			this.projectDescriptionEl = this.componentEl.querySelector(
				'p'
			)! as HTMLParagraphElement;
			this.projectTitleEl.innerText = this.project.title;
			const random = parseInt((Math.random() * 11).toString());
			if (random > 5) {
				// example using function
				this.projectPeopleCountEl.innerText = this.getPeopleCount();
			} else {
				// example using getter
				this.projectPeopleCountEl.innerText = this.peopleCount;
			}

			this.projectDescriptionEl.innerText = this.project.description;
		}
	}

	// instead of this we can also use a getter property.
	getPeopleCount(): string {
		return `No of people: ${this.project.people}`;
	}
}

class ProjectList
	extends Component<HTMLDivElement, HTMLElement>
	implements IDropable
{
	assignedProjects: IProject[] = [];
	listUlEl: HTMLUListElement | undefined;

	constructor(
		templateId: string,
		hostId: string,
		public projectListType: EProjectStatus
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

	@AutoBindThisKeyword
	dragOverHandler(event: DragEvent): void {
		event.preventDefault();
		this.updateDroppableClass(true);
	}

	@AutoBindThisKeyword
	dragLeaveHandler(_: DragEvent): void {
		this.updateDroppableClass(false);
	}

	@AutoBindThisKeyword
	dropHandler(event: DragEvent): void {
		if (event.dataTransfer) {
			const projectId = event.dataTransfer.getData('text/plain');

			this.updateTheProjectItemStatus(projectId);
			this.updateDroppableClass(false);
		}
	}

	configure() {
		if (this.componentEl) {
			// add event listeners
			this.componentEl.addEventListener('dragover', this.dragOverHandler);
			this.componentEl.addEventListener('dragleave', this.dragLeaveHandler);
			this.componentEl.addEventListener('drop', this.dropHandler);

			// add other configuration logic
			this.componentEl.querySelector(
				'h2'
			)!.innerHTML = `${this.projectListType.toUpperCase()} PROJECTS`;

			this.listUlEl = this.componentEl.querySelector('ul')!;
			this.listUlEl.id = `${this.projectListType}-projects-list`;
		}
	}

	private renderProjectsItems() {
		const _uListEl = document.getElementById(
			`${this.projectListType}-projects-list`
		);
		if (_uListEl && this.listUlEl) {
			_uListEl.innerHTML = '';
			for (let i = 0; i < this.assignedProjects.length; i++) {
				new ProjectItem(
					'single-project',
					this.listUlEl.id,
					this.assignedProjects[i]
				);
				// const project = this.assignedProjects[i];
				// const listItem = document.createElement('li');
				// listItem.innerText = project.title;
				// _uListEl.appendChild(listItem);
			}
		}
	}

	private updateTheProjectItemStatus(projectId: string) {
		if (projectState.projectExists(projectId)) {
			projectState.updateProjectStatus(projectId, this.projectListType);
		}
	}

	private updateDroppableClass(insert: boolean) {
		const ulListEl = this.componentEl?.querySelector('ul')!;
		if (insert) {
			ulListEl.classList.add('droppable');
		} else {
			ulListEl.classList.remove('droppable');
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
	EProjectStatus.active
);
const finishedProjectList = new ProjectList(
	'project-list',
	'app',
	EProjectStatus.finished
);

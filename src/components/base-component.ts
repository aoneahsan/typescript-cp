// --------------------------------------------------------------------------------------------
// ------------------------------------- Components CLASSES -----------------------------------
// --------------------------------------------------------------------------------------------
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

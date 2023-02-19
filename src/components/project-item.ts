import { AutoBindThisKeyword } from '../decorators/autobind.js';
import { IDraggable, IProject } from '../interfaces/interfaces.js';
import { Component } from './base-component.js';

export class ProjectItem
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

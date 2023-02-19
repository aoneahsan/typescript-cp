import { AutoBindThisKeyword } from '../decorators/autobind';
import { IDropable, IProject } from '../interfaces/interfaces';
import { projectState } from '../state/project';
import { EProjectStatus } from '../utils/enums';
import { Component } from './base-component';
import { ProjectItem } from './project-item';

export class ProjectList
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

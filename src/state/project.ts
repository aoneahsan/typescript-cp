/// <reference path="./../interfaces/interfaces.ts" />
/// <reference path="./../utils/enums.ts" />

namespace App {
	// --------------------------------------------------------------------------------------------
	// ----------------------------------- Project State Class ------------------------------------
	// --------------------------------------------------------------------------------------------

	class State<T> {
		protected listeners: IListener<T>[] = [];
		constructor() {}

		addListener(listType: EProjectStatus, listenerFunc: IListenerFunc<T>) {
			this.listeners.push({ listType, listenerFunc });
		}
	}

	export class ProjectState extends State<IProject> {
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

	export const projectState = ProjectState.getInstance();
}

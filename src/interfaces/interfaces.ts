import { EProjectStatus } from '../utils/enums.js';

export interface IValidatable {
	value: string | number;
	required?: boolean;
	positive?: boolean;
}
export interface IProject {
	id: string;
	title: string;
	description: string;
	people: number;
	status: EProjectStatus;
	createdAt: Date;
	updatedAt: Date;
}
export type IListenerFunc<T> = (projects: T[]) => void;
export type IListener<T> = {
	listType: EProjectStatus;
	listenerFunc: IListenerFunc<T>;
};
export interface IDraggable {
	dragStartHandler(event: DragEvent): void;
	dragEndHandler(event: DragEvent): void;
}

export interface IDropable {
	dragOverHandler(event: DragEvent): void;
	dragLeaveHandler(event: DragEvent): void;
	dropHandler(event: DragEvent): void;
}

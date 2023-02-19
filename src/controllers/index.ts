import { RequestHandler } from 'express';
import { ITodo } from '../interfaces';

let TODOs: ITodo[] = [];

export const getTodos: RequestHandler = (req, res, next) => {
	res.status(200).json({ success: true, data: TODOs });
};

export const createTodo: RequestHandler = (req, res, next) => {
	const text = req.body.text;

	TODOs.push({ id: Math.random().toString(), text });
	res.status(201).json({ success: true, data: TODOs });
};

export const updateTodo: RequestHandler = (req, res, next) => {
	const todoId: ITodo | undefined = TODOs.find((el) => el.id === req.body.id);
	res.status(200).json({ success: true, data: todoId });
};

export const deleteTodo: RequestHandler = (req, res, next) => {
	TODOs = TODOs.filter((el) => el.id !== req.body.id);
	res.status(200).json({ success: true, data: TODOs });
};

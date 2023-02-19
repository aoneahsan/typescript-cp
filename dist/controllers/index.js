"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getTodos = void 0;
let TODOs = [];
const getTodos = (req, res, next) => {
    res.status(200).json({ success: true, data: TODOs });
};
exports.getTodos = getTodos;
const createTodo = (req, res, next) => {
    const text = req.body.text;
    TODOs.push({ id: Math.random().toString(), text });
    res.status(201).json({ success: true, data: TODOs });
};
exports.createTodo = createTodo;
const updateTodo = (req, res, next) => {
    const todoId = TODOs.find((el) => el.id === req.body.id);
    res.status(200).json({ success: true, data: todoId });
};
exports.updateTodo = updateTodo;
const deleteTodo = (req, res, next) => {
    TODOs = TODOs.filter((el) => el.id !== req.body.id);
    res.status(200).json({ success: true, data: TODOs });
};
exports.deleteTodo = deleteTodo;

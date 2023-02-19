"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const routes_1 = __importDefault(require("./routes"));
const expressApp = (0, express_1.default)();
expressApp.use((0, body_parser_1.json)());
expressApp.use('/todos', routes_1.default);
expressApp.use((err, req, res, next) => {
    res.status(500).send(err.message);
});
expressApp.listen(4000);

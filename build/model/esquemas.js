"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autores = exports.Libros = void 0;
const mongoose_1 = require("mongoose");
// Definimos el Schema
const librosSchema = new mongoose_1.Schema({
    isbn: Number,
    titulo: String,
    autor: String,
    genero: String,
    editorial: String,
    numPag: Number,
    anioEdic: Date,
    precio: Number,
    uniVendi: Number
});
const autoresSchema = new mongoose_1.Schema({
    nombre: String,
    fNacimiento: Date,
    pais: String
});
exports.Libros = mongoose_1.model('libros', librosSchema);
exports.Autores = mongoose_1.model('autores', autoresSchema);

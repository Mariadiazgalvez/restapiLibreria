"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const esquemas_1 = require("../model/esquemas");
const database_1 = require("../database/database");
class Routes {
    constructor() {
        this.getLibros = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield esquemas_1.Libros.find();
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getAutor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield esquemas_1.Autores.find();
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getAutores = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield esquemas_1.Autores.aggregate([
                    {
                        $lookup: {
                            from: "libros",
                            localField: "nombre",
                            foreignField: "autor",
                            as: "libros"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getLibro = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { isbn, autor } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield esquemas_1.Libros.findOne({ isbn: isbn, autor: autor });
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getidAutor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield esquemas_1.Autores.aggregate([
                    {
                        $lookup: {
                            from: "libros",
                            localField: "nombre",
                            foreignField: "autor",
                            as: "libros"
                        }
                    }, {
                        $match: {
                            nombre: nombre
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.deleteAutor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            yield database_1.db.conectarBD();
            yield esquemas_1.Autores.findOneAndDelete({ nombre: nombre });
            yield database_1.db.desconectarBD();
        });
        this.deleteLibro = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { isbn, autor } = req.params;
            yield database_1.db.conectarBD();
            yield esquemas_1.Libros.findOneAndDelete({ isbn: isbn, autor: autor });
            yield database_1.db.desconectarBD();
        });
        this.updateLibro = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { isbn, autor } = req.params;
            const { titulo, genero, editorial, numPag, anioEdic, precio, uniVendi } = req.body;
            yield database_1.db.conectarBD();
            yield esquemas_1.Libros.findOneAndUpdate({
                isbn: isbn, autor: autor
            }, {
                isbn: isbn,
                titulo: titulo,
                autor: autor,
                genero: genero,
                editorial: editorial,
                numPag: numPag,
                anioEdic: anioEdic,
                precio: precio,
                uniVendi: uniVendi
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.updateAutor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            const { fNacimiento, pais } = req.body;
            yield database_1.db.conectarBD();
            yield esquemas_1.Autores.findOneAndUpdate({
                nombre: nombre
            }, {
                nombre: nombre,
                fNacimiento: fNacimiento,
                pais: pais
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.nuevoLibro = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { isbn, titulo, autor, genero, editorial, numPag, anioEdic, precio, uniVendi } = req.body;
            const schema = {
                isbn: parseInt(isbn),
                titulo: titulo,
                autor: autor,
                genero: genero,
                editorial: editorial,
                numPag: parseInt(numPag),
                anioEdic: anioEdic,
                precio: parseInt(precio),
                uniVendi: parseInt(uniVendi)
            };
            const nSchema = new esquemas_1.Libros(schema);
            yield database_1.db.conectarBD();
            yield nSchema.save()
                .then((doc) => {
                console.log(doc);
                res.json(doc);
            })
                .catch((err) => {
                console.log(err);
                res.json(err);
            });
            yield database_1.db.desconectarBD();
        });
        this.nuevoAutor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre, fNacimiento, pais } = req.body;
            const schema = {
                nombre: nombre,
                fNacimiento: fNacimiento,
                pais: pais
            };
            const nSchema = new esquemas_1.Autores(schema);
            yield database_1.db.conectarBD();
            yield nSchema.save()
                .then((doc) => {
                console.log(doc);
                res.json(doc);
            })
                .catch((err) => {
                console.log(err);
                res.json(err);
            });
            yield database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    Rutas() {
        this._router.get('/libro/:isbn&:autor', this.getLibro),
            this._router.get('/libros', this.getLibros),
            this._router.get('/autores', this.getAutor),
            this._router.get('/autorLib', this.getAutores),
            this._router.get('/autor/:nombre', this.getidAutor),
            this._router.get('/deleteAutor/:nombre', this.deleteAutor),
            this._router.get('/deleteLibro/:isbn&:autor', this.deleteLibro),
            this._router.post('/libros/:isbn&:autor', this.updateLibro),
            this._router.post('/autor/:nombre', this.updateAutor),
            this._router.post('/nuevo', this.nuevoLibro),
            this._router.post('/nuevoA', this.nuevoAutor);
    }
}
const obj = new Routes();
obj.Rutas();
exports.routes = obj.router;

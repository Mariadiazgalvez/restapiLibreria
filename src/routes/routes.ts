import {Request, Response, Router } from 'express'
import { Libros, Autores } from '../model/esquemas'
import { db } from '../database/database'

class Routes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getLibros = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Libros.find()
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getAutor = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Autores.find()
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }
    private getAutores = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Autores.aggregate([
                {
                     $lookup:
                        {
                             from: "libros",
                             localField: "nombre",
                             foreignField: "autor",
                             as: "libros"
                         }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getLibro = async (req:Request, res: Response) => {
        const { isbn, autor } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Libros.findOne(
                {isbn:isbn, autor:autor}
            )  
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }
    

    private getidAutor = async (req:Request, res: Response) => {
        const { nombre } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Autores.aggregate([
                {
                     $lookup:
                        {
                             from: "libros",
                             localField: "nombre",
                             foreignField: "autor",
                             as: "libros"
                         }
                },{
                    $match: {
                        nombre:nombre
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }


    private deleteAutor = async (req: Request, res: Response) => {
        const { nombre } = req.params
        await db.conectarBD()
        await Autores.findOneAndDelete(
            {nombre:nombre},
            )
        await db.desconectarBD()
    }

    private deleteLibro = async (req: Request, res: Response) => {
        const { isbn, autor } = req.params
        await db.conectarBD()
        await Libros.findOneAndDelete(
            {isbn:isbn, autor:autor},
            )
        await db.desconectarBD()
    }

    private updateLibro = async (req: Request, res: Response) => {
        const {isbn,autor} =req.params
        const {titulo, genero, editorial, numPag, anioEdic, precio, uniVendi } = req.body
        await db.conectarBD()
        await Libros.findOneAndUpdate({
            isbn: isbn, autor:autor
        },{
            isbn:isbn,
            titulo:titulo,
            autor:autor,
            genero:genero,
            editorial:editorial,
            numPag:numPag,
            anioEdic:anioEdic,
            precio:precio,
            uniVendi:uniVendi
        },{
            new:true,
            runValidators:true
        }
        )
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private updateAutor = async (req: Request, res: Response) => {
        const {nombre} =req.params
        const {fNacimiento, pais } = req.body
        await db.conectarBD()
        await Autores.findOneAndUpdate({
            nombre: nombre
        },{
            nombre: nombre,
	        fNacimiento:fNacimiento,
            pais:pais
        },{
            new:true,
            runValidators:true
        }
        )
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private nuevoLibro = async (req: Request, res: Response) => {
        const {isbn, titulo, autor, genero, editorial, numPag, anioEdic, precio, uniVendi} = req.body
        const schema = {
            isbn:parseInt(isbn),
            titulo:titulo,
            autor:autor,
            genero:genero,
            editorial:editorial,
            numPag:parseInt(numPag),
            anioEdic:anioEdic,
            precio:parseInt(precio),
            uniVendi:parseInt(uniVendi)
        }
        const nSchema = new Libros(schema)
        await db.conectarBD()
        await nSchema.save()
        .then((doc) => {
            console.log(doc)
            res.json(doc)
        })
        .catch((err: any) => {
            console.log(err)
            res.json(err)
        })    
        await db.desconectarBD()
    }

    private nuevoAutor = async (req: Request, res: Response) => {
        const {nombre, fNacimiento, pais } = req.body
        const schema = {
            nombre:nombre,
            fNacimiento:fNacimiento,
            pais:pais

        }
        const nSchema = new Autores(schema)
        await db.conectarBD()
        await nSchema.save()
        .then((doc) => {
            console.log(doc)
            res.json(doc)
        })
        .catch((err: any) => {
            console.log(err)
            res.json(err)
        })    
        await db.desconectarBD()
    }
    
  
    Rutas(){
        
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
        this._router.post('/nuevoA', this.nuevoAutor)
        
    }
}

const obj = new Routes()
obj.Rutas()
export const routes = obj.router
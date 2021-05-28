import {Schema, model } from 'mongoose'

// Definimos el Schema
const librosSchema = new Schema({
    isbn:Number,
    titulo:String,
    autor:String,
    genero:String,
    editorial:String,
    numPag:Number,
    anioEdic:Date,
    precio:Number,
    uniVendi:Number
})

const autoresSchema = new Schema({
	nombre:String,
    fNacimiento:Date,
    pais:String

})

export const Libros = model('libros', librosSchema)
export const Autores = model('autores', autoresSchema)
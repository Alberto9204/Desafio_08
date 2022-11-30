import express from 'express'
const app = express()

import { createServer } from "http";
import { Server } from "socket.io";

import { config } from './config/mariaDB.js'
import { options } from './config/sqlite3.js'
import Contenedor from './controllers/Contenedor.js'

const ProductoController = new Contenedor(config)

import Chats from './controllers/Chats.js'
const historial = new Chats(options)

const httpServer = new createServer(app)
const io = new Server(httpServer)

app.set('view engine', 'ejs')
app.set('views', './public/views');

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}));



ProductoController.createTable()
    .then(()=>{
        console.log('tabla Articulos creada');

        const articulos = [
            {
                "title": "Escuadra",
                "price": 123.45,
                "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
                "id_articulo": 1
            },
            {
                "title": "Calculadora",
                "price": 234.56,
                "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
                "id_articulo": 2
            },
            {
                "title": "Globo Terráqueo",
                "price": 345.67,
                "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
                "id_articulo": 3
            },
        ]
        return ProductoController.save(articulos)
    })
    .then(()=>{
        console.log('articulos insertados');
    })
    .catch((error)=> {
        console.log(error);
        throw error ;
    })
  

historial.createTable()
    .then(()=>{
        console.log('tabla chats creada');

        const chats = [
         
        ]
        return historial.save(chats)
    })
    .then(()=>{
        console.log('Chats insertados');
    })
    .catch((error)=> {
        console.log(error);
        throw error ;
    })

io.on('connection', async (socket) => {
    console.log('Un cliente se ha conectado');


    socket.emit("productos", await ProductoController.getAll())
    socket.on("guardarNuevoProducto", (nuevoProducto) => {

        ProductoController.save(nuevoProducto)
        io.sockets.emit("productos", ProductoController.getAll)
    })



    const messages = await historial.getAllChats()
    socket.emit('messages', messages);

    socket.on('messegesNew', async (data) => {
        const newMessage = {
            email: data.email,
            textoMensaje: data.textoMensaje,
            date: new Date
        }
        const historialSave = await historial.save(newMessage)
        io.sockets.emit('messages', historialSave);
    });
});


app.get('/', async (req, res, next) =>{
    const productos = await ProductoController.getAll()
    res.render('pages/index',{productos})
})

app.get('/:id', async (req,res,next) => {
    const { id } = req.params
    const productos = await ProductoController.getById(id)
    res.render('pages/index',{productos})
})

app.post('/', async (req, res, next) => {
    const { title, price, thumbnail } = req.body
    const newArticulo = {
        title: title,
        price: price,
        thumbnail: thumbnail
    }
    const newProducto = await ProductoController.save(newArticulo)
    const productos = await ProductoController.getAll()
    res.render('pages/index', {productos})
})

app.put('/:id',async (req, res, next) => {
    const { title, price, thumbnail } = req.body
    const { id } = req.params;
    const upDateProducto = await ProductoController.update(title, price, thumbnail,id)
    const productos = await ProductoController.getAll()
    res.render('pages/index', {productos})
})

app.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    const deleteProducto = await ProductoController.deleteById(id)
    console.log(deleteProducto)
    const productos = await ProductoController.getAll()
    res.render('pages/index', {productos})
})

//Server
const PORT = 8080
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))
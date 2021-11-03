import express from 'express'
import http from 'http'
const app = express()
const server = http.Server(app)
import { Server } from 'socket.io'
const PORT = 11000
const io = new Server()
io.attach(server)


// configurar el motor de vistas
app.set('view engine', 'pug')
app.use(express.static('public'))

// ruta index
app.get('', (req, res) => {
    res.render('index')
})

// 
io.on('connection', socket => {
    // socket: es el cliente que se conecta al servidor
    console.log(`Socket conectado: ${socket.id}`)

    // en este bloque de codigo nos comunicamos con los sockets
    // socket (.emit(), .broadcast.emit(), .broadcast.to().emit())
    // io = para enviar mensajes a todos

    // comunicar a todos los socket conectados que un nuevo socket se ha unido
    socket.broadcast.emit('nuevo-usuario', 'Se ha conectado un nuevo usuario')
})

server.listen(PORT, () => {
    console.log('Server listening...')
})




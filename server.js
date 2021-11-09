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

var users = []

// 
io.on('connection', socket => {
    // socket: es el cliente que se conecta al servidor
    // console.log(`Socket conectado: ${socket.id}`)

    // en este bloque de codigo nos comunicamos con los sockets
    // socket (.emit(), .broadcast.emit(), .broadcast.to().emit())
    // io = para enviar mensajes a todos

    // comunicar a todos los socket conectados que un nuevo socket se ha unido
    // socket.broadcast.emit('nuevo-usuario', 'Se ha conectado un nuevo usuario')

    socket.on('nuevo-usuario', nickname => {
        // validar que no se agreguen nicknames iguales
        console.log(`Usuario conectado: ${nickname}`)
        users.push({id: socket.id, nickname: nickname})
        socket.nickname = nickname
        io.emit('usuario-io', 1, nickname, users)
    })

    socket.on('usuario-reconectado', nickname => {
        // validar que no se agreguen nicknames iguales
        console.log(`Usuario reconectado: ${nickname}`)
        users.push({id: socket.id, nickname: nickname})
        socket.nickname = nickname
        // io.emit('usuario-io', 1, nickname, users)
    })

    socket.on('nuevo-mensaje', msj => {
        let msjDestino = `<strong>${socket.nickname}</strong> dice: ${msj}`
        socket.broadcast.emit('nuevo-mensaje', msjDestino)
    })

    socket.on('mensaje-privado', (msj, id) => {
        let msjDestino = `<strong class="responder-privado" data-socket-id="${socket.id}">${socket.nickname}</strong> dice: ${msj}`
        socket.broadcast.to(id).emit('mensaje-privado', msjDestino)
    })

    socket.on('disconnect', () => {
        users = users.filter(x => x.nickname !== socket.nickname)
        console.log(`Usuario desconectado: ${socket.nickname}`)
        io.emit('usuario-io', 0, socket.nickname, users)
    })
})

server.listen(PORT, () => {
    console.log('Server listening...')
})




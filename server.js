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

server.listen(PORT, () => {
    console.log('Server listening...')
})




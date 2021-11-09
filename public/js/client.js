var nickname = null;

function mostrarUsuarios (usuarios) {
    var items = ''
    for (let usuario of usuarios) {
        items += (usuario.nickname == nickname) ? `<li style="color: green">${usuario.nickname}</li>`: `<li class="mensaje-privado" data-socket-id="${usuario.id}">${usuario.nickname}</li>`
    }
    $('.usuarios-conectados').html(`<ul>${items}</ul>`)
}

$(function () {
    // ****** EVENTOS DE SOCKET.IO ****** //

    // nos conectamos al servidor usando socket.io
    const socket = io().connect('http://localhost')

    // socket.emit = enviamos mensajes al servidor
    // socket.on = recibimos mensajes del servidor

    socket.on('usuario-io', (inout, nickname, users) => {
        let x = (inout === 1) ? 'conectó': 'desconectó';
        let p = $('<p />', {'class': 'info'}).text(`Se ${x} ${nickname}`)
        $('.mensajes-publicos').append(p)
        mostrarUsuarios(users)
    })

    socket.on('nuevo-mensaje', msj => {
        let p = $('<p />', {class: 'msj'}).html(msj)
        $('.mensajes-publicos').append(p)
        $('.mensajes-publicos').scrollTop($('.mensajes-publicos')[0].scrollHeight)
    })

    socket.on('mensaje-privado', msj => {
        $('.mensajes-privados').append(msj)
        $('.mensajes-privados').scrollTop($('.mensajes-privados')[0].scrollHeight)
    })

    // eventos de socket.io predefinidos
    socket.on('disconnect', () => {
        let p = $('<p />', {class: 'info'}).html('Desconectado del servidor')
        $('.mensajes-publicos').append(p)
        $('.mensajes-publicos').scrollTop($('.mensajes-publicos')[0].scrollHeight)
    })

    socket.io.on('reconnect', () => {
        // Utilizar el mismo usuario almacenado en la variable nickname para enviarselo de nuevo al servidor
        if (nickname) {
            socket.emit('usuario-reconectado', nickname)
            let p = $('<p />', {class: 'info'}).html('Reconectado al servidor')
            $('.mensajes-publicos').append(p)
            $('.mensajes-publicos').scrollTop($('.mensajes-publicos')[0].scrollHeight)
        }
    })

    socket.io.on('reconnect_error', () => {
        console.log('Ha ocurrido un error al intentar establecer conexion con el servidor')
    })


    // ****** EVENTOS DE JQUERY ****** //

    // esto es debido a que los usuario se van agregando a la estructura de forma dinamica
    $(document).on('dblclick', '.mensaje-privado', function () {
        let id = $(this).data('socket-id')
        let msj = prompt('Escribe tu mensaje:')
        let p

        if (msj && msj.trim() === '') {
            return;
        }

        // limpiando los espacios de la cadena
        msj = msj.trim()

        // enviar el mensaje al servidor
        socket.emit('mensaje-privado', msj, id)
        p = $('<p />', {class: 'msj-privado'}).html(`<strong>Yo: </strong>${msj}`)
        $('.mensajes-privados').append(p)
        $('.mensajes-privados').scrollTop($('.mensajes-privados')[0].scrollHeight)
        alert('Mensaje enviado')
    })

    $(document).on('dblclick', '.responder-privado', function () {
        let id = $(this).data('socket-id')

        let msj = prompt('Escribe tu mensaje:')
        let p

        if (msj && msj.trim() === '') {
            return;
        }

        // limpiando los espacios de la cadena
        msj = msj.trim()

        socket.emit('mensaje-privado', msj, id)
        p = $('<p />', {class: 'msj-privado'}).html(`<strong>Yo: </strong>${msj}`)
        $('.mensajes-privados').append(p)
        $('.mensajes-privados').scrollTop($('.mensajes-privados')[0].scrollHeight)
        alert('Mensaje enviado!')


    })

    // es debido a que la cajita de texto ya existe al cargar la pagina
    $('#txt-nickname').on('keyup', function (e) {
        let tecla = e.keyCode || e.which;

        if (tecla === 13) {
            // asignar el nickname ingresado en la variable global
            nickname = $(this).val().trim();

            if (!nickname) {
                alert('Debes ingresar un nickname');
                return;
            }

            $('#area-nickname').fadeOut();
            $('#area-mensajes').show();
            $('#bienvenida').html(`Bienvenido <strong>${nickname}</strong>`);
            // notificarle al servidor que nos conectamos para que el servidor lo notifique a los demas sockets
            socket.emit('nuevo-usuario', nickname)
        }
    })

    // enviar un mensaje a todos
    $('#txt-mensaje').on('keyup', function (e) {
        let $me = $(this)
        let tecla = e.keyCode || e.which;
        let msj, p

        if (tecla === 13) {
            msj = $me.val().trim()

            if (!msj) {
                $me.val('')
                return;
            }

            socket.emit('nuevo-mensaje', msj)
            p = $('<p />', {class: 'msj'}).html(`<strong>Yo: </strong>${msj}`)
            $('.mensajes-publicos').append(p)
            $('.mensajes-publicos').scrollTop($('.mensajes-publicos')[0].scrollHeight)
            $me.val('').focus()
        }
    })
})
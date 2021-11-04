var nickname = null;

function mostrarUsuarios (usuarios) {
    var items = ''
    for (let usuario of usuarios) {
        items += (usuario.nickname == nickname) ? `<li style="color: green">${usuario.nickname}</li>`: `<li class="mensaje-privado" data-socket-id="${usuario.id}">${usuario.nickname}</li>`
    }
    $('.usuarios-conectados').html(`<ul>${items}</ul>`)
}

$(function () {

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

    // esto es debido a que los usuario se van agregando a la estructura de forma dinamica
    $(document).on('dblclick', '.mensaje-privado', function () {
        let id = $(this).data('socket-id')
        alert(id)
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
})
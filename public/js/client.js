var nickname = null;

$(function () {

    // nos conectamos al servidor usando socket.io
    const socket = io().connect('http://localhost')

    // socket.emit = enviamos mensajes al servidor
    // socket.on = recibimos mensajes del servidor

    socket.on('nuevo-usuario', msj => {
        $('.mensajes-publicos').text(msj)
    })


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
        }
    })
})
Framework7.use(user);
Framework7.use(cells);
Framework7.use(items);
Framework7.use(documents);

$ = Dom7;

app = new Framework7({
    el: '#app',
    name: 'Киргу ТСД',
    theme: 'md',
    version: 1.0,
    init: false,
    routes: routes,
    backend:'http://192.168.200.110/proxy.php?url=http://192.168.215.9/sad/hs/tsd',
    //backend:'http://176.120.211.250/proxy.php?url=http://192.168.215.10/murad/hs/tsd',
    //backend:'http://192.168.215.10/murad/hs/tsd',
    view: {
        animate: false,
        iosDynamicNavbar: false
    },
    dialog: {
        buttonOk: 'Ок',
        buttonCancel: 'Отмена'
    },
    touch: {
        mdTouchRipple: false,
        tapHold: false
    },
    toast: {
        closeTimeout: 2000
    },
    on: {
        init: function () {

        }
    }
});

try {

    Keyboard.shrinkView(true);
    Keyboard.disableScrollingInShrinkView(true);

} catch (error) {

    console.log(error);

}

$(document).on('deviceready', function () {

    app.init();

    app.request.setup({
        //crossDomain: true,
        beforeSend: function (xhr) {

            if (app.params.backend === 'http://192.168.215.10/murad/hs/tsd') {

                xhr.setRequestHeader('Authorization', 'Basic ' + btoa('obmen_tsd:12345') );

            }

        },
        complete: function (xhr) {

            console.log(xhr);

        },
        error: function (xhr, status, message) {


        }
    });

    if ( app.user.isLogged() ) {

        app.on('items:ready', function () {

            if (app.cells.ready && app.items.ready && app.documents.ready) {

                app.emit('plugins:ready');

            }

        });

        app.on('documents:ready', function () {

            if (app.cells.ready && app.items.ready && app.documents.ready) {

                app.emit('plugins:ready');

            }

        });

        app.on('cells:ready', function () {

            if (app.cells.ready && app.items.ready && app.documents.ready) {

                app.emit('plugins:ready');

            }

        });

        app.on('plugins:ready', function () {

            app.views.create('.view-main', {
                url: '/main',
                main: true
            });

            $('.view-main').removeClass('display-none');

            setTimeout(function () {

                navigator.splashscreen.hide();

            }, 1000);

        });

    } else {

        app.views.create('.view-auth', {
            url: '/auth',
            main: true
        });

        $('.view-auth').removeClass('display-none');

        setTimeout(function () {

            navigator.splashscreen.hide();

        }, 1000);

    }

    if (app.device.android) {

        var attachFastClick = Origami.fastclick;

        attachFastClick(document.body);

    }

    $(document).keydown(function(event) {

        if ($('.dialog.modal-in').length > 0) {

            if (event.key == 'Enter') {

                $('.dialog.modal-in').find('.dialog-buttons').find('.dialog-button:last-child').click();

            }

            if (event.key === "Escape") {

                app.dialog.close();

            }

        }
    });

    $(window).on('click', '.input-clear-button', function() {

        $(this).prev().val('').focus();

    });

    $(window).on('keypress', 'input', function (e) {

        if (e.which == 13) {

            document.activeElement.blur();

            $(this).blur();

            Keyboard.hide();

        }

    });

    $(window).on('touchmove', function (e) {

        let activeElement = $(document.activeElement)[0];

        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {

            document.activeElement.blur();

            $('input').blur();

            Keyboard.hide();

        }

    });

    $(document).on('backbutton', function (event) {

        if ($('.popover.modal-in').length > 0) {

            var popover;

            if ($('.popover.modal-in').length > 1) {

                popover = app.popover.get($('.popover.modal-in:last-child'));

            } else {

                popover = app.popover.get($('.popover.modal-in'));

            }

            popover.close();

            return false;

        }

        if ($('.dialog.modal-in').length > 0) {

            var dialog;

            if ($('.dialog.modal-in').length > 1) {

                dialog = app.dialog.get($('.dialog.modal-in:last-child'));

            } else {

                dialog = app.dialog.get($('.dialog.modal-in'));

            }

            dialog.close();

            return false;

        }

        if ($('.popup.modal-in').length > 0) {

            var popup;

            if ($('.popup.modal-in').length > 1) {

                popup = app.popup.get($('.popup.modal-in:last-child'));

            } else {

                popup = app.popup.get($('.popup.modal-in'));

            }

            popup.close();

            return false;

        }

        if ($('.sheet-modal.modal-in').length > 0) {

            var popup;

            if ($('.sheet-modal.modal-in').length > 1) {

                sheet = app.sheet.get($('.sheet-modal.modal-in:last-child'));

            } else {

                sheet = app.sheet.get($('.sheet-modal.modal-in'));

            }

            sheet.close();

            return false;

        }

        app.views.current.router.back();

    });

});

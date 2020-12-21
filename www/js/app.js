var $$ = Dom7;

var app = new Framework7({
    root: '#app',
    name: 'Киргу ТСД',
    theme: 'ios',
    version: 1.0,
    routes: routes,
    init: false,
    user: localStorage.user ? localStorage.user : false,
    dialog: {
        buttonOk: 'Ок',
        buttonCancel: 'Отмена'
    },
    touch: {
        mdTouchRipple: false,
        tapHold: false,
        disableContextMenu: true,
        activeState: true,
        fastClicks: true
    },
    toast: {
        closeTimeout: 4000
    },
    smartSelect: {
        pageBackLinkText: 'Назад',
        popupCloseLinkText: 'Готово',
        sheetCloseLinkText: 'Выбрать'
    },
    picker: {
        toolbarCloseText: 'Выбрать'
    },
    view: {
        animate: false,
        iosDynamicNavbar: false,
        stackPages: true,
        keepalive: true,
        preloadPreviousPage: true,
        removeElements: false,
        iosSwipeBack: true,
        mdSwipeBack: true,
        iosSwipeBackAnimateShadow: false,
        iosSwipeBackAnimateOpacity: false,
        mdSwipeBackAnimateShadow: false,
        mdSwipeBackAnimateOpacity: false
    },
    photoBrowser: {
        backLinkText: 'Закрыть',
        navbarOfText: 'из',
        popupCloseLinkText: 'Закрыть',
        swiper: {
            lazy: {
                enabled: false
            }
        }
    },
    lazy: {
        placeholder: 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
        threshold: 1000,
        sequential: false
    },
    statusbar: {
        enabled: false,
        iosOverlaysWebView: false,
        androidOverlaysWebView: false
    },
    sheetModal: {
        closeByOutsideClick: true,
        swipeToClose: true,
        sheetCloseLinkText: 'Выбрать',
        backdrop: true
    },
    navbar: {
        collapseLargeTitleOnScroll: true,
        snapPageScrollToLargeTitle: false,
        snapPageScrollToTransparentNavbar: false
    },
    methods: {
        backButton: function (closeApp = true) {

            if (closeApp) {

                if (app.views.current.router.url === '/main' || app.views.current.router.url === '/cart' || app.views.current.router.url === '/favorites' || app.views.current.router.url === '/profile') {

                    app.dialog.confirm('Вы уверены что хотите закрыть приложение?', function () {

                        navigator.app.exitApp();

                    });

                    return false;

                } else if (app.views.current.router.url === '/catalog/categories') {

                    $$('.views').find('.tab-active').find('.page-current').find('.navbar').find('.left').find('a').click();

                    return false;

                } else if (app.views.current.router.url === '/profile/chat') {

                    $$('.views').find('.tab-active').find('.page-current').find('.navbar').find('.left').find('a').click();

                    return false;

                }

            }

            if ($$('.popover.modal-in').length > 0) {

                var popover;

                if ($$('.popover.modal-in').length > 1) {

                    popover = app.popover.get($$('.popover.modal-in:last-child'));

                } else {

                    popover = app.popover.get($$('.popover.modal-in'));

                }

                popover.close();

                return false;

            }

            if ($$('.dialog.modal-in').length > 0) {

                var dialog;

                if ($$('.dialog.modal-in').length > 1) {

                    dialog = app.dialog.get($$('.dialog.modal-in:last-child'));

                } else {

                    dialog = app.dialog.get($$('.dialog.modal-in'));

                }

                dialog.close();

                return false;

            }

            if ($$('.popup.modal-in').length > 0) {

                var popup;

                if ($$('.popup.modal-in').length > 1) {

                    popup = app.popup.get($$('.popup.modal-in:last-child'));

                } else {

                    popup = app.popup.get($$('.popup.modal-in'));

                }

                popup.close();

                return false;

            }

            if ($$('.sheet-modal.modal-in').length > 0) {

                var popup;

                if ($$('.sheet-modal.modal-in').length > 1) {

                    sheet = app.sheet.get($$('.sheet-modal.modal-in:last-child'));

                } else {

                    sheet = app.sheet.get($$('.sheet-modal.modal-in'));

                }

                sheet.close();

                return false;

            }


            $$('.custom-back').click();

            app.views.current.router.back();

        }
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

app.init();

app.request.setup({
    beforeSend: function(xhr) {

    },
    complete: function(xhr) {

        console.log(xhr);

    },
    error: function () {

    }
});

app.views.create('.view-main', {
    url: '/main',
    main: true
});

if (app.device.android) {

    var attachFastClick = Origami.fastclick;

    attachFastClick(document.body);

}

$$(window).on('click', '.input-clear-button', function() {

    $$(this).prev().val('').focus();

});

$$(window).on('keypress', 'input', function (e) {

    if (e.which == 13) {

        document.activeElement.blur();

        $$(this).blur();

        Keyboard.hide();

    }

});

$$(window).on('touchmove', function (e) {

    let activeElement = $$(document.activeElement)[0];

    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {

        document.activeElement.blur();

        $$('input').blur();

        Keyboard.hide();

    }

});

$$(window).on('keyboardWillShow', function (e) {

    $$('.toolbar-menu').css('visibility', 'hidden');

});

$$(window).on('keyboardWillHide', function () {

    $$('.toolbar-menu').css('visibility', 'visible');

});

$$(document).on('tab:show', function () {

    var first = true;

    $$(document).off('click', '.toolbar-menu .tab-link-active').on('click', '.toolbar-menu .tab-link-active', function (event) {

        if (!first) {

            var viewId = $$(this).attr('href');
            var view = app.views.get(viewId);
            var viewUrl = view.params.url;

            if (viewId !== '#view-profile') {

                view.router.back(viewUrl, {
                    force: true
                });

            }

            app.methods.backButton(false);

        }

        first = false;

    });

});

$$(document).trigger('tab:show');

$$(document).on('backbutton', function (event) {

    app.methods.backButton();

});

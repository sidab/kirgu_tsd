user = {
    name: 'User',
    install() {

        const Class = this;

    },
    create(instance) {

        const app = this;

        const $ = app.$;

        app.user = {
            isLogged: function () {

                if (localStorage.getItem('user')) {

                    return true;

                } else {

                    return false;

                }

            },
            auth: function (login, password) {

                let url = app.params.backend + '/auth/' + login + '/' + password;

                app.request({
                    url: encodeURI(url),
                    dataType: 'json',
                    timeout: 5000,
                    beforeSend: function () {

                        app.preloader.show();

                    },
                    success: function(response) {

                        let status = response[0].СтатусАвторизации;

                        if (status == 'Успешно') {

                            localStorage.setItem('user', JSON.stringify(response[0]) );

                            location.reload();

                        } else {

                            app.preloader.hide();

                            app.toast.create({
                                text: status,
                                position: 'top',
                                cssClass: 'bg-color-red'
                            }).open();

                        }

                    },
                    error: function() {

                        app.preloader.hide();

                        app.toast.create({
                            text: 'Нет соединение с базой!',
                            position: 'top',
                            cssClass: 'bg-color-red'
                        }).open();

                    },
                    complete: function () {

                    }
                });

            },
            logout: function () {

                localforage.clear().then(function () {

                    localStorage.clear();

                    location.reload();

                });

            },
            data: app.data(),
        }

    },
    params: {

    },
    instance: {
        data: function () {

            let userData = localStorage.getItem('user');

            userData = JSON.parse(userData);

            return userData;

        }
    },
    on: {

        init: function () {

            let app = this;

        },

    }
};
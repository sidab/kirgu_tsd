items = {
    name: 'Items',
    install() {

        const Class = this;

    },
    create(instance) {

        const app = this;

        const $ = app.$;

        app.items = {
            ready: false,
            data: [],
            keys: [],
            chooseBase: function () {

                app.dialog.create({
                    title: 'Загрузка базы',
                    buttons: [
                        {
                            text: 'Остатки отдела',
                            cssClass: 'text-color-red',
                            onClick: function () {

                                app.items.type = 'Остатки отдела';

                                app.items.load();

                            }
                        },
                        {
                            text: 'Полная база',
                            cssClass: 'text-color-red',
                            onClick: function () {

                                app.items.type = 'Полная база';

                                app.items.load();

                            }
                        },
                        {
                            text: 'Отмена',
                            cssClass: 'text-align-center',
                            bold: true,
                            onClick: function () {


                            }
                        }
                    ],
                    verticalButtons: true,
                }).open();

            },
            delete: function (i) {

                if (i >= app.items.keys.length) {

                    app.items.data = false;

                    app.items.load(app.items.type);

                    return false;

                }

                localforage.removeItem('items-' + i).then(function () {

                    app.items.delete(i + 1);

                });

            },
            load: function () {

                if (app.items.data) {

                    app.items.delete(0);

                    return false;

                }

                let url;

                if (app.items.type == 'Остатки отдела') {

                    url = 'http://192.168.200.110/tsd/items.php?login=' + app.user.data.code + '&type=otdel';

                    //url = app.params.backend + '/all_goods/' + app.user.data.code;

                } else if (app.items.type == 'Полная база') {

                    url = 'http://192.168.200.110/tsd/items.php?login=' + app.user.data.code + '&type=full';

                    //url = app.params.backend + '/all_goods_kirgu/' + app.user.data.code;

                }

                app.request({
                    url: encodeURI(url),
                    dataType: 'json',
                    beforeSend: function (xhr) {

                        app.items.dialogProgress = app.dialog.progress('Загрузка базы...');

                        xhr.addEventListener('progress', function (progressInfo) {

                            app.toast.create({
                                text: xhr.getResponseHeader('size'),
                                position: 'top',
                                closeTimeout: 2000
                            }).open();

                            let total = Number(xhr.getResponseHeader('size'));

                            let progress = (progressInfo.loaded / total) * 100;

                            if (progress > 0) {

                                app.items.dialogProgress.setProgress(progress);

                                app.items.dialogProgress.setText(progress.toFixed(0) + '% из 100%');

                            }

                        }, false);

                    },
                    success: function (response) {

                        let items = response[0];

                        app.items.data = items;

                        app.items.dialogProgress.setTitle('Сохранение данных...');

                        app.items.save(0);

                    },
                    error: function () {

                        app.items.dialogProgress.close();

                        app.dialog.alert('При загрузке возникла ошибка.', 'Ошибка!');

                    }
                });

            },
            save: function (i) {

                let items = app.items.data;

                let itemsCount = items.length;

                let parts = itemsCount / app.params.itemsInPart - 1;

                let saveKey = 'items-' + i;

                let saveItems = items.slice(i * app.params.itemsInPart, i * app.params.itemsInPart + app.params.itemsInPart);

                localforage.setItem(saveKey, saveItems).then(function (value) {

                    if (i < parts) {

                        app.items.save(i + 1);

                    } else {

                        app.items.dialogProgress.close();

                        app.dialog.alert('Вы успешно загрузили базу!');

                    }

                });

            },
            get: function (i) {

                if (i >= app.items.keys.length) {

                    if (app.items.dialogProgress) {

                        app.items.dialogProgress.close();

                    }

                    app.items.ready = true;

                    app.emit('items:ready');

                    return false;

                }

                let key = app.items.keys[i];

                localforage.getItem(key).then(function (value) {

                    app.items.data = app.items.data.concat(value);

                    app.items.get(i + 1);

                });

            }
        }

    },
    params: {
        itemsInPart: 10000
    },
    instance: {

    },
    on: {

        init: function () {

            let app = this;

            //app.items.dialogProgress = app.dialog.preloader('Инициализация базы...');

            localforage.keys().then(function(keys) {

                app.items.keys = keys.filter(function(key){

                    return key.indexOf('items') !== -1;

                });

                app.items.get(0);

            });

        },

    }
};
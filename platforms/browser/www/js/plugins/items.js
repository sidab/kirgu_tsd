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

                                app.items.load(1);

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

                    app.items.load(1);

                    return false;

                }

                localforage.removeItem('items-' + i).then(function () {

                    app.items.delete(i + 1);

                });

            },
            load: function (pageNum) {

                if (pageNum < 2 && app.items.data.length > 0) {

                    app.items.delete(0);

                    return false;

                }

                let url;

                if (app.items.type == 'Остатки отдела') {

                    url = app.params.backend + '/all_goods/' + app.user.data.code;

                    //url = app.params.backend + '/all_goods/' + app.user.data.code;

                } else if (app.items.type == 'Полная база') {

                    url = app.params.backend + '/all_goods_kirgu/' + app.user.data.code + '/' + pageNum;

                    //url = app.params.backend + '/all_goods_kirgu/' + app.user.data.code;

                }

                app.request({
                    url: encodeURI(url),
                    dataType: 'json',
                    beforeSend: function (xhr) {

                        if (pageNum < 2) {

                            app.items.dialogProgress = app.dialog.progress('Загрузка базы...');

                        }

                    },
                    success: function (response, status, xhr) {

                        if (pageNum < 2) {

                            let itemsCount = Number(xhr.getResponseHeader('Content-Type'));

                            app.items.onePartSize = encodeURI( JSON.stringify(response) ).split(/%..|./).length - 1;

                            app.items.totalSize = (app.items.onePartSize / 20000) * itemsCount;

                        }

                        let total = app.items.totalSize;

                        let loaded = app.items.onePartSize * pageNum;

                        let progress = (loaded / total) * 100;

                        if (progress > 0) {

                            app.items.dialogProgress.setText(progress.toFixed(0) + '% из 100%');

                        }

                        if (app.items.data.length > 0) {

                            app.items.data = app.items.data.concat(response);

                        } else {

                            app.items.data = response;

                        }

                        if (response.length >= 20000) {

                            app.items.load(pageNum + 1);

                        } else {

                            app.items.dialogProgress.setTitle('Сохранение данных...');

                            app.items.dialogProgress.setText('0% из 100%');

                            app.items.save(0);

                        }

                    },
                    error: function () {

                        if (pageNum> 1) {

                            app.items.dialogProgress.setTitle('Сохранение данных...');

                            app.items.dialogProgress.setText('0% из 100%');

                            app.items.save(0);

                        } else {

                            app.items.dialogProgress.close();

                            app.dialog.alert('При загрузке возникла ошибка.', 'Ошибка!');

                        }

                    }
                });

            },
            save: function (i) {

                let parts = (app.items.data.length / app.params.itemsInPart) - 1;

                let saveKey = 'items-' + i;

                let saveItems = app.items.data.slice(i * app.params.itemsInPart, i * app.params.itemsInPart + app.params.itemsInPart);

                localforage.setItem(saveKey, saveItems).then(function () {

                    delete saveItems;

                    let progress = ( (i / parts) * 100) - 1;

                    if (progress > 0) {

                        app.items.dialogProgress.setText(progress.toFixed(0) + '% из 100%');

                    }

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
        itemsInPart: 20000
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
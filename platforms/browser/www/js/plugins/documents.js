documents = {
    name: 'Documents',
    install() {

        const Class = this;

    },
    create(instance) {

        const app = this;

        const $ = app.$;

        app.documents = {
            ready: false,
            data: [],
            find: function (doc_type, doc_num, callback) {

                let method;

                if (doc_type == 'peremeshenie') {

                    method = 'moving_goods';

                } else if (doc_type == 'prikhodniy_order') {

                    method = 'prihodny_order';

                } else if (doc_type == 'raskhodniy_order') {

                    method = 'raskhodny_order';

                } else if (doc_type == 'postuplenie_ot_postavshika') {

                    method = 'postupleniye_ot_postavshika';

                } else if (doc_type == 'razmeshenie_po_yacheykam') {

                    method = 'placement_in_cells';

                } else if (doc_type == 'otbor_po_yacheykam') {

                    method = 'selection_cell';

                }

                let url = app.params.backend + '/' + method + '/' + app.user.data.code + '/' + doc_num + '/';

                app.request({
                    url: encodeURI(url),
                    dataType: 'json',
                    beforeSend: function () {

                        app.preloader.show();

                    },
                    success: function (response) {

                        let document = response[0];

                        console.log(document);

                        if (document.Статус == 'Успешно') {

                            document.doc_type = doc_type;

                            app.documents.data.push(document);

                            app.documents.save(function () {

                                if (callback) {

                                    callback();

                                }

                            });

                        } else {

                            app.toast.create({
                                text: document.ОписаниеОшибки,
                                position: 'top',
                                cssClass: 'bg-color-red',
                                closeTimeout: 5000
                            }).open();

                        }

                    },
                    error: function () {

                        app.dialog.alert('Ошибка подключения!', 'Ошибка');

                    },
                    complete: function () {

                        app.preloader.hide();

                    }
                });

            },
            remove: function (doc_num, callback) {

                app.documents.data = app.documents.data.filter(function (document) {

                    return document.Номер !== doc_num;

                });

                app.documents.save(function () {

                    if (callback) {

                        callback();

                    }

                });

            },
            save: function (callback) {

                localforage.setItem('documents', app.documents.data).then(function () {

                    if (callback) {

                        callback();

                    }

                });

            }
        }

    },
    params: {

    },
    instance: {

    },
    on: {

        init: function () {

            let app = this;

            //app.documents.dialogProgress = app.dialog.preloader('Инициализация документов...');

            localforage.getItem('documents').then(function(value) {

                if (value !== undefined && value !== null) {

                    app.documents.data = value;

                }

                //app.documents.dialogProgress.close();

                app.documents.ready = true;

                app.emit('documents:ready');

            });

        },

    }
};
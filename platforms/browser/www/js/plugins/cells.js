cells = {
    name: 'Cells',
    install() {

        const Class = this;

    },
    create(instance) {

        const app = this;

        const $ = app.$;

        app.cells = {
            ready: false,
            data: [],
            save: function () {

                localforage.setItem('cells', app.cells.data).then(function () {

                    app.cells.dialogProgress.close();

                    app.dialog.alert('Вы успешно загрузили ячейки!');

                });

            },
            load: function () {

                let url = app.params.backend + '/warehouse_cells/' + app.user.data.code;

                app.request({
                    url: encodeURI(url),
                    dataType: 'json',
                    beforeCreate: function () {

                        app.cells.dialogProgress = app.dialog.progress('Загрузка ячеек...');

                    },
                    success: function (response) {

                        let cells = response[0].filter(function (cell) {

                            return cell.Штрихкод.length > 0;

                        });

                        app.cells.data = cells;

                        app.cells.save();

                    },
                    error: function () {

                        app.cells.dialogProgress.close();

                        app.dialog.alert('При загрузке возникла ошибка.', 'Ошибка!');

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

            //app.cells.dialogProgress = app.dialog.preloader('Инициализация ячеек...');

            localforage.getItem('cells').then(function(value) {

                if (value !== undefined && value !== null) {

                    app.cells.data = value;

                }

                //app.cells.dialogProgress.close();

                app.cells.ready = true;

                app.emit('cells:ready');

            });

        },

    }
};
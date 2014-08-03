/**
 * Created by netBeans.
 * Name: likeGoogleImages
 * User: Abaddon
 * Date: 26.04.14
 * Time: 01:22
 * Description: Resizing and output images like Google Images
 */
(function (w, d, an) {
    "use strict";
    var likegoogle = an.module("likegoogle", [])
        .directive("ngLikeGoogle", ["$likeGoogle", "$timeout", "$q", function ($likeGoogle, $timeout, $q) {
            return {
                scope: {
                    model: "=?",
                    methods: "=?"
                },
                controller: function ($scope, $element) {
                    var Good = function () {
                        an.extend(this, {
                            items: [],
                            scope: $scope,
                            config: null
                        });

                        this.run = function () {
                            var rows = this.buildRows();//Получаем картинки разбитые на строки
                            this.makeNicely(rows);
                        };
                    };
                    Good.prototype = {
                        getRowWidth: function (collection, item) {
                            var config = this.config;
                            var width = 0, ln = collection.length;
                            if (ln) {
                                width = (ln - 1) * config.margin; //Общая длина отступов
                                while (ln--) {
                                    var loc = collection[ln];
                                    width += loc.width;
                                }
                            }
                            if (item) {
                                width += item.width;
                            }
                            return width;
                        },
                        extendModel: function () {//Расширение исходной модели, данными и ф-ями директивы
                            var ln = this.items.length;
                            if (this.config.nomodel) {
                                $scope.model = this.items;
                            } else {
                                while (ln--) {
                                    var loc = this.items[ln];
                                    if (loc.source[0].naturalWidth) {
                                        an.extend($scope.model[ln], this.items[ln]);
                                    } else {
                                        this.clearBad(ln);
                                    }
                                }
                            }
                        },
                        clearBad: function (ln) {
                            $scope.model.splice(ln, 1);
                            this.items.splice(ln, 1);
                        },
                        buildRows: function () {//распределение картинок по строкам
                            var rows = [], row = { items: [], width: 0 }, rowWidth = 0, config = this.config;
                            an.forEach($scope.model, function (item) {
                                item.parent.style.cssText += $likeGoogle.getEffect('start');
                                item.compress_ratio = config.eligibleHeight / item.oricHeight;
                                item.width = item.oricWidth * item.compress_ratio;
                                item.height = item.oricHeight * item.compress_ratio;
                                rowWidth = this.getRowWidth(row.items, item);
                                if (rowWidth > config.blockWidth) {
                                    row.width = rowWidth - item.width;
                                    rows.push(row);
                                    row = {
                                        items: [],
                                        width: 0
                                    };
                                }
                                row.items.push(item);
                            }.bind(this));
                            row.width = rowWidth;
                            rows.push(row);
                            row.last = true;
                            return rows;
                        },
                        createView: function (row, marginWidth) {//подстройка картинок под размер блока
                            var config = this.config;
                            row.width = 0;
                            an.forEach(row.items, function (item, k) {
                                var source = item.source[0];
                                if (row.compress_ratio) {
                                    item.width = Math.round(item.width * row.compress_ratio);
                                    item.height = Math.round(item.height * row.compress_ratio);
                                }
                                source.width = item.width;
                                source.height = item.height;
                                row.width += item.width;
                                if (k > 0) {
                                    item.parent.style.cssText += 'margin-bottom: ' + config.margin + 'px; margin-left: ' + config.margin + 'px; float: left;';
                                } else {
                                    item.parent.style.cssText += 'margin-bottom: ' + config.margin + 'px; margin-left: 0; float: left;';
                                }
                            });
                            row.width += marginWidth;
                        },
                        show: function (row) {//выводит сформированные изображения
                            var ln = row.items.length;
                            while (ln--) {
                                var item = row.items[ln];
                                item.parent.style.cssText += $likeGoogle.getEffect("end", "opacity");
                            }
                        },
                        correction: function (row) {
                            var stock = this.config.blockWidth - row.width;
                            if (stock > 0) {
                                var ln = row.items.length, step = Math.ceil(stock / ln), j = ln - 1;
                                for (var i = stock; i >= step; i = i - step) {
                                    var item = row.items[j];
                                    row.width += step;
                                    item.width += step;
                                    item['source'][0].width = row.items[j].width;
                                    j--;
                                }
                                stock = this.config.blockWidth - row.width;
                                row.items[0].width += stock;
                                row.items[0]['source'][0].width = row.items[0].width;
                            }
                        },
                        makeNicely: function (rows) {//Делает красиво
                            var config = this.config , cof
                            an.forEach(rows, function (row) {
                                var marginWidth = (row.items.length - 1) * config.margin;
                                if (!row.last) {
                                    row.compress_ratio = cof = (config.blockWidth - marginWidth) / row.width;
                                }
                                this.createView(row, marginWidth);
                                if (!row.last) {//Кориктеровка
                                    this.correction(row);
                                }
                                this.show(row);
                            }.bind(this));
                        }
                    };
                    this.good = new Good();
                },
                link: function (scope, elem, attr, controller) {
                    var settings = scope.$eval(attr.settings) || {};
                    var config = controller.good.config = an.extend({
                        blockWidth: elem[0].clientWidth,
                        eligibleHeight: 100,
                        margin: 5,
                        effect: 2,
                        nomodel: false
                    }, settings);
                    var rows = [];
                    scope.$on("start", function () {//старт перерисовки
                        controller.good.extendModel();
                        controller.good.run();
                    });
                    scope.$on("image:delete", function (event, image) {//удаление картинки
                        var model = scope.model, delIndex = model.indexOf(image);
                        if (delIndex !== -1 && !config.nomodel) {
                            var delElem = model[delIndex].parent;
                            delElem.style.cssText += $likeGoogle.getEffect('remove');
                            $timeout(function () {
                                model.splice(delIndex, 1);
                                controller.good.run();
                            }, 500);
                        }
                    });
                    scope.methods = {
                        add: function (newItem) {//Добавление элемента в набор
                            scope.model.push(newItem);
                        },
                        update: function () {
                            var ln = scope.model.length;
                            while (ln--) {
                                var loc = scope.model[ln];
                                loc.parent.style.cssText += '-webkit-transform: scale(0);';
                            }
                            $timeout(function () {
                                controller.good.run();
                            }, 500);
                        },
                        clear: function () {//Очистить массив найденных изображений
                            controller.good.items = [];
                        }
                    };
                }
            };
        } ])
        .directive('ngGoogleLast', [function () {
            return {
                controller: function ($scope, $element) {
                    if ($scope.$last) {
                        this.last = true;
                    }
                }
            };
        }])
        .directive("ngGoogleItem", ['$likeGoogle', '$interval', '$timeout', function ($likeGoogle, $interval, $timeout) {
            return {
                controller: function ($scope, $element) {
                    var that = this;
                    this.likeScope = null;
                    var Image = function (elem, attr) {
                        an.extend(this, {
                            source: elem,
                            attributes: attr,
                            parent: elem[0].parentNode
                        });
                        this.remove = function () {//Удаление картики из набора
                            that.likeScope.$emit("image:delete", this);
                        };
                        return this;
                    };
                    this.Image = Image;
                },
                require: ['^ngLikeGoogle', '^?ngGoogleLast', '^ngGoogleItem'],
                link: function (scope, elem, attr, controllers) {
                    var like = controllers[0].good, gLast = controllers[1] ? controllers[1].last : attr.ngGoogleItem, that = controllers[2],
                        item = new that.Image(elem, attr);
                    that.likeScope = like.scope;
                    like.items.push(item);
                    if (gLast) {
                        $likeGoogle.checkLoad(like.items, function (images) {
                            like.items = images;
                            like.scope.$emit("start");
                        });
                    }
                    item = null;
                }
            }
        }])
        .factory("$likeGoogle", ['$interval', function ($interval) {
            var load = function (images, callback) {//Отслеживаем когда изображения будут полностью загружены
                var ln = images.length, i = 0,
                    _load = function (i) {
                        if (i < ln) {
                            var img = images[i].source[0], watcher;
                            watcher = $interval(function () {
                                if (img.complete) {
                                    !images[i].oricWidth ? (images[i].defWidth = img.width) : 0;
                                    !images[i].oricHeight ? (images[i].defHeight = img.height) : 0;
                                    an.extend(images[i], {
                                        oricWidth: images[i].defWidth || img.width,
                                        oricHeight: images[i].defHeight || img.height
                                    });
                                    $interval.cancel(watcher);
                                    i++;
                                    _load(i);
                                }
                            }, 20);
                        } else {
                            callback(images);
                        }
                    };
                _load(i);
            };
            var random = function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            var getEffect = function (phase, time) {
                time = time || 1;
                var res = {},
                    _common = function (time) {
                        return "-webkit-transition-property: -webkit-transform, opacity;" +
                            "-webkit-transition-duration: 0.5s, " + time + "s;" +
                            "-webkit-transition-timing-function: easy;" +
                            "-moz-transition-property: -moz-transform, opacity;" +
                            "-moz-transition-duration: 0.5s, " + time + "s;" +
                            "-moz-transition-timing-function: easy;" +
                            "-o-transition-property: -o-transform, opacity;" +
                            "-o-transition-duration: 0.5s, " + time + "s;" +
                            "-o-transition-timing-function: easy;" +
                            "transition-property: transform, opacity;" +
                            "transition-duration: 0.5s, " + time + "s;" +
                            "transition-timing-function: easy;";
                    };
                res = {
                    startStyle: 'opacity: 0;',
                    endStyle: 'opacity: 1;' + _common(random(1, 5)),
                    removeStyle: '-webkit-transform: scale(0.1);'
                };
                switch (phase) {
                    case 'start':
                        return res.startStyle;
                        break;
                    case 'end':
                        return res.endStyle;
                        break;
                    case 'remove':
                        return res.removeStyle;
                        break;
                    default:
                        return res;
                }
            };
            return {
                getEffect: getEffect,
                checkLoad: load
            };
        } ]);
})(window, document, angular);
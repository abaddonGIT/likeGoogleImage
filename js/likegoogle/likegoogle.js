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
                    model: "=?"
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
                                        $scope.model.splice(ln, 1);
                                    }
                                }
                                //console.log($scope.model);
                            }
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
                    scope.$on("start", function () {
                        controller.good.extendModel();
                        controller.good.run();
                    });
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
        .directive("ngGoogleItem", ['$likeGoogle', '$interval', function ($likeGoogle, $interval) {
            return {
                controller: function ($scope, $element) {
                    this.load = function (images, callback) {//Отслеживаем когда изображения будут полностью загружены
                        var ln = images.length, i = 0,
                            _load = function (i) {
                                if (i < ln) {
                                    var img = images[i].source[0], watcher;
                                    watcher = $interval(function () {
                                        if (img.complete) {
                                            an.extend(images[i], {
                                                oricWidth: img.width,
                                                oricHeight: img.height
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
                    this.scope = null;
                    var Image = function (elem, attr) {
                        an.extend(this, {
                            source: elem,
                            attributes: attr,
                            parent: elem[0].parentNode
                        });
                        this.remove = function () {

                        };
                        return this;
                    };
                    Image.prototype = {

                    };

                    this.Image = Image;
                },
                require: ['^ngLikeGoogle', '^?ngGoogleLast', '^ngGoogleItem'],
                link: function (scope, elem, attr, controllers) {
                    var like = controllers[0].good, gLast = controllers[1] ? controllers[1].last : attr.ngGoogleItem, that = controllers[2];
                    var item = new that.Image(elem, attr);
                    like.items.push(item);
                    if (gLast) {
                        that.load(like.items, function (images) {
                            like.items = images;
                            like.scope.$emit("start");
                        });
                    }
                    item = null;
                }
            }
        }])
        .factory("$likeGoogle", ['$timeout', function ($timeout) {
            var random = function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            var getEffect = function (phase, time) {
                time = time || 1;
                var res = {},
                    _common = function (time) {
                        return "-webkit-transition: opacity " + time + "s ease;" +
                            "-moz-transition: opacity " + time + "s ease;" +
                            "-o-transition: opacity " + time + "s ease; " +
                            "transition: opacity " + time + "s ease;";
                    };
                res = {
                    startStyle: 'opacity: 0;',
                    endStyle: 'opacity: 1;' + _common(random(1, 5))
                };
                if (phase === "start") {
                    return res.startStyle;
                } else if (phase === "end") {
                    return res.endStyle;
                } else {
                    return res;
                }
            };
            return {
                getEffect: getEffect
            };
        } ]);
})(window, document, angular);
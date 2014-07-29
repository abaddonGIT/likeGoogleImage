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
                            console.log(rows);
                            this.makeNicely(rows);
                        };
                    };
                    Good.prototype = {
                        extendModel: function () {//Расширение тсходной модели данными и ф-ями директивы
                            var ln = this.items.length;
                            while (ln--) {
                                var loc = this.items[ln];
                                if (loc.source[0].naturalWidth) {
                                    an.extend($scope.model[ln], this.items[ln]);
                                } else {
                                    $scope.model.splice(ln, 1);
                                }
                            }
                        },
                        buildRows: function () {
                            var rows = [], row = { items: [], width: 0 }, rowWidth = 0, i = 0, config = this.config;
                            an.forEach($scope.model, function (item) {
                                item.parent.style.cssText += $likeGoogle.getEffect('start');
                                item.compress_ratio = config.eligibleHeight / item.oricHeight;
                                item.width = item.oricWidth * item.compress_ratio;
                                item.height = item.oricHeight * item.compress_ratio;
                                rowWidth = $likeGoogle.getRowWidth(row.items, config, item);
                                if (rowWidth > config.blockWidth) {
                                    row.width = rowWidth - item.width;
                                    rows.push(row);
                                    row = {
                                        items: [],
                                        width: 0
                                    };
                                }
                                row.items.push(item);
                            });
                            row.width = rowWidth;
                            rows.push(row);
                            row.last = true;
                            return rows;
                        },
                        makeNicely: function (rows) {
                            var config = this.config , cof
                            an.forEach(rows, function (row) {
                                if (!row.last) {
                                    row.compress_ratio = cof = (config.blockWidth - (row.items.length - 1) * config.margin) / row.width;
                                }
                                var last;
                                an.forEach(row.items, function (item, k) {
                                    if (row.compress_ratio) {
                                        item.width = Math.round(item.width * row.compress_ratio);
                                        item.height = Math.round(item.height * row.compress_ratio);
                                    }
                                    last = item;
                                    item.source[0].width = item.width;
                                    item.source[0].height = item.height;

                                    if (k > 0) {
                                        item.parent.style.cssText += 'margin-bottom: ' + config.margin + 'px; margin-left: ' + config.margin + 'px; float: left;';
                                    } else {
                                        item.parent.style.cssText += 'margin-bottom: ' + config.margin + 'px; margin-left: 0; float: left;';
                                    }
                                });
                                if (!row.last) {
                                    $likeGoogle.correction(row, config);
                                }
                                an.forEach(row.items, function (item) {
                                    item.parent.style.cssText += $likeGoogle.getEffect("end", "opacity");
                                });
                            });
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
                        effect: 2
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
                },
                require: ['^ngLikeGoogle', '^ngGoogleLast', '^ngGoogleItem'],
                link: function (scope, elem, attr, controllers) {
                    var like = controllers[0].good, gLast = controllers[1], that = controllers[2];
                    like.items.push({
                        source: elem,
                        attributes: attr,
                        parent: elem[0].parentNode
                    });
                    if (gLast.last) {
                        that.load(like.items, function (images) {
                            like.items = images;
                            like.scope.$emit("start");
                        });
                    }
                }
            }
        }])
        .factory("$likeGoogle", ['$timeout', function ($timeout) {
            var correction = function (row, config) {
                console.log(row.width + '||' + getWidth(row.items, config));
                var stock = config.blockWidth - getWidth(row.items, config);
                if (stock > 0) {
                    var ln = row.items.length, step = Math.ceil(stock / ln), j = ln - 1;
                    for (var i = stock; i >= step; i = i - step) {
                        row.width += step;
                        row.items[j].width += step;
                        row.items[j]['source'][0].width = row.items[j].width;
                        j--;
                    }
                    stock = config.blockWidth - getWidth(row.items, config);
                    row.items[0].width += stock;
                    row.items[0]['source'][0].width = row.items[0].width;
                }
            };
            var getWidth = function (collection, config, item) {
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
            };
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
                getRowWidth: getWidth,
                correction: correction,
                getEffect: getEffect
            };
        } ]);
})(window, document, angular);
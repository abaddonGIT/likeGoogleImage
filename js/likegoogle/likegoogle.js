/**
 * Created by netBeans.
 * Name: likeGoogleImages
 * User: Abaddon
 * Date: 26.04.14
 * Time: 01:22
 * Description: Resizing and output images like Google Images
 */
(function (w, d, an) {
    var likegoogle = an.module("likegoogle", []);
    likegoogle.directive("likeGoogle", ["$likeGoogle", "$timeout", function ($likeGoogle, $timeout) {
        return {
            scope: {},
            link: function (scope, elem, attr) {
                var settings = scope.$eval(attr.settings) || {};
                var config = an.extend({
                    blockWidth: elem[0].clientWidth,
                    eligibleHeight: 100,
                    margin: 5,
                    likeClass: '.like',
                    effect: 2
                }, settings);
                var rows = []; //строки
                scope.images = elem[0].querySelectorAll(config.likeClass);
                var start = function () {
                    $likeGoogle.imageLoad(scope.images, function (success, errors) {
                        if (errors.length) {//Hide bad images
                            $likeGoogle.hideBad(errors, elem);
                        }
                        var row = { items: [], width: 0 }, rowWidth = 0, i = 0;
                        an.forEach(success, function (image) {
                            var item = {
                                oric_width: image.width,
                                oric_height: image.height,
                                el: image,
                                parent: image.parentNode
                            };
                            item.parent.style.cssText += $likeGoogle.getEffect(config, 'start');
                            item.compress_ratio = config.eligibleHeight / item.oric_height;
                            item.width = item.oric_width * item.compress_ratio;
                            item.height = item.oric_height * item.compress_ratio;
                            rowWidth = $likeGoogle.getRowWidth(row.items, config, item);
                            if (rowWidth > config.blockWidth) {
                                rows.push(row);
                                row = {
                                    items: [],
                                    width: 0
                                };
                            }
                            row.items.push(item);
                        });
                        rows.push(row);
                        row.last = true;
                        an.forEach(rows, function (row) {
                            if (!row.last) {
                                row.compress_ratio = (config.blockWidth - (row.items.length - 1) * config.margin) / $likeGoogle.getRowWidth(row.items, config);
                            }
                            var last;
                            an.forEach(row.items, function (item, k) {
                                if (row.compress_ratio) {
                                    item.width = Math.round(item.width * row.compress_ratio);
                                    item.height = Math.round(item.height * row.compress_ratio);
                                }
                                last = item;
                                item.el.width = item.width;
                                item.el.height = item.height;

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
                                item.parent.style.cssText += $likeGoogle.getEffect(config, "end", "opacity");
                            });
                        });
                    });
                };

                if (scope.images.length) {
                    start();
                } else {
                    scope.$parent.$on("endRepeat", function () {
                        scope.images = elem[0].querySelectorAll(config.likeClass);
                        start();
                    });
                }
            }
        };
    } ]);
    likegoogle.directive('lastRepeat', ["$timeout", function ($timeout) {
        return {
            link: function (scope, elem, attr) {
                if (scope.$last) {
                    $timeout(function () {
                        scope.$emit("endRepeat");
                    }, 1);
                }
            }
        };
    }]);
    likegoogle.factory("$likeGoogle", ['$timeout', function ($timeout) {
        var correction = function (row, config) {
            var stock = config.blockWidth - getWidth(row.items, config);
            console.log(getWidth(row.items, config));
            if (stock > 0) {
                var ln = row.items.length, step = Math.ceil(stock / ln), j = ln - 1;
                for (var i = stock; i >= step; i = i - step) {
                    console.log(row.items[j]);
                    row.items[j].width += step;
                    row.items[j]['el'].width = row.items[j].width;
                    j--;
                }
                stock = config.blockWidth - getWidth(row.items, config);
                row.items[0].width += stock;
                row.items[0]['el'].width = row.items[0].width;
            }
        };
        var getWidth = function (collection, config, item) {
            var width = 0, ln = collection.length;
            if (ln) {//if an Array
                width = (ln - 1) * config.margin; //Общая длина отступов
                an.forEach(collection, function (it) {
                    width += it.width;
                });
            }
            if (item) {//if an image item
                width += item.width;
            }
            return width;
        };
        /*
         * Check loading images
         */
        var imageLoad = function (images, callback) {
            var ln = images.length, success = [], errors = [],
                _load = function (i) {
                    if (!i) {
                        i = 0;
                    }
                    if (i < ln) {
                        var img = new Image();
                        img.onload = function () {
                            success.push(images[i]);
                            i++;
                            _load(i);
                            img = null;
                        };
                        img.onerror = function () {
                            errors.push(images[i]);
                            i++;
                            _load(i);
                            img = null;
                        };
                        img.src = images[i].src;
                    } else {
                        callback(success, errors);
                    }
                };
            _load();
        };
        /*
         * Delete bad images from page
         */
        var hideBad = function (images, elem) {
            an.forEach(images, function (img) {
                var parent = img.parentNode;
                elem[0].removeChild(parent);
            });
        };

        var random = function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        /*
         * Visual effects
         */
        var getEffect = function (config, phase, propertyString, time) {
            propertyString = propertyString || 'all', time = time || 1;
            var effect = config.effect, res = {},
                _common = function (propertyString, time) {
                    return "-webkit-transition: " + propertyString + " " + time + "s ease;" +
                        "-moz-transition: " + propertyString + " " + time + "s ease;" +
                        "-o-transition: " + propertyString + " " + time + "s ease; " +
                        "transition: " + propertyString + " " + time + "s ease;";
                };

            switch (effect) {
                case 1://fade
                    res = {
                        startStyle: 'opacity: 0;',
                        endStyle: 'opacity: 1;' + _common(propertyString, time)
                    };
                    break;
                case 2://random fade time
                    res = {
                        startStyle: 'opacity: 0;',
                        endStyle: 'opacity: 1;' + _common(propertyString, random(1, 5))
                    };
                    break;
            }

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
            imageLoad: imageLoad,
            hideBad: hideBad,
            correction: correction,
            getEffect: getEffect
        };
    } ]);
})(window, document, angular);
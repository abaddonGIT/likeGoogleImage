/**
 * Created by netBeans.
 * Name: likeGoogleImages
 * User: Abaddon
 * Date: 26.04.14
 * Time: 01:22
 * Description: Resizing and output images like Google Images
 */
var likegoogle = angular.module("likegoogle", []);

likegoogle.directive("likeGoogle", ["$document", "$window", "$likeGoogle", "$timeout", function ($document, $window, $likeGoogle, $timeout) {
    return {
        link: function (scope, elem, attr) {
            var settings = {};

            if (attr.settings) {
                settings = scope.$eval(attr.settings);
            }

            var config = angular.extend({
                blockWidth: elem[0].clientWidth,
                eligibleHeight: 100,
                margin: 5,
                likeClass: '.like',
                effect: 2
            }, settings);


            var rows = [], //строки
                images = elem[0].querySelectorAll(config.likeClass);

            //Сheck load images
            var start = function (images) {
                $likeGoogle.imageLoad(images, function (success, errors) {

                    if (errors.length) {//Hide bad images
                        $likeGoogle.hideBad(errors, elem);
                    }

                    var row = { items: [], width: 0 }, rowWidth = 0, i = 0;
                    angular.forEach(success, function (image) {
                        var item = {
                            oric_width: image.width,
                            oric_height: image.height,
                            el: image,
                            parent: image.parentNode
                        };
                        //item.parent.style.visibility = "hidden";
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
                            }
                        }
                        row.items.push(item);
                    });
                    rows.push(row);

                    angular.forEach(rows, function (row) {
                        row.compress_ratio = (config.blockWidth - (row.items.length - 1) * config.margin) / $likeGoogle.getRowWidth(row.items, config);

                        angular.forEach(row.items, function (item, k) {
                            if (row.compress_ratio) {
                                item.width = Math.round(item.width * row.compress_ratio);
                                item.height = Math.round(item.height * row.compress_ratio);
                            }


                            item.el.width = item.width;
                            item.el.height = item.height;

                            if (k > 0) {
                                item.parent.style.cssText += 'margin-bottom: ' + config.margin + 'px; margin-left: ' + config.margin + 'px; float: left;';
                            } else {
                                item.parent.style.cssText += 'margin-bottom: ' + config.margin + 'px; margin-left: 0; float: left;';
                            }
                        });

                        $likeGoogle.correction(row, config);
                    });
                });
            };

            if (images.length) {
                start(images);
            } else {
                scope.$on("endRepeat", function () {
                    images = elem[0].querySelectorAll(config.likeClass);
                    start(images);
                });
            }
        }
    };
} ]);
/*
* Event is triggered on the last element in the directive ng-repeat
 */
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

likegoogle.factory("$likeGoogle", [function () {
    /*
     * Return total length of the string
     * @param {Object} collection
     * @return lenght of the string
     */

    var getWidth = function (collection, config, item) {
        var width = 0, ln = collection.length;

        if (ln) {//if an Array
            width = (ln - 1) * config.margin; //Общая дляна отступов
            angular.forEach(collection, function (it) {
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
     * Image adjustment to the length of the conteiner
     */
    var correction = function (row, config) {
        var stock = config.blockWidth - getWidth(row.items, config);
        if (stock > 0) {
            var step = Math.ceil(stock / row.items.length), j = row.items.length - 1;

            for (var i = stock; i >= step; i = i - step) {
                row.items[j].width += step;
                row.items[j]['el'].width = row.items[j].width;
                j--;
            }
            correction(row, config);
        } else {//Show good rows
            angular.forEach(row.items, function (item) {
                item.parent.style.cssText += getEffect(config, "end", "opacity");
            });
        }

    };
    /*
     * Delete bad images from page
     */
    var hideBad = function (images, elem) {
        angular.forEach(images, function (img) {
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
                return "-webkit-transition: " + propertyString + " " + time + "s ease; -moz-transition: " + propertyString + " " + time + "s ease; -o-transition: " + propertyString + " " + time + "s ease; transition: " + " " + propertyString + time + "s ease;";
            },
            _transform = function (propertyString) {
                return "-moz-transform: " + propertyString + "; -ms-transform: " + propertyString + "; -webkit-transform: " + propertyString + "; -o-transform: " + propertyString + "; transform:" + propertyString + ';';
            },
            _common_transform = function (time) {
                return "-webkit-transition: -webkit-transform " + time + "s; -moz-transition: -moz-transform " + time + "s; -o-transition: -o-transform " + time + "s; transition: transform " + time + "s;";
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
            case 3://scale
                res = {
                    startStyle: 'opacity: 0;' + _transform('scale(0)'),
                    endStyle: 'opacity: 1;' + _transform('scale(1)') + _common_transform(random(0.5, 1))
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
/**
 * Created by netBeans.
 * Name: likeGoogleImages
 * User: Abaddon
 * Date: 26.04.14
 * Time: 01:22
 * Description: Resizing and output images like Google Images
 */
var likegoogle = angular.module("likegoogle", []);

likegoogle.directive("likeGoogle", ["$document", "$window", "$likeGoogle", function ($document, $window, $likeGoogle) {
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
                likeClass: '.like'
            }, settings);


            var rows = [], //строки
                images = elem[0].querySelectorAll(config.likeClass),
                imagesSuccess = [],
                ln = null;

            //Сheck load images
            $likeGoogle.imageLoad(images, function (success, errors) {
                if (errors.length) {//Hide bad images
                    $likeGoogle.hideBad(errors, elem);
                }
                //Good images
                imagesSuccess = success;
                ln = imagesSuccess.length;

                var row = {
                    items: [],
                    width: 0
                }, rowWidth = 0, rows = [];
                //Distribution of images in rows
                angular.forEach(imagesSuccess, function (image) {
                    var item = {
                        oric_width: image.width,
                        oric_height: image.height
                    };
                    item.compress_ratio = config.eligibleHeight / item.oric_height;
                    item.width = item.oric_width * item.compress_ratio;
                    item.height = item.oric_height * item.compress_ratio;
                    rowWidth += item.width;
                    if (rowWidth > config.blockWidth) {
                        rows.push(row);
                        row = {
                            items: [],
                            width: 0
                        };
                        rowWidth = item.width;
                    }
                    row.items.push(item);
                });
                //Last image
                rows.push(row);

                angular.forEach(rows, function (row) {
                    row.compress_ratio = (config.blockWidth - (row.items.length - 1) * config.margin) / $likeGoogle.getRowWidth(row.items, config);

                });
            });

            /*
            var getRowWidth = function (items, el) {
                var width = 0;
                if (items.length) {
                    width = (items.length - 1) * config.margin;
                    angular.forEach(items, function (item) {
                        width += item.width;
                    });
                }

                if (el) {
                    width += el.width;
                }
                return width;
            };

            var correction = function (row) {
                    var stock = config.blockWidth - getRowWidth(row.items);

                    if (stock) {
                        var step = Math.ceil(stock / row.items.length), j = row.items.length - 1;

                        for (var i = stock; i >= step; i = i - step) {
                            row.items[j].width += step;
                            row.items[j]['el'].width = row.items[j].width;
                            j--;
                        }
                        correction(row);
                    }
                };

            $window.onload = function () {
                var row = { items: [], width: 0 }, rowWidth = 0, i = 0;
                angular.forEach(images, function (img) {
                    var item = {
                        oric_width: img.width,
                        oric_height: img.height,
                        el: img,
                        parent: img.parentNode
                    };

                    item.compress_ratio = config.eligibleHeight / item.oric_height;
                    item.width = item.oric_width * item.compress_ratio;
                    item.height = item.oric_height * item.compress_ratio;

                    rowWidth = getRowWidth(row.items, item);
                    if (rowWidth > config.blockWidth) {
                        rows.push(row);
                        row = { items: [], width: 0 }
                    }
                    row.items.push(item);
                    row.width = rowWidth;
                });
                row.last = true;
                rows.push(row);

                angular.forEach(rows, function (row) {
                    row.compress_ratio = (config.blockWidth - (row.items.length - 1) * config.margin) / getRowWidth(row.items);
                    var last_item = null, ln = row.length;

                    angular.forEach(row.items, function (item, k) {
                        if (row.compress_ratio) {
                            item.width = Math.round(item.width * row.compress_ratio);
                            item.height = Math.round(item.height * row.compress_ratio);
                        }


                        item.el.width = item.width;
                        item.el.height = item.height;

                        if (k !== 0) {
                            item.parent.style.marginLeft = config.margin + 'px';
                        }
                        item.parent.style.cssText += "margin-bottom: " + config.margin + 'px; float: left;';
                    });
                    correction(row);
                });
            };*/
        }
    };
} ]);

likegoogle.factory("$likeGoogle", [function () {
    /*
    * Return total length of the string
    * @param {Object} collection
    * @return lenght of the string
     */

    var getWidth = function (collection, config) {
        var width = 0, ln = collection.length;
        if (ln) {//if an Array
            width = (ln - 1) * config.margin;//Общая дляна отступов
            angular.forEach(collection, function (item) {
               width += item.width;
            });
        } else {//if an image item
            width = collection.width;
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
        angular.forEach(images, function (img) {
           var parent = img.parentNode;
            elem[0].removeChild(parent);
        });
    };

    return {
        getRowWidth: getWidth,
        imageLoad: imageLoad,
        hideBad: hideBad
    };
}]);
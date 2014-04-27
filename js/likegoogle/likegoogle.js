/**
 * Created by netBeans.
 * Name: likeGoogleImages
 * User: Abaddon
 * Date: 26.04.14
 * Time: 01:22
 * Description: Resizing and output images like Google Images
 */
var likegoogle = angular.module("likegoogle", []);

likegoogle.directive("likeGoogle", ["$document", "$window", function ($document, $window) {
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
                ln = images.length;

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
            };
        }
    };
} ]);
var app = angular.module("app", ['likegoogle']);
app.controller("baseController", ['$scope', '$document', function ($scope, $document) {
    var random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var images = [
        {
            src: 'img/02.jpg'
        },
        {
            src: 'img/07.jpg'
        }
        ,
        {
            src: 'img/06.jpg'
        }
        ,
        {
            src: 'img/05.jpg'
        },
        {
            src: 'img/015.jpg'
        }
        ,
        {
            src: 'img/012.jpg'
        }
        ,
        {
            src: 'img/03.jpg'
        }
        ,
        {
            src: 'img/012.jpg'
        }
        ,
        {
            src: 'img/014.jpg'
        }
    ];
    $scope.images = images;
    $scope.addToModel = function () {
        var r = random(1, 20);
        $scope.methods.add({'src':'img/0' + r + '.jpg'});
    };
} ]);


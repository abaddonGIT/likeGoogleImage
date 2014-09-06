var app = angular.module("app", ['likegoogle']);
app.controller("baseController", ['$scope', '$document', function ($scope, $document) {
    var random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var images = [
        {
            src: 'img/1.jpg'
        },
        {
            src: 'img/2.jpg'
        }
        ,
        {
            src: 'img/3.jpg'
        }
        ,
        {
            src: 'img/4.jpg'
        },
        {
            src: 'img/5.jpg'
        }
        ,
        {
            src: 'img/6.jpg'
        }
        ,
        {
            src: 'img/7.jpg'
        }
        ,
        {
            src: 'img/8.jpg'
        }
        ,
        {
            src: 'img/9.jpg'
        },
        {
            src: 'img/10.jpg'
        },
        {
            src: 'img/11.jpg'
        }
        ,
        {
            src: 'img/12.jpg'
        }
        ,
        {
            src: 'img/13.jpg'
        },
        {
            src: 'img/14.jpg'
        }
        ,
        {
            src: 'img/15.jpg'
        }
        ,
        {
            src: 'img/16.jpg'
        }
        ,
        {
            src: 'img/17.jpg'
        }
        ,
        {
            src: 'img/18.jpg'
        }
        ,
        {
            src: 'img/19.jpg'
        }
        ,
        {
            src: 'img/20.jpg'
        }
        ,
        {
            src: 'img/21.jpg'
        }
        ,
        {
            src: 'img/22.jpg'
        }
    ];

    $scope.images2 = [
        {
            src: 'img/2.jpg'
        },
        {
            src: 'img/20.jpg'
        }
        ,
        {
            src: 'img/22.jpg'
        }
//        ,
//        {
//            src: 'img/2.jpg'
//        }
//        ,
//        {
//            src: 'img/3.jpg'
//        }
    ];

    $scope.images = images;
    $scope.addToModel = function () {
        var r = random(1, 22);
        $scope.methods.add({'src': 'img/' + r + '.jpg'});
    };
} ]);


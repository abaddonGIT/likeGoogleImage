var app = angular.module("app", ['likegoogle']);
app.controller("baseController", ['$scope','$document', function ($scope, $document) {
   $scope.images = [
       {
           src: 'img/002.jpg'
       },{
           src: 'img/003.jpg'
       },{
           src: 'img/004.jpg'
       },{
           src: 'img/01.jpg'
       },{
           src: 'img/02.jpg'
       },{
           src: 'img/03.jpg'
       },{
           src: 'img/04.jpg'
       },{
           src: 'img/05.jpg'
       },{
           src: 'img/06.jpg'
       },{
           src: 'img/07.jpg'
       },{
           src: 'img/003.jpg'
       },{
           src: 'img/004.jpg'
       },{
           src: 'img/002.jpg'
       }
   ];
} ]);


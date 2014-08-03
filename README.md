likeGoogleImage
=====================

Формирует и выводит изображения на манер google images. 

<h3>Установка:</h3>
<pre>
var app = angular.module('app', ['likegoogle']);
</pre>
<h3>В шаблоне (при использовании модели и ng-repeat)</h3>
<pre>
&lt;div class="images" ng-like-google model="images" methods="methods"&gt;
    &lt;a href="#" ng-repeat="image in images" ng-google-last&gt;
        &lt;img class="like" ng-google-item ng-click="image.remove()" src="{{image.src}}" alt=""/&gt;
    &lt;/a&gt;
&lt;/div&gt;
</pre>
<h3>Директивы и параметры:</h3>
<ul>
    <li>
        <b>ngLikeGoogle</b> - основная директива, вызывается на блоке, который содержит изображения для редактирования;
    </li>
    <li>
        <b>ngGoogleLast</b> - если для вывода используется директива <b>ngRepeat</b>. Необходима для определения последнего элемента;
    </li>
    <li>
        <b>ngGoogleItem</b> - директива вызывается на изображении. Если <b>ngRepeat</b> не используется, то в директиву, которая вызывается на последнем элементе передается значение "last";
    </li>
    <li>
        <b>model</b> - переменная в scope, которая содержит массив с данными для изображений;
    </li>
    <li>
        <b>methods</b> - объект в scope, через которые будут доступны методы директивы <b>ngLikeGoogle</b>;
        <ul>
            <li>
                <b>add</b> - Добавляет новый элемент в набор
            </li>
            <li>
                <b>update</b> - вызывает перестройку изображений
            </li>
        </ul>
    </li>
    <li>
        <b>settings</b> - настройки директивы в формате json (<b>nomodel</b> - если не ипользуется модель, <b>blockWidth</b> - ширина контейнера, если не указана, то определяется автоматически,
        <b>eligibleHeight</b> - высота строки, к которой модуль будет стремиться привести изображения, <b>margin</b> - отступы между картинками).
    </li>
</ul>
<h3>В шаблоне (без использования модели)</h3>
<pre>
&lt;div class="images" ng-like-google settings="{nomodel: true}"&gt;
    &lt;a href="#"&gt;
        &lt;img src="img/003.jpg" ng-google-item alt=""/&gt;
    &lt;/a&gt;
    &lt;a href="#"&gt;
        &lt;img src="img/03.jpg" ng-google-item alt=""/&gt;
    &lt;/a&gt;
    &lt;a href="#"&gt;
        &lt;img src="img/02.jpg" ng-google-item alt=""/&gt;
    &lt;/a&gt;
    &lt;a href="#"&gt;
        &lt;img src="img/002.jpg" ng-google-item alt=""/&gt;
    &lt;/a&gt;
    &lt;a href="#"&gt;
        &lt;img src="img/01.jpg" ng-google-item alt=""/&gt;
    &lt;/a&gt;
    &lt;a href="#"&gt;
        &lt;img src="img/003.jpg" ng-google-item alt=""/&gt;
    &lt;/a&gt;
    &lt;a href="#"&gt;
        &lt;img src="img/03.jpg" ng-google-item="last" alt=""/&gt;
    &lt;/a&gt;
&lt;/div&gt;
</pre>
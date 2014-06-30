likeGoogleImage
=====================

Формирует и выводит изображения на манер google images. 


<h2>Как использовать?</h2>
<ol>
    <li>
        Подключение:
        <pre>var app = angular.module("app", ['likegoogle']);</pre>
    </li>
    <li>
        Директивы:
        <ul>
            <li>
                <b>likeGoogle</b> - вызывается на блоке, изображения внутри которого должны подвергнуться перестройке. Также на этом элементе при помощи аттрибуда <b>data-settings</b> можно настроить вывод.
                <pre>
&lt;div class="images" data-like-google>            
    &lt;a href=#>
        &lt;img class="like" src="img/1.jpg" alt=""/>
    &lt;/a>
    &lt;a href=#>
        &lt;img class="like" src="img/2.jpg" alt=""/>
    &lt;/a>
    &lt;a href=#>
        &lt;img class="like" src="img/3.jpg" alt=""/>
    &lt;/a>
&lt;/div>
                </pre>
            Параметры, которые могут быть переданы в директиву:
            <ul>
                <li>
                    <b>blockWidth</b> - ширина блока относительно, которой будут выстраиваться изображения (По умолчанию определяется автоматически).
                </li>
                <li>
                    <b>eligibleHeight</b> - средняя высота, к которой скрипт будет стримиться привести изображения (По умолчанию 100px).
                </li>
                <li>
                    <b>margin</b> - отступ между картинками (По умолчанию 5px).
                </li>
                <li>
                    <b>likeClass</b> - класс указаный на элементе изображения, по которому будет формироваться выборка изображений, которые будут подвержены обработке (По умолчанию like).
                </li>
                <li>
                    <b>effect</b> - визуальный эффект вывода картинок (1 - плавное появление, 2 - рандомное появление, 3 - scale).
                </li>
            </ul>
            <p>Пример вызова директивы с параметрами:</p>
            <pre>
&lt;div class="images" data-like-google data-settings="{eligibleHeight: 150, margin: 10}">            
    &lt;a href=#>
        &lt;img class="like" src="img/1.jpg" alt=""/>
    &lt;/a>
    &lt;a href=#>
        &lt;img class="like" src="img/2.jpg" alt=""/>
    &lt;/a>
    &lt;a href=#>
        &lt;img class="like" src="img/3.jpg" alt=""/>
    &lt;/a>
&lt;/div>               
</pre>
            </li>
            <li>
                <b>lastRepeat</b> эта директива используется если вывод изображений построен при помощи директивы ng-repeat
                <pre>
&lt;a href="#" ng-repeat="image in images" data-last-repeat>
    &lt;img class="like" src="{{image.src}}" alt="" />
&lt;/a>
</pre>
            </li>
            </li>
        </ul>
    </li>
</ol>
<hr />
likeGoogleImage
=====================

Builds images like google images.

<h2>How to use it?</h2>
<ol>
    <li>
        Installation:
        <pre>var app = angular.module("app", ['likegoogle']);</pre>
    </li>
    <li>
        Directives:
        <ul>вызывается на блоке, изображения внутри которого должны подвергнуться перестройке
            <li>
                <b>likeGoogle</b> - The main directive which is caused on an element the container in which there are images. <b>data-settings</b> attribute for settings.
                <pre>
&lt;div class="images" data-like-google>
    &lt;a href=#>
        &lt;img class="like" src="img/1.jpg" alt=""/>
    &lt;/a>
    &lt;a href=#>
        &lt;img class="like" src="img/2.jpg" alt=""/>
    &lt;/a>
    &lt;a href=#>
        &lt;img class="like" src="img/3.jpg" alt=""/>
    &lt;/a>
&lt;/div>
                </pre>
            Directive parameters:
            <ul>
                <li>
                    <b>blockWidth</b> - Maximum width (by default is defined automatically).
                </li>
                <li>
                    <b>eligibleHeight</b> - average height to which the script will seek to lead images (by default 100px).
                </li>
                <li>
                    <b>margin</b> - margin between (by default 5px).
                </li>
                <li>
                    <b>likeClass</b> - class name for images (by default "like").
                </li>
                <li>
                    <b>effect</b> - visual effect of display of images (1 - smooth emergence, 2 - In a casual order, 3 - scale).
                </li>
            </ul>
            <p>Example calling directive with parameters:</p>
            <pre>
&lt;div class="images" data-like-google data-settings="{eligibleHeight: 150, margin: 10}">
    &lt;a href=#>
        &lt;img class="like" src="img/1.jpg" alt=""/>
    &lt;/a>
    &lt;a href=#>
        &lt;img class="like" src="img/2.jpg" alt=""/>
    &lt;/a>
    &lt;a href=#>
        &lt;img class="like" src="img/3.jpg" alt=""/>
    &lt;/a>
&lt;/div>
</pre>
            </li>
            <li>
                <b>lastRepeat</b> if you use <b>ng-repeat</b> directive for display images, you must use this directive
                <pre>
&lt;a href="#" ng-repeat="image in images" data-last-repeat>
    &lt;img class="like" src="{{image.src}}" alt="" />
&lt;/a>
</pre>
            </li>
            </li>
        </ul>
    </li>
</ol>


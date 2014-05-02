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
                <b>likeGoogle</b> - вызывается на блоке, изображения внутри которого должны подвергнуться перестройке. Так же на этом элементе при помощи аттрибуда <b>data-settings</b> можно настроить вывод.
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
            Параметры которые могут быть переданы в директиву:
            <ul>
                <li>
                    <b>blockWidth</b> - ширина блока относительно которой будут выстраиваться изображения (По умолчанию определяется автоматически).
                </li>
                <li>
                    <b>eligibleHeight</b> - средняя высота к которой скрипт будет стримиться привести изображения (По умолчанию 100px).
                </li>
                <li>
                    <b>margin</b> - отступ между картинками (По умолчанию 5px).
                </li>
                <li>
                    <b>likeClass</b> - класс указанный на элементе изображения по которому будет формироваться выборка изображений, которые будут подвержены обработке (По умолчанию like).
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


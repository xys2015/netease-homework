# keyword，description，seo信息
```html
<meta name="author" content="Asheng">
<meta name="version" content="1.0">
<meta name="keywords" content="网易教育产品部、网易公开课、云课堂、中国大学MOOC">
<meta name="description" content="网易教育部是网易公司研发的一款大型在线教育平台服务，该平台面向学习者提供海量免费、优质课程，创新的个性化学习体验，自由开放的交流互动环境。">
```

# this.length >>> 0 含义

这种写法是为了兼容，确保如果this未定义，返回0。  
参见：https://www.zhihu.com/question/20693429

# JS 位操作符

http://www.cnblogs.com/oneword/archive/2009/12/23/1631039.html

# JS in 运算符的使用

http://www.cnblogs.com/lsy0403/p/5901803.html



# getElementsByClassName()

**语法**

    var elements = document.getElementsByClassName(names);
    var elements = rootElement.getElementsByClassName(names);

* `names`可以是多个类名，用空格分开。
* 返回值`elements`是一个元素数组。
* 若果用`rootElement`调用，则只在该元素下搜索。

**示例**
```js
// 返回所有类名是test的元素
document.getElementsByClassName('test');

// 返回所有同时具有red和test类的元素
document.getElementsByClassName('red test');

// 在id为main这个元素里，拿出所有具有类名test的元素
document.getElementById('main').getElementsByClassName('test');

// 直接拿到类名为test的第一个元素
var testTarget = document.getElementsByClassName("test")[0];
```

**兼容**

`getElementsByClassName()` IE8及以下不支持。

# Array.prototype.indexOf()

在数组中查找某个元素，找到返回第1次找到的索引，找不到返回-1。

```js
var a = [2, 9, 9]; 
a.indexOf(2); // 0 
a.indexOf(7); // -1

if (a.indexOf(7) === -1) {
  // element doesn't exist in array
}
```

## 语法

    arr.indexOf(searchElement, fromIndex)

**参数**
`searchElement`要被查找的元素。  
`fromIndex`(可选，默认值为0)  
开始查找的索引。如果该索引大于或等于数组的长度，将返回-1。如果给出的是负值n，则表示从倒  
数第n个元素开始，向前查找，如果n的长度大于数组的长度，则表示查找整个数组。  

**返回值**
找到，返回第1次找到该元素的索引。找不到，返回-1。

## 使用示例

```js
var arr = [2, 9, 9, 2];
console.log( arr.indexOf(2) ); // 0
console.log( arr.indexOf(7) ); // -1
console.log( arr.indexOf(2, 2) ); // 3
console.log( arr.indexOf(2, -1) ); // 3
console.log( arr.indexOf(2, -4) ); // 0
```

## Polyfill

indexOf()在ECMA-262第5版才被支持，下面实现一个兼容方案。  

> polyfill这个单词可以认为是JS里面专用的术语，可以理解成兼容方案。

**完整代码示例**
```js
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchValue, index) {
        var len = this.length >>> 0; // 确保len数值正常，出现异常则取len为0
        index |= 0; // 同上

        if (index < 0) {
            index = Math.max(len + index, 0); // 得到实际的index值
        }
        
        if (index >= len) {
            return -1;
        }
            
        if (searchValue === undefined) {
            // 如果数组的索引未定义，则其值也为undefined，所以需要检查确认
            do {
                if (index in this && this[index] === undefined) {
                    return index;
                }
            } while (++index !== len);
        } else {
            do {
                if (this[index] === searchValue) {
                    return index;
                }
            } while (++index !== len);
        }

        return -1;
    };
}
// 测试
var str = [1, null, undefined, 1, 8, 1];

console.log( str.indexOf(7) ); // -1
console.log( str.indexOf(undefined) ); // 2
console.log( str.indexOf(null) ); // 1
console.log( str.indexOf(1, -2) ); // 5
// IE8下亲测有效。
```

## 参考链接
MDN Array.prototype.indexOf()  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf  

# 原生JS实现 AddClass/RemoveClass 
```js
function hasClass(ele, className) {
    return ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

function addClass(ele, className) {
    if (ele.className === '') {
        ele.className = className;
    } else if (!hasClass(ele, className)) {
        ele.className += " " + className;
    }
}

function removeClass(ele, className) {
    var mt = hasClass(ele, className);
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');

    if (mt) {
        if (mt[1] === " " && mt[2] === " ") {
            // 如果class在中间，则替换成1个空格
            ele.className = ele.className.replace(reg, ' ');    
        } else {
            // 如果class在两边，或者只有1个class，替换成空字符串
            ele.className = ele.className.replace(reg, '');
        }
    }
}
```

参考链接  
https://jaketrent.com/post/addremove-classes-raw-javascript/

# 事件顺序

EventTarget.addEventListener(type, listener, useCapture);  
type表示监听事件类型的字符串  
listener表示监听函数  
useCapture表示是否启用事件捕获，默认为false，表示不启用事件捕获。  

事件捕获和事件冒泡总是发生，和有没有定义`addEventListener()`无关。先发生事件捕获，然后  
进行事件冒泡。请看下面的代码：

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>事件冒泡和事件捕获</title>
</head>
<body>

<div id="parent">
    <div id="child">Click</div>
</div>

<script>

var parent = document.getElementById('parent');
var child = document.getElementById('child');
var body = document.getElementsByTagName('body')[0];

body.addEventListener('click', function() {
    console.log('body_captured');
}, true);

body.addEventListener('click', function() {
    console.log('body_bubbled');
}, false);

parent.addEventListener('click', function() {
    console.log('parent_captured');
}, true);

child.addEventListener('click', function() {
    console.log('child_captured');
}, true);

// body_captured  parent_captured  child_captured  body_bubbled
</script>

</body>
</html>
```

**分析**  
先不要看JS代码，只关注HTML部分。单击`Click`，按照规则不管JS代码写了什么东西，都要执行  
事件捕获和事件冒泡，而且是首先执行事件捕获然后执行事件冒泡。对应上面的代码，将分执行下面  
的步骤：
1. 捕获body，检查body有没有被绑定捕获事件，发现有，输出body_captured
2. 捕获parent，检查parent有没有被绑定捕获事件，发现有，输出parent_captured
3. 捕获child，检查child有没有被绑定捕获事件，发现有，输出child_captured
4. 冒泡child，检查child有没有被绑定冒泡事件，没有。
5. 冒泡parent，检查parent有没有被绑定冒泡事件，没有。
6. 冒泡body，检查body有没有被绑定冒泡事件，有，输出body_bubbled。

## 参考链接

https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener  

https://www.quirksmode.org/js/events_order.html#top


# 封装Ajax函数

https://xhr.spec.whatwg.org/
http://www.cnblogs.com/zhiqiangzhang37/archive/2013/10/02/3349647.html

```js
/**
 * 分装Ajax GET 请求函数
 * @param {string} request.method 可选。使用GET方法请求数据。
 * @param {string} request.url 必选。请求的URL地址
 * @param {boolean} request.async 可选。异步请求，默认用true，最好不要改动
 * @param {object} request.query 可选。URL查询参数，以对象的形式给出
 * @param {function} request.responseFuc 必选。请求成功后，处理请求数据的函数
 */
function ajax(request) {
    var method = request.method || 'GET';
    var url = request.url || '';
    var async = request.async || true;
    var query = request.query || '';
    var responseFuc = request.responseFuc || function () {};
    var xhr = new XMLHttpRequest();
    
    if (query) {
        // 把传进的查询参数转成字符串形式
        var params = [];
        for (var key in query) {
            key = encodeURIComponent(key);
            query[key] = encodeURIComponent(query[key]);
            params.push(key + '=' + query[key]);
        }
        var querys = '?' + params.join('&');
        console.log(querys);
        xhr.open(method, url + querys, async);
        xhr.send();
    } else {
        // 无查询参数的情况
        xhr.open(method, url, async);
        xhr.send();
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            responseFuc(xhr.responseText);
        }
    };
}

// http://study.163.com/webDev/couresByCategory.htm?pageNo=1&psize=20&type=20
ajax({
    url: 'http://study.163.com/webDev/couresByCategory.htm',
    query: {
        pageNo: 1,
        psize: 20,
        type: 20
    },
    responseFuc: function (responseText) {
        console.log(responseText);
    }
});
```
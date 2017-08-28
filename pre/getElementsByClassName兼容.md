## 概述

JavaScript中`getElementsByClassName()`方法IE8及以下不支持。本文通过使用正则表达式实  
现1个兼容方案。  
本文内容分为3个部分。  
* 浏览器原生`getElementsByClassName()`功能和用法。  
* 兼容方案用到的正则表达式理解。  
* 完整代码示例。  

> 大家不用一听到正则表达式就慌，本方案用到的正则表达式并不复杂，而且我也会详细解释的。  

## 原生getElementsByClassName

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

## 正则表达式简要分析

实现兼容方案的整体思路是：使用`getElementsByTagName("*")`全部元素，然后循环遍历把这些  
元素的类名都拿出来，拿出这些类名之后，最关键的问题就是判断，这些类名是不是符合我要查询的  
类名，这就要用到正则表达式来比较，请看下面的代码：
```js
function getElementsByClassName(names, rootElement) {
    if (!rootElement) {
        rootElement = document;
    }

    var classElements = [];
    var allElements = rootElement.getElementsByTagName("*");
    // (^|\s)names(\s|$)
    pattern = new RegExp("(^|\\s)" + names + "(\\s|$)");

    for (var i = 0, j = 0; i < allElements.length; i++) {
        if (pattern.test(allElements[i].className)) {
            console.log(allElements[i]);
            classElements[j] = allElements[i];
            j++;
        }
    }

    return classElements;
}
```

上面的代码最难理解的就是正则表达式部分。首先，我默认你已经有一点点正则表达式基础，如果听  
都没听过正则表达式，可以考虑看看我写的这篇**正则表达式 - JavaScript描述**，  
http://www.cnblogs.com/asheng2016/p/7401391.html

OK，首先我们梳理一下代码逻辑，看看我们需要什么样的正则表达式。假设我们要查找的类名有下面  
这几种情况："ab", "ab cd", "ab cd ef", "ab cd ef gh"。也就是说，如果我们能找到这个类  
并成功匹配，那么这个类要么在开头，要么在中间，要么在末尾，只有这三种情况。

我们使用`(^|\s)names(\s|$)`这个正则表达式就可以实现对上述三种情况的匹配，其中`names`  
变量就表示类名字符串的所有情况（3种）。该正则表达式的图形化含义如下：

[1](1.jpg)

根据图像我们理解该正则表达式，首先中间是已知的类名，这没问题，然后就是这个类名的两边可能  
存在的情况，可能是开头+类名+结尾、空格+类名+空格、开头+类名+空格等。  

> `\s` 表示匹配类名，并且因为在字符串中`\`也有转义的功能，所以在new RegExp中写成`\\`  

## 完整函数及测试
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>getElementsByClassName 兼容</title>
</head>
<body>
    
<p><pre>(^|\s)names(\s|$)</pre></p>
<div class="ab cd">ab cd</div>
<div class="a c">a c</div>
<script>

function getElementsByClassName(names, rootElement) {
    if (!rootElement) {
        rootElement = document;
    }
    
    if (rootElement.getElementsByClassName) {
        // console.log("走的是原生方法");
        return rootElement.getElementsByClassName(names);
    }
    
    // console.log("走的是兼容方案");
    var classElements = [];
    var allElements = rootElement.getElementsByTagName("*");
    pattern = new RegExp("(^|\\s)" + names + "(\\s|$)");

    for (var i = 0, j = 0; i < allElements.length; i++) {
        if (pattern.test(allElements[i].className)) {
            classElements[j] = allElements[i];
            j++;
        }
    }

    return classElements;
}

var mt = getElementsByClassName("ab");
console.log(mt[0].className); // "ab cd"

var mt2 = getElementsByClassName("a");
console.log(mt2[0].className); // "a c"

var mt3 = getElementsByClassName("ac");
console.log(mt3); // []

// 亲测在IE8下可用
</script>
</body>
</html>
```

## 参考链接

http://regexper.com  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions  
https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName  



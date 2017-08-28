# 使用原生JS实现简单模板引擎

## 理解RegExp.prototype.exec()
```js
/**
 * RegExp.prototype.exec() 一次只能返回一个查询数组。该查询数组包括
 * 使用括号，记住的数据 
 */
var TemplateEngine = function (tpl, data) {
    var patt = /<%([^%>]+)?%>/g;
    var res = patt.exec(tpl); // ["<%name%>", "name"]
    var res2 = patt.exec(tpl); // ["<%age%>", "age"]
    console.log(res);
    console.log(res2);
}
var template = '<p>Hello, my name is <%name%>. I\'m <%age%> years old.</p>';
console.log(TemplateEngine(template, {
    name: "Krasimir",
    age: 29,
}));
```

## 当使用简单数据对象时
```js
var TemplateEngine = function (tpl, data) {
    var pattern = /<%([^%>]+)?%>/g;
    while (result = pattern.exec(tpl)) {
        tpl = tpl.replace(result[0], data[result[1]]);
    }
    return tpl;
}
var template = '<p>Hello, my name is <%name%>. I\'m <%age%> years old.</p>';
console.log(TemplateEngine(template, {
    name: "Krasimir",
    age: 29,
}));
```

## 支持复杂对象和支持循环、选择结构

html代码  
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>20行代码实现JavaScript模板引擎</title>
</head>

<body>
    <h2>20行代码实现JavaScript模板引擎</h2>
    <p>https://johnresig.com/blog/javascript-micro-templating/</p>
    <p>http://web.jobbole.com/56689/</p>
    <p>http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line</p>
    <div id="wrap">
        <p>简单测试输出变量<%this.name%></p>
    </div>

    <div id="wrap2">
        <h3>循环测试输出变量</h3>
        <%for(var i=1; i<=5; i++) {%>
            <p>循环输第<%i%>次。</p>
        <%}%>
    </div>

    <script src="template.js"></script>
</body>

</html>
```

js代码  
```js
/**
 * line.replace(/"/g, '\\"') 用来转义双引号，
 * 如果模板里包含双引号，不专业将会出错。
 * 
 * 
 */
var TemplateEngine = function (html, options) {
    var re = /<%([^%>]+)?%>/g;
    var reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
    var code = 'var r=[];\n';
    var cursor = 0;
    var match;
    var add = function (line, js) {
        js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
             (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}

function innerRealHTML(ele) {
    var html = ele.innerHTML;
    // 去除两边多余的空格
    html = html.replace(/(^\s*)|(\s*$)/g, ""); 

    // & > < 保留正常显示
    html = html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').
           replace(/&gt;/g, '>');

    return html;
}

var wrap = document.getElementById('wrap');
html = innerRealHTML(wrap);
var result = TemplateEngine(html, {
    name: 'hello_world'
});
wrap.innerHTML = result;

var wrap2 = document.getElementById('wrap2');
html2 = innerRealHTML(wrap2);
var result2 = TemplateEngine(html2);
wrap2.innerHTML = result2;
```

## 参考链接

https://johnresig.com/blog/javascript-micro-templating/

http://web.jobbole.com/56689/

http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line


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
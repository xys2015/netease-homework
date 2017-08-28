function $(id) {
	return document.getElementById(id);
}

// cookie API
var docCookies = {
	// 把document.cookie转成对象，并返回
	getCookie: function() { 
		var cookie = {};
		var all = document.cookie;

		if(all === '') {
			return cookie;
		}

		var list = all.split('; ');
		for (var i = 0; i < list.length; i++){
			var item = list[i];
			var p = item.indexOf('=');
			var name = item.substring(0, p);
			name = decodeURIComponent(name);
			var value = item.substring(p + 1);
			value = decodeURIComponent(value);
			cookie[name] = value;
		}
		return cookie;
    },
    
	setCookie: function(name, value, maxAge, stdStrTime, path, domain, secure) {
		var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
	
		if (maxAge) {
			cookie += '; max-age=' + maxAge;
		}
		if (stdStrTime) {
            // 该参数类似于这样： 2018-08-08T00:00:00.000Z
			var mTime = Date.parse(stdStrTime);
			var dateObj = new Date(mTime);
			var gmtTime = dateObj.toUTCString();
			cookie += '; expires=' + gmtTime;
		}
		if (path) {
			cookie += '; path=' + path;
		}
		if (domain) {
			cookie += '; domain=' + domain;
		}
		if (secure) {
			cookie += '; secure';
		}
	
		document.cookie = cookie;
    },
    
    // 删除某个cookie实质上是修改某个cookie的max-age为0,使其失效
    removeCookie: function (name, path, domain) {
        document.cookie = name + '='
        + '; path=' + path
        + '; domain=' + domain
        + '; max-age=0';
    }
};

/**
 * 查询 / 增加 / 删除指定类
 */
var docClass = {
    hasClass: function (ele, className) {
        return ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    },

    addClass: function (ele, className) {
        if (ele.className === '') {
            ele.className = className;
        } else if (!this.hasClass(ele, className)) {
            ele.className += " " + className;
        }
    },

    removeClass: function (ele, className) {
        var mt = this.hasClass(ele, className);
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
};

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

/**
 * 参数ele为需要获取内部HTML的元素节点
 * 返回值为保留 & > < 的 innerHTML
 */
function innerRealHTML(eleStr) {
    
    // 去除两边多余的空格
    eleStr = eleStr.replace(/(^\s*)|(\s*$)/g, ""); 

    // & > < 保留正常显示
    eleStr = eleStr.replace(/&amp;/g, '&').replace(/&lt;/g, '<').
           replace(/&gt;/g, '>');

    return eleStr;
}

/**
 * JS元素实现简单模板引擎
 * 参考链接：
 * http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
 * 改模板支持复杂对象，支持循环，选择等基本语言结构
 * line.replace(/"/g, '\\"') 转义双引号，防止因模板中带有双引号
 * 而报错
 * 
 */
function templateEngine(html, options) {
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
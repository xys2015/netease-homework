/**
 * names: 类名字符串
 * rootElement: 查询的根元素
 * 返回值: 匹配到的元素数组
 */
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

/**
 * 兼容 Array.prototype.indexOf()
 * 通过重写原型的方式实现
 */
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

/**
 * 兼容IE8事件操作
 */
var EventUtil = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    
    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    }
};

/**
 * 兼容IE8透明度设置
 */
function setOpacity(ele, opacity) {
    if (ele.style.opacity != undefined) {
        ele.style.opacity = opacity / 100;
    } else {
        ele.style.filter = "alpha(opacity=" + opacity + ")";
    }
} 


/**
 * 功能点1：单击关闭顶部小黄条提醒
 */
(function () {
    var atten = $('m-atte');
    var bclose = $('close');
    var cookies = docCookies.getCookie();

    if (cookies.closed) {
        // 检测到cookie，隐藏小黄条
        atten.style.display = 'none';
    } else {
        // 未检测到cookie，显示
        atten.style.display = 'block';
    }

    function clickHandler() {
        // 1代表已关闭 0代表未关闭 维持1小时
        docCookies.setCookie('closed', '1', '3600');

        atten.style.display = 'none';
    }

    EventUtil.addHandler(bclose, 'click', clickHandler);
})();

/**
 * 功能点2：关注 / 登陆
 * 固定账号密码：studyOnline / study.163.com
 * 请求 http://study.163.com/webDev/attention.htm 返回 1 正确关注
 * 请求 http://study.163.com/webDev/login.htm?userName=studyOnline&password=study.163.com
 * 固定账号密码 studyOnline / study.163.com
 * 请求时需md5加密， 正确返回 1 错误返回 0
 */
(function () {
    var cookies = docCookies.getCookie();
    var follow = $('f-btn'); // 关注
    var followed = $('f-fed'); // 已关注
    var unfollow = $('f-cancel'); // 取消关注
    var mForm = $('m-form'); // 登陆弹窗
    var mClose = $('l-close'); // 登陆弹窗关闭按钮
    var btn = $('l-btn'); // 登陆弹窗登陆按钮

    if (cookies.followSuc) {
        // 已关注状态
        follow.style.display = 'none';
        followed.style.display = 'inline-block';
    } else {
        // 未关注状态
        follow.style.display = 'inline-block';
        followed.style.display = 'none';
    }

    // 显示登陆弹窗或设为已关注状态
    EventUtil.addHandler(follow, 'click', function () {
        if (cookies.loginSuc) {
            mForm.style.display = 'none';
            follow.style.display = 'none';
            followed.style.display = 'inline-block';
            ajax({
                url: 'http://study.163.com/webDev/attention.htm',
                responseFuc: function (responseText) {
                    docCookies.setCookie('followSuc', responseText, '3600',
                        0, '/', 'localhost');
                }
            });
        } else {
            mForm.style.display = 'block';
        }
    });

    // 关闭登陆弹窗
    EventUtil.addHandler(mClose, 'click', function () {
        mForm.style.display = 'none';
    });

    // 关注、登陆功能实现
    EventUtil.addHandler(btn, 'click', function () {
        // 首先检测是否已经登陆
        if (cookies.loginSuc) {
            // 已经登陆则设为关注状态
            follow.style.display = 'none';
            followed.style.display = 'inline-block';
            return;
        }

        var forms = document.login; // 登陆表单
        var userName = md5(forms.userName.value); // 获取用户名
        var password = md5(forms.password.value); // 获取密码

        ajax({
            url: 'http://study.163.com/webDev/login.htm',
            query: {
                userName: userName,
                password: password
                // userName: 'studyOnline',
                // password: 'study.163.com'   
            },
            responseFuc: function (responseText) {
                var flag = responseText; // 登陆验证标志， 为1验证成功，为0验证失败
                if (flag) {
                    // 登陆成功后设置 loginSuc = 1
                    // 登陆成功后设置 followSuc = 1
                    docCookies.setCookie('loginSuc', '1', '3600');

                    // 关注成功的cookie通过ajax请求设置
                    ajax({
                        url: 'http://study.163.com/webDev/attention.htm',
                        responseFuc: function (responseText) {
                            docCookies.setCookie('followSuc', responseText, '3600',
                                0, '/', 'localhost');
                        }
                    });

                    // 登陆成功后 "关注"  按钮变为 "已关注"
                    follow.style.display = 'none';
                    followed.style.display = 'inline-block';

                    // 登陆成功后关闭登陆弹窗
                    mForm.style.display = 'none';
                } else {
                    console.log('用户名或密码错误！');
                }
            }
        });
    });

    // 取消关注功能的实现
    EventUtil.addHandler(unfollow, 'click', function () {
        docCookies.removeCookie('followSuc', '/', 'localhost');
        follow.style.display = 'inline-block';
        followed.style.display = 'none';
    });
})();

/**
 * 功能点4： 轮播图
 * 三张轮播图轮播效果：实现每 5s 切换图片，图片循环播放；鼠标悬停某张图片，
 * 则暂停切换；切换效果使用入场图片 500ms 淡入的方式。
 */
(function () {
    var wrap = document.querySelector('.m-wrap');
    var bnr = wrap.querySelector('.m-bnr');
    var items = bnr.querySelectorAll('a');
    var pointer = wrap.querySelector('.pointer');
    var p_i = pointer.querySelectorAll('i');
    var num = 0;

    // 元素淡入效果
    function fadein(ele) {
        var stepLength = 1 / 25 * 100;
        setOpacity(ele, 0);
        var start = 0;
        function step() {
            if (start + stepLength <= 100) {
                start += stepLength;
                setOpacity(ele, start);
            } else {
                start = 100;
                clearInterval(setIntervalId);
            }
        }
        var setIntervalId = setInterval(step, 20);
    }

    function autoplay(wrap) {
        function step() {
            // 3张为一轮
            var index = (++num) % items.length;

            // 隐藏全部轮播图
            for (var j = 0; j < items.length; j++) {
                docClass.removeClass(p_i[j], 'active');
                docClass.removeClass(items[j], 'active');
            }

            // 显示当前指定轮播图
            docClass.addClass(items[index], 'active');
            docClass.addClass(p_i[index], 'active');
            fadein(items[index]);
        }

        var timer = setInterval(step, 4500);
        // 鼠标进入轮播图暂停动画。
        EventUtil.addHandler(wrap, 'mouseover', function (event) {
            clearInterval(timer);
        });
    }
    autoplay(wrap);
    // 鼠标离开轮播图开始动画。
    EventUtil.addHandler(wrap, 'mouseout', function (event) {
        autoplay(wrap);
    });

    // 单击小圆点切换轮播图
    for (var i = 0; i < p_i.length; i++) {
        (function (i) {
            EventUtil.addHandler(p_i[i], 'click', function (event) {
                for (var j = 0; j < p_i.length; j++) {
                    docClass.removeClass(p_i[j], 'active');
                    docClass.removeClass(items[j], 'active');
                }
                docClass.addClass(p_i[i], 'active');
                docClass.addClass(items[i], 'active');
                fadein(items[i]);
            });
        })(i);
    }
})();

/**
 * 功能点7: 视频播放功能实现
 * 使用HTML5实现视频播放，
 * 点击图片热点，开始播放。
 * 点击X，关闭弹窗，暂停播放。
 */
(function () {
    var videoClick = $('get-video-img');
    var videoPop = getElementsByClassName('g-pop shadow-mask')[0];
    var videoClose = $('v-close');
    var video = $('video');

    EventUtil.addHandler(videoClick, 'click', function () {
        videoPop.style.display  = 'block';
    });

    EventUtil.addHandler(videoClose, 'click', function () {
        videoPop.style.display  = 'none';
        video.pause();
    });
})();

/**
 * 获取产品设计和编程语言
 * 请求 http://study.163.com/webDev/couresByCategory.htm
 * pageNo 当前页码
 * psize 每页返回数据个数
 * type 10 产品设计 20 编程语言
 * http://study.163.com/webDev/couresByCategory.htm?pageNo=1&psize=20&type=10
 */
(function () {
    var courseWrap = $('course-wrap'); 
    var pdHTML = courseWrap.innerHTML;
    pdHTML = innerRealHTML(pdHTML);

    // 封装请求课程函数
    function getCourse(pageNoPra, typePra) {
        ajax({
            url: 'http://study.163.com/webDev/couresByCategory.htm',
            responseFuc: setCourse,
            query: {
                pageNo: pageNoPra,
                psize: 20,
                type: typePra
            }
        });
    
        function setCourse(responseText) {
            var courseObj = JSON.parse(responseText);

            var cate = '';
            // 确定课程分类
            if (typePra === 10) {
                cate = '产品设计';
            } else if (typePra === 20) {
                cate = '编程语言';
            }

            var result = templateEngine(pdHTML, {
                msg: courseObj.list,
                category: cate
            });
    
            courseWrap.innerHTML = result;
    
            // 实现课程详情
            // 所有课程绑定 mouseover 和 mouseleave
            var courses = getElementsByClassName('course-1');
            var hover = getElementsByClassName('course-hover');
            for (var i=0; i<courses.length; i++) {
                (function (i) {
                    EventUtil.addHandler(courses[i], 'mousemove', function () {
                        hover[i].style.display = 'block';
                    });
        
                    EventUtil.addHandler(hover[i], 'mouseout', function () {
                        hover[i].style.display = 'none';
                    });
                })(i);
            }
        }
    }

    // 进入首页默认请求
    getCourse(1, 10);

    // Tab 切换 10产品 20语言
    var curType = 10; // 默认处在产品设计位置
    var curPageIndex = 1; // 默认处在第1页
    var totalPage = 3; // 一共3页
    var proLan = getElementsByClassName('cl-pl clearfix')[0];
    var proDes = getElementsByClassName('cl-pd')[0];
    EventUtil.addHandler(proLan, 'click', function () {
        curType = 20;
        getCourse(1, curType);
        proLan.style.backgroundColor = '#39a030';
        proLan.style.color = '#fff';
        proDes.style.backgroundColor = '#fff';
        proDes.style.color = '#000';
    });

    EventUtil.addHandler(proDes, 'click', function () {
        curType = 10;
        getCourse(1, curType);
        proLan.style.backgroundColor = '#fff';
        proLan.style.color = '#000';
        proDes.style.backgroundColor = '#39a030';
        proDes.style.color = '#fff';
    });

    // 绑定翻页事件
    var last = getElementsByClassName('p-last')[0];
    var next = getElementsByClassName('p-next')[0];
    EventUtil.addHandler(last, 'click', function() {
        curPageIndex = curPageIndex - 1;
        if (curPageIndex <= 1) {
            curPageIndex = 1;   
        }
        getCourse(curPageIndex, curType);
    });

    EventUtil.addHandler(next, 'click', function() {
        curPageIndex = curPageIndex + 1;
        if (curPageIndex >= totalPage) {
            curPageIndex = totalPage;     
        }
        getCourse(curPageIndex, curType);
    });
})();

/**
 * 最热排行
 * 请求地址
 * http://study.163.com/webDev/hotcouresByCategory.htm
 */
(function () {
    var hotWrap = $('hot-wrap');
    var pdHTML = hotWrap.innerHTML;
    pdHTML = innerRealHTML(pdHTML);
    ajax({
        url: 'http://study.163.com/webDev/hotcouresByCategory.htm',
        responseFuc: function (responseText) {
            var courseObj = JSON.parse(responseText);
            var result = templateEngine(pdHTML, {
                msg: courseObj,
            });
            hotWrap.innerHTML = result;
        }
    });
})();

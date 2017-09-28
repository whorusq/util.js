/**

Description: 常用工具函数
Author: whoru.S.Q <whorusq at gmail.com>
Link: https://github.com/whorusq/util.js
Created: 2017-07-21 09:30:22
Version: 1.0

函数列表：

- util.date() 日期格式化
- util.strFormat() 字符串模板变量替换
- util.strCutting() 字符串截取显示
- util.count() 统计数组或对象元素个数
- util.forEach() 遍历数组或对象元素
- util.amountFormat() 转换金额格式（千分位分隔，默认保留2位小数）
- util.amountInWords() 转换大写金额（会计）
- util.handlePageBack() 监听、处理浏览器（PC、Android、iOS）单击“返回“按钮操作

*/


;(function(win) {

    'use strict';

    // 构造
    var Util = function() {
        this.version = '1.0';
        this.author = 'whoru.S.Q <whoru.sun@gmail.com>';
        this.link = 'https://github.com/whorusq/util.js';
        this.description = 'A common set of functions for Javascript';
    };
    Util.fn = Util.prototype;

    // 公用辅助
    var doc = document;


    Util.fn.log = {
        error: function(msg){
            win.console && console.error && console.error('Error: ' + msg);
        },
        warn: function(msg){
            win.console && console.warn && console.warn('Warn: ' + msg);
        },
        info: function(msg){
            win.console && console.info && console.info('Info: ' + msg);
        }
    };


    // 客户端浏览器设备参数
    Util.fn.browser = function() {

        var agent = navigator.userAgent.toLowerCase();

        var platform = 'windows';

        var browser = {
            type: 'IE',
            version: '8.0',
            desc: 'IE 8.0'
        };
        return {
            agent: agent,
            platform: platform, // 系统平台
            // browser: browser // 浏览器

        };
    }();

    /**
     * 获取一个随机整数
     *
     * @param  {integer} min 最小
     * @param  {integer} max 最大
     *
     * @uses
     *
     *      util.random(); // 1 到 100 之间的随机数
     *      util.random(5); // 一个 5 位的随机数
     *      util.random(10, 50); // 10 到 50 之间的随机数
     *
     * @return {integer}
     */
    Util.fn.random = function(min, max) {
        var min = min || 1,
            max  =max || 100;
        if (arguments.length == 1) {
            min = Math.pow(10, parseInt(arguments[0]) - 1);
            max = Math.pow(10, parseInt(arguments[0])) - 1;
        }
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    /**
     * 生成 uuid
     *
     * @uses
     *
     *      util.uuid; // 返回如："41bd8697-1eec-44d6-f3dd-e32795e92088"
     *
     * @return {string}
     */
    Util.fn.uuid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var d = new Date().getTime();
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r&0x7|0x8)).toString(16);
        });
    }();

    // 数组操作
    // Util.fn.arrPush = function(arr, elem) {

    // };

    // Util.fn.arrMerge = function(arr, elem) {

    // };



    Util.fn.isNaN = function(param) {
        return param !== param ? true : false;
    };

    /**
     * 日期格式化
     * @param  {integer|string} dateString 待转换的【时间戳】或【日期时间格式原始字符串】
     * @param  {string} format     格式模板，默认 Y-M-D H:i:s --> 2017-07-02 13:24:01
     * @return {string} 格式化后的字符串 或 当前时间对应默认格式的字符串
     */
    Util.fn.date = function(dateString, format) {
        var _self = this;
        var dateString = dateString || (new Date()).toString();
        var format = format || 'Y-M-D H:i:s';

        // 参数异常检查
        if (typeof dateString === 'number') {
            dateString = parseInt(dateString * 1000); // 时间戳 秒 转 微秒
        }
        var oDate = new Date(dateString);
        if (oDate.toString() == 'Invalid Date' || oDate.getFullYear().toString() == '1970') {
            throw new TypeError('Invalid timestamp or date string format.');
        }

        // 格式转换
        var formatMapping = {
            'Y': oDate.getFullYear(),                        // 年 2017
            'y': oDate.getFullYear().toString().substr(2),   // 年 17
            'M': fillZero(parseInt(oDate.getMonth()) + 1),   // 月 07
            'm': parseInt(oDate.getMonth()) + 1,             // 月 7
            'D': fillZero(oDate.getDate()),                  // 日 02
            'd': oDate.getDate(),                            // 日 2
            'H': oDate.getHours(),                           // 时 24
            // 'h': oDate.getHours(),                           // 时 12
            'I': fillZero(oDate.getMinutes()),               // 分 01
            'i': oDate.getMinutes(),                         // 分 1
            'S': fillZero(oDate.getSeconds()),               // 秒 03
            's': oDate.getSeconds()                          // 秒 3
        };
        function fillZero(str) {
            var str = str.toString();
            return str.length == 1 ? '0' + str : str;
        }
        _self.forEach(formatMapping, function(f, v) {
            var re = new RegExp(f.toString());
            format = format.replace(re, v);
        });
        return format.toString();
    };

    /**
     * 字符串截取显示
     * https://tonghuashuo.github.io/blog/substr-and-substring.html（substr/substring区别）
     * @param  {string} str    待截取的字符串
     * @param  {integer} length 截取（显示）长度
     * @param  {boolean} apost  是否显示末尾省略号，false|其它
     * @return {}
     */
    Util.fn.strCutting = function(str, length, apost) {
        if (str) {
            if (typeof str !== 'string') {
                throw new TypeError('Format string required');
            }
            var finalStr = str.substr(0, length);
            if (typeof apost === 'undefined' || typeof apost !== 'boolean') {
                apost = true; // 默认显示尾部省略号
            }
            return (str.length > length && apost) ? finalStr + '...' : finalStr;
        } else {
            return '';
        }
    };

    /**
     * 类似 ES6 中的模板对象，但是增强支持键值对形式赋值
     * @param  {string} str 待处理的字符串
     * @param  {mixed} km  要替换的值：val1,val2... 或 {n1: val1, n2: val2,...}
     * @return {}
     */
    Util.fn.strFormat = function(str, km) {
        var str = str || '',
            km = km || '',
            _self = this;
        if (str && km) {
            if (typeof km === 'object') {
                _self.forEach(km, function(key, item) {
                    var re = new RegExp('\\{' + key + '\\}', 'ig');
                    str = str.replace(re, item);
                });
                return str;
            } else {
                for (var i = 1; i < arguments.length; i++) {
                    var re = new RegExp('\\{' + (i - 1) + '\\}', 'ig');
                    str = str.replace(re, arguments[i]);
                }
                return str;
            }
        } else {
            return str;
        }
    };

    /**
     * 计算数组或对象元素个数
     * @param  {array|object} n
     * @return {}
     */
    Util.fn.count = function(n) {
        var type = typeof n;
        if (type !== 'array' && type !== 'object') {
            throw new TypeError('Only Array or Object is supported.');
        }
        if (type === 'object') {
            var num = 0;
            for (var i in n) {
                num++;
            }
            return num;
        } else {
            return n.length;
        }
    };

    /**
     * 遍历数组或字符串元素
     * @param  {array|object}   t
     * @param  {Function} fn 回调函数
     * @uses
     *
     *     util.forEach(array|object, function(i,item){ });
     *
     * @return {}
     */
    Util.fn.forEach = function(t, fn) {

        var type = typeof t;
        if (type !== 'array' && type !== 'object') {
            throw new TypeError('Only Array or Object is supported.');
        }

        var _self = this;
        if (type === 'array') {
            var i = 0;
            while (i < _self.count(t)) {
                if (i in t) {
                    fn.call(_self, i, t[i]);
                }
                i++;
            }
        } else {
            for (var key in t) {
                if (t.hasOwnProperty(key)) {
                    fn.call(_self, key, t[key]);
                }
            }
        }
    };

    /**
     * 金额转换，千分位分隔，保留 n 位小数
     * @return {}
     */
    Util.fn.amountFormat = function(n, accuracy) {

        var sign = n < 0 ? '-' : ''; // 取出正负号
        var accuracy = accuracy || 2; // 默认保留2位小数

        var fTmp = parseFloat(n); // 临时变量
        var fTmp = isNaN(fTmp) ? 0 : Math.abs(fTmp);
        var iInt = parseInt(fTmp); // 分离整数部分
        var iFra = parseInt((fTmp - iInt) * Math.pow(10, accuracy) + 0.5); // 分离小数部分(四舍五入)
        var funZero = function(iInt, iLen) {
            var sTmp = iInt.toString();
            var sBuf = new Array();
            for (var i = 0, iLoop = iLen - sTmp.length; i < iLoop; i++) {
                sBuf.push('0');
            }
            sBuf.push(sTmp);
            return sBuf.join('');
        };

        // 处理整数部分
        var aBuf = new Array();
        do {
            aBuf.unshift(funZero(iInt % 1000, 3));
        } while((iInt = parseInt(iInt/1000)));
        aBuf[0] = aBuf[0].replace(/^0{1,}/, ''); // 去除前导 0
        if (aBuf.length == 1 && aBuf[0] == '') {
            aBuf[0] = '0'; // 避免 .34 ，前补 0，最终显示 0.34
        }

        // 处理小数部分
        var iFraFinal = '';
        if (0 === iFra) {
            iFraFinal = new Array(accuracy + 1).join('0');
        } else {
            iFraFinal = funZero(iFra, accuracy);
        }

        return sign + aBuf.join(',') +'.'+ iFraFinal;
    };

    /**
     * xx转大写金额（会计），精确到小数点后 3 位
     * @param  {integer|float} n
     * @return {}
     */
    Util.fn.amountInWords = function(n) {

        var fraction = ['角', '分', ' '],
            digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'],
            unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];

        // 记录正负号
        var head = n < 0? '欠': '';
        n = Math.abs(n);

        // 角分x处理
        var s = '';
        for (var i = 0; i < fraction.length; i++) {
            var tmp = parseFloat(n * 10 * Math.pow(10, i)).toFixed(3).replace(/0+$/, '');
            s += (digit[Math.floor(tmp) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';

        //
        n = Math.floor(n);
        for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s;
        }
        return head +
            s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    };

    /**
     * 监听、处理单击“返回“按钮操作
     * @param  {string|function} oArg 返回的地址；或单击返回时，一个处理函数
     * @uses
     *
     *      // 直接传要返回的地址
     *      util.handlePageBack('{: U("Demo/page1")}');
     *
     *      // 传递一个函数，做更多处理
     *      util.handlePageBack(function() {
     *
     *      });
     *
     * @return {}
     */
    Util.fn.handlePageBack = function(oArg) {

        // 参数检查
        var sArgType = typeof oArg;
        if (sArgType != 'string' && sArgType != 'function') {
            throw 'parameter type, string or function is needed.';
            return false;
        }

        var bool = false;
        var pushHistory = function() {
            var state = {
                title: 'title',
                url: '#'
            };
            window.history.pushState(state, 'title', '#');
        };

        pushHistory();
        setTimeout(function(){
            bool = true;
        }, 1500);
        window.addEventListener('popstate', function(e) {
            if (bool) {
                if (sArgType == 'string') {
                    location.href = oArg;
                } else {
                    oArg();
                }
                // alert('返回 page0');//根据自己的需求实现自己的功能
                // location.href = '{: U("Demo/page0")}';
            }
            pushHistory();
        }, false);
    };

    //
    if (!(typeof util === 'undefined' && (win.util = new Util))) {
        win.utools = new Util();
        log.warn('`util` had used, please use `utools` instead.');
    }

}(window));
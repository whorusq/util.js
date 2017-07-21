/**
 *
 *
 *
 *
 */

;(function(win) {

    'use strict';

    // 构造
    var Util = function() {
        this.version = '1.0';
        this.author = 'whoru.S.Q <whoru.sun@gmail.com>';
        this.link = '';
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


    // 金额转换
    // 保留小数、四舍五入、千分位分隔符、金额转大写
    // 日期格式化
    // 字符串截取
    //

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



    //
    if (!(typeof util === 'undefined' && (win.util = new Util))) {
        win.utools = new Util();
        log.warn('`util` had used, please use `utools` instead.');
    }

}(window));
import { Injectable }    from '@angular/core';

@Injectable()
export class CookieUtils {
    private domain: string;
    private topDomain: string;

    constructor() {
        let domain = document.domain;
        let domainNameList = domain.match(/\.([^\.])+\.([^\.])+$/g);
        let ipList = domain.match(/[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}$/g);
        let cookieDomain = '';

        if (!ipList && domainNameList && domainNameList.length > 0) {
            domain = domainNameList[0].substr(1);

            // test domain( 防止 com.cn  edu.cn 这种根域名)
            cookieDomain = domain;
            this.setCookie('wiz_test_domain', '1', {expires: 0, domain: cookieDomain, path: ''});
            if (!this.setCookie('wiz_test_domain')) {
                domainNameList = document.domain.match(/\.([^\.])+\.([^\.])+\.([^\.])+$/g);
                if (domainNameList) {
                    domain = domainNameList[0].substr(1);
                } else {
                    domain = document.domain;
                }
            }
            this.setCookie('wiz_test_domain', null, {expires: 0, domain: cookieDomain, path: ''});
        }
        this.topDomain = domain;
    }

    public get(key: string): any {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let item of cookies) {
                item = item.trim();
                // Does this cookie string begin with the name we want?
                if (item.substring(0, key.length + 1) === (key + '=')) {
                    cookieValue = decodeURIComponent(item.substring(key.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    public put(key, value = '', options = null): any {
        this.setCookie(key, value, options);
    }
    public remove(key, options = null): any {
        this.setCookie(key, null, options);
    }

    public getOptions(expires: number): Object {
        return {
            expires: expires ? expires : 0,
            domain: this.topDomain,
            path: '/'
        };
    }

    /**
     * 获取 主域名
     * @returns {string}
     */
    public getTopDomain(): string {
        return this.topDomain;
    }

    private setCookie(name, value = '', options = null): any {
        /**
         * Cookie plugin
         *
         * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
         * Dual licensed under the MIT and GPL licenses:
         * http://www.opensource.org/licenses/mit-license.php
         * http://www.gnu.org/licenses/gpl.html
         *
         */
            options = options || {};
            if (value === null) {
                value = '';
                options = this._clone(options);
                options.expires = -1;
            }
            let expires = '';
            if (options.expires &&
                (typeof options.expires === 'number' || options.expires.toUTCString)) {
                let date;
                if (typeof options.expires === 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
                // use expires attribute, max-age is not supported by IE
            }
            // NOTE Needed to parenthesize options.path and options.domain
            // in the following expressions, otherwise they evaluate to undefined
            // in the packed version for some reason...
            let path = options.path ? '; path=' + (options.path) : '';
            let domain = options.domain ? '; domain=' + (options.domain) : '';
            let secure = options.secure ? '; secure' : '';
            let host = location.host.replace(/:.*/, '');
            let domainList = ['', host];
            let tmpDomain;
            if (options.expires !== -1) {
                // set cookie 时先删除旧 cookie，避免不同域的同名 cookie
                this.remove(name, options);
                // set cookie
                document.cookie = [name, '=', encodeURIComponent(value),
                    expires, path, domain, secure].join('');
            } else {
                // clear cookie
                // 避免 cookie 异常，必须要把所有 domain的 cookie 都清除
                tmpDomain = host.split('.');
                while (tmpDomain.length) {
                    tmpDomain.shift();
                    domainList.push('.' + tmpDomain.join('.'));
                }
                while (domainList.length) {
                    domain = domainList[0] ? '; domain=' + (domainList[0]) : '';
                    document.cookie = [name, '=', encodeURIComponent(value),
                        expires, path, domain, secure].join('');
                    domainList.shift();
                }
            }
    }

    private _clone(object: Object) {
        // simple object clone
        return JSON.parse(JSON.stringify( object ));
    }
}

/**
 * Created by Administrator on 2017/5/22.
 */

var utils = {
  getParams: function (url, name) {
    url = url || location.href
    var f = url.match(RegExp('(^|&|\\?|#)(' + name + ')=([^&#]*)(&|$|#)', ''))
    return f ? f[3] : null
  },
  getCookie: function (name) {
    var reg = new RegExp('(^| )' + name + '(?:=([^;]*))?(;|$)')
    var val = document.cookie.match(reg)
    return val ? (val[2] ? unescape(val[2]) : '') : null
  },
  setCookie: function (name, value, expires, path, domain, secure) {
    var today = new Date()
    today.setTime(today.getTime())
    if (expires) {
      expires = expires * 1000 * 60 * 60 * 24
    }
    var expiresDate = new Date(today.getTime() + (expires))
    document.cookie = name + '=' + escape(value) +
      ((expires) ? ';expires=' + expiresDate.toGMTString() : '') + // expires.toGMTString()
      ((path) ? ';path=' + path : '') +
      ((domain) ? ';domain=' + domain : '') +
      ((secure) ? ';secure' : '')
  },
  formatNumber: function (num, precision) {
    if (!isNaN(num)) {
      var s = parseFloat(num).toFixed(precision)
      var sign = s < 0 ? '-' : ''

      s = Math.abs(s)
      s = s.toString().replace(/^(\d*)$/, '$1.')
      s = (s + '00').replace(/(\d*\.\d\d)\d*/, '$1')
      s = s.replace('.', ',')

      var re = /(\d)(\d{3},)/
      while (re.test(s)) {
        s = s.replace(re, '$1,$2')
      }

      s = s.replace(/,(\d\d)$/, '.$1')

      return sign + s
    }
    return num
  },
  formatDecimal: function (value, precision) {
    if (value == undefined) {
      return '--'
    }
    return this.formatNumber(value, precision || 2)
  },
  formatInt: function (value) {
    if (value == undefined) {
      return '--'
    }
    var data = this.formatNumber(value, 0)
    return data ? data.replace(/\.\d\d/, '') : ''
  },
  formatRate: function (value, precision) {
    if (value == undefined) {
      return '--'
    }
    return this.formatNumber(value, precision || 2) + '%'
  }
}
export default utils

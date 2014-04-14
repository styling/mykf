//声明TongBao空间 还有版本号
var T, TongBao = T = TongBao || {
		version: "1.5.2.2"
	};
//guid 
TongBao.guid = "$TONGBAO$";
//TongBao.guid || {global : {}} TongBao.$$引用
TongBao.$$ = window[TongBao.guid] = window[TongBao.guid] || {
	global: {}
};
//TongBao.dom空间
TongBao.dom = TongBao.domg || {};
//id选择器
TongBao.dom.g = function(a) {
	return document.getElementById(a)
};
//TongBao.string 空间
TongBao.string = TongBao.string || {};
//声明trim方法
(function() {
	var a = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
	TongBao.string.trim = function(b) {
		return String(b).replace(a, "")
	}
})();

//将& <  > ; "" 转义
TongBao.string.encodeHTML = function(a) {
	return String(a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
};

//将 object对象格式化成 string
TongBao.string.format = function(c, a) {
	c = String(c);
	var b = Array.prototype.slice.call(arguments, 1),
		d = Object.prototype.toString;
	if (b.length) {
		b = b.length == 1 ? (a !== null && (/\[object Array\]|\[object Object\]/.test(d.call(a))) ? a : b) : b;
		return c.replace(/#\{(.+?)\}/g, function(e, g) {
			var f = b[g];
			if ("[object Function]" == d.call(f)) {
				f = f(g)
			}
			return ("undefined" == typeof f ? "" : f)
		})
	}
	return c
};
//number空间
TongBao.number = TongBao.number || {};
//用于转换time格式  2014-04-10
TongBao.number.pad = function(d, c) {
	var e = "",
		b = (d < 0),
		a = String(Math.abs(d));
	if (a.length < c) {
		e = (new Array(c - a.length + 1)).join("0")
	}
	return (b ? "-" : "") + e + a
};
//data空间
TongBao.date = TongBao.data || {};
//时间格式化操作
TongBao.date.format = function(a, f) {
	if ("string" != typeof f) {
		return a.toString()
	}

	function d(l, k) {
		f = f.replace(l, k)
	}
	var b = TongBao.number.pad,
		g = a.getFullYear(),
		e = a.getMonth() + 1,
		j = a.getDate(),
		h = a.getHours(),
		c = a.getMinutes(),
		i = a.getSeconds();
	d(/yyyy/g, b(g, 4));
	d(/yy/g, b(parseInt(g.toString().slice(2), 10), 2));
	d(/MM/g, b(e, 2));
	d(/M/g, e);
	d(/dd/g, b(j, 2));
	d(/d/g, j);
	d(/HH/g, b(h, 2));
	d(/H/g, h);
	d(/hh/g, b(h % 12, 2));
	d(/h/g, h % 12);
	d(/mm/g, b(c, 2));
	d(/m/g, c);
	d(/ss/g, b(i, 2));
	d(/s/g, i);
	return f
};
//json空间
TongBao.json = TongBao.json || {};
//返回 (a)结构
TongBao.json.parse = function(a) {
	return (new Function("return (" + a + ")"))()
};
//字符串化对象
TongBao.json.stringify = function(a) {
	return JSON ? JSON.stringify(a) : ""
};
//object空间
TongBao.object = TongBao.object || {};
//继承方法
TongBao.object.extend = function(c, b) {
	for (var a in b) {
		if (b.hasOwnProperty(a)) {
			c[a] = b[a]
		}
	}
	return c
};
//组件空间
TongBao.fn = TongBao.fn || {};
//组件blank 方法
TongBao.fn.blank = function() {};
//ajax空间
TongBao.ajax = TongBao.ajax || {};
//ajax 方法
TongBao.ajax.request = function(f, j) {
	var d = j || {}, q = d.data || "",
		g = !(d.async === false),
		e = d.username || "",
		a = d.password || "",
		c = (d.method || "GET").toUpperCase(),
		b = d.headers || {}, i = d.timeout || 0,
		k = {}, n, r, h;

	function m() {
		if (h.readyState == 4) {
			try {
				var t = h.status
			} catch (s) {
				p("failure");
				return
			}
			p(t);
			if ((t >= 200 && t < 300) || t == 304 || t == 1223) {
				p("success")
			} else {
				p("failure")
			}
			window.setTimeout(function() {
				h.onreadystatechange = TongBao.fn.blank;
				if (g) {
					h = null
				}
			}, 0)
		}
	}

	//创建ajax对象
	function l() {
		if (window.ActiveXObject) {
			try {
				return new ActiveXObject("Msxml2.XMLHTTP")
			} catch (s) {
				try {
					return new ActiveXObject("Microsoft.XMLHTTP")
				} catch (s) {}
			}
		}
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest()
		}
	}

	//回调function
	function p(u) {
		u = "on" + u;
		var t = k[u],
			v = TongBao.ajax[u];
		if (t) {
			if (n) {
				clearTimeout(n)
			}
			if (u != "onsuccess") {
				t(h)
			} else {
				try {
					h.responseText
				} catch (s) {
					return t(h)
				}
				t(h, h.responseText)
			}
		} else {
			if (v) {
				if (u == "onsuccess") {
					return
				}
				v(h)
			}
		}
	}
	for (r in d) {
		k[r] = d[r]
	}
	if (f.indexOf("http") != 0) {
		b["X-Requested-With"] = "XMLHttpRequest"
	}
	try {
		h = l();
		if (c == "GET") {
			if (q) {
				f += (f.indexOf("?") >= 0 ? "&" : "?") + q;
				q = null
			}
			if (d.noCache) {
				f += (f.indexOf("?") >= 0 ? "&" : "?") + "b" + (+new Date) + "=1"
			}
		}
		if (e) {
			h.open(c, f, g, e, a)
		} else {
			h.open(c, f, g)
		} if (g) {
			h.onreadystatechange = m
		}
		if (c == "POST") {
			b["Content-Type"] = b["Content-Type"] || "application/x-www-form-urlencoded";
			h.setRequestHeader("Content-Type", (b["Content-Type"]));
			delete b["Content-Type"]
		}
		for (r in b) {
			if (b.hasOwnProperty(r)) {
				h.setRequestHeader(r, b[r])
			}
		}
		p("beforerequest");
		if (i) {
			n = setTimeout(function() {
				h.onreadystatechange = TongBao.fn.blank;
				h.abort();
				p("timeout")
			}, i)
		}
		h.send(q);
		if (!g) {
			m()
		}
	} catch (o) {
		p("failure")
	}
	return h
};
//get 方法
TongBao.ajax.get = function(b, a) {
	return TongBao.ajax.request(b, {
		onsuccess: a
	})
};
//post方法
TongBao.ajax.post = function(b, c, a) {
	return TongBao.ajax.request(b, {
		onsuccess: a,
		method: "POST",
		data: c
	})
};
//url地址空间
TongBao.url = TongBao.url || {};
//将传入的对象 转成键值对字符串
TongBao.url.jsonToQuery = function(e) {
	var c, d, b = [],
		a;
	for (c in e) {
		d = e[c];
		if (Object.prototype.toString.call(d) == "[object Array]") {
			a = d.length;
			while (a--) {
				b.push(c + "=" + encodeURIComponent(d[a]))
			}
		} else {
			b.push(c + "=" + encodeURIComponent(d))
		}
	}
	return b.join("&")
};
//jsonToQuery 反向操作
TongBao.url.queryToJson = function(f) {
	var c, d, b = {}, a, e;
	f = f.split("&");
	if (f.length <= 0) {
		return b
	}
	for (c = 0; d = f[c]; c++) {
		d = d.split("=");
		a = d[0];
		e = decodeURIComponent(d[1]);
		if (typeof b[a] == "undefined") {
			b[a] = e
		} else {
			if (TongBao.lang.isArray(b[a])) {
				b[a].push(e)
			} else {
				b[a] = [b[a], e]
			}
		}
	}
	return b
};
//cookie对象
TongBao.cookie = TongBao.cookie || {};
//判断存在指定名称cookie
TongBao.cookie._isValidKey = function(a) {
	return (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24')).test(a)
};
//获得指定cookie
TongBao.cookie.getRaw = function(b) {
	if (TongBao.cookie._isValidKey(b)) {
		var c = new RegExp("(^| )" + b + "=([^;]*)(;|\x24)"),
			a = c.exec(document.cookie);
		if (a) {
			return a[2] || null
		}
	}
	return null
};
//获得指定cookie
TongBao.cookie.get = function(a) {
	var b = TongBao.cookie.getRaw(a);
	if ("string" == typeof b) {
		b = decodeURIComponent(b);
		return b
	}
	return null
};
//设置cookie操作
TongBao.cookie.setRaw = function(c, d, b) {
	if (!TongBao.cookie._isValidKey(c)) {
		return
	}
	b = b || {};
	var a = b.expires;
	if ("number" == typeof b.expires) {
		a = new Date();
		a.setTime(a.getTime() + b.expires)
	}
	document.cookie = c + "=" + d + (b.path ? "; path=" + b.path : "") + (a ? "; expires=" + a.toGMTString() : "") + (b.domain ? "; domain=" + b.domain : "") + (b.secure ? "; secure" : "")
};
//cookie移除
TongBao.cookie.remove = function(b, a) {
	a = a || {};
	a.expires = new Date(0);
	TongBao.cookie.setRaw(b, "", a)
};
//设置cookie操作
TongBao.cookie.set = function(b, c, a) {
	TongBao.cookie.setRaw(b, encodeURIComponent(c), a)
};
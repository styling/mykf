TB.define("TB.im.message", function(h) {
	var c = TB.im.config,
		b = TB.im.lang,
		f = c.face,
		l = TongBao.string.encodeHTML,
		i = {
			face: {
				replacer: function(n) {
					n = n.replace(/\(([^)]+)\)/g, function(p, o) {
						var q = "(" + o + ")";
						if (f[o]) {
							q = "\x0f\x0eface " + o + "\x0f"
						}
						return q
					});
					return n
				},
				parse: function(o) {
					var n = {};
					n.xml = '<face n="' + o + '"/>';
					n.json = '{"type":"face","n":"' + o + '"}';
					return n
				}
			}
		}, j = {
			text: function(o) {
				var n = l(o.c);
				return n.replace(/\r\n/gi, "<br/>").replace(/&amp;#xD;&amp;#xA;/gi, "<br/>").replace(/%2B/gi, "+")
			},
			url: function(o) {
				var n = "";
				if (!/^https?:\/\//.test(o.ref)) {
					n = "http://"
				}
				return '<a href="' + n + o.ref + '" target="_blank">' + o.c + "</a>"
			},
			html: function(n) {
				return d(n.c)
			},
			face: function(o) {
				var n = f[o.n];
				if (n) {
					return '<img src="' + c.FACE_ROOT + n + '.gif" />'
				} else {
					return b.TEXT.FACE_UNSUPPORT
				}
			},
			img: function(n) {
				return b.TEXT.IMG_UNSUPPORT
			},
			cface: function(n) {
				return b.TEXT.CFACE_UNSUPPORT
			}
		};
	var e = {
		address: 1,
		blockquote: 1,
		center: 1,
		dir: 1,
		div: 1,
		dl: 1,
		fieldset: 1,
		form: 1,
		h1: 1,
		h2: 1,
		h3: 1,
		h4: 1,
		h5: 1,
		h6: 1,
		hr: 1,
		isindex: 1,
		menu: 1,
		noframes: 1,
		ol: 1,
		p: 1,
		pre: 1,
		table: 1,
		ul: 1
	};
	var m = "\u200B";

	function d(p) {
		var o = new RegExp(m, "g"),
			n = p.replace(/[\n\r]/g, "");
		n = n.replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, "\n").replace(/<br\/?>/gi, "\n").replace(/<[^>/]+>/g, "").replace(/(\n)?<\/([^>]+)>/g, function(r, q, s) {
			return e[s.toLowerCase()] ? "\n" : q ? q : ""
		}).replace(/<[^>]+>/g, "").replace(/(\n)+/g, "<br />");
		return n.replace(o, "").replace(/\u00a0/g, " ").replace(/&nbsp;/g, " ")
	}

	function a(n) {
		if (!/^\#[\da-f]{6}$/i.test(n)) {
			return 0
		}
		n = n.substr(5) + n.substr(3, 2) + n.substr(1, 2);
		return parseInt(n, 16)
	}

	function k(q) {
		var o = ["<font"],
			p = [],
			n;
		q = q || {};
		q.fontFamily = q.fontFamily ? q.fontFamily.replace(/^"|"$/g, "") : "";
		o.push(' n="' + (q.fontFamily ? q.fontFamily : "simsun") + '"');
		o.push(' s="' + (q.fontSize ? q.fontSize.replace(/\D/g, "") : "10") + '"');
		n = q.color;
		o.push(' c="' + (n ? a(n) : "0") + '"');
		o.push(' b="' + (q.fontWeight == "bold" || q.fontWeight == "700" ? 1 : 0) + '"');
		o.push(' i="' + (q.fontStyle == "italic" ? 1 : 0) + '"');
		o.push(' ul="' + (q.textDecoration == "underline" ? 1 : 0) + '"');
		o.push("/>");
		p.push('{"type":"font",');
		p.push('"n":"' + (q.fontFamily ? q.fontFamily : "simsun") + '",');
		p.push('"s":"' + (q.fontSize ? q.fontSize.replace(/\D/g, "") : "10") + '",');
		p.push('"c":"' + (n ? a(n) : "0") + '",');
		p.push('"b":"' + (q.fontWeight == "bold" || q.fontWeight == "700" ? 1 : 0) + '",');
		p.push('"i":"' + (q.fontStyle == "italic" ? 1 : 0) + '",');
		p.push('"ul":"' + (q.textDecoration == "underline" ? 1 : 0) + '"');
		p.push("}");
		return {
			xml: o.join(""),
			json: p.join("")
		}
	}

	function g(r, n) {
		var p, q, o = {};
		for (p = 0; q = n[p]; p++) {
			q = i[q];
			if (q) {
				r = q.replacer(r)
			}
		}
		o.json = r.replace(/(^|\x0f)([^\x0f\x0e]+)(\x0f|$)/mg, '$1{"type":"text", "c":"$2"},$3');
		o.xml = r.replace(/(^|\x0f)([^\x0f\x0e]+)(\x0f|$)/mg, '$1<text c="$2"/>$3');
		o.json = o.json.replace(/\x0f\x0e([^\x0f]+)\x0f/g, function(t, s) {
			var u;
			s = s.split(" ");
			u = i[s[0]];
			if (u) {
				return u.parse(s[1]).json + ","
			}
		});
		o.xml = o.xml.replace(/\x0f\x0e([^\x0f]+)\x0f/g, function(t, s) {
			var u;
			s = s.split(" ");
			u = i[s[0]];
			if (u) {
				return u.parse(s[1]).xml
			}
		});
		o.json = o.json.replace(/,\s*$/, "");
		return o
	}
	h.parseText = function(r) {
		var p = [],
			n = [],
			q;
		q = k();
		n.push(q.xml);
		p.push(q.json);
		q = g(r, ["face"]);
		n.push(q.xml);
		p.push(q.json);
		return {
			xml: "<msg>" + n.join("") + "</msg>",
			json: "[" + p.join(",") + "]"
		}
	};
	h.parseMessage = function(r) {
		var o = [],
			n, q, p;
		for (n = 0; q = r[n]; n++) {
			p = j[q.type];
			if (p) {
				o.push(p(q))
			}
		}
		return o.join("")
	}
});

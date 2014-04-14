TB.define("TB.stat", function(h) {
	var d = {
		siteId: "",
		mainId: ""
	};
	var n = {
		mainId: "",
		subId: "",
		sessionId: "",
		eventId: "",
		chatId: "",
		from: "",
		open: "",
		valid: "",
		count: ""
	};
	var p = "http://hm.tongbao.com/hm.gif";
	var m = 0;
	var c = "&nv=0&st=4&v=bridge-0.2&rnd=";
	var k = {};
	var q = {
		REFRESH_IM: 1,
		SEND_INVITE: 3,
		ACCEPT_INVITE: 4,
		SEND_MESS: 5,
		VISITOR_IM: 6,
		SERVER_IM: 7,
		START_IM: 0
	};
	var b = ["subId", "sessionId", "eventId", "chatId", "from", "open", "valid", "count"];
	var i = {
		visitor_count: 0
	};

	function l() {
		return Math.floor(Math.random() * 10000000000)
	}

	function g(t) {
		var r = new Image();
		var s = p + "?" + t;
		r.onload = r.onerror = function() {
			r = null
		};
		r.src = s
	}

	function j(t, r) {
		for (var s in t) {
			if (t.hasOwnProperty(s)) {
				r[s] && (t[s] = r[s])
			}
		}
	}

	function a(r) {
		var s = "si=" + d.siteId + "&et=99&ep=" + d.mainId;
		s = s + e(r);
		s = s + c + l();
		g(s)
	}

	function e(s) {
		var u;
		var v;
		var t = "";
		var r = b.length;
		for (u = 0; u < r; u++) {
			v = b[u];
			t += s[v] === "" ? ("*" + m) : ("*" + s[v])
		}
		return t
	}

	function o(r) {
		if (i.visitor_count) {
			j(n, r);
			n.eventId = q.VISITOR_IM;
			n.count = i.visitor_count;
			n.valid = 1;
			a(n);
			i.visitor_count = 0;
			n.valid = 0
		}
	}

	function f(r) {
		if (!r.chatId) {
			i.visitor_count += r.count
		} else {
			j(n, r);
			n.eventId = q.VISITOR_IM;
			n.valid = 1;
			a(n);
			i.visitor_count = 0;
			n.valid = 0
		}
	}
	return function(t, s, r) {
		if (!t) {
			return
		}
		d.siteId = d.siteId || s.siteId || 0;
		d.mainId = d.mainId || s.mainId || 0;
		t = t.toUpperCase();
		switch (t) {
			case "VISITOR_IM":
				f(r);
				break;
			case "START_IM":
				o(r);
				break;
			default:
				j(n, r);
				n.eventId = q[t];
				a(n)
		}
	}
});
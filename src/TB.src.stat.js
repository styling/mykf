TB.define("TB.src.stat", function(e) {
	var f = TB.stat;
	var h = TB.im;
	var j = {
		from: 0,
		open: 3,
		count: 1
	};
	var a = {
		siteId: "",
		mainId: "",
		bid: ""
	};
	var g;

	function c() {
		j.chatId = "";
		clearInterval(g)
	}

	function b() {
		g = window.setInterval(function() {
			f("REFRESH_IM", a, j)
		}, 10 * 60 * 1000)
	}

	function i(k) {
		j.subId = k.subid;
		j.chatId = k.chatid;
		j.bid = k.bid;
		j.sessionId = a.siteId + "_" + j.bid;
		!a.siteId && (a.siteId = k.siteidstr);
		!a.mainId && (a.mainId = k.mainid);
		f("START_IM", a, j);
		b()
	}

	function d(k) {
		j.subId = k.subid;
		j.chatId = k.chatid;
		j.bid = k.bid;
		!a.siteId && (a.siteId = k.siteidstr);
		!a.mainId && (a.mainId = k.mainid);
		j.sessionId = a.siteId + "_" + j.bid;
		b()
	}
	h.on("stat_visitor", function() {
		f("VISITOR_IM", a, j)
	});
	h.on("taskbegin", function(k) {
		i(k)
	});
	h.on("message", function() {
		if (!j.chatId) {
			return
		}
		f("SERVER_IM", a, j)
	});
	h.on("offline", function() {
		c()
	});
	h.on("transfer", function(k) {
		c()
	});
	h.on("error", function(k) {
		if (k.type == "kick") {
			c()
		}
	});
	h.on("revert", function(k) {
		d(k)
	});
	e.init = function(k) {
		a.siteId = k.siteidstr || 0;
		a.mainId = k.mainid || 0
	}
});
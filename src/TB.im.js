TB.define("TB.im", function(C) {
	var t = 1500;
	var h = TB.im.net,
		B = TB.im.message,
		D = TB.im.lang,
		y = window.localStorage,
		b = TongBao.json.parse,
		q = TongBao.json.stringify,
		i = TongBao.string.encodeHTML,
		d = {}, n = {}, j = {}, e = {
			bid: "",
			type: 3,
			subid: "",
			siteid: "",
			tid: 0,
			referrer: "",
			location: "",
			title: "",
			coding: "utf8",
			word: "",
			wordtype: "",
			wordid: "",
			bdclickid: "",
			from: "",
			userName: "",
			csName: D.TEXT.DEFAULT_CSNAME,
			initStatus: 0,
			lv: 0,
			lvp: 0,
			lc: 0,
			ls: "",
			previewTimer: null,
			csNameMap: {}
		}, f = {
			WAIT: "wait",
			DROP: "block"
		}, w = false,
		r = "BRIDGE_WEBIM_DATA_";

	function z() {
		var F = new Date().getTimezoneOffset();
		var E = parseInt(F / 60, 10);
		var H = F % 60;
		var G = "-";
		if (E < 0 || H < 0) {
			G = "+";
			E = -E;
			if (H < 0) {
				H = -H
			}
		}
		E = E + "";
		H = H + "";
		return "UTC" + G + E + ":" + H
	}

	function v() {
		var G = window.navigator;
		var E = window.screen;
		var F = {};
		F.lang = G.language || G.systemLanguage;
		F.rsl = E.width + "*" + E.height;
		F.tz = z();
		F.cbit = E.colorDepth;
		return F
	}

	function x(G, F) {
		var E;
		for (E in F) {
			if (F.hasOwnProperty(E)) {
				G[E] = F[E]
			}
		}
	}

	function k(F) {
		var G;
		try {
			G = b(y.getItem(r) || "{}")
		} catch (E) {
			G = {}
		}
		if (F) {
			return G[F]
		} else {
			return G
		}
	}

	function A(G, H) {
		var E = k();
		E[G] = H;
		try {
			try {
				y.setItem(r, q(E))
			} catch (I) {
				y.clear();
				y.setItem(r, q(E))
			}
		} catch (F) {}
	}

	function l() {
		var E = Array.prototype.slice.call(arguments),
			F = n[E[0]];
		if (F) {
			F.apply(null, E.slice(1))
		}
	}

	function o() {
		var E = Array.prototype.slice.call(arguments),
			F = j[E[0]];
		if (F) {
			F.apply(null, E.slice(1))
		}
	}

	function s(E) {
		var F;
		r += E.siteid || "";
		F = k();
		x(e, F);
		x(e, E || {});
		if (!e.bid) {
			e.bid = F.bid || ""
		}
		h.on("error", l);
		h.on("pick", o);
		h.on("stat_visitor", function() {
			C.fire("stat_visitor")
		})
	}

	function c(E, F) {
		switch (E) {
			case f.WAIT:
				u(F);
				e.initStatus = 1;
				if (F.autoResponse && F.autoResponse.length > 0) {
					C.fire("info", B.parseMessage(F.autoResponse))
				}
				break;
			case f.DROP:
				C.fire("error", {
					type: "kick",
					msg: D.ERROR.DROP_KICKED
				});
				p();
				break;
			default:
				g()
		}
	}

	function p() {
		A("pickInfo", {});
		h.stopPick();
		C.fire("stop")
	}

	function u(E) {
		if (E.subid) {
			e.subid = E.subid;
			if (!k("fs")) {
				A("fs", E.subid)
			}
			A("ls", E.subid)
		}
		if (e.csNameType == 2 && e.subid) {
			h.getClientName(e.subid, C.updateCSName)
		}
		e.tid = E.tid;
		h.pick(E.ack, E.seq);
		C.fire("init", {
			bid: e.bid
		});
		var F = e.lc || 0;
		A("lc", F + 1)
	}

	function g() {
		C.fire("error", {
			type: "init",
			msg: D.ERROR.INIT
		})
	}

	function m(F, J) {
		var H;
		if (e.csNameType == 0 || e.csNameType == 3) {
			H = "在线客服"
		} else {
			if (e.csNameMap[F]) {
				H = e.csNameMap[F]
			} else {
				var G = e.csNameType == 1 ? "默认分组" : "在线客服";
				var E = e.csNameType == 1 ? h.getGroupName : h.getClientName;
				var I = setTimeout(function() {
					I = null;
					e.csNameMap[F] = G;
					if (J) {
						J.call(null, G)
					}
				}, 3000);
				E(F, function(K) {
					K.data = K.data.replace(/^.*?:/, "");
					var L = e.csNameMap[F] = K.status ? G : K.data;
					if (I) {
						clearTimeout(I);
						if (J) {
							J.call(null, L)
						}
					}
				}, true);
				return
			}
		} if (H && J) {
			J.call(null, H)
		}
		return H
	}

	function a(E) {
		e.session = E.session;
		h.setSession(E.session);
		h.bridgeInit("type=" + e.type + "&chattype=1&sub=" + e.subid + "&username=" + encodeURIComponent(e.userName) + "&siteid=" + e.siteid + "&bridgetid=" + e.tid + "&fromsite=" + encodeURIComponent(e.referrer) + "&srcword=" + encodeURIComponent(e.word) + "&wordtype=" + e.wordtype + "&wordid=" + e.wordid + "&region=" + encodeURIComponent(e.from) + "&insite=" + encodeURIComponent(e.location) + "&title=" + encodeURIComponent(e.title) + "&imuss=" + e.bid, u, c)
	}
	n.conflict = function() {
		C.fire("error", {
			type: "conflict",
			msg: D.ERROR.CONFLICT
		})
	};
	n.sendFail = function(E) {
		var F = D.ERROR.SEND_FAIL;
		if (E) {
			F += "<br />“" + E + "“"
		}
		C.fire("error", {
			type: "sendfail",
			msg: F
		})
	};
	n.offline = function() {
		C.fire("error", {
			type: "offline",
			msg: D.ERROR.OFFLINE
		});
		p()
	};
	j.previewstart = function() {
		if (e.previewTimer) {
			clearInterval(e.previewTimer)
		}
		e.previewTimer = setInterval(function() {
			C.fire("sendpreview", function(E) {
				if (!E) {
					return
				}
				E = B.parseText(E).xml;
				h.sendPreview(E, {
					bid: e.bid,
					to: e.userName
				})
			})
		}, t)
	};
	j.previewend = function() {
		if (e.previewTimer) {
			clearInterval(e.previewTimer);
			e.previewTimer = null
		}
	};
	j.fileUnsupport = function() {
		C.fire("message", D.TEXT.FILE_UNSUPPORT, e.csName, new Date().getTime())
	};
	j.assigntask = function(E) {
		if (E.result) {
			e.tid = E.tid !== undefined ? E.tid : e.tid;
			e.subid = E.subid !== undefined ? E.subid : e.subid;
			if (!k("fs") && E.subid) {
				A("fs", E.subid)
			}
			A("ls", e.subid)
		}
		if (e.initStatus) {
			C.fire("info", D.TEXT.ONLINE.replace("#{0}", E.from || ""));
			if (e.csNameType == 2) {
				e.csName = E.from
			}
		}
	};
	j.taskbegin = function(E) {
		e.chatId = E.sessionid;
		e.subid = E.subid !== undefined ? E.subid : e.subid;
		if (!k("fs") && E.subid) {
			A("fs", E.subid)
		}
		A("ls", e.subid);
		var H = k("statInfo") || {};
		var G = e.siteidstr || H.si;
		var F = e.mainid || H.mID;
		A("statInfo", {
			cID: e.chatId,
			si: G,
			mID: F
		});
		C.fire("taskbegin", {
			subid: e.subid,
			chatid: e.chatId,
			bid: e.bid,
			mainid: F,
			siteidstr: G
		})
	};
	j.kick = function() {
		C.fire("error", {
			type: "kick",
			msg: D.ERROR.DROP_KICKED
		});
		p()
	};
	j.chatover = function() {
		C.fire("error", {
			type: "kick",
			msg: D.ERROR.DROP_CHATOVER
		});
		p()
	};
	j.offline = function() {
		C.fire("offline")
	};
	j.response = function(E) {
		var F = {
			time: new Date().getTime()
		};
		F.bid = E.bid;
		F.session = E.session;
		F.ack = E.ack;
		F.seq = E.seq;
		F.tid = e.tid;
		F.subid = e.subid;
		A("pickInfo", F)
	};
	j.transfer = function(E) {
		e.tid = E.new_tid;
		e.subid = E.new_subid;
		A("ls", e.subid);
		if (e.csNameType == 1) {
			h.getGroupName(e.tid, C.updateCSName)
		} else {
			if (e.csNameType == 2) {
				h.getClientName(e.subid, C.updateCSName)
			}
		}
		C.fire("transfer");
		C.fire("info", D.TEXT.TRANSFER)
	};
	j.message = function(E, F, G) {
		if (!F) {
			F = new Date().getTime()
		}
		m(G, function(H) {
			C.fire("message", B.parseMessage(E), H, F)
		})
	};
	j.input = function() {
		C.fire("input", D.TEXT.INPUT)
	};
	C.init = function(E) {
		var F, G;
		s(E);
		for (F in TB.im) {
			if (TB.im.hasOwnProperty(F)) {
				G = TB.im[F];
				if (Object.prototype.toString.call(G) == "[object Object]" && G.init) {
					G.init(e)
				}
			}
		}
	};
	C.sendText = function(E) {
		h.communicate(B.parseText(i(E)).xml, {
			tid: e.tid,
			to: e.userName
		}, E)
	};
	C.login = function() {
		w = false;
		h.enter("callback=TB.im.handleEnter&siteid=" + e.siteid + "&bid=" + e.bid + "&referrer=" + encodeURIComponent(e.referrer) + "&iswebim=1&word=" + encodeURIComponent(e.word) + "&coding=" + e.coding + "&bdclickid=" + e.bdclickid + "&title=" + encodeURIComponent(e.title) + "&inurl=" + encodeURIComponent(e.location) + "&vis_type=2&lv=" + (e.lv || "0") + "&lc=" + (e.lc || "0") + "&ls=" + (e.ls || "") + "&lvp=" + (e.lvp || "0") + "&ftime=" + (e.ft || "0") + "&fs=" + (e.fs || "") + "&ltime=" + (e.lt || "0") + "&" + TongBao.url.jsonToQuery(v()))
	};
	C.logout = function() {
		if (w) {
			return
		}
		h.leave();
		w = true
	};
	C.handleEnter = function(J) {
		x(e, J);
		h.setBid(e.bid);
		A("bid", e.bid);
		A("lt", J.ltime || 0);
		A("ft", J.ft || 0);
		A("lv", J.lv || 0);
		A("lvp", J.lvp || 0);
		var E = k("pickInfo");
		if (E && E.time) {
			var G = new Date().getTime();
			if (G - E.time <= 2 * 60 * 1000) {
				h.setBid(E.bid);
				h.setSession(E.session);
				e.subid = E.subid;
				u({
					tid: E.tid,
					ack: E.ack,
					seq: E.seq
				});
				j.previewstart();
				C.fire("info", D.TEXT.RECONNECT);
				var F = k("ls") || 0;
				var L = k("statInfo") || {};
				var H = L.cID;
				var I = L.mID;
				var K = L.si;
				C.fire("revert", {
					chatid: H,
					subid: F,
					bid: e.bid,
					mainid: I,
					siteidstr: K
				})
			} else {
				h.welcome("source=0&imuss=" + e.bid + "&anonym=true&clienttype=2", a, g);
				A("pickInfo", {})
			}
		} else {
			h.welcome("source=0&imuss=" + e.bid + "&anonym=true&clienttype=2", a, g)
		}
		h.rcvRefresh(function(M) {
			if (M.cstatus == 1 || M.cstatus == 4) {
				e.initStatus = 1
			} else {
				e.initStatus = 0
			}
		})
	};
	C.getData = function(E) {
		return e[E]
	};
	C.updateCSName = function(E) {
		if (!E || E.status === undefined || E.status) {
			e.csName = D.TEXT.DEFAULT_CSNAME
		} else {
			e.csName = E.data.replace(/.*?:/, "") || D.TEXT.DEFAULT_CSNAME
		}
	};
	C.on = function(F, G) {
		var E = d[F];
		if (!E) {
			E = d[F] = []
		}
		E.push(G)
	};
	C.fire = function() {
		var F = Array.prototype.slice.call(arguments),
			G, H, E;
		E = d[F[0]] || [];
		F = F.slice(1);
		for (G = 0; H = E[G]; G++) {
			H.apply(null, F)
		}
	}
});
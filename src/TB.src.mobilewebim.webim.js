TB.define("TB.src.mobilewebim.webim", function(X) {
	var K = TB.im,
		q = TongBao.dom.g,
		a = TongBao.string.trim,
		h = TongBao.string.format,
		U = TongBao.date.format,
		y = TongBao.json.parse,
		J = TongBao.json.stringify,
		R = TongBao.string.encodeHTML,
		s = TongBao.object.extend,
		I = window.localStorage,
		l = TongBao.cookie.get,
		Q = {}, f = {}, e = {
			msgList: []
		}, z, O = {
			firstSended: true
		}, A = ["您好。", "我的症状是", "能介绍一下吗？", "多少钱？", "哪位医生最好？", "怎么预约？", "你们的地址是哪里？", "谢谢。", "再见！"],
		i = K.config.face,
		E = K.config.FACE_ROOT,
		w = {
			msg: '<div class="msg msg-#{type}"><div class="msg-title"><em>#{time}</em>#{csName}</div><div class="msg-content">#{content}</div><div class="msg-cursor"></div></div>',
			info: '<div class="info info-#{type}"><span class="info-icon"></span>#{content}</div>',
			wordItem: '<li class="word-item" data-index="#{index}" data-log="word#{index}">#{content}</li>',
			faceItem: '<a class="face-item" data-key="#{key}"><img src="' + E + '#{md5}.gif" /></a>',
			custDesc: "<p>#{0}</p>",
			custTel: '<p><span class="tel"></span><a href="tel:#{tel}">#{telTxt}</a></p>'
		}, ab = "TB_MOBILE_WEBIM_",/*BRIDGE*/
		m = "TB_WEBIM_DATA_";
	blank = function() {}, modalEles = [], fireClickHandler = function(G, af, ag) {
		G.call(af, ag)
	};
	var M = {
		CUST_INFO: "http://localhost:8080/kf/enter.php?module=mobile&controller=mobileim&action=corporation"
	};
	var d = {
		from: 0,
		open: 3,
		count: 1
	};
	var P = {
		siteId: "",
		mainId: ""
	};

	function c(G) {
		G = R(G);
		G = G.replace(/\(([^)]+)\)/g, function(ag, af) {
			if (i[af]) {
				return '<img src="' + E + i[af] + '.gif" />'
			} else {
				return ag
			}
		});
		return G
	}

	function C(ag, G) {
		var af = ag.className.split(/\s+/)[0];
		ag.addEventListener("click", function(ah) {
			fireClickHandler(G, this, ah)
		}, false);
		ag.addEventListener("touchstart", function() {
			this.className += " " + af + "-active"
		}, false);
		ag.addEventListener("touchend", function(ah) {
			this.className = this.className.replace(new RegExp("\\s+" + af + "-active\\b", "g"), "");
			G.call(this, ah)
		}, false)
	}

	function ac(G) {
		b();
		G.style.display = "";
		modalEles.push(G)
	}

	function b() {
		for (var G = 0, af; af = modalEles[G]; G++) {
			af.style.display = "none";
			if (af.onhide) {
				af.onhide()
			}
		}
		modalEles = []
	}

	function j(G) {
		var af = i[G];
		if (af) {
			f.input.value += "(" + G + ")"
		}
	}

	function L(G) {
		var af = A[G];
		if (af) {
			f.input.value += af
		}
	}

	function B() {
		var G = this.getAttribute("data-key");
		j(G);
		o("click", {
			m: "face",
			v: G
		})
	}

	function N() {
		var G = this.getAttribute("data-index");
		L(G);
		o("click", {
			m: "word",
			v: G
		})
	}

	function n() {
		var af = q("bt-target");
		var G = "bt" + Math.floor(Math.random() * 1000);
		af.name = G;
		location.hash = G
	}

	function D(ag) {
		var af = 0;
		var G = ag.length;

		function ah() {
			if (af < G) {
				K.sendText(ag[af++]);
				setTimeout(ah, 500)
			}
		}
		ah()
	}

	function k() {
		var ag = false;

		function af() {
			if (!ag) {
				K.logout();
				ae();
				ag = true;
				o("logout", {
					time: new Date().getTime()
				})
			}
		}
		window.addEventListener("unload", af, false);
		window.addEventListener("beforeunload", af, false);
		window.addEventListener("offline", function() {
			if (!e.cachedMsg) {
				e.cachedMsg = []
			}
		});
		window.addEventListener("online", function() {
			if (e.cachedMsg) {
				D(e.cachedMsg);
				e.cachedMsg = null
			}
		});
		C(f.sendBtn, function() {
			if (f.sendBtn.disabled) {
				return
			}
			var aj = a(f.input.value);
			var ai = {
				type: "client",
				time: U(new Date(), "HH:mm:ss"),
				csName: "我"
			};
			if (aj === "") {
				f.input.value = "";
				return
			}
			ai.content = c(aj);
			if (O.firstSended) {
				aj += "【访客正在通过手机沟通】";
				O.firstSended = false
			}
			if (e.cachedMsg) {
				e.cachedMsg.push(aj)
			} else {
				K.sendText(aj);
				o("sendmsg")
			}
			f.input.value = "";
			f.input.blur();
			ad(ai)
		});
		C(f.faceBtn, function(ai) {
			if (this.className.indexOf("btn-actived") >= 0) {
				return
			}
			this.className += " btn-actived";
			ac(f.faceLayer);
			ai.stopPropagation()
		});
		C(f.wordBtn, function(ai) {
			if (this.className.indexOf("btn-actived") >= 0) {
				return
			}
			this.className += " btn-actived";
			ac(f.wordList);
			ai.stopPropagation()
		});
		f.faceLayer.onhide = function() {
			f.faceBtn.className = f.faceBtn.className.replace(/\s+btn-actived\b/g, "")
		};
		S();
		f.wordList.onhide = function() {
			f.wordBtn.className = f.wordBtn.className.replace(/\s+btn-actived\b/g, "")
		};
		K.on("message", function(aj, am, al) {
			var ak = {
				type: "server",
				csName: am
			}, ai = new Date();
			ai.setTime(al);
			ak.time = U(ai, "HH:mm:ss");
			ak.content = aj;
			ad(ak)
		});
		K.on("error", function(ai) {
			if (ai.msg) {
				ad({
					type: "error",
					content: ai.msg
				})
			}
		});
		K.on("info", function(ai) {
			ad({
				type: "info",
				content: ai
			})
		});
		K.on("input", function(ai) {
			p(ai)
		});
		K.on("init", function(ai) {
			f.sendBtn.disabled = false;
			p("转接成功！");
			Q.bid = ai.bid
		});
		K.on("stop", function() {
			f.sendBtn.disabled = true
		});
		var ah = "";
		K.on("sendpreview", function(aj) {
			var ai = a(f.input.value);
			if (ai != ah) {
				ah = ai;
				aj(ai)
			}
		});

		function G() {
			fireClickHandler = blank;
			window.removeEventListener("touchstart", G, true)
		}
		window.addEventListener("touchstart", G, true);
		window.addEventListener("touchend", function() {
			b()
		}, false);
		window.addEventListener("click", function(ai) {
			fireClickHandler(b, this, ai)
		}, false)
	}

	function p(af, G) {
		if (z) {
			clearTimeout(z)
		}
		f.tip.innerHTML = af;
		f.tip.style.display = "";
		if (G) {
			return
		}
		z = setTimeout(function() {
			f.tip.style.display = "none"
		}, 3000)
	}

	function ae() {
		try {
			var af = ab + Q.siteid,
				aj = {}, ai, G, ah;
			aj.msgList = e.msgList;
			aj = J(aj);
			try {
				I.setItem(af, aj)
			} catch (ak) {
				for (ai = 0, G = I.length; ai < G; ai++) {
					ah = I.key(ai);
					if (ah.indexOf(ab) === 0) {
						I.removeItem(ah)
					}
				}
				I.setItem(af, aj)
			}
		} catch (ag) {}
	}

	function u(ag) {
		try {
			var G;
			if (!ag) {
				G = ab + Q.siteid
			} else {
				G = ag
			}
			return y(I.getItem(G)) || {}
		} catch (af) {
			return {}
		}
	}

	function aa() {
		f.wordList = q("wordList");
		f.faceLayer = q("faceLayer");
		f.input = q("wordInput");
		f.sendBtn = q("sendBtn");
		f.wordBtn = q("wordBtn");
		f.faceBtn = q("faceBtn");
		f.content = q("content");
		f.custInfo = q("info");
		f.tip = q("sysTip");
		f.opt = q("opt");
		f.tmp = document.createElement("div");
		g(A);
		f.faceLayer.innerHTML = '<div class="panel-inner"></div>';
		var G = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		f.content.style.minHeight = (G - f.opt.offsetHeight - 30) + "px"
	}

	function H() {
		var ag = [];
		for (var G in i) {
			if (i.hasOwnProperty(G)) {
				var af = {};
				af.key = G;
				af.md5 = i[G];
				ag.push(af)
			}
		}
		Z(0, ag)
	}

	function Y() {
		var G = f.faceLayer.getElementsByTagName("a");
		for (var af = 0, ag; ag = G[af]; af++) {
			C(ag, B)
		}
	}

	function Z(af, ai) {
		if (af >= ai.length) {
			Y();
			return
		}
		var ah = ai[af];
		var G = new Image();
		var ag = "_IMG_FACE_" + (new Date().getTime()) + "_";
		window[ag] = G;
		G.onload = function() {
			var aj = document.createElement("a");
			aj.setAttribute("data-key", ah.key);
			aj.className = "face-item";
			aj.appendChild(G);
			f.faceLayer.firstChild.appendChild(aj);
			window[ag] = null;
			Z(af + 1, ai)
		};
		G.onerror = function() {
			G = null;
			window[ag] = null;
			Z(af + 1, ai)
		};
		G.src = E + ah.md5 + ".gif"
	}

	function x(am) {
		var an = "R_" + Math.floor(Math.random() * 10000);
		var aj = 0;
		var ah = [];
		am = am.replace(/(<[^>]*>)/g, function(aq) {
			ah[aj++] = aq;
			return an
		});
		am = am.split(an);
		var ao;
		var al = [];
		var ai = [];
		var ag = new RegExp(an + "_(\\d+)\\$", "g");

		function af(ar, aq, au) {
			var at = aq || "http://";
			ai.push('<a href="' + at + au + '" target="_blank">' + ar + "</a>");
			return an + "_" + ai.length + "$"
		}

		function ap(aq) {
			ai.push('<a href="tel://' + aq + '" target="_blank">' + aq + "</a>");
			return an + "_" + ai.length + "$"
		}

		function G(ar, aq) {
			aq = parseInt(aq, 10) - 1;
			return ai[aq]
		}
		for (var aj = 0, ak = am.length; aj < ak; aj++) {
			ao = am[aj];
			ao = ao.replace(/(https?:\/\/)?([^.\u4e00-\u9fa5 ]+(\.[^.\u4e00-\u9fa5 ]+)+)/g, af);
			ao = ao.replace(/(\d{7,})/g, ap);
			ao = ao.replace(ag, G);
			al.push(ao);
			if (aj < ah.length) {
				al.push(ah[aj])
			}
		}
		return al.join("")
	}

	function ad(ai, G) {
		var af;
		if (ai.type == "server" || ai.type == "client") {
			af = w.msg;
			e.msgList.push(s({}, ai));
			if (ai.content) {
				try {
					ai.content = x(ai.content)
				} catch (ah) {}
			}
		} else {
			af = w.info
		}
		f.tmp.innerHTML = h(af, ai);
		f.content.appendChild(af = f.tmp.firstChild);
		n();
		if (!G && e.initedTime) {
			var ag = new Date().getTime() - e.initedTime;
			o("res1st", {
				v: ag
			});
			e.initedTime = null
		}
	}

	function F(ah) {
		var af = [];
		ah = ah.split("&");
		for (var G = 0, ag; ag = ah[G]; G++) {
			ag = ag.split("=");
			if (ag.length < 2) {
				continue
			}
			af[ag[0]] = ag[1]
		}
		return af
	}

	function W() {
		var ak = ["baidu.com", "baidu.com", "google.com", "google.cn", "bing.com", "search.live.com", "search.yahoo.com", "one.cn.yahoo.com", "sogou.com", "gougou.com", "youdao.com", "soso.com", "zhongsou.com", "search.114.vnet.cn"];
		var af = ["wd", "word", "q", "q", "q", "q", "p", "p", "query", "search", "q", "w", "w", "kw"];
		var al = ["gbk", "gbk", "utf8", "utf8", "utf8", "utf8", "utf8", "utf8", "gbk", "utf8", "utf8", "gbk", "gbk", "gbk"];
		var ai = document.referrer;
		var ah = {
			word: "",
			referrer: ai,
			coding: "utf8"
		};
		var aj;
		ai = ai.split("?");
		if (ai.length < 2) {
			return ah
		}
		aj = F(ai[1]);
		ai = ai[0];
		for (var ag = 0, G = ak.length; ag < G; ag++) {
			if (ai.indexOf(ak[ag]) < 0) {
				continue
			}
			if (aj[af[ag]] !== undefined) {
				ah.word = aj[af[ag]];
				ah.coding = al[ag];
				break
			}
		}
		return ah
	}

	function o(af, G) {
		G = G || {};
		G.siteid = Q.siteid;
		G.bid = Q.bid || "";
		TB.src.mobilewebim.log.send(af, G)
	}

	function V() {
		var G = new Date().getTime();
		K.on("init", function() {
			var af = e.initedTime = new Date().getTime();
			o("connectedtime", {
				v: af - G
			})
		});
		K.on("error", function(af) {
			if (af.type == "sendfail") {
				o("sendfail")
			} else {
				if (af.type == "init") {
					o("initerror")
				}
			}
		})
	}

	function t(aj, af, ai) {
		var ah = document.getElementsByTagName("head")[0];
		var ag = aj + "_JSONP_CB";
		var G = q(aj);
		if (G) {
			ah.removeChild(q(aj));
			delete window[ag]
		}
		window[ag] = function() {
			ai.apply(null, arguments)
		};
		G = document.createElement("script");
		G.charset = "utf-8";
		G.type = "text/javascript";
		if (af.indexOf("?") >= 0) {
			af += "&callback=" + ag
		} else {
			af += "?callback=" + ag
		}
		af += "&req=" + (new Date()).getTime();
		G.src = af;
		ah.appendChild(G)
	}

	function g(ah) {
		A = ah;
		var af = ["<ol>"];
		for (var G = 0, ag; ag = ah[G]; G++) {
			af.push(h(w.wordItem, {
				index: G,
				content: ag
			}))
		}
		af.push("</ol>");
		f.wordList.innerHTML = af.join("")
	}

	function S() {
		var G = f.wordList.getElementsByTagName("li");
		for (var af = 0, ag; ag = G[af]; af++) {
			C(ag, N)
		}
	}

	function v(af) {
		var ag = [];
		if (af.desc) {
			ag.push(h(w.custDesc, R(af.desc)))
		}
		if (af.tel) {
			ag.push(h(w.custTel, {
				tel: af.tel.replace(/[^0-9]/g, ""),
				telTxt: R(af.tel)
			}))
		}
		if (ag.length > 0) {
			f.custInfo.innerHTML = ag.join("");
			f.custInfo.style.display = "block";
			var G = f.custInfo.offsetHeight;
			var ah = parseInt(f.content.style.minHeight, 10);
			f.content.style.minHeight = ah - G + "px";
			f.content.style.paddingTop = G + 20 + "px"
		}
	}

	function r(af) {
		var G = {};
		if (af.cust_dis == 1 && af.cust) {
			G.desc = af.cust
		}
		if (e.tel) {
			G.tel = e.tel
		} else {
			if (af.tel_dis == 1 && af.tel) {
				G.tel = af.tel
			}
		}
		v(G);
		if (af.reply && af.reply.length > 0) {
			g(af.reply);
			S()
		}
	}
	X.enter = function(ag) {
		var al = W();
		s(Q, ag || {});
		K.init({
			siteid: Q.siteid,
			mainid: Q.mainid,
			siteidstr: Q.siteidstr,
			type: Q.type || 3,
			csNameType: Q.csNameType,
			userName: Q.userName,
			tid: Q.groupid,
			subid: Q.sub || "",
			word: al.word,
			coding: al.coding,
			referrer: document.referrer,
			bid: Q.bid || ""
		});
		aa();
		k();
		var ak = u();
		var G = ak.msgList || [];
		for (var ai = 0, aj; aj = G[ai]; ai++) {
			ad(aj, true)
		}
		p("正在为您转接，稍候...");
		V();
		K.login();
		n();
		var ah = "TEL_" + Q.siteid;
		var af = l(ah);
		if (af) {
			e.tel = af;
			v({
				tel: af
			})
		}
		t("CUST_INFO", M.CUST_INFO + "&siteid=" + Q.siteid, r);
		H()
	}
});
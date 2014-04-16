TB.define("TB.im.net", function(I) {
	var u = TongBao.dom.g,
		y = TongBao.ajax,
		a = TongBao.json.parse,
		o = null,
		c = 0,
		k = null,
		D = null,
		C = {}, z = {}, w = {}, d = {}, v = {}, H = {
			seq: 0,
			bid: "",
			siteid: "",
			session: ""
		}, r = {
			RCV_ENTER: "__SCRIPT_RCV_ENTER__",
			RCV_REFRESH: "__SCRIPT_RCV_REFRESH__",
			TB_GETUSERNAME: "__SCRIPT_TB_USERNAME__",
			TB_GETGROUPNAME: "__SCRIPT_TB_GETGROUPNAME__"
		}, n = {
			RCV_ROOT: "http://localhost:8080",
			TB_ROOT: "http://localhost:8080",
			HI_SERVER: "/mykf/server.php"
		};
	var f = false;
	//inserScript
	function s(M, K) {
		var L = document.getElementsByTagName("head")[0];
		if (u(M)) {
			L.removeChild(u(M))
		}
		if (K.indexOf("_t") < 0) {
			K += (K.indexOf("?") >= 0 ? "&" : "?") + "_t=" + m()
		}
		var G = document.createElement("script");
		G.setAttribute("type", "text/javascript");
		G.setAttribute("language", "javascript");
		G.setAttribute("id", M);
		G.setAttribute("src", K);
		G.setAttribute("charset", "UTF-8");
		L.appendChild(G)
	}

	//jsonp
	function J(M, G, L) {
		if (L) {
			var K = "jsonp_" + (+new Date());
			I.callback[K] = function(N) {
				L.call(null, N)
			};
			if (G.indexOf("?") >= 0) {
				G += "&callback=TB.im.net.callback." + K
			} else {
				G += "?callback=TB.im.net.callback." + K
			}
		}
		s(M, G)
	}

	//lazyLoad
	function g(K) {
		var G = new Image(),
			L = "__IMG_" + m() + "__";
		if (K.indexOf("_t") < 0) {
			K += (K.indexOf("?") >= 0 ? "&" : "?") + "_t=" + m()
		}
		window[L] = G;
		G.onload = G.onerror = function() {
			window[L] = null
		};
		G.src = K;
		G = null
	}

	//返回时间戳
	function m() {
		return new Date().getTime().toString(36)
	}

	//成功或者失败状态
	function i(L, K) {
		var N = K.onsuccess,
			G = K.onfailure,
			M = K.data || "";
		K.onsuccess = function(P, O) {
			O = a(O);
			if (O.result && O.result.toLowerCase() == "ok") {
				N && N.call(null, O.content)
			} else {
				G && G.call(null, O.result, O.content)
			}
		};
		K.onfailure = function() {
			G && G.call()
		};
		if (K.method == "POST") {
			L += "?_t=" + m();
			M += "&session=" + H.session;
			M += "&seq=" + H.seq++;
			if (M.charAt(0) == "&") {
				M = M.substring(1)
			}
			K.data = M
		} else {
			M = [];
			M.push("_t=" + m());
			M.push("session=" + H.session);
			M.push("seq=" + H.seq++);
			L += (L.indexOf("?") >= 0 ? "&" : "?") + M.join("&")
		}
		return y.request(L, K)
	}

	//post
	function E(K, L, M, G) {
		return i(K, {
			method: "POST",
			data: L,
			onsuccess: M,
			onfailure: G
		})
	}

	//get
	function F(K, L, G) {
		return i(K, {
			method: "GET",
			onsuccess: L,
			onfailure: G
		})
	}

	//判断L.fiedls类型 触发pick response操作
	function p(L) {
		var G, K;
		if (f) {
			return
		}
		if (L.fields && "[object Array]" == Object.prototype.toString.call(L.fields)) {
			H.ack = L.ack || H.ack;
			TongBao.cookie.set("BRIDGE_ACK", H.ack, {
				expires: 15 * 1000
			});
			for (G = 0; K = L.fields[G]; G++) {
				if (C[K.command]) {
					C[K.command](K)
				}
			}
		}
		if (f) {
			return
		}
		I.fire("pick", "response", {
			status: 0,
			bid: H.bid,
			session: H.session,
			seq: H.seq,
			ack: H.ack
		})
	}

	//离线或者掉线
	function x(G) {
		if (G == "offline" || G == "kicked") {
			I.fire("error", "offline")
		} else {
			if (!f) {
				I.fire("pick", "response", {
					status: 1,
					bid: H.bid,
					session: H.session,
					seq: H.seq,
					ack: H.ack
				})
			}
		}
	}

	function t() {
		clearTimeout(k);
		var G = o;
		o = null;
		G.abort();
		if (!o) {
			h()
		}
	}

	//未能成功重连
	function j(G, K) {
		return function() {
			var L = Array.prototype.slice.call(arguments);
			if (G !== c) {
				return
			}
			o = null;
			clearTimeout(k);
			K == "success" ? p.apply(null, L) : x.apply(null, L);
			if (!f) {
				setTimeout(function() {
					h()
				}, 0)
			}
		}
	}

	function h() {
		if (o) {
			return
		}
		c++;
		var G = TongBao.cookie.get("BRIDGE_ACK");
		o = F(n.HI_SERVER + "pick?imuss=" + H.bid + "&ack=" + (G == null ? H.ack : G), j(c, "success"), j(c, "failure"));
		k = setTimeout(t, 40000)
	}

	function b() {
		I.fire("stat_visitor")
	}

	function B(G, K) {
		I.fire("error", G, K)
	}

	function l(G) {
		E(n.HI_SERVER + "communicate", "imuss=" + G.bid + "&from=&to=" + G.to + "&tid=" + G.tid + "&siteid=" + G.siteid + "&body=" + G.msg + "&time=" + G.time + "&messageid=" + G.id, b, B)
	}

	function A(G) {
		l(G);
		G.resendTick = null;
		G.failTick = setTimeout(function() {
			B("sendFail", G.content || "");
			delete w[G.time]
		}, 20 * 1000)
	}

	function e(M) {
		var G, K, L;
		for (G = 0; K = M[G]; G++) {
			L = w[K];
			if (L) {
				clearTimeout(L.resendTick);
				clearTimeout(L.failTick);
				delete w[K]
			}
		}
	}

	function q(K, G) {
		E(n.HI_SERVER + "msgack", "imuss=" + H.bid + "&from=" + encodeURIComponent(TB.im.getData("referrer")) + "&to=" + encodeURIComponent(TB.im.getData("userName")) + "&to_sub=" + (G || "0") + "&ackid=" + K)
	}
	C.message = function(G) {
		var L, K;
		if (G.showOnceType == undefined) {
			if (G.time == undefined) {
				I.fire("pick", "message", G.content, G.time, G.from_sub)
			} else {
				L = G.time;
				q(L, G.from_sub);
				if (!z[L]) {
					z[L] = true;
					I.fire("pick", "message", G.content, G.time, G.from_sub)
				}
			}
		} else {
			K = G.showOnceType;
			if (K == 1 && G.time != undefined) {
				q(G.time, G.from_sub)
			}
			if (!v[K]) {
				v[K] = true;
				I.fire("pick", "message", G.content, G.time, G.from_sub)
			}
		} if (G.acks) {
			e(G.acks.split(";"))
		}
	};
	C.msgacknotify = function(G) {
		e(G.content.acks.split(";"))
	};
	C.scenefocusnotify = function() {
		I.fire("pick", "previewstart")
	};
	C.sceneunfocusnotify = function() {
		I.fire("pick", "previewend")
	};
	C.scenemsgnotify = function() {
		I.fire("pick", "input")
	};
	C.sendfileacknotify = function() {};
	C.sendfilecancelnotify = function() {};
	C.sendfilenotify = function(G) {
		G = G.content;
		E(n.HI_SERVER + "sendfilecancel", "username=" + G.username + "&fid=" + encodeURIComponent(G.fid) + "&imuss=" + H.bid);
		I.fire("pick", "fileUnsupport")
	};
	C.sendfilestatusnotify = function() {};
	C.communicatetransfernotify = function(G) {
		I.fire("pick", "transfer", G.content)
	};
	C.kicknotify = function(G) {
		if (G.content && G.content.type == "1") {
			I.fire("pick", "kick")
		} else {
			if (G.content && G.content.type == "2") {
				I.fire("pick", "chatover")
			}
		}
	};
	C.assigntaskacknotify = function(G) {
		I.fire("pick", "assigntask", G.content)
	};
	C.taskbeginnotify = function(G) {
		I.fire("pick", "taskbegin", G.content)
	};
	C.offlinenotify = function(G) {
		I.fire("pick", "offline", G.content)
	};
	I.init = function(G) {
		H.siteid = G.siteid;
		y.init && y.init()
	};
	I.setSession = function(G) {
		H.session = G
	};
	I.setBid = function(G) {
		H.bid = G
	};
	I.enter = function(K) {
		var G = n.RCV_ROOT + "Enter.php";
		if (K) {
			G += "?" + K
		}
		s(r.RCV_ENTER, G)
	};
	I.rcvRefresh = function(K) {
		var G = n.RCV_ROOT + "Refresh.php";
		G += "?callback=TB.im.net.handleRefresh&bid=" + H.bid + "&siteid=" + H.siteid;
		D = setInterval(function() {
			s(r.RCV_REFRESH, G)
		}, 15000);
		if (K) {
			I.on("refresh", K)
		}
	};
	I.leave = function() {
		g(n.RCV_ROOT + "Leave.php?bid=" + H.bid + "&siteid=" + H.siteid)
	};
	I.handleRefresh = function(G) {
		if (G.saved == 0) {
			clearTimeout(D)
		} else {
			I.fire("refresh", G)
		}
	};
	I.welcome = function(L, K, G) {
		E(n.HI_SERVER + "welcome", L, K, G)
	};
	I.bridgeInit = function(L, K, G) {
		E(n.HI_SERVER + "bridgeinit", L, K, G)
	};
	I.getPrepareWord = function(L, K, G) {
		E(n.HI_SERVER + "prepare", L, K, G)
	};
	I.pick = function(K, G) {
		H.ack = K || "";
		H.seq = G || 0;
		h()
	};
	I.stopPick = function() {
		f = true;
		if (o) {
			o.abort();
			o = null
		}
		clearTimeout(k)
	};
	I.sendPreview = function(K, G) {
		E(n.HI_SERVER + "scenemsg", "imuss=" + G.bid + "&to=" + G.to + "&body=" + K)
	};
	I.communicate = function(N, G, L) {
		var M = new Date().getTime();
		var K = {
			bid: H.bid,
			msg: encodeURIComponent(N),
			tid: G.tid,
			siteid: H.siteid,
			to: encodeURIComponent(G.to)
		};
		K.content = L;
		K.id = H.seq;
		K.time = M;
		K.resendTick = setTimeout(function() {
			A(K)
		}, 20 * 1000);
		w[M] = K;
		l(K)
	};
	I.logout = function() {
		E(n.HI_SERVER + "logout", "imuss=" + H.bid)
	};
	I.getClientName = function(G, L) {
		var K = ["siteid=" + H.siteid];
		K.push("subid=" + G);
		J(r.TB_GETUSERNAME, n.TB_ROOT + "?module=default&controller=webim&action=getUserName&" + K.join("&"), L)
	};
	I.getGroupName = function(M, L, G) {
		var K = ["siteid=" + H.siteid];
		if (G) {
			K.push("subid=" + M)
		} else {
			K.push("groupid=" + M)
		}
		J(r.TB_GETGROUPNAME, n.TB_ROOT + "?module=default&controller=webim&action=getGroupName&" + K.join("&"), L)
	};
	I.setURL = function(G) {
		var K;
		for (K in n) {
			if (G[K]) {
				n[K] = G[K]
			}
		}
	};
	I.on = function(K, L) {
		var G = d[K];
		if (!G) {
			G = d[K] = []
		}
		G.push(L)
	};
	I.fire = function() {
		var K = Array.prototype.slice.call(arguments),
			L, M, G;
		G = d[K[0]] || [];
		K = K.slice(1);
		for (L = 0; M = G[L]; L++) {
			M.apply(null, K)
		}
	};
	I.callback = {}
});
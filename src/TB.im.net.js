TB.define("TB.im.net", function(I) {
	var _$ = TongBao.dom.g;
	var tongbao_ajax = TongBao.ajax;
	var tongbao_parse = TongBao.json.parse;
	var has_img_net = false;
	var tongbao_kf_config = {};
	var config = {

	};

	function inserScript (mark, url) {
		var head = document.getElementsByTagName('head')[0],
			_script;
		if(_$(mark)){
			head.removeChild(_$(mark));
		}
		if(url.indexOf("_t") < 0){
			url += (url.indexOf("?") >= 0 ? "&" : "?") + "_t=" + dateMark();
		}
		_script = document.createElement("script");
		_script.setAttribute("type", "text/javascript");
		_script.setAttribute("language", "javascript");
		_script.setAttribute("id", _$(mark));
		_script.setAttribute("src", url);
		_script.setAttribute("charset", "UTF-8");

	}

	//jsonp
	function _jsonp(mark, url, callback) {
		if (callback) {
			var jsonp_callback = "jsonp_" + (+new Date());
			I.callback[jsonp_callback] = function(N) {
				callback.call(null, N)
			};
			if (url.indexOf("?") >= 0) {
				url += "&callback=TB.im.net.callback." + jsonp_callback
			} else {
				url += "?callback=TB.im.net.callback." + jsonp_callback
			}
		}
		s(mark, url)
	}

	function dateMark () {
		return new Date().getTime().toString(36)
	}

	function deferred_img(url) {
		var __IMG = new Image(),
			_img_ = "__IMG_" + dateMark() + "__";
		if (url.indexOf("_t") < 0) {
			url += (url.indexOf("?") >= 0 ? "&" : "?") + "_t=" + dateMark()
		}
		window[_img_] = __IMG;
		__IMG.onload = __IMG.onerror = function() {
			window[_img_] = null
		};
		__IMG.src = url;
		__IMG = null
	}

	//信息成功与失败操作
	function i(url, callback) {
		var success_ = callback.onsuccess,
			failure_ = callback.onfailure,
			data_ = callback.data || "";
		callback.onsuccess = function(P, O) {
			O = tongbao_parse(O);
			if (O.result && O.result.toLowerCase() == "ok") {
				success_ && success_.call(null, O.content)
			} else {
				failure_ && failure_.call(null, O.result, O.content)
			}
		};
		callback.onfailure = function() {
			failure_ && failure_.call()
		};
		if (callback.method == "POST") {
			url += "?_t=" + dateMark();
			//data_ += "&seq=" + H.seq++;
			//if (data_.charAt(0) == "&") {
			//	data_ = data_.substring(1)
			//}
			callback.data = data_
		} else {
			data_ = [];
			data_.push("_t=" + dateMark());
		//	data_.push("session=" + H.session);
		//	data_.push("seq=" + H.seq++);
			url += (url.indexOf("?") >= 0 ? "&" : "?") + data_.join("&")
		}
		return tongbao_ajax.request(url, callback)
	}


	//post
	function messagePOST(url, data, success_, failure_) {
		return i(url, {
			method: "POST",
			data: data,
			onsuccess: success_,
			onfailure: failure_
		})
	}

	//get
	function messageGET(url, success_, failure_) {
		return i(url, {
			method: "GET",
			onsuccess: success_,
			onfailure: failure_
		})
	}

	//判断L.fiedls类型 触发pick response操作
	function pickReponse(data) {
		var i, hasData;
		if (has_img_net) {
			return
		}
		//设置cookie顺序 name value path domain serare的{}集合
		if (data.fields && "[object Array]" == Object.prototype.toString.call(data.fields)) {
			//ack域
			//H.ack = data.ack || H.ack;
			//TongBao.cookie.set("BRIDGE_ACK", H.ack, {
			//	expires: 15 * 1000
			//});
			for (i = 0; hasData = data.fields[i]; i++) {
				if (tongbao_kf_config[hasData.command]) {
					tongbao_kf_config[hasData.command](hasData)
				}
			}
		}
		if (has_img_net) {
			return
		}
		I.fire("pick", "response", {
			status: 0,
	//		bid: H.bid,
	//		session: H.session,
	//		seq: H.seq,
	//		ack: H.ack
		})
	}
	
	/*var u = TongBao.dom.g,
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
			RCV_ROOT: "http://localhost:8080/mykf/",
			TB_ROOT: "http://localhost:8080/mykf/",
			HI_SERVER: "http://localhost:8080/mykf/"
		};
	var f = false;*/

	//jsonp
	/*function J(M, G, L) {
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
	}*/

	//lazyLoad
	/*function g(K) {
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
	}*/

	//返回时间戳
	/*function m() {
		return new Date().getTime().toString(36)
	}*/

	//成功或者失败状态
	/*function i(L, K) {
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
	}*/

	//post
	function messagePOST(K, L, M, G) {
		return i(K, {
			method: "POST",
			data: L,
			onsuccess: M,
			onfailure: G
		})
	}

	//get
	function messageGET(K, L, G) {
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

	//
	function h() {
		if (o) {
			return
		}
		c++;
		var G = TongBao.cookie.get("BRIDGE_ACK");
		o = messageGET(n.HI_SERVER + "pick?imuss=" + H.bid + "&ack=" + (G == null ? H.ack : G), j(c, "success"), j(c, "failure"));
		k = setTimeout(t, 40000)
	}

	function b() {
		I.fire("stat_visitor")
	}

	function B(G, K) {
		I.fire("error", G, K)
	}

	function l(G) {
		messagePOST(n.HI_SERVER + "communicate", "imuss=" + G.bid + "&from=&to=" + G.to + "&tid=" + G.tid + "&siteid=" + G.siteid + "&body=" + G.msg + "&time=" + G.time + "&messageid=" + G.id, b, B)
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
		messagePOST(n.HI_SERVER + "msgack", "imuss=" + H.bid + "&from=" + encodeURIComponent(TB.im.getData("referrer")) + "&to=" + encodeURIComponent(TB.im.getData("userName")) + "&to_sub=" + (G || "0") + "&ackid=" + K)
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
		messagePOST(n.HI_SERVER + "sendfilecancel", "username=" + G.username + "&fid=" + encodeURIComponent(G.fid) + "&imuss=" + H.bid);
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
	//参数初始
	I.enter = function(K) {
		var G = n.RCV_ROOT + "enter.php";
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
		messagePOST(n.HI_SERVER + "welcome.php", L, K, G)
	};
	I.bridgeInit = function(L, K, G) {
		messagePOST(n.HI_SERVER + "bridgeinit.php", L, K, G)
	};
	I.getPrepareWord = function(L, K, G) {
		messagePOST(n.HI_SERVER + "prepare.php", L, K, G)
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
		messagePOST(n.HI_SERVER + "scenemsg", "imuss=" + G.bid + "&to=" + G.to + "&body=" + K)
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
		messagePOST(n.HI_SERVER + "logout", "imuss=" + H.bid)
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
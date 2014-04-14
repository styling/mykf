TB.define("TB.src.lightapp.stat", function(c) {
	var d = TB.src.mobilewebim.log;
	var b = TB.im;
	var f = {
		CONNECTION_SUCCESS: "connection_success"
	};
	var a = "lightapp";
	var h = {
		siteId: "",
		mainId: "",
		bid: ""
	};

	function e() {
		var i = window.location.search || "";
		i = i.replace(/^\?/, "");
		var j = TongBao.url.queryToJson(i) || {};
		return j
	}

	function g(i) {
		h.bid = i.bid;
		var j = e();
		h.siteId = j.siteid || "";
		h.lightapp = j.lightapp || "";
		h.msg = f.CONNECTION_SUCCESS;
		d.send(a, h)
	}
	b.on("taskbegin", function(i) {
		g(i)
	});
	c.init = function(i) {
		h.siteId = i.siteId || 0
	}
});
TB.define("TB.src.mobilewebim.log", function(a) {
	var mobilewebimUrl = "http://TB.tongbao.com/v3/statlog/stat.gif";
	var b = {};

	function d(e) {
		var g = [];
		for (var f in e) {
			g.push(f + "=" + encodeURIComponent(e[f]))
		}
		return g.join("&")
	}
	a.send = function(g, f) {
		var e;
		var h = "_LOG_IMG_" + (new Date()).getTime() + "_";
		f = f || {};
		f.type = g;
		f.vis = "mobile";
		f.req = new Date().getTime().toString(16);
		window[h] = e = new Image();
		e.onload = e.onerror = function() {
			window[h] = null
		};
		e.src = mobilewebimUrl + "?" + d(f);
		e = null
	};
	a.setURL = function(e) {
		mobilewebimUrl = e || mobilewebimUrl
	}
});
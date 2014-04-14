var TB = (function() {
	function a(e, d, b) {
		var c = e.call(null, d[b]);
		if (c) {
			d[b] = c
		}
	}
	return {
		define: function(c, j) {
			var g = c.split("."),
				d, f, e = window,
				h, b;
			for (d = 0, b = g.length - 1; d < b; d++) {
				f = g[d];
				if (!e[f]) {
					e[f] = {}
				}
				e = e[f]
			}
			f = g[d];
			if (!e[f]) {
				e[f] = {}
			}
			a(j, e, f);
			return e[f]
		},
		require: function(b, f) {
			var e = b.split("."),
				d = window,
				c = 0,
				f = f || blank;
			while (c < e.length) {
				d = d[e[c++]];
				if (!d) {
					break
				}
			}
			if (!d) {
				throw new Error(b + " is undefined")
			} else {
				f.call(null)
			}
			return d
		}
	}
})();
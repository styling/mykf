var TB = (function() {
	function factoryHanlder(callback, factory, name) {
		var exports = callback.call(null, factory[name]);
		if (exports) {
			factory[name] = exports;
		}
	}
	return {
		/*
		  * 定义模块的全局方法(AMD规范)
		  * @param { String } 模块名
		  * @param { Function } 模块的内容
		  * factory的参数对应依赖模块的外部接口(exports)
		  */ 
		define : function (namespaces, callback) {
			var spaces = namespaces.split('.'),
				_key,
				mods,
				_window = window,
				len;
			for(_key = 0, len = spaces.length - 1; _key < len; _key++){
				mods = spaces[_key];
				if(!_window[mods]) _window[mods] = {};
				_window = _window[mods];
			}	
			mods = spaces[_key];
			if(!_window[mods]) _window[mods] = {};
			factoryHanlder(callback, _window, mods);
			return _window[mods];
		},
		/*
		  * 定义模块的全局方法(CMD规范)
		  * @param { String } 模块名
		  * @param { Function } 模块的内容
		  * factory的参数对应依赖模块的外部接口(exports)
		  */
		require : function (name, callback) {
			var modules = name.split('.'),
				_window = window,
				_index = 0,
				callback = callback || blank;
			while(_index < modules.length){
				_window = _window[modules[_index++]];
				if(!_window){
					break;
				}
			}	
			if(!_window){
				throw new Error(name + " is undefined");
			}else{
				callback.call(null);
			}
			return _index
		}
	}
})();
$nyaa.register(
	'cookie',
	[],
	{
		onLoad: function(){
			this.nyaa.debug('cookie onLoad');
		},
		_get_config: function(config){
			if(typeof(config) === 'undefined'){
				if(typeof(this.config['default']) === 'undefined')
					config = {};
				else
					config = this.config['default'];
			}else if(typeof(config) === 'string'){
				if(typeof(this.config[config]) === 'undefined')
					config = {};
				else
					config = this.config[config];
			}else if(typeof(config) === 'object'){
				config = config;
			}else{
				this.nyaa.error('config type is not correct');
				config = {};
			}
			return config;
		},
		set: function(name, value, config){
			config = this._get_config(config);
			var submit_string = encodeURIComponent(name) + '=' + encodeURIComponent(value) + '; ';
			if(typeof(config.domain) !== 'undefined'){
				submit_string += 'domain=' + config.domain + '; ';
			}
			if(typeof(config.path) !== 'undefined'){
				submit_string += 'path=' + config.path + '; ';
			}
			if(typeof(config.expires) !== 'undefined' && config.expires != 0){
				var date = new Date();
				date.setTime(date.getTime() + config.expires * 1000);
				submit_string += 'expires=' + date.toGMTString() + '; ';
			}
			if(typeof(config.secure) !== 'undefined' && config.secure){
				submit_string += 'secure=true; ';
			}
			console.log(submit_string);
			document.cookie = submit_string;
		},
		get: function(name){
			var _cookies = document.cookie.split(/\s*;\s*/);
			var cookies = {};
			for(var index in _cookies){
				var tmp = _cookies[index];
				var e_pos = tmp.indexOf('=');
				if(e_pos < 0){
					cookies[''] = decodeURIComponent(tmp);
				}else{
					cookies[decodeURIComponent(tmp.substr(0, e_pos))] = decodeURIComponent(tmp.substr(e_pos + 1));
				}
			}
			if(typeof(name) === 'undefined'){
				return cookies;
			}
			return cookies[name];
		},
		del: function(name, config){
			config = this._get_config(config);
			config.expires = -1;
			this.set(name, 'deleted', config);
		}
	}
);
function getCurrentScript(){
	var src = '';
	if(typeof(document.currentScript) === 'undefined'){
		/*document.currentScript is not supported by IE and other older browsers*/
		var scripts = document.getElementsByTagName('script');
		src = scripts[scripts.length - 1].src;
	}else{
		src = document.currentScript.src;
	}
	return src.substr(0, src.lastIndexOf('/'));
}

Module = function(module, depend, obj){
	this.module = module;
	this.loaded = false;
	this._load_lock = false;
	this.depend = depend;
	this.nyaa = $nyaa;
	this.extend(obj);
	
	this.nyaa.debug('Module object "'+module+'" is created');
}

Module.prototype.extend = function(source){
	for(var index in source){
		this[index] = source[index];
	}
	return this;
}

Module.prototype.load = function(){
	if(this._load_lock || this.loaded) return;
	this._load_lock = true;
	
	var flag = true;
	for(var i = 0; i < this.depend.length; ++i){
		if(this.nyaa._loaded_module_list.indexOf(this.depend[i].replace(/^.*\//, '')) === -1){
			flag = false;
			break;
		}
		this[this.depend[i].replace(/^.*\//, '')] = this.nyaa[this.depend[i].replace(/^.*\//, '')];
	}
	if(flag){
		this.config = this.nyaa.config(this.module);
		try{
			this.onLoad();
		}catch(e){
			throw new Error('Module loading process terminated');
			return;
		}
		this.loaded = true;
		this.nyaa._loaded_module_list.push(this.module);
	}
	this._load_lock = false;
};

$nyaa = {
	version: '0.4.4',
	platform: 'production',
	_system_modules: ['ajax', 'request', 'response', 'template', 'cookie', 'polling'],
	base: {
		system: getCurrentScript(),
		custom: getCurrentScript(),
	},
	
	config: function(key, value){
		if(typeof(key) === 'object'){
			if(typeof(this._config) === 'undefined') this._config = {};
			for(var index in key){
				this._config[index] = key[index];
			}
		}else if((typeof(key) === 'string') && (typeof(value) === 'object')){
			if(typeof(this._config) === 'undefined') this._config = {};
			if(typeof(this._config[key]) === 'undefined') this._config[key] = {};
			for(var index in value){
				this._config[key][index] = value[index];
			}
		}else if((typeof(key) === 'string') && (typeof(value) === 'undefined')){
			return this._config[key];
		}else{
			this.error('config parameter type not match');
		}
	},

	_msg: function(msg, handler){
		return '[nyaaJS-' + this.version + '] ' + handler + ': ' + msg;
	},
	error: function(msg){
		console.error(this._msg(msg, 'error'));
	},
	warning: function(msg){
		console.warn(this._msg(msg, 'warning'));
	},
	info: function(msg){
		console.info(this._msg(msg, 'info'));
	},
	log: function(msg){
		console.log(this._msg(msg, 'log'));
	},
	debug: function(msg){
		if(this.platform === 'development')
			console.debug(this._msg(msg, 'debug'));
	},
	
	register: function(module, depend, i_face){
		if(this._registered_module_list.indexOf(module) !== -1)
			return;
		
		this._registered_module_list.push(module);
		this.debug('register "' + module + '"');
		var oModule = new Module(module, depend, i_face);
		this[module] = oModule;
		var flag = true;
		for(var i = 0; i < depend.length; ++i){
			this._use(depend[i]);
		}
		oModule.load();
		var last_loaded_module_count;
		do{
			last_loaded_module_count = this._loaded_module_list.length;
			for(var i = 0; i < this._registered_module_list.length; ++i){
				this[this._registered_module_list[i]].load();
			}
		}while(last_loaded_module_count != this._loaded_module_list.length);
		
		if(this._loaded_module_list.length === this._registered_module_list.length && this._loaded_module_list.length === this._fetched_module_list.length){
			this._ready();
		}
	},
	_remove_path: function(uri){
		if(uri.indexOf('//') < 0)
			return '';
		else
			return uri.substr(0, uri.indexOf('/', uri.indexOf('//') + 2));
	},
	_module_to_uri: function(module){
		var extension = '.js';
		if(typeof(this._config.min) !== 'undefined' && this._config.min === true)
			extension = '.min' + extension;
		if(typeof(this._config.aliases) !== 'undefined')
			while(this._config.aliases.indexOf(module) !== -1)
				module = this._config.aliases[module];
		if(this._system_modules.indexOf(module) !== -1)
			return this.base.system + '/nyaa.' + module + extension
		
		var postfix = (typeof(this._config.postfix) !== 'undefined')?('?v=' + this._config.postfix):'';
		if(module.indexOf('/') === 0)
			return this._remove_path(this.base.custom) + module + extension + postfix;
		else if(module.indexOf('//') >= 0)
			return module + extension + postfix;
		else
			return this.base.custom + '/' + module + extension + postfix;
	},
	_use: function(module){
		var module_name = module.substr(module.lastIndexOf('/')+1);
		if(this._fetched_module_list.indexOf(module_name) !== -1)
			return;
		this._fetched_module_list.push(module_name);
		var oScript = document.createElement('script');
		var oHead = document.getElementsByTagName('head').item(0);
		oScript.type = "application/javascript";
		oScript.src = this._module_to_uri(module);
		oHead.appendChild(oScript);
	},
	
	init: function(config){
		if(typeof(this._init_was_called) !== 'undefined' && this._init_was_called === true){
			this.warning('duplicated call to $nyaa.init()');
			return false;
		}
		this._init_was_called = true;
		
		this._fetched_module_list = [];
		this._registered_module_list = [];
		this._loaded_module_list = [];
		if(typeof(this._config) === 'undefined'){
			this.error('please set $nyaa.config before call to $nyaa.init()');
			return false;
		}
		if(typeof(this._config) !== 'object'){
			this.error('$nyaa.config should be a object');
			return false;
		}
		if(typeof(this._config.base) === 'undefined'){
			this.warning('$nyaa.config.base not defined, useing "' + this.base.custom + '" instead');
		}else if(typeof(this._config.base) !== 'string'){
			this.error('$nyaa.config.base should be a string');
			return false;
		}else{
			this.base.custom = this._config.base;
			if(this.base.custom.lastIndexOf('/') === this.base.custom.length + 1){
				this.base.custom = this.base.custom.substr(0, this.base.custom.length - 1);
			}
		}
		if(typeof(this._config.modules) === 'undefined'){
			this.warning('$nyaa.config.modules not defined');
			this.debug('$nyaa.config.modules not defined, set to blank array');
			this._config.modules = [];
		}
		if(typeof(this._config.modules) === 'string'){
			this.warning('$nyaa.config.modules is a string');
			this.debug('transform to array object with one item');
			this._config.modules = [this._config.modules];
		}
		for(var i = 0; i < this._config.modules.length; ++i){
			var module = this._config.modules[i];
			this._use(module);
		}
	},
	
	event: function(e, d){
		for(var i = 0; i < this._registered_module_list.length; ++i){
			if(typeof($nyaa[this._registered_module_list[i]]['on' + e]) !== 'undefined'){
				$nyaa[this._registered_module_list[i]]['on' + e](d);
			}
		}
	},
	
	_readyCallList: [],
	_ready: function(){
		var f;
		while(f = this._readyCallList.shift()){
			f();
		}
	},
	ready: function(f){
		this._readyCallList.push(f);
	}
};
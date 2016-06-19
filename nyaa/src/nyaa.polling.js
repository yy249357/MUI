$nyaa.register(
	'polling',
	[],
	{
		_functions: {},
		onLoad: function(){
			this.nyaa.debug('polling onLoad');
		},
		add: function(func, duration, key){
			if(typeof(func) === 'function' || typeof(func) === 'string' || typeof(func) === 'object'){
				if(typeof(this._functions[key]) != 'undefined'){
					this.nyaa.error('the polling key is exist');
					return;
				}
			}else{
				this.nyaa.error('the first parameter\'s type should be function or string');
				return;
			}
			if(typeof(duration) !== 'number'){
				this.nyaa.error('the second parameter\'s type should be number');
				return;
			}
			if(typeof(key) !== 'string'){
				this.nyaa.error('the third parameter\'s type should be string');
				return;
			}
			if(typeof(func) === 'object'){
				var tmp = '$nyaa';
				for(var index = 0; index < func.length; ++index){
					tmp += '.' + func[index];
				}
				func = tmp + '();';
				delete tmp;
			}
			this._functions[key] = {
				func: func,
				duration: duration,
				id: null
			};
		},
		start: function(key){
			if(typeof(this._functions[key]) === 'undefined'){
				this.nyaa.error('polling key not exist');
				return;
			}
			if(this._functions[key].id !== null){
				this.nyaa.warning('polling is already started');
				return;
			}
			this._functions[key].id = setInterval('$nyaa.polling.run(\''+key+'\');', this._functions[key].duration);
		},
		stop: function(key){
			if(typeof(this._functions[key]) === 'undefined'){
				this.nyaa.error('polling key not exist');
				return;
			}
			if(this._functions[key].id === null){
				this.nyaa.warning('polling is already stopped');
				return;
			}
			clearInterval(this._functions[key].id);
			this._functions[key].id = null;
		},
		remove: function(key){
			if(typeof(this._functions[key]) === 'undefined'){
				this.nyaa.error('polling key not exist');
				return;
			}
			this.stop(key);
			delete this._functions[key];
		},
		run: function(key){
			if(typeof(this._functions[key]) === 'undefined'){
				this.nyaa.error('polling key not exist');
				return;
			}
			if(typeof(this._functions[key].func) === 'function'){
				this._functions[key].func();
			}else if(typeof(this._functions[key].func) === 'string'){
				eval(this._functions[key].func);
			}
		}
	}
);
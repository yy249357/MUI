$nyaa.register(
	'request',
	[],
	{
		onLoad: function(){
			this.nyaa.debug('request onLoad');
			$nyaa.ready(function(){
				window.onhashchange = function(){
					$nyaa.request._hash = false;
					$nyaa.event('HashChange');
				}
				window.onhashchange();
			});
		},
		_query: false,
		query: function(key){
			if(this._query === false){
				this._query = {};
				var re = /(?:([^&=\?]+?)(?:=([^&=\?]*?))?)(?:&|$)/ig;
				var result;
				while(result = re.exec(location.search)){
					this._query[result[1]] = result[2] === undefined?'':decodeURIComponent(result[2]);
				}
			}
			if(typeof(key) === 'undefined')
				return this._query;
			return this._query[key] === undefined?null:this._query[key];
		},
		_hash: false,
		hash: function(key){
			if(this._hash === false){
				this._hash = {};
				var re = /(?:([^&=#]+?)(?:=([^&=#]*?))?)(?:&|$)/ig;
				var result;
				while(result = re.exec(location.hash)){
					this._hash[result[1]] = result[2] === undefined?'':decodeURIComponent(result[2]);
				}
			}
			if(typeof(key) === 'undefined')
				return this._hash;
			return this._hash[key] === undefined?null:this._hash[key];
		}
	}
);
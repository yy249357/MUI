function CALLBACK(callback){
	return function(a, b, c){
		var cb = callback.split('.');
		var f = $nyaa;
		for(var index in cb){
			if(typeof(f[cb[index]]) === 'function')break;
			f = f[cb[index]];
		}
		f[cb[cb.length-1]](a, b, c);
	}
}

$nyaa.register(
	'ajax',
	[],
	{
		onLoad: function(){
			if(typeof(jQuery) === 'undefined'){
				this.nyaa.error('nyaa.ajax requires jQuery');
				return false;
			}
			this.nyaa.debug('ajax onLoad');
		},
		_ajax: function(method, url, data, success, error){
			$.ajax({
				crossDomain: true,
				cache: false,
				xhrFields: {
					withCredentials: true
				},
				type: method,
				url: url,
				data: data,
				success: success,
				error: error,
				dataType: 'json'
			});
		},
		post: function(url, data, callback){
			this._ajax('POST', url, data, callback, callback);
		},
		get: function(url, data, callback){
			var query = '';
			for(var key in data){
				if(query !== '') query += '&';
				query += encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
			}
			if(query !== '') url += '?' + query;
			this._ajax('GET', url, {}, callback, callback);
		}
	}
);
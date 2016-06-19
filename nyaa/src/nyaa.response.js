$nyaa.register(
	'response',
	['request'],
	{
		onLoad: function(){
			this.nyaa.debug('response onLoad');
		},
		build_url: function(url, query, hash){
			var _url, index;
			if(typeof(url) === 'undefined') url = '';
			if(typeof(query) !== 'undefined' && url.indexOf('?') === -1){
				_url = '';
				for(index in query){
					if(_url !== '') _url += '&';
					_url += encodeURIComponent(index) + '=' + encodeURIComponent(query[index]);
				}
				if(_url !== '')
					url += '?' + _url;
			}
			if(typeof(hash) !== 'undefined' && url.indexOf('#') === -1){
				_url = '';
				for(index in hash){
					if(_url !== '') _url += '&';
					_url += encodeURIComponent(index) + '=' + encodeURIComponent(hash[index]);
				}
				if(_url !== '')
					url += '#' + _url;
			}
			return url;
		},
		remove_postfix: function(url){
			if(url.indexOf('?') !== -1){
				url = url.substr(0, url.indexOf('?'));
			}
			if(url.indexOf('#') !== -1){
				url = url.substr(0, url.indexOf('#'));
			}
			return url;
		},
		redirect: {
			url: function(url, query, hash){
				location.href = $nyaa.response.build_url(url, query, hash);
				throw new Error('Terminate the script after modify the location.');
			},
			query: function(data, url){
				location.href = $nyaa.response.build_url(url, data);
				throw new Error('Terminate the script after modify the location.');
			},
			hash: function(data, url){
				location.href = $nyaa.response.build_url(url, undefined, data);
				throw new Error('Terminate the script after modify the location.');
			}
		},
		replace: {
			url: function(url, query, hash){
				location.replace($nyaa.response.build_url(url, query, hash));
				throw new Error('Terminate the script after modify the location.');
			},
			query: function(data, url){
				location.replace($nyaa.response.build_url(url, data));
				throw new Error('Terminate the script after modify the location.');
			},
			hash: function(data, url){
				location.replace($nyaa.response.build_url(url, undefined, data));
				throw new Error('Terminate the script after modify the location.');
			}
		}
	}
);
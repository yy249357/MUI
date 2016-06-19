$nyaa.register(
	'template',
	[],
	{
		onLoad: function(){
			if(typeof(jQuery) === 'undefined'){
				this.nyaa.error('nyaa.template requires jQuery');
				return false;
			}
			this.nyaa.debug('template onLoad');
		},
		use: function(name, data){
			var html = $('template[name='+name+']').first().html();
			for(var key in data){
				var value = '';
				if(key.indexOf('.raw') > -1)
					value = data[key];
				else
					value = $('<a></a>').text(data[key]).html(); /*use jQuery to implement html_entity()*/
				value = value.replace(/\{\{/g, '&#123;&#123;'); /*prevent duplicate replace*/
				value = value.replace(/\}\}/g, '&#125;&#125;'); /*prevent duplicate replace*/
				var key_non_raw = key.replace('.raw', '');
				var re = RegExp('\\{\\{\\s*' + key_non_raw + '\\s*\\}\\}', 'g');
				html = html.replace(re, value);
			}
			return html;
		}
	}
);
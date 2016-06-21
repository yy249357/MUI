if (typeof(RGraph) == "undefined") {
	RGraph = {
		isRGraph: true,
		type: "common"
	}
}
RGraph.Registry = {};
RGraph.Registry.store = [];
RGraph.Registry.store["chart.event.handlers"] = [];
RGraph.background = {};
RGraph.objects = [];
RGraph.Resizing = {};
RGraph.events = [];
RGraph.getScale = function(max, obj) {
	if (max == 0) {
		return ["0.2", "0.4", "0.6", "0.8", "1.0"]
	}
	var original_max = max;
	if (max <= 1) {
		if (max > 0.5) {
			return [0.2, 0.4, 0.6, 0.8, Number(1).toFixed(1)]
		} else {
			if (max >= 0.1) {
				return obj.Get("chart.scale.round") ? [0.2, 0.4, 0.6, 0.8, 1] : [0.1, 0.2, 0.3, 0.4, 0.5]
			} else {
				var tmp = max;
				var exp = 0;
				while (tmp < 1.01) {
					exp += 1;
					tmp *= 10
				}
				var ret = ["2e-" + exp, "4e-" + exp, "6e-" + exp, "8e-" + exp, "10e-" + exp];
				if (max <= ("5e-" + exp)) {
					ret = ["1e-" + exp, "2e-" + exp, "3e-" + exp, "4e-" + exp, "5e-" + exp]
				}
				return ret
			}
		}
	}
	if (String(max).indexOf(".") > 0) {
		max = String(max).replace(/\.\d+$/, "")
	}
	var interval = Math.pow(10, Number(String(Number(max)).length - 1));
	var topValue = interval;
	while (topValue < max) {
		topValue += (interval / 2)
	}
	if (Number(original_max) > Number(topValue)) {
		topValue += (interval / 2)
	}
	if (max < 10) {
		topValue = (Number(original_max) <= 5 ? 5 : 10)
	}
	if (obj && typeof(obj.Get("chart.scale.round")) == "boolean" && obj.Get("chart.scale.round")) {
		topValue = 10 * interval
	}
	return [topValue * 0.2, topValue * 0.4, topValue * 0.6, topValue * 0.8, topValue]
};
RGraph.array_max = function(arr) {
	var max = null;
	for (var i = 0; i < arr.length; ++i) {
		if (typeof(arr[i]) == "number") {
			var val = arguments[1] ? Math.abs(arr[i]) : arr[i];
			if (typeof(max) == "number") {
				max = Math.max(max, val)
			} else {
				max = val
			}
		}
	}
	return max
};
RGraph.array_pad = function(arr, len) {
	if (arr.length < len) {
		var val = arguments[2] ? arguments[2] : null;
		for (var i = arr.length; i < len; ++i) {
			arr[i] = val
		}
	}
	return arr
};
RGraph.array_sum = function(arr) {
	if (typeof(arr) == "number") {
		return arr
	}
	var i, sum;
	var len = arr.length;
	for (i = 0, sum = 0; i < len; sum += arr[i++]) {}
	return sum
};
RGraph.is_array = function(obj) {
	return obj != null && obj.constructor.toString().indexOf("Array") != -1
};
RGraph.degrees2Radians = function(degrees) {
	return degrees * (Math.PI / 180)
};
RGraph.lineByAngle = function(context, x, y, angle, length) {
	context.arc(x, y, length, angle, angle, false);
	context.lineTo(x, y);
	context.arc(x, y, length, angle, angle, false)
};
RGraph.Text = function(context, font, size, x, y, text) {
	if (typeof(text) == "string" && text.match(/\r\n/)) {
		var arr = text.split("\r\n");
		text = arr[0];
		arr = RGraph.array_shift(arr);
		var nextline = arr.join("\r\n");
		RGraph.Text(context, font, size, arguments[9] == -90 ? (x + (size * 1.5)) : x, y + (size * 1.5), nextline, arguments[6] ? arguments[6] : null, "center", arguments[8], arguments[9], arguments[10], arguments[11], arguments[12])
	}
	if (RGraph.isIE8()) {
		y += 2
	}
	context.font = (arguments[11] ? "Bold " : "") + size + "pt " + font;
	var i;
	var origX = x;
	var origY = y;
	var originalFillStyle = context.fillStyle;
	var originalLineWidth = context.lineWidth;
	if (typeof(arguments[6]) == null) {
		arguments[6] = "bottom"
	}
	if (typeof(arguments[7]) == null) {
		arguments[7] = "left"
	}
	if (typeof(arguments[8]) == null) {
		arguments[8] = null
	}
	if (typeof(arguments[9]) == null) {
		arguments[9] = 0
	}
	if (typeof(arguments[12]) == null) {
		arguments[12] = true
	}
	if (navigator.userAgent.indexOf("Opera") != -1) {
		context.canvas.__rgraph_valign__ = arguments[6];
		context.canvas.__rgraph_halign__ = arguments[7]
	}
	context.save();
	context.canvas.__rgraph_originalx__ = x;
	context.canvas.__rgraph_originaly__ = y;
	context.translate(x, y);
	x = 0;
	y = 0;
	if (arguments[9]) {
		context.rotate(arguments[9] / 57.3)
	}
	if (arguments[6]) {
		var vAlign = arguments[6];
		if (vAlign == "center") {
			context.translate(0, size / 2)
		} else {
			if (vAlign == "top") {
				context.translate(0, size)
			}
		}
	}
	if (arguments[7]) {
		var hAlign = arguments[7];
		var width = context.measureText(text).width;
		if (hAlign) {
			if (hAlign == "center") {
				context.translate(-1 * (width / 2), 0)
			} else {
				if (hAlign == "right") {
					context.translate(-1 * width, 0)
				}
			}
		}
	}
	context.fillStyle = originalFillStyle;
	context.save();
	context.fillText(text, 0, 0);
	context.lineWidth = 0.5;
	if (arguments[8]) {
		var width = context.measureText(text).width;
		var ieOffset = RGraph.isIE8() ? 2 : 0;
		context.translate(x, y);
		context.strokeRect(0 - 3, 0 - 3 - size - ieOffset, width + 6, 0 + size + 6);
		if (arguments[10]) {
			var offset = 3;
			var ieOffset = RGraph.isIE8() ? 2 : 0;
			var width = context.measureText(text).width;
			context.fillStyle = arguments[10];
			context.fillRect(x - offset, y - size - offset - ieOffset, width + (2 * offset), size + (2 * offset))
		}
		context.fillStyle = originalFillStyle;
		context.fillText(text, 0, 0);
		if (arguments[12]) {
			context.fillRect(arguments[7] == "left" ? 0 : (arguments[7] == "center" ? width / 2 : width) - 2, arguments[6] == "bottom" ? 0 : (arguments[6] == "center" ? (0 - size) / 2 : 0 - size) - 2, 4, 4)
		}
	}
	context.restore();
	context.lineWidth = originalLineWidth;
	context.restore()
};
RGraph.Clear = function(canvas) {
	var context = canvas.getContext("2d");
	if (!arguments[1] || (arguments[1] && arguments[1] == "transparent")) {
		context.fillStyle = "rgba(0,0,0,0)";
		context.globalCompositeOperation = "source-in";
		context = canvas.getContext("2d");
		context.beginPath();
		context.fillRect(-1000, -1000, canvas.width + 2000, canvas.height + 2000);
		context.fill();
		context.globalCompositeOperation = "source-over"
	} else {
		context.fillStyle = arguments[1];
		context = canvas.getContext("2d");
		context.beginPath();
		context.fillRect(-1000, -1000, canvas.width + 2000, canvas.height + 2000);
		context.fill()
	}
	if (RGraph.ClearAnnotations) {
		RGraph.ClearAnnotations(canvas.id)
	}
	RGraph.FireCustomEvent(canvas.__object__, "onclear")
};
RGraph.DrawTitle = function(canvas, text, gutter) {
	var obj = canvas.__object__;
	var context = canvas.getContext("2d");
	var size = arguments[4] ? arguments[4] : 12;
	var centerx = (arguments[3] ? arguments[3] : RGraph.GetWidth(obj) / 2);
	var keypos = obj.Get("chart.key.position");
	var vpos = gutter / 2;
	var hpos = obj.Get("chart.title.hpos");
	var bgcolor = obj.Get("chart.title.background");
	if (obj.type == "bar" && obj.Get("chart.variant") == "3d") {
		keypos = "gutter"
	}
	context.beginPath();
	context.fillStyle = obj.Get("chart.text.color") ? obj.Get("chart.text.color") : "black";
	if (keypos && keypos != "gutter") {
		var vCenter = "center"
	} else {
		if (!keypos) {
			var vCenter = "center"
		} else {
			var vCenter = "bottom"
		}
	}
	if (typeof(obj.Get("chart.title.vpos")) == "number") {
		vpos = obj.Get("chart.title.vpos") * gutter
	}
	if (typeof(hpos) == "number") {
		centerx = hpos * canvas.width
	}
	if (typeof(obj.Get("chart.title.color") != null)) {
		var oldColor = context.fillStyle;
		var newColor = obj.Get("chart.title.color");
		context.fillStyle = newColor ? newColor : "black"
	}
	var font = obj.Get("chart.text.font");
	RGraph.Text(context, font, size, centerx, vpos, text, vCenter, "center", bgcolor != null, null, bgcolor, true);
	context.fillStyle = oldColor
};
RGraph.getMouseXY = function(e) {
	var obj = (RGraph.isIE8() ? event.srcElement : e.target);
	var x;
	var y;
	if (RGraph.isIE8()) {
		e = event
	}
	if (typeof(e.offsetX) == "number" && typeof(e.offsetY) == "number") {
		x = e.offsetX;
		y = e.offsetY
	} else {
		x = 0;
		y = 0;
		while (obj != document.body && obj) {
			x += obj.offsetLeft;
			y += obj.offsetTop;
			obj = obj.offsetParent
		}
		x = e.pageX - x;
		y = e.pageY - y
	}
	return [x, y]
};
RGraph.getCanvasXY = function(canvas) {
	var x = 0;
	var y = 0;
	var obj = canvas;
	do {
		x += obj.offsetLeft;
		y += obj.offsetTop;
		obj = obj.offsetParent
	} while (obj && obj.tagName.toLowerCase() != "body");
	return [x, y]
};
RGraph.Register = function(obj) {
	var key = obj.id + "_" + obj.type;
	RGraph.objects[key] = obj
};
RGraph.Redraw = function() {
	for (i in RGraph.objects) {
		if (typeof(i) == "string" && typeof(RGraph.objects[i]) == "object" && typeof(RGraph.objects[i].type) == "string" && RGraph.objects[i].isRGraph) {
			if (!arguments[0] || arguments[0] != RGraph.objects[i].id) {
				RGraph.Clear(RGraph.objects[i].canvas, arguments[1] ? arguments[1] : null);
				RGraph.objects[i].Draw()
			}
		}
	}
};
RGraph.pr = function(obj) {
	var str = "";
	var indent = (arguments[2] ? arguments[2] : "");
	switch (typeof(obj)) {
		case "number":
			if (indent == "") {
				str += "Number: "
			}
			str += String(obj);
			break;
		case "string":
			if (indent == "") {
				str += "String (" + obj.length + "):"
			}
			str += '"' + String(obj) + '"';
			break;
		case "object":
			if (obj == null) {
				str += "null";
				break
			}
			str += "Object\n" + indent + "(\n";
			for (var i = 0; i < obj.length; ++i) {
				str += indent + " " + i + " => " + RGraph.pr(obj[i], true, indent + "    ") + "\n"
			}
			var str = str + indent + ")";
			break;
		case "function":
			str += obj;
			break;
		case "boolean":
			str += "Boolean: " + (obj ? "true" : "false");
			break
	}
	if (arguments[1]) {
		return str
	} else {
		alert(str)
	}
};
RGraph.Registry.Set = function(name, value) {
	RGraph.Registry.store[name] = value;
	return value
};
RGraph.Registry.Get = function(name) {
	return RGraph.Registry.store[name]
};
RGraph.background.Draw = function(obj) {
	var canvas = obj.canvas;
	var context = obj.context;
	var height = 0;
	var gutter = obj.Get("chart.gutter");
	var variant = obj.Get("chart.variant");
	context.fillStyle = obj.Get("chart.text.color");
	if (variant == "3d") {
		context.save();
		context.translate(10, -5)
	}
	if (typeof(obj.Get("chart.title.xaxis")) == "string" && obj.Get("chart.title.xaxis").length) {
		var size = obj.Get("chart.text.size");
		var font = obj.Get("chart.text.font");
		context.beginPath();
		RGraph.Text(context, font, size + 2, RGraph.GetWidth(obj) / 2, RGraph.GetHeight(obj) - (gutter * obj.Get("chart.title.xaxis.pos")), obj.Get("chart.title.xaxis"), "center", "center", false, false, false, true);
		context.fill()
	}
	if (typeof(obj.Get("chart.title.yaxis")) == "string" && obj.Get("chart.title.yaxis").length) {
		var size = obj.Get("chart.text.size");
		var font = obj.Get("chart.text.font");
		var angle = 270;
		var yaxis_title_pos = gutter * obj.Get("chart.title.yaxis.pos");
		if (obj.Get("chart.title.yaxis.position") == "right") {
			angle = 90;
			yaxis_title_pos = RGraph.GetWidth(obj) - yaxis_title_pos
		}
		context.beginPath();
		RGraph.Text(context, font, size + 2, yaxis_title_pos, RGraph.GetHeight(obj) / 2, obj.Get("chart.title.yaxis"), "center", "center", false, angle, false, true);
		context.fill()
	}
	obj.context.beginPath();
	context.fillStyle = obj.Get("chart.background.barcolor1");
	height = (RGraph.GetHeight(obj) - obj.Get("chart.gutter"));
	for (var i = gutter; i < height; i += 80) {
		obj.context.fillRect(gutter, i, RGraph.GetWidth(obj) - (gutter * 2), Math.min(40, RGraph.GetHeight(obj) - gutter - i))
	}
	context.fillStyle = obj.Get("chart.background.barcolor2");
	height = (RGraph.GetHeight(obj) - gutter);
	for (var i = (40 + gutter); i < height; i += 80) {
		obj.context.fillRect(gutter, i, RGraph.GetWidth(obj) - (gutter * 2), i + 40 > (RGraph.GetHeight(obj) - gutter) ? RGraph.GetHeight(obj) - (gutter + i) : 40)
	}
	context.stroke();
	if (obj.Get("chart.background.grid")) {
		if (obj.Get("chart.background.grid.autofit")) {
			if (obj.Get("chart.background.grid.autofit.align")) {
				obj.Set("chart.background.grid.autofit.numhlines", obj.Get("chart.ylabels.count"));
				if (obj.type == "line") {
					if (obj.Get("chart.labels") && obj.Get("chart.labels").length) {
						obj.Set("chart.background.grid.autofit.numvlines", obj.Get("chart.labels").length - 1)
					} else {
						obj.Set("chart.background.grid.autofit.numvlines", obj.data[0].length - 1)
					}
				} else {
					if (obj.type == "bar" && obj.Get("chart.labels") && obj.Get("chart.labels").length) {
						obj.Set("chart.background.grid.autofit.numvlines", obj.Get("chart.labels").length)
					}
				}
			}
			var vsize = (RGraph.GetWidth(obj) - (2 * obj.Get("chart.gutter")) - (obj.type == "gantt" ? 2 * obj.Get("chart.gutter") : 0)) / obj.Get("chart.background.grid.autofit.numvlines");
			var hsize = (RGraph.GetHeight(obj) - (2 * obj.Get("chart.gutter"))) / obj.Get("chart.background.grid.autofit.numhlines");
			obj.Set("chart.background.grid.vsize", vsize);
			obj.Set("chart.background.grid.hsize", hsize)
		}
		context.beginPath();
		context.lineWidth = obj.Get("chart.background.grid.width") ? obj.Get("chart.background.grid.width") : 1;
		context.strokeStyle = obj.Get("chart.background.grid.color");
		if (obj.Get("chart.background.grid.hlines")) {
			height = (RGraph.GetHeight(obj) - gutter);
			for (y = gutter; y < height; y += obj.Get("chart.background.grid.hsize")) {
				context.moveTo(gutter, y);
				context.lineTo(RGraph.GetWidth(obj) - gutter, y)
			}
		}
		if (obj.Get("chart.background.grid.vlines")) {
			var width = (RGraph.GetWidth(obj) - gutter);
			for (x = gutter + (obj.type == "gantt" ? (2 * gutter) : 0); x <= width; x += obj.Get("chart.background.grid.vsize")) {
				context.moveTo(x, gutter);
				context.lineTo(x, RGraph.GetHeight(obj) - gutter)
			}
		}
		if (obj.Get("chart.background.grid.border")) {
			context.strokeStyle = obj.Get("chart.background.grid.color");
			context.strokeRect(gutter, gutter, RGraph.GetWidth(obj) - (2 * gutter), RGraph.GetHeight(obj) - (2 * gutter))
		}
	}
	context.stroke();
	if (variant == "3d") {
		context.restore()
	}
	if (typeof(obj.Get("chart.title")) == "string") {
		if (obj.type == "gantt") {
			gutter /= 2
		}
		RGraph.DrawTitle(canvas, obj.Get("chart.title"), gutter, null, obj.Get("chart.text.size") + 2)
	}
	context.stroke()
};
RGraph.GetDays = function(obj) {
	var year = obj.getFullYear();
	var days = obj.getDate();
	var month = obj.getMonth();
	if (month == 0) {
		return days
	}
	if (month >= 1) {
		days += 31
	}
	if (month >= 2) {
		days += 28
	}
	if (year >= 2008 && year % 4 == 0) {
		days += 1
	}
	if (month >= 3) {
		days += 31
	}
	if (month >= 4) {
		days += 30
	}
	if (month >= 5) {
		days += 31
	}
	if (month >= 6) {
		days += 30
	}
	if (month >= 7) {
		days += 31
	}
	if (month >= 8) {
		days += 31
	}
	if (month >= 9) {
		days += 30
	}
	if (month >= 10) {
		days += 31
	}
	if (month >= 11) {
		days += 30
	}
	return days
};
RGraph.DrawKey = function(obj, key, colors) {
	var canvas = obj.canvas;
	var context = obj.context;
	context.lineWidth = 1;
	context.beginPath();
	var keypos = obj.Get("chart.key.position");
	var textsize = obj.Get("chart.text.size");
	var gutter = obj.Get("chart.gutter");
	if (typeof(obj.Get("chart.key.vpos")) == "number") {
		obj.Set("chart.key.position.y", obj.Get("chart.key.vpos") * gutter)
	}
	var key_non_null = [];
	var colors_non_null = [];
	for (var i = 0; i < key.length; ++i) {
		if (key[i] != null) {
			colors_non_null.push(colors[i]);
			key_non_null.push(key[i])
		}
	}
	key = key_non_null;
	colors = colors_non_null;
	if (keypos && keypos == "gutter") {
		RGraph.DrawKey_gutter(obj, key, colors)
	} else {
		if (keypos && keypos == "graph") {
			RGraph.DrawKey_graph(obj, key, colors)
		} else {
			alert("[COMMON] (" + obj.id + ") Unknown key position: " + keypos)
		}
	}
};
RGraph.DrawKey_graph = function(obj, key, colors) {
	var canvas = obj.canvas;
	var context = obj.context;
	var text_size = typeof(obj.Get("chart.key.text.size")) == "number" ? obj.Get("chart.key.text.size") : obj.Get("chart.text.size");
	var text_font = obj.Get("chart.text.font");
	var gutter = obj.Get("chart.gutter");
	var hpos = obj.Get("chart.yaxispos") == "right" ? gutter + 10 : RGraph.GetWidth(obj) - gutter - 10;
	var vpos = gutter + 10;
	var title = obj.Get("chart.title");
	var blob_size = text_size;
	var hmargin = 8;
	var vmargin = 4;
	var fillstyle = obj.Get("chart.key.background");
	var strokestyle = "black";
	var height = 0;
	var width = 0;
	obj.coordsKey = [];
	context.font = text_size + "pt " + obj.Get("chart.text.font");
	for (i = 0; i < key.length; ++i) {
		width = Math.max(width, context.measureText(key[i]).width)
	}
	width += 5;
	width += blob_size;
	width += 5;
	width += 5;
	width += 5;
	if (obj.Get("chart.yaxispos") == "left" || (obj.type == "pie" && !obj.Get("chart.yaxispos")) || (obj.type == "hbar" && !obj.Get("chart.yaxispos")) || (obj.type == "hbar" && obj.Get("chart.yaxispos") == "center") || (obj.type == "rscatter" && !obj.Get("chart.yaxispos")) || (obj.type == "tradar" && !obj.Get("chart.yaxispos")) || (obj.type == "rose" && !obj.Get("chart.yaxispos")) || (obj.type == "funnel" && !obj.Get("chart.yaxispos")) || (obj.type == "vprogress" && !obj.Get("chart.yaxispos")) || (obj.type == "hprogress" && !obj.Get("chart.yaxispos"))) {
		hpos -= width
	}
	if (typeof(obj.Get("chart.key.halign")) == "string") {
		if (obj.Get("chart.key.halign") == "left") {
			hpos = gutter + 10
		} else {
			if (obj.Get("chart.key.halign") == "right") {
				hpos = obj.canvas.width - gutter - width
			}
		}
	}
	if (typeof(obj.Get("chart.key.position.x")) == "number") {
		hpos = obj.Get("chart.key.position.x")
	}
	if (typeof(obj.Get("chart.key.position.y")) == "number") {
		vpos = obj.Get("chart.key.position.y")
	}
	if (obj.Get("chart.key.shadow")) {
		context.shadowColor = obj.Get("chart.key.shadow.color");
		context.shadowBlur = obj.Get("chart.key.shadow.blur");
		context.shadowOffsetX = obj.Get("chart.key.shadow.offsetx");
		context.shadowOffsetY = obj.Get("chart.key.shadow.offsety")
	}
	context.beginPath();
	context.fillStyle = obj.Get("chart.key.background");
	context.strokeStyle = "black";
	if (arguments[3] != false) {
		context.lineWidth = obj.Get("chart.key.linewidth") ? obj.Get("chart.key.linewidth") : 1;
		if (obj.Get("chart.key.rounded") == true) {
			context.beginPath();
			context.strokeStyle = strokestyle;
			RGraph.strokedCurvyRect(context, hpos, vpos, width - 5, 5 + ((text_size + 5) * RGraph.getKeyLength(key)), 4);
			context.stroke();
			context.fill();
			RGraph.NoShadow(obj)
		} else {
			context.strokeRect(hpos, vpos, width - 5, 5 + ((text_size + 5) * RGraph.getKeyLength(key)));
			context.fillRect(hpos, vpos, width - 5, 5 + ((text_size + 5) * RGraph.getKeyLength(key)))
		}
	}
	RGraph.NoShadow(obj);
	context.beginPath();
	for (var i = key.length - 1; i >= 0; i--) {
		var j = Number(i) + 1;
		if (obj.Get("chart.key.color.shape") == "circle") {
			context.beginPath();
			context.strokeStyle = "rgba(0,0,0,0)";
			context.fillStyle = colors[i];
			context.arc(hpos + 5 + (blob_size / 2), vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2), blob_size / 2, 0, 6.26, 0);
			context.fill()
		} else {
			if (obj.Get("chart.key.color.shape") == "line") {
				context.beginPath();
				context.strokeStyle = colors[i];
				context.moveTo(hpos + 5, vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2));
				context.lineTo(hpos + blob_size + 5, vpos + (5 * j) + (text_size * j) - text_size + (blob_size / 2));
				context.stroke()
			} else {
				context.fillStyle = colors[i];
				context.fillRect(hpos + 5, vpos + (5 * j) + (text_size * j) - text_size, text_size, text_size + 1)
			}
		}
		context.beginPath();
		context.fillStyle = "black";
		RGraph.Text(context, text_font, text_size, hpos + blob_size + 5 + 5, vpos + (5 * j) + (text_size * j), key[i]);
		if (obj.Get("chart.key.interactive")) {
			var px = hpos + 5;
			var py = vpos + (5 * j) + (text_size * j) - text_size;
			var pw = width - 5 - 5 - 5;
			var ph = text_size;
			obj.coordsKey.push([px, py, pw, ph])
		}
	}
	context.fill();
	if (obj.Get("chart.key.interactive")) {
		RGraph.Register(obj);
		var key_mousemove = function(e) {
			var obj = e.target.__object__;
			var canvas = obj.canvas;
			var context = obj.context;
			var mouseCoords = RGraph.getMouseXY(e);
			var mouseX = mouseCoords[0];
			var mouseY = mouseCoords[1];
			for (var i = 0; i < obj.coordsKey.length; ++i) {
				var px = obj.coordsKey[i][0];
				var py = obj.coordsKey[i][1];
				var pw = obj.coordsKey[i][2];
				var ph = obj.coordsKey[i][3];
				if (mouseX > px && mouseX < (px + pw) && mouseY > py && mouseY < (py + ph)) {
					canvas.style.cursor = "pointer";
					return
				}
				canvas.style.cursor = "default"
			}
		};
		canvas.addEventListener("mousemove", key_mousemove, false);
		RGraph.AddEventListener(canvas.id, "mousemove", key_mousemove);
		var key_click = function(e) {
			RGraph.Redraw();
			var obj = e.target.__object__;
			var canvas = obj.canvas;
			var context = obj.context;
			var mouseCoords = RGraph.getMouseXY(e);
			var mouseX = mouseCoords[0];
			var mouseY = mouseCoords[1];
			RGraph.DrawKey(obj, obj.Get("chart.key"), obj.Get("chart.colors"));
			for (var i = 0; i < obj.coordsKey.length; ++i) {
				var px = obj.coordsKey[i][0];
				var py = obj.coordsKey[i][1];
				var pw = obj.coordsKey[i][2];
				var ph = obj.coordsKey[i][3];
				if (mouseX > px && mouseX < (px + pw) && mouseY > py && mouseY < (py + ph)) {
					var index = obj.coordsKey.length - i - 1;
					context.beginPath();
					context.strokeStyle = "rgba(0,0,0,0.5)";
					context.lineWidth = obj.Get("chart.linewidth") + 2;
					for (var j = 0; j < obj.coords2[index].length; ++j) {
						var x = obj.coords2[index][j][0];
						var y = obj.coords2[index][j][1];
						if (j == 0) {
							context.moveTo(x, y)
						} else {
							context.lineTo(x, y)
						}
					}
					context.stroke();
					context.lineWidth = 1;
					context.beginPath();
					context.strokeStyle = "black";
					context.fillStyle = "white";
					RGraph.SetShadow(obj, "rgba(0,0,0,0.5)", 0, 0, 10);
					context.strokeRect(px - 2, py - 2, pw + 4, ph + 4);
					context.fillRect(px - 2, py - 2, pw + 4, ph + 4);
					context.stroke();
					context.fill();
					RGraph.NoShadow(obj);
					context.beginPath();
					context.fillStyle = obj.Get("chart.colors")[obj.Get("chart.colors").length - i - 1];
					context.fillRect(px, py, blob_size, blob_size);
					context.fill();
					context.beginPath();
					context.fillStyle = obj.Get("chart.text.color");
					RGraph.Text(context, obj.Get("chart.text.font"), obj.Get("chart.text.size"), px + 5 + blob_size, py + ph, obj.Get("chart.key")[obj.Get("chart.key").length - i - 1]);
					context.fill();
					canvas.style.cursor = "pointer";
					return
				}
				canvas.style.cursor = "default"
			}
		};
		canvas.addEventListener("click", key_click, false);
		RGraph.AddEventListener(canvas.id, "click", key_click)
	}
};
RGraph.DrawKey_gutter = function(obj, key, colors) {
	var canvas = obj.canvas;
	var context = obj.context;
	var text_size = typeof(obj.Get("chart.key.text.size")) == "number" ? obj.Get("chart.key.text.size") : obj.Get("chart.text.size");
	var text_font = obj.Get("chart.text.font");
	var gutter = obj.Get("chart.gutter");
	var hpos = RGraph.GetWidth(obj) / 2;
	var vpos = (gutter / 2) - 5;
	var title = obj.Get("chart.title");
	var blob_size = text_size;
	var hmargin = 8;
	var vmargin = 4;
	var fillstyle = obj.Get("chart.key.background");
	var strokestyle = "black";
	var length = 0;
	context.font = text_size + "pt " + text_font;
	for (i = 0; i < key.length; ++i) {
		length += hmargin;
		length += blob_size;
		length += hmargin;
		length += context.measureText(key[i]).width
	}
	length += hmargin;
	if (obj.type == "pie") {
		if (obj.Get("chart.align") == "left") {
			var hpos = obj.radius + obj.Get("chart.gutter")
		} else {
			if (obj.Get("chart.align") == "right") {
				var hpos = obj.canvas.width - obj.radius - obj.Get("chart.gutter")
			} else {
				hpos = canvas.width / 2
			}
		}
	}
	hpos -= (length / 2);
	if (typeof(obj.Get("chart.key.position.x")) == "number") {
		hpos = obj.Get("chart.key.position.x")
	}
	if (typeof(obj.Get("chart.key.position.y")) == "number") {
		vpos = obj.Get("chart.key.position.y")
	}
	if (obj.Get("chart.key.position.gutter.boxed")) {
		if (obj.Get("chart.key.shadow")) {
			context.shadowColor = obj.Get("chart.key.shadow.color");
			context.shadowBlur = obj.Get("chart.key.shadow.blur");
			context.shadowOffsetX = obj.Get("chart.key.shadow.offsetx");
			context.shadowOffsetY = obj.Get("chart.key.shadow.offsety")
		}
		context.beginPath();
		context.fillStyle = fillstyle;
		context.strokeStyle = strokestyle;
		if (obj.Get("chart.key.rounded")) {
			RGraph.strokedCurvyRect(context, hpos, vpos - vmargin, length, text_size + vmargin + vmargin)
		} else {
			context.strokeRect(hpos, vpos - vmargin, length, text_size + vmargin + vmargin);
			context.fillRect(hpos, vpos - vmargin, length, text_size + vmargin + vmargin)
		}
		context.stroke();
		context.fill();
		RGraph.NoShadow(obj)
	}
	for (var i = 0, pos = hpos; i < key.length; ++i) {
		pos += hmargin;
		if (obj.Get("chart.key.color.shape") == "line") {
			context.beginPath();
			context.strokeStyle = colors[i];
			context.moveTo(pos, vpos + (blob_size / 2));
			context.lineTo(pos + blob_size, vpos + (blob_size / 2));
			context.stroke()
		} else {
			if (obj.Get("chart.key.color.shape") == "circle") {
				context.beginPath();
				context.fillStyle = colors[i];
				context.moveTo(pos, vpos + (blob_size / 2));
				context.arc(pos + (blob_size / 2), vpos + (blob_size / 2), (blob_size / 2), 0, 6.28, 0);
				context.fill()
			} else {
				context.beginPath();
				context.fillStyle = colors[i];
				context.fillRect(pos, vpos, blob_size, blob_size);
				context.fill()
			}
		}
		pos += blob_size;
		pos += hmargin;
		context.beginPath();
		context.fillStyle = "black";
		RGraph.Text(context, text_font, text_size, pos, vpos + text_size - 1, key[i]);
		context.fill();
		pos += context.measureText(key[i]).width
	}
};
RGraph.getKeyLength = function(key) {
	var len = 0;
	for (var i = 0; i < key.length; ++i) {
		if (key[i] != null) {
			++len
		}
	}
	return len
};

function pd(variable) {
	RGraph.pr(variable)
}

function p(variable) {
	RGraph.pr(variable)
}

function cl(variable) {
	return console.log(variable)
}
RGraph.array_clone = function(obj) {
	if (obj == null || typeof(obj) != "object") {
		return obj
	}
	var temp = [];
	for (var i = 0; i < obj.length; ++i) {
		temp[i] = RGraph.array_clone(obj[i])
	}
	return temp
};
RGraph.array_reverse = function(arr) {
	var newarr = [];
	for (var i = arr.length - 1; i >= 0; i--) {
		newarr.push(arr[i])
	}
	return newarr
};
RGraph.number_format = function(obj, num) {
	var i;
	var prepend = arguments[2] ? String(arguments[2]) : "";
	var append = arguments[3] ? String(arguments[3]) : "";
	var output = "";
	var decimal = "";
	var decimal_seperator = obj.Get("chart.scale.point") ? obj.Get("chart.scale.point") : ".";
	var thousand_seperator = obj.Get("chart.scale.thousand") ? obj.Get("chart.scale.thousand") : ",";
	RegExp.$1 = "";
	var i, j;
	if (typeof(obj.Get("chart.scale.formatter")) == "function") {
		return obj.Get("chart.scale.formatter")(obj, num)
	}
	if (String(num).indexOf("e") > 0) {
		return String(prepend + String(num) + append)
	}
	num = String(num);
	if (num.indexOf(".") > 0) {
		num = num.replace(/\.(.*)/, "");
		decimal = RegExp.$1
	}
	var seperator = thousand_seperator;
	var foundPoint;
	for (i = (num.length - 1), j = 0; i >= 0; j++, i--) {
		var character = num.charAt(i);
		if (j % 3 == 0 && j != 0) {
			output += seperator
		}
		output += character
	}
	var rev = output;
	output = "";
	for (i = (rev.length - 1); i >= 0; i--) {
		output += rev.charAt(i)
	}
	output = output.replace(/^-,/, "-");
	if (decimal.length) {
		output = output + decimal_seperator + decimal;
		decimal = "";
		RegExp.$1 = ""
	}
	if (output.charAt(0) == "-") {
		output *= -1;
		prepend = "-" + prepend
	}
	return prepend + output + append
};
RGraph.DrawBars = function(obj) {
	var hbars = obj.Get("chart.background.hbars");
	obj.context.beginPath();
	for (i = 0; i < hbars.length; ++i) {
		if (hbars[i][1] == null) {
			hbars[i][1] = obj.max
		} else {
			if (hbars[i][0] + hbars[i][1] > obj.max) {
				hbars[i][1] = obj.max - hbars[i][0]
			}
		}
		if (Math.abs(hbars[i][1]) > obj.max) {
			hbars[i][1] = -1 * obj.max
		}
		if (Math.abs(hbars[i][0]) > obj.max) {
			hbars[i][0] = obj.max
		}
		if (hbars[i][0] + hbars[i][1] < (-1 * obj.max)) {
			hbars[i][1] = -1 * (obj.max + hbars[i][0])
		}
		if (obj.Get("chart.xaxispos") == "bottom" && (hbars[i][0] < 0 || (hbars[i][1] + hbars[i][1] < 0))) {
			alert("[" + obj.type.toUpperCase() + " (ID: " + obj.id + ") BACKGROUND HBARS] You have a negative value in one of your background hbars values, whilst the X axis is in the center")
		}
		var ystart = (obj.grapharea - ((hbars[i][0] / obj.max) * obj.grapharea));
		var height = (Math.min(hbars[i][1], obj.max - hbars[i][0]) / obj.max) * obj.grapharea;
		if (obj.Get("chart.xaxispos") == "center") {
			ystart /= 2;
			height /= 2
		}
		ystart += obj.Get("chart.gutter");
		var x = obj.Get("chart.gutter");
		var y = ystart - height;
		var w = obj.canvas.width - (2 * obj.Get("chart.gutter"));
		var h = height;
		if (navigator.userAgent.indexOf("Opera") != -1 && obj.Get("chart.xaxispos") == "center" && h < 0) {
			h *= -1;
			y = y - h
		}
		obj.context.fillStyle = hbars[i][2];
		obj.context.fillRect(x, y, w, h)
	}
	obj.context.fill()
};
RGraph.DrawInGraphLabels = function(obj) {
	var canvas = obj.canvas;
	var context = obj.context;
	var labels = obj.Get("chart.labels.ingraph");
	var labels_processed = [];
	var fgcolor = "black";
	var bgcolor = "white";
	var direction = 1;
	if (!labels) {
		return
	}
	for (var i = 0; i < labels.length; ++i) {
		if (typeof(labels[i]) == "number") {
			for (var j = 0; j < labels[i]; ++j) {
				labels_processed.push(null)
			}
		} else {
			if (typeof(labels[i]) == "string" || typeof(labels[i]) == "object") {
				labels_processed.push(labels[i])
			} else {
				labels_processed.push("")
			}
		}
	}
	RGraph.NoShadow(obj);
	if (labels_processed && labels_processed.length > 0) {
		for (var i = 0; i < labels_processed.length; ++i) {
			if (labels_processed[i]) {
				var coords = obj.coords[i];
				if (coords && coords.length > 0) {
					var x = (obj.type == "bar" ? coords[0] + (coords[2] / 2) : coords[0]);
					var y = (obj.type == "bar" ? coords[1] + (coords[3] / 2) : coords[1]);
					var length = typeof(labels_processed[i][4]) == "number" ? labels_processed[i][4] : 25;
					context.beginPath();
					context.fillStyle = "black";
					context.strokeStyle = "black";
					if (obj.type == "bar") {
						if (obj.Get("chart.variant") == "dot") {
							context.moveTo(x, obj.coords[i][1] - 5);
							context.lineTo(x, obj.coords[i][1] - 5 - length);
							var text_x = x;
							var text_y = obj.coords[i][1] - 5 - length
						} else {
							if (obj.Get("chart.variant") == "arrow") {
								context.moveTo(x, obj.coords[i][1] - 5);
								context.lineTo(x, obj.coords[i][1] - 5 - length);
								var text_x = x;
								var text_y = obj.coords[i][1] - 5 - length
							} else {
								context.arc(x, y, 2.5, 0, 6.28, 0);
								context.moveTo(x, y);
								context.lineTo(x, y - length);
								var text_x = x;
								var text_y = y - length
							}
						}
						context.stroke();
						context.fill()
					} else {
						if (obj.type == "line") {
							if (typeof(labels_processed[i]) == "object" && typeof(labels_processed[i][3]) == "number" && labels_processed[i][3] == -1) {
								context.moveTo(x, y + 5);
								context.lineTo(x, y + 5 + length);
								context.stroke();
								context.beginPath();
								context.moveTo(x, y + 5);
								context.lineTo(x - 3, y + 10);
								context.lineTo(x + 3, y + 10);
								context.closePath();
								var text_x = x;
								var text_y = y + 5 + length
							} else {
								var text_x = x;
								var text_y = y - 5 - length;
								context.moveTo(x, y - 5);
								context.lineTo(x, y - 5 - length);
								context.stroke();
								context.beginPath();
								context.moveTo(x, y - 5);
								context.lineTo(x - 3, y - 10);
								context.lineTo(x + 3, y - 10);
								context.closePath()
							}
							context.fill()
						}
					}
					context.beginPath();
					context.fillStyle = (typeof(labels_processed[i]) == "object" && typeof(labels_processed[i][1]) == "string") ? labels_processed[i][1] : "black";
					RGraph.Text(context, obj.Get("chart.text.font"), obj.Get("chart.text.size"), text_x, text_y, (typeof(labels_processed[i]) == "object" && typeof(labels_processed[i][0]) == "string") ? labels_processed[i][0] : labels_processed[i], "bottom", "center", true, null, (typeof(labels_processed[i]) == "object" && typeof(labels_processed[i][2]) == "string") ? labels_processed[i][2] : "white");
					context.fill()
				}
			}
		}
	}
};
RGraph.FixEventObject = function(e) {
	if (RGraph.isIE8()) {
		var e = event;
		e.pageX = (event.clientX + document.body.scrollLeft);
		e.pageY = (event.clientY + document.body.scrollTop);
		e.target = event.srcElement;
		if (!document.body.scrollTop && document.documentElement.scrollTop) {
			e.pageX += parseInt(document.documentElement.scrollLeft);
			e.pageY += parseInt(document.documentElement.scrollTop)
		}
	}
	if (typeof(e.offsetX) == "undefined" && typeof(e.offsetY) == "undefined") {
		var coords = RGraph.getMouseXY(e);
		e.offsetX = coords[0];
		e.offsetY = coords[1]
	}
	if (!e.stopPropagation) {
		e.stopPropagation = function() {
			window.event.cancelBubble = true
		}
	}
	return e
};
RGraph.DrawCrosshairs = function(obj) {
	if (obj.Get("chart.crosshairs")) {
		var canvas = obj.canvas;
		var context = obj.context;
		canvas.onmousemove = function(e) {
			var e = RGraph.FixEventObject(e);
			var canvas = obj.canvas;
			var context = obj.context;
			var gutter = obj.Get("chart.gutter");
			var width = canvas.width;
			var height = canvas.height;
			var adjustments = obj.Get("chart.tooltips.coords.adjust");
			var mouseCoords = RGraph.getMouseXY(e);
			var x = mouseCoords[0];
			var y = mouseCoords[1];
			if (typeof(adjustments) == "object" && adjustments[0] && adjustments[1]) {
				x = x - adjustments[0];
				y = y - adjustments[1]
			}
			RGraph.Clear(canvas);
			obj.Draw();
			if (x >= gutter && y >= gutter && x <= (width - gutter) && y <= (height - gutter)) {
				var linewidth = obj.Get("chart.crosshairs.linewidth");
				context.lineWidth = linewidth ? linewidth : 1;
				context.beginPath();
				context.strokeStyle = obj.Get("chart.crosshairs.color");
				context.moveTo(x, gutter);
				context.lineTo(x, height - gutter);
				context.moveTo(gutter, y);
				context.lineTo(width - gutter, y);
				context.stroke();
				if (obj.Get("chart.crosshairs.coords")) {
					if (obj.type == "scatter") {
						var xCoord = (((x - obj.Get("chart.gutter")) / (obj.canvas.width - (2 * obj.Get("chart.gutter")))) * (obj.Get("chart.xmax") - obj.Get("chart.xmin"))) + obj.Get("chart.xmin");
						xCoord = xCoord.toFixed(obj.Get("chart.scale.decimals"));
						var yCoord = obj.max - (((y - obj.Get("chart.gutter")) / (obj.canvas.height - (2 * obj.Get("chart.gutter")))) * obj.max);
						if (obj.type == "scatter" && obj.Get("chart.xaxispos") == "center") {
							yCoord = (yCoord - (obj.max / 2)) * 2
						}
						yCoord = yCoord.toFixed(obj.Get("chart.scale.decimals"));
						var div = RGraph.Registry.Get("chart.coordinates.coords.div");
						var mouseCoords = RGraph.getMouseXY(e);
						var canvasXY = RGraph.getCanvasXY(canvas);
						if (!div) {
							div = document.createElement("DIV");
							div.__object__ = obj;
							div.style.position = "absolute";
							div.style.backgroundColor = "white";
							div.style.border = "1px solid black";
							div.style.fontFamily = "Arial, Verdana, sans-serif";
							div.style.fontSize = "10pt";
							div.style.padding = "2px";
							div.style.opacity = 1;
							div.style.WebkitBorderRadius = "3px";
							div.style.borderRadius = "3px";
							div.style.MozBorderRadius = "3px";
							document.body.appendChild(div);
							RGraph.Registry.Set("chart.coordinates.coords.div", div)
						}
						div.style.opacity = 1;
						div.style.display = "inline";
						if (!obj.Get("chart.crosshairs.coords.fixed")) {
							div.style.left = Math.max(2, (e.pageX - div.offsetWidth - 3)) + "px";
							div.style.top = Math.max(2, (e.pageY - div.offsetHeight - 3)) + "px"
						} else {
							div.style.left = canvasXY[0] + obj.Get("chart.gutter") + 3 + "px";
							div.style.top = canvasXY[1] + obj.Get("chart.gutter") + 3 + "px"
						}
						div.innerHTML = '<span style="color: #666">' + obj.Get("chart.crosshairs.coords.labels.x") + ":</span> " + xCoord + '<br><span style="color: #666">' + obj.Get("chart.crosshairs.coords.labels.y") + ":</span> " + yCoord;
						canvas.addEventListener("mouseout", RGraph.HideCrosshairCoords, false)
					} else {
						alert("[RGRAPH] Showing crosshair coordinates is only supported on the Scatter chart")
					}
				}
			} else {
				RGraph.HideCrosshairCoords()
			}
		}
	}
};
RGraph.HideCrosshairCoords = function() {
	var div = RGraph.Registry.Get("chart.coordinates.coords.div");
	if (div && div.style.opacity == 1 && div.__object__.Get("chart.crosshairs.coords.fadeout")) {
		setTimeout(function() {
			RGraph.Registry.Get("chart.coordinates.coords.div").style.opacity = 0.9
		}, 50);
		setTimeout(function() {
			RGraph.Registry.Get("chart.coordinates.coords.div").style.opacity = 0.8
		}, 100);
		setTimeout(function() {
			RGraph.Registry.Get("chart.coordinates.coords.div").style.opacity = 0.7
		}, 150);
		setTimeout(function() {
			RGraph.Registry.Get("chart.coordinates.coords.div").style.opacity = 0.6
		}, 200);
		setTimeout(function() {
			RGraph.Registry.Get("chart.coordinates.coords.div").style.opacity = 0.5
		}, 250);
		setTimeout(function() {
			RGraph.Registry.Get("chart.coordinates.coords.div").style.opacity = 0.4
		}, 300);
		setTimeout(function() {
			RGraph.Registry.Get("chart.coordinates.coords.div").style.opacity = 0.3
		}, 350);
		setTimeout(function() {
			RGraph.Registry.Get("chart.coordinates.coords.div").style.opacity = 0.2
		}, 400);
		setTimeout(function() {
			RGraph.Registry.Get("chart.coordinates.coords.div").style.opacity = 0.1
		}, 450);
		setTimeout(function() {
			RGraph.Registry.Get("chart.coordinates.coords.div").style.opacity = 0
		}, 500);
		setTimeout(function() {
			RGraph.Registry.Get("chart.coordinates.coords.div").style.display = "none"
		}, 550)
	}
};
RGraph.rtrim = function(str) {
	return str.replace(/( |\n|\r|\t)+$/, "")
};
RGraph.Draw3DAxes = function(obj) {
	var gutter = obj.Get("chart.gutter");
	var context = obj.context;
	var canvas = obj.canvas;
	context.strokeStyle = "#aaa";
	context.fillStyle = "#ddd";
	context.beginPath();
	context.moveTo(gutter, gutter);
	context.lineTo(gutter + 10, gutter - 5);
	context.lineTo(gutter + 10, canvas.height - gutter - 5);
	context.lineTo(gutter, canvas.height - gutter);
	context.closePath();
	context.stroke();
	context.fill();
	context.beginPath();
	context.moveTo(gutter, canvas.height - gutter);
	context.lineTo(gutter + 10, canvas.height - gutter - 5);
	context.lineTo(canvas.width - gutter + 10, canvas.height - gutter - 5);
	context.lineTo(canvas.width - gutter, canvas.height - gutter);
	context.closePath();
	context.stroke();
	context.fill()
};
RGraph.NoShadow = function(obj) {
	obj.context.shadowColor = "rgba(0,0,0,0)";
	obj.context.shadowBlur = 0;
	obj.context.shadowOffsetX = 0;
	obj.context.shadowOffsetY = 0
};
RGraph.SetShadow = function(obj, color, offsetx, offsety, blur) {
	obj.context.shadowColor = color;
	obj.context.shadowOffsetX = offsetx;
	obj.context.shadowOffsetY = offsety;
	obj.context.shadowBlur = blur
};
RGraph.OldBrowserCompat = function(context) {
	if (!context.measureText){
		context.measureText = function(text) {
			var textObj = document.createElement("DIV");
			textObj.innerHTML = text;
			textObj.style.backgroundColor = "white";
			textObj.style.position = "absolute";
			textObj.style.top = -100;
			textObj.style.left = 0;
			document.body.appendChild(textObj);
			var width = {
				width: textObj.offsetWidth
			};
			textObj.style.display = "none";
			return width
		}
	}
	if (!context.fillText) {
		context.fillText = function(text, targetX, targetY) {
			return false
		}
	}
	if (!context.canvas.addEventListener) {
		window.addEventListener = function(ev, func, bubble) {
			return this.attachEvent("on" + ev, func)
		};
		context.canvas.addEventListener = function(ev, func, bubble) {
			return this.attachEvent("on" + ev, func)
		}
	}
};
RGraph.Async = function(func) {
	return setTimeout(func, arguments[1] ? arguments[1] : 1)
};
RGraph.random = function(min, max) {
	var dp = arguments[2] ? arguments[2] : 0;
	var r = Math.random();
	return Number((((max - min) * r) + min).toFixed(dp))
};
RGraph.strokedCurvyRect = function(context, x, y, w, h) {
	var r = arguments[5] ? arguments[5] : 3;
	var corner_tl = (arguments[6] || arguments[6] == null) ? true : false;
	var corner_tr = (arguments[7] || arguments[7] == null) ? true : false;
	var corner_br = (arguments[8] || arguments[8] == null) ? true : false;
	var corner_bl = (arguments[9] || arguments[9] == null) ? true : false;
	context.beginPath();
	context.moveTo(x + (corner_tl ? r : 0), y);
	context.lineTo(x + w - (corner_tr ? r : 0), y);
	if (corner_tr) {
		context.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2, false)
	}
	context.lineTo(x + w, y + h - (corner_br ? r : 0));
	if (corner_br) {
		context.arc(x + w - r, y - r + h, r, Math.PI * 2, Math.PI * 0.5, false)
	}
	context.lineTo(x + (corner_bl ? r : 0), y + h);
	if (corner_bl) {
		context.arc(x + r, y - r + h, r, Math.PI * 0.5, Math.PI, false)
	}
	context.lineTo(x, y + (corner_tl ? r : 0));
	if (corner_tl) {
		context.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
	}
	context.stroke()
};
RGraph.filledCurvyRect = function(context, x, y, w, h) {
	var r = arguments[5] ? arguments[5] : 3;
	var corner_tl = (arguments[6] || arguments[6] == null) ? true : false;
	var corner_tr = (arguments[7] || arguments[7] == null) ? true : false;
	var corner_br = (arguments[8] || arguments[8] == null) ? true : false;
	var corner_bl = (arguments[9] || arguments[9] == null) ? true : false;
	context.beginPath();
	if (corner_tl) {
		context.moveTo(x + r, y + r);
		context.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI, false)
	} else {
		context.fillRect(x, y, r, r)
	}
	if (corner_tr) {
		context.moveTo(x + w - r, y + r);
		context.arc(x + w - r, y + r, r, 1.5 * Math.PI, 0, false)
	} else {
		context.moveTo(x + w - r, y);
		context.fillRect(x + w - r, y, r, r)
	}
	if (corner_br) {
		context.moveTo(x + w - r, y + h - r);
		context.arc(x + w - r, y - r + h, r, 0, Math.PI / 2, false)
	} else {
		context.moveTo(x + w - r, y + h - r);
		context.fillRect(x + w - r, y + h - r, r, r)
	}
	if (corner_bl) {
		context.moveTo(x + r, y + h - r);
		context.arc(x + r, y - r + h, r, Math.PI / 2, Math.PI, false)
	} else {
		context.moveTo(x, y + h - r);
		context.fillRect(x, y + h - r, r, r)
	}
	context.fillRect(x + r, y, w - r - r, h);
	context.fillRect(x, y + r, r + 1, h - r - r);
	context.fillRect(x + w - r - 1, y + r, r + 1, h - r - r);
	context.fill()
};
RGraph.Timer = function(label) {
	var d = new Date();
	console.log(label + ": " + d.getSeconds() + "." + d.getMilliseconds())
};
RGraph.HidePalette = function() {
	var div = RGraph.Registry.Get("palette");
	if (typeof(div) == "object" && div) {
		div.style.visibility = "hidden";
		div.style.display = "none";
		RGraph.Registry.Set("palette", null)
	}
};
RGraph.HideZoomedCanvas = function() {
	if (typeof(__zoomedimage__) == "object") {
		obj = __zoomedimage__.obj
	} else {
		return
	}
	if (obj.Get("chart.zoom.fade.out")) {
		for (var i = 10, j = 1; i >= 0; --i, ++j) {
			if (typeof(__zoomedimage__) == "object") {
				setTimeout("__zoomedimage__.style.opacity = " + String(i / 10), j * 30)
			}
		}
		if (typeof(__zoomedbackground__) == "object") {
			setTimeout("__zoomedbackground__.style.opacity = " + String(i / 10), j * 30)
		}
	}
	if (typeof(__zoomedimage__) == "object") {
		setTimeout("__zoomedimage__.style.display = 'none'", obj.Get("chart.zoom.fade.out") ? 310 : 0)
	}
	if (typeof(__zoomedbackground__) == "object") {
		setTimeout("__zoomedbackground__.style.display = 'none'", obj.Get("chart.zoom.fade.out") ? 310 : 0)
	}
};
RGraph.AddCustomEventListener = function(obj, name, func) {
	if (typeof(RGraph.events[obj.id]) == "undefined") {
		RGraph.events[obj.id] = []
	}
	RGraph.events[obj.id].push([obj, name, func]);
	return RGraph.events[obj.id].length - 1
};
RGraph.FireCustomEvent = function(obj, name) {
	if (obj && obj.isRGraph) {
		var id = obj.id;
		if (typeof(id) == "string" && typeof(RGraph.events) == "object" && typeof(RGraph.events[id]) == "object" && RGraph.events[id].length > 0) {
			for (var j = 0; j < RGraph.events[id].length; ++j) {
				if (RGraph.events[id][j] && RGraph.events[id][j][1] == name) {
					RGraph.events[id][j][2](obj)
				}
			}
		}
	}
};
RGraph.isIE8 = function() {
	return navigator.userAgent.indexOf("MSIE 8") > 0
};
RGraph.isIE9 = function() {
	return navigator.userAgent.indexOf("MSIE 9") > 0
};
RGraph.isIE9up = function() {
	navigator.userAgent.match(/MSIE (\d+)/);
	return Number(RegExp.$1) >= 9
};
RGraph.ClearEventListeners = function(id) {
	for (var i = 0; i < RGraph.Registry.Get("chart.event.handlers").length; ++i) {
		var el = RGraph.Registry.Get("chart.event.handlers")[i];
		if (el && (el[0] == id || el[0] == ("window_" + id))) {
			if (el[0].substring(0, 7) == "window_") {
				window.removeEventListener(el[1], el[2], false)
			} else {
				document.getElementById(id).removeEventListener(el[1], el[2], false)
			}
			RGraph.Registry.Get("chart.event.handlers")[i] = null
		}
	}
};
RGraph.AddEventListener = function(id, e, func) {
	RGraph.Registry.Get("chart.event.handlers").push([id, e, func])
};
RGraph.getGutterSuggest = function(obj, data) {
	var str = RGraph.number_format(obj, RGraph.array_max(RGraph.getScale(RGraph.array_max(data), obj)), obj.Get("chart.units.pre"), obj.Get("chart.units.post"));
	if (obj.type == "hbar") {
		var str = "";
		var len = 0;
		for (var i = 0; i < obj.Get("chart.labels").length; ++i) {
			str = (obj.Get("chart.labels").length > str.length ? obj.Get("chart.labels")[i] : str)
		}
	}
	obj.context.font = obj.Get("chart.text.size") + "pt " + obj.Get("chart.text.font");
	len = obj.context.measureText(str).width + 5;
	return (obj.type == "hbar" ? len / 3 : len)
};
RGraph.array_shift = function(arr) {
	var ret = [];
	for (var i = 1; i < arr.length; ++i) {
		ret.push(arr[i])
	}
	return ret
};
RGraph.SetConfig = function(obj, c) {
	for (i in c) {
		if (typeof(i) == "string") {
			obj.Set(i, c[i])
		}
	}
	return obj
};
RGraph.GetHeight = function(obj) {
	var height = obj.Get("chart.height");
	return height ? height : obj.canvas.height
};
RGraph.GetWidth = function(obj) {
	var width = obj.Get("chart.width");
	return width ? width : obj.canvas.width
};
RGraph.RemoveAllCustomEventListeners = function() {
	var id = arguments[0];
	if (id && RGraph.events[id]) {
		RGraph.events[id] = []
	} else {
		RGraph.events = []
	}
};
RGraph.RemoveCustomEventListener = function(obj, i) {
	if (typeof(RGraph.events) == "object" && typeof(RGraph.events[obj.id]) == "object" && typeof(RGraph.events[obj.id][i]) == "object") {
		RGraph.events[obj.id][i] = null
	}
};
if (typeof(RGraph) == "undefined") {
	RGraph = {}
}
RGraph.Line = function(id) {
	this.id = id;
	this.canvas = document.getElementById(id);
	this.context = this.canvas.getContext ? this.canvas.getContext("2d") : null;
	this.canvas.__object__ = this;
	this.type = "line";
	this.max = 0;
	this.coords = [];
	this.coords2 = [];
	this.coords.key = [];
	this.hasnegativevalues = false;
	this.isRGraph = true;
	RGraph.OldBrowserCompat(this.context);
	this.properties = {
		"chart.width": null,
		"chart.height": null,
		"chart.background.barcolor1": "rgba(0,0,0,0)",
		"chart.background.barcolor2": "rgba(0,0,0,0)",
		"chart.background.grid": 1,
		"chart.background.grid.width": 1,
		"chart.background.grid.hsize": 25,
		"chart.background.grid.vsize": 25,
		"chart.background.grid.color": "#ddd",
		"chart.background.grid.vlines": true,
		"chart.background.grid.hlines": true,
		"chart.background.grid.border": true,
		"chart.background.grid.autofit": false,
		"chart.background.grid.autofit.align": false,
		"chart.background.grid.autofit.numhlines": 7,
		"chart.background.grid.autofit.numvlines": 20,
		"chart.background.hbars": null,
		"chart.labels": null,
		"chart.labels.ingraph": null,
		"chart.labels.above": false,
		"chart.labels.above.size": 8,
		"chart.xtickgap": 20,
		"chart.smallxticks": 3,
		"chart.largexticks": 5,
		"chart.ytickgap": 20,
		"chart.smallyticks": 3,
		"chart.largeyticks": 5,
		"chart.linewidth": 1,
		"chart.colors": ["red", "#0f0", "#00f", "#f0f", "#ff0", "#0ff"],
		"chart.hmargin": 0,
		"chart.tickmarks.dot.color": "white",
		"chart.tickmarks": null,
		"chart.ticksize": 3,
		"chart.gutter": 25,
		"chart.tickdirection": -1,
		"chart.yaxispoints": 5,
		"chart.fillstyle": null,
		"chart.xaxispos": "bottom",
		"chart.yaxispos": "left",
		"chart.xticks": null,
		"chart.text.size": 10,
		"chart.text.angle": 0,
		"chart.text.color": "black",
		"chart.text.font": "Verdana",
		"chart.ymin": null,
		"chart.ymax": null,
		"chart.title": "",
		"chart.title.background": null,
		"chart.title.hpos": null,
		"chart.title.vpos": null,
		"chart.title.xaxis": "",
		"chart.title.yaxis": "",
		"chart.title.xaxis.pos": 0.25,
		"chart.title.yaxis.pos": 0.25,
		"chart.shadow": false,
		"chart.shadow.offsetx": 2,
		"chart.shadow.offsety": 2,
		"chart.shadow.blur": 3,
		"chart.shadow.color": "rgba(0,0,0,0.5)",
		"chart.tooltips": null,
		"chart.tooltips.effect": "fade",
		"chart.tooltips.css.class": "RGraph_tooltip",
		"chart.tooltips.coords.adjust": [0, 0],
		"chart.tooltips.highlight": true,
		"chart.highlight.stroke": "#999",
		"chart.highlight.fill": "white",
		"chart.stepped": false,
		"chart.key": [],
		"chart.key.background": "white",
		"chart.key.position": "graph",
		"chart.key.halign": null,
		"chart.key.shadow": false,
		"chart.key.shadow.color": "#666",
		"chart.key.shadow.blur": 3,
		"chart.key.shadow.offsetx": 2,
		"chart.key.shadow.offsety": 2,
		"chart.key.position.gutter.boxed": true,
		"chart.key.position.x": null,
		"chart.key.position.y": null,
		"chart.key.color.shape": "square",
		"chart.key.rounded": true,
		"chart.key.linewidth": 1,
		"chart.contextmenu": null,
		"chart.ylabels": true,
		"chart.ylabels.count": 5,
		"chart.ylabels.inside": false,
		"chart.ylabels.invert": false,
		"chart.ylabels.specific": null,
		"chart.xlabels.inside": false,
		"chart.xlabels.inside.color": "rgba(255,255,255,0.5)",
		"chart.noaxes": false,
		"chart.noyaxis": false,
		"chart.noxaxis": false,
		"chart.noendxtick": false,
		"chart.units.post": "",
		"chart.units.pre": "",
		"chart.scale.decimals": null,
		"chart.scale.point": ".",
		"chart.scale.thousand": ",",
		"chart.crosshairs": false,
		"chart.crosshairs.color": "#333",
		"chart.annotatable": false,
		"chart.annotate.color": "black",
		"chart.axesontop": false,
		"chart.filled.range": false,
		"chart.variant": null,
		"chart.axis.color": "black",
		"chart.zoom.factor": 1.5,
		"chart.zoom.fade.in": true,
		"chart.zoom.fade.out": true,
		"chart.zoom.hdir": "right",
		"chart.zoom.vdir": "down",
		"chart.zoom.frames": 15,
		"chart.zoom.delay": 33,
		"chart.zoom.shadow": true,
		"chart.zoom.mode": "canvas",
		"chart.zoom.thumbnail.width": 75,
		"chart.zoom.thumbnail.height": 75,
		"chart.zoom.background": true,
		"chart.zoom.action": "zoom",
		"chart.backdrop": false,
		"chart.backdrop.size": 30,
		"chart.backdrop.alpha": 0.2,
		"chart.resizable": false,
		"chart.resize.handle.adjust": [0, 0],
		"chart.resize.handle.background": null,
		"chart.adjustable": false,
		"chart.noredraw": false,
		"chart.outofbounds": false,
		"chart.chromefix": true
	};
	for (var i = 1; i < arguments.length; ++i) {
		if (typeof(arguments[i]) == "null" || !arguments[i]) {
			arguments[i] = []
		}
	}
	if (typeof(RGraph) == "undefined") {
		alert("[LINE] Fatal error: The common library does not appear to have been included")
	}
	this.original_data = [];
	for (var i = 1; i < arguments.length; ++i) {
		if (arguments[1] && typeof(arguments[1]) == "object" && arguments[1][0] && typeof(arguments[1][0]) == "object" && arguments[1][0].length) {
			var tmp = [];
			for (var i = 0; i < arguments[1].length; ++i) {
				tmp[i] = RGraph.array_clone(arguments[1][i])
			}
			for (var j = 0; j < tmp.length; ++j) {
				this.original_data[j] = RGraph.array_clone(tmp[j])
			}
		} else {
			this.original_data[i - 1] = RGraph.array_clone(arguments[i])
		}
	}
	if (!this.canvas) {
		alert("[LINE] Fatal error: no canvas support");
		return
	}
	this.data_arr = [];
	for (var i = 1; i < arguments.length; ++i) {
		for (var j = 0; j < arguments[i].length; ++j) {
			this.data_arr.push(arguments[i][j])
		}
	}
};
RGraph.Line.prototype.Set = function(name, value) {
	if (name == "chart.tooltips") {
		var tooltips = [];
		for (var i = 1; i < arguments.length; i++) {
			if (typeof(arguments[i]) == "object" && arguments[i][0]) {
				for (var j = 0; j < arguments[i].length; j++) {
					tooltips.push(arguments[i][j])
				}
			} else {
				if (typeof(arguments[i]) == "function") {
					tooltips = arguments[i]
				} else {
					tooltips.push(arguments[i])
				}
			}
		}
		value = tooltips
	}
	if (name == "chart.tickmarks" && typeof(value) == "object" && value) {
		value = RGraph.array_reverse(value)
	}
	if (name == "chart.ylabels.invert" && value && this.Get("chart.ymin") == null) {
		this.Set("chart.ymin", 0)
	}
	if (name == "chart.linewidth" && navigator.userAgent.match(/Chrome/)) {
		if (value == 1) {
			value = 1.01
		} else {
			if (RGraph.is_array(value)) {
				for (var i = 0; i < value.length; ++i) {
					if (typeof(value[i]) == "number" && value[i] == 1) {
						value[i] = 1.01
					}
				}
			}
		}
	}
	this.properties[name] = value
};
RGraph.Line.prototype.Get = function(name) {
	return this.properties[name]
};
RGraph.Line.prototype.Draw = function() {
	RGraph.FireCustomEvent(this, "onbeforedraw");
	RGraph.ClearEventListeners(this.id);
	if (this.Get("chart.shadow") && navigator.userAgent.match(/Chrome/) && this.Get("chart.linewidth") <= 1 && this.Get("chart.chromefix") && this.Get("chart.shadow.blur") > 0) {
		alert("[RGRAPH WARNING] Chrome has a shadow bug, meaning you should increase the linewidth to at least 1.01")
	}
	this.gutter = this.Get("chart.gutter");
	this.data = RGraph.array_clone(this.original_data);
	this.max = 0;
	this.data = RGraph.array_reverse(this.data);
	if (this.Get("chart.filled") && !this.Get("chart.filled.range") && this.data.length > 1) {
		var accumulation = [];
		for (var set = 0; set < this.data.length; ++set) {
			for (var point = 0; point < this.data[set].length; ++point) {
				this.data[set][point] = Number(accumulation[point] ? accumulation[point] : 0) + this.data[set][point];
				accumulation[point] = this.data[set][point]
			}
		}
	}
	if (this.Get("chart.ymax")) {
		this.max = this.Get("chart.ymax");
		this.min = this.Get("chart.ymin") ? this.Get("chart.ymin") : 0;
		this.scale = [(((this.max - this.min) * (1 / 5)) + this.min).toFixed(this.Get("chart.scale.decimals")), (((this.max - this.min) * (2 / 5)) + this.min).toFixed(this.Get("chart.scale.decimals")), (((this.max - this.min) * (3 / 5)) + this.min).toFixed(this.Get("chart.scale.decimals")), (((this.max - this.min) * (4 / 5)) + this.min).toFixed(this.Get("chart.scale.decimals")), this.max.toFixed(this.Get("chart.scale.decimals"))];
		if (!this.Get("chart.outofbounds")) {
			for (dataset = 0; dataset < this.data.length; ++dataset) {
				for (var datapoint = 0; datapoint < this.data[dataset].length; datapoint++) {
					this.hasnegativevalues = (this.data[dataset][datapoint] < 0) || this.hasnegativevalues
				}
			}
		}
	} else {
		this.min = this.Get("chart.ymin") ? this.Get("chart.ymin") : 0;
		for (dataset = 0; dataset < this.data.length; ++dataset) {
			for (var datapoint = 0; datapoint < this.data[dataset].length; datapoint++) {
				this.max = Math.max(this.max, this.data[dataset][datapoint] ? Math.abs(parseFloat(this.data[dataset][datapoint])) : 0);
				if (!this.Get("chart.outofbounds")) {
					this.hasnegativevalues = (this.data[dataset][datapoint] < 0) || this.hasnegativevalues
				}
			}
		}
		this.scale = RGraph.getScale(Math.abs(parseFloat(this.max)), this);
		this.max = this.scale[4] ? this.scale[4] : 0;
		if (this.Get("chart.ymin")) {
			this.scale[0] = ((this.max - this.Get("chart.ymin")) * (1 / 5)) + this.Get("chart.ymin");
			this.scale[1] = ((this.max - this.Get("chart.ymin")) * (2 / 5)) + this.Get("chart.ymin");
			this.scale[2] = ((this.max - this.Get("chart.ymin")) * (3 / 5)) + this.Get("chart.ymin");
			this.scale[3] = ((this.max - this.Get("chart.ymin")) * (4 / 5)) + this.Get("chart.ymin");
			this.scale[4] = ((this.max - this.Get("chart.ymin")) * (5 / 5)) + this.Get("chart.ymin")
		}
		if (typeof(this.Get("chart.scale.decimals")) == "number") {
			this.scale[0] = Number(this.scale[0]).toFixed(this.Get("chart.scale.decimals"));
			this.scale[1] = Number(this.scale[1]).toFixed(this.Get("chart.scale.decimals"));
			this.scale[2] = Number(this.scale[2]).toFixed(this.Get("chart.scale.decimals"));
			this.scale[3] = Number(this.scale[3]).toFixed(this.Get("chart.scale.decimals"));
			this.scale[4] = Number(this.scale[4]).toFixed(this.Get("chart.scale.decimals"))
		}
	}
	if (this.Get("chart.contextmenu")) {
		RGraph.ShowContext(this)
	}
	this.coords = [];
	this.grapharea = RGraph.GetHeight(this) - ((2 * this.gutter));
	this.halfgrapharea = this.grapharea / 2;
	this.halfTextHeight = this.Get("chart.text.size") / 2;
	if (this.Get("chart.xaxispos") == "bottom" && this.hasnegativevalues && navigator.userAgent.indexOf("Opera") == -1) {
		alert("[LINE] You have negative values and the X axis is at the bottom. This is not good...")
	}
	if (this.Get("chart.variant") == "3d") {
		RGraph.Draw3DAxes(this)
	}
	RGraph.background.Draw(this);
	if (this.Get("chart.background.hbars") && this.Get("chart.background.hbars").length > 0) {
		RGraph.DrawBars(this)
	}
	if (this.Get("chart.axesontop") == false) {
		this.DrawAxes()
	}
	var shadowColor = this.Get("chart.shadow.color");
	if (typeof(shadowColor) == "object") {
		shadowColor = RGraph.array_reverse(RGraph.array_clone(this.Get("chart.shadow.color")))
	}
	for (var i = (this.data.length - 1), j = 0; i >= 0; i--, j++) {
		this.context.beginPath();
		if (this.Get("chart.shadow") && !this.Get("chart.filled")) {
			if (typeof(shadowColor) == "object" && shadowColor[i - 1]) {
				this.context.shadowColor = shadowColor[i]
			} else {
				if (typeof(shadowColor) == "object") {
					this.context.shadowColor = shadowColor[0]
				} else {
					if (typeof(shadowColor) == "string") {
						this.context.shadowColor = shadowColor
					}
				}
			}
			this.context.shadowBlur = this.Get("chart.shadow.blur");
			this.context.shadowOffsetX = this.Get("chart.shadow.offsetx");
			this.context.shadowOffsetY = this.Get("chart.shadow.offsety")
		} else {
			if (this.Get("chart.filled") && this.Get("chart.shadow")) {
				alert("[LINE] Shadows are not permitted when the line is filled")
			}
		}
		if (this.Get("chart.fillstyle")) {
			if (typeof(this.Get("chart.fillstyle")) == "object" && this.Get("chart.fillstyle")[j]) {
				var fill = this.Get("chart.fillstyle")[j]
			} else {
				if (typeof(this.Get("chart.fillstyle")) == "string") {
					var fill = this.Get("chart.fillstyle")
				} else {
					alert("[LINE] Warning: chart.fillstyle must be either a string or an array with the same number of elements as you have sets of data")
				}
			}
		} else {
			if (this.Get("chart.filled")) {
				var fill = this.Get("chart.colors")[j]
			} else {
				var fill = null
			}
		}
		if (this.Get("chart.tickmarks") && typeof(this.Get("chart.tickmarks")) == "object") {
			var tickmarks = this.Get("chart.tickmarks")[i]
		} else {
			if (this.Get("chart.tickmarks") && typeof(this.Get("chart.tickmarks")) == "string") {
				var tickmarks = this.Get("chart.tickmarks")
			} else {
				if (this.Get("chart.tickmarks") && typeof(this.Get("chart.tickmarks")) == "function") {
					var tickmarks = this.Get("chart.tickmarks")
				} else {
					var tickmarks = null
				}
			}
		}
		this.DrawLine(this.data[i], this.Get("chart.colors")[j], fill, this.GetLineWidth(j), tickmarks, this.data.length - i - 1);
		this.context.stroke()
	}
	if (this.Get("chart.tooltips") && (this.Get("chart.tooltips").length || typeof(this.Get("chart.tooltips")) == "function")) {
		if (this.Get("chart.tooltips.highlight")) {
			RGraph.Register(this)
		}
		canvas_onmousemove_func = function(e) {
			e = RGraph.FixEventObject(e);
			var canvas = e.target;
			var context = canvas.getContext("2d");
			var obj = canvas.__object__;
			var point = obj.getPoint(e);
			if (obj.Get("chart.tooltips.highlight")) {
				RGraph.Register(obj)
			}
			if (point && typeof(point[0]) == "object" && typeof(point[1]) == "number" && typeof(point[2]) == "number" && typeof(point[3]) == "number") {
				var xCoord = point[1];
				var yCoord = point[2];
				var idx = point[3];
				if ((obj.Get("chart.tooltips")[idx] || typeof(obj.Get("chart.tooltips")) == "function")) {
					if (typeof(obj.Get("chart.tooltips")) == "function") {
						var text = obj.Get("chart.tooltips")(idx)
					} else {
						if (typeof(obj.Get("chart.tooltips")) == "object" && typeof(obj.Get("chart.tooltips")[idx]) == "function") {
							var text = obj.Get("chart.tooltips")[idx](idx)
						} else {
							if (typeof(obj.Get("chart.tooltips")) == "object") {
								var text = String(obj.Get("chart.tooltips")[idx])
							} else {
								var text = ""
							}
						}
					}
					if (text.match(/^id:(.*)$/) && RGraph.getTooltipText(text).substring(0, 3) == "id:") {
						return
					}
					canvas.style.cursor = "pointer";
					if (RGraph.Registry.Get("chart.tooltip") && RGraph.Registry.Get("chart.tooltip").__index__ == idx && RGraph.Registry.Get("chart.tooltip").__canvas__.id == canvas.id) {
						return
					}
					if (obj.Get("chart.tooltips.highlight")) {
						RGraph.Redraw()
					}
					RGraph.Tooltip(canvas, text, e.pageX, e.pageY, idx);
					RGraph.Registry.Get("chart.tooltip").__index__ = Number(idx);
					if (obj.Get("chart.tooltips.highlight")) {
						context.beginPath();
						context.moveTo(xCoord, yCoord);
						context.arc(xCoord, yCoord, 2, 0, 6.28, 0);
						context.strokeStyle = obj.Get("chart.highlight.stroke");
						context.fillStyle = obj.Get("chart.highlight.fill");
						context.stroke();
						context.fill()
					}
					e.stopPropagation();
					return
				}
			}
			canvas.style.cursor = "default"
		};
		this.canvas.addEventListener("mousemove", canvas_onmousemove_func, false);
		RGraph.AddEventListener(this.id, "mousemove", canvas_onmousemove_func)
	}
	if (this.Get("chart.axesontop")) {
		this.DrawAxes()
	}
	this.DrawLabels();
	this.DrawRange();
	if (this.Get("chart.key").length) {
		RGraph.DrawKey(this, this.Get("chart.key"), this.Get("chart.colors"))
	}
	if (this.Get("chart.labels.above")) {
		this.DrawAboveLabels()
	}
	RGraph.DrawInGraphLabels(this);
	RGraph.DrawCrosshairs(this);
	if (this.Get("chart.annotatable")) {
		RGraph.Annotate(this)
	}
	if (this.Get("chart.filled") && this.Get("chart.filled.range") && this.data.length == 2) {
		this.context.beginPath();
		var len = this.coords.length / 2;
		this.context.lineWidth = this.Get("chart.linewidth");
		this.context.strokeStyle = this.Get("chart.colors")[0];
		for (var i = 0; i < len; ++i) {
			if (i == 0) {
				this.context.moveTo(this.coords[i][0], this.coords[i][1])
			} else {
				this.context.lineTo(this.coords[i][0], this.coords[i][1])
			}
		}
		this.context.stroke();
		this.context.beginPath();
		if (this.Get("chart.colors")[1]) {
			this.context.strokeStyle = this.Get("chart.colors")[1]
		}
		for (var i = this.coords.length - 1; i >= len; --i) {
			if (i == (this.coords.length - 1)) {
				this.context.moveTo(this.coords[i][0], this.coords[i][1])
			} else {
				this.context.lineTo(this.coords[i][0], this.coords[i][1])
			}
		}
		this.context.stroke()
	} else {
		if (this.Get("chart.filled") && this.Get("chart.filled.range")) {
			alert("[LINE] You must have only two sets of data for a filled range chart")
		}
	}
	if (this.Get("chart.zoom.mode") == "thumbnail") {
		RGraph.ShowZoomWindow(this)
	}
	if (this.Get("chart.zoom.mode") == "area") {
		RGraph.ZoomArea(this)
	}
	if (this.Get("chart.resizable")) {
		RGraph.AllowResizing(this)
	}
	if (this.Get("chart.adjustable")) {
		RGraph.AllowAdjusting(this)
	}
	RGraph.FireCustomEvent(this, "ondraw")
};
RGraph.Line.prototype.DrawAxes = function() {
	var gutter = this.gutter;
	if (this.Get("chart.noaxes")) {
		return
	}
	RGraph.NoShadow(this);
	this.context.lineWidth = 1;
	this.context.strokeStyle = this.Get("chart.axis.color");
	this.context.beginPath();
	if (this.Get("chart.noxaxis") == false) {
		if (this.Get("chart.xaxispos") == "center") {
			this.context.moveTo(gutter, this.grapharea / 2 + gutter);
			this.context.lineTo(RGraph.GetWidth(this) - gutter, this.grapharea / 2 + gutter)
		} else {
			this.context.moveTo(gutter, RGraph.GetHeight(this) - gutter);
			this.context.lineTo(RGraph.GetWidth(this) - gutter, RGraph.GetHeight(this) - gutter)
		}
	}
	if (this.Get("chart.noyaxis") == false) {
		if (this.Get("chart.yaxispos") == "left") {
			this.context.moveTo(gutter, gutter);
			this.context.lineTo(gutter, RGraph.GetHeight(this) - (gutter))
		} else {
			this.context.moveTo(RGraph.GetWidth(this) - gutter, gutter);
			this.context.lineTo(RGraph.GetWidth(this) - gutter, RGraph.GetHeight(this) - gutter)
		}
	}
	if (this.Get("chart.noxaxis") == false) {
		var xTickInterval = (RGraph.GetWidth(this) - (2 * gutter)) / (this.Get("chart.xticks") ? this.Get("chart.xticks") : (this.data[0].length - 1));
		for (x = gutter + (this.Get("chart.yaxispos") == "left" ? xTickInterval : 0); x <= (RGraph.GetWidth(this) - gutter + 1); x += xTickInterval) {
			if (this.Get("chart.yaxispos") == "right" && x >= (RGraph.GetWidth(this) - gutter - 1)) {
				break
			}
			if (this.Get("chart.noendxtick")) {
				if (this.Get("chart.yaxispos") == "left" && x >= (RGraph.GetWidth(this) - gutter)) {
					break
				} else {
					if (this.Get("chart.yaxispos") == "right" && x == gutter) {
						continue
					}
				}
			}
			var yStart = this.Get("chart.xaxispos") == "center" ? (RGraph.GetHeight(this) / 2) - 3 : RGraph.GetHeight(this) - gutter;
			var yEnd = this.Get("chart.xaxispos") == "center" ? yStart + 6 : RGraph.GetHeight(this) - gutter - (x % 60 == 0 ? this.Get("chart.largexticks") * this.Get("chart.tickdirection") : this.Get("chart.smallxticks") * this.Get("chart.tickdirection"));
			this.context.moveTo(x, yStart);
			this.context.lineTo(x, yEnd)
		}
	} else {
		if (this.Get("chart.noyaxis") == false) {
			if (this.Get("chart.yaxispos") == "left") {
				this.context.moveTo(this.Get("chart.gutter"), RGraph.GetHeight(this) - this.Get("chart.gutter"));
				this.context.lineTo(this.Get("chart.gutter") - this.Get("chart.smallyticks"), RGraph.GetHeight(this) - this.Get("chart.gutter"))
			} else {
				this.context.moveTo(RGraph.GetWidth(this) - this.Get("chart.gutter"), RGraph.GetHeight(this) - this.Get("chart.gutter"));
				this.context.lineTo(RGraph.GetWidth(this) - this.Get("chart.gutter") + this.Get("chart.smallyticks"), RGraph.GetHeight(this) - this.Get("chart.gutter"))
			}
		}
	}
	if (this.Get("chart.noyaxis") == false) {
		var counter = 0;
		var adjustment = 0;
		if (this.Get("chart.yaxispos") == "right") {
			adjustment = (RGraph.GetWidth(this) - (2 * gutter))
		}
		if (this.Get("chart.xaxispos") == "center") {
			var interval = (this.grapharea / 10);
			var lineto = (this.Get("chart.yaxispos") == "left" ? gutter : RGraph.GetWidth(this) - gutter + this.Get("chart.smallyticks"));
			for (y = gutter; y < (this.grapharea / 2) + gutter; y += interval) {
				this.context.moveTo((this.Get("chart.yaxispos") == "left" ? gutter - this.Get("chart.smallyticks") : RGraph.GetWidth(this) - gutter), y);
				this.context.lineTo(lineto, y)
			}
			for (y = gutter + (this.halfgrapharea) + interval; y <= this.grapharea + gutter; y += interval) {
				this.context.moveTo((this.Get("chart.yaxispos") == "left" ? gutter - this.Get("chart.smallyticks") : RGraph.GetWidth(this) - gutter), y);
				this.context.lineTo(lineto, y)
			}
		} else {
			var lineto = (this.Get("chart.yaxispos") == "left" ? gutter - this.Get("chart.smallyticks") : RGraph.GetWidth(this) - gutter + this.Get("chart.smallyticks"));
			for (y = gutter; y < (RGraph.GetHeight(this) - gutter) && counter < 10; y += ((RGraph.GetHeight(this) - (2 * gutter)) / 10)) {
				this.context.moveTo(gutter + adjustment, y);
				this.context.lineTo(lineto, y);
				var counter = counter + 1
			}
		}
	} else {
		if (this.Get("chart.noxaxis") == false) {
			if (this.Get("chart.yaxispos") == "left") {
				this.context.moveTo(this.Get("chart.gutter"), RGraph.GetHeight(this) - this.Get("chart.gutter"));
				this.context.lineTo(this.Get("chart.gutter"), RGraph.GetHeight(this) - this.Get("chart.gutter") + this.Get("chart.smallxticks"))
			} else {
				this.context.moveTo(RGraph.GetWidth(this) - this.Get("chart.gutter"), RGraph.GetHeight(this) - this.Get("chart.gutter"));
				this.context.lineTo(RGraph.GetWidth(this) - this.Get("chart.gutter"), RGraph.GetHeight(this) - this.Get("chart.gutter") + this.Get("chart.smallxticks"))
			}
		}
	}
	this.context.stroke()
};
RGraph.Line.prototype.DrawLabels = function() {
	this.context.strokeStyle = "black";
	this.context.fillStyle = this.Get("chart.text.color");
	this.context.lineWidth = 1;
	RGraph.NoShadow(this);
	var font = this.Get("chart.text.font");
	var gutter = this.Get("chart.gutter");
	var text_size = this.Get("chart.text.size");
	var context = this.context;
	var canvas = this.canvas;
	if (this.Get("chart.ylabels") && this.Get("chart.ylabels.specific") == null) {
		var units_pre = this.Get("chart.units.pre");
		var units_post = this.Get("chart.units.post");
		var xpos = this.Get("chart.yaxispos") == "left" ? gutter - 5 : RGraph.GetWidth(this) - gutter + 5;
		var align = this.Get("chart.yaxispos") == "left" ? "right" : "left";
		var numYLabels = this.Get("chart.ylabels.count");
		var bounding = false;
		var bgcolor = this.Get("chart.ylabels.inside") ? this.Get("chart.ylabels.inside.color") : null;
		if (this.Get("chart.ylabels.inside") == true && align == "left") {
			xpos -= 10;
			align = "right";
			bounding = true
		} else {
			if (this.Get("chart.ylabels.inside") == true && align == "right") {
				xpos += 10;
				align = "left";
				bounding = true
			}
		}
		if (this.Get("chart.xaxispos") == "center") {
			var half = this.grapharea / 2;
			if (numYLabels == 1 || numYLabels == 3 || numYLabels == 5) {
				RGraph.Text(context, font, text_size, xpos, gutter + ((0 / 5) * half) + this.halfTextHeight, RGraph.number_format(this, this.scale[4], units_pre, units_post), null, align, bounding, null, bgcolor);
				if (numYLabels == 5) {
					RGraph.Text(context, font, text_size, xpos, gutter + ((1 / 5) * half) + this.halfTextHeight, RGraph.number_format(this, this.scale[3], units_pre, units_post), null, align, bounding, null, bgcolor);
					RGraph.Text(context, font, text_size, xpos, gutter + ((3 / 5) * half) + this.halfTextHeight, RGraph.number_format(this, this.scale[1], units_pre, units_post), null, align, bounding, null, bgcolor)
				}
				if (numYLabels >= 3) {
					RGraph.Text(context, font, text_size, xpos, gutter + ((2 / 5) * half) + this.halfTextHeight, RGraph.number_format(this, this.scale[2], units_pre, units_post), null, align, bounding, null, bgcolor);
					RGraph.Text(context, font, text_size, xpos, gutter + ((4 / 5) * half) + this.halfTextHeight, RGraph.number_format(this, this.scale[0], units_pre, units_post), null, align, bounding, null, bgcolor)
				}
				if (numYLabels >= 3) {
					RGraph.Text(context, font, text_size, xpos, gutter + ((6 / 5) * half) + this.halfTextHeight, "-" + RGraph.number_format(this, this.scale[0], units_pre, units_post), null, align, bounding, null, bgcolor);
					RGraph.Text(context, font, text_size, xpos, gutter + ((8 / 5) * half) + this.halfTextHeight, "-" + RGraph.number_format(this, this.scale[2], units_pre, units_post), null, align, bounding, null, bgcolor)
				}
				if (numYLabels == 5) {
					RGraph.Text(context, font, text_size, xpos, gutter + ((7 / 5) * half) + this.halfTextHeight, "-" + RGraph.number_format(this, this.scale[1], units_pre, units_post), null, align, bounding, null, bgcolor);
					RGraph.Text(context, font, text_size, xpos, gutter + ((9 / 5) * half) + this.halfTextHeight, "-" + RGraph.number_format(this, this.scale[3], units_pre, units_post), null, align, bounding, null, bgcolor)
				}
				RGraph.Text(context, font, text_size, xpos, gutter + ((10 / 5) * half) + this.halfTextHeight, "-" + RGraph.number_format(this, (this.scale[4] == "1.0" ? "1.0" : this.scale[4]), units_pre, units_post), null, align, bounding, null, bgcolor)
			} else {
				if (numYLabels == 10) {
					var interval = (this.grapharea / numYLabels) / 2;
					for (var i = 0; i < numYLabels; ++i) {
						RGraph.Text(context, font, text_size, xpos, gutter + this.halfTextHeight + ((i / 20) * (this.grapharea)), RGraph.number_format(this, ((this.scale[4] / numYLabels) * (numYLabels - i)).toFixed((this.Get("chart.scale.decimals"))), units_pre, units_post), null, align, bounding, null, bgcolor);
						RGraph.Text(context, font, text_size, xpos, gutter + this.halfTextHeight + ((i / 20) * this.grapharea) + (this.grapharea / 2) + (this.grapharea / 20), "-" + RGraph.number_format(this, (this.scale[4] - ((this.scale[4] / numYLabels) * (numYLabels - i - 1))).toFixed((this.Get("chart.scale.decimals"))), units_pre, units_post), null, align, bounding, null, bgcolor)
					}
				} else {
					alert("[LINE SCALE] The number of Y labels must be 1/3/5/10")
				}
			}
			if (typeof(this.Get("chart.ymin")) == "number") {
				RGraph.Text(context, font, text_size, xpos, RGraph.GetHeight(this) / 2, RGraph.number_format(this, this.Get("chart.ymin").toFixed(this.Get("chart.scale.decimals")), units_pre, units_post), "center", align, bounding, null, bgcolor)
			}
			if (this.Get("chart.noxaxis") == true) {
				RGraph.Text(context, font, text_size, xpos, gutter + ((5 / 5) * half) + this.halfTextHeight, "0", null, align, bounding, null, bgcolor)
			}
		} else {
			if (this.Get("chart.ylabels.invert")) {
				this.scale = RGraph.array_reverse(this.scale);
				this.context.translate(0, this.grapharea * 0.2);
				if (typeof(this.Get("chart.ymin")) == null) {
					this.Set("chart.ymin", 0)
				}
			}
			if (numYLabels == 1 || numYLabels == 3 || numYLabels == 5) {
				RGraph.Text(context, font, text_size, xpos, gutter + this.halfTextHeight + ((0 / 5) * (this.grapharea)), RGraph.number_format(this, this.scale[4], units_pre, units_post), null, align, bounding, null, bgcolor);
				if (numYLabels == 5) {
					RGraph.Text(context, font, text_size, xpos, gutter + this.halfTextHeight + ((3 / 5) * (this.grapharea)), RGraph.number_format(this, this.scale[1], units_pre, units_post), null, align, bounding, null, bgcolor);
					RGraph.Text(context, font, text_size, xpos, gutter + this.halfTextHeight + ((1 / 5) * (this.grapharea)), RGraph.number_format(this, this.scale[3], units_pre, units_post), null, align, bounding, null, bgcolor)
				}
				if (numYLabels >= 3) {
					RGraph.Text(context, font, text_size, xpos, gutter + this.halfTextHeight + ((2 / 5) * (this.grapharea)), RGraph.number_format(this, this.scale[2], units_pre, units_post), null, align, bounding, null, bgcolor);
					RGraph.Text(context, font, text_size, xpos, gutter + this.halfTextHeight + ((4 / 5) * (this.grapharea)), RGraph.number_format(this, this.scale[0], units_pre, units_post), null, align, bounding, null, bgcolor)
				}
			} else {
				if (numYLabels == 10) {
					var interval = (this.grapharea / numYLabels) / 2;
					for (var i = 0; i < numYLabels; ++i) {
						RGraph.Text(context, font, text_size, xpos, gutter + this.halfTextHeight + ((i / 10) * (this.grapharea)), RGraph.number_format(this, ((this.scale[4] / numYLabels) * (numYLabels - i)).toFixed((this.Get("chart.scale.decimals"))), units_pre, units_post), null, align, bounding, null, bgcolor)
					}
				} else {
					alert("[LINE SCALE] The number of Y labels must be 1/3/5/10")
				}
			}
			if (this.Get("chart.ylabels.invert")) {
				this.context.translate(0, 0 - (this.grapharea * 0.2))
			}
			if (typeof(this.Get("chart.ymin")) == "number") {
				RGraph.Text(context, font, text_size, xpos, this.Get("chart.ylabels.invert") ? gutter : RGraph.GetHeight(this) - gutter, RGraph.number_format(this, this.Get("chart.ymin").toFixed(this.Get("chart.scale.decimals")), units_pre, units_post), "center", align, bounding, null, bgcolor)
			}
		}
		if (this.Get("chart.noxaxis") == true && this.Get("chart.ymin") == null) {
			RGraph.Text(context, font, text_size, xpos, RGraph.GetHeight(this) - gutter + this.halfTextHeight, "0", null, align, bounding, null, bgcolor)
		}
	} else {
		if (this.Get("chart.ylabels") && typeof(this.Get("chart.ylabels.specific")) == "object") {
			var gap = this.grapharea / this.Get("chart.ylabels.specific").length;
			var halign = this.Get("chart.yaxispos") == "left" ? "right" : "left";
			var bounding = false;
			var bgcolor = null;
			if (this.Get("chart.yaxispos") == "left") {
				var x = gutter - 5;
				if (this.Get("chart.ylabels.inside")) {
					x += 10;
					halign = "left";
					bounding = true;
					bgcolor = "rgba(255,255,255,0.5)"
				}
			} else {
				if (this.Get("chart.yaxispos") == "right") {
					var x = RGraph.GetWidth(this) - gutter + 5;
					if (this.Get("chart.ylabels.inside")) {
						x -= 10;
						halign = "right";
						bounding = true;
						bgcolor = "rgba(255,255,255,0.5)"
					}
				}
			}
			if (this.Get("chart.xaxispos") == "center") {
				for (var i = 0; i < this.Get("chart.ylabels.specific").length; ++i) {
					var y = gutter + ((this.grapharea / (this.Get("chart.ylabels.specific").length * 2)) * i);
					RGraph.Text(context, font, text_size, x, y, String(this.Get("chart.ylabels.specific")[i]), "center", halign, bounding, 0, bgcolor)
				}
				var reversed_labels = RGraph.array_reverse(this.Get("chart.ylabels.specific"));
				for (var i = 0; i < reversed_labels.length; ++i) {
					var y = (this.grapharea / 2) + gutter + ((this.grapharea / (reversed_labels.length * 2)) * (i + 1));
					RGraph.Text(context, font, text_size, x, y, String(reversed_labels[i]), "center", halign, bounding, 0, bgcolor)
				}
			} else {
				for (var i = 0; i < this.Get("chart.ylabels.specific").length; ++i) {
					var y = gutter + ((this.grapharea / this.Get("chart.ylabels.specific").length) * i);
					RGraph.Text(context, font, text_size, x, y, String(this.Get("chart.ylabels.specific")[i]), "center", halign, bounding, 0, bgcolor)
				}
			}
		}
	}
	if (this.Get("chart.labels") && this.Get("chart.labels").length > 0) {
		var yOffset = 13;
		var bordered = false;
		var bgcolor = null;
		if (this.Get("chart.xlabels.inside")) {
			yOffset = -5;
			bordered = true;
			bgcolor = this.Get("chart.xlabels.inside.color")
		}
		var angle = 0;
		var valign = null;
		var halign = "center";
		if (typeof(this.Get("chart.text.angle")) == "number" && this.Get("chart.text.angle") > 0) {
			angle = -1 * this.Get("chart.text.angle");
			valign = "center";
			halign = "right";
			yOffset = 5
		}
		this.context.fillStyle = this.Get("chart.text.color");
		var numLabels = this.Get("chart.labels").length;
		for (i = 0; i < numLabels; ++i) {
			if (this.Get("chart.labels")[i]) {
				var labelX = ((RGraph.GetWidth(this) - (2 * this.Get("chart.gutter")) - (2 * this.Get("chart.hmargin"))) / (numLabels - 1)) * i;
				labelX += this.Get("chart.gutter") + this.Get("chart.hmargin");
				if (this.Get("chart.labels").length != this.data[0].length) {
					labelX = this.gutter + this.Get("chart.hmargin") + ((RGraph.GetWidth(this) - (2 * this.gutter) - (2 * this.Get("chart.hmargin"))) * (i / (this.Get("chart.labels").length - 1)))
				}
				if (!labelX) {
					labelX = this.gutter + this.Get("chart.hmargin")
				}
				RGraph.Text(context, font, text_size, labelX, (RGraph.GetHeight(this) - gutter) + yOffset, String(this.Get("chart.labels")[i]), valign, halign, bordered, angle, bgcolor)
			}
		}
	}
	this.context.stroke();
	this.context.fill()
};
RGraph.Line.prototype.DrawLine = function(lineData, color, fill, linewidth, tickmarks, index) {
	var penUp = false;
	var yPos = null;
	var xPos = 0;
	this.context.lineWidth = 1;
	var lineCoords = [];
	var gutter = this.Get("chart.gutter");
	var xInterval = (RGraph.GetWidth(this) - (2 * this.Get("chart.hmargin")) - ((2 * this.gutter))) / (lineData.length - 1);
	for (i = 0; i < lineData.length; i++) {
		var data_point = lineData[i];
		yPos = RGraph.GetHeight(this) - (((data_point - (data_point > 0 ? this.Get("chart.ymin") : (-1 * this.Get("chart.ymin")))) / (this.max - this.min)) * this.grapharea);
		yPos = (this.grapharea / (this.max - this.min)) * (data_point - this.min);
		yPos = RGraph.GetHeight(this) - yPos;
		if (this.Get("chart.ylabels.invert")) {
			yPos -= gutter;
			yPos -= gutter;
			yPos = RGraph.GetHeight(this) - yPos
		}
		if (this.Get("chart.xaxispos") == "center") {
			yPos /= 2
		} else {
			if (this.Get("chart.xaxispos") == "bottom") {
				yPos -= this.gutter
			}
		}
		if (lineData[i] == null || (this.Get("chart.xaxispos") == "bottom" && lineData[i] < this.min && !this.Get("chart.outofbounds")) || (this.Get("chart.xaxispos") == "center" && lineData[i] < (-1 * this.max) && !this.Get("chart.outofbounds"))) {
			yPos = null
		}
		this.context.lineCap = "round";
		this.context.lineJoin = "round";
		if (i > 0) {
			xPos = xPos + xInterval
		} else {
			xPos = this.Get("chart.hmargin") + gutter
		}
		this.coords.push([xPos, yPos]);
		lineCoords.push([xPos, yPos])
	}
	this.context.stroke();
	this.coords2[index] = lineCoords;
	if (RGraph.isIE8() && this.Get("chart.shadow")) {
		this.DrawIEShadow(lineCoords, this.context.shadowColor)
	}
	this.context.beginPath();
	this.context.strokeStyle = "rgba(240,240,240,0.9)";
	if (fill) {
		this.context.fillStyle = fill
	}
	var isStepped = this.Get("chart.stepped");
	var isFilled = this.Get("chart.filled");
	for (var i = 0; i < lineCoords.length; ++i) {
		xPos = lineCoords[i][0];
		yPos = lineCoords[i][1];
		var prevY = (lineCoords[i - 1] ? lineCoords[i - 1][1] : null);
		var isLast = (i + 1) == lineCoords.length;
		if (prevY < this.Get("chart.gutter") || prevY > (RGraph.GetHeight(this) - this.Get("chart.gutter"))) {
			penUp = true
		}
		if (i == 0 || penUp || !yPos || !prevY || prevY < this.gutter) {
			if (this.Get("chart.filled") && !this.Get("chart.filled.range")) {
				this.context.moveTo(xPos + 1, RGraph.GetHeight(this) - this.gutter - (this.Get("chart.xaxispos") == "center" ? (RGraph.GetHeight(this) - (2 * this.gutter)) / 2 : 0) - 1);
				this.context.lineTo(xPos + 1, yPos)
			} else {
				this.context.moveTo(xPos, yPos)
			}
			if (yPos == null) {
				penUp = true
			} else {
				penUp = false
			}
		} else {
			if (isStepped) {
				this.context.lineTo(xPos, lineCoords[i - 1][1])
			}
			if ((yPos >= this.gutter && yPos <= (RGraph.GetHeight(this) - this.gutter)) || this.Get("chart.outofbounds")) {
				if (isLast && this.Get("chart.filled") && !this.Get("chart.filled.range") && this.Get("chart.yaxispos") == "right") {
					xPos -= 1
				}
				if (!isStepped || !isLast) {
					this.context.lineTo(xPos, yPos);
					if (isFilled && lineCoords[i + 1] && lineCoords[i + 1][1] == null) {
						this.context.lineTo(xPos, RGraph.GetHeight(this) - this.gutter)
					}
				} else {
					if (isStepped && isLast) {
						this.context.lineTo(xPos, yPos)
					}
				}
				penUp = false
			} else {
				penUp = true
			}
		}
	}
	if (this.Get("chart.filled") && !this.Get("chart.filled.range")) {
		var fillStyle = this.Get("chart.fillstyle");
		this.context.lineTo(xPos, RGraph.GetHeight(this) - this.gutter - 1 - +(this.Get("chart.xaxispos") == "center" ? (RGraph.GetHeight(this) - (2 * this.gutter)) / 2 : 0));
		this.context.fillStyle = fill;
		this.context.fill();
		this.context.beginPath()
	}
	if (navigator.userAgent.match(/Chrome/) && this.Get("chart.shadow") && this.Get("chart.chromefix") && this.Get("chart.shadow.blur") > 0) {
		for (var i = lineCoords.length - 1; i >= 0; --i) {
			if (typeof(lineCoords[i][1]) != "number" || (typeof(lineCoords[i + 1]) == "object" && typeof(lineCoords[i + 1][1]) != "number")) {
				this.context.moveTo(lineCoords[i][0], lineCoords[i][1])
			} else {
				this.context.lineTo(lineCoords[i][0], lineCoords[i][1])
			}
		}
	}
	this.context.stroke();
	if (this.Get("chart.backdrop")) {
		this.DrawBackdrop(lineCoords, color)
	}
	this.RedrawLine(lineCoords, color, linewidth);
	this.context.stroke();
	for (var i = 0; i < lineCoords.length; ++i) {
		i = Number(i);
		if (isStepped && i == (lineCoords.length - 1)) {
			this.context.beginPath()
		}
		if ((tickmarks != "endcircle" && tickmarks != "endsquare" && tickmarks != "filledendsquare" && tickmarks != "endtick" && tickmarks != "arrow" && tickmarks != "filledarrow") || (i == 0 && tickmarks != "arrow" && tickmarks != "filledarrow") || i == (lineCoords.length - 1)) {
			var prevX = (i <= 0 ? null : lineCoords[i - 1][0]);
			var prevY = (i <= 0 ? null : lineCoords[i - 1][1]);
			this.DrawTick(lineData, lineCoords[i][0], lineCoords[i][1], color, false, prevX, prevY, tickmarks, i)
		}
	}
	this.context.beginPath();
	this.context.arc(RGraph.GetWidth(this) + 50000, RGraph.GetHeight(this) + 50000, 2, 0, 6.38, 1)
};
RGraph.Line.prototype.DrawTick = function(lineData, xPos, yPos, color, isShadow, prevX, prevY, tickmarks, index) {
	var gutter = this.Get("chart.gutter");
	if ((yPos == null || yPos > (RGraph.GetHeight(this) - gutter) || yPos < gutter) && !this.Get("chart.outofbounds")) {
		return
	}
	this.context.beginPath();
	var offset = 0;
	this.context.lineWidth = this.Get("chart.linewidth");
	this.context.strokeStyle = isShadow ? this.Get("chart.shadow.color") : this.context.strokeStyle;
	this.context.fillStyle = isShadow ? this.Get("chart.shadow.color") : this.context.strokeStyle;
	if (tickmarks == "circle" || tickmarks == "filledcircle" || tickmarks == "endcircle") {
		if (tickmarks == "circle" || tickmarks == "filledcircle" || (tickmarks == "endcircle")) {
			this.context.beginPath();
			this.context.arc(xPos + offset, yPos + offset, this.Get("chart.ticksize"), 0, 360 / (180 / Math.PI), false);
			if (tickmarks == "filledcircle") {
				this.context.fillStyle = isShadow ? this.Get("chart.shadow.color") : this.context.strokeStyle
			} else {
				this.context.fillStyle = isShadow ? this.Get("chart.shadow.color") : "white"
			}
			this.context.fill();
			this.context.stroke()
		}
	} else {
		if (tickmarks == "halftick") {
			this.context.beginPath();
			this.context.moveTo(xPos, yPos);
			this.context.lineTo(xPos, yPos + this.Get("chart.ticksize"));
			this.context.stroke()
		} else {
			if (tickmarks == "tick") {
				this.context.beginPath();
				this.context.moveTo(xPos, yPos - this.Get("chart.ticksize"));
				this.context.lineTo(xPos, yPos + this.Get("chart.ticksize"));
				this.context.stroke()
			} else {
				if (tickmarks == "endtick") {
					this.context.beginPath();
					this.context.moveTo(xPos, yPos - this.Get("chart.ticksize"));
					this.context.lineTo(xPos, yPos + this.Get("chart.ticksize"));
					this.context.stroke()
				} else {
					if (tickmarks == "cross") {
						this.context.beginPath();
						this.context.moveTo(xPos - this.Get("chart.ticksize"), yPos - this.Get("chart.ticksize"));
						this.context.lineTo(xPos + this.Get("chart.ticksize"), yPos + this.Get("chart.ticksize"));
						this.context.moveTo(xPos + this.Get("chart.ticksize"), yPos - this.Get("chart.ticksize"));
						this.context.lineTo(xPos - this.Get("chart.ticksize"), yPos + this.Get("chart.ticksize"));
						this.context.stroke()
					} else {
						if (tickmarks == "borderedcircle" || tickmarks == "dot") {
							this.context.lineWidth = 1;
							this.context.strokeStyle = this.Get("chart.tickmarks.dot.color");
							this.context.fillStyle = this.Get("chart.tickmarks.dot.color");
							this.context.beginPath();
							this.context.arc(xPos, yPos, this.Get("chart.ticksize"), 0, 360 / (180 / Math.PI), false);
							this.context.closePath();
							this.context.fill();
							this.context.stroke();
							this.context.beginPath();
							this.context.fillStyle = color;
							this.context.strokeStyle = color;
							this.context.arc(xPos, yPos, this.Get("chart.ticksize") - 2, 0, 360 / (180 / Math.PI), false);
							this.context.closePath();
							this.context.fill();
							this.context.stroke()
						} else {
							if (tickmarks == "square" || tickmarks == "filledsquare" || (tickmarks == "endsquare") || (tickmarks == "filledendsquare")) {
								this.context.fillStyle = "white";
								this.context.strokeStyle = this.context.strokeStyle;
								this.context.beginPath();
								this.context.strokeRect(xPos - this.Get("chart.ticksize"), yPos - this.Get("chart.ticksize"), this.Get("chart.ticksize") * 2, this.Get("chart.ticksize") * 2);
								if (tickmarks == "filledsquare" || tickmarks == "filledendsquare") {
									this.context.fillStyle = isShadow ? this.Get("chart.shadow.color") : this.context.strokeStyle;
									this.context.fillRect(xPos - this.Get("chart.ticksize"), yPos - this.Get("chart.ticksize"), this.Get("chart.ticksize") * 2, this.Get("chart.ticksize") * 2)
								} else {
									if (tickmarks == "square" || tickmarks == "endsquare") {
										this.context.fillStyle = isShadow ? this.Get("chart.shadow.color") : "white";
										this.context.fillRect((xPos - this.Get("chart.ticksize")) + 1, (yPos - this.Get("chart.ticksize")) + 1, (this.Get("chart.ticksize") * 2) - 2, (this.Get("chart.ticksize") * 2) - 2)
									}
								}
								this.context.stroke();
								this.context.fill()
							} else {
								if (tickmarks == "filledarrow") {
									var x = Math.abs(xPos - prevX);
									var y = Math.abs(yPos - prevY);
									if (yPos < prevY) {
										var a = Math.atan(x / y) + 1.57
									} else {
										var a = Math.atan(y / x) + 3.14
									}
									this.context.beginPath();
									this.context.moveTo(xPos, yPos);
									this.context.arc(xPos, yPos, 7, a - 0.5, a + 0.5, false);
									this.context.closePath();
									this.context.stroke();
									this.context.fill()
								} else {
									if (tickmarks == "arrow") {
										var x = Math.abs(xPos - prevX);
										var y = Math.abs(yPos - prevY);
										if (yPos < prevY) {
											var a = Math.atan(x / y) + 1.57
										} else {
											var a = Math.atan(y / x) + 3.14
										}
										this.context.beginPath();
										this.context.moveTo(xPos, yPos);
										this.context.arc(xPos, yPos, 7, a - 0.5 - (document.all ? 0.1 : 0.01), a - 0.4, false);
										this.context.moveTo(xPos, yPos);
										this.context.arc(xPos, yPos, 7, a + 0.5 + (document.all ? 0.1 : 0.01), a + 0.5, true);
										this.context.stroke()
									} else {
										if (typeof(tickmarks) == "function") {
											tickmarks(this, lineData, lineData[index], index, xPos, yPos, color, prevX, prevY)
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
RGraph.Line.prototype.DrawRange = function() {
	if (this.Get("chart.filled.range") && this.Get("chart.filled")) {
		this.context.beginPath();
		this.context.fillStyle = this.Get("chart.fillstyle");
		this.context.strokeStyle = this.Get("chart.fillstyle");
		this.context.lineWidth = 1;
		var len = (this.coords.length / 2);
		for (var i = 0; i < len; ++i) {
			if (i == 0) {
				this.context.moveTo(this.coords[i][0], this.coords[i][1])
			} else {
				this.context.lineTo(this.coords[i][0], this.coords[i][1])
			}
		}
		for (var i = this.coords.length - 1; i >= len; --i) {
			this.context.lineTo(this.coords[i][0], this.coords[i][1])
		}
		this.context.stroke();
		this.context.fill()
	}
};
RGraph.Line.prototype.RedrawLine = function(coords, color, linewidth) {
	if (this.Get("chart.noredraw")) {
		return
	}
	this.context.beginPath();
	this.context.strokeStyle = (typeof(color) == "object" && color ? color[0] : color);
	this.context.lineWidth = linewidth;
	var len = coords.length;
	var gutter = this.gutter;
	var width = RGraph.GetWidth(this);
	var height = RGraph.GetHeight(this);
	var penUp = false;
	for (var i = 0; i < len; ++i) {
		var xPos = coords[i][0];
		var yPos = coords[i][1];
		if (i > 0) {
			var prevX = coords[i - 1][0];
			var prevY = coords[i - 1][1]
		}
		if (((i == 0 && coords[i]) || (yPos < gutter) || (prevY < gutter) || (yPos > (height - gutter)) || (i > 0 && prevX > (width - gutter)) || (i > 0 && prevY > (height - gutter)) || prevY == null || penUp == true) && (!this.Get("chart.outofbounds") || yPos == null || prevY == null)) {
			this.context.moveTo(coords[i][0], coords[i][1]);
			penUp = false
		} else {
			if (this.Get("chart.stepped") && i > 0) {
				this.context.lineTo(coords[i][0], coords[i - 1][1])
			}
			this.context.lineTo(coords[i][0], coords[i][1]);
			penUp = false
		}
	}
	if (this.Get("chart.colors.alternate") && typeof(color) == "object" && color[0] && color[1]) {
		for (var i = 1; i < len; ++i) {
			var prevX = coords[i - 1][0];
			var prevY = coords[i - 1][1];
			this.context.beginPath();
			this.context.strokeStyle = color[coords[i][1] < prevY ? 0 : 1];
			this.context.lineWidth = this.Get("chart.linewidth");
			this.context.moveTo(prevX, prevY);
			this.context.lineTo(coords[i][0], coords[i][1]);
			this.context.stroke()
		}
	}
};
RGraph.Line.prototype.DrawIEShadow = function(coords, color) {
	var offsetx = this.Get("chart.shadow.offsetx");
	var offsety = this.Get("chart.shadow.offsety");
	this.context.lineWidth = this.Get("chart.linewidth");
	this.context.strokeStyle = color;
	this.context.beginPath();
	for (var i = 0; i < coords.length; ++i) {
		if (i == 0) {
			this.context.moveTo(coords[i][0] + offsetx, coords[i][1] + offsety)
		} else {
			this.context.lineTo(coords[i][0] + offsetx, coords[i][1] + offsety)
		}
	}
	this.context.stroke()
};
RGraph.Line.prototype.DrawBackdrop = function(coords, color) {
	var size = this.Get("chart.backdrop.size");
	this.context.lineWidth = size;
	this.context.globalAlpha = this.Get("chart.backdrop.alpha");
	this.context.strokeStyle = color;
	this.context.lineJoin = "miter";
	this.context.beginPath();
	this.context.moveTo(coords[0][0], coords[0][1]);
	for (var j = 1; j < coords.length; ++j) {
		this.context.lineTo(coords[j][0], coords[j][1])
	}
	this.context.stroke();
	this.context.globalAlpha = 1;
	this.context.lineJoin = "round";
	RGraph.NoShadow(this)
};
RGraph.Line.prototype.GetLineWidth = function(i) {
	var linewidth = this.Get("chart.linewidth");
	if (typeof(linewidth) == "number") {
		return linewidth
	} else {
		if (typeof(linewidth) == "object") {
			if (linewidth[i]) {
				return linewidth[i]
			} else {
				return linewidth[0]
			}
			alert("[LINE] Error! chart.linewidth should be a single number or an array of one or more numbers")
		}
	}
};
RGraph.Line.prototype.getPoint = function(e) {
	var canvas = e.target;
	var context = canvas.getContext("2d");
	var obj = e.target.__object__;
	var mouseXY = RGraph.getMouseXY(e);
	var mouseX = mouseXY[0];
	var mouseY = mouseXY[1];
	for (var i = 0; i < obj.coords.length; ++i) {
		var xCoord = obj.coords[i][0];
		var yCoord = obj.coords[i][1];
		if (mouseX <= (xCoord + 5 + obj.Get("chart.tooltips.coords.adjust")[0]) && mouseX >= (xCoord - 5 + obj.Get("chart.tooltips.coords.adjust")[0]) && mouseY <= (yCoord + 5 + obj.Get("chart.tooltips.coords.adjust")[1]) && mouseY >= (yCoord - 5 + obj.Get("chart.tooltips.coords.adjust")[1])) {
			return [obj, xCoord, yCoord, i]
		}
	}
};
RGraph.Line.prototype.DrawAboveLabels = function() {
	var context = this.context;
	var size = this.Get("chart.labels.above.size");
	var font = this.Get("chart.text.font");
	var units_pre = this.Get("chart.units.pre");
	var units_post = this.Get("chart.units.post");
	context.beginPath();
	for (var i = 0; i < this.coords.length; ++i) {
		var coords = this.coords[i];
		RGraph.Text(context, font, size, coords[0], coords[1] - 5 - size, RGraph.number_format(this, this.data_arr[i], units_pre, units_post), "center", "center", true, null, "rgba(255, 255, 255, 0.7)")
	}
	context.fill()
};
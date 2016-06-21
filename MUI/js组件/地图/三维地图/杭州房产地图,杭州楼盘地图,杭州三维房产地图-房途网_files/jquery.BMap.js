/********************************************
百度地图封装
依赖于 jquery库
*********************************************/
(function ($) {
    $.fn.BMap = function (options) {
        var obj = this;
        var city = obj.context.URL;
        var cityLat;
        var cityLng;
        if (city.indexOf("taizhou") > 0) {
            cityLat = 28.6617291762511;
            cityLng = 121.358410636711;
        } else {
            cityLat = 30.27619969758622;
            cityLng = 120.12007395039193;
        }

        var opts = $.extend({
            mapOption: null,
            enableMapClick: false,
            contentMenu: true,
            wheelZoom: true,
            navigationControl: true,
            mapTypeControl: false,
            centerLabel: false,
            centerLabelMiss: true,
            centerLabelText: '',
            transitRouteRenderInMap: false,
            convertorSrc: '/Scripts/baidu/convertor.js',
            pointMode: 2,   //0:gps转百度 2:gis转百度 -1:不转
            lat: cityLat,
            lng: cityLng,
            regionDelay: 700,    //onRegionChanged 延迟触发
            onRegionChanged: null,
            onMove: null,
            onLoad: null
        }, options);

        opts.mapOption = $.extend({
            minZoom: 15,
            zoom: 17,
            enableAutoResize: false,
            enableMapClick: opts.enableMapClick
        }, opts.mapOption);

        //坐标转化 如:gis（谷歌）坐标转百度坐标 gps坐标转百度坐标
        this.point2Baidu = function (lat, lng, complete, model) {
            var _p = new BMap.Point(lng, lat);
            if (BMap.Convertor) BMap.ConvertorFT.translate(_p, !model ? 2 : model, complete)
        };

        //批量坐标转化，points数组坐标 结构[{lat:30.1,lng:120.1}],complete完成函数，参数为坐标数组
        this.point2BaiduMore = function (points, complete, model) {
            var _ps = new Array(), p;
            for (var i = 0; i < points.length; i++) {
                p = points[i];
                _ps.push(new BMap.Point(p.lng, p.lat));
            }

            var time = 0, _transPoints = new Array();
            var trans = function () {
                var _index = time == 0 ? 0 : time * 20
                var _groupPoint = points.slice(_index, 20 + _index);
                if (_groupPoint == 0 && _transPoints.length > 0) {
                    if (complete) complete(_transPoints);
                } else {
                    time++;
                    BMap.ConvertorFT.transMore(_groupPoint, !model ? 2 : model, function (_ps) {
                        _transPoints = _transPoints.concat(_ps);
                        if (_groupPoint.length == 20) trans();
                        else {
                            if (complete) complete(_transPoints);
                        }
                    });
                }
            };

            trans();
        };

        //坐标转化 百度坐标转化gis
        this.baidu2Point = function (blat, blng, complete, model) {
            obj.point2Baidu(blat, blng, function (p) {
                var x = 2 * blat - p.lat;
                var y = 2 * blng - p.lng;
                if (complete) complete({ lat: x, lng: y });
            }, model)
        };

        //批量坐标转化 百度坐标转GiS
        this.baidu2PointMore = function (points, complete, model) {
            obj.point2BaiduMore(points, function (ps) {
                if (complete) {
                    var _ps = new Array();

                    for (var i = 0; i < ps.length; i++) if (!ps[i].lat && !ps[i].lng) ps.splice(0, 1);

                    for (var i = 0; i < ps.length; i++) {
                        var x = 2 * points[i].lat - ps[i].lat;
                        var y = 2 * points[i].lng - ps[i].lng;
                        _ps.push({ lat: x, lng: y });
                    }

                    complete(_ps);
                }
            }, model);
        };

        //设置地图居中和缩放级别 p坐标 z zoom  t是否进行转换
        this.centerAndZoom = function (p, z, t) {
            var main = function (point) {
                var _p;
                if (!(p instanceof BMap.Point)) _p = new BMap.Point(point ? point.lng : p.lng, point ? point.lat : p.lat);
                else _p = point;
                if (z) obj.Map.centerAndZoom(_p, z);
                else obj.Map.setCenter(_p);

                if (obj.centerMarker) obj.centerMarker.setPosition(_p);
            };
            if (t) obj.point2Baidu(p.lat, p.lng, function (point) { main(point); });
            else main(p);
        };

        //添加事件
        this.addEvent = function (eName, callback) {
            obj.Map.addEventListener(eName, callback);
        };

        //获得中心点
        this.getCenter = function () {
            return obj.Map.getCenter();
        };

        //重新设置大小
        this.resize = function (w, h, p) {
            var _h = h || obj.Map.height;
            obj.Map.width = w;
            obj.Map.height = _h;
            obj.Map.setSize(new BMap.Size(w, _h));
            obj.centerAndZoom(p ? p : obj.Map.getCenter(), obj.Map.getZoom());
        };

        //获取缩放级别
        this.getZoom = function () {
            return obj.Map.getZoom();
        };

        //获取区域坐标 东南 和 西北
        this.getRegion = function () {
            var _b = obj.Map.getBounds();
            return { sw: _b.getSouthWest(), ne: _b.getNorthEast() };
        };

        //获取区域gis坐标 东南 和 西北 需要回调形式
        this.getGisRegion = function (cb) {
            var _b = obj.Map.getBounds();

            obj.baidu2PointMore([_b.getNorthEast(), _b.getSouthWest()], function (_ps) {
                if (cb) cb({ sw: _ps[0], ne: _ps[1] });
            });
        }

        //查询公交 起始点、终点，策略 起始点可以为string和point
        this.busSearch = function (start, end, callback, policy) {
            var transit = new BMap.TransitRoute(obj.Map, {
                policy: policy || BMAP_TRANSIT_POLICY_LEAST_TIME,
                renderOptions: { map: opts.transitRouteRenderInMap ? obj.Map : null }, //obj.Map
                onSearchComplete: function (results) {
                    var rs = null;
                    if (transit.getStatus() == BMAP_STATUS_SUCCESS) {
                        rs = { start: results.getStart().title, end: results.getEnd().title, plans: [] };
                        var plan = null, total = 0, d = 0, c = 0, p, meter = 0, isStart = false, isWalk = false, addEndTitle = true, step = null;
                        for (var i = 0; i < results.getNumPlans(); i++) {
                            step = null;
                            plan = results.getPlan(i);
                            total = plan.getNumRoutes() + plan.getNumLines();
                            p = { time: plan.getDuration(), meter: plan.getDistance(true), title: '', steps: [] };
                            //拼接title
                            for (var j = 0; j < plan.getNumLines(); j++) {
                                if (j != 0) p.title += "→";
                                p.title += plan.getLine(j).title.replace(/\(.*?\)|\(|\)|\-.*/g, "");
                            }

                            //进行拼接steps
                            for (var j = 0; j < total; j++) {
                                d = j / 2;
                                c = j % 2;

                                if (c == 0) {  //偶数
                                    meter = plan.getRoute(d).getDistance(false);
                                    if (d == 0 && meter == 0) { //第一个
                                        isStart = true;
                                    } else if (d == plan.getNumRoutes() - 1 && meter == 0) {    //最后一个
                                        addEndTitle = false;
                                    } else if (meter > 0) {    //步行
                                        isWalk = true;
                                        meter = plan.getRoute(d).getDistance(true);
                                        step = { type: 2, path: plan.getRoute(d).getPath(), meter: meter, desc: '步行约<span class="meter">' + meter + '</span>至' };
                                    }
                                } else {  //奇数
                                    var line = plan.getLine((j - 1) / 2);

                                    //修改步行
                                    if (isWalk && step) {
                                        step.end = line.getGetOnStop().title;
                                        step.desc += "<span class='busStation'>" + line.getGetOnStop().title + "</span>";
                                        p.steps.push(step);
                                        step = null;
                                        isWalk = false;
                                    }

                                    step = { desc: '乘坐<span class="bus">' + line.title.replace(/\(.*?\)|\(|\)|\-.*?/g, "") + '</span>, ' + '经过<span class="stopNum">' + line.getNumViaStops() + '</span>站' + '在<span class="busStation">' + line.getGetOffStop().title + '站</span>下车', type: 1, path: line.getPath(), start: line.getGetOnStop().title, end: line.getGetOffStop().title, stops: line.getNumViaStops() };
                                    p.steps.push(step);
                                    step = null;
                                }
                            }
                            if (addEndTitle && step) {
                                step.end = rs.end;
                                step.desc = step.desc + '<span class="busStation">' + rs.end + '</span>';
                                p.steps.push(step);
                                step = null;
                            }
                            //var descriptionStr = description.join('').replace(/\uff0c$/, '。'); 将最后一个符号改成句号
                            rs.plans.push(p);
                        }
                    }
                    transit.clearResults();
                    if (callback) callback(rs);
                }
            });

            transit.search(start, end);
        };

        //查询驾车方案
        this.drivingSearch = function (start, end, callback, policy) {
            var driving = new BMap.DrivingRoute(obj.Map, {
                policy: policy || BMAP_DRIVING_POLICY_LEAST_TIME,
                onSearchComplete: function (results) {
                    var rs = null;
                    if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
                        rs = { start: results.getStart().title, end: results.getEnd().title, plans: [] };
                        var plan = null, route = null, p;
                        for (var i = 0; i < results.getNumPlans(); i++) {
                            //驾车方案
                            plan = results.getPlan(i);
                            p = { meter: plan.getDistance(true), time: plan.getDuration(), steps: [] };

                            //获取方案的驾车线路 只获取一条
                            route = plan.getRoute(0); //getNumRoutes()
                            p.path = route.getPath();

                            // 获取每个关键步骤,并输出到页面
                            var m = 0;
                            for (var j = 0; j < route.getNumSteps(); j++) {
                                var step = route.getStep(j);
                                var _st = {
                                    desc: step.getDescription(),
                                    pos: step.getPosition()
                                }

                                //计算point点
                                if (route.getNumSteps() == 1) {
                                    _st.path = p.path;
                                } else {
                                    _st.path = new Array();
                                    if (j == 0) { //第一个为起点  //最后一个  一直加到最后
                                        //for (; m < p.path.length; m++) _st.path.push(p.path[m]);
                                        _st.path.push(step.getPosition());
                                    } else {
                                        var _npoint = route.getStep(j).getPosition();  //上一个
                                        for (; m < p.path.length; m++) {
                                            _st.path.push(p.path[m]);
                                            if (p.path[m].lat == _npoint.lat && p.path[m].lng == _npoint.lng) break;
                                        }
                                    }
                                }

                                p.steps.push(_st);
                            }
                            rs.plans.push(p);
                        }
                    }

                    if (callback) callback(rs);
                }
            });

            driving.search(start, end);
        };

        //查询周边 keys可以为一个string或者一个数组 如 '菜场'或['菜场','超市'] keys最多10个 多的要分批
        //分别为左下角和右上角坐标 isGisPoint:传递的是否gis坐标点
        this.localSearch = function (keys, callback, sw, ne, isGisPoint, pageSize) {
            if (typeof keys == "string") keys = [keys];

            var local = new BMap.LocalSearch(obj.Map, {
                pageCapacity: pageSize || 10,
                onSearchComplete: function (results) {
                    var rs = null;
                    if (!results || results.length == 0) return rs;

                    rs = new Array();
                    var p, o;  //由于是当前区域 无需考虑分页
                    for (var i = 0; i < results.length; i++) {
                        p = { key: results[i].keyword, items: [] };
                        for (var j = 0; j < results[i].getCurrentNumPois(); j++) {
                            o = results[i].getPoi(j);
                            p.items.push({
                                point: o.point,
                                title: o.title,
                                address: o.address,
                                phoneNumber: o.phoneNumber,
                                tags: o.tags,
                                postcode: o.postcode
                            });
                        }
                        rs.push(p);
                    }
                    if (callback) callback(rs);
                }
            });

            var _search = function (_ps) {
                if (_ps) {
                    sw = _ps[0];
                    ne = _ps[1];
                }
                if (!(sw instanceof BMap.Point)) sw = new BMap.Point(sw.lng, sw.lat);
                if (!(ne instanceof BMap.Point)) ne = new BMap.Point(ne.lng, ne.lat);
                var _bounds = new BMap.Bounds(sw, ne) || map.getBounds();

                local.searchInBounds(keys, _bounds);
            };

            //坐标转化
            if (isGisPoint) obj.point2BaiduMore([sw, ne], _search);
            else _search();
        };

        //地图平移 x y为新坐标 effect为移动效果 0瞬移 1平滑 将触发move事件
        this.moveTo = function (lat, lng, effect) {
            var _p = new BMap.Point(lng, lat);
            obj.Map.panTo(_p, { noAnimation: effect == 1 });
            if (obj.centerMarker) {
                obj.centerMarker.setPosition(_p);
            }
        };

        //设置地图模式 如卫星模式  //BMAP_SATELLITE_MAP卫星模式 BMAP_NORMAL_MAP普通模式
        this.mapType = function (maptype) {
            obj.Map.setMapType(maptype || BMAP_SATELLITE_MAP);     //启动卫星模式
        };

        //地图上一个图像标注 options大多为label的样式
        this.addMarker = function (options) {
            var _op = $.extend({
                width: null,
                height: null,
                padding: "2px",
                zIndex: 1,
                fontSize: '12px',
                text: '',
                bgColor: '#FF6600',
                color: '#fff',
                offsetLeft: 0,
                offsetTop: 0,
                x: 0,
                y: 0,
                centerX: true,
                onClick: null,
                isMiss: true     //是否拖动地图或者缩放地图进行删除
            }, options);

            var _marker = new BMap.Marker(new BMap.Point(_op.y, _op.x), { enableMassClear: _op.isMiss });
            if (_op.onClick) _marker.addEventListener("click", _op.onClick);
            obj.Map.addOverlay(_marker);

            return _marker;
        };

        //添加弹窗
        var _dialog = null;
        this.appendDialog = function (options) {
            if (_dialog != null) obj.Map.removeOverlay(_dialog);
            var _op = $.extend({
                src: null,
                innerHtml: '',
                width: 300,
                height: 200,
                scroll: false,
                autoZoom: false,
                zIndex: 102,
                title: '',
                arrow: true,
                centerX: true,
                resetYPad: 0,
                onClose: null
            }, options);

            var _contentHeight = _op.height;
            var _innerHTML = "<div>";
            if (_op.title) {
                _contentHeight += 25;
                _innerHTML += '<div style="background-color:#258FCB;width:' + _op.width + 'px; height:25px;line-height:25px;position:relative;"><span style="color:#fff;font-weight:bold;font-size:14px;margin-left:5px;">' + _op.title + '</span><span class="mapdialog_close" style="padding:0px 5px; cursor:pointer; top:0px; bottom:0px; position:absolute;font-weight:bold; font-size:22px;color:#fff;right:0px;">×</span></div>';
            }
            if (_op.src) {
                _innerHTML += "<div style='border:1px solid #787878; border-top:0px none;'><iframe width='" + (_op.width - 2) + "px;' height='" + _op.height + "' src='" + _op.src + "' frameborder='0' scrolling='" + (_op.scroll ? 1 : 0) + "'></iframe></div>";
            } else {
                _innerHTML += "<div style='border:1px solid #787878;border-top:0px none;width:" + (_op.width - 2) + "px;height:" + _op.height + "px;'>" + _op.innerHtml + "</div>";
            }
            _innerHTML += "</div>";

            if (_op.arrow) {
                _contentHeight += 25;
                _innerHTML += "<span style=' margin-top:-1px;left:" + (_op.width - 50) / 2 + "px; display:block;position:absolute;width:0px; height:0px; border-left:25px transparent solid;border-top:25px #fff solid;border-right:25px transparent solid;border-bottom:0; _border-left-color:tomato;_border-right-color:tomato; _filter:chroma(color=tomato);'></span>";
            }

            var _horPad = 0, _verPad = 0;
            if (_op.centerX) _horPad = -_op.width / 2;
            _verPad = -_contentHeight;

            var label = new BMap.Label(_innerHTML, {
                offset: new BMap.Size(_horPad, _verPad),
                position: new BMap.Point(_op.y, _op.x),
                enableMassClear: false
            });

            var _style = {};
            _style.padding = "0px";
            _style.border = '0px none',
            _style.zIndex = _op.zIndex,
            label.setStyle(_style);

            obj.Map.addOverlay(label);

            var _p;
            for (var _pa in label) {
                eval("_p=label." + _pa + ";")
                if (_p && _p.nodeName) break;
                else _p = null;
            }

            if (_p) {
                //绑定关闭
                $(".mapdialog_close", _p).click(function () {
                    obj.Map.removeOverlay(label);
                    if (_op.onClose) _op.onClose(_dialog); //关闭事件
                    label = null;
                });
            }

            _op.resetYPad = -_contentHeight / 2 + _op.resetYPad;
            if (_op.resetYPad && _op.resetYPad != 0) {
                var point = new BMap.Point(_op.y, _op.x);
                var pix = obj.Map.pointToPixel(point);
                pix.y += _op.resetYPad;
                var p = obj.Map.pixelToPoint(pix);
                obj.moveTo(p.lat, p.lng, 0);
            } else {
                obj.moveTo(_op.x, _op.y, 0);
            }
            _dialog = label;
            return label;
        };

        //添加文本标签 注意 传递的经纬度为百度地图的经纬度
        obj.keep = {}, obj.unkeep = {};
        this.appendEntity = function (options) {
            var _op = $.extend({
                width: null,
                height: null,
                padding: "2px",
                zIndex: 1,
                fontSize: '12px',
                text: '&nbsp;',
                bgColor: '#FF6600',
                color: '#fff',
                //moveColor: "#FF0000",
                offsetLeft: 0,
                offsetTop: 0,
                lat: 0,
                lng: 0,
                group: null,
                gisX: null, //记录gis坐标x  纬度
                gisY: null,  //记录gis坐标y  经度
                autoSize: true,
                centerX: true,
                centerY: false,
                onClick: null,
                isMiss: true     //是否拖动地图或者缩放地图进行删除
            }, options);

            var _style = {};
            _op.autoSize = !_op.width && !_op.height;
            if (!_op.autoSize) {
                _style.width = _op.width || "auto";
                _style.height = _op.height || "auto";
                _style.overflow = "hidden";
            } else {
                _style.whiteSpace = "nowrap";
            }

            var _horPad = _op.offsetLeft, _verPad = _op.offsetTop;
            if (_op.centerX || _op.centerY) { //居中
                if (!_op.autoSize) objEntity.style.textAlign = 'center'; //自动模式下的居中对齐 注:没有垂直对齐
                else {
                    _wh = TextWH(_op.text, _op.padding, _op.fontSize);
                    if (_op.centerX) _horPad = -_wh.w / 2;
                    if (_op.centerY) _verPad = -_wh.h / 2;
                }
            }

            var label = new BMap.Label(_op.text, {
                offset: new BMap.Size(_horPad, _verPad),
                position: new BMap.Point(_op.plng || _op.y, _op.plat || _op.x),
                enableMassClear: _op.isMiss
            });

            if (!_op.cls) {
                _style.color = _op.color,
                _style.fontSize = _op.fontSize,
                _style.backgroundColor = _op.bgColor != "null" ? _op.bgColor : "",
                _style.border = _op.border || '1px solid #fff',
                _style.zIndex = _op.zIndex,
                _style.cursor = _op.cursor || 'pointer'
            }

            _style = $.extend(_style, _op.style);

            label.setStyle(_style);
            if (_op.onClick) label.addEventListener("click", function (e) {
                _op.onClick({ text: _op.hidText || _op.text, value: _op.value }, obj, _op.plat || _op.x, _op.plng || _op.y, label);
            });
            obj.Map.addOverlay(label);


            var _p;
            for (var _pa in label) {
                eval("_p=label." + _pa + ";")
                if (_p && _p.nodeName) break;
                else _p = null;
            }

            //默认点击行为
            if (_op.defaultClicked && _p) $(_p).trigger("click");

            if (_p) {
                if (_op.cls) _p.classList.add(_op.cls);
                if (_op.value) _p.setAttribute("value", _op.value);
                if (_op.gisX) _p.setAttribute("gisX", _op.gisX);
                if (_op.gisY) _p.setAttribute("gisY", _op.gisY);

                if (_op.moveColor || _op.moveText) {
                    $(_p).mouseenter(function () {
                        $(this).css("z-index", "999");
                        if (_op.moveColor) $(this).css("background-color", _op.moveColor);
                        if (_op.moveText) $(this).html(_op.moveText);
                    }).mouseleave(function () {
                        $(this).css("z-index", _op.zIndex);
                        if (_op.moveColor && _op.bgColor != "null") $(this).css("background-color", _op.bgColor);
                        if (_op.moveText) $(this).html(_op.text);
                    });
                }
            }

            //全局分类管理
            var _name = "a" + guid(), _keepType = _op.isMiss ? "unkeep" : "keep";
            if (_op.group) {
                eval("if (!obj." + _keepType + "." + _op.group + ") obj." + _keepType + "." + _op.group + " = {};");
                eval("var _group=obj." + _keepType + "." + _op.group + ";");
                if (!_group) _group = {};
                eval("_group." + _name + "=label;");
            } else {
                eval("obj." + _keepType + "." + _name + "=label;");
            }

            return _name;
        };

        //自动删除Entities
        this.clearEntities = function (options) {
            var _opt = $.extend({
                group: null,            //传入组 将删除一个组
                id: null,               //传入id 将删除指定id的元素
                type: 1                 //1表示unkeep 0表示keep和unkeep 2表示keep
            }, options);

            if (_opt.id) {  //指定删除模式 points无效
                var _delete = function (kt, gp) {
                    eval("var _exists=obj." + kt + (gp ? "&&obj." + kt + "." + gp + "&&obj." + kt + "." + gp + "." + _opt.id : "obj." + kt + "." + _opt.id) + ";");
                    if (_exists) {  //存在删除
                        obj.Map.removeOverlay(_exists);
                        eval("obj." + kt + "." + (gp ? gp + "." : "") + _opt.id + "=null;");
                        eval("delete obj." + kt + "." + (gp ? gp + "." : "") + _opt.id + ";");
                        return;
                    }
                }

                if (_opt.group) {
                    if (_opt.type == 2 || _opt.type == 0) _delete("keep", _opt.group);
                    if (_opt.type == 1 || _opt.type == 0) _delete("unkeep", _opt.group);
                } else {
                    if (_opt.type == 2 || _opt.type == 0) _delete("keep");
                    if (_opt.type == 1 || _opt.type == 0) _delete("unkeep");
                }
            } else {    //指定删除模式
                var _delete = function (item, p) {
                    eval("obj.Map.removeOverlay(p." + item + ");");
                    eval("p." + item + " = null;delete p." + item + ";");       //删除对象
                };

                var _mode = function (tp, gp) {
                    eval("var _isExists=obj." + tp + (gp ? "&&obj." + tp + "." + gp : "") + ";");
                    if (!_isExists) return;
                    eval("var _items=obj." + tp + (_opt.group ? "." + _opt.group : "") + ";");
                    if (!_items) return;

                    for (var _item in _items) {
                        if (_opt.group) {
                            _delete(_item, _items);
                        } else {
                            eval("for (var _citem in _items." + _item + ") {_delete(_citem,_items." + _item + ");}");
                            _item = null;
                            delete _item;
                        }
                    }

                    if (_opt.group) eval("obj." + tp + "." + _opt.group + "=null;delete obj." + tp + "." + _opt.group + ";");
                };

                if (_opt.type == 2 || _opt.type == 0) _mode("keep", _opt.group);
                if (_opt.type == 1 || _opt.type == 0) _mode("unkeep", _opt.group);
            }
        };

        //划线
        obj.lines = {};
        this.drawLine = function (points, options) {
            var _op = $.extend({
                strokeColor: "#ff0000",
                strokeWeight: 5,
                strokeOpacity: 0.8,
                strokeStyle: 'solid',    //dashed
                group: null
            }, options);

            _op.strokeColor = _op.color || _op.strokeColor;
            _op.strokeWeight = _op.bold || _op.strokeWeight;
            _op.strokeOpacity = _op.opacity || _op.strokeOpacity;
            _op.strokeStyle = _op.lineStyle || _op.strokeStyle;

            if (!points) return null;

            var arr = new Array();
            for (var i = 0; i < points.length; i++) {
                arr.push(new BMap.Point(points[i].lng, points[i].lat));
            }

            var polyline = new BMap.Polyline(arr, _op);
            obj.Map.addOverlay(polyline);

            //全局分类管理
            var _name = "a" + guid();
            if (_op.group) {
                eval("if (!obj.lines." + _op.group + ") obj.lines." + _op.group + " = {};");
                eval("var _group=obj.lines." + _op.group + ";");
                if (!_group) _group = {};
                eval("_group." + _name + "=polyline;");
            } else {
                eval("obj.lines." + _name + "=polyline;");
            }

            return _name;
        };

        //删除线条
        this.clearLines = function (options) {
            var _opt = $.extend({
                group: null,            //传入组 将删除一个组
                id: null               //传入id 将删除指定id的元素
            }, options);

            if (_opt.id) {  //指定删除模式
                var _delete = function (kt, gp) {
                    eval("var _exists=obj." + kt + (gp ? "&&obj." + kt + "." + gp + "&&obj." + kt + "." + gp + "." + _opt.id : "obj." + kt + "." + _opt.id) + ";");
                    if (_exists) {  //存在删除
                        _exists.remove();
                        eval("obj." + kt + "." + (gp ? gp + "." : "") + _opt.id + "=null;");
                        eval("delete obj." + kt + "." + (gp ? gp + "." : "") + _opt.id + ";");
                        return;
                    }
                }

                if (_opt.group) {
                    _delete("lines", _opt.group);
                } else {
                    _delete("lines");
                }
            } else {    //指定删除模式
                var _delete = function (item, p) {
                    eval("p." + item + ".remove();");
                    eval("p." + item + " = null;delete p." + item + ";");       //删除对象
                };

                var _mode = function (tp, gp) {
                    eval("var _isExists=obj." + tp + (gp ? "&&obj." + tp + "." + gp : "") + ";");
                    if (!_isExists) return;
                    eval("var _items=obj." + tp + (_opt.group ? "." + _opt.group : "") + ";");
                    if (!_items) return;

                    for (var _item in _items) {
                        if (_opt.group) {
                            _delete(_item, _items);
                        } else {
                            eval("for (var _citem in _items." + _item + ") {_delete(_citem,_items." + _item + ");}");
                            _item = null;
                            delete _item;
                        }
                    }

                    if (_opt.group) eval("obj." + tp + "." + _opt.group + "=null;delete obj." + tp + "." + _opt.group + ";");
                };

                _mode("lines", _opt.group);
            }
        };

        //生成guid
        var guid = function () {
            var S4 = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };
            return (S4() + S4() + S4()); //S4() + S4()+ "_" + S4() + "_" + S4() + "_" + S4() + "_" + S4() + S4() + S4()
        }

        //右键菜单
        var contentMenu = function () {
            var menu = new BMap.ContextMenu();
            var txtMenuItem = [{
                text: '放大',
                callback: function () { obj.Map.zoomIn(); }
            }, {
                text: '缩小',
                callback: function () { obj.Map.zoomOut(); }
            }, {
                text: '关于房途网',
                callback: function () { window.open("http://www.fangtoo.com/about/index.html"); }
            }];

            for (var i = 0; i < txtMenuItem.length; i++) {
                menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100));
                if (i == 1) {
                    menu.addSeparator();
                }
            }
            obj.Map.addContextMenu(menu);
        };

        //方法：区域改变调用传递的事件
        var timeout;
        var regionChanged = function () {
            if (timeout != null) clearTimeout(timeout);
            timeout = setTimeout(function () {
                if (opts.onRegionChanged) opts.onRegionChanged(obj.getRegion(), obj.Map.getZoom());
            }, opts.regionDelay);
        };

        //测量文字的宽度和
        var _tc = null;
        var TextWH = function (txt, padding, fontsize) {
            if (_tc == null) {
                _tc = $("<span style='visibility: hidden; width:auto; '></span>");
                $("body").append(_tc);
            }

            _tc.html(txt);
            _tc.css({
                "padding": padding,
                "font-size": fontsize,
                "white-space": "nowrap"
            });
            return { w: _tc[0].offsetWidth, h: _tc.offsetHeight };
        };

        //添加库
        var loadLib = function (js) {
            var fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", js);
            if (typeof fileref != "undefined") {
                document.getElementsByTagName("head")[0].appendChild(fileref);
            }
        };

        //初始化
        var hasAppendLib = false;
        var init = function () {
            if (typeof BMap == 'undefined' || typeof BMap.Map == 'undefined') {
                if (!hasAppendLib) {
                    hasAppendLib = true;

                    //由于调用此链接 http ://api.map.baidu.com/api?v=2.0&ak=D6c2e479caeb3dcf4e8ca786514abcbf  最终会调用getscript的链接
                    window.BMap_loadScriptTime = (new Date).getTime();
                    loadLib('http://api.map.baidu.com/getscript?v=2.0&ak=D6c2e479caeb3dcf4e8ca786514abcbf&services=&t=' + BMap_loadScriptTime);
                    //loadLib(opts.convertorSrc);    //坐标转化使用
                    window.BMap = window.BMap || {};
                    BMap.ConvertorFT = {};
                    BMap.ConvertorFT.translate = translate;
                    BMap.ConvertorFT.transMore = transMore;
                }
                setTimeout(init, 300);
                return;
            }

            var _map = new BMap.Map(obj[0].id, opts.mapOption);
            obj.Map = _map;

            if (opts.wheelZoom) _map.enableScrollWheelZoom();
            if (opts.navigationControl) _map.addControl(new BMap.NavigationControl());
            if (opts.mapTypeControl) _map.addControl(new BMap.MapTypeControl());
            if (opts.contentMenu) contentMenu();

            if (opts.pointMode != -1) {
                obj.centerAndZoom({ lat: opts.lat, lng: opts.lng }, opts.mapOption.zoom, true);
            } else {
                var _point = new BMap.Point(opts.lng, opts.lat);
                obj.centerAndZoom(_point, opts.mapOption.zoom);
            }

            if (opts.onRegionChanged) {
                _map.addEventListener("zoomend", function () {
                    regionChanged();
                });
            }

            if (opts.onRegionChanged) {
                _map.addEventListener("resize", function () {
                    regionChanged();
                });
            }

            if (opts.onRegionChanged) {
                _map.addEventListener("moveend", function () {
                    regionChanged();
                });
            }

            if (opts.onMove || opts.onRegionChanged) {
                //_map.addEventListener("dragstart", function (e) {//obj.removeEntity();});
                _map.addEventListener("dragend", function (e) {
                    if (opts.onMove) opts.onMove(e, obj);
                    regionChanged();
                });
            }

            if (opts.onRegionChanged || opts.centerLabel || opts.onLoad) {
                _map.addEventListener("load", function (e) {
                    if (opts.centerLabel) {
                        var _c = _map.getCenter();
                        obj.centerMarker = obj.addMarker({ x: _c.lat, y: _c.lng, text: opts.centerLabelText });
                    }
                    if (opts.onLoad) opts.onLoad(e, obj);
                    //regionChanged();
                });
            }

            if (opts.onClick) _map.addEventListener("click", function (e) { opts.onClick(e, obj); });
        };

        init();
        return obj;
    };
})(jQuery);
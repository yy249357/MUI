/********************************************
E都市三维地图封装
依赖于 jquery、jquery.wresize库
*********************************************/

(function ($) {
    $.fn.EMap = function (options) {
        var obj = this;
        obj.keep = {};  //用来记录 线条 label poly等元素的容器
        obj.unkeep = {}; //用来记录 线条 label poly等元素的容器 当region改变保存的元素将会删除
        var city = obj.context.URL;
        var cityX;
        var cityY;
        if (city.indexOf("taizhou") > 0) {
            city = 'taizhou';
            cityX = 13026;
            cityY = 10694;
        } else {
            city = 'hz';
            cityX = 12867;
            cityY = 18016;
        }

        var opts = $.extend({
            resize: false,
            eye: false,
            contentMenu: true,
            x: cityX,
            y: cityY,
            w: 550,
            h: 450,
            city: city,
            zoom: 1,
            laguage: 'zh-chs',
            encode: 'utf-8',
            regionDelay: 700,
            polyLineMode: true,  //划线模式
            polyAreaMode: true,  //划区域模式
            onBeforeInit: null,
            onAfterInit: null,
            onMove: null,
            onMoving: null,
            onRegionChanged: null
        }, options);

        //重新计算大小
        this.resize = function (w, h, d) {
            obj.Map.MapResize(w || opts.x, h || opts.y, d);
        };

        //获取地图矩形区域
        this.getRegion = function (clientMode) {
            var _r = obj.Map.GetMapPosCurrentRegion(clientMode ? clientMode : false);
            return { sw: _r[0], ne: _r[2], LTGisPoint: obj.EPoint2ELatLng(_r[0]), RBGisPoint: obj.EPoint2ELatLng(_r[2]) };
        };

        //获取区域Gis坐标
        this.getGisRegion = function (clientMode) {
            var _r = obj.Map.GetMapPosCurrentRegion(clientMode ? clientMode : false);
            var _x1 = obj.EPoint2ELatLng(_r[0]);
            var _x2 = obj.EPoint2ELatLng(_r[1]);
            var _x3 = obj.EPoint2ELatLng(_r[2]);
            var _x4 = obj.EPoint2ELatLng(_r[3]);
            //转化gis是一个倾斜的矩形
            return { sw: { lat: _x4.Lat, lng: _x1.Lng }, ne: { lat: _x2.Lat, lng: _x3.Lng} };
        };

        //e都市坐标转化成经纬度
        this.EPoint2ELatLng = function (p) {
            //e都市获取位置不正常，改成我们自己转换
            //return obj.Map.EPoint2ELatLng(p);
            var lat = p.X;
            var lng = p.Y;
            var xt = lat;
            var xy = lng;
            lng = cityInfo.latX * xt + cityInfo.latY * xy + cityInfo.latC;
            lat = cityInfo.lngX * xt + cityInfo.lngY * xy + cityInfo.lngC;
            return { Lat: lat, Lng: lng };
        };

        //E都市坐标转经纬度 批量
        this.EPoint2ELatLngMore = function (points) {
            if (!points || points.length == 0) return null;

            var _arr = new Array();
            for (var i = 0; i < _arr.length; i++) {
                _arr.push(obj.EPoint2ELatLng(_points[i]));
            }
            return _arr;
        };

        //经纬度转e都市坐标
        this.ELatLng2EPoint = function (p) {
            var lat = cityInfo.xLat * p.Y + cityInfo.xLng * p.X + cityInfo.xc;
            var lng = cityInfo.yLat * p.Y + cityInfo.yLng * p.X + cityInfo.yc;
            return { X: lat, Y: lng };
            //return obj.Map.ELatLng2EPoint(p);
        }

        //gis坐标E都市坐标 批量
        this.ELatLng2EpointMore = function (points) {
            if (!points || points.length == 0) return null;

            var _arr = new Array();
            for (var i = 0; i < points.length; i++) {
                _arr.push(obj.ELatLng2EPoint({ X: points[i].lat, Y: points[i].lng }));
            }
            return _arr;
        };

        //获取中心点
        this.getCenter = function () {
            //return { X: obj.Map.Property.CenterX, Y: obj.Map.Property.CenterY };
            return obj.Map.iMapCenter;
        };

        //获取Gis中心点
        this.getGisCenter = function (c) {
            var _p = obj.getCenter();
            _p.lat = _p.X;
            _p.lng = _p.Y;
            return obj.EPoint2ELatLng(_p, c);
        };

        //画区域
        obj.polys = {};    //记录当前的lines
        this.drawPoly = function (options) {
            var _p = $.extend({
                points: null,            //坐标
                bold: 2,                 //线条粗细
                color: '#FFFF00',        //线条颜色
                fillColor: "#FFFF00",      //填充色
                opacity: 1,              //透明度
                lineStyle: 'solid',      //线条样式
                group: null,              //线条管理组
                resize: true
            }, options);
            if (!_p.points) return;

            var poly = obj.Map.DrawPoly(obj.Map.BoxLayerTop, _p.points.slice(0), _p.bold, _p.fillColor, _p.color, _p.opacity);

            _p.poly = poly;
            var uid = "l" + guid();
            if (_p.group) {
                eval("if (!obj.polys." + _p.group + ") obj.polys." + _p.group + " = {}");
                eval("var _group=obj.polys." + _p.group);
                if (!_group) _group = {};
                eval("_group." + uid + "=_p;");
            } else {
                eval("obj.polys." + uid + "=_p;");
            }
            return uid;
        };

        //重绘area
        this.redrawPolys = function () {
            var _item;
            var _re = function (_o) {
                for (var l in _o) {
                    eval("_item=_o." + l + ";");
                    if (!_item || !_item.hasOwnProperty) break;
                    if (_item.hasOwnProperty('poly') && _item.resize) {
                        $(_item.poly).html("").remove();
                        _item.poly = obj.Map.DrawPolyLine(obj.Map.BoxLayerTop, _item.points.slice(0), _item.bold, _item.color, _item.opacity, _item.lineStyle);
                    } else {
                        if (typeof (_item) == "object") _re(_item);
                    }
                }
            };
            _re(obj.polys);
        }

        //清除线条
        this.clearPolys = function (options) {
            var _opt = $.extend({
                group: null,            //传入组 将删除一个组
                id: null               //传入id 将删除指定id的元素
            }, options);

            if (_opt.id) {  //指定删除模式
                var _delete = function (kt, gp) {
                    eval("var _exists=obj." + kt + (gp ? "&&obj." + kt + "." + gp + "&&obj." + kt + "." + gp + "." + _opt.id : "&&obj." + kt + "." + _opt.id) + ";");
                    if (_exists) {  //存在删除
                        eval("$(obj." + kt + "." + (gp ? gp + "." : "") + _opt.id + ".poly).html('').remove();");
                        eval("obj." + kt + "." + (gp ? gp + "." : "") + _opt.id + ".poly=null;");
                        eval("delete obj." + kt + "." + (gp ? gp + "." : "") + _opt.id + ".poly;");
                        eval("obj." + kt + "." + (gp ? gp + "." : "") + _opt.id + "=null;");
                        eval("delete obj." + kt + "." + (gp ? gp + "." : "") + _opt.id + ";");
                        return;
                    }
                }

                if (_opt.group) {
                    _delete("polys", _opt.group);
                } else {
                    _delete("polys");
                }
            } else {    //指定删除模式
                var _delete = function (item, p) {
                    eval("var _it=p." + item + ";");
                    $(_it.poly).html('').remove();
                    _it.poly = null;
                    delete _it.poly;
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

                _mode("polys", _opt.group);
            }
        };

        //划线
        obj.lines = {};
        this.drawPolyLine = function (options) {
            var _p = $.extend({
                points: null,            //坐标
                bold: 5,                 //线条粗细
                color: '#ff0000',        //线条颜色
                opacity: 1,              //透明度
                lineStyle: 'solid',      //线条样式
                group: null              //线条管理组
            }, options);

            if (!_p.points) return;

            var line = obj.Map.DrawPolyLine(obj.Map.BoxLayerTop, _p.points.slice(0), _p.bold, _p.color, _p.opacity, _p.lineStyle);    //12867, 18016, 12967, 18816
            _p.line = line;
            var uid = "l" + guid();
            if (_p.group) {
                eval("if (!obj.lines." + _p.group + ") obj.lines." + _p.group + " = {}");
                eval("var _group=obj.lines." + _p.group);
                if (!_group) _group = {};
                eval("_group." + uid + "=_p;");
            } else {
                eval("obj.lines." + uid + "=_p;");
            }
            return uid;
        };

        //重绘线
        this.redrawLines = function () {
            var _item;
            var _re = function (_o) {
                for (var l in _o) {
                    eval("_item=_o." + l + ";");
                    if (!_item || !_item.hasOwnProperty) break;
                    if (_item.hasOwnProperty('line')) {
                        $(_item.line).html("").remove();
                        _item.line = obj.Map.DrawPolyLine(obj.Map.BoxLayerTop, _item.points.slice(0), _item.bold, _item.color, _item.opacity, _item.lineStyle);
                    } else {
                        if (typeof (_item) == "object") _re(_item);
                    }
                }
            };
            _re(obj.lines);
        }

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
                        eval("$(obj." + kt + "." + (gp ? gp + "." : "") + _opt.id + ".line).html('').remove();");
                        eval("obj." + kt + "." + (gp ? gp + "." : "") + _opt.id + ".line=null;");
                        eval("delete obj." + kt + "." + (gp ? gp + "." : "") + _opt.id + ".line;");
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
                    eval("var _it=p." + item + ";");
                    $(_it.line).html('').remove();
                    _it.line = null;
                    delete _it.line;
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

        //添加dialog
        var _dialogid = null;   //dialog唯一性
        this.appendDialog = function (opts) {
            if (_dialogid) obj.Map.Entity.RemoveEntity(_dialogid);

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
            }, opts);

            var objEntity = obj.Map.$C('div');
            objEntity.style.backgroundColor = "#fff";
            objEntity.style.zIndex = _op.zIndex;
            objEntity.style.width = _op.width;

            var _contentHeight = _op.height;

            var _innerHTML = "<div>";
            if (_op.title) {
                _contentHeight += 25;
                _innerHTML += '<div style="background-color:#258FCB; height:25px;line-height:25px;position:relative;"><span style="color:#fff;font-weight:bold;font-size:14px;margin-left:5px;">' + _op.title + '</span><span class="mapdialog_close" style="padding:0px 5px; cursor:pointer; top:0px; bottom:0px; position:absolute;font-weight:bold; font-size:15px;color:#fff;right:0px;">×</span></div>';
            }

            if (_op.src) {
                _innerHTML += "<div style='border:1px solid #787878; border-top:0px none;'><iframe width='" + ($.browser.msie ? "100%" : (_op.width - 2) + "px") + ";' height='" + _op.height + "' src='" + _op.src + "' frameborder='0' scrolling='" + (_op.scroll ? 1 : 0) + "'></iframe></div>";
            } else {
                _innerHTML += "<div style='border:1px solid #787878;border-top:0px none;width:" + ($.browser.msie ? "100%" : (_op.width - 2) + "px") + ";height:" + _op.height + "px;'>" + _op.innerHtml + "</div>";
            }
            _innerHTML += "</div>";

            objEntity.style.height = _contentHeight;

            if (_op.arrow) {
                _contentHeight += 25;
                _innerHTML += "<span style=' margin-top:-1px;left:" + (_op.width - 50) / 2 + "px; display:block;position:absolute;width:0px; height:0px; border-left:25px transparent solid;border-top:25px #fff solid;border-right:25px transparent solid;border-bottom:0; _border-left-color:tomato;_border-right-color:tomato; _filter:chroma(color=tomato);'></span>";
            }

            objEntity.innerHTML = _innerHTML;

            var _horPad = 0, _verPad = 0;
            if (_op.centerX) _horPad = _op.width / 2;
            _verPad = _contentHeight;

            _dialogid = obj.Map.AppendEntity(objEntity, obj.Map.BoxLayerTop, _op.autoZoom/*是否进行和地图一样进行缩放*/, _op.x, _op.y, 0/*width 0为智能模式*/, 0/*height*/, _horPad, _verPad, false/*是否可以拖动*/, false);
            //绑定关闭
            $(".mapdialog_close", objEntity).click(function () {
                obj.Map.Entity.RemoveEntity(_dialogid);
                if (_op.onClose) _op.onClose(_dialogid); //关闭事件
                _dialogid = null;
            });

            //中心点设为地图中心点
            obj.moveTo(_op.x, _op.y - _contentHeight / 2 + _op.resetYPad, 0); //obj.Map.Entity.GetEntityInfo(x);  获取entity //obj.Map.Entity.RemoveEntity(x);   删除entity
            return _dialogid;
        };

        //添加层
        this.appendEntity = function (opts) {
            var _op = $.extend({
                width: null,
                height: null,
                padding: "2px",
                zIndex: 101,
                fontSize: '12px',
                text: '',
                moveText: null,
                bgColor: '#FF6600',
                color: '#fff',
                opacity: 0.85,
                //moveColor: "#FF0000",
                autoZoom: false,
                autoSize: true,
                centerX: true,
                centerY: false,
                onClick: null,
                group: null,
                drag: false,
                //unMissType: '',  //当isMiss为false时 进行Type分类存放 用于集中管理 如 entites.type名.label名
                isMiss: true     //是否拖动地图或者缩放地图进行删除
            }, opts);


            var objEntity = obj.Map.$C('div');
            if (_op.cls) {
                objEntity.className = _op.cls;
            } else {
                objEntity.style.padding = _op.padding;
                objEntity.style.zIndex = _op.zIndex;
                objEntity.style.fontSize = _op.fontSize;
                if (_op.bgColor != "null") objEntity.style.backgroundColor = _op.bgColor;
                objEntity.style.color = _op.color;
                objEntity.style.border = _op.border || "1px solid #fff";
                objEntity.style.cursor = _op.cursor || "default";
                if ($.browser.msie) objEntity.style.filter = "alpha(opacity = " + (_op.opacity * 100) + ")";
                else objEntity.style.opacity = _op.opacity;
            }

            if (_op.style) $(objEntity).css(_op.style);

            if (_op.moveColor || _op.moveText || _op.moveShowPoly) {
                var _polyId = null;
                $(objEntity).mouseenter(function () {
                    $(this).css("z-index", "999");
                    if (_op.moveColor) $(this).css("background-color", _op.moveColor);
                    if (_op.moveText) $(this).html(_op.moveText);
                    if (_op.moveShowPoly && _op.poly) {
                        _polyId = obj.drawPoly({ points: _op.poly, group: _op.group, opacity: .1, resize: false });
                    }
                }).mouseleave(function () {
                    if (_op.moveColor && _op.bgColor != "null") $(this).css("background-color", _op.bgColor);
                    if (_op.moveText) $(this).html(_op.text);
                    $(this).css("z-index", _op.zIndex);
                    if (_polyId) {
                        obj.clearPolys({ id: _polyId, group: _op.group });
                        _polyId = null;
                    }
                });
            }

            _op.autoSize = !_op.width && !_op.height;
            if (!_op.autoSize) {
                objEntity.style.width = _op.width || "auto";
                objEntity.style.height = _op.height || "auto";
                objEntity.style.overflow = "hidden";
                if (_op.whiteSpace) objEntity.style.whiteSpace = _op.whiteSpace;
            } else {
                objEntity.style.whiteSpace = "nowrap";
            }

            if (_op.onClick) objEntity.style.cursor = "pointer";

            var _horPad = 0, _verPad = 0;
            if (_op.centerX || _op.centerY) { //居中
                if (!_op.autoSize) objEntity.style.textAlign = 'center'; //自动模式下的居中对齐 注:没有垂直对齐
                else {
                    var _wh = TextWH(_op.text, _op.padding, _op.fontSize);
                    if (_op.centerX) _horPad = _wh.w / 2;
                    if (_op.centerY) _verPad = _wh.h / 2;
                }
            }

            objEntity.innerHTML = _op.text;
            if (_op.value) objEntity.setAttribute("value", _op.value);
            if (_op.id) objEntity.id = _op.id;

            var x = obj.Map.AppendEntity(objEntity, obj.Map.BoxLayerTop, _op.autoZoom/*是否进行和地图一样进行缩放*/, _op.x, _op.y, 0/*width 0为智能模式*/, 0/*height*/, _horPad, _verPad, _op.drag/*是否可以拖动*/, false);

            //单击事件
            if (_op.onClick) $(objEntity).click(function () {
                _op.onClick({ value: _op.value, text: _op.hidText || _op.text }, obj, _op.x, _op.y, objEntity);
            });

            //默认点击行为
            if (_op.defaultClicked) $(objEntity).trigger("click");

            //全局分类管理
            var _einfo = obj.Map.Entity.GetEntityInfo(x);
            var _keepType = _op.isMiss ? "unkeep" : "keep";
            if (_op.group) {
                eval("if (!obj." + _keepType + "." + _op.group + ") obj." + _keepType + "." + _op.group + " = {}");
                eval("var _group=obj." + _keepType + "." + _op.group);
                if (!_group) _group = {};
                eval("_group." + x + "=_einfo;");
            } else {
                eval("obj." + _keepType + "." + x + "=_einfo;");
            }

            return x;
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
                        obj.Map.RemoveEntity(_opt.id);
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
                    obj.Map.RemoveEntity(item);
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


        //地图平移 x y为新坐标 effect为移动效果 0瞬移 1平滑
        this.moveTo = function (x, y, effect, callback) {
            obj.Map.MoveTo(x, y, effect ? 1 : effect, callback);
        };

        //获取当前的zoom值
        this.getZoom = function () {
            return obj.Map.Property.Zoom;
        };

        //放大或缩小
        this.zoom = function (level) {
            obj.Map.ZoomTo(level);
        };

        //生成guid
        var guid = function () {
            var S4 = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };
            return (S4() + S4() + S4()); //S4() + S4()+ "_" + S4() + "_" + S4() + "_" + S4() + "_" + S4() + S4() + S4()
        }

        //测量文字的宽度和
        var _tc = null;
        var TextWH = function (txt, padding, fontsize) {
            if (_tc == null) {
                _tc = obj.Map.NewMapLayer('textC', 1);
                _tc.style.position = "absolute";
                _tc.style.visibility = "hidden";
                _tc.style.whiteSpace = "nowrap";
            }

            _tc.style.padding = padding;
            _tc.style.fontSize = fontsize;
            _tc.innerHTML = txt;
            return { w: _tc.offsetWidth, h: _tc.offsetHeight };
        };

        //参数设置
        var PropertySetting = function () {
            vMapProperty.flgShowSign = false;
            vMapProperty.flgShowPlot = false;
            vMapProperty.flgShowHotArea = false;    //禁止热区
            //$(obj.Map.BoxLayerTop).css("z-index", "150"); //51    //避免划线后鼠标移至热区无法显示幢等信息
        };

        //右键菜单
        var ContentMenu = function () {
            var _cm = obj.Map.ContextMenu;

            m = _cm.Items.errors;
            _cm.Delete(m);
            m = _cm.Items.postbdt;
            _cm.Delete(m);
            _cm.SetItemCaption(_cm.Items.about, "关于房途网");

            obj.Map.attachEvent(AlaMap.KeyWord.EventName.ContextMenuClick, function (type, a, b, x, y) {
                switch (type) {
                    case "about":
                        window.open("http://www.fangtoo.com/about/index.html");
                        break;
                    case "center":
                        obj.moveTo(x, y, 1, null);
                        break;
                    case "zoomin":
                        obj.zoom(obj.getZoom() - 1);
                        break;
                    case "zoomout":
                        obj.zoom(obj.getZoom() + 1);
                        break;
                }
            });
        };

        //加载用到的js
        var loadLib = function () {
            var _w = 0, _h = 0;
            if (!opts.resize) {
                _w = opts.w;
                _h = opts.h;
            }

            var fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", 'http://napi4.edushi.com/ftw/default.aspx?MapID=' + $(obj).attr("id") + '&City=' + opts.city + '&L=' + opts.laguage + '&x=' + opts.x + '&y=' + opts.y + '&w=' + _w + '&h=' + _h + '&eye=false&ew=178&eh=138&e=' + opts.encode + '&z=' + opts.zoom + '&v=0&zb=true&s=false&solution=default');
            if (typeof fileref != "undefined") {
                document.getElementsByTagName("head")[0].appendChild(fileref);
            }
        };

        //区域改变事件
        var timeout;
        var regionChanged = function () {
            //重绘line
            if (opts.polyLineMode) obj.redrawLines();
            //重绘Area
            if (opts.polyAreaMode) obj.redrawPolys();

            if (!opts.onRegionChanged) return;

            if (timeout != null) clearTimeout(timeout);
            timeout = setTimeout(function () {
                //obj.removeEntities();   //删除entity
                opts.onRegionChanged(obj.getRegion(), obj.Map.Property.Zoom, obj.Map);
            }, opts.regionDelay);
        };

        //加载
        var hasAppendLib = false;
        var load = function () {
            if (typeof vEdushiMap == 'undefined') {
                if (!hasAppendLib) {
                    hasAppendLib = true;
                    loadLib();
                }

                setTimeout(load, 300);
                return;
            }
            obj.Map = vEdushiMap;

            if (opts.resize) {
                $(window).wresize(function () {
                    obj.resize($(obj).width(), $(obj).height()); //parent().
                    regionChanged(); //区域事件
                });
            } else {
                obj.Map.attachEvent(AlaMap.KeyWord.EventName.MapResize, function () {
                    regionChanged(); //区域事件
                });
            }

            PropertySetting();
            if (opts.contentMenu) ContentMenu();

            //拖动事件
            if (opts.onMove || opts.onRegionChanged || opts.polyLineMode || opts.polyAreaMode) {
                obj.Map.attachEvent(AlaMap.KeyWord.EventName.MapMoveEnd, function (x, y, flg) {
                    var _op = { X: x, Y: y };
                    var _p = obj.EPoint2ELatLng(_op);
                    if (opts.onMove) opts.onMove(_op, _p);   //中心点 move移动事件
                    regionChanged(); //区域事件
                });
            }

            //zoom事件
            if (opts.onZoom || opts.onRegionChanged || opts.polyLineMode || opts.polyAreaMode) {
                obj.Map.attachEvent(AlaMap.KeyWord.EventName.MapZoomChange, function (z, a, b) {
                    if (opts.onZoom) opts.onZoom();
                    regionChanged(); //区域事件
                });
            }

            if (opts.onMoving) obj.Map.attachEvent(AlaMap.KeyWord.EventName.MapMovIng, opts.onMoving);  //移动
            $(window).trigger("resize");                //手动resize一次
            if (opts.onAfterInit) opts.onAfterInit(obj); //加载后
        };

        if (opts.onBeforeInit) opts.onBeforeInit(this); //加载前
        load(); //加载中

        return this;
    };
})(jQuery);
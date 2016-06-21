/********************************************
soso地图封装 目前只封装街景 其他的按需求封装即可
依赖于 jquery库
*********************************************/
(function ($) {
    $.fn.SMap = function (options) {
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
            lat: cityLat,
            lng: cityLng,
            pano: {
                disableMove: false,
                pov: {
                    heading: 20,
                    pitch: 15
                },
                zoom: 1
            },
            regionDelay: 700,    //onRegionChanged 延迟触发
            onPanoposition_changed: null,
            onPanoLoad: null,
            onLoad: null
        }, options);

        //传入点和半径设置位置
        this.setPano = function (p, radius) {
            if (!obj.Pano) return;
            if (!obj.panoService) obj.panoService = new qq.maps.PanoramaService();
            var _point = new qq.maps.LatLng(p.lat, p.lng);
            obj.panoService.getPano(_point, radius, function (result) {
                if (result) obj.Pano.setPano(result.svid);
            });
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
        window.sosoInit = function () {
            obj.Pano = new qq.maps.Panorama(document.getElementById(obj[0].id), opts.pano);

            if (opts.onPanoposition_changed) qq.maps.event.addListener(obj.Pano, 'position_changed', opts.onPanoposition_changed);
            if (opts.onPanoLoad) qq.maps.event.addListener(obj.Pano, 'loaded', opts.onPanoLoad);

            if (opts.onLoad) opts.onLoad(obj);

            window.sosoInit = null;
        };

        loadLib('http://map.qq.com/api/js?v=2.exp&key=37936a411835ae27eddfd06a6c188887&callback=sosoInit');
        return obj;
    };
})(jQuery);

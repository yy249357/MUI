//enum Platform
//{
//	Unknow = 0,					//未知
//	WebBrowser = 1,				//web浏览器
//	WapBrowser=2,				//wap浏览器
//	Windows = 4,				//windows
//	Mac = 8,					//mac
//	Android = 16,				//andriod
//	IOS = 32,					//ios
//	WindowsPhone = 64,			//windows phone
//	BlackBerry = 128,			//黑莓
//	Symbian = 256,				//Symbian
//	WebOS = 512,				//webos
//	Meego = 1024,				//meego
//	Weixin=2048,				//winxin api
//	MobData=4096,				//mob api
//}

var Platform = 1;  //来源
var PV = {
    ifreamSubmit: function (method, cityDomain, postdata) {
        if ($.browser && $.browser.msie) {
            $(document).ready(function () {
                PV.ifreamSubmitWithForm(method, cityDomain, postdata);
            });
            return;
        }

        if ($("#ifr1" + method).length > 0) $("#ifr1" + method).remove();

        //var isMessageMode=location.host.indexOf("fangtoo.com") != -1 && document.domain != "fangtoo.com";
        //if (isMessageMode) document.domain = "fangtoo.com";

        eval('window.method' + method + '=method;')
        eval('window.city' + method + '=cityDomain;')
        eval('window.postdata' + method + '=JSON.stringify(postdata);')

        var _into = false;
        var ifr1 = document.createElement('iframe');
        ifr1.id = 'ifr1' + method;
        ifr1.name = 'ifr1';
        ifr1.height = 0;
        ifr1.width = 0;
        ifr1.style.display = "none";
        ifr1.src = "http://pv.fangtoo.com/proxy.html";//?seed=" + method;
        //ifr1.src = "http://xc.fangtoo.com:8084/proxy.html";// +(isMessageMode ? "?seed=" + method : "");
        ifr1.onload = function () {

            var type = eval('window.method' + method);
            var data = eval('window.postdata' + method);
            var city = eval('window.city' + method);
            var data = { type: type, data: data, city: city };
            this.contentWindow.window.postMessage(data, "*");
        };
        document.body.appendChild(ifr1);        //放在最后
    },
    trade: function (city, tradeId, custId, shopId, companyId, custType, regionCode, regionName, buildingId, buildingName, houKind, roomCount, hollCount, cookroom, looCount, terrace, area, price, unitPrice, floor, floorCount, qcpass, expert, createtime, recommend, houseStatus, visitorId, visitorType) {
        var tradePv = {
            TradeId: tradeId,
            CustId: custId,
            StoreId: shopId,
            CompanyId: companyId,
            CustType: custType,
            RegionCode: regionCode,
            RegionName: regionName,
            BuildingId: buildingId,
            BuildingName: buildingName,
            HouKind: houKind,
            RoomCount: roomCount,
            HollCount: hollCount,
            Cookroom: cookroom,
            LooCount: looCount,
            Terrace: terrace,
            Area: area,
            Price: price,
            UnitPrice: unitPrice,
            Floor: floor,
            FloorCount: floorCount,
            QCPass: qcpass,
            Expert: expert,
            HouseCreateTime: createtime,
            Recommend: recommend,
            HouseStatus: houseStatus,
            VisitorId: visitorId,
            VisitorType: visitorType,
            Platform: Platform
        };
        //PV.postToServer("trade", city, tradePv);
        PV.ifreamSubmit("trade", city, tradePv);
    },
    lease: function (city, leaseId, custId, shopId, companyId, custType, regionCode, regionName, buildingId, buildingName, houKind, roomCount, hollCount, cookroom, looCount, terrace, area, price, unitPrice, floor, floorCount, leaseWay, qcpass, expert, createtime, recommend, houseStatus, visitorId, visitorType) {
        var leasePv = {
            LeaseId: leaseId,
            CustId: custId,
            StoreId: shopId,
            CompanyId: companyId,
            CustType: custType,
            RegionCode: regionCode,
            RegionName: regionName,
            BuildingId: buildingId,
            BuildingName: buildingName,
            HouKind: houKind,
            RoomCount: roomCount,
            HollCount: hollCount,
            Cookroom: cookroom,
            LooCount: looCount,
            Terrace: terrace,
            Area: area,
            Price: price,
            UnitPrice: unitPrice,
            Floor: floor,
            FloorCount: floorCount,
            LeaseWay: leaseWay,
            QCPass: qcpass,
            Expert: expert,
            HouseCreateTime: createtime,
            Recommend: recommend,
            HouseStatus: houseStatus,
            VisitorId: visitorId,
            VisitorType: visitorType,
            Platform: Platform
        };
        //PV.postToServer("lease", city, leasePv);
        PV.ifreamSubmit("lease", city, leasePv);
    },

    tradeReq: function (city, tradeReqId, reqTime) {
        var tradeReqPv = {
            TraReqId: tradeReqId,
            ReqTime: reqTime,
            Platform: Platform
        };
        //PV.postToServer("tradereq", city, tradeReqPv);
        PV.ifreamSubmit("tradereq", city, tradeReqPv);
    },
    leaseReq: function (city, leaseReqId, reqTime) {
        var leaseReqPv = {
            LeaReqId: leaseReqId,
            ReqTime: reqTime,
            Platform: Platform
        };
        //PV.postToServer("leasereq", city, leaseReqPv);
        PV.ifreamSubmit("leasereq", city, leaseReqPv);
    },
    leaseSH: function (city, sHId, shTime, custId, regionCode, boardIds, hollCountL, hollCountH, areaL, areaH, priceL, priceH) {
        var leaseSHPv = {
            SHId: sHId,
            ShTime: shTime,
            CustId: custId,
            RegionCode: regionCode,
            BoardIds: boardIds,
            HollCountL: hollCountL,
            HollCountH: hollCountH,
            AreaL: areaL,
            AreaH: areaH,
            PriceL: priceL,
            PriceH: priceH,
            Platform: Platform
        };
        //PV.postToServer("leasesh", city, leaseSHPv);
        PV.ifreamSubmit("leasesh", city, leaseSHPv);
    },
    broker: function (city, custId, custName, companyId, companyName, storeId, storeName, tradeCreateCount, leaseCreateCount) {
        var brokerPv = {
            CustId: custId,
            CustName: custName,
            CompanyId: companyId,
            CompanyName: companyName,
            StoreId: storeId,
            StoreName: storeName,
            TradeCreateCount: tradeCreateCount,
            LeaseCreateCount: leaseCreateCount,
            Platform: Platform
        };
        //PV.postToServer("broker", city, brokerPv);
        PV.ifreamSubmit("broker", city, brokerPv);
    },
    building: function (city, buildingId, buildingName, regionCode, regionName) {
        var buildingPv = {
            BuildingId: buildingId,
            BuildingName: buildingName,
            RegionCode: regionCode,
            RegionName: regionName,
            Platform: Platform
        };
        //PV.postToServer("building", city, buildingPv);
        PV.ifreamSubmit("building", city, buildingPv);
    },
    company: function (city, companyId, companyName) {
        var companyPv = {
            CompanyId: companyId,
            CompanyName: companyName,
            Platform: Platform
        };
        //PV.postToServer("company", city, companyPv);
        PV.ifreamSubmit("company", city, companyPv);
    },
    store: function (city, companyId, companyName, storeId, storeName) {
        var storePv = {
            CompanyId: companyId,
            CompanyName: companyName,
            StoreId: storeId,
            StoreName: storeName,
            Platform: Platform
        };
        //PV.postToServer("store", city, storePv);
        PV.ifreamSubmit("store", city, storePv);
    },

    ad: function (city, adPosition, adId, adName) {
        var adPv = {
            AdPosition: adPosition,
            AdID: adId,
            AdName: adName,
            Platform: Platform
        };
        //PV.postToServer("ad", city, adPv);
        PV.ifreamSubmit("ad", city, adPv);
    },
    ifreamSubmitWithForm: function (method, cityDomain, postdata) {
        if ($("#ifr1" + method).length > 0) $("#ifr1" + method).remove();

        var _into = false;
        var ifr1 = document.createElement('iframe');
        ifr1.id = 'ifr1' + method;
        ifr1.name = 'ifr1';
        ifr1.height = 0;
        ifr1.width = 0;
        // 注意，动态的创建的iframe中，iframe中的内容必须等到iframe加载完之后才能添加，所以需要表明iframe加载完成的函数，如下两个函数
        // ifr1.onload    谷歌和火狐认识 ，
        // ifr1.onreadystatechange    IE认识，但是IE会执行两次，分别是ifr1.readyState == 'interactive'和ifr1.readyState == 'complete',所以要做一下判断.

        if (window.navigator.userAgent.indexOf('IE') == -1) {           //非IE的浏览器
            ifr1.onload = setIframe;
        } else {
            ifr1.onreadystatechange = function () {                    //IE浏览器
                if (ifr1.readyState == 'complete') {                       //判断状态
                    setIframe();
                }
            }
        }
        function setIframe() {
            if (_into) return;

            var ifrDoc = ifr1.contentWindow.document;
            var ifrBody = ifr1.contentWindow.document.body;

            var form1 = ifrDoc.createElement('form'); //注意是要在框架的document中创建form，而不是该页面的document中

            form1.id = "form1s";
            form1.method = "post";
            //form1.action = "http://192.168.2.102:8083/pv/add";
            //form1.action = "http://192.168.2.102:8084/service/pv.ashx";

            //form1.action = "http://xc.fangtoo.com:8084/service/pv.ashx";
            form1.action = "http://pv.fangtoo.com/service/pv.ashx";
            ifrBody.appendChild(form1);

            var input1 = ifrDoc.createElement('input');
            input1.value = method;
            input1.name = 'type';

            var input2 = ifrDoc.createElement('input');
            input2.value = cityDomain;
            input2.name = 'city';

            var input3 = ifrDoc.createElement('input');
            if (postdata && postdata.BuildingName) {
                postdata.BuildingName = $("<div/>").html(postdata.BuildingName).text();
            }
            var _postData = JSON.stringify(postdata);
            input3.value = _postData;
            input3.name = 'data';

            form1.appendChild(input1);
            form1.appendChild(input2);
            form1.appendChild(input3);
        }
        document.body.appendChild(ifr1);        //放在最后

        function Fomrsubmit() {
            var _sub = document.getElementById("ifr1" + method).contentWindow.document.getElementById("form1s");
            if (_sub && _sub.length > 0) {
                clearInterval(_mo);
                document.getElementById("ifr1" + method).contentWindow.document.getElementById("form1s").submit();
                _into = true;
            }
        }
        var _mo = setInterval(function () { Fomrsubmit(); }, 10)
    }
}


var xsjx_time_shop = $(".upcoming-time");
function lxfEndtime() {
    {wc:php:start} 
    $endtime = $shoplist['xsjx_time'] * 1000;
    $nowtime = time() * 1000; 
    {wc:php:end} 
    var nowtime = new Date().getTime(); //今天的日期(毫秒值)
    var youtime =  nowtime - {wc:$endtime}; //还有多久(毫秒值)
    var seconds = youtime / 1000;
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var CDay = days;
    var CHour = hours % 24;
    var CMinute = zero(minutes % 60);
    var CSecond = zero(Math.floor(seconds % 60)); 
    var millisecond = youtime.toString().substr(-3);
    //"%"是取余运算，可以理解为60进一后取余数，然后只要余数             
    xsjx_time_shop.html(CMinute + " :" + CSecond + " : " + millisecond);
    if (youtime<0) {
        xsjx_time_shop.html("<b>限时揭晓</b><p>正在计算中....</p>"); //如果结束日期小于当前日期就提示过期啦     
        $.post("{WEB_PATH}/go/autolottery/autolottery_ret_install", {"shopid":1}, function(data){
            if (data == '-1') {
                xsjx_time_shop.html("<b>限时揭晓</b><p>没有这个商品!</p>");
                return;
            }
            if (data == '-2') {
                xsjx_time_shop.html("<b>限时揭晓</b><p>商品揭晓失败!</p>");
                return;
            }
            if (data == '-3') {
                xsjx_time_shop.html("<b>限时揭晓</b><p>商品参与人数为0，商品不予揭晓!</p>");
                return;
            }
            if (data == '-4') {
                xsjx_time_shop.html("<b>限时揭晓</b><p>商品还未到揭晓时间!</p>");
                return;
            } else {
                xsjx_time_shop.html("<b>限时揭晓</b><p>商品已经揭晓：幸运码是:<b>" + data + "</b></p>");
                return;
            }
        });
    } else {
        setTimeout("lxfEndtime()", 1);
    }
};
$(function() {
    lxfEndtime();
});
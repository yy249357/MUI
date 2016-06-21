function GetTime() {
    var EndTime = new Date('2016/05/18 00:00:00:00');
    var NowTime = new Date();
    var youtime = EndTime.getTime() - NowTime.getTime();
    var seconds = youtime / 1000;
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var CDay = days;
    var CHour = hours % 24;
    var CMinute = zero(minutes % 60);
    var CSecond = zero(Math.floor(seconds % 60)); 
    var millisecond = youtime.toString().substr(-3);
    document.getElementById("time").innerHTML = CMinute + ':' + CSecond + ':' + millisecond;
}
setInterval(GetTime, 1);
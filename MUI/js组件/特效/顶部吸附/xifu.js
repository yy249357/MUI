$(function(){
    var instant = $('#instant');
    var top = instant.offset().top;
    $(window).scroll(function(){
        var p = $(window).scrollTop();
        instant.css('position',(p > 248) ? 'fixed' : 'static');
        instant.css('top',(p > 248)? '0px' : '');
    });
})
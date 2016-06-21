//导致网页一直转圈
$.ajax({
    type: "post",
    url: '{WEB_PATH}/mobile/ajax/'+mobile+'/'+password,
    data: {
        mobile: mobile,
        password: password
    },
    datatype: "text",
    success: function(msg){
        $('.prompt').html(msg);
    }
});  

$.ajax({
    url: 'api/resources/',
    success: function1,
    error: function2,
    dataType: 'json'
});

$(".submit").click(function(){
    var mobile = $("#mobile").val();
    var password = $("#password").val();
    $.post('{WEB_PATH}/mobile/ajax/userlogin/'+mobile+'/'+password, {} ,function(result){
        //josn对象转为普通对象，否则为值为undefined
        var obj = eval("("+result+")");
        if(obj.state==1&&obj.num==-2){
            promot.html("账号不存在");
            promot.slideDown(300);
        }else if(obj.state==2){
            promot.html("未通过验证");
            promot.slideDown(300);
        }else if(obj.state==1&&obj.num==-1){
            promot.html("帐号或密码错误");
            promot.slideDown(300);
        }else{
            promot.html("登录成功,1秒后跳到首页");
            promot.slideDown(300);
            setInterval(function(){
                window.location.href = "{WEB_PATH}/mobile/mobile";
            },1200);       
        }
    })
})

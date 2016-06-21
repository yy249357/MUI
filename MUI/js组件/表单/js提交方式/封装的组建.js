var yk = function(obj){
    obj = obj || {};
    var args = {
        url : obj.url || "",
        prompt : obj.prompt || ".prompt",        
        reset : obj.reset || ".reset",
        show : obj.show || ".show",
        mobile : obj.mobile || "#mobile",
        pwd : obj.pass || "#password",
        submit : obj.submit || ".submit"
    }
    function display(info){
        $(args.prompt).html(info);
        $(args.prompt).slideDown(300);
    }
    $(args.reset).on("click", function(){
        $(this).siblings('input').val('');
    })
    $(args.show).on("click", function(){
        $(args.pwd).attr("type")=="password"? $(args.pwd).get(0).type="text": $(args.pwd).get(0).type="password";
    })
    $(args.submit).on("click", function(){
        var mobile = $(args.mobile).val();
        var password = $(args.pwd).val();
        $.post(args.url + '/mobile/ajax/userlogin/' + mobile + '/' + password, {} ,function(result){
            var obj = eval("("+result+")");
            if(obj.state==1&&obj.num==-2){
                display("账号不存在");
            }else if(obj.state==2){
                display("未通过验证");
            }else if(obj.state==1&&obj.num==-1){
                display("帐号或密码错误");
            }else{
                display("登录成功,1秒后跳到首页");
                setInterval(function(){
                    window.location.href = args.url + "/mobile/mobile";
                },1200);       
            }
        })
    })
}

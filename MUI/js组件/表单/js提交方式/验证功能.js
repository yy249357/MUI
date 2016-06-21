/*
	type是字符串
	如果匹配，isValid = true
 */
function verify(tpye, value){
	if(type=="mobile"){
		var isValid = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(176)|(177)|(178))+\d{8})$/.test(value);    
    	return isValid;
	}
	//中文姓名
	else if(type=="username"){
		var isValid = /^[\u4E00-\u9FA5]{2,4}$/.test(value);
    	return isValid;
	}
	//6-20个字母、数字、下划线密码  
	else if(type=="password"){
		var isValid = /^(\w){6,20}$/.test(value);    
    	return isValid;
	}
	//邮箱
	else if(type=="mail"){
		var isValid = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);    
    	return isValid;
	}
	//邮编
	else if(type=="postcode"){
		var isValid = /^[a-zA-Z0-9 ]{3,12}$/.test(value);  
    	return isValid;
	}
	else{
		return false;
	}
}
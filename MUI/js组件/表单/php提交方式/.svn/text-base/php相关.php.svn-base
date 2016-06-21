<?php  
//登录
	public function userlogin(){
	    $username=safe_replace($this->segment(4));
	    $password=md5(safe_replace($this->segment(5)));
		
		$logintype='';
		if(strpos($username,'@')==false){
			//手机				
			$logintype='mobile';							
		}else{
			//邮箱
			$logintype='email';				
		}
	
		$member=$this->db->GetOne("select * from `@#_member` where `$logintype`='$username' and `password`='$password'");
		if(!$member){
			//帐号不存在错误
			$user['state']=1;
			$user['num']=-2;
		}
		
		if($member[$check] != 1){
			$user['state']=2; //未验证
		}
		
		if(!is_array($member)){
			//帐号或密码错误
			$user['state']=1;
			$user['num']=-1;
		}else{
		   //登录成功 
			_setcookie("uid",_encrypt($member['uid']),60*60*24*7);			
			_setcookie("ushell",_encrypt(md5($member['uid'].$member['password'].$member['mobile'].$member['email'])),60*60*24*7);	
			
			$user['state']=0; 
	
		}		 
		 echo json_encode($user);
	}
	
	//登录成功后
	public function loginok(){	  
	  
	  $user['Code']=0; 
	  echo json_encode($user);
	}

//验证输入的手机验证码
	public function mobileregsn(){
	    $mobile= $this->segment(4);	
	    $checkcodes= $this->segment(5);	
	    
		$member=$this->db->GetOne("SELECT * FROM `@#_member` WHERE `mobile` = '$mobile' LIMIT 1");
		 
			if(strlen($checkcodes)!=6){
			    //_message("验证码输入不正确!");
				$mobileregsn['state']=1;
				echo json_encode($mobileregsn);
				exit;
			}
			$usercode=explode("|",$member['mobilecode']);
			if($checkcodes!=$usercode[0]){
			   //_message("验证码输入不正确!");
				$mobileregsn['state']=1;
				echo json_encode($mobileregsn);
				exit;
			}
					
					
			$this->db->Query("UPDATE `@#_member` SET mobilecode='1' where `uid`='$member[uid]'");
			
			_setcookie("uid",_encrypt($member['uid']),60*60*24*7);	
			_setcookie("ushell",_encrypt(md5($member['uid'].$member['password'].$member['mobile'].$member['email'])),60*60*24*7);
						
			 $mobileregsn['state']=0;
			 $mobileregsn['str']=1;	   
	
	        echo json_encode($mobileregsn);
	} 
	
	//重新发送验证码
	public function sendmobile(){
	  
	  		$name=$this->segment(4);
			$member=$this->db->GetOne("SELECT * FROM `@#_member` WHERE `mobile` = '$name' LIMIT 1");
			if(!$member){
			    //_message("参数不正确!");
				$sendmobile['state']=1;
				echo json_encode($sendmobile);
				exit;    
		    }
			$checkcode=explode("|",$member['mobilecode']);
			$times=time()-$checkcode[1];		
			if($times > 120){
				
				$sendok = send_mobile_reg_code($name,$member['uid']);
				if($sendok[0]!=1){
					//_message($sendok[1]);exit;	
                   	$sendmobile['state']=1;	
					echo json_encode($sendmobile);
					exit;                    					
				}  
				//成功
				    $sendmobile['state']=0;	
					echo json_encode($sendmobile);
					exit;  						
			}else{
				    $sendmobile['state']=1;	
					echo json_encode($sendmobile);
					exit; 
			}
	
	}

?>
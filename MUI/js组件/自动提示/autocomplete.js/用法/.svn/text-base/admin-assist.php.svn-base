<?php
$path = dirname(dirname(__FILE__));
$path = str_replace("\\","/",$path);
require_once($path.'/include/common.inc.php');
require_once(QISHI_ROOT_PATH.'/include/mysql.class.php');
//require_once(QISHI_ROOT_PATH.'include/fun_user.php');
$db = new mysql($dbhost,$dbuser,$dbpass,$dbname);
unset($dbhost,$dbuser,$dbpass,$dbname);
$smarty->caching = false;
$act = !empty($_REQUEST['act']) ? trim($_REQUEST['act']) : 'hotword';
// var_dump($_GET);
// echo("<br>$get=$post<br>");
// var_dump($_POST);
// echo("<br>$get=$post<br>");
// var_dump($_REQUEST);
//echo $_POST['editorValue'];//get_magic_quotes_gpc();

//var_dump($_GET);

if($act == "hotword"){
	//var_dump($_GET,$_REQUEST);
	if (empty($_GET['query']))
	
	{
		exit();
	}
	$gbk_query=trim($_GET['query']);
	$sql="SELECT * FROM ".table('house')." WHERE house_name like '%{$gbk_query}%'  LIMIT 0 , 5000";
	$result = $db->query($sql);
	while($row = $db->fetch_array($result))
	{
		$list[]="'".$row['house_name']."'";
	}
	if ($list)
	{
		$liststr=implode(',',$list);
		$str="{";
		$str.="query:'{$gbk_query}',";
		$str.="suggestions:[{$liststr}]";
		$str.="}";
// 		var_dump($str);
		exit($str);
	}
}elseif($act == "test"){
	$where = "";
	$gbk_query=trim($_GET['query']);

	if (empty($_GET['query']))
	{
	exit();
	}
	$gbk_query=trim($_GET['query']);
	if (strcasecmp(QISHI_DBCHARSET,"utf8")!=0)
	{
	$gbk_query=utf8_to_gbk($gbk_query);
	}
	$where = " and a.house_name like '%{$gbk_query}%'";// or b.cityname like '%{$gbk_query}%'";	
	$sql="SELECT a.id,a.house_name,a.citycode,b.cityname FROM ".table('house')." a ,st_city b where a.citycode=b.citycode ".$where." limit 0,30000 ";

	$result = $db->query($sql);
	$jsonStr = "";

	while($row = $db->fetch_array($result))
	{
		//$list[]="'".$row['house_name']."'";
		 
		//echo "<br>{name:"+'"'+$row['house_name']+'"'+",code:"+'"'+$row['id']+'"'+"},";
		$jsonStr[]="{\"name\":".'"'.$row['house_name'].'"'.",\"id\":".'"'.$row['id'].'"'.",\"cityname\":".'"'.$row['cityname'].'"'.",\"citycode\":".'"'.$row['citycode'].'"'."}";
		//$test .=$row['house_name'];
	}
	$liststr=implode(',',$jsonStr);	
	$str="{";
	$str.="query:'{$gbk_query}',";
	$str.="suggestions:[{$liststr}]";
	$str.="}";
	exit($str);



}elseif($act == "broker"){
	$where = "";
	$gbk_query=trim($_GET['query']);
	
	if(empty($_GET['query'])){
		exit("");
	}
	
	$where = " where brokername like '%{$gbk_query}%'";// or b.cityname like '%{$gbk_query}%'";
	
	
	$sql="SELECT * FROM  xk_broker ".$where." limit 0,30000 ";
	
	
	$result = $db->query($sql);
	$jsonStr = "";
	
	while($row = $db->fetch_array($result))
	{
		//$list[]="'".$row['house_name']."'";
		 
		//echo "<br>{name:"+'"'+$row['house_name']+'"'+",code:"+'"'+$row['id']+'"'+"},";
		$jsonStr .="{name:".'"'.$row['brokername'].'"'.",id:".'"'.$row['id'].'"'.",balance:".'"'.$row['balance'].'"'."},";
		//$test .=$row['house_name'];
	}
	//echo "end";
	//var_dump($jsonStr);
	//logger("[".$jsonStr."]");
	
	exit("[".$jsonStr."]");
}elseif($act == "citycode"){
		//$sql="SELECT * FROM ".table('house')." LIMIT 0 , 100";
		$where = "";
		$gbk_query=trim($_GET['query']);
		if (!empty($_GET['query']))
		{
			//exit();
			$where = " where cityname like '%{$gbk_query}%'";
		}
	
		$sql="SELECT * FROM ".table('city').$where."  LIMIT 0 , 100";
		//echo $sql;
		$result = $db->query($sql);
		$jsonStr = "";
		//echo "begin";
		while($row = $db->fetch_array($result))
		{
			//$list[]="'".$row['house_name']."'";
				
			//echo "<br>{name:"+'"'+$row['house_name']+'"'+",code:"+'"'+$row['id']+'"'+"},";
			$jsonStr .="{cityname:".'"'.$row['cityname'].'"'.",citycode:".'"'.$row['citycode'].'"'."},";
		}
		//echo "end";
		//var_dump($jsonStr);
		exit("[".$jsonStr."]");
}

function logger($log_content)
{
	if(isset($_SERVER['HTTP_APPNAME'])){   //SAE
		sae_set_display_errors(false);
		sae_debug($log_content);
		sae_set_display_errors(true);
	}else{ //LOCAL
		$max_size = 500000;
		$log_filename = "logauto.xml";
		if(file_exists($log_filename) and (abs(filesize($log_filename)) > $max_size)){unlink($log_filename);}
		file_put_contents($log_filename, date('Y-m-d H:i:s').$log_content."\r\n", FILE_APPEND);
	}
}
?>
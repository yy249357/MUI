<?php
require_once(dirname(__FILE__).'/include/common.inc.php');
require_once(QISHI_ROOT_PATH.'include/mysql.class.php');
$db = new mysql($dbhost,$dbuser,$dbpass,$dbname);		
$where = "";
$gbk_query=trim($_GET['term']);
$where = " and a.house_name like '%{$gbk_query}%'";
$sql="SELECT a.house_name,a.citycode FROM ".table('house')." a ,st_city b where a.citycode=b.citycode ".$where." limit 0,30000 ";
$result = $db->query($sql);
$str = array();
while($row = $db->fetch_array($result))
{
	$str[] =$row['house_name'];
}	
// exit("[".$jsonStr."]");
echo json_encode($str);
?>
<?php
header('Content-Type:text/html;charset=UTF-8');

//为了方便举例，这里使用数组来模拟，你也可以在实际应用中从数据库中读取数据
//返回的数据最好是数组或对象类型的JSON格式字符串
$languages = array('Chinese', 'English', 'Spanish', 'Russian', 'French', 'Japanese', 'Korean', 'German');

echo json_encode($languages);
?>
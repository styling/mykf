<?php
	//$callback = $_GET["callback"];
	$arr = array(
		"bid" => "1a64b13b525703e3a6f4e8ab",
		"wordid" => 0,
		"word" => "",
		"from" => "北京丰台",
		"wordtype" => 0,
		"lv" => 0,
		"lvp" => 0,
		"ftime" => 0,
		"ltime" => 0,
		"service_type" => 0,
		"zhixin" => "",
		"saved" => 1,
		"time" => 1397527345,
		"group" => array(array(
			"groupid" => 0,
			"groupname" => "商桥咨询",
			"user" => array(array(
				"subid" => 691970,
				"islogin" => 1,
				"groupid" => 0,
				"subname" => "百度商桥"
			), array(
				"subid" => 632485,
				"islogin" => 1,
				"groupid" => 0,
				"subname" => "百度商桥"
			), array(
				"subid" => 633305,
				"islogin" => 0,
				"groupid" => 0,
				"subname" => "百度商桥"
			), array(
				"subid" => 632484,
				"islogin" => 1,
				"groupid" => 0,
				"subname" => "百度商桥"
			), array(
				"subid" => 632498,
				"islogin" => 1,
				"groupid" => 0,
				"subname" => "百度商桥"
			), array(
				"subid" => 0,
				"islogin" => 0,
				"groupid" => 0,
				"subname" => "百度商桥"
			))
		), array(
			"groupid" => 1,
			"groupname" => "商桥团队",
			"user" => array(array(
				"subid" => 836942,
				"islogin" => 0,
				"groupid" => 1,
				"subname" => "1111"
			), array(
				"subid" => 643835,
				"islogin" => 0,
				"groupid" => 1,
				"subname" => "百度商桥"
			), array(
				"subid" => 845428,
				"islogin" => 0,
				"groupid" => 1,
				"subname" => "huchunyan"
			), array(
				"subid" => 643833,
				"islogin" => 0,
				"groupid" => 1,
				"subname" => "百度商桥"
			))
		))
	);
//	echo $_GET["callback"] . '(' . json_encode($arr) . ')';
	printf('%s(%s);', $_REQUEST['callback'], json_encode($arr));
?>		
var destination;
var Msg = 0;
var auth_result="false";
var user_id;
var end_result;
var batteryRemains;
var temperature;
var airconditioner = "false";
var target_temperature;
var flag;
var keeping_time=60000;
var seating="false";
var code = 123456789070;
var break_time=12000;
var airstop;
var airstart;
var count = 0;
var vehiclecode = code.toString();
var breakTime = 60000;
var keepTime = 120000;
var addressToString;
var start = "false"



function ridingCheck() {
	//sendMsg(3, auth_result,user_id,end_result,batteryRemains,temperature,airconditioner,target_temperature);
	if (seating == "true" && start == "true") {
		sendMsg(3, auth_result, user_id, end_result, batteryRemains,temperature, airconditioner, target_temperature);//안되면지우기
		alert("운전자 탑승함");
		gonavi(); 
		stopSystem();
	}
}

function batteryCheck() {
	var ba = parseInt(batteryRemains);
	if ( ba<= 50) {
		alert("Battery is short. \nSystem is terminated.");
		//sendMsg(3, auth_result,user_id,end_result,batteryRemains,temperature,"false",target_temperature);	
		stopSystem();
	} else {
		if(auth_result =="true"&& start=="true"){
			sendMsg(3, auth_result, user_id, end_result, batteryRemains,temperature, airconditioner, target_temperature);
		var airstart = setTimeout("air_stop()", breakTime);
		//alert("Battery is enough.");
		}
	}
}



function confirmConnection(user_id) {

	if (confirm("user ID : " + user_id + "\n Press OK button, if it is right. ") == true) {

		auth_result = "true";
		vehiclecode = code.toString()
		sendMsg(1, auth_result, user_id, end_result, batteryRemains,temperature, airconditioner, target_temperature);

	} else {
		
		auth_result = "false";
		sendMsg(1, auth_result, user_id, end_result, batteryRemains,temperature, airconditioner, target_temperature);

	}
}

function confirmDisconnection() {
	if(auth_result=="false"){
		alert("There is no mobile device which connected with ivi.");
	}
	else{
		if (confirm("Press OK button if you want disconnecting.") == true) {
			sendMsg(2, "999", "999", "true", "999","999", "999", "999");
			
		}	
	}
}

function stopSystem() {
	start = "false";
	clearInterval(operating);
	clearTime(airstop);
	clearTime(airstart);
	alert("System shutdown");
}



var operating = setInterval("sendMsg(0, auth_result,user_id,end_result,batteryRemains,temperature,true,target_temperature)",5000);//필수


function air_start() {
	//Msg=4;
	airconditioner = "true";
	Msg(4, auth_result, user_id, end_result, batteryRemains, temperature,"true", target_temperature);
	alert("airconditioner start");
	keepTime = parseInt(keeping_time)*60000;
	airstop = setTimeout("air_stop()", keepTime);
}
function air_stop() {
	//Msg=4;
	airconditioner = "false";
	breakTime = parseInt(break_time)*60000;
	sendMsg(4, auth_result, user_id, end_result, batteryRemains, temperature,
			"false", target_temperature);
	alert("airconditioner stop");
	airstart = setTimeout("air_start()", breakTime);
}

function sendMsg(Msg, auth_result, user_id, end_result, batteryRemains,temperature, airconditioner, target_temperature)

{
	
	count = count + 1;
	var sendData;

	var m00 = {
		"flag" : "00"
	};
	var m01 = {//auth result
		"flag" : "01",
		"authorization_result" : auth_result,
		"user_id" : user_id,
		"vehicle_code" : vehiclecode
	};
	var m02 = {//end connection
		"flag" : "02",
		"end_connection" : end_result
	};
	var m03 = {//요청온이후 계속보내야됨
		"flag" : "03",
		"battery" : batteryRemains,
		"temperature" : temperature
	};
	var m04 = {//aircond801 요청이후계속보냄
		"flag" : "04",
		"airconditioner" : airconditioner,
		"target_temperature" : target_temperature
	};

	if (Msg == 0) {
		sendData = m00;
	} else if (Msg == 1) {
		sendData = m01;
	} else if (Msg == 2) {
		sendData = m02;
	} else if (Msg == 3) {
		sendData = m03;
	} else if (Msg == 4) {
		sendData = m04;
	}

	$.post("http://yul1006.ivyro.net/msg.php", sendData,
			function(data, status) {
				
				interpretMsg(data);

			});
}

function interpretMsg(data) {

	var obj = JSON.parse(data);
	flag = obj.flag;
	

	if (flag == 10) {
		//empty
	}

	if (flag == 11) {
		user_id = obj.user_id;
		alert("모바일에서 인증 요청");
		//alert("Data: " + data + "\nStatus: " + status);
		confirmConnection(user_id);
	}

	if (flag == 12) {
		alert("준비명령");
		start = "true";
		airconditioner = "true";
		destination = obj.destination;
		addressToString = destination.toString();
		localStorage.setItem("a",addressToString);
		target_temperature = obj.target_temperature;
		keeping_time = obj.keeping_time;
		sendMsg(4, auth_result, user_id, end_result, batteryRemains,temperature, airconditioner, target_temperature);
		setTimeout("stopSystem()", 120000);//10+10분후에 사람안타면 종료, 필수
		
		//alert("네비게이션 목적지"+addressToString);
		if(destination==""){
			alert("바로 출발");		
		}
		//airconditioner = "true";
		

	}

	if (flag == 13) {
		batteryRemains = obj.battery;
		temperature = obj.temperature;
		seating = obj.seating;
		ridingCheck();
		batteryCheck();
		/*if( start=="true" && auth_result=="true"){
			sendMsg(3, auth_result, user_id, end_result, batteryRemains,temperature, airconditioner, target_temperature);
			
		}*/
	
	}

}



function showVehicleCode() {
	alert("Vehicle code:" + code);
}

function showBattery() {
	alert("Battery remains are " + batteryRemains);
}


function gonavi() {
	location.href = ('Navigation_menu2.html');
}


function showConnectionState() {
	if (end_result == "false") {
		alert("연결됨");
	} else {
		alert("연결안됨");
	}

}
function getvecode() {

	code = prompt("Please enter code", "");

}
function showcode() {
	alert(code);

}


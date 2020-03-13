var connected_flag = 0;
var mqtt;
var reconnectTimeout = 2000;
var host = "127.0.0.1";
var port = 1884;
var myNodelist = document.getElementsByTagName("li");
var i;
var x;
function onConnectionLost() {
  console.log("connection lost");
  document.getElementById("status").innerHTML = "Connection Lost";
  document.getElementById("messages").innerHTML = "Connection Lost";
  connected_flag = 0;
}
function onFailure(message) {
  console.log("Failed");
  document.getElementById("messages").innerHTML = "Connection Failed- Retrying";
  setTimeout(MQTTconnect, reconnectTimeout);
}
function onMessageArrived(r_message) {
  document.getElementById("messages").innerHTML +=
    "<span>Topic: " +
    r_message.destinationName +
    "  | " +
    message.payloadString +
    "</span><br/>";
  updateScroll();
}
function onConnected(recon, url) {
  console.log(" in onConnected " + reconn);
}
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  document.getElementById("messages").innerHTML =
    "Connected to " + host + " on port " + port;
  connected_flag = 1;
  document.getElementById("status").innerHTML = "Connected";
  console.log("on Connect " + connected_flag);
  //mqtt.subscribe("sensor1");
  //message = new Paho.MQTT.Message("Hello World");
  //message.destinationName = "sensor1";
  //mqtt.send(message);
}

function MQTTconnect() {
  document.getElementById("messages").innerHTML = "";

  console.log("connecting to " + host + " " + port);
  clientID = "clientID-" + parseInt(Math.random() * 1000);
  mqtt = new Paho.MQTT.Client(host, port, clientID);
  //document.write("connecting to "+ host);
  var options = {
    timeout: 3,
    onSuccess: onConnect,
    onFailure: onFailure
  };

  mqtt.onConnectionLost = onConnectionLost;
  mqtt.onMessageArrived = onMessageArrived;
  mqtt.onConnected = onConnected;

  mqtt.connect(options);
  //return false;
}
function sub_topics(tname) {
  //document.getElementById("messages").innerHTML +="stopic";
  if (connected_flag == 0) {
    out_msg = "<b>Not Connected so can't subscribe</b>";
    console.log(out_msg);
    document.getElementById("messages").innerHTML = out_msg;
    //return false;
  }
  //var stopic= x;
  console.log("Subscribing to topic =" + tname);
  mqtt.subscribe(tname);
  document.getElementById("messages").innerHTML +=
    "<br><b>Subscribed to topic:" + tname + "<br>";
}
function send_message() {
  //document.getElementById("messages").innerHTML ="";
  if (connected_flag == 0) {
    out_msg = "<b>Not Connected so can't send</b>";
    console.log(out_msg);
    document.getElementById("messages").innerHTML = out_msg;
    return false;
  }
  var msg = document.forms["smessage"]["message"].value;
  console.log(msg);

  var topic = document.forms["smessage"]["Ptopic"].value;
  message = new Paho.MQTT.Message(msg);
  if (topic == "") {
    alert("please specify topic");
    return false;
  } else message.destinationName = topic;
  mqtt.send(message);
  return false;
}

//Updates #messages div to auto-scroll
function updateScroll() {
  var element = document.getElementById("messages");
  element.scrollTop = element.scrollHeight;
}

/*var list = document.getElementById("myUL");
list.addEventListener('click', function(ev) {
if (ev.target.tagName === 'LI') {
   alert(ev.target.v);
//ev.target.classList.toggle('checked');
}
}, false);*/

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("nTopic").value;

  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === "") {
    alert("You must write something!");
    return false;
  } else {
    document.getElementById("myUL").appendChild(li);
    li.addEventListener("click", doStuff, false);
  }
  /*var span = document.createElement("SPAN");
var txt = document.createTextNode("\u00D7");
span.className = "close";
span.appendChild(txt);
li.appendChild(span);*/
  return false;
}

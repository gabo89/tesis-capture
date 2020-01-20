
const SerialPort = require('serialport')
const ByteLength = require('@serialport/parser-byte-length')
const Delimiter = require('@serialport/parser-delimiter')
const { execSync } = require('child_process');


const port = new SerialPort("/dev/rfcomm0", {baudRate: 57600,autoOpen: false});
port.setEncoding("utf8");
const parser = port.pipe(new ByteLength({length: 18}))

port.on('open', function() {
  console.log("opening port rfcomm0");
  port.flush();
});

port.on('error', function() {
  console.log("error port rfcomm0");
  port.flush();
});

port.on('drain', function() {
  console.log("error port rfcomm0");
  port.flush();
});

parser.on('data', function(data){ 

var salida=data;

var accelxchunk = salida.slice(0, 2);
var accelychunk = salida.slice(2, 4);
var accelzchunk = salida.slice(4, 6);
var magnexchunk = salida.slice(6, 8);
var magneychunk = salida.slice(8, 10);
var magnezchunk = salida.slice(10, 12);
var gyroxchunk = salida.slice(12, 14);
var gyroychunk = salida.slice(14, 16);
var gyrozchunk = salida.slice(16, 18);

var accelx = accelxchunk.readInt16BE(0);
var accely = accelychunk.readInt16BE(0);
var accelz = accelzchunk.readInt16BE(0);
var magnex = magnexchunk.readInt16BE(0);
var magney = magneychunk.readInt16BE(0);
var magnez = magnezchunk.readInt16BE(0);
var gyrox = gyroxchunk.readInt16BE(0);
var gyroy = gyroychunk.readInt16BE(0);
var gyroz = gyrozchunk.readInt16BE(0);

console.log(salida); 
console.log(accelx+" "+accely+" "+accelz+" "+magnex+" "+magney+" "+magnez+" "+gyrox+" "+gyroy+" "+gyroz);

});  

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

var recursiveAsyncReadLine = function () {

  readline.question('Command: ', function (cmd) {
    if (cmd == 'exit') 
    {
      readline.close(); 
      port.flush();
      port.close();
      process.exit();
    }
    

    var status=port.write(Buffer.from(`${cmd}`)); 
    console.log(`command sent:  ${cmd}` + " status: "+ status);
    recursiveAsyncReadLine();
  });
};




 console.log('view existing ports')
  var response= execSync('rfcomm -a');
  console.log(response.toString());
  if (!response.toString().includes('30:14:06:18:04:67'))
	{
	let stdout1 = execSync('/usr/bin/rfcomm bind 0 30:14:06:18:04:67 1');
	console.log("binding rfcomm0 since is empty");
	
	}
  else
	{
	console.log('port rfcomm0 already exists')
	
	}



console.log("checking if device is already paired");
var response1= execSync('bluetoothctl <<< paired-devices | grep "sensor2\\|bluetooth" | grep -v "NEW\\|DEL" 2>/dev/null');
console.log(response1.toString());
if (response1.toString().includes('30:14:06:18:04:67'))
{
console.log("device is already paired");
port.open();
recursiveAsyncReadLine();
}
else
{
console.log("starting to pair device");
var response7= execSync("/opt/project/tesis/blueconfig.sh 30:14:06:18:04:67");
console.log(response7.toString());
port.open();
recursiveAsyncReadLine();
}



/*
https://cryptii.com/pipes/integer-encoder
#o1 streaming on sensor
#o0 stop streaming


#osrt text
#osrb binary


*/







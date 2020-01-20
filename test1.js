
const SerialPort = require('serialport')
const ByteLength = require('@serialport/parser-byte-length')
const Delimiter = require('@serialport/parser-delimiter')
const { execSync } = require('child_process');


const port = new SerialPort("/dev/rfcomm0", {baudRate: 57600});
const parser = port.pipe(new ByteLength({length: 36}))
parser.on('data', function(data){ console.log(data.toString()); });  

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

var recursiveAsyncReadLine = function () {

  readline.question('Command: ', function (cmd) {
    if (cmd == 'exit') 
    {
      readline.close(); 
      process.exit();
    }
    console.log(`command sent:  ${cmd}`)
    port.write(`${cmd}`)
    recursiveAsyncReadLine();
  });
};

var response19= execSync('bluetoothctl <<< paired-devices | grep "sensor2\\|bluetooth" | grep -v "NEW\\|DEL" 2>/dev/null');
console.log(response19.toString());
if (response19.toString().includes('30:14:06:18:04:67'))
{
  var response12= execSync('/usr/bin/bt-device -r 30:14:06:18:04:67');
  console.log(response12.toString());  
  console.log("waiting to rediscover remote bluetooth devices");
  var response11= execSync('hcitool scan');
  console.log(response11.toString());
}
else
{
console.log("starting from new");
}
	

var response0= execSync('hciconfig hci0 noscan');
  console.log(response0.toString());

var response6= execSync(' hciconfig hci0 sspmode 0');
  console.log(response6.toString());

var response7= execSync('/usr/bin/bt-agent -c NoInputNoOutput -p /opt/project/tesis/pinfile -d');
  console.log(response7.toString());


 console.log('view existing ports')
  var response= execSync('rfcomm -a');
  console.log(response.toString());
  if (!response.toString().includes('30:14:06:18:04:67'))
	{
	let stdout1 = execSync('/usr/bin/rfcomm bind 0 30:14:06:18:04:67 1');
	console.log("binding rfcomm0 since is empty");
	//recursiveAsyncReadLine();
	}
  else
	{
	console.log('port rfcomm0 already exists')
	//recursiveAsyncReadLine();
	}



console.log("checking if device is already paired");
var response1= execSync('bluetoothctl <<< paired-devices | grep "sensor2\\|bluetooth" | grep -v "NEW\\|DEL" 2>/dev/null');
console.log(response1.toString());
if (response1.toString().includes('30:14:06:18:04:67'))
{
console.log("device is already paired");
recursiveAsyncReadLine();
}
else
{
console.log("starting to pair device");
var spawn = require('child_process').spawn;
    cmd    = spawn('/usr/bin/bt-device', ['-c','30:14:06:18:04:67']);
cmd.stdin.setEncoding('utf-8');

cmd.stdout.on('data', function (data) {
  var salida= data.toString();
  console.log(salida);
  cmd.stdin.write("1234\n");
  
});

cmd.stderr.on('data', function (data) {
  var error=data.toString();
  console.log(error);
});

cmd.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString());
if (code.toString()=="0")
{
recursiveAsyncReadLine();
cmd.stdin.end();
}
else
{
console.log("error in system..... exiting");
cmd.stdin.end();
process.exit();
}
});
}



/*
https://cryptii.com/pipes/integer-encoder
#o1 streaming on sensor
#o0 stop streaming


#osrt text
#osrb binary


acelx = (float)Convert.ToInt16(partes.Substring(0, 4), 16);
acely = (float)Convert.ToInt16(partes.Substring(4, 4), 16);
acelz = (float)Convert.ToInt16(partes.Substring(8, 4), 16);

magnx = (float)Convert.ToInt16(partes.Substring(12, 4), 16);
magny = (float)Convert.ToInt16(partes.Substring(16, 4), 16);
magnz = (float)Convert.ToInt16(partes.Substring(20, 4), 16);

gyrox = (float)Convert.ToInt16(partes.Substring(24, 4), 16);
gyroy = (float)Convert.ToInt16(partes.Substring(28, 4), 16);
gyroz = (float)Convert.ToInt16(partes.Substring(32, 4), 16);
*/







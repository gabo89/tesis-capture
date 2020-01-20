var spawn = require('child_process').spawn,
    cmd    = spawn('/usr/bin/bt-device', ['-c', '30:14:06:18:04:67']);

cmd.stdin.setEncoding('utf-8');

cmd.stdout.on('data', function (data) {
  var salida= data.toString();
	console.log(salida);
 	if (salida.includes('passkey:'))
	cmd.stdin.write("1234\n");

});

cmd.stderr.on('data', function (data) {
  console.log(data.toString());
});

cmd.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString());
});

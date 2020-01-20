var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

btSerial.on('found', function(address, name) {
	btSerial.findSerialPortChannel(address, function(channel) {
		btSerial.connect(address, channel, function() {
			console.log('connected');

			btSerial.write(Buffer.from('#o1', 'utf-8'), function(err, bytesWritten) {
				if (err) console.log(err);
			});

			btSerial.on('data', function(buffer) {
				console.log(buffer.toString('utf-8'));
			});
		}, function () {
			console.log('cannot connect');
		});

		// close the connection when you're ready
		btSerial.close();
	}, function() {
		console.log('found nothing');
	});
});

btSerial.inquire();


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







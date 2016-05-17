var http = require("http");
var https = require("https");
var url = require('url');
var logger = require('../utils/print_utils');
//var ByteBuffer = require('ByteBuffer');
var ByteBuffer = require("bytebuffer");

var ERROR_HTTP_NETWORK = 999;	// TODO move to constants
var ERROR_HTTP_STATUS_0 = 998;	// TODO move to constants

exports.httpGetPB = function(host, port, path, onResult) {

	var options = {
		host : host, //e.g. '58.215.160.100',
		port : port, //e.g. 8001
		path : path, //e.g. '/api/i?m=su&app=513819630&gid=Draw&uid=4fc3089a26099b2ca8c7a4ab&ss=abc&si=0&ei=20',
		method : 'GET',
		headers : {
			'Content-Type' : 'application/json'
		}
	};

	var url = host + ':' + port + path;
	var port = options.port == 443 ? https : http;

	var req = port.request(options, function(res) {
		logger.printv("httpGetPB, option = " + JSON.stringify(options));
		
		var buffer = null;

		res.on('data', function(chunk) {
			if (chunk != null && chunk.length > 0) {
				var newBuffer = new Buffer(chunk.length);
				for ( var i = 0; i < chunk.length; i++) {
					newBuffer[i] = chunk[i];
				}
				if (buffer == null) {
					buffer = newBuffer;
				} else {
					var list = [];
					list[0] = buffer;
					list[1] = newBuffer;
					buffer = Buffer.concat(list, buffer.length
							+ newBuffer.length);
				}
//				console.log("current " + buffer.length + ", add "
//						+ chunk.length + ", offset " + buffer.offset);
			}
		});

		res.on('end', function() {
			var output = new ByteBuffer();
			if (buffer != null && buffer.length > 0){
				output.append(buffer);
			}
			output.flip();
			logger.printv("httpGetPB, receive bytes = " + output.length);
			
			var code = 0;
			if (res.statusCode = 200){
				code = 0;
			}
			else if (res.statusCode == 0){
				code = ERROR_HTTP_STATUS_0;
			}
			else{
				code = res.statusCode;
			}
			
			onResult(url, code, output);
		});
	});

	req.on('error', function(err) {
		logger.printv('httpGetPB, error=' + err);
		// TODO check whether to send err.errorCode here
		onResult(url, ERROR_HTTP_NETWORK, null);
	});

	req.end();
};

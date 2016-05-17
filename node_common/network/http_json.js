var http = require("http");
var https = require("https");
var url = require('url');
var logger = require('../utils/print_utils');

var http = require('http');
var fs = require('fs');
var restler = require('restler');

exports.httpPostJSON = function (host, port, path, post_data, onResult) {

    var post_options = {
        host: host, //e.g. '58.215.160.100',
        port: port, //e.g. 8001
        path: path, //e.g. '/api/i?m=su&app=513819630&gid=Draw&uid=4fc3089a26099b2ca8c7a4ab&ss=abc&si=0&ei=20',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    var url = host + ':' + port + path;
    var port = post_options.port == 443 ? https : http;

    // Set up the request
    var post_req = http.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
        res.on('end', function () {
            try {
                var obj = JSON.parse(output);
            } catch (err) {
                obj = null;
            }
            onResult(url, res.statusCode, obj);
            logger.printv(obj);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

}

exports.httpUploadJSON = function (host, port, path, name, file, onResult) {
    var url = host + ':' + port + path;
    var proxy = (port == 443) ? 'https' : 'http';
    url = proxy + '://' + url;
    logger.printv('upload url = ' + url);

    fs.stat(file, function (err, stats) {
        var result = restler.post(url, {
            multipart: true,
            data: {
                "folder_id": "0",
                "filename": restler.file(file, null, stats.size, null, "image/jpg")
            }
        })
        result.on("complete", function (data) {
            console.log(data);
            if (data) {
                logger.printv('upload complete...');
                onResult(url, 200, data);
            }
        });
        result.on("fail", function (data) {
            console.log(data);
            if (data) {
                onResult(url, 404, data);
            }
        });
    });
};

exports.httpUploadJSON_1 = function (host, port, path, name, file, onResult) {
    var post_options = {
        host: host, //e.g. '58.215.160.100',
        port: port, //e.g. 8001
        path: path, //e.g. '/api/i?m=su&app=513819630&gid=Draw&uid=4fc3089a26099b2ca8c7a4ab&ss=abc&si=0&ei=20',
        method: 'POST'
//        headers : {
//            'Content-Type' : 'image/*'
//        }
    };

    var url = host + ':' + port + path;
    var port = post_options.port == 443 ? https : http;


    var boundaryKey = Math.random().toString(16); //随机数，目的是防止上传文件中出现分隔符导致服务器无法正确识别文件起始位置
    console.log(boundaryKey);

    // Set up the request
    var post_req = http.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
        res.on('end', function () {
            try {
                var obj = JSON.parse(output);
            } catch (err) {
                obj = null;
            }
            onResult(url, res.statusCode, obj);
            logger.printv(obj);
        });
    });

    var payload = '--' + boundaryKey + '\r\n'
        // use your file's mime type here, if known
        + 'Content-Type: image/jpeg\r\n'
        // "name" is the name of the form field
        // "filename" is the name of the original file
        + 'Content-Disposition: form-data; name=' + name + '; filename=' + name + '\r\n'
        + 'Content-Transfer-Encoding: binary\r\n\r\n';
    console.log(payload.length);

    var enddata = '\r\n--' + boundaryKey + '--';
    console.log('enddata:' + enddata.length);
    post_req.setHeader('Content-Type', 'multipart/form-data; boundary=' + boundaryKey + '');
    post_req.setHeader('Content-Length', Buffer.byteLength(payload) + Buffer.byteLength(enddata));

    post_req.write(payload);

    var fileStream = fs.createReadStream(file, { bufferSize: 4 * 1024 });
    fileStream.pipe(post_req, {end: false});
    fileStream.on('end', function () {
        // mark the end of the one and only part
        post_req.end(enddata);

    });

    post_req.on('error', function (e) {
        console.error("error:" + e);
    });

}


exports.httpGetJSON = function (host, port, path, onResult) {

    var options = {
        host: host, //e.g. '58.215.160.100',
        port: port, //e.g. 8001
        path: path, //e.g. '/api/i?m=su&app=513819630&gid=Draw&uid=4fc3089a26099b2ca8c7a4ab&ss=abc&si=0&ei=20',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var url = host + ':' + port + path;
    var port = options.port == 443 ? https : http;

    var req = port.request(options, function (res) {
        logger.printv("httpGetJSON, option = " + JSON.stringify(options));
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            try {
                var obj = JSON.parse(output);
            } catch (err) {
                obj = null;
            }
            onResult(url, res.statusCode, obj);
            logger.printv(obj);
        });
    });

    req.on('error', function (err) {
        logger.printv('httpGetJSON, error=' + err);
        // TODO check whether to send err.errorCode here
        onResult(url, 999, null);
    });

    req.end();
};

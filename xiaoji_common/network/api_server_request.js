/**
 * Game API Server api's 
 *
 * Location: EXPRESS_BASE/xiaoji_common/network/api_server_request.js
 */

var commonRequest = require('./CommonRequest');


if (process.argv[2] == 'debug') {
   var HOST = 'www.you100.me';
   var PORT = 8200;
} else {
    var HOST = 'mongodb';
    var PORT = 8200;
}

var PATH = "/api/i?";

exports.send = commonRequest.send.bind(null, HOST, PORT, PATH);
exports.post = commonRequest.post.bind(null, HOST, PORT, PATH);
exports.upload = commonRequest.upload.bind(null, HOST, PORT, PATH)
exports.sendGetAndResponsePB = commonRequest.sendGetAndResponsePB.bind(null, HOST, PORT, PATH);

var http_json = require('../../node_common/network/http_json');
var querystring = require('querystring');
var http_json = require('../../node_common/network/http_json');
var http_pb = require('../../node_common/network/http_pb');
var logger = require('../../node_common/utils/print_utils');
var querystring = require('querystring');

var ProtoBuf = require("protobufjs");
var DataQueryResponse = ProtoBuf.protoFromFile('protocol_buffer/GameMessage.proto').build('game.DataQueryResponse');

var ERROR_PARSING_PB = 1;


exports.send = function (host, port, basePath, jsonPara, onResult) {
    var path = basePath + querystring.stringify(jsonPara);
    console.info("<send> path = " + path);
    http_json.httpGetJSON(host, port, path, onResult);
};


exports.post = function (host, port, basePath, jsonPara, byteData, onResult) {
    var path = basePath + querystring.stringify(jsonPara);
    http_json.httpPostJSON(host, port, path, byteData, onResult);
}


exports.upload = function (host, port, basePath, jsonPara, key, file, onResult) {
    var path = basePath + querystring.stringify(jsonPara);
    http_json.httpUploadJSON(host, port, path, key, file, onResult);

}


exports.sendGetAndResponsePB = function (host, port, basePath, jsonPara, onResult) {

    var path = basePath;
    path = path + querystring.stringify(jsonPara);
    console.info("<sendGetAndResponsePB> path = " + path);
    //inner handler
    var phHandler = function (request_url, statusCode, data) {
        if (data) {
            console.log("data.length=" + data.length);
        } else {
            console.log("data is null");
        }

        if (!DataQueryResponse) {
            logger.printv("<sendGetAndResponsePB> DataQueryResponse proto obj is null!!!!");
        }

        if (statusCode == 0 && data) {
            if (data.length == 0) {
                logger.printv("<sendGetAndResponsePB> get pb response but data length is 0!");
                onResult(request_url, ERROR_PARSING_PB, null);
            }
            else {
                // parse protocol buffer here
                try {
                    var responsePB = DataQueryResponse.decode(data);
                    logger.printv("<sendGetAndResponsePB> response pb result code = " + responsePB.resultCode + " " + JSON.stringify(responsePB));
                    onResult(request_url, statusCode, responsePB);
                }
                catch (err) {
                    logger.printv("<sendGetAndResponsePB> parsing response pb but catch exception = " + err.msg);
                    onResult(request_url, ERROR_PARSING_PB, null);
                }
            }
        }
        else {
            logger.printv("<sendGetAndResponsePB> statusCode = " + statusCode);
            onResult(request_url, statusCode, null);
        }
    }

    http_pb.httpGetPB(host, port, path, phHandler);
};

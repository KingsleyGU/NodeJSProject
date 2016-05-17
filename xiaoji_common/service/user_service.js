var logger = require('../../node_common/utils/print_utils');
var traffic_api_server_request = require('../network/traffic_api_server_request');
var api_server_request = require('../network/api_server_request');

var user_manager = require('../model/user/user_manager');

require('../constants/constants');
var crypto = require('crypto');


//result is a function(code, data)
var parse_result = function (statusCode, json, result) {
    if (typeof json == 'string') {
        logger.info('json is string, eval it!!!');
        json = eval('json=' + json);
    }
    var code = statusCode;
    var data = null;
    if (code == 200) {
        code = 0;
        if (json) {
            code = json.ret
        }
    } else {
        code = ERROR_NETWORK;
    }

    if (code == 0 && json != null) {
        data = json.dat;
    }
    logger.printv('parse result,  code = ' + code + ', data = ' + data);
    result(code, data);
}


exports.getUserFansCount = function (userId, appId, gameId, callback) {

    var req_json = {
        m: METHOD_GET_RELATION_COUNT,
        app: appId,
        gid: gameId,
        uid: userId
    };

    var fanCount = 0;

    api_server_request.send(req_json,
        function (request_url, statusCode, json) {
            if (json != null && statusCode == 200 && json.ret == 0) {
                logger.printv('<getUserFansCount> return json = ' + JSON.stringify(json));
                callback(0, json);
            }
            else {
                logger.printv('<getUserFansCount> error no data, statuCode=' + statusCode +
                    ', json=' + JSON.stringify(json));
                if (json != null && statusCode == 200) {
                    statusCode = json.ret;
                }

                callback(statusCode, []);
            }

        });

};

exports.getUser = function (targetUserId, loginUserId, appId, gameId, callback) {

    var userId = DEFAULT_SYSTEM_USER_ID;
    if (loginUserId != null) {
        userId = loginUserId;
    }

    var req_json = {
        m: METHOD_GET_TARGET_USER_INFO,
        app: appId,
        gid: gameId,
        uid: userId,
        tid: targetUserId,
        format: FORMAT_PB
    };

    api_server_request.sendGetAndResponsePB(req_json,
        function (request_url, statusCode, responsePB) {
            if (responsePB != null && responsePB.user != null) {
                logger.printv('<getUser> return user = ' + responsePB.user);
                callback(statusCode, responsePB.user, responsePB.userRelation);
            }
            else {
                logger.printv('<getUser> error no data, statuCode=' + statusCode);
                callback(statusCode, null, 0);
            }

        });
};

exports.getFeedTimes = function (feedTimesList, type) {

    var value = 0;
    if (feedTimesList == null)
        return 0;

    for (var i = 0; i < feedTimesList.length; i++) {
//        console.log("<getFeedTimes> type="+feedTimesList[i].type+", value="+feedTimesList[i].value);
        if (feedTimesList[i] == null)
            continue;

        if (feedTimesList[i].type == type) {
            value = feedTimesList[i].value;
            break;
        }
    }

    return value;
}

exports.getFeedFlowerTimes = function (feedTimesList, type) {
    return exports.getFeedTimes(feedTimesList, FeedTimesTypeFlower);
}

exports.getFeedCommentTimes = function (feedTimesList) {
    return exports.getFeedTimes(feedTimesList, FeedTimesTypeComment);
}


exports.getFeedList = function (type, appId, gameId, offset, limit, callback) {

    var req_json = {
        m: METHOD_GET_FEED_LIST,
        app: appId,
        gid: gameId,
        uid: DEFAULT_SYSTEM_USER_ID,
        os: offset,
        ct: limit,
        lang: LANGUAGE_CHINESE,
        format: FORMAT_PB,
        img: 1,
        tp: type
    };

    traffic_api_server_request.sendGetAndResponsePB(req_json,
        function (request_url, statusCode, responsePB) {
            if (responsePB != null && responsePB.feed != null) {
                logger.printv('<getFeedList> return feed list count = ' + responsePB.feed.length);
                callback(statusCode, responsePB.feed);
            }
            else {
                logger.printv('<getFeedList> error no data, statuCode=' + statusCode);
                callback(statusCode, []);
            }

        });
};


var encodePassword = function (password) {
    var sig = crypto.createHash('md5')
        .update(password + PASSWORD_KEY)
        .digest('base64');
    return sig;
};


exports.login = function (email, xiaojiNumber, password, callback) {
    var req_json = {
        app: APP_ID_DRAW,
        gid: GAME_ID_DRAW,
        format: FORMAT_PB
    };
    req_json[PARA_PASSWORD] = encodePassword(password);
    if (email) {
        req_json.m = METHOD_LOGIN;
        req_json[PARA_EMAIL] = email;
    } else if (xiaojiNumber) {
        req_json.m = METHOD_LOGIN_NUMBER;
        req_json[PARA_XIAOJI_NUMBER] = xiaojiNumber;
    }

    api_server_request.sendGetAndResponsePB(req_json,
        function (request_url, statusCode, responsePB) {
            if (statusCode == 0 && responsePB != null && responsePB.resultCode == 0) {
                callback(statusCode, responsePB.user);
                logger.printv('<login> success, user = ' + responsePB.user);
            }
            else {
                if (responsePB && responsePB.resultCode != 0) {
                    statusCode = responsePB.resultCode;
                }
                logger.printv('<login> error no data, statuCode=' + statusCode);
                callback(statusCode, {});
            }
        }
    );
}

//callback(code, user)
exports.register = function (email, nick, password, callback) {
    var req_json = {
        m: METHOD_REGISTER_USER,
        app: APP_ID_DRAW,
        gid: GAME_ID_DRAW,
        rt: REGISTER_TYPE_EMAIL
    };
    req_json[PARA_EMAIL] = email;
    req_json[PARA_PASSWORD] = encodePassword(password);
    req_json[PARA_NICKNAME] = nick;

    api_server_request.send(req_json,
        function (request_url, statusCode, json) {
            if (json != null && statusCode == 200 && json.ret == 0) {
                var user = json.dat;
                logger.printv('<register> return user = ' + JSON.stringify(user));
                callback(0, user);
            }
            else {
                logger.printv('<register> error no data, statuCode=' + statusCode +
                    ', json=' + JSON.stringify(json));
                if (json != null && statusCode == 200) {
                    statusCode = json.ret;
                }
                callback(statusCode, {});
            }

        });
}

//callback is function(code)
var updateRelation = function (user_id, target_uid, is_follow, callback) {
    if (target_uid.length != OBJECTID_LENGTH) {
        callback(ERROR_OBJECTID_LENGTH);
    }
    var req_json = {
        m: METHOD_FOLLOW_USER,
        app: APP_ID_DRAW,
        gid: GAME_ID_DRAW,
        uid: user_id,
        tid: target_uid
    };
    if (!is_follow) {
        req_json.m = METHOD_UNFOLLOW_USER;
    }
    api_server_request.send(req_json,
        function (request_url, statusCode, json) {
            var code = statusCode;
            if (statusCode == 200) {
                code = json.ret;
            }
            callback(code);
        });
}

exports.follow = function (user_id, target_uid, callback) {
    updateRelation(user_id, target_uid, true, callback);
}

exports.unfollow = function (user_id, target_uid, callback) {
    updateRelation(user_id, target_uid, false, callback);
}

exports.update_user = function (uid, nick, signature, gender, callback) {

    var user = user_manager.createPBGameUser(uid, nick, gender, signature);
    var req_json = {
        m: METHOD_NEW_UPDATE_USER,
        app: APP_ID_DRAW,
        gid: GAME_ID_DRAW,
        uid: uid
    };
    var byteData = user.encode().toBuffer();//buffer;//buffer.toArrayBuffer();

    logger.printv('byteData length = ' + byteData.length + ', data = ' + byteData);

    api_server_request.post(req_json, byteData, function (request_url, statusCode, json) {
        logger.printv('result = ' + JSON.stringify(json));
        parse_result(statusCode, json, function (code, data) {
            callback(code);
        })
    })
};

exports.update_avatar = function (req_json, file, callback) {
    api_server_request.upload(req_json, 'img', file, function (request_url, statusCode, json) {
        logger.printv('result = ' + JSON.stringify(json));
        parse_result(statusCode, json, function (code, data) {
            var url = null;
            if (data) {
                url = data.url;
            }
            callback(code, url);
        })
    })
};

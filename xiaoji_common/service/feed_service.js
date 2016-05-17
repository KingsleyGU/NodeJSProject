var logger = require('../../node_common/utils/print_utils');
var obj_util = require('../../node_common/utils/obj_utils');
var traffic_api_server_request = require('../network/traffic_api_server_request');
require('../constants/constants');

var FeedTimesTypeMatch = 1;
var FeedTimesTypeGuess = 2;
var FeedTimesTypeCorrect = 3;
var FeedTimesTypeComment = 4;
var FeedTimesTypeFlower = 5;
var FeedTimesTypeTomato = 6;
var FeedTimesTypeSave = 7;
var FeedTimesTypeContestComment = 9;

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

exports.getUserOpusCount = function (userId, appId, gameId, callback) {

    var req_json = {
        m: METHOD_GET_OPUS_COUNT,
        app: appId,
        gid: gameId,
        tid: userId,
        uid: DEFAULT_SYSTEM_USER_ID
    };

    traffic_api_server_request.send(req_json,
        function (request_url, statusCode, json) {
            if (json != null && statusCode == 200 && json.ret == 0) {
                logger.printv('<getUserOpusCount> return json = ' + JSON.stringify(json));
                callback(0, json);
            }
            else {
                logger.printv('<getUserOpusCount> error no data, statuCode=' + statusCode +
                    ', json=' + JSON.stringify(json));
                if (json != null && statusCode == 200) {
                    statusCode = json.ret;
                }

                callback(statusCode, []);
            }

        });
};

exports.getUserOpusList = function (userId, appId, gameId, offset, limit, callback) {

    var req_json = {
        m: METHOD_GET_FEED_LIST,
        app: appId,
        gid: gameId,
        uid: userId,
        os: offset,
        ct: limit,
        lang: LANGUAGE_CHINESE,
        format: FORMAT_PB,
        img: 1,
        tp: FEED_LIST_TYPE_USER_OPUS
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

exports.getUserFavoriteOpusList = function (userId, appId, gameId, offset, limit, callback) {

    var req_json = {
        m: METHOD_GET_FEED_LIST,
        app: appId,
        gid: gameId,
        uid: userId,
        os: offset,
        ct: limit,
        lang: LANGUAGE_CHINESE,
        format: FORMAT_PB,
        img: 1,
        tp: FEED_LIST_TYPE_FAVORITE
    };

    traffic_api_server_request.sendGetAndResponsePB(req_json,
        function (request_url, statusCode, responsePB) {
            if (responsePB != null && responsePB.feed != null) {
                logger.printv('<getUserFavoriteOpusList> return feed list count = ' + responsePB.feed.length);
                callback(statusCode, responsePB.feed);
            }
            else {
                logger.printv('<getUserFavoriteOpusList> error no data, statuCode=' + statusCode);
                callback(statusCode, []);
            }

        });
};


exports.getOpusActionList = function (type, opusId, appId, gameId, offset, limit, callback) {

    var req_json = {
        m: METHOD_GET_FEED_COMMENT_LIST,
        app: appId,
        gid: gameId,
        uid: DEFAULT_SYSTEM_USER_ID,
        opid: opusId,
        os: offset,
        ct: limit,
        format: FORMAT_PB,
        tp: type,
        ri: 1
    };

    traffic_api_server_request.sendGetAndResponsePB(req_json,
        function (request_url, statusCode, responsePB) {
            if (responsePB != null && responsePB.feed != null) {
                logger.printv('<getOpusActionList> return feed list count = ' + responsePB.feed.length);
                callback(statusCode, responsePB.feed);
            }
            else {
                logger.printv('<getOpusActionList> error no data, statuCode=' + statusCode);
                callback(statusCode, []);
            }

        });
};


var printFeed = function (feed) {
    console.info('print Feed, feed id = ' + feed.feedId);
    for (var i = 0; i < feed.length; ++i) {
        var key = feed[i];
        var value = feed[key];
        console.info(key + ' => ' + value);
    }
}

exports.getOpusById = function (opusId, appId, gameId, callback) {

    var req_json = {
        m: METHOD_GET_FEED_BY_ID,
        fid: opusId,
        app: appId,
        gid: gameId,
        uid: DEFAULT_SYSTEM_USER_ID,
        format: FORMAT_PB,
        rdm: 1,
        rcd: 0  // don't return non-compressed data
    };

    logger.printv("<getOpusById> opusId=" + opusId);
    traffic_api_server_request.sendGetAndResponsePB(req_json,
        function (request_url, statusCode, responsePB) {
            if (responsePB != null && responsePB.feed != null) {
                logger.printv('<getOpusById> return feed list count = ' + responsePB.feed.length);
                if (responsePB.feed.length > 0) {
                    callback(statusCode, responsePB.feed[0]);
                    //printFeed(responsePB.feed);
                }
                else {
                    callback(statusCode, null);
                }
            }
            else {
                logger.printv('<getOpusById> error no data, statuCode=' + statusCode);
                callback(statusCode, null);
            }

        });
};

//callback function(code, comment_id)
exports.comment = function (user, opus, source, content, app, callback) {
    var req_json = {m: METHOD_ACTION_ON_OPUS, act: OPUS_TYPE_COMMENT};
    req_json = obj_util.extend(req_json, user);
    req_json = obj_util.extend(req_json, opus);
    req_json = obj_util.extend(req_json, source);
    req_json = obj_util.extend(req_json, content);
    req_json = obj_util.extend(req_json, app);
    logger.printv('comment, parameters = ' + req_json);
    traffic_api_server_request.send(req_json, function (request_url, statusCode, json) {
        if (statusCode == 200) {
            logger.printv('comment result json = ' + JSON.stringify(json));
            var code = json.ret;
            callback(code);
        } else {
            callback(statusCode);
        }

    });
};

//callback function(code, flower_feed_id)

exports.send_flower = function (user, opus, app, callback) {
    var req_json = {m: METHOD_ACTION_ON_OPUS, act: OPUS_TYPE_FLOWER, decreaseCoins:1};
    req_json = obj_util.extend(req_json, user);
    req_json = obj_util.extend(req_json, opus);
    req_json = obj_util.extend(req_json, app); //app id, game id

    traffic_api_server_request.send(req_json, function (request_url, statusCode, json) {
        if (statusCode == 200) {
            logger.printv('comment result json = ' + JSON.stringify(json));
            var code = json.ret;
            var comment_id = '';//json.dat.fid;
            callback(code);
        } else {
            callback(statusCode);
        }
    });
};


exports.favor = function (user, opus, app, callback) {
    var req_json = {m: METHOD_ACTION_ON_OPUS, act: ACTION_TYPE_SAVE, an: 'save_times'};

    req_json = obj_util.extend(req_json, user);
    req_json = obj_util.extend(req_json, opus);
    req_json = obj_util.extend(req_json, app); //app id, game id

    traffic_api_server_request.send(req_json, function (request_url, statusCode, json) {
        if (statusCode == 200) {
            logger.printv('comment result json = ' + JSON.stringify(json));
            var code = json.ret;
            var comment_id = '';//json.dat.fid;
            callback(code);
        } else {
            callback(statusCode);
        }
    });
};


exports.check_statistic = function (session, opid, key, max_value) {
    try {
        var current_count = parseInt(session[opid][key]);
        return (current_count < max_value);
    } catch (e) {
        return true;
    }
}

exports.increase_statistic = function (session, opid, key, inc) {
    if (session[opid]) {
        if (session[opid][key]) {
            session[opid][key] += inc;
        } else {
            session[opid][key] = inc;
        }
    } else {
        session[opid] = {};
        session[opid][key] = inc;
    }
}
/**
 * User manager
 *
 * Location: EXPRESS_BASE/xiaoji_common/model/user/user_manager.js
 */

var logger = require('../../../node_common/utils/print_utils');
var ObjectID = require('mongodb').ObjectID;

var ProtoBuf = require("protobufjs");
var PBGameUser = ProtoBuf.protoFromFile('protocol_buffer/GameBasic.proto').build('game.PBGameUser');

exports.valid_userid = function (user_id) {

    var check_objectid = new RegExp("^[0-9a-fA-F]{24}$");

    if (user_id && user_id.length == 24 && check_objectid.test(user_id))
        return true;

    return false;
}

exports.getDefaultUserAvatar = function (gender) {
    if (gender) {
        return "../img/man@2x.png";
    }
    else {
        return "../img/female@2x.png";
    }
}

exports.getUserAvatar = function (avatar, gender) {
    if (avatar != null && avatar.length >= 4) { // 4 is file suffix
        var length = avatar.length;
        var extension = avatar.substring(length - 3, length)
        if (extension == "jpg" || extension == "png") {
            return avatar;
        }

        return exports.getDefaultUserAvatar(gender);
    }
    else {
        return exports.getDefaultUserAvatar(gender);
    }
}

var createPBGameUser = function (uid, nickName, gender, signature) {
    var user = new PBGameUser({
        userId: uid,
        nickName: nickName
//        gender: gender,
//        signature: signature
    });
    if(gender != undefined && gender != null){
        user.gender = gender;
    }
    if(signature){
        user.signature = signature;
    }

    return user;
}

exports.createPBGameUser = createPBGameUser;

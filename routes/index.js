/**
 * Routes dispatcher
 *
 * Location : EXPRESS_BASE/routes/index.js
 */

var logger = require('../node_common/utils/print_utils');
var charging_service = require('./user/charge');
var searching_service = require('./user/search');
var message_service = require('./user/message');
var blacklist_service = require('./user/black_list');
var bulletin_service = require('./user/bulletin');
var xiaoji_service = require('./user/xiaoji');

var traffic_api_server_request = require('../xiaoji_common/network/traffic_api_server_request');
var feed_service = require('../xiaoji_common/service/feed_service');
var user_service = require('../xiaoji_common/service/user_service');
var string_utils = require('../node_common/utils/string_utils');
var date_utils = require('../node_common/utils/date_utils');
var print_utils = require('../node_common/utils/print_utils');
var obj_utils = require('../node_common/utils/obj_utils');
var opus_utils = require('../xiaoji_common/utils/opus_utils');
var user_manager = require('../xiaoji_common/model/user/user_manager');
require('../xiaoji_common/constants/constants');
var url = require('url');


var HOME_FEED_DISPLAY_ROW_COUNT = 3;
var HOME_FEED_DISPLAY_COLUMN_COUNT = 3;
var HOME_FEED_DISPLAY_TOTAL = HOME_FEED_DISPLAY_ROW_COUNT * HOME_FEED_DISPLAY_COLUMN_COUNT;
var appId = APP_ID_DRAW;
var gameId = GAME_ID_DRAW;
var feedListType = FEED_LIST_TYPE_HOT;

var DRAW_APP = {app: appId, gid: gameId};

module.exports = function (app) {

    var showFeedList = function (req, res, feedListType) {

        var query = url.parse(req.url, true).query;

        var offset = 0;
        var limit = HOME_FEED_DISPLAY_TOTAL;

        if (query.offset) {
            offset = parseInt(query.offset);
        }
        /*
         res.render('index', {
         login_user: req.session.user,
         feed_list : feedList,
         getDescString : string_utils.getSubDesc,
         dateUtils : date_utils,
         getFeedFlowerTimes : feed_service.getFeedFlowerTimes,
         getFeedCommentTimes : feed_service.getFeedCommentTimes,
         displayRowCount : HOME_FEED_DISPLAY_ROW_COUNT,
         limit : limit,
         offset : offset,
         appId : appId,
         gameId : gameId
         });

         */
        feed_service.getFeedList(feedListType, appId, gameId, offset, limit, function (statusCode, feedList) {

            console.log("offset=" + offset + ", limit=" + limit);
            console.log("feedList.length=" + feedList.length);

            if (statusCode == 0 && feedList != null) {
                res.render('index', {
                    login_user: req.session.user,
                    feed_list: feedList,
                    getDescString: string_utils.getSubDesc,
                    dateUtils: date_utils,
                    getFeedFlowerTimes: feed_service.getFeedFlowerTimes,
                    getFeedCommentTimes: feed_service.getFeedCommentTimes,
                    displayRowCount: HOME_FEED_DISPLAY_ROW_COUNT,
                    limit: limit,
                    offset: offset,
                    appId: appId,
                    gameId: gameId
                });
            }
            else {
                res.render('index', {
                    login_user: req.session.user
                });
            }

        });


        return;
    };


    app.get('/', function (req, res) {
        res.render('index', {login_user: req.session.user});
    });
    app.get('/drawing', function (req, res) {
        res.render('drawing/drawing', {login_user: req.session.user});
    });

    app.get('/feed_list/:type', function (req, res) {
        var feedListType = parseInt(req.params.type);
        showFeedList(req, res, feedListType);
    });

    /*
     * Xiaoji Home
     */
    app.get('/home', function (req, res) {
        res.render('home', {
            login_user: req.session.user
        });

        return;
    });

    app.get('/opus/:opusid', function (req, res) {


        var opusId = req.params.opusid;
        var appId = APP_ID_DRAW; // req.params.appid;
        var gameId = GAME_ID_DRAW; // req.params.gameid;

        print_utils.info("route to opus, opusId=" + opusId);

        feed_service.getOpusById(opusId, appId, gameId, function (statusCode, feed) {

            if (statusCode == 0 && feed != null) {

                print_utils.info("opus image is " + feed.opusImage);

                res.render('opus/opus_detail', {
                    login_user: req.session.user,
                    dateUtils: date_utils,
                    feed: feed,
                    opusUtils: opus_utils,
                    user_manager: user_manager
                });
            }
            else {
                res.render('opus/opus_detail', {
                    login_user: req.session.user,
                    feed: null
                });
            }

        });

        return;

    });

    /*

     AJAX request

     */

    // for home, get feed list     
    app.get('/a/feed/:gameId/:appId/:type/:offset', function (req, res) {

        var appId = req.params.appId;
        var gameId = req.params.gameId;
        var type = parseInt(req.params.type);
        var offset = parseInt(req.params.offset);
        var limit = HOME_FEED_DISPLAY_TOTAL;

        print_utils.info("route to AJAX opus feed list");

        feed_service.getFeedList(type, appId, gameId, offset, limit, function (statusCode, feedList) {

            console.log("offset=" + offset + ", limit=" + limit);
            console.log("feedList.length=" + feedList.length);

            res.writeHead(200, {"Content-Type": "application/json"});
            if (statusCode == 0 && feedList != null) {
                res.end(JSON.stringify(feedList));
            }
            else {
                res.end("[]"); // write an empty JSON array
            }
        });
    });

    app.get('/a/opus_action/:opusid/:type/:offset', function (req, res) {

        var opusId = req.params.opusid;
        var appId = APP_ID_DRAW; // req.params.appid;
        var gameId = GAME_ID_DRAW; // req.params.gameid;
        var type = req.params.type;
        var offset = req.params.offset;

        print_utils.info("route to AJAX opus action, opusId=" + opusId);

        feed_service.getOpusActionList(type, opusId, appId, gameId, offset, 10, function (statusCode, feed) {

            res.writeHead(200, {"Content-Type": "application/json"});

            if (statusCode == 0 && feed != null) {
                res.end(JSON.stringify(feed));
            }
            else {
                res.end("[]"); // write an empty JSON array
            }

        });

        return;

    });

    /*

     AJAX request

     */
    app.get('/a/user_fans_count/:userid', function (req, res) {

        var userId = req.params.userid;
        var appId = APP_ID_DRAW; // req.params.appid;
        var gameId = GAME_ID_DRAW; // req.params.gameid;

        print_utils.info("route to AJAX get user fans count, userId=" + userId);

        user_service.getUserFansCount(userId, appId, gameId, function (statusCode, json) {

            res.writeHead(200, {"Content-Type": "application/json"});
            if (statusCode == 0 && json != null) {
                res.end(JSON.stringify(json.dat));
            }
            else {
                res.end("[]"); // write an empty JSON array
            }

        });

        return;

    });

    app.get('/a/user_opus_count/:userid', function (req, res) {

        var userId = req.params.userid;
        var appId = APP_ID_DRAW; // req.params.appid;
        var gameId = GAME_ID_DRAW; // req.params.gameid;

        print_utils.info("route to AJAX get user opus count, userId=" + userId);

        feed_service.getUserOpusCount(userId, appId, gameId, function (statusCode, json) {

            res.writeHead(200, {"Content-Type": "application/json"});

            if (statusCode == 0 && json != null) {
                res.end(JSON.stringify(json.dat));
            }
            else {
                res.end("[]"); // write an empty JSON array
            }

        });

        return;

    });

    app.get('/a/user_relation/:userid/:targetuserid', function (req, res) {

        var userId = req.params.userid;
        var targetUserId = req.params.targetuserid;

        var appId = APP_ID_DRAW; // req.params.appid;
        var gameId = GAME_ID_DRAW; // req.params.gameid;

        print_utils.info("route to AJAX get user relation, userId=" + userId + ", targetuserid=" + targetUserId);

        user_service.getUserRelation(userId, targetUserId, appId, gameId, function (statusCode, json) {

            res.writeHead(200, {"Content-Type": "application/json"});

            if (statusCode == 0 && json != null) {
                res.end(JSON.stringify(json.dat));
            }
            else {
                res.end("[]"); // write an empty JSON array
            }

        });

        return;

    });

    app.get('/a/user_detail/:targetuserid', function (req, res) {

        var loginUser = req.session.user;
        var loginUserId = null;
        if (loginUser != null) {
            loginUserId = loginUser.userId;
        }

        var targetUserId = req.params.targetuserid;

        var appId = APP_ID_DRAW; // req.params.appid;
        var gameId = GAME_ID_DRAW; // req.params.gameid;

        print_utils.info("route to AJAX get user, userId=" + loginUserId + ", targetuserid=" + targetUserId);

        user_service.getUser(targetUserId, loginUserId, appId, gameId, function (statusCode, pbUser, userRelation) {

            res.writeHead(200, {"Content-Type": "application/json"});
            if (statusCode == 0 && pbUser) {
                pbUser.userRelation = userRelation;
                var json = JSON.stringify(pbUser);
                res.end(json);
            }
            else {
                res.end("{}"); // write an empty JSON array
            }

        });

        return;

    });
    app.get('/user_detail/:targetuserid', function (req, res) {

        var loginUser = req.session.user;
        var loginUserId = null;
        if (loginUser != null) {
            loginUserId = loginUser.userId;
        }

        var targetUserId = req.params.targetuserid;

        var appId = APP_ID_DRAW; // req.params.appid;
        var gameId = GAME_ID_DRAW; // req.params.gameid;

        print_utils.info("get user, targetuserid=" + targetUserId);

        user_service.getUser(targetUserId, loginUserId, appId, gameId, function (statusCode, pbUser, userRelation) {
            if (statusCode == 0 && pbUser) {
                res.render('user/user_detail',
                    {
                        login_user: req.session.user,
                        user: pbUser,
                        user_relation: userRelation,
                        user_manager: user_manager
                    });
            } else {
                //TODO send error html
                res.send(404);
            }
        });

        return;
    });


    app.get('/a/user_opus_list/:userid/:startoffset', function (req, res) {

        var userId = req.params.userid;
        var startOffset = req.params.startoffset;
        var appId = APP_ID_DRAW; // req.params.appid;
        var gameId = GAME_ID_DRAW; // req.params.gameid;

        print_utils.info("route to AJAX get user opus list, userId=" + userId);

        var offset = 0;
        var limit = 9;

        if (startOffset != null) {
            offset = parseInt(startOffset);
        }

        feed_service.getUserOpusList(userId, appId, gameId, offset, limit, function (statusCode, feed) {

            res.writeHead(200, {"Content-Type": "application/json"});

            if (statusCode == 0 && feed != null) {
                res.end(JSON.stringify(feed));
            }
            else {
                res.end("[]"); // write an empty JSON array
            }

        });

        return;

    });

    app.get('/a/user_favorite_list/:userid/:startoffset', function (req, res) {

        var userId = req.params.userid;
        var startOffset = req.params.startoffset;
        var appId = APP_ID_DRAW; // req.params.appid;
        var gameId = GAME_ID_DRAW; // req.params.gameid;

        print_utils.info("route to AJAX get user opus list, userId=" + userId);

        var offset = 0;
        var limit = 6;

        if (startOffset != null) {
            offset = parseInt(startOffset);
        }

        feed_service.getUserFavoriteOpusList(userId, appId, gameId, offset, limit, function (statusCode, feed) {

            res.writeHead(200, {"Content-Type": "application/json"});

            if (statusCode == 0 && feed != null) {
                res.end(JSON.stringify(feed));
            }
            else {
                res.end("[]"); // write an empty JSON array
            }

        });

        return;

    });


    app.get('/user_page', function (req, res) {
        res.render('user_page/user_page', {login_user: req.session.user});
    });


    /*
     * User service routes.
     */
    app.get('/search', function (req, res) {
        searching_service.search(req, res);
    });

    app.post('/doSearch', function (req, res) {
        searching_service.doSearch(req, res);
    });

    app.get('/charge', function (req, res) {
        charging_service.charge(req, res);
    });

    app.post('/doCharge', function (req, res) {
        charging_service.doCharge(req, res);
    });

    app.get('/sendMessage', function (req, res) {
        message_service.sendMessage(req, res);
    });

    app.get('/setXiaoji', function (req, res) {
        xiaoji_service.setXiaoji(req, res);
    });

    app.post('/doSetUserXiaoji', function (req, res) {
        xiaoji_service.doSetUserXiaoji(req, res);
    });

    app.post('/doSendMessage', function (req, res) {
        message_service.doSendMessage(req, res);
    });

    app.get('/blacklist', function (req, res) {
        blacklist_service.blacklist(req, res);
    });

    app.post('/blacklistOp', function (req, res) {
        blacklist_service.blacklistOp(req, res);
    });

    app.get('/postBulletin', function (req, res) {
        bulletin_service.postBulletin(req, res);
    });

    app.post('/doPostBulletin', function (req, res) {
        bulletin_service.doPostBulletin(req, res);
    });

    app.get('/getBulletins', function (req, res) {
        bulletin_service.getBulletins(req, res);
    });

    app.post('/doGetBulletins', function (req, res) {
        bulletin_service.doGetBulletins(req, res);
    });

    /*
     * Admin service routes.
     */

    app.all('/login', function (req, res, next) {
        logger.printv('login all');
        if (req.session.user) {
            logger.printv('login all, user is already login');
            res.redirect('/');

            //user.userId  user.nickName user.avatar
        } else {
            next();
        }
    });

    app.get('/login', function (req, res) {
        res.render('login/login');
    });

    app.post('/login', function (req, res) {

        var email = req.body.account;
        var number = req.body.account;
        var password = req.body.password;
        var remember_me = req.body.remember_me;

        var message = undefined;
        var type = LOGIN_NICK;
        var from = req.query.from;

        logger.printv('login here, account = ' + email);
        logger.printv('login from = ' + from);

        if (number && !isNaN(number)) {
            logger.printv('login account number = ' + number);
            email = null;
        } else if (email && string_utils.isEmail(email)) {
            logger.printv('login account email = ' + email);
            number = null;
        } else {
            message = '帐号格式不对';
            logger.printv('login error = ' + message);
            res.render('login/login', {message: message, account: number, password: password, type: type});
            return;
        }

        user_service.login(email, number, password, function (code, user) {
            logger.printv('login code = ' + code + ' user = ' + user);
            if (code == 0) {
                req.session.user = user;
                req.session.user_id = user.userId;
                var lastpage = from ? from : '/';
                logger.printv('login lastpage = ' + lastpage);

                res.redirect(lastpage);
            } else {
                message = '帐号不存在或密码不正确';
                type = LOGIN_PASSWORD;
                logger.printv('login error = ' + message);
                res.render('login/login', {message: message, account: req.body.account, password: password, type: type});
            }
        });
    });

    app.get('/logout', function (req, res) {
        req.session.destroy();
        res.redirect('/');
    });

    app.all('/register', function (req, res, next) {

        logger.printv('register all');

        logger.printv('register sid = ' + req.sessionID);


        if (req.session.user) {
            logger.printv('register all, user is already login');
            res.render('/', {login_user: req.session.user});
        } else {
//            req.session.destroy();
            next();
        }
    });


    app.get('/register', function (req, res) {
        logger.printv('register get');
        res.render('register/register');
    });

    app.post('/register', function (req, res) {
        logger.printv('register post');


        with (req.body) {
            function render_info(message, type, req) {
                with (req.body) {
                    res.render('register/register', {message: message, nick: nick, email: email, password: password, c_password: c_password, type: type});
                }
            }

            var message = undefined;
            var type = REGISTER_PASSWORD;

            if (!string_utils.isEmail(email)) {
                message = '邮箱格式不正确';
                type = REGISTER_EMAIL;
            } else if (nick.length < 1) {
                message = '昵称不能为空';
                type = REGISTER_NICK;
            } else if (nick.length > 16) {
                message = '昵称不能多于16个字符';
                type = REGISTER_NICK;
            } else if (password.length < 6) {
                message = '密码长度不能少于6';
            } else if (password.length > 24) {
                message = '密码长度不能多于24';
            } else if (password != c_password) {
                message = '密码不匹配';
            } else {
                user_service.register(email, nick, password, function (code, user) {
                    if (code == 0) {
                        req.session.user = {userId: user.uid, nickName: nick};
                        req.session.user_id = user.uid;
                        res.redirect('/');
                    } else if (code == ERROR_EMAIL_EXIST) {
                        message = '邮箱已经注册了，请选择其他邮箱';
                        render_info(message, type, req);
                    } else {
                        message = '注册失败，请重试';
                        render_info(message, type, req);
                    }
                    logger.printv('message = ' + message);
                });
                return;
            }
            logger.printv('message = ' + message);
            render_info(message, type, req);

        }

    });

    app.get('/a/follow/:tid', function (req, res) {
        if (req.session.user) {
            var tid = req.params.tid;
            var uid = req.session.user_id;
            user_service.follow(uid, tid, function (code) {
                res.send({code: code});
            });
        } else {
            res.send({code: USER_UNLOGIN});
        }
    });

    app.get('/a/unfollow/:tid', function (req, res) {
        if (req.session.user) {
            var uid = req.session.user_id;
            var tid = req.params.tid;
            user_service.unfollow(uid, tid, function (code) {
                res.send({code: code});
            });
        } else {
            res.send({code: USER_UNLOGIN});
        }
    });

    var user_info = function (session) {
        if (session.user) {
            var s_user = session.user;
            return {uid: session.user_id, nn: s_user.nickName, av: s_user.avatar, ge: s_user.gender};
        }
        return {};
    }


    //http://www.xiaoji.fm/a/4f960e3a260967aa715a5c92/opus/51697d1ae4b076044efb1e20/0/flower

    app.get('/a/:tid/opus/:opus_id/:cate/flower', function (req, res) {

        if (req.session.user) {
            var opid = req.params.opus_id;

            if (!feed_service.check_statistic(req.session, opid, 'flower_count', OPUS_FLOWER_LIMIT)) {
                res.send({code: OUT_OF_FLOWER_COUNT});
                return;
            }
            var user = user_info(req.session);
            var opus = {opid: opid, opc: req.params.tid, cate: req.params.cate};
            feed_service.increase_statistic(req.session, opid, 'flower_count', 1);
            feed_service.send_flower(user, opus, DRAW_APP, function (code) {
                logger.printv('send flower, code = ' + code);
                res.send({code: code});
                if (code != 0) {
                    feed_service.increase_statistic(req.session, opid, 'flower_count', -1);
                }
            });
        } else {
            res.send({code: USER_UNLOGIN});
        }
    });


    //http://www.xiaoji.fm/a/4fc3089a26099b2ca8c7a4ab/opus/52d0f0b50364da655e820104/0/comment

    //comment.
    app.post('/a/:tid/opus/:opus_id/:cate/comment', function (req, res) {
        if (req.session.user) {
            var opus = {opid: req.params.opus_id, opc: req.params.tid, cate: req.params.cate};
            var source = {
                cmid: req.body.source_id,
                cmsm: req.body.source_summary,
                cmuid: req.body.source_uid,
                cmnn: req.body.source_nick,
                cmt: req.body.source_type
            };
            var text = {comc: req.body.content};

            var user = user_info(req.session);

            feed_service.comment(user, opus, source, text, DRAW_APP, function (code) {
                res.send({code: code});
            });
        } else {
            res.send({code: USER_UNLOGIN});
        }
    });

    app.get('/contact_us', function (req, res) {
        res.render('bottom_link/contact_us', { login_user: req.session.user});
    });

    app.get('/introduction', function (req, res) {
        res.render('bottom_link/introduction', { login_user: req.session.user});
    });

//   http://www.xiaoji.fm/a/opus/5268e5ede4b04ccc882857b9/favored

    app.get('/a/opus/:opus_id/favored', function (req, res) {
            if (req.session.user) {
                var opid = req.params.opus_id;
                if (!feed_service.check_statistic(req.session, opid, 'favor_count', OPUS_FAVOR_LIMIT)) {
                    res.send({code: 1});
                } else {
                    res.send({code: 0});
                }
            }
        }
    );

//   http://www.xiaoji.fm/a/opus/5268e5ede4b04ccc882857b9/overFlower

    app.get('/a/opus/:opus_id/overFlower', function (req, res) {
            if (req.session.user) {
                var opid = req.params.opus_id;
                if (!feed_service.check_statistic(req.session, opid, 'flower_count', OPUS_FLOWER_LIMIT)) {
                    res.send({code: 1});
                } else {
                    res.send({code: 0});
                }
            }
        }
    );

//   http://www.xiaoji.fm/a/opus/0/5268e5ede4b04ccc882857b9/favor
    app.get('/a/opus/:cate/:opus_id/favor', function (req, res) {


        if (req.session.user) {
            var opid = req.params.opus_id;
            if (!feed_service.check_statistic(req.session, opid, 'favor_count', OPUS_FAVOR_LIMIT)) {
                res.send({code: OUT_OF_FAVOR_COUNT});
                return;
            }
            var cate = req.params.cate;
            var user = user_info(req.session);
            var opus = {opid: opid, cate: cate, opc: 'no empty'};
            feed_service.increase_statistic(req.session, opid, 'favor_count', 1);
            feed_service.favor(user, opus, DRAW_APP, function (code) {
                logger.printv('favor error = ' + code);
                if (code != 0) {
                    feed_service.increase_statistic(req.session, opid, 'favor_count', -1);
                }
                res.send({code: code});
            })
        } else {
            res.send({code: USER_UNLOGIN});
        }
    });


    app.get('/a/user/update', function (req, res) {
        if (req.session.user) {
            var uid = req.session.user.userId;
            var nick = req.query.nickName;
            var signature = req.query.signature;
            var gender = req.query.gender;

            var user = req.session.user;
            nick = nick ? nick : user.nickName;

            if (gender == 'm') {
                gender = true;
            } else if (gender == 'f') {
                gender = false;
            } else {
                gender = !!user.gender;
            }

            user_service.update_user(uid, nick, signature, gender, function (code) {
                if (code == 0) {

                    //TODO update req.session.user
                    req.session.user.nickName = nick;
                    req.session.user.gender = gender;
                    if (signature) {
                        req.session.user.signature = signature;
                    }
                    var user = req.session.user;
                }
                res.send({code: code});
            });
        } else {
            res.send({code: USER_UNLOGIN});
        }

    });

    app.post('/a/avatar', function (req, res) {
        logger.printv('update avatar');
        if (req.session.user) {
            var avatar = req.files.displayImage;
            if (avatar) {
                var req_json = {
                    m: 'uploadUserImage',
                    av: 1,
                    bg: 0,
                    uid: req.session.user.userId
                }
                req_json = obj_utils.extend(req_json, DRAW_APP);
                user_service.update_avatar(req_json, avatar.path, function (code, url) {
                    logger.printv('result: code = ' + code + ', url = ' + url);
                    if (code == 0 && url != null) {
                        req.session.user.avatar = url;
                    }
                    res.send({code: code, url: url});
                });
            }else{
                res.send({code:999});
            }
        } else {
            res.send({code: USER_UNLOGIN});
        }
    });
}
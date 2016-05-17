/**
 * User bulletin services
 *
 * Location: EXPRESS_BASE/routes/user/bulletin.js
 */

var traffic_api_server_request = require('../../xiaoji_common/network/traffic_api_server_request'); 
var logger = require('../../node_common/utils/print_utils');
var url = require('url');
var app_manager = require('../../xiaoji_common/model/app_manager');
var Dbclient = require('../../xiaoji_common/model/mongodb/dbclient');
var dbclient = new Dbclient();

var ADMIN_UID = require('../../settings').ADMIN_UID; 


exports.postBulletin = function(req, res){

        if (!req.session.user) {
            logger.printv('Not logged in yet.');
            req.flash('error', '请先登录');
	    req.session.last_page = 'postBulletin';
            res.redirect('/login');
        }
        res.render('user/post_bulletin', { login_user: req.session.user});
};


exports.doPostBulletin = function(req, res) {

	var game_id = req.body.game_id;
	if (!game_id) {
	    logger.printv('No game ID chosen !');
	    req.flash('error', '请选择要发送公告到哪个应用.');
	    res.redirect('/postBulletin');
	    return;
	}

	var type_str = req.body.type; // jumpable or not jumpable ?
	var type;
	if (!type_str) {
	    logger.printv('No jump type !');
	    req.flash('error', '请选择公告类型!');
	    res.redirect('/postBulletin');
	    return;
	}
	switch(type_str) {
	    case '游戏内跳转':
		type = 1;
		break;
	    default:
		type = 0;
	}
	logger.dbg_print('req.type = ' + req.body.type + ', type = ' + type);

	var func_str = req.body.functionality; // jump target.
	var func;
	if (type == 1) {
	    if (!func_str) {
	        logger.printv('No jump target !');
	        req.flash('error', '请选择跳转目标!');
	        res.redirect('/postBulletin');
	        return;
	    }
	    switch(func_str) {
                case '商店':
                    func = 'shop';
		    break;
                case '比赛':
                    func = 'contest';
		    break;
                case '画榜':
                    func = 'top';
		    break;
                case '动态':
                    func = 'feed';
		    break;
                case '免费金币':
                    func = 'free_coins';
		    break;
                case '免费元宝':
                    func = 'free_ingot';
		    break;
                case '论坛免费元宝答疑':
                    func = 'bbs_free_ingot';
		    break;
                case '论坛免费问题反馈':
                    func = 'bbs_feedback';
		    break;
                case '论坛免费元宝bug报告':
                    func = 'bbs_bug_report';
		    break;
	    }
	}

        var content = req.body.content; // bulletin content.
	if (!content) {
	    logger.printv('No content !');
	    req.flash('error', '公告内容不能为空!');
	    res.redirect('/postBulletin');
	    return;
	}

	logger.printv('game_id: ' + game_id + ', type = ' + type_str + ', function = ' + func + ', content = ' + content);

        var bulletin_doc;
	if (type == 1) {
            bulletin_doc = {
		date       : new Date(),
		game_id    : game_id,
		type       : type,
		function   : func,
                content    : content,
	    }
	} else {
            bulletin_doc = {
		date       : new Date(),
		game_id    : game_id,
		type       : type,
                content    : content,
	    }
        }

        var post_result;	
	dbclient.insert('bulletin', bulletin_doc, function(result, info) {
	    if (result != 'success') {
		logger.printv(err_info);
		post_result = '发送公告失败! 原因: ' + info;
	    } else {
		post_result = '发送公告成功! 公告ID: ' + info;
	    }

	    res.render('user/post_bulletin_result',  
	           { login_user     : req.session.user, 
	             post_result : post_result 
		   }
            );
        });
};


exports.getBulletins = function(req, res){

        if (!req.session.user) {
            logger.printv('Not logged in yet.');
            req.flash('error', '请先登录');
	    req.session.last_page = 'getBulletins';
            res.redirect('/login');
        }
        res.render('user/get_bulletins', { login_user: req.session.user});
};


exports.doGetBulletins = function(req, res) {

    var game_id = req.body.game_id;
    if (!game_id) {
        logger.printv('No game ID chosen !');
        req.flash('error', '请选择要查看哪个应用的公告.');
        res.redirect('/getBulletins');
        return;
    }
    
    var app_id = app_manager.app2id(game_id);

    var bulletin_json = {
        m    :  'gblt',
	gid  :  game_id,
	app  :  app_id,
	uid  :  ADMIN_UID,
	lbid :  '',
	ts   :  '1369818946',
	mac  :  'nKL3QW%2FpjQ%2B4ClWJlJ0%2Fsw%3D%3D',
    }

    var bulletins = new Array();
    traffic_api_server_request.send(bulletin_json,  
        function(request_url, statusCode, result)
	{
            var query = url.parse(request_url,true).query;
	    logger.printv('query: ' + query + ', onResult: (' + statusCode + ')' 
	 			+ JSON.stringify(result));

	    if (!result || result.ret != 0 || typeof result.dat == 'undefined') {
	        res.render('user/get_bulletins_result', 
		    { login_user  :  req.session.user, 
		      bulletins   :  bulletins, 
		    }
		);
            } else {
		for (var i = 0; i < result.dat.length; i++) {
                    var cd = result.dat[i].cd;
		    var create_date = cd.substring(0, 4) + '-' + cd.substring(4,6) + '-' + cd.substring(6,8);
		    var content = result.dat[i].content;
		    logger.dbg_print('create_date : ' + create_date + ', content : ' + content);
		    bulletins.push({create_date : create_date, content: content});
                }
	        res.render('user/get_bulletins_result', 
		    { login_user  :  req.session.user, 
		      bulletins   :  bulletins, 
		    }
		);
           }
        }
    );

}

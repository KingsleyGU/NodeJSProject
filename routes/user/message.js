/**
 * User message services
 *
 * Location: EXPRESS_BASE/routes/user/message.js
 */


var traffic_api_server_request = require('../../xiaoji_common/network/traffic_api_server_request'); 
var logger = require('../../node_common/utils/print_utils');
var user_manager = require('../../xiaoji_common/model/user/user_manager');
var url = require('url');
var app_manager = require('../../xiaoji_common/model/app_manager');
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();

var ADMIN_UID = require('../../settings').ADMIN_UID; 



exports.sendMessage = function(req, res){

        if (!req.session.user) {
            logger.printv('Not logged in yet.');
            req.flash('error', '请先登录');
	    req.session.last_page = 'sendMessage';
            res.redirect('/login');
        }

	var query = url.parse(req.url,true).query;
	if (query.uid) {
	    res.render('user/send_message', 
	         {  login_user : req.session.user,
		    uid        : query.uid,
		 }
            );
	    return;
        }

	res.render('user/send_message', 
	     {  login_user : req.session.user,
	        uid        : null,
	     }
        );
};


exports.doSendMessage = function(req, res) {

	var send_to = req.body.send_to;
	if (!send_to) {
	    logger.printv('No receiver !');
	    req.flash('error', '请输入接收者的UserID或用户名.');
	    res.redirect('/sendMessage');
	    return;
	}
	if (!user_manager.valid_userid(send_to)) {
	    logger.printv('Not valid user !');
	    req.flash('error', '请检查你所填的用户名的正确性.');
	    res.redirect('/sendMessage');
	    return;
	}

	var app_id = app_manager.app2id(req.body.app);
	if (!app_id) {
	    logger.printv('No app chosen !');
	    req.flash('error', '请选择要发送信息到哪个应用.');
	    res.redirect('/sendMessage');
	    return;
	}

	if (!req.body.message) {
	    logger.printv('No message !');
	    req.flash('error', '信息内容不能为空!');
	    res.redirect('/sendMessage');
	    return;
	}
	var message = req.body.message;

	logger.printv('send to: ' + send_to + ', app = ' + req.body.app + ', message = ' + message);

	var msg_json = {
		m    : 'sm', 
	        app  : app_id,
	        uid  : ADMIN_UID,  
	        tuid : send_to, 
		t    : message,
		v    : 1,
		tp   : 0,
	        ts   : '1369378884',
	        mac  : 'yeDXLL1D48big2Qe3nqatQ%3D%3D'
         };

	 traffic_api_server_request.send(msg_json,  
	     function(request_url, statusCode, result)
	     {
	 	 var query = url.parse(request_url,true).query;
	         logger.printv('query: ' + query + ', onResult: (' + statusCode + ')' 
	 			+ JSON.stringify(result));

	         if (!result || result.ret != 0 
			     || typeof result.dat == 'undefined' 
	                     || typeof result.dat.mid == 'undefined'
			     || typeof result.dat.cd == 'undefined') 
	         {	
	             res.render('user/send_message_result', 
		         { login_user     : req.session.user, 
		           sending_result : '发送消息失败! 返回码: ' + (!result ? '服务不可用' : result.ret),
		         }
		     );
		     return;
		 } else {
	             res.render('user/send_message_result', 
		         { login_user     : req.session.user, 
		           sending_result : '发送消息成功!',
		         }
		     );
		     return;
		 }
             }
          );
}

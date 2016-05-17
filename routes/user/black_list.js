/**
 * User message services
 *
 * Location: EXPRESS_BASE/routes/user/black_list.js
 */


var api_server_request = require('../../xiaoji_common/network/api_server_request'); 
var logger = require('../../node_common/utils/print_utils');
var user_manager = require('../../xiaoji_common/model/user/user_manager');
var app_manager = require('../../xiaoji_common/model/app_manager');
var url = require('url');

var ADMIN_UID = require('../../settings').ADMIN_UID; 



exports.blacklist = function(req, res){

        if (!req.session.user) {
            logger.printv('Not logged in yet.');
            req.flash('error', '请先登录');
	    req.session.last_page = 'blacklist';
            res.redirect('/login');
        }

	var query = url.parse(req.url,true).query;
	if (query.uid) {
	    res.render('user/black_list', 
	         {  login_user : req.session.user,
		    dying_guy  : query.uid,
		 }
            );
	    return;
        }

	res.render('user/black_list', 
	     {  login_user : req.session.user,
		dying_guy  : null
	     }
        );
};


exports.blacklistOp = function(req, res) {

	var app_id = app_manager.app2id(req.body.app);
	if (!app_id) {
	    logger.printv('No app chosen !');
	    req.flash('error', '请选择要在哪个应用中加用户黑名单.');
	    res.redirect('/blacklist');
	    return;
	}

	var action_str = req.body.action;
	var action = action_str == '添加' ? 0 : 1;
	if (!action_str) {
	     logger.printv('No action  chosen !');
	     req.flash('error', '请选择要添加黑名单或解除黑名单.');
	     res.redirect('/blacklist');
	     return;
	}

	var type_str = req.body.type;
	var type = type_str == '用户' ? 0 : 1;
        if (!type_str) {
	    logger.printv('No type chosen !');
	    req.flash('error', '请选择要用户或设备.');
	    res.redirect('/blacklist');
	    return;
	}

	var dying_guy = req.body.dying_guy;
	if (!dying_guy) {
	    logger.printv('No one to be added to blacklist !');
	    req.flash('error', '请输入欲添加/解除黑名单的UID.');
	    res.redirect('/blacklist');
	    return;
	}
	if (!user_manager.valid_userid(dying_guy)) {
	    logger.printv('Not valid user ID !');
	    req.flash('error', '请输入合法的UID.');
	    res.redirect('/blacklist');
	    return;
	}

        logger.printv('app = ' + req.body.app + ', action = ' + action_str + ', type = ' + type_str + ', dying_guy = ' + dying_guy);

	var bl_json = {
		m    : 'blu', 
	        app  : app_id,
	        uid  : ADMIN_UID,  
	        tid  : dying_guy, 
		did  : '',
		act  : action,
		tp   : type,
	        ts   : '1369378884',
	        mac  : 'yeDXLL1D48big2Qe3nqatQ%3D%3D'
         };

	 api_server_request.send(bl_json,  
	     function(request_url, statusCode, result)
	     {
	 	 var query = url.parse(request_url,true).query;
	         logger.printv('query: ' + query + ', onResult: (' + statusCode + ')' 
	 			+ JSON.stringify(result));

		 var msg = action_str + type_str;
	         if (!result || result.ret != 0)
	         {
	             res.render('user/black_list_result', 
		         { login_user     : req.session.user, 
		           blacklist_result : msg + '黑名单失败!(返回码: ' + (result == null ? '服务不可用' : result.ret) + ')',
		         }
		     );
		     return;
		 } else {
	             res.render('user/black_list_result', 
		         { login_user     : req.session.user, 
		           blacklist_result : msg + '黑名单成功!',
		         }
		     );
		     return;
		 }
             }
          );
}

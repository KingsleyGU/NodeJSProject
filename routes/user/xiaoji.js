/**
 * Xiaojiservices.
 *
 * Location : EXPRESS_BASE/routes/user/xiaoji.js
 */


var api_server_request = require('../../xiaoji_common/network/api_server_request'); 
var logger = require('../../node_common/utils/print_utils');
var url = require('url');

exports.setXiaoji = function(req, res){

    if (!req.session.user) {
        logger.printv('Not logged in yet.');
        req.flash('error', '请先登录');
    req.session.last_page = 'sendMessage';
        res.redirect('/login');
    }

    var query = url.parse(req.url,true).query;
    if (query.uid) {
    	res.render('user/set_xiaoji', 
    			{  login_user : req.session.user,
    				uid        : query.uid,
    				nickname   : query.nickname,
    			}
        		);
    	return;
    }

    res.render('user/set_xiaoji', 
	     {  login_user : req.session.user,
	        uid        : null,
			nickname   : null,
	     }
    );
};

exports.resetPassword = function(req, res){

    if (!req.session.user) {
        logger.printv('Not logged in yet.');
        req.flash('error', '请先登录');
        req.session.last_page = 'sendMessage';
        res.redirect('/login');
    }

    var query = url.parse(req.url,true).query;
    if (query.uid) {
    	res.render('user/reset_password', 
    			{  login_user : req.session.user,
    				uid        : query.uid,
    				nickname   : query.nickname,
    			}
        		);
    	return;
    }

    res.render('user/reset_password', 
	     {  login_user : req.session.user,
	        uid        : null,
			nickname   : null,
	     }
    );
};

exports.doSetUserXiaoji = function(req, res) {
    
    // Since our homepage exposes the search form, 
    // we should check here
    if (!req.session.user) {
        logger.printv('Not logged in yet.');
//        req.flash('error', '请先登录');
        res.redirect('/login');
    }

    var xiaoji = req.body.xiaoji;
    var targetUserId = req.body.uid;
    var nickname = req.body.nickname;
    
    logger.printv('doSetUserXiaoji, req.body = ' + req.body);
    
    var req_json = {   
    	      m  : 'setUserNumber', 
             app : '513819630',
    	     gid : 'Draw',
    	     uid : targetUserId,
    	     xn  : xiaoji
    };
    
    if (xiaoji == null || targetUserId == null){
    	req.flash('error', '用户或者小吉号码不能为空');
	    res.redirect('/set_xiaoji');    	
        return;
    }
    	
    api_server_request.send(req_json, 
        function(request_url, statusCode, result)
        {
            var query = url.parse(request_url,true).query;
            logger.printv('doSetUserXiaoji, query: ' + query + ', onResult: (' + statusCode + ')' 
    		+ JSON.stringify(result));

            var resultText = "";
            if (result && result.ret == 0) {
            	resultText = "设置小吉号码成功！";
                res.render('user/set_xiaoji_result', 
                	{ 	
                		login_user     : req.session.user, 
               			result		   : 0,
               			xiaoji : xiaoji,
                		uid : targetUserId,
                		nickname : nickname,
                		sending_result : resultText
                	});
    	    } else{
            	resultText = "设置小吉号码失败，错误码是"+result.ret;
               	var user_list = result.dat.users;		
               	res.render('user/set_xiaoji_result', 
               		{
               			login_user     : req.session.user,
               			result		   : result.ret,
                		sending_result : resultText
               		});
            }
        }
    );
};

exports.doResetPassword = function(req, res) {
    
    // Since our homepage exposes the search form, 
    // we should check here
    if (!req.session.user) {
        logger.printv('Not logged in yet.');
//        req.flash('error', '请先登录');
        res.redirect('/login');
    }

    var password = req.body.password;
    var targetUserId = req.body.uid;
    var nickname = req.body.nickname;
    
    logger.printv('doResetPassword, req.body = ' + req.body);
    
    var req_json = {   
    	      m  : 'resetPassword', 
             app : '513819630',
    	     gid : 'Draw',
    	     uid : targetUserId,
    	     pwd : password
    };
    
    if (password == null || targetUserId == null){
    	req.flash('error', '用户或者密码不能为空');
	    res.redirect('/set_xiaoji');    	
        return;
    }
    	
    api_server_request.send(req_json, 
        function(request_url, statusCode, result)
        {
            var query = url.parse(request_url,true).query;
            logger.printv('doSetUserXiaoji, query: ' + query + ', onResult: (' + statusCode + ')' 
    		+ JSON.stringify(result));

            var resultText = "";
            if (result && result.ret == 0) {
            	resultText = "设置小吉号码成功！";
                res.render('user/set_xiaoji_result', 
                	{ 	
                		login_user     : req.session.user, 
               			result		   : 0,
               			xiaoji : xiaoji,
                		uid : targetUserId,
                		nickname : nickname,
                		sending_result : resultText
                	});
    	    } else{
            	resultText = "设置小吉号码失败，错误码是"+result.ret;
               	var user_list = result.dat.users;		
               	res.render('user/set_xiaoji_result', 
               		{
               			login_user     : req.session.user,
               			result		   : result.ret,
                		sending_result : resultText
               		});
            }
        }
    );
};

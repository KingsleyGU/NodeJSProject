/**
 * admin manager
 *
 * Location: EXPRESS_BASE/xiaoji_common/model/admin/admin_manager.js
 */

var logger = require('../../../node_common/utils/print_utils');

var user_service = require('../../service/user_service');


exports.authenticate_admin = function(account, password, callback) {

// var user_service = require('../../xiaoji_common/service/user_service');
    console.info("authenticate_admin start to login");
    var email = account;
    var number = account;
    user_service.login(email, number, function(statusCode, user){
        if (statusCode == 0) {
            //TODO remember the user in session.
            return callback('success','验证成功');
        }else{
            return callback('error','帐号和密码错误');
        }
    });

    return;

    // For now, we just have a hard-coded admin.
    if (account != 'gckjdev') {
	logger.printv('Not admin account: ' + account);
	return callback('error', '非管理员用户');
    }
    if (password != 'gckj123') {
	logger.printv('Wrong password !');
	return callback('error', '口令错误');
    }

    return callback('success','验证成功');
};
	

/**
 * Administrator logging in services
 *
 * Location: EXPRESS_BASE/routes/admin/login.js
 */


var logger = require('../../node_common/utils/print_utils');
var admin_manager = require('../../xiaoji_common/model/admin/admin_manager');
var security = require('../../node_common/utils/security_utils');



// Get the login page
exports.login = function(req, res) {
    res.render('admin/admin_login', {login_user: req.session.user});
};


// Do the dirty job for login 
exports.doLogin = function(req, res) {

    // Check if we have already logged on.
    if (req.session.user) {
        logger.print_on_debug('Already logged on, need not auth !');
		return;
    }

    var account = req.body.account;
    var password = req.body.password;
    var remember_me = req.body.remember_me;

    logger.printv('Authentication! account = ' + account + 
		 ', password = ' + password + ', remember_me = ' + remember_me);

    /**
     * If we haven't logged on, we will be redicted to here.
     * Check if we have saved logging cookie. If it is the case, 
     * and we meant to login in as this saved user,  then use it.
     */
    var cookie = req.cookies[security.cookie_name];
    if (cookie) {
        var user = security.extract_cookie(cookie);
		if (account == user.user_name) {
            account = user.user_name;
            password = user.password;
            logger.printv('Use cooke! account = ' + account + ', password = ' + password);
		}
    }

    // Do the dirty job.
    admin_manager.authenticate_admin(account, password, function(result, cause) {
	    if (result == 'error') {
		req.flash('error', cause);
	        logger.printv('Authentication for ' + account +' failed!');
		return res.redirect('/login');
	    }
	    req.session.user = account;
	    if (!cookie && remember_me) {
		security.generate_cookie(account, password, res);
	        logger.printv('Generating cookie !');
	    }
                
	    req.flash('success', '登入成功');
	    logger.printv('Authentication for ' + account +' success!');
	    
	    if (req.session.last_page == 'charge') {
	        req.session.last_page = null;
                res.redirect('/charge');
		return;
	    }
	    else if (req.session.last_page == 'sendMessage') {
	        req.session.last_page = null;
                res.redirect('/sendMessage');
		return;
	    }
	    else if (req.session.last_page == 'blacklist') {
	        req.session.last_page = null;
                res.redirect('/blacklist');
		return;
	    }
	    else if (req.session.last_page == 'postBulletin') {
	        req.session.last_page = null;
                res.redirect('/postBulletin');
		return;
	    }
	    else if (req.session.last_page == 'getBulletins') {
	        req.session.last_page = null;
                res.redirect('/getBulletins');
		return;
	    }
            res.redirect('/');
    });
};

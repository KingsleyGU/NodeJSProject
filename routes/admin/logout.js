/*
 * Administrator logging off service
 *
 * Location: EXPRESS_BASE/routes/admin/logout.js
 */

var logger = require('../../node_common/utils/print_utils');

exports.logout = function(req, res) {
    logger.printv('Adminitrator \'' + req.session.user + '\' logs off !'); 
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
}

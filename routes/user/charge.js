/**
 * User charging services
 *
 * Location: EXPRESS_BASE/routes/user/charge.js
 */


var api_server_request = require('../../xiaoji_common/network/api_server_request'); 
var logger = require('../../node_common/utils/print_utils');
var uid_checker = require('../../xiaoji_common/model/user/user_manager');
var EventEmitter = require('events').EventEmitter;
var coin_event = new EventEmitter();
var ingot_event = new EventEmitter();
var url = require('url');

var ADMIN_UID = require('../../settings').ADMIN_UID; 



exports.charge = function(req, res){

	if (!req.session.user) {
	    logger.printv('Not logged in yet.');
	    req.flash('error', '请先登录');
	    req.session.last_page = 'charge';
	    res.redirect('/login');
	}

	var query = url.parse(req.url,true).query;
	if (query.uid) {
	    res.render('user/charge_user', 
	         {  login_user : req.session.user,
		    uid        : query.uid,
		    type       : query.type
		 }
            );
	    return;
        }

	res.render('user/charge_user', 
	     {  login_user : req.session.user,
	        uid        : null,
	        type       : null
	     }
        );
};

exports.doCharge = function(req, res) {

	if (!req.body.uids) {
	    logger.printv('<doCharge> No user id!');
	    req.flash('error', '请输入要充值的user ID .');
	    res.redirect('/charge');
	    return;
	}
	var uid_array = req.body.uids.split('\r\n'); // HTTP uses CarrigeReturn(\r) + LineFeed(\n) for a new line.

	if (!req.body.coin && !req.body.ingot) {
	    logger.printv('<doCharge> Not choosing coin nor ingot to charge!');
	    req.flash('error', '请选择要充值的类型.');
	    res.redirect('/charge');
	    return;
	}
	var charge_coin = req.body.coin == 1 ? true: false;
	var charge_ingot = req.body.ingot == 2 ? true: false;

        if (!req.body.amount) {	
	    logger.printv('<doCharge> No charge amount!');
	    req.flash('error', '请输入充值数额.');
	    res.redirect('/charge');
	    return;
	}
	var amount = parseInt(req.body.amount);
	if (isNaN(amount)) {
	    logger.printv('<doCharge> No charge amount!');
	    req.flash('error', '请输入有效的充值数额.');
	    res.redirect('/charge');
	    return;
	}
	var amount = parseInt(req.body.amount);

	logger.printv('uids to charge: ' + uid_array);
	logger.printv('coin = ' + charge_coin + ', charge_ingot = ' + charge_ingot +
	            ', amount = ' + amount);


	// Ok, everything is ready, just do the dirty job.
	var bad_uids = new Array();
	var charge_coin_result = new Array();
	var charge_ingot_result = new Array();
	var charge_coin_done = false;
	var charge_ingot_done = false;

        // Listen on two events: 'charge_coin_done' and c'harge_ingot_done'.
	// We must wait for both events happening , then to render the results.
        coin_event.once('charge_coin_done', function() {
             logger.dbg_print('charge_coin_done event received.');
	     if (charge_ingot_done) {
	        res.render('user/charge_user_result', 
		    { login_user     : req.session.user, 
		      bad_uids       : bad_uids,
	              charge_result  : charge_coin_result,
		    }
		);
	        return;
	     }	  
	});

	ingot_event.once('charge_ingot_done', function() {
             logger.dbg_print('charge_ingot_done event received.');
	     if (charge_coin_done) {
	        res.render('user/charge_user_result', 
		    { login_user     : req.session.user, 
		      bad_uids       : bad_uids,
	              charge_result  : charge_ingot_result,
		    }
		);
	        return;
	     }	  
	});

	// do the actual job.
	for (var i = 0; i < uid_array.length; i++) {
	    if (!uid_checker.valid_userid(uid_array[i])) {
		bad_uids.push({uid: uid_array[i], cause: '无效的UID'});
                logger.printv('Found an invalid user ID : ' + uid_array[i]);
		if (bad_uids.length == uid_array.length) {
	            charge_coin_done = true;
	            coin_event.emit('charge_coin_done');
                    charge_ingot_done = true;
                    ingot_event.emit('charge_ingot_done');
		}
		continue;
	    }
           
	    if (charge_coin) {
                var coin_json = {
	            m         : 'ca',
	            sr        : 14,
	            pa        : amount,
	            uid       : uid_array[i],
	            auid      : ADMIN_UID, 
	            app       : '645475970',
	            ts        : '1369378884',
	            mac       : 'Me12Gs4dOr5u4X2iiFCvUQ%3D%3D',
	            alixorder : '',
	            tid       : '',
	            tre       : ''
	        };

	        api_server_request.send(coin_json,  
	            function(request_url, statusCode, result)
	            {
			var query = url.parse(request_url,true).query;
	                logger.printv('query: ' + query + ', onResult: (' + statusCode + ')' 
					+ JSON.stringify(result));

                        if (typeof result.dat == 'undefined' || typeof result.dat.uid == 'undefined' ||
			    typeof result.dat.ab == 'undefined'	|| typeof result.dat.aib == 'undefined') 
			{
		             bad_uids.push({uid: query.uid, cause: '充值失败,返回码: '+ result.ret});
			     if (charge_coin_result.length == uid_array.length - bad_uids.length) {
		                charge_coin_done = true;
			        coin_event.emit('charge_coin_done');
		                logger.dbg_print('emitting charge_coin_done');
			     }
			     return; // finish this callback function
			}

	        	var c_uid = result.dat.uid;
	        	var c_coins = result.dat.ab;
			var c_ingots = result.dat.aib;
	                charge_coin_result.push({uid: c_uid, coins: c_coins, ingots: c_ingots});
			if (charge_coin_result.length == uid_array.length - bad_uids.length) {
		            charge_coin_done = true;
			    coin_event.emit('charge_coin_done');
		            logger.dbg_print('emitting charge_coin_done');
			}
	            }
	        );
            } // end of if(charge_coin)
	    else {
		if (!charge_coin_done) {
		    charge_coin_done = true;
	            coin_event.emit('charge_coin_done');
		    logger.dbg_print('emitting charge_coin_done');
		}
	    }


	    if (charge_ingot) {
                var ingot_json = {
	             m         : 'cia',
	             sr        : 14,
	             pa        : amount,
	             uid       : uid_array[i],
	             auid      : ADMIN_UID, 
	             app       : '645475970',
	             ts        : '1369378884',
	             mac       : 'wDrZixQQw3mRsV%2BVrxSn3g%3D%3D',
	             alixorder : '',
	             tid       : '',
	             tre       : ''
	       };

	        api_server_request.send(ingot_json,  
	            function(request_url, statusCode, result)
	            {
			var query = url.parse(request_url,true).query;
	                logger.printv('query: ' + query + ', onResult: (' + statusCode + ')' 
					+ JSON.stringify(result));
                        
                        if (!result ||
		            typeof result.dat == 'undefined' || typeof result.dat.uid == 'undefined' ||
			    typeof result.dat.ab == 'undefined'	|| typeof result.dat.aib == 'undefined') 
			{
		             bad_uids.push({uid: query.uid, cause: '充值失败,返回码: '
				     + (result == null ? '服务不可用' : result.ret) });
			     if (charge_ingot_result.length == uid_array.length - bad_uids.length) {
		                charge_ingot_done = true;
			        ingot_event.emit('charge_ingot_done');
		                logger.dbg_print('emitting charge_ingot_done');
			     }
			     return; // finish this callback function
			}

	        	var i_uid = result.dat.uid;
	        	var i_coins = result.dat.ab;
			var i_ingots = result.dat.aib;
	                charge_ingot_result.push({uid: i_uid, coins: i_coins, ingots:i_ingots});
			if (charge_ingot_result.length == uid_array.length - bad_uids.length) {
			    charge_ingot_done = true;
			    ingot_event.emit('charge_ingot_done');
		            logger.dbg_print('emitting charge_ingot_done');
			}
	            }
	        );
	    } // end of if(charge_ingot)
	    else {
		if (!charge_ingot_done) {
		    charge_ingot_done = true;
	            ingot_event.emit('charge_ingot_done');
		    logger.dbg_print('emitting charge_ingot_done');
		}
	    }
        } // end of for
};

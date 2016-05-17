/**
 * User searching services.
 *
 * Location : EXPRESS_BASE/routes/user/search.js
 */


var api_server_request = require('../../xiaoji_common/network/api_server_request'); 
var logger = require('../../node_common/utils/print_utils');
var url = require('url');


exports.search = function(req, res) {

    if (!req.session.user) {
        logger.printv('Not logged in yet.');
        req.flash('error', '请先登录');
        res.redirect('/login');
    }
    res.render('index', { login_user: req.session.user});
}


exports.doSearch = function(req, res) {
    
    // Since our homepage exposes the search form, 
    // we should check here
    if (!req.session.user) {
        logger.printv('Not logged in yet.');
        req.flash('error', '请先登录');
        res.redirect('/login');
    }


    var search_keyword = req.body.search_keyword || 'Unknown';
    logger.printv('search_keyword = ' + search_keyword);
    
    var search_json = {   
	      m  : 'su', 
             app : '513819630',
    	     gid : 'Draw',
    	     uid : '4fc3089a26099b2ca8c7a4ab',
    	      ss : search_keyword,
    	      si : 0,
    	      ei : 50						
    };
    	
    api_server_request.send(search_json, 
        function(request_url, statusCode, result)
        {
            var query = url.parse(request_url,true).query;
            logger.printv('query: ' + query + ', onResult: (' + statusCode + ')' 
    		+ JSON.stringify(result));

            if (!result || typeof result.dat == 'undefined' || typeof result.dat.users == 'undefined') {
                res.render('user/search_user_result', 
			{ login_user     : req.session.user, 
		          search_keyword : search_keyword, user_list : null 
			}
		);
    	    } else{
               	var user_list = result.dat.users;		
               	res.render('user/search_user_result', 
		       { login_user     : req.session.user,
			 search_keyword : search_keyword, 
			 user_list      : user_list 
		       }
		);
            }
        }
    );
};

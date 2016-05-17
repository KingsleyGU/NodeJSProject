
var crypto = require('crypto');



/**
 * These two functions are used to encrypt/decrypt
 * the username/password, and then store them as cookie
 * on demand.
 */
function encrypt(str,secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str,'utf8','hex');
    enc += cipher.final('hex');
    return enc;
}

function decrypt(str,secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

var session_secret = 'freaking';
var cookie_name = 'auth_cookie';
exports.cookie_name = cookie_name;
exports.generate_cookie = function(user_name, password, res) {

    var auth_token = encrypt(user_name + '\t' + password, session_secret);
    res.cookie(cookie_name, auth_token, {path: '/',maxAge: 1000*60*60*24*7}); //cookie有效期1周            
}

exports.extract_cookie = function(cookie) {

	if (!cookie || cookie == undefined) 
	    return null;

	var result = {};

	var auth_token = decrypt(cookie, session_secret);
	var auth = auth_token.split('\t');
        result['user_name'] = auth[0];
        result['password'] = auth[1];

        return result;
}	
     

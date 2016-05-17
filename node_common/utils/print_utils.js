
var log4js = require('log4js');

function get_pos() {
    
    var pos;	
    var func;

    try {
	throw new Error();
    } catch(e) {
	// 0: Error 1: at get_pos 2: at printv, so 3 is the function we are interested in.
	// but the function may be a callback function, in which
	// it has no function name(then the line has no '(...)')
	// So we have to check this.
	var i = 3;
	var topic_line = e.stack.split('\n')[i];
	while (true) {
	    if (topic_line.indexOf('(') == -1) {
		topic_line = e.stack.split('\n')[i+1];
		i++;
	    } else {
		break;
	    }
	}

        pos = topic_line.split('(')[1]
		        .split(')')[0]
		        .split(':');

        func = topic_line.replace(/\s+at\s/,'')
		         .split(' ')[0];
    }
    
    return pos[0].replace(/(\/.*\/)/, '') + ':' + pos[1] + ':' + func;
}

exports.printv = function(content) {		
	var logger = log4js.getLogger('XIAOJI');
	logger.info(content);
}

exports.info = function(content) {		
	var logger = log4js.getLogger('XIAOJI');
	logger.info(content);
}

exports.debug = function(content) {	
	var logger = log4js.getLogger('XIAOJI');
	logger.debug(content);
}

exports.warn = function(content) {	
	var logger = log4js.getLogger('XIAOJI');
	logger.warn(content);
}

exports.error = function(content) {	
	var logger = log4js.getLogger('XIAOJI');
	logger.error(content);
}

exports.dbg_print = function(content) {	
	var logger = log4js.getLogger('XIAOJI');
	logger.debug(content);
}



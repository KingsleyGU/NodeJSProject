/**
 * app manager
 *
 * Location: EXPRESS_BASE/xiaoji_common/model/app_manager.js
 */

var logger = require('../../node_common/utils/print_utils');

exports.app2id = function(app) {
    
    logger.dbg_print('app = ' + app);
    if (!app || typeof app != 'string' ) 
        return null;

    switch(app)
    {
        case 'draw':
	case 'Draw':
              return '513819630';
        case 'zjh':
	case 'Zhajinhua':
              return '585525675';
        case 'old-dice':
              return '557072001';
        case 'new-dice':
	case 'Dice':  // old dice has no bulletins.
              return '606131564';
        case 'little-gee':
              return '645475970';
        case 'learn-draw':
	case 'Learndraw':
              return '635820146';
        case 'pure-draw-free':
	case 'Puredrawfree':
              return '639593939';
        case 'pure-draw':
	case 'Puredraw':
              return '639593519';
        case 'photo-draw-free':
	case 'Photodrawfree':
              return '639596045';
        case 'photo-draw':
	case 'Photodraw':
              return '639595333';
        case 'call-track':
	case 'CallTrack':
              return '427457714';
        case 'secure-sms':
	case 'SecureSms':
              return '427737140';
        case 'dream-avatar-free':
	case 'DreamAvatarFree':
              return '645413029';
        case 'dream-avatar':
	case 'DreamAvatar':
              return '648176144';
        case 'dream-lock-screen-free':
	case 'DreamLockscreenFree':
              return '648179189';
        case 'dream-lock-screen':
	case 'DreamLockscreen': 
	      return '645413042';
    }
}



/**
 * 
 */
exports.format = function() {
    if( arguments.length == 0 )
        return null;

    var str = arguments[0]; 
    for(var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

exports.getSubDesc = function(desc, nickName){
    var DESC_DISPLAY_LEN = 35;
    var nick = "";
    var subDesc = "";

    if (nickName != null){
      nick = nickName;
    }

    if (desc != null){
      if ((desc.length+nick.length) <= DESC_DISPLAY_LEN)
        subDesc = desc;
      else
        subDesc = desc.substring(0,DESC_DISPLAY_LEN - (nick.length)).concat("...");
    }
    return subDesc;
};

exports.isEmail = function(str){
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(str);
}
exports.format = function() {
    if( arguments.length == 0 )
        return null;

    var str = arguments[0]; 
    for(var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

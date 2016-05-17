
var moment = require('moment');

/**
 * 
 */
exports.getTimeDisplayString = function(timeInterval) {
    var displayString="";
    var t=Math.round(((new Date).getTime())/1000);
    var interval = t - timeInterval;
   if(interval < 60)
    {
        displayString = interval.toString() + "秒前";
    }
    else if(interval < 3600)
    {
        displayString = Math.floor(interval/60).toString() + "分钟前";
    }
    else if(interval < 3600*24)
    {
        displayString = Math.floor(interval/3600).toString() + "小时前";
    }
    else if(interval < 3600*24*7)
    {
        displayString=Math.floor(interval/(3600*24)).toString() + "天前";
    }
    else{         
        displayString = moment.unix(timeInterval).format("YYYY-MM-DD");
    } 
    return displayString;
}




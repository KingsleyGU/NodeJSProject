exports.feedTimesWithFeedTimesType = function(type, feedTimesList) {


    var value = 0;
    if (feedTimesList == null)
        return 0;

    for (var i = 0; i < feedTimesList.length; i++) {
        // console.log("<getFeedTimes> type="+feedTimesList[i].type+", value="+feedTimesList[i].value);
        //  if (feedTimesList[i] == null)
        //      continue;

        if (feedTimesList[i].type == type) {
            value = feedTimesList[i].value;
            break;
        }
    }

    return value;
}
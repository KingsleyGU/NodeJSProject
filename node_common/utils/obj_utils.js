exports.extend = function (obj1, obj2) {
    var ret = {};
    if (obj1) {
        for (var key in obj1) {
            ret[key] = obj1[key];
        }
    }
    if (obj2) {
        for (var key in obj2) {
            ret[key] = obj2[key];
        }
    }
    return ret;

}


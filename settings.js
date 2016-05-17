/**
 * This is a global config file for this project.
 *
 * Location : EXPRESS_BASE/settings.js
 */


var get_host = function () { 
  if ('debug' == process.argv[2])
      return '127.0.0.1';
  else
      return 'mongodb';
};

var get_port = function() { 
  if ('debug' == process.argv[2])
      return 27017;
  else 
      return 27017;
};

module.exports= {
    // for the mongodb
    db        : 'game',
    host      : get_host(),
    port      : get_port(),
    journal   : true,

    ADMIN_UID : '50d2bb69e4b0d73d234df6af',
};

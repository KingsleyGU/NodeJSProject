/**
 * This module is to export the connection to mongodb,
 * via which we could use to communicate with mongodb.
 *
 * Location: EXPRESS_BASE/xiaoji_common/model/mongodb/db.js
 */

var settings = require('../../../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

console.log('mongodb.host = ' + settings.host);
module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT), {safe: true});

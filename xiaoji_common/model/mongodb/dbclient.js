/**
 * This file contains db operation API's
 *
 * Location: EXPRESS_BASE/xiaoji_common/model/mongodb/dbclient.js
 */

var logger = require('../../../node_common/utils/print_utils');
var mongodb = require('./db');
var settings = require('../../../settings');

module.exports = function() {

    this.insert = function(collection, doc, callback) {

	if (!collection) {
	    logger.printv('No valid collection !');
	    return callback('error', 'No valid collection !');
	}

        mongodb.open(function(err, db) {
            if (err) {
                return callback('error', 'Couldn\'t open db : ' + settings.db + ' !');
            }
	    logger.dbg_print('Successfully open db : ' + settings.db + ' !');

            db.collection(collection, function(err, collec) {
                if (err) {
                   mongodb.close();
                   return callback('error', 'Insertion failure !');
                }

	        logger.dbg_print('Found the collection: ' + collec.collectionName + ' !');
	    
                collec.insert(doc, {safe: true}, function(err, records) { 
                    if (err) {
                       mongodb.close();
                       return callback('error', 'Insertion failure !');
                    }
                    mongodb.close();
                    logger.printv('New doc added as ' + records[0]._id + ' !');
		    return callback('success', records[0]._id);
		});
	    });
	}); // end of mongodb.open
    }
}

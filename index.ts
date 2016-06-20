import knex = require('knex');
import dbSocket = require('./classes/db-socket');
import ActiveRecord = require('./classes/active-record');

export = {
	ActiveRecord: ActiveRecord,
	setConnectionParams: dbSocket.setConnectionParams
}

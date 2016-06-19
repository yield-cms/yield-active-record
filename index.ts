import knex = require('knex');
import dbSocket = require('./classes/db-socket');

export = {
	setConnectionParams: dbSocket.setConnectionParams
}

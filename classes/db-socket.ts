/**
 * @fileoverview Internal module which configurates and creates a
 * singletone connection instance
 * @author Alexander Sychev <shurik.shurik.1993@yandex.ru>
 */
import knex = require('knex');

/**
 * Connection instance
 * @type {knex}
 */
let _instance : knex = null;

/**
 * Connection parameters
 * @type {knex.Config}
 */
let _connectionParams : knex.Config;

/**
 * Set connection params
 * @param {knex.Config} connectionParams
 */
function setConnectionParams(connectionParams : knex.Config) : void {
	_connectionParams = connectionParams;
};

/**
 * Create connection instance if it's not exists and return it
 * @returns {knex}
 */
function getInstance() : knex {
	if (_instance === null) {
		_instance = knex(_connectionParams);
	}
	return _instance;
}

export = {
	setConnectionParams: setConnectionParams,
	getInstance: getInstance
}

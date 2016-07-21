/**
 * @fileoverview Internal module which configurates and creates a
 * singletone connection instance
 * @author Alexander Sychev <shurik.shurik.1993@yandex.ru>
 */
'use strict';

const knex = require('knex');
const ActiveRecordErrors = require('./active-record-errors');

/**
 * Connection instance
 * @type {knex}
 */
let _instance = null;

/**
 * Connection parameters
 * @type {knex.Config}
 */
let _connectionParams = null;

/**
 * Set connection params
 * @param {knex.Config} connectionParams
 */
function setConnectionParams(connectionParams) {
    _connectionParams = connectionParams;
}

/**
 * Create connection instance if it's not exists and return it
 * @returns {knex}
 */
function getInstance() {
    if (_instance === null) {
        if (_connectionParams !== null) {
            _instance = knex(_connectionParams);
        } else {
            throw new Error(ActiveRecordErrors.NO_CONNECTION_PARAMS);
        }

    }
    return _instance;
}

module.exports = {
    setConnectionParams: setConnectionParams,
    getInstance: getInstance
};

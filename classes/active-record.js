"use strict";
const dbSocket = require('./db-socket');

/**
 * Socket instance
 * @type {Knex}
 */
let socketInstance = dbSocket.getInstance();

/**
 * Types of record identifier
 * @enum {Number}
 */
let IdentifierType = {
    COUNTER: 'COUNTER',
    UUID: 'UUID',
    NATURAL: 'NATURAL'
};

/**
 * Types of fields
 * @enum {String}
 */
let FieldType = {
    INTEGER: 'INTEGER',
    DOUBLE: 'DOUBLE',
    STRING: 'STRING',
    TEXT: 'TEXT'
};

/**
 * Active record class wrapper
 * @param {Function} arClass - class to wrap
 * @param {Object} model - model parameters
 */
function ActiveRecord(arClass, model) {

    //INSTANCE METHODS

    /**
     * Save updated object in database
     * @return {Promise}
     */
    arClass.prototype.save = function() {

    };

    /**
     * Delete object from database
     * @return {Promise}
     */
    arClass.prototype.delete = function() {
        socketInstance(arClass.name).delete().where('ID', this.ID);
    };

    //STATIC METHODS

    /**
     * Create new object in database
     * @static
     */
    arClass.create = function(data) {
        return new arClass(data);
    };

    /**
     * Get list of objects by their identifiers
     * @static
     * @param {Array.<Number>|Array.<String>} identifiers
     * @return {Promise}
     */
    arClass.getList = function(identifiers) {
        return new Promise(function (resolve, reject) {
            socketInstance(arClass.name)
                .select().whereIn('ID', identifiers).then(function (response) {
                var result = response.map(function (item) {
                    return new arClass(item);
                });
                resolve(result);
            }, function (error) {
                reject(error);
            });
        });
    };

    /**
     * Get object by its identifier
     * @static
     * @param {Number|String} identifier
     * @return {Promise}
     */
    arClass.getList = function (identifier) {
        return this.getList([identifier]).then(function (response) {
            return Promise.resolve(response[0]);
        });
    };

    /**
     * Syncronize class with database table
     * @return {Promise}
     */
    arClass.syncronize = function () {
        return new Promise(function (resolve, reject) {
            socketInstance.schema.createTableIfNotExists(arClass.name,
                function (tableBuilder) {
                    resolve();
                }
            );
        });
    };

}

module.exports = {ActiveRecord, IdentifierType, FieldType};

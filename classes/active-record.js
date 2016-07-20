/**
 * @fileoverview Active record wrapper function and enums
 * @author Alexander Sychev <shurik.shurik.1993@yandex.ru>
 */

"use strict";
const dbSocket = require('./db-socket');

/**
 * Socket instance
 * @type {Knex}
 */
let socketInstance = dbSocket.getInstance();

/**
 * Types of record identifier
 * @enum {String}
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
    BOOLEAN: 'BOOLEAN',
    FLOAT: 'FLOAT',
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
        return socketInstance(arClass.name).delete().where('ID', this.ID);
    };

    //STATIC METHODS

    /**
     * Create new object in database
     * @static
     * @param {Object} data
     * @return {Promise}
     */
    arClass.create = function(data) {
        return new Promise(function(resolve, reject) {
            socketInstance(arClass.name).insert(data).then(function() {
                return Promise.resolve(new arClass(data));
            });
        });
    };

    /**
     * Get list of objects by their identifiers
     * @static
     * @param {Array.<Number>|Array.<String>} identifiers
     * @return {Promise}
     */
    arClass.getList = function(identifiers) {
        return new Promise(function(resolve, reject) {
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
    arClass.getOnce = function(identifier) {
        return arClass.getList([identifier]).then(function (response) {
            return Promise.resolve(response[0]);
        });
    };

    /**
     * Syncronize class with database table
     * @return {Promise}
     */
    arClass.syncronize = function() {
        socketInstance.schema.createTableIfNotExists(arClass.name,
            function (tableBuilder) {
                switch (model.identifierType) {
                    case IdentifierType.COUNTER: {
                        tableBuilder.bigIncrements('ID');
                        break;
                    }
                    case IdentifierType.UUID: {
                        tableBuilder.uuid('ID');
                        break;
                    }
                    default: {
                        tableBuilder.string('ID', 255).primary();
                    }
                }
            }
        );
        model.fields.forEach(function(field) {
            switch (field.type) {
                case FieldType.INTEGER: {
                    tableBuilder.integer(field.name);
                    break;
                }
                case FieldType.BOOLEAN: {
                    tableBuilder.boolean(field.name);
                    break;
                }
                case FieldType.FLOAT: {
                    tableBuilder.float(field.name);
                    break;
                }
                case FieldType.STRING: {
                    tableBuilder.string(field.name, 255);
                    break;
                }
                default: {
                    tableBuilder.text(field.name);
                }
            }
        });
        return socketInstance.then(Promise.resolve, Promise.reject);
    };

}

module.exports = {ActiveRecord, IdentifierType, FieldType};

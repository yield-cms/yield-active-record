/**
 * @fileoverview Active record wrapper function and enums
 * @author Alexander Sychev <shurik.shurik.1993@yandex.ru>
 */

"use strict";
const dbSocket = require('./db-socket');
const ActiveRecordErrors = require('./active-record-errors');

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
 * Active record class
 * @abstract
 */
class CActiveRecord {
    /**
     * Active record constructor
     * @param {Object} data
     */
    constructor(data) {
        Object.defineProperty(this, 'ID', {
            value: data.ID ? data.ID : null,
            get: () => ID,
            set: () => throw new Error(ActiveRecordErrors.IDENTIFIER_CHANGE);
        });
    }

    save() {
        let socket = dbSocket.getInstance();

        if (this.ID !== null) {
            socket.update()
            //UPDATE operation
        } else {
            socket.insert()
            //INSERT operation
        }
    }

    delete() {
        let socket = dbSocket.getInstance();
        socket.delete().where('ID', this.ID).then(function(response) {
            this = null;
        }.bind(this));
    }
}

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
        return arClass._socketInstance(arClass.name)
            .delete().where('ID', this.ID).then(function(response) {

            });
    };

    //STATIC METHODS AND FIELDS

    /**
     * Database socket static instance
     * @static
     * @private
     */
    arClass._socketInstance = dbSocket.getInstance();

    /**
     * Model static instance
     * @static
     * @private
     */
    arClass._model = model;

    /**
     * Create new object in database
     * @static
     * @param {Object} data
     * @return {Promise}
     */
    arClass.create = function(data) {
        return new Promise(function(resolve, reject) {
            arClass._socketInstance(arClass.name).insert(data).then(function() {
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
            arClass._socketInstance(arClass.name)
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
        let tablePromise = arClass._socketInstance.schema.createTableIfNotExists(
            arClass.name,
            function (table) {
                switch (arClass._model.identifierType) {
                    case IdentifierType.COUNTER: {
                        table.bigIncrements('ID');
                        break;
                    }
                    case IdentifierType.UUID: {
                        table.uuid('ID');
                        break;
                    }
                    default: {
                        table.string('ID', 255).primary();
                    }
                }
                arClass._model.fields.forEach(function(field) {
                    switch (field.type) {
                        case FieldType.INTEGER: {
                            table.integer(field.name);
                            break;
                        }
                        case FieldType.BOOLEAN: {
                            table.boolean(field.name);
                            break;
                        }
                        case FieldType.FLOAT: {
                            table.float(field.name);
                            break;
                        }
                        case FieldType.STRING: {
                            table.string(field.name, 255);
                            break;
                        }
                        default: {
                            table.text(field.name);
                        }
                    }
                });
            }
        );
        return tablePromise;
    };

}

module.exports = {ActiveRecord, IdentifierType, FieldType};

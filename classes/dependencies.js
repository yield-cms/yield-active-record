/**
 * @fileoverview Dependencies of Active Records classes
 * @author Alexander Sychev <shurik.shurik.1993@yandex.ru>
 */
"use strict";

const ActiveRecordErrors = require('./active-record-errors');
const DependencyType = require('./dependency-type');
const IdentifierType = require('./identifier-type');
const dbSocket = require('./db-socket');

/**
 * Dependencies repository - array of all dependencies
 * @type {Array.<Dependency>}
 */
let _dependenciesRepository = [];

/**
 * Dependency duplicate checking function
 * @param {Function} firstClass
 * @param {Function} secondClass
 * @return {Boolean}
 */
function _hasDuplicate = function(firstClass, secondClass) {
    let hasDuplicate = true;

    for(let dependency of _dependenciesRepository) {
        hasDuplicate = (
            (
                _dependenciesRepository[i].firstClass === firstClass &&
                _dependenciesRepository[i].secondClass === secondClass
            ) ||
            (
                _dependenciesRepository[i].secondClass === firstClass &&
                _dependenciesRepository[i].firstClass === secondClass
            )
        );
    }

    return hasDuplicate;
};

/**
 * Dependency class definition
 */
class Dependency {
    /**
     * @param {Function} firstClass
     * @param {Function} secondClass
     * @param {DependencyType} dependencyType
     */
    constructor(firstClass, secondClass, dependencyType) {

        //Properties
        Object.defineProperty(this, 'firstClass', {
            get: firstClass,
            set: () => {
                throw new Error(ActiveRecordErrors.DEPENDENCY_CHANGE);
            }
        });
        Object.defineProperty(this, 'secondClass', {
            get: secondClass,
            set: () => {
                throw new Error(ActiveRecordErrors.DEPENDENCY_CHANGE);
            }
        });
        Object.defineProperty(this, 'dependencyType', {
            get: dependencyType,
            set: () => {
                throw new Error(ActiveRecordErrors.DEPENDENCY_CHANGE);
            }
        });
    }

    /**
     * Synchronize dependency
     * @return {Promise}
     */
    syncronize() {
        let socket = dbSocket.getInstance(),
            tableName = (
                this.firstClass._metaData.tableName +
                this.secondClass._metaData.tableName
            );
        return socket.schema.createTableIfNotExists(
            tableName,
            this._tableBuilder.bind(this)
        );
    }

    /**
     * Table building
     * @private
     * @param {Object} table
     */
    _tableBuilder(table) {
        let firstClassColumn = null,
            secondClassColumn = null;
        firstClassColumn = this._keyColumn(
            table,
            this.firstClass._metaData.tableName,
            this.firstClass._metaData.identifierType
        );
        secondClassColumn = this._keyColumn(
            table,
            this.firstClass._metaData.tableName,
            this.firstClass._metaData.identifierType
        );
        this._indexing(table, firstClassColumn, secondClassColumn);
    }

    /**
     * Key column builder
     * @private
     * @param {Object} tableObject
     * @param {String} tableName
     * @param {IdentifierType} identifierType
     * @return {Object} column object
     */
    _keyColumn(tableObject, tableName, identifierType) {
        let column = null;
        switch (identifierType) {
            case IdentifierType.COUNTER: {
                column = tableObject.bigInteger(tableName + 'ID');
                break;
            }
            case IdentifierType.UUID: {
                column = tableObject.uuid(tableName + 'ID');
                break;
            }
            default: {
                column = tableObject.string(tableName + 'ID', 255);
            }
        }
        return column;
    }

    /**
     * @private
     * @param {Object} tableObject
     * @param {Object} firstClassColumn
     * @param {Object} secondClassColumn
     */
    _indexing(tableObject, firstClassColumn, secondClassColumn) {
        tableObject.primary([firstClassColumn, secondClassColumn]);
        if (this.dependencyType !== DependencyType.MANY_TO_MANY) {
            secondClassColumn.unique();
        }
    }
}

/**
 * Define dependency and push into repository
 * @param {Function} firstClass
 * @param {Function} secondClass
 * @param {DependencyType} dependencyType
 * @return {Dependency}
 */
function define(firstClass, secondClass, dependencyType) {
    //Check for duplicate and throw error if it's exists
    if (_hasDuplicate(firstClass, secondClass)) {
        throw new Error(ActiveRecordErrors.DEPENDENCY_DUPLICATE);
    }

    //Create depdendecy
    let dependency = new Dependency(firstClass, secondClass, dependencyType);

    //Add to dependencies repository
    _dependenciesRepository.push(dependency);

    return dependency;
}

/**
 * Synchronize all dependencies
 * @return {Promise}
 */
function syncronizeAll() {
    let promises = Dependency._repository.map(function(dependency) {
        return dependency.syncronize();
    });

    return Promise.all(promises);
}

//Exporting
module.exports = {syncronizeAll, define};

/**
 * @fileoverview ActiveRecord metadata creator
 * @author Alexander Sychev <shurik.shurik.1993@yandex.ru>
 */
"use strict";

const IdentifierType = require('./identifier-type');
const FieldType = require('./field-type');

/**
 * MetaData - special class to descrive ActiveRecord classes
 */
class MetaData {
    /**
     * @param {Function} arClass - class inherits ActiveRecord
     * @param {String=} tableName - name of database table
     * (equals class name by defaults)
     */
    constructor(arClass, tableName) {
        this.tableName = tableName || arClass.name;
        this.identifierType = IdentifierType.COUNTER;
        this.fields = [];
    }

    setIdentifierType(identifierType) {
        this.identifierType = identifierType
        return this;
    }

    setField(name, type, options) {
        this.fields.push[{name, type, options}];
        return this;
    }
}

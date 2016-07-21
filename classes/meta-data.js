/**
 * @fileoverview ActiveRecord metadata creator
 * @author Alexander Sychev <shurik.shurik.1993@yandex.ru>
 */

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
        this.identifierType = 'COUNTER';
        this.fields = [];
    }

    setIdentifierType(identifierType) {

    }

    setField(name, type, options) {
        this.fields.push[{name, type, options}];
    }
}

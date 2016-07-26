/**
 * @fileoverview Database source interface
 * @author Alexander Sychev <shurik.shurik.1993@yandex.ru>
 */
"use strict";

const Source = require('./source');

/**
 * Data source abstract class
 * @abstract
 */
class Database extends Source {
    constructor(params) {
        super(params);
    }
    getInstance() {
        throw new Error('Abstact method "getConnection" not implemented');
    }
}

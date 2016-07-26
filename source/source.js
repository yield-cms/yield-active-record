/**
 * @fileoverview Abstract data source interface
 * @author Alexander Sychev <shurik.shurik.1993@yandex.ru>
 */
"use strict";

/**
 * Data source abstract class
 * @abstract
 */
class Source {
    constructor(params) {
        Object.defineProperty(this, 'sourceParams', {
            enumerable: false,
            get: () => params,
            set: () => {}
        });
    }
}

module.exports = Source;

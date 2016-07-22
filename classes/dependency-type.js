/**
 * @fileoverview Dependencies types enumeration
 * @author Alexander Sychev <shurik.shurik.1993@yandex.ru>
 */
"use strict";

/**
 * Dependencies types
 * @enum {String}
 */
let DependencyType = {
    ONE_TO_ONE: 'ONE_TO_ONE',
    ONE_TO_MANY: 'ONE_TO_MANY',
    MANY_TO_MANY: 'MANY_TO_MANY'
}

module.exports = DependencyType;

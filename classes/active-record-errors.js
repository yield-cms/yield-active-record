/**
 * @fileoverview Active record module critical errors messages
 * @author Alexander Sychev <shurik.shurik.1993@yandex.ru>
 */

"use strict";

/**
 * Active Record errors
 * @enum {String}
 */
let ActiveRecordErrors = {
    NO_CONNECTION_PARAMS: (
        'ActiveRecord Critical Error #001: ' +
        'Database connection parameters is not defined'
    )
    IDENTIFIER_CHANGE: (
        'ActiveRecord Critical Error #002: ' +
        'Identifier field ("ID") of ActiveRecord cannot be changed'
    )
};

module.exports = ActiveRecordErrors;

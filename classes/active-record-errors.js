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
    ),
    DEPENDENCY_DUPLICATE: (
        'ActiveRecord Critical Error #002: ' +
        'Dependency duplicates'
    ),
    DEPENDENCY_CHANGE: (
        'ActiveRecord Critical Error #002: ' +
        'Dependency cannot by changed'
    ),
    IDENTIFIER_CHANGE: (
        'ActiveRecord Critical Error #003: ' +
        'Identifier field ("ID") of ActiveRecord cannot be changed'
    ),
    METADATA_CHANGE: (
        'ActiveRecord Critical Error #004: ' +
        'Metadata field ("_meta") of ActiveRecord cannot be changed'
    )
};

module.exports = ActiveRecordErrors;

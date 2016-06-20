import dbSocket = require('./db-socket');

let socketInstance = dbSocket.getInstance();

/**
 * Types of record identifier
 * @enum {number}
 */
enum IdentifierType {
	COUNTER, //Auto-increment ("serial") numeric key
	UUID, //UUID string
	NATURAL //"Natural" key (unique name string)
}

/**
 * Simple field types
 * @enum {number}
 */
enum FieldType {
	INTEGER, //Integer number
	DOUBLE, //Double number
	STRING, //String (String)
	TEXT //Text (unlimited string)
}

interface Field {
	fieldName : string,
	identifierType : IdentifierType,
	tableFieldName? : string,
	type: FieldType
}

interface Model {
	tableName : string,
	className : string,
	fields : Field[]
}

/**
 * Special mixin with static method for class which must implement
 * "Active Record" pattern
 */
let ActiveRecordMixin = {
	_model : null,
	model: function(model : Model) {
		if (!model) {
			this._model = model;
		}
		return this._model;
	},
	getOnce: function(identifier : number|string) {
		let AR = this;
		return new Promise(function(resolve, reject) {
			socketInstance(AR._model.tableName || AR._model.className)
				.select().where({ID: identifier}).then(
					function(response) {
						resolve(new AR(response));
					},
					function(error) {
						reject(error);
					}
				);
		});
	},
	getList: function(identifiers : number[]|string[]) {
		let AR = this;
		return new Promise(function(resolve, reject) {
			socketInstance(AR._model.tableName || AR._model.className)
				.select().whereIn('ID', identifiers).then(
					function(response : any[]) {
						var result = response.map(function(item) {
							return new AR(item);
						});
						resolve(new AR(result));
					},
					function(error) {
						reject(error);
					}
				);
		});
	}
}

class ActiveRecord {

	/**
	 * @constructor
	 * @param {Object}
	 */
	constructor(data? : Object) {
		for(let key in data) {
			if (
				data.hasOwnProperty(key) &&
				!(data[key] instanceof Function)
			) {
				this[key] = data[key];
			}
		}
	}

	/**
	 * Add Active Record Mixin methods to class as it's static methods
	 * @static
	 * @param {function} otherClass
	 */
	public static attachAPI(otherClass) {
		Object.assign(otherClass, ActiveRecordMixin);
	}

	/**
	 * Identifier type alias
	 * @static
	 */
	public static IdentifierType = IdentifierType;

	/**
	 * Field type alias
	 * @static
	 */
	public static FieldType = FieldType;
};

export = ActiveRecord;

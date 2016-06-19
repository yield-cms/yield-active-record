import dbSocket = require('./db-socket');

let socketInstance = dbSocket.getInstance();

enum FieldType {
	COUNTER,
	UUID,
	INTEGER,
	DOUBLE,
	STRING,
	TEXT
}

interface Field {
	fieldName : string,
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
	 * Add
	 */
	public static attachAPI(otherClass) {
		Object.assign(otherClass, ActiveRecordMixin);
	}
};

export = ActiveRecord;

import dbSocket = require('./db-socket');

let socketInstance = dbSocket.getInstance();

interface Field {
	fieldName : string,
	tableFieldName? : string,
	type: any
}

interface Model {
	tableName : string,
	className : string,
	fields : Field[]
}

abstract class ActiveRecord {
	private static _model : Model = null;
	public static getOnce(id) {
		socketInstance.select().from(ActiveRecord._model.tableName);
	}
	public static sync() {
		//I've already maded a pull request to add createTableIfNotExists method
		//on DefinitelyTyped/DefinitelyTyped repository
		socketInstance.schema.createTable(ActiveRecord._model.tableName, function() {

		});
	}
};

export = ActiveRecord;

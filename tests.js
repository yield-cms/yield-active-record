'use strict';
const {ActiveRecord, IdentifierType, FieldType, setConnectionParams} = require('./index.js');

setConnectionParams({
    client: 'mysql',
    connection: {
        host     : '127.0.0.1',
        user     : 'root',
        database : 'YieldTest'
    }
})

console.log('define user class syncronize');

class User {
    constructor(data) {
        this.login = data.login;
    }
}

console.log('User as active record');

ActiveRecord(User, {
    identifierType: IdentifierType.COUNTER,
    fields: [
        {type: FieldType.STRING, name: 'login'},
    ]
});

console.log('begin syncronize');

User.syncronize().then(function(response) {
    console.log('SUCCESS');
    console.log(response);
}, function(error) {
    console.log('SUCCESS');
    console.log(error);
});

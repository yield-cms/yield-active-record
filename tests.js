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
    setLogin(login) {
        this.login = login;
    }
    getLogin() {
        return this.login;
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
    User.getOnce(1).then(function(user) {
        console.log('OLD LOGIN: '  + user.getLogin());
    });
}, function(error) {
    console.log('FAIL');
});

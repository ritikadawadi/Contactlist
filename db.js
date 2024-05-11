require('dotenv').config();
const Database = require('dbcmps369');
const hash = require('./serverroutes/bcrypt');

class ContactClass  {
    constructor() {
        this.db = new Database();
    }

    async initialize() {
        await this.db.connect();

        await this.db.schema('Contact', [
            { name: 'id', type: 'INTEGER' },
            { name: 'firstname', type: 'TEXT' },
            { name: 'lastname', type: 'TEXT' },
            { name: 'phone', type: 'TEXT' },
            { name: 'email', type: 'TEXT' },
            { name: 'address', type: 'TEXT'},
            { name: 'Contact_By_Email', type: 'INTEGER' },
            { name: 'Contact_By_Phone', type: 'INTEGER' },
            { name: 'Contact_By_Mail', type: 'INTEGER'},
            { name: 'latitude', type: 'NUMERIC'},
            {name: 'longitude', type: 'NUMERIC'}
        ], 'id');


        await this.db.schema('Users', [
            { name: 'id', type: 'INTEGER' },
            { name: 'firstname', type: 'TEXT' },
            { name: 'lastname', type: 'TEXT' },
            { name: 'username', type: 'TEXT' },
            { name: 'password', type: 'TEXT' }
        ], 'id');
        
        const id = await this.db.read('Users', [{ column: 'username', value: 'cmps369' }]);

        if (id.length <= 0) {
            await this.db.create('Users', [
                { column: 'firstname', value: 'admin' },
                { column: 'lastname', value: 'admin' },
                { column: 'username', value: 'cmps369' },
                { column: 'password', value: hash('rcnj') },
            ])
        }
    }

    async createContact(firstname,lastname,phone,email,address,contact_by_email,contact_by_phone, contact_by_mail, 
        latitude, longitude) {
        const id = await this.db.create('Contact', [
            { column: 'firstname', value: firstname },
            { column: 'lastname', value: lastname },
            { column: 'phone', value: phone },
            { column: 'email', value: email },
            { column: 'address', value: address},
            { column: 'Contact_By_Email', value: contact_by_email },
            { column: 'Contact_By_Phone', value: contact_by_phone },
            { column: 'Contact_By_Mail', value: contact_by_mail},
            { column: 'latitude', value: latitude},
            { column: 'longitude', value: longitude}         
        ]);
        return id;
    }

    async createUser(firstname,lastname,username, password) {
        const id = await this.db.create('Users', [
            { column: 'firstname', value: firstname },
            { column: 'lastname', value: lastname },
            { column: 'username', value: username },
            { column: 'password', value: hash(password)},
        ])
        return id;
    }

    async updateContact(id, firstname,lastname,phone,email,address,contact_by_email,contact_by_phone,
        contact_by_mail,latitude,longitude) {
        await this.db.update('Contact', [
            { column: 'firstname', value: firstname },
            { column: 'lastname', value: lastname },
            { column: 'phone', value: phone },
            { column: 'email', value: email },
            { column: 'address', value: address},
            { column: 'Contact_By_Email', value: contact_by_email },
            { column: 'Contact_By_Phone', value: contact_by_phone },
            { column: 'Contact_By_Mail', value: contact_by_mail},
            { column: 'latitude', value: latitude},
            { column: 'longitude', value: longitude}
        ], [{ column: 'id', value: id }]);
    }


    async findUserByUsername(username) {
        const us = await this.db.read('Users', [{ column: 'username', value: username }]);
        if (us.length > 0) return us[0];
        else {
            return undefined; 
        }
    }

    async findUserById(id) {
        const us = await this.db.read('Users', [{ column: 'id', value: id }]);
        if (us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    async findContactById(id) {
        const us = await this.db.read('Contact', [{ column: 'id', value: id }]);
        if (us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    async findContacts() {
        const contacts = await this.db.read('Contact',[]);
        return contacts;
    }

    async deleteContact(id) {
        await this.db.delete('Contact', [{ column: 'id', value: id }]);
    }

}

module.exports = ContactClass;
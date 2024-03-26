const Datastore = require("nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
        } else {
            this.db = new Datastore();
        }
    }


    init() {
        this.db.insert({
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe8@email.com',
            password:
            '$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C'
        });
    
        return this;
    }



    async create(firstName, lastName, email, password, role = 'user') {
        try {
            const hash = await bcrypt.hash(password, saltRounds);
            const entry = { firstName: firstName, lastName: lastName, email: email, password: hash, role: role };
            await this.db.insert(entry);
        } catch (err) {
            console.error("Error creating user:", err);
        }
    }

    async lookup(user) {
        try {
            const entries = await this.db.find({ user: user });
            return entries.length > 0 ? entries[0] : null;
        } catch (err) {
            console.error("Error looking up user:", err);
            return null;
        }
    }
}


module.exports = UserDAO;
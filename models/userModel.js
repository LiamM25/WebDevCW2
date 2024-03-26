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
        console.log("User database initialized.");
        return this;
    }

    async create(firstName, lastName, email, password, role = 'user') {
        try {
            const hash = await bcrypt.hash(password, saltRounds);
            const normalisedEmail = email.toLowerCase(); 
            
            // Check if the email already exists
            const existingUser = await this.lookup(normalisedEmail);
            if (existingUser) {
                console.log("User already exists:", normalisedEmail);
                return null; // Return null to indicate duplicate email
            }
            
            const entry = { firstName: firstName, lastName: lastName, email: normalisedEmail, password: hash, role: role };
            await this.db.insert(entry);
            return entry; // Return the inserted entry
        } catch (err) {
            console.error("Error creating user:", err);
            return null; // Return null to indicate an error
        }
    }

    lookup(email) {
        return new Promise((resolve, reject) => {
            this.db.findOne({ email: email }, (err, user) => {
                if (err) {
                    console.error("Error looking up user:", err);
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });
    }
}

module.exports = UserDAO;
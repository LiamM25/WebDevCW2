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
        //user
        this.db.insert({
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe8@email.com',
            password: '$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C',
            role: 'user'
        });

        //admin
        this.db.insert({
            firstName: 'Admin',
            lastName: 'Admin',
            email: 'admin@email.com',
            password: '$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C',
            role: 'admin'
        });





        console.log("User database initialised.");
        return this;
    }

    create(firstName, lastName, email, password, role, cb) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function(hash) {
            var entry = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hash,
                role: role || 'user'
            };
            that.db.insert(entry, function (err) {
                if (err) {
                    console.log("Can't insert user:", email);
                    cb(err);
                    return;
                }
                cb(null);
            });
        });
    }

    lookup(email, cb) {
        this.db.find({ 'email': email }, (err, entries) => {
            if (err) {
                return cb(err, null);
            } else {
                if (entries.length === 0) {
                    return cb(null, null);
                } else {
                    return cb(null, entries[0]);
                }
            }
        });
    }
}
const dao = new UserDAO();
dao.init();
module.exports = dao;
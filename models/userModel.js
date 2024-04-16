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

         //pantry
         this.db.insert({
            firstName: 'Pantry1',
            lastName: 'Admin',
            email: 'pantry@email.com',
            password: '$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C',
            role: 'pantry',
            pantryName: 'Parkhead School House'
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

    //Admin related 
    // Method to retrieve all users
    getAllUsers(cb) {
        this.db.find({}, (err, users) => {
            if (err) {
                return cb(err, null);
            } else {
                return cb(null, users);
            }
        });
    }

    deleteUser(userId, cb) {
        this.db.remove({ _id: userId }, {}, (err, numRemoved) => {
            if (err) {
                return cb(err);
            } else {
                console.log(`Deleted ${numRemoved} user(s)`);
                return cb(null);
            }
        });
    }

    getNameById(userId, cb) {
        this.db.findOne({ _id: userId }, (err, user) => {
            if (err) {
                console.error("Error fetching user:", err);
                cb(err, null);
            } else {
                console.log("Successfully fetched user:", user);
                if (user) {
                    const fullName = `${user.firstName} ${user.lastName}`;
                    cb(null, fullName);
                } else {
                    cb(new Error("User not found"), null);
                }
            }
        });
    }

    adminCreate(firstName, lastName, email, password, role, pantryName, cb) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function(hash) {
            const entry = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hash,
                role: role
            };
            if (role === 'pantry') {
                // Add pantry name to the user entry
                entry.pantryName = pantryName;
            }
            that.db.insert(entry, function (err) {
                if (err) {
                    console.error("Can't insert user:", email);
                    cb(err);
                    return;
                }
                cb(null);
            });
        }).catch(function(err) {
            console.error("Error hashing password:", err);
            cb(err);
        });
    }


}
const dao = new UserDAO();
dao.init();
module.exports = dao;
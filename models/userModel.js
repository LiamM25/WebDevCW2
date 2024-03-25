const Datastore = require("nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            //embedded
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
        } else {
            //in memory
            this.db = new Datastore();
        }
    }

    init() {
        // Demo user data initialization
        const demoUsers = [
            { user: 'Peter', password: '$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C' },
            { user: 'Ann', password: '$2b$10$bnEYkqZM.MhEF/LycycymOeVwkQONq8kuAUGx6G5tF9UtUcaYDs3S' }
        ];

        this.db.insert(demoUsers, (err) => {
            if (err) {
                console.error('Error initializing demo users:', err);
            } else {
                console.log('Demo users initialized successfully.');
            }
        });
    }

    async create(username, password) {
        try {
            const hash = await bcrypt.hash(password, saltRounds);
            const entry = { user: username, password: hash };
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

// Export the UserDAO class itself
module.exports = UserDAO;
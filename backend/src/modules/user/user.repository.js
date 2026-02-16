const BaseRepository = require("../../core/base.repository");

const allowFields = ["name", "email", "phone", "is_active"];

class UserRepository extends BaseRepository {
    constructor() {
        super("users", allowFields);
    }
}

module.exports = new UserRepository();
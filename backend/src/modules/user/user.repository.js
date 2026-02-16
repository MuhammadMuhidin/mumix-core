const BaseRepository = require("../../core/base.repository");

const table = "users";
const allowFields = ["name", "email", "phone", "password", "is_active"];

class UserRepository extends BaseRepository {
    constructor() {
        super(table, allowFields);
    }
}

module.exports = new UserRepository();
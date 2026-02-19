const BaseRepository = require("../../core/base.repository");

const table = "users";
const allowFields = ["name", "email", "phone", "password", "is_active", "token_version", "role" ];
const searchableFields = ["name", "email"];

class UserRepository extends BaseRepository {
    constructor() {
        super(table, allowFields, searchableFields);
    }
}

module.exports = new UserRepository();
const m = require("mongoose");

// YAY: change name adminis_id -> adminis_un
// YAY: modification complete
const adminisSchema = m.Schema({
    adminis_un: String,
    name: String,
    password: String,
});

module.exports = m.model("admin", adminisSchema);

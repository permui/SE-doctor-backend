const m = require("mongoose");
const ObjectId = m.Schema.Types.ObjectId;

/**
 * delete announce_id
 * add user_id
 * 
 * YAY: modification complete. We ignore user_id in our code.
 */

const announceSchema = m.Schema({
    title: String,
    content: String,
    announcer: String,
    user_id: ObjectId,
    date: Date
});

module.exports = m.model("announce", announceSchema);

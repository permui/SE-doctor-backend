const m = require('mongoose');

/**
 * delete dept_id
 */

const deptSchema = m.Schema({
    name: String,
    intro: String
});

module.exports = m.model('department', deptSchema);
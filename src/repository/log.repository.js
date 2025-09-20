const pool = require('../config/db');

async function insertLog({ level = 'error', message, stack_trace = null, endpoint = null }) {
    await pool.execute(
        'INSERT INTO audit_logs (level, message, stack_trace, endpoint) VALUES (?, ?, ?, ?)',
        [level, message, stack_trace, endpoint]
    );
}

module.exports = { insertLog };
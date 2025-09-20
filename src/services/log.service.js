const db = require('../config/db');

async function logError({ level = 'error', message, stack_trace = null, endpoint = null }) {
    await db.query(
        'INSERT INTO audit_logs (level, message, stack_trace, endpoint) VALUES (?, ?, ?, ?)',
        [level, message, stack_trace, endpoint]
    );
}

module.exports = { logError };
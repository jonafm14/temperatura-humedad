const logRepository = require('../repository/log.repository');

async function logError({ level = 'error', message, stack_trace = null, endpoint = null }) {
    await logRepository.insertLog({ level, message, stack_trace, endpoint });
}

module.exports = { logError };
require('dotenv/config')

const DEFAULT_OUT_FILE = 'data/schedule.ics'

const eventName = requireEnv('EVENT_NAME')
const outFile = process.env.OUT_FILE || DEFAULT_OUT_FILE

function requireEnv(name) {
  const value = process.env[name]
  if (value == null || value === '') {
    throw new Error(`${name} is required`)
  }

  return value
}

module.exports = {
  eventName,
  outFile,
}

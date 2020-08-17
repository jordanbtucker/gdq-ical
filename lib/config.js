require('dotenv/config')

const DEFAULT_SCHEDULE_PAGE = 'https://gamesdonequick.com/schedule'
const DEFAULT_OUT_FILE = 'data/schedule.ics'

const schedulePage = process.env.SCHEDULE_PAGE || DEFAULT_SCHEDULE_PAGE
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
  schedulePage,
  eventName,
  outFile,
}

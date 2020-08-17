const {createHash} = require('crypto')
const {mkdir, writeFile} = require('fs').promises
const {dirname} = require('path')
const {default: fetch} = require('node-fetch')
const {JSDOM} = require('jsdom')
const config = require('./config')

async function app() {
  let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//jordanbtucker//gdq-ical//EN
CALSCALE:GREGORIAN
X-WR-CALNAME:${config.eventName}
X-PUBLISHED-TTL:PT15M
`

  const res = await fetch(config.schedulePage)
  const html = await res.text()
  const now = new Date()
  const dom = new JSDOM(html)
  const {window} = dom
  const {document} = window
  /** @type {NodeListOf<HTMLTableRowElement>} */
  const rows = document.querySelectorAll(
    '#runTable tbody tr:not(.day-split,.second-row)',
  )
  for (const row of rows) {
    /** @type {NodeListOf<HTMLTableCellElement>} */
    let cells = row.querySelectorAll('td')
    const start = new Date(cells.item(0).textContent.trim())
    const game = cells.item(1).textContent.trim()
    const runners = cells.item(2).textContent.trim()
    const setup = cells.item(3).textContent.trim()

    /** @type {HTMLTableCellElement} */
    const secondRow = row.nextElementSibling
    /** @type {NodeListOf<HTMLTableCellElement>} */
    cells = secondRow.querySelectorAll('td')
    const duration = cells.item(0).textContent.trim()
    const category = cells.item(1).textContent.trim()
    const hosts = cells.item(2).textContent.trim()

    ical += `BEGIN:VEVENT
DTSTART:${formatDate(start)}
DTEND:${formatDate(getEndTime(start, duration))}
DTSTAMP:${formatDate(now)}
UID:${getHash(`${game}__${category}`)}
SUMMARY:${game}
DESCRIPTION:Runners: ${runners}\\nRun Time: ${duration}\\nCategory: ${category}\\nHosts: ${hosts}\\nSetup Time: ${setup}
CLASS:PUBLIC
END:VEVENT
`
  }

  ical += 'END:VCALENDAR'

  ical = ical.replace(/\r\n|\r|\n/, '\r\n')

  await mkdir(dirname(config.outFile), {recursive: true})
  await writeFile(config.outFile, ical)
}

/**
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  const dateParts = [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  ]
  const timeParts = [
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  ]
  const parts = [
    dateParts.map(padDatePart).join(''),
    'T',
    timeParts.map(padDatePart).join(''),
    'Z',
  ]

  return parts.join('')
}

/**
 * @param {number} part
 * @returns {string}
 */
function padDatePart(part) {
  return part.toString().padStart(2, '0')
}

/**
 *
 * @param {Date} start
 * @param {string} duration
 * @returns {Date}
 */
function getEndTime(start, duration) {
  const match = duration.match(/^(\d+):(\d+):(\d+)$/)
  if (match == null) {
    throw new Error(`Invalid duration '${duration}'`)
  }

  const hours = Number(match[1])
  const minutes = Number(match[2])
  const seconds = Number(match[3])

  return new Date(
    start.getTime() +
      hours * 60 * 60 * 1000 +
      minutes * 60 * 1000 +
      seconds * 1000,
  )
}

/**
 * @param {string} value
 * @returns {string}
 */
function getHash(value) {
  const hash = createHash('sha1')
  hash.update(value)
  return hash.digest('base64')
}

module.exports = app

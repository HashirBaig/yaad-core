const dayjs = require("dayjs")

const date = new Date()
const getFormattedYesterday = () => {
  let yesterday = new Date()
  yesterday.setDate(date.getDate() - 1)
  yesterday = dayjs(yesterday).format("DD-MM-YYYY")
  return yesterday
}

const getFormattedDayBeforeYesterday = () => {
  let dayBeforeYesterday = new Date()
  dayBeforeYesterday.setDate(date.getDate() - 2)
  dayBeforeYesterday = dayjs(dayBeforeYesterday).format("DD-MM-YYYY")
  return dayBeforeYesterday
}

module.exports = {
  getFormattedYesterday,
  getFormattedDayBeforeYesterday,
}

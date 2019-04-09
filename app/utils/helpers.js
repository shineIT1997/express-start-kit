/**
* File name: helpers.js
* Created by Visual studio code
* User: Danh Le / danh.danh20051995@gmail.com
* Date: 2019-01-18 17:39:24
*/
import moment from 'moment'
const config = global.CONFIG

const dateFormat = (date, format = config.get('date.format'), timeZone = '') => {
  try {
    let tmpDate = String(timeZone).match(/utc/i) ? moment.utc(date) : new Date(date)
    if (date && String(tmpDate) !== 'Invalid Date') {
      return String(timeZone).match(/utc/i) ? moment.utc(date).format(format) : moment(date).format(format)
    }
  } catch (error) {}

  return date
}

/**
 * Get first validate error message
 * @param {Object} error
 * @return {String}
 */
const getFirstValidateError = error => {
  let { errors } = JSON.parse(error.toString())
  if (Array.isArray(errors) && errors.length) {
    let { messages } = errors[0]
    if (Array.isArray(messages) && messages.length) {
      return messages[0]
    }
  }

  return ''
}

export {
  dateFormat,
  getFirstValidateError
}

export default {
  dateFormat,
  getFirstValidateError
}

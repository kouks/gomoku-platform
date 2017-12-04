import config from 'config'

export default class Logger {
  static log (message) {
    if (config.debug) {
      console.log(message)
    }
  }
}

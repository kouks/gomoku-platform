import Logger from './Logger'

export default class Socket {
  static send (ws, message) {
    Logger.log('Message: ' + JSON.stringify(message))

    ws.send(JSON.stringify(message))
  }
}

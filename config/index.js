require('dotenv').config()

export default {
  url: {
    http: process.env.HTTP_URL,
    ws: process.env.WS_URL
  },
  mongodb: process.env.MONGO_URL,
  debug: true
}

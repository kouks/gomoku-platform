require('dotenv').config()

export default {
  url: process.env.APP_URL,
  mongodb: process.env.MONGO_URL,
  debug: true
}

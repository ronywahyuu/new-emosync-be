require('dotenv').config()

const checkClientId = (token) => {
  return token === process.env.AUTH0_CLIENT_ID ? true : false
}

module.exports = checkClientId

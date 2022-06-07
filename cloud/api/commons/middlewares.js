const { NotFoundError } = require('/jornal/commons/errors')

const db = require('/jornal/commons/db')
const loginIndex = db.in('logins')
const usersIndex = db.in('users')

const loginUserByToken = (token) => {
  const login = loginIndex.get(token)

  if (!login) {
    throw new NotFoundError('Login not found.', { token })
  }

  return usersIndex.get(login.read('user_id'))
}

module.exports = {
  loginUserByToken
}

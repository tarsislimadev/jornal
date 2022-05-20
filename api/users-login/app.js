const db = require('/jornal/commons/db')
const loginIndex = db.in('logins')

module.exports = ({ body: { email } }, res) => {
  const login = loginIndex.new()
  const datetime = Date.now().toString()

  login.writeMany({ email, datetime, })

  return res.json({ token: login.getId() })
}


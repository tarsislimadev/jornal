const md = require('/jornal/commons/middlewares')
const db = require('/jornal/commons/db')
const newsIndex = db.in('news')
const usersIndex = db.in('users')

module.exports = ({ headers: { token } }, res) => {
  md.loginUserByToken(token)

  const list = newsIndex.list()
    .map((news) => ({
      creator: usersIndex.get(news.read('user_id')).toJSON(),
      ...news.toJSON(),
    }))

  return res.json({ list })
}

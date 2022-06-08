const { NotFoundError } = require('/jornal/commons/errors')

const md = require('/jornal/commons/middlewares')
const db = require('/jornal/commons/db')
const newsIndex = db.in('news')
const usersIndex = db.in('users')

module.exports = ({ headers: { token }, body: { url, title, description, tags, image, text } }, res) => {
  const user = md.loginUserByToken(token)
  const user_id = user.getId()

  if (!user) {
    throw new NotFoundError('User not found.', { user_id })
  }

  const news = newsIndex.new()
  const created_at = Date.now().toString()

  news.writeMany({ url, title, description, tags, image, text, user_id, created_at })
  return res.json({ id: news.getId(), created_at })
}

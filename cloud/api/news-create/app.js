const newsIndex = require('/jornal/commons/db').in('news')

module.exports = ({ body: { title, image, text } }, res) => {
  const news = newsIndex.new()
  const created_at = Date.now().toString()

  news.writeMany({ title, image, text, created_at })
  return res.json({ id: news.getId(), created_at })
}

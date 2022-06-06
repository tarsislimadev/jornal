const newsIndex = require('/jornal/commons/db').in('news')

module.exports = (_, res) => res.json({ list: newsIndex.listJSON() })

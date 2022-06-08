const db = require('/jornal/commons/db')
const newsIndex = db.in('news')

const { DATA_PATH } = process.env

const stringPage = (head, body) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${head}
</head>

<body>
  ${body}
</body>

</html>
`

const json2html = (node = {}) => {
  const uniques = ['meta', 'input']
  const texts = ['text', 'html']

  if (uniques.indexOf(node.tag) !== -1) return `
    <${node.tag} ${node.params?.map(param => `${param}="${node.params[param]}" `) || ''}/>
  `

  if (texts.indexOf(node.tag) !== -1) return node.value

  return `
  <${node.tag} ${node.params?.map(param => `${param}="${node.params[param]}" `) || ''} >
  ${node.children?.map((node) => json2html(node))}
  </${node.tag}>
  `
}

const renderNewsPage = (news) => {
  const head = [
    {
      "tag": "title",
      "children": [
        { "tag": "text", "value": `Jornal - ${news.title}` },
      ]
    }
  ].map((node) => json2html(node))

  const body = [
    {
      "tag": "h1",
      "children": [
        { "tag": "text", "value": news.text }
      ]
    }
  ].map((node) => json2html(node))

  return stringPage(head, body)
}

module.exports = (handler) => {
  const list = newsIndex.list()
  list.map((news) => {
    const json = news.toJSON()
    const filename = `${DATA_PATH}/public/news/${json.url}/index.html`
    handler.writeFileString(filename, renderNewsPage(json))
  })

  handler.stdOut(`${list.length} news files`)
  return handler
}

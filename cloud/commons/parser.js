const renderFile = (template = '', params = {}) =>
  Object.keys(params)
    .reduce((html, param) => html.replace(`##${param}##`, params[param]), template)

module.exports = {
  renderFile,
}

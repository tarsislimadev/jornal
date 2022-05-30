const { DuplicatedError } = require('/jornal/commons/errors')
const userIndex = require('/jornal/commons/db').in('users')

module.exports = ({ body: { email } }, res) => {
  if (userIndex.find({ email }))
    throw new DuplicatedError({ email })

  const created_at = Date.now().toString()
  userIndex.new().writeMany({ email, created_at })
  return res.json({ created_at })
}

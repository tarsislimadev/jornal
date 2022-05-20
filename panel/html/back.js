
const Validation = {
  email: (errorMessage = 'E-mail invalido.') => (value) => !!(value.toString().match(/@/ig)) ? null : errorMessage,
}

const Validator = {}

Validator.errors = function (errors = {}) {
  const self = this

  self.type = 'validation'

  self.toJSON = () => errors

  self.get = (name) => self.toJSON()[name]
}

Validator.with = (fields) => {
  return {
    validate: (object) => new Promise((resolve, reject) => {
      const errors = {}

      Object.keys(object)
        .map((name) => {
          const arr = object[name] || []
          const error = arr.map((val) => val(fields[name])).find(err => err)
          if (error) errors[name] = error
        })

      if (Object.keys(errors).length) reject(new Validator.errors(errors))
      else resolve()
    })
  }
}

const Ajax = {}

Ajax.BASE_URL = 'http://0.0.0.0/api/v1'

Ajax.SuccessResponse = function (responseText) {
  const self = this

  self.type = 'success'

  self.toJSON = () => JSON.parse(responseText)

  self.getData = () => self.toJSON()['data']

  self.get = (name) => self.getData()[name]
}

Ajax.ErrorResponse = function (responseText) {
  const self = this

  self.type = 'error-response'

  self.toJSON = () => JSON.parse(responseText)

  self.getData = () => self.toJSON()['data']

  self.get = (name) => self.getData()[name]

  self.getMessage = () => self.toJSON()['message']

  self.getStatus = () => self.toJSON()['status']
}

Ajax.post = (paths, data = {}) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', [Ajax.BASE_URL, ...paths].join('/'), true)

  xhr.onload = () => resolve(new Ajax.SuccessResponse(xhr.responseText))
  xhr.onerror = () => reject(new Ajax.ErrorResponse(xhr.responseText))

  // const fd = new FormData()
  // Object.keys(data).map(key => fd.append(key, data[key]))
  // xhr.send(fd)
  xhr.send(JSON.stringify(data))
})

const Api = {}

Api.login = ({ email }) =>
  Validator.with({ email })
    .validate({ email: [Validation.email()], })
    .then(() => Ajax.post(['users', 'login'], { email }))

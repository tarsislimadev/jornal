
const ErrorTypes = {
  VALIDATION: 'validation',
  RESPONSE: 'error-response',
}

const Validation = {
  email: (errorMessage = 'E-mail invalido.') => (value) => !!(value.toString().match(/@/ig)) ? null : errorMessage,
  required: (errorMessage = 'Campo obrigatório') => (value) => !!value ? null : errorMessage,
}

const Validator = {}

Validator.errors = function (errors = {}) {
  const self = this

  self.type = ErrorTypes.VALIDATION

  self.toJSON = () => errors

  self.getData = () => self.toJSON()

  self.getStatus = () => 'validation-errors'

  self.getMessage = () => 'Validation error.'

  self.get = (name) => self.getData()[name]
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

Ajax.SuccessResponse = function ({ responseText }) {
  const self = this

  self.type = 'success'

  self.toJSON = () => JSON.parse(responseText)

  self.getData = () => self.toJSON()['data']

  self.getStatus = () => self.toJSON()['status']

  self.getMessage = () => 'OK'

  self.get = (name) => self.getData()[name]
}

Ajax.ErrorResponse = function ({ responseText }) {
  const self = this

  self.type = 'error-response'

  self.toJSON = () => JSON.parse(responseText)

  self.getData = () => self.toJSON()['data']

  self.getStatus = () => self.toJSON()['status']

  self.getMessage = () => Translator.in('pt-br').speak(self.toJSON()['message'])

  self.get = (name) => self.getData()[name]
}

Ajax.request = (method, url, data) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest()
  xhr.open(method, url, true)

  const onComplete = (xhr) => {
    if ([200, '200'].indexOf(xhr.status) !== -1) {
      resolve(new Ajax.SuccessResponse(xhr))
    } else {
      reject(new Ajax.ErrorResponse(xhr))
    }
  }

  xhr.onload = () => onComplete(xhr)
  xhr.onerror = () => onComplete(xhr)

  xhr.send(data)
})

Ajax.post = (paths = [], data) =>
  Ajax.request('POST', [Ajax.BASE_URL, ...paths].join('/'), JSON.stringify(data))

Ajax.upload = (file, { name, size, type }) => {
  const data = new FormData()

  data.append('file', file)
  data.append('name', name)
  data.append('size', size)
  data.append('type', type)

  return Ajax.request('POST', [Ajax.BASE_URL, 'upload'].join('/'), data)
}

const Api = {}

Api.usersLogin = ({ email }) =>
  Validator.with({ email })
    .validate({ email: [Validation.email()] })
    .then(() => Ajax.post(['users', 'login'], { email }))
    .then(() => Flow.goTo('dashboard.html'))

Api.usersRegister = ({ email }) =>
  Validator.with({ email })
    .validate({ email: [Validation.email()] })
    .then(() => Ajax.post(['users', 'register'], { email }))
    .then(() => Flow.goTo('index.html'))

Api.newsCreate = ({ title, image, text }) =>
  Validator.with({ title, image, text })
    .validate({
      title: [Validation.required()],
      image: [Validation.required()],
      text: [Validation.required()],
    })
    .then(() => Ajax.post(['news', 'create'], { title, image, text }))

Api.newsList = ({ search } = { search: '' }) =>
  Ajax.post(['news', 'list'], { search })

Api.upload = (file, { name, size, type }) =>
  Ajax.upload(file, { name, size, type })


const pathPkg = require('path')
const fsPkg = require('fs')

class DataObject {
  params = {}

  constructor(dir, id) {
    const self = this

    self.params.dir = dir
    self.params.id = id
    self.params.path = pathPkg.join(dir, id)

    fsPkg.mkdirSync(self.params.path, { recursive: true })
  }

  getId() {
    const self = this
    return self.params.id
  }

  propName(name) {
    const self = this
    return pathPkg.join(self.params.path, name)
  }

  read(name) {
    const self = this
    return fsPkg.readFileSync(self.propName(name))
  }

  readUnsafeString(name = '') {
    const self = this
    return self.read(name).toString()
  }

  readString(name = '') {
    const self = this
    return self.readUnsafeString(name).replace(/\s+/ig, '')
  }

  writeString(name, content) {
    const self = this
    fsPkg.writeFileSync(self.propName(name), content)
    return self
  }

  writeMany(many) {
    const self = this
    Object.keys(many)
      .map((key) => self.writeString(key, many[key].toString()))

    return self
  }
}

class DataBase {

  params = {}

  constructor(dir) {
    this.params.dir = dir

    fsPkg.mkdirSync(dir, { recursive: true })
  }

  in(dir) {
    const self = this
    return new DataBase(pathPkg.join(self.params.dir, dir))
  }

  new() {
    const self = this
    const id = Date.now().toString() // FIXME: uuid
    return new DataObject(self.params.dir, id)
  }

  list() {
    const self = this
    return fsPkg.readdirSync(self.params.dir)
      .map((param) => new DataObject(self.params.dir, param))
  }

  find(params = {}) {
    const self = this
    return self.list()
      .find((data) => {
        return Object.keys(params)
          .every((param) => data.readString(param) === params[param].toString())
      })
  }
}

module.exports = new DataBase(process.env.DATA_PATH)


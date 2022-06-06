const pathPkg = require('path')
const fsPkg = require('fs')

class DataObject {
  params = {}

  constructor(dir, id) {
    this.params.dir = dir
    this.params.id = id
    this.params.path = pathPkg.join(dir, id)

    fsPkg.mkdirSync(this.params.path, { recursive: true })
  }

  getId() {
    return this.params.id
  }

  propName(name) {
    return pathPkg.join(this.params.path, name)
  }

  read(name) {
    return fsPkg.readFileSync(this.propName(name))
  }

  readUnsafeString(name = '') {
    return this.read(name).toString()
  }

  readString(name = '') {
    return this.readUnsafeString(name).replace(/\s+/ig, '')
  }

  writeString(name, content) {
    fsPkg.writeFileSync(this.propName(name), content)
    return this
  }

  writeMany(many) {
    const self = this

    Object.keys(many)
      .map((key) => self.writeString(key, many[key].toString()))

    return self
  }

  getProps() {
    return fsPkg.readdirSync(this.params.path)
  }

  toJSON() {
    const self = this
    const json = { 'id': self.getId() }

    self.getProps()
      .map((name) => json[name] = self.readString(name))

    return json
  }
}

class DataBase {

  params = {}

  constructor(dir) {
    this.params.dir = dir

    fsPkg.mkdirSync(dir, { recursive: true })
  }

  in(dir) {
    return new DataBase(pathPkg.join(this.params.dir, dir))
  }

  new() {
    const id = Date.now().toString() // FIXME: uuid
    return new DataObject(this.params.dir, id)
  }

  list() {
    const self = this
    return fsPkg.readdirSync(self.params.dir)
      .map((param) => new DataObject(self.params.dir, param))
  }

  listJSON() {
    return this.list().map((item) => item.toJSON())
  }

  find(params = {}) {
    return this.list()
      .find((data) => Object.keys(params)
        .every((param) => data.readString(param) === params[param].toString())
      )
  }
}

module.exports = new DataBase(process.env.DATA_PATH)

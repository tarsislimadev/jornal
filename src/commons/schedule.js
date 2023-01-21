const fsPkg = require('fs')

const app = require('/jornal/app/app')

const LINE_BREAK = '\r\n'

class ScheduleHandler {
  info = {}

  constructor(info) {
    this.info = info
  }

  makeDir(name) {
    return fsPkg.mkdirSync(name, { recursive: true })
  }

  parseDirAndFileNames(name) {
    const items = name.split('/')
    const filename = items.pop()
    const dir = ['', ...items].join('/')

    this.makeDir(dir)
    return [dir, filename]
  }

  listDir(name) {
    const list = fsPkg.readdirSync(name)
    this.stdOut(`List "${list.length} files" in directory "${name}"`)
    return list
  }

  writeFileString(name, content) {
    return this.writeFileBuffer(name, Buffer.from(content))
  }

  writeFileBuffer(name, content) {
    const filename = this.parseDirAndFileNames(name).join('/')
    fsPkg.writeFileSync(filename, content)

    this.stdOut(`Writed "${content.length} bytes" to file "${name}".`)
    return content.length
  }

  readFileString(name) {
    return this.readFileBuffer(name).toString()
  }

  readFileBuffer(name) {
    const content = Buffer.from(fsPkg.readFileSync(name))
    this.stdOut(`Read "${content.length} bytes" from file "${name}".`)
    return content
  }

  stdOut(content) {
    process.stdout.write(`Out ${Date.now()}: ${content}\n\n`)
  }

  stdErr(err) {
    switch (true) {
      case err instanceof Error:
        return this.stdErr([
          err.__proto__.constructor.name,
          err.message,
          err.stack,
        ].join(LINE_BREAK))

      case typeof err === 'object':
        return this.stdErr(JSON.stringify(err, null, 4))

      case Array.isArray(err):
        return err.map((e) => this.stdErr(e), this)
    }

    process.stderr.write(`Error ${Date.now()}: ${err} ${LINE_BREAK}`)
  }
}

const run = async () => {
  const info = { env: process.env }
  const handler = new ScheduleHandler(info)

  try {
    app(handler)
  } catch (e) {
    handler.stdErr(e)
      (handler.toString())
  }
}

run()

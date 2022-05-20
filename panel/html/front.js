
class nElement {

  constructor(options = {}) {
    if (options?.element?.tagName) {
      this.element = document.createElement(options?.element?.tagName)
    }

    if (options?.container?.tagName) {
      this.container = document.createElement(options?.container?.tagName)
    }

    const name = options?.component?.name || 'undefined'
    this.container.classList.add(`ct-${name}`)
    this.element.classList.add(`el-${name}`)
  }

  container = document.createElement('div')
  element = document.createElement('div')

  inContainer = {
    before: [],
    after: [],
  }

  loadElement(element) {
    const self = this
    self.element = element
    return self
  }

  focus() {
    const self = this
    self.element.focus()
    return self
  }

  style(name, value) {
    const self = this
    self.element.style[name] = value
    return self
  }

  styleContainer(name, value) {
    const self = this
    self.container.style[name] = value
    return self
  }

  setText(text) {
    const self = this
    self.element.innerText = text
    return self
  }

  getText() {
    const self = this
    return self.element.innerText
  }

  append(nelement = new nElement) {
    const self = this
    self.element.append(nelement.render())
    return self
  }

  set(nelement = new nElement) {
    const self = this
    self.element.childNodes.forEach(c => c.remove())
    self.element.append(nelement.render())
    return self
  }

  on(name, func) {
    const self = this
    self.element.addEventListener(name, func)
    return self
  }

  render() {
    const self = this

    self.inContainer.before.map(c => self.container.append(c.render()))
    self.container.append(self.element)
    self.inContainer.after.map(c => self.container.append(c.render()))

    return self.container
  }
}

class nValuable extends nElement {

  setValue(value) {
    const self = this
    self.element.value = value
    return self
  }

  getValue() {
    const self = this
    return self.element.value
  }

}

class nTextarea extends nValuable {
  constructor() {
    super({
      component: { name: 'textarea' },
      element: { tagName: 'textarea' }
    })

    this.style('margin', '0')
    this.style('padding', '0')
    this.style('border', 'none')
    this.style('resize', 'none')
    this.style('font', 'inherit')

    this.style('outline', 'none')
  }
}

class nTextInput extends nValuable {
  constructor() {
    super({
      component: { name: 'text-input' },
      element: { tagName: 'input' }
    })

    this.style('box-shadow', '0 0 0.1rem 0 black')
    this.style('margin', '0 0 0.5rem 0')
    this.style('box-sizing', 'border-box')
    this.style('padding', '0.5rem')
    this.style('outline', 'none')
    this.style('font', 'inherit')
    this.style('border', 'none')
    this.style('width', '100%')

    this.element.type = 'text'
  }
}

class nTextComponent extends nElement {
  label = new nText()
  input = new nTextInput()
  error = new nText()

  constructor() {
    super({ component: { name: 'text-component' } })

    this.error.style('color', 'red')

    this.inContainer.after.push(this.label)
    this.inContainer.after.push(this.input)
    this.inContainer.after.push(this.error)
  }
}

class nText extends nValuable {
  constructor() {
    super({ component: { name: 'text' } })
  }
}

class nButton extends nElement {
  constructor() {
    super({
      component: { name: 'button' },
      element: { tagName: 'button' },
    })

    this.style('font', 'inherit')
  }
}

const Helper = {
  element: (el, options = {}) => {
    const component = new nElement(options)
    component.loadElement(el)
    return component
  },
  id: (id, options) => Helper.element(document.getElementById(id), options),
}

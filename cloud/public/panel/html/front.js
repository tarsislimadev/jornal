
const Flow = {}

Flow.goTo = (url) => (window.location = url)

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

  static fromElement(el, options = {}) {
    const component = new nElement(options)
    component.loadElement(el)
    return component
  }

  static fromId(id, options) {
    return nElement.fromElement(document.getElementById(id), options)
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

class nTextInput extends nValuable {
  constructor() {
    super({
      component: { name: 'text-input' },
      element: { tagName: 'input' }
    })

    this.style('box-shadow', '0 0 0.1rem 0 black')
    this.style('box-sizing', 'border-box')
    this.style('margin', '0 0 0.5rem 0')
    this.style('padding', '0.5rem')
    this.style('outline', 'none')
    this.style('font', 'inherit')
    this.style('border', 'none')
    this.style('width', '100%')

    this.element.type = 'text'
  }
}

class nTextarea extends nValuable {
  constructor() {
    super({
      component: { name: 'textarea' },
      element: { tagName: 'textarea' }
    })

    this.style('box-shadow', '0 0 0.1rem 0 black')
    this.style('box-sizing', 'border-box')
    this.style('margin', '0 0 0.5rem 0')
    this.style('padding', '0.5rem')
    this.style('outline', 'none')
    this.style('font', 'inherit')
    this.style('resize', 'none')
    this.style('border', 'none')
    this.style('width', '100%')
  }

  setRows(rows) {
    const self = this
    self.element.rows = rows
    return self
  }
}

class nText extends nValuable {
  constructor() {
    super({ component: { name: 'text' } })
  }
}

class nTextError extends nText {
  constructor() {
    super({ component: { name: 'text-error' } })

    this.style('color', 'red')
  }
}

class nH1 extends nText {
  constructor() {
    super({ component: { name: 'h1' } })

    this.styleContainer('display', 'inline-block')
    this.styleContainer('width', '100%')
    this.style('text-align', 'center')
    this.style('font-size', '3rem')
  }
}

class nH2 extends nH1 {
  constructor() {
    super({ component: { name: 'h2' } })

    this.style('font-size', '1.5rem')
  }
}

class nButton extends nElement {
  constructor() {
    super({
      component: { name: 'button' },
      element: { tagName: 'button' },
    })

    this.style('display', 'inline-block')
    this.style('margin', '0 0 0.5rem 0')
    this.style('outline', 'none')
    this.style('padding', '1rem')
    this.style('font', 'inherit')
    this.style('border', 'none')
    this.style('width', '100%')
  }
}

class nLink extends nElement {
  constructor() {
    super({
      component: { name: 'link' },
      element: { tagName: 'a' }
    })

    this.styleContainer('text-align', 'center')
    this.style('text-decoration', 'none')
  }

  href(url) {
    const self = this
    self.element.href = url
    return self
  }
}

class nCenterForm extends nElement {
  constructor() {
    super({ component: { name: 'center-form' } })

    this.styleContainer('margin', '2rem auto')
    this.styleContainer('width', '30rem')

    this.style('background-color', '#ffffff')
    this.style('display', 'inline-block')
    this.style('padding', '1rem')
    this.style('width', '100%')
  }
}

// components

class nContainerComponent extends nElement {

  top = new nElement()
  left = new nElement()
  right = new nElement()
  bottom = new nElement()

  constructor() {
    super({ component: { name: 'container-component' } })

    this.style('margin', '0 auto')
    this.style('width', '50rem')

    super.append(this.top)

    const middle = new nElement()
    middle.style('display', 'flex')

    this.left.styleContainer('width', '69%')
    this.left.styleContainer('margin', '0 0.5rem 0 0')
    middle.append(this.left)

    middle.append(this.right)

    super.append(middle)

    super.append(this.bottom)
  }

  append() {
    throw new Error('Can not do this.')
  }
}

class nTextInputComponent extends nElement {
  label = new nText()
  input = new nTextInput()
  error = new nTextError()

  constructor() {
    super({ component: { name: 'text-input-component' } })

    this.label.style('margin', '0 0 0.5rem 0')
    this.error.style('margin', '0 0 0.5rem 0')

    super.append(this.label)
    super.append(this.input)
    super.append(this.error)
  }
}

class nTextareaComponent extends nElement {
  label = new nText()
  textarea = new nTextarea()
  error = new nTextError()

  constructor() {
    super({ component: { name: 'textarea-component' } })

    this.label.style('margin', '0 0 0.5rem 0')
    this.error.style('margin', '0 0 0.5rem 0')

    super.append(this.label)
    super.append(this.textarea)
    super.append(this.error)
  }
}

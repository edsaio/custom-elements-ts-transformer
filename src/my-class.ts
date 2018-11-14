const customElement = (args) => {
  return (target) => {
    return target;
  }
}

// @ts-ignore
class BaseHTMLELement extends HTMLElement {

  // @ts-ignore
  get style() { return '' }

  get template() { return ``; }

  connectedCallback() {
    this.__render();
  }

  __render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${this.style}</style>
      ${this.template}
    `;
    const element = document.importNode(template.content, true);
    this.appendChild(element);
  }

}

@customElement({
  tag: 'x-element',
  style: `
    h1 {  
      color: red;
    }`,
  template: `
    <h1>Hello World</h1>
  `
})
class MyClass extends BaseHTMLELement { 
  constructor() {
    super();
  }
}



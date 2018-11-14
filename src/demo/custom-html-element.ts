/// @ts-ignore
export class CustomHTMLElement extends HTMLElement {

  // @ts-ignore
  get style() { return '' }

  get template() { return ``; }

  connectedCallback() {
    this.__render();
    // @ts-ignore
    this.onInit && this.onInit();
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

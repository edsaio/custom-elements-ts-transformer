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

export function toggleGet(propName) {
  const getAttribute = (propName) => {
    if(this.hasAttribute(propName)){
      const attrValue = this.getAttribute(propName);
      if(/^(true|false|^$)$/.test(attrValue)) {
        return attrValue == 'true' || attrValue == '';
      } else {
        return false;
      }
    }
    return false;
  };
  return getAttribute(propName);
}

export interface SampleInterface {
  name: string;
}


export interface SampleInterface2 {
  fName: string;
}
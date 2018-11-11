const customElement = (args) => {
  return (target) => {
    return target;
  }
}

const Metadata = {
  style: `
  
  `,

}


abstract class CustomHTMLElement {

  protected static get style() {
    return undefined;
  }

}


@customElement({
  tag: 'x-element',
  style: `
    x-element {  
      color: red;
    }`,
  template: `
    <span class="x-element"></span>
  `
})
class MyClass extends CustomHTMLElement { 

  connectedCallback() {
    console.log(MyClass.style);
  }

}
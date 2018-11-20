import { CustomElement } from './custom-element';
import { SampleInterface } from './custom-html-element';


const Toggle = () => {
  return (target: any, propName: any) => {
    return target;
  }
}

@CustomElement({
  tag: 'hello-world',
  style: `
    h1 {
      color: red;
    }
  `,
  template: `
    <h1>Hello World.</h1>
  `
})
export class HelloWorldElement {

  @Toggle() checked;
  @Toggle() required;

}
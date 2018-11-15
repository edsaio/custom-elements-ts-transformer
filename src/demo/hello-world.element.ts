import { CustomElement } from './custom-element';
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
}
const customElement = (args) => {
  return (target) => {
    return target;
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
class MyClass { 

}
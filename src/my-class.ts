const CustomElement = (args) => {
  return (target) => {
    return target;
  }
}

@CustomElement({
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
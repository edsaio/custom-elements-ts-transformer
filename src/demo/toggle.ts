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
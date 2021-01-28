function container(doc, path) {
  path.forEach((element) => {
    if (typeof element === 'string' || element instanceof String){
      doc = doc.ele(element);
    } else {
      doc = doc.ele(element.name, element.attributes);
    }
  });
  return doc;
}

module.exports = { container };

function container(doc, path) {
  path.forEach((element) => {
    doc = doc.ele(element);
  });
  return doc;
}

module.exports = { container };

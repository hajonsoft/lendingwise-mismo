const { create } = require("xmlbuilder2");

function createFakeXml() {
  let doc = create({ version: "1.0" });
  doc.ele("http://cnn.com", "MESSAGE", {a: "b"}).ele("naji").ele("FirstName", {sequence: "1"}).txt("test").up().ele("LastName").txt("test2"); 
  const output =  doc.end({ prettyPrint: true });
  console.log(output);
}

global.createFakeXml = createFakeXml;
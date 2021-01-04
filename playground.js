const { create } = require("xmlbuilder2");
const { mismoNodes, container } = require("./util");

let doc = create().ele("MESSAGE");
doc = container(doc, [
  "PARTIES",
  "PARTY",
  "INDIVIDUAL",
  "ALIASES",
  "ALIAS",
  "NAME",
]);
doc = mismoNodes(doc, [
  { FirstName: "John" },
  { LastName: "HomeOwner" },
  { MiddleName: "Adams" },
]);
doc = doc.root();
const aliasNode = doc.find((n) => n.node.nodeName === "ALIAS", true, true);
if (aliasNode) {
  doc = aliasNode.ele("REAL_NAME");
  doc = mismoNodes(doc, [
    { FirstName: "John" },
    { LastName: "HomeOwner" },
    { MiddleName: "Adams" },
  ]);
}
const xml = doc.end({ prettyPrint: true });
console.log(xml);

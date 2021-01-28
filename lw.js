const { createMismo } = require("./lendingWise");
const fs = require("fs");
const moment = require('moment')

if (process.argv[2]) {
  const jsonFile = fs.readFileSync(
    "./assets/" + process.argv[2] + ".json",
    "utf-8"
  );
  const xml = createMismo(JSON.parse(jsonFile));
  fs.writeFileSync("./output/" + process.argv[2] + ".xml", xml);
} else {
  // const fileSuffix = "_" + moment().format('HHmmss')
  const fileSuffix = '';
  let fileName = "john_loan";
  let jsonFile = fs.readFileSync("./assets/" + fileName + ".json", "utf-8");
  let xml = createMismo(JSON.parse(jsonFile));
  fs.writeFileSync("./output/" + fileName + fileSuffix + ".xml", xml);

  fileName = "bobby_loan";
  jsonFile = fs.readFileSync("./assets/" + fileName + ".json", "utf-8");
  xml = createMismo(JSON.parse(jsonFile));
  fs.writeFileSync("./output/" + fileName + fileSuffix + ".xml", xml);

  fileName = "rodriguez_loan";
  jsonFile = fs.readFileSync("./assets/" + fileName + ".json", "utf-8");
  xml = createMismo(JSON.parse(jsonFile));
  fs.writeFileSync("./output/" + fileName + fileSuffix + ".xml", xml);

  fileName = "keith_loan";
  jsonFile = fs.readFileSync("./assets/" + fileName + ".json", "utf-8");
  xml = createMismo(JSON.parse(jsonFile));
  fs.writeFileSync("./output/" + fileName + fileSuffix + ".xml", xml);
}

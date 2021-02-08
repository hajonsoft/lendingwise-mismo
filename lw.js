const { createMismo } = require("./lendingWise");
const { validate } = require("./validate");
const fs = require("fs");
const moment = require('moment')

if (process.argv[2]) {
  const jsonFile = fs.readFileSync(
    "./assets/" + process.argv[2] + ".json",
    "utf-8"
  );
  const xml = createMismo(JSON.parse(jsonFile));
  let validationErrs = validate(xml);
  if (validationErrs.length > 0) {
    console.log(process.argv[2],validationErrs.length, 'validation error(s)' , validationErrs);
  }
  fs.writeFileSync("./output/" + process.argv[2] + ".xml", xml);
} else {
  // const fileSuffix = "_" + moment().format('HHmmss')
  const fileSuffix = '';
  const files = ["john_loan","bobby_loan","rodriguez_loan","keith_loan", "smith_loan", "barbara_loan", "papon_loan", "smithb_loan"];
  for (let i =0 ; i< files.length; i++) {
    let fileName = files[i];
    let jsonFile = fs.readFileSync("./assets/" + fileName + ".json", "utf-8");
    let xml = createMismo(JSON.parse(jsonFile));
    let validationErrors = validate(xml);
    if (validationErrors.length > 0) {
      console.log(fileName,validationErrors.length, 'validation error(s)' , validationErrors);
    }
    fs.writeFileSync("./output/" + fileName + fileSuffix + ".xml", xml);
  }
}


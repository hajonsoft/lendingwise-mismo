const {
  assets,
  loanOwnedPropertyData,
  ownedProperty,
  collaterals,
  liabilities,
  loans,
  partyBorrower,
  partyCoBorrower,
  previousEmployment,
} = require("./lendingWise");
const lwLoan = require("./assets/loan.json");
const { create } = require("xmlbuilder2");
const { container } = require("./util");
const moment = require("moment");
const fs = require("fs");

function createMismo(loan) {
  let doc = create({
    version: "1.0",
    encoding: "UTF-8",
  }).ele("http://www.mismo.org/residential/2009/schemas", "MESSAGE", {
    "xmlns:LMR": "https://www.lendingwise.com/",
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xmlns:ULAD": "http://www.datamodelextension.org/Schema/ULAD",
    MISMOReferenceModelIdentifier: "3.4.032420160128",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    "xsi:schemaLocation":
      "http://www.datamodelextension.org/Schema/ULAD ULAD_ExtensionV3_4.xsd",
  });
  doc = container(doc, ["ABOUT_VERSIONS", "ABOUT_VERSION"]);
  doc = doc
    .ele("CreatedDatetime")
    .txt(moment().utc().format())
    .up()

  doc = doc.root();
  doc = container(doc, ["DEAL_SETS", "DEAL_SET", "DEAL", "ASSETS"]);

  const loanAssets = loan["fileLOChekingSavingInfo"];
  doc = assets(doc, loanAssets);

  const ownedPropertyData = loanOwnedPropertyData(
    loan["fileLOScheduleRealInfo"]
  );
  doc = ownedProperty(doc, ownedPropertyData, loanAssets.length);

  const collateralData = [loan["LMRInfo"]];
  doc = collaterals(doc, collateralData);

  const liabilityData = loan["contingentLiabilities"];
  doc = liabilities(doc, liabilityData);

  const loanData = [loan["LMRInfo"]];
  doc = loans(doc, loanData);

  const partyData = [loan["LMRInfo"]];
  doc = partyBorrower(doc, partyData);

  if (partyData[0].coBorrowerFName){
    doc = partyCoBorrower(doc,partyData,1);
  }

  const previousEmploymentData = loan["borEmploymentInfo"];
  doc = previousEmployment(doc, previousEmploymentData);

  const xml = doc.end({ prettyPrint: true });

  return xml;
}

function createMismoTest() {
  const mismo = createMismo(lwLoan);
  fs.writeFileSync("./output/mismo_loan.xml", mismo, {
    encoding: "utf8",
    flag: "w",
  });
  console.log(mismo);
  return mismo;
}

global.createLendingWiseMismo = createMismoTest;

createMismoTest()

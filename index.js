const loan = require('./loan.json');
const { create } = require('xmlbuilder2');
const moment = require('moment')
const fs = require('fs');

let doc = create({ version: '1.0', encoding: 'UTF-8' })
  .ele("http://www.mismo.org/residential/2009/schemas",'MESSAGE', { 'xmlns:LMR': 'https://www.lendingwise.com/', 'xmlns:xsi':"http://www.w3.org/2001/XMLSchema-instance" , 'xmlns:ULAD':"http://www.datamodelextension.org/Schema/ULAD", MISMOReferenceModelIdentifier:"3.4.032420160128", 'xmlns:xlink':"http://www.w3.org/1999/xlink", 'xsi:schemaLocation':"http://www.datamodelextension.org/Schema/ULAD ULAD_ExtensionV3_4.xsd" })
    .ele('ABOUT_VERSIONS')
      .ele("ABOUT_VERSION")
        .ele("CreatedDatetime").txt(moment().utc().format()).up()
        .ele("DataVersionName").txt('Purchase Example').up()
      .up()
    .up()
  .ele('DEAL_SETS')
  .ele('DEAL_SET')
  .ele('DEAL');


// Assets
doc = doc.ele('ASSETS')
if (loan["fileLOChekingSavingInfo"] && Array.isArray(loan["fileLOChekingSavingInfo"]) && loan["fileLOChekingSavingInfo"].length > 0) {
  for (let i = 0; i< loan["fileLOChekingSavingInfo"].length; i++){
    const asset = loan["fileLOChekingSavingInfo"][i];
    doc.ele("ASSET", {SquenceNumber: i+1, 'xlink:label': `ASSET_${i+1}`})
       .ele("ASSET_DETAIL")
       .ele("AssetAccountIdentifier").txt(asset.fileID).up()
       .ele("AssetCashOrMarketValueAmount").txt(asset.balance).up()
       .ele("AssetType").txt(asset.accType).up()
      .up()
    .ele("ASSET_HOLDER")
    .ele("NAME")
    .ele("FullName").txt(asset.accountTitledAs).up()
    .up()
  }
}
doc = doc.up();

// Collaterals

// Expenses

// liabilities
doc = doc.ele('LIABILITIES')
if (loan["contingentLiabilities"] && Array.isArray(loan["contingentLiabilities"]) && loan["contingentLiabilities"].length > 0) {
  for (let i = 0; i< loan["contingentLiabilities"].length; i++){
    const liability = loan["contingentLiabilities"][i];
    doc.ele("LIABILITY", {SquenceNumber: i+1, 'xlink:label': `LIABILITY_${i+1}`})
       .ele("LIABILITY_DETAIL")
       .ele("LiabilityAccountIdentifier").txt(liability.PCID).up()
       .ele("LiabilityMonthlyPaymentAmount").txt(liability.monthlyPayment).up()
       .ele("LiabilityPayoffStatusIndicator").txt("false").up()
       .ele("LiabilityType").txt("Revolving").up() //TODO: confirm
       .ele("LiabilityUnpaidBalanceAmount").txt(liability.clBalance).up()
      .up()
    .ele("LIABILITY_HOLDER")
    .ele("NAME")
    .ele("FullName").txt(liability.nameOfCompany)
    .up()
  }
}
doc = doc.up()

// loans

// Parties

// Relationships

// Document Sets

const xml = doc.end({ prettyPrint: true })
fs.writeFileSync('loan.xml',xml,{encoding:'utf8',flag:'w'})
// console.log(xml);
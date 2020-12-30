const loan = require('./assets/loan.json');
const { create } = require('xmlbuilder2');
const moment = require('moment')
const fs = require('fs');

let counter = 0;
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


// Assets - fileLOChekingSavingInfo
doc = doc.ele('ASSETS')
if (loan["fileLOChekingSavingInfo"] && Array.isArray(loan["fileLOChekingSavingInfo"]) && loan["fileLOChekingSavingInfo"].length > 0) {
  for (counter = 0; counter < loan["fileLOChekingSavingInfo"].length; counter++){
    const asset = loan["fileLOChekingSavingInfo"][counter];
    doc.ele("ASSET", {SquenceNumber: counter+1, 'xlink:label': `ASSET_${counter+1}`})
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

// Assets - Owned Properties - fileLOScheduleRealInfo
if (loan["fileLOScheduleRealInfo"] && Array.isArray(loan["fileLOScheduleRealInfo"]) && loan["fileLOScheduleRealInfo"].length > 0) {
  let ownedProperties = loan["fileLOScheduleRealInfo"].filter(x=> x.scheduleStatus && x.scheduleStatus !== "" && x.scheduleStatus !== 'Sold');
    for (let i = 0; i< ownedProperties.length; i++){
      const property = ownedProperties[i];
      doc.ele("ASSET", {SquenceNumber: counter + i +1, 'xlink:label': `ASSET_${counter + i+1}`})
         .ele("OWNED_PROPERTY")
         .ele("PROPERTY")
         .ele("ADDRESS")
         .ele("AddressLineText").txt(property.schedulePropAddr).up()
         .ele("AddressUnitIdentifier").txt('').up()
         .ele("CityName").txt(property.schedulePropCity).up()
         .ele("StateCode").txt(property.schedulePropState).up()
         .ele("PostalCode").txt(property.schedulePropZip).up()
         .ele("CountryCode").txt('USA').up()
         .up()
         .ele("PROPERTY_DETAIL")
          .ele("PropertyEstimatedValueAmount").txt(property.presentMarketValue).up()
          .ele("PropertyCurrentUsageType").txt(property.intendedOccupancy).up()
          .ele("PropertyUsageType").txt(property.intendedOccupancy).up()
          .ele("PropertyUsageTypeOtherDescription").txt('').up()
          .up()
          .up()
          .ele("OWNED_PROPERTY_DETAIL")
          // .ele("OwnedPropertySubjectIndicator").txt('').up()
          .ele("OwnedPropertyDispositionStatusType").txt(property.scheduleStatus).up()
          .ele("OwnedPropertyMaintenanceExpenseAmount").txt(property.insMaintTaxMisc).up()
          .ele("OwnedPropertyRentalIncomeGrossAmount").txt(property.grossRentalIncome).up()
          .ele("OwnedPropertyRentalIncomeNetAmount").txt(property.netRentalIncome).up()
          .ele("OwnedPropertyLienUPBAmount").txt(property.unpaidBalance).up()
         .up()
         .up()
    }
  
  doc = doc.up();
}



// Collaterals - fileLOScheduleRealInfo
doc.ele("COLLATERALS")
    .ele("COLLATERAL")
    .ele("SUBJECT_PROPERTY")
    .ele("ADDRESS")
    .ele("AddressLineText").txt(loan["LMRInfo"].propertyAddress).up()
    .ele("CityName").txt(loan["LMRInfo"].propertyCity).up()
    .ele("PostalCode").txt(loan["LMRInfo"].propertyZip).up()
    .ele("StateCode").txt(loan["LMRInfo"].propertyState).up()
    .up()
    .ele("PROPERTY_DETAIL")
    .ele("FinancedUnitCount").txt("1").up()
    .ele("PropertyEstateType").txt(loan["LMRInfo"].propertyType).up()
    .ele("PropertyEstimatedValueAmount").txt(loan["LMRInfo"].homeValue).up()
    // .ele("PropertyExistingCleanEnergyLienIndicator").txt("0").up()
    // .ele("PropertyInProjectIndicator").txt().up()
    .ele("PropertyMixedUsageIndicator").txt(loan["LMRInfo"].propertyType  === 'Commercial' ? "1": "0").up()
    // .ele("PropertyUsageType").txt().up()
    // .ele("PUDIndicator").txt().up()
    .up()
    .ele("SALES_CONTRACTS")
    .ele("SALES_CONTRACT")
    .ele("SALES_CONTRACT_DETAIL")
    .ele("SalesContractAmount").txt("unknown").up()
    .up()
    .up()
    .up()
    .up()
    .up()

// Expenses

// liabilities - contingentLiabilities
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
fs.writeFileSync('./output/mismo_loan.xml',xml,{encoding:'utf8',flag:'w'})
// console.log(xml);
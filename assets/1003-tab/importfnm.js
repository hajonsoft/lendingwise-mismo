const debug = false;

const borrowerConfig = [
  {
    selector: "#borrowerFName",
    value: (node) => getText(node, "INDIVIDUAL NAME FirstName"),
  },
  {
    selector: "#borrowerLName",
    value: (node) => getText(node, "INDIVIDUAL NAME LastName"),
  },
  {
    selector: "#borrowerMName",
    value: (node) => getText(node, "INDIVIDUAL NAME MiddleName"),
  },
  {
    selector: "#alternateFName_1",
    value: (node) => getText(node, "INDIVIDUAL ALIAS FirstName"),
  },
  {
    selector: "#alternateLName_1",
    value: (node) => getText(node, "INDIVIDUAL ALIAS LastName"),
  },
  {
    selector: "#alternateMName_1",
    value: (node) => getText(node, "INDIVIDUAL ALIAS MiddleName"),
  },
  {
    selector: "#borrowerDOB",
    value: (node) => {
      const dob = getText(
        node,
        "ROLES ROLE BORROWER BORROWER_DETAIL BorrowerBirthDate"
      );

      if (dob) {
        return formatDate(dob);
      }
    },
  },
  {
    selector: "#ssn",
    value: (node) =>
      getText(
        node,
        "TAXPAYER_IDENTIFIERS TAXPAYER_IDENTIFIER TaxpayerIdentifierType"
      ) === "SocialSecurityNumber" &&
      getText(
        node,
        "TAXPAYER_IDENTIFIERS TAXPAYER_IDENTIFIER TaxpayerIdentifierValue"
      ),
  },
  {
    selector: "#borrowerEmail",
    value: (node) => getText(node, "ContactPointEmailValue"),
  },
  {
    selector: "#phoneNumber",
    value: (node) => {
      const filtered = getWhere(
        node,
        "INDIVIDUAL CONTACT_POINTS CONTACT_POINT",
        "ContactPointRoleType",
        "Home"
      );
      return getText(filtered?.[0], "ContactPointTelephoneValue");
    },
  },
  {
    selector: "#cellNo",
    value: (node) => {
      const filtered = getWhere(
        node,
        "INDIVIDUAL CONTACT_POINTS CONTACT_POINT",
        "ContactPointRoleType",
        "Mobile"
      );
      return getText(filtered?.[0], "ContactPointTelephoneValue");
    },
  },
  {
    selector: "#workNumber",
    value: (node) => {
      const filtered = getWhere(
        node,
        "INDIVIDUAL CONTACT_POINTS CONTACT_POINT",
        "ContactPointRoleType",
        "Work"
      );
      return getText(filtered?.[0], "ContactPointTelephoneValue");
    },
  },
  {
    selector: "#presentAddress",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE",
        "BorrowerResidencyType",
        "Current"
      );
      return getText(filtered?.[0], "AddressLineText");
    },
  },
  {
    selector: "#presentUnit",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE",
        "BorrowerResidencyType",
        "Current"
      );
      return getText(filtered?.[0], "AddressUnitIdentifier");
    },
  },
  {
    selector: "#presentCity",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE",
        "BorrowerResidencyType",
        "Current"
      );
      return getText(filtered?.[0], "CityName");
    },
  },
  {
    selector: "#presentZip",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE",
        "BorrowerResidencyType",
        "Current"
      );
      return getText(filtered?.[0], "PostalCode");
    },
  },
  {
    selector: "#presentState",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE",
        "BorrowerResidencyType",
        "Current"
      );
      return getText(filtered?.[0], "StateCode");
    },
  },
  {
    selector: "#presentCountry",
    value: () => "US",
  },
  {
    selector: "#mailingAddress",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE Address",
        "AddressType",
        "Mailing"
      );
      return getText(filtered?.[0], "AddressLineText");
    },
  },
  {
    selector: "#mailingUnit",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE Address",
        "AddressType",
        "Mailing"
      );
      return getText(filtered?.[0], "AddressUnitIdentifier");
    },
  },
  {
    selector: "#mailingCity",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE Address",
        "AddressType",
        "Mailing"
      );
      return getText(filtered?.[0], "CityName");
    },
  },
  {
    selector: "#mailingZip",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE ADDRESS",
        "AddressType",
        "Mailing"
      );
      return getText(filtered?.[0], "PostalCode");
    },
  },
  {
    selector: "#mailingState",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE ADDRESS",
        "AddressType",
        "Mailing"
      );
      return getText(filtered?.[0], "StateCode");
    },
  },
  {
    selector: "#mailingCountry",
    value: () => "US",
  },
  {
    selector: "#borPresentPropType",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE",
        "BorrowerResidencyType",
        "Current"
      );
      return getText(filtered?.[0], "BorrowerResidencyBasisType");
    },
  },
  {
    selector: "#presentPropLengthMonths",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE",
        "BorrowerResidencyType",
        "Current"
      );
      return getText(filtered?.[0], "BorrowerResidencyDurationMonthsCount");
    },
  },
  {
    selector: "#numberOfDependents",
    value: (node) => getText(node, "BORROWER_DETAIL DependentCount"),
  },
  {
    selector: "#maritalStatus_2",
    value: (node) => getText(node, "MaritalStatusType") === "Married",
  },
  {
    selector: "#maritalStatus_1",
    value: (node) => getText(node, "MaritalStatusType") === "Unmarried",
  },
  {
    selector: "#maritalStatus_2",
    value: (node) => getText(node, "MaritalStatusType") === "Separated",
  },
  {
    selector: "#borrowerCitizenship_0",
    value: (node) => getText(node, "MaritalStatusType") === "USCitizen",
  },
  {
    selector: "#isBorUSCitizenYes",
    value: (node) => getText(node, "MaritalStatusType") === "USCitizen",
  },
  {
    selector: "#isBorUSCitizenNo",
    value: (node) => getText(node, "MaritalStatusType") !== "USCitizen",
  },
  {
    selector: "#borrowerCitizenship_1",
    value: (node) => getText(node, "MaritalStatusType") !== "USCitizen",
  },
  {
    selector: "#isBorDecalredBankruptPastYearsYes",
    value: (node) => getText(node, "BankruptcyIndicator") === "true",
  },
  {
    selector: "#isBorDecalredBankruptPastYearsNO",
    value: (node) => getText(node, "BankruptcyIndicator") !== "true",
  },
  {
    selector: "#isAnyBorOutstandingJudgementsYes",
    value: (node) => getText(node, "OutstandingJudgmentsIndicator") === "true",
  },
  {
    selector: "#isAnyBorOutstandingJudgementsNo",
    value: (node) => getText(node, "OutstandingJudgmentsIndicator") !== "true",
  },
  {
    selector: "#hasBorAnyActiveLawsuitsYes",
    value: (node) => getText(node, "PartyToLawsuitIndicator") === "true",
  },
  {
    selector: "#hasBorAnyActiveLawsuitsNo",
    value: (node) => getText(node, "PartyToLawsuitIndicator") !== "true",
  },
  {
    selector: "#isBorPresenltyDelinquentYes",
    value: (node) => getText(node, "PresentlyDelinquentIndicator") === "true",
  },
  {
    selector: "#isBorPresenltyDelinquentNo",
    value: (node) => getText(node, "PresentlyDelinquentIndicator") !== "true",
  },
  {
    selector: "#borResidedPresentAddrNo",
    value: (node) => true,
  },
  {
    selector: "#BRace5",
    value: (node) => getText(node, "HMDARaceType") === "White",
  },
  {
    selector: "#previouslyHadShortSaleYes",
    value: (node) =>
      getText(node, "PriorPropertyShortSaleCompletedIndicator") === "true",
  },
  {
    selector: "#previouslyHadShortSaleNo",
    value: (node) =>
      getText(node, "PriorPropertyShortSaleCompletedIndicator") !== "false",
  },
  {
    selector: "#hasBorBeenForeclosedYes",
    value: (node) =>
      getText(node, "PriorPropertyForeclosureCompletedIndicator") === "true",
  },
  {
    selector: "#hasBorBeenForeclosedNo",
    value: (node) =>
      getText(node, "PriorPropertyForeclosureCompletedIndicator") !== "false",
  },
  {
    selector: "#grossIncome1",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "Base"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
  },
  {
    selector: "#commissionOrBonus1",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "Bonus"
      );
      console.log(
        "%cMyProject%cline:275%cfiltered",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
        filtered
      );

      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
  },
  {
    selector: "#otherHouseHold1",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "Other"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
  },
  {
    selector: "#overtime1",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "Overtime"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
  },
  {
    selector: "#militaryIncome1",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "MilitaryBasePay"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
  },
  {
    selector: "#militaryIncome1",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "MilitaryBasePay"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
  },
  {
    selector: "#netRental1",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "NetRentalIncome"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
  },
  {
    selector: "#netEarnedInterest1",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "DividendsInterest"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
  },
];

const subjectPropertyConfig = [
  {
    selector: "#propertyAddress",
    value: (node) => getText(node, "AddressLineText"),
  },
  // {
  //   selector: "#propertyUnit",
  //   value: (node) => getText(node, "unit"),
  // },
  {
    selector: "#propertyCity",
    value: (node) => getText(node, "CityName"),
  },
  {
    selector: "#propertyState",
    value: (node) => getText(node, "StateCode"),
  },
  {
    selector: "#propertyZip",
    value: (node) => getText(node, "PostalCode"),
  },
  {
    selector: "#propertyCountry",
    value: (node) => "US",
  },
  // TODO: map property type
  {
    selector: "#propertyType",
    value: (node) => getText(node, "AttachmentType"),
  },
  {
    selector: "#noUnitsOccupied",
    value: (node) => getText(node, "FinancedUnitCount"),
  },
  {
    selector: "#propertyValue",
    value: (node) => getText(node, "PropertyEstimatedValueAmount"),
  },
  {
    selector: "#presentOccupancy",
    value: (node) => getText(node, "PropertyUsageType"),
  },
];

function handleImportChange(e) {
  let file = e.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    importToPage(reader.result);
  };
  reader.readAsText(file);
}

const adminConfig = [];

const assetsConfig = [
  {
    selector: "#assetSavingMoneyMarket",
    value: (data) => getAssetTotal(data, "SavingsAccount"),
  },
  {
    selector: "#assetCheckingAccounts",
    value: (data) => getAssetTotal(data, "CheckingAccount"),
  },
  {
    selector: "#assetIRAAccounts",
    value: (data) => getAssetTotal(data, "RetirementFund"),
  },
  {
    selector: "#assetCash",
    value: (data) => getAssetTotal(data, "CashOnHand"),
  },
  {
    selector: "#networthOfBusinessOwned",
    value: (data) => getAssetTotal(data, "NetWorthOfBusinessOwned"),
  },
  {
    selector: "#assetLifeInsurance",
    value: (data) => getAssetTotal(data, "LifeInsurance"),
  },
  {
    selector: "#assetHome",
    value: (data) => getAssetTotal(data, "BorrowerPrimaryHome"),
  },
  {
    selector: "#assetStocks",
    value: (data) => getAssetTotal(data, "StockOptions"),
  },
  {
    selector: "#assetStocksOwed",
    value: (data) => getAssetTotal(data, "Stock"),
  },
  {
    selector: "#assetCars",
    value: (data) =>
      getAssetTotal(data, "Automobile") +
      getAssetTotal(data, "RecreationalVehicle"),
  },
  {
    selector: "#otherAssets",
    value: (data) => getAssetTotal(data, "Other"),
  },
  {
    comments: `
    Asset types in AssetEnum not used
    Annuity
Boat
Bond
BorrowerEstimatedTotalAssets
BridgeLoanNotDeposited
CertificateOfDepositTimeDeposit
EarnestMoneyCashDepositTowardPurchase
EmployerAssistance
GiftOfCash
GiftOfPropertyEquity
GiftsTotal
Grant
IndividualDevelopmentAccount
MoneyMarketFund
MutualFund
PendingNetSaleProceedsFromRealEstateAssets
ProceedsFromSaleOfNonRealEstateAsset
ProceedsFromSecuredLoan
ProceedsFromUnsecuredLoan
RealEstateOwned
RelocationMoney
SaleOtherAssets
SavingsBond
SeverancePackage
TrustAccount
`,
  },
];

const assetConfig = [
  {
    selector: "#account",
    value: (asset) =>
      asset.querySelector("assetaccountidentifier")?.textContent,
  },
  {
    selector: "#accountType",
    value: (asset) =>
      getLWAssetType(asset.querySelector("assettype")?.textContent),
  },
  {
    selector: "#nameofInstitution",
    value: (asset) => asset.querySelector("fullname")?.textContent,
  },
  {
    selector: "#balanceValue",
    value: (asset) =>
      asset.querySelector("assetcashormarketvalueamount")?.textContent,
  },
];

const currentEmployerConfig = [
  {
    selector: "#occupation1",
    value: (node) =>
      node.querySelector("EmploymentPositionDescription")?.textContent,
  },
  {
    selector: "#borrowerHireDate",
    value: (node) => {
      const hireDate = node.querySelector("EmploymentStartDate")?.textContent;
      return hireDate ? formatDate(hireDate) : "";
    },
  },
  {
    selector: "#employer1",
    value: (employer) =>
      employer.querySelector("LEGAL_ENTITY_DETAIL FullName")?.textContent,
  },
  {
    selector: "#employer1Add",
    value: (employer) =>
      employer.querySelector("address AddressLineText")?.textContent,
  },
  {
    selector: "#employer1City",
    value: (employer) =>
      employer.querySelector("address CityName")?.textContent,
  },
  {
    selector: "#employer1Zip",
    value: (employer) =>
      employer.querySelector("address PostalCode")?.textContent?.substr(0, 5),
  },
  {
    selector: "#employer1State",
    value: (employer) =>
      employer.querySelector("address StateCode")?.textContent,
  },
  {
    selector: "#employerPhone1",
    value: (employer) =>
      employer.querySelector("ContactPointTelephoneValue")?.textContent,
  },
];

const prevEmployerConfig = [
  {
    selector: "#AddiontalEmplInfo_{counter}_addOrPrevJob",
    value: () => "previous",
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_nameOfEmployer",
    value: (employer) =>
      employer.querySelector("LEGAL_ENTITY_DETAIL FullName")?.textContent,
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_addrOfEmployer",
    value: (employer) =>
      employer.querySelector("address AddressLineText")?.textContent,
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_cityOfEmployer",
    value: (employer) =>
      employer.querySelector("address CityName")?.textContent,
  },
  // Get the correct selector for the zip code and state
  {
    selector: "#AddiontalEmplInfo_{counter}_zipOfEmployer",
    value: (employer) =>
      employer.querySelector("address PostalCode")?.textContent,
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_stateOfEmployer",
    value: (employer) =>
      employer.querySelector("address StateCode")?.textContent,
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_employedFrom",
    value: (employer) => {
      const hireDate = getText(employer, "EmploymentStartDate");

      if (hireDate) {
        return formatDate(hireDate);
      }
    },
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_monthlyIncome",
    value: (employer) =>
      employer.querySelector("EmploymentMonthlyIncomeAmount")?.textContent,
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_employedByOtherParty",
    value: (employer) =>
      employer.querySelector("SpecialBorrowerEmployerRelationshipIndicator")
        ?.textContent === "true",
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_position",
    value: (employer) =>
      employer.querySelector("EmploymentPositionDescription")?.textContent,
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_businessPhone",
    value: (employer) =>
      employer.querySelector("ContactPointTelephoneValue")?.textContent,
  },
];

const liabilitiesConfig = [];
const collateralsConfig = [];
const loansConfig = [
  {
    selector: "#loanNumber",
    type: "text",
    value: (data) => data.querySelector("LoanIdentifier")?.textContent,
  },
];
const partiesConfig = [];
const relationshipsConfig = [];

function getAssetTotal(data, assetType) {
  const total = Array.from(data)
    .filter(
      (asset) =>
        asset.querySelector("asset_detail assetType").textContent === assetType
    )
    .reduce(
      (acc, asset) =>
        acc +
        parseFloat(
          asset.querySelector("ASSET_DETAIL AssetCashOrMarketValueAmount")
            .textContent
        ),
      0.0
    );

  return total ?? 0.0;
}

function getLWAssetType(assetType) {
  // TODO - review this mapping
  switch (assetType) {
    case "SavingsAccount":
      return "Savings";
    case "CheckingAccount":
      return "Checking";
    case "RetirementFund":
      return "IRA";
    case "CashOnHand":
      return "Cash";
    case "NetWorthOfBusinessOwned":
      return "Business";
    case "LifeInsurance":
      return "Life Insurance";
    case "BorrowerPrimaryHome":
      return "Home";
    case "StockOptions":
      return "Stocks";
    case "Stock":
      return "Stocks Owed";
    case "Automobile":
      return "Car";
    case "RecreationalVehicle":
      return "RV";
    case "Other":
      return "Other";
    default:
      return "Other";
  }
}

function formatDate(date) {
  const [year, month, day] = date.split("-");
  return `${month}/${day}/${year}`;
}

function getText(node, path) {
  console.log(node,path)
  if (!node || (Array.isArray(node) && node.length === 0)) {
    console.log(path, "not found in undefined getText");
    return;
  }

  let valueNode;
  if (Array.isArray(node)) {
    valueNode = node?.[0];
  } else {
    valueNode = node;
  }
  return valueNode.querySelector(path)?.textContent;
}

function getWhere(node, path, where, value) {
  if (!node) {
    console.log(path, "not found in undefined getWhere");
    return;
  }
  const filtered = Array.from(node.querySelectorAll(path)).filter(
    (el) => el.querySelector(where)?.textContent === value
  );

  return filtered;
}

function getAssets() {
  return Array.from(document.querySelectorAll("#onsoft ASSET"));
}

function getEmployers() {
  return Array.from(
    document.querySelectorAll("#onsoft BORROWER EMPLOYERS EMPLOYER")
  );
}

function getLiabilities(data) {
  return Array.from(document.querySelectorAll("#onsoft LIABILITIES LIABILITY"));
}

function getCollaterals(data) {
  return Array.from(
    document.querySelectorAll("#onsoft COLLATERALS COLLATERAL")
  );
}

function getLoan() {
  // Make sure the loan type is "LenderLoan" or whatever is the correct loan type
  // You can get if there is a coborrower using BorrowerCount in amazing.xml
  return document.querySelector("#onsoft LOAN");
}

function getParties(data) {
  return Array.from(document.querySelectorAll("#onsoft PARTIES PARTY"));
}

function getBorrowerParty() {
  const borrower = Array.from(document.querySelectorAll("#onsoft PARTY")).find(
    (party) => party.querySelector("PartyRoleType").textContent === "Borrower"
  );
  return borrower;
}

function getCoBorrowerParty() {
  const isCoBorrower =
    Array.from(document.querySelectorAll("#onsoft PARTY")).filter(
      (party) => party.querySelector("PartyRoleType").textContent === "Borrower"
    ).length > 1;
  if (isCoBorrower) {
    return Array.from(document.querySelectorAll("#onsoft PARTY")).filter(
      (party) => party.querySelector("PartyRoleType").textContent === "Borrower"
    )[1];
  }

  const coSigner = Array.from(document.querySelectorAll("#onsoft PARTY")).find(
    (party) => party.querySelector("PartyRoleType").textContent === "CoSigner"
  );
  return coSigner;
}

function getSubjectProperty() {
  return document.querySelector("#onsoft COLLATERALS COLLATERAL SUBJECT_PROPERTY");
}


function createAssetFields(assets) {
  for (let i = 0; i < assets.length - 1; i++) {
    setTimeout(() => {
      const addNewSelector = `#financeAndSecuritie${
        i === 0 ? "" : "_" + i
      } > div:nth-child(4) > div:nth-child(5) > div > span > a.btn.btn-sm.btn-success.btn-text-primary.btn-icon.ml-2.tooltipClass`;
      document.querySelector(addNewSelector)?.click();
    }, 1000 * i);
  }
}

function createEmployerFields(employers) {
  for (let i = 2; i < employers.length - 1; i++) {
    setTimeout(() => {
      const addNewSelector = `#hideAddnlEmpInfo > a.btn.btn-sm.btn-success.btn-text-primary.btn-icon.ml-2.tooltipClass.cloneFormButton`;
      document.querySelector(addNewSelector)?.click();
    }, 10 * i);
  }
}

function publishConfigItems(config, items, selectorFunction) {
  for (let i = 0; i < items.length; i++) {
    setTimeout(() => {
      const item = items[i];
      for (const configItem of config) {
        let selector;
        if (selectorFunction) {
          selector = selectorFunction(i, configItem.selector);
        } else {
          selector = `${configItem.selector}_${i}`;
        }
        const value = configItem.value(item);
        const type = configItem.type ?? "text";
        console.log(item, selector, value, type);
        const element = document.querySelector(selector);
        if (element) {
          if (type === "text") {
            element.value = value;
          } else if (type === "select") {
            element.value = value;
            element.dispatchEvent(new Event("change"));
          }
        } else {
          console.log("element not found", selector);
        }
      }
    }, 1000 * i);
  }
}

function importToPage(fnmFile) {
  attachXml(fnmFile);
  const borrower = getBorrowerParty();
  publishConfig(borrowerConfig, borrower);

  const assets = getAssets();
  // const liabilities = getLiabilities();
  // const collaterals = getCollaterals();
  // const parties = getParties();

  // publishConfig(adminConfig, lendingWiseObject);
  createAssetFields(assets);
  publishConfigItems(assetConfig, assets);
  // Employers
  const employers = getEmployers(borrower);
  const currentEmployer = employers.filter(
    (employer) => getText(employer, "EmploymentStatusType") === "Current"
  )[0];
  const previousEmployers = employers.filter(
    (employer) => getText(employer, "EmploymentStatusType") !== "Current"
  );
  createEmployerFields(employers);
  publishConfig(currentEmployerConfig, currentEmployer);
  publishConfigItems(prevEmployerConfig, previousEmployers, (i, selector) =>
    selector.replace("{counter}", i + 1)
  );

  publishConfig(assetsConfig, assets);
  // publishConfig(liabilitiesConfig, liabilities);
  // publishConfig(collateralsConfig, collaterals);
  const loan = getLoan();
  publishConfig(loansConfig, loan);
  // publishConfig(partiesConfig, parties);

  const subjectProperty = getSubjectProperty();
  publishConfig(subjectPropertyConfig, subjectProperty);

}

function attachXml(fnmFile) {
  const divElement = document.createElement("div");
  divElement.style.display = "none";
  divElement.id = "onsoft";
  divElement.innerHTML = fnmFile;

  const parentElem = document.querySelector(
    "#loanModForm > div.borrowerInfoSection > div > div.card-header.card-header-tabs-line.bg-gray-100 > div.card-title > h3"
  ).parentElement;
  parentElem.insertBefore(divElement, parentElem.firstChild);
}

function publishConfig(config, data) {
  if (debug) {
    writeCode(config, data);
  }
  config.forEach((_config) => {
    const element = document.querySelector(_config.selector);
    if (!element) {
      console.log("Element not found", `selector: ${_config.selector}`);
      return;
    }
    const value = _config.value(data);
    if (debug) {
      console.log(_config.selector, value);
    }
    if (!value) {
      return;
    }

    if (element.type === "checkbox" || element.type === "radio") {
      element.checked = value;
    } else {
      if (debug) {
        element.maxLength = 0;
      }
      element.value = debug ? `${value}.${_config.selector}(c)` : value;
    }
  });
}

function writeCode(config, data) {
  console.log("config", config);
  console.log("data", data);
  document.querySelectorAll("input").forEach((input) => {
    if (
      input.id &&
      input.type !== "file" &&
      input.type !== "button" &&
      input.type !== "hidden" &&
      input.type !== "search" &&
      input.id.length > 3
    ) {
      try {
        if (input.type === "checkbox" || input.type === "radio") {
          // document.getElementById(input.id).nextElementSibling.outerHTML = `<div style="width: 100px;margin-left: 10px;margin-right: 10px;">${input.id}</div>`;
        } else if (input.type === "text") {
          input.value = "#" + input.id;
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}

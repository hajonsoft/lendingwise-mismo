const adminConfig = [];

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
    selector: "#borrowerDOB",
    value: (node) => {
      const dob = getText(
        node,
        "ROLES ROLE BORROWER BORROWER_DETAIL BorrowerBirthDate"
      )?.split("-");

      if (dob) {
        return `${dob[1]}/${dob[2]}/${dob[0]}`;
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
  // // Check the value in mismo standard for permenant residence card
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
        "CURRENT_INCOME_ITEMS",
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
        "CURRENT_INCOME_ITEMS",
        "IncomeType",
        "Bonus"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
  },
  {
    selector: "#otherHouseHold1",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEMS",
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
        "CURRENT_INCOME_ITEMS",
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
        "CURRENT_INCOME_ITEMS",
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
        "CURRENT_INCOME_ITEMS",
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
        "CURRENT_INCOME_ITEMS",
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
        "CURRENT_INCOME_ITEMS",
        "IncomeType",
        "DividendsInterest"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
  },
];

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
const liabilitiesConfig = [];
const collateralsConfig = [];
const loansConfig = [
  {
    selector: "#loanNumber",
    type: "text",
    value: (data) => data.LOAN_IDENTIFIERS.LOAN_IDENTIFIER.LoanIdentifier,
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

function getText(node, path) {
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

function bootstrap() {
  const inputElement = document.createElement("input");
  inputElement.type = "file";
  inputElement.onchange = function () {
    let file = this.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      importToPage(reader.result);
    };
    reader.readAsText(file);
  };

  const parentElem = document.querySelector(
    "#branchId_container"
  ).parentElement;
  parentElem.insertBefore(inputElement, parentElem.firstChild);
}

function getAssets() {
  return Array.from(document.querySelectorAll("#onsoft ASSET"));
}

function getLiabilities(data) {
  return data.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.LIABILITIES?.LIABILITY;
}

function getCollaterals(data) {
  return data.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.COLLATERALS?.COLLATERAL;
}

function getLoans(data) {
  // Make sure the loan type is "LenderLoan" or whatever is the correct loan type
  return data.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.LOANS?.LOAN;
}

function getParties(data) {
  return data.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.PARTIES?.PARTY;
}

function getBorrowerParty() {
  // TODO: handle multiple borrowers
  const borrower = Array.from(document.querySelectorAll("#onsoft PARTY")).find(
    (party) => party.querySelector("PartyRoleType").textContent === "Borrower"
  );
  return borrower;
}

function importToPage(fnmFile) {
  const divElement = document.createElement("div");
  divElement.style.display = "none";
  divElement.id = "onsoft";
  divElement.innerHTML = fnmFile;

  const parentElem = document.querySelector(
    "#branchId_container"
  ).parentElement;
  parentElem.insertBefore(divElement, parentElem.firstChild);

  const borrower = getBorrowerParty();
  const assets = getAssets();
  // const liabilities = getLiabilities();
  // const collaterals = getCollaterals();
  // const loans = getLoans();
  // const parties = getParties();

  // publishConfig(adminConfig, lendingWiseObject);
  publishConfig(borrowerConfig, borrower);
  publishConfig(assetsConfig, assets);
  // publishConfig(liabilitiesConfig, liabilities);
  // publishConfig(collateralsConfig, collaterals);
  // publishConfig(loansConfig, loans);
  // publishConfig(partiesConfig, parties);
}

function publishConfig(config, data, debug = false) {
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
bootstrap();

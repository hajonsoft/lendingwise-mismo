const { create } = require("xmlbuilder2");
const moment = require("moment");

const debug = false;

const borrowerConfig = [
  {
    selector: "#borrowerFName",
    value: (node) => getText(node, "INDIVIDUAL NAME FirstName"),
    exportTo: "INDIVIDUAL NAME FirstName",
  },
  {
    selector: "#borrowerLName",
    value: (node) => getText(node, "INDIVIDUAL NAME LastName"),
    exportTo: "INDIVIDUAL NAME LastName",
  },
  {
    selector: "#borrowerMName",
    value: (node) => getText(node, "INDIVIDUAL NAME MiddleName"),
    exportTo: "INDIVIDUAL NAME MiddleName",
  },
  {
    selector: "#alternateFName_1",
    value: (node) => getText(node, "INDIVIDUAL ALIAS FirstName"),
    exportTo: "INDIVIDUAL ALIAS FirstName",
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
    exportTo: "ROLES ROLE BORROWER BORROWER_DETAIL BorrowerBirthDate",
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
    exportTo: "TAXPAYER_IDENTIFIERS TAXPAYER_IDENTIFIER TaxpayerIdentifierValue",
  },
  {
    selector: "#borrowerEmail",
    value: (node) => getText(node, "ContactPointEmailValue"),
    exportTo: "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_EMAIL ContactPointEmailValue",
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
    value: (node) => getText(node, "CitizenshipResidencyType") === "USCitizen",
  },
  {
    selector: "#isBorUSCitizenNo",
    value: (node) => getText(node, "CitizenshipResidencyType") !== "USCitizen",
  },
  {
    selector: "#borrowerCitizenship_1",
    value: (node) => getText(node, "CitizenshipResidencyType") !== "USCitizen",
  },
  // TODO: Read veteran status from XML
  {
    selector: "#isServicingMember_1",
    value: (node) => false,
  },
  {
    selector: "#isServicingMember_2",
    value: (node) => true,
  },
  {
    selector: [
      "#additionalPropertyRestrictionsYes",
      "#additionalPropertyRestrictionsNo",
    ],
    value: (node) =>
      getText(node, "PropertyProposedCleanEnergyLienIndicator") === "true",
  },
  {
    selector: [
      "#isBorDecalredBankruptPastYearsYes",
      "#isBorDecalredBankruptPastYearsNo",
    ],
    value: (node) => getText(node, "BankruptcyIndicator") === "true",
  },
  {
    selector: [
      "#isBorIntendToOccupyPropAsPRIYes",
      "#isBorIntendToOccupyPropAsPRINo",
    ],
    value: (node) => getText(node, "IntentToOccupyType") === "Yes",
  },
  {
    selector: [
      "#hasBorObligatedInForeclosureYes",
      "#hasBorObligatedInForeclosureNo",
    ],
    value: (node) =>
      getText(node, "PriorPropertyForeclosureCompletedIndicator") === "true",
  },
  {
    selector: ["#hasBorBeenForeclosedYes", "#hasBorBeenForeclosedNo"],
    value: (node) =>
      getText(node, "PriorPropertyForeclosureCompletedIndicator") === "true",
  },
  {
    selector: [
      "#isAnyBorOutstandingJudgementsYes",
      "#isAnyBorOutstandingJudgementsNo",
    ],
    value: (node) =>
      getText(node, "PriorPropertyForeclosureCompletedIndicator") === "true",
  },
  {
    selector: ["#hasBorAnyActiveLawsuitsYes", "#hasBorAnyActiveLawsuitsNo"],
    value: (node) => getText(node, "PartyToLawsuitIndicator") === "true",
  },
  {
    selector: ["#isBorPresenltyDelinquentYes", "#isBorPresenltyDelinquentNo"],
    value: (node) => getText(node, "PresentlyDelinquentIndicator") === "true",
  },
  {
    selector: "#borResidedPresentAddrNo",
    value: (node) => true,
  },
  {
    selector: "#PublishBInfoYes",
    value: (node) => true,
  },
  {
    selector: "#BRace5",
    value: (node) => getText(node, "HMDARaceType") === "White",
  },
  {
    selector: "#BGendeMale",
    // value: (node) => getText(node, "HMDAGenderType") === "Male",
    value: (node) =>
      xmlText.includes(`<ULAD:HMDAGenderType>Male</ULAD:HMDAGenderType>`),
  },
  {
    selector: "#BGendeFemale",
    value: (node) =>
      xmlText.includes(`<ULAD:HMDAGenderType>Female</ULAD:HMDAGenderType>`),
  },
  {
    selector: "#BEthnicityH",
    value: (node) => getText(node, "HMDAEthnicityOriginType") === "Mexican",
  },
  {
    selector: "#BGenderNotDis",
    value: (node) =>
      getText(node, "HMDAGenderRefusalIndicator") === "true" &&
      !xmlText.includes(`<ULAD:HMDAGenderType>Male</ULAD:HMDAGenderType>`) &&
      !xmlText.includes(`<ULAD:HMDAGenderType>Female</ULAD:HMDAGenderType>`),
  },
  {
    selector: "#BEthnicityND",
    value: (node) => getText(node, "HMDAEthnicityRefusalIndicator") === "true",
  },
  {
    selector: "#BRace6",
    value: (node) => getText(node, "HMDARaceRefusalIndicator") === "true",
  },
  {
    selector: "#previouslyHadShortSaleYes",
    value: (node) =>
      getText(node, "PriorPropertyShortSaleCompletedIndicator") === "true",
  },
  {
    selector: "#previouslyHadShortSaleNo",
    value: (node) =>
      getText(node, "PriorPropertyShortSaleCompletedIndicator") === "false",
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
  {
    selector: "#isHouseProperty",
    value: (node) => getLWOccupancy(getText(node, "PriorPropertyUsageType")),
  },
];

const moreBorrowerConfig = [
  {
    selector: "#bFiEthnicitySubMexi",
    value: (node) => getText(node, "HMDAEthnicityOriginType") === "Mexican",
  },
];

const coBorrowerConfig = [
  {
    selector: "#coBorrowerFName",
    value: (node) => getText(node, "INDIVIDUAL NAME FirstName"),
  },
  {
    selector: "#coBorrowerLName",
    value: (node) => getText(node, "INDIVIDUAL NAME LastName"),
  },
  {
    selector: "#coBorrowerDOB",
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
    selector: "#coBSsnNumber",
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
    selector: "#coBorrowerEmail",
    value: (node) => getText(node, "ContactPointEmailValue"),
  },
  {
    selector: "#coBPhoneNumber",
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
    selector: "#coBCellNumber",
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
    selector: "#coBFax",
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
    selector: "#coBPresentAddress",
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
    selector: "#coBPresentCity",
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
    selector: "#coBPresentZip",
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
    selector: "#coBPresentState",
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
    selector: "#coBorrowerMailingAddress",
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
    selector: "#coBorrowerMailingCity",
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
    selector: "#coBorrowerMailingZip",
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
    selector: "#coBorrowerMailingState",
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
    selector: "#coBorrowerCitizenship_1",
    value: (node) => getText(node, "MaritalStatusType") === "USCitizen",
  },
  {
    selector: "#coBorrowerCitizenship_2",
    value: (node) => getText(node, "CitizenshipResidencyType") !== "USCitizen",
  },
];

const moreCoBorrowerConfig = [
  {
    selector: "#bFiEthnicitySubMexi",
    value: (node) => getText(node, "HMDAEthnicityOriginType") === "Mexican",
  },
];

const loanOriginatorConfig = [
  {
    selector: "#loOrganizationName",
    value: (node) =>
      getText(node, "INDIVIDUAL NAME FirstName") +
      " " +
      getText(node, "INDIVIDUAL NAME LastName"),
  },
  {
    selector: "#loOriginatorEmail",
    value: (node) => getText(node, "ContactPointEmailValue"),
  },
  {
    selector: "#loOriginatorPhone",
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
    selector: "#loOrganizationAddress",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE",
        "BorrowerResidencyType",
        "Current"
      );
      return (
        getText(filtered?.[0], "AddressLineText") +
        " " +
        getText(filtered?.[0], "CityName") +
        " " +
        getText(filtered?.[0], "StateCode") +
        " " +
        getText(filtered?.[0], "PostalCode")
      );
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
let xmlText = "";
function handleImportChange(e) {
  let file = e.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    xmlText = reader.result;
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
      asset.querySelector("assetaccountidentifier")?.textContent || "",
  },
  {
    selector: "#accountType",
    value: (asset) =>
      getLWAssetType(
        asset.querySelector("assettype")?.textContent ||
          asset.querySelector("PurchaseCreditType")?.textContent
      ),
  },
  {
    selector: "#nameofInstitution",
    value: (asset) => asset.querySelector("fullname")?.textContent || "",
  },
  {
    selector: "#balanceValue",
    value: (asset) =>
      asset.querySelector("assetcashormarketvalueamount")?.textContent ||
      asset.querySelector("PurchaseCreditAmount")?.textContent,
  },
];

const reoConfig = [
  {
    selector: "#schedulePropAddr",
    value: (asset) => asset.querySelector("AddressLineText")?.textContent || "",
  },
  {
    selector: "#schedulePropCity",
    value: (asset) => asset.querySelector("CityName")?.textContent || "",
  },
  {
    selector: "#schedulePropZip",
    value: (asset) => asset.querySelector("PostalCode")?.textContent || "",
  },
  {
    selector: "#schedulePropState",
    value: (asset) => asset.querySelector("StateCode")?.textContent || "",
  },
  {
    selector: "#schedulePropCountry",
    value: () => "US",
  },
  {
    selector: "#propType",
    value: (asset) =>
      getLWPropertyType(
        asset.querySelector("propcurrentusagetype")?.textContent
      ),
  },
  {
    selector: "#presentMarketValue",
    value: (asset) =>
      asset.querySelector("PropertyEstimatedValueAmount")?.textContent || "",
  },
  {
    selector: "#grossRentalIncome",
    value: (asset) =>
      asset.querySelector("OwnedPropertyRentalIncomeNetAmount")?.textContent,
  },
];

const currentEmployerConfig = [
  {
    selector: "#occupation1",
    value: (node) =>
      node?.querySelector("EmploymentPositionDescription")?.textContent,
  },
  {
    selector: "#borrowerHireDate",
    value: (node) => {
      const hireDate = node?.querySelector("EmploymentStartDate")?.textContent;
      return hireDate ? formatDate(hireDate) : "";
    },
  },
  {
    selector: "#employer1",
    value: (employer) =>
      employer?.querySelector("LEGAL_ENTITY_DETAIL FullName")?.textContent,
  },
  {
    selector: "#employer1Add",
    value: (employer) =>
      employer?.querySelector("address AddressLineText")?.textContent,
  },
  {
    selector: "#employer1City",
    value: (employer) =>
      employer?.querySelector("address CityName")?.textContent,
  },
  {
    selector: "#employer1Zip",
    value: (employer) =>
      employer?.querySelector("address PostalCode")?.textContent?.substr(0, 5),
  },
  {
    selector: "#employer1State",
    value: (employer) =>
      employer?.querySelector("address StateCode")?.textContent,
  },
  {
    selector: "#employerPhone1",
    value: (employer) =>
      employer?.querySelector("ContactPointTelephoneValue")?.textContent,
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
      employer?.querySelector("LEGAL_ENTITY_DETAIL FullName")?.textContent,
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_addrOfEmployer",
    value: (employer) =>
      employer?.querySelector("address AddressLineText")?.textContent,
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_cityOfEmployer",
    value: (employer) =>
      employer?.querySelector("address CityName")?.textContent,
  },
  // Get the correct selector for the zip code and state
  {
    selector: "#AddiontalEmplInfo_{counter}_zipOfEmployer",
    value: (employer) =>
      employer?.querySelector("address PostalCode")?.textContent,
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_stateOfEmployer",
    value: (employer) =>
      employer?.querySelector("address StateCode")?.textContent,
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
      employer?.querySelector("EmploymentMonthlyIncomeAmount")?.textContent,
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_employedByOtherParty",
    value: (employer) =>
      employer?.querySelector("SpecialBorrowerEmployerRelationshipIndicator")
        ?.textContent === "true",
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_position",
    value: (employer) =>
      employer?.querySelector("EmploymentPositionDescription")?.textContent,
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_businessPhone",
    value: (employer) =>
      employer?.querySelector("ContactPointTelephoneValue")?.textContent,
  },
];

const liabilitiesConfig = [
  {
    selector: "#accountNo",
    value: (liability) =>
      liability?.querySelector("LiabilityAccountIdentifier")?.textContent,
  },
  {
    selector: "#liabilityAccType",
    value: (liability) =>
      getLWLiabilityType(
        liability?.querySelector("LiabilityType")?.textContent
      ),
  },
  {
    selector: "#nameAddrOfCompany",
    value: (liability) =>
      liability?.querySelector("LIABILITY_HOLDER FullName")?.textContent,
  },
  {
    selector: "#monthlyPaymentExpenses",
    value: (liability) =>
      liability?.querySelector("LiabilityMonthlyPaymentAmount")?.textContent,
  },
  {
    selector: "#monthsLeftToPays",
    value: (liability) =>
      liability?.querySelector("LiabilityRemainingTermMonthsCount")
        ?.textContent,
  },
  {
    selector: "#unpaidBalanceExpenses",
    value: (liability) =>
      liability?.querySelector("LiabilityUnpaidBalanceAmount")?.textContent,
  },
];
const collateralsConfig = [];
const loansConfig = [
  {
    selector: "#loanNumber",
    type: "text",
    value: (data) => data?.querySelector("LoanIdentifier")?.textContent,
  },
  {
    selector: "amortizationTypeFixed",
    type: "radio",
    value: (data) =>
      data?.querySelector("AmortizationType")?.textContent === "Fixed",
  },
  {
    selector: "amortizationTypeAdjust",
    type: "radio",
    value: (data) =>
      data?.querySelector("AmortizationType")?.textContent !== "Adjustable",
  },
  {
    selector: "#lien1Terms",
    value: (data) => {
      const period = data?.querySelector(
        "LoanAmortizationPeriodCount"
      )?.textContent;
      const periodType = data?.querySelector(
        "LoanAmortizationPeriodType"
      )?.textContent;
      if (period && periodType === "Month") {
        return `${parseInt(period) / 12} Years`;
      }
      return period;
    },
  },
  {
    selector: "#otherMortgage1",
    value: (data) => {
      const allExpenses = Array.from(
        data?.querySelectorAll("HousingExpensePaymentAmount")
      );
      if (allExpenses) {
        const total = allExpenses.reduce(
          (acc, expense) => acc + parseFloat(expense?.textContent),
          0
        );
        return total;
      }
      return 0;
    },
  },
];
const partiesConfig = [];
const relationshipsConfig = [];

function getAssetTotal(data, assetType) {
  const total = Array.from(data)
    .filter(
      (asset) =>
        asset.querySelector("asset_detail assetType") &&
        asset.querySelector("asset_detail assetType").textContent === assetType
    )
    .reduce(
      (acc, asset) =>
        acc +
        parseFloat(
          asset.querySelector("ASSET_DETAIL AssetCashOrMarketValueAmount")
            ?.textContent || 0
        ),
      0.0
    );

  return total ?? 0.0;
}

function getLWAssetType(assetType, isImport = true) {
  const mapping = [
    { xml: "SavingsAccount", dom: "Savings" },
    { xml: "CheckingAccount", dom: "Checking" },
    { xml: "RetirementFund", dom: "IRA" },
    { xml: "CashOnHand", dom: "Cash" },
    { xml: "NetWorthOfBusinessOwned", dom: "Business" },
    { xml: "LifeInsurance", dom: "Life Insurance" },
    { xml: "BorrowerPrimaryHome", dom: "Home" },
    { xml: "StockOptions", dom: "Stocks" },
    { xml: "Stock", dom: "Stocks Owed" },
    { xml: "Automobile", dom: "Car" },
    { xml: "EarnestMoney", dom: "Earnest Money" },
    { xml: "RecreationalVehicle", dom: "RV" },
    { xml: "BridgeLoanNotDeposited", dom: "Bridge Loan Proceeds" },
    { xml: "Other", dom: "Other" },
  ];
  if (isImport) {
    return mapping.find((item) => item.xml === assetType);
  }
  return mapping.find((item) => item.dom === assetType);
}

function getLWPropertyType(propType, isImport = true) {
  const mapping = [
    { xml: "BorrowerPrimaryHome", dom: "Primary Residence" },
    { xml: "VacationHome", dom: "Vacation Home" },
    { xml: "Investment", dom: "Investment Property" },
    { xml: "Other", dom: "Other" },
  ];

  if (isImport) {
    const found = mapping.find((item) => item.xml === propType);
    return found ? found.dom : "Other";
  }

  const found = mapping.find((item) => item.dom === propType);
  return found ? found.xml : "Other";
}

function getLWOccupancy(propType, isImport = true) {
  const mapping = [
    { xml: "BorrowerPrimaryHome", dom: "Owner Occupied" },
    { xml: "VacationHome", dom: "2nd Home" },
    { xml: "Investment", dom: "Investment" },
  ];

  if (isImport) {
    const found = mapping.find((item) => item.xml === propType);
    return found ? found.dom : "Investment";
  }

  const found = mapping.find((item) => item.dom === propType);
  return found ? found.xml : "Investment";
}

function getLWLiabilityType(liabilityType, isImport = true) {
  const mapping = [
    { xml: "Revolving", dom: "Revolving" },
    { xml: "Installment", dom: "Installment" },
    { xml: "Other", dom: "Other" },
  ];

  if (isImport) {
    const found = mapping.find((item) => item.xml === liabilityType);
    return found ? found.dom : "Other";
  }

  const found = mapping.find((item) => item.dom === liabilityType);
  return found ? found.xml : "Other";
}

function formatDate(date) {
  const [year, month, day] = date.split("-");
  return `${month}/${day}/${year}`;
}

function getText(node, path) {
  if (!node) {
    return "";
  }
  if (Array.isArray(node) && node.length === 0) {
    return "";
  }

  console.log(node, path);
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
  const allAssets = Array.from(document.querySelectorAll("#onsoft ASSET"));
  const assets = allAssets.filter(
    (asset) => !asset.querySelector("OWNED_PROPERTY")
  );
  const purchaseCredits = Array.from(
    document.querySelectorAll("#onsoft LOANS PURCHASE_CREDITS PURCHASE_CREDIT")
  );
  purchaseCredits.forEach((credit) => {
    assets.push(credit);
  });
  return assets;
}

function getREO() {
  return Array.from(document.querySelectorAll("#onsoft ASSET OWNED_PROPERTY"));
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

function getLoanOriginatorParty() {
  const borrower = Array.from(document.querySelectorAll("#onsoft PARTY")).find(
    (party) =>
      party.querySelector("PartyRoleType").textContent ===
      "LoanOriginationCompany"
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
  if (coSigner) return coSigner;
}

function getSubjectProperty() {
  return document.querySelector(
    "#onsoft COLLATERALS COLLATERAL SUBJECT_PROPERTY"
  );
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

function createReoFields(reos) {
  for (let i = 0; i < reos.length - 1; i++) {
    setTimeout(() => {
      const addNewSelector = `#scheduleRealEstateDiv > div.card-header.card-header-tabs-line.bg-gray-100 > div.card-toolbar > a.btn.btn-sm.btn-success.btn-text-primary.btn-icon.ml-2.tooltipClass`;
      document.querySelector(addNewSelector)?.click();
    }, 1000 * i);
  }
}

function createCollateralFields(collaterals) {
  for (let i = 0; i < collaterals.length - 1; i++) {
    setTimeout(() => {
      const addNewSelector = `#addSubpropDiv > a`;
      document.querySelector(addNewSelector)?.click();
    }, 1000 * i);
  }
}

function createLiabilityFields(liabilities) {
  for (let i = 0; i < liabilities.length - 1; i++) {
    setTimeout(() => {
      const addNewSelector = `#loLiabilitiesAdd > div.card-header.card-header-tabs-line.bg-gray-100 > div.card-toolbar > a.btn.btn-sm.btn-success.btn-text-primary.btn-icon.ml-2.tooltipClass`;
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
        if (!value) continue;
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
  publishConfig(moreBorrowerConfig, borrower);

  const coBorrower = getCoBorrowerParty();
  if (coBorrower) {
    document.querySelector("#isCoBo").click();
    publishConfig(coBorrowerConfig, coBorrower);
    publishConfig(moreCoBorrowerConfig, coBorrower);
  }

  const loanOriginator = getLoanOriginatorParty();
  publishConfig(loanOriginatorConfig, loanOriginator);

  const reos = getREO();
  createReoFields(reos);
  publishConfigItems(reoConfig, reos);

  const liabilities = getLiabilities();
  createLiabilityFields(liabilities);
  publishConfigItems(
    liabilitiesConfig,
    liabilities,
    (i, selector) => `${selector}_${i + 1}`
  );

  const collaterals = getCollaterals();
  if (collaterals.length > 0) {
    const yesElement = document.querySelector("#isBlanketLoanMirrorYes");
    if (yesElement) {
      yesElement.click();
      document.querySelector("#noOfPropertiesAcquiring_mirror").value =
        collaterals.length;
    }
  } else {
    const noElement = document.querySelector("#isBlanketLoanMirrorNo");
    if (noElement) {
      noElement.click();
    }
  }

  const assets = getAssets();

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
  const loan = getLoan();
  publishConfig(loansConfig, loan);

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
    if (Array.isArray(_config.selector)) {
      _config.selector.forEach((selector, index) => {
        publishConfig(
          [
            {
              value:
                index === 0 ? _config.value : (data) => !_config.value(data),
              selector,
            },
          ],
          data
        );
      });
      return;
    }
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
      console.log("element", element, value);
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

function handleExportClick(e) {
  const doc = create({
    version: "1.0",
    encoding: "UTF-8",
    keepNullNodes: false,
  })
    .ele("http://www.mismo.org/residential/2009/schemas", "MESSAGE", {
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xmlns:ULAD": "http://www.datamodelextension.org/Schema/ULAD",
      "xmlns:DU": "http://www.datamodelextension.org/Schema/DU",
      MISMOReferenceModelIdentifier: "3.4.032420160128",
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
      "xmlns:LPA": "http://www.datamodelextension.org/Schema/LPA",
    })
    .ele("ABOUT_VERSIONS")
    .ele("ABOUT_VERSION")
    .ele("AboutVersionIdentifier")
    .txt("S5.0.06")
    .up()
    .ele("CreatedDatetime")
    .txt(moment().utc().format())
    .up()
    .up()
    .up();

  const individualNode = doc
    .ele("DEAL_SETS")
    .ele("DEAL_SET")
    .ele("DEALS")
    .ele("DEAL")
    .ele("PARTIES")
    .ele("PARTY");

  // Borrower
  borrowerConfig.forEach((config) => {
    if (!config.exportTo) {
      return;
    }
    if (!Array.isArray(config.selector)) {
      const element = document.querySelector(config.selector);
      let xmlNode = individualNode;
      if (element) {
        config.exportTo.split(" ").forEach((tagName) => {
          const foundNode = xmlNode.find((n) => n.node.nodeName === tagName);
          if (foundNode) {
            xmlNode = foundNode;
          } else {
            xmlNode = xmlNode.ele(tagName);
          }
        });
        xmlNode.txt(element.value);
      }
    }
  });

  const xml = doc.end({ prettyPrint: true });
  console.log(xml);
}
global.handleImportChange = handleImportChange;
global.handleExportClick = handleExportClick;

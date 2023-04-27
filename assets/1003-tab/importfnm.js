(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
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
    exportTo: "INDIVIDUAL ALIASES ALIAS NAME FirstName",
  },
  {
    selector: "#alternateLName_1",
    value: (node) => getText(node, "INDIVIDUAL ALIAS LastName"),
    exportTo: "INDIVIDUAL ALIASES ALIAS NAME LastName",
  },
  {
    selector: "#alternateMName_1",
    value: (node) => getText(node, "INDIVIDUAL ALIAS MiddleName"),
    exportTo: "INDIVIDUAL ALIASES ALIAS NAME MiddelName",
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
    exportTo:
      "TAXPAYER_IDENTIFIERS TAXPAYER_IDENTIFIER TaxpayerIdentifierValue",
  },
  {
    selector: "#borrowerEmail",
    value: (node) => getText(node, "ContactPointEmailValue"),
    exportTo:
      "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_EMAIL ContactPointEmailValue",
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
    exportTo:
      "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_TELEPHONE ContactPointTelephoneValue",
    newTag: "CONTACT_POINT_TELEPHONE",
    dependency: {
      tag: "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_DETAIL ContactPointRoleType",
      value: "Home",
      duplicate: "CONTACT_POINT_DETAIL",
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
    exportTo:
      "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_TELEPHONE ContactPointTelephoneValue",
    newTag: "CONTACT_POINT_TELEPHONE",
    dependency: {
      tag: "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_DETAIL ContactPointRoleType",
      value: "Mobile",
      duplicate: "CONTACT_POINT_DETAIL",
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
    exportTo:
      "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_TELEPHONE ContactPointTelephoneValue",
    newTag: "CONTACT_POINT_TELEPHONE",
    dependency: {
      tag: "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_DETAIL ContactPointRoleType",
      value: "Work",
      duplicate: "CONTACT_POINT_DETAIL",
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
    exportTo:
      "ROLES ROLE BORROWER RESIDENCES RESIDENCE ADDRESS AddressLineText",
    exportAppend: [
      {
        path: "ROLES ROLE BORROWER RESIDENCES RESIDENCE RESIDENCE_DETAIL BorrowerResidencyType",
        value: "Current",
      },
    ],
    dependency: {
      tag: "ROLES ROLE BORROWER RESIDENCES RESIDENCE RESIDENCE_DETAIL BorrowerResidencyType",
      value: "Current",
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
    exportTo:
      "ROLES ROLE BORROWER RESIDENCES RESIDENCE ADDRESS AddressUnitIdentifier",
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
    exportTo: "ROLES ROLE BORROWER RESIDENCES RESIDENCE ADDRESS CityName",
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
    exportTo: "ROLES ROLE BORROWER RESIDENCES RESIDENCE ADDRESS PostalCode",
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
    exportTo: "ROLES ROLE BORROWER RESIDENCES RESIDENCE ADDRESS StateCode",
  },
  {
    selector: "#presentCountry",
    value: () => "US",
    exportTo: "ROLES ROLE BORROWER RESIDENCES RESIDENCE ADDRESS CountryCode",
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
    exportTo:
      "ROLES ROLE BORROWER RESIDENCES RESIDENCE RESIDENCE_DETAIL BorrowerResidencyBasisType",
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
    exportTo:
      "ROLES ROLE BORROWER RESIDENCES RESIDENCE RESIDENCE_DETAIL BorrowerResidencyDurationMonthsCount",
  },
  {
    selector: "#currentRPM",
    value: (node) => {
      const filtered = getWhere(
        node,
        "RESIDENCES RESIDENCE",
        "BorrowerResidencyType",
        "Current"
      );
      return getText(filtered?.[0], "MonthlyRentAmount");
    },
    exportTo:
      "ROLES ROLE BORROWER RESIDENCES RESIDENCE LANDLORD LANDLORD_DETAIL MonthlyRentAmount",
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
    exportTo: "ADDRESSES ADDRESS AddressLineText",
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
    exportTo: "ADDRESSES ADDRESS AddressUnitIdentifier",
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
    exportTo: "ADDRESSES ADDRESS CityName",
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
    exportTo: "ADDRESSES ADDRESS StateCode",
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
    exportTo: "ADDRESSES ADDRESS PostalCode",
  },
  {
    selector: "#mailingCountry",
    value: () => "US",
    exportTo: "ADDRESSES ADDRESS CountryCode",
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
    dependency: {
      tag: "ROLES ROLE ROLE_DETAIL PartyRoleType",
      value: "Borrower",
    },
  },
  {
    selector: "#maritalStatus_1",
    value: (node) => getText(node, "MaritalStatusType") === "Unmarried",
    exportTo: "ROLES ROLE BORROWER BORROWER_DETAIL MaritalStatusType",
  },
  {
    selector: "#maritalStatus_2",
    value: (node) => getText(node, "MaritalStatusType") === "Married",
    exportTo: "ROLES ROLE BORROWER BORROWER_DETAIL MaritalStatusType",
  },
  {
    selector: "#maritalStatus_3",
    value: (node) => getText(node, "MaritalStatusType") === "Separated",
    exportTo: "ROLES ROLE BORROWER BORROWER_DETAIL MaritalStatusType",
  },
  {
    selector: "#numberOfDependents",
    value: (node) => getText(node, "BORROWER_DETAIL DependentCount"),
    exportTo: "ROLES ROLE BORROWER BORROWER_DETAIL DependentCount",
  },
  {
    selector: "#borrowerCitizenship_0",
    value: (node) => getText(node, "CitizenshipResidencyType") === "USCitizen",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL CitizenshipResidencyType",
  },
  {
    selector: "#borrowerCitizenship_1",
    value: (node) => getText(node, "CitizenshipResidencyType") !== "USCitizen",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL CitizenshipResidencyType",
  },
  {
    selector: "#borrowerCitizenship_3",
    value: (node) => getText(node, "CitizenshipResidencyType") !== "USCitizen",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL CitizenshipResidencyType",
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
    selector: "#agesOfDependent",
    value: (node) =>
      getText(node, "DEPENDENTS DEPENDENT DependentAgeYearsCount"),
    exportTo: "ROLES ROLE BORROWER DEPENDENTS DEPENDENT DependentAgeYearsCount",
  },

  // TODO: Read veteran status from XML
  {
    selector: "#isServicingMember_1",
    value: (node) => false,
    exportTo:
      "ROLES ROLE BORROWER BORROWER_DETAIL SelfDeclaredMilitaryServiceIndicator",
  },
  {
    selector: "#isServicingMember_2",
    value: (node) => true,
    exportTo:
      "ROLES ROLE BORROWER BORROWER_DETAIL SelfDeclaredMilitaryServiceIndicator",
  },
  {
    selector: [
      "#additionalPropertyRestrictionsYes",
      "#additionalPropertyRestrictionsNo",
    ],
    value: (node) =>
      getText(node, "PropertyProposedCleanEnergyLienIndicator") === "true",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL PropertyProposedCleanEnergyLienIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: [
      "#isBorIntendToOccupyPropAsPRIYes",
      "#isBorIntendToOccupyPropAsPRINo",
    ],
    value: (node) => getText(node, "IntentToOccupyType") === "Yes",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL IntentToOccupyType",
    exportValues: ["Yes", "No"],
  },
  {
    selector: [
      "#haveOwnershipInterestYes",
      "#haveOwnershipInterestNo",
    ],
    value: (node) => getText(node, "HomeownerPastThreeYearsType") === "Yes",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL HomeownerPastThreeYearsType",
    exportValues: ["Yes", "No"],
  },
  {
    selector: "#typePropOwned",
    value: (node) => getText(node, "DECLARATION_DETAIL PriorPropertyUsageType"),
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL PriorPropertyUsageType",
  },
  {
    selector: "#titleType",
    value: (node) => getText(node, "DECLARATION_DETAIL PriorPropertyTitleType"),
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL PriorPropertyTitleType",
  },
  {
    selector: ["#borrowingMoneyYes", "#borrowingMoneyNo"],
    value: (node) =>
      getText(node, "UndisclosedBorrowedFundsIndicator") === "Yes",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL UndisclosedBorrowedFundsIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: "#borrowedAmt",
    value: (node) => getText(node, "DECLARATION_DETAIL UndisclosedBorrowedFundsAmount"),
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL UndisclosedBorrowedFundsAmount",
  },
  {
    selector: [
      "#famBizAffilYes",
      "#famBizAffilNo",
    ],
    value: (node) => getText(node, `ULADSpecialBorrowerSellerRelationshipIndicator`) === "Yes",
    exportTo: `ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL EXTENSION OTHER ULAD:DECLARATION_DETAIL_EXTENSION ULAD:SpecialBorrowerSellerRelationshipIndicator`,
  },
  {
    selector: ["#applyOtherLoanYes", "#applyOtherLoanNo"],
    value: (node) =>
      getText(node, "UndisclosedMortgageApplicationIndicator") === "Yes",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL UndisclosedMortgageApplicationIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: ["#applyNewCreditYes", "#applyNewCreditNo"],
    value: (node) =>
      getText(node, "UndisclosedCreditApplicationIndicator") === "Yes",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL UndisclosedCreditApplicationIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: [
      "#isBorDecalredBankruptPastYearsYes",
      "#isBorDecalredBankruptPastYearsNo",
    ],
    value: (node) => getText(node, "BankruptcyIndicator") === "true",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL BankruptcyIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: "#bankruptcyTypes",
    value: (node) => getText(node, "BANKRUPTCIES BANKRUPTCIE BANKRUPTCY_DETAIL BankruptcyChapterType"),
    exportTo:
      "ROLES ROLE BORROWER BANKRUPTCIES BANKRUPTCIE BANKRUPTCY_DETAIL BankruptcyChapterType",
  },

  {
    selector: [
      "#isAnyBorOutstandingJudgementsYes",
      "#isAnyBorOutstandingJudgementsNo",
    ],
    value: (node) => getText(node, "OutstandingJudgmentsIndicator") === "true",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL OutstandingJudgmentsIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: ["#hasBorAnyActiveLawsuitsYes", "#hasBorAnyActiveLawsuitsNo"],
    value: (node) => getText(node, "PartyToLawsuitIndicator") === "true",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL PartyToLawsuitIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: [
      "#hasBorObligatedInForeclosureYes",
      "#hasBorObligatedInForeclosureNo",
    ],
    value: (node) =>
      getText(node, "PriorPropertyDeedInLieuConveyedIndicator") === "true",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL PriorPropertyDeedInLieuConveyedIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: ["#isBorPresenltyDelinquentYes", "#isBorPresenltyDelinquentNo"],
    value: (node) => getText(node, "PresentlyDelinquentIndicator") === "true",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL PresentlyDelinquentIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: ["#previouslyHadShortSaleYes", "#previouslyHadShortSaleNo"],
    value: (node) =>
      getText(node, "PriorPropertyShortSaleCompletedIndicator") === "true",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL PriorPropertyShortSaleCompletedIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: ["#completedPreForecloseYes", "#completedPreForecloseNo"],
    value: (node) =>
      getText(node, "PriorPropertyForeclosureCompletedIndicator") === "true",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL PriorPropertyForeclosureCompletedIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: "#borResidedPresentAddrNo",
    value: (node) => true,
  },
  {
    selector: "#PublishBInfoYes",
    value: (node) => true,
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING GOVERNMENT_MONITORING_DETAIL`,
  },
  {
    selector: "#BEthnicityH",
    value: (node) => getText(node, "HMDAEthnicityOriginType") === "Mexican",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING EXTENSION OTHER ULAD:GOVERNMENT_MONITORING_EXTENSION ` +
      `ULAD:HMDA_ETHNICITIES ULAD:HMDA_ETHNICITY ULAD:HMDAEthnicityType`,
    mismoValue: "HispanicOrLatino"
  },
  {
    selector: "#BEthnicityNH",
    value: (node) => getText(node, "HMDAEthnicityOriginType") === "Mexican",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING EXTENSION OTHER ULAD:GOVERNMENT_MONITORING_EXTENSION ` +
      `ULAD:HMDA_ETHNICITIES ULAD:HMDA_ETHNICITY ULAD:HMDAEthnicityType`,
    mismoValue: "NotHispanicOrLatino"
  },
  {
    selector: "#BEthnicityND",
    value: (node) => getText(node, "HMDAEthnicityRefusalIndicator") === "true",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING EXTENSION OTHER ULAD:GOVERNMENT_MONITORING_EXTENSION ` +
      `ULAD:HMDA_ETHNICITIES ULAD:HMDA_ETHNICITY ULAD:HMDAEthnicityType`,
    mismoValue: "NotApplicable"
  },
  {
    selector: "#BRace1",
    value: (node) => getText(node, "HMDARaceType") === "White",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING HMDA_RACES HMDA_RACE HMDA_RACE_DETAIL HMDARaceType`,
    mismoValue: "AmericanIndianOrAlaskaNative"
  },
  {
    selector: "#BRace2",
    value: (node) => getText(node, "HMDARaceType") === "White",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING HMDA_RACES HMDA_RACE HMDA_RACE_DETAIL HMDARaceType`,
    mismoValue: "Asian"
  },
  {
    selector: "#BRace3",
    value: (node) => getText(node, "HMDARaceType") === "White",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING HMDA_RACES HMDA_RACE HMDA_RACE_DETAIL HMDARaceType`,
    mismoValue: "BlackOrAfricanAmerican"
  },
  {
    selector: "#BRace4",
    value: (node) => getText(node, "HMDARaceType") === "White",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING HMDA_RACES HMDA_RACE HMDA_RACE_DETAIL HMDARaceType`,
    mismoValue: "NativeHawaiianOrOtherPacificIslander"
  },
  {
    selector: "#BRace5",
    value: (node) => getText(node, "HMDARaceType") === "White",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING HMDA_RACES HMDA_RACE HMDA_RACE_DETAIL HMDARaceType`,
    mismoValue: "White"
  },
  {
    selector: "#BRace6",
    value: (node) => getText(node, "HMDARaceType") === "White",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING HMDA_RACES HMDA_RACE HMDA_RACE_DETAIL HMDARaceType`,
    mismoValue: "NotApplicable"
  },
  {
    selector: "#BGendeMale",
    // value: (node) => getText(node, "HMDAGenderType") === "Male",
    value: (node) =>
      xmlText.includes(`<ULAD:HMDAGenderType>Male</ULAD:HMDAGenderType>`),
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING GOVERNMENT_MONITORING_DETAIL EXTENSION ` +
      `OTHER ULAD:GOVERNMENT_MONITORING_DETAIL_EXTENSION ULAD:HMDAGenderType`,
    mismoValue: "Male"
  },
  {
    selector: "#BGenderFE",
    value: (node) =>
      xmlText.includes(`<ULAD:HMDAGenderType>Female</ULAD:HMDAGenderType>`),
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING GOVERNMENT_MONITORING_DETAIL EXTENSION ` +
      `OTHER ULAD:GOVERNMENT_MONITORING_DETAIL_EXTENSION ULAD:HMDAGenderType`,
    mismoValue: "Female"
  },
  {
    selector: "#BGenderNotDis",
    value: (node) =>
      getText(node, "HMDAGenderRefusalIndicator") === "true" &&
      !xmlText.includes(`<ULAD:HMDAGenderType>Male</ULAD:HMDAGenderType>`) &&
      !xmlText.includes(`<ULAD:HMDAGenderType>Female</ULAD:HMDAGenderType>`),
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING GOVERNMENT_MONITORING_DETAIL EXTENSION ` +
      `OTHER ULAD:GOVERNMENT_MONITORING_DETAIL_EXTENSION ULAD:HMDAGenderType`,
    mismoValue: "NotApplicable"
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
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "Base"
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
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "Bonus"
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
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "MilitaryBasePay"
  },
  // {
  //   selector: "#militaryIncome1",
  //   value: (node) => {
  //     const filtered = getWhere(
  //       node,
  //       "CURRENT_INCOME_ITEM",
  //       "IncomeType",
  //       "MilitaryBasePay"
  //     );
  //     return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
  //   },
  // },
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
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "Overtime"
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
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "NetRentalIncome"
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
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "DividendsInterest"
  },
  {
    selector: "#capitalGains1",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "CapitalGains"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "CapitalGains"
  },
  {
    selector: "#partnership1",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "SelfEmploymentIncome"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    //Not sure about this incomeType
    incomeType: "SelfEmploymentIncome"
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
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "Other"
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
    exportTo: "INDIVIDUAL NAME FirstName",
    dependency: {
      tag: "ROLES ROLE ROLE_DETAIL PartyRoleType",
      value: "Borrower",
    }
  },
  {
    selector: "#coBorrowerLName",
    value: (node) => getText(node, "INDIVIDUAL NAME LastName"),
    exportTo: "INDIVIDUAL NAME LastName",
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
    exportTo: "ROLES ROLE BORROWER BORROWER_DETAIL BorrowerBirthDate",
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
    exportTo: "TAXPAYER_IDENTIFIERS TAXPAYER_IDENTIFIER TaxpayerIdentifierValue",
  },
  {
    selector: "#coBorrowerEmail",
    value: (node) => getText(node, "ContactPointEmailValue"),
    exportTo: "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_EMAIL ContactPointEmailValue",
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
    exportTo: "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_TELEPHONE ContactPointTelephoneValue",
    newTag: "CONTACT_POINT_TELEPHONE",
    dependency: {
      tag: "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_DETAIL ContactPointRoleType",
      value: "Home",
      duplicate: "CONTACT_POINT_DETAIL",
    }
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
    exportTo: "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_TELEPHONE ContactPointTelephoneValue",
    newTag: "CONTACT_POINT_TELEPHONE",
    dependency: {
      tag: "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_DETAIL ContactPointRoleType",
      value: "Mobile",
      duplicate: "CONTACT_POINT_DETAIL",
    }
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
    exportTo: "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_TELEPHONE ContactPointTelephoneValue",
    newTag: "CONTACT_POINT_TELEPHONE",
    dependency: {
      tag: "INDIVIDUAL CONTACT_POINTS CONTACT_POINT CONTACT_POINT_DETAIL ContactPointRoleType",
      value: "Fax",
      duplicate: "CONTACT_POINT_DETAIL",
    }
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
    exportTo: "ROLES ROLE RESIDENCES RESIDENCE ADDRESS AddressLineText",
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
    exportTo: "ROLES ROLE RESIDENCES RESIDENCE ADDRESS CityName",
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
    exportTo: "ROLES ROLE RESIDENCES RESIDENCE ADDRESS PostalCode",
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
    exportTo: "ROLES ROLE RESIDENCES RESIDENCE ADDRESS StateCode",
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
    exportTo: "ADDRESSES ADDRESS AddressLineText",
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
    exportTo: "ADDRESSES ADDRESS CityName",
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
    exportTo: "ADDRESSES ADDRESS PostalCode",
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
    exportTo: "ADDRESSES ADDRESS StateCode",
  },
  {
    selector: "#coBorrowerCitizenship_1",
    value: (node) => getText(node, "MaritalStatusType") === "USCitizen",
    exportTo: "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL CitizenshipResidencyType",
  },
  {
    selector: "#coBorrowerCitizenship_2",
    value: (node) => getText(node, "MaritalStatusType") === "PermanentResidentAlien",
    exportTo: "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL CitizenshipResidencyType",
  },
  {
    selector: "#coBorrowerCitizenship_3",
    value: (node) => getText(node, "CitizenshipResidencyType") === "NonPermanentResidentAlien",
    exportTo: "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL CitizenshipResidencyType",
  },
  {
    selector: "#maritalStatusCoBor_1",
    value: (node) => getText(node, "MaritalStatusType") === "Unmarried",
    exportTo: "ROLES ROLE BORROWER BORROWER_DETAIL MaritalStatusType",
  },
  {
    selector: "#maritalStatusCoBor_2",
    value: (node) => getText(node, "MaritalStatusType") === "Married",
    exportTo: "ROLES ROLE BORROWER BORROWER_DETAIL MaritalStatusType",
  },
  {
    selector: "#maritalStatusCoBor_3",
    value: (node) => getText(node, "MaritalStatusType") === "Separated",
    exportTo: "ROLES ROLE BORROWER BORROWER_DETAIL MaritalStatusType",
  },
  {
    selector: "#PublishCBInfo2",
    value: (node) => true,
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING GOVERNMENT_MONITORING_DETAIL`,
  },
  {
    selector: "#CBEthnicity2",
    value: (node) => getText(node, "HMDAEthnicityOriginType") === "Mexican",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING EXTENSION OTHER ULAD:GOVERNMENT_MONITORING_EXTENSION ` +
      `ULAD:HMDA_ETHNICITIES ULAD:HMDA_ETHNICITY ULAD:HMDAEthnicityType`,
    mismoValue: "HispanicOrLatino"
  },
  {
    selector: "#CBEthnicity1",
    value: (node) => getText(node, "HMDAEthnicityOriginType") === "NotMexican",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING EXTENSION OTHER ULAD:GOVERNMENT_MONITORING_EXTENSION ` +
      `ULAD:HMDA_ETHNICITIES ULAD:HMDA_ETHNICITY ULAD:HMDAEthnicityType`,
    mismoValue: "NotHispanicOrLatino"
  },
  {
    selector: "#CBEthnicity3",
    value: (node) => getText(node, "HMDAEthnicityRefusalIndicator") === "NA",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING EXTENSION OTHER ULAD:GOVERNMENT_MONITORING_EXTENSION ` +
      `ULAD:HMDA_ETHNICITIES ULAD:HMDA_ETHNICITY ULAD:HMDAEthnicityType`,
    mismoValue: "NotApplicable"
  },
  {
    selector: "#CBRace1",
    value: (node) => getText(node, "HMDARaceType") === "White",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING HMDA_RACES HMDA_RACE HMDA_RACE_DETAIL HMDARaceType`,
    mismoValue: "AmericanIndianOrAlaskaNative"
  },
  {
    selector: "#CBRace2",
    value: (node) => getText(node, "HMDARaceType") === "White",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING HMDA_RACES HMDA_RACE HMDA_RACE_DETAIL HMDARaceType`,
    mismoValue: "Asian"
  },
  {
    selector: "#CBRace3",
    value: (node) => getText(node, "HMDARaceType") === "White",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING HMDA_RACES HMDA_RACE HMDA_RACE_DETAIL HMDARaceType`,
    mismoValue: "BlackOrAfricanAmerican"
  },
  {
    selector: "#CBRace4",
    value: (node) => getText(node, "HMDARaceType") === "White",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING HMDA_RACES HMDA_RACE HMDA_RACE_DETAIL HMDARaceType`,
    mismoValue: "NativeHawaiianOrOtherPacificIslander"
  },
  {
    selector: "#CBRace5",
    value: (node) => getText(node, "HMDARaceType") === "White",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING HMDA_RACES HMDA_RACE HMDA_RACE_DETAIL HMDARaceType`,
    mismoValue: "White"
  },
  {
    selector: "#CBRace6",
    value: (node) => getText(node, "HMDARaceType") === "White",
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING HMDA_RACES HMDA_RACE HMDA_RACE_DETAIL HMDARaceType`,
    mismoValue: "NotApplicable"
  },
  {
    selector: "#CBGender2",
    // value: (node) => getText(node, "HMDAGenderType") === "Male",
    value: (node) =>
      xmlText.includes(`<ULAD:HMDAGenderType>Male</ULAD:HMDAGenderType>`),
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING GOVERNMENT_MONITORING_DETAIL EXTENSION OTHER ` +
      `ULAD:GOVERNMENT_MONITORING_DETAIL_EXTENSION ULAD:HMDAGenderType`,
    mismoValue: "Male",
  },
  {
    selector: "#CBGender1",
    value: (node) =>
      xmlText.includes(`<ULAD:HMDAGenderType>Female</ULAD:HMDAGenderType>`),
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING GOVERNMENT_MONITORING_DETAIL EXTENSION OTHER ` +
      `ULAD:GOVERNMENT_MONITORING_DETAIL_EXTENSION ULAD:HMDAGenderType`,
    mismoValue: "Female",
  },
  {
    selector: "#CBGender3",
    value: (node) =>
      xmlText.includes(`<ULAD:HMDAGenderType>NotApplicable</ULAD:HMDAGenderType>`),
    exportTo: `ROLES ROLE BORROWER GOVERNMENT_MONITORING GOVERNMENT_MONITORING_DETAIL EXTENSION OTHER ` +
      `ULAD:GOVERNMENT_MONITORING_DETAIL_EXTENSION ULAD:HMDAGenderType`,
    mismoValue: "NotApplicable",
  },
  {
    selector: "#isCoBorUSCitizenYes",
    value: (node) => getText(node, "CitizenshipResidencyType") === "USCitizen",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL CitizenshipResidencyType",
  },
  {
    selector: "#isCoBorUSCitizenNo",
    value: (node) => getText(node, "CitizenshipResidencyType") === "NotUSCitizen",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL CitizenshipResidencyType",
  },
  {
    selector: [
      "#isCoBorDecalredBankruptPastYears_1",
      "#isCoBorDecalredBankruptPastYears_2",
    ],
    value: (node) => getText(node, "BankruptcyIndicator") === "true",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL BankruptcyIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: [
      "#isAnyCoBorOutstandingJudgements_1",
      "#isAnyCoBorOutstandingJudgements_2",
    ],
    value: (node) => getText(node, "OutstandingJudgmentsIndicator") === "true",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL OutstandingJudgmentsIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: ["#hasCoBorAnyActiveLawsuitsYes", "#hasCoBorAnyActiveLawsuitsNo"],
    value: (node) => getText(node, "PartyToLawsuitIndicator") === "true",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL PartyToLawsuitIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: [
      "#hasCoBorObligatedInForeclosureYes",
      "#hasCoBorObligatedInForeclosureNo",
    ],
    value: (node) =>
      getText(node, "PriorPropertyDeedInLieuConveyedIndicator") === "true",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL PriorPropertyDeedInLieuConveyedIndicator",
    exportValues: ["true", "false"],
  },
  {
    selector: ["#isCoBorPresenltyDelinquentYes", "#isCoBorPresenltyDelinquentNo"],
    value: (node) => getText(node, "PresentlyDelinquentIndicator") === "true",
    exportTo:
      "ROLES ROLE BORROWER DECLARATION DECLARATION_DETAIL PresentlyDelinquentIndicator",
    exportValues: ["true", "false"],
  },

  {
    selector: "#grossIncome2",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "Base"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "Base"
  },
  {
    selector: "#commissionOrBonus2",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "Bonus"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "Bonus"
  },
  // {
  //   selector: "#militaryIncome1",
  //   value: (node) => {
  //     const filtered = getWhere(
  //       node,
  //       "CURRENT_INCOME_ITEM",
  //       "IncomeType",
  //       "MilitaryBasePay"
  //     );
  //     return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
  //   },
  //   exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
  //     `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
  //   newTag: "CURRENT_INCOME_ITEM",
  //   incomeType: "MilitaryBasePay"
  // },
  {
    selector: "#overtime2",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "Overtime"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "Overtime"
  },

  {
    selector: "#netRental2",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "NetRentalIncome"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "NetRentalIncome"
  },
  {
    selector: "#netEarnedInterest2",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "DividendsInterest"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "DividendsInterest"
  },
  {
    selector: "#capitalGains2",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "CapitalGains"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "CapitalGains"
  },
  {
    selector: "#partnership2",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "SelfEmploymentIncome"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    //Not sure about this incomeType
    incomeType: "SelfEmploymentIncome"
  },

  {
    selector: "#otherHouseHold2",
    value: (node) => {
      const filtered = getWhere(
        node,
        "CURRENT_INCOME_ITEM",
        "IncomeType",
        "Other"
      );
      return getText(filtered, "CurrentIncomeMonthlyTotalAmount");
    },
    exportTo: `ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM ` +
      `CURRENT_INCOME_ITEM_DETAIL CurrentIncomeMonthlyTotalAmount`,
    newTag: "CURRENT_INCOME_ITEM",
    incomeType: "Other"
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
    exportTo: "PARTY LEGAL_ENTITY LEGAL_ENTITY_DETAIL FullName",
    newTag: "PARTY",
    dependency: {
      tag: "PARTY ROLES ROLE ROLE_DETAIL PartyRoleType",
      value: "LoanOriginationCompany"
    }
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
    exportTo: "PARTY ADDRESSES ADDRESS AddressLineText",
  },
];

const subjectPropertyConfig = [
  {
    selector: "#propertyAddress",
    value: (node) => getText(node, "AddressLineText"),
    exportTo: "SUBJECT_PROPERTY ADDRESS AddressLineText"
  },
  // {
  //   selector: "#propertyUnit",
  //   value: (node) => getText(node, "unit"),
  // },
  {
    selector: "#propertyCity",
    value: (node) => getText(node, "CityName"),
    exportTo: "SUBJECT_PROPERTY ADDRESS CityName"
  },
  {
    selector: "#propertyState",
    value: (node) => getText(node, "StateCode"),
    exportTo: "SUBJECT_PROPERTY ADDRESS StateCode"
  },
  {
    selector: "#propertyZip",
    value: (node) => getText(node, "PostalCode"),
    exportTo: "SUBJECT_PROPERTY ADDRESS PostalCode"
  },
  {
    selector: "#propertyCountry",
    value: (node) => "US",
    exportTo: "SUBJECT_PROPERTY ADDRESS CountryCode"
  },
  // TODO: map property type 
  {
    selector: "#propertyType",
    value: (node) => getText(node, "PropertyUsageType"),
    exportTo: "SUBJECT_PROPERTY PROPERTY_DETAIL PropertyUsageType"
  },
  {
    selector: "#noUnitsOccupied",
    value: (node) => getText(node, "FinancedUnitCount"),
    exportTo: "SUBJECT_PROPERTY PROPERTY_DETAIL FinancedUnitCount"
  },
  {
    selector: "#propertyValue",
    value: (node) => getText(node, "PropertyEstimatedValueAmount"),
    exportTo: "SUBJECT_PROPERTY PROPERTY_DETAIL PropertyEstimatedValueAmount"
  },
  {
    selector: "#presentOccupancy",
    value: (node) => getText(node, "PropertyCurrentUsageType"),
    exportTo: "SUBJECT_PROPERTY PROPERTY_DETAIL PropertyCurrentUsageType"
  },
];

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
    exportTo: "ROLES ROLE BORROWER CURRENT_INCOME CURRENT_INCOME_ITEMS CURRENT_INCOME_ITEM CURRENT_INCOME_ITEM_DETAIL PresentlyDelinquentIndicator",
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
    exportTo: "ASSET_DETAIL AssetAccountIdentifier",
  },
  {
    selector: "#accountType",
    value: (asset) =>
      getLWAssetType(
        asset.querySelector("AssetType")?.textContent ||
        asset.querySelector("PurchaseCreditType")?.textContent),
    exportTo: "ASSET_DETAIL AssetType"
  },
  {
    selector: "#nameofInstitution",
    value: (asset) => asset.querySelector("fullname")?.textContent || "",
    exportTo: "ASSET_HOLDER FullName"
  },
  {
    selector: "#balanceValue",
    value: (asset) =>
      asset.querySelector("assetcashormarketvalueamount")?.textContent ||
      asset.querySelector("PurchaseCreditAmount")?.textContent,
    exportTo: "ASSET_DETAIL AssetCashOrMarketValueAmount"
  },
];

const reoConfig = [
  {
    selector: "#schedulePropAddr",
    value: (asset) => asset.querySelector("AddressLineText")?.textContent || "",
    exportTo: "OWNED_PROPERTY PROPERTY ADDRESS AddressLineText"
  },
  {
    selector: "#schedulePropCity",
    value: (asset) => asset.querySelector("CityName")?.textContent || "",
    exportTo: "OWNED_PROPERTY PROPERTY ADDRESS CityName"
  },
  {
    selector: "#schedulePropZip",
    value: (asset) => asset.querySelector("PostalCode")?.textContent || "",
    exportTo: "OWNED_PROPERTY PROPERTY ADDRESS PostalCode"
  },
  {
    selector: "#schedulePropState",
    value: (asset) => asset.querySelector("StateCode")?.textContent || "",
    exportTo: "OWNED_PROPERTY PROPERTY ADDRESS StateCode"
  },
  {
    selector: "#schedulePropCountry",
    value: () => "US",
    exportTo: "OWNED_PROPERTY PROPERTY ADDRESS CountryCode"
  },
  {
    selector: "#propType",
    value: (asset) =>
      getLWPropertyType(
        asset.querySelector("propcurrentusagetype")?.textContent
      ),
    exportTo: "OWNED_PROPERTY PROPERTY PROPERTY_DETAIL PropertyCurrentUsageType"
  },
  {
    selector: "#presentMarketValue",
    value: (asset) =>
      asset.querySelector("PropertyEstimatedValueAmount")?.textContent || "",
    exportTo: "OWNED_PROPERTY PROPERTY PROPERTY_DETAIL PropertyEstimatedValueAmount"
  },
  {
    selector: "#grossRentalIncome",
    value: (asset) =>
      asset.querySelector("OwnedPropertyRentalIncomeNetAmount")?.textContent,
    exportTo: "OWNED_PROPERTY OWNED_PROPERTY_DETAIL OwnedPropertyRentalIncomeNetAmount"
  },
];

const currentEmployerConfig = [
  {
    selector: "#occupation1",
    value: (node) =>
      node?.querySelector("EmploymentPositionDescription")?.textContent,
    exportTo: "EMPLOYER EMPLOYMENT EmploymentPositionDescription"
  },
  {
    selector: "#borrowerHireDate",
    value: (node) => {
      const hireDate = node?.querySelector("EmploymentStartDate")?.textContent;
      return hireDate ? formatDate(hireDate) : "";
    },
    exportTo: "EMPLOYER EMPLOYMENT EmploymentStartDate"
  },
  {
    selector: "#employer1",
    value: (employer) =>
      employer?.querySelector("LEGAL_ENTITY_DETAIL FullName")?.textContent,
    exportTo: "EMPLOYER LEGAL_ENTITY LEGAL_ENTITY_DETAIL FullName"
  },
  {
    selector: "#employer1Add",
    value: (employer) =>
      employer?.querySelector("address AddressLineText")?.textContent,
    exportTo: "EMPLOYER ADDRESS AddressLineText"
  },
  {
    selector: "#employer1City",
    value: (employer) =>
      employer?.querySelector("address CityName")?.textContent,
    exportTo: "EMPLOYER ADDRESS CityName"
  },
  {
    selector: "#employer1Zip",
    value: (employer) =>
      employer?.querySelector("address PostalCode")?.textContent?.substr(0, 5),
    exportTo: "EMPLOYER ADDRESS PostalCode"
  },
  {
    selector: "#employer1State",
    value: (employer) =>
      employer?.querySelector("address StateCode")?.textContent,
    exportTo: "EMPLOYER ADDRESS StateCode"
  },
  {
    selector: "#employerPhone1",
    value: (employer) =>
      employer?.querySelector("ContactPointTelephoneValue")?.textContent,
    exportTo: "EMPLOYER LEGAL_ENTITY CONTACTS CONTACT CONTACT_POINTS CONTACT_POINT CONTACT_POINT_TELEPHONE ContactPointTelephoneValue"
  },
];

const prevEmployerConfig = [
  {
    selector: "#AddiontalEmplInfo_{counter}_addOrPrevJob",
    value: () => "previous",
    exportTo: "EMPLOYMENT EmploymentStatusType"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_nameOfEmployer",
    value: (employer) =>
      employer?.querySelector("LEGAL_ENTITY_DETAIL FullName")?.textContent,
    exportTo: "LEGAL_ENTITY LEGAL_ENTITY_DETAIL FullName"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_addrOfEmployer",
    value: (employer) =>
      employer?.querySelector("address AddressLineText")?.textContent,
    exportTo: "ADDRESS AddressLineText"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_cityOfEmployer",
    value: (employer) =>
      employer?.querySelector("address CityName")?.textContent,
    exportTo: "ADDRESS CityName"
  },
  // Get the correct selector for the zip code and state
  {
    selector: "#AddiontalEmplInfo_{counter}_zipOfEmployer",
    value: (employer) =>
      employer?.querySelector("address PostalCode")?.textContent,
    exportTo: "ADDRESS PostalCode"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_stateOfEmployer",
    value: (employer) =>
      employer?.querySelector("address StateCode")?.textContent,
    exportTo: "ADDRESS StateCode"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_employedFrom",
    value: (employer) => {
      const hireDate = getText(employer, "EmploymentStartDate");

      if (hireDate) {
        return formatDate(hireDate);
      }
    },
    exportTo: "EMPLOYMENT EmploymentStartDate"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_monthlyIncome",
    value: (employer) =>
      employer?.querySelector("EmploymentMonthlyIncomeAmount")?.textContent,
    exportTo: "EMPLOYMENT EmploymentMonthlyIncomeAmount"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_employedByOtherParty",
    value: (employer) =>
      employer?.querySelector("SpecialBorrowerEmployerRelationshipIndicator")
        ?.textContent === "true",
    exportTo: "EMPLOYMENT SpecialBorrowerEmployerRelationshipIndicator"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_position",
    value: (employer) =>
      employer?.querySelector("EmploymentPositionDescription")?.textContent,
    exportTo: "EMPLOYMENT EmploymentPositionDescription"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_businessPhone",
    value: (employer) =>
      employer?.querySelector("ContactPointTelephoneValue")?.textContent,
    exportTo: "LEGAL_ENTITY CONTACTS CONTACT CONTACT_POINTS CONTACT_POINT CONTACT_POINT_TELEPHONE ContactPointTelephoneValue"
  },
];

const liabilitiesConfig = [
  {
    selector: "#accountNo",
    value: (liability) =>
      liability?.querySelector("LiabilityAccountIdentifier")?.textContent,
    exportTo: "LIABILITY_DETAIL LiabilityAccountIdentifier",
  },
  {
    selector: "#liabilityAccType",
    value: (liability) =>
      getLWLiabilityType(
        liability?.querySelector("LiabilityType")?.textContent
      ),
    exportTo: "LIABILITY_DETAIL LiabilityType",
  },
  {
    selector: "#nameAddrOfCompany",
    value: (liability) =>
      liability?.querySelector("LIABILITY_HOLDER FullName")?.textContent,
    exportTo: "LIABILITY_DETAIL LIABILITY_HOLDER FullName",
  },
  {
    selector: "#monthlyPaymentExpenses",
    value: (liability) =>
      liability?.querySelector("LiabilityMonthlyPaymentAmount")?.textContent,
    exportTo: "LIABILITY_DETAIL LiabilityMonthlyPaymentAmount",
  },
  {
    selector: "#monthsLeftToPays",
    value: (liability) =>
      liability?.querySelector("LiabilityRemainingTermMonthsCount")
        ?.textContent,
    exportTo: "LIABILITY_DETAIL LiabilityRemainingTermMonthsCount",
  },
  {
    selector: "#unpaidBalanceExpenses",
    value: (liability) =>
      liability?.querySelector("LiabilityUnpaidBalanceAmount")?.textContent,
    exportTo: "LIABILITY_DETAIL unpaidBalanceExpenses",
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
    const found = mapping.find((item) => item.xml === assetType);
    return found ? found.dom : "Other";
  }
  const found = mapping.find((item) => item.dom === assetType);
  return found ? found.xml : "Other";
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

function getLWSubjPropertyType(propType, isImport = true) {
  const mapping = [
    { xml: "PrimaryResidence", dom: "1" },
    { xml: "Investment", dom: "77" },
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
      const addNewSelector = `#financeAndSecuritie${i === 0 ? "" : "_" + i
        } > div:nth-child(4) > div:nth-child(6) > div > span > span.btn.btn-sm.btn-success.btn-text-primary.btn-icon.ml-2.tooltipClass.cursor-pointer`;
      // span.btn.btn-sm.btn-success.btn-text-primary.btn-icon.ml-2.tooltipClass`;
      // btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass cursor-pointer
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
  publishConfig(assetsConfig, assets);

  // Employers
  const employers = getEmployers(borrower);
  const currentEmployer = employers.filter(
    (employer) => getText(employer, "EmploymentStatusType") === "Current")[0];
  const previousEmployers = employers.filter(
    (employer) => getText(employer, "EmploymentStatusType") !== "Current");
  createEmployerFields(employers);
  publishConfig(currentEmployerConfig, currentEmployer);
  publishConfigItems(prevEmployerConfig, previousEmployers, (i, selector) =>
    selector.replace("{counter}", i + 1)
  );

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
        const element = document.querySelector(selector);
        console.log(item, selector, value, type);
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

  const dealNode = doc
    .ele("DEAL_SETS")
    .ele("DEAL_SET")
    .ele("DEALS")
    .ele("DEAL")


  //Assets
  const assetStartNode = dealNode.com("Assets").ele("ASSETS");
  const domAssets = document.getElementsByName("accountType[]");
  for (let i = 0; i < domAssets.length; i++) {
    const thisNode1 = assetStartNode.ele("ASSET").att("Sequence", i + 1)

    assetConfig.forEach(lConfig => {
      const thisConfig1 = { ...lConfig, selector: `${lConfig.selector}_${i}` }
      if (thisConfig1.exportTo) {
        if (lConfig.selector === "#accountType") {
          const domAccountType = document.querySelector(thisConfig1.selector);
          const xmlAccountValue = getLWAssetType(domAccountType.value, false);
          exportElementToXML(thisConfig1, thisNode1, xmlAccountValue)
        } else {
          exportElementToXML(thisConfig1, thisNode1, null)
        }
      }
    });
  }

  //Assets Real Estate Owned Properties
  const domReo = document.getElementsByName("schedulePropAddr[]");
  for (let i = 0; i < domReo.length; i++) {
    const thisNode1 = assetStartNode.ele("ASSET").att("Sequence", domAssets.length + i + 1)

    reoConfig.forEach(lConfig => {
      const thisConfig1 = { ...lConfig, selector: `${lConfig.selector}_${i}` }
      if (thisConfig1.exportTo) {
        if (lConfig.selector === "#propType") {
          const domAccountType = document.querySelector(thisConfig1.selector);
          const xmlAccountValue = getLWPropertyType(domAccountType.value, false);
          exportElementToXML(thisConfig1, thisNode1, xmlAccountValue)
        } else {
          exportElementToXML(thisConfig1, thisNode1, null)
        }
      }
    });
  }

  //Collaterals (Subject Property)
  const subjectNode = dealNode.com("Collateral").ele("COLLATERALS").ele("COLLATERAL");

  subjectPropertyConfig.forEach((config) => {
    if (!config.exportTo) {
      return;
    }

    if (!Array.isArray(config.selector)) {
      if (config.selector === "#propertyType" || config.selector === "#presentOccupancy") {
        const domAccountType = document.querySelector(config.selector);
        const xmlAccountValue = getLWSubjPropertyType(domAccountType.value, false);
        exportElementToXML(config, subjectNode, xmlAccountValue);
      } else
        exportElementToXML(config, subjectNode);
    } else {
      config.selector.forEach((selector, index) => {
        const elementChecked = document.querySelector(`${selector}:checked`);
        if (elementChecked) {
          exportElementToXML(
            { ...config, selector },
            subjectNode,
            config.exportValues?.[index],
          );
        }
      });
    }
  });


  //Liabilities
  const liabilityStartNode = dealNode.com("Liabilities").ele("LIABILITIES");
  const domLiabilities = document.getElementsByName("liabilityAccType[]");
  for (let i = 0; i < domLiabilities.length; i++) {
    const thisNode = liabilityStartNode.ele("LIABILITY").att("Sequence", i + 1)

    liabilitiesConfig.forEach(lConfig => {
      const thisConfig = { ...lConfig, selector: `${lConfig.selector}_${i + 1}` }
      if (thisConfig.exportTo) {
        if (lConfig.selector === "#liabilityAccType") {
          const domLiabilityType = document.querySelector(thisConfig.selector);
          const xmlLiabilityValue = getLWLiabilityType(domLiabilityType.value, false);
          exportElementToXML(thisConfig, thisNode, xmlLiabilityValue)
        } else if (lConfig.selector === "#accountNo") {
          const domAccType = document.querySelector(thisConfig.selector);
          const accFormat = domAccType.value.replace(/[^0-9]/g, "")
          exportElementToXML(thisConfig, thisNode, accFormat)
        }
        else {
          exportElementToXML(thisConfig, thisNode, null)
        }
      }
    })
  }

  const borrowerPartyNode = dealNode
  .ele("PARTIES")
  .com("First Borrower")
  .ele("PARTY");

  // Borrower
  borrowerConfig.forEach((config) => {
    if (!config.exportTo) {
      return;
    }

    if (!Array.isArray(config.selector)) {
      exportElementToXML(config, borrowerPartyNode);
    } else {
      config.selector.forEach((selector, index) => {
        const elementChecked = document.querySelector(`${selector}:checked`);
        if (elementChecked) {
          exportElementToXML(
            { ...config, selector },
            borrowerPartyNode,
            config.exportValues?.[index],
          );
        }
      });
    }
  });

  // Employment Info - Borrower
  const employmentNode = borrowerPartyNode.com("Employers").ele("EMPLOYERS")
  currentEmployerConfig.forEach((config) => {
    if (!config.exportTo) {
      return;
    }

    if (!Array.isArray(config.selector)) {
      exportElementToXML(config, employmentNode);
    } else {
      config.selector.forEach((selector, index) => {
        const elementChecked = document.querySelector(`${selector}:checked`);
        if (elementChecked) {
          exportElementToXML(
            { ...config, selector },
            employmentNode,
            config.exportValues?.[index],
          );
        }
      });
    }
  });

  // Prev Employment Info - Borrower
  const employmentPrevNode = borrowerPartyNode.com("Prev Employers").ele("EMPLOYERS")
  const preEmploymentArr = document.querySelectorAll('input[id$="nameOfEmployer"][id^="AddiontalEmplInfo"]');
  for (let i = 0; i < preEmploymentArr.length; i++) {
    const thisNode = employmentPrevNode.ele("EMPLOYER").att("Sequence", i + 1)

    prevEmployerConfig.forEach((config) => {
      if (!config.exportTo) {
        return;
      }

      config = { ...config, selector: config.selector.replace("{counter}", i + 1) }

      if ((config.selector.match("#AddiontalEmplInfo")) && (config.selector.match("employedByOtherParty"))) {
        const empIndicator = document.querySelector(`${config.selector}:checked`);
        empIndicator ? exportElementToXML(config, thisNode, "true") : exportElementToXML(config, thisNode, "false");

      } else if ((config.selector.match("#AddiontalEmplInfo")) && (config.selector.match("businessPhone"))) {
        const phoneValue = document.querySelector(config.selector).value;
        const empPhone = phoneValue.substr(0, phoneValue.search("Ext"))
        const empPhoneformated = empPhone.replace(/[^0-9]/g, "")
        exportElementToXML(config, thisNode, empPhoneformated)

      } else
        exportElementToXML(config, thisNode);

    });
  }

  // CoBorrower
  if (document.querySelector("#isCoBorrower").value === "1") {
    const coborrowerPartyNode = borrowerPartyNode.up().com("Second Borrower").ele("PARTY");
    // CoBorrower
    coBorrowerConfig.forEach((config) => {
      if (!config.exportTo) {
        return;
      }

      if (!Array.isArray(config.selector)) {
        exportElementToXML(config, coborrowerPartyNode);
      } else {
        config.selector.forEach((selector, index) => {
          const elementChecked = document.querySelector(`${selector}:checked`);
          if (elementChecked) {
            exportElementToXML(
              { ...config, selector },
              coborrowerPartyNode,
              config.exportValues?.[index],
            );
          }
        });
      }
    });
  };


  // borrowerPartyNode.com("Loan Organization")
  loanOriginatorConfig.forEach((config) => {
    if (!config.exportTo) {
      return;
    }
    if (!Array.isArray(config.selector)) {
      exportElementToXML(config, borrowerPartyNode);
    } else {
      config.selector.forEach((selector, index) => {
        const elementChecked = document.querySelector(`${selector}:checked`);
        if (elementChecked) {
          exportElementToXML(
            { ...config, selector },
            borrowerPartyNode,
            config.exportValues?.[index],
          );
        }
      });
    }
  });

  const xml = doc.end({ prettyPrint: true });
  console.log(xml);
  var a = document.createElement("a");
  blob = new Blob([doc], { type: "application/xml" }),
    url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = "mismoExport";
  a.click();
  window.URL.revokeObjectURL(url);
  return true
}

global.handleImportChange = handleImportChange;
global.handleExportClick = handleExportClick;

function exportElementToXML(config, startNode, hardcodedValue, index) {
  const element = document.querySelector(config.selector);
  let xmlNode = startNode;

  if (element) {
    const eleVal = element.value;
    config.exportTo.split(" ").forEach((tagName) => {
      const foundNode = xmlNode.find((n) => n.node.nodeName === tagName);
      if (foundNode && config?.newTag != tagName) {
        xmlNode = foundNode;
        // } else if (index && config.newTag === tagName) {
        //   xmlNode = xmlNode.ele(tagName).att("Sequence", index);
      } else
        xmlNode = xmlNode.ele(tagName);
    })

    switch (config.selector) {
      case "#phoneNumber":
      case "#cellNo":
      case "#coBPhoneNumber":
      case "#coBCellNumber":
      case "#coBFax":
      case "#employerPhone1":

        xmlNode.txt(eleVal.replace(/[^0-9]/g, ""));
        break;

      case "#workNumber":
        xmlNode.txt(
          eleVal.substr(0, eleVal.search("Ext")).replace(/[^0-9]/g, "")
        );
        xmlNode
          .up()
          .ele("ContactPointTelephoneExtensionValue")
          .txt(eleVal.slice(-4).replace(/[^0-9]/g, ""));
        break;

      case "#mailingAddress":
      case "#mailingZip":
      case "#mailingUnit":
      case "#mailingState":
      case "#mailingCity":
      case "#mailingCountry":
        xmlNode.txt(
          document.getElementById("mailingAddrAsPresent").value === "1"
            ? document.getElementById(
              config.selector.replace("#mailing", "present")
            ).value
            : eleVal
        );
        xmlNode = xmlNode.up();
        const addType = xmlNode.find((c) => c.node.nodeName === "AddressType");
        if (!addType) xmlNode.ele("AddressType").txt("Mailing");
        break;

      case "#coBorrowerMailingAddress":
      case "#coBorrowerMailingCity":
      case "#coBorrowerMailingZip":
      case "#coBorrowerMailingState":

        xmlNode.txt(
          document.getElementById("mailingAddressAsBorrower").value === "1"
            ? document.getElementById(
              config.selector.replace("#coBorrowerMailing", "coBPresent")
            ).value
            : eleVal
        );
        xmlNode = xmlNode.up();
        const addTypeCo = xmlNode.find((c) => c.node.nodeName === "AddressType");
        if (!addTypeCo) xmlNode.ele("AddressType").txt("Mailing");
        break;


      case "#ssn":
      case "#coBSsnNumber":
        xmlNode.txt(eleVal.replace(/[^0-9]/g, ""));
        xmlNode.up().ele("TaxpayerIdentifierType").txt("SocialSecurityNumber");
        break;

      case "#currentRPM":
        xmlNode.txt(
          document.getElementById("borPresentPropType").value === "Rent"
            ? eleVal
            : null
        );
        break;

      case "#borrowerCitizenship_0":
      case "#coBorrowerCitizenship_1":
      case "#isCoBorUSCitizenYes":
        document.querySelector(`${config.selector}:checked`) ? xmlNode.txt("USCitizen") : null
        break;

      case "#borrowerCitizenship_1":
      case "#coBorrowerCitizenship_2":
        document.querySelector(`${config.selector}:checked`) ? xmlNode.txt("PermanentResidentAlien") : null
        break;

      case "#borrowerCitizenship_3":
      case "#coBorrowerCitizenship_3":
        document.querySelector(`${config.selector}:checked`) ? xmlNode.txt("NonPermanentResidentAlien") : null
        break;

      case "#isCoBorUSCitizenNo":
        document.querySelector(`${config.selector}:checked`) ? xmlNode.txt("Unknown") : null
        break;

      case "#maritalStatus_1":
      case "#maritalStatus_2":
      case "#maritalStatus_3":
      case "#maritalStatusCoBor_1":
      case "#maritalStatusCoBor_2":
      case "#maritalStatusCoBor_3":
      case "#isServicingMember_1":
      case "#isServicingMember_2":
        xmlNode.find((c) => c.node.nodeValue) ? null : xmlNode.txt(document.querySelector(`${config.selector}:checked`)?.value);
        break;

      case "#bankruptcyTypes":
        const multiSelect = document.querySelector(config.selector);
        for (var i = 0; i < multiSelect.options.length; i++) {
          if (multiSelect.options[i].selected)
            xmlNode = xmlNode.txt(multiSelect.options[i].value).up().ele("BankruptcyChapterType")
        };
        xmlNode.remove();
        break;

      //Borrower HDMA
      case "#PublishBInfoYes":
        if (document.querySelector(`${config.selector}:checked`)) {
          xmlNode.ele("HMDAEthnicityRefusalIndicator").txt("false")
          xmlNode.ele("HMDAGenderRefusalIndicator").txt("false")
          xmlNode.ele("HMDARaceRefusalIndicator").txt("false")
        } else if (document.querySelector(`#PublishBInfoNo:checked`)) {
          xmlNode.ele("HMDAEthnicityRefusalIndicator").txt("true")
          xmlNode.ele("HMDAGenderRefusalIndicator").txt("true")
          xmlNode.ele("HMDARaceRefusalIndicator").txt("true")
        } else {
          xmlNode.ele("HMDAEthnicityRefusalIndicator").txt("")
          xmlNode.ele("HMDAGenderRefusalIndicator").txt("")
          xmlNode.ele("HMDARaceRefusalIndicator").txt("")
        }

        if (document.querySelector(`#bFiEthnicityYes:checked`)) {
          xmlNode.ele("HMDAEthnicityCollectedBasedOnVisualObservationOrSurnameIndicator").txt("true")
        } else if (document.querySelector(`#bFiEthnicityNo:checked`)) {
          xmlNode.ele("HMDAEthnicityCollectedBasedOnVisualObservationOrSurnameIndicator").txt("false")
        } else {
          xmlNode.ele("HMDAEthnicityCollectedBasedOnVisualObservationOrSurnameIndicator").txt("")
        }

        if (document.querySelector(`#bFiSexYes:checked`)) {
          xmlNode.ele("HMDAGenderCollectedBasedOnVisualObservationOrNameIndicator").txt("true")
        } else if (document.querySelector(`#bFiEthnicityNo:checked`)) {
          xmlNode.ele("HMDAGenderCollectedBasedOnVisualObservationOrNameIndicator").txt("false")
        } else {
          xmlNode.ele("HMDAGenderCollectedBasedOnVisualObservationOrNameIndicator").txt("")
        }

        if (document.querySelector(`#bFiRaceYes:checked`)) {
          xmlNode.ele("HMDARaceCollectedBasedOnVisualObservationOrSurnameIndicator").txt("true")
        } else if (document.querySelector(`#bFiEthnicityNo:checked`)) {
          xmlNode.ele("HMDARaceCollectedBasedOnVisualObservationOrSurnameIndicator").txt("false")
        } else {
          xmlNode.ele("HMDARaceCollectedBasedOnVisualObservationOrSurnameIndicator").txt("")
        }
        break;

      case "#BGendeMale":
      case "#BGenderFE":
      case "#BGenderNotDis":

        if (!xmlNode.find((c) => c.node.nodeValue) && document.querySelector(`${config.selector}:checked`))
          xmlNode.txt(config.mismoValue)

        const appMTBor = document.querySelector(`#bDemoInfo1:checked`) ? "FaceToFace" :
          document.querySelector(`#bDemoInfo2:checked`) ? "Telephone" :
            document.querySelector(`#bDemoInfo3:checked`) ? "Fax" :
              document.querySelector(`#bDemoInfo4:checked`) ? "Email" : "";
        xmlNode = xmlNode.up()
        xmlNode.find((c) => c.node.nodeName === `ULAD:ApplicationTakeMethodType`) ? null :
          xmlNode.ele(`ULAD:ApplicationTakeMethodType`).txt(appMTBor);
        break;

      case "#BRace1":
      case "#BRace2":
      case "#BRace3":
      case "#BRace4":
      case "#BRace5":
      case "#BRace6":
      case "#BEthnicityH":
      case "#BEthnicityNH":
      case "#BEthnicityND":

        if (!xmlNode.find((c) => c.node.nodeValue) && document.querySelector(`${config.selector}:checked`))
          xmlNode.txt(config.mismoValue);

        if (config.selector === "#BEthnicityH" && document.querySelector(`#BEthnicityH:checked`)) {
          const ethnicities = document.getElementsByName(`bFiEthnicitySub`)
          ethnicities.forEach(ethnicity => {
            if (document.querySelector(`#${ethnicity.id}:checked`)) {
              const valArr = ["Mexican", "PuertoRican", "Cuban", "Other"]
              xmlNode = xmlNode.up().up().up().up().up().up();
              xmlNode.ele("HMDA_ETHNICITY_ORIGINS")
                .ele("HMDA_ETHNICITY_ORIGIN")
                .ele("HMDAEthnicityOriginType")
                .txt(valArr[ethnicity.value - 1]);
            }
          })
        }
        break;

      //CoBorrower HDMA
      case "#PublishCBInfo2":
        if (document.querySelector(`${config.selector}:checked`)) {
          xmlNode.ele("HMDAEthnicityRefusalIndicator").txt("false")
          xmlNode.ele("HMDAGenderRefusalIndicator").txt("false")
          xmlNode.ele("HMDARaceRefusalIndicator").txt("false")
        } else if (document.querySelector(`#PublishCBInfo1:checked`)) {
          xmlNode.ele("HMDAEthnicityRefusalIndicator").txt("true")
          xmlNode.ele("HMDAGenderRefusalIndicator").txt("true")
          xmlNode.ele("HMDARaceRefusalIndicator").txt("true")
        } else {
          xmlNode.ele("HMDAEthnicityRefusalIndicator").txt("")
          xmlNode.ele("HMDAGenderRefusalIndicator").txt("")
          xmlNode.ele("HMDARaceRefusalIndicator").txt("")
        }

        if (document.querySelector(`#CBFiEthnicityYes:checked`)) {
          xmlNode.ele("HMDAEthnicityCollectedBasedOnVisualObservationOrSurnameIndicator").txt("true")
        } else if (document.querySelector(`#CBFiEthnicityNo:checked`)) {
          xmlNode.ele("HMDAEthnicityCollectedBasedOnVisualObservationOrSurnameIndicator").txt("false")
        } else {
          xmlNode.ele("HMDAEthnicityCollectedBasedOnVisualObservationOrSurnameIndicator").txt("")
        }

        if (document.querySelector(`#CBFiGenderYes:checked`)) {
          xmlNode.ele("HMDAGenderCollectedBasedOnVisualObservationOrNameIndicator").txt("true")
        } else if (document.querySelector(`#CBFiGenderNo:checked`)) {
          xmlNode.ele("HMDAGenderCollectedBasedOnVisualObservationOrNameIndicator").txt("false")
        } else {
          xmlNode.ele("HMDAGenderCollectedBasedOnVisualObservationOrNameIndicator").txt("")
        }

        if (document.querySelector(`#CBFiRaceYes:checked`)) {
          xmlNode.ele("HMDARaceCollectedBasedOnVisualObservationOrSurnameIndicator").txt("true")
        } else if (document.querySelector(`#CBFiRaceNo:checked`)) {
          xmlNode.ele("HMDARaceCollectedBasedOnVisualObservationOrSurnameIndicator").txt("false")
        } else {
          xmlNode.ele("HMDARaceCollectedBasedOnVisualObservationOrSurnameIndicator").txt("")
        }
        break;

      case "#CBGender2":
      case "#CBGender1":
      case "#CBGender3":

        if (!xmlNode.find((c) => c.node.nodeValue) && document.querySelector(`${config.selector}:checked`))
          xmlNode.txt(config.mismoValue)

        const appMTCoBor = document.querySelector(`#CBDDemoInfo1:checked`) ? "FaceToFace" :
          document.querySelector(`#CBDDemoInfo2:checked`) ? "Telephone" :
            document.querySelector(`#CBDDemoInfo3:checked`) ? "Fax" :
              document.querySelector(`#CBDDemoInfo4:checked`) ? "Email" : "";
        xmlNode = xmlNode.up()
        xmlNode.find((c) => c.node.nodeName === `ULAD:ApplicationTakeMethodType`) ? null :
          xmlNode.ele(`ULAD:ApplicationTakeMethodType`).txt(appMTCoBor);
        break;

      case "#CBRace1":
      case "#CBRace2":
      case "#CBRace3":
      case "#CBRace4":
      case "#CBRace5":
      case "#CBRace6":
      case "#CBEthnicity1":
      case "#CBEthnicity2":
      case "#CBEthnicity3":

        if (!xmlNode.find((c) => c.node.nodeValue) && document.querySelector(`${config.selector}:checked`))
          xmlNode.txt(config.mismoValue);

        if (config.selector === "#CBEthnicity2" && document.querySelector(`#CBEthnicity2:checked`)) {
          const ethnicitiesCo = document.getElementsByName(`CBEthnicitySub`)
          ethnicitiesCo.forEach(ethnicity => {
            if (document.querySelector(`#${ethnicity.id}:checked`)) {
              const valArrCo = ["Mexican", "PuertoRican", "Cuban", "Other"]
              xmlNode = xmlNode.up().up().up().up().up().up();
              xmlNode.ele("HMDA_ETHNICITY_ORIGINS")
                .ele("HMDA_ETHNICITY_ORIGIN")
                .ele("HMDAEthnicityOriginType")
                .txt(valArrCo[ethnicity.value - 1]);
            }
          })
        }
        break;

      case "#grossIncome1":
      case "#commissionOrBonus1":
      case "#militaryIncome1":
      case "#overtime1":
      case "#netRental1":
      case "#netEarnedInterest1":
      case "#capitalGains1":
      case "#partnership1":
      case "#otherHouseHold1":
      case "#grossIncome2":
      case "#commissionOrBonus2":
      // case "#militaryIncome1":
      case "#overtime2":
      case "#netRental2":
      case "#netEarnedInterest2":
      case "#capitalGains2":
      case "#partnership2":
      case "#otherHouseHold2":

        xmlNode.txt(eleVal)
          .up().ele("IncomeType").txt(config.incomeType)
          .up().ele("EmploymentIncomeIndicator").txt("true")
        break;

      case "#occupation1":
        xmlNode.txt(eleVal)
          .up().ele("EmploymentStatusType").txt("Current")
        break;

      default:
        xmlNode.txt(hardcodedValue || eleVal);
    }
    if (config.dependency) {
      xmlNode = startNode;
      config?.dependency.tag
        .split(" ")
        .forEach(_child => {
          const foundNodeDep = xmlNode.find((n) => n.node.nodeName === _child);
          if (foundNodeDep && config.dependency?.duplicate != _child) xmlNode = foundNodeDep;
          else xmlNode = xmlNode.ele(_child);
        })
      xmlNode.txt(config?.dependency.value);
    }
  }
}
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"moment":2,"xmlbuilder2":3}],2:[function(require,module,exports){
//! moment.js
//! version : 2.29.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

    var hookCallback;

    function hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return (
            input instanceof Array ||
            Object.prototype.toString.call(input) === '[object Array]'
        );
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return (
            input != null &&
            Object.prototype.toString.call(input) === '[object Object]'
        );
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(obj).length === 0;
        } else {
            var k;
            for (k in obj) {
                if (hasOwnProp(obj, k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return (
            typeof input === 'number' ||
            Object.prototype.toString.call(input) === '[object Number]'
        );
    }

    function isDate(input) {
        return (
            input instanceof Date ||
            Object.prototype.toString.call(input) === '[object Date]'
        );
    }

    function map(arr, fn) {
        var res = [],
            i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false,
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this),
                len = t.length >>> 0,
                i;

            for (i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m),
                parsedParts = some.call(flags.parsedDateParts, function (i) {
                    return i != null;
                }),
                isNowValid =
                    !isNaN(m._d.getTime()) &&
                    flags.overflow < 0 &&
                    !flags.empty &&
                    !flags.invalidEra &&
                    !flags.invalidMonth &&
                    !flags.invalidWeekday &&
                    !flags.weekdayMismatch &&
                    !flags.nullInput &&
                    !flags.invalidFormat &&
                    !flags.userInvalidated &&
                    (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid =
                    isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            } else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = (hooks.momentProperties = []),
        updateInProgress = false;

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return (
            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
        );
    }

    function warn(msg) {
        if (
            hooks.suppressDeprecationWarnings === false &&
            typeof console !== 'undefined' &&
            console.warn
        ) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [],
                    arg,
                    i,
                    key;
                for (i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (key in arguments[0]) {
                            if (hasOwnProp(arguments[0], key)) {
                                arg += key + ': ' + arguments[0][key] + ', ';
                            }
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(
                    msg +
                        '\nArguments: ' +
                        Array.prototype.slice.call(args).join('') +
                        '\n' +
                        new Error().stack
                );
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return (
            (typeof Function !== 'undefined' && input instanceof Function) ||
            Object.prototype.toString.call(input) === '[object Function]'
        );
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            if (hasOwnProp(config, i)) {
                prop = config[i];
                if (isFunction(prop)) {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' +
                /\d{1,2}/.source
        );
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig),
            prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (
                hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])
            ) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i,
                res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L',
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (
            (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
            absNumber
        );
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        formatFunctions = {},
        formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(
                    func.apply(this, arguments),
                    token
                );
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i,
            length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i])
                    ? array[i].call(mom, format)
                    : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] =
            formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(
                localFormattingTokens,
                replaceLongDateFormatTokens
            );
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A',
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper
            .match(formattingTokens)
            .map(function (tok) {
                if (
                    tok === 'MMMM' ||
                    tok === 'MM' ||
                    tok === 'DD' ||
                    tok === 'dddd'
                ) {
                    return tok.slice(1);
                }
                return tok;
            })
            .join('');

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d',
        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        w: 'a week',
        ww: '%d weeks',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years',
    };

    function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output)
            ? output(number, withoutSuffix, string, isFuture)
            : output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string'
            ? aliases[units] || aliases[units.toLowerCase()]
            : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [],
            u;
        for (u in unitsObj) {
            if (hasOwnProp(unitsObj, u)) {
                units.push({ unit: u, priority: priorities[u] });
            }
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function absFloor(number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function makeGetSet(unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        return mom.isValid()
            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
            : NaN;
    }

    function set$1(mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (
                unit === 'FullYear' &&
                isLeapYear(mom.year()) &&
                mom.month() === 1 &&
                mom.date() === 29
            ) {
                value = toInt(value);
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
                    value,
                    mom.month(),
                    daysInMonth(value, mom.month())
                );
            } else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }

    function stringSet(units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units),
                i;
            for (i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    var match1 = /\d/, //       0 - 9
        match2 = /\d\d/, //      00 - 99
        match3 = /\d{3}/, //     000 - 999
        match4 = /\d{4}/, //    0000 - 9999
        match6 = /[+-]?\d{6}/, // -999999 - 999999
        match1to2 = /\d\d?/, //       0 - 99
        match3to4 = /\d\d\d\d?/, //     999 - 9999
        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
        match1to3 = /\d{1,3}/, //       0 - 999
        match1to4 = /\d{1,4}/, //       0 - 9999
        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
        matchUnsigned = /\d+/, //       0 - inf
        matchSigned = /[+-]?\d+/, //    -inf - inf
        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        // any word (or two) characters or numbers including two/three word month in arabic.
        // includes scottish gaelic two word and hyphenated months
        matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
        regexes;

    regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex)
            ? regex
            : function (isStrict, localeData) {
                  return isStrict && strictRegex ? strictRegex : regex;
              };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(
            s
                .replace('\\', '')
                .replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (
                    matched,
                    p1,
                    p2,
                    p3,
                    p4
                ) {
                    return p1 || p2 || p3 || p4;
                })
        );
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i,
            func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,
        WEEK = 7,
        WEEKDAY = 8;

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1
            ? isLeapYear(year)
                ? 29
                : 28
            : 31 - ((modMonth % 7) % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
            '_'
        ),
        defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split(
            '_'
        ),
        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        defaultMonthsShortRegex = matchWord,
        defaultMonthsRegex = matchWord;

    function localeMonths(m, format) {
        if (!m) {
            return isArray(this._months)
                ? this._months
                : this._months['standalone'];
        }
        return isArray(this._months)
            ? this._months[m.month()]
            : this._months[
                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
                      ? 'format'
                      : 'standalone'
              ][m.month()];
    }

    function localeMonthsShort(m, format) {
        if (!m) {
            return isArray(this._monthsShort)
                ? this._monthsShort
                : this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort)
            ? this._monthsShort[m.month()]
            : this._monthsShort[
                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
              ][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i,
            ii,
            mom,
            llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp(
                    '^' + this.months(mom, '').replace('.', '') + '$',
                    'i'
                );
                this._shortMonthsParse[i] = new RegExp(
                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
                    'i'
                );
            }
            if (!strict && !this._monthsParse[i]) {
                regex =
                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'MMMM' &&
                this._longMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'MMM' &&
                this._shortMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict
                ? this._monthsShortStrictRegex
                : this._monthsShortRegex;
        }
    }

    function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict
                ? this._monthsStrictRegex
                : this._monthsRegex;
        }
    }

    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._monthsShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] =
            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function createDate(y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate(y) {
        var date, args;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear,
            resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear,
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek,
            resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear,
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (
        input,
        week,
        config,
        token
    ) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6, // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd', function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd', function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
            '_'
        ),
        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        defaultWeekdaysRegex = matchWord,
        defaultWeekdaysShortRegex = matchWord,
        defaultWeekdaysMinRegex = matchWord;

    function localeWeekdays(m, format) {
        var weekdays = isArray(this._weekdays)
            ? this._weekdays
            : this._weekdays[
                  m && m !== true && this._weekdays.isFormat.test(format)
                      ? 'format'
                      : 'standalone'
              ];
        return m === true
            ? shiftWeekdays(weekdays, this._week.dow)
            : m
            ? weekdays[m.day()]
            : weekdays;
    }

    function localeWeekdaysShort(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : m
            ? this._weekdaysShort[m.day()]
            : this._weekdaysShort;
    }

    function localeWeekdaysMin(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : m
            ? this._weekdaysMin[m.day()]
            : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i,
            ii,
            mom,
            llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._shortWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._minWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
            }
            if (!this._weekdaysParse[i]) {
                regex =
                    '^' +
                    this.weekdays(mom, '') +
                    '|^' +
                    this.weekdaysShort(mom, '') +
                    '|^' +
                    this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'dddd' &&
                this._fullWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'ddd' &&
                this._shortWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'dd' &&
                this._minWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict
                ? this._weekdaysStrictRegex
                : this._weekdaysRegex;
        }
    }

    function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict
                ? this._weekdaysShortStrictRegex
                : this._weekdaysShortRegex;
        }
    }

    function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict
                ? this._weekdaysMinStrictRegex
                : this._weekdaysMinRegex;
        }
    }

    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [],
            shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom,
            minp,
            shortp,
            longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = regexEscape(this.weekdaysMin(mom, ''));
            shortp = regexEscape(this.weekdaysShort(mom, ''));
            longp = regexEscape(this.weekdays(mom, ''));
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._weekdaysShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
        this._weekdaysMinStrictRegex = new RegExp(
            '^(' + minPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return (
            '' +
            hFormat.apply(this) +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return (
            '' +
            this.hours() +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(
                this.hours(),
                this.minutes(),
                lowercase
            );
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('k', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return (input + '').toLowerCase().charAt(0) === 'p';
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
        // Setting the hour should keep the time, because the user explicitly
        // specified which hour they want. So trying to maintain the same hour (in
        // a new timezone) makes sense. Adding/subtracting hours does not follow
        // this rule.
        getSetHour = makeGetSet('Hours', true);

    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse,
    };

    // internal storage for locale config files
    var locales = {},
        localeFamilies = {},
        globalLocale;

    function commonPrefix(arr1, arr2) {
        var i,
            minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
            if (arr1[i] !== arr2[i]) {
                return i;
            }
        }
        return minl;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (
                    next &&
                    next.length >= j &&
                    commonPrefix(split, next) >= j - 1
                ) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null,
            aliasedRequire;
        // TODO: Find a better way to register and load all the locales in Node
        if (
            locales[name] === undefined &&
            typeof module !== 'undefined' &&
            module &&
            module.exports
        ) {
            try {
                oldLocale = globalLocale._abbr;
                aliasedRequire = require;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {
                // mark as not found to avoid repeating expensive file require call causing high CPU
                // when trying to find en-US, en_US, en-us for every format call
                locales[name] = null; // null means not found
            }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            } else {
                if (typeof console !== 'undefined' && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn(
                        'Locale ' + key + ' not found. Did you forget to load it?'
                    );
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, config) {
        if (config !== null) {
            var locale,
                parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple(
                    'defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
                );
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config,
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale,
                tmpLocale,
                parentConfig = baseConfig;

            if (locales[name] != null && locales[name].parentLocale != null) {
                // Update existing child locale in-place to avoid memory-leaks
                locales[name].set(mergeConfigs(locales[name]._config, config));
            } else {
                // MERGE
                tmpLocale = loadLocale(name);
                if (tmpLocale != null) {
                    parentConfig = tmpLocale._config;
                }
                config = mergeConfigs(parentConfig, config);
                if (tmpLocale == null) {
                    // updateLocale is called for creating a new locale
                    // Set abbr so it will have a name (getters return
                    // undefined otherwise).
                    config.abbr = name;
                }
                locale = new Locale(config);
                locale.parentLocale = locales[name];
                locales[name] = locale;
            }

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                    if (name === getSetGlobalLocale()) {
                        getSetGlobalLocale(name);
                    }
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow(m) {
        var overflow,
            a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH] < 0 || a[MONTH] > 11
                    ? MONTH
                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
                    ? DATE
                    : a[HOUR] < 0 ||
                      a[HOUR] > 24 ||
                      (a[HOUR] === 24 &&
                          (a[MINUTE] !== 0 ||
                              a[SECOND] !== 0 ||
                              a[MILLISECOND] !== 0))
                    ? HOUR
                    : a[MINUTE] < 0 || a[MINUTE] > 59
                    ? MINUTE
                    : a[SECOND] < 0 || a[SECOND] > 59
                    ? SECOND
                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
                    ? MILLISECOND
                    : -1;

            if (
                getParsingFlags(m)._overflowDayOfYear &&
                (overflow < YEAR || overflow > DATE)
            ) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
            ['YYYY-DDD', /\d{4}-\d{3}/],
            ['YYYY-MM', /\d{4}-\d\d/, false],
            ['YYYYYYMMDD', /[+-]\d{10}/],
            ['YYYYMMDD', /\d{8}/],
            ['GGGG[W]WWE', /\d{4}W\d{3}/],
            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
            ['YYYYDDD', /\d{7}/],
            ['YYYYMM', /\d{6}/, false],
            ['YYYY', /\d{4}/, false],
        ],
        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
            ['HH:mm', /\d\d:\d\d/],
            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
            ['HHmmss', /\d\d\d\d\d\d/],
            ['HHmm', /\d\d\d\d/],
            ['HH', /\d\d/],
        ],
        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
        rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
        obsOffsets = {
            UT: 0,
            GMT: 0,
            EDT: -4 * 60,
            EST: -5 * 60,
            CDT: -5 * 60,
            CST: -6 * 60,
            MDT: -6 * 60,
            MST: -7 * 60,
            PDT: -7 * 60,
            PST: -8 * 60,
        };

    // date from iso format
    function configFromISO(config) {
        var i,
            l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime,
            dateFormat,
            timeFormat,
            tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    function extractFromRFC2822Strings(
        yearStr,
        monthStr,
        dayStr,
        hourStr,
        minuteStr,
        secondStr
    ) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10),
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s
            .replace(/\([^)]*\)|[\n\t]/g, ' ')
            .replace(/(\s\s+)/g, ' ')
            .replace(/^\s\s*/, '')
            .replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(
                    parsedInput[0],
                    parsedInput[1],
                    parsedInput[2]
                ).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10),
                m = hm % 100,
                h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)),
            parsedArray;
        if (match) {
            parsedArray = extractFromRFC2822Strings(
                match[4],
                match[3],
                match[2],
                match[5],
                match[6],
                match[7]
            );
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        if (config._strict) {
            config._isValid = false;
        } else {
            // Final attempt, use Input Fallback
            hooks.createFromInputFallback(config);
        }
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
            'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [
                nowValue.getUTCFullYear(),
                nowValue.getUTCMonth(),
                nowValue.getUTCDate(),
            ];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i,
            date,
            input = [],
            currentDate,
            expectedWeekday,
            yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (
                config._dayOfYear > daysInYear(yearToUse) ||
                config._dayOfYear === 0
            ) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] =
                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (
            config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0
        ) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(
            null,
            input
        );
        expectedWeekday = config._useUTC
            ? config._d.getUTCDay()
            : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (
            config._w &&
            typeof config._w.d !== 'undefined' &&
            config._w.d !== expectedWeekday
        ) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(
                w.GG,
                config._a[YEAR],
                weekOfYear(createLocal(), 1, 4).year
            );
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i,
            parsedInput,
            tokens,
            token,
            skipped,
            stringLength = string.length,
            totalParsedInputLength = 0,
            era;

        tokens =
            expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
                [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(
                    string.indexOf(parsedInput) + parsedInput.length
                );
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver =
            stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (
            config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0
        ) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(
            config._locale,
            config._a[HOUR],
            config._meridiem
        );

        // handle era
        era = getParsingFlags(config).era;
        if (era !== null) {
            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
        }

        configFromArray(config);
        checkOverflow(config);
    }

    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,
            scoreToBeat,
            i,
            currentScore,
            validFormatFound,
            bestFormatIsValid = false;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            validFormatFound = false;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (isValid(tempConfig)) {
                validFormatFound = true;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (!bestFormatIsValid) {
                if (
                    scoreToBeat == null ||
                    currentScore < scoreToBeat ||
                    validFormatFound
                ) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                    if (validFormatFound) {
                        bestFormatIsValid = true;
                    }
                }
            } else {
                if (currentScore < scoreToBeat) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                }
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i),
            dayOrDate = i.day === undefined ? i.date : i.day;
        config._a = map(
            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
            function (obj) {
                return obj && parseInt(obj, 10);
            }
        );

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (format === true || format === false) {
            strict = format;
            format = undefined;
        }

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if (
            (isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)
        ) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other < this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        ),
        prototypeMax = deprecate(
            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other > this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +new Date();
    };

    var ordering = [
        'year',
        'quarter',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond',
    ];

    function isDurationValid(m) {
        var key,
            unitHasDecimal = false,
            i;
        for (key in m) {
            if (
                hasOwnProp(m, key) &&
                !(
                    indexOf.call(ordering, key) !== -1 &&
                    (m[key] == null || !isNaN(m[key]))
                )
            ) {
                return false;
            }
        }

        for (i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds =
            +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days + weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + quarters * 3 + years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (
                (dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
            ) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    // FORMATTING

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset(),
                sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return (
                sign +
                zeroFill(~~(offset / 60), 2) +
                separator +
                zeroFill(~~offset % 60, 2)
            );
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher),
            chunk,
            parts,
            minutes;

        if (matches === null) {
            return null;
        }

        chunk = matches[matches.length - 1] || [];
        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff =
                (isMoment(input) || isDate(input)
                    ? input.valueOf()
                    : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset());
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(
                        this,
                        createDuration(input - offset, 'm'),
                        1,
                        false
                    );
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {},
            other;

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted =
                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        // and further modified to allow for strings containing both week and day
        isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration(input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months,
            };
        } else if (isNumber(input) || !isNaN(+input)) {
            duration = {};
            if (key) {
                duration[key] = +input;
            } else {
                duration.milliseconds = +input;
            }
        } else if ((match = aspNetRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
            };
        } else if ((match = isoRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                w: parseIso(match[4], sign),
                d: parseIso(match[5], sign),
                h: parseIso(match[6], sign),
                m: parseIso(match[7], sign),
                s: parseIso(match[8], sign),
            };
        } else if (duration == null) {
            // checks for null or undefined
            duration = {};
        } else if (
            typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)
        ) {
            diffRes = momentsDifference(
                createLocal(duration.from),
                createLocal(duration.to)
            );

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
            ret._isValid = input._isValid;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months =
            other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +base.clone().add(res.months, 'M');

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return { milliseconds: 0, months: 0 };
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(
                    name,
                    'moment().' +
                        name +
                        '(period, number) is deprecated. Please use moment().' +
                        name +
                        '(number, period). ' +
                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
                );
                tmp = val;
                val = period;
                period = tmp;
            }

            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add = createAdder(1, 'add'),
        subtract = createAdder(-1, 'subtract');

    function isString(input) {
        return typeof input === 'string' || input instanceof String;
    }

    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
    function isMomentInput(input) {
        return (
            isMoment(input) ||
            isDate(input) ||
            isString(input) ||
            isNumber(input) ||
            isNumberOrStringArray(input) ||
            isMomentInputObject(input) ||
            input === null ||
            input === undefined
        );
    }

    function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'years',
                'year',
                'y',
                'months',
                'month',
                'M',
                'days',
                'day',
                'd',
                'dates',
                'date',
                'D',
                'hours',
                'hour',
                'h',
                'minutes',
                'minute',
                'm',
                'seconds',
                'second',
                's',
                'milliseconds',
                'millisecond',
                'ms',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function isNumberOrStringArray(input) {
        var arrayTest = isArray(input),
            dataTypeTest = false;
        if (arrayTest) {
            dataTypeTest =
                input.filter(function (item) {
                    return !isNumber(item) && isString(input);
                }).length === 0;
        }
        return arrayTest && dataTypeTest;
    }

    function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'sameDay',
                'nextDay',
                'lastDay',
                'nextWeek',
                'lastWeek',
                'sameElse',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6
            ? 'sameElse'
            : diff < -1
            ? 'lastWeek'
            : diff < 0
            ? 'lastDay'
            : diff < 1
            ? 'sameDay'
            : diff < 2
            ? 'nextDay'
            : diff < 7
            ? 'nextWeek'
            : 'sameElse';
    }

    function calendar$1(time, formats) {
        // Support for single parameter, formats only overload to the calendar function
        if (arguments.length === 1) {
            if (!arguments[0]) {
                time = undefined;
                formats = undefined;
            } else if (isMomentInput(arguments[0])) {
                time = arguments[0];
                formats = undefined;
            } else if (isCalendarSpec(arguments[0])) {
                formats = arguments[0];
                time = undefined;
            }
        }
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse',
            output =
                formats &&
                (isFunction(formats[format])
                    ? formats[format].call(this, now)
                    : formats[format]);

        return this.format(
            output || this.localeData().calendar(format, this, createLocal(now))
        );
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween(from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (
            (inclusivity[0] === '('
                ? this.isAfter(localFrom, units)
                : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')'
                ? this.isBefore(localTo, units)
                : !this.isAfter(localTo, units))
        );
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return (
                this.clone().startOf(units).valueOf() <= inputMs &&
                inputMs <= this.clone().endOf(units).valueOf()
            );
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that, zoneDelta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year':
                output = monthDiff(this, that) / 12;
                break;
            case 'month':
                output = monthDiff(this, that);
                break;
            case 'quarter':
                output = monthDiff(this, that) / 3;
                break;
            case 'second':
                output = (this - that) / 1e3;
                break; // 1000
            case 'minute':
                output = (this - that) / 6e4;
                break; // 1000 * 60
            case 'hour':
                output = (this - that) / 36e5;
                break; // 1000 * 60 * 60
            case 'day':
                output = (this - that - zoneDelta) / 864e5;
                break; // 1000 * 60 * 60 * 24, negate dst
            case 'week':
                output = (this - that - zoneDelta) / 6048e5;
                break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default:
                output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        if (a.date() < b.date()) {
            // end-of-month calculations work correct when the start month has more
            // days than the end month.
            return -monthDiff(b, a);
        }
        // difference in months
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2,
            adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true,
            m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(
                m,
                utc
                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
            );
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
                    .toISOString()
                    .replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(
            m,
            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
        );
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect() {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment',
            zone = '',
            prefix,
            year,
            datetime,
            suffix;
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        prefix = '[' + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
        datetime = '-MM-DD[T]HH:mm:ss.SSS';
        suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputString) {
        if (!inputString) {
            inputString = this.isUtc()
                ? hooks.defaultFormatUtc
                : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ to: this, from: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ from: this, to: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData() {
        return this._locale;
    }

    var MS_PER_SECOND = 1000,
        MS_PER_MINUTE = 60 * MS_PER_SECOND,
        MS_PER_HOUR = 60 * MS_PER_MINUTE,
        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return ((dividend % divisor) + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(
                    this.year(),
                    this.month() - (this.month() % 3),
                    1
                );
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - this.weekday()
                );
                break;
            case 'isoWeek':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - (this.isoWeekday() - 1)
                );
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(
                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                    MS_PER_HOUR
                );
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time =
                    startOfDate(
                        this.year(),
                        this.month() - (this.month() % 3) + 3,
                        1
                    ) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - this.weekday() + 7
                    ) - 1;
                break;
            case 'isoWeek':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - (this.isoWeekday() - 1) + 7
                    ) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time +=
                    MS_PER_HOUR -
                    mod$1(
                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                        MS_PER_HOUR
                    ) -
                    1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }

    function unix() {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate() {
        return new Date(this.valueOf());
    }

    function toArray() {
        var m = this;
        return [
            m.year(),
            m.month(),
            m.date(),
            m.hour(),
            m.minute(),
            m.second(),
            m.millisecond(),
        ];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds(),
        };
    }

    function toJSON() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2() {
        return isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict,
        };
    }

    addFormatToken('N', 0, 0, 'eraAbbr');
    addFormatToken('NN', 0, 0, 'eraAbbr');
    addFormatToken('NNN', 0, 0, 'eraAbbr');
    addFormatToken('NNNN', 0, 0, 'eraName');
    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
    addFormatToken('y', ['yy', 2], 0, 'eraYear');
    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

    addRegexToken('N', matchEraAbbr);
    addRegexToken('NN', matchEraAbbr);
    addRegexToken('NNN', matchEraAbbr);
    addRegexToken('NNNN', matchEraName);
    addRegexToken('NNNNN', matchEraNarrow);

    addParseToken(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (
        input,
        array,
        config,
        token
    ) {
        var era = config._locale.erasParse(input, token, config._strict);
        if (era) {
            getParsingFlags(config).era = era;
        } else {
            getParsingFlags(config).invalidEra = input;
        }
    });

    addRegexToken('y', matchUnsigned);
    addRegexToken('yy', matchUnsigned);
    addRegexToken('yyy', matchUnsigned);
    addRegexToken('yyyy', matchUnsigned);
    addRegexToken('yo', matchEraYearOrdinal);

    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
    addParseToken(['yo'], function (input, array, config, token) {
        var match;
        if (config._locale._eraYearOrdinalRegex) {
            match = input.match(config._locale._eraYearOrdinalRegex);
        }

        if (config._locale.eraYearOrdinalParse) {
            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
        } else {
            array[YEAR] = parseInt(input, 10);
        }
    });

    function localeEras(m, format) {
        var i,
            l,
            date,
            eras = this._eras || getLocale('en')._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
            switch (typeof eras[i].since) {
                case 'string':
                    // truncate time
                    date = hooks(eras[i].since).startOf('day');
                    eras[i].since = date.valueOf();
                    break;
            }

            switch (typeof eras[i].until) {
                case 'undefined':
                    eras[i].until = +Infinity;
                    break;
                case 'string':
                    // truncate time
                    date = hooks(eras[i].until).startOf('day').valueOf();
                    eras[i].until = date.valueOf();
                    break;
            }
        }
        return eras;
    }

    function localeErasParse(eraName, format, strict) {
        var i,
            l,
            eras = this.eras(),
            name,
            abbr,
            narrow;
        eraName = eraName.toUpperCase();

        for (i = 0, l = eras.length; i < l; ++i) {
            name = eras[i].name.toUpperCase();
            abbr = eras[i].abbr.toUpperCase();
            narrow = eras[i].narrow.toUpperCase();

            if (strict) {
                switch (format) {
                    case 'N':
                    case 'NN':
                    case 'NNN':
                        if (abbr === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNN':
                        if (name === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNNN':
                        if (narrow === eraName) {
                            return eras[i];
                        }
                        break;
                }
            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
                return eras[i];
            }
        }
    }

    function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? +1 : -1;
        if (year === undefined) {
            return hooks(era.since).year();
        } else {
            return hooks(era.since).year() + (year - era.offset) * dir;
        }
    }

    function getEraName() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].name;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].name;
            }
        }

        return '';
    }

    function getEraNarrow() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].narrow;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].narrow;
            }
        }

        return '';
    }

    function getEraAbbr() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].abbr;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].abbr;
            }
        }

        return '';
    }

    function getEraYear() {
        var i,
            l,
            dir,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            dir = eras[i].since <= eras[i].until ? +1 : -1;

            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (
                (eras[i].since <= val && val <= eras[i].until) ||
                (eras[i].until <= val && val <= eras[i].since)
            ) {
                return (
                    (this.year() - hooks(eras[i].since).year()) * dir +
                    eras[i].offset
                );
            }
        }

        return this.year();
    }

    function erasNameRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNameRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNameRegex : this._erasRegex;
    }

    function erasAbbrRegex(isStrict) {
        if (!hasOwnProp(this, '_erasAbbrRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
    }

    function erasNarrowRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNarrowRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
    }

    function matchEraAbbr(isStrict, locale) {
        return locale.erasAbbrRegex(isStrict);
    }

    function matchEraName(isStrict, locale) {
        return locale.erasNameRegex(isStrict);
    }

    function matchEraNarrow(isStrict, locale) {
        return locale.erasNarrowRegex(isStrict);
    }

    function matchEraYearOrdinal(isStrict, locale) {
        return locale._eraYearOrdinalRegex || matchUnsigned;
    }

    function computeErasParse() {
        var abbrPieces = [],
            namePieces = [],
            narrowPieces = [],
            mixedPieces = [],
            i,
            l,
            eras = this.eras();

        for (i = 0, l = eras.length; i < l; ++i) {
            namePieces.push(regexEscape(eras[i].name));
            abbrPieces.push(regexEscape(eras[i].abbr));
            narrowPieces.push(regexEscape(eras[i].narrow));

            mixedPieces.push(regexEscape(eras[i].name));
            mixedPieces.push(regexEscape(eras[i].abbr));
            mixedPieces.push(regexEscape(eras[i].narrow));
        }

        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
        this._erasNarrowRegex = new RegExp(
            '^(' + narrowPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);

    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (
        input,
        week,
        config,
        token
    ) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy
        );
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.isoWeek(),
            this.isoWeekday(),
            1,
            4
        );
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null
            ? Math.ceil((this.month() + 1) / 3)
            : this.month((input - 1) * 3 + (this.month() % 3));
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict
            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
            : locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear =
            Math.round(
                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
            ) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token, getSetMillisecond;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }

    getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
            return 'Moment<' + this.format() + '>';
        };
    }
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;
    proto.eraName = getEraName;
    proto.eraNarrow = getEraNarrow;
    proto.eraAbbr = getEraAbbr;
    proto.eraYear = getEraYear;
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.weeksInWeekYear = getWeeksInWeekYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates = deprecate(
        'dates accessor is deprecated. Use date instead.',
        getSetDayOfMonth
    );
    proto.months = deprecate(
        'months accessor is deprecated. Use month instead',
        getSetMonth
    );
    proto.years = deprecate(
        'years accessor is deprecated. Use year instead',
        getSetYear
    );
    proto.zone = deprecate(
        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
        getSetZone
    );
    proto.isDSTShifted = deprecate(
        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
        isDaylightSavingTimeShifted
    );

    function createUnix(input) {
        return createLocal(input * 1000);
    }

    function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat(string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;
    proto$1.eras = localeEras;
    proto$1.erasParse = localeErasParse;
    proto$1.erasConvertYear = localeErasConvertYear;
    proto$1.erasAbbrRegex = erasAbbrRegex;
    proto$1.erasNameRegex = erasNameRegex;
    proto$1.erasNarrowRegex = erasNarrowRegex;

    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;

    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1(format, index, field, setter) {
        var locale = getLocale(),
            utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i,
            out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0,
            i,
            out = [];

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths(format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        eras: [
            {
                since: '0001-01-01',
                until: +Infinity,
                offset: 1,
                name: 'Anno Domini',
                narrow: 'AD',
                abbr: 'AD',
            },
            {
                since: '0000-12-31',
                until: -Infinity,
                offset: 1,
                name: 'Before Christ',
                narrow: 'BC',
                abbr: 'BC',
            },
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output =
                    toInt((number % 100) / 10) === 1
                        ? 'th'
                        : b === 1
                        ? 'st'
                        : b === 2
                        ? 'nd'
                        : b === 3
                        ? 'rd'
                        : 'th';
            return number + output;
        },
    });

    // Side effect imports

    hooks.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        getSetGlobalLocale
    );
    hooks.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        getLocale
    );

    var mathAbs = Math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds,
            days = this._days,
            months = this._months,
            data = this._data,
            seconds,
            minutes,
            hours,
            years,
            monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (
            !(
                (milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0)
            )
        ) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return (days * 4800) / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return (months * 146097) / 4800;
    }

    function as(units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days,
            months,
            milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':
                    return months;
                case 'quarter':
                    return months / 3;
                case 'year':
                    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1() {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms'),
        asSeconds = makeAs('s'),
        asMinutes = makeAs('m'),
        asHours = makeAs('h'),
        asDays = makeAs('d'),
        asWeeks = makeAs('w'),
        asMonths = makeAs('M'),
        asQuarters = makeAs('Q'),
        asYears = makeAs('y');

    function clone$1() {
        return createDuration(this);
    }

    function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds'),
        seconds = makeGetter('seconds'),
        minutes = makeGetter('minutes'),
        hours = makeGetter('hours'),
        days = makeGetter('days'),
        months = makeGetter('months'),
        years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round,
        thresholds = {
            ss: 44, // a few seconds to seconds
            s: 45, // seconds to minute
            m: 45, // minutes to hour
            h: 22, // hours to day
            d: 26, // days to month/week
            w: null, // weeks to month
            M: 11, // months to year
        };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
        var duration = createDuration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            weeks = round(duration.as('w')),
            years = round(duration.as('y')),
            a =
                (seconds <= thresholds.ss && ['s', seconds]) ||
                (seconds < thresholds.s && ['ss', seconds]) ||
                (minutes <= 1 && ['m']) ||
                (minutes < thresholds.m && ['mm', minutes]) ||
                (hours <= 1 && ['h']) ||
                (hours < thresholds.h && ['hh', hours]) ||
                (days <= 1 && ['d']) ||
                (days < thresholds.d && ['dd', days]);

        if (thresholds.w != null) {
            a =
                a ||
                (weeks <= 1 && ['w']) ||
                (weeks < thresholds.w && ['ww', weeks]);
        }
        a = a ||
            (months <= 1 && ['M']) ||
            (months < thresholds.M && ['MM', months]) ||
            (years <= 1 && ['y']) || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof roundingFunction === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var withSuffix = false,
            th = thresholds,
            locale,
            output;

        if (typeof argWithSuffix === 'object') {
            argThresholds = argWithSuffix;
            argWithSuffix = false;
        }
        if (typeof argWithSuffix === 'boolean') {
            withSuffix = argWithSuffix;
        }
        if (typeof argThresholds === 'object') {
            th = Object.assign({}, thresholds, argThresholds);
            if (argThresholds.s != null && argThresholds.ss == null) {
                th.ss = argThresholds.s - 1;
            }
        }

        locale = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return (x > 0) - (x < 0) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000,
            days = abs$1(this._days),
            months = abs$1(this._months),
            minutes,
            hours,
            years,
            s,
            total = this.asSeconds(),
            totalSign,
            ymSign,
            daysSign,
            hmsSign;

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

        totalSign = total < 0 ? '-' : '';
        ymSign = sign(this._months) !== sign(total) ? '-' : '';
        daysSign = sign(this._days) !== sign(total) ? '-' : '';
        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return (
            totalSign +
            'P' +
            (years ? ymSign + years + 'Y' : '') +
            (months ? ymSign + months + 'M' : '') +
            (days ? daysSign + days + 'D' : '') +
            (hours || minutes || seconds ? 'T' : '') +
            (hours ? hmsSign + hours + 'H' : '') +
            (minutes ? hmsSign + minutes + 'M' : '') +
            (seconds ? hmsSign + s + 'S' : '')
        );
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asQuarters = asQuarters;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;

    proto$2.toIsoString = deprecate(
        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
        toISOString$1
    );
    proto$2.lang = lang;

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    //! moment.js

    hooks.version = '2.29.1';

    setHookCallback(createLocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD', // <input type="date" />
        TIME: 'HH:mm', // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW', // <input type="week" />
        MONTH: 'YYYY-MM', // <input type="month" />
    };

    return hooks;

})));

},{}],3:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.xmlbuilder2=t():e.xmlbuilder2=t()}(window,(function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=183)}([function(e,t,r){"use strict";function n(e){for(var r in e)t.hasOwnProperty(r)||(t[r]=e[r])}Object.defineProperty(t,"__esModule",{value:!0}),n(r(239)),n(r(250)),n(r(175)),n(r(106)),n(r(29)),n(r(72)),n(r(105)),n(r(30)),n(r(251)),n(r(52)),n(r(96)),n(r(252)),n(r(37)),n(r(51)),n(r(173)),n(r(176)),n(r(172)),n(r(107)),n(r(253)),n(r(254)),n(r(255)),n(r(71)),n(r(177)),n(r(104)),n(r(17)),n(r(256)),n(r(12)),n(r(174))},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(211);t.FixedSizeSet=i.FixedSizeSet;var o=r(212);t.ObjectCache=o.ObjectCache;var a=r(213);t.CompareCache=a.CompareCache;var s=r(214);t.Lazy=s.Lazy;var u=r(215);function l(e,t,r){if(m(e))e.forEach((function(e,n){return t.call(r,n,e)}));else for(var n in e)e.hasOwnProperty(n)&&t.call(r,n,e[n])}function c(e){var t,r;if(h(e))return e;if(f(e)){var i=[];try{for(var o=n(e),a=o.next();!a.done;a=o.next()){var s=a.value;i.push(c(s))}}catch(e){t={error:e}}finally{try{a&&!a.done&&(r=o.return)&&r.call(o)}finally{if(t)throw t.error}}return i}if(p(e)){i={};for(var u in e)if(e.hasOwnProperty(u)){var l=e[u];i[u]=c(l)}return i}return e}function h(e){return!!e&&"[object Function]"===Object.prototype.toString.call(e)}function p(e){var t=typeof e;return!!e&&("function"===t||"object"===t)}function f(e){return Array.isArray(e)}function d(e){return e instanceof Set}function m(e){return e instanceof Map}function y(e){if(p(e)){var t=Object.getPrototypeOf(e),r=t.constructor;return t&&r&&"function"==typeof r&&r instanceof r&&Function.prototype.toString.call(r)===Function.prototype.toString.call(Object)}return!1}t.StringWalker=u.StringWalker,t.applyMixin=function(e,t){for(var r=[],n=2;n<arguments.length;n++)r[n-2]=arguments[n];Object.getOwnPropertyNames(t.prototype).forEach((function(n){if("constructor"!==n){if(-1!==r.indexOf(n)){var i=Object.getOwnPropertyDescriptor(e.prototype,n);i&&Object.defineProperty(e.prototype,"_"+n,i)}var o=Object.getOwnPropertyDescriptor(t.prototype,n);o&&Object.defineProperty(e.prototype,n,o)}}))},t.applyDefaults=function e(t,r,n){void 0===n&&(n=!1);var i=c(t||{});return l(r,(function(t,r){y(r)?i[t]=e(i[t],r,n):(n||void 0===i[t])&&(i[t]=r)})),i},t.forEachArray=function(e,t,r){e.forEach(t,r)},t.forEachObject=l,t.arrayLength=function(e){return d(e)?e.size:e.length},t.objectLength=function(e){return m(e)?e.size:Object.keys(e).length},t.getObjectValue=function(e,t){return m(e)?e.get(t):e[t]},t.removeObjectValue=function(e,t){m(e)?e.delete(t):delete e[t]},t.clone=c,t.isBoolean=function(e){return"boolean"==typeof e},t.isNumber=function(e){return"number"==typeof e},t.isString=function(e){return"string"==typeof e},t.isFunction=h,t.isObject=p,t.isArray=f,t.isSet=d,t.isMap=m,t.isEmpty=function(e){if(f(e))return!e.length;if(d(e))return!e.size;if(m(e))return!e.size;if(p(e)){for(var t in e)if(e.hasOwnProperty(t))return!1;return!0}return!1},t.isPlainObject=y,t.isIterable=function(e){return e&&"function"==typeof e[Symbol.iterator]},t.getValue=function(e){return h(e.valueOf)?e.valueOf():e},t.utf8Encode=function(e){for(var t=new Uint8Array(4*e.length),r=0,n=0;n<e.length;n++){var i=e.charCodeAt(n);if(i<128)t[r++]=i;else{if(i<2048)t[r++]=i>>6|192;else{if(i>55295&&i<56320){if(++n>=e.length)throw new Error("Incomplete surrogate pair.");var o=e.charCodeAt(n);if(o<56320||o>57343)throw new Error("Invalid surrogate character.");i=65536+((1023&i)<<10)+(1023&o),t[r++]=i>>18|240,t[r++]=i>>12&63|128}else t[r++]=i>>12|224;t[r++]=i>>6&63|128}t[r++]=63&i|128}}return t.subarray(0,r)},t.utf8Decode=function(e){for(var t="",r=0;r<e.length;){var n=e[r++];if(n>127)if(n>191&&n<224){if(r>=e.length)throw new Error("Incomplete 2-byte sequence.");n=(31&n)<<6|63&e[r++]}else if(n>223&&n<240){if(r+1>=e.length)throw new Error("Incomplete 3-byte sequence.");n=(15&n)<<12|(63&e[r++])<<6|63&e[r++]}else{if(!(n>239&&n<248))throw new Error("Unknown multi-byte start.");if(r+2>=e.length)throw new Error("Incomplete 4-byte sequence.");n=(7&n)<<18|(63&e[r++])<<12|(63&e[r++])<<6|63&e[r++]}if(n<=65535)t+=String.fromCharCode(n);else{if(!(n<=1114111))throw new Error("Code point exceeds UTF-16 limit.");n-=65536,t+=String.fromCharCode(n>>10|55296),t+=String.fromCharCode(1023&n|56320)}}return t}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e[e.Before=0]="Before",e[e.Equal=1]="Equal",e[e.After=2]="After"}(t.BoundaryPosition||(t.BoundaryPosition={})),function(e){e[e.None=0]="None",e[e.Capturing=1]="Capturing",e[e.AtTarget=2]="AtTarget",e[e.Bubbling=3]="Bubbling"}(t.EventPhase||(t.EventPhase={})),function(e){e[e.Element=1]="Element",e[e.Attribute=2]="Attribute",e[e.Text=3]="Text",e[e.CData=4]="CData",e[e.EntityReference=5]="EntityReference",e[e.Entity=6]="Entity",e[e.ProcessingInstruction=7]="ProcessingInstruction",e[e.Comment=8]="Comment",e[e.Document=9]="Document",e[e.DocumentType=10]="DocumentType",e[e.DocumentFragment=11]="DocumentFragment",e[e.Notation=12]="Notation"}(t.NodeType||(t.NodeType={})),function(e){e[e.Disconnected=1]="Disconnected",e[e.Preceding=2]="Preceding",e[e.Following=4]="Following",e[e.Contains=8]="Contains",e[e.ContainedBy=16]="ContainedBy",e[e.ImplementationSpecific=32]="ImplementationSpecific"}(t.Position||(t.Position={})),function(e){e[e.Accept=1]="Accept",e[e.Reject=2]="Reject",e[e.Skip=3]="Skip"}(t.FilterResult||(t.FilterResult={})),function(e){e[e.All=4294967295]="All",e[e.Element=1]="Element",e[e.Attribute=2]="Attribute",e[e.Text=4]="Text",e[e.CDataSection=8]="CDataSection",e[e.EntityReference=16]="EntityReference",e[e.Entity=32]="Entity",e[e.ProcessingInstruction=64]="ProcessingInstruction",e[e.Comment=128]="Comment",e[e.Document=256]="Document",e[e.DocumentType=512]="DocumentType",e[e.DocumentFragment=1024]="DocumentFragment",e[e.Notation=2048]="Notation"}(t.WhatToShow||(t.WhatToShow={})),function(e){e[e.StartToStart=0]="StartToStart",e[e.StartToEnd=1]="StartToEnd",e[e.EndToEnd=2]="EndToEnd",e[e.EndToStart=3]="EndToStart"}(t.HowToCompare||(t.HowToCompare={}))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(240);t.Cast=n.Cast;var i=r(150);t.Guard=i.Guard;var o=r(241);t.EmptySet=o.EmptySet},function(e,t,r){var n=r(11),i=r(55).f,o=r(21),a=r(25),s=r(79),u=r(118),l=r(122);e.exports=function(e,t){var r,c,h,p,f,d=e.target,m=e.global,y=e.stat;if(r=m?n:y?n[d]||s(d,{}):(n[d]||{}).prototype)for(c in t){if(p=t[c],h=e.noTargetGet?(f=i(r,c))&&f.value:r[c],!l(m?c:d+(y?".":"#")+c,e.forced)&&void 0!==h){if(typeof p==typeof h)continue;u(p,h)}(e.sham||h&&h.sham)&&o(p,"sham",!0),a(r,c,p,e)}}},function(e,t,r){var n=r(11),i=r(80),o=r(14),a=r(58),s=r(85),u=r(123),l=i("wks"),c=n.Symbol,h=u?c:c&&c.withoutSetter||a;e.exports=function(e){return o(l,e)||(s&&o(c,e)?l[e]=c[e]:l[e]=h("Symbol."+e)),l[e]}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(1),i=r(29),o=function(){function e(){this._features={mutationObservers:!0,customElements:!0,slots:!0,steps:!0},this._window=null,this._compareCache=new n.CompareCache,this._rangeList=new n.FixedSizeSet}return e.prototype.setFeatures=function(e){if(void 0===e&&(e=!0),n.isObject(e))for(var t in e)this._features[t]=e[t]||!1;else for(var t in this._features)this._features[t]=e},Object.defineProperty(e.prototype,"features",{get:function(){return this._features},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"window",{get:function(){return null===this._window&&(this._window=i.create_window()),this._window},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"compareCache",{get:function(){return this._compareCache},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"rangeList",{get:function(){return this._rangeList},enumerable:!0,configurable:!0}),Object.defineProperty(e,"instance",{get:function(){return e._instance||(e._instance=new e),e._instance},enumerable:!0,configurable:!0}),e}();t.dom=o.instance},function(e,t,r){"use strict";var n=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(t,"__esModule",{value:!0});var i=n(r(227));t.base64=i;var o=n(r(146));t.byte=o;var a=n(r(147));t.byteSequence=a;var s=n(r(95));t.codePoint=s;var u=n(r(231));t.json=u;var l=n(r(232));t.list=l;var c=n(r(233));t.map=c;var h=n(r(234));t.namespace=h;var p=n(r(235));t.queue=p;var f=n(r(236));t.set=f;var d=n(r(237));t.stack=d;var m=n(r(238));t.string=m},function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){function t(t,r){void 0===r&&(r="");var n=e.call(this,r)||this;return n.name=t,n}return i(t,e),t}(Error);t.DOMException=o;var a=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"DOMStringSizeError",t)||this}return i(t,e),t}(o);t.DOMStringSizeError=a;var s=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"WrongDocumentError","The object is in the wrong document. "+t)||this}return i(t,e),t}(o);t.WrongDocumentError=s;var u=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"NoDataAllowedError",t)||this}return i(t,e),t}(o);t.NoDataAllowedError=u;var l=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"NoModificationAllowedError","The object can not be modified. "+t)||this}return i(t,e),t}(o);t.NoModificationAllowedError=l;var c=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"NotSupportedError","The operation is not supported. "+t)||this}return i(t,e),t}(o);t.NotSupportedError=c;var h=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"InUseAttributeError",t)||this}return i(t,e),t}(o);t.InUseAttributeError=h;var p=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"InvalidStateError","The object is in an invalid state. "+t)||this}return i(t,e),t}(o);t.InvalidStateError=p;var f=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"InvalidModificationError","The object can not be modified in this way. "+t)||this}return i(t,e),t}(o);t.InvalidModificationError=f;var d=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"NamespaceError","The operation is not allowed by Namespaces in XML. [XMLNS] "+t)||this}return i(t,e),t}(o);t.NamespaceError=d;var m=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"InvalidAccessError","The object does not support the operation or argument. "+t)||this}return i(t,e),t}(o);t.InvalidAccessError=m;var y=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"ValidationError",t)||this}return i(t,e),t}(o);t.ValidationError=y;var v=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"TypeMismatchError",t)||this}return i(t,e),t}(o);t.TypeMismatchError=v;var _=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"SecurityError","The operation is insecure. "+t)||this}return i(t,e),t}(o);t.SecurityError=_;var g=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"NetworkError","A network error occurred. "+t)||this}return i(t,e),t}(o);t.NetworkError=g;var b=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"AbortError","The operation was aborted. "+t)||this}return i(t,e),t}(o);t.AbortError=b;var x=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"URLMismatchError","The given URL does not match another URL. "+t)||this}return i(t,e),t}(o);t.URLMismatchError=x;var w=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"QuotaExceededError","The quota has been exceeded. "+t)||this}return i(t,e),t}(o);t.QuotaExceededError=w;var E=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"TimeoutError","The operation timed out. "+t)||this}return i(t,e),t}(o);t.TimeoutError=E;var D=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"InvalidNodeTypeError","The supplied node is incorrect or has an incorrect ancestor for this operation. "+t)||this}return i(t,e),t}(o);t.InvalidNodeTypeError=D;var S=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"DataCloneError","The object can not be cloned. "+t)||this}return i(t,e),t}(o);t.DataCloneError=S;var C=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"NotImplementedError","The DOM method is not implemented by this module. "+t)||this}return i(t,e),t}(o);t.NotImplementedError=C;var A=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"HierarchyRequestError","The operation would yield an incorrect node tree. "+t)||this}return i(t,e),t}(o);t.HierarchyRequestError=A;var N=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"NotFoundError","The object can not be found here. "+t)||this}return i(t,e),t}(o);t.NotFoundError=N;var T=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"IndexSizeError","The index is not in the allowed range. "+t)||this}return i(t,e),t}(o);t.IndexSizeError=T;var O=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"SyntaxError","The string did not match the expected pattern. "+t)||this}return i(t,e),t}(o);t.SyntaxError=O;var F=function(e){function t(t){return void 0===t&&(t=""),e.call(this,"InvalidCharacterError","The string contains invalid characters. "+t)||this}return i(t,e),t}(o);t.InvalidCharacterError=F},function(e,t,r){"use strict";var n=r(53),i=["kind","resolve","construct","instanceOf","predicate","represent","defaultStyle","styleAliases"],o=["scalar","sequence","mapping"];e.exports=function(e,t){var r,a;if(t=t||{},Object.keys(t).forEach((function(t){if(-1===i.indexOf(t))throw new n('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')})),this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.defaultStyle=t.defaultStyle||null,this.styleAliases=(r=t.styleAliases||null,a={},null!==r&&Object.keys(r).forEach((function(e){r[e].forEach((function(t){a[String(t)]=e}))})),a),-1===o.indexOf(this.kind))throw new n('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}},function(e,t,r){(function(t){var r=function(e){return e&&e.Math==Math&&e};e.exports=r("object"==typeof globalThis&&globalThis)||r("object"==typeof window&&window)||r("object"==typeof self&&self)||r("object"==typeof t&&t)||Function("return this")()}).call(this,r(77))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.idl_defineConst=function(e,t,r){Object.defineProperty(e,t,{writable:!1,enumerable:!0,configurable:!1,value:r})}},function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},function(e,t){var r={}.hasOwnProperty;e.exports=function(e,t){return r.call(e,t)}},function(e,t,r){var n=r(16),i=r(114),o=r(18),a=r(56),s=Object.defineProperty;t.f=n?s:function(e,t,r){if(o(e),t=a(t,!0),o(r),i)try{return s(e,t,r)}catch(e){}if("get"in r||"set"in r)throw TypeError("Accessors not supported");return"value"in r&&(e[t]=r.value),e}},function(e,t,r){var n=r(8);e.exports=!n((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}))},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(3),o=r(2);function a(e,t,r){if(void 0===r&&(r=!1),r&&i.Guard.isElementNode(t)&&i.Guard.isShadowRoot(t.shadowRoot)&&t.shadowRoot._firstChild)return t.shadowRoot._firstChild;if(t._firstChild)return t._firstChild;if(t===e)return null;if(t._nextSibling)return t._nextSibling;for(var n=t._parent;n&&n!==e;){if(n._nextSibling)return n._nextSibling;n=n._parent}return null}function s(){var e;return(e={})[Symbol.iterator]=function(){return{next:function(){return{done:!0,value:null}}}},e}function u(e,t,r,n){void 0===t&&(t=!1),void 0===r&&(r=!1);for(var i=t?e:a(e,e,r);i&&n&&!n(i);)i=a(e,i,r);return i}function l(e,t,r,n,i){void 0===r&&(r=!1),void 0===n&&(n=!1);for(var o=a(e,t,n);o&&i&&!i(o);)o=a(e,o,n);return o}function c(e,t,r,n){var i;return void 0===t&&(t=!1),void 0===r&&(r=!1),t||0!==e._children.size?((i={})[Symbol.iterator]=function(){var i=t?e:a(e,e,r);return{next:function(){for(;i&&n&&!n(i);)i=a(e,i,r);if(null===i)return{done:!0,value:null};var t={done:!1,value:i};return i=a(e,i,r),t}}},i):s()}function h(e,t,r){void 0===t&&(t=!1);for(var n=t?e:e._parent;n&&r&&!r(n);)n=n._parent;return n}function p(e,t,r,n){void 0===r&&(r=!1);for(var i=t._parent;i&&n&&!n(i);)i=i._parent;return i}function f(e){return i.Guard.isDocumentTypeNode(e)?0:i.Guard.isCharacterDataNode(e)?e._data.length:e._children.size}function d(e,t){if(void 0===t&&(t=!1),t){var r=d(e,!1);return i.Guard.isShadowRoot(r)?d(r._host,!0):r}return e._parent?d(e._parent):e}function m(e,t,r,n){void 0===r&&(r=!1),void 0===n&&(n=!1);for(var o=r?e:n&&i.Guard.isShadowRoot(e)?e._host:e._parent;null!==o;){if(o===t)return!0;o=n&&i.Guard.isShadowRoot(o)?o._host:o._parent}return!1}function y(e){for(var t=d(e),r=0,n=u(t);null!==n;){if(r++,n===e)return r;n=l(t,n)}return-1}t.tree_getFirstDescendantNode=u,t.tree_getNextDescendantNode=l,t.tree_getDescendantNodes=c,t.tree_getDescendantElements=function(e,t,r,n){var o;return void 0===t&&(t=!1),void 0===r&&(r=!1),t||0!==e._children.size?((o={})[Symbol.iterator]=function(){var o=c(e,t,r,(function(e){return i.Guard.isElementNode(e)}))[Symbol.iterator](),a=o.next().value;return{next:function(){for(;a&&n&&!n(a);)a=o.next().value;if(null===a)return{done:!0,value:null};var e={done:!1,value:a};return a=o.next().value,e}}},o):s()},t.tree_getSiblingNodes=function(e,t,r){var n;return void 0===t&&(t=!1),e._parent&&0!==e._parent._children.size?((n={})[Symbol.iterator]=function(){var n=e._parent?e._parent._firstChild:null;return{next:function(){for(;n&&(r&&!r(n)||!t&&n===e);)n=n._nextSibling;if(null===n)return{done:!0,value:null};var i={done:!1,value:n};return n=n._nextSibling,i}}},n):s()},t.tree_getFirstAncestorNode=h,t.tree_getNextAncestorNode=p,t.tree_getAncestorNodes=function(e,t,r){var n;return void 0===t&&(t=!1),t||e._parent?((n={})[Symbol.iterator]=function(){var n=h(e,t,r);return{next:function(){if(null===n)return{done:!0,value:null};var e={done:!1,value:n};return n=p(0,n,t,r),e}}},n):s()},t.tree_getCommonAncestor=function(e,t){if(e===t)return e._parent;for(var r=[],n=[],i=h(e,!0);null!==i;)r.push(i),i=p(0,i,!0);for(var o=h(t,!0);null!==o;)n.push(o),o=p(0,o,!0);for(var a=r.length,s=n.length,u=null,l=Math.min(a,s);l>0;l--){var c=r[--a];if(c!==n[--s])break;u=c}return u},t.tree_getFollowingNode=function(e,t){if(t._firstChild)return t._firstChild;if(t._nextSibling)return t._nextSibling;for(;;){var r=t._parent;if(null===r||r===e)return null;if(r._nextSibling)return r._nextSibling;t=r}},t.tree_getPrecedingNode=function(e,t){return t===e?null:t._previousSibling?(t=t._previousSibling)._lastChild?t._lastChild:t:t._parent},t.tree_isConstrained=function e(t){var r,i,a,s,u,l;switch(t._nodeType){case o.NodeType.Document:var c=!1,h=!1;try{for(var p=n(t._children),f=p.next();!f.done;f=p.next()){switch(f.value._nodeType){case o.NodeType.ProcessingInstruction:case o.NodeType.Comment:break;case o.NodeType.DocumentType:if(c||h)return!1;c=!0;break;case o.NodeType.Element:if(h)return!1;h=!0;break;default:return!1}}}catch(e){r={error:e}}finally{try{f&&!f.done&&(i=p.return)&&i.call(p)}finally{if(r)throw r.error}}break;case o.NodeType.DocumentFragment:case o.NodeType.Element:try{for(var d=n(t._children),m=d.next();!m.done;m=d.next()){switch(m.value._nodeType){case o.NodeType.Element:case o.NodeType.Text:case o.NodeType.ProcessingInstruction:case o.NodeType.CData:case o.NodeType.Comment:break;default:return!1}}}catch(e){a={error:e}}finally{try{m&&!m.done&&(s=d.return)&&s.call(d)}finally{if(a)throw a.error}}break;case o.NodeType.DocumentType:case o.NodeType.Text:case o.NodeType.ProcessingInstruction:case o.NodeType.CData:case o.NodeType.Comment:return!t.hasChildNodes()}try{for(var y=n(t._children),v=y.next();!v.done;v=y.next()){if(!e(v.value))return!1}}catch(e){u={error:e}}finally{try{v&&!v.done&&(l=y.return)&&l.call(y)}finally{if(u)throw u.error}}return!0},t.tree_nodeLength=f,t.tree_isEmpty=function(e){return 0===f(e)},t.tree_rootNode=d,t.tree_isDescendantOf=function(e,t,r,n){void 0===r&&(r=!1),void 0===n&&(n=!1);for(var i=u(e,r,n);null!==i;){if(i===t)return!0;i=l(e,i,r,n)}return!1},t.tree_isAncestorOf=m,t.tree_isHostIncludingAncestorOf=function e(t,r,n){if(void 0===n&&(n=!1),m(t,r,n))return!0;var o=d(t);return!(!i.Guard.isDocumentFragmentNode(o)||null===o._host||!e(o._host,r,n))},t.tree_isSiblingOf=function(e,t,r){return void 0===r&&(r=!1),e!==t?null!==e._parent&&e._parent===t._parent:!!r},t.tree_isPreceding=function(e,t){var r=y(e),n=y(t);return-1!==r&&-1!==n&&(d(e)===d(t)&&n<r)},t.tree_isFollowing=function(e,t){var r=y(e),n=y(t);return-1!==r&&-1!==n&&(d(e)===d(t)&&n>r)},t.tree_isParentOf=function(e,t){return e._parent===t},t.tree_isChildOf=function(e,t){return t._parent===e},t.tree_previousSibling=function(e){return e._previousSibling},t.tree_nextSibling=function(e){return e._nextSibling},t.tree_firstChild=function(e){return e._firstChild},t.tree_lastChild=function(e){return e._lastChild},t.tree_treePosition=y,t.tree_index=function(e){for(var t=0;null!==e._previousSibling;)t++,e=e._previousSibling;return t},t.tree_retarget=function(e,t){for(;;){if(!e||!i.Guard.isNode(e))return e;var r=d(e);if(!i.Guard.isShadowRoot(r))return e;if(t&&i.Guard.isNode(t)&&m(r,t,!0,!0))return e;e=r.host}}},function(e,t,r){var n=r(13);e.exports=function(e){if(!n(e))throw TypeError(String(e)+" is not an object");return e}},function(e,t,r){"use strict";var n=r(24),i=r(129),o=r(49),a=r(43),s=r(87),u=a.set,l=a.getterFor("Array Iterator");e.exports=s(Array,"Array",(function(e,t){u(this,{type:"Array Iterator",target:n(e),index:0,kind:t})}),(function(){var e=l(this),t=e.target,r=e.kind,n=e.index++;return!t||n>=t.length?(e.target=void 0,{value:void 0,done:!0}):"keys"==r?{value:n,done:!1}:"values"==r?{value:t[n],done:!1}:{value:[n,t[n]],done:!1}}),"values"),o.Arguments=o.Array,i("keys"),i("values"),i("entries")},function(e,t,r){var n=r(89),i=r(25),o=r(201);n||i(Object.prototype,"toString",o,{unsafe:!0})},function(e,t,r){var n=r(16),i=r(15),o=r(40);e.exports=n?function(e,t,r){return i.f(e,t,o(1,r))}:function(e,t,r){return e[t]=r,e}},function(e,t,r){"use strict";var n=r(136).charAt,i=r(43),o=r(87),a=i.set,s=i.getterFor("String Iterator");o(String,"String",(function(e){a(this,{type:"String Iterator",string:String(e),index:0})}),(function(){var e,t=s(this),r=t.string,i=t.index;return i>=r.length?{value:void 0,done:!0}:(e=n(r,i),t.index+=e.length,{value:e,done:!1})}))},function(e,t,r){var n=r(11),i=r(202),o=r(19),a=r(21),s=r(5),u=s("iterator"),l=s("toStringTag"),c=o.values;for(var h in i){var p=n[h],f=p&&p.prototype;if(f){if(f[u]!==c)try{a(f,u,c)}catch(e){f[u]=c}if(f[l]||a(f,l,h),i[h])for(var d in o)if(f[d]!==o[d])try{a(f,d,o[d])}catch(e){f[d]=o[d]}}}},function(e,t,r){var n=r(41),i=r(35);e.exports=function(e){return n(i(e))}},function(e,t,r){var n=r(11),i=r(21),o=r(14),a=r(79),s=r(116),u=r(43),l=u.get,c=u.enforce,h=String(String).split("String");(e.exports=function(e,t,r,s){var u=!!s&&!!s.unsafe,l=!!s&&!!s.enumerable,p=!!s&&!!s.noTargetGet;"function"==typeof r&&("string"!=typeof t||o(r,"name")||i(r,"name",t),c(r).source=h.join("string"==typeof t?t:"")),e!==n?(u?!p&&e[t]&&(l=!0):delete e[t],l?e[t]=r:i(e,t,r)):l?e[t]=r:a(t,r)})(Function.prototype,"toString",(function(){return"function"==typeof this&&l(this).source||s(this)}))},function(e,t,r){var n=r(47),i=Math.min;e.exports=function(e){return e>0?i(n(e),9007199254740991):0}},function(e,t,r){var n=r(35);e.exports=function(e){return Object(n(e))}},function(e,t,r){var n=r(16),i=r(8),o=r(14),a=Object.defineProperty,s={},u=function(e){throw e};e.exports=function(e,t){if(o(s,e))return s[e];t||(t={});var r=[][e],l=!!o(t,"ACCESSORS")&&t.ACCESSORS,c=o(t,0)?t[0]:u,h=o(t,1)?t[1]:void 0;return s[e]=!!r&&!i((function(){if(l&&!n)return!0;var e={length:-1};l?a(e,1,{enumerable:!0,get:u}):e[1]=1,r.call(e,c,h)}))}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(148),i=r(149),o=r(151),a=r(97),s=r(153),u=r(154),l=r(155),c=r(98),h=r(99),p=r(156),f=r(157),d=r(100),m=r(158),y=r(159),v=r(160),_=r(161),g=r(162),b=r(163),x=r(164),w=r(165),E=r(166),D=r(167),S=r(168),C=r(169),A=r(170);t.create_domImplementation=function(e){return n.DOMImplementationImpl._create(e)},t.create_window=function(){return i.WindowImpl._create()},t.create_xmlDocument=function(){return new o.XMLDocumentImpl},t.create_document=function(){return new a.DocumentImpl},t.create_abortController=function(){return new s.AbortControllerImpl},t.create_abortSignal=function(){return u.AbortSignalImpl._create()},t.create_documentType=function(e,t,r,n){return l.DocumentTypeImpl._create(e,t,r,n)},t.create_element=function(e,t,r,n){return c.ElementImpl._create(e,t,r,n)},t.create_htmlElement=function(e,t,r,n){return c.ElementImpl._create(e,t,r,n)},t.create_htmlUnknownElement=function(e,t,r,n){return c.ElementImpl._create(e,t,r,n)},t.create_documentFragment=function(e){return h.DocumentFragmentImpl._create(e)},t.create_shadowRoot=function(e,t){return p.ShadowRootImpl._create(e,t)},t.create_attr=function(e,t){return f.AttrImpl._create(e,t)},t.create_text=function(e,t){return d.TextImpl._create(e,t)},t.create_cdataSection=function(e,t){return m.CDATASectionImpl._create(e,t)},t.create_comment=function(e,t){return y.CommentImpl._create(e,t)},t.create_processingInstruction=function(e,t,r){return v.ProcessingInstructionImpl._create(e,t,r)},t.create_htmlCollection=function(e,t){return void 0===t&&(t=function(){return!0}),_.HTMLCollectionImpl._create(e,t)},t.create_nodeList=function(e){return g.NodeListImpl._create(e)},t.create_nodeListStatic=function(e,t){return b.NodeListStaticImpl._create(e,t)},t.create_namedNodeMap=function(e){return x.NamedNodeMapImpl._create(e)},t.create_range=function(e,t){return w.RangeImpl._create(e,t)},t.create_nodeIterator=function(e,t,r){return E.NodeIteratorImpl._create(e,t,r)},t.create_treeWalker=function(e,t){return D.TreeWalkerImpl._create(e,t)},t.create_nodeFilter=function(){return S.NodeFilterImpl._create()},t.create_mutationRecord=function(e,t,r,n,i,o,a,s,u){return C.MutationRecordImpl._create(e,t,r,n,i,o,a,s,u)},t.create_domTokenList=function(e,t){return A.DOMTokenListImpl._create(e,t)}},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(6),o=r(17),a=r(3),s=r(71),u=new Map;function l(e,t){if(t!==e._root&&o.tree_isAncestorOf(e._reference,t,!0)){if(e._pointerBeforeReference)for(;;){var r=o.tree_getFollowingNode(e._root,t);if(null!==r&&o.tree_isDescendantOf(e._root,r,!0)&&!o.tree_isDescendantOf(t,r,!0))return void(e._reference=r);if(null===r)return void(e._pointerBeforeReference=!1)}if(null===t._previousSibling)null!==t._parent&&(e._reference=t._parent);else{for(var n=t._previousSibling,i=o.tree_getFirstDescendantNode(t._previousSibling,!0,!1);null!==i;)null!==i&&(n=i),i=o.tree_getNextDescendantNode(t._previousSibling,i,!0,!1);e._reference=n}}}function c(e,t,r,n,i){if(a.Guard.isSlot(e)&&"name"===t&&null===i){if(n===r)return;if(null===n&&""===r)return;if(""===n&&null===r)return;e._name=null===n||""===n?"":n,s.shadowTree_assignSlotablesForATree(o.tree_rootNode(e))}}function h(e,t,r,n,i){if(a.Guard.isSlotable(e)&&"slot"===t&&null===i){if(n===r)return;if(null===n&&""===r)return;if(""===n&&null===r)return;e._name=null===n||""===n?"":n,s.shadowTree_isAssigned(e)&&s.shadowTree_assignSlotables(e._assignedSlot),s.shadowTree_assignASlot(e)}}function p(e,t,r,n){"id"===t&&null===n&&(e._uniqueIdentifier=r||void 0)}t.dom_runRemovingSteps=function(e,t){},t.dom_runCloningSteps=function(e,t,r,n){},t.dom_runAdoptingSteps=function(e,t){},t.dom_runAttributeChangeSteps=function(e,t,r,o,a){var s,u;i.dom.features.slots&&(h.call(e,e,t,r,o,a),c.call(e,e,t,r,o,a)),p.call(e,e,t,o,a);try{for(var l=n(e._attributeChangeSteps),f=l.next();!f.done;f=l.next()){f.value.call(e,e,t,r,o,a)}}catch(e){s={error:e}}finally{try{f&&!f.done&&(u=l.return)&&u.call(l)}finally{if(s)throw s.error}}},t.dom_runInsertionSteps=function(e){},t.dom_runNodeIteratorPreRemovingSteps=function(e,t){l.call(e,e,t)},t.dom_hasSupportedTokens=function(e){return u.has(e)},t.dom_getSupportedTokens=function(e){return u.get(e)||new Set},t.dom_runEventConstructingSteps=function(e){},t.dom_runChildTextContentChangeSteps=function(e){}},function(e,t,r){"use strict";var n=r(4),i=r(11),o=r(46),a=r(44),s=r(16),u=r(85),l=r(123),c=r(8),h=r(14),p=r(59),f=r(13),d=r(18),m=r(27),y=r(24),v=r(56),_=r(40),g=r(60),b=r(61),x=r(81),w=r(189),E=r(84),D=r(55),S=r(15),C=r(78),A=r(21),N=r(25),T=r(80),O=r(57),F=r(45),k=r(58),P=r(5),I=r(124),L=r(125),M=r(62),B=r(43),j=r(36).forEach,R=O("hidden"),z=P("toPrimitive"),U=B.set,G=B.getterFor("Symbol"),X=Object.prototype,q=i.Symbol,W=o("JSON","stringify"),H=D.f,J=S.f,Y=w.f,V=C.f,K=T("symbols"),$=T("op-symbols"),Q=T("string-to-symbol-registry"),Z=T("symbol-to-string-registry"),ee=T("wks"),te=i.QObject,re=!te||!te.prototype||!te.prototype.findChild,ne=s&&c((function(){return 7!=g(J({},"a",{get:function(){return J(this,"a",{value:7}).a}})).a}))?function(e,t,r){var n=H(X,t);n&&delete X[t],J(e,t,r),n&&e!==X&&J(X,t,n)}:J,ie=function(e,t){var r=K[e]=g(q.prototype);return U(r,{type:"Symbol",tag:e,description:t}),s||(r.description=t),r},oe=l?function(e){return"symbol"==typeof e}:function(e){return Object(e)instanceof q},ae=function(e,t,r){e===X&&ae($,t,r),d(e);var n=v(t,!0);return d(r),h(K,n)?(r.enumerable?(h(e,R)&&e[R][n]&&(e[R][n]=!1),r=g(r,{enumerable:_(0,!1)})):(h(e,R)||J(e,R,_(1,{})),e[R][n]=!0),ne(e,n,r)):J(e,n,r)},se=function(e,t){d(e);var r=y(t),n=b(r).concat(he(r));return j(n,(function(t){s&&!ue.call(r,t)||ae(e,t,r[t])})),e},ue=function(e){var t=v(e,!0),r=V.call(this,t);return!(this===X&&h(K,t)&&!h($,t))&&(!(r||!h(this,t)||!h(K,t)||h(this,R)&&this[R][t])||r)},le=function(e,t){var r=y(e),n=v(t,!0);if(r!==X||!h(K,n)||h($,n)){var i=H(r,n);return!i||!h(K,n)||h(r,R)&&r[R][n]||(i.enumerable=!0),i}},ce=function(e){var t=Y(y(e)),r=[];return j(t,(function(e){h(K,e)||h(F,e)||r.push(e)})),r},he=function(e){var t=e===X,r=Y(t?$:y(e)),n=[];return j(r,(function(e){!h(K,e)||t&&!h(X,e)||n.push(K[e])})),n};(u||(N((q=function(){if(this instanceof q)throw TypeError("Symbol is not a constructor");var e=arguments.length&&void 0!==arguments[0]?String(arguments[0]):void 0,t=k(e),r=function(e){this===X&&r.call($,e),h(this,R)&&h(this[R],t)&&(this[R][t]=!1),ne(this,t,_(1,e))};return s&&re&&ne(X,t,{configurable:!0,set:r}),ie(t,e)}).prototype,"toString",(function(){return G(this).tag})),N(q,"withoutSetter",(function(e){return ie(k(e),e)})),C.f=ue,S.f=ae,D.f=le,x.f=w.f=ce,E.f=he,I.f=function(e){return ie(P(e),e)},s&&(J(q.prototype,"description",{configurable:!0,get:function(){return G(this).description}}),a||N(X,"propertyIsEnumerable",ue,{unsafe:!0}))),n({global:!0,wrap:!0,forced:!u,sham:!u},{Symbol:q}),j(b(ee),(function(e){L(e)})),n({target:"Symbol",stat:!0,forced:!u},{for:function(e){var t=String(e);if(h(Q,t))return Q[t];var r=q(t);return Q[t]=r,Z[r]=t,r},keyFor:function(e){if(!oe(e))throw TypeError(e+" is not a symbol");if(h(Z,e))return Z[e]},useSetter:function(){re=!0},useSimple:function(){re=!1}}),n({target:"Object",stat:!0,forced:!u,sham:!s},{create:function(e,t){return void 0===t?g(e):se(g(e),t)},defineProperty:ae,defineProperties:se,getOwnPropertyDescriptor:le}),n({target:"Object",stat:!0,forced:!u},{getOwnPropertyNames:ce,getOwnPropertySymbols:he}),n({target:"Object",stat:!0,forced:c((function(){E.f(1)}))},{getOwnPropertySymbols:function(e){return E.f(m(e))}}),W)&&n({target:"JSON",stat:!0,forced:!u||c((function(){var e=q();return"[null]"!=W([e])||"{}"!=W({a:e})||"{}"!=W(Object(e))}))},{stringify:function(e,t,r){for(var n,i=[e],o=1;arguments.length>o;)i.push(arguments[o++]);if(n=t,(f(t)||void 0!==e)&&!oe(e))return p(t)||(t=function(e,t){if("function"==typeof n&&(t=n.call(this,e,t)),!oe(t))return t}),i[1]=t,W.apply(null,i)}});q.prototype[z]||A(q.prototype,z,q.prototype.valueOf),M(q,"Symbol"),F[R]=!0},function(e,t,r){"use strict";var n=r(4),i=r(16),o=r(11),a=r(14),s=r(13),u=r(15).f,l=r(118),c=o.Symbol;if(i&&"function"==typeof c&&(!("description"in c.prototype)||void 0!==c().description)){var h={},p=function(){var e=arguments.length<1||void 0===arguments[0]?void 0:String(arguments[0]),t=this instanceof p?new c(e):void 0===e?c():c(e);return""===e&&(h[t]=!0),t};l(p,c);var f=p.prototype=c.prototype;f.constructor=p;var d=f.toString,m="Symbol(test)"==String(c("test")),y=/^Symbol\((.*)\)[^)]+$/;u(f,"description",{configurable:!0,get:function(){var e=s(this)?this.valueOf():this,t=d.call(e);if(a(h,e))return"";var r=m?t.slice(7,-1):t.replace(y,"$1");return""===r?void 0:r}}),n({global:!0,forced:!0},{Symbol:p})}},function(e,t,r){r(125)("iterator")},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var a=r(6),s=r(2),u=r(69),l=r(3),c=r(9),h=r(0),p=r(152),f=r(12),d=function(e){function t(){var t=e.call(this)||this;return t._parent=null,t._firstChild=null,t._lastChild=null,t._previousSibling=null,t._nextSibling=null,t}return i(t,e),Object.defineProperty(t.prototype,"_childNodes",{get:function(){return this.__childNodes||(this.__childNodes=h.create_nodeList(this))},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"_nodeDocument",{get:function(){return this._nodeDocumentOverride||a.dom.window._associatedDocument},set:function(e){this._nodeDocumentOverride=e},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"_registeredObserverList",{get:function(){return this.__registeredObserverList||(this.__registeredObserverList=[])},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"nodeType",{get:function(){return this._nodeType},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"nodeName",{get:function(){return l.Guard.isElementNode(this)?this._htmlUppercasedQualifiedName:l.Guard.isAttrNode(this)?this._qualifiedName:l.Guard.isExclusiveTextNode(this)?"#text":l.Guard.isCDATASectionNode(this)?"#cdata-section":l.Guard.isProcessingInstructionNode(this)?this._target:l.Guard.isCommentNode(this)?"#comment":l.Guard.isDocumentNode(this)?"#document":l.Guard.isDocumentTypeNode(this)?this._name:l.Guard.isDocumentFragmentNode(this)?"#document-fragment":""},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"baseURI",{get:function(){return p.urlSerializer(this._nodeDocument._URL)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"isConnected",{get:function(){return l.Guard.isElementNode(this)&&h.shadowTree_isConnected(this)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"ownerDocument",{get:function(){return this._nodeType===s.NodeType.Document?null:this._nodeDocument},enumerable:!0,configurable:!0}),t.prototype.getRootNode=function(e){return h.tree_rootNode(this,!!e&&e.composed)},Object.defineProperty(t.prototype,"parentNode",{get:function(){return this._nodeType===s.NodeType.Attribute?null:this._parent},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"parentElement",{get:function(){return this._parent&&l.Guard.isElementNode(this._parent)?this._parent:null},enumerable:!0,configurable:!0}),t.prototype.hasChildNodes=function(){return null!==this._firstChild},Object.defineProperty(t.prototype,"childNodes",{get:function(){return this._childNodes},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"firstChild",{get:function(){return this._firstChild},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"lastChild",{get:function(){return this._lastChild},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"previousSibling",{get:function(){return this._previousSibling},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"nextSibling",{get:function(){return this._nextSibling},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"nodeValue",{get:function(){return l.Guard.isAttrNode(this)?this._value:l.Guard.isCharacterDataNode(this)?this._data:null},set:function(e){null===e&&(e=""),l.Guard.isAttrNode(this)?h.attr_setAnExistingAttributeValue(this,e):l.Guard.isCharacterDataNode(this)&&h.characterData_replaceData(this,0,this._data.length,e)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"textContent",{get:function(){return l.Guard.isDocumentFragmentNode(this)||l.Guard.isElementNode(this)?h.text_descendantTextContent(this):l.Guard.isAttrNode(this)?this._value:l.Guard.isCharacterDataNode(this)?this._data:null},set:function(e){null===e&&(e=""),l.Guard.isDocumentFragmentNode(this)||l.Guard.isElementNode(this)?h.node_stringReplaceAll(e,this):l.Guard.isAttrNode(this)?h.attr_setAnExistingAttributeValue(this,e):l.Guard.isCharacterDataNode(this)&&h.characterData_replaceData(this,0,h.tree_nodeLength(this),e)},enumerable:!0,configurable:!0}),t.prototype.normalize=function(){for(var e,t,r,n,i=[],s=h.tree_getFirstDescendantNode(this,!1,!1,(function(e){return l.Guard.isExclusiveTextNode(e)}));null!==s;)i.push(s),s=h.tree_getNextDescendantNode(this,s,!1,!1,(function(e){return l.Guard.isExclusiveTextNode(e)}));for(var u=0;u<i.length;u++){var c=i[u];if(null!==c._parent){var p=h.tree_nodeLength(c);if(0!==p){var f=[],d="";try{for(var m=(e=void 0,o(h.text_contiguousExclusiveTextNodes(c))),y=m.next();!y.done;y=m.next()){var v=y.value;f.push(v),d+=v._data}}catch(t){e={error:t}}finally{try{y&&!y.done&&(t=m.return)&&t.call(m)}finally{if(e)throw e.error}}if(h.characterData_replaceData(c,p,0,d),0!==a.dom.rangeList.size)for(var _=c._nextSibling;null!==_&&l.Guard.isExclusiveTextNode(_);){var g=_,b=h.tree_index(g);try{for(var x=(r=void 0,o(a.dom.rangeList)),w=x.next();!w.done;w=x.next()){var E=w.value;E._start[0]===g&&(E._start[0]=c,E._start[1]+=p),E._end[0]===g&&(E._end[0]=c,E._end[1]+=p),E._start[0]===g._parent&&E._start[1]===b&&(E._start[0]=c,E._start[1]=p),E._end[0]===g._parent&&E._end[1]===b&&(E._end[0]=c,E._end[1]=p)}}catch(e){r={error:e}}finally{try{w&&!w.done&&(n=x.return)&&n.call(x)}finally{if(r)throw r.error}}p+=h.tree_nodeLength(_),_=_._nextSibling}for(var D=0;D<f.length;D++){null!==(v=f[D])._parent&&h.mutation_remove(v,v._parent)}}else h.mutation_remove(c,c._parent)}}},t.prototype.cloneNode=function(e){if(void 0===e&&(e=!1),l.Guard.isShadowRoot(this))throw new c.NotSupportedError;return h.node_clone(this,null,e)},t.prototype.isEqualNode=function(e){return void 0===e&&(e=null),null!==e&&h.node_equals(this,e)},t.prototype.isSameNode=function(e){return void 0===e&&(e=null),this===e},t.prototype.compareDocumentPosition=function(e){if(e===this)return 0;var t=e,r=this,n=null,i=null;if(l.Guard.isAttrNode(t)&&(t=(n=t)._element),l.Guard.isAttrNode(r)&&(r=(i=r)._element,n&&t&&t===r))for(var o=0;o<r._attributeList.length;o++){var u=r._attributeList[o];if(h.node_equals(u,n))return s.Position.ImplementationSpecific|s.Position.Preceding;if(h.node_equals(u,i))return s.Position.ImplementationSpecific|s.Position.Following}return null===t||null===r||h.tree_rootNode(t)!==h.tree_rootNode(r)?s.Position.Disconnected|s.Position.ImplementationSpecific|(a.dom.compareCache.check(this,e)?s.Position.Preceding:s.Position.Following):!n&&h.tree_isAncestorOf(r,t)||i&&t===r?s.Position.Contains|s.Position.Preceding:!i&&h.tree_isDescendantOf(r,t)||n&&t===r?s.Position.ContainedBy|s.Position.Following:h.tree_isPreceding(r,t)?s.Position.Preceding:s.Position.Following},t.prototype.contains=function(e){return null!==e&&h.tree_isDescendantOf(this,e,!0)},t.prototype.lookupPrefix=function(e){return e?l.Guard.isElementNode(this)?h.node_locateANamespacePrefix(this,e):l.Guard.isDocumentNode(this)?null===this.documentElement?null:h.node_locateANamespacePrefix(this.documentElement,e):l.Guard.isDocumentTypeNode(this)||l.Guard.isDocumentFragmentNode(this)?null:l.Guard.isAttrNode(this)?null===this._element?null:h.node_locateANamespacePrefix(this._element,e):null!==this._parent&&l.Guard.isElementNode(this._parent)?h.node_locateANamespacePrefix(this._parent,e):null:null},t.prototype.lookupNamespaceURI=function(e){return h.node_locateANamespace(this,e||null)},t.prototype.isDefaultNamespace=function(e){return e||(e=null),h.node_locateANamespace(this,null)===e},t.prototype.insertBefore=function(e,t){return h.mutation_preInsert(e,this,t)},t.prototype.appendChild=function(e){return h.mutation_append(e,this)},t.prototype.replaceChild=function(e,t){return h.mutation_replace(t,e,this)},t.prototype.removeChild=function(e){return h.mutation_preRemove(e,this)},t.prototype._getTheParent=function(e){return l.Guard.isSlotable(this)&&h.shadowTree_isAssigned(this)?this._assignedSlot:this._parent},t.ELEMENT_NODE=1,t.ATTRIBUTE_NODE=2,t.TEXT_NODE=3,t.CDATA_SECTION_NODE=4,t.ENTITY_REFERENCE_NODE=5,t.ENTITY_NODE=6,t.PROCESSING_INSTRUCTION_NODE=7,t.COMMENT_NODE=8,t.DOCUMENT_NODE=9,t.DOCUMENT_TYPE_NODE=10,t.DOCUMENT_FRAGMENT_NODE=11,t.NOTATION_NODE=12,t.DOCUMENT_POSITION_DISCONNECTED=1,t.DOCUMENT_POSITION_PRECEDING=2,t.DOCUMENT_POSITION_FOLLOWING=4,t.DOCUMENT_POSITION_CONTAINS=8,t.DOCUMENT_POSITION_CONTAINED_BY=16,t.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC=32,t}(u.EventTargetImpl);t.NodeImpl=d,d.prototype._children=new l.EmptySet,f.idl_defineConst(d.prototype,"ELEMENT_NODE",1),f.idl_defineConst(d.prototype,"ATTRIBUTE_NODE",2),f.idl_defineConst(d.prototype,"TEXT_NODE",3),f.idl_defineConst(d.prototype,"CDATA_SECTION_NODE",4),f.idl_defineConst(d.prototype,"ENTITY_REFERENCE_NODE",5),f.idl_defineConst(d.prototype,"ENTITY_NODE",6),f.idl_defineConst(d.prototype,"PROCESSING_INSTRUCTION_NODE",7),f.idl_defineConst(d.prototype,"COMMENT_NODE",8),f.idl_defineConst(d.prototype,"DOCUMENT_NODE",9),f.idl_defineConst(d.prototype,"DOCUMENT_TYPE_NODE",10),f.idl_defineConst(d.prototype,"DOCUMENT_FRAGMENT_NODE",11),f.idl_defineConst(d.prototype,"NOTATION_NODE",12),f.idl_defineConst(d.prototype,"DOCUMENT_POSITION_DISCONNECTED",1),f.idl_defineConst(d.prototype,"DOCUMENT_POSITION_PRECEDING",2),f.idl_defineConst(d.prototype,"DOCUMENT_POSITION_FOLLOWING",4),f.idl_defineConst(d.prototype,"DOCUMENT_POSITION_CONTAINS",8),f.idl_defineConst(d.prototype,"DOCUMENT_POSITION_CONTAINED_BY",16),f.idl_defineConst(d.prototype,"DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC",32)},function(e,t){e.exports=function(e){if(null==e)throw TypeError("Can't call method on "+e);return e}},function(e,t,r){var n=r(86),i=r(41),o=r(27),a=r(26),s=r(127),u=[].push,l=function(e){var t=1==e,r=2==e,l=3==e,c=4==e,h=6==e,p=5==e||h;return function(f,d,m,y){for(var v,_,g=o(f),b=i(g),x=n(d,m,3),w=a(b.length),E=0,D=y||s,S=t?D(f,w):r?D(f,0):void 0;w>E;E++)if((p||E in b)&&(_=x(v=b[E],E,g),e))if(t)S[E]=_;else if(_)switch(e){case 3:return!0;case 5:return v;case 6:return E;case 2:u.call(S,v)}else if(c)return!1;return h?-1:l||c?c:S}};e.exports={forEach:l(0),map:l(1),filter:l(2),some:l(3),every:l(4),find:l(5),findIndex:l(6)}},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},i=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},o=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(i(arguments[t]));return e};Object.defineProperty(t,"__esModule",{value:!0});var a=r(6),s=r(9),u=r(2),l=r(3),c=r(1),h=r(7),p=r(72),f=r(17),d=r(172),m=r(71),y=r(51),v=r(30),_=r(105);function g(e,t,r){var i,o,a,l,c,h,p,d,m=t._nodeType,y=e._nodeType,v=r?r._nodeType:null;if(m!==u.NodeType.Document&&m!==u.NodeType.DocumentFragment&&m!==u.NodeType.Element)throw new s.HierarchyRequestError("Only document, document fragment and element nodes can contain child nodes. Parent node is "+t.nodeName+".");if(f.tree_isHostIncludingAncestorOf(t,e,!0))throw new s.HierarchyRequestError("The node to be inserted cannot be an inclusive ancestor of parent node. Node is "+e.nodeName+", parent node is "+t.nodeName+".");if(null!==r&&r._parent!==t)throw new s.NotFoundError("The reference child node cannot be found under parent node. Child node is "+r.nodeName+", parent node is "+t.nodeName+".");if(y!==u.NodeType.DocumentFragment&&y!==u.NodeType.DocumentType&&y!==u.NodeType.Element&&y!==u.NodeType.Text&&y!==u.NodeType.ProcessingInstruction&&y!==u.NodeType.CData&&y!==u.NodeType.Comment)throw new s.HierarchyRequestError("Only document fragment, document type, element, text, processing instruction, cdata section or comment nodes can be inserted. Node is "+e.nodeName+".");if(y===u.NodeType.Text&&m===u.NodeType.Document)throw new s.HierarchyRequestError("Cannot insert a text node as a child of a document node. Node is "+e.nodeName+".");if(y===u.NodeType.DocumentType&&m!==u.NodeType.Document)throw new s.HierarchyRequestError("A document type node can only be inserted under a document node. Parent node is "+t.nodeName+".");if(m===u.NodeType.Document)if(y===u.NodeType.DocumentFragment){var _=0;try{for(var g=n(e._children),b=g.next();!b.done;b=g.next()){var x=b.value;if(x._nodeType===u.NodeType.Element)_++;else if(x._nodeType===u.NodeType.Text)throw new s.HierarchyRequestError("Cannot insert text a node as a child of a document node. Node is "+x.nodeName+".")}}catch(e){i={error:e}}finally{try{b&&!b.done&&(o=g.return)&&o.call(g)}finally{if(i)throw i.error}}if(_>1)throw new s.HierarchyRequestError("A document node can only have one document element node. Document fragment to be inserted has "+_+" element nodes.");if(1===_){try{for(var w=n(t._children),E=w.next();!E.done;E=w.next()){if(E.value._nodeType===u.NodeType.Element)throw new s.HierarchyRequestError("The document node already has a document element node.")}}catch(e){a={error:e}}finally{try{E&&!E.done&&(l=w.return)&&l.call(w)}finally{if(a)throw a.error}}if(r){if(v===u.NodeType.DocumentType)throw new s.HierarchyRequestError("Cannot insert an element node before a document type node.");for(var D=r._nextSibling;D;){if(D._nodeType===u.NodeType.DocumentType)throw new s.HierarchyRequestError("Cannot insert an element node before a document type node.");D=D._nextSibling}}}}else if(y===u.NodeType.Element){try{for(var S=n(t._children),C=S.next();!C.done;C=S.next()){if(C.value._nodeType===u.NodeType.Element)throw new s.HierarchyRequestError("Document already has a document element node. Node is "+e.nodeName+".")}}catch(e){c={error:e}}finally{try{C&&!C.done&&(h=S.return)&&h.call(S)}finally{if(c)throw c.error}}if(r){if(v===u.NodeType.DocumentType)throw new s.HierarchyRequestError("Cannot insert an element node before a document type node. Node is "+e.nodeName+".");for(D=r._nextSibling;D;){if(D._nodeType===u.NodeType.DocumentType)throw new s.HierarchyRequestError("Cannot insert an element node before a document type node. Node is "+e.nodeName+".");D=D._nextSibling}}}else if(y===u.NodeType.DocumentType){try{for(var A=n(t._children),N=A.next();!N.done;N=A.next()){if(N.value._nodeType===u.NodeType.DocumentType)throw new s.HierarchyRequestError("Document already has a document type node. Node is "+e.nodeName+".")}}catch(e){p={error:e}}finally{try{N&&!N.done&&(d=A.return)&&d.call(A)}finally{if(p)throw p.error}}if(r)for(var T=r._previousSibling;T;){if(T._nodeType===u.NodeType.Element)throw new s.HierarchyRequestError("Cannot insert a document type node before an element node. Node is "+e.nodeName+".");T=T._previousSibling}else for(T=t._firstChild;T;){if(T._nodeType===u.NodeType.Element)throw new s.HierarchyRequestError("Cannot insert a document type node before an element node. Node is "+e.nodeName+".");T=T._nextSibling}}}function b(e,t,r){g(e,t,r);var n=r;return n===e&&(n=e._nextSibling),_.document_adopt(e,t._nodeDocument),x(e,t,n),e}function x(e,t,r,i){var s,d;if(null!==r||e._nodeType===u.NodeType.DocumentFragment){var _=e._nodeType===u.NodeType.DocumentFragment?e._children.size:1;if(null!==r&&0!==a.dom.rangeList.size){var g=f.tree_index(r);try{for(var b=n(a.dom.rangeList),x=b.next();!x.done;x=b.next()){var E=x.value;E._start[0]===t&&E._start[1]>g&&(E._start[1]+=_),E._end[0]===t&&E._end[1]>g&&(E._end[1]+=_)}}catch(e){s={error:e}}finally{try{x&&!x.done&&(d=b.return)&&d.call(b)}finally{if(s)throw s.error}}}var D=e._nodeType===u.NodeType.DocumentFragment?new(Array.bind.apply(Array,o([void 0],e._children))):[e];if(e._nodeType===u.NodeType.DocumentFragment)for(;e._firstChild;)w(e._firstChild,e,!0);a.dom.features.mutationObservers&&e._nodeType===u.NodeType.DocumentFragment&&y.observer_queueTreeMutationRecord(e,[],D,null,null);for(var S=r?r._previousSibling:t._lastChild,C=null===r?-1:f.tree_index(r),A=0;A<D.length;A++){var N=D[A];if(l.Guard.isElementNode(N)&&(l.Guard.isDocumentNode(t)&&(t._documentElement=N),N._nodeDocument._hasNamespaces||null===N._namespace&&null===N._namespacePrefix||(N._nodeDocument._hasNamespaces=!0)),N._parent=t,null===r?h.set.append(t._children,N):(h.set.insert(t._children,N,C),C++),null===t._firstChild)N._previousSibling=null,N._nextSibling=null,t._firstChild=N,t._lastChild=N;else{var T=r?r._previousSibling:t._lastChild,O=r||null;N._previousSibling=T,N._nextSibling=O,T&&(T._nextSibling=N),O&&(O._previousSibling=N),T||(t._firstChild=N),O||(t._lastChild=N)}a.dom.features.slots&&null!==t._shadowRoot&&l.Guard.isSlotable(N)&&m.shadowTree_assignASlot(N),a.dom.features.steps&&l.Guard.isTextNode(N)&&v.dom_runChildTextContentChangeSteps(t),a.dom.features.slots&&l.Guard.isShadowRoot(f.tree_rootNode(t))&&l.Guard.isSlot(t)&&c.isEmpty(t._assignedNodes)&&m.shadowTree_signalASlotChange(t),a.dom.features.slots&&m.shadowTree_assignSlotablesForATree(f.tree_rootNode(N));for(var F=f.tree_getFirstDescendantNode(N,!0,!0);null!==F;)a.dom.features.steps&&v.dom_runInsertionSteps(F),a.dom.features.customElements&&l.Guard.isElementNode(F)&&m.shadowTree_isConnected(F)&&(l.Guard.isCustomElementNode(F)?p.customElement_enqueueACustomElementCallbackReaction(F,"connectedCallback",[]):p.customElement_tryToUpgrade(F)),F=f.tree_getNextDescendantNode(N,F,!0,!0)}a.dom.features.mutationObservers&&(i||y.observer_queueTreeMutationRecord(t,D,[],S,r))}else!function(e,t,r){var n=t._lastChild;l.Guard.isElementNode(e)&&(l.Guard.isDocumentNode(t)&&(t._documentElement=e),e._nodeDocument._hasNamespaces||null===e._namespace&&null===e._namespacePrefix||(e._nodeDocument._hasNamespaces=!0));if(e._parent=t,t._children.add(e),null===t._firstChild)e._previousSibling=null,e._nextSibling=null,t._firstChild=e,t._lastChild=e;else{var i=t._lastChild;e._previousSibling=i,e._nextSibling=null,i&&(i._nextSibling=e),i||(t._firstChild=e),t._lastChild=e}a.dom.features.slots&&null!==t._shadowRoot&&l.Guard.isSlotable(e)&&m.shadowTree_assignASlot(e);a.dom.features.steps&&l.Guard.isTextNode(e)&&v.dom_runChildTextContentChangeSteps(t);a.dom.features.slots&&l.Guard.isShadowRoot(f.tree_rootNode(t))&&l.Guard.isSlot(t)&&c.isEmpty(t._assignedNodes)&&m.shadowTree_signalASlotChange(t);a.dom.features.slots&&m.shadowTree_assignSlotablesForATree(f.tree_rootNode(e));a.dom.features.steps&&v.dom_runInsertionSteps(e);a.dom.features.customElements&&l.Guard.isElementNode(e)&&m.shadowTree_isConnected(e)&&(l.Guard.isCustomElementNode(e)?p.customElement_enqueueACustomElementCallbackReaction(e,"connectedCallback",[]):p.customElement_tryToUpgrade(e));a.dom.features.mutationObservers&&(r||y.observer_queueTreeMutationRecord(t,[e],[],n,null))}(e,t,i)}function w(e,t,r){var i,o,s,u,h,_,g,b;if(0!==a.dom.rangeList.size){var x=f.tree_index(e);try{for(var w=n(a.dom.rangeList),E=w.next();!E.done;E=w.next()){var D=E.value;f.tree_isDescendantOf(e,D._start[0],!0)&&(D._start=[t,x]),f.tree_isDescendantOf(e,D._end[0],!0)&&(D._end=[t,x]),D._start[0]===t&&D._start[1]>x&&D._start[1]--,D._end[0]===t&&D._end[1]>x&&D._end[1]--}}catch(e){i={error:e}}finally{try{E&&!E.done&&(o=w.return)&&o.call(w)}finally{if(i)throw i.error}}try{for(var S=n(a.dom.rangeList),C=S.next();!C.done;C=S.next()){(D=C.value)._start[0]===t&&D._start[1]>x&&(D._start[1]-=1),D._end[0]===t&&D._end[1]>x&&(D._end[1]-=1)}}catch(e){s={error:e}}finally{try{C&&!C.done&&(u=S.return)&&u.call(S)}finally{if(s)throw s.error}}}if(a.dom.features.steps)try{for(var A=n(d.nodeIterator_iteratorList()),N=A.next();!N.done;N=A.next()){var T=N.value;T._root._nodeDocument===e._nodeDocument&&v.dom_runNodeIteratorPreRemovingSteps(T,e)}}catch(e){h={error:e}}finally{try{N&&!N.done&&(_=A.return)&&_.call(A)}finally{if(h)throw h.error}}var O=e._previousSibling,F=e._nextSibling;l.Guard.isDocumentNode(t)&&l.Guard.isElementNode(e)&&(t._documentElement=null),e._parent=null,t._children.delete(e);var k=e._previousSibling,P=e._nextSibling;(e._previousSibling=null,e._nextSibling=null,k&&(k._nextSibling=P),P&&(P._previousSibling=k),k||(t._firstChild=P),P||(t._lastChild=k),a.dom.features.slots&&l.Guard.isSlotable(e)&&null!==e._assignedSlot&&m.shadowTree_isAssigned(e)&&m.shadowTree_assignSlotables(e._assignedSlot),a.dom.features.slots&&l.Guard.isShadowRoot(f.tree_rootNode(t))&&l.Guard.isSlot(t)&&c.isEmpty(t._assignedNodes)&&m.shadowTree_signalASlotChange(t),a.dom.features.slots)&&(null!==f.tree_getFirstDescendantNode(e,!0,!1,(function(e){return l.Guard.isSlot(e)}))&&(m.shadowTree_assignSlotablesForATree(f.tree_rootNode(t)),m.shadowTree_assignSlotablesForATree(e)));a.dom.features.steps&&v.dom_runRemovingSteps(e,t),a.dom.features.customElements&&l.Guard.isCustomElementNode(e)&&p.customElement_enqueueACustomElementCallbackReaction(e,"disconnectedCallback",[]);for(var I=f.tree_getFirstDescendantNode(e,!1,!0);null!==I;)a.dom.features.steps&&v.dom_runRemovingSteps(I,e),a.dom.features.customElements&&l.Guard.isCustomElementNode(I)&&p.customElement_enqueueACustomElementCallbackReaction(I,"disconnectedCallback",[]),I=f.tree_getNextDescendantNode(e,I,!1,!0);if(a.dom.features.mutationObservers)for(var L=f.tree_getFirstAncestorNode(t,!0);null!==L;){try{for(var M=(g=void 0,n(L._registeredObserverList)),B=M.next();!B.done;B=M.next()){var j=B.value;j.options.subtree&&e._registeredObserverList.push({observer:j.observer,options:j.options,source:j})}}catch(e){g={error:e}}finally{try{B&&!B.done&&(b=M.return)&&b.call(M)}finally{if(g)throw g.error}}L=f.tree_getNextAncestorNode(t,L,!0)}a.dom.features.mutationObservers&&(r||y.observer_queueTreeMutationRecord(t,[],[e],O,F)),a.dom.features.steps&&l.Guard.isTextNode(e)&&v.dom_runChildTextContentChangeSteps(t)}t.mutation_ensurePreInsertionValidity=g,t.mutation_preInsert=b,t.mutation_insert=x,t.mutation_append=function(e,t){return b(e,t,null)},t.mutation_replace=function(e,t,r){var i,o,l,c,h,p,d,m;if(r._nodeType!==u.NodeType.Document&&r._nodeType!==u.NodeType.DocumentFragment&&r._nodeType!==u.NodeType.Element)throw new s.HierarchyRequestError("Only document, document fragment and element nodes can contain child nodes. Parent node is "+r.nodeName+".");if(f.tree_isHostIncludingAncestorOf(r,t,!0))throw new s.HierarchyRequestError("The node to be inserted cannot be an ancestor of parent node. Node is "+t.nodeName+", parent node is "+r.nodeName+".");if(e._parent!==r)throw new s.NotFoundError("The reference child node cannot be found under parent node. Child node is "+e.nodeName+", parent node is "+r.nodeName+".");if(t._nodeType!==u.NodeType.DocumentFragment&&t._nodeType!==u.NodeType.DocumentType&&t._nodeType!==u.NodeType.Element&&t._nodeType!==u.NodeType.Text&&t._nodeType!==u.NodeType.ProcessingInstruction&&t._nodeType!==u.NodeType.CData&&t._nodeType!==u.NodeType.Comment)throw new s.HierarchyRequestError("Only document fragment, document type, element, text, processing instruction, cdata section or comment nodes can be inserted. Node is "+t.nodeName+".");if(t._nodeType===u.NodeType.Text&&r._nodeType===u.NodeType.Document)throw new s.HierarchyRequestError("Cannot insert a text node as a child of a document node. Node is "+t.nodeName+".");if(t._nodeType===u.NodeType.DocumentType&&r._nodeType!==u.NodeType.Document)throw new s.HierarchyRequestError("A document type node can only be inserted under a document node. Parent node is "+r.nodeName+".");if(r._nodeType===u.NodeType.Document)if(t._nodeType===u.NodeType.DocumentFragment){var v=0;try{for(var g=n(t._children),b=g.next();!b.done;b=g.next()){var E=b.value;if(E._nodeType===u.NodeType.Element)v++;else if(E._nodeType===u.NodeType.Text)throw new s.HierarchyRequestError("Cannot insert text a node as a child of a document node. Node is "+E.nodeName+".")}}catch(e){i={error:e}}finally{try{b&&!b.done&&(o=g.return)&&o.call(g)}finally{if(i)throw i.error}}if(v>1)throw new s.HierarchyRequestError("A document node can only have one document element node. Document fragment to be inserted has "+v+" element nodes.");if(1===v){try{for(var D=n(r._children),S=D.next();!S.done;S=D.next()){if((F=S.value)._nodeType===u.NodeType.Element&&F!==e)throw new s.HierarchyRequestError("The document node already has a document element node.")}}catch(e){l={error:e}}finally{try{S&&!S.done&&(c=D.return)&&c.call(D)}finally{if(l)throw l.error}}for(var C=e._nextSibling;C;){if(C._nodeType===u.NodeType.DocumentType)throw new s.HierarchyRequestError("Cannot insert an element node before a document type node.");C=C._nextSibling}}}else if(t._nodeType===u.NodeType.Element){try{for(var A=n(r._children),N=A.next();!N.done;N=A.next()){if((F=N.value)._nodeType===u.NodeType.Element&&F!==e)throw new s.HierarchyRequestError("Document already has a document element node. Node is "+t.nodeName+".")}}catch(e){h={error:e}}finally{try{N&&!N.done&&(p=A.return)&&p.call(A)}finally{if(h)throw h.error}}for(C=e._nextSibling;C;){if(C._nodeType===u.NodeType.DocumentType)throw new s.HierarchyRequestError("Cannot insert an element node before a document type node. Node is "+t.nodeName+".");C=C._nextSibling}}else if(t._nodeType===u.NodeType.DocumentType){try{for(var T=n(r._children),O=T.next();!O.done;O=T.next()){var F;if((F=O.value)._nodeType===u.NodeType.DocumentType&&F!==e)throw new s.HierarchyRequestError("Document already has a document type node. Node is "+t.nodeName+".")}}catch(e){d={error:e}}finally{try{O&&!O.done&&(m=T.return)&&m.call(T)}finally{if(d)throw d.error}}for(var k=e._previousSibling;k;){if(k._nodeType===u.NodeType.Element)throw new s.HierarchyRequestError("Cannot insert a document type node before an element node. Node is "+t.nodeName+".");k=k._previousSibling}}var P=e._nextSibling;P===t&&(P=t._nextSibling);var I=e._previousSibling;_.document_adopt(t,r._nodeDocument);var L=[];null!==e._parent&&(L.push(e),w(e,e._parent,!0));var M=[];return t._nodeType===u.NodeType.DocumentFragment?M=Array.from(t._children):M.push(t),x(t,r,P,!0),a.dom.features.mutationObservers&&y.observer_queueTreeMutationRecord(r,M,L,I,P),e},t.mutation_replaceAll=function(e,t){var r,i;null!==e&&_.document_adopt(e,t._nodeDocument);var o=Array.from(t._children),s=[];e&&e._nodeType===u.NodeType.DocumentFragment?s=Array.from(e._children):null!==e&&s.push(e);try{for(var l=n(o),c=l.next();!c.done;c=l.next()){w(c.value,t,!0)}}catch(e){r={error:e}}finally{try{c&&!c.done&&(i=l.return)&&i.call(l)}finally{if(r)throw r.error}}null!==e&&x(e,t,null,!0),a.dom.features.mutationObservers&&y.observer_queueTreeMutationRecord(t,s,o,null,null)},t.mutation_preRemove=function(e,t){if(e._parent!==t)throw new s.NotFoundError("The child node cannot be found under parent node. Child node is "+e.nodeName+", parent node is "+t.nodeName+".");return w(e,t),e},t.mutation_remove=w},function(e,t,r){"use strict";function n(e){return null==e}e.exports.isNothing=n,e.exports.isObject=function(e){return"object"==typeof e&&null!==e},e.exports.toArray=function(e){return Array.isArray(e)?e:n(e)?[]:[e]},e.exports.repeat=function(e,t){var r,n="";for(r=0;r<t;r+=1)n+=e;return n},e.exports.isNegativeZero=function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},e.exports.extend=function(e,t){var r,n,i,o;if(t)for(r=0,n=(o=Object.keys(t)).length;r<n;r+=1)e[i=o[r]]=t[i];return e}},function(e,t,r){"use strict";var n=r(38),i=r(53),o=r(10);function a(e,t,r){var n=[];return e.include.forEach((function(e){r=a(e,t,r)})),e[t].forEach((function(e){r.forEach((function(t,r){t.tag===e.tag&&t.kind===e.kind&&n.push(r)})),r.push(e)})),r.filter((function(e,t){return-1===n.indexOf(t)}))}function s(e){this.include=e.include||[],this.implicit=e.implicit||[],this.explicit=e.explicit||[],this.implicit.forEach((function(e){if(e.loadKind&&"scalar"!==e.loadKind)throw new i("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.")})),this.compiledImplicit=a(this,"implicit",[]),this.compiledExplicit=a(this,"explicit",[]),this.compiledTypeMap=function(){var e,t,r={scalar:{},sequence:{},mapping:{},fallback:{}};function n(e){r[e.kind][e.tag]=r.fallback[e.tag]=e}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(n);return r}(this.compiledImplicit,this.compiledExplicit)}s.DEFAULT=null,s.create=function(){var e,t;switch(arguments.length){case 1:e=s.DEFAULT,t=arguments[0];break;case 2:e=arguments[0],t=arguments[1];break;default:throw new i("Wrong number of arguments for Schema.create function")}if(e=n.toArray(e),t=n.toArray(t),!e.every((function(e){return e instanceof s})))throw new i("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");if(!t.every((function(e){return e instanceof o})))throw new i("Specified list of YAML types (or a single Type object) contains a non-Type object.");return new s({include:e,explicit:t})},e.exports=s},function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},function(e,t,r){var n=r(8),i=r(42),o="".split;e.exports=n((function(){return!Object("z").propertyIsEnumerable(0)}))?function(e){return"String"==i(e)?o.call(e,""):Object(e)}:Object},function(e,t){var r={}.toString;e.exports=function(e){return r.call(e).slice(8,-1)}},function(e,t,r){var n,i,o,a=r(185),s=r(11),u=r(13),l=r(21),c=r(14),h=r(57),p=r(45),f=s.WeakMap;if(a){var d=new f,m=d.get,y=d.has,v=d.set;n=function(e,t){return v.call(d,e,t),t},i=function(e){return m.call(d,e)||{}},o=function(e){return y.call(d,e)}}else{var _=h("state");p[_]=!0,n=function(e,t){return l(e,_,t),t},i=function(e){return c(e,_)?e[_]:{}},o=function(e){return c(e,_)}}e.exports={set:n,get:i,has:o,enforce:function(e){return o(e)?i(e):n(e,{})},getterFor:function(e){return function(t){var r;if(!u(t)||(r=i(t)).type!==e)throw TypeError("Incompatible receiver, "+e+" required");return r}}}},function(e,t){e.exports=!1},function(e,t){e.exports={}},function(e,t,r){var n=r(119),i=r(11),o=function(e){return"function"==typeof e?e:void 0};e.exports=function(e,t){return arguments.length<2?o(n[e])||o(i[e]):n[e]&&n[e][t]||i[e]&&i[e][t]}},function(e,t){var r=Math.ceil,n=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?n:r)(e)}},function(e,t,r){"use strict";var n=r(8);e.exports=function(e,t){var r=[][e];return!!r&&n((function(){r.call(null,t||function(){throw 1},1)}))}},function(e,t){e.exports={}},function(e,t,r){"use strict";r(31),r(32),r(33),r(219),r(64),r(19),r(65),r(20),r(92),r(66),r(91),r(143),r(22),r(144),r(23);var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},i=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},o=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(i(arguments[t]));return e};Object.defineProperty(t,"__esModule",{value:!0});var a=r(2),s=r(68),u=r(94),l=r(7),c=r(0),h=function(){function e(e){this.level=0,this._builderOptions=e}return e.prototype.declaration=function(e,t,r){},e.prototype.docType=function(e,t,r){},e.prototype.comment=function(e){},e.prototype.text=function(e){},e.prototype.instruction=function(e,t){},e.prototype.cdata=function(e){},e.prototype.openTagBegin=function(e){},e.prototype.openTagEnd=function(e,t,r){},e.prototype.closeTag=function(e){},e.prototype.attributes=function(e){var t,r;try{for(var i=n(e),o=i.next();!o.done;o=i.next()){var a=o.value;this.attribute(null===a[1]?a[2]:a[1]+":"+a[2],a[3])}}catch(e){t={error:e}}finally{try{o&&!o.done&&(r=i.return)&&r.call(i)}finally{if(t)throw t.error}}},e.prototype.attribute=function(e,t){},e.prototype.beginElement=function(e){},e.prototype.endElement=function(e){},e.prototype.serializeNode=function(e,t,r){var n=void 0!==e._nodeDocument&&e._nodeDocument._hasNamespaces;if(this.level=0,this.currentNode=e,n){var i=new u.NamespacePrefixMap;i.set("xml",l.namespace.XML);this._serializeNodeNS(e,null,i,{value:1},t,r)}else this._serializeNode(e,t,r)},e.prototype._serializeNodeNS=function(e,t,r,n,i,o){switch(this.currentNode=e,e.nodeType){case a.NodeType.Element:this._serializeElementNS(e,t,r,n,i,o);break;case a.NodeType.Document:this._serializeDocumentNS(e,t,r,n,i,o);break;case a.NodeType.Comment:this._serializeComment(e,i,o);break;case a.NodeType.Text:this._serializeText(e,i,o);break;case a.NodeType.DocumentFragment:this._serializeDocumentFragmentNS(e,t,r,n,i,o);break;case a.NodeType.DocumentType:this._serializeDocumentType(e,i,o);break;case a.NodeType.ProcessingInstruction:this._serializeProcessingInstruction(e,i,o);break;case a.NodeType.CData:this._serializeCData(e,i,o);break;default:throw new Error("Unknown node type: "+e.nodeType)}},e.prototype._serializeNode=function(e,t,r){switch(this.currentNode=e,e.nodeType){case a.NodeType.Element:this._serializeElement(e,t,r);break;case a.NodeType.Document:this._serializeDocument(e,t,r);break;case a.NodeType.Comment:this._serializeComment(e,t,r);break;case a.NodeType.Text:this._serializeText(e,t,r);break;case a.NodeType.DocumentFragment:this._serializeDocumentFragment(e,t,r);break;case a.NodeType.DocumentType:this._serializeDocumentType(e,t,r);break;case a.NodeType.ProcessingInstruction:this._serializeProcessingInstruction(e,t,r);break;case a.NodeType.CData:this._serializeCData(e,t,r);break;default:throw new Error("Unknown node type: "+e.nodeType)}},e.prototype._serializeElementNS=function(t,r,i,a,s,u){var h,p,f=[];if(s&&(-1!==t.localName.indexOf(":")||!c.xml_isName(t.localName)))throw new Error("Node local name contains invalid characters (well-formed required).");var d="",m=!1,y=!1,v=i.copy(),_={},g=this._recordNamespaceInformation(t,v,_),b=r,x=t.namespaceURI;if(b===x)null!==g&&(y=!0),d=x===l.namespace.XML?"xml:"+t.localName:t.localName,this.beginElement(d),this.openTagBegin(d);else{var w=t.prefix,E=null;if(null===w&&x===g||(E=v.get(w,x)),"xmlns"===w){if(s)throw new Error("An element cannot have the 'xmlns' prefix (well-formed required).");E=w}null!==E?(d=E+":"+t.localName,null!==g&&g!==l.namespace.XML&&(b=g||null),this.beginElement(d),this.openTagBegin(d)):null!==w?(w in _&&(w=this._generatePrefix(x,v,a)),v.set(w,x),d+=w+":"+t.localName,this.beginElement(d),this.openTagBegin(d),f.push([null,"xmlns",w,this._serializeAttributeValue(x,s,u)]),null!==g&&(b=g||null)):null===g||null!==g&&g!==x?(y=!0,d+=t.localName,b=x,this.beginElement(d),this.openTagBegin(d),f.push([null,null,"xmlns",this._serializeAttributeValue(x,s,u)])):(d+=t.localName,b=x,this.beginElement(d),this.openTagBegin(d))}f.push.apply(f,o(this._serializeAttributesNS(t,v,a,_,y,s,u))),this.attributes(f);var D=x===l.namespace.HTML;if(D&&0===t.childNodes.length&&e._VoidElementNames.has(t.localName)?(this.openTagEnd(d,!0,!0),this.endElement(d),m=!0):D||0!==t.childNodes.length?this.openTagEnd(d,!1,!1):(this.openTagEnd(d,!0,!1),this.endElement(d),m=!0),!m){if(D&&"template"===t.localName);else try{for(var S=n(t.childNodes),C=S.next();!C.done;C=S.next()){var A=C.value;this.level++,this._serializeNodeNS(A,b,v,a,s,u),this.level--}}catch(e){h={error:e}}finally{try{C&&!C.done&&(p=S.return)&&p.call(S)}finally{if(h)throw h.error}}this.closeTag(d),this.endElement(d)}},e.prototype._serializeElement=function(e,t,r){var i,o;if(t&&(-1!==e.localName.indexOf(":")||!c.xml_isName(e.localName)))throw new Error("Node local name contains invalid characters (well-formed required).");var a=!1,s=e.localName;this.beginElement(s),this.openTagBegin(s);var u=this._serializeAttributes(e,t,r);if(this.attributes(u),e.hasChildNodes()?this.openTagEnd(s,!1,!1):(this.openTagEnd(s,!0,!1),this.endElement(s),a=!0),!a){try{for(var l=n(e._children),h=l.next();!h.done;h=l.next()){var p=h.value;this.level++,this._serializeNode(p,t,r),this.level--}}catch(e){i={error:e}}finally{try{h&&!h.done&&(o=l.return)&&o.call(l)}finally{if(i)throw i.error}}this.closeTag(s),this.endElement(s)}},e.prototype._serializeDocumentNS=function(e,t,r,i,o,a){var s,u;if(o&&null===e.documentElement)throw new Error("Missing document element (well-formed required).");try{for(var l=n(e.childNodes),c=l.next();!c.done;c=l.next()){var h=c.value;this._serializeNodeNS(h,t,r,i,o,a)}}catch(e){s={error:e}}finally{try{c&&!c.done&&(u=l.return)&&u.call(l)}finally{if(s)throw s.error}}},e.prototype._serializeDocument=function(e,t,r){var i,o;if(t&&null===e.documentElement)throw new Error("Missing document element (well-formed required).");try{for(var a=n(e._children),s=a.next();!s.done;s=a.next()){var u=s.value;this._serializeNode(u,t,r)}}catch(e){i={error:e}}finally{try{s&&!s.done&&(o=a.return)&&o.call(a)}finally{if(i)throw i.error}}},e.prototype._serializeComment=function(e,t,r){if(t&&(!c.xml_isLegalChar(e.data)||-1!==e.data.indexOf("--")||e.data.endsWith("-")))throw new Error("Comment data contains invalid characters (well-formed required).");this.comment(e.data)},e.prototype._serializeText=function(e,t,r){if(t&&!c.xml_isLegalChar(e.data))throw new Error("Text data contains invalid characters (well-formed required).");var n="";if(r)n=e.data.replace(/(?!&(lt|gt|amp|apos|quot);)&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");else for(var i=0;i<e.data.length;i++){var o=e.data[i];n+="&"===o?"&amp;":"<"===o?"&lt;":">"===o?"&gt;":o}this.text(n)},e.prototype._serializeDocumentFragmentNS=function(e,t,r,i,o,a){var s,u;try{for(var l=n(e.childNodes),c=l.next();!c.done;c=l.next()){var h=c.value;this._serializeNodeNS(h,t,r,i,o,a)}}catch(e){s={error:e}}finally{try{c&&!c.done&&(u=l.return)&&u.call(l)}finally{if(s)throw s.error}}},e.prototype._serializeDocumentFragment=function(e,t,r){var i,o;try{for(var a=n(e._children),s=a.next();!s.done;s=a.next()){var u=s.value;this._serializeNode(u,t,r)}}catch(e){i={error:e}}finally{try{s&&!s.done&&(o=a.return)&&o.call(a)}finally{if(i)throw i.error}}},e.prototype._serializeDocumentType=function(e,t,r){if(t&&!c.xml_isPubidChar(e.publicId))throw new Error("DocType public identifier does not match PubidChar construct (well-formed required).");if(t&&(!c.xml_isLegalChar(e.systemId)||-1!==e.systemId.indexOf('"')&&-1!==e.systemId.indexOf("'")))throw new Error("DocType system identifier contains invalid characters (well-formed required).");this.docType(e.name,e.publicId,e.systemId)},e.prototype._serializeProcessingInstruction=function(e,t,r){if(t&&(-1!==e.target.indexOf(":")||/^xml$/i.test(e.target)))throw new Error("Processing instruction target contains invalid characters (well-formed required).");if(t&&(!c.xml_isLegalChar(e.data)||-1!==e.data.indexOf("?>")))throw new Error("Processing instruction data contains invalid characters (well-formed required).");this.instruction(e.target,e.data)},e.prototype._serializeCData=function(e,t,r){if(t&&-1!==e.data.indexOf("]]>"))throw new Error("CDATA contains invalid characters (well-formed required).");this.cdata(e.data)},e.prototype._serializeAttributesNS=function(e,t,r,i,o,a,u){var h,p,f=[],d=a?new s.LocalNameSet:void 0;try{for(var m=n(e.attributes),y=m.next();!y.done;y=m.next()){var v=y.value;if(a||o||null!==v.namespaceURI){if(a&&d&&d.has(v.namespaceURI,v.localName))throw new Error("Element contains duplicate attributes (well-formed required).");a&&d&&d.set(v.namespaceURI,v.localName);var _=v.namespaceURI,g=null;if(null!==_)if(g=t.get(v.prefix,_),_===l.namespace.XMLNS){if(v.value===l.namespace.XML||null===v.prefix&&o||null!==v.prefix&&(!(v.localName in i)||i[v.localName]!==v.value)&&t.has(v.localName,v.value))continue;if(a&&v.value===l.namespace.XMLNS)throw new Error("XMLNS namespace is reserved (well-formed required).");if(a&&""===v.value)throw new Error("Namespace prefix declarations cannot be used to undeclare a namespace (well-formed required).");"xmlns"===v.prefix&&(g="xmlns")}else null===g&&(g=null===v.prefix||t.hasPrefix(v.prefix)&&!t.has(v.prefix,_)?this._generatePrefix(_,t,r):v.prefix,f.push([null,"xmlns",g,this._serializeAttributeValue(_,a,u)]));if(null!==g&&g,a&&(-1!==v.localName.indexOf(":")||!c.xml_isName(v.localName)||"xmlns"===v.localName&&null===_))throw new Error("Attribute local name contains invalid characters (well-formed required).");f.push([_,g,v.localName,this._serializeAttributeValue(v.value,a,u)])}else f.push([null,null,v.localName,this._serializeAttributeValue(v.value,a,u)])}}catch(e){h={error:e}}finally{try{y&&!y.done&&(p=m.return)&&p.call(m)}finally{if(h)throw h.error}}return f},e.prototype._serializeAttributes=function(e,t,r){var i,o,a=[],s=t?{}:void 0;try{for(var u=n(e.attributes),l=u.next();!l.done;l=u.next()){var h=l.value;if(t){if(t&&s&&h.localName in s)throw new Error("Element contains duplicate attributes (well-formed required).");if(t&&s&&(s[h.localName]=!0),t&&(-1!==h.localName.indexOf(":")||!c.xml_isName(h.localName)))throw new Error("Attribute local name contains invalid characters (well-formed required).");a.push([null,null,h.localName,this._serializeAttributeValue(h.value,t,r)])}else a.push([null,null,h.localName,this._serializeAttributeValue(h.value,t,r)])}}catch(e){i={error:e}}finally{try{l&&!l.done&&(o=u.return)&&o.call(u)}finally{if(i)throw i.error}}return a},e.prototype._recordNamespaceInformation=function(e,t,r){var i,o,a=null;try{for(var s=n(e.attributes),u=s.next();!u.done;u=s.next()){var c=u.value,h=c.namespaceURI,p=c.prefix;if(h===l.namespace.XMLNS){if(null===p){a=c.value;continue}var f=c.localName,d=c.value;if(d===l.namespace.XML)continue;if(""===d&&(d=null),t.has(f,d))continue;t.set(f,d),r[f]=d||""}}}catch(e){i={error:e}}finally{try{u&&!u.done&&(o=s.return)&&o.call(s)}finally{if(i)throw i.error}}return a},e.prototype._generatePrefix=function(e,t,r){var n="ns"+r.value.toString();return r.value++,t.set(n,e),n},e.prototype._serializeAttributeValue=function(e,t,r){if(t&&null!==e&&!c.xml_isLegalChar(e))throw new Error("Invalid characters in attribute value.");if(null===e)return"";if(r)return e.replace(/(?!&(lt|gt|amp|apos|quot);)&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");for(var n="",i=0;i<e.length;i++){var o=e[i];n+='"'===o?"&quot;":"&"===o?"&amp;":"<"===o?"&lt;":">"===o?"&gt;":o}return n},e._VoidElementNames=new Set(["area","base","basefont","bgsound","br","col","embed","frame","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"]),e}();t.BaseWriter=h},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},i=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a};Object.defineProperty(t,"__esModule",{value:!0});var o=r(6),a=r(3),s=r(7),u=r(29),l=r(17),c=r(96);function h(){var e=o.dom.window;e._mutationObserverMicrotaskQueued||(e._mutationObserverMicrotaskQueued=!0,Promise.resolve().then((function(){p()})))}function p(){var e,t,r,i,u=o.dom.window;u._mutationObserverMicrotaskQueued=!1;var l=s.set.clone(u._mutationObservers),h=s.set.clone(u._signalSlots);s.set.empty(u._signalSlots);var p=function(e){var t=s.list.clone(e._recordQueue);s.list.empty(e._recordQueue);for(var r=0;r<e._nodeList.length;r++){var n=e._nodeList[r];s.list.remove(n._registeredObserverList,(function(t){return a.Guard.isTransientRegisteredObserver(t)&&t.observer===e}))}if(!s.list.isEmpty(t))try{e._callback.call(e,t,e)}catch(e){}};try{for(var f=n(l),d=f.next();!d.done;d=f.next()){p(d.value)}}catch(t){e={error:t}}finally{try{d&&!d.done&&(t=f.return)&&t.call(f)}finally{if(e)throw e.error}}if(o.dom.features.slots)try{for(var m=n(h),y=m.next();!y.done;y=m.next()){var v=y.value;c.event_fireAnEvent("slotchange",v,void 0,{bubbles:!0})}}catch(e){r={error:e}}finally{try{y&&!y.done&&(i=m.return)&&i.call(m)}finally{if(r)throw r.error}}}function f(e,t,r,o,a,s,c,p,f){for(var d,m,y=new Map,v=l.tree_getFirstAncestorNode(t,!0);null!==v;){for(var _=0;_<v._registeredObserverList.length;_++){var g=v._registeredObserverList[_],b=g.options;if((v===t||b.subtree)&&(("attributes"!==e||b.attributes)&&("attributes"!==e||!b.attributeFilter||b.attributeFilter.indexOf(r||"")&&null===o)&&("characterData"!==e||b.characterData)&&("childList"!==e||b.childList))){var x=g.observer;y.has(x)||y.set(x,null),("attributes"===e&&b.attributeOldValue||"characterData"===e&&b.characterDataOldValue)&&y.set(x,a)}}v=l.tree_getNextAncestorNode(t,v,!0)}try{for(var w=n(y),E=w.next();!E.done;E=w.next()){var D=i(E.value,2),S=D[0],C=D[1],A=u.create_mutationRecord(e,t,u.create_nodeListStatic(t,s),u.create_nodeListStatic(t,c),p,f,r,o,C);S._recordQueue.push(A)}}catch(e){d={error:e}}finally{try{E&&!E.done&&(m=w.return)&&m.call(w)}finally{if(d)throw d.error}}h()}t.observer_queueAMutationObserverMicrotask=h,t.observer_notifyMutationObservers=p,t.observer_queueMutationRecord=f,t.observer_queueTreeMutationRecord=function(e,t,r,n,i){f("childList",e,null,null,null,t,r,n,i)},t.observer_queueAttributeMutationRecord=function(e,t,r,n){f("attributes",e,t,r,n,[],[],null,null)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(6),i=r(7),o=r(3),a=r(9),s=r(29),u=r(72),l=r(51),c=r(30),h=r(37),p=r(105);function f(e,t,r){n.dom.features.mutationObservers&&l.observer_queueAttributeMutationRecord(t,e._localName,e._namespace,e._value),n.dom.features.customElements&&o.Guard.isCustomElementNode(t)&&u.customElement_enqueueACustomElementCallbackReaction(t,"attributeChangedCallback",[e._localName,e._value,r,e._namespace]),n.dom.features.steps&&c.dom_runAttributeChangeSteps(t,e._localName,e._value,r,e._namespace),e._value=r}function d(e,t){n.dom.features.mutationObservers&&l.observer_queueAttributeMutationRecord(t,e._localName,e._namespace,null),n.dom.features.customElements&&o.Guard.isCustomElementNode(t)&&u.customElement_enqueueACustomElementCallbackReaction(t,"attributeChangedCallback",[e._localName,null,e._value,e._namespace]),n.dom.features.steps&&c.dom_runAttributeChangeSteps(t,e._localName,null,e._value,e._namespace),t._attributeList._asArray().push(e),e._element=t,t._nodeDocument._hasNamespaces||null===e._namespace&&null===e._namespacePrefix&&"xmlns"!==e._localName||(t._nodeDocument._hasNamespaces=!0)}function m(e,t){n.dom.features.mutationObservers&&l.observer_queueAttributeMutationRecord(t,e._localName,e._namespace,e._value),n.dom.features.customElements&&o.Guard.isCustomElementNode(t)&&u.customElement_enqueueACustomElementCallbackReaction(t,"attributeChangedCallback",[e._localName,e._value,null,e._namespace]),n.dom.features.steps&&c.dom_runAttributeChangeSteps(t,e._localName,e._value,null,e._namespace);var r=t._attributeList._asArray().indexOf(e);t._attributeList._asArray().splice(r,1),e._element=null}function y(e,t,r){n.dom.features.mutationObservers&&l.observer_queueAttributeMutationRecord(r,e._localName,e._namespace,e._value),n.dom.features.customElements&&o.Guard.isCustomElementNode(r)&&u.customElement_enqueueACustomElementCallbackReaction(r,"attributeChangedCallback",[e._localName,e._value,t._value,e._namespace]),n.dom.features.steps&&c.dom_runAttributeChangeSteps(r,e._localName,e._value,t._value,e._namespace);var i=r._attributeList._asArray().indexOf(e);-1!==i&&(r._attributeList._asArray()[i]=t),e._element=null,t._element=r,r._nodeDocument._hasNamespaces||null===t._namespace&&null===t._namespacePrefix&&"xmlns"!==t._localName||(r._nodeDocument._hasNamespaces=!0)}function v(e,t){return t._namespace===i.namespace.HTML&&"html"===t._nodeDocument._type&&(e=e.toLowerCase()),t._attributeList._asArray().find((function(t){return t._qualifiedName===e}))||null}function _(e,t,r){var n=e||null;return r._attributeList._asArray().find((function(e){return e._namespace===n&&e._localName===t}))||null}t.element_has=function(e,t){return-1!==t._attributeList._asArray().indexOf(e)},t.element_change=f,t.element_append=d,t.element_remove=m,t.element_replace=y,t.element_getAnAttributeByName=v,t.element_getAnAttributeByNamespaceAndLocalName=_,t.element_getAnAttributeValue=function(e,t,r){void 0===r&&(r="");var n=_(r,t,e);return null===n?"":n._value},t.element_setAnAttribute=function(e,t){if(null!==e._element&&e._element!==t)throw new a.InUseAttributeError("This attribute already exists in the document: "+e._qualifiedName+" as a child of "+e._element._qualifiedName+".");var r=_(e._namespace||"",e._localName,t);return r===e?e:(null!==r?y(r,e,t):d(e,t),r)},t.element_setAnAttributeValue=function(e,t,r,n,i){void 0===n&&(n=null),void 0===i&&(i=null);var o=_(i||"",t,e);if(null===o){var a=s.create_attr(e._nodeDocument,t);return a._namespace=i,a._namespacePrefix=n,a._value=r,void d(a,e)}f(o,e,r)},t.element_removeAnAttributeByName=function(e,t){var r=v(e,t);return null!==r&&m(r,t),r},t.element_removeAnAttributeByNamespaceAndLocalName=function(e,t,r){var n=_(e,t,r);return null!==n&&m(n,r),n},t.element_createAnElement=function(e,t,r,o,l,c){void 0===o&&(o=null),void 0===l&&(l=null),void 0===c&&(c=!1);var h=null;if(!n.dom.features.customElements)return(h=s.create_element(e,t,r,o))._customElementState="uncustomized",h._customElementDefinition=null,h._is=l,h;var f=u.customElement_lookUpACustomElementDefinition(e,r,t,l);if(null!==f&&f.name!==f.localName)(h=new(p.document_elementInterface(t,i.namespace.HTML)))._localName=t,h._namespace=i.namespace.HTML,h._namespacePrefix=o,h._customElementState="undefined",h._customElementDefinition=null,h._is=l,h._nodeDocument=e,c?u.customElement_upgrade(f,h):u.customElement_enqueueACustomElementUpgradeReaction(h,f);else if(null!==f)if(c)try{var d=new(0,f.constructor);if(console.assert(void 0!==d._customElementState),console.assert(void 0!==d._customElementDefinition),console.assert(d._namespace===i.namespace.HTML),0!==d._attributeList.length)throw new a.NotSupportedError("Custom element already has attributes.");if(0!==d._children.size)throw new a.NotSupportedError("Custom element already has child nodes.");if(null!==d._parent)throw new a.NotSupportedError("Custom element already has a parent node.");if(d._nodeDocument!==e)throw new a.NotSupportedError("Custom element is already in a document.");if(d._localName!==t)throw new a.NotSupportedError("Custom element has a different local name.");d._namespacePrefix=o,d._is=null}catch(r){(h=s.create_htmlUnknownElement(e,t,i.namespace.HTML,o))._customElementState="failed",h._customElementDefinition=null,h._is=null}else(h=s.create_htmlElement(e,t,i.namespace.HTML,o))._customElementState="undefined",h._customElementDefinition=null,h._is=null,u.customElement_enqueueACustomElementUpgradeReaction(h,f);else{(h=new(p.document_elementInterface(t,r)))._localName=t,h._namespace=r,h._namespacePrefix=o,h._customElementState="uncustomized",h._customElementDefinition=null,h._is=l,h._nodeDocument=e,r!==i.namespace.HTML||null===l&&!u.customElement_isValidCustomElementName(t)||(h._customElementState="undefined")}if(null===h)throw new Error("Unable to create element.");return h},t.element_insertAdjacent=function(e,t,r){switch(t.toLowerCase()){case"beforebegin":return null===e._parent?null:h.mutation_preInsert(r,e._parent,e);case"afterbegin":return h.mutation_preInsert(r,e,e._firstChild);case"beforeend":return h.mutation_preInsert(r,e,null);case"afterend":return null===e._parent?null:h.mutation_preInsert(r,e._parent,e._nextSibling);default:throw new a.SyntaxError('Invalid \'where\' argument. "beforebegin", "afterbegin", "beforeend" or "afterend" expected')}}},function(e,t,r){"use strict";function n(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=(this.reason||"(unknown reason)")+(this.mark?" "+this.mark.toString():""),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}n.prototype=Object.create(Error.prototype),n.prototype.constructor=n,n.prototype.toString=function(e){var t=this.name+": ";return t+=this.reason||"(unknown reason)",!e&&this.mark&&(t+=" "+this.mark.toString()),t},e.exports=n},function(e,t,r){"use strict";var n=r(39);e.exports=new n({include:[r(180)],implicit:[r(293),r(294)],explicit:[r(295),r(296),r(297),r(298)]})},function(e,t,r){var n=r(16),i=r(78),o=r(40),a=r(24),s=r(56),u=r(14),l=r(114),c=Object.getOwnPropertyDescriptor;t.f=n?c:function(e,t){if(e=a(e),t=s(t,!0),l)try{return c(e,t)}catch(e){}if(u(e,t))return o(!i.f.call(e,t),e[t])}},function(e,t,r){var n=r(13);e.exports=function(e,t){if(!n(e))return e;var r,i;if(t&&"function"==typeof(r=e.toString)&&!n(i=r.call(e)))return i;if("function"==typeof(r=e.valueOf)&&!n(i=r.call(e)))return i;if(!t&&"function"==typeof(r=e.toString)&&!n(i=r.call(e)))return i;throw TypeError("Can't convert object to primitive value")}},function(e,t,r){var n=r(80),i=r(58),o=n("keys");e.exports=function(e){return o[e]||(o[e]=i(e))}},function(e,t){var r=0,n=Math.random();e.exports=function(e){return"Symbol("+String(void 0===e?"":e)+")_"+(++r+n).toString(36)}},function(e,t,r){var n=r(42);e.exports=Array.isArray||function(e){return"Array"==n(e)}},function(e,t,r){var n,i=r(18),o=r(187),a=r(83),s=r(45),u=r(188),l=r(115),c=r(57),h=c("IE_PROTO"),p=function(){},f=function(e){return"<script>"+e+"<\/script>"},d=function(){try{n=document.domain&&new ActiveXObject("htmlfile")}catch(e){}var e,t;d=n?function(e){e.write(f("")),e.close();var t=e.parentWindow.Object;return e=null,t}(n):((t=l("iframe")).style.display="none",u.appendChild(t),t.src=String("javascript:"),(e=t.contentWindow.document).open(),e.write(f("document.F=Object")),e.close(),e.F);for(var r=a.length;r--;)delete d.prototype[a[r]];return d()};s[h]=!0,e.exports=Object.create||function(e,t){var r;return null!==e?(p.prototype=i(e),r=new p,p.prototype=null,r[h]=e):r=d(),void 0===t?r:o(r,t)}},function(e,t,r){var n=r(120),i=r(83);e.exports=Object.keys||function(e){return n(e,i)}},function(e,t,r){var n=r(15).f,i=r(14),o=r(5)("toStringTag");e.exports=function(e,t,r){e&&!i(e=r?e:e.prototype,o)&&n(e,o,{configurable:!0,value:t})}},function(e,t,r){var n=r(8),i=r(5),o=r(128),a=i("species");e.exports=function(e){return o>=51||!n((function(){var t=[];return(t.constructor={})[a]=function(){return{foo:1}},1!==t[e](Boolean).foo}))}},function(e,t,r){"use strict";var n=r(4),i=r(121).indexOf,o=r(48),a=r(28),s=[].indexOf,u=!!s&&1/[1].indexOf(1,-0)<0,l=o("indexOf"),c=a("indexOf",{ACCESSORS:!0,1:0});n({target:"Array",proto:!0,forced:u||!l||!c},{indexOf:function(e){return u?s.apply(this,arguments)||0:i(this,e,arguments.length>1?arguments[1]:void 0)}})},function(e,t,r){var n=r(16),i=r(15).f,o=Function.prototype,a=o.toString,s=/^\s*function ([^ (]*)/;n&&!("name"in o)&&i(o,"name",{configurable:!0,get:function(){try{return a.call(this).match(s)[1]}catch(e){return""}}})},function(e,t,r){"use strict";var n=r(25),i=r(18),o=r(8),a=r(135),s=RegExp.prototype,u=s.toString,l=o((function(){return"/a/b"!=u.call({source:"a",flags:"b"})})),c="toString"!=u.name;(l||c)&&n(RegExp.prototype,"toString",(function(){var e=i(this),t=String(e.source),r=e.flags;return"/"+t+"/"+String(void 0===r&&e instanceof RegExp&&!("flags"in s)?a.call(e):r)}),{unsafe:!0})},function(e,t,r){"use strict";r(31),r(32),r(33),r(19),r(137),r(20),r(66),r(22),r(23);var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var a=r(1),s=r(2),u=function(e){function t(t,r){var n=e.call(this,t)||this;return n._writerOptions=a.applyDefaults(r,{format:"object",wellFormed:!1,noDoubleEncoding:!1,group:!1,verbose:!1}),n}return i(t,e),t.prototype.serialize=function(e){return this._currentList=[],this._currentIndex=0,this._listRegister=[this._currentList],this.serializeNode(e,this._writerOptions.wellFormed,this._writerOptions.noDoubleEncoding),this._process(this._currentList,this._writerOptions)},t.prototype._process=function(e,t){var r,n,i,o,u,l,c;if(0===e.length)return{};for(var h={},p=!1,f=0,d=0,m=0,y=0,v=0;v<e.length;v++){var _=e[v];switch(I=Object.keys(_)[0]){case"@":continue;case"#":f++;break;case"!":d++;break;case"?":m++;break;case"$":y++;break;default:h[I]?p=!0:h[I]=!0}}var g=this._getAttrKey(),b=this._getNodeKey(s.NodeType.Text),x=this._getNodeKey(s.NodeType.Comment),w=this._getNodeKey(s.NodeType.ProcessingInstruction),E=this._getNodeKey(s.NodeType.CData);if(1===f&&1===e.length&&a.isString(e[0]["#"]))return e[0]["#"];if(p){var D={};for(v=0;v<e.length;v++){_=e[v];if("@"===(I=Object.keys(_)[0])){var S=_["@"];1===(L=Object.keys(S)).length?D[g+L[0]]=S[L[0]]:D[g]=_["@"]}}var C=[];for(v=0;v<e.length;v++){_=e[v];switch(I=Object.keys(_)[0]){case"@":break;case"#":C.push(((r={})[b]=_["#"],r));break;case"!":C.push(((n={})[x]=_["!"],n));break;case"?":C.push(((i={})[w]=_["?"],i));break;case"$":C.push(((o={})[E]=_.$,o));break;default:if(0!==(B=_)[I].length&&a.isArray(B[I][0])){for(var A=[],N=B[I],T=0;T<N.length;T++)A.push(this._process(N[T],t));C.push(((u={})[I]=A,u))}else t.verbose?C.push(((l={})[I]=[this._process(B[I],t)],l)):C.push(((c={})[I]=this._process(B[I],t),c))}}return D[b]=C,D}var O=1,F=1,k=1,P=1;for(D={},v=0;v<e.length;v++){var I;_=e[v];switch(I=Object.keys(_)[0]){case"@":S=_["@"];var L=Object.keys(S);if(t.group&&1!==L.length)D[g]=S;else for(var M in S)D[g+M]=S[M];break;case"#":O=this._processSpecItem(_["#"],D,t.group,b,f,O);break;case"!":F=this._processSpecItem(_["!"],D,t.group,x,d,F);break;case"?":k=this._processSpecItem(_["?"],D,t.group,w,m,k);break;case"$":P=this._processSpecItem(_.$,D,t.group,E,y,P);break;default:var B;if(0!==(B=_)[I].length&&a.isArray(B[I][0])){A=[],N=B[I];for(var j=0;j<N.length;j++)A.push(this._process(N[j],t));D[I]=A}else t.verbose?D[I]=[this._process(B[I],t)]:D[I]=this._process(B[I],t)}}return D},t.prototype._processSpecItem=function(e,t,r,n,i,s){var u,l;if(!r&&a.isArray(e)&&i+e.length>2)try{for(var c=o(e),h=c.next();!h.done;h=c.next()){var p=h.value;t[n+(s++).toString()]=p}}catch(e){u={error:e}}finally{try{h&&!h.done&&(l=c.return)&&l.call(c)}finally{if(u)throw u.error}}else t[i>1?n+(s++).toString():n]=e;return s},t.prototype.beginElement=function(e){var t,r,n=[];if(0===this._currentList.length)this._currentList.push(((t={})[e]=n,t));else{var i=this._currentList[this._currentList.length-1];if(this._isElementNode(i,e))if(0!==i[e].length&&a.isArray(i[e][0]))i[e].push(n);else i[e]=[i[e],n];else this._currentList.push(((r={})[e]=n,r))}this._currentIndex++,this._listRegister.length>this._currentIndex?this._listRegister[this._currentIndex]=n:this._listRegister.push(n),this._currentList=n},t.prototype.endElement=function(){this._currentList=this._listRegister[--this._currentIndex]},t.prototype.attribute=function(e,t){var r,n;if(0===this._currentList.length)this._currentList.push({"@":(r={},r[e]=t,r)});else{var i=this._currentList[this._currentList.length-1];this._isAttrNode(i)?i["@"][e]=t:this._currentList.push({"@":(n={},n[e]=t,n)})}},t.prototype.comment=function(e){if(0===this._currentList.length)this._currentList.push({"!":e});else{var t=this._currentList[this._currentList.length-1];this._isCommentNode(t)?a.isArray(t["!"])?t["!"].push(e):t["!"]=[t["!"],e]:this._currentList.push({"!":e})}},t.prototype.text=function(e){if(0===this._currentList.length)this._currentList.push({"#":e});else{var t=this._currentList[this._currentList.length-1];this._isTextNode(t)?a.isArray(t["#"])?t["#"].push(e):t["#"]=[t["#"],e]:this._currentList.push({"#":e})}},t.prototype.instruction=function(e,t){var r=""===t?e:e+" "+t;if(0===this._currentList.length)this._currentList.push({"?":r});else{var n=this._currentList[this._currentList.length-1];this._isInstructionNode(n)?a.isArray(n["?"])?n["?"].push(r):n["?"]=[n["?"],r]:this._currentList.push({"?":r})}},t.prototype.cdata=function(e){if(0===this._currentList.length)this._currentList.push({$:e});else{var t=this._currentList[this._currentList.length-1];this._isCDATANode(t)?a.isArray(t.$)?t.$.push(e):t.$=[t.$,e]:this._currentList.push({$:e})}},t.prototype._isAttrNode=function(e){return"@"in e},t.prototype._isTextNode=function(e){return"#"in e},t.prototype._isCommentNode=function(e){return"!"in e},t.prototype._isInstructionNode=function(e){return"?"in e},t.prototype._isCDATANode=function(e){return"$"in e},t.prototype._isElementNode=function(e,t){return t in e},t.prototype._getAttrKey=function(){return this._builderOptions.convert.att},t.prototype._getNodeKey=function(e){switch(e){case s.NodeType.Comment:return this._builderOptions.convert.comment;case s.NodeType.Text:return this._builderOptions.convert.text;case s.NodeType.ProcessingInstruction:return this._builderOptions.convert.ins;case s.NodeType.CData:return this._builderOptions.convert.cdata;default:throw new Error("Invalid node type.")}},t}(r(50).BaseWriter);t.ObjectWriter=u},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){this._items={},this._nullItems={}}return e.prototype.set=function(e,t){null===e?this._nullItems[t]=!0:(this._items[e]||(this._items[e]={}),this._items[e][t]=!0)},e.prototype.has=function(e,t){return null===e?!0===this._nullItems[t]:!!this._items[e]&&!0===this._items[e][t]},e}();t.LocalNameSet=n},function(e,t,r){"use strict";var n=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a};Object.defineProperty(t,"__esModule",{value:!0});var i=r(9),o=r(3),a=r(0),s=function(){function e(){}return Object.defineProperty(e.prototype,"_eventListenerList",{get:function(){return this.__eventListenerList||(this.__eventListenerList=[])},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"_eventHandlerMap",{get:function(){return this.__eventHandlerMap||(this.__eventHandlerMap={})},enumerable:!0,configurable:!0}),e.prototype.addEventListener=function(e,t,r){void 0===r&&(r={passive:!1,once:!1,capture:!1});var i,s=n(a.eventTarget_flattenMore(r),3),u=s[0],l=s[1],c=s[2];t&&(i=o.Guard.isEventListener(t)?t:{handleEvent:t},a.eventTarget_addEventListener(this,{type:e,callback:i,capture:u,passive:l,once:c,removed:!1}))},e.prototype.removeEventListener=function(e,t,r){void 0===r&&(r={capture:!1});var n=a.eventTarget_flatten(r);if(t)for(var i=0;i<this._eventListenerList.length;i++){var s=this._eventListenerList[i];if(s.type===e&&s.capture===n){if(o.Guard.isEventListener(t)&&s.callback===t){a.eventTarget_removeEventListener(this,s,i);break}if(t&&s.callback.handleEvent===t){a.eventTarget_removeEventListener(this,s,i);break}}}},e.prototype.dispatchEvent=function(e){if(e._dispatchFlag||!e._initializedFlag)throw new i.InvalidStateError;return e._isTrusted=!1,a.event_dispatch(e,this)},e.prototype._getTheParent=function(e){return null},e}();t.EventTargetImpl=s},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(34),a=r(0),s=function(e){function t(t){var r=e.call(this)||this;return r._data=t,r}return i(t,e),Object.defineProperty(t.prototype,"data",{get:function(){return this._data},set:function(e){a.characterData_replaceData(this,0,this._data.length,e)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"length",{get:function(){return this._data.length},enumerable:!0,configurable:!0}),t.prototype.substringData=function(e,t){return a.characterData_substringData(this,e,t)},t.prototype.appendData=function(e){return a.characterData_replaceData(this,this._data.length,0,e)},t.prototype.insertData=function(e,t){a.characterData_replaceData(this,e,0,t)},t.prototype.deleteData=function(e,t){a.characterData_replaceData(this,e,t,"")},t.prototype.replaceData=function(e,t,r){a.characterData_replaceData(this,e,t,r)},Object.defineProperty(t.prototype,"previousElementSibling",{get:function(){throw new Error("Mixin: NonDocumentTypeChildNode not implemented.")},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"nextElementSibling",{get:function(){throw new Error("Mixin: NonDocumentTypeChildNode not implemented.")},enumerable:!0,configurable:!0}),t.prototype.before=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ChildNode not implemented.")},t.prototype.after=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ChildNode not implemented.")},t.prototype.replaceWith=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ChildNode not implemented.")},t.prototype.remove=function(){throw new Error("Mixin: ChildNode not implemented.")},t}(o.NodeImpl);t.CharacterDataImpl=s},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},i=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},o=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(i(arguments[t]));return e};Object.defineProperty(t,"__esModule",{value:!0});var a=r(6),s=r(3),u=r(1),l=r(17),c=r(51);function h(e){a.dom.window._signalSlots.add(e),c.observer_queueAMutationObserverMicrotask()}function p(e,t){void 0===t&&(t=!1);var r=s.Cast.asNode(e)._parent;if(null===r)return null;var n=r._shadowRoot||null;if(null===n)return null;if(t&&"open"!==n._mode)return null;for(var i=l.tree_getFirstDescendantNode(n,!1,!0,(function(e){return s.Guard.isSlot(e)}));null!==i;){if(i._name===e._name)return i;i=l.tree_getNextDescendantNode(n,i,!1,!0,(function(e){return s.Guard.isSlot(e)}))}return null}function f(e){var t,r,i=[],o=l.tree_rootNode(e);if(!s.Guard.isShadowRoot(o))return i;var a=o._host;try{for(var u=n(a._children),c=u.next();!c.done;c=u.next()){var h=c.value;if(s.Guard.isSlotable(h))p(h)===e&&i.push(h)}}catch(e){t={error:e}}finally{try{c&&!c.done&&(r=u.return)&&r.call(u)}finally{if(t)throw t.error}}return i}function d(e){var t,r,i=f(e);if(i.length===e._assignedNodes.length){for(var o=!0,a=0;a<i.length;a++)if(i[a]!==e._assignedNodes[a]){o=!1;break}o||h(e)}e._assignedNodes=i;try{for(var s=n(i),u=s.next();!u.done;u=s.next()){u.value._assignedSlot=e}}catch(e){t={error:e}}finally{try{u&&!u.done&&(r=s.return)&&r.call(s)}finally{if(t)throw t.error}}}t.shadowTree_signalASlotChange=h,t.shadowTree_isConnected=function(e){return s.Guard.isDocumentNode(l.tree_rootNode(e,!0))},t.shadowTree_isAssigned=function(e){return null!==e._assignedSlot},t.shadowTree_findASlot=p,t.shadowTree_findSlotables=f,t.shadowTree_findFlattenedSlotables=function e(t){var r,i,a,c,h=[],p=l.tree_rootNode(t);if(!s.Guard.isShadowRoot(p))return h;var d=f(t);if(u.isEmpty(d))try{for(var m=n(t._children),y=m.next();!y.done;y=m.next()){var v=y.value;s.Guard.isSlotable(v)&&d.push(v)}}catch(e){r={error:e}}finally{try{y&&!y.done&&(i=m.return)&&i.call(m)}finally{if(r)throw r.error}}try{for(var _=n(d),g=_.next();!g.done;g=_.next()){var b=g.value;if(s.Guard.isSlot(b)&&s.Guard.isShadowRoot(l.tree_rootNode(b))){var x=e(b);h.push.apply(h,o(x))}else h.push(b)}}catch(e){a={error:e}}finally{try{g&&!g.done&&(c=_.return)&&c.call(_)}finally{if(a)throw a.error}}return h},t.shadowTree_assignSlotables=d,t.shadowTree_assignSlotablesForATree=function(e){for(var t=l.tree_getFirstDescendantNode(e,!0,!1,(function(e){return s.Guard.isSlot(e)}));null!==t;)d(t),t=l.tree_getNextDescendantNode(e,t,!0,!1,(function(e){return s.Guard.isSlot(e)}))},t.shadowTree_assignASlot=function(e){var t=p(e);null!==t&&d(t)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=/[a-z]([\0-\t\x2D\._a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-([\0-\t\x2D\._a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*/,i=new Set(["annotation-xml","color-profile","font-face","font-face-src","font-face-uri","font-face-format","font-face-name","missing-glyph"]),o=new Set(["article","aside","blockquote","body","div","footer","h1","h2","h3","h4","h5","h6","header","main","nav","p","section","span"]),a=new Set(["area","base","basefont","bgsound","br","col","embed","frame","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"]),s=new Set(["article","aside","blockquote","body","div","footer","h1","h2","h3","h4","h5","h6","header","main","nav","p","section","span"]);t.customElement_isValidCustomElementName=function(e){return!!n.test(e)&&!i.has(e)},t.customElement_isValidElementName=function(e){return o.has(e)},t.customElement_isVoidElementName=function(e){return a.has(e)},t.customElement_isValidShadowHostName=function(e){return s.has(e)},t.customElement_enqueueACustomElementUpgradeReaction=function(e,t){},t.customElement_enqueueACustomElementCallbackReaction=function(e,t,r){},t.customElement_upgrade=function(e,t){},t.customElement_tryToUpgrade=function(e){},t.customElement_lookUpACustomElementDefinition=function(e,t,r,n){return null}},function(e,t,r){r(4)({target:"String",proto:!0},{repeat:r(258)})},function(e,t,r){"use strict";r(278),Object.defineProperty(t,"__esModule",{value:!0});var n=r(108),i=function(){function e(e){this._builderOptions=e,e.parser&&Object.assign(this,e.parser)}return e.prototype._docType=function(e,t,r,n){return e.dtd({name:t,pubID:r,sysID:n})},e.prototype._comment=function(e,t){return e.com(t)},e.prototype._text=function(e,t){return e.txt(t)},e.prototype._instruction=function(e,t,r){return e.ins(t,r)},e.prototype._cdata=function(e,t){return e.dat(t)},e.prototype._element=function(e,t,r){return void 0===t?e.ele(r):e.ele(t,r)},e.prototype._attribute=function(e,t,r,n){return void 0===t?e.att(r,n):e.att(t,r,n)},e.prototype._sanitize=function(e){return n.sanitizeInput(e,this._builderOptions.invalidCharReplacement)},e.prototype.parse=function(e,t){return this._parse(e,t)},e.prototype.docType=function(e,t,r,n){return this._docType(e,t,r,n)},e.prototype.comment=function(e,t){return this._comment(e,t)},e.prototype.text=function(e,t){return this._text(e,t)},e.prototype.instruction=function(e,t,r){return this._instruction(e,t,r)},e.prototype.cdata=function(e,t){return this._cdata(e,t)},e.prototype.element=function(e,t,r){return this._element(e,t,r)},e.prototype.attribute=function(e,t,r,n){return this._attribute(e,t,r,n)},e.prototype.sanitize=function(e){return this._sanitize(e)},e}();t.BaseReader=i},function(e,t,r){"use strict";var n=r(39);e.exports=n.DEFAULT=new n({include:[r(54)],explicit:[r(299),r(300),r(301)]})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(184);t.XMLBuilderImpl=n.XMLBuilderImpl;var i=r(304);t.XMLBuilderCBImpl=i.XMLBuilderCBImpl;var o=r(182);t.builder=o.builder,t.create=o.create,t.fragment=o.fragment,t.convert=o.convert;var a=r(309);t.createCB=a.createCB,t.fragmentCB=a.fragmentCB},function(e,t){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(e){"object"==typeof window&&(r=window)}e.exports=r},function(e,t,r){"use strict";var n={}.propertyIsEnumerable,i=Object.getOwnPropertyDescriptor,o=i&&!n.call({1:2},1);t.f=o?function(e){var t=i(this,e);return!!t&&t.enumerable}:n},function(e,t,r){var n=r(11),i=r(21);e.exports=function(e,t){try{i(n,e,t)}catch(r){n[e]=t}return t}},function(e,t,r){var n=r(44),i=r(117);(e.exports=function(e,t){return i[e]||(i[e]=void 0!==t?t:{})})("versions",[]).push({version:"3.6.5",mode:n?"pure":"global",copyright:"© 2020 Denis Pushkarev (zloirock.ru)"})},function(e,t,r){var n=r(120),i=r(83).concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return n(e,i)}},function(e,t,r){var n=r(47),i=Math.max,o=Math.min;e.exports=function(e,t){var r=n(e);return r<0?i(r+t,0):o(r,t)}},function(e,t){e.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},function(e,t){t.f=Object.getOwnPropertySymbols},function(e,t,r){var n=r(8);e.exports=!!Object.getOwnPropertySymbols&&!n((function(){return!String(Symbol())}))},function(e,t,r){var n=r(126);e.exports=function(e,t,r){if(n(e),void 0===t)return e;switch(r){case 0:return function(){return e.call(t)};case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,i){return e.call(t,r,n,i)}}return function(){return e.apply(t,arguments)}}},function(e,t,r){"use strict";var n=r(4),i=r(194),o=r(131),a=r(132),s=r(62),u=r(21),l=r(25),c=r(5),h=r(44),p=r(49),f=r(130),d=f.IteratorPrototype,m=f.BUGGY_SAFARI_ITERATORS,y=c("iterator"),v=function(){return this};e.exports=function(e,t,r,c,f,_,g){i(r,t,c);var b,x,w,E=function(e){if(e===f&&N)return N;if(!m&&e in C)return C[e];switch(e){case"keys":case"values":case"entries":return function(){return new r(this,e)}}return function(){return new r(this)}},D=t+" Iterator",S=!1,C=e.prototype,A=C[y]||C["@@iterator"]||f&&C[f],N=!m&&A||E(f),T="Array"==t&&C.entries||A;if(T&&(b=o(T.call(new e)),d!==Object.prototype&&b.next&&(h||o(b)===d||(a?a(b,d):"function"!=typeof b[y]&&u(b,y,v)),s(b,D,!0,!0),h&&(p[D]=v))),"values"==f&&A&&"values"!==A.name&&(S=!0,N=function(){return A.call(this)}),h&&!g||C[y]===N||u(C,y,N),p[t]=N,f)if(x={values:E("values"),keys:_?N:E("keys"),entries:E("entries")},g)for(w in x)(m||S||!(w in C))&&l(C,w,x[w]);else n({target:t,proto:!0,forced:m||S},x);return x}},function(e,t,r){"use strict";var n=r(4),i=r(13),o=r(59),a=r(82),s=r(26),u=r(24),l=r(133),c=r(5),h=r(63),p=r(28),f=h("slice"),d=p("slice",{ACCESSORS:!0,0:0,1:2}),m=c("species"),y=[].slice,v=Math.max;n({target:"Array",proto:!0,forced:!f||!d},{slice:function(e,t){var r,n,c,h=u(this),p=s(h.length),f=a(e,p),d=a(void 0===t?p:t,p);if(o(h)&&("function"!=typeof(r=h.constructor)||r!==Array&&!o(r.prototype)?i(r)&&null===(r=r[m])&&(r=void 0):r=void 0,r===Array||void 0===r))return y.call(h,f,d);for(n=new(void 0===r?Array:r)(v(d-f,0)),c=0;f<d;f++,c++)f in h&&l(n,c,h[f]);return n.length=c,n}})},function(e,t,r){var n={};n[r(5)("toStringTag")]="z",e.exports="[object z]"===String(n)},function(e,t,r){"use strict";r(19),r(137),r(20),r(91),r(22),r(23),Object.defineProperty(t,"__esModule",{value:!0}),t.DefaultBuilderOptions={version:"1.0",encoding:void 0,standalone:void 0,keepNullNodes:!1,keepNullAttributes:!1,ignoreConverters:!1,convert:{att:"@",ins:"?",text:"#",cdata:"$",comment:"!"},defaultNamespace:{ele:void 0,att:void 0},namespaceAlias:{html:"http://www.w3.org/1999/xhtml",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg",xlink:"http://www.w3.org/1999/xlink"},invalidCharReplacement:void 0,parser:void 0},t.XMLBuilderOptionKeys=new Set(Object.keys(t.DefaultBuilderOptions)),t.DefaultXMLBuilderCBOptions={format:"xml",wellFormed:!1,prettyPrint:!1,indent:"  ",newline:"\n",offset:0,width:0,allowEmptyTags:!1,spaceBeforeSlash:!1,keepNullNodes:!1,keepNullAttributes:!1,ignoreConverters:!1,convert:{att:"@",ins:"?",text:"#",cdata:"$",comment:"!"},defaultNamespace:{ele:void 0,att:void 0},namespaceAlias:{html:"http://www.w3.org/1999/xhtml",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg",xlink:"http://www.w3.org/1999/xlink"}}},function(e,t,r){"use strict";var n=r(138),i=r(142);e.exports=n("Set",(function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}}),i)},function(e,t,r){"use strict";var n=r(4),i=r(93);n({target:"RegExp",proto:!0,forced:/./.exec!==i},{exec:i})},function(e,t,r){"use strict";var n,i,o=r(135),a=r(220),s=RegExp.prototype.exec,u=String.prototype.replace,l=s,c=(n=/a/,i=/b*/g,s.call(n,"a"),s.call(i,"a"),0!==n.lastIndex||0!==i.lastIndex),h=a.UNSUPPORTED_Y||a.BROKEN_CARET,p=void 0!==/()??/.exec("")[1];(c||p||h)&&(l=function(e){var t,r,n,i,a=this,l=h&&a.sticky,f=o.call(a),d=a.source,m=0,y=e;return l&&(-1===(f=f.replace("y","")).indexOf("g")&&(f+="g"),y=String(e).slice(a.lastIndex),a.lastIndex>0&&(!a.multiline||a.multiline&&"\n"!==e[a.lastIndex-1])&&(d="(?: "+d+")",y=" "+y,m++),r=new RegExp("^(?:"+d+")",f)),p&&(r=new RegExp("^"+d+"$(?!\\s)",f)),c&&(t=a.lastIndex),n=s.call(l?r:a,y),l?n?(n.input=n.input.slice(m),n[0]=n[0].slice(m),n.index=a.lastIndex,a.lastIndex+=n[0].length):a.lastIndex=0:c&&n&&(a.lastIndex=a.global?n.index+n[0].length:t),p&&n&&n.length>1&&u.call(n[0],r,(function(){for(i=1;i<arguments.length-2;i++)void 0===arguments[i]&&(n[i]=void 0)})),n}),e.exports=l},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){this._items={},this._nullItems=[]}return e.prototype.copy=function(){var t=new e;for(var r in this._items)t._items[r]=this._items[r].slice(0);return t._nullItems=this._nullItems.slice(0),t},e.prototype.get=function(e,t){var r=null===t?this._nullItems:this._items[t]||null;if(null===r)return null;for(var n=null,i=0;i<r.length;i++)if((n=r[i])===e)return n;return n},e.prototype.has=function(e,t){var r=null===t?this._nullItems:this._items[t]||null;return null!==r&&-1!==r.indexOf(e)},e.prototype.hasPrefix=function(e){if(-1!==this._nullItems.indexOf(e))return!0;for(var t in this._items)if(-1!==this._items[t].indexOf(e))return!0;return!1},e.prototype.set=function(e,t){var r=null===t?this._nullItems:this._items[t]||null;null!==t&&null===r?this._items[t]=[e]:r.push(e)},e}();t.NamespacePrefixMap=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Surrogate=/[\uD800-\uDFFF]/,t.ScalarValue=/[\uD800-\uDFFF]/,t.NonCharacter=/[\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]/,t.ASCIICodePoint=/[\u0000-\u007F]/,t.ASCIITabOrNewLine=/[\t\n\r]/,t.ASCIIWhiteSpace=/[\t\n\f\r ]/,t.C0Control=/[\u0000-\u001F]/,t.C0ControlOrSpace=/[\u0000-\u001F ]/,t.Control=/[\u0000-\u001F\u007F-\u009F]/,t.ASCIIDigit=/[0-9]/,t.ASCIIUpperHexDigit=/[0-9A-F]/,t.ASCIILowerHexDigit=/[0-9a-f]/,t.ASCIIHexDigit=/[0-9A-Fa-f]/,t.ASCIIUpperAlpha=/[A-Z]/,t.ASCIILowerAlpha=/[a-z]/,t.ASCIIAlpha=/[A-Za-z]/,t.ASCIIAlphanumeric=/[0-9A-Za-z]/},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},i=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},o=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(i(arguments[t]));return e};Object.defineProperty(t,"__esModule",{value:!0});var a=r(6),s=r(2),u=r(3),l=r(171),c=r(103),h=r(9),p=r(17),f=r(71),d=r(30);function m(e,t){void 0===t&&(t=void 0),void 0===t&&(t=null);var r=y(e,t,new Date,{});return r._isTrusted=!0,r}function y(e,t,r,n){var i=new e("");return i._initializedFlag=!0,i._timeStamp=r.getTime(),Object.assign(i,n),a.dom.features.steps&&d.dom_runEventConstructingSteps(i),i}function v(e,t,r,i){var o,a,l,c;void 0===r&&(r=!1),void 0===i&&(i={value:!1});var h=!1;e._dispatchFlag=!0;var d=t;if(r){var m=t._associatedDocument;u.Guard.isDocumentNode(m)&&(d=m)}var y=null,v=p.tree_retarget(e._relatedTarget,t);if(t!==v||t===e._relatedTarget){var b=[];try{for(var x=n(e._touchTargetList),w=x.next();!w.done;w=x.next()){var E=w.value;b.push(p.tree_retarget(E,t))}}catch(e){o={error:e}}finally{try{w&&!w.done&&(a=x.return)&&a.call(x)}finally{if(o)throw o.error}}_(e,t,d,v,b,!1);var D=u.Guard.isMouseEvent(e)&&"click"===e._type;D&&void 0!==t._activationBehavior&&(y=t);for(var S=u.Guard.isSlotable(t)&&f.shadowTree_isAssigned(t)?t:null,C=!1,A=t._getTheParent(e);null!==A&&u.Guard.isNode(A);){if(null!==S){if(!u.Guard.isSlot(A))throw new Error("Parent node of a slotable should be a slot.");S=null;var N=p.tree_rootNode(A,!0);u.Guard.isShadowRoot(N)&&"closed"===N._mode&&(C=!0)}u.Guard.isSlotable(A)&&f.shadowTree_isAssigned(A)&&(S=A),v=p.tree_retarget(e._relatedTarget,A),b=[];try{for(var T=(l=void 0,n(e._touchTargetList)),O=T.next();!O.done;O=T.next()){E=O.value;b.push(p.tree_retarget(E,A))}}catch(e){l={error:e}}finally{try{O&&!O.done&&(c=T.return)&&c.call(T)}finally{if(l)throw l.error}}u.Guard.isWindow(A)||u.Guard.isNode(A)&&u.Guard.isNode(t)&&p.tree_isAncestorOf(p.tree_rootNode(t,!0),A,!0,!0)?(D&&e._bubbles&&null===y&&A._activationBehavior&&(y=A),_(e,A,null,v,b,C)):A===v?A=null:(t=A,D&&null===y&&t._activationBehavior&&(y=t),_(e,A,t,v,b,C)),null!==A&&(A=A._getTheParent(e)),C=!1}for(var F=null,k=e._path,P=k.length-1;P>=0;P--){if(null!==(L=k[P]).shadowAdjustedTarget){F=L;break}}if(null!==F)if(u.Guard.isNode(F.shadowAdjustedTarget)&&u.Guard.isShadowRoot(p.tree_rootNode(F.shadowAdjustedTarget,!0)))h=!0;else if(u.Guard.isNode(F.relatedTarget)&&u.Guard.isShadowRoot(p.tree_rootNode(F.relatedTarget,!0)))h=!0;else for(var I=0;I<F.touchTargetList.length;I++){var L=F.touchTargetList[I];if(u.Guard.isNode(L)&&u.Guard.isShadowRoot(p.tree_rootNode(L,!0))){h=!0;break}}null!==y&&void 0!==y._legacyPreActivationBehavior&&y._legacyPreActivationBehavior(e);for(P=k.length-1;P>=0;P--){null!==(L=k[P]).shadowAdjustedTarget?e._eventPhase=s.EventPhase.AtTarget:e._eventPhase=s.EventPhase.Capturing,g(L,e,"capturing",i)}for(P=0;P<k.length;P++){if(null!==(L=k[P]).shadowAdjustedTarget)e._eventPhase=s.EventPhase.AtTarget;else{if(!e._bubbles)continue;e._eventPhase=s.EventPhase.Bubbling}g(L,e,"bubbling",i)}}return e._eventPhase=s.EventPhase.None,e._currentTarget=null,e._path=[],e._dispatchFlag=!1,e._stopPropagationFlag=!1,e._stopImmediatePropagationFlag=!1,h&&(e._target=null,e._relatedTarget=null,e._touchTargetList=[]),null!==y&&(e._canceledFlag||void 0===y._activationBehavior?void 0!==y._legacyCanceledActivationBehavior&&y._legacyCanceledActivationBehavior(e):y._activationBehavior(e)),!e._canceledFlag}function _(e,t,r,n,i,o){var a=!1;u.Guard.isNode(t)&&u.Guard.isShadowRoot(p.tree_rootNode(t))&&(a=!0);var s=!1;u.Guard.isShadowRoot(t)&&"closed"===t._mode&&(s=!0),e._path.push({invocationTarget:t,invocationTargetInShadowTree:a,shadowAdjustedTarget:r,relatedTarget:n,touchTargetList:i,rootOfClosedTree:s,slotInClosedTree:o})}function g(e,t,r,n){void 0===n&&(n={value:!1});for(var i=t._path,a=-1,s=0;s<i.length;s++)if(i[s]===e){a=s;break}if(-1!==a){var u=i[a];(null!==u.shadowAdjustedTarget||a>0&&null!==(u=i[a-1]).shadowAdjustedTarget)&&(t._target=u.shadowAdjustedTarget)}if(t._relatedTarget=e.relatedTarget,t._touchTargetList=e.touchTargetList,!t._stopPropagationFlag){t._currentTarget=e.invocationTarget;var l=t._currentTarget._eventListenerList,c=new(Array.bind.apply(Array,o([void 0],l)));if(!b(t,c,r,e,n)&&t._isTrusted){var h=t._type;"animationend"===h?t._type="webkitAnimationEnd":"animationiteration"===h?t._type="webkitAnimationIteration":"animationstart"===h?t._type="webkitAnimationStart":"transitionend"===h&&(t._type="webkitTransitionEnd"),b(t,c,r,e,n),t._type=h}}}function b(e,t,r,n,i){void 0===i&&(i={value:!1});for(var o=!1,a=0;a<t.length;a++){var s=t[a];if(!s.removed){if(e._type!==s.type)continue;if(o=!0,"capturing"===r&&!s.capture)continue;if("bubbling"===r&&s.capture)continue;if(s.once&&null!==e._currentTarget){for(var l=e._currentTarget,c=-1,h=0;h<l._eventListenerList.length;h++)if(l._eventListenerList[h]===s){c=h;break}-1!==c&&l._eventListenerList.splice(c,1)}var p=void 0,f=void 0;u.Guard.isWindow(p)&&(f=p._currentEvent,!1===n.invocationTargetInShadowTree&&(p._currentEvent=e)),s.passive&&(e._inPassiveListenerFlag=!0);try{s.callback.handleEvent.call(e._currentTarget,e)}catch(e){i.value=!0}if(s.passive&&(e._inPassiveListenerFlag=!1),u.Guard.isWindow(p)&&(p._currentEvent=f),e._stopImmediatePropagationFlag)return o}}return o}function x(e,t){return null}function w(e,t){return null}function E(e,t){}function D(e,t){}t.event_setTheCanceledFlag=function(e){e._cancelable&&!e._inPassiveListenerFlag&&(e._canceledFlag=!0)},t.event_initialize=function(e,t,r,n){e._initializedFlag=!0,e._stopPropagationFlag=!1,e._stopImmediatePropagationFlag=!1,e._canceledFlag=!1,e._isTrusted=!1,e._target=null,e._type=t,e._bubbles=r,e._cancelable=n},t.event_createAnEvent=m,t.event_innerEventCreationSteps=y,t.event_dispatch=v,t.event_appendToAnEventPath=_,t.event_invoke=g,t.event_innerInvoke=b,t.event_fireAnEvent=function(e,t,r,n,i){void 0===r&&(r=c.EventImpl);var o=m(r);if(o._type=e,n)for(var a in n){o[a]=n[a]}return v(o,t,i)},t.event_createLegacyEvent=function(e){var t=null;switch(e.toLowerCase()){case"beforeunloadevent":case"compositionevent":break;case"customevent":t=l.CustomEventImpl;break;case"devicemotionevent":case"deviceorientationevent":case"dragevent":break;case"event":case"events":t=c.EventImpl}if(null===t)throw new h.NotSupportedError("Event constructor not found for interface "+e+".");var r=new t("");return r._type="",r._timeStamp=(new Date).getTime(),r._isTrusted=!1,r._initializedFlag=!1,r},t.event_getterEventHandlerIDLAttribute=function(e,t){return null},t.event_setterEventHandlerIDLAttribute=function(e,t,r){},t.event_determineTheTargetOfAnEventHandler=x,t.event_getTheCurrentValueOfAnEventHandler=w,t.event_activateAnEventHandler=E,t.event_deactivateAnEventHandler=D},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},a=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a};Object.defineProperty(t,"__esModule",{value:!0});var s=r(6),u=r(2),l=r(9),c=r(34),h=r(3),p=r(1),f=r(7),d=r(152),m=r(0),y=r(12),v=function(e){function t(){var t=e.call(this)||this;return t._children=new Set,t._encoding={name:"UTF-8",labels:["unicode-1-1-utf-8","utf-8","utf8"]},t._contentType="application/xml",t._URL={scheme:"about",username:"",password:"",host:null,port:null,path:["blank"],query:null,fragment:null,_cannotBeABaseURLFlag:!0,_blobURLEntry:null},t._origin=null,t._type="xml",t._mode="no-quirks",t._documentElement=null,t._hasNamespaces=!1,t._nodeDocumentOverwrite=null,t}return i(t,e),Object.defineProperty(t.prototype,"_nodeDocument",{get:function(){return this._nodeDocumentOverwrite||this},set:function(e){this._nodeDocumentOverwrite=e},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"implementation",{get:function(){return this._implementation||(this._implementation=m.create_domImplementation(this))},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"URL",{get:function(){return d.urlSerializer(this._URL)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"documentURI",{get:function(){return this.URL},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"origin",{get:function(){return"null"},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"compatMode",{get:function(){return"quirks"===this._mode?"BackCompat":"CSS1Compat"},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"characterSet",{get:function(){return this._encoding.name},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"charset",{get:function(){return this._encoding.name},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"inputEncoding",{get:function(){return this._encoding.name},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"contentType",{get:function(){return this._contentType},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"doctype",{get:function(){var e,t;try{for(var r=o(this._children),n=r.next();!n.done;n=r.next()){var i=n.value;if(h.Guard.isDocumentTypeNode(i))return i}}catch(t){e={error:t}}finally{try{n&&!n.done&&(t=r.return)&&t.call(r)}finally{if(e)throw e.error}}return null},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"documentElement",{get:function(){return this._documentElement},enumerable:!0,configurable:!0}),t.prototype.getElementsByTagName=function(e){return m.node_listOfElementsWithQualifiedName(e,this)},t.prototype.getElementsByTagNameNS=function(e,t){return m.node_listOfElementsWithNamespace(e,t,this)},t.prototype.getElementsByClassName=function(e){return m.node_listOfElementsWithClassNames(e,this)},t.prototype.createElement=function(e,t){if(!m.xml_isName(e))throw new l.InvalidCharacterError;"html"===this._type&&(e=e.toLowerCase());var r=null;void 0!==t&&(r=p.isString(t)?t:t.is);var n="html"===this._type||"application/xhtml+xml"===this._contentType?f.namespace.HTML:null;return m.element_createAnElement(this,e,n,null,r,!0)},t.prototype.createElementNS=function(e,t,r){return m.document_internalCreateElementNS(this,e,t,r)},t.prototype.createDocumentFragment=function(){return m.create_documentFragment(this)},t.prototype.createTextNode=function(e){return m.create_text(this,e)},t.prototype.createCDATASection=function(e){if("html"===this._type)throw new l.NotSupportedError;if(-1!==e.indexOf("]]>"))throw new l.InvalidCharacterError;return m.create_cdataSection(this,e)},t.prototype.createComment=function(e){return m.create_comment(this,e)},t.prototype.createProcessingInstruction=function(e,t){if(!m.xml_isName(e))throw new l.InvalidCharacterError;if(-1!==t.indexOf("?>"))throw new l.InvalidCharacterError;return m.create_processingInstruction(this,e,t)},t.prototype.importNode=function(e,t){if(void 0===t&&(t=!1),h.Guard.isDocumentNode(e)||h.Guard.isShadowRoot(e))throw new l.NotSupportedError;return m.node_clone(e,this,t)},t.prototype.adoptNode=function(e){if(h.Guard.isDocumentNode(e))throw new l.NotSupportedError;if(h.Guard.isShadowRoot(e))throw new l.HierarchyRequestError;return m.document_adopt(e,this),e},t.prototype.createAttribute=function(e){if(!m.xml_isName(e))throw new l.InvalidCharacterError;return"html"===this._type&&(e=e.toLowerCase()),m.create_attr(this,e)},t.prototype.createAttributeNS=function(e,t){var r=a(m.namespace_validateAndExtract(e,t),3),n=r[0],i=r[1],o=r[2],s=m.create_attr(this,o);return s._namespace=n,s._namespacePrefix=i,s},t.prototype.createEvent=function(e){return m.event_createLegacyEvent(e)},t.prototype.createRange=function(){var e=m.create_range();return e._start=[this,0],e._end=[this,0],e},t.prototype.createNodeIterator=function(e,t,r){void 0===t&&(t=u.WhatToShow.All),void 0===r&&(r=null);var n=m.create_nodeIterator(e,e,!0);return n._whatToShow=t,n._iteratorCollection=m.create_nodeList(e),p.isFunction(r)?(n._filter=m.create_nodeFilter(),n._filter.acceptNode=r):n._filter=r,n},t.prototype.createTreeWalker=function(e,t,r){void 0===t&&(t=u.WhatToShow.All),void 0===r&&(r=null);var n=m.create_treeWalker(e,e);return n._whatToShow=t,p.isFunction(r)?(n._filter=m.create_nodeFilter(),n._filter.acceptNode=r):n._filter=r,n},t.prototype._getTheParent=function(e){return"load"===e._type?null:s.dom.window},t.prototype.getElementById=function(e){throw new Error("Mixin: NonElementParentNode not implemented.")},Object.defineProperty(t.prototype,"children",{get:function(){throw new Error("Mixin: ParentNode not implemented.")},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"firstElementChild",{get:function(){throw new Error("Mixin: ParentNode not implemented.")},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"lastElementChild",{get:function(){throw new Error("Mixin: ParentNode not implemented.")},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"childElementCount",{get:function(){throw new Error("Mixin: ParentNode not implemented.")},enumerable:!0,configurable:!0}),t.prototype.prepend=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ParentNode not implemented.")},t.prototype.append=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ParentNode not implemented.")},t.prototype.querySelector=function(e){throw new Error("Mixin: ParentNode not implemented.")},t.prototype.querySelectorAll=function(e){throw new Error("Mixin: ParentNode not implemented.")},t}(c.NodeImpl);t.DocumentImpl=v,y.idl_defineConst(v.prototype,"_nodeType",u.NodeType.Document)},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},a=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a};Object.defineProperty(t,"__esModule",{value:!0});var s=r(2),u=r(34),l=r(9),c=r(7),h=r(0),p=r(12),f=function(e){function t(){var t=e.call(this)||this;return t._children=new Set,t._namespace=null,t._namespacePrefix=null,t._localName="",t._customElementState="undefined",t._customElementDefinition=null,t._is=null,t._shadowRoot=null,t._attributeList=h.create_namedNodeMap(t),t._attributeChangeSteps=[],t._name="",t._assignedSlot=null,t}return i(t,e),Object.defineProperty(t.prototype,"namespaceURI",{get:function(){return this._namespace},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"prefix",{get:function(){return this._namespacePrefix},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"localName",{get:function(){return this._localName},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"tagName",{get:function(){return this._htmlUppercasedQualifiedName},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"id",{get:function(){return h.element_getAnAttributeValue(this,"id")},set:function(e){h.element_setAnAttributeValue(this,"id",e)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"className",{get:function(){return h.element_getAnAttributeValue(this,"class")},set:function(e){h.element_setAnAttributeValue(this,"class",e)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"classList",{get:function(){var e=h.element_getAnAttributeByName("class",this);return null===e&&(e=h.create_attr(this._nodeDocument,"class")),h.create_domTokenList(this,e)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"slot",{get:function(){return h.element_getAnAttributeValue(this,"slot")},set:function(e){h.element_setAnAttributeValue(this,"slot",e)},enumerable:!0,configurable:!0}),t.prototype.hasAttributes=function(){return 0!==this._attributeList.length},Object.defineProperty(t.prototype,"attributes",{get:function(){return this._attributeList},enumerable:!0,configurable:!0}),t.prototype.getAttributeNames=function(){var e,t,r=[];try{for(var n=o(this._attributeList),i=n.next();!i.done;i=n.next()){var a=i.value;r.push(a._qualifiedName)}}catch(t){e={error:t}}finally{try{i&&!i.done&&(t=n.return)&&t.call(n)}finally{if(e)throw e.error}}return r},t.prototype.getAttribute=function(e){var t=h.element_getAnAttributeByName(e,this);return t?t._value:null},t.prototype.getAttributeNS=function(e,t){var r=h.element_getAnAttributeByNamespaceAndLocalName(e,t,this);return r?r._value:null},t.prototype.setAttribute=function(e,t){if(!h.xml_isName(e))throw new l.InvalidCharacterError;this._namespace===c.namespace.HTML&&"html"===this._nodeDocument._type&&(e=e.toLowerCase());for(var r=null,n=0;n<this._attributeList.length;n++){var i=this._attributeList[n];if(i._qualifiedName===e){r=i;break}}if(null===r)return(r=h.create_attr(this._nodeDocument,e))._value=t,void h.element_append(r,this);h.element_change(r,this,t)},t.prototype.setAttributeNS=function(e,t,r){var n=a(h.namespace_validateAndExtract(e,t),3),i=n[0],o=n[1],s=n[2];h.element_setAnAttributeValue(this,s,r,o,i)},t.prototype.removeAttribute=function(e){h.element_removeAnAttributeByName(e,this)},t.prototype.removeAttributeNS=function(e,t){h.element_removeAnAttributeByNamespaceAndLocalName(e,t,this)},t.prototype.hasAttribute=function(e){this._namespace===c.namespace.HTML&&"html"===this._nodeDocument._type&&(e=e.toLowerCase());for(var t=0;t<this._attributeList.length;t++){if(this._attributeList[t]._qualifiedName===e)return!0}return!1},t.prototype.toggleAttribute=function(e,t){if(!h.xml_isName(e))throw new l.InvalidCharacterError;this._namespace===c.namespace.HTML&&"html"===this._nodeDocument._type&&(e=e.toLowerCase());for(var r=null,n=0;n<this._attributeList.length;n++){var i=this._attributeList[n];if(i._qualifiedName===e){r=i;break}}return null===r?(void 0===t||!0===t)&&((r=h.create_attr(this._nodeDocument,e))._value="",h.element_append(r,this),!0):void 0!==t&&!1!==t||(h.element_removeAnAttributeByName(e,this),!1)},t.prototype.hasAttributeNS=function(e,t){for(var r=e||null,n=0;n<this._attributeList.length;n++){var i=this._attributeList[n];if(i._namespace===r&&i._localName===t)return!0}return!1},t.prototype.getAttributeNode=function(e){return h.element_getAnAttributeByName(e,this)},t.prototype.getAttributeNodeNS=function(e,t){return h.element_getAnAttributeByNamespaceAndLocalName(e,t,this)},t.prototype.setAttributeNode=function(e){return h.element_setAnAttribute(e,this)},t.prototype.setAttributeNodeNS=function(e){return h.element_setAnAttribute(e,this)},t.prototype.removeAttributeNode=function(e){for(var t=!1,r=0;r<this._attributeList.length;r++){if(this._attributeList[r]===e){t=!0;break}}if(!t)throw new l.NotFoundError;return h.element_remove(e,this),e},t.prototype.attachShadow=function(e){if(this._namespace!==c.namespace.HTML)throw new l.NotSupportedError;if(!h.customElement_isValidCustomElementName(this._localName)&&!h.customElement_isValidShadowHostName(this._localName))throw new l.NotSupportedError;if(h.customElement_isValidCustomElementName(this._localName)||null!==this._is){var t=h.customElement_lookUpACustomElementDefinition(this._nodeDocument,this._namespace,this._localName,this._is);if(null!==t&&!0===t.disableShadow)throw new l.NotSupportedError}if(null!==this._shadowRoot)throw new l.NotSupportedError;var r=h.create_shadowRoot(this._nodeDocument,this);return r._mode=e.mode,this._shadowRoot=r,r},Object.defineProperty(t.prototype,"shadowRoot",{get:function(){var e=this._shadowRoot;return null===e||"closed"===e.mode?null:e},enumerable:!0,configurable:!0}),t.prototype.closest=function(e){throw new l.NotImplementedError},t.prototype.matches=function(e){throw new l.NotImplementedError},t.prototype.webkitMatchesSelector=function(e){return this.matches(e)},t.prototype.getElementsByTagName=function(e){return h.node_listOfElementsWithQualifiedName(e,this)},t.prototype.getElementsByTagNameNS=function(e,t){return h.node_listOfElementsWithNamespace(e,t,this)},t.prototype.getElementsByClassName=function(e){return h.node_listOfElementsWithClassNames(e,this)},t.prototype.insertAdjacentElement=function(e,t){return h.element_insertAdjacent(this,e,t)},t.prototype.insertAdjacentText=function(e,t){var r=h.create_text(this._nodeDocument,t);h.element_insertAdjacent(this,e,r)},Object.defineProperty(t.prototype,"_qualifiedName",{get:function(){return this._namespacePrefix?this._namespacePrefix+":"+this._localName:this._localName},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"_htmlUppercasedQualifiedName",{get:function(){var e=this._qualifiedName;return this._namespace===c.namespace.HTML&&"html"===this._nodeDocument._type&&(e=e.toUpperCase()),e},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"children",{get:function(){throw new Error("Mixin: ParentNode not implemented.")},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"firstElementChild",{get:function(){throw new Error("Mixin: ParentNode not implemented.")},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"lastElementChild",{get:function(){throw new Error("Mixin: ParentNode not implemented.")},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"childElementCount",{get:function(){throw new Error("Mixin: ParentNode not implemented.")},enumerable:!0,configurable:!0}),t.prototype.prepend=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ParentNode not implemented.")},t.prototype.append=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ParentNode not implemented.")},t.prototype.querySelector=function(e){throw new Error("Mixin: ParentNode not implemented.")},t.prototype.querySelectorAll=function(e){throw new Error("Mixin: ParentNode not implemented.")},Object.defineProperty(t.prototype,"previousElementSibling",{get:function(){throw new Error("Mixin: NonDocumentTypeChildNode not implemented.")},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"nextElementSibling",{get:function(){throw new Error("Mixin: NonDocumentTypeChildNode not implemented.")},enumerable:!0,configurable:!0}),t.prototype.before=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ChildNode not implemented.")},t.prototype.after=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ChildNode not implemented.")},t.prototype.replaceWith=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ChildNode not implemented.")},t.prototype.remove=function(){throw new Error("Mixin: ChildNode not implemented.")},Object.defineProperty(t.prototype,"assignedSlot",{get:function(){throw new Error("Mixin: Slotable not implemented.")},enumerable:!0,configurable:!0}),t._create=function(e,r,n,i){void 0===n&&(n=null),void 0===i&&(i=null);var o=new t;return o._localName=r,o._namespace=n,o._namespacePrefix=i,o._nodeDocument=e,o},t}(u.NodeImpl);t.ElementImpl=f,p.idl_defineConst(f.prototype,"_nodeType",s.NodeType.Element)},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(2),a=r(34),s=r(12),u=function(e){function t(t){void 0===t&&(t=null);var r=e.call(this)||this;return r._children=new Set,r._host=t,r}return i(t,e),t.prototype.getElementById=function(e){throw new Error("Mixin: NonElementParentNode not implemented.")},Object.defineProperty(t.prototype,"children",{get:function(){throw new Error("Mixin: ParentNode not implemented.")},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"firstElementChild",{get:function(){throw new Error("Mixin: ParentNode not implemented.")},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"lastElementChild",{get:function(){throw new Error("Mixin: ParentNode not implemented.")},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"childElementCount",{get:function(){throw new Error("Mixin: ParentNode not implemented.")},enumerable:!0,configurable:!0}),t.prototype.prepend=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ParentNode not implemented.")},t.prototype.append=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ParentNode not implemented.")},t.prototype.querySelector=function(e){throw new Error("Mixin: ParentNode not implemented.")},t.prototype.querySelectorAll=function(e){throw new Error("Mixin: ParentNode not implemented.")},t._create=function(e,r){void 0===r&&(r=null);var n=new t(r);return n._nodeDocument=e,n},t}(a.NodeImpl);t.DocumentFragmentImpl=u,s.idl_defineConst(u.prototype,"_nodeType",o.NodeType.DocumentFragment)},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var a=r(2),s=r(70),u=r(0),l=r(12),c=function(e){function t(t){void 0===t&&(t="");var r=e.call(this,t)||this;return r._name="",r._assignedSlot=null,r}return i(t,e),Object.defineProperty(t.prototype,"wholeText",{get:function(){var e,t,r="";try{for(var n=o(u.text_contiguousTextNodes(this,!0)),i=n.next();!i.done;i=n.next()){r+=i.value._data}}catch(t){e={error:t}}finally{try{i&&!i.done&&(t=n.return)&&t.call(n)}finally{if(e)throw e.error}}return r},enumerable:!0,configurable:!0}),t.prototype.splitText=function(e){return u.text_split(this,e)},Object.defineProperty(t.prototype,"assignedSlot",{get:function(){throw new Error("Mixin: Slotable not implemented.")},enumerable:!0,configurable:!0}),t._create=function(e,r){void 0===r&&(r="");var n=new t(r);return n._nodeDocument=e,n},t}(s.CharacterDataImpl);t.TextImpl=c,l.idl_defineConst(c.prototype,"_nodeType",a.NodeType.Text)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){}return Object.defineProperty(e.prototype,"_startNode",{get:function(){return this._start[0]},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"_startOffset",{get:function(){return this._start[1]},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"_endNode",{get:function(){return this._end[0]},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"_endOffset",{get:function(){return this._end[1]},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"_collapsed",{get:function(){return this._start[0]===this._end[0]&&this._start[1]===this._end[1]},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"startContainer",{get:function(){return this._startNode},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"startOffset",{get:function(){return this._startOffset},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"endContainer",{get:function(){return this._endNode},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"endOffset",{get:function(){return this._endOffset},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"collapsed",{get:function(){return this._collapsed},enumerable:!0,configurable:!0}),e}();t.AbstractRangeImpl=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2),i=function(){function e(e){this._activeFlag=!1,this._root=e,this._whatToShow=n.WhatToShow.All,this._filter=null}return Object.defineProperty(e.prototype,"root",{get:function(){return this._root},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"whatToShow",{get:function(){return this._whatToShow},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"filter",{get:function(){return this._filter},enumerable:!0,configurable:!0}),e}();t.TraverserImpl=i},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2),i=r(0),o=r(12),a=function(){function e(e,t){this._target=null,this._relatedTarget=null,this._touchTargetList=[],this._path=[],this._currentTarget=null,this._eventPhase=n.EventPhase.None,this._stopPropagationFlag=!1,this._stopImmediatePropagationFlag=!1,this._canceledFlag=!1,this._inPassiveListenerFlag=!1,this._composedFlag=!1,this._initializedFlag=!1,this._dispatchFlag=!1,this._isTrusted=!1,this._bubbles=!1,this._cancelable=!1,this._type=e,t&&(this._bubbles=t.bubbles||!1,this._cancelable=t.cancelable||!1,this._composedFlag=t.composed||!1),this._initializedFlag=!0,this._timeStamp=(new Date).getTime()}return Object.defineProperty(e.prototype,"type",{get:function(){return this._type},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"target",{get:function(){return this._target},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"srcElement",{get:function(){return this._target},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"currentTarget",{get:function(){return this._currentTarget},enumerable:!0,configurable:!0}),e.prototype.composedPath=function(){var e=[],t=this._path;if(0===t.length)return e;var r=this._currentTarget;if(null===r)throw new Error("Event currentTarget is null.");e.push(r);for(var n=0,i=0,o=t.length-1;o>=0;){if(t[o].rootOfClosedTree&&i++,t[o].invocationTarget===r){n=o;break}t[o].slotInClosedTree&&i--,o--}var a=i,s=i;for(o=n-1;o>=0;)t[o].rootOfClosedTree&&a++,a<=s&&e.unshift(t[o].invocationTarget),t[o].slotInClosedTree&&--a<s&&(s=a),o--;for(a=i,s=i,o=n+1;o<t.length;)t[o].slotInClosedTree&&a++,a<=s&&e.push(t[o].invocationTarget),t[o].rootOfClosedTree&&--a<s&&(s=a),o++;return e},Object.defineProperty(e.prototype,"eventPhase",{get:function(){return this._eventPhase},enumerable:!0,configurable:!0}),e.prototype.stopPropagation=function(){this._stopPropagationFlag=!0},Object.defineProperty(e.prototype,"cancelBubble",{get:function(){return this._stopPropagationFlag},set:function(e){e&&this.stopPropagation()},enumerable:!0,configurable:!0}),e.prototype.stopImmediatePropagation=function(){this._stopPropagationFlag=!0,this._stopImmediatePropagationFlag=!0},Object.defineProperty(e.prototype,"bubbles",{get:function(){return this._bubbles},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"cancelable",{get:function(){return this._cancelable},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"returnValue",{get:function(){return!this._canceledFlag},set:function(e){e||i.event_setTheCanceledFlag(this)},enumerable:!0,configurable:!0}),e.prototype.preventDefault=function(){i.event_setTheCanceledFlag(this)},Object.defineProperty(e.prototype,"defaultPrevented",{get:function(){return this._canceledFlag},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"composed",{get:function(){return this._composedFlag},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"isTrusted",{get:function(){return this._isTrusted},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"timeStamp",{get:function(){return this._timeStamp},enumerable:!0,configurable:!0}),e.prototype.initEvent=function(e,t,r){void 0===t&&(t=!1),void 0===r&&(r=!1),this._dispatchFlag||i.event_initialize(this,e,t,r)},e.NONE=0,e.CAPTURING_PHASE=1,e.AT_TARGET=2,e.BUBBLING_PHASE=3,e}();t.EventImpl=a,o.idl_defineConst(a.prototype,"NONE",0),o.idl_defineConst(a.prototype,"CAPTURING_PHASE",1),o.idl_defineConst(a.prototype,"AT_TARGET",2),o.idl_defineConst(a.prototype,"BUBBLING_PHASE",3)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2),i=r(9);t.traversal_filter=function(e,t){if(e._activeFlag)throw new i.InvalidStateError;var r=1<<t._nodeType-1;if(0==(e.whatToShow&r))return n.FilterResult.Skip;if(!e.filter)return n.FilterResult.Accept;e._activeFlag=!0;var o=n.FilterResult.Reject;try{o=e.filter.acceptNode(t)}catch(t){throw e._activeFlag=!1,t}return e._activeFlag=!1,o}},function(e,t,r){"use strict";var n=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},i=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var o=r(6),a=r(3),s=r(1),u=r(98),l=r(72),c=r(17),h=r(173),p=r(30),f=r(52),d=r(37);t.document_elementInterface=function(e,t){return u.ElementImpl},t.document_internalCreateElementNS=function(e,t,r,i){var o=n(h.namespace_validateAndExtract(t,r),3),a=o[0],u=o[1],l=o[2],c=null;return void 0!==i&&(c=s.isString(i)?i:i.is),f.element_createAnElement(e,l,a,u,c,!0)},t.document_adopt=function(e,t){var r,n;if(e._nodeDocument!==t||null!==e._parent){var s=e._nodeDocument;if(e._parent&&d.mutation_remove(e,e._parent),t!==s)for(var u=c.tree_getFirstDescendantNode(e,!0,!0);null!==u;){if(u._nodeDocument=t,a.Guard.isElementNode(u))try{for(var h=(r=void 0,i(u._attributeList._asArray())),f=h.next();!f.done;f=h.next()){f.value._nodeDocument=t}}catch(e){r={error:e}}finally{try{f&&!f.done&&(n=h.return)&&n.call(h)}finally{if(r)throw r.error}}o.dom.features.customElements&&a.Guard.isElementNode(u)&&"custom"===u._customElementState&&l.customElement_enqueueACustomElementCallbackReaction(u,"adoptedCallback",[s,t]),o.dom.features.steps&&p.dom_runAdoptingSteps(u,s),u=c.tree_getNextDescendantNode(e,u,!0,!0)}}}},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(6),o=r(3),a=r(9),s=r(17),u=r(51),l=r(30);t.characterData_replaceData=function(e,t,r,c){var h,p,f=s.tree_nodeLength(e);if(t>f)throw new a.IndexSizeError("Offset exceeds character data length. Offset: "+t+", Length: "+f+", Node is "+e.nodeName+".");t+r>f&&(r=f-t),i.dom.features.mutationObservers&&u.observer_queueMutationRecord("characterData",e,null,null,e._data,[],[],null,null);var d=e._data.substring(0,t)+c+e._data.substring(t+r);e._data=d;try{for(var m=n(i.dom.rangeList),y=m.next();!y.done;y=m.next()){var v=y.value;v._start[0]===e&&v._start[1]>t&&v._start[1]<=t+r&&(v._start[1]=t),v._end[0]===e&&v._end[1]>t&&v._end[1]<=t+r&&(v._end[1]=t),v._start[0]===e&&v._start[1]>t+r&&(v._start[1]+=c.length-r),v._end[0]===e&&v._end[1]>t+r&&(v._end[1]+=c.length-r)}}catch(e){h={error:e}}finally{try{y&&!y.done&&(p=m.return)&&p.call(m)}finally{if(h)throw h.error}}i.dom.features.steps&&o.Guard.isTextNode(e)&&null!==e._parent&&l.dom_runChildTextContentChangeSteps(e._parent)},t.characterData_substringData=function(e,t,r){var n=s.tree_nodeLength(e);if(t>n)throw new a.IndexSizeError("Offset exceeds character data length. Offset: "+t+", Length: "+n+", Node is "+e.nodeName+".");return t+r>n?e._data.substr(t):e._data.substr(t,r)}},function(e,t,r){"use strict";var n=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},i=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(n(arguments[t]));return e},o=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var a=r(7);function s(e){var t=a.string.splitAStringOnASCIIWhitespace(e);return new Set(t)}function u(e){return i(e).join(" ")}t.orderedSet_parse=s,t.orderedSet_serialize=u,t.orderedSet_sanitize=function(e){return u(s(e))},t.orderedSet_contains=function(e,t,r){var n,i,a,s;try{for(var u=o(t),l=u.next();!l.done;l=u.next()){var c=l.value,h=!1;try{for(var p=(a=void 0,o(e)),f=p.next();!f.done;f=p.next()){var d=f.value;if(r){if(d===c){h=!0;break}}else if(d.toUpperCase()===c.toUpperCase()){h=!0;break}}}catch(e){a={error:e}}finally{try{f&&!f.done&&(s=p.return)&&s.call(p)}finally{if(a)throw a.error}}if(!h)return!1}}catch(e){n={error:e}}finally{try{l&&!l.done&&(i=u.return)&&i.call(u)}finally{if(n)throw n.error}}return!0}},function(e,t,r){"use strict";r(261),Object.defineProperty(t,"__esModule",{value:!0});var n=r(262),i=r(109),o=r(1);i.dom.setFeatures(!1),t.createDocument=function(){var e=(new n.DOMImplementation).createDocument(null,"root",null);return e.documentElement&&e.removeChild(e.documentElement),e},t.sanitizeInput=function(e,t){if(null==e)return e;if(void 0===t)return e+"";var r="";e+="";for(var n=0;n<e.length;n++){var i=e.charCodeAt(n);if(9===i||10===i||13===i||i>=32&&i<=55295||i>=57344&&i<=65533)r+=e.charAt(n);else if(i>=55296&&i<=56319&&n<e.length-1){var a=e.charCodeAt(n+1);a>=56320&&a<=57343?(i=1024*(i-55296)+a-56320+65536,r+=String.fromCodePoint(i),n++):r+=o.isString(t)?t:t(e.charAt(n),n,e)}else r+=o.isString(t)?t:t(e.charAt(n),n,e)}return r}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(1),i=r(153);t.AbortController=i.AbortControllerImpl;var o=r(154);t.AbortSignal=o.AbortSignalImpl;var a=r(101);t.AbstractRange=a.AbstractRangeImpl;var s=r(157);t.Attr=s.AttrImpl;var u=r(158);t.CDATASection=u.CDATASectionImpl;var l=r(70);t.CharacterData=l.CharacterDataImpl;var c=r(263),h=r(159);t.Comment=h.CommentImpl;var p=r(171);t.CustomEvent=p.CustomEventImpl;var f=r(99);t.DocumentFragment=f.DocumentFragmentImpl;var d=r(97);t.Document=d.DocumentImpl;var m=r(264),y=r(155);t.DocumentType=y.DocumentTypeImpl;var v=r(6);t.dom=v.dom;var _=r(148);t.DOMImplementation=_.DOMImplementationImpl;var g=r(170);t.DOMTokenList=g.DOMTokenListImpl;var b=r(98);t.Element=b.ElementImpl;var x=r(103);t.Event=x.EventImpl;var w=r(69);t.EventTarget=w.EventTargetImpl;var E=r(161);t.HTMLCollection=E.HTMLCollectionImpl;var D=r(265);t.MutationObserver=D.MutationObserverImpl;var S=r(169);t.MutationRecord=S.MutationRecordImpl;var C=r(164);t.NamedNodeMap=C.NamedNodeMapImpl;var A=r(168);t.NodeFilter=A.NodeFilterImpl;var N=r(34);t.Node=N.NodeImpl;var T=r(166);t.NodeIterator=T.NodeIteratorImpl;var O=r(162);t.NodeList=O.NodeListImpl;var F=r(163);t.NodeListStatic=F.NodeListStaticImpl;var k=r(266),P=r(267),I=r(268),L=r(160);t.ProcessingInstruction=L.ProcessingInstructionImpl;var M=r(165);t.Range=M.RangeImpl;var B=r(156);t.ShadowRoot=B.ShadowRootImpl;var j=r(269),R=r(270);t.StaticRange=R.StaticRangeImpl;var z=r(100);t.Text=z.TextImpl;var U=r(102);t.Traverser=U.TraverserImpl;var G=r(167);t.TreeWalker=G.TreeWalkerImpl;var X=r(149);t.Window=X.WindowImpl;var q=r(151);t.XMLDocument=q.XMLDocumentImpl,n.applyMixin(b.ElementImpl,c.ChildNodeImpl),n.applyMixin(l.CharacterDataImpl,c.ChildNodeImpl),n.applyMixin(y.DocumentTypeImpl,c.ChildNodeImpl),n.applyMixin(d.DocumentImpl,m.DocumentOrShadowRootImpl),n.applyMixin(B.ShadowRootImpl,m.DocumentOrShadowRootImpl),n.applyMixin(b.ElementImpl,k.NonDocumentTypeChildNodeImpl),n.applyMixin(l.CharacterDataImpl,k.NonDocumentTypeChildNodeImpl),n.applyMixin(d.DocumentImpl,P.NonElementParentNodeImpl),n.applyMixin(f.DocumentFragmentImpl,P.NonElementParentNodeImpl),n.applyMixin(d.DocumentImpl,I.ParentNodeImpl),n.applyMixin(f.DocumentFragmentImpl,I.ParentNodeImpl),n.applyMixin(b.ElementImpl,I.ParentNodeImpl),n.applyMixin(z.TextImpl,j.SlotableImpl),n.applyMixin(b.ElementImpl,j.SlotableImpl)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e[e.EOF=0]="EOF",e[e.Declaration=1]="Declaration",e[e.DocType=2]="DocType",e[e.Element=3]="Element",e[e.Text=4]="Text",e[e.CDATA=5]="CDATA",e[e.PI=6]="PI",e[e.Comment=7]="Comment",e[e.ClosingTag=8]="ClosingTag"}(t.TokenType||(t.TokenType={}))},function(e,t,r){"use strict";r(64),r(20),r(66);var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(1),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return i(t,e),t.prototype._parse=function(e,t){var r=this,n=this._builderOptions,i=null;return o.isFunction(t)?i=this.parse(e,t.apply(this)):o.isArray(t)||o.isSet(t)?o.forEachArray(t,(function(t){return i=r.parse(e,t)}),this):o.forEachObject(t,(function(t,a){if(o.isFunction(a)&&(a=a.apply(r)),n.ignoreConverters||0!==t.indexOf(n.convert.att))if(n.ignoreConverters||0!==t.indexOf(n.convert.text))if(n.ignoreConverters||0!==t.indexOf(n.convert.cdata))if(n.ignoreConverters||0!==t.indexOf(n.convert.comment))if(n.ignoreConverters||0!==t.indexOf(n.convert.ins))if((o.isArray(a)||o.isSet(a))&&o.isEmpty(a));else if((o.isMap(a)||o.isObject(a))&&o.isEmpty(a))i=r.element(e,void 0,r.sanitize(t))||i;else if(n.keepNullNodes||null!=a)if(o.isArray(a)||o.isSet(a))o.forEachArray(a,(function(n){var o={};o[t]=n,i=r.parse(e,o)}),r);else if(o.isMap(a)||o.isObject(a)){(s=r.element(e,void 0,r.sanitize(t)))&&(i=s,r.parse(s,a))}else if(null!=a&&""!==a){var s;(s=r.element(e,void 0,r.sanitize(t)))&&(i=s,r.text(s,r.sanitize(a)))}else i=r.element(e,void 0,r.sanitize(t))||i;else;else if(o.isString(a)){var u=a.indexOf(" "),l=-1===u?a:a.substr(0,u),c=-1===u?"":a.substr(u+1);i=r.instruction(e,r.sanitize(l),r.sanitize(c))||i}else o.isArray(a)||o.isSet(a)?o.forEachArray(a,(function(t){var n=t.indexOf(" "),o=-1===n?t:t.substr(0,n),a=-1===n?"":t.substr(n+1);i=r.instruction(e,r.sanitize(o),r.sanitize(a))||i}),r):o.forEachObject(a,(function(t,n){return i=r.instruction(e,r.sanitize(t),r.sanitize(n))||i}),r);else o.isArray(a)||o.isSet(a)?o.forEachArray(a,(function(t){return i=r.comment(e,r.sanitize(t))||i}),r):i=r.comment(e,r.sanitize(a))||i;else o.isArray(a)||o.isSet(a)?o.forEachArray(a,(function(t){return i=r.cdata(e,r.sanitize(t))||i}),r):i=r.cdata(e,r.sanitize(a))||i;else i=o.isMap(a)||o.isObject(a)?r.parse(e,a):r.text(e,r.sanitize(a))||i;else if(t===n.convert.att){if(o.isArray(a)||o.isSet(a))throw new Error("Invalid attribute: "+a.toString()+". "+e._debugInfo());o.forEachObject(a,(function(t,n){i=r.attribute(e,void 0,r.sanitize(t),r.sanitize(n))||i}))}else i=r.attribute(e,void 0,r.sanitize(t.substr(n.convert.att.length)),r.sanitize(a))||i}),this),i||e},t}(r(74).BaseReader);t.ObjectReader=a},function(e,t,r){"use strict";var n=r(39);e.exports=new n({explicit:[r(286),r(287),r(288)]})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){this.level=0,this._builderOptions=e,this._writerOptions=e};t.BaseCBWriter=n},function(e,t,r){var n=r(16),i=r(8),o=r(115);e.exports=!n&&!i((function(){return 7!=Object.defineProperty(o("div"),"a",{get:function(){return 7}}).a}))},function(e,t,r){var n=r(11),i=r(13),o=n.document,a=i(o)&&i(o.createElement);e.exports=function(e){return a?o.createElement(e):{}}},function(e,t,r){var n=r(117),i=Function.toString;"function"!=typeof n.inspectSource&&(n.inspectSource=function(e){return i.call(e)}),e.exports=n.inspectSource},function(e,t,r){var n=r(11),i=r(79),o=n["__core-js_shared__"]||i("__core-js_shared__",{});e.exports=o},function(e,t,r){var n=r(14),i=r(186),o=r(55),a=r(15);e.exports=function(e,t){for(var r=i(t),s=a.f,u=o.f,l=0;l<r.length;l++){var c=r[l];n(e,c)||s(e,c,u(t,c))}}},function(e,t,r){var n=r(11);e.exports=n},function(e,t,r){var n=r(14),i=r(24),o=r(121).indexOf,a=r(45);e.exports=function(e,t){var r,s=i(e),u=0,l=[];for(r in s)!n(a,r)&&n(s,r)&&l.push(r);for(;t.length>u;)n(s,r=t[u++])&&(~o(l,r)||l.push(r));return l}},function(e,t,r){var n=r(24),i=r(26),o=r(82),a=function(e){return function(t,r,a){var s,u=n(t),l=i(u.length),c=o(a,l);if(e&&r!=r){for(;l>c;)if((s=u[c++])!=s)return!0}else for(;l>c;c++)if((e||c in u)&&u[c]===r)return e||c||0;return!e&&-1}};e.exports={includes:a(!0),indexOf:a(!1)}},function(e,t,r){var n=r(8),i=/#|\.prototype\./,o=function(e,t){var r=s[a(e)];return r==l||r!=u&&("function"==typeof t?n(t):!!t)},a=o.normalize=function(e){return String(e).replace(i,".").toLowerCase()},s=o.data={},u=o.NATIVE="N",l=o.POLYFILL="P";e.exports=o},function(e,t,r){var n=r(85);e.exports=n&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},function(e,t,r){var n=r(5);t.f=n},function(e,t,r){var n=r(119),i=r(14),o=r(124),a=r(15).f;e.exports=function(e){var t=n.Symbol||(n.Symbol={});i(t,e)||a(t,e,{value:o.f(e)})}},function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(String(e)+" is not a function");return e}},function(e,t,r){var n=r(13),i=r(59),o=r(5)("species");e.exports=function(e,t){var r;return i(e)&&("function"!=typeof(r=e.constructor)||r!==Array&&!i(r.prototype)?n(r)&&null===(r=r[o])&&(r=void 0):r=void 0),new(void 0===r?Array:r)(0===t?0:t)}},function(e,t,r){var n,i,o=r(11),a=r(192),s=o.process,u=s&&s.versions,l=u&&u.v8;l?i=(n=l.split("."))[0]+n[1]:a&&(!(n=a.match(/Edge\/(\d+)/))||n[1]>=74)&&(n=a.match(/Chrome\/(\d+)/))&&(i=n[1]),e.exports=i&&+i},function(e,t,r){var n=r(5),i=r(60),o=r(15),a=n("unscopables"),s=Array.prototype;null==s[a]&&o.f(s,a,{configurable:!0,value:i(null)}),e.exports=function(e){s[a][e]=!0}},function(e,t,r){"use strict";var n,i,o,a=r(131),s=r(21),u=r(14),l=r(5),c=r(44),h=l("iterator"),p=!1;[].keys&&("next"in(o=[].keys())?(i=a(a(o)))!==Object.prototype&&(n=i):p=!0),null==n&&(n={}),c||u(n,h)||s(n,h,(function(){return this})),e.exports={IteratorPrototype:n,BUGGY_SAFARI_ITERATORS:p}},function(e,t,r){var n=r(14),i=r(27),o=r(57),a=r(195),s=o("IE_PROTO"),u=Object.prototype;e.exports=a?Object.getPrototypeOf:function(e){return e=i(e),n(e,s)?e[s]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?u:null}},function(e,t,r){var n=r(18),i=r(196);e.exports=Object.setPrototypeOf||("__proto__"in{}?function(){var e,t=!1,r={};try{(e=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(r,[]),t=r instanceof Array}catch(e){}return function(r,o){return n(r),i(o),t?e.call(r,o):r.__proto__=o,r}}():void 0)},function(e,t,r){"use strict";var n=r(56),i=r(15),o=r(40);e.exports=function(e,t,r){var a=n(t);a in e?i.f(e,a,o(0,r)):e[a]=r}},function(e,t,r){var n=r(89),i=r(42),o=r(5)("toStringTag"),a="Arguments"==i(function(){return arguments}());e.exports=n?i:function(e){var t,r,n;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=function(e,t){try{return e[t]}catch(e){}}(t=Object(e),o))?r:a?i(t):"Object"==(n=i(t))&&"function"==typeof t.callee?"Arguments":n}},function(e,t,r){"use strict";var n=r(18);e.exports=function(){var e=n(this),t="";return e.global&&(t+="g"),e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.dotAll&&(t+="s"),e.unicode&&(t+="u"),e.sticky&&(t+="y"),t}},function(e,t,r){var n=r(47),i=r(35),o=function(e){return function(t,r){var o,a,s=String(i(t)),u=n(r),l=s.length;return u<0||u>=l?e?"":void 0:(o=s.charCodeAt(u))<55296||o>56319||u+1===l||(a=s.charCodeAt(u+1))<56320||a>57343?e?s.charAt(u):o:e?s.slice(u,u+2):a-56320+(o-55296<<10)+65536}};e.exports={codeAt:o(!1),charAt:o(!0)}},function(e,t,r){var n=r(4),i=r(27),o=r(61);n({target:"Object",stat:!0,forced:r(8)((function(){o(1)}))},{keys:function(e){return o(i(e))}})},function(e,t,r){"use strict";var n=r(4),i=r(11),o=r(122),a=r(25),s=r(139),u=r(140),l=r(141),c=r(13),h=r(8),p=r(207),f=r(62),d=r(208);e.exports=function(e,t,r){var m=-1!==e.indexOf("Map"),y=-1!==e.indexOf("Weak"),v=m?"set":"add",_=i[e],g=_&&_.prototype,b=_,x={},w=function(e){var t=g[e];a(g,e,"add"==e?function(e){return t.call(this,0===e?0:e),this}:"delete"==e?function(e){return!(y&&!c(e))&&t.call(this,0===e?0:e)}:"get"==e?function(e){return y&&!c(e)?void 0:t.call(this,0===e?0:e)}:"has"==e?function(e){return!(y&&!c(e))&&t.call(this,0===e?0:e)}:function(e,r){return t.call(this,0===e?0:e,r),this})};if(o(e,"function"!=typeof _||!(y||g.forEach&&!h((function(){(new _).entries().next()})))))b=r.getConstructor(t,e,m,v),s.REQUIRED=!0;else if(o(e,!0)){var E=new b,D=E[v](y?{}:-0,1)!=E,S=h((function(){E.has(1)})),C=p((function(e){new _(e)})),A=!y&&h((function(){for(var e=new _,t=5;t--;)e[v](t,t);return!e.has(-0)}));C||((b=t((function(t,r){l(t,b,e);var n=d(new _,t,b);return null!=r&&u(r,n[v],n,m),n}))).prototype=g,g.constructor=b),(S||A)&&(w("delete"),w("has"),m&&w("get")),(A||D)&&w(v),y&&g.clear&&delete g.clear}return x[e]=b,n({global:!0,forced:b!=_},x),f(b,e),y||r.setStrong(b,e,m),b}},function(e,t,r){var n=r(45),i=r(13),o=r(14),a=r(15).f,s=r(58),u=r(203),l=s("meta"),c=0,h=Object.isExtensible||function(){return!0},p=function(e){a(e,l,{value:{objectID:"O"+ ++c,weakData:{}}})},f=e.exports={REQUIRED:!1,fastKey:function(e,t){if(!i(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!o(e,l)){if(!h(e))return"F";if(!t)return"E";p(e)}return e[l].objectID},getWeakData:function(e,t){if(!o(e,l)){if(!h(e))return!0;if(!t)return!1;p(e)}return e[l].weakData},onFreeze:function(e){return u&&f.REQUIRED&&h(e)&&!o(e,l)&&p(e),e}};n[l]=!0},function(e,t,r){var n=r(18),i=r(204),o=r(26),a=r(86),s=r(205),u=r(206),l=function(e,t){this.stopped=e,this.result=t};(e.exports=function(e,t,r,c,h){var p,f,d,m,y,v,_,g=a(t,r,c?2:1);if(h)p=e;else{if("function"!=typeof(f=s(e)))throw TypeError("Target is not iterable");if(i(f)){for(d=0,m=o(e.length);m>d;d++)if((y=c?g(n(_=e[d])[0],_[1]):g(e[d]))&&y instanceof l)return y;return new l(!1)}p=f.call(e)}for(v=p.next;!(_=v.call(p)).done;)if("object"==typeof(y=u(p,g,_.value,c))&&y&&y instanceof l)return y;return new l(!1)}).stop=function(e){return new l(!0,e)}},function(e,t){e.exports=function(e,t,r){if(!(e instanceof t))throw TypeError("Incorrect "+(r?r+" ":"")+"invocation");return e}},function(e,t,r){"use strict";var n=r(15).f,i=r(60),o=r(209),a=r(86),s=r(141),u=r(140),l=r(87),c=r(210),h=r(16),p=r(139).fastKey,f=r(43),d=f.set,m=f.getterFor;e.exports={getConstructor:function(e,t,r,l){var c=e((function(e,n){s(e,c,t),d(e,{type:t,index:i(null),first:void 0,last:void 0,size:0}),h||(e.size=0),null!=n&&u(n,e[l],e,r)})),f=m(t),y=function(e,t,r){var n,i,o=f(e),a=v(e,t);return a?a.value=r:(o.last=a={index:i=p(t,!0),key:t,value:r,previous:n=o.last,next:void 0,removed:!1},o.first||(o.first=a),n&&(n.next=a),h?o.size++:e.size++,"F"!==i&&(o.index[i]=a)),e},v=function(e,t){var r,n=f(e),i=p(t);if("F"!==i)return n.index[i];for(r=n.first;r;r=r.next)if(r.key==t)return r};return o(c.prototype,{clear:function(){for(var e=f(this),t=e.index,r=e.first;r;)r.removed=!0,r.previous&&(r.previous=r.previous.next=void 0),delete t[r.index],r=r.next;e.first=e.last=void 0,h?e.size=0:this.size=0},delete:function(e){var t=f(this),r=v(this,e);if(r){var n=r.next,i=r.previous;delete t.index[r.index],r.removed=!0,i&&(i.next=n),n&&(n.previous=i),t.first==r&&(t.first=n),t.last==r&&(t.last=i),h?t.size--:this.size--}return!!r},forEach:function(e){for(var t,r=f(this),n=a(e,arguments.length>1?arguments[1]:void 0,3);t=t?t.next:r.first;)for(n(t.value,t.key,this);t&&t.removed;)t=t.previous},has:function(e){return!!v(this,e)}}),o(c.prototype,r?{get:function(e){var t=v(this,e);return t&&t.value},set:function(e,t){return y(this,0===e?0:e,t)}}:{add:function(e){return y(this,e=0===e?0:e,e)}}),h&&n(c.prototype,"size",{get:function(){return f(this).size}}),c},setStrong:function(e,t,r){var n=t+" Iterator",i=m(t),o=m(n);l(e,t,(function(e,t){d(this,{type:n,target:e,state:i(e),kind:t,last:void 0})}),(function(){for(var e=o(this),t=e.kind,r=e.last;r&&r.removed;)r=r.previous;return e.target&&(e.last=r=r?r.next:e.state.first)?"keys"==t?{value:r.key,done:!1}:"values"==t?{value:r.value,done:!1}:{value:[r.key,r.value],done:!1}:(e.target=void 0,{value:void 0,done:!0})}),r?"entries":"values",!r,!0),c(t)}}},function(e,t,r){"use strict";var n,i=r(4),o=r(55).f,a=r(26),s=r(221),u=r(35),l=r(223),c=r(44),h="".endsWith,p=Math.min,f=l("endsWith");i({target:"String",proto:!0,forced:!!(c||f||(n=o(String.prototype,"endsWith"),!n||n.writable))&&!f},{endsWith:function(e){var t=String(u(this));s(e);var r=arguments.length>1?arguments[1]:void 0,n=a(t.length),i=void 0===r?n:p(a(r),n),o=String(e);return h?h.call(t,o,i):t.slice(i-o.length,i)===o}})},function(e,t,r){"use strict";var n=r(224),i=r(18),o=r(27),a=r(26),s=r(47),u=r(35),l=r(225),c=r(226),h=Math.max,p=Math.min,f=Math.floor,d=/\$([$&'`]|\d\d?|<[^>]*>)/g,m=/\$([$&'`]|\d\d?)/g;n("replace",2,(function(e,t,r,n){var y=n.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE,v=n.REPLACE_KEEPS_$0,_=y?"$":"$0";return[function(r,n){var i=u(this),o=null==r?void 0:r[e];return void 0!==o?o.call(r,i,n):t.call(String(i),r,n)},function(e,n){if(!y&&v||"string"==typeof n&&-1===n.indexOf(_)){var o=r(t,e,this,n);if(o.done)return o.value}var u=i(e),f=String(this),d="function"==typeof n;d||(n=String(n));var m=u.global;if(m){var b=u.unicode;u.lastIndex=0}for(var x=[];;){var w=c(u,f);if(null===w)break;if(x.push(w),!m)break;""===String(w[0])&&(u.lastIndex=l(f,a(u.lastIndex),b))}for(var E,D="",S=0,C=0;C<x.length;C++){w=x[C];for(var A=String(w[0]),N=h(p(s(w.index),f.length),0),T=[],O=1;O<w.length;O++)T.push(void 0===(E=w[O])?E:String(E));var F=w.groups;if(d){var k=[A].concat(T,N,f);void 0!==F&&k.push(F);var P=String(n.apply(void 0,k))}else P=g(A,f,N,T,F,n);N>=S&&(D+=f.slice(S,N)+P,S=N+A.length)}return D+f.slice(S)}];function g(e,r,n,i,a,s){var u=n+e.length,l=i.length,c=m;return void 0!==a&&(a=o(a),c=d),t.call(s,c,(function(t,o){var s;switch(o.charAt(0)){case"$":return"$";case"&":return e;case"`":return r.slice(0,n);case"'":return r.slice(u);case"<":s=a[o.slice(1,-1)];break;default:var c=+o;if(0===c)return t;if(c>l){var h=f(c/10);return 0===h?t:h<=l?void 0===i[h-1]?o.charAt(1):i[h-1]+o.charAt(1):t}s=i[c-1]}return void 0===s?"":s}))}}))},function(e,t,r){"use strict";(function(e){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
var n=r(228),i=r(229),o=r(230);function a(){return u.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function s(e,t){if(a()<t)throw new RangeError("Invalid typed array length");return u.TYPED_ARRAY_SUPPORT?(e=new Uint8Array(t)).__proto__=u.prototype:(null===e&&(e=new u(t)),e.length=t),e}function u(e,t,r){if(!(u.TYPED_ARRAY_SUPPORT||this instanceof u))return new u(e,t,r);if("number"==typeof e){if("string"==typeof t)throw new Error("If encoding is specified then the first argument must be a string");return h(this,e)}return l(this,e,t,r)}function l(e,t,r,n){if("number"==typeof t)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&t instanceof ArrayBuffer?function(e,t,r,n){if(t.byteLength,r<0||t.byteLength<r)throw new RangeError("'offset' is out of bounds");if(t.byteLength<r+(n||0))throw new RangeError("'length' is out of bounds");t=void 0===r&&void 0===n?new Uint8Array(t):void 0===n?new Uint8Array(t,r):new Uint8Array(t,r,n);u.TYPED_ARRAY_SUPPORT?(e=t).__proto__=u.prototype:e=p(e,t);return e}(e,t,r,n):"string"==typeof t?function(e,t,r){"string"==typeof r&&""!==r||(r="utf8");if(!u.isEncoding(r))throw new TypeError('"encoding" must be a valid string encoding');var n=0|d(t,r),i=(e=s(e,n)).write(t,r);i!==n&&(e=e.slice(0,i));return e}(e,t,r):function(e,t){if(u.isBuffer(t)){var r=0|f(t.length);return 0===(e=s(e,r)).length||t.copy(e,0,0,r),e}if(t){if("undefined"!=typeof ArrayBuffer&&t.buffer instanceof ArrayBuffer||"length"in t)return"number"!=typeof t.length||(n=t.length)!=n?s(e,0):p(e,t);if("Buffer"===t.type&&o(t.data))return p(e,t.data)}var n;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(e,t)}function c(e){if("number"!=typeof e)throw new TypeError('"size" argument must be a number');if(e<0)throw new RangeError('"size" argument must not be negative')}function h(e,t){if(c(t),e=s(e,t<0?0:0|f(t)),!u.TYPED_ARRAY_SUPPORT)for(var r=0;r<t;++r)e[r]=0;return e}function p(e,t){var r=t.length<0?0:0|f(t.length);e=s(e,r);for(var n=0;n<r;n+=1)e[n]=255&t[n];return e}function f(e){if(e>=a())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+a().toString(16)+" bytes");return 0|e}function d(e,t){if(u.isBuffer(e))return e.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(e)||e instanceof ArrayBuffer))return e.byteLength;"string"!=typeof e&&(e=""+e);var r=e.length;if(0===r)return 0;for(var n=!1;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":case void 0:return z(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return U(e).length;default:if(n)return z(e).length;t=(""+t).toLowerCase(),n=!0}}function m(e,t,r){var n=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if((r>>>=0)<=(t>>>=0))return"";for(e||(e="utf8");;)switch(e){case"hex":return T(this,t,r);case"utf8":case"utf-8":return C(this,t,r);case"ascii":return A(this,t,r);case"latin1":case"binary":return N(this,t,r);case"base64":return S(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return O(this,t,r);default:if(n)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),n=!0}}function y(e,t,r){var n=e[t];e[t]=e[r],e[r]=n}function v(e,t,r,n,i){if(0===e.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,isNaN(r)&&(r=i?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){if(i)return-1;r=e.length-1}else if(r<0){if(!i)return-1;r=0}if("string"==typeof t&&(t=u.from(t,n)),u.isBuffer(t))return 0===t.length?-1:_(e,t,r,n,i);if("number"==typeof t)return t&=255,u.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):_(e,[t],r,n,i);throw new TypeError("val must be string, number or Buffer")}function _(e,t,r,n,i){var o,a=1,s=e.length,u=t.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(e.length<2||t.length<2)return-1;a=2,s/=2,u/=2,r/=2}function l(e,t){return 1===a?e[t]:e.readUInt16BE(t*a)}if(i){var c=-1;for(o=r;o<s;o++)if(l(e,o)===l(t,-1===c?0:o-c)){if(-1===c&&(c=o),o-c+1===u)return c*a}else-1!==c&&(o-=o-c),c=-1}else for(r+u>s&&(r=s-u),o=r;o>=0;o--){for(var h=!0,p=0;p<u;p++)if(l(e,o+p)!==l(t,p)){h=!1;break}if(h)return o}return-1}function g(e,t,r,n){r=Number(r)||0;var i=e.length-r;n?(n=Number(n))>i&&(n=i):n=i;var o=t.length;if(o%2!=0)throw new TypeError("Invalid hex string");n>o/2&&(n=o/2);for(var a=0;a<n;++a){var s=parseInt(t.substr(2*a,2),16);if(isNaN(s))return a;e[r+a]=s}return a}function b(e,t,r,n){return G(z(t,e.length-r),e,r,n)}function x(e,t,r,n){return G(function(e){for(var t=[],r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}(t),e,r,n)}function w(e,t,r,n){return x(e,t,r,n)}function E(e,t,r,n){return G(U(t),e,r,n)}function D(e,t,r,n){return G(function(e,t){for(var r,n,i,o=[],a=0;a<e.length&&!((t-=2)<0);++a)r=e.charCodeAt(a),n=r>>8,i=r%256,o.push(i),o.push(n);return o}(t,e.length-r),e,r,n)}function S(e,t,r){return 0===t&&r===e.length?n.fromByteArray(e):n.fromByteArray(e.slice(t,r))}function C(e,t,r){r=Math.min(e.length,r);for(var n=[],i=t;i<r;){var o,a,s,u,l=e[i],c=null,h=l>239?4:l>223?3:l>191?2:1;if(i+h<=r)switch(h){case 1:l<128&&(c=l);break;case 2:128==(192&(o=e[i+1]))&&(u=(31&l)<<6|63&o)>127&&(c=u);break;case 3:o=e[i+1],a=e[i+2],128==(192&o)&&128==(192&a)&&(u=(15&l)<<12|(63&o)<<6|63&a)>2047&&(u<55296||u>57343)&&(c=u);break;case 4:o=e[i+1],a=e[i+2],s=e[i+3],128==(192&o)&&128==(192&a)&&128==(192&s)&&(u=(15&l)<<18|(63&o)<<12|(63&a)<<6|63&s)>65535&&u<1114112&&(c=u)}null===c?(c=65533,h=1):c>65535&&(c-=65536,n.push(c>>>10&1023|55296),c=56320|1023&c),n.push(c),i+=h}return function(e){var t=e.length;if(t<=4096)return String.fromCharCode.apply(String,e);var r="",n=0;for(;n<t;)r+=String.fromCharCode.apply(String,e.slice(n,n+=4096));return r}(n)}t.Buffer=u,t.SlowBuffer=function(e){+e!=e&&(e=0);return u.alloc(+e)},t.INSPECT_MAX_BYTES=50,u.TYPED_ARRAY_SUPPORT=void 0!==e.TYPED_ARRAY_SUPPORT?e.TYPED_ARRAY_SUPPORT:function(){try{var e=new Uint8Array(1);return e.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===e.foo()&&"function"==typeof e.subarray&&0===e.subarray(1,1).byteLength}catch(e){return!1}}(),t.kMaxLength=a(),u.poolSize=8192,u._augment=function(e){return e.__proto__=u.prototype,e},u.from=function(e,t,r){return l(null,e,t,r)},u.TYPED_ARRAY_SUPPORT&&(u.prototype.__proto__=Uint8Array.prototype,u.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&u[Symbol.species]===u&&Object.defineProperty(u,Symbol.species,{value:null,configurable:!0})),u.alloc=function(e,t,r){return function(e,t,r,n){return c(t),t<=0?s(e,t):void 0!==r?"string"==typeof n?s(e,t).fill(r,n):s(e,t).fill(r):s(e,t)}(null,e,t,r)},u.allocUnsafe=function(e){return h(null,e)},u.allocUnsafeSlow=function(e){return h(null,e)},u.isBuffer=function(e){return!(null==e||!e._isBuffer)},u.compare=function(e,t){if(!u.isBuffer(e)||!u.isBuffer(t))throw new TypeError("Arguments must be Buffers");if(e===t)return 0;for(var r=e.length,n=t.length,i=0,o=Math.min(r,n);i<o;++i)if(e[i]!==t[i]){r=e[i],n=t[i];break}return r<n?-1:n<r?1:0},u.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},u.concat=function(e,t){if(!o(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return u.alloc(0);var r;if(void 0===t)for(t=0,r=0;r<e.length;++r)t+=e[r].length;var n=u.allocUnsafe(t),i=0;for(r=0;r<e.length;++r){var a=e[r];if(!u.isBuffer(a))throw new TypeError('"list" argument must be an Array of Buffers');a.copy(n,i),i+=a.length}return n},u.byteLength=d,u.prototype._isBuffer=!0,u.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)y(this,t,t+1);return this},u.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)y(this,t,t+3),y(this,t+1,t+2);return this},u.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)y(this,t,t+7),y(this,t+1,t+6),y(this,t+2,t+5),y(this,t+3,t+4);return this},u.prototype.toString=function(){var e=0|this.length;return 0===e?"":0===arguments.length?C(this,0,e):m.apply(this,arguments)},u.prototype.equals=function(e){if(!u.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===u.compare(this,e)},u.prototype.inspect=function(){var e="",r=t.INSPECT_MAX_BYTES;return this.length>0&&(e=this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length>r&&(e+=" ... ")),"<Buffer "+e+">"},u.prototype.compare=function(e,t,r,n,i){if(!u.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),t<0||r>e.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&t>=r)return 0;if(n>=i)return-1;if(t>=r)return 1;if(this===e)return 0;for(var o=(i>>>=0)-(n>>>=0),a=(r>>>=0)-(t>>>=0),s=Math.min(o,a),l=this.slice(n,i),c=e.slice(t,r),h=0;h<s;++h)if(l[h]!==c[h]){o=l[h],a=c[h];break}return o<a?-1:a<o?1:0},u.prototype.includes=function(e,t,r){return-1!==this.indexOf(e,t,r)},u.prototype.indexOf=function(e,t,r){return v(this,e,t,r,!0)},u.prototype.lastIndexOf=function(e,t,r){return v(this,e,t,r,!1)},u.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t|=0,isFinite(r)?(r|=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}var i=this.length-t;if((void 0===r||r>i)&&(r=i),e.length>0&&(r<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var o=!1;;)switch(n){case"hex":return g(this,e,t,r);case"utf8":case"utf-8":return b(this,e,t,r);case"ascii":return x(this,e,t,r);case"latin1":case"binary":return w(this,e,t,r);case"base64":return E(this,e,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return D(this,e,t,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=!0}},u.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function A(e,t,r){var n="";r=Math.min(e.length,r);for(var i=t;i<r;++i)n+=String.fromCharCode(127&e[i]);return n}function N(e,t,r){var n="";r=Math.min(e.length,r);for(var i=t;i<r;++i)n+=String.fromCharCode(e[i]);return n}function T(e,t,r){var n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);for(var i="",o=t;o<r;++o)i+=R(e[o]);return i}function O(e,t,r){for(var n=e.slice(t,r),i="",o=0;o<n.length;o+=2)i+=String.fromCharCode(n[o]+256*n[o+1]);return i}function F(e,t,r){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}function k(e,t,r,n,i,o){if(!u.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>i||t<o)throw new RangeError('"value" argument is out of bounds');if(r+n>e.length)throw new RangeError("Index out of range")}function P(e,t,r,n){t<0&&(t=65535+t+1);for(var i=0,o=Math.min(e.length-r,2);i<o;++i)e[r+i]=(t&255<<8*(n?i:1-i))>>>8*(n?i:1-i)}function I(e,t,r,n){t<0&&(t=4294967295+t+1);for(var i=0,o=Math.min(e.length-r,4);i<o;++i)e[r+i]=t>>>8*(n?i:3-i)&255}function L(e,t,r,n,i,o){if(r+n>e.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function M(e,t,r,n,o){return o||L(e,0,r,4),i.write(e,t,r,n,23,4),r+4}function B(e,t,r,n,o){return o||L(e,0,r,8),i.write(e,t,r,n,52,8),r+8}u.prototype.slice=function(e,t){var r,n=this.length;if((e=~~e)<0?(e+=n)<0&&(e=0):e>n&&(e=n),(t=void 0===t?n:~~t)<0?(t+=n)<0&&(t=0):t>n&&(t=n),t<e&&(t=e),u.TYPED_ARRAY_SUPPORT)(r=this.subarray(e,t)).__proto__=u.prototype;else{var i=t-e;r=new u(i,void 0);for(var o=0;o<i;++o)r[o]=this[o+e]}return r},u.prototype.readUIntLE=function(e,t,r){e|=0,t|=0,r||F(e,t,this.length);for(var n=this[e],i=1,o=0;++o<t&&(i*=256);)n+=this[e+o]*i;return n},u.prototype.readUIntBE=function(e,t,r){e|=0,t|=0,r||F(e,t,this.length);for(var n=this[e+--t],i=1;t>0&&(i*=256);)n+=this[e+--t]*i;return n},u.prototype.readUInt8=function(e,t){return t||F(e,1,this.length),this[e]},u.prototype.readUInt16LE=function(e,t){return t||F(e,2,this.length),this[e]|this[e+1]<<8},u.prototype.readUInt16BE=function(e,t){return t||F(e,2,this.length),this[e]<<8|this[e+1]},u.prototype.readUInt32LE=function(e,t){return t||F(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},u.prototype.readUInt32BE=function(e,t){return t||F(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},u.prototype.readIntLE=function(e,t,r){e|=0,t|=0,r||F(e,t,this.length);for(var n=this[e],i=1,o=0;++o<t&&(i*=256);)n+=this[e+o]*i;return n>=(i*=128)&&(n-=Math.pow(2,8*t)),n},u.prototype.readIntBE=function(e,t,r){e|=0,t|=0,r||F(e,t,this.length);for(var n=t,i=1,o=this[e+--n];n>0&&(i*=256);)o+=this[e+--n]*i;return o>=(i*=128)&&(o-=Math.pow(2,8*t)),o},u.prototype.readInt8=function(e,t){return t||F(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},u.prototype.readInt16LE=function(e,t){t||F(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r},u.prototype.readInt16BE=function(e,t){t||F(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r},u.prototype.readInt32LE=function(e,t){return t||F(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},u.prototype.readInt32BE=function(e,t){return t||F(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},u.prototype.readFloatLE=function(e,t){return t||F(e,4,this.length),i.read(this,e,!0,23,4)},u.prototype.readFloatBE=function(e,t){return t||F(e,4,this.length),i.read(this,e,!1,23,4)},u.prototype.readDoubleLE=function(e,t){return t||F(e,8,this.length),i.read(this,e,!0,52,8)},u.prototype.readDoubleBE=function(e,t){return t||F(e,8,this.length),i.read(this,e,!1,52,8)},u.prototype.writeUIntLE=function(e,t,r,n){(e=+e,t|=0,r|=0,n)||k(this,e,t,r,Math.pow(2,8*r)-1,0);var i=1,o=0;for(this[t]=255&e;++o<r&&(i*=256);)this[t+o]=e/i&255;return t+r},u.prototype.writeUIntBE=function(e,t,r,n){(e=+e,t|=0,r|=0,n)||k(this,e,t,r,Math.pow(2,8*r)-1,0);var i=r-1,o=1;for(this[t+i]=255&e;--i>=0&&(o*=256);)this[t+i]=e/o&255;return t+r},u.prototype.writeUInt8=function(e,t,r){return e=+e,t|=0,r||k(this,e,t,1,255,0),u.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),this[t]=255&e,t+1},u.prototype.writeUInt16LE=function(e,t,r){return e=+e,t|=0,r||k(this,e,t,2,65535,0),u.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):P(this,e,t,!0),t+2},u.prototype.writeUInt16BE=function(e,t,r){return e=+e,t|=0,r||k(this,e,t,2,65535,0),u.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):P(this,e,t,!1),t+2},u.prototype.writeUInt32LE=function(e,t,r){return e=+e,t|=0,r||k(this,e,t,4,4294967295,0),u.TYPED_ARRAY_SUPPORT?(this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e):I(this,e,t,!0),t+4},u.prototype.writeUInt32BE=function(e,t,r){return e=+e,t|=0,r||k(this,e,t,4,4294967295,0),u.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):I(this,e,t,!1),t+4},u.prototype.writeIntLE=function(e,t,r,n){if(e=+e,t|=0,!n){var i=Math.pow(2,8*r-1);k(this,e,t,r,i-1,-i)}var o=0,a=1,s=0;for(this[t]=255&e;++o<r&&(a*=256);)e<0&&0===s&&0!==this[t+o-1]&&(s=1),this[t+o]=(e/a>>0)-s&255;return t+r},u.prototype.writeIntBE=function(e,t,r,n){if(e=+e,t|=0,!n){var i=Math.pow(2,8*r-1);k(this,e,t,r,i-1,-i)}var o=r-1,a=1,s=0;for(this[t+o]=255&e;--o>=0&&(a*=256);)e<0&&0===s&&0!==this[t+o+1]&&(s=1),this[t+o]=(e/a>>0)-s&255;return t+r},u.prototype.writeInt8=function(e,t,r){return e=+e,t|=0,r||k(this,e,t,1,127,-128),u.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),e<0&&(e=255+e+1),this[t]=255&e,t+1},u.prototype.writeInt16LE=function(e,t,r){return e=+e,t|=0,r||k(this,e,t,2,32767,-32768),u.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):P(this,e,t,!0),t+2},u.prototype.writeInt16BE=function(e,t,r){return e=+e,t|=0,r||k(this,e,t,2,32767,-32768),u.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):P(this,e,t,!1),t+2},u.prototype.writeInt32LE=function(e,t,r){return e=+e,t|=0,r||k(this,e,t,4,2147483647,-2147483648),u.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24):I(this,e,t,!0),t+4},u.prototype.writeInt32BE=function(e,t,r){return e=+e,t|=0,r||k(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),u.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):I(this,e,t,!1),t+4},u.prototype.writeFloatLE=function(e,t,r){return M(this,e,t,!0,r)},u.prototype.writeFloatBE=function(e,t,r){return M(this,e,t,!1,r)},u.prototype.writeDoubleLE=function(e,t,r){return B(this,e,t,!0,r)},u.prototype.writeDoubleBE=function(e,t,r){return B(this,e,t,!1,r)},u.prototype.copy=function(e,t,r,n){if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);var i,o=n-r;if(this===e&&r<t&&t<n)for(i=o-1;i>=0;--i)e[i+t]=this[i+r];else if(o<1e3||!u.TYPED_ARRAY_SUPPORT)for(i=0;i<o;++i)e[i+t]=this[i+r];else Uint8Array.prototype.set.call(e,this.subarray(r,r+o),t);return o},u.prototype.fill=function(e,t,r,n){if("string"==typeof e){if("string"==typeof t?(n=t,t=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),1===e.length){var i=e.charCodeAt(0);i<256&&(e=i)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!u.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof e&&(e&=255);if(t<0||this.length<t||this.length<r)throw new RangeError("Out of range index");if(r<=t)return this;var o;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(o=t;o<r;++o)this[o]=e;else{var a=u.isBuffer(e)?e:z(new u(e,n).toString()),s=a.length;for(o=0;o<r-t;++o)this[o+t]=a[o%s]}return this};var j=/[^+\/0-9A-Za-z-_]/g;function R(e){return e<16?"0"+e.toString(16):e.toString(16)}function z(e,t){var r;t=t||1/0;for(var n=e.length,i=null,o=[],a=0;a<n;++a){if((r=e.charCodeAt(a))>55295&&r<57344){if(!i){if(r>56319){(t-=3)>-1&&o.push(239,191,189);continue}if(a+1===n){(t-=3)>-1&&o.push(239,191,189);continue}i=r;continue}if(r<56320){(t-=3)>-1&&o.push(239,191,189),i=r;continue}r=65536+(i-55296<<10|r-56320)}else i&&(t-=3)>-1&&o.push(239,191,189);if(i=null,r<128){if((t-=1)<0)break;o.push(r)}else if(r<2048){if((t-=2)<0)break;o.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return o}function U(e){return n.toByteArray(function(e){if((e=function(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")}(e).replace(j,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function G(e,t,r,n){for(var i=0;i<n&&!(i+r>=t.length||i>=e.length);++i)t[i+r]=e[i];return i}}).call(this,r(77))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isASCIIByte=function(e){return e>=0&&e<=127}},function(e,t,r){"use strict";var n=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},i=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(n(arguments[t]));return e};Object.defineProperty(t,"__esModule",{value:!0}),t.length=function(e){return e.length},t.byteLowercase=function(e){for(var t=0;t<e.length;t++){var r=e[t];r>=65&&r<=90&&(e[t]=r+32)}},t.byteUppercase=function(e){for(var t=0;t<e.length;t++){var r=e[t];r>=97&&r<=122&&(e[t]=r-32)}},t.byteCaseInsensitiveMatch=function(e,t){if(e.length!==t.length)return!1;for(var r=0;r<e.length;r++){var n=e[r],i=t[r];if(n>=65&&n<=90&&(n+=32),i>=65&&i<=90&&(i+=32),n!==i)return!1}return!0},t.startsWith=function(e,t){for(var r=0;;){if(r>=e.length)return!1;if(r>=t.length)return!0;if(e[r]!==t[r])return!1;r++}},t.byteLessThan=function(e,t){for(var r=0;;){if(r>=e.length)return!1;if(r>=t.length)return!0;var n=e[r],i=t[r];if(n<i)return!0;if(n>i)return!1;r++}},t.isomorphicDecode=function(e){return String.fromCodePoint.apply(String,i(e))}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(6),i=r(7),o=r(0),a=r(12),s=function(){function e(e){this._associatedDocument=e||n.dom.window.document}return e.prototype.createDocumentType=function(e,t,r){return o.namespace_validate(e),o.create_documentType(this._associatedDocument,e,t,r)},e.prototype.createDocument=function(e,t,r){void 0===r&&(r=null);var n=o.create_xmlDocument(),a=null;return t&&(a=o.document_internalCreateElementNS(n,e,t)),r&&n.appendChild(r),a&&n.appendChild(a),n._origin=this._associatedDocument._origin,e===i.namespace.HTML?n._contentType="application/xhtml+xml":e===i.namespace.SVG?n._contentType="image/svg+xml":n._contentType="application/xml",n},e.prototype.createHTMLDocument=function(e){var t=o.create_document();t._type="html",t._contentType="text/html",t.appendChild(o.create_documentType(t,"html","",""));var r=o.element_createAnElement(t,"html",i.namespace.HTML);t.appendChild(r);var n=o.element_createAnElement(t,"head",i.namespace.HTML);if(r.appendChild(n),void 0!==e){var a=o.element_createAnElement(t,"title",i.namespace.HTML);n.appendChild(a);var s=o.create_text(t,e);a.appendChild(s)}var u=o.element_createAnElement(t,"body",i.namespace.HTML);return r.appendChild(u),t._origin=this._associatedDocument._origin,t},e.prototype.hasFeature=function(){return!0},e._create=function(t){return new e(t)},e}();t.DOMImplementationImpl=s,a.idl_defineConst(s.prototype,"_ID","@oozcitak/dom")},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(69),a=r(1),s=r(0),u=function(e){function t(){var t=e.call(this)||this;return t._signalSlots=new Set,t._mutationObserverMicrotaskQueued=!1,t._mutationObservers=new Set,t._iteratorList=new a.FixedSizeSet,t._associatedDocument=s.create_document(),t}return i(t,e),Object.defineProperty(t.prototype,"document",{get:function(){return this._associatedDocument},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"event",{get:function(){return this._currentEvent},enumerable:!0,configurable:!0}),t._create=function(){return new t},t}(o.EventTargetImpl);t.WindowImpl=u},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2),i=function(){function e(){}return e.isNode=function(e){return!!e&&void 0!==e._nodeType},e.isDocumentNode=function(t){return e.isNode(t)&&t._nodeType===n.NodeType.Document},e.isDocumentTypeNode=function(t){return e.isNode(t)&&t._nodeType===n.NodeType.DocumentType},e.isDocumentFragmentNode=function(t){return e.isNode(t)&&t._nodeType===n.NodeType.DocumentFragment},e.isAttrNode=function(t){return e.isNode(t)&&t._nodeType===n.NodeType.Attribute},e.isCharacterDataNode=function(t){if(!e.isNode(t))return!1;var r=t._nodeType;return r===n.NodeType.Text||r===n.NodeType.ProcessingInstruction||r===n.NodeType.Comment||r===n.NodeType.CData},e.isTextNode=function(t){return e.isNode(t)&&(t._nodeType===n.NodeType.Text||t._nodeType===n.NodeType.CData)},e.isExclusiveTextNode=function(t){return e.isNode(t)&&t._nodeType===n.NodeType.Text},e.isCDATASectionNode=function(t){return e.isNode(t)&&t._nodeType===n.NodeType.CData},e.isCommentNode=function(t){return e.isNode(t)&&t._nodeType===n.NodeType.Comment},e.isProcessingInstructionNode=function(t){return e.isNode(t)&&t._nodeType===n.NodeType.ProcessingInstruction},e.isElementNode=function(t){return e.isNode(t)&&t._nodeType===n.NodeType.Element},e.isCustomElementNode=function(t){return e.isElementNode(t)&&"custom"===t._customElementState},e.isShadowRoot=function(e){return!!e&&void 0!==e.host},e.isMouseEvent=function(e){return!!e&&void 0!==e.screenX&&null!=e.screenY},e.isSlotable=function(t){return!!t&&void 0!==t._name&&void 0!==t._assignedSlot&&(e.isTextNode(t)||e.isElementNode(t))},e.isSlot=function(t){return!!t&&void 0!==t._name&&void 0!==t._assignedNodes&&e.isElementNode(t)},e.isWindow=function(e){return!!e&&void 0!==e.navigator},e.isEventListener=function(e){return!!e&&void 0!==e.handleEvent},e.isRegisteredObserver=function(e){return!!e&&void 0!==e.observer&&void 0!==e.options},e.isTransientRegisteredObserver=function(t){return!!t&&void 0!==t.source&&e.isRegisteredObserver(t)},e}();t.Guard=i},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){function t(){return e.call(this)||this}return i(t,e),t}(r(97).DocumentImpl);t.XMLDocumentImpl=o},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},i=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a};Object.defineProperty(t,"__esModule",{value:!0});var o,a=r(1),s=r(242),u=r(7),l=r(243),c={ftp:21,file:null,http:80,https:443,ws:80,wss:443},h=/[\0-\x1F\x7F-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,p=/[ "<>`]|[\0-\x1F\x7F-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,f=/[ "<>`#?{}]|[\0-\x1F\x7F-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,d=/[ "<>`#?{}/:;=@\[\]\\\^\|]|[\0-\x1F\x7F-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,m=/[0-9A-Za-z!\$&-\/:;=\?@_~\xA0-\uD7FF\uE000-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uD83E\uD840-\uD87E\uD880-\uD8BE\uD8C0-\uD8FE\uD900-\uD93E\uD940-\uD97E\uD980-\uD9BE\uD9C0-\uD9FE\uDA00-\uDA3E\uDA40-\uDA7E\uDA80-\uDABE\uDAC0-\uDAFE\uDB00-\uDB3E\uDB40-\uDB7E\uDB80-\uDBBE\uDBC0-\uDBFE][\uDC00-\uDFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDC00-\uDFFD]/,y=/[\0\t\f\r #%/:?@\[\\\]]/;function v(e){void 0!==o&&o.call(null,"Validation Error: "+e)}function _(){return{scheme:"",username:"",password:"",host:null,port:null,path:[],query:null,fragment:null,_cannotBeABaseURLFlag:!1,_blobURLEntry:null}}function g(e){return e in c}function b(e){return g(e.scheme)}function x(e){return c[e]||null}function w(e){return""!==e.username||""!==e.password}function E(e,t){var r,i;void 0===t&&(t=!1);var o=e.scheme+":";if(null!==e.host?(o+="//",w(e)&&(o+=e.username,""!==e.password&&(o+=":"+e.password),o+="@"),o+=D(e.host),null!==e.port&&(o+=":"+e.port)):null===e.host&&"file"===e.scheme&&(o+="//"),e._cannotBeABaseURLFlag)o+=e.path[0];else try{for(var a=n(e.path),s=a.next();!s.done;s=a.next()){o+="/"+s.value}}catch(e){r={error:e}}finally{try{s&&!s.done&&(i=a.return)&&i.call(a)}finally{if(r)throw r.error}}return null!==e.query&&(o+="?"+e.query),t||null===e.fragment||(o+="#"+e.fragment),o}function D(e){return a.isNumber(e)?S(e):a.isArray(e)?"["+C(e)+"]":e}function S(e){for(var t="",r=e,n=1;n<=4;n++)t=(r%256).toString()+t,4!==n&&(t="."+t),r=Math.floor(r/256);return t}function C(e){for(var t="",r=null,n=-1,i=0,o=0,a=0;a<8;a++)if(0===e[a]){i=1;for(var s=a+1;s<8&&0===e[s];s++)i++;i>o&&(o=i,n=a)}o>1&&(r=n);for(var u=!1,l=0;l<8;l++)u&&0===e[l]||(u&&(u=!1),r!==l?(t+=e[l].toString(16),7!==l&&(t+=":")):(t+=0===l?"::":":",u=!0));return t}function A(e,t,r,i,o){var l,c,y,_;if(void 0===i){i={scheme:"",username:"",password:"",host:null,port:null,path:[],query:null,fragment:null,_cannotBeABaseURLFlag:!1,_blobURLEntry:null};var E=/^[\u0000-\u001F\u0020]+/,D=/[\u0000-\u001F\u0020]+$/;(E.test(e)||D.test(e))&&v("Input string contains leading or trailing control characters or space."),e=(e=e.replace(E,"")).replace(D,"")}var S=/[\u0009\u000A\u000D]/g;S.test(e)&&v("Input string contains tab or newline characters."),e=e.replace(S,"");var C=void 0===o?s.ParserState.SchemeStart:o;void 0===t&&(t=null);for(var A=void 0===r||"replacement"===r||"UTF-16BE"===r||"UTF-16LE"===r?"UTF-8":r,L="",M=!1,B=!1,j=!1,R=new a.StringWalker(e);;){switch(C){case s.ParserState.SchemeStart:if(u.codePoint.ASCIIAlpha.test(R.c()))L+=R.c().toLowerCase(),C=s.ParserState.Scheme;else{if(void 0!==o)return v("Invalid scheme start character."),null;C=s.ParserState.NoScheme,R.pointer--}break;case s.ParserState.Scheme:if(u.codePoint.ASCIIAlphanumeric.test(R.c())||"+"===R.c()||"-"===R.c()||"."===R.c())L+=R.c().toLowerCase();else{if(":"!==R.c()){if(void 0===o){L="",C=s.ParserState.NoScheme,R.pointer=0;continue}return v("Invalid input string."),null}if(void 0!==o){if(g(i.scheme)&&!g(L))return i;if(!g(i.scheme)&&g(L))return i;if((w(i)||null!==i.port)&&"file"===L)return i;if("file"===i.scheme&&(""===i.host||null===i.host))return i}if(i.scheme=L,void 0!==o)return i.port===x(i.scheme)&&(i.port=null),i;L="","file"===i.scheme?(R.remaining().startsWith("//")||v("Invalid file URL scheme, '//' expected."),C=s.ParserState.File):b(i)&&null!==t&&t.scheme===i.scheme?C=s.ParserState.SpecialRelativeOrAuthority:b(i)?C=s.ParserState.SpecialAuthoritySlashes:R.remaining().startsWith("/")?(C=s.ParserState.PathOrAuthority,R.pointer++):(i._cannotBeABaseURLFlag=!0,i.path.push(""),C=s.ParserState.CannotBeABaseURLPath)}break;case s.ParserState.NoScheme:if(null===t||t._cannotBeABaseURLFlag&&"#"!==R.c())return v("Invalid input string."),null;t._cannotBeABaseURLFlag&&"#"===R.c()?(i.scheme=t.scheme,i.path=u.list.clone(t.path),i.query=t.query,i.fragment="",i._cannotBeABaseURLFlag=!0,C=s.ParserState.Fragment):"file"!==t.scheme?(C=s.ParserState.Relative,R.pointer--):(C=s.ParserState.File,R.pointer--);break;case s.ParserState.SpecialRelativeOrAuthority:"/"===R.c()&&R.remaining().startsWith("/")?(C=s.ParserState.SpecialAuthorityIgnoreSlashes,R.pointer++):(v("Invalid input string."),C=s.ParserState.Relative,R.pointer--);break;case s.ParserState.PathOrAuthority:"/"===R.c()?C=s.ParserState.Authority:(C=s.ParserState.Path,R.pointer--);break;case s.ParserState.Relative:if(null===t)throw new Error("Invalid parser state. Base URL is null.");switch(i.scheme=t.scheme,R.c()){case"":i.username=t.username,i.password=t.password,i.host=t.host,i.port=t.port,i.path=u.list.clone(t.path),i.query=t.query;break;case"/":C=s.ParserState.RelativeSlash;break;case"?":i.username=t.username,i.password=t.password,i.host=t.host,i.port=t.port,i.path=u.list.clone(t.path),i.query="",C=s.ParserState.Query;break;case"#":i.username=t.username,i.password=t.password,i.host=t.host,i.port=t.port,i.path=u.list.clone(t.path),i.query=t.query,i.fragment="",C=s.ParserState.Fragment;break;default:b(i)&&"\\"===R.c()?(v("Invalid input string."),C=s.ParserState.RelativeSlash):(i.username=t.username,i.password=t.password,i.host=t.host,i.port=t.port,i.path=u.list.clone(t.path),0!==i.path.length&&i.path.splice(i.path.length-1,1),C=s.ParserState.Path,R.pointer--)}break;case s.ParserState.RelativeSlash:if(!b(i)||"/"!==R.c()&&"\\"!==R.c())if("/"===R.c())C=s.ParserState.Authority;else{if(null===t)throw new Error("Invalid parser state. Base URL is null.");i.username=t.username,i.password=t.password,i.host=t.host,i.port=t.port,C=s.ParserState.Path,R.pointer--}else"\\"===R.c()&&v("Invalid input string."),C=s.ParserState.SpecialAuthorityIgnoreSlashes;break;case s.ParserState.SpecialAuthoritySlashes:"/"===R.c()&&R.remaining().startsWith("/")?(C=s.ParserState.SpecialAuthorityIgnoreSlashes,R.pointer++):(v("Expected '//'."),C=s.ParserState.SpecialAuthorityIgnoreSlashes,R.pointer--);break;case s.ParserState.SpecialAuthorityIgnoreSlashes:"/"!==R.c()&&"\\"!==R.c()?(C=s.ParserState.Authority,R.pointer--):v("Unexpected '/' or '\\'.");break;case s.ParserState.Authority:if("@"===R.c()){v("Unexpected '@'."),M&&(L="%40"+L),M=!0;try{for(var U=(l=void 0,n(L)),G=U.next();!G.done;G=U.next()){var q=G.value;if(":"!==q||j){var W=X(q,d);j?i.password+=W:i.username+=W}else j=!0}}catch(e){l={error:e}}finally{try{G&&!G.done&&(c=U.return)&&c.call(U)}finally{if(l)throw l.error}}L=""}else if(""===R.c()||"/"===R.c()||"?"===R.c()||"#"===R.c()||b(i)&&"\\"===R.c()){if(M&&""===L)return v("Invalid input string."),null;R.pointer-=L.length+1,L="",C=s.ParserState.Host}else L+=R.c();break;case s.ParserState.Host:case s.ParserState.Hostname:if(void 0!==o&&"file"===i.scheme)R.pointer--,C=s.ParserState.FileHost;else if(":"!==R.c()||B)if(""===R.c()||"/"===R.c()||"?"===R.c()||"#"===R.c()||b(i)&&"\\"===R.c()){if(R.pointer--,b(i)&&""===L)return v("Invalid input string."),null;if(void 0!==o&&""===L&&(w(i)||null!==i.port))return v("Invalid input string."),i;if(null===(J=I(L,!b(i))))return null;if(i.host=J,L="",C=s.ParserState.PathStart,void 0!==o)return i}else"["===R.c()&&(B=!0),"]"===R.c()&&(B=!1),L+=R.c();else{if(""===L)return v("Invalid input string."),null;if(null===(J=I(L,!b(i))))return null;if(i.host=J,L="",C=s.ParserState.Port,o===s.ParserState.Hostname)return i}break;case s.ParserState.Port:if(u.codePoint.ASCIIDigit.test(R.c()))L+=R.c();else{if(!(""===R.c()||"/"===R.c()||"?"===R.c()||"#"===R.c()||b(i)&&"\\"===R.c()||o))return v("Invalid input string."),null;if(""!==L&&""!==L){var H=parseInt(L,10);if(H>Math.pow(2,16)-1)return v("Invalid port number."),null;i.port=H===x(i.scheme)?null:H,L=""}if(void 0!==o)return i;C=s.ParserState.PathStart,R.pointer--}break;case s.ParserState.File:if(i.scheme="file","/"===R.c()||"\\"===R.c())"\\"===R.c()&&v("Invalid input string."),C=s.ParserState.FileSlash;else if(null!==t&&"file"===t.scheme)switch(R.c()){case"":i.host=t.host,i.path=u.list.clone(t.path),i.query=t.query;break;case"?":i.host=t.host,i.path=u.list.clone(t.path),i.query="",C=s.ParserState.Query;break;case"#":i.host=t.host,i.path=u.list.clone(t.path),i.query=t.query,i.fragment="",C=s.ParserState.Fragment;break;default:P(R.substring())?v("Unexpected windows drive letter in input string."):(i.host=t.host,i.path=u.list.clone(t.path),O(i)),C=s.ParserState.Path,R.pointer--}else C=s.ParserState.Path,R.pointer--;break;case s.ParserState.FileSlash:"/"===R.c()||"\\"===R.c()?("\\"===R.c()&&v("Invalid input string."),C=s.ParserState.FileHost):(null===t||"file"!==t.scheme||P(R.substring())||(F(t.path[0])?i.path.push(t.path[0]):i.host=t.host),C=s.ParserState.Path,R.pointer--);break;case s.ParserState.FileHost:if(""===R.c()||"/"===R.c()||"\\"===R.c()||"?"===R.c()||"#"===R.c())if(R.pointer--,void 0===o&&k(L))v("Unexpected windows drive letter in input string."),C=s.ParserState.Path;else if(""===L){if(i.host="",void 0!==o)return i;C=s.ParserState.PathStart}else{var J;if(null===(J=I(L,!b(i))))return null;if("localhost"===J&&(J=""),i.host=J,void 0!==o)return i;L="",C=s.ParserState.PathStart}else L+=R.c();break;case s.ParserState.PathStart:b(i)?("\\"===R.c()&&v("Invalid input string."),C=s.ParserState.Path,"/"!==R.c()&&"\\"!==R.c()&&R.pointer--):void 0===o&&"?"===R.c()?(i.query="",C=s.ParserState.Query):void 0===o&&"#"===R.c()?(i.fragment="",C=s.ParserState.Fragment):""!==R.c()&&(C=s.ParserState.Path,"/"!==R.c()&&R.pointer--);break;case s.ParserState.Path:if(""===R.c()||"/"===R.c()||b(i)&&"\\"===R.c()||void 0===o&&("?"===R.c()||"#"===R.c())){if(b(i)&&"\\"===R.c()&&v("Invalid input string."),T(L))O(i),"/"===R.c()||b(i)&&"\\"===R.c()||i.path.push("");else if(!N(L)||"/"===R.c()||b(i)&&"\\"===R.c()){if(!N(L)){if("file"===i.scheme&&0===i.path.length&&k(L)){null!==i.host&&""!==i.host&&(v("Invalid input string."),i.host="");var Y=Array.from(L);L=Y.slice(0,1)+":"+Y.slice(2)}i.path.push(L)}}else i.path.push("");if(L="","file"===i.scheme&&(""===R.c()||"?"===R.c()||"#"===R.c()))for(;i.path.length>1&&""===i.path[0];)v("Invalid input string."),i.path.splice(0,1);"?"===R.c()&&(i.query="",C=s.ParserState.Query),"#"===R.c()&&(i.fragment="",C=s.ParserState.Fragment)}else m.test(R.c())||"%"===R.c()||v("Character is not a URL code point or a percent encoded character."),"%"!==R.c()||/^[0-9a-fA-F][0-9a-fA-F]/.test(R.remaining())||v("Percent encoded character must be followed by two hex digits."),L+=X(R.c(),f);break;case s.ParserState.CannotBeABaseURLPath:"?"===R.c()?(i.query="",C=s.ParserState.Query):"#"===R.c()?(i.fragment="",C=s.ParserState.Fragment):(""===R.c()||m.test(R.c())||"%"===R.c()||v("Character is not a URL code point or a percent encoded character."),"%"!==R.c()||/^[0-9a-fA-F][0-9a-fA-F]/.test(R.remaining())||v("Percent encoded character must be followed by two hex digits."),""!==R.c()&&(i.path[0]+=X(R.c(),h)));break;case s.ParserState.Query:if("UTF-8"===A||b(i)&&"ws"!==i.scheme&&"wss"!==i.scheme||(A="UTF-8"),void 0===o&&"#"===R.c())i.fragment="",C=s.ParserState.Fragment;else if(""!==R.c()){if(m.test(R.c())||"%"===R.c()||v("Character is not a URL code point or a percent encoded character."),"%"!==R.c()||/^[0-9a-fA-F][0-9a-fA-F]/.test(R.remaining())||v("Percent encoded character must be followed by two hex digits."),"UTF-8"!==A.toUpperCase())throw new Error("Only UTF-8 encoding is supported.");var V=a.utf8Encode(R.c());if(V.length>=3&&38===V[0]&&35===V[1]&&59===V[V.length-1])V=V.subarray(2,V.length-1),i.query+="%26%23"+u.byteSequence.isomorphicDecode(V)+"%3B";else try{for(var K=(y=void 0,n(V)),$=K.next();!$.done;$=K.next()){var Q=$.value;Q<33||Q>126||34===Q||35===Q||60===Q||62===Q||39===Q&&b(i)?i.query+=z(Q):i.query+=String.fromCharCode(Q)}}catch(e){y={error:e}}finally{try{$&&!$.done&&(_=K.return)&&_.call(K)}finally{if(y)throw y.error}}}break;case s.ParserState.Fragment:""===R.c()||("\0"===R.c()?v("NULL character in input string."):(m.test(R.c())||"%"===R.c()||v("Unexpected character in fragment string."),"%"!==R.c()||/^[A-Za-z0-9][A-Za-z0-9]/.test(R.remaining())||v("Unexpected character in fragment string."),i.fragment+=X(R.c(),p)))}if(R.eof)break;R.pointer++}return i}function N(e){return"."===e||"%2e"===e.toLowerCase()}function T(e){var t=e.toLowerCase();return".."===t||".%2e"===t||"%2e."===t||"%2e%2e"===t}function O(e){var t=e.path;0!==t.length&&("file"===e.scheme&&1===t.length&&F(t[0])||e.path.splice(e.path.length-1,1))}function F(e){return e.length>=2&&u.codePoint.ASCIIAlpha.test(e[0])&&":"===e[1]}function k(e){return e.length>=2&&u.codePoint.ASCIIAlpha.test(e[0])&&(":"===e[1]||"|"===e[1])}function P(e){return e.length>=2&&k(e)&&(2===e.length||"/"===e[2]||"\\"===e[2]||"?"===e[2]||"#"===e[2])}function I(e,t){if(void 0===t&&(t=!1),e.startsWith("["))return e.endsWith("]")?B(e.substring(1,e.length-1)):(v("Expected ']' after '['."),null);if(t)return j(e);var r=H(a.utf8Decode(G(e)));if(null===r)return v("Invalid domain."),null;if(y.test(r))return v("Invalid domain."),null;var n=M(r);return null===n||a.isNumber(n)?n:r}function L(e,t){void 0===t&&(t={value:!1});var r=10;return e.startsWith("0x")||e.startsWith("0X")?(t.value=!0,e=e.substr(2),r=16):e.length>=2&&"0"===e[0]&&(t.value=!0,e=e.substr(1),r=8),""===e?0:(10===r?/^[0-9]+$/:16===r?/^[0-9A-Fa-f]+$/:/^[0-7]+$/).test(e)?parseInt(e,r):null}function M(e){var t,r,i,o,a={value:!1},s=e.split(".");if(""===s[s.length-1]&&(a.value=!0,s.length>1&&s.pop()),s.length>4)return e;var u=[];try{for(var l=n(s),c=l.next();!c.done;c=l.next()){var h=c.value;if(""===h)return e;if(null===(_=L(h,a)))return e;u.push(_)}}catch(e){t={error:e}}finally{try{c&&!c.done&&(r=l.return)&&r.call(l)}finally{if(t)throw t.error}}a.value&&v("Invalid IP v4 address.");for(var p=0;p<u.length;p++){if(u[p]>255&&(v("Invalid IP v4 address."),p<u.length-1))return null}if(u[u.length-1]>=Math.pow(256,5-u.length))return v("Invalid IP v4 address."),null;var f=u[u.length-1];u.pop();var d=0;try{for(var m=n(u),y=m.next();!y.done;y=m.next()){var _;f+=(_=y.value)*Math.pow(256,3-d),d++}}catch(e){i={error:e}}finally{try{y&&!y.done&&(o=m.return)&&o.call(m)}finally{if(i)throw i.error}}return f}function B(e){var t,r=[0,0,0,0,0,0,0,0],n=0,o=null,s=new a.StringWalker(e);if(":"===s.c()){if(!s.remaining().startsWith(":"))return v("Invalid IP v6 address."),null;s.pointer+=2,o=n+=1}for(;""!==s.c();){if(8===n)return v("Invalid IP v6 address."),null;if(":"!==s.c()){for(var l=0,c=0;c<4&&u.codePoint.ASCIIHexDigit.test(s.c());)l=16*l+parseInt(s.c(),16),s.pointer++,c++;if("."===s.c()){if(0===c)return v("Invalid IP v6 address."),null;if(s.pointer-=c,n>6)return v("Invalid IP v6 address."),null;for(var h=0;""!==s.c();){var p=null;if(h>0){if(!("."===s.c()&&h<4))return v("Invalid IP v6 address."),null;s.pointer++}if(!u.codePoint.ASCIIDigit.test(s.c()))return v("Invalid IP v6 address."),null;for(;u.codePoint.ASCIIDigit.test(s.c());){var f=parseInt(s.c(),10);if(null===p)p=f;else{if(0===p)return v("Invalid IP v6 address."),null;p=10*p+f}if(p>255)return v("Invalid IP v6 address."),null;s.pointer++}if(null===p)return v("Invalid IP v6 address."),null;r[n]=256*r[n]+p,2!==++h&&4!==h||n++}if(4!==h)return v("Invalid IP v6 address."),null;break}if(":"===s.c()){if(s.pointer++,""===s.c())return v("Invalid IP v6 address."),null}else if(""!==s.c())return v("Invalid IP v6 address."),null;r[n]=l,n++}else{if(null!==o)return v("Invalid IP v6 address."),null;s.pointer++,o=++n}}if(null!==o){var d=n-o;for(n=7;0!==n&&d>0;)t=i([r[o+d-1],r[n]],2),r[n]=t[0],r[o+d-1]=t[1],n--,d--}else if(null===o&&8!==n)return v("Invalid IP v6 address."),null;return r}function j(e){var t,r;if(/[\x00\t\f\r #/:?@\[\\\]]/.test(e))return v("Invalid host string."),null;var i="";try{for(var o=n(e),a=o.next();!a.done;a=o.next()){i+=X(a.value,h)}}catch(e){t={error:e}}finally{try{a&&!a.done&&(r=o.return)&&r.call(o)}finally{if(t)throw t.error}}return i}function R(e){return null}function z(e){return"%"+("00"+e.toString(16).toUpperCase()).slice(-2)}function U(e){for(var t=function(e){return e>=48&&e<=57||e>=65&&e<=70||e>=97&&e<=102},r=new Uint8Array(e.length),n=0,i=0;i<e.length;i++){var o=e[i];if(37!==o)r[n]=o,n++;else if(37===o&&i>=e.length-2)r[n]=o,n++;else if(37!==o||t(e[i+1])&&t(e[i+2])){var s=parseInt(a.utf8Decode(Uint8Array.of(e[i+1],e[i+2])),16);r[n]=s,n++,i+=2}else r[n]=o,n++}return r.subarray(0,n)}function G(e){return U(a.utf8Encode(e))}function X(e,t){var r,i;if(!t.test(e))return e;var o=a.utf8Encode(e),s="";try{for(var u=n(o),l=u.next();!l.done;l=u.next()){s+=z(l.value)}}catch(e){r={error:e}}finally{try{l&&!l.done&&(i=u.return)&&i.call(u)}finally{if(r)throw r.error}}return s}function q(e){var t,r,i,o,s=[],u=[];try{for(var l=n(e),c=l.next();!c.done;c=l.next()){var h=c.value;38===h?(s.push(Uint8Array.from(u)),u=[]):u.push(h)}}catch(e){t={error:e}}finally{try{c&&!c.done&&(r=l.return)&&r.call(l)}finally{if(t)throw t.error}}0!==u.length&&s.push(Uint8Array.from(u));var p=[];try{for(var f=n(s),d=f.next();!d.done;d=f.next()){var m=d.value;if(0!==m.length){for(var y=m.indexOf(61),v=-1!==y?m.slice(0,y):m,_=-1!==y?m.slice(y+1):new Uint8Array,g=0;g<v.length;g++)43===v[g]&&(v[g]=32);for(g=0;g<_.length;g++)43===_[g]&&(_[g]=32);var b=a.utf8Decode(v),x=a.utf8Decode(_);p.push([b,x])}}}catch(e){i={error:e}}finally{try{d&&!d.done&&(o=f.return)&&o.call(f)}finally{if(i)throw i.error}}return p}function W(e){var t,r,i="";try{for(var o=n(e),a=o.next();!a.done;a=o.next()){var s=a.value;i+=32===s?"+":42===s||45===s||46===s||s>=48&&s<=57||s>=65&&s<=90||95===s||s>=97&&s<=122?String.fromCodePoint(s):z(s)}}catch(e){t={error:e}}finally{try{a&&!a.done&&(r=o.return)&&r.call(o)}finally{if(t)throw t.error}}return i}function H(e,t){void 0===t&&(t=!1);var r=l.domainToASCII(e);return""===r?(v("Invalid domain name."),null):r}t.setValidationErrorCallback=function(e){o=e},t.newURL=_,t.isSpecialScheme=g,t.isSpecial=b,t.defaultPort=x,t.includesCredentials=w,t.cannotHaveAUsernamePasswordPort=function(e){return null===e.host||""===e.host||e._cannotBeABaseURLFlag||"file"===e.scheme},t.urlSerializer=E,t.hostSerializer=D,t.iPv4Serializer=S,t.iPv6Serializer=C,t.urlParser=function(e,t,r){var n=A(e,t,r);return null===n?null:("blob"!==n.scheme||(n._blobURLEntry=null),n)},t.basicURLParser=A,t.setTheUsername=function(e,t){var r,i,o="";try{for(var a=n(t),s=a.next();!s.done;s=a.next()){o+=X(s.value,d)}}catch(e){r={error:e}}finally{try{s&&!s.done&&(i=a.return)&&i.call(a)}finally{if(r)throw r.error}}e.username=o},t.setThePassword=function(e,t){var r,i,o="";try{for(var a=n(t),s=a.next();!s.done;s=a.next()){o+=X(s.value,d)}}catch(e){r={error:e}}finally{try{s&&!s.done&&(i=a.return)&&i.call(a)}finally{if(r)throw r.error}}e.password=o},t.isSingleDotPathSegment=N,t.isDoubleDotPathSegment=T,t.shorten=O,t.isNormalizedWindowsDriveLetter=F,t.isWindowsDriveLetter=k,t.startsWithAWindowsDriveLetter=P,t.hostParser=I,t.iPv4NumberParser=L,t.iPv4Parser=M,t.iPv6Parser=B,t.opaqueHostParser=j,t.resolveABlobURL=R,t.percentEncode=z,t.percentDecode=U,t.stringPercentDecode=G,t.utf8PercentEncode=X,t.hostEquals=function(e,t){return e===t},t.urlEquals=function(e,t,r){return void 0===r&&(r=!1),E(e,r)===E(t,r)},t.urlEncodedStringParser=function(e){return q(a.utf8Encode(e))},t.urlEncodedParser=q,t.urlEncodedByteSerializer=W,t.urlEncodedSerializer=function(e,t){var r,i;if("UTF-8"!==(void 0===t||"replacement"===t||"UTF-16BE"===t||"UTF-16LE"===t?"UTF-8":t).toUpperCase())throw new Error("Only UTF-8 encoding is supported.");var o="";try{for(var s=n(e),u=s.next();!u.done;u=s.next()){var l=u.value,c=W(a.utf8Encode(l[0])),h=l[1];h=W(a.utf8Encode(h)),""!==o&&(o+="&"),o+=c+"="+h}}catch(e){r={error:e}}finally{try{u&&!u.done&&(i=s.return)&&i.call(s)}finally{if(r)throw r.error}}return o},t.origin=function e(t){switch(t.scheme){case"blob":t._blobURLEntry;var r=A(t.path[0]);return null===r?s.OpaqueOrigin:e(r);case"ftp":case"http":case"https":case"ws":case"wss":return[t.scheme,null===t.host?"":t.host,t.port,null];case"file":default:return s.OpaqueOrigin}},t.domainToASCII=H,t.domainToUnicode=function(e,t){void 0===t&&(t=!1);var r=l.domainToUnicode(e);return""===r&&v("Invalid domain name."),r},t.asciiSerializationOfAnOrigin=function(e){if(""===e[0]&&""===e[1]&&null===e[2]&&null===e[3])return"null";var t=e[0]+"://"+D(e[1]);return null!==e[2]&&(t+=":"+e[2].toString()),t}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),i=function(){function e(){this._signal=n.create_abortSignal()}return Object.defineProperty(e.prototype,"signal",{get:function(){return this._signal},enumerable:!0,configurable:!0}),e.prototype.abort=function(){n.abort_signalAbort(this._signal)},e}();t.AbortControllerImpl=i},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(69),a=r(0),s=function(e){function t(){var t=e.call(this)||this;return t._abortedFlag=!1,t._abortAlgorithms=new Set,t}return i(t,e),Object.defineProperty(t.prototype,"aborted",{get:function(){return this._abortedFlag},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"onabort",{get:function(){return a.event_getterEventHandlerIDLAttribute(this,"onabort")},set:function(e){a.event_setterEventHandlerIDLAttribute(this,"onabort",e)},enumerable:!0,configurable:!0}),t._create=function(){return new t},t}(o.EventTargetImpl);t.AbortSignalImpl=s},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(2),a=r(34),s=r(12),u=function(e){function t(t,r,n){var i=e.call(this)||this;return i._name="",i._publicId="",i._systemId="",i._name=t,i._publicId=r,i._systemId=n,i}return i(t,e),Object.defineProperty(t.prototype,"name",{get:function(){return this._name},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"publicId",{get:function(){return this._publicId},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"systemId",{get:function(){return this._systemId},enumerable:!0,configurable:!0}),t.prototype.before=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ChildNode not implemented.")},t.prototype.after=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ChildNode not implemented.")},t.prototype.replaceWith=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];throw new Error("Mixin: ChildNode not implemented.")},t.prototype.remove=function(){throw new Error("Mixin: ChildNode not implemented.")},t._create=function(e,r,n,i){void 0===n&&(n=""),void 0===i&&(i="");var o=new t(r,n,i);return o._nodeDocument=e,o},t}(a.NodeImpl);t.DocumentTypeImpl=u,s.idl_defineConst(u.prototype,"_nodeType",o.NodeType.DocumentType)},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(99),a=r(1),s=r(0),u=function(e){function t(t,r){var n=e.call(this)||this;return n._host=t,n._mode=r,n}return i(t,e),Object.defineProperty(t.prototype,"mode",{get:function(){return this._mode},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"host",{get:function(){return this._host},enumerable:!0,configurable:!0}),t.prototype._getTheParent=function(e){return e._composedFlag||a.isEmpty(e._path)||s.tree_rootNode(e._path[0].invocationTarget)!==this?this._host:null},t._create=function(e,r){return new t(r,"closed")},t}(o.DocumentFragmentImpl);t.ShadowRootImpl=u},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(2),a=r(34),s=r(0),u=r(12),l=function(e){function t(t){var r=e.call(this)||this;return r._namespace=null,r._namespacePrefix=null,r._element=null,r._value="",r._localName=t,r}return i(t,e),Object.defineProperty(t.prototype,"ownerElement",{get:function(){return this._element},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"namespaceURI",{get:function(){return this._namespace},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"prefix",{get:function(){return this._namespacePrefix},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"localName",{get:function(){return this._localName},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"name",{get:function(){return this._qualifiedName},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"value",{get:function(){return this._value},set:function(e){s.attr_setAnExistingAttributeValue(this,e)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"_qualifiedName",{get:function(){return null!==this._namespacePrefix?this._namespacePrefix+":"+this._localName:this._localName},enumerable:!0,configurable:!0}),t._create=function(e,r){var n=new t(r);return n._nodeDocument=e,n},t}(a.NodeImpl);t.AttrImpl=l,u.idl_defineConst(l.prototype,"_nodeType",o.NodeType.Attribute),u.idl_defineConst(l.prototype,"specified",!0)},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(100),a=r(2),s=r(12),u=function(e){function t(t){return e.call(this,t)||this}return i(t,e),t._create=function(e,r){void 0===r&&(r="");var n=new t(r);return n._nodeDocument=e,n},t}(o.TextImpl);t.CDATASectionImpl=u,s.idl_defineConst(u.prototype,"_nodeType",a.NodeType.CData)},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(2),a=r(70),s=r(12),u=function(e){function t(t){return void 0===t&&(t=""),e.call(this,t)||this}return i(t,e),t._create=function(e,r){void 0===r&&(r="");var n=new t(r);return n._nodeDocument=e,n},t}(a.CharacterDataImpl);t.CommentImpl=u,s.idl_defineConst(u.prototype,"_nodeType",o.NodeType.Comment)},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(2),a=r(70),s=r(12),u=function(e){function t(t,r){var n=e.call(this,r)||this;return n._target=t,n}return i(t,e),Object.defineProperty(t.prototype,"target",{get:function(){return this._target},enumerable:!0,configurable:!0}),t._create=function(e,r,n){var i=new t(r,n);return i._nodeDocument=e,i},t}(a.CharacterDataImpl);t.ProcessingInstructionImpl=u,s.idl_defineConst(u.prototype,"_nodeType",o.NodeType.ProcessingInstruction)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(7),i=r(0),o=r(3),a=r(1),s=function(){function e(e,t){return this._live=!0,this._root=e,this._filter=t,new Proxy(this,this)}return Object.defineProperty(e.prototype,"length",{get:function(){for(var e=this,t=0,r=i.tree_getFirstDescendantNode(this._root,!1,!1,(function(t){return o.Guard.isElementNode(t)&&e._filter(t)}));null!==r;)t++,r=i.tree_getNextDescendantNode(this._root,r,!1,!1,(function(t){return o.Guard.isElementNode(t)&&e._filter(t)}));return t},enumerable:!0,configurable:!0}),e.prototype.item=function(e){for(var t=this,r=0,n=i.tree_getFirstDescendantNode(this._root,!1,!1,(function(e){return o.Guard.isElementNode(e)&&t._filter(e)}));null!==n;){if(r===e)return n;r++,n=i.tree_getNextDescendantNode(this._root,n,!1,!1,(function(e){return o.Guard.isElementNode(e)&&t._filter(e)}))}return null},e.prototype.namedItem=function(e){var t=this;if(""===e)return null;for(var r=i.tree_getFirstDescendantNode(this._root,!1,!1,(function(e){return o.Guard.isElementNode(e)&&t._filter(e)}));null!=r;){if(r._uniqueIdentifier===e)return r;if(r._namespace===n.namespace.HTML)for(var a=0;a<r._attributeList.length;a++){var s=r._attributeList[a];if("name"===s._localName&&null===s._namespace&&null===s._namespacePrefix&&s._value===e)return r}r=i.tree_getNextDescendantNode(this._root,r,!1,!1,(function(e){return o.Guard.isElementNode(e)&&t._filter(e)}))}return null},e.prototype[Symbol.iterator]=function(){var e=this._root,t=this._filter,r=i.tree_getFirstDescendantNode(e,!1,!1,(function(e){return o.Guard.isElementNode(e)&&t(e)}));return{next:function(){if(null===r)return{done:!0,value:null};var n={done:!1,value:r};return r=i.tree_getNextDescendantNode(e,r,!1,!1,(function(e){return o.Guard.isElementNode(e)&&t(e)})),n}}},e.prototype.get=function(t,r,n){if(!a.isString(r)||-1!==e.reservedNames.indexOf(r))return Reflect.get(t,r,n);var i=Number(r);return isNaN(i)?t.namedItem(r)||void 0:t.item(i)||void 0},e.prototype.set=function(t,r,n,o){if(!a.isString(r)||-1!==e.reservedNames.indexOf(r))return Reflect.set(t,r,n,o);var s=Number(r),u=isNaN(s)?t.namedItem(r)||void 0:t.item(s)||void 0;return!(!u||!u._parent)&&(i.mutation_replace(u,n,u._parent),!0)},e._create=function(t,r){return void 0===r&&(r=function(){return!0}),new e(t,r)},e.reservedNames=["_root","_live","_filter","length","item","namedItem","get","set"],e}();t.HTMLCollectionImpl=s},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(6),o=r(1),a=r(0),s=function(){function e(e){return this._live=!0,this._filter=null,this._length=0,this._root=e,new Proxy(this,this)}return Object.defineProperty(e.prototype,"length",{get:function(){return this._root._children.size},enumerable:!0,configurable:!0}),e.prototype.item=function(e){if(e<0||e>this.length-1)return null;if(e<this.length/2){for(var t=0,r=this._root._firstChild;null!==r&&t!==e;)r=r._nextSibling,t++;return r}for(t=this.length-1,r=this._root._lastChild;null!==r&&t!==e;)r=r._previousSibling,t--;return r},e.prototype.keys=function(){var e;return(e={})[Symbol.iterator]=function(){var e=0;return{next:function(){return e===this.length?{done:!0,value:null}:{done:!1,value:e++}}.bind(this)}}.bind(this),e},e.prototype.values=function(){var e;return(e={})[Symbol.iterator]=function(){var e=this[Symbol.iterator]();return{next:function(){return e.next()}}}.bind(this),e},e.prototype.entries=function(){var e;return(e={})[Symbol.iterator]=function(){var e=this[Symbol.iterator](),t=0;return{next:function(){var r=e.next();return r.done?{done:!0,value:null}:{done:!1,value:[t++,r.value]}}}}.bind(this),e},e.prototype[Symbol.iterator]=function(){return this._root._children[Symbol.iterator]()},e.prototype.forEach=function(e,t){var r,o;void 0===t&&(t=i.dom.window);var a=0;try{for(var s=n(this._root._children),u=s.next();!u.done;u=s.next()){var l=u.value;e.call(t,l,a++,this)}}catch(e){r={error:e}}finally{try{u&&!u.done&&(o=s.return)&&o.call(s)}finally{if(r)throw r.error}}},e.prototype.get=function(e,t,r){if(!o.isString(t))return Reflect.get(e,t,r);var n=Number(t);return isNaN(n)?Reflect.get(e,t,r):e.item(n)||void 0},e.prototype.set=function(e,t,r,n){if(!o.isString(t))return Reflect.set(e,t,r,n);var i=Number(t);if(isNaN(i))return Reflect.set(e,t,r,n);var s=e.item(i)||void 0;return!!s&&(!!s._parent&&(a.mutation_replace(s,r,s._parent),!0))},e._create=function(t){return new e(t)},e}();t.NodeListImpl=s},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(6),o=r(1),a=function(){function e(e){return this._live=!1,this._items=[],this._length=0,this._root=e,this._items=[],this._filter=function(e){return!0},new Proxy(this,this)}return Object.defineProperty(e.prototype,"length",{get:function(){return this._items.length},enumerable:!0,configurable:!0}),e.prototype.item=function(e){return e<0||e>this.length-1?null:this._items[e]},e.prototype.keys=function(){var e;return(e={})[Symbol.iterator]=function(){var e=0;return{next:function(){return e===this.length?{done:!0,value:null}:{done:!1,value:e++}}.bind(this)}}.bind(this),e},e.prototype.values=function(){var e;return(e={})[Symbol.iterator]=function(){var e=this[Symbol.iterator]();return{next:function(){return e.next()}}}.bind(this),e},e.prototype.entries=function(){var e;return(e={})[Symbol.iterator]=function(){var e=this[Symbol.iterator](),t=0;return{next:function(){var r=e.next();return r.done?{done:!0,value:null}:{done:!1,value:[t++,r.value]}}}}.bind(this),e},e.prototype[Symbol.iterator]=function(){var e=this._items[Symbol.iterator]();return{next:function(){return e.next()}}},e.prototype.forEach=function(e,t){var r,o;void 0===t&&(t=i.dom.window);var a=0;try{for(var s=n(this._items),u=s.next();!u.done;u=s.next()){var l=u.value;e.call(t,l,a++,this)}}catch(e){r={error:e}}finally{try{u&&!u.done&&(o=s.return)&&o.call(s)}finally{if(r)throw r.error}}},e.prototype.get=function(e,t,r){if(!o.isString(t))return Reflect.get(e,t,r);var n=Number(t);return isNaN(n)?Reflect.get(e,t,r):e._items[n]||void 0},e.prototype.set=function(e,t,r,n){if(!o.isString(t))return Reflect.set(e,t,r,n);var i=Number(t);return isNaN(i)?Reflect.set(e,t,r,n):i>=0&&i<e._items.length&&(e._items[i]=r,!0)},e._create=function(t,r){var n=new e(t);return n._items=r,n},e}();t.NodeListStaticImpl=a},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(9),a=r(0),s=function(e){function t(r){var n=e.call(this)||this;return n._element=r,Object.setPrototypeOf(n,t.prototype),n}return i(t,e),t.prototype._asArray=function(){return this},t.prototype.item=function(e){return this[e]||null},t.prototype.getNamedItem=function(e){return a.element_getAnAttributeByName(e,this._element)},t.prototype.getNamedItemNS=function(e,t){return a.element_getAnAttributeByNamespaceAndLocalName(e||"",t,this._element)},t.prototype.setNamedItem=function(e){return a.element_setAnAttribute(e,this._element)},t.prototype.setNamedItemNS=function(e){return a.element_setAnAttribute(e,this._element)},t.prototype.removeNamedItem=function(e){var t=a.element_removeAnAttributeByName(e,this._element);if(null===t)throw new o.NotFoundError;return t},t.prototype.removeNamedItemNS=function(e,t){var r=a.element_removeAnAttributeByNamespaceAndLocalName(e||"",t,this._element);if(null===r)throw new o.NotFoundError;return r},t._create=function(e){return new t(e)},t}(Array);t.NamedNodeMapImpl=s},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var a=r(6),s=r(2),u=r(101),l=r(9),c=r(0),h=r(12),p=r(3),f=function(e){function t(){var t=e.call(this)||this,r=a.dom.window._associatedDocument;return t._start=[r,0],t._end=[r,0],a.dom.rangeList.add(t),t}return i(t,e),Object.defineProperty(t.prototype,"commonAncestorContainer",{get:function(){for(var e=this._start[0];!c.tree_isAncestorOf(this._end[0],e,!0);){if(null===e._parent)throw new Error("Parent node  is null.");e=e._parent}return e},enumerable:!0,configurable:!0}),t.prototype.setStart=function(e,t){c.range_setTheStart(this,e,t)},t.prototype.setEnd=function(e,t){c.range_setTheEnd(this,e,t)},t.prototype.setStartBefore=function(e){var t=e._parent;if(null===t)throw new l.InvalidNodeTypeError;c.range_setTheStart(this,t,c.tree_index(e))},t.prototype.setStartAfter=function(e){var t=e._parent;if(null===t)throw new l.InvalidNodeTypeError;c.range_setTheStart(this,t,c.tree_index(e)+1)},t.prototype.setEndBefore=function(e){var t=e._parent;if(null===t)throw new l.InvalidNodeTypeError;c.range_setTheEnd(this,t,c.tree_index(e))},t.prototype.setEndAfter=function(e){var t=e._parent;if(null===t)throw new l.InvalidNodeTypeError;c.range_setTheEnd(this,t,c.tree_index(e)+1)},t.prototype.collapse=function(e){e?this._end=this._start:this._start=this._end},t.prototype.selectNode=function(e){c.range_select(e,this)},t.prototype.selectNodeContents=function(e){if(p.Guard.isDocumentTypeNode(e))throw new l.InvalidNodeTypeError;var t=c.tree_nodeLength(e);this._start=[e,0],this._end=[e,t]},t.prototype.compareBoundaryPoints=function(e,t){if(e!==s.HowToCompare.StartToStart&&e!==s.HowToCompare.StartToEnd&&e!==s.HowToCompare.EndToEnd&&e!==s.HowToCompare.EndToStart)throw new l.NotSupportedError;if(c.range_root(this)!==c.range_root(t))throw new l.WrongDocumentError;var r,n;switch(e){case s.HowToCompare.StartToStart:r=this._start,n=t._start;break;case s.HowToCompare.StartToEnd:r=this._end,n=t._start;break;case s.HowToCompare.EndToEnd:r=this._end,n=t._end;break;case s.HowToCompare.EndToStart:r=this._start,n=t._end;break;default:throw new l.NotSupportedError}var i=c.boundaryPoint_position(r,n);return i===s.BoundaryPosition.Before?-1:i===s.BoundaryPosition.After?1:0},t.prototype.deleteContents=function(){var e,t,r,n;if(!c.range_collapsed(this)){var i=this._startNode,a=this._startOffset,s=this._endNode,u=this._endOffset;if(i===s&&p.Guard.isCharacterDataNode(i))c.characterData_replaceData(i,a,u-a,"");else{var l,h,f=[];try{for(var d=o(c.range_getContainedNodes(this)),m=d.next();!m.done;m=d.next()){var y=(b=m.value)._parent;null!==y&&c.range_isContained(y,this)||f.push(b)}}catch(t){e={error:t}}finally{try{m&&!m.done&&(t=d.return)&&t.call(d)}finally{if(e)throw e.error}}if(c.tree_isAncestorOf(s,i,!0))l=i,h=a;else{for(var v=i;null!==v._parent&&!c.tree_isAncestorOf(s,v._parent,!0);)v=v._parent;if(null===v._parent)throw new Error("Parent node is null.");l=v._parent,h=c.tree_index(v)+1}p.Guard.isCharacterDataNode(i)&&c.characterData_replaceData(i,a,c.tree_nodeLength(i)-a,"");try{for(var _=o(f),g=_.next();!g.done;g=_.next()){var b;(b=g.value)._parent&&c.mutation_remove(b,b._parent)}}catch(e){r={error:e}}finally{try{g&&!g.done&&(n=_.return)&&n.call(_)}finally{if(r)throw r.error}}p.Guard.isCharacterDataNode(s)&&c.characterData_replaceData(s,0,u,""),this._start=[l,h],this._end=[l,h]}}},t.prototype.extractContents=function(){return c.range_extract(this)},t.prototype.cloneContents=function(){return c.range_cloneTheContents(this)},t.prototype.insertNode=function(e){return c.range_insert(e,this)},t.prototype.surroundContents=function(e){var t,r;try{for(var n=o(c.range_getPartiallyContainedNodes(this)),i=n.next();!i.done;i=n.next()){var a=i.value;if(!p.Guard.isTextNode(a))throw new l.InvalidStateError}}catch(e){t={error:e}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}if(p.Guard.isDocumentNode(e)||p.Guard.isDocumentTypeNode(e)||p.Guard.isDocumentFragmentNode(e))throw new l.InvalidNodeTypeError;var s=c.range_extract(this);0!==e._children.size&&c.mutation_replaceAll(null,e),c.range_insert(e,this),c.mutation_append(s,e),c.range_select(e,this)},t.prototype.cloneRange=function(){return c.create_range(this._start,this._end)},t.prototype.detach=function(){a.dom.rangeList.delete(this)},t.prototype.isPointInRange=function(e,t){if(c.tree_rootNode(e)!==c.range_root(this))return!1;if(p.Guard.isDocumentTypeNode(e))throw new l.InvalidNodeTypeError;if(t>c.tree_nodeLength(e))throw new l.IndexSizeError;var r=[e,t];return c.boundaryPoint_position(r,this._start)!==s.BoundaryPosition.Before&&c.boundaryPoint_position(r,this._end)!==s.BoundaryPosition.After},t.prototype.comparePoint=function(e,t){if(c.tree_rootNode(e)!==c.range_root(this))throw new l.WrongDocumentError;if(p.Guard.isDocumentTypeNode(e))throw new l.InvalidNodeTypeError;if(t>c.tree_nodeLength(e))throw new l.IndexSizeError;var r=[e,t];return c.boundaryPoint_position(r,this._start)===s.BoundaryPosition.Before?-1:c.boundaryPoint_position(r,this._end)===s.BoundaryPosition.After?1:0},t.prototype.intersectsNode=function(e){if(c.tree_rootNode(e)!==c.range_root(this))return!1;var t=e._parent;if(null===t)return!0;var r=c.tree_index(e);return c.boundaryPoint_position([t,r],this._end)===s.BoundaryPosition.Before&&c.boundaryPoint_position([t,r+1],this._start)===s.BoundaryPosition.After},t.prototype.toString=function(){var e,t,r="";if(this._startNode===this._endNode&&p.Guard.isTextNode(this._startNode))return this._startNode._data.substring(this._startOffset,this._endOffset);p.Guard.isTextNode(this._startNode)&&(r+=this._startNode._data.substring(this._startOffset));try{for(var n=o(c.range_getContainedNodes(this)),i=n.next();!i.done;i=n.next()){var a=i.value;p.Guard.isTextNode(a)&&(r+=a._data)}}catch(t){e={error:t}}finally{try{i&&!i.done&&(t=n.return)&&t.call(n)}finally{if(e)throw e.error}}return p.Guard.isTextNode(this._endNode)&&(r+=this._endNode._data.substring(0,this._endOffset)),r},t._create=function(e,r){var n=new t;return e&&(n._start=e),r&&(n._end=r),n},t.START_TO_START=0,t.START_TO_END=1,t.END_TO_END=2,t.END_TO_START=3,t}(u.AbstractRangeImpl);t.RangeImpl=f,h.idl_defineConst(f.prototype,"START_TO_START",0),h.idl_defineConst(f.prototype,"START_TO_END",1),h.idl_defineConst(f.prototype,"END_TO_END",2),h.idl_defineConst(f.prototype,"END_TO_START",3)},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(102),a=r(0),s=function(e){function t(t,r,n){var i=e.call(this,t)||this;return i._iteratorCollection=void 0,i._reference=r,i._pointerBeforeReference=n,a.nodeIterator_iteratorList().add(i),i}return i(t,e),Object.defineProperty(t.prototype,"referenceNode",{get:function(){return this._reference},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"pointerBeforeReferenceNode",{get:function(){return this._pointerBeforeReference},enumerable:!0,configurable:!0}),t.prototype.nextNode=function(){return a.nodeIterator_traverse(this,!0)},t.prototype.previousNode=function(){return a.nodeIterator_traverse(this,!1)},t.prototype.detach=function(){a.nodeIterator_iteratorList().delete(this)},t._create=function(e,r,n){return new t(e,r,n)},t}(o.TraverserImpl);t.NodeIteratorImpl=s},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(2),a=r(102),s=r(0),u=function(e){function t(t,r){var n=e.call(this,t)||this;return n._current=r,n}return i(t,e),Object.defineProperty(t.prototype,"currentNode",{get:function(){return this._current},set:function(e){this._current=e},enumerable:!0,configurable:!0}),t.prototype.parentNode=function(){for(var e=this._current;null!==e&&e!==this._root;)if(null!==(e=e._parent)&&s.traversal_filter(this,e)===o.FilterResult.Accept)return this._current=e,e;return null},t.prototype.firstChild=function(){return s.treeWalker_traverseChildren(this,!0)},t.prototype.lastChild=function(){return s.treeWalker_traverseChildren(this,!1)},t.prototype.nextSibling=function(){return s.treeWalker_traverseSiblings(this,!0)},t.prototype.previousNode=function(){for(var e=this._current;e!==this._root;){for(var t=e._previousSibling;t;){e=t;for(var r=s.traversal_filter(this,e);r!==o.FilterResult.Reject&&e._lastChild;)e=e._lastChild,r=s.traversal_filter(this,e);if(r===o.FilterResult.Accept)return this._current=e,e;t=e._previousSibling}if(e===this._root||null===e._parent)return null;if(e=e._parent,s.traversal_filter(this,e)===o.FilterResult.Accept)return this._current=e,e}return null},t.prototype.previousSibling=function(){return s.treeWalker_traverseSiblings(this,!1)},t.prototype.nextNode=function(){for(var e=this._current,t=o.FilterResult.Accept;;){for(;t!==o.FilterResult.Reject&&e._firstChild;)if(e=e._firstChild,(t=s.traversal_filter(this,e))===o.FilterResult.Accept)return this._current=e,e;for(var r=null,n=e;null!==n;){if(n===this._root)return null;if(null!==(r=n._nextSibling)){e=r;break}n=n._parent}if((t=s.traversal_filter(this,e))===o.FilterResult.Accept)return this._current=e,e}},t._create=function(e,r){return new t(e,r)},t}(a.TraverserImpl);t.TreeWalkerImpl=u},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2),i=r(12),o=function(){function e(){}return e.prototype.acceptNode=function(e){return n.FilterResult.Accept},e._create=function(){return new e},e.FILTER_ACCEPT=1,e.FILTER_REJECT=2,e.FILTER_SKIP=3,e.SHOW_ALL=4294967295,e.SHOW_ELEMENT=1,e.SHOW_ATTRIBUTE=2,e.SHOW_TEXT=4,e.SHOW_CDATA_SECTION=8,e.SHOW_ENTITY_REFERENCE=16,e.SHOW_ENTITY=32,e.SHOW_PROCESSING_INSTRUCTION=64,e.SHOW_COMMENT=128,e.SHOW_DOCUMENT=256,e.SHOW_DOCUMENT_TYPE=512,e.SHOW_DOCUMENT_FRAGMENT=1024,e.SHOW_NOTATION=2048,e}();t.NodeFilterImpl=o,i.idl_defineConst(o.prototype,"FILTER_ACCEPT",1),i.idl_defineConst(o.prototype,"FILTER_REJECT",2),i.idl_defineConst(o.prototype,"FILTER_SKIP",3),i.idl_defineConst(o.prototype,"SHOW_ALL",4294967295),i.idl_defineConst(o.prototype,"SHOW_ELEMENT",1),i.idl_defineConst(o.prototype,"SHOW_ATTRIBUTE",2),i.idl_defineConst(o.prototype,"SHOW_TEXT",4),i.idl_defineConst(o.prototype,"SHOW_CDATA_SECTION",8),i.idl_defineConst(o.prototype,"SHOW_ENTITY_REFERENCE",16),i.idl_defineConst(o.prototype,"SHOW_ENTITY",32),i.idl_defineConst(o.prototype,"SHOW_PROCESSING_INSTRUCTION",64),i.idl_defineConst(o.prototype,"SHOW_COMMENT",128),i.idl_defineConst(o.prototype,"SHOW_DOCUMENT",256),i.idl_defineConst(o.prototype,"SHOW_DOCUMENT_TYPE",512),i.idl_defineConst(o.prototype,"SHOW_DOCUMENT_FRAGMENT",1024),i.idl_defineConst(o.prototype,"SHOW_NOTATION",2048)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t,r,n,i,o,a,s,u){this._type=e,this._target=t,this._addedNodes=r,this._removedNodes=n,this._previousSibling=i,this._nextSibling=o,this._attributeName=a,this._attributeNamespace=s,this._oldValue=u}return Object.defineProperty(e.prototype,"type",{get:function(){return this._type},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"target",{get:function(){return this._target},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"addedNodes",{get:function(){return this._addedNodes},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"removedNodes",{get:function(){return this._removedNodes},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"previousSibling",{get:function(){return this._previousSibling},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"nextSibling",{get:function(){return this._nextSibling},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"attributeName",{get:function(){return this._attributeName},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"attributeNamespace",{get:function(){return this._attributeNamespace},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"oldValue",{get:function(){return this._oldValue},enumerable:!0,configurable:!0}),e._create=function(t,r,n,i,o,a,s,u,l){return new e(t,r,n,i,o,a,s,u,l)},e}();t.MutationRecordImpl=n},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(6),o=r(9),a=r(7),s=r(0),u=function(){function e(e,t){this._element=e,this._attribute=t,this._tokenSet=new Set;var r=t._localName,n=s.element_getAnAttributeValue(e,r),o=this;this._element._attributeChangeSteps.push((function(e,t,r,n,i){t===o._attribute._localName&&null===i&&(n?o._tokenSet=s.orderedSet_parse(n):o._tokenSet.clear())})),i.dom.features.steps&&s.dom_runAttributeChangeSteps(e,r,n,n,null)}return Object.defineProperty(e.prototype,"length",{get:function(){return this._tokenSet.size},enumerable:!0,configurable:!0}),e.prototype.item=function(e){var t,r,i=0;try{for(var o=n(this._tokenSet),a=o.next();!a.done;a=o.next()){var s=a.value;if(i===e)return s;i++}}catch(e){t={error:e}}finally{try{a&&!a.done&&(r=o.return)&&r.call(o)}finally{if(t)throw t.error}}return null},e.prototype.contains=function(e){return this._tokenSet.has(e)},e.prototype.add=function(){for(var e,t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];try{for(var u=n(r),l=u.next();!l.done;l=u.next()){var c=l.value;if(""===c)throw new o.SyntaxError("Cannot add an empty token.");if(a.codePoint.ASCIIWhiteSpace.test(c))throw new o.InvalidCharacterError("Token cannot contain whitespace.");this._tokenSet.add(c)}}catch(t){e={error:t}}finally{try{l&&!l.done&&(t=u.return)&&t.call(u)}finally{if(e)throw e.error}}s.tokenList_updateSteps(this)},e.prototype.remove=function(){for(var e,t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];try{for(var u=n(r),l=u.next();!l.done;l=u.next()){var c=l.value;if(""===c)throw new o.SyntaxError("Cannot remove an empty token.");if(a.codePoint.ASCIIWhiteSpace.test(c))throw new o.InvalidCharacterError("Token cannot contain whitespace.");this._tokenSet.delete(c)}}catch(t){e={error:t}}finally{try{l&&!l.done&&(t=u.return)&&t.call(u)}finally{if(e)throw e.error}}s.tokenList_updateSteps(this)},e.prototype.toggle=function(e,t){if(void 0===t&&(t=void 0),""===e)throw new o.SyntaxError("Cannot toggle an empty token.");if(a.codePoint.ASCIIWhiteSpace.test(e))throw new o.InvalidCharacterError("Token cannot contain whitespace.");return this._tokenSet.has(e)?void 0!==t&&!1!==t||(this._tokenSet.delete(e),s.tokenList_updateSteps(this),!1):(void 0===t||!0===t)&&(this._tokenSet.add(e),s.tokenList_updateSteps(this),!0)},e.prototype.replace=function(e,t){if(""===e||""===t)throw new o.SyntaxError("Cannot replace an empty token.");if(a.codePoint.ASCIIWhiteSpace.test(e)||a.codePoint.ASCIIWhiteSpace.test(t))throw new o.InvalidCharacterError("Token cannot contain whitespace.");return!!this._tokenSet.has(e)&&(a.set.replace(this._tokenSet,e,t),s.tokenList_updateSteps(this),!0)},e.prototype.supports=function(e){return s.tokenList_validationSteps(this,e)},Object.defineProperty(e.prototype,"value",{get:function(){return s.tokenList_serializeSteps(this)},set:function(e){s.element_setAnAttributeValue(this._element,this._attribute._localName,e)},enumerable:!0,configurable:!0}),e.prototype[Symbol.iterator]=function(){var e=this._tokenSet[Symbol.iterator]();return{next:function(){return e.next()}}},e._create=function(t,r){return new e(t,r)},e}();t.DOMTokenListImpl=u},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(103),a=r(0),s=function(e){function t(t,r){var n=e.call(this,t,r)||this;return n._detail=null,n._detail=r&&r.detail||null,n}return i(t,e),Object.defineProperty(t.prototype,"detail",{get:function(){return this._detail},enumerable:!0,configurable:!0}),t.prototype.initCustomEvent=function(e,t,r,n){void 0===t&&(t=!1),void 0===r&&(r=!1),void 0===n&&(n=null),this._dispatchFlag||(a.event_initialize(this,e,t,r),this._detail=n)},t}(o.EventImpl);t.CustomEventImpl=s},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(6),i=r(2),o=r(104),a=r(17);t.nodeIterator_traverse=function(e,t){for(var r=e._reference,n=e._pointerBeforeReference;;){if(t)if(n)n=!1;else{var s=a.tree_getFollowingNode(e._root,r);if(!s)return null;r=s}else if(n){var u=a.tree_getPrecedingNode(e.root,r);if(!u)return null;r=u}else n=!0;if(o.traversal_filter(e,r)===i.FilterResult.Accept)break}return e._reference=r,e._pointerBeforeReference=n,r},t.nodeIterator_iteratorList=function(){return n.dom.window._iteratorList}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(9),i=r(7),o=r(174);function a(e){if(!o.xml_isName(e))throw new n.InvalidCharacterError("Invalid XML name: "+e);if(!o.xml_isQName(e))throw new n.InvalidCharacterError("Invalid XML qualified name: "+e+".")}t.namespace_validate=a,t.namespace_validateAndExtract=function(e,t){e||(e=null),a(t);var r=t.split(":"),o=2===r.length?r[0]:null,s=2===r.length?r[1]:t;if(o&&null===e)throw new n.NamespaceError("Qualified name includes a prefix but the namespace is null.");if("xml"===o&&e!==i.namespace.XML)throw new n.NamespaceError('Qualified name includes the "xml" prefix but the namespace is not the XML namespace.');if(e!==i.namespace.XMLNS&&("xmlns"===o||"xmlns"===t))throw new n.NamespaceError('Qualified name includes the "xmlns" prefix but the namespace is not the XMLNS namespace.');if(e===i.namespace.XMLNS&&"xmlns"!==o&&"xmlns"!==t)throw new n.NamespaceError('Qualified name does not include the "xmlns" prefix but the namespace is the XMLNS namespace.');return[e,o,s]},t.namespace_extractQName=function(e){a(e);var t=e.split(":");return[2===t.length?t[0]:null,2===t.length?t[1]:e]}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.xml_isName=function(e){for(var t=0;t<e.length;t++){var r=e.charCodeAt(t);if(!(r>=97&&r<=122||r>=65&&r<=90||58===r||95===r||r>=192&&r<=214||r>=216&&r<=246||r>=248&&r<=767||r>=880&&r<=893||r>=895&&r<=8191||r>=8204&&r<=8205||r>=8304&&r<=8591||r>=11264&&r<=12271||r>=12289&&r<=55295||r>=63744&&r<=64975||r>=65008&&r<=65533)&&(0===t||!(45===r||46===r||r>=48&&r<=57||183===r||r>=768&&r<=879||r>=8255&&r<=8256))){if(r>=55296&&r<=56319&&t<e.length-1){var n=e.charCodeAt(t+1);if(n>=56320&&n<=57343&&(t++,(r=1024*(r-55296)+n-56320+65536)>=65536&&r<=983039))continue}return!1}}return!0},t.xml_isQName=function(e){for(var t=!1,r=0;r<e.length;r++){var n=e.charCodeAt(r);if(!(n>=97&&n<=122||n>=65&&n<=90||95===n||n>=192&&n<=214||n>=216&&n<=246||n>=248&&n<=767||n>=880&&n<=893||n>=895&&n<=8191||n>=8204&&n<=8205||n>=8304&&n<=8591||n>=11264&&n<=12271||n>=12289&&n<=55295||n>=63744&&n<=64975||n>=65008&&n<=65533)&&(0===r||!(45===n||46===n||n>=48&&n<=57||183===n||n>=768&&n<=879||n>=8255&&n<=8256))){if(0===r||58!==n){if(n>=55296&&n<=56319&&r<e.length-1){var i=e.charCodeAt(r+1);if(i>=56320&&i<=57343&&(r++,(n=1024*(n-55296)+i-56320+65536)>=65536&&n<=983039))continue}return!1}if(t)return!1;if(r===e.length-1)return!1;t=!0}}return!0},t.xml_isLegalChar=function(e){for(var t=0;t<e.length;t++){var r=e.charCodeAt(t);if(!(9===r||10===r||13===r||r>=32&&r<=55295||r>=57344&&r<=65533)){if(r>=55296&&r<=56319&&t<e.length-1){var n=e.charCodeAt(t+1);if(n>=56320&&n<=57343&&(t++,(r=1024*(r-55296)+n-56320+65536)>=65536&&r<=1114111))continue}return!1}}return!0},t.xml_isPubidChar=function(e){for(var t=0;t<e.length;t++){var r=e.charCodeAt(t);if(!(r>=97&&r<=122||r>=65&&r<=90||r>=39&&r<=59||32===r||13===r||10===r||r>=35&&r<=37||33===r||61===r||63===r||64===r||95===r))return!1}return!0}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2),i=r(17);t.boundaryPoint_position=function e(t,r){var o=t[0],a=t[1],s=r[0],u=r[1];if(console.assert(i.tree_rootNode(o)===i.tree_rootNode(s),"Boundary points must share the same root node."),o===s)return a===u?n.BoundaryPosition.Equal:a<u?n.BoundaryPosition.Before:n.BoundaryPosition.After;if(i.tree_isFollowing(s,o)){var l=e([s,u],[o,a]);if(l===n.BoundaryPosition.Before)return n.BoundaryPosition.After;if(l===n.BoundaryPosition.After)return n.BoundaryPosition.Before}if(i.tree_isAncestorOf(s,o)){for(var c=s;!i.tree_isChildOf(o,c);)null!==c._parent&&(c=c._parent);if(i.tree_index(c)<a)return n.BoundaryPosition.After}return n.BoundaryPosition.Before}},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(6),o=r(3),a=r(7),s=r(29),u=r(107),l=r(30),c=r(37),h=r(52);t.node_stringReplaceAll=function(e,t){var r=null;""!==e&&(r=s.create_text(t._nodeDocument,e)),c.mutation_replaceAll(r,t)},t.node_clone=function e(t,r,a){var u,p,f,d,m;if(void 0===r&&(r=null),void 0===a&&(a=!1),null===r&&(r=t._nodeDocument),o.Guard.isElementNode(t)){m=h.element_createAnElement(r,t._localName,t._namespace,t._namespacePrefix,t._is,!1);try{for(var y=n(t._attributeList),v=y.next();!v.done;v=y.next()){var _=e(v.value,r);h.element_append(_,m)}}catch(e){u={error:e}}finally{try{v&&!v.done&&(p=y.return)&&p.call(y)}finally{if(u)throw u.error}}}else if(o.Guard.isDocumentNode(t)){var g=s.create_document();g._encoding=t._encoding,g._contentType=t._contentType,g._URL=t._URL,g._origin=t._origin,g._type=t._type,g._mode=t._mode,m=g}else if(o.Guard.isDocumentTypeNode(t)){m=s.create_documentType(r,t._name,t._publicId,t._systemId)}else if(o.Guard.isAttrNode(t)){var b=s.create_attr(r,t.localName);b._namespace=t._namespace,b._namespacePrefix=t._namespacePrefix,b._value=t._value,m=b}else m=o.Guard.isExclusiveTextNode(t)?s.create_text(r,t._data):o.Guard.isCDATASectionNode(t)?s.create_cdataSection(r,t._data):o.Guard.isCommentNode(t)?s.create_comment(r,t._data):o.Guard.isProcessingInstructionNode(t)?s.create_processingInstruction(r,t._target,t._data):o.Guard.isDocumentFragmentNode(t)?s.create_documentFragment(r):Object.create(t);if(o.Guard.isDocumentNode(m)?(m._nodeDocument=m,r=m):m._nodeDocument=r,i.dom.features.steps&&l.dom_runCloningSteps(m,t,r,a),a)try{for(var x=n(t._children),w=x.next();!w.done;w=x.next()){var E=e(w.value,r,!0);c.mutation_append(E,m)}}catch(e){f={error:e}}finally{try{w&&!w.done&&(d=x.return)&&d.call(x)}finally{if(f)throw f.error}}return m},t.node_equals=function e(t,r){var i,a,s,u;if(t._nodeType!==r._nodeType)return!1;if(o.Guard.isDocumentTypeNode(t)&&o.Guard.isDocumentTypeNode(r)){if(t._name!==r._name||t._publicId!==r._publicId||t._systemId!==r._systemId)return!1}else if(o.Guard.isElementNode(t)&&o.Guard.isElementNode(r)){if(t._namespace!==r._namespace||t._namespacePrefix!==r._namespacePrefix||t._localName!==r._localName||t._attributeList.length!==r._attributeList.length)return!1}else if(o.Guard.isAttrNode(t)&&o.Guard.isAttrNode(r)){if(t._namespace!==r._namespace||t._localName!==r._localName||t._value!==r._value)return!1}else if(o.Guard.isProcessingInstructionNode(t)&&o.Guard.isProcessingInstructionNode(r)){if(t._target!==r._target||t._data!==r._data)return!1}else if(o.Guard.isCharacterDataNode(t)&&o.Guard.isCharacterDataNode(r)&&t._data!==r._data)return!1;if(o.Guard.isElementNode(t)&&o.Guard.isElementNode(r)){var l={};try{for(var c=n(t._attributeList),h=c.next();!h.done;h=c.next()){l[(d=h.value)._localName]=d}}catch(e){i={error:e}}finally{try{h&&!h.done&&(a=c.return)&&a.call(c)}finally{if(i)throw i.error}}try{for(var p=n(r._attributeList),f=p.next();!f.done;f=p.next()){var d,m=f.value;if(!(d=l[m._localName]))return!1;if(!e(d,m))return!1}}catch(e){s={error:e}}finally{try{f&&!f.done&&(u=p.return)&&u.call(p)}finally{if(s)throw s.error}}}if(t._children.size!==r._children.size)return!1;for(var y=t._children[Symbol.iterator](),v=r._children[Symbol.iterator](),_=y.next(),g=v.next();!_.done&&!g.done;){if(!e(_.value,g.value))return!1;_=y.next(),g=v.next()}return!0},t.node_listOfElementsWithQualifiedName=function(e,t){return"*"===e?s.create_htmlCollection(t):"html"===t._nodeDocument._type?s.create_htmlCollection(t,(function(t){return t._namespace===a.namespace.HTML&&t._qualifiedName===e.toLowerCase()||t._namespace!==a.namespace.HTML&&t._qualifiedName===e})):s.create_htmlCollection(t,(function(t){return t._qualifiedName===e}))},t.node_listOfElementsWithNamespace=function(e,t,r){return""===e&&(e=null),"*"===e&&"*"===t?s.create_htmlCollection(r):"*"===e?s.create_htmlCollection(r,(function(e){return e._localName===t})):"*"===t?s.create_htmlCollection(r,(function(t){return t._namespace===e})):s.create_htmlCollection(r,(function(r){return r._localName===t&&r._namespace===e}))},t.node_listOfElementsWithClassNames=function(e,t){var r=u.orderedSet_parse(e);if(0===r.size)return s.create_htmlCollection(t,(function(){return!1}));var n="quirks"!==t._nodeDocument._mode;return s.create_htmlCollection(t,(function(e){var t=e.classList;return u.orderedSet_contains(t._tokenSet,r,n)}))},t.node_locateANamespacePrefix=function e(t,r){if(t._namespace===r&&null!==t._namespacePrefix)return t._namespacePrefix;for(var n=0;n<t._attributeList.length;n++){var i=t._attributeList[n];if("xmlns"===i._namespacePrefix&&i._value===r)return i._localName}return t._parent&&o.Guard.isElementNode(t._parent)?e(t._parent,r):null},t.node_locateANamespace=function e(t,r){if(o.Guard.isElementNode(t)){if(null!==t._namespace&&t._namespacePrefix===r)return t._namespace;for(var n=0;n<t._attributeList.length;n++){var i=t._attributeList[n];if(i._namespace===a.namespace.XMLNS&&"xmlns"===i._namespacePrefix&&i._localName===r)return i._value||null;if(null===r&&i._namespace===a.namespace.XMLNS&&null===i._namespacePrefix&&"xmlns"===i._localName)return i._value||null}return null===t.parentElement?null:e(t.parentElement,r)}return o.Guard.isDocumentNode(t)?null===t.documentElement?null:e(t.documentElement,r):o.Guard.isDocumentTypeNode(t)||o.Guard.isDocumentFragmentNode(t)?null:o.Guard.isAttrNode(t)?null===t._element?null:e(t._element,r):t._parent&&o.Guard.isElementNode(t._parent)?e(t._parent,r):null}},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(6),o=r(3),a=r(9),s=r(29),u=r(17),l=r(106),c=r(37);t.text_contiguousTextNodes=function(e,t){var r;return void 0===t&&(t=!1),(r={})[Symbol.iterator]=function(){for(var r=e;r&&o.Guard.isTextNode(r._previousSibling);)r=r._previousSibling;return{next:function(){if(r&&!t&&r===e&&(r=o.Guard.isTextNode(r._nextSibling)?r._nextSibling:null),null===r)return{done:!0,value:null};var n={done:!1,value:r};return r=o.Guard.isTextNode(r._nextSibling)?r._nextSibling:null,n}}},r},t.text_contiguousExclusiveTextNodes=function(e,t){var r;return void 0===t&&(t=!1),(r={})[Symbol.iterator]=function(){for(var r=e;r&&o.Guard.isExclusiveTextNode(r._previousSibling);)r=r._previousSibling;return{next:function(){if(r&&!t&&r===e&&(r=o.Guard.isExclusiveTextNode(r._nextSibling)?r._nextSibling:null),null===r)return{done:!0,value:null};var n={done:!1,value:r};return r=o.Guard.isExclusiveTextNode(r._nextSibling)?r._nextSibling:null,n}}},r},t.text_descendantTextContent=function(e){for(var t="",r=u.tree_getFirstDescendantNode(e,!1,!1,(function(e){return o.Guard.isTextNode(e)}));null!==r;)t+=r._data,r=u.tree_getNextDescendantNode(e,r,!1,!1,(function(e){return o.Guard.isTextNode(e)}));return t},t.text_split=function(e,t){var r,o,h=e._data.length;if(t>h)throw new a.IndexSizeError;var p=h-t,f=l.characterData_substringData(e,t,p),d=s.create_text(e._nodeDocument,f),m=e._parent;if(null!==m){c.mutation_insert(d,m,e._nextSibling);try{for(var y=n(i.dom.rangeList),v=y.next();!v.done;v=y.next()){var _=v.value;_._start[0]===e&&_._start[1]>t&&(_._start[0]=d,_._start[1]-=t),_._end[0]===e&&_._end[1]>t&&(_._end[0]=d,_._end[1]-=t);var g=u.tree_index(e);_._start[0]===m&&_._start[1]===g+1&&_._start[1]++,_._end[0]===m&&_._end[1]===g+1&&_._end[1]++}}catch(e){r={error:e}}finally{try{v&&!v.done&&(o=y.return)&&o.call(y)}finally{if(r)throw r.error}}}return l.characterData_replaceData(e,t,p,""),d}},function(e,t,r){"use strict";var n=r(4),i=r(41),o=r(24),a=r(48),s=[].join,u=i!=Object,l=a("join",",");n({target:"Array",proto:!0,forced:u||!l},{join:function(e){return s.call(o(this),void 0===e?",":e)}})},function(e,t,r){"use strict";var n=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a};Object.defineProperty(t,"__esModule",{value:!0});var i=r(110),o=function(){function e(e,t){this._options={skipWhitespaceOnlyText:!1},this.err={line:-1,col:-1,index:-1,str:""},this._str=e,this._index=0,this._length=e.length,t&&(this._options.skipWhitespaceOnlyText=t.skipWhitespaceOnlyText||!1)}return e.prototype.nextToken=function(){if(this.eof())return{type:i.TokenType.EOF};var t=this.skipIfStartsWith("<")?this.openBracket():this.text();return this._options.skipWhitespaceOnlyText&&t.type===i.TokenType.Text&&e.isWhiteSpaceToken(t)&&(t=this.nextToken()),t},e.prototype.openBracket=function(){return this.skipIfStartsWith("?")?this.skipIfStartsWith("xml")?e.isSpace(this._str[this._index])?this.declaration():(this.seek(-3),this.pi()):this.pi():this.skipIfStartsWith("!")?this.skipIfStartsWith("--")?this.comment():this.skipIfStartsWith("[CDATA[")?this.cdata():this.skipIfStartsWith("DOCTYPE")?this.doctype():void this.throwError("Invalid '!' in opening tag."):this.skipIfStartsWith("/")?this.closeTag():this.openTag()},e.prototype.declaration=function(){for(var e="",t="",r="";!this.eof();){if(this.skipSpace(),this.skipIfStartsWith("?>"))return{type:i.TokenType.Declaration,version:e,encoding:t,standalone:r};var o=n(this.attribute(),2),a=o[0],s=o[1];"version"===a?e=s:"encoding"===a?t=s:"standalone"===a?r=s:this.throwError("Invalid attribute name: "+a)}this.throwError("Missing declaration end symbol `?>`")},e.prototype.doctype=function(){var e="",t="";this.skipSpace();var r=this.takeUntil2("[",">",!0);return this.skipSpace(),this.skipIfStartsWith("PUBLIC")?(e=this.quotedString(),t=this.quotedString()):this.skipIfStartsWith("SYSTEM")&&(t=this.quotedString()),this.skipSpace(),this.skipIfStartsWith("[")&&(this.skipUntil("]"),this.skipIfStartsWith("]")||this.throwError("Missing end bracket of DTD internal subset")),this.skipSpace(),this.skipIfStartsWith(">")||this.throwError("Missing doctype end symbol `>`"),{type:i.TokenType.DocType,name:r,pubId:e,sysId:t}},e.prototype.pi=function(){var e=this.takeUntilStartsWith("?>",!0);if(this.eof()&&this.throwError("Missing processing instruction end symbol `?>`"),this.skipSpace(),this.skipIfStartsWith("?>"))return{type:i.TokenType.PI,target:e,data:""};var t=this.takeUntilStartsWith("?>");return this.eof()&&this.throwError("Missing processing instruction end symbol `?>`"),this.seek(2),{type:i.TokenType.PI,target:e,data:t}},e.prototype.text=function(){var e=this.takeUntil("<");return{type:i.TokenType.Text,data:e}},e.prototype.comment=function(){var e=this.takeUntilStartsWith("--\x3e");return this.eof()&&this.throwError("Missing comment end symbol `--\x3e`"),this.seek(3),{type:i.TokenType.Comment,data:e}},e.prototype.cdata=function(){var e=this.takeUntilStartsWith("]]>");return this.eof()&&this.throwError("Missing CDATA end symbol `]>`"),this.seek(3),{type:i.TokenType.CDATA,data:e}},e.prototype.openTag=function(){this.skipSpace();var e=this.takeUntil2(">","/",!0);if(this.skipSpace(),this.skipIfStartsWith(">"))return{type:i.TokenType.Element,name:e,attributes:[],selfClosing:!1};if(this.skipIfStartsWith("/>"))return{type:i.TokenType.Element,name:e,attributes:[],selfClosing:!0};for(var t=[];!this.eof();){if(this.skipSpace(),this.skipIfStartsWith(">"))return{type:i.TokenType.Element,name:e,attributes:t,selfClosing:!1};if(this.skipIfStartsWith("/>"))return{type:i.TokenType.Element,name:e,attributes:t,selfClosing:!0};var r=this.attribute();t.push(r)}this.throwError("Missing opening element tag end symbol `>`")},e.prototype.closeTag=function(){this.skipSpace();var e=this.takeUntil(">",!0);return this.skipSpace(),this.skipIfStartsWith(">")||this.throwError("Missing closing element tag end symbol `>`"),{type:i.TokenType.ClosingTag,name:e}},e.prototype.attribute=function(){this.skipSpace();var e=this.takeUntil("=",!0);return this.skipSpace(),this.skipIfStartsWith("=")||this.throwError("Missing equals sign before attribute value"),[e,this.quotedString()]},e.prototype.quotedString=function(){this.skipSpace();var t=this.take(1);e.isQuote(t)||this.throwError("Missing start quote character before quoted value");var r=this.takeUntil(t);return this.skipIfStartsWith(t)||this.throwError("Missing end quote character after quoted value"),r},e.prototype.eof=function(){return this._index>=this._length},e.prototype.skipIfStartsWith=function(e){var t=e.length;if(1===t)return this._str[this._index]===e&&(this._index++,!0);for(var r=0;r<t;r++)if(this._str[this._index+r]!==e[r])return!1;return this._index+=t,!0},e.prototype.seek=function(e){this._index+=e,this._index<0&&(this._index=0),this._index>this._length&&(this._index=this._length)},e.prototype.skipSpace=function(){for(;!this.eof()&&e.isSpace(this._str[this._index]);)this._index++},e.prototype.take=function(e){if(1===e)return this._str[this._index++];var t=this._index;return this.seek(e),this._str.slice(t,this._index)},e.prototype.takeUntil=function(t,r){void 0===r&&(r=!1);for(var n=this._index;this._index<this._length;){var i=this._str[this._index];if(i===t||r&&e.isSpace(i))break;this._index++}return this._str.slice(n,this._index)},e.prototype.takeUntil2=function(t,r,n){void 0===n&&(n=!1);for(var i=this._index;this._index<this._length;){var o=this._str[this._index];if(o===t||o===r||n&&e.isSpace(o))break;this._index++}return this._str.slice(i,this._index)},e.prototype.takeUntilStartsWith=function(t,r){void 0===r&&(r=!1);for(var n=this._index,i=t.length;this._index<this._length;){for(var o=!0,a=0;a<i;a++){var s=this._str[this._index+a],u=t[a];if(r&&e.isSpace(s))return this._str.slice(n,this._index);if(s!==u){this._index++,o=!1;break}}if(o)return this._str.slice(n,this._index)}return this._index=this._length,this._str.slice(n)},e.prototype.skipUntil=function(e){for(;this._index<this._length;){if(this._str[this._index]===e)break;this._index++}},e.isWhiteSpaceToken=function(e){for(var t=e.data,r=0;r<t.length;r++){var n=t[r];if(" "!==n&&"\n"!==n&&"\r"!==n&&"\t"!==n&&"\f"!==n)return!1}return!0},e.isSpace=function(e){return" "===e||"\n"===e||"\r"===e||"\t"===e},e.isQuote=function(e){return'"'===e||"'"===e},e.prototype.throwError=function(e){for(var t=/\r\n|\r|\n/g,r=null,n=0,i=0,o=this._str.length;null!==(r=t.exec(this._str))&&null!==r;)if(n++,r.index<this._index&&(i=t.lastIndex),r.index>this._index){o=r.index;break}throw this.err={line:n,col:this._index-i,index:this._index,str:this._str.substring(i,o)},new Error(e+"\nIndex: "+this.err.index+"\nLn: "+this.err.line+", Col: "+this.err.col+"\nInput: "+this.err.str)},e.prototype[Symbol.iterator]=function(){return this._index=0,{next:function(){var e=this.nextToken();return e.type===i.TokenType.EOF?{done:!0,value:null}:{done:!1,value:e}}.bind(this)}},e}();t.XMLStringLexer=o},function(e,t,r){"use strict";var n=r(39);e.exports=new n({include:[r(181)]})},function(e,t,r){"use strict";var n=r(39);e.exports=new n({include:[r(112)],implicit:[r(289),r(290),r(291),r(292)]})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(90),i=r(1),o=r(3),a=r(76),s=r(108);function u(e,t){var r=c(void 0===e||l(e)?e:n.DefaultBuilderOptions),i=l(e)?t:e,o=s.createDocument();h(o,r);var u=new a.XMLBuilderImpl(o);return void 0!==i&&u.ele(i),u}function l(e){if(!i.isPlainObject(e))return!1;for(var t in e)if(e.hasOwnProperty(t)&&!n.XMLBuilderOptionKeys.has(t))return!1;return!0}function c(e){void 0===e&&(e={});var t=i.applyDefaults(e,n.DefaultBuilderOptions);if(0===t.convert.att.length||0===t.convert.ins.length||0===t.convert.text.length||0===t.convert.cdata.length||0===t.convert.comment.length)throw new Error("JS object converter strings cannot be zero length.");return t}function h(e,t,r){var n=e;n._xmlBuilderOptions=t,n._isFragment=r}t.builder=function(e,t){var r=c(l(e)?e:n.DefaultBuilderOptions),s=o.Guard.isNode(e)||i.isArray(e)?e:t;if(void 0===s)throw new Error("Invalid arguments.");if(i.isArray(s)){for(var u=[],h=0;h<s.length;h++){var p=new a.XMLBuilderImpl(s[h]);p.set(r),u.push(p)}return u}var f=new a.XMLBuilderImpl(s);return f.set(r),f},t.create=u,t.fragment=function(e,t){var r=c(void 0===e||l(e)?e:n.DefaultBuilderOptions),i=l(e)?t:e,o=s.createDocument();h(o,r,!0);var u=new a.XMLBuilderImpl(o.createDocumentFragment());return void 0!==i&&u.ele(i),u},t.convert=function(e,t,r){var i,o,a;return l(e)&&void 0!==t?(i=e,o=t,a=r):(i=n.DefaultBuilderOptions,o=e,a=t||void 0),u(i,o).end(a)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(76);t.builder=n.builder,t.create=n.create,t.fragment=n.fragment,t.convert=n.convert,t.createCB=n.createCB,t.fragmentCB=n.fragmentCB},function(e,t,r){"use strict";r(31),r(32),r(33),r(190),r(191),r(193),r(64),r(19),r(197),r(198),r(88),r(200),r(65),r(20),r(66),r(22),r(23);var n=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},i=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var o=r(90),a=r(1),s=r(216),u=r(2),l=r(3),c=r(0),h=r(108),p=r(7),f=r(276),d=function(){function e(e){this._domNode=e}return Object.defineProperty(e.prototype,"node",{get:function(){return this._domNode},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"options",{get:function(){return this._options},enumerable:!0,configurable:!0}),e.prototype.set=function(e){return this._options=a.applyDefaults(a.applyDefaults(this._options,e,!0),o.DefaultBuilderOptions),this},e.prototype.ele=function(t,r,i){var o,s,u,l,p,d;if(a.isObject(t))return new f.ObjectReader(this._options).parse(this,t);if(null!==t&&/^\s*</.test(t))return new f.XMLReader(this._options).parse(this,t);if(null!==t&&/^\s*[\{\[]/.test(t))return new f.JSONReader(this._options).parse(this,t);if(null!==t&&/^(\s*|(#.*)|(%.*))*---/.test(t))return new f.YAMLReader(this._options).parse(this,t);if((null===t||a.isString(t))&&a.isString(r))l=(o=n([t,r,i],3))[0],p=o[1],d=o[2];else{if(null===t)throw new Error("Element name cannot be null. "+this._debugInfo());l=(s=n([void 0,t,a.isObject(r)?r:void 0],3))[0],p=s[1],d=s[2]}if(d&&(d=a.getValue(d)),l=(u=n(this._extractNamespace(h.sanitizeInput(l,this._options.invalidCharReplacement),h.sanitizeInput(p,this._options.invalidCharReplacement),!0),2))[0],p=u[1],void 0===l){var m=n(c.namespace_extractQName(p),1)[0];l=this.node.lookupNamespaceURI(m)}var y=null!=l?this._doc.createElementNS(l,p):this._doc.createElement(p);this.node.appendChild(y);var v=new e(y),_=this._doc.doctype;if(y===this._doc.documentElement&&null!==_){var g=this._doc.implementation.createDocumentType(this._doc.documentElement.tagName,_.publicId,_.systemId);this._doc.replaceChild(g,_)}return d&&!a.isEmpty(d)&&v.att(d),v},e.prototype.remove=function(){var e=this.up();return e.node.removeChild(this.node),e},e.prototype.att=function(e,t,r){var i,o,s,u,f,d,m=this;if(a.isMap(e)||a.isObject(e))return a.forEachObject(e,(function(e,t){return m.att(e,t)}),this),this;if(null!=e&&(e=a.getValue(e+"")),null!=t&&(t=a.getValue(t+"")),null!=r&&(r=a.getValue(r+"")),null!==e&&!a.isString(e)||!a.isString(t)||null!==r&&!a.isString(r)){if(!a.isString(e)||null!=t&&!a.isString(t))throw new Error("Attribute name and value not specified. "+this._debugInfo());u=(o=n([void 0,e,t],3))[0],f=o[1],d=o[2]}else u=(i=n([e,t,r],3))[0],f=i[1],d=i[2];if(this._options.keepNullAttributes&&null==d)d="";else if(null==d)return this;if(!l.Guard.isElementNode(this.node))throw new Error("An attribute can only be assigned to an element node.");var y=this.node;u=(s=n(this._extractNamespace(u,f,!1),2))[0],f=s[1],f=h.sanitizeInput(f,this._options.invalidCharReplacement),u=h.sanitizeInput(u,this._options.invalidCharReplacement),d=h.sanitizeInput(d,this._options.invalidCharReplacement);var v=n(c.namespace_extractQName(f),2),_=v[0],g=v[1],b=n(c.namespace_extractQName(y.prefix?y.prefix+":"+y.localName:y.localName),1)[0],x=null;return"xmlns"===_?(u=p.namespace.XMLNS,null===y.namespaceURI&&b===g&&(x=d)):null===_&&"xmlns"===g&&null===b&&(u=p.namespace.XMLNS,x=d),null!==x&&(this._updateNamespace(x),y=this.node),void 0!==u?y.setAttributeNS(u,f,d):y.setAttribute(f,d),this},e.prototype.removeAtt=function(e,t){var r,n,i=this;if(!l.Guard.isElementNode(this.node))throw new Error("An attribute can only be removed from an element node.");if(e=a.getValue(e),void 0!==t&&(t=a.getValue(t)),null!==e&&void 0===t)n=e;else{if(null!==e&&!a.isString(e)||void 0===t)throw new Error("Attribute namespace must be a string. "+this._debugInfo());r=e,n=t}return a.isArray(n)||a.isSet(n)?a.forEachArray(n,(function(e){return void 0===r?i.removeAtt(e):i.removeAtt(r,e)}),this):void 0!==r?(n=h.sanitizeInput(n,this._options.invalidCharReplacement),r=h.sanitizeInput(r,this._options.invalidCharReplacement),this.node.removeAttributeNS(r,n)):(n=h.sanitizeInput(n,this._options.invalidCharReplacement),this.node.removeAttribute(n)),this},e.prototype.txt=function(e){if(null==e){if(!this._options.keepNullNodes)return this;e=""}var t=this._doc.createTextNode(h.sanitizeInput(e,this._options.invalidCharReplacement));return this.node.appendChild(t),this},e.prototype.com=function(e){if(null==e){if(!this._options.keepNullNodes)return this;e=""}var t=this._doc.createComment(h.sanitizeInput(e,this._options.invalidCharReplacement));return this.node.appendChild(t),this},e.prototype.dat=function(e){if(null==e){if(!this._options.keepNullNodes)return this;e=""}var t=this._doc.createCDATASection(h.sanitizeInput(e,this._options.invalidCharReplacement));return this.node.appendChild(t),this},e.prototype.ins=function(e,t){var r=this;if(void 0===t&&(t=""),null==t){if(!this._options.keepNullNodes)return this;t=""}if(a.isArray(e)||a.isSet(e))a.forEachArray(e,(function(e){var t=(e+="").indexOf(" "),n=-1===t?e:e.substr(0,t),i=-1===t?"":e.substr(t+1);r.ins(n,i)}),this);else if(a.isMap(e)||a.isObject(e))a.forEachObject(e,(function(e,t){return r.ins(e,t)}),this);else{var n=this._doc.createProcessingInstruction(h.sanitizeInput(e,this._options.invalidCharReplacement),h.sanitizeInput(t,this._options.invalidCharReplacement));this.node.appendChild(n)}return this},e.prototype.dec=function(e){return this._options.version=e.version||"1.0",this._options.encoding=e.encoding,this._options.standalone=e.standalone,this},e.prototype.dtd=function(e){var t=h.sanitizeInput(e&&e.name||(this._doc.documentElement?this._doc.documentElement.tagName:"ROOT"),this._options.invalidCharReplacement),r=h.sanitizeInput(e&&e.pubID||"",this._options.invalidCharReplacement),n=h.sanitizeInput(e&&e.sysID||"",this._options.invalidCharReplacement);if(null!==this._doc.documentElement&&t!==this._doc.documentElement.tagName)throw new Error("DocType name does not match document element name.");var i=this._doc.implementation.createDocumentType(t,r,n);return null!==this._doc.doctype?this._doc.replaceChild(i,this._doc.doctype):this._doc.insertBefore(i,this._doc.documentElement),this},e.prototype.import=function(t){var r,o,a=this._domNode,s=this._doc,u=t.node;if(l.Guard.isDocumentNode(u)){var h=u.documentElement;if(null===h)throw new Error("Imported document has no document element node. "+this._debugInfo());var p=s.importNode(h,!0);a.appendChild(p);var f=n(c.namespace_extractQName(p.prefix?p.prefix+":"+p.localName:p.localName),1)[0],d=a.lookupNamespaceURI(f);new e(p)._updateNamespace(d)}else if(l.Guard.isDocumentFragmentNode(u))try{for(var m=i(u.childNodes),y=m.next();!y.done;y=m.next()){var v=y.value;p=s.importNode(v,!0);if(a.appendChild(p),l.Guard.isElementNode(p)){f=n(c.namespace_extractQName(p.prefix?p.prefix+":"+p.localName:p.localName),1)[0],d=a.lookupNamespaceURI(f);new e(p)._updateNamespace(d)}}}catch(e){r={error:e}}finally{try{y&&!y.done&&(o=m.return)&&o.call(m)}finally{if(r)throw r.error}}else{p=s.importNode(u,!0);if(a.appendChild(p),l.Guard.isElementNode(p)){f=n(c.namespace_extractQName(p.prefix?p.prefix+":"+p.localName:p.localName),1)[0],d=a.lookupNamespaceURI(f);new e(p)._updateNamespace(d)}}return this},e.prototype.doc=function(){if(this._doc._isFragment){for(var t=this.node;t&&t.nodeType!==u.NodeType.DocumentFragment;)t=t.parentNode;if(null===t)throw new Error("Node has no parent node while searching for document fragment ancestor. "+this._debugInfo());return new e(t)}return new e(this._doc)},e.prototype.root=function(){var t=this._doc.documentElement;if(!t)throw new Error("Document root element is null. "+this._debugInfo());return new e(t)},e.prototype.up=function(){var t=this._domNode.parentNode;if(!t)throw new Error("Parent node is null. "+this._debugInfo());return new e(t)},e.prototype.prev=function(){var t=this._domNode.previousSibling;if(!t)throw new Error("Previous sibling node is null. "+this._debugInfo());return new e(t)},e.prototype.next=function(){var t=this._domNode.nextSibling;if(!t)throw new Error("Next sibling node is null. "+this._debugInfo());return new e(t)},e.prototype.first=function(){var t=this._domNode.firstChild;if(!t)throw new Error("First child node is null. "+this._debugInfo());return new e(t)},e.prototype.last=function(){var t=this._domNode.lastChild;if(!t)throw new Error("Last child node is null. "+this._debugInfo());return new e(t)},e.prototype.each=function(t,r,n,i){void 0===r&&(r=!1),void 0===n&&(n=!1);for(var o=this._getFirstDescendantNode(this._domNode,r,n);o[0];){var a=this._getNextDescendantNode(this._domNode,o[0],n,o[1],o[2]);t.call(i,new e(o[0]),o[1],o[2]),o=a}return this},e.prototype.map=function(e,t,r,n){void 0===t&&(t=!1),void 0===r&&(r=!1);var i=[];return this.each((function(t,r,o){return i.push(e.call(n,t,r,o))}),t,r),i},e.prototype.reduce=function(e,t,r,n,i){void 0===r&&(r=!1),void 0===n&&(n=!1);var o=t;return this.each((function(t,r,n){return o=e.call(i,o,t,r,n)}),r,n),o},e.prototype.find=function(t,r,n,i){void 0===r&&(r=!1),void 0===n&&(n=!1);for(var o=this._getFirstDescendantNode(this._domNode,r,n);o[0];){var a=new e(o[0]);if(t.call(i,a,o[1],o[2]))return a;o=this._getNextDescendantNode(this._domNode,o[0],n,o[1],o[2])}},e.prototype.filter=function(e,t,r,n){void 0===t&&(t=!1),void 0===r&&(r=!1);var i=[];return this.each((function(t,r,o){e.call(n,t,r,o)&&i.push(t)}),t,r),i},e.prototype.every=function(t,r,n,i){void 0===r&&(r=!1),void 0===n&&(n=!1);for(var o=this._getFirstDescendantNode(this._domNode,r,n);o[0];){var a=new e(o[0]);if(!t.call(i,a,o[1],o[2]))return!1;o=this._getNextDescendantNode(this._domNode,o[0],n,o[1],o[2])}return!0},e.prototype.some=function(t,r,n,i){void 0===r&&(r=!1),void 0===n&&(n=!1);for(var o=this._getFirstDescendantNode(this._domNode,r,n);o[0];){var a=new e(o[0]);if(t.call(i,a,o[1],o[2]))return!0;o=this._getNextDescendantNode(this._domNode,o[0],n,o[1],o[2])}return!1},e.prototype.toArray=function(e,t){void 0===e&&(e=!1),void 0===t&&(t=!1);var r=[];return this.each((function(e){return r.push(e)}),e,t),r},e.prototype.toString=function(e){return void 0===(e=e||{}).format&&(e.format="xml"),this._serialize(e)},e.prototype.toObject=function(e){return void 0===(e=e||{}).format&&(e.format="object"),this._serialize(e)},e.prototype.end=function(e){return void 0===(e=e||{}).format&&(e.format="xml"),this.doc()._serialize(e)},e.prototype._getFirstDescendantNode=function(e,t,r){return t?[this._domNode,0,0]:r?this._getNextDescendantNode(e,e,r,0,0):[this._domNode.firstChild,0,1]},e.prototype._getNextDescendantNode=function(e,t,r,n,i){if(!r)return e===t?[t.firstChild,0,i+1]:[t.nextSibling,n+1,i];if(t.firstChild)return[t.firstChild,0,i+1];if(t===e)return[null,-1,-1];if(t.nextSibling)return[t.nextSibling,n+1,i];for(var o=t.parentNode;o&&o!==e;){if(o.nextSibling)return[o.nextSibling,c.tree_index(o.nextSibling),i-1];o=o.parentNode,i--}return[null,-1,-1]},e.prototype._serialize=function(e){if("xml"===e.format)return new s.XMLWriter(this._options,e).serialize(this.node);if("map"===e.format)return new s.MapWriter(this._options,e).serialize(this.node);if("object"===e.format)return new s.ObjectWriter(this._options,e).serialize(this.node);if("json"===e.format)return new s.JSONWriter(this._options,e).serialize(this.node);if("yaml"===e.format)return new s.YAMLWriter(this._options,e).serialize(this.node);throw new Error("Invalid writer format: "+e.format+". "+this._debugInfo())},e.prototype._extractNamespace=function(e,t,r){var n=t.indexOf("@");if(n>0&&(void 0===e&&(e=t.slice(n+1)),t=t.slice(0,n)),void 0===e)e=r?this._options.defaultNamespace.ele:this._options.defaultNamespace.att;else if(null!==e&&"@"===e[0]){var i=e.slice(1);if(void 0===(e=this._options.namespaceAlias[i]))throw new Error("Namespace alias `"+i+"` is not defined. "+this._debugInfo())}return[e,t]},e.prototype._updateNamespace=function(t){var r,o,a,s,u=this._domNode;if(l.Guard.isElementNode(u)&&null!==t&&u.namespaceURI!==t){var h=n(c.namespace_extractQName(u.prefix?u.prefix+":"+u.localName:u.localName),2),p=h[0],f=h[1],d=c.create_element(this._doc,f,t,p);try{for(var m=i(u.attributes),y=m.next();!y.done;y=m.next()){var v=y.value,_=v.prefix?v.prefix+":"+v.localName:v.localName,g=n(c.namespace_extractQName(_),1)[0],b=v.namespaceURI;null===b&&null!==g&&(b=u.lookupNamespaceURI(g)),null===b?d.setAttribute(_,v.value):d.setAttributeNS(b,_,v.value)}}catch(e){r={error:e}}finally{try{y&&!y.done&&(o=m.return)&&o.call(m)}finally{if(r)throw r.error}}var x=u.parentNode;if(null===x)throw new Error("Parent node is null."+this._debugInfo());x.replaceChild(d,u),this._domNode=d;try{for(var w=i(u.childNodes),E=w.next();!E.done;E=w.next()){var D=E.value.cloneNode(!0);if(d.appendChild(D),l.Guard.isElementNode(D)){var S=n(c.namespace_extractQName(D.prefix?D.prefix+":"+D.localName:D.localName),1)[0],C=d.lookupNamespaceURI(S);new e(D)._updateNamespace(C)}}}catch(e){a={error:e}}finally{try{E&&!E.done&&(s=w.return)&&s.call(w)}finally{if(a)throw a.error}}}},Object.defineProperty(e.prototype,"_doc",{get:function(){var e=this.node;if(l.Guard.isDocumentNode(e))return e;var t=e.ownerDocument;if(!t)throw new Error("Owner document is null. "+this._debugInfo());return t},enumerable:!0,configurable:!0}),e.prototype._debugInfo=function(e){var t=this.node,r=t.parentNode;e=e||t.nodeName;var n=r?r.nodeName:"";return n?"node: <"+e+">, parent: <"+n+">":"node: <"+e+">"},Object.defineProperty(e.prototype,"_options",{get:function(){var e=this._doc;if(void 0===e._xmlBuilderOptions)throw new Error("Builder options is not set.");return e._xmlBuilderOptions},set:function(e){this._doc._xmlBuilderOptions=e},enumerable:!0,configurable:!0}),e}();t.XMLBuilderImpl=d},function(e,t,r){var n=r(11),i=r(116),o=n.WeakMap;e.exports="function"==typeof o&&/native code/.test(i(o))},function(e,t,r){var n=r(46),i=r(81),o=r(84),a=r(18);e.exports=n("Reflect","ownKeys")||function(e){var t=i.f(a(e)),r=o.f;return r?t.concat(r(e)):t}},function(e,t,r){var n=r(16),i=r(15),o=r(18),a=r(61);e.exports=n?Object.defineProperties:function(e,t){o(e);for(var r,n=a(t),s=n.length,u=0;s>u;)i.f(e,r=n[u++],t[r]);return e}},function(e,t,r){var n=r(46);e.exports=n("document","documentElement")},function(e,t,r){var n=r(24),i=r(81).f,o={}.toString,a="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];e.exports.f=function(e){return a&&"[object Window]"==o.call(e)?function(e){try{return i(e)}catch(e){return a.slice()}}(e):i(n(e))}},function(e,t,r){"use strict";var n=r(4),i=r(36).every,o=r(48),a=r(28),s=o("every"),u=a("every");n({target:"Array",proto:!0,forced:!s||!u},{every:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}})},function(e,t,r){"use strict";var n=r(4),i=r(36).filter,o=r(63),a=r(28),s=o("filter"),u=a("filter");n({target:"Array",proto:!0,forced:!s||!u},{filter:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}})},function(e,t,r){var n=r(46);e.exports=n("navigator","userAgent")||""},function(e,t,r){"use strict";var n=r(4),i=r(36).find,o=r(129),a=r(28),s=!0,u=a("find");"find"in[]&&Array(1).find((function(){s=!1})),n({target:"Array",proto:!0,forced:s||!u},{find:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}}),o("find")},function(e,t,r){"use strict";var n=r(130).IteratorPrototype,i=r(60),o=r(40),a=r(62),s=r(49),u=function(){return this};e.exports=function(e,t,r){var l=t+" Iterator";return e.prototype=i(n,{next:o(1,r)}),a(e,l,!1,!0),s[l]=u,e}},function(e,t,r){var n=r(8);e.exports=!n((function(){function e(){}return e.prototype.constructor=null,Object.getPrototypeOf(new e)!==e.prototype}))},function(e,t,r){var n=r(13);e.exports=function(e){if(!n(e)&&null!==e)throw TypeError("Can't set "+String(e)+" as a prototype");return e}},function(e,t,r){"use strict";var n=r(4),i=r(36).map,o=r(63),a=r(28),s=o("map"),u=a("map");n({target:"Array",proto:!0,forced:!s||!u},{map:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}})},function(e,t,r){"use strict";var n=r(4),i=r(199).left,o=r(48),a=r(28),s=o("reduce"),u=a("reduce",{1:0});n({target:"Array",proto:!0,forced:!s||!u},{reduce:function(e){return i(this,e,arguments.length,arguments.length>1?arguments[1]:void 0)}})},function(e,t,r){var n=r(126),i=r(27),o=r(41),a=r(26),s=function(e){return function(t,r,s,u){n(r);var l=i(t),c=o(l),h=a(l.length),p=e?h-1:0,f=e?-1:1;if(s<2)for(;;){if(p in c){u=c[p],p+=f;break}if(p+=f,e?p<0:h<=p)throw TypeError("Reduce of empty array with no initial value")}for(;e?p>=0:h>p;p+=f)p in c&&(u=r(u,c[p],p,l));return u}};e.exports={left:s(!1),right:s(!0)}},function(e,t,r){"use strict";var n=r(4),i=r(36).some,o=r(48),a=r(28),s=o("some"),u=a("some");n({target:"Array",proto:!0,forced:!s||!u},{some:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}})},function(e,t,r){"use strict";var n=r(89),i=r(134);e.exports=n?{}.toString:function(){return"[object "+i(this)+"]"}},function(e,t){e.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},function(e,t,r){var n=r(8);e.exports=!n((function(){return Object.isExtensible(Object.preventExtensions({}))}))},function(e,t,r){var n=r(5),i=r(49),o=n("iterator"),a=Array.prototype;e.exports=function(e){return void 0!==e&&(i.Array===e||a[o]===e)}},function(e,t,r){var n=r(134),i=r(49),o=r(5)("iterator");e.exports=function(e){if(null!=e)return e[o]||e["@@iterator"]||i[n(e)]}},function(e,t,r){var n=r(18);e.exports=function(e,t,r,i){try{return i?t(n(r)[0],r[1]):t(r)}catch(t){var o=e.return;throw void 0!==o&&n(o.call(e)),t}}},function(e,t,r){var n=r(5)("iterator"),i=!1;try{var o=0,a={next:function(){return{done:!!o++}},return:function(){i=!0}};a[n]=function(){return this},Array.from(a,(function(){throw 2}))}catch(e){}e.exports=function(e,t){if(!t&&!i)return!1;var r=!1;try{var o={};o[n]=function(){return{next:function(){return{done:r=!0}}}},e(o)}catch(e){}return r}},function(e,t,r){var n=r(13),i=r(132);e.exports=function(e,t,r){var o,a;return i&&"function"==typeof(o=t.constructor)&&o!==r&&n(a=o.prototype)&&a!==r.prototype&&i(e,a),e}},function(e,t,r){var n=r(25);e.exports=function(e,t,r){for(var i in t)n(e,i,t[i],r);return e}},function(e,t,r){"use strict";var n=r(46),i=r(15),o=r(5),a=r(16),s=o("species");e.exports=function(e){var t=n(e),r=i.f;a&&t&&!t[s]&&r(t,s,{configurable:!0,get:function(){return this}})}},function(e,t,r){"use strict";var n=this&&this.__generator||function(e,t){var r,n,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;a;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,n=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},i=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e){void 0===e&&(e=1e3),this._items=new Set,this._limit=e}return e.prototype.add=function(e){if(this._items.add(e),this._items.size>this._limit){var t=this._items.values().next();t.done||this._items.delete(t.value)}return this},e.prototype.delete=function(e){return this._items.delete(e)},e.prototype.has=function(e){return this._items.has(e)},e.prototype.clear=function(){this._items.clear()},Object.defineProperty(e.prototype,"size",{get:function(){return this._items.size},enumerable:!0,configurable:!0}),e.prototype.forEach=function(e,t){var r=this;this._items.forEach((function(n){return e.call(t,n,n,r)}))},e.prototype.keys=function(){return n(this,(function(e){switch(e.label){case 0:return[5,i(this._items.keys())];case 1:return e.sent(),[2]}}))},e.prototype.values=function(){return n(this,(function(e){switch(e.label){case 0:return[5,i(this._items.values())];case 1:return e.sent(),[2]}}))},e.prototype.entries=function(){return n(this,(function(e){switch(e.label){case 0:return[5,i(this._items.entries())];case 1:return e.sent(),[2]}}))},e.prototype[Symbol.iterator]=function(){return n(this,(function(e){switch(e.label){case 0:return[5,i(this._items)];case 1:return e.sent(),[2]}}))},Object.defineProperty(e.prototype,Symbol.toStringTag,{get:function(){return"FixedSizeSet"},enumerable:!0,configurable:!0}),e}();t.FixedSizeSet=o},function(e,t,r){"use strict";var n=this&&this.__generator||function(e,t){var r,n,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;a;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,n=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},i=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e){void 0===e&&(e=1e3),this._items=new Map,this._limit=e}return e.prototype.get=function(e){return this._items.get(e)},e.prototype.set=function(e,t){if(this._items.set(e,t),this._items.size>this._limit){var r=this._items.keys().next();r.done||this._items.delete(r.value)}},e.prototype.delete=function(e){return this._items.delete(e)},e.prototype.has=function(e){return this._items.has(e)},e.prototype.clear=function(){this._items.clear()},Object.defineProperty(e.prototype,"size",{get:function(){return this._items.size},enumerable:!0,configurable:!0}),e.prototype.forEach=function(e,t){this._items.forEach((function(r,n){return e.call(t,n,r)}))},e.prototype.keys=function(){return n(this,(function(e){switch(e.label){case 0:return[5,i(this._items.keys())];case 1:return e.sent(),[2]}}))},e.prototype.values=function(){return n(this,(function(e){switch(e.label){case 0:return[5,i(this._items.values())];case 1:return e.sent(),[2]}}))},e.prototype.entries=function(){return n(this,(function(e){switch(e.label){case 0:return[5,i(this._items.entries())];case 1:return e.sent(),[2]}}))},e.prototype[Symbol.iterator]=function(){return n(this,(function(e){switch(e.label){case 0:return[5,i(this._items)];case 1:return e.sent(),[2]}}))},Object.defineProperty(e.prototype,Symbol.toStringTag,{get:function(){return"ObjectCache"},enumerable:!0,configurable:!0}),e}();t.ObjectCache=o},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e){void 0===e&&(e=1e3),this._items=new Map,this._limit=e}return e.prototype.check=function(e,t){if(this._items.get(e)===t)return!0;if(this._items.get(t)===e)return!1;var r=Math.random()<.5;if(r?this._items.set(e,t):this._items.set(t,e),this._items.size>this._limit){var n=this._items.keys().next();n.done||this._items.delete(n.value)}return r},e}();t.CompareCache=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e){this._initialized=!1,this._value=void 0,this._initFunc=e}return Object.defineProperty(e.prototype,"value",{get:function(){return this._initialized||(this._value=this._initFunc(),this._initialized=!0),this._value},enumerable:!0,configurable:!0}),e}();t.Lazy=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e){this._pointer=0,this._chars=Array.from(e),this._length=this._chars.length}return Object.defineProperty(e.prototype,"eof",{get:function(){return this._pointer>=this._length},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"length",{get:function(){return this._length},enumerable:!0,configurable:!0}),e.prototype.codePoint=function(){if(void 0===this._codePoint)if(this.eof)this._codePoint=-1;else{var e=this._chars[this._pointer].codePointAt(0);this._codePoint=void 0!==e?e:-1}return this._codePoint},e.prototype.c=function(){return void 0===this._c&&(this._c=this.eof?"":this._chars[this._pointer]),this._c},e.prototype.remaining=function(){return void 0===this._remaining&&(this._remaining=this.eof?"":this._chars.slice(this._pointer+1).join("")),this._remaining},e.prototype.substring=function(){return void 0===this._substring&&(this._substring=this.eof?"":this._chars.slice(this._pointer).join("")),this._substring},Object.defineProperty(e.prototype,"pointer",{get:function(){return this._pointer},set:function(e){e!==this._pointer&&(this._pointer=e,this._codePoint=void 0,this._c=void 0,this._remaining=void 0,this._substring=void 0)},enumerable:!0,configurable:!0}),e}();t.StringWalker=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(217);t.MapWriter=n.MapWriter;var i=r(257);t.XMLWriter=i.XMLWriter;var o=r(67);t.ObjectWriter=o.ObjectWriter;var a=r(259);t.JSONWriter=a.JSONWriter;var s=r(260);t.YAMLWriter=s.YAMLWriter},function(e,t,r){"use strict";r(19),r(218),r(20),r(22),r(23);var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(1),a=r(67),s=function(e){function t(t,r){var n=e.call(this,t)||this;return n._writerOptions=o.applyDefaults(r,{format:"map",wellFormed:!1,noDoubleEncoding:!1,group:!1,verbose:!1}),n}return i(t,e),t.prototype.serialize=function(e){var t=o.applyDefaults(this._writerOptions,{format:"object",wellFormed:!1,noDoubleEncoding:!1,verbose:!1}),r=new a.ObjectWriter(this._builderOptions,t).serialize(e);return this._convertObject(r)},t.prototype._convertObject=function(e){if(o.isArray(e)){for(var t=0;t<e.length;t++)e[t]=this._convertObject(e[t]);return e}if(o.isObject(e)){var r=new Map;for(var n in e)r.set(n,this._convertObject(e[n]));return r}return e},t}(r(50).BaseWriter);t.MapWriter=s},function(e,t,r){"use strict";var n=r(138),i=r(142);e.exports=n("Map",(function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}}),i)},function(e,t,r){"use strict";var n=r(4),i=r(8),o=r(59),a=r(13),s=r(27),u=r(26),l=r(133),c=r(127),h=r(63),p=r(5),f=r(128),d=p("isConcatSpreadable"),m=f>=51||!i((function(){var e=[];return e[d]=!1,e.concat()[0]!==e})),y=h("concat"),v=function(e){if(!a(e))return!1;var t=e[d];return void 0!==t?!!t:o(e)};n({target:"Array",proto:!0,forced:!m||!y},{concat:function(e){var t,r,n,i,o,a=s(this),h=c(a,0),p=0;for(t=-1,n=arguments.length;t<n;t++)if(v(o=-1===t?a:arguments[t])){if(p+(i=u(o.length))>9007199254740991)throw TypeError("Maximum allowed index exceeded");for(r=0;r<i;r++,p++)r in o&&l(h,p,o[r])}else{if(p>=9007199254740991)throw TypeError("Maximum allowed index exceeded");l(h,p++,o)}return h.length=p,h}})},function(e,t,r){"use strict";var n=r(8);function i(e,t){return RegExp(e,t)}t.UNSUPPORTED_Y=n((function(){var e=i("a","y");return e.lastIndex=2,null!=e.exec("abcd")})),t.BROKEN_CARET=n((function(){var e=i("^r","gy");return e.lastIndex=2,null!=e.exec("str")}))},function(e,t,r){var n=r(222);e.exports=function(e){if(n(e))throw TypeError("The method doesn't accept regular expressions");return e}},function(e,t,r){var n=r(13),i=r(42),o=r(5)("match");e.exports=function(e){var t;return n(e)&&(void 0!==(t=e[o])?!!t:"RegExp"==i(e))}},function(e,t,r){var n=r(5)("match");e.exports=function(e){var t=/./;try{"/./"[e](t)}catch(r){try{return t[n]=!1,"/./"[e](t)}catch(e){}}return!1}},function(e,t,r){"use strict";r(92);var n=r(25),i=r(8),o=r(5),a=r(93),s=r(21),u=o("species"),l=!i((function(){var e=/./;return e.exec=function(){var e=[];return e.groups={a:"7"},e},"7"!=="".replace(e,"$<a>")})),c="$0"==="a".replace(/./,"$0"),h=o("replace"),p=!!/./[h]&&""===/./[h]("a","$0"),f=!i((function(){var e=/(?:)/,t=e.exec;e.exec=function(){return t.apply(this,arguments)};var r="ab".split(e);return 2!==r.length||"a"!==r[0]||"b"!==r[1]}));e.exports=function(e,t,r,h){var d=o(e),m=!i((function(){var t={};return t[d]=function(){return 7},7!=""[e](t)})),y=m&&!i((function(){var t=!1,r=/a/;return"split"===e&&((r={}).constructor={},r.constructor[u]=function(){return r},r.flags="",r[d]=/./[d]),r.exec=function(){return t=!0,null},r[d](""),!t}));if(!m||!y||"replace"===e&&(!l||!c||p)||"split"===e&&!f){var v=/./[d],_=r(d,""[e],(function(e,t,r,n,i){return t.exec===a?m&&!i?{done:!0,value:v.call(t,r,n)}:{done:!0,value:e.call(r,t,n)}:{done:!1}}),{REPLACE_KEEPS_$0:c,REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE:p}),g=_[0],b=_[1];n(String.prototype,e,g),n(RegExp.prototype,d,2==t?function(e,t){return b.call(e,this,t)}:function(e){return b.call(e,this)})}h&&s(RegExp.prototype[d],"sham",!0)}},function(e,t,r){"use strict";var n=r(136).charAt;e.exports=function(e,t,r){return t+(r?n(e,t).length:1)}},function(e,t,r){var n=r(42),i=r(93);e.exports=function(e,t){var r=e.exec;if("function"==typeof r){var o=r.call(e,t);if("object"!=typeof o)throw TypeError("RegExp exec method returned something other than an Object or null");return o}if("RegExp"!==n(e))throw TypeError("RegExp#exec called on incompatible receiver");return i.call(e,t)}},function(e,t,r){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0});var n=r(95);t.forgivingBase64Encode=function(t){return e.from(t).toString("base64")},t.forgivingBase64Decode=function(t){return""===t?"":((t=t.replace(n.ASCIIWhiteSpace,"")).length%4==0&&(t.endsWith("==")?t=t.substr(0,t.length-2):t.endsWith("=")&&(t=t.substr(0,t.length-1))),t.length%4==1?null:/[0-9A-Za-z+/]/.test(t)?e.from(t,"base64").toString("utf8"):null)}}).call(this,r(145).Buffer)},function(e,t,r){"use strict";t.byteLength=function(e){var t=l(e),r=t[0],n=t[1];return 3*(r+n)/4-n},t.toByteArray=function(e){var t,r,n=l(e),a=n[0],s=n[1],u=new o(function(e,t,r){return 3*(t+r)/4-r}(0,a,s)),c=0,h=s>0?a-4:a;for(r=0;r<h;r+=4)t=i[e.charCodeAt(r)]<<18|i[e.charCodeAt(r+1)]<<12|i[e.charCodeAt(r+2)]<<6|i[e.charCodeAt(r+3)],u[c++]=t>>16&255,u[c++]=t>>8&255,u[c++]=255&t;2===s&&(t=i[e.charCodeAt(r)]<<2|i[e.charCodeAt(r+1)]>>4,u[c++]=255&t);1===s&&(t=i[e.charCodeAt(r)]<<10|i[e.charCodeAt(r+1)]<<4|i[e.charCodeAt(r+2)]>>2,u[c++]=t>>8&255,u[c++]=255&t);return u},t.fromByteArray=function(e){for(var t,r=e.length,i=r%3,o=[],a=0,s=r-i;a<s;a+=16383)o.push(c(e,a,a+16383>s?s:a+16383));1===i?(t=e[r-1],o.push(n[t>>2]+n[t<<4&63]+"==")):2===i&&(t=(e[r-2]<<8)+e[r-1],o.push(n[t>>10]+n[t>>4&63]+n[t<<2&63]+"="));return o.join("")};for(var n=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s=0,u=a.length;s<u;++s)n[s]=a[s],i[a.charCodeAt(s)]=s;function l(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");return-1===r&&(r=t),[r,r===t?0:4-r%4]}function c(e,t,r){for(var i,o,a=[],s=t;s<r;s+=3)i=(e[s]<<16&16711680)+(e[s+1]<<8&65280)+(255&e[s+2]),a.push(n[(o=i)>>18&63]+n[o>>12&63]+n[o>>6&63]+n[63&o]);return a.join("")}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63},function(e,t){t.read=function(e,t,r,n,i){var o,a,s=8*i-n-1,u=(1<<s)-1,l=u>>1,c=-7,h=r?i-1:0,p=r?-1:1,f=e[t+h];for(h+=p,o=f&(1<<-c)-1,f>>=-c,c+=s;c>0;o=256*o+e[t+h],h+=p,c-=8);for(a=o&(1<<-c)-1,o>>=-c,c+=n;c>0;a=256*a+e[t+h],h+=p,c-=8);if(0===o)o=1-l;else{if(o===u)return a?NaN:1/0*(f?-1:1);a+=Math.pow(2,n),o-=l}return(f?-1:1)*a*Math.pow(2,o-n)},t.write=function(e,t,r,n,i,o){var a,s,u,l=8*o-i-1,c=(1<<l)-1,h=c>>1,p=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,f=n?0:o-1,d=n?1:-1,m=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(s=isNaN(t)?1:0,a=c):(a=Math.floor(Math.log(t)/Math.LN2),t*(u=Math.pow(2,-a))<1&&(a--,u*=2),(t+=a+h>=1?p/u:p*Math.pow(2,1-h))*u>=2&&(a++,u/=2),a+h>=c?(s=0,a=c):a+h>=1?(s=(t*u-1)*Math.pow(2,i),a+=h):(s=t*Math.pow(2,h-1)*Math.pow(2,i),a=0));i>=8;e[r+f]=255&s,f+=d,s/=256,i-=8);for(a=a<<i|s,l+=i;l>0;e[r+f]=255&a,f+=d,a/=256,l-=8);e[r+f-d]|=128*m}},function(e,t){var r={}.toString;e.exports=Array.isArray||function(e){return"[object Array]"==r.call(e)}},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(1);function o(e){var t,r;if(null===e||i.isString(e)||i.isNumber(e))return e;if(i.isArray(e)){var a=new Array;try{for(var s=n(e),u=s.next();!u.done;u=s.next()){var l=u.value;a.push(o(l))}}catch(e){t={error:e}}finally{try{u&&!u.done&&(r=s.return)&&r.call(s)}finally{if(t)throw t.error}}return a}if(i.isObject(e)){a=new Map;for(var c in e)if(e.hasOwnProperty(c)){var h=e[c];a.set(c,o(h))}return a}return e}t.parseJSONFromBytes=function(e){var t=i.utf8Decode(e);return JSON.parse.call(void 0,t)},t.serializeJSONToBytes=function(e){var t=JSON.stringify.call(void 0,e);return i.utf8Encode(t)},t.parseJSONIntoInfraValues=function(e){return o(JSON.parse.call(void 0,e))},t.convertAJSONDerivedJavaScriptValueToAnInfraValue=o},function(e,t,r){"use strict";var n=this&&this.__generator||function(e,t){var r,n,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;a;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,n=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},i=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},o=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(i(arguments[t]));return e},a=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var s=r(1);t.append=function(e,t){e.push(t)},t.extend=function(e,t){e.push.apply(e,o(t))},t.prepend=function(e,t){e.unshift(t)},t.replace=function(e,t,r){var n,i,o=0;try{for(var u=a(e),l=u.next();!l.done;l=u.next()){var c=l.value;if(s.isFunction(t))t.call(null,c)&&(e[o]=r);else if(c===t)return void(e[o]=r);o++}}catch(e){n={error:e}}finally{try{l&&!l.done&&(i=u.return)&&i.call(u)}finally{if(n)throw n.error}}},t.insert=function(e,t,r){e.splice(r,0,t)},t.remove=function(e,t){for(var r=e.length;r--;){var n=e[r];if(s.isFunction(t))t.call(null,n)&&e.splice(r,1);else if(n===t)return void e.splice(r,1)}},t.empty=function(e){e.length=0},t.contains=function(e,t){var r,n;try{for(var i=a(e),o=i.next();!o.done;o=i.next()){var u=o.value;if(s.isFunction(t)){if(t.call(null,u))return!0}else if(u===t)return!0}}catch(e){r={error:e}}finally{try{o&&!o.done&&(n=i.return)&&n.call(i)}finally{if(r)throw r.error}}return!1},t.size=function(e,t){var r,n;if(void 0===t)return e.length;var i=0;try{for(var o=a(e),s=o.next();!s.done;s=o.next()){var u=s.value;t.call(null,u)&&i++}}catch(e){r={error:e}}finally{try{s&&!s.done&&(n=o.return)&&n.call(o)}finally{if(r)throw r.error}}return i},t.isEmpty=function(e){return 0===e.length},t.forEach=function(e,t){var r,i,o,s,u,l;return n(this,(function(n){switch(n.label){case 0:return void 0!==t?[3,2]:[5,a(e)];case 1:return n.sent(),[3,9];case 2:n.trys.push([2,7,8,9]),r=a(e),i=r.next(),n.label=3;case 3:return i.done?[3,6]:(o=i.value,t.call(null,o)?[4,o]:[3,5]);case 4:n.sent(),n.label=5;case 5:return i=r.next(),[3,3];case 6:return[3,9];case 7:return s=n.sent(),u={error:s},[3,9];case 8:try{i&&!i.done&&(l=r.return)&&l.call(r)}finally{if(u)throw u.error}return[7];case 9:return[2]}}))},t.clone=function(e){return new(Array.bind.apply(Array,o([void 0],e)))},t.sortInAscendingOrder=function(e,t){return e.sort((function(e,r){return t.call(null,e,r)?-1:1}))},t.sortInDescendingOrder=function(e,t){return e.sort((function(e,r){return t.call(null,e,r)?1:-1}))}},function(e,t,r){"use strict";var n=this&&this.__generator||function(e,t){var r,n,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;a;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,n=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},i=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},o=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},a=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(o(arguments[t]));return e};Object.defineProperty(t,"__esModule",{value:!0});var s=r(1);t.get=function(e,t){return e.get(t)},t.set=function(e,t,r){e.set(t,r)},t.remove=function(e,t){var r,n,o,a;if(s.isFunction(t)){var u=[];try{for(var l=i(e),c=l.next();!c.done;c=l.next()){var h=c.value;t.call(null,h)&&u.push(h[0])}}catch(e){r={error:e}}finally{try{c&&!c.done&&(n=l.return)&&n.call(l)}finally{if(r)throw r.error}}try{for(var p=i(u),f=p.next();!f.done;f=p.next()){var d=f.value;e.delete(d)}}catch(e){o={error:e}}finally{try{f&&!f.done&&(a=p.return)&&a.call(p)}finally{if(o)throw o.error}}}else e.delete(t)},t.contains=function(e,t){var r,n;if(s.isFunction(t)){try{for(var o=i(e),a=o.next();!a.done;a=o.next()){var u=a.value;if(t.call(null,u))return!0}}catch(e){r={error:e}}finally{try{a&&!a.done&&(n=o.return)&&n.call(o)}finally{if(r)throw r.error}}return!1}return e.has(t)},t.keys=function(e){return new Set(e.keys())},t.values=function(e){return a(e.values())},t.size=function(e,t){var r,n;if(void 0===t)return e.size;var o=0;try{for(var a=i(e),s=a.next();!s.done;s=a.next()){var u=s.value;t.call(null,u)&&o++}}catch(e){r={error:e}}finally{try{s&&!s.done&&(n=a.return)&&n.call(a)}finally{if(r)throw r.error}}return o},t.isEmpty=function(e){return 0===e.size},t.forEach=function(e,t){var r,o,a,s,u,l;return n(this,(function(n){switch(n.label){case 0:return void 0!==t?[3,2]:[5,i(e)];case 1:return n.sent(),[3,9];case 2:n.trys.push([2,7,8,9]),r=i(e),o=r.next(),n.label=3;case 3:return o.done?[3,6]:(a=o.value,t.call(null,a)?[4,a]:[3,5]);case 4:n.sent(),n.label=5;case 5:return o=r.next(),[3,3];case 6:return[3,9];case 7:return s=n.sent(),u={error:s},[3,9];case 8:try{o&&!o.done&&(l=r.return)&&l.call(r)}finally{if(u)throw u.error}return[7];case 9:return[2]}}))},t.clone=function(e){return new Map(e)},t.sortInAscendingOrder=function(e,t){var r=new(Array.bind.apply(Array,a([void 0],e)));return r.sort((function(e,r){return t.call(null,e,r)?-1:1})),new Map(r)},t.sortInDescendingOrder=function(e,t){var r=new(Array.bind.apply(Array,a([void 0],e)));return r.sort((function(e,r){return t.call(null,e,r)?1:-1})),new Map(r)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.HTML="http://www.w3.org/1999/xhtml",t.XML="http://www.w3.org/XML/1998/namespace",t.XMLNS="http://www.w3.org/2000/xmlns/",t.MathML="http://www.w3.org/1998/Math/MathML",t.SVG="http://www.w3.org/2000/svg",t.XLink="http://www.w3.org/1999/xlink"},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.enqueue=function(e,t){e.push(t)},t.dequeue=function(e){return e.shift()||null}},function(e,t,r){"use strict";var n=this&&this.__generator||function(e,t){var r,n,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;a;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,n=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},i=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},o=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},a=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(o(arguments[t]));return e};Object.defineProperty(t,"__esModule",{value:!0});var s=r(1);function u(e,t){var r,n;try{for(var o=i(e),a=o.next();!a.done;a=o.next()){var s=a.value;if(!t.has(s))return!1}}catch(e){r={error:e}}finally{try{a&&!a.done&&(n=o.return)&&n.call(o)}finally{if(r)throw r.error}}return!0}t.append=function(e,t){e.add(t)},t.extend=function(e,t){t.forEach(e.add,e)},t.prepend=function(e,t){var r=new Set(e);e.clear(),e.add(t),r.forEach(e.add,e)},t.replace=function(e,t,r){var n,o,a=new Set;try{for(var u=i(e),l=u.next();!l.done;l=u.next()){var c=l.value;s.isFunction(t)?t.call(null,c)?a.add(r):a.add(c):c===t?a.add(r):a.add(c)}}catch(e){n={error:e}}finally{try{l&&!l.done&&(o=u.return)&&o.call(u)}finally{if(n)throw n.error}}e.clear(),a.forEach(e.add,e)},t.insert=function(e,t,r){var n,o,a=new Set,s=0;try{for(var u=i(e),l=u.next();!l.done;l=u.next()){var c=l.value;s===r&&a.add(t),a.add(c),s++}}catch(e){n={error:e}}finally{try{l&&!l.done&&(o=u.return)&&o.call(u)}finally{if(n)throw n.error}}e.clear(),a.forEach(e.add,e)},t.remove=function(e,t){var r,n,o,a;if(s.isFunction(t)){var u=[];try{for(var l=i(e),c=l.next();!c.done;c=l.next()){var h=c.value;t.call(null,h)&&u.push(h)}}catch(e){r={error:e}}finally{try{c&&!c.done&&(n=l.return)&&n.call(l)}finally{if(r)throw r.error}}try{for(var p=i(u),f=p.next();!f.done;f=p.next()){var d=f.value;e.delete(d)}}catch(e){o={error:e}}finally{try{f&&!f.done&&(a=p.return)&&a.call(p)}finally{if(o)throw o.error}}}else e.delete(t)},t.empty=function(e){e.clear()},t.contains=function(e,t){var r,n;if(!s.isFunction(t))return e.has(t);try{for(var o=i(e),a=o.next();!a.done;a=o.next()){var u=a.value;if(t.call(null,u))return!0}}catch(e){r={error:e}}finally{try{a&&!a.done&&(n=o.return)&&n.call(o)}finally{if(r)throw r.error}}return!1},t.size=function(e,t){var r,n;if(void 0===t)return e.size;var o=0;try{for(var a=i(e),s=a.next();!s.done;s=a.next()){var u=s.value;t.call(null,u)&&o++}}catch(e){r={error:e}}finally{try{s&&!s.done&&(n=a.return)&&n.call(a)}finally{if(r)throw r.error}}return o},t.isEmpty=function(e){return 0===e.size},t.forEach=function(e,t){var r,o,a,s,u,l;return n(this,(function(n){switch(n.label){case 0:return void 0!==t?[3,2]:[5,i(e)];case 1:return n.sent(),[3,9];case 2:n.trys.push([2,7,8,9]),r=i(e),o=r.next(),n.label=3;case 3:return o.done?[3,6]:(a=o.value,t.call(null,a)?[4,a]:[3,5]);case 4:n.sent(),n.label=5;case 5:return o=r.next(),[3,3];case 6:return[3,9];case 7:return s=n.sent(),u={error:s},[3,9];case 8:try{o&&!o.done&&(l=r.return)&&l.call(r)}finally{if(u)throw u.error}return[7];case 9:return[2]}}))},t.clone=function(e){return new Set(e)},t.sortInAscendingOrder=function(e,t){var r=new(Array.bind.apply(Array,a([void 0],e)));return r.sort((function(e,r){return t.call(null,e,r)?-1:1})),new Set(r)},t.sortInDescendingOrder=function(e,t){var r=new(Array.bind.apply(Array,a([void 0],e)));return r.sort((function(e,r){return t.call(null,e,r)?1:-1})),new Set(r)},t.isSubsetOf=u,t.isSupersetOf=function(e,t){return u(t,e)},t.intersection=function(e,t){var r,n,o=new Set;try{for(var a=i(e),s=a.next();!s.done;s=a.next()){var u=s.value;t.has(u)&&o.add(u)}}catch(e){r={error:e}}finally{try{s&&!s.done&&(n=a.return)&&n.call(a)}finally{if(r)throw r.error}}return o},t.union=function(e,t){var r=new Set(e);return t.forEach(r.add,r),r},t.range=function(e,t){for(var r=new Set,n=e;n<=t;n++)r.add(n);return r}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.push=function(e,t){e.push(t)},t.pop=function(e){return e.pop()||null}},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(95),o=r(147),a=r(146),s=r(1);function u(e,t){for(var r=0;;){var n=r<e.length?e.charCodeAt(r):null,i=r<t.length?t.charCodeAt(r):null;if(null===n)return!0;if(n!==i)return!1;r++}}function l(e){var t,r,i=Array.from(e),o=new Uint8Array(i.length),a=0;try{for(var s=n(e),u=s.next();!u.done;u=s.next()){var l=u.value.codePointAt(0);console.assert(void 0!==l&&l<=255,"isomorphicEncode requires string bytes to be less than or equal to 0x00FF."),void 0!==l&&l<=255&&(o[a++]=l)}}catch(e){t={error:e}}finally{try{u&&!u.done&&(r=s.return)&&r.call(s)}finally{if(t)throw t.error}}return o}function c(e){return/^[\u0000-\u007F]*$/.test(e)}function h(e){var t,r,i="";try{for(var o=n(e),a=o.next();!a.done;a=o.next()){var s=a.value,u=s.codePointAt(0);i+=void 0!==u&&u>=65&&u<=90?String.fromCodePoint(u+32):s}}catch(e){t={error:e}}finally{try{a&&!a.done&&(r=o.return)&&r.call(o)}finally{if(t)throw t.error}}return i}function p(e){return e.replace(/^[\t\n\f\r ]+/,"").replace(/[\t\n\f\r ]+$/,"")}function f(e,t,r){if(!s.isArray(t))return f(e,Array.from(t),r);for(var n="";r.position<t.length&&e.call(null,t[r.position]);)n+=t[r.position],r.position++;return n}function d(e,t){f((function(e){return i.ASCIIWhiteSpace.test(e)}),e,t)}t.isCodeUnitPrefix=u,t.isCodeUnitLessThan=function(e,t){if(u(t,e))return!1;if(u(e,t))return!0;for(var r=0;r<Math.min(e.length,t.length);r++){var n=e.charCodeAt(r),i=t.charCodeAt(r);if(n!==i)return n<i}return!1},t.isomorphicEncode=l,t.isASCIIString=c,t.asciiLowercase=h,t.asciiUppercase=function(e){var t,r,i="";try{for(var o=n(e),a=o.next();!a.done;a=o.next()){var s=a.value,u=s.codePointAt(0);i+=void 0!==u&&u>=97&&u<=122?String.fromCodePoint(u-32):s}}catch(e){t={error:e}}finally{try{a&&!a.done&&(r=o.return)&&r.call(o)}finally{if(t)throw t.error}}return i},t.asciiCaseInsensitiveMatch=function(e,t){return h(e)===h(t)},t.asciiEncode=function(e){return console.assert(c(e),"asciiEncode requires an ASCII string."),l(e)},t.asciiDecode=function(e){var t,r;try{for(var i=n(e),s=i.next();!s.done;s=i.next()){var u=s.value;console.assert(a.isASCIIByte(u),"asciiDecode requires an ASCII byte sequence.")}}catch(e){t={error:e}}finally{try{s&&!s.done&&(r=i.return)&&r.call(i)}finally{if(t)throw t.error}}return o.isomorphicDecode(e)},t.stripNewlines=function(e){return e.replace(/[\n\r]/g,"")},t.normalizeNewlines=function(e){return e.replace(/\r\n/g,"\n").replace(/\r/g,"\n")},t.stripLeadingAndTrailingASCIIWhitespace=p,t.stripAndCollapseASCIIWhitespace=function(e){return p(e.replace(/[\t\n\f\r ]{2,}/g," "))},t.collectASequenceOfCodePoints=f,t.skipASCIIWhitespace=d,t.strictlySplit=function e(t,r){if(!s.isArray(t))return e(Array.from(t),r);var n={position:0},i=[],o=f((function(e){return r!==e}),t,n);for(i.push(o);n.position<t.length;)console.assert(t[n.position]===r,"strictlySplit found no delimiter in input string."),n.position++,o=f((function(e){return r!==e}),t,n),i.push(o);return i},t.splitAStringOnASCIIWhitespace=function e(t){if(!s.isArray(t))return e(Array.from(t));var r={position:0},n=[];for(d(t,r);r.position<t.length;){var o=f((function(e){return!i.ASCIIWhiteSpace.test(e)}),t,r);n.push(o),d(t,r)}return n},t.splitAStringOnCommas=function e(t){if(!s.isArray(t))return e(Array.from(t));for(var r={position:0},n=[];r.position<t.length;){var i=f((function(e){return","!==e}),t,r);n.push(p(i)),r.position<t.length&&(console.assert(","===t[r.position],"splitAStringOnCommas found no delimiter in input string."),r.position++)}return n},t.concatenate=function(e,t){return void 0===t&&(t=""),0===e.length?"":e.join(t)}},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(96);t.abort_add=function(e,t){t._abortedFlag||t._abortAlgorithms.add(e)},t.abort_remove=function(e,t){t._abortAlgorithms.delete(e)},t.abort_signalAbort=function(e){var t,r;if(!e._abortedFlag){e._abortedFlag=!0;try{for(var o=n(e._abortAlgorithms),a=o.next();!a.done;a=o.next()){a.value.call(e)}}catch(e){t={error:e}}finally{try{a&&!a.done&&(r=o.return)&&r.call(o)}finally{if(t)throw t.error}}e._abortAlgorithms.clear(),i.event_fireAnEvent("abort",e)}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(150),i=function(){function e(){}return e.asNode=function(e){if(n.Guard.isNode(e))return e;throw new Error("Invalid object. Node expected.")},e}();t.Cast=i},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){}return Object.defineProperty(e.prototype,"size",{get:function(){return 0},enumerable:!0,configurable:!0}),e.prototype.add=function(e){throw new Error("Cannot add to an empty set.")},e.prototype.clear=function(){},e.prototype.delete=function(e){return!1},e.prototype.forEach=function(e,t){},e.prototype.has=function(e){return!1},e.prototype[Symbol.iterator]=function(){return new i},e.prototype.entries=function(){return new i},e.prototype.keys=function(){return new i},e.prototype.values=function(){return new i},Object.defineProperty(e.prototype,Symbol.toStringTag,{get:function(){return"EmptySet"},enumerable:!0,configurable:!0}),e}();t.EmptySet=n;var i=function(){function e(){}return e.prototype[Symbol.iterator]=function(){return this},e.prototype.next=function(){return{done:!0,value:null}},e}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e[e.SchemeStart=0]="SchemeStart",e[e.Scheme=1]="Scheme",e[e.NoScheme=2]="NoScheme",e[e.SpecialRelativeOrAuthority=3]="SpecialRelativeOrAuthority",e[e.PathOrAuthority=4]="PathOrAuthority",e[e.Relative=5]="Relative",e[e.RelativeSlash=6]="RelativeSlash",e[e.SpecialAuthoritySlashes=7]="SpecialAuthoritySlashes",e[e.SpecialAuthorityIgnoreSlashes=8]="SpecialAuthorityIgnoreSlashes",e[e.Authority=9]="Authority",e[e.Host=10]="Host",e[e.Hostname=11]="Hostname",e[e.Port=12]="Port",e[e.File=13]="File",e[e.FileSlash=14]="FileSlash",e[e.FileHost=15]="FileHost",e[e.PathStart=16]="PathStart",e[e.Path=17]="Path",e[e.CannotBeABaseURLPath=18]="CannotBeABaseURLPath",e[e.Query=19]="Query",e[e.Fragment=20]="Fragment"}(t.ParserState||(t.ParserState={})),t.OpaqueOrigin=["","",null,null]},function(e,t,r){"use strict";var n=r(244),i=r(246);function o(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}t.parse=g,t.resolve=function(e,t){return g(e,!1,!0).resolve(t)},t.resolveObject=function(e,t){return e?g(e,!1,!0).resolveObject(t):t},t.format=function(e){i.isString(e)&&(e=g(e));return e instanceof o?e.format():o.prototype.format.call(e)},t.Url=o;var a=/^([a-z0-9.+-]+:)/i,s=/:[0-9]*$/,u=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,l=["{","}","|","\\","^","`"].concat(["<",">",'"',"`"," ","\r","\n","\t"]),c=["'"].concat(l),h=["%","/","?",";","#"].concat(c),p=["/","?","#"],f=/^[+a-z0-9A-Z_-]{0,63}$/,d=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,m={javascript:!0,"javascript:":!0},y={javascript:!0,"javascript:":!0},v={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},_=r(247);function g(e,t,r){if(e&&i.isObject(e)&&e instanceof o)return e;var n=new o;return n.parse(e,t,r),n}o.prototype.parse=function(e,t,r){if(!i.isString(e))throw new TypeError("Parameter 'url' must be a string, not "+typeof e);var o=e.indexOf("?"),s=-1!==o&&o<e.indexOf("#")?"?":"#",l=e.split(s);l[0]=l[0].replace(/\\/g,"/");var g=e=l.join(s);if(g=g.trim(),!r&&1===e.split("#").length){var b=u.exec(g);if(b)return this.path=g,this.href=g,this.pathname=b[1],b[2]?(this.search=b[2],this.query=t?_.parse(this.search.substr(1)):this.search.substr(1)):t&&(this.search="",this.query={}),this}var x=a.exec(g);if(x){var w=(x=x[0]).toLowerCase();this.protocol=w,g=g.substr(x.length)}if(r||x||g.match(/^\/\/[^@\/]+@[^@\/]+/)){var E="//"===g.substr(0,2);!E||x&&y[x]||(g=g.substr(2),this.slashes=!0)}if(!y[x]&&(E||x&&!v[x])){for(var D,S,C=-1,A=0;A<p.length;A++){-1!==(N=g.indexOf(p[A]))&&(-1===C||N<C)&&(C=N)}-1!==(S=-1===C?g.lastIndexOf("@"):g.lastIndexOf("@",C))&&(D=g.slice(0,S),g=g.slice(S+1),this.auth=decodeURIComponent(D)),C=-1;for(A=0;A<h.length;A++){var N;-1!==(N=g.indexOf(h[A]))&&(-1===C||N<C)&&(C=N)}-1===C&&(C=g.length),this.host=g.slice(0,C),g=g.slice(C),this.parseHost(),this.hostname=this.hostname||"";var T="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!T)for(var O=this.hostname.split(/\./),F=(A=0,O.length);A<F;A++){var k=O[A];if(k&&!k.match(f)){for(var P="",I=0,L=k.length;I<L;I++)k.charCodeAt(I)>127?P+="x":P+=k[I];if(!P.match(f)){var M=O.slice(0,A),B=O.slice(A+1),j=k.match(d);j&&(M.push(j[1]),B.unshift(j[2])),B.length&&(g="/"+B.join(".")+g),this.hostname=M.join(".");break}}}this.hostname.length>255?this.hostname="":this.hostname=this.hostname.toLowerCase(),T||(this.hostname=n.toASCII(this.hostname));var R=this.port?":"+this.port:"",z=this.hostname||"";this.host=z+R,this.href+=this.host,T&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==g[0]&&(g="/"+g))}if(!m[w])for(A=0,F=c.length;A<F;A++){var U=c[A];if(-1!==g.indexOf(U)){var G=encodeURIComponent(U);G===U&&(G=escape(U)),g=g.split(U).join(G)}}var X=g.indexOf("#");-1!==X&&(this.hash=g.substr(X),g=g.slice(0,X));var q=g.indexOf("?");if(-1!==q?(this.search=g.substr(q),this.query=g.substr(q+1),t&&(this.query=_.parse(this.query)),g=g.slice(0,q)):t&&(this.search="",this.query={}),g&&(this.pathname=g),v[w]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){R=this.pathname||"";var W=this.search||"";this.path=R+W}return this.href=this.format(),this},o.prototype.format=function(){var e=this.auth||"";e&&(e=(e=encodeURIComponent(e)).replace(/%3A/i,":"),e+="@");var t=this.protocol||"",r=this.pathname||"",n=this.hash||"",o=!1,a="";this.host?o=e+this.host:this.hostname&&(o=e+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(o+=":"+this.port)),this.query&&i.isObject(this.query)&&Object.keys(this.query).length&&(a=_.stringify(this.query));var s=this.search||a&&"?"+a||"";return t&&":"!==t.substr(-1)&&(t+=":"),this.slashes||(!t||v[t])&&!1!==o?(o="//"+(o||""),r&&"/"!==r.charAt(0)&&(r="/"+r)):o||(o=""),n&&"#"!==n.charAt(0)&&(n="#"+n),s&&"?"!==s.charAt(0)&&(s="?"+s),t+o+(r=r.replace(/[?#]/g,(function(e){return encodeURIComponent(e)})))+(s=s.replace("#","%23"))+n},o.prototype.resolve=function(e){return this.resolveObject(g(e,!1,!0)).format()},o.prototype.resolveObject=function(e){if(i.isString(e)){var t=new o;t.parse(e,!1,!0),e=t}for(var r=new o,n=Object.keys(this),a=0;a<n.length;a++){var s=n[a];r[s]=this[s]}if(r.hash=e.hash,""===e.href)return r.href=r.format(),r;if(e.slashes&&!e.protocol){for(var u=Object.keys(e),l=0;l<u.length;l++){var c=u[l];"protocol"!==c&&(r[c]=e[c])}return v[r.protocol]&&r.hostname&&!r.pathname&&(r.path=r.pathname="/"),r.href=r.format(),r}if(e.protocol&&e.protocol!==r.protocol){if(!v[e.protocol]){for(var h=Object.keys(e),p=0;p<h.length;p++){var f=h[p];r[f]=e[f]}return r.href=r.format(),r}if(r.protocol=e.protocol,e.host||y[e.protocol])r.pathname=e.pathname;else{for(var d=(e.pathname||"").split("/");d.length&&!(e.host=d.shift()););e.host||(e.host=""),e.hostname||(e.hostname=""),""!==d[0]&&d.unshift(""),d.length<2&&d.unshift(""),r.pathname=d.join("/")}if(r.search=e.search,r.query=e.query,r.host=e.host||"",r.auth=e.auth,r.hostname=e.hostname||e.host,r.port=e.port,r.pathname||r.search){var m=r.pathname||"",_=r.search||"";r.path=m+_}return r.slashes=r.slashes||e.slashes,r.href=r.format(),r}var g=r.pathname&&"/"===r.pathname.charAt(0),b=e.host||e.pathname&&"/"===e.pathname.charAt(0),x=b||g||r.host&&e.pathname,w=x,E=r.pathname&&r.pathname.split("/")||[],D=(d=e.pathname&&e.pathname.split("/")||[],r.protocol&&!v[r.protocol]);if(D&&(r.hostname="",r.port=null,r.host&&(""===E[0]?E[0]=r.host:E.unshift(r.host)),r.host="",e.protocol&&(e.hostname=null,e.port=null,e.host&&(""===d[0]?d[0]=e.host:d.unshift(e.host)),e.host=null),x=x&&(""===d[0]||""===E[0])),b)r.host=e.host||""===e.host?e.host:r.host,r.hostname=e.hostname||""===e.hostname?e.hostname:r.hostname,r.search=e.search,r.query=e.query,E=d;else if(d.length)E||(E=[]),E.pop(),E=E.concat(d),r.search=e.search,r.query=e.query;else if(!i.isNullOrUndefined(e.search)){if(D)r.hostname=r.host=E.shift(),(T=!!(r.host&&r.host.indexOf("@")>0)&&r.host.split("@"))&&(r.auth=T.shift(),r.host=r.hostname=T.shift());return r.search=e.search,r.query=e.query,i.isNull(r.pathname)&&i.isNull(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.href=r.format(),r}if(!E.length)return r.pathname=null,r.search?r.path="/"+r.search:r.path=null,r.href=r.format(),r;for(var S=E.slice(-1)[0],C=(r.host||e.host||E.length>1)&&("."===S||".."===S)||""===S,A=0,N=E.length;N>=0;N--)"."===(S=E[N])?E.splice(N,1):".."===S?(E.splice(N,1),A++):A&&(E.splice(N,1),A--);if(!x&&!w)for(;A--;A)E.unshift("..");!x||""===E[0]||E[0]&&"/"===E[0].charAt(0)||E.unshift(""),C&&"/"!==E.join("/").substr(-1)&&E.push("");var T,O=""===E[0]||E[0]&&"/"===E[0].charAt(0);D&&(r.hostname=r.host=O?"":E.length?E.shift():"",(T=!!(r.host&&r.host.indexOf("@")>0)&&r.host.split("@"))&&(r.auth=T.shift(),r.host=r.hostname=T.shift()));return(x=x||r.host&&E.length)&&!O&&E.unshift(""),E.length?r.pathname=E.join("/"):(r.pathname=null,r.path=null),i.isNull(r.pathname)&&i.isNull(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.auth=e.auth||r.auth,r.slashes=r.slashes||e.slashes,r.href=r.format(),r},o.prototype.parseHost=function(){var e=this.host,t=s.exec(e);t&&(":"!==(t=t[0])&&(this.port=t.substr(1)),e=e.substr(0,e.length-t.length)),e&&(this.hostname=e)}},function(e,t,r){(function(e,n){var i;/*! https://mths.be/punycode v1.4.1 by @mathias */!function(o){t&&t.nodeType,e&&e.nodeType;var a="object"==typeof n&&n;a.global!==a&&a.window!==a&&a.self;var s,u=2147483647,l=/^xn--/,c=/[^\x20-\x7E]/,h=/[\x2E\u3002\uFF0E\uFF61]/g,p={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},f=Math.floor,d=String.fromCharCode;function m(e){throw new RangeError(p[e])}function y(e,t){for(var r=e.length,n=[];r--;)n[r]=t(e[r]);return n}function v(e,t){var r=e.split("@"),n="";return r.length>1&&(n=r[0]+"@",e=r[1]),n+y((e=e.replace(h,".")).split("."),t).join(".")}function _(e){for(var t,r,n=[],i=0,o=e.length;i<o;)(t=e.charCodeAt(i++))>=55296&&t<=56319&&i<o?56320==(64512&(r=e.charCodeAt(i++)))?n.push(((1023&t)<<10)+(1023&r)+65536):(n.push(t),i--):n.push(t);return n}function g(e){return y(e,(function(e){var t="";return e>65535&&(t+=d((e-=65536)>>>10&1023|55296),e=56320|1023&e),t+=d(e)})).join("")}function b(e,t){return e+22+75*(e<26)-((0!=t)<<5)}function x(e,t,r){var n=0;for(e=r?f(e/700):e>>1,e+=f(e/t);e>455;n+=36)e=f(e/35);return f(n+36*e/(e+38))}function w(e){var t,r,n,i,o,a,s,l,c,h,p,d=[],y=e.length,v=0,_=128,b=72;for((r=e.lastIndexOf("-"))<0&&(r=0),n=0;n<r;++n)e.charCodeAt(n)>=128&&m("not-basic"),d.push(e.charCodeAt(n));for(i=r>0?r+1:0;i<y;){for(o=v,a=1,s=36;i>=y&&m("invalid-input"),((l=(p=e.charCodeAt(i++))-48<10?p-22:p-65<26?p-65:p-97<26?p-97:36)>=36||l>f((u-v)/a))&&m("overflow"),v+=l*a,!(l<(c=s<=b?1:s>=b+26?26:s-b));s+=36)a>f(u/(h=36-c))&&m("overflow"),a*=h;b=x(v-o,t=d.length+1,0==o),f(v/t)>u-_&&m("overflow"),_+=f(v/t),v%=t,d.splice(v++,0,_)}return g(d)}function E(e){var t,r,n,i,o,a,s,l,c,h,p,y,v,g,w,E=[];for(y=(e=_(e)).length,t=128,r=0,o=72,a=0;a<y;++a)(p=e[a])<128&&E.push(d(p));for(n=i=E.length,i&&E.push("-");n<y;){for(s=u,a=0;a<y;++a)(p=e[a])>=t&&p<s&&(s=p);for(s-t>f((u-r)/(v=n+1))&&m("overflow"),r+=(s-t)*v,t=s,a=0;a<y;++a)if((p=e[a])<t&&++r>u&&m("overflow"),p==t){for(l=r,c=36;!(l<(h=c<=o?1:c>=o+26?26:c-o));c+=36)w=l-h,g=36-h,E.push(d(b(h+w%g,0))),l=f(w/g);E.push(d(b(l,0))),o=x(r,v,n==i),r=0,++n}++r,++t}return E.join("")}s={version:"1.4.1",ucs2:{decode:_,encode:g},decode:w,encode:E,toASCII:function(e){return v(e,(function(e){return c.test(e)?"xn--"+E(e):e}))},toUnicode:function(e){return v(e,(function(e){return l.test(e)?w(e.slice(4).toLowerCase()):e}))}},void 0===(i=function(){return s}.call(t,r,t,e))||(e.exports=i)}()}).call(this,r(245)(e),r(77))},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,r){"use strict";e.exports={isString:function(e){return"string"==typeof e},isObject:function(e){return"object"==typeof e&&null!==e},isNull:function(e){return null===e},isNullOrUndefined:function(e){return null==e}}},function(e,t,r){"use strict";t.decode=t.parse=r(248),t.encode=t.stringify=r(249)},function(e,t,r){"use strict";function n(e,t){return Object.prototype.hasOwnProperty.call(e,t)}e.exports=function(e,t,r,o){t=t||"&",r=r||"=";var a={};if("string"!=typeof e||0===e.length)return a;var s=/\+/g;e=e.split(t);var u=1e3;o&&"number"==typeof o.maxKeys&&(u=o.maxKeys);var l=e.length;u>0&&l>u&&(l=u);for(var c=0;c<l;++c){var h,p,f,d,m=e[c].replace(s,"%20"),y=m.indexOf(r);y>=0?(h=m.substr(0,y),p=m.substr(y+1)):(h=m,p=""),f=decodeURIComponent(h),d=decodeURIComponent(p),n(a,f)?i(a[f])?a[f].push(d):a[f]=[a[f],d]:a[f]=d}return a};var i=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)}},function(e,t,r){"use strict";var n=function(e){switch(typeof e){case"string":return e;case"boolean":return e?"true":"false";case"number":return isFinite(e)?e:"";default:return""}};e.exports=function(e,t,r,s){return t=t||"&",r=r||"=",null===e&&(e=void 0),"object"==typeof e?o(a(e),(function(a){var s=encodeURIComponent(n(a))+r;return i(e[a])?o(e[a],(function(e){return s+encodeURIComponent(n(e))})).join(t):s+encodeURIComponent(n(e[a]))})).join(t):s?encodeURIComponent(n(s))+r+encodeURIComponent(n(e)):""};var i=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)};function o(e,t){if(e.map)return e.map(t);for(var r=[],n=0;n<e.length;n++)r.push(t(e[n],n));return r}var a=Object.keys||function(e){var t=[];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.push(r);return t}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(52);t.attr_setAnExistingAttributeValue=function(e,t){null===e._element?e._value=t:n.element_change(e,e._element,t)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(107),i=r(30),o=r(52);t.tokenList_validationSteps=function(e,t){if(!i.dom_hasSupportedTokens(e._attribute._localName))throw new TypeError("There are no supported tokens defined for attribute name: '"+e._attribute._localName+"'.");return i.dom_getSupportedTokens(e._attribute._localName).has(t.toLowerCase())},t.tokenList_updateSteps=function(e){(e._element.hasAttribute(e._attribute._localName)||0!==e._tokenSet.size)&&o.element_setAnAttributeValue(e._element,e._attribute._localName,n.orderedSet_serialize(e._tokenSet))},t.tokenList_serializeSteps=function(e){return o.element_getAnAttributeValue(e._element,e._attribute._localName)}},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(1);function o(e){return i.isBoolean(e)?e:e.capture||!1}t.eventTarget_flatten=o,t.eventTarget_flattenMore=function(e){var t=o(e),r=!1,n=!1;return i.isBoolean(e)||(r=e.once||!1,n=e.passive||!1),[t,n,r]},t.eventTarget_addEventListener=function(e,t){if(null!==t.callback){for(var r=0;r<e._eventListenerList.length;r++){var n=e._eventListenerList[r];if(n.type===t.type&&n.callback.handleEvent===t.callback.handleEvent&&n.capture===t.capture)return}e._eventListenerList.push(t)}},t.eventTarget_removeEventListener=function(e,t,r){t.removed=!0,e._eventListenerList.splice(r,1)},t.eventTarget_removeAllEventListeners=function(e){var t,r;try{for(var i=n(e._eventListenerList),o=i.next();!o.done;o=i.next()){o.value.removed=!0}}catch(e){t={error:e}}finally{try{o&&!o.done&&(r=i.return)&&r.call(i)}finally{if(t)throw t.error}}e._eventListenerList.length=0}},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(1),o=r(29);t.parentNode_convertNodesIntoANode=function(e,t){for(var r,a,s=null,u=0;u<e.length;u++){var l=e[u];if(i.isString(l)){var c=o.create_text(t,l);e[u]=c}}if(1===e.length)s=e[0];else{var h=s=o.create_documentFragment(t);try{for(var p=n(e),f=p.next();!f.done;f=p.next()){l=f.value;h.appendChild(l)}}catch(e){r={error:e}}finally{try{f&&!f.done&&(a=p.return)&&a.call(p)}finally{if(r)throw r.error}}}return s}},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},i=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},o=this&&this.__spread||function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(i(arguments[t]));return e};Object.defineProperty(t,"__esModule",{value:!0});var a=r(2),s=r(9),u=r(3),l=r(29),c=r(17),h=r(175),p=r(106),f=r(176),d=r(37),m=r(177);function y(e){return e._startNode===e._endNode&&e._startOffset===e._endOffset}function v(e){return c.tree_rootNode(e._startNode)}function _(e,t){return c.tree_rootNode(e)===v(t)&&h.boundaryPoint_position([e,0],t._start)===a.BoundaryPosition.After&&h.boundaryPoint_position([e,c.tree_nodeLength(e)],t._end)===a.BoundaryPosition.Before}function g(e,t){var r=c.tree_isAncestorOf(t._startNode,e,!0),n=c.tree_isAncestorOf(t._endNode,e,!0);return r&&!n||!r&&n}function b(e){var t,r,i,a,h,m,v=l.create_documentFragment(e._startNode._nodeDocument);if(y(e))return v;var x=e._startNode,w=e._startOffset,E=e._endNode,D=e._endOffset;if(x===E&&u.Guard.isCharacterDataNode(x))return(R=f.node_clone(x))._data=p.characterData_substringData(x,w,D-w),d.mutation_append(R,v),p.characterData_replaceData(x,w,D-w,""),v;for(var S=x;!c.tree_isAncestorOf(E,S,!0);){if(null===S._parent)throw new Error("Parent node  is null.");S=S._parent}var C=null;if(!c.tree_isAncestorOf(E,x,!0))try{for(var A=n(S._children),N=A.next();!N.done;N=A.next()){if(g(k=N.value,e)){C=k;break}}}catch(e){t={error:e}}finally{try{N&&!N.done&&(r=A.return)&&r.call(A)}finally{if(t)throw t.error}}var T=null;if(!c.tree_isAncestorOf(x,E,!0))for(var O=o(S._children),F=O.length-1;F>0;F--){var k;if(g(k=O[F],e)){T=k;break}}var P,I,L=[];try{for(var M=n(S._children),B=M.next();!B.done;B=M.next()){if(_(X=B.value,e)){if(u.Guard.isDocumentTypeNode(X))throw new s.HierarchyRequestError;L.push(X)}}}catch(e){i={error:e}}finally{try{B&&!B.done&&(a=M.return)&&a.call(M)}finally{if(i)throw i.error}}if(c.tree_isAncestorOf(E,x,!0))P=x,I=w;else{for(var j=x;null!==j._parent&&!c.tree_isAncestorOf(E,j._parent);)j=j._parent;if(null===j._parent)throw new Error("Parent node is null.");P=j._parent,I=1+c.tree_index(j)}if(u.Guard.isCharacterDataNode(C))(R=f.node_clone(x))._data=p.characterData_substringData(x,w,c.tree_nodeLength(x)-w),d.mutation_append(R,v),p.characterData_replaceData(x,w,c.tree_nodeLength(x)-w,"");else if(null!==C){var R=f.node_clone(C);d.mutation_append(R,v);var z=b(l.create_range([x,w],[C,c.tree_nodeLength(C)]));d.mutation_append(z,R)}try{for(var U=n(L),G=U.next();!G.done;G=U.next()){var X=G.value;d.mutation_append(X,v)}}catch(e){h={error:e}}finally{try{G&&!G.done&&(m=U.return)&&m.call(U)}finally{if(h)throw h.error}}if(u.Guard.isCharacterDataNode(T))(R=f.node_clone(E))._data=p.characterData_substringData(E,0,D),d.mutation_append(R,v),p.characterData_replaceData(E,0,D,"");else if(null!==T){R=f.node_clone(T);d.mutation_append(R,v);z=b(l.create_range([T,0],[E,D]));d.mutation_append(z,R)}return e._start=[P,I],e._end=[P,I],v}t.range_collapsed=y,t.range_root=v,t.range_isContained=_,t.range_isPartiallyContained=g,t.range_setTheStart=function(e,t,r){if(u.Guard.isDocumentTypeNode(t))throw new s.InvalidNodeTypeError;if(r>c.tree_nodeLength(t))throw new s.IndexSizeError;var n=[t,r];v(e)===c.tree_rootNode(t)&&h.boundaryPoint_position(n,e._end)!==a.BoundaryPosition.After||(e._end=n),e._start=n},t.range_setTheEnd=function(e,t,r){if(u.Guard.isDocumentTypeNode(t))throw new s.InvalidNodeTypeError;if(r>c.tree_nodeLength(t))throw new s.IndexSizeError;var n=[t,r];v(e)===c.tree_rootNode(t)&&h.boundaryPoint_position(n,e._start)!==a.BoundaryPosition.Before||(e._start=n),e._end=n},t.range_select=function(e,t){var r=e._parent;if(null===r)throw new s.InvalidNodeTypeError;var n=c.tree_index(e);t._start=[r,n],t._end=[r,n+1]},t.range_extract=b,t.range_cloneTheContents=function e(t){var r,i,a,h,m,v,x=l.create_documentFragment(t._startNode._nodeDocument);if(y(t))return x;var w=t._startNode,E=t._startOffset,D=t._endNode,S=t._endOffset;w===D&&u.Guard.isCharacterDataNode(w)&&((B=f.node_clone(w))._data=p.characterData_substringData(w,E,S-E),d.mutation_append(B,x));for(var C=w;!c.tree_isAncestorOf(D,C,!0);){if(null===C._parent)throw new Error("Parent node  is null.");C=C._parent}var A=null;if(!c.tree_isAncestorOf(D,w,!0))try{for(var N=n(C._children),T=N.next();!T.done;T=N.next()){if(g(P=T.value,t)){A=P;break}}}catch(e){r={error:e}}finally{try{T&&!T.done&&(i=N.return)&&i.call(N)}finally{if(r)throw r.error}}var O=null;if(!c.tree_isAncestorOf(w,D,!0))for(var F=o(C._children),k=F.length-1;k>0;k--){var P;if(g(P=F[k],t)){O=P;break}}var I=[];try{for(var L=n(C._children),M=L.next();!M.done;M=L.next()){if(_(U=M.value,t)){if(u.Guard.isDocumentTypeNode(U))throw new s.HierarchyRequestError;I.push(U)}}}catch(e){a={error:e}}finally{try{M&&!M.done&&(h=L.return)&&h.call(L)}finally{if(a)throw a.error}}if(u.Guard.isCharacterDataNode(A))(B=f.node_clone(w))._data=p.characterData_substringData(w,E,c.tree_nodeLength(w)-E),d.mutation_append(B,x);else if(null!==A){var B=f.node_clone(A);d.mutation_append(B,x);var j=e(l.create_range([w,E],[A,c.tree_nodeLength(A)]));d.mutation_append(j,B)}try{for(var R=n(I),z=R.next();!z.done;z=R.next()){var U=z.value,B=f.node_clone(U);d.mutation_append(B,x)}}catch(e){m={error:e}}finally{try{z&&!z.done&&(v=R.return)&&v.call(R)}finally{if(m)throw m.error}}if(u.Guard.isCharacterDataNode(O))(B=f.node_clone(D))._data=p.characterData_substringData(D,0,S),d.mutation_append(B,x);else if(null!==O){B=f.node_clone(O);x.append(B);j=b(l.create_range([O,0],[D,S]));d.mutation_append(j,B)}return x},t.range_insert=function(e,t){var r,i;if(u.Guard.isProcessingInstructionNode(t._startNode)||u.Guard.isCommentNode(t._startNode)||u.Guard.isTextNode(t._startNode)&&null===t._startNode._parent||t._startNode===e)throw new s.HierarchyRequestError;var o,a=null;if(u.Guard.isTextNode(t._startNode))a=t._startNode;else{var l=0;try{for(var h=n(t._startNode._children),p=h.next();!p.done;p=h.next()){var f=p.value;if(l===t._startOffset){a=f;break}l++}}catch(e){r={error:e}}finally{try{p&&!p.done&&(i=h.return)&&i.call(h)}finally{if(r)throw r.error}}}if(null===a)o=t._startNode;else{if(null===a._parent)throw new Error("Parent node is null.");o=a._parent}d.mutation_ensurePreInsertionValidity(e,o,a),u.Guard.isTextNode(t._startNode)&&(a=m.text_split(t._startNode,t._startOffset)),e===a&&(a=e._nextSibling),null!==e._parent&&d.mutation_remove(e,e._parent);var v=null===a?c.tree_nodeLength(o):c.tree_index(a);u.Guard.isDocumentFragmentNode(e)?v+=c.tree_nodeLength(e):v++,d.mutation_preInsert(e,o,a),y(t)&&(t._end=[o,v])},t.range_getContainedNodes=function(e){var t;return(t={})[Symbol.iterator]=function(){var t=e.commonAncestorContainer,r=c.tree_getFirstDescendantNode(t);return{next:function(){for(;r&&!_(r,e);)r=c.tree_getNextDescendantNode(t,r);if(null===r)return{done:!0,value:null};var n={done:!1,value:r};return r=c.tree_getNextDescendantNode(t,r),n}}},t},t.range_getPartiallyContainedNodes=function(e){var t;return(t={})[Symbol.iterator]=function(){var t=e.commonAncestorContainer,r=c.tree_getFirstDescendantNode(t);return{next:function(){for(;r&&!g(r,e);)r=c.tree_getNextDescendantNode(t,r);if(null===r)return{done:!0,value:null};var n={done:!1,value:r};return r=c.tree_getNextDescendantNode(t,r),n}}},t}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(9);t.selectors_scopeMatchASelectorsString=function(e,t){throw new n.NotSupportedError}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2),i=r(104);t.treeWalker_traverseChildren=function(e,t){for(var r=t?e._current._firstChild:e._current._lastChild;null!==r;){var o=i.traversal_filter(e,r);if(o===n.FilterResult.Accept)return e._current=r,r;if(o===n.FilterResult.Skip){var a=t?r._firstChild:r._lastChild;if(null!==a){r=a;continue}}for(;null!==r;){var s=t?r._nextSibling:r._previousSibling;if(null!==s){r=s;break}var u=r._parent;if(null===u||u===e._root||u===e._current)return null;r=u}}return null},t.treeWalker_traverseSiblings=function(e,t){var r=e._current;if(r===e._root)return null;for(;;){for(var o=t?r._nextSibling:r._previousSibling;null!==o;){r=o;var a=i.traversal_filter(e,r);if(a===n.FilterResult.Accept)return e._current=r,r;o=t?r._firstChild:r._lastChild,a!==n.FilterResult.Reject&&null!==o||(o=t?r._nextSibling:r._previousSibling)}if(null===(r=r._parent)||r===e._root)return null;if(i.traversal_filter(e,r)===n.FilterResult.Accept)return null}}},function(e,t,r){"use strict";r(88),r(73);var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(1),a=r(2),s=r(50),u=r(3),l=function(e){function t(t,r){var n=e.call(this,t)||this;return n._indentation={},n._lengthToLastNewline=0,n._writerOptions=o.applyDefaults(r,{wellFormed:!1,noDoubleEncoding:!1,headless:!1,prettyPrint:!1,indent:"  ",newline:"\n",offset:0,width:0,allowEmptyTags:!1,indentTextOnlyNodes:!1,spaceBeforeSlash:!1}),n}return i(t,e),t.prototype.serialize=function(e){return this._refs={suppressPretty:!1,emptyNode:!1,markup:""},e.nodeType!==a.NodeType.Document||this._writerOptions.headless||this.declaration(this._builderOptions.version,this._builderOptions.encoding,this._builderOptions.standalone),this.serializeNode(e,this._writerOptions.wellFormed,this._writerOptions.noDoubleEncoding),this._writerOptions.prettyPrint&&this._refs.markup.slice(-this._writerOptions.newline.length)===this._writerOptions.newline&&(this._refs.markup=this._refs.markup.slice(0,-this._writerOptions.newline.length)),this._refs.markup},t.prototype.declaration=function(e,t,r){this._beginLine(),this._refs.markup+='<?xml version="'+e+'"',void 0!==t&&(this._refs.markup+=' encoding="'+t+'"'),void 0!==r&&(this._refs.markup+=' standalone="'+(r?"yes":"no")+'"'),this._refs.markup+="?>",this._endLine()},t.prototype.docType=function(e,t,r){this._beginLine(),this._refs.markup+=t&&r?"<!DOCTYPE "+e+' PUBLIC "'+t+'" "'+r+'">':t?"<!DOCTYPE "+e+' PUBLIC "'+t+'">':r?"<!DOCTYPE "+e+' SYSTEM "'+r+'">':"<!DOCTYPE "+e+">",this._endLine()},t.prototype.openTagBegin=function(e){this._beginLine(),this._refs.markup+="<"+e},t.prototype.openTagEnd=function(e,t,r){if(this._refs.suppressPretty=!1,this._refs.emptyNode=!1,this._writerOptions.prettyPrint&&!t&&!r){for(var n=!0,i=!0,o=this.currentNode.firstChild,a=0,s=0;o;){if(u.Guard.isExclusiveTextNode(o))s++;else{if(!u.Guard.isCDATASectionNode(o)){n=!1,i=!1;break}a++}""!==o.data&&(i=!1),o=o.nextSibling}this._refs.suppressPretty=!this._writerOptions.indentTextOnlyNodes&&n&&(a<=1&&0===s||0===a),this._refs.emptyNode=i}(r||t||this._refs.emptyNode)&&this._writerOptions.allowEmptyTags?this._refs.markup+="></"+e+">":this._refs.markup+=r?" />":t||this._refs.emptyNode?this._writerOptions.spaceBeforeSlash?" />":"/>":">",this._endLine()},t.prototype.closeTag=function(e){this._refs.emptyNode||(this._beginLine(),this._refs.markup+="</"+e+">"),this._refs.suppressPretty=!1,this._refs.emptyNode=!1,this._endLine()},t.prototype.attribute=function(e,t){var r=e+'="'+t+'"';this._writerOptions.prettyPrint&&this._writerOptions.width>0&&this._refs.markup.length-this._lengthToLastNewline+1+r.length>this._writerOptions.width?(this._endLine(),this._beginLine(),this._refs.markup+=this._indent(1)+r):this._refs.markup+=" "+r},t.prototype.text=function(e){""!==e&&(this._beginLine(),this._refs.markup+=e,this._endLine())},t.prototype.cdata=function(e){""!==e&&(this._beginLine(),this._refs.markup+="<![CDATA["+e+"]]>",this._endLine())},t.prototype.comment=function(e){this._beginLine(),this._refs.markup+="\x3c!--"+e+"--\x3e",this._endLine()},t.prototype.instruction=function(e,t){this._beginLine(),this._refs.markup+="<?"+(""===t?e:e+" "+t)+"?>",this._endLine()},t.prototype._beginLine=function(){this._writerOptions.prettyPrint&&!this._refs.suppressPretty&&(this._refs.markup+=this._indent(this._writerOptions.offset+this.level))},t.prototype._endLine=function(){this._writerOptions.prettyPrint&&!this._refs.suppressPretty&&(this._refs.markup+=this._writerOptions.newline,this._lengthToLastNewline=this._refs.markup.length)},t.prototype._indent=function(e){if(e<=0)return"";if(void 0!==this._indentation[e])return this._indentation[e];var t=this._writerOptions.indent.repeat(e);return this._indentation[e]=t,t},t}(s.BaseWriter);t.XMLWriter=l},function(e,t,r){"use strict";var n=r(47),i=r(35);e.exports="".repeat||function(e){var t=String(i(this)),r="",o=n(e);if(o<0||o==1/0)throw RangeError("Wrong number of repetitions");for(;o>0;(o>>>=1)&&(t+=t))1&o&&(r+=t);return r}},function(e,t,r){"use strict";r(31),r(32),r(33),r(19),r(178),r(20),r(22),r(23);var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var a=r(67),s=r(1),u=function(e){function t(t,r){var n=e.call(this,t)||this;return n._writerOptions=s.applyDefaults(r,{wellFormed:!1,noDoubleEncoding:!1,prettyPrint:!1,indent:"  ",newline:"\n",offset:0,group:!1,verbose:!1}),n}return i(t,e),t.prototype.serialize=function(e){var t=s.applyDefaults(this._writerOptions,{format:"object",wellFormed:!1,noDoubleEncoding:!1}),r=new a.ObjectWriter(this._builderOptions,t).serialize(e);return this._beginLine(this._writerOptions,0)+this._convertObject(r,this._writerOptions)},t.prototype._convertObject=function(e,t,r){var n,i,a=this;void 0===r&&(r=0);var u="",l=this._isLeafNode(e);if(s.isArray(e)){u+="[";var c=e.length,h=0;try{for(var p=o(e),f=p.next();!f.done;f=p.next()){var d=f.value;u+=this._endLine(t,r+1)+this._beginLine(t,r+1)+this._convertObject(d,t,r+1),h<c-1&&(u+=","),h++}}catch(e){n={error:e}}finally{try{f&&!f.done&&(i=p.return)&&i.call(p)}finally{if(n)throw n.error}}u+=this._endLine(t,r)+this._beginLine(t,r),u+="]"}else if(s.isObject(e)){u+="{";var m=s.objectLength(e),y=0;s.forEachObject(e,(function(e,n){l&&t.prettyPrint?u+=" ":u+=a._endLine(t,r+1)+a._beginLine(t,r+1),u+=a._key(e),t.prettyPrint&&(u+=" "),u+=a._convertObject(n,t,r+1),y<m-1&&(u+=","),y++}),this),l&&t.prettyPrint?u+=" ":u+=this._endLine(t,r)+this._beginLine(t,r),u+="}"}else u+=this._val(e);return u},t.prototype._beginLine=function(e,t){if(!e.prettyPrint)return"";var r=e.offset+t+1;return r>0?new Array(r).join(e.indent):""},t.prototype._endLine=function(e,t){return e.prettyPrint?e.newline:""},t.prototype._key=function(e){return'"'+e+'":'},t.prototype._val=function(e){return JSON.stringify(e)},t.prototype._isLeafNode=function(e){return this._descendantCount(e)<=1},t.prototype._descendantCount=function(e,t){var r=this;return void 0===t&&(t=0),s.isArray(e)?s.forEachArray(e,(function(e){return t+=r._descendantCount(e,t)}),this):s.isObject(e)?s.forEachObject(e,(function(e,n){return t+=r._descendantCount(n,t)}),this):t++,t},t}(r(50).BaseWriter);t.JSONWriter=u},function(e,t,r){"use strict";r(31),r(32),r(33),r(19),r(178),r(88),r(20),r(22),r(23);var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var a=r(67),s=r(1),u=function(e){function t(t,r){var n=e.call(this,t)||this;if(n._writerOptions=s.applyDefaults(r,{wellFormed:!1,noDoubleEncoding:!1,indent:"  ",newline:"\n",offset:0,group:!1,verbose:!1}),n._writerOptions.indent.length<2)throw new Error("YAML indententation string must be at least two characters long.");if(n._writerOptions.offset<0)throw new Error("YAML offset should be zero or a positive number.");return n}return i(t,e),t.prototype.serialize=function(e){var t=s.applyDefaults(this._writerOptions,{format:"object",wellFormed:!1,noDoubleEncoding:!1}),r=new a.ObjectWriter(this._builderOptions,t).serialize(e),n=this._beginLine(this._writerOptions,0)+"---"+this._endLine(this._writerOptions)+this._convertObject(r,this._writerOptions,0);return n.slice(-this._writerOptions.newline.length)===this._writerOptions.newline&&(n=n.slice(0,-this._writerOptions.newline.length)),n},t.prototype._convertObject=function(e,t,r,n){var i,a,u=this;void 0===n&&(n=!1);var l="";if(s.isArray(e))try{for(var c=o(e),h=c.next();!h.done;h=c.next()){var p=h.value;l+=this._beginLine(t,r,!0),s.isObject(p)?s.isEmpty(p)?l+='""'+this._endLine(t):l+=this._convertObject(p,t,r,!0):l+=this._val(p)+this._endLine(t)}}catch(e){i={error:e}}finally{try{h&&!h.done&&(a=c.return)&&a.call(c)}finally{if(i)throw i.error}}else s.forEachObject(e,(function(e,i){n?(l+=u._key(e),n=!1):l+=u._beginLine(t,r)+u._key(e),s.isObject(i)?s.isEmpty(i)?l+=' ""'+u._endLine(t):l+=u._endLine(t)+u._convertObject(i,t,r+1):l+=" "+u._val(i)+u._endLine(t)}),this);return l},t.prototype._beginLine=function(e,t,r){void 0===r&&(r=!1);var n=e.offset+t+1,i=new Array(n).join(e.indent);return r?i.substr(0,i.length-2)+"-"+i.substr(-1,1):i},t.prototype._endLine=function(e){return e.newline},t.prototype._key=function(e){return'"'+e+'":'},t.prototype._val=function(e){return JSON.stringify(e)},t}(r(50).BaseWriter);t.YAMLWriter=u},function(e,t,r){var n=r(4),i=r(82),o=String.fromCharCode,a=String.fromCodePoint;n({target:"String",stat:!0,forced:!!a&&1!=a.length},{fromCodePoint:function(e){for(var t,r=[],n=arguments.length,a=0;n>a;){if(t=+arguments[a++],i(t,1114111)!==t)throw RangeError(t+" is not a valid code point");r.push(t<65536?o(t):o(55296+((t-=65536)>>10),t%1024+56320))}return r.join("")}})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),r(109).dom.setFeatures(!0);var n=r(109);t.DOMImplementation=n.DOMImplementation;var i=r(271);t.DOMParser=i.DOMParser;var o=r(274);t.XMLSerializer=o.XMLSerializer},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(3),i=r(0),o=function(){function e(){}return e.prototype.before=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var r=n.Cast.asNode(this),o=r._parent;if(null!==o){for(var a=r._previousSibling,s=!0;s&&a;){s=!1;for(var u=0;u<e.length;u++){var l=e[u];if(l===a){a=a._previousSibling,s=!0;break}}}var c=i.parentNode_convertNodesIntoANode(e,r._nodeDocument);a=null===a?o._firstChild:a._nextSibling,i.mutation_preInsert(c,o,a)}},e.prototype.after=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var r=n.Cast.asNode(this),o=r._parent;if(o){for(var a=r._nextSibling,s=!0;s&&a;){s=!1;for(var u=0;u<e.length;u++){var l=e[u];if(l===a){a=a._nextSibling,s=!0;break}}}var c=i.parentNode_convertNodesIntoANode(e,r._nodeDocument);i.mutation_preInsert(c,o,a)}},e.prototype.replaceWith=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var r=n.Cast.asNode(this),o=r._parent;if(o){for(var a=r._nextSibling,s=!0;s&&a;){s=!1;for(var u=0;u<e.length;u++){var l=e[u];if(l===a){a=a._nextSibling,s=!0;break}}}var c=i.parentNode_convertNodesIntoANode(e,r._nodeDocument);r._parent===o?i.mutation_replace(r,c,o):i.mutation_preInsert(c,o,a)}},e.prototype.remove=function(){var e=n.Cast.asNode(this),t=e._parent;t&&i.mutation_remove(e,t)},e}();t.ChildNodeImpl=o},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){};t.DocumentOrShadowRootImpl=n},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(6),o=r(3),a=r(7),s=function(){function e(e){this._nodeList=[],this._recordQueue=[],this._callback=e;var t=i.dom.window;a.set.append(t._mutationObservers,this)}return e.prototype.observe=function(e,t){var r,i;if(void 0===(t=t||{childList:!1,subtree:!1}).attributeOldValue&&void 0===t.attributeFilter||void 0!==t.attributes||(t.attributes=!0),void 0!==t.characterDataOldValue&&void 0===t.characterData&&(t.characterData=!0),!t.childList&&!t.attributes&&!t.characterData)throw new TypeError;if(t.attributeOldValue&&!t.attributes)throw new TypeError;if(void 0!==t.attributeFilter&&!t.attributes)throw new TypeError;if(t.characterDataOldValue&&!t.characterData)throw new TypeError;var s=!1,u=t,l=function(e){var t,r;if(e.observer===c){s=!0;try{for(var i=(t=void 0,n(c._nodeList)),l=i.next();!l.done;l=i.next()){var h=l.value;a.list.remove(h._registeredObserverList,(function(t){return o.Guard.isTransientRegisteredObserver(t)&&t.source===e}))}}catch(e){t={error:e}}finally{try{l&&!l.done&&(r=i.return)&&r.call(i)}finally{if(t)throw t.error}}e.options=u}},c=this;try{for(var h=n(e._registeredObserverList),p=h.next();!p.done;p=h.next()){l(p.value)}}catch(e){r={error:e}}finally{try{p&&!p.done&&(i=h.return)&&i.call(h)}finally{if(r)throw r.error}}s||(e._registeredObserverList.push({observer:this,options:t}),this._nodeList.push(e))},e.prototype.disconnect=function(){var e,t,r=this;try{for(var i=n(this._nodeList),o=i.next();!o.done;o=i.next()){var s=o.value;a.list.remove(s._registeredObserverList,(function(e){return e.observer===r}))}}catch(t){e={error:t}}finally{try{o&&!o.done&&(t=i.return)&&t.call(i)}finally{if(e)throw e.error}}this._recordQueue=[]},e.prototype.takeRecords=function(){var e=this._recordQueue;return this._recordQueue=[],e},e}();t.MutationObserverImpl=s},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(3),i=function(){function e(){}return Object.defineProperty(e.prototype,"previousElementSibling",{get:function(){for(var e=n.Cast.asNode(this)._previousSibling;e;){if(n.Guard.isElementNode(e))return e;e=e._previousSibling}return null},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"nextElementSibling",{get:function(){for(var e=n.Cast.asNode(this)._nextSibling;e;){if(n.Guard.isElementNode(e))return e;e=e._nextSibling}return null},enumerable:!0,configurable:!0}),e}();t.NonDocumentTypeChildNodeImpl=i},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(3),i=r(0),o=function(){function e(){}return e.prototype.getElementById=function(e){for(var t=i.tree_getFirstDescendantNode(n.Cast.asNode(this),!1,!1,(function(e){return n.Guard.isElementNode(e)}));null!==t;){if(t._uniqueIdentifier===e)return t;t=i.tree_getNextDescendantNode(n.Cast.asNode(this),t,!1,!1,(function(e){return n.Guard.isElementNode(e)}))}return null},e}();t.NonElementParentNodeImpl=o},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(3),o=r(0),a=function(){function e(){}return Object.defineProperty(e.prototype,"children",{get:function(){return o.create_htmlCollection(i.Cast.asNode(this))},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"firstElementChild",{get:function(){for(var e=i.Cast.asNode(this)._firstChild;e;){if(i.Guard.isElementNode(e))return e;e=e._nextSibling}return null},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"lastElementChild",{get:function(){for(var e=i.Cast.asNode(this)._lastChild;e;){if(i.Guard.isElementNode(e))return e;e=e._previousSibling}return null},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"childElementCount",{get:function(){var e,t,r=0;try{for(var o=n(i.Cast.asNode(this)._children),a=o.next();!a.done;a=o.next()){var s=a.value;i.Guard.isElementNode(s)&&r++}}catch(t){e={error:t}}finally{try{a&&!a.done&&(t=o.return)&&t.call(o)}finally{if(e)throw e.error}}return r},enumerable:!0,configurable:!0}),e.prototype.prepend=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var r=i.Cast.asNode(this),n=o.parentNode_convertNodesIntoANode(e,r._nodeDocument);o.mutation_preInsert(n,r,r._firstChild)},e.prototype.append=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var r=i.Cast.asNode(this),n=o.parentNode_convertNodesIntoANode(e,r._nodeDocument);o.mutation_append(n,r)},e.prototype.querySelector=function(e){var t=i.Cast.asNode(this),r=o.selectors_scopeMatchASelectorsString(e,t);return 0===r.length?null:r[0]},e.prototype.querySelectorAll=function(e){var t=i.Cast.asNode(this),r=o.selectors_scopeMatchASelectorsString(e,t);return o.create_nodeListStatic(t,r)},e}();t.ParentNodeImpl=a},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),i=function(){function e(){}return Object.defineProperty(e.prototype,"_name",{get:function(){return this.__name||""},set:function(e){this.__name=e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"_assignedSlot",{get:function(){return this.__assignedSlot||null},set:function(e){this.__assignedSlot=e},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"assignedSlot",{get:function(){return n.shadowTree_findASlot(this,!0)},enumerable:!0,configurable:!0}),e}();t.SlotableImpl=i},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(101),a=r(9),s=r(3),u=function(e){function t(t){var r=e.call(this)||this;if(s.Guard.isDocumentTypeNode(t.startContainer)||s.Guard.isAttrNode(t.startContainer)||s.Guard.isDocumentTypeNode(t.endContainer)||s.Guard.isAttrNode(t.endContainer))throw new a.InvalidNodeTypeError;return r._start=[t.startContainer,t.startOffset],r._end=[t.endContainer,t.endOffset],r}return i(t,e),t}(o.AbstractRangeImpl);t.StaticRangeImpl=u},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(272);t.DOMParser=n.DOMParserImpl},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),i=r(273),o=function(){function e(){}return e.prototype.parseFromString=function(e,t){if("text/html"===t)throw new Error("HTML parser not implemented.");try{return(r=(new i.XMLParserImpl).parse(e))._contentType=t,r}catch(e){var r,o="http://www.mozilla.org/newlayout/xml/parsererror.xml",a=(r=n.create_xmlDocument()).createElementNS(o,"parsererror"),s=r.createElementNS(o,"error");return s.setAttribute("message",e.message),a.appendChild(s),r.appendChild(a),r}},e}();t.DOMParserImpl=o},function(e,t,r){"use strict";var n=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},i=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var o=r(179),a=r(110),s=r(7),u=r(0),l=r(68),c=function(){function e(){}return e.prototype.parse=function(e){for(var t,r,c,h,p=new o.XMLStringLexer(e,{skipWhitespaceOnlyText:!0}),f=u.create_document(),d=f,m=p.nextToken();m.type!==a.TokenType.EOF;){switch(m.type){case a.TokenType.Declaration:var y=m;if("1.0"!==y.version)throw new Error("Invalid xml version: "+y.version);break;case a.TokenType.DocType:var v=m;if(!u.xml_isPubidChar(v.pubId))throw new Error("DocType public identifier does not match PubidChar construct.");if(!u.xml_isLegalChar(v.sysId)||-1!==v.sysId.indexOf('"')&&-1!==v.sysId.indexOf("'"))throw new Error("DocType system identifier contains invalid characters.");d.appendChild(f.implementation.createDocumentType(v.name,v.pubId,v.sysId));break;case a.TokenType.CDATA:var _=m;if(!u.xml_isLegalChar(_.data)||-1!==_.data.indexOf("]]>"))throw new Error("CDATA contains invalid characters.");d.appendChild(f.createCDATASection(_.data));break;case a.TokenType.Comment:var g=m;if(!u.xml_isLegalChar(g.data)||-1!==g.data.indexOf("--")||g.data.endsWith("-"))throw new Error("Comment data contains invalid characters.");d.appendChild(f.createComment(g.data));break;case a.TokenType.PI:var b=m;if(-1!==b.target.indexOf(":")||/^xml$/i.test(b.target))throw new Error("Processing instruction target contains invalid characters.");if(!u.xml_isLegalChar(b.data)||-1!==b.data.indexOf("?>"))throw new Error("Processing instruction data contains invalid characters.");d.appendChild(f.createProcessingInstruction(b.target,b.data));break;case a.TokenType.Text:var x=m;if(!u.xml_isLegalChar(x.data))throw new Error("Text data contains invalid characters.");d.appendChild(f.createTextNode(x.data));break;case a.TokenType.Element:var w=m,E=n(u.namespace_extractQName(w.name),2),D=E[0],S=E[1];if(-1!==S.indexOf(":")||!u.xml_isName(S))throw new Error("Node local name contains invalid characters.");if("xmlns"===D)throw new Error("An element cannot have the 'xmlns' prefix.");var C=d.lookupNamespaceURI(D),A={};try{for(var N=(t=void 0,i(w.attributes)),T=N.next();!T.done;T=N.next()){var O=n(T.value,2),F=O[0],k=O[1];if("xmlns"===F)C=k;else{var P=n(u.namespace_extractQName(F),2),I=P[0],L=P[1];"xmlns"===I&&(L===D&&(C=k),A[L]=k)}}}catch(e){t={error:e}}finally{try{T&&!T.done&&(r=N.return)&&r.call(N)}finally{if(t)throw t.error}}var M=null!==C?f.createElementNS(C,w.name):f.createElement(w.name);d.appendChild(M);var B=new l.LocalNameSet;try{for(var j=(c=void 0,i(w.attributes)),R=j.next();!R.done;R=j.next()){var z=n(R.value,2),U=(F=z[0],k=z[1],n(u.namespace_extractQName(F),2)),G=(I=U[0],L=U[1],null);if("xmlns"===I||null===I&&"xmlns"===L?G=s.namespace.XMLNS:null!==(G=M.lookupNamespaceURI(I))&&M.isDefaultNamespace(G)?G=null:null===G&&null!==I&&(G=A[I]||null),B.has(G,L))throw new Error("Element contains duplicate attributes.");if(B.set(G,L),G===s.namespace.XMLNS&&k===s.namespace.XMLNS)throw new Error("XMLNS namespace is reserved.");if(-1!==L.indexOf(":")||!u.xml_isName(L))throw new Error("Attribute local name contains invalid characters.");if("xmlns"===I&&""===k)throw new Error("Empty XML namespace is not allowed.");null!==G?M.setAttributeNS(G,F,k):M.setAttribute(F,k)}}catch(e){c={error:e}}finally{try{R&&!R.done&&(h=j.return)&&h.call(j)}finally{if(c)throw c.error}}w.selfClosing||(d=M);break;case a.TokenType.ClosingTag:if(m.name!==d.nodeName)throw new Error("Closing tag name does not match opening tag name.");d._parent&&(d=d._parent)}m=p.nextToken()}return f},e}();t.XMLParserImpl=c},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(275);t.XMLSerializer=n.XMLSerializerImpl},function(e,t,r){"use strict";var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var i=r(2),o=r(68),a=r(94),s=r(9),u=r(7),l=r(0),c=function(){function e(){}return e.prototype.serializeToString=function(e){return this._xmlSerialization(e,!1)},e.prototype._xmlSerialization=function(e,t){if(void 0===e._nodeDocument||e._nodeDocument._hasNamespaces){var r=new a.NamespacePrefixMap;r.set("xml",u.namespace.XML);try{return this._serializeNodeNS(e,null,r,{value:1},t)}catch(e){throw new s.InvalidStateError}}else try{return this._serializeNode(e,t)}catch(e){throw new s.InvalidStateError}},e.prototype._serializeNodeNS=function(e,t,r,n,o){switch(e.nodeType){case i.NodeType.Element:return this._serializeElementNS(e,t,r,n,o);case i.NodeType.Document:return this._serializeDocumentNS(e,t,r,n,o);case i.NodeType.Comment:return this._serializeComment(e,o);case i.NodeType.Text:return this._serializeText(e,o);case i.NodeType.DocumentFragment:return this._serializeDocumentFragmentNS(e,t,r,n,o);case i.NodeType.DocumentType:return this._serializeDocumentType(e,o);case i.NodeType.ProcessingInstruction:return this._serializeProcessingInstruction(e,o);case i.NodeType.CData:return this._serializeCData(e,o);default:throw new Error("Unknown node type: "+e.nodeType)}},e.prototype._serializeNode=function(e,t){switch(e.nodeType){case i.NodeType.Element:return this._serializeElement(e,t);case i.NodeType.Document:return this._serializeDocument(e,t);case i.NodeType.Comment:return this._serializeComment(e,t);case i.NodeType.Text:return this._serializeText(e,t);case i.NodeType.DocumentFragment:return this._serializeDocumentFragment(e,t);case i.NodeType.DocumentType:return this._serializeDocumentType(e,t);case i.NodeType.ProcessingInstruction:return this._serializeProcessingInstruction(e,t);case i.NodeType.CData:return this._serializeCData(e,t);default:throw new Error("Unknown node type: "+e.nodeType)}},e.prototype._serializeElementNS=function(t,r,i,o,a){var s,c;if(a&&(-1!==t.localName.indexOf(":")||!l.xml_isName(t.localName)))throw new Error("Node local name contains invalid characters (well-formed required).");var h="<",p="",f=!1,d=!1,m=i.copy(),y={},v=this._recordNamespaceInformation(t,m,y),_=r,g=t.namespaceURI;if(_===g)null!==v&&(d=!0),h+=p=g===u.namespace.XML?"xml:"+t.localName:t.localName;else{var b=t.prefix,x=null;if(null===b&&g===v||(x=m.get(b,g)),"xmlns"===b){if(a)throw new Error("An element cannot have the 'xmlns' prefix (well-formed required).");x=b}null!==x?(p=x+":"+t.localName,null!==v&&v!==u.namespace.XML&&(_=v||null),h+=p):null!==b?(b in y&&(b=this._generatePrefix(g,m,o)),m.set(b,g),h+=p+=b+":"+t.localName,h+=" xmlns:"+b+'="'+this._serializeAttributeValue(g,a)+'"',null!==v&&(_=v||null)):null===v||null!==v&&v!==g?(d=!0,_=g,h+=p+=t.localName,h+=' xmlns="'+this._serializeAttributeValue(g,a)+'"'):(_=g,h+=p+=t.localName)}h+=this._serializeAttributesNS(t,m,o,y,d,a);var w=g===u.namespace.HTML;if(w&&0===t.childNodes.length&&e._VoidElementNames.has(t.localName)?(h+=" /",f=!0):w||0!==t.childNodes.length||(h+="/",f=!0),h+=">",f)return h;if(w&&"template"===t.localName);else try{for(var E=n(t._children||t.childNodes),D=E.next();!D.done;D=E.next()){var S=D.value;h+=this._serializeNodeNS(S,_,m,o,a)}}catch(e){s={error:e}}finally{try{D&&!D.done&&(c=E.return)&&c.call(E)}finally{if(s)throw s.error}}return h+="</"+p+">"},e.prototype._serializeDocumentNS=function(e,t,r,i,o){var a,s;if(o&&null===e.documentElement)throw new Error("Missing document element (well-formed required).");var u="";try{for(var l=n(e._children||e.childNodes),c=l.next();!c.done;c=l.next()){var h=c.value;u+=this._serializeNodeNS(h,t,r,i,o)}}catch(e){a={error:e}}finally{try{c&&!c.done&&(s=l.return)&&s.call(l)}finally{if(a)throw a.error}}return u},e.prototype._serializeComment=function(e,t){if(t&&(!l.xml_isLegalChar(e.data)||-1!==e.data.indexOf("--")||e.data.endsWith("-")))throw new Error("Comment data contains invalid characters (well-formed required).");return"\x3c!--"+e.data+"--\x3e"},e.prototype._serializeText=function(e,t){if(t&&!l.xml_isLegalChar(e.data))throw new Error("Text data contains invalid characters (well-formed required).");for(var r="",n=0;n<e.data.length;n++){var i=e.data[n];r+="&"===i?"&amp;":"<"===i?"&lt;":">"===i?"&gt;":i}return r},e.prototype._serializeDocumentFragmentNS=function(e,t,r,i,o){var a,s,u="";try{for(var l=n(e._children||e.childNodes),c=l.next();!c.done;c=l.next()){var h=c.value;u+=this._serializeNodeNS(h,t,r,i,o)}}catch(e){a={error:e}}finally{try{c&&!c.done&&(s=l.return)&&s.call(l)}finally{if(a)throw a.error}}return u},e.prototype._serializeDocumentType=function(e,t){if(t&&!l.xml_isPubidChar(e.publicId))throw new Error("DocType public identifier does not match PubidChar construct (well-formed required).");if(t&&(!l.xml_isLegalChar(e.systemId)||-1!==e.systemId.indexOf('"')&&-1!==e.systemId.indexOf("'")))throw new Error("DocType system identifier contains invalid characters (well-formed required).");return e.publicId&&e.systemId?"<!DOCTYPE "+e.name+' PUBLIC "'+e.publicId+'" "'+e.systemId+'">':e.publicId?"<!DOCTYPE "+e.name+' PUBLIC "'+e.publicId+'">':e.systemId?"<!DOCTYPE "+e.name+' SYSTEM "'+e.systemId+'">':"<!DOCTYPE "+e.name+">"},e.prototype._serializeProcessingInstruction=function(e,t){if(t&&(-1!==e.target.indexOf(":")||/^xml$/i.test(e.target)))throw new Error("Processing instruction target contains invalid characters (well-formed required).");if(t&&(!l.xml_isLegalChar(e.data)||-1!==e.data.indexOf("?>")))throw new Error("Processing instruction data contains invalid characters (well-formed required).");return"<?"+(""===e.data?e.target:e.target+" "+e.data)+"?>"},e.prototype._serializeCData=function(e,t){if(t&&-1!==e.data.indexOf("]]>"))throw new Error("CDATA contains invalid characters (well-formed required).");return"<![CDATA["+e.data+"]]>"},e.prototype._serializeAttributesNS=function(e,t,r,i,a,s){var c,h,p="",f=s?new o.LocalNameSet:void 0;try{for(var d=n(e.attributes),m=d.next();!m.done;m=d.next()){var y=m.value;if(a||s||null!==y.namespaceURI){if(s&&f&&f.has(y.namespaceURI,y.localName))throw new Error("Element contains duplicate attributes (well-formed required).");s&&f&&f.set(y.namespaceURI,y.localName);var v=y.namespaceURI,_=null;if(null!==v)if(_=t.get(y.prefix,v),v===u.namespace.XMLNS){if(y.value===u.namespace.XML||null===y.prefix&&a||null!==y.prefix&&(!(y.localName in i)||i[y.localName]!==y.value)&&t.has(y.localName,y.value))continue;if(s&&y.value===u.namespace.XMLNS)throw new Error("XMLNS namespace is reserved (well-formed required).");if(s&&""===y.value)throw new Error("Namespace prefix declarations cannot be used to undeclare a namespace (well-formed required).");"xmlns"===y.prefix&&(_="xmlns")}else null===_&&(p+=" xmlns:"+(_=null===y.prefix||t.hasPrefix(y.prefix)&&!t.has(y.prefix,v)?this._generatePrefix(v,t,r):y.prefix)+'="'+this._serializeAttributeValue(v,s)+'"');if(p+=" ",null!==_&&(p+=_+":"),s&&(-1!==y.localName.indexOf(":")||!l.xml_isName(y.localName)||"xmlns"===y.localName&&null===v))throw new Error("Attribute local name contains invalid characters (well-formed required).");p+=y.localName+'="'+this._serializeAttributeValue(y.value,s)+'"'}else p+=" "+y.localName+'="'+this._serializeAttributeValue(y.value,s)+'"'}}catch(e){c={error:e}}finally{try{m&&!m.done&&(h=d.return)&&h.call(d)}finally{if(c)throw c.error}}return p},e.prototype._recordNamespaceInformation=function(e,t,r){var i,o,a=null;try{for(var s=n(e.attributes),l=s.next();!l.done;l=s.next()){var c=l.value,h=c.namespaceURI,p=c.prefix;if(h===u.namespace.XMLNS){if(null===p){a=c.value;continue}var f=c.localName,d=c.value;if(d===u.namespace.XML)continue;if(""===d&&(d=null),t.has(f,d))continue;t.set(f,d),r[f]=d||""}}}catch(e){i={error:e}}finally{try{l&&!l.done&&(o=s.return)&&o.call(s)}finally{if(i)throw i.error}}return a},e.prototype._generatePrefix=function(e,t,r){var n="ns"+r.value;return r.value++,t.set(n,e),n},e.prototype._serializeAttributeValue=function(e,t){if(t&&null!==e&&!l.xml_isLegalChar(e))throw new Error("Invalid characters in attribute value.");if(null===e)return"";for(var r="",n=0;n<e.length;n++){var i=e[n];r+='"'===i?"&quot;":"&"===i?"&amp;":"<"===i?"&lt;":">"===i?"&gt;":i}return r},e.prototype._serializeElement=function(e,t){var r,i;if(t&&(-1!==e.localName.indexOf(":")||!l.xml_isName(e.localName)))throw new Error("Node local name contains invalid characters (well-formed required).");var o=!1,a=e.localName,s="<"+a;if(s+=this._serializeAttributes(e,t),0===e._children.size&&(s+="/",o=!0),s+=">",o)return s;try{for(var u=n(e._children),c=u.next();!c.done;c=u.next()){var h=c.value;s+=this._serializeNode(h,t)}}catch(e){r={error:e}}finally{try{c&&!c.done&&(i=u.return)&&i.call(u)}finally{if(r)throw r.error}}return s+="</"+a+">"},e.prototype._serializeDocument=function(e,t){var r,i;if(t&&null===e.documentElement)throw new Error("Missing document element (well-formed required).");var o="";try{for(var a=n(e._children),s=a.next();!s.done;s=a.next()){var u=s.value;o+=this._serializeNode(u,t)}}catch(e){r={error:e}}finally{try{s&&!s.done&&(i=a.return)&&i.call(a)}finally{if(r)throw r.error}}return o},e.prototype._serializeDocumentFragment=function(e,t){var r,i,o="";try{for(var a=n(e._children),s=a.next();!s.done;s=a.next()){var u=s.value;o+=this._serializeNode(u,t)}}catch(e){r={error:e}}finally{try{s&&!s.done&&(i=a.return)&&i.call(a)}finally{if(r)throw r.error}}return o},e.prototype._serializeAttributes=function(e,t){var r,i,o="",a=t?{}:void 0;try{for(var s=n(e.attributes),u=s.next();!u.done;u=s.next()){var c=u.value;if(t&&a&&c.localName in a)throw new Error("Element contains duplicate attributes (well-formed required).");if(t&&a&&(a[c.localName]=!0),t&&(-1!==c.localName.indexOf(":")||!l.xml_isName(c.localName)))throw new Error("Attribute local name contains invalid characters (well-formed required).");o+=" "+c.localName+'="'+this._serializeAttributeValue(c.value,t)+'"'}}catch(e){r={error:e}}finally{try{u&&!u.done&&(i=s.return)&&i.call(s)}finally{if(r)throw r.error}}return o},e._VoidElementNames=new Set(["area","base","basefont","bgsound","br","col","embed","frame","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"]),e}();t.XMLSerializerImpl=c},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(277);t.XMLReader=n.XMLReader;var i=r(111);t.ObjectReader=i.ObjectReader;var o=r(280);t.JSONReader=o.JSONReader;var a=r(281);t.YAMLReader=a.YAMLReader},function(e,t,r){"use strict";r(31),r(32),r(33),r(19),r(65),r(20),r(22),r(23);var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a},a=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(t,"__esModule",{value:!0});var s=r(179),u=r(110),l=r(7),c=r(0),h=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return i(t,e),t.prototype._parse=function(e,t){for(var r,n,i,h,p=new s.XMLStringLexer(t,{skipWhitespaceOnlyText:!0}),f=e,d=p.nextToken();d.type!==u.TokenType.EOF;){switch(d.type){case u.TokenType.Declaration:var m=d,y=this.sanitize(m.version);if("1.0"!==y)throw new Error("Invalid xml version: "+y);var v={version:y};m.encoding&&(v.encoding=this.sanitize(m.encoding)),m.standalone&&(v.standalone="yes"===this.sanitize(m.standalone)),f.set(v);break;case u.TokenType.DocType:var _=d;f=this.docType(f,this.sanitize(_.name),this.sanitize(_.pubId),this.sanitize(_.sysId))||f;break;case u.TokenType.CDATA:var g=d;f=this.cdata(f,this.sanitize(g.data))||f;break;case u.TokenType.Comment:var b=d;f=this.comment(f,this.sanitize(b.data))||f;break;case u.TokenType.PI:var x=d;f=this.instruction(f,this.sanitize(x.target),this.sanitize(x.data))||f;break;case u.TokenType.Text:var w=d;f=this.text(f,this.sanitize(w.data))||f;break;case u.TokenType.Element:var E=d,D=this.sanitize(E.name),S=o(c.namespace_extractQName(D),1)[0],C=f.node.lookupNamespaceURI(S),A={};try{for(var N=(r=void 0,a(E.attributes)),T=N.next();!T.done;T=N.next()){var O=o(T.value,2),F=O[0],k=O[1];if(F=this.sanitize(F),k=this.sanitize(k),"xmlns"===F)C=k;else{var P=o(c.namespace_extractQName(F),2),I=P[0],L=P[1];"xmlns"===I&&(L===S&&(C=k),A[L]=k)}}}catch(e){r={error:e}}finally{try{T&&!T.done&&(n=N.return)&&n.call(N)}finally{if(r)throw r.error}}var M=null!==C?this.element(f,C,D):this.element(f,void 0,D);if(void 0===M)break;try{for(var B=(i=void 0,a(E.attributes)),j=B.next();!j.done;j=B.next()){var R=o(j.value,2);F=R[0],k=R[1];F=this.sanitize(F),k=this.sanitize(k);var z=o(c.namespace_extractQName(F),2),U=(I=z[0],L=z[1],null);"xmlns"===I||null===I&&"xmlns"===L?U=l.namespace.XMLNS:null!==(U=M.node.lookupNamespaceURI(I))&&M.node.isDefaultNamespace(U)?U=null:null===U&&null!==I&&(U=A[I]||null),null!==U?this.attribute(M,U,F,k):this.attribute(M,void 0,F,k)}}catch(e){i={error:e}}finally{try{j&&!j.done&&(h=B.return)&&h.call(B)}finally{if(i)throw i.error}}E.selfClosing||(f=M);break;case u.TokenType.ClosingTag:f.node.parentNode&&(f=f.up())}d=p.nextToken()}return f},t}(r(74).BaseReader);t.XMLReader=h},function(e,t,r){var n=r(4),i=r(279);n({target:"Object",stat:!0,forced:Object.assign!==i},{assign:i})},function(e,t,r){"use strict";var n=r(16),i=r(8),o=r(61),a=r(84),s=r(78),u=r(27),l=r(41),c=Object.assign,h=Object.defineProperty;e.exports=!c||i((function(){if(n&&1!==c({b:1},c(h({},"a",{enumerable:!0,get:function(){h(this,"b",{value:3,enumerable:!1})}}),{b:2})).b)return!0;var e={},t={},r=Symbol();return e[r]=7,"abcdefghijklmnopqrst".split("").forEach((function(e){t[e]=e})),7!=c({},e)[r]||"abcdefghijklmnopqrst"!=o(c({},t)).join("")}))?function(e,t){for(var r=u(e),i=arguments.length,c=1,h=a.f,p=s.f;i>c;)for(var f,d=l(arguments[c++]),m=h?o(d).concat(h(d)):o(d),y=m.length,v=0;y>v;)f=m[v++],n&&!p.call(d,f)||(r[f]=d[f]);return r}:c},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(111),a=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return i(t,e),t.prototype._parse=function(e,t){return new o.ObjectReader(this._builderOptions).parse(e,JSON.parse(t))},t}(r(74).BaseReader);t.JSONReader=a},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(111),a=r(74),s=r(282),u=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return i(t,e),t.prototype._parse=function(e,t){var r=s.safeLoad(t);if(void 0===r)throw new Error("Unable to parse YAML document.");return new o.ObjectReader(this._builderOptions).parse(e,r)},t}(a.BaseReader);t.YAMLReader=u},function(e,t,r){"use strict";var n=r(283);e.exports=n},function(e,t,r){"use strict";var n=r(284),i=r(303);function o(e){return function(){throw new Error("Function "+e+" is deprecated and cannot be used.")}}e.exports.Type=r(10),e.exports.Schema=r(39),e.exports.FAILSAFE_SCHEMA=r(112),e.exports.JSON_SCHEMA=r(181),e.exports.CORE_SCHEMA=r(180),e.exports.DEFAULT_SAFE_SCHEMA=r(54),e.exports.DEFAULT_FULL_SCHEMA=r(75),e.exports.load=n.load,e.exports.loadAll=n.loadAll,e.exports.safeLoad=n.safeLoad,e.exports.safeLoadAll=n.safeLoadAll,e.exports.dump=i.dump,e.exports.safeDump=i.safeDump,e.exports.YAMLException=r(53),e.exports.MINIMAL_SCHEMA=r(112),e.exports.SAFE_SCHEMA=r(54),e.exports.DEFAULT_SCHEMA=r(75),e.exports.scan=o("scan"),e.exports.parse=o("parse"),e.exports.compose=o("compose"),e.exports.addConstructor=o("addConstructor")},function(e,t,r){"use strict";var n=r(38),i=r(53),o=r(285),a=r(54),s=r(75),u=Object.prototype.hasOwnProperty,l=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,c=/[\x85\u2028\u2029]/,h=/[,\[\]\{\}]/,p=/^(?:!|!!|![a-z\-]+!)$/i,f=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function d(e){return Object.prototype.toString.call(e)}function m(e){return 10===e||13===e}function y(e){return 9===e||32===e}function v(e){return 9===e||32===e||10===e||13===e}function _(e){return 44===e||91===e||93===e||123===e||125===e}function g(e){var t;return 48<=e&&e<=57?e-48:97<=(t=32|e)&&t<=102?t-97+10:-1}function b(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e||9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function x(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}for(var w=new Array(256),E=new Array(256),D=0;D<256;D++)w[D]=b(D)?1:0,E[D]=b(D);function S(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||s,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.documents=[]}function C(e,t){return new i(t,new o(e.filename,e.input,e.position,e.line,e.position-e.lineStart))}function A(e,t){throw C(e,t)}function N(e,t){e.onWarning&&e.onWarning.call(null,C(e,t))}var T={YAML:function(e,t,r){var n,i,o;null!==e.version&&A(e,"duplication of %YAML directive"),1!==r.length&&A(e,"YAML directive accepts exactly one argument"),null===(n=/^([0-9]+)\.([0-9]+)$/.exec(r[0]))&&A(e,"ill-formed argument of the YAML directive"),i=parseInt(n[1],10),o=parseInt(n[2],10),1!==i&&A(e,"unacceptable YAML version of the document"),e.version=r[0],e.checkLineBreaks=o<2,1!==o&&2!==o&&N(e,"unsupported YAML version of the document")},TAG:function(e,t,r){var n,i;2!==r.length&&A(e,"TAG directive accepts exactly two arguments"),n=r[0],i=r[1],p.test(n)||A(e,"ill-formed tag handle (first argument) of the TAG directive"),u.call(e.tagMap,n)&&A(e,'there is a previously declared suffix for "'+n+'" tag handle'),f.test(i)||A(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagMap[n]=i}};function O(e,t,r,n){var i,o,a,s;if(t<r){if(s=e.input.slice(t,r),n)for(i=0,o=s.length;i<o;i+=1)9===(a=s.charCodeAt(i))||32<=a&&a<=1114111||A(e,"expected valid JSON character");else l.test(s)&&A(e,"the stream contains non-printable characters");e.result+=s}}function F(e,t,r,i){var o,a,s,l;for(n.isObject(r)||A(e,"cannot merge mappings; the provided source object is unacceptable"),s=0,l=(o=Object.keys(r)).length;s<l;s+=1)a=o[s],u.call(t,a)||(t[a]=r[a],i[a]=!0)}function k(e,t,r,n,i,o,a,s){var l,c;if(Array.isArray(i))for(l=0,c=(i=Array.prototype.slice.call(i)).length;l<c;l+=1)Array.isArray(i[l])&&A(e,"nested arrays are not supported inside keys"),"object"==typeof i&&"[object Object]"===d(i[l])&&(i[l]="[object Object]");if("object"==typeof i&&"[object Object]"===d(i)&&(i="[object Object]"),i=String(i),null===t&&(t={}),"tag:yaml.org,2002:merge"===n)if(Array.isArray(o))for(l=0,c=o.length;l<c;l+=1)F(e,t,o[l],r);else F(e,t,o,r);else e.json||u.call(r,i)||!u.call(t,i)||(e.line=a||e.line,e.position=s||e.position,A(e,"duplicated mapping key")),t[i]=o,delete r[i];return t}function P(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):A(e,"a line break is expected"),e.line+=1,e.lineStart=e.position}function I(e,t,r){for(var n=0,i=e.input.charCodeAt(e.position);0!==i;){for(;y(i);)i=e.input.charCodeAt(++e.position);if(t&&35===i)do{i=e.input.charCodeAt(++e.position)}while(10!==i&&13!==i&&0!==i);if(!m(i))break;for(P(e),i=e.input.charCodeAt(e.position),n++,e.lineIndent=0;32===i;)e.lineIndent++,i=e.input.charCodeAt(++e.position)}return-1!==r&&0!==n&&e.lineIndent<r&&N(e,"deficient indentation"),n}function L(e){var t,r=e.position;return!(45!==(t=e.input.charCodeAt(r))&&46!==t||t!==e.input.charCodeAt(r+1)||t!==e.input.charCodeAt(r+2)||(r+=3,0!==(t=e.input.charCodeAt(r))&&!v(t)))}function M(e,t){1===t?e.result+=" ":t>1&&(e.result+=n.repeat("\n",t-1))}function B(e,t){var r,n,i=e.tag,o=e.anchor,a=[],s=!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),n=e.input.charCodeAt(e.position);0!==n&&45===n&&v(e.input.charCodeAt(e.position+1));)if(s=!0,e.position++,I(e,!0,-1)&&e.lineIndent<=t)a.push(null),n=e.input.charCodeAt(e.position);else if(r=e.line,z(e,t,3,!1,!0),a.push(e.result),I(e,!0,-1),n=e.input.charCodeAt(e.position),(e.line===r||e.lineIndent>t)&&0!==n)A(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!s&&(e.tag=i,e.anchor=o,e.kind="sequence",e.result=a,!0)}function j(e){var t,r,n,i,o=!1,a=!1;if(33!==(i=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&A(e,"duplication of a tag property"),60===(i=e.input.charCodeAt(++e.position))?(o=!0,i=e.input.charCodeAt(++e.position)):33===i?(a=!0,r="!!",i=e.input.charCodeAt(++e.position)):r="!",t=e.position,o){do{i=e.input.charCodeAt(++e.position)}while(0!==i&&62!==i);e.position<e.length?(n=e.input.slice(t,e.position),i=e.input.charCodeAt(++e.position)):A(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==i&&!v(i);)33===i&&(a?A(e,"tag suffix cannot contain exclamation marks"):(r=e.input.slice(t-1,e.position+1),p.test(r)||A(e,"named tag handle cannot contain such characters"),a=!0,t=e.position+1)),i=e.input.charCodeAt(++e.position);n=e.input.slice(t,e.position),h.test(n)&&A(e,"tag suffix cannot contain flow indicator characters")}return n&&!f.test(n)&&A(e,"tag name cannot contain such characters: "+n),o?e.tag=n:u.call(e.tagMap,r)?e.tag=e.tagMap[r]+n:"!"===r?e.tag="!"+n:"!!"===r?e.tag="tag:yaml.org,2002:"+n:A(e,'undeclared tag handle "'+r+'"'),!0}function R(e){var t,r;if(38!==(r=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&A(e,"duplication of an anchor property"),r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!v(r)&&!_(r);)r=e.input.charCodeAt(++e.position);return e.position===t&&A(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function z(e,t,r,i,o){var a,s,l,c,h,p,f,d,b=1,D=!1,S=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,a=s=l=4===r||3===r,i&&I(e,!0,-1)&&(D=!0,e.lineIndent>t?b=1:e.lineIndent===t?b=0:e.lineIndent<t&&(b=-1)),1===b)for(;j(e)||R(e);)I(e,!0,-1)?(D=!0,l=a,e.lineIndent>t?b=1:e.lineIndent===t?b=0:e.lineIndent<t&&(b=-1)):l=!1;if(l&&(l=D||o),1!==b&&4!==r||(f=1===r||2===r?t:t+1,d=e.position-e.lineStart,1===b?l&&(B(e,d)||function(e,t,r){var n,i,o,a,s,u=e.tag,l=e.anchor,c={},h={},p=null,f=null,d=null,m=!1,_=!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=c),s=e.input.charCodeAt(e.position);0!==s;){if(n=e.input.charCodeAt(e.position+1),o=e.line,a=e.position,63!==s&&58!==s||!v(n)){if(!z(e,r,2,!1,!0))break;if(e.line===o){for(s=e.input.charCodeAt(e.position);y(s);)s=e.input.charCodeAt(++e.position);if(58===s)v(s=e.input.charCodeAt(++e.position))||A(e,"a whitespace character is expected after the key-value separator within a block mapping"),m&&(k(e,c,h,p,f,null),p=f=d=null),_=!0,m=!1,i=!1,p=e.tag,f=e.result;else{if(!_)return e.tag=u,e.anchor=l,!0;A(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!_)return e.tag=u,e.anchor=l,!0;A(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===s?(m&&(k(e,c,h,p,f,null),p=f=d=null),_=!0,m=!0,i=!0):m?(m=!1,i=!0):A(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,s=n;if((e.line===o||e.lineIndent>t)&&(z(e,t,4,!0,i)&&(m?f=e.result:d=e.result),m||(k(e,c,h,p,f,d,o,a),p=f=d=null),I(e,!0,-1),s=e.input.charCodeAt(e.position)),e.lineIndent>t&&0!==s)A(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return m&&k(e,c,h,p,f,null),_&&(e.tag=u,e.anchor=l,e.kind="mapping",e.result=c),_}(e,d,f))||function(e,t){var r,n,i,o,a,s,u,l,c,h,p=!0,f=e.tag,d=e.anchor,m={};if(91===(h=e.input.charCodeAt(e.position)))i=93,s=!1,n=[];else{if(123!==h)return!1;i=125,s=!0,n={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=n),h=e.input.charCodeAt(++e.position);0!==h;){if(I(e,!0,t),(h=e.input.charCodeAt(e.position))===i)return e.position++,e.tag=f,e.anchor=d,e.kind=s?"mapping":"sequence",e.result=n,!0;p||A(e,"missed comma between flow collection entries"),c=null,o=a=!1,63===h&&v(e.input.charCodeAt(e.position+1))&&(o=a=!0,e.position++,I(e,!0,t)),r=e.line,z(e,t,1,!1,!0),l=e.tag,u=e.result,I(e,!0,t),h=e.input.charCodeAt(e.position),!a&&e.line!==r||58!==h||(o=!0,h=e.input.charCodeAt(++e.position),I(e,!0,t),z(e,t,1,!1,!0),c=e.result),s?k(e,n,m,l,u,c):o?n.push(k(e,null,m,l,u,c)):n.push(u),I(e,!0,t),44===(h=e.input.charCodeAt(e.position))?(p=!0,h=e.input.charCodeAt(++e.position)):p=!1}A(e,"unexpected end of the stream within a flow collection")}(e,f)?S=!0:(s&&function(e,t){var r,i,o,a,s,u=1,l=!1,c=!1,h=t,p=0,f=!1;if(124===(a=e.input.charCodeAt(e.position)))i=!1;else{if(62!==a)return!1;i=!0}for(e.kind="scalar",e.result="";0!==a;)if(43===(a=e.input.charCodeAt(++e.position))||45===a)1===u?u=43===a?3:2:A(e,"repeat of a chomping mode identifier");else{if(!((o=48<=(s=a)&&s<=57?s-48:-1)>=0))break;0===o?A(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):c?A(e,"repeat of an indentation width identifier"):(h=t+o-1,c=!0)}if(y(a)){do{a=e.input.charCodeAt(++e.position)}while(y(a));if(35===a)do{a=e.input.charCodeAt(++e.position)}while(!m(a)&&0!==a)}for(;0!==a;){for(P(e),e.lineIndent=0,a=e.input.charCodeAt(e.position);(!c||e.lineIndent<h)&&32===a;)e.lineIndent++,a=e.input.charCodeAt(++e.position);if(!c&&e.lineIndent>h&&(h=e.lineIndent),m(a))p++;else{if(e.lineIndent<h){3===u?e.result+=n.repeat("\n",l?1+p:p):1===u&&l&&(e.result+="\n");break}for(i?y(a)?(f=!0,e.result+=n.repeat("\n",l?1+p:p)):f?(f=!1,e.result+=n.repeat("\n",p+1)):0===p?l&&(e.result+=" "):e.result+=n.repeat("\n",p):e.result+=n.repeat("\n",l?1+p:p),l=!0,c=!0,p=0,r=e.position;!m(a)&&0!==a;)a=e.input.charCodeAt(++e.position);O(e,r,e.position,!1)}}return!0}(e,f)||function(e,t){var r,n,i;if(39!==(r=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,n=i=e.position;0!==(r=e.input.charCodeAt(e.position));)if(39===r){if(O(e,n,e.position,!0),39!==(r=e.input.charCodeAt(++e.position)))return!0;n=e.position,e.position++,i=e.position}else m(r)?(O(e,n,i,!0),M(e,I(e,!1,t)),n=i=e.position):e.position===e.lineStart&&L(e)?A(e,"unexpected end of the document within a single quoted scalar"):(e.position++,i=e.position);A(e,"unexpected end of the stream within a single quoted scalar")}(e,f)||function(e,t){var r,n,i,o,a,s,u;if(34!==(s=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,r=n=e.position;0!==(s=e.input.charCodeAt(e.position));){if(34===s)return O(e,r,e.position,!0),e.position++,!0;if(92===s){if(O(e,r,e.position,!0),m(s=e.input.charCodeAt(++e.position)))I(e,!1,t);else if(s<256&&w[s])e.result+=E[s],e.position++;else if((a=120===(u=s)?2:117===u?4:85===u?8:0)>0){for(i=a,o=0;i>0;i--)(a=g(s=e.input.charCodeAt(++e.position)))>=0?o=(o<<4)+a:A(e,"expected hexadecimal character");e.result+=x(o),e.position++}else A(e,"unknown escape sequence");r=n=e.position}else m(s)?(O(e,r,n,!0),M(e,I(e,!1,t)),r=n=e.position):e.position===e.lineStart&&L(e)?A(e,"unexpected end of the document within a double quoted scalar"):(e.position++,n=e.position)}A(e,"unexpected end of the stream within a double quoted scalar")}(e,f)?S=!0:!function(e){var t,r,n;if(42!==(n=e.input.charCodeAt(e.position)))return!1;for(n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!v(n)&&!_(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&A(e,"name of an alias node must contain at least one character"),r=e.input.slice(t,e.position),e.anchorMap.hasOwnProperty(r)||A(e,'unidentified alias "'+r+'"'),e.result=e.anchorMap[r],I(e,!0,-1),!0}(e)?function(e,t,r){var n,i,o,a,s,u,l,c,h=e.kind,p=e.result;if(v(c=e.input.charCodeAt(e.position))||_(c)||35===c||38===c||42===c||33===c||124===c||62===c||39===c||34===c||37===c||64===c||96===c)return!1;if((63===c||45===c)&&(v(n=e.input.charCodeAt(e.position+1))||r&&_(n)))return!1;for(e.kind="scalar",e.result="",i=o=e.position,a=!1;0!==c;){if(58===c){if(v(n=e.input.charCodeAt(e.position+1))||r&&_(n))break}else if(35===c){if(v(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&L(e)||r&&_(c))break;if(m(c)){if(s=e.line,u=e.lineStart,l=e.lineIndent,I(e,!1,-1),e.lineIndent>=t){a=!0,c=e.input.charCodeAt(e.position);continue}e.position=o,e.line=s,e.lineStart=u,e.lineIndent=l;break}}a&&(O(e,i,o,!1),M(e,e.line-s),i=o=e.position,a=!1),y(c)||(o=e.position+1),c=e.input.charCodeAt(++e.position)}return O(e,i,o,!1),!!e.result||(e.kind=h,e.result=p,!1)}(e,f,1===r)&&(S=!0,null===e.tag&&(e.tag="?")):(S=!0,null===e.tag&&null===e.anchor||A(e,"alias node should not have any properties")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===b&&(S=l&&B(e,d))),null!==e.tag&&"!"!==e.tag)if("?"===e.tag){for(null!==e.result&&"scalar"!==e.kind&&A(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),c=0,h=e.implicitTypes.length;c<h;c+=1)if((p=e.implicitTypes[c]).resolve(e.result)){e.result=p.construct(e.result),e.tag=p.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else u.call(e.typeMap[e.kind||"fallback"],e.tag)?(p=e.typeMap[e.kind||"fallback"][e.tag],null!==e.result&&p.kind!==e.kind&&A(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+p.kind+'", not "'+e.kind+'"'),p.resolve(e.result)?(e.result=p.construct(e.result),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):A(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")):A(e,"unknown tag !<"+e.tag+">");return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||S}function U(e){var t,r,n,i,o=e.position,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap={},e.anchorMap={};0!==(i=e.input.charCodeAt(e.position))&&(I(e,!0,-1),i=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==i));){for(a=!0,i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!v(i);)i=e.input.charCodeAt(++e.position);for(n=[],(r=e.input.slice(t,e.position)).length<1&&A(e,"directive name must not be less than one character in length");0!==i;){for(;y(i);)i=e.input.charCodeAt(++e.position);if(35===i){do{i=e.input.charCodeAt(++e.position)}while(0!==i&&!m(i));break}if(m(i))break;for(t=e.position;0!==i&&!v(i);)i=e.input.charCodeAt(++e.position);n.push(e.input.slice(t,e.position))}0!==i&&P(e),u.call(T,r)?T[r](e,r,n):N(e,'unknown document directive "'+r+'"')}I(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,I(e,!0,-1)):a&&A(e,"directives end mark is expected"),z(e,e.lineIndent-1,4,!1,!0),I(e,!0,-1),e.checkLineBreaks&&c.test(e.input.slice(o,e.position))&&N(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&L(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,I(e,!0,-1)):e.position<e.length-1&&A(e,"end of the stream or a document separator is expected")}function G(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var r=new S(e,t),n=e.indexOf("\0");for(-1!==n&&(r.position=n,A(r,"null byte is not allowed in input")),r.input+="\0";32===r.input.charCodeAt(r.position);)r.lineIndent+=1,r.position+=1;for(;r.position<r.length-1;)U(r);return r.documents}function X(e,t,r){null!==t&&"object"==typeof t&&void 0===r&&(r=t,t=null);var n=G(e,r);if("function"!=typeof t)return n;for(var i=0,o=n.length;i<o;i+=1)t(n[i])}function q(e,t){var r=G(e,t);if(0!==r.length){if(1===r.length)return r[0];throw new i("expected a single document in the stream, but found more")}}e.exports.loadAll=X,e.exports.load=q,e.exports.safeLoadAll=function(e,t,r){return"object"==typeof t&&null!==t&&void 0===r&&(r=t,t=null),X(e,t,n.extend({schema:a},r))},e.exports.safeLoad=function(e,t){return q(e,n.extend({schema:a},t))}},function(e,t,r){"use strict";var n=r(38);function i(e,t,r,n,i){this.name=e,this.buffer=t,this.position=r,this.line=n,this.column=i}i.prototype.getSnippet=function(e,t){var r,i,o,a,s;if(!this.buffer)return null;for(e=e||4,t=t||75,r="",i=this.position;i>0&&-1==="\0\r\n\u2028\u2029".indexOf(this.buffer.charAt(i-1));)if(i-=1,this.position-i>t/2-1){r=" ... ",i+=5;break}for(o="",a=this.position;a<this.buffer.length&&-1==="\0\r\n\u2028\u2029".indexOf(this.buffer.charAt(a));)if((a+=1)-this.position>t/2-1){o=" ... ",a-=5;break}return s=this.buffer.slice(i,a),n.repeat(" ",e)+r+s+o+"\n"+n.repeat(" ",e+this.position-i+r.length)+"^"},i.prototype.toString=function(e){var t,r="";return this.name&&(r+='in "'+this.name+'" '),r+="at line "+(this.line+1)+", column "+(this.column+1),e||(t=this.getSnippet())&&(r+=":\n"+t),r},e.exports=i},function(e,t,r){"use strict";var n=r(10);e.exports=new n("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}})},function(e,t,r){"use strict";var n=r(10);e.exports=new n("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}})},function(e,t,r){"use strict";var n=r(10);e.exports=new n("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}})},function(e,t,r){"use strict";var n=r(10);e.exports=new n("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"}},defaultStyle:"lowercase"})},function(e,t,r){"use strict";var n=r(10);e.exports=new n("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"})},function(e,t,r){"use strict";var n=r(38),i=r(10);function o(e){return 48<=e&&e<=55}function a(e){return 48<=e&&e<=57}e.exports=new i("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,r,n=e.length,i=0,s=!1;if(!n)return!1;if("-"!==(t=e[i])&&"+"!==t||(t=e[++i]),"0"===t){if(i+1===n)return!0;if("b"===(t=e[++i])){for(i++;i<n;i++)if("_"!==(t=e[i])){if("0"!==t&&"1"!==t)return!1;s=!0}return s&&"_"!==t}if("x"===t){for(i++;i<n;i++)if("_"!==(t=e[i])){if(!(48<=(r=e.charCodeAt(i))&&r<=57||65<=r&&r<=70||97<=r&&r<=102))return!1;s=!0}return s&&"_"!==t}for(;i<n;i++)if("_"!==(t=e[i])){if(!o(e.charCodeAt(i)))return!1;s=!0}return s&&"_"!==t}if("_"===t)return!1;for(;i<n;i++)if("_"!==(t=e[i])){if(":"===t)break;if(!a(e.charCodeAt(i)))return!1;s=!0}return!(!s||"_"===t)&&(":"!==t||/^(:[0-5]?[0-9])+$/.test(e.slice(i)))},construct:function(e){var t,r,n=e,i=1,o=[];return-1!==n.indexOf("_")&&(n=n.replace(/_/g,"")),"-"!==(t=n[0])&&"+"!==t||("-"===t&&(i=-1),t=(n=n.slice(1))[0]),"0"===n?0:"0"===t?"b"===n[1]?i*parseInt(n.slice(2),2):"x"===n[1]?i*parseInt(n,16):i*parseInt(n,8):-1!==n.indexOf(":")?(n.split(":").forEach((function(e){o.unshift(parseInt(e,10))})),n=0,r=1,o.forEach((function(e){n+=e*r,r*=60})),i*n):i*parseInt(n,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!n.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0"+e.toString(8):"-0"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}})},function(e,t,r){"use strict";var n=r(38),i=r(10),o=new RegExp("^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var a=/^[-+]?[0-9]+e/;e.exports=new i("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!(!o.test(e)||"_"===e[e.length-1])},construct:function(e){var t,r,n,i;return r="-"===(t=e.replace(/_/g,"").toLowerCase())[0]?-1:1,i=[],"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===r?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:t.indexOf(":")>=0?(t.split(":").forEach((function(e){i.unshift(parseFloat(e,10))})),t=0,n=1,i.forEach((function(e){t+=e*n,n*=60})),r*t):r*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||n.isNegativeZero(e))},represent:function(e,t){var r;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(n.isNegativeZero(e))return"-0.0";return r=e.toString(10),a.test(r)?r.replace("e",".e"):r},defaultStyle:"lowercase"})},function(e,t,r){"use strict";var n=r(10),i=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),o=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");e.exports=new n("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==i.exec(e)||null!==o.exec(e))},construct:function(e){var t,r,n,a,s,u,l,c,h=0,p=null;if(null===(t=i.exec(e))&&(t=o.exec(e)),null===t)throw new Error("Date resolve error");if(r=+t[1],n=+t[2]-1,a=+t[3],!t[4])return new Date(Date.UTC(r,n,a));if(s=+t[4],u=+t[5],l=+t[6],t[7]){for(h=t[7].slice(0,3);h.length<3;)h+="0";h=+h}return t[9]&&(p=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(p=-p)),c=new Date(Date.UTC(r,n,a,s,u,l,h)),p&&c.setTime(c.getTime()-p),c},instanceOf:Date,represent:function(e){return e.toISOString()}})},function(e,t,r){"use strict";var n=r(10);e.exports=new n("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}})},function(e,t,r){"use strict";var n;try{n=r(145).Buffer}catch(e){}var i=r(10),o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";e.exports=new i("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,r,n=0,i=e.length,a=o;for(r=0;r<i;r++)if(!((t=a.indexOf(e.charAt(r)))>64)){if(t<0)return!1;n+=6}return n%8==0},construct:function(e){var t,r,i=e.replace(/[\r\n=]/g,""),a=i.length,s=o,u=0,l=[];for(t=0;t<a;t++)t%4==0&&t&&(l.push(u>>16&255),l.push(u>>8&255),l.push(255&u)),u=u<<6|s.indexOf(i.charAt(t));return 0===(r=a%4*6)?(l.push(u>>16&255),l.push(u>>8&255),l.push(255&u)):18===r?(l.push(u>>10&255),l.push(u>>2&255)):12===r&&l.push(u>>4&255),n?n.from?n.from(l):new n(l):l},predicate:function(e){return n&&n.isBuffer(e)},represent:function(e){var t,r,n="",i=0,a=e.length,s=o;for(t=0;t<a;t++)t%3==0&&t&&(n+=s[i>>18&63],n+=s[i>>12&63],n+=s[i>>6&63],n+=s[63&i]),i=(i<<8)+e[t];return 0===(r=a%3)?(n+=s[i>>18&63],n+=s[i>>12&63],n+=s[i>>6&63],n+=s[63&i]):2===r?(n+=s[i>>10&63],n+=s[i>>4&63],n+=s[i<<2&63],n+=s[64]):1===r&&(n+=s[i>>2&63],n+=s[i<<4&63],n+=s[64],n+=s[64]),n}})},function(e,t,r){"use strict";var n=r(10),i=Object.prototype.hasOwnProperty,o=Object.prototype.toString;e.exports=new n("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,r,n,a,s,u=[],l=e;for(t=0,r=l.length;t<r;t+=1){if(n=l[t],s=!1,"[object Object]"!==o.call(n))return!1;for(a in n)if(i.call(n,a)){if(s)return!1;s=!0}if(!s)return!1;if(-1!==u.indexOf(a))return!1;u.push(a)}return!0},construct:function(e){return null!==e?e:[]}})},function(e,t,r){"use strict";var n=r(10),i=Object.prototype.toString;e.exports=new n("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,r,n,o,a,s=e;for(a=new Array(s.length),t=0,r=s.length;t<r;t+=1){if(n=s[t],"[object Object]"!==i.call(n))return!1;if(1!==(o=Object.keys(n)).length)return!1;a[t]=[o[0],n[o[0]]]}return!0},construct:function(e){if(null===e)return[];var t,r,n,i,o,a=e;for(o=new Array(a.length),t=0,r=a.length;t<r;t+=1)n=a[t],i=Object.keys(n),o[t]=[i[0],n[i[0]]];return o}})},function(e,t,r){"use strict";var n=r(10),i=Object.prototype.hasOwnProperty;e.exports=new n("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;var t,r=e;for(t in r)if(i.call(r,t)&&null!==r[t])return!1;return!0},construct:function(e){return null!==e?e:{}}})},function(e,t,r){"use strict";var n=r(10);e.exports=new n("tag:yaml.org,2002:js/undefined",{kind:"scalar",resolve:function(){return!0},construct:function(){},predicate:function(e){return void 0===e},represent:function(){return""}})},function(e,t,r){"use strict";var n=r(10);e.exports=new n("tag:yaml.org,2002:js/regexp",{kind:"scalar",resolve:function(e){if(null===e)return!1;if(0===e.length)return!1;var t=e,r=/\/([gim]*)$/.exec(e),n="";if("/"===t[0]){if(r&&(n=r[1]),n.length>3)return!1;if("/"!==t[t.length-n.length-1])return!1}return!0},construct:function(e){var t=e,r=/\/([gim]*)$/.exec(e),n="";return"/"===t[0]&&(r&&(n=r[1]),t=t.slice(1,t.length-n.length-1)),new RegExp(t,n)},predicate:function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},represent:function(e){var t="/"+e.source+"/";return e.global&&(t+="g"),e.multiline&&(t+="m"),e.ignoreCase&&(t+="i"),t}})},function(e,t,r){"use strict";var n;try{n=r(302)}catch(e){"undefined"!=typeof window&&(n=window.esprima)}var i=r(10);e.exports=new i("tag:yaml.org,2002:js/function",{kind:"scalar",resolve:function(e){if(null===e)return!1;try{var t="("+e+")",r=n.parse(t,{range:!0});return"Program"===r.type&&1===r.body.length&&"ExpressionStatement"===r.body[0].type&&("ArrowFunctionExpression"===r.body[0].expression.type||"FunctionExpression"===r.body[0].expression.type)}catch(e){return!1}},construct:function(e){var t,r="("+e+")",i=n.parse(r,{range:!0}),o=[];if("Program"!==i.type||1!==i.body.length||"ExpressionStatement"!==i.body[0].type||"ArrowFunctionExpression"!==i.body[0].expression.type&&"FunctionExpression"!==i.body[0].expression.type)throw new Error("Failed to resolve function");return i.body[0].expression.params.forEach((function(e){o.push(e.name)})),t=i.body[0].expression.body.range,"BlockStatement"===i.body[0].expression.body.type?new Function(o,r.slice(t[0]+1,t[1]-1)):new Function(o,"return "+r.slice(t[0],t[1]))},predicate:function(e){return"[object Function]"===Object.prototype.toString.call(e)},represent:function(e){return e.toString()}})},function(e,t,r){var n;n=function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={exports:{},id:n,loaded:!1};return e[n].call(i.exports,i,i.exports,r),i.loaded=!0,i.exports}return r.m=e,r.c=t,r.p="",r(0)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(1),i=r(3),o=r(8),a=r(15);function s(e,t,r){var a=null,s=function(e,t){r&&r(e,t),a&&a.visit(e,t)},u="function"==typeof r?s:null,l=!1;if(t){l="boolean"==typeof t.comment&&t.comment;var c="boolean"==typeof t.attachComment&&t.attachComment;(l||c)&&((a=new n.CommentHandler).attach=c,t.comment=!0,u=s)}var h,p=!1;t&&"string"==typeof t.sourceType&&(p="module"===t.sourceType),h=t&&"boolean"==typeof t.jsx&&t.jsx?new i.JSXParser(e,t,u):new o.Parser(e,t,u);var f=p?h.parseModule():h.parseScript();return l&&a&&(f.comments=a.comments),h.config.tokens&&(f.tokens=h.tokens),h.config.tolerant&&(f.errors=h.errorHandler.errors),f}t.parse=s,t.parseModule=function(e,t,r){var n=t||{};return n.sourceType="module",s(e,n,r)},t.parseScript=function(e,t,r){var n=t||{};return n.sourceType="script",s(e,n,r)},t.tokenize=function(e,t,r){var n,i=new a.Tokenizer(e,t);n=[];try{for(;;){var o=i.getNextToken();if(!o)break;r&&(o=r(o)),n.push(o)}}catch(e){i.errorHandler.tolerate(e)}return i.errorHandler.tolerant&&(n.errors=i.errors()),n};var u=r(2);t.Syntax=u.Syntax,t.version="4.0.1"},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2),i=function(){function e(){this.attach=!1,this.comments=[],this.stack=[],this.leading=[],this.trailing=[]}return e.prototype.insertInnerComments=function(e,t){if(e.type===n.Syntax.BlockStatement&&0===e.body.length){for(var r=[],i=this.leading.length-1;i>=0;--i){var o=this.leading[i];t.end.offset>=o.start&&(r.unshift(o.comment),this.leading.splice(i,1),this.trailing.splice(i,1))}r.length&&(e.innerComments=r)}},e.prototype.findTrailingComments=function(e){var t=[];if(this.trailing.length>0){for(var r=this.trailing.length-1;r>=0;--r){var n=this.trailing[r];n.start>=e.end.offset&&t.unshift(n.comment)}return this.trailing.length=0,t}var i=this.stack[this.stack.length-1];if(i&&i.node.trailingComments){var o=i.node.trailingComments[0];o&&o.range[0]>=e.end.offset&&(t=i.node.trailingComments,delete i.node.trailingComments)}return t},e.prototype.findLeadingComments=function(e){for(var t,r=[];this.stack.length>0&&((o=this.stack[this.stack.length-1])&&o.start>=e.start.offset);)t=o.node,this.stack.pop();if(t){for(var n=(t.leadingComments?t.leadingComments.length:0)-1;n>=0;--n){var i=t.leadingComments[n];i.range[1]<=e.start.offset&&(r.unshift(i),t.leadingComments.splice(n,1))}return t.leadingComments&&0===t.leadingComments.length&&delete t.leadingComments,r}for(n=this.leading.length-1;n>=0;--n){var o;(o=this.leading[n]).start<=e.start.offset&&(r.unshift(o.comment),this.leading.splice(n,1))}return r},e.prototype.visitNode=function(e,t){if(!(e.type===n.Syntax.Program&&e.body.length>0)){this.insertInnerComments(e,t);var r=this.findTrailingComments(t),i=this.findLeadingComments(t);i.length>0&&(e.leadingComments=i),r.length>0&&(e.trailingComments=r),this.stack.push({node:e,start:t.start.offset})}},e.prototype.visitComment=function(e,t){var r="L"===e.type[0]?"Line":"Block",n={type:r,value:e.value};if(e.range&&(n.range=e.range),e.loc&&(n.loc=e.loc),this.comments.push(n),this.attach){var i={comment:{type:r,value:e.value,range:[t.start.offset,t.end.offset]},start:t.start.offset};e.loc&&(i.comment.loc=e.loc),e.type=r,this.leading.push(i),this.trailing.push(i)}},e.prototype.visit=function(e,t){"LineComment"===e.type||"BlockComment"===e.type?this.visitComment(e,t):this.attach&&this.visitNode(e,t)},e}();t.CommentHandler=i},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Syntax={AssignmentExpression:"AssignmentExpression",AssignmentPattern:"AssignmentPattern",ArrayExpression:"ArrayExpression",ArrayPattern:"ArrayPattern",ArrowFunctionExpression:"ArrowFunctionExpression",AwaitExpression:"AwaitExpression",BlockStatement:"BlockStatement",BinaryExpression:"BinaryExpression",BreakStatement:"BreakStatement",CallExpression:"CallExpression",CatchClause:"CatchClause",ClassBody:"ClassBody",ClassDeclaration:"ClassDeclaration",ClassExpression:"ClassExpression",ConditionalExpression:"ConditionalExpression",ContinueStatement:"ContinueStatement",DoWhileStatement:"DoWhileStatement",DebuggerStatement:"DebuggerStatement",EmptyStatement:"EmptyStatement",ExportAllDeclaration:"ExportAllDeclaration",ExportDefaultDeclaration:"ExportDefaultDeclaration",ExportNamedDeclaration:"ExportNamedDeclaration",ExportSpecifier:"ExportSpecifier",ExpressionStatement:"ExpressionStatement",ForStatement:"ForStatement",ForOfStatement:"ForOfStatement",ForInStatement:"ForInStatement",FunctionDeclaration:"FunctionDeclaration",FunctionExpression:"FunctionExpression",Identifier:"Identifier",IfStatement:"IfStatement",ImportDeclaration:"ImportDeclaration",ImportDefaultSpecifier:"ImportDefaultSpecifier",ImportNamespaceSpecifier:"ImportNamespaceSpecifier",ImportSpecifier:"ImportSpecifier",Literal:"Literal",LabeledStatement:"LabeledStatement",LogicalExpression:"LogicalExpression",MemberExpression:"MemberExpression",MetaProperty:"MetaProperty",MethodDefinition:"MethodDefinition",NewExpression:"NewExpression",ObjectExpression:"ObjectExpression",ObjectPattern:"ObjectPattern",Program:"Program",Property:"Property",RestElement:"RestElement",ReturnStatement:"ReturnStatement",SequenceExpression:"SequenceExpression",SpreadElement:"SpreadElement",Super:"Super",SwitchCase:"SwitchCase",SwitchStatement:"SwitchStatement",TaggedTemplateExpression:"TaggedTemplateExpression",TemplateElement:"TemplateElement",TemplateLiteral:"TemplateLiteral",ThisExpression:"ThisExpression",ThrowStatement:"ThrowStatement",TryStatement:"TryStatement",UnaryExpression:"UnaryExpression",UpdateExpression:"UpdateExpression",VariableDeclaration:"VariableDeclaration",VariableDeclarator:"VariableDeclarator",WhileStatement:"WhileStatement",WithStatement:"WithStatement",YieldExpression:"YieldExpression"}},function(e,t,r){"use strict";var n,i=this&&this.__extends||(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=r(4),a=r(5),s=r(6),u=r(7),l=r(8),c=r(13),h=r(14);function p(e){var t;switch(e.type){case s.JSXSyntax.JSXIdentifier:t=e.name;break;case s.JSXSyntax.JSXNamespacedName:var r=e;t=p(r.namespace)+":"+p(r.name);break;case s.JSXSyntax.JSXMemberExpression:var n=e;t=p(n.object)+"."+p(n.property)}return t}c.TokenName[100]="JSXIdentifier",c.TokenName[101]="JSXText";var f=function(e){function t(t,r,n){return e.call(this,t,r,n)||this}return i(t,e),t.prototype.parsePrimaryExpression=function(){return this.match("<")?this.parseJSXRoot():e.prototype.parsePrimaryExpression.call(this)},t.prototype.startJSX=function(){this.scanner.index=this.startMarker.index,this.scanner.lineNumber=this.startMarker.line,this.scanner.lineStart=this.startMarker.index-this.startMarker.column},t.prototype.finishJSX=function(){this.nextToken()},t.prototype.reenterJSX=function(){this.startJSX(),this.expectJSX("}"),this.config.tokens&&this.tokens.pop()},t.prototype.createJSXNode=function(){return this.collectComments(),{index:this.scanner.index,line:this.scanner.lineNumber,column:this.scanner.index-this.scanner.lineStart}},t.prototype.createJSXChildNode=function(){return{index:this.scanner.index,line:this.scanner.lineNumber,column:this.scanner.index-this.scanner.lineStart}},t.prototype.scanXHTMLEntity=function(e){for(var t="&",r=!0,n=!1,i=!1,a=!1;!this.scanner.eof()&&r&&!n;){var s=this.scanner.source[this.scanner.index];if(s===e)break;if(n=";"===s,t+=s,++this.scanner.index,!n)switch(t.length){case 2:i="#"===s;break;case 3:i&&(r=(a="x"===s)||o.Character.isDecimalDigit(s.charCodeAt(0)),i=i&&!a);break;default:r=(r=r&&!(i&&!o.Character.isDecimalDigit(s.charCodeAt(0))))&&!(a&&!o.Character.isHexDigit(s.charCodeAt(0)))}}if(r&&n&&t.length>2){var u=t.substr(1,t.length-2);i&&u.length>1?t=String.fromCharCode(parseInt(u.substr(1),10)):a&&u.length>2?t=String.fromCharCode(parseInt("0"+u.substr(1),16)):i||a||!h.XHTMLEntities[u]||(t=h.XHTMLEntities[u])}return t},t.prototype.lexJSX=function(){var e=this.scanner.source.charCodeAt(this.scanner.index);if(60===e||62===e||47===e||58===e||61===e||123===e||125===e)return{type:7,value:s=this.scanner.source[this.scanner.index++],lineNumber:this.scanner.lineNumber,lineStart:this.scanner.lineStart,start:this.scanner.index-1,end:this.scanner.index};if(34===e||39===e){for(var t=this.scanner.index,r=this.scanner.source[this.scanner.index++],n="";!this.scanner.eof()&&(u=this.scanner.source[this.scanner.index++])!==r;)n+="&"===u?this.scanXHTMLEntity(r):u;return{type:8,value:n,lineNumber:this.scanner.lineNumber,lineStart:this.scanner.lineStart,start:t,end:this.scanner.index}}if(46===e){var i=this.scanner.source.charCodeAt(this.scanner.index+1),a=this.scanner.source.charCodeAt(this.scanner.index+2),s=46===i&&46===a?"...":".";return t=this.scanner.index,this.scanner.index+=s.length,{type:7,value:s,lineNumber:this.scanner.lineNumber,lineStart:this.scanner.lineStart,start:t,end:this.scanner.index}}if(96===e)return{type:10,value:"",lineNumber:this.scanner.lineNumber,lineStart:this.scanner.lineStart,start:this.scanner.index,end:this.scanner.index};if(o.Character.isIdentifierStart(e)&&92!==e){for(t=this.scanner.index,++this.scanner.index;!this.scanner.eof();){var u=this.scanner.source.charCodeAt(this.scanner.index);if(o.Character.isIdentifierPart(u)&&92!==u)++this.scanner.index;else{if(45!==u)break;++this.scanner.index}}return{type:100,value:this.scanner.source.slice(t,this.scanner.index),lineNumber:this.scanner.lineNumber,lineStart:this.scanner.lineStart,start:t,end:this.scanner.index}}return this.scanner.lex()},t.prototype.nextJSXToken=function(){this.collectComments(),this.startMarker.index=this.scanner.index,this.startMarker.line=this.scanner.lineNumber,this.startMarker.column=this.scanner.index-this.scanner.lineStart;var e=this.lexJSX();return this.lastMarker.index=this.scanner.index,this.lastMarker.line=this.scanner.lineNumber,this.lastMarker.column=this.scanner.index-this.scanner.lineStart,this.config.tokens&&this.tokens.push(this.convertToken(e)),e},t.prototype.nextJSXText=function(){this.startMarker.index=this.scanner.index,this.startMarker.line=this.scanner.lineNumber,this.startMarker.column=this.scanner.index-this.scanner.lineStart;for(var e=this.scanner.index,t="";!this.scanner.eof();){var r=this.scanner.source[this.scanner.index];if("{"===r||"<"===r)break;++this.scanner.index,t+=r,o.Character.isLineTerminator(r.charCodeAt(0))&&(++this.scanner.lineNumber,"\r"===r&&"\n"===this.scanner.source[this.scanner.index]&&++this.scanner.index,this.scanner.lineStart=this.scanner.index)}this.lastMarker.index=this.scanner.index,this.lastMarker.line=this.scanner.lineNumber,this.lastMarker.column=this.scanner.index-this.scanner.lineStart;var n={type:101,value:t,lineNumber:this.scanner.lineNumber,lineStart:this.scanner.lineStart,start:e,end:this.scanner.index};return t.length>0&&this.config.tokens&&this.tokens.push(this.convertToken(n)),n},t.prototype.peekJSXToken=function(){var e=this.scanner.saveState();this.scanner.scanComments();var t=this.lexJSX();return this.scanner.restoreState(e),t},t.prototype.expectJSX=function(e){var t=this.nextJSXToken();7===t.type&&t.value===e||this.throwUnexpectedToken(t)},t.prototype.matchJSX=function(e){var t=this.peekJSXToken();return 7===t.type&&t.value===e},t.prototype.parseJSXIdentifier=function(){var e=this.createJSXNode(),t=this.nextJSXToken();return 100!==t.type&&this.throwUnexpectedToken(t),this.finalize(e,new a.JSXIdentifier(t.value))},t.prototype.parseJSXElementName=function(){var e=this.createJSXNode(),t=this.parseJSXIdentifier();if(this.matchJSX(":")){var r=t;this.expectJSX(":");var n=this.parseJSXIdentifier();t=this.finalize(e,new a.JSXNamespacedName(r,n))}else if(this.matchJSX("."))for(;this.matchJSX(".");){var i=t;this.expectJSX(".");var o=this.parseJSXIdentifier();t=this.finalize(e,new a.JSXMemberExpression(i,o))}return t},t.prototype.parseJSXAttributeName=function(){var e,t=this.createJSXNode(),r=this.parseJSXIdentifier();if(this.matchJSX(":")){var n=r;this.expectJSX(":");var i=this.parseJSXIdentifier();e=this.finalize(t,new a.JSXNamespacedName(n,i))}else e=r;return e},t.prototype.parseJSXStringLiteralAttribute=function(){var e=this.createJSXNode(),t=this.nextJSXToken();8!==t.type&&this.throwUnexpectedToken(t);var r=this.getTokenRaw(t);return this.finalize(e,new u.Literal(t.value,r))},t.prototype.parseJSXExpressionAttribute=function(){var e=this.createJSXNode();this.expectJSX("{"),this.finishJSX(),this.match("}")&&this.tolerateError("JSX attributes must only be assigned a non-empty expression");var t=this.parseAssignmentExpression();return this.reenterJSX(),this.finalize(e,new a.JSXExpressionContainer(t))},t.prototype.parseJSXAttributeValue=function(){return this.matchJSX("{")?this.parseJSXExpressionAttribute():this.matchJSX("<")?this.parseJSXElement():this.parseJSXStringLiteralAttribute()},t.prototype.parseJSXNameValueAttribute=function(){var e=this.createJSXNode(),t=this.parseJSXAttributeName(),r=null;return this.matchJSX("=")&&(this.expectJSX("="),r=this.parseJSXAttributeValue()),this.finalize(e,new a.JSXAttribute(t,r))},t.prototype.parseJSXSpreadAttribute=function(){var e=this.createJSXNode();this.expectJSX("{"),this.expectJSX("..."),this.finishJSX();var t=this.parseAssignmentExpression();return this.reenterJSX(),this.finalize(e,new a.JSXSpreadAttribute(t))},t.prototype.parseJSXAttributes=function(){for(var e=[];!this.matchJSX("/")&&!this.matchJSX(">");){var t=this.matchJSX("{")?this.parseJSXSpreadAttribute():this.parseJSXNameValueAttribute();e.push(t)}return e},t.prototype.parseJSXOpeningElement=function(){var e=this.createJSXNode();this.expectJSX("<");var t=this.parseJSXElementName(),r=this.parseJSXAttributes(),n=this.matchJSX("/");return n&&this.expectJSX("/"),this.expectJSX(">"),this.finalize(e,new a.JSXOpeningElement(t,n,r))},t.prototype.parseJSXBoundaryElement=function(){var e=this.createJSXNode();if(this.expectJSX("<"),this.matchJSX("/")){this.expectJSX("/");var t=this.parseJSXElementName();return this.expectJSX(">"),this.finalize(e,new a.JSXClosingElement(t))}var r=this.parseJSXElementName(),n=this.parseJSXAttributes(),i=this.matchJSX("/");return i&&this.expectJSX("/"),this.expectJSX(">"),this.finalize(e,new a.JSXOpeningElement(r,i,n))},t.prototype.parseJSXEmptyExpression=function(){var e=this.createJSXChildNode();return this.collectComments(),this.lastMarker.index=this.scanner.index,this.lastMarker.line=this.scanner.lineNumber,this.lastMarker.column=this.scanner.index-this.scanner.lineStart,this.finalize(e,new a.JSXEmptyExpression)},t.prototype.parseJSXExpressionContainer=function(){var e,t=this.createJSXNode();return this.expectJSX("{"),this.matchJSX("}")?(e=this.parseJSXEmptyExpression(),this.expectJSX("}")):(this.finishJSX(),e=this.parseAssignmentExpression(),this.reenterJSX()),this.finalize(t,new a.JSXExpressionContainer(e))},t.prototype.parseJSXChildren=function(){for(var e=[];!this.scanner.eof();){var t=this.createJSXChildNode(),r=this.nextJSXText();if(r.start<r.end){var n=this.getTokenRaw(r),i=this.finalize(t,new a.JSXText(r.value,n));e.push(i)}if("{"!==this.scanner.source[this.scanner.index])break;var o=this.parseJSXExpressionContainer();e.push(o)}return e},t.prototype.parseComplexJSXElement=function(e){for(var t=[];!this.scanner.eof();){e.children=e.children.concat(this.parseJSXChildren());var r=this.createJSXChildNode(),n=this.parseJSXBoundaryElement();if(n.type===s.JSXSyntax.JSXOpeningElement){var i=n;if(i.selfClosing){var o=this.finalize(r,new a.JSXElement(i,[],null));e.children.push(o)}else t.push(e),e={node:r,opening:i,closing:null,children:[]}}if(n.type===s.JSXSyntax.JSXClosingElement){e.closing=n;var u=p(e.opening.name);if(u!==p(e.closing.name)&&this.tolerateError("Expected corresponding JSX closing tag for %0",u),!(t.length>0))break;o=this.finalize(e.node,new a.JSXElement(e.opening,e.children,e.closing)),(e=t[t.length-1]).children.push(o),t.pop()}}return e},t.prototype.parseJSXElement=function(){var e=this.createJSXNode(),t=this.parseJSXOpeningElement(),r=[],n=null;if(!t.selfClosing){var i=this.parseComplexJSXElement({node:e,opening:t,closing:n,children:r});r=i.children,n=i.closing}return this.finalize(e,new a.JSXElement(t,r,n))},t.prototype.parseJSXRoot=function(){this.config.tokens&&this.tokens.pop(),this.startJSX();var e=this.parseJSXElement();return this.finishJSX(),e},t.prototype.isStartOfExpression=function(){return e.prototype.isStartOfExpression.call(this)||this.match("<")},t}(l.Parser);t.JSXParser=f},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={NonAsciiIdentifierStart:/[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,NonAsciiIdentifierPart:/[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/};t.Character={fromCodePoint:function(e){return e<65536?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10))+String.fromCharCode(56320+(e-65536&1023))},isWhiteSpace:function(e){return 32===e||9===e||11===e||12===e||160===e||e>=5760&&[5760,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8239,8287,12288,65279].indexOf(e)>=0},isLineTerminator:function(e){return 10===e||13===e||8232===e||8233===e},isIdentifierStart:function(e){return 36===e||95===e||e>=65&&e<=90||e>=97&&e<=122||92===e||e>=128&&r.NonAsciiIdentifierStart.test(t.Character.fromCodePoint(e))},isIdentifierPart:function(e){return 36===e||95===e||e>=65&&e<=90||e>=97&&e<=122||e>=48&&e<=57||92===e||e>=128&&r.NonAsciiIdentifierPart.test(t.Character.fromCodePoint(e))},isDecimalDigit:function(e){return e>=48&&e<=57},isHexDigit:function(e){return e>=48&&e<=57||e>=65&&e<=70||e>=97&&e<=102},isOctalDigit:function(e){return e>=48&&e<=55}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(6),i=function(e){this.type=n.JSXSyntax.JSXClosingElement,this.name=e};t.JSXClosingElement=i;var o=function(e,t,r){this.type=n.JSXSyntax.JSXElement,this.openingElement=e,this.children=t,this.closingElement=r};t.JSXElement=o;var a=function(){this.type=n.JSXSyntax.JSXEmptyExpression};t.JSXEmptyExpression=a;var s=function(e){this.type=n.JSXSyntax.JSXExpressionContainer,this.expression=e};t.JSXExpressionContainer=s;var u=function(e){this.type=n.JSXSyntax.JSXIdentifier,this.name=e};t.JSXIdentifier=u;var l=function(e,t){this.type=n.JSXSyntax.JSXMemberExpression,this.object=e,this.property=t};t.JSXMemberExpression=l;var c=function(e,t){this.type=n.JSXSyntax.JSXAttribute,this.name=e,this.value=t};t.JSXAttribute=c;var h=function(e,t){this.type=n.JSXSyntax.JSXNamespacedName,this.namespace=e,this.name=t};t.JSXNamespacedName=h;var p=function(e,t,r){this.type=n.JSXSyntax.JSXOpeningElement,this.name=e,this.selfClosing=t,this.attributes=r};t.JSXOpeningElement=p;var f=function(e){this.type=n.JSXSyntax.JSXSpreadAttribute,this.argument=e};t.JSXSpreadAttribute=f;var d=function(e,t){this.type=n.JSXSyntax.JSXText,this.value=e,this.raw=t};t.JSXText=d},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.JSXSyntax={JSXAttribute:"JSXAttribute",JSXClosingElement:"JSXClosingElement",JSXElement:"JSXElement",JSXEmptyExpression:"JSXEmptyExpression",JSXExpressionContainer:"JSXExpressionContainer",JSXIdentifier:"JSXIdentifier",JSXMemberExpression:"JSXMemberExpression",JSXNamespacedName:"JSXNamespacedName",JSXOpeningElement:"JSXOpeningElement",JSXSpreadAttribute:"JSXSpreadAttribute",JSXText:"JSXText"}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2),i=function(e){this.type=n.Syntax.ArrayExpression,this.elements=e};t.ArrayExpression=i;var o=function(e){this.type=n.Syntax.ArrayPattern,this.elements=e};t.ArrayPattern=o;var a=function(e,t,r){this.type=n.Syntax.ArrowFunctionExpression,this.id=null,this.params=e,this.body=t,this.generator=!1,this.expression=r,this.async=!1};t.ArrowFunctionExpression=a;var s=function(e,t,r){this.type=n.Syntax.AssignmentExpression,this.operator=e,this.left=t,this.right=r};t.AssignmentExpression=s;var u=function(e,t){this.type=n.Syntax.AssignmentPattern,this.left=e,this.right=t};t.AssignmentPattern=u;var l=function(e,t,r){this.type=n.Syntax.ArrowFunctionExpression,this.id=null,this.params=e,this.body=t,this.generator=!1,this.expression=r,this.async=!0};t.AsyncArrowFunctionExpression=l;var c=function(e,t,r){this.type=n.Syntax.FunctionDeclaration,this.id=e,this.params=t,this.body=r,this.generator=!1,this.expression=!1,this.async=!0};t.AsyncFunctionDeclaration=c;var h=function(e,t,r){this.type=n.Syntax.FunctionExpression,this.id=e,this.params=t,this.body=r,this.generator=!1,this.expression=!1,this.async=!0};t.AsyncFunctionExpression=h;var p=function(e){this.type=n.Syntax.AwaitExpression,this.argument=e};t.AwaitExpression=p;var f=function(e,t,r){var i="||"===e||"&&"===e;this.type=i?n.Syntax.LogicalExpression:n.Syntax.BinaryExpression,this.operator=e,this.left=t,this.right=r};t.BinaryExpression=f;var d=function(e){this.type=n.Syntax.BlockStatement,this.body=e};t.BlockStatement=d;var m=function(e){this.type=n.Syntax.BreakStatement,this.label=e};t.BreakStatement=m;var y=function(e,t){this.type=n.Syntax.CallExpression,this.callee=e,this.arguments=t};t.CallExpression=y;var v=function(e,t){this.type=n.Syntax.CatchClause,this.param=e,this.body=t};t.CatchClause=v;var _=function(e){this.type=n.Syntax.ClassBody,this.body=e};t.ClassBody=_;var g=function(e,t,r){this.type=n.Syntax.ClassDeclaration,this.id=e,this.superClass=t,this.body=r};t.ClassDeclaration=g;var b=function(e,t,r){this.type=n.Syntax.ClassExpression,this.id=e,this.superClass=t,this.body=r};t.ClassExpression=b;var x=function(e,t){this.type=n.Syntax.MemberExpression,this.computed=!0,this.object=e,this.property=t};t.ComputedMemberExpression=x;var w=function(e,t,r){this.type=n.Syntax.ConditionalExpression,this.test=e,this.consequent=t,this.alternate=r};t.ConditionalExpression=w;var E=function(e){this.type=n.Syntax.ContinueStatement,this.label=e};t.ContinueStatement=E;var D=function(){this.type=n.Syntax.DebuggerStatement};t.DebuggerStatement=D;var S=function(e,t){this.type=n.Syntax.ExpressionStatement,this.expression=e,this.directive=t};t.Directive=S;var C=function(e,t){this.type=n.Syntax.DoWhileStatement,this.body=e,this.test=t};t.DoWhileStatement=C;var A=function(){this.type=n.Syntax.EmptyStatement};t.EmptyStatement=A;var N=function(e){this.type=n.Syntax.ExportAllDeclaration,this.source=e};t.ExportAllDeclaration=N;var T=function(e){this.type=n.Syntax.ExportDefaultDeclaration,this.declaration=e};t.ExportDefaultDeclaration=T;var O=function(e,t,r){this.type=n.Syntax.ExportNamedDeclaration,this.declaration=e,this.specifiers=t,this.source=r};t.ExportNamedDeclaration=O;var F=function(e,t){this.type=n.Syntax.ExportSpecifier,this.exported=t,this.local=e};t.ExportSpecifier=F;var k=function(e){this.type=n.Syntax.ExpressionStatement,this.expression=e};t.ExpressionStatement=k;var P=function(e,t,r){this.type=n.Syntax.ForInStatement,this.left=e,this.right=t,this.body=r,this.each=!1};t.ForInStatement=P;var I=function(e,t,r){this.type=n.Syntax.ForOfStatement,this.left=e,this.right=t,this.body=r};t.ForOfStatement=I;var L=function(e,t,r,i){this.type=n.Syntax.ForStatement,this.init=e,this.test=t,this.update=r,this.body=i};t.ForStatement=L;var M=function(e,t,r,i){this.type=n.Syntax.FunctionDeclaration,this.id=e,this.params=t,this.body=r,this.generator=i,this.expression=!1,this.async=!1};t.FunctionDeclaration=M;var B=function(e,t,r,i){this.type=n.Syntax.FunctionExpression,this.id=e,this.params=t,this.body=r,this.generator=i,this.expression=!1,this.async=!1};t.FunctionExpression=B;var j=function(e){this.type=n.Syntax.Identifier,this.name=e};t.Identifier=j;var R=function(e,t,r){this.type=n.Syntax.IfStatement,this.test=e,this.consequent=t,this.alternate=r};t.IfStatement=R;var z=function(e,t){this.type=n.Syntax.ImportDeclaration,this.specifiers=e,this.source=t};t.ImportDeclaration=z;var U=function(e){this.type=n.Syntax.ImportDefaultSpecifier,this.local=e};t.ImportDefaultSpecifier=U;var G=function(e){this.type=n.Syntax.ImportNamespaceSpecifier,this.local=e};t.ImportNamespaceSpecifier=G;var X=function(e,t){this.type=n.Syntax.ImportSpecifier,this.local=e,this.imported=t};t.ImportSpecifier=X;var q=function(e,t){this.type=n.Syntax.LabeledStatement,this.label=e,this.body=t};t.LabeledStatement=q;var W=function(e,t){this.type=n.Syntax.Literal,this.value=e,this.raw=t};t.Literal=W;var H=function(e,t){this.type=n.Syntax.MetaProperty,this.meta=e,this.property=t};t.MetaProperty=H;var J=function(e,t,r,i,o){this.type=n.Syntax.MethodDefinition,this.key=e,this.computed=t,this.value=r,this.kind=i,this.static=o};t.MethodDefinition=J;var Y=function(e){this.type=n.Syntax.Program,this.body=e,this.sourceType="module"};t.Module=Y;var V=function(e,t){this.type=n.Syntax.NewExpression,this.callee=e,this.arguments=t};t.NewExpression=V;var K=function(e){this.type=n.Syntax.ObjectExpression,this.properties=e};t.ObjectExpression=K;var $=function(e){this.type=n.Syntax.ObjectPattern,this.properties=e};t.ObjectPattern=$;var Q=function(e,t,r,i,o,a){this.type=n.Syntax.Property,this.key=t,this.computed=r,this.value=i,this.kind=e,this.method=o,this.shorthand=a};t.Property=Q;var Z=function(e,t,r,i){this.type=n.Syntax.Literal,this.value=e,this.raw=t,this.regex={pattern:r,flags:i}};t.RegexLiteral=Z;var ee=function(e){this.type=n.Syntax.RestElement,this.argument=e};t.RestElement=ee;var te=function(e){this.type=n.Syntax.ReturnStatement,this.argument=e};t.ReturnStatement=te;var re=function(e){this.type=n.Syntax.Program,this.body=e,this.sourceType="script"};t.Script=re;var ne=function(e){this.type=n.Syntax.SequenceExpression,this.expressions=e};t.SequenceExpression=ne;var ie=function(e){this.type=n.Syntax.SpreadElement,this.argument=e};t.SpreadElement=ie;var oe=function(e,t){this.type=n.Syntax.MemberExpression,this.computed=!1,this.object=e,this.property=t};t.StaticMemberExpression=oe;var ae=function(){this.type=n.Syntax.Super};t.Super=ae;var se=function(e,t){this.type=n.Syntax.SwitchCase,this.test=e,this.consequent=t};t.SwitchCase=se;var ue=function(e,t){this.type=n.Syntax.SwitchStatement,this.discriminant=e,this.cases=t};t.SwitchStatement=ue;var le=function(e,t){this.type=n.Syntax.TaggedTemplateExpression,this.tag=e,this.quasi=t};t.TaggedTemplateExpression=le;var ce=function(e,t){this.type=n.Syntax.TemplateElement,this.value=e,this.tail=t};t.TemplateElement=ce;var he=function(e,t){this.type=n.Syntax.TemplateLiteral,this.quasis=e,this.expressions=t};t.TemplateLiteral=he;var pe=function(){this.type=n.Syntax.ThisExpression};t.ThisExpression=pe;var fe=function(e){this.type=n.Syntax.ThrowStatement,this.argument=e};t.ThrowStatement=fe;var de=function(e,t,r){this.type=n.Syntax.TryStatement,this.block=e,this.handler=t,this.finalizer=r};t.TryStatement=de;var me=function(e,t){this.type=n.Syntax.UnaryExpression,this.operator=e,this.argument=t,this.prefix=!0};t.UnaryExpression=me;var ye=function(e,t,r){this.type=n.Syntax.UpdateExpression,this.operator=e,this.argument=t,this.prefix=r};t.UpdateExpression=ye;var ve=function(e,t){this.type=n.Syntax.VariableDeclaration,this.declarations=e,this.kind=t};t.VariableDeclaration=ve;var _e=function(e,t){this.type=n.Syntax.VariableDeclarator,this.id=e,this.init=t};t.VariableDeclarator=_e;var ge=function(e,t){this.type=n.Syntax.WhileStatement,this.test=e,this.body=t};t.WhileStatement=ge;var be=function(e,t){this.type=n.Syntax.WithStatement,this.object=e,this.body=t};t.WithStatement=be;var xe=function(e,t){this.type=n.Syntax.YieldExpression,this.argument=e,this.delegate=t};t.YieldExpression=xe},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(9),i=r(10),o=r(11),a=r(7),s=r(12),u=r(2),l=r(13),c=function(){function e(e,t,r){void 0===t&&(t={}),this.config={range:"boolean"==typeof t.range&&t.range,loc:"boolean"==typeof t.loc&&t.loc,source:null,tokens:"boolean"==typeof t.tokens&&t.tokens,comment:"boolean"==typeof t.comment&&t.comment,tolerant:"boolean"==typeof t.tolerant&&t.tolerant},this.config.loc&&t.source&&null!==t.source&&(this.config.source=String(t.source)),this.delegate=r,this.errorHandler=new i.ErrorHandler,this.errorHandler.tolerant=this.config.tolerant,this.scanner=new s.Scanner(e,this.errorHandler),this.scanner.trackComment=this.config.comment,this.operatorPrecedence={")":0,";":0,",":0,"=":0,"]":0,"||":1,"&&":2,"|":3,"^":4,"&":5,"==":6,"!=":6,"===":6,"!==":6,"<":7,">":7,"<=":7,">=":7,"<<":8,">>":8,">>>":8,"+":9,"-":9,"*":11,"/":11,"%":11},this.lookahead={type:2,value:"",lineNumber:this.scanner.lineNumber,lineStart:0,start:0,end:0},this.hasLineTerminator=!1,this.context={isModule:!1,await:!1,allowIn:!0,allowStrictDirective:!0,allowYield:!0,firstCoverInitializedNameError:null,isAssignmentTarget:!1,isBindingElement:!1,inFunctionBody:!1,inIteration:!1,inSwitch:!1,labelSet:{},strict:!1},this.tokens=[],this.startMarker={index:0,line:this.scanner.lineNumber,column:0},this.lastMarker={index:0,line:this.scanner.lineNumber,column:0},this.nextToken(),this.lastMarker={index:this.scanner.index,line:this.scanner.lineNumber,column:this.scanner.index-this.scanner.lineStart}}return e.prototype.throwError=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];var i=Array.prototype.slice.call(arguments,1),o=e.replace(/%(\d)/g,(function(e,t){return n.assert(t<i.length,"Message reference must be in range"),i[t]})),a=this.lastMarker.index,s=this.lastMarker.line,u=this.lastMarker.column+1;throw this.errorHandler.createError(a,s,u,o)},e.prototype.tolerateError=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];var i=Array.prototype.slice.call(arguments,1),o=e.replace(/%(\d)/g,(function(e,t){return n.assert(t<i.length,"Message reference must be in range"),i[t]})),a=this.lastMarker.index,s=this.scanner.lineNumber,u=this.lastMarker.column+1;this.errorHandler.tolerateError(a,s,u,o)},e.prototype.unexpectedTokenError=function(e,t){var r,n=t||o.Messages.UnexpectedToken;if(e?(t||(n=2===e.type?o.Messages.UnexpectedEOS:3===e.type?o.Messages.UnexpectedIdentifier:6===e.type?o.Messages.UnexpectedNumber:8===e.type?o.Messages.UnexpectedString:10===e.type?o.Messages.UnexpectedTemplate:o.Messages.UnexpectedToken,4===e.type&&(this.scanner.isFutureReservedWord(e.value)?n=o.Messages.UnexpectedReserved:this.context.strict&&this.scanner.isStrictModeReservedWord(e.value)&&(n=o.Messages.StrictReservedWord))),r=e.value):r="ILLEGAL",n=n.replace("%0",r),e&&"number"==typeof e.lineNumber){var i=e.start,a=e.lineNumber,s=this.lastMarker.index-this.lastMarker.column,u=e.start-s+1;return this.errorHandler.createError(i,a,u,n)}return i=this.lastMarker.index,a=this.lastMarker.line,u=this.lastMarker.column+1,this.errorHandler.createError(i,a,u,n)},e.prototype.throwUnexpectedToken=function(e,t){throw this.unexpectedTokenError(e,t)},e.prototype.tolerateUnexpectedToken=function(e,t){this.errorHandler.tolerate(this.unexpectedTokenError(e,t))},e.prototype.collectComments=function(){if(this.config.comment){var e=this.scanner.scanComments();if(e.length>0&&this.delegate)for(var t=0;t<e.length;++t){var r=e[t],n=void 0;n={type:r.multiLine?"BlockComment":"LineComment",value:this.scanner.source.slice(r.slice[0],r.slice[1])},this.config.range&&(n.range=r.range),this.config.loc&&(n.loc=r.loc);var i={start:{line:r.loc.start.line,column:r.loc.start.column,offset:r.range[0]},end:{line:r.loc.end.line,column:r.loc.end.column,offset:r.range[1]}};this.delegate(n,i)}}else this.scanner.scanComments()},e.prototype.getTokenRaw=function(e){return this.scanner.source.slice(e.start,e.end)},e.prototype.convertToken=function(e){var t={type:l.TokenName[e.type],value:this.getTokenRaw(e)};if(this.config.range&&(t.range=[e.start,e.end]),this.config.loc&&(t.loc={start:{line:this.startMarker.line,column:this.startMarker.column},end:{line:this.scanner.lineNumber,column:this.scanner.index-this.scanner.lineStart}}),9===e.type){var r=e.pattern,n=e.flags;t.regex={pattern:r,flags:n}}return t},e.prototype.nextToken=function(){var e=this.lookahead;this.lastMarker.index=this.scanner.index,this.lastMarker.line=this.scanner.lineNumber,this.lastMarker.column=this.scanner.index-this.scanner.lineStart,this.collectComments(),this.scanner.index!==this.startMarker.index&&(this.startMarker.index=this.scanner.index,this.startMarker.line=this.scanner.lineNumber,this.startMarker.column=this.scanner.index-this.scanner.lineStart);var t=this.scanner.lex();return this.hasLineTerminator=e.lineNumber!==t.lineNumber,t&&this.context.strict&&3===t.type&&this.scanner.isStrictModeReservedWord(t.value)&&(t.type=4),this.lookahead=t,this.config.tokens&&2!==t.type&&this.tokens.push(this.convertToken(t)),e},e.prototype.nextRegexToken=function(){this.collectComments();var e=this.scanner.scanRegExp();return this.config.tokens&&(this.tokens.pop(),this.tokens.push(this.convertToken(e))),this.lookahead=e,this.nextToken(),e},e.prototype.createNode=function(){return{index:this.startMarker.index,line:this.startMarker.line,column:this.startMarker.column}},e.prototype.startNode=function(e,t){void 0===t&&(t=0);var r=e.start-e.lineStart,n=e.lineNumber;return r<0&&(r+=t,n--),{index:e.start,line:n,column:r}},e.prototype.finalize=function(e,t){if(this.config.range&&(t.range=[e.index,this.lastMarker.index]),this.config.loc&&(t.loc={start:{line:e.line,column:e.column},end:{line:this.lastMarker.line,column:this.lastMarker.column}},this.config.source&&(t.loc.source=this.config.source)),this.delegate){var r={start:{line:e.line,column:e.column,offset:e.index},end:{line:this.lastMarker.line,column:this.lastMarker.column,offset:this.lastMarker.index}};this.delegate(t,r)}return t},e.prototype.expect=function(e){var t=this.nextToken();7===t.type&&t.value===e||this.throwUnexpectedToken(t)},e.prototype.expectCommaSeparator=function(){if(this.config.tolerant){var e=this.lookahead;7===e.type&&","===e.value?this.nextToken():7===e.type&&";"===e.value?(this.nextToken(),this.tolerateUnexpectedToken(e)):this.tolerateUnexpectedToken(e,o.Messages.UnexpectedToken)}else this.expect(",")},e.prototype.expectKeyword=function(e){var t=this.nextToken();4===t.type&&t.value===e||this.throwUnexpectedToken(t)},e.prototype.match=function(e){return 7===this.lookahead.type&&this.lookahead.value===e},e.prototype.matchKeyword=function(e){return 4===this.lookahead.type&&this.lookahead.value===e},e.prototype.matchContextualKeyword=function(e){return 3===this.lookahead.type&&this.lookahead.value===e},e.prototype.matchAssign=function(){if(7!==this.lookahead.type)return!1;var e=this.lookahead.value;return"="===e||"*="===e||"**="===e||"/="===e||"%="===e||"+="===e||"-="===e||"<<="===e||">>="===e||">>>="===e||"&="===e||"^="===e||"|="===e},e.prototype.isolateCoverGrammar=function(e){var t=this.context.isBindingElement,r=this.context.isAssignmentTarget,n=this.context.firstCoverInitializedNameError;this.context.isBindingElement=!0,this.context.isAssignmentTarget=!0,this.context.firstCoverInitializedNameError=null;var i=e.call(this);return null!==this.context.firstCoverInitializedNameError&&this.throwUnexpectedToken(this.context.firstCoverInitializedNameError),this.context.isBindingElement=t,this.context.isAssignmentTarget=r,this.context.firstCoverInitializedNameError=n,i},e.prototype.inheritCoverGrammar=function(e){var t=this.context.isBindingElement,r=this.context.isAssignmentTarget,n=this.context.firstCoverInitializedNameError;this.context.isBindingElement=!0,this.context.isAssignmentTarget=!0,this.context.firstCoverInitializedNameError=null;var i=e.call(this);return this.context.isBindingElement=this.context.isBindingElement&&t,this.context.isAssignmentTarget=this.context.isAssignmentTarget&&r,this.context.firstCoverInitializedNameError=n||this.context.firstCoverInitializedNameError,i},e.prototype.consumeSemicolon=function(){this.match(";")?this.nextToken():this.hasLineTerminator||(2===this.lookahead.type||this.match("}")||this.throwUnexpectedToken(this.lookahead),this.lastMarker.index=this.startMarker.index,this.lastMarker.line=this.startMarker.line,this.lastMarker.column=this.startMarker.column)},e.prototype.parsePrimaryExpression=function(){var e,t,r,n=this.createNode();switch(this.lookahead.type){case 3:(this.context.isModule||this.context.await)&&"await"===this.lookahead.value&&this.tolerateUnexpectedToken(this.lookahead),e=this.matchAsyncFunction()?this.parseFunctionExpression():this.finalize(n,new a.Identifier(this.nextToken().value));break;case 6:case 8:this.context.strict&&this.lookahead.octal&&this.tolerateUnexpectedToken(this.lookahead,o.Messages.StrictOctalLiteral),this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1,t=this.nextToken(),r=this.getTokenRaw(t),e=this.finalize(n,new a.Literal(t.value,r));break;case 1:this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1,t=this.nextToken(),r=this.getTokenRaw(t),e=this.finalize(n,new a.Literal("true"===t.value,r));break;case 5:this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1,t=this.nextToken(),r=this.getTokenRaw(t),e=this.finalize(n,new a.Literal(null,r));break;case 10:e=this.parseTemplateLiteral();break;case 7:switch(this.lookahead.value){case"(":this.context.isBindingElement=!1,e=this.inheritCoverGrammar(this.parseGroupExpression);break;case"[":e=this.inheritCoverGrammar(this.parseArrayInitializer);break;case"{":e=this.inheritCoverGrammar(this.parseObjectInitializer);break;case"/":case"/=":this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1,this.scanner.index=this.startMarker.index,t=this.nextRegexToken(),r=this.getTokenRaw(t),e=this.finalize(n,new a.RegexLiteral(t.regex,r,t.pattern,t.flags));break;default:e=this.throwUnexpectedToken(this.nextToken())}break;case 4:!this.context.strict&&this.context.allowYield&&this.matchKeyword("yield")?e=this.parseIdentifierName():!this.context.strict&&this.matchKeyword("let")?e=this.finalize(n,new a.Identifier(this.nextToken().value)):(this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1,this.matchKeyword("function")?e=this.parseFunctionExpression():this.matchKeyword("this")?(this.nextToken(),e=this.finalize(n,new a.ThisExpression)):e=this.matchKeyword("class")?this.parseClassExpression():this.throwUnexpectedToken(this.nextToken()));break;default:e=this.throwUnexpectedToken(this.nextToken())}return e},e.prototype.parseSpreadElement=function(){var e=this.createNode();this.expect("...");var t=this.inheritCoverGrammar(this.parseAssignmentExpression);return this.finalize(e,new a.SpreadElement(t))},e.prototype.parseArrayInitializer=function(){var e=this.createNode(),t=[];for(this.expect("[");!this.match("]");)if(this.match(","))this.nextToken(),t.push(null);else if(this.match("...")){var r=this.parseSpreadElement();this.match("]")||(this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1,this.expect(",")),t.push(r)}else t.push(this.inheritCoverGrammar(this.parseAssignmentExpression)),this.match("]")||this.expect(",");return this.expect("]"),this.finalize(e,new a.ArrayExpression(t))},e.prototype.parsePropertyMethod=function(e){this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1;var t=this.context.strict,r=this.context.allowStrictDirective;this.context.allowStrictDirective=e.simple;var n=this.isolateCoverGrammar(this.parseFunctionSourceElements);return this.context.strict&&e.firstRestricted&&this.tolerateUnexpectedToken(e.firstRestricted,e.message),this.context.strict&&e.stricted&&this.tolerateUnexpectedToken(e.stricted,e.message),this.context.strict=t,this.context.allowStrictDirective=r,n},e.prototype.parsePropertyMethodFunction=function(){var e=this.createNode(),t=this.context.allowYield;this.context.allowYield=!0;var r=this.parseFormalParameters(),n=this.parsePropertyMethod(r);return this.context.allowYield=t,this.finalize(e,new a.FunctionExpression(null,r.params,n,!1))},e.prototype.parsePropertyMethodAsyncFunction=function(){var e=this.createNode(),t=this.context.allowYield,r=this.context.await;this.context.allowYield=!1,this.context.await=!0;var n=this.parseFormalParameters(),i=this.parsePropertyMethod(n);return this.context.allowYield=t,this.context.await=r,this.finalize(e,new a.AsyncFunctionExpression(null,n.params,i))},e.prototype.parseObjectPropertyKey=function(){var e,t=this.createNode(),r=this.nextToken();switch(r.type){case 8:case 6:this.context.strict&&r.octal&&this.tolerateUnexpectedToken(r,o.Messages.StrictOctalLiteral);var n=this.getTokenRaw(r);e=this.finalize(t,new a.Literal(r.value,n));break;case 3:case 1:case 5:case 4:e=this.finalize(t,new a.Identifier(r.value));break;case 7:"["===r.value?(e=this.isolateCoverGrammar(this.parseAssignmentExpression),this.expect("]")):e=this.throwUnexpectedToken(r);break;default:e=this.throwUnexpectedToken(r)}return e},e.prototype.isPropertyKey=function(e,t){return e.type===u.Syntax.Identifier&&e.name===t||e.type===u.Syntax.Literal&&e.value===t},e.prototype.parseObjectProperty=function(e){var t,r=this.createNode(),n=this.lookahead,i=null,s=null,u=!1,l=!1,c=!1,h=!1;if(3===n.type){var p=n.value;this.nextToken(),u=this.match("["),i=(h=!(this.hasLineTerminator||"async"!==p||this.match(":")||this.match("(")||this.match("*")||this.match(",")))?this.parseObjectPropertyKey():this.finalize(r,new a.Identifier(p))}else this.match("*")?this.nextToken():(u=this.match("["),i=this.parseObjectPropertyKey());var f=this.qualifiedPropertyName(this.lookahead);if(3===n.type&&!h&&"get"===n.value&&f)t="get",u=this.match("["),i=this.parseObjectPropertyKey(),this.context.allowYield=!1,s=this.parseGetterMethod();else if(3===n.type&&!h&&"set"===n.value&&f)t="set",u=this.match("["),i=this.parseObjectPropertyKey(),s=this.parseSetterMethod();else if(7===n.type&&"*"===n.value&&f)t="init",u=this.match("["),i=this.parseObjectPropertyKey(),s=this.parseGeneratorMethod(),l=!0;else if(i||this.throwUnexpectedToken(this.lookahead),t="init",this.match(":")&&!h)!u&&this.isPropertyKey(i,"__proto__")&&(e.value&&this.tolerateError(o.Messages.DuplicateProtoProperty),e.value=!0),this.nextToken(),s=this.inheritCoverGrammar(this.parseAssignmentExpression);else if(this.match("("))s=h?this.parsePropertyMethodAsyncFunction():this.parsePropertyMethodFunction(),l=!0;else if(3===n.type)if(p=this.finalize(r,new a.Identifier(n.value)),this.match("=")){this.context.firstCoverInitializedNameError=this.lookahead,this.nextToken(),c=!0;var d=this.isolateCoverGrammar(this.parseAssignmentExpression);s=this.finalize(r,new a.AssignmentPattern(p,d))}else c=!0,s=p;else this.throwUnexpectedToken(this.nextToken());return this.finalize(r,new a.Property(t,i,u,s,l,c))},e.prototype.parseObjectInitializer=function(){var e=this.createNode();this.expect("{");for(var t=[],r={value:!1};!this.match("}");)t.push(this.parseObjectProperty(r)),this.match("}")||this.expectCommaSeparator();return this.expect("}"),this.finalize(e,new a.ObjectExpression(t))},e.prototype.parseTemplateHead=function(){n.assert(this.lookahead.head,"Template literal must start with a template head");var e=this.createNode(),t=this.nextToken(),r=t.value,i=t.cooked;return this.finalize(e,new a.TemplateElement({raw:r,cooked:i},t.tail))},e.prototype.parseTemplateElement=function(){10!==this.lookahead.type&&this.throwUnexpectedToken();var e=this.createNode(),t=this.nextToken(),r=t.value,n=t.cooked;return this.finalize(e,new a.TemplateElement({raw:r,cooked:n},t.tail))},e.prototype.parseTemplateLiteral=function(){var e=this.createNode(),t=[],r=[],n=this.parseTemplateHead();for(r.push(n);!n.tail;)t.push(this.parseExpression()),n=this.parseTemplateElement(),r.push(n);return this.finalize(e,new a.TemplateLiteral(r,t))},e.prototype.reinterpretExpressionAsPattern=function(e){switch(e.type){case u.Syntax.Identifier:case u.Syntax.MemberExpression:case u.Syntax.RestElement:case u.Syntax.AssignmentPattern:break;case u.Syntax.SpreadElement:e.type=u.Syntax.RestElement,this.reinterpretExpressionAsPattern(e.argument);break;case u.Syntax.ArrayExpression:e.type=u.Syntax.ArrayPattern;for(var t=0;t<e.elements.length;t++)null!==e.elements[t]&&this.reinterpretExpressionAsPattern(e.elements[t]);break;case u.Syntax.ObjectExpression:for(e.type=u.Syntax.ObjectPattern,t=0;t<e.properties.length;t++)this.reinterpretExpressionAsPattern(e.properties[t].value);break;case u.Syntax.AssignmentExpression:e.type=u.Syntax.AssignmentPattern,delete e.operator,this.reinterpretExpressionAsPattern(e.left)}},e.prototype.parseGroupExpression=function(){var e;if(this.expect("("),this.match(")"))this.nextToken(),this.match("=>")||this.expect("=>"),e={type:"ArrowParameterPlaceHolder",params:[],async:!1};else{var t=this.lookahead,r=[];if(this.match("..."))e=this.parseRestElement(r),this.expect(")"),this.match("=>")||this.expect("=>"),e={type:"ArrowParameterPlaceHolder",params:[e],async:!1};else{var n=!1;if(this.context.isBindingElement=!0,e=this.inheritCoverGrammar(this.parseAssignmentExpression),this.match(",")){var i=[];for(this.context.isAssignmentTarget=!1,i.push(e);2!==this.lookahead.type&&this.match(",");){if(this.nextToken(),this.match(")")){this.nextToken();for(var o=0;o<i.length;o++)this.reinterpretExpressionAsPattern(i[o]);n=!0,e={type:"ArrowParameterPlaceHolder",params:i,async:!1}}else if(this.match("...")){for(this.context.isBindingElement||this.throwUnexpectedToken(this.lookahead),i.push(this.parseRestElement(r)),this.expect(")"),this.match("=>")||this.expect("=>"),this.context.isBindingElement=!1,o=0;o<i.length;o++)this.reinterpretExpressionAsPattern(i[o]);n=!0,e={type:"ArrowParameterPlaceHolder",params:i,async:!1}}else i.push(this.inheritCoverGrammar(this.parseAssignmentExpression));if(n)break}n||(e=this.finalize(this.startNode(t),new a.SequenceExpression(i)))}if(!n){if(this.expect(")"),this.match("=>")&&(e.type===u.Syntax.Identifier&&"yield"===e.name&&(n=!0,e={type:"ArrowParameterPlaceHolder",params:[e],async:!1}),!n)){if(this.context.isBindingElement||this.throwUnexpectedToken(this.lookahead),e.type===u.Syntax.SequenceExpression)for(o=0;o<e.expressions.length;o++)this.reinterpretExpressionAsPattern(e.expressions[o]);else this.reinterpretExpressionAsPattern(e);e={type:"ArrowParameterPlaceHolder",params:e.type===u.Syntax.SequenceExpression?e.expressions:[e],async:!1}}this.context.isBindingElement=!1}}}return e},e.prototype.parseArguments=function(){this.expect("(");var e=[];if(!this.match(")"))for(;;){var t=this.match("...")?this.parseSpreadElement():this.isolateCoverGrammar(this.parseAssignmentExpression);if(e.push(t),this.match(")"))break;if(this.expectCommaSeparator(),this.match(")"))break}return this.expect(")"),e},e.prototype.isIdentifierName=function(e){return 3===e.type||4===e.type||1===e.type||5===e.type},e.prototype.parseIdentifierName=function(){var e=this.createNode(),t=this.nextToken();return this.isIdentifierName(t)||this.throwUnexpectedToken(t),this.finalize(e,new a.Identifier(t.value))},e.prototype.parseNewExpression=function(){var e,t=this.createNode(),r=this.parseIdentifierName();if(n.assert("new"===r.name,"New expression must start with `new`"),this.match("."))if(this.nextToken(),3===this.lookahead.type&&this.context.inFunctionBody&&"target"===this.lookahead.value){var i=this.parseIdentifierName();e=new a.MetaProperty(r,i)}else this.throwUnexpectedToken(this.lookahead);else{var o=this.isolateCoverGrammar(this.parseLeftHandSideExpression),s=this.match("(")?this.parseArguments():[];e=new a.NewExpression(o,s),this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1}return this.finalize(t,e)},e.prototype.parseAsyncArgument=function(){var e=this.parseAssignmentExpression();return this.context.firstCoverInitializedNameError=null,e},e.prototype.parseAsyncArguments=function(){this.expect("(");var e=[];if(!this.match(")"))for(;;){var t=this.match("...")?this.parseSpreadElement():this.isolateCoverGrammar(this.parseAsyncArgument);if(e.push(t),this.match(")"))break;if(this.expectCommaSeparator(),this.match(")"))break}return this.expect(")"),e},e.prototype.parseLeftHandSideExpressionAllowCall=function(){var e,t=this.lookahead,r=this.matchContextualKeyword("async"),n=this.context.allowIn;for(this.context.allowIn=!0,this.matchKeyword("super")&&this.context.inFunctionBody?(e=this.createNode(),this.nextToken(),e=this.finalize(e,new a.Super),this.match("(")||this.match(".")||this.match("[")||this.throwUnexpectedToken(this.lookahead)):e=this.inheritCoverGrammar(this.matchKeyword("new")?this.parseNewExpression:this.parsePrimaryExpression);;)if(this.match(".")){this.context.isBindingElement=!1,this.context.isAssignmentTarget=!0,this.expect(".");var i=this.parseIdentifierName();e=this.finalize(this.startNode(t),new a.StaticMemberExpression(e,i))}else if(this.match("(")){var o=r&&t.lineNumber===this.lookahead.lineNumber;this.context.isBindingElement=!1,this.context.isAssignmentTarget=!1;var s=o?this.parseAsyncArguments():this.parseArguments();if(e=this.finalize(this.startNode(t),new a.CallExpression(e,s)),o&&this.match("=>")){for(var u=0;u<s.length;++u)this.reinterpretExpressionAsPattern(s[u]);e={type:"ArrowParameterPlaceHolder",params:s,async:!0}}}else if(this.match("["))this.context.isBindingElement=!1,this.context.isAssignmentTarget=!0,this.expect("["),i=this.isolateCoverGrammar(this.parseExpression),this.expect("]"),e=this.finalize(this.startNode(t),new a.ComputedMemberExpression(e,i));else{if(10!==this.lookahead.type||!this.lookahead.head)break;var l=this.parseTemplateLiteral();e=this.finalize(this.startNode(t),new a.TaggedTemplateExpression(e,l))}return this.context.allowIn=n,e},e.prototype.parseSuper=function(){var e=this.createNode();return this.expectKeyword("super"),this.match("[")||this.match(".")||this.throwUnexpectedToken(this.lookahead),this.finalize(e,new a.Super)},e.prototype.parseLeftHandSideExpression=function(){n.assert(this.context.allowIn,"callee of new expression always allow in keyword.");for(var e=this.startNode(this.lookahead),t=this.matchKeyword("super")&&this.context.inFunctionBody?this.parseSuper():this.inheritCoverGrammar(this.matchKeyword("new")?this.parseNewExpression:this.parsePrimaryExpression);;)if(this.match("[")){this.context.isBindingElement=!1,this.context.isAssignmentTarget=!0,this.expect("[");var r=this.isolateCoverGrammar(this.parseExpression);this.expect("]"),t=this.finalize(e,new a.ComputedMemberExpression(t,r))}else if(this.match("."))this.context.isBindingElement=!1,this.context.isAssignmentTarget=!0,this.expect("."),r=this.parseIdentifierName(),t=this.finalize(e,new a.StaticMemberExpression(t,r));else{if(10!==this.lookahead.type||!this.lookahead.head)break;var i=this.parseTemplateLiteral();t=this.finalize(e,new a.TaggedTemplateExpression(t,i))}return t},e.prototype.parseUpdateExpression=function(){var e,t=this.lookahead;if(this.match("++")||this.match("--")){var r=this.startNode(t),n=this.nextToken();e=this.inheritCoverGrammar(this.parseUnaryExpression),this.context.strict&&e.type===u.Syntax.Identifier&&this.scanner.isRestrictedWord(e.name)&&this.tolerateError(o.Messages.StrictLHSPrefix),this.context.isAssignmentTarget||this.tolerateError(o.Messages.InvalidLHSInAssignment);var i=!0;e=this.finalize(r,new a.UpdateExpression(n.value,e,i)),this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1}else if(e=this.inheritCoverGrammar(this.parseLeftHandSideExpressionAllowCall),!this.hasLineTerminator&&7===this.lookahead.type&&(this.match("++")||this.match("--"))){this.context.strict&&e.type===u.Syntax.Identifier&&this.scanner.isRestrictedWord(e.name)&&this.tolerateError(o.Messages.StrictLHSPostfix),this.context.isAssignmentTarget||this.tolerateError(o.Messages.InvalidLHSInAssignment),this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1;var s=this.nextToken().value;i=!1,e=this.finalize(this.startNode(t),new a.UpdateExpression(s,e,i))}return e},e.prototype.parseAwaitExpression=function(){var e=this.createNode();this.nextToken();var t=this.parseUnaryExpression();return this.finalize(e,new a.AwaitExpression(t))},e.prototype.parseUnaryExpression=function(){var e;if(this.match("+")||this.match("-")||this.match("~")||this.match("!")||this.matchKeyword("delete")||this.matchKeyword("void")||this.matchKeyword("typeof")){var t=this.startNode(this.lookahead),r=this.nextToken();e=this.inheritCoverGrammar(this.parseUnaryExpression),e=this.finalize(t,new a.UnaryExpression(r.value,e)),this.context.strict&&"delete"===e.operator&&e.argument.type===u.Syntax.Identifier&&this.tolerateError(o.Messages.StrictDelete),this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1}else e=this.context.await&&this.matchContextualKeyword("await")?this.parseAwaitExpression():this.parseUpdateExpression();return e},e.prototype.parseExponentiationExpression=function(){var e=this.lookahead,t=this.inheritCoverGrammar(this.parseUnaryExpression);if(t.type!==u.Syntax.UnaryExpression&&this.match("**")){this.nextToken(),this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1;var r=t,n=this.isolateCoverGrammar(this.parseExponentiationExpression);t=this.finalize(this.startNode(e),new a.BinaryExpression("**",r,n))}return t},e.prototype.binaryPrecedence=function(e){var t=e.value;return 7===e.type?this.operatorPrecedence[t]||0:4===e.type&&("instanceof"===t||this.context.allowIn&&"in"===t)?7:0},e.prototype.parseBinaryExpression=function(){var e=this.lookahead,t=this.inheritCoverGrammar(this.parseExponentiationExpression),r=this.lookahead,n=this.binaryPrecedence(r);if(n>0){this.nextToken(),this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1;for(var i=[e,this.lookahead],o=t,s=this.isolateCoverGrammar(this.parseExponentiationExpression),u=[o,r.value,s],l=[n];!((n=this.binaryPrecedence(this.lookahead))<=0);){for(;u.length>2&&n<=l[l.length-1];){s=u.pop();var c=u.pop();l.pop(),o=u.pop(),i.pop();var h=this.startNode(i[i.length-1]);u.push(this.finalize(h,new a.BinaryExpression(c,o,s)))}u.push(this.nextToken().value),l.push(n),i.push(this.lookahead),u.push(this.isolateCoverGrammar(this.parseExponentiationExpression))}var p=u.length-1;t=u[p];for(var f=i.pop();p>1;){var d=i.pop(),m=f&&f.lineStart;h=this.startNode(d,m),c=u[p-1],t=this.finalize(h,new a.BinaryExpression(c,u[p-2],t)),p-=2,f=d}}return t},e.prototype.parseConditionalExpression=function(){var e=this.lookahead,t=this.inheritCoverGrammar(this.parseBinaryExpression);if(this.match("?")){this.nextToken();var r=this.context.allowIn;this.context.allowIn=!0;var n=this.isolateCoverGrammar(this.parseAssignmentExpression);this.context.allowIn=r,this.expect(":");var i=this.isolateCoverGrammar(this.parseAssignmentExpression);t=this.finalize(this.startNode(e),new a.ConditionalExpression(t,n,i)),this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1}return t},e.prototype.checkPatternParam=function(e,t){switch(t.type){case u.Syntax.Identifier:this.validateParam(e,t,t.name);break;case u.Syntax.RestElement:this.checkPatternParam(e,t.argument);break;case u.Syntax.AssignmentPattern:this.checkPatternParam(e,t.left);break;case u.Syntax.ArrayPattern:for(var r=0;r<t.elements.length;r++)null!==t.elements[r]&&this.checkPatternParam(e,t.elements[r]);break;case u.Syntax.ObjectPattern:for(r=0;r<t.properties.length;r++)this.checkPatternParam(e,t.properties[r].value)}e.simple=e.simple&&t instanceof a.Identifier},e.prototype.reinterpretAsCoverFormalsList=function(e){var t,r=[e],n=!1;switch(e.type){case u.Syntax.Identifier:break;case"ArrowParameterPlaceHolder":r=e.params,n=e.async;break;default:return null}t={simple:!0,paramSet:{}};for(var i=0;i<r.length;++i)(a=r[i]).type===u.Syntax.AssignmentPattern?a.right.type===u.Syntax.YieldExpression&&(a.right.argument&&this.throwUnexpectedToken(this.lookahead),a.right.type=u.Syntax.Identifier,a.right.name="yield",delete a.right.argument,delete a.right.delegate):n&&a.type===u.Syntax.Identifier&&"await"===a.name&&this.throwUnexpectedToken(this.lookahead),this.checkPatternParam(t,a),r[i]=a;if(this.context.strict||!this.context.allowYield)for(i=0;i<r.length;++i){var a;(a=r[i]).type===u.Syntax.YieldExpression&&this.throwUnexpectedToken(this.lookahead)}if(t.message===o.Messages.StrictParamDupe){var s=this.context.strict?t.stricted:t.firstRestricted;this.throwUnexpectedToken(s,t.message)}return{simple:t.simple,params:r,stricted:t.stricted,firstRestricted:t.firstRestricted,message:t.message}},e.prototype.parseAssignmentExpression=function(){var e;if(!this.context.allowYield&&this.matchKeyword("yield"))e=this.parseYieldExpression();else{var t=this.lookahead,r=t;if(e=this.parseConditionalExpression(),3===r.type&&r.lineNumber===this.lookahead.lineNumber&&"async"===r.value&&(3===this.lookahead.type||this.matchKeyword("yield"))){var n=this.parsePrimaryExpression();this.reinterpretExpressionAsPattern(n),e={type:"ArrowParameterPlaceHolder",params:[n],async:!0}}if("ArrowParameterPlaceHolder"===e.type||this.match("=>")){this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1;var i=e.async,s=this.reinterpretAsCoverFormalsList(e);if(s){this.hasLineTerminator&&this.tolerateUnexpectedToken(this.lookahead),this.context.firstCoverInitializedNameError=null;var l=this.context.strict,c=this.context.allowStrictDirective;this.context.allowStrictDirective=s.simple;var h=this.context.allowYield,p=this.context.await;this.context.allowYield=!0,this.context.await=i;var f=this.startNode(t);this.expect("=>");var d=void 0;if(this.match("{")){var m=this.context.allowIn;this.context.allowIn=!0,d=this.parseFunctionSourceElements(),this.context.allowIn=m}else d=this.isolateCoverGrammar(this.parseAssignmentExpression);var y=d.type!==u.Syntax.BlockStatement;this.context.strict&&s.firstRestricted&&this.throwUnexpectedToken(s.firstRestricted,s.message),this.context.strict&&s.stricted&&this.tolerateUnexpectedToken(s.stricted,s.message),e=i?this.finalize(f,new a.AsyncArrowFunctionExpression(s.params,d,y)):this.finalize(f,new a.ArrowFunctionExpression(s.params,d,y)),this.context.strict=l,this.context.allowStrictDirective=c,this.context.allowYield=h,this.context.await=p}}else if(this.matchAssign()){if(this.context.isAssignmentTarget||this.tolerateError(o.Messages.InvalidLHSInAssignment),this.context.strict&&e.type===u.Syntax.Identifier){var v=e;this.scanner.isRestrictedWord(v.name)&&this.tolerateUnexpectedToken(r,o.Messages.StrictLHSAssignment),this.scanner.isStrictModeReservedWord(v.name)&&this.tolerateUnexpectedToken(r,o.Messages.StrictReservedWord)}this.match("=")?this.reinterpretExpressionAsPattern(e):(this.context.isAssignmentTarget=!1,this.context.isBindingElement=!1);var _=(r=this.nextToken()).value,g=this.isolateCoverGrammar(this.parseAssignmentExpression);e=this.finalize(this.startNode(t),new a.AssignmentExpression(_,e,g)),this.context.firstCoverInitializedNameError=null}}return e},e.prototype.parseExpression=function(){var e=this.lookahead,t=this.isolateCoverGrammar(this.parseAssignmentExpression);if(this.match(",")){var r=[];for(r.push(t);2!==this.lookahead.type&&this.match(",");)this.nextToken(),r.push(this.isolateCoverGrammar(this.parseAssignmentExpression));t=this.finalize(this.startNode(e),new a.SequenceExpression(r))}return t},e.prototype.parseStatementListItem=function(){var e;if(this.context.isAssignmentTarget=!0,this.context.isBindingElement=!0,4===this.lookahead.type)switch(this.lookahead.value){case"export":this.context.isModule||this.tolerateUnexpectedToken(this.lookahead,o.Messages.IllegalExportDeclaration),e=this.parseExportDeclaration();break;case"import":this.context.isModule||this.tolerateUnexpectedToken(this.lookahead,o.Messages.IllegalImportDeclaration),e=this.parseImportDeclaration();break;case"const":e=this.parseLexicalDeclaration({inFor:!1});break;case"function":e=this.parseFunctionDeclaration();break;case"class":e=this.parseClassDeclaration();break;case"let":e=this.isLexicalDeclaration()?this.parseLexicalDeclaration({inFor:!1}):this.parseStatement();break;default:e=this.parseStatement()}else e=this.parseStatement();return e},e.prototype.parseBlock=function(){var e=this.createNode();this.expect("{");for(var t=[];!this.match("}");)t.push(this.parseStatementListItem());return this.expect("}"),this.finalize(e,new a.BlockStatement(t))},e.prototype.parseLexicalBinding=function(e,t){var r=this.createNode(),n=this.parsePattern([],e);this.context.strict&&n.type===u.Syntax.Identifier&&this.scanner.isRestrictedWord(n.name)&&this.tolerateError(o.Messages.StrictVarName);var i=null;return"const"===e?this.matchKeyword("in")||this.matchContextualKeyword("of")||(this.match("=")?(this.nextToken(),i=this.isolateCoverGrammar(this.parseAssignmentExpression)):this.throwError(o.Messages.DeclarationMissingInitializer,"const")):(!t.inFor&&n.type!==u.Syntax.Identifier||this.match("="))&&(this.expect("="),i=this.isolateCoverGrammar(this.parseAssignmentExpression)),this.finalize(r,new a.VariableDeclarator(n,i))},e.prototype.parseBindingList=function(e,t){for(var r=[this.parseLexicalBinding(e,t)];this.match(",");)this.nextToken(),r.push(this.parseLexicalBinding(e,t));return r},e.prototype.isLexicalDeclaration=function(){var e=this.scanner.saveState();this.scanner.scanComments();var t=this.scanner.lex();return this.scanner.restoreState(e),3===t.type||7===t.type&&"["===t.value||7===t.type&&"{"===t.value||4===t.type&&"let"===t.value||4===t.type&&"yield"===t.value},e.prototype.parseLexicalDeclaration=function(e){var t=this.createNode(),r=this.nextToken().value;n.assert("let"===r||"const"===r,"Lexical declaration must be either let or const");var i=this.parseBindingList(r,e);return this.consumeSemicolon(),this.finalize(t,new a.VariableDeclaration(i,r))},e.prototype.parseBindingRestElement=function(e,t){var r=this.createNode();this.expect("...");var n=this.parsePattern(e,t);return this.finalize(r,new a.RestElement(n))},e.prototype.parseArrayPattern=function(e,t){var r=this.createNode();this.expect("[");for(var n=[];!this.match("]");)if(this.match(","))this.nextToken(),n.push(null);else{if(this.match("...")){n.push(this.parseBindingRestElement(e,t));break}n.push(this.parsePatternWithDefault(e,t)),this.match("]")||this.expect(",")}return this.expect("]"),this.finalize(r,new a.ArrayPattern(n))},e.prototype.parsePropertyPattern=function(e,t){var r,n,i=this.createNode(),o=!1,s=!1;if(3===this.lookahead.type){var u=this.lookahead;r=this.parseVariableIdentifier();var l=this.finalize(i,new a.Identifier(u.value));if(this.match("=")){e.push(u),s=!0,this.nextToken();var c=this.parseAssignmentExpression();n=this.finalize(this.startNode(u),new a.AssignmentPattern(l,c))}else this.match(":")?(this.expect(":"),n=this.parsePatternWithDefault(e,t)):(e.push(u),s=!0,n=l)}else o=this.match("["),r=this.parseObjectPropertyKey(),this.expect(":"),n=this.parsePatternWithDefault(e,t);return this.finalize(i,new a.Property("init",r,o,n,!1,s))},e.prototype.parseObjectPattern=function(e,t){var r=this.createNode(),n=[];for(this.expect("{");!this.match("}");)n.push(this.parsePropertyPattern(e,t)),this.match("}")||this.expect(",");return this.expect("}"),this.finalize(r,new a.ObjectPattern(n))},e.prototype.parsePattern=function(e,t){var r;return this.match("[")?r=this.parseArrayPattern(e,t):this.match("{")?r=this.parseObjectPattern(e,t):(!this.matchKeyword("let")||"const"!==t&&"let"!==t||this.tolerateUnexpectedToken(this.lookahead,o.Messages.LetInLexicalBinding),e.push(this.lookahead),r=this.parseVariableIdentifier(t)),r},e.prototype.parsePatternWithDefault=function(e,t){var r=this.lookahead,n=this.parsePattern(e,t);if(this.match("=")){this.nextToken();var i=this.context.allowYield;this.context.allowYield=!0;var o=this.isolateCoverGrammar(this.parseAssignmentExpression);this.context.allowYield=i,n=this.finalize(this.startNode(r),new a.AssignmentPattern(n,o))}return n},e.prototype.parseVariableIdentifier=function(e){var t=this.createNode(),r=this.nextToken();return 4===r.type&&"yield"===r.value?this.context.strict?this.tolerateUnexpectedToken(r,o.Messages.StrictReservedWord):this.context.allowYield||this.throwUnexpectedToken(r):3!==r.type?this.context.strict&&4===r.type&&this.scanner.isStrictModeReservedWord(r.value)?this.tolerateUnexpectedToken(r,o.Messages.StrictReservedWord):(this.context.strict||"let"!==r.value||"var"!==e)&&this.throwUnexpectedToken(r):(this.context.isModule||this.context.await)&&3===r.type&&"await"===r.value&&this.tolerateUnexpectedToken(r),this.finalize(t,new a.Identifier(r.value))},e.prototype.parseVariableDeclaration=function(e){var t=this.createNode(),r=this.parsePattern([],"var");this.context.strict&&r.type===u.Syntax.Identifier&&this.scanner.isRestrictedWord(r.name)&&this.tolerateError(o.Messages.StrictVarName);var n=null;return this.match("=")?(this.nextToken(),n=this.isolateCoverGrammar(this.parseAssignmentExpression)):r.type===u.Syntax.Identifier||e.inFor||this.expect("="),this.finalize(t,new a.VariableDeclarator(r,n))},e.prototype.parseVariableDeclarationList=function(e){var t={inFor:e.inFor},r=[];for(r.push(this.parseVariableDeclaration(t));this.match(",");)this.nextToken(),r.push(this.parseVariableDeclaration(t));return r},e.prototype.parseVariableStatement=function(){var e=this.createNode();this.expectKeyword("var");var t=this.parseVariableDeclarationList({inFor:!1});return this.consumeSemicolon(),this.finalize(e,new a.VariableDeclaration(t,"var"))},e.prototype.parseEmptyStatement=function(){var e=this.createNode();return this.expect(";"),this.finalize(e,new a.EmptyStatement)},e.prototype.parseExpressionStatement=function(){var e=this.createNode(),t=this.parseExpression();return this.consumeSemicolon(),this.finalize(e,new a.ExpressionStatement(t))},e.prototype.parseIfClause=function(){return this.context.strict&&this.matchKeyword("function")&&this.tolerateError(o.Messages.StrictFunction),this.parseStatement()},e.prototype.parseIfStatement=function(){var e,t=this.createNode(),r=null;this.expectKeyword("if"),this.expect("(");var n=this.parseExpression();return!this.match(")")&&this.config.tolerant?(this.tolerateUnexpectedToken(this.nextToken()),e=this.finalize(this.createNode(),new a.EmptyStatement)):(this.expect(")"),e=this.parseIfClause(),this.matchKeyword("else")&&(this.nextToken(),r=this.parseIfClause())),this.finalize(t,new a.IfStatement(n,e,r))},e.prototype.parseDoWhileStatement=function(){var e=this.createNode();this.expectKeyword("do");var t=this.context.inIteration;this.context.inIteration=!0;var r=this.parseStatement();this.context.inIteration=t,this.expectKeyword("while"),this.expect("(");var n=this.parseExpression();return!this.match(")")&&this.config.tolerant?this.tolerateUnexpectedToken(this.nextToken()):(this.expect(")"),this.match(";")&&this.nextToken()),this.finalize(e,new a.DoWhileStatement(r,n))},e.prototype.parseWhileStatement=function(){var e,t=this.createNode();this.expectKeyword("while"),this.expect("(");var r=this.parseExpression();if(!this.match(")")&&this.config.tolerant)this.tolerateUnexpectedToken(this.nextToken()),e=this.finalize(this.createNode(),new a.EmptyStatement);else{this.expect(")");var n=this.context.inIteration;this.context.inIteration=!0,e=this.parseStatement(),this.context.inIteration=n}return this.finalize(t,new a.WhileStatement(r,e))},e.prototype.parseForStatement=function(){var e,t,r,n=null,i=null,s=null,l=!0,c=this.createNode();if(this.expectKeyword("for"),this.expect("("),this.match(";"))this.nextToken();else if(this.matchKeyword("var")){n=this.createNode(),this.nextToken();var h=this.context.allowIn;this.context.allowIn=!1;var p=this.parseVariableDeclarationList({inFor:!0});if(this.context.allowIn=h,1===p.length&&this.matchKeyword("in")){var f=p[0];f.init&&(f.id.type===u.Syntax.ArrayPattern||f.id.type===u.Syntax.ObjectPattern||this.context.strict)&&this.tolerateError(o.Messages.ForInOfLoopInitializer,"for-in"),n=this.finalize(n,new a.VariableDeclaration(p,"var")),this.nextToken(),e=n,t=this.parseExpression(),n=null}else 1===p.length&&null===p[0].init&&this.matchContextualKeyword("of")?(n=this.finalize(n,new a.VariableDeclaration(p,"var")),this.nextToken(),e=n,t=this.parseAssignmentExpression(),n=null,l=!1):(n=this.finalize(n,new a.VariableDeclaration(p,"var")),this.expect(";"))}else if(this.matchKeyword("const")||this.matchKeyword("let")){n=this.createNode();var d=this.nextToken().value;this.context.strict||"in"!==this.lookahead.value?(h=this.context.allowIn,this.context.allowIn=!1,p=this.parseBindingList(d,{inFor:!0}),this.context.allowIn=h,1===p.length&&null===p[0].init&&this.matchKeyword("in")?(n=this.finalize(n,new a.VariableDeclaration(p,d)),this.nextToken(),e=n,t=this.parseExpression(),n=null):1===p.length&&null===p[0].init&&this.matchContextualKeyword("of")?(n=this.finalize(n,new a.VariableDeclaration(p,d)),this.nextToken(),e=n,t=this.parseAssignmentExpression(),n=null,l=!1):(this.consumeSemicolon(),n=this.finalize(n,new a.VariableDeclaration(p,d)))):(n=this.finalize(n,new a.Identifier(d)),this.nextToken(),e=n,t=this.parseExpression(),n=null)}else{var m=this.lookahead;if(h=this.context.allowIn,this.context.allowIn=!1,n=this.inheritCoverGrammar(this.parseAssignmentExpression),this.context.allowIn=h,this.matchKeyword("in"))this.context.isAssignmentTarget&&n.type!==u.Syntax.AssignmentExpression||this.tolerateError(o.Messages.InvalidLHSInForIn),this.nextToken(),this.reinterpretExpressionAsPattern(n),e=n,t=this.parseExpression(),n=null;else if(this.matchContextualKeyword("of"))this.context.isAssignmentTarget&&n.type!==u.Syntax.AssignmentExpression||this.tolerateError(o.Messages.InvalidLHSInForLoop),this.nextToken(),this.reinterpretExpressionAsPattern(n),e=n,t=this.parseAssignmentExpression(),n=null,l=!1;else{if(this.match(",")){for(var y=[n];this.match(",");)this.nextToken(),y.push(this.isolateCoverGrammar(this.parseAssignmentExpression));n=this.finalize(this.startNode(m),new a.SequenceExpression(y))}this.expect(";")}}if(void 0===e&&(this.match(";")||(i=this.parseExpression()),this.expect(";"),this.match(")")||(s=this.parseExpression())),!this.match(")")&&this.config.tolerant)this.tolerateUnexpectedToken(this.nextToken()),r=this.finalize(this.createNode(),new a.EmptyStatement);else{this.expect(")");var v=this.context.inIteration;this.context.inIteration=!0,r=this.isolateCoverGrammar(this.parseStatement),this.context.inIteration=v}return void 0===e?this.finalize(c,new a.ForStatement(n,i,s,r)):l?this.finalize(c,new a.ForInStatement(e,t,r)):this.finalize(c,new a.ForOfStatement(e,t,r))},e.prototype.parseContinueStatement=function(){var e=this.createNode();this.expectKeyword("continue");var t=null;if(3===this.lookahead.type&&!this.hasLineTerminator){var r=this.parseVariableIdentifier();t=r;var n="$"+r.name;Object.prototype.hasOwnProperty.call(this.context.labelSet,n)||this.throwError(o.Messages.UnknownLabel,r.name)}return this.consumeSemicolon(),null!==t||this.context.inIteration||this.throwError(o.Messages.IllegalContinue),this.finalize(e,new a.ContinueStatement(t))},e.prototype.parseBreakStatement=function(){var e=this.createNode();this.expectKeyword("break");var t=null;if(3===this.lookahead.type&&!this.hasLineTerminator){var r=this.parseVariableIdentifier(),n="$"+r.name;Object.prototype.hasOwnProperty.call(this.context.labelSet,n)||this.throwError(o.Messages.UnknownLabel,r.name),t=r}return this.consumeSemicolon(),null!==t||this.context.inIteration||this.context.inSwitch||this.throwError(o.Messages.IllegalBreak),this.finalize(e,new a.BreakStatement(t))},e.prototype.parseReturnStatement=function(){this.context.inFunctionBody||this.tolerateError(o.Messages.IllegalReturn);var e=this.createNode();this.expectKeyword("return");var t=(this.match(";")||this.match("}")||this.hasLineTerminator||2===this.lookahead.type)&&8!==this.lookahead.type&&10!==this.lookahead.type?null:this.parseExpression();return this.consumeSemicolon(),this.finalize(e,new a.ReturnStatement(t))},e.prototype.parseWithStatement=function(){this.context.strict&&this.tolerateError(o.Messages.StrictModeWith);var e,t=this.createNode();this.expectKeyword("with"),this.expect("(");var r=this.parseExpression();return!this.match(")")&&this.config.tolerant?(this.tolerateUnexpectedToken(this.nextToken()),e=this.finalize(this.createNode(),new a.EmptyStatement)):(this.expect(")"),e=this.parseStatement()),this.finalize(t,new a.WithStatement(r,e))},e.prototype.parseSwitchCase=function(){var e,t=this.createNode();this.matchKeyword("default")?(this.nextToken(),e=null):(this.expectKeyword("case"),e=this.parseExpression()),this.expect(":");for(var r=[];!(this.match("}")||this.matchKeyword("default")||this.matchKeyword("case"));)r.push(this.parseStatementListItem());return this.finalize(t,new a.SwitchCase(e,r))},e.prototype.parseSwitchStatement=function(){var e=this.createNode();this.expectKeyword("switch"),this.expect("(");var t=this.parseExpression();this.expect(")");var r=this.context.inSwitch;this.context.inSwitch=!0;var n=[],i=!1;for(this.expect("{");!this.match("}");){var s=this.parseSwitchCase();null===s.test&&(i&&this.throwError(o.Messages.MultipleDefaultsInSwitch),i=!0),n.push(s)}return this.expect("}"),this.context.inSwitch=r,this.finalize(e,new a.SwitchStatement(t,n))},e.prototype.parseLabelledStatement=function(){var e,t=this.createNode(),r=this.parseExpression();if(r.type===u.Syntax.Identifier&&this.match(":")){this.nextToken();var n=r,i="$"+n.name;Object.prototype.hasOwnProperty.call(this.context.labelSet,i)&&this.throwError(o.Messages.Redeclaration,"Label",n.name),this.context.labelSet[i]=!0;var s=void 0;if(this.matchKeyword("class"))this.tolerateUnexpectedToken(this.lookahead),s=this.parseClassDeclaration();else if(this.matchKeyword("function")){var l=this.lookahead,c=this.parseFunctionDeclaration();this.context.strict?this.tolerateUnexpectedToken(l,o.Messages.StrictFunction):c.generator&&this.tolerateUnexpectedToken(l,o.Messages.GeneratorInLegacyContext),s=c}else s=this.parseStatement();delete this.context.labelSet[i],e=new a.LabeledStatement(n,s)}else this.consumeSemicolon(),e=new a.ExpressionStatement(r);return this.finalize(t,e)},e.prototype.parseThrowStatement=function(){var e=this.createNode();this.expectKeyword("throw"),this.hasLineTerminator&&this.throwError(o.Messages.NewlineAfterThrow);var t=this.parseExpression();return this.consumeSemicolon(),this.finalize(e,new a.ThrowStatement(t))},e.prototype.parseCatchClause=function(){var e=this.createNode();this.expectKeyword("catch"),this.expect("("),this.match(")")&&this.throwUnexpectedToken(this.lookahead);for(var t=[],r=this.parsePattern(t),n={},i=0;i<t.length;i++){var s="$"+t[i].value;Object.prototype.hasOwnProperty.call(n,s)&&this.tolerateError(o.Messages.DuplicateBinding,t[i].value),n[s]=!0}this.context.strict&&r.type===u.Syntax.Identifier&&this.scanner.isRestrictedWord(r.name)&&this.tolerateError(o.Messages.StrictCatchVariable),this.expect(")");var l=this.parseBlock();return this.finalize(e,new a.CatchClause(r,l))},e.prototype.parseFinallyClause=function(){return this.expectKeyword("finally"),this.parseBlock()},e.prototype.parseTryStatement=function(){var e=this.createNode();this.expectKeyword("try");var t=this.parseBlock(),r=this.matchKeyword("catch")?this.parseCatchClause():null,n=this.matchKeyword("finally")?this.parseFinallyClause():null;return r||n||this.throwError(o.Messages.NoCatchOrFinally),this.finalize(e,new a.TryStatement(t,r,n))},e.prototype.parseDebuggerStatement=function(){var e=this.createNode();return this.expectKeyword("debugger"),this.consumeSemicolon(),this.finalize(e,new a.DebuggerStatement)},e.prototype.parseStatement=function(){var e;switch(this.lookahead.type){case 1:case 5:case 6:case 8:case 10:case 9:e=this.parseExpressionStatement();break;case 7:var t=this.lookahead.value;e="{"===t?this.parseBlock():"("===t?this.parseExpressionStatement():";"===t?this.parseEmptyStatement():this.parseExpressionStatement();break;case 3:e=this.matchAsyncFunction()?this.parseFunctionDeclaration():this.parseLabelledStatement();break;case 4:switch(this.lookahead.value){case"break":e=this.parseBreakStatement();break;case"continue":e=this.parseContinueStatement();break;case"debugger":e=this.parseDebuggerStatement();break;case"do":e=this.parseDoWhileStatement();break;case"for":e=this.parseForStatement();break;case"function":e=this.parseFunctionDeclaration();break;case"if":e=this.parseIfStatement();break;case"return":e=this.parseReturnStatement();break;case"switch":e=this.parseSwitchStatement();break;case"throw":e=this.parseThrowStatement();break;case"try":e=this.parseTryStatement();break;case"var":e=this.parseVariableStatement();break;case"while":e=this.parseWhileStatement();break;case"with":e=this.parseWithStatement();break;default:e=this.parseExpressionStatement()}break;default:e=this.throwUnexpectedToken(this.lookahead)}return e},e.prototype.parseFunctionSourceElements=function(){var e=this.createNode();this.expect("{");var t=this.parseDirectivePrologues(),r=this.context.labelSet,n=this.context.inIteration,i=this.context.inSwitch,o=this.context.inFunctionBody;for(this.context.labelSet={},this.context.inIteration=!1,this.context.inSwitch=!1,this.context.inFunctionBody=!0;2!==this.lookahead.type&&!this.match("}");)t.push(this.parseStatementListItem());return this.expect("}"),this.context.labelSet=r,this.context.inIteration=n,this.context.inSwitch=i,this.context.inFunctionBody=o,this.finalize(e,new a.BlockStatement(t))},e.prototype.validateParam=function(e,t,r){var n="$"+r;this.context.strict?(this.scanner.isRestrictedWord(r)&&(e.stricted=t,e.message=o.Messages.StrictParamName),Object.prototype.hasOwnProperty.call(e.paramSet,n)&&(e.stricted=t,e.message=o.Messages.StrictParamDupe)):e.firstRestricted||(this.scanner.isRestrictedWord(r)?(e.firstRestricted=t,e.message=o.Messages.StrictParamName):this.scanner.isStrictModeReservedWord(r)?(e.firstRestricted=t,e.message=o.Messages.StrictReservedWord):Object.prototype.hasOwnProperty.call(e.paramSet,n)&&(e.stricted=t,e.message=o.Messages.StrictParamDupe)),"function"==typeof Object.defineProperty?Object.defineProperty(e.paramSet,n,{value:!0,enumerable:!0,writable:!0,configurable:!0}):e.paramSet[n]=!0},e.prototype.parseRestElement=function(e){var t=this.createNode();this.expect("...");var r=this.parsePattern(e);return this.match("=")&&this.throwError(o.Messages.DefaultRestParameter),this.match(")")||this.throwError(o.Messages.ParameterAfterRestParameter),this.finalize(t,new a.RestElement(r))},e.prototype.parseFormalParameter=function(e){for(var t=[],r=this.match("...")?this.parseRestElement(t):this.parsePatternWithDefault(t),n=0;n<t.length;n++)this.validateParam(e,t[n],t[n].value);e.simple=e.simple&&r instanceof a.Identifier,e.params.push(r)},e.prototype.parseFormalParameters=function(e){var t;if(t={simple:!0,params:[],firstRestricted:e},this.expect("("),!this.match(")"))for(t.paramSet={};2!==this.lookahead.type&&(this.parseFormalParameter(t),!this.match(")"))&&(this.expect(","),!this.match(")")););return this.expect(")"),{simple:t.simple,params:t.params,stricted:t.stricted,firstRestricted:t.firstRestricted,message:t.message}},e.prototype.matchAsyncFunction=function(){var e=this.matchContextualKeyword("async");if(e){var t=this.scanner.saveState();this.scanner.scanComments();var r=this.scanner.lex();this.scanner.restoreState(t),e=t.lineNumber===r.lineNumber&&4===r.type&&"function"===r.value}return e},e.prototype.parseFunctionDeclaration=function(e){var t=this.createNode(),r=this.matchContextualKeyword("async");r&&this.nextToken(),this.expectKeyword("function");var n,i=!r&&this.match("*");i&&this.nextToken();var s=null,u=null;if(!e||!this.match("(")){var l=this.lookahead;s=this.parseVariableIdentifier(),this.context.strict?this.scanner.isRestrictedWord(l.value)&&this.tolerateUnexpectedToken(l,o.Messages.StrictFunctionName):this.scanner.isRestrictedWord(l.value)?(u=l,n=o.Messages.StrictFunctionName):this.scanner.isStrictModeReservedWord(l.value)&&(u=l,n=o.Messages.StrictReservedWord)}var c=this.context.await,h=this.context.allowYield;this.context.await=r,this.context.allowYield=!i;var p=this.parseFormalParameters(u),f=p.params,d=p.stricted;u=p.firstRestricted,p.message&&(n=p.message);var m=this.context.strict,y=this.context.allowStrictDirective;this.context.allowStrictDirective=p.simple;var v=this.parseFunctionSourceElements();return this.context.strict&&u&&this.throwUnexpectedToken(u,n),this.context.strict&&d&&this.tolerateUnexpectedToken(d,n),this.context.strict=m,this.context.allowStrictDirective=y,this.context.await=c,this.context.allowYield=h,r?this.finalize(t,new a.AsyncFunctionDeclaration(s,f,v)):this.finalize(t,new a.FunctionDeclaration(s,f,v,i))},e.prototype.parseFunctionExpression=function(){var e=this.createNode(),t=this.matchContextualKeyword("async");t&&this.nextToken(),this.expectKeyword("function");var r,n=!t&&this.match("*");n&&this.nextToken();var i,s=null,u=this.context.await,l=this.context.allowYield;if(this.context.await=t,this.context.allowYield=!n,!this.match("(")){var c=this.lookahead;s=this.context.strict||n||!this.matchKeyword("yield")?this.parseVariableIdentifier():this.parseIdentifierName(),this.context.strict?this.scanner.isRestrictedWord(c.value)&&this.tolerateUnexpectedToken(c,o.Messages.StrictFunctionName):this.scanner.isRestrictedWord(c.value)?(i=c,r=o.Messages.StrictFunctionName):this.scanner.isStrictModeReservedWord(c.value)&&(i=c,r=o.Messages.StrictReservedWord)}var h=this.parseFormalParameters(i),p=h.params,f=h.stricted;i=h.firstRestricted,h.message&&(r=h.message);var d=this.context.strict,m=this.context.allowStrictDirective;this.context.allowStrictDirective=h.simple;var y=this.parseFunctionSourceElements();return this.context.strict&&i&&this.throwUnexpectedToken(i,r),this.context.strict&&f&&this.tolerateUnexpectedToken(f,r),this.context.strict=d,this.context.allowStrictDirective=m,this.context.await=u,this.context.allowYield=l,t?this.finalize(e,new a.AsyncFunctionExpression(s,p,y)):this.finalize(e,new a.FunctionExpression(s,p,y,n))},e.prototype.parseDirective=function(){var e=this.lookahead,t=this.createNode(),r=this.parseExpression(),n=r.type===u.Syntax.Literal?this.getTokenRaw(e).slice(1,-1):null;return this.consumeSemicolon(),this.finalize(t,n?new a.Directive(r,n):new a.ExpressionStatement(r))},e.prototype.parseDirectivePrologues=function(){for(var e=null,t=[];;){var r=this.lookahead;if(8!==r.type)break;var n=this.parseDirective();t.push(n);var i=n.directive;if("string"!=typeof i)break;"use strict"===i?(this.context.strict=!0,e&&this.tolerateUnexpectedToken(e,o.Messages.StrictOctalLiteral),this.context.allowStrictDirective||this.tolerateUnexpectedToken(r,o.Messages.IllegalLanguageModeDirective)):!e&&r.octal&&(e=r)}return t},e.prototype.qualifiedPropertyName=function(e){switch(e.type){case 3:case 8:case 1:case 5:case 6:case 4:return!0;case 7:return"["===e.value}return!1},e.prototype.parseGetterMethod=function(){var e=this.createNode(),t=this.context.allowYield;this.context.allowYield=!0;var r=this.parseFormalParameters();r.params.length>0&&this.tolerateError(o.Messages.BadGetterArity);var n=this.parsePropertyMethod(r);return this.context.allowYield=t,this.finalize(e,new a.FunctionExpression(null,r.params,n,!1))},e.prototype.parseSetterMethod=function(){var e=this.createNode(),t=this.context.allowYield;this.context.allowYield=!0;var r=this.parseFormalParameters();1!==r.params.length?this.tolerateError(o.Messages.BadSetterArity):r.params[0]instanceof a.RestElement&&this.tolerateError(o.Messages.BadSetterRestParameter);var n=this.parsePropertyMethod(r);return this.context.allowYield=t,this.finalize(e,new a.FunctionExpression(null,r.params,n,!1))},e.prototype.parseGeneratorMethod=function(){var e=this.createNode(),t=this.context.allowYield;this.context.allowYield=!0;var r=this.parseFormalParameters();this.context.allowYield=!1;var n=this.parsePropertyMethod(r);return this.context.allowYield=t,this.finalize(e,new a.FunctionExpression(null,r.params,n,!0))},e.prototype.isStartOfExpression=function(){var e=!0,t=this.lookahead.value;switch(this.lookahead.type){case 7:e="["===t||"("===t||"{"===t||"+"===t||"-"===t||"!"===t||"~"===t||"++"===t||"--"===t||"/"===t||"/="===t;break;case 4:e="class"===t||"delete"===t||"function"===t||"let"===t||"new"===t||"super"===t||"this"===t||"typeof"===t||"void"===t||"yield"===t}return e},e.prototype.parseYieldExpression=function(){var e=this.createNode();this.expectKeyword("yield");var t=null,r=!1;if(!this.hasLineTerminator){var n=this.context.allowYield;this.context.allowYield=!1,(r=this.match("*"))?(this.nextToken(),t=this.parseAssignmentExpression()):this.isStartOfExpression()&&(t=this.parseAssignmentExpression()),this.context.allowYield=n}return this.finalize(e,new a.YieldExpression(t,r))},e.prototype.parseClassElement=function(e){var t=this.lookahead,r=this.createNode(),n="",i=null,s=null,u=!1,l=!1,c=!1,h=!1;if(this.match("*"))this.nextToken();else if(u=this.match("["),"static"===(i=this.parseObjectPropertyKey()).name&&(this.qualifiedPropertyName(this.lookahead)||this.match("*"))&&(t=this.lookahead,c=!0,u=this.match("["),this.match("*")?this.nextToken():i=this.parseObjectPropertyKey()),3===t.type&&!this.hasLineTerminator&&"async"===t.value){var p=this.lookahead.value;":"!==p&&"("!==p&&"*"!==p&&(h=!0,t=this.lookahead,i=this.parseObjectPropertyKey(),3===t.type&&"constructor"===t.value&&this.tolerateUnexpectedToken(t,o.Messages.ConstructorIsAsync))}var f=this.qualifiedPropertyName(this.lookahead);return 3===t.type?"get"===t.value&&f?(n="get",u=this.match("["),i=this.parseObjectPropertyKey(),this.context.allowYield=!1,s=this.parseGetterMethod()):"set"===t.value&&f&&(n="set",u=this.match("["),i=this.parseObjectPropertyKey(),s=this.parseSetterMethod()):7===t.type&&"*"===t.value&&f&&(n="init",u=this.match("["),i=this.parseObjectPropertyKey(),s=this.parseGeneratorMethod(),l=!0),!n&&i&&this.match("(")&&(n="init",s=h?this.parsePropertyMethodAsyncFunction():this.parsePropertyMethodFunction(),l=!0),n||this.throwUnexpectedToken(this.lookahead),"init"===n&&(n="method"),u||(c&&this.isPropertyKey(i,"prototype")&&this.throwUnexpectedToken(t,o.Messages.StaticPrototype),!c&&this.isPropertyKey(i,"constructor")&&(("method"!==n||!l||s&&s.generator)&&this.throwUnexpectedToken(t,o.Messages.ConstructorSpecialMethod),e.value?this.throwUnexpectedToken(t,o.Messages.DuplicateConstructor):e.value=!0,n="constructor")),this.finalize(r,new a.MethodDefinition(i,u,s,n,c))},e.prototype.parseClassElementList=function(){var e=[],t={value:!1};for(this.expect("{");!this.match("}");)this.match(";")?this.nextToken():e.push(this.parseClassElement(t));return this.expect("}"),e},e.prototype.parseClassBody=function(){var e=this.createNode(),t=this.parseClassElementList();return this.finalize(e,new a.ClassBody(t))},e.prototype.parseClassDeclaration=function(e){var t=this.createNode(),r=this.context.strict;this.context.strict=!0,this.expectKeyword("class");var n=e&&3!==this.lookahead.type?null:this.parseVariableIdentifier(),i=null;this.matchKeyword("extends")&&(this.nextToken(),i=this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall));var o=this.parseClassBody();return this.context.strict=r,this.finalize(t,new a.ClassDeclaration(n,i,o))},e.prototype.parseClassExpression=function(){var e=this.createNode(),t=this.context.strict;this.context.strict=!0,this.expectKeyword("class");var r=3===this.lookahead.type?this.parseVariableIdentifier():null,n=null;this.matchKeyword("extends")&&(this.nextToken(),n=this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall));var i=this.parseClassBody();return this.context.strict=t,this.finalize(e,new a.ClassExpression(r,n,i))},e.prototype.parseModule=function(){this.context.strict=!0,this.context.isModule=!0,this.scanner.isModule=!0;for(var e=this.createNode(),t=this.parseDirectivePrologues();2!==this.lookahead.type;)t.push(this.parseStatementListItem());return this.finalize(e,new a.Module(t))},e.prototype.parseScript=function(){for(var e=this.createNode(),t=this.parseDirectivePrologues();2!==this.lookahead.type;)t.push(this.parseStatementListItem());return this.finalize(e,new a.Script(t))},e.prototype.parseModuleSpecifier=function(){var e=this.createNode();8!==this.lookahead.type&&this.throwError(o.Messages.InvalidModuleSpecifier);var t=this.nextToken(),r=this.getTokenRaw(t);return this.finalize(e,new a.Literal(t.value,r))},e.prototype.parseImportSpecifier=function(){var e,t,r=this.createNode();return 3===this.lookahead.type?(t=e=this.parseVariableIdentifier(),this.matchContextualKeyword("as")&&(this.nextToken(),t=this.parseVariableIdentifier())):(t=e=this.parseIdentifierName(),this.matchContextualKeyword("as")?(this.nextToken(),t=this.parseVariableIdentifier()):this.throwUnexpectedToken(this.nextToken())),this.finalize(r,new a.ImportSpecifier(t,e))},e.prototype.parseNamedImports=function(){this.expect("{");for(var e=[];!this.match("}");)e.push(this.parseImportSpecifier()),this.match("}")||this.expect(",");return this.expect("}"),e},e.prototype.parseImportDefaultSpecifier=function(){var e=this.createNode(),t=this.parseIdentifierName();return this.finalize(e,new a.ImportDefaultSpecifier(t))},e.prototype.parseImportNamespaceSpecifier=function(){var e=this.createNode();this.expect("*"),this.matchContextualKeyword("as")||this.throwError(o.Messages.NoAsAfterImportNamespace),this.nextToken();var t=this.parseIdentifierName();return this.finalize(e,new a.ImportNamespaceSpecifier(t))},e.prototype.parseImportDeclaration=function(){this.context.inFunctionBody&&this.throwError(o.Messages.IllegalImportDeclaration);var e,t=this.createNode();this.expectKeyword("import");var r=[];if(8===this.lookahead.type)e=this.parseModuleSpecifier();else{if(this.match("{")?r=r.concat(this.parseNamedImports()):this.match("*")?r.push(this.parseImportNamespaceSpecifier()):this.isIdentifierName(this.lookahead)&&!this.matchKeyword("default")?(r.push(this.parseImportDefaultSpecifier()),this.match(",")&&(this.nextToken(),this.match("*")?r.push(this.parseImportNamespaceSpecifier()):this.match("{")?r=r.concat(this.parseNamedImports()):this.throwUnexpectedToken(this.lookahead))):this.throwUnexpectedToken(this.nextToken()),!this.matchContextualKeyword("from")){var n=this.lookahead.value?o.Messages.UnexpectedToken:o.Messages.MissingFromClause;this.throwError(n,this.lookahead.value)}this.nextToken(),e=this.parseModuleSpecifier()}return this.consumeSemicolon(),this.finalize(t,new a.ImportDeclaration(r,e))},e.prototype.parseExportSpecifier=function(){var e=this.createNode(),t=this.parseIdentifierName(),r=t;return this.matchContextualKeyword("as")&&(this.nextToken(),r=this.parseIdentifierName()),this.finalize(e,new a.ExportSpecifier(t,r))},e.prototype.parseExportDeclaration=function(){this.context.inFunctionBody&&this.throwError(o.Messages.IllegalExportDeclaration);var e,t=this.createNode();if(this.expectKeyword("export"),this.matchKeyword("default"))if(this.nextToken(),this.matchKeyword("function")){var r=this.parseFunctionDeclaration(!0);e=this.finalize(t,new a.ExportDefaultDeclaration(r))}else this.matchKeyword("class")?(r=this.parseClassDeclaration(!0),e=this.finalize(t,new a.ExportDefaultDeclaration(r))):this.matchContextualKeyword("async")?(r=this.matchAsyncFunction()?this.parseFunctionDeclaration(!0):this.parseAssignmentExpression(),e=this.finalize(t,new a.ExportDefaultDeclaration(r))):(this.matchContextualKeyword("from")&&this.throwError(o.Messages.UnexpectedToken,this.lookahead.value),r=this.match("{")?this.parseObjectInitializer():this.match("[")?this.parseArrayInitializer():this.parseAssignmentExpression(),this.consumeSemicolon(),e=this.finalize(t,new a.ExportDefaultDeclaration(r)));else if(this.match("*")){if(this.nextToken(),!this.matchContextualKeyword("from")){var n=this.lookahead.value?o.Messages.UnexpectedToken:o.Messages.MissingFromClause;this.throwError(n,this.lookahead.value)}this.nextToken();var i=this.parseModuleSpecifier();this.consumeSemicolon(),e=this.finalize(t,new a.ExportAllDeclaration(i))}else if(4===this.lookahead.type){switch(r=void 0,this.lookahead.value){case"let":case"const":r=this.parseLexicalDeclaration({inFor:!1});break;case"var":case"class":case"function":r=this.parseStatementListItem();break;default:this.throwUnexpectedToken(this.lookahead)}e=this.finalize(t,new a.ExportNamedDeclaration(r,[],null))}else if(this.matchAsyncFunction())r=this.parseFunctionDeclaration(),e=this.finalize(t,new a.ExportNamedDeclaration(r,[],null));else{var s=[],u=null,l=!1;for(this.expect("{");!this.match("}");)l=l||this.matchKeyword("default"),s.push(this.parseExportSpecifier()),this.match("}")||this.expect(",");this.expect("}"),this.matchContextualKeyword("from")?(this.nextToken(),u=this.parseModuleSpecifier(),this.consumeSemicolon()):l?(n=this.lookahead.value?o.Messages.UnexpectedToken:o.Messages.MissingFromClause,this.throwError(n,this.lookahead.value)):this.consumeSemicolon(),e=this.finalize(t,new a.ExportNamedDeclaration(null,s,u))}return e},e}();t.Parser=c},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.assert=function(e,t){if(!e)throw new Error("ASSERT: "+t)}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(){this.errors=[],this.tolerant=!1}return e.prototype.recordError=function(e){this.errors.push(e)},e.prototype.tolerate=function(e){if(!this.tolerant)throw e;this.recordError(e)},e.prototype.constructError=function(e,t){var r=new Error(e);try{throw r}catch(e){Object.create&&Object.defineProperty&&(r=Object.create(e),Object.defineProperty(r,"column",{value:t}))}return r},e.prototype.createError=function(e,t,r,n){var i="Line "+t+": "+n,o=this.constructError(i,r);return o.index=e,o.lineNumber=t,o.description=n,o},e.prototype.throwError=function(e,t,r,n){throw this.createError(e,t,r,n)},e.prototype.tolerateError=function(e,t,r,n){var i=this.createError(e,t,r,n);if(!this.tolerant)throw i;this.recordError(i)},e}();t.ErrorHandler=r},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Messages={BadGetterArity:"Getter must not have any formal parameters",BadSetterArity:"Setter must have exactly one formal parameter",BadSetterRestParameter:"Setter function argument must not be a rest parameter",ConstructorIsAsync:"Class constructor may not be an async method",ConstructorSpecialMethod:"Class constructor may not be an accessor",DeclarationMissingInitializer:"Missing initializer in %0 declaration",DefaultRestParameter:"Unexpected token =",DuplicateBinding:"Duplicate binding %0",DuplicateConstructor:"A class may only have one constructor",DuplicateProtoProperty:"Duplicate __proto__ fields are not allowed in object literals",ForInOfLoopInitializer:"%0 loop variable declaration may not have an initializer",GeneratorInLegacyContext:"Generator declarations are not allowed in legacy contexts",IllegalBreak:"Illegal break statement",IllegalContinue:"Illegal continue statement",IllegalExportDeclaration:"Unexpected token",IllegalImportDeclaration:"Unexpected token",IllegalLanguageModeDirective:"Illegal 'use strict' directive in function with non-simple parameter list",IllegalReturn:"Illegal return statement",InvalidEscapedReservedWord:"Keyword must not contain escaped characters",InvalidHexEscapeSequence:"Invalid hexadecimal escape sequence",InvalidLHSInAssignment:"Invalid left-hand side in assignment",InvalidLHSInForIn:"Invalid left-hand side in for-in",InvalidLHSInForLoop:"Invalid left-hand side in for-loop",InvalidModuleSpecifier:"Unexpected token",InvalidRegExp:"Invalid regular expression",LetInLexicalBinding:"let is disallowed as a lexically bound name",MissingFromClause:"Unexpected token",MultipleDefaultsInSwitch:"More than one default clause in switch statement",NewlineAfterThrow:"Illegal newline after throw",NoAsAfterImportNamespace:"Unexpected token",NoCatchOrFinally:"Missing catch or finally after try",ParameterAfterRestParameter:"Rest parameter must be last formal parameter",Redeclaration:"%0 '%1' has already been declared",StaticPrototype:"Classes may not have static property named prototype",StrictCatchVariable:"Catch variable may not be eval or arguments in strict mode",StrictDelete:"Delete of an unqualified identifier in strict mode.",StrictFunction:"In strict mode code, functions can only be declared at top level or inside a block",StrictFunctionName:"Function name may not be eval or arguments in strict mode",StrictLHSAssignment:"Assignment to eval or arguments is not allowed in strict mode",StrictLHSPostfix:"Postfix increment/decrement may not have eval or arguments operand in strict mode",StrictLHSPrefix:"Prefix increment/decrement may not have eval or arguments operand in strict mode",StrictModeWith:"Strict mode code may not include a with statement",StrictOctalLiteral:"Octal literals are not allowed in strict mode.",StrictParamDupe:"Strict mode function may not have duplicate parameter names",StrictParamName:"Parameter name eval or arguments is not allowed in strict mode",StrictReservedWord:"Use of future reserved word in strict mode",StrictVarName:"Variable name may not be eval or arguments in strict mode",TemplateOctalLiteral:"Octal literals are not allowed in template strings.",UnexpectedEOS:"Unexpected end of input",UnexpectedIdentifier:"Unexpected identifier",UnexpectedNumber:"Unexpected number",UnexpectedReserved:"Unexpected reserved word",UnexpectedString:"Unexpected string",UnexpectedTemplate:"Unexpected quasi %0",UnexpectedToken:"Unexpected token %0",UnexpectedTokenIllegal:"Unexpected token ILLEGAL",UnknownLabel:"Undefined label '%0'",UnterminatedRegExp:"Invalid regular expression: missing /"}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(9),i=r(4),o=r(11);function a(e){return"0123456789abcdef".indexOf(e.toLowerCase())}function s(e){return"01234567".indexOf(e)}var u=function(){function e(e,t){this.source=e,this.errorHandler=t,this.trackComment=!1,this.isModule=!1,this.length=e.length,this.index=0,this.lineNumber=e.length>0?1:0,this.lineStart=0,this.curlyStack=[]}return e.prototype.saveState=function(){return{index:this.index,lineNumber:this.lineNumber,lineStart:this.lineStart}},e.prototype.restoreState=function(e){this.index=e.index,this.lineNumber=e.lineNumber,this.lineStart=e.lineStart},e.prototype.eof=function(){return this.index>=this.length},e.prototype.throwUnexpectedToken=function(e){return void 0===e&&(e=o.Messages.UnexpectedTokenIllegal),this.errorHandler.throwError(this.index,this.lineNumber,this.index-this.lineStart+1,e)},e.prototype.tolerateUnexpectedToken=function(e){void 0===e&&(e=o.Messages.UnexpectedTokenIllegal),this.errorHandler.tolerateError(this.index,this.lineNumber,this.index-this.lineStart+1,e)},e.prototype.skipSingleLineComment=function(e){var t,r,n=[];for(this.trackComment&&(n=[],t=this.index-e,r={start:{line:this.lineNumber,column:this.index-this.lineStart-e},end:{}});!this.eof();){var o=this.source.charCodeAt(this.index);if(++this.index,i.Character.isLineTerminator(o)){if(this.trackComment){r.end={line:this.lineNumber,column:this.index-this.lineStart-1};var a={multiLine:!1,slice:[t+e,this.index-1],range:[t,this.index-1],loc:r};n.push(a)}return 13===o&&10===this.source.charCodeAt(this.index)&&++this.index,++this.lineNumber,this.lineStart=this.index,n}}return this.trackComment&&(r.end={line:this.lineNumber,column:this.index-this.lineStart},a={multiLine:!1,slice:[t+e,this.index],range:[t,this.index],loc:r},n.push(a)),n},e.prototype.skipMultiLineComment=function(){var e,t,r=[];for(this.trackComment&&(r=[],e=this.index-2,t={start:{line:this.lineNumber,column:this.index-this.lineStart-2},end:{}});!this.eof();){var n=this.source.charCodeAt(this.index);if(i.Character.isLineTerminator(n))13===n&&10===this.source.charCodeAt(this.index+1)&&++this.index,++this.lineNumber,++this.index,this.lineStart=this.index;else if(42===n){if(47===this.source.charCodeAt(this.index+1)){if(this.index+=2,this.trackComment){t.end={line:this.lineNumber,column:this.index-this.lineStart};var o={multiLine:!0,slice:[e+2,this.index-2],range:[e,this.index],loc:t};r.push(o)}return r}++this.index}else++this.index}return this.trackComment&&(t.end={line:this.lineNumber,column:this.index-this.lineStart},o={multiLine:!0,slice:[e+2,this.index],range:[e,this.index],loc:t},r.push(o)),this.tolerateUnexpectedToken(),r},e.prototype.scanComments=function(){var e;this.trackComment&&(e=[]);for(var t=0===this.index;!this.eof();){var r=this.source.charCodeAt(this.index);if(i.Character.isWhiteSpace(r))++this.index;else if(i.Character.isLineTerminator(r))++this.index,13===r&&10===this.source.charCodeAt(this.index)&&++this.index,++this.lineNumber,this.lineStart=this.index,t=!0;else if(47===r)if(47===(r=this.source.charCodeAt(this.index+1))){this.index+=2;var n=this.skipSingleLineComment(2);this.trackComment&&(e=e.concat(n)),t=!0}else{if(42!==r)break;this.index+=2,n=this.skipMultiLineComment(),this.trackComment&&(e=e.concat(n))}else if(t&&45===r){if(45!==this.source.charCodeAt(this.index+1)||62!==this.source.charCodeAt(this.index+2))break;this.index+=3,n=this.skipSingleLineComment(3),this.trackComment&&(e=e.concat(n))}else{if(60!==r||this.isModule)break;if("!--"!==this.source.slice(this.index+1,this.index+4))break;this.index+=4,n=this.skipSingleLineComment(4),this.trackComment&&(e=e.concat(n))}}return e},e.prototype.isFutureReservedWord=function(e){switch(e){case"enum":case"export":case"import":case"super":return!0;default:return!1}},e.prototype.isStrictModeReservedWord=function(e){switch(e){case"implements":case"interface":case"package":case"private":case"protected":case"public":case"static":case"yield":case"let":return!0;default:return!1}},e.prototype.isRestrictedWord=function(e){return"eval"===e||"arguments"===e},e.prototype.isKeyword=function(e){switch(e.length){case 2:return"if"===e||"in"===e||"do"===e;case 3:return"var"===e||"for"===e||"new"===e||"try"===e||"let"===e;case 4:return"this"===e||"else"===e||"case"===e||"void"===e||"with"===e||"enum"===e;case 5:return"while"===e||"break"===e||"catch"===e||"throw"===e||"const"===e||"yield"===e||"class"===e||"super"===e;case 6:return"return"===e||"typeof"===e||"delete"===e||"switch"===e||"export"===e||"import"===e;case 7:return"default"===e||"finally"===e||"extends"===e;case 8:return"function"===e||"continue"===e||"debugger"===e;case 10:return"instanceof"===e;default:return!1}},e.prototype.codePointAt=function(e){var t=this.source.charCodeAt(e);if(t>=55296&&t<=56319){var r=this.source.charCodeAt(e+1);r>=56320&&r<=57343&&(t=1024*(t-55296)+r-56320+65536)}return t},e.prototype.scanHexEscape=function(e){for(var t="u"===e?4:2,r=0,n=0;n<t;++n){if(this.eof()||!i.Character.isHexDigit(this.source.charCodeAt(this.index)))return null;r=16*r+a(this.source[this.index++])}return String.fromCharCode(r)},e.prototype.scanUnicodeCodePointEscape=function(){var e=this.source[this.index],t=0;for("}"===e&&this.throwUnexpectedToken();!this.eof()&&(e=this.source[this.index++],i.Character.isHexDigit(e.charCodeAt(0)));)t=16*t+a(e);return(t>1114111||"}"!==e)&&this.throwUnexpectedToken(),i.Character.fromCodePoint(t)},e.prototype.getIdentifier=function(){for(var e=this.index++;!this.eof();){var t=this.source.charCodeAt(this.index);if(92===t)return this.index=e,this.getComplexIdentifier();if(t>=55296&&t<57343)return this.index=e,this.getComplexIdentifier();if(!i.Character.isIdentifierPart(t))break;++this.index}return this.source.slice(e,this.index)},e.prototype.getComplexIdentifier=function(){var e,t=this.codePointAt(this.index),r=i.Character.fromCodePoint(t);for(this.index+=r.length,92===t&&(117!==this.source.charCodeAt(this.index)&&this.throwUnexpectedToken(),++this.index,"{"===this.source[this.index]?(++this.index,e=this.scanUnicodeCodePointEscape()):null!==(e=this.scanHexEscape("u"))&&"\\"!==e&&i.Character.isIdentifierStart(e.charCodeAt(0))||this.throwUnexpectedToken(),r=e);!this.eof()&&(t=this.codePointAt(this.index),i.Character.isIdentifierPart(t));)r+=e=i.Character.fromCodePoint(t),this.index+=e.length,92===t&&(r=r.substr(0,r.length-1),117!==this.source.charCodeAt(this.index)&&this.throwUnexpectedToken(),++this.index,"{"===this.source[this.index]?(++this.index,e=this.scanUnicodeCodePointEscape()):null!==(e=this.scanHexEscape("u"))&&"\\"!==e&&i.Character.isIdentifierPart(e.charCodeAt(0))||this.throwUnexpectedToken(),r+=e);return r},e.prototype.octalToDecimal=function(e){var t="0"!==e,r=s(e);return!this.eof()&&i.Character.isOctalDigit(this.source.charCodeAt(this.index))&&(t=!0,r=8*r+s(this.source[this.index++]),"0123".indexOf(e)>=0&&!this.eof()&&i.Character.isOctalDigit(this.source.charCodeAt(this.index))&&(r=8*r+s(this.source[this.index++]))),{code:r,octal:t}},e.prototype.scanIdentifier=function(){var e,t=this.index,r=92===this.source.charCodeAt(t)?this.getComplexIdentifier():this.getIdentifier();if(3!=(e=1===r.length?3:this.isKeyword(r)?4:"null"===r?5:"true"===r||"false"===r?1:3)&&t+r.length!==this.index){var n=this.index;this.index=t,this.tolerateUnexpectedToken(o.Messages.InvalidEscapedReservedWord),this.index=n}return{type:e,value:r,lineNumber:this.lineNumber,lineStart:this.lineStart,start:t,end:this.index}},e.prototype.scanPunctuator=function(){var e=this.index,t=this.source[this.index];switch(t){case"(":case"{":"{"===t&&this.curlyStack.push("{"),++this.index;break;case".":++this.index,"."===this.source[this.index]&&"."===this.source[this.index+1]&&(this.index+=2,t="...");break;case"}":++this.index,this.curlyStack.pop();break;case")":case";":case",":case"[":case"]":case":":case"?":case"~":++this.index;break;default:">>>="===(t=this.source.substr(this.index,4))?this.index+=4:"==="===(t=t.substr(0,3))||"!=="===t||">>>"===t||"<<="===t||">>="===t||"**="===t?this.index+=3:"&&"===(t=t.substr(0,2))||"||"===t||"=="===t||"!="===t||"+="===t||"-="===t||"*="===t||"/="===t||"++"===t||"--"===t||"<<"===t||">>"===t||"&="===t||"|="===t||"^="===t||"%="===t||"<="===t||">="===t||"=>"===t||"**"===t?this.index+=2:(t=this.source[this.index],"<>=!+-*%&|^/".indexOf(t)>=0&&++this.index)}return this.index===e&&this.throwUnexpectedToken(),{type:7,value:t,lineNumber:this.lineNumber,lineStart:this.lineStart,start:e,end:this.index}},e.prototype.scanHexLiteral=function(e){for(var t="";!this.eof()&&i.Character.isHexDigit(this.source.charCodeAt(this.index));)t+=this.source[this.index++];return 0===t.length&&this.throwUnexpectedToken(),i.Character.isIdentifierStart(this.source.charCodeAt(this.index))&&this.throwUnexpectedToken(),{type:6,value:parseInt("0x"+t,16),lineNumber:this.lineNumber,lineStart:this.lineStart,start:e,end:this.index}},e.prototype.scanBinaryLiteral=function(e){for(var t,r="";!this.eof()&&("0"===(t=this.source[this.index])||"1"===t);)r+=this.source[this.index++];return 0===r.length&&this.throwUnexpectedToken(),this.eof()||(t=this.source.charCodeAt(this.index),(i.Character.isIdentifierStart(t)||i.Character.isDecimalDigit(t))&&this.throwUnexpectedToken()),{type:6,value:parseInt(r,2),lineNumber:this.lineNumber,lineStart:this.lineStart,start:e,end:this.index}},e.prototype.scanOctalLiteral=function(e,t){var r="",n=!1;for(i.Character.isOctalDigit(e.charCodeAt(0))?(n=!0,r="0"+this.source[this.index++]):++this.index;!this.eof()&&i.Character.isOctalDigit(this.source.charCodeAt(this.index));)r+=this.source[this.index++];return n||0!==r.length||this.throwUnexpectedToken(),(i.Character.isIdentifierStart(this.source.charCodeAt(this.index))||i.Character.isDecimalDigit(this.source.charCodeAt(this.index)))&&this.throwUnexpectedToken(),{type:6,value:parseInt(r,8),octal:n,lineNumber:this.lineNumber,lineStart:this.lineStart,start:t,end:this.index}},e.prototype.isImplicitOctalLiteral=function(){for(var e=this.index+1;e<this.length;++e){var t=this.source[e];if("8"===t||"9"===t)return!1;if(!i.Character.isOctalDigit(t.charCodeAt(0)))return!0}return!0},e.prototype.scanNumericLiteral=function(){var e=this.index,t=this.source[e];n.assert(i.Character.isDecimalDigit(t.charCodeAt(0))||"."===t,"Numeric literal must start with a decimal digit or a decimal point");var r="";if("."!==t){if(r=this.source[this.index++],t=this.source[this.index],"0"===r){if("x"===t||"X"===t)return++this.index,this.scanHexLiteral(e);if("b"===t||"B"===t)return++this.index,this.scanBinaryLiteral(e);if("o"===t||"O"===t)return this.scanOctalLiteral(t,e);if(t&&i.Character.isOctalDigit(t.charCodeAt(0))&&this.isImplicitOctalLiteral())return this.scanOctalLiteral(t,e)}for(;i.Character.isDecimalDigit(this.source.charCodeAt(this.index));)r+=this.source[this.index++];t=this.source[this.index]}if("."===t){for(r+=this.source[this.index++];i.Character.isDecimalDigit(this.source.charCodeAt(this.index));)r+=this.source[this.index++];t=this.source[this.index]}if("e"===t||"E"===t)if(r+=this.source[this.index++],"+"!==(t=this.source[this.index])&&"-"!==t||(r+=this.source[this.index++]),i.Character.isDecimalDigit(this.source.charCodeAt(this.index)))for(;i.Character.isDecimalDigit(this.source.charCodeAt(this.index));)r+=this.source[this.index++];else this.throwUnexpectedToken();return i.Character.isIdentifierStart(this.source.charCodeAt(this.index))&&this.throwUnexpectedToken(),{type:6,value:parseFloat(r),lineNumber:this.lineNumber,lineStart:this.lineStart,start:e,end:this.index}},e.prototype.scanStringLiteral=function(){var e=this.index,t=this.source[e];n.assert("'"===t||'"'===t,"String literal must starts with a quote"),++this.index;for(var r=!1,a="";!this.eof();){var s=this.source[this.index++];if(s===t){t="";break}if("\\"===s)if((s=this.source[this.index++])&&i.Character.isLineTerminator(s.charCodeAt(0)))++this.lineNumber,"\r"===s&&"\n"===this.source[this.index]&&++this.index,this.lineStart=this.index;else switch(s){case"u":if("{"===this.source[this.index])++this.index,a+=this.scanUnicodeCodePointEscape();else{var u=this.scanHexEscape(s);null===u&&this.throwUnexpectedToken(),a+=u}break;case"x":var l=this.scanHexEscape(s);null===l&&this.throwUnexpectedToken(o.Messages.InvalidHexEscapeSequence),a+=l;break;case"n":a+="\n";break;case"r":a+="\r";break;case"t":a+="\t";break;case"b":a+="\b";break;case"f":a+="\f";break;case"v":a+="\v";break;case"8":case"9":a+=s,this.tolerateUnexpectedToken();break;default:if(s&&i.Character.isOctalDigit(s.charCodeAt(0))){var c=this.octalToDecimal(s);r=c.octal||r,a+=String.fromCharCode(c.code)}else a+=s}else{if(i.Character.isLineTerminator(s.charCodeAt(0)))break;a+=s}}return""!==t&&(this.index=e,this.throwUnexpectedToken()),{type:8,value:a,octal:r,lineNumber:this.lineNumber,lineStart:this.lineStart,start:e,end:this.index}},e.prototype.scanTemplate=function(){var e="",t=!1,r=this.index,n="`"===this.source[r],a=!1,s=2;for(++this.index;!this.eof();){var u=this.source[this.index++];if("`"===u){s=1,a=!0,t=!0;break}if("$"===u){if("{"===this.source[this.index]){this.curlyStack.push("${"),++this.index,t=!0;break}e+=u}else if("\\"===u)if(u=this.source[this.index++],i.Character.isLineTerminator(u.charCodeAt(0)))++this.lineNumber,"\r"===u&&"\n"===this.source[this.index]&&++this.index,this.lineStart=this.index;else switch(u){case"n":e+="\n";break;case"r":e+="\r";break;case"t":e+="\t";break;case"u":if("{"===this.source[this.index])++this.index,e+=this.scanUnicodeCodePointEscape();else{var l=this.index,c=this.scanHexEscape(u);null!==c?e+=c:(this.index=l,e+=u)}break;case"x":var h=this.scanHexEscape(u);null===h&&this.throwUnexpectedToken(o.Messages.InvalidHexEscapeSequence),e+=h;break;case"b":e+="\b";break;case"f":e+="\f";break;case"v":e+="\v";break;default:"0"===u?(i.Character.isDecimalDigit(this.source.charCodeAt(this.index))&&this.throwUnexpectedToken(o.Messages.TemplateOctalLiteral),e+="\0"):i.Character.isOctalDigit(u.charCodeAt(0))?this.throwUnexpectedToken(o.Messages.TemplateOctalLiteral):e+=u}else i.Character.isLineTerminator(u.charCodeAt(0))?(++this.lineNumber,"\r"===u&&"\n"===this.source[this.index]&&++this.index,this.lineStart=this.index,e+="\n"):e+=u}return t||this.throwUnexpectedToken(),n||this.curlyStack.pop(),{type:10,value:this.source.slice(r+1,this.index-s),cooked:e,head:n,tail:a,lineNumber:this.lineNumber,lineStart:this.lineStart,start:r,end:this.index}},e.prototype.testRegExp=function(e,t){var r=e,n=this;t.indexOf("u")>=0&&(r=r.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([a-fA-F0-9]{4})/g,(function(e,t,r){var i=parseInt(t||r,16);return i>1114111&&n.throwUnexpectedToken(o.Messages.InvalidRegExp),i<=65535?String.fromCharCode(i):"￿"})).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,"￿"));try{RegExp(r)}catch(e){this.throwUnexpectedToken(o.Messages.InvalidRegExp)}try{return new RegExp(e,t)}catch(e){return null}},e.prototype.scanRegExpBody=function(){var e=this.source[this.index];n.assert("/"===e,"Regular expression literal must start with a slash");for(var t=this.source[this.index++],r=!1,a=!1;!this.eof();)if(t+=e=this.source[this.index++],"\\"===e)e=this.source[this.index++],i.Character.isLineTerminator(e.charCodeAt(0))&&this.throwUnexpectedToken(o.Messages.UnterminatedRegExp),t+=e;else if(i.Character.isLineTerminator(e.charCodeAt(0)))this.throwUnexpectedToken(o.Messages.UnterminatedRegExp);else if(r)"]"===e&&(r=!1);else{if("/"===e){a=!0;break}"["===e&&(r=!0)}return a||this.throwUnexpectedToken(o.Messages.UnterminatedRegExp),t.substr(1,t.length-2)},e.prototype.scanRegExpFlags=function(){for(var e="";!this.eof();){var t=this.source[this.index];if(!i.Character.isIdentifierPart(t.charCodeAt(0)))break;if(++this.index,"\\"!==t||this.eof())e+=t;else if("u"===(t=this.source[this.index])){++this.index;var r=this.index,n=this.scanHexEscape("u");if(null!==n)for(e+=n;r<this.index;++r)this.source[r];else this.index=r,e+="u";this.tolerateUnexpectedToken()}else this.tolerateUnexpectedToken()}return e},e.prototype.scanRegExp=function(){var e=this.index,t=this.scanRegExpBody(),r=this.scanRegExpFlags();return{type:9,value:"",pattern:t,flags:r,regex:this.testRegExp(t,r),lineNumber:this.lineNumber,lineStart:this.lineStart,start:e,end:this.index}},e.prototype.lex=function(){if(this.eof())return{type:2,value:"",lineNumber:this.lineNumber,lineStart:this.lineStart,start:this.index,end:this.index};var e=this.source.charCodeAt(this.index);return i.Character.isIdentifierStart(e)?this.scanIdentifier():40===e||41===e||59===e?this.scanPunctuator():39===e||34===e?this.scanStringLiteral():46===e?i.Character.isDecimalDigit(this.source.charCodeAt(this.index+1))?this.scanNumericLiteral():this.scanPunctuator():i.Character.isDecimalDigit(e)?this.scanNumericLiteral():96===e||125===e&&"${"===this.curlyStack[this.curlyStack.length-1]?this.scanTemplate():e>=55296&&e<57343&&i.Character.isIdentifierStart(this.codePointAt(this.index))?this.scanIdentifier():this.scanPunctuator()},e}();t.Scanner=u},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.TokenName={},t.TokenName[1]="Boolean",t.TokenName[2]="<end>",t.TokenName[3]="Identifier",t.TokenName[4]="Keyword",t.TokenName[5]="Null",t.TokenName[6]="Numeric",t.TokenName[7]="Punctuator",t.TokenName[8]="String",t.TokenName[9]="RegularExpression",t.TokenName[10]="Template"},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.XHTMLEntities={quot:'"',amp:"&",apos:"'",gt:">",nbsp:" ",iexcl:"¡",cent:"¢",pound:"£",curren:"¤",yen:"¥",brvbar:"¦",sect:"§",uml:"¨",copy:"©",ordf:"ª",laquo:"«",not:"¬",shy:"­",reg:"®",macr:"¯",deg:"°",plusmn:"±",sup2:"²",sup3:"³",acute:"´",micro:"µ",para:"¶",middot:"·",cedil:"¸",sup1:"¹",ordm:"º",raquo:"»",frac14:"¼",frac12:"½",frac34:"¾",iquest:"¿",Agrave:"À",Aacute:"Á",Acirc:"Â",Atilde:"Ã",Auml:"Ä",Aring:"Å",AElig:"Æ",Ccedil:"Ç",Egrave:"È",Eacute:"É",Ecirc:"Ê",Euml:"Ë",Igrave:"Ì",Iacute:"Í",Icirc:"Î",Iuml:"Ï",ETH:"Ð",Ntilde:"Ñ",Ograve:"Ò",Oacute:"Ó",Ocirc:"Ô",Otilde:"Õ",Ouml:"Ö",times:"×",Oslash:"Ø",Ugrave:"Ù",Uacute:"Ú",Ucirc:"Û",Uuml:"Ü",Yacute:"Ý",THORN:"Þ",szlig:"ß",agrave:"à",aacute:"á",acirc:"â",atilde:"ã",auml:"ä",aring:"å",aelig:"æ",ccedil:"ç",egrave:"è",eacute:"é",ecirc:"ê",euml:"ë",igrave:"ì",iacute:"í",icirc:"î",iuml:"ï",eth:"ð",ntilde:"ñ",ograve:"ò",oacute:"ó",ocirc:"ô",otilde:"õ",ouml:"ö",divide:"÷",oslash:"ø",ugrave:"ù",uacute:"ú",ucirc:"û",uuml:"ü",yacute:"ý",thorn:"þ",yuml:"ÿ",OElig:"Œ",oelig:"œ",Scaron:"Š",scaron:"š",Yuml:"Ÿ",fnof:"ƒ",circ:"ˆ",tilde:"˜",Alpha:"Α",Beta:"Β",Gamma:"Γ",Delta:"Δ",Epsilon:"Ε",Zeta:"Ζ",Eta:"Η",Theta:"Θ",Iota:"Ι",Kappa:"Κ",Lambda:"Λ",Mu:"Μ",Nu:"Ν",Xi:"Ξ",Omicron:"Ο",Pi:"Π",Rho:"Ρ",Sigma:"Σ",Tau:"Τ",Upsilon:"Υ",Phi:"Φ",Chi:"Χ",Psi:"Ψ",Omega:"Ω",alpha:"α",beta:"β",gamma:"γ",delta:"δ",epsilon:"ε",zeta:"ζ",eta:"η",theta:"θ",iota:"ι",kappa:"κ",lambda:"λ",mu:"μ",nu:"ν",xi:"ξ",omicron:"ο",pi:"π",rho:"ρ",sigmaf:"ς",sigma:"σ",tau:"τ",upsilon:"υ",phi:"φ",chi:"χ",psi:"ψ",omega:"ω",thetasym:"ϑ",upsih:"ϒ",piv:"ϖ",ensp:" ",emsp:" ",thinsp:" ",zwnj:"‌",zwj:"‍",lrm:"‎",rlm:"‏",ndash:"–",mdash:"—",lsquo:"‘",rsquo:"’",sbquo:"‚",ldquo:"“",rdquo:"”",bdquo:"„",dagger:"†",Dagger:"‡",bull:"•",hellip:"…",permil:"‰",prime:"′",Prime:"″",lsaquo:"‹",rsaquo:"›",oline:"‾",frasl:"⁄",euro:"€",image:"ℑ",weierp:"℘",real:"ℜ",trade:"™",alefsym:"ℵ",larr:"←",uarr:"↑",rarr:"→",darr:"↓",harr:"↔",crarr:"↵",lArr:"⇐",uArr:"⇑",rArr:"⇒",dArr:"⇓",hArr:"⇔",forall:"∀",part:"∂",exist:"∃",empty:"∅",nabla:"∇",isin:"∈",notin:"∉",ni:"∋",prod:"∏",sum:"∑",minus:"−",lowast:"∗",radic:"√",prop:"∝",infin:"∞",ang:"∠",and:"∧",or:"∨",cap:"∩",cup:"∪",int:"∫",there4:"∴",sim:"∼",cong:"≅",asymp:"≈",ne:"≠",equiv:"≡",le:"≤",ge:"≥",sub:"⊂",sup:"⊃",nsub:"⊄",sube:"⊆",supe:"⊇",oplus:"⊕",otimes:"⊗",perp:"⊥",sdot:"⋅",lceil:"⌈",rceil:"⌉",lfloor:"⌊",rfloor:"⌋",loz:"◊",spades:"♠",clubs:"♣",hearts:"♥",diams:"♦",lang:"⟨",rang:"⟩"}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(10),i=r(12),o=r(13),a=function(){function e(){this.values=[],this.curly=this.paren=-1}return e.prototype.beforeFunctionExpression=function(e){return["(","{","[","in","typeof","instanceof","new","return","case","delete","throw","void","=","+=","-=","*=","**=","/=","%=","<<=",">>=",">>>=","&=","|=","^=",",","+","-","*","**","/","%","++","--","<<",">>",">>>","&","|","^","!","~","&&","||","?",":","===","==",">=","<=","<",">","!=","!=="].indexOf(e)>=0},e.prototype.isRegexStart=function(){var e=this.values[this.values.length-1],t=null!==e;switch(e){case"this":case"]":t=!1;break;case")":var r=this.values[this.paren-1];t="if"===r||"while"===r||"for"===r||"with"===r;break;case"}":if(t=!1,"function"===this.values[this.curly-3])t=!!(n=this.values[this.curly-4])&&!this.beforeFunctionExpression(n);else if("function"===this.values[this.curly-4]){var n;t=!(n=this.values[this.curly-5])||!this.beforeFunctionExpression(n)}}return t},e.prototype.push=function(e){7===e.type||4===e.type?("{"===e.value?this.curly=this.values.length:"("===e.value&&(this.paren=this.values.length),this.values.push(e.value)):this.values.push(null)},e}(),s=function(){function e(e,t){this.errorHandler=new n.ErrorHandler,this.errorHandler.tolerant=!!t&&"boolean"==typeof t.tolerant&&t.tolerant,this.scanner=new i.Scanner(e,this.errorHandler),this.scanner.trackComment=!!t&&"boolean"==typeof t.comment&&t.comment,this.trackRange=!!t&&"boolean"==typeof t.range&&t.range,this.trackLoc=!!t&&"boolean"==typeof t.loc&&t.loc,this.buffer=[],this.reader=new a}return e.prototype.errors=function(){return this.errorHandler.errors},e.prototype.getNextToken=function(){if(0===this.buffer.length){var e=this.scanner.scanComments();if(this.scanner.trackComment)for(var t=0;t<e.length;++t){var r=e[t],n=this.scanner.source.slice(r.slice[0],r.slice[1]),i={type:r.multiLine?"BlockComment":"LineComment",value:n};this.trackRange&&(i.range=r.range),this.trackLoc&&(i.loc=r.loc),this.buffer.push(i)}if(!this.scanner.eof()){var a=void 0;this.trackLoc&&(a={start:{line:this.scanner.lineNumber,column:this.scanner.index-this.scanner.lineStart},end:{}});var s="/"===this.scanner.source[this.scanner.index]&&this.reader.isRegexStart()?this.scanner.scanRegExp():this.scanner.lex();this.reader.push(s);var u={type:o.TokenName[s.type],value:this.scanner.source.slice(s.start,s.end)};if(this.trackRange&&(u.range=[s.start,s.end]),this.trackLoc&&(a.end={line:this.scanner.lineNumber,column:this.scanner.index-this.scanner.lineStart},u.loc=a),9===s.type){var l=s.pattern,c=s.flags;u.regex={pattern:l,flags:c}}this.buffer.push(u)}}return this.buffer.shift()},e}();t.Tokenizer=s}])},e.exports=n()},function(e,t,r){"use strict";var n=r(38),i=r(53),o=r(75),a=r(54),s=Object.prototype.toString,u=Object.prototype.hasOwnProperty,l={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},c=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"];function h(e){var t,r,o;if(t=e.toString(16).toUpperCase(),e<=255)r="x",o=2;else if(e<=65535)r="u",o=4;else{if(!(e<=4294967295))throw new i("code point within a string may not be greater than 0xFFFFFFFF");r="U",o=8}return"\\"+r+n.repeat("0",o-t.length)+t}function p(e){this.schema=e.schema||o,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=n.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var r,n,i,o,a,s,l;if(null===t)return{};for(r={},i=0,o=(n=Object.keys(t)).length;i<o;i+=1)a=n[i],s=String(t[a]),"!!"===a.slice(0,2)&&(a="tag:yaml.org,2002:"+a.slice(2)),(l=e.compiledTypeMap.fallback[a])&&u.call(l.styleAliases,s)&&(s=l.styleAliases[s]),r[a]=s;return r}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function f(e,t){for(var r,i=n.repeat(" ",t),o=0,a=-1,s="",u=e.length;o<u;)-1===(a=e.indexOf("\n",o))?(r=e.slice(o),o=u):(r=e.slice(o,a+1),o=a+1),r.length&&"\n"!==r&&(s+=i),s+=r;return s}function d(e,t){return"\n"+n.repeat(" ",e.indent*t)}function m(e){return 32===e||9===e}function y(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&65279!==e||65536<=e&&e<=1114111}function v(e,t){return y(e)&&65279!==e&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e&&58!==e&&(35!==e||t&&function(e){return y(e)&&!m(e)&&65279!==e&&13!==e&&10!==e}(t))}function _(e){return/^\n* /.test(e)}function g(e,t,r,n,i){var o,a,s,u,l=!1,c=!1,h=-1!==n,p=-1,f=y(u=e.charCodeAt(0))&&65279!==u&&!m(u)&&45!==u&&63!==u&&58!==u&&44!==u&&91!==u&&93!==u&&123!==u&&125!==u&&35!==u&&38!==u&&42!==u&&33!==u&&124!==u&&61!==u&&62!==u&&39!==u&&34!==u&&37!==u&&64!==u&&96!==u&&!m(e.charCodeAt(e.length-1));if(t)for(o=0;o<e.length;o++){if(!y(a=e.charCodeAt(o)))return 5;s=o>0?e.charCodeAt(o-1):null,f=f&&v(a,s)}else{for(o=0;o<e.length;o++){if(10===(a=e.charCodeAt(o)))l=!0,h&&(c=c||o-p-1>n&&" "!==e[p+1],p=o);else if(!y(a))return 5;s=o>0?e.charCodeAt(o-1):null,f=f&&v(a,s)}c=c||h&&o-p-1>n&&" "!==e[p+1]}return l||c?r>9&&_(e)?5:c?4:3:f&&!i(e)?1:2}function b(e,t,r,n){e.dump=function(){if(0===t.length)return"''";if(!e.noCompatMode&&-1!==c.indexOf(t))return"'"+t+"'";var o=e.indent*Math.max(1,r),a=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-o),s=n||e.flowLevel>-1&&r>=e.flowLevel;switch(g(t,s,e.indent,a,(function(t){return function(e,t){var r,n;for(r=0,n=e.implicitTypes.length;r<n;r+=1)if(e.implicitTypes[r].resolve(t))return!0;return!1}(e,t)}))){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+x(t,e.indent)+w(f(t,o));case 4:return">"+x(t,e.indent)+w(f(function(e,t){var r,n,i=/(\n+)([^\n]*)/g,o=(s=e.indexOf("\n"),s=-1!==s?s:e.length,i.lastIndex=s,E(e.slice(0,s),t)),a="\n"===e[0]||" "===e[0];var s;for(;n=i.exec(e);){var u=n[1],l=n[2];r=" "===l[0],o+=u+(a||r||""===l?"":"\n")+E(l,t),a=r}return o}(t,a),o));case 5:return'"'+function(e){for(var t,r,n,i="",o=0;o<e.length;o++)(t=e.charCodeAt(o))>=55296&&t<=56319&&(r=e.charCodeAt(o+1))>=56320&&r<=57343?(i+=h(1024*(t-55296)+r-56320+65536),o++):(n=l[t],i+=!n&&y(t)?e[o]:n||h(t));return i}(t)+'"';default:throw new i("impossible error: invalid scalar style")}}()}function x(e,t){var r=_(e)?String(t):"",n="\n"===e[e.length-1];return r+(n&&("\n"===e[e.length-2]||"\n"===e)?"+":n?"":"-")+"\n"}function w(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function E(e,t){if(""===e||" "===e[0])return e;for(var r,n,i=/ [^ ]/g,o=0,a=0,s=0,u="";r=i.exec(e);)(s=r.index)-o>t&&(n=a>o?a:s,u+="\n"+e.slice(o,n),o=n+1),a=s;return u+="\n",e.length-o>t&&a>o?u+=e.slice(o,a)+"\n"+e.slice(a+1):u+=e.slice(o),u.slice(1)}function D(e,t,r){var n,o,a,l,c,h;for(a=0,l=(o=r?e.explicitTypes:e.implicitTypes).length;a<l;a+=1)if(((c=o[a]).instanceOf||c.predicate)&&(!c.instanceOf||"object"==typeof t&&t instanceof c.instanceOf)&&(!c.predicate||c.predicate(t))){if(e.tag=r?c.tag:"?",c.represent){if(h=e.styleMap[c.tag]||c.defaultStyle,"[object Function]"===s.call(c.represent))n=c.represent(t,h);else{if(!u.call(c.represent,h))throw new i("!<"+c.tag+'> tag resolver accepts not "'+h+'" style');n=c.represent[h](t,h)}e.dump=n}return!0}return!1}function S(e,t,r,n,o,a){e.tag=null,e.dump=r,D(e,r,!1)||D(e,r,!0);var u=s.call(e.dump);n&&(n=e.flowLevel<0||e.flowLevel>t);var l,c,h="[object Object]"===u||"[object Array]"===u;if(h&&(c=-1!==(l=e.duplicates.indexOf(r))),(null!==e.tag&&"?"!==e.tag||c||2!==e.indent&&t>0)&&(o=!1),c&&e.usedDuplicates[l])e.dump="*ref_"+l;else{if(h&&c&&!e.usedDuplicates[l]&&(e.usedDuplicates[l]=!0),"[object Object]"===u)n&&0!==Object.keys(e.dump).length?(!function(e,t,r,n){var o,a,s,u,l,c,h="",p=e.tag,f=Object.keys(r);if(!0===e.sortKeys)f.sort();else if("function"==typeof e.sortKeys)f.sort(e.sortKeys);else if(e.sortKeys)throw new i("sortKeys must be a boolean or a function");for(o=0,a=f.length;o<a;o+=1)c="",n&&0===o||(c+=d(e,t)),u=r[s=f[o]],S(e,t+1,s,!0,!0,!0)&&((l=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024)&&(e.dump&&10===e.dump.charCodeAt(0)?c+="?":c+="? "),c+=e.dump,l&&(c+=d(e,t)),S(e,t+1,u,!0,l)&&(e.dump&&10===e.dump.charCodeAt(0)?c+=":":c+=": ",h+=c+=e.dump));e.tag=p,e.dump=h||"{}"}(e,t,e.dump,o),c&&(e.dump="&ref_"+l+e.dump)):(!function(e,t,r){var n,i,o,a,s,u="",l=e.tag,c=Object.keys(r);for(n=0,i=c.length;n<i;n+=1)s="",0!==n&&(s+=", "),e.condenseFlow&&(s+='"'),a=r[o=c[n]],S(e,t,o,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),S(e,t,a,!1,!1)&&(u+=s+=e.dump));e.tag=l,e.dump="{"+u+"}"}(e,t,e.dump),c&&(e.dump="&ref_"+l+" "+e.dump));else if("[object Array]"===u){var p=e.noArrayIndent&&t>0?t-1:t;n&&0!==e.dump.length?(!function(e,t,r,n){var i,o,a="",s=e.tag;for(i=0,o=r.length;i<o;i+=1)S(e,t+1,r[i],!0,!0)&&(n&&0===i||(a+=d(e,t)),e.dump&&10===e.dump.charCodeAt(0)?a+="-":a+="- ",a+=e.dump);e.tag=s,e.dump=a||"[]"}(e,p,e.dump,o),c&&(e.dump="&ref_"+l+e.dump)):(!function(e,t,r){var n,i,o="",a=e.tag;for(n=0,i=r.length;n<i;n+=1)S(e,t,r[n],!1,!1)&&(0!==n&&(o+=","+(e.condenseFlow?"":" ")),o+=e.dump);e.tag=a,e.dump="["+o+"]"}(e,p,e.dump),c&&(e.dump="&ref_"+l+" "+e.dump))}else{if("[object String]"!==u){if(e.skipInvalid)return!1;throw new i("unacceptable kind of an object to dump "+u)}"?"!==e.tag&&b(e,e.dump,t,a)}null!==e.tag&&"?"!==e.tag&&(e.dump="!<"+e.tag+"> "+e.dump)}return!0}function C(e,t){var r,n,i=[],o=[];for(function e(t,r,n){var i,o,a;if(null!==t&&"object"==typeof t)if(-1!==(o=r.indexOf(t)))-1===n.indexOf(o)&&n.push(o);else if(r.push(t),Array.isArray(t))for(o=0,a=t.length;o<a;o+=1)e(t[o],r,n);else for(i=Object.keys(t),o=0,a=i.length;o<a;o+=1)e(t[i[o]],r,n)}(e,i,o),r=0,n=o.length;r<n;r+=1)t.duplicates.push(i[o[r]]);t.usedDuplicates=new Array(n)}function A(e,t){var r=new p(t=t||{});return r.noRefs||C(e,r),S(r,0,e,!0,!0)?r.dump+"\n":""}e.exports.dump=A,e.exports.safeDump=function(e,t){return A(e,n.extend({schema:a},t))}},function(e,t,r){"use strict";r(31),r(32),r(33),r(64),r(19),r(65),r(20),r(92),r(91),r(143),r(22),r(144),r(23);var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},a=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a};Object.defineProperty(t,"__esModule",{value:!0});var s=r(90),u=r(1),l=r(182),c=r(0),h=r(7),p=r(94),f=r(68),d=r(3),m=r(305),y=r(306),v=r(307),_=function(e){function t(t,r){void 0===r&&(r=!1);var n=e.call(this)||this;return n._hasDeclaration=!1,n._docTypeName="",n._hasDocumentElement=!1,n._currentElementSerialized=!1,n._openTags=[],n._ended=!1,n._fragment=r,n._options=u.applyDefaults(t||{},s.DefaultXMLBuilderCBOptions),n._builderOptions={defaultNamespace:n._options.defaultNamespace,namespaceAlias:n._options.namespaceAlias},"json"===n._options.format?n._writer=new y.JSONCBWriter(n._options):"yaml"===n._options.format?n._writer=new v.YAMLCBWriter(n._options):n._writer=new m.XMLCBWriter(n._options),void 0!==n._options.data&&n.on("data",n._options.data),void 0!==n._options.end&&n.on("end",n._options.end),void 0!==n._options.error&&n.on("error",n._options.error),n._prefixMap=new p.NamespacePrefixMap,n._prefixMap.set("xml",h.namespace.XML),n._prefixIndex={value:1},n._push(n._writer.frontMatter()),n}return i(t,e),t.prototype.ele=function(e,t,r){var n,i;if(u.isObject(e)||u.isString(e)&&(/^\s*</.test(e)||/^\s*[\{\[]/.test(e)||/^(\s*|(#.*)|(%.*))*---/.test(e))){var a=l.fragment().set(this._options);try{a.ele(e)}catch(e){return this.emit("error",e),this}try{for(var s=o(a.node.childNodes),c=s.next();!c.done;c=s.next()){var h=c.value;this._fromNode(h)}}catch(e){n={error:e}}finally{try{c&&!c.done&&(i=s.return)&&i.call(s)}finally{if(n)throw n.error}}return this}if(this._serializeOpenTag(!0),!this._fragment&&this._hasDocumentElement&&0===this._writer.level)return this.emit("error",new Error("Document cannot have multiple document element nodes.")),this;try{this._currentElement=l.fragment(this._builderOptions).ele(e,t,r)}catch(e){return this.emit("error",e),this}return this._fragment||this._hasDocumentElement||""===this._docTypeName||this._currentElement.node._qualifiedName===this._docTypeName?(this._currentElementSerialized=!1,this._fragment||(this._hasDocumentElement=!0),this):(this.emit("error",new Error("Document element name does not match DocType declaration name.")),this)},t.prototype.att=function(e,t,r){if(void 0===this._currentElement)return this.emit("error",new Error("Cannot insert an attribute node as child of a document node.")),this;try{this._currentElement.att(e,t,r)}catch(e){return this.emit("error",e),this}return this},t.prototype.com=function(e){var t;this._serializeOpenTag(!0);try{t=l.fragment(this._builderOptions).com(e).first().node}catch(e){return this.emit("error",e),this}return!this._options.wellFormed||c.xml_isLegalChar(t.data)&&-1===t.data.indexOf("--")&&!t.data.endsWith("-")?(this._push(this._writer.comment(t.data)),this):(this.emit("error",new Error("Comment data contains invalid characters (well-formed required).")),this)},t.prototype.txt=function(e){if(!this._fragment&&void 0===this._currentElement)return this.emit("error",new Error("Cannot insert a text node as child of a document node.")),this;var t;this._serializeOpenTag(!0);try{t=l.fragment(this._builderOptions).txt(e).first().node}catch(e){return this.emit("error",e),this}if(this._options.wellFormed&&!c.xml_isLegalChar(t.data))return this.emit("error",new Error("Text data contains invalid characters (well-formed required).")),this;var r="";if(this._options.noDoubleEncoding)r=t.data.replace(/(?!&(lt|gt|amp|apos|quot);)&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");else for(var n=0;n<t.data.length;n++){var i=t.data[n];r+="&"===i?"&amp;":"<"===i?"&lt;":">"===i?"&gt;":i}return this._push(this._writer.text(r)),this},t.prototype.ins=function(e,t){var r;void 0===t&&(t=""),this._serializeOpenTag(!0);try{r=l.fragment(this._builderOptions).ins(e,t).first().node}catch(e){return this.emit("error",e),this}return this._options.wellFormed&&(-1!==r.target.indexOf(":")||/^xml$/i.test(r.target))?(this.emit("error",new Error("Processing instruction target contains invalid characters (well-formed required).")),this):this._options.wellFormed&&!c.xml_isLegalChar(r.data)?(this.emit("error",Error("Processing instruction data contains invalid characters (well-formed required).")),this):(this._push(this._writer.instruction(r.target,r.data)),this)},t.prototype.dat=function(e){var t;this._serializeOpenTag(!0);try{t=l.fragment(this._builderOptions).dat(e).first().node}catch(e){return this.emit("error",e),this}return this._push(this._writer.cdata(t.data)),this},t.prototype.dec=function(e){return void 0===e&&(e={version:"1.0"}),this._fragment?(this.emit("error",Error("Cannot insert an XML declaration into a document fragment.")),this):this._hasDeclaration?(this.emit("error",Error("XML declaration is already inserted.")),this):(this._push(this._writer.declaration(e.version||"1.0",e.encoding,e.standalone)),this._hasDeclaration=!0,this)},t.prototype.dtd=function(e){if(this._fragment)return this.emit("error",Error("Cannot insert a DocType declaration into a document fragment.")),this;if(""!==this._docTypeName)return this.emit("error",new Error("DocType declaration is already inserted.")),this;if(this._hasDocumentElement)return this.emit("error",new Error("Cannot insert DocType declaration after document element.")),this;var t;try{t=l.create().dtd(e).first().node}catch(e){return this.emit("error",e),this}return this._options.wellFormed&&!c.xml_isPubidChar(t.publicId)?(this.emit("error",new Error("DocType public identifier does not match PubidChar construct (well-formed required).")),this):this._options.wellFormed&&(!c.xml_isLegalChar(t.systemId)||-1!==t.systemId.indexOf('"')&&-1!==t.systemId.indexOf("'"))?(this.emit("error",new Error("DocType system identifier contains invalid characters (well-formed required).")),this):(this._docTypeName=e.name,this._push(this._writer.docType(e.name,t.publicId,t.systemId)),this)},t.prototype.up=function(){return this._serializeOpenTag(!1),this._serializeCloseTag(),this},t.prototype.end=function(){for(this._serializeOpenTag(!1);this._openTags.length>0;)this._serializeCloseTag();return this._push(null),this},t.prototype._serializeOpenTag=function(e){if(!this._currentElementSerialized&&void 0!==this._currentElement){var r=this._currentElement.node;if(!this._options.wellFormed||-1===r.localName.indexOf(":")&&c.xml_isName(r.localName)){var n="",i=!1,o=this._prefixMap.copy(),a={},s=this._recordNamespaceInformation(r,o,a),u=0===this._openTags.length?null:this._openTags[this._openTags.length-1][1],l=r.namespaceURI;if(null===l&&(l=u),u===l)null!==s&&(i=!0),n=l===h.namespace.XML?"xml:"+r.localName:r.localName,this._writer.beginElement(n),this._push(this._writer.openTagBegin(n));else{var p=r.prefix,f=null;if(null===p&&l===s||(f=o.get(p,l)),"xmlns"===p){if(this._options.wellFormed)return void this.emit("error",new Error("An element cannot have the 'xmlns' prefix (well-formed required)."));f=p}null!==f?(n=f+":"+r.localName,null!==s&&s!==h.namespace.XML&&(u=s||null),this._writer.beginElement(n),this._push(this._writer.openTagBegin(n))):null!==p?(p in a&&(p=this._generatePrefix(l,o,this._prefixIndex)),o.set(p,l),n+=p+":"+r.localName,this._writer.beginElement(n),this._push(this._writer.openTagBegin(n)),this._push(this._writer.attribute("xmlns:"+p,this._serializeAttributeValue(l,this._options.wellFormed))),null!==s&&(u=s||null)):null===s||null!==s&&s!==l?(i=!0,n+=r.localName,u=l,this._writer.beginElement(n),this._push(this._writer.openTagBegin(n)),this._push(this._writer.attribute("xmlns",this._serializeAttributeValue(l,this._options.wellFormed)))):(n+=r.localName,u=l,this._writer.beginElement(n),this._push(this._writer.openTagBegin(n)))}this._serializeAttributes(r,o,this._prefixIndex,a,i,this._options.wellFormed);var d=l===h.namespace.HTML;d&&!e&&t._VoidElementNames.has(r.localName)?(this._push(this._writer.openTagEnd(n,!0,!0)),this._writer.endElement(n)):d||e?this._push(this._writer.openTagEnd(n,!1,!1)):(this._push(this._writer.openTagEnd(n,!0,!1)),this._writer.endElement(n)),this._currentElementSerialized=!0,this._openTags.push([n,u,this._prefixMap,e]),this._isPrefixMapModified(this._prefixMap,o)&&(this._prefixMap=o),this._writer.level++}else this.emit("error",new Error("Node local name contains invalid characters (well-formed required)."))}},t.prototype._serializeCloseTag=function(){this._writer.level--;var e=this._openTags.pop();if(void 0!==e){var t=a(e,4),r=t[0],n=(t[1],t[2]),i=t[3];this._prefixMap=n,i&&(this._push(this._writer.closeTag(r)),this._writer.endElement(r))}else this.emit("error",new Error("Last element is undefined."))},t.prototype._push=function(e){null===e?(this._ended=!0,this.emit("end")):this._ended?this.emit("error",new Error("Cannot push to ended stream.")):0!==e.length&&(this._writer.hasData=!0,this.emit("data",e,this._writer.level))},t.prototype._fromNode=function(e){var t,r,n,i;if(d.Guard.isElementNode(e)){var a=e.prefix?e.prefix+":"+e.localName:e.localName;null!==e.namespaceURI?this.ele(e.namespaceURI,a):this.ele(a);try{for(var s=o(e.attributes),u=s.next();!u.done;u=s.next()){var l=u.value,c=l.prefix?l.prefix+":"+l.localName:l.localName;null!==l.namespaceURI?this.att(l.namespaceURI,c,l.value):this.att(c,l.value)}}catch(e){t={error:e}}finally{try{u&&!u.done&&(r=s.return)&&r.call(s)}finally{if(t)throw t.error}}try{for(var h=o(e.childNodes),p=h.next();!p.done;p=h.next()){var f=p.value;this._fromNode(f)}}catch(e){n={error:e}}finally{try{p&&!p.done&&(i=h.return)&&i.call(h)}finally{if(n)throw n.error}}this.up()}else d.Guard.isExclusiveTextNode(e)&&e.data?this.txt(e.data):d.Guard.isCommentNode(e)?this.com(e.data):d.Guard.isCDATASectionNode(e)?this.dat(e.data):d.Guard.isProcessingInstructionNode(e)&&this.ins(e.target,e.data)},t.prototype._serializeAttributes=function(e,t,r,n,i,a){var s,u,l=a?new f.LocalNameSet:void 0;try{for(var p=o(e.attributes),d=p.next();!d.done;d=p.next()){var m=d.value;if(a||i||null!==m.namespaceURI){if(a&&l&&l.has(m.namespaceURI,m.localName))return void this.emit("error",new Error("Element contains duplicate attributes (well-formed required)."));a&&l&&l.set(m.namespaceURI,m.localName);var y=m.namespaceURI,v=null;if(null!==y)if(v=t.get(m.prefix,y),y===h.namespace.XMLNS){if(m.value===h.namespace.XML||null===m.prefix&&i||null!==m.prefix&&(!(m.localName in n)||n[m.localName]!==m.value)&&t.has(m.localName,m.value))continue;if(a&&m.value===h.namespace.XMLNS)return void this.emit("error",new Error("XMLNS namespace is reserved (well-formed required)."));if(a&&""===m.value)return void this.emit("error",new Error("Namespace prefix declarations cannot be used to undeclare a namespace (well-formed required)."));"xmlns"===m.prefix&&(v="xmlns")}else null===v&&(v=null===m.prefix||t.hasPrefix(m.prefix)&&!t.has(m.prefix,y)?this._generatePrefix(y,t,r):m.prefix,this._push(this._writer.attribute("xmlns:"+v,this._serializeAttributeValue(y,this._options.wellFormed))));if(a&&(-1!==m.localName.indexOf(":")||!c.xml_isName(m.localName)||"xmlns"===m.localName&&null===y))return void this.emit("error",new Error("Attribute local name contains invalid characters (well-formed required)."));this._push(this._writer.attribute((null!==v?v+":":"")+m.localName,this._serializeAttributeValue(m.value,this._options.wellFormed)))}else this._push(this._writer.attribute(m.localName,this._serializeAttributeValue(m.value,this._options.wellFormed)))}}catch(e){s={error:e}}finally{try{d&&!d.done&&(u=p.return)&&u.call(p)}finally{if(s)throw s.error}}},t.prototype._serializeAttributeValue=function(e,t){if(t&&null!==e&&!c.xml_isLegalChar(e))return this.emit("error",new Error("Invalid characters in attribute value.")),"";if(null===e)return"";if(this._options.noDoubleEncoding)return e.replace(/(?!&(lt|gt|amp|apos|quot);)&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");for(var r="",n=0;n<e.length;n++){var i=e[n];r+='"'===i?"&quot;":"&"===i?"&amp;":"<"===i?"&lt;":">"===i?"&gt;":i}return r},t.prototype._recordNamespaceInformation=function(e,t,r){var n,i,a=null;try{for(var s=o(e.attributes),u=s.next();!u.done;u=s.next()){var l=u.value,c=l.namespaceURI,p=l.prefix;if(c===h.namespace.XMLNS){if(null===p){a=l.value;continue}var f=l.localName,d=l.value;if(d===h.namespace.XML)continue;if(""===d&&(d=null),t.has(f,d))continue;t.set(f,d),r[f]=d||""}}}catch(e){n={error:e}}finally{try{u&&!u.done&&(i=s.return)&&i.call(s)}finally{if(n)throw n.error}}return a},t.prototype._generatePrefix=function(e,t,r){var n="ns"+r.value;return r.value++,t.set(n,e),n},t.prototype._isPrefixMapModified=function(e,t){var r=e._items,n=t._items,i=e._nullItems,o=t._nullItems;for(var a in n){var s=r[a];if(void 0===s)return!0;var u=n[a];if(s.length!==u.length)return!0;for(var l=0;l<s.length;l++)if(s[l]!==u[l])return!0}if(i.length!==o.length)return!0;for(l=0;l<i.length;l++)if(i[l]!==o[l])return!0;return!1},t._VoidElementNames=new Set(["area","base","basefont","bgsound","br","col","embed","frame","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"]),t}(r(308).EventEmitter);t.XMLBuilderCBImpl=_},function(e,t,r){"use strict";r(73);var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){function t(t){var r=e.call(this,t)||this;return r._lineLength=0,r}return i(t,e),t.prototype.frontMatter=function(){return""},t.prototype.declaration=function(e,t,r){var n=this._beginLine()+"<?xml";return n+=' version="'+e+'"',void 0!==t&&(n+=' encoding="'+t+'"'),void 0!==r&&(n+=' standalone="'+(r?"yes":"no")+'"'),n+="?>"},t.prototype.docType=function(e,t,r){var n=this._beginLine();return n+=t&&r?"<!DOCTYPE "+e+' PUBLIC "'+t+'" "'+r+'">':t?"<!DOCTYPE "+e+' PUBLIC "'+t+'">':r?"<!DOCTYPE "+e+' SYSTEM "'+r+'">':"<!DOCTYPE "+e+">"},t.prototype.comment=function(e){return this._beginLine()+"\x3c!--"+e+"--\x3e"},t.prototype.text=function(e){return this._beginLine()+e},t.prototype.instruction=function(e,t){return t?this._beginLine()+"<?"+e+" "+t+"?>":this._beginLine()+"<?"+e+"?>"},t.prototype.cdata=function(e){return this._beginLine()+"<![CDATA["+e+"]]>"},t.prototype.openTagBegin=function(e){return this._lineLength+=1+e.length,this._beginLine()+"<"+e},t.prototype.openTagEnd=function(e,t,r){return r?" />":t?this._writerOptions.allowEmptyTags?"></"+e+">":this._writerOptions.spaceBeforeSlash?" />":"/>":">"},t.prototype.closeTag=function(e){return this._beginLine()+"</"+e+">"},t.prototype.attribute=function(e,t){var r=e+'="'+t+'"';return this._writerOptions.prettyPrint&&this._writerOptions.width>0&&this._lineLength+1+r.length>this._writerOptions.width?(r=this._beginLine()+this._indent(1)+r,this._lineLength=r.length,r):(this._lineLength+=1+r.length," "+r)},t.prototype.beginElement=function(e){},t.prototype.endElement=function(e){},t.prototype._beginLine=function(){if(this._writerOptions.prettyPrint){var e=(this.hasData?this._writerOptions.newline:"")+this._indent(this._writerOptions.offset+this.level);return this._lineLength=e.length,e}return""},t.prototype._indent=function(e){return e<=0?"":this._writerOptions.indent.repeat(e)},t}(r(113).BaseCBWriter);t.XMLCBWriter=o},function(e,t,r){"use strict";r(73);var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){function t(t){var r=e.call(this,t)||this;return r._hasChildren=[],r._additionalLevel=0,r}return i(t,e),t.prototype.frontMatter=function(){return""},t.prototype.declaration=function(e,t,r){return""},t.prototype.docType=function(e,t,r){return""},t.prototype.comment=function(e){return this._comma()+this._beginLine()+"{"+this._sep()+this._key(this._builderOptions.convert.comment)+this._sep()+this._val(e)+this._sep()+"}"},t.prototype.text=function(e){return this._comma()+this._beginLine()+"{"+this._sep()+this._key(this._builderOptions.convert.text)+this._sep()+this._val(e)+this._sep()+"}"},t.prototype.instruction=function(e,t){return this._comma()+this._beginLine()+"{"+this._sep()+this._key(this._builderOptions.convert.ins)+this._sep()+this._val(t?e+" "+t:e)+this._sep()+"}"},t.prototype.cdata=function(e){return this._comma()+this._beginLine()+"{"+this._sep()+this._key(this._builderOptions.convert.cdata)+this._sep()+this._val(e)+this._sep()+"}"},t.prototype.attribute=function(e,t){return this._comma()+this._beginLine(1)+"{"+this._sep()+this._key(this._builderOptions.convert.att+e)+this._sep()+this._val(t)+this._sep()+"}"},t.prototype.openTagBegin=function(e){var t=this._comma()+this._beginLine()+"{"+this._sep()+this._key(e)+this._sep()+"{";return this._additionalLevel++,this.hasData=!0,t+=this._beginLine()+this._key(this._builderOptions.convert.text)+this._sep()+"[",this._hasChildren.push(!1),t},t.prototype.openTagEnd=function(e,t,r){if(t){var n=this._sep()+"]";return this._additionalLevel--,n+=this._beginLine()+"}"+this._sep()+"}"}return""},t.prototype.closeTag=function(e){var t=this._beginLine()+"]";return this._additionalLevel--,t+=this._beginLine()+"}"+this._sep()+"}"},t.prototype.beginElement=function(e){},t.prototype.endElement=function(e){this._hasChildren.pop()},t.prototype._beginLine=function(e){return void 0===e&&(e=0),this._writerOptions.prettyPrint?(this.hasData?this._writerOptions.newline:"")+this._indent(this._writerOptions.offset+this.level+e):""},t.prototype._indent=function(e){return e+this._additionalLevel<=0?"":this._writerOptions.indent.repeat(e+this._additionalLevel)},t.prototype._comma=function(){var e=this._hasChildren[this._hasChildren.length-1]?",":"";return this._hasChildren.length>0&&(this._hasChildren[this._hasChildren.length-1]=!0),e},t.prototype._sep=function(){return this._writerOptions.prettyPrint?" ":""},t.prototype._key=function(e){return'"'+e+'":'},t.prototype._val=function(e){return JSON.stringify(e)},t}(r(113).BaseCBWriter);t.JSONCBWriter=o},function(e,t,r){"use strict";r(73);var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){function t(t){var r=e.call(this,t)||this;if(r._rootWritten=!1,r._additionalLevel=0,t.indent.length<2)throw new Error("YAML indententation string must be at least two characters long.");if(t.offset<0)throw new Error("YAML offset should be zero or a positive number.");return r}return i(t,e),t.prototype.frontMatter=function(){return this._beginLine()+"---"},t.prototype.declaration=function(e,t,r){return""},t.prototype.docType=function(e,t,r){return""},t.prototype.comment=function(e){return this._beginLine()+this._key(this._builderOptions.convert.comment)+" "+this._val(e)},t.prototype.text=function(e){return this._beginLine()+this._key(this._builderOptions.convert.text)+" "+this._val(e)},t.prototype.instruction=function(e,t){return this._beginLine()+this._key(this._builderOptions.convert.ins)+" "+this._val(t?e+" "+t:e)},t.prototype.cdata=function(e){return this._beginLine()+this._key(this._builderOptions.convert.cdata)+" "+this._val(e)},t.prototype.attribute=function(e,t){this._additionalLevel++;var r=this._beginLine()+this._key(this._builderOptions.convert.att+e)+" "+this._val(t);return this._additionalLevel--,r},t.prototype.openTagBegin=function(e){var t=this._beginLine()+this._key(e);return this._rootWritten||(this._rootWritten=!0),this.hasData=!0,this._additionalLevel++,t+=this._beginLine(!0)+this._key(this._builderOptions.convert.text)},t.prototype.openTagEnd=function(e,t,r){return t?" "+this._val(""):""},t.prototype.closeTag=function(e){return this._additionalLevel--,""},t.prototype.beginElement=function(e){},t.prototype.endElement=function(e){},t.prototype._beginLine=function(e){return void 0===e&&(e=!1),(this.hasData?this._writerOptions.newline:"")+this._indent(this._writerOptions.offset+this.level,e)},t.prototype._indent=function(e,t){if(e+this._additionalLevel<=0)return"";var r=this._writerOptions.indent.repeat(e+this._additionalLevel);return!t&&this._rootWritten?r.substr(0,r.length-2)+"-"+r.substr(-1,1):r},t.prototype._key=function(e){return'"'+e+'":'},t.prototype._val=function(e){return JSON.stringify(e)},t}(r(113).BaseCBWriter);t.YAMLCBWriter=o},function(e,t,r){"use strict";var n,i="object"==typeof Reflect?Reflect:null,o=i&&"function"==typeof i.apply?i.apply:function(e,t,r){return Function.prototype.apply.call(e,t,r)};n=i&&"function"==typeof i.ownKeys?i.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var a=Number.isNaN||function(e){return e!=e};function s(){s.init.call(this)}e.exports=s,s.EventEmitter=s,s.prototype._events=void 0,s.prototype._eventsCount=0,s.prototype._maxListeners=void 0;var u=10;function l(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function c(e){return void 0===e._maxListeners?s.defaultMaxListeners:e._maxListeners}function h(e,t,r,n){var i,o,a,s;if(l(r),void 0===(o=e._events)?(o=e._events=Object.create(null),e._eventsCount=0):(void 0!==o.newListener&&(e.emit("newListener",t,r.listener?r.listener:r),o=e._events),a=o[t]),void 0===a)a=o[t]=r,++e._eventsCount;else if("function"==typeof a?a=o[t]=n?[r,a]:[a,r]:n?a.unshift(r):a.push(r),(i=c(e))>0&&a.length>i&&!a.warned){a.warned=!0;var u=new Error("Possible EventEmitter memory leak detected. "+a.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");u.name="MaxListenersExceededWarning",u.emitter=e,u.type=t,u.count=a.length,s=u,console&&console.warn&&console.warn(s)}return e}function p(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function f(e,t,r){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:r},i=p.bind(n);return i.listener=r,n.wrapFn=i,i}function d(e,t,r){var n=e._events;if(void 0===n)return[];var i=n[t];return void 0===i?[]:"function"==typeof i?r?[i.listener||i]:[i]:r?function(e){for(var t=new Array(e.length),r=0;r<t.length;++r)t[r]=e[r].listener||e[r];return t}(i):y(i,i.length)}function m(e){var t=this._events;if(void 0!==t){var r=t[e];if("function"==typeof r)return 1;if(void 0!==r)return r.length}return 0}function y(e,t){for(var r=new Array(t),n=0;n<t;++n)r[n]=e[n];return r}Object.defineProperty(s,"defaultMaxListeners",{enumerable:!0,get:function(){return u},set:function(e){if("number"!=typeof e||e<0||a(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");u=e}}),s.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},s.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||a(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},s.prototype.getMaxListeners=function(){return c(this)},s.prototype.emit=function(e){for(var t=[],r=1;r<arguments.length;r++)t.push(arguments[r]);var n="error"===e,i=this._events;if(void 0!==i)n=n&&void 0===i.error;else if(!n)return!1;if(n){var a;if(t.length>0&&(a=t[0]),a instanceof Error)throw a;var s=new Error("Unhandled error."+(a?" ("+a.message+")":""));throw s.context=a,s}var u=i[e];if(void 0===u)return!1;if("function"==typeof u)o(u,this,t);else{var l=u.length,c=y(u,l);for(r=0;r<l;++r)o(c[r],this,t)}return!0},s.prototype.addListener=function(e,t){return h(this,e,t,!1)},s.prototype.on=s.prototype.addListener,s.prototype.prependListener=function(e,t){return h(this,e,t,!0)},s.prototype.once=function(e,t){return l(t),this.on(e,f(this,e,t)),this},s.prototype.prependOnceListener=function(e,t){return l(t),this.prependListener(e,f(this,e,t)),this},s.prototype.removeListener=function(e,t){var r,n,i,o,a;if(l(t),void 0===(n=this._events))return this;if(void 0===(r=n[e]))return this;if(r===t||r.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete n[e],n.removeListener&&this.emit("removeListener",e,r.listener||t));else if("function"!=typeof r){for(i=-1,o=r.length-1;o>=0;o--)if(r[o]===t||r[o].listener===t){a=r[o].listener,i=o;break}if(i<0)return this;0===i?r.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(r,i),1===r.length&&(n[e]=r[0]),void 0!==n.removeListener&&this.emit("removeListener",e,a||t)}return this},s.prototype.off=s.prototype.removeListener,s.prototype.removeAllListeners=function(e){var t,r,n;if(void 0===(r=this._events))return this;if(void 0===r.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==r[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete r[e]),this;if(0===arguments.length){var i,o=Object.keys(r);for(n=0;n<o.length;++n)"removeListener"!==(i=o[n])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=r[e]))this.removeListener(e,t);else if(void 0!==t)for(n=t.length-1;n>=0;n--)this.removeListener(e,t[n]);return this},s.prototype.listeners=function(e){return d(this,e,!0)},s.prototype.rawListeners=function(e){return d(this,e,!1)},s.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):m.call(e,t)},s.prototype.listenerCount=m,s.prototype.eventNames=function(){return this._eventsCount>0?n(this._events):[]}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(76);t.createCB=function(e){return new n.XMLBuilderCBImpl(e)},t.fragmentCB=function(e){return new n.XMLBuilderCBImpl(e,!0)}}])}));
},{}]},{},[1]);

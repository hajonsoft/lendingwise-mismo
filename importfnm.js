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
    value: (node) => getText(node, `ULAD:SpecialBorrowerSellerRelationshipIndicator`) === "Yes",
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
    value: (node) => getText(node, "AttachmentType"),
    exportTo: "SUBJECT_PROPERTY PROPERTY_DETAIL AttachmentType"
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
    value: (node) => getText(node, "PropertyUsageType"),
    exportTo: "SUBJECT_PROPERTY PROPERTY_DETAIL PropertyUsageType"
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
        asset.querySelector("assetType")?.textContent ||
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
    exportTo: "EMPLOYER EMPLOYMENT EmploymentStatusType"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_nameOfEmployer",
    value: (employer) =>
      employer?.querySelector("LEGAL_ENTITY_DETAIL FullName")?.textContent,
    exportTo: "EMPLOYER LEGAL_ENTITY LEGAL_ENTITY_DETAIL FullName"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_addrOfEmployer",
    value: (employer) =>
      employer?.querySelector("address AddressLineText")?.textContent,
    exportTo: "EMPLOYER ADDRESS AddressLineText"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_cityOfEmployer",
    value: (employer) =>
      employer?.querySelector("address CityName")?.textContent,
    exportTo: "EMPLOYER ADDRESS CityName"
  },
  // Get the correct selector for the zip code and state
  {
    selector: "#AddiontalEmplInfo_{counter}_zipOfEmployer",
    value: (employer) =>
      employer?.querySelector("address PostalCode")?.textContent,
    exportTo: "EMPLOYER ADDRESS PostalCode"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_stateOfEmployer",
    value: (employer) =>
      employer?.querySelector("address StateCode")?.textContent,
    exportTo: "EMPLOYER ADDRESS StateCode"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_employedFrom",
    value: (employer) => {
      const hireDate = getText(employer, "EmploymentStartDate");

      if (hireDate) {
        return formatDate(hireDate);
      }
    },
    exportTo: "EMPLOYER EMPLOYMENT EmploymentStartDate"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_monthlyIncome",
    value: (employer) =>
      employer?.querySelector("EmploymentMonthlyIncomeAmount")?.textContent,
    exportTo: "EMPLOYER EMPLOYMENT EmploymentMonthlyIncomeAmount"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_employedByOtherParty",
    value: (employer) =>
      employer?.querySelector("SpecialBorrowerEmployerRelationshipIndicator")
        ?.textContent === "true",
    exportTo: "EMPLOYER EMPLOYMENT SpecialBorrowerEmployerRelationshipIndicator"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_position",
    value: (employer) =>
      employer?.querySelector("EmploymentPositionDescription")?.textContent,
    exportTo: "EMPLOYER EMPLOYMENT EmploymentPositionDescription"
  },
  {
    selector: "#AddiontalEmplInfo_{counter}_businessPhone",
    value: (employer) =>
      employer?.querySelector("ContactPointTelephoneValue")?.textContent,
    exportTo: "EMPLOYER LEGAL_ENTITY CONTACTS CONTACT CONTACT_POINTS CONTACT_POINT CONTACT_POINT_TELEPHONE ContactPointTelephoneValue"
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
  const found = mapping.find((item) => item.dom === assetType) || "Other";
  return found ? found.dom : "Other";
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
      const addNewSelector = `#financeAndSecuritie${i === 0 ? "" : "_" + i
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

  const dealNode = doc
    .ele("DEAL_SETS")
    .ele("DEAL_SET")
    .ele("DEALS")
    .ele("DEAL")

  const borrowerPartyNode = dealNode
    .ele("PARTIES")
    .com("First Borrower")
    .ele("PARTY");


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

  //Assets Real State Owned Properties
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
  const employmentNode = borrowerPartyNode.ele("EMPLOYERS").com("Employers")
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

  // Employment Info - Borrower
  const employmentPrevNode = borrowerPartyNode.ele("EMPLOYERS").com("Employers")
  prevEmployerConfig.forEach((config) => {
    if (!config.exportTo) {
      return;
    }
    config.selector = config.selector.replace("{counter}", 1)
    if (!Array.isArray(config.selector)) {
      exportElementToXML(config, employmentPrevNode);
    } else {
      config.selector.forEach((selector, index) => {
        const elementChecked = document.querySelector(`${selector}:checked`);
        if (elementChecked) {
          exportElementToXML(
            { ...config, selector },
            employmentPrevNode,
            config.exportValues?.[index],
          );
        }
      });
    }
  });

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
  }

  const xml = doc.end({ prettyPrint: true });
  console.log(xml);
}

global.handleImportChange = handleImportChange;
global.handleExportClick = handleExportClick;

function exportElementToXML(config, startNode, hardcodedValue, index) {
  const element = document.querySelector(config.selector);
  const eleVal = element.value;
  let xmlNode = startNode;

  if (element) {
    config.exportTo.split(" ").forEach((tagName) => {
      const foundNode = xmlNode.find((n) => n.node.nodeName === tagName);
      if (foundNode && config?.newTag != tagName) {
        xmlNode = foundNode;
      } else if (index && config.newTag === tagName) {
        xmlNode = xmlNode.ele(tagName).att("Sequence", index);
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
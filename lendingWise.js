const { container } = require("./util");
const loanGlobal = require("./assets/loan.json");

function assets(doc, data) {
  return buildMismoNodes(doc, data, "ASSETS", "ASSET", 0, [
    {
      path: ["ASSET_DETAIL"],
      nodes: [
        { AssetAccountIdentifier: (row, index) => row.fileID },
        { AssetCashOrMarketValueAmount: (row, index) => row.balance },
        { AssetType: (row, index) => row.accType },
      ],
    },
    {
      path: ["ASSET_HOLDER", "NAME"],
      nodes: [{ FullName: (row, index) => row.accountTitledAs }],
    },
  ]);
}

function ownedProperty(doc, data, startIndex) {
  return buildMismoNodes(doc, data, "ASSETS", "ASSET", startIndex, [
    {
      path: ["OWNED_PROPERTY", "OWNED_PROPERTY_DETAIL"],
      goBack: 1,
      nodes: [
        { OwnedPropertySubjectIndicator: (row, index) => "" },
        {
          OwnedPropertyDispositionStatusType: (row, index) =>
            row.scheduleStatus,
        },
        {
          OwnedPropertyMaintenanceExpenseAmount: (row, index) =>
            row.insMaintTaxMisc,
        },
        {
          OwnedPropertyRentalIncomeGrossAmount: (row, index) =>
            row.grossRentalIncome,
        },
        {
          OwnedPropertyRentalIncomeNetAmount: (row, index) =>
            row.netRentalIncome,
        },
        { OwnedPropertyLienUPBAmount: (row, index) => row.unpaidBalance },
      ],
    },
    {
      path: ["PROPERTY", "ADDRESS"],
      goBack: 1,
      nodes: [
        { AddressLineText: (row, index) => row.schedulePropAddr },
        { AddressUnitIdentifier: (row, index) => "" },
        { CityName: (row, index) => row.schedulePropCity },
        { StateCode: (row, index) => row.schedulePropState },
        { PostalCode: (row, index) => row.schedulePropZip },
        { CountryCode: (row, index) => "USA" },
      ],
    },
    {
      path: ["PROPERTY_DETAIL"],
      goBack: "ASSETS",
      nodes: [
        {
          PropertyEstimatedValueAmount: (row, index) => row.presentMarketValue,
        },
        { PropertyCurrentUsageType: (row, index) => row.intendedOccupancy },
        { PropertyUsageType: (row, index) => row.intendedOccupancy },
        {
          PropertyUsageTypeOtherDescription: (row, index) =>
            JSON.stringify(row),
        },
      ],
    },
  ]);
}
function collaterals(doc, data) {
  return buildMismoNodes(doc, data, "COLLATERALS", "COLLATERAL", 0, [
    {
      path: ["SUBJECT_PROPERTY", "ADDRESS"],
      goBack: 1,
      nodes: [
        { AddressLineText: (row, index) => row.propertyAddress },
        {
          AddressUnitIdentifier: (row, index) => "",
        },
        {
          CityName: (row, index) => row.propertyCity,
        },
        {
          StateCode: (row, index) => row.propertyState,
        },
        {
          PostalCode: (row, index) => row.propertyZip,
        },
        { CountyName: (row, index) => JSON.stringify(row) },
      ],
    },
    {
      path: ["PROPERTY_DETAIL"],
      goBack: "ASSETS",
      nodes: [
        { FinancedUnitCount: (row, index) => JSON.stringify(row) },
        { PropertyEstimatedValueAmount: (row, index) => JSON.stringify(row) },
        { PropertyUsageType: (row, index) => JSON.stringify(row) },
        { FHASecondaryResidenceIndicator: (row, index) => JSON.stringify(row) },
        { PropertyMixedUsageIndicator: (row, index) => JSON.stringify(row) },
        { ConstructionMethodType: (row, index) => JSON.stringify(row) },
        {
          ConstructionMethodTypeOtherDescription: (row, index) =>
            JSON.stringify(row),
        },
      ],
    },
  ]);
}
function liabilities(doc, data, startIndex) {
  return buildMismoNodes(doc, data, "LIABILITIES", "LIABILITY", startIndex, [
    {
      path: ["LIABILITY_DETAIL"],
      nodes: [
        { LiabilityType: (row, index) => JSON.stringify(row) },
        {
          LiabilityTypeOtherDescription: (row, index) => JSON.stringify(row),
        },
        {
          LiabilityAccountIdentifier: (row, index) => row.PCID,
        },
        {
          LiabilityUnpaidBalanceAmount: (row, index) => row.clBalance,
        },
        {
          LiabilityPayoffStatusIndicator: (row, index) => JSON.stringify(row),
        },
        { LiabilityMonthlyPaymentAmount: (row, index) => row.monthlyPayment },
        {
          LiabilityRemainingTermMonthsCount: (row, index) =>
            JSON.stringify(row),
        },
        { LiabilityExclusionIndicator: (row, index) => JSON.stringify(row) },
      ],
    },
    {
      path: ["LIABILITY_HOLDER", "NAME"],
      nodes: [{ FullName: (row, index) => row.nameOfCompany }],
    },
  ]);
}
function loans(doc, data, startIndex) {
  return buildMismoNodes(doc, data, "LOANS", "LOAN", startIndex, [
    {
      path: ["LOAN_IDENTIFIERS", "LOAN_IDENTIFIER"],
      nodes: [
        { LoanIdentifier: (row, index) => JSON.stringify(row) },
        {
          LoanIdentifierType: (row, index) => JSON.stringify(row),
        },
      ],
    },
    {
      path: ["AMORTIZATION", "AMORTIZATION_RULE"],
      nodes: [
        { AmortizationType: (row, index) => JSON.stringify(row) },
        { LoanAmortizationPeriodCount: (row, index) => JSON.stringify(row) },
        { LoanAmortizationPeriodType: (row, index) => JSON.stringify(row) },
      ],
    },
    {
      path: ["CLOSING_INFORMATION", "CLOSING_INFORMATION_DETAIL"],
      nodes: [
        {
          CashFromBorrowerAtClosingAmount: (row, index) => JSON.stringify(row),
        },
      ],
    },
    {
      path: [
        "DOCUMENT_SPECIFIC_DATA_SETS",
        "DOCUMENT_SPECIFIC_DATA_SET",
        "URLA",
        "URLA_DETAIL",
      ],
      goBack: 1,
      nodes: [
        { BorrowerRequestedLoanAmount: (row, index) => JSON.stringify(row) },
        { EstimatedClosingCostsAmount: (row, index) => JSON.stringify(row) },
      ],
    },
    {
      path: ["URLA_TOTAL"],
      goBack: 4,
      nodes: [
        {
          URLATotalDueFromBorrowerAtClosingAmount: (row, index) =>
            JSON.stringify(row),
        },
      ],
    },
    {
      path: ["LOAN_DETAIL"],
      nodes: [{ BorrowerCount: (row, index) => JSON.stringify(row) }],
    },
    {
      path: ["TERMS_OF_LOAN"],
      nodes: [
        { BaseLoanAmount: (row, index) => JSON.stringify(row) },
        { LienPriorityType: (row, index) => JSON.stringify(row) },
        { LoanPurposeType: (row, index) => JSON.stringify(row) },
        { MortgageType: (row, index) => JSON.stringify(row) },
        { NoteAmount: (row, index) => JSON.stringify(row) },
        { NoteRatePercent: (row, index) => JSON.stringify(row) },
      ],
    },
  ]);
}
function parties(doc, data) {
  return buildMismoNodes(doc, data, "PARTIES", "PARTY", 0, [
    {
      path: ["TAXPAYER_IDENTIFIERS", "TAXPAYER_IDENTIFIER"],
      nodes: [
        { TaxpayerIdentifierType: (row, index) => "SocialSecurityNumber" },
        {
          TaxpayerIdentifierValue: (row, index) => row.ssnNumber,
        },
      ],
    },
    {
      path: ["ADDRESSES", "ADDRESS"],
      goBack: 1,
      nodes: [
        { AddressType: (row, index) => "HOME" },
        {
          AddressLineText: (row, index) => loanGlobal.file2Info.presentAddress,
        },
        { AddressUnitIdentifier: (row, index) => "" },
        { CityName: (row, index) => loanGlobal.file2Info.presentCity },
        { StateCode: (row, index) => loanGlobal.file2Info.presentState },
        { PostalCode: (row, index) => row.previousZip },
        { CountryCode: (row, index) => "USA" },
      ],
    },
    {
      path: ["ADDRESS"],
      goBack: 2,
      nodes: [
        { AddressType: (row, index) => "MAILING" },
        {
          AddressLineText: (row, index) => row.mailingAddress,
        },
        { AddressUnitIdentifier: (row, index) => "" },
        { CityName: (row, index) => row.mailingCity },
        { StateCode: (row, index) => row.mailingState },
        { PostalCode: (row, index) => row.mailingZip },
        { CountryCode: (row, index) => "USA" },
      ],
    },
    {
      path: ["INDIVIDUAL", "ALIASES", "ALIAS", "NAME"],
      goBack: 3,
      nodes: [
        { FirstName: (row, index) => row.borrowerFName },
        {
          LastName: (row, index) => row.borrowerLName,
        },
        { MiddleName: (row, index) => "" },
      ],
    },
    {
      path: ["CONTACT_POINTS", "CONTACT_POINT", "CONTACT_POINT_EMAIL"],
      goBack: 2,
      nodes: [{ ContactPointEmailValue: (row, index) => row.borrowerEmail }],
    },
    {
      path: ["CONTACT_POINT", "CONTACT_POINT_TELEPHONE"],
      goBack: 1,
      nodes: [{ ContactPointTelephoneValue: (row, index) => row.phoneNumber }],
    },
    {
      path: ["CONTACT_POINT_DETAIL"],
      goBack: 2,
      nodes: [{ ContactPointRoleType: (row, index) => "HOME" }],
    },
    {
      path: ["CONTACT_POINT", "CONTACT_POINT_TELEPHONE"],
      goBack: 1,
      nodes: [{ ContactPointTelephoneValue: (row, index) => row.cellNo }],
    },
    {
      path: ["CONTACT_POINT_DETAIL"],
      goBack: 2,
      nodes: [{ ContactPointRoleType: (row, index) => "MOBILE" }],
    },
    {
      path: ["CONTACT_POINT", "CONTACT_POINT_TELEPHONE"],
      goBack: 1,
      nodes: [{ ContactPointTelephoneValue: (row, index) => row.workNumber }],
    },
    {
      path: ["CONTACT_POINT_DETAIL"],
      goBack: 2,
      nodes: [{ ContactPointRoleType: (row, index) => "WORK" }],
    },
    {
      path: ["NAME"],
      goBack: 3,
      nodes: [
        { FirstName: (row, index) => row.borrowerFName },
        { LastName: (row, index) => row.borrowerLName },
        { MiddleName: (row, index) => "" },
      ],
    },
    {
      path: ["ROLES", "ROLE", "BORROWER", "BORROWER_DETAIL"],
      goBack: 1,
      nodes: [
        {
          BorrowerBirthDate: (row, index) =>
            loanGlobal.fileHMLOInfo.borrowerDOB,
        },
        {
          DependentCount: (row, index) =>
            loanGlobal.fileHMLOInfo.agesOfDependent
              ? loanGlobal.fileHMLOInfo.agesOfDependent.split(",").length
              : loanGlobal.fileHMLOInfo.numberOfDependents,
        },
        { MaritalStatusType: (row, index) => row.maritalStatus },
        {
          SelfDeclaredMilitaryServiceIndicator: (row, index) =>
            JSON.stringify(row),
        },
      ],
    },
    {
      path: ["CURRENT_INCOME", "CURRENT_INCOME_DETAIL"],
      goBack: 1,
      nodes: [
        {
          URLABorrowerTotalOtherIncomeAmount: (row, index) =>
            JSON.stringify(row),
        },
      ],
    },
    {
      path: [
        "CURRENT_INCOME_ITEMS",
        "CURRENT_INCOME_ITEM",
        "CURRENT_INCOME_ITEM_DETAIL",
      ],
      goBack: 3,
      nodes: [
        {
          CurrentIncomeMonthlyTotalAmount: (row, index) => JSON.stringify(row),
        },
        { EmploymentIncomeIndicator: (row, index) => JSON.stringify(row) },
        { IncomeType: (row, index) => JSON.stringify(row) },
      ],
    },
  ]);
}
function buildMismoNodes(
  doc,
  data,
  rootNode,
  repeatingNode,
  startIndex = 0,
  config
) {
  if (data && Array.isArray(data) && data.length > 0) {
    for (let counter = 0; counter < data.length; counter++) {
      const row = data[counter];
      const methodRoot = doc
        .root()
        .find((n) => n.node.nodeName === rootNode, true, true);
      if (methodRoot) {
        doc = methodRoot;
      } else {
        doc = doc
          .root()
          .find((n) => n.node.nodeName === "DEAL", true, true)
          .ele(rootNode);
      }
      doc = doc.ele(repeatingNode, {
        SequenceNumber: counter + startIndex + 1,
        "xlink:label": `${repeatingNode}_${counter + startIndex + 1}`,
      });
      config.forEach((element) => {
        doc = container(doc, element.path);
        element.nodes.forEach((n) => {
          const key = Object.keys(n)[0];
          const value = n[key](row, counter + 1);
          doc.ele(key).txt(value).up();
        });
        if (element.goBack) {
          if (Number.isInteger(element.goBack)) {
            for (let i = 0; i < element.goBack; i++) {
              doc = doc.up();
            }
          } else {
            while (doc.node.nodeName !== rootNode) {
              doc = doc.up();
            }
          }
        } else {
          element.path.forEach(() => (doc = doc.up()));
        }
      });
    }
  }
  return doc;
}

const loanOwnedPropertyData = (data) => {
  if (data && Array.isArray(data) && data.length > 0) {
    return data.filter(
      (x) =>
        x.scheduleStatus &&
        x.scheduleStatus !== "" &&
        x.scheduleStatus !== "Sold"
    );
  }
};
module.exports = {
  assets,
  loanOwnedPropertyData,
  ownedProperty,
  collaterals,
  liabilities,
  loans,
  parties,
};

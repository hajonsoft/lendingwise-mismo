const { container } = require("./util");
const loanGlobal = require("./assets/loan.json");

function assets(doc, data) {
  return buildMismoNodes(doc, data, "ASSETS", "ASSET", 0, [
    {
      path: ["ASSET_DETAIL"],
      nodes: [
        { AssetAccountIdentifier: (row) => row.fileID },
        { AssetCashOrMarketValueAmount: (row) => row.balance },
        { AssetType: (row) => row.accType },
      ],
    },
    {
      path: ["ASSET_HOLDER", "NAME"],
      nodes: [{ FullName: (row) => row.accountTitledAs }],
    },
  ]);
}

function ownedProperty(doc, data, startIndex) {
  return buildMismoNodes(doc, data, "ASSETS", "ASSET", startIndex, [
    {
      path: ["OWNED_PROPERTY", "OWNED_PROPERTY_DETAIL"],
      goBack: 1,
      nodes: [
        { OwnedPropertySubjectIndicator: (row) => "" },
        {
          OwnedPropertyDispositionStatusType: (row) =>
            row.scheduleStatus,
        },
        {
          OwnedPropertyMaintenanceExpenseAmount: (row) =>
            row.insMaintTaxMisc,
        },
        {
          OwnedPropertyRentalIncomeGrossAmount: (row) =>
            row.grossRentalIncome,
        },
        {
          OwnedPropertyRentalIncomeNetAmount: (row) =>
            row.netRentalIncome,
        },
        { OwnedPropertyLienUPBAmount: (row) => row.unpaidBalance },
      ],
    },
    {
      path: ["PROPERTY", "ADDRESS"],
      goBack: 1,
      nodes: [
        { AddressLineText: (row) => row.schedulePropAddr },
        { AddressUnitIdentifier: (row) => "" },
        { CityName: (row) => row.schedulePropCity },
        { StateCode: (row) => row.schedulePropState },
        { PostalCode: (row) => row.schedulePropZip },
        { CountryCode: (row) => "USA" },
      ],
    },
    {
      path: ["PROPERTY_DETAIL"],
      goBack: "ASSETS",
      nodes: [
        {
          PropertyEstimatedValueAmount: (row) => row.presentMarketValue,
        },
        { PropertyCurrentUsageType: (row) => row.intendedOccupancy },
        { PropertyUsageType: (row) => row.intendedOccupancy },
        {
          PropertyUsageTypeOtherDescription: (row) =>
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
        { AddressLineText: (row) => row.propertyAddress },
        {
          AddressUnitIdentifier: (row) => "",
        },
        {
          CityName: (row) => row.propertyCity,
        },
        {
          StateCode: (row) => row.propertyState,
        },
        {
          PostalCode: (row) => row.propertyZip,
        },
        { CountyName: (row) => JSON.stringify(row) },
      ],
    },
    {
      path: ["PROPERTY_DETAIL"],
      goBack: "ASSETS",
      nodes: [
        { FinancedUnitCount: (row) => JSON.stringify(row) },
        { PropertyEstimatedValueAmount: (row) => JSON.stringify(row) },
        { PropertyUsageType: (row) => JSON.stringify(row) },
        { FHASecondaryResidenceIndicator: (row) => JSON.stringify(row) },
        { PropertyMixedUsageIndicator: (row) => JSON.stringify(row) },
        { ConstructionMethodType: (row) => JSON.stringify(row) },
        {
          ConstructionMethodTypeOtherDescription: (row) =>
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
        { LiabilityType: (row) => JSON.stringify(row) },
        {
          LiabilityTypeOtherDescription: (row) => JSON.stringify(row),
        },
        {
          LiabilityAccountIdentifier: (row) => row.PCID,
        },
        {
          LiabilityUnpaidBalanceAmount: (row) => row.clBalance,
        },
        {
          LiabilityPayoffStatusIndicator: (row) => JSON.stringify(row),
        },
        { LiabilityMonthlyPaymentAmount: (row) => row.monthlyPayment },
        {
          LiabilityRemainingTermMonthsCount: (row) =>
            JSON.stringify(row),
        },
        { LiabilityExclusionIndicator: (row) => JSON.stringify(row) },
      ],
    },
    {
      path: ["LIABILITY_HOLDER", "NAME"],
      nodes: [{ FullName: (row) => row.nameOfCompany }],
    },
  ]);
}
function loans(doc, data, startIndex) {
  return buildMismoNodes(doc, data, "LOANS", "LOAN", startIndex, [
    {
      path: ["LOAN_IDENTIFIERS", "LOAN_IDENTIFIER"],
      nodes: [
        { LoanIdentifier: (row) => JSON.stringify(row) },
        {
          LoanIdentifierType: (row) => JSON.stringify(row),
        },
      ],
    },
    {
      path: ["AMORTIZATION", "AMORTIZATION_RULE"],
      nodes: [
        { AmortizationType: (row) => JSON.stringify(row) },
        { LoanAmortizationPeriodCount: (row) => JSON.stringify(row) },
        { LoanAmortizationPeriodType: (row) => JSON.stringify(row) },
      ],
    },
    {
      path: ["CLOSING_INFORMATION", "CLOSING_INFORMATION_DETAIL"],
      nodes: [
        {
          CashFromBorrowerAtClosingAmount: (row) => JSON.stringify(row),
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
        { BorrowerRequestedLoanAmount: (row) => JSON.stringify(row) },
        { EstimatedClosingCostsAmount: (row) => JSON.stringify(row) },
      ],
    },
    {
      path: ["URLA_TOTAL"],
      goBack: 4,
      nodes: [
        {
          URLATotalDueFromBorrowerAtClosingAmount: (row) =>
            JSON.stringify(row),
        },
      ],
    },
    {
      path: ["LOAN_DETAIL"],
      nodes: [{ BorrowerCount: (row) => JSON.stringify(row) }],
    },
    {
      path: ["TERMS_OF_LOAN"],
      nodes: [
        { BaseLoanAmount: (row) => JSON.stringify(row) },
        { LienPriorityType: (row) => JSON.stringify(row) },
        { LoanPurposeType: (row) => JSON.stringify(row) },
        { MortgageType: (row) => JSON.stringify(row) },
        { NoteAmount: (row) => JSON.stringify(row) },
        { NoteRatePercent: (row) => JSON.stringify(row) },
      ],
    },
  ]);
}
function parties(doc, data) {
  return buildMismoNodes(doc, data, "PARTIES", "PARTY", 0, [
    {
      path: ["TAXPAYER_IDENTIFIERS", "TAXPAYER_IDENTIFIER"],
      nodes: [
        { TaxpayerIdentifierType: (row) => "SocialSecurityNumber" },
        {
          TaxpayerIdentifierValue: (row) => row.ssnNumber,
        },
      ],
    },
    {
      path: ["ADDRESSES", "ADDRESS"],
      goBack: 1,
      nodes: [
        { AddressType: (row) => "HOME" },
        {
          AddressLineText: (row) => loanGlobal.file2Info.presentAddress,
        },
        { AddressUnitIdentifier: (row) => "" },
        { CityName: (row) => loanGlobal.file2Info.presentCity },
        { StateCode: (row) => loanGlobal.file2Info.presentState },
        { PostalCode: (row) => row.previousZip },
        { CountryCode: (row) => "USA" },
      ],
    },
    {
      path: ["ADDRESS"],
      goBack: 2,
      nodes: [
        { AddressType: (row) => "MAILING" },
        {
          AddressLineText: (row) => row.mailingAddress,
        },
        { AddressUnitIdentifier: (row) => "" },
        { CityName: (row) => row.mailingCity },
        { StateCode: (row) => row.mailingState },
        { PostalCode: (row) => row.mailingZip },
        { CountryCode: (row) => "USA" },
      ],
    },
    {
      path: ["INDIVIDUAL", "ALIASES", "ALIAS", "NAME"],
      goBack: 3,
      nodes: [
        { FirstName: (row) => row.borrowerFName },
        {
          LastName: (row) => row.borrowerLName,
        },
        { MiddleName: (row) => "" },
      ],
    },
    {
      path: ["CONTACT_POINTS", "CONTACT_POINT", "CONTACT_POINT_EMAIL"],
      goBack: 2,
      nodes: [{ ContactPointEmailValue: (row) => row.borrowerEmail }],
    },
    {
      path: ["CONTACT_POINT", "CONTACT_POINT_TELEPHONE"],
      goBack: 1,
      nodes: [{ ContactPointTelephoneValue: (row) => row.phoneNumber }],
    },
    {
      path: ["CONTACT_POINT_DETAIL"],
      goBack: 2,
      nodes: [{ ContactPointRoleType: (row) => "HOME" }],
    },
    {
      path: ["CONTACT_POINT", "CONTACT_POINT_TELEPHONE"],
      goBack: 1,
      nodes: [{ ContactPointTelephoneValue: (row) => row.cellNo }],
    },
    {
      path: ["CONTACT_POINT_DETAIL"],
      goBack: 2,
      nodes: [{ ContactPointRoleType: (row) => "MOBILE" }],
    },
    {
      path: ["CONTACT_POINT", "CONTACT_POINT_TELEPHONE"],
      goBack: 1,
      nodes: [{ ContactPointTelephoneValue: (row) => row.workNumber }],
    },
    {
      path: ["CONTACT_POINT_DETAIL"],
      goBack: 2,
      nodes: [{ ContactPointRoleType: (row) => "WORK" }],
    },
    {
      path: ["NAME"],
      goBack: 3,
      nodes: [
        { FirstName: (row) => row.borrowerFName },
        { LastName: (row) => row.borrowerLName },
        { MiddleName: (row) => "" },
      ],
    },
    {
      path: ["ROLES", "ROLE", "BORROWER", "BORROWER_DETAIL"],
      goBack: 1,
      nodes: [
        {
          BorrowerBirthDate: (row) =>
            loanGlobal.fileHMLOInfo.borrowerDOB,
        },
        {
          DependentCount: (row) =>
            loanGlobal.fileHMLOInfo.agesOfDependent
              ? loanGlobal.fileHMLOInfo.agesOfDependent.split(",").length
              : loanGlobal.fileHMLOInfo.numberOfDependents,
        },
        { MaritalStatusType: (row) => row.maritalStatus },
        {
          SelfDeclaredMilitaryServiceIndicator: (row) =>
            JSON.stringify(row),
        },
      ],
    },
    {
      path: ["CURRENT_INCOME", "CURRENT_INCOME_DETAIL"],
      goBack: 1,
      nodes: [
        {
          URLABorrowerTotalOtherIncomeAmount: (row) =>
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
          CurrentIncomeMonthlyTotalAmount: (row) => JSON.stringify(row),
        },
        { EmploymentIncomeIndicator: (row) => JSON.stringify(row) },
        { IncomeType: (row) => JSON.stringify(row) },
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

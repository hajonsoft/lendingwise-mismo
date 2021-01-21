const { container } = require("./util");
const loanGlobal = require("./assets/loan.json");

function assets(doc, data) {
  return buildMismoNodes(doc, data, "ASSETS", "ASSET", 0, [
    {
      path: ["ASSET_DETAIL"],
      nodes: [
        { AssetAccountIdentifier: (row) => row.accountNumber },
        { AssetCashOrMarketValueAmount: (row) => row.balance },
        { AssetType: (row) => mapValue(row.accType, assetTypeDiagram) },
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
        { OwnedPropertySubjectIndicator: (row) => "0" },
        {
          OwnedPropertyDispositionStatusType: (row) => row.scheduleStatus,
        },
        {
          OwnedPropertyMaintenanceExpenseAmount: (row) => row.insMaintTaxMisc,
        },
        {
          OwnedPropertyRentalIncomeGrossAmount: (row) => row.grossRentalIncome,
        },
        {
          OwnedPropertyRentalIncomeNetAmount: (row) => row.netRentalIncome,
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
      goBack: 1,
      nodes: [
        {
          PropertyEstimatedValueAmount: (row) => row.presentMarketValue,
        },
        { PropertyCurrentUsageType: (row) => row.intendedOccupancy },
        {
          PropertyUsageType: (row) =>
            mapValue(row.intendedOccupancy, occupancyDiagram),
        },
        {
          PropertyUsageTypeOtherDescription: (row) => "",
        },
      ],
    },
    {
      path: [
        "PROPERTY_VALUATIONS",
        "PROPERTY_VALUATION",
        "PROPERTY_VALUATION_DETAIL",
      ],
      goBack: "root",
      nodes: [
        {
          PropertyValuationAmount: (row) => row.presentMarketValue,
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
        { CountyName: (row) => row.propertyCounty },
      ],
    },
    {
      path: ["PROPERTY_DETAIL"],
      goBack: "ASSETS",
      nodes: [
        { FinancedUnitCount: (row) => "" },
        { PropertyEstimatedValueAmount: (row) => row.homeValue },
        { PropertyUsageType: (row) => "" },
        { FHASecondaryResidenceIndicator: (row) => "" },
        {
          PropertyMixedUsageIndicator: (row) =>
            row.propertyType === "Apartment Complex" ||
            row.propertyType === "Assisted Living Facility" ||
            row.propertyType === "Commercial Lot/Land"
              ? "1"
              : "0",
        },
        {
          ConstructionMethodType: (row) =>
            loanGlobal["FileProInfo"].propConstructionMethod === "Manufactured"
              ? "1"
              : "0",
        },
        {
          ConstructionMethodTypeOtherDescription: (row) => "",
        },
      ],
    },
  ]);
}
function contingentLiabilities(doc, data, startIndex) {
  return buildMismoNodes(doc, data, "LIABILITIES", "LIABILITY", startIndex, [
    {
      path: ["LIABILITY_DETAIL"],
      nodes: [
        { LiabilityType: (row) => mapValue(row.typeOfLiability,contingentLiabilityDiagram) },
        {
          LiabilityTypeOtherDescription: (row) => row.clDescription,
        },
        {
          LiabilityAccountIdentifier: (row) => row.clAccount,
        },
        {
          LiabilityUnpaidBalanceAmount: (row) => row.clBalance,
        },
        {
          LiabilityPayoffStatusIndicator: (row) => "false",
        },
        { LiabilityMonthlyPaymentAmount: (row) => row.monthlyPayment },
        {
          LiabilityRemainingTermMonthsCount: (row) => row.monthsLeftToPay,
        },
        { LiabilityExclusionIndicator: (row) => "true" },
      ],
    },
    {
      path: ["LIABILITY_HOLDER", "NAME"],
      nodes: [{ FullName: (row) => row.nameOfCompany }],
    },
  ]);
}
function liabilities(doc, data, startIndex) {
  return buildMismoNodes(doc, data, "LIABILITIES", "LIABILITY", startIndex, [
    {
      path: ["LIABILITY_DETAIL"],
      nodes: [
        {
          LiabilityType: (row) => mapValue(row.creditorType, creditTypeDiagram),
        },
        {
          LiabilityTypeOtherDescription: (row) =>
            mapValue(row.creditorType, liabilityOtherDescriptionDiagram),
        },
        {
          LiabilityAccountIdentifier: (row) => row.creditorAcctNumber,
        },
        {
          LiabilityUnpaidBalanceAmount: (row) => row.creditorAcctBalance,
        },
        {
          LiabilityPayoffStatusIndicator: (row) => row.payAtBeforeClosing === "Yes" ? "true": "false" ,
        },
        { LiabilityMonthlyPaymentAmount: (row) => row.creditorMinPayment },
        {
          LiabilityRemainingTermMonthsCount: (row) => '',
        },
        { LiabilityExclusionIndicator: (row) => "true" },
      ],
    },
    {
      path: ["LIABILITY_HOLDER", "NAME"],
      nodes: [{ FullName: (row) => row.creditorName }],
    },
  ]);
}
function loans(doc, data, startIndex) {
  return buildMismoNodes(doc, data, "LOANS", "LOAN", startIndex, [
    {
      path: ["LOAN_IDENTIFIERS", "LOAN_IDENTIFIER"],
      nodes: [
        { LoanIdentifier: (row) => row.LMRId },
        {
          LoanIdentifierType: (row) => row.loanType,
        },
      ],
    },
    {
      path: ["CLOSING_INFORMATION", "CLOSING_INFORMATION_DETAIL"],
      nodes: [
        {
          CashFromBorrowerAtClosingAmount: (row) =>
            loanGlobal["fileLOPropInfo"].estimatedClosingCosts,
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
        {
          BorrowerRequestedLoanAmount: (row) =>
            loanGlobal["fileHMLOPropertyInfo"].requiredLoanAmount,
        },
        {
          EstimatedClosingCostsAmount: (row) =>
            loanGlobal["fileLOPropInfo"].estimatedClosingCosts,
        },
      ],
    },
    {
      path: ["URLA_TOTAL"],
      goBack: 4,
      nodes: [
        {
          URLATotalDueFromBorrowerAtClosingAmount: (row) =>
            loanGlobal["fileLOPropInfo"].estimatedClosingCosts,
        },
      ],
    },
    {
      path: ["LOAN_DETAIL"],
      nodes: [
        {
          BorrowerCount: (row) =>
            loanGlobal["LMRInfo"].isCoBorrower ? "2" : "1",
        },
      ],
    },
    {
      path: ["TERMS_OF_LOAN"],
      nodes: [
        { BaseLoanAmount: (row) => loanGlobal["ResponseInfo"].totalLoanAmount },
        { LienPriorityType: (row) => "" },
        {
          LoanPurposeType: (row) =>
            loanGlobal["fileHMLONewLoanInfo"].typeOfHMLOLoanRequesting,
        },
        {
          MortgageType: (row) => "",
        },
        { NoteAmount: (row) => "" },
        { NoteRatePercent: (row) => loanGlobal["LMRInfo"].lien1Rate },
      ],
    },
  ]);
}
function partyBorrower(doc, data) {
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
      goBack: 1,
      nodes: [
        { AddressType: (row) => "HOME" },
        {
          AddressLineText: (row) => row.previousAddress,
        },
        { AddressUnitIdentifier: (row) => "" },
        { CityName: (row) => row.previousCity },
        { StateCode: (row) => row.previousState },
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
      nodes: [
        {
          ContactPointTelephoneValue: (row) =>
            row.phoneNumber && row.phoneNumber.replace(/[^0-9]/g, ""),
        },
      ],
    },
    {
      path: ["CONTACT_POINT_DETAIL"],
      goBack: 2,
      nodes: [{ ContactPointRoleType: (row) => "HOME" }],
    },
    {
      path: ["CONTACT_POINT", "CONTACT_POINT_TELEPHONE"],
      goBack: 1,
      nodes: [
        {
          ContactPointTelephoneValue: (row) =>
            row.cellNumber && row.cellNumber.replace(/[^0-9]/g, ""),
        },
      ],
    },
    {
      path: ["CONTACT_POINT_DETAIL"],
      goBack: 2,
      nodes: [{ ContactPointRoleType: (row) => "MOBILE" }],
    },
    {
      path: ["CONTACT_POINT", "CONTACT_POINT_TELEPHONE"],
      goBack: 1,
      nodes: [
        {
          ContactPointTelephoneValue: (row) =>
            row.workNumber && row.workNumber.replace(/[^0-9]/g, ""),
        },
      ],
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
      ],
    },
    {
      path: ["ROLES", "ROLE", "BORROWER", "BORROWER_DETAIL"],
      goBack: 1,
      nodes: [
        {
          BorrowerBirthDate: (row) => row.borrowerDOB,
        },
        {
          DependentCount: (row) =>
            loanGlobal.fileHMLOInfo.agesOfDependent
              ? loanGlobal.fileHMLOInfo.agesOfDependent.split(",").length
              : loanGlobal.fileHMLOInfo.numberOfDependents,
        },
        { MaritalStatusType: (row) => row.maritalStatus },
      ],
    },
    {
      path: [
        "GOVERNMENT_MONITORING",
        "HMDA_ETHNICITY_ORIGINS",
        "HMDA_ETHNICITY_ORIGIN",
      ],
      goBack: 2,
      nodes: [
        {
          HMDAEthnicityOriginType: (row) => {
            switch (loanGlobal["QAInfo"].BEthnicity) {
              case "2":
                return "Hispanic or Latino";
              case "1":
                return "Not Hispanic or Latino";
              case "3":
                return "Not Disclosed";
              default:
                return "";
            }
          },
        },
        {
          HMDAEthnicityOriginTypeOtherDescription: (row) =>
            loanGlobal["QAInfo"].bFiEthnicitySubOther,
        },
      ],
    },
    {
      path: ["HMDA_RACES", "HMDA_RACE", "HMDA_RACE_DETAIL"],
      goBack: 3,
      nodes: [
        {
          HMDARaceType: (row) => {
            switch (loanGlobal["QAInfo"].BRace) {
              case "1":
                return "American Indian or Alaska Native";
              case "2":
                return "Asian";
              case "3":
                return "Black or African American";
              case "4":
                return "Native Hawaiian or Other Pacific Islander";
              case "5":
                return "White";
              case "6":
                return "Not Disclosed";
              default:
                return "";
            }
          },
        },
        {
          HMDARaceTypeAddtionalDescription: (row) => "",
        },
      ],
    },
    {
      path: [
        "GOVERNMENT_MONITORING_DETAIL",
        "EXTENSION",
        "OTHER",
        "ULAD:GOVERNMENT_MONITORING_DETAIL_EXTENSION",
      ],
      goBack: 4,
      comment: "extra go back to get to Borrower",
      nodes: [
        {
          "ULAD:HMDAGenderType": (row) => {
            switch (loanGlobal["QAInfo"].BGender) {
              case "1":
                return "Female";
              case "2":
                return "Male";
              case "3":
                return "Not Disclosed";
              default:
                return "";
            }
          },
        },
      ],
    },
    {
      path: ["DECLARATION", "DECLARATION_DETAIL"],
      goBack: 2,
      nodes: [
        {
          CitizenshipResidencyType: (row) =>
            mapValue(
              loanGlobal["fileHMLOInfo"].borrowerCitizenship,
              citizenshipDiagram
            ),
        },
        {
          IntentToOccupyType: (row) =>
            loanGlobal["fileHMLOBackGroundInfo"].isBorIntendToOccupyPropAsPRI,
        },
        { HomeownerPastThreeYearsType: (row) => "No" },
        { PriorPropertyUsageType: (row) => "" },
        { FHASecondaryResidenceIndicator: (row) => "No" },
        { PriorPropertyTitleType: (row) => "" },
        { UndisclosedBorrowedFundsIndicator: (row) => "No" },
        { UndisclosedBorrowedFundsAmount: (row) => "0" },
        { UndisclosedMortgageApplicationIndicator: (row) => "No" },
        { UndisclosedCreditApplicationIndicator: (row) => "No" },
        { PropertyProposedCleanEnergyLienIndicator: (row) => "No" },
        { UndisclosedComakerOfNoteIndicator: (row) => "No" },
        {
          OutstandingJudgmentsIndicator: (row) =>
            loanGlobal["fileHMLOBackGroundInfo"].isAnyBorOutstandingJudgements,
        },
        {
          PresentlyDelinquentIndicator: (row) =>
            loanGlobal["fileHMLOBackGroundInfo"].isBorPresenltyDelinquent,
        },
        {
          PartyToLawsuitIndicator: (row) =>
            loanGlobal["fileHMLOBackGroundInfo"].hasBorAnyActiveLawsuits,
        },
        { PriorPropertyDeedInLieuConveyedIndicator: (row) => "No" },
        { PriorPropertyShortSaleCompletedIndicator: (row) => "No" },
        { PriorPropertyForeclosureCompletedIndicator: (row) => "No" },
        {
          BankruptcyIndicator: (row) =>
            loanGlobal["fileHMLOBackGroundInfo"].isBorDecalredBankruptPastYears,
        },
      ],
    },
    {
      path: ["CURRENT_INCOME", "CURRENT_INCOME_DETAIL"],
      goBack: 1,
      nodes: [
        {
          URLABorrowerTotalOtherIncomeAmount: (row) => "",
        },
      ],
    },
    {
      path: [
        "CURRENT_INCOME_ITEMS",
        "CURRENT_INCOME_ITEM",
        "CURRENT_INCOME_ITEM_DETAIL",
      ],
      goBack: 2,
      nodes: [
        {
          CurrentIncomeMonthlyTotalAmount: (row) =>
            loanGlobal["incomeInfo"].grossIncome1 &&
            Math.floor(
              parseInt(
                loanGlobal["incomeInfo"].grossIncome1.replace(/,/g, "")
              ) / 12
            ),
        },
        { EmploymentIncomeIndicator: (row) => "true" },
        { IncomeType: (row) => "Base" },
      ],
    },
    {
      path: ["CURRENT_INCOME_ITEM", "CURRENT_INCOME_ITEM_DETAIL"],
      goBack: 2,
      nodes: [
        {
          CurrentIncomeMonthlyTotalAmount: (row) =>
            loanGlobal["incomeInfo"].commissionOrBonus1 &&
            Math.floor(
              parseInt(
                loanGlobal["incomeInfo"].commissionOrBonus1.replace(/,/g, "")
              ) / 12
            ),
        },
        { EmploymentIncomeIndicator: (row) => "true" },
        { IncomeType: (row) => "Bonus" },
      ],
    },
    {
      path: ["CURRENT_INCOME_ITEM", "CURRENT_INCOME_ITEM_DETAIL"],
      goBack: 2,
      nodes: [
        {
          CurrentIncomeMonthlyTotalAmount: (row) =>
            loanGlobal["incomeInfo"].otherHouseHold1 &&
            Math.floor(
              parseInt(
                loanGlobal["incomeInfo"].otherHouseHold1.replace(/,/g, "")
              ) / 12
            ),
        },
        { EmploymentIncomeIndicator: (row) => "true" },
        { IncomeType: (row) => "Other" },
      ],
    },
    {
      path: ["CURRENT_INCOME_ITEM", "CURRENT_INCOME_ITEM_DETAIL"],
      goBack: 2,
      nodes: [
        {
          CurrentIncomeMonthlyTotalAmount: (row) =>
            loanGlobal["incomeInfo"].overtime1 &&
            Math.floor(
              parseInt(loanGlobal["incomeInfo"].overtime1.replace(/,/g, "")) /
                12
            ),
        },
        { EmploymentIncomeIndicator: (row) => "true" },
        { IncomeType: (row) => "Overtime" },
      ],
    },
    {
      path: ["CURRENT_INCOME_ITEM", "CURRENT_INCOME_ITEM_DETAIL"],
      goBack: 3,
      nodes: [
        {
          CurrentIncomeMonthlyTotalAmount: (row) =>
            totalMonthlyIncome(
              [
                loanGlobal["incomeInfo"].overtime1,
                loanGlobal["incomeInfo"].otherHouseHold1,
                loanGlobal["incomeInfo"].commissionOrBonus1,
                loanGlobal["incomeInfo"].grossIncome1,
              ],
              [loanGlobal["incomeInfo"].empmonthlyincome1]
            ),
        },
        { EmploymentIncomeIndicator: (row) => "true" },
        { IncomeType: (row) => "BorrowerEstimatedTotalMonthlyIncome" },
      ],
    },
    {
      path: ["EMPLOYERS", "EMPLOYER", "ADDRESS"],
      goBack: 1,
      nodes: [
        { AddressLineText: (row) => loanGlobal["incomeInfo"].employer1Add },
        { AddressUnitIdentifier: (row) => "" },
        { CityName: (row) => "" },
        { StateCode: (row) => "" },
        { PostalCode: (row) => "" },
        { CountryCode: (row) => "USA" },
      ],
    },
    {
      path: ["EMPLOYMENT"],
      goBack: 1,
      nodes: [
        {
          EmploymentStatusType: (row) => loanGlobal["incomeInfo"].employedInfo1,
        },
        {
          EmploymentClassificationType: (row) =>
            loanGlobal["incomeInfo"].employedInfo1,
        },
        {
          EmploymentPositionDescription: (row) =>
            loanGlobal["incomeInfo"].occupation1,
        },
        {
          EmploymentStartDate: (row) =>
            loanGlobal["incomeInfo"].borrowerHireDate,
        },
        {
          EmploymentTimeInLineOfWorkMonthsCount: (row) =>
            loanGlobal["incomeInfo"].yearsAtJob1,
        },
        {
          EmploymentBorrowerSelfEmployedIndicator: (row) =>
            loanGlobal["incomeInfo"].employedInfo1 === "Self-Employed"
              ? "1"
              : "0",
        },
        {
          OwnershipInterestType: (row) =>
            mapValue(
              loanGlobal["incomeInfo"].emptypeshare1,
              ownershipInterestDiagram
            ),
        },
        {
          EmploymentMonthlyIncomeAmount: (row) =>
            loanGlobal["incomeInfo"].empmonthlyincome1,
        },
      ],
    },
  ]);
}
function partyCoBorrower(doc, data, startingIndex) {
  return buildMismoNodes(doc, data, "PARTIES", "PARTY", startingIndex, [
    {
      path: ["TAXPAYER_IDENTIFIERS", "TAXPAYER_IDENTIFIER"],
      nodes: [
        { TaxpayerIdentifierType: (row) => "SocialSecurityNumber" },
        {
          TaxpayerIdentifierValue: (row) => row.coBSsnNumber,
        },
      ],
    },
    {
      path: ["ADDRESSES", "ADDRESS"],
      goBack: 1,
      nodes: [
        { AddressType: (row) => "HOME" },
        {
          AddressLineText: (row) => loanGlobal.file2Info.coBPresentAddress,
        },
        { AddressUnitIdentifier: (row) => "" },
        { CityName: (row) => loanGlobal.file2Info.coBPresentCity },
        { StateCode: (row) => loanGlobal.file2Info.coBPresentState },
        { PostalCode: (row) => row.coBPresentZip },
        { CountryCode: (row) => "USA" },
      ],
    },
    {
      path: ["ADDRESS"],
      goBack: 1,
      nodes: [
        { AddressType: (row) => "HOME" },
        {
          AddressLineText: (row) => row.coBorPreviousAddress,
        },
        { AddressUnitIdentifier: (row) => "" },
        { CityName: (row) => row.coBorPreviousCity },
        { StateCode: (row) => row.coBorPreviousState },
        { PostalCode: (row) => row.coBorPreviousZip },
        { CountryCode: (row) => "USA" },
      ],
    },
    {
      path: ["ADDRESS"],
      goBack: 2,
      nodes: [
        { AddressType: (row) => "MAILING" },
        {
          AddressLineText: (row) => row.coBorrowerMailingAddress,
        },
        { AddressUnitIdentifier: (row) => "" },
        { CityName: (row) => row.coBorrowerMailingCity },
        { StateCode: (row) => row.coBorrowerMailingState },
        { PostalCode: (row) => row.coBorrowerMailingZip },
        { CountryCode: (row) => "USA" },
      ],
    },
    {
      path: ["INDIVIDUAL", "ALIASES", "ALIAS", "NAME"],
      goBack: 3,
      nodes: [
        { FirstName: (row) => row.coBorrowerFName },
        {
          LastName: (row) => row.coBorrowerLName,
        },
      ],
    },
    {
      path: ["CONTACT_POINTS", "CONTACT_POINT", "CONTACT_POINT_EMAIL"],
      goBack: 2,
      nodes: [{ ContactPointEmailValue: (row) => row.coBorrowerEmail }],
    },
    {
      path: ["CONTACT_POINT", "CONTACT_POINT_TELEPHONE"],
      goBack: 1,
      nodes: [
        {
          ContactPointTelephoneValue: (row) =>
            row.coBPhoneNumber && row.coBPhoneNumber.replace(/[^0-9]/g, ""),
        },
      ],
    },
    {
      path: ["CONTACT_POINT_DETAIL"],
      goBack: 2,
      nodes: [{ ContactPointRoleType: (row) => "HOME" }],
    },
    {
      path: ["CONTACT_POINT", "CONTACT_POINT_TELEPHONE"],
      goBack: 1,
      nodes: [
        {
          ContactPointTelephoneValue: (row) =>
            row.coBCellNumber && row.coBCellNumber.replace(/[^0-9]/g, ""),
        },
      ],
    },
    {
      path: ["CONTACT_POINT_DETAIL"],
      goBack: 2,
      nodes: [{ ContactPointRoleType: (row) => "MOBILE" }],
    },
    {
      path: ["CONTACT_POINT", "CONTACT_POINT_TELEPHONE"],
      goBack: 1,
      nodes: [
        {
          ContactPointTelephoneValue: (row) =>
            row.coBFax && row.coBFax.replace(/[^0-9]/g, ""),
        },
      ],
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
        { FirstName: (row) => row.coBorrowerFName },
        { LastName: (row) => row.coBorrowerLName },
      ],
    },
    {
      path: ["ROLES", "ROLE", "ROLE_DETAIL"],
      goBack: 1,
      nodes: [
        {
          PartyRoleType: (row) => "Cosigner",
        },
      ],
    },
  ]);
}
function partyBroker(doc, data, startingIndex) {
  return buildMismoNodes(doc, data, "PARTIES", "PARTY", startingIndex, [
    {
      path: ["ADDRESSES", "ADDRESS"],
      nodes: [
        { AddressType: (row) => "WORK" },
        {
          AddressLineText: (row) => row.addr,
        },
        { AddressUnitIdentifier: (row) => "" },
        { CityName: (row) => row.city },
        { StateCode: (row) => row.state },
        { PostalCode: (row) => row.zipCode },
        { CountryCode: (row) => "USA" },
      ],
    },
    {
      path: ["LEGAL_ENTITY", "LEGAL_ENTITY_DETAIL"],
      nodes: [{ FullName: (row) => row.company }],
    },
    {
      path: ["INDIVIDUAL", "NAME"],
      goBack: 1,
      nodes: [
        { FirstName: (row) => row.firstName },
        {
          LastName: (row) => row.lastName,
        },
      ],
    },
    {
      path: ["CONTACT_POINTS", "CONTACT_POINT", "CONTACT_POINT_EMAIL"],
      goBack: 1,
      nodes: [{ ContactPointEmailValue: (row) => row.email }],
    },
    {
      path: ["CONTACT_POINT", "CONTACT_POINT_TELEPHONE"],
      goBack: 5,
      nodes: [
        {
          ContactPointTelephoneValue: (row) =>
            row.phoneNumber && row.phoneNumber.replace(/[^0-9]/g, ""),
        },
      ],
    },
    {
      path: ["ROLES", "ROLE", "ROLE_DETAIL"],
      goBack: 1,
      nodes: [
        {
          PartyRoleType: (row) => "LoanOriginator",
        },
      ],
    },
    {
      path: ["LICENSES", "LICENSE", "LICENSE_DETAIL"],
      nodes: [
        {
          LicenseIdentifier: (row) => row.NMLSLicense,
          LicenseAuthorityLevelType: (row) => "Other",
        },
      ],
    },
  ]);
}
function previousEmployment(doc, data) {
  return buildMismoNodes(doc, data, "EMPLOYERS", "EMPLOYER", 0, [
    {
      path: ["ADDRESS"],
      goBack: 1,
      nodes: [
        { AddressLineText: (row) => row.addrOfEmployer },
        { AddressUnitIdentifier: (row) => "" },
        { CityName: (row) => "" },
        { StateCode: (row) => "" },
        { PostalCode: (row) => "" },
        { CountryCode: (row) => "USA" },
      ],
    },
    {
      path: ["EMPLOYMENT"],
      goBack: 1,
      nodes: [
        { EmploymentStatusType: (row) => row.employmentType },
        { EmploymentClassificationType: (row) => row.employmentType },
        { EmploymentPositionDescription: (row) => row.position },
        { EmploymentStartDate: (row) => row.employedFrom },
        { EmploymentTimeInLineOfWorkMonthsCount: (row) => "" },
        {
          EmploymentBorrowerSelfEmployedIndicator: (row) =>
            row.employmentType === "Self-Employed" ? "1" : "0",
        },
        { OwnershipInterestType: (row) => row.emptypeshare },
        { EmploymentMonthlyIncomeAmount: (row) => row.monthlyIncome },
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

const citizenshipDiagram = [
  { lw: "U.S. Citizen", mismo: "USCitizen" },
  { lw: "Perm Resident Alien", mismo: "PermanentResidentAlien" },
  { lw: "Non-Perm Resident Alien", mismo: "NonPermanentResidentAlien" },
];

const ownershipInterestDiagram = [
  { lw: "eqmorethan25", mismo: "GreaterThanOrEqualTo25Percent" },
  { lw: "lessthan25", mismo: "LessThan25Percent" },
];

const assetTypeDiagram = [
  { lw: "cd", mismo: "Certificate of Deposit" },
  { lw: "cash value of insurance", mismo: "Cash Value of Life Insurance" },
];

const occupancyDiagram = [{ lw: "", mismo: "" }];

const creditTypeDiagram = [
  { lw: "0", mismo: "Revolving" },
  { lw: "1", mismo: "Revolving" },
  { lw: "2", mismo: "Other" },
  { lw: "3", mismo: "Revolving" },
  { lw: "4", mismo: "Revolving" },
  { lw: "5", mismo: "Other" },
  { lw: "6", mismo: "Other" },
  { lw: "7", mismo: "Lease" },
  { lw: "8", mismo: "Installment" },
  { lw: "9", mismo: "Installment" },
  { lw: "10", mismo: "Other" },
  { lw: "11", mismo: "Other" },
  { lw: "12", mismo: "Other" },
  { lw: "13", mismo: "Installment" },
  { lw: "14", mismo: "Other" },
  { lw: "15", mismo: "Other" },
];

const contingentLiabilityDiagram = [
  { lw: "ProvisionforFederalIncomeTax", mismo: "Other" },
  { lw: "endorserOrCoMaker", mismo: "Other" },
  { lw: "legalClaimsJudgement", mismo: "Other" },
  { lw: "Other", mismo: "Other" },
];
const liabilityOtherDescriptionDiagram = [
  { lw: "0", mismo: "Alimony" },
  { lw: "1", mismo: "Auto Loan" },
  { lw: "2", mismo: "Business Debts" },
  { lw: "3", mismo: "Child Care" },
  { lw: "4", mismo: "Credit card" },
  { lw: "5", mismo: "IRS Tax" },
  { lw: "6", mismo: "Judgments" },
  { lw: "7", mismo: "Lease" },
  { lw: "8", mismo: "Loan on Life Insurance" },
  { lw: "9", mismo: "Medical" },
  { lw: "10", mismo: "Other" },
  { lw: "11", mismo: "Secured loans" },
  { lw: "12", mismo: "Separation Maintenance" },
  { lw: "13", mismo: "Student Loan" },
  { lw: "14", mismo: "Unpaid Property Taxes" },
  { lw: "15", mismo: "Unsecured loan" },
];

function mapValue(value, diagram) {
  if (diagram && value) {
    const mismo = diagram.find(
      (x) => x.lw.toLowerCase() === value.toLowerCase()
    );
    if (mismo) {
      return mismo.mismo;
    }
  }
  return value;
}

function totalMonthlyIncome(yearlyIncomeArray, monthlyIncomeArray) {
  let total = 0;
  yearlyIncomeArray.forEach((i) => {
    if (i) {
      total += Math.floor(parseInt(i.replace(/,/g, "")) / 12);
    }
  });

  monthlyIncomeArray.forEach((i) => {
    if (i) {
      total += parseInt(i.replace(/,/g, ""));
    }
  });

  return total;
}

module.exports = {
  assets,
  loanOwnedPropertyData,
  ownedProperty,
  collaterals,
  contingentLiabilities,
  liabilities,
  loans,
  partyBorrower,
  partyCoBorrower,
  partyBroker,
  previousEmployment,
};

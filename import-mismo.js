const adminConfig = [];

const borrowerConfig = [
  {
    selector: "#borrowerFName",
    value: (data) => data.INDIVIDUAL.NAME.FirstName,
  },
  {
    selector: "#borrowerLName",
    value: (data) => data.INDIVIDUAL.NAME.LastName,
  },
  {
    selector: "#borrowerMName",
    value: (data) => data.INDIVIDUAL.NAME.MiddleName,
  },
  {
    selector: "#borrowerDOB",
    value: (data) => {
      const dob =
        data.ROLES.ROLE.BORROWER.BORROWER_DETAIL?.BorrowerBirthDate?.split("-");

      if (dob) {
        return `${dob[1]}/${dob[2]}/${dob[0]}`;
      }
    },
  },
  {
    selector: "#ssn",
    value: (data) =>
      (data.TAXPAYER_IDENTIFIERS.TAXPAYER_IDENTIFIER.TaxpayerIdentifierType =
        "SocialSecurityNumber" &&
        data.TAXPAYER_IDENTIFIERS.TAXPAYER_IDENTIFIER.TaxpayerIdentifierValue),
  },
  {
    selector: "#borrowerEmail",
    value: (data) =>
      data.INDIVIDUAL.CONTACT_POINTS.CONTACT_POINT.find(
        (point) => point.CONTACT_POINT_EMAIL
      )?.CONTACT_POINT_EMAIL.ContactPointEmailValue,
  },
  {
    selector: "#phoneNumber",
    value: (data) =>
      data.INDIVIDUAL.CONTACT_POINTS.CONTACT_POINT.find(
        (point) =>
          point.CONTACT_POINT_TELEPHONE &&
          point.CONTACT_POINT_DETAIL?.ContactPointRoleType === "Home"
      )?.CONTACT_POINT_TELEPHONE.ContactPointTelephoneValue,
  },
  {
    selector: "#cellNo",
    value: (data) =>
      data.INDIVIDUAL.CONTACT_POINTS.CONTACT_POINT.find(
        (point) =>
          point.CONTACT_POINT_TELEPHONE &&
          point.CONTACT_POINT_DETAIL?.ContactPointRoleType === "Mobile"
      )?.CONTACT_POINT_TELEPHONE.ContactPointTelephoneValue,
  },
  {
    selector: "#workNumber",
    value: (data) =>
      data.INDIVIDUAL.CONTACT_POINTS.CONTACT_POINT.find(
        (point) =>
          point.CONTACT_POINT_TELEPHONE &&
          point.CONTACT_POINT_DETAIL?.ContactPointRoleType === "Work"
      )?.CONTACT_POINT_TELEPHONE.ContactPointTelephoneValue,
  },
  // TODO: Address check address is the current address "BorrowerResidencyType": "Current" in amazing.xml
  {
    selector: "#presentAddress",
    value: (data) =>
      data.ROLES.ROLE.BORROWER.RESIDENCES?.RESIDENCE.ADDRESS.AddressLineText,
  },
  {
    selector: "#presentCity",
    value: (data) =>
      data.ROLES.ROLE.BORROWER.RESIDENCES?.RESIDENCE.ADDRESS.CityName,
  },
  {
    selector: "#presentZip",
    value: (data) =>
      data.ROLES.ROLE.BORROWER.RESIDENCES?.RESIDENCE?.ADDRESS?.PostalCode,
  },
  {
    selector: "#presentState",
    value: (data) =>
      data.ROLES.ROLE.BORROWER.RESIDENCES?.RESIDENCE.ADDRESS.StateCode,
  },
  {
    selector: "#presentCountry",
    value: () => "US",
  },
  {
    selector: "#borPresentPropType",
    value: (data) =>
      data.ROLES.ROLE.BORROWER.RESIDENCES?.RESIDENCE.RESIDENCE_DETAIL
        .BorrowerResidencyBasisType,
  },
  {
    selector: "#presentPropLengthMonths",
    value: (data) =>
      data.ROLES.ROLE.BORROWER.RESIDENCES?.RESIDENCE.RESIDENCE_DETAIL
        .BorrowerResidencyDurationMonthsCount,
  },
  {
    selector: "#numberOfDependents",
    value: (data) => data.ROLES.ROLE.BORROWER.BORROWER_DETAIL?.DependentCount,
  },
  {
    selector: "#maritalStatus_2",
    value: (data) =>
      data.ROLES.ROLE.BORROWER.BORROWER_DETAIL?.MaritalStatusType === "Married",
  },
  {
    selector: "#maritalStatus_1",
    value: (data) =>
      data.ROLES.ROLE.BORROWER.BORROWER_DETAIL?.MaritalStatusType ===
      "Unmarried",
  },
  // Check the value in mismo standard for separated
  {
    selector: "#maritalStatus_2",
    value: (data) =>
      data.ROLES.ROLE.BORROWER.BORROWER_DETAIL?.MaritalStatusType ===
      "Separated",
  },
  // Check the value in mismo standard for permenant residence card
  {
    selector: "#borrowerCitizenship_0",
    value: (data) => {
      return (
        data.ROLES.ROLE.BORROWER.DECLARATION?.DECLARATION_DETAIL
          ?.CitizenshipResidencyType === "USCitizen"
      );
    },
  },
  {
    selector: "#isBorUSCitizenYes",
    value: (data) => {
      return (
        data.ROLES.ROLE.BORROWER.DECLARATION?.DECLARATION_DETAIL
          ?.CitizenshipResidencyType === "USCitizen"
      );
    },
  },
  {
    selector: "#isBorUSCitizenNo",
    value: (data) => {
      return (
        data.ROLES.ROLE.BORROWER.DECLARATION?.DECLARATION_DETAIL
          ?.CitizenshipResidencyType !== "USCitizen"
      );
    },
  },
  {
    selector: "#borrowerCitizenship_1",
    value: (data) => {
      return (
        data.ROLES.ROLE.BORROWER.DECLARATION?.DECLARATION_DETAIL
          ?.CitizenshipResidencyType !== "USCitizen"
      );
    },
  },
  {
    selector: "#isBorDecalredBankruptPastYearsYes",
    value: (data) => {
      return (
        data.ROLES.ROLE.BORROWER.DECLARATION?.DECLARATION_DETAIL
          ?.BankruptcyIndicator === "true"
      );
    },
  },
  {
    selector: "#isBorDecalredBankruptPastYearsNO",
    value: (data) => {
      return (
        data.ROLES.ROLE.BORROWER.DECLARATION?.DECLARATION_DETAIL
          ?.BankruptcyIndicator !== "true"
      );
    },
  },
  {
    selector: "#isAnyBorOutstandingJudgementsYes",
    value: (data) => {
      return (
        data.ROLES.ROLE.BORROWER.DECLARATION?.DECLARATION_DETAIL
          ?.OutstandingJudgmentsIndicator === "true"
      );
    },
  },
  {
    selector: "#isAnyBorOutstandingJudgementsNo",
    value: (data) => {
      return (
        data.ROLES.ROLE.BORROWER.DECLARATION?.DECLARATION_DETAIL
          ?.OutstandingJudgmentsIndicator !== "true"
      );
    },
  },
  {
    selector: "#hasBorAnyActiveLawsuitsYes",
    value: (data) => {
      return (
        data.ROLES.ROLE.BORROWER.DECLARATION?.DECLARATION_DETAIL
          ?.PartyToLawsuitIndicator === "true"
      );
    },
  },
  {
    selector: "#hasBorAnyActiveLawsuitsNo",
    value: (data) => {
      return (
        data.ROLES.ROLE.BORROWER.DECLARATION?.DECLARATION_DETAIL
          ?.PartyToLawsuitIndicator !== "true"
      );
    },
  },
  {
    selector: "#isBorPresenltyDelinquentYes",
    value: (data) => {
      return (
        data.ROLES.ROLE.BORROWER.DECLARATION?.DECLARATION_DETAIL
          ?.PresentlyDelinquentIndicator === "true"
      );
    },
  },
  {
    selector: "#isBorPresenltyDelinquentNo",
    value: (data) => {
      return (
        data.ROLES.ROLE.BORROWER.DECLARATION?.DECLARATION_DETAIL
          ?.PresentlyDelinquentIndicator !== "true"
      );
    },
  },
  {
    selector: "#borResidedPresentAddrNo",
    value: (data) => true
  },
  {
    selector: "#BRace5",
    value: (data) => data.ROLES.ROLE.BORROWER.GOVERNMENT_MONITORING.HMDA_RACES.HMDA_RACE.HMDA_RACE_DETAIL.HMDARaceType === "White",
  },
  {
    selector: "#previouslyHadShortSaleYes",
    value: (data) =>   data.ROLES.ROLE.BORROWER.DECLARATION.DECLARATION_DETAIL.PriorPropertyShortSaleCompletedIndicator === "true",
  },
  {
    selector: "#previouslyHadShortSaleNo",
    value: (data) =>   data.ROLES.ROLE.BORROWER.DECLARATION.DECLARATION_DETAIL.PriorPropertyShortSaleCompletedIndicator === "false",
  },
  {
    selector: "#hasBorBeenForeclosedYes",
    value: (data) =>   data.ROLES.ROLE.BORROWER.DECLARATION.DECLARATION_DETAIL.PriorPropertyForeclosureCompletedIndicator === "true",
  },
  {
    selector: "#hasBorBeenForeclosedNo",
    value: (data) =>   data.ROLES.ROLE.BORROWER.DECLARATION.DECLARATION_DETAIL.PriorPropertyForeclosureCompletedIndicator === "false",
  },
  {
    selector: "#grossIncome1",
    value: (data) =>   data.ROLES.ROLE.BORROWER.CURRENT_INCOME.CURRENT_INCOME_ITEMS.CURRENT_INCOME_ITEM.CURRENT_INCOME_ITEM_DETAIL.EmploymentIncomeIndicator && data.ROLES.ROLE.BORROWER.CURRENT_INCOME.CURRENT_INCOME_ITEMS.CURRENT_INCOME_ITEM.CURRENT_INCOME_ITEM_DETAIL.IncomeType === "Base" && data.ROLES.ROLE.BORROWER.CURRENT_INCOME.CURRENT_INCOME_ITEMS.CURRENT_INCOME_ITEM.CURRENT_INCOME_ITEM_DETAIL.CurrentIncomeMonthlyTotalAmount,
  },

  // "ROLES.ROLE.BORROWER.BORROWER_DETAIL.BorrowerTotalMortgagedPropertiesCount": "0",
  // "ROLES.ROLE.BORROWER.BORROWER_DETAIL.CommunityPropertyStateResidentIndicator": "false",
  // "ROLES.ROLE.BORROWER.BORROWER_DETAIL.DomesticRelationshipIndicator": "false",
  // "ROLES.ROLE.BORROWER.BORROWER_DETAIL.JointAssetLiabilityReportingType": "Jointly",
  // "ROLES.ROLE.BORROWER.DECLARATION.DECLARATION_DETAIL.HomeownerPastThreeYearsType": "No",
  // "ROLES.ROLE.BORROWER.DECLARATION.DECLARATION_DETAIL.IntentToOccupyType": "No",
  // "ROLES.ROLE.BORROWER.DECLARATION.DECLARATION_DETAIL.PriorPropertyDeedInLieuConveyedIndicator": "false",
  // "ROLES.ROLE.BORROWER.DECLARATION.DECLARATION_DETAIL.PropertyProposedCleanEnergyLienIndicator": "false",
  // "ROLES.ROLE.BORROWER.DECLARATION.DECLARATION_DETAIL.UndisclosedBorrowedFundsIndicator": "false",
  // "ROLES.ROLE.BORROWER.DECLARATION.DECLARATION_DETAIL.UndisclosedComakerOfNoteIndicator": "false",
  // "ROLES.ROLE.BORROWER.DECLARATION.DECLARATION_DETAIL.UndisclosedCreditApplicationIndicator": "false",
  // "ROLES.ROLE.BORROWER.DECLARATION.DECLARATION_DETAIL.UndisclosedMortgageApplicationIndicator": "false",
  // "ROLES.ROLE.BORROWER.DECLARATION.DECLARATION_DETAIL.EXTENSION.OTHER.ULAD:DECLARATION_DETAIL_EXTENSION.ULAD:SpecialBorrowerSellerRelationshipIndicator": "false",
  // "ROLES.ROLE.BORROWER.EMPLOYERS.EMPLOYER.LEGAL_ENTITY.CONTACTS.CONTACT.CONTACT_POINTS.CONTACT_POINT.CONTACT_POINT_TELEPHONE.ContactPointTelephoneValue": "4234523425",
  // "ROLES.ROLE.BORROWER.EMPLOYERS.EMPLOYER.LEGAL_ENTITY.CONTACTS.CONTACT.CONTACT_POINTS.CONTACT_POINT.CONTACT_POINT_DETAIL.ContactPointRoleType": "Mobile",
  // "ROLES.ROLE.BORROWER.EMPLOYERS.EMPLOYER.LEGAL_ENTITY.LEGAL_ENTITY_DETAIL.FullName": "Google",
  // "ROLES.ROLE.BORROWER.EMPLOYERS.EMPLOYER.EMPLOYMENT.EmploymentBorrowerSelfEmployedIndicator": "false",
  // "ROLES.ROLE.BORROWER.EMPLOYERS.EMPLOYER.EMPLOYMENT.EmploymentClassificationType": "Primary",
  // "ROLES.ROLE.BORROWER.EMPLOYERS.EMPLOYER.EMPLOYMENT.EmploymentPositionDescription": "VP of Customer Success",
  // "ROLES.ROLE.BORROWER.EMPLOYERS.EMPLOYER.EMPLOYMENT.EmploymentStartDate": "2009-03-29",
  // "ROLES.ROLE.BORROWER.EMPLOYERS.EMPLOYER.EMPLOYMENT.EmploymentStatusType": "Current",
  // "ROLES.ROLE.BORROWER.EMPLOYERS.EMPLOYER.EMPLOYMENT.EmploymentTimeInLineOfWorkMonthsCount": "142",
  // "ROLES.ROLE.BORROWER.GOVERNMENT_MONITORING.GOVERNMENT_MONITORING_DETAIL.HMDAEthnicityRefusalIndicator": "false",
  // "ROLES.ROLE.BORROWER.GOVERNMENT_MONITORING.GOVERNMENT_MONITORING_DETAIL.HMDAGenderRefusalIndicator": "false",
  // "ROLES.ROLE.BORROWER.GOVERNMENT_MONITORING.GOVERNMENT_MONITORING_DETAIL.HMDARaceRefusalIndicator": "false",
  // "ROLES.ROLE.BORROWER.GOVERNMENT_MONITORING.GOVERNMENT_MONITORING_DETAIL.EXTENSION.OTHER.ULAD:GOVERNMENT_MONITORING_DETAIL_EXTENSION.ULAD:HMDAGenderType": "Male",
  // "ROLES.ROLE.BORROWER.GOVERNMENT_MONITORING.HMDA_ETHNICITY_ORIGINS.HMDA_ETHNICITY_ORIGIN.HMDAEthnicityOriginType": "Cuban",

];

const assetsConfig = [
  {
    selector: "#assetSavingMoneyMarket",
    value: (data) =>
      data
        .filter((asset) => asset.ASSET_DETAIL.AssetType === "SavingsAccount")
        .reduce(
          (acc, asset) => acc + asset.ASSET_DETAIL.AssetCashOrMarketValueAmount,
          0
        ),
  },
  {
    selector: "#assetCheckingAccounts",
    value: (data) =>
      data
        .filter((asset) => asset.ASSET_DETAIL.AssetType === "CheckingAccount")
        .reduce(
          (acc, asset) => acc + asset.ASSET_DETAIL.AssetCashOrMarketValueAmount,
          0
        ),
  },
  {
    selector: "#assetIRAAccounts",
    value: (data) =>
      data
        .filter((asset) => asset.ASSET_DETAIL.AssetType === "RetirementFund")
        .reduce(
          (acc, asset) => acc + asset.ASSET_DETAIL.AssetCashOrMarketValueAmount,
          0
        ),
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

function getAssets(data) {
  return Array.isArray(data.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.ASSETS.ASSET)
    ? data.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.ASSETS.ASSET
    : [];
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

function getBorrowerParty(data) {
  // TODO: handle multiple borrowers
  return data.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.PARTIES?.PARTY.find(
    (party) => party.ROLES.ROLE.ROLE_DETAIL.PartyRoleType === "Borrower"
  );
}

function importToPage(fnmFile) {
  const json = xml2json(parseXml(fnmFile, "")).replace(/undefined/g, "");
  const lendingWiseObject = JSON.parse(json);
  localStorage.setItem("lendingWiseObject", json);

  const borrower = getBorrowerParty(lendingWiseObject);
  const assets = getAssets(lendingWiseObject);
  const liabilities = getLiabilities(lendingWiseObject);
  const collaterals = getCollaterals(lendingWiseObject);
  const loans = getLoans(lendingWiseObject);
  const parties = getParties(lendingWiseObject);

  // publishConfig(adminConfig, lendingWiseObject, true);
  publishConfig(borrowerConfig, borrower);
  // publishConfig(assetsConfig, assets);
  // publishConfig(liabilitiesConfig, liabilities);
  // publishConfig(collateralsConfig, collaterals);
  publishConfig(loansConfig, loans);
  // publishConfig(partiesConfig, parties);
}

function publishConfig(config, data, debug = false) {
  if (debug) {
    writeCode(config, data);
    return;
  }
  config.forEach((_config) => {
    const element = document.querySelector(_config.selector);
    if (!element) {
      console.log("Element not found", _config.selector);
      return;
    }
    const value = _config.value(data);
    console.log(_config.selector, value);
    if (!value) {
      return;
    }

    if (element.type === "checkbox" || element.type === "radio") {
      element.checked = value;
    } else {
      element.value = value;
    }
  });
}

// Declare an object
let ob = {
  Company: "GeeksforGeeks",
  Address: "Noida",
  contact: +91 - 999999999,
  mentor: {
    HTML: "GFG",
    CSS: "GFG",
    JavaScript: "GFG",
  },
};

function flattenObj(ob) {
  let result = {};
  for (const i in ob) {
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        result[i + "." + j] = temp[j];
      }
    } else {
      result[i] = ob[i];
    }
  }
  return result;
}

function writeCode(config, data) {
  const flattenObject = flattenObj(data);
  localStorage.setItem("flattenObject", JSON.stringify(flattenObject, null, 2));
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
          document.getElementById(input.id).value = input.id;
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}

function parseXml(xml) {
  var dom = null;
  if (window.DOMParser) {
    try {
      dom = new DOMParser().parseFromString(xml, "text/xml");
    } catch (e) {
      dom = null;
    }
  } else if (window.ActiveXObject) {
    try {
      dom = new ActiveXObject("Microsoft.XMLDOM");
      dom.async = false;
      if (!dom.loadXML(xml))
        // parse error ..

        window.alert(dom.parseError.reason + dom.parseError.srcText);
    } catch (e) {
      dom = null;
    }
  } else alert("cannot parse xml string!");
  return dom;
}

function xml2json(xml, tab) {
  var X = {
    toObj: function (xml) {
      var o = {};
      if (xml.nodeType == 1) {
        // element node ..
        if (xml.attributes.length)
          // element with attributes  ..
          for (var i = 0; i < xml.attributes.length; i++)
            o["@" + xml.attributes[i].nodeName] = (
              xml.attributes[i].nodeValue || ""
            ).toString();
        if (xml.firstChild) {
          // element has child nodes ..
          var textChild = 0,
            cdataChild = 0,
            hasElementChild = false;
          for (var n = xml.firstChild; n; n = n.nextSibling) {
            if (n.nodeType == 1) hasElementChild = true;
            else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/))
              textChild++; // non-whitespace text
            else if (n.nodeType == 4) cdataChild++; // cdata section node
          }
          if (hasElementChild) {
            if (textChild < 2 && cdataChild < 2) {
              // structured element with evtl. a single text or/and cdata node ..
              X.removeWhite(xml);
              for (var n = xml.firstChild; n; n = n.nextSibling) {
                if (n.nodeType == 3)
                  // text node
                  o["#text"] = X.escape(n.nodeValue);
                else if (n.nodeType == 4)
                  // cdata node
                  o["#cdata"] = X.escape(n.nodeValue);
                else if (o[n.nodeName]) {
                  // multiple occurence of element ..
                  if (o[n.nodeName] instanceof Array)
                    o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                  else o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                } // first occurence of element..
                else o[n.nodeName] = X.toObj(n);
              }
            } else {
              // mixed content
              if (!xml.attributes.length) o = X.escape(X.innerXml(xml));
              else o["#text"] = X.escape(X.innerXml(xml));
            }
          } else if (textChild) {
            // pure text
            if (!xml.attributes.length) o = X.escape(X.innerXml(xml));
            else o["#text"] = X.escape(X.innerXml(xml));
          } else if (cdataChild) {
            // cdata
            if (cdataChild > 1) o = X.escape(X.innerXml(xml));
            else
              for (var n = xml.firstChild; n; n = n.nextSibling)
                o["#cdata"] = X.escape(n.nodeValue);
          }
        }
        if (!xml.attributes.length && !xml.firstChild) o = null;
      } else if (xml.nodeType == 9) {
        // document.node
        o = X.toObj(xml.documentElement);
      } else alert("unhandled node type: " + xml.nodeType);
      return o;
    },
    toJson: function (o, name, ind) {
      var json = name ? '"' + name + '"' : "";
      if (o instanceof Array) {
        for (var i = 0, n = o.length; i < n; i++)
          o[i] = X.toJson(o[i], "", ind + "\t");
        json +=
          (name ? ":[" : "[") +
          (o.length > 1
            ? "\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind
            : o.join("")) +
          "]";
      } else if (o == null) json += (name && ":") + "null";
      else if (typeof o == "object") {
        var arr = [];
        for (var m in o) arr[arr.length] = X.toJson(o[m], m, ind + "\t");
        json +=
          (name ? ":{" : "{") +
          (arr.length > 1
            ? "\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind
            : arr.join("")) +
          "}";
      } else if (typeof o == "string")
        json += (name && ":") + '"' + o.toString() + '"';
      else json += (name && ":") + o.toString();
      return json;
    },
    innerXml: function (node) {
      var s = "";
      if ("innerHTML" in node) s = node.innerHTML;
      else {
        var asXml = function (n) {
          var s = "";
          if (n.nodeType == 1) {
            s += "<" + n.nodeName;
            for (var i = 0; i < n.attributes.length; i++)
              s +=
                " " +
                n.attributes[i].nodeName +
                '="' +
                (n.attributes[i].nodeValue || "").toString() +
                '"';
            if (n.firstChild) {
              s += ">";
              for (var c = n.firstChild; c; c = c.nextSibling) s += asXml(c);
              s += "</" + n.nodeName + ">";
            } else s += "/>";
          } else if (n.nodeType == 3) s += n.nodeValue;
          else if (n.nodeType == 4) s += "<![CDATA[" + n.nodeValue + "]]>";
          return s;
        };
        for (var c = node.firstChild; c; c = c.nextSibling) s += asXml(c);
      }
      return s;
    },
    escape: function (txt) {
      return txt
        .replace(/[\\]/g, "\\\\")
        .replace(/[\"]/g, '\\"')
        .replace(/[\n]/g, "\\n")
        .replace(/[\r]/g, "\\r");
    },
    removeWhite: function (e) {
      e.normalize();
      for (var n = e.firstChild; n; ) {
        if (n.nodeType == 3) {
          // text node
          if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) {
            // pure whitespace text node
            var nxt = n.nextSibling;
            e.removeChild(n);
            n = nxt;
          } else n = n.nextSibling;
        } else if (n.nodeType == 1) {
          // element node
          X.removeWhite(n);
          n = n.nextSibling;
        } // any other node
        else n = n.nextSibling;
      }
      return e;
    },
  };
  if (xml.nodeType == 9)
    // document node
    xml = xml.documentElement;
  var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
  return (
    "{\n" +
    tab +
    (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) +
    "\n}"
  );
}

bootstrap();

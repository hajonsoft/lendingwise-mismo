const adminConfig = [
  {
    selector: "#loanNumber",
    value: (data) =>
      data.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.LOANS.LOAN.LOAN_IDENTIFIERS
        .LOAN_IDENTIFIER.LoanIdentifier,
  },
];

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
    selector: "#ssn",
    value: (data) =>
      data.TAXPAYER_IDENTIFIERS.TAXPAYER_IDENTIFIER.TaxpayerIdentifierValue,
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
  // TODO: format date to lendingWise format
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
    selector: "#numberOfDependents",
    value: (data) => data.ROLES.ROLE.BORROWER.BORROWER_DETAIL?.DependentCount,
  },
  {
    selector: "#maritalStatus_2",
    value: (data) =>
      data.ROLES.ROLE.BORROWER.BORROWER_DETAIL?.MaritalStatusType === "Married",
  },
  // Check the value in mismo standard for unmarried
  {
    selector: "#maritalStatus_1",
    value: (data) =>
      data.ROLES.ROLE.BORROWER.BORROWER_DETAIL?.MaritalStatusType ===
      "UnMarried",
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
const loansConfig = [];
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
  return data.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.LOANS?.LOAN;
}

function getParties(data) {
  return data.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.PARTIES?.PARTY;
}

function getBorrower(data) {
  // TODO: handle multiple borrowers
  return data.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.PARTIES?.PARTY.find(
    (party) => party.ROLES.ROLE.ROLE_DETAIL.PartyRoleType === "Borrower"
  );
}

function importToPage(fnmFile) {
  const json = xml2json(parseXml(fnmFile, "")).replace(/undefined/g, "");
  const lendingWiseObject = JSON.parse(json);
  console.log(lendingWiseObject, "__lendingWiseObject..");

  const borrower = getBorrower(lendingWiseObject);
  const assets = getAssets(lendingWiseObject);
  const liabilities = getLiabilities(lendingWiseObject);
  const collaterals = getCollaterals(lendingWiseObject);
  const loans = getLoans(lendingWiseObject);
  const parties = getParties(lendingWiseObject);

  // publishConfig(adminConfig, lendingWiseObject);
  publishConfig(borrowerConfig, borrower);
  // publishConfig(assetsConfig, assets);
  // publishConfig(liabilitiesConfig, liabilities);
  // publishConfig(collateralsConfig, collaterals);
  // publishConfig(loansConfig, loans);
  // publishConfig(partiesConfig, parties);
}

function publishConfig(config, data) {
  writeCode(config, data);
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

function writeCode(config, data) {
  const CONFIG = [];
  document.querySelectorAll("input").forEach((input) => {
    if (input.id && !config.find((c) => c.selector === `#${input.id}`)) {
      CONFIG.push({
        selector: `#${input.id}`,
      });
    }
  });

  console.log(CONFIG, "__CONFIG..",  CONFIG.length);
  console.log(JSON.stringify(data, null, 2), "__DATA..");
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

function importToPage(fnmFile) {
  const json = xml2json(parseXml(fnmFile, '')).replace(/undefined/g, '');

  const lendingWiseObject = JSON.parse(JSON.parse(JSON.stringify(json)));

  console.log(lendingWiseObject, '__lendingWiseObject..');

  const loanNumber =
    lendingWiseObject.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.LOANS.LOAN
      .LOAN_IDENTIFIERS.LOAN_IDENTIFIER.LoanIdentifier;

  // Find the loan number element in the html page
  const loanNumberElement = document.getElementById('loanNumber');
  loanNumberElement.value = loanNumber;
}

importToPage(`<?xml version="1.0" encoding="UTF-8"?>
<MESSAGE xmlns="http://www.mismo.org/residential/2009/schemas" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ULAD="http://www.datamodelextension.org/Schema/ULAD" xmlns:DU="http://www.datamodelextension.org/Schema/DU" MISMOReferenceModelIdentifier="3.4.032420160128" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:LPA="http://www.datamodelextension.org/Schema/LPA">
	<ABOUT_VERSIONS>
		<ABOUT_VERSION>
			<AboutVersionIdentifier>S5.0.06</AboutVersionIdentifier>
			<CreatedDatetime>2021-02-07T23:39:00Z</CreatedDatetime>
			<DataVersionIdentifier>5.0.06</DataVersionIdentifier>
		</ABOUT_VERSION>
	</ABOUT_VERSIONS>
	<DEAL_SETS>
		<DEAL_SET>
			<DEALS>
				<DEAL>
					<COLLATERALS>
						<COLLATERAL SequenceNumber="1" xlink:label="COLLATERAL_1">
							<SUBJECT_PROPERTY>
								<ADDRESS>
									<CountryCode>US</CountryCode>
								</ADDRESS>
								<PROPERTY_DETAIL>
									<FinancedUnitCount>1</FinancedUnitCount>
									<PropertyEstimatedValueAmount>323322.00</PropertyEstimatedValueAmount>
									<PropertyMixedUsageIndicator>false</PropertyMixedUsageIndicator>
								</PROPERTY_DETAIL>
								<PROPERTY_VALUATIONS>
									<PROPERTY_VALUATION>
										<PROPERTY_VALUATION_DETAIL>
											<PropertyValuationAmount>0.00</PropertyValuationAmount>
										</PROPERTY_VALUATION_DETAIL>
									</PROPERTY_VALUATION>
								</PROPERTY_VALUATIONS>
								<SALES_CONTRACTS>
									<SALES_CONTRACT>
										<SALES_CONTRACT_DETAIL>
											<SalesContractAmount>0.00</SalesContractAmount>
										</SALES_CONTRACT_DETAIL>
									</SALES_CONTRACT>
								</SALES_CONTRACTS>
							</SUBJECT_PROPERTY>
						</COLLATERAL>
					</COLLATERALS>
					<LOANS>
						<LOAN LoanRoleType="SubjectLoan" xlink:label="LOAN_1">
							<DOCUMENT_SPECIFIC_DATA_SETS>
								<DOCUMENT_SPECIFIC_DATA_SET>
									<URLA>
										<URLA_DETAIL>
											<EstimatedClosingCostsAmount>0.00</EstimatedClosingCostsAmount>
										</URLA_DETAIL>
									</URLA>
								</DOCUMENT_SPECIFIC_DATA_SET>
							</DOCUMENT_SPECIFIC_DATA_SETS>
							<LOAN_DETAIL>
								<BorrowerCount>2</BorrowerCount>
							</LOAN_DETAIL>
							<LOAN_IDENTIFIERS>
								<LOAN_IDENTIFIER>
									<LoanIdentifier>6848008</LoanIdentifier>
									<LoanIdentifierType>LenderLoan</LoanIdentifierType>
								</LOAN_IDENTIFIER>
							</LOAN_IDENTIFIERS>
							<TERMS_OF_LOAN>
								<BaseLoanAmount>93203</BaseLoanAmount>
								<LoanPurposeType>Purchase</LoanPurposeType>
								<NoteRatePercent>6.00</NoteRatePercent>
							</TERMS_OF_LOAN>
						</LOAN>
					</LOANS>
					<PARTIES>
						<PARTY SequenceNumber="1" xlink:label="PARTY_1">
							<INDIVIDUAL>
								<CONTACT_POINTS>
									<CONTACT_POINT>
										<CONTACT_POINT_EMAIL>
											<ContactPointEmailValue>ksjflaka@aim.com</ContactPointEmailValue>
										</CONTACT_POINT_EMAIL>
									</CONTACT_POINT>
									<CONTACT_POINT>
										<CONTACT_POINT_TELEPHONE>
											<ContactPointTelephoneValue>4324324324</ContactPointTelephoneValue>
										</CONTACT_POINT_TELEPHONE>
										<CONTACT_POINT_DETAIL>
											<ContactPointRoleType>Mobile</ContactPointRoleType>
										</CONTACT_POINT_DETAIL>
									</CONTACT_POINT>
									<CONTACT_POINT>
										<CONTACT_POINT_TELEPHONE>
											<ContactPointTelephoneValue>9320342342</ContactPointTelephoneValue>
										</CONTACT_POINT_TELEPHONE>
										<CONTACT_POINT_DETAIL>
											<ContactPointRoleType>Home</ContactPointRoleType>
										</CONTACT_POINT_DETAIL>
									</CONTACT_POINT>
								</CONTACT_POINTS>
								<NAME>
									<FirstName>Barbara</FirstName>
									<LastName>Rodriguez</LastName>
								</NAME>
							</INDIVIDUAL>
							<ROLES>
								<ROLE SequenceNumber="1" xlink:label="BORROWER_1">
									<BORROWER>
										<BORROWER_DETAIL>
											<BorrowerBirthDate>1926-01-15</BorrowerBirthDate>
											<DependentCount>0</DependentCount>
											<MaritalStatusType>Other</MaritalStatusType>
										</BORROWER_DETAIL>
										<CURRENT_INCOME>
											<CURRENT_INCOME_ITEMS>
												<CURRENT_INCOME_ITEM SequenceNumber="1" xlink:label="CURRENT_INCOME_ITEM_1">
													<CURRENT_INCOME_ITEM_DETAIL>
														<EmploymentIncomeIndicator>true</EmploymentIncomeIndicator>
													</CURRENT_INCOME_ITEM_DETAIL>
												</CURRENT_INCOME_ITEM>
											</CURRENT_INCOME_ITEMS>
										</CURRENT_INCOME>
										<DECLARATION>
											<DECLARATION_DETAIL>
												<BankruptcyIndicator>false</BankruptcyIndicator>
												<CitizenshipResidencyType>USCitizen</CitizenshipResidencyType>
												<IntentToOccupyType>Yes</IntentToOccupyType>
												<OutstandingJudgmentsIndicator>false</OutstandingJudgmentsIndicator>
												<PartyToLawsuitIndicator>false</PartyToLawsuitIndicator>
												<PresentlyDelinquentIndicator>false</PresentlyDelinquentIndicator>
												<EXTENSION>
													<OTHER>
														<ULAD:DECLARATION_DETAIL_EXTENSION>
															<ULAD:SpecialBorrowerSellerRelationshipIndicator>false</ULAD:SpecialBorrowerSellerRelationshipIndicator>
														</ULAD:DECLARATION_DETAIL_EXTENSION>
													</OTHER>
												</EXTENSION>
											</DECLARATION_DETAIL>
										</DECLARATION>
										<EMPLOYERS>
											<EMPLOYER SequenceNumber="1" xlink:label="EMPLOYER_1">
												<EMPLOYMENT>
													<EmploymentBorrowerSelfEmployedIndicator>false</EmploymentBorrowerSelfEmployedIndicator>
													<EmploymentClassificationType>Secondary</EmploymentClassificationType>
													<EmploymentStatusType>Current</EmploymentStatusType>
													<EmploymentTimeInLineOfWorkMonthsCount>0</EmploymentTimeInLineOfWorkMonthsCount>
													<SpecialBorrowerEmployerRelationshipIndicator>false</SpecialBorrowerEmployerRelationshipIndicator>
												</EMPLOYMENT>
											</EMPLOYER>
										</EMPLOYERS>
										<GOVERNMENT_MONITORING>
											<GOVERNMENT_MONITORING_DETAIL>
												<EXTENSION>
													<OTHER>
														<ULAD:GOVERNMENT_MONITORING_DETAIL_EXTENSION>
															<ULAD:HMDAGenderType>Male</ULAD:HMDAGenderType>
														</ULAD:GOVERNMENT_MONITORING_DETAIL_EXTENSION>
													</OTHER>
												</EXTENSION>
											</GOVERNMENT_MONITORING_DETAIL>
										</GOVERNMENT_MONITORING>
										<RESIDENCES>
											<RESIDENCE>
												<ADDRESS>
													<AddressLineText>43892</AddressLineText>
													<CityName>city</CityName>
													<PostalCode>39329</PostalCode>
													<StateCode>GA</StateCode>
												</ADDRESS>
												<RESIDENCE_DETAIL>
													<BorrowerResidencyBasisType>Unknown</BorrowerResidencyBasisType>
													<BorrowerResidencyType>Prior</BorrowerResidencyType>
												</RESIDENCE_DETAIL>
											</RESIDENCE>
										</RESIDENCES>
									</BORROWER>
									<ROLE_DETAIL>
										<PartyRoleType>Borrower</PartyRoleType>
									</ROLE_DETAIL>
								</ROLE>
							</ROLES>
							<TAXPAYER_IDENTIFIERS>
								<TAXPAYER_IDENTIFIER>
									<TaxpayerIdentifierType>SocialSecurityNumber</TaxpayerIdentifierType>
									<TaxpayerIdentifierValue>032493920</TaxpayerIdentifierValue>
								</TAXPAYER_IDENTIFIER>
							</TAXPAYER_IDENTIFIERS>
						</PARTY>
						<PARTY SequenceNumber="2" xlink:label="PARTY_2">
							<INDIVIDUAL>
								<CONTACT_POINTS>
									<CONTACT_POINT>
										<CONTACT_POINT_EMAIL>
											<ContactPointEmailValue>kljaf@aim.com</ContactPointEmailValue>
										</CONTACT_POINT_EMAIL>
									</CONTACT_POINT>
									<CONTACT_POINT>
										<CONTACT_POINT_TELEPHONE>
											<ContactPointTelephoneValue>9302340320</ContactPointTelephoneValue>
										</CONTACT_POINT_TELEPHONE>
										<CONTACT_POINT_DETAIL>
											<ContactPointRoleType>Home</ContactPointRoleType>
										</CONTACT_POINT_DETAIL>
									</CONTACT_POINT>
									<CONTACT_POINT>
										<CONTACT_POINT_TELEPHONE>
											<ContactPointTelephoneValue>9230432940</ContactPointTelephoneValue>
										</CONTACT_POINT_TELEPHONE>
										<CONTACT_POINT_DETAIL>
											<ContactPointRoleType>Mobile</ContactPointRoleType>
										</CONTACT_POINT_DETAIL>
									</CONTACT_POINT>
									<CONTACT_POINT>
										<CONTACT_POINT_DETAIL>
											<ContactPointRoleType>Work</ContactPointRoleType>
										</CONTACT_POINT_DETAIL>
									</CONTACT_POINT>
								</CONTACT_POINTS>
								<NAME>
									<FirstName>John</FirstName>
									<LastName>Smith</LastName>
								</NAME>
							</INDIVIDUAL>
							<ROLES>
								<ROLE SequenceNumber="1" xlink:label="BORROWER_2">
									<BORROWER>
										<BORROWER_DETAIL>
											<BorrowerBirthDate>1926-01-06</BorrowerBirthDate>
											<DependentCount>0</DependentCount>
											<MaritalStatusType>Other</MaritalStatusType>
										</BORROWER_DETAIL>
										<CURRENT_INCOME>
											<CURRENT_INCOME_ITEMS>
												<CURRENT_INCOME_ITEM SequenceNumber="1" xlink:label="CURRENT_INCOME_ITEM_2">
													<CURRENT_INCOME_ITEM_DETAIL>
														<EmploymentIncomeIndicator>true</EmploymentIncomeIndicator>
														<IncomeType>Base</IncomeType>
													</CURRENT_INCOME_ITEM_DETAIL>
												</CURRENT_INCOME_ITEM>
											</CURRENT_INCOME_ITEMS>
										</CURRENT_INCOME>
										<DECLARATION>
											<DECLARATION_DETAIL>
												<BankruptcyIndicator>true</BankruptcyIndicator>
												<CitizenshipResidencyType>USCitizen</CitizenshipResidencyType>
												<IntentToOccupyType>Yes</IntentToOccupyType>
												<OutstandingJudgmentsIndicator>true</OutstandingJudgmentsIndicator>
												<PartyToLawsuitIndicator>true</PartyToLawsuitIndicator>
												<PresentlyDelinquentIndicator>false</PresentlyDelinquentIndicator>
											</DECLARATION_DETAIL>
										</DECLARATION>
										<EMPLOYERS>
											<EMPLOYER SequenceNumber="1" xlink:label="EMPLOYER_2">
												<EMPLOYMENT>
													<EmploymentBorrowerSelfEmployedIndicator>false</EmploymentBorrowerSelfEmployedIndicator>
													<EmploymentClassificationType>Secondary</EmploymentClassificationType>
													<EmploymentStatusType>Current</EmploymentStatusType>
													<EmploymentTimeInLineOfWorkMonthsCount>0</EmploymentTimeInLineOfWorkMonthsCount>
												</EMPLOYMENT>
											</EMPLOYER>
										</EMPLOYERS>
										<GOVERNMENT_MONITORING>
											<GOVERNMENT_MONITORING_DETAIL>
												<EXTENSION>
													<OTHER>
														<ULAD:GOVERNMENT_MONITORING_DETAIL_EXTENSION>
															<ULAD:HMDAGenderType>Male</ULAD:HMDAGenderType>
														</ULAD:GOVERNMENT_MONITORING_DETAIL_EXTENSION>
													</OTHER>
												</EXTENSION>
											</GOVERNMENT_MONITORING_DETAIL>
										</GOVERNMENT_MONITORING>
										<RESIDENCES>
											<RESIDENCE>
												<ADDRESS>
													<AddressLineText>9032 sw 29 st</AddressLineText>
													<CityName>miami</CityName>
													<PostalCode>30303</PostalCode>
													<StateCode>FL</StateCode>
												</ADDRESS>
												<RESIDENCE_DETAIL>
													<BorrowerResidencyDurationMonthsCount>0</BorrowerResidencyDurationMonthsCount>
													<BorrowerResidencyType>Current</BorrowerResidencyType>
												</RESIDENCE_DETAIL>
											</RESIDENCE>
										</RESIDENCES>
									</BORROWER>
									<ROLE_DETAIL>
										<PartyRoleType>Borrower</PartyRoleType>
									</ROLE_DETAIL>
								</ROLE>
							</ROLES>
							<TAXPAYER_IDENTIFIERS>
								<TAXPAYER_IDENTIFIER>
									<TaxpayerIdentifierType>SocialSecurityNumber</TaxpayerIdentifierType>
									<TaxpayerIdentifierValue>342432432</TaxpayerIdentifierValue>
								</TAXPAYER_IDENTIFIER>
							</TAXPAYER_IDENTIFIERS>
						</PARTY>
						<PARTY SequenceNumber="3" xlink:label="PARTY_3">
							<ROLES>
								<ROLE>
									<ROLE_DETAIL>
										<PartyRoleType>LoanOriginationCompany</PartyRoleType>
									</ROLE_DETAIL>
								</ROLE>
							</ROLES>
						</PARTY>
					</PARTIES>
					<RELATIONSHIPS xsi:type="RELATIONSHIPS">
						<RELATIONSHIP SequenceNumber="1" xlink:from="CURRENT_INCOME_ITEM_1" xlink:to="EMPLOYER_1" xlink:arcrole="urn:fdc:mismo.org:2009:residential/CURRENT_INCOME_ITEM_IsAssociatedWith_EMPLOYER"></RELATIONSHIP>
						<RELATIONSHIP SequenceNumber="2" xlink:from="CURRENT_INCOME_ITEM_2" xlink:to="EMPLOYER_2" xlink:arcrole="urn:fdc:mismo.org:2009:residential/CURRENT_INCOME_ITEM_IsAssociatedWith_EMPLOYER"></RELATIONSHIP>
						<RELATIONSHIP SequenceNumber="3" xlink:from="BORROWER_2" xlink:to="BORROWER_1" xlink:arcrole="urn:fdc:mismo.org:2009:residential/ROLE_SharesJointCreditReportWith_ROLE"></RELATIONSHIP>
					</RELATIONSHIPS>
				</DEAL>
			</DEALS>
		</DEAL_SET>
	</DEAL_SETS>
</MESSAGE>`);

function parseXml(xml) {
  var dom = null;
  if (window.DOMParser) {
    try {
      dom = new DOMParser().parseFromString(xml, 'text/xml');
    } catch (e) {
      dom = null;
    }
  } else if (window.ActiveXObject) {
    try {
      dom = new ActiveXObject('Microsoft.XMLDOM');
      dom.async = false;
      if (!dom.loadXML(xml))
        // parse error ..

        window.alert(dom.parseError.reason + dom.parseError.srcText);
    } catch (e) {
      dom = null;
    }
  } else alert('cannot parse xml string!');
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
            o['@' + xml.attributes[i].nodeName] = (
              xml.attributes[i].nodeValue || ''
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
                  o['#text'] = X.escape(n.nodeValue);
                else if (n.nodeType == 4)
                  // cdata node
                  o['#cdata'] = X.escape(n.nodeValue);
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
              else o['#text'] = X.escape(X.innerXml(xml));
            }
          } else if (textChild) {
            // pure text
            if (!xml.attributes.length) o = X.escape(X.innerXml(xml));
            else o['#text'] = X.escape(X.innerXml(xml));
          } else if (cdataChild) {
            // cdata
            if (cdataChild > 1) o = X.escape(X.innerXml(xml));
            else
              for (var n = xml.firstChild; n; n = n.nextSibling)
                o['#cdata'] = X.escape(n.nodeValue);
          }
        }
        if (!xml.attributes.length && !xml.firstChild) o = null;
      } else if (xml.nodeType == 9) {
        // document.node
        o = X.toObj(xml.documentElement);
      } else alert('unhandled node type: ' + xml.nodeType);
      return o;
    },
    toJson: function (o, name, ind) {
      var json = name ? '"' + name + '"' : '';
      if (o instanceof Array) {
        for (var i = 0, n = o.length; i < n; i++)
          o[i] = X.toJson(o[i], '', ind + '\t');
        json +=
          (name ? ':[' : '[') +
          (o.length > 1
            ? '\n' + ind + '\t' + o.join(',\n' + ind + '\t') + '\n' + ind
            : o.join('')) +
          ']';
      } else if (o == null) json += (name && ':') + 'null';
      else if (typeof o == 'object') {
        var arr = [];
        for (var m in o) arr[arr.length] = X.toJson(o[m], m, ind + '\t');
        json +=
          (name ? ':{' : '{') +
          (arr.length > 1
            ? '\n' + ind + '\t' + arr.join(',\n' + ind + '\t') + '\n' + ind
            : arr.join('')) +
          '}';
      } else if (typeof o == 'string')
        json += (name && ':') + '"' + o.toString() + '"';
      else json += (name && ':') + o.toString();
      return json;
    },
    innerXml: function (node) {
      var s = '';
      if ('innerHTML' in node) s = node.innerHTML;
      else {
        var asXml = function (n) {
          var s = '';
          if (n.nodeType == 1) {
            s += '<' + n.nodeName;
            for (var i = 0; i < n.attributes.length; i++)
              s +=
                ' ' +
                n.attributes[i].nodeName +
                '="' +
                (n.attributes[i].nodeValue || '').toString() +
                '"';
            if (n.firstChild) {
              s += '>';
              for (var c = n.firstChild; c; c = c.nextSibling) s += asXml(c);
              s += '</' + n.nodeName + '>';
            } else s += '/>';
          } else if (n.nodeType == 3) s += n.nodeValue;
          else if (n.nodeType == 4) s += '<![CDATA[' + n.nodeValue + ']]>';
          return s;
        };
        for (var c = node.firstChild; c; c = c.nextSibling) s += asXml(c);
      }
      return s;
    },
    escape: function (txt) {
      return txt
        .replace(/[\\]/g, '\\\\')
        .replace(/[\"]/g, '\\"')
        .replace(/[\n]/g, '\\n')
        .replace(/[\r]/g, '\\r');
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
  var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, '\t');
  return (
    '{\n' +
    tab +
    (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, '')) +
    '\n}'
  );
}

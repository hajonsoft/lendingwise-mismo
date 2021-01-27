# Overview

This project converts a lendingwise loan to mismo format. 

# Getting Started

Node is used to convert a lendingwise JSON object into its corresponding MISMO format. 

## Design

xmlbuilder2 npm package is used to easily create the xml. This is easier than php which I am not so experienced with. The code is then packages using browserify and then echoed inside php


# Credits

xmlbuilder2
https://oozcitak.github.io/xmlbuilder2/

Mismo specs 
https://singlefamily.fanniemae.com/media/7571/display

Lending wise staging website  
https://staging.lendingwise.com/backoffice/admin.php

Lending wise production website 
https://www.theloanpost.com/backoffice/admin.php

print_r to JSON converter  
https://www.nestforms.com/php-print_r-to-json-online

Mismo explorer 
https://modelviewers.pilotfishtechnology.com/modelviewers/MISMO/index.html?page=https%3A//modelviewers.pilotfishtechnology.com/modelviewers/MISMO/model/Format.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.PARTIES.PARTY.ROLES.ROLE.ROLE_DETAIL.PartyRoleType.html

Mixing php and javascript 
https://www.youtube.com/watch?v=-3LGsHOSTec

browserify
browserify index.js -o build/lw_mismo_converter.js

Learning resources
https://singlefamily.fanniemae.com/learning-center/uniform-residential-loan-application

print_r to array replace strings
replace to get php arry from print_r
=> (.*[^,])$
=> "$1",

=>([^,])$
=>$1"",



Pending Translations
Collaterals
                <PROPERTY_DETAIL>
                  <AttachmentType>Attached</AttachmentType>
                  <CommunityPropertyStateIndicator>false</CommunityPropertyStateIndicator>
                  <ConstructionMethodType>SiteBuilt</ConstructionMethodType>
                  <FinancedUnitCount>1</FinancedUnitCount>
                  <PropertyEstateType>FeeSimple</PropertyEstateType>
                  <PropertyEstimatedValueAmount>650000.00</PropertyEstimatedValueAmount>
                  <PropertyExistingCleanEnergyLienIndicator>false</PropertyExistingCleanEnergyLienIndicator>
                  <PropertyInProjectIndicator>false</PropertyInProjectIndicator>
                  <PropertyMixedUsageIndicator>false</PropertyMixedUsageIndicator>
                  <PropertyUsageType>Investment</PropertyUsageType>
                  <PUDIndicator>false</PUDIndicator>
                  <RentalEstimatedNetMonthlyRentAmount>0.00</RentalEstimatedNetMonthlyRentAmount>
                </PROPERTY_DETAIL>
                 <PROPERTY_VALUATIONS>
                  <PROPERTY_VALUATION>
                    <PROPERTY_VALUATION_DETAIL />
                  </PROPERTY_VALUATION>
                </PROPERTY_VALUATIONS>
                <SALES_CONTRACTS>
                  <SALES_CONTRACT>
                    <SALES_CONTRACT_DETAIL>
                      <SalesContractAmount>620000.00</SalesContractAmount>
                    </SALES_CONTRACT_DETAIL>
                  </SALES_CONTRACT>
                </SALES_CONTRACTS>

LOAN
              <HOUSING_EXPENSES>
                <HOUSING_EXPENSE>
                  <HousingExpensePaymentAmount>2367.98</HousingExpensePaymentAmount>
                  <HousingExpenseTimingType>Proposed</HousingExpenseTimingType>
                  <HousingExpenseType>FirstMortgagePrincipalAndInterest</HousingExpenseType>
                </HOUSING_EXPENSE>
                <HOUSING_EXPENSE>
                  <HousingExpensePaymentAmount>300.00</HousingExpensePaymentAmount>
                  <HousingExpenseTimingType>Proposed</HousingExpenseTimingType>
                  <HousingExpenseType>HomeownersInsurance</HousingExpenseType>
                </HOUSING_EXPENSE>
                <HOUSING_EXPENSE>
                  <HousingExpensePaymentAmount>150.00</HousingExpensePaymentAmount>
                  <HousingExpenseTimingType>Proposed</HousingExpenseTimingType>
                  <HousingExpenseType>RealEstateTax</HousingExpenseType>
                </HOUSING_EXPENSE>
              </HOUSING_EXPENSES>


                            <LOAN_PRODUCT>
                <LOAN_PRODUCT_DETAIL>
                  <DiscountPointsTotalAmount>0.00</DiscountPointsTotalAmount>
                  <ProductDescription>Non-QM Agency Plus 30 Year Fixed</ProductDescription>
                </LOAN_PRODUCT_DETAIL>
              </LOAN_PRODUCT>
              <LOAN_STATUSES>
                <LOAN_STATUS>
                  <LoanStatusIdentifier>Underwriting</LoanStatusIdentifier>
                </LOAN_STATUS>
              </LOAN_STATUSES>
              <ORIGINATION_SYSTEMS>
                <ORIGINATION_SYSTEM>
                  <LoanOriginationSystemVendorIdentifier>000112</LoanOriginationSystemVendorIdentifier>
                  <LoanOriginationSystemVersionIdentifier>LendingPadVerison</LoanOriginationSystemVersionIdentifier>
                </ORIGINATION_SYSTEM>
              </ORIGINATION_SYSTEMS>
              <PURCHASE_CREDITS />
              <QUALIFICATION />

ROLE
                    <BORROWER_DETAIL>
                      <BorrowerBirthDate>1977-07-24</BorrowerBirthDate>
                      <BorrowerTotalMortgagedPropertiesCount>0</BorrowerTotalMortgagedPropertiesCount>
                      <CommunityPropertyStateResidentIndicator>false</CommunityPropertyStateResidentIndicator>
                      <DependentCount>0</DependentCount>
                      <DomesticRelationshipIndicator>false</DomesticRelationshipIndicator>
                      <JointAssetLiabilityReportingType>Jointly</JointAssetLiabilityReportingType>
                      <MaritalStatusType>Unmarried</MaritalStatusType>
                    </BORROWER_DETAIL>                    <BORROWER_DETAIL>
                      <BorrowerBirthDate>1977-07-24</BorrowerBirthDate>
                      <BorrowerTotalMortgagedPropertiesCount>0</BorrowerTotalMortgagedPropertiesCount>
                      <CommunityPropertyStateResidentIndicator>false</CommunityPropertyStateResidentIndicator>
                      <DependentCount>0</DependentCount>
                      <DomesticRelationshipIndicator>false</DomesticRelationshipIndicator>
                      <JointAssetLiabilityReportingType>Jointly</JointAssetLiabilityReportingType>
                      <MaritalStatusType>Unmarried</MaritalStatusType>
                    </BORROWER_DETAIL>
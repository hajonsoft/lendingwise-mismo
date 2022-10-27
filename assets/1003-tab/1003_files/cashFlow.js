function calculateNetOperatingIncome(formName, targetName) {

    var totalNetOperatingIncome = 0;
    var actualRentsInPlace = vacancy = vacancyFactor = 0;
    var lessActualExpenses = 0;

    eval("actualRentsInPlace = document." + formName + ".actualRentsInPlace.value");
    eval("lessActualExpenses = document." + formName + ".lessActualExpenses.value");
    vacancy = $('#vacancy').html();

    try {
        actualRentsInPlace = replaceCommaValues(actualRentsInPlace);
        lessActualExpenses = replaceCommaValues(lessActualExpenses);
        vacancy = replaceCommaValues(vacancy);
    } catch (e) {
    }

    if (actualRentsInPlace == "") actualRentsInPlace = 0;
    if (lessActualExpenses == "") lessActualExpenses = 0;
    if (vacancy == "") vacancy = 0;

    // totalNetOperatingIncome = parseFloat(actualRentsInPlace) - parseFloat(lessActualExpenses) - parseFloat(vacancy);
    // totalNetOperatingIncome = autoNumericConverter(totalNetOperatingIncome.toFixed(2));
    //
    // try {
    //     eval("document.getElementById('" + targetName + "').innerHTML = '" + totalNetOperatingIncome + "'");
    // } catch (e) {
    // }


}

function calculateCashFlow() {
    var vacancy = actualRentsInPlace = effectiveGrossIncome = totalNetOperatingIncome = lessActualExpenses = reserves = serviceDebt = actualRentsInPlaceCommercial = waterSewer = electricity = gas = repairsMaintenance = legal = payroll = misc = tenantReimursements = managementExpense = 0;
    actualRentsInPlace = replaceCommaValues($('#actualRentsInPlace').val());
    actualRentsInPlaceCommercial = replaceCommaValues($('#actualRentsInPlaceCommercial').val());
    vacancyFactor = replaceCommaValues($('#vacancyFactor').val());
    vacancyFactorCommercial = replaceCommaValues($('#vacancyFactorCommercial').val());
    //eval("lessActualExpenses = document.loanModForm.lessActualExpenses.value");
    lessActualExpenses = replaceCommaValues($('#lessActualExpenses').val());

    waterSewer = replaceCommaValues($('#waterSewer').val());
    electricity = replaceCommaValues($('#electricity').val());
    gas = replaceCommaValues($('#gas').val());
    repairsMaintenance = replaceCommaValues($('#repairsMaintenance').val());
    legal = replaceCommaValues($('#legal').val());
    payroll = replaceCommaValues($('#payroll').val());
    misc = replaceCommaValues($('#misc').val());
    tenantReimursements = replaceCommaValues($('#tenantReimursements').val());
    managementExpense = replaceCommaValues($('#managementExpense').val());


    //waterSewer = electricity = gas = repairsMaintenance = legal = payroll = misc = tenantReimursements = managementExpense

    reserves = replaceCommaValues($('#reserves').html());

    //mirror fields
    var spcf_taxes1 = spcf_annualPremium = 0;
    spcf_taxes1 = replaceCommaValues($('#spcf_taxes1').val());
    spcf_annualPremium = replaceCommaValues($('#spcf_annualPremium').val());

    spcf_hoafees = replaceCommaValues($('#spcf_hoafees').val());

    if (vacancyFactor.trim() == '') vacancyFactor = 0;
    if (vacancyFactorCommercial.trim() == '') vacancyFactorCommercial = 0;
    if (actualRentsInPlace.trim() == '') actualRentsInPlace = 0;
    if (actualRentsInPlaceCommercial.trim() == '') actualRentsInPlaceCommercial = 0;
    if (lessActualExpenses == "") lessActualExpenses = 0;

    if (waterSewer == "") waterSewer = 0;
    if (electricity == "") electricity = 0;
    if (gas == "") gas = 0;
    if (repairsMaintenance == "") repairsMaintenance = 0;
    if (legal == '') legal = 0;
    if (payroll == '') payroll = 0;
    if (misc == '') misc = 0;
    if (tenantReimursements == '') tenantReimursements = 0;
    if (managementExpense == '') managementExpense = 0;

    //
    if (spcf_taxes1 == "") spcf_taxes1 = 0;
    if (spcf_annualPremium == "") spcf_annualPremium = 0;
    if (spcf_hoafees == "") spcf_hoafees = 0;

    vacancy = (parseFloat(actualRentsInPlace) * parseFloat(vacancyFactor)) / 100;
    vacancyCommercial = (parseFloat(actualRentsInPlaceCommercial) * parseFloat(vacancyFactorCommercial)) / 100;

    effectiveGrossIncome = parseFloat(actualRentsInPlace) + parseFloat(actualRentsInPlaceCommercial) - parseFloat(vacancy) - parseFloat(vacancyCommercial);

    totalNetOperatingIncome = parseFloat(actualRentsInPlace) + parseFloat(actualRentsInPlaceCommercial) - parseFloat(vacancy) - parseFloat(vacancyCommercial) - parseFloat(lessActualExpenses) - parseFloat(waterSewer) - parseFloat(electricity) - parseFloat(gas) - parseFloat(repairsMaintenance) - parseFloat(legal) - parseFloat(payroll) - parseFloat(misc) - parseFloat(tenantReimursements) - parseFloat(managementExpense) - parseFloat(spcf_taxes1) - parseFloat(spcf_annualPremium) - parseFloat(spcf_hoafees);

    serviceDebt = parseFloat(actualRentsInPlace) + parseFloat(actualRentsInPlaceCommercial) - parseFloat(vacancy) - parseFloat(vacancyCommercial) - parseFloat(lessActualExpenses) - parseFloat(waterSewer) - parseFloat(electricity) - parseFloat(gas) - parseFloat(repairsMaintenance) - parseFloat(legal) - parseFloat(payroll) - parseFloat(misc) - parseFloat(tenantReimursements) - parseFloat(managementExpense) - parseFloat(reserves);

    $('#vacancy').html(autoNumericConverter(vacancy.toFixed(2)));
    $('#vacancyCommercial').html(autoNumericConverter(vacancyCommercial.toFixed(2)));
    $('#effectiveGrossIncome').html(autoNumericConverter(effectiveGrossIncome.toFixed(2)));
    $('#totalNetOperatingIncome').html(autoNumericConverter(totalNetOperatingIncome.toFixed(2)));
    $('#serviceDebt').html(autoNumericConverter(serviceDebt.toFixed(2)));

    //assign values to mirror fields//
    $('#taxes1').val(autoNumericConverter(spcf_taxes1));
    $('#annualPremium').val(autoNumericConverter(spcf_annualPremium));
    //calculateHMLORealEstateTaxes(spcf_taxes1);
    //updateLoanDetail();

    calculateDebtServiceRatio();
    calculateCapRate();

}

function calculateManagementExpense() {
    effectiveGrossIncome = replaceCommaValues($('#effectiveGrossIncome').html());
    managementExpense = effectiveGrossIncome * ($('#managementExpensePercentage').val() / 100);
    $('#managementExpense').val(autoNumericConverter(managementExpense.toFixed(2)));
    calculateCashFlow();
}

function calculateManagementExpenseReverse() {
    effectiveGrossIncome = replaceCommaValues($('#effectiveGrossIncome').html());
    managementExpense = replaceCommaValues($('#managementExpense').val());
    managementExpensePercentage = (managementExpense / effectiveGrossIncome) * 100
    $('#managementExpensePercentage').val(autoNumericConverter(managementExpensePercentage.toFixed(2)));
    calculateCashFlow();
}

function calculateResidentialMonthlyAmounts() {
    rentRollMonthlyRentAmount = rentRollMonthlyRentAmountTotal = 0;
    if ($("#actualRentsInPlaceCheckbox").is(":checked")) {
        $(".unitTypeClass:input").each(function (i) {
            if ($(this).val() == 'Residential') {
                attrId = $(this).attr('id');
                rentRollMonthlyRentId = attrId.replace('unitType', 'rentRollMonthlyRent');
                rentRollMonthlyAmount = $('#' + rentRollMonthlyRentId).val();
                if (rentRollMonthlyAmount == '') {
                    rentRollMonthlyAmount = 0;
                } else {
                    rentRollMonthlyAmount = replaceCommaValues(rentRollMonthlyAmount);
                }
                rentRollMonthlyRentAmountTotal += parseFloat(rentRollMonthlyAmount);
            }
        });
        if (rentRollMonthlyRentAmountTotal > 0) {
            $('#actualRentsInPlace').attr('readonly', true);
        }
        rentRollMonthlyRentAmountTotal = rentRollMonthlyRentAmountTotal * 12;
        $('#actualRentsInPlace').val(autoNumericConverter(rentRollMonthlyRentAmountTotal.toFixed(2)));
        console.log(parseFloat(rentRollMonthlyRentAmountTotal, 2));
    } else {
        $('#actualRentsInPlace').attr('readonly', false);
    }
    calculateCashFlow();
}

function calculateCommercialMonthlyAmounts() {
    rentRollMonthlyRentAmount = rentRollMonthlyRentAmountTotal = 0;
    if ($("#actualRentsInPlaceCommercialCheckbox").is(":checked")) {
        $(".unitTypeClass:input").each(function (i) {
            if ($(this).val() == 'Commercial') {
                attrId = $(this).attr('id');
                rentRollMonthlyRentId = attrId.replace('unitType', 'rentRollMonthlyRent');
                rentRollMonthlyAmount = $('#' + rentRollMonthlyRentId).val();
                if (rentRollMonthlyAmount == '') {
                    rentRollMonthlyAmount = 0;
                } else {
                    rentRollMonthlyAmount = (replaceCommaValues(rentRollMonthlyAmount));
                }
                rentRollMonthlyRentAmountTotal += parseFloat(rentRollMonthlyAmount);
            }
        });
        if (rentRollMonthlyRentAmountTotal > 0) {
            $('#actualRentsInPlaceCommercial').attr('readonly', true);
        }
        rentRollMonthlyRentAmountTotal = rentRollMonthlyRentAmountTotal * 12;
        $('#actualRentsInPlaceCommercial').val(autoNumericConverter(rentRollMonthlyRentAmountTotal.toFixed(2)));
        console.log(parseFloat(rentRollMonthlyRentAmountTotal, 2));
    } else {
        $('#actualRentsInPlaceCommercial').attr('readonly', false);
    }
    calculateCashFlow();
}

$('.rentRollMonthlyRentClass').change(function () {
    calculateResidentialMonthlyAmounts();
    calculateCommercialMonthlyAmounts();
});


function calculateCapRate() {
    var capRate = netIncome = propertyAsIsValue = costBasis = 0;
    var capRateToolTip = '';
    propertyAsIsValue = replaceCommaValues($('#homeValue').val());
    netIncome = replaceCommaValues($('#totalNetOperatingIncome').html());
    costBasis = replaceCommaValues($('#costBasis').val());
    var typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();
    if (netIncome == "") netIncome = 0;
    if (propertyAsIsValue == "") propertyAsIsValue = 0;
    if (costBasis == "") costBasis = 0;

    if (parseFloat(netIncome) > 0 && parseFloat(propertyAsIsValue) > 0 && (typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Commercial Rate / Term Refinance')) {
        capRate = (parseFloat(netIncome) / parseFloat(propertyAsIsValue)) * 100;
        capRateToolTip = 'Cap rate = (Net Operating Income / As-Is value) *100';
    }
    if (typeOfHMLOLoanRequesting == 'Commercial Purchase' && parseFloat(netIncome) > 0 && parseFloat(costBasis) > 0) {
        capRate = (parseFloat(netIncome) / parseFloat(costBasis)) * 100;
        capRateToolTip = 'Cap Rate= (Net Operating Income / Purchase Price) *100';
    }

    if (capRateToolTip == '') capRateToolTip = 'Cap rate = (Net Operating Income / As-Is value) *100 [if transaction type=Commercial rate/term or Commercial Cash out refi]  If Transaction type= Commercial Purchase (Cap Rate= (Net Operating Income / Purchase Price) *100) ';

    $('#capRate').html(autoNumericConverter(capRate.toFixed(2)));
    $('#capRateToolTip').attr('title', capRateToolTip);
}


function calculateDebtServiceRatio() {
    var debtServiceRatio = 0;
    var Payment = 0;
    var netIncome = 0;

    Payment = getFieldsValue('lien1Payment');
    netIncome = getTextValue('totalNetOperatingIncome');            // txt - Inner text Value

    if (Payment > 0) debtServiceRatio = parseFloat(netIncome) / (parseFloat(Payment) * 12);
    debtServiceRatio = autoNumericConverter(debtServiceRatio.toFixed(2));

    try {
        $('#debtServiceRatio').html(debtServiceRatio);
    } catch (e) {
    }
}

function getReserveData() {
    var reserveValue = reserveFactor = reserves = 0;
    var reserveFactoron = $('#reserveFactoron').val();
    if (reserveFactoron == 1) {
        reserveValue = $('#addRentableSqFt').val();
    } else if (reserveFactoron == 2) {
        reserveValue = $('#noUnitsOccupied').val();
    }

    reserveFactor = $('#reserveFactor').val();

    if (reserveValue == '') reserveValue = 0;
    if (reserveFactor == '') reserveFactor = 0;

    $('#reserveValue').val(reserveValue);
    reserves = reserveFactor * reserveValue;
    $('#reserves').html(reserves);
    calculateCashFlow();
}

function mirrorRentAndunitValues() {
    reserveValue = 0;
    var reserveFactoron = $('#reserveFactoron').val();
    reserveValue = $('#reserveValue').val();
    if (reserveFactoron == 1) {
        $('#addRentableSqFt').val(reserveValue);
    } else if (reserveFactoron == 2) {
        $('#noUnitsOccupied').val(reserveValue);
    }
    getReserveData();
}

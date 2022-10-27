function updateLoanDetail(inCl) {
    var ARVCALRELEASEDATE = $('#ARVCALRELEASEDATE').val();
    var fileRecordedDate = $('#fileRecordedDate').val();

    calculateAcquisitionPriceFinanced();
    calculateCurrentLoanBalance();
    calculateAcquisitionLTV();
    //These functions are called again in the below lines 24, 28,32 // hence commentted here
    /*if (inCl != 'points') {
        calculateOriginationPointsValue();
        calculateBrokerPointsValue();
    }

    calculateTotalFeesAndCost(inCl);*/

    var autoCalcTLAARV = $('input[name=autoCalcTLAARV]:checked').val();
    if (autoCalcTLAARV == "Yes") {
        autoCalculateTotalLoanAmountARVNew(inCl);
    } else {
        calculateHMLOFeeCostTotalLoanAmount();
    }

    updateLoanCalculation();

    /**
     * Origination Points calculations
     */
    calculateOriginationPointsValue();
    /**
     * Broker Points calculations
     */
    calculateBrokerPointsValue();
    /**
     * Total Fees and Cost calculations
     */
    calculateTotalFeesAndCost(inCl);
    /*
     * Market LTV calculation.
     * ARV
     * Loan To Cost
     * Daily Interest Charge
     */


    getHMLOLoanInfoTotalMonthlyPayment();
    setDailyInterestCharge();
    dateDiffDiemDays();
    calculatePaymentReserves();
    calculateHMLONetMonthlyPayment();
    calculateDebtServiceRatio();
    calculateTotalProjectCost();
    calculateSimpleARVPercentage();
    calculateTotalCashOut();
    calculateContingencyReserve();
    calculateRequiredConstruction('loanModForm', 'requiredConstructionAmt');
    calculateTotalRequiredReserves();

    calculateTotalCashToClose('loanModForm', 'totalCashToClose');

    /* Net Lender Funds To Borrower */
    var netLenderFundsToBorrower = 0;
    var typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();
    var totalFeesAndCost = getTextValue('totalFeesAndCost');
    var thirdPartyFees = getFieldsValue('thirdPartyFees');
    var rehabCostFinanced = getTextValue('rehabCostFinanced');
    var prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }
    if (typeOfHMLOLoanRequesting == 'Line of Credit') {
        totalLoanAmount = getFieldsValue('LOCTotalLoanAmt');
    } else if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
        totalLoanAmount = getTextValue('coTotalAmt');            // txt - Inner text Value
    } else {
        totalLoanAmount = getFieldsValue('totalLoanAmount1');
    }

    totalDailyInterestCharge = 0, closingCostFinanced = 0;
    try {
        totalDailyInterestCharge = getTextValue('totalDailyInterestCharge');
    } catch (e) {
    }
    closingCostFinanced = getFieldsValue('closingCostFinanced');                 // int - Input Fields Value

    netLenderFundsToBorrower = parseFloat(totalLoanAmount) - parseFloat(totalFeesAndCost) - parseFloat(rehabCostFinanced) - parseFloat(prepaidInterestReserve);
    netLenderFundsToBorrower = autoNumericConverter(netLenderFundsToBorrower.toFixed(2));

    try {
        $('#netLenderFundsToBorrower').html(convertInputToAbsoluteValueWithDollar(netLenderFundsToBorrower));
    } catch (e) {
    }
    monthlyInterestRate(0, 0, 0);
    calculateCapRate();
    /* calculation for New TPC & LTC */
    calculationNewTPCLTC();

    //assign values to mirror fields SPCF//
    taxes1 = replaceCommaValues($('#taxes1').val());
    annualPremium = replaceCommaValues($('#annualPremium').val());

    $('#spcf_taxes1').val(autoNumericConverter(taxes1));
    $('#spcf_annualPremium').val(autoNumericConverter(annualPremium));
    calculateCashFlow();



    calculateExitAmount('');
}

function showAndHideCommercialFields(tempFldValue) {
    var activeTab = '';
    var tableRow = '';// 'table-row';
    var tableCell = '';//'table-cell';
    var tableCellEmpty = '';

    if (tempFldValue == 'Equipment Financing') {
        // $("#equipmentdiv").removeClass("secHide");
        //$("#equipmentdiv").addClass("secShow");
        $("#tab_PI").css('display', 'none');
        $("#tab_EF").css('display', 'block');
    } else {
        //$("#equipmentdiv").addClass("secHide");
        $("#tab_EF").css('display', 'none');
    }
    $("#equipmentdiv").removeClass("secShow");

    try {
        activeTab = $('#activeTab').val();
    } catch (e) {
    }

    if (activeTab == 'HMLI') {
    } else {
        var tableRow = 'block';
        var tableCell = 'block';
        var tableCellEmpty = '';
    }

    $('#isLoTxt').html('Current Loan Balance');
    $('.isBlanketLoanDiv').css("display", tableRow);
    $('.isEFBlanketLoanDiv').css("display", tableCell);
    $('.LOCTotalLoanAmtHide').css("display", tableCellEmpty);
    $('.LOCTotalLoanAmt').css("display", "none");
    //$(".HMLOTotalLoanAmt").css("background-color", "#F3F2D1");
    $('.feeSectionTotalLoanAmt').css("display", tableCell);
    $('.acquisitionLTVTD').css("display", "none");
    $('.marketLTVTD').css("display", tableCell);
    //$('.removeCls').addClass('HMLOTotalLoanAmt');
    $('.typeOfSale').css("display", "none");
    $('.landValueExtraCls').css("display", "none");
    $('.cashOutRefinanceDisp').css("display", "none");
    $('.transactionalTdFieldsNCDate').css("display", "none");
    $('.totProjectCost').html('Total Project Cost');
    $('.landValueCls').css("display", "none");

    $("#NewLTCDiv").hide();
    $("#NewTPCDiv").hide();

    if (tempFldValue == 'Commercial Purchase' || tempFldValue == 'Purchase') { //NewLTCDiv /NewTPCDiv
        $("#NewLTCDiv").css("display", tableCell);
        $("#NewTPCDiv").css("display", "block");
    } else {
        $("#NewLTCDiv").css("display", "none");
        $("#NewTPCDiv").css("display", "none");
    }

    if (tempFldValue == 'Rate & Term Refinance' || tempFldValue == 'Cash-Out / Refinance' || tempFldValue == 'Commercial Rate / Term Refinance' ||
        tempFldValue == 'Commercial Cash Out Refinance' || tempFldValue == 'Line of Credit' || tempFldValue == 'Refinance') {

        if (tempFldValue == 'Commercial Rate / Term Refinance' || tempFldValue == 'Commercial Cash Out Refinance') {

            // $('.subjectPropertySection').css("display", "block");

        } else {

            //   $('.subjectPropertySection').css("display", "none");
            //   clear_form_elements('subjectPropertySection');

        }

        if (tempFldValue == 'Commercial Rate / Term Refinance' || tempFldValue == 'Rate & Term Refinance') {

            $('.doesPropertyNeedRehabSection').css("display", "none");
            $('.doesPropertyNeedRehabDispDiv').css("display", "none");
            $('#propertyNeedRehabYes').prop('checked', false);
            $('.propertyNeedRehabinitialTddisp').css("display", "none");
            $('.contigencyCls').css("display", "none");
            $('#rehabCostFinanced').html('');
            clear_form_elements('doesPropertyNeedRehabDispDiv');
            clear_form_elements('doesPropertyNeedRehabSection');
            clear_form_elements('contigencyCls');

        } else {

            $('.doesPropertyNeedRehabSection').css("display", tableCell);
            $('.contigencyCls').css("display", tableCell);

        }

        if (tempFldValue == 'Commercial Cash Out Refinance' || tempFldValue == 'Cash-Out / Refinance' || tempFldValue == 'Rate & Term Refinance' || tempFldValue == 'Commercial Rate / Term Refinance' || tempFldValue == 'Refinance') {

            $('.cashOutDiv').css("display", tableRow);
        } else {

            $('.cashOutDiv').css("display", "none");
        }

        if (tempFldValue == 'Commercial Cash Out Refinance' || tempFldValue == 'Cash-Out / Refinance' || tempFldValue == 'Refinance') {

            $('.rehabConsCls').css("display", "");
            $('.LOCTotalLoanAmtHide').css("display", "none");
            $(".cashOutFields").css("background", "#bbe1fe");
            $('.totProjectCost').html('Total Project Value');
            // $('.marketLTVTD').css("display", "none");

            var LMRClientType = '';
            try {
                LMRClientType = $("#LMRClientType").val();
            } catch (e) {
            }

            if (LMRClientType == 'CONS') {
                $('.landValueExtraCls').css("display", tableCell);
            } else {
                $('.landValueExtraCls').css("display", "none");
            }
            $('.cashOutRefinanceDisp').css("display", tableCell);

        } else {

            $(".cashOutFields").css("background", "#bbe1fe");
            $('.rehabConsCls').css("display", "none");

        }

        if (tempFldValue == 'Line of Credit') {
            $('.feeSectionTotalLoanAmt').css("display", "none");
            clear_form_elements('commercialTdFields');
            clear_form_elements('refinanceSection');
            $('.commercialTdFields').css("display", "none");
            $('.LOCTotalLoanAmtHide').css("display", "none");
            //$('.LOCTotalLoanAmt').css("display", tableCell);
            //$('.refinanceSection').css("display", "none");
            //$('.rehabConsCls').css("display", tableRow);
            $('.lineOfCreditProp').show();
        } else {
            $('.commercialTdFields').css("display", tableCell);
            $('.refinanceSection').css("display", "block");
        }
        clear_form_elements('downPaymentField');
        clear_form_elements('commercialFields');
        clear_form_elements('commercialFieldsTD');
        clear_form_elements('commercialTdFields');
        clear_form_elements('transactionalFields');
        clear_form_elements('blanketLoanFields');

        $('.downPaymentField').css("display", "none");
        $('.cashOutRefinanceFields').css("display", tableCell);
        $('.commercialFields').css("display", "none");
        $('.commercialFieldsTD').css("display", "none");
        $('.commercialTdFields').css("display", "none");
        $('.transactionalTdFields').css("display", "none");
        $('.transactionalFields').css("display", "none");
        $('.blanketLoanFields').css("display", "none");
        $('#taxes1').attr('readonly', false);

    } else if (tempFldValue == 'Transactional') {

        clear_form_elements('commercialFields');
        clear_form_elements('commercialFieldsTD');
        clear_form_elements('commercialTdFields');
        // clear_form_elements('subjectPropertySection');
        clear_form_elements('blanketLoanFields');
        $('#rehabCostFinanced').html('');
        clear_form_elements('doesPropertyNeedRehabDispDiv');
        clear_form_elements('doesPropertyNeedRehabSection');
        clear_form_elements('cashOutRefinanceFields');
        clear_form_elements('contigencyCls');
        clear_form_elements('refinanceSection');
        clear_form_elements('cashOutDiv');
        clear_form_elements('rehabConsCls');
        clear_form_elements('isBlanketLoanDiv');
        clear_form_elements('isEFBlanketLoanDiv');
        populateDualFieldForHMLONewLoan('', 'loanModForm', 'downPayment');
        $('.downPaymentField').css("display", tableRow);
        $('.transactionalFields').css("display", tableRow);
        $('.doesPropertyNeedRehabSection').css("display", "none");
        $('.doesPropertyNeedRehabDispDiv').css("display", "none");
        $('#propertyNeedRehabYes').prop('checked', false);
        $('.propertyNeedRehabinitialTddisp').css("display", "none");
        $('.commercialFields').css("display", "none");
        $('.commercialFieldsTD').css("display", "none");
        $('.commercialTdFields').css("display", "none");
        $('.transactionalTdFields').css("display", tableCellEmpty);
        // $('.subjectPropertySection').css("display", "none");
        $('.refinanceSection').css("display", "none");
        $('.cashOutRefinanceFields').css("display", "none");
        $('.blanketLoanFields').css("display", "none");
        $('#taxes1').attr('readonly', false);
        $('.contigencyCls').css("display", "none");
        $('.cashOutDiv').css("display", "none");
        $('.rehabConsCls').css("display", "none");
        $('.isBlanketLoanDiv').css("display", "none");
        $('.isEFBlanketLoanDiv').css("display", "none");
        $(".cashOutFields").css("background-color", "#F3F2D1");
        $('#isLoTxt').html('Initial Loan Amount');

    } else {
        if (tempFldValue == 'Commercial Purchase') {
            //  $('.subjectPropertySection').css("display", "block");
        } else {
            //  clear_form_elements('subjectPropertySection');
            //  $('.subjectPropertySection').css("display", "none");
        }

        clear_form_elements('transactionalFields');
        clear_form_elements('blanketLoanFields');
        clear_form_elements('cashOutRefinanceFields');
        clear_form_elements('refinanceSection');
        clear_form_elements('cashOutDiv');
        clear_form_elements('rehabConsCls');
        $('#rehabCostFinanced').html('');
        clear_form_elements('doesPropertyNeedRehabDispDiv');
        populateDualFieldForHMLONewLoan('', 'loanModForm', 'downPayment');

        $('.commercialFields').css("display", tableRow);
        $('.commercialFieldsTD').css("display", tableCell);
        $('.transactionalFields').css("display", "none");
        $('.refinanceSection').css("display", "none");
        $('.blanketLoanFields').css("display", "none");
        $('.doesPropertyNeedRehabSection').css("display", tableCell);
        $('.cashOutRefinanceFields').css("display", "none");
        $('#taxes1').attr('readonly', false);
        $('.contigencyCls').css("display", tableCell);
        $('.cashOutDiv').css("display", "none");
        $('.rehabConsCls').css("display", "none");
        $('.marketToolTip').css("display", "block");
        $('.purchaseTPCCls').css("display", tableRow);
        $('.commercialTDFields').css("display", tableCell);
        $('.acquisitionLTVTD').css("display", tableCell);
        $('.downPaymentField').css("display", tableRow);
        $('.typeOfSale').css("display", tableRow);
        $(".cashOutFields").css("background-color", "#F3F2D1");
        $('.transactionalTdFields').css("display", tableCellEmpty);
        $('.commercialFieldsTDNew').css("display", ""); //needs to override the previous style fix for sc-31816
        /* Transaction Type = New Construction - Existing Land - PT=#159254907 */
        if (tempFldValue == 'New Construction - Existing Land') {

            $('#propertyNeedRehabYes').prop('checked', true);
            hideAndShowPropertyNeedRehab(1);
            clear_form_elements('transactionalTdFieldsNC');
            $('.transactionalTdFieldsNC').css("display", "none");
            $('.transactionalTdFieldsNCDate').css("display", tableRow);
            $('.acquisitionLTVTD').css("display", "none");
            $('.marketLTVTD').css("display", "none");
            $('.totProjectCost').html('Total Project Value');
            $('.landValueCls').css("display", "");
        } else {
            $('#propertyNeedRehabYes').prop('checked', false);
            hideAndShowPropertyNeedRehab(1);
        }
    }

    $('.autoCalcTLAARVDisp').css("display", "none");
    if (tempFldValue == 'Purchase' || tempFldValue == 'Commercial Purchase' || tempFldValue == 'Cash-Out / Refinance' || tempFldValue == 'Commercial Cash Out Refinance' || tempFldValue == 'Refinance' || tempFldValue == 'New Construction - Existing Land' ) {
        $('.autoCalcTLAARVDisp').css("display", "");
    }

    if (tempFldValue == 'Rate & Term Refinance' || tempFldValue == 'Commercial Rate / Term Refinance') {
        $('#isIntialLoanAmountDisp').hide();
        $('#isLoanPaymentAmtTLA').prop('checked', true);
        $('#isLoanPaymentAmtILA').removeAttr('checked');
    } else {
        $('#isIntialLoanAmountDisp').show();
    }

    var temprehabCon = '';
    var tempIsBlanketLoan = '';
    temprehabCon = document.loanModForm.propertyNeedRehab.value;
    tempIsBlanketLoan = document.loanModForm.isBlanketLoan.value;

    hideAndShowBlanketLoan(tempIsBlanketLoan, 'isBlanketLoan');
    hideAndShowBlanketLoan(tempIsBlanketLoan, 'isEFBlanketLoan');
    $('#maxArvPer').hide();
    $('#rehabCostPercentageFinanced').attr('readonly', false);
    updateLoanDetail();
}

function hideAndShowPropertyNeedRehab(dipOpt) {

    if (dipOpt === undefined) dipOpt = 0;   // https://www.pivotaltracker.com/story/show/161121479

    var activeTab = '';
    var tableRow = '';//'table-row';
    var tableCell = '';//table-cell';

    try {
        activeTab = $('#activeTab').val();
    } catch (e) {
    }

    if (activeTab == 'HMLI') {
    } else {
        var tableRow = 'block';
        var tableCell = 'block';
    }

    var fldValue = $('input[name=propertyNeedRehab]:checked').val();

    if (fldValue == 'Yes') {
        var rehabDefaultVal = 100;   // Set rehab default value 100 
        if ($('#setRehabDefaultVal').val() != '') rehabDefaultVal = $('#setRehabDefaultVal').val();
        if ($('#rehabCostPercentageFinanced').val() == '') {
            $('#rehabCostPercentageFinanced').val(rehabDefaultVal);
        }
        $('.doesPropertyNeedRehabDispDiv').show();
        try {
            $('.propertyNeedRehabinitialTddisp').show();
            $('.propertyNeedRehabFootageTddisp').show();
        } catch (e) {
        }
    } else {
        $('.doesPropertyNeedRehabDispDiv').css("display", "none");
        $('#propertyNeedRehabYes').prop('checked', false);
        try {
            $('.propertyNeedRehabinitialTddisp').css("display", "none");
            $('.propertyNeedRehabFootageTddisp').css("display", "none");
        } catch (e) {
        }
        clear_form_elements('doesPropertyNeedRehabDispDiv');

    }
    var isGroundChecked;
    isGroundChecked = $('input[name=isThisGroundUpConstruction]:checked').val();
    if (isGroundChecked != 'Yes') {
        $('.groundUpFields').hide();
    }
    $('#rehabCostFinanced').html('');

    if (dipOpt == 0) updateLoanDetail();
}

/* Initial Loan Amount */
function calculateAcquisitionPriceFinanced() {
    var costBasis = 0;
    var maxAmtToPutDown = 0;

    var totVal = totalLoanAmount = rehabCostFinanced = prepaidInterestReserve = closingCostFinanced = aqDownPay = aqDownPayPercentage = loanamount = 0;
    var typeOfHMLOLoanRequesting = '';

    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();
    totalLoanAmount = getFieldsValue('totalLoanAmount1');
    rehabCostFinanced = getTextValue('rehabCostFinanced');
    closingCostFinanced = getFieldsValue('closingCostFinanced');                 // int - Input Fields Value
    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }
    loanamount = getTextValue('coTotalAmt');

    costBasis = getFieldsValue('costBasis');
    maxAmtToPutDown = getFieldsValue('maxAmtToPutDown');

    /* Card 872-Make Total loan amount editable for the files whose transaction type is purchase
    * Description:- https://trello.com/c/bzIJlNef
    * On making the total lon amount as a entry field need to re-calculate the Down Payment % ,Acquisition Down Payment,Current Loan Balance
    * variable totval is initialloanamount
    * */
    if ((typeOfHMLOLoanRequesting == 'Purchase' || typeOfHMLOLoanRequesting == 'Commercial Purchase') && (totalLoanAmount != loanamount)) {
        totVal = parseFloat(totalLoanAmount) - (parseFloat(rehabCostFinanced) + parseFloat(closingCostFinanced) + parseFloat(prepaidInterestReserve));
        aqDownPay = parseFloat(costBasis) - parseFloat(totVal); //alert(aqDownPay);
        aqDownPayPercentage = (parseFloat(aqDownPay) * 100) / parseFloat(costBasis); //alert(aqDownPayPercentage);

        if (parseFloat(totVal) < parseFloat(costBasis) && parseFloat(totVal) > 0) {
            $('#acquisitionPriceFinanced').html(autoNumericConverter(totVal.toFixed(2)));
            $('#downPaymentPercentage').val(autoNumericConverter(aqDownPayPercentage));
            $('#maxAmtToPutDown').val(autoNumericConverter(aqDownPay));
            return true;
        } else {
            checkLoanTermViolation();
        }
    } else {
        totVal = parseFloat(costBasis) - parseFloat(maxAmtToPutDown);
    }
    totVal = autoNumericConverter(totVal.toFixed(2));


    try {
        $('#acquisitionPriceFinanced').html(totVal);
    } catch (e) {
    }
}


/* Acquisition LTV */
function calculateAcquisitionLTV() {
    var costBasis = 0;
    var acquisitionLTV = 0;
    var acquisitionPriceFinanced = 0;
    var closingCostFinanced = 0;
    var prepaidInterestReserve = 0;

    costBasis = getFieldsValue('costBasis');
    acquisitionPriceFinanced = getTextValue('acquisitionPriceFinanced');

    //89_CR_07_02_2019
    closingCostFinanced = getFieldsValue('closingCostFinanced');                 // int - Input Fields Value
    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }

    if (costBasis > 0) {
        //89_CR_07_02_2019
        acquisitionLTV = ((parseFloat(acquisitionPriceFinanced) + parseFloat(closingCostFinanced) + parseFloat(prepaidInterestReserve)) / parseFloat(costBasis)) * 100;
        acquisitionLTV = acquisitionLTV.toFixed(2);
    }

    try {
        $('#acquisitionLTV').html(acquisitionLTV);
    } catch (e) {
    }
}

function calculateInitialLoanAmount() {
    var acquisitionPriceFinanced = 0, rehabCostFinanced = 0, closingCostFinanced = 0, purchasePrice = 0;
    totalLoanAmount = actualToatlLoanAmt = initialLoanAmount = aqDownPay = aqDownPayPercentage = 0;
    rehabCostFinanced = getTextValue('rehabCostFinanced');
    closingCostFinanced = getFieldsValue('closingCostFinanced');                 // int - Input Fields Value
    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }
    purchasePrice = getFieldsValue('costBasis');
    totalLoanAmount = getFieldsValue('totalLoanAmount1');
    actualToatlLoanAmt = getTextValue('coTotalAmt');
    initialLoanAmount = parseFloat(totalLoanAmount) - (parseFloat(rehabCostFinanced) + parseFloat(closingCostFinanced) + parseFloat(prepaidInterestReserve));

    aqDownPay = parseFloat(purchasePrice) - parseFloat(initialLoanAmount);

    aqDownPayPercentage = (parseFloat(aqDownPay) * 100) / parseFloat(purchasePrice);

    if (parseFloat(initialLoanAmount) < parseFloat(purchasePrice) && parseFloat(initialLoanAmount) > 0) {
        $('#acquisitionPriceFinanced').html(autoNumericConverter(initialLoanAmount));
        $('#downPaymentPercentage').val(autoNumericConverter(aqDownPayPercentage));
        $('#maxAmtToPutDown').val(autoNumericConverter(aqDownPay));
    } else if (parseFloat(initialLoanAmount) < 0) {
        toastrNotification('Acquisition Down Payment should be less than  Acquisition / Purchase Price', 'error');
        $('#totalLoanAmount1').val(autoNumericConverter(actualToatlLoanAmt));
        calculateInitialLoanAmount();
    } else {
        toastrNotification('Acquisition / Purchase Price should be greater than Initial Loan Amount', 'error');
        $('#totalLoanAmount1').val(autoNumericConverter(actualToatlLoanAmt));
        calculateInitialLoanAmount();
    }
    calculateDownPaymentByPercentage();
}

$(function () { //background-color: rgb(213, 213, 213);
    $("#typeOfHMLOLoanRequesting").on('change', function () {
        if (this.value == 'Purchase' || this.value == 'Commercial Purchase') {
            $("#totalLoanAmount1").prop('readonly', false);
            $("#totalLoanAmount1").attr('style', '')
        } else {
            $("#totalLoanAmount1").prop('readonly', true);
            $("#totalLoanAmount1").attr('style', 'background-color: rgb(213, 213, 213);')

        }
    })
});


/* Total Loan Amount */
function calculateHMLOFeeCostTotalLoanAmount() {
    var acquisitionPriceFinanced = 0, rehabCostFinanced = 0, closingCostFinanced = 0, totalLoanAmount = 0;
    var typeOfHMLOLoanRequesting = 0, payOffMortgage1 = 0, payOffMortgage2 = 0, payOffOutstandingTaxes = 0;
    var payOffOtherOutstandingAmounts = 0, CORTotalLoanAmt = 0;
    var CORTotalLoanAmt = 0;
    var iIRFee = prepaidInterestReserve = 0;
    var TLAFormula = '';

    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();

    acquisitionPriceFinanced = getTextValue('acquisitionPriceFinanced');            // txt - Inner text Value
    rehabCostFinanced = getTextValue('rehabCostFinanced');
    closingCostFinanced = getFieldsValue('closingCostFinanced');                 // int - Input Fields Value
    payOffMortgage1 = getFieldsValue('payOffMortgage1');
    payOffMortgage2 = getFieldsValue('payOffMortgage2');
    payOffOutstandingTaxes = getFieldsValue('payOffOutstandingTaxes');
    CORTotalLoanAmt = getFieldsValue('CORTotalLoanAmt');
    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }

    if (typeOfHMLOLoanRequesting == 'Rate & Term Refinance' || typeOfHMLOLoanRequesting == 'Commercial Rate / Term Refinance') {
        totalLoanAmount = parseFloat(payOffMortgage1) + parseFloat(payOffMortgage2) + parseFloat(payOffOutstandingTaxes)
            + parseFloat(closingCostFinanced) + parseFloat(rehabCostFinanced);
        chkTotalLoanAmount = totalLoanAmount;
        totalLoanAmount = autoNumericConverter(totalLoanAmount.toFixed(2));
        TLAFormula = "Total Loan Amount = (Pay Off Mortgage1 +  Pay Off Mortgage2 +  Pay Off Outstanding Taxes + Closing Costs Financed + Pre-paid Interest Reserve)";
    } else if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
        totalLoanAmount = parseFloat(CORTotalLoanAmt) + parseFloat(rehabCostFinanced);
        totalLoanAmount = autoNumericConverter(totalLoanAmount.toFixed(2));
        TLAFormula = "Total Loan Amount = (Initial Loan Amount + Rehab/Construction Cost Financed + Pre-paid Interest Reserve)";
    } else if (typeOfHMLOLoanRequesting == 'New Construction - Existing Land') {
        totalLoanAmount = parseFloat(rehabCostFinanced) + parseFloat(closingCostFinanced);
        chkTotalLoanAmount = totalLoanAmount;
        totalLoanAmount = autoNumericConverter(totalLoanAmount.toFixed(2));
        TLAFormula = "Total Loan Amount = (Rehab/Construction Cost Financed + Closing Costs Financed + Pre-paid Interest Reserve)";
    } else if (typeOfHMLOLoanRequesting == 'Transactional') {
        totalLoanAmount = parseFloat(acquisitionPriceFinanced) + parseFloat(closingCostFinanced);
        chkTotalLoanAmount = totalLoanAmount;
        totalLoanAmount = autoNumericConverter(totalLoanAmount.toFixed(2));
        TLAFormula = "Total Loan Amount = (Initial Loan Amount + Closing Costs Financed + Pre-paid Interest Reserve)";
    } else if (typeOfHMLOLoanRequesting == 'Line of Credit') {
        totalLoanAmount = parseFloat(CORTotalLoanAmt) + parseFloat(acquisitionPriceFinanced) + parseFloat(rehabCostFinanced) + parseFloat(closingCostFinanced);
        chkTotalLoanAmount = totalLoanAmount;
        totalLoanAmount = autoNumericConverter(totalLoanAmount.toFixed(2));
    } else {
        totalLoanAmount = parseFloat(acquisitionPriceFinanced) + parseFloat(rehabCostFinanced) + parseFloat(closingCostFinanced);
        chkTotalLoanAmount = totalLoanAmount;
        totalLoanAmount = autoNumericConverter(totalLoanAmount.toFixed(2));
        TLAFormula = "Total Loan Amount = (Initial Loan Amount + Rehab/Construction Cost Financed + Closing Costs Financed + Pre-paid Interest Reserve)";
    }
    totalLoanAmount = replaceCommaValues(totalLoanAmount);
    totalLoanAmount = parseFloat(totalLoanAmount) + parseFloat(prepaidInterestReserve);
    totalLoanAmount = autoNumericConverter(totalLoanAmount.toFixed(2));

    if (typeOfHMLOLoanRequesting == 'Line of Credit') {
        try {
            $('#LOCTotalLoanAmt').val(totalLoanAmount);
        } catch (e) {
        }
    }

    try {
        $('#totalLoanAmount1').val(totalLoanAmount);
    } catch (e) {
    }

    $('.totalLoanAmount').html(totalLoanAmount);

    $('#tLAToolTip').attr('title', TLAFormula);

}

/* Calculate ARV */
function updateLoanCalculation() {
    var totalLoanAmount = 0, netLenderFundsToBorrower = 0, homeValue = 0;
    var assessedValue = 0;
    var ARV = 0;
    var typeOfHMLOLoanRequesting = '';
    var marketLTVFormula = '';
    var marketLTV = totalProjectCost = lien1Rate = totalDailyInterestCharge = rehabCostFinanced = 0;
    var diemDays = rehabCost = '';
    var closingCostFinanced = 0;
    var prepaidInterestReserve = 0;

    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();
    assessedValue = getFieldsValue('assessedValue');
    homeValue = getFieldsValue('homeValue');
    acquisitionPriceFinanced = getTextValue('acquisitionPriceFinanced');
    totalProjectCost = getTextValue('totalProjectCost');
    lien1Rate = getFieldsValue('lien1Rate');
    diemDays = getTextValue('diemDays');
    rehabCostFinanced = getTextValue('rehabCostFinanced');
    rehabCost = getFieldsValue('rehabCost');
    closingCostFinanced = getFieldsValue('closingCostFinanced');
    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }

    if (typeOfHMLOLoanRequesting == 'Line of Credit') {
        totalLoanAmount = getFieldsValue('LOCTotalLoanAmt');

    } else if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
        totalLoanAmount = getTextValue('coTotalAmt');            // txt - Inner text Value

    } else {
        totalLoanAmount = getFieldsValue('totalLoanAmount1');
    }

    /* ARV */
    if (assessedValue > 0) {
        ARV = (parseFloat(totalLoanAmount) / parseFloat(assessedValue)) * 100;
    }

    try {
        $('#ARV').html(autoNumericConverter(ARV.toFixed(2)));
    } catch (e) {
    }

    /* Market LTV Calculation */
    if (typeOfHMLOLoanRequesting == 'Rate & Term Refinance' || typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Rate / Term Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Line of Credit' || typeOfHMLOLoanRequesting == 'New Construction - Existing Land' || typeOfHMLOLoanRequesting == 'Refinance') {
        if (homeValue > 0) {
            marketLTV = (parseFloat(totalLoanAmount) / parseFloat(homeValue)) * 100;
        }
        marketLTVFormula = "Market LTV = (Total Loan Amount / Property Value(As-Is)) * 100<hr>This is a percentage of your loan to values based off the market value,  not the purchase price.";
    } else {
        if (homeValue > 0) {

            //89_CR_07_02_2019
            marketLTV = ((parseFloat(acquisitionPriceFinanced) + parseFloat(closingCostFinanced) + parseFloat(prepaidInterestReserve)) / parseFloat(homeValue)) * 100;
        }
        marketLTVFormula = "Market LTV = (Initial Loan Amount / Assessed As-is Value) * 100<hr>This is a percentage of your loan to values based off the market value, not the purchase price.";
    }
    $('#marketLTVToolTip').attr('title', marketLTVFormula);

    try {
        $('#marketLTV').html(marketLTV.toFixed(2));
    } catch (e) {
    }


    /* Loan To Cost */
    if (totalProjectCost > 0) {
        LTC = (parseFloat(totalLoanAmount) / parseFloat(totalProjectCost)) * 100;
        LTC = LTC.toFixed(2);
    }

    //setDailyInterestCharge

    try {
        $('#Loan-to-Cost').html(LTC);
    } catch (e) {
    }

    if (rehabCost > 0) {
        perRehabCostFinanced = (parseFloat(rehabCostFinanced) / parseFloat(rehabCost)) * 100;
        perRehabCostFinanced = perRehabCostFinanced.toFixed(2);
    }
    try {
        $('#perRehabCostFinanced').html(perRehabCostFinanced);
    } catch (e) {

    }
    /* ARV */
    if (assessedValue > 0) {
        ARV = (parseFloat(totalLoanAmount) / parseFloat(assessedValue)) * 100;
    }

    try {
        $('#ARV').html(autoNumericConverter(ARV.toFixed(2)));
    } catch (e) {
    }

}
function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function setDailyInterestCharge(){
    var typeOfHMLOLoanRequesting = '';
    /* Daily Interest Charge */
    lien1Rate = getFieldsValue('lien1Rate');
    lien1Terms = $('#lien1Terms').val();
    loanPaymentBased = $('input[name=isLoanPaymentAmt]:checked').val();

    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();

    if (typeOfHMLOLoanRequesting == 'Line of Credit') {
        totalLoanAmount = getFieldsValue('LOCTotalLoanAmt');
    } else if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
        totalLoanAmount = getTextValue('coTotalAmt');            // txt - Inner text Value
    } else {
        totalLoanAmount = getFieldsValue('totalLoanAmount1');
    }
    tttext = '';
    if (lien1Rate > 0) {
        var _Y = 30;
        if($('#purchaseCloseDate').is(":visible")) {
            _cDM = $('#purchaseCloseDate').val(); //Closing Date Month
            if(_cDM !='') {
                _cDMArray = _cDM.split('/');
                _Y = getDaysInMonth(_cDMArray[2],_cDMArray[0]);
            }
        }

        var _Z = 360;
        var _X = 30;
        if($('#accrualType').is(":visible")) {
            _accrualType = $('#accrualType').val();
            if(_accrualType == "Actual/360") {
                _Z = 360;
                _X = _Y;
            }
            if(_accrualType == "365") {
                _Z = 365;
                _X = _Y;
            }
            if(_accrualType == "360") {
                _Z = 360;
                _X = 30;
            }
        }
        if (lien1Terms == 'Interest Only') {
            if (loanPaymentBased == 'ILA') {
                totalLoanAmount = getTextValue('currentLoanBalance');
                totalDailyInterestCharge =    ((parseFloat(lien1Rate)/100) / _Z) * totalLoanAmount;
                tttext = "Per Diem Interest = (((Int. Rate/100)/"+ _Z +")* Current Loan Balance ) = " + totalDailyInterestCharge;
            } else if(loanPaymentBased == 'TLA'){
                totalLoanAmount = getFieldsValue('totalLoanAmount1');
                totalDailyInterestCharge =    ((parseFloat(lien1Rate)/100) / _Z) * totalLoanAmount;
                tttext = "Per Diem Interest = (((Int. Rate/100)/"+ _Z +")* Total Loan Amount ) = " + totalDailyInterestCharge;
            }
        } else {
            var amtBasedOnPayment = '';
            if ($('#isLoanPaymentAmtILA').is(':checked')) {
                amtBasedOnPayment = getTextValue('currentLoanBalance');
            }
            if ($('#isLoanPaymentAmtTLA').is(':checked')) {
                amtBasedOnPayment = totalLoanAmount;
            }
            lien1Payment = getFieldsValue('lien1Payment');
            totalDailyInterestCharge = parseFloat(amtBasedOnPayment) * (((parseFloat(lien1Rate) / 100) / 12) / 30);
            tttext = "Per Diem Interest = (Total Loan Amount * (((Int. Rate/100)/12)/30)) = " + totalDailyInterestCharge;
        }
        try {
            $('#totalDailyInterestCharge').html(autoNumericConverter(totalDailyInterestCharge));
            $('#totalDailyInterestChargeDummy').html(autoNumericConverter(totalDailyInterestCharge.toFixed(2)));
        } catch (e) {
        }
    }

    if (tttext != '') {
        $('#perDiemToolTip').tooltip('hide').attr('data-original-title', tttext);
    }
}

function getHMLOLoanInfoTotalMonthlyPayment() {
    var totalLoanAmount = 0, lien1Rate = 0, totalMonthlyPayment = 0, tempTotal = 0;
    var lien1Terms = '', term = 12;
    var isEF = 0;
    var loanPaymentBased = '';
    var initialLoanAmount = 0

    loanPaymentBased = $('input[name=isLoanPaymentAmt]:checked').val();

    var _Y = 30;
    if($('#purchaseCloseDate').is(":visible")) {
        _cDM = $('#purchaseCloseDate').val(); //Closing Date Month
        if(_cDM !='') {
            _cDMArray = _cDM.split('/');
            _Y = getDaysInMonth(_cDMArray[2],_cDMArray[0]);
        }
    }

    var _Z = 360;
    var _X = 30;
    if($('#accrualType').is(":visible")) {
        _accrualType = $('#accrualType').val();
        if(_accrualType == "Actual/360") {
            _Z = 360;
            _X = _Y;
        }
        if(_accrualType == "365") {
            _Z = 365;
            _X = _Y;
        }
        if(_accrualType == "360") {
            _Z = 360;
            _X = 30;
        }
        // if(_accrualType == "Actual/360" || _accrualType == "365") {
        //     _X = _Y;
        // }
    }
    try {
        isEF = $('#isEF').val();
    } catch (e) {
    }

    try {
        lien1Terms = $('#lien1Terms').val();
    } catch (e) {
    }

    lien1Rate = getFieldsValue('lien1Rate');

    var typeOfHMLOLoanRequesting = '';
    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();

    // console.log('CORTotalLoanAmt '+getFieldsValue('CORTotalLoanAmt'));
    // console.log('acquisitionPriceFinanced '+getFieldsValue('acquisitionPriceFinanced'));
    // console.log('currentLoanBalance '+getFieldsValue('currentLoanBalance'));

    if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' ||
        typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' ||
        typeOfHMLOLoanRequesting == 'Refinance') {
        initialLoanAmount = getFieldsValue('CORTotalLoanAmt');
    } else if (typeOfHMLOLoanRequesting == 'Transactional') {
        initialLoanAmount = getTextValue('acquisitionPriceFinanced');
    } else {
        initialLoanAmount = getTextValue('currentLoanBalance');
    }

    // console.log('LOCTotalLoanAmt '+getFieldsValue('LOCTotalLoanAmt'));
    // console.log('totalLoanAmount '+$('.totalLoanAmount').html());
    // console.log('currentLoanBalance '+getFieldsValue('totalLoanAmount1'));

    if (typeOfHMLOLoanRequesting == 'Line of Credit') {
        totalLoanAmount = getFieldsValue('LOCTotalLoanAmt');
    } else if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' ||
        typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' ||
        typeOfHMLOLoanRequesting == 'Refinance') {
        totalLoanAmount = $('.totalLoanAmount').html();
        totalLoanAmount = replaceCommaValues(totalLoanAmount);
    } else {
        totalLoanAmount = getFieldsValue('totalLoanAmount1');
    }

    if (loanPaymentBased == 'ILA') {
        totalLoanAmount = getTextValue('currentLoanBalance');
    }
    if (typeOfHMLOLoanRequesting == 'Transactional') {
        totalLoanAmount = initialLoanAmount;
    }

    //console.log(totalLoanAmount);
    if (lien1Terms == 'Interest Only') {
      //  tempTotal = eval(parseFloat(totalLoanAmount) * parseFloat(lien1Rate));
       // amt = tempTotal / 1200;
        _monthlyPaymentPart1 =   (((lien1Rate/100) / _Z) * _X) ;
        if (loanPaymentBased == 'ILA' || loanPaymentBased == 'TLA') {
            //_currentLoanBalance = getTextValue('currentLoanBalance');
            amt = parseFloat(_monthlyPaymentPart1) * parseFloat(totalLoanAmount);
        }
    } else {

        try {
            pos = lien1Terms.indexOf(" ");
            lien1Terms = lien1Terms.substring(0, pos);
            lien1Terms = parseInt(lien1Terms);
        } catch (e) {
        }
        if (lien1Terms != "") {
            if (lien1Terms > 0) {
                term = lien1Terms * 12;
            }
            if ((totalLoanAmount > 0) && (lien1Rate > 0)) {
                var amt = calculateAmoritizationValue(totalLoanAmount, lien1Rate, term);
            } else {
                amt = "";
            }
        } else {
            amt = "";
        }
    }

    if (loanPaymentBased != 'SMP') {
        try {
            $('#lien1Payment').val(autoNumericConverter(amt.toFixed(2)));
        } catch (e) {
        }
    }

    if (loanPaymentBased == 'SMP') {
        $('#lien1Terms option:selected').removeAttr('selected');
        $('#lien1Terms').val('');
        $('#lien1Terms').attr('disabled', 'disabled');
    } else {
        $('#lien1Terms').attr('disabled', false);
        if ($('#lien1Terms').val() == '') {
            $('#lien1Terms').val('Interest Only');
            getHMLOLoanInfoTotalMonthlyPayment();
            // tempTotal = eval(parseFloat(totalLoanAmount) * parseFloat(lien1Rate));
            // amt = tempTotal / 1200;
            // $('#lien1Payment').val(autoNumericConverter(amt.toFixed(2)));
        }

    }
}

/**

 ** Description : Required Reserves Section Calculation Methods
 ** Developer    : Venkatesh
 ** Date         : Oct 12, 2017

 **/

function calculatePaymentReserves() {
    var paymentReserves = 0;
    var lien1Payment = 0;
    var paymentReservesAmt = 0;

    lien1Payment = getFieldsValue('lien1Payment');
    paymentReserves = getFieldsValue('paymentReserves');
    if (paymentReserves > 0) {
        paymentReservesAmt = parseFloat(lien1Payment) * parseFloat(paymentReserves);
        paymentReservesAmt = autoNumericConverter(paymentReservesAmt.toFixed(2));
    }
    try {
        $('#paymentReservesAmt').html(paymentReservesAmt);
    } catch (e) {
    }
}

function calculateHMLONetMonthlyPayment() {
    var netMonthlyPayment = 0;
    var Payment = 0;
    var taxes1 = 0;
    var annualPremium = 0;

    Payment = getFieldsValue('lien1Payment');
    taxes1 = getFieldsValue('taxes1');
    annualPremium = getFieldsValue('annualPremium');

    netMonthlyPayment = parseFloat(Payment) + (parseFloat(taxes1) / 12) + (parseFloat(annualPremium) / 12);
    netMonthlyPayment = autoNumericConverter(netMonthlyPayment.toFixed(2));

    try {
        $('#netMonthlyPayment').html(netMonthlyPayment);
    } catch (e) {
    }

}

function calculateTotalRequiredReserves() {
    var paymentReservesAmt = 0;
    var requiredConstructionAmt = 0;
    var totalRequiredReserves = 0;
    var contingencyReserveAmt = 0;

    paymentReservesAmt = getTextValue('paymentReservesAmt');
    requiredConstructionAmt = getTextValue('requiredConstructionAmt');
    contingencyReserveAmt = getTextValue('contingencyReserveAmt');

    totalRequiredReserves = parseFloat(paymentReservesAmt) + parseFloat(requiredConstructionAmt) + parseFloat(contingencyReserveAmt);

    totalRequiredReserves = autoNumericConverter(totalRequiredReserves.toFixed(2));

    try {
        $('#totalRequiredReserves').html(totalRequiredReserves);
    } catch (e) {
    }
}

function calculateTotalProjectCost() {
    var rehabCost = 0;
    var totalProjectCost = 0;
    var costBasis = 0;
    var TPCFormula = '';
    var assessedValue = 0;
    var typeOfHMLOLoanRequesting = '';
    var closingCostFinanced = 0;
    var prepaidInterestReserve = 0;
    var totalLoanAmount = 0;
    var LTC = 0;
    var costSpent = 0;

    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();
    rehabCost = getFieldsValue('rehabCost');
    assessedValue = getFieldsValue('homeValue');
    costBasis = getFieldsValue('costBasis');
    closingCostFinanced = getFieldsValue('closingCostFinanced');
    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }
    costSpent = getFieldsValue('costSpent');

    if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Rate / Term Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'New Construction - Existing Land' || typeOfHMLOLoanRequesting == 'Refinance') {
        totalProjectCost = parseFloat(assessedValue) + parseFloat(rehabCost) + parseFloat(costSpent);
        TPCFormula = "Total Project Value = (Property Value(As-Is) + Rehab/Construction Cost + Cost Spent)";
        LTCFormula = "Loan-to-Cost (LTC) =  (Total Loan Amount / Project Value) * 100<hr>Loan-to-Cost Ratio (LTC) A ratio used in commercial real estate construction to compare the amount of the loan used to finance a project to the cost to build the project. If the project costs $1 million to complete and the borrower borrows $700,000, the loan-to-cost (LTC) ratio would be 70%.";

    } else if (typeOfHMLOLoanRequesting == 'Line of Credit') {

        totalProjectCost = parseFloat(rehabCost) + parseFloat(closingCostFinanced) + parseFloat(costSpent);
        TPCFormula = "Total Project Cost = (Rehab/Construction Cost + Cost Spent)";
        LTCFormula = "Loan-to-Cost (LTC) =  (Total Loan Amount / Project Cost) * 100<hr>Loan-to-Cost Ratio (LTC) A ratio used in commercial real estate construction to compare the amount of the loan used to finance a project to the cost to build the project. If the project costs $1 million to complete and the borrower borrows $700,000, the loan-to-cost (LTC) ratio would be 70%.";
    } else {

        totalProjectCost = parseFloat(costBasis) + parseFloat(rehabCost) + parseFloat(costSpent);
        TPCFormula = "Total Project Cost = (Acquisition / Purchase Price + Rehab/Construction Cost + Cost Spent)";
        LTCFormula = "Loan-to-Cost (LTC) =  (Total Loan Amount / Project Cost) * 100<hr>Loan-to-Cost Ratio (LTC) A ratio used in commercial real estate construction to compare the amount of the loan used to finance a project to the cost to build the project. If the project costs $1 million to complete and the borrower borrows $700,000, the loan-to-cost (LTC) ratio would be 70%.";
    }

    $('#TPCToolTip').attr('title', TPCFormula);
    $('#LTCToolTip').attr('title', LTCFormula);


    if (typeOfHMLOLoanRequesting == 'Line of Credit') {
        totalLoanAmount = getFieldsValue('LOCTotalLoanAmt');

    } else if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
        totalLoanAmount = getTextValue('coTotalAmt');            // txt - Inner text Value

    } else {
        totalLoanAmount = getFieldsValue('totalLoanAmount1');
    }

    /* Loan To Cost */
    if (totalProjectCost > 0) {
        LTC = (parseFloat(totalLoanAmount) / parseFloat(totalProjectCost)) * 100;
        LTC = LTC.toFixed(2);
    }
    totalProjectCost = autoNumericConverter(totalProjectCost.toFixed(2));

    try {
        $('#totalProjectCost').html(totalProjectCost);
    } catch (e) {
    }
    $('#Loan-to-Cost').html(LTC);


}

/* Simple ARV Calculation */
function calculateSimpleARVPercentage() {
    var totalLoanAmount = originationPointsValue = brokerPointsValue = prepaidInterestReserve = assessedValue = simpleARV = simpleARVP = 0;

    totalLoanAmount = getFieldsValue('totalLoanAmount1');
    originationPointsValue = getFieldsValue('originationPointsValue');
    brokerPointsValue = getFieldsValue('brokerPointsValue');
    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }
    assessedValue = getFieldsValue('assessedValue');

    if (parseFloat(assessedValue) > 0) {
        simpleARVP = parseFloat(totalLoanAmount) - (parseFloat(originationPointsValue) + parseFloat(brokerPointsValue) + parseFloat(prepaidInterestReserve));
        simpleARV = (parseFloat(simpleARVP) / parseFloat(assessedValue)) * 100;
    }

    simpleARV = autoNumericConverter(simpleARV.toFixed(2));

    try {
        $('#simpleARV').html(simpleARV);
    } catch (e) {
    }
}

function calculateTotalCashOut() {
    var payOffMortgage1 = 0;
    var payOffMortgage2 = 0;
    var payOffOutstandingTaxes = 0;
    var CORTotalLoanAmt = 0;
    var closingCostFinanced = 0;
    var totalCashOut = 0;
    var rehabCostFinanced = 0;
    var typeOfHMLOLoanRequesting = '';

    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();

    CORTotalLoanAmt = getFieldsValue('CORTotalLoanAmt');
    payOffMortgage1 = getFieldsValue('payOffMortgage1');
    payOffMortgage2 = getFieldsValue('payOffMortgage2');
    payOffOutstandingTaxes = getFieldsValue('payOffOutstandingTaxes');
    closingCostFinanced = getFieldsValue('closingCostFinanced');
    rehabCostFinanced = getTextValue('rehabCostFinanced');

    if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
        totalCashOut = parseFloat(CORTotalLoanAmt) - parseFloat(payOffMortgage1) - parseFloat(payOffMortgage2) - parseFloat(payOffOutstandingTaxes) - parseFloat(closingCostFinanced);
    } else {
        totalCashOut = parseFloat(CORTotalLoanAmt) - parseFloat(payOffMortgage1) - parseFloat(payOffMortgage2) - parseFloat(payOffOutstandingTaxes) - parseFloat(closingCostFinanced) - parseFloat(rehabCostFinanced);
    }
    totalCashOut = autoNumericConverter(totalCashOut.toFixed(2));

    try {
        $('#totalCashOut').html(totalCashOut);
    } catch (e) {
    }
}

function calculatePercentageRehabCostFinanced() {
    var rehabCostFinanced = 0;
    var rehabCostFinancedAmt = 0;
    var rehabCost = rehabCostPercentageFinanced = 0;

    rehabCost = getFieldsValue('rehabCost');

    rehabCostPercentageFinanced = getFieldsValue('rehabCostPercentageFinanced');
    if (rehabCostPercentageFinanced > 0) {
        rehabCostFinancedAmt = parseFloat(rehabCostPercentageFinanced / 100);
        rehabCostFinancedAmt = parseFloat(rehabCost) * parseFloat(rehabCostFinancedAmt);
        rehabCostFinancedAmt = autoNumericConverter(rehabCostFinancedAmt.toFixed(2));
    }

    try {
        $('#rehabCostFinanced').html(rehabCostFinancedAmt);
    } catch (e) {
    }

    updateLoanDetail();
    validateRehabCostFinanced();

}

function calculateRehabCostFinancedByPercentage() {
    var rehabCostPercentageFinanced = '';
    var rehabCostFinancedAmt = 0;
    var rehabCost = 0;

    rehabCostPercentageFinanced = getFieldsValue('rehabCostPercentageFinanced');
    rehabCost = getFieldsValue('rehabCost');

    if (rehabCostPercentageFinanced > 0) {
        rehabCostFinancedAmt = parseFloat(rehabCostPercentageFinanced / 100);
        rehabCostFinancedAmt = parseFloat(rehabCost) * parseFloat(rehabCostFinancedAmt);
        rehabCostFinancedAmt = autoNumericConverter(rehabCostFinancedAmt.toFixed(2));
    }

    try {
        $('#rehabCostFinanced').html(rehabCostFinancedAmt);
    } catch (e) {
    }

    updateLoanDetail();
}

function calculateOriginationPointsRate() {

    var initialLoanAmount = 0;
    var originationPointsValue = 0;
    var originationPointsRate = rehabCostFinanced = prepaidInterestReserve = 0;
    var typeOfHMLOLoanRequesting = '';

    originationPointsValue = getFieldsValue('originationPointsValue');
    rehabCostFinanced = getTextValue('rehabCostFinanced');
    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }

    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();

    /**
     * If "on Total Loan Amount" is checked, calculate origination points based on total loan amount.
     * Otherwise, origination points calculation based on "initial loan amount, rehabCostFinanced, prepaidInterestReserve"
     */
    if ($('input[name=origination_total_loan_amt_checked]:checked').val()) {
        var totalLoanAmount = 0;
        if (typeOfHMLOLoanRequesting == 'Line of Credit') {
            totalLoanAmount = getFieldsValue('LOCTotalLoanAmt');
        } else if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
            totalLoanAmount = getTextValue('coTotalAmt');            // txt - Inner text Value
        } else {
            totalLoanAmount = getFieldsValue('totalLoanAmount1');
        }

        if (parseFloat(totalLoanAmount) > 0) {
            originationPointsRate = (parseFloat(originationPointsValue) / parseFloat(totalLoanAmount)) * 100;
            originationPointsRate = roundNumber(parseFloat(originationPointsRate), 6);
        }

    } else {

        if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
            initialLoanAmount = getFieldsValue('CORTotalLoanAmt');
        } else if (typeOfHMLOLoanRequesting == 'Rate & Term Refinance' || typeOfHMLOLoanRequesting == 'Commercial Rate / Term Refinance') { //https://www.pivotaltracker.com/story/show/160404580
            initialLoanAmount = parseFloat(getFieldsValue('payOffMortgage1')) + parseFloat(getFieldsValue('payOffMortgage2')) + parseFloat(getFieldsValue('payOffOutstandingTaxes'));
            rehabCostFinanced = 0;
        } else if (typeOfHMLOLoanRequesting == 'Line of Credit') {
            initialLoanAmount = getFieldsValue('CORTotalLoanAmt');
        } else {
            initialLoanAmount = getTextValue('acquisitionPriceFinanced');
        }

        if ((parseFloat(initialLoanAmount) + parseFloat(rehabCostFinanced) + parseFloat(prepaidInterestReserve)) > 0) {
            originationPointsRate = (parseFloat(originationPointsValue) / (parseFloat(initialLoanAmount)
                + parseFloat(rehabCostFinanced) + parseFloat(prepaidInterestReserve))) * 100;
            originationPointsRate = roundNumber(parseFloat(originationPointsRate), 6);
        }
    }
    try {
        $('#originationPointsRate').val(originationPointsRate);
    } catch (e) {
    }
}

function calculateOriginationPointsValue() {

    var initialLoanAmount = 0;
    var originationPointsRate = 0;
    var originationPointsValue = rehabCostFinanced = prepaidInterestReserve = 0;
    var typeOfHMLOLoanRequesting = '';

    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();

    originationPointsRate = getFieldsValue('originationPointsRate');
    rehabCostFinanced = getTextValue('rehabCostFinanced');
    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }

    /**
     * If "on Total Loan Amount" is checked, calculate origination points based on total loan amount.
     * Otherwise, origination points calculation based on "initial loan amount, rehabCostFinanced, prepaidInterestReserve"
     */
    if ($('input[name=origination_total_loan_amt_checked]:checked').val()) {
        var totalLoanAmount = 0;
        if (typeOfHMLOLoanRequesting == 'Line of Credit') {
            totalLoanAmount = getFieldsValue('LOCTotalLoanAmt');
        } else if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
            totalLoanAmount = getTextValue('coTotalAmt');            // txt - Inner text Value
        } else {
            totalLoanAmount = getFieldsValue('totalLoanAmount1');
        }
        originationPointsValue = (parseFloat(originationPointsRate) * parseFloat(totalLoanAmount)) / 100;
        $('#origination_based_on_total_loan_amt').val(originationPointsValue);

    } else {

        if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
            initialLoanAmount = getFieldsValue('CORTotalLoanAmt');
        } else if (typeOfHMLOLoanRequesting == 'Rate & Term Refinance' || typeOfHMLOLoanRequesting == 'Commercial Rate / Term Refinance') { //https://www.pivotaltracker.com/story/show/160404580
            initialLoanAmount = parseFloat(getFieldsValue('payOffMortgage1')) + parseFloat(getFieldsValue('payOffMortgage2')) + parseFloat(getFieldsValue('payOffOutstandingTaxes'));
            rehabCostFinanced = 0;
        } else if (typeOfHMLOLoanRequesting == 'Line of Credit') {
            initialLoanAmount = getFieldsValue('CORTotalLoanAmt');
        } else {
            initialLoanAmount = getTextValue('acquisitionPriceFinanced');
        }

        originationPointsValue = (parseFloat(originationPointsRate) * (parseFloat(initialLoanAmount)
            + parseFloat(rehabCostFinanced) + parseFloat(prepaidInterestReserve))) / 100;
        $('#origination_based_on_total_loan_amt').val(0);
    }

    originationPointsValue = autoNumericConverter(originationPointsValue.toFixed(2));

    try {
        $('#originationPointsValue').val(originationPointsValue);
    } catch (e) {
    }

}

function calculateBrokerPointsRate() {

    var initialLoanAmount = 0;
    var brokerPointsValue = 0;
    var brokerPointsRate = rehabCostFinanced = prepaidInterestReserve = 0;
    var typeOfHMLOLoanRequesting = '';

    brokerPointsValue = getFieldsValue('brokerPointsValue');
    rehabCostFinanced = getTextValue('rehabCostFinanced');
    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }

    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();

    /**
     * If "on Total Loan Amount" is checked, calculate origination points based on total loan amount.
     * Otherwise, origination points calculation based on "initial loan amount, rehabCostFinanced, prepaidInterestReserve"
     */
    if ($('input[name=broker_total_loan_amt_checked]:checked').val()) {
        var totalLoanAmount = 0;
        if (typeOfHMLOLoanRequesting == 'Line of Credit') {
            totalLoanAmount = getFieldsValue('LOCTotalLoanAmt');
        } else if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
            totalLoanAmount = getTextValue('coTotalAmt');            // txt - Inner text Value
        } else {
            totalLoanAmount = getFieldsValue('totalLoanAmount1');
        }

        if (parseFloat(totalLoanAmount) > 0) {
            brokerPointsRate = (parseFloat(brokerPointsValue) / parseFloat(totalLoanAmount)) * 100;
            brokerPointsRate = roundNumber(parseFloat(brokerPointsRate), 6);
        }

    } else {

        if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
            initialLoanAmount = getFieldsValue('CORTotalLoanAmt');
        } else if (typeOfHMLOLoanRequesting == 'Rate & Term Refinance' || typeOfHMLOLoanRequesting == 'Commercial Rate / Term Refinance') { //https://www.pivotaltracker.com/story/show/160404580
            initialLoanAmount = parseFloat(getFieldsValue('payOffMortgage1')) + parseFloat(getFieldsValue('payOffMortgage2')) + parseFloat(getFieldsValue('payOffOutstandingTaxes'));
            rehabCostFinanced = 0;
        } else if (typeOfHMLOLoanRequesting == 'Line of Credit') {
            initialLoanAmount = getFieldsValue('CORTotalLoanAmt');
        } else {
            initialLoanAmount = getTextValue('acquisitionPriceFinanced');
        }

        if ((parseFloat(initialLoanAmount) + parseFloat(rehabCostFinanced) + parseFloat(prepaidInterestReserve)) > 0) {
            brokerPointsRate = (parseFloat(brokerPointsValue) / (parseFloat(initialLoanAmount)
                + parseFloat(rehabCostFinanced) + parseFloat(prepaidInterestReserve))) * 100;
            brokerPointsRate = roundNumber(parseFloat(brokerPointsRate), 6);
        }
    }

    try {
        $('#brokerPointsRate').val(brokerPointsRate);
    } catch (e) {
    }

}

function calculateBrokerPointsValue() {

    var initialLoanAmount = 0;
    var brokerPointsRate = 0;
    var brokerPointsValue = rehabCostFinanced = prepaidInterestReserve = 0;
    var typeOfHMLOLoanRequesting = '';

    brokerPointsRate = getFieldsValue('brokerPointsRate');
    rehabCostFinanced = getTextValue('rehabCostFinanced');
    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }

    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();

    /**
     * If "on Total Loan Amount" is checked, calculate broker points based on total loan amount.
     * Otherwise, broker points calculation based on "initial loan amount, rehabCostFinanced, prepaidInterestReserve"
     */
    if ($('input[name=broker_total_loan_amt_checked]:checked').val()) {

        var totalLoanAmount = 0;
        if (typeOfHMLOLoanRequesting == 'Line of Credit') {
            totalLoanAmount = getFieldsValue('LOCTotalLoanAmt');
        } else if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
            totalLoanAmount = getTextValue('coTotalAmt');
        } else {
            totalLoanAmount = getFieldsValue('totalLoanAmount1');
        }

        brokerPointsValue = (parseFloat(brokerPointsRate) * parseFloat(totalLoanAmount)) / 100;
        $('#broker_based_on_total_loan_amt').val(brokerPointsValue);

    } else {

        if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
            initialLoanAmount = getFieldsValue('CORTotalLoanAmt');
        } else if (typeOfHMLOLoanRequesting == 'Rate & Term Refinance' || typeOfHMLOLoanRequesting == 'Commercial Rate / Term Refinance') { //https://www.pivotaltracker.com/story/show/160404580
            initialLoanAmount = parseFloat(getFieldsValue('payOffMortgage1')) + parseFloat(getFieldsValue('payOffMortgage2')) + parseFloat(getFieldsValue('payOffOutstandingTaxes'));
            rehabCostFinanced = 0;
        } else if (typeOfHMLOLoanRequesting == 'Line of Credit') {
            initialLoanAmount = getFieldsValue('CORTotalLoanAmt');
        } else {
            initialLoanAmount = getTextValue('acquisitionPriceFinanced');
        }

        brokerPointsValue = (parseFloat(brokerPointsRate) * (parseFloat(initialLoanAmount)
            + parseFloat(rehabCostFinanced) + parseFloat(prepaidInterestReserve))) / 100;
        $('#broker_based_on_total_loan_amt').val(0);
    }

    brokerPointsValue = autoNumericConverter(brokerPointsValue.toFixed(2));

    try {
        $('#brokerPointsValue').val(brokerPointsValue);
    } catch (e) {
    }

}

function calculateTotalFeesAndCost(autoCal) {

    if (autoCal === undefined) autoCal = 0;   // https://www.pivotaltracker.com/story/show/161121479

    var originationPointsValue = 0;
    var brokerPointsValue = 0;
    var appraisalFee = 0;
    var applicationFee = 0, activeTab = '';
    var cloChk = false;
    var drawsSetUpFee = 0;
    var estdTitleClosingFee = 0;
    var miscellaneousFee = 0;
    var processingFee = 0;
    var totalFeesAndCost = perClosingCostFinanced = closingCostFinanced = totalLoanAmount = thirdPartyFees = 0;
    var totalEstPerDiem = 0;

    var activeTab = $('#activeTab').val();

    var feesArray = ["originationPointsValue", "brokerPointsValue", "appraisalFee", "applicationFee", "drawsSetUpFee", "estdTitleClosingFee", "processingFee", "valuationBPOFee", "valuationAVMFee", "creditReportFee", "backgroundCheckFee", "floodCertificateFee", "otherFee", "thirdPartyFees", "taxImpoundsFee", "insImpoundsFee", "documentPreparationFee", "servicingSetUpFee", "floodServiceFee", "drawsFee", "wireFee", "taxServiceFee", "inspectionFees", "projectFeasibility", "dueDiligence", "UccLienSearch", "closingCostFinancingFee", "attorneyFee", "escrowFees", "recordingFee", "underwritingFees", "propertyTax", "bufferAndMessengerFee", "travelNotaryFee", "prePaidInterest", "realEstateTaxes", "insurancePremium", "payOffLiensCreditors", "wireTransferFeeToTitle", "wireTransferFeeToEscrow", "pastDuePropertyTaxes", "survey", "wholeSaleAdminFee", "cityCountyTaxStamps", "valuationCMAFee", "valuationAVEFee", "creditCheckFee", "employmentVerificationFee", "taxReturnOrderFee", "constructionHoldbackFee"];

    for (var fee = 0; fee < feesArray.length; fee++) {
        var tempFee = 0;
        tempFee = getFieldsValue(feesArray[fee]);
        totalFeesAndCost = parseFloat(tempFee) + parseFloat(totalFeesAndCost);
    }

    totalEstPerDiem = getTextValue('totalEstPerDiem');
    totalFeesAndCost = parseFloat(totalFeesAndCost) + parseFloat(totalEstPerDiem);
    totalFeesAndCost = autoNumericConverter(totalFeesAndCost.toFixed(2));

    try {
        $('#totalFeesAndCost').html(totalFeesAndCost);
    } catch (e) {
    }

    if ($("#chkCCF").is(':checked')) {
        $('#closingCostFinanced').val(totalFeesAndCost);
        $('#closingCostFinanced').prop('readOnly', true);
        $('#includeCCF').val('1');
        if (activeTab == 'HMLI') validateClosingCostFinanced();                              // | Validate closing cost financed...
    } else {
        if (autoCal == 1) {
            $('#closingCostFinanced').prop('readOnly', false);
            $('#includeCCF').val('0');
            $('#closingCostFinanced').val('');
        }
    }

    /* Percentage of Closing Cost Financed */
    totalFeesAndCost = replaceCommaValues(totalFeesAndCost);
    closingCostFinanced = getFieldsValue('closingCostFinanced');

    if (totalFeesAndCost > 0) {
        perClosingCostFinanced = (parseFloat(closingCostFinanced) / parseFloat(totalFeesAndCost)) * 100;
    }
    perClosingCostFinanced = autoNumericConverter(perClosingCostFinanced.toFixed(2));

    try {
        $('#perClosingCostFinanced').html(perClosingCostFinanced);
    } catch (e) {
    }

    /* Closing Cost Not Financed */
    closingCostNotFinanced = parseFloat(totalFeesAndCost) - parseFloat(closingCostFinanced);
    closingCostNotFinanced = autoNumericConverter(closingCostNotFinanced.toFixed(2));
    try {
        $('#closingCostNotFinanced').html(closingCostNotFinanced);
    } catch (e) {
    }

}

function validateClosingCostFinanced() {
    var closingCostFinanced = 0, totalFeesAndCost = 0;
    var returnVal = false;

    closingCostFinanced = getFieldsValue('closingCostFinanced');
    totalFeesAndCost = getTextValue('totalFeesAndCost');

    if (parseFloat(closingCostFinanced) > parseFloat(totalFeesAndCost)) {
        toastrNotification('Closing Costs Financed should not be greater than Total Fees & Costs', 'error');
        $('#closingCostFinanced').val('');
        return false;

    } else {
        return true;
    }
}

/*Total Cash to Close*/
function calculateTotalCashToClose(formName, targetName) {
    var closingCostNotFinanced = earnestDeposit = otherDownPayment = downPayment = totalCashToClose = 0;

    closingCostNotFinanced = getTextValue('closingCostNotFinanced');            // txt - Inner text Value
    downPayment = getTextValue('downPayment');
    earnestDeposit = getFieldsValue('earnestDeposit');
    otherDownPayment = getFieldsValue('otherDownPayment');

    totalCashToClose = parseFloat(closingCostNotFinanced) + parseFloat(downPayment) - parseFloat(earnestDeposit) - parseFloat(otherDownPayment);
    totalCashToClose = autoNumericConverter(totalCashToClose.toFixed(2));

    try {
        $('#' + targetName).html(totalCashToClose);
    } catch (e) {
    }

}

function calculateRequiredConstruction(formName, targetName) {
    var requiredConstruction = 0;
    var requiredConstructionAmt = 0;
    var rehabCost = 0;
    var rehabCostFinanced = 0;

    requiredConstruction = getFieldsValue('requiredConstruction');
    rehabCost = getFieldsValue('rehabCost');
    rehabCostFinanced = getTextValue('rehabCostFinanced');

    if (requiredConstruction > 0) {
        requiredConstructionAmt = parseFloat(requiredConstruction / 100) * (parseFloat(rehabCost) - parseFloat(rehabCostFinanced));
        requiredConstructionAmt = autoNumericConverter(requiredConstructionAmt.toFixed(2));
    }

    try {
        $('#' + targetName).html(requiredConstructionAmt);
    } catch (e) {
    }

}

function calculateContingencyReserve() {
    var contingencyReserve = 0;
    var rehabCost = 0;
    var contingencyReserveAmt = 0;

    rehabCost = getFieldsValue('rehabCost');
    contingencyReserve = getFieldsValue('contingencyReserve');

    if (contingencyReserve > 0) {
        contingencyReserveAmt = parseFloat(contingencyReserve / 100);
        contingencyReserveAmt = parseFloat(rehabCost) * parseFloat(contingencyReserveAmt);
        contingencyReserveAmt = autoNumericConverter(contingencyReserveAmt.toFixed(2));
    }

    try {
        $('#contingencyReserveAmt').html(contingencyReserveAmt);
    } catch (e) {
    }

}

function calculateDownPaymentByPercentage() {
    var downPaymentPercentage = '';
    var downPaymentAmt = 0;
    var costBasis = 0;

    downPaymentPercentage = getFieldsValue('downPaymentPercentage');
    costBasis = getFieldsValue('costBasis');

    if (downPaymentPercentage > 0) {
        downPaymentAmt = parseFloat(downPaymentPercentage / 100);
        downPaymentAmt = parseFloat(costBasis) * parseFloat(downPaymentAmt);
        downPaymentAmt = autoNumericConverter(downPaymentAmt.toFixed(2));
    }

    try {
        $('#maxAmtToPutDown').val(downPaymentAmt);
    } catch (e) {
    }

    populateDualFieldForHMLONewLoan(downPaymentAmt, 'loanModForm', 'downPayment');
    updateLoanDetail();

}

function calculateDownPaymentPercentage() {
    var maxAmtToPutDown = 0;
    var downPaymentPercentage = 0;
    var costBasis = 0;

    maxAmtToPutDown = getFieldsValue('maxAmtToPutDown');
    costBasis = getFieldsValue('costBasis');

    if (costBasis > 0) {
        downPaymentPercentage = parseFloat(maxAmtToPutDown / costBasis) * 100;
        downPaymentPercentage = autoNumericConverter(downPaymentPercentage.toFixed(5));
    }

    try {
        $('#downPaymentPercentage').val(downPaymentPercentage);
    } catch (e) {
    }

    populateDualFieldForHMLONewLoan(maxAmtToPutDown, 'loanModForm', 'downPayment');
    updateLoanDetail();
}

function calculateCORefiLoanAmtByLTVPercentage() {
    var CORefiLTVPercentage = '';
    var assessedValue = 0;
    var CORefiLoanAmt = 0;

    CORefiLTVPercentage = getFieldsValue('CORefiLTVPercentage');
    assessedValue = getFieldsValue('homeValue');

    if (CORefiLTVPercentage > 0) {
        CORefiLoanAmt = parseFloat(CORefiLTVPercentage / 100);
        CORefiLoanAmt = parseFloat(assessedValue) * parseFloat(CORefiLoanAmt);
        CORefiLoanAmt = autoNumericConverter(CORefiLoanAmt.toFixed(2));
    }

    try {
        $('#CORTotalLoanAmt').val(CORefiLoanAmt);
    } catch (e) {
    }

    updateLoanDetail();

}

function calculateCORefiLTVPercentage(autoCal) {

    if (autoCal === undefined) autoCal = 0;   // https://www.pivotaltracker.com/story/show/161121479

    var CORTotalLoanAmt = 0;
    var CORefiLTVPercentage = 0;
    var assessedValue = 0;

    CORTotalLoanAmt = getFieldsValue('CORTotalLoanAmt');
    assessedValue = getFieldsValue('homeValue');
    if (assessedValue > 0) {
        CORefiLTVPercentage = parseFloat(CORTotalLoanAmt / assessedValue) * 100;
        CORefiLTVPercentage = Math.round(CORefiLTVPercentage);
    }

    try {
        $('#CORefiLTVPercentage').val(CORefiLTVPercentage);
    } catch (e) {
    }

    if (autoCal == 0) updateLoanDetail();
}

function validateRehabCostFinanced() {
    var rehabCostFinanced = 0, rehabCost = 0;
    var returnVal = false;

    rehabCostFinanced = getTextValue('rehabCostFinanced');
    rehabCost = getFieldsValue('rehabCost');
    if (parseFloat(rehabCostFinanced) > parseFloat(rehabCost)) {
        toastrNotification('Rehab/Construction Cost Financed should not be greater than Rehab/Construction Cost', 'error');
        $('#rehabCostFinanced').val('');
        return false;
    } else {
        return true;
    }

}

/**
 * Descrition: New Supporting fields for Interest Rate.
 * Date      : Jan 04, 2018
 * PT #      : 153961351
 * Added By  : Viji
 **/
function calculateHMLOInterestRate(formName, targetName) {

    var costOfCapital = 0;
    var lien1Rate = 0;
    var yieldSpread = 0;

    costOfCapital = getFieldsValue('costOfCapital');
    yieldSpread = getFieldsValue('yieldSpread');

    lien1Rate = parseFloat(costOfCapital) + parseFloat(yieldSpread);
    lien1Rate = lien1Rate.toFixed(3);

    try {
        $('#' + targetName).val(lien1Rate);
    } catch (e) {
    }

    updateLoanDetail();
}

function dateDiffDiemDays() {
    var diemDays = 0, interestChargedFromDate = 0, interestChargedEndDate = 0;

    interestChargedFromDate = $('#interestChargedFromDate').val();
    interestChargedEndDate = $('#interestChargedEndDate').val();
    totalDailyInterestCharge = getTextValue('totalDailyInterestCharge');

    /* Diem Days */
    if (interestChargedFromDate != '' && interestChargedEndDate != '') {
        diemDays = date_diff_indays(interestChargedFromDate, interestChargedEndDate);
        diemDays = diemDays + 1;
    }

    $('#diemDays').html(diemDays);

    lien1Payment = getFieldsValue('lien1Payment');

    totalEstPerDiem = parseFloat(diemDays) * parseFloat(totalDailyInterestCharge);
    //console.log(totalEstPerDiem);
    //totalEstPerDiem = parseFloat(diemDays) * (parseFloat(lien1Payment)/30);
    //console.log(totalEstPerDiem);

    try {
        $('#totalEstPerDiem').html(autoNumericConverter(totalEstPerDiem.toFixed(2)));
    } catch (e) {
    }
}

function autoCalculateTotalLoanAmountARVNew(fldVal) {
    console.log('new function');
    var maxArvPer = assessedValue = costBasis = homeValue = CORefiLTVPercentage = ltcper = totalLoanAmount = totalLoanAmountBeforeCal = prepaidInterestReserve = costSpent = 0;
    var totalProjectCost = downpayment = initialLoanAmount = downPaymentPercentage = rehabCost = LTC = maxAmtToPutDown = rehabCostFinanced = 0;
    var autoCalcTLAARV = typeOfHMLOLoanRequesting = '';

    autoCalcTLAARV = $('input[name=autoCalcTLAARV]:checked').val();
    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();
    totalProjectCost = getTextValue('totalProjectCost');
    maxArvPer = getFieldsValue('maxArvPer');
    assessedValue = getFieldsValue('assessedValue');
    costBasis = getFieldsValue('costBasis');
    rehabCost = getFieldsValue('rehabCost');
    maxAmtToPutDown = getFieldsValue('maxAmtToPutDown');
    rehabCostFinanced = getTextValue('rehabCostFinanced');
    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }
    costSpent = getFieldsValue('costSpent');

    if (autoCalcTLAARV == "Yes") {
        $('#maxArvPer').show();
        $('#maxLTCPer').hide();
        if (fldVal == 1) $('#maxArvPer').val('70');
        maxArvPer = getFieldsValue('maxArvPer');
    } else if (autoCalcTLAARV == "LTC") {
        $('#maxArvPer').hide();
        $('#maxLTCPer').show();
    } else {
        $('#maxArvPer').hide();
        $('#maxLTCPer').hide();
    }
    if (fldVal == 'totalloanamount') {
        calculateAcquisitionPriceFinanced();
        totalLoanAmount = getFieldsValue('totalLoanAmount1');
        maxArvPer = (totalLoanAmount * 100) / parseFloat(assessedValue);
        $('#maxArvPer').val(parseFloat(maxArvPer.toFixed(5)));
    } else {
        if (autoCalcTLAARV == "Yes") {
            if (maxArvPer > 0) {
                if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
                    homeValue = getFieldsValue('homeValue');
                    //newinitialLAmt = (.7 x ARV) - rehabcost
                    //initialLoanAmount = (((parseFloat(maxArvPer) * parseFloat(assessedValue)) / 100) - parseFloat(rehabCost));
                    initialLoanAmount = ((parseFloat(maxArvPer) / 100) * parseFloat(assessedValue) - (parseFloat(rehabCostFinanced) + parseFloat(prepaidInterestReserve)));
                    CORefiLTVPercentage = ((parseFloat(initialLoanAmount) * 100) / parseFloat(homeValue));
                    $('#CORTotalLoanAmt').val(autoNumericConverter(initialLoanAmount.toFixed(2)));
                    $('#CORefiLTVPercentage').val(CORefiLTVPercentage.toFixed(2));
                    calculateCurrentLoanBalance();
                    totalLoanAmount = parseFloat(initialLoanAmount) + parseFloat(rehabCostFinanced) + parseFloat(prepaidInterestReserve);
                    $('#coTotalAmt').html(autoNumericConverter(totalLoanAmount.toFixed(2)));
                    if (assessedValue > 0) ARV = (parseFloat(totalLoanAmount) / parseFloat(assessedValue)) * 100;
                    try {
                        $('#ARV').html(autoNumericConverter(ARV.toFixed(2)));
                    } catch (e) {
                    }
                    if (totalProjectCost > 0) {
                        LTC = (parseFloat(totalLoanAmount) / parseFloat(totalProjectCost)) * 100;
                        LTC = LTC.toFixed(2);
                    }
                    try {
                        $('#Loan-to-Cost').html(LTC);
                    } catch (e) {
                    }

                } else {
                    downpayment = (parseFloat(totalProjectCost) - parseFloat(costSpent)) - (parseFloat(assessedValue) * (parseFloat(maxArvPer) / 100));
                    downPaymentPercentage = (downpayment * 100) / parseFloat(costBasis);


                    $('#maxAmtToPutDown').val(autoNumericConverter(downpayment.toFixed(2)));
                    $('#downPaymentPercentage').val(downPaymentPercentage.toFixed(2));
                    initialLoanAmount = parseFloat(costBasis) - parseFloat(downpayment);
                    $('#acquisitionPriceFinanced').html(autoNumericConverter(initialLoanAmount.toFixed(2)));
                    calculateCurrentLoanBalance();
                    calculateHMLOFeeCostTotalLoanAmount();
                    totalLoanAmount = (parseFloat(assessedValue) * parseFloat(maxArvPer)) / 100;
                    $('#totalLoanAmount1').val(autoNumericConverter(totalLoanAmount.toFixed(2)));
                    $('.totalLoanAmount').html(autoNumericConverter(totalLoanAmount.toFixed(2)));
                    if (assessedValue > 0) ARV = (parseFloat(totalLoanAmount) / parseFloat(assessedValue)) * 100;
                    try {
                        $('#ARV').html(autoNumericConverter(ARV.toFixed(2)));
                    } catch (e) {
                    }
                    if (totalProjectCost > 0) {
                        LTC = (parseFloat(totalLoanAmount) / parseFloat(totalProjectCost)) * 100;
                        LTC = LTC.toFixed(2);
                    }
                    try {
                        $('#Loan-to-Cost').html(LTC);
                    } catch (e) {
                    }

                }
            }
        } else if (autoCalcTLAARV == "LTC") {
            ltcper = getFieldsValue('maxLTCPer');
            if (ltcper > 0) {
                $('#Loan-to-Cost').html(ltcper);
                totalLoanAmountBeforeCal = getFieldsValue('totalLoanAmount1');
                if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
                    totalLoanAmount = (parseFloat(ltcper) / 100) * parseFloat(totalProjectCost);
                    $('#coTotalAmt').html(autoNumericConverter(totalLoanAmount.toFixed(2)));
                    initialLoanAmount = parseFloat(totalLoanAmount) - (parseFloat(rehabCostFinanced) + parseFloat(prepaidInterestReserve));
                    $('#CORTotalLoanAmt').val(autoNumericConverter(initialLoanAmount.toFixed(2)));
                    homeValue = getFieldsValue('homeValue');
                    CORefiLTVPercentage = ((parseFloat(initialLoanAmount) * 100) / parseFloat(homeValue));
                    $('#CORefiLTVPercentage').val(CORefiLTVPercentage.toFixed(2));
                } else {
                    totalLoanAmount = (parseFloat(ltcper) / 100) * parseFloat(totalProjectCost);
                    $('#totalLoanAmount1').val(autoNumericConverter(totalLoanAmount.toFixed(2)));
                    $('.totalLoanAmount').html(autoNumericConverter(totalLoanAmount.toFixed(2)));
                    maxAmtToPutDown = parseFloat(maxAmtToPutDown) + (parseFloat(totalLoanAmountBeforeCal) - parseFloat(totalLoanAmount));
                    $('#maxAmtToPutDown').val(autoNumericConverter(maxAmtToPutDown.toFixed(2)));
                    downPaymentPercentage = ((parseFloat(maxAmtToPutDown) * 100) / parseFloat(costBasis));
                    $('#downPaymentPercentage').val(downPaymentPercentage.toFixed(2));
                    initialLoanAmount = parseFloat(costBasis) - parseFloat(maxAmtToPutDown);
                    $('#acquisitionPriceFinanced').html(autoNumericConverter(initialLoanAmount.toFixed(2)));
                }
            }
            /* if (ltcper > 0) {
                 if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance') {
                     homeValue = getFieldsValue('homeValue');
                     //newinitialLAmt = (.7 x ARV) - rehabcost
                     initialLoanAmount = (((parseFloat(ltcper) * parseFloat(assessedValue)) / 100) - parseFloat(rehabCost));
                     CORefiLTVPercentage = ((parseFloat(initialLoanAmount) * 100) / parseFloat(homeValue));
                     $('#CORTotalLoanAmt').val(initialLoanAmount.toFixed(2));
                     $('#CORefiLTVPercentage').val(CORefiLTVPercentage.toFixed(2));

                 } else {
                     downpayment = parseFloat(totalProjectCost) - (parseFloat(assessedValue) * (parseFloat(ltcper) / 100));
                     downPaymentPercentage = (downpayment * 100) / parseFloat(costBasis);


                     $('#maxAmtToPutDown').val(autoNumericConverter(downpayment.toFixed(2)));
                     $('#downPaymentPercentage').val(downPaymentPercentage.toFixed(2));
                     initialLoanAmount = parseFloat(costBasis) - parseFloat(downpayment);
                     $('#acquisitionPriceFinanced').html(autoNumericConverter(initialLoanAmount.toFixed(2)));
                 }
                 calculateCurrentLoanBalance();
                 calculateHMLOFeeCostTotalLoanAmount();
                 totalLoanAmount = getFieldsValue('totalLoanAmount1');
                 if (assessedValue > 0) ARV = (parseFloat(totalLoanAmount) / parseFloat(assessedValue)) * 100;
                 try {
                     $('#ARV').html(autoNumericConverter(ARV.toFixed(2)));
                 } catch (e) {
                 }
                 if (totalProjectCost > 0) {
                     LTC = (parseFloat(totalLoanAmount) / parseFloat(totalProjectCost)) * 100;
                     LTC = LTC.toFixed(2);
                 }
                 try {
                     $('#Loan-to-Cost').html(LTC);
                 } catch (e) {
                 }
             }*/
        }
    }
}

function autoCalculateTotalLoanAmountARV(fldVal) {

    if (fldVal === undefined) fldVal = 0;   // https://www.pivotaltracker.com/story/show/161121479

    var rehabCostFinanced = totalLoanAmount = initialLoanAmount = prepaidInterestReserve = maxArvPer = closingCostFinanced = assessedValue = 0;
    var autoCalcTLAARV = typeOfHMLOLoanRequesting = maxAmtToPutDown = '';
    var rehabCostPercentageFinanced = rehabCost = ARV = 0;

    maxArvPer = getFieldsValue('maxArvPer');
    assessedValue = getFieldsValue('assessedValue');
    autoCalcTLAARV = $('input[name=autoCalcTLAARV]:checked').val();
    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }
    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();
    closingCostFinanced = getFieldsValue('closingCostFinanced');                 // int - Input Fields Value
    rehabCost = getFieldsValue('rehabCost');
    maxAmtToPutDown = getFieldsValue('maxAmtToPutDown');

    if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
        initialLoanAmount = getFieldsValue('CORTotalLoanAmt');
    } else {
        initialLoanAmount = getTextValue('acquisitionPriceFinanced');
    }

    if (autoCalcTLAARV == "Yes") {
        $('#maxArvPer').show();
        $('#maxLTCPer').hide();
        $('#rehabCostPercentageFinanced').attr('readonly', true);
        if (fldVal == 1) $('#maxArvPer').val('70');
        maxArvPer = getFieldsValue('maxArvPer');

        if (fldVal == 'totalloanamount') {
            calculateAcquisitionPriceFinanced();
            totalLoanAmount = getFieldsValue('totalLoanAmount1');
            maxArvPer = (totalLoanAmount * 100) / parseFloat(assessedValue);
            $('#maxArvPer').val(parseFloat(maxArvPer.toFixed(5)));
        } else if (maxArvPer > 0) {
            totalLoanAmount = (parseFloat(assessedValue) * parseFloat(maxArvPer)) / 100;
            $('#totalLoanAmount1').val(autoNumericConverter(totalLoanAmount.toFixed(2)));
            $('.totalLoanAmount').html(autoNumericConverter(totalLoanAmount.toFixed(2)));
        }

        if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
            rehabCostFinanced = parseFloat(totalLoanAmount) - parseFloat(initialLoanAmount);

            var autoCalARVToolTip = 'Rehab/Construction Cost Financed= Total Loan Amount - Initial Loan Amount';
        } else {
            rehabCostFinanced = parseFloat(totalLoanAmount) - parseFloat(initialLoanAmount) - parseFloat(prepaidInterestReserve) - parseFloat(closingCostFinanced);
            var autoCalARVToolTip = 'Rehab/Construction Cost Financed= Total Loan Amount - Initial Loan Amount - Pre-Paid Interest Reserve - Closing Cost Financed';
        }

        /* ARV - https://www.pivotaltracker.com/story/show/161558008 */
        if (assessedValue > 0) ARV = (parseFloat(totalLoanAmount) / parseFloat(assessedValue)) * 100;
        try {
            $('#ARV').html(autoNumericConverter(ARV.toFixed(2)));
        } catch (e) {
        }

        $('.autoCalARVToolTip').attr('title', autoCalARVToolTip);
        $('#rehabCostFinanced').html(autoNumericConverter(rehabCostFinanced.toFixed(2)));

        if (rehabCost > 0) {
            rehabCostPercentageFinanced = (parseFloat(rehabCostFinanced) / parseFloat(rehabCost)) * 100;
            $('#rehabCostPercentageFinanced').val(autoNumericConverter(rehabCostPercentageFinanced.toFixed(5)));
        }

        if (totalProjectCost > 0) {
            LTC = (parseFloat(totalLoanAmount) / parseFloat(totalProjectCost)) * 100;
            LTC = LTC.toFixed(2);
        }
        try {
            $('#Loan-to-Cost').html(LTC);
        } catch (e) {
        }
    } else if (autoCalcTLAARV == "LTC") {
        $('#maxArvPer').hide();
        $('#maxLTCPer').show();
        var CORefiLTVPercentage = costBasis = totalProjectCost = 0;
        costBasis = getFieldsValue('costBasis');
        totalProjectCost = getTextValue('totalProjectCost');
        ltcper = getFieldsValue('maxLTCPer');
        if (ltcper > 0) {
            $('#Loan-to-Cost').html(ltcper);
            totalLoanAmountBeforeCal = getFieldsValue('totalLoanAmount1');
            if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {

            } else {
                totalLoanAmount = (parseFloat(ltcper) / 100) * parseFloat(totalProjectCost);
                $('#totalLoanAmount1').val(autoNumericConverter(totalLoanAmount.toFixed(2)));
                $('.totalLoanAmount').html(autoNumericConverter(totalLoanAmount.toFixed(2)));
                maxAmtToPutDown = parseFloat(maxAmtToPutDown) + (parseFloat(totalLoanAmountBeforeCal) - parseFloat(totalLoanAmount));
                $('#maxAmtToPutDown').val(autoNumericConverter(maxAmtToPutDown.toFixed(2)));
            }
            /* if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance') {
                 homeValue = getFieldsValue('homeValue');
                 //newinitialLAmt = (.7 x ARV) - rehabcost
                 initialLoanAmount = (((parseFloat(ltcper) * parseFloat(assessedValue)) / 100) - parseFloat(rehabCost));
                 CORefiLTVPercentage = ((parseFloat(initialLoanAmount) * 100) / parseFloat(homeValue));
                 $('#CORTotalLoanAmt').val(initialLoanAmount.toFixed(2));
                 $('#CORefiLTVPercentage').val(CORefiLTVPercentage.toFixed(2));

             } else {
                 downpayment = parseFloat(totalProjectCost) - (parseFloat(assessedValue) * (parseFloat(ltcper) / 100));
                 downPaymentPercentage = (downpayment * 100) / parseFloat(costBasis);


                 $('#maxAmtToPutDown').val(autoNumericConverter(downpayment.toFixed(2)));
                 $('#downPaymentPercentage').val(downPaymentPercentage.toFixed(2));
                 initialLoanAmount = parseFloat(costBasis) - parseFloat(downpayment);
                 $('#acquisitionPriceFinanced').html(autoNumericConverter(initialLoanAmount.toFixed(2)));
             }
             calculateCurrentLoanBalance();
             calculateHMLOFeeCostTotalLoanAmount();
             totalLoanAmount = getFieldsValue('totalLoanAmount1');
             if (assessedValue > 0) ARV = (parseFloat(totalLoanAmount) / parseFloat(assessedValue)) * 100;
             try {
                 $('#ARV').html(autoNumericConverter(ARV.toFixed(2)));
             } catch (e) {
             }
             if (totalProjectCost > 0) {
                 LTC = (parseFloat(totalLoanAmount) / parseFloat(totalProjectCost)) * 100;
                 LTC = LTC.toFixed(2);
             }
             try {
                 $('#Loan-to-Cost').html(LTC);
             } catch (e) {
             }*/
        }
    } else {
        $('#maxArvPer').hide();
        $('#maxLTCPer').hide();
        $('#rehabCostPercentageFinanced').attr('readonly', false);
    }

}

/*
* Description   : Current Loan Balance.
* Formula       : Current Loan Balance = Initial Loan Amount + Pre-paid Interest Reserves + Closing Costs + Funded Draws
* Task          : https://www.pivotaltracker.com/story/show/160959499
*/
function calculateCurrentLoanBalance() {
    var typeOfHMLOLoanRequesting = '';
    var initialLoanAmount = prepaidInterestReserve = closingCostFinanced = totalDrawsFunded = curLoanBal = paydownamount = 0;
    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();

    if (typeOfHMLOLoanRequesting == 'Cash-Out / Refinance' || typeOfHMLOLoanRequesting == 'Commercial Cash Out Refinance' || typeOfHMLOLoanRequesting == 'Refinance') {
        initialLoanAmount = getFieldsValue('CORTotalLoanAmt');
    } else {
        initialLoanAmount = getTextValue('acquisitionPriceFinanced');
    }

    prepaidInterestReserve = getFieldsValue('prepaidInterestReserve');
    if ($('input[name="haveInterestreserve"]:checked').val() == 'No') {
        prepaidInterestReserve = 0;
    }
    closingCostFinanced = getFieldsValue('closingCostFinanced');
    totalDrawsFunded = getTextValue('totalDrawsFunded');
    paydownamount = getFieldsValue('paydownamount');

    curLoanBal = parseFloat(initialLoanAmount) + parseFloat(prepaidInterestReserve) + parseFloat(closingCostFinanced) + parseFloat(totalDrawsFunded) - parseFloat(paydownamount);

    try {
        $('#currentLoanBalance').html(autoNumericConverter(curLoanBal.toFixed(2)));
    } catch (e) {
    }
}

function updateOriginationBrokerPoints(pointType) {

    msg = "Would you like to update " + pointType + " Points Value?";

    var toast = toastConfimBox('success', msg);

    if (toast.find('#confirmBtn').length) {
        toast.delegate('#confirmBtn', 'click', function () {
            toast.remove();
            setTimeout(function () {
                if (pointType == 'Origination') {
                    calculateOriginationPointsValue();
                } else {
                    calculateBrokerPointsValue();
                }
                updateLoanDetail('points');
            }, 100);
        });
    }

    if (toast.find('#cancelBtn').length) {
        toast.delegate('#cancelBtn', 'click', function (event) {
            event.preventDefault();
            toast.remove();
        });
    }

}

function updatePaymentTooltip(paymentBased) {
    var paymentTooltip = '';
    if (paymentBased == 'ILA') {
        paymentTooltip = 'If Amortization is <b>Interest Only</b><br>Loan Payment = (Current Loan Balance * Int. Rate) / 1200<br><br>Otherwise,<br>Loan Payment = Current Loan Balance * Int.  Rate / (1 - (1/ (1 + (Int. Rate / 1200))<sup>((Amortization * 12) / 1200)</sup>)';
    }
    if (paymentBased == 'TLA') {
        paymentTooltip = 'If Amortization is <b>Interest Only</b><br>Loan Payment = (Total Loan Amount * Int. Rate) / 1200<br><br>Otherwise,<br>Loan Payment = Total Loan Amount * Int.  Rate / (1 - (1/ (1 + (Int. Rate / 1200))<sup>((Amortization * 12) / 1200)</sup>)';
    }
    if (paymentBased == 'SMP') {
        paymentTooltip = 'Enter payment amount manually';
    }
    $('#loanPaymentTooltip').attr('title', paymentTooltip);

}

/**
 * Check loan term violation
 * @returns {boolean}
 */
function checkLoanTermViolation() {

    var typeOfHMLOLoanRequesting = '';

    if ($('#fileTypesTxt').val() != '') {
        try {
            fileTypeArray = $('#fileTypesTxt').val().toString().split(',');
            $.inArray('loc', fileTypeArray)
            if ($.inArray("loc", fileTypeArray) !== -1) {
                return true;
            }
        } catch (e) {
        }
    }
    typeOfHMLOLoanRequesting = $('#typeOfHMLOLoanRequesting').val();
    var acquisitionPriceFinanced = costBasis = maxAmtToPutDown = 0;
    acquisitionPriceFinanced = getTextValue('acquisitionPriceFinanced');
    maxAmtToPutDown = getFieldsValue('maxAmtToPutDown');                    // Acquisition Down Payment
    costBasis = getFieldsValue('costBasis');                                // Acquisition / Purchase Price


    if (parseFloat(maxAmtToPutDown) > parseFloat(costBasis) && (typeOfHMLOLoanRequesting == 'Purchase' || typeOfHMLOLoanRequesting == 'Commercial Purchase') ) {
        toastrNotification('Acquisition Down Payment should be less than  Acquisition / Purchase Price', 'error');
        return false;
    } else if (parseFloat(costBasis) < parseFloat(acquisitionPriceFinanced) && (typeOfHMLOLoanRequesting == 'Purchase' || typeOfHMLOLoanRequesting == 'Commercial Purchase')) {
        //if the file is locked we are unable to update the fields
        //and without updating the fields we can not pass the above validations / conditions
        //hence validation / condition is passed only if we are trying to unlock the file (based on isFilelocked value).
        var isFilelocked = $('#isFilelocked').val();
        if (!(isFilelocked == 'No')) {
            toastrNotification('Acquisition / Purchase Price should be greater than Initial Loan Amount', 'error');
            return false;
        }
    } else {
        return true;
    }

}

/* calculation for New TPC & LTC */
function calculationNewTPCLTC() {
    var costBasis = rehabCost = totalFeesAndCost = NewTotalProjectCost = totalLoanAmount = closingCostNotFinanced = 0;
    costBasis = (getFieldsValue('costBasis') != '') ? replaceCommaValues(getFieldsValue('costBasis')) : 0;
    rehabCost = (getFieldsValue('rehabCost') != '') ? replaceCommaValues(getFieldsValue('rehabCost')) : 0;
    totalFeesAndCost = ($('#totalFeesAndCost').text() != '') ? replaceCommaValues($('#totalFeesAndCost').text()) : 0;
    totalEstPerDiem = (getTextValue('totalEstPerDiem') != '') ? replaceCommaValues(getTextValue('totalEstPerDiem')) : 0;

    totalFeesAndCostNew = parseFloat(totalFeesAndCost) - parseFloat(totalEstPerDiem);
    NewTotalProjectCost = parseFloat(costBasis) + parseFloat(rehabCost) + parseFloat(totalFeesAndCostNew);
    $('#NewTotalProjectCost').text(autoNumericConverter(NewTotalProjectCost.toFixed(2)));

    totalLoanAmount = (getFieldsValue('totalLoanAmount1') != '') ? replaceCommaValues(getFieldsValue('totalLoanAmount1')) : 0;
    closingCostNotFinanced = (getTextValue('closingCostNotFinanced') != '') ? replaceCommaValues(getTextValue('closingCostNotFinanced')) : 0;
    NewLTCCal = parseFloat(costBasis) + parseFloat(rehabCost) + parseFloat(closingCostNotFinanced);
    NewLoanToCost = (parseFloat(totalLoanAmount) / parseFloat(NewLTCCal)) * 100;
    $('#NewLoanToCost').text(autoNumericConverter(NewLoanToCost.toFixed(2)));
}

function calculateExitAmount(val) {
    var totalLoanAmount = exitFeePoints = exitFeeAmount = 0;
    totalLoanAmount = (getFieldsValue('totalLoanAmount1') != '') ? replaceCommaValues(getFieldsValue('totalLoanAmount1')) : 0;
    if(val == ''){
        exitFeePoints = (getFieldsValue('exitFeePoints') != '') ? replaceCommaValues(getFieldsValue('exitFeePoints')) : 0;
        if( exitFeePoints > 0 ) val = 'points';
        else val = 'amount';
    }
    if (val == 'points') {
        exitFeePoints = (getFieldsValue('exitFeePoints') != '') ? replaceCommaValues(getFieldsValue('exitFeePoints')) : 0;
        exitFeeAmount = (totalLoanAmount * exitFeePoints) / 100;
        $('#exitFeeAmount').val(autoNumericConverter(exitFeeAmount.toFixed(2)));
    } else if (val == 'amount') {
        exitFeeAmount = (getFieldsValue('exitFeeAmount') != '') ? replaceCommaValues(getFieldsValue('exitFeeAmount')) : 0;
        exitFeePoints = (exitFeeAmount * 100) / totalLoanAmount;
        $('#exitFeePoints').val(autoNumericConverter(exitFeePoints.toFixed(2)));
    }
}

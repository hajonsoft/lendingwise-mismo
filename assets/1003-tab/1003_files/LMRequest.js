/* eslint-disable no-undef */

/* eslint-disable no-unused-vars */
function showCoBorrowerDiv(divId, noOfDiv) {
    var opt = 0;
    try {
        opt = document.loanModForm.isCoBorrower.value;
    } catch (e) {
    }

    if (noOfDiv > 0) {
        for (var i = 1; i <= noOfDiv; i++) {
            try {
                if (opt == '1') {
                    eval("document.getElementById('" + divId + i + "').style.display = 'flex'");
                } else {
                    eval("document.getElementById('" + divId + i + "').style.display = 'none'");
                }
            } catch (e) {
            }
        }
    } else {
        try {
            if (opt == '1') {
                document.getElementById(divId).style.display = 'flex';
            } else {
                document.getElementById(divId).style.display = 'none';
            }
        } catch (e) {
        }
    }

    if (opt == '1') {   /* Loan Origination Show/hide sections */
        $('#coBorGovDiv').show();
    } else {
        $('#coBorGovDiv').hide();
    }

}

function showAndHideDiv(opt, divId, noOfDiv) {

    if (divId == 'HOAOrCOAFeeDiv') {
        opt = document.getElementById("isHOAOrCOAFee").value;
        if (opt == 1) {
            opt = 'show';
        } else {
            opt = 'hide';
        }
    } else if (divId == 'condominiumOrHOAFeeDiv') {
        opt = document.getElementById("condominiumOrHOAFee").value;
        if (opt == 1) {
            opt = 'show';
        } else {
            opt = 'hide';
        }
    } else if (divId == 'doesSecondMtgDiv') {
        opt = document.getElementById("doesSecondMtg").value;
        if (opt == 'Yes') {
            opt = 'show';
        } else {
            opt = 'hide';
        }
    }
    if (noOfDiv > 0) {
        for (var i = 1; i <= noOfDiv; i++) {
            try {
                if (opt == 'show') {
                    eval("document.getElementById('" + divId + i + "').style.display = 'block'");
                } else {
                    eval("document.getElementById('" + divId + i + "').style.display = 'none'");
                }
            } catch (e) {
            }
        }
    } else {
        try {
            if (opt == 'show') {
                document.getElementById(divId).style.display = 'block';
            } else {
                document.getElementById(divId).style.display = 'none';
            }
        } catch (e) {
        }
    }
}

function showAndHideBuyer(divId) {
    opt = document.getElementById(divId).style.display;
    if (opt == 'none') {
        document.getElementById(divId).style.display = "flex";
    } else {
        document.getElementById(divId).style.display = "none";
    }

}

function showAndPropertyDetails(divId) {
    var opt = document.getElementById(divId).style.display;
    if (opt == 'none') {
        document.getElementById(divId).style.display = "flex";
    } else {
        document.getElementById(divId).style.display = "none";
    }
    if ($('.' + divId + "Toggle").children('.arrowClass').hasClass('ki-arrow-up')) {
        $('.' + divId + "Toggle").children('.arrowClass').removeClass('ki-arrow-up').addClass('ki-arrow-down');
    } else if ($('.' + divId + "Toggle").children('.arrowClass').hasClass('ki-arrow-down')) {
        $('.' + divId + "Toggle").children('.arrowClass').removeClass('ki-arrow-down').addClass('ki-arrow-up');
    }
}

/*
 * Auto Populate Property Address.
 */

function autoPopulatePropAddress() {
    var opt = 0;
    try {
        opt = document.loanModForm.mailingAddressAsProp.value;
    } catch (e) {
    }
    if (opt == 1) {
        try {
            document.loanModForm.mailingAddress.value = document.loanModForm.propertyAddress.value;
        } catch (e) {
        }
        try {
            document.loanModForm.mailingCity.value = document.loanModForm.propertyCity.value;
        } catch (e) {
        }
        try {
            document.loanModForm.mailingState.value = document.loanModForm.propertyState.value;
        } catch (e) {
        }
        try {
            document.loanModForm.mailingZip.value = document.loanModForm.propertyZip.value;
        } catch (e) {
        }
    } else {
        clearPropAddress();
    }
}

/*
 *  Clear Previous Address.
 */
function clearPropAddress() {
    try {
        document.loanModForm.mailingAddress.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.mailingCity.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.mailingState.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.mailingZip.value = "";
    } catch (e) {
    }
}

/*
 * Auto Populate Borrower mailing Address as Co-Borrower mailing Address.
 */

function autoPopulateMailingAddressAsFile(formName) {
    var opt = 0;

    try {
        opt = document.loanModForm.mailingAddressAsBorrower.value;
    } catch (e) {
    }
    if (opt == 1) {

        try {
            eval("document." + formName + ".coBorrowerMailingAddress.value = document." + formName + ".mailingAddress.value");
        } catch (e) {
        }
        try {
            eval("document." + formName + ".coBorrowerMailingCity.value = document." + formName + ".mailingCity.value");
        } catch (e) {
        }
        try {
            eval("document." + formName + ".coBorrowerMailingState.value = document." + formName + ".mailingState.value");
        } catch (e) {
        }
        try {
            eval("document." + formName + ".coBorrowerMailingZip.value = document." + formName + ".mailingZip.value");
        } catch (e) {
        }
        //			populateStateCounty(formName, 'coBorrowerMailingState', 'coBorrowerCounty');
        populateStateTimeZone(formName, 'coBorrowerMailingState', 'coBorrowerTimeZone')

    } else {
        clearMailingAddressAsFile(formName);
    }
}

/*
 *  Clear Co-Borrower mailing Address.
 */
function clearMailingAddressAsFile(formName) {
    try {
        eval("document." + formName + ".coBorrowerMailingAddress.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".coBorrowerMailingCity.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".coBorrowerMailingState.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".coBorrowerMailingZip.value = ''");
    } catch (e) {
    }

}

/*
 * Auto Populate Previous Address as Mailing Address.
 */

function autoPopulatePreviousAddress(formName, opt) {
    var mailingFld = "m";
    var previousFld = "p";
    if (opt == "cobor") {
        mailingFld = "coBorrowerM";
        previousFld = "coBorP";
        fieldVal = "coBorPreviousAddrAsMailing";
    } else {
        fieldVal = "previousAddrAsMailing";
    }
    var opt1 = 0;
    opt1 = eval("document.loanModForm." + fieldVal + ".value");
    if (opt1 == 1) {
        try {
            eval("document." + formName + "." + previousFld + "reviousAddress.value = document." + formName + "." + mailingFld + "ailingAddress.value");
        } catch (e) {
        }
        try {
            eval("document." + formName + "." + previousFld + "reviousCity.value = document." + formName + "." + mailingFld + "ailingCity.value");
        } catch (e) {
        }
        try {
            eval("document." + formName + "." + previousFld + "reviousState.value = document." + formName + "." + mailingFld + "ailingState.value");
        } catch (e) {
        }
        try {
            eval("document." + formName + "." + previousFld + "reviousZip.value = document." + formName + "." + mailingFld + "ailingZip.value");
        } catch (e) {
        }
    } else {
        clearPreviousAddress(formName, opt);
    }
}

/*
 *  Clear Previous Address.
 */
function clearPreviousAddress(formName, opt) {
    var mailingFld = "m";
    var previousFld = "p";
    if (opt == "cobor") {
        mailingFld = "coBorrowerM";
        previousFld = "coBorP";
    }
    try {
        eval("document." + formName + "." + previousFld + "reviousAddress.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + "." + previousFld + "reviousCity.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + "." + previousFld + "reviousState.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + "." + previousFld + "reviousZip.value = ''");
    } catch (e) {
    }

}

function calculateTotalPayment(formName, targetFld) {
    var lien1Payment = 0, taxes1 = 0, insurance1 = 0, mortgageInsurance1 = 0, HOAFees1 = 0;
    var totalPayment = 0, floodInsurance1 = 0;

    try {
        eval("lien1Payment = document." + formName + ".lien1Payment.value");
    } catch (e) {
    }
    try {
        eval("taxes1 = document." + formName + ".taxes1.value");
    } catch (e) {
    }
    try {
        eval("insurance1 = document." + formName + ".insurance1.value");
    } catch (e) {
    }
    try {
        eval("mortgageInsurance1 = document." + formName + ".mortgageInsurance1.value");
    } catch (e) {
    }
    try {
        eval("HOAFees1 = document." + formName + ".HOAFees1.value");
    } catch (e) {
    }
    try {
        eval("floodInsurance1 = document." + formName + ".floodInsurance1.value");
    } catch (e) {
    }

    lien1Payment = replaceCommaValues(lien1Payment);
    taxes1 = replaceCommaValues(taxes1);
    insurance1 = replaceCommaValues(insurance1);
    mortgageInsurance1 = replaceCommaValues(mortgageInsurance1);
    HOAFees1 = replaceCommaValues(HOAFees1);
    floodInsurance1 = replaceCommaValues(floodInsurance1);

    if (lien1Payment == "") {
        lien1Payment = 0;
    }
    if (taxes1 == "") {
        taxes1 = 0;
    }
    if (insurance1 == "") {
        insurance1 = 0;
    }
    if (mortgageInsurance1 == "") {
        mortgageInsurance1 = 0;
    }
    if (HOAFees1 == "") {
        HOAFees1 = 0;
    }
    if (floodInsurance1 == "") {
        floodInsurance1 = 0;
    }

    totalPayment = parseFloat(lien1Payment) + parseFloat(taxes1) + parseFloat(insurance1);
    totalPayment += parseFloat(mortgageInsurance1) + parseFloat(HOAFees1) + parseFloat(floodInsurance1);

    try {
        eval("document." + formName + "." + targetFld + ".value = totalPayment");
    } catch (e) {
    }

}

function populateStateCounty(formName, srcName, targetName) {

    var propertyState = '', xmlDoc = '', countyDataArray = new Array();

    eval('var  ' + targetName + 'Array =  new Array();');
    eval('var ' + targetName + 'Array = getNewObject("' + targetName + '");');
    eval(targetName + 'Array.options[0] = new Option("- Select -", "", false)');

    try {
        eval("propertyState = document." + formName + "." + srcName + ".value");
    } catch (e) {
    }
    if (propertyState != "") {
        var url = siteSSLUrl + "backoffice/getCountyData.php";
        var qstr = "sc=" + propertyState;

        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            countyDataArray = xmlDoc.getElementsByTagName("county");
        } catch (e) {
        }

        for (var c = 0; c < countyDataArray.length; c++) {
            var countyName = "";
            try {
                countyName = countyDataArray[c].getElementsByTagName("countyName")[0].firstChild.nodeValue;
            } catch (e) {
            }
            eval(targetName + 'Array.options[c + 1] = new Option(countyName, countyName, false, false)');
        }
    }
}

/*
function calculateTotalPayment(formName, targetFld) {
    var lien1Payment = 0, taxes1 = 0, insurance1 = 0, mortgageInsurance1 = 0, HOAFees1 = 0;
    var totalPayment = 0, floodInsurance1 = 0;

    try {
        eval("lien1Payment = document."+formName+".lien1Payment.value");
    } catch(e) {}
    try {
        eval("taxes1 = document."+formName+".taxes1.value");
    } catch(e) {}
    try {
        eval("insurance1 = document."+formName+".insurance1.value");
    } catch(e) {}
    try {
        eval("mortgageInsurance1 = document."+formName+".mortgageInsurance1.value");
    } catch(e) {}
    try {
        eval("HOAFees1 = document."+formName+".HOAFees1.value");
    } catch(e) {}
    try {
        eval("floodInsurance1 = document."+formName+".floodInsurance1.value");
    } catch(e) {}

    lien1Payment		= replaceCommaValues(lien1Payment);
    taxes1			= replaceCommaValues(taxes1);
    insurance1			= replaceCommaValues(insurance1);
    mortgageInsurance1   	= replaceCommaValues(mortgageInsurance1);
    HOAFees1			= replaceCommaValues(HOAFees1);
    floodInsurance1		= replaceCommaValues(floodInsurance1);

    if(lien1Payment == "")       { lien1Payment = 0; }
    if(taxes1 == "")             { taxes1 = 0; }
    if(insurance1 == "")         { insurance1 = 0; }
    if(mortgageInsurance1 == "") { mortgageInsurance1 = 0; }
    if(HOAFees1 == "")           { HOAFees1 = 0; }
    if(floodInsurance1 == "")    { floodInsurance1 = 0; }

    totalPayment = parseFloat(lien1Payment) + parseFloat(taxes1) + parseFloat(insurance1);
    totalPayment += parseFloat(mortgageInsurance1) + parseFloat(HOAFees1) + parseFloat(floodInsurance1);

    try {
        eval("document."+formName+"."+targetFld+".value = totalPayment");
    } catch(e) {}

}
*/
function validateBorrowerFormClientPortal() {
    var allowClientToCreateHMLOFile = 0;
    validateBorrower = false;

    allowClientToCreateHMLOFile = document.loanModForm.allowClientToCreateHMLOFile.value;

    if (allowClientToCreateHMLOFile == 1) {
        if (chkIsBlank('loanModForm', 'borrowerFName', 'Please Enter Borrower First Name') &&
            chkIsBlank('loanModForm', 'borrowerLName', 'Please Enter Borrower Last Name')) {
            validateBorrower = true;
        } else {
            validateBorrower = false;
            return false;
        }

    } else {
        validateBorrower = true;
    }

    if ((chkIsBlank('loanModForm', 'borrowerFName', 'Please Enter Borrower First Name') &&
            chkIsBlank('loanModForm', 'selectedPC', 'Please Select Any PC')) &&
        chkIsBlank('loanModForm', 'branchId', 'Please Select Any Branch') &&
        chkIsBlank('loanModForm', 'agentId', 'Please select any Loan Officer/Mortgage Broker.') &&
        //        isMultiCheckboxSelected('loanModForm', 'fileModule', 'Please Select file type.') &&
        //       isMultiCheckboxSelected('loanModForm', 'LMRClientType', 'Please Select Services Requested.') &&
        //     isCheckNVAPCValidation('loanModForm', 'LMRClientType', 'Please Select Services Requested.') &&
        validateAmountAllowBlank('loanModForm', 'homeValue', 'Please Enter Correct Home Value.') &&
        validateBorrower
    ) {


        /* Customization request from PC = NVA Financial Encrypted PCID (e300f9edc781f2f8) on May 02,2016 */
        try {
            var LMRId = document.loanModForm.LMRId.value;
        } catch (e) {
        }
        try {
            var encryptedPCID = document.loanModForm.encryptedPCID.value;
            var borrowerFName = document.loanModForm.borrowerFName.value;
            var borrowerLName = document.loanModForm.borrowerLName.value;
        } catch (e) {
        }

        if (LMRId == '0' && (encryptedPCID == 'b2ce63ecb446d9be' || encryptedPCID == '74eaf68646516be1' || encryptedPCID == 'e300f9edc781f2f8')) {
            if (checkBorrowerNameExists(borrowerFName, borrowerLName, encryptedPCID)) {
            } else {
                return false;
            }
        }

        /* Customization request from PC = NVA Financial on May 02,2016 */

        if (checkAgentBranchRelation('loanModForm', 'enc')) {
            return true;
        } else {
            return false;
        }

    } else {
        return false;
    }
}

function validateFileTypeAndLoanProgram() {
    var chznFldVal = '';
    var branchId = '';
    var primaryStatus = '';
    var fileModule;
    chznFldVal = $('#LMRClientType').val();
    branchId = $('#branchId').val();
    fileModule = $('#fileModule').val();
    primaryStatus = $('#primaryStatus').val();
    if (branchId == '') {
        toastrNotification("Please Select Branch", 'error');
        return false;
    } else if (fileModule.length == 0) {
        toastrNotification("Please Select File Type", 'error');
        return false;
    } else if (chznFldVal == '' || chznFldVal == 0) {
        toastrNotification("Please Select What kind of program are you looking for?", 'error');
        return false;
    } else if (primaryStatus == '') {
        toastrNotification("Please Select Primary Client File Status", 'error');
        return false;
    } else {
        return true;
    }
}

function validateClientInfoForm() {
    var allowClientToCreateHMLOFile = 0;
    validateBorrower = false;

    allowClientToCreateHMLOFile = document.loanModForm.allowClientToCreateHMLOFile.value;

    if (allowClientToCreateHMLOFile == 1) {
        if (chkIsBlank('loanModForm', 'borrowerFName', 'Please Enter Borrower First Name') &&
            chkIsBlank('loanModForm', 'borrowerLName', 'Please Enter Borrower Last Name')) {
            validateBorrower = true;
        } else {
            validateBorrower = false;
            return false;
        }

    } else {
        validateBorrower = true;
    }
    //(chkIsBlank('loanModForm', 'selectedPC', 'Please Select Any PC')) &&

    if (chkIsBlank('loanModForm', 'borrowerFName', 'Please Enter Borrower First Name') &&
        chkIsBlank('loanModForm', 'branchId', 'Please Select Any Branch') &&
        chkIsBlank('loanModForm', 'primaryStatus', 'Please Select Primary Client File Status') &&
        //chkIsBlank('loanModForm', 'agentId', 'Please select any Loan Officer/Mortgage Broker.') &&
        isMultiCheckboxSelected('loanModForm', 'fileModule', 'Please Select file type.') &&
        //chkIsBlank('loanModForm', 'LMRClientType', 'Please Select Services Requested.') &&
        //	   isCheckNVAPCValidation('loanModForm', 'LMRClientType', 'Please Select Services Requested.') &&
        validateAmountAllowBlank('loanModForm', 'homeValue', 'Please Enter Correct Home Value.') &&
        validateBorrower
    ) {


        /* Customization request from PC = NVA Financial Encrypted PCID (e300f9edc781f2f8) on May 02,2016 */
        try {
            var LMRId = document.loanModForm.LMRId.value;
        } catch (e) {
        }
        try {
            var encryptedPCID = document.loanModForm.encryptedPCID.value;
            var borrowerFName = document.loanModForm.borrowerFName.value;
            var borrowerLName = document.loanModForm.borrowerLName.value;
        } catch (e) {
        }

        if (LMRId == '0' && (encryptedPCID == 'b2ce63ecb446d9be' || encryptedPCID == '74eaf68646516be1' || encryptedPCID == 'e300f9edc781f2f8')) {
            if (checkBorrowerNameExists(borrowerFName, borrowerLName, encryptedPCID)) {
            } else {
                return false;
            }
        }

        /* Customization request from PC = NVA Financial on May 02,2016 */

        if (checkAgentBranchRelation('loanModForm', 'enc')) {
            return true;
        } else {
            return false;
        }

    } else {
        return false;
    }
}

function checkBorrowerNameExists(borrowerFName, borrowerLName, encryptedPCID) {

    var url = "", qstr = "", xmlDoc = "", status = 0;

    url = "../backoffice/checkBorrowerNameExists.php";
    qstr = "borrowerFName=" + borrowerFName + "&borrowerLName=" + borrowerLName + "&encryptedPCID=" + encryptedPCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        status = xmlDoc.getElementsByTagName("msgStatus")[0].firstChild.nodeValue;
    } catch (e) {
    }
    if (status > 0) {
        if (confirm("A Client with this name already exists in your pipeline.")) {
            try {
                document.loanModForm.borrowerFName.focus();
                document.loanModForm.borrowerLName.focus();
            } catch (e) {
            }
            return true;
        } else {
            return false;
        }
    }
    return true;
}

function validateClientInfoForm_old() {
    if ((chkIsBlank('loanModForm', 'selectedPC', 'Please Select Any PC')) && chkIsBlank('loanModForm', 'branchId', 'Please Select Any Branch') &&
        chkIsBlank('loanModForm', 'agentId', 'Please select any agent.') &&
        chkIsBlank('loanModForm', 'borrowerFName', 'Please Enter Borrower First Name.') &&
        chkIsBlank('loanModForm', 'borrowerLName', 'Please Enter Borrower Last Name.') &&
        checkValidEmailId('loanModForm', 'borrowerEmail') &&
        checkValidEmailId('loanModForm', 'coBorrowerEmail') &&

        checkValidNumber('loanModForm', 'ssn1', 'Please Correct Borrower SSN Number.') &&
        checkValidNumber('loanModForm', 'ssn2', 'Please Correct Borrower SSN Number.') &&
        checkValidNumber('loanModForm', 'ssn3', 'Please Correct Borrower SSN Number.') &&
        checkDateOfBirth('loanModForm', 'borrowerDOB', 'Borrower DOB.') &&
        isMultiCheckboxSelected('loanModForm', 'fileModule', 'Please Select file type.') &&
        isMultiCheckboxSelected('loanModForm', 'LMRClientType', 'Please Select Services Requested.') &&
        isDateOKForMMDDYY('loanModForm', 'marriageDate', 'Marriage Date.') &&
        isDateOKForMMDDYY('loanModForm', 'divorceDate', 'Divorce Date.') &&

        checkDivorceDate(document.loanModForm.marriageDate.value, document.loanModForm.divorceDate.value) &&
        //       checkValidNumber('loanModForm', 'propertyZip','Property Zip Code') &&
        validateAmountAllowBlank('loanModForm', 'homeValue', 'Please Enter Correct Home Value.') &&
        checkValidNumber('loanModForm', 'phNo1', 'Borrower Phone Number') &&
        checkValidNumber('loanModForm', 'phNo2', 'Borrower Phone Number') &&
        checkValidNumber('loanModForm', 'phNo3', 'Borrower Phone Number') &&
        checkValidNumber('loanModForm', 'ext', 'Borrower Phone Number') &&
        checkValidNumber('loanModForm', 'altPhNo1', 'Borrower ALT Phone Number') &&
        checkValidNumber('loanModForm', 'altPhNo2', 'Borrower ALT Phone Number') &&
        checkValidNumber('loanModForm', 'altPhNo3', 'Borrower ALT Phone Number') &&
        checkValidNumber('loanModForm', 'altExt', 'Borrower ALT Phone Number') &&
        checkValidNumber('loanModForm', 'cellNo1', 'Borrower Cell Number') &&
        checkValidNumber('loanModForm', 'cellNo2', 'Borrower Cell Number') &&
        checkValidNumber('loanModForm', 'cellNo3', 'Borrower Cell Number') &&
        checkValidNumber('loanModForm', 'fax1', 'Borrower Fax Number') &&
        checkValidNumber('loanModForm', 'fax2', 'Borrower Fax Number') &&
        checkValidNumber('loanModForm', 'fax3', 'Borrower Fax Number') &&
        checkValidNumber('loanModForm', 'workNo1', 'Borrower Work Number') &&
        checkValidNumber('loanModForm', 'workNo2', 'Borrower Work Number') &&
        checkValidNumber('loanModForm', 'workNo3', 'Borrower Work Number') &&
        checkValidNumber('loanModForm', 'workNoExt', 'Borrower Work Number') &&
        checkValidNumber('loanModForm', 'worldPhone', 'International Number') &&
        //       checkValidNumber('loanModForm','mailingZip','Borrower Mailing Zip Code.') &&
        //       checkValidNumber('loanModForm','previousZip','Borrower Previous Zip Code.') &&
        isDateOKForMMDDYY('loanModForm', 'coBorrowerDOB', 'CoBorrower DOB') &&
        checkValidNumber('loanModForm', 'coBSsn1', 'Co-borrower SSN Number') &&
        checkValidNumber('loanModForm', 'coBSsn2', 'Co-borrower SSN Number') &&
        checkValidNumber('loanModForm', 'coBSsn3', 'Co-borrower SSN Number') &&
        checkValidNumber('loanModForm', 'coBPhNo1', 'Co-borrower Phone Number') &&
        checkValidNumber('loanModForm', 'coBPhNo2', 'Co-borrower Phone Number') &&
        checkValidNumber('loanModForm', 'coBPhNo3', 'Co-borrower Phone Number') &&
        checkValidNumber('loanModForm', 'coBExt', 'Co-borrower Phone Number') &&
        checkValidNumber('loanModForm', 'coBAltPhNo1', 'Co-borrower ALT Phone Number') &&
        checkValidNumber('loanModForm', 'coBAltPhNo2', 'Co-borrower ALT Phone Number') &&
        checkValidNumber('loanModForm', 'coBAltPhNo3', 'Co-borrower ALT Phone Number') &&
        checkValidNumber('loanModForm', 'coBAltExt', 'Co-borrower ALT Phone Number') &&
        checkValidNumber('loanModForm', 'coBCellNo1', 'Co-borrower Cell Number') &&
        checkValidNumber('loanModForm', 'coBCellNo2', 'Co-borrower Cell Number') &&
        checkValidNumber('loanModForm', 'coBCellNo3', 'Co-borrower Cell Number') &&
        checkValidNumber('loanModForm', 'coBFax1', 'Co-borrower Fax Number') &&
        checkValidNumber('loanModForm', 'coBFax1', 'Co-borrower Fax Number') &&
        checkValidNumber('loanModForm', 'coBFax1', 'Co-borrower Fax Number') &&
        checkValidNumber('loanModForm', 'coBWorkNo1', 'Co-borrower Work Number') &&
        checkValidNumber('loanModForm', 'coBWorkNo2', 'Co-borrower Work Number') &&
        checkValidNumber('loanModForm', 'coBWorkNo3', 'Co-borrower Work Number') &&
        checkValidNumber('loanModForm', 'worldPhoneCoB', 'International Phone Number') &&
        //       checkValidNumber('loanModForm','coBorrowerMailingZip','Co-borrower Mailing Zip Code') &&
        //       checkValidNumber('loanModForm','coBorPreviousZip','Co-borrower Previous Zip Code') &&

        chkIntRate('loanModForm', 'lien1Rate', 'Please Enter Correct 1st Lien Rate.') &&
        validateAmountAllowBlank('loanModForm', 'lien1Amount', 'Please Enter Correct 1st Lien Current Unpaid Principal Balance.') &&
        validateAmountAllowBlank('loanModForm', 'lien1OriginalBalance', 'Please Enter Correct 1st Lien Original Loan Amount.') &&
        checkValidNumber('loanModForm', 'loanNumber', '1st Lien Loan Number') &&
        isDateOKForMMDDYY('loanModForm', 'loanOriginationDate', 'Loan Origination Date.') &&
        validateAmountAllowBlank('loanModForm', 'lien1Payment', 'Please Enter Correct 1st Lien Monthly P + I Payment.') &&

        validateAmountAllowBlank('loanModForm', 'taxes1', 'Please Enter Correct 1st Lien Monthly Taxes.') &&
        validateAmountAllowBlank('loanModForm', 'insurance1', 'Please Enter Correct 1st Lien Monthly Property Insurance.') &&
        validateAmountAllowBlank('loanModForm', 'floodInsurance1', 'Please Enter Correct 1st Lien Flood Insurance.') &&
        validateAmountAllowBlank('loanModForm', 'mortgageInsurance1', 'Please Enter Correct 1st Lien Priv. Monthly Mortg. Insurance.') &&
        validateAmountAllowBlank('loanModForm', 'HOAFees1', 'Please Enter Correct 1st Lien Monthly H.O.A Fees.') &&
        isDateOKForMMDDYY('loanModForm', 'lien1LPMade', 'Lien1 Last Payment Made.') &&
        validateAmountAllowBlank('loanModForm', 'lien1BalanceDue', 'Please Enter Correct 1st Lien Past Due Interest.') &&
        validateAmountAllowBlank('loanModForm', 'lien1ProposalEscrowShortage', 'Please Enter Correct 1st Lien Out of Pocket Escrow Adv.') &&
        validateAmountAllowBlank('loanModForm', 'projectedEscrowAdvances', 'Please Enter Correct 1st Lien Projected Escrow Adv during Trial.') &&
        validateAmountAllowBlank('loanModForm', 'pastDueMtg', 'Please Enter Correct 1st Lien Past Due Mtg. Insurance.') &&
        validateAmountAllowBlank('loanModForm', 'pastDueHOA', 'Please Enter Correct 1st Lien Past Due H.O.A.') &&
        validateAmountAllowBlank('loanModForm', 'lien1ProposalFeesAdminCosts', 'Please Enter Correct 1st Lien Late Fees.') &&

        chkIntRate('loanModForm', 'lien2Rate', 'Please Enter Correct 2nd Lien Rate.') &&
        validateAmountAllowBlank('loanModForm', 'lien2Amount', 'Please Enter Correct 2nd Lien Current Unpaid Balance.') &&
        validateAmountAllowBlank('loanModForm', 'lien2OriginalBalance', 'Please Enter Correct 2nd Lien Original Loan Amount.') &&
        validateAmountAllowBlank('loanModForm', 'lien2Payment', 'Please Enter Correct 2nd Lien Payment.') &&
        checkValidNumber('loanModForm', 'loanNumber2', '2nd Lien Loan Number') &&
        validateAmountAllowBlank('loanModForm', 'lien2BalanceDue', 'Please Enter Correct 2nd Lien Past Due Interest.') &&
        isDateOKForMMDDYY('loanModForm', 'lien2LPMade', 'Lien2 Last Payment Made.')

    ) {

        if (document.loanModForm.borrowerEmail.value == '') {

            if (confirm('The borrower email address is empty. The system will automatically creates a dummy email you can change it anytime. Would you like to continue?')) {
                if (checkAgentBranchRelation('loanModForm', 'enc')) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            if (checkAgentBranchRelation('loanModForm', 'enc')) {
                return true;
            } else {
                return false;
            }
        }
    } else {
        return false;
    }
}

function checkDivorceDate(marriageDate, divorceDate) {
    if ((Date.parse(divorceDate) > Date.parse(marriageDate)) || (divorceDate == '' || marriageDate == '')) {
        return true;
    } else {
        //alert("Please Enter Valid Date of Divorce");
        toastrNotification("Please Enter Valid Date of Divorce", 'error');
    }
    return false;
}

function checkCountyData(formName, fldName) {
    eval("var obj = document." + formName + "." + fldName);
    if (obj.options.length == 1) {
        // alert('Please select any state.');
        toastrNotification("Please select any state.", 'error');
    }
}

function submitAndNavigateTab(tabOpt) {
    var dataChanged = '', LMRId1 = 0, publicUser = 0, validateClForm = false;
    var createdUserType = dataChanged = '';
    /**
     * If user changed any contact, user click out side the section our system trigger confirm box.
     */
    var updateType = $('#isSectionChanged').val();

    /* For contact info create/update. */
    if (updateType != '' && typeof updateType !== "undefined") {
        toastrConfirmation('You are updating ' + updateType + ' info related information, which is tied to the contact list. What would you like to do?', updateType, 'info', 'isSectionChanged');
        return false;
    }

    /**
     * Check borrower prfile related info has changed.
     * Card #600 - Updating Borrower profile logic.
     * Added by Suresh Kasinathan <suresh@lendingwise.com>
     */
    var allowToupdateFileAndClient = '';
    try {
        allowToupdateFileAndClient = $('#allowToupdateFileAndClient').val();
    } catch (e) {
    }

    if ($('.changed').length > 0 && allowToupdateFileAndClient != '') {

        $('#isSave').val('');
        $('input[name=goToTab]').val(tabOpt);

        toastrConfirmation('You are updating the borrower related information, which is the borrower profile. What would you like to do?', 'isClientData', 'warning', allowToupdateFileAndClient);
        return false;
    }

    LMRId1 = $('input[name="LMRId"]').val();
    publicUser = $('input[name="publicUser"]').val();
    activeTab = $('input[name="activeTab"]').val();
    dataChanged = $('input[name="dataChanged"]').val();

    if (LMRId1 == 0) {
        if (publicUser == 1) {
            validateClForm = validateLoanForm();
        } else {
            try {
                createdUserType = $('input[name=createdUserType]').val();
            } catch (e) {
            }

            if (createdUserType == 'Client') {
                validateClForm = validateBorrowerFormClientPortal();
            } else {
                validateClForm = validateClientInfoForm();
            }
        }
        if (validateClForm) {
            $('input[name=goToTab]').val(tabOpt);
            document.loanModForm.submit();
        }
    } else {

        if (dataChanged == 'Yes') {
            if (activeTab == 'DOC') {
                confirmAndNavigateTab(tabOpt);
            } else if (activeTab == 'TPS') {
                goToNextTab(tabOpt);                /* dont prompt to save on 3rd party services tab  */
            } else {
                if ($('.ischanged').val() == 1) {              /* Confirmation box for the updation of business entity info */
                    entityConfirmation();
                    return false;
                } else {
                    showDialogBox(tabOpt);
                }
            }
        } else {
            if (LMRId1 > 0) {
                goToNextTab(tabOpt);
            } else {
                confirmAndNavigateTab(tabOpt);
            }
        }

    }
}

function showDialogBox(tabOpt) {

    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: 'Would you like to save the data before leaving this tab?',
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            Yes: function () {
                if (confirmAndNavigateTab(tabOpt)) {
                    showLoader();
                } else {
                    hideLoader();
                }
            },
            No: function () {
                goToNextTab(tabOpt);
                showLoader();
            },
            Cancel: function () {

            }
        },
        onClose: function () {
        },
    });


    /*    $("#warning").confirm({
            title: '',
            autoOpen: true,
            closeOnEscape: false,
            draggable: false,
            width: 460,
            minHeight: 50,
            modal: true, buttons: {
                Yes: function () {
                    if (confirmAndNavigateTab(tabOpt)) {
                        showLoader();
                    } else {
                        hideLoader();
                    }
                    $(this).dialog("close");
                },
                No: function () {
                    goToNextTab(tabOpt);
                    $(this).dialog("close");
                    showLoader();
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            },
            resizable: false
        });*/
    $('#warning').html('Would you like to save the data before leaving this tab?');
}

function confirmAndNavigateTab(tabOpt) {
    var encryptedLId = 0, encryptedRId = 0, encryptedEId = 0, activeTab = '', publicUser = 0, isHMLO = 0,
        validateClForm = false;
    try {
        activeTab = document.loanModForm.activeTab.value;
    } catch (e) {
    }
    try {
        encryptedLId = document.loanModForm.encryptedLId.value;
    } catch (e) {
    }
    try {
        encryptedRId = document.loanModForm.encryptedRId.value;
    } catch (e) {
    }
    try {
        encryptedEId = document.loanModForm.encryptedEId.value;
    } catch (e) {
    }
    try {
        encryptedLId = document.loanModForm.encryptedLId.value;
    } catch (e) {
    }
    try {
        publicUser = document.loanModForm.publicUser.value;
    } catch (e) {
    }
    try {
        isHMLO = document.loanModForm.isHMLO.value;
    } catch (e) {
    }

    var tabArray = new Array('CI', 'QA', 'ADMIN', 'PI', 'LA', 'HR', 'IE', 'INT', 'HMLI', 'LI');

    if (isHMLO == 1) {
        tabArray.push("DOC");
    }

    if (activeTab == 'LI' || activeTab == 'HMLI' || activeTab == 'CI' || activeTab == 'QAPP') {
        chznPrimaryStatusVal = $('#primaryStatus').val();
        if ($('#LMRClientType').val() == '' || $('#LMRClientType').val() == 0) {
            toastrNotification("Please Select What kind of program are you looking for?", 'error');
            return false;
        } else if (chznPrimaryStatusVal == '' || chznPrimaryStatusVal == 0) {
            toastrNotification("Please Select Primary Client File Status", 'error');
            return false;

        }
        // if (activeTab != 'CI') {
        //     checkLoanTermViolation();
        //     return false;
        // }
    }

    if (isValueInArray(tabArray, activeTab)) {
        if (activeTab == 'CI') {
            if (publicUser == 1) {
                validateClForm = validateLoanForm();
            } else {
                createdUserType = '';
                try {
                    createdUserType = document.loanModForm.createdUserType.value;
                } catch (e) {
                }
                if (createdUserType == 'Client') {
                    validateClForm = validateBorrowerFormClientPortal();
                } else {
                    validateClForm = validateClientInfoForm();
                }
                //validateClForm = validateClientInfoForm();
            }
            if (validateClForm) {
                document.loanModForm.goToTab.value = tabOpt;
                document.loanModForm.submit();
                return true;
            } else {
                return false;
            }
        } else if (activeTab == 'QA') {
            if (validateQAInfo()) {
                document.loanModForm.goToTab.value = tabOpt;
                document.loanModForm.submit();
                return true;
            } else {
                return false;
            }
        } else if (activeTab == 'ADMIN') {
            if (validateFileAdminForm()) {
                document.loanModForm.goToTab.value = tabOpt;
                document.loanModForm.submit();
                return true;
            } else {
                return false;
            }
        } else if (activeTab == 'LA') {
            if (validateLoanAuditInfo()) {
                document.loanModForm.goToTab.value = tabOpt;
                document.loanModForm.submit();
                return true;
            } else {
                return false;
            }
        } else if (activeTab == 'HR') {
            document.loanModForm.opt.value = 'but_save';
            document.loanModForm.goToTab.value = tabOpt;
            document.loanModForm.submit();
        } else if (activeTab == 'PI') {
            if (validatePropertyInfoForm()) {
                document.loanModForm.goToTab.value = tabOpt;
                document.loanModForm.submit();
                return true;
            } else {
                return false;
            }
        } else if (activeTab == 'IE') {
            if (validateIncomeExpForm()) {
                document.loanModForm.goToTab.value = tabOpt;
                document.loanModForm.submit();
                return true;
            } else {
                return false;
            }
        } else if (activeTab == 'INT') {
            if (validateClientDocumentIntakeForm()) {
                document.loanModForm.goToTab.value = tabOpt;
                document.loanModForm.submit();
                return true;
            } else {
                return false;
            }
        } else if (activeTab == 'HMLI') {
            $('#goToTabLI').val(tabOpt);
            if (validateHMLOLoanInfo()) {
                document.loanModForm.goToTab.value = tabOpt;
                $('#loanModForm input[type="submit"]').attr('disabled', 'disabled');
                document.loanModForm.submit();
                if (checkLoanTermViolation())
                    return true;
            } else {
                $('#loanModForm input[type="submit"]').removeAttr('disabled');
                return false;
            }
        } else if (activeTab == 'LI' || activeTab == 'QAPP') {
            $('#goToTabLI').val(tabOpt);
            if (validateSummaryInfo()) {
                document.loanModForm.goToTab.value = tabOpt;
                $('#loanModForm input[type="submit"]').attr('disabled', 'disabled');
                document.loanModForm.submit();
                if (checkLoanTermViolation())
                    return true;
            } else {
                $('#loanModForm input[type="submit"]').removeAttr('disabled');
                return false;
            }
        } else if (activeTab == 'DOC') {
            if (chkIsChecklistBlank('loanModForm', 'docStatus_', 'Please assign a status for collected required docs.')) {
                document.loanModForm.goToTab.value = tabOpt;
                goToNextTab(tabOpt);
                return true;
            } else {
                return false;
            }
        } else {
            document.loanModForm.goToTab.value = tabOpt;
            document.loanModForm.submit();
        }
    } else {
        document.loanModForm.goToTab.value = tabOpt;
        document.loanModForm.submit();
    }
}

function goToNextTab(tabOpt) {
    var encryptedLId = 0, encryptedRId = 0, encryptedEId = 0, op = '', agentReferralCode = 0, publicUser = 0,
        branchReferralCode = 0, fOpt = '';
    try {
        encryptedLId = document.loanModForm.encryptedLId.value;
    } catch (e) {
    }
    try {
        encryptedRId = document.loanModForm.encryptedRId.value;
    } catch (e) {
    }
    try {
        encryptedEId = document.loanModForm.encryptedEId.value;
    } catch (e) {
    }
    try {
        encryptedLId = document.loanModForm.encryptedLId.value;
    } catch (e) {
    }
    try {
        op = document.loanModForm.op.value;
    } catch (e) {
    }

    try {
        publicUser = document.loanModForm.publicUser.value;
    } catch (e) {
    }

    if (publicUser == 1) {
        try {
            branchReferralCode = document.loanModForm.branchReferralCode.value;
        } catch (e) {
        }
        try {
            agentReferralCode = document.loanModForm.encAgentReferralCode.value;
        } catch (e) {
        }
        try {
            fOpt = document.loanModForm.encFOpt.value;
        } catch (e) {
        }
        window.location.href = "loanModificationPrequalRemote.php?rsc=" + branchReferralCode + "&aRc=" + agentReferralCode + "&lId=" + encryptedLId + "&fOpt=" + fOpt + "&tabOpt=" + tabOpt + "&op=" + op;
    } else {
        window.location.href = "LMRequest.php?eId=" + encryptedEId + "&lId=" + encryptedLId + "&rId=" + encryptedRId + "&tabOpt=" + tabOpt + "&op=" + op;
    }
}

function deleteProcessorComments(processorCommentsNo) {
    var rsCnt = 0;
    //   var confirmMsg = confirm("Are you sure to delete this comment?");

    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: "Are you sure to delete this comment?",
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            yes: {
                btnClass: 'btn-green',
                action: function () {
                    var url = "../backoffice/deleteProcessorCommments.php";
                    var qstr = "pNo=" + processorCommentsNo;
                    try {
                        xmlDoc = getXMLDoc(url, qstr);
                    } catch (e) {
                    }
                    try {
                        rsCnt = xmlDoc.getElementsByTagName("rsCnt")[0].firstChild.nodeValue;
                    } catch (e) {
                    }
                    if (rsCnt > 0) window.location.reload();
                    //        window.location.href = "../backoffice/deleteProcessorCommments.php?pNo="+processorCommentsNo;
                }
            },
            cancel: {
                text: 'Cancel',
                action: function () {
                    //  location.reload();
                }
            },
        }
    });

    /*  if (confirmMsg) {

      }*/

}

function showBasementFinishDiv(divId, disp) {
    try {
        document.getElementById(divId).style.display = disp;
    } catch (e) {
    }
    dispVal = document.getElementById("basementHome").value;
    if (dispVal == 1) {
        document.getElementById(divId).style.display = "flex";
    } else {
        document.getElementById(divId).style.display = "none";
    }

}

function showmultipleBasementFinishDiv(srcId, desId) {
    var srcVal = $('#' + srcId).val();
    if (srcVal == 1) {
        $('#' + desId).show();
    } else {
        $('#' + desId).hide();
    }
}

function showMonthsPastDueDiv(divId, disp) {
    /*
        try {
            document.getElementById(divId).style.display = disp;
        } catch(e) { alert(e); }
    */
    dispVal = document.getElementById("principalResMortPaid").value;
    if (dispVal == 0) {
        document.getElementById(divId).style.display = "flex";
    } else {
        document.getElementById(divId).style.display = "none";
    }

}

function principalResidenceServicerInfo() {
    var f1 = "";
    f1 = document.loanModForm.occupancy.value;
    if (f1 != 'Owner Occupied' && f1 != 'Owner Occupied/Vacant') {
        try {
            document.getElementById('principalResidenceDiv1').style.display = "flex";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv2').style.display = "flex";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv3').style.display = "flex";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv4').style.display = "flex";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv5').style.display = "flex";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv6').style.display = "flex";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv7').style.display = "flex";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv8').style.display = "flex";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv9').style.display = "flex";
        } catch (e) {
        }
    } else {
        try {
            document.getElementById('principalResidenceDiv1').style.display = "none";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv2').style.display = "none";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv3').style.display = "none";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv4').style.display = "none";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv5').style.display = "none";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv6').style.display = "none";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv7').style.display = "none";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv8').style.display = "none";
        } catch (e) {
        }
        try {
            document.getElementById('principalResidenceDiv9').style.display = "none";
        } catch (e) {
        }
    }
}

function deleteAdditionalLiensInfo(LMRId, ALID) {
    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: "Are you sure to delete?",
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            yes: function () {
                var delCnt = 0, url = "", qstr = "";
                url = "../backoffice/deleteAdditionalLiensInfo.php";
                qstr = "ALID=" + ALID + "&LMRId=" + LMRId;

                try {
                    xmlDoc = getXMLDoc(url, qstr);
                } catch (e) {
                }
                try {
                    delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
                } catch (e) {
                }
                if (delCnt > 0) {
                    //            document.getElementById('AdditionalLiensTable').deleteRow(rowNumbIndex);
                    //           document.getElementById(rowNumb1).style.display = "none";
                    //          document.getElementById(rowNumb2).style.display = "none";
                    showAdditionalLiensInfo(LMRId);
                }
            },
            cancel: function () {

            },
        },

    });
}

function validateAdditionalLienForm(formName) {
    if (chkIsBlank(formName, 'addLienServicer', 'Please enter servicer') &&
        chkIsBlank(formName, 'addLienBalance', 'Please enter balance') &&
        chkIsBlank(formName, 'addLienInterestRate', 'Please enter interest rate') &&
        chkIsBlank(formName, 'addLienLoanNumb', 'Please enter loan number') &&
        validateAmountAllowBlank('additionalLiensForm', 'addLienBalance', 'Please Enter Correct Balance Amount.') &&
        validateAmountAllowBlank('additionalLiensForm', 'addLienInterestRate', 'Please Enter Correct Interest Rate.') &&
        checkValidNumber('additionalLiensForm', 'addLienLoanNumb', 'Loan Number') &&
        checkValidNumber('additionalLiensForm', 'addLienPhone1', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLienPhone2', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLienPhone3', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLienPhoneExt', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLienFax1', 'Fax #') &&
        checkValidNumber('additionalLiensForm', 'addLienFax2', 'Fax #') &&
        checkValidNumber('additionalLiensForm', 'addLienFax3', 'Fax #') &&
        checkValidNumber('additionalLiensForm', 'addLien2Phone1', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLien2Phone2', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLien2Phone3', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLien2PhoneExt', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLien2Fax1', 'Fax #') &&
        checkValidNumber('additionalLiensForm', 'addLien2Fax2', 'Fax #') &&
        checkValidNumber('additionalLiensForm', 'addLien2Fax3', 'Fax #') &&
        checkValidNumber('additionalLiensForm', 'addLien3Phone1', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLien3Phone2', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLien3Phone3', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLien3PhoneExt', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLien3Fax1', 'Fax #') &&
        checkValidNumber('additionalLiensForm', 'addLien3Fax2', 'Fax #') &&
        checkValidNumber('additionalLiensForm', 'addLien3Fax3', 'Fax #')

    ) {
        return true;
    } else {
        return false;
    }
}

function deleteSchedRE(LMRId, SID) {
    var cfmMsg = "Are you sure to delete?";
    if (confirm(cfmMsg)) {
        var delCnt = 0, url = "", qstr = "";
        url = "../backoffice/deleteSchedRE.php";
        qstr = "SID=" + SID;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        //        window.location.reload();
        try {
            delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
        } catch (e) {
        }
        if (delCnt > 0) {
            showRealEstateInfo(LMRId);
        }
    }
}

function validateSchedRE(formName) {
    if (chkIsBlank(formName, 'loanIdNumber', 'Please enter Loan No') &&
        checkValidNumber('RealEstateForm', 'OPhouseNumber', 'House# / Street') &&
        //       checkValidNumber('RealEstateForm','OPZip','Zip') &&
        validateAmountAllowBlank('RealEstateForm', 'OPPropVal', 'Please Enter Correct Prop Value.') &&
        validateAmountAllowBlank('RealEstateForm', 'OPMortBalance', 'Please Enter Correct Total Mort. Bal.') &&
        validateAmountAllowBlank('RealEstateForm', 'OPMonthlyRent', 'Please Enter Correct Gross Rental Income.') &&
        validateAmountAllowBlank('RealEstateForm', 'OPMTGPay', 'Please Enter Correct Monthly Mtg Payments.') &&
        validateAmountAllowBlank('RealEstateForm', 'OPITM', 'Please Enter Correct Insurance, Taxes, Misc.')
    ) {
        saveRealEstateInfo();
    } else {
        return false;
    }
}

function validateFileAdminForm() {
    var statusId = 0, eligOpt = false;
    try {
        statusId = document.loanModForm.statusId.value;
    } catch (e) {
    }
    if (statusId > 0) eligOpt = true;
    if (eligOpt) {
        try {
            w = document.loanModForm.statusId.selectedIndex;
            var primaryStatusName = document.loanModForm.statusId.options[w].text;
            document.loanModForm.primaryStatus.value = primaryStatusName;
        } catch (e) {
        }
        if (isDateOKForMMDDYY('loanModForm', 'receivedDate', 'Received Date.') &&
            isDateOKForMMDDYY('loanModForm', 'closedDate', 'Closed Date.') &&
            isDateOKForMMDDYY('loanModForm', 'borrowerCallBack', 'Borrower Call back Date.') &&
            isDateOKForMMDDYY('loanModForm', 'lenderCallBack', 'Lender Call back Date.') &&
            isDateOKForMMDDYY('loanModForm', 'lenderSubmission', 'Lender Submission Date.') &&
            isDateOKForMMDDYY('loanModForm', 'HAFADate', 'HAFA Date.') &&
            isDateOKForMMDDYY('loanModForm', 'welcomeCallDate', 'Welcome Call Date.') &&
            isDateOKForMMDDYY('loanModForm', 'bankCallCompleted', 'Bank Call Completed Date.') &&
            isDateOKForMMDDYY('loanModForm', 'salesDate', 'Sale Date.') &&
            isDateOKForMMDDYY('loanModForm', 'trialModReceivedDate', 'Date Mod Received.') &&
            validateAmountAllowBlank('loanModForm', 'firstModPaymentAmt', 'Amount of 1st Mod Payment.')

        ) {
            return true;
        } else {
            return false;
        }
    } else {
        //alert('Please Choose Any Primary Client File Status.');
        toastrNotification("Please Choose Any Primary Client File Status.", 'error');
        return false;
    }

}

/* function deleteUploadFileDoc(docId) {
  var confrim = confirm("Are you sure want to delete this document?");
  if(confrim) {
      var url = "../backoffice/deleteFileDoc.php";
      var qstr = "dId="+docId;
    try {
	xmlDoc = getXMLDoc(url,qstr);
    } catch (e) {}
    window.location.reload();
  }
}
*/
function formSubmit(formName) {
    eval("document." + formName + ".submit()");
}

function showDocs(LMRId, PCID, opt) {
    var oldOpt = '';
    oldOpt = document.docsName.oldOpt.value;

    if (oldOpt == opt) {
    } else {
        document.getElementById('docsContent').innerHTML = '<img src="' + STAGEURL + 'assets/Contact-Pop/img/ajax-loader.gif">';

        eval("document.getElementById('" + oldOpt + "').className = 'divNormal'");
        eval("document.getElementById('" + opt + "').className = 'divActive'");
        setTimeout("getAndDisplayDocs('" + LMRId + "', '" + PCID + "', '" + opt + "', '" + oldOpt + "')", '200');
    }
}

function getAndDisplayDocs(LMRId, PCID, opt, oldOpt) {
    var content = '';

    var url = "../backoffice/getDocsInfo.php";
    var qstr = "LMRId=" + LMRId + "&PCID=" + PCID + "&opt=" + opt;

    try {
        content = getResponse(url, qstr);
    } catch (e) {
    }
    document.getElementById('docsContent').innerHTML = content;
    document.docsName.oldOpt.value = opt;
}

function getBranchesAndAgents(procCompanyId) {
    var len = 0, len1 = 0, len2 = 0, brokerNo = 0, PCStatusList = new Array();
    var branchListArray = new Array(), AgentList = new Array(), ps1 = '';

    var url = "../backoffice/PCBranches.php";
    var qstr = "procCompanyId=" + procCompanyId;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }

    try {
        branchListArray = xmlDoc.getElementsByTagName("LMRExecutiveList");
        len = branchListArray.length;
    } catch (e) {
    }
    try {
        AgentList = xmlDoc.getElementsByTagName("AgentList");
        len1 = AgentList.length;
    } catch (e) {
    }
    try {
        PCStatusList = xmlDoc.getElementsByTagName("PCStatusList");
        len2 = PCStatusList.length;
    } catch (e) {
    }


    var br = '<select name="branchId" id="branchId"  class="form-control input-sm mandatory" onChange=\"javascript: getModules(\'loanModForm\', \'' + procCompanyId + '\');getServiceTypes(\'loanModForm\');\">';
    br += '<option value="">- Select - </option>';
    for (var ae = 0; ae < len; ae++) {
        var LMRExecutive = "", executiveId = 0;

        try {
            LMRExecutive = branchListArray[ae].getElementsByTagName("LMRExe")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            executiveId = branchListArray[ae].getElementsByTagName("exeId")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        br += '<option value="' + executiveId + '">' + LMRExecutive + '</option>';
    }

    br += '</select>';
    $('#branchId_container').html(br);


    var br1 = '<select name="agentId" id="agentId"  class="form-control input-sm mandatory" >';
    br1 += '<option value="">- Select - </option>';
    for (var ae = 0; ae < len1; ae++) {
        var LMRExecutive = "", executiveId = 0;

        try {
            brName = AgentList[ae].getElementsByTagName("brName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            brId = AgentList[ae].getElementsByTagName("brId")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        br1 += '<option value="' + brId + '">' + brName + '</option>';
    }

    br1 += '</select>';
    $('#agentId_container').html(br1);

    var tempKeys = '';
    var ps1 = '<select name="primaryStatus" id="primaryStatus" class="primaryStatus mandatory">';
    ps1 += '<option value="">- Select -</option>';
    for (var ps = 0; ps < len2; ps++) {
        var PSName = "", PSID = 0, newStatusId = 0, selOpt = '', moduleKeys = '';
        try {
            PSID = PCStatusList[ps].getElementsByTagName("PSID")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            PSName = PCStatusList[ps].getElementsByTagName("PSName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            newStatusId = PCStatusList[ps].getElementsByTagName("newStatusId")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        if (newStatusId == PSID) {
            selOpt = 'selected';
        }
        try {
            moduleKeys = PCStatusList[ps].getElementsByTagName("moduleKeys")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        if (tempKeys != moduleKeys) {
            if (ps > 0) {
                ps1 += '</optgroup>';
            }
            ps1 += '<optgroup label="' + moduleKeys + '">';
        }

        ps1 += '<option value="' + PSID + '" ' + selOpt + '>' + PSName + '</option>';
        tempKeys = moduleKeys;

    }
    if (len2 > 0) {
        ps1 += '</optgroup>';
    }
    ps1 += '</select>';
    $('#primaryStatus_container').html(ps1);

    /*getModules('loanModForm', procCompanyId);
    getServiceTypes('loanModForm');*/

}

function getModules(formName, procCompanyId, moduleCode = '') {
    var executiveId = 0;
    len = 0, LMRId = 0, cliType = '';
    var modulesRequested = new Array();
    var PCBranchStatus = new Array();
    var len2 = 0;
    var defaultPrimaryStatus = '';
    try {
        eval("executiveId = document." + formName + ".branchId.value");
    } catch (e) {
    }
    try {
        eval("LMRId = document." + formName + ".encryptedLId.value");
    } catch (e) {
    }
    try {
        eval("cliType = document." + formName + ".cliType.value");
    } catch (e) {
    }

    var len = 0;

    var url = "../backoffice/branchModules.php";
    var qstr = "executiveId=" + executiveId + "&LMRId=" + LMRId + "&PCID=" + procCompanyId + "&cliType=" + cliType;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        modulesRequested = xmlDoc.getElementsByTagName("serList");
        len = modulesRequested.length;
    } catch (e) {
    }
    try {
        PCBranchStatus = xmlDoc.getElementsByTagName("PCBranchStatus");
        len2 = PCBranchStatus.length;
    } catch (e) {
    }
    try {
        defaultPrimaryStatus = xmlDoc.getElementsByTagName("defaultPrimaryStatus")[0].firstChild.nodeValue;
    } catch (e) {
    }
    var br = option = '';
    for (var ae = 0; ae < len; ae++) {
        var categoryName = "", catKey = 0, chk = '';

        try {
            catKey = modulesRequested[ae].getElementsByTagName("catKey")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            categoryName = modulesRequested[ae].getElementsByTagName("categoryName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            chk = modulesRequested[ae].getElementsByTagName("chk")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        br += '<option value="' + catKey + '" ' + chk + '>' + categoryName + '</option>';
        option += '  <option value="' + catKey + '" ' + chk + '>' + categoryName + '</option>\n';
    }
    /*  $('#fileModule').empty();
      $('#fileModule').append(br).trigger("liszt:updated");*/

    //  $("#fileModule").chosen();
    $('#fileModule').empty();
    //  $("#fileModule").trigger("chosen:updated");
    $('#fileModule').append(br).trigger("chosen:updated");

    if( moduleCode != '')
    {
        $('#fileModule').val(moduleCode);
        $('#fileModule').trigger("chosen:updated");
    }

    var tempKeys = '';
    var ps1 = '<select name="primaryStatus" id="primaryStatus" class="primaryStatus form-control input-sm mandatory">';
    ps1 += '<option value="">- Select -</option>';
    for (var ps = 0; ps < len2; ps++) {
        var PSName = "", PSID = 0, newStatusId = 0, selOpt = '', moduleKeys = '';
        try {
            PSID = PCBranchStatus[ps].getElementsByTagName("PSID")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            PSName = PCBranchStatus[ps].getElementsByTagName("PSName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            newStatusId = PCBranchStatus[ps].getElementsByTagName("newStatusId")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        if (newStatusId == PSID) {
            selOpt = 'selected';
        }
        try {
            moduleKeys = PCBranchStatus[ps].getElementsByTagName("moduleKeys")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        if (tempKeys != moduleKeys) {
            if (ps > 0) {
                ps1 += '</optgroup>';
            }
            ps1 += '<optgroup label="' + moduleKeys + '">';
        }

        ps1 += '<option value="' + PSID + '" ' + selOpt + '>' + PSName + '</option>';
        tempKeys = moduleKeys;

    }
    if (len2 > 0) {
        ps1 += '</optgroup>';
    }
    ps1 += '</select>';
    $('#primaryStatus_container').html(ps1);
    if (defaultPrimaryStatus != '') {
        $('#primaryStatus').val(defaultPrimaryStatus);
    }

}

function saveRecentSales() {
    if (validateRecentSaleForm('recentSalesForm')) {
        var salePrice = "", listPrice = "", saleDate = "", daysOnMkt = "", RSID = 0, LMRId = 0;
        var age = "", recentSalesNotes = "", recentBuilt = "", cnt = 0, noOfBedroom = '', noOfBathroom = '';
        var url = "", qstr = "", xmlDoc = "", newRSID = 0, encLMRId = '', salePropertyAddress = '',
            saleSqFt = '', salePropertyURLLink1 = '', saleLotSize = '', encIsHMLO = 0, isHMLO = 0;

        RSID = $('#RSID').val();
        LMRId = $('#LMRId').val();
        encLMRId = $('#encLMRId').val();
        listPrice = $('#listPrice').val();
        salePrice = $('#salePrice').val();
        financingType = $('#financingType').val();
        saleDate = $('#saleDate').val();
        daysOnMkt = $('#daysOnMkt').val();
        recentBuilt = $('#recentBuilt').val();
        recentSalesNotes = $('#recentSalesNotes').val();

        salePropertyAddress = $('#salePropertyAddress').val();
        noOfBedroom = $('#noOfBedroom').val();
        noOfBathroom = $('#noOfBathroom').val();
        saleSqFt = $('#saleSqFt').val();
        salePropertyURLLink1 = $('#salePropertyURLLink1').val();
        saleLotSize = $('#saleLotSize').val();
        encIsHMLO = $('#encIsHMLO').val();
        //isHMLO					= $('#isHMLO').val();
        isHMLO = document.recentSalesForm.isHMLO.value;

        url = "../pops/recentSalesInfoSave.php";
        qstr = "RSID=" + RSID + "&LMRId=" + LMRId + "&salePrice=" + salePrice + "&listPrice=" + listPrice + "&saleDate=" + saleDate + "&daysOnMkt=" + daysOnMkt + "&financingType=" + financingType + "&recentBuilt=" + recentBuilt + "&recentSalesNotes=" + encodeURIComponent(recentSalesNotes) + "&salePropertyAddress=" + salePropertyAddress + "&noOfBedroom=" + noOfBedroom + "&noOfBathroom=" + noOfBathroom + "&saleSqFt=" + saleSqFt + "&salePropertyURLLink1=" + salePropertyURLLink1 + "&saleLotSize=" + saleLotSize;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            cnt = xmlDoc.getElementsByTagName("rsResp")[0].firstChild.nodeValue;
        } catch (e) {
        }
        showRecentSaleInfo(encLMRId, isHMLO);
    }
}

function saveListingInfo() {
    var listingNotes = "", listingPrice = "", listingDate1 = "", mlsNo = "", LID = 0, LMRId = 0;
    var url = "", qstr = "", xmlDoc = "";

    LID = $('#LID').val();
    LMRId = $('#LMRId').val();
    encryptedLMRId = document.loanModForm.encryptedLId.value;
    mlsNo = $('#mlsNo').val();
    listingDate1 = $('#listingDate1').val();
    listingPrice = document.lisitingHistoryForm.listingPrice.value;
    listingNotes = $('#listingNotes').val();

    if (chkIsBlank('lisitingHistoryForm', 'mlsNo', 'Please enter MLS #') &&
        isDateOKForMMDDYY('lisitingHistoryForm', 'listingDate1', 'Listing Date1.') &&
        validateAmountAllowBlank('lisitingHistoryForm', 'listingPrice', 'Please Enter Correct Listing Price Amount.')) {
        url = "../pops/listingInfoSave.php";
        qstr = "LID=" + LID + "&LMRId=" + LMRId + "&mlsNo=" + mlsNo + "&listingDate=" + listingDate1 + "&listingPrice=" + listingPrice + "&listingNotes=" + encodeURIComponent(listingNotes);
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            cnt = xmlDoc.getElementsByTagName("rsResp")[0].firstChild.nodeValue;
        } catch (e) {
        }
        showListingInfo(encryptedLMRId);
    } else {
        return false;
    }
}

function validateRecentSaleForm(formName) {
    if (chkIsBlank(formName, 'salePrice', 'Please enter Sale Price') &&
        isDateOK(formName, 'saleDate', 'Sale Date') &&
        validateAmountAllowBlank(formName, 'listPrice', 'Please Enter Correct List Price Amount.') &&
        //checkValidNumber(formName,'salePrice','Sale Price') &&
        checkValidNumber(formName, 'recentBuilt', 'Year Built') &&
        checkValidNumber(formName, 'daysOnMkt', 'Days on Market')

    ) {
        return true;
    } else {
        return false;
    }
}

function showRecentSaleInfo(LMRId, isHMLO) {
    var url = "", qstr = "";
    url = "../backoffice/getRecentSaleInfo.php";
    qstr = "LMRId=" + LMRId + "&isHMLO=" + isHMLO;
    var recentSaleInfoArray = new Array(), displayList = "";

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        recentSaleInfoArray = xmlDoc.getElementsByTagName("RecentSale");
    } catch (e) {
    }
    displayList = "<table class='table table-hover LWcustomTable table-bordered table-condensed table-sm table-vertical-center'>" +
        "<thead class=\"thead-light\"><tr>" +
        "<th colspan=\"2\">#</th>" +
        "<th nowrap style=\"border-right:1px solid #ffffff;\">List Price</th>" +
        "<th nowrap style=\"border-right:1px solid #ffffff;\">Sale Price</th>" +
        "<th style=\"border-right:1px solid #ffffff;\">Type of Financing</th>" +
        "<th style=\"border-right:1px solid #ffffff;\">Date of Sale</th>" +
        "<th style=\"border-right:1px solid #ffffff;\">Days on Market</th>" +
        "<th style=\"border-right:1px solid #ffffff;\">Year Built</th>";

    if (isHMLO == 1) {
        displayList += "<td style=\"border-right:1px solid #ffffff;\">Property Address</td>" +
            "<th style=\"border-right:1px solid #ffffff;\"># of bedroom</th>" +
            "<th style=\"border-right:1px solid #ffffff;\"># of baths</th>" +
            "<th style=\"border-right:1px solid #ffffff;\">sq ft</th>" +
            "<th class=\"force-wrap\" style=\"border-right:1px solid #ffffff;\">URL link 1 to Property</th>" +
            "<th style=\"border-right:1px solid #ffffff;\">lot size</th>";


    }

    displayList += "<th>NOTES</th>" +
        "<th>&nbsp;</th>" +
        "</tr></thead>";
    for (var ub = 0; ub < recentSaleInfoArray.length; ub++) {
        var listPrice = "", salePrice = "", financingType = "", saleDate = "";
        var daysOnMkt = "", age = "", noOfBathroom = '', saleSqFt = '', salePropertyURLLink1 = '';
        var recentBuilt = "", recentSalesNotes = "", salePropertyAddress = '', noOfBedroom = '';
        var LMRId = "", RSID = "", slno = 0, encLMRId = "", encRSID = "", saleLotSize = '', isHMLO = 0;
        try {
            listPrice = recentSaleInfoArray[ub].getElementsByTagName("listPrice")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            salePrice = recentSaleInfoArray[ub].getElementsByTagName("salePrice")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            financingType = recentSaleInfoArray[ub].getElementsByTagName("financingType")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            saleDate = recentSaleInfoArray[ub].getElementsByTagName("saleDate")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            daysOnMkt = recentSaleInfoArray[ub].getElementsByTagName("daysOnMkt")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            recentBuilt = recentSaleInfoArray[ub].getElementsByTagName("recentBuilt")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            recentSalesNotes = recentSaleInfoArray[ub].getElementsByTagName("recentSalesNotes")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        /** Added the new fields in HMLO Module's on Jan 30, 2017 **/
        try {
            salePropertyAddress = recentSaleInfoArray[ub].getElementsByTagName("salePropertyAddress")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            noOfBedroom = recentSaleInfoArray[ub].getElementsByTagName("noOfBedroom")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            noOfBathroom = recentSaleInfoArray[ub].getElementsByTagName("noOfBathroom")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            saleSqFt = recentSaleInfoArray[ub].getElementsByTagName("saleSqFt")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            salePropertyURLLink1 = recentSaleInfoArray[ub].getElementsByTagName("salePropertyURLLink1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            saleLotSize = recentSaleInfoArray[ub].getElementsByTagName("saleLotSize")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            encLMRId = recentSaleInfoArray[ub].getElementsByTagName("encLMRId")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            isHMLO = recentSaleInfoArray[ub].getElementsByTagName("isHMLO")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            encRSID = recentSaleInfoArray[ub].getElementsByTagName("encRSID")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        slno = ub + 1;
        var tmpCls = "";
        if ((slno % 2) == 0) {
            tmpCls = "even";
        }
        displayList += "<tr>";
        displayList += "<td>" + slno + "</td>";
        displayList += "<td><a data-href=  '" + POPSURL + "addRecentSalesInfo.php' class=\"change btn btn-xs btn-light btn-text-primary btn-hover-primary btn-icon m-1\"  data-wsize = 'modal-default' data-name='Recent sale Info'  data-toggle='modal' data-target='#exampleModal1' style=\"text-decoration:none;\" data-id=\"LMRID=" + encLMRId + "&RSID=" + encRSID + "\" ><i class=\" far fa-edit tooltipClass\" title=\"Click to edit\"></i></a></td>";
        displayList += "<td>" + convertInputToAbsoluteValueWithDollar(listPrice) + "</td>";
        displayList += "<td>" + convertInputToAbsoluteValueWithDollar(salePrice) + "</td>";
        displayList += "<td>" + financingType + "</td>";
        displayList += "<td>" + saleDate + "</td>";
        displayList += "<td>" + daysOnMkt + "</td>";
        displayList += "<td>" + recentBuilt + "</td>";

        if (isHMLO == 1) {
            displayList += "<td nowrap style =\" ";
            if (isHMLO == 1) {
                displayList += "width:10%";
            } else {
                displayList += "width:20%";
            }
            ;
            displayList += "\">" + salePropertyAddress + "</td>";
            displayList += "<td>" + noOfBedroom + "</td>";
            displayList += "<td>" + noOfBathroom + "</td>";
            displayList += "<td>" + saleSqFt + "</td>";
            displayList += "<td style=\"width:10%\" class=\"force-wrap\">" + "<a href=" + salePropertyURLLink1 + " target=\"_blank\">" + salePropertyURLLink1 + "</a></td>";
            displayList += "<td>" + saleLotSize + "</td>";
        }			//alert(displayList);

        displayList += "<td style=\"width:20%\">" + recentSalesNotes + "</td>";
        displayList += "<td><a class=\"change btn btn-xs btn-light btn-text-primary btn-hover-primary btn-icon m-1\" style=\"text-decoration:none;\" href=\"javascript:deleteRecentSales('" + encLMRId + "','" + encRSID + "');\" ><i class=\"tooltipClass flaticon2-trash\" title=\"Click to delete\"></i></a></td>";
        displayList += "</tr>";
    }
    displayList += "</table>";
    try {
        document.getElementById("recentSalesTable").innerHTML = displayList;
    } catch (e) {
    }
    try {
        ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
}

function showListingInfo(LMRId) {
    var url = "", qstr = "";
    url = "../backoffice/getListingInfo.php";
    qstr = "LMRId=" + LMRId;
    var historyInfoArray = new Array(), displayList = "";
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        historyInfoArray = xmlDoc.getElementsByTagName("history");
    } catch (e) {
    }
    displayList = "<table class='table table-hover LWcustomTable table-bordered table-condensed table-sm table-vertical-center'>" +
        "<thead class=\"thead-light\"><tr>" +
        "<th >&nbsp;#</th>" +
        "<th >&nbsp;MLS #</th>" +
        "<th >&nbsp;Listing Date</th>" +
        "<th >&nbsp;Listing price</th>" +
        "<th >&nbsp;Notes</th>" +
        "<th>Actions</th>" +
        "</tr></thead>";

    for (var ub = 0; ub < historyInfoArray.length; ub++) {
        var mls = "", listingDate = "", listingPrice = "", listingNotes = "";
        var recentBuilt = "", recentSalesNotes = "";
        var LMRId = "", RSID = "", slno = 0, encLMRId = "", encLID = "";
        try {
            mls = historyInfoArray[ub].getElementsByTagName("mls")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            listingPrice = historyInfoArray[ub].getElementsByTagName("listingPrice")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            listingDate = historyInfoArray[ub].getElementsByTagName("listingDate")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            listingNotes = historyInfoArray[ub].getElementsByTagName("listingNotes")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            encLMRId = historyInfoArray[ub].getElementsByTagName("encLMRId")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            encLID = historyInfoArray[ub].getElementsByTagName("encLID")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        slno = ub + 1;
        var tmpCls = "";
        if ((slno % 2) == 0) {
            tmpCls = "even";
        }
        displayList += "<tr>";
        displayList += "<td valign=\"top\">" + slno + "</td>";
        displayList += "<td valign=\"top\">" + mls + "</td>";
        displayList += "<td valign=\"top\">" + listingDate + "</td>";
        displayList += "<td valign=\"top\">" + listingPrice + "</td>";
        displayList += "<td valign=\"top\">" + listingNotes + "</td>";
        displayList += "<td valign=\"top\" ><a data-href='" + POPSURL + "addListingInfo.php' class=\"btn btn-sm btn-light btn-text-primary btn-hover-primary btn-icon m-1 tooltipClass\"  data-wsize = 'modal-default' data-name='Lisiting History Info'  data-toggle='modal' data-target='#exampleModal1' style=\"text-decoration:none;\" data-id=\"LMRID=" + encLMRId + "&LID=" + encLID + "\" ><i class=\" far fa-edit tooltipClass\" title=\"Click to edit\"></i></a><a class=\"btn btn-xs btn-danger btn-text-primary  btn-icon m-1 tooltipClass\" style=\"text-decoration:none;\" href=\"javascript:deleteListingHistoryInfo('" + encLMRId + "','" + encLID + "');\" ><i class=\"tooltipClass flaticon2-trash\" title=\"Click to delete\"></i></a></td>";
        displayList += "</tr>";
    }
    displayList += "</table>";
    try {
        document.getElementById("showListingHistory").innerHTML = displayList;
    } catch (e) {
    }
    try {
        ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
}

function deleteRecentSales(LMRId, RSID, isHMLO) {

    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: "Are you sure to delete?",
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            yes: function () {
                var delCnt = 0, url = "", qstr = "";
                url = "../backoffice/deleteRecentSalesInfo.php";
                qstr = "RSID=" + RSID + "&lId=" + LMRId;

                try {
                    xmlDoc = getXMLDoc(url, qstr);
                } catch (e) {
                }
                try {
                    delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
                } catch (e) {
                }
                if (delCnt > 0) {
                    showRecentSaleInfo(LMRId, isHMLO);
                }

            },
            cancel: function () {

            },
        },
    });
}

function deleteCMAAnalysis(LMRId, SCID) {
    var cfmMsg = "Are you sure  to delete?";
    if (confirm(cfmMsg)) {
        var delCnt = 0, url = "", qstr = "";
        url = "../backoffice/deleteCMAAnalysis.php";
        qstr = 'LMRID=' + LMRId + '&SCID=' + SCID;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
        } catch (e) {
        }
        if (delCnt > 0) {
            idval = "#table_" + SCID;
            $(idval).remove();
        }
    }
}

function addRecentSalesInfo(LMRId, RSID, isHMLO) {
    qstr = 'LMRID=' + LMRId + '&RSID=' + RSID + '&isHMLO=' + isHMLO;
    eval("ContactPop.showOverlay('" + POPSURL + "addRecentSalesInfo.php')"); /** Open Popup **/
}

function addListingInfo(LMRId, LID) {
    qstr = 'LMRID=' + LMRId + '&LID=' + LID;
    eval("ContactPop.showOverlay('" + POPSURL + "addListingInfo.php')"); /** Open Popup **/
}

function checkAgentBranchRelation(formName, opt) {
    var agentId = 0, branchId = 0, status = 0, branchName = '', userRole = '', branch = '',
        allowToChangeOrAssignBranchForFile = 1;
    var agentAndBranchAsLabel = 0;

    branchId = $('#branchId').val();

    eval("userRole = document." + formName + ".userRole.value");
    eval("allowToChangeOrAssignBranchForFile = document." + formName + ".allowToChangeOrAssignBranchForFile.value");
    eval("agentAndBranchAsLabel = document." + formName + ".agentAndBranchAsLabel.value");

    if (agentAndBranchAsLabel == 1) {
        return true; /* To skip the check for the CFPB auditors and auditing companies */
    }

    if (userRole == 'Agent' && opt == 'popup') {
        agentId = $('#assignedAgentId').val();
    } else {
        agentId = $('#agentId').val();
    }
    if (userRole == 'Branch' || userRole == 'Client' || allowToChangeOrAssignBranchForFile == 0) {
    } else {
        eval("branch = document." + formName + ".branchId");
        branchName = branch.options[branch.selectedIndex].text;
    }
    if (agentId != '' && agentId != '0') {

        var url = "../backoffice/checkAgentBranchRelation.php";
        var qstr = "branchId=" + branchId + "&agentId=" + agentId + "&opt=" + opt;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            status = xmlDoc.getElementsByTagName("status")[0].firstChild.nodeValue;
        } catch (e) {
        }
        if (status > 0) {
            return true;
        } else {
            if (userRole == 'Branch') {
                mg = "This agent is not linked to you. Do you want to link this agent?";
            } else if (userRole == 'Client') {
            } else {
                mg = "This agent is not linked to " + branchName + " branch. Do you want to link this agent to the " + branchName + " branch?";
            }
            if (userRole == 'Client') {
                return true;
            } else {
                if (confirm(mg)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    } else {
        return true;
    }
}

function saveAdditionalLiensInfo() {
    if (validateAdditionalLienForm('additionalLiensForm')) {
        var listingNotes = "", listingPrice = "", addLienBalance = "", addLienServicer = "", LID = 0, LMRId = 0;
        var url = "", qstr = "", xmlDoc = "", addLienInterestRate = "", addLienLoanNumb = 0, noOfMonthsBehind = 0;
        var fileNumber = 0, contactName = "", addLienPhone1 = "", addLienPhone2 = "", addLienPhone3 = "",
            addLienPhoneExt = "";
        var addLienFax1 = "", addLienFax2 = "", addLienFax3 = "", addLienEmail = "";

        var contactName2 = "", addLien2Phone1 = "", addLien2Phone2 = "", addLien2Phone3 = "", addLien2PhoneExt = "";
        var addLien2Fax1 = "", addLien2Fax2 = "", addLien2Fax3 = "", addLienEmail2 = "";

        var contactName3 = "", addLien3Phone1 = "", addLien3Phone2 = "", addLien3Phone3 = "", addLien3PhoneExt = "";
        var addLien3Fax1 = "", addLien3Fax2 = "", addLien3Fax3 = "", addLienEmail3 = "";

        LMRId = $('#LMRId').val();
        encryptedLMRId = document.loanModForm.encryptedLId.value;

        addLienServicer = $('#addLienServicer').val();
        addLienBalance = $('#addLienBalance').val();
        addLienInterestRate = $('#addLienInterestRate').val();
        addLienLoanNumb = $('#addLienLoanNumb').val();
        noOfMonthsBehind = $('#noOfMonthsBehind').val();
        fileNumber = $('#fileNumber').val();

        contactName = $('#contactName').val();
        addLienPhone1 = $('#addLienPhone1').val();
        addLienPhone2 = $('#addLienPhone2').val();
        addLienPhone3 = $('#addLienPhone3').val();
        addLienPhoneExt = $('#addLienPhoneExt').val();
        addLienFax1 = $('#addLienFax1').val();
        addLienFax2 = $('#addLienFax2').val();
        addLienFax3 = $('#addLienFax3').val();
        addLienEmail = $('#addLienEmail').val();

        contactName2 = $('#contactName2').val();
        addLien2Phone1 = $('#addLien2Phone1').val();
        addLien2Phone2 = $('#addLien2Phone2').val();
        addLien2Phone3 = $('#addLien2Phone3').val();
        addLien2PhoneExt = $('#addLien2PhoneExt').val();
        addLien2Fax1 = $('#addLien2Fax1').val();
        addLien2Fax2 = $('#addLien2Fax2').val();
        addLien2Fax3 = $('#addLien2Fax3').val();
        addLienEmail2 = $('#addLienEmail2').val();

        contactName3 = $('#contactName3').val();
        addLien3Phone1 = $('#addLien3Phone1').val();
        addLien3Phone2 = $('#addLien3Phone2').val();
        addLien3Phone3 = $('#addLien3Phone3').val();
        addLien3PhoneExt = $('#addLien3PhoneExt').val();
        addLien3Fax1 = $('#addLien3Fax1').val();
        addLien3Fax2 = $('#addLien3Fax2').val();
        addLien3Fax3 = $('#addLien3Fax3').val();
        addLienEmail3 = $('#addLienEmail3').val();


        url = "../pops/additionalLiensInfoSave.php";
        qstr = "LMRId=" + LMRId + "&addLienServicer=" + addLienServicer + "&addLienBalance=" + addLienBalance + "&addLienInterestRate=" + addLienInterestRate + "&addLienLoanNumb=" + addLienLoanNumb + "&noOfMonthsBehind=" + noOfMonthsBehind + "&fileNumber=" + fileNumber + "&contactName=" + encodeURIComponent(contactName) + "&addLienPhone1=" + addLienPhone1 + "&addLienPhone2=" + addLienPhone2 + "&addLienPhone3=" + addLienPhone3 + "&addLienPhoneExt=" + addLienPhoneExt + "&addLienFax1=" + addLienFax1 + "&addLienFax2=" + addLienFax2 + "&addLienFax3=" + addLienFax3 + "&addLienEmail=" + addLienEmail + "&contactName2=" + encodeURIComponent(contactName2) + "&addLien2Phone1=" + addLien2Phone1 + "&addLien2Phone2=" + addLien2Phone2 + "&addLien2Phone3=" + addLien2Phone3 + "&addLien2PhoneExt=" + addLien2PhoneExt + "&addLien2Fax1=" + addLien2Fax1 + "&addLien2Fax2=" + addLien2Fax2 + "&addLien2Fax3=" + addLien2Fax3 + "&addLienEmail2=" + addLienEmail2 + "&contactName3=" + encodeURIComponent(contactName3) + "&addLien3Phone1=" + addLien3Phone1 + "&addLien3Phone2=" + addLien3Phone2 + "&addLien3Phone3=" + addLien3Phone3 + "&addLien3PhoneExt=" + addLien3PhoneExt + "&addLien3Fax1=" + addLien3Fax1 + "&addLien3Fax2=" + addLien3Fax2 + "&addLien3Fax3=" + addLien3Fax3 + "&addLienEmail3=" + addLienEmail3;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            cnt = xmlDoc.getElementsByTagName("updateCnt")[0].firstChild.nodeValue;
        } catch (e) {
        }
        showAdditionalLiensInfo(encryptedLMRId);
    }
}

function showAdditionalLiensInfo(LMRId) {
    let url = "../backoffice/getAdditionalLiensInfo.php";
    let qstr = "LMRId=" + LMRId;
    let displayList = "";
    try {
        displayList = getResponse(url, qstr);
    } catch (e) {
    }
    try {
        document.getElementById("showAdditionalLiensHistory").innerHTML = displayList;
    } catch (e) {
    }
    try {
        ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
}

function saveRealEstateInfo() {
    var OPpropertyType = "", OPstreet = "", OPhouseNumber = 0, loanIdNumber = 0, SID = 0, LMRId = 0;
    var OPStatus = "", OPCity = "", OPZip = 0, OPState = "", OPOccupancy = "", OPPropVal = "";
    var OPMortBalance = "", OPMonthlyRent = "", OPMTGPay = "", OPITM = "", servicer = "";
    $selPurchaseDate = '';
    var selPurchasePrice = '', rehabBudget = 0, entityName = '', salePrice = 0, soldDate = '', refinanceDate = '',
        amountFinanced = 0;

    LMRId = $('#LMRId').val();
    encryptedLMRId = document.loanModForm.encryptedLId.value;
    OPpropertyType = $('#OPpropertyType').val();
    OPstreet = $('#OPstreet').val();
    OPhouseNumber = $('#OPhouseNumber').val();
    loanIdNumber = $('#loanIdNumber').val();
    SID = document.RealEstateForm.SID.value;
    OPStatus = $('#OPStatus').val();
    OPCity = $('#OPCity').val();
    OPZip = $('#OPZip').val();
    OPState = $('#OPState').val();
    OPOccupancy = $('#OPOccupancy').val();
    OPPropVal = $('#OPPropVal').val();
    OPMortBalance = $('#OPMortBalance').val();
    OPMonthlyRent = $('#OPMonthlyRent').val();
    OPMTGPay = $('#OPMTGPay').val();
    OPITM = $('#OPITM').val();
    servicer = processString($('#servicer1').val());

    selPurchaseDate = $('#selPurchaseDate').val();
    selPurchasePrice = $('#selPurchasePrice').val();
    rehabBudget = $('#rehabBudget').val();
    entityName = $('#entityName').val();
    salePrice = $('#salePrice').val();
    soldDate = $('#soldDate').val();
    refinanceDate = $('#refinanceDate').val();
    amountFinanced = $('#amountFinanced').val();

    url = "../pops/realEstateInfoSave.php";
    qstr = "LMRId=" + LMRId + "&OPpropertyType=" + OPpropertyType + "&OPstreet=" + OPstreet + "&OPhouseNumber=" + OPhouseNumber + "&loanIdNumber=" + loanIdNumber + "&SID=" + SID + "&OPStatus=" + OPStatus + "&OPCity=" + OPCity + "&OPZip=" + OPZip + "&OPState=" + OPState + "&OPOccupancy=" + OPOccupancy + "&OPPropVal=" + OPPropVal + "&OPMortBalance=" + OPMortBalance + "&OPMonthlyRent=" + OPMonthlyRent + "&OPMTGPay=" + OPMTGPay + "&OPITM=" + OPITM + "&servicer=" + servicer + "&selPurchaseDate=" + selPurchaseDate + "&selPurchasePrice=" + selPurchasePrice + "&rehabBudget=" + rehabBudget + "&entityName=" + entityName + "&salePrice=" + salePrice + "&soldDate=" + soldDate + "&refinanceDate=" + refinanceDate + "&amountFinanced=" + amountFinanced;

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        cnt = xmlDoc.getElementsByTagName("updateCnt")[0].firstChild.nodeValue;
    } catch (e) {
    }
    showRealEstateInfo(encryptedLMRId);

}

function showRealEstateInfo(LMRId) {
    var url = "", qstr = "";
    url = "../backoffice/getRealEstateInfo.php";
    qstr = "LMRId=" + LMRId;
    var displayList = "";
    try {
        displayList = getResponse(url, qstr);
    } catch (e) {
    }
    try {
        document.getElementById("showRealEstateHistory").innerHTML = displayList;
    } catch (e) {
    }
    // eval("ContactPop.init('" + POPSURL + "addRealEstateInfo.php', 'addRealEstateInfo.php', 'Add Schedule of Real Estate', '" + POPSURL + "','realEstateInfoSave.php' , 900, 220)");
    try {
        //  ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
    $('#exampleModal1').modal('toggle');
}

function validateRepInfo(formName) {
    if (chkIsBlank(formName, 'lien1Bank1RepName	', 'Please enter rep name') &&
        chkPhoneNumber(formName, 'lien1RepPhone1', 'lien1RepPhone2', 'lien1RepPhone3') &&
        checkValidEmailId(formName, 'lien1Bank1RepEmail') &&
        checkValidNumber(formName, 'lien1RepFax1', 'Lien1 Rep Fax Number') &&
        checkValidNumber(formName, 'lien1RepFax2', 'Lien1 Rep Fax Number') &&
        checkValidNumber(formName, 'lien1Bank1RepZip', 'Lien1 Rep Zip Code') &&
        checkValidNumber(formName, 'lien1RepFax3', 'Lien1 Rep Fax Number')
    ) {
        saveRepInfo();
    } else {
        return false;
    }
}

function validateRepInfo2(formName) {
    if (chkIsBlank(formName, 'lien2Bank1RepName	', 'Please enter rep name') &&
        chkPhoneNumber(formName, 'lien2RepPhone1', 'lien2RepPhone2', 'lien2RepPhone3') &&
        checkValidEmailId(formName, 'lien2Bank1RepEmail') &&
        checkValidNumber(formName, 'lien2RepFax1', 'Lien1 Rep Fax Number') &&
        checkValidNumber(formName, 'lien2RepFax2', 'Lien1 Rep Fax Number') &&
        //        checkValidNumber(formName,'lien2Bank2RepZip','Lien1 Rep Zip Code') &&
        checkValidNumber(formName, 'lien2RepFax3', 'Lien1 Rep Fax Number')
    ) {
        saveRep2Info();
    } else {
        return false;
    }
}

function saveRepInfo() {
    var url = "", qstr = "", xmlDoc = "", proposalId = 0, LMRId = 0;
    var lien1Bank1RepName = "", lien1Bank1RepCallCenter = "", lien1Bank1RepAdd = "", lien1RepCity = "",
        lien1Bank1RepState = "";
    var lien1Bank1RepZip = "";
    var lenderDetails = "";
    var brStr1 = "", lien1Bank1RepPhoneNo = '', lien1Bank1RepFax = '';

    LMRId = $('#LMRId').val();
    proposalId = $('#proposalId').val();
    encryptedLMRId = document.loanModForm.encryptedLId.value;
    lien1Bank1RepName = $('#lien1Bank1RepName').val();
    lien1RepPhone1 = $('#lien1RepPhone1').val();
    lien1RepPhone2 = $('#lien1RepPhone2').val();
    lien1RepPhone3 = $('#lien1RepPhone3').val();
    lien1RepPhoneExt = $('#lien1RepPhoneExt').val();

    lien1RepFax1 = $('#lien1RepFax1').val();
    lien1RepFax2 = $('#lien1RepFax2').val();
    lien1RepFax3 = $('#lien1RepFax3').val();

    lien1Bank1RepEmail = $('#lien1Bank1RepEmail').val();
    lien1Bank1RepDept = $('#lien1Bank1RepDept').val();

    lien1Bank1RepCallCenter = $('#lien1Bank1RepCallCenter').val();
    lien1Bank1RepAdd = $('#lien1Bank1RepAdd').val();
    lien1RepCity = $('#lien1RepCity').val();
    lien1Bank1RepState = $('#lien1Bank1RepState').val();
    lien1Bank1RepZip = $('#lien1Bank1RepZip').val();
    lien1Bank1RepPhoneNo = trim(lien1RepPhone1) + trim(lien1RepPhone2) + trim(lien1RepPhone3) + trim(lien1RepPhoneExt);
    lien1Bank1RepFax = trim(lien1RepFax1) + trim(lien1RepFax2) + trim(lien1RepFax3);

    if (lien1Bank1RepPhoneNo != '') lien1Bank1RepPhoneNo = "(" + lien1RepPhone1 + ") " + lien1RepPhone2 + " - " + lien1RepPhone3;
    if (lien1RepPhoneExt != '') lien1Bank1RepPhoneNo += " Ext " + lien1RepPhoneExt;

    if (lien1Bank1RepFax != '') lien1Bank1RepFax = "(" + lien1RepFax1 + ") " + lien1RepFax2 + " - " + lien1RepFax3;

    url = "../pops/editRepSave.php";
    qstr = "LMRId=" + LMRId + "&proposalId=" + proposalId + "&lien1Bank1RepName=" + encodeURIComponent(lien1Bank1RepName) + "&lien1RepPhone1=" + lien1RepPhone1 + "&lien1RepPhone2=" + lien1RepPhone2 + "&lien1RepPhone3=" + lien1RepPhone3 + "&lien1RepPhoneExt=" + lien1RepPhoneExt + "&lien1RepFax1=" + lien1RepFax1 + "&lien1RepFax2=" + lien1RepFax2 + "&lien1RepFax3=" + lien1RepFax3 + "&lien1Bank1RepEmail=" + lien1Bank1RepEmail + "&lien1Bank1RepDept=" + lien1Bank1RepDept + "&lien1Bank1RepCallCenter=" + lien1Bank1RepCallCenter + "&lien1Bank1RepAdd=" + lien1Bank1RepAdd + "&lien1RepCity=" + lien1RepCity + "&lien1Bank1RepState=" + lien1Bank1RepState + "&lien1Bank1RepZip=" + lien1Bank1RepZip;

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        cnt = xmlDoc.getElementsByTagName("proposalId")[0].firstChild.nodeValue;
    } catch (e) {
    }

    if (trim(lien1Bank1RepEmail) != "") lenderDetails += brStr1 + "<b> Email:       </b> " + lien1Bank1RepEmail;
    brStr1 = "<br>";
    if (trim(lien1Bank1RepPhoneNo) != "") lenderDetails += brStr1 + "<b> Phone:       </b> " + lien1Bank1RepPhoneNo;
    brStr1 = "<br>";
    if (trim(lien1Bank1RepFax) != "") lenderDetails += brStr1 + "<b> Fax:         </b> " + lien1Bank1RepFax;
    brStr1 = "<br>";
    if (trim(lien1Bank1RepDept) != "") lenderDetails += brStr1 + "<b> Dept:        </b> " + lien1Bank1RepDept;
    brStr1 = "<br>";
    if (trim(lien1Bank1RepCallCenter) != "") lenderDetails += brStr1 + "<b> Call Center: </b> " + lien1Bank1RepCallCenter;
    brStr1 = "<br>";
    if (trim(lien1Bank1RepAdd) != "") lenderDetails += brStr1 + "<b> Address:            </b> " + lien1Bank1RepAdd;
    brStr1 = "<br>";
    if (trim(lien1Bank1RepState) != "") lenderDetails += brStr1 + "<b> State:  </b> " + lien1Bank1RepState;
    brStr1 = "<br>";
    if (trim(lien1RepCity) != "") lenderDetails += brStr1 + "<b> City:           </b> " + lien1RepCity;
    brStr1 = "<br>";
    if (trim(lien1Bank1RepZip) != "") lenderDetails += brStr1 + "<b> Zip:     </b> " + lien1Bank1RepZip;
    brStr1 = "<br>";

    $(".lien1_repName").html("Representative Name: <h5>" + lien1Bank1RepName + "</h5>");
    $(".lien1_info").attr("title", lenderDetails);
    //	showRepInfo(encryptedLMRId);

    eval("ContactPop.init('" + POPSURL + "editRepInfo.php', 'editRepInfo.php', 'Update Rep Info', '" + POPSURL + "','editRepSave.php' , 550,'350')");
    try {
        ContactPop.hideOverlay();
    } catch (e) {
    }
}

function saveRep2Info() {
    var url = "", qstr = "", xmlDoc = "", proposalId = 0, LMRId = 0;
    var lien2Bank1RepName = "", lien2Bank1RepCallCenter = "", lien2Bank2RepAdd = "", lien2RepCity = "",
        lien1Bank2RepStreet = "";
    var lien2Bank1RepZip = "", lien2RepPhone1 = '', lien2RepPhone2 = '', lien2RepPhone3 = '', lien2RepFax1 = '';
    var lien2RepFax2 = '', lien2RepFax3 = '', lien2Bank1RepEmail = '', lien2Bank2RepState = '', lien2Bank2RepDept = '';
    var lender2Details = "", brStr1 = "", lien2Bank1RepPhoneNo = '', lien2Bank1RepFax = '';

    LMRId = $('#LMRId').val();
    proposalId = $('#proposalId').val();
    encryptedLMRId = document.loanModForm.encryptedLId.value;
    lien2Bank1RepName = $('#lien2Bank1RepName').val();
    lien2RepPhone1 = $('#lien2RepPhone1').val();
    lien2RepPhone2 = $('#lien2RepPhone2').val();
    lien2RepPhone3 = $('#lien2RepPhone3').val();
    lien2RepPhoneExt = $('#lien2RepPhoneExt').val();

    lien2RepFax1 = $('#lien2RepFax1').val();
    lien2RepFax2 = $('#lien2RepFax2').val();
    lien2RepFax3 = $('#lien2RepFax3').val();

    lien2Bank1RepEmail = $('#lien2Bank1RepEmail').val();
    lien2Bank1RepDept = $('#lien2Bank1RepDept').val();
    lien2Bank1RepCallCenter = $('#lien2Bank1RepCallCenter').val();
    lien2Bank2RepAdd = $('#lien2Bank2RepAdd').val();
    lien2RepCity = $('#lien2RepCity').val();
    lien2Bank2RepState = $('#lien2Bank2RepState').val();
    lien2Bank2RepZip = $('#lien2Bank2RepZip').val();
    lien2Bank1RepPhoneNo = trim(lien2RepPhone1) + trim(lien2RepPhone2) + trim(lien2RepPhone3);
    lien2Bank1RepFax = trim(lien2RepFax1) + trim(lien2RepFax2) + trim(lien2RepFax2);

    if (lien2Bank1RepPhoneNo != '') lien2Bank1RepPhoneNo = "(" + lien2RepPhone1 + ") " + lien2RepPhone2 + " - " + lien2RepPhone3;
    if (lien2RepPhoneExt != '') lien2Bank1RepPhoneNo += " Ext " + lien2RepPhoneExt;

    if (lien2Bank1RepFax != '') lien2Bank1RepFax = "(" + lien2RepFax1 + ") " + lien2RepFax2 + " - " + lien2RepFax2;

    url = "../pops/editRep2Save.php";
    qstr = "LMRId=" + LMRId + "&proposalId=" + proposalId + "&lien2Bank1RepName=" + encodeURIComponent(lien2Bank1RepName) + "&lien2RepPhone1=" + lien2RepPhone1 + "&lien2RepPhone2=" + lien2RepPhone2 + "&lien2RepPhone3=" + lien2RepPhone3 + "&lien2RepPhoneExt=" + lien2RepPhoneExt + "&lien2RepFax1=" + lien2RepFax1 + "&lien2RepFax2=" + lien2RepFax2 + "&lien2RepFax3=" + lien2RepFax3 + "&lien2Bank1RepEmail=" + lien2Bank1RepEmail + "&lien2Bank1RepDept=" + lien2Bank1RepDept + "&lien2Bank1RepCallCenter=" + lien2Bank1RepCallCenter + "&lien2Bank2RepAdd=" + lien2Bank2RepAdd + "&lien2RepCity=" + lien2RepCity + "&lien2Bank2RepState=" + lien2Bank2RepState + "&lien2Bank2RepZip=" + lien2Bank2RepZip;

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        cnt = xmlDoc.getElementsByTagName("proposalId")[0].firstChild.nodeValue;
    } catch (e) {
    }

    if (trim(lien2Bank1RepEmail) != "") lender2Details += brStr1 + "<b> Email:       </b> " + lien2Bank1RepEmail;
    brStr1 = "<br>";
    if (trim(lien2Bank1RepPhoneNo) != "") lender2Details += brStr1 + "<b> Phone:       </b> " + lien2Bank1RepPhoneNo;
    brStr1 = "<br>";
    if (trim(lien2Bank1RepFax) != "") lender2Details += brStr1 + "<b> Fax:         </b> " + lien2Bank1RepFax;
    brStr1 = "<br>";
    if (trim(lien2Bank1RepDept) != "") lender2Details += brStr1 + "<b> Dept:        </b> " + lien2Bank1RepDept;
    brStr1 = "<br>";
    if (trim(lien2Bank1RepCallCenter) != "") lender2Details += brStr1 + "<b> Call Center: </b> " + lien2Bank1RepCallCenter;
    brStr1 = "<br>";
    if (trim(lien2Bank2RepAdd) != "") lender2Details += brStr1 + "<b> Address:      </b> " + lien2Bank2RepAdd;
    brStr1 = "<br>";
    if (trim(lien2Bank2RepState) != "") lender2Details += brStr1 + "<b> State:  </b> " + lien2Bank2RepState;
    brStr1 = "<br>";
    if (trim(lien2RepCity) != "") lender2Details += brStr1 + "<b> City:           </b> " + lien2RepCity;
    brStr1 = "<br>";
    if (trim(lien2Bank2RepZip) != "") lender2Details += brStr1 + "<b> Zip:     </b> " + lien2Bank2RepZip;
    brStr1 = "<br>";

    $(".lien2_repName").html("Representative Name: <h5>" + lien2Bank1RepName + "</h5>");
    $(".lien2_info").attr("title", lender2Details);
    eval("ContactPop.init('" + POPSURL + "editRep2Info.php', 'editRep2Info.php', 'Update Rep Info', '" + POPSURL + "','editRep2Save.php' , 550,'350')");
    try {
        ContactPop.hideOverlay();
    } catch (e) {
    }
    //	showRep2Info(encryptedLMRId);
}

function saveAttorneyInfo() {
    var url = "", qstr = "", xmlDoc = "", QAID = 0, LMRId = 0;
    var attorneyName = '', attorneyNum = '', attorneyFirmName = '', attorneyEmail = '', attorneyState = '';
    var attorneyPhone1 = '', attorneyPhone2 = '', attorneyPhone3 = '', attorneyPhoneExt = '', attorneyZip = '';
    var attorneyFax1 = '', attorneyFax2 = '', attorneyFax3 = '', attorneyAddress = '', attorneyCity = '';
    var attorneyDetails = "", brStr1 = "", attorneyPhone = '', attorneyFax = '', attorneyState = '';

    if (checkValidEmailId('employeeForm', 'attorneyEmail') &&
        chkPhoneNumber('employeeForm', 'attorneyPhone1', 'attorneyPhone2', 'attorneyPhone3') &&
        checkValidNumber('employeeForm', 'attorneyFax1', 'Attorney Fax1') &&
        checkValidNumber('employeeForm', 'attorneyFax2', 'Attorney Fax2') &&
        checkValidNumber('employeeForm', 'attorneyFax3', 'Attorney Fax3')
    ) {
        LMRId = $('#LMRId').val();
        QAID = $('#QAID').val();
        encryptedLMRId = document.loanModForm.encryptedLId.value;

        attorneyName = $('#attorneyName').val();
        attorneyNum = $('#attorneyNum').val();
        attorneyFirmName = $('#attorneyFirmName').val();
        attorneyEmail = $('#attorneyEmail').val();
        attorneyPhone1 = $('#attorneyPhone1').val();

        attorneyPhone2 = $('#attorneyPhone2').val();
        attorneyPhone3 = $('#attorneyPhone3').val();
        attorneyPhoneExt = $('#attorneyPhoneExt').val();

        attorneyFax1 = $('#attorneyFax1').val();
        attorneyFax2 = $('#attorneyFax2').val();
        attorneyFax3 = $('#attorneyFax3').val();
        attorneyAddress = $('#attorneyAddress').val();
        attorneyCity = $('#attorneyCity').val();
        attorneyState = $('#attorneyState').val();
        attorneyZip = $('#attorneyZip').val();
        attorneyPhone = trim(attorneyPhone1) + trim(attorneyPhone2) + trim(attorneyPhone3);
        attorneyFax = trim(attorneyFax1) + trim(attorneyFax2) + trim(attorneyFax3);

        if (attorneyPhone != '') attorneyPhone = "(" + attorneyPhone1 + ") " + attorneyPhone2 + " - " + attorneyPhone3;
        if (attorneyPhoneExt != '') attorneyPhone += " Ext " + attorneyPhoneExt;

        if (attorneyFax != '') attorneyFax = "(" + attorneyFax1 + ") " + attorneyFax2 + " - " + attorneyFax3;

        url = "../pops/editAttorneySave.php";
        qstr = "LMRId=" + LMRId + "&QAID=" + QAID + "&attorneyName=" + encodeURIComponent(attorneyName) + "&attorneyNum=" + attorneyNum + "&attorneyFirmName=" + attorneyFirmName + "&attorneyEmail=" + attorneyEmail + "&attorneyPhone1=" + attorneyPhone1 + "&attorneyPhone2=" + attorneyPhone2 + "&attorneyPhone3=" + attorneyPhone3 + "&attorneyPhoneExt=" + attorneyPhoneExt + "&attorneyFax1=" + attorneyFax1 + "&attorneyFax2=" + attorneyFax2 + "&attorneyFax3=" + attorneyFax3 + "&attorneyAddress=" + attorneyAddress + "&attorneyCity=" + attorneyCity + "&attorneyZip=" + attorneyZip + "&attorneyState=" + attorneyState;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            cnt = xmlDoc.getElementsByTagName("proposalId")[0].firstChild.nodeValue;
        } catch (e) {
        }

        if (trim(attorneyName) != "") attorneyDetails += brStr1 + "<b> Name:           </b> " + attorneyName;
        brStr1 = "<br>";
        if (trim(attorneyFirmName) != "") attorneyDetails += brStr1 + "<b> Firm:           </b> " + attorneyFirmName;
        brStr1 = "<br>";
        if (trim(attorneyEmail) != "") attorneyDetails += brStr1 + "<b> Email:          </b> " + attorneyEmail;
        brStr1 = "<br>";
        if (trim(attorneyPhone) != "") attorneyDetails += brStr1 + "<b> Phone:          </b> " + attorneyPhone;
        brStr1 = "<br>";
        if (trim(attorneyFax) != "") attorneyDetails += brStr1 + "<b> Fax:            </b> " + attorneyFax;
        brStr1 = "<br>";
        if (trim(attorneyAddress) != "") attorneyDetails += brStr1 + "<b> Address:        </b> " + attorneyAddress;
        brStr1 = "<br>";
        if (trim(attorneyCity) != "") attorneyDetails += brStr1 + "<b> City:           </b> " + attorneyCity;
        brStr1 = "<br>";
        if (trim(attorneyState) != "") attorneyDetails += brStr1 + "<b> State:            </b> " + attorneyState;
        brStr1 = "<br>";
        if (trim(attorneyZip) != "") attorneyDetails += brStr1 + "<b> Zip:            </b> " + attorneyZip;
        brStr1 = "<br>";
        if (trim(attorneyNum) != "") attorneyDetails += brStr1 + "<b> Sale #:          </b> " + attorneyNum;
        brStr1 = "<br>";

        $(".attorney_Name").html("Name: <h5>" + attorneyName + "</h5>");
        $(".attorney_FName").html("Firm: <h5>" + attorneyFirmName + "</h5>");
        $(".attorney_Email").html("Email: <h5>" + attorneyEmail + "</h5>");
        $(".attorney_Phone").html("Phone: <h5>" + attorneyPhone + "</h5>");
        $(".attorney_Fax").html("Fax: <h5>" + attorneyFax + "</h5>");
        $(".attorney_Info").attr("title", attorneyDetails);

        eval("ContactPop.init('" + POPSURL + "editAttorneyInfo.php', 'editAttorneyInfo.php', 'Edit Attorney Info', '" + POPSURL + "','editAttorneySave.php' , 600,'300')");
        try {
            ContactPop.hideOverlay();
        } catch (e) {
        }
    }

    //	showAttorneyInfo(encryptedLMRId);
}

function savePOAttorneyInfo() {
    var url = "", qstr = "", xmlDoc = "", SSID = 0, LMRId = 0;
    var attorneyName = '', attorneyNum = '', attorneyFirmName = '', attorneyEmail = '', attorneyState = '';
    var attorneyPhone1 = '', attorneyPhone2 = '', attorneyPhone3 = '', attorneyPhoneExt = '', attorneyZip = '';
    var attorneyFax1 = '', attorneyFax2 = '', attorneyFax3 = '', attorneyAddress = '', attorneyCity = '';
    var realtorDetails = "", brStr1 = "", attorneyPhone = '', attorneyFax = '';

    if (checkValidEmailId('POAttorneyForm', 'RepAttorneyEmail') && chkPhoneNumber('POAttorneyForm', 'RepAttorneyPhone1', 'RepAttorneyPhone2', 'RepAttorneyPhone3') &&
        chkPhoneNumber('POAttorneyForm', 'RepAttorneyCell1', 'RepAttorneyCell2', 'RepAttorneyCell3') &&
        chkPhoneNumber('POAttorneyForm', 'RepAttorneyFax1', 'RepAttorneyFax2', 'RepAttorneyFax3')) {

        LMRId = $('#LMRId').val();
        SSID = $('#SSID').val();
        encryptedLMRId = document.loanModForm.encryptedLId.value;
        RepAttorneyName = $('#RepAttorneyName').val();
        firmName = $('#firmName').val();
        RepAttorneyEmail = $('#RepAttorneyEmail').val();
        RepAttorneyPhone1 = $('#RepAttorneyPhone1').val();
        RepAttorneyPhone2 = $('#RepAttorneyPhone2').val();
        RepAttorneyPhone3 = $('#RepAttorneyPhone3').val();
        RepAttorneyPhoneExt = $('#RepAttorneyPhoneExt').val();


        RepAttorneyCell1 = $('#RepAttorneyCell1').val();
        RepAttorneyCell2 = $('#RepAttorneyCell2').val();
        RepAttorneyCell3 = $('#RepAttorneyCell3').val();

        RepAttorneyFax1 = $('#RepAttorneyFax1').val();
        RepAttorneyFax2 = $('#RepAttorneyFax2').val();
        RepAttorneyFax3 = $('#RepAttorneyFax3').val();
        RepAttorneyNotes = $('#RepAttorneyNotes').val();

        attorneyPhone = trim(RepAttorneyPhone1) + trim(RepAttorneyPhone2) + trim(RepAttorneyPhone3);
        attorneyCell = trim(RepAttorneyCell1) + trim(RepAttorneyCell2) + trim(RepAttorneyCell3);
        attorneyFax = trim(RepAttorneyFax1) + trim(RepAttorneyFax2) + trim(RepAttorneyFax3);

        if (attorneyPhone != '') attorneyPhone = "(" + RepAttorneyPhone1 + ") " + RepAttorneyPhone2 + " - " + RepAttorneyPhone3;
        if (RepAttorneyPhoneExt != '') attorneyPhone += " Ext " + RepAttorneyPhoneExt;

        if (attorneyFax != '') attorneyFax = "(" + RepAttorneyFax1 + ") " + RepAttorneyFax2 + " - " + RepAttorneyFax3;
        if (attorneyCell != '') attorneyCell = "(" + RepAttorneyCell1 + ") " + RepAttorneyCell2 + " - " + RepAttorneyCell3;

        url = "../pops/editPOAttorneySave.php";
        qstr = "LMRId=" + LMRId + "&SSID=" + SSID + "&RepAttorneyName=" + encodeURIComponent(RepAttorneyName) + "&firmName=" + encodeURIComponent(firmName) + "&RepAttorneyEmail=" + RepAttorneyEmail + "&RepAttorneyPhone1=" + RepAttorneyPhone1 + "&RepAttorneyPhone2=" + RepAttorneyPhone2 + "&RepAttorneyPhone3=" + RepAttorneyPhone3 + "&RepAttorneyPhoneExt=" + RepAttorneyPhoneExt + "&RepAttorneyCell1=" + RepAttorneyCell1 + "&RepAttorneyCell2=" + RepAttorneyCell2 + "&RepAttorneyCell3=" + RepAttorneyCell3 + "&RepAttorneyFax1=" + RepAttorneyFax1 + "&RepAttorneyFax2=" + RepAttorneyFax2 + "&RepAttorneyFax3=" + RepAttorneyFax3 + "&RepAttorneyNotes=" + encodeURIComponent(RepAttorneyNotes);

        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            cnt = xmlDoc.getElementsByTagName("proposalId")[0].firstChild.nodeValue;
        } catch (e) {
        }

        brStr1 = '';
        realtorDetails = '';
        if (trim(RepAttorneyName) != "") realtorDetails += brStr1 + "<b> Name:           </b> " + RepAttorneyName;
        brStr1 = "<br>";
        if (trim(firmName) != "") realtorDetails += brStr1 + "<b> Firm:           </b> " + firmName;
        brStr1 = "<br>";
        if (trim(RepAttorneyEmail) != "") realtorDetails += brStr1 + "<b> Email:          </b> " + RepAttorneyEmail;
        brStr1 = "<br>";
        if (trim(attorneyPhone) != "") realtorDetails += brStr1 + "<b> Phone:          </b> " + attorneyPhone;
        brStr1 = "<br>";
        if (trim(attorneyCell) != "") realtorDetails += brStr1 + "<b> Cell:           </b> " + attorneyCell;
        brStr1 = "<br>";
        if (trim(attorneyFax) != "") realtorDetails += brStr1 + "<b> Fax:            </b> " + attorneyFax;
        brStr1 = "<br>";

        $(".realtor_Name").html("Name: <h5>" + RepAttorneyName + "</h5>");
        $(".realtor_FName").html("Firm: <h5>" + firmName + "</h5>");
        $(".realtor_Email").html("Email: <h5>" + RepAttorneyEmail + "</h5>");
        $(".realtor_Phone").html("Phone: <h5>" + attorneyPhone + "</h5>");
        $(".realtor_Fax").html("Fax: <h5>" + attorneyFax + "</h5>");
        $(".realtor_Info").attr("title", realtorDetails);
        eval("ContactPop.init('" + POPSURL + "editProbAttorneyInfo.php', 'editProbAttorneyInfo.php', 'Edit Attorney Info', '" + POPSURL + "','editPOAttorneySave.php' , 600,'300')");
        try {
            ContactPop.hideOverlay();
        } catch (e) {
        }
    }
}

function printerfriendlytextbox(fieldname, borrowername, borrowerlname) {
    childWin = open("", "childWin", "toolbar,scrollbars,menubar,status,innerwidth=300,innerheight=200");
    var txtobj = document.getElementById(fieldname);
    var newstring1 = txtobj.value;
    //    var borrowername = document.loanModForm.borrowerFName.value;
    //    var borrowerlname = document.loanModForm.borrowerLName.value;
    var regExp = /\n/gi;
    newstring1 = newstring1.replace(regExp, '<br>');
    childWin.document.write("<p><b>" + borrowername + " " + borrowerlname + ":</b></p>");
    childWin.document.write(newstring1);
    childWin.document.write("<script type=\"text/javascript\">");
    childWin.document.write("window.print();</script>");
    return false;
}

/* Show and hide primary res info section based on occupancy */
function principalResidenceInfo() {
    var fldValue = '';
    fldValue = document.loanModForm.occupancy.value;
    if (fldValue == '2nd Home' || fldValue == 'Non-Owner with Tenant' || fldValue == 'Non-Owner/Vacant') {
        try {
            document.getElementById('principalResidence').style.display = 'flex';
        } catch (e) {
        }
    } else {
        try {
            document.getElementById('principalResAddress').value = '';
            document.getElementById('lien1LoanNoPRI').value = '';
            document.getElementById('lien1PIPaymentPRI').value = '0';
            document.getElementById('lien1ServicerPRI').value = '';
            document.getElementById('lien2ServicerPRI').value = '';
            document.getElementById('lien2LoanNoPRI').value = '';
            document.getElementById('lien2PIPaymentPRI').value = '0';
            document.getElementById('HOANameAddrPRI').value = '';
            document.getElementById('HOAFeesPRI').value = '0';
            document.getElementById('monthTaxesPRI').value = '0';
            document.getElementById('propertyinsurancePRI').value = '0';
            document.getElementById('floodInsurancePRI').value = '0';
            document.getElementById('amountOfferPRI').value = '0';
            document.getElementById('closingDatePRI').value = '';
            document.getElementById('listDatePRI').value = '';
            document.getElementById('agentNamePRI').value = '';
            document.getElementById('PRIPhone1').value = '';
            document.getElementById('PRIPhone2').value = '';
            document.getElementById('PRIPhone3').value = '';
            document.getElementById('PRIPhoneExt').value = '';

            document.loanModForm.otherLienPRI[2].checked = true;
            document.loanModForm.condominiumHOAPRI[2].checked = true;
            document.loanModForm.HOAFeeCurrentPRI[2].checked = true;
            document.loanModForm.mortgagePaymentPRI[2].checked = true;
            document.loanModForm.purchaseOfferPRI[2].checked = true;
            document.loanModForm.propertysalePRI[2].checked = true;
            document.loanModForm.taxesInsurancePRI[2].checked = true;
        } catch (e) {
        }

        try {
            document.getElementById('principalResServicer1').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('principalResPhone1').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('principalResPhone2').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('principalResPhone3').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('principalResPhoneExt').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('principalPastDueMonths').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('principalResidence').style.display = 'none';
        } catch (e) {
        }
    }
}

/* Show and hide property listing fields */

function showAndHideProListDiv(fldValue, divId, noOfDiv) {
    if (noOfDiv > 0) {
        for (var i = 1; i <= noOfDiv; i++) {
            try {
                if (fldValue == 'Yes') {
                    eval("document.getElementById('" + divId + i + "').style.display = 'block'");
                } else {
                    document.getElementById('listDatePRI').value = '';
                    document.getElementById('agentNamePRI').value = '';
                    document.getElementById('PRIPhone1').value = '';
                    document.getElementById('PRIPhone2').value = '';
                    document.getElementById('PRIPhone3').value = '';
                    document.getElementById('PRIPhoneExt').value = '';
                    document.getElementById('PRIPhoneExt').value = '';
                    eval("document.getElementById('" + divId + i + "').style.display = 'none'");
                }
            } catch (e) {
            }
        }
    }
}

/* Show and hide purchase offer fields */

function showAndHidePurchaseDiv(fldValue, divId, noOfDiv) {
    if (noOfDiv > 0) {
        for (var i = 1; i <= noOfDiv; i++) {
            try {
                if (fldValue == 'Yes') {
                    eval("document.getElementById('" + divId + i + "').style.display = 'block'");
                } else {
                    document.getElementById('amountOfferPRI').value = '0';
                    document.getElementById('closingDatePRI').value = '';
                    eval("document.getElementById('" + divId + i + "').style.display = 'none'");
                }
            } catch (e) {
            }
        }
    }
}


/* Show and hide HOA section fields */

function showAndHideHOAListDiv(fldValue, divId, noOfDiv) {
    if (noOfDiv > 0) {
        for (var i = 1; i <= noOfDiv; i++) {
            try {
                if (fldValue == 'Yes') {
                    eval("document.getElementById('" + divId + i + "').style.display = 'block'");
                } else {
                    document.getElementById('HOANameAddrPRI').value = '';
                    document.getElementById('HOAFeesPRI').value = '0';
                    document.loanModForm.HOAFeeCurrentPRI[2].checked = true;

                    eval("document.getElementById('" + divId + i + "').style.display = 'none'");
                }
            } catch (e) {
            }
        }
    }
}


/* Show and hide otherLien fields */

function showAndHideOtherLienDiv(fldValue, divId, noOfDiv) {
    if (noOfDiv > 0) {
        for (var i = 1; i <= noOfDiv; i++) {
            try {
                if (fldValue == 'Yes') {
                    eval("document.getElementById('" + divId + i + "').style.display = 'block'");
                } else {
                    document.getElementById('lien2ServicerPRI').value = '';
                    document.getElementById('lien2LoanNoPRI').value = '';
                    document.getElementById('lien2PIPaymentPRI').value = '0';
                    eval("document.getElementById('" + divId + i + "').style.display = 'none'");
                }
            } catch (e) {
            }
        }
    }
}

function showAndHidetaxesDiv(fldValue, divId, noOfDiv) {
    if (noOfDiv > 0) {
        for (var i = 1; i <= noOfDiv; i++) {
            try {
                if (fldValue == 'No') {
                    eval("document.getElementById('" + divId + i + "').style.display = 'block'");
                } else {
                    document.loanModForm.taxesInsurancePRI[2].checked = true;
                    eval("document.getElementById('" + divId + i + "').style.display = 'none'");
                }
            } catch (e) {
            }
        }
    }
}


function checkDateOfBirth(val, name, msg) {
    var valid = false;
    if (isDateOKForMMDDYY(val, name, msg) == valid) {
        valid = false;
    } else {
        valid = true;
        var currentDate = new Date();
        var Yrs = 18;
        var val = document.loanModForm.borrowerDOB.value;

        var date = new Date(val);

        var passDate = date.getDate();
        var passMonth = date.getMonth() + 1;
        var passYear = date.getFullYear();

        var currentDate = new Date();
        var crntDate = currentDate.getDate();
        var crntMonth = currentDate.getMonth() + 1;
        var crntYear = currentDate.getFullYear();

        passYear = (date.getFullYear() + 16);

        if (crntMonth < 10) currentVal = '0' + passMonth + '/' + '0' + passDate + '/' + passYear;
        else currentVal = passMonth + '/' + passDate + '/' + passYear;

        var passValue = new Date(currentVal);

        if (Date.parse(currentDate) <= Date.parse(passValue)) {
            //alert('Please Enter Valid DOB');
            toastrNotification("Please Enter Valid DOB", 'error');
            return false;
        } else {
            return true;
        }
    }
}

/* Property Info Tab Validation */

function validatePropertyInfoForm() {
    if (checkValidNumber('loanModForm', 'propertySqFt', 'Property SqFt') &&
        checkValidNumber('loanModForm', 'acres', 'Acres') &&
        checkValidNumber('loanModForm', 'yearBuilt', 'Year Built') &&
        checkValidNumber('loanModForm', 'yearPurchased', 'Year Purchased') &&
        checkValidNumber('loanModForm', 'principalResPhone1', 'Principal residence phone number') &&
        checkValidNumber('loanModForm', 'principalResPhone2', 'Principal residence phone number') &&
        checkValidNumber('loanModForm', 'principalResPhone3', 'Principal residence phone number') &&
        checkValidNumber('loanModForm', 'principalResPhoneExt', 'Principal residence phone number') &&
        checkValidNumber('loanModForm', 'parcelNo', 'Parcel #') &&
        checkValidNumber('loanModForm', 'lockbox', 'Lockbox #') &&
        //       checkValidNumber('loanModForm','propertyZip','Property Zip Code') &&
        //       checkValidNumber('loanModForm','taxes1','Property tax') &&
        checkValidNumber('loanModForm', 'taxYear', 'Tax Year') &&
        checkValidNumber('loanModForm', 'lien1LoanNoPRI', 'lien1 Loan No') &&
        validateAmountAllowBlank('loanModForm', 'lien1PIPaymentPRI', 'Please Enter Correct 1st Lien Monthly P + I Payment.') &&
        checkValidNumber('loanModForm', 'lien2LoanNoPRI', 'lien2 Loan No') &&
        validateAmountAllowBlank('loanModForm', 'lien2PIPaymentPRI', 'Please Enter Correct 2nd Lien Monthly P&I Payment.') &&
        validateAmountAllowBlank('loanModForm', 'HOAFeesPRI', 'Please Enter Correct Monthly H.O.A. Fees.') &&
        validateAmountAllowBlank('loanModForm', 'monthTaxesPRI', 'Please Enter Correct Monthly Taxes.') &&
        validateAmountAllowBlank('loanModForm', 'propertyinsurancePRI', 'Please Enter Correct Monthly Property Insurance.') &&
        validateAmountAllowBlank('loanModForm', 'floodInsurancePRI', 'Please Enter Correct Flood Insurance.') &&
        validateAmountAllowBlank('loanModForm', 'amountOfferPRI', 'Please Enter Correct Amount of Offer.') &&
        isDateOKForMMDDYY('loanModForm', 'closingDatePRI', 'Closing Date.') &&
        isDateOKForMMDDYY('loanModForm', 'listDatePRI', 'List Date.') &&
        checkValidNumber('loanModForm', 'PRIPhone1', 'Listing Agent\'s Phone number') &&
        checkValidNumber('loanModForm', 'PRIPhone2', 'Listing Agent\'s Phone number') &&
        checkValidNumber('loanModForm', 'PRIPhone3', 'Listing Agent\'s Phone number') &&
        checkValidNumber('loanModForm', 'PRIPhoneExt', 'Listing Agent\'s Phone number') &&
        validateAmountAllowBlank('loanModForm', 'appraiser1Value', 'Please Enter Correct Appraiser As Is Value.') &&
        validateAmountAllowBlank('loanModForm', 'rehabValue', 'Please Enter Correct Rehabbed Value.') &&
        isDateOKForMMDDYY('loanModForm', 'dateObtained', 'Date Obtained.') &&
        validateAmountAllowBlank('loanModForm', 'appraiser2Value', 'Please Enter Correct Appraiser As Is Value.') &&
        validateAmountAllowBlank('loanModForm', 'rehabValue2', 'Please Enter Correct Rehabbed Value.') &&
        isDateOKForMMDDYY('loanModForm', 'dateObtained2', 'Date Obtained.') &&
        validateAmountAllowBlank('loanModForm', 'BPO1Value', 'Please Enter Correct BPO1 - As Is Value.') &&
        validateAmountAllowBlank('loanModForm', 'rehabValue3', 'Please Enter Correct Rehabbed Value.') &&
        isDateOKForMMDDYY('loanModForm', 'dateObtained3', 'Date Obtained.') &&
        validateAmountAllowBlank('loanModForm', 'BPO2Value', 'Please Enter Correct BPO2 - As Is Value.') &&
        validateAmountAllowBlank('loanModForm', 'rehabValue4', 'Please Enter Correct Rehabbed Value.') &&
        isDateOKForMMDDYY('loanModForm', 'dateObtained4', 'Date Obtained.') &&
        validateAmountAllowBlank('loanModForm', 'BPO3Value', 'Please Enter Correct BPO3 - As Is Value.') &&
        validateAmountAllowBlank('loanModForm', 'rehabValue5', 'Please Enter Correct Rehabbed Value.') &&
        isDateOKForMMDDYY('loanModForm', 'dateObtained5', 'Date Obtained.') &&
        validateAmountAllowBlank('loanModForm', 'condominiumOrHOAFeeAmt', 'Please Enter Correct Condominium Or HOA Fee Amount.') &&
        validateAmountAllowBlank('loanModForm', 'HOAOrCOAFeeAmt', 'Please Enter Correct Amount.') &&
        //       checkValidNumber('loanModForm','HOAOrCOAFeeZip','Zip Code') &&
        //       checkValidNumber('loanModForm','feeAmtReceiverZip','Zip Code') &&
        checkValidNumber('loanModForm', 'HOPhNo1', 'Contact Phone #') &&
        checkValidNumber('loanModForm', 'HOPhNo2', 'Contact Phone #') &&
        checkValidNumber('loanModForm', 'HOPhNo3', 'Contact Phone #') &&
        checkValidNumber('loanModForm', 'HOPhNoExt', 'Contact Phone #') &&
        checkValidNumber('loanModForm', 'HOFaxNo1', 'Fax #') &&
        checkValidNumber('loanModForm', 'HOFaxNo2', 'Fax #') &&
        checkValidNumber('loanModForm', 'HOFaxNo3', 'Fax #') &&
        isDateOKForMMDDYY('loanModForm', 'titleOrderedOn', 'Title Ordered.') &&
        isDateOKForMMDDYY('loanModForm', 'titleUpdatedOn', 'Title Updated.') &&
        checkValidNumber('loanModForm', 'titlePhoneNumber1', 'Title Phone #') &&
        checkValidNumber('loanModForm', 'titlePhoneNumber2', 'Title Phone #') &&
        checkValidNumber('loanModForm', 'titlePhoneNumber3', 'Title Phone #') &&
        checkValidNumber('loanModForm', 'titlePhoneNumberExt', 'Title Phone #') &&
        checkValidNumber('loanModForm', 'titleFax1', 'Title Fax #') &&
        checkValidNumber('loanModForm', 'titleFax2', 'Title Fax #') &&
        checkValidNumber('loanModForm', 'titleFax3', 'Title Fax #') /*&&
	   validateHMLOBasicLoanTerm() &&
		validateAppraiserUpload('loanModForm')	&&
		validatePropertyUpload('loanModForm') &&
		validatePropertyTitleUpload('loanModForm')*/
        //		 && validatePropertypropertyInsuranceCoverageUpload('loanModForm')

    ) {
        return true;
    } else {
        return false;
    }
}

/* Property Info Tab Validation */

/* Short Sale Form Validation */

function validateShorSaleForm() {
    if (checkValidNumber('loanModForm', 'lender1PhNo1', '1st Lender Phone Number') &&
        checkValidNumber('loanModForm', 'lender1PhNo2', '1st Lender Phone Number') &&
        checkValidNumber('loanModForm', 'lender1PhNo3', '1st Lender Phone Number') &&
        checkValidNumber('loanModForm', 'lender1PhExt', '1st Lender Phone Number') &&
        checkValidNumber('loanModForm', 'lender1FaxNo1', '1st Lender Fax Number') &&
        checkValidNumber('loanModForm', 'lender1FaxNo2', '1st Lender Fax Number') &&
        checkValidNumber('loanModForm', 'lender1FaxNo3', '1st Lender Fax Number') &&
        checkValidNumber('loanModForm', 'lender2PhNo1', '2nd Lender Phone Number') &&
        checkValidNumber('loanModForm', 'lender2PhNo2', '2nd Lender Phone Number') &&
        checkValidNumber('loanModForm', 'lender2PhNo3', '2nd Lender Phone Number') &&
        checkValidNumber('loanModForm', 'lender2PhExt', '2nd Lender Phone Number') &&
        checkValidNumber('loanModForm', 'lender2FaxNo1', '2nd Lender Fax Number') &&
        checkValidNumber('loanModForm', 'lender2FaxNo2', '2nd Lender Fax Number') &&
        checkValidNumber('loanModForm', 'lender2FaxNo3', '2nd Lender Fax Number') &&
        checkValidNumber('loanModForm', 'attorneyPhNo1', 'Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'attorneyPhNo2', 'Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'attorneyPhNo3', 'Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'attorneyPhExt', 'Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'attorneyCellNo1', 'Attorney Cell Number') &&
        checkValidNumber('loanModForm', 'attorneyCellNo2', 'Attorney Cell Number') &&
        checkValidNumber('loanModForm', 'attorneyCellNo3', 'Attorney Cell Number') &&
        checkValidNumber('loanModForm', 'attorneyFaxNo1', 'Attorney Fax Number') &&
        checkValidNumber('loanModForm', 'attorneyFaxNo2', 'Attorney Fax Number') &&
        checkValidNumber('loanModForm', 'attorneyFaxNo3', 'Attorney Fax Number') &&
        validateAmountAllowBlank('loanModForm', 'listingPrice', 'Please Enter Correct Listing Price.') &&
        isDateOKForMMDDYY('loanModForm', 'listingDate', 'Listing Date.') &&
        checkValidNumber('loanModForm', 'sales1PhNo1', 'Sales1 Phone Number') &&
        checkValidNumber('loanModForm', 'sales1PhNo2', 'Sales1 Phone Number') &&
        checkValidNumber('loanModForm', 'sales1PhNo3', 'Sales1 Phone Number') &&
        checkValidNumber('loanModForm', 'sales1PhExt', 'Sales1 Phone Number') &&
        checkValidNumber('loanModForm', 'sales1CellNo1', 'Sales1 Cell Number') &&
        checkValidNumber('loanModForm', 'sales1CellNo2', 'Sales1 Cell Number') &&
        checkValidNumber('loanModForm', 'sales1CellNo3', 'Sales1 Cell Number') &&
        checkValidNumber('loanModForm', 'sales1Fax1', 'Sales1 Fax Number') &&
        checkValidNumber('loanModForm', 'sales1Fax2', 'Sales1 Fax Number') &&
        checkValidNumber('loanModForm', 'sales1Fax3', 'Sales1 Fax Number') &&
        checkValidNumber('loanModForm', 'firstBuyerPhNo1', '1st Buyer Phone Number') &&
        checkValidNumber('loanModForm', 'firstBuyerPhNo2', '1st Buyer Phone Number') &&
        checkValidNumber('loanModForm', 'firstBuyerPhNo3', '1st Buyer Phone Number') &&
        checkValidNumber('loanModForm', 'firstBuyerPhExt', '1st Buyer Phone Number') &&
        validateAmountAllowBlank('loanModForm', 'offer1', 'Please Enter Correct Offer Amount.') &&
        validateAmountAllowBlank('loanModForm', 'sqft1', 'Please Enter Correct Sq Ft Amount.') &&
        isDateOKForMMDDYY('loanModForm', 'contractDate1', 'Contract Date.') &&
        isDateOKForMMDDYY('loanModForm', 'closingDate1', 'Closing Date.') &&
        checkValidNumber('loanModForm', 'buyer1PhNo1', 'Buyer1 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer1PhNo2', 'Buyer1 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer1PhNo3', 'Buyer1 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer1PhExt', 'Buyer1 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer1CellNo1', 'Buyer1 Cell Number') &&
        checkValidNumber('loanModForm', 'buyer1CellNo2', 'Buyer1 Cell Number') &&
        checkValidNumber('loanModForm', 'buyer1CellNo3', 'Buyer1 Cell Number') &&
        checkValidNumber('loanModForm', 'buyer1Fax1', 'Buyer1 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer1Fax2', 'Buyer1 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer1Fax3', 'Buyer1 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer1LOPhNo1', 'Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer1LOPhNo2', 'Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer1LOPhNo3', 'Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer1LOPhExt', 'Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer1LOCellNo1', 'Attorney Cell Number') &&
        checkValidNumber('loanModForm', 'buyer1LOCellNo2', 'Attorney Cell Number') &&
        checkValidNumber('loanModForm', 'buyer1LOCellNo3', 'Attorney Cell Number') &&
        checkValidNumber('loanModForm', 'buyer1LOFax1', 'Attorney Fax Number') &&
        checkValidNumber('loanModForm', 'buyer1LOFax1', 'Attorney Fax Number') &&
        checkValidNumber('loanModForm', 'buyer1LOFax3', 'Attorney Fax Number') &&

        checkValidNumber('loanModForm', 'secondBuyerPhNo1', 'Second Buyer Phone Number') &&
        checkValidNumber('loanModForm', 'secondBuyerPhNo2', 'Second Buyer Phone Number') &&
        checkValidNumber('loanModForm', 'secondBuyerPhNo3', 'Second Buyer Phone Number') &&
        checkValidNumber('loanModForm', 'secondBuyerPhExt', 'Second Buyer Phone Number') &&
        validateAmountAllowBlank('loanModForm', 'offer2', 'Please Enter Correct Offer2 Amount.') &&
        validateAmountAllowBlank('loanModForm', 'sqft2', 'Please Enter Correct Sqft2 Amount.') &&
        isDateOKForMMDDYY('loanModForm', 'contractDate2', 'Contract Date.') &&
        isDateOKForMMDDYY('loanModForm', 'closingDate2', 'Closing Date.') &&
        checkValidNumber('loanModForm', 'buyer2PhNo1', 'Buyer2 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer2PhNo2', 'Buyer2 Buyer Phone Number') &&
        checkValidNumber('loanModForm', 'buyer2PhNo3', 'Buyer2 Buyer Phone Number') &&
        checkValidNumber('loanModForm', 'buyer2PhExt', 'Buyer2 Buyer Phone Number') &&
        checkValidNumber('loanModForm', 'buyer2CellNo1', 'Buyer2 Cell Number') &&
        checkValidNumber('loanModForm', 'buyer2CellNo2', 'Buyer2 Cell Number') &&
        checkValidNumber('loanModForm', 'buyer2CellNo3', 'Buyer2 Cell Number') &&
        checkValidNumber('loanModForm', 'buyer2Fax1', 'Buyer2 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer2Fax2', 'Buyer2 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer2Fax3', 'Buyer2 Fax Number') &&

        checkValidNumber('loanModForm', 'buyer2LOPhNo1', 'Buyer2 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer2LOPhNo2', 'Buyer2 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer2LOPhNo3', 'Buyer2 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer2LOPhExt', 'Buyer2 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer2LOCellNo1', 'Buyer2 Cell Number') &&
        checkValidNumber('loanModForm', 'buyer2LOCellNo2', 'Buyer2 Cell Number') &&
        checkValidNumber('loanModForm', 'buyer2LOCellNo3', 'Buyer2 Cell Number') &&
        checkValidNumber('loanModForm', 'buyer2LOFax1', 'buyer2 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer2LOFax2', 'buyer2 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer2LOFax3', 'buyer2 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer2AttorneyPhNo1', 'Buyer2 Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer2AttorneyPhNo2', 'Buyer2 Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer2AttorneyPhNo3', 'Buyer2 Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer2AttorneyPhExt', 'Buyer2 Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer2AttorneyCellNo1', 'Buyer2 Attorney Cell Number') &&
        checkValidNumber('loanModForm', 'buyer2AttorneyCellNo2', 'Buyer2 Attorney Cell Number') &&
        checkValidNumber('loanModForm', 'buyer2AttorneyCellNo3', 'Buyer2 Attorney Cell Number') &&
        checkValidNumber('loanModForm', 'buyer2AttorneyFaxNo1', 'Buyer2 Attorney Fax Number') &&
        checkValidNumber('loanModForm', 'buyer2AttorneyFaxNo2', 'Buyer2 Attorney Fax Number') &&
        checkValidNumber('loanModForm', 'buyer2AttorneyFaxNo3', 'Buyer2 Attorney Fax Number') &&

        checkValidNumber('loanModForm', 'thirdBuyerPhNo1', 'Third Buyer Phone Number') &&
        checkValidNumber('loanModForm', 'thirdBuyerPhNo2', 'Third Buyer Phone Number') &&
        checkValidNumber('loanModForm', 'thirdBuyerPhNo3', 'Third Buyer Phone Number') &&
        checkValidNumber('loanModForm', 'thirdBuyerPhExt', 'Third Buyer Phone Number') &&
        validateAmountAllowBlank('loanModForm', 'offer3', 'Please Enter Correct offer3 Amount.') &&
        validateAmountAllowBlank('loanModForm', 'sqft3', 'Please Enter Correct Sqft3 Amount.') &&
        isDateOKForMMDDYY('loanModForm', 'contractDate3', 'Contract Date.') &&
        isDateOKForMMDDYY('loanModForm', 'closingDate3', 'Closing Date.') &&
        checkValidNumber('loanModForm', 'buyer3PhNo1', 'Buyer3 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3PhNo2', 'Buyer3 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3PhNo3', 'Buyer3 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3PhExt', 'Buyer3 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3CellNo1', 'Buyer3 Cell Number') &&
        checkValidNumber('loanModForm', 'buyer3CellNo2', 'Buyer3 Cell Number') &&
        checkValidNumber('loanModForm', 'buyer3CellNo3', 'Buyer3 Cell Number') &&
        checkValidNumber('loanModForm', 'buyer3Fax1', 'Buyer3 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer3Fax2', 'Buyer3 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer3Fax3', 'Buyer3 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer3LOPhNo1', 'Buyer3 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3LOPhNo2', 'Buyer3 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3LOPhNo3', 'Buyer3 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3LOPhExt', 'Buyer3 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3LOCellNo1', 'Buyer3 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3LOCellNo2', 'Buyer3 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3LOCellNo3', 'Buyer3 Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3LOFax1', 'Buyer3 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer3LOFax2', 'Buyer3 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer3LOFax3', 'Buyer3 Fax Number') &&
        checkValidNumber('loanModForm', 'buyer3AttorneyPhNo1', 'Buyer3 Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3AttorneyPhNo2', 'Buyer3 Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3AttorneyPhNo3', 'Buyer3 Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3AttorneyPhExt', 'Buyer3 Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer3AttorneyCellNo1', 'Buyer3 Attorney Cell Number') &&
        checkValidNumber('loanModForm', 'buyer3AttorneyCellNo2', 'Buyer3 Attorney Cell Number') &&
        checkValidNumber('loanModForm', 'buyer3AttorneyCellNo3', 'Buyer3 Attorney Cell Number') &&
        checkValidNumber('loanModForm', 'buyer3AttorneyFaxNo1', 'Buyer3 Attorney Fax Number') &&
        checkValidNumber('loanModForm', 'buyer3AttorneyFaxNo2', 'Buyer3 Attorney Fax Number') &&
        checkValidNumber('loanModForm', 'buyer3AttorneyFaxNo3', 'Buyer3 Attorney Fax Number') &&
        isDateOKForMMDDYY('loanModForm', 'titleOrderedOn', 'Title Ordered Date.') &&
        isDateOKForMMDDYY('loanModForm', 'titleUpdatedOn', 'Title Updated Date.') &&
        checkValidNumber('loanModForm', 'sales2PhNo1', 'Sales2 Phone Number') &&
        checkValidNumber('loanModForm', 'sales2PhNo2', 'Sales2 Phone Number') &&
        checkValidNumber('loanModForm', 'sales2PhNo3', 'Sales2 Phone Number') &&
        checkValidNumber('loanModForm', 'sales2PhNo3', 'Sales2 Phone Number') &&
        checkValidNumber('loanModForm', 'sales2Fax1', 'Sales2 Fax Number') &&
        checkValidNumber('loanModForm', 'sales2Fax2', 'Sales2 Fax Number') &&
        checkValidNumber('loanModForm', 'sales2Fax3', 'Sales2 Fax Number') &&

        checkValidNumber('loanModForm', 'buyer1AttorneyPhNo1', 'Buyer1 Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer1AttorneyPhNo2', 'Buyer1 Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer1AttorneyPhNo3', 'Buyer1 Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer1AttorneyPhExt', 'Buyer1 Attorney Phone Number') &&

        checkValidNumber('loanModForm', 'buyer1AttorneyCellNo1', 'Buyer1 Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer1AttorneyCellNo2', 'Buyer1 Attorney Phone Number') &&
        checkValidNumber('loanModForm', 'buyer1AttorneyCellNo3', 'Buyer1 Attorney Phone Number') &&

        checkValidNumber('loanModForm', 'buyer1AttorneyFaxNo1', 'Buyer1 Attorney Fax Number') &&
        checkValidNumber('loanModForm', 'buyer1AttorneyFaxNo2', 'Buyer1 Attorney Fax Number') &&
        checkValidNumber('loanModForm', 'buyer1AttorneyFaxNo3', 'Buyer1 Attorney Fax Number') &&

        validateAmountAllowBlank('loanModForm', 'cmaEstimatedValue_0', 'Please Enter Correct Estimated Value.') &&
        validateAmountAllowBlank('loanModForm', 'cmaHighPrice_0', 'Please Enter Correct High Price.') &&
        validateAmountAllowBlank('loanModForm', 'cmaSuggListPrice_0', 'Please Enter Correct Suggested List Price.') &&
        validateAmountAllowBlank('loanModForm', 'cmaQuickResalePrice_0', 'Please Enter Correct Quick Resale Price.') &&
        validateAmountAllowBlank('loanModForm', 'cmaSalePrice_0', 'Please Enter Correct Sale Price.') &&
        validateAmountAllowBlank('loanModForm', 'cmaAverageListingPrice_0', 'Please Enter Correct Average Listing Price.') &&
        checkValidNumber('loanModForm', 'cmaMonthsOnMLS_0', 'Months on the MLS')
    ) {
        return true;
    } else {
        return false;
    }
}

function checkHOALienSelected(val) {
    var len = 0, k = 0;
    try {
        eval("obj = document.loanModForm['fileModule[]']");
        len = obj.length;
    } catch (e) {
    }
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].selected) {
            if (obj[i].value == 'HOA') {
                k++;
                break;
            }
        }
    }
    if (k > 0) {
        $('#propertyManagementInfo').show();
        $('#borrowerInfo').hide();
    } else {
        $('#propertyManagementInfo').hide();
        $('#borrowerInfo').show();
    }
}

function checkLOSelected(val) {
    var len = 0, k = 0;
    try {
        eval("obj = document.loanModForm['fileModule[]']");
        len = obj.length;
    } catch (e) {
    }
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].selected) {
            if (obj[i].value == 'LO') {
                k++;
                break;
            }
        }
    }
    if (k > 0) {
        $('.showOnLO').show();
        $('.hideOnLO').hide();
    } else {
        $('.hideOnLO').show();
        $('.showOnLO').hide();
    }
}

/**

 ** Description    : Hard / Private Money LOS module Section Show and Hide
 ** Developer    : Viji & Venkatesh
 ** Author        : Awatasoftsys
 ** Date            : Nov 18, 2016

 **/

function checkHMLOSelected(val) {
    var len = 0, k = 0;
    try {
        eval("obj = document.loanModForm['fileModule[]']");
        len = obj.length;
    } catch (e) {
    }
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].selected) {
            if (obj[i].value == 'HMLO') {
                k++;
                break;
            }
        }
    }
    if (k > 0) {
        $('.showOnHMLO').show();
        $('.hideOnHMLO').hide();
    } else {
        $('.hideOnHMLO').show();
        $('.showOnHMLO').hide();
    }
}


/* Short Sale Form Validation */

function isCheckNVAPCValidation(formName, fldName, msg) {
    var len = 0, k = 0, serviceType = '', PCID = '', returnOpt = true;
    PCID = document.getElementById('encryptedPCID').value;
    if (PCID == 'e300f9edc781f2f8') {
        try {
            eval("obj = document.loanModForm['LMRClientType[]']");
            len = obj.length;
        } catch (e) {
        }
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].selected) {
                serviceType = obj[i].value;
                var serviceTypeArray = new Array('LM', 'SS', 'HR', 'CR', 'RL', 'SA');
                for (var j = 0; j < serviceTypeArray.length; j++) {
                    if (serviceType == serviceTypeArray[j]) {
                        k++
                    }
                }
            }
        }
        if (k >= 6) {
            returnOpt = true;
        } else {
            //alert('Please select appropriate service types.');
            toastrNotification("Please select appropriate service types.", 'error');
            returnOpt = false;
        }
        if (returnOpt &&
            chkIsBlank('loanModForm', 'propertyAddress', 'Please enter property address.') &&
            chkIsBlank('loanModForm', 'propertyCity', 'Please enter property city') &&
            chkIsBlank('loanModForm', 'propertyState', 'Please enter property state') &&
            chkIsBlank('loanModForm', 'propertyCounty', 'Please enter property county') &&
            chkIsBlank('loanModForm', 'propertyZip', 'Please enter property zip') &&
            chkIsBlank('loanModForm', 'homeValue', 'Please enter home value') &&
            chkIsBlank('loanModForm', 'borrowerFName', 'Please Enter Borrower First Name.') &&
            chkIsBlank('loanModForm', 'borrowerLName', 'Please Enter Borrower Last Name.') &&
            isEmailOk('loanModForm', 'borrowerEmail') &&
            chkIsBlank('loanModForm', 'ssn1', 'Please Correct Borrower SSN Number.') &&
            chkIsBlank('loanModForm', 'ssn2', 'Please Correct Borrower SSN Number.') &&
            chkIsBlank('loanModForm', 'ssn3', 'Please Correct Borrower SSN Number.') &&
            isDateOK('loanModForm', 'borrowerDOB', 'Borrower DOB.') &&
            chkIsBlank('loanModForm', 'phNo1', 'Borrower Phone Number') &&
            chkIsBlank('loanModForm', 'phNo2', 'Borrower Phone Number') &&
            chkIsBlank('loanModForm', 'phNo3', 'Borrower Phone Number') &&
            chkIsBlank('loanModForm', 'ext', 'Borrower Phone Number') &&
            chkIsBlank('loanModForm', 'mailingAddress', 'Please enter mailing address.') &&
            chkIsBlank('loanModForm', 'mailingCity', 'Please enter mailing city') &&
            chkIsBlank('loanModForm', 'mailingState', 'Please enter mailing state') &&
            chkIsBlank('loanModForm', 'mailingZip', 'Please enter mailing zip') &&
            chkIsBlank('loanModForm', 'coBorrowerFName', 'Please Enter Co-Borrower First Name.') &&
            chkIsBlank('loanModForm', 'coBorrowerLName', 'Please Enter Co-Borrower Last Name.') &&
            chkIsBlank('loanModForm', 'coBSsn1', 'Please Correct Co-Borrower SSN Number.') &&
            chkIsBlank('loanModForm', 'coBSsn2', 'Please Correct Co-Borrower SSN Number.') &&
            chkIsBlank('loanModForm', 'coBSsn3', 'Please Correct Co-Borrower SSN Number.') &&
            isDateOK('loanModForm', 'coBorrowerDOB', 'Borrower DOB.') &&
            chkIsBlank('loanModForm', 'coBPhNo1', 'Co-Borrower Phone Number') &&
            chkIsBlank('loanModForm', 'coBPhNo2', 'Co-Borrower Phone Number') &&
            chkIsBlank('loanModForm', 'coBPhNo3', 'Co-Borrower Phone Number') &&
            chkIsBlank('loanModForm', 'coBExt', 'Co-Borrower Phone Number') &&
            isEmailOk('loanModForm', 'coBorrowerEmail') &&
            chkIsBlank('loanModForm', 'coBorrowerMailingAddress', 'Please enter Co-Borrower mailing address.') &&
            chkIsBlank('loanModForm', 'coBorrowerMailingCity', 'Please enter Co-Borrower mailing city') &&
            chkIsBlank('loanModForm', 'coBorrowerMailingState', 'Please enter Co-Borrower mailing state') &&
            chkIsBlank('loanModForm', 'coBorrowerMailingZip', 'Please enter Co-Borrower mailing zip')

        ) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

function getBranchAgents(executiveId) {

    /**
     * Get PCID in the case of getting the broker list on select the branch for respective PC
     */

    $.ajax({
        type: 'POST',
        url: siteSSLUrl + "backoffice/getBranchAgents.php",
        data: jQuery.param(
            {
                'executiveId': executiveId,
                'PCID': $("#PCID").val(),
                'option': 'list',
                'json': 1,
            }
        ),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (agentList) {

            var obj = $.parseJSON(agentList);

            $('#agentId').empty();
            $('#secondaryAgentId').empty();
            var optionAgent = '<option value="">- Select -</option>';
            var optionSecondaryAgent = optionAgent;
            var agentFileAccess = userRole = '';


            $.each(obj, function (agentId, agentInfo) {
                //option += '  <option value="' + agentId + '">' + agentInfo + '</option>\n';

                agentInfoArray = agentInfo.split("^^@@^^");
                agentInfo1 = agentInfoArray[0];
                externalBroker = agentInfoArray[1];
                agentFileAccess = agentInfoArray[2];
                userRole = agentInfoArray[3];
                isExternalBroker = agentInfoArray[4];
                if (externalBroker == '0') {
                    optionAgent += '  <option value="' + agentId + '">' + agentInfo1 + '</option>\n';
                } else if (externalBroker == '1') {
                    optionSecondaryAgent += '  <option value="' + agentId + '">' + agentInfo1 + '</option>\n';
                }

            });
            /*  $('#agentId').append(optionAgent).trigger("liszt:updated");
              $('#secondaryAgentId').append(optionSecondaryAgent).trigger("liszt:updated");  */
            $('#agentId').append(optionAgent).trigger("chosen:updated");
            $('#secondaryAgentId').append(optionSecondaryAgent).trigger("chosen:updated");
            if (agentFileAccess == 1 && userRole == 'Agent' && isExternalBroker == 1) {
                $('#secondaryAgentId').val($("input[name=createdByEnc]").val());
                $('#loanOfficerID').val($("input[name=createdByEnc]").val());
                $('#secondaryAgentId').prop('disabled', true);
            } else {
                $('#secondaryAgentId').prop('disabled', false);
            }
        }
    });

    //     var len = 0;
    //     var AgentList = new Array();
    // 	var agentName = ''; var brokerNumber = 0;

    // 	var url = "../backoffice/getBranchAgents.php";
    // 	var qstr = "executiveId="+executiveId;
    //         var pcid = $("#PCID").val();
    //         if(pcid > 0){
    //             qstr += "&PCID="+pcid;
    //         }
    // /** Get PCID in the case of getting the broker list on select the branch for respective PC**/
    //         try {
    // 		xmlDoc = getXMLDoc(url,qstr);
    // 	} catch(e) {}

    // 	try {
    // 		AgentList = xmlDoc.getElementsByTagName("agentListContent");
    // 		len1 = AgentList.length;
    // 	} catch(e) {}
    // 	var br1  = '<select name="agentId" id="agentId"  class="mandatory" >';
    // 	br1 += '<option value=""> - Select - </option>';
    // 	for(var ae=0;ae<len1;ae++) {

    // 		try {
    // 			agentName = AgentList[ae].getElementsByTagName("agentName")[0].childNodes[0].nodeValue;
    // 		} catch (e) {}
    // 		try {
    // 			brokerNumber = AgentList[ae].getElementsByTagName("brokerNumber")[0].childNodes[0].nodeValue;
    // 		} catch (e) {}
    // 		br1 += '<option value="'+brokerNumber+'">'+agentName+'</option>';
    // 	}

    // 	br1 +='</select>';
    // 	$('#agentId_container').html(br1);
}

function getBranchAgentsLOVersionHouseMax(executiveId) {

    $.ajax({
        type: 'POST',
        url: siteSSLUrl + "backoffice/getBranchAgents.php",
        data: jQuery.param(
            {
                'executiveId': executiveId,
                'PCID': $("#PCID").val(),
                'option': 'list',
                'json': 1,
            }
        ),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (agentList) {
            var obj = $.parseJSON(agentList);
            $('#agentId').empty();
            var optionAgent = '<option value="">- Select -</option>';
            var optionSecondaryAgent = optionAgent;
            var agentFileAccess = userRole = '';
            $.each(obj, function (agentId, agentInfo) {
                agentInfoArray = agentInfo.split("^^@@^^");
                agentInfo1 = agentInfoArray[0];
                externalBroker = agentInfoArray[1];
                agentFileAccess = agentInfoArray[2];
                userRole = agentInfoArray[3];
                isExternalBroker = agentInfoArray[4];
                if (externalBroker == '0') {
                    optionAgent += '  <option value="' + agentId + '">' + agentInfo1 + '</option>\n';
                } else if (externalBroker == '1') {
                    //optionSecondaryAgent += '  <option value="' + agentId + '">' + agentInfo1 + '</option>\n';
                }

            });
            $('#agentId').append(optionAgent).trigger("chosen:updated");
        }
    });
}

function showAndHideNonBorrDiv(divId, noOfDiv) {
    var opt = 0;
    try {
        opt = document.loanModForm.isNonBorrower.value;
    } catch (e) {
    }

    if (noOfDiv > 0) {
        for (var i = 1; i <= noOfDiv; i++) {
            try {
                if (opt == '1') {
                    eval("document.getElementById('" + divId + i + "').style.display = 'flex'");
                } else {
                    eval("document.getElementById('" + divId + i + "').style.display = 'none'");
                    document.loanModForm.nonBorrowerName.value = '';
                    document.loanModForm.nonBorrowerSSN1.value = '';
                    document.loanModForm.nonBorrowerSSN2.value = '';
                    document.loanModForm.nonBorrowerSSN3.value = '';
                    document.loanModForm.nonBorrowerDOB.value = '';
                    document.loanModForm.nonBorrowerEmail.value = '';
                    document.loanModForm.monthlyContribution.value = '';

                }
            } catch (e) {
            }
        }
    } else {
        try {
            if (opt == '1') {
                document.getElementById(divId).style.display = 'flex';
            } else {
                document.getElementById(divId).style.display = 'none';
            }
        } catch (e) {
        }
    }
}

/* Loan Origination Explanation tab */

function showAndHideLODiv(fldValue, divId) {
    if (fldValue == 'Yes') {
        if (divId == 'doesPropertyNeedRehabDispDiv') {
            document.getElementById(divId).style.display = 'table-row';
        } else if (divId == 'generalContractorHiredPerformDispDiv') { //Budget & Draws
            $('#' + divId).css({
                'display': 'block'
            });
        } else {
            document.getElementById(divId).style.display = 'flex';
        }
    } else {
        document.getElementById(divId).style.display = 'none';
        try {
            document.loanModForm.propertyTypeBorrowerOwn.value = '';
        } catch (e) {
        }
        try {
            document.loanModForm.borrowerHoldTitleHome.value = '';
        } catch (e) {
        }
    }
}

function showAndHideLODiv1(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'flex';
    } else {
        document.getElementById(divId).style.display = 'none';
        document.loanModForm.propertyTypeCoBorrowerOwn.value = '';
        document.loanModForm.coBorrowerHoldTitleHome.value = '';
    }
}

function showAndHideExplanationDiv(fldValue, divId) {
    if (fldValue == 'Other') {
        document.getElementById(divId).style.display = 'flex';
    } else {
        document.getElementById(divId).style.display = 'none';
        document.loanModForm.otherExplanation.value = '';
    }
}

function showAndHideCashOutDiv(fldValue, divId) {
    if (fldValue == 'Cash-Out / Refinance') {
        document.getElementById(divId).style.display = 'flex';
    } else {
        document.getElementById(divId).style.display = 'none';
        document.loanModForm.doesBorrowerIntendUseFunds.value = '';
    }
}

function showAndHideHMLOLoanTypeDiv(fldValue, divId) {
    if (fldValue == 'Purchase' || fldValue == 'Rehab Purchase' || fldValue == 'Transactional') {
        document.getElementById(divId).style.display = 'flex';
    } else {
        document.getElementById(divId).style.display = 'none';
        document.loanModForm.doesBorrowerIntendUseFunds.value = '';
    }
}

function showAndHideExplainRehabPlansDiv(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'flex';
    } else {
        document.getElementById(divId).style.display = 'none';
        document.loanModForm.explainRehabPlans.value = '';
    }
}

/* Loan Origination Explanation tab */

/*  HOA Lien Show/hide sections, Merchant Funding Show/hide sections and questions  and
    Loan Origination Show/hide sections and questions START */

function showOrHideProperServiceDiv(val) {
    var len = 0, k = 0;
    try {
        eval("obj = document.loanModForm['fileModule[]']");
        len = obj.length;
    } catch (e) {
    }

    $('#propertyManagementInfo').hide();
    $('#borrowerInfo').show();
    $('.hideOnMF').show();
    $('.showOnMF').hide();
    $('.changeWidthOnMF').css("width", "48%");
    $('.hideOnLO').show();
    $('.showOnLO').hide();

    $('.hideOnFU').show();
    $('.showOnFU').hide();
    $('.hideOnHMLO').show();
    $('.showOnHMLO').hide();
    $('.hideOnEF').show();
    $('.showOnEF').hide();
    $('.hideLOC').show();
    $('.inProcessGrp').show();

    for (var i = 0; i < obj.length; i++) {
        if (obj[i].selected) {
            if (obj[i].value == 'HOA') { /* HOA Lien Show/hide sections */
                $('#propertyManagementInfo').show();
                $('#borrowerInfo').hide();
                break;
            } else if (obj[i].value == 'MF') { /* Merchant Funding Show/hide sections and questions */
                $('.showOnMF').show();
                $('.hideOnMF').hide();
                $('.changeWidthOnMF').css("width", "65%");
                break;
            } else if (obj[i].value == 'LO') {
                $('.showOnLO').show();
                $('.hideOnLO').hide();
                try {
                    if (document.loanModForm.borResidedPresentAddr.value == 'No') {   /* Borrower resided at more than two years show the former div */
                        showFormerAddrDiv('No', 'Bor');
                    } else {
                        showFormerAddrDiv('', 'Bor');
                    }
                } catch (e) {
                }
                if (document.loanModForm.coBResidedPresentAddr.value == 'No') {   /* Co-Borrower resided at more than two years show the former div */
                    showFormerAddrDiv('No', 'CoBor');
                } else {
                    showFormerAddrDiv('', 'CoBor');
                }
                if (document.loanModForm.isCoBorrower.value == 0) { /* If there is no Co-borrower hide the div */
                    $('#coBorGovDiv').hide();
                }
                break;
            } else if (obj[i].value == 'FU') { /* Funding Show/hide sections and questions */
                $('.showOnFU').show();
                $('.hideOnFU').hide();
                try {
                    if (document.getElementById('creditIssues_chzn').style.width == '0px') {
                        document.getElementById('creditIssues_chzn').style.width = '245px';
                    }
                    if (document.getElementById('fundsNeededReason_chzn').style.width == '0px') {
                        document.getElementById('fundsNeededReason_chzn').style.width = '245px';
                    }
                } catch (e) {
                }
                //$('.changeWidthOnMF').css("width", "65%");
                break;
            } else if (obj[i].value == 'HMLO') {
                /** Hard / Private Money LOS module Section Show and Hide on                                                Nov 18, 2016 **/
                $('.showOnHMLO').show();
                $('.hideOnHMLO').hide();
                break;
            } else if (obj[i].value == 'EF') {
                /** Hard / Private Money LOS module Section Show and Hide on                                               Nov 18, 2016 **/
                $('.showOnEF').show();
                $('.inProcessGrp').show();
                $('.hideOnEF').hide();
                break;
            } else if (obj[i].value == 'loc') {
                /** Hard / Private Money LOS module Section Show and Hide on                                               Nov 18, 2016 **/
                $('.hideLOC').hide();
                $('.inProcessGrp').hide();
                break;
            } else if (obj[i].value != 'loc') {
                $('.inProcessGrp').show();
                break;
            }
        }
    }
    try {
        if (document.loanModForm.isCoBorrower.value == 0) { /* If there is no Co-borrower hide the div */
            $('#coBorDiv1').hide();
        }
    } catch (e) {
    }
    try {
        if (document.loanModForm.isNonBorrower.value == 0) { /* If there is no Non-borrower contributor hide the div */
            $('#nonBorrowerDiv1').hide();
        }
    } catch (e) {
    }
}

/*  HOA Lien Show/hide sections, Merchant Funding Show/hide sections and questions  and
    Loan Origination Show/hide sections and questions END */

function validateCheckingSavings(formName) {
    if (
        chkIsBlank(formName, 'nameAddrOfBank', 'Please enter Name and address of Bank , S&L , or Credit Union') && chkIsBlank(formName, 'accountNumber', 'Please enter Account Number') && chkIsBlank(formName, 'balance', 'Please enter Balance')
    ) {
        saveCheckingSavingsInfo();
    } else {
        return false;
    }
}

function saveCheckingSavingsInfo() {
    var nameAddrOfBank = "", accountNumber = "", balance = '', LMRId = 0, LOCSID = 0, chekingSavingCnt = '';

    encryptedLMRId = document.loanModForm.encryptedLId.value;
    LOCSID = document.checkingSavingsForm.LOCSID.value;
    encryptedHMLO = document.checkingSavingsForm.isHMLO.value;

    nameAddrOfBank = $('#nameAddrOfBank').val();
    accountNumber = $('#accountNumber').val();
    balance = $('#balance').val();
    accType = $('#accType').val();
    chekingSavingCnt = document.loanModForm.chekingSavingCnt.value;

    // Replaces getXMLDoc() with jQuery AJAX to avoid unexpected <head/> tag issue sometimes in the response.
    $.post(POPSURL + "saveCheckingSavingsAccount.php",
        {
            LMRId: encryptedLMRId,
            nameAddrOfBank: nameAddrOfBank,
            accountNumber: accountNumber,
            balance: balance,
            accType: accType,
            LOCSID: LOCSID
        },
        function (statusData) {
            var statusResult = $.parseJSON(statusData);
            var cnt = statusResult.updateCnt;
            var tempVal = (parseInt(chekingSavingCnt) + 1);
            document.loanModForm.chekingSavingCnt.value = tempVal;
            if (tempVal >= 4) {
                $('#hideCheckingSavings').hide();
            }
            if (cnt > 0) {
                if (cnt == 1) {
                    toastrNotification('Saved successfully', 'success');
                } else if (cnt == 2) {
                    toastrNotification('Updated successfully', 'success');
                }
                showCheckingSavingsInfo(encryptedLMRId, encryptedHMLO);
            }
        }
    );
}

function showCheckingSavingsInfo(LMRId, isHMLO) {
    var url = "", qstr = "";
    url = "../backoffice/getCheckingSavingsInfo.php";
    qstr = "LMRId=" + LMRId + "&isHMLO=" + isHMLO;
    var displayList = "";
    try {
        displayList = getResponse(url, qstr);
    } catch (e) {
    }
    try {
        document.getElementById("showCheckingSavings").innerHTML = displayList;
    } catch (e) {
    }
    eval("ContactPop.init('" + POPSURL + "addCheckingSavingsAccountInfo.php', 'addCheckingSavingsAccountInfo.php', 'Checking and Savings Account Info', '" + POPSURL + "','saveCheckingSavingsAccount.php' , 600, 220)");
    try {
        ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
}

/**
 * Deletes 'Checking and Savings Account Info'
 *
 * @param LMRId integer  An integer of ID of LMR(Loan Modification Request)
 * @param LOCSID integer
 * @param isHMLO
 */
function deleteChekingSavingInfo(LMRId, LOCSID, isHMLO) {
    //  $('.with-children-tip > *').hideTip();
    var cfmMsg = "Are you sure to delete?";
    if (confirm(cfmMsg)) {
        showLoader();
        var delCnt = 0, url = "", qstr = "";

        // Replaces getXMLDoc() with jQuery AJAX to avoid unexpected <head/> tag issue sometimes in the response.
        $.post("../backoffice/deleteChekingSavingInfo.php",
            {
                LOCSID: LOCSID
            },
            function (statusData) {
                var statusResult = $.parseJSON(statusData);
                var delCnt = statusResult.delCnt;

                var chekingSavingCnt = document.loanModForm.chekingSavingCnt.value;
                var tempVal = (parseInt(chekingSavingCnt) - 1);
                document.loanModForm.chekingSavingCnt.value = tempVal;

                if (tempVal <= 4) {
                    $('#hideCheckingSavings').show();
                }
                if (delCnt > 0) {
                    toastrNotification('Deleted successfully', 'success');
                    showCheckingSavingsInfo(LMRId, isHMLO);
                }
                hideLoader();

            }
        );
    }
}

function calculateTotalAutomobiles(currentvalue) {

    var assetCars = "", assetCarsOwed = "", automobilesOwned1 = "";

    alertToEnterInput(currentvalue);

    try {
        assetCars = document.loanModForm.assetCars.value;
    } catch (e) {
    }

    try {
        assetCarsOwed = document.loanModForm.assetCarsOwed.value;
    } catch (e) {
    }

    try {
        automobilesOwned1 = document.loanModForm.automobilesOwned1.value;
    } catch (e) {
    }

    try {
        automobilesOwned3x = document.loanModForm.automobilesOwned3x.value;
    } catch (e) {
    }


    assetCars = replaceCommaValues(assetCars);
    assetCarsOwed = replaceCommaValues(assetCarsOwed);
    automobilesOwned1 = replaceCommaValues(automobilesOwned1);
    automobilesOwned3x = replaceCommaValues(automobilesOwned3x);

    if (assetCars == "") assetCars = 0;
    if (assetCarsOwed == "") assetCarsOwed = 0;
    if (automobilesOwned1 == "") automobilesOwned1 = 0;
    if (automobilesOwned3x == "") automobilesOwned3x = 0;

    totalAutomobiles = parseFloat(assetCars) + parseFloat(assetCarsOwed) + parseFloat(automobilesOwned1) + parseFloat(automobilesOwned3x);
    totalAutomobiles = parseFloat(totalAutomobiles);
    totalAutomobiles = totalAutomobiles.toFixed(2);

    try {
        document.getElementById("totalAutoMobiles").innerHTML = totalAutomobiles;
    } catch (e) {
    }
}

function LOLiabilitiesInfoSave() {
    var monthlyPayment = "", nameAddrOfCompany = "", monthsLeftToPay = "", unpaidBalance = "", LOLID = 0, LMRId = 0;
    var url = "", qstr = "", xmlDoc = "";
    $accountNo = '';

    LOLID = $('#LOLID').val();
    LMRId = $('#LMRId').val();
    encryptedLMRId = document.loanModForm.encryptedLId.value;

    nameAddrOfCompany = $('#nameAddrOfCompany').val();
    monthlyPayment = $('#monthlyPayment').val();
    monthsLeftToPay = $('#monthsLeftToPay').val();
    unpaidBalance = $('#unpaidBalance').val();
    accountNo = $('#accountNo').val();

    if (chkIsBlank('liabilitiesForm', 'nameAddrOfCompany', 'Please enter Name & Address of Company') &&
        chkIsBlank('liabilitiesForm', 'monthlyPayment', 'Please enter Monthly Payment') &&
        chkIsBlank('liabilitiesForm', 'monthsLeftToPay', 'Please enter Months Left to Pay') &&
        chkIsBlank('liabilitiesForm', 'unpaidBalance', 'Please enter Unpaid Balance') &&
        chkIsBlank('liabilitiesForm', 'accountNo', 'Please enter account No')) {
        url = "../pops/LOLiabilitiesInfoSave.php";
        qstr = "LOLID=" + LOLID + "&LMRId=" + LMRId + "&nameAddrOfCompany=" + nameAddrOfCompany + "&monthlyPayment=" + monthlyPayment + "&monthsLeftToPay=" + monthsLeftToPay + "&unpaidBalance=" + unpaidBalance + "&accountNo=" + accountNo;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            cnt = xmlDoc.getElementsByTagName("rsResp")[0].firstChild.nodeValue;
        } catch (e) {
        }
        showLiabilitiesInfo(encryptedLMRId);
    } else {
        return false;
    }
}

function showLiabilitiesInfo(LMRId) {
    var resInfoArray = new Array(), displayList = "";

    // Replaces getXMLDoc() with jQuery AJAX to avoid unexpected <head/> tag issue sometimes in the response in staging server.
    $.post("../backoffice/getLiabilitiesInfo.php",
        {
            LMRId: LMRId
        },
        function (liabilitiesData) {
            var liabilitiesObj = $.parseJSON(liabilitiesData);
            displayList = "<table width=\"100%\" class=\"table table-hover  table-bordered table-condensed table-sm table-vertical-center\">" +
                "<thead class=\"thead-light\">" +
                "<tr>" +
                "<th>&nbsp;#</th>" +
                "<th>&nbsp;</th>" +
                "<th style=\"border-right:1px solid #ffffff;\">&nbsp;Name & Address of Company</th>" +
                "<th style=\"border-right:1px solid #ffffff;\">&nbsp;Monthly Payment</th>" +
                "<th style=\"border-right:1px solid #ffffff;\">&nbsp;Months Left to Pay</th>" +
                "<th style=\"border-right:1px solid #ffffff;\">&nbsp;Unpaid Balance</th>" +
                "<th style=\"border:0px solid #000000;\">&nbsp;</td>" +
                "</tr>" +
                "</thead><tbody>";

            for (var i = 0; i < liabilitiesObj.length; i++) {
                var slno = i + 1;
                var tmpCls = "";
                if ((slno % 2) == 0) {
                    tmpCls = "even";
                }

                liabilityObj = liabilitiesObj[i];
                if (liabilityObj) {
                    displayList += "<tr class=" + tmpCls + ">";
                    displayList += "<td>" + slno + "</td>";
                    displayList += "<td><div id=\"buttonDisp\"><a class=\"btn btn-sm btn-light btn-text-primary btn-hover-primary btn-icon m-1 tooltipClass\" title=\"Click to edit\" href=\"javascript: editLOLiabilitiesInfo('" + liabilityObj.LMRId + "', '" + liabilityObj.LOLID + "');\"><i\n" +
                        "                                                        class=\"fa fa-edit\"></i></a></div></td>";
                    displayList += "<td>" + liabilityObj.nameAddrOfCompany + "</td>";
                    displayList += "<td>" + liabilityObj.monthlyPayment + "</td>";
                    displayList += "<td>" + liabilityObj.monthsLeftToPay + "</td>";
                    displayList += "<td>" + liabilityObj.unpaidBalance + "</td>";
                    displayList += "<td ><a class=\"btn btn-xs btn-danger btn-text-primary  btn-icon m-1 tooltipClass\" style=\"text-decoration:none;\" href=\"javascript:deleteLiabilitiesInfo('" + liabilityObj.LMRId + "', '" + liabilityObj.LOLID + "');\" title=\"Click to delete\"><i class=\"flaticon2-trash\"></i></a></td>";
                    displayList += "</tr>";
                }
            }
            displayList += "</tbody></table>";
            try {
                document.getElementById("LOLiabilitiesInfo").innerHTML = displayList;
            } catch (e) {
            }
            try {
                ContactPop.hideOverlay(); /** Close- Popup **/
            } catch (e) {
            }
        }
    );
}

// editLOLiabilitiesInfo() is being used instead of this fuction for add new Liabilities form.
function addLOLiabilitiesInfo(LMRId, LOLID) {
    qstr = 'LMRID=' + LMRId + '&LOLID=' + LOLID;
    eval("ContactPop.showOverlay('" + POPSURL + "addLOLiabilitiesInfo.php')"); /** Open Popup **/
}

function deleteLiabilitiesInfo(LMRId, LOLID) {

    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: "Are you sure to delete?",
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            yes: {
                btnClass: 'btn-green',
                action: function () {
                    var delCnt = 0, url = "", qstr = "";

                    // Replaces getXMLDoc() with jQuery AJAX to avoid unexpected <head/> tag issue sometimes in the response.
                    $.post("../backoffice/deleteLiabilitiesInfo.php",
                        {
                            LOLID: LOLID
                        },
                        function (statusData) {
                            var statusResult = $.parseJSON(statusData);
                            var delCnt = statusResult.delCnt;
                            if (delCnt > 0) {
                                toastrNotification('Deleted successfully', 'success');
                                encryptedLMRId = document.loanModForm.encryptedLId.value;
                                showLiabilitiesInfo(encryptedLMRId);
                            }
                        }
                    );
                }
            },
            cancel: {
                text: 'Cancel',
                action: function () {
                    //  location.reload();
                }
            },
        }
    });
}

function validateLORealEstate(formName) {
    if (chkIsBlank(formName, 'schedulePropAddr', 'Please enter Property Address')
    ) {
        saveLORealEstateInfo();
    } else {
        return false;
    }
}

function saveLORealEstateInfo() {

    var schedulePropAddr = '', scheduleStatus = '', propType = '', presentMarketValue = '', amountOfMortgages = '',
        grossRentalIncome = '', mortgagePayments = '', insMaintTaxMisc = '', netRentalIncome;
    var clientId = 0;

    LMRId = $('#LMRId').val();
    encryptedLMRId = document.loanModForm.encryptedLId.value;
    schedulePropAddr = $('#schedulePropAddr').val();
    scheduleStatus = $('#scheduleStatus').val();

    propType = $('#propType').val();
    presentMarketValue = $('#presentMarketValue').val();
    amountOfMortgages = $('#amountOfMortgages').val();
    grossRentalIncome = $('#grossRentalIncome').val();
    mortgagePayments = $('#mortgagePayments').val();
    insMaintTaxMisc = $('#insMaintTaxMisc').val();
    netRentalIncome = $('#netRentalIncome').val();
    clientId = $('#clientId').val();

    LOSRID = document.LORealEstateForm.LOSRID.value;

    url = "../pops/LORealEstateFormSave.php";
    qstr = "LMRId=" + LMRId + "&schedulePropAddr=" + schedulePropAddr + "&scheduleStatus=" + scheduleStatus + "&propType=" + propType + "&presentMarketValue=" + presentMarketValue + "&amountOfMortgages=" + amountOfMortgages + "&grossRentalIncome=" + grossRentalIncome + "&mortgagePayments=" + mortgagePayments + "&insMaintTaxMisc=" + insMaintTaxMisc + "&netRentalIncome=" + netRentalIncome + "&LOSRID=" + LOSRID + "&clientId=" + clientId;

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        cnt = xmlDoc.getElementsByTagName("updateCnt")[0].firstChild.nodeValue;
    } catch (e) {
    }
    showLORealEstateInfo(encryptedLMRId);

}

function showLORealEstateInfo(LMRId) {
    var url = "", qstr = "";
    url = "../backoffice/getLORealEstateInfo.php";
    qstr = "LMRId=" + LMRId;
    var displayList = "";
    try {
        displayList = getResponse(url, qstr);
    } catch (e) {
    }
    try {
        document.getElementById("showLORealEstateInfo").innerHTML = displayList;
    } catch (e) {
    }
    eval("ContactPop.init('" + POPSURL + "addLORealEstateInfo.php', 'addLORealEstateInfo.php', 'Add Schedule of Real Estate', '" + POPSURL + "','LORealEstateFormSave.php' , 900, 220)");
    try {
        ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
}

function deleteLOScheduleRealInfo(LMRId, LOSRID) {
    //$('.with-children-tip > *').hideTip();
    var cfmMsg = "Are you sure to delete?";
    if (confirm(cfmMsg)) {
        var delCnt = 0, url = "", qstr = "";
        url = "../backoffice/deleteLOScheduleRealInfo.php";
        qstr = "LOSRID=" + LOSRID;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
        } catch (e) {
        }
        if (delCnt > 0) {
            showLORealEstateInfo(LMRId);
        }
    }
}

function showAndHideDivTM(fldValue, divId) {
    if (fldValue == 'Other') {
        document.getElementById(divId).style.display = 'flex';
    } else {
        document.getElementById(divId).style.display = 'none';
    }
}

function calculateTotalCosts(currentvalue) {

    var purchasePrice = "", alterImpRepairs = "", land = "", refinance = '', estimatedPrepaidItems = '',
        estimatedClosingCosts = '', PMIMIPFundFee = '', discount = '';

    alertToEnterInput(currentvalue);

    try {
        purchasePrice = document.loanModForm.purchasePrice.value;
    } catch (e) {
    }

    try {
        alterImpRepairs = document.loanModForm.alterImpRepairs.value;
    } catch (e) {
    }

    try {
        land = document.loanModForm.land.value;
    } catch (e) {
    }


    try {
        refinance = document.loanModForm.refinance.value;
    } catch (e) {
    }


    try {
        estimatedPrepaidItems = document.loanModForm.estimatedPrepaidItems.value;
    } catch (e) {
    }

    try {
        estimatedClosingCosts = document.loanModForm.estimatedClosingCosts.value;
    } catch (e) {
    }


    try {
        PMIMIPFundFee = document.loanModForm.PMIMIPFundFee.value;
    } catch (e) {
    }


    try {
        discount = document.loanModForm.discount.value;
    } catch (e) {
    }


    purchasePrice = replaceCommaValues(purchasePrice);
    alterImpRepairs = replaceCommaValues(alterImpRepairs);
    land = replaceCommaValues(land);
    refinance = replaceCommaValues(refinance);
    estimatedPrepaidItems = replaceCommaValues(estimatedPrepaidItems);
    estimatedClosingCosts = replaceCommaValues(estimatedClosingCosts);
    PMIMIPFundFee = replaceCommaValues(PMIMIPFundFee);
    discount = replaceCommaValues(discount);


    if (purchasePrice == "") purchasePrice = 0;
    if (alterImpRepairs == "") alterImpRepairs = 0;
    if (land == "") land = 0;
    if (refinance == "") refinance = 0;
    if (estimatedPrepaidItems == "") estimatedPrepaidItems = 0;
    if (estimatedClosingCosts == "") estimatedClosingCosts = 0;
    if (PMIMIPFundFee == "") PMIMIPFundFee = 0;
    if (discount == "") discount = 0;


    totalCosts = parseFloat(purchasePrice) + parseFloat(alterImpRepairs)
        + parseFloat(land)
        + parseFloat(refinance)
        + parseFloat(estimatedPrepaidItems)
        + parseFloat(estimatedClosingCosts)
        + parseFloat(PMIMIPFundFee)
        + parseFloat(discount);
    totalCosts = parseFloat(totalCosts);
    totalCosts = totalCosts.toFixed(2);

    try {
        document.getElementById("totalCosts").innerHTML = totalCosts;
    } catch (e) {
    }
}


function calculateTotalLoanAmt(currentvalue) {

    var loanAmountExclude = "", PMIMIPFundingFeeFin = "";

    alertToEnterInput(currentvalue);

    try {
        loanAmountExclude = document.loanModForm.loanAmountExclude.value;
    } catch (e) {
    }

    try {
        PMIMIPFundingFeeFin = document.loanModForm.PMIMIPFundingFeeFin.value;
    } catch (e) {
    }


    loanAmountExclude = replaceCommaValues(loanAmountExclude);
    PMIMIPFundingFeeFin = replaceCommaValues(PMIMIPFundingFeeFin);


    if (loanAmountExclude == "") loanAmountExclude = 0;
    if (PMIMIPFundingFeeFin == "") PMIMIPFundingFeeFin = 0;

    totalLoanAmt = parseFloat(loanAmountExclude) + parseFloat(PMIMIPFundingFeeFin);
    totalLoanAmt = parseFloat(totalLoanAmt);
    totalLoanAmt = totalLoanAmt.toFixed(2);

    try {
        document.getElementById("totalLoanAmt").innerHTML = totalLoanAmt;
    } catch (e) {
    }
}

function calculateTotalAmt(currentvalue) {

    var amtExistLiens = "", presentValOfLot = "";

    alertToEnterInput(currentvalue);

    try {
        amtExistLiens = document.loanModForm.amtExistLiens.value;
    } catch (e) {
    }

    try {
        presentValOfLot = document.loanModForm.presentValOfLot.value;
    } catch (e) {
    }


    amtExistLiens = replaceCommaValues(amtExistLiens);
    presentValOfLot = replaceCommaValues(presentValOfLot);


    if (amtExistLiens == "") amtExistLiens = 0;
    if (presentValOfLot == "") presentValOfLot = 0;

    totalAmount = parseFloat(amtExistLiens) + parseFloat(presentValOfLot);
    totalAmount = parseFloat(totalAmount);
    totalAmount = totalAmount.toFixed(2);

    try {
        document.getElementById("totalAmount").innerHTML = totalAmount;
    } catch (e) {
    }
}

function showAndHidePurposeOfLoanDiv(fldValue, divId) {
    if (fldValue == 'Other') {
        document.getElementById(divId).style.display = 'table-row';
    } else {
        document.getElementById(divId).style.display = 'none';
    }
}

function showAndHidePurLoanDiv(fldValue) {
    if (fldValue == 'Construction' || fldValue == 'Construction - Permanent') {
        $('.ConstructionDiv').show();
        $('.refinanceDiv').hide();
        $('.purposeDiv').show();

    } else if (fldValue == 'Refinance') {

        $('.ConstructionDiv').hide();
        $('.refinanceDiv').show();
        $('.purposeDiv').show();

    } else {
        $('.purposeDiv').hide();
        $('.refinanceDiv').hide();
        $('.ConstructionDiv').hide();

    }
}

function showAndHideDiv1(fldValue, divId) {
    if (fldValue == 'Other') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
    }
}

function saveOtherCredits() {
    var otherCreditsAmount = "", otherCreditsName = "", LMRId = 0;
    var url = "", qstr = "", xmlDoc = "", otherCreditsCnt = 0;

    LOOCID = $('#LOOCID').val();
    LMRId = $('#LMRId').val();
    encryptedLMRId = document.loanModForm.encryptedLId.value;

    otherCreditsName = $('#otherCreditsName').val();
    otherCreditsAmount = $('#otherCreditsAmount').val();
    otherCreditsCnt = document.loanModForm.otherCreditsCnt.value;

    if (chkIsBlank('otherCreditsForm', 'otherCreditsName', 'Please enter Other Credits Name') &&
        chkIsBlank('otherCreditsForm', 'otherCreditsAmount', 'Please enter Other Credits Amount')
    ) {
        url = "../pops/saveOtherCredits.php";
        qstr = "LOOCID=" + LOOCID + "&LMRId=" + LMRId + "&otherCreditsName=" + otherCreditsName + "&otherCreditsAmount=" + otherCreditsAmount;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            cnt = xmlDoc.getElementsByTagName("rsResp")[0].firstChild.nodeValue;
        } catch (e) {
        }

        var tempVal = (parseInt(otherCreditsCnt) + 1);
        document.loanModForm.otherCreditsCnt.value = tempVal;
        if (tempVal >= 7) {
            $('#hideOtherCredits').hide();
        }
        $('#exampleModal1').modal('hide');
        showOtherCreditsInfo(encryptedLMRId);
    } else {
        return false;
    }
}

function showOtherCreditsInfo(LMRId) {
    var url = "", qstr = "", totalotherCreditsAmt = 0;
    ;
    url = "../backoffice/getOtherCreditsInfo.php";
    qstr = "LMRId=" + LMRId;
    var resInfoArray = new Array(), displayList = "";
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        resInfoArray = xmlDoc.getElementsByTagName("otherCredits");
    } catch (e) {
    }
    displayList = "<table  class='table table-hover  table-bordered table-condensed table-sm table-vertical-center'>" +
        "<thead class=\"thead-light\">" +
        "<tr >" +
        "<th colspan=\"2\">&nbsp;#</th>" +
        "<th style=\"border-right:1px solid #ffffff;\">&nbsp;Other Credits Name</th>" +
        "<th style=\"border-right:1px solid #ffffff;\">&nbsp;Other Credits Amount</th>" +
        "<th style=\"border:0px solid #000000;\">&nbsp;</th>" +
        "</tr>";

    for (var ub = 0; ub < resInfoArray.length; ub++) {

        var otherCreditsName = "", otherCreditsAmount = "", totalotherCreditsAmt = 0;
        var LMRId = "", encLMRId = "", LOOCID = "";

        try {
            otherCreditsName = resInfoArray[ub].getElementsByTagName("otherCreditsName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            otherCreditsAmount = resInfoArray[ub].getElementsByTagName("otherCreditsAmount")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            encLMRId = resInfoArray[ub].getElementsByTagName("encLMRId")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            LOOCID = resInfoArray[ub].getElementsByTagName("LOOCID")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            encLID = resInfoArray[ub].getElementsByTagName("encLID")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            totalotherCreditsAmt = resInfoArray[ub].getElementsByTagName("totalotherCreditsAmt")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        slno = ub + 1;
        var tmpCls = "";
        if ((slno % 2) == 0) {
            tmpCls = "even";
        }
        displayList += "<tr class=" + tmpCls + ">";
        displayList += "<td valign=\"top\">" + slno + "</td>";
        displayList += "<td valign=\"top\"><a class=\"btn btn-sm btn-light btn-text-primary btn-hover-primary btn-icon m-1 tooltipClass\" style=\"text-decoration:none;\" " +
            "data-href=  '" + POPSURL + "addOtherCredits.php' data-id=\"LMRID=" + encLMRId + "&LOOCID=" + encLID + "\" title=\"Click to edit\"><i class=\"fa fa-edit\"></i></a></td>";
        displayList += "<td valign=\"top\">" + otherCreditsName + "</td>";
        displayList += "<td valign=\"top\">$ " + otherCreditsAmount + "</td>";
        displayList += "<td valign=\"top\" ><a class=\"btn btn-xs btn-danger btn-text-primary  btn-icon m-1 tooltipClass\" style=\"text-decoration:none;\" href=\"javascript:deleteOtherCreditsInfo('" + encLMRId + "','" + encLID + "');\" title=\"Click to delete\"><i class=\"flaticon2-trash\"></i></a></td>";
        displayList += "</tr>";
    }
    displayList += "</table>";
    try {
        document.getElementById("showOtherCreditsInfo").innerHTML = displayList;
    } catch (e) {
    }

    try {
        document.loanModForm.otherCreditsAmt.value = totalotherCreditsAmt;
    } catch (e) {
    }

    calculateCashFromToborrower();
    try {
        ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
}

function editOtherCreditsInfo(LMRId, LOOCID) {
    qstr = 'LMRID=' + LMRId + '&LOOCID=' + LOOCID;
    calculateCashFromToborrower();
    eval("ContactPop.showOverlay('" + POPSURL + "addOtherCredits.php')"); /** Open Popup **/
}

function deleteOtherCreditsInfo(LMRId, LOOCID) {
    //$('.with-children-tip > *').hideTip();
    var cfmMsg = "Are you sure to delete?";
    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: cfmMsg,
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            yes: {
                btnClass: 'btn-green',
                action: function () {
                    // if (confirm(cfmMsg)) {
                    var delCnt = 0, url = "", qstr = "";
                    url = "../backoffice/deleteOtherCreditsInfo.php";
                    qstr = "LOOCID=" + LOOCID;
                    try {
                        xmlDoc = getXMLDoc(url, qstr);
                    } catch (e) {
                    }
                    try {
                        delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
                    } catch (e) {
                    }
                    var otherCreditsCnt = document.loanModForm.otherCreditsCnt.value;

                    var tempVal = (parseInt(otherCreditsCnt) - 1);
                    document.loanModForm.otherCreditsCnt.value = tempVal;
                    if (tempVal <= 7) {
                        $('#hideOtherCredits').show();
                    }
                    if (delCnt > 0) {
                        calculateCashFromToborrower();
                        showOtherCreditsInfo(LMRId);
                    }
                    //   }

                }
            },
            cancel: {
                text: 'Cancel',
                action: function () {
                    //  location.reload();
                }
            },
        }
    });


}

function saveEmployementInfo() {
    var addrOfEmployer = "", nameOfEmployer = "", LMRId = 0, employmentType = '', employedFrom = '', employedTo = '',
        monthlyIncome = '', position = '', businessPhone = '', businessPhone2 = '', businessPhone3 = '',
        businessPhoneExt = '', additionalEmpCnt = '', cityOfEmployer = '', stateOfEmployer = '', zipOfEmployer = '',
        countryOfEmployer = '',
        addOrPrevJob = '',
        yrsEmployed = '',
        employedByOtherParty = 0,
        ownerOrSelfEmpoyed = 0,
        overtime = '',
        commissionOrBonus = '',
        militaryIncome = '',
        otherHouseHold = '',
        otherIncomeSources = '',
        otherSourcesIncome = '';
    var url = "", qstr = "", xmlDoc = "", emptypeshare = "", empmonthlyincome = "";

    LOBEID = $('#LOBEID').val();
    LMRId = $('#LMRId').val();
    encryptedLMRId = document.loanModForm.encryptedLId.value;

    nameOfEmployer = $('#nameOfEmployer').val();
    addrOfEmployer = $('#addrOfEmployer').val();
    cityOfEmployer = $('#cityOfEmployer').val();
    stateOfEmployer = $('#stateOfEmployer').val();
    zipOfEmployer = $('#zipOfEmployer').val();
    countryOfEmployer = $('#countryOfEmployer').val();
    employmentType = $('#employmentType').val();
    employedFrom = $('#employedFrom').val();
    employedTo = $('#employedTo').val();
    monthlyIncome = $('#monthlyIncome').val();
    position = $('#position').val();
    businessPhone = $('#businessPhone1').val();

    addOrPrevJob = $('#addOrPrevJob').val();
    yrsEmployed = $('#yrsEmployed').val();//employementForm
    if ($('form#employementForm #employedByOtherParty').prop('checked') == true) {
        employedByOtherParty = 1;
    }else{
        employedByOtherParty = 0;
    }
    if ($('form#employementForm #ownerOrSelfEmpoyed').prop('checked') == true) {
        ownerOrSelfEmpoyed = 1;
    }else{
        ownerOrSelfEmpoyed = 0;
    }
    overtime = $('#overtime').val();
    commissionOrBonus = $('#commissionOrBonus').val();
    militaryIncome = $('#militaryIncome').val();
    otherHouseHold = $('#otherHouseHold').val();
    otherIncomeSources = $('#otherIncomeSources').val();
    otherSourcesIncome = $('#otherSourcesIncome').val();

    // businessPhone2 = $('#businessPhone2').val();
    // businessPhone3 = $('#businessPhone3').val();
    // businessPhoneExt = $('#businessPhoneExt').val();
    emptypeshare = $('input[name=emptypeshare]:checked').val();
    empmonthlyincome = $('#empmonthlyincome').val();
    additionalEmpCnt = document.loanModForm.additionalEmpCnt.value;

    if (chkIsBlank('employementForm', 'nameOfEmployer', 'Please enter Name Of Employer')
    ) {
        url = POPSURL + "saveEmployementInfo.php";
        qstr = "LOBEID=" + LOBEID + "&LMRId=" + LMRId + "&cityOfEmployer=" + cityOfEmployer + "&stateOfEmployer=" + stateOfEmployer +
            "&zipOfEmployer=" + zipOfEmployer + "&countryOfEmployer=" + countryOfEmployer + "&nameOfEmployer=" + nameOfEmployer +
            "&addrOfEmployer=" + addrOfEmployer + "&employmentType=" + employmentType + "&employedFrom=" + employedFrom +
            "&employedTo=" + employedTo + "&monthlyIncome=" + monthlyIncome + "&position=" + position + "&businessPhone=" +
            businessPhone + "&emptypeshare=" + emptypeshare + "&empmonthlyincome=" + empmonthlyincome + "&addOrPrevJob= " + addOrPrevJob +
            "&yrsEmployed= " + yrsEmployed +
            "&employedByOtherParty= " + employedByOtherParty +
            "&ownerOrSelfEmpoyed= " + ownerOrSelfEmpoyed +
            "&overtime= " + overtime +
            "&commissionOrBonus= " + commissionOrBonus +
            "&militaryIncome= " + militaryIncome +
            "&otherHouseHold= " + otherHouseHold +
            "&otherIncomeSources= " + otherIncomeSources +
            "&otherSourcesIncome= " + otherSourcesIncome;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            cnt = xmlDoc.getElementsByTagName("rsResp")[0].firstChild.nodeValue;
        } catch (e) {
        }

        var tempVal = (parseInt(additionalEmpCnt) + 1);
        document.loanModForm.additionalEmpCnt.value = tempVal;
        if (tempVal >= 2) {
            $('#hideAddnlEmpInfo').hide();
        }
        showEmployementInfo(encryptedLMRId, 'save');
    } else {
        return false;
    }
}

function showEmployementInfo(LMRId, type) {
    var url = "", qstr = "";
    url = BOSSLURL + "getEmployementInfo.php";
    qstr = "LMRId=" + LMRId;
    var displayList = "";
    try {
        displayList = getResponse(url, qstr);
    } catch (e) {
    }
    try {
        document.getElementById("showEmploymentInfo").innerHTML = displayList;
    } catch (e) {
    }
    if (type == 'save') {
        $('#exampleModal1').modal('toggle');
    }

    //eval("ContactPop.init('" + POPSURL + "addBoEmploymentInfo.php', 'addBoEmploymentInfo.php', 'Add Employment Information', '" + POPSURL + "','saveEmployementInfo.php' , 500, 300)");
    try {
        // ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
}

function deleteEmployementInfo2(LMRId, LOBEID, sectionNum) {
    var cfmMsg = "";
    countNumOfDivs = $('.borEmplAdditional').length;

    if(LOBEID == "") {
        if(sectionNum == 1 && countNumOfDivs == 1) {
            clear_form_elements('borEmplAdditionalDiv'+sectionNum);
        }
        if(sectionNum == 2) {
            $('.borEmplAdditionalDiv'+sectionNum).remove();
        }
    } else {
        $.confirm({
            icon: 'fa fa-warning',
            closeIcon: true,
            title: 'Confirm',
            content: "Are you sure to delete?",
            type: 'red',
            backgroundDismiss: true,
            buttons: {
                yes: {
                    btnClass: 'btn-green',
                    action: function () {
                        var delCnt = 0, url = "", qstr = "", additionalEmpCnt = '';
                        url = siteSSLUrl + "backoffice/deleteEmployementInfo.php";
                        qstr = "LOBEID=" + LOBEID;
                        try {
                            xmlDoc = getXMLDoc(url, qstr);
                        } catch (e) {
                        }
                        try {
                            delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
                        } catch (e) {
                        }
                        additionalEmpCnt = document.loanModForm.additionalEmpCnt.value;

                        var tempVal = (parseInt(additionalEmpCnt) - 1);
                        document.loanModForm.additionalEmpCnt.value = tempVal;
                        if (tempVal <= 2) {
                            $('#hideAddnlEmpInfo').show();
                        }
                        if (delCnt > 0) {
                            // showEmployementInfo(LMRId, 'delete');
                        }
                    }
                },
                cancel: {
                    text: 'Cancel',
                    action: function () {
                        //  location.reload();
                    }
                },
            }
        });
    }
}
$(document).ready(function() {
    $('body').on("click",".deleteEmployementInfoCls",function () {
        var lobeid = lmrid = '';
        var lmrid = $(this).attr('data-lmrid');
        var lobeid = $(this).attr('data-lobeid');
        sectionnum = parseInt($(this).attr('data-sectionnum'));
        countNumOfDivs = $('.borEmplAdditional').length;
        publicUser = $('input[name="publicUser"]').val();

        if (lobeid == "") {
            if (sectionnum == 1) {
                clear_form_elements('borEmplAdditionalDiv' + sectionnum);
            }
            if (sectionnum > 1) {
                $('.borEmplAdditionalDiv' + sectionnum).remove();
            }
        } else {
            $.confirm({
                icon: 'fa fa-warning',
                closeIcon: true,
                title: 'Confirm',
                content: "Are you sure to delete?",
                type: 'red',
                backgroundDismiss: true,
                buttons: {
                    yes: {
                        btnClass: 'btn-green',
                        action: function () {
                            var delCnt = 0, url = "", qstr = "", additionalEmpCnt = '';
                            url = siteSSLUrl + "backoffice/deleteEmployementInfo.php";
                            qstr = "lobeid=" + lobeid;
                            try {
                                xmlDoc = getXMLDoc(url, qstr);
                            } catch (e) {
                            }
                            try {
                                delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
                            } catch (e) {
                            }
                            additionalEmpCnt = document.loanModForm.additionalEmpCnt.value;

                            var tempVal = (parseInt(additionalEmpCnt) - 1);
                            document.loanModForm.additionalEmpCnt.value = tempVal;
                            if (delCnt > 0) {
                                if (sectionnum === 1) {
                                    clear_form_elements('borEmplAdditionalDiv' + sectionnum);
                                }
                                if (sectionnum > 1) {
                                    $('.borEmplAdditionalDiv' + sectionnum).remove();
                                }
                            }
                        }
                    },
                    cancel: {
                        text: 'Cancel',
                        action: function () {
                            //  location.reload();
                        }
                    },
                }
            });
        }
        if (publicUser == 0) {
            enableSaveButton();
        }
    });
});
function saveCoBEmployementInfo() {
    var addrOfEmployer = "", nameOfEmployer = "", LMRId = 0, employmentType = '', employedFrom = '', employedTo = '',
        monthlyIncome = '', position = '', businessPhone = '', businessPhone2 = '', businessPhone3 = '',
        businessPhoneExt = '', additionalCoBEmpCnt = '';
    var url = "", qstr = "", xmlDoc = "", coboremptypeshare = '', coborpopempmonthlyincome = '';

    LOCBID = $('#LOCBID').val();
    LMRId = $('#LMRId').val();
    encryptedLMRId = document.loanModForm.encryptedLId.value;

    nameOfEmployer = $('#nameOfEmployer').val();
    addrOfEmployer = $('#addrOfEmployer').val();
    employmentType = $('#employmentType').val();
    employedFrom = $('#employedFrom').val();
    employedTo = $('#employedTo').val();
    monthlyIncome = $('#monthlyIncome').val();
    position = $('#position').val();
    businessPhone = $('#businessPhone1').val();
    // businessPhone2 = $('#businessPhone2').val();
    // businessPhone3 = $('#businessPhone3').val();
    // businessPhoneExt = $('#businessPhoneExt').val();
    coboremptypeshare = $('input[name=coboremptypeshare]:checked').val();
    coborpopempmonthlyincome = $('#coborpopempmonthlyincome').val();

    additionalCoBEmpCnt = document.loanModForm.additionalCoBEmpCnt.value;

    if (chkIsBlank('coBEmployementForm', 'nameOfEmployer', 'Please enter Name Of Employer')
    ) {
        url = "../pops/saveCoBEmployementInfo.php";
        qstr = "LOCBID=" + LOCBID + "&LMRId=" + LMRId + "&nameOfEmployer=" + nameOfEmployer + "&addrOfEmployer=" + addrOfEmployer + "&employmentType=" + employmentType + "&employedFrom=" + employedFrom + "&employedTo=" + employedTo + "&monthlyIncome=" + monthlyIncome + "&position=" + position + "&businessPhone=" + businessPhone + "&coboremptypeshare=" + coboremptypeshare + "&coborpopempmonthlyincome=" + coborpopempmonthlyincome;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            cnt = xmlDoc.getElementsByTagName("rsResp")[0].firstChild.nodeValue;
        } catch (e) {
        }

        var tempVal = (parseInt(additionalCoBEmpCnt) + 1);
        document.loanModForm.additionalCoBEmpCnt.value = tempVal;
        if (tempVal >= 2) {
            $('#hideCoBAddnlEmpInfo').hide();
        }
        showCoBEmployementInfo(encryptedLMRId, 'save');
    } else {
        return false;
    }
}

function showCoBEmployementInfo(LMRId, type) {
    var url = "", qstr = "";
    url = siteSSLUrl + "backoffice/getCoBEmployementInfo.php";
    qstr = "LMRId=" + LMRId;
    var displayList = "";
    try {
        displayList = getResponse(url, qstr);
    } catch (e) {
    }
    try {
        document.getElementById("showCoBEmploymentInfo").innerHTML = displayList;
    } catch (e) {
    }
    if (type == 'save') {
        $('#exampleModal1').modal('toggle');
    }
    /* eval("ContactPop.init('" + POPSURL + "addCobEmploymentInfo.php', 'addCobEmploymentInfo.php', 'Add Employment Information', '" + POPSURL + "','saveCoBEmployementInfo.php' , 500, 300)");
     try {
         ContactPop.hideOverlay(); /!** Close- Popup **!/
     } catch (e) {
     }*/
}

function deleteCoBEmployementInfo(LMRId, LOCBID) {
    //$('.with-children-tip > *').hideTip();
    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: "Are you sure to delete?",
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            yes: {
                btnClass: 'btn-green',
                action: function () {
                    var delCnt = 0, url = "", qstr = "", additionalCoBEmpCnt = '';
                    url = siteSSLUrl + "backoffice/deleteCoBEmployementInfo.php";
                    qstr = "LOCBID=" + LOCBID;
                    try {
                        xmlDoc = getXMLDoc(url, qstr);
                    } catch (e) {
                    }
                    try {
                        delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
                    } catch (e) {
                    }
                    additionalCoBEmpCnt = document.loanModForm.additionalCoBEmpCnt.value;
                    var tempVal = (parseInt(additionalCoBEmpCnt) - 1);
                    document.loanModForm.additionalCoBEmpCnt.value = tempVal;
                    if (tempVal <= 2) {
                        $('#hideCoBAddnlEmpInfo').show();
                    }
                    if (delCnt > 0) {
                        showCoBEmployementInfo(LMRId, 'delete');
                    }
                }
            },
            cancel: {
                text: 'Cancel',
                action: function () {
                    //  location.reload();
                }
            },
        }
    });
}

function calculateCashFromToborrower() {

    var purchasePrice = "", alterImpRepairs = "", land = "", refinance = '', estimatedPrepaidItems = '',
        estimatedClosingCosts = '', PMIMIPFundFee = '', discount = '', subordinateFinancing = '',
        borCloCostPaidSeller = '', loanAmountExclude = '', PMIMIPFundingFeeFin = '', otherCreditsAmt = '';


    try {
        purchasePrice = document.loanModForm.purchasePrice.value;
    } catch (e) {
    }

    try {
        alterImpRepairs = document.loanModForm.alterImpRepairs.value;
    } catch (e) {
    }

    try {
        land = document.loanModForm.land.value;
    } catch (e) {
    }


    try {
        refinance = document.loanModForm.refinance.value;
    } catch (e) {
    }


    try {
        estimatedPrepaidItems = document.loanModForm.estimatedPrepaidItems.value;
    } catch (e) {
    }

    try {
        estimatedClosingCosts = document.loanModForm.estimatedClosingCosts.value;
    } catch (e) {
    }


    try {
        PMIMIPFundFee = document.loanModForm.PMIMIPFundFee.value;
    } catch (e) {
    }


    try {
        discount = document.loanModForm.discount.value;
    } catch (e) {
    }


    try {
        subordinateFinancing = document.loanModForm.subordinateFinancing.value;
    } catch (e) {
    }

    try {
        borCloCostPaidSeller = document.loanModForm.borCloCostPaidSeller.value;
    } catch (e) {
    }


    try {
        loanAmountExclude = document.loanModForm.loanAmountExclude.value;
    } catch (e) {
    }

    try {
        PMIMIPFundingFeeFin = document.loanModForm.PMIMIPFundingFeeFin.value;
    } catch (e) {
    }


    try {
        otherCreditsAmt = document.loanModForm.otherCreditsAmt.value;
    } catch (e) {
    }


    purchasePrice = replaceCommaValues(purchasePrice);
    alterImpRepairs = replaceCommaValues(alterImpRepairs);
    land = replaceCommaValues(land);
    refinance = replaceCommaValues(refinance);
    estimatedPrepaidItems = replaceCommaValues(estimatedPrepaidItems);
    estimatedClosingCosts = replaceCommaValues(estimatedClosingCosts);
    PMIMIPFundFee = replaceCommaValues(PMIMIPFundFee);
    discount = replaceCommaValues(discount);

    subordinateFinancing = replaceCommaValues(subordinateFinancing);
    borCloCostPaidSeller = replaceCommaValues(borCloCostPaidSeller);

    loanAmountExclude = replaceCommaValues(loanAmountExclude);
    PMIMIPFundingFeeFin = replaceCommaValues(PMIMIPFundingFeeFin);
    otherCreditsAmt = replaceCommaValues(otherCreditsAmt);


    if (purchasePrice == "") purchasePrice = 0;
    if (alterImpRepairs == "") alterImpRepairs = 0;
    if (land == "") land = 0;
    if (refinance == "") refinance = 0;
    if (estimatedPrepaidItems == "") estimatedPrepaidItems = 0;
    if (estimatedClosingCosts == "") estimatedClosingCosts = 0;
    if (PMIMIPFundFee == "") PMIMIPFundFee = 0;
    if (discount == "") discount = 0;

    if (subordinateFinancing == "") subordinateFinancing = 0;
    if (borCloCostPaidSeller == "") borCloCostPaidSeller = 0;

    if (loanAmountExclude == "") loanAmountExclude = 0;
    if (PMIMIPFundingFeeFin == "") PMIMIPFundingFeeFin = 0;
    if (otherCreditsAmt == "") otherCreditsAmt = 0;


    totalCosts = parseFloat(purchasePrice) + parseFloat(alterImpRepairs)
        + parseFloat(land)
        + parseFloat(refinance)
        + parseFloat(estimatedPrepaidItems)
        + parseFloat(estimatedClosingCosts)
        + parseFloat(PMIMIPFundFee)
        + parseFloat(discount);
    totalCosts = parseFloat(totalCosts);
    totalCosts = totalCosts.toFixed(2);

    cashFromToborrower = totalCosts - subordinateFinancing - borCloCostPaidSeller - loanAmountExclude - PMIMIPFundingFeeFin - otherCreditsAmt;

    cashFromToborrower = parseFloat(cashFromToborrower);
    cashFromToborrower = cashFromToborrower.toFixed(2);

    try {
        document.getElementById("cashFromBorrower").innerHTML = cashFromToborrower;
    } catch (e) {
    }


}

function calculateTotalSumOfAll() {

    var assetCash = '', vestedInterest = '', networthOfBusinessOwned = '', assetStocks = '', assetORE = '',
        assetCars = '', assetCarsOwed = '', automobilesOwned1 = '', assetLifeInsurance = '', faceAmount = '',
        assetOther = '', otherAssets = '', totalSumOfAll = 0;

    try {
        assetCash = document.loanModForm.assetCash.value;
    } catch (e) {
    }
    try {
        vestedInterest = document.loanModForm.vestedInterest.value;
    } catch (e) {
    }
    try {
        networthOfBusinessOwned = document.loanModForm.networthOfBusinessOwned.value;
    } catch (e) {
    }
    try {
        assetStocks = document.loanModForm.assetStocks.value;
    } catch (e) {
    }
    try {
        assetORE = document.loanModForm.assetORE.value;
    } catch (e) {
    }
    try {
        assetCars = document.loanModForm.assetCars.value;
    } catch (e) {
    }
    try {
        assetCarsOwed = document.loanModForm.assetCarsOwed.value;
    } catch (e) {
    }
    try {
        automobilesOwned1 = document.loanModForm.automobilesOwned1.value;
    } catch (e) {
    }
    try {
        assetLifeInsurance = document.loanModForm.assetLifeInsurance.value;
    } catch (e) {
    }
    try {
        faceAmount = document.loanModForm.faceAmount.value;
    } catch (e) {
    }
    try {
        assetOther = document.loanModForm.assetOther.value;
    } catch (e) {
    }
    try {
        otherAssets = document.loanModForm.otherAssets.value;
    } catch (e) {
    }
    try {
        automobilesOwned3x = document.loanModForm.automobilesOwned3x.value;
    } catch (e) {
    }

    if (assetCash == "") assetCash = 0;
    if (vestedInterest == "") vestedInterest = 0;
    if (networthOfBusinessOwned == "") networthOfBusinessOwned = 0;
    if (assetStocks == "") assetStocks = 0;
    if (assetORE == "") assetORE = 0;
    if (assetCars == "") assetCars = 0;
    if (assetCarsOwed == "") assetCarsOwed = 0;

    if (automobilesOwned1 == "") automobilesOwned1 = 0;
    if (assetLifeInsurance == "") assetLifeInsurance = 0;

    if (faceAmount == "") faceAmount = 0;
    if (assetOther == "") assetOther = 0;
    if (otherAssets == "") otherAssets = 0;
    if (automobilesOwned3x == "") automobilesOwned3x = 0;


    totalSumOfAll = parseFloat(assetCash)
        + parseFloat(vestedInterest)
        + parseFloat(networthOfBusinessOwned)
        + parseFloat(assetStocks)
        + parseFloat(assetORE)
        + parseFloat(assetCars)
        + parseFloat(assetCarsOwed)
        + parseFloat(automobilesOwned1)
        + parseFloat(assetLifeInsurance)
        + parseFloat(faceAmount)
        + parseFloat(assetOther)
        + parseFloat(otherAssets)
        + parseFloat(automobilesOwned3x);

    totalSumOfAll = parseFloat(totalSumOfAll);
    totalSumOfAll = totalSumOfAll.toFixed(2);

    try {
        document.getElementById("totalSumOfAll").innerHTML = totalSumOfAll;
    } catch (e) {
    }

}

function autoPopulateLOPresentAdd() {
    var opt = 0;
    try {
        opt = document.loanModForm.mailingAddrAsPresent.value;
    } catch (e) {
    }
    var len = 0, k = 0;
    try {
        eval("obj = document.loanModForm['fileModule[]']");
        len = obj.length;
    } catch (e) {
    }
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].selected) {
            if (obj[i].value == 'HMLO') {
                k++;
                break;
            }
        }
    }
    if (k > 0) {
        if (opt == 1) {
            $(".hideMailingAddr").css("display", "flex");
            try {
                document.loanModForm.mailingAddress.value = document.loanModForm.presentAddress.value;
            } catch (e) {
            }
            try {
                document.loanModForm.mailingCity.value = document.loanModForm.presentCity.value;
            } catch (e) {
            }
            try {
                document.loanModForm.mailingState.value = document.loanModForm.presentState.value;
            } catch (e) {
            }
            try {
                document.loanModForm.mailingZip.value = document.loanModForm.presentZip.value;
                document.loanModForm.mailingUnit.value = document.loanModForm.presentUnit.value;
                document.loanModForm.mailingCountry.value = document.loanModForm.presentCountry.value;
            } catch (e) {
            }
        } else {
            $(".hideMailingAddr").css("display", "flex");
            try {
                document.loanModForm.mailingAddress.value = "";
            } catch (e) {
            }
            try {
                document.loanModForm.mailingCity.value = "";
            } catch (e) {
            }
            try {
                document.loanModForm.mailingState.value = "";
            } catch (e) {
            }
            try {
                document.loanModForm.mailingZip.value = "";
                document.loanModForm.mailingUnit.value = "";
                document.loanModForm.mailingCountry.value = "";
            } catch (e) {
            }
        }
    } else {
        if (opt == 1) {
            try {
                document.loanModForm.mailingAddress.value = document.loanModForm.presentAddress.value;
            } catch (e) {
            }
            try {
                document.loanModForm.mailingCity.value = document.loanModForm.presentCity.value;
            } catch (e) {
            }
            try {
                document.loanModForm.mailingState.value = document.loanModForm.presentState.value;
            } catch (e) {
            }
            try {
                document.loanModForm.mailingZip.value = document.loanModForm.presentZip.value;
                document.loanModForm.mailingUnit.value = document.loanModForm.presentUnit.value;
                document.loanModForm.mailingCountry.value = document.loanModForm.presentCountry.value;
            } catch (e) {
            }

        } else {
            clearLOLOPresentAdd();
        }
    }
}

function clearLOLOPresentAdd() {
    try {
        document.loanModForm.mailingAddress.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.mailingCity.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.mailingState.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.mailingZip.value = "";
    } catch (e) {
    }
}

function autoPopulateCoBPresentAddr() {
    var opt = 0;
    try {
        opt = document.loanModForm.coBorMailingAddrAsPresent.value;
    } catch (e) {
    }
    var len = 0, k = 0;
    try {
        eval("obj = document.loanModForm['fileModule[]']");
        len = obj.length;
    } catch (e) {
    }
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].selected) {
            if (obj[i].value == 'HMLO') {
                k++;
                break;
            }
        }
    }

    if (k > 0) {
        if (opt == 1) {
            $(".hideMailingAddr").css("display", "flex");
            try {
                document.loanModForm.coBorrowerMailingAddress.value = document.loanModForm.coBPresentAddress.value;
            } catch (e) {
            }
            try {
                document.loanModForm.coBorrowerMailingCity.value = document.loanModForm.coBPresentCity.value;
            } catch (e) {
            }
            try {
                document.loanModForm.coBorrowerMailingState.value = document.loanModForm.coBPresentState.value;
            } catch (e) {
            }
            try {
                document.loanModForm.coBorrowerMailingZip.value = document.loanModForm.coBPresentZip.value;
            } catch (e) {
            }
        } else {
            $(".hideMailingAddr").css("display", "flex");
            try {
                document.loanModForm.coBorrowerMailingAddress.value = "";
            } catch (e) {
            }
            try {
                document.loanModForm.coBorrowerMailingCity.value = "";
            } catch (e) {
            }
            try {
                document.loanModForm.coBorrowerMailingState.value = "";
            } catch (e) {
            }
            try {
                document.loanModForm.coBorrowerMailingZip.value = "";
            } catch (e) {
            }
        }
    } else {
        if (opt == 1) {
            try {
                document.loanModForm.coBPresentAddress.value = document.loanModForm.coBorrowerMailingAddress.value;
            } catch (e) {
            }

            try {
                document.loanModForm.coBPresentCity.value = document.loanModForm.coBorrowerMailingCity.value;
            } catch (e) {
            }
            try {
                document.loanModForm.coBPresentState.value = document.loanModForm.coBorrowerMailingState.value;
            } catch (e) {
            }
            try {
                document.loanModForm.coBPresentZip.value = document.loanModForm.coBorrowerMailingZip.value;
            } catch (e) {
            }

        } else {
            clearLOLOCoBPresentAdd();
        }
    }
}

function clearLOLOCoBPresentAdd() {
    try {
        document.loanModForm.coBPresentAddress.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.coBPresentCity.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.coBPresentState.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.coBPresentZip.value = "";
    } catch (e) {
    }
}

function showFormerAddrDiv(val, opt) {
    if (val == 'No') {
        $(".showOn" + opt + "FormerDiv").hide();
    } else {
        $(".showOn" + opt + "FormerDiv").show();
    }
}

function showCoBorrPrevAddr(val) {
    if (val == 'No') {
        $(".CBPA").css("display", "none");                  /* if coborrower has not resided at the present address for less than two years hide the coborr prev addr section */
    } else {
        $(".CBPA").css("display", "flex");
    }
}

function showFundingSubDiv(val, opt) {
    if (val == 'Yes') {
        $(".showOn" + opt + "FUDiv").show();
    } else {
        $(".showOn" + opt + "FUDiv").hide();
    }
}

function showFundingNotesDiv(fldName, opt) {
    var obj = [];
    obj = $("#" + fldName).val();
    $(".showOn" + opt + "FUDiv").hide();

    for (var i = 0; i < obj.length; i++) {

        if (obj[i] == 'Other') {
            $(".showOn" + opt + "FUDiv").show();
        }
    }
}

function showDivIfTaxReturns(divId, noOfDiv) {
    var opt1 = 0;
    try {
        opt1 = document.loanModForm.isTaxReturn.value;
    } catch (e) {
    }

    if (noOfDiv > 0) {
        for (var i = 1; i <= noOfDiv; i++) {
            try {
                if (opt1 == '1') {
                    eval("document.getElementById('" + divId + i + "').style.display = 'block'");
                } else {
                    eval("document.getElementById('" + divId + i + "').style.display = 'none'");
                }
            } catch (e) {
            }
        }
    } else {
        try {
            if (opt1 == '1') {
                document.getElementById(divId).style.display = 'block';
            } else {
                document.getElementById(divId).style.display = 'none';
            }
        } catch (e) {
        }
    }
}

/**

 ** Description    : Validate the Collateral Name
 ** Date            : Nov 28, 2016

 **/

function validateCollateralInfo(formName) {
    if (chkIsBlank(formName, 'collateralName', 'Please enter Collateral Name')
    ) {
        saveCollateralPropertyInfo();
    } else {
        return false;
    }
}

function deleteCollateralPropertyInfo(LMRId, CID) {
    var cfmMsg = "Are you sure to delete?";
    if (confirm(cfmMsg)) {
        var delCnt = 0, url = "", qstr = "";
        url = "../backoffice/deleteCollateralPropertyInfo.php";
        qstr = "CID=" + CID;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
        } catch (e) {
        }
        if (delCnt > 0) {
            showCollateralPropertyInfo(LMRId);
        }
    }
}

function saveCollateralPropertyInfo() {

    var collateralName = "", collateralAddress = "", collateralCity = 0, collateralState = '',
        collateralZip = '', LMRId = 0;
    CID = 0, collateralOccupied1 = '';
    var OPStatus = "", collateralPropertyType = "", collateralUnits = 0, collateralOccupied = "",
        collateralLendableEquity = "", collateralLien1 = "", collateralLienPosition = "";

    LMRId = $('#LMRId').val();
    CID = $('#CID').val();
    encryptedLMRId = document.loanModForm.encryptedLId.value;
    collateralName = $('#collateralName').val();
    collateralAddress = $('#collateralAddress').val();
    collateralCity = $('#collateralCity').val();
    collateralState = $('#collateralState').val();
    collateralZip = $('#collateralZip').val();
    collateralPropertyType = $('#collateralPropertyType').val();
    collateralUnits = $('#collateralUnits').val();
    collateralOccupied = document.collateralPropertyInfoForm.collateralOccupied.value;
    collateralLendableEquity = $('#collateralLendableEquity').val();
    collateralLien1 = $('#collateralLien1').val();
    collateralLienPosition = $('#collateralLienPosition').val();


    url = "../pops/collateralPropertyInfoSave.php";
    qstr = "LMRId=" + LMRId + "&CID=" + CID + "&collateralName=" + collateralName + "&collateralAddress=" + collateralAddress + "&collateralCity=" + collateralCity + "&collateralState=" + collateralState + "&collateralZip=" + collateralZip + "&collateralPropertyType=" + collateralPropertyType + "&collateralUnits=" + collateralUnits + "&collateralOccupied=" + collateralOccupied + "&collateralLendableEquity=" + collateralLendableEquity + "&collateralLien1=" + collateralLien1 + "&collateralLienPosition=" + collateralLienPosition;

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        cnt = xmlDoc.getElementsByTagName("updateCnt")[0].firstChild.nodeValue;
    } catch (e) {
    }
    showCollateralPropertyInfo(encryptedLMRId);

}

function showCollateralPropertyInfo(LMRId) {

    var url = "", qstr = "";
    url = "../backoffice/getCollateralPropertyInfo.php";
    qstr = "LMRId=" + LMRId;
    var displayList = "";
    try {
        displayList = getResponse(url, qstr);
    } catch (e) {
    }
    try {
        document.getElementById("showCollateralPropertyHistory").innerHTML = displayList;
    } catch (e) {
    }
    eval("ContactPop.init('" + POPSURL + "addCollateralPropertyInfo.php', 'addCollateralPropertyInfo.php', 'Add Collateral Property Info', '" + POPSURL + "','collateralPropertyInfoSave.php' , 500, 250)");
    try {
        ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
}

/**

 ** Description    : Validate the HMLO Rehab Item section "Contractor Name" and also save functionality
 ** Date            : Jan 18, 2017

 **/

function validateRehabItem(formName) {
    if (chkIsBlank(formName, 'rehabContractorName', 'Please enter Contractor Name')
    ) {
        saveRehabItemInfo();
    } else {
        return false;
    }
}

function deleteRehabItemInfo(LMRId, RID) {
    var cfmMsg = "Are you sure to delete?";
    if (confirm(cfmMsg)) {
        var delCnt = 0, url = "", qstr = "";
        url = "../backoffice/deleteRehabItemInfo.php";
        qstr = "RID=" + RID;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
        } catch (e) {
        }
        if (delCnt > 0) {
            showRehabItemInfo(LMRId);
        }
    }
}

function saveRehabItemInfo() {

    var rehabContractorName = "", rehabCompanyName = "", rehabGCLicense = 0, rehabCost = '',
        rehabRepairDetails = '', LMRId = 0;
    RID = 0, collateralOccupied1 = '';
    var neededToCompleteRehab = "", rehabContractorEmail = '', rehabContractorPh1 = "", rehabContractorPh2 = "",
        rehabContractorPh3 = "", rehabContractorPhExt = "";

    LMRId = $('#LMRId').val();
    RID = $('#RID').val();
    encryptedLMRId = document.loanModForm.encryptedLId.value;
    rehabContractorName = $('#rehabContractorName').val();
    rehabCompanyName = $('#rehabCompanyName').val();
    rehabGCLicense = $('#rehabGCLicense').val();
    rehabCost = $('#rehabCost').val();
    rehabRepairDetails = $('#rehabRepairDetails').val();
    neededToCompleteRehab = $('#neededToCompleteRehab').val();
    rehabContractorEmail = $('#rehabContractorEmail').val();
    rehabContractorPh1 = $('#rehabContractorPh1').val();
    rehabContractorPh2 = $('#rehabContractorPh2').val();
    rehabContractorPh3 = $('#rehabContractorPh3').val();
    rehabContractorPhExt = $('#rehabContractorPhExt').val();


    url = "../pops/HMLORehabItemSave.php";
    qstr = "LMRId=" + LMRId + "&RID=" + RID + "&rehabContractorName=" + rehabContractorName + "&rehabCompanyName=" + rehabCompanyName + "&rehabGCLicense=" + rehabGCLicense + "&rehabCost=" + rehabCost + "&rehabRepairDetails=" + rehabRepairDetails + "&neededToCompleteRehab=" + neededToCompleteRehab + "&rehabContractorEmail=" + rehabContractorEmail + "&rehabContractorPh1=" + rehabContractorPh1 + "&rehabContractorPh2=" + rehabContractorPh2 + "&rehabContractorPh3=" + rehabContractorPh3 + "&rehabContractorPhExt=" + rehabContractorPhExt;

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        cnt = xmlDoc.getElementsByTagName("updateCnt")[0].firstChild.nodeValue;
    } catch (e) {
    }
    showRehabItemInfo(encryptedLMRId);

}

function showRehabItemInfo(LMRId) {

    var url = "", qstr = "";
    url = "../backoffice/getRehabItemInfo.php";
    qstr = "LMRId=" + LMRId;
    var displayList = "";
    try {
        displayList = getResponse(url, qstr);
    } catch (e) {
    }
    try {
        document.getElementById("showRehabItemHistory").innerHTML = displayList;
    } catch (e) {
    }
    eval("ContactPop.init('" + POPSURL + "addHMLORehabItem.php', 'addHMLORehabItem.php', 'Add Rehab Item', '" + POPSURL + "','HMLORehabItemSave.php' , 600, 2500)");
    try {
        ContactPop.hideOverlay();
    } catch (e) {
    }
}

//HMLO Layout Modification

function showAndHideBorRealEstateInvestment(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.borNoOfPropertiesCompleted.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.borListExamplesHere.value = "";
        } catch (e) {
        }

    }
}

function showAndHideBorRehabConstructionExperience(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.borRehabConstructionYearOfExperience.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.borRehabConstructionProCompleted.value = "";
        } catch (e) {
        }

    }
}

function showAndHideBorProjectsCurrentlyProgress(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.borProjectsCurrentlyProgressHowMany.value = "";
        } catch (e) {
        }

    }
}

function showAndHideBorSquareFootage(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.borProjectsCurrentlyProgressHowMany.value = "";
        } catch (e) {
        }

    }
}

/*function showAndHideInterestReserve(fldValue, divId) {alert(divId);
  if (fldValue == 'Yes') {
    document.getElementById(divId).style.display = 'flex';
  } else {
    document.getElementById(divId).style.display = 'none';
  }
}*/
function showAndHideBorOwnInvestmentProperties(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.borOwnInvestmentPropertiesHowMany.value = "";
        } catch (e) {
        }

    }
}

function showAndHideBorMemberOfInvestmentClub(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.borMemberOfInvestmentClubName.value = "";
        } catch (e) {
        }

    }
}

//coBorrower
function showAndHideCoBorRealEstateInvestment(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.coBorNoOfPropertiesCompleted.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.coBorListExamplesHere.value = "";
        } catch (e) {
        }

    }
}

function showAndHideCoBorRehabConstructionExperience(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.coCorRehabConstructionYearOfExperience.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.coBorRehabConstructionProCompleted.value = "";
        } catch (e) {
        }

    }
}

function showAndHideCoBorProjectsCurrentlyProgress(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.coBorProjectsCurrentlyProgressHowMany.value = "";
        } catch (e) {
        }

    }
}

function showAndHideCoBorOwnInvestmentProperties(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.coBorOwnInvestmentPropertiesHowMany.value = "";
        } catch (e) {
        }

    }
}

function showAndHideCoBorMemberOfInvestmentClub(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        $("#coBorProfLicence").val("");
        $("#coBorLicenseNo").val("");

        try {
            document.loanModForm.coBorMemberOfInvestmentClubName.value = "";
        } catch (e) {
        }

    }
}

function calculateHMLOTotalMonthlyPayment(formName, targetFld) {

    amt = getHMLOTotalMonthlyPayment(formName);
    try {
        amt = convertInputToAbsoluteValue(amt.toFixed(2));
    } catch (e) {
    }
    try {
        eval("document." + formName + "." + targetFld + ".value = '" + amt + "'");
    } catch (e) {
    }
}

function getHMLOTotalMonthlyPayment(formName) {
    var approvedLoanAmt = 0, lien1Rate = 0, totalMonthlyPayment = 0, tempTotal = 0;
    var lien1Terms = '', term = 12;

    try {
        eval("lien1Terms = document." + formName + ".lien1Terms.value");
    } catch (e) {
    }

    try {
        eval("approvedLoanAmt = document." + formName + ".approvedLoanAmt.value");
    } catch (e) {
    }

    try {
        eval("lien1Rate = document." + formName + ".lien1Rate.value");
    } catch (e) {
    }

    approvedLoanAmt = replaceCommaValues(approvedLoanAmt);
    lien1Rate = replaceCommaValues(lien1Rate);

    if (approvedLoanAmt == "") {
        approvedLoanAmt = 0;
    }
    if (lien1Rate == "") {
        lien1Rate = 0;
    }


    if (lien1Terms == 'Interest Only') {


        tempTotal = eval(parseFloat(approvedLoanAmt) * parseFloat(lien1Rate));
        amt = tempTotal / 1200;

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

            if ((approvedLoanAmt > 0) && (lien1Rate > 0)) {
                var amt = calculateAmoritizationValue(approvedLoanAmt, lien1Rate, term);
            } else {
                amt = "";
            }
        } else {
            amt = "";
        }
    }
    return amt;
}

function calculateTotalLoanToValue(formName, targetFld) {
    var approvedLoanAmt = 0, assessedValue = 0, totalLoanToValue = 0, tempTotal = 0;
    try {
        eval("approvedLoanAmt = document." + formName + ".approvedLoanAmt.value");
    } catch (e) {
    }
    try {
        eval("assessedValue = document." + formName + ".assessed1Value.value");
    } catch (e) {
    }
    approvedLoanAmt = replaceCommaValues(approvedLoanAmt);
    assessedValue = replaceCommaValues(assessedValue);

    if (approvedLoanAmt == "") {
        approvedLoanAmt = 0;
    }
    if (assessedValue == "") {
        assessedValue = 0;
    }

    if (assessedValue > 0) {
        tempTotal = eval(parseFloat(approvedLoanAmt) / parseFloat(assessedValue));
        totalLoanToValue = tempTotal * 100;
    }
    try {
        eval("document.getElementById('" + targetFld + "').innerHTML = convertInputToAbsoluteValueWithPercent(totalLoanToValue)");
    } catch (e) {
    }
}

/*
 * Calculate Total List Of Repairs.
 */
function calculateTotalListOfRepairs(currentvalue) {

    var architectFees = "", permitsFees = "", demolitionTrashDumpsters = "", HVACFinish = "";
    var exteriorRepairs = "", termiteInspectionTreatment = "", foundationStructuralReport = "", roofing = "",
        interiorRepairsCarpentry = '';
    var windows = "", doors = "", siding = "", carpentry = "";
    var deckPorch = "", drivewayWalkwayPatio = "";

    var landscaping = "", exteriorRepairsOther = "", HVACRough = "", plumbingFixtures = "";
    var plumbingRough = "", plumbingFinish = "", electricalRough = "", electricalFixtures = "";
    var electricalFinish = "", sheetRock = "", interiorRepairsDoors = "", interiorRepairsOther1 = "";
    var interiorRepairsOther2 = "", interiorRepairsOther3 = "";

    var kitchenCabinets = "", kitchenCountertops = "", kitchenAppliances = "", bath1 = "";
    var bath2 = "", bath3 = "", interiorPainting = "", exteriorPainting = "";
    var flooringCarpetVinyl = "", flooringTile = "", flooringHardwood = "";
    var finalCleanupOther1 = "", finalCleanupOther2 = "", finalCleanupOther3 = "";
    var totalListOfRepairs = "", finalCleanupOther4 = "";

    alertToEnterInput(currentvalue);

    try {
        architectFees = document.loanModForm.architectFees.value;
    } catch (e) {
    }
    try {
        permitsFees = document.loanModForm.permitsFees.value;
    } catch (e) {
    }
    try {
        demolitionTrashDumpsters = document.loanModForm.demolitionTrashDumpsters.value;
    } catch (e) {
    }
    try {
        exteriorRepairs = document.loanModForm.exteriorRepairs.value;
    } catch (e) {
    }
    try {
        termiteInspectionTreatment = document.loanModForm.termiteInspectionTreatment.value;
    } catch (e) {
    }
    try {
        foundationStructuralReport = document.loanModForm.foundationStructuralReport.value;
    } catch (e) {
    }
    try {
        roofing = document.loanModForm.roofing.value;
    } catch (e) {
    }
    try {
        windows = document.loanModForm.windows.value;
    } catch (e) {
    }
    try {
        doors = document.loanModForm.doors.value;
    } catch (e) {
    }
    try {
        siding = document.loanModForm.siding.value;
    } catch (e) {
    }
    try {
        carpentry = document.loanModForm.carpentry.value;
    } catch (e) {
    }
    try {
        deckPorch = document.loanModForm.deckPorch.value;
    } catch (e) {
    }
    try {
        drivewayWalkwayPatio = document.loanModForm.drivewayWalkwayPatio.value;
    } catch (e) {
    }
    try {
        landscaping = document.loanModForm.landscaping.value;
    } catch (e) {
    }
    try {
        exteriorRepairsOther = document.loanModForm.exteriorRepairsOther.value;
    } catch (e) {
    }
    try {
        HVACRough = document.loanModForm.HVACRough.value;
    } catch (e) {
    }
    try {
        HVACFinish = document.loanModForm.HVACFinish.value;
    } catch (e) {
    }
    try {
        plumbingRough = document.loanModForm.plumbingRough.value;
    } catch (e) {
    }
    try {
        plumbingFixtures = document.loanModForm.plumbingFixtures.value;
    } catch (e) {
    }
    try {
        plumbingFinish = document.loanModForm.plumbingFinish.value;
    } catch (e) {
    }
    try {
        electricalRough = document.loanModForm.electricalRough.value;
    } catch (e) {
    }
    try {
        electricalFixtures = document.loanModForm.electricalFixtures.value;
    } catch (e) {
    }
    try {
        electricalFinish = document.loanModForm.electricalFinish.value;
    } catch (e) {
    }
    try {
        sheetRock = document.loanModForm.sheetRock.value;
    } catch (e) {
    }
    try {
        interiorRepairsDoors = document.loanModForm.interiorRepairsDoors.value;
    } catch (e) {
    }
    try {
        interiorRepairsCarpentry = document.loanModForm.interiorRepairsCarpentry.value;
    } catch (e) {
    }
    try {
        interiorRepairsOther1 = document.loanModForm.interiorRepairsOther1.value;
    } catch (e) {
    }
    try {
        interiorRepairsOther2 = document.loanModForm.interiorRepairsOther2.value;
    } catch (e) {
    }
    try {
        interiorRepairsOther3 = document.loanModForm.interiorRepairsOther3.value;
    } catch (e) {
    }
    try {
        kitchenCabinets = document.loanModForm.kitchenCabinets.value;
    } catch (e) {
    }
    try {
        kitchenCountertops = document.loanModForm.kitchenCountertops.value;
    } catch (e) {
    }
    try {
        kitchenAppliances = document.loanModForm.kitchenAppliances.value;
    } catch (e) {
    }
    try {
        bath1 = document.loanModForm.bath1.value;
    } catch (e) {
    }
    try {
        bath2 = document.loanModForm.bath2.value;
    } catch (e) {
    }
    try {
        bath3 = document.loanModForm.bath3.value;
    } catch (e) {
    }
    try {
        interiorPainting = document.loanModForm.interiorPainting.value;
    } catch (e) {
    }

    try {
        exteriorPainting = document.loanModForm.exteriorPainting.value;
    } catch (e) {
    }
    try {
        flooringCarpetVinyl = document.loanModForm.flooringCarpetVinyl.value;
    } catch (e) {
    }

    try {
        flooringTile = document.loanModForm.flooringTile.value;
    } catch (e) {
    }
    try {
        flooringHardwood = document.loanModForm.flooringHardwood.value;
    } catch (e) {
    }

    try {
        finalCleanupOther1 = document.loanModForm.finalCleanupOther1.value;
    } catch (e) {
    }
    try {
        finalCleanupOther2 = document.loanModForm.finalCleanupOther2.value;
    } catch (e) {
    }

    try {
        finalCleanupOther3 = document.loanModForm.finalCleanupOther3.value;
    } catch (e) {
    }
    try {
        finalCleanupOther4 = document.loanModForm.finalCleanupOther4.value;
    } catch (e) {
    }

    architectFees = replaceCommaValues(architectFees);
    permitsFees = replaceCommaValues(permitsFees);
    demolitionTrashDumpsters = replaceCommaValues(demolitionTrashDumpsters);
    exteriorRepairs = replaceCommaValues(exteriorRepairs);
    termiteInspectionTreatment = replaceCommaValues(termiteInspectionTreatment);
    foundationStructuralReport = replaceCommaValues(foundationStructuralReport);
    roofing = replaceCommaValues(roofing);
    windows = replaceCommaValues(windows);
    doors = replaceCommaValues(doors);
    siding = replaceCommaValues(siding);
    carpentry = replaceCommaValues(carpentry);
    deckPorch = replaceCommaValues(deckPorch);
    drivewayWalkwayPatio = replaceCommaValues(drivewayWalkwayPatio);
    landscaping = replaceCommaValues(landscaping);
    exteriorRepairsOther = replaceCommaValues(exteriorRepairsOther);
    HVACRough = replaceCommaValues(HVACRough);
    HVACFinish = replaceCommaValues(HVACFinish);
    plumbingRough = replaceCommaValues(plumbingRough);
    plumbingFixtures = replaceCommaValues(plumbingFixtures);
    plumbingFinish = replaceCommaValues(plumbingFinish);
    electricalRough = replaceCommaValues(electricalRough);
    electricalFixtures = replaceCommaValues(electricalFixtures);
    electricalFinish = replaceCommaValues(electricalFinish);
    sheetRock = replaceCommaValues(sheetRock);
    interiorRepairsDoors = replaceCommaValues(interiorRepairsDoors);
    interiorRepairsCarpentry = replaceCommaValues(interiorRepairsCarpentry);
    interiorRepairsOther1 = replaceCommaValues(interiorRepairsOther1);
    interiorRepairsOther2 = replaceCommaValues(interiorRepairsOther2);
    interiorRepairsOther3 = replaceCommaValues(interiorRepairsOther3);
    kitchenCabinets = replaceCommaValues(kitchenCabinets);
    kitchenCountertops = replaceCommaValues(kitchenCountertops);
    kitchenAppliances = replaceCommaValues(kitchenAppliances);
    bath1 = replaceCommaValues(bath1);
    bath2 = replaceCommaValues(bath2);
    bath3 = replaceCommaValues(bath3);
    interiorPainting = replaceCommaValues(interiorPainting);
    exteriorPainting = replaceCommaValues(exteriorPainting);
    flooringCarpetVinyl = replaceCommaValues(flooringCarpetVinyl);
    flooringTile = replaceCommaValues(flooringTile);
    flooringHardwood = replaceCommaValues(flooringHardwood);
    finalCleanupOther1 = replaceCommaValues(finalCleanupOther1);
    finalCleanupOther2 = replaceCommaValues(finalCleanupOther2);
    finalCleanupOther3 = replaceCommaValues(finalCleanupOther3);
    finalCleanupOther4 = replaceCommaValues(finalCleanupOther4);

    if (architectFees == "") architectFees = 0;
    if (permitsFees == "") permitsFees = 0;
    if (demolitionTrashDumpsters == "") demolitionTrashDumpsters = 0;
    if (exteriorRepairs == "") exteriorRepairs = 0;
    if (termiteInspectionTreatment == "") termiteInspectionTreatment = 0;
    if (foundationStructuralReport == "") foundationStructuralReport = 0;
    if (roofing == "") roofing = 0;
    if (windows == "") windows = 0;
    if (doors == "") doors = 0;
    if (siding == "") siding = 0;
    if (carpentry == "") carpentry = 0;
    if (deckPorch == "") deckPorch = 0;
    if (drivewayWalkwayPatio == "") drivewayWalkwayPatio = 0;
    if (landscaping == "") landscaping = 0;
    if (exteriorRepairsOther == "") exteriorRepairsOther = 0;
    if (HVACRough == "") HVACRough = 0;
    if (HVACFinish == "") HVACFinish = 0;
    if (plumbingRough == "") plumbingRough = 0;
    if (plumbingFixtures == "") plumbingFixtures = 0;
    if (plumbingFinish == "") plumbingFinish = 0;
    if (electricalRough == "") electricalRough = 0;
    if (electricalFixtures == "") electricalFixtures = 0;
    if (electricalFinish == "") electricalFinish = 0;
    if (sheetRock == "") sheetRock = 0;
    if (interiorRepairsDoors == "") interiorRepairsDoors = 0;
    if (interiorRepairsCarpentry == "") interiorRepairsCarpentry = 0;
    if (interiorRepairsOther1 == "") interiorRepairsOther1 = 0;
    if (interiorRepairsOther2 == "") interiorRepairsOther2 = 0;
    if (interiorRepairsOther3 == "") interiorRepairsOther3 = 0;
    if (kitchenCabinets == "") kitchenCabinets = 0;
    if (kitchenCountertops == "") kitchenCountertops = 0;
    if (kitchenAppliances == "") kitchenAppliances = 0;
    if (bath1 == "") bath1 = 0;
    if (bath2 == "") bath2 = 0;
    if (bath3 == "") bath3 = 0;
    if (interiorPainting == "") interiorPainting = 0;
    if (exteriorPainting == "") exteriorPainting = 0;
    if (flooringCarpetVinyl == "") flooringCarpetVinyl = 0;
    if (flooringTile == "") flooringTile = 0;
    if (flooringHardwood == "") flooringHardwood = 0;
    if (finalCleanupOther1 == "") finalCleanupOther1 = 0;
    if (finalCleanupOther2 == "") finalCleanupOther2 = 0;
    if (finalCleanupOther3 == "") finalCleanupOther3 = 0;
    if (finalCleanupOther4 == "") finalCleanupOther4 = 0;

    totalListOfRepairs = parseFloat(architectFees) + parseFloat(permitsFees);
    totalListOfRepairs += parseFloat(demolitionTrashDumpsters) + parseFloat(exteriorRepairs);
    totalListOfRepairs += parseFloat(termiteInspectionTreatment) + parseFloat(foundationStructuralReport);
    totalListOfRepairs += parseFloat(roofing) + parseFloat(windows);
    totalListOfRepairs += parseFloat(doors) + parseFloat(siding);
    totalListOfRepairs += parseFloat(carpentry) + parseFloat(deckPorch);

    totalListOfRepairs += parseFloat(drivewayWalkwayPatio) + parseFloat(landscaping);
    totalListOfRepairs += parseFloat(exteriorRepairsOther) + parseFloat(HVACRough);
    totalListOfRepairs += parseFloat(HVACFinish) + parseFloat(plumbingRough);
    totalListOfRepairs += parseFloat(plumbingFixtures) + parseFloat(plumbingFinish);
    totalListOfRepairs += parseFloat(electricalRough) + parseFloat(electricalFixtures);

    totalListOfRepairs += parseFloat(electricalFinish) + parseFloat(sheetRock);
    totalListOfRepairs += parseFloat(interiorRepairsDoors) + parseFloat(interiorRepairsOther1);
    totalListOfRepairs += parseFloat(interiorRepairsOther2) + parseFloat(interiorRepairsOther3);
    totalListOfRepairs += parseFloat(kitchenCabinets) + parseFloat(kitchenCountertops);
    totalListOfRepairs += parseFloat(kitchenAppliances) + parseFloat(bath1);

    totalListOfRepairs += parseFloat(bath2) + parseFloat(bath3);
    totalListOfRepairs += parseFloat(interiorPainting) + parseFloat(exteriorPainting);
    totalListOfRepairs += parseFloat(flooringCarpetVinyl) + parseFloat(flooringTile);
    totalListOfRepairs += parseFloat(flooringHardwood) + parseFloat(finalCleanupOther1);
    totalListOfRepairs += parseFloat(finalCleanupOther2) + parseFloat(finalCleanupOther3);
    totalListOfRepairs += parseFloat(finalCleanupOther4) + parseFloat(interiorRepairsCarpentry);

    totalListOfRepairs = parseFloat(totalListOfRepairs);
    totalListOfRepairs = totalListOfRepairs.toFixed(2);

    try {
        eval("document.getElementById('totalListOfRepairs').innerHTML = convertInputToAbsoluteValueWithDollar(totalListOfRepairs)");
    } catch (e) {
    }
}

//HMLO Layout Modification

function showAndHideBorBackgroundDiv(fldValue, divId) {
    if (fldValue == 'Yes') {
        $("." + divId + "TR").show();
    } else {
        $("." + divId + "TR").hide();
        try {
            eval("document.loanModForm." + divId + "Expln.value = ''");
        } catch (e) {
        }
    }
}

/**

 ** Description    : Validate the Merchant Funding Loan Terms Tab and also save functionality
 ** Developer    : Viji & Venkatesh
 ** Date            : May 26, 2017

 **/

function validateMFLoanTerms(formName) {
    if (chkIsBlank(formName, 'lenderName', 'Please enter Creditor')
    ) {
        saveMFLoanTermsInfo();
        $('#exampleModal1').modal('toggle');
    } else {
        return false;
    }
}

function saveMFLoanTermsInfo() {

    var lenderName = '', applnSubDate = '', loanType = '', approvedLoanAmt = '', loanTerms = '', applnStatus = '',
        interestRate = '', PRPurchase = '', PRPurchaseMonths, prePaymentPenalty = '', PRBalance = '',
        PRBalanceMonths = '', monthlyPayment = '', originationFee, LTNotes = '', LTID = 0, creditLineType = '',
        PCID = 0;

    LMRId = $('#LMRId').val();
    encryptedLMRId = document.loanModForm.encryptedLId.value;
    lenderName = $('#lenderName').val();
    applnSubDate = $('#applnSubDate').val();

    loanType = $('#loanType').val();
    approvedLoanAmt = $('#approvedLoanAmt').val();
    loanTerms = $('#loanTerms').val();
    applnStatus = $('#applnStatus').val();
    interestRate = $('#interestRate').val();
    PRPurchase = $('#PRPurchase').val();
    PRPurchaseMonths = $('#PRPurchaseMonths').val();

    prePaymentPenalty = $('#prePaymentPenalty').val();
    PRBalance = $('#PRBalance').val();
    PRBalanceMonths = $('#PRBalanceMonths').val();
    monthlyPayment = $('#monthlyPayment').val();
    originationFee = $('#originationFee').val();
    LTNotes = $('#LTNotes').val();
    creditLineType = $('#creditLineType').val();
    LTID = document.MFLoanTermsForm.LTID.value;
    PCID = document.MFLoanTermsForm.PCID.value;

    url = "../pops/addMFLoanTermsSave.php";
    qstr = "LMRId=" + LMRId + "&lenderName=" + lenderName + "&applnSubDate=" + applnSubDate + "&loanType=" + loanType + "&approvedLoanAmt=" + approvedLoanAmt + "&loanTerms=" + loanTerms + "&applnStatus=" + applnStatus + "&interestRate=" + interestRate + "&PRPurchase=" + PRPurchase + "&PRPurchaseMonths=" + PRPurchaseMonths + "&prePaymentPenalty=" + prePaymentPenalty + "&PRBalance=" + PRBalance + "&PRBalanceMonths=" + PRBalanceMonths + "&monthlyPayment=" + monthlyPayment + "&originationFee=" + originationFee + "&LTNotes=" + LTNotes + "&LTID=" + LTID + "&creditLineType=" + creditLineType + "&PCID=" + PCID;

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        cnt = xmlDoc.getElementsByTagName("updateCnt")[0].firstChild.nodeValue;
    } catch (e) {
    }
    showMFLoanTermsInfo(encryptedLMRId);

}

function showMFLoanTermsInfo(LMRId) {
    var url = "", qstr = "", PCID = '';
    try {
        PCID = document.MFLoanTermsForm.PCID.value;
    } catch (e) {
    }

    url = "../backoffice/getMFLoanTerms.php";
    qstr = "LMRId=" + LMRId + "&PCID=" + PCID;
    var displayList = "";
    try {
        displayList = getResponse(url, qstr);
    } catch (e) {
    }
    try {
        document.getElementById("showMFLoanTermsInfo").innerHTML = displayList;
    } catch (e) {
    }
    //eval("ContactPop.init('" + POPSURL + "addMFLoanTerms.php', 'addMFLoanTerms.php', 'Add Loan Terms', '" + POPSURL + "','addMFLoanTermsSave.php' , 750, 300)");
    try {
        //ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
}

function deleteMFLoanTerms(LMRId, LTID) {
    var cfmMsg = "Are you sure to delete?";
    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: cfmMsg,
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            Yes: {
                action: function () {
                    var delCnt = 0, url = "", qstr = "";
                    url = "../backoffice/deleteMFLoanTerms.php";
                    qstr = "LTID=" + LTID;
                    try {
                        xmlDoc = getXMLDoc(url, qstr);
                    } catch (e) {
                    }
                    try {
                        delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
                    } catch (e) {
                    }
                    if (delCnt > 0) {
                        showMFLoanTermsInfo(LMRId);
                    }
                }
            },
            cancel: {
                text: 'Close',
                action: function () {
                    //  location.reload();
                }
            }
        },
        onClose: function () {
        },
    });
}

function validateHMLOLoanInfo() {
    if (true//validateRehabCostFinanced()

        //validateClosingCostFinanced('loanModForm', 'closingCostFinanced', 'totalFeesAndCost', 1)
        //chkIsBlank('loanModForm', 'typeOfHMLOLoanRequesting', 'Please select Transactional Type') &&
        //chkIsBlank('loanModForm', 'loanTerm', 'Please select Loan Term') &&
        //chkIsBlank('loanModForm', 'extensionOption', 'Please select Extension Option')
    ) {

        if (typeof document.loanModForm.LMRClientType != "undefined" && document.loanModForm.LMRClientType.value == "") {
            return chkIsBlank('loanModForm', 'LMRClientType', 'Please Select Loan Program')
        } else {
            allowFormSubmit = 0;
            var allowFormSubmit = $("#allowFormSubmit").val();

            if (allowFormSubmit == 0) {
                return validateMinMaxLoanGuidelines();
            } else {
                return true;
            }
        }
    } else {
        return false;
    }
}

/*
function showAndHideborrowerUnderEntity(fldValue, clsName) {
    if (fldValue == 'Yes') {
        $('.' + clsName).css("display", "table-row");
        $('.entityBillAddress').show();
        $("#entityName").click();                            /* it should populate all the business entites on clicking yes radio button : card309 /
    } else {
        $('.' + clsName).css("display", "none");
        $('.entityBillAddress').hide();
        $('.autocomplete').hide();                        /* Hiding the auto populate div on clicking no radio button /
        clear_form_elements(clsName);
        clear_form_elements('preVal');
        $('#CBEID').val('0');   // Entity id should be 0 /
    }
}*/

function showAndHideborrowerUnderExperience(fldValue, clsName) {
    if (fldValue == 'Yes') {
        $('.' + clsName).show();
        $('.SORESection').show();
        checkdisable_form_elements(clsName, 1);
    } else {
        $('.' + clsName).hide();
        $('.SORESection').hide();
        clear_form_elements('SORESection');
        checkdisable_form_elements(clsName, 0);
    }
}

function showAndHideBuilderDeveloper(fldValue, clsName) {
    if (fldValue == 'Yes') {
        $('.' + clsName).hide();
    } else {
        $('.' + clsName).show();
    }

}

function validateHMLOBasicLoanTerm() {
    var isHMLO = 0;
    var isHMLO = document.loanModForm.isHMLOOpt.value;
    if (isHMLO == 1) {
        if (chkIsBlank('loanModForm', 'isHouseProperty', 'Please select Present Occupancy') &&
            chkIsBlank('loanModForm', 'propertyState', 'Please select Property State') &&
            chkIsBlank('loanModForm', 'propertyType', 'Please select Property Type')
        ) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}

function customEmailSendForClient(LMRId, PCID) {
    document.getElementById('customLoaderDiv').style.display = "flex";
    setTimeout("customEmailPCSendForClient('" + LMRId + "', '" + PCID + "')", 200);
}

function customEmailPCSendForClient(LMRId, PCID) {
    url = "../backoffice/customizationPCEmailSendForClient.php";
    qstr = "LMRId=" + LMRId + "&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    document.getElementById('customLoaderDiv').style.display = "none";
}

function requestToAllowEditFileMsg() {
    $('#loaderDiv').show();
    setTimeout(function () {
        $('#requestToEditForm').submit();
    }, 100);
}

function validateSummaryInfo() {
    var allowFormSubmit = 0, createdUserType = '';
    var allowFormSubmit = $("#allowFormSubmit").val();

    try {
        createdUserType = document.loanModForm.createdUserType.value;
    } catch (e) {
    }
    if (createdUserType == 'Client') {
        validateClForm = validateBorrowerFormClientPortal();
    } else {
        validateClForm = validateClientInfoForm();
    }
    if (validateClForm) {
        if (allowFormSubmit == 0) {
            return validateMinMaxLoanGuidelines();
        } else {
            return true;
        }
    }
    return false;
}

function showHideFileTypeDiv(LMRId, PCID, fileType, tabOpt) {
    $.ajax({
        url: "../JQFiles/getAppFormFields.php",
        method: "POST",
        data: jQuery.param({'LMRId': LMRId, 'PCID': PCID, 'fileType': fileType, 'tabOpt': tabOpt}),
        success: function (data) {
            var parsed_result = $.parseJSON(data);
        }
    });
}

function showAndHideBorBackgroundUSCitizen(fldValue, divId) {
    if (fldValue == 'No') {
        $("." + divId + "TR").css('display', 'table-row');
    } else {
        $("." + divId + "TR").css('display', 'none');
        try {
            eval("document.loanModForm." + divId + "Expln.value = ''");
        } catch (e) {
        }
    }
}

function validateLiabilitiesForm() {
    if (chkIsBlank('liabilitiesForm', 'nameAddrOfCompany', 'Please enter Name & Address of Company') &&
        chkIsBlank('liabilitiesForm', 'monthlyPayment', 'Please enter Monthly Payment') &&
        chkIsBlank('liabilitiesForm', 'monthsLeftToPay', 'Please enter Months Left to Pay') &&
        chkIsBlank('liabilitiesForm', 'unpaidBalance', 'Please enter Unpaid Balance') &&
        chkIsBlank('liabilitiesForm', 'accountNo', 'Please enter account No')) {
        return true;
    }
    return false;
}

function saveLOLiabilitiesInfo() {
    if (validateLiabilitiesForm()) {
        $('#liabilitiesForm').ajaxSubmit({
            type: "POST",
            url: POPSURL + "LOLiabilitiesInfoSave.php",
            success: function (response) {
                var obj = $.parseJSON(response);
                $('#LOLiabilitiesInfoForm').modal('hide');

                var displayList = '';
                var liabilitiesData = [];

                if (obj.rsResp == 1) {
                    toastrNotification('Saved successfully', 'success');
                } else if (obj.rsResp == 2) {
                    toastrNotification('Updated successfully', 'success');
                }
                displayList += "<table class='table table-hover  table-bordered table-condensed table-sm table-vertical-center' width='100%'><thead class=\"thead-light\"><tr><th>#</th><th>&nbsp;</th><th style=\"border-right:1px solid #ffffff;\">&nbsp;Name & Address of Company</th><th style=\"border-right:1px solid #ffffff;\">Monthly Payment</th><th style=\"border-right:1px solid #ffffff;\">Months Left to Pay</th><th style=\"border-right:1px solid #ffffff;\">Unpaid Balance</th><th>&nbsp;</th></tr></thead><tbody>";

                liabilitiesData = obj["liabilitiesData"];
                for (var k = 0; k < liabilitiesData.length; k++) {
                    var LMRID = liabilitiesData[k]['fileID'];
                    var LOLID = liabilitiesData[k]['LOLID'];
                    var nameAddrOfCompany = liabilitiesData[k]['nameAddrOfCompany'];
                    var monthlyPayment = autoNumericConverter(liabilitiesData[k]['monthlyPayment']);
                    var monthsLeftToPay = autoNumericConverter(liabilitiesData[k]['monthsLeftToPay']);
                    var unpaidBalance = autoNumericConverter(liabilitiesData[k]['unpaidBalance']);
                    var accountNo = liabilitiesData[k]['accountNo'];
                    var liabilityAccType = liabilitiesData[k]['liabilityAccType'];
                    slno = k + 1;
                    var tmpCls = "";
                    if ((slno % 2) == 0) {
                        tmpCls = "even";
                    }
                    displayList += "<tr class='text-center'><td>" + (k + 1) + "</td><td><div id=\"buttonDisp\"><a class=\"btn btn-sm btn-light btn-text-primary btn-hover-primary btn-icon m-1 tooltipClass\"" +
                        " title=\"Click to edit\" href=\"javascript: editLOLiabilitiesInfo('" + LMRID + "','" + LOLID + "');\"><i\n" +
                        "                            class=\"fa fa-edit\"></i> </a></div></td><td>" + nameAddrOfCompany + "</td><td>" + monthlyPayment + "</td><td>" + monthsLeftToPay + "</td><td>" + unpaidBalance + "</td><td><a class=\"btn btn-xs btn-danger btn-text-primary  btn-icon m-1 tooltipClass\" style=\"text-decoration:none;\" href=\"javascript: deleteLiabilitiesInfo('" + LMRID + "', '" + LOLID + "');\" alt=\"Click to delete\" title=\"Click to delete\"><i class=\"flaticon2-trash\"></i></a></td></tr>";
                }
                displayList += "</tbody></table>";
                $("#LOLiabilitiesInfo").html(displayList);
            }
        });
    }
}

function editLOLiabilitiesInfo(LMRID, LOLID) {
    clear_form_elements('LOLiabilitiesInfoForm');
    $('#LMRID').val(LMRID);
    $('#LOLID').val(LOLID);
    if (LOLID != '') {
        $.ajax({
            type: 'POST',
            url: '../pops/getLiabilitiesInfo.php',
            data: jQuery.param({'LMRID': LMRID, 'LOLID': LOLID}),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (myData) {
                var obj = $.parseJSON(myData);
                assignFieldValue(obj[0].nameAddrOfCompany, 'nameAddrOfCompany');
                assignFieldValue(obj[0].liabilityAccType, 'liabilityAccType');
                assignFieldValue(autoNumericConverter(obj[0].monthlyPayment), 'monthlyPaymentExpenses');
                assignFieldValue(autoNumericConverter(obj[0].monthsLeftToPay), 'monthsLeftToPays');
                assignFieldValue(autoNumericConverter(obj[0].unpaidBalance), 'unpaidBalanceExpenses');
                $('#liabilityAtorBeforeClose').val(obj[0].liabilityAtorBeforeClose);
                if (parseInt(obj[0].liabilityAtorBeforeClose) == 1) {
                    $('#allowLiabilityAtorBeforeClose').prop('checked', true);
                }
                assignFieldValue(obj[0].accountNo, 'accountNo');
            }
        });
    }
    $('#LOLiabilitiesInfoForm').modal('toggle');
}

function addPayDownDtls(mainSec) {
    var tableData = $('.' + mainSec);
    var clone = $(".paydowndiv:first").clone(true);  //alert(clone);console.log(clone);
    var ParentRow = $(".paydowndiv").last();
    console.log(ParentRow);
    var rowcount = $(".paydowndiv").length;
    var tabIndex = $(".paydowndiv").last().find('.payDownClsNote').attr('tabindex');
    cnt = $(".paydowndiv").length + 1;
    if ($('#principalPayDownAmt_' + rowcount).val() == '') {
        alert('Please Enter Principal Pay Down Amount');
        return false;
    } else if ($('#principalPayDownDate_' + rowcount).val() == '') {
        alert('Please Enter Principal Pay Down Date');
        return false;
    }

    jQuery(clone).find(':input, i').each(function (i) {
        var idArr = [];
        var elmId = this.id;
        idArr = elmId.split('_');
        $(this).attr('id', idArr[0] + "_" + cnt);
        $(this).attr('tabindex', tabIndex);// | Id Change
        jQuery(this).val('');
        jQuery(this).removeClass('hasDatepicker');
    });

    $(clone).attr('id', "paydowndiv_" + cnt);         // | Id Change
    //$(clone).attr('id', "payDownremove_" + cnt);
    clone.clone(true).insertAfter(ParentRow);
    $('.hasDatepickerPPDI').datepicker({changeMonth: true, changeYear: true, dateFormat: 'mm/dd/yy'});

}

function removePayDownDtls(id) {
    var idArr = [];
    idArr = id.split('_');
    if ($(".paydowndiv").length == 1) {
        alert("You Cant Delete This Row");
        return false;
    }
    var currentLoanBal = $('#finalCurrentLoanBal').val();
    currentLoanBal = currentLoanBal.replace(",", "");
    var paydownval = $('#principalPayDownAmt_' + idArr[1]).val();
    if (paydownval == '') {
        paydownval = 0;
    } else {
        paydownval = paydownval.replace(",", "");
    }

    var finalcurrentLoanBal = parseFloat(currentLoanBal) + parseFloat(paydownval);
    document.getElementById("currentLoanBalance").innerHTML = '$ ' + convertInputToAbsoluteValue(finalcurrentLoanBal);
    $('#finalCurrentLoanBal').val(finalcurrentLoanBal);
    $('#paydowndiv_' + idArr[1]).remove();
    enableSaveButton();
}

function calculateCurrentLoanAmt() {
    var initialLoanAmount = $("#initialLoanAmount").text();
    initialLoanAmount = (initialLoanAmount.replace(/[$,]/g, '')).trim(); //alert(str.trim()) ; return false;

    var serprepaidReserve = $("#serprepaidReserve").val();
    serprepaidReserve = (serprepaidReserve.replace(/[$,]/g, '')).trim();

    var serclosingcostfinanced = $("#serclosingcostfinanced").val();
    serclosingcostfinanced = (serclosingcostfinanced.replace(/[$,]/g, '')).trim();

    var sertotaldrawsfunded = $("#sertotaldrawsfunded").val();
    sertotaldrawsfunded = (sertotaldrawsfunded.replace(/[$,]/g, '')).trim();
    var paydownval = 0;
    for (var i = 1; i <= $(".paydowndiv").length; i++) {
        if ($('#principalPayDownAmt_' + i).val() != '' && $('#principalPayDownAmt_' + i).val() != undefined) {
            paydownval = paydownval + parseFloat($('#principalPayDownAmt_' + i).val());
        }
    }

    var finalcurrentLoanBal = parseFloat(initialLoanAmount) + parseFloat(serprepaidReserve) + parseFloat(serclosingcostfinanced) + parseFloat(sertotaldrawsfunded) - parseFloat(paydownval);
    document.getElementById("currentLoanBalance").innerHTML = '$ ' + convertInputToAbsoluteValue(finalcurrentLoanBal);
    $('#finalCurrentLoanBal').val(finalcurrentLoanBal);
}

function addOrRemoveAdditionalInsDtls(tabIndex, mainSec, innerSec) {
    // $('.with-children-tip > *').hideTip();
    /** In last ins section, check atleast one is selected before clone **/
    cloneId = $('.additionalInsurance:last').attr('id');
    // if (!$('#' + cloneId + ' input:checkbox:checked').length > 0) {
    //     toastrNotification("Please select atleast one Policy Information.", 'error');
    //     return;
    // }
    /** In last ins section, check atleast one is selected before clone End**/
    rowObj = $("#additionalInsurance").clone();
    $("." + mainSec).append(rowObj);

    var idCnt = 0;
    var nCnt = 1;
    jQuery(rowObj).find(':input').each(function (i) {
        switch (this.type) {
            case 'text':
            case 'hidden':
            case 'textarea':
            case 'file':
            case 'select-multiple':
            case 'date':
                jQuery(this).val('');
                break;
            case 'checkbox':
                this.checked = false;
                break;
        }


    });

    var ks = 0;
    jQuery("." + innerSec).each(function (i) {
        if (i != 0) {

            $(this).attr('id', "additionalInsurance_" + i);

            $(this).find('.insactionIcons').html("<a  href=\"javascript:void(0)\"   class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeAdditionalInsDtls('additionalInsurance_" + i + "', '" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        } else {
            $(this).find('.insactionIcons').html("<a href=\"javascript:void(0)\"\n" +
                "                   class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeAdditionalInsDtls('additionalInsurance','" + tabIndex + "')\" title=\"Click to remove this row.\">\t<i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        }
        if (($('.' + innerSec).length - 1) == ks) {
            $(this).find('.insactionIcons').html("<a href=\"javascript:void(0)\"\n" +
                "                   class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"addOrRemoveAdditionalInsDtls('" + tabIndex + "', 'additionalInsuranceSection', 'additionalInsurance')\" title=\"Click to add new row.\"><i class=\" icon-md fas fa-plus \"></i></a>&nbsp;<a href=\"javascript:void(0)\"\n" +
                "                   class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeAdditionalInsDtls('additionalInsurance_" + i + "','" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        }
        ks++;
        if (i % 2 != 1) {
            $(this).addClass('even');
        } else {
            $(this).removeClass('even');
        }
    });
    jQuery(".secCnt").each(function (i) {
        $(this).html((i + 1) + ")");
    });
    /** Change the policy checkbox name for clone section for saving**/
    lastdivId = $('.additionalInsurance:last').attr('id');  /* Get last div Id after clone*/
    lastdivIdNum = lastdivId.split('_')[1];
    $('#' + lastdivId + ' .policyType').each(function (j) {
        var nameArr = [];
        var elmId = this.name;
        nameArr = elmId.split('_');
        if (nameArr[0] == 'policyType') {
            $(this).attr('name', nameArr[0] + "_" + lastdivIdNum + '[]'); // | Name Change

        }
    });
    /** Change the policy checkbox name for saving End**/

    /** Change the ids for each input**/
    jQuery('#' + lastdivId).find(':input').each(function (i) {
        var idArr = [];
        $(this).attr('tabindex', tabIndex);
        var elmId = this.id;
        idArr = elmId.split('_');
        $(this).attr('id', idArr[0] + "_" + lastdivIdNum);
    });
    /** Change the ids for each input End**/

    $('#' + lastdivId + ' .showdoc').empty();
    /** Empty the doc preview for clone section **/

    jQuery('#' + lastdivId).find("input.datepick")
        .removeClass('datepick hasDatepicker')
        .removeData('datepicker')
        .unbind()
        .datepicker({
            autoclose: true,
        });

    $(".mask_date").inputmask("m/d/y", {autoUnmask: !0});
    $(".mask_phone").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
    $(".mask_home_phone").inputmask("mask", {mask: "999 - 999 - 9999"});
    $(".mask_cell").inputmask("mask", {mask: "999 - 999 - 9999"});
    $(".mask_ssn").inputmask("999 - 99 - 9999", {placeholder: "___ - __ - ____", clearMaskOnLostFocus: !0});
    $("#agTCnt").val($('.additionalInsurance').length);
    $('.zipCode').inputmask("99999");
}

function removeAdditionalInsDtls(rSec, tabIndex) {
    // $('.with-children-tip > *').hideTip();
    if (rSec == 'additionalInsurance') {
        jQuery("#" + rSec).find(':input').each(function (i) {
            switch (this.type) {
                case 'text':
                case 'textarea':
                case 'file':
                case 'select-multiple':
                case 'date':
                case 'number':
                    jQuery(this).val('');
                    break;
                case 'checkbox':
                    this.checked = false;
                    break;
            }
        });
        //for first file link
        $('#polCovId').val('');
    } else {
        $('#' + rSec).remove();
        var idCnt = 0;
        var nCnt = 1;
        jQuery('.additionalInsurance').find(':input').each(function (i) {
            if (17 < i) {
                var idArr = [];
                $(this).attr('tabindex', tabIndex);
                var elmId = this.id;
                idArr = elmId.split('_');
                $(this).attr('id', idArr[0] + "_" + idCnt);
            }
            if (nCnt == 18) {
                idCnt++;
                nCnt = 0;
            }
            nCnt++;
        });
    }

    var ks = 0;
    jQuery(".additionalInsurance").each(function (i) {
        if (i != 0) {
            $(this).attr('id', "additionalInsurance_" + i);
            $(this).find('.insactionIcons').html("<a href=\"javascript:void(0)\"\n" +
                "                   class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeAdditionalInsDtls('additionalInsurance_" + i + "', '" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        } else {
            $(this).find('.insactionIcons').html("<a href=\"javascript:void(0)\"\n" +
                "                   class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeAdditionalInsDtls('additionalInsurance','" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        }
        if (($('.additionalInsurance').length - 1) == ks) {
            $(this).find('.insactionIcons').html("<a href=\"javascript:void(0)\"\n" +
                "                   class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"addOrRemoveAdditionalInsDtls('" + tabIndex + "', 'additionalInsuranceSection', 'additionalInsurance')\" title=\"Click to add new row.\"><i class=\" icon-md fas fa-plus \"></i></a><a href=\"javascript:void(0)\"\n" +
                "                   class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeAdditionalInsDtls('additionalInsurance_" + i + "','" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        }
        ks++;
    });

    if ($('.additionalInsurance').length == 1) {
        $('#additionalInsurance').find('.insactionIcons').html("<a  href=\"javascript:void(0)\"\n" +
            "                   class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"addOrRemoveAdditionalInsDtls('" + tabIndex + "', 'additionalInsuranceSection', 'additionalInsurance')\" title=\"Click to add new row.\"><i class=\" icon-md fas fa-plus \"></i></a><a href=\"javascript:void(0)\"\n" +
            "                   class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeAdditionalInsDtls('additionalInsurance','" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
    }
    $("#agTCnt").val($('.additionalInsurance').length);
    $("input[name='btnSave']").attr("disabled", false);

    c = 1;
    $('.mask_date').each(function () {
        $(this).removeClass('datepick hasDatepicker').unbind();
        $(this).attr('id', "dateId" + c);
        $(this).datepicker();
        c++;
    });
}


function calculateTotalPaymentInLien1Mortgage(formName, targetFld, fileTab) {
    var lien1Payment = 0, taxes1 = 0, insurance1 = 0, mortgageInsurance1 = 0, HOAFees1 = 0;
    var totalPayment = 0, floodInsurance1 = 0;

    try {
        lien1Payment = $('.1LMS').find('#lien1Payment').val();
    } catch (e) {
    }
    try {
        if (fileTab == 'QA' || fileTab == 'FA') {
            taxes1 = $('.1LMS').find('#lientaxes1').val();
        } else {
            taxes1 = $('.1LMS').find('#taxes1').val();
        }
    } catch (e) {
    }
    try {
        insurance1 = $('.1LMS').find('#insurance1').val();
    } catch (e) {
    }
    try {
        mortgageInsurance1 = $('.1LMS').find('#mortgageInsurance1').val();
    } catch (e) {
    }
    try {
        if (fileTab == 'QA' || fileTab == 'FA') {
            HOAFees1 = $('.1LMS').find('#lienHOAFees1').val();
        } else {
            HOAFees1 = $('.1LMS').find('#HOAFees1').val();
        }
    } catch (e) {
    }
    try {
        floodInsurance1 = $('.1LMS').find('#floodInsurance1').val();
    } catch (e) {
    }

    lien1Payment = replaceCommaValues(lien1Payment);
    taxes1 = replaceCommaValues(taxes1);
    insurance1 = replaceCommaValues(insurance1);
    mortgageInsurance1 = replaceCommaValues(mortgageInsurance1);
    HOAFees1 = replaceCommaValues(HOAFees1);
    floodInsurance1 = replaceCommaValues(floodInsurance1);

    if (lien1Payment == "") {
        lien1Payment = 0;
    }
    if (taxes1 == "") {
        taxes1 = 0;
    }
    if (insurance1 == "") {
        insurance1 = 0;
    }
    if (mortgageInsurance1 == "") {
        mortgageInsurance1 = 0;
    }
    if (HOAFees1 == "") {
        HOAFees1 = 0;
    }
    if (floodInsurance1 == "") {
        floodInsurance1 = 0;
    }

    totalPayment = parseFloat(lien1Payment) + parseFloat(taxes1) + parseFloat(insurance1);
    totalPayment += parseFloat(mortgageInsurance1) + parseFloat(HOAFees1) + parseFloat(floodInsurance1);

    try {
        eval("document." + formName + "." + targetFld + ".value = totalPayment");
    } catch (e) {
    }

}

function validateAdditionalLienFormNew(formName) {
    if (chkIsBlank(formName, 'addLienServicer', 'Please enter servicer') &&
        chkIsBlank(formName, 'addLienBalance', 'Please enter balance') &&
        chkIsBlank(formName, 'addLienInterestRate', 'Please enter interest rate') &&
        chkIsBlank(formName, 'addLienLoanNumb', 'Please enter loan number') &&
        validateAmountAllowBlank('additionalLiensForm', 'addLienBalance', 'Please Enter Correct Balance Amount.') &&
        validateAmountAllowBlank('additionalLiensForm', 'addLienInterestRate', 'Please Enter Correct Interest Rate.') &&
        checkValidNumber('additionalLiensForm', 'addLienLoanNumb', 'Loan Number') &&
        checkValidNumber('additionalLiensForm', 'addLienPhone', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLienFax', 'Fax #') &&
        checkValidNumber('additionalLiensForm', 'addLien2Phone', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLien2Fax', 'Fax #') &&
        checkValidNumber('additionalLiensForm', 'addLien3Phone', 'Contact #') &&
        checkValidNumber('additionalLiensForm', 'addLien3Fax', 'Fax #')
    ) {
        return true;
    } else {
        return false;
    }
}

function validateListingHistoryForm() {
    if (chkIsBlank('lisitingHistoryForm', 'mlsNo', 'Please enter MLS #') &&
        isDateOKForMMDDYY('lisitingHistoryForm', 'listingDate1', 'Listing Date1.') &&
        validateAmountAllowBlank('lisitingHistoryForm', 'listingPrice', 'Please Enter Correct Listing Price Amount.')) {
        return true;
    } else {
        return false;
    }

}

function cloneFormBorAddEmpInfo(innerSec, icrementSec) {
    publicUser = $('input[name="publicUser"]').val();

    var rowObj = $('.' + innerSec + ':last').clone();
    var divId = rowObj.attr('id');
    //var inputIdCnt = rowObj.attr('data-sN');
    var divIdArray = divId.split('_');
    var inputIdCnt = parseInt(divIdArray[parseInt(divIdArray.length) - 2]);
    newInputId = parseInt(inputIdCnt) + 1;
    mainSecLength = $('.' + innerSec).length;
    if (inputIdCnt == 2) {
        $('#hideAddnlEmpInfo').hide();
        toastrNotification('Maximum Two Additional Employment Information Allowed', 'error');
        return false;
    }

    $('.' + innerSec).last().clone()
        .attr('id', function (idx, attrVal) {
            try {
                innerSecDivArray = attrVal.split('_');
                if (innerSecDivArray.length == 3) {
                    return innerSecDivArray[0] + '_' + (parseInt(innerSecDivArray[1]) + 1) + '_' + (innerSecDivArray[2]);
                }
            } catch (e) {
            }
        })
        .find(":input")
        .attr('id', function (idx, attrVal) {
            try {
                innerSecDivArray = attrVal.split('_');
                if (innerSecDivArray.length == 3) {
                    return innerSecDivArray[0] + '_' + (parseInt(innerSecDivArray[1]) + 1) + '_' + (innerSecDivArray[2]);
                }
            } catch (e) {
            }
        })
        .attr('name', function (idx, attrVal) {
            try {
                return attrVal.replace('[' + inputIdCnt + ']', '[' + newInputId + ']'); // fix is here
            } catch (e) {
            }
        })
        .attr('type', function (idx, attrVal) {
            if (attrVal == 'radio' || attrVal == 'checkbox') {
                $(this).prop("checked", false);
            } else {
                $(this).val('');
            }
        }).removeAttr('checked').prop("checked", false).end()
        .find('.chosen-container').remove().end()
        .find('.chzn-select').show().end()
        .find('.dateClass').datepicker({
        autoclose: true,
        changeMonth: true,
        changeYear: true,
        dateFormat: 'mm/dd/yy'
    }).end()
        .find('label').attr('for', function (idx, attrVal) {
        try {
            innerSecDivArray = attrVal.split('_');
            if (innerSecDivArray.length == 3) {
                return innerSecDivArray[0] + '_' + (parseInt(innerSecDivArray[1]) + 1) + '_' + (innerSecDivArray[2]);
            }
        } catch (e) {
        }
    }).end()
        .find('.deleteEmployementInfoCls').attr('data-lobeid','').end()
        .find('.deleteEmployementInfoCls').attr('data-sectionnum',newInputId).end()
        .find('.' + icrementSec).html(newInputId).end()
        .find('.removeCloneButton').removeClass('d-none').end()
        .insertAfter('.' + innerSec + ':last');

    $('.chzn-select').chosen({allow_single_deselect: true})

    if (publicUser == 0) {
        enableSaveButton();
    }
}


/* eslint-disable no-redeclare */
/* eslint-disable no-global-assign */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */

/* eslint-disable no-undef */
/**

 ** Description  : Added the New Section of the Own the Property Info If only Shown the Hard / Private Money LOS Module is selected
 ** Developer    : Venkatesh
 ** Author       : AwataSoftSys
 ** Date         : Nov 18, 2016

 **/

// eslint-disable-next-line no-unused-vars
function showAndHideHMLOPropertyInfo(fldValue, clsName) {
    if (fldValue == 'Yes') {
        $('.' + clsName + fldValue).css("display", "block");
        $('.' + clsName + 'TD' + fldValue).css("display", "table-cell");
        $('.' + clsName + 'TDNo').css("display", "none");
        $('.' + clsName + 'No').css("display", "none");
    } else {
        $('.' + clsName + fldValue).css("display", "block");
        $('.' + clsName + 'TD' + fldValue).css("display", "table-cell");
        $('.' + clsName + 'TDYes').css("display", "none");
        $('.' + clsName + 'Yes').css("display", "none");
    }
}

function showAndHideHMLOCostDiv(fldValue, clsName) {
    if (fldValue == 'Yes') {
        $('.' + clsName + fldValue).css("display", "block");
        $('.' + clsName + 'No').css("display", "none");
        $('.' + clsName + 'TDNo').css("display", "table-cell");
    } else {
        $('.' + clsName + fldValue).css("display", "block");
        $('.' + clsName + 'Yes').css("display", "none");
        $('.' + clsName + 'TD' + fldValue).css("display", "none");
    }
}

function showAndHideHMLOExpBorDiv(fldValue, clsName) {
    if (fldValue == 'Yes') {
        $('.' + clsName + fldValue).css("display", "block");
        $('.' + clsName + 'No').css("display", "none");
    } else {
        $('.' + clsName + fldValue).css("display", "block");
        $('.' + clsName + 'Yes').css("display", "none");
    }
}

function showAndHideHMLOExpCoBorDiv(fldValue, clsName) {
    if (fldValue == 'Yes') {
        $('.' + clsName + fldValue).css("display", "block");
        $('.' + clsName + 'No').css("display", "none");
    } else {
        $('.' + clsName + fldValue).css("display", "block");
        $('.' + clsName + 'Yes').css("display", "none");
    }
}

/**

 ** Description  : Hide and Show the Co-Borrower Section in Web Form
 ** Developer    : Venkatesh
 ** Author       : AwataSoftSys
 ** Date         : Nov 29, 2016

 **/

function toggleSwitch(divName, fldName, on, off) {

    var t1 = document.getElementById(fldName).value;
    if (t1 == on) {
        document.getElementById(fldName).value = off;
        document.getElementById(divName).className = "switch-off";
    } else {
        document.getElementById(fldName).value = on;
        document.getElementById(divName).className = "switch-on";

    }
}

function showHMLOCoBorrowerDiv(divId, noOfDiv) {
    var opt = 0;
    try {
        opt = document.HMLOWebForm.isCoBorrower.value;
    } catch (e) {
    }

    if (noOfDiv > 0) {
        for (var i = 1; i <= noOfDiv; i++) {
            try {
                if (opt == '1') {
                    eval("document.getElementById('" + divId + i + "').style.display = 'block'");
                } else {
                    eval("document.getElementById('" + divId + i + "').style.display = 'none'");
                }
            } catch (e) {
            }
        }
    } else {
        try {
            if (opt == '1') {
                document.getElementById(divId).style.display = 'block';
            } else {
                document.getElementById(divId).style.display = 'none';
            }
        } catch (e) {
        }
    }

}

/**
 ** Description  : Agent/Broker Section.
 ** Developer    : Suresh
 **/
function showAndHideBrokerInfo(fldValue, divId) {
    var defaultAgentId = $('#defaultAgentId').val();
    var wfOpt = $('#wfOpt').val();
    var hideBorrowerInfo = 0;
    var propDetailsProcess = '';
    var pcid = $('#FPCID').val();
    hideBorrowerInfo = $('#hideBorrowerInfo').val();
    propDetailsProcess = $('#propDetailsProcess').val();

    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
        $('#' + divId).css("display", "block");
        $('#agentId').val('0');
        $('.LmbInfo').show();
        $('.loanInfoLPSection').show();
        //$('.HMLOLoanInfoSections').show();
        enableAllFormFields('DD');
        clear_form_elements('brokerSection');
        checkdisable_form_elements("brokerSection", 1);

        if (hideBorrowerInfo == 1 && wfOpt == 'aa4465703ef4b17e') {
            $('.borrowerInfoSection').hide();
        }
        if ((propDetailsProcess == 'Looking for General Info' || propDetailsProcess == 'Actively Looking For Property')
            && hideBorrowerInfo) {
            $('.borrowerHideSection').hide();
        }
        $('.expLabel').html("Does borrower");
        $('.span_is').html("Is borrower");
        $('.expLabel2').html("does borrower");
    } else {
        document.getElementById(divId).style.display = 'none';
        $('#agentId').val(defaultAgentId);
        clear_form_elements('brokerSection');
        checkdisable_form_elements("brokerSection", 0);
        $('.loanInfoLPSection').show();
        $('.borrowerInfoSection').show();
        $('.borrowerHideSection').show();

        $('.expLabel').html("Do You");
        $('.span_is').html("Are you");
        $('.expLabel2').html("do you");

    }
    $('.lmrClientTypeDisp').show();
    if ($('#LMRClientType > option').length == 2) {
        $("#LMRClientType").val($("#LMRClientType option:eq(1)").val());
        controlWebFormFields('fileModule', '', 'LMRClientType', 'loanProgram');
        try {
            customDev();
        } catch (e) {

        }
        showAndHideLandFieldsNew($("#LMRClientType option:eq(1)").val());
        allowToEditDisabledFields(this.value, '');
        getPCMinMaxLoanGuidelines('loanModForm', pcid);
        populatePCBasicLoanInfo('loanModForm', $("#LMRClientType option:eq(1)").val(), pcid, 'loc');
    }
}


function showAndHideLoanofficerInfo(fldValue, divId) {
    var defaultAgentId = $('#defaultAgentId').val();
    var wfOpt = $('#wfOpt').val();
    var hideBorrowerInfo = 0;
    var propDetailsProcess = '';

    hideBorrowerInfo = $('#hideBorrowerInfo').val();
    propDetailsProcess = $('#propDetailsProcess').val();

    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
        $('#' + divId).css("display", "block");
        //$('#agentId').val('0');
        $('.LmbInfo').show();
        $('.loanInfoLPSection').show();
        //$('.HMLOLoanInfoSections').show();
        enableAllFormFields('DD');


        clear_form_elements('loanofficerSection');
        checkdisable_form_elements("loanofficerSection", 1);

        if (hideBorrowerInfo == 1 && wfOpt == 'aa4465703ef4b17e') {
            $('.borrowerInfoSection').hide();
        }
        if ((propDetailsProcess == 'Looking for General Info' || propDetailsProcess == 'Actively Looking For Property')
            && hideBorrowerInfo) {
            $('.borrowerHideSection').hide();
        }
        $('.expLabel').html("Does borrower");
        $('.span_is').html("Is borrower");
        $('.expLabel2').html("does borrower");
    } else {
        document.getElementById(divId).style.display = 'none';
        $('#agentId').val(defaultAgentId);


        clear_form_elements('loanofficerSection');
        checkdisable_form_elements("loanofficerSection", 0);
        $('.loanInfoLPSection').show();
        $('.borrowerInfoSection').show();
        $('.borrowerHideSection').show();

        $('.expLabel').html("Do You");
        $('.span_is').html("Are you");
        $('.expLabel2').html("do you");

    }
}

/**

 ** Description  : Check the Broker Information
 ** Developer    : Viji & Venkatesh
 ** Author       : AwataSoftSys
 ** Date         : Nov 30, 2016

 **/

function checkREBrokerEmailExist(formName) {
    if ($('#REBrokerEmail').val() != '') {
        $('#LMRBroker').removeClass('mandatory');

    }
    setTimeout("populateBrokerInfo('" + formName + "', '', '')", 200);
}

function populateBrokerInfo(formName, agentNumber, opt) {

    var brokerDetails = new Array();
    var brokerNumber = 0, executiveId = 0;
    var REBrokerFName = "", REBrokerCompany = "", REBrokerLName = "", phoneNumber = "";
    var brokerEmail = "", ph1 = "", ph2 = "", ph3 = "", ph4 = "";
    var alertBrMsg = "", PCID = 0, agentPCID = 0;
    REBrokerNumber = 0;

    clearHMLOBrokerInfoAsWebform(formName, opt);

    if (opt != 'DD') {
        eval("brokerEmail       = document." + formName + ".REBrokerEmail.value");
        try {
            eval("document." + formName + ".LMRBroker.value = ''");
        } catch (e) {
        }
    }

    try {
        eval("LMRBroker   = document." + formName + ".LMRBroker.value");
    } catch (e) {
    }

    if (opt == 'DD') {
        try {
            eval("document." + formName + ".REBrokerEmail.value = ''");
        } catch (e) {
        }
    }
    try {
        eval("executiveId   = document." + formName + ".executiveId.value");
        eval("PCID          = document." + formName + ".FPCID.value");
    } catch (e) {
    }

    try {
        brokerEmail = trim(brokerEmail);
    } catch (e) {
    }
    var url = siteSSLUrl + "backoffice/getAreYouBroker.php";
    var qstr = "email=" + brokerEmail + "&eId=" + executiveId + "&PCID=" + PCID + "&aId=" + agentNumber;
    var xmlDoc = "";
    if (brokerEmail != "" || agentNumber != '') {
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
    }
    try {
        brokerDetails = xmlDoc.getElementsByTagName("brokerInfo");
        status = xmlDoc.getElementsByTagName("status")[0].firstChild.nodeValue;
        agentPCID = xmlDoc.getElementsByTagName("agentPCID")[0].firstChild.nodeValue;
    } catch (e) {
    }

    if ((PCID == agentPCID) && (agentPCID > 0)) {
        for (var i = 0; i < brokerDetails.length; i++) {
            try {
                REBrokerNumber = brokerDetails[i].getElementsByTagName("encBrokerNumber")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                REBrokerFName = brokerDetails[i].getElementsByTagName("brokerName")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                REBrokerCompany = brokerDetails[i].getElementsByTagName("brokerCompany")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                REBrokerLName = brokerDetails[i].getElementsByTagName("brokerLName")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                REBrokerEmail = brokerDetails[i].getElementsByTagName("brokerEmail")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                phoneNumber = brokerDetails[i].getElementsByTagName("bphoneNumber")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                alertBrMsg = brokerDetails[i].getElementsByTagName("alertBrMsg")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                var externalBroker = brokerDetails[i].getElementsByTagName("externalBroker")[0].childNodes[0].nodeValue;
                if (externalBroker == 1) {
                    toastrNotification(' Email "' + $('#REBrokerEmail').val() + '" is Assigned to Loan officer', 'error');
                    $('#REBrokerEmail').val('');
                    return false;
                }
            } catch (e) {
            }

            ph1 = phoneNumber.substring(0, 3);
            ph2 = phoneNumber.substring(3, 6);
            ph3 = phoneNumber.substring(6, 10);
            ph4 = phoneNumber.substring(10, 15);

            /**

             ** Description  : Value population HMLO Web forms.
             ** Developer    : Suresh

             **/
            assignFieldValue(REBrokerEmail, 'REBrokerEmail');
            assignFieldValue(REBrokerCompany, 'REBrokerCompany');
            assignFieldValue(REBrokerFName, 'REBrokerFirstName');
            assignFieldValue(REBrokerLName, 'REBrokerLastName');
            assignFieldValue(ph1, 'bPhNo1');
            assignFieldValue(ph2, 'bPhNo2');
            assignFieldValue(ph3, 'bPhNo3');
            assignFieldValue(ph4, 'bExt');
            var phNumber = '';
            if (ph1 != '') phNumber += ph1;
            if (ph2 != '') phNumber += "-" + ph2;
            if (ph3 != '') phNumber += "-" + ph3;
            if (ph4 != '') phNumber += "(" + ph4 + ")";

            assignFieldValue(phNumber, 'brokerPhone');
        }
        allowToEditDisabledFields('', 'agentInfoCls');
    }

    eval("document." + formName + ".agentId.value = REBrokerNumber");
    if (PCID > 0 && agentPCID > 0 && PCID != agentPCID) {
        //    eval("document."+formName+".REBrokerEmail.value = ''");
        //     eval("document."+formName+".REBrokerEmail.focus()");
        //  document.getElementById('REBrokerEmail').className = "highlights";
        //     toastrNotification('This agent email cannot be used, it is already in use in the system.', 'error');
//        alert('This agent email cannot be used, it is already in use in the system.');
    }
    if (brokerEmail != "" || opt == 'DD') {
        if (alertBrMsg != '') {
            disableAllFormFields(opt);
            // $('.LmbInfo').hide();
        } else {
            //$('.LmbInfo').show();
            enableAllFormFields(opt);
            try {
                eval("document." + formName + ".REBrokerFirstName.focus()");
            } catch (e) {
            }
        }
    }
}


function checkLoanofficerEmailExist(formName) {
    if ($('#RELoanofficerEmail').val() != '') {
        $('#LMRLoanofficer').removeClass('mandatory');
    }
    setTimeout("populateLoanofficerInfo('" + formName + "', '', '')", 200);
}

function populateLoanofficerInfo(formName, agentNumber, opt) {

    var loanofficerDetails = new Array();
    var loanofficerNumber = 0, executiveId = 0;
    var loanofficerfname = "", loanofficerCompany = "", loanofficerlname = "", phoneNumber = "";
    var loanofficerEmail = "", ph1 = "", ph2 = "", ph3 = "", ph4 = "";
    var alertBrMsg = "", PCID = 0, secondaryAgentPCID = 0;
    loanofficerNumber = 0;

    clearHMLOLoanOfficerInfoAsWebform(formName, opt);

    if (opt != 'DD') {
        eval("loanofficerEmail       = document." + formName + ".RELoanofficerEmail.value");
        try {
            eval("document." + formName + ".LMRLoanofficer.value = ''");
        } catch (e) {
        }
    }

    try {
        eval("LMRLoanofficer   = document." + formName + ".LMRLoanofficer.value");
    } catch (e) {
    }

    if (opt == 'DD') {
        try {
            eval("document." + formName + ".RELoanofficerEmail.value = ''");
        } catch (e) {
        }
    }
    try {
        eval("executiveId   = document." + formName + ".executiveId.value");
        eval("PCID          = document." + formName + ".FPCID.value");
    } catch (e) {
    }

    try {
        loanofficerEmail = trim(loanofficerEmail);
    } catch (e) {
    }
    var url = siteSSLUrl + "backoffice/getAreYouBroker.php";
    var qstr = "email=" + loanofficerEmail + "&eId=" + executiveId + "&PCID=" + PCID + "&aId=" + agentNumber + "&externalBroker=1";
    var xmlDoc = "";
    if (loanofficerEmail != "" || agentNumber != '') {
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
    }
    try {
        loanofficerDetails = xmlDoc.getElementsByTagName("brokerDetail");
        status = xmlDoc.getElementsByTagName("status")[0].firstChild.nodeValue;
        agentPCID = xmlDoc.getElementsByTagName("agentPCID")[0].firstChild.nodeValue;
    } catch (e) {
    }


    if ((PCID == agentPCID) && (agentPCID > 0)) {
        for (var i = 0; i < loanofficerDetails.length; i++) {
            try {
                loanofficerNumber = loanofficerDetails[i].getElementsByTagName("encBrokerNumber")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                loanofficerfname = loanofficerDetails[i].getElementsByTagName("brokerName")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                loanofficerCompany = loanofficerDetails[i].getElementsByTagName("brokerCompany")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                loanofficerlname = loanofficerDetails[i].getElementsByTagName("brokerLName")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                loanofficerEmail = loanofficerDetails[i].getElementsByTagName("brokerEmail")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                phoneNumber = loanofficerDetails[i].getElementsByTagName("bphoneNumber")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                alertBrMsg = loanofficerDetails[i].getElementsByTagName("alertBrMsg")[0].childNodes[0].nodeValue;
            } catch (e) {
            }

            try {
                var externalBroker = brokerDetails[i].getElementsByTagName("externalBroker")[0].childNodes[0].nodeValue;
                if (externalBroker == 0) {
                    toastrNotification('Email "' + $('#RELoanofficerEmail').val() + '" is Assigned to Broker', 'error');
                    $('#RELoanofficerEmail').val('');
                    return false;
                }
            } catch (e) {
            }

            ph1 = phoneNumber.substring(0, 3);
            ph2 = phoneNumber.substring(3, 6);
            ph3 = phoneNumber.substring(6, 10);
            ph4 = phoneNumber.substring(10, 15);

            assignFieldValue(loanofficerEmail, 'RELoanofficerEmail');
            assignFieldValue(loanofficerCompany, 'RELoanofficerCompany');
            assignFieldValue(loanofficerfname, 'RELoanofficerFirstName');
            assignFieldValue(loanofficerlname, 'RELoanofficerLastName');
            assignFieldValue(ph1, 'bPhNo1');
            assignFieldValue(ph2, 'bPhNo2');
            assignFieldValue(ph3, 'bPhNo3');
            assignFieldValue(ph4, 'bExt');
            var phNumber = '';
            if (ph1 != '') phNumber += ph1;
            if (ph2 != '') phNumber += "-" + ph2;
            if (ph3 != '') phNumber += "-" + ph3;
            if (ph4 != '') phNumber += "(" + ph4 + ")";

            assignFieldValue(phNumber, 'LoanofficerPhone');
        }
        allowToEditDisabledFields('', 'agentInfoCls');
    }

    eval("document." + formName + ".secondaryAgentId.value = loanofficerNumber");
    if (PCID > 0 && agentPCID > 0 && PCID != agentPCID) {
        //    eval("document."+formName+".REBrokerEmail.value = ''");
        //     eval("document."+formName+".REBrokerEmail.focus()");
        //  document.getElementById('REBrokerEmail').className = "highlights";
        //     toastrNotification('This agent email cannot be used, it is already in use in the system.', 'error');
//        alert('This agent email cannot be used, it is already in use in the system.');
    }
    if (loanofficerEmail != "" || opt == 'DD') {
        if (alertBrMsg != '') {
            // disableAllFormFields(opt);
            $('#LoanofficerInfoDiv :input').not("[name=LMRLoanofficer]").attr('disabled', true);

            // $('.LmbInfo').hide();
        } else {
            //$('.LmbInfo').show();
            $('#LoanofficerInfoDiv :input').attr('disabled', false);
            // enableAllFormFields(opt);
            try {
                eval("document." + formName + ".RELoanofficerFirstName.focus()");
            } catch (e) {
            }
        }
    }
}

/**

 ** Description  : Automatically fill the Mailing Address (If it is Only click event on same as borrower...)
 ** Developer    : Viji & Venkatesh
 ** Author       : AwataSoftSys
 ** Date         : Nov 30, 2016

 **/


/*
 * Auto Populate Borrower mailing Address as Co-Borrower mailing Address.
 */

function autoPopulateHMLOMailingAddressAsFile(formName) {
    var opt = 0;

    try {
        opt = document.HMLOWebForm.mailingAddressAsBorrower.value;
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

    } else {
        clearHMLOMailingAddressAsFile(formName);
    }
}

/*
 *  Clear Co-Borrower mailing Address.
 */
function clearHMLOMailingAddressAsFile(formName) {
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


function autoPopulateHMLOPresentAdd() {
    var opt = 0;
    try {
        opt = document.HMLOWebForm.mailingAddrAsPresent.value;
    } catch (e) {
    }

    if (opt == 1) {
        try {
            document.HMLOWebForm.presentAddress.value = document.HMLOWebForm.mailingAddress.value;
        } catch (e) {
        }

        try {
            document.HMLOWebForm.presentCity.value = document.HMLOWebForm.mailingCity.value;
        } catch (e) {
        }
        try {
            document.HMLOWebForm.presentState.value = document.HMLOWebForm.mailingState.value;
        } catch (e) {
        }
        try {
            document.HMLOWebForm.presentZip.value = document.HMLOWebForm.mailingZip.value;
        } catch (e) {
        }

    } else {
        clearHMLOPresentAdd();
    }
}

function clearHMLOPresentAdd() {
    try {
        document.HMLOWebForm.presentAddress.value = "";
    } catch (e) {
    }
    try {
        document.HMLOWebForm.presentCity.value = "";
    } catch (e) {
    }
    try {
        document.HMLOWebForm.presentState.value = "";
    } catch (e) {
    }
    try {
        document.HMLOWebForm.presentZip.value = "";
    } catch (e) {
    }
}

function autoPopulateHMLOCoBPresentAddr() {
    var opt = 0;
    try {
        opt = document.HMLOWebForm.coBorMailingAddrAsPresent.value;
    } catch (e) {
    }

    if (opt == 1) {
        try {
            document.HMLOWebForm.coBPresentAddress.value = document.HMLOWebForm.coBorrowerMailingAddress.value;
        } catch (e) {
        }

        try {
            document.HMLOWebForm.coBPresentCity.value = document.HMLOWebForm.coBorrowerMailingCity.value;
        } catch (e) {
        }
        try {
            document.HMLOWebForm.coBPresentState.value = document.HMLOWebForm.coBorrowerMailingState.value;
        } catch (e) {
        }
        try {
            document.HMLOWebForm.coBPresentZip.value = document.HMLOWebForm.coBorrowerMailingZip.value;
        } catch (e) {
        }

    } else {
        clearHMLOCoBPresentAdd();
    }
}

function clearHMLOCoBPresentAdd() {
    try {
        document.HMLOWebForm.coBPresentAddress.value = "";
    } catch (e) {
    }
    try {
        document.HMLOWebForm.coBPresentCity.value = "";
    } catch (e) {
    }
    try {
        document.HMLOWebForm.coBPresentState.value = "";
    } catch (e) {
    }
    try {
        document.HMLOWebForm.coBPresentZip.value = "";
    } catch (e) {
    }
}

/*
function validateHMLOWebForm(formName, agentAviOpt, opt) {
    var trueCount   = 0; var REBroker = ''; var checkMandatoryFields = 0; var LMRId = 0; 

    eval("REBroker = document."+formName+".REBroker.value");                                            // Get Are Boroker Yes or No
    eval("loanPurpose = document."+formName+".typeOfHMLOLoanRequesting.value");                         // Get Transactional Type/ Loan purpose
    eval("checkMandatoryFields = document."+formName+".checkMandatoryFields.value");                    // Customized PC 
    eval("LMRId = document."+formName+".LMRId.value");                                                  // Check Saved Existing File or Not

    var trueCount   = 0; var checkMandatoryFields = 0; var LMRId = 0; var REBroker = '';
    try {
        eval("REBroker      = document."+formName+".REBroker.value");
    } catch(e){}

    eval("loanPurpose   = document."+formName+".typeOfHMLOLoanRequesting.value");
    eval("checkMandatoryFields  = document."+formName+".checkMandatoryFields.value");
    eval("LMRId         = document."+formName+".LMRId.value");

    if(isDefaultAgent == 1 && LMRId == 0) {
        if(chkIsBlank(formName, 'REBroker', 'Please check the Agent/Broker?')) {
            if(REBroker == 'No'){
               if(chkIsBlank(formName, 'LMRBroker', 'Please select your Broker.')) {
                    trueCount  = 1;
               }
            } else {
                if(isEmailOk(formName, 'REBrokerEmail') && chkIsBlank(formName, 'REBrokerFirstName','Please enter the Agent/Broker First Name')
                    && chkIsBlank(formName, 'REBrokerLastName','Please enter the Agent/Broker Last Name')&&
                    chkIsBlank(formName, 'REBrokerCompany','Please enter the Agent/Broker Company Name') &&
                    isPhoneNumber(formName, 'brokerPhone', 'bPhNo1', 'bPhNo2' ,'bPhNo3')) {
                    trueCount  = 1;
                }
            }
        }
    } else {
        trueCount  = 1;
    }

    if(opt != 'QuickForm' && trueCount == 1){
        if(chkIsBlank(formName, 'LMRClientType', 'Please Select Loan Program.') &&
            checkMandatoryFieldsForPC(formName, checkMandatoryFields, 'serviceProvider')) {
            trueCount  = 1;
        }else{
            trueCount  = 0;
        }

    }

    if (opt != 'QuickForm' && trueCount == 1) {
        if (isCheck('loanModForm','agreeTC') ){
            trueCount  = 1;
        } else {
            trueCount  = 0;
        }
    }

    if(REBroker == 'Yes' && isDefaultAgent != 1 && trueCount == 1 && LMRId == 0) {
        if(isEmailOk(formName,'REBrokerEmail') &&
        chkIsBlank(formName,'REBrokerFirstName','Please enter the Agent/Broker First Name')&&
        chkIsBlank(formName,'REBrokerLastName','Please enter the Agent/Broker Last Name')&&
        chkIsBlank(formName,'REBrokerCompany','Please enter the Agent/Broker Company Name')&&
        isPhoneNumber(formName, 'brokerPhone', 'REBrokerPhnNo1', 'REBrokerPhnNo2' ,'REBrokerPhnNo3')
        ) {
            trueCount = 1;
        } else {
            trueCount = 0;
        }
    }

    if((REBroker == 'No' || REBroker == 'Yes' || REBroker == '') && trueCount == 1 && opt == 'QuickForm') {
        if (chkIsBlank(formName, 'LMRClientType', 'Please Select Loan Program.') &&
            chkIsBlank(formName,'borrowerFName','Please enter the first name') &&
            chkIsBlank(formName,'borrowerLName','Please enter the last name') &&
            checkValidEmailId(formName,'borrowerEmail') &&
            isPhoneNumber(formName, 'phoneNumber', 'phNo1', 'phNo2', 'phNo3') &&
            checkMandatoryFieldsForPC(formName, checkMandatoryFields, 'serviceProvider')&&
            chkIsBlank(formName,'purchaseCloseDate','Please type the Target Closing Date') &&
            chkIsBlank(formName,'typeOfHMLOLoanRequesting','Please select Loan Purpose')&&
            chkIsBlank(formName,'loanTerm','Please select Loan Term') &&
            chkIsBlank(formName,'propertyAddress','Please enter the Address') &&
            chkIsBlank(formName,'propertyCity','Please enter the City') &&
            chkIsBlank(formName,'propertyState','Please select the State') &&
            chkIsBlank(formName,'propertyZip','Please enter the Zip') &&
            isCheck(formName,'agreeTC'))
        {
            trueCount = 1;
        } else {
            trueCount = 0;
        }
    }

    chkIsBlank(formName,'mortgageNotes','Please enter the Borrower Notes') // Remove Borrower Notes Mandatory check - (Pivotal #154481964)
    if((loanPurpose == 'Purchase' || loanPurpose == 'Bridge Loan' || loanPurpose == 'Blanket Loan' || loanPurpose == 'Commercial Purchase' || loanPurpose == 'Line of Credit') && trueCount == 1 && formName != 'loanModForm') {
        eval("rehabCon   = document."+formName+".propertyNeedRehab.value");

        if(isRadioSelected('HMLOWebForm','propertyNeedRehab','Please select property need repairs, rehab, or construction?')) {
            if(rehabCon == 'Yes') {
                if (chkIsBlank('HMLOWebForm','rehabCost','Please enter the Rehab / Construction Cost')&&
                    chkIsBlank('HMLOWebForm','rehabValByBor','Please enter the After Repair / Resale Value')&&
                    chkIsBlank('HMLOWebForm','rehabDuration','Please enter the How long will Rehab / Construction Take in Months?') ) {
                    trueCount = 1;
                } else {
                    trueCount = 0;
                }
            }
        } else {
            trueCount = 0;
        }

    }

    if((loanPurpose == 'Purchase' || loanPurpose == 'Bridge Loan' || loanPurpose == 'Blanket Loan' || loanPurpose == 'Commercial Purchase' || loanPurpose == 'Line of Credit'|| loanPurpose == 'Transactional') && trueCount == 1 && formName != 'loanModForm') {
        if (isRadioSelected('HMLOWebForm','acceptedPurchase','Please select distressed sale') ) {
            trueCount = 1;
        } else {
            trueCount = 0;
        }
    }
    if((loanPurpose == 'Purchase' || loanPurpose == 'Cash-Out / Refinance' || loanPurpose == 'Commercial Purchase' || loanPurpose == 'Line of Credit' || loanPurpose == 'Commercial Cash Out Refinance') && trueCount == 1 && opt == 'QuickForm') {
        eval("rehabCon   = document."+formName+".propertyNeedRehab.value");

        if(isRadioSelected('HMLOWebForm','propertyNeedRehab','Please select property need repairs, rehab, or construction?')) {
            if(rehabCon == 'Yes') {
                if (chkIsBlank('HMLOWebForm','rehabCost','Please enter the Rehab / Construction Cost')&&
                    chkIsBlank('HMLOWebForm','rehabValByBor','Please enter the After Repair / Resale Value')&&
                    chkIsBlank('HMLOWebForm','rehabDuration','Please enter the How long will Rehab / Construction Take in Months?') ) {
                    trueCount = 1;
                } else {
                    trueCount = 0;
                }
            }
        } else {
            trueCount = 0;
        }

    }

    if((loanPurpose == 'Purchase' || loanPurpose == 'Commercial Purchase' || loanPurpose == 'Transactional') && trueCount == 1 && opt == 'QuickForm') {
        if (isRadioSelected('HMLOWebForm','acceptedPurchase','Please select distressed sale') ) {
            trueCount = 1;
        } else {
            trueCount = 0;
        }
    }

    if(trueCount == 1){
        return true;
    } else {
        return false;

    }
}
*/
/**

 Description : Make the SMS Servicer provider mandatory in all HMLO versions of their webforms.
 Date        : Dec 16, 2017
 Function    : checkMandatoryFieldsForPC(formName, checkMandatoryFields, fieldName);
 Developer   : Suresh

 * 820  = Dave PC
 * 2    = AWATA PC
 * 3093 = North By NorthEast Lending PC

 **/

function checkMandatoryFieldsForPC(formName, checkMandatoryFields, fieldName) {
    if (checkMandatoryFields == 1) {
        if (chkIsBlank(formName, fieldName, 'Please select service provider.')) return true;
    } else {
        return true;
    }
}

function deleteWebFormCollateralPropertyInfo(LMRId, CID) {
    var cfmMsg = "Are you sure to delete?";
    if (confirm(cfmMsg)) {
        var delCnt = 0, url = "", qstr = "";
        url = "backoffice/deleteCollateralPropertyInfo.php";
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
            showWebFormCollateralPropertyInfo(LMRId);
        }
    }
}

function validateWebFormCollateralInfo(formName) {
    if (chkIsBlank(formName, 'collateralName', 'Please enter Collateral Name')
    ) {
        saveWebFormCollateralPropertyInfo();
    } else {
        return false;
    }
}

function saveWebFormCollateralPropertyInfo() {

    var collateralName = "", collateralAddress = "", collateralCity = 0, collateralState = '',
        collateralZip = '', LMRId = 0;
    CID = 0, collateralOccupied1 = '';
    var OPStatus = "", collateralPropertyType = "", collateralUnits = 0, collateralOccupied = "",
        collateralLendableEquity = "", collateralLien1 = "", collateralLienPosition = "";

    LMRId = $('#LMRId').val();
    CID = $('#CID').val();
    encryptedLMRId = document.HMLOWebForm.lId.value;
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


    url = "pops/collateralPropertyInfoSave.php";
    qstr = "LMRId=" + LMRId + "&CID=" + CID + "&collateralName=" + collateralName + "&collateralAddress=" + collateralAddress + "&collateralCity=" + collateralCity + "&collateralState=" + collateralState + "&collateralZip=" + collateralZip + "&collateralPropertyType=" + collateralPropertyType + "&collateralUnits=" + collateralUnits + "&collateralOccupied=" + collateralOccupied + "&collateralLendableEquity=" + collateralLendableEquity + "&collateralLien1=" + collateralLien1 + "&collateralLienPosition=" + collateralLienPosition;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        cnt = xmlDoc.getElementsByTagName("updateCnt")[0].firstChild.nodeValue;
    } catch (e) {
    }
    showWebFormCollateralPropertyInfo(encryptedLMRId);

}

function showWebFormCollateralPropertyInfo(LMRId) {

    var url = "", qstr = "";
    url = "backoffice/getCollateralPropertyInfo.php";
    qstr = "LMRId=" + LMRId + "&opt=WF";
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

 ** Description  : Validate the HMLO Property Insurance
 ** Date         : Jan 20, 2017

 **/

function validatePropertyInsurance() {
    if (chkIsBlank('HMLOPropInsForm', 'proInsName', 'Please enter Carrier Name')) {
        return true;
    } else {
        return false;
    }
}

/**

 ** Description  : Validate the HMLO Appraiser info
 ** Date         : Jan 21, 2017

 **/

function validateAppraiserInfo(opt) {

    if (opt == 'appraiser2') {
        if (chkIsBlank('HMLOAppraiserForm', 'appraiser2', 'Please enter Appraiser 2 Name')) {
            return true;
        } else {
            return false;
        }
    } else {
        if (chkIsBlank('HMLOAppraiserForm', 'appraiser1', 'Please enter Appraiser Name')) {
            return true;
        } else {
            return false;
        }
    }
}

/**

 ** Description  : Validate the HMLO Realtor info
 ** Date         : Jan 21, 2017

 **/

function validateRealtorInfo(opt) {

    if (opt == 'realtor3') {
        if (chkIsBlank('HMLORealtorForm', 'BPO3', 'Please enter Realtor 3 Name')) {
            return true;
        } else {
            return false;
        }
    } else if (opt == 'realtor2') {
        if (chkIsBlank('HMLORealtorForm', 'BPO2', 'Please enter Realtor 2 Name')) {
            return true;
        } else {
            return false;
        }
    } else {
        if (chkIsBlank('HMLORealtorForm', 'BPO1', 'Please enter Realtor Name')) {
            return true;
        } else {
            return false;
        }
    }
}

function showAndHideHMLOLoanPurposeDiv(fldValue, divId, divId2) {
    var temprehabCon = '';
    try {
        temprehabCon = document.HMLOWebForm.propertyNeedRehab.value;
        hideAndShowBlanketLoan(temprehabCon, 'doesPropertyNeedRehabDispDiv');
    } catch (e) {
    }

    if (fldValue == 'Rate & Term Refinance' || fldValue == 'Commercial Rate / Term Refinance' || fldValue == 'Transactional') {
        $('.doesPropertyNeedRehabDispDiv').hide();
        $('#' + divId).css("display", "none");
    } else {
        $('#' + divId).css("display", "block");
    }

    if (fldValue == 'Purchase' || fldValue == 'New Construction - Existing Land' || fldValue == 'Transactional') {
        $('#' + divId2).css("display", "block");
    } else {
        $('#' + divId2).css("display", "none");
    }
}

function autoPopulateHMLOPresentAdd(formName, targetDiv) {
    var opt = 0;
    if (targetDiv == 'mailingAddrAsPresent') {
        try {
            eval("opt = document." + formName + "." + targetDiv + ".value");
        } catch (e) {
        }

        if (opt == 1) {
            $(".hideMailingAddr").css("display", "none");
        } else {
            $(".hideMailingAddr").css("display", "block");
        }
    } else {
        try {
            eval("opt = document." + formName + "." + targetDiv + ".value");
        } catch (e) {
        }

        if (opt == 1) {
            $(".hideCoMailingAddr").css("display", "none");
        } else {
            $(".hideCoMailingAddr").css("display", "block");
        }
    }
}

/* Common method to show / hide a div based on the input switch */
function showOrHideDiv(fldValue, divID) {
    var fv = '';
    try {
        fv = $('#' + fldValue).val();
    } catch (e) {
    }
    if (fv == 'Yes') {
        $('#' + divID).css("display", "block");
    } else {
        $('#' + divID).css("display", "none");
    }
}

function showAndHideIsTaxesInsEscrowed(fldValue, divID) {
    var taxes = 0;
    var activeTab = '';
    var tableRow = 'block';

    try {
        activeTab = $('#activeTab').val();
    } catch (e) {
    }

    if (activeTab == 'HMLI') {
    } else {
        var tableRow = 'block';
    }

    try {
        taxes = $('#taxes1').val();
    } catch (e) {
    }

    if (fldValue == 'Yes') {
        $('.' + divID).css("display", tableRow);
    } else {
        $('.' + divID).css("display", "none");
    }
    calculateHMLORealEstateTaxes(taxes);
}

function hideAndShowPropertyNeedRehab(fldValue, className) {
    if (fldValue == 'Yes') {
        $('.' + className).css("display", "block");
        try {
            $('.propertyNeedRehabinitialTddisp').css("display", "block");
            $('.propertyNeedRehabFootageTddisp').css("display", "block");
        } catch (e) {
        }
    } else {
        $('.' + className).css("display", "none");
        try {
            $('.propertyNeedRehabinitialTddisp').css("display", "none");
            $('.propertyNeedRehabFootageTddisp').css("display", "none");
        } catch (e) {
        }
    }
    var isGroundChecked ;
    isGroundChecked = $('input[name=isThisGroundUpConstruction]:checked').val();
    if( isGroundChecked != 'Yes'){
        $('.groundUpFields').hide();
    }
    $('#rehabCostFinanced').html('');
    clear_form_elements('doesPropertyNeedRehabDispDiv');
    updateLoanDetail();
}

function hideAndShowPropertyNeedRehabNew(fldValue, className) {
    if (fldValue == 'Yes') {
        $('.' + className).css("display", "block");
        try {
            $('.propertyNeedRehabinitialTddisp').css("display", "block");
        } catch (e) {
        }
    } else {
        $('.' + className).css("display", "none");
        try {
            $('.propertyNeedRehabinitialTddisp').css("display", "none");
        } catch (e) {
        }
    }
    var rCostPerFin = $('#rehabCostPercentageFinanced').val();
    $('#rehabCostFinanced').html('');
    clear_form_elements('doesPropertyNeedRehabDispDiv');
    calculateHMLOFeeCostTotalLoanAmount('loanModForm', 'totalLoanAmount');
    //calculateTotalProjectCost('loanModForm', 'totalProjectCost');
    if (rCostPerFin == '' || rCostPerFin == 'undefind' || rCostPerFin == 0) rCostPerFin = 100;
    $('#rehabCostPercentageFinanced').val(rCostPerFin);
}

function additionalPropertyRestrictionsHideShow(fldValue, className, bootOpt) {
    if (fldValue == 'Yes') {
        if (bootOpt == 1) {
            $('.' + className).css("display", "block");
        } else {
            $('.' + className).css("display", "block");
        }
    } else {
        $('.' + className).css("display", "none");
    }
}

function exitStrategyHideShow(fldValue, className, bootOpt) {
    var parentValues = ["AirBnb", "Long Term Rental", "Short Term Rental", "Fix & Hold"];
    if ($.inArray(fldValue, parentValues) != -1) {
        if (bootOpt == 1) {
            $('.rentalIncomePerMonthField').show();
            $('.exitStrategyExplain').show();
        } else {
            $('.rentalIncomePerMonthField').css("display", "block");
            $('.exitStrategyExplain').css("display", "block");
        }
        //$('.exitStrategyExplain').hide();
    } else if (fldValue != "") {
        if (bootOpt == 1) {
            $('.exitStrategyExplain').show();
        } else {
            $('.exitStrategyExplain').css("display", "block");
        }
        $('.rentalIncomePerMonthField').hide();
    } else {
        $('.exitStrategyExplain').hide();
        $('.rentalIncomePerMonthField').hide();
    }
}

function clear_form_elements(class_name) {
    jQuery("." + class_name).find(':input').each(function () {
        switch (this.type) {
            case 'select-one':
                if(this.classList.contains('chzn-select')) {
                    $(this).val('').trigger('chosen:updated');
                } else {
                    $(this).val('');
                }
                break;
            case 'password':
            case 'text':
            case 'textarea':
            case 'hidden':
            case 'file':
            case 'select-multiple':
            case 'date':
            case 'number':
            case 'tel':
            case 'email':
                jQuery(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
                break;
        }
    });
}

function interestRateDualPopulation(formName, targetName) {
    try {
        eval("lien1Rate     = document." + formName + ".lien1Rate.value");
    } catch (e) {
    }

    try {
        eval("document.getElementById('" + targetName + "').innerHTML = '" + lien1Rate + "'");
    } catch (e) {
    }
    calculateTotalDailyInterestCharge(formName, 'totalDailyInterestCharge');

    try {
        eval("document.getElementById('" + targetName + "').innerHTML = '" + totalNetOperatingIncome + "'");
    } catch (e) {
    }
}


/**
 Description     : Fetch the auto suggested the both Fees & cost and Loan Terms section in Loan Info Tab .
 Authors         : Viji, Venkatesh, Suresh.
 Developer       : Venkatesh.
 Date            : August 22, 2017.
 **/
function populatePCBasicLoanInfo(formName, loanPgm, PCID, ft, tabOpt = '') {
    if (!ft) ft = '';
    if (ft == '' && $('#fileModule').val() != undefined) ft = ($('#fileModule').val()).join();
    $.ajax({
        type: 'POST',
        url: siteSSLUrl + 'backoffice/getPCHMLOBasicLoanInfo.php',
        data: jQuery.param({
            'loanPgm': loanPgm,
            'PCID': PCID,
            'ft': ft
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (myData) {
            var obj = $.parseJSON(myData);
            var usePROST = obj.usePROST;
            var usePTY = obj.usePTY;

            populateLoanGuidlines(obj, tabOpt); /* Remove the confirm msg on Feb 02, 2018 */
        }
    });
}

function populateLoanGuidlines(obj, tabOpt = '') {
    if (obj.HMLOPCBasicLoanInfo) {
        var HMLOPCBasicLoanInfo = obj.HMLOPCBasicLoanInfo[0];
    }
    var HMLOPCTransactionType = obj.HMLOPCTransactionType;
    var HMLOPCLoanTerm = obj.HMLOPCLoanTerm;
    var HMLOPCExtnOption = obj.HMLOPCExtnOption;
    var HMLOPCOccupancy = obj.HMLOPCOccupancy;
    var glHMLOExtensionOption = obj.glHMLOExtensionOption;
    var HMLOPCState = obj.HMLOPCState;
    var HMLOPCPropertyType = obj.HMLOPCPropertyType;
    var propertyType = obj.propertyType;
    var useGLTT = obj.useGLTT;
    var useGLEO = obj.useGLEO;
    var useGLAmortization = obj.useGLAmortization;
    var useGLLT = obj.useGLLT;
    var useGLO = obj.useGLO;
    var usePROST = obj.usePROST;
    var usePTY = obj.usePTY;
    var useGLCS = obj.useGLCS;
    var glHMLOCreditScore = obj.glHMLOCreditScore;
    var HMLOPCAmortization = obj.HMLOPCAmortization;
//alert(JSON.stringify(HMLOPCPropertyType));
    assignFieldValue('', 'rehabCostPercentageFinanced');      // First empty this field on selecting the loan program
    assignFieldValue('', 'setRehabDefaultVal');               // First empty this field on selecting the loan program
    assignFieldValue('', 'survey');      // First empty this field on selecting the loan program
    assignFieldValue('', 'wholeSaleAdminFee');
    var brCSR = $('#borCreditScoreRange').val();
    $('#borCreditScoreRange').empty();
    $('#borCreditScoreRange').append('<option value="">- Select -</option>');
    if (useGLCS == 1) {
        $.each(glHMLOCreditScore, function (key, value) {
            $('#borCreditScoreRange').append('<option value="' + value + '">' + value + '</option>');
        });
    } else {
        $.each(HMLOPCBasicLoanInfo.PCBorrCreditScoreRange.split(','), function (key, value) {
            $('#borCreditScoreRange').append('<option value="' + value + '">' + value + '</option>');
        });
    }
    $('#borCreditScoreRange').val(brCSR);

    var brTR = $('#typeOfHMLOLoanRequesting').val();
    if (brTR == null) {
        brTR = 'Purchase';
    }
    if (HMLOPCTransactionType.length > 0) {
        if ($.inArray('Purchase', HMLOPCTransactionType) == -1) {
            if (useGLTT == 1) {
                brTR = HMLOPCTransactionType[0];
            } else {
                brTR = HMLOPCTransactionType[0]['transactionType'];
            }
        }
        /** Input Field Value assign. Client Info **/
        $('#typeOfHMLOLoanRequesting option[value!=""]').remove();
        for (var j = 0; j < HMLOPCTransactionType.length; j++) {
            if (useGLTT == 1) {
                var tt = HMLOPCTransactionType[j];
            } else {
                var tt = HMLOPCTransactionType[j]['transactionType'];
            }
            $('#typeOfHMLOLoanRequesting').append($('<option>', {text: tt, value: tt}));
        }
    }
    $('#typeOfHMLOLoanRequesting').val(brTR);
    showAndHideCommercialFields(brTR);
    var brLT = $('#loanTerm').val();
    if (HMLOPCLoanTerm.length > 0) {
        $('#loanTerm option[value!=""]').remove();
        for (var j = 0; j < HMLOPCLoanTerm.length; j++) {
            if (useGLLT == 1) {
                var LT = HMLOPCLoanTerm[j];
            } else {
                var LT = HMLOPCLoanTerm[j]['loanTerm'];
            }
            $('#loanTerm').append($('<option>', {text: LT, value: LT}));
        }
    }
    $('#loanTerm').val(brLT);

    var brHPT = $('#isHouseProperty').val();
    if (HMLOPCOccupancy.length > 0) {
        $('#isHouseProperty option[value!=""]').remove();
        for (var j = 0; j < HMLOPCOccupancy.length; j++) {
            if (useGLO == 1) {
                var Occp = HMLOPCOccupancy[j];
            } else {
                var Occp = HMLOPCOccupancy[j]['occupancy'];
            }
            $('#isHouseProperty').append($('<option>', {text: Occp, value: Occp}));
        }
    }
    $('#isHouseProperty').val(brHPT);

    var brPS = $('#propertyState').val();
    if (HMLOPCState.length > 0) {
        /** Property State And Property Type added BY Suresh K - PT: 150301036 **/
        $('#propertyState option[value!=""]').remove();
        for (var j = 0; j < HMLOPCState.length; j++) {
            var ProSTC = HMLOPCState[j]['stateCode'];
            var ProSTV = HMLOPCState[j]['stateName'];
            $('#propertyState').append($('<option>', {text: ProSTV, value: ProSTC}));
        }
    }
    $('#propertyState').val(brPS);

    var brPT = $('#propertyType').val();
    $('#propertyType option[value!=""]').remove();
    if (usePTY == 1) {
        for (var prop in HMLOPCPropertyType) {
            //$('#propertyType').append($('<option>', {text: HMLOPCPropertyType[prop], value: prop}));
            if (prop.trim() == 1000) {
                $('#propertyType').append('<option disabled style="color:white;background-color: rgb(0, 130, 187);">---Residential---</option>');
            } else if (prop.trim() == 1001) {
                $('#propertyType').append('<option disabled style="color:white;background-color: rgb(0, 130, 187);">---Commercial---</option>');
            } else {
                $('#propertyType').append($('<option>', {text: HMLOPCPropertyType[prop], value: prop.trim()}));
            }
        }
    } else {
        for (var j = 0; j < HMLOPCPropertyType.length; j++) {
            var PTC = HMLOPCPropertyType[j]['propertyType'];
            var PTV = propertyType[PTC];
            //$('#propertyType').append($('<option>', {text: PTV, value: PTC}));
            if (PTC.trim() == 1000) {
                $('#propertyType').append('<option disabled style="color:white;background-color: rgb(0, 130, 187);">---Residential---</option>');
            } else if (PTC.trim() == 1001) {
                $('#propertyType').append('<option disabled style="color:white;background-color: rgb(0, 130, 187);">---Commercial---</option>');
            } else {
                $('#propertyType').append($('<option>', {text: PTV, value: PTC.trim()}));
            }
        }
    }
    $('#propertyType').val(brPT);

    var brEO = $('#extensionOption').val();
    $('#extensionOption option[value!=""]').remove();
    if (useGLEO == 1) {
        for (var eID in HMLOPCExtnOption) {
            $('#extensionOption').append($('<option>', {text: HMLOPCExtnOption[eID], value: eID}));
        }
    } else {
        for (var j = 0; j < HMLOPCExtnOption.length; j++) {
            for (var eID in glHMLOExtensionOption) {
                if (eID == HMLOPCExtnOption[j]['extnOption']) {
                    $('#extensionOption').append($('<option>', {
                        text: glHMLOExtensionOption[eID],
                        value: HMLOPCExtnOption[j]['extnOption']
                    }));
                }
            }
        }
    }
    $('#extensionOption').val(brEO);


    /** Amortization **/
    var selectedAmortization = $('#lien1Terms').val();
    $('#lien1Terms option[value!=""]').remove();
    if (useGLAmortization == 1) {
        for (var eID in HMLOPCAmortization) {
            $('#lien1Terms').append($('<option>', {text: HMLOPCAmortization[eID], value: HMLOPCAmortization[eID]}));
        }
    } else {
        for (var j = 0; j < HMLOPCAmortization.length; j++) {
            $('#lien1Terms').append($('<option>', {text: HMLOPCAmortization[j]['AmortizationVal'], value: HMLOPCAmortization[j]['AmortizationVal']}));
        }
    }
    $('#lien1Terms').val(selectedAmortization);
    /**End of Amortization **/




    if (obj.HMLOPCBasicLoanInfo) {
        if ((parseFloat(HMLOPCBasicLoanInfo.originationPointsRate) > 0 || parseFloat(HMLOPCBasicLoanInfo.brokerPointsRate) > 0) && tabOpt == 'HMLI') {
            $.confirm({
                icon: 'fa fa-warning',
                closeIcon: true,
                title: 'Confirm',
                content: "Do you want to update the points and fees on this loan for a " + $("#LMRClientType option:selected").text(),
                type: 'green',
                backgroundDismiss: true,
                buttons: {
                    yes: function () {
                        assignAmountValue(HMLOPCBasicLoanInfo.originationPointsRate, 'originationPointsRate');
                        assignAmountValue(HMLOPCBasicLoanInfo.originationPointsValue, 'originationPointsValue');
                        assignAmountValue(HMLOPCBasicLoanInfo.brokerPointsRate, 'brokerPointsRate');
                        assignAmountValue(HMLOPCBasicLoanInfo.brokerPointsValue, 'brokerPointsValue');
                    },
                    No: function () {
                    },
                },
                onClose: function () {
                },
            });
        }
        assignAmountValue(HMLOPCBasicLoanInfo.applicationFee, 'applicationFee');
        assignAmountValue(HMLOPCBasicLoanInfo.processingFee, 'processingFee');
        assignAmountValue(HMLOPCBasicLoanInfo.appraisalFee, 'appraisalFee');
        assignAmountValue(HMLOPCBasicLoanInfo.drawsSetUpFee, 'drawsSetUpFee');
        assignAmountValue(HMLOPCBasicLoanInfo.drawsFee, 'drawsFee');
        assignAmountValue(HMLOPCBasicLoanInfo.miscellaneousFee, 'miscellaneousFee');
        assignAmountValue(HMLOPCBasicLoanInfo.closingCostFinanced, 'closingCostFinanced');
        assignAmountValue(HMLOPCBasicLoanInfo.minRate, 'minRate');
        assignAmountValue(HMLOPCBasicLoanInfo.maxRate, 'maxRate');
        assignAmountValue(HMLOPCBasicLoanInfo.estdTitleClosingFee, 'estdTitleClosingFee');
        assignAmountValue(HMLOPCBasicLoanInfo.wireFee, 'wireFee');

        assignAmountValue(HMLOPCBasicLoanInfo.valuationBPOFee, 'valuationBPOFee');
        assignAmountValue(HMLOPCBasicLoanInfo.valuationAVMFee, 'valuationAVMFee');
        assignAmountValue(HMLOPCBasicLoanInfo.creditReportFee, 'creditReportFee');
        assignAmountValue(HMLOPCBasicLoanInfo.backgroundCheckFee, 'backgroundCheckFee');
        assignAmountValue(HMLOPCBasicLoanInfo.floodCertificateFee, 'floodCertificateFee');
        assignAmountValue(HMLOPCBasicLoanInfo.documentPreparationFee, 'documentPreparationFee');
        assignAmountValue(HMLOPCBasicLoanInfo.servicingSetUpFee, 'servicingSetUpFee');
        assignAmountValue(HMLOPCBasicLoanInfo.taxServiceFee, 'taxServiceFee');
        assignAmountValue(HMLOPCBasicLoanInfo.floodServiceFee, 'floodServiceFee');
        assignAmountValue(HMLOPCBasicLoanInfo.inspectionFees, 'inspectionFees');
        assignAmountValue(HMLOPCBasicLoanInfo.projectFeasibility, 'projectFeasibility');
        assignAmountValue(HMLOPCBasicLoanInfo.dueDiligence, 'dueDiligence');
        assignAmountValue(HMLOPCBasicLoanInfo.UccLienSearch, 'UccLienSearch');
        assignAmountValue(HMLOPCBasicLoanInfo.otherFee, 'otherFee');
        assignAmountValue(HMLOPCBasicLoanInfo.taxImpoundsMonth, 'taxImpoundsMonth');
        assignAmountValue(HMLOPCBasicLoanInfo.taxImpoundsMonthAmt, 'taxImpoundsMonthAmt');
        assignAmountValue(HMLOPCBasicLoanInfo.taxImpoundsFee, 'taxImpoundsFee');
        assignAmountValue(HMLOPCBasicLoanInfo.insImpoundsMonthAmt, 'insImpoundsMonthAmt');
        assignAmountValue(HMLOPCBasicLoanInfo.insImpoundsFee, 'insImpoundsFee');
        assignAmountValue(HMLOPCBasicLoanInfo.thirdPartyFees, 'thirdPartyFees');
        assignAmountValue(HMLOPCBasicLoanInfo.insImpoundsMonth, 'insImpoundsMonth');
        assignAmountValue(HMLOPCBasicLoanInfo.escrowFees, 'escrowFees');
        assignAmountValue(HMLOPCBasicLoanInfo.recordingFee, 'recordingFee');
        assignAmountValue(HMLOPCBasicLoanInfo.underwritingFees, 'underwritingFees');
        assignAmountValue(HMLOPCBasicLoanInfo.propertyTax, 'propertyTax');
        assignAmountValue(HMLOPCBasicLoanInfo.travelNotaryFee, 'travelNotaryFee');
        assignAmountValue(HMLOPCBasicLoanInfo.bufferAndMessengerFee, 'bufferAndMessengerFee');
        assignAmountValue(HMLOPCBasicLoanInfo.prePaidInterest, 'prePaidInterest');
        assignAmountValue(HMLOPCBasicLoanInfo.realEstateTaxes, 'realEstateTaxes');
        assignAmountValue(HMLOPCBasicLoanInfo.insurancePremium, 'insurancePremium');
        assignAmountValue(HMLOPCBasicLoanInfo.closingCostFinancingFee, 'closingCostFinancingFee');
        assignAmountValue(HMLOPCBasicLoanInfo.attorneyFee, 'attorneyFee');
        assignFieldValue(HMLOPCBasicLoanInfo.downPaymentPercentage, 'downPaymentPercentage');
        assignFieldValue(HMLOPCBasicLoanInfo.rehabCostPercentageFinanced, 'rehabCostPercentageFinanced');
        assignFieldValue(HMLOPCBasicLoanInfo.totalLTC, 'LGMaxLTC');
        assignFieldValue(HMLOPCBasicLoanInfo.rehabCostPercentageFinanced, 'setRehabDefaultVal'); //set the rehab percentage default value acc to loan guide

        if (HMLOPCBasicLoanInfo.minRate > 0 || HMLOPCBasicLoanInfo.maxRate > 0) {
            $(".InRateRange").html('Optimal ' + HMLOPCBasicLoanInfo.minRate + " - " + HMLOPCBasicLoanInfo.maxRate);
        }
        assignFieldValue(HMLOPCBasicLoanInfo.survey, 'survey');
        assignFieldValue(HMLOPCBasicLoanInfo.wholeSaleAdminFee, 'wholeSaleAdminFee');
        updateLoanDetail();

    } else {
        try {
            document.loanModForm.minRate.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.maxRate.value = "";
        } catch (e) {
        }
        try {
            //document.loanModForm.lien1Rate.value = "0.00";
        } catch (e) {
        }

        clear_form_elements('feesCostDiv');
    }
}

function populateDualDateForHMLONewLoan(val, formName, targetFld) {
    try {
        eval("document." + formName + "." + targetFld + ".value = val");
    } catch (e) {
    }
}

function updateBrokerNo(val) {
    try {
        $('#agentId').val(val);
    } catch (e) {
    }
}

function updateLoanofficerNo(val) {
    try {
        $('#secondaryAgentId').val(val);
    } catch (e) {
    }
}

/*
* Description   : Tax Impounds Calculation
* Function      : calculateTaxImpoundsFee(formName, targetName)
* Formula       : Tax impounds Months * Tax Impounds Months Amt
* Developer     : Suresh K (SK)
*/
function calculateTaxImpoundsFee(formName, targetName) {

    var taxImpoundsFee = 0;
    var taxImpoundsMonth = 0;
    var taxImpoundsMonthAmt = 0;

    eval("taxImpoundsMonth      = document." + formName + ".taxImpoundsMonth.value");
    eval("taxImpoundsMonthAmt   = document." + formName + ".taxImpoundsMonthAmt.value");

    try {
        taxImpoundsMonth = replaceCommaValues(taxImpoundsMonth);
        taxImpoundsMonthAmt = replaceCommaValues(taxImpoundsMonthAmt);
    } catch (e) {
    }

    if (taxImpoundsMonth == "") taxImpoundsMonth = 0;
    if (taxImpoundsMonthAmt == "") taxImpoundsMonthAmt = 0;

    taxImpoundsFee = parseFloat(taxImpoundsMonth) * parseFloat(taxImpoundsMonthAmt);
    taxImpoundsFee = autoNumericConverter(taxImpoundsFee.toFixed(2));

    try {
        eval("document.getElementById('" + targetName + "').value = '" + taxImpoundsFee + "'");
    } catch (e) {
    }

    if (formName != 'addBasicLoanTermForm') {
        calculateTotalFeesAndCost();
    }
}

function hideAndShowBlanketLoan(fldValue, className) {

    var activeTab = '';
    var tableRow = 'flex';
    var tableCell = 'table-cell';

    try {
        activeTab = $('#activeTab').val();
    } catch (e) {
    }

    if (activeTab == 'HMLI') {
    } else {
        var tableRow = 'flex';
        var tableCell = 'flex';
    }

    if (fldValue == 'Yes') {
        if (className == 'isBlanketLoan' && $('#noOfPropertiesAcquiring_mirror').val() > 1) {
            $('#addSubpropDiv').show();
        }
        if (className == 'isEFBlanketLoan') {
            $('.' + className).css("display", tableCell);
        } else {
            $('.' + className).css("display", tableRow);
        }
    } else {
        $('.' + className).css("display", "none");
        if (className == 'isBlanketLoan') {
            $('#addSubpropDiv').hide();
        }
        $(".multipleSubProp").empty();

    }
}

function showAndHideBorSquareFootage(fldValue, className) {
    if (fldValue == 'Yes') {
        $('.' + className).css("display", "block");
    } else {
        $('.' + className).css("display", "none");
    }
}

function showAndHideBorSquareFootageNew(fldValue, className) {
    if (fldValue == 'Yes') {
        $('.' + className).css("display", "block");
    } else {
        $('.' + className).css("display", "none");
    }
}

function showAndHideInterestReserve(fldValue, className) {
    var activeTab = '';
    try {
        activeTab = $('#activeTab').val();
    } catch (e) {
    }

    if (fldValue == 'Yes') {
        if (activeTab == 'HMLI') {
            //     $('.' + className).css("display", "flex");
        } else {
            // $('.' + className).css("display", "flex");
        }
    } else {
        //$('.' + className).css("display", "none");
        //$('#prepaidInterestReserve').val('');
        //$('#noOfMonthsPrepaid').val('');
        $('#interestOnInterestReserveFee').html('');
        $('#totalLoanAmountIOIReserveAmt').html('');
        calculateTotalProjectCost('loanModForm', 'totalProjectCost');
    }
    /* card_119_loan_term_calculation_issue */
    updateLoanDetail();
    /* End card_119_loan_term_calculation_issue */
}

/*
function calculateRehabCostPercentageFinanced(formName, targetName) {
    var rehabCostFinanced = 0; var rehabCostFinancedPercentage = 0;var rehabCost = 0;

    eval("rehabCostFinanced = document.getElementById('rehabCostFinanced').innerHTML");
    eval("rehabCost         = document."+formName+".rehabCost.value");

    try {
        rehabCost           = replaceCommaValues(rehabCost);
        rehabCostFinanced   = replaceCommaValues(rehabCostFinanced);
    } catch(e) {}

    if (rehabCost == "")            rehabCost = 0;  
    if (rehabCostFinanced == "")    rehabCostFinanced = 0;
            
    if (rehabCost > 0) {
        rehabCostFinancedPercentage = parseFloat(rehabCostFinanced / rehabCost) * 100;
        rehabCostFinancedPercentage = Math.round(rehabCostFinancedPercentage);
    }

    try {
        eval("document.getElementById('"+targetName+"').value = '"+rehabCostFinancedPercentage+"'");
    } catch(e) {}
}*/

/**
 * Descrition: New Supporting fields for Interest Rate.
 * Date      : Jan 04, 2018
 * PT #      : 153961351
 * Added By  : Viji
 **/
function populateCostOfCaptial(formName, lien1Rate) {

    try {
        lien1Rate = replaceCommaValues(lien1Rate);
    } catch (e) {
    }

    if (lien1Rate == "") lien1Rate = 0;

    lien1Rate = parseFloat(lien1Rate).toFixed(3);

    /*try {
        eval("document." + formName + ".costOfCapital.value = '" + lien1Rate + "'");
    } catch (e) {
    }*/

    try {
        var costOfCapital = document.getElementById("costOfCapital").value;
        if (costOfCapital == "") costOfCapital = 0;
        var yieldSpread = lien1Rate - costOfCapital;
        yieldSpread = parseFloat(yieldSpread).toFixed(3);
        eval("document." + formName + ".yieldSpread.value = '" + yieldSpread + "'");
    } catch (e) {
    }
}

function populateYieldSpread(formName, costOfCapital) {   //clubhouse 22278/update-the-order-of-how-yield-spread-cost-of-capital-get-calculated
    lien1Rate = document.getElementById("lien1Rate").value;
    try {
        lien1Rate = replaceCommaValues(lien1Rate);
    } catch (e) {
    }
    if (lien1Rate == "") lien1Rate = 0;

    lien1Rate = parseFloat(lien1Rate).toFixed(3);
    try {
        eval("document." + formName + ".yieldSpread.value = lien1Rate - costOfCapital");
    } catch (e) {
    }
}

/**
 * Descrition: Mandotory Checlist Items Availablity Check HMLO Web Forms.
 * Date      : Dec 17, 2017
 * PT #      : 153211423
 * Added By  : Suresh K
 **/
function checkMandatoryChecklistItemsWebForms(reqCnt, vaiFCls, formName, webFormType) {
    var branchReferralCode = agentReferralCode = '';
    var docUCnt = 0;
    var lId = 0;

    jQuery("." + vaiFCls).each(function () {
        if ($(this).val() == 1) {
            docUCnt++;
        }
    });

    if (reqCnt == docUCnt) {
        eval("branchReferralCode    = document." + formName + ".branchReferralCode.value");
        eval("agentReferralCode     = document." + formName + ".agentReferralCode.value");
        eval("lId                   = document." + formName + ".lId.value");
        eval("fOpt                  = document." + formName + ".fOpt.value");
        if (webFormType == 'LV') {
            var Url = siteSSLUrl + "backoffice/thankHMLOWebForm.php?bRc=" + branchReferralCode + "&aRc=" + agentReferralCode + "&fOpt=" + fOpt + "&lid=" + lId;
        } else {
            var Url = siteSSLUrl + "backoffice/thankHMLOQuickWebForm.php?bRc=" + branchReferralCode + "&aRc=" + agentReferralCode + "&fOpt=" + fOpt + "&lid=" + lId;
        }
        window.location.href = Url;
    } else {
        // alert('Please upload document for required docs.');
        toastrNotification('Please upload document for required docs.', 'error');
    }
}

/**
 * Descrition: "HMLO Web Forms" tab switching control for "Short Version"
 * Date      : Dec 17, 2017
 * PT #      : 153211423
 * Added By  : Suresh K
 **/
function showTabForShortVersion(LMRId, tabOpt, formName, aRefCode) {
    var branchReferralCode = agentReferralCode = fOpt = lId = '';

    var wfOpt = $('#wfOpt').val();
    if (LMRId > 0 && tabOpt != 'CL') {
        eval("branchReferralCode    = document." + formName + ".branchReferralCode.value");
        eval("agentReferralCode     = document." + formName + ".agentReferralCode.value");
        eval("fOpt                  = document." + formName + ".fOpt.value");
        eval("lId                   = document." + formName + ".lId.value");

        if (aRefCode == 1) {
            var Url = siteSSLUrl + "HMLOWebForm.php?bRc=" + branchReferralCode + "&fOpt=" + fOpt + "&tabOpt=" + tabOpt + "&lid=" + lId + "&op=" + wfOpt;
        } else {
            var Url = siteSSLUrl + "HMLOWebForm.php?bRc=" + branchReferralCode + "&aRc=" + agentReferralCode + "&fOpt=" + fOpt + "&tabOpt=" + tabOpt + "&lid=" + lId + "&op=" + wfOpt;
        }
        window.location.href = Url;
    } else {
        //if(validateHMLOQuickWebForm(formName, fOpt)) {
        var x = document.getElementsByName(formName);
        x[0].submit();
        //}
    }
}

/**
 * Descrition: "HMLO Web Forms" tab switching control for "Long Version"
 * Date      : Dec 17, 2017
 * PT #      : 153211423
 * Added By  : Suresh K
 **/
function showTabForLongVersion(LMRId, tabOpt, formName, aRefCode) {
    var branchReferralCode = agentReferralCode = fOpt = lId = '', allowToEdit = 0;

    eval("allowToEdit = document." + formName + ".allowToEdit.value");
    eval("branchReferralCode    = document." + formName + ".branchReferralCode.value");
    eval("agentReferralCode     = document." + formName + ".agentReferralCode.value");
    eval("fOpt                  = document." + formName + ".fOpt.value");
    eval("lId                   = document." + formName + ".lId.value");

    if (LMRId > 0 && tabOpt != 'CL') {
        if (aRefCode == 1) {
            var Url = siteSSLUrl + "HMLOWebForm.php?bRc=" + branchReferralCode + "&fOpt=" + fOpt + "&tabOpt=" + tabOpt + "&lid=" + lId;
        } else {
            var Url = siteSSLUrl + "HMLOWebForm.php?bRc=" + branchReferralCode + "&aRc=" + agentReferralCode + "&fOpt=" + fOpt + "&tabOpt=" + tabOpt + "&lid=" + lId;
        }
        window.location.href = Url;
    } else {
        if (allowToEdit == 1) {
            if (validateHMLOLongWebForm(formName, fOpt)) {
                var x = document.getElementsByName(formName);
                x[0].submit();
            }
        } else {
            if (aRefCode == 1) {
                var Url = siteSSLUrl + "HMLOWebForm.php?bRc=" + branchReferralCode + "&fOpt=" + fOpt + "&tabOpt=" + tabOpt + "&lid=" + lId;
            } else {
                var Url = siteSSLUrl + "HMLOWebForm.php?bRc=" + branchReferralCode + "&aRc=" + agentReferralCode + "&fOpt=" + fOpt + "&tabOpt=" + tabOpt + "&lid=" + lId;
            }
            window.location.href = Url;
        }
    }
}

/**
 * Descrition: Get available Mandatory required docs for both long & short version web forms. (Not Used Right Now.)
 * Date      : Dec 18, 2017
 * PT #      : 153211423
 * Functions : getChecklistMandatoryForWebForms(formName, opt, moduleType, serviceType).
 * JQFiles : : getChecklistMandatoryForWebForms.php.
 * Added By  : Suresh K
 **/
function getChecklistMandatoryForWebForms(formName, opt, moduleType, serviceType) {
    var executiveId = FPCID = branchReferralCode = agentReferralCode = defaultAgentId = '';
    eval("executiveId           = document." + formName + ".branchId.value");
    eval("FPCID                 = document." + formName + ".FPCID.value");
    eval("branchReferralCode    = document." + formName + ".branchReferralCode.value");
    eval("agentReferralCode     = document." + formName + ".agentReferralCode.value");
    eval("defaultAgentId        = document." + formName + ".defaultAgentId.value");
    eval("fOpt                  = document." + formName + ".fOpt.value");

    $('#checklistLoader').show();
    $.ajax({
        type: 'POST',
        url: siteSSLUrl + 'JQFiles/getChecklistMandatoryForWebForms.php',
        data: jQuery.param({
            'executiveId': executiveId, 'agentNo': defaultAgentId, 'allowStatus': 1, 'opt': opt, 'PCID': FPCID,
            'moduleType': moduleType, 'serviceType': serviceType, 'fOpt': fOpt
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (checklistItems) {
            $('#checklistLoader').hide();
            if (checklistItems != '') {
                $('.checklistItemsSection').show();
                $('#checklistItems').html(checklistItems);
            } else {
                $('.checklistItemsSection').hide();
                $('#checklistItems').html(checklistItems);
            }
        }
    });
}

/**
 * Descrition: Multiple file upload for webforms
 * Date      : Dec 18, 2017
 * PT #      : 153211423
 * Functions : handleFileSelect(e).
 * Added By  : Suresh K
 **/
function handleFileSelect(e) {
    $('#documentLoader').show();
    var s = 1;
    if (!e.target.files || !window.FileReader) return;
    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function (f) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var preview = '';
            var name = f.name.split(".");
            var docName = name[0];
            var doctype = name[1];
            if (f.type.match("pdf.*")) {
                preview = "<i class=\"fa fa-file-pdf-o fa-3x pad10\" style=\"color:red\" aria-hidden=\"true\"></i>";
            } else if (doctype == "doc" || doctype == "docx") {
                preview = "<i class=\"fa fa-file-word-o fa-3x pad10\" style=\"color:blue\" aria-hidden=\"true\"></i>";
            } else if (f.type.match("excel.*") || doctype == "xlsx") {
                preview = "<i class=\"fa fa-file-excel-o fa-3x pad10\" style=\"color:green\" aria-hidden=\"true\"></i>";
            } else if (f.type.match("text.*") || f.type.match("csv.*")) {
                preview = "<i class=\"fa fa-file-text-o fa-3x pad10\" style=\"color:blue\" aria-hidden=\"true\"></i>";
            } else if (f.type.match("zip.*") || f.type.match("rar.*")) {
                preview = "<i class=\"fa fa-file-archive-o fa-3x pad10\" style=\"color:blue\" aria-hidden=\"true\"></i>";
            } else {
                preview = "<img src=\"" + e.target.result + "\" width=\"50\" height=\"50\">";
            }

            var html = "<tr><td><input type=\"text\" name=\"docCategory_" + s + "\" id=\"docCategory_" + s + "\" style=\"width:160px;\"></td><td><input type=\"text\" name=\"docName_" + s + "\" id=\"docName_" + s + "\" size=\"25\" value=\"" + docName + "\"></td><td>" + preview + "&nbsp;&nbsp;" + f.name + "</td></tr>";
            $('#uploadDocTable').append(html);
            s++;
        }
        reader.readAsDataURL(f);
    });
    setInterval(function () {
        $('#documentLoader').hide();
    }, 1000);
}

function handleFileSelectLMR(e) {
    var s = 1;
    var attr = e.target.attributes;
    var PCMIDId = attr.id.nodeValue;
    var PCMIDArr = PCMIDId.split("_");
    var PCMID = PCMIDArr[1];
    $('#documentLoader_' + PCMID).show();
    $('#uploadDocTable_' + PCMID).show();
    $('#tr_' + PCMID).addClass('chkDarkGrn');
    if (!e.target.files || !window.FileReader) return;
    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function (f) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var preview = '';
            var name = f.name.split(".");
            var docName = name[0];
            var doctype = name[1];
            if (f.type.match("pdf.*")) {
                preview = "<i class=\"fa fa-file-pdf-o fa-3x text-danger pad10\" aria-hidden=\"true\"></i>";
            } else if (doctype == "doc" || doctype == "docx") {
                preview = "<i class=\"fa fa-file-word-o fa-3x text-primary pad10\" aria-hidden=\"true\"></i>";
            } else if (f.type.match("excel.*") || doctype == "xlsx") {
                preview = "<i class=\"fa fa-file-excel-o fa-3x text-success pad10\" aria-hidden=\"true\"></i>";
            } else if (f.type.match("text.*") || f.type.match("csv.*")) {
                preview = "<i class=\"fa fa-file-text-o fa-3x text-primary pad10\" aria-hidden=\"true\"></i>";
            } else if (f.type.match("zip.*") || f.type.match("rar.*")) {
                preview = "<i class=\"fa fa-file-archive-o fa-3x text-primary pad10\" aria-hidden=\"true\"></i>";
            } else {
                preview = "<img src=\"" + e.target.result + "\" width=\"50\" height=\"50\">";
            }

            var html = "<div class=\"col-md-12\"><input type=\"text\" class=\"form-control col-md-12 upl_" + PCMID + "\" name=\"docName_" + PCMID + "[]\" id=\"docName_" + s + "\" value=\"" + docName + "\"></div><div class=\"clear\"></div>";
            $('#uploadDocTable_' + PCMID).append(html);
            s++;
        }
        reader.readAsDataURL(f);
    });
    setInterval(function () {
        $('#documentLoader_' + PCMID).hide();
    }, 1000);
}

function handleFileSelectTest(e) {
    var s = 1;
    var clone;
    var attr = e.target.attributes;
    var PCMIDId = attr.id.nodeValue;
    var PCMIDArr = PCMIDId.split("_");
    var PCMID = PCMIDArr[1];
    $('#documentLoader_' + PCMID).show();
    $('#uploadDocTable_' + PCMID).show();
    $('#tr_' + PCMID).addClass('chkDarkGrn');

    if (!e.target.files || !window.FileReader) return;               // | to make sure the user select file/files

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    if (filesArr.length > 0) {
        filesArr.forEach(function (f) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var preview = '';
                var name = f.name.split(".");
                var docName = name[0];
                var doctype = name[1];
                if (f.type.match("pdf.*")) {
                    preview = "<i class=\"fa fa-file-pdf-o fa-3x pad10\" style=\"color:red\" aria-hidden=\"true\"></i>";
                } else if (doctype == "doc" || doctype == "docx") {
                    preview = "<i class=\"fa fa-file-word-o fa-3x pad10\" style=\"color:blue\" aria-hidden=\"true\"></i>";
                } else if (f.type.match("excel.*") || doctype == "xlsx") {
                    preview = "<i class=\"fa fa-file-excel-o fa-3x pad10\" style=\"color:green\" aria-hidden=\"true\"></i>";
                } else if (f.type.match("text.*") || f.type.match("csv.*")) {
                    preview = "<i class=\"fa fa-file-text-o fa-3x pad10\" style=\"color:blue\" aria-hidden=\"true\"></i>";
                } else if (f.type.match("zip.*") || f.type.match("rar.*")) {
                    preview = "<i class=\"fa fa-file-archive-o fa-3x pad10\" style=\"color:blue\" aria-hidden=\"true\"></i>";
                } else {
                    preview = "<img src=\"" + e.target.result + "\" width=\"50\" height=\"50\">";
                }

                var html = "<div class=\"col-md-12\"><input type=\"text\" class=\"form-control input-sm col-md-8 upl_" + PCMID + "\" name=\"docName_" + PCMID + "[]\" id=\"docName_" + s + "\" value=\"" + docName + "\"></div><div class=\"clear\"></div>";
                $('#uploadDocTable_' + PCMID).append(html);
                s++;
            }

            reader.readAsDataURL(f);
        });
    }
    setInterval(function () {
        $('#documentLoader_' + PCMID).hide();
    }, 1000);
}

function calculateHMLORealEstateTaxes(taxes) {
    var HMLORealEstateTaxes = 0;
    var isTaxesInsEscrowed = '';
    var activeTab = '';

    isTaxesInsEscrowed = $('input[name=isTaxesInsEscrowed]:checked', '#loanModForm').val();

    try {
        taxes = replaceCommaValues(taxes);
        isTaxesInsEscrowed = trim(isTaxesInsEscrowed);
    } catch (e) {
    }

    if (taxes == '') taxes = 0;
    if (isTaxesInsEscrowed == '') isTaxesInsEscrowed = '';

    if (isTaxesInsEscrowed == 'Yes') {
        HMLORealEstateTaxes = taxes;
    } else {
        HMLORealEstateTaxes = taxes / 12;
    }
    HMLORealEstateTaxes = parseFloat(HMLORealEstateTaxes);
    HMLORealEstateTaxes = autoNumericConverter(HMLORealEstateTaxes.toFixed(2));
    $('#HMLORealEstateTaxes').val(HMLORealEstateTaxes);
    $('#HMLORealEstateTaxesLabel').html('<h5>' + HMLORealEstateTaxes + '</h5>');

    activeTab = $('#activeTab').val();

    if (activeTab == 'HMLI') {
    } else {
        calculatePrimaryTotalHouseHoldExpenses(HMLORealEstateTaxes);
    }
}

/*function showDialogBox(tabOpt) {
    $("#warning").dialog({
        title: '',
        autoOpen: true,
        closeOnEscape: false,
        draggable: false,
        width: 460,
        minHeight: 50,
        modal: true, buttons: {
            Yes: function() {
                if(confirmAndNavigateTab(tabOpt)) {showLoader(); } else {hideLoader();}
                $(this).dialog( "close" );
            },
            No: function() {
                goToNextTab(tabOpt);
                $(this).dialog( "close" );
                showLoader();
        },
            Cancel: function() {  $(this).dialog( "close" ); }
        },
        resizable: false
    });
    $('#warning').html('Would you like to save the data before leaving this tab?');
}*/


function validateHMLOQuickWebForm(formName, fOpt) {
    var trueCount = 0;
    var REBroker = '';
    var checkMandatoryFields = 0;
    var LMRId = 0, propDetailsProcess = '';

    eval("loanPurpose = document." + formName + ".typeOfHMLOLoanRequesting.value");                         // Get Transactional Type/ Loan purpose
    eval("checkMandatoryFields = document." + formName + ".checkMandatoryFields.value");                    // Customized PC
    eval("LMRId = document." + formName + ".LMRId.value");                                                  // Check Saved Existing File or Not

    eval("propDetailsProcess = document." + formName + ".propDetailsProcess.value");

    if (fOpt == 'agent' || LMRId > 0) {
        trueCount = 1;
    } else {
        eval("REBroker = document." + formName + ".REBroker.value");                                        // Get Are Boroker Yes or No
        eval("agentId = document." + formName + ".agentId.value");

        if (chkIsBlank(formName, 'REBroker', 'Are you a Loan Officer/Mortgage Broker or working with one?')) {
            if (REBroker == 'Yes' && agentId == 0) {
                if (isEmailOk(formName, 'REBrokerEmail') &&
                    chkIsBlank(formName, 'REBrokerFirstName', 'Please enter the Loan Officer/Mortgage Broker First Name') &&
                    chkIsBlank(formName, 'REBrokerLastName', 'Please enter the Loan Officer/Mortgage Broker Last Name') &&
                    chkIsBlank(formName, 'REBrokerCompany', 'Please enter the Loan Officer/Mortgage Broker Company Name') &&
                    isPhoneNumber(formName, 'brokerPhone', 'bPhNo1', 'bPhNo2', 'bPhNo3')) {
                    trueCount = 1;
                }
            } else {
                trueCount = 1;
            }
        }
    }

    if (trueCount == 1) {
        if (chkIsBlank(formName, 'LMRClientType', 'Please Select Loan Program.') &&
            chkIsBlank(formName, 'borrowerFName', 'Please enter the first name') &&
            chkIsBlank(formName, 'borrowerLName', 'Please enter the last name') &&
            checkValidEmailId(formName, 'borrowerEmail') &&
            isPhoneNumber(formName, 'phoneNumber', 'phNo1', 'phNo2', 'phNo3') &&
            checkMandatoryFieldsForPC(formName, checkMandatoryFields, 'serviceProvider')) {
            trueCount = 1;
        } else {
            trueCount = 0;
        }
    }

    if (trueCount == 1) {
        if (propDetailsProcess == 'Identified a Property' || propDetailsProcess == 'Signed Contract' || propDetailsProcess == 'I Own the Property') {
            if (chkIsBlank(formName, 'propertyAddress', 'Please enter the Address') &&
                chkIsBlank(formName, 'propertyCity', 'Please enter the City') &&
                chkIsBlank(formName, 'propertyState', 'Please select the State') &&
                chkIsBlank(formName, 'propertyZip', 'Please enter the Zip')) {
                trueCount = 1;
            } else {
                trueCount = 0;
            }
        } else {
            trueCount = 1;
        }
    }

    if (trueCount == 1) {
        //chkIsBlank(formName,'purchaseCloseDate','Please type the Target Closing Date') &&
        if (chkIsBlank(formName, 'loanTerm', 'Please select Loan Term') &&
            isCheck(formName, 'agreeTC')) {

            trueCount = 1;
        } else {
            trueCount = 0;
        }
    }

    if (trueCount == 1) {
        allowFormSubmit = 0;
        var allowFormSubmit = $("#allowFormSubmit").val();
        if (allowFormSubmit == 0) {
            return validateMinMaxLoanGuidelines();
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function allowToEditDisabledFields(ltValue, className) {
    var releseOpt = true;
    if (ltValue != '') releseOpt = false;
    if (className == '') {
        className = 'loanModForm';
    }
    jQuery("." + className).find(':input').each(function () {

        if (this.id != 'LMRClientType') {
            if (ltValue != '') {
                $(this).removeClass('disabledKeyFields');
            } else {
                $(this).addClass('disabledKeyFields');
            }
            switch (this.type) {
                case 'text':
                case 'textarea':
                case 'file':
                case 'submit':
                case 'select-one':
                    this.disabled = releseOpt;
                    break;
                case 'select-multiple':
                    this.disabled = releseOpt;
                    break;
                case 'date':
                case 'number':
                case 'tel':
                case 'email':
                    this.disabled = releseOpt;
                    break;
                case 'checkbox':
                case 'radio':
                    this.disabled = releseOpt;
                    break;
            }
        }
    });
}

function enableAllFormFields(opt) {
    try {
        document.loanModForm.REBrokerEmail.disabled = false;
    } catch (e) {
    }
    try {
        document.loanModForm.REBrokerCompany.disabled = false;
    } catch (e) {
    }

    try {
        document.loanModForm.REBrokerFirstName.disabled = false;
    } catch (e) {
    }
    try {
        document.loanModForm.REBrokerLastName.disabled = false;
    } catch (e) {
    }
    try {
        document.loanModForm.brokerPhone.disabled = false;
    } catch (e) {
    }
    try {
        document.loanModForm.bPhNo1.disabled = false;
    } catch (e) {
    }
    try {
        document.loanModForm.bPhNo2.disabled = false;
    } catch (e) {
    }
    try {
        document.loanModForm.bPhNo3.disabled = false;
    } catch (e) {
    }
    try {
        document.loanModForm.bExt.disabled = false;
    } catch (e) {
    }

    if (opt == 'DD') {
        try {
            document.loanModForm.REBrokerEmail.disabled = false;
        } catch (e) {
        }
    } else {
        try {
            document.loanModForm.LMRBroker.disabled = false;
        } catch (e) {
        }
    }

    jQuery(".agentInfoCls").each(function () {
        $(this).removeClass('disabledKeyFields');
    });

}

function disableAllFormFields(opt) {

    var brokerEmail = publicUser = "";
    try {
        publicUser = document.loanModForm.publicUser.value;
    } catch (e) {
    }
    try {
        brokerEmail = document.loanModForm.REBrokerEmail.value;
    } catch (e) {
    }
    brokerEmail = trim(brokerEmail);
    if (brokerEmail == "") {
    } else {
        try {
            document.loanModForm.brokerEmail.disabled = true;
        } catch (e) {
        }
        if (publicUser == 1) {
        } else {
            try {
                document.getElementById("btnSave").style.display = "none";
            } catch (e) {
            }
        }
    }
    try {
        document.loanModForm.REBrokerCompany.disabled = true;
    } catch (e) {
    }

    try {
        document.loanModForm.REBrokerFirstName.disabled = true;
    } catch (e) {
    }
    try {
        document.loanModForm.REBrokerLastName.disabled = true;
    } catch (e) {
    }
    try {
        document.loanModForm.brokerPhone.disabled = true;
    } catch (e) {
    }
    try {
        document.loanModForm.bPhNo1.disabled = true;
    } catch (e) {
    }
    try {
        document.loanModForm.bPhNo2.disabled = true;
    } catch (e) {
    }
    try {
        document.loanModForm.bPhNo3.disabled = true;
    } catch (e) {
    }
    try {
        document.loanModForm.bExt.disabled = true;
    } catch (e) {
    }

    if (opt == 'DD') {
        try {
            document.loanModForm.REBrokerEmail.disabled = true;
        } catch (e) {
        }
    } else {
        try {
            document.loanModForm.LMRBroker.disabled = true;
        } catch (e) {
        }
    }
    enableTabs(true);

    jQuery(".agentInfoCls").each(function () {
        $(this).addClass('disabledKeyFields');
    });

}

function enableTabs(enableOpt) {
    try {
        document.getElementById('overlayout').className = "";
    } catch (e) {
    }
}

/*
 *  Clear Broker / Agent Info.
 */
function clearHMLOBrokerInfoAsWebform(formName, opt) {
    try {
        eval("document." + formName + ".brokerNumber.value = 0");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".REBrokerCompany.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".REBrokerFirstName.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".REBrokerLastName.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".bPhNo1.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".bPhNo2.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".bPhNo3.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".bExt.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".brokerPhone.value = ''");
    } catch (e) {
    }
    enableAllFormFields(opt)
}

function clearHMLOLoanOfficerInfoAsWebform(formName, opt) {
    try {
        eval("document." + formName + ".loanofficerNumber.value = 0");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".RELoanofficerCompany.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".RELoanofficerFirstName.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".RELoanofficerLastName.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".bPhNo1.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".bPhNo2.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".bPhNo3.value = ''");
    } catch (e) {
    }
    try {
        eval("document." + formName + ".bExt.value = ''");
    } catch (e) {
    }

    try {
        eval("document." + formName + ".LoanofficerPhone.value = ''");
    } catch (e) {
    }
    enableAllFormFields(opt)
}

/**
 Description     : Fetch min Max Loan Amt and Max LTV for Loan Terms section in Loan Info Tab .
 Developer       : Viji, Venkatesh.
 Date            : Feb 06, 2018.
 **/
function getPCMinMaxLoanGuidelines(formName, PCID) {
    var loanPurpose = loanPgm = loanPgmDetailsBase64 = '';
    try {
        eval("loanPurpose = document." + formName + ".typeOfHMLOLoanRequesting.value");
    } catch (e) {
    }

    try {
        eval("loanPgm = document." + formName + ".LMRClientType.value");
    } catch (e) {
    }

    $.ajax({
        type: 'POST',
        url: siteSSLUrl + 'backoffice/getPCMinMaxLoanGuidelines.php',
        data: jQuery.param({'loanPgm': loanPgm, 'loanPurpose': loanPurpose, 'PCID': PCID}),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (myData) {
            var obj = $.parseJSON(myData);
            var maxLTV = obj.maxLTV;
            var minLoanAmount = obj.minLoanAmount;
            var maxLoanAmount = obj.maxLoanAmount;
            var maxARV = obj.maxLTVAfterRehab;
            var minRate = obj.minRate;
            var maxRate = obj.maxRate;
            var LGMaxLTC = obj.totalLTC;
            var LGMinMidfico = obj.minMidFico;
            var LGMaxMidfico = obj.maxMidFico;
            var LGMaxGround = obj.maxPropertyForGrndConst;
            var LGMinGround = obj.minPropertyForGrndConst;
            var LGMaxFixFlop = obj.maxPropertyForFixFlop;
            var LGMinFixFlop = obj.minPropertyForFixFlop;
            var LGMaxOrgPoints = obj.maxPoints;
            var LGMinOrgPoints = obj.minPoints;
            var LGDownPaymentPerc = obj.downPaymentPercentage;
            //var loanPgmDetails = obj.loanPgmDetails;
            var loanPgmDetailsBase64 = obj.loanPgmDetailsBase64;
            var reqForLoanProUnderwriting = obj.reqForLoanProUnderwriting;

            if (maxLTV > 0) {
                $('#LGMaxLTV').val(maxLTV);    // LG -> Means Loan Guidelines
            } else {
                $('#LGMaxLTV').val(0);
            }

            if (minLoanAmount > 0) {
                $('#LGMinLoanAmount').val(minLoanAmount);
            } else {
                $('#LGMinLoanAmount').val(0);
            }

            if (maxLoanAmount > 0) {
                $('#LGMaxLoanAmount').val(maxLoanAmount);
            } else {
                $('#LGMaxLoanAmount').val(0);
            }

            if (maxARV > 0) {
                $('#LGMaxARV').val(maxARV);
            } else {
                $('#LGMaxARV').val(0);
            }

            if (minRate > 0) {
                $('#minRate').val(minRate);
            } else {
                $('#minRate').val(0);
            }

            if (maxRate > 0) {
                $('#maxRate').val(maxRate);
            } else {
                $('#maxRate').val(0);
            }

            if (LGMaxLTC > 0) {
                $('#LGMaxLTC').val(LGMaxLTC);
            } else {
                $('#LGMaxLTC').val(0);
            }

            if (LGMinMidfico > 0) {
                $('#LGMinMidfico').val(LGMinMidfico);
            } else {
                $('#LGMinMidfico').val(0);
            }
            if (LGMaxMidfico > 0) {
                $('#LGMaxMidfico').val(LGMaxMidfico);
            } else {
                $('#LGMaxMidfico').val(0);
            }

            if (LGMinFixFlop > 0) {
                $('#LGMinFixFlop').val(LGMinFixFlop);
            } else {
                $('#LGMinFixFlop').val(0);
            }

            if (LGMaxFixFlop > 0) {
                $('#LGMaxFixFlop').val(LGMaxFixFlop);
            } else {
                $('#LGMaxFixFlop').val(0);
            }
            if (LGMinGround > 0) {
                $('#LGMinGround').val(LGMinGround);
            } else {
                $('#LGMinGround').val(0);
            }
            if (LGMaxGround > 0) {
                $('#LGMaxGround').val(LGMaxGround);
            } else {
                $('#LGMaxGround').val(0);
            }

            if (LGMaxOrgPoints > 0) {
                $('#LGMaxOrgPoints').val(LGMaxOrgPoints);
            } else {
                $('#LGMaxOrgPoints').val(0);
            }
            if (LGMinOrgPoints > 0) {
                $('#LGMinOrgPoints').val(LGMinOrgPoints);
            } else {
                $('#LGMinOrgPoints').val(0);
            }

            if (LGDownPaymentPerc > 0) {
                $('#LGDownPaymentPerc').val(LGDownPaymentPerc);
            } else {
                $('#LGDownPaymentPerc').val(0);
            }
            if (reqForLoanProUnderwriting != '') {
                try {
                    $('textarea#expectForDueDiligence').froalaEditor('html.set', nl2br(reqForLoanProUnderwriting));
                    $('textarea#expectForDueDiligence').froalaEditor('undo.saveStep');
                } catch (e) {
                }
            }
            if (typeof loanPgmDetailsBase64 === "undefined") {
                loanPgmDetailsBase64 = '';
            }
            if(loanPgmDetailsBase64 != '') {
                if($('#loanprogramtooltip').length > 0){
                    prg = window.atob(loanPgmDetailsBase64);
                    $('#loanprogramtooltip').show();
                    $('#loanprogramtooltip').attr('title', prg);
                    $('#loanprogramtooltip').attr('data-original-title', prg);
                }
            } else {
                if($('#loanprogramtooltip').length > 0) {
                    $('#loanprogramtooltip').hide();
                }
            }
            validateMinMaxLoanGuidelines();
        }
    });
}

function nl2br(str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function validateMinMaxLoanGuidelines(scrollingEnabled) {
    if (!scrollingEnabled) scrollingEnabled = 'no';
    var j = l = 0, msg = '';
    var inVal = 0;
    var maxLTV = minLoanAmount = maxLoanAmount = maxARV = minRate = maxRate = LGMaxLTC = 0;
    var chkAcquisitionLTV = ARV = inVal = chkTotalLoanAmount = LGMaxMidfico = LGMinMidfico = LGMaxGround = LGMinGround = chkGround = LGMaxFixFlop = LGMinFixFlop = LGMaxOrgPoints = LGMinOrgPoints = LGDownPaymentPerc = chkLoantoCost = 0;
    var loanPurpose = '';
    var publicUser = 0;
    var userRole = userGroup = '';
    var LMRInternalLoanGuidelines = LMRInternalLoanGuidelinesData = '';

    var maxLTV = $('#LGMaxLTV').val();
    var minLoanAmount = $('#LGMinLoanAmount').val();
    var maxLoanAmount = $('#LGMaxLoanAmount').val();
    var maxARV = $('#LGMaxARV').val();
    var minRate = $('#minRate').val();
    var maxRate = $('#maxRate').val();
    var LGMaxLTC = $('#LGMaxLTC').val();
    var LGMaxMidfico = $('#LGMaxMidfico').val();
    var LGMinMidfico = $('#LGMinMidfico').val();
    var LGMaxGround = $('#LGMaxGround').val();
    var LGMinGround = $('#LGMinGround').val();
    var LGMaxFixFlop = $('#LGMaxFixFlop').val();
    var LGMinFixFlop = $('#LGMinFixFlop').val();
    var LGMaxOrgPoints = $('#LGMaxOrgPoints').val();
    var LGMinOrgPoints = $('#LGMinOrgPoints').val();
    var LGDownPaymentPerc = $('#LGDownPaymentPerc').val();
    var activetab = $('#activetab').val();
    var userGroup = $('#userGroup').val();

    try {
        eval("publicUser = document.loanModForm.publicUser.value");
    } catch (e) {
    }
    try {
        eval("userRole = document.loanModForm.userRole.value");
    } catch (e) {
    }
    try {
        eval("chkAcquisitionLTV = document.getElementById('acquisitionLTV').innerHTML");
    } catch (e) {
    }
    try {
        eval("chkLoantoCost = document.getElementById('Loan-to-Cost').innerHTML");
    } catch (e) {
    }

    ARV = getTextValue('ARV');

    try {
        eval("loanPurpose = document.loanModForm.typeOfHMLOLoanRequesting.value");
    } catch (e) {
    }

    try {
        eval("inVal = document.loanModForm.lien1Rate.value");
    } catch (e) {
    }

    if (loanPurpose == 'Cash-Out / Refinance' || loanPurpose == 'Commercial Cash Out Refinance' || loanPurpose == 'Refinance') {
        try {
            eval("chkTotalLoanAmount = document.loanModForm.CORTotalLoanAmt.value");
        } catch (e) {
        }
        try {
            if ($('#coTotalAmt').length > 0) {
                chkTotalLoanAmount = $('#coTotalAmt').text();
            }
        } catch (e) {
        }
    } else if (loanPurpose == 'Line of Credit') {
        try {
            eval("chkTotalLoanAmount = document.loanModForm.LOCTotalLoanAmt.value");
        } catch (e) {
        }
    } else {
        try {
            eval("chkTotalLoanAmount    = document.getElementById('totalLoanAmount1').value");
        } catch (e) {
        }
    }
    var chkMidFico = $('#midFicoScore:enabled').val();
    if (chkMidFico == '') chkMidFico = 0;
    var chkFixflipProp = $('#borNoOfREPropertiesCompleted:enabled').val();
    if (chkFixflipProp == '') chkFixflipProp = 0;
    var chkGround = $('#borRehabPropCompleted:enabled').val();
    if (chkGround == '') chkGround = 0;
    var chkOrgPoints = $('#originationPointsRate:enabled').val();
    if (chkOrgPoints == '') chkOrgPoints = 0;
    var chkDownPaymentPerc = $('#downPaymentPercentage:enabled').val();
    if (chkDownPaymentPerc == '') chkDownPaymentPerc = 0;
    if (chkTotalLoanAmount == '') chkTotalLoanAmount = 0;
    if (chkAcquisitionLTV == '') chkAcquisitionLTV = 0;
    if (maxARV == '') maxARV = 0;
    if (chkLoantoCost == '') chkLoantoCost = 0;
    if (inVal == '' || isNaN(inVal)) inVal = 0;

    try {
        chkTotalLoanAmount = replaceCommaValues(chkTotalLoanAmount);
        chkAcquisitionLTV = replaceCommaValues(chkAcquisitionLTV);
        chkLoantoCost = replaceCommaValues(chkLoantoCost);
        ARV = replaceCommaValues(ARV);
    } catch (e) {
    }
    //inVal               = replaceCommaValues(inVal);
    var LMRInternalLoanGuidelines = $('#LMRInternalLoanGuidelines').val();
    if (typeof (LMRInternalLoanGuidelines) !== "undefined") {
        LMRInternalLoanGuidelinesData = jQuery.parseJSON(LMRInternalLoanGuidelines);
        //console.log(LMRInternalLoanGuidelinesData);
    }


    if (activetab != 'CI') {
        if (chkTotalLoanAmount > 0) {
            if (parseFloat(minLoanAmount) > 0 && parseFloat(chkTotalLoanAmount) < parseFloat(minLoanAmount)) {
                msg = '* Loan amount set in your guidelines are ' + convertInputToAbsoluteValueWithDollar(minLoanAmount) + ' and ' + convertInputToAbsoluteValueWithDollar(maxLoanAmount) + '. Current Loan Amount is ' + convertInputToAbsoluteValueWithDollar(chkTotalLoanAmount) + '.';
                j++;
            } else if (parseFloat(maxLoanAmount) > 0 && parseFloat(chkTotalLoanAmount) > parseFloat(maxLoanAmount)) {
                msg = '* Loan amount set in your guidelines are ' + convertInputToAbsoluteValueWithDollar(minLoanAmount) + ' and ' + convertInputToAbsoluteValueWithDollar(maxLoanAmount) + '. Current Loan Amount is ' + convertInputToAbsoluteValueWithDollar(chkTotalLoanAmount) + '.';
                j++;
            }
            if (j > 0) {
                msg += ' <br> ';
            }
            if (userGroup != '' && userGroup == 'Employee') {
                /* Internal Loan CustomGuidelines */
                $.each(LMRInternalLoanGuidelinesData, function (key, customData) {

                    minLoanAmount = customData.minLoanAmount;
                    maxLoanAmount = customData.maxLoanAmount;
                    internalService = ' [' + customData.serviceType + ']';

                    if (parseFloat(minLoanAmount) > 0 && parseFloat(chkTotalLoanAmount) < parseFloat(minLoanAmount)) {
                        if (key == 0) {
                            msg += '* Loan amount set in your guidelines are ' + convertInputToAbsoluteValueWithDollar(minLoanAmount) + ' and ' + convertInputToAbsoluteValueWithDollar(maxLoanAmount) + '. Current Loan Amount is ' + convertInputToAbsoluteValueWithDollar(chkTotalLoanAmount) + internalService + ', ';
                        } else {
                            msg += internalService + ', ';
                        }
                        j++;
                    } else if (parseFloat(maxLoanAmount) > 0 && parseFloat(chkTotalLoanAmount) > parseFloat(maxLoanAmount)) {
                        if (key == 0) {
                            msg += '* Loan amount set in your guidelines are ' + convertInputToAbsoluteValueWithDollar(minLoanAmount) + ' and ' + convertInputToAbsoluteValueWithDollar(maxLoanAmount) + '. Current Loan Amount is ' + convertInputToAbsoluteValueWithDollar(chkTotalLoanAmount) + internalService + ', ';
                        } else {
                            msg += internalService + ', ';
                        }
                        j++;
                    }
                });
                /*End OF Internal Loan CustomGuidelines */
            }
        }
        if (inVal > 0) {
            if ((parseFloat(minRate) > 0 && parseFloat(inVal) < parseFloat(minRate)) || (parseFloat(maxRate) > 0 && parseFloat(inVal) > parseFloat(maxRate))) {
                if (j > 0) {
                    msg += ' <br> ';
                }
                msg += '* Interest rate set in your guidelines are ' + minRate + ' and ' + maxRate + '. Current Interest rate is ' + inVal + '.';
                j++;
            }
            if (userGroup != '' && userGroup == 'Employee') {
                /* Internal Loan CustomGuidelines */
                $.each(LMRInternalLoanGuidelinesData, function (key, customData) {

                    minRate = customData.minRate;
                    maxRate = customData.maxRate;
                    internalService = ' [' + customData.serviceType + ']';

                    if ((parseFloat(minRate) > 0 && parseFloat(inVal) < parseFloat(minRate)) || (parseFloat(maxRate) > 0 && parseFloat(inVal) > parseFloat(maxRate))) {
                        if (key == 0) {
                            msg += "<br>";
                            msg += '* Interest rate set in your guidelines are ' + minRate + ' and ' + maxRate + '. Current Interest rate is ' + inVal + internalService + ', ';
                        } else {
                            msg += internalService + ', ';
                        }
                        j++;
                    }
                });
                /*End OF Internal Loan CustomGuidelines */
            }

        }

        if (parseFloat(chkOrgPoints) > 0) {
            if ((parseFloat(LGMinOrgPoints) > 0 && parseFloat(chkOrgPoints) < parseFloat(LGMinOrgPoints)) || (parseFloat(LGMaxOrgPoints) > 0 && parseFloat(chkOrgPoints) > parseFloat(LGMaxOrgPoints))) {
                if (j > 0) {
                    msg += ' <br> ';
                }
                msg += "* Origination points range set up in loan guidelines are " + LGMinOrgPoints + " and " + LGMaxOrgPoints + ". Current Origination points is " + chkOrgPoints + ".";
                j++;
            }

            if (userGroup != '' && userGroup == 'Employee') {
                /* Internal Loan CustomGuidelines */
                $.each(LMRInternalLoanGuidelinesData, function (org, customData) {

                    LGMinOrgPoints = customData.minPoints;
                    LGMaxOrgPoints = customData.maxPoints;
                    internalService = ' [' + customData.serviceType + ']';

                    if ((parseFloat(LGMinOrgPoints) > 0 && parseFloat(chkOrgPoints) < parseFloat(LGMinOrgPoints)) || (parseFloat(LGMaxOrgPoints) > 0 && parseFloat(chkOrgPoints) > parseFloat(LGMaxOrgPoints))) {
                        if (org == 1) {
                            msg += ' <br> ';
                            msg += "* Origination points range set up in loan guidelines are " + LGMinOrgPoints + " and " + LGMaxOrgPoints + ". Current Origination points is " + chkOrgPoints + internalService + ", ";
                        } else {
                            msg += internalService + ", ";
                        }
                        j++;
                    }

                });
                /*End OF Internal Loan CustomGuidelines */
            }
        }

        if (chkLoantoCost > 0) {
            if (parseFloat(LGMaxLTC) > 0 && parseFloat(chkLoantoCost) > parseFloat(LGMaxLTC) && parseFloat(chkLoantoCost) != parseFloat(LGMaxLTC)) {
                if (j > 0) {
                    msg += ' <br> ';
                }
                msg += "* Max Loan-to-Cost(LTC) set up in loan guide lines is " + LGMaxLTC + "% . Current Max Loan-to-Cost(LTC) is " + chkLoantoCost + "%.";
                j++;
            }
            if (userGroup != '' && userGroup == 'Employee') {
                /* Internal Loan CustomGuidelines */
                $.each(LMRInternalLoanGuidelinesData, function (ltc, customData) {

                    LGMaxLTC = customData.totalLTC;
                    internalService = ' [' + customData.serviceType + ']';

                    if (parseFloat(LGMaxLTC) > 0 && parseFloat(chkLoantoCost) > parseFloat(LGMaxLTC) && parseFloat(chkLoantoCost) != parseFloat(LGMaxLTC)) {
                        if (ltc == 1) {
                            msg += "<br>";
                            msg += "* Max Loan-to-Cost(LTC) set up in loan guide lines is " + LGMaxLTC + "% . Current Max Loan-to-Cost(LTC) is " + chkLoantoCost + internalService + ", ";
                        } else {
                            msg += internalService + ", ";
                        }

                        j++;
                    }

                });
                /*End OF Internal Loan CustomGuidelines */
            }

        }

        if (chkDownPaymentPerc > 0) {
            if (parseFloat(LGDownPaymentPerc) > 0 && parseFloat(chkDownPaymentPerc) < parseFloat(LGDownPaymentPerc)) {
                if (j > 0) {
                    msg += ' <br> ';
                }
                msg += "* Down Payment set up in loan guidelines is " + LGDownPaymentPerc + ". Current Down Payment is " + chkDownPaymentPerc + ".";
                j++;
            }

            if (userGroup != '' && userGroup == 'Employee') {
                /* Internal Loan CustomGuidelines */
                $.each(LMRInternalLoanGuidelinesData, function (key, customData) {

                    LGDownPaymentPerc = customData.downPaymentPercentage;
                    internalService = ' [' + customData.serviceType + ']';

                    if (parseFloat(LGDownPaymentPerc) > 0 && parseFloat(chkDownPaymentPerc) < parseFloat(LGDownPaymentPerc)) {
                        if (key == 0) {
                            msg += "<br>";
                            msg += "* Down Payment set up in loan guidelines is " + LGDownPaymentPerc + ". Current Down Payment is " + chkDownPaymentPerc + internalService + ", ";
                        } else {
                            msg += internalService + ", ";
                        }
                        j++;
                    }

                });
                /*End OF Internal Loan CustomGuidelines */
            }

        }

        if (loanPurpose == 'Purchase' || loanPurpose == 'New Construction - Existing Land' || loanPurpose == 'Commercial Purchase') {
            if (parseFloat(maxLTV) > 0 && parseFloat(chkAcquisitionLTV) > parseFloat(maxLTV) && parseFloat(chkAcquisitionLTV) != parseFloat(maxLTV)) {
                if (j > 0) {
                    msg += ' <br> ';
                }
                msg += "* LTV set up in loan guidelines is " + maxLTV + ". Current LTV is " + chkAcquisitionLTV + ".";
                j++;
            }

            if (parseFloat(maxARV) > 0 && parseFloat(ARV) > parseFloat(maxARV) && parseFloat(ARV) != parseFloat(maxARV)) {
                if (j > 0) {
                    msg += ' <br> ';
                }
                msg += " * ARV set up in loan guidelines is " + maxARV + ". Current ARV is " + ARV + ".";
                j++;
            }

            if (userGroup != '' && userGroup == 'Employee') {
                /* Internal Loan CustomGuidelines */
                $.each(LMRInternalLoanGuidelinesData, function (ltv, customData) {

                    maxLTV = customData.maxLTV;
                    maxARV = customData.maxLTVAfterRehab;
                    internalService = ' [' + customData.serviceType + ']';

                    if (parseFloat(maxLTV) > 0 && parseFloat(chkAcquisitionLTV) > parseFloat(maxLTV) && parseFloat(chkAcquisitionLTV) != parseFloat(maxLTV)) {
                        if (ltv == 1) {
                            msg += ' <br> ';
                            msg += "* LTV set up in loan guidelines is " + maxLTV + ". Current LTV is " + chkAcquisitionLTV + internalService + ", ";
                        } else {
                            msg += internalService + ", ";
                        }
                        j++;
                    }

                    if (parseFloat(maxARV) > 0 && parseFloat(ARV) > parseFloat(maxARV) && parseFloat(ARV) != parseFloat(maxARV)) {
                        if (ltv == 1) {
                            msg += '<br>';
                            msg += " * ARV set up in loan guidelines is " + maxARV + ". Current ARV is " + ARV + internalService + ", ";
                        } else {
                            msg += internalService + ", ";
                        }

                        j++;
                    }

                });
                /*End OF Internal Loan CustomGuidelines */
            }
        }

    }

    if (parseFloat(chkFixflipProp) > 0) {
        if ((parseFloat(LGMinFixFlop) > 0 && parseFloat(chkFixflipProp) < parseFloat(LGMinFixFlop)) || (parseFloat(LGMaxFixFlop) > 0 && parseFloat(chkFixflipProp) > parseFloat(LGMaxFixFlop))) {
            if (j > 0) {
                msg += ' <br> ';
            }
            msg += "* Fix and Flip construction experience set up in your guidelines are " + LGMinFixFlop + " and " + LGMaxFixFlop + ". Current Fix and Flip construction experience is " + chkFixflipProp + ".";
            j++;
        }
        if (userGroup != '' && userGroup == 'Employee') {
            /* Internal Loan CustomGuidelines */
            $.each(LMRInternalLoanGuidelinesData, function (key, customData) {

                LGMinFixFlop = customData.minPropertyForFixFlop;
                LGMaxFixFlop = customData.maxPropertyForFixFlop;
                internalService = ' [' + customData.serviceType + ']';

                if ((parseFloat(LGMinFixFlop) > 0 && parseFloat(chkFixflipProp) < parseFloat(LGMinFixFlop)) || (parseFloat(LGMaxFixFlop) > 0 && parseFloat(chkFixflipProp) > parseFloat(LGMaxFixFlop))) {
                    if (key == 0) {
                        msg += '<br>';
                        msg += "* Fix and Flip construction experience set up in your guidelines are " + LGMinFixFlop + " and " + LGMaxFixFlop + ". Current Fix and Flip construction experience is " + chkFixflipProp + internalService + ", ";
                    } else {
                        msg += internalService + ", ";
                    }
                    j++;
                }

            });
            /*End OF Internal Loan CustomGuidelines */
        }

    }

    if (parseFloat(chkGround) > 0) {
        if ((parseFloat(LGMinGround) > 0 && parseFloat(chkGround) < parseFloat(LGMinGround)) || (parseFloat(LGMaxGround) > 0 && parseFloat(chkGround) > parseFloat(LGMaxGround))) {
            if (j > 0) {
                msg += ' <br> ';
            }
            msg += "* Ground construction experience set in your guidelines are " + LGMinGround + " and " + LGMaxGround + ". Current Ground construction experience is " + chkGround + ".";
            j++;
        }

        if (userGroup != '' && userGroup == 'Employee') {
            /* Internal Loan CustomGuidelines */
            $.each(LMRInternalLoanGuidelinesData, function (key, customData) {

                LGMinGround = customData.minPropertyForGrndConst;
                LGMaxGround = customData.maxPropertyForGrndConst;
                internalService = ' [' + customData.serviceType + ']';

                if ((parseFloat(LGMinGround) > 0 && parseFloat(chkGround) < parseFloat(LGMinGround)) || (parseFloat(LGMaxGround) > 0 && parseFloat(chkGround) > parseFloat(LGMaxGround))) {
                    if (key == 0) {
                        msg += '<br>';
                        msg += "* Ground construction experience set in your guidelines are " + LGMinGround + " and " + LGMaxGround + ". Current Ground construction experience is " + chkGround + internalService + ", ";
                    } else {
                        msg += internalService + ", ";
                    }
                    j++;
                }

            });
            /*End OF Internal Loan CustomGuidelines */
        }

    }

    if (parseFloat(chkMidFico) > 0) {
        if ((parseFloat(LGMinMidfico) > 0 && parseFloat(chkMidFico) < parseFloat(LGMinMidfico)) || (parseFloat(LGMaxMidfico) > 0 && parseFloat(chkMidFico) > parseFloat(LGMaxMidfico))) {
            if (j > 0) {
                msg += ' <br> ';
            }
            msg += "* Mid FICO score set in your loan guidelines are " + LGMinMidfico + " and " + LGMaxMidfico + ". Current Mid FICO score is " + chkMidFico + ".";
            j++;
        }

        if (userGroup != '' && userGroup == 'Employee') {
            /* Internal Loan CustomGuidelines */
            $.each(LMRInternalLoanGuidelinesData, function (key, customData) {

                LGMinMidfico = customData.minMidFico;
                LGMaxMidfico = customData.maxMidFico;
                internalService = ' [' + customData.serviceType + ']';

                if ((parseFloat(LGMinMidfico) > 0 && parseFloat(chkMidFico) < parseFloat(LGMinMidfico)) || (parseFloat(LGMaxMidfico) > 0 && parseFloat(chkMidFico) > parseFloat(LGMaxMidfico))) {
                    if (key == 0) {
                        msg += '<br>';
                        msg += "* Mid FICO score set in your loan guidelines are " + LGMinMidfico + " and " + LGMaxMidfico + ". Current Mid FICO score is " + chkMidFico + internalService + ", ";
                    } else {
                        msg += internalService + ", ";
                    }
                    j++;
                }
            });
            /*End OF Internal Loan CustomGuidelines */
        }
    }


    if (j > 0) {
        if (publicUser == 1 && userRole == "Client") {
            $('#divGuidlinesErrorMsg').html();
            $('#divGuidlinesErrorMsg').html("<div class='text-on-pannel text-primary'>Guideline Warnings</div><h4 style='color: #ff0000 !important;' >" + msg + "</h4>");
            $('#divGuidlinesErrorMsg').show();

            if (scrollingEnabled == 'yes') {
                $('html,body').animate({
                        scrollTop: $("#divGuidlinesErrorMsg").offset().top - 45
                    },
                    'slow');
            }
            return true;

        } else {
            $('#divGuidlinesErrorMsg').html();
            $('#divGuidlinesErrorMsg').html("<div class='text-on-pannel text-primary'>Guideline Warnings</div><h4 style='color: #ff0000 !important;' >" + msg + "</h4>");
            $('#divGuidlinesErrorMsg').show();


            if (scrollingEnabled == 'yes') {
                $('html,body').animate({
                        scrollTop: $("#divGuidlinesErrorMsg").offset().top - 45
                    },
                    'slow');
            }
            return true;
        }
    } else {
        $('#divGuidlinesErrorMsg').hide();
        $("#allowFormSubmit").val(1);
        return true;
    }
}

function showGuidelinesDialogBox(msg) {
    $("#warning").dialog({
        title: '',
        autoOpen: true,
        closeOnEscape: false,
        draggable: false,
        width: 550,
        minHeight: 180,
        modal: true,
        buttons: {
            'Ignore & Save': function () {
                $("#isSave").val(1);
                $("#allowFormSubmit").val(1);
                document.getElementById("loanModForm").submit();
                $('#loanModForm input[type="submit"]').attr('disabled', 'disabled');
                $(this).dialog("close");
            },
            'Ignore/Save & Next': function () {
                $("#isSave").val(0);
                $("#allowFormSubmit").val(1);
                var goToTabLI = $('#goToTabLI').val();
                if (goToTabLI == '') {
                } else {
                    $('#goToTab').val(goToTabLI);
                }                                   /* Go to Tab from Loan Info */
                document.getElementById("loanModForm").submit();
                $('#loanModForm input[type="submit"]').attr('disabled', 'disabled');
                $(this).dialog("close");
            },
            'Close / Edit': function () {
                $(this).dialog("close");
                $('#loanModForm input[type="submit"]').removeAttr('disabled');
            }
        },
        resizable: false
    });
    $('#warning').html('<div class="pad5 talign-center">' + msg + '</div>');
    //$('.ui-dialog').css({top:'100px', position:'fixed'});
}

function showAndHideLandFields(val) {
    var loanPurpose = $('#typeOfHMLOLoanRequesting').val();
    if (val == 'CONS') {
        $('.landValueCls').css("display", "table-cell");
        $('.propertyNeedRehabinitialTddisp').css("display", "table-cell");
        $('.doesPropertyNeedRehabDispDiv').show();
        $("[name=propertyNeedRehab]").val(["Yes"]);
    } else {
        $('.landValueCls').css("display", "none");
        $('.propertyNeedRehabinitialTddisp').css("display", "none");
        $('.doesPropertyNeedRehabDispDiv').hide();
        $("[name=propertyNeedRehab]").val([""]);
    }

    if (loanPurpose == 'New Construction - Existing Land') $('.landValueCls').css("display", "table-cell");

    if (val == 'CONS' && (loanPurpose == 'Cash-Out / Refinance' || loanPurpose == 'Commercial Cash Out Refinance' || loanPurpose == 'Refinance')) {
        $('.landValueExtraCls').css("display", "table-cell");
    } else {
        $('.landValueExtraCls').css("display", "none");
    }

}

function showAndHideLandFieldsNew(val) {
    var ft = $('#ft').val();
    $('.HMLOLoanInfoSections').show();

    if (ft == 'loc') {
        $('.hideLOC').hide();
    }
    var wfOpt = $('#wfOpt').val();

    if ($('#propDetailsProcess').prop('disabled')) {
        $('.borrowerActiveSection').show();
    } else {
        var pDPro = $('#propDetailsProcess').val();
        if ((pDPro == 'Looking for General Info' || pDPro == 'Actively Looking For Property')) {
            $('.borrowerActiveSection').hide();
        } else {
            $('.borrowerActiveSection').show();
        }
    }

    var loanPurpose = '';
    if (val == 'CONS') {
        $('.landValueCls').css("display", "block");
        $('.propertyNeedRehabinitialTddisp').css("display", "block");
        $('.doesPropertyNeedRehabDispDiv').show();
        $("[name=propertyNeedRehab]").val(["Yes"]);
    } else {
        $('.landValueCls').css("display", "none");
        $('.propertyNeedRehabinitialTddisp').css("display", "none");
        $('.doesPropertyNeedRehabDispDiv').hide();
        $("[name=propertyNeedRehab]").val([""]);
    }

    hideBorrowerInfo = $('#hideBorrowerInfo').val();
    REBroker = $('#REBroker:checked').val();

    if (REBroker == 'Yes' && hideBorrowerInfo == 1 && wfOpt == 'aa4465703ef4b17e') {
        $('.borrowerInfoSection').hide();
    } else {
        $('.borrowerInfoSection').show();
    }

    try {
        eval("loanPurpose = document.loanModForm.typeOfHMLOLoanRequesting.value");
    } catch (e) {
    }

    if (val == 'CONS' && (loanPurpose == 'Cash-Out / Refinance' || loanPurpose == 'Commercial Cash Out Refinance' || loanPurpose == 'Refinance')) {
        $('.landValueExtraCls').css("display", "block");
    } else {
        $('.landValueExtraCls').css("display", "none");
    }

}

function hideAndShowAcceptPurchaseAgreement(fldValue, className) {
    if (fldValue == 'Yes') {
        $('.' + className).css("display", "block");
    } else {
        $('.' + className).css("display", "none");
    }
}

function showGuidelinesDialogBoxWF(msg) {
    $("#warningLG").dialog({
        title: '',
        autoOpen: true,
        closeOnEscape: false,
        draggable: false,
        width: 550,
        minHeight: 180,
        modal: true,
        buttons: {
            'Ignore/Save & Next': function () {
                $("#allowFormSubmit").val(1);
                //$('#loanModForm').trigger('submit');
                document.getElementById("loanModForm").submit();
                //$("#loanModForm").submit();
                $(this).dialog("close");
                //return true;
            },
            'Close / Edit': function () {
                $(this).dialog("close");
            }
        },
        resizable: false
    });
    $('#warningLG').html('<div class="pad5 talign-center">' + msg + '</div>');
    $('.ui-dialog').css({top: '100px', position: 'fixed'});
}

function populatePropertyDetails(val) {

    if (val == 'Looking for General Info' || val == 'Actively Looking For Property') {
        //$('.propAddress').hide();
        hideBorrowerInfo = $('#hideBorrowerInfo').val();
        REBroker = $('#REBroker:checked').val();
        if (REBroker == 'Yes' && hideBorrowerInfo == 1) $('.borrowerHideSection').hide();
        $('.borrowerActiveSection').hide();
    } else {
        hideBorrowerInfo = $('#hideBorrowerInfo').val();
        REBroker = $('#REBroker:checked').val();
        if (REBroker == 'Yes' && hideBorrowerInfo == 1) $('.borrowerHideSection').show();
        $('.borrowerActiveSection').show();
    }
}


/*
* Description   : Ins Impounds Calculation
* Function      : calculateInsImpoundsFee(formName, targetName)
* Formula       : Ins impounds Months * Ins Impounds Months Amt
* Developer     : Valarmathi
*/
function calculateInsImpoundsFee(formName, targetName) {

    var insImpoundsFee = 0;
    var insImpoundsMonth = 0;
    var insImpoundsMonthAmt = 0;

    eval("insImpoundsMonth      = document." + formName + ".insImpoundsMonth.value");
    eval("insImpoundsMonthAmt   = document." + formName + ".insImpoundsMonthAmt.value");

    try {
        insImpoundsMonth = replaceCommaValues(insImpoundsMonth);
        insImpoundsMonthAmt = replaceCommaValues(insImpoundsMonthAmt);
    } catch (e) {
    }

    if (insImpoundsMonth == "") insImpoundsMonth = 0;
    if (insImpoundsMonthAmt == "") insImpoundsMonthAmt = 0;

    insImpoundsFee = parseFloat(insImpoundsMonth) * parseFloat(insImpoundsMonthAmt);
    insImpoundsFee = autoNumericConverter(insImpoundsFee.toFixed(2));

    try {
        eval("document.getElementById('" + targetName + "').value = '" + insImpoundsFee + "'");
    } catch (e) {
    }

    if (formName != 'addBasicLoanTermForm') {
        calculateTotalFeesAndCost();
    }
}


function showAndHidePrePaymentPenalty(fldValue, idName) {
    if (fldValue == 'Yes') {

        $('.' + idName).show();
    }
    if (fldValue == 'No') {

        $('.' + idName).hide();
    }
}

/*
* Description   : Extension Option Calculation
* Function      : calculatePercentageExtensionOption(formName, targetName)
* Formula       : extensionOptionPercentage * totalLoanAmount / 100 * extensionOption
* Developer     : Berin
*/
function calculatePercentageExtensionOption(formName, targetName) {

    var extensionOptionPercentage = 0;
    var totalLoanAmount = 0;
    var extensionOption = 0;
    var extensionOptionsAmt = 0;

    extensionOptionPercentage = getFieldsValue('extensionOptionPercentage');
    totalLoanAmount = getFieldsValue('totalLoanAmount1');
    if (extensionOptionPercentage > 0) {

        extensionOptionsAmt = ((parseFloat(extensionOptionPercentage) * parseFloat(totalLoanAmount)) / 100);
        extensionOptionsAmt = autoNumericConverter(extensionOptionsAmt.toFixed(2));
    }
    try {
        eval("document.getElementById('" + targetName + "').innerHTML = '" + extensionOptionsAmt + "'");
    } catch (e) {
    }

}

function populateDualFieldForHMLONewLoan(val, formName, targetFld) {
    try {
        eval("document.getElementById('" + targetFld + "').innerHTML = val");
    } catch (e) {
    }
}

/*
* Description   : Hide and show sub sections
* Function      : hideAndShowSection(formName, targetName)
*/

function hideAndShowSection(inVal, acVal, trCls) {
    if (inVal == acVal) {
        $('.' + trCls).show();
        if (trCls == 'summonDateDiv') {
            $('.summonDate_disp').show();
            $('.summonDate_disp').removeClass('secHide');
            $('#summonDate').removeClass('secHide');
            $('#summonDate').removeAttr('disabled');
        }
        if (trCls == 'receiveOfferOnPropertyDiv') {
            $('.receiveOfferOnPropertyDiv').removeClass('secHide');
        }
        if (trCls == 'saleByOwnerDiv') {
            $('.saleByOwnerDiv').removeClass('secHide');
        }

    } else {
        $('.' + trCls).hide();
    }
    //only for PM Section
    /*if(trCls == 'pmSubjectMarketAreaExpl') {
        if(inVal == 'Yes') { // hide
            $('.pmRealEstatePropertyManagement_disp').hide();
        } else { // show
            $('.pmRealEstatePropertyManagement_disp').show();
        }
    }*/
}

function monthlyInterestRate(nper, pmt, pv, fv, type, guess) {  //alert(nper+'==='+pmt+'==='+pv);
    // Sets default values for missing parameters
    fv = typeof fv !== 'undefined' ? fv : 0;
    type = typeof type !== 'undefined' ? type : 0;
    guess = typeof guess !== 'undefined' ? guess : 0.1;
    var finalres = 0;
    if (nper == 0) {
        var res = ($('#loanTerm').val()).split(" ");
        nper = res[0];
    } else {
        var res = (nper).split(" ");
        nper = res[0];
    }
    if (pmt == 0) {
        try {
            pmt = -($('#lien1Payment').val()).replace(',', '');
        } catch (e) {
        }
    }
    if (pv == 0) pv = ($('#acquisitionPriceFinanced').html()).replace(',', ''); // alert(nper+'==='+pmt+'==='+pv);
    // Sets the limits for possible guesses to any
    // number between 0% and 100%
    var lowLimit = 0;
    var highLimit = 1;

    // Defines a tolerance of up to +/- 0.00005% of pmt, to accept
    // the solution as valid.
    var tolerance = Math.abs(0.00000005 * pmt);

    // Tries at most 40 times to find a solution within the tolerance.
    for (var i = 0; i < 40; i++) {
        // Resets the balance to the original pv.
        var balance = pv;

        // Calculates the balance at the end of the loan, based
        // on loan conditions.
        for (var j = 0; j < nper; j++) {
            if (type == 0) {
                // Interests applied before payment
                balance = balance * (1 + guess) + pmt;
            } else {
                // Payments applied before insterests
                balance = (balance + pmt) * (1 + guess);
            }
        }

        // Returns the guess if balance is within tolerance.  If not, adjusts
        // the limits and starts with a new guess.
        if (Math.abs(balance + fv) < tolerance) {  //var finalres = guess*12*100 ; alert(finalres);  alert(finalres.toFixed(2));
            finalres = ((guess * ($('#paymentFrequency').val()) * 100).toFixed(2));
            $('#InrBasedOnMonthlyPayment').val(finalres);
        } else if (balance + fv > 0) {
            // Sets a new highLimit knowing that
            // the current guess was too big.
            highLimit = guess;
        } else {
            // Sets a new lowLimit knowing that
            // the current guess was too small.
            lowLimit = guess;
        }

        // Calculates the new guess.
        guess = (highLimit + lowLimit) / 2;
    }

    // Returns null if no acceptable result was found after 40 tries.
    return 0;
};




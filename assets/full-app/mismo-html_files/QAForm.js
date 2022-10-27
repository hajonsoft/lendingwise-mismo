function validateQAInfo() {
    if (isDateOKForMMDDYY('loanModForm', 'noticeReceivedDate', 'Notice Received Date.') &&
        isDateOKForMMDDYY('loanModForm', 'summonDate', 'Summon Date.') &&
        isDateOKForMMDDYY('loanModForm', 'loanSalesDate', 'Loan Sales Date.') &&
        validateAmountAllowBlank('loanModForm', 'HAMPTier1Payment', 'Please enter HAMP Tier 1 P & I Payment') &&
        checkValidNumber('loanModForm', 'attorneyPhone1', 'Attorney / Trustee Phone Number') &&
        checkValidNumber('loanModForm', 'attorneyPhone2', 'Attorney / Trustee Phone Number') &&
        checkValidNumber('loanModForm', 'attorneyPhone3', 'Attorney / Trustee Phone Number') &&
        checkValidNumber('loanModForm', 'attorneyPhoneExt', 'Attorney / Trustee Phone Number') &&
        checkValidNumber('loanModForm', 'attorneyFax1', 'Attorney / Trustee Fax Number') &&
        checkValidNumber('loanModForm', 'attorneyFax2', 'Attorney / Trustee Fax Number') &&
        checkValidNumber('loanModForm', 'attorneyFax3', 'Attorney / Trustee Fax Number') &&
        checkValidNumber('loanModForm', 'attorneyCell1', 'Attorney / Trustee Cell Number') &&
        checkValidNumber('loanModForm', 'attorneyCell2', 'Attorney / Trustee Cell Number') &&
        checkValidNumber('loanModForm', 'attorneyCell3', 'Attorney / Trustee Cell Number') &&
        //           checkValidNumber('loanModForm', 'attorneyZip','Attorney Zip Code') &&
        //           checkValidNumber('loanModForm', 'indexNo','Index #') &&

        isDateOKForMMDDYY('loanModForm', 'appliedModificationDate', 'Applied Modification Date.') &&
        isDateOKForMMDDYY('loanModForm', 'receivedModificationDate', 'Received Modification Date.') &&
        checkValidNumber('loanModForm', 'howManyPermanentHAMP', 'How Many Permanent HAMP') &&

        validateAmountAllowBlank('loanModForm', 'listingPrice', 'Please Enter Correct Listing price.') &&
        isDateOKForMMDDYY('loanModForm', 'propertyListedDate', 'Property Listed Date.') &&
        checkValidNumber('loanModForm', 'OPAPhone1', 'Agent\'s Phone') &&
        checkValidNumber('loanModForm', 'OPAPhone2', 'Agent\'s Phone') &&
        checkValidNumber('loanModForm', 'OPAPhone3', 'Agent\'s Phone') &&
        checkValidNumber('loanModForm', 'OPAPhoneExt', 'Agent\'s Phone') &&
        isDateOKForMMDDYY('loanModForm', 'dateOfOffer', 'Date of offer.') &&
        validateAmountAllowBlank('loanModForm', 'amountOfOffer', 'Please Enter Correct Amount of Offer.') &&

        isDateOKForMMDDYY('loanModForm', 'bankruptcyFilingDate', 'Filing Date.') &&
        isDateOKForMMDDYY('loanModForm', 'bankruptcyDischargeDate', 'Date discharged.') &&

        validateAmountAllowBlank('loanModForm', 'monthlyRentAmt', 'Please Enter Correct Monthly Rent.') &&
        validateAmountAllowBlank('loanModForm', 'monthlyLastPaidAmt', 'Please Enter Correct Monthly Last Paid Amount.') &&
        isDateOKForMMDDYY('loanModForm', 'leaseExpiresDate', 'Date Lease Expires.') &&

        validateAmountAllowBlank('loanModForm', 'delinquentTaxAmount', 'Please Enter Correct Delinquent tax total.') &&
        isDateOKForMMDDYY('loanModForm', 'creditCounselStartedDate', 'obtained / started.') &&
        isDateOKForMMDDYY('loanModForm', 'creditCounselFinisheddDate', 'Date Finished.') &&
        checkValidNumber('loanModForm', 'creditCounselorPhone1', 'Counselor\'s Phone Number') &&
        checkValidNumber('loanModForm', 'creditCounselorPhone2', 'Counselor\'s Phone Number') &&
        checkValidNumber('loanModForm', 'creditCounselorPhone3', 'Counselor\'s Phone Number') &&
        checkValidNumber('loanModForm', 'creditCounselorPhoneExt', 'Counselor\'s Phone Number') &&

        checkValidNumber('loanModForm', 'HFAPhone1', 'State HFA Phone Number') &&
        checkValidNumber('loanModForm', 'HFAPhone2', 'State HFA Phone Number') &&
        checkValidNumber('loanModForm', 'HFAPhone3', 'State HFA Phone Number') &&
        checkValidNumber('loanModForm', 'HFAPhoneExt', 'State HFA Phone Number') &&

        checkValidNumber('loanModForm', 'noOfPeopleInProperty', 'No Of People In Property') &&
        checkValidNumber('loanModForm', 'noOfPeopleDependent', 'No Of People Dependent') &&
        checkValidNumber('loanModForm', 'yearsInProp', 'years In Property') &&

        validateAmountAllowBlank('loanModForm', 'appraisalListValue', 'Please Enter Correct List value.') &&
        checkValidNumber('loanModForm', 'insuranceCompPhone1', 'Insurance Co. Tel Number') &&
        checkValidNumber('loanModForm', 'insuranceCompPhone2', 'Insurance Co. Tel Number') &&
        checkValidNumber('loanModForm', 'insuranceCompPhone3', 'Insurance Co. Tel Number') &&
        checkValidNumber('loanModForm', 'insuranceCompPhoneExt', 'Insurance Co. Tel Number')
    ) {
        //   return true;
    } else {
        return false;
    }
    var propertyForRent = '', loanModType = '', monthlyLastPaidAmt = '', monthlyRentAmt = '', receiveModification = '';
    loanModType = document.loanModForm.loanModType.value;
    HAMPTier1Payment = document.loanModForm.HAMPTier1Payment.value;
    receiveModification = document.loanModForm.receiveModification.value;
    var rates = document.getElementsByName('receiveModification');
    for (var i = 0; i < rates.length; i++) {
        if (rates[i].checked) {
            receiveModification = rates[i].value;
        }
    }
    if (loanModType == '7' || loanModType == '8' || receiveModification == 'No' || receiveModification == 'NA') {
        return checkRent();
    } else {
        if (chkIsBlank('loanModForm', 'HAMPTier1Payment', 'Please enter HAMP Tier 1 P & I Payment') && checkRent()) {
            return true;
        } else {
            return false;
        }
    }
}

function checkRent() {
    var moreThanOneProperty = '', noOfMortgages = '', noOfProperties = '';
    moreThanOneProperty = document.loanModForm.moreThanOneProperty.value;
    noOfProperties = document.loanModForm.noOfProperties.value;
    noOfMortgages = document.loanModForm.noOfMortgages.value;
    var rates = document.getElementsByName('moreThanOneProperty');
    for (var i = 0; i < rates.length; i++) {
        if (rates[i].checked) {
            moreThanOneProperty = rates[i].value;
        }
    }
    if (moreThanOneProperty == 'Yes') {
        if (chkIsBlank('loanModForm', 'noOfProperties', 'How many properties') && chkIsBlank('loanModForm', 'noOfMortgages', 'How many mortgages')
        ) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

function checkDD() {
    var HAMPTier1Payment = '';
    HAMPTier1Payment = document.loanModForm.HAMPTier1Payment.value;
    if (chkIsBlank('loanModForm', 'HAMPTier1Payment', 'Please enter HAMP Tier 1 P & I Payment')
    ) {
        return true;
    } else {
        return false;
    }
}

function setRem(lmrId, taskOpt, opt, formName, clientName) {
    var msg = document.getElementById('setReminder').checked;
    if (msg == true) {
        var loanSalesDate = "";
        try {
            eval("loanSalesDate = document." + formName + ".loanSalesDate.value");
        } catch (e) {
        }
        if (loanSalesDate == '') {
            // alert("Enter the saledate");
            toastrNotification("Enter the saledate", 'error');
        } else {
            qstr = "LMRId=" + lmrId + "&taskOpt=" + taskOpt + "&opt=" + opt + "&loanSalesDate=" + loanSalesDate;
            $('#setReminderBtn').attr('data-id', qstr);
            $('#setReminderBtn').click();
            //clientName = htmlentities(clientName, "ENT_QUOTES");
            //eval("popupArray['"+POPSURL+"addTask.php'][1]	= 'File : "+clientName+" > Add Task'");
            //eval("ContactPop.showOverlay('"+POPSURL+"addTask.php')"); /** Open Popup **/
        }
    }
}

function alertToNumericValueForQA(currentvalue) {
    currentvalue1 = trim(currentvalue);
    currentvalue = replaceCommaValues(currentvalue);
    if ((currentvalue1 != "") && (currentvalue == "")) {
        //alert('Please make sure you have entered only numeric values in the fields');
        toastrNotification("Please make sure you have entered only numeric values in the fields", 'error');
        return false;
    } else if ((currentvalue1 > 0) && (currentvalue == 0)) {
        //alert('Please make sure you have entered only numeric values in the fields');
        toastrNotification("Please make sure you have entered only numeric values in the fields", 'error');
        return false;
    } else {
        return true;
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

function showAndHideQADiv(fldValue, divId) {

    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        if (divId == 'receiveNoticeDiv') {
            document.loanModForm.noticeReceivedDate.value = '';
            document.loanModForm.loanSalesDate.value = '';
        }
        if (divId == 'summonDateDiv' || (divId == 'receiveNoticeDiv' && fldValue != 'Yes')) {
            document.loanModForm.summonDate.value = '';
        }
        /*
            document.loanModForm.attorneyFirmName.value = '';
            document.loanModForm.attorneyName.value = '';
            document.loanModForm.attorneyEmail.value = '';
            document.loanModForm.attorneyPhone1.value = '';
            document.loanModForm.attorneyPhone2.value = '';
            document.loanModForm.attorneyPhone3.value = '';
            document.loanModForm.attorneyPhoneExt.value = '';
            document.loanModForm.attorneyFax1.value = '';
                try {
              document.loanModForm.attorneyFax2.value = "";
                } catch(e) {}
                try {
              document.loanModForm.attorneyFax3.value = "";
                } catch(e) {}
                try {
              document.loanModForm.attorneyNum.value = "";
                } catch(e) {}
                try {
              document.loanModForm.attorneyAddress.value = "";
                } catch(e) {}
                try {
              document.loanModForm.attorneyCity.value = "";
                } catch(e) {}
                try {
              document.loanModForm.trusteeState.value = "";
                } catch(e) {}
                try {
              document.loanModForm.attorneyZip.value = "";
                } catch(e) {}
                try {
              document.loanModForm.attorneyZip.value = "";
                } catch(e) {}
                try {
              document.loanModForm.jurisDiction.value = "";
                } catch(e) {}
                try {
              document.loanModForm.indexNo.value = "";
                } catch(e) {}
         */
    }
}

function showAndHideMortAssistance(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        try {
            document.loanModForm.repaymentOrMortAssistance.value = "No";
            document.getElementById('repaymentOrMortAssistance_chk_id').className = "switch-off";
        } catch (e) {
        }
        try {
            document.loanModForm.repaymentOrMortAssistanceDate.value = "";
        } catch (e) {
        }


    }
}

function showAndHideQADiv1(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        try {
            document.loanModForm.loanModType.value = "";
            document.loanModForm.HAMPTier1Payment.value = '';
            showAndHideHAMPTier1Payment('', 'HAMPTier1PaymentDiv');
            document.loanModForm.loanModPlanStanding.value = '0';
            document.getElementById('loanModPlanStandingDiv').className = "switch-off";
            document.loanModForm.repaymentOrMortAssistance.value = "No";
            document.getElementById('repaymentOrMortAssistance_chk_id').className = "switch-off";
            document.getElementById('repaymentOrMortAssistanceDiv').style.display = 'none';
        } catch (e) {
        }
        try {
            document.loanModForm.receiveModificationNotes.value = "";
            document.loanModForm.receivedModificationDate.value = "";
            document.loanModForm.repaymentOrMortAssistanceDate.value = "";
        } catch (e) {
        }


    }
}

function showAndHideAppliedModification(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        try {
            document.loanModForm.appliedModificationDate.value = "";
        } catch (e) {
        }


    }
}

function showAndHideQADiv2(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        try {
            document.loanModForm.howManyPermanentHAMP.value = "";
        } catch (e) {
        }

    }
}

function showAndHideQADiv3(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        try {
            document.loanModForm.appraisalListValue.value = "";
        } catch (e) {
        }
    }
}

function showAndHideQADiv4(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.saleForHowLong.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.listingPrice.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.propertyListedDate.value = "";
        } catch (e) {
        }
    }
}

function showAndHideQADiv5(fldName, divId) {
    eval("fldValue = document.loanModForm." + fldName + ".value");
    if (fldValue == 'Yes' || fldValue == '1') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
    }
}

function showAndHideQADiv6(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.repairExplanation.value = "";
        } catch (e) {
        }

    }
}

function showAndHideQADiv7(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        try {
            document.loanModForm.noOfProperties.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.noOfMortgages.value = "";
        } catch (e) {
        }

    }
}

function showAndHideQADiv8(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        try {
            document.loanModForm.creditCounselorName.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.creditCounselorPhone1.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.creditCounselorPhone2.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.creditCounselorPhone3.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.creditCounselorPhoneExt.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.creditCounselorAgency.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.creditCounselStartedDate.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.creditCounselFinisheddDate.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.creditCounselorEmail.value = "";
        } catch (e) {
        }
    }
}

function showAndHideQADiv9(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.delinquentTaxAmount.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.delinquentTaxYear.value = "";
        } catch (e) {
        }
        /*
                try {
              document.loanModForm.mortgageDelinquencyAmount.value = "";
                } catch(e) {}
                */


    }
}

/*
 * Bankruptcy DIV
*/
function showAndHideQADiv10(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        var len = 0;
        try {
            len = document.loanModForm.bankruptcyChapter.length;
        } catch (e) {
        }
        for (var i = 0; i < len; i++) {
            try {
                eval("document.loanModForm.bankruptcyChapter[" + i + "].checked = false");
            } catch (e) {
            }
        }
        try {
            document.loanModForm.isPaymentsPlanBehind.value = "No";
            document.getElementById('isPaymentsPlanBehind_chk_id').className = "switch-off";
        } catch (e) {
        }
        try {
            document.loanModForm.bankruptcyFilingDate.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.bankruptcyDispositionStatus.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.bankruptcyCaseNumb.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.bankruptcyDischargeDate.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.propertyIncludedBankruptcy.value = "No";
            document.getElementById('propertyIncludedBankruptcy_chk_id').className = "switch-off";
        } catch (e) {
        }
    }
}

function showAndHideQADiv11(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';

        try {
            document.loanModForm.serviceMemberOrder.value = "No";
            document.getElementById('serviceMemberOrder_chk_id').className = "switch-off";
        } catch (e) {
        }
    }
}

function showAndHideQADiv12(fldValue, divId) {
    if (fldValue == 'Yes' || fldValue == 'NA') {
        document.getElementById(divId).style.display = 'none';
    } else {
        document.getElementById(divId).style.display = 'block';
        try {
            document.loanModForm.saleByOwner.value = "No";
            document.getElementById('saleByOwner_chk_id').className = "switch-off";
        } catch (e) {
        }

        try {
            document.loanModForm.offerPropertyAgencyName.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.offerPropertyAgentName.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.OPAPhone1.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.OPAPhone2.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.OPAPhone3.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.OPAPhoneExt.value = "";
        } catch (e) {
        }
    }
}

function showAndHideQADiv13(fldValue, divId) {
    if (fldValue == 'Yes' || fldValue == '1') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        try {

//          document.loanModForm.receiveOfferOnProperty.value = "No";
//          document.getElementById('receiveOfferOnProperty_chk_id').className = "switch-off";

        } catch (e) {
        }
        try {
            document.loanModForm.dateOfOffer.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.amountOfOffer.value = "";
        } catch (e) {
        }
    }
}

function showAndHideQADiv14(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
        document.getElementById('occupiedBy').disabled = false;

    } else {
        document.getElementById(divId).style.display = 'none';
        document.getElementById('occupiedBy').disabled = true;
        try {
//          document.loanModForm.propertyForRent.value = "No";
//          document.getElementById('propertyForRent_chk_id').className = "switch-off";
        } catch (e) {
        }
        try {
            document.loanModForm.monthlyRentAmt.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.monthlyLastPaidAmt.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.leaseExpiresDate.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.leaseStartedDate.value = "";
        } catch (e) {
        }

    }
}

function showAndHideQADiv15(fldName, divId) {
    eval("fldValue = document.loanModForm." + fldName + ".value");
    if (fldValue == 'Yes' || fldValue == '1') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        try {
            document.loanModForm.isHomeownerServed.value = "No";
            document.getElementById('isHomeownerServed_chk_id').className = "switch-off";
        } catch (e) {
        }

        document.loanModForm.summonDate.value = '';
    }
}

function showAndHideQADiv16(fldValue, clsName) {
    //disable Ethnicity/Race/Sex/Veteran for furnish this information = No or N/A
    if (fldValue == 1 || fldValue == 3) {
        $("." + clsName).prop("checked", false);
        //empty other text fields
        $('#bFiEthnicitySubOther').val('');
        $('#bFiRaceAsianOther').val('');
        $('#bFiRacePacificOther').val('');
        $('#Asian, #Native, #Hispanic, #HispanicPrintOriginDiv, #AsianDiv, #PacificDiv').addClass('hidden');
    }
}

/* for co-borrower*/
function showAndHideQADivCB(fldValue, clsName) {
    //disable Ethnicity/Race/Sex/Veteran for furnish this information = No or N/A
    if (fldValue == 1 || fldValue == 3) {
        $("." + clsName).prop("checked", false);
        //empty other text fields
        $('#CBEthnicitySubOther').val('');
        $('#CBRaceAsianOther').val('');
        $('#CBRacePacificOther').val('');
        $('#CBAsian, #CBNative, #CBHispanic, #CBHispanicPrintOriginDiv, #CBAsianDiv, #CBPacificDiv').addClass('hidden');
    }
}

function showAndHideHAMPTier1Payment(fldVal, divId) {
    if (fldVal == '7' || fldVal == '8') {
        eval("document.getElementById('" + divId + "_1').style.display = 'none';");
        eval("document.getElementById('" + divId + "_2').style.display = 'none';");
//        document.getElementById(fldName).disabled = true; 
    } else {
        eval("document.getElementById('" + divId + "_1').style.display = 'block';");
        eval("document.getElementById('" + divId + "_2').style.display = 'block';");
    }
}

function hideIsPropForRent(fldValue) {
    if (fldValue == 'No' || fldValue == 'NA') {
        document.loanModForm.propertyForRent[2].checked = true;
        document.loanModForm.propertyForRent[1].disabled = true;
        document.loanModForm.propertyForRent[2].disabled = true;
        document.loanModForm.propertyForRent[0].disabled = true;
        document.getElementById('occupiedBy').disabled = true;
        document.getElementById('propertyForRentDiv').style.display = 'none';
        document.getElementById('monthlyRentAmt').value = '';
        document.getElementById('monthlyLastPaidAmt').value = '';
        document.getElementById('leaseExpiresDate').value = '';
        document.getElementById('occupiedBy').value = '';
    } else {
        document.loanModForm.propertyForRent[1].disabled = false;
        document.loanModForm.propertyForRent[2].disabled = false;
        document.loanModForm.propertyForRent[0].disabled = false;
    }
}

function showAndHideInsuranecDiv(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        try {
            document.loanModForm.delinquentInsuranceAmount.value = "";
        } catch (e) {
        }
    }
}

function validateQAInfo() {
    if (validateAmountAllowBlank('loanModForm', 'delinquentInsuranceAmount', 'Please Enter Correct Delinquent Insurance Total Amount.')

    ) {
        return true;
    } else {
        return false;
    }
}


/*
 * Intake Form DIV
*/
function showAndHideQAIntakeDiv(fldValue, divId, targetFld) {
    if (fldValue == 'YesRefi' || fldValue == 'YesMod' || fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        try {
            eval("document.loanModForm." + targetFld + ".value = ''");
        } catch (e) {
        }
    }
}

/*
 * Bankruptcy DIV
*/
function showAndHideQAIntakeBankruptcyDiv(fldValue, divId) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        var len = 0;
        try {
            len = document.loanModForm.bankruptcyChapter.length;
        } catch (e) {
        }
        for (var i = 0; i < len; i++) {
            try {
                eval("document.loanModForm.bankruptcyChapter[" + i + "].checked = false");
            } catch (e) {
            }
        }

        try {
            document.loanModForm.bankruptcyDispositionStatus.value = "";
        } catch (e) {
        }
        try {
            document.loanModForm.delinquentTaxAmount.value = "";
        } catch (e) {
        }

        var len1 = 0;
        try {
            len1 = document.loanModForm.delinquentOnPropTax.length;
        } catch (e) {
        }
        for (var i = 0; i < len1; i++) {
            try {
                eval("document.loanModForm.delinquentOnPropTax[" + i + "].checked = false");
            } catch (e) {
            }
        }

    }
}

function showAndHideReplyReceivedDateDiv(fldValue, divId, targetFld) {
    if (fldValue == 'Yes') {
        document.getElementById(divId).style.display = 'block';
    } else {
        document.getElementById(divId).style.display = 'none';
        try {
            eval("document.loanModForm." + targetFld + ".value = ''");
        } catch (e) {
        }
    }
}

function showAndHideZillowValue(fldValue, targetFld) { /* https://www.pivotaltracker.com/story/show/161583314 */

    if (fldValue == '' || fldValue == '1' || fldValue == '48' || fldValue == '4' || fldValue == '5' || fldValue == '12'
        || fldValue == '3' || fldValue == '64' || fldValue == '9' || fldValue == '6' || fldValue == '7'
        || fldValue == '8' || fldValue == '37' || fldValue == '65' || fldValue == '66' || fldValue == '67' || fldValue == '10' || fldValue == '93') {
        $('#' + targetFld).show();
    } else {
        $('#' + targetFld).hide();
    }
}

function showHidecondoEligibility(fldValue, targetFld) {
    if (fldValue == 4 || fldValue == 5 || fldValue == 48) {
        $('.'+targetFld).removeClass('d-none');
        $('.'+targetFld).css('display', '');
    } else {
        $('.'+targetFld).addClass('d-none');
        $('.'+targetFld).css('display', '');
    }
}

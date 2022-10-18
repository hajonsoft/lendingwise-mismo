/*function getMultiCheckValue(formName, sourceFldName,destinationFldName) {
	var fld  = "";
	var fldCnt = 0;
	var fldVal = "";
	var fldValues = "";
	var t = 0;
	var objLen = 0;
	try {
	    eval("objLen = document."+formName+ "." +sourceFldName+".length");
	} catch(e) {}
	if(objLen > 0) {
	    for(var i=0; i<objLen; i++) {
	        eval("fld = document."+formName+"."+sourceFldName+"["+i+"]" +".checked");
	        if(fld) {
		    eval("fldVal = document."+formName+"."+sourceFldName+"["+i+"]" +".value");
		    if(t == 0) {
		        fldValues = fldVal;
		    } else {
		        fldValues += ","+ fldVal;
		    }
		    t++;
	        }
	    }
	} else {
	    eval("var fld = document."+formName+"."+sourceFldName+".checked");
	    if(fld) {
	        eval("fldValues = document."+formName+"."+sourceFldName +".value");
	    }
	}
	try {
	    eval("document."+formName+ "." +destinationFldName+".value = fldValues");
	} catch(e) {}
    }*/
function getSelectedPKGID(newDocID) {
    var pkgCnt = 0, pkgId = '', j = 0;
    pkgCnt = document.loanModForm.pkgCnt.value;
    for (var i = 0; i < pkgCnt; i++) {
        var chk = false;
        try {
            eval("obj = document.loanModForm.pkg_" + i);
            chk = obj.checked;
        } catch (e) {
        }
        if (chk) {

            if (j > 0) {
                pkgId += ", ";
            }
            pkgId += obj.value;
            j++;

            /*
                        if (obj.value>395 || obj.value == 118 || obj.value == 370 || obj.value == 381 || obj.value == 288 || obj.value == 293 || obj.value == 332 || obj.value == 351 || obj.value == 361 ||
                            obj.value == 287 || obj.value == 127 || obj.value == 330 || obj.value == 179 || obj.value == 141 || obj.value == 376 ||
                            obj.value == 434 || obj.value == 435 || obj.value == 337 || obj.value == 338  || obj.value == 432 || obj.value == 490  || obj.value == 122 ||
                            obj.value == 111 || obj.value == 112 || obj.value == 113 || obj.value == 115  || obj.value == 116 || obj.value == 120 || obj.value == 130 || obj.value == 208 || obj.value == 147  || obj.value == 132  || obj.value == 207  || obj.value == 244  || obj.value == 245
                            ) {
                            if (j > 0) { pkgId += ", ";}
                            pkgId += obj.value;
                            j++;
                        } else {
                            alert("Sorry, Package not created.");
                            eval("document.loanModForm.pkg_"+i+".checked = false");
                            return false;
                        }
            */
        }
    }
    document.loanModForm.selectedPkg.value = pkgId;
}

function getSelectedAttachedPKGID(DocID) {
    var pkgCnt1 = 0, pkgId1 = '', n = 0;

    pkgCnt1 = document.loanModForm.attachChkPkgCnt.value;

    for (var m = 0; m < pkgCnt1; m++) {
        var chk1 = false;
        eval("obj = document.loanModForm.pkg1_" + m);
        chk1 = obj.checked;
        if (chk1) {
            if (n > 0) {
                pkgId1 += ", ";
            }
            pkgId1 += obj.value;
            n++;
            /*
                        if (obj.value>395 || obj.value == 118 || obj.value == 370 || obj.value == 381 || obj.value == 288 || obj.value == 293 || obj.value == 332 || obj.value == 351 || obj.value == 361 || obj.value == 287 || obj.value == 127 || obj.value == 179 || obj.value == 141 || obj.value == 376 ||
                            obj.value == 434 || obj.value == 435 || obj.value == 337 || obj.value == 338  || obj.value == 432 || obj.value == 490  || obj.value == 122 ||
                            obj.value == 111 || obj.value == 112 || obj.value == 113 || obj.value == 115  || obj.value == 116 || obj.value == 120 || obj.value == 130 || obj.value == 208 || obj.value == 147  || obj.value == 132  || obj.value == 207  || obj.value == 244  || obj.value == 245
                            ) {
                            if (n > 0) { pkgId1 += ", ";}
                            pkgId1 += obj.value;
                            n++;
                        } else {
                            alert("Sorry, Package not created.");
                            eval("document.loanModForm.pkg1_"+m+".checked = false");
                            return false;
                        }
            */
        }
    }
    document.loanModForm.selectedAttachedPkg.value = pkgId1;
}

/* Creditor Docs */

function getCreditorEsignPKGID(x, chkAction, pkgValue, CRID, LMRId) {
    var pkgCnt = 0, pkgId = '', j = 0;
    pkgCnt = document.loanModForm.pkgCnt.value;
    var s = 0, i = 0, crPkgId = '';
    eval("obj = document.getElementsByName('creditorPKG[]')");
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].checked) {
            if (s > 0) {
                crPkgId += ", ";
            }
            crPkgId += obj[i].value;
            s++;
        }
    }
    if (i == 0) {
        eval("obj = document.getElementsByName('creditorPKG[]')");
        if (obj.checked) {
            crPkgId = obj.value;
        }
    }
    document.loanModForm.creditorEsignPkg.value = crPkgId;

    var msg = '', pkgEsigned = 0;
    if (chkAction) {
        var url = "../backoffice/checkPkgEsigned.php";
        var qstr1 = "pkgValue=" + pkgValue + "&LMRId=" + LMRId + "&CRID=" + CRID;
        try {
            xmlDoc = getXMLDoc(url, qstr1);
        } catch (e) {
        }
        try {
            pkgEsigned = xmlDoc.getElementsByTagName("pkgEsigned")[0].firstChild.nodeValue;
        } catch (e) {
        }
        try {
            msg = xmlDoc.getElementsByTagName("msg")[0].firstChild.nodeValue;
        } catch (e) {
        }
        if (pkgEsigned == 1) {
            $.confirm({
                icon: 'flaticon-file icon-2x text-danger',
                closeIcon: true,
                title: 'Confirm',
                content: msg,
                type: 'red',
                backgroundDismiss: false,
                buttons: {
                    yes: {
                        btnClass: 'btn-green',
                        action: function () {

                        }
                    },
                    cancel: {
                        text: 'No',
                        action: function () {
                            x.checked = false;
                            getCreditorEsignPKGID(false, pkgValue, CRID, LMRId);
                        }
                    },
                }
            });


            /*   $("#warning").dialog({
                   title: 'Session Expiration Warning',
                   autoOpen: true,
                   closeOnEscape: false,
                   draggable: false,
                   width: 460,
                   minHeight: 50,
                   modal: true, buttons: {
                       Yes: function () {
                           $(this).dialog("close");
                       },
                       No: function () {
                           x.checked = false;
                           getCreditorEsignPKGID(false, pkgValue, CRID, LMRId);
                           $('#warning').dialog("close");
                       },
                   },
                   resizable: false
               });
               $('#warning').html(msg);*/
        }
    }
}


function getCreditorAttachedPKGID(chk) {
    var pkgCnt = 0, pkgId = '', j = 0;
    pkgCnt = document.loanModForm.pkgCnt.value;
    var k = 0, a = 0, crePkgId = '';
    eval("obj = document.getElementsByName('creditorAttachPKG[]')");
    for (var a = 0; a < obj.length; a++) {
        if (obj[a].checked) {
            if (k > 0) {
                crePkgId += ", ";
            }
            crePkgId += obj[a].value;
            k++;
        }
    }
    if (a == 0) {
        eval("obj = document.getElementsByName('creditorAttachPKG[]')");
        if (obj.checked) {
            crePkgId = obj.value;
        }
    }
    document.loanModForm.creditorAttachedPkg.value = crePkgId;
}


/*
 * Get selected branch docs id
 */
function getBranchSelectedPKGID(newDocID, fileSize, checkVal) {
    if (GetFileSizeDoc(fileSize, checkVal)) {
        var branchDocCnt = 0, j = 0, i = 0, bPkgId = '';
        eval("obj = document.getElementsByName('branchDoc[]')");

        for (var i = 0; i < obj.length; i++) {

            if (obj[i].checked) {
                if (j > 0) {
                    bPkgId += ", ";
                }
                bPkgId += obj[i].value;
                j++;
            }
        }
        if (i == 0) {
            eval("obj = document.getElementsByName('branchDoc[]')");
            if (obj.checked) {
                bPkgId = obj.value;
            }
        }
        document.loanModForm.branchSelectedPkg.value = bPkgId;
    } else {
        return false;
    }
}

/*
 * Get selected PC docs id
 */
function getPCSelectedPKGID(newDocID, fileSize, checkVal) {
    if (GetFileSizeDoc(fileSize, checkVal)) {
        var PCDocCnt = 0, j = 0, i = 0, pcPkgId = '';
        eval("obj = document.getElementsByName('PCDoc[]')");

        for (var i = 0; i < obj.length; i++) {

            if (obj[i].checked) {
                if (j > 0) {
                    pcPkgId += ", ";
                }
                pcPkgId += obj[i].value;
                j++;
            }
        }
        if (i == 0) {
            eval("obj = document.getElementsByName('PCDoc[]')");
            if (obj.checked) {
                pcPkgId = obj.value;
            }
        }
        document.loanModForm.PCSelectedPkg.value = pcPkgId;
    } else {
        return false;
    }
}

function getEsignSelectedPKGID(newDocId, fileSize, checkVal) {
    if (GetFileSizeDoc(fileSize, checkVal)) {
        var eSignDocCnt = 0, j = 0, i = 0, ePkgId = '';
        eval("obj = document.getElementsByName('esignDoc[]')");

        for (var k = 0; k < obj.length; k++) {

            if (obj[k].checked) {
                if (j > 0) {
                    ePkgId += ", ";
                }
                ePkgId += obj[k].value;
                j++;
            }
        }
        if (k == 0) {
            eval("obj = document.getElementsByName('esignDoc[]')");
            if (obj.checked) {
                ePkgId = obj.value;
            }
        }
        document.loanModForm.esignSelectedPkg.value = ePkgId;
    } else {
        return false;
    }
}

function getCustomSelectedPKGID(newDocId) {

    var s = 0, l = 0, cPkgId = '';
    eval("obj = document.getElementsByName('customDoc[]')");

    for (var l = 0; l < obj.length; l++) {

        if (obj[l].checked) {
            if (s > 0) {
                cPkgId += ", ";
            }
            cPkgId += obj[l].value;
            s++;
        }
    }
    if (l == 0) {
        eval("obj = document.getElementsByName('customDoc[]')");

        if (obj.checked) {
            cPkgId = obj.value;
        }
    }
    document.loanModForm.customSelectedPkg.value = cPkgId;
}

function getCustomWordSelectedPKGID(newDocId) {

    var s = 0, l = 0, cPkgId = '';
    eval("obj = document.getElementsByName('customWordDoc[]')");

    for (var l = 0; l < obj.length; l++) {

        if (obj[l].checked) {
            if (s > 0) {
                cPkgId += ", ";
            }
            cPkgId += obj[l].value;
            s++;
        }
    }
    if (l == 0) {
        eval("obj = document.getElementsByName('customWordDoc[]')");

        if (obj.checked) {
            cPkgId = obj.value;
        }
    }
    document.loanModForm.customWordSelectedPkg.value = cPkgId;
}

function GetFileSizeDoc_del(fileSize, checkVal) {
    var totalFileSize = 0, tot = 0, fileSizeDisplay = '', fileSizeAllowed = 0;

    totalFileSize = document.loanModForm.totFileSize.value;
    fileSizeDisplay = document.loanModForm.fileSize.value;
    fileSizeAllowed = document.loanModForm.max_upload_size.value;

    if (checkVal) {
        tot = parseFloat(totalFileSize) + parseFloat(fileSize);
    } else {
        tot = parseFloat(totalFileSize) - parseFloat(fileSize);
    }

    if (tot < fileSizeAllowed) {
        document.loanModForm.totFileSize.value = tot;
        return true;
    } else {
        //alert("File Size is too large. Allowed file size is "+fileSizeDisplay+".");
        toastrNotification("File Size is too large. Allowed file size is " + fileSizeDisplay + ".", 'error');
        return true;
    }
}

function GetFileSizeDoc(fileSize, checkVal) {
    var totalFileSize = 0, tot = 0;

    totalFileSize = document.loanModForm.totFileSize.value;

    if (checkVal) {
        tot = parseFloat(totalFileSize) + parseFloat(fileSize);
    } else {
        tot = parseFloat(totalFileSize) - parseFloat(fileSize);
    }

    document.loanModForm.totFileSize.value = tot;
    return true;
}

function getSelectedUpDoc(newDocId, fileSize, checkVal) {
    if (GetFileSizeDoc(fileSize, checkVal)) {
        var s = 0, d = 0, upDocId = '';
        eval("obj = document.getElementsByName('upDoc[]')");

        for (var s = 0; s < obj.length; s++) {

            if (obj[s].checked) {
                if (d > 0) {
                    upDocId += ", ";
                }
                upDocId += obj[s].value;
                d++;
            }
        }
        if (s == 0) {
            eval("obj = document.getElementsByName('upDoc[]')");

            if (obj.checked) {
                upDocId = obj.value;
            }
        }
        document.loanModForm.selectedUpDoc.value = upDocId;
    } else {
        return false;
    }

}


function getBinderSelectedPKGID(newDocId, fileSize, checkVal) {
    if (GetFileSizeDoc(fileSize, checkVal)) {
        var eSignDocCnt = 0, j = 0, h = 0, biPkgId = '';
        eval("obj = document.getElementsByName('binderDoc[]')");

        for (var h = 0; h < obj.length; h++) {

            if (obj[h].checked) {
                if (j > 0) {
                    biPkgId += ", ";
                }
                biPkgId += obj[h].value;
                j++;
            }
        }
        if (h == 0) {
            eval("obj = document.getElementsByName('binderDoc[]')");
            if (obj.checked) {
                biPkgId = obj.value;
            }
        }
        document.loanModForm.binderSelectedPkg.value = biPkgId;
    } else {
        return false;
    }
}

function checkIfESigned(chkAction, pkgValue, pkgID, LMRId) {
    var msg = '', pkgEsigned = 0;

    if (chkAction) {
        var url = "../backoffice/checkPkgEsigned.php";
        var qstr1 = "pkgValue=" + pkgValue + "&LMRId=" + LMRId;
        try {
            xmlDoc = getXMLDoc(url, qstr1);
        } catch (e) {
        }
        try {
            pkgEsigned = xmlDoc.getElementsByTagName("pkgEsigned")[0].firstChild.nodeValue;
        } catch (e) {
        }
        try {
            msg = xmlDoc.getElementsByTagName("msg")[0].firstChild.nodeValue;
        } catch (e) {
        }
        if (pkgEsigned == 1) {
            $.confirm({
                icon: 'flaticon-file icon-2x text-danger',
                closeIcon: true,
                title: 'Confirm',
                content: msg,
                type: 'red',
                backgroundDismiss: false,
                buttons: {
                    yes: {
                        btnClass: 'btn-green',
                        action: function () {

                        }
                    },
                    cancel: {
                        text: 'No',
                        action: function () {
                            cancelDocSend(pkgID);
                        }
                    },
                }
            });

        }
    }
}

function cancelDocSend(pkgValueId) {
    var PKGID = 0;
    eval("document.loanModForm." + pkgValueId + ".checked = false");
    eval("var PKGID = document.loanModForm." + pkgValueId + ".value");
    getSelectedPKGID(PKGID);
   // $('#warning').dialog("close");
}

function resendEsignLink(txnID, LMRId, selPKGID, packageName) {
    var encryptedPCID = '', encryptedEId = '';

    if (confirm("Would you like to resend the link for the \"" + packageName + "\" document?")) {

        encryptedPCID = document.loanModForm.encryptedPCID.value;
        encryptedEId = document.loanModForm.encryptedEId.value;

        qstr = 'LMRId=' + LMRId + '&resendTxnID=' + txnID + '&PCID=' + encryptedPCID + '&executiveId=' + encryptedEId + '&selRPKGID=' + selPKGID + '&faxPop=0';

        eval("ContactPop.showOverlay('" + POPSURL + "docsSend.php')"); /** Open Popup **/
    }


}

/*
   function getAllPackagesToEmail() {

    var AEUserType = "",selPKGID = 0,selBPKGID = 0,selCPKGID = 0,selBinPKGID = 0,selUpDocID = 0,selTxnID =0,resendTxnID =0;
    var branchChk = "", brokerChk = "", borrowerChk = "";
    var coBorrowerChk = "", REBrokerEmail = "", lenderEmail1Chk = "", lenderEmail2Chk = "", nonBorrowerChk ="";
    var pkg_lender1 = "", pkg_lender2 = "", pkg_REBroker = "";
    var pkg_lien1Bank1RepName = "", pkg_lien2Bank1RepName = "", faxPop = ''; buyer1Chk = false; buyer2Chk = false;
    var faxReceiverNo = "", docRecipientEmail = "", pkg_emp = "", ee = 0,empCnt = 0, empDoc = '', counselAttorneyChk = '';
    var selCWPKGID = 0;

    var checked = $("#docsName input:checked").length > 0;
    if (!checked){
    	toastrNotification("Please select any recipient", 'error');
        return false;
    }else {
        return true;
    }

    try {
        faxPop = document.docsName.faxPop.value;
    } catch(e) {}

    if (faxPop == 1) {
	    try {
		branchChk = document.docsName.branchFax.checked;
	    } catch(e) {}
	    try {
		brokerChk = document.docsName.brokerFax.checked;
	    } catch(e) {}
	    try {
		borrowerChk = document.docsName.borFax.checked;
	    } catch(e) {}
	    try {
		coBorrowerChk = document.docsName.coBorFax.checked;
	    } catch(e) {}
	    try {
			counselAttorneyChk = document.docsName.counselAttorneyFax.checked;
	    } catch(e) {}

    } else {
	    try {
		branchChk = document.docsName.executiveEmail.checked;
	    } catch(e) {}
	    try {
		brokerChk = document.docsName.brokerEmail.checked;
	    } catch(e) {}
	    try {
		borrowerChk = document.docsName.borrowerEmail.checked;
	    } catch(e) {}
	    try {
		coBorrowerChk = document.docsName.coBorrowerEmail.checked;
	    } catch(e) {}
	    try {
		lenderEmail1Chk = document.docsName.lenderEmail1.checked;
	    } catch(e) {}
	    try {
		lenderEmail2Chk = document.docsName.lenderEmail2.checked;
	    } catch(e) {}
	    try {
			counselAttorneyChk = document.docsName.counselEmail.checked;
	    } catch(e) {}
    }
    try {
        REBrokerEmail = document.docsName.REBrokerEmail.checked;
    } catch(e) {}
    try {
        pkg_lender1 = document.docsName.lien1LenderFax.checked;
    } catch(e) {}
    try {
        pkg_lender2 = document.docsName.lien2LenderFax.checked;
    } catch(e) {}
    try {
        pkg_lien1Bank1RepName = document.docsName.lien1Bank1RepFax.checked;
    } catch(e) {}
    try {
        pkg_lien2Bank1RepName = document.docsName.lien2Bank1RepFax.checked;
    } catch(e) {}
    try {
        docRecipientEmail = document.docsName.docRecipientEmail.value;
    } catch(e) {}
    try {
        faxReceiverNo = document.docsName.faxReceiverNo.value;
    } catch(e) {}
	try {
	nonBorrowerChk = document.docsName.nonBorrowerEmail.checked;
	} catch(e) {}

	try {
	payeeChk = document.docsName.payeeEmail.checked;
	} catch(e) {}

	try {
	buyer1Chk = document.docsName.firstBuyerEmail.checked;
	} catch(e) {}

	try {
	buyer2Chk = document.docsName.secondBuyerEmail.checked;
	} catch(e) {}

    try {
        empCnt = document.docsName.empCnt.value;
    } catch(e) {}

       try {
           eval("docLen = document.docsName['employeeId[]']");
           empDocLen = docLen.length;
       } catch(e) {}
       if(empDocLen >0) {
           for(var j1=0; j1<docLen.length; j1++) {
   	       if(docLen[j1].checked) {
   	           empDoc++;
	       }
	   }
       } else {
	   try {
	       chk = docLen.checked;
	   } catch(e) {}
	   if(chk) {
	       empDoc++;
	   }
       }
    // if((!branchChk) && (!brokerChk) && (!borrowerChk) && (!coBorrowerChk) && (!counselAttorneyChk) && (!lenderEmail1Chk) && (!lenderEmail2Chk) && (!pkg_lender1) && (!pkg_lender2)&& (!REBrokerEmail)
    //     && (!pkg_lien1Bank1RepName) && (!pkg_lien2Bank1RepName) && ((empDoc == 0) || (empDoc == ""))
    //     && ((faxReceiverNo == 0) || (faxReceiverNo == ""))
    //     && (docRecipientEmail == "") && (!nonBorrowerChk) && (!payeeChk) && (!buyer1Chk) && (!buyer2Chk)
    //   ) {
    //     //alert("Please select any recipient");
    // 	toastrNotification("Please select any recipient", 'error');
    //     return false;
    // } else {
    //     return true;
    // }
  }*/
function getAllPackages(opt) {
    if (!opt) opt = '';
    var AEUserType = "", pkgCnt = 0, empCnt = 0, pkg = 0, pkg1 = 0, selectedPkg = "", selectedAttPkg = '';
    pkg_lien1 = false;
    var docCnt = 0, dd = 0, selectedDoc = "", chkLienOpt = false, pkg_profit = false;
    var branchDoc = 0, branchDocLen = 0, docVal = "", docValues = "", doc1 = 0, ePkgCnt = 0;
    var epkg = 0, eselectedPkg = "";
    var docValues2 = "", userDocLen = 0, doc3 = 0;
    var docValues3 = "", custDocLen = 0, doc5 = 0;
    creditorDoc = '';
    var docValues4 = "", eCustDocLen = 0, doc7 = 0, eDocLen = 0, upDocLen = 0, brDocLen = 0, binderDocLen = 0,
        cusDocLen = 0, PCDocLen = 0;
    var binderDocLen = "", docLen = "", chk = "", binDoc = 0, cusDoc = '', upDoc = '', eDoc = '', brDoc = '',
        PCDocCnt = 0, PCDoc = '', creditorsDoc = '';

    try {
        branchDocCnt = document.loanModForm.branchDocCnt.value;
        branchDocCnt = parseFloat(branchDocCnt);
    } catch (e) {
    }
    try {
        pkgCnt = document.loanModForm.pkgCnt.value;
        pkgCnt = parseFloat(pkgCnt);
    } catch (e) {
    }

    try {
        binderCnt = document.loanModForm.binderCnt.value;
        binderCnt = parseFloat(binderCnt);
    } catch (e) {
    }

    try {
        epkgCnt = document.loanModForm.epkgCnt.value;
        epkgCnt = parseFloat(epkgCnt);
    } catch (e) {
    }
    try {
        esignCnt = document.loanModForm.esignCnt.value;
        esignCnt = parseFloat(esignCnt);
    } catch (e) {
    }

    try {
        custDocCnt = document.loanModForm.custDocCnt.value;
        custDocCnt = parseFloat(custDocCnt);
    } catch (e) {
    }

    try {
        faxPkgCnt = document.loanModForm.faxPkgCnt.value;
        faxPkgCnt = parseFloat(faxPkgCnt);
    } catch (e) {
    }
    try {
        PCDocCnt = document.loanModForm.PCDocCnt.value;
        PCDocCnt = parseFloat(PCDocCnt);
    } catch (e) {
    }


    for (var p = 0; p < pkgCnt; p++) {
        var chk = false, pkgId = 0, pkg_title = "";
        try {
            eval("chk = document.loanModForm.pkg_" + p + ".checked");
        } catch (e) {
        }
        if (chk) {
            try {
                eval("pkgId = document.loanModForm.pkg_" + p + ".value");
            } catch (e) {
            }
            try {
                eval("pkg_title = document.loanModForm.pkg_" + p + ".title");
            } catch (e) {
            }
            if (pkg > 0) {
                selectedPkg += ",";
            }
            selectedPkg += pkgId;
            pkg++;
        }
    }


    for (var p = 0; p < pkgCnt; p++) {
        var chk = false, pkgId1 = 0, pkg_title = "";
        try {
            eval("chk = document.loanModForm.pkg1_" + p + ".checked");
        } catch (e) {
        }
        if (chk) {
            try {
                eval("pkgId1 = document.loanModForm.pkg1_" + p + ".value");
            } catch (e) {
            }
            if (pkg > 0) {
                selectedAttPkg += ",";
            }
            selectedAttPkg += pkgId1;
            pkg++;
        }
    }


    try {
        eval("docLen1 = document.loanModForm['customDoc[]']");
        cusDocLen = docLen1.length;
    } catch (e) {
    }
    if (cusDocLen > 0) {
        for (var j1 = 0; j1 < docLen1.length; j1++) {
            if (docLen1[j1].checked) {
                cusDoc++;
            }
        }
    } else {
        try {
            chk = docLen1.checked;
        } catch (e) {
        }
        if (chk) {
            cusDoc++;
        }
    }
    var docLen11, cusWordDocLen = 0, cusWordDoc = 0;
    try {
        eval("docLen11 = document.loanModForm['customWordDoc[]']");
        cusWordDocLen = docLen11.length;
    } catch (e) {
    }
    if (cusWordDocLen > 0) {
        for (var j1 = 0; j1 < docLen11.length; j1++) {
            if (docLen11[j1].checked) {
                cusWordDoc++;
            }
        }
    } else {
        try {
            chk = docLen11.checked;
        } catch (e) {
        }
        if (chk) {
            cusWordDoc++;
        }
    }
    try {
        eval("docLen2 = document.loanModForm['esignDoc[]']");
        eDocLen = docLen2.length;
    } catch (e) {
    }
    if (eDocLen > 0) {
        for (var j1 = 0; j1 < docLen2.length; j1++) {
            if (docLen2[j1].checked) {
                eDoc++;
            }
        }
    } else {
        try {
            chk = docLen2.checked;
        } catch (e) {
        }
        if (chk) {
            eDoc++;
        }
    }


    try {
        eval("docLen3 = document.loanModForm['upDoc[]']");
        upDocLen = docLen3.length;
    } catch (e) {
    }
    if (upDocLen > 0) {
        for (var j1 = 0; j1 < docLen3.length; j1++) {
            if (docLen3[j1].checked) {
                upDoc++;
            }
        }
    } else {
        try {
            chk = docLen3.checked;
        } catch (e) {
        }
        if (chk) {
            upDoc++;
        }
    }

    try {
        eval("docLen4 = document.loanModForm['branchDoc[]']");
        brDocLen = docLen4.length;
    } catch (e) {
    }
    if (brDocLen > 0) {
        for (var j1 = 0; j1 < docLen4.length; j1++) {
            if (docLen4[j1].checked) {
                brDoc++;
            }
        }
    } else {
        try {
            chk = docLen4.checked;
        } catch (e) {
        }
        if (chk) {
            brDoc++;
        }
    }

    try {
        eval("docLen5 = document.loanModForm['PCDoc[]']");
        PCDocLen = docLen5.length;
    } catch (e) {
    }
    if (PCDocLen > 0) {
        for (var j1 = 0; j1 < docLen5.length; j1++) {
            if (docLen5[j1].checked) {
                PCDoc++;
            }
        }
    } else {
        try {
            chk = docLen5.checked;
        } catch (e) {
        }
        if (chk) {
            PCDoc++;
        }
    }


    try {
        eval("docLen = document.loanModForm['binderDoc[]']");
        binderDocLen = docLen.length;
    } catch (e) {
    }
    if (binderDocLen > 0) {
        for (var j1 = 0; j1 < docLen.length; j1++) {
            if (docLen[j1].checked) {
                binDoc++;
            }
        }
    } else {
        try {
            chk = docLen.checked;
        } catch (e) {
        }
        if (chk) {
            binDoc++;
        }
    }

    var creditorDocs = 0;
    try {
        eval("creditor = document.loanModForm['creditorPKG[]']");
        creditorDocs = creditor.length;
    } catch (e) {
    }
    if (creditorDocs > 0) {
        for (var j = 0; j < creditor.length; j++) {
            if (creditor[j].checked) {
                creditorDoc++;
            }
        }
    } else {
        try {
            chk = creditor.checked;
        } catch (e) {
        }
        if (chk) {
            creditorDoc++;
        }
    }

    try {
        eval("creditors = document.loanModForm['creditorAttachPKG[]']");
        creditorDocs = creditors.length;
    } catch (e) {
    }
    if (creditorDocs > 0) {
        for (var j = 0; j < creditors.length; j++) {
            if (creditors[j].checked) {
                creditorsDoc++;
            }
        }
    } else {
        try {
            chk = creditors.checked;
        } catch (e) {
        }
        if (chk) {
            creditorsDoc++;
        }
    }
    if (((selectedPkg == 0) || (selectedPkg == "")) &&

        ((selectedAttPkg == 0) || (selectedAttPkg == "")) &&
        ((brDoc == 0) || (brDoc == "")) &&
        ((PCDoc == 0) || (PCDoc == "")) &&
        ((upDoc == 0) || (upDoc == "")) &&
        ((eDoc == 0) || (eDoc == "")) &&
        ((cusDoc == 0) || (cusDoc == "")) &&
        ((cusWordDoc == 0) || (cusWordDoc == "")) &&
        ((binDoc == 0) || (binDoc == "")) &&
        ((creditorDoc == 0) || (creditorDoc == "")) &&
        ((creditorsDoc == 0) || (creditorsDoc == ""))

    ) {
        //alert("Please select any package");
        if (opt == 'Binder') toastrNotification("Please select any package", 'error');
        return false;
    } else {
        return true;
    }

}

function openSendDocPopup(LMRId, actionOpt) {
    var encryptedPCID = '', encryptedEId = '', clientName = '', oldFPCID = 0, popsTitle = '';

    encryptedPCID = document.loanModForm.encryptedPCID.value;
    encryptedEId = document.loanModForm.encryptedEId.value;
    clientName = document.loanModForm.clientName.value;
    oldFPCID = document.loanModForm.oldFPCID.value;

    var selPkg = false;
    if (oldFPCID == 854) { /* As per Daniel request, remove the restriction for the law offices PC to select the documents while sending emails on Sep 4, 2015. */
        selPkg = true;
        //popsTitle = 'Send Email';
    } else {
        selPkg = getAllPackages();
        popsTitle = 'Send Docs';
    }
    //if(selPkg) {
    var selPKGID = 0, selBPKGID = 0, selCPKGID = 0, selEPKGID = 0, selBinPKGID = 0, selUpDocID = 0, selAttachedPkg = 0,
        totFileSize = 0, selPCPKGID = 0, selCreditorEsignPKGID = 0, selCreditorAttachedPKGID = 0;
    var selCWPKGID = 0;

    selPKGID = document.getElementById("selectedPkg").value;
    selBPKGID = document.getElementById("branchSelectedPkg").value;
    selCPKGID = document.getElementById("customSelectedPkg").value;
    selCWPKGID = document.getElementById("customWordSelectedPkg").value;
    selEPKGID = document.getElementById("esignSelectedPkg").value;
    selBinPKGID = document.getElementById("binderSelectedPkg").value;
    selUpDocID = document.getElementById("selectedUpDoc").value;
    selAttachedPkg = document.getElementById("selectedAttachedPkg").value;
    selPCPKGID = document.getElementById("PCSelectedPkg").value;

    selCreditorEsignPKGID = document.getElementById("creditorEsignPkg").value;
    selCreditorAttachedPKGID = document.getElementById("creditorAttachedPkg").value;

    totFileSize = document.getElementById("totFileSize").value;
    qstr = "LMRId=" + LMRId + "&assignedPCID=" + encryptedPCID + "&executiveId=" + encryptedEId + "&fax=0";
    qstr += "&selPKGID=" + selPKGID + "&selBPKGID=" + selBPKGID + "&selCPKGID=" + selCPKGID + "&selCWPKGID=" + selCWPKGID + "&selEPKGID=" + selEPKGID;
    qstr += "&selBinPKGID=" + selBinPKGID + "&selUpDocID=" + selUpDocID + "&selAttachedPkg=" + selAttachedPkg;
    qstr += "&totFileSize=" + totFileSize + "&selPCPKGID=" + selPCPKGID;
    qstr += "&selCreditorEsignPKGID=" + selCreditorEsignPKGID + "&selCreditorAttachedPKGID=" + selCreditorAttachedPKGID;
    qstr += "&actionOpt=" + actionOpt + "&showSaveBtn=1";

    clientName = htmlentities(clientName, "ENT_QUOTES");

    eval("popupArray['" + POPSURL + "docsSend.php'][1]	= 'File : " + clientName + " > " + popsTitle + "'");
    eval("ContactPop.showOverlay('" + POPSURL + "docsSend.php')"); /** Open Popup **/
    //}
}

function getNoOfFax(LMRId, assignedPCID, executiveId, fax) {
    var pkgCnt = 0, j = 0, totalCnt = 0, clientName = '';
    var customDoc = $('#customSelectedPkg').val();

    clientName = document.loanModForm.clientName.value;
    pkgCnt = document.loanModForm.pkgCnt.value;

    for (var i = 0; i < pkgCnt; i++) {
        var chk = false;
        eval("obj = document.loanModForm.pkg_" + i);
        try {
            chk = obj.checked;
        } catch (e) {
        }
        if (chk) totalCnt++;
    }

    var eSignDocCnt = 0, k = 0;
    eval("obj = document.getElementsByName('esignDoc[]')");
    for (var k = 0; k < obj.length; k++) {
        if (obj[k].checked) totalCnt++;
    }

    var l = 0;
    eval("obj = document.getElementsByName('customDoc[]')");

    for (var l = 0; l < obj.length; l++) {
        if (obj[l].checked) totalCnt++;
    }
    var r = 0;
    eval("obj = document.getElementsByName('creditorPKG[]')");

    for (var r = 0; r < obj.length; r++) {
        if (obj[r].checked) totalCnt++;
    }

    var k = 0;
    eval("obj = document.getElementsByName('creditorAttachPKG[]')");

    for (var k = 0; k < obj.length; k++) {
        if (obj[k].checked) totalCnt++;
    }


    var s = 0;
    eval("obj = document.getElementsByName('upDoc[]')");

    for (var s = 0; s < obj.length; s++) {
        if (obj[s].checked) totalCnt++;
    }

    var h = 0, biPkgId = '';
    eval("obj = document.getElementsByName('binderDoc[]')");

    for (var h = 0; h < obj.length; h++) {
        if (obj[h].checked) totalCnt++;
    }

    var i = 0, bPkgId = '';
    eval("obj = document.getElementsByName('branchDoc[]')");

    for (var i = 0; i < obj.length; i++) {
        if (obj[i].checked) totalCnt++;
    }

    var j = 0, bPkgId = '';
    eval("obj = document.getElementsByName('PCDoc[]')");

    for (var j = 0; j < obj.length; j++) {
        if (obj[j].checked) totalCnt++;
    }

    for (var i1 = 0; i1 < pkgCnt; i1++) {
        var chk = false;
        eval("obj1 = document.loanModForm.pkg1_" + i1);
        try {
            chk = obj1.checked;
        } catch (e) {
        }
        if (chk) totalCnt++;
    }

    if (totalCnt == 0) {
        //alert('Please select any document');
        toastrNotification("Please select any document", 'error');
        return false;
    } else if (totalCnt > 100) {
        /*
         * Request   : Common Wealth Center to upload faxed document document count 10 to 20.
         * Date      : 01/16/2019
         */
        toastrNotification("Maximum 20 document is allowed to send fax", 'error');
        return false;
    } else {
        var selPKGID = 0, selBPKGID = 0, selCPKGID = 0, selEPKGID = 0, selBinPKGID = 0, selUpDocID = 0,
            selAttachedPkg = 0, totFileSize = 0, selCreditorPKGID = 0, selCreditorAttachedPKGID = 0;
        var selCWPKGID = 0;
        selPKGID = document.getElementById("selectedPkg").value;
        selBPKGID = document.getElementById("branchSelectedPkg").value;
        selCPKGID = document.getElementById("customSelectedPkg").value;
        selCWPKGID = document.getElementById("customWordSelectedPkg").value;
        selEPKGID = document.getElementById("esignSelectedPkg").value;
        selBinPKGID = document.getElementById("binderSelectedPkg").value;
        selUpDocID = document.getElementById("selectedUpDoc").value;
        selAttachedPkg = document.getElementById("selectedAttachedPkg").value;
        totFileSize = document.getElementById("totFileSize").value;
        try {
            selCreditorPKGID = document.getElementById("creditorSelectedPkg").value;
        } catch (e) {
        }
        try {
            selCreditorAttachedPKGID = document.getElementById("creditorAttachedPkg").value;
        } catch (e) {
        }
        qstr = "LMRId=" + LMRId + "&assignedPCID=" + assignedPCID + "&executiveId=" + executiveId + "&fax=1";
        qstr += "&selPKGID=" + selPKGID + "&selBPKGID=" + selBPKGID + "&selCPKGID=" + selCPKGID + "&selCWPKGID=" + selCWPKGID + "&selEPKGID=" + selEPKGID;
        qstr += "&selBinPKGID=" + selBinPKGID + "&selUpDocID=" + selUpDocID + "&selAttachedPkg=" + selAttachedPkg;
        qstr += "&totFileSize=" + totFileSize;
        qstr += "&selCreditorPKGID=" + selCreditorPKGID + "&selCreditorAttachedPKGID=" + selCreditorAttachedPKGID + "&showSaveBtn=1";

        clientName = htmlentities(clientName, "ENT_QUOTES");

        $('#faxButton').data('id', qstr);
        $('#faxButton').data('name', 'File : ' + clientName + ' > Send Fax');
        $('#faxButton').click();
        // eval("popupArray['" + POPSURL + "docsSend.php'][1]	= 'File : " + clientName + " > Send Fax'");
        //eval("ContactPop.showOverlay('" + POPSURL + "docsSend.php')"); /** Open Popup **/
        return true;
    }
}

function deleteEsignedDoc(txnID, LMRId, docId, packageName, isSysNotesPrivate) {
    if (confirm("Are you sure to delete this document?")) {
        window.location.href = "../backoffice/deleteEsignedDoc.php?txnID=" + txnID + "&LMRId=" + LMRId + "&docId=" + docId + "&packageName=" + packageName + "&isSysNotesPrivate=" + isSysNotesPrivate;
    }
}

function updateFileDocInfo() {
    var docId = 0, userId = 0, DocName = '', docCategory = '', LMRId = 0, displayDocName = '', category = '',
        encLMRId = '';
    var PCID = 0, allowToEdit = 0, recordDate = '', userRole = '';

    LMRId = $('#LMRId').val();
    docId = $('#docId').val();
    userId = $('#userId').val();
    DocName = $('#DocName').val();
    docCategory = $('#docCategory').val();
    encLMRId = document.loanModForm.encryptedLId.value;
    clientName = document.loanModForm.borrowerName.value;
    PCID = document.loanModForm.encryptedPCID.value;
    try {
        allowToEdit = document.loanModForm.AE.value;
    } catch (e) {
    }
    try {
        userRole = document.loanModForm.userRole.value; // Picture Of Property always editable for user role client. added by suresh - Desc 07 2017
        if (userRole = 'Client') allowToEdit = 1;
    } catch (e) {
    }
    try {
        recordDate = document.loanModForm.RD.value;
    } catch (e) {
    }

    url = "../pops/fileDocSave.php";
    qstr = "docId=" + docId + "&userId=" + userId + "&DocName=" + encodeURIComponent(DocName) + "&docCategory=" + encodeURIComponent(docCategory) + "&LMRId=" + LMRId;

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        cnt = xmlDoc.getElementsByTagName("updCnt")[0].firstChild.nodeValue;
    } catch (e) {
    }
    try {
        displayDocName = xmlDoc.getElementsByTagName("DocName")[0].firstChild.nodeValue;
    } catch (e) {
    }
    try {
        category = xmlDoc.getElementsByTagName("docCategory")[0].firstChild.nodeValue;
    } catch (e) {
    }
    setTimeout("showFileDocsList('', '', '" + encLMRId + "', '" + PCID + "', '" + allowToEdit + "', '" + recordDate + "', '', '', '" + docCategory + "')", 500);
    /*
       $("#"+docId+"_docName").html(DocName);
       $("#"+docId+"_docCategory").html(docCategory);
    */
/*    qr = "LMRId=" + LMRId + "&docId=" + docId + "&displayDocName=" + displayDocName + "&docCategory=" + category + "&userId=" + userId + "&edit=y";
    $("#" + docId + "_editFile").html("<a class=\"fa fa-edit fa-2x icon-green tip-bottom\" style=\"text-decoration:none;\" href=\"" + POPSURL + "editFileDocInfo.php\" id='" + qr + "' name='File:" + clientName + " > Doc Info'  title=\"Click to edit File Doc Info\"></a>");

    eval("ContactPop.init('" + POPSURL + "editFileDocInfo.php', 'editFileDocInfo.php', 'File Doc Info', '" + POPSURL + "','fileDocSave.php' , 400,'200')");
    try {
        ContactPop.hideOverlay();
    } catch (e) {
    }*/
}

function newUpdateFileDocInfo() {
    var docId = 0, userId = 0, DocName = '', docCategory = '', LMRId = 0, displayDocName = '', category = '',
        encLMRId = '' ; clientName = '';
    var PCID = 0, allowToEdit = 0, recordDate = '', userRole = '', docCategoryType = '', documentType = '',
        existDocumentType = '', DocExpiryDate = '0000:00:00';

    LMRId = $('#LMRId').val();
    docId = $('#docId').val();
    userId = $('#userId').val();
    DocName = $('#DocName').val();
    docCategory = $('#docCategory').val();
    docCategoryType = $('#docCategoryType').val();
    if(docCategoryType == ''){
        toastrNotification('Please Select Document Category', 'error');
        return false;
    } else {
        documentType = $("#" + docCategoryType + "DocumentType").val();
    }
    documentType = $("#" + docCategoryType + "DocumentType").val();
    existDocumentType = $("#existDocumentType").val();
    DocExpiryDate = $("#DocExpiryDate").val();


    if (documentType == '') {
        toastrNotification('Please Select Document Type', 'error');
        return false;
    }
    if (documentType == 'add_req' || documentType == 'add_other') {
        toastrNotification('Please Save Create Document Type Popup', 'error');
        return false;
    }
    $("#loadingImg").html('<img src="../images/loading.gif" style="margin-left: 50%; width:50px;">');

    // alert(documentType);
    //	$('#valueDocumentType').val();

    try {
        encLMRId = document.loanModForm.encryptedLId.value;
    } catch (e) {

    }
    try {
        clientName = document.loanModForm.borrowerName.value;
    } catch (e) {

    }
    PCID = document.loanModForm.encryptedPCID.value;
    try {
        allowToEdit = document.loanModForm.AE.value;
    } catch (e) {
    }
    try {
        userRole = document.loanModForm.userRole.value; // Picture Of Property always editable for user role client. added by suresh - Desc 07 2017
        if (userRole = 'Client') allowToEdit = 1;
    } catch (e) {
    }
    try {
        recordDate = document.loanModForm.RD.value;
    } catch (e) {
    }

    url = siteUrl+"/pops/newFileDocSave.php";
    qstr = "docId=" + docId + "&userId=" + userId + "&DocName=" + encodeURIComponent(DocName) + "&docCategory=" + encodeURIComponent(docCategory) + "&LMRId=" + LMRId + "&docCategoryType=" + docCategoryType + "&documentType=" + documentType + "&existDocumentType=" + existDocumentType + "&DocExpiryDate=" + DocExpiryDate;

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        cnt = xmlDoc.getElementsByTagName("updCnt")[0].firstChild.nodeValue;
    } catch (e) {
    }
    try {
        displayDocName = xmlDoc.getElementsByTagName("DocName")[0].firstChild.nodeValue;
    } catch (e) {
    }
    try {
        category = xmlDoc.getElementsByTagName("docCategory")[0].firstChild.nodeValue;
    } catch (e) {
    }
    setTimeout("showFileDocsList('', '', '" + encLMRId + "', '" + PCID + "', '" + allowToEdit + "', '" + recordDate + "', '', '', '" + docCategory + "')", 500);
    /*
       $("#"+docId+"_docName").html(DocName);
       $("#"+docId+"_docCategory").html(docCategory);
    */
   // qr = "LMRId=" + LMRId + "&docId=" + docId + "&displayDocName=" + displayDocName + "&docCategory=" + category + "&userId=" + userId + "&edit=y";
    //$("#" + docId + "_editFile").html("<a class=\"fa fa-edit fa-2x icon-green tip-bottom\" style=\"text-decoration:none;\" href=\"" + POPSURL + "editFileDocInfo.php\" id='" + qr + "' name='File:" + clientName + " > Doc Info'  title=\"Click to edit File Doc Info\"></a>");

    //eval("ContactPop.init('" + POPSURL + "editFileDocInfo.php', 'editFileDocInfo.php', 'File Doc Info', '" + POPSURL + "','fileDocSave.php' , 400,'200')");
    try {
        $('#exampleModal1').modal('toggle');
        //ContactPop.hideOverlay();
    } catch (e) {
    }
    toastrNotification('Saved successfully', 'success');
    location.reload();
}

function deleteUploadFileDoc(docId, userId, opt, LMRId, divId, tableId) {
    //$('.with-children-tip > *').hideTip();
    if (LMRId != '') {
        encryptedLMRId = LMRId;
    } else {
        encryptedLMRId = document.loanModForm.encryptedLId.value;
    }

    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: "Are you sure want to delete this document?",
        type: 'red',
        backgroundDismiss: false,
        buttons: {
            cancel: {
                text: 'Close',
                action: function () {
                    //  location.reload();
                }
            },
            yes: {
                action: function () {
                    var url = siteSSLUrl + "backoffice/deleteFileDoc.php";
                    var qstr = "dId=" + docId + "&userId=" + userId + "&LMRId=" + LMRId;
                    try {
                        xmlDoc = getXMLDoc(url, qstr);
                    } catch (e) {
                    }
                    var delCnt = '';
                    try {
                        delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
                    } catch (e) {
                    }
                    if (delCnt > 0) {
                        var rowNumbIndex = 0;
                        eval("rowNumbIndex = document.getElementById('" + divId + "').rowIndex");
                        eval("document.getElementById('" + tableId + "').deleteRow(" + rowNumbIndex + ")");
                        if (tableId == 'UploadChkFileDocList') {
                            var divId2 = '';
                            var rowNumbIndex = 0;
                            divId2 = divId.replace('chk_', '');
                            eval("rowNumbIndex = document.getElementById('" + divId2 + "').rowIndex");
                            eval("document.getElementById('UploadFileDocList').deleteRow(" + rowNumbIndex + ")");
                        }
                        toastrNotification("Deleted successfully", 'success');
                    }
                }
            }
        },
        onClose: function () {
        },
    });

}

function showUploadFileDocInfo(LMRId) {
    var url = "", qstr = "";
    url = "../backoffice/getUploadFileDocList.php";
    qstr = "LMRId=" + LMRId;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    var additionalListingInfoArray = new Array(), displayList = "";
    try {
        displayList = getResponse(url, qstr);
    } catch (e) {
    }
    try {
        document.getElementById("UploadFileDocList").innerHTML = displayList;
    } catch (e) {
    }
    try {
        ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
}

function docFormSubmit() {
    document.loanModForm.action = sslUrl + "LMRFormSubmit.php";
    document.loanModForm.submit();
}

function showAndHideFaxCoverInfo(fldValue, divCls) {
    if (fldValue == '1') {
        //document.getElementsByClassName(divCls).style.display = 'block';
        $("." + divCls).css("display", "block");
    } else {
        //document.getElementsByClassName(divCls).style.display = 'none';
        $("." + divCls).css("display", "none");
    }
}


/**

 ** Description    : User selected the Category again fetch the Documents Name
 ** Date            : Feb 16, 2017

 **/


function populateDocsName(formName, srcName, targetName, inpField) {
    var docCategory = '', xmlDoc = '', PCID = 0, documentsDataArray = new Array();

    try {
        eval("docCategory = document." + formName + "." + srcName + ".value");
        eval("PCID = document." + formName + ".FPCID.value");
    } catch (e) {
    }
    if (docCategory == 'Other') {
        document.getElementById(inpField).innerHTML = "<input type='text' name='" + targetName + "' id='" + targetName + "' size='25'>";
    } else {
        document.getElementById(inpField).innerHTML = "<select name='" + targetName + "' id='" + targetName + "' style='width:160px;'>";

        var fileDocNameArray = new Array();
        var fileDocNameArray = getNewObject(targetName);
        fileDocNameArray.options[0] = new Option("- Select -", "", false);

        if (docCategory != "") {
            var url = "../backoffice/getPCFileDocsName.php";
            var qstr = "docCategory=" + docCategory + "&PCID=" + PCID;
            try {
                xmlDoc = getXMLDoc(url, qstr);
            } catch (e) {
            }
            try {
                documentsDataArray = xmlDoc.getElementsByTagName("documents");
            } catch (e) {
            }

            for (var c = 0; c < documentsDataArray.length; c++) {
                var docName = "";
                try {
                    docName = documentsDataArray[c].getElementsByTagName("docName")[0].firstChild.nodeValue;
                } catch (e) {
                }
                fileDocNameArray.options[c + 1] = new Option(docName, docName, false, false);
            }
        }
    }
}

/**

 Description    : Validation of the docs Name and save functionality
 Developer    : Viji & Venkatesh,Suresh
 Date        : Feb 24, 2017

 **/

function validatePCFileDocuments() {
    if (chkIsBlank('PCFileDocumentsForm', 'docName', 'Please enter the file documents')
        && isMultiCheckboxSelected('PCFileDocumentsForm', 'docsModuleName', 'Please Select any Modules')
    ) {
        return true;
    } else {
        return false;
    }
}

function savePCFileDocuments() {
    if (validatePCFileDocuments()
    ) {
        return true;
    } else {
        return false;
    }
}

function saveNewPCFileDocuments() {
    var statPopupArray = new Array();
    var fileSubstatusModules = '';
    var data = $("#PCFileDocumentsForm").serialize();
    var PCID = 0;
    PCID = $("#PCID").val();
    fileSubstatusModules = $("#documentsModuleName").val();
    $.post("../pops/savePCFileDocuments.php", data, function (theResponse) {

        $("#sessMsg").html('<h4>Primary File Documents Saved<h4>');
        try {
            document.getElementById('PCFileDocsDiv').innerHTML = theResponse;
        } catch (e) {
        }
        qstr = "PCID=" + PCID;
        /** Popup start **/

        eval("statPopupArray['" + POPSURL + "addPCFileDocuments.php'] = new Array('addPCFileDocuments.php', 'Add / Edit File Documents', '" + POPSURL + "','savePCFileDocuments.php' ,400,'200')");

        for (key in statPopupArray) {
            ContactPop.init(key, statPopupArray[key][0], statPopupArray[key][1], statPopupArray[key][2], statPopupArray[key][3], statPopupArray[key][4], statPopupArray[key][5]);
        }
        /** Popup end **/

    });
    try {
        ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
    $('.with-tip, .with-children-tip > *').tip();
}

function showSortableList(sortOpt, orderBy, LMRId, PCID, allowToEdit, recordDate, docId, displayDocName, category, userId) {
    showLoader();
    setTimeout("showFileDocsList('" + sortOpt + "', '" + orderBy + "', '" + LMRId + "', '" + PCID + "', '" + allowToEdit + "', '" + recordDate + "', '" + docId + "', '" + displayDocName + "', '" + category + "', '" + userId + "')", 500);
}

function showFileDocsList(sortOpt, orderBy, LMRId, PCID, allowToEdit, recordDate, docId, displayDocName, category, userId) {
    showLoader();
    var url = "", qstr = "", displayList = "", activeTab = '', clientName = '';
    try {
        activeTab = document.loanModForm.activeTab.value;
    } catch (e) {
    }

    try {
        clientName = document.loanModForm.borrowerName.value;
    } catch (e) {
    }
    //activeTab = 'LI';
    url = siteUrl+"backoffice/getFileDocsList.php";
    qstr = "LMRId=" + LMRId + "&sortOpt=" + sortOpt + "&orderBy=" + orderBy + "&PCID=" + PCID + "&allowToEdit=" + allowToEdit + "&recordDate=" + recordDate + "&activeTab=" + activeTab + "&category=" + category;

    try {
        displayDocsList = getResponse(url, qstr);
    } catch (e) {
    }
    try {
        if (category == 'HMLO CMA Report') {
            document.getElementById("HMLOUploadFileDocList").innerHTML = displayDocsList;
        } else {
            document.getElementById("UploadFileDocList").innerHTML = displayDocsList;
        }
    } catch (e) {
    }

    if (activeTab == 'PI') {
        $('.propertyPictures').click(function () {
            $("#propertyPictures").dialog({
                modal: true,
                resizable: false,
                draggable: true,
                width: '90%',
                title: 'Pictures of property: ' + $(this).attr('data-title'),
                autoOpen: true,
                closeOnEscape: true,
                buttons: {
                    Close: function () {
                        $(this).dialog("close");
                    }
                },
                resizable: false,
                open: function () {   // open event handler
                    $('#propertyPictures').html('Please wait');
                }
            });

            $('.ui-widget-header').css('display', 'block');
            $('.ui-widget-header a').css('display', 'block');

            var img = "<div class='pad5'><img src='" + $(this).attr('data-url') + "'></div><div class='pad10'></div>"
            $('#propertyPictures').html(img);
            // do other stuff.
        });
    }

    qr = "LMRId=" + LMRId + "&docId=" + docId + "&displayDocName=" + displayDocName + "&docCategory=" + category + "&userId=" + userId + "&edit=y";
    $("#" + docId + "_editFile").html("<a class=\"btn btn-sm btn-light btn-text-primary btn-hover-primary btn-icon m-1 tooltipClass\" style=\"text-decoration:none;\" data-wsize=\"modal-lg\" data-toggle=\"modal\" data-target=\"#exampleModal1\" data-href=\"" + POPSURL + "editFileDocInfo.php\" data-id='" + qr + "' name='File:" + clientName + " > Doc Info'  title=\"Click to edit File Doc Info\"><i class=\"fa fa-edit\"></i></a>");

    //eval("ContactPop.init('" + POPSURL + "editFileDocInfo.php', 'editFileDocInfo.php', 'File Doc Info', '" + POPSURL + "','fileDocSave.php' , 400,'200')");
    try {
      //  ContactPop.hideOverlay();
    } catch (e) {
    }

    setTimeout("hideLoader()", 200);
}

function showSortableListRefresh(sortOpt, orderBy, LMRId, PCID, allowToEdit, recordDate, docId, displayDocName, category, userId,op) {
    BlockDiv('UploadFileDocList_div');
    var url = "", qstr = "", displayList = "", activeTab = '', clientName = '';

    try {
        activeTab = document.loanModForm.activeTab.value;
    } catch (e) {
    }

    try {
        clientName = document.loanModForm.borrowerName.value;
    } catch (e) {
    }

    url = "../backoffice/getFileDocsList.php";
    qstr = "LMRId=" + LMRId + "&sortOpt=" + sortOpt + "&orderBy=" + orderBy + "&PCID=" + PCID + "&allowToEdit=" + allowToEdit + "&recordDate=" + recordDate + "&activeTab=" + activeTab + "&category=" + category+"&op="+op;

    try {
        //displayDocsList = getResponse(url,qstr);
        console.log('showSortableListRefresh');
        $.ajax({
            url: url + '?' + qstr,
            type: "post",
            async: true,
            success: function (data) {
                try {
                    if (category == 'HMLO CMA Report') {
                        document.getElementById("HMLOUploadFileDocList").innerHTML = data;
                    } else {
                        document.getElementById("UploadFileDocList_div").innerHTML = data;
                    }
                    qr = "LMRId=" + LMRId + "&docId=" + docId + "&displayDocName=" + displayDocName + "&docCategory=" + category + "&userId=" + userId + "&edit=y";
                    $("#" + docId + "_editFile").html("<a class=\"fa fa-edit fa-2x icon-green tip-bottom\" style=\"text-decoration:none;\" href=\"" + POPSURL + "editFileDocInfo.php\" id='" + qr + "' name='File:" + clientName + " > Doc Info'  title=\"Click to edit File Doc Info\"></a>");

                    // eval("ContactPop.init('" + POPSURL + "editFileDocInfo.php', 'editFileDocInfo.php', 'File Doc Info', '" + POPSURL + "','fileDocSave.php' , 400,'200')");

                    try {
                        //ContactPop.hideOverlay();
                    } catch (e) {
                    }
                    initialiseDatatable('dataTbl_' + LMRId, true);
                    setTimeout("hideLoader()", 200);

                    var rowCountLmrid = $('.dataTbl_' + LMRId + ' tr').length;
                    if (rowCountLmrid > 0) {
                        $('#checkallshow').show();
                    }
                    $('#select_allAllUploadClass').on('click', function () {
                        upDocId = '';
                        dCnt = '';
                        totFileSizeUpload = '0';
                        if (this.checked) {
                            $('.selectAllUploadClass').each(function () {
                                this.checked = true;
                                if (dCnt > 0) {
                                    upDocId += ", ";
                                }
                                upDocId += this.value;
                                dCnt++;
                                totFileSizeUpload = parseFloat(totFileSizeUpload) + parseFloat($(this).attr('data-file-size'));
                            });
                            document.loanModForm.selectedUpDoc.value = upDocId;
                            document.loanModForm.totFileSize.value = totFileSizeUpload;

                        } else {
                            $('.selectAllUploadClass').each(function () {
                                this.checked = false;
                            });
                            document.loanModForm.selectedUpDoc.value = '';
                            document.loanModForm.totFileSize.value = '0';
                        }
                    });
                    $('.selectAllUploadClass').on('click', function () {
                        if ($('.selectAllUploadClass:checked').length == $('.selectAllUploadClass').length) {
                            $('#select_allAllUploadClass').prop('checked', true);
                        } else {
                            $('#select_allAllUploadClass').prop('checked', false);
                        }
                    });
                } catch (e) {
                }
                // document.getElementById("UploadFileDocList_div").innerHTML  = data;
                // console.log(displayDocsList);
            }
        });
    } catch (e) {
    }


}

function initialiseDatatable(tableClass, reinit) {
    if (reinit) {
        $("." + tableClass).dataTable().fnDestroy()
    }
    $('.' + tableClass).DataTable({
        language: {search: "", searchPlaceholder: "Search",},
        /* "sDom": 'ifr<"toolbar">tp',*/
        "sDom": '<"d-flex justify-content-between align-self-center"i<"#' + tableClass + 'Title">f">rt',
        /*  "sDom": 'Bfrtip',*/
        "scrollX": true,
        /* "processing": true,*/
        /*"stateSave": true,*/
        //scrollY: '50vh',
        "scrollY": 500,
        "paging": false,
        "info": true,
        "searching": true,
        /*"retrieve": true,*/
        /*"select":true,*/
        "order": [],
        "columns": [
            {"width": "2%", "className": "text-center"}, //Sno
            {"width": "2%", "className": "text-center"}, //Checkbox
            {"width": "5%", "className": "text-left"}, //Operation
            {"width": "22%", "className": "text-left"}, //FileName
            {"width": "10%", "className": "text-left"}, //Category
            {"width": "15%", "className": "text-left"}, //Doc Type ,
            {"width": "10%"}, //Expiry Date
            {"width": "15%", "className": "text-center"},//Uploaded Bu
            {"width": "10%", "className": "text-center"}, //File type/size
            {"width": "5%", "className": "text-center"}, //Delete
        ],
        "aoColumnDefs": [{
            'bSortable': false,
            'aTargets': [1, 2, 6, 9]
        }],
    });

    $('#' + tableClass + "Title").html('<span class="font-weight-bolder"><u>Uploaded Files & Documents</u></span>');
}

function deleteFileUploadedDoc(docId, userId, LMRId, div) {
    //$('.with-children-tip > *').hideTip();
    var ks = 0;
    var delCnt = '';
    var dID = '';
    var uploadedBy = '';
    var LMRId = '';
    var tArray = [];
    if (docId != '') {
        var confrim = confirm("Are you sure want to delete this document?");
        encryptedLMRId = document.loanModForm.encryptedLId.value;
        if (confrim) {
            var url = siteSSLUrl + "backoffice/deleteFileDoc.php";
            var qstr = "dId=" + docId + "&userId=" + userId + "&LMRId=" + LMRId;
            try {
                xmlDoc = getXMLDoc(url, qstr);
            } catch (e) {
            }
            try {
                delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
            } catch (e) {
            }
        }
    }

    if (delCnt > 0 || docId == '') {
        $(div).parent().parent().remove();
        var cnt = $('.proInsCoverage').length;
        $('#proInsCnt').val(cnt);
    }

    jQuery('.proInsCoverage').each(function (i) {
        $(this).attr("id", "proInsSec_" + i);
    });

    jQuery('.delTxt').each(function (i) {
        $(this).attr("id", "delTxt_" + i);
        $(this).attr("name", "delTxt_" + i);
    });

    return false;
}

/* remove Draw Request Documents.. */
function deleteDrawRequestDocs(docId, userId, LMRId, div) {
    // $('.with-children-tip > *').hideTip();
    var ks = 0;
    var delCnt = '';
    var dID = '';
    var uploadedBy = '';
    var LMRId = '';
    var tArray = [];
    if (docId != '') {
        var confrim = confirm("Are you sure want to delete this document?");
        encryptedLMRId = document.loanModForm.encryptedLId.value;
        if (confrim) {
            var url = siteSSLUrl + "backoffice/deleteFileDoc.php";
            var qstr = "dId=" + docId + "&userId=" + userId + "&LMRId=" + LMRId;
            try {
                xmlDoc = getXMLDoc(url, qstr);
            } catch (e) {
            }
            try {
                delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
            } catch (e) {
            }
        }
    }

    if (delCnt > 0 || docId == '') {
        $(div).parent().parent().remove();
    }

    return false;
}

/**
 * Generate Google docs using Node js(API).
 * @param {Package name} pkgName
 * @param {Loan file response} lmrRID
 * @param {Loan file id} lId
 * @param {Package id} pkgID
 * @param {Open type} openType
 */
function generateGoogleDocs(pkgName, lmrRID, lId, pkgID, openType) {

    jQuery.support.cors = true;
    $.ajax({
        type: 'POST',
        url: siteSSLUrl + "createCustomDocPDF.php",
        data: jQuery.param({
            'pkgID': pkgID,
            'lId': lId,
            'open': openType,
        }),
        crossOrigin: true,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (resUrl) {
            alert(resUrl);
        }
    });
}

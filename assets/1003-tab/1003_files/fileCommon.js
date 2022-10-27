/* eslint-disable no-prototype-builtins */
/* eslint-disable no-redeclare */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-empty */
/* eslint-disable no-undef */

/* eslint-disable no-unused-vars */
function validateScheduledEmailForm(opt) {
    if (chkIsBlank('leadEmailCampaignForm', 'emailCampaign', 'Please select any email campaign')) {
        saveScheduledEmailForm(opt);
        return true;
    } else {
        return false;
    }
}

function validateScheduledEmailFormPopup(opt) {
    if (chkIsBlank('leadEmailCampaignForm', 'subject', 'Please enter subject') &&
        checkValidEmailId('leadEmailCampaignForm', 'bCCEmail') &&
        checkValidEmailId('leadEmailCampaignForm', 'CCEmail') &&
        chkIsBlank('leadEmailCampaignForm', 'toEmail', 'Please enter to Email')
        /*&&
		checkValidEmailId('leadEmailCampaignForm', 'toEmail')*/
    ) {
        if ($('#content').froalaEditor('html.get') !== '') {
            document.getElementById("emailLoader").style.display = 'block';
            setTimeout("saveScheduledEmailForm('" + opt + "')", 200);

            try {
                $('#leadEmailCampaignForm #submit').attr('disabled', 'disabled');
            } catch (e) {

            }
            return true;
        }
        return false;
    } else {
        return false;
    }
}

function addNewSchedule() {
    if (!document.hasOwnProperty('leadEmailCampaignForm')) {
        return;
    }
    document.leadEmailCampaignForm.MSID.value = 0;
    document.leadEmailCampaignForm.emailDate.value = "";
    document.leadEmailCampaignForm.emailCampaign.value = "";
    document.leadEmailCampaignForm.emailScheduledOn.value = "";
}

function saveScheduledEmailForm(opt) {
    var UID = 0,
        UType = '',
        toUID = 0,
        toUType = '',
        LMRID = 0,
        emailCampaignID = 0;
    var emailDate = '',
        SID = 0,
        updateCnt = 0,
        msg = '',
        ccEmail = '',
        bccEmail = '';
    var responseText = "",
        statusText = "";
    /*
    UID  			= $('#UID').val();
    UType  			= $('#UType').val();
    toUID  			= $('#toUID').val();
    toUType			= $('#toUType').val();
    LMRID  			= $('#LMRID').val();
    emailCampaign  	= $('#emailCampaign').val();
    emailDate  		= $('#emailDate').val();
    MSID  		    = $('#MSID').val();

    templateName    = $('#templateName').val();
    subject         = $('#subject').val();
    content         = tinyMCE.get('content').getContent();
    ccEmail         = $('#CCEmail').val();
    bccEmail        = $('#bCCEmail').val();
*/
    //tinyMCE.triggerSave(true,true);
    $("#leadEmailCampaignForm").ajaxForm({
        success: function (msg, statusText) {
            if (msg != '') {
                var display = "<div id=\"divMsg\" style=\"width:300px;\">" + msg + "</div>";
                try {
                    document.getElementById('taskMsgDiv').innerHTML = display;
                } catch (e) {
                }
            }
            if (opt == 'Send/Close') {
            } else {
                eval("ContactPop.showOverlay('" + POPSURL + "sendEmailCampaign.php')"); /** Open Popup **/
            }
            if (opt === 'Send/Close') {
                try {
                    ContactPop.hideOverlay(); /** Close- Popup **/
                } catch (e) {
                }
            }
        }
    }).submit();
    /*
    var url = "../pops/saveEmailCampaign.php";
    var qstr = "UID="+UID+"&UType="+UType+"&toUID="+toUID+"&toUType="+toUType+"&LMRID="+LMRID+"&emailCampaign="+emailCampaign+"&emailDate="+emailDate+"&MSID="+MSID;
    qstr += "&templateName="+encodeURIComponent(templateName)+"&subject="+encodeURIComponent(subject)+"&content="+encodeURIComponent(content)+"&ccEmail="+encodeURIComponent(ccEmail)+"&bccEmail="+encodeURIComponent(bccEmail);
	try {
		 xmlDoc = getXMLDoc(url,qstr);
	} catch (e) {}
    try {
        updateCnt = xmlDoc.getElementsByTagName("updateCnt")[0].firstChild.nodeValue;
    } catch(e) {}
    try {
        msg = xmlDoc.getElementsByTagName("msg")[0].firstChild.nodeValue;
    } catch(e) {}
    if (updateCnt>0) {
        if (msg != '') {
			var display = "<div id=\"divMsg\" style=\"width:300px;\">"+msg+"</div>";
			try {
				document.getElementById('taskMsgDiv').innerHTML = display;
			} catch (e) {}
        }
        if (opt == 'Send/Close') { } else { eval("ContactPop.showOverlay('"+POPSURL+"sendEmailCampaign.php')"); // Open Popup // }
//        getScheduledEmailList(toUID, toUType, LMRID);
//        addNewSchedule();
    }
    if (opt == 'Send/Close') {
        try {
            ContactPop.hideOverlay(); // Close- Popup //
        } catch(e) {}
    }
*/
}

function getScheduledEmailList(toUID, toUType, LMRId) {
    var scheduledEmailList = '',
        leadScheduled = '',
        filePopupArray = [];
    var url = "../backoffice/getScheduledEmailList.php";
    var qstr = "toUID=" + toUID + "&toUType=" + toUType + "&LMRId=" + LMRId;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        scheduledEmailList = xmlDoc.getElementsByTagName("scheduledEmailList")[0].firstChild.nodeValue;
    } catch (e) {
    }
    try {
        //leadScheduled = xmlDoc.getElementsByTagName("leadScheduled")[0].firstChild.nodeValue;
    } catch (e) {
    }

    $('#ScheduledEmailDiv').html(replaceXMLProcess(scheduledEmailList));
    /* $('#divListEmail'+toUID).html(replaceXMLProcess(leadScheduled)); */
    /** Popup start **/

    eval("filePopupArray['" + POPSURL + "sendEmailCampaign.php']	= new Array('sendEmailCampaign.php', 'Send Email Campaign', '" + POPSURL + "','saveEmailCampaign.php',600,'300')");

    for (key in filePopupArray) {
        ContactPop.init(key, filePopupArray[key][0], filePopupArray[key][1], filePopupArray[key][2], filePopupArray[key][3], filePopupArray[key][4], filePopupArray[key][5]);
    }
    /** Popup end **/

}

function editScheduledEmail(MSID, toUID) {
    document.leadEmailCampaignForm.MSID.value = MSID;

    var emailCampaignId = 0,
        scheduledOn = "",
        templateName = "",
        scheduledOnDisp = '';
    var url = "../backoffice/getScheduledEmailInfo.php";
    var qstr = "MSID=" + MSID + "&toUID=" + toUID;

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }

    try {
        scheduledOn = xmlDoc.getElementsByTagName("scheduledOn")[0].firstChild.nodeValue;
    } catch (e) {
    }
    try {
        scheduledOnDisp = xmlDoc.getElementsByTagName("scheduledOnDisp")[0].firstChild.nodeValue;
    } catch (e) {
    }
    try {
        subject = xmlDoc.getElementsByTagName("subject")[0].firstChild.nodeValue;
    } catch (e) {
    }
    try {
        templateName = xmlDoc.getElementsByTagName("templateName")[0].firstChild.nodeValue;
    } catch (e) {
    }

    document.leadEmailCampaignForm.emailDate.value = scheduledOn;
    document.leadEmailCampaignForm.emailScheduledOn.value = scheduledOnDisp;
    $.datetimepicker.setTime(scheduledOnDisp, '');
    for (var ec = 0; ec < document.leadEmailCampaignForm.emailCampaign.length; ec++) {
        eval("emailCampaign = document.leadEmailCampaignForm.emailCampaign[" + ec + "].text");

        if (emailCampaign === templateName) {
            eval("document.leadEmailCampaignForm.emailCampaign[" + ec + "].selected = true");
        }
    }
    //    document.getElementById('addNewSchedule').style.display = "block";
}

function deleteScheduledEmail(MSID, LMRClientId, rowCnt) {
    var status = '';
    document.getElementById("emailLoader").style.display = 'block';
    setTimeout("deleteScheduledEmailCampaign('" + MSID + "', '" + LMRClientId + "', '" + rowCnt + "')", 200);
}

function deleteScheduledEmailCampaign(MSID, LMRClientId, rowCnt) {
    var rowNumbIndex = "";
    rowNumbIndex = document.getElementById(rowCnt).rowIndex;

    var url = "../backoffice/deleteScheduledEmail.php";
    var qstr = "MSID=" + MSID;
    var confirmMsg = confirm("Are you sure to delete this schedule?");
    if (confirmMsg) {
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            var status = xmlDoc.getElementsByTagName("status")[0].firstChild.nodeValue;
        } catch (e) {
        }
        if (status != '') {
            var table = document.getElementById('emailCamp').deleteRow(rowNumbIndex);
        }
    }
    document.getElementById("emailLoader").style.display = 'none';
}

function alertDummyEmail() {
    //alert("This client does not have a real email, please correct the email and try again.");
    toastrNotification("This client does not have a real email, please correct the email and try again.", 'error');
}

function saveFileSubstatusChange(formName, fldName, fldName2, substatusId, chk, opt) {
    var msg = '',
        chkVal = '',
        FID = 0, PCID = 0;
    if (chk) {
        chkVal = 1;
    } else if (!chk) {
        chkVal = 0;
    }

    try {
        eval("FID = document." + formName + "." + fldName + ".value");
    } catch (e) {
    }
    try {
        eval("FRID = document." + formName + "." + fldName2 + ".value");
    } catch (e) {
    }

    try {
        eval("PCID = document." + formName + ".PCID.value");
    } catch (e) {
        if ($('#FPCID').length > 0) {
            eval("PCID = document." + formName + ".FPCID.value");
        }
    }
    let url = "../pops/saveFileSubstatusChange.php";
    let qstr = "SSID=" + substatusId + "&chk=" + chk;
    if (opt === 'enc') {
        qstr += "&encFID=" + FID;
    } else {
        qstr += "&FID=" + FID;
    }
    if (opt === 'enc') {
        qstr += "&encFRID=" + FRID;
    } else {
        qstr += "&FRID=" + FRID;
    }
    if (PCID != '' || PCID != '0') {
        qstr += "&PCID=" + PCID;
    }

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        msg = xmlDoc.getElementsByTagName('msg')[0].firstChild.nodeValue;
    } catch (e) {
    }
}

function unique(a) {
    var r = new Array();
    o: for (var i = 0, n = a.length; i < n; i++) {
        for (var x = 0, y = r.length; x < y; x++) {
            if (r[x] == a[i]) continue o;
        }
        r[r.length] = a[i];
    }
    return r;
}

function deleteListingHistoryInfo(LMRId, LHId) {
    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: "Are you sure to delete?",
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            yes: function () {
                var delCnt = 0,
                    url = "",
                    qstr = "";
                url = "../backoffice/deleteListingHistoryInfo.php";
                qstr = "LId=" + LHId + "&LMRId=" + LMRId;
                //alert(url+"?"+qstr);
                try {
                    xmlDoc = getXMLDoc(url, qstr);
                } catch (e) {
                }
                try {
                    delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
                } catch (e) {
                }
                if (delCnt > 0) {
                    showListingInfo(LMRId);
                }
            },
            cancel: function () {

            },
        },
        onClose: function () {

        },
    });
}

function multiCheckValue(formName, sourceFldName, destinaionFldName) {
    var fld = "";
    var fldCnt = 0;
    var fldVal = "";
    var fldValues = "";
    var t = 0;
    var objLen = 0;
    try {
        eval("objLen = document." + formName + "." + sourceFldName + ".length");
    } catch (e) {
    }
    if (objLen > 0) {
        for (var i = 0; i < objLen; i++) {
            try {
                eval("fld = document." + formName + "." + sourceFldName + "[" + i + "]" + ".checked");
            } catch (e) {
            }
            if (fld) {
                try {
                    eval("fldVal = document." + formName + "." + sourceFldName + "[" + i + "]" + ".value");
                } catch (e) {
                }
                if (t == 0) {
                    fldValues = fldVal;
                } else {
                    fldValues += ", " + fldVal;
                }
                t++;
            }
        }
    } else {
        try {
            eval("var fld = document." + formName + "." + sourceFldName + ".checked");
        } catch (e) {
        }
        if (fld) {
            try {
                eval("fldValues = document." + formName + "." + sourceFldName + ".value");
            } catch (e) {
            }
        }
    }
    try {
        eval("document." + formName + "." + destinaionFldName + ".value = fldValues");
    } catch (e) {
    }
}

function validateTaskForm1() {
    multiCheckValue('addTaskForm', 'employeeId', 'employee');
    multiCheckValue('addTaskForm', 'agentId', 'agentIds');
    multiCheckValue('addTaskForm', 'branchId', 'branchIds');

    if ((isCheckUsers('addTaskForm', 'Please select the client'))) {
        if ((isBlankAlert('addTaskForm', 'taskSubj', 'Please enter the subject')) &&
            (isDateOK('addTaskForm', 'dueDate', 'Due Date')) &&
            (isBlankAlert('addTaskForm', 'taskStatus', 'Please Select the Status')) &&
            (validateTaskUploadDoc())
        ) {
            return false;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function isCheckUsers(addTaskForm, alertMsg) {
    var val1 = false,
        val2 = false,
        val3 = false,
        val4 = false;
    var taskOpt = "",
        altMsg = "";
    val1 = isCheckClient(formName, 'selectedClient');
    val2 = isBlankUsers(formName, 'employeeId');
    val3 = isBlankUsers(formName, 'agentIds');
    val4 = isBlankUsers(formName, 'branchIds');
    eval("taskOpt = document." + formName + ".taskOpt.value");
    if (taskOpt === "general") {
        altMsg = "Please select any employee / agent / branch.";
    } else {
        altMsg = "Please select any client / employee / agent / branch.";
    }
    if ((!val1) && (!val2) && (!val3) && (!val4)) {
        // alert(altMsg);
        toastrNotification(altMsg, 'error');
        return false;
    } else {
        return true;
    }
}

function isBlankUsers(formName, fieldName) {
    var fld = "";
    eval("fld = document." + formName + "." + fieldName + ".value");
    fld = trim(fld);
    return fld !== "";
}

function isCheckClient(formName, fldName) {
    var selectedClient = false;
    try {
        eval("selectedClient = document." + formName + "." + fldName + ".checked");
    } catch (e) {
    }

    return selectedClient === true;
}

function validateTaskUploadDoc() {

    var taskId = 0;
    taskId = document.addTaskForm.taskId.value;

    if (taskId > 0) {
        return true;
    } else {
        var path = document.addTaskForm.fileSrc.value;
        var path_len = path.length;
        var file_length = path.lastIndexOf('\\');
        var fileName = path.substring(file_length + 1, path_len);

        if (path !== "") {
            path_len = path.length;
            let file_extension = path.lastIndexOf('.');
            let file_ext_string = path.substring(file_extension + 1, path_len);
            if ((file_ext_string === "pdf") || (file_ext_string === "PDF") ||
                (file_ext_string === "doc") || (file_ext_string === "DOC") ||
                (file_ext_string === "docx") || (file_ext_string === "DOCX") ||
                (file_ext_string === "xls") || (file_ext_string === "XLS") ||
                (file_ext_string === "xlsx") || (file_ext_string === "XLSX") ||
                (file_ext_string === "jpg") || (file_ext_string === "jpeg") ||
                (file_ext_string === "JPG") || (file_ext_string === "JPEG") ||
                (file_ext_string === "pjpeg") || (file_ext_string === "gif") ||
                (file_ext_string === "PJPEG") || (file_ext_string === "GIF") ||
                (file_ext_string === "png") || (file_ext_string === "PNG") ||
                (file_ext_string === "html") || (file_ext_string === "HTML") ||
                (file_ext_string === "htm") || (file_ext_string === "HTM") ||
                (file_ext_string === "shtml") || (file_ext_string === "SHTML")
            ) {
                return true;
            } else {
                //alert ("File types allowed are pdf, doc, docx, xls, xlsx, gif, jpeg, png, html, htm, shtml.");
                toastrNotification("File types allowed are pdf, doc, docx, xls, xlsx, gif, jpeg, png, html, htm, shtml.", 'error');
                return false;
            }
        }
        return true;
    }

}

/** Employee assign **/



function deleteEmployee(rowIdNumb, formName, processorId, LMRId) {
    var statusMsg = '';
    document.getElementById('sessMsg').innerHTML = '';

    var url = "../pops/deleteEmployee.php";
    var qstr = "processorId=" + processorId + "&LMRId=" + LMRId;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }

    try {
        statusMsg = xmlDoc.getElementsByTagName("statusMsg")[0].firstChild.nodeValue;
    } catch (e) {
    }
    showAndhideEmpLoader('none');
    if (statusMsg != '') {

        $.confirm({
            icon: 'fa fa-warning',
            closeIcon: true,
            title: 'Success',
            content: statusMsg,
            type: 'green',
            backgroundDismiss: true,
            buttons: {
                cancel: {
                    text: 'Close',
                    action: function () {
                    }
                }
            },
            onClose: function () {
            },
        });


        // document.getElementById("sessMsg").innerHTML = "<b>" + statusMsg + "</b>";
    }
}

function saveEmp(formName, LMRId) {
    document.getElementById('sessMsg').innerHTML = '';
    statusMsg = '';
    try {
        eval("employeeId = document." + formName + ".empName.value");
    } catch (e) {
    }

    var url = "../pops/assignEmpSave.php";
    var qstr = "employeeId=" + employeeId + "&LMRId=" + LMRId;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        statusMsg = xmlDoc.getElementsByTagName("statusMsg")[0].firstChild.nodeValue;
    } catch (e) {
    }
    showAndhideEmpLoader('none');
    if (statusMsg != '') {
        document.getElementById("sessMsg").innerHTML = "<b>" + statusMsg + "</b>";
    }

}

function displaySelectedEmployees(formName) {
    document.getElementById('sessMsg').innerHTML = '';
    var empId = "",
        LMRId = 0,
        selectedEmpId = '';
    eval("empId = document." + formName + ".empName.value");
    eval("LMRId = document." + formName + ".LMRId.value");
    if (empId != "") {
        var selectedEmpId = "",
            selectedEmpIdArray = new Array();
        selectedEmpId = document.employeeForm.selectedEmpId.value;
        selectedEmpIdArray = selectedEmpId.split(',');
        if (!isValueInArray(selectedEmpIdArray, empId)) {
            showAndhideEmpLoader('block');
            setTimeout("addEmployee('" + formName + "', '" + LMRId + "')", 200);
        } else {
            //alert('Employee is already added.');
            toastrNotification("Employee is already added.", 'warning');
        }
    } else {
        //alert('Please select any one');
        toastrNotification("Please select any one", 'error');
    }
}

function addEmployee(formName, LMRId) {
    var rowCount = 0,
        employeeId = "",
        employeeName = "",
        employeeRole = "",
        empId = "";
    var rowIdNumb = 0,
        w = '';
    EmpVal = '';
    tab = '';

    var table = document.getElementById('empListTable');
    rowCount = table.rows.length;

    eval("rowIdNumb =  document." + formName + ".rowIdNumb.value");

    var row = table.insertRow(rowCount);
    row.id = 'emp_' + rowIdNumb;

    try {
        eval("employeeId = document." + formName + ".empName.value");
    } catch (e) {
    }
    if (employeeId > 0) {
        var url = "../backoffice/getEmployeeRole.php";
        var qstr = "employeeId=" + employeeId;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            employeeRole = xmlDoc.getElementsByTagName("employeeRole")[0].firstChild.nodeValue;
        } catch (e) {
        }
    }
    try {
        eval("w = document." + formName + ".empName.selectedIndex");
        eval("employeeName = document." + formName + ".empName.options[w].text");
    } catch (e) {
    }
    employeeNameDisp = employeeName;
    if (employeeRole != "") {
        employeeName += ' (<b>' + employeeRole + '</b>)';
    }

    var cell1 = row.insertCell(0);
    cell1.innerHTML = employeeName;
    try {
        eval("tab = document." + formName + ".tab.value");
    } catch (e) {
    }
    if (tab == 'contact' || tab == 'admin' || tab == 'pl' || tab == 'CI') {
        flval = "ass_" + employeeId;
        if (tab == 'pl') {
            EmpVal = document.getElementById("divListAssignEmp" + LMRId).innerHTML;
            document.getElementById("divListAssignEmp" + LMRId).innerHTML = EmpVal + "<span id=" + flval + "><b>" + employeeRole + ": </b>" + employeeNameDisp + "</span><br>";
            $('#' + LMRId + ' a').attr("title", EmpVal + "<span id=" + flval + "><b>" + employeeRole + ": </b>" + employeeNameDisp + "</span>");
        } else {
            EmpVal = document.getElementById("divListAssignEmp").innerHTML;
            document.getElementById("divListAssignEmp").innerHTML = EmpVal + "<span id=" + flval + "><b>" + employeeRole + ":</b>" + employeeNameDisp + "</span><br>";
            $('.asgn_emp').attr("title", EmpVal + "<span id=" + flval + "><b>" + employeeRole + ": </b>" + employeeNameDisp + "</span>");
        }
    }
    var cell2 = row.insertCell(1);
    cell2.className = 'pad5 left with-children-tip';
    cell2.innerHTML = "<a href=\"javascript: removeSelectedEmployee('" + rowIdNumb + "', '" + formName + "', '" + employeeId + "', '" + LMRId + "');\"  style=\"text-decoration:none\" class=\"fa fa-trash-o fa-2x icon-red tip-bottom\" alt=\"Click to remove\" title=\"Click to remove\"></a>";
    eval("empId = document." + formName + ".selectedEmpId.value");
    if (empId != "") {
        empId += "," + employeeId;
    } else {
        empId += employeeId;
    }
    eval("document." + formName + ".selectedEmpId.value = empId");
    eval("document." + formName + ".rowIdNumb.value = parseInt(rowIdNumb) + 1");
    saveEmp(formName, LMRId);
}

function removeSelectedEmployee(rowId, formName, employeeId, LMRId) {

    //    document.getElementById('sessMsg').innerHTML = '';
    setTimeout("removeEmployee('" + rowId + "', '" + formName + "', '" + employeeId + "', '" + LMRId + "')", 500);
}

function removeEmployee(rowId, formName, employeeId, LMRId) {
    var empId = "",
        newEmpId = "",
        rowNumbIndex = 0;

    rowNumbIndex = document.getElementById('emp_' + rowId).rowIndex;
    try {
        eval("tab = document." + formName + ".tab.value");
    } catch (e) {
    }
    if (tab == 'contact' || tab == 'admin' || tab == 'pl' || tab == 'CI') {
        flval = "ass_" + employeeId;
        $('#' + flval).remove();
        if (tab == 'pl') {
            EmpVal = document.getElementById("divListAssignEmp" + LMRId).innerHTML;
            document.getElementById("divListAssignEmp" + LMRId).innerHTML = EmpVal;
            $('#' + LMRId + ' a').attr("title", EmpVal);
        } else {
            EmpVal = document.getElementById("divListAssignEmp").innerHTML;
            document.getElementById("divListAssignEmp").innerHTML = EmpVal;
            $('.asgn_emp').attr("title", EmpVal);
        }
    }
    document.getElementById('empListTable').deleteRow(rowNumbIndex);

    eval("empId = document." + formName + ".selectedEmpId.value");
    newEmpId = removeValuesFromString(empId, employeeId);

    document.employeeForm.selectedEmpId.value = newEmpId;
    showAndhideEmpLoader('block');
    setTimeout("deleteEmployee('" + rowId + "', '" + formName + "', '" + employeeId + "', '" + LMRId + "');", "100");
}

function showAndhideEmpLoader(opt) {
    document.getElementById('empDivLoader').style.display = opt;
}

function getAllPackagesToEmail() {


    var AEUserType = "",
        pkgCnt = 0,
        empCnt = 0,
        pkg = 0,
        selectedPkg = "",
        pkg_lien1 = false;
    var pkg_lien2 = false,
        servicer2 = "",
        pkg_inst = false,
        pkg_proposal_bank = false;
    var pkg_proposal_agent = false,
        pkg_1stlien_third = false,
        pkg_2ndlien_third = false;
    var pkg_homeowner = false,
        pkg_payment_form = false,
        pkg_income = false,
        pkg_hardship = false;
    var pkg_4506 = false,
        pkg_HAM = false,
        pkg_proposal = false,
        pkg_1stlien_formal = false;
    var pkg_2ndlien_formal = false,
        pkg_1stlien_cover = false,
        pkg_2ndlien_cover = false;
    var docCnt = 0,
        dd = 0,
        selectedDoc = "",
        chkLienOpt = false,
        pkg_profit = false;
    var branchDoc = 0,
        branchDocLen = 0,
        docVal = "",
        docValues = "",
        doc1 = 0,
        ePkgCnt = 0;
    var epkg = 0,
        eselectedPkg = "";
    var docValues2 = "",
        userDocLen = 0,
        doc3 = 0;
    var docValues3 = "",
        custDocLen = 0,
        doc5 = 0;
    var docValues4 = "",
        eCustDocLen = 0,
        doc7 = 0;
    var faxReceiverNo = "",
        docRecipientEmail = "";
    var pkg_lender1 = "",
        pkg_lender2 = "",
        pkg_REBroker = "";
    var pkg_lien1Bank1RepName = "",
        pkg_lien2Bank1RepName = "";
    var binderDocLen = "",
        docLen = "",
        chk = "",
        binDoc = 0;

    try {
        AEUserType = document.docsName.AEUserType.value;
        AEUserType = trim(AEUserType);
    } catch (e) {
    }
    try {
        pkgCnt = document.loanModForm.pkgCnt.value;
        pkgCnt = parseFloat(pkgCnt);
    } catch (e) {
    }
    try {
        ePkgCnt = document.loanModForm.epkgCnt.value;
        ePkgCnt = parseFloat(ePkgCnt);
    } catch (e) {
    }
    try {
        empCnt = document.pkgForm.empCnt.value;
        empCnt = parseFloat(empCnt);
    } catch (e) {
    }
    try {
        esignCnt = document.loanModForm.esignCnt.value;
        esignCnt = parseFloat(esignCnt);
    } catch (e) {
    }
    /*
    try {
        pkg_income = document.pkgForm.pkg_income.checked;
    } catch(e) {}
    try {
        pkg_hardship = document.pkgForm.pkg_hardship.checked;
    } catch(e) {}
    try {
        pkg_4506 = document.pkgForm.pkg_4506.checked;
    } catch(e) {}
    try {
        pkg_HAM = document.pkgForm.pkg_HAM.checked;
    } catch(e) {}
*/
    if (AEUserType == "PLO") {
        /*
        try {
            pkg_inst = document.pkgForm.pkg_inst.checked;
        } catch(e) {}
        try {
            pkg_profit = document.pkgForm.pkg_profit.checked;
        } catch(e) {}
*/
        try {
            servicer2 = document.pkgForm.servicer2.value;
            servicer2 = trim(servicer2);
        } catch (e) {
        }
        if (servicer2 != "") {
            if (pkgCnt > 0) {
                pkgCnt++;
            }
        }
        for (var p = 0; p < pkgCnt; p++) {
            var chk = false,
                pkgId = 0,
                pkg_title = "";
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
                if ((pkgId == "142") || (pkgId == "192") || (pkgId == "273") || (pkgId == "274") || (pkgId == "282")) {
                    pkg_lienVal = "";
                    if (document.docsName.pkg_lien.value != "") {
                        pkg_lienVal = document.docsName.pkg_lien.value + ",";
                    }
                    document.docsName.pkg_lien.value = pkg_lienVal + pkgId + '-' + pkg_title;
                }
                if (pkg > 0) {
                    selectedPkg += ",";
                }
                selectedPkg += pkgId;
                pkg++;
            }
        }
        for (var e = 0; e < ePkgCnt; e++) {
            var chk = false,
                pkgId = 0,
                pkg_title = "";
            try {
                eval("chk = document.loanModForm.epkg_" + e + ".checked");
            } catch (e) {
            }
            if (chk) {
                try {
                    eval("pkgId = document.loanModForm.epkg_" + e + ".value");
                } catch (e) {
                }
                try {
                    eval("pkg_title = document.loanModForm.epkg_" + e + ".title");
                } catch (e) {
                }
                if (epkg > 0) {
                    eselectedPkg += ",";
                }
                eselectedPkg += pkgId;
                epkg++;
            }
        }
        try {
            branchDocLen = document.loanModForm.branchDocCnt.value;
        } catch (e) {
        }

        for (var doc = 0; doc < branchDocLen; doc++) {
            var docChk = false,
                docVal = "";
            try {
                eval("docChk = document.loanModForm.branchDoc_" + doc + ".checked");
            } catch (e) {
            }

            if (docChk) {
                try {
                    eval("docVal = document.loanModForm.branchDoc_" + doc + ".value");
                } catch (e) {
                }
                if (doc1 > 0) {
                    docValues += ",";
                }
                docValues += docVal;
                doc1++;
            }
        }
        if (doc1 > 0) {
            document.docsName.sel_branch_doc.value = docValues;
        }

        try {
            userDocLen = loanModForm.pkgForm.userDocCnt.value;
        } catch (e) {
        }

        for (var doc2 = 0; doc2 < userDocLen; doc2++) {
            var docChk = false,
                docVal = "";
            try {
                eval("docChk = document.loanModForm.userDoc_" + doc2 + ".checked");
            } catch (e) {
            }

            if (docChk) {
                try {
                    eval("docVal = document.loanModForm.userDoc_" + doc2 + ".value");
                } catch (e) {
                }
                if (doc3 > 0) {
                    docValues2 += ",";
                }
                docValues2 += docVal;
                doc3++;
            }
        }
        if (doc3 > 0) {
            document.docsName.sel_user_doc.value = docValues2;
        }
        try {
            custDocLen = document.getElementById("custDocCnt").value;
        } catch (e) {
        }

        for (var doc4 = 0; doc4 < custDocLen; doc4++) {
            var docChk = false,
                docVal = "";
            try {
                eval("docChk = document.loanModForm.custDoc_" + doc4 + ".checked");
            } catch (e) {
            }

            if (docChk) {
                try {
                    eval("docVal = document.loanModForm.custDoc_" + doc4 + ".value");
                } catch (e) {
                }
                if (doc5 > 0) {
                    docValues3 += ",";
                }
                docValues3 += docVal;
                doc5++;
            }
        }
        if (doc5 > 0) {
            document.docsName.sel_cust_doc.value = docValues3;
        }
        try {
            eCustDocLen = document.loanModForm.eCustPkgCnt.value;
        } catch (e) {
        }


        for (var doc6 = 0; doc6 < eCustDocLen; doc6++) {
            var docChk = false,
                docVal = "";
            try {
                eval("docChk = document.loanModForm.eCustDoc_" + doc6 + ".checked");
            } catch (e) {
            }


            if (docChk) {
                try {
                    eval("docVal = document.loanModForm.eCustDoc_" + doc6 + ".value");
                } catch (e) {
                }
                if (doc7 > 0) {
                    docValues4 += ",";
                }
                docValues4 += docVal;
                doc7++;
            }
        }

        if (doc7 > 0) {
            document.docsName.eCustSelPkg.value = docValues4;
        }
        try {
            esignCntLen = document.loanModForm.esignCnt.value;
        } catch (e) {
        }

        var doc8 = 0,
            docVal = "";
        for (var doc9 = 0; doc9 < esignCntLen; doc9++) {
            var docChk = false;
            try {
                eval("docChk = document.loanModForm.esignDoc_" + doc9 + ".checked");
            } catch (e) {
            }


            if (docChk) {
                try {
                    eval("docVal5 = document.loanModForm.esignDoc_" + doc9 + ".value");
                } catch (e) {
                }
                if (doc8 > 0) {
                    docVal += ",";
                }
                docVal += docVal5;
                doc8++;
            }
        }
        /*
       try {
           eval("docLen = document.loanModForm['binderDoc[]']");
           binderDocLen = docLen.length;
       } catch(e) {}
       if(binderDocLen >0) {
           for(var j1=0; j1<docLen.length; j1++) {
   	       if(docLen[j1].checked) {
   	           binDoc++;
	       }
	   }
       } else {
	   try {
	       chk = docLen.checked;
	   } catch(e) {}
	   if(chk) {
	       binDoc++;
	   }
       }
*/
        if (((selectedPkg == 0) || (selectedPkg == "")) &&
            ((eselectedPkg == 0) || (eselectedPkg == "")) &&
            ((doc8 == 0) || (doc8 == "")) &&
            ((doc1 == 0) || (doc1 == "")) &&
            ((doc3 == 0) || (doc3 == "")) &&
            ((doc5 == 0) || (doc5 == "")) &&
            ((doc7 == 0) || (doc7 == "")) &&
            ((binDoc == 0) || (binDoc == ""))
        ) {
            // alert("Please select any package");
            toastrNotification("Please select any package", 'error');
            $('#popupSaveButton').removeAttr('disabled');
            return false;
        }


    } else {
        try {
            servicer2 = document.docsName.servicer2.value;
            servicer2 = trim(servicer2);
        } catch (e) {
        }
        if (servicer2 != "") {
            if (pkgCnt > 0) {
                pkgCnt++;
            }
        }
        for (var p = 0; p < pkgCnt; p++) {
            var chk = false,
                pkgId = 0,
                pkg_title = "";
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
                if ((pkgId == "142") || (pkgId == "192") || (pkgId == "273") || (pkgId == "274") || (pkgId == "282")) {
                    pkg_lienVal = "";
                    if (document.docsName.pkg_lien.value != "") {
                        pkg_lienVal = document.docsName.pkg_lien.value + ",";
                    }
                    document.docsName.pkg_lien.value = pkg_lienVal + pkgId + '-' + pkg_title;
                }
                if (pkg > 0) {
                    selectedPkg += ",";
                }
                selectedPkg += pkgId;
                pkg++;
            }
        }
        for (var e = 0; e < ePkgCnt; e++) {
            var chk = false,
                pkgId = 0,
                pkg_title = "";
            try {
                eval("chk = document.loanModForm.epkg_" + e + ".checked");
            } catch (e) {
            }
            if (chk) {
                try {
                    eval("pkgId = document.loanModForm.epkg_" + e + ".value");
                } catch (e) {
                }
                try {
                    eval("pkg_title = document.loanModForm.epkg_" + e + ".title");
                } catch (e) {
                }
                if (epkg > 0) {
                    eselectedPkg += ",";
                }
                eselectedPkg += pkgId;
                epkg++;
            }
        }
        /*
       $esignPkg= "";.
       for(var es=0;es<esignCnt;es++) {
           var chk3 = false, texnId = 0;
           try{
               eval("chk3 = document.pkgForm.esignDoc_"+es+".checked");
           } catch(e) {}
           if(chk3) {
               try{
                   eval("texnId = document.pkgForm.esignDoc_"+es+".value");
               } catch(e) {}
               if(es > 0) {
                   esignPkg +=  ",";
               }
               esignPkg += texnId;
           }
       }
*/
        try {
            esignCntLen = document.loanModForm.esignCnt.value;
        } catch (e) {
        }

        var doc8 = 0,
            docVal = "";
        for (var doc9 = 0; doc9 < esignCntLen; doc9++) {
            var docChk = false;
            try {
                eval("docChk = document.loanModForm.esignDoc_" + doc9 + ".checked");
            } catch (e) {
            }


            if (docChk) {
                try {
                    eval("docVal5 = document.loanModForm.esignDoc_" + doc9 + ".value");
                } catch (e) {
                }
                if (doc8 > 0) {
                    docVal += ",";
                }
                docVal += docVal5;
                doc8++;
            }
        }


        try {
            document.docsName.selectedPkg.value = selectedPkg;
        } catch (e) {
        }
        try {
            document.docsName.eselectedPkg.value = eselectedPkg;
        } catch (e) {
        }
        /*
       try {
           pkg_proposal_bank = document.pkgForm.pkg_proposal_bank.checked;
       } catch(e) {}
       try {
           pkg_proposal_agent = document.pkgForm.pkg_proposal_agent.checked;
       } catch(e) {}
       try {
           pkg_1stlien_third = document.pkgForm.pkg_1stlien_third.checked;
       } catch(e) {}
       try {
           pkg_2ndlien_third = document.pkgForm.pkg_2ndlien_third.checked;
       } catch(e) {}
       try {
           pkg_homeowner = document.pkgForm.pkg_homeowner.checked;
       } catch(e) {}
       try {
           pkg_payment_form = document.pkgForm.pkg_payment_form.checked;
       } catch(e) {}
*/
        try {
            document.docsName.esignPkg.value = docVal;
        } catch (e) {
        }

        try {
            branchDocLen = document.loanModForm.branchDocCnt.value;
        } catch (e) {
        }

        for (var doc = 0; doc < branchDocLen; doc++) {
            var docChk = false,
                docVal = "";
            try {
                eval("docChk = document.loanModForm.branchDoc_" + doc + ".checked");
            } catch (e) {
            }

            if (docChk) {
                try {
                    eval("docVal = document.loanModForm.branchDoc_" + doc + ".value");
                } catch (e) {
                }
                if (doc1 > 0) {
                    docValues += ",";
                }
                docValues += docVal;
                doc1++;
            }
        }
        if (doc1 > 0) {
            document.docsName.sel_branch_doc.value = docValues;
        }


        try {
            userDocLen = document.loanModForm.userDocCnt.value;
        } catch (e) {
        }

        for (var doc2 = 0; doc2 < userDocLen; doc2++) {
            var docChk = false,
                docVal = "";
            try {
                eval("docChk = document.loanModForm.userDoc_" + doc2 + ".checked");
            } catch (e) {
            }

            if (docChk) {
                try {
                    eval("docVal = document.loanModForm.userDoc_" + doc2 + ".value");
                } catch (e) {
                }
                if (doc3 > 0) {
                    docValues2 += ",";
                }
                docValues2 += docVal;
                doc3++;
            }
        }
        if (doc3 > 0) {
            document.docsName.sel_user_doc.value = docValues2;
        }

        try {
            custDocLen = document.getElementById("custDocCnt").value;
        } catch (e) {
        }
        for (var doc4 = 0; doc4 < custDocLen; doc4++) {
            var docChk = false,
                docVal = "";
            try {
                eval("docChk = document.loanModForm.custDoc_" + doc4 + ".checked");
            } catch (e) {
            }

            if (docChk) {
                try {
                    eval("docVal = document.loanModForm.custDoc_" + doc4 + ".value");
                } catch (e) {
                }
                if (doc5 > 0) {
                    docValues3 += ",";
                }
                docValues3 += docVal;
                doc5++;
            }
        }
        if (doc5 > 0) {
            document.docsName.sel_cust_doc.value = docValues3;
        }
        try {
            eCustDocLen = document.docsName.eCustPkgCnt.value;
        } catch (e) {
        }

        for (var doc6 = 0; doc6 < eCustDocLen; doc6++) {
            var docChk = false,
                docVal = "";
            try {
                eval("docChk = document.loanModForm.eCustDoc_" + doc6 + ".checked");
            } catch (e) {
            }

            if (docChk) {
                try {
                    eval("docVal = document.loanModForm.eCustDoc_" + doc6 + ".value");
                } catch (e) {
                }
                if (doc7 > 0) {
                    docValues4 += ",";
                }
                docValues4 += docVal;
                doc7++;
            }
        }
        if (doc7 > 0) {
            document.docsName.eCustSelPkg.value = docValues4;
        }
        /*
       try {
           eval("docLen = document.pkgForm['binderDoc[]']");
           binderDocLen = docLen.length;
       } catch(e) {}
       if(binderDocLen >0) {
           for(var j1=0; j1<docLen.length; j1++) {
   	       if(docLen[j1].checked) {
   	           binDoc++;
	       }
	   }
       } else {
	   try {
	       chk = docLen.checked;
	   } catch(e) {}
	   if(chk) {
	       binDoc++;
	   }
       }
*/
        /*if( ((selectedPkg == 0) || (selectedPkg == "")) &&
           ((eselectedPkg == 0) || (eselectedPkg == "")) &&
           ((doc8 == 0) || (doc8 == "")) &&
          ((doc1 == 0) || (doc1 == ""))  &&
          ((doc3 == 0) || (doc3 == ""))  &&
          ((doc5 == 0) || (doc5 == ""))    &&
          ((doc7 == 0) || (doc7 == ""))     &&
          ((binDoc == 0) || (binDoc == ""))
       ) {
           //alert("Please select any package");
            toastrNotification("Please select any package", 'error');
           return false;
       }*/

        var dre = '';
        var fxp = 0;
        var checked = $("#docsName input:checked").length > 0;
        var fxp = $('#faxPop').val();

        if (fxp == 0) {
            dre = $('#docRecipientEmail').val();
            if (dre != '') checked = true;
        }

        if (!checked) {
            toastrNotification("Please select any recipient", 'error');
            $('#popupSaveButton').removeAttr('disabled');
            return false;
        } else {
            $("#popupSaveButton").attr("disabled", true);
            return true;
        }
    }
    try {
        document.docsName.selectedPkg.value = selectedPkg;
    } catch (e) {
    }
    try {
        document.docsName.eselectedPkg.value = eselectedPkg;
    } catch (e) {
    }
    var pkg_broker = false,
        pkg_AE = false,
        pkg_borrower = false,
        pkg_coBorrower = false,
        pkg_emp = "",
        ee = 0,
        empCnt = 0;
    /*
    try {
        pkg_broker = document.pkgForm.pkg_broker.checked;
    } catch(e) {}
    try {
        pkg_AE = document.pkgForm.pkg_AE.checked;
    } catch(e) {}
    try {
        pkg_borrower = document.pkgForm.pkg_borrower.checked;
    } catch(e) {}
    try {
        pkg_coBorrower = document.pkgForm.pkg_coBorrower.checked;
    } catch(e) {}
    try {
        empCnt = document.pkgForm.empCnt.value;
    } catch(e) {}

    for(var e=0;e<empCnt;e++) {
       var chk = false, empId = 0;
       try{
           eval("chk = document.pkgForm.emp_"+e+".checked");
       } catch(e) {}
       if(chk) {
           try{
    	       eval("empId = document.pkgForm.emp_"+e+".value");
           } catch(e) {}
           if(ee > 0) {
	       pkg_emp +=  ",";
           }
           pkg_emp += empId;
           ee++;
       }
    }

    try{
        document.pkgForm.pkg_emp.value = pkg_emp;
    } catch(e) {}
    try {
        faxReceiverNo = document.pkgForm.faxReceiverNo.value;
    } catch(e) {}
    try {
        docRecipientEmail = document.pkgForm.docRecipientEmail.value;
    } catch(e) {}
    try {
        pkg_lender1 = document.pkgForm.pkg_lender1.checked;
    } catch(e) {}
    try {
        pkg_lender2 = document.pkgForm.pkg_lender2.checked;
    } catch(e) {}
    try {
        pkg_REBroker = document.pkgForm.pkg_REBroker.checked;
    } catch(e) {}
    try {
        pkg_lien1Bank1RepName = document.pkgForm.pkg_lien1Bank1RepName.checked;
    } catch(e) {}
    try {
        pkg_lien2Bank1RepName = document.pkgForm.pkg_lien2Bank1RepName.checked;
    } catch(e) {}

    if((!pkg_broker) && (!pkg_AE) && (!pkg_borrower) && (!pkg_coBorrower) && (!pkg_lender1) && (!pkg_lender2)&& (!pkg_REBroker)
        && (!pkg_lien1Bank1RepName) && (!pkg_lien2Bank1RepName) && ((pkg_emp == 0) || (pkg_emp == ""))
        && ((faxReceiverNo == 0) || (faxReceiverNo == ""))
        && (docRecipientEmail == "")
      ) {
        alert("Please select any recipient");
        return false;
    } else {
        return true;
    }
*/

}

function checkBeforeSendFax() {
    var pkgSel = false,
        allowedToSendFax = 0;
    pkgSel = getAllPackagesToEmail();

    if (pkgSel) {
        try {
            allowedToSendFax = document.docsName.allowedToSendFax.value;
        } catch (e) {
        }
        if (allowedToSendFax == 1) {
            return true;
        } else {
            //alert('Maximum allowed file(s) size is 50 MB per fax');
            /*
* Request   : Common Wealth Center to upload faxed document file size 14 to 50 mb..
* Date      : 01/16/2019

* Issue : Due to Server slow.
* Reverded back to 50 mb to 14 mb on January 26, 2019
*/
            toastrNotification("Maximum allowed file(s) size is 50 MB per fax", 'error');
            return false;
        }
    }
    return false;
}

/**
 * Validates 'Upload Docs Or Files' form.
 *
 * Gets count of number of files to be uploaded. Validates if the count of files to be uploaded are more
 * than one else it returns validation message. If files exist then it iterates through each file name and
 * valdiates it's exitension. If the given file extension is in allowed extensions then it returns the size
 * of the files.
 *
 * @param formName string  A string of form name to be validated.
 * @return int  An integer of size of a valid file to be uploaded.
 */
function validateUploadForm(formName) {
    var fileUpdLimit = 0,
        activateTab = '',
        uploadFileCnt = '';
    /**
     * Iterates value in for loop
     */
    var i = 1;
    /**
     * Count to confirm there are valid files to be uploaded. It checks if there is any valid file to
     * upload.
     */
    var k = 0;
    var s = 0;

    try {
        activateTab = $('#activeTab').val();
    } catch (e) {
    }

    fileUpdLimit = $('#fileUpdLimit').val();
    uploadFileCnt = $('#uploadFileCnt').val();

    if (!uploadFileCnt) {
        fileUpdLimit = 1;
    } else if (uploadFileCnt > 0) { // https://www.pivotaltracker.com/story/show/161626235
        fileUpdLimit = uploadFileCnt;
    }

    // Gets count to confirm there are valid files to be uploaded.
    for (i = 1; i <= fileUpdLimit; i++) {
        var path = "";
        var eDoc = '';
        var pathObj = document[formName]["fileSrc_" + i];
        eDocObj = document[formName]["eTxnID_" + i];
        if ((pathObj && (path = pathObj.value)) ||
            (eDocObj && (eDoc = eDocObj.value))
        ) {
            k++;
        }
    }
    cloudDocStartCnt = parseInt(fileUpdLimit) + 1;
    cloudDocEndCnt = parseInt(cloudDocStartCnt) + 9;

    for (i = cloudDocStartCnt; i <= cloudDocEndCnt; i++) {
        var url = "";
        urlObj = document[formName]["cloudDocUrl_" + i];
        if (urlObj && (url = urlObj.value)) {
            k++;
        }
    }

    if (k == 0) {
        toastrNotification('Select Files to Upload', 'error');
        pathObj.focus();
        pathObj.className = 'highlights';
        return false;
    }

    for (var i = 1; i <= fileUpdLimit; i++) {
        var path = "";
        var pathObj = document[formName]["fileSrc_" + i];
        var path = pathObj.value;
        var path_len = path.length;
        var file_length = path.lastIndexOf('\\');
        var fileName = path.substring(file_length + 1, path_len);
        if (activateTab == 'LA') {
            for (var j = 1; j <= fileUpdLimit; j++) {
                var path1 = "";
                path1Obj = document[formName]["fileSrc_" + j];
                if (path1Obj && (path1 = path1Obj.value)) {
                    if (chkIsBlank(formName, 'docName_' + j, 'Please enter the document name.')) {
                    } else {
                        return false;
                    }
                }
            }
        }

        if (path != '') {
            path_len = path.length;
            file_extension = path.lastIndexOf('.');
            file_ext_string = path.substring(file_extension + 1, path_len).toLowerCase();
            var valid_ext = ["pdf", "doc", "docx", "xls", "xlsx", "gif", "jpg", "jpeg", "png", "html", "htm", "shtml",
                "txt", "bmp", "aif", "aiff", "odt", "m4a", "mp3", "ra", "ram", "wav", "wma", "mid", "midi", "zip",
                "csv", "xlsm"
            ];
            if (valid_ext.indexOf(file_ext_string) > -1) {
                if (isValidFileName(fileName)) {
                    if ($('#loader').length > 0) {
                        document.getElementById('loader').style.display = 'block';
                    }
                    if ($('#docUpload').length > 0) {
                        document.getElementById("docUpload").disabled = true;
                    }
                    return GetFileSize(formName, "fileSrc_" + i);
                } else {
                    return false;
                }
            } else {
                toastrNotification('File types allowed are pdf, doc, docx, xls, xlsx, gif, jpeg, png, html, htm, shtml, bmp, txt, aif, aiff, odt, m4a, mp3, ra, ram, wav, wma, mid, midi, zip, xlsm, csv.', 'error');
                return false;
            }
        }
    }
    document.getElementById("docUpload").disabled = true;
    return true;
}

function validateHUDAndClientReportFile(fileID) {
    var extension = $('#' + fileID).val().split('.').pop().toLowerCase();

    if ($.inArray(extension, ["pdf", "doc", "docx", "xls", "xlsx", "gif", "jpg", "jpeg", "png", "html", "htm", "shtml",
        "txt", "bmp", "aif", "aiff", "odt", "m4a", "mp3", "ra", "ram", "wav", "wma", "mid", "midi", "zip",
        "csv", "xlsm"
    ]) == -1) {
        toastrNotification('File types allowed are pdf, doc, docx, xls, xlsx, gif, jpeg, png, html, htm, shtml, bmp, txt, aif, aiff, odt, m4a, mp3, ra, ram, wav, wma, mid, midi, zip, xlsm, csv.', 'error');
        $('#' + fileID).val('');
        return false;
    }
}

function validateUploadFormNew(formName) {
    var currentId = parseInt($(".selectDocCategoryCls:last").attr("id").split('_')[1])

    if (validationCheck(currentId)) {
        return false;
    }
    if ($("#uploadedFileId_" + currentId).val().trim() == '') {
        toastrNotification("Please Upload File", 'error');
        return false;
    }

    if ($("#uploadedFileId_" + currentId).val() != '') {
        parentTrId = "uploadDoc_" + currentId;
        $("#" + parentTrId).find('.disableAfterSaving').prop("disabled", false);
        $("#" + parentTrId).find('.disableAfterSaving').attr('readonly', false);
        $("#" + parentTrId).find('.uploadedFileClass').prop("disabled", true);
        $("#" + parentTrId).find('.driveUploadedurl').prop("disabled", true);

    }
    /* var fileUpdLimit = 0, activateTab = '', uploadFileCnt = '';
    /!**
     * Iterates value in for loop
     *!/
    var i = 1;
    /!**
     * Count to confirm there are valid files to be uploaded. It checks if there is any valid file to
     * upload.
     *!/
    var k = 0;
    var s = 0;

    try {
        activateTab = $('#activeTab').val();
    } catch (e){}

    fileUpdLimit    = $('#fileUpdLimit').val();
    uploadFileCnt   = $('#uploadFileCnt').val();

    if (!uploadFileCnt) {
        fileUpdLimit = 1;
    } else if (uploadFileCnt > 0) { // https://www.pivotaltracker.com/story/show/161626235
        fileUpdLimit = uploadFileCnt;
    }

    // Gets count to confirm there are valid files to be uploaded.
    for (i = 1; i <= fileUpdLimit; i++) {
        var path = ""; var eDoc = '';
        var pathObj = document[formName]["fileSrc_" + i];
        eDocObj = document[formName]["eTxnID_" + i];
        if ((pathObj && (path = pathObj.value))
            || (eDocObj && (eDoc = eDocObj.value))
        ) {
            k++;
        }
    }
    cloudDocStartCnt = parseInt(fileUpdLimit) + 1;
    cloudDocEndCnt = parseInt(cloudDocStartCnt) + 9;

    for (i = cloudDocStartCnt; i <= cloudDocEndCnt; i++) {
        var url = "";
        urlObj = document[formName]["cloudDocUrl_" + i];
        if (urlObj && (url = urlObj.value)) {
            k++;
        }
    }

    if (k == 0) {
        toastrNotification('Select Files to Upload', 'error');
        pathObj.focus();
        pathObj.className = 'highlights';
        return false;
    }

    for (var i = 1; i <= fileUpdLimit; i++) {
        var path = "";
        var pathObj = document[formName]["fileSrc_" + i];
        var path = pathObj.value;
        var path_len    = path.length;
        var file_length = path.lastIndexOf('\\');
        var fileName    = path.substring(file_length + 1, path_len);
        if (activateTab == 'LA') {
            for (var j = 1; j <= fileUpdLimit; j++) {
                var path1 = "";
                path1Obj = document[formName]["fileSrc_" + j];
                if (path1Obj && (path1 = path1Obj.value)) {
                    if (chkIsBlank(formName, 'docName_'+j, 'Please enter the document name.')) {
                    } else {
                        return false;
                    }
                }
            }
        }

        if (path != '') {
            path_len = path.length;
            file_extension = path.lastIndexOf('.');
            file_ext_string = path.substring(file_extension + 1, path_len).toLowerCase();
            var valid_ext = ["pdf", "doc", "docx", "xls", "xlsx", "gif", "jpg", "jpeg", "png", "html", "htm", "shtml",
                "txt", "bmp", "aif", "aiff", "odt", "m4a", "mp3", "ra", "ram", "wav", "wma", "mid", "midi", "zip",
                "csv", "xlsm"];
            if (valid_ext.indexOf(file_ext_string) > -1) {
                if (isValidFileName(fileName)) {
                    document.getElementById('loader').style.display = 'block';
                    document.getElementById("docUpload").disabled   = true;
                    return GetFileSize(formName, "fileSrc_" + i);
                } else {
                    return false;
                }
            } else {
                toastrNotification('File types allowed are pdf, doc, docx, xls, xlsx, gif, jpeg, png, html, htm, shtml, bmp, txt, aif, aiff, odt, m4a, mp3, ra, ram, wav, wma, mid, midi, zip, xlsm, csv.', 'error');
                return false;
            }
        }
    }
    document.getElementById("docUpload").disabled = true;*/


    return true;
}


function GetFileSize(formName, fileid) {
    var max_upload_size = 0,
        max_file_size = 0;

    try {
        eval("max_upload_size = document." + formName + ".max_upload_size.value");
    } catch (e) {
    }
    try {
        eval("max_file_size   = document." + formName + ".fileSize.value");
    } catch (e) {
    }
    try {
        var fileSize = 0;
        try {
            fileSize = $("#" + fileid)[0].files[0].size //size in kb
        } catch {
            if ($.browser.msie && parseInt($.browser.version) <= 8) {
                try {
                    var objFSO = new ActiveXObject("Scripting.FileSystemObject");
                    var filePath = $("#" + fileid)[0].value;
                    var objFile = objFSO.getFile(filePath);
                    fileSize = objFile.size; //size in kb
                } catch (e) {
                    // alert('Please activate ActiveX Component');
                    toastrNotification('Please activate ActiveX Component', 'error');
                    return false;
                }
            }
        }
        if (fileSize > max_upload_size) {
            // alert("File Size is too large. Allowed file size is "+max_file_size);
            toastrNotification("File Size is too large. Allowed file size is " + max_file_size, 'error');
            return false;
        } else {
            return true;
        }
    } catch (e) {
        // return false;
    }
}

/*
 * Check client email already exists.
 */

function checkClientEmailExists(formName, fldName) {
    var encryptedBranchID = 0,
        borrowerEmail = '',
        clientEmailExists = 0,
        encryptedCID = 0,
        publicUser = 0;
    var clientAdd = '',
        Opt = '';
    eval("encryptedBranchID = document." + formName + ".branchId.value");
    try {
        eval("encryptedCID = document." + formName + ".encryptedCId.value");
    } catch (e) {
    }
    try {
        eval("publicUser = document." + formName + ".publicUser.value");
    } catch (e) {
    }
    eval("borrowerEmail = document." + formName + "." + fldName + ".value");

    var url = siteSSLUrl + "backoffice/checkClientExists.php";
    var qstr = "email=" + borrowerEmail + "&eId=" + encryptedBranchID + "&cId=" + encryptedCID + "&PU=" + publicUser + "&Opt=Email";
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }

    try {
        clientEmailExists = xmlDoc.getElementsByTagName("clientExists")[0].firstChild.nodeValue;
    } catch (e) {
    }
    try {
        clientAdd = xmlDoc.getElementsByTagName("clientAdd")[0].firstChild.nodeValue;
    } catch (e) {
    }

    document.getElementById("showClientPhoneExists").innerHTML = '';

    if (clientEmailExists == 1) {
        if (publicUser == 1) {
            alertClientEmailExistsForPublic(borrowerEmail, clientAdd, formName);
        } else {
            alertClientEmailExists(borrowerEmail, clientAdd, formName);
        }
    }
}

function checkClientExists(formName, fldName, Opt) {

    showLoader();
    if (Opt == 'Email') {
        try {
            document.getElementById("divLo1").style.display = "block";
        } catch (e) {
        }
    } else if (Opt == 'Phone') {
        try {
            document.getElementById("divLo2").style.display = "block";
        } catch (e) {
        }
    }
    if (Opt == 'Email') {
        checkClientEmailExists(formName, fldName);
    } else if (Opt == 'Phone') {
        checkClientPhoneExist(formName);
    }
    if (Opt == 'Email') {
        try {
            document.getElementById("divLo1").style.display = "none";
        } catch (e) {
        }
    } else if (Opt == 'Phone') {
        try {
            document.getElementById("divLo2").style.display = "none";
        } catch (e) {
        }
    }
    setTimeout("hideLoader()", 100);
}

function alertClientEmailExistsForPublic(borrowerEmail, clientAdd, formName) {
    var LMRId = 0;
    try {
        eval("LMRId = document." + formName + ".LMRId.value");
    } catch (e) {
    }

    var addlnButtons = {};
    if (clientAdd != '') {
        var buttonText = 'Add Additional';
    } else {
        var buttonText = 'Continue';
    }
    addlnButtons[buttonText] = function () {
        document.getElementById("showClientEmailExists").innerHTML = "<h4>You are creating multiple file for this client.</h4>";
        $(this).dialog("close");
    };
    addlnButtons['Cancel'] = function () {
        $(this).dialog("close");
    };
    $("#alert").dialog({
        title: '',
        autoOpen: true,
        closeOnEscape: false,
        draggable: false,
        width: 460,
        minHeight: 50,
        modal: true,
        buttons: addlnButtons,
        resizable: false
    });
    if (clientAdd != '') {
        if (LMRId > 0) {
            $('#alert').html('<h4 style="color:#FF0000;line-height:20px;">Client email address already exists!<br>Would you like to update borrower info?<h4>');
        } else {
            $('#alert').html('<h4 style="color:#FF0000;line-height:20px;">Client email address already exists!<br>Would you like to edit file for</h4><h5>' + clientAdd + "</h5><h4> or would you like to add an additional property to this client's portfolio?</h4>");
        }
    } else {
        $('#alert').html('<h4 style="color:#FF0000;line-height:20px;">Client email address already exists!</h4>');

    }

}

function alertClientEmailExists(borrowerEmail, clientAdd, formName) {
    var LMRId = 0;
    try {
        eval("LMRId = document." + formName + ".LMRId.value");
    } catch (e) {
    }

    var addlnButtons = {};
    if (clientAdd != '') {
        var buttonText = 'Add Additional';
    } else {
        var buttonText = 'Continue';
    }
    addlnButtons[buttonText] = function () {
        document.getElementById("showClientEmailExists").innerHTML = "<h4>You are creating multiple file for this client.</h4>";
        $(this).dialog("close");
    };
    addlnButtons['Cancel'] = function () {
        goToPipeline(borrowerEmail);
        $(this).dialog("close");
    };
    $("#alert").dialog({
        title: '',
        autoOpen: true,
        closeOnEscape: false,
        draggable: false,
        width: 460,
        minHeight: 50,
        modal: true,
        buttons: addlnButtons,
        resizable: false
    });
    if (clientAdd != '') {

        if (LMRId > 0) {
            $('#alert').html('<h4 style="color:#FF0000;line-height:20px;">Client email address already exists!<br>Would you like to update borrower info?<h4>');
        } else {
            $('#alert').html('<h4 style="color:#FF0000;line-height:20px;">Client email address already exists!<br>Would you like to edit file for</h4><h5>' + clientAdd + "</h5><h4> or would you like to add an additional property to this client's portfolio?</h4>");
        }

    } else {
        $('#alert').html('<h4 style="color:#FF0000;line-height:20px;">Client email address already exists!</h4>');

    }
}

function goToPipeline(borrowerEmail) {
    try {
        document.getElementById("showClientEmailExists").innerHTML = "";
    } catch (e) {
    }
    window.location.href = "myPipeline.php?searchField=tb.clientEmail&searchTerm=" + borrowerEmail;
}

function goToPipelineNew(borrowerPhone) {
    try {
        document.getElementById("showClientEmailExists").innerHTML = "";
    } catch (e) {
    }
    window.location.href = "myPipeline.php?searchField=tb.clientPhone&searchTerm=" + borrowerPhone;
}

/*
 * Check borrower phone already exists.
 */

function checkClientPhoneExist(formName) {
    var borrowerPhone = "",
        phNo1 = "",
        phNo2 = "",
        phNo3 = "",
        ext = "";
    var clientPhoneExists = 0,
        encryptedPCID = 0,
        encryptedBranchID = 0,
        encryptedLId = 0,
        clientAdd = '',
        publicUser = 0;
    eval("phNo1 = document." + formName + ".phNo1.value");
    eval("phNo2 = document." + formName + ".phNo2.value");
    eval("phNo3 = document." + formName + ".phNo3.value");
    eval("ext = document." + formName + ".ext.value");
    borrowerPhone = phNo1 + phNo2 + phNo3 + ext;
    if (borrowerPhone.length > 9) {
        try {
            eval("encryptedPCID = document." + formName + ".encryptedPCID.value");
        } catch (e) {
        }
        try {
            eval("encryptedBranchID = document." + formName + ".branchId.value");
        } catch (e) {
        }
        try {
            eval("encryptedLId = document." + formName + ".encryptedLId.value");
        } catch (e) {
        }
        try {
            eval("publicUser = document." + formName + ".publicUser.value");
        } catch (e) {
        }

        var url = siteSSLUrl + "backoffice/checkClientExists.php";
        var qstr = "bPhone=" + borrowerPhone + "&LMRId=" + encryptedLId + "&eId=" + encryptedBranchID + "&PCID=" + encryptedPCID + "&PU=" + publicUser + "&Opt=Phone";
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            clientPhoneExists = xmlDoc.getElementsByTagName("borrowerPhoneExists")[0].firstChild.nodeValue;
        } catch (e) {
        }
        try {
            clientAdd = xmlDoc.getElementsByTagName("clientAdd")[0].firstChild.nodeValue;
        } catch (e) {
        }
        document.getElementById("showClientPhoneExists").innerHTML = '';
        if (clientPhoneExists == 1) {
            if (publicUser == 1) {
                alertClientPhoneExistsForPublic(borrowerPhone, clientAdd, formName);
            } else {
                alertClientPhoneExists(borrowerPhone, clientAdd, formName);
            }
        }

    }
}

function alertClientPhoneExists(borrowerPhone, clientAdd, formName) {
    var LMRId = 0;
    try {
        eval("LMRId = document." + formName + ".LMRId.value");
    } catch (e) {
    }


    var addlnButtons = {};
    if (clientAdd != '') {
        var buttonText = 'Add Additional';
    } else {
        var buttonText = 'Continue';
    }
    addlnButtons[buttonText] = function () {
        document.getElementById("showClientPhoneExists").innerHTML = "<h4>Borrower's phone number already exists..</h4>";
        $(this).dialog("close");
    };
    addlnButtons['Cancel'] = function () {
        goToPipelineNew(borrowerPhone);
        $(this).dialog("close");
    };

    $("#alertphone").dialog({
        title: '',
        autoOpen: true,
        closeOnEscape: false,
        draggable: false,
        width: 460,
        minHeight: 50,
        modal: true,
        buttons: addlnButtons,
        resizable: false
    });
    if (clientAdd != '') {

        if (LMRId > 0) {
            $('#alertphone').html('<h4 style="color:#FF0000;line-height:20px;">Borrower\'s phone number already exists!<br>Would you like to update borrower info?<h4>');
        } else {
            $('#alertphone').html('<h4 style="color:#FF0000;line-height:20px;">Borrower\'s phone number already exists!<br>Would you like to edit file for</h4><h5> ' + clientAdd + "</h5><h4> or would you like to add an additional property to this client's portfolio?</h4>");
        }
    } else {
        $('#alertphone').html('<h4 style="color:#FF0000;line-height:20px;">Borrower\'s phone number already exists!</h4>');

    }
}

function alertClientPhoneExistsForPublic(borrowerPhone, clientAdd, formName) {
    var LMRId = 0;
    try {
        eval("LMRId = document." + formName + ".LMRId.value");
    } catch (e) {
    }

    var addlnButtons = {};
    if (clientAdd != '') {
        var buttonText = 'Add Additional';
    } else {
        var buttonText = 'Continue';
    }
    addlnButtons[buttonText] = function () {
        document.getElementById("showClientPhoneExists").innerHTML = "<h4>Borrower's phone number already exists..</h4>";
        $(this).dialog("close");
    };
    addlnButtons['Cancel'] = function () {
        $(this).dialog("close");
    };

    $("#alertphone").dialog({
        title: '',
        autoOpen: true,
        closeOnEscape: false,
        draggable: false,
        width: 460,
        minHeight: 50,
        modal: true,
        buttons: addlnButtons,
        resizable: false
    });
    if (clientAdd != '') {
        if (LMRId > 0) {
            $('#alertphone').html('<h4 style="color:#FF0000;line-height:20px;">Borrower\'s phone number already exists!<br>Would you like to update borrower info?<h4>');
        } else {
            $('#alertphone').html('<h4 style="color:#FF0000;line-height:20px;">Borrower\'s phone number already exists!<br>Would you like to edit file for</h4><h5> ' + clientAdd + "</h5><h4> or would you like to add an additional property to this client's portfolio?</h4>");
        }

    } else {
        $('#alertphone').html('<h4 style="color:#FF0000;line-height:20px;">Borrower\'s phone number already exists!</h4>');

    }
}

function editExistingFileForPhone() {
    try {
        document.getElementById("showClientPhoneExists").innerHTML = "";
    } catch (e) {
    }
    try {
        document.getElementById("btnSave").disabled = false;
    } catch (e) {
    }
}

function displayPhoneMsg() {
    closeClientPhonePopup();
    try {
        document.getElementById("btnSave").disabled = false;
    } catch (e) {
    }
}

function closeClientPhonePopup() {
    try {
        document.getElementById("showClientPhoneExists").innerHTML = "<h4>Borrower's phone number already exists.</h4>";
    } catch (e) {
    }
}

function showClientInfo(notesAsPrivate) {
    var seePrivate = 0,
        allowToAccessPrivateNotes = 0;
    seePrivate = $('#seePrivate').val();
    allowToAccessPrivateNotes = $('#allowToAccessPrivateNotes').val();
    if (notesAsPrivate == 1) {
        $('#clientDiv').show();
        $('#branchDiv1').show();
        $('#branchDiv2').show();
        $('#agentDiv1').show();
        $('#agentDiv2').show();
        $('#loanOfficerDiv1').show();
        $('#loanOfficerDiv2').show();
        $('#otherBoxDiv1').show();
        $('#otherBoxDiv2').show();
        $('#customRecipientEmail2').show();

        //        $('div[id^="private_"]').show();
        $('input:checkbox[id^="private_"]').attr("disabled", false);
        $('input:checkbox[id^="private_"]').attr("checked", false);
    } else {
        $('#clientDiv').hide();
        if (seePrivate == 0) {
            $('#branchDiv1').hide();
            $('#branchDiv2').hide();
        }
        if (allowToAccessPrivateNotes == 0) {
            $('#agentDiv1').hide();
            $('#agentDiv2').hide();
            $('#loanOfficerDiv1').hide();
            $('#loanOfficerDiv2').hide();
        }
        $('#otherBoxDiv1').hide();
        $('#otherBoxDiv2').hide();
        $('#customRecipientEmail2').hide();
        //        $('div[id^="private_"]').hide();
        $('input:checkbox[id^="private_"]').attr("disabled", true);
        $('input:checkbox[id^="private_"]').attr("checked", false);
    }
}

function showBillableMinutes() {
    var updateBillable = 0;
    updateBillable = $('#updateBillable').val();
    if (updateBillable == 1) {
        // $('#billableMinutes').attr("disabled", false);
        //$('#billingRate').attr("disabled", false);
        $('#billableMinutesDiv1').show();
        $('#billableMinutesDiv2').show();
        $('#billableMinutesDiv3').show();
        $('#billableMinutesDiv4').show();
    } else {
        //  $('#billableMinutes').attr("disabled", true);
        // $('#billingRate').attr("disabled", true);
        $('#billableMinutesDiv1').hide();
        $('#billableMinutesDiv2').hide();
        $('#billableMinutesDiv3').hide();
        $('#billableMinutesDiv4').hide();
    }
}

/* Hide or show the check / credit card section.
 * Check form will show up if account number is present. Credit card form will show if card # is given.
 */
function disableFormFields(oForm) {
    tabOpt = '';
    var userRole = '';
    tabOpt = $("input[name='activeTab']").val();
    if (tabOpt == 'BC') {
        // document.getElementById(oForm).className = '';
        $('#' + oForm + ' input').attr('disabled', 'disabled');
        $('#' + oForm + ' select').attr('disabled', 'disabled');

        if (oForm == "cardInfoDiv") {
            document.getElementById("mAddressSwitchCard").style.display = "none";
        } else {
            document.getElementById("mAddressSwitchCheck").style.display = "none";
        }
    }
}

function enableFormFields(oForm) {
    var tabOpt = userRole = userGroup = externalBroker = '';
    var editBrokerCCInfo = editBranchCCInfo = publicUser = allowToSeeBillingSectionForFile = editLoanOfficerCCInfo = 0;
    tabOpt = $("input[name='activeTab']").val();
    editBrokerCCInfo = getFieldsValue('editBrokerCCInfo');
    editBranchCCInfo = getFieldsValue('editBranchCCInfo');
    publicUser = getFieldsValue('publicUser');
    allowToSeeBillingSectionForFile = getFieldsValue('allowToSeeBillingSectionForFile');
    try {
        userRole = $('#userRole').val();
    } catch (e) {
    }
    try {
        if (userRole == 'Agent') {
            externalBroker = $('#externalBroker').val();
            editLoanOfficerCCInfo = $('#editLoanOfficerCCInfo').val();
        }
    } catch (e) {
    }

    try {
        userGroup = $('#userGroup').val();
    } catch (e) {
    }
    if (tabOpt == 'BC') {
        //document.getElementById(oForm).className = 'clsBgLMRWhite block-content row';
        $('#' + oForm + ' input').attr('disabled', false);
        $('#' + oForm + ' select').attr('disabled', false);
        if (oForm == "cardInfoDiv") {
            document.getElementById("mAddressSwitchCard").style.display = "block";
        } else {
            document.getElementById("mAddressSwitchCheck").style.display = "block";
        }
    }
    if (userRole == 'Client' || userRole == 'Super' || userRole == 'Manager' || publicUser == 1) {
    } else {
        if ((userRole == 'Agent' && editBrokerCCInfo == 1 && externalBroker == 0) || (userRole == 'Agent' && editLoanOfficerCCInfo == 1 && externalBroker == 1) || (userRole == 'Branch' && editBranchCCInfo == 1) || (userGroup == 'Employee' && allowToSeeBillingSectionForFile == 1)) {
            if (oForm == 'checkInfoDiv') {
                $('#ACTRoutingNumber').attr('disabled', false);
                $('#ACTNumber').attr('disabled', false);
            } else {
                $('#creditCardNumber').attr('disabled', false);
                $('#cardNumberOnBack').attr('disabled', false);
            }
        } else {
            if (oForm == 'checkInfoDiv') {
                $('#ACTRoutingNumber').attr('disabled', 'disabled');
                $('#ACTNumber').attr('disabled', 'disabled');
            } else {
                $('#creditCardNumber').attr('disabled', 'disabled');
                $('#cardNumberOnBack').attr('disabled', 'disabled');
            }
        }
    }
}

function saveFileNotes() {
    if (chkIsBlank('addNotesForm', 'processorNotes', 'Please Enter Notes.')) {
        $('#loaderDiv').show();
        document.getElementById("submit").disabled = true;
        $('input:button').attr("disabled", true);
        addFileNotes();
        return true;
    } else {
        return false;
    }

}

function addFileNotes() {
    var LMRId = 0,
        LMRResponseId = 0,
        executiveId = 0,
        brokerNumb = 0,
        LMRNotesId = 0;
    var notesType = '',
        notesAsPrivate = 0,
        borrowerEmail = '',
        coBorrowerEmail = '',
        brokerEmail = '',
        SecondarybrokerEmail = '',
        SecondarybrokerName = '',
        SecondarybrokerNumber = '';
    var employeeIds = '',
        sendSMS = 0,
        clientName = '',
        coBorrowerName = '',
        LMRExecutive = '';
    var processorNotes = '',
        branchEmail = '',
        brokerName = '',
        status = 0,
        msg = '';
    var opt = '',
        updateBillable = 0,
        billableMinutes = 0,
        billingRate = '',
        customRecipientEmail = '';
    var userName = '',
        userNumber = 0,
        userGroup = '',
        userRole = '',
        redirect = '',
        userEmail = '';

    LMRId = $('#LMRId').val();
    LMRResponseId = $('#rId').val();
    executiveId = $('#executiveId').val();
    brokerNumb = $('#brokerNumb').val();
    LMRNotesId = $('#LMRNotesId').val();
    notesType = $('#fileNotesType').val();
    opt = $('#opt').val();

    try {
        userName = $('#userName').val();
    } catch (e) {
    }
    try {
        userNumber = $('#userNumber').val();
    } catch (e) {
    }
    try {
        userGroup = $('#userGroup').val();
    } catch (e) {
    }
    try {
        userRole = $('#userRole').val();
    } catch (e) {
    }
    try {
        userEmail = $('#userEmail').val();
    } catch (e) {
    }

    try {
        notesAsPrivate = getRadioBtnValue('addNotesForm', 'notesAsPrivate');
    } catch (e) {
    }
    try {
        if (document.addNotesForm.borrowerEmail1.checked) {
            borrowerEmail = $('#borrowerEmail1').val();
        }
    } catch (e) {
    }
    try {
        if (document.addNotesForm.coBorrowerEmail1.checked) {
            coBorrowerEmail = $('#coBorrowerEmail1').val();
        }
    } catch (e) {
    }
    try {
        if (document.addNotesForm.branchEmail.checked) {
            branchEmail = $('#branchEmail').val();
        }
    } catch (e) {
    }
    try {
        if (document.addNotesForm.brokerEmail.checked) {
            brokerEmail = $('#brokerEmail').val();
        }
    } catch (e) {
    }

    try {
        if (document.addNotesForm.SecondarybrokerEmail.checked) {
            SecondarybrokerEmail = $('#SecondarybrokerEmail').val();
        }
    } catch (e) {
    }

    try {
        SecondarybrokerName = $('#SecondarybrokerName').val();
    } catch (e) {
    }

    try {
        SecondarybrokerNumber = $('#SecondarybrokerNumber').val();
    } catch (e) {
    }


    employeeIds = $('#employeeIds').val();

    clientName = $('#clientName').val();
    coBorrowerName = $('#coBorrowerName').val();
    LMRExecutive = $('#LMRExecutive').val();
    processorNotes = $('#processorNotes').val();

    if ($('#notesEOpt').val() == 'edit') {
    } else {
        try {
            sendSMS = $('#sendSMS').val();
        } catch (e) {
        }
        try {
            var customRecipientEmail = $('#addNotesForm').contents().find('#customRecipientEmail').val();
        } catch (e) {
        }
        try {
            billingRate = $('#billingRate').val();
        } catch (e) {
        }
        try {
            updateBillable = $('#updateBillable').val();
        } catch (e) {
        }
        try {
            billableMinutes = $('#billableMinutes').val();
        } catch (e) {
        }
    }
    processorNotes = processString(processorNotes);
    //    processorNotes = Unaccent(processorNotes)

    brokerName = $('#brokerName').val();

    var ssServicer1 = '',
        ssServicer2 = '',
        ssAttorneyName = '',
        lenderEmail1 = '',
        lenderEmail2 = '',
        ssAttorneyEmail = '',
        listingRealtor = '',
        buyerEmail1 = '',
        buyer1AgentEmail = '',
        listingRealtorName = '',
        buyer1Name = '',
        buyerAgentName1 = '';
    var buyer1LOOfficer = '',
        buyerEmail2 = '',
        buyer2AgentEmail = '',
        ssBuyer1LOName = '',
        ssBuyerName2 = '',
        ssBuyer2AgentName = '';
    var buyer2LOOfficer = '',
        buyerEmail3 = '',
        buyer3AgentEmail = '',
        ssBuyer2LOName = '',
        ssBuyerName3 = '',
        ssBuyer3AgentName = '',
        sendNoteOnly = 0;
    var buyer3LOOfficer = '',
        ssParalegalEmail = '',
        ssTitleCompanyEmail = '',
        ssBuyer3LOName = '',
        ssParalegalName = '',
        ssTitleName = '',
        sentType = 'notes',
        contact_ids = '';

    try {
        ssServicer1 = $('#ssServicer1').val();
    } catch (e) {
    }
    try {
        ssServicer2 = $('#ssServicer2').val();
    } catch (e) {
    }

    try {
        ssAttorneyName = $('#ssAttorneyName').val();
    } catch (e) {
    }
    try {
        if (document.addNotesForm.lenderEmail1.checked) {
            lenderEmail1 = $('#lenderEmail1').val();
        }
    } catch (e) {
    }
    try {
        if (document.addNotesForm.lenderEmail2.checked) {
            lenderEmail2 = $('#lenderEmail2').val();
        }
    } catch (e) {
    }
    try {
        if (document.addNotesForm.ssAttorneyEmail.checked) {
            ssAttorneyEmail = $('#ssAttorneyEmail').val();
        }
    } catch (e) {
    }

    try {
        if (document.addNotesForm.listingRealtor.checked) {
            listingRealtor = $('#listingRealtor').val();
        }
    } catch (e) {
    }
    try {
        if (document.addNotesForm.buyerEmail1.checked) {
            buyerEmail1 = $('#buyerEmail1').val();
        }
    } catch (e) {
    }

    try {
        if (document.addNotesForm.buyer1AgentEmail.checked) {
            buyer1AgentEmail = $('#buyer1AgentEmail').val();
        }
    } catch (e) {
    }

    try {
        listingRealtorName = $('#listingRealtorName').val();
    } catch (e) {
    }
    try {
        buyer1Name = $('#buyer1Name').val();
    } catch (e) {
    }
    try {
        buyerAgentName1 = $('#buyerAgentName1').val();
    } catch (e) {
    }


    try {
        if (document.addNotesForm.buyer1LOOfficer.checked) {
            buyer1LOOfficer = $('#buyer1LOOfficer').val();
        }
    } catch (e) {
    }
    try {
        if (document.addNotesForm.buyerEmail2.checked) {
            buyerEmail2 = $('#buyerEmail2').val();
        }
    } catch (e) {
    }
    try {
        if (document.addNotesForm.buyer2AgentEmail.checked) {
            buyer2AgentEmail = $('#buyer2AgentEmail').val();
        }
    } catch (e) {
    }

    try {
        ssBuyer1LOName = $('#ssBuyer1LOName').val();
    } catch (e) {
    }
    try {
        ssBuyerName2 = $('#ssBuyerName2').val();
    } catch (e) {
    }
    try {
        ssBuyer2AgentName = $('#ssBuyer2AgentName').val();
    } catch (e) {
    }


    try {
        if (document.addNotesForm.buyer2LOOfficer.checked) {
            buyer2LOOfficer = $('#buyer2LOOfficer').val();
        }
    } catch (e) {
    }
    try {
        if (document.addNotesForm.buyerEmail3.checked) {
            buyerEmail3 = $('#buyerEmail3').val();
        }
    } catch (e) {
    }
    try {
        if (document.addNotesForm.buyer3AgentEmail.checked) {
            buyer3AgentEmail = $('#buyer3AgentEmail').val();
        }
    } catch (e) {
    }

    try {
        ssBuyer2LOName = $('#ssBuyer2LOName').val();
    } catch (e) {
    }
    try {
        ssBuyerName3 = $('#ssBuyerName3').val();
    } catch (e) {
    }
    try {
        ssBuyer3AgentName = $('#ssBuyer3AgentName').val();
    } catch (e) {
    }


    try {
        if (document.addNotesForm.buyer3LOOfficer.checked) {
            buyer3LOOfficer = $('#buyer3LOOfficer').val();
        }
    } catch (e) {
    }
    try {
        if (document.addNotesForm.ssParalegalEmail.checked) {
            ssParalegalEmail = $('#ssParalegalEmail').val();
        }
    } catch (e) {
    }
    try {
        if (document.addNotesForm.ssTitleCompanyEmail.checked) {
            ssTitleCompanyEmail = $('#ssTitleCompanyEmail').val();
        }
    } catch (e) {
    }

    try {
        ssBuyer3LOName = $('#ssBuyer3LOName').val();
    } catch (e) {
    }
    try {
        ssParalegalName = $('#ssParalegalName').val();
    } catch (e) {
    }
    try {
        ssTitleName = $('#ssTitleName').val();
    } catch (e) {
    }
    try {
        sentType = document.addNotesForm.sentType.value;
    } catch (e) {
    }
    try {
        sendNoteOnly = document.addNotesForm.sendNoteOnly.value;
    } catch (e) {
    }

    try {
        var contact_ids = getContactIds('FileContacts'); // | File Contacts...
        $('#contact_ids').val($('#CIDs').val());
        contact_ids = $('#CIDs').val();
    } catch (e) {
    }

    var url = "../pops/addNotesSave.php";
    var qstr = "LMRId=" + LMRId + "&LMRResponseId=" + LMRResponseId + "&executiveId=" + executiveId + "&brokerNumb=" + brokerNumb + "&LMRNotesId=" + LMRNotesId + "&notesAsPrivate=" + notesAsPrivate + "&borrowerEmail=" + borrowerEmail + "&coBorrowerEmail=" + coBorrowerEmail + "&brokerEmail=" + brokerEmail + "&employeeIds=" + employeeIds + "&sendSMS=" + sendSMS + "&clientName=" + clientName + "&coBorrowerName=" + coBorrowerName + "&LMRExecutive=" + LMRExecutive + "&processorNotes=" + processorNotes + "&branchEmail=" + branchEmail + "&brokerName=" + brokerName + "&notesType=" + notesType + "&updateBillable=" + updateBillable + "&billableMinutes=" + billableMinutes + "&billingRate=" + billingRate + "&customRecipientEmail=" + customRecipientEmail + "&userName=" + userName + "&userNumber=" + userNumber + "&userGroup=" + userGroup + "&userRole=" + userRole + "&userEmail=" + userEmail + "&ssServicer1=" + ssServicer1 + "&ssServicer2=" + ssServicer2 + "&ssAttorneyName=" + ssAttorneyName + "&lenderEmail1=" + lenderEmail1 + "&lenderEmail2=" + lenderEmail2 + "&ssAttorneyEmail=" + ssAttorneyEmail + "&listingRealtor=" + listingRealtor + "&buyerEmail1=" + buyerEmail1 + "&buyer1AgentEmail=" + buyer1AgentEmail + "&listingRealtorName=" + listingRealtorName + "&buyer1Name=" + buyer1Name + "&buyerAgentName1=" + buyerAgentName1 + "&buyer1LOOfficer=" + buyer1LOOfficer + "&buyerEmail2=" + buyerEmail2 + "&buyer2AgentEmail=" + buyer2AgentEmail + "&ssBuyer1LOName=" + ssBuyer1LOName + "&ssBuyerName2=" + ssBuyerName2 + "&ssBuyer2AgentName=" + ssBuyer2AgentName + "&buyer2LOOfficer=" + buyer2LOOfficer + "&buyerEmail3=" + buyerEmail3 + "&buyer3AgentEmail=" + buyer3AgentEmail + "&ssBuyer2LOName=" + ssBuyer2LOName + "&ssBuyerName3=" + ssBuyerName3 + "&ssBuyer3AgentName=" + ssBuyer3AgentName + "&buyer3LOOfficer=" + buyer3LOOfficer + "&ssParalegalEmail=" + ssParalegalEmail + "&ssTitleCompanyEmail=" + ssTitleCompanyEmail + "&ssBuyer3LOName=" + ssBuyer3LOName + "&ssParalegalName=" + ssParalegalName + "&ssTitleName=" + ssTitleName + "&sentType=" + sentType + "&sendNoteOnly=" + sendNoteOnly + "&contact_ids=" + contact_ids + "&SecondarybrokerEmail=" + SecondarybrokerEmail + "&SecondarybrokerName=" + SecondarybrokerName + "&SecondarybrokerNumber=" + SecondarybrokerNumber;

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        status = xmlDoc.getElementsByTagName("status")[0].firstChild.nodeValue;
    } catch (e) {
    }
    try {
        msg = xmlDoc.getElementsByTagName("msg")[0].firstChild.nodeValue;
    } catch (e) {
    }
    try {
        redirect = xmlDoc.getElementsByTagName("redirect")[0].firstChild.nodeValue;
    } catch (e) {
    }
    if (status > 0) {
        if (msg != '') {
            var display = "<div id=\"divMsg\" style=\"width:300px;\">" + msg + "</div>";
            try {
                document.getElementById('taskMsgDiv').innerHTML = display;
            } catch (e) {
            }
        }
        if (redirect == '') {
            getFileNotes(LMRId, opt);
        } else {
            window.location.reload();
        }
    }
    try {
        ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
}

function Unaccent(string) {
    return preg_replace('~&([a-z]{1,2})(acute|cedil|circ|grave|lig|orn|ring|slash|th|tilde|uml);~i', '$1', htmlentities(string, ENT_QUOTES, 'UTF-8'));
}

function removeAccents(strAccents) {
    strAccents = strAccents.split('');
    strAccentsOut = new Array();
    strAccentsLen = strAccents.length;
    var accents = '������������������������������������������������������񊚟����';
    var accentsOut = ['A', 'A', 'A', 'A', 'A', 'A', 'a', 'a', 'a', 'a', 'a', 'a', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'o', 'o', 'o', 'o', 'o', 'o', 'E', 'E', 'E', 'E', 'e', 'e', 'e', 'e', 'e', 'C', 'c', 'D', 'I', 'I', 'I', 'I', 'i', 'i', 'i', 'i', 'U', 'U', 'U', 'U', 'u', 'u', 'u', 'u', 'N', 'n', 'S', 's', 'Y', 'y', 'y', 'Z', 'z'];
    for (var y = 0; y < strAccentsLen; y++) {
        if (accents.indexOf(strAccents[y]) != -1) {
            strAccentsOut[y] = accentsOut[accents.indexOf(strAccents[y])];
        } else
            strAccentsOut[y] = strAccents[y];
    }
    strAccentsOut = strAccentsOut.join('');
    return strAccentsOut;
}

function getFileNotes(LMRId, opt) {
    var displayContent = '',
        processorCommentsNotes = '',
        filePopupArray = new Array();
    var url = "../backoffice/getFileNotes.php";
    var qstr = "LMRId=" + LMRId + "&opt=" + opt;

    if (opt == 'file') {
        try {
            displayContent = getResponse(url, qstr);
        } catch (e) {
        }
        try {
            document.getElementById("fileNotesDiv").innerHTML = displayContent;
        } catch (e) {
        }

    } else {
        formData = '';
        $.post(url + "?" + qstr, formData, function (response) {
            res = JSON.parse(response);
            if (res.code == 100) {
                processorCommentsNotes = res.processorCommentsNotes;
                $('#divListNotes' + LMRId).html(atob(processorCommentsNotes));
            } else {

            }
        });


        /*  try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {}
        try {
            processorCommentsNotes = xmlDoc.getElementsByTagName("processorCommentsNotes")[0].firstChild.nodeValue;
        } catch (e) {}*/
    }


    return false;
    /** Popup start **/
    eval("filePopupArray['" + POPSURL + "addNotes1.php']	= new Array('addNotes1.php', 'Add Notes', '" + POPSURL + "','addNotesSave.php',600,'')");

    for (key in filePopupArray) {
        ContactPop.init(key, filePopupArray[key][0], filePopupArray[key][1], filePopupArray[key][2], filePopupArray[key][3], filePopupArray[key][4], filePopupArray[key][5]);
    }
    /** Popup end **/

}

/*function getFileAssignedEmplyoeeInfo(LMRId){

    $.post(POPSURL+"getFileAssignedEmplyoeeInfo.php", data, function(theResponse){
        $("#sessMsg").html('<h4>Notes Saved<h4>');
        $("#"+category+"NotesDiv").html(theResponse);
        try {
            ContactPop.hideOverlay(); /!** Close- Popup **!/
        } catch(e) {}
    });
}*/

function convertInputToAbsoluteValue(tempValue) {
    try {
        tempValue = trim(tempValue);
        tempValue = replaceCommaValues(tempValue);
    } catch (e) {
    }
    inputValue = Math.abs(tempValue);
    inputValue = inputValue.toFixed(2);
    inputValue = addCommas(inputValue);
    if (tempValue < 0) inputValue = '(' + inputValue + ')';
    return inputValue;
}

function convertInputToAbsoluteValueWithDollar(tempValue) {
    try {
        tempValue = trim(tempValue);
        tempValue = replaceCommaValues(tempValue);
    } catch (e) {
    }
    inputValue = Math.abs(tempValue);
    inputValue = inputValue.toFixed(2);
    inputValue = addCommas(inputValue);
    if (tempValue < 0) {
        inputValue = '<font style="color:#ff0000">($ ' + inputValue + ')</font>';
    } else {
        inputValue = '$ ' + inputValue;
    }
    return inputValue;
}

function convertInputToAbsoluteValueWithPercent(tempValue) {
    try {
        tempValue = trim(tempValue);
        tempValue = replaceCommaValues(tempValue);
    } catch (e) {
    }
    inputValue = Math.abs(tempValue);
    inputValue = inputValue.toFixed(2);
    inputValue = addCommas(inputValue);
    if (tempValue < 0) {
        inputValue = '<font style="color:#ff0000">(' + inputValue + '%)</font>';
    } else {
        inputValue = inputValue + '%';
    }
    return inputValue;
}


/** File locking/edit/view **/

function lockFile(LMRId) {

    var locked = 0,
        LID = 0;
    showLoader();

    url = "../backoffice/lockFile.php";
    qstr = "LMRId=" + LMRId;

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        locked = xmlDoc.getElementsByTagName("locked")[0].firstChild.nodeValue;
    } catch (e) {
    }
    try {
        LID = xmlDoc.getElementsByTagName("encLID")[0].firstChild.nodeValue;
    } catch (e) {
    }
    if (locked == 1) {
        window.location.href = window.location.href + "&op=a72f9e967052513d";
    }
    hideLoader();
}

/** File release/edit/view **/

function releaseFile(LMRId, reloadOpt) {

    var locked = 0,
        released = 0;

    url = "../backoffice/releaseFile.php";
    qstr = "LMRId=" + LMRId;
    showLoader();

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        released = xmlDoc.getElementsByTagName("released")[0].firstChild.nodeValue;
    } catch (e) {
    }

    if (released > 0) {
        if (reloadOpt == "No") {
        } else {
            window.location.reload();
        }
    }
    hideLoader();

}

function clientWarning(LMRId) {
    /*
    if (LMRId>0) {
        $("#alert").dialog({
	    title: '',
	    autoOpen: true,
	    closeOnEscape: false,
	    draggable: false,
	    width: 460,
	    minHeight: 50,
	    modal: true, buttons: {
		Close: function() {
		    $(this).dialog( "close" );
		}
	    },
	    resizable: false
        });
        $('#alert').html('<h4>If you change the homeowner name (or) your mailing address it will change in all other files associated with this email and client profile.</h4>');
    }
 */
}

function validateSearchFormFieldsInPipeline(formName) {
    var fld1 = '',
        fld2 = '';
    fld1 = document.LMRReport.searchTerm.value.trim();
    fld2 = document.LMRReport.searchField.value.trim();

    if ((fld1 == '' && fld2 == '') || (fld1 != '' && fld2 != '')) {
        return true;
    } else {
        if (fld1 == '') {
            //alert('Please type text to search');
            toastrNotification('Please type text to search', 'error');
            $('.search').focus();
            $('.search').addClass('mandatory');
            $("#searchField_chzn").removeClass("mandatory");
        } else if (fld2 == '') {
            //alert('Select field to search');
            toastrNotification('Select field to search', 'error');
            $("#searchField").trigger("liszt:open");
            $("#searchField").trigger("liszt:open");
            $('.search').removeClass('mandatory');
            $("#searchField_chzn").addClass("mandatory");
        }
        return false;
    }
}

function addFlatNotes(fileID, docID, notesType, opt, tempPopTitle, WFID, tabOpt) {
    qstr = 'fileID=' + fileID + '&docID=' + docID + '&notesType=' + notesType + '&opt=' + opt + '&listName=' + encodeURIComponent(tempPopTitle) + '&WFID=' + WFID + '&tabOpt=' + tabOpt;
    $('#docAddNotes').attr('data-id', qstr);
    $('#docAddNotes').click();
    // eval("ContactPop.showOverlay('" + POPSURL + "addFlatNotes.php')");
    /** Open Popup **/

    // var popTitle = 'Add Notes';
    // if (tempPopTitle != '' && typeof tempPopTitle !== "undefined") {
    //     popTitle += ': ' + tempPopTitle;
    // }
    // document.getElementById('contact-pop-title').innerHTML = popTitle; /* Change the Title */
}

function validateFlatNotes() {
    try {
        document.getElementById("WFS-loader").style.display = 'block';
    } catch (e) {
    }
    var SID = 0,
        notesType = '';
    workflowStatus = '';
    SID = $('#SID').val();

    try {
        workflowStatusVal = $('#workflowStatusVal').val();
    } catch (e) {
    }

    notesType = $('#flatNotesType').val();
    if (SID > 0 || notesType == 'substatus' || notesType == 'uploadDocs' || notesType == 'binder' || workflowStatusVal == 1) {
        saveFlatNotes();
        return false;
    } else {
        if (chkIsBlank('flatNotesForm', 'flatNotes', 'Please Enter the Notes')) {
            saveFlatNotes();
            return false;
        } else {
            try {
                document.getElementById("WFS-loader").style.display = 'none';
            } catch (e) {
            }
            return false;
        }
    }
}

function saveFlatNotes() {
    var fileID = 0,
        docID = 0,
        notesType = '',
        flatNotes = '',
        content = '',
        SID = 0,
        workflowStatus = '',
        workflowStatusPrevious = '',
        opt = '',
        listName = '';
    var notes = '',
        status = '',
        xmlDoc = '',
        statusDocID = '',
        clientName = '',
        coBorrowerName = '',
        employeeIds = '',
        borrowerEmail = '';
    var LMRExecutive = '',
        brokerName = '',
        execName = '',
        sendSMS = 0,
        sentType = '',
        userEmail = '',
        CLType = '',
        LMRId = 0;
    var coBorrowerEmail = '',
        brokerEmail = '',
        branchEmail = '',
        customRecipientEmail = '',
        secondaryBrokerName = '',
        SecondarybrokerEmail = '';
    var CIDs = '';
    var tabOpt = '';

    fileID = $('#encFileID').val();
    docID = $('#docID').val();
    notesType = $('#flatNotesType').val();
    flatNotes = $('#flatNotes').val();
    SID = $('#SID').val();
    opt = $('#opt').val();
    listName = $('#listName').val();
    clientName = $('#clientName').val();
    coBorrowerName = $('#coBorrowerName').val();
    LMRExecutive = $('#LMRExecutive').val();
    brokerName = $('#brokerName').val();
    execName = $('#execName').val();
    userEmail = $('#userEmail').val();
    CLType = $('#CLType').val();
    LMRId = $('#LMRId').val();
    workFlowName = $('#workFlowName').val();
    tabOpt = $('#tabOpt').val();
    secondaryBrokerName = $('#secondaryBrokerName').val();
    // SecondarybrokerEmail = $('#SecondarybrokerEmail').val();
    //  borrowerEmail = $('#borrowerEmail').val();

    //employeeIds = $('#employeeIds').val();
    employeeIds = $('#employeeIdsSelect').val();
    try {
        var sentType = document.flatNotesForm.sentType.value;
    } catch (e) {
    }
    try {
        sendSMS = $('#checklistSMS').val();
    } catch (e) {
    }

    try {
        if (document.flatNotesForm.borrowerEmail1.checked) {
            borrowerEmail = $('#borrowerEmail1').val();
        }
    } catch (e) {
    }
    try {
        if (document.flatNotesForm.coBorrowerEmail1.checked) {
            coBorrowerEmail = $('#coBorrowerEmail1').val();
        }
    } catch (e) {
    }
    try {
        if (document.flatNotesForm.brokerEmail.checked) {
            brokerEmail = $('#brokerEmail').val();
        }
    } catch (e) {
    }
    try {
        if (document.flatNotesForm.SecondarybrokerEmail.checked) {
            SecondarybrokerEmail = $('#SecondarybrokerEmail').val();
        }
    } catch (e) {
    }
    try {
        if (document.flatNotesForm.branchEmail.checked) {
            branchEmail = $('#branchEmail').val();
        }
    } catch (e) {
    }

    try {
        var contact_ids = getContactIds('FileContacts');
        $('#contact_ids').val($('#CIDs').val());
        contact_ids = $('#CIDs').val();
    } catch (e) {
    }
    try {
        var customRecipientEmail = $('#flatNotesForm').contents().find('#customRecipientEmail').val();
    } catch (e) {
    }

    if (notesType == 'workFlow') {
        try {
            workflowStatus = $('#workflowStatus').val();
            workflowStatusPrevious = $('#workflowStatusPrevious').val();
        } catch (e) {
        }
    }

    var url = "../pops/saveFlatNotes.php";
    //var qstr = "fileID="+fileID+"&docID="+docID+"&notesType="+notesType+"&flatNotes="+processString(flatNotes)+"&SID="+SID+'&opt='+opt+'&listName='+encodeURIComponent(listName);
    var qstr = "fileID=" + fileID + "&docID=" + docID + "&notesType=" + notesType + "&flatNotes=" + processString(flatNotes) + "&SID=" + SID + '&opt=' + opt + '&listName=' + encodeURIComponent(listName) + '&borrowerEmail=' + borrowerEmail + '&coBorrowerEmail=' + coBorrowerEmail + '&brokerEmail=' + brokerEmail + '&branchEmail=' + branchEmail + '&customRecipientEmail=' + customRecipientEmail + '&employeeIds=' + employeeIds + '&clientName=' + clientName + '&coBorrowerName=' + coBorrowerName + '&LMRExecutive=' + LMRExecutive + '&brokerName=' + brokerName + '&execName=' + execName + '&sendSMS=' + sendSMS + '&sentType=' + sentType + '&userEmail=' + userEmail + '&CLType=' + CLType + '&workFlowName=' + workFlowName + '&contact_ids=' + contact_ids + '&tabOpt=' + tabOpt + '&secondaryBrokerName= ' + secondaryBrokerName + '&SecondarybrokerEmail=' + SecondarybrokerEmail + '&borrowerEmail=' + borrowerEmail;

    if ($('#workflowStatus').length > 0) {
        qstr += "&workflowStatus=" + workflowStatus;
    }
    if ($('#workflowStatusPrevious').length > 0) {
        qstr += "&workflowStatusPrevious=" + workflowStatusPrevious;
    }
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        notes = xmlDoc.getElementsByTagName("notes")[0].firstChild.nodeValue;
        notes = replaceXMLProcess(notes);
    } catch (e) {
    }
    try {
        status = xmlDoc.getElementsByTagName("status")[0].firstChild.nodeValue;
        status = replaceXMLProcess(status);
    } catch (e) {
    }
    try {
        statusDocID = xmlDoc.getElementsByTagName("docID")[0].firstChild.nodeValue;
    } catch (e) {
    }

    if (notes != '') {
        $('#flatNotesDiv_' + docID + '_' + fileID).html(notes);
        /*if (tabOpt == 'pipeline'){
            $('#wfs_info_'+statusDocID).html("<a class=\"fa fa-info-circle fa-lg tip-bottom icon-dark-grey\" style=\"text-decoration:none\" title=\""+status+"\"></a>");
        } else {
            $('#wfs_info_'+statusDocID).html("<a class=\"fa fa-info-circle fa-2x tip-bottom icon-dark-grey\" style=\"text-decoration:none\" title=\""+status+"\"></a>");
        }*/
        $('[data-toggle="tooltip"]').tooltip({
            boundary: 'window',
        });
        $('[data-toggle="popover"]').popover();
        try {
            document.getElementById("WFS-loader").style.display = 'none';
        } catch (e) {
        }
        var clsName = '';
        if (notesType == 'workFlow') {
            if (workflowStatus == 3) {
                clsName = 'chkDarkGrn';
            } else if (workflowStatus == 2) {
                clsName = 'chkYellow';
            } else if (workflowStatus == 4) {
                clsName = 'chkGrey';
            } else if (workflowStatus == 5) {
                clsName = 'chkRed';
            } else if (workflowStatus == 6) {
                clsName = 'chkLightRed';
            } else {
                clsName = '';
            }

            $('#WFS_' + docID).removeClass("chkDarkGrn chkYellow chkGrey chkRed chkLightRed");
            $('#WFS_' + docID).addClass(clsName);
            //try {
            //eval("document.getElementById('WFS_"+docID+"').className = "+clsName+"'");
            //} catch(e) {}
        }
        try {
            $('#exampleModal1').modal('toggle');
        } catch (e) {
        }
        getFileNotes(LMRId, '');
    }
    return false;
}

function calculateNoOfDaysBehind(date1, date2, divId) {
    var dateCnt = "";
    if (date2 == '' || date2 == '00-00-0000') {
    } else {
        var dateCnt = dayDiff(date1, date2);
    }
    if (dateCnt > 0) {
        try {
            document.getElementById(divId).innerHTML = dateCnt;
        } catch (e) {
        }
    } else {
        try {
            document.getElementById(divId).innerHTML = '';
        } catch (e) {
        }
    }
}

function dayDiff(d1, d2) {
    md = d1.split("/");
    md1 = d2.split("/");
    var a = new Date(md[2], md[0], md[1]);
    var b = new Date(md1[2], md1[0], md1[1]);

    var days = (a - b) / (60 * 60 * 24 * 1000);
    return days;
}

function showAndHideprincipal(fldVal, divId) {
    if (fldVal == '2nd Home' || fldVal == 'Non-Owner with Tenant' || fldVal == 'Non-Owner/Vacant') {
        document.getElementById('principal').style.display = 'block';
    } else {
        document.getElementById('principal').style.display = 'none';
    }
}

function saveWorkflowSteps(WFAction, WFSId, WFId, executiveId, LMRId, responseId, brokerNumber, idNumb, id, obj, WFStep, tabOpt, lid, fileTypesTxt) {
    if (id != '') {
        //         eval("document.getElementById('WFStatusLoaderDiv_"+id+"').style.display = 'block'");
    }

    $('#' + idNumb + "_span").show();

    if ($('#WFApplyRemove_' + WFId + "_" + LMRId).data('state') == 'removed') {

        // $('#WF_'+WFId+'_'+LMRId +' .pulse-ring').removeClass('d-none');
        setTimeout(function () {
            // $('#WF_'+WFId+'_'+LMRId +' .pulse-ring').addClass('d-none');
        }, 6000);
        $('#WFSTEPID_' + WFSId + "_" + LMRId).prop('checked', false);
        toastrNotification('Please assign Workflow before you select Workflow step', 'error');
        return false;
    }

    var chkOpt = 0;
    updatedOn = "";
    CheckUpdatedBy = "";
    var allowSaveWFSteps = true;
    description = '';
    titleTxt = '';
    if (WFAction) {
        chkOpt = 1;
        allowSaveWFSteps = validateWFEvents();
    } else {
        chkOpt = 0;
    }

    //var fileType = document.getElementById('fileTypesTxt').value;
    //fix to make A.A, A.R work from Workflow tab, pipeline page.
    var fileType = fileTypesTxt;
    if (allowSaveWFSteps) {


        var url = "../backoffice/saveWorkflowStepsInfo.php";
        var qstr = "WFAction=" + chkOpt + "&WFId=" + WFId + "&WFSId=" + WFSId + "&eId=" + executiveId + "&lId=" + LMRId + "&rId=" + responseId + "&brokerNo=" + brokerNumber + "&fileType=" + fileType;
        var showpopup = "";
        var aralfids = "";
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            description = xmlDoc.getElementsByTagName("description")[0].firstChild.nodeValue;
        } catch (e) {
        }
        try {
            updatedOn = xmlDoc.getElementsByTagName("currentDate")[0].firstChild.nodeValue;
        } catch (e) {
        }
        try {
            CheckUpdatedBy = xmlDoc.getElementsByTagName("CheckUpdatedBy")[0].firstChild.nodeValue;
        } catch (e) {
        }

        try {
            showpopup = xmlDoc.getElementsByTagName("showpopup")[0].firstChild.nodeValue;
        } catch (e) {
        }

        try {
            aralfids = xmlDoc.getElementsByTagName("aralfids")[0].firstChild.nodeValue;
        } catch (e) {
        }

        // $('.with-children-tip > *').hideTip();
        updatedInfo = '';
        if (chkOpt || description != '') {
            if (description != '') description = "Description : " + description + "";
            //if (updatedOn != '' && description != '') titleTxt += "<hr>";
            if (updatedOn != '') updatedInfo = "Updated By : " + CheckUpdatedBy + " on " + updatedOn;

            if (tabOpt == 'pipeline') {

                //  document.getElementById(idNumb).innerHTML = "<span class=\"popoverAjax\" data-placement=\"left\" data-trigger=\"hover\" data-toggle=\"popover\"  ><i class=\"icon-md fas fa-comment-medical\"></i> </span>";

                //  document.getElementById(idNumb).innerHTML = "<a class=\"fa fa-info-circle fa-lg tip-bottom icon-dark-grey\" style=\"text-decoration:none\" title=\"" + titleTxt + "\"></a>";

                document.getElementById(idNumb).innerHTML = "<span class=\"popoverAjax\" data-placement=\"left\" data-trigger=\"hover\" data-toggle=\"popover\"  title='" + description + "' data-content='" + updatedInfo + "' ><i class=\"fa fa-info-circle text-primary\"></i></span>";


            } else {

                document.getElementById(idNumb).innerHTML = "<span class=\"popoverAjax\" data-placement=\"left\" data-trigger=\"hover\" data-toggle=\"popover\"  title='" + description + "' data-content='" + updatedInfo + "' ><i class=\"fa fa-info-circle text-primary\"></i></span>";


                //  document.getElementById(idNumb).innerHTML = "<a class=\"fa fa-info-circle fa-2x tip-bottom icon-dark-grey\" style=\"text-decoration:none\" title=\"" + titleTxt + "\"></a>";
            }
        } else {
            document.getElementById(idNumb).innerHTML = '';
        }

    } else {
        //alert('This workflow step cannot be applied to this file. Either data is missing or it is already over.');
        toastrNotification('This workflow step cannot be applied to this file. Either data is missing or it is already over.', 'error');
        obj.checked = false;
    }

    if (showpopup == 'old') { // old popup code remains same
        var WFEvent = '';
        var url = "../backoffice/getMyWFEvents.php";
        var qstr = "WFAction=" + chkOpt + "&WFID=" + WFId + "&WFSID=" + WFSId + "&WFStep=" + WFStep + "&fileID=" + LMRId;

        try {
            WFEvent = getResponse(url, qstr);
            setTimeout(function () {
                $('#' + idNumb + "_span").hide();
            }, 1000);

        } catch (e) {
        }

        if (WFEvent == '') {
        } else {
            $.dialog({
                title: '',
                autoOpen: true,
                containerFluid: true,
                backgroundDismiss: true,
                buttons: {
                    Close: function () {
                        $(this).dialog("close");
                    }
                },
                resizable: false,
                content: WFEvent,
            });
            // $('#warning').html();
        }
    } else if (showpopup == 'new' && aralfids.length > 0) { //aralfids must have some data(id values)
        // new code to display new actions in new popup

        $.ajax({
            url: '../backoffice/automatedActionView.php',
            type: 'POST',
            data: {'aralfids': aralfids},
            beforeSend: function () {

            },
            success: function (resp) {
                setTimeout(function () {
                    $('#' + idNumb + "_span").hide();
                }, 1000);
                modal = $('#exampleModal1');
                modal.find('.modal-dialog').removeClass("modal-sm modal-lg modal-xl").addClass('modal-xl');
                modal.find('.modal-title').text('Event Details');
                modal.find('.modal-body').html(resp);
                modal.find('.modal-footer').hide();
                modal.modal('show');
            }
        });
    } else {
        setTimeout(function () {
            $('#' + idNumb + "_span").hide();
        }, 1000);
    }
    // $(function () {
    $('.tooltipAjax').tooltip({
        boundary: 'window',
    });
    $('.popoverAjax').popover();
    $('.tooltipClass').tooltip({
        boundary: 'window',
    });
    // });
    getFileNotes(lid, '');
}

function validateWFEvents() {
    return true;
}

function usersNotifyRadioButton(formId, fldVal) {
    var employeeIdsSelectArrar = new Array();

    if (fldVal == '0') {
        $("#" + formId + " .assignedBranchEmp").each(function (index) {
            employeeIdsSelectArrar.push($(this).val());
        });
        $("#" + formId + ' #employeeIds').selectpicker('val', employeeIdsSelectArrar);

    } else if (fldVal == 1) {

        $("#" + formId + " .assignedFileEmp").each(function (index) {
            employeeIdsSelectArrar.push($(this).val());
        });
        $("#" + formId + ' #employeeIds').selectpicker('val', employeeIdsSelectArrar);

    } else if (fldVal == 2) {
        $("#" + formId + ' #employeeIds').selectpicker('val', '');
    }
    //  $('#'+formId+' #employeeIds').val(employeeIdsSelectArrar.toString());
    // $('#employeeIdsSelect').selectpicker('render');


}

function checkUsersToNotify(fldVal) {
    var branchID = 0,
        notesAsPrivate = 0;
    var empCnt = 0,
        j = 0;
    empCnt = document.addNotesForm.employeeId.length;
    eval("obj = document.getElementsByName('employeeId')");
    if (fldVal == 0) {
        for (var i = 0; i < obj.length; i++) {
            obj[i].checked = false;
        }
        $('.assignedBranchEmp').attr("checked", true);
    } else if (fldVal == 1) {
        for (var i = 0; i < obj.length; i++) {
            obj[i].checked = false;
        }
        $('.assignedFileEmp').attr("checked", true);
    } else if (fldVal == 2) {
        for (var i = 0; i < obj.length; i++) {
            obj[i].checked = false;
        }
    }
    try {
        notesAsPrivate = getRadioBtnValue('addNotesForm', 'notesAsPrivate');
    } catch (e) {
    }
    if (notesAsPrivate == 1) {
        $('input:checkbox[id^="private_"]').attr("checked", false);
    }
    getMultiCheckValue('addNotesForm', 'employeeId', 'employeeIds');
}

function showContactsForFile(CID, PCID) {
    var contactList = new Array();
    var contactName = '',
        companyName = '',
        address = '',
        city = '',
        state = '',
        zip = '',
        phone1 = '',
        phone2 = '',
        phone3 = '',
        ext = '',
        fax1 = '',
        fax2 = '',
        fax3 = '',
        email = '';
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    for (var i = 0; i < contactList.length; i++) {
        try {
            contactName = contactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            companyName = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            address = contactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            city = contactList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            state = contactList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            zip = contactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone1 = contactList[i].getElementsByTagName("phone1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone2 = contactList[i].getElementsByTagName("phone2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone3 = contactList[i].getElementsByTagName("phone3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            ext = contactList[i].getElementsByTagName("ext")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax1 = contactList[i].getElementsByTagName("fax1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax2 = contactList[i].getElementsByTagName("fax2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax3 = contactList[i].getElementsByTagName("fax3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            email = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('HOContactName').value = contactName;
        } catch (e) {
        }
        try {
            document.getElementById('condominiumOrHOAFeeAmtReceiver').value = companyName;
        } catch (e) {
        }
        try {
            document.getElementById('feeAmtReceiverAddress').value = address;
        } catch (e) {
        }
        try {
            document.getElementById('feeAmtReceiverCity').value = city;
        } catch (e) {
        }
        try {
            document.getElementById('feeAmtReceiverState').value = state;
        } catch (e) {
        }
        try {
            document.getElementById('feeAmtReceiverZip').value = zip;
        } catch (e) {
        }
        try {
            document.getElementById('HOPhNo1').value = phone1;
        } catch (e) {
        }
        try {
            document.getElementById('HOPhNo2').value = phone2;
        } catch (e) {
        }
        try {
            document.getElementById('HOPhNo3').value = phone3;
        } catch (e) {
        }
        try {
            document.getElementById('HOPhExt').value = ext;
        } catch (e) {
        }
        try {
            document.getElementById('HOFaxNo1').value = fax1;
        } catch (e) {
        }
        try {
            document.getElementById('HOFaxNo2').value = fax2;
        } catch (e) {
        }
        try {
            document.getElementById('HOFaxNo3').value = fax3;
        } catch (e) {
        }
        try {
            document.getElementById('HOEmail').value = email;
        } catch (e) {
        }
    }
}

function showPMContactsForFile(CID, PCID) {
    var contactList = new Array();
    var contactName = '',
        companyName = '',
        address = '',
        city = '',
        state = '',
        zip = '',
        phone1 = '',
        phone2 = '',
        phone3 = '',
        ext = '',
        email = '',
        description = '';
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    for (var i = 0; i < contactList.length; i++) {
        try {
            contactName = contactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            companyName = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            address = contactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            city = contactList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            state = contactList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            zip = contactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone1 = contactList[i].getElementsByTagName("phone1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone2 = contactList[i].getElementsByTagName("phone2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone3 = contactList[i].getElementsByTagName("phone3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            ext = contactList[i].getElementsByTagName("ext")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            email = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            description = contactList[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('propMgmntContactPerson').value = contactName;
        } catch (e) {
        }
        try {
            document.getElementById('propMgmntCompany').value = companyName;
        } catch (e) {
        }
        try {
            document.getElementById('propMgmntAddress').value = address;
        } catch (e) {
        }
        try {
            document.getElementById('propMgmntCity').value = city;
        } catch (e) {
        }
        try {
            document.getElementById('propMgmntState').value = state;
        } catch (e) {
        }
        try {
            document.getElementById('propMgmntZip').value = zip;
        } catch (e) {
        }
        try {
            document.getElementById('propMgmntPhNo1').value = phone1;
        } catch (e) {
        }
        try {
            document.getElementById('propMgmntPhNo2').value = phone2;
        } catch (e) {
        }
        try {
            document.getElementById('propMgmntPhNo3').value = phone3;
        } catch (e) {
        }
        try {
            document.getElementById('propMgmntPhExt').value = ext;
        } catch (e) {
        }
        try {
            document.getElementById('propMgmntNotes').value = description;
        } catch (e) {
        }
        try {
            document.getElementById('propMgmntContactEmail').value = email;
        } catch (e) {
        }
    }
}

function showHOA2ContactsForFile(CID, PCID) {
    var companyName = '',
        address = '',
        city = '',
        state = '',
        zip = contactName = description = email = '';
    var contactList = new Array();
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    for (var i = 0; i < contactList.length; i++) {
        try {
            contactName = contactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            companyName = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            address = contactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            city = contactList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            state = contactList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            zip = contactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            zip = contactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            description = contactList[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            email = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('HOA2ContactName').value = contactName;
        } catch (e) {
        }
        try {
            document.getElementById('HOA2CompanyName').value = companyName;
        } catch (e) {
        }
        try {
            document.getElementById('HOAOrCOAFeeAddress').value = address;
        } catch (e) {
        }
        try {
            document.getElementById('HOAOrCOAFeeCity').value = city;
        } catch (e) {
        }
        try {
            document.getElementById('HOAOrCOAFeeState').value = state;
        } catch (e) {
        }
        try {
            document.getElementById('HOAOrCOAFeeZip').value = zip;
        } catch (e) {
        }
        try {
            document.getElementById('HOA2Notes').value = description;
        } catch (e) {
        }
        try {
            document.getElementById('HOA2Email').value = email;
        } catch (e) {
        }
    }
}

function showRepresentativeForFile(CID, PCID, idVal = '') {
    var contactList = new Array();
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }

    if (contactList.length > 0) {
        allowToEditFileContacts('titleRepContactCls' + idVal, 'titleRepPrimContactCls' + idVal, 'Edit'); // Allow to Edit file contacts..
    }
    for (var i = 0; i < contactList.length; i++) {
        try {
            document.getElementById('titleCo_' + idVal).value = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('titlePhoneNumber_' + idVal).value = contactList[i].getElementsByTagName("phone")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('tilteCellNo_' + idVal).value = contactList[i].getElementsByTagName("cell")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleFax_' + idVal).value = contactList[i].getElementsByTagName("fax")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleFax1_' + idVal).value = contactList[i].getElementsByTagName("fax1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleFax2_' + idVal).value = contactList[i].getElementsByTagName("fax2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleFax3_' + idVal).value = contactList[i].getElementsByTagName("fax3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('sales2Email_' + idVal).value = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('titletollFree_' + idVal).value = contactList[i].getElementsByTagName("tollFree")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('tilteCellNo1_' + idVal).value = contactList[i].getElementsByTagName("cell1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('tilteCellNo2_' + idVal).value = contactList[i].getElementsByTagName("cell2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('tilteCellNo3_' + idVal).value = contactList[i].getElementsByTagName("cell3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('contact_' + idVal).value = contactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('titleContactLName_' + idVal).value = contactList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('titlePhoneNumber_' + idVal).value = contactList[i].getElementsByTagName("phoneNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('tilteCellNo_' + idVal).value = contactList[i].getElementsByTagName("cellNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('titleFax_' + idVal).value = contactList[i].getElementsByTagName("faxNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('titleNotes_' + idVal).value = contactList[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

    }
    $(".titlePhoneNumberAutoPopulate").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
    $(".titleCellNumberAutoPopulate").inputmask("mask", {mask: "999 - 999 - 9999"});

}

function enableContactFields(className) {
    jQuery('.' + className).attr('readonly', false);
    jQuery('.' + className).css("background-color", "#fff");
}

/**

 ** Description    : get the Property Info section in contacts
 ** Developer    : Venky
 ** Author        : AwataSoftsys
 ** Date            : Feb 04, 2017

 **/


function showInsuranceCompanyForFile(CID, PCID, idVal = '') {
    var contactList = new Array();
    var url = siteUrl + "JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    if (contactList.length > 0) {
        allowToEditFileContacts('insContactCls' + idVal, 'insPrimContactCls' + idVal, 'Edit'); // Allow to Edit file contacts..
    }
    for (var i = 0; i < contactList.length; i++) {
        try {
            document.getElementById('proInsName_' + idVal).value = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('proIncPh_' + idVal).value = contactList[i].getElementsByTagName("phoneNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('proIncEmail_' + idVal).value = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('proIncTollFree_' + idVal).value = contactList[i].getElementsByTagName("tollFree")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('proIncWebsite_' + idVal).value = contactList[i].getElementsByTagName("website")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('proInsFirstName_' + idVal).value = contactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('proInsLastName_' + idVal).value = contactList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('proInsAddress_' + idVal).value = contactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('proInsCity_' + idVal).value = contactList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('proInsState_' + idVal).value = contactList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('proInsZip_' + idVal).value = contactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('proIncRepNotes_' + idVal).value = contactList[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
    }

    $(".propInsPhoneNumberAutoPopulate").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
}

function showAttorneyContactsForFile(CID, PCID) {

    var companyName = '',
        phone1 = '',
        phone2 = '',
        phone3 = '',
        ext = '',
        cell1 = '',
        cell2 = '',
        cell3 = '',
        fax1 = '',
        fax2 = '',
        fax3 = '',
        email = '',
        address = '',
        city = '',
        state = '',
        zip = '';
    var contactList = new Array();
    var cellNumber = faxNumber = $phone = '';
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    for (var i = 0; i < contactList.length; i++) {
        try {
            companyName = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            email = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone1 = contactList[i].getElementsByTagName("phone1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone2 = contactList[i].getElementsByTagName("phone2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone3 = contactList[i].getElementsByTagName("phone3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            ext = contactList[i].getElementsByTagName("ext")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax1 = contactList[i].getElementsByTagName("fax1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax2 = contactList[i].getElementsByTagName("fax2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax3 = contactList[i].getElementsByTagName("fax3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell1 = contactList[i].getElementsByTagName("cell1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell2 = contactList[i].getElementsByTagName("cell2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell3 = contactList[i].getElementsByTagName("cell3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            address = contactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            city = contactList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            state = contactList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            zip = contactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cellNumber = contactList[i].getElementsByTagName("cellNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            faxNumber = contactList[i].getElementsByTagName("faxNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone = contactList[i].getElementsByTagName("phone")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('attorneyFirmName').value = companyName;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyEmail').value = email;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyPhone1').value = phone1;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyPhone2').value = phone2;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyPhone3').value = phone3;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyPhoneExt').value = ext;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyFax1').value = fax1;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyFax2').value = fax2;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyFax3').value = fax3;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyCell1').value = cell1;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyCell2').value = cell2;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyCell3').value = cell3;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyAddress').value = address;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyCity').value = city;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyState').value = state;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyZip').value = zip;
        } catch (e) {
        }

        try {
            document.getElementById('attorneyPhone').value = phone;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyFax').value = faxNumber;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyCell').value = cellNumber;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyLastName').value = contactList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue;
            ;
        } catch (e) {
        }

    }
}

function showCounselorInfoForFile(CID, PCID) {
    var companyName = '',
        phone1 = '',
        phone2 = '',
        phone3 = '',
        ext = '',
        email = '';
    var contactList = new Array();
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    for (var i = 0; i < contactList.length; i++) {
        try {
            companyName = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone1 = contactList[i].getElementsByTagName("phone1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone2 = contactList[i].getElementsByTagName("phone2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone3 = contactList[i].getElementsByTagName("phone3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            ext = contactList[i].getElementsByTagName("ext")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            email = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('creditCounselorAgency').value = companyName;
        } catch (e) {
        }

        try {
            document.getElementById('creditCounselorPhone1').value = phone1;
        } catch (e) {
        }

        try {
            document.getElementById('creditCounselorPhone2').value = phone2;
        } catch (e) {
        }
        try {
            document.getElementById('creditCounselorPhone3').value = phone3;
        } catch (e) {
        }
        try {
            document.getElementById('creditCounselorPhoneExt').value = ext;
        } catch (e) {
        }
        try {
            document.getElementById('creditCounselorEmail').value = email;
        } catch (e) {
        }
    }
}

function showPOAttorneyContactsForFile(CID, PCID) {
    var companyName = '',
        phone1 = '',
        phone2 = '',
        phone3 = '',
        ext = '',
        cell1 = '',
        cell2 = '',
        cell3 = '',
        fax1 = '',
        fax2 = '',
        fax3 = '',
        email = '';
    var contactList = new Array();
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    for (var i = 0; i < contactList.length; i++) {
        try {
            companyName = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            email = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone1 = contactList[i].getElementsByTagName("phone1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone2 = contactList[i].getElementsByTagName("phone2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone3 = contactList[i].getElementsByTagName("phone3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            ext = contactList[i].getElementsByTagName("ext")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax1 = contactList[i].getElementsByTagName("fax1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax2 = contactList[i].getElementsByTagName("fax2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax3 = contactList[i].getElementsByTagName("fax3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell1 = contactList[i].getElementsByTagName("cell1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell2 = contactList[i].getElementsByTagName("cell2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell3 = contactList[i].getElementsByTagName("cell3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('POFirmName').value = companyName;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyEmail').value = email;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyPhNo1').value = phone1;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyPhNo2').value = phone2;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyPhNo3').value = phone3;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyPhExt').value = ext;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyFaxNo1').value = fax1;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyFaxNo2').value = fax2;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyFaxNo3').value = fax3;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyCellNo1').value = cell1;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyCellNo2').value = cell2;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyCellNo3').value = cell3;
        } catch (e) {
        }
    }
}

function showBuyerAttorneyContactsForFile(CID, PCID, opt) {
    var contactList = new Array();
    var companyName = '',
        phone = '',
        phone1 = '',
        phone2 = '',
        phone3 = '',
        ext = '',
        cell = '',
        cell1 = '',
        cell2 = '',
        cell3 = '',
        fax = '',
        fax1 = '',
        fax2 = '',
        fax3 = '',
        email = '',
        email = '',
        address = '',
        city = '',
        state = '',
        zip = '';
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    for (var i = 0; i < contactList.length; i++) {
        try {
            companyName = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone = contactList[i].getElementsByTagName("phone")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        /*try {
            phone1 = contactList[i].getElementsByTagName("phone1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone2 = contactList[i].getElementsByTagName("phone2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone3 = contactList[i].getElementsByTagName("phone3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            ext = contactList[i].getElementsByTagName("ext")[0].childNodes[0].nodeValue;
        } catch (e) {
        }*/
        try {
            cell = contactList[i].getElementsByTagName("cellNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        /*try {
            cell1 = contactList[i].getElementsByTagName("cell1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell2 = contactList[i].getElementsByTagName("cell2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell3 = contactList[i].getElementsByTagName("cell3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }*/
        try {
            fax = contactList[i].getElementsByTagName("faxNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        /*try {
            fax1 = contactList[i].getElementsByTagName("fax1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax2 = contactList[i].getElementsByTagName("fax2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax3 = contactList[i].getElementsByTagName("fax3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }*/
        try {
            email = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            address = contactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            city = contactList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            state = contactList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            zip = contactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'FirmName').value = companyName;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'AttorneyPhNo').value = phone;
        } catch (e) {
        }
        /*try {
            document.getElementById('buyer' + opt + 'AttorneyPhNo1').value = phone1;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'AttorneyPhNo2').value = phone2;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'AttorneyPhNo3').value = phone3;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'AttorneyPhExt').value = ext;
        } catch (e) {
        }*/
        try {
            document.getElementById('buyer' + opt + 'AttorneyCellNo').value = cell;
        } catch (e) {
        }
        /*try {
            document.getElementById('buyer' + opt + 'AttorneyCellNo1').value = cell1;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'AttorneyCellNo2').value = cell2;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'AttorneyCellNo3').value = cell3;
        } catch (e) {
        }*/
        try {
            document.getElementById('buyer' + opt + 'AttorneyFaxNo').value = fax;
        } catch (e) {
        }
        /*try {
            document.getElementById('buyer' + opt + 'AttorneyFaxNo1').value = fax1;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'AttorneyFaxNo2').value = fax2;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'AttorneyFaxNo3').value = fax3;
        } catch (e) {
        }*/
        try {
            document.getElementById('buyer' + opt + 'AttorneyEmail').value = email;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'AttorneyAddress').value = address;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'AttorneyCity').value = city;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'AttorneyState').value = state;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'AttorneyZip').value = zip;
        } catch (e) {
        }
    }
}

function showRealtorContactsForFile(CID, PCID) {
    var companyName = '',
        phone1 = '',
        phone2 = '',
        phone3 = '',
        ext = '',
        cell1 = '',
        cell2 = '',
        cell3 = '',
        fax1 = '',
        fax2 = '',
        fax3 = '',
        email = '',
        address = '';
    var contactList = new Array();
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    for (var i = 0; i < contactList.length; i++) {
        try {
            companyName = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            address = contactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            email = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone1 = contactList[i].getElementsByTagName("phone1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone2 = contactList[i].getElementsByTagName("phone2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone3 = contactList[i].getElementsByTagName("phone3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            ext = contactList[i].getElementsByTagName("ext")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell1 = contactList[i].getElementsByTagName("cell1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell2 = contactList[i].getElementsByTagName("cell2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell3 = contactList[i].getElementsByTagName("cell3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax1 = contactList[i].getElementsByTagName("fax1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax2 = contactList[i].getElementsByTagName("fax2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax3 = contactList[i].getElementsByTagName("fax3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('agency').value = companyName;
        } catch (e) {
        }
        try {
            document.getElementById('realtorAddress').value = address;
        } catch (e) {
        }
        try {
            document.getElementById('sales1Email').value = email;
        } catch (e) {
        }
        try {
            document.getElementById('sales1PhNo1').value = phone1;
        } catch (e) {
        }
        try {
            document.getElementById('sales1PhNo2').value = phone2;
        } catch (e) {
        }
        try {
            document.getElementById('sales1PhNo3').value = phone3;
        } catch (e) {
        }
        try {
            document.getElementById('sales1PhExt').value = ext;
        } catch (e) {
        }
        try {
            document.getElementById('sales1CellNo1').value = cell1;
        } catch (e) {
        }
        try {
            document.getElementById('sales1CellNo2').value = cell2;
        } catch (e) {
        }
        try {
            document.getElementById('sales1CellNo3').value = cell3;
        } catch (e) {
        }
        try {
            document.getElementById('sales1Fax1').value = fax1;
        } catch (e) {
        }
        try {
            document.getElementById('sales1Fax2').value = fax2;
        } catch (e) {
        }
        try {
            document.getElementById('sales1Fax3').value = fax3;
        } catch (e) {
        }
    }
}

function showBuyerAgentContactsForFile(CID, PCID, opt) {
    var contactList = new Array();
    var companyName = '',
        phone1 = '',
        phone2 = '',
        phone3 = '',
        ext = '',
        cell1 = '',
        cell2 = '',
        cell3 = '',
        fax1 = '',
        fax2 = '',
        fax3 = '',
        email = '',
        email = '';
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    for (var i = 0; i < contactList.length; i++) {
        try {
            companyName = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone1 = contactList[i].getElementsByTagName("phone1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone2 = contactList[i].getElementsByTagName("phone2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone3 = contactList[i].getElementsByTagName("phone3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            ext = contactList[i].getElementsByTagName("ext")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell1 = contactList[i].getElementsByTagName("cell1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell2 = contactList[i].getElementsByTagName("cell2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell3 = contactList[i].getElementsByTagName("cell3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax1 = contactList[i].getElementsByTagName("fax1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax2 = contactList[i].getElementsByTagName("fax2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax3 = contactList[i].getElementsByTagName("fax3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            email = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'AgencyName').value = companyName;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'PhNo1').value = phone1;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'PhNo2').value = phone2;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'PhNo3').value = phone3;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'PhExt').value = ext;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'CellNo1').value = cell1;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'CellNo2').value = cell2;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'CellNo3').value = cell3;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'Fax1').value = fax1;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'Fax2').value = fax2;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'Fax3').value = fax3;
        } catch (e) {
        }
        try {
            document.getElementById('buyer' + opt + 'Email').value = email;
        } catch (e) {
        }
    }
}

function removeFileContacts(opt, idVal = '') {
    if (opt == 'HOA') {
        document.loanModForm.HOA1ContactID.value = 0;
        document.getElementById('HOContactName').value = '';
        document.getElementById('condominiumOrHOAFeeAmtReceiver').value = '';
        document.getElementById('feeAmtReceiverAddress').value = '';
        document.getElementById('feeAmtReceiverCity').value = '';
        document.getElementById('feeAmtReceiverState').value = '';
        document.getElementById('feeAmtReceiverZip').value = '';
        document.getElementById('HOPhNo1').value = '';
        document.getElementById('HOPhNo2').value = '';
        document.getElementById('HOPhNo3').value = '';
        document.getElementById('HOPhExt').value = '';
        document.getElementById('HOFaxNo1').value = '';
        document.getElementById('HOFaxNo2').value = '';
        document.getElementById('HOFaxNo3').value = '';
        document.getElementById('HOEmail').value = '';
    } else if (opt == 'HOA2') {
        document.loanModForm.HOA2ContactID.value = 0;
        document.getElementById('HOA2ContactName').value = '';
        document.getElementById('HOA2CompanyName').value = '';
        document.getElementById('HOA2Email').value = '';
        document.getElementById('HOAOrCOAFeeAddress').value = '';
        document.getElementById('HOAOrCOAFeeCity').value = '';
        document.getElementById('HOAOrCOAFeeState').value = '';
        document.getElementById('HOAOrCOAFeeZip').value = '';
        document.getElementById('HOA2Notes').value = '';
    } else if (opt == 'title' || opt == 'titleLName' || opt == 'titleCName') {
        try {
            clear_form_elements('titleCompanyContacts');
        } catch (e) {
        }
        try {
            document.loanModForm.tempRepresentativeName.value = '';
        } catch (e) {
        }
        try {
            document.loanModForm.tempRepresentativeLName.value = '';
        } catch (e) {
        }
        try {
            document.loanModForm.tempRepresentativeCName.value = '';
        } catch (e) {
        }
        try {
            document.loanModForm.representativeID.value = 0;
        } catch (e) {
        }
        try {
            document.getElementById('contact').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleCo').value = '';
        } catch (e) {
        }
        try {
            //document.getElementById('titlePhoneNumber1').value = '';
            document.getElementById('titlePhoneNumber').value = '';
        } catch (e) {
        }
        try {
            // document.getElementById('titlePhoneNumber2').value = '';
        } catch (e) {
        }
        try {
            // document.getElementById('titlePhoneNumber3').value = '';
        } catch (e) {
        }
        try {
            //document.getElementById('titlePhoneNumberExt').value = '';
        } catch (e) {
        }
        try {
            //document.getElementById('titleFax1').value = '';
            document.getElementById('titleFax').value = '';
        } catch (e) {
        }
        try {
            //document.getElementById('titleFax2').value = '';
        } catch (e) {
        }
        try {
            // document.getElementById('titleFax3').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('sales2Email').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleTollFree1').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleTollFree2').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleTollFree3').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleTollFreeExt').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tilteCellNo1').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tilteCellNo2').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tilteCellNo3').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleContactLName').value = '';
        } catch (e) {
        }
    } else if (opt == 'BA') {
        try {
            document.loanModForm.attorneyID.value = 0;
        } catch (e) {
        }
        try {
            document.getElementById('attorneyName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyFirmName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyEmail').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyPhone1').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyPhone2').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyPhone3').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyPhoneExt').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyFax1').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyFax2').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyFax3').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyCell1').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyCell2').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyCell3').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyPhone').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyFax').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyCell').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyAddress').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyCity').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyState').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyZip').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('attorneyLastName').value = '';
        } catch (e) {
        }
    } else if (opt == 'LA') {
        document.loanModForm.realtorID.value = 0;
        document.getElementById('realtor').value = '';
        document.getElementById('agency').value = '';

        try {
            document.getElementById('realtorAddress').value = '';
            document.getElementById('sales1PhNo').value = '';
            // document.getElementById('sales1PhNo1').value = '';
            // document.getElementById('sales1PhNo2').value = '';
            // document.getElementById('sales1PhNo3').value = '';
            // document.getElementById('sales1PhExt').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('sales1Email').value = '';
        } catch (e) {
        }
        try {
            // document.getElementById('sales1CellNo1').value = '';
            document.getElementById('sales1CellNo').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('sales1CellNo2').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('sales1CellNo3').value = '';
        } catch (e) {
        }
        try {
            // document.getElementById('sales1Fax1').value = '';
            document.getElementById('sales1Fax').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('sales1Fax2').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('sales1Fax3').value = '';
        } catch (e) {
        }

    } else if (opt == 'Counselor') {
        try {
            document.loanModForm.counselorID.value = 0;
            document.getElementById('creditCounselorName').value = '';
            document.getElementById('creditCounselorAgency').value = '';
            document.getElementById('creditCounselorPhone1').value = '';
            document.getElementById('creditCounselorPhone2').value = '';
            document.getElementById('creditCounselorPhone3').value = '';
            document.getElementById('creditCounselorPhoneExt').value = '';
            document.getElementById('creditCounselorEmail').value = '';
        } catch (e) {
        }
    } else if (opt == 'POA') {
        try {
            document.loanModForm.POAttorneyID.value = 0;
            document.getElementById('POAttorneyName').value = '';
            document.getElementById('POFirmName').value = '';
            document.getElementById('attorneyEmail').value = '';
            // document.getElementById('attorneyPhNo1').value = '';
            document.getElementById('attorneyPhNo').value = '';
            // document.getElementById('attorneyPhNo2').value = '';
            // document.getElementById('attorneyPhNo3').value = '';
            // document.getElementById('attorneyPhExt').value = '';
            // document.getElementById('attorneyFaxNo1').value = '';
            document.getElementById('attorneyFaxNo').value = '';
            // document.getElementById('attorneyFaxNo2').value = '';
            // document.getElementById('attorneyFaxNo3').value = '';
            // document.getElementById('attorneyCellNo1').value = '';
            document.getElementById('attorneyCellNo').value = '';
            // document.getElementById('attorneyCellNo2').value = '';
            // document.getElementById('attorneyCellNo3').value = '';
        } catch (e) {
        }
    } else if (opt == 'B1Agent') {
        try {
            document.loanModForm.B1AgentID.value = 0;
            document.getElementById('buyer1AgentName').value = '';
            document.getElementById('buyer1AgencyName').value = '';
            // document.getElementById('buyer1PhNo1').value = '';
            document.getElementById('buyer1PhNo').value = '';
            // document.getElementById('buyer1PhNo2').value = '';
            // document.getElementById('buyer1PhNo3').value = '';
            // document.getElementById('buyer1PhExt').value = '';
            // document.getElementById('buyer1CellNo1').value = '';
            document.getElementById('buyer1CellNo').value = '';
            // document.getElementById('buyer1CellNo2').value = '';
            // document.getElementById('buyer1CellNo3').value = '';
            // document.getElementById('buyer1Fax1').value = '';
            document.getElementById('buyer1Fax').value = '';
            document.getElementById('buyer1Fax2').value = '';
            document.getElementById('buyer1Fax3').value = '';
            document.getElementById('buyer1Email').value = '';
            document.getElementById('RELicenseNumber1').value = '';
        } catch (e) {
        }
    } else if (opt == 'B2Agent') {
        try {
            document.loanModForm.B2AgentID.value = 0;
            document.getElementById('buyer2AgentName').value = '';
            document.getElementById('buyer2AgencyName').value = '';
            // document.getElementById('buyer2PhNo1').value = '';
            document.getElementById('buyer2PhNo').value = '';
            // document.getElementById('buyer2PhNo2').value = '';
            // document.getElementById('buyer2PhNo3').value = '';
            // document.getElementById('buyer2PhExt').value = '';
            // document.getElementById('buyer2CellNo1').value = '';
            document.getElementById('buyer2CellNo').value = '';
            // document.getElementById('buyer2CellNo2').value = '';
            // document.getElementById('buyer2CellNo3').value = '';
            // document.getElementById('buyer2Fax1').value = '';
            document.getElementById('buyer2Fax').value = '';
            document.getElementById('buyer2Fax2').value = '';
            document.getElementById('buyer2Fax3').value = '';
            document.getElementById('buyer2Email').value = '';
            document.getElementById('RELicenseNumber2').value = '';
        } catch (e) {
        }
    } else if (opt == 'B3Agent') {
        try {
            document.loanModForm.B1AgentID.value = 0;
            document.getElementById('buyer3AgentName').value = '';
            document.getElementById('buyer3AgencyName').value = '';
            // document.getElementById('buyer3PhNo1').value = '';
            document.getElementById('buyer3PhNo').value = '';
            // document.getElementById('buyer3PhNo2').value = '';
            // document.getElementById('buyer3PhNo3').value = '';
            // document.getElementById('buyer3PhExt').value = '';
            // document.getElementById('buyer3CellNo1').value = '';
            document.getElementById('buyer3CellNo').value = '';
            // document.getElementById('buyer3CellNo2').value = '';
            // document.getElementById('buyer3CellNo3').value = '';
            // document.getElementById('buyer3Fax1').value = '';
            document.getElementById('buyer3Fax').value = '';
            document.getElementById('buyer3Fax2').value = '';
            document.getElementById('buyer3Fax3').value = '';
            document.getElementById('buyer3Email').value = '';
            document.getElementById('RELicenseNumber3').value = '';
        } catch (e) {
        }
    } else if (opt == 'B1Attorney') {
        try {
            document.loanModForm.B1AttorneyID.value = 0;
            document.getElementById('buyer1AttorneyName').value = '';
            document.getElementById('buyer1FirmName').value = '';
            //document.getElementById('buyer1AttorneyPhNo1').value = '';
            document.getElementById('buyer1AttorneyPhNo').value = '';
            // document.getElementById('buyer1AttorneyPhNo2').value = '';
            // document.getElementById('buyer1AttorneyPhNo3').value = '';
            // document.getElementById('buyer1AttorneyPhExt').value = '';
            // document.getElementById('buyer1AttorneyCellNo1').value = '';
            document.getElementById('buyer1AttorneyCellNo').value = '';
            // document.getElementById('buyer1AttorneyCellNo2').value = '';
            // document.getElementById('buyer1AttorneyCellNo3').value = '';
            // document.getElementById('buyer1AttorneyFaxNo1').value = '';
            document.getElementById('buyer1AttorneyFaxNo').value = '';
            // document.getElementById('buyer1AttorneyFaxNo2').value = '';
            // document.getElementById('buyer1AttorneyFaxNo3').value = '';
            document.getElementById('buyer1AttorneyEmail').value = '';
            document.getElementById('buyer1AttorneyAddress').value = '';
            document.getElementById('buyer1AttorneyCity').value = '';
            document.getElementById('buyer1AttorneyState').value = '';
            document.getElementById('buyer1AttorneyZip').value = '';
        } catch (e) {
        }
    } else if (opt == 'B2Attorney') {
        try {
            document.loanModForm.B1AttorneyID.value = 0;
            document.getElementById('buyer2AttorneyName').value = '';
            document.getElementById('buyer2FirmName').value = '';
            //document.getElementById('buyer2AttorneyPhNo1').value = '';
            document.getElementById('buyer2AttorneyPhNo').value = '';
            // document.getElementById('buyer2AttorneyPhNo2').value = '';
            // document.getElementById('buyer2AttorneyPhNo3').value = '';
            // document.getElementById('buyer2AttorneyPhExt').value = '';
            // document.getElementById('buyer2AttorneyCellNo1').value = '';
            document.getElementById('buyer2AttorneyCellNo').value = '';
            // document.getElementById('buyer2AttorneyCellNo2').value = '';
            // document.getElementById('buyer2AttorneyCellNo3').value = '';
            // document.getElementById('buyer2AttorneyFaxNo1').value = '';
            document.getElementById('buyer2AttorneyFaxNo').value = '';
            // document.getElementById('buyer2AttorneyFaxNo2').value = '';
            // document.getElementById('buyer2AttorneyFaxNo3').value = '';
            document.getElementById('buyer2AttorneyEmail').value = '';
            document.getElementById('buyer2AttorneyAddress').value = '';
            document.getElementById('buyer2AttorneyCity').value = '';
            document.getElementById('buyer2AttorneyState').value = '';
            document.getElementById('buyer2AttorneyZip').value = '';
        } catch (e) {
        }
    } else if (opt == 'B3Attorney') {
        try {
            document.loanModForm.B1AttorneyID.value = 0;
            document.getElementById('buyer3AttorneyName').value = '';
            document.getElementById('buyer3FirmName').value = '';
            // document.getElementById('buyer3AttorneyPhNo1').value = '';
            document.getElementById('buyer3AttorneyPhNo').value = '';
            // document.getElementById('buyer3AttorneyPhNo2').value = '';
            // document.getElementById('buyer3AttorneyPhNo3').value = '';
            // document.getElementById('buyer3AttorneyPhExt').value = '';
            // document.getElementById('buyer3AttorneyCellNo1').value = '';
            document.getElementById('buyer3AttorneyCellNo').value = '';
            // document.getElementById('buyer3AttorneyCellNo2').value = '';
            // document.getElementById('buyer3AttorneyCellNo3').value = '';
            // document.getElementById('buyer3AttorneyFaxNo1').value = '';
            document.getElementById('buyer3AttorneyFaxNo').value = '';
            // document.getElementById('buyer3AttorneyFaxNo2').value = '';
            // document.getElementById('buyer3AttorneyFaxNo3').value = '';
            document.getElementById('buyer3AttorneyEmail').value = '';
            document.getElementById('buyer3AttorneyAddress').value = '';
            document.getElementById('buyer3AttorneyCity').value = '';
            document.getElementById('buyer3AttorneyState').value = '';
            document.getElementById('buyer3AttorneyZip').value = '';
        } catch (e) {
        }
    } else if (opt == 'PM') {
        try {
            document.loanModForm.propMgmntContactID.value = 0;
            document.getElementById('propMgmntContactPerson').value = '';
            document.getElementById('propMgmntCompany').value = '';
            document.getElementById('propMgmntContactEmail').value = '';
            document.getElementById('propMgmntAddress').value = '';
            document.getElementById('propMgmntCity').value = '';
            document.getElementById('propMgmntState').value = '';
            document.getElementById('propMgmntZip').value = '';
            document.getElementById('propMgmntPhNo1').value = '';
            document.getElementById('propMgmntPhNo2').value = '';
            document.getElementById('propMgmntPhNo3').value = '';
            document.getElementById('propMgmntPhExt').value = '';
            document.getElementById('propMgmntNotes').value = '';
        } catch (e) {
        }
    } else if (opt == 'CA') {
        try {
            document.loanModForm.counselAttorneyID.value = 0;
            document.getElementById('counselAttorneyName').value = '';
            document.getElementById('counselAttorneyFirmName').value = '';
            document.getElementById('counselAttorneyEmail').value = '';
            document.getElementById('counselAttorneyPhone1').value = '';
            document.getElementById('counselAttorneyPhone2').value = '';
            document.getElementById('counselAttorneyPhone3').value = '';
            document.getElementById('counselAttorneyPhoneExt').value = '';
            document.getElementById('counselAttorneyFax1').value = '';
            document.getElementById('counselAttorneyFax2').value = '';
            document.getElementById('counselAttorneyFax3').value = '';
            document.getElementById('counselAttorneyCell1').value = '';
            document.getElementById('counselAttorneyCell2').value = '';
            document.getElementById('counselAttorneyCell3').value = '';
            document.getElementById('counselAttorneyAddress').value = '';
            document.getElementById('counselAttorneyCity').value = '';
            document.getElementById('counselAttorneyState').value = '';
            document.getElementById('counselAttorneyZip').value = '';
        } catch (e) {
        }
    } else if (opt == 'insuranceCompany' || opt == 'insuranceCompanyLName' || opt == 'insuranceCompanyCName') {
        try {
            clear_form_elements('insuranceCompanyContacts');
        } catch (e) {
        }
        try {
            document.getElementById('insuranceCompanyName' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('insuranceCompanyLastName' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('insuranceCompanyID' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('insuranceCompanyID' + idVal).value = 0;
        } catch (e) {
        }
        try {
            document.getElementById('proInsFirstName_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proInsName_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncPh1_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncPh2_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncPh3_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncPhExt_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncFax1_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncFax2').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncFax3_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncEmail_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncWebsite_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncTollFree1_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncTollFree2_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncTollFree3_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncTollFreeExt_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncCellNo1_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncCellNo2_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proIncCellNo3_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proInsLastName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proInsAddress_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proInsCity_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proInsState_' + idVal).value = '';
        } catch (e) {
        }
        try {
            document.getElementById('proInsZip_' + idVal).value = '';
        } catch (e) {
        }
    } else if (opt == 'attorney' || opt == 'attorneyCName') {
        try {
            document.loanModForm.tempTitleAttorneyName.value = '';
        } catch (e) {
        }
        try {
            document.loanModForm.tempTitleAttorneyCName.value = '';
        } catch (e) {
        }
        try {
            document.loanModForm.titleAttorneyID.value = 0;
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyFirmName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyPhoneNumber1').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyPhoneNumber2').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyPhoneNumber3').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyPhoneNumberExt').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyEmail').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyAddress').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyCity').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyState').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyZip').value = '';
        } catch (e) {
        }
        /*} else if (opt == 'appraiser1') {
        clear_form_elements('appraiser1ID');
        document.getElementById('A1AppraiserID').value = '';
        document.getElementById('tempA1AppraiserName').value = '';
	} else if (opt == 'appraiser2') {
        clear_form_elements('appraiser2ID');
        document.getElementById('A2AppraiserID').value = '';
        document.getElementById('tempA2AppraiserName').value = '';
	} else if (opt == 'BPO1') {
        document.getElementById('A1BPOID').value = '';
        document.getElementById('tempA1RealtorName').value = '';
        clear_form_elements('Realtor1ID');
        clear_form_elements('BPO1ID');
	} else if (opt == 'BPO2') {
        document.getElementById('A2BPOID').value = '';
        document.getElementById('tempA2RealtorName').value = '';
        clear_form_elements('Realtor2ID');
        clear_form_elements('BPO2ID');
	} else if (opt == 'BPO3') {
        document.getElementById('A3BPOID').value = '';
        document.getElementById('tempA3RealtorName').value = '';
        clear_form_elements('Realtor3ID');
        clear_form_elements('BPO3ID');
	}*/
    } else if (opt == 'appraiser1' || opt == 'appraiser1LName' || opt == 'appraiser1CName') {
        try {
            document.getElementById('A1AppraiserID').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA1AppraiserName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA1AppraiserLName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA1AppraiserCName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('appraiser1Company').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('appraiser1AppraiserName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('appraiser1LName').value = '';
        } catch (e) {
        }
        try {
            clear_form_elements('appraiser1ID');
        } catch (e) {
        }
    } else if (opt == 'appraiser2' || opt == 'appraiser2LName' || opt == 'appraiser2CName') {
        try {
            document.getElementById('A2AppraiserID').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA2AppraiserName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA2AppraiserLName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA2AppraiserCName').value = '';
        } catch (e) {
        }
        try {
            clear_form_elements('appraiser2ID');
        } catch (e) {
        }
    } else if (opt == 'BPO1' || opt == 'BPO1LName' || opt == 'BPO1CName') {
        try {
            document.getElementById('A1BPOID').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA1RealtorName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA1RealtorLName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA1RealtorCName').value = '';
        } catch (e) {
        }
        try {
            clear_form_elements('Realtor1ID');
        } catch (e) {
        }
    } else if (opt == 'BPO2' || opt == 'BPO2LName' || opt == 'BPO2CName') {
        try {
            document.getElementById('A2BPOID').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA2RealtorName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA2RealtorLName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA2RealtorCName').value = '';
        } catch (e) {
        }
        try {
            clear_form_elements('Realtor2ID');
        } catch (e) {
        }
    } else if (opt == 'BPO3' || opt == 'BPO3LName' || opt == 'BPO3CName') {
        try {
            document.getElementById('A3BPOID').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA3RealtorName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA3RealtorLName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempA3RealtorCName').value = '';
        } catch (e) {
        }
        try {
            clear_form_elements('Realtor3ID');
        } catch (e) {
        }
    } else if (opt == 'GCName' || opt == 'GCLName' || opt == 'GCCName') {
        try {
            document.getElementById('GCContactID').value = 0;
        } catch (e) {
        }
        try {
            document.getElementById('GCLicense').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempGCFirstName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempGCLastName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('tempGCCompanyName').value = '';
        } catch (e) {
        }
        try {
            clear_form_elements('GCContactID');
        } catch (e) {
        }
    } else if (opt == 'Lender') {
        document.getElementById('serviceLenderID').value = '';
        document.getElementById('serviceLenderName').value = '';
        document.getElementById('serviceLenderAddress').value = '';
        document.getElementById('serviceLenderCity').value = '';
        document.getElementById('serviceLenderState').value = '';
        document.getElementById('serviceLenderZip').value = '';
    } else if (opt == 'TA') {
        document.getElementById('trusteeAttorneyID').value = '';
        document.getElementById('trusteeAttorneyContactName').value = '';
        document.getElementById('trusteeName').value = '';
    } else if (opt == 'TR') {
        try {
            document.loanModForm.trusteeID.value = 0;
        } catch (e) {
        }
        try {
            document.getElementById('trusteeName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeFirmName').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeEmail').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteePhone1').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteePhone2').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteePhone3').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteePhoneExt').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeFax1').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeFax2').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeFax3').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeCell1').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeCell2').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeCell3').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteePhone').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeFax').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeCellNo').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeAddress').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeCity').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeState').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeZip').value = '';
        } catch (e) {
        }
        try {
            document.getElementById('trusteeLastName').value = '';
        } catch (e) {
        }
    }
    try {
        enableSaveButton(); // | Enable Save Button on Any Auto complete.
    } catch (e) {
    }
}

function calculateRemainingMonths(date1, formName, srcFld, termFld, trgtFld) {
    var date2 = '',
        remainingMonths = "",
        terms = '';

    eval("date2 = document." + formName + "." + srcFld + ".value");
    eval("terms = document." + formName + "." + termFld + ".value");

    var url = "../backoffice/calculateRemainingMonths.php";
    var qstr = "loanOriginationDate=" + date2 + "&term=" + terms;
    try {
        remainingMonths = getResponse(url, qstr);
    } catch (e) {
    }
    /*
    if(date2 == '' || date2 == '00-00-0000') {
    } else {
        remainingMonths = monthDiff (date1, date2, termFld, formName);
    }

    if(remainingMonths > 0) {
    } else {
        remainingMonths = '';
    }
*/
    try {
        eval("document." + formName + "." + trgtFld + ".value = remainingMonths");
    } catch (e) {
    }
}

/*
function monthDiff(d1, d2, termFld, formName) {
    var noOfMonths = 0, remainingMonths = 0, termsInMonths = 0, terms = '', remainingMonths = 0;

    md = d1.split("/");
    md1 = d2.split("/");
    var a = new Date(md[2], md[0], md[1]);
    var b = new Date(md1[2], md1[0], md1[1]);

    noOfMonths = Math.floor((a - b) / (30 * 60 * 60 * 24 * 1000));

    eval("terms = document."+formName+"."+termFld+".value");

    if (terms == 'Remaining Months') {
    } else if (terms == 'Interest Only') {
        termsInMonths = 12;
    } else {
		try {
            pos = terms.indexOf("/");
            if((pos == 0) || (pos == -1)) {
                pos = terms.indexOf(" ");
            }
            terms = terms.substring(0,pos);
            terms = parseInt(terms);
		} catch(e) {}
		if (terms != "") {
			if(terms > 0) {
                termsInMonths = terms * 12;
			}
		}
    }

    if(termsInMonths > 0) {
        remainingMonths = termsInMonths - noOfMonths;
    }
    return remainingMonths;
}
*/


function exportFileTask(PCID, LMRId, borrowerName, coBorrowerName, opt) {
    showLoader();
    setTimeout("generateExcelForFileTask('" + PCID + "', '" + LMRId + "', '" + borrowerName + "', '" + coBorrowerName + "', '" + opt + "')", "200");
}

function generateExcelForFileTask(PCID, LMRId, borrowerName, coBorrowerName, opt) {
    window.open('../backoffice/exportFileTask.php?PCID=' + PCID + '&LMRId=' + LMRId + '&bn=' + borrowerName + '&cn=' + coBorrowerName + '&opt=' + opt);
    setTimeout("hideLoader()", "200");
    return false;
}

function showAndHideHOALienTab(t, val, opt) {
    var publicUser = 0;
    try {
        publicUser = document.getElementById('publicUser').value;
    } catch (e) {
    }
    if (publicUser == 1) {
    } else {
        if (t.form_field.name == 'fileModule[]' && val == 'HOA') {
            var tabsToShow = new Array('CI', 'MI', 'PI', 'ER', 'QA', 'CON', 'DOC', 'TA', 'CW', 'ADMIN', 'LE', 'BC');
            if (opt == 'show') {
                $("div[id^='tab_']").css('display', 'none');
                for (var i = 0; i < tabsToShow.length; i++) {
                    var s = '#tab_' + tabsToShow[i];
                    $(s).css('display', 'block');
                }
            } else {
                $("div[id^='tab_']").css('display', 'block');
            }
            $("#tab_CI").css('display', 'block');

        }
        if (t.form_field.name == 'fileModule[]' && val == 'LO') {
            var tabsToShow = new Array('CI', 'PI', 'IE', 'AL', 'EXP', 'CON', 'DOC', 'TA', 'CW', 'ADMIN', 'BC');
            if (opt == 'show') {
                $("div[id^='tab_']").css('display', 'none');
                for (var i = 0; i < tabsToShow.length; i++) {
                    var s = '#tab_' + tabsToShow[i];
                    $(s).css('display', 'block');
                }
            } else {
                $("div[id^='tab_']").css('display', 'block');
            }
            $("#tab_CI").css('display', 'block');

        }

        if (t.form_field.name == 'fileModule[]' && val == 'FU') {
            var tabsToShow = new Array('CI', 'ADMIN', 'DOC', 'TA', 'CW');
            if (opt == 'show') {
                $("div[id^='tab_']").css('display', 'none');
                for (var i = 0; i < tabsToShow.length; i++) {
                    var s = '#tab_' + tabsToShow[i];
                    $(s).css('display', 'block');
                }
            } else {
                $("div[id^='tab_']").css('display', 'block');
            }
            $("#tab_CI").css('display', 'block');

        }

        /**

         ** Description    : Hard / Private Money LOS module Section Show and Hide
         ** Developer    : Viji & Venkatesh
         ** Author        : Awatasoftsys
         ** Date            : Nov 18, 2016

         **/
        // if(t.form_field.name == 'fileModule[]' && val == 'HMLO') {
        // 	var tabsToShow = new Array('CI', 'PI', 'IE', 'AL', 'EXP', 'CON', 'DOC', 'TA', 'CW', 'ADMIN', 'BC', 'LI');
        // 	if (opt == 'show')
        // 	{
        // 		$("div[id^='tab_']").css('display', 'none');
        // 		for(var i =0; i< tabsToShow.length; i++) {
        // 			var s = '#tab_'+tabsToShow[i];
        // 			$(s).css('display', 'block');
        // 		}
        // 	} else {
        // 		$("div[id^='tab_']").css('display', 'block');
        // 	}
        // 	$("#tab_CI").css('display', 'block');
        //
        // }
    }
}

function populateTitleValue(fld1, fld2) {
    document.getElementById(fld2).value = document.getElementById(fld1).value;
}

function hideselectedsection(divClass, i) {
    if ($("." + divClass + i + "ID").is(':visible')) {
        $("." + divClass + i + "ID").hide();
        clear_form_elements(divClass + i + "ID");

    }
    try {
        enableSaveButton();
    } catch (e) {

    }
}

function showAndHidePropertyValuationInfoAppraiser(divClass, noOfDiv, opt) {

    if (opt == 'remove') {
        //$("." + divClass + noOfDiv + "IDDelete").remove();
        // $("." + divClass + noOfDiv + "IDUpdate").hide();
        // $("." + divClass + noOfDiv + "ID").hide();

        clear_form_elements(divClass + noOfDiv + "ID");
        if (noOfDiv == 2) {
            $("." + divClass + noOfDiv + "ID").hide();
        }

        /*   for (var i = noOfDiv; i > 0; i--) {
               if ($("." + divClass + i + "ID").is(':visible')) {
                   if(divClass == 'appraiser') {
                       $("." + divClass + i + "ID").hide();
                   } else {
                       $("." + divClass + i + "ID").hide();
                   }
                   clear_form_elements(divClass + i + "ID");
                   break;
               }
           }*/
        if (i == 1) {
            //alert('Minium one ' + divClass + ' needed');
            toastrNotification('Minimum one ' + divClass + ' needed', 'error');
        }
    } else {
        for (var i = 0; i <= noOfDiv; i++) {
            if ($("." + divClass + i + "ID").is(':hidden')) {
                $("." + divClass + i + "ID").show();
                break;
            }
        }
        if (i > noOfDiv) {
            //alert('Only '+ noOfDiv + ' ' + divClass + ' can be added');
            //alert('Maximum amount reached');
            toastrNotification('Maximum amount reached', 'error');
        }
    }
    jQuery(".snoCls").each(function (i) {
        $(this).html((i + 1));
    });
    enableSaveButton();

}


function showAndHidePropertyValuationInfoAVM(divClass, noOfDiv, opt, maxCount) {

    if (opt == 'remove') {
        clear_form_elements(divClass + noOfDiv + "ID");

        if (noOfDiv > 1) {
            $("." + divClass + noOfDiv + "ID").hide();
        }
        if (noOfDiv == 1) {
            toastrNotification('Minimum one ' + divClass + ' needed', 'error');
        }
    } else {
        maxError = true;
        for (var i = 0; i <= maxCount; i++) {
            if ($("." + divClass + i + "ID").is(':hidden')) {
                maxError = false;
                $("." + divClass + i + "ID").show();
                break;
            }
        }
        if ($(".AVMDIV:visible").length == maxCount && maxError) {
            toastrNotification('Maximum amount reached', 'error');
        }
    }
    // jQuery(".snoCls").each(function (i) {
    //     $(this).html((i + 1));
    // });
    enableSaveButton();

}

function showAndHidePropertyValuationInfoRealtorBPO(divClass, noOfDiv, opt, maxCount) {

    if (opt == 'remove') {
        clear_form_elements(divClass + noOfDiv + "ID");
        if (noOfDiv > 1) {
            $("." + divClass + noOfDiv + "ID").hide();
        }
        if (noOfDiv == 1) {
            toastrNotification('Minimum one ' + divClass + ' needed', 'error');
        }
    } else {
        maxError = true;
        for (var i = 0; i <= maxCount; i++) {
            if ($("." + divClass + i + "ID").is(':hidden')) {
                maxError = false;
                $("." + divClass + i + "ID").show();
                break;
            }
        }
        if ($(".RealtorBPODIV:visible").length == maxCount && maxError) {
            toastrNotification('Maximum amount reached', 'error');
        }
    }
    // jQuery(".snoCls").each(function (i) {
    //     $(this).html((i + 1));
    // });
    enableSaveButton();

}

function showAndHidePropertyValuationInfo(divClass, noOfDiv, opt) {

    if (opt == 'remove') {
        for (var i = noOfDiv; i > 0; i--) {
            if ($("." + divClass + i + "ID").is(':visible')) {
                if (divClass == 'appraiser') {
                    $("." + divClass + i + "ID").hide();
                } else {
                    $("." + divClass + i + "ID").hide();
                }
                clear_form_elements(divClass + i + "ID");
                break;
            }
        }
        if (i == 0) {
            //alert('Minium one ' + divClass + ' needed');
            toastrNotification('Minimum one ' + divClass + ' needed', 'error');
        }
    } else {
        for (var i = 0; i <= noOfDiv; i++) {
            if ($("." + divClass + i + "ID").is(':hidden')) {
                $("." + divClass + i + "ID").show();
                break;
            }
        }
        if (i > noOfDiv) {
            //alert('Only '+ noOfDiv + ' ' + divClass + ' can be added');
            //alert('Maximum amount reached');
            toastrNotification('Maximum amount reached', 'error');
        }
    }
    jQuery(".snoCls").each(function (i) {
        $(this).html((i + 1));
    });
    enableSaveButton();

}

function showCounselAttorneyContactsForFile(CID, PCID) {
    var companyName = '',
        phone1 = '',
        phone2 = '',
        phone3 = '',
        ext = '',
        cell1 = '',
        cell2 = '',
        cell3 = '',
        fax1 = '',
        fax2 = '',
        fax3 = '',
        email = '',
        address = '',
        city = '',
        state = '',
        zip = '';
    var contactList = new Array();
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    for (var i = 0; i < contactList.length; i++) {
        try {
            companyName = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            email = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone1 = contactList[i].getElementsByTagName("phone1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone2 = contactList[i].getElementsByTagName("phone2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone3 = contactList[i].getElementsByTagName("phone3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            ext = contactList[i].getElementsByTagName("ext")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax1 = contactList[i].getElementsByTagName("fax1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax2 = contactList[i].getElementsByTagName("fax2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            fax3 = contactList[i].getElementsByTagName("fax3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell1 = contactList[i].getElementsByTagName("cell1")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell2 = contactList[i].getElementsByTagName("cell2")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            cell3 = contactList[i].getElementsByTagName("cell3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            address = contactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            city = contactList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            state = contactList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            zip = contactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyFirmName').value = companyName;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyEmail').value = email;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyPhone1').value = phone1;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyPhone2').value = phone2;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyPhone3').value = phone3;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyPhoneExt').value = ext;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyFax1').value = fax1;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyFax2').value = fax2;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyFax3').value = fax3;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyCell1').value = cell1;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyCell2').value = cell2;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyCell3').value = cell3;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyAddress').value = address;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyCity').value = city;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyState').value = state;
        } catch (e) {
        }
        try {
            document.getElementById('counselAttorneyZip').value = zip;
        } catch (e) {
        }
    }
}

function validateClientDocumentIntakeForm() {
    if (
        chkIsBlank('loanModForm', 'agentId', 'Please select any agent.') &&
        validateAmountAllowBlank('loanModForm', 'homeValue', 'Please Enter Correct Home Value.')
    ) {
        return true;
    } else {
        return false;
    }
}

/* PC = Loscalzo & Associates */

function validateLoscalzoIntakeForm() {
    if (
        chkIsBlank('loanModForm', 'agentId', 'Please select any agent.')
    ) {
        return true;
    } else {
        return false;
    }
}

/*
 * Validate Upload Form.
 */
function validatePropertyUploadForm(formName) {
    var fileUpdLimit = 0,
        activateTab = '';
    var i = 1,
        k = 0;
    try {
        eval("activateTab = document." + formName + ".activeTab.value");
    } catch (e) {
    }
    try {
        eval("fileUpdLimit = document." + formName + ".fileUpdLimit.value");
    } catch (e) {
    }

    for (var i = 1; i <= fileUpdLimit; i++) {
        var path = "";
        eval("path = document." + formName + ".fileSrc_" + i + ".value");
        if (path != "") k++;
    }

    if (k == 0) {
        //alert("Select Files to Upload");

        toastrNotification('Select Files to Upload', 'error');
        try {
            eval("document." + formName + ".fileSrc_1.focus()");
        } catch (e) {
        }
        try {
            eval("document.getElementById('fileSrc_1').className = 'highlights'");
        } catch (e) {
        }
        return false;
    }

    for (var i = 1; i <= fileUpdLimit; i++) {

        var path = "";
        try {
            eval("path = document." + formName + ".fileSrc_" + i + ".value");
        } catch (e) {
        }
        var path_len = path.length;
        var file_length = path.lastIndexOf('\\');
        var fileName = path.substring(file_length + 1, path_len);
        if (activateTab == 'LA') {
            for (var j = 1; j <= fileUpdLimit; j++) {
                var path1 = "";
                try {
                    eval("path1 = document." + formName + ".fileSrc_" + j + ".value");
                } catch (e) {
                }
                if (path1 != "") {
                    if (chkIsBlank(formName, 'docName_' + j, 'Please enter the document name')) {
                    } else {
                        return false;
                    }
                }
            }
        }

        if (path != '') {

            path_len = path.length;
            file_extension = path.lastIndexOf('.');
            file_ext_string = path.substring(file_extension + 1, path_len);
            if ((file_ext_string == "pdf") || (file_ext_string == "PDF") ||
                (file_ext_string == "txt") || (file_ext_string == "TXT") ||
                (file_ext_string == "bmp") || (file_ext_string == "BMP") ||
                (file_ext_string == "doc") || (file_ext_string == "DOC") ||
                (file_ext_string == "docx") || (file_ext_string == "DOCX") ||
                (file_ext_string == "xls") || (file_ext_string == "XLS") ||
                (file_ext_string == "xlsx") || (file_ext_string == "XLSX") ||
                (file_ext_string == "jpg") || (file_ext_string == "jpeg") ||
                (file_ext_string == "JPG") || (file_ext_string == "JPEG") ||
                (file_ext_string == "pjpeg") || (file_ext_string == "gif") ||
                (file_ext_string == "PJPEG") || (file_ext_string == "GIF") ||
                (file_ext_string == "png") || (file_ext_string == "PNG") ||
                (file_ext_string == "html") || (file_ext_string == "HTML") ||
                (file_ext_string == "odt") || (file_ext_string == "ODT") ||
                (file_ext_string == "htm") || (file_ext_string == "HTM") ||
                (file_ext_string == "shtml") || (file_ext_string == "SHTML") ||
                (file_ext_string == "aif") || (file_ext_string == "AIF") ||
                (file_ext_string == "aiff") || (file_ext_string == "AIFF") ||
                (file_ext_string == "m4a") || (file_ext_string == "M4A") ||
                (file_ext_string == "mp3") || (file_ext_string == "MP3") ||
                (file_ext_string == "ra") || (file_ext_string == "RA") ||
                (file_ext_string == "ram") || (file_ext_string == "RAM") ||
                (file_ext_string == "wav") || (file_ext_string == "WAV") ||
                (file_ext_string == "wma") || (file_ext_string == "WMA") ||
                (file_ext_string == "mid") || (file_ext_string == "MID") ||
                (file_ext_string == "midi") || (file_ext_string == "MIDI") ||
                (file_ext_string == "zip") || (file_ext_string == "ZIP")
            ) {
                if (isValidFileName(fileName)) {
                    document.getElementById('loader').style.display = 'block';
                    return eval("GetFileSize('" + formName + "', 'fileSrc_" + i + "')");
                } else {
                    return false;
                }
            } else {
                //alert ("File types allowed are pdf, doc, docx, xls, xlsx, gif, jpeg, png, html, htm, shtml, bmp, txt, aif, aiff, m4a, mp3, ra, ram, wav, wma, mid, midi, zip.");

                toastrNotification('File types allowed are pdf, doc, docx, xls, xlsx, gif, jpeg, png, html, htm, shtml, bmp, txt, aif, aiff, m4a, mp3, ra, ram, wav, wma, mid, midi, zip.', 'error');
                return false;
            }
        }
    }

    return false;
}


/*
function validatePropertyUploadForm (formName,uploadOpt) {
	var fileUpdLimit = 5, activateTab = '', returnOpt = true;
		var path = "";
        try
        {
		    eval("path = document."+formName+"."+uploadOpt+".value");
        } catch(e){}
		if (path != '') {
			var path_len = path.length;
			var file_length = path.lastIndexOf('\\');
			var fileName = path.substring(file_length+1,path_len);

			path_len = path.length;
			file_extension = path.lastIndexOf('.');
			file_ext_string = path.substring(file_extension+1,path_len);
			if  ((file_ext_string == "bmp") || (file_ext_string == "BMP") ||
				(file_ext_string == "gif") || (file_ext_string == "GIF") ||
				(file_ext_string == "jpg") || (file_ext_string == "jpeg") ||
				(file_ext_string == "JPG") || (file_ext_string == "JPEG") ||
				(file_ext_string == "pjpeg") || (file_ext_string == "gif") ||
				(file_ext_string == "PJPEG") || (file_ext_string == "GIF") ||
				(file_ext_string == "png") || (file_ext_string == "PNG")
			) {
				 if (isValidFileName(fileName)) {
					returnOpt = eval("GetFileSize('"+formName+"', '"+uploadOpt+"')");
				 } else { returnOpt = false; }
		   } else {
			   alert ("File types allowed are gif, jpeg, png, bmp.");
					eval("document."+formName+"."+uploadOpt+".focus()");
				try {
					document.getElementById(fieldName).className = "highlights";
				} catch(e) {}

			   returnOpt = false;
			}
		}
	return returnOpt;
}
*/

/* Appraiser Info */

function validateAppraiserUpload(formName) {
    if (validatePropertyUploadForm(formName, 'appraiser1Upload') && validatePropertyUploadForm(formName, 'appraiser2Upload')) {
        return true;
    } else {
        return false;
    }
}


/* BPO Info */

function validatePropertyUpload(formName) {
    if (validatePropertyUploadForm(formName, 'BPO1Upload') && validatePropertyUploadForm(formName, 'BPO2Upload') && validatePropertyUploadForm(formName, 'BPO3Upload')) {
        return true;
    } else {
        return false;
    }
}

function validatePropertyTitleUpload(formName) {
    if (validatePropertyUploadForm(formName, 'titleReport')) {
        return true;
    } else {
        return false;
    }
}

/*
function validatePropertypropertyInsuranceCoverageUpload(formName) {
	if(validatePropertyUploadForm(formName,'propertyInsuranceCoverage') ){
			return true;
	} else {
        return false;
	}
}
*/
function getServiceTypes(formName) {

    try {
        $('.ft').html($('#fileModule').val());
    } catch (e) {
    } /* API- Lead/Data Posting */

    var executiveId = 0;
    len = 0, LMRId = 0, fileModuleCode = '', PCID = 0, publicUser = 0;
    var j = 0,
        primaryStatus = '';
    var isHMLOSelected = 0,
        isHMLOPC = 0;
    try {
        eval("executiveId = document." + formName + ".branchId.value");
    } catch (e) {
    }
    try {
        eval("LMRId = document." + formName + ".encryptedLId.value");
    } catch (e) {
    }
    try {
        eval("primaryStatus = document." + formName + ".OSID.value");
    } catch (e) {
    }

    try {
        eval("obj = document." + formName + "['fileModule[]']");
        len = obj.length;
    } catch (e) {
    }
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].selected) {
            if (j > 0) fileModuleCode += ",";
            fileModuleCode += obj[i].value;
            if (obj[i].value == 'HMLO') {
                isHMLOSelected = 1;
            }
            j++;
        }
        if (obj[i].value == 'HMLO') {
            isHMLOPC = 1;
        }
    }
    try {
        PCID = document.loanModForm.selectedPC.value;
        publicUser = document.loanModForm.publicUser.value;
    } catch (e) {
    }
    try {
        if (PCID == 0) {
            PCID = document.loanModFerrariForm.PCID.value;
        }
    } catch (e) {
    }

    var url = siteSSLUrl + "backoffice/branchServiceTypes.php";
    var qstr = "executiveId=" + executiveId + "&LMRId=" + LMRId + "&MC=" + fileModuleCode + "&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    var len = 0;
    try {
        servicesRequested = xmlDoc.getElementsByTagName("serList");
        len = servicesRequested.length;
    } catch (e) {
    }

    try {
        PCStatus = xmlDoc.getElementsByTagName("PCStatus");
        len2 = PCStatus.length;
    } catch (e) {
    }

    br = option = internalLoanOptionTxt = '';
    for (var ae = 0; ae < len; ae++) {
        var categoryName = "",
            catKey = 0,
            chk = '',
            internalLoanProgram = 0;
        categoryName
        try {
            catKey = servicesRequested[ae].getElementsByTagName("catKey")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            categoryName = servicesRequested[ae].getElementsByTagName("categoryName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            chk = servicesRequested[ae].getElementsByTagName("chk")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            internalLoanProgram = servicesRequested[ae].getElementsByTagName("internalLoanProgram")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        if (internalLoanProgram == 0) {
            if (catKey != 'TBD') {
                br += '<option value="' + catKey + '" ' + chk + '>' + categoryName + '</option>';
                option += '<option value="' + catKey + '" ' + chk + '>' + categoryName + '</option>\n';
            }
        } else {
            internalLoanOptionTxt += '<option value="' + catKey + '" ' + chk + '>' + categoryName + '</option>';
        }

    }
    // $("#LMRClientType_chosen").remove();
    $('#LMRClientType').empty();
    $('#LMRClientType_mirror').empty();
    $('#LMRClientType').append('<option></option>').trigger("chosen:updated");
    $('#LMRClientType').val('').trigger("chosen:updated");
    //return false;
    if (fileModuleCode != '' && executiveId != '') {
        $("#LMRClientType").chosen("destroy");
        $('#LMRClientType').append(br).trigger("chosen:updated");
        $("#LMRClientType").chosen({allow_single_deselect: true});
        try {
            $('#LMRClientType_mirror').append('<option value="" >- Select -</option>').trigger("chosen:updated");
            $('#LMRClientType_mirror').append(br).trigger("chosen:updated");
        } catch (e) {
        }

    }
    if (isHMLOPC == 1) { /* If my PC has HMLO option as file type & do the switch single to multi select and vice versa - Aug 19, 2017 - Viji & Venkatesh */

        /* Remove the Single or multi chosen select styles */
        //$("#LMRInternalLoanProgram_chzn").remove().removeClass("chsn"); /* Remove the Single or multi chosen select styles */
        if (isHMLOSelected == 1) {
            try {
                //   $("#LMRClientType").css({ display: "block" }).addClass("chsn"); /* Remove the multiple property from DD and also reset the chosen select styles */
                //  $("#LMRInternalLoanProgram").css({display: "inline-block"}).removeClass("chzn-done").removeAttr('multiple').addClass("chsn");

                //  $(".chsn").chosen({no_results_text: "No results matched"}); /* Rerender the chosen select */
                //   $(".chsn").trigger("chosen:updated");

            } catch (e) {
            }
        } else {
            try {
                //     $("#LMRClientType").css({ display: "block" }).addClass("chsn"); /* Add multiple property in the DD and also reset the chosen select styles */
                //  $("#LMRInternalLoanProgram").css({display: "inline-block"}).removeClass("chzn-done").attr('multiple', 'multiple').addClass("chsn");
                //    $(".chsn").chosen({no_results_text: "No results matched"}); /* Rerender the chosen select */
                //    $(".chsn").trigger("chosen:updated");
            } catch (e) {
            }
        }
    } else {

        // $("#LMRClientType_chosen").remove();
        // $("#LMRClientType").css({ display: "block" }).addClass("chsn");
        //  $(".chsn").chosen({no_results_text: "No results matched"}); /* Rerender the chosen select */
        //  $(".chsn").trigger("chosen:updated");
    }

    $('#LMRadditionalLoanProgram').empty();
    //$('#LMRadditionalLoanProgram').append('<option value="" >- Select -</option>').trigger("chosen:updated");
    $('#LMRadditionalLoanProgram').append(br).trigger("chosen:updated");

    try {
        // $('#LMRClientType_mirror').empty();
        // $('#LMRClientType_mirror').append('<option value="" >- Select -</option>').trigger("chosen:updated");
    } catch (e) {
    }

    if (PCID == 4326 && LMRId == '3178f12db7e77c19') { // **exception** PCID = 4326 (BD Capital) //encode value for LMRId = 0 (3178f12db7e77c19)
        //let the ILP stay as set for To Be Determined
    } else { // old code
        $('#LMRInternalLoanProgram').empty();
        $('#LMRInternalLoanProgram').append('<option value="" >- Select -</option>').trigger("chosen:updated");

        $('#LMRInternalLoanProgram').append(internalLoanOptionTxt).trigger("chosen:updated");
    }


    if (publicUser != 1) {

        var tempKeys = '';
        var ps1 = '<select name="primaryStatus" id="primaryStatus" class="primaryStatus form-control input-sm mandatory">';
        ps1 += '<option value="">- Select -</option>';
        for (var ps = 0; ps < len2; ps++) {
            var PSName = "",
                PSID = 0,
                newStatusId = 0,
                selOpt = '',
                moduleKeys = '',
                disabledVal = '', selOptDisabled = '';
            try {
                PSID = PCStatus[ps].getElementsByTagName("PSID")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                PSName = PCStatus[ps].getElementsByTagName("PSName")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            try {
                newStatusId = PCStatus[ps].getElementsByTagName("newStatusId")[0].childNodes[0].nodeValue;
            } catch (e) {
            }

            try {
                disabledVal = PCStatus[ps].getElementsByTagName("disabledVal")[0].childNodes[0].nodeValue;
            } catch (e) {
            }

            if (LMRId != '') {
                if (primaryStatus == PSID) {
                    selOpt = 'selected';
                }

                if (disabledVal != '') {
                    selOptDisabled = 'disabled title="Status Disabled" ';
                }
            } else {
                if (newStatusId == PSID) {
                    selOpt = 'selected';
                }
            }
            try {
                moduleKeys = PCStatus[ps].getElementsByTagName("moduleKeys")[0].childNodes[0].nodeValue;
            } catch (e) {
            }
            if (tempKeys != moduleKeys) {
                if (ps > 0) {
                    ps1 += '</optgroup>';
                }
                ps1 += '<optgroup label="' + moduleKeys + '">';
            }

            ps1 += '<option ' + selOptDisabled + ' value="' + PSID + '" ' + selOpt + '>' + PSName + '</option>';
            tempKeys = moduleKeys;

        }
        if (len2 > 0) {
            ps1 += '</optgroup>';
        }
        ps1 += '</select>';
        $('#primaryStatus_container').html(ps1);
    }
}

function includeLoanModDocs(cls, val, enabledCls) {
    if (val == 'No') {
        $('.' + cls).css('background-color', '#D3D3D3');
        $('.' + enabledCls).attr('disabled', true);
        $('.' + enabledCls).attr('disabled', true);
    } else {
        $('.' + cls).css('background-color', '#ffffff');
        $('.' + enabledCls).attr('disabled', false);
        $('.' + enabledCls).attr('disabled', false);
    }
}

function populateDualFieldForHMLO(val, formName, targetFld) {
    try {
        eval("document." + formName + "." + targetFld + ".value = val");
    } catch (e) {
    }
}

function calculateAmoritizationValue(loanAmt, rate, term) {
    var amt = 0;
    if (rate == "") {
        rate = 0;
    }
    if (loanAmt == "") {
        loanAmt = 0;
    }
    if (term == "") {
        term = 0;
    }
    var intr = rate / 1200;
    amt = loanAmt * intr / (1 - (Math.pow(1 / (1 + intr), term)));
    try {
        //		amt = amt.toFixed(2);
    } catch (e) {
    }
    return amt;
}

function validateClientInfoBrokerForm() {
    if (isEmailOk('loanModBrokerForm', 'brokerEmail') &&
        chkIsBlank('loanModBrokerForm', 'brokerFirstName', 'Please Enter Broker First Name') &&
        chkIsBlank('loanModBrokerForm', 'brokerCompany', 'Please Enter Broker Company')
    ) {
        saveNewBroker();
        return false;
    } else {
        return false;
    }
}

/**

 Description    : Create a new Agent/Broker in Client Info Tab
 Developer    : Viji & Venkatesh
 Date        : Feb 06, 2017

 **/

function saveNewBroker() {
    var bExt = '',
        executiveId = 0,
        bRc = 0,
        aRc = 0,
        fOpt = '',
        brokerNumber = 0,
        brokerName = '',
        PCID = 0,
        bn = 0, externalBroker = 0;
    try {
        executiveId = document.loanModBrokerForm.executiveId.value;
    } catch (e) {
    }

    try {
        externalBroker = document.loanModBrokerForm.externalBroker.value;
    } catch (e) {
    }
    try {
        brokerEmail = document.loanModBrokerForm.brokerEmail.value;
    } catch (e) {
    }
    try {
        bn = document.loanModBrokerForm.bn.value;
    } catch (e) {
    }

    try {
        brokerFirstName = document.loanModBrokerForm.brokerFirstName.value;
    } catch (e) {
    }

    try {
        brokerLastName = document.loanModBrokerForm.brokerLastName.value;
    } catch (e) {
    }

    try {
        brokerCompany = document.loanModBrokerForm.brokerCompany.value;
    } catch (e) {
    }

    try {
        bPhNo = document.loanModBrokerForm.bPhNo.value;
    } catch (e) {
    }

    try {
        bCellNo = document.loanModBrokerForm.bCellNo.value;
    } catch (e) {
    }

    try {
        bFax = document.loanModBrokerForm.bFax.value;
    } catch (e) {
    }


    try {
        bAddr = document.loanModBrokerForm.bAddr.value;
    } catch (e) {
    }
    try {
        bCity = document.loanModBrokerForm.bCity.value;
    } catch (e) {
    }
    try {
        bState = document.loanModBrokerForm.bState.value;
    } catch (e) {
    }
    try {
        bZipCode = document.loanModBrokerForm.bZipCode.value;
    } catch (e) {
    }
    try {
        PCID = document.loanModBrokerForm.PCID.value;
    } catch (e) {
    }
    var url = POPSURL + "NewBrokerSave.php";

    var qstr = "bn=" + bn + "&brokerFirstName=" + brokerFirstName + "&brokerLastName=" + brokerLastName + "&brokerEmail=" + brokerEmail + "&brokerCompany=" + brokerCompany + "&bPhNo=" + bPhNo + "&bCellNo=" + bCellNo + "&bFax=" + bFax + "&bAddr=" + bAddr + "&bCity=" + bCity + "&bState=" + bState + "&bZipCode=" + bZipCode + "&executiveId=" + executiveId + "&PCID=" + PCID + "&externalBroker=" + externalBroker;

    var xmlDoc = "";
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        newBrokerInfo = xmlDoc.getElementsByTagName("newBrokerInfo");
    } catch (e) {
    }
    for (var i = 0; i < newBrokerInfo.length; i++) {
        try {
            brokerNumber = newBrokerInfo[i].getElementsByTagName("brokerNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            brokerName = newBrokerInfo[i].getElementsByTagName("brokerName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            brokerEmail = newBrokerInfo[i].getElementsByTagName("brokerEmail")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
    }
    try {
        parent.document.loanModUserForm.LMRBroker.value = brokerNumber;
    } catch (e) {
    }
    try {
        parent.document.loanModDataForm.agentId.value = brokerNumber;
    } catch (e) {
    }
    try {
        document.loanModForm.agentId.value = brokerNumber;
    } catch (e) {
    }
    try {
        document.loanModSVForm.agentId.value = brokerNumber;
    } catch (e) {
    }
    var LMRBrokerArray = document.getElementById("agentId");
    var ln = 0;
    ln = LMRBrokerArray.options.length;
    LMRBrokerArray.options[ln + 1] = new Option(brokerName + ' - ' + brokerEmail, brokerNumber, true, true);
    // ContactPop.hideOverlay(); /** Close- Popup **/
    $('#exampleModal1').modal('toggle');

}

function hideSystemNotes(val, chk) {
    if (chk) {
        $('.clsSHNotes').show();
    } else {
        $('.clsSHNotes').hide();
    }

}

function showNotesType(val, chk) {
    if (chk) {
        $('.clsShowNotes_' + val).show();
    } else {
        $('.clsShowNotes_' + val).hide();
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
            case 'hidden':
            case 'textarea':
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

/**

 ** Description    : get the Property Info section in Attorney Details
 ** Developer    : Venky
 ** Author        : AwataSoftsys
 ** Date            : Jul 29, 2017

 **/

function showTitleAttorneyForFile(CID, PCID, idVal = '') {
    var attorneyList = new Array();
    var url = siteUrl + "JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        attorneyList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    if (attorneyList.length > 0) {
        allowToEditFileContacts('titleAttorneyContactCls' + idVal, 'titleAttorneyPrimContactCls' + idVal, 'Edit'); // Allow to Edit file contacts..
    }

    for (var i = 0; i < attorneyList.length; i++) {
        try {
            document.getElementById('titleAttorneyName_' + idVal).value = attorneyList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyLastName_' + idVal).value = attorneyList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyFirmName_' + idVal).value = attorneyList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyPhone_' + idVal).value = attorneyList[i].getElementsByTagName("phone")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyEmail_' + idVal).value = attorneyList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyAddress_' + idVal).value = attorneyList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyCity_' + idVal).value = attorneyList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyState_' + idVal).value = attorneyList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyZip_' + idVal).value = attorneyList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyBarNo_' + idVal).value = attorneyList[i].getElementsByTagName("barNo")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('titleAttorneyPhoneNumber_' + idVal).value = attorneyList[i].getElementsByTagName("phoneNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
    }
    $(".attorneyPhoneNumberAutoPopulate").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
}

function roundNumber(number, digits) {
    var multiple = Math.pow(10, digits);
    var rndedNum = Math.round(number * multiple) / multiple;
    return rndedNum;
}

function changeLMRNotes(chngOpt, divId, processorCommentsNo, LMRId, isPopUp) {
    // $('.with-children-tip > *').hideTip();
    var labelOpt = "Public",
        rsCnt = 0,
        display = "",
        prv_html = '',
        hideSysNotesVal = true;

    if (isPopUp == 1) {
        try {
            hideSysNotesVal = document.getElementById('hideSysNotes').checked;
        } catch (e) {
        }
    } else {
        try {
            hideSysNotesVal = document.getElementById('hideSysNotesVal').checked;
        } catch (e) {
        }
    }

    if (chngOpt == 1) {
        labelOpt = "Private";
    } else {
        labelOpt = "Public";
    }

    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: "Would you like to change this notes as " + labelOpt + "?",
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            yes: {
                btnClass: 'btn-green',
                action: function () {
                    var url = "../backoffice/updateLMRProcessorComments.php";
                    var qstr = "pNo=" + processorCommentsNo + "&private=" + chngOpt;
                    try {
                        xmlDoc = getXMLDoc(url, qstr);
                    } catch (e) {
                    }

                    try {
                        rsCnt = xmlDoc.getElementsByTagName("rsCnt")[0].firstChild.nodeValue;
                    } catch (e) {
                    }

                    if (rsCnt > 0) {
                        if (isPopUp == 1) {
                            if (chngOpt == 1) {
                                prv_html = "<a style=\"text-decoration:none;\" class=\"private\" href=\"javascript:changeLMRNotes('0', '" + divId + "', '" + processorCommentsNo + "', '" + LMRId + "', '1');\" title=\"Click to make it Public\">Private</a>";
                            } else {
                                prv_html = "<a style=\"text-decoration:none;\" class=\"public\" href=\"javascript:changeLMRNotes('1', '" + divId + "', '" + processorCommentsNo + "', '" + LMRId + "', '1');\" title=\"Click to make it Private\">Public</a>";
                            }

                            $('#' + divId).html(prv_html);
                        } else {
                            getFileNotes(LMRId, 'file');
                            if (!hideSysNotesVal) {
                                setTimeout("hideSystemNotes('1', " + hideSysNotesVal + ")", "200");
                            }
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


    //$('.with-tip, .with-children-tip > *').tip();
}

/**
 Description     : Client/Borrower List Default Client Background and Entity Value population.
 Authors         : Viji, Venkatesh, Suresh.
 Developer       : Suresh.
 Date            : August 10, 2017.
 Included        : populateClientBackgroundEntityInfo(), showPCClientEntityInfoForFile().
 PT Task Number  : #140405963.
 **/

function date_diff_indays(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
}

function populateClientBackgroundEntityInfo(formName, email, PCID) {
    var phoneNo = '',
        phoneNo1 = '',
        phoneNo2 = '',
        phoneNo3 = '',
        $cellNo = '',
        cellNo1 = '';
    var cellNo2 = '',
        cellNo3 = '',
        phoneNoExt = '';
    //var confirmMsg = confirm("Some Information from previous file(s), for this borrower, has been imported for your convenience.");
    $.ajax({
        type: 'POST',
        url: 'getClientBackgroundEntityInfo.php',
        data: jQuery.param({'email': email, 'PCID': PCID}),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (myData) {
            var obj = $.parseJSON(myData);

            if (jQuery.isEmptyObject(obj)) {
                return true;
            } else {
                if (confirm("Would you like to import basic information for this borrower?")) {

                    phoneNo = obj.clientPhone;
                    cellNo = obj.clientCell;
                    try {
                        if (phoneNo != '' && phoneNo != null) {
                            phoneNo1 = phoneNo.substr(0, 3);
                            phoneNo2 = phoneNo.substr(3, 3);
                            phoneNo3 = phoneNo.substr(6, 4);
                            phoneNoExt = phoneNo.substr(10, 10);
                        }

                        if (cellNo != '' && cellNo != null) {
                            cellNo1 = cellNo.substr(0, 3);
                            cellNo2 = cellNo.substr(3, 3);
                            cellNo3 = cellNo.substr(6, 4);
                        }
                    } catch (e) {
                    }

                    /** Radio button Value assign for Background Info **/
                    checkRadioButton(obj.isBorUSCitizen, 'isBorUSCitizen', 'borOriginAndVisaTR');
                    checkRadioButton(obj.isBorDecalredBankruptPastYears, 'isBorDecalredBankruptPastYears', 'borDecalredBankruptTR');
                    checkRadioButton(obj.isAnyBorOutstandingJudgements, 'isAnyBorOutstandingJudgements', 'borOutstandingJudgementsTR');
                    checkRadioButton(obj.hasBorAnyActiveLawsuits, 'hasBorAnyActiveLawsuits', 'borActiveLawsuitsTR');
                    checkRadioButton(obj.hasBorPropertyTaxLiens, 'hasBorPropertyTaxLiens', 'borPropertyTaxLiensTR');
                    checkRadioButton(obj.hasBorObligatedInForeclosure, 'hasBorObligatedInForeclosure', 'borObligatedInForeclosureTR');
                    checkRadioButton(obj.isBorPresenltyDelinquent, 'isBorPresenltyDelinquent', 'borDelinquentTR');
                    checkRadioButton(obj.haveBorOtherFraudRelatedCrimes, 'haveBorOtherFraudRelatedCrimes', 'borOtherFraudRelatedCrimesTR');

                    /** Radio button Value assign for Experience Info **/
                    checkRadioButton(obj.haveBorREInvestmentExperience, 'haveBorREInvestmentExperience', 'borRealEstateInvestmentDiv');
                    checkRadioButton(obj.haveBorRehabConstructionExperience, 'haveBorRehabConstructionExperience', 'borRehabConstructionExperienceDiv');
                    checkRadioButton(obj.haveBorProjectCurrentlyInProgress, 'haveBorProjectCurrentlyInProgress', 'borProjectsCurrentlyProgressDiv');
                    checkRadioButton(obj.haveBorOwnInvestmentProperties, 'haveBorOwnInvestmentProperties', 'borOwnInvestmentPropertiesDiv');
                    checkRadioButton(obj.areBorMemberOfInvestmentClub, 'areBorMemberOfInvestmentClub', 'borMemberOfInvestmentClubDiv');

                    /** Input Field Value assign. Client Info **/
                    assignFieldValue(phoneNo1, 'phNo1');
                    assignFieldValue(phoneNo2, 'phNo2');
                    assignFieldValue(phoneNo3, 'phNo3');
                    assignFieldValue(phoneNoExt, 'ext');
                    assignFieldValue(cellNo1, 'cellNo1');
                    assignFieldValue(cellNo2, 'cellNo2');
                    assignFieldValue(cellNo3, 'cellNo3');
                    assignFieldValue(obj.clientFName, 'borrowerFName');
                    assignFieldValue(obj.clientFName, 'borrowerName');
                    assignFieldValue(obj.clientLName, 'borrowerLName');
                    assignFieldValue(obj.clientAddress, 'presentAddress');
                    assignFieldValue(obj.clientCity, 'presentCity');
                    assignFieldValue(obj.clientState, 'presentState');
                    assignFieldValue(obj.clientZip, 'presentZip');

                    /** Input Field Value assign. Background Info **/
                    assignFieldValue(obj.serviceProvider, 'serviceProvider');
                    assignFieldValue(obj.borDecalredBankruptExpln, 'borDecalredBankruptExpln');
                    assignFieldValue(obj.borActiveLawsuitsExpln, 'borActiveLawsuitsExpln');
                    assignFieldValue(obj.borOutstandingJudgementsExpln, 'borOutstandingJudgementsExpln');
                    assignFieldValue(obj.borOutstandingJudgementsExpln, 'borOutstandingJudgementsExpln');
                    assignFieldValue(obj.borPropertyTaxLiensExpln, 'borPropertyTaxLiensExpln');
                    assignFieldValue(obj.borObligatedInForeclosureExpln, 'borObligatedInForeclosureExpln');
                    assignFieldValue(obj.borDelinquentExpln, 'borDelinquentExpln');
                    assignFieldValue(obj.borOtherFraudRelatedCrimesExpln, 'borOtherFraudRelatedCrimesExpln');
                    assignFieldValue(obj.borBackgroundExplanation, 'borBackgroundExplanation');

                    /** Input Field Value assign. Experience Info **/
                    assignFieldValue(obj.borNoOfREPropertiesCompleted, 'borNoOfREPropertiesCompleted');
                    assignFieldValue(obj.borREAddress1, 'borREAddress1');
                    assignFieldValue(obj.borREAddress2, 'borREAddress2');
                    assignFieldValue(obj.borREAddress3, 'borREAddress3');
                    assignFieldValue(obj.borOutcomeRE1, 'borOutcomeRE1');
                    assignFieldValue(obj.borOutcomeRE2, 'borOutcomeRE2');
                    assignFieldValue(obj.borOutcomeRE3, 'borOutcomeRE3');
                    assignFieldValue(obj.borRCAddress1, 'borRCAddress1');
                    assignFieldValue(obj.borRCAddress2, 'borRCAddress2');
                    assignFieldValue(obj.borRCAddress3, 'borRCAddress3');
                    assignFieldValue(obj.borRCOutcome1, 'borRCOutcome1');
                    assignFieldValue(obj.borRCOutcome2, 'borRCOutcome2');
                    assignFieldValue(obj.borRCOutcome3, 'borRCOutcome3');
                    assignFieldValue(obj.borNoOfYearRehabExperience, 'borNoOfYearRehabExperience');
                    assignFieldValue(obj.borRehabPropCompleted, 'borRehabPropCompleted');
                    assignFieldValue(obj.borNoOfProjectCurrently, 'borNoOfProjectCurrently');
                    assignFieldValue(obj.borNoOfProjectCurrently, 'borNoOfProjectCurrently');
                    assignFieldValue(obj.borNoOfOwnProp, 'borNoOfOwnProp');
                    assignFieldValue(obj.borClubName, 'borClubName');

                    /** Input Field Value assign. **/

                    EntityOptions = {
                        serviceUrl: siteSSLUrl + 'JQFiles/getAutoCompletedClientEntityInfo.php?PCID=' + PCID + '&clientEmail=' + email,
                        minChars: 0,
                        onSelect: function (value, data) {
                            $('#entityName').val(value);
                            showPCClientEntityInfoForFile(data, PCID);
                        }
                    };
                    $('#entityName').autocomplete(EntityOptions).onValueChange(); // Passing value from matching email Entity Info End..
                } // Confirm Check End..
            } // Object Empty Check End..
        }
    });
}

function checkRadioButton(val, fieldID, className) {
    try {
        if (trim(val) == 'Yes') {
            $("#" + fieldID + "Yes").attr("checked", true);
            $("#" + fieldID + "No").attr("checked", false);
            $("#" + fieldID + "NA").attr("checked", false);
            if (className != '') {
                $('.' + className).show();
            }
        } else if (trim(val) == 'No') {
            $("#" + fieldID + "Yes").attr("checked", false);
            $("#" + fieldID + "No").attr("checked", true);
            $("#" + fieldID + "NA").attr("checked", false);
            if (className != '') {
                $('.' + className).hide();
            }
        } else if (trim(val) == 'NA') {
            $("#" + fieldID + "Yes").attr("checked", false);
            $("#" + fieldID + "No").attr("checked", false);
            $("#" + fieldID + "NA").attr("checked", true);
            if (className != '') {
                $('.' + className).hide();
            }
        } else {
            $("#" + fieldID + "Yes").attr("checked", false);
            $("#" + fieldID + "No").attr("checked", false);
            $("#" + fieldID + "NA").attr("checked", false);
            if (className != '') {
                $('.' + className).hide();
            }
        }
    } catch (e) {
    }
}

function isCheckMinMaxAmount(inVal, msg, formName, fldName, fieldTxt) {
    var min = 0,
        max = 0;

    try {
        min = eval("document." + formName + ".min" + fieldTxt + ".value");
    } catch (e) {
    }
    try {
        max = eval("document." + formName + ".max" + fieldTxt + ".value");
    } catch (e) {
    }

    var inVal = parseFloat(replaceCommaValues(inVal));
    if (min > 0 || max > 0) {
        if (inVal != '') {
            if (inVal < min) {
                //alert(msg+" must be greater than "+min);
                toastrNotification(msg + " must be greater than " + min, 'error');
                eval("document." + formName + "." + fldName + ".value = 0");
                $('#' + fldName).focus();
                return false;
            } else if (inVal > max) {
                //alert(msg+" must be smaller than "+max);
                toastrNotification(msg + " must be smaller than " + max, 'error');
                eval("document." + formName + "." + fldName + ".value = 0");
                $('#' + fldName).focus();
                return false;
            } else {
                return true;
            }
        }
    }
}

function assignFieldValue(val, fieldId) {
    try {
        if (val != '' && val != null) {
            $("#" + fieldId).val(val);
        } else {
            $("#" + fieldId).val('');
        }
    } catch (e) {
    }
}

function assignAmountValue(val, fieldId) {
    val = convertInputToAbsoluteValue(val);
    try {
        if (val != '') {
            $("#" + fieldId).val(val);
        } else {
            $("#" + fieldId).val('');
        }
    } catch (e) {
    }
}

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function showPCClientEntityInfoForFile(CBEID, PCID) {
    var entityName = '',
        entityType = '',
        ENINo = '',
        entityAddress = '',
        entityCity = '',
        entityState = '',
        entityZip = '',
        entityStateOfFormation = '';
    var tempMemberName = '',
        tempMemberOwnership = '',
        tempMemberTitle = '',
        entityBillAddress = '',
        entityBillCity = '',
        entityBillState = '',
        entityBillZip = '';
    var i = 1;
    var datearray = datearray1 = datearray2 = new Array();
    $.ajax({
        type: 'GET',
        url: siteSSLUrl + 'JQFiles/getAutoCompletedClientEntityInfo.php',
        data: jQuery.param({'CBEID': CBEID, 'PCID': PCID}),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (myData) {
            var obj = $.parseJSON(myData);
            var members = obj.members;
            var billingInfo = obj.billingInfo;

            if (jQuery.isEmptyObject(obj)) {
                return true;
            } else {

                assignFieldValue(obj.CBEID, 'CBEID');
                assignFieldValue(obj.entityName, 'entityName');
                assignFieldValue(obj.entityType, 'entityType');
                assignFieldValue(obj.ENINo, 'ENINo');
                assignFieldValue(obj.entityAddress, 'entityAddress');
                assignFieldValue(obj.entityCity, 'entityCity');
                assignFieldValue(obj.entityState, 'entityState');
                assignFieldValue(obj.entityZip, 'entityZip');
                assignFieldValue(obj.entityStateOfFormation, 'entityStateOfFormation');
                assignFieldValue(obj.entityNotes, 'entityNotes');
                assignFieldValue(obj.entityWebsite, 'entityWebsite');
                assignFieldValue(obj.organizationalRef, 'organizationalRef');
                assignFieldValue(obj.tradeName, 'tradeName');
                assignFieldValue(obj.businessCategory, 'businessCategory');
                assignFieldValue(obj.productTypeOrServiceSold, 'productTypeOrServiceSold');
                assignFieldValue(obj.terminalOrMakeModel, 'terminalOrMakeModel');
                assignFieldValue(obj.entityPropertyOwnerShip, 'entityPropertyOwnerShip');
                //assignFieldValue(obj.startDateAtLocation,'startDateAtLocation');
                assignFieldValue(obj.landlordMortagageContactName, 'landlordMortagageContactName');
                assignFieldValue(obj.landlordMortagagePhone, 'landlordMortagagePhone');
                assignFieldValue(obj.rentMortagagePayment, 'rentMortagagePayment');
                assignFieldValue(obj.avgMonthlyCreditcardSale, 'avgMonthlyCreditcardSale');
                assignFieldValue(obj.avgTotalMonthlySale, 'avgTotalMonthlySale');
                assignFieldValue(obj.annualGrossSales, 'annualGrossSales');
                assignFieldValue(obj.annualGrossProfit, 'annualGrossProfit');
                assignFieldValue(obj.ordinaryBusinessIncome, 'ordinaryBusinessIncome');
                assignFieldValue(obj.crossCorporateGuarantor, 'crossCorporateGuarantor');
                assignFieldValue(obj.noOfEmployees, 'noOfEmployees');
                assignFieldValue(obj.grossAnnualRevenues, 'grossAnnualRevenues');
                assignFieldValue(obj.businessDescription, 'businessDescription');
                assignFieldValue(obj.businessPhone, 'businessPhone');
                assignFieldValue(obj.noOfEmployeesAfterLoan, 'noOfEmployeesAfterLoan');
                assignFieldValue(obj.naicsCode, 'naicsCode');
                assignFieldValue(obj.grossIncomeLastYear, 'grossIncomeLastYear');
                assignFieldValue(obj.netIncomeLastYear, 'netIncomeLastYear');
                assignFieldValue(obj.grossIncome2YearsAgo, 'grossIncome2YearsAgo');
                assignFieldValue(obj.netIncome2YearsAgo, 'netIncome2YearsAgo');
                assignFieldValue(obj.averageBankBalance, 'averageBankBalance');
                assignFieldValue(obj.merchantProcessingBankName, 'merchantProcessingBankName');
                assignFieldValue(obj.benCardProcessorBank, 'benCardProcessorBank');
                assignFieldValue(obj.benEmployeesPaid, 'benEmployeesPaid');
                assignFieldValue(obj.benHowManyLocation, 'benHowManyLocation');
                assignFieldValue(obj.benOtherLocation, 'benOtherLocation');
                assignFieldValue(obj.benNameOfFranchise, 'benNameOfFranchise');
                assignFieldValue(obj.benPointOfContact, 'benPointOfContact');
                assignFieldValue(obj.benPointOfContactPhone, 'benPointOfContactPhone');
                assignFieldValue(obj.benPointOfContactEmail, 'benPointOfContactEmail');
                assignFieldValue(obj.benWebsiteForFranchise, 'benWebsiteForFranchise');
                assignFieldValue(obj.isBusinessSeasonalPeakMonth, 'isBusinessSeasonalPeakMonth');
                if (!jQuery.isEmptyObject(billingInfo)) {
                    assignFieldValue(billingInfo[0].entityBillAddress, 'entityBillAddress');
                    assignFieldValue(billingInfo[0].entityBillCity, 'entityBillCity');
                    assignFieldValue(billingInfo[0].entityBillState, 'entityBillState');
                    assignFieldValue(billingInfo[0].entityBillZip, 'entityBillZip');
                }
                var dob = obj.dateOfFormation;
                if (dob != "" && dob != null) {
                    datearray = dob.split("-");
                    var newdate = datearray[1] + '/' + datearray[2] + '/' + datearray[0];
                } else {
                    var newdate = "";
                }
                assignFieldValue(newdate, 'dateOfFormation');

                var sda = obj.startDateAtLocation;
                if (sda != "" && sda != null) {
                    datearray2 = sda.split("-");
                    var newdate2 = datearray2[1] + '/' + datearray2[2] + '/' + datearray2[0];
                } else {
                    var newdate2 = "";
                }
                assignFieldValue(newdate2, 'startDateAtLocation');

                var doa = obj.dateOfOperatingAgreement;
                if (doa != "" && doa != null) {
                    datearray1 = doa.split("-");
                    var newdate1 = datearray1[1] + '/' + datearray1[2] + '/' + datearray1[0];
                } else {
                    var newdate1 = "";
                }
                assignFieldValue(newdate, 'dateOfOperatingAgreement');

                //checkboxes buttons
                var entityService = obj.entityService;
                if (entityService == 'Service') {
                    $("input[value='" + entityService + "']").prop('checked', true);
                }

                var entityProduct = obj.entityProduct;
                if (entityProduct == 'Product') {
                    $("input[value='" + entityProduct + "']").prop('checked', true);
                }

                var entityB2B = obj.entityB2B;
                if (entityB2B == 'B2B') {
                    $("input[value='" + entityB2B + "']").prop('checked', true);
                }
                var entityB2C = obj.entityB2C;
                if (entityB2C == 'B2C') {
                    $("input[value='" + entityB2C + "']").prop('checked', true);

                }

                //radio buttons
                var entityLocation = obj.entityLocation;
                $("input[name=entityLocation][value=" + entityLocation + "]").attr('checked', 'checked');
                var benBusinessHomeBased = obj.benBusinessHomeBased;
                $('#benBusinessHomeBased' + benBusinessHomeBased).attr('checked', true);
                var benCreditCardPayments = obj.benCreditCardPayments;
                $('#benCreditCardPayments' + benCreditCardPayments).attr('checked', true);
                showHideCreditCardFields(benCreditCardPayments);
                var benChargeSalesTax = obj.benChargeSalesTax;
                $("input[name=benChargeSalesTax][value=" + benChargeSalesTax + "]").attr('checked', 'checked');
                var benBusinessLocation = obj.benBusinessLocation;
                $('#benBusinessLocation' + benBusinessLocation).attr('checked', true);
                showHideBusinessLocation(benBusinessLocation);
                var benBusinessFranchise = obj.benBusinessFranchise;
                $('#benBusinessFranchise' + benBusinessFranchise).attr('checked', true);
                showHideBusinessFranchise(benBusinessFranchise);
                var isBusinessSeasonal = obj.isBusinessSeasonal;
                $('#isBusinessSeasonal' + isBusinessSeasonal).attr('checked', true);
                hideAndShowSection(isBusinessSeasonal, 'Yes', 'isBusinessSeasonalPeakMonth_disp');

                var publicUser = 0;
                if ($('#publicUser').length > 0) {
                    publicUser = $('#publicUser').val();
                }
                var ks = 1;
                if (members.length > 0) {
                    for (i = 0; i < members.length; i++) {
                        if (members[i]['memberName'] != '' || members[i]['memberOwnership'] != '0' || members[i]['memberTitle'] != '') {
                            $('.MembersOfficers' + ks + 'ID').show();
                            assignFieldValue(members[i]['memberName'], 'memberName' + ks);
                            assignFieldValue(members[i]['memberTitle'], 'memberTitle' + ks);
                            assignFieldValue(members[i]['memberOwnership'], 'memberOwnership' + ks);
                            assignFieldValue(members[i]['memberAddress'], 'memberAddress' + ks);
                            assignFieldValue(members[i]['memberPhone'], 'memberPhone' + ks);
                            assignFieldValue(members[i]['memberCell'], 'memberCell' + ks);
                            if (publicUser != 1) {
                                assignFieldValue(members[i]['memberSSN'], 'memberSSN' + ks);
                            }
                            assignFieldValue(members[i]['memberDriversLicense'], 'DriversLicense' + ks);
                            assignFieldValue(members[i]['memberDriversLicenseState'], 'DriversLicenseState' + ks);
                            assignFieldValue(members[i]['memberAnnualSalary'], 'memberAnnualSalary' + ks);
                            assignFieldValue(members[i]['memberCreditScore'], 'memberCreditScore' + ks);
                            assignFieldValue(members[i]['memberDriversLicenseState'], 'memberDriversLicenseState' + ks);
                            assignFieldValue(members[i]['memberDriversLicense'], 'memberDriversLicense' + ks);
                            var mdob = members[i]['memberDOB'];
                            if (mdob != "") {
                                datearray2 = mdob.split("-");
                                var newdate2 = datearray2[1] + '/' + datearray2[2] + '/' + datearray2[0];
                            } else {
                                var newdate2 = "";
                            }
                            if (publicUser != 1) {
                                assignFieldValue(newdate, 'memberDOB' + ks);
                            }
                            assignFieldValue(members[i]['memberEmail'], 'memberEmail' + ks);
                        } else {
                            $('.MembersOfficers' + ks + 'ID').hide();
                        }
                        ks++;
                    }
                } else {
                    hideselectedsection('MembersOfficers', '1'); //Hide this member section and clear the member values
                }

                $(".mask_phone").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
                $(".mask_cell").inputmask("mask", {mask: "999 - 999 - 9999"});
                $(".mask_ssn").inputmask("999 - 99 - 9999", {placeholder: "___ - __ - ____", clearMaskOnLostFocus: !0});
            } // Object empty check..
        }
    });

}

function removeClientEntityInfo() {
    clear_form_elements('borrowerEntityDetails');
    $("input[name='btnSave']").attr("disabled", false); /* enable the save button : card309 */
    $('.memOff').hide(); /* Hide all the Members/Officers div */
    $('#CBEID').val('');
}

function date_diff_indays(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
}

function emptyFieldChk(val) {
    if (val == '' || val == null || val == 'undefined') {
        val = '';
    }
    return val;
}

/**

 ** Description    : get the Appraiser Info section in contact Details
 ** Developer    : Venky
 ** Author        : AwataSoftsys
 ** Date            : Oct 23, 2017

 **/
function showAppraiserContactsForFile(CID, PCID, opt) {
    var contactList = new Array();
    var companyName = '',
        phone1 = '',
        phone2 = '',
        phone3 = '',
        ext = '',
        cell1 = '',
        cell2 = '',
        cell3 = '',
        fax1 = '',
        fax2 = '',
        fax3 = '',
        email = '',
        email = '',
        address = '',
        city = '',
        state = '',
        zip = '',
        contactLName = '',
        contactName = '';
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }

    if (contactList.length > 0) {
        allowToEditFileContacts('appraiser' + opt + 'ContactCls', 'appraiser' + opt + 'PrimContactCls', 'Edit'); // Allow to Edit file contacts..
    }

    for (var i = 0; i < contactList.length; i++) {
        try {
            companyName = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone = contactList[i].getElementsByTagName("phone")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            email = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            contactName = contactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            contactLName = contactList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('appraiser' + opt + 'Company').value = companyName;
        } catch (e) {
        }
        try {
            document.getElementById('appraiser' + opt + 'Phone').value = phone;
        } catch (e) {
        }
        try {
            document.getElementById('appraiser' + opt + 'Email').value = email;
        } catch (e) {
        }
        try {
            document.getElementById('appraiser' + opt + 'AppraiserName').value = contactName;
        } catch (e) {
        }
        try {
            document.getElementById('appraiser' + opt + 'LName').value = contactLName;
        } catch (e) {
        }

        $(".appraiser" + opt + "PhoneNumberAutoPopulate").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
    }

}

function showRealtorBPOContactsForFile(CID, PCID, opt) {
    var contactList = new Array();
    var contactName = '';
    var companyName = '',
        phone1 = '',
        phone2 = '',
        phone3 = '',
        ext = '',
        cell1 = '',
        cell2 = '',
        cell3 = '',
        fax1 = '',
        fax2 = '',
        fax3 = '',
        email = '',
        email = '',
        address = '',
        city = '',
        state = '',
        zip = '',
        contactLName = '';
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }

    if (contactList.length > 0) {
        allowToEditFileContacts('realtor' + opt + 'ContactCls', 'realtor' + opt + 'PrimContactCls', 'Edit'); // Allow to Edit file contacts..
    }

    for (var i = 0; i < contactList.length; i++) {
        try {
            contactName = contactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            companyName = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            phone = contactList[i].getElementsByTagName("phone")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            email = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            contactLName = contactList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('BPO' + opt + 'RealtorName').value = contactName;
        } catch (e) {
        }
        try {
            document.getElementById('realtor' + opt + 'Company').value = companyName;
        } catch (e) {
        }
        try {
            document.getElementById('realtor' + opt + 'Phone').value = phone;
        } catch (e) {
        }
        try {
            document.getElementById('realtor' + opt + 'Email').value = email;
        } catch (e) {
        }
        try {
            document.getElementById('BPO' + opt + 'LName').value = contactLName;
        } catch (e) {
        }
        $(".realtor" + opt + "PhoneNumberAutoPopulate").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
    }
}

function showAndHide4506TYearRequested(divId, noOfDiv) {
    for (var i = 1; i <= noOfDiv; i++) {
        if ($("#" + divId + i + "_Div").is(':hidden')) {
            $("#" + divId + i + "_Id").show();
            $("#" + divId + i + "_Div").show();
            break;
        }
    }
    if (i > noOfDiv) {
        //alert('Maximum amount reached');
        toastrNotification('Maximum amount reached', 'error');
    }
}

function showServiceLenderForFile(CID, PCID, opt) {
    var contactList = new Array();
    var contactName = '',
        address = '',
        city = '',
        state = '',
        zip = '';
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }

    if (contactList.length > 0) allowToEditFileContacts('SLContacts', 'serviceLenderPrClass', 'Edit'); // Allow to Edit file contacts..

    for (var i = 0; i < contactList.length; i++) {
        try {
            contactName = contactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            address = contactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            city = contactList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            state = contactList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            zip = contactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('lenderLName').value = contactList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('lenderFirmName').value = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('lenderEmail').value = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('lenderPhone').value = contactList[i].getElementsByTagName("phone")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('lendertollFree').value = contactList[i].getElementsByTagName("tollFree")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('stateOfFormation').value = contactList[i].getElementsByTagName("stateOfFormation")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('entityType').value = contactList[i].getElementsByTagName("entityType")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('serviceLenderEIN').value = contactList[i].getElementsByTagName("einNo")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('serviceLenderRepTitle').value = contactList[i].getElementsByTagName("repTitle")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('lenderLastName').value = contactList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('serviceLenderName').value = contactName;
        } catch (e) {
        }
        try {
            document.getElementById('serviceLenderAddress').value = address;
        } catch (e) {
        }
        try {
            document.getElementById('serviceLenderCity').value = city;
        } catch (e) {
        }
        try {
            document.getElementById('serviceLenderState').value = state;
        } catch (e) {
        }
        try {
            document.getElementById('serviceLenderZip').value = zip;
        } catch (e) {
        }
        try {
            document.getElementById('lenderFax1').value = fax1;
        } catch (e) {
        }
        try {
            document.getElementById('lenderFax2').value = fax2;
        } catch (e) {
        }
        try {
            document.getElementById('lenderFax3').value = fax3;
        } catch (e) {
        }
        try {
            document.getElementById('lenderCellNo1').value = cell1;
        } catch (e) {
        }
        try {
            document.getElementById('lenderCellNo2').value = cell2;
        } catch (e) {
        }
        try {
            document.getElementById('lenderCellNo3').value = cell3;
        } catch (e) {
        }
        try {
            document.getElementById('lenderFax').value = contactList[i].getElementsByTagName("faxNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('lenderCellNo').value = contactList[i].getElementsByTagName("cellNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
    }
    $(".lenderPhoneNumberAutoPopulate").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
}

function allowToEditFileContacts(className, primClsName, allowOpt) {

    if (allowOpt == 'Clear') {
        jQuery("." + className).each(function () {
            jQuery(this).val('');

            // if(this.type == 'select-one') {
            //     jQuery(this).attr('disabled', true);
            // } else {
            //     //$(this).css("background-color", "#D5D5D5");
            // }
        });

        jQuery("." + primClsName).each(function () {
            jQuery(this).val('');
        });
        //jQuery('.'+className).attr('readonly', true);
        try {
            enableSaveButton(); // | Enable Save Button on Any Auto complete.
        } catch (e) {
        }
    } else {
        var k = 0;
        jQuery("." + primClsName).each(function () {
            var primVal = jQuery(this).val();
            if (primVal != '') k++;
        });

        if (k > 0) {
            jQuery("." + className).each(function () {
                if (this.type == 'select-one') {
                    jQuery(this).attr('disabled', false);
                } else {
                    if ($(this).hasClass("mandatory")) {
                    } else {
                        $(this).css("background-color", "white");
                    }
                    jQuery(this).attr('readonly', false);
                }
            });
        } else {
            jQuery("." + className).each(function () {
                jQuery(this).val('');
                // if(this.type == 'select-one') {
                //     jQuery(this).attr('disabled', true);
                // } else {
                //     //$(this).css("background-color", "#D5D5D5");
                // }
            });
            jQuery("." + primClsName).each(function () {
                jQuery(this).val('');
            });
            //jQuery('.'+className).attr('readonly', true);
        }
    }
}

function populateDualFieldForLP(val, targetFld) {
    try {
        $("#" + targetFld).val(val).trigger("chosen:updated")
    } catch (e) {
    }
}

function populateDualField(fldVal, targetFld) {
    $("#" + targetFld).val(fldVal);
}


if (typeof checkLMRBrokerEmailExist != 'function') {

    window.checkLMRBrokerEmailExist = function () {
        var brokerDetails = new Array();
        var brokerNumber = 0,
            executiveId = 0;
        var brokerFirstName = "",
            brokerCompany = "",
            brokerLastName = "",
            phoneNumber = "";
        var brokerEmail = "",
            ph1 = "",
            ph2 = "",
            ph3 = "",
            ph4 = "",
            status = "";
        var cellNumber = "",
            cellNo1 = "",
            cellNo2 = "",
            cellNo3 = "",
            fax = "";
        var fax1 = "",
            fax2 = "",
            fax3 = "",
            bAddr = "",
            bCity = "",
            bState = "",
            bZipCode = "";
        var alertBrMsg = "",
            brCnt = 0,
            encBrokerNumber = 0,
            PCID = 0,
            agentPCID = 0;

        eval("brokerEmail = document.loanModBrokerForm.brokerEmail.value");
        try {
            executiveId = document.loanModBrokerForm.executiveId.value;
            PCID = document.loanModBrokerForm.PCID.value;
        } catch (e) {
        }
        try {
            brokerEmail = trim(brokerEmail);
        } catch (e) {
        }
        var url = siteSSLUrl + "backoffice/getAgentInfo.php";
        var qstr = "email=" + brokerEmail + "&eId=" + executiveId + "&PCID=" + PCID;
        //alert(url+"?"+qstr);
        var xmlDoc = "";
        if (brokerEmail != "") {
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
                    brokerNumber = brokerDetails[i].getElementsByTagName("brokerNumber")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    encBrokerNumber = brokerDetails[i].getElementsByTagName("encBrokerNumber")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    brokerFirstName = brokerDetails[i].getElementsByTagName("brokerName")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    brokerCompany = brokerDetails[i].getElementsByTagName("brokerCompany")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    brokerLastName = brokerDetails[i].getElementsByTagName("brokerLName")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    brokerEmail = brokerDetails[i].getElementsByTagName("brokerEmail")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    phoneNumber = brokerDetails[i].getElementsByTagName("bphoneNumber")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    cellNumber = brokerDetails[i].getElementsByTagName("bcellNumber")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    fax = brokerDetails[i].getElementsByTagName("bfax")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    bAddr = brokerDetails[i].getElementsByTagName("bAddr")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    bCity = brokerDetails[i].getElementsByTagName("bCity")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    bState = brokerDetails[i].getElementsByTagName("bState")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    bZipCode = brokerDetails[i].getElementsByTagName("bZipCode")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    alertBrMsg = brokerDetails[i].getElementsByTagName("alertBrMsg")[0].childNodes[0].nodeValue;
                } catch (e) {
                }
                try {
                    brCnt = brokerDetails[i].getElementsByTagName("brCnt")[0].childNodes[0].nodeValue;
                } catch (e) {
                }

                var ph1 = phoneNumber.substring(0, 3);
                var ph2 = phoneNumber.substring(3, 6);
                var ph3 = phoneNumber.substring(6, 10);
                var ph4 = phoneNumber.substring(10, 15);
                var cellNo1 = cellNumber.substring(0, 3);
                var cellNo2 = cellNumber.substring(3, 6);
                var cellNo3 = cellNumber.substring(6, 10);
                var fax1 = fax.substring(0, 3);
                var fax2 = fax.substring(3, 6);
                var fax3 = fax.substring(6, 10);
                try {
                    parent.document.loanModUserForm.LMRBroker.value = encBrokerNumber;
                } catch (e) {
                }
                try {
                    parent.document.loanModDataForm.agentId.value = encBrokerNumber;
                } catch (e) {
                }
                try {
                    parent.document.loanModForm.agentId.value = encBrokerNumber;
                } catch (e) {
                }

                document.loanModBrokerForm.bn.value = brokerNumber;
                document.loanModBrokerForm.brCnt.value = brCnt;
                document.loanModBrokerForm.brokerCompany.value = brokerCompany;
                document.loanModBrokerForm.brokerFirstName.value = brokerFirstName;
                document.loanModBrokerForm.brokerLastName.value = brokerLastName;
                document.loanModBrokerForm.brokerEmail.value = brokerEmail;
                document.loanModBrokerForm.bPhNo1.value = ph1;
                document.loanModBrokerForm.bPhNo2.value = ph2;
                document.loanModBrokerForm.bPhNo3.value = ph3;
                document.loanModBrokerForm.bExt.value = ph4;
                document.loanModBrokerForm.bCellNo1.value = cellNo1;
                document.loanModBrokerForm.bCellNo2.value = cellNo2;
                document.loanModBrokerForm.bCellNo3.value = cellNo3;
                document.loanModBrokerForm.bFax1.value = fax1;
                document.loanModBrokerForm.bFax2.value = fax2;
                document.loanModBrokerForm.bFax3.value = fax3;

                document.loanModBrokerForm.bAddr.value = bAddr;
                document.loanModBrokerForm.bCity.value = bCity;
                document.loanModBrokerForm.bState.value = bState;
                document.loanModBrokerForm.bZipCode.value = bZipCode;

            }
        }
        if (PCID > 0 && agentPCID > 0 && PCID != agentPCID) {
            document.loanModBrokerForm.brokerEmail.value = '';
            document.loanModBrokerForm.brokerEmail.focus();
            document.getElementById('brokerEmail').className = "highlights";
            // alert('This agent email cannot be used, it is already in use in the system.');
            toastrNotification('This agent email cannot be used, it is already in use in the system.', 'warning');
        }
        if (brokerEmail != "") {
            if (alertBrMsg != '') {
                // alert('Agent is already the list. Please select another one.');
                toastrNotification('Agent is already the list. Please select another one.', 'error');
                disableAllFormFields();
                ContactPop.hideOverlay(); /** Close- Popup **/
            } else {
                enableAllFormFields();
                document.loanModBrokerForm.brokerFirstName.focus();
            }
        }
    }
}

function enableAllFormFields() {
    try {
        document.HMLOWebForm.REBrokerEmail.disabled = false;
    } catch (e) {
    }
    try {
        document.HMLOWebForm.REBrokerCompName.disabled = false;
    } catch (e) {
    }

    try {
        document.HMLOWebForm.REBrokerFName.disabled = false;
    } catch (e) {
    }
    try {
        document.HMLOWebForm.REBrokerLName.disabled = false;
    } catch (e) {
    }
    try {
        document.HMLOWebForm.REBrokerPhnNo1.disabled = false;
    } catch (e) {
    }
    try {
        document.HMLOWebForm.REBrokerPhnNo2.disabled = false;
    } catch (e) {
    }
    try {
        document.HMLOWebForm.REBrokerPhnNo3.disabled = false;
    } catch (e) {
    }
    try {
        document.HMLOWebForm.REBrokerPhnNoExt.disabled = false;
    } catch (e) {
    }

}


function disableAllFormFields() {

    var brokerEmail = "";
    try {
        brokerEmail = document.HMLOWebForm.REBrokerEmail.value;
    } catch (e) {
    }
    brokerEmail = trim(brokerEmail);
    if (brokerEmail == "") {
    } else {
        try {
            document.HMLOWebForm.brokerEmail.disabled = true;
        } catch (e) {
        }
        try {
            document.getElementById("btnSave").style.display = "none";
        } catch (e) {
        }
    }
    try {
        document.HMLOWebForm.REBrokerCompName.disabled = true;
    } catch (e) {
    }

    try {
        document.HMLOWebForm.REBrokerFName.disabled = true;
    } catch (e) {
    }
    try {
        document.HMLOWebForm.REBrokerLName.disabled = true;
    } catch (e) {
    }
    try {
        document.HMLOWebForm.REBrokerPhnNo1.disabled = true;
    } catch (e) {
    }
    try {
        document.HMLOWebForm.REBrokerPhnNo2.disabled = true;
    } catch (e) {
    }
    try {
        document.HMLOWebForm.REBrokerPhnNo3.disabled = true;
    } catch (e) {
    }
    try {
        document.HMLOWebForm.REBrokerPhnNoExt.disabled = true;
    } catch (e) {
    }

    enableTabs(true);

}

function enableTabs(enableOpt) {
    try {
        document.getElementById('overlayout').className = "";
    } catch (e) {
    }
}

function sendLoanAppEmail(LMRId, opt, emailMessage) {
    var SB = '';
    var SC = '';
    var SA = '';
    var url = "../backoffice/sendHMLOLoanAppEmail.php";
    try {
        if ($('#sendToBorr').is(":checked")) {
            SB = $('#sendToBorr').val();
        }
    } catch (e) {
    }
    try {
        if ($('#sendToCoBorr').is(":checked")) {
            SC = $('#sendToCoBorr').val();
        }
    } catch (e) {
    }
    try {
        if ($('#sendToAgt').is(":checked")) {
            SA = $('#sendToAgt').val();
        }
    } catch (e) {
    }

    var qstr = "LMRId=" + LMRId + "&SB=" + SB + "&SC=" + SC + "&SA=" + SA + "&eMsg=" + emailMessage;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    var andTxt = '';
    var msg = '';
    if (SB == 'BO') {
        msg += andTxt + 'Borrower';
        andTxt = ", ";
    }
    if (SC == 'CBO') {
        msg += andTxt + 'Co-Borrower';
        andTxt = ", ";
    }
    if (SA == 'AG') {
        msg += andTxt + 'Loan Officer/Mortgage Broker';
    }

    toastrNotification('Email sent to the ' + msg, 'success');
}

/**

 ** Description : Get GC Details in Property Info section
 ** Developer    : Viji
 ** Author       : AwataSoftsys
 ** Date         : Feb 01, 2018

 **/

function showGCContactsForFile(CID, PCID) {
    var GCContactList = new Array();
    var url = siteUrl + "JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        GCContactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    if (GCContactList.length > 0) {
        allowToEditFileContacts('GCContactCls', 'GCPrimContactCls', 'Edit'); // Allow to Edit file contacts..
    }

    for (var i = 0; i < GCContactList.length; i++) {
        try {
            document.getElementById('GCFirstName').value = GCContactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('GCLastName').value = GCContactList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('GCEmail').value = GCContactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('GCPhone').value = GCContactList[i].getElementsByTagName("phone")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('GCCompanyName').value = GCContactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            document.getElementById('GCLicense').value = GCContactList[i].getElementsByTagName("licenseNo")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
    }
}

function showEscrowContactsForFile(CID, PCID, idVal = '') {
    var escrowContactList = new Array();
    var url = siteUrl + "JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        escrowContactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }
    if (escrowContactList.length > 0) {
        allowToEditFileContacts('escrowContactCls' + idVal, 'escrowPrimContactCls' + idVal, 'Edit'); // Allow to Edit file contacts..
    }
    for (var i = 0; i < escrowContactList.length; i++) {
        try {
            document.getElementById('escrowOfficer_' + idVal).value = escrowContactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('escrowOfficerLName_' + idVal).value = escrowContactList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('escrowOfficerFirmName_' + idVal).value = escrowContactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('escrowOfficerEmail_' + idVal).value = escrowContactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('escrowOfficerPhone_' + idVal).value = escrowContactList[i].getElementsByTagName("phoneNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('escrowOfficertollFree_' + idVal).value = escrowContactList[i].getElementsByTagName("tollFree")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('escrowOfficerCell_' + idVal).value = escrowContactList[i].getElementsByTagName("cellNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('escrowOfficerFax_' + idVal).value = escrowContactList[i].getElementsByTagName("faxNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('escrowNo_' + idVal).value = escrowContactList[i].getElementsByTagName("barNo")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('escrowAddress_' + idVal).value = escrowContactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('escrowCity_' + idVal).value = escrowContactList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('escrowState_' + idVal).value = escrowContactList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('escrowZip_' + idVal).value = escrowContactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
    }

    $(".escrowPhoneNumberAutoPopulate").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
    $(".titleCellNumberAutoPopulate").inputmask("mask", {mask: "999 - 999 - 9999"});
}

function entToggleSwitch(divName, fldName, showHDiv) {
    var onOffOpt = $('#' + fldName).val();
    if (onOffOpt == 1) {
        $('#' + fldName).val(0);
        clear_form_elements(showHDiv);
        document.getElementById(divName).className = "switch-off";
    } else {
        $('#' + fldName).val(1);
        try {
            document.loanModForm.entityBillAddress.value = document.loanModForm.entityAddress.value;
        } catch (e) {
        }
        try {
            document.loanModForm.entityBillCity.value = document.loanModForm.entityCity.value;
        } catch (e) {
        }
        try {
            document.loanModForm.entityBillState.value = document.loanModForm.entityState.value;
        } catch (e) {
        }
        try {
            document.loanModForm.entityBillZip.value = document.loanModForm.entityZip.value;
        } catch (e) {
        }
        document.getElementById(divName).className = "switch-on";
    }
}

function addNewDocs(tabIndex, mainSec, innerSec) {
    $('.with-children-tip > *').hideTip();
    var ks = 0;
    var cnt = $('.' + innerSec).length;
    var mSec = $('.' + mainSec);
    var rowId = "proInsSec_" + cnt;

    jQuery('.' + innerSec).each(function (i) {
        var docID = '';
        var uploadedBy = '';
        var LMRId = '';
        var tArray = [];
        var delTxt = $('#delTxt_' + i).val();
        if (delTxt != '') {
            tArray = delTxt.split('-');
            docID = tArray[0];
            uploadedBy = tArray[1];
            LMRId = tArray[2];
        }
        $(this).find('.actionIcons').html("<i class=\"fa fa-minus-circle fa-2x icon-red cursor pad5\" onclick=\"deleteFileUploadedDoc('" + docID + "', '" + uploadedBy + "', '" + LMRId + "', this)\" title=\"Click to remove this row.\"></i>");

        if ($('.' + innerSec).length == ks) {
            $(this).find('.actionIcons').html("<i class=\"fa fa-plus-circle fa-2x icon-green cursor pad5\" onclick=\"addNewDocs('" + tabIndex + "', 'proInsCoverageMain', 'proInsCoverage')\" title=\"Click to add new row.\">&nbsp;</i>");
        }
        ks++;
    });

    $(mSec).append("<div class=\"clear\"></div><div class=\"proInsCoverage\" id=\"" + rowId + "\"><span class=\"left\"><input type=\"file\" name=\"propertyInsuranceCoverage" + cnt + "\" id=\"propertyInsuranceCoverage" + cnt + "\" TABINDEX=\"" + tabIndex + "\" class=\"fileBoxSize odd\"></span><input type=\"hidden\" name=\"delTxt_" + cnt + "\" class=\"delTxt\" id=\"delTxt_" + cnt + "\" value=\"\"><span class=\"actionIcons with-children-tip left\"><i class=\"fa fa-plus-circle fa-2x icon-green cursor pad5\" onclick=\"addNewDocs('" + tabIndex + "', 'proInsCoverageMain', 'proInsCoverage')\" title=\"Click to add new row.\">&nbsp;</i></span>&nbsp;</div>");

    jQuery('.delTxt').each(function (i) {
        $(this).attr("id", "delTxt_" + i);
        $(this).attr("name", "delTxt_" + i);
    });
    $('.with-tip, .with-children-tip > *').tip();
    $('#proInsCnt').val(cnt); // Total row count.
}


function checkdisable_form_elements(class_name, status) {
    jQuery("." + class_name).find(':input').each(function () {
        switch (this.type) {
            case 'password':
            case 'text':
            case 'textarea':
            case 'file':
            case 'select-one':
            case 'select-multiple':
            case 'date':
            case 'number':
            case 'tel':
            case 'email':
            case 'checkbox':
            case 'radio':
                if (status == 0) {
                    jQuery(this).prop('disabled', true);
                } else {
                    jQuery(this).removeAttr("disabled");
                }
                break;
        }
    });
}


function addOrRemoveAdditionalGuarantors(tabIndex, mainSec, innerSec) {
    //$('.with-children-tip > *').hideTip();
    rowObj = $("#additionalGuarantors").clone();
    $("." + mainSec).append(rowObj);
    $(rowObj).removeClass('bg-light');
    //var idCnt = $('.'+innerSec).length;
    //$(rowObj).find('.fa-calendar').removeClass('guarantorDOB').addClass('guarantorDOB_'+idCnt);
    var idCnt = 0;
    var nCnt = 1;
    jQuery(rowObj).find(':input').each(function (i) {
        switch (this.type) {
            case 'password':
            case 'text':
            case 'textarea':
            case 'file':
            case 'select-one':
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

    jQuery('.additionalGuarantors').find(':input').each(function (i) {
        if (6 < i) {
            var idArr = [];
            $(this).attr('tabindex', tabIndex);
            var elmId = this.id;
            idArr = elmId.split('_');
            $(this).attr('id', idArr[0] + "_" + idCnt);
        }
        if (nCnt == 7) {
            idCnt++;
            nCnt = 0;
        }
        nCnt++;
    });

    var ks = 0;
    jQuery("." + innerSec).each(function (i) {

        if (i != 0) {
            $(this).attr('id', "additionalGuarantors_" + i);
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removeAdditionalGuarantors('additionalGuarantors_" + i + "', '" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass.\"><i class=\" icon-md fas fa-minus-circle\"></i></a>");
        } else {
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removeAdditionalGuarantors('additionalGuarantors','" + tabIndex + "')\"    class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" title=\"Click to remove this row.\"><i class=\" icon-md fas fa-minus-circle\"></i></a>");
        }
        if (($('.' + innerSec).length - 1) == ks) {
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\"    class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"addOrRemoveAdditionalGuarantors('" + tabIndex + "', 'additionalGuarantorsSection', 'additionalGuarantors')\" title=\"Click to add new row.\"><i class=\" icon-md fas fa-plus \"></i></a><a href=\"javascript:void(0)\"  class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeAdditionalGuarantors('additionalGuarantors_" + i + "','" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\" icon-md fas fa-minus-circle \"></i></a>");
        }
        ks++;
        if (i % 2 == 1) {
            //   $(this).addClass('even');
        } else {
            // $(this).removeClass('even');
        }
    });
    jQuery(".secCnt").each(function (i) {
        $(this).html((i + 1) + ")");

    });
    lastdivId = $('.additionalGuarantors:last').attr('id'); //get last clone div id
    jQuery('#' + lastdivId).find("input.dateInput")
        .removeClass('guaDob hasDatepicker')
        .removeData('datepicker')
        .unbind()
        .datepicker({
            changeMonth: true,
            autoclose: true,
            changeYear: true,
            dateFormat: 'mm/dd/yy',
            yearRange: '-94:' + (new Date).getFullYear()
        });
    // $(".mask_date").inputmask("mm/dd/yyyy", { autoUnmask: !0 });
    $(".mask_phone").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
    $(".mask_home_phone").inputmask("mask", {mask: "999 - 999 - 9999"});
    $(".mask_cell").inputmask("mask", {mask: "999 - 999 - 9999"});
    $(".mask_ssn").inputmask("999 - 99 - 9999", {placeholder: "___ - __ - ____", clearMaskOnLostFocus: !0});
    $("#agTCnt").val($('.additionalGuarantors').length);
    $('.zipCode').inputmask("99999");
}

function removeAdditionalGuarantors(rSec, tabIndex) {
    //$('.with-children-tip > *').hideTip();
    if (rSec == 'additionalGuarantors') {
        jQuery("#" + rSec).find(':input').each(function (i) {
            switch (this.type) {
                case 'password':
                case 'text':
                case 'textarea':
                case 'file':
                case 'select-one':
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
    } else {
        $('#' + rSec).remove();
        var idCnt = 0;
        var nCnt = 1;
        jQuery('.additionalGuarantors').find(':input').each(function (i) {
            if (6 < i) {
                var idArr = [];
                $(this).attr('tabindex', tabIndex);
                var elmId = this.id;
                idArr = elmId.split('_');
                $(this).attr('id', idArr[0] + "_" + idCnt);
            }
            if (nCnt == 7) {
                idCnt++;
                nCnt = 0;
            }
            nCnt++;
        });
    }

    var ks = 0;
    jQuery(".additionalGuarantors").each(function (i) {
        if (i != 0) {
            $(this).attr('id', "additionalGuarantors_" + i);
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"removeAdditionalGuarantors('additionalGuarantors_" + i + "', '" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\" icon-md fas fa-minus-circle \"></i></a>");
        } else {
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"removeAdditionalGuarantors('additionalGuarantors','" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\" icon-md fas fa-minus-circle \"></i></a>");
        }
        if (($('.additionalGuarantors').length - 1) == ks) {
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"addOrRemoveAdditionalGuarantors('" + tabIndex + "', 'additionalGuarantorsSection', 'additionalGuarantors')\" title=\"Click to add new row.\"><i class=\" icon-md fas fa-plus \"></i></a><a href=\"javascript:void(0)\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"removeAdditionalGuarantors('additionalGuarantors_" + i + "','" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\" icon-md fas fa-minus-circle \"></i></a>");
        }
        ks++;
    });
    if ($('.additionalGuarantors').length == 1) {
        $('#additionalGuarantors').find('.actionIcons').html("<a href=\"javascript:void(0)\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"addOrRemoveAdditionalGuarantors('" + tabIndex + "', 'additionalGuarantorsSection', 'additionalGuarantors')\" title=\"Click to add new row.\"><i class=\" icon-md fas fa-plus \"></i></a><a href=\"javascript:void(0)\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\"  onclick=\"removeAdditionalGuarantors('additionalGuarantors','" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\" icon-md fas fa-minus-circle \"></i></a>");
    }
    $("#agTCnt").val($('.additionalGuarantors').length);
}

function addOrRemoveVendorEquipment(tabIndex, mainSec, innerSec) {
    //$('.with-children-tip > *').hideTip();
    var rowObj = $(".vendorEquipment:first").clone(true);
    var cnt = $(".vendorEquipment").length;
    var tabIndex = $(".vendorEquipment").last().find('.equipmentDescription').attr('tabindex');

    var idCnt = 0;
    var nCnt = 1;
    jQuery(rowObj).find(':input').each(function (i) {
        switch (this.type) {
            case 'password':
            case 'text':
            case 'textarea':
            case 'file':
            case 'select-one':
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

    jQuery(rowObj).find(':input, i').each(function (i) {
        var idArr = [];
        var elmId = this.id;
        idArr = elmId.split('_');
        if (this.type != 'radio') $(this).attr('id', idArr[0] + "_" + cnt);
        $(this).attr('tabindex', tabIndex); // | Tabindex change
        if (this.type == 'radio') {
            var nameArr = [];
            var radioname = this.name;
            nameArr = radioname.split('_');
            $(this).attr('name', nameArr[0] + "_" + cnt + '[]');
            $(this).prop("checked", false);
        } else {
            jQuery(this).val('');
        }
    });

    jQuery(rowObj).each(function (i) {
        $(this).find('.fa-calendar').removeClass('guarantorDOB').addClass('guarantorDOB_' + i);
        $(".guarantorDOB_" + i + ", #guarantorDOB_" + i).click(function () {
            $('#guarantorDOB_' + i).datepicker({
                autoclose: true,
                changeMonth: true,
                changeYear: true,
                dateFormat: 'mm/dd/yy',
                yearRange: '-94:' + (new Date).getFullYear()
            }).focus();
        });
    });
    $("." + mainSec).append(rowObj);

    var ks = 0;
    jQuery("." + innerSec).each(function (i) {

        if (i != 0) {
            $(this).attr('id', "vendorEquipment_" + i);
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\"\n" +
                "           class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeVendorEquipment('vendorEquipment_" + i + "', '" + tabIndex + "')\"       title=\"Click To Remove Row\">\n" + "<i class=\" icon-md fas fa-minus-circle \"></i>\n" + "</a>");
        } else {
            $(this).find('.actionIcons').html(" <a href=\"javascript:void(0)\"\n" +
                "           class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeVendorEquipment('vendorEquipment','" + tabIndex + "')\" title=\"Click To Remove Row\">\n" +
                "                                        <i class=\" icon-md fas fa-minus-circle \"></i>\n" +
                "</a>");
        }
        if (($('.' + innerSec).length - 1) == ks) {
            $(this).find('.actionIcons').html(" <a href=\"javascript:void(0)\"\n" +
                "           class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"addOrRemoveVendorEquipment('" + tabIndex + "', 'vendorSectionAppend', 'vendorEquipment')\" title=\"Click To Add New Row\">\n" +
                "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
                "</a><a href=\"javascript:void(0)\"\n" +
                "           class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeVendorEquipment('vendorEquipment_" + i + "','" + tabIndex + "')\" title=\"Click To Remove Row\">\n" +
                "                                        <i class=\" icon-md fas fa-minus-circle \"></i>\n" +
                "</a>");
        }
        ks++;
        if (i % 2 == 1) {
            //$(this).addClass('even');
        } else {
            //  $(this).removeClass('even');
        }
    });
    jQuery(".vendorSecCnt").each(function (i) {
        $(this).html(i + 1);

    });
    enableSaveButton();
    $(".mask_phone").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
}

function removeVendorEquipment(rSec, tabIndex) {
    // $('.with-children-tip > *').hideTip();
    if (rSec == 'vendorEquipment') {
        jQuery("#" + rSec).find(':input').each(function (i) {
            switch (this.type) {
                case 'password':
                case 'text':
                case 'textarea':
                case 'file':
                case 'select-one':
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
    } else {
        $('#' + rSec).remove();
        var idCnt = 0;
        var nCnt = 1;
        jQuery('.vendorEquipment').find(':input').each(function (i) {
            if (6 < i) {
                var idArr = [];
                $(this).attr('tabindex', tabIndex);
                var elmId = this.id;
                idArr = elmId.split('_');
                $(this).attr('id', idArr[0] + "_" + idCnt);
            }
            if (nCnt == 7) {
                idCnt++;
                nCnt = 0;
            }
            nCnt++;
        });

        jQuery('.vendorEquipment').each(function (i) {
            $(this).find('.fa-calendar').removeClass('guarantorDOB').addClass('guarantorDOB_' + i);
            $(".guarantorDOB_" + i + ", #guarantorDOB_" + i).click(function () {
                $('#guarantorDOB_' + i).datepicker({
                    changeMonth: true,
                    changeYear: true,
                    dateFormat: 'mm/dd/yy',
                    yearRange: '-94:' + (new Date).getFullYear()
                }).focus();
            });
        });
    }

    var ks = 0;
    jQuery(".vendorEquipment").each(function (i) {
        if (i != 0) {
            $(this).attr('id', "vendorEquipment_" + i);
            $(this).find('.actionIcons').html("     <a href=\"javascript:void(0)\"\n" +
                "           class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeVendorEquipment('vendorEquipment_" + i + "', '" + tabIndex + "')\" title=\"Click To Remove Row\">\n" +
                "                                        <i class=\" icon-md fas fa-minus-circle \"></i>\n" +
                "</a>");
        } else {
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\"\n" +
                "           class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeVendorEquipment('vendorEquipment','" + tabIndex + "')\" title=\"Click To Remove Row\">\n" +
                "                                        <i class=\" icon-md fas fa-minus-circle \"></i>\n" +
                "</a>");
        }
        if (($('.vendorEquipment').length - 1) == ks) {
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\"\n" +
                "           class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"addOrRemoveVendorEquipment('" + tabIndex + "', 'vendorSectionAppend', 'vendorEquipment')\" title=\"Click To Add New Row\">\n" +
                "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
                "</a><a href=\"javascript:void(0)\"\n" +
                "           class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeVendorEquipment('vendorEquipment_" + i + "','" + tabIndex + "')\" title=\"Click To Remove Row\">\n" +
                "                                        <i class=\" icon-md fas fa-minus-circle \"></i>\n" +
                "</a>");
        }
        ks++;
    });
    if ($('.vendorEquipment').length == 1) {
        $('#vendorEquipment').find('.actionIcons').html("<a href=\"javascript:void(0)\"\n" +
            "           class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"addOrRemoveVendorEquipment('" + tabIndex + "', 'vendorSectionAppend', 'vendorEquipment')\" title=\"Click To Add New Row\">\n" +
            "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
            "</a><a href=\"javascript:void(0)\"\n" +
            "           class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"removeVendorEquipment('vendorEquipment','" + tabIndex + "')\" title=\"Click To Remove Row\">\n" +
            "                                        <i class=\" icon-md fas fa-minus-circle \"></i>\n" +
            "</a>");
    }
    enableSaveButton();
}


function toggleSection(toggleCls) {
    $("." + toggleCls).toggle();
}

function formatSSNNumber(inCls) {
    var start = inCls.selectionStart; // Cursor Start Position.
    var end = inCls.value; // Cursor End Position.
    var fldVal = $(inCls).val();
    fldVal = fldVal.replace(/[^0-9]/g, '');
    fldVal = fldVal.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
    $(inCls).val(fldVal);

    if (start != end) inCls.setSelectionRange(start, start); // Reset the cursor position.
    $(inCls).inputmask("mask", {mask: "999 - 99 - 9999"});
}

function formatPhoneNumber(inCls) {
    $(inCls).inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
}

function formatCellNumber(inCls) {
    var start = inCls.selectionStart; // Cursor Start Position.
    var end = inCls.value; // Cursor End Position.
    var fldVal = $(inCls).val();
    fldVal = fldVal.replace(/[^0-9]/g, '');
    fldVal = fldVal.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    $(inCls).val(fldVal);

    if (start != end) inCls.setSelectionRange(start, start); // Reset the cursor position.
    $(inCls).inputmask("mask", {mask: "999 - 999 - 9999"});
}

function validateQuickAndLongAppForms(PCID = '') {/* called before submiting the webfor,peerstreet form and third party service form */
    var trueCnt = 0;
    var label = '';

    var custom_full_app_validate_fields = ['REBroker', 'LMRClientType', 'borrowerFName', 'borrowerEmail'];
    /*story - 27792 stop the mandatory field validation for some fields of specified PC*/
    var mandatorySkipPC = ['3383', '4495'];
    var mandatorySkipFields = ['homeValue', 'propertyAddress', 'propertyCity', 'schedulePropAddr[]', 'scheduleStatus[]', 'propType[]', 'presentMarketValue[]', 'amountOfMortgages[]', 'grossRentalIncome[]', 'mortgagePayments[]', 'insMaintTaxMisc[]', 'netRentalIncome[]', 'schedulePropCity[]', 'schedulePropState[]', 'schedulePropZip[]', 'propTypeDesc[]', 'titledUnder[]', 'datePurchased[]', 'purchasePrice[]', 'valueofImprovementsMade[]', 'intendedOccupancy[]', 'anyMortgagesLiens', 'creditorName[]', 'accountNumber[]', 'loanStatus[]', 'monthlyPayment[]', 'unpaidBalance[]', 'type[]', 'creditLimit[]', 'anyOtherMortgagesLiens', 'creditorNameAnother[]', 'accountNumberAnother[]', 'loanStatusAnother[]', 'monthlyPaymentAnother[]', 'unpaidBalanceAnother[]', 'typeAnother[]', 'creditLimitAnother[]', 'ownership[]', 'maturityDateSchedule[]', 'maturityDateAnother[]', 'salesDate[]', 'salesPrice[]'];
    var mandatorySkipTransactionType = ['Purchase'];
    var transactionType = '';
    transactionType = $('#typeOfHMLOLoanRequesting').val();
    var wizardForm = false;
    try {
        if ($('#wizardForm').length > 0) {
            wizardForm = true;
        }
    } catch (e) {
        wizardForm = false;
    }
    jQuery('.mandatory').each(function (i) {
        if ($(this).is(':visible') && !$(this).prop('disabled')) {

            // if(!wizardForm){
            if ($('#submitType').val() == 'Save & Finish Later') {
                if ($.inArray(this.id, custom_full_app_validate_fields) == -1) {
                    return true;
                }
            }
            //}

            var fldVal = $(this).val();
            label = $('label[for="' + this.id + '"]').html();
            if (typeof label === "undefined") label = ''; // | Label Value is empty.

            if (this.id != '') {
                var isChosenSelValid = $('#' + this.id).hasClass("chzn-select-new");
                if (isChosenSelValid) {
                    var chznId = this.id;
                    var chznSelId = chznId.split("_");
                    if (chznSelId.length == 2) {
                        _dId = chznSelId[0];
                    } else if (chznSelId.length > 2) {
                        _dId = chznId.replace('_chosen', '');
                    }
                    var chznFldVal = $('#' + _dId).val().length;
                    if (label == '') {
                        label = $('label[for="' + _dId + '"]').html();
                    }
                    if (chznFldVal == 0) {
                        toastrNotification("Please Select " + label, 'error');
                        $('#' + _dId).trigger('chosen:open');
                        trueCnt++;
                        return false;
                    }
                }
            }

            //this array has the items with label please select
            //so we need to exclude the extra Please select in the toaster message

            var fieldsWithPlsLabel = ["LMRBroker", "borProfLicence", "coBorProfLicence"];

            if (this.type == 'select-one' || this.type == 'select-multiple') {
                if ((jQuery.inArray(this.name, mandatorySkipFields) >= 0) && jQuery.inArray(PCID, mandatorySkipPC) >= 0
                    && jQuery.inArray(transactionType, mandatorySkipTransactionType) >= 0) {

                } else if (fldVal == '') {
                    if ($.inArray(this.id, fieldsWithPlsLabel) !== -1) {
                        toastrNotification(label, 'error');
                    } else {
                        toastrNotification("Please Select " + label, 'error');
                    }
                    $(this).focus();
                    trueCnt++;
                    return false;
                }
            } else if (this.type == 'text' || this.type == 'textarea' || this.type == 'date' || this.type == 'number' || this.type == 'tel' || this.type == 'email') {
                if ((jQuery.inArray(this.name, mandatorySkipFields) >= 0) && jQuery.inArray(PCID, mandatorySkipPC) >= 0
                    && jQuery.inArray(transactionType, mandatorySkipTransactionType) >= 0) {

                } else if (fldVal.trim() == '' || ($('#activeTab').val() == 'PE' && jQuery.inArray(this.id, ['totalLoanAmount', 'costBasis']) !== -1 && !(parseInt(fldVal) > 0)
                )) {
                    toastrNotification("Please Enter " + label, 'error');
                    $(this).focus();
                    trueCnt++;
                    return false;
                }
            } else if (this.type == 'radio') {
                label1 = $('label[for="' + this.name + '"]').html();
                if (typeof label1 === "undefined") {
                    label1 = label;
                }
                if (!$("input[name='" + this.name + "']:checked").val()) {
                    //this change is for HMDA - (Borrower) & HMDA - (Co-Borrower)
                    //What is your Race: Native Hawaiian or Other Pacific Islander
                    //As we used same input name for Asian and Native Hawaiian or Other Pacific Islander
                    //HMDA - (Borrower)
                    if (this.name == 'bFiRaceSub') {
                        if (!$('#Native').hasClass('hidden')) {
                            label1 = $('label[for="NativeHOPI"]').html();
                        }
                    }
                    //HMDA - (Co-Borrower)
                    if (this.name == 'CBRaceSub') {
                        if (!$('#CBNative').hasClass('hidden')) {
                            label1 = $('label[for="CBNativeHOPI"]').html();
                        }
                    }
                    var nameArray = this.name.split('_');
                    if ((jQuery.inArray(nameArray[0], mandatorySkipFields) >= 0) && jQuery.inArray(PCID, mandatorySkipPC) >= 0
                        && jQuery.inArray(transactionType, mandatorySkipTransactionType) >= 0) {

                    } else {
                        toastrNotification("Please Select " + label1, 'error', 4000);
                        $(this).focus();
                        trueCnt++;
                        return false;
                    }
                } else {
                    $(this).css('outline', 'none');
                }
            } else if (this.type == 'checkbox') {
                //Collateral Section
                if ($(this).hasClass("collateral")) {
                    if (!$('.collateral:checkbox:checked').length > 0) {
                        label = "Please Select all collateral available to support the loan";
                        toastrNotification(label, 'error');
                        $(this).focus();
                        trueCnt++;
                        return false;
                    }
                } else {
                    label = $('label[for="' + this.name.slice(0, -2) + '"]').html();
                    if (typeof label === "undefined") {
                        label = $('label[for="' + this.id + '"]').html();
                    }
                    if (!$("input[id=" + this.id + "]:checked").val()) {
                        toastrNotification("Please Select " + label, 'error');
                        $(this).focus();
                        trueCnt++;
                        return false;
                    }
                }
            }
        }
    });


    if ($('#signStatus.mandatory').length > 0) {
        if ($('#signStatus.mandatory').val() == '' && !(wizardForm)) {
            label = $('label[for="signStatus"]').html();
            toastrNotification("Please Select " + label, 'error');
            $('#signatureparent').focus();
            trueCnt++;
            return false;
        }
    }

    if (trueCnt > 0) {
        return false;
    } else {
        // 3rd party services tab multiple submit button click disabled
        if ($('#activeTab').val() == 'TPS') {
            $('#psSubmit').prop('disabled', true);
            $('#btnSave').prop('disabled', true);
        }
        return true;
    }
}

function validateWebformMandatoryField(mandatoryFieldInfo) {
    var trueCnt = 0;
    var label = '';
    var loanNumber = '';
    var encPCID = '';
    var fid = '';
    console.log(mandatoryFieldInfo);
    $.each(mandatoryFieldInfo, function (key, val) {
        var temp = val.name.split('[');
        if (temp[1] == undefined) {
            var selector = "input[name='" + val.name + "']";
        } else {
            var selector = "#" + val.id;
        }
        if ($(selector).is(':visible') && !($(selector).prop('disabled'))) {
            var fldVal = $(selector).val();
            label = $('label[for="' + val.id + '"]').html();
            if (label == undefined) label = ''; // | Label Value is empty.

            var isChosenSelValid = $(selector).hasClass("chzn-select-new");
            if (isChosenSelValid) {
                var chznId = val.id;
                chznSelId = chznId.split("_");
                chznFldVal = $('#' + chznSelId[0]).val();
                if (!chznFldVal) {
                    toastrNotification("Please Select " + label, 'error');
                    $(selector).focus();
                    trueCnt++;
                    return false;
                }
            }

            if (val.type == 'select-one' || val.type == 'select-multiple') {
                if (fldVal == '') {
                    toastrNotification("Please Select " + label, 'error');
                    $(selector).focus();
                    trueCnt++;
                    return false;
                }
            } else if (val.type == 'text' || val.type == 'textarea' || val.type == 'date' || val.type == 'number' || val.type == 'tel' || val.type == 'email') {
                if (fldVal == '') {
                    toastrNotification("Please Enter " + label, 'error');
                    $(selector).focus();
                    trueCnt++;
                    return false;
                }
            } else if (val.type == 'radio') {
                if (!$("input[name=" + val.name + "]:checked").val()) {
                    toastrNotification("Please Select " + label, 'error');
                    $(selector).focus();
                    trueCnt++;
                    return false;
                }
            } else if (val.type == 'checkbox') {
                if ($('input[type=checkbox]:checked').length == 0) {
                    toastrNotification("Please Select " + label, 'error');
                    $(selector).focus();
                    trueCnt++;
                    return false;
                }
            }
        }
    });

    if (trueCnt > 0) {
        return false;
    } else {
        return true;
    }
}

function validateQuickAndLongAppFormsHMLI() {
    console.log('validateee');
    var trueCnt = 0;
    var label = '';
    var loanNumber = '';
    var encPCID = '';
    var fid = '';

    jQuery('.mandatory').each(function (i) {
        if ($(this).is(':visible') && !($(this).prop('disabled'))) {
            var fldVal = $(this).val();
            label = $('label[for="' + this.id + '"]').html();
            if (typeof label === "undefined") label = ''; // | Label Value is empty.

            if (this.id != '') {
                var isChosenSelValid = $('#' + this.id).hasClass("chzn-select-new");
                if (isChosenSelValid) {
                    var chznId = this.id;
                    var chznSelId = chznId.split("_");
                    var chznFldVal = $('#' + chznSelId[0]).val().length;
                    if (label == '') {
                        label = $('label[for="' + chznSelId[0] + '"]').html();
                    }
                    if (chznFldVal == 0) {
                        toastrNotification("Please Select " + label, 'error');
                        $('#' + chznSelId[0]).trigger('chosen:open');
                        trueCnt++;
                        return false;
                    }
                }
            }

            if (this.type == 'select-one' || this.type == 'select-multiple') {
                if (fldVal == '') {
                    toastrNotification("Please Select " + label, 'error');
                    $(this).focus();
                    trueCnt++;
                    return false;
                }
            } else if (this.type == 'text' || this.type == 'textarea' || this.type == 'date' || this.type == 'number' || this.type == 'tel' || this.type == 'email') {
                if (fldVal == '') {
                    toastrNotification("Please Enter " + label, 'error');
                    $(this).focus();
                    trueCnt++;
                    return false;
                }
            } else if (this.type == 'radio') {
                label1 = $('label[for="' + this.name + '"]').html();
                if (typeof label1 === "undefined") {
                    label1 = label;
                }
                if (!$("input[name=" + this.name + "]:checked").val()) {
                    toastrNotification("Please Select " + label1, 'error', 4000);
                    $(this).focus();
                    trueCnt++;
                    return false;
                } else {
                    $(this).css('outline', 'none');
                }
            } else if (this.type == 'checkbox') {
                label = $('label[for="' + this.name.slice(0, -2) + '"]').html();
                if (typeof label === "undefined") {
                    label = $('label[for="' + this.id + '"]').html();
                }
                if (!$("input[type=" + this.id + "]:checked").val()) {
                    toastrNotification("Please Select " + label, 'error');
                    $(this).focus();
                    trueCnt++;
                    return false;
                }
            }
        }
    });

    if (trueCnt > 0) {
        return false;
    } else {
        return true; //validateMinMaxLoanGuidelines();
    }
}

function makeDealMandatory(noOfDeals, section) {
    if (noOfDeals == 0) {
        $('.' + section + 'Example1').removeClass('mandatory');
        $('.' + section + 'Example2').removeClass("mandatory");
        $('.' + section + 'Example3').removeClass("mandatory");
        $('.' + section + 'RehabExample1').removeClass('mandatory');
        $('.' + section + 'RehabExample2').removeClass("mandatory");
        $('.' + section + 'RehabExample3').removeClass("mandatory");
    } else if (noOfDeals == 1) {
        $('.' + section + 'Example1').addClass('mandatory');
        $('.' + section + 'Example2').removeClass("mandatory");
        $('.' + section + 'Example3').removeClass("mandatory");
        $('.' + section + 'RehabExample1').addClass('mandatory');
        $('.' + section + 'RehabExample2').removeClass("mandatory");
        $('.' + section + 'RehabExample3').removeClass("mandatory");
    } else if (noOfDeals == 2) {
        $('.' + section + 'Example1').addClass('mandatory');
        $('.' + section + 'Example2').addClass("mandatory");
        $('.' + section + 'Example3').removeClass("mandatory");
        $('.' + section + 'RehabExample1').addClass('mandatory');
        $('.' + section + 'RehabExample2').addClass("mandatory");
        $('.' + section + 'RehabExample3').removeClass("mandatory");
    } else {
        $('.' + section + 'Example1').addClass('mandatory');
        $('.' + section + 'Example2').addClass("mandatory");
        $('.' + section + 'Example3').addClass("mandatory");
        $('.' + section + 'RehabExample1').addClass('mandatory');
        $('.' + section + 'RehabExample2').addClass("mandatory");
        $('.' + section + 'RehabExample3').addClass("mandatory");
    }
}

function getFieldsValue(FId) {
    var fldVal = 0;
    try {
        fldVal = $('#' + FId).val();
        fldVal = replaceCommaValues(fldVal);
    } catch (e) {
    }

    if (fldVal == undefined || fldVal == "") fldVal = 0;

    return fldVal;
}

function getTextValue(FId) {
    var fldVal = 0;
    try {
        fldVal = $('#' + FId).text();
        fldVal = replaceCommaValues(fldVal);
    } catch (e) {
    }

    if (fldVal == undefined || fldVal == "") fldVal = 0;

    return fldVal;
}

function formatDateField(dFld) {
    $(dFld).mask('99/99/9999', {placeholder: "mm/dd/yyyy"});
    var start = dFld.selectionStart; // Cursor Start Position.
    var end = dFld.value; // Cursor End Position.
    if (start != end) dFld.setSelectionRange(start, start); // Reset the cursor position
}

function showHideExitPro(fVal, tId) {
    if (fVal == 'Sold') {
        $("#soldDiv" + tId).show();
        $("#soldDiv1" + tId).show();
        $("#rentalDiv" + tId).hide();
    } else if (fVal == 'Rented') {
        $("#rentalDiv" + tId).show();
        $("#soldDiv" + tId).hide();
        $("#soldDiv1" + tId).hide();
    } else {
        $("#soldDiv" + tId).hide();
        $("#soldDiv1" + tId).hide();
        $("#rentalDiv" + tId).hide();
    }
}

function showHideGUExitPro(fVal, tId) {
    if (fVal == 'Sold') {
        $("#GUSaleDiv" + tId).show();
        $("#GUSaleDiv1" + tId).show();
        $("#GURentalDiv" + tId).hide();
    } else if (fVal == 'Rented') {
        $("#GURentalDiv" + tId).show();
        $("#GUSaleDiv" + tId).hide();
        $("#GUSaleDiv1" + tId).hide();
    } else {
        $("#GUSaleDiv" + tId).hide();
        $("#GUSaleDiv1" + tId).hide();
        $("#GURentalDiv" + tId).hide();
    }
}

function showHideSellExitPro(fVal, tId) {
    if (fVal == 'Sold') {
        $("#sellSaleDiv" + tId).show();
        $("#sellSaleDiv1" + tId).show();
        $("#sellRentalDiv" + tId).hide();
    } else if (fVal == 'Rented') {
        $("#sellRentalDiv" + tId).show();
        $("#sellSaleDiv" + tId).hide();
        $("#sellSaleDiv1" + tId).hide();
    } else {
        $("#sellSaleDiv" + tId).hide();
        $("#sellSaleDiv1" + tId).hide();
        $("#sellRentalDiv" + tId).hide();
    }
}

/**
 Description     : Populate Borrower information.
 Developer       : Suresh.
 Date            : june 01, 2018.
 Included        : populateClientInfo(), showClientEntityInfo().
 PT Task Number  : #156318354.
 **/
var submitOtpForm = function () {
    $.ajax({
        type: 'POST',
        url: siteSSLUrl + "backoffice/webformOtp.php",
        data: $('#webformOtpForm').serialize(),
        async: false,
        cache: false,
        success: function (myData) {
            return $.parseJSON(myData);
        }
    });
    //return myDataObj;
}

function populateClientInfo(formName, email, PCID, LMRID, CID) {
    if (email == $('#orignalborEmail').val()) {
        return false;
    }
    var phoneNo = '',
        phoneNo1 = '',
        phoneNo2 = '',
        phoneNo3 = '',
        $cellNo = '',
        cellNo1 = '';
    var cellNo2 = '',
        cellNo3 = '',
        phoneNoExt = userType = '';
    var clientInfo = clFlipExp = clGUExp = clDocs = clAssets = clSellExp = entity = clientFormName = [];

    clientFormName = formName.split('-');
    userType = clientFormName[0];

    if (userType == "client") {

        if (PCID != '3198') {  //3198 (ticket is sc-26787) **exception**
            $.ajax({
                type: 'POST',
                url: siteSSLUrl + "backoffice/getClientInfo.php",
                data: jQuery.param({'email': email, 'PCID': PCID, 'cnt': 'fetch'}),
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                success: function (myData) {
                    var obj = $.parseJSON(myData);
                    if (obj.cnt > 0) {

                        $.confirm({
                            icon: 'fas fa-info-circle text-primary icon-xl',
                            closeIcon: true,
                            columnClass: 'col-md-8',
                            title: 'Alert',
                            content: '<b>We have some basic info stored on your behalf. We will import that info into this form.</b>',
                            type: 'red',
                            backgroundDismiss: true,
                            buttons: {
                                yes: {
                                    btnClass: 'btn-green',
                                    action: function () {

                                        $.confirm({
                                            icon: 'fas fa-info-circle text-primary icon-xl',
                                            closeIcon: true,
                                            columnClass: 'col-md-8',
                                            title: 'Please Select Verification Method',
                                            type: 'red',
                                            backgroundDismiss: false,
                                            content: obj._t,
                                            buttons: {
                                                formSubmit: {
                                                    text: 'Send',
                                                    btnClass: 'btn-blue sendButtonOTP',
                                                    action: function () {
                                                        //var name = this.$content.find('.name').val();
                                                        var verifiCationType = $("input[name='verifiCationType']:checked").val();
                                                        if (typeof (verifiCationType) === "undefined") {
                                                            $.alert('Please Select Verification Method');
                                                            return false;
                                                        } else {
                                                            //if($("input[name='verifiCationType']:checked").val() != ''){
                                                            $('#otpButtonType').val('Send');
                                                            $.ajax({
                                                                type: 'POST',
                                                                url: siteSSLUrl + "backoffice/webformOtp.php",
                                                                data: $('#webformOtpForm').serialize(),
                                                                async: false,
                                                                cache: false,
                                                                success: function (myData) {
                                                                    myDataObj = $.parseJSON(myData);
                                                                    if (myDataObj.code == 100) {
                                                                        $('.jconfirm-title').html('Verification')
                                                                        $('.otpCreateDiv').hide();
                                                                        $('.otpConfirmDiv').show();
                                                                        $('.sendButtonOTP').hide();
                                                                        $('.resendButtonOTP').removeClass('d-none');
                                                                        $('.verifyButtonOTP').removeClass('d-none');
                                                                        $.alert(myDataObj.msg);
                                                                    } else {
                                                                        $.alert(myDataObj.msg);
                                                                    }
                                                                }
                                                            });
                                                            return false;
                                                        }
                                                    }
                                                },
                                                verify: {
                                                    text: 'Verify',
                                                    btnClass: 'verifyButtonOTP btn-success d-none',
                                                    action: function () {
                                                        $('#otpButtonType').val('Verify');
                                                        $.ajax({
                                                            type: 'POST',
                                                            url: siteSSLUrl + "backoffice/webformOtp.php",
                                                            data: $('#webformOtpForm').serialize(),
                                                            async: false,
                                                            cache: false,
                                                            success: function (myData) {
                                                                myDataObj = $.parseJSON(myData);
                                                                if (myDataObj.code == 100) {
                                                                    $.alert(myDataObj.msg);
                                                                    $('.jconfirm-open').remove();
                                                                    $.ajax({
                                                                        type: 'POST',
                                                                        url: siteSSLUrl + "backoffice/getClientInfo.php",
                                                                        data: jQuery.param({
                                                                            'email': email,
                                                                            'PCID': PCID,
                                                                        }),
                                                                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                                                                        success: function (myData) {
                                                                            var obj = $.parseJSON(myData);


                                                                            try {
                                                                                clientInfo = obj.clientInfo; // | Get Client Background, Experience Info.
                                                                            } catch (e) {
                                                                            }
                                                                            try {
                                                                                clFlipExp = obj.clientFlipExpInfo; // | Get Client Flip Experience.
                                                                            } catch (e) {
                                                                            }
                                                                            try {
                                                                                clGUExp = obj.clientGUExpInfo; // | Get Client Background Experience.
                                                                            } catch (e) {
                                                                            }
                                                                            try {
                                                                                clSellExp = obj.clientSellExpInfo; // | Get Client Background Experience.
                                                                            } catch (e) {
                                                                            }
                                                                            try {
                                                                                clDocs = obj.ClientDocs; // | Get Client Documents.
                                                                            } catch (e) {
                                                                            }
                                                                            try {
                                                                                clAssets = obj.clientAssetsInfo; // | Get Client Assets.
                                                                            } catch (e) {
                                                                            }
                                                                            try {
                                                                                entity = obj.entityInfo; // | Get Entity Info.
                                                                            } catch (e) {
                                                                            }

                                                                            if (jQuery.isEmptyObject(clientInfo)) {
                                                                                return true;
                                                                            }
                                                                            /** Radio button Value assign for Background Info **/
                                                                            assignFieldValue(clientInfo.clientId, 'selClientId');
                                                                            checkRadioButton(clientInfo.isBorUSCitizen, 'isBorUSCitizen', 'borOriginAndVisaTR');
                                                                            if (clientInfo.isBorUSCitizen == 'No') {
                                                                                $("input[type='radio'][name='isBorUSCitizen'][value='" + clientInfo.isBorUSCitizen + "']").click();
                                                                                $('#borOrigin').val(clientInfo.borOrigin);
                                                                                $('#borVisaStatus').val(clientInfo.borVisaStatus);
                                                                            }
                                                                            checkRadioButton(clientInfo.isBorDecalredBankruptPastYears, 'isBorDecalredBankruptPastYears', 'borDecalredBankruptTR');
                                                                            checkRadioButton(clientInfo.isAnyBorOutstandingJudgements, 'isAnyBorOutstandingJudgements', 'borOutstandingJudgementsTR');
                                                                            checkRadioButton(clientInfo.hasBorAnyActiveLawsuits, 'hasBorAnyActiveLawsuits', 'borActiveLawsuitsTR');
                                                                            checkRadioButton(clientInfo.hasBorPropertyTaxLiens, 'hasBorPropertyTaxLiens', 'borPropertyTaxLiensTR');
                                                                            checkRadioButton(clientInfo.hasBorObligatedInForeclosure, 'hasBorObligatedInForeclosure', 'borObligatedInForeclosureTR');
                                                                            checkRadioButton(clientInfo.isBorPresenltyDelinquent, 'isBorPresenltyDelinquent', 'borDelinquentTR');
                                                                            checkRadioButton(clientInfo.haveBorOtherFraudRelatedCrimes, 'haveBorOtherFraudRelatedCrimes', 'borOtherFraudRelatedCrimesTR');
                                                                            /** Radio button Value assign for Experience Info **/
                                                                            checkRadioButton(clientInfo.haveBorREInvestmentExperience, 'haveBorREInvestmentExperience', 'borRealEstateInvestmentDiv');
                                                                            checkRadioButton(clientInfo.haveBorRehabConstructionExperience, 'haveBorRehabConstructionExperience', 'borRehabConstructionExperienceDiv');
                                                                            checkRadioButton(clientInfo.haveBorProjectCurrentlyInProgress, 'haveBorProjectCurrentlyInProgress', 'borProjectsCurrentlyProgressDiv');
                                                                            checkRadioButton(clientInfo.haveBorOwnInvestmentProperties, 'haveBorOwnInvestmentProperties', 'borOwnInvestmentPropertiesDiv');
                                                                            checkRadioButton(clientInfo.areBorMemberOfInvestmentClub, 'areBorMemberOfInvestmentClub', 'borMemberOfInvestmentClubDiv');
                                                                            checkRadioButton(clientInfo.haveBorProfLicences, 'haveBorProfLicences', 'borHaveProfLicencesDiv');
                                                                            checkRadioButton(clientInfo.haveBorSellPropertie, 'haveBorSellPropertie', 'haveBorSellPropertieDiv');

                                                                            /** Input Field Value assign. Client Info **/

                                                                            assignFieldValue(clientInfo.clientFName, 'borrowerFName');
                                                                            assignFieldValue(clientInfo.clientFName, 'borrowerName');
                                                                            assignFieldValue(clientInfo.clientLName, 'borrowerLName');
                                                                            assignFieldValue(email, 'borrowerEmail');
                                                                            assignFieldValue(clientInfo.clientSecondaryEmail, 'borrowerSecondaryEmail');
                                                                            assignFieldValue(email, 'orignalborEmail');

                                                                            assignFieldValue(clientInfo.clientPhone, 'phoneNumber');
                                                                            assignFieldValue(clientInfo.clientCell, 'cellNo');
                                                                            assignFieldValue(clientInfo.clientAddress, 'presentAddress');
                                                                            assignFieldValue(clientInfo.clientCity, 'presentCity');
                                                                            assignFieldValue(clientInfo.clientState, 'presentState');
                                                                            assignFieldValue(clientInfo.clientZip, 'presentZip');
                                                                            assignFieldValue(clientInfo.borrowerPOB, 'borrowerPOB');
                                                                            //    assignFieldValue(formatDateValue(clientInfo.borrowerDOB), 'borrowerDOB');
                                                                            //    assignFieldValue(clientInfo.ssnNumber,'ssn');
                                                                            assignFieldValue(clientInfo.driverLicenseState, 'driverLicenseState');
                                                                            assignFieldValue(clientInfo.driverLicenseNumber, 'driverLicenseNumber');
                                                                            assignFieldValue(clientInfo.coBorDriverLicenseState, 'coBorDriverLicenseState');
                                                                            assignFieldValue(clientInfo.coBorDriverLicenseNumber, 'coBorDriverLicenseNumber');

                                                                            var mulSelect = [];
                                                                            try {
                                                                                mulSelect = clientInfo.methodOfContact.split(',');
                                                                            } catch (e) {
                                                                            }

                                                                            $("#methodOfContact").val(mulSelect).trigger("liszt:updated");
                                                                            $("#phoneNumber").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
                                                                            $("#cellNo").inputmask("mask", {mask: "999 - 999 - 9999"});
                                                                            $(".mask_ssn").inputmask("999 - 99 - 9999", {
                                                                                placeholder: " ",
                                                                                clearMaskOnLostFocus: !0
                                                                            });
                                                                            assignFieldValue(clientInfo.serviceProvider, 'serviceProvider');

                                                                            /** Input Field Value assign. Background Info **/
                                                                            assignFieldValue(clientInfo.borDecalredBankruptExpln, 'borDecalredBankruptExpln');
                                                                            assignFieldValue(clientInfo.borActiveLawsuitsExpln, 'borActiveLawsuitsExpln');
                                                                            assignFieldValue(clientInfo.borOutstandingJudgementsExpln, 'borOutstandingJudgementsExpln');
                                                                            assignFieldValue(clientInfo.borOutstandingJudgementsExpln, 'borOutstandingJudgementsExpln');
                                                                            assignFieldValue(clientInfo.borPropertyTaxLiensExpln, 'borPropertyTaxLiensExpln');
                                                                            assignFieldValue(clientInfo.borObligatedInForeclosureExpln, 'borObligatedInForeclosureExpln');
                                                                            assignFieldValue(clientInfo.borDelinquentExpln, 'borDelinquentExpln');
                                                                            assignFieldValue(clientInfo.borOtherFraudRelatedCrimesExpln, 'borOtherFraudRelatedCrimesExpln');
                                                                            assignFieldValue(clientInfo.borBackgroundExplanation, 'borBackgroundExplanation');

                                                                            /** Input Field Value assign. Experience Info **/
                                                                            assignFieldValue(clientInfo.borNoOfFlippingExperience, 'borNoOfFlippingExperience');
                                                                            assignFieldValue(clientInfo.borNoOfREPropertiesCompleted, 'borNoOfREPropertiesCompleted');
                                                                            assignFieldValue(clientInfo.borNoOfYearRehabExperience, 'borNoOfYearRehabExperience');
                                                                            assignFieldValue(clientInfo.borRehabPropCompleted, 'borRehabPropCompleted');
                                                                            assignFieldValue(clientInfo.borNoOfProSellCompleted, 'borNoOfProSellCompleted');
                                                                            assignFieldValue(clientInfo.borNoOfProSellExperience, 'borNoOfProSellExperience');
                                                                            assignFieldValue(clientInfo.borNoOfProjectCurrently, 'borNoOfProjectCurrently');
                                                                            assignFieldValue(clientInfo.borNoOfProjectCurrently, 'borNoOfProjectCurrently');
                                                                            assignFieldValue(clientInfo.borNoOfOwnProp, 'borNoOfOwnProp');
                                                                            assignFieldValue(clientInfo.borClubName, 'borClubName');
                                                                            assignFieldValue(clientInfo.liquidAssets, 'liquidAssets');
                                                                            assignFieldValue(clientInfo.borProfLicence, 'borProfLicence');
                                                                            var mulSelectPrimaryInvestment = [];
                                                                            try {
                                                                                mulSelectPrimaryInvestment = clientInfo.borPrimaryInvestmentStrategy.split(',');
                                                                            } catch (e) {
                                                                            }
                                                                            $("#borPrimaryInvestmentStrategy").val(mulSelectPrimaryInvestment).trigger("liszt:updated");

                                                                            var geographicAreas = [];
                                                                            try {
                                                                                geographicAreas = clientInfo.geographicAreas.split(',');
                                                                            } catch (e) {
                                                                            }
                                                                            $("#geographicAreas").val(geographicAreas).trigger("liszt:updated");

                                                                            checkMultiSelectValueExists('borPrimaryInvestmentStrategy', 'Other', 'borPriInvesStrategyDiv');
                                                                            assignFieldValue(clientInfo.borPrimaryInvestmentStrategyExplain, 'borPrimaryInvestmentStrategyExplain');

                                                                            assignFieldValue(clientInfo.amountOfFinancing, 'amountOfFinancing');
                                                                            assignFieldValue(clientInfo.amountOfFinancingTo, 'amountOfFinancingTo');
                                                                            assignFieldValue(clientInfo.typicalPurchasePrice, 'typicalPurchasePrice');
                                                                            assignFieldValue(clientInfo.typicalPurchasePriceTo, 'typicalPurchasePriceTo');
                                                                            assignFieldValue(clientInfo.typicalConstructionCosts, 'typicalConstructionCosts');
                                                                            assignFieldValue(clientInfo.typicalConstructionCostsTo, 'typicalConstructionCostsTo');
                                                                            assignFieldValue(clientInfo.typicalSalePrice, 'typicalSalePrice');
                                                                            assignFieldValue(clientInfo.typicalSalePriceTo, 'typicalSalePriceTo');

                                                                            assignFieldValue(clientInfo.constructionDrawsPerProject, 'constructionDrawsPerProject');
                                                                            assignFieldValue(clientInfo.constructionDrawsPerProjectTo, 'constructionDrawsPerProjectTo');
                                                                            assignFieldValue(clientInfo.monthsPurchaseDateToFirstConst, 'monthsPurchaseDateToFirstConst');
                                                                            assignFieldValue(clientInfo.monthsPurchaseDateToFirstConstTo, 'monthsPurchaseDateToFirstConstTo');
                                                                            assignFieldValue(clientInfo.monthsPurchaseDateUntilConst, 'monthsPurchaseDateUntilConst');
                                                                            assignFieldValue(clientInfo.monthsPurchaseDateUntilConstTo, 'monthsPurchaseDateUntilConstTo');
                                                                            assignFieldValue(clientInfo.monthsPurchaseDateToSaleDate, 'monthsPurchaseDateToSaleDate');
                                                                            assignFieldValue(clientInfo.monthsPurchaseDateToSaleDateTo, 'monthsPurchaseDateToSaleDateTo');
                                                                            assignFieldValue(clientInfo.NoOfSuchProjects, 'NoOfSuchProjects');
                                                                            assignFieldValue(clientInfo.NoOfSuchProjectsTo, 'NoOfSuchProjectsTo');

                                                                            /** Fliping Experience Info **/
                                                                            if (!jQuery.isEmptyObject(clFlipExp)) {
                                                                                for (cfe = 0; cfe < clFlipExp.length; cfe++) {
                                                                                    assignFieldValue(clFlipExp[cfe].propertyType, 'borFlipPropType' + cfe);
                                                                                    assignFieldValue(formatDateValue(clFlipExp[cfe].purchaseDate), 'borFlipPurchaseDate' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clFlipExp[cfe].purchasePrice), 'borFlipPurchasePrice' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clFlipExp[cfe].amountFinanced), 'borFlipAmountFinanced' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clFlipExp[cfe].rehabBudget), 'borFlipRehabBudget' + cfe);
                                                                                    assignFieldValue(clFlipExp[cfe].entityName, 'borFlipEntityName' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clFlipExp[cfe].ownership), 'borFlipOwnership' + cfe);
                                                                                    assignFieldValue(clFlipExp[cfe].exitValues, 'borFlipExit' + cfe);

                                                                                    showHideExitPro(clFlipExp[cfe].exitValues, 'solddiv' + cfe);

                                                                                    assignFieldValue(autoNumericConverter(clFlipExp[cfe].salePrice), 'borFlipSalePrice' + cfe);
                                                                                    assignFieldValue(formatDateValue(clFlipExp[cfe].saleDate), 'borFlipSaleDate' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clFlipExp[cfe].monthlyRent), 'borFlipMonthlyRent' + cfe);

                                                                                    assignFieldValue(clFlipExp[cfe].address, 'borFlipAddress' + cfe);
                                                                                    assignFieldValue(clFlipExp[cfe].city, 'borFlipCity' + cfe);
                                                                                    assignFieldValue(clFlipExp[cfe].state, 'borFlipState' + cfe);
                                                                                    assignFieldValue(clFlipExp[cfe].zip, 'borFlipZip' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clFlipExp[cfe].Outcome), 'borOutcomeRE' + cfe);
                                                                                    if (!jQuery.isEmptyObject(clDocs)) {
                                                                                        var dc = 'HUDDocs' + cfe;
                                                                                        try {
                                                                                            var dn = clDocs[dc].docName;
                                                                                            var dU = clDocs[dc].docUrl;
                                                                                            var dHUD = "<a href=\"" + dU + "\" target=\"_blank\">" + dn + "</a>"
                                                                                            if (dHUD != '') $('.FlipDocs_' + cfe).html(dHUD);
                                                                                        } catch (e) {
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }

                                                                            var guId = 3;
                                                                            if (!jQuery.isEmptyObject(clGUExp)) {
                                                                                for (cfe = 0; cfe < clGUExp.length; cfe++) {
                                                                                    assignFieldValue(clGUExp[cfe].propertyType, 'borGUPropType' + cfe);
                                                                                    assignFieldValue(formatDateValue(clGUExp[cfe].purchaseDate), 'borGUPurchaseDate' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clGUExp[cfe].purchasePrice), 'borGUPurchasePrice' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clGUExp[cfe].amountFinanced), 'borGUAmountFinanced' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clGUExp[cfe].rehabBudget), 'borGURehabBudget' + cfe);
                                                                                    assignFieldValue(clGUExp[cfe].entityName, 'borGUEntityName' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clGUExp[cfe].ownership), 'borGUOwnership' + cfe);
                                                                                    assignFieldValue(clGUExp[cfe].exitValues, 'borGUExit' + cfe);

                                                                                    showHideExitPro(clGUExp[cfe].exitValues, 'showhideborGUSale' + cfe);

                                                                                    assignFieldValue(autoNumericConverter(clGUExp[cfe].salePrice), 'borGUSalePrice' + cfe);
                                                                                    assignFieldValue(formatDateValue(clGUExp[cfe].saleDate), 'borGUSaleDate' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clGUExp[cfe].monthlyRent), 'borGUMonthlyRent' + cfe);

                                                                                    assignFieldValue(clGUExp[cfe].address, 'borGUAddress' + cfe);
                                                                                    assignFieldValue(clGUExp[cfe].city, 'borGUCity' + cfe);
                                                                                    assignFieldValue(clGUExp[cfe].state, 'borGUState' + cfe);
                                                                                    assignFieldValue(clGUExp[cfe].zip, 'borGUZip' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clGUExp[cfe].Outcome), 'borOutcomeRC' + cfe);
                                                                                    if (!jQuery.isEmptyObject(clDocs)) {
                                                                                        var dc = 'HUDDocs' + guId;
                                                                                        try {
                                                                                            var dn = clDocs[dc].docName;
                                                                                            var dU = clDocs[dc].docUrl;
                                                                                            var dHUD = "<a href=\"" + dU + "\" target=\"_blank\">" + dn + "</a>"
                                                                                            if (dHUD != '') $('.GUDocs_' + cfe).html(dHUD);
                                                                                        } catch (e) {
                                                                                        }
                                                                                    }
                                                                                    guId++;
                                                                                }
                                                                            }

                                                                            var guId = 6;
                                                                            if (!jQuery.isEmptyObject(clSellExp)) {
                                                                                showAndHideborrowerUnderExperience("Yes", 'haveBorSellPropertieDiv');
                                                                                for (cfe = 0; cfe < clSellExp.length; cfe++) {
                                                                                    assignFieldValue(clSellExp[cfe].propertyType, 'borSellPropType' + cfe);
                                                                                    assignFieldValue(formatDateValue(clSellExp[cfe].purchaseDate), 'borSellPurchaseDate' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clSellExp[cfe].purchasePrice), 'borSellPurchasePrice' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clSellExp[cfe].amountFinanced), 'borSellAmountFinanced' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clSellExp[cfe].rehabBudget), 'borSellRehabBudget' + cfe);
                                                                                    assignFieldValue(clSellExp[cfe].entityName, 'borSellEntityName' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clSellExp[cfe].ownership), 'borSellOwnership' + cfe);
                                                                                    assignFieldValue(clSellExp[cfe].exitValues, 'borSellExit' + cfe);

                                                                                    showHideSellExitPro(clSellExp[cfe].exitValues, cfe);

                                                                                    assignFieldValue(autoNumericConverter(clSellExp[cfe].salePrice), 'borSellSalePrice' + cfe);
                                                                                    assignFieldValue(formatDateValue(clSellExp[cfe].saleDate), 'borSellSaleDate' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clSellExp[cfe].monthlyRent), 'borSellMonthlyRent' + cfe);

                                                                                    assignFieldValue(clSellExp[cfe].address, 'borSellAddress' + cfe);
                                                                                    assignFieldValue(clSellExp[cfe].city, 'borSellCity' + cfe);
                                                                                    assignFieldValue(clSellExp[cfe].state, 'borSellState' + cfe);
                                                                                    assignFieldValue(clSellExp[cfe].zip, 'borSellZip' + cfe);
                                                                                    assignFieldValue(autoNumericConverter(clSellExp[cfe].Outcome), 'borOutcomeRC' + cfe);

                                                                                    if (!jQuery.isEmptyObject(clDocs)) {
                                                                                        var dc = 'HUDDocs' + guId;
                                                                                        try {
                                                                                            var dn = clDocs[dc].docName;
                                                                                            var dU = clDocs[dc].docUrl;
                                                                                            var dHUD = "<a href=\"" + dU + "\" target=\"_blank\">" + dn + "</a>"
                                                                                            if (dHUD != '') $('.SellDocs_' + cfe).html(dHUD);
                                                                                        } catch (e) {
                                                                                        }
                                                                                    }
                                                                                    guId++;
                                                                                }
                                                                            }

                                                                            if (!jQuery.isEmptyObject(clAssets)) {
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetCheckingAccounts), 'assetCheckingAccounts');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetSavingMoneyMarket), 'assetSavingMoneyMarket');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetStocks), 'assetStocks');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetIRAAccounts), 'assetIRAAccounts');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetESPOAccounts), 'assetESPOAccounts');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetHome), 'assetHome');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetORE), 'assetORE');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetCars), 'assetCars');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetLifeInsurance), 'assetLifeInsurance');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetOther), 'assetOther');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetCash), 'assetCash');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetHomeOwed), 'assetHomeOwed');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetOREOwed), 'assetOREOwed');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetCarsOwed), 'assetCarsOwed');
                                                                                assignFieldValue(autoNumericConverter(clAssets.otherAmtOwed), 'otherAmtOwed');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetTotalCashBankAcc), 'assetTotalCashBankAcc');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetTotalRetirementValue), 'assetTotalRetirementValue');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetAvailabilityLinesCredit), 'assetAvailabilityLinesCredit');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetSR), 'assetSR');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetSROwed), 'assetSROwed');
                                                                                assignFieldValue(autoNumericConverter(clAssets.networthOfBusinessOwned), 'networthOfBusinessOwned');
                                                                                assignFieldValue(clAssets.otherDesc, 'otherDesc');

                                                                                assignFieldValue(autoNumericConverter(clAssets.assetAccount), 'assetAccount');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetAccountOwd), 'assetAccountOwd');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetStocksOwed), 'assetStocksOwed');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetNonMarketableSecurities), 'assetNonMarketableSecurities');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetNonMarketableSecuritiesOwd), 'assetNonMarketableSecuritiesOwd');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetIRAAccountsOwed), 'assetIRAAccountsOwed');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetESPOAccountsOwed), 'assetESPOAccountsOwed');
                                                                                assignFieldValue(autoNumericConverter(clAssets.assetLifeInsuranceOwed), 'assetLifeInsuranceOwed');
                                                                                assignFieldValue(autoNumericConverter(clAssets.otherAssets), 'otherAssets');
                                                                                assignFieldValue(autoNumericConverter(clAssets.notesPayableToBanksOthersOwed), 'notesPayableToBanksOthersOwed');
                                                                                assignFieldValue(autoNumericConverter(clAssets.installmentAccountOwed), 'installmentAccountOwed');
                                                                                assignFieldValue(autoNumericConverter(clAssets.revolvingDebtOwed), 'revolvingDebtOwed');
                                                                                assignFieldValue(autoNumericConverter(clAssets.unpaidPayableTaxesOwed), 'unpaidPayableTaxesOwed');
                                                                                assignFieldValue(autoNumericConverter(clAssets.otherLiabilitiesOwed), 'otherLiabilitiesOwed');

                                                                                assignFieldValue(clAssets.otherLiabilityDetails, 'otherLiabilityDetails');
                                                                                assignFieldValue(clAssets.unpaidPayableTaxesDesc, 'unpaidPayableTaxesDesc');

                                                                                try {
                                                                                    calculateTotalAssets(clAssets.assetCheckingAccounts); // | Assets Calculation.
                                                                                } catch (e) {
                                                                                }
                                                                                try {
                                                                                    calculateTotalAssetsOwed(clAssets.assetCheckingAccounts, 'loanModForm'); // | Assets Owed Calculation.
                                                                                } catch (e) {
                                                                                }
                                                                            }

                                                                            /** Radio button Value assign for Information for Government Monitoring Purposes **/
                                                                            try {
                                                                                if (clientInfo.publishBInfo == 1) $('.BrNo').attr("checked", true);
                                                                            } catch (e) {
                                                                            }
                                                                            try {
                                                                                if (clientInfo.publishBInfo == 2) $('.BrYes').attr("checked", true);
                                                                            } catch (e) {
                                                                            }
                                                                            try {
                                                                                if (clientInfo.publishBInfo == 3) $('.BrNA').attr("checked", true);
                                                                            } catch (e) {
                                                                            }

                                                                            try {
                                                                                //clientInfo.ethnicity
                                                                                if (clientInfo.ethnicity == 2) {
                                                                                    // $('.BEYes').prop("checked", true);
                                                                                    $('.BEYes').click();
                                                                                    $("input[type='radio'][name='bFiEthnicitySub'][value='" + clientInfo.FIEthnicitySub + "']").click();
                                                                                    if (clientInfo.FIEthnicitySub == 4) {
                                                                                        $('#bFiEthnicitySubOthertxt').val(clientInfo.FIEthnicitySubOther);
                                                                                    }
                                                                                }
                                                                            } catch (e) {
                                                                            }

                                                                            try {
                                                                                if (clientInfo.veteran != '') {
                                                                                    $("input[type='radio'][name='BVeteran'][value='" + clientInfo.veteran + "']").click();
                                                                                }
                                                                            } catch (e) {

                                                                            }

                                                                            try {
                                                                                if (clientInfo.ethnicity == 1) $('.BENo').attr("checked", true);
                                                                            } catch (e) {

                                                                            }

                                                                            try {
                                                                                if (clientInfo.race == 1) $('.BRaceAM').attr("checked", true);
                                                                            } catch (e) {

                                                                            }

                                                                            try {
                                                                                if (clientInfo.race == 2) {
                                                                                    //$('.BRaceAS').prop("checked", true);
                                                                                    $('.BRaceAS').click();
                                                                                    $("input[type='radio'][name='bFiRaceSub'][value='" + clientInfo.FIRaceSub + "']").click();
                                                                                    if (clientInfo.FIRaceSub == 7) {
                                                                                        $('#bFiRaceAsianOther').val(clientInfo.FIRaceAsianOther);
                                                                                    }
                                                                                }
                                                                            } catch (e) {
                                                                            }

                                                                            try {
                                                                                if (clientInfo.race == 3) $('.BRaceBA').attr("checked", true);
                                                                            } catch (e) {
                                                                            }

                                                                            try {
                                                                                if (clientInfo.race == 4) {
                                                                                    //$('.BRaceNH').attr("checked", true);
                                                                                    $('.BRaceNH').click();
                                                                                    $("input[type='radio'][name='bFiRaceSub'][value='" + clientInfo.FIRaceSub + "']").click();
                                                                                    if (clientInfo.FIRaceSub == 11) {
                                                                                        $('#bFiRacePacificOther').val(clientInfo.FIRacePacificOther);
                                                                                    }
                                                                                    // $("input[type='radio'][name='FIRaceSub'][value='"+clientInfo.FIRaceSub+"']").click();
                                                                                }
                                                                            } catch (e) {
                                                                            }

                                                                            try {
                                                                                if (clientInfo.race == 5) $('.BRaceW').attr("checked", true);
                                                                            } catch (e) {
                                                                            }

                                                                            try {
                                                                                if (clientInfo.gender == 2) $('.BGenderM').attr("checked", true);
                                                                            } catch (e) {
                                                                            }

                                                                            try {
                                                                                if (clientInfo.gender == 1) $('.BGenderF').attr("checked", true);
                                                                            } catch (e) {
                                                                            }

                                                                            try {
                                                                                //if (clientInfo.FIEthnicity == 'Yes'){
                                                                                $("input[type='radio'][name='bFiEthnicity'][value='" + clientInfo.FIEthnicity + "']").click();
                                                                                //  }
                                                                                // if (clientInfo.FIEthnicity == ''){
                                                                                //     $("input[type='radio'][name='FIEthnicity'][value='"+clientInfo.FIEthnicity+"']").click();
                                                                                // }
                                                                            } catch (e) {
                                                                            }

                                                                            try {
                                                                                $("input[type='radio'][name='bFiSex'][value='" + clientInfo.FISex + "']").click();
                                                                            } catch (e) {
                                                                            }

                                                                            try {
                                                                                $("input[type='radio'][name='bFiRace'][value='" + clientInfo.FIRace + "']").click();
                                                                            } catch (e) {
                                                                            }

                                                                            try {
                                                                                $("input[type='radio'][name='bDemoInfo'][value='" + clientInfo.DemoInfo + "']").click();
                                                                            } catch (e) {
                                                                            }
                                                                            /*try {
                                                                                if (clientInfo.publishBInfo == 1) $('.BrNo').attr("checked", true);
                                                                            } catch (e) {}
                                                                            try {
                                                                                if (clientInfo.publishBInfo == 2) $('.BrYes').attr("checked", true);
                                                                            } catch (e) {}
                                                                            try {
                                                                                if (clientInfo.publishBInfo == 3) $('.BrNA').attr("checked", true);
                                                                            } catch (e) {}

                                                                            try {
                                                                                if (clientInfo.ethnicity == 2) $('.BEYes').attr("checked", true);
                                                                            } catch (e) {}
                                                                            try {
                                                                                if (clientInfo.ethnicity == 1) $('.BENo').attr("checked", true);
                                                                            } catch (e) {}

                                                                            try {
                                                                                if (clientInfo.race == 1) $('.BRaceAM').attr("checked", true);
                                                                            } catch (e) {}
                                                                            try {
                                                                                if (clientInfo.race == 2) $('.BRaceAS').attr("checked", true);
                                                                            } catch (e) {}
                                                                            try {
                                                                                if (clientInfo.race == 3) $('.BRaceBA').attr("checked", true);
                                                                            } catch (e) {}
                                                                            try {
                                                                                if (clientInfo.race == 4) $('.BRaceNH').attr("checked", true);
                                                                            } catch (e) {}
                                                                            try {
                                                                                if (clientInfo.race == 5) $('.BRaceW').attr("checked", true);
                                                                            } catch (e) {}

                                                                            try {
                                                                                if (clientInfo.gender == 2) $('.BGenderM').attr("checked", true);
                                                                            } catch (e) {}
                                                                            try {
                                                                                if (clientInfo.gender == 1) $('.BGenderF').attr("checked", true);
                                                                            } catch (e) {}*/

                                                                            if (clientInfo.clientId > 0 && !jQuery.isEmptyObject(entity)) {
                                                                                $('#borrowerUnderEntityYes').attr("checked", true);
                                                                                // showAndHideborrowerUnderEntity('Yes', 'showHideborrowerEntity');
                                                                                if (entity.length == 1) {
                                                                                    $('#entityName').val(entity[0].entityName);
                                                                                    showPCClientEntityInfoForFile(entity[0].CBEID, PCID);
                                                                                } else {
                                                                                    $("#entityName").click(function () {
                                                                                        EntityOptions = {
                                                                                            serviceUrl: siteSSLUrl + 'JQFiles/getAutoCompletedClientEntityInfo.php?PCID=' + PCID + '&autoCID=' + clientInfo.clientId,
                                                                                            minChars: 0,
                                                                                            onSelect: function (value, data) {
                                                                                                $('#entityName').val(value);
                                                                                                showPCClientEntityInfoForFile(data, PCID);
                                                                                            }
                                                                                        };
                                                                                        $('#entityName').autocomplete(EntityOptions).onValueChange(); // Passing value from matching email Entity Info End..
                                                                                    });
                                                                                }
                                                                            }


                                                                        }
                                                                    });
                                                                } else {
                                                                    $.alert(myDataObj.msg);
                                                                    return false;
                                                                }
                                                            }
                                                        });
                                                        return false;
                                                    }
                                                },
                                                resend: {
                                                    text: 'Resend',
                                                    btnClass: 'resendButtonOTP btn-warning d-none',
                                                    action: function () {
                                                        $('#enterWebformOTP').val('');
                                                        $('#otpButtonType').val('resend');

                                                        $.ajax({
                                                            type: 'POST',
                                                            url: siteSSLUrl + "backoffice/webformOtp.php",
                                                            data: $('#webformOtpForm').serialize(),
                                                            async: false,
                                                            cache: false,
                                                            success: function (myData) {
                                                                myDataObj = $.parseJSON(myData);
                                                                if (myDataObj.code == 100) {
                                                                    $.alert(myDataObj.msg);
                                                                } else {
                                                                    $.alert(myDataObj.msg);
                                                                }
                                                            }
                                                        });
                                                        return false;
                                                    }
                                                },
                                                cancel: function () {
                                                    //close
                                                },
                                            },
                                        });
                                    }
                                },
                                cancel: {
                                    text: 'No',
                                    action: function () {
                                        //  location.reload();
                                    }
                                },
                            }
                        });

                    } else {
                        return false;
                    }

                    ///////////////////////////////////*******************

                    if (jQuery.isEmptyObject(clientInfo)) {

                        return true;
                    } else {


                        $.confirm({
                            icon: 'fas fa-info-circle text-primary icon-xl',
                            closeIcon: true,
                            columnClass: 'col-md-8',
                            title: 'Alert',
                            content: '<b>We have some basic info stored on your behalf. We will import that info into this form.</b>',
                            type: 'red',
                            backgroundDismiss: true,
                            buttons: {
                                yes: {
                                    btnClass: 'btn-green',
                                    action: function () {
                                        /** Radio button Value assign for Background Info **/
                                        assignFieldValue(clientInfo.clientId, 'selClientId');
                                        checkRadioButton(clientInfo.isBorUSCitizen, 'isBorUSCitizen', 'borOriginAndVisaTR');
                                        if (clientInfo.isBorUSCitizen == 'No') {
                                            $("input[type='radio'][name='isBorUSCitizen'][value='" + clientInfo.isBorUSCitizen + "']").click();
                                            $('#borOrigin').val(clientInfo.borOrigin);
                                            $('#borVisaStatus').val(clientInfo.borVisaStatus);
                                        }
                                        checkRadioButton(clientInfo.isBorDecalredBankruptPastYears, 'isBorDecalredBankruptPastYears', 'borDecalredBankruptTR');
                                        checkRadioButton(clientInfo.isAnyBorOutstandingJudgements, 'isAnyBorOutstandingJudgements', 'borOutstandingJudgementsTR');
                                        checkRadioButton(clientInfo.hasBorAnyActiveLawsuits, 'hasBorAnyActiveLawsuits', 'borActiveLawsuitsTR');
                                        checkRadioButton(clientInfo.hasBorPropertyTaxLiens, 'hasBorPropertyTaxLiens', 'borPropertyTaxLiensTR');
                                        checkRadioButton(clientInfo.hasBorObligatedInForeclosure, 'hasBorObligatedInForeclosure', 'borObligatedInForeclosureTR');
                                        checkRadioButton(clientInfo.isBorPresenltyDelinquent, 'isBorPresenltyDelinquent', 'borDelinquentTR');
                                        checkRadioButton(clientInfo.haveBorOtherFraudRelatedCrimes, 'haveBorOtherFraudRelatedCrimes', 'borOtherFraudRelatedCrimesTR');
                                        /** Radio button Value assign for Experience Info **/
                                        checkRadioButton(clientInfo.haveBorREInvestmentExperience, 'haveBorREInvestmentExperience', 'borRealEstateInvestmentDiv');
                                        checkRadioButton(clientInfo.haveBorRehabConstructionExperience, 'haveBorRehabConstructionExperience', 'borRehabConstructionExperienceDiv');
                                        checkRadioButton(clientInfo.haveBorProjectCurrentlyInProgress, 'haveBorProjectCurrentlyInProgress', 'borProjectsCurrentlyProgressDiv');
                                        checkRadioButton(clientInfo.haveBorOwnInvestmentProperties, 'haveBorOwnInvestmentProperties', 'borOwnInvestmentPropertiesDiv');
                                        checkRadioButton(clientInfo.areBorMemberOfInvestmentClub, 'areBorMemberOfInvestmentClub', 'borMemberOfInvestmentClubDiv');
                                        checkRadioButton(clientInfo.haveBorProfLicences, 'haveBorProfLicences', 'borHaveProfLicencesDiv');
                                        checkRadioButton(clientInfo.haveBorSellPropertie, 'haveBorSellPropertie', 'haveBorSellPropertieDiv');

                                        /** Input Field Value assign. Client Info **/

                                        assignFieldValue(clientInfo.clientFName, 'borrowerFName');
                                        assignFieldValue(clientInfo.clientFName, 'borrowerName');
                                        assignFieldValue(clientInfo.clientLName, 'borrowerLName');
                                        assignFieldValue(email, 'borrowerEmail');
                                        assignFieldValue(clientInfo.clientSecondaryEmail, 'borrowerSecondaryEmail');
                                        assignFieldValue(email, 'orignalborEmail');

                                        assignFieldValue(clientInfo.clientPhone, 'phoneNumber');
                                        assignFieldValue(clientInfo.clientCell, 'cellNo');
                                        assignFieldValue(clientInfo.clientAddress, 'presentAddress');
                                        assignFieldValue(clientInfo.clientCity, 'presentCity');
                                        assignFieldValue(clientInfo.clientState, 'presentState');
                                        assignFieldValue(clientInfo.clientZip, 'presentZip');
                                        assignFieldValue(clientInfo.borrowerPOB, 'borrowerPOB');
                                        //    assignFieldValue(formatDateValue(clientInfo.borrowerDOB), 'borrowerDOB');
                                        //    assignFieldValue(clientInfo.ssnNumber,'ssn');
                                        assignFieldValue(clientInfo.driverLicenseState, 'driverLicenseState');
                                        assignFieldValue(clientInfo.driverLicenseNumber, 'driverLicenseNumber');
                                        assignFieldValue(clientInfo.coBorDriverLicenseState, 'coBorDriverLicenseState');
                                        assignFieldValue(clientInfo.coBorDriverLicenseNumber, 'coBorDriverLicenseNumber');

                                        var mulSelect = [];
                                        try {
                                            mulSelect = clientInfo.methodOfContact.split(',');
                                        } catch (e) {
                                        }

                                        $("#methodOfContact").val(mulSelect).trigger("liszt:updated");
                                        $("#phoneNumber").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
                                        $("#cellNo").inputmask("mask", {mask: "999 - 999 - 9999"});
                                        $(".mask_ssn").inputmask("999 - 99 - 9999", {
                                            placeholder: " ",
                                            clearMaskOnLostFocus: !0
                                        });
                                        assignFieldValue(clientInfo.serviceProvider, 'serviceProvider');

                                        /** Input Field Value assign. Background Info **/
                                        assignFieldValue(clientInfo.borDecalredBankruptExpln, 'borDecalredBankruptExpln');
                                        assignFieldValue(clientInfo.borActiveLawsuitsExpln, 'borActiveLawsuitsExpln');
                                        assignFieldValue(clientInfo.borOutstandingJudgementsExpln, 'borOutstandingJudgementsExpln');
                                        assignFieldValue(clientInfo.borOutstandingJudgementsExpln, 'borOutstandingJudgementsExpln');
                                        assignFieldValue(clientInfo.borPropertyTaxLiensExpln, 'borPropertyTaxLiensExpln');
                                        assignFieldValue(clientInfo.borObligatedInForeclosureExpln, 'borObligatedInForeclosureExpln');
                                        assignFieldValue(clientInfo.borDelinquentExpln, 'borDelinquentExpln');
                                        assignFieldValue(clientInfo.borOtherFraudRelatedCrimesExpln, 'borOtherFraudRelatedCrimesExpln');
                                        assignFieldValue(clientInfo.borBackgroundExplanation, 'borBackgroundExplanation');

                                        /** Input Field Value assign. Experience Info **/
                                        assignFieldValue(clientInfo.borNoOfFlippingExperience, 'borNoOfFlippingExperience');
                                        assignFieldValue(clientInfo.borNoOfREPropertiesCompleted, 'borNoOfREPropertiesCompleted');
                                        assignFieldValue(clientInfo.borNoOfYearRehabExperience, 'borNoOfYearRehabExperience');
                                        assignFieldValue(clientInfo.borRehabPropCompleted, 'borRehabPropCompleted');
                                        assignFieldValue(clientInfo.borNoOfProSellCompleted, 'borNoOfProSellCompleted');
                                        assignFieldValue(clientInfo.borNoOfProSellExperience, 'borNoOfProSellExperience');
                                        assignFieldValue(clientInfo.borNoOfProjectCurrently, 'borNoOfProjectCurrently');
                                        assignFieldValue(clientInfo.borNoOfProjectCurrently, 'borNoOfProjectCurrently');
                                        assignFieldValue(clientInfo.borNoOfOwnProp, 'borNoOfOwnProp');
                                        assignFieldValue(clientInfo.borClubName, 'borClubName');
                                        assignFieldValue(clientInfo.liquidAssets, 'liquidAssets');
                                        assignFieldValue(clientInfo.borProfLicence, 'borProfLicence');
                                        var mulSelectPrimaryInvestment = [];
                                        try {
                                            mulSelectPrimaryInvestment = clientInfo.borPrimaryInvestmentStrategy.split(',');
                                        } catch (e) {
                                        }
                                        $("#borPrimaryInvestmentStrategy").val(mulSelectPrimaryInvestment).trigger("liszt:updated");

                                        var geographicAreas = [];
                                        try {
                                            geographicAreas = clientInfo.geographicAreas.split(',');
                                        } catch (e) {
                                        }
                                        $("#geographicAreas").val(geographicAreas).trigger("liszt:updated");

                                        checkMultiSelectValueExists('borPrimaryInvestmentStrategy', 'Other', 'borPriInvesStrategyDiv');
                                        assignFieldValue(clientInfo.borPrimaryInvestmentStrategyExplain, 'borPrimaryInvestmentStrategyExplain');

                                        assignFieldValue(clientInfo.amountOfFinancing, 'amountOfFinancing');
                                        assignFieldValue(clientInfo.amountOfFinancingTo, 'amountOfFinancingTo');
                                        assignFieldValue(clientInfo.typicalPurchasePrice, 'typicalPurchasePrice');
                                        assignFieldValue(clientInfo.typicalPurchasePriceTo, 'typicalPurchasePriceTo');
                                        assignFieldValue(clientInfo.typicalConstructionCosts, 'typicalConstructionCosts');
                                        assignFieldValue(clientInfo.typicalConstructionCostsTo, 'typicalConstructionCostsTo');
                                        assignFieldValue(clientInfo.typicalSalePrice, 'typicalSalePrice');
                                        assignFieldValue(clientInfo.typicalSalePriceTo, 'typicalSalePriceTo');

                                        assignFieldValue(clientInfo.constructionDrawsPerProject, 'constructionDrawsPerProject');
                                        assignFieldValue(clientInfo.constructionDrawsPerProjectTo, 'constructionDrawsPerProjectTo');
                                        assignFieldValue(clientInfo.monthsPurchaseDateToFirstConst, 'monthsPurchaseDateToFirstConst');
                                        assignFieldValue(clientInfo.monthsPurchaseDateToFirstConstTo, 'monthsPurchaseDateToFirstConstTo');
                                        assignFieldValue(clientInfo.monthsPurchaseDateUntilConst, 'monthsPurchaseDateUntilConst');
                                        assignFieldValue(clientInfo.monthsPurchaseDateUntilConstTo, 'monthsPurchaseDateUntilConstTo');
                                        assignFieldValue(clientInfo.monthsPurchaseDateToSaleDate, 'monthsPurchaseDateToSaleDate');
                                        assignFieldValue(clientInfo.monthsPurchaseDateToSaleDateTo, 'monthsPurchaseDateToSaleDateTo');
                                        assignFieldValue(clientInfo.NoOfSuchProjects, 'NoOfSuchProjects');
                                        assignFieldValue(clientInfo.NoOfSuchProjectsTo, 'NoOfSuchProjectsTo');

                                        /** Fliping Experience Info **/
                                        if (!jQuery.isEmptyObject(clFlipExp)) {
                                            for (cfe = 0; cfe < clFlipExp.length; cfe++) {
                                                assignFieldValue(clFlipExp[cfe].propertyType, 'borFlipPropType' + cfe);
                                                assignFieldValue(formatDateValue(clFlipExp[cfe].purchaseDate), 'borFlipPurchaseDate' + cfe);
                                                assignFieldValue(autoNumericConverter(clFlipExp[cfe].purchasePrice), 'borFlipPurchasePrice' + cfe);
                                                assignFieldValue(autoNumericConverter(clFlipExp[cfe].amountFinanced), 'borFlipAmountFinanced' + cfe);
                                                assignFieldValue(autoNumericConverter(clFlipExp[cfe].rehabBudget), 'borFlipRehabBudget' + cfe);
                                                assignFieldValue(clFlipExp[cfe].entityName, 'borFlipEntityName' + cfe);
                                                assignFieldValue(autoNumericConverter(clFlipExp[cfe].ownership), 'borFlipOwnership' + cfe);
                                                assignFieldValue(clFlipExp[cfe].exitValues, 'borFlipExit' + cfe);

                                                showHideExitPro(clFlipExp[cfe].exitValues, 'solddiv' + cfe);

                                                assignFieldValue(autoNumericConverter(clFlipExp[cfe].salePrice), 'borFlipSalePrice' + cfe);
                                                assignFieldValue(formatDateValue(clFlipExp[cfe].saleDate), 'borFlipSaleDate' + cfe);
                                                assignFieldValue(autoNumericConverter(clFlipExp[cfe].monthlyRent), 'borFlipMonthlyRent' + cfe);

                                                assignFieldValue(clFlipExp[cfe].address, 'borFlipAddress' + cfe);
                                                assignFieldValue(clFlipExp[cfe].city, 'borFlipCity' + cfe);
                                                assignFieldValue(clFlipExp[cfe].state, 'borFlipState' + cfe);
                                                assignFieldValue(clFlipExp[cfe].zip, 'borFlipZip' + cfe);
                                                assignFieldValue(autoNumericConverter(clFlipExp[cfe].Outcome), 'borOutcomeRE' + cfe);
                                                if (!jQuery.isEmptyObject(clDocs)) {
                                                    var dc = 'HUDDocs' + cfe;
                                                    try {
                                                        var dn = clDocs[dc].docName;
                                                        var dU = clDocs[dc].docUrl;
                                                        var dHUD = "<a href=\"" + dU + "\" target=\"_blank\">" + dn + "</a>"
                                                        if (dHUD != '') $('.FlipDocs_' + cfe).html(dHUD);
                                                    } catch (e) {
                                                    }
                                                }
                                            }
                                        }

                                        var guId = 3;
                                        if (!jQuery.isEmptyObject(clGUExp)) {
                                            for (cfe = 0; cfe < clGUExp.length; cfe++) {
                                                assignFieldValue(clGUExp[cfe].propertyType, 'borGUPropType' + cfe);
                                                assignFieldValue(formatDateValue(clGUExp[cfe].purchaseDate), 'borGUPurchaseDate' + cfe);
                                                assignFieldValue(autoNumericConverter(clGUExp[cfe].purchasePrice), 'borGUPurchasePrice' + cfe);
                                                assignFieldValue(autoNumericConverter(clGUExp[cfe].amountFinanced), 'borGUAmountFinanced' + cfe);
                                                assignFieldValue(autoNumericConverter(clGUExp[cfe].rehabBudget), 'borGURehabBudget' + cfe);
                                                assignFieldValue(clGUExp[cfe].entityName, 'borGUEntityName' + cfe);
                                                assignFieldValue(autoNumericConverter(clGUExp[cfe].ownership), 'borGUOwnership' + cfe);
                                                assignFieldValue(clGUExp[cfe].exitValues, 'borGUExit' + cfe);

                                                showHideExitPro(clGUExp[cfe].exitValues, 'showhideborGUSale' + cfe);

                                                assignFieldValue(autoNumericConverter(clGUExp[cfe].salePrice), 'borGUSalePrice' + cfe);
                                                assignFieldValue(formatDateValue(clGUExp[cfe].saleDate), 'borGUSaleDate' + cfe);
                                                assignFieldValue(autoNumericConverter(clGUExp[cfe].monthlyRent), 'borGUMonthlyRent' + cfe);

                                                assignFieldValue(clGUExp[cfe].address, 'borGUAddress' + cfe);
                                                assignFieldValue(clGUExp[cfe].city, 'borGUCity' + cfe);
                                                assignFieldValue(clGUExp[cfe].state, 'borGUState' + cfe);
                                                assignFieldValue(clGUExp[cfe].zip, 'borGUZip' + cfe);
                                                assignFieldValue(autoNumericConverter(clGUExp[cfe].Outcome), 'borOutcomeRC' + cfe);
                                                if (!jQuery.isEmptyObject(clDocs)) {
                                                    var dc = 'HUDDocs' + guId;
                                                    try {
                                                        var dn = clDocs[dc].docName;
                                                        var dU = clDocs[dc].docUrl;
                                                        var dHUD = "<a href=\"" + dU + "\" target=\"_blank\">" + dn + "</a>"
                                                        if (dHUD != '') $('.GUDocs_' + cfe).html(dHUD);
                                                    } catch (e) {
                                                    }
                                                }
                                                guId++;
                                            }
                                        }

                                        var guId = 6;
                                        if (!jQuery.isEmptyObject(clSellExp)) {
                                            showAndHideborrowerUnderExperience("Yes", 'haveBorSellPropertieDiv');
                                            for (cfe = 0; cfe < clSellExp.length; cfe++) {
                                                assignFieldValue(clSellExp[cfe].propertyType, 'borSellPropType' + cfe);
                                                assignFieldValue(formatDateValue(clSellExp[cfe].purchaseDate), 'borSellPurchaseDate' + cfe);
                                                assignFieldValue(autoNumericConverter(clSellExp[cfe].purchasePrice), 'borSellPurchasePrice' + cfe);
                                                assignFieldValue(autoNumericConverter(clSellExp[cfe].amountFinanced), 'borSellAmountFinanced' + cfe);
                                                assignFieldValue(autoNumericConverter(clSellExp[cfe].rehabBudget), 'borSellRehabBudget' + cfe);
                                                assignFieldValue(clSellExp[cfe].entityName, 'borSellEntityName' + cfe);
                                                assignFieldValue(autoNumericConverter(clSellExp[cfe].ownership), 'borSellOwnership' + cfe);
                                                assignFieldValue(clSellExp[cfe].exitValues, 'borSellExit' + cfe);

                                                showHideSellExitPro(clSellExp[cfe].exitValues, cfe);

                                                assignFieldValue(autoNumericConverter(clSellExp[cfe].salePrice), 'borSellSalePrice' + cfe);
                                                assignFieldValue(formatDateValue(clSellExp[cfe].saleDate), 'borSellSaleDate' + cfe);
                                                assignFieldValue(autoNumericConverter(clSellExp[cfe].monthlyRent), 'borSellMonthlyRent' + cfe);

                                                assignFieldValue(clSellExp[cfe].address, 'borSellAddress' + cfe);
                                                assignFieldValue(clSellExp[cfe].city, 'borSellCity' + cfe);
                                                assignFieldValue(clSellExp[cfe].state, 'borSellState' + cfe);
                                                assignFieldValue(clSellExp[cfe].zip, 'borSellZip' + cfe);
                                                assignFieldValue(autoNumericConverter(clSellExp[cfe].Outcome), 'borOutcomeRC' + cfe);

                                                if (!jQuery.isEmptyObject(clDocs)) {
                                                    var dc = 'HUDDocs' + guId;
                                                    try {
                                                        var dn = clDocs[dc].docName;
                                                        var dU = clDocs[dc].docUrl;
                                                        var dHUD = "<a href=\"" + dU + "\" target=\"_blank\">" + dn + "</a>"
                                                        if (dHUD != '') $('.SellDocs_' + cfe).html(dHUD);
                                                    } catch (e) {
                                                    }
                                                }
                                                guId++;
                                            }
                                        }

                                        if (!jQuery.isEmptyObject(clAssets)) {
                                            assignFieldValue(autoNumericConverter(clAssets.assetCheckingAccounts), 'assetCheckingAccounts');
                                            assignFieldValue(autoNumericConverter(clAssets.assetSavingMoneyMarket), 'assetSavingMoneyMarket');
                                            assignFieldValue(autoNumericConverter(clAssets.assetStocks), 'assetStocks');
                                            assignFieldValue(autoNumericConverter(clAssets.assetIRAAccounts), 'assetIRAAccounts');
                                            assignFieldValue(autoNumericConverter(clAssets.assetESPOAccounts), 'assetESPOAccounts');
                                            assignFieldValue(autoNumericConverter(clAssets.assetHome), 'assetHome');
                                            assignFieldValue(autoNumericConverter(clAssets.assetORE), 'assetORE');
                                            assignFieldValue(autoNumericConverter(clAssets.assetCars), 'assetCars');
                                            assignFieldValue(autoNumericConverter(clAssets.assetLifeInsurance), 'assetLifeInsurance');
                                            assignFieldValue(autoNumericConverter(clAssets.assetOther), 'assetOther');
                                            assignFieldValue(autoNumericConverter(clAssets.assetCash), 'assetCash');
                                            assignFieldValue(autoNumericConverter(clAssets.assetHomeOwed), 'assetHomeOwed');
                                            assignFieldValue(autoNumericConverter(clAssets.assetOREOwed), 'assetOREOwed');
                                            assignFieldValue(autoNumericConverter(clAssets.assetCarsOwed), 'assetCarsOwed');
                                            assignFieldValue(autoNumericConverter(clAssets.otherAmtOwed), 'otherAmtOwed');
                                            assignFieldValue(autoNumericConverter(clAssets.assetTotalCashBankAcc), 'assetTotalCashBankAcc');
                                            assignFieldValue(autoNumericConverter(clAssets.assetTotalRetirementValue), 'assetTotalRetirementValue');
                                            assignFieldValue(autoNumericConverter(clAssets.assetAvailabilityLinesCredit), 'assetAvailabilityLinesCredit');
                                            assignFieldValue(autoNumericConverter(clAssets.assetSR), 'assetSR');
                                            assignFieldValue(autoNumericConverter(clAssets.assetSROwed), 'assetSROwed');
                                            assignFieldValue(autoNumericConverter(clAssets.networthOfBusinessOwned), 'networthOfBusinessOwned');
                                            assignFieldValue(clAssets.otherDesc, 'otherDesc');

                                            assignFieldValue(autoNumericConverter(clAssets.assetAccount), 'assetAccount');
                                            assignFieldValue(autoNumericConverter(clAssets.assetAccountOwd), 'assetAccountOwd');
                                            assignFieldValue(autoNumericConverter(clAssets.assetStocksOwed), 'assetStocksOwed');
                                            assignFieldValue(autoNumericConverter(clAssets.assetNonMarketableSecurities), 'assetNonMarketableSecurities');
                                            assignFieldValue(autoNumericConverter(clAssets.assetNonMarketableSecuritiesOwd), 'assetNonMarketableSecuritiesOwd');
                                            assignFieldValue(autoNumericConverter(clAssets.assetIRAAccountsOwed), 'assetIRAAccountsOwed');
                                            assignFieldValue(autoNumericConverter(clAssets.assetESPOAccountsOwed), 'assetESPOAccountsOwed');
                                            assignFieldValue(autoNumericConverter(clAssets.assetLifeInsuranceOwed), 'assetLifeInsuranceOwed');
                                            assignFieldValue(autoNumericConverter(clAssets.otherAssets), 'otherAssets');
                                            assignFieldValue(autoNumericConverter(clAssets.notesPayableToBanksOthersOwed), 'notesPayableToBanksOthersOwed');
                                            assignFieldValue(autoNumericConverter(clAssets.installmentAccountOwed), 'installmentAccountOwed');
                                            assignFieldValue(autoNumericConverter(clAssets.revolvingDebtOwed), 'revolvingDebtOwed');
                                            assignFieldValue(autoNumericConverter(clAssets.unpaidPayableTaxesOwed), 'unpaidPayableTaxesOwed');
                                            assignFieldValue(autoNumericConverter(clAssets.otherLiabilitiesOwed), 'otherLiabilitiesOwed');

                                            assignFieldValue(clAssets.otherLiabilityDetails, 'otherLiabilityDetails');
                                            assignFieldValue(clAssets.unpaidPayableTaxesDesc, 'unpaidPayableTaxesDesc');

                                            try {
                                                calculateTotalAssets(clAssets.assetCheckingAccounts); // | Assets Calculation.
                                            } catch (e) {
                                            }
                                            try {
                                                calculateTotalAssetsOwed(clAssets.assetCheckingAccounts, 'loanModForm'); // | Assets Owed Calculation.
                                            } catch (e) {
                                            }
                                        }

                                        /** Radio button Value assign for Information for Government Monitoring Purposes **/
                                        try {
                                            if (clientInfo.publishBInfo == 1) $('.BrNo').attr("checked", true);
                                        } catch (e) {
                                        }
                                        try {
                                            if (clientInfo.publishBInfo == 2) $('.BrYes').attr("checked", true);
                                        } catch (e) {
                                        }
                                        try {
                                            if (clientInfo.publishBInfo == 3) $('.BrNA').attr("checked", true);
                                        } catch (e) {
                                        }

                                        try {
                                            //clientInfo.ethnicity
                                            if (clientInfo.ethnicity == 2) {
                                                // $('.BEYes').prop("checked", true);
                                                $('.BEYes').click();
                                                $("input[type='radio'][name='bFiEthnicitySub'][value='" + clientInfo.FIEthnicitySub + "']").click();
                                                if (clientInfo.FIEthnicitySub == 4) {
                                                    $('#bFiEthnicitySubOthertxt').val(clientInfo.FIEthnicitySubOther);
                                                }
                                            }
                                        } catch (e) {
                                        }

                                        try {
                                            if (clientInfo.veteran != '') {
                                                $("input[type='radio'][name='BVeteran'][value='" + clientInfo.veteran + "']").click();
                                            }
                                        } catch (e) {

                                        }

                                        try {
                                            if (clientInfo.ethnicity == 1) $('.BENo').attr("checked", true);
                                        } catch (e) {

                                        }

                                        try {
                                            if (clientInfo.race == 1) $('.BRaceAM').attr("checked", true);
                                        } catch (e) {

                                        }

                                        try {
                                            if (clientInfo.race == 2) {
                                                //$('.BRaceAS').prop("checked", true);
                                                $('.BRaceAS').click();
                                                $("input[type='radio'][name='bFiRaceSub'][value='" + clientInfo.FIRaceSub + "']").click();
                                                if (clientInfo.FIRaceSub == 7) {
                                                    $('#bFiRaceAsianOther').val(clientInfo.FIRaceAsianOther);
                                                }
                                            }
                                        } catch (e) {
                                        }

                                        try {
                                            if (clientInfo.race == 3) $('.BRaceBA').attr("checked", true);
                                        } catch (e) {
                                        }

                                        try {
                                            if (clientInfo.race == 4) {
                                                //$('.BRaceNH').attr("checked", true);
                                                $('.BRaceNH').click();
                                                $("input[type='radio'][name='bFiRaceSub'][value='" + clientInfo.FIRaceSub + "']").click();
                                                if (clientInfo.FIRaceSub == 11) {
                                                    $('#bFiRacePacificOther').val(clientInfo.FIRacePacificOther);
                                                }
                                                // $("input[type='radio'][name='FIRaceSub'][value='"+clientInfo.FIRaceSub+"']").click();
                                            }
                                        } catch (e) {
                                        }

                                        try {
                                            if (clientInfo.race == 5) $('.BRaceW').attr("checked", true);
                                        } catch (e) {
                                        }

                                        try {
                                            if (clientInfo.gender == 2) $('.BGenderM').attr("checked", true);
                                        } catch (e) {
                                        }

                                        try {
                                            if (clientInfo.gender == 1) $('.BGenderF').attr("checked", true);
                                        } catch (e) {
                                        }

                                        try {
                                            //if (clientInfo.FIEthnicity == 'Yes'){
                                            $("input[type='radio'][name='bFiEthnicity'][value='" + clientInfo.FIEthnicity + "']").click();
                                            //  }
                                            // if (clientInfo.FIEthnicity == ''){
                                            //     $("input[type='radio'][name='FIEthnicity'][value='"+clientInfo.FIEthnicity+"']").click();
                                            // }
                                        } catch (e) {
                                        }

                                        try {
                                            $("input[type='radio'][name='bFiSex'][value='" + clientInfo.FISex + "']").click();
                                        } catch (e) {
                                        }

                                        try {
                                            $("input[type='radio'][name='bFiRace'][value='" + clientInfo.FIRace + "']").click();
                                        } catch (e) {
                                        }

                                        try {
                                            $("input[type='radio'][name='bDemoInfo'][value='" + clientInfo.DemoInfo + "']").click();
                                        } catch (e) {
                                        }
                                        /*try {
                                            if (clientInfo.publishBInfo == 1) $('.BrNo').attr("checked", true);
                                        } catch (e) {}
                                        try {
                                            if (clientInfo.publishBInfo == 2) $('.BrYes').attr("checked", true);
                                        } catch (e) {}
                                        try {
                                            if (clientInfo.publishBInfo == 3) $('.BrNA').attr("checked", true);
                                        } catch (e) {}

                                        try {
                                            if (clientInfo.ethnicity == 2) $('.BEYes').attr("checked", true);
                                        } catch (e) {}
                                        try {
                                            if (clientInfo.ethnicity == 1) $('.BENo').attr("checked", true);
                                        } catch (e) {}

                                        try {
                                            if (clientInfo.race == 1) $('.BRaceAM').attr("checked", true);
                                        } catch (e) {}
                                        try {
                                            if (clientInfo.race == 2) $('.BRaceAS').attr("checked", true);
                                        } catch (e) {}
                                        try {
                                            if (clientInfo.race == 3) $('.BRaceBA').attr("checked", true);
                                        } catch (e) {}
                                        try {
                                            if (clientInfo.race == 4) $('.BRaceNH').attr("checked", true);
                                        } catch (e) {}
                                        try {
                                            if (clientInfo.race == 5) $('.BRaceW').attr("checked", true);
                                        } catch (e) {}

                                        try {
                                            if (clientInfo.gender == 2) $('.BGenderM').attr("checked", true);
                                        } catch (e) {}
                                        try {
                                            if (clientInfo.gender == 1) $('.BGenderF').attr("checked", true);
                                        } catch (e) {}*/

                                        if (clientInfo.clientId > 0 && !jQuery.isEmptyObject(entity)) {
                                            $('#borrowerUnderEntityYes').attr("checked", true);
                                            // showAndHideborrowerUnderEntity('Yes', 'showHideborrowerEntity');
                                            if (entity.length == 1) {
                                                $('#entityName').val(entity[0].entityName);
                                                showPCClientEntityInfoForFile(entity[0].CBEID, PCID);
                                            } else {
                                                $("#entityName").click(function () {
                                                    EntityOptions = {
                                                        serviceUrl: siteSSLUrl + 'JQFiles/getAutoCompletedClientEntityInfo.php?PCID=' + PCID + '&autoCID=' + clientInfo.clientId,
                                                        minChars: 0,
                                                        onSelect: function (value, data) {
                                                            $('#entityName').val(value);
                                                            showPCClientEntityInfoForFile(data, PCID);
                                                        }
                                                    };
                                                    $('#entityName').autocomplete(EntityOptions).onValueChange(); // Passing value from matching email Entity Info End..
                                                });
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
                }
            });
        } else {
            $.ajax({
                type: 'POST',
                url: siteSSLUrl + "backoffice/getClientInfo.php",
                data: jQuery.param({
                    'email': email,
                    'PCID': PCID,
                }),
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                success: function (myData) {
                    var obj = $.parseJSON(myData);

                    if (Object.keys(obj).length > 0) {
                        toastrNotification("Fetching Data", 'success');
                    } else {
                        return false;
                    }

                    try {
                        clientInfo = obj.clientInfo; // | Get Client Background, Experience Info.
                    } catch (e) {
                    }
                    try {
                        clFlipExp = obj.clientFlipExpInfo; // | Get Client Flip Experience.
                    } catch (e) {
                    }
                    try {
                        clGUExp = obj.clientGUExpInfo; // | Get Client Background Experience.
                    } catch (e) {
                    }
                    try {
                        clSellExp = obj.clientSellExpInfo; // | Get Client Background Experience.
                    } catch (e) {
                    }
                    try {
                        clDocs = obj.ClientDocs; // | Get Client Documents.
                    } catch (e) {
                    }
                    try {
                        clAssets = obj.clientAssetsInfo; // | Get Client Assets.
                    } catch (e) {
                    }
                    try {
                        entity = obj.entityInfo; // | Get Entity Info.
                    } catch (e) {
                    }

                    if (jQuery.isEmptyObject(clientInfo)) {
                        return true;
                    }
                    /** Radio button Value assign for Background Info **/
                    assignFieldValue(clientInfo.clientId, 'selClientId');
                    checkRadioButton(clientInfo.isBorUSCitizen, 'isBorUSCitizen', 'borOriginAndVisaTR');
                    if (clientInfo.isBorUSCitizen == 'No') {
                        $("input[type='radio'][name='isBorUSCitizen'][value='" + clientInfo.isBorUSCitizen + "']").click();
                        $('#borOrigin').val(clientInfo.borOrigin);
                        $('#borVisaStatus').val(clientInfo.borVisaStatus);
                    }
                    checkRadioButton(clientInfo.isBorDecalredBankruptPastYears, 'isBorDecalredBankruptPastYears', 'borDecalredBankruptTR');
                    checkRadioButton(clientInfo.isAnyBorOutstandingJudgements, 'isAnyBorOutstandingJudgements', 'borOutstandingJudgementsTR');
                    checkRadioButton(clientInfo.hasBorAnyActiveLawsuits, 'hasBorAnyActiveLawsuits', 'borActiveLawsuitsTR');
                    checkRadioButton(clientInfo.hasBorPropertyTaxLiens, 'hasBorPropertyTaxLiens', 'borPropertyTaxLiensTR');
                    checkRadioButton(clientInfo.hasBorObligatedInForeclosure, 'hasBorObligatedInForeclosure', 'borObligatedInForeclosureTR');
                    checkRadioButton(clientInfo.isBorPresenltyDelinquent, 'isBorPresenltyDelinquent', 'borDelinquentTR');
                    checkRadioButton(clientInfo.haveBorOtherFraudRelatedCrimes, 'haveBorOtherFraudRelatedCrimes', 'borOtherFraudRelatedCrimesTR');
                    /** Radio button Value assign for Experience Info **/
                    checkRadioButton(clientInfo.haveBorREInvestmentExperience, 'haveBorREInvestmentExperience', 'borRealEstateInvestmentDiv');
                    checkRadioButton(clientInfo.haveBorRehabConstructionExperience, 'haveBorRehabConstructionExperience', 'borRehabConstructionExperienceDiv');
                    checkRadioButton(clientInfo.haveBorProjectCurrentlyInProgress, 'haveBorProjectCurrentlyInProgress', 'borProjectsCurrentlyProgressDiv');
                    checkRadioButton(clientInfo.haveBorOwnInvestmentProperties, 'haveBorOwnInvestmentProperties', 'borOwnInvestmentPropertiesDiv');
                    checkRadioButton(clientInfo.areBorMemberOfInvestmentClub, 'areBorMemberOfInvestmentClub', 'borMemberOfInvestmentClubDiv');
                    checkRadioButton(clientInfo.haveBorProfLicences, 'haveBorProfLicences', 'borHaveProfLicencesDiv');
                    checkRadioButton(clientInfo.haveBorSellPropertie, 'haveBorSellPropertie', 'haveBorSellPropertieDiv');

                    /** Input Field Value assign. Client Info **/

                    assignFieldValue(clientInfo.clientFName, 'borrowerFName');
                    assignFieldValue(clientInfo.clientFName, 'borrowerName');
                    assignFieldValue(clientInfo.clientLName, 'borrowerLName');
                    assignFieldValue(email, 'borrowerEmail');
                    assignFieldValue(clientInfo.clientSecondaryEmail, 'borrowerSecondaryEmail');
                    assignFieldValue(email, 'orignalborEmail');

                    assignFieldValue(clientInfo.clientPhone, 'phoneNumber');
                    assignFieldValue(clientInfo.clientCell, 'cellNo');
                    assignFieldValue(clientInfo.clientAddress, 'presentAddress');
                    assignFieldValue(clientInfo.clientCity, 'presentCity');
                    assignFieldValue(clientInfo.clientState, 'presentState');
                    assignFieldValue(clientInfo.clientZip, 'presentZip');
                    assignFieldValue(clientInfo.borrowerPOB, 'borrowerPOB');
                    //    assignFieldValue(formatDateValue(clientInfo.borrowerDOB), 'borrowerDOB');
                    //    assignFieldValue(clientInfo.ssnNumber,'ssn');
                    assignFieldValue(clientInfo.driverLicenseState, 'driverLicenseState');
                    assignFieldValue(clientInfo.driverLicenseNumber, 'driverLicenseNumber');
                    assignFieldValue(clientInfo.coBorDriverLicenseState, 'coBorDriverLicenseState');
                    assignFieldValue(clientInfo.coBorDriverLicenseNumber, 'coBorDriverLicenseNumber');

                    var mulSelect = [];
                    try {
                        mulSelect = clientInfo.methodOfContact.split(',');
                    } catch (e) {
                    }

                    $("#methodOfContact").val(mulSelect).trigger("liszt:updated");
                    $("#phoneNumber").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
                    $("#cellNo").inputmask("mask", {mask: "999 - 999 - 9999"});
                    $(".mask_ssn").inputmask("999 - 99 - 9999", {placeholder: " ", clearMaskOnLostFocus: !0});
                    assignFieldValue(clientInfo.serviceProvider, 'serviceProvider');

                    /** Input Field Value assign. Background Info **/
                    assignFieldValue(clientInfo.borDecalredBankruptExpln, 'borDecalredBankruptExpln');
                    assignFieldValue(clientInfo.borActiveLawsuitsExpln, 'borActiveLawsuitsExpln');
                    assignFieldValue(clientInfo.borOutstandingJudgementsExpln, 'borOutstandingJudgementsExpln');
                    assignFieldValue(clientInfo.borOutstandingJudgementsExpln, 'borOutstandingJudgementsExpln');
                    assignFieldValue(clientInfo.borPropertyTaxLiensExpln, 'borPropertyTaxLiensExpln');
                    assignFieldValue(clientInfo.borObligatedInForeclosureExpln, 'borObligatedInForeclosureExpln');
                    assignFieldValue(clientInfo.borDelinquentExpln, 'borDelinquentExpln');
                    assignFieldValue(clientInfo.borOtherFraudRelatedCrimesExpln, 'borOtherFraudRelatedCrimesExpln');
                    assignFieldValue(clientInfo.borBackgroundExplanation, 'borBackgroundExplanation');

                    /** Input Field Value assign. Experience Info **/
                    assignFieldValue(clientInfo.borNoOfFlippingExperience, 'borNoOfFlippingExperience');
                    assignFieldValue(clientInfo.borNoOfREPropertiesCompleted, 'borNoOfREPropertiesCompleted');
                    assignFieldValue(clientInfo.borNoOfYearRehabExperience, 'borNoOfYearRehabExperience');
                    assignFieldValue(clientInfo.borRehabPropCompleted, 'borRehabPropCompleted');
                    assignFieldValue(clientInfo.borNoOfProSellCompleted, 'borNoOfProSellCompleted');
                    assignFieldValue(clientInfo.borNoOfProSellExperience, 'borNoOfProSellExperience');
                    assignFieldValue(clientInfo.borNoOfProjectCurrently, 'borNoOfProjectCurrently');
                    assignFieldValue(clientInfo.borNoOfProjectCurrently, 'borNoOfProjectCurrently');
                    assignFieldValue(clientInfo.borNoOfOwnProp, 'borNoOfOwnProp');
                    assignFieldValue(clientInfo.borClubName, 'borClubName');
                    assignFieldValue(clientInfo.liquidAssets, 'liquidAssets');
                    assignFieldValue(clientInfo.borProfLicence, 'borProfLicence');
                    var mulSelectPrimaryInvestment = [];
                    try {
                        mulSelectPrimaryInvestment = clientInfo.borPrimaryInvestmentStrategy.split(',');
                    } catch (e) {
                    }
                    $("#borPrimaryInvestmentStrategy").val(mulSelectPrimaryInvestment).trigger("liszt:updated");

                    var geographicAreas = [];
                    try {
                        geographicAreas = clientInfo.geographicAreas.split(',');
                    } catch (e) {
                    }
                    $("#geographicAreas").val(geographicAreas).trigger("liszt:updated");

                    checkMultiSelectValueExists('borPrimaryInvestmentStrategy', 'Other', 'borPriInvesStrategyDiv');
                    assignFieldValue(clientInfo.borPrimaryInvestmentStrategyExplain, 'borPrimaryInvestmentStrategyExplain');

                    assignFieldValue(clientInfo.amountOfFinancing, 'amountOfFinancing');
                    assignFieldValue(clientInfo.amountOfFinancingTo, 'amountOfFinancingTo');
                    assignFieldValue(clientInfo.typicalPurchasePrice, 'typicalPurchasePrice');
                    assignFieldValue(clientInfo.typicalPurchasePriceTo, 'typicalPurchasePriceTo');
                    assignFieldValue(clientInfo.typicalConstructionCosts, 'typicalConstructionCosts');
                    assignFieldValue(clientInfo.typicalConstructionCostsTo, 'typicalConstructionCostsTo');
                    assignFieldValue(clientInfo.typicalSalePrice, 'typicalSalePrice');
                    assignFieldValue(clientInfo.typicalSalePriceTo, 'typicalSalePriceTo');

                    assignFieldValue(clientInfo.constructionDrawsPerProject, 'constructionDrawsPerProject');
                    assignFieldValue(clientInfo.constructionDrawsPerProjectTo, 'constructionDrawsPerProjectTo');
                    assignFieldValue(clientInfo.monthsPurchaseDateToFirstConst, 'monthsPurchaseDateToFirstConst');
                    assignFieldValue(clientInfo.monthsPurchaseDateToFirstConstTo, 'monthsPurchaseDateToFirstConstTo');
                    assignFieldValue(clientInfo.monthsPurchaseDateUntilConst, 'monthsPurchaseDateUntilConst');
                    assignFieldValue(clientInfo.monthsPurchaseDateUntilConstTo, 'monthsPurchaseDateUntilConstTo');
                    assignFieldValue(clientInfo.monthsPurchaseDateToSaleDate, 'monthsPurchaseDateToSaleDate');
                    assignFieldValue(clientInfo.monthsPurchaseDateToSaleDateTo, 'monthsPurchaseDateToSaleDateTo');
                    assignFieldValue(clientInfo.NoOfSuchProjects, 'NoOfSuchProjects');
                    assignFieldValue(clientInfo.NoOfSuchProjectsTo, 'NoOfSuchProjectsTo');

                    /** Fliping Experience Info **/
                    if (!jQuery.isEmptyObject(clFlipExp)) {
                        for (cfe = 0; cfe < clFlipExp.length; cfe++) {
                            assignFieldValue(clFlipExp[cfe].propertyType, 'borFlipPropType' + cfe);
                            assignFieldValue(formatDateValue(clFlipExp[cfe].purchaseDate), 'borFlipPurchaseDate' + cfe);
                            assignFieldValue(autoNumericConverter(clFlipExp[cfe].purchasePrice), 'borFlipPurchasePrice' + cfe);
                            assignFieldValue(autoNumericConverter(clFlipExp[cfe].amountFinanced), 'borFlipAmountFinanced' + cfe);
                            assignFieldValue(autoNumericConverter(clFlipExp[cfe].rehabBudget), 'borFlipRehabBudget' + cfe);
                            assignFieldValue(clFlipExp[cfe].entityName, 'borFlipEntityName' + cfe);
                            assignFieldValue(autoNumericConverter(clFlipExp[cfe].ownership), 'borFlipOwnership' + cfe);
                            assignFieldValue(clFlipExp[cfe].exitValues, 'borFlipExit' + cfe);

                            showHideExitPro(clFlipExp[cfe].exitValues, 'solddiv' + cfe);

                            assignFieldValue(autoNumericConverter(clFlipExp[cfe].salePrice), 'borFlipSalePrice' + cfe);
                            assignFieldValue(formatDateValue(clFlipExp[cfe].saleDate), 'borFlipSaleDate' + cfe);
                            assignFieldValue(autoNumericConverter(clFlipExp[cfe].monthlyRent), 'borFlipMonthlyRent' + cfe);

                            assignFieldValue(clFlipExp[cfe].address, 'borFlipAddress' + cfe);
                            assignFieldValue(clFlipExp[cfe].city, 'borFlipCity' + cfe);
                            assignFieldValue(clFlipExp[cfe].state, 'borFlipState' + cfe);
                            assignFieldValue(clFlipExp[cfe].zip, 'borFlipZip' + cfe);
                            assignFieldValue(autoNumericConverter(clFlipExp[cfe].Outcome), 'borOutcomeRE' + cfe);
                            if (!jQuery.isEmptyObject(clDocs)) {
                                var dc = 'HUDDocs' + cfe;
                                try {
                                    var dn = clDocs[dc].docName;
                                    var dU = clDocs[dc].docUrl;
                                    var dHUD = "<a href=\"" + dU + "\" target=\"_blank\">" + dn + "</a>"
                                    if (dHUD != '') $('.FlipDocs_' + cfe).html(dHUD);
                                } catch (e) {
                                }
                            }
                        }
                    }

                    var guId = 3;
                    if (!jQuery.isEmptyObject(clGUExp)) {
                        for (cfe = 0; cfe < clGUExp.length; cfe++) {
                            assignFieldValue(clGUExp[cfe].propertyType, 'borGUPropType' + cfe);
                            assignFieldValue(formatDateValue(clGUExp[cfe].purchaseDate), 'borGUPurchaseDate' + cfe);
                            assignFieldValue(autoNumericConverter(clGUExp[cfe].purchasePrice), 'borGUPurchasePrice' + cfe);
                            assignFieldValue(autoNumericConverter(clGUExp[cfe].amountFinanced), 'borGUAmountFinanced' + cfe);
                            assignFieldValue(autoNumericConverter(clGUExp[cfe].rehabBudget), 'borGURehabBudget' + cfe);
                            assignFieldValue(clGUExp[cfe].entityName, 'borGUEntityName' + cfe);
                            assignFieldValue(autoNumericConverter(clGUExp[cfe].ownership), 'borGUOwnership' + cfe);
                            assignFieldValue(clGUExp[cfe].exitValues, 'borGUExit' + cfe);

                            showHideExitPro(clGUExp[cfe].exitValues, 'showhideborGUSale' + cfe);

                            assignFieldValue(autoNumericConverter(clGUExp[cfe].salePrice), 'borGUSalePrice' + cfe);
                            assignFieldValue(formatDateValue(clGUExp[cfe].saleDate), 'borGUSaleDate' + cfe);
                            assignFieldValue(autoNumericConverter(clGUExp[cfe].monthlyRent), 'borGUMonthlyRent' + cfe);

                            assignFieldValue(clGUExp[cfe].address, 'borGUAddress' + cfe);
                            assignFieldValue(clGUExp[cfe].city, 'borGUCity' + cfe);
                            assignFieldValue(clGUExp[cfe].state, 'borGUState' + cfe);
                            assignFieldValue(clGUExp[cfe].zip, 'borGUZip' + cfe);
                            assignFieldValue(autoNumericConverter(clGUExp[cfe].Outcome), 'borOutcomeRC' + cfe);
                            if (!jQuery.isEmptyObject(clDocs)) {
                                var dc = 'HUDDocs' + guId;
                                try {
                                    var dn = clDocs[dc].docName;
                                    var dU = clDocs[dc].docUrl;
                                    var dHUD = "<a href=\"" + dU + "\" target=\"_blank\">" + dn + "</a>"
                                    if (dHUD != '') $('.GUDocs_' + cfe).html(dHUD);
                                } catch (e) {
                                }
                            }
                            guId++;
                        }
                    }

                    var guId = 6;
                    if (!jQuery.isEmptyObject(clSellExp)) {
                        showAndHideborrowerUnderExperience("Yes", 'haveBorSellPropertieDiv');
                        for (cfe = 0; cfe < clSellExp.length; cfe++) {
                            assignFieldValue(clSellExp[cfe].propertyType, 'borSellPropType' + cfe);
                            assignFieldValue(formatDateValue(clSellExp[cfe].purchaseDate), 'borSellPurchaseDate' + cfe);
                            assignFieldValue(autoNumericConverter(clSellExp[cfe].purchasePrice), 'borSellPurchasePrice' + cfe);
                            assignFieldValue(autoNumericConverter(clSellExp[cfe].amountFinanced), 'borSellAmountFinanced' + cfe);
                            assignFieldValue(autoNumericConverter(clSellExp[cfe].rehabBudget), 'borSellRehabBudget' + cfe);
                            assignFieldValue(clSellExp[cfe].entityName, 'borSellEntityName' + cfe);
                            assignFieldValue(autoNumericConverter(clSellExp[cfe].ownership), 'borSellOwnership' + cfe);
                            assignFieldValue(clSellExp[cfe].exitValues, 'borSellExit' + cfe);

                            showHideSellExitPro(clSellExp[cfe].exitValues, cfe);

                            assignFieldValue(autoNumericConverter(clSellExp[cfe].salePrice), 'borSellSalePrice' + cfe);
                            assignFieldValue(formatDateValue(clSellExp[cfe].saleDate), 'borSellSaleDate' + cfe);
                            assignFieldValue(autoNumericConverter(clSellExp[cfe].monthlyRent), 'borSellMonthlyRent' + cfe);

                            assignFieldValue(clSellExp[cfe].address, 'borSellAddress' + cfe);
                            assignFieldValue(clSellExp[cfe].city, 'borSellCity' + cfe);
                            assignFieldValue(clSellExp[cfe].state, 'borSellState' + cfe);
                            assignFieldValue(clSellExp[cfe].zip, 'borSellZip' + cfe);
                            assignFieldValue(autoNumericConverter(clSellExp[cfe].Outcome), 'borOutcomeRC' + cfe);

                            if (!jQuery.isEmptyObject(clDocs)) {
                                var dc = 'HUDDocs' + guId;
                                try {
                                    var dn = clDocs[dc].docName;
                                    var dU = clDocs[dc].docUrl;
                                    var dHUD = "<a href=\"" + dU + "\" target=\"_blank\">" + dn + "</a>"
                                    if (dHUD != '') $('.SellDocs_' + cfe).html(dHUD);
                                } catch (e) {
                                }
                            }
                            guId++;
                        }
                    }

                    if (!jQuery.isEmptyObject(clAssets)) {
                        assignFieldValue(autoNumericConverter(clAssets.assetCheckingAccounts), 'assetCheckingAccounts');
                        assignFieldValue(autoNumericConverter(clAssets.assetSavingMoneyMarket), 'assetSavingMoneyMarket');
                        assignFieldValue(autoNumericConverter(clAssets.assetStocks), 'assetStocks');
                        assignFieldValue(autoNumericConverter(clAssets.assetIRAAccounts), 'assetIRAAccounts');
                        assignFieldValue(autoNumericConverter(clAssets.assetESPOAccounts), 'assetESPOAccounts');
                        assignFieldValue(autoNumericConverter(clAssets.assetHome), 'assetHome');
                        assignFieldValue(autoNumericConverter(clAssets.assetORE), 'assetORE');
                        assignFieldValue(autoNumericConverter(clAssets.assetCars), 'assetCars');
                        assignFieldValue(autoNumericConverter(clAssets.assetLifeInsurance), 'assetLifeInsurance');
                        assignFieldValue(autoNumericConverter(clAssets.assetOther), 'assetOther');
                        assignFieldValue(autoNumericConverter(clAssets.assetCash), 'assetCash');
                        assignFieldValue(autoNumericConverter(clAssets.assetHomeOwed), 'assetHomeOwed');
                        assignFieldValue(autoNumericConverter(clAssets.assetOREOwed), 'assetOREOwed');
                        assignFieldValue(autoNumericConverter(clAssets.assetCarsOwed), 'assetCarsOwed');
                        assignFieldValue(autoNumericConverter(clAssets.otherAmtOwed), 'otherAmtOwed');
                        assignFieldValue(autoNumericConverter(clAssets.assetTotalCashBankAcc), 'assetTotalCashBankAcc');
                        assignFieldValue(autoNumericConverter(clAssets.assetTotalRetirementValue), 'assetTotalRetirementValue');
                        assignFieldValue(autoNumericConverter(clAssets.assetAvailabilityLinesCredit), 'assetAvailabilityLinesCredit');
                        assignFieldValue(autoNumericConverter(clAssets.assetSR), 'assetSR');
                        assignFieldValue(autoNumericConverter(clAssets.assetSROwed), 'assetSROwed');
                        assignFieldValue(autoNumericConverter(clAssets.networthOfBusinessOwned), 'networthOfBusinessOwned');
                        assignFieldValue(clAssets.otherDesc, 'otherDesc');

                        assignFieldValue(autoNumericConverter(clAssets.assetAccount), 'assetAccount');
                        assignFieldValue(autoNumericConverter(clAssets.assetAccountOwd), 'assetAccountOwd');
                        assignFieldValue(autoNumericConverter(clAssets.assetStocksOwed), 'assetStocksOwed');
                        assignFieldValue(autoNumericConverter(clAssets.assetNonMarketableSecurities), 'assetNonMarketableSecurities');
                        assignFieldValue(autoNumericConverter(clAssets.assetNonMarketableSecuritiesOwd), 'assetNonMarketableSecuritiesOwd');
                        assignFieldValue(autoNumericConverter(clAssets.assetIRAAccountsOwed), 'assetIRAAccountsOwed');
                        assignFieldValue(autoNumericConverter(clAssets.assetESPOAccountsOwed), 'assetESPOAccountsOwed');
                        assignFieldValue(autoNumericConverter(clAssets.assetLifeInsuranceOwed), 'assetLifeInsuranceOwed');
                        assignFieldValue(autoNumericConverter(clAssets.otherAssets), 'otherAssets');
                        assignFieldValue(autoNumericConverter(clAssets.notesPayableToBanksOthersOwed), 'notesPayableToBanksOthersOwed');
                        assignFieldValue(autoNumericConverter(clAssets.installmentAccountOwed), 'installmentAccountOwed');
                        assignFieldValue(autoNumericConverter(clAssets.revolvingDebtOwed), 'revolvingDebtOwed');
                        assignFieldValue(autoNumericConverter(clAssets.unpaidPayableTaxesOwed), 'unpaidPayableTaxesOwed');
                        assignFieldValue(autoNumericConverter(clAssets.otherLiabilitiesOwed), 'otherLiabilitiesOwed');

                        assignFieldValue(clAssets.otherLiabilityDetails, 'otherLiabilityDetails');
                        assignFieldValue(clAssets.unpaidPayableTaxesDesc, 'unpaidPayableTaxesDesc');

                        try {
                            calculateTotalAssets(clAssets.assetCheckingAccounts); // | Assets Calculation.
                        } catch (e) {
                        }
                        try {
                            calculateTotalAssetsOwed(clAssets.assetCheckingAccounts, 'loanModForm'); // | Assets Owed Calculation.
                        } catch (e) {
                        }
                    }

                    /** Radio button Value assign for Information for Government Monitoring Purposes **/
                    try {
                        if (clientInfo.publishBInfo == 1) $('.BrNo').attr("checked", true);
                    } catch (e) {
                    }
                    try {
                        if (clientInfo.publishBInfo == 2) $('.BrYes').attr("checked", true);
                    } catch (e) {
                    }
                    try {
                        if (clientInfo.publishBInfo == 3) $('.BrNA').attr("checked", true);
                    } catch (e) {
                    }

                    try {
                        //clientInfo.ethnicity
                        if (clientInfo.ethnicity == 2) {
                            // $('.BEYes').prop("checked", true);
                            $('.BEYes').click();
                            $("input[type='radio'][name='bFiEthnicitySub'][value='" + clientInfo.FIEthnicitySub + "']").click();
                            if (clientInfo.FIEthnicitySub == 4) {
                                $('#bFiEthnicitySubOthertxt').val(clientInfo.FIEthnicitySubOther);
                            }
                        }
                    } catch (e) {
                    }

                    try {
                        if (clientInfo.veteran != '') {
                            $("input[type='radio'][name='BVeteran'][value='" + clientInfo.veteran + "']").click();
                        }
                    } catch (e) {

                    }

                    try {
                        if (clientInfo.ethnicity == 1) $('.BENo').attr("checked", true);
                    } catch (e) {

                    }

                    try {
                        if (clientInfo.race == 1) $('.BRaceAM').attr("checked", true);
                    } catch (e) {

                    }

                    try {
                        if (clientInfo.race == 2) {
                            //$('.BRaceAS').prop("checked", true);
                            $('.BRaceAS').click();
                            $("input[type='radio'][name='bFiRaceSub'][value='" + clientInfo.FIRaceSub + "']").click();
                            if (clientInfo.FIRaceSub == 7) {
                                $('#bFiRaceAsianOther').val(clientInfo.FIRaceAsianOther);
                            }
                        }
                    } catch (e) {
                    }

                    try {
                        if (clientInfo.race == 3) $('.BRaceBA').attr("checked", true);
                    } catch (e) {
                    }

                    try {
                        if (clientInfo.race == 4) {
                            //$('.BRaceNH').attr("checked", true);
                            $('.BRaceNH').click();
                            $("input[type='radio'][name='bFiRaceSub'][value='" + clientInfo.FIRaceSub + "']").click();
                            if (clientInfo.FIRaceSub == 11) {
                                $('#bFiRacePacificOther').val(clientInfo.FIRacePacificOther);
                            }
                            // $("input[type='radio'][name='FIRaceSub'][value='"+clientInfo.FIRaceSub+"']").click();
                        }
                    } catch (e) {
                    }

                    try {
                        if (clientInfo.race == 5) $('.BRaceW').attr("checked", true);
                    } catch (e) {
                    }

                    try {
                        if (clientInfo.gender == 2) $('.BGenderM').attr("checked", true);
                    } catch (e) {
                    }

                    try {
                        if (clientInfo.gender == 1) $('.BGenderF').attr("checked", true);
                    } catch (e) {
                    }

                    try {
                        //if (clientInfo.FIEthnicity == 'Yes'){
                        $("input[type='radio'][name='bFiEthnicity'][value='" + clientInfo.FIEthnicity + "']").click();
                        //  }
                        // if (clientInfo.FIEthnicity == ''){
                        //     $("input[type='radio'][name='FIEthnicity'][value='"+clientInfo.FIEthnicity+"']").click();
                        // }
                    } catch (e) {
                    }

                    try {
                        $("input[type='radio'][name='bFiSex'][value='" + clientInfo.FISex + "']").click();
                    } catch (e) {
                    }

                    try {
                        $("input[type='radio'][name='bFiRace'][value='" + clientInfo.FIRace + "']").click();
                    } catch (e) {
                    }

                    try {
                        $("input[type='radio'][name='bDemoInfo'][value='" + clientInfo.DemoInfo + "']").click();
                    } catch (e) {
                    }
                    /*try {
                        if (clientInfo.publishBInfo == 1) $('.BrNo').attr("checked", true);
                    } catch (e) {}
                    try {
                        if (clientInfo.publishBInfo == 2) $('.BrYes').attr("checked", true);
                    } catch (e) {}
                    try {
                        if (clientInfo.publishBInfo == 3) $('.BrNA').attr("checked", true);
                    } catch (e) {}

                    try {
                        if (clientInfo.ethnicity == 2) $('.BEYes').attr("checked", true);
                    } catch (e) {}
                    try {
                        if (clientInfo.ethnicity == 1) $('.BENo').attr("checked", true);
                    } catch (e) {}

                    try {
                        if (clientInfo.race == 1) $('.BRaceAM').attr("checked", true);
                    } catch (e) {}
                    try {
                        if (clientInfo.race == 2) $('.BRaceAS').attr("checked", true);
                    } catch (e) {}
                    try {
                        if (clientInfo.race == 3) $('.BRaceBA').attr("checked", true);
                    } catch (e) {}
                    try {
                        if (clientInfo.race == 4) $('.BRaceNH').attr("checked", true);
                    } catch (e) {}
                    try {
                        if (clientInfo.race == 5) $('.BRaceW').attr("checked", true);
                    } catch (e) {}

                    try {
                        if (clientInfo.gender == 2) $('.BGenderM').attr("checked", true);
                    } catch (e) {}
                    try {
                        if (clientInfo.gender == 1) $('.BGenderF').attr("checked", true);
                    } catch (e) {}*/

                    if (clientInfo.clientId > 0 && !jQuery.isEmptyObject(entity)) {
                        $('#borrowerUnderEntityYes').attr("checked", true);
                        // showAndHideborrowerUnderEntity('Yes', 'showHideborrowerEntity');
                        if (entity.length == 1) {
                            $('#entityName').val(entity[0].entityName);
                            showPCClientEntityInfoForFile(entity[0].CBEID, PCID);
                        } else {
                            $("#entityName").click(function () {
                                EntityOptions = {
                                    serviceUrl: siteSSLUrl + 'JQFiles/getAutoCompletedClientEntityInfo.php?PCID=' + PCID + '&autoCID=' + clientInfo.clientId,
                                    minChars: 0,
                                    onSelect: function (value, data) {
                                        $('#entityName').val(value);
                                        showPCClientEntityInfoForFile(data, PCID);
                                    }
                                };
                                $('#entityName').autocomplete(EntityOptions).onValueChange(); // Passing value from matching email Entity Info End..
                            });
                        }
                    }


                }
            });
        }


    } else {
        $.ajax({
            type: 'POST',
            url: siteSSLUrl + "backoffice/getClientInfo.php",
            data: jQuery.param({'email': email, 'PCID': PCID, 'CID': CID}),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (myData) {
                var obj = $.parseJSON(myData);
                try {
                    clientInfo = obj.clientInfo; // | Get Client Background, Experience Info.
                } catch (e) {
                }
                try {
                    clFlipExp = obj.clientFlipExpInfo; // | Get Client Flip Experience.
                } catch (e) {
                }
                try {
                    clGUExp = obj.clientGUExpInfo; // | Get Client Background Experience.
                } catch (e) {
                }
                try {
                    clSellExp = obj.clientSellExpInfo; // | Get Client Background Experience.
                } catch (e) {
                }
                try {
                    clDocs = obj.ClientDocs; // | Get Client Documents.
                } catch (e) {
                }
                try {
                    clAssets = obj.clientAssetsInfo; // | Get Client Assets.
                } catch (e) {
                }
                try {
                    entity = obj.entityInfo; // | Get Entity Info.
                } catch (e) {
                }

                if (LMRID > 0) {
                    if (jQuery.isEmptyObject(clientInfo)) {
                        // clear all the borrower data
                        $('#selClientId').val('');
                        $('#orignalborEmail').val('');
                        $('input[name=encryptedCId]').val('');
                        //if( $('#isBorrowermailEdited').val() == '') { clearBorrowerData(email); }
                        if ($('#isBorrowermailEdited').val() == 'edit') {
                            $('#isBorrowermailEdited').val('edited');
                        }
                    } else {
                        if ($("#borrowerEmail").attr('readonly') != 'readonly') {
                            confirmObject = {
                                icon: 'fas fa-info-circle text-primary icon-xl',
                                closeIcon: true,
                                columnClass: 'col-md-8',
                                title: 'Alert',
                                content: '<b>This Borrower Email already exists, do you want to import the data?</b>',
                                type: 'red',
                                backgroundDismiss: true,
                                buttons: {}
                            };
                            confirmObject.buttons["Yes"] = {
                                btnClass: 'btn-green', // class for the button
                                btnId: 'confirmBtnEditBorrower',
                                btnName: 'confirmBtnEditBorrower',
                                keys: ['enter', 'a'], // keyboard event for button
                                isHidden: false, // initially not hidden
                                isDisabled: false, // initially not disabled
                                action: function (confirmBtnEditBorrower) {
                                    assignBorrowerInfo(clientInfo, clFlipExp, clGUExp, clSellExp, clAssets, email, clDocs, LMRID, PCID, entity);
                                    if ($('#isBorrowermailEdited').val() == 'edit') {
                                        $('#isBorrowermailEdited').val('edited');
                                    }
                                }
                            };
                            confirmObject.buttons["No"] = {
                                btnClass: 'btn-danger', // class for the button
                                btnId: 'cancelBtnEditBorrower',
                                btnName: 'cancelBtnEditBorrower',
                                keys: ['enter', 'a'], // keyboard event for button
                                isHidden: false, // initially not hidden
                                isDisabled: false, // initially not disabled
                                action: function (cancelBtnEditBorrower) {
                                    $('#borrowerEmail').val('');
                                    $('#selClientId').val('');
                                    $('#orignalborEmail').val('');
                                    $('input[name=encryptedCId]').val('');
                                }
                            };
                            $.confirm(confirmObject);
                            /*  var $toast = toastConfimBoxForBorroweredit('success', '');
                            if ($toast.find('#confirmBtnEditBorrower').length) {
                                $toast.delegate('#confirmBtnEditBorrower', 'click', function () {
                                    // assign new borrower data
                                    $toast.remove();
                                    setTimeout(function () {

                                    }, 100);
                                });
                            }*/
                        }
                    }
                } else {
                    if (jQuery.isEmptyObject(clientInfo)) {
                        $('#selClientId').val('');
                        $('#orignalborEmail').val('');
                        $('input[name=encryptedCId]').val('');
                        //clearBorrowerData(email);
                        return true;
                    } else {

                        //toastr.clear();
                        // msgType = 'success';

                        /*      toastr.options = {
                            "positionClass": "toast-center-center",
                            "closeButton": true,
                            "showDuration": "100000",
                            "hideDuration": "100000",
                            "timeOut": "2800",
                            "extendedTimeOut": "100000",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut",
                            "allowHtml": true,
                        }*/

                        if (PCID != 3138) {
                            // var $toast = toastConfimBox('success', 'Would you like to import basic information for this borrower?');
                            confirmObject = {
                                icon: 'fas fa-info-circle text-primary icon-xl',
                                closeIcon: true,
                                columnClass: 'col-md-8',
                                title: 'Alert',
                                content: '<b>Would you like to import basic information for this borrower?</b>',
                                type: 'red',
                                backgroundDismiss: true,
                                buttons: {}
                            };
                            confirmObject.buttons["Yes"] = {
                                btnClass: 'btn-blue', // class for the button
                                btnId: 'confirmBtn',
                                btnName: 'confirmBtn',
                                isHidden: false, // initially not hidden
                                isDisabled: false, // initially not disabled
                                action: function (confirmBtn) {
                                    removeClientEntityInfo();
                                    assignBorrowerInfo(clientInfo, clFlipExp, clGUExp, clSellExp, clAssets, email, clDocs, LMRID, PCID, entity);
                                }
                            };
                            confirmObject.buttons["No"] = {
                                btnClass: 'btn-danger', // class for the button
                                btnId: 'cancelBtn',
                                btnName: 'cancelBtn',
                                isHidden: false, // initially not hidden
                                isDisabled: false, // initially not disabled
                                action: function (cancelBtn) {
                                    $('#borrowerEmail').val('');
                                    $('#selClientId').val('');
                                    $('#orignalborEmail').val('');
                                    $('input[name=encryptedCId]').val('');
                                }
                            };
                            $.confirm(confirmObject);

                        } else {
                            assignFieldValue(clientInfo.clientId, 'selClientId');
                            assignFieldValue(email, 'orignalborEmail')
                        }

                        /*         if ($toast.find('#confirmBtn').length) {
                            $toast.delegate('#confirmBtn', 'click', function () {
                                $toast.remove();
                                setTimeout(function () {

                                }, 100);
                            });
                        }

                        if ($toast.find('#cancelBtn').length) {
                            $toast.delegate('#cancelBtn', 'click', function (event) {
                                event.preventDefault();
                                $('#borrowerEmail').val('');
                                $('#selClientId').val('');
                                $('#orignalborEmail').val('');
                                $('input[name=encryptedCId]').val('');
                            });
                        }*/

                    } // Object Empty Check End..
                }//new file
            }
        });

    }
}


function assignBorrowerInfo(clientInfo, clFlipExp, clGUExp, clSellExp, clAssets, email, clDocs, LMRID, PCID, entity) {
    /** Radio button Value assign for Background Info **/
    assignFieldValue(clientInfo.clientId, 'selClientId');
    //if(LMRID > 0) {$('input[name=encryptedCId]').val(clientInfo.encryptedCId); }
    checkRadioButton(clientInfo.isBorUSCitizen, 'isBorUSCitizen', 'borOriginAndVisaTR');
    if (clientInfo.isBorUSCitizen == 'No') {
        $("input[type='radio'][name='isBorUSCitizen'][value='" + clientInfo.isBorUSCitizen + "']").click();
        $('#borOrigin').val(clientInfo.borOrigin);
        $('#borVisaStatus').val(clientInfo.borVisaStatus);
    }


    checkRadioButton(clientInfo.isBorDecalredBankruptPastYears, 'isBorDecalredBankruptPastYears', 'borDecalredBankruptTR');
    checkRadioButton(clientInfo.isAnyBorOutstandingJudgements, 'isAnyBorOutstandingJudgements', 'borOutstandingJudgementsTR');
    checkRadioButton(clientInfo.hasBorAnyActiveLawsuits, 'hasBorAnyActiveLawsuits', 'borActiveLawsuitsTR');
    checkRadioButton(clientInfo.hasBorPropertyTaxLiens, 'hasBorPropertyTaxLiens', 'borPropertyTaxLiensTR');
    checkRadioButton(clientInfo.hasBorObligatedInForeclosure, 'hasBorObligatedInForeclosure', 'borObligatedInForeclosureTR');
    checkRadioButton(clientInfo.isBorPresenltyDelinquent, 'isBorPresenltyDelinquent', 'borDelinquentTR');
    checkRadioButton(clientInfo.haveBorOtherFraudRelatedCrimes, 'haveBorOtherFraudRelatedCrimes', 'borOtherFraudRelatedCrimesTR');

    /** Radio button Value assign for Experience Info **/
    checkRadioButton(clientInfo.haveBorREInvestmentExperience, 'haveBorREInvestmentExperience', 'borRealEstateInvestmentDiv');
    checkRadioButton(clientInfo.haveBorRehabConstructionExperience, 'haveBorRehabConstructionExperience', 'borRehabConstructionExperienceDiv');
    checkRadioButton(clientInfo.haveBorProjectCurrentlyInProgress, 'haveBorProjectCurrentlyInProgress', 'borProjectsCurrentlyProgressDiv');
    checkRadioButton(clientInfo.haveBorOwnInvestmentProperties, 'haveBorOwnInvestmentProperties', 'borOwnInvestmentPropertiesDiv');
    checkRadioButton(clientInfo.areBorMemberOfInvestmentClub, 'areBorMemberOfInvestmentClub', 'borMemberOfInvestmentClubDiv');
    checkRadioButton(clientInfo.haveBorProfLicences, 'haveBorProfLicences', 'borHaveProfLicencesDiv');
    checkRadioButton(clientInfo.haveBorSellPropertie, 'haveBorSellPropertie', 'haveBorSellPropertieDiv');
    checkRadioButton(clientInfo.fullTimeRealEstateInvestor, 'fullTimeRealEstateInvestor', '');

    /** Input Field Value assign. Client Info **/
    assignFieldValue(clientInfo.clientFName, 'borrowerFName');
    assignFieldValue(clientInfo.clientFName, 'borrowerName');
    assignFieldValue(clientInfo.clientLName, 'borrowerLName');
    assignFieldValue(email, 'borrowerEmail');
    assignFieldValue(clientInfo.clientSecondaryEmail, 'borrowerSecondaryEmail');
    assignFieldValue(email, 'orignalborEmail');

    assignFieldValue(clientInfo.clientPhone, 'phoneNumber');
    assignFieldValue(clientInfo.clientCell, 'cellNo');
    assignFieldValue(clientInfo.clientAddress, 'presentAddress');
    assignFieldValue(clientInfo.clientCity, 'presentCity');
    assignFieldValue(clientInfo.clientState, 'presentState');
    assignFieldValue(clientInfo.clientZip, 'presentZip');
    assignFieldValue(formatDateValue(clientInfo.borrowerDOB), 'borrowerDOB');
    assignFieldValue(clientInfo.ssnNumber, 'ssn');
    assignFieldValue(clientInfo.borrowerPOB, 'borrowerPOB');
    assignFieldValue(clientInfo.driverLicenseState, 'driverLicenseState');
    assignFieldValue(clientInfo.driverLicenseNumber, 'driverLicenseNumber');
    assignFieldValue(clientInfo.coBorDriverLicenseState, 'coBorDriverLicenseState');
    assignFieldValue(clientInfo.coBorDriverLicenseState, 'coBorDriverLicenseState');
    assignFieldValue(clientInfo.borLicenseNo, 'borLicenseNo');
    assignFieldValue(clientInfo.overallRealEstateInvesExp, 'overallRealEstateInvesExp');
    var mulSelect = [];
    try {
        mulSelect = clientInfo.methodOfContact.split(',');
    } catch (e) {
    }

    $("#methodOfContact").val(mulSelect).trigger("chosen:updated");
    $("#phoneNumber").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
    $("#cellNo").inputmask("mask", {mask: "999 - 999 - 9999"});
    $(".mask_date").inputmask("mm/dd/yyyy", {autoUnmask: !0});
    $(".mask_phone").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
    $(".mask_home_phone").inputmask("mask", {mask: "999 - 999 - 9999"});
    $(".mask_cell").inputmask("mask", {mask: "999 - 999 - 9999"});
    $(".mask_ssn").inputmask("999 - 99 - 9999", {
        placeholder: "___ - __ - ____",
        clearMaskOnLostFocus: !0
    });
    assignFieldValue(clientInfo.serviceProvider, 'serviceProvider');

    /** Input Field Value assign. Background Info **/
    assignFieldValue(clientInfo.borDecalredBankruptExpln, 'borDecalredBankruptExpln');
    assignFieldValue(clientInfo.borActiveLawsuitsExpln, 'borActiveLawsuitsExpln');
    assignFieldValue(clientInfo.borOutstandingJudgementsExpln, 'borOutstandingJudgementsExpln');
    assignFieldValue(clientInfo.borOutstandingJudgementsExpln, 'borOutstandingJudgementsExpln');
    assignFieldValue(clientInfo.borPropertyTaxLiensExpln, 'borPropertyTaxLiensExpln');
    assignFieldValue(clientInfo.borObligatedInForeclosureExpln, 'borObligatedInForeclosureExpln');
    assignFieldValue(clientInfo.borDelinquentExpln, 'borDelinquentExpln');
    assignFieldValue(clientInfo.borOtherFraudRelatedCrimesExpln, 'borOtherFraudRelatedCrimesExpln');
    assignFieldValue(clientInfo.borBackgroundExplanation, 'borBackgroundExplanation');

    /** Input Field Value assign. Experience Info **/
    assignFieldValue(clientInfo.borNoOfFlippingExperience, 'borNoOfFlippingExperience');
    assignFieldValue(clientInfo.borNoOfREPropertiesCompleted, 'borNoOfREPropertiesCompleted');
    assignFieldValue(clientInfo.borNoOfYearRehabExperience, 'borNoOfYearRehabExperience');
    assignFieldValue(clientInfo.borNoOfProSellCompleted, 'borNoOfProSellCompleted');
    assignFieldValue(clientInfo.borNoOfProSellExperience, 'borNoOfProSellExperience');
    assignFieldValue(clientInfo.borRehabPropCompleted, 'borRehabPropCompleted');
    assignFieldValue(clientInfo.borNoOfProjectCurrently, 'borNoOfProjectCurrently');
    assignFieldValue(clientInfo.borNoOfProjectCurrently, 'borNoOfProjectCurrently');
    assignFieldValue(clientInfo.borNoOfOwnProp, 'borNoOfOwnProp');
    assignFieldValue(clientInfo.borClubName, 'borClubName');
    assignFieldValue(clientInfo.liquidAssets, 'liquidAssets');
    assignFieldValue(clientInfo.borProfLicence, 'borProfLicence');
    var mulSelectPrimaryInvestment = [];
    try {
        mulSelectPrimaryInvestment = clientInfo.borPrimaryInvestmentStrategy.split(',');
    } catch (e) {
    }
    $("#borPrimaryInvestmentStrategy").val(mulSelectPrimaryInvestment).trigger("chosen:updated");

    var geographicAreas = [];
    try {
        geographicAreas = clientInfo.geographicAreas.split(',');
    } catch (e) {
    }
    $("#geographicAreas").val(geographicAreas).trigger("chosen:updated");

    checkMultiSelectValueExists('borPrimaryInvestmentStrategy', 'Other', 'borPriInvesStrategyDiv');
    assignFieldValue(clientInfo.borPrimaryInvestmentStrategyExplain, 'borPrimaryInvestmentStrategyExplain');

    assignFieldValue(clientInfo.amountOfFinancing, 'amountOfFinancing');
    assignFieldValue(clientInfo.amountOfFinancingTo, 'amountOfFinancingTo');
    assignFieldValue(clientInfo.typicalPurchasePrice, 'typicalPurchasePrice');
    assignFieldValue(clientInfo.typicalPurchasePriceTo, 'typicalPurchasePriceTo');
    assignFieldValue(clientInfo.typicalConstructionCosts, 'typicalConstructionCosts');
    assignFieldValue(clientInfo.typicalConstructionCostsTo, 'typicalConstructionCostsTo');
    assignFieldValue(clientInfo.typicalSalePrice, 'typicalSalePrice');
    assignFieldValue(clientInfo.typicalSalePriceTo, 'typicalSalePriceTo');

    assignFieldValue(clientInfo.constructionDrawsPerProject, 'constructionDrawsPerProject');
    assignFieldValue(clientInfo.constructionDrawsPerProjectTo, 'constructionDrawsPerProjectTo');
    assignFieldValue(clientInfo.monthsPurchaseDateToFirstConst, 'monthsPurchaseDateToFirstConst');
    assignFieldValue(clientInfo.monthsPurchaseDateToFirstConstTo, 'monthsPurchaseDateToFirstConstTo');
    assignFieldValue(clientInfo.monthsPurchaseDateUntilConst, 'monthsPurchaseDateUntilConst');
    assignFieldValue(clientInfo.monthsPurchaseDateUntilConstTo, 'monthsPurchaseDateUntilConstTo');
    assignFieldValue(clientInfo.monthsPurchaseDateToSaleDate, 'monthsPurchaseDateToSaleDate');
    assignFieldValue(clientInfo.monthsPurchaseDateToSaleDateTo, 'monthsPurchaseDateToSaleDateTo');
    assignFieldValue(clientInfo.NoOfSuchProjects, 'NoOfSuchProjects');
    assignFieldValue(clientInfo.NoOfSuchProjectsTo, 'NoOfSuchProjectsTo');

    /** Fliping Experience Info **/
    if (!jQuery.isEmptyObject(clFlipExp)) {
        for (cfe = 0; cfe < clFlipExp.length; cfe++) {
            assignFieldValue(clFlipExp[cfe].propertyType, 'borFlipPropType' + cfe);
            assignFieldValue(formatDateValue(clFlipExp[cfe].purchaseDate), 'borFlipPurchaseDate' + cfe);
            assignFieldValue(autoNumericConverter(clFlipExp[cfe].purchasePrice), 'borFlipPurchasePrice' + cfe);
            assignFieldValue(autoNumericConverter(clFlipExp[cfe].amountFinanced), 'borFlipAmountFinanced' + cfe);
            assignFieldValue(autoNumericConverter(clFlipExp[cfe].rehabBudget), 'borFlipRehabBudget' + cfe);
            assignFieldValue(clFlipExp[cfe].entityName, 'borFlipEntityName' + cfe);
            assignFieldValue(autoNumericConverter(clFlipExp[cfe].ownership), 'borFlipOwnership' + cfe);
            assignFieldValue(clFlipExp[cfe].exitValues, 'borFlipExit' + cfe);

            showHideExitPro(clFlipExp[cfe].exitValues, 'solddiv' + cfe);

            assignFieldValue(autoNumericConverter(clFlipExp[cfe].salePrice), 'borFlipSalePrice' + cfe);
            assignFieldValue(formatDateValue(clFlipExp[cfe].saleDate), 'borFlipSaleDate' + cfe);
            assignFieldValue(autoNumericConverter(clFlipExp[cfe].monthlyRent), 'borFlipMonthlyRent' + cfe);

            assignFieldValue(clFlipExp[cfe].address, 'borFlipAddress' + cfe);
            assignFieldValue(clFlipExp[cfe].city, 'borFlipCity' + cfe);
            assignFieldValue(clFlipExp[cfe].state, 'borFlipState' + cfe);
            assignFieldValue(clFlipExp[cfe].zip, 'borFlipZip' + cfe);
            assignFieldValue(autoNumericConverter(clFlipExp[cfe].Outcome), 'borOutcomeRE' + cfe);
            if (!jQuery.isEmptyObject(clDocs)) {
                var dc = 'HUDDocs' + cfe;
                try {
                    var dn = clDocs[dc].docName;
                    var dU = clDocs[dc].docUrl;
                    var dHUD = "<a href=\"" + dU + "\" target=\"_blank\">" + dn + "</a>"
                    if (dHUD != '') $('.FlipDocs_' + cfe).html(dHUD);
                } catch (e) {
                }
            }
        }
    }

    var guId = 3;
    if (!jQuery.isEmptyObject(clGUExp)) {
        for (cfe = 0; cfe < clGUExp.length; cfe++) {
            assignFieldValue(clGUExp[cfe].propertyType, 'borGUPropType' + cfe);
            assignFieldValue(formatDateValue(clGUExp[cfe].purchaseDate), 'borGUPurchaseDate' + cfe);
            assignFieldValue(autoNumericConverter(clGUExp[cfe].purchasePrice), 'borGUPurchasePrice' + cfe);
            assignFieldValue(autoNumericConverter(clGUExp[cfe].amountFinanced), 'borGUAmountFinanced' + cfe);
            assignFieldValue(autoNumericConverter(clGUExp[cfe].rehabBudget), 'borGURehabBudget' + cfe);
            assignFieldValue(clGUExp[cfe].entityName, 'borGUEntityName' + cfe);
            assignFieldValue(autoNumericConverter(clGUExp[cfe].ownership), 'borGUOwnership' + cfe);
            assignFieldValue(clGUExp[cfe].exitValues, 'borGUExit' + cfe);

            showHideExitPro(clGUExp[cfe].exitValues, 'showhideborGUSale' + cfe);

            assignFieldValue(autoNumericConverter(clGUExp[cfe].salePrice), 'borGUSalePrice' + cfe);
            assignFieldValue(formatDateValue(clGUExp[cfe].saleDate), 'borGUSaleDate' + cfe);
            assignFieldValue(autoNumericConverter(clGUExp[cfe].monthlyRent), 'borGUMonthlyRent' + cfe);

            assignFieldValue(clGUExp[cfe].address, 'borGUAddress' + cfe);
            assignFieldValue(clGUExp[cfe].city, 'borGUCity' + cfe);
            assignFieldValue(clGUExp[cfe].state, 'borGUState' + cfe);
            assignFieldValue(clGUExp[cfe].zip, 'borGUZip' + cfe);
            assignFieldValue(autoNumericConverter(clGUExp[cfe].Outcome), 'borOutcomeRC' + cfe);
            if (!jQuery.isEmptyObject(clDocs)) {
                var dc = 'HUDDocs' + guId;
                try {
                    var dn = clDocs[dc].docName;
                    var dU = clDocs[dc].docUrl;
                    var dHUD = "<a href=\"" + dU + "\" target=\"_blank\">" + dn + "</a>"
                    if (dHUD != '') $('.GUDocs_' + cfe).html(dHUD);
                } catch (e) {
                }
            }
            guId++;
        }
    }

    var guId = 6;
    if (!jQuery.isEmptyObject(clSellExp)) {
        showAndHideborrowerUnderExperience("Yes", 'haveBorSellPropertieDiv');
        for (cfe = 0; cfe < clSellExp.length; cfe++) {
            assignFieldValue(clSellExp[cfe].propertyType, 'borSellPropType' + cfe);
            assignFieldValue(formatDateValue(clSellExp[cfe].purchaseDate), 'borSellPurchaseDate' + cfe);
            assignFieldValue(autoNumericConverter(clSellExp[cfe].purchasePrice), 'borSellPurchasePrice' + cfe);
            assignFieldValue(autoNumericConverter(clSellExp[cfe].amountFinanced), 'borSellAmountFinanced' + cfe);
            assignFieldValue(autoNumericConverter(clSellExp[cfe].rehabBudget), 'borSellRehabBudget' + cfe);
            assignFieldValue(clSellExp[cfe].entityName, 'borSellEntityName' + cfe);
            assignFieldValue(autoNumericConverter(clSellExp[cfe].ownership), 'borSellOwnership' + cfe);
            assignFieldValue(clSellExp[cfe].exitValues, 'borSellExit' + cfe);

            showHideSellExitPro(clSellExp[cfe].exitValues, cfe);

            assignFieldValue(autoNumericConverter(clSellExp[cfe].salePrice), 'borSellSalePrice' + cfe);
            assignFieldValue(formatDateValue(clSellExp[cfe].saleDate), 'borSellSaleDate' + cfe);
            assignFieldValue(autoNumericConverter(clSellExp[cfe].monthlyRent), 'borSellMonthlyRent' + cfe);

            assignFieldValue(clSellExp[cfe].address, 'borSellAddress' + cfe);
            assignFieldValue(clSellExp[cfe].city, 'borSellCity' + cfe);
            assignFieldValue(clSellExp[cfe].state, 'borSellState' + cfe);
            assignFieldValue(clSellExp[cfe].zip, 'borSellZip' + cfe);
            assignFieldValue(autoNumericConverter(clSellExp[cfe].Outcome), 'borOutcomeRC' + cfe);

            if (!jQuery.isEmptyObject(clDocs)) {
                var dc = 'HUDDocs' + guId;
                try {
                    var dn = clDocs[dc].docName;
                    var dU = clDocs[dc].docUrl;
                    var dHUD = "<a href=\"" + dU + "\" target=\"_blank\">" + dn + "</a>"
                    if (dHUD != '') $('.SellDocs_' + cfe).html(dHUD);
                } catch (e) {
                }
            }
            guId++;
        }
    }

    if (!jQuery.isEmptyObject(clAssets)) {
        assignFieldValue(autoNumericConverter(clAssets.assetCheckingAccounts), 'assetCheckingAccounts');
        assignFieldValue(autoNumericConverter(clAssets.assetSavingMoneyMarket), 'assetSavingMoneyMarket');
        assignFieldValue(autoNumericConverter(clAssets.assetStocks), 'assetStocks');
        assignFieldValue(autoNumericConverter(clAssets.assetIRAAccounts), 'assetIRAAccounts');
        assignFieldValue(autoNumericConverter(clAssets.assetESPOAccounts), 'assetESPOAccounts');
        assignFieldValue(autoNumericConverter(clAssets.assetHome), 'assetHome');
        assignFieldValue(autoNumericConverter(clAssets.assetORE), 'assetORE');
        assignFieldValue(autoNumericConverter(clAssets.assetCars), 'assetCars');
        assignFieldValue(autoNumericConverter(clAssets.assetLifeInsurance), 'assetLifeInsurance');
        assignFieldValue(autoNumericConverter(clAssets.assetOther), 'assetOther');
        assignFieldValue(autoNumericConverter(clAssets.assetCash), 'assetCash');
        assignFieldValue(autoNumericConverter(clAssets.assetHomeOwed), 'assetHomeOwed');
        assignFieldValue(autoNumericConverter(clAssets.assetOREOwed), 'assetOREOwed');
        assignFieldValue(autoNumericConverter(clAssets.assetCarsOwed), 'assetCarsOwed');
        assignFieldValue(autoNumericConverter(clAssets.otherAmtOwed), 'otherAmtOwed');
        assignFieldValue(autoNumericConverter(clAssets.assetTotalCashBankAcc), 'assetTotalCashBankAcc');
        assignFieldValue(autoNumericConverter(clAssets.assetTotalRetirementValue), 'assetTotalRetirementValue');
        assignFieldValue(autoNumericConverter(clAssets.assetAvailabilityLinesCredit), 'assetAvailabilityLinesCredit');
        assignFieldValue(autoNumericConverter(clAssets.assetSR), 'assetSR');
        assignFieldValue(autoNumericConverter(clAssets.assetSROwed), 'assetSROwed');
        assignFieldValue(autoNumericConverter(clAssets.networthOfBusinessOwned), 'networthOfBusinessOwned');
        assignFieldValue(clAssets.otherDesc, 'otherDesc');

        assignFieldValue(autoNumericConverter(clAssets.assetAccount), 'assetAccount');
        assignFieldValue(autoNumericConverter(clAssets.assetAccountOwd), 'assetAccountOwd');
        assignFieldValue(autoNumericConverter(clAssets.assetStocksOwed), 'assetStocksOwed');
        assignFieldValue(autoNumericConverter(clAssets.assetNonMarketableSecurities), 'assetNonMarketableSecurities');
        assignFieldValue(autoNumericConverter(clAssets.assetNonMarketableSecuritiesOwd), 'assetNonMarketableSecuritiesOwd');
        assignFieldValue(autoNumericConverter(clAssets.assetIRAAccountsOwed), 'assetIRAAccountsOwed');
        assignFieldValue(autoNumericConverter(clAssets.assetESPOAccountsOwed), 'assetESPOAccountsOwed');
        assignFieldValue(autoNumericConverter(clAssets.assetLifeInsuranceOwed), 'assetLifeInsuranceOwed');
        assignFieldValue(autoNumericConverter(clAssets.otherAssets), 'otherAssets');
        assignFieldValue(autoNumericConverter(clAssets.notesPayableToBanksOthersOwed), 'notesPayableToBanksOthersOwed');
        assignFieldValue(autoNumericConverter(clAssets.installmentAccountOwed), 'installmentAccountOwed');
        assignFieldValue(autoNumericConverter(clAssets.revolvingDebtOwed), 'revolvingDebtOwed');
        assignFieldValue(autoNumericConverter(clAssets.unpaidPayableTaxesOwed), 'unpaidPayableTaxesOwed');
        assignFieldValue(autoNumericConverter(clAssets.otherLiabilitiesOwed), 'otherLiabilitiesOwed');

        assignFieldValue(clAssets.otherLiabilityDetails, 'otherLiabilityDetails');
        assignFieldValue(clAssets.unpaidPayableTaxesDesc, 'unpaidPayableTaxesDesc');


        try {
            calculateTotalAssets(clAssets.assetCheckingAccounts); // | Assets Calculation.
        } catch (e) {
        }
        try {
            calculateTotalAssetsOwed(clAssets.assetCheckingAccounts, 'loanModForm'); // | Assets Owed Calculation.
        } catch (e) {
        }
    }

    /** Radio button Value assign for Information for Government Monitoring Purposes **/
    try {
        if (clientInfo.publishBInfo == 1) $('.BrNo').attr("checked", true);
    } catch (e) {
    }
    try {
        if (clientInfo.publishBInfo == 2) $('.BrYes').attr("checked", true);
    } catch (e) {
    }
    try {
        if (clientInfo.publishBInfo == 3) $('.BrNA').attr("checked", true);
    } catch (e) {
    }

    try {
        //clientInfo.ethnicity
        if (clientInfo.ethnicity == 2) {
            // $('.BEYes').prop("checked", true);
            $('.BEYes').click();
            $("input[type='radio'][name='bFiEthnicitySub'][value='" + clientInfo.FIEthnicitySub + "']").click();
            if (clientInfo.FIEthnicitySub == 4) {
                $('#bFiEthnicitySubOthertxt').val(clientInfo.FIEthnicitySubOther);
            }
        }
    } catch (e) {
    }

    try {
        if (clientInfo.veteran != '') {
            $("input[type='radio'][name='BVeteran'][value='" + clientInfo.veteran + "']").click();
        }
    } catch (e) {

    }

    try {
        if (clientInfo.ethnicity == 1) $('.BENo').attr("checked", true);
    } catch (e) {

    }

    try {
        if (clientInfo.race == 1) $('.BRaceAM').attr("checked", true);
    } catch (e) {

    }

    try {
        if (clientInfo.race == 2) {
            //$('.BRaceAS').prop("checked", true);
            $('.BRaceAS').click();
            $("input[type='radio'][name='bFiRaceSub'][value='" + clientInfo.FIRaceSub + "']").click();
            if (clientInfo.FIRaceSub == 7) {
                $('#bFiRaceAsianOther').val(clientInfo.FIRaceAsianOther);
            }
        }
    } catch (e) {
    }

    try {
        if (clientInfo.race == 3) $('.BRaceBA').attr("checked", true);
    } catch (e) {
    }

    try {
        if (clientInfo.race == 4) {
            //$('.BRaceNH').attr("checked", true);
            $('.BRaceNH').click();
            $("input[type='radio'][name='bFiRaceSub'][value='" + clientInfo.FIRaceSub + "']").click();
            if (clientInfo.FIRaceSub == 11) {
                $('#bFiRacePacificOther').val(clientInfo.FIRacePacificOther);
            }
            // $("input[type='radio'][name='FIRaceSub'][value='"+clientInfo.FIRaceSub+"']").click();
        }
    } catch (e) {
    }

    try {
        if (clientInfo.race == 5) $('.BRaceW').attr("checked", true);
    } catch (e) {
    }

    try {
        if (clientInfo.gender == 2) $('.BGenderM').attr("checked", true);
    } catch (e) {
    }

    try {
        if (clientInfo.gender == 1) $('.BGenderF').attr("checked", true);
    } catch (e) {
    }
    try {
        //if (clientInfo.FIEthnicity == 'Yes'){
        $("input[type='radio'][name='bFiEthnicity'][value='" + clientInfo.FIEthnicity + "']").click();
        //  }
        // if (clientInfo.FIEthnicity == ''){
        //     $("input[type='radio'][name='FIEthnicity'][value='"+clientInfo.FIEthnicity+"']").click();
        // }
    } catch (e) {
    }

    try {
        $("input[type='radio'][name='bFiSex'][value='" + clientInfo.FISex + "']").click();
    } catch (e) {
    }

    try {
        $("input[type='radio'][name='bFiRace'][value='" + clientInfo.FIRace + "']").click();
    } catch (e) {
    }

    try {
        $("input[type='radio'][name='bDemoInfo'][value='" + clientInfo.DemoInfo + "']").click();
    } catch (e) {
    }


    if (clientInfo.clientId > 0 && !jQuery.isEmptyObject(entity)) {
        $('#borrowerUnderEntityYes').attr("checked", true);
        //showAndHideborrowerUnderEntity('Yes', 'showHideborrowerEntity');
        if (entity.length == 1) {
            $('#entityName').val(entity[0].entityName);
            showPCClientEntityInfoForFile(entity[0].CBEID, PCID);
        } else {
            $("#entityName").click(function () {
                EntityOptions = {
                    serviceUrl: siteSSLUrl + 'JQFiles/getAutoCompletedClientEntityInfo.php?PCID=' + PCID + '&autoCID=' + clientInfo.clientId,
                    minChars: 0,
                    onSelect: function (value, data) {
                        $('#entityName').val(value);
                        showPCClientEntityInfoForFile(data, PCID);
                    }
                };
                $('#entityName').autocomplete(EntityOptions).onValueChange(); // Passing value from matching email Entity Info End..

            });
            if ($('#borrowerUnderEntityYes').val() == 'Yes') { /* populate all the entites on loading while creating new file */
                $("#entityName").click();
            }
        }
    }

}

function involvedPurchaseHideShow(val, tarSec, tyOpt) {
    if (val == 'Yes') {
        if (tyOpt == 'TR') {
            $('.' + tarSec).css("display", "table-cell");
        } else {
            $('.' + tarSec).show();
        }
    } else {
        $('.' + tarSec).hide();
    }
}


function formatDateValue(dVal) {
    newDate = '';
    if (dVal != '' && dVal != null) {
        var d = dVal.split("-");
        newDate = d[1] + "/" + d[2] + "/" + d[0];
    }
    return newDate;
}

function validatePercentage(fld) {
    var x = parseFloat(fld.value);
    if (isNaN(x) || x < 0 || x > 100) {
        toastrNotification("Please Enter Values from 0 to 100", 'error');
        $(fld).val('');
        $(fld).focus();
    }
}

function getAvailableLoanNo(encPCID) {
    $.ajax({
        type: 'POST',
        url: siteSSLUrl + "backoffice/getAvailableLoanNo.php",
        data: jQuery.param({'encPCID': encPCID}),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (loanNumber) {
            $('#loanNumber').val(loanNumber);
        }
    });
    $('#getLoanNo').hide();
    enableSaveButton();
}


function deleteClientLOScheduleRealInfo(CID, CLOSRID, delRealInfoId, Opt) {
    //  $('.with-children-tip > *').hideTip();
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
                    var delCnt = 0,
                        url = "",
                        qstr = "";
                    url = "../backoffice/deleteClientLOScheduleRealInfo.php";
                    qstr = "CLOSRID=" + CLOSRID + "&Opt=" + Opt;
                    try {
                        xmlDoc = getXMLDoc(url, qstr);
                    } catch (e) {
                    }
                    try {
                        delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
                    } catch (e) {
                    }
                    if (delCnt == 1) {
                        $("#" + delRealInfoId).remove();

                        var fields = $('.realInfoCnt');
                        var count = 1;
                        $.each(fields, function () {
                            //$(this).html('<h4>Schedule of Real Estate Info : ' + count + '</h4>');
                            count++;
                        });

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

function checkMultiSelectValueExists(fldId, selVal, targetFld) {
    var action = 0;
    $('#' + fldId + ' option:selected').each(function (index, valor) {
        if (selVal == valor.value) {
            action++;
        }
    });

    if (action > 0) {

        try {
            $('#' + targetFld).removeClass('subSecDa');
        } catch (e) {
        }

        $('#' + targetFld).show();
    } else {
        $('#' + targetFld).hide();
    }
}

function checkRef(val) {
    if (val.toLowerCase() == 'other') {
        try {
            $('#refDiv').show();
        } catch (e) {
        }
    } else {
        try {
            $('#refDiv').hide();
        } catch (e) {
        }
    }
}


function autoPopulateACTMailingAddress() {
    var opt = document.loanModForm.mAddressSwitchValueCheck.value;
    if (opt == 1) {
        try {
            document.loanModForm.ACTHolderAddr.value = document.loanModForm.mailingAddress1.value;
        } catch (e) {
        }
        try {
            document.loanModForm.ACTHolderCity.value = document.loanModForm.mailingCity1.value;
        } catch (e) {
        }
        try {
            document.loanModForm.ACTHolderState.value = document.loanModForm.mailingState1.value;
        } catch (e) {
        }
        try {
            document.loanModForm.ACTHolderZip.value = document.loanModForm.mailingZip1.value;
        } catch (e) {
        }
    } else {
        clearACTAddress();
    }
}

function clearACTAddress() {
    try {
        document.loanModForm.ACTHolderAddr.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.ACTHolderCity.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.ACTHolderState.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.ACTHolderZip.value = "";
    } catch (e) {
    }
}

function autoPopulateMailingAddressAsCC() {
    var opt = document.loanModForm.mAddressSwitchValueCard.value;
    if (opt == 1) {
        try {
            document.loanModForm.CCAddress.value = document.loanModForm.mailingAddress1.value;
        } catch (e) {
        }
        try {
            document.loanModForm.CCCity.value = document.loanModForm.mailingCity1.value;
        } catch (e) {
        }
        try {
            document.loanModForm.CCState.value = document.loanModForm.mailingState1.value;
        } catch (e) {
        }
        try {
            document.loanModForm.CCZip.value = document.loanModForm.mailingZip1.value;
        } catch (e) {
        }
    } else {
        clearMailingAddressAsCC();
    }
}

function clearMailingAddressAsCC() {
    try {
        document.loanModForm.CCAddress.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.CCCity.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.CCState.value = "";
    } catch (e) {
    }
    try {
        document.loanModForm.CCZip.value = "";
    } catch (e) {
    }
}

function cloneSectionsInit(tabIndex, mainSec, innerSec, cloneId, drawsFee) {
    var LMRId = $('#encryptedLId').val();
    var curDate = $('#curDate').val();
    var curDateMMDDYYYY = $('#curDateMMDDYYYY').val();
    var fLMRId = $('#fLMRId').val();

    $.ajax({
        type: 'POST',
        url: siteSSLUrl + "backoffice/saveBudgetAndDraws.php",
        data: jQuery.param({'encryptedLId': LMRId, 'ajax': 1}),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (BDID) {

            // $('.with-children-tip > *').hideTip();
            rowObj = $("#" + cloneId).clone(true);
            //$( "."+mainSec ).append(rowObj);

            var idCnt = 0;
            var nCnt = 1;
            clear_form_elements();
            jQuery(rowObj).find(':input').each(function (i) {
                switch (this.type) {
                    case 'password':
                    case 'text':
                    case 'textarea':
                    case 'file':
                    case 'select-one':
                    case 'select-multiple':
                    case 'date':
                    case 'number':
                    case 'tel':
                    case 'email':
                    case 'hidden':
                        $(this).val('');
                        break;
                    case 'checkbox':
                    case 'radio':
                        this.checked = false;
                        break;
                }
            });
            try {
                userRole = $('#userRole').val();
                if (userRole == 'Client' || userRole == 'Branch') {
                    $(rowObj).find('.displayNoneForClient').html('');
                }
            } catch (e) {

            }

            $(rowObj).find('.dropZoneSec').html("<div class=\"dropzone\" id=\"dropzone_" + BDID + "\" title=\"Upload Draw Details, Pics, Invoices, etc...\"></div>");
            jQuery(rowObj).find(':input').each(function (i) {
                var idArr = [];
                $(this).attr('tabindex', tabIndex);
                var elmId = this.id;
                idArr = elmId.split('_');
                $(this).attr('id', idArr[0] + "_" + BDID);
            });
// sc24532
            jQuery(rowObj).find('.calenderApply')
                .removeClass('hasDatepicker')
                .addClass('newCalendaerApply')
                .removeData('datepicker')
                .unbind()
                .datepicker({
                    autoclose: true,
                    dateFormat: "mm/dd/yy",
                    changeMonth: true,
                    changeYear: true,
                    maxDate: new Date(),
                    showButtonPanel: false,
                    beforeShow: function () {
                        setTimeout(function () {
                            $('.ui-datepicker').css('z-index', 99999999999999);

                        }, 0);
                    }
                });
// end of sc24532

            //            form-control input-sm mask_date

            jQuery(rowObj).find('.BDIDClass').each(function (i) {
                if ($(this).val() == '') {
                    $(this).val(BDID);
                }
            });
            var ks = 0;
            /*
                jQuery('.'+innerSec).each(function(i) {
                    k = '';
                    if(i > 0) k = "_"+i;

                    $(this).find('.dateRequested').removeClass('dateRequested').addClass('dateRequested'+k);
                    $(".dateRequested"+k+", #dateRequested"+k).click(function() {
                        $('#dateRequested'+k).datepicker({changeMonth: true, changeYear: true, dateFormat: 'mm/dd/yy', yearRange: '-94:'+(new Date).getFullYear()}).focus();
                    });

                    $(this).find('.dateFunded').removeClass('dateFunded').addClass('dateFunded'+k);
                    $(".dateFunded"+k+", #dateFunded"+k).click(function() {
                        $('#dateFunded'+k).datepicker({changeMonth: true, changeYear: true, dateFormat: 'mm/dd/yy', yearRange: '-94:'+(new Date).getFullYear()}).focus();
                    });
                });*/
            jQuery(rowObj).find('.calendarDateRequested').val(curDateMMDDYYYY);
            $("." + mainSec).append(rowObj);
            $('#drawsFee_' + BDID).val(drawsFee);
            var ks = 0;
            jQuery("." + innerSec).each(function (i) {

                if (i != 0) {
                    $(this).attr('id', innerSec + "_" + i);
                    $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removeCloneSec('" + innerSec + "_" + i + "', '" + mainSec + "', '" + innerSec + "', '" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                        "   title=\"Click to remove this row\">\n" +
                        "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                        "</a>");
                } else {
                    $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removeCloneSec('" + innerSec + "', '" + mainSec + "', '" + innerSec + "','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                        "   title=\"Click to remove this row\">\n" +
                        "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                        "</a>");
                }
                if (($('.' + innerSec).length - 1) == ks) {
                    $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"cloneSectionsInit('" + tabIndex + "', '" + mainSec + "', '" + innerSec + "', '" + innerSec + "','" + drawsFee + "')\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                        "   title=\"Click to add  new row\">\n" +
                        "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
                        "</a><a href=\"javascript:void(0)\" onclick=\"removeCloneSec('" + innerSec + "_" + i + "', '" + mainSec + "', '" + innerSec + "','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                        "   title=\"Click to remove this row\">\n" +
                        "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                        "</a>");
                }
                ks++;
                if (i % 2 == 1) {
                    $(this).addClass('even');
                } else {
                    $(this).removeClass('even');
                }
            });
            jQuery(".nmCnt").each(function (i) {
                $(this).html((i + 1) + ")");
            });
            $(".mask_date").inputmask("mm/dd/yyyy", {autoUnmask: !0});
            // $('.with-tip, .with-children-tip > *').tip();

            /* Dropzone Upload Script */


            /* Enable Save Button on Any Auto complete. */
            try {
                enableSaveButton();
            } catch (e) {
            }


            $('.newCalendaerApply').each(function (i) {
                console.log(this.id);
                $('#' + this.id).datepicker({
                    changeMonth: true,
                    changeYear: true,
                    dateFormat: 'mm/dd/yy',
                    yearRange: '-94:' + (new Date).getFullYear()
                });
            });

            Dropzone.autoDiscover = false;
            var myDropzone = new Dropzone("#dropzone_" + BDID, {
                url: siteSSLUrl + "backoffice/uploadDrawRequest.php",
                params: {'LMRId': fLMRId, 'BDID': BDID},
                maxFilesize: 20,
                maxFiles: 10,
                acceptedFiles: "image/*,application/pdf, application/x-download, application/x-pdf, application/force-download, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/x-zip-compressed, application/excel, application/vnd.ms-excel, application/octet-stream, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                success: function (file, progress, bytesSent) {

                }
            });

        } // Success End...
    });
}

function removeCloneSec(rSec, mainSec, innerSec, tabIndex, drawsFee) {
    // $('.with-children-tip > *').hideTip();

    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: "Are you sure want to delete this Draw Requests?",
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            yes: {
                btnClass: 'btn-green',
                action: function () {

                    if (rSec == innerSec) {
                        jQuery("#" + rSec).find(':input').each(function (i) {
                            switch (this.type) {
                                case 'password':
                                case 'text':
                                case 'textarea':
                                case 'file':
                                case 'select-one':
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
                    } else {
                        $('#' + rSec).remove();
                        var idCnt = 0;
                        var nCnt = 1;
                        jQuery('.' + innerSec).find(':input').each(function (i) {
                            if (6 < i) {
                                var idArr = [];
                                $(this).attr('tabindex', tabIndex);
                                var elmId = this.id;
                                idArr = elmId.split('_');
                                $(this).attr('id', idArr[0] + "_" + idArr[1]);
                            }
                            if (nCnt == 7) {
                                idCnt++;
                                nCnt = 0;
                            }
                            nCnt++;
                        });

                    }

                    var ks = 0;
                    jQuery('.' + innerSec).each(function (i) {
                        k = '';
                        if (i > 0) k = "_" + i;

                        $(this).find('.dateRequested').removeClass('dateRequested').addClass('dateRequested' + k);
                        $(".dateRequested" + k + ", #dateRequested" + k).click(function () {
                            $('#dateRequested' + k).datepicker({
                                changeMonth: true,
                                changeYear: true,
                                dateFormat: 'mm/dd/yy',
                                yearRange: '-94:' + (new Date).getFullYear()
                            }).focus();
                        });

                        $(this).find('.dateFunded').removeClass('dateFunded').addClass('dateFunded' + k);
                        $(".dateFunded" + k + ", #dateFunded" + k).click(function () {
                            $('#dateFunded' + k).datepicker({
                                changeMonth: true,
                                changeYear: true,
                                dateFormat: 'mm/dd/yy',
                                yearRange: '-94:' + (new Date).getFullYear()
                            }).focus();
                        });
                    });

                    var ks = 0;
                    jQuery("." + innerSec).each(function (i) {
                        if (i != 0) {
                            $(this).attr('id', innerSec + "_" + i);
                            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removeCloneSec('" + innerSec + "_" + i + "', '" + mainSec + "', '" + innerSec + "', '" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                                "   title=\"Click to remove this row\">\n" +
                                "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                                "</a>");
                        } else {
                            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removeCloneSec('" + innerSec + "', '" + mainSec + "', '" + innerSec + "','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                                "   title=\"Click to remove this row\">\n" +
                                "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                                "</a>");
                        }
                        if (($('.' + innerSec).length - 1) == ks) {
                            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"cloneSectionsInit('" + tabIndex + "', '" + mainSec + "', '" + innerSec + "', '" + innerSec + "','" + drawsFee + "')\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                                "   title=\"Click to add  new row\">\n" +
                                "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
                                "</a><a href=\"javascript:void(0)\" onclick=\"removeCloneSec('" + innerSec + "_" + i + "', '" + mainSec + "', '" + innerSec + "','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                                "   title=\"Click to remove this row\">\n" +
                                "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                                "</a>");
                        }
                        ks++;
                    });
                    if ($('.' + innerSec).length == 1) {
                        $('#' + innerSec).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"cloneSectionsInit('" + tabIndex + "', '" + mainSec + "', '" + innerSec + "', '" + innerSec + "','" + drawsFee + "')\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                            "   title=\"Click to add  new row\">\n" +
                            "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
                            "</a><a href=\"javascript:void(0)\" onclick=\"removeCloneSec('" + innerSec + "', '" + mainSec + "', '" + innerSec + "','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                            "   title=\"Click to remove this row\">\n" +
                            "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                            "</a>");
                    }
                    $(".mask_date").inputmask("mm/dd/yyyy", {autoUnmask: !0});
                    //  $('.with-tip, .with-children-tip > *').tip();
                    try {
                        enableSaveButton();
                    } catch (e) {
                    } /* Enable Save Button on Any Auto complete. */

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
//$('body').on('change', '.drawFundCalOnDrawsFeeClass', function(e) {
$(document).ready(function() {
    $('.drawFundCalOnDrawsFeeClass').change(function() {
        $('.drawRequestClass').each(function() {
            calculateFundedAmt(this);
        });
    });
});

function calculateFundedAmt(elm) {
    var elmVal = appId = '';
    var amtVal = 0;
    var realVal = 0;
    var elmId = elm.id;

    if (elm.classList.contains('bdApprovedClass')) {
        if (elm.value > 100) {
            toastrNotification("Value Should Not Exceed 100", "error");
            $('#' + elm.id).val('0');
        }
    }
    apStr = elmId.split('_');
    appId = apStr[1];

    if (typeof (appId) === "undefined") {
        appId = '';
    } else {
        appId = '_' + appId;
    }

    var dr = getFieldsValue('drawRequest' + appId);
    var aPer = getFieldsValue('drawApproved' + appId);
    var drawsFee = getFieldsValue('drawsFee' + appId);

    if (aPer > 0) {
        amtVal = parseFloat(aPer / 100);
        amtVal = parseFloat(dr) * parseFloat(amtVal);

        if( $('.drawFundCalOnDrawsFeeClass').is(':checked') ){
            amtVal = amtVal - parseFloat(drawsFee);
        }
    }

    $('#drawFunded' + appId).val(autoNumericConverter(parseFloat(amtVal).toFixed(2)));

    calculateProjectSummary();
}

function calculateProjectSummary() {
    var totDF = projectCompletion = availableBudget = rehabCostFinanced = 0;

    var totalAmt = getTextValue('coTotalAmt');
    var rehabCostFinanced = getTextValue('rehabCostFinanced');

    $(".drawFunded").each(function () {
        var fAmt = parseFloat(replaceCommaValues($(this).val()));
        if (fAmt > 0) {
            totDF += fAmt;
        }
    });

    $('#totalDrawsFunded').val(autoNumericConverter(totDF.toFixed(2)));

    availableBudget = parseFloat(rehabCostFinanced) - parseFloat(totDF);

    $('#availableBudget').val(autoNumericConverter(availableBudget.toFixed(2)));

    if (rehabCostFinanced > 0) {
        projectCompletion = (parseFloat(totDF) / parseFloat(replaceCommaValues(rehabCostFinanced))) * 100;
    }
    $('#projectCompletion').val(autoNumericConverter(projectCompletion.toFixed(3)));
}

function addOrRemoveInvestorInfo(tabIndex, mainSec, innerSec) {
    // $('.with-children-tip > *').hideTip();
    rowObj = $("#investorInfo").clone();
    $("." + mainSec).append(rowObj);

    var idCnt = 0;
    var nCnt = 1;
    jQuery(rowObj).find(':input').each(function (i) {
        switch (this.type) {
            case 'password':
            case 'text':
            case 'textarea':
            case 'file':
            case 'select-one':
            case 'select-multiple':
            case 'date':
            case 'number':
            case 'tel':
            case 'email':
            case 'hidden':
                jQuery(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
                break;
        }
    });
    //the count compares with the number of fields in the UI
    //if any field in the UI is added/ removed adjust the number accordingly
    jQuery('.investorInfo').find(':input').each(function (i) {
        if (21 < i) {
            var idArr = [];
            $(this).attr('tabindex', tabIndex);
            var elmId = this.id;
            idArr = elmId.split('_');
            $(this).attr('id', idArr[0] + "_" + idCnt);
        }
        if (nCnt == 22) {
            idCnt++;
            nCnt = 0;
        }
        nCnt++;
    });

    var ks = 0;
    jQuery("." + innerSec).each(function (i) {

        if (i != 0) {
            $(this).attr('id', "investorInfo_" + i);
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removeInvestorInfo('investorInfo_" + i + "', '" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                       title=\"Click to remove this row\">\n" +
                "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                "</a>");
        } else {
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removeInvestorInfo('investorInfo','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                       title=\"Click to remove this row\">\n" +
                "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                "</a>");
        }
        if (($('.' + innerSec).length - 1) == ks) {
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"addOrRemoveInvestorInfo('" + tabIndex + "', 'investorInfoSection', 'investorInfo')\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                       title=\"Click to add new row\">\n" +
                "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
                "</a><a href=\"javascript:void(0)\" onclick=\"removeInvestorInfo('investorInfo_" + i + "','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                       title=\"Click to remove this row\">\n" +
                "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                "</a>");
        }
        ks++;

    });
    jQuery(".secCnt").each(function (i) {
        $(this).html((i + 1) + ")");
    });
    $(".mask_date").inputmask("mm/dd/yyyy", {autoUnmask: !0});
    $(".mask_phone").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
    $(".mask_home_phone").inputmask("mask", {mask: "999 - 999 - 9999"});
    $(".mask_cell").inputmask("mask", {mask: "999 - 999 - 9999"});
    $(".mask_ssn").inputmask("999 - 99 - 9999", {placeholder: "___ - __ - ____", clearMaskOnLostFocus: !0});
    $("#inTCnt").val($('.investorInfo').length);
    $('.zipCode').inputmask("99999");
    try {
        enableSaveButton();
    } catch (e) {
    } /* Enable Save Button on Any Auto complete. */
    var cCnt = $('.' + innerSec).length;

    if (cCnt > 1) {
        populateContactName('investorName_' + (cCnt - 1), '');
    }

    $('.investorInfo').on('keyup select paste', 'input, select, textarea', function (e) {
        var secId = '';
        var arr = this.id.split('_');
        if (jQuery.type(arr[1]) === "undefined") {
            secId = ' 1';
            conId = '';
        } else {
            secId = ' ' + arr[1];
            conId = '_' + secId;
        }

        if ($('#investorID' + conId).val() != '' && $('#investorID' + conId).val() != 0) {
            $('#isSectionChanged').val('Investor Info');
        }
    });

    $('.investorInfo').on('click select paste', 'input, select, textarea', function (e) {
        var secId = '';
        var arr = this.id.split('_');
        if (jQuery.type(arr[1]) === "undefined") {
            secId = ' 1';
        } else {
            secId = ' ' + arr[1];
        }

        if ($('#isSectionChanged').val() == 'Investor Info' && e.type != 'dblclick') {
            e.stopPropagation();
        }
    });
}

function removeInvestorInfo(rSec, tabIndex) {
    var CID = $("#" + rSec).find('.invCID').val();
    var fLMRId = $('#fLMRId').val();

    //  var confrim = confirm("");
    //  if (confrim && CID > 0) {
    if (CID > 0) {

        $.confirm({
            icon: 'fa fa-warning',
            closeIcon: true,
            title: 'Confirm',
            content: "Are you sure you want to delete the investor?",
            type: 'red',
            backgroundDismiss: true,
            buttons: {
                yes: {
                    btnClass: 'btn-green',
                    action: function () {
                        $.ajax({
                            type: 'POST',
                            url: siteSSLUrl + "backoffice/deleteInvestorContact.php",
                            data: jQuery.param({'CID': CID, 'LMRId': fLMRId, 'ajax': 1}),
                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                            success: function (res) {
                                if (res > 0) {

                                    //  $('.with-children-tip > *').hideTip();

                                    if (rSec == 'investorInfo') {
                                        jQuery("#" + rSec).find(':input').each(function (i) {
                                            switch (this.type) {
                                                case 'password':
                                                case 'text':
                                                case 'textarea':
                                                case 'file':
                                                case 'select-one':
                                                case 'select-multiple':
                                                case 'date':
                                                case 'number':
                                                case 'tel':
                                                case 'email':
                                                case 'hidden':
                                                    jQuery(this).val('');
                                                    break;
                                                case 'checkbox':
                                                case 'radio':
                                                    this.checked = false;
                                                    break;
                                            }
                                        });
                                    } else {
                                        $('#' + rSec).remove();
                                        var idCnt = 0;
                                        var nCnt = 1;
                                        jQuery('.investorInfo').find(':input').each(function (i) {
                                            if (22 < i) {
                                                var idArr = [];
                                                $(this).attr('tabindex', tabIndex);
                                                var elmId = this.id;
                                                idArr = elmId.split('_');
                                                $(this).attr('id', idArr[0] + "_" + idCnt);
                                            }
                                            if (nCnt == 23) {
                                                idCnt++;
                                                nCnt = 0;
                                            }
                                            nCnt++;
                                        });
                                    }

                                    var ks = 0;
                                    jQuery(".investorInfo").each(function (i) {
                                        if (i != 0) {
                                            $(this).attr('id', "investorInfo_" + i);
                                            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removeInvestorInfo('investorInfo_" + i + "', '" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                                                "                       title=\"Click to remove this row\">\n" +
                                                "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                                                "</a>");
                                        } else {
                                            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removeInvestorInfo('investorInfo','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                                                "                       title=\"Click to remove this row\">\n" +
                                                "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                                                "</a>");
                                        }
                                        if (($('.investorInfo').length - 1) == ks) {
                                            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"addOrRemoveInvestorInfo('" + tabIndex + "', 'investorInfoSection', 'investorInfo')\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                                                "                       title=\"Click to add new row\">\n" +
                                                "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
                                                "</a>&nbsp;<a href=\"javascript:void(0)\" onclick=\"removeInvestorInfo('investorInfo_" + i + "','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                                                "                       title=\"Click to remove this row\">\n" +
                                                "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                                                "</a>");
                                        }
                                        ks++;
                                    });
                                    if ($('.investorInfo').length == 1) {
                                        $('#investorInfo').find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"addOrRemoveInvestorInfo('" + tabIndex + "', 'investorInfoSection', 'investorInfo')\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                                            "                       title=\"Click to add new row\">\n" +
                                            "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
                                            "</a><a href=\"javascript:void(0)\" onclick=\"removeInvestorInfo('investorInfo','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                                            "                       title=\"Click to remove this row\">\n" +
                                            "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                                            "</a>");
                                    }
                                    $("#inTCnt").val($('.investorInfo').length);
                                    try {
                                        enableSaveButton();
                                    } catch (e) {
                                    } /* Enable Save Button on Any Auto complete. */
                                }
                            }
                        });
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


    } else if (CID == 0 || CID == "") {
        //   $('.with-children-tip > *').hideTip();
        if (rSec == 'investorInfo') {
            jQuery("#" + rSec).find(':input').each(function (i) {
                switch (this.type) {
                    case 'password':
                    case 'text':
                    case 'textarea':
                    case 'file':
                    case 'select-one':
                    case 'select-multiple':
                    case 'date':
                    case 'number':
                    case 'tel':
                    case 'email':
                    case 'hidden':
                        jQuery(this).val('');
                        break;
                    case 'checkbox':
                    case 'radio':
                        this.checked = false;
                        break;
                }
            });
        } else {
            $('#' + rSec).remove();
            var idCnt = 0;
            var nCnt = 1;
            jQuery('.investorInfo').find(':input').each(function (i) {
                if (22 < i) {
                    var idArr = [];
                    $(this).attr('tabindex', tabIndex);
                    var elmId = this.id;
                    idArr = elmId.split('_');
                    $(this).attr('id', idArr[0] + "_" + idCnt);
                }
                if (nCnt == 23) {
                    idCnt++;
                    nCnt = 0;
                }
                nCnt++;
            });
        }
        var ks = 0;
        jQuery(".investorInfo").each(function (i) {
            if (i != 0) {
                $(this).attr('id', "investorInfo" + i);
                $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removeInvestorInfo('investorInfo" + i + "', '" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                    "                       title=\"Click to remove this row\">\n" +
                    "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                    "</a>");
            } else {
                $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removeInvestorInfo('investorInfo','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                    "                       title=\"Click to remove this row\">\n" +
                    "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                    "</a>");
            }
            if (($('.investorInfo').length - 1) == ks) {
                $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"addOrRemoveInvestorInfo('" + tabIndex + "', 'investorInfoSection', 'investorInfo')\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                    "                       title=\"Click to add new row\">\n" +
                    "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
                    "</a>&nbsp;<a href=\"javascript:void(0)\" onclick=\"removeInvestorInfo('investorInfo" + i + "','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                    "                       title=\"Click to remove this row\">\n" +
                    "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                    "</a>");
            }
            ks++;
        });
        if ($('.investorInfo').length == 1) {
            $('#investorInfo').find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"addOrRemoveInvestorInfo('" + tabIndex + "', 'investorInfoSection', 'investorInfo')\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                       title=\"Click to add new row\">\n" +
                "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
                "</a><a href=\"javascript:void(0)\" onclick=\"removeInvestorInfo('investorInfo','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                       title=\"Click to remove this row\">\n" +
                "\t<i class=\"  icon-md fas fa-minus-circle  \"></i>\n" +
                "</a>");
        }
        $("#inTCnt").val($('.investorInfo').length);
        try {
            enableSaveButton();
        } catch (e) {
        } /* Enable Save Button on Any Auto complete. */
    }
}

/** Calculate Servicing Tab Investor Other Info**/

function calculateInvestorAmount(elm) {

    var appId = '';
    var amtVal = 0;
    var inAmtPer = 0;
    var elmId = elm.id;

    apStr = elmId.split('_');
    appId = apStr[1];

    if (typeof (appId) === "undefined") {
        appId = '';
    } else {
        appId = '_' + appId;
    }

    /** Expected Monthly Amount**/
    var inYield = getFieldsValue('investorYield' + appId);
    var inAmt = getFieldsValue('investedAmount' + appId);

    amtVal = (parseFloat(inAmt) * (parseFloat(inYield) / 100) / 12);

    $('#expectedMonthlyPayment' + appId).val(autoNumericConverter(amtVal.toFixed(2)));

    /**Invested Amount Percentage **/
    var totalLoanAmt = getTextValue('totalLoanAmount');
    inAmtPer = (parseFloat(inAmt) / parseFloat(totalLoanAmt)) * 100;

    $('#investedAmountPercent' + appId).val(autoNumericConverter(inAmtPer.toFixed(2)));

}

function hideShowCoBorrowerSections(switchId, clsName) {
    var isCoBorrower = $('#' + switchId).val();

    if (isCoBorrower == '1') {
        $('.' + clsName).css("display", "block");
    } else {
        $('.' + clsName).css("display", "none");
    }
}


function ccExpDateValid(formName, ccMonth, ccYear, ccExp) {

    eval("var exp_year = document." + formName + "." + ccYear + ".value");

    eval("var exp_month = document." + formName + "." + ccMonth + ".value");

    eval("document." + formName + "." + ccExp + ".value='" + exp_month + "/" + exp_year + "'");

}

function toastConfimBox(msgType, msg) {
    toastr.clear();
    toastr.options = {
        "positionClass": "toast-center-center",
        "closeButton": true,
        "showDuration": "100000",
        "hideDuration": "100000",
        "timeOut": "2800",
        "extendedTimeOut": "100000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "allowHtml": true,
    }
    var msg = msg + '<br><br><input type="button" id="confirmBtn" class="btn btn-primary" value="Yes">&nbsp;<button type="button" id="cancelBtn" class="btn btn-danger">No</button>';

    return toast = toastr[msgType](msg);
}


function toastConfimBoxForBorroweredit(msgType, msg) {
    toastr.clear();
    toastr.options = {
        "positionClass": "toast-center-center",
        "closeButton": true,
        "showDuration": "100000",
        "hideDuration": "100000",
        "timeOut": "2800",
        "extendedTimeOut": "100000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "allowHtml": true,
    }
    var msg = msg + '<br><br><input type="button" id="confirmBtnEditBorrower" class="btn btn-primary" value="Yes">&nbsp;<button type="button" id="cancelBtnEditBorrower" class="btn btn-danger">No</button>';

    return toast = toastr[msgType](msg);
}

function getBranchAndBrokerPromoCodes(encId, opt) {

    $.ajax({
        type: 'POST',
        url: siteSSLUrl + "backoffice/getBranchAndBrokerPromoCodes.php",
        data: jQuery.param({'encId': encId, 'opt': opt, 'ajax': 1}),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (promoCode) {

            if (opt == 'branch') {
                $('.brc').html(promoCode);
            } else if (opt == 'agent') {
                $('.arc').html(promoCode);
            }

        }
    });
    if (opt == 'branch') {
        $.ajax({
            type: 'POST',
            url: siteSSLUrl + "backoffice/getBranchAgents.php",
            data: jQuery.param(
                {
                    'executiveId': encId,
                    'PCID': $("#PCID").val(),
                    'option': 'list',
                    'json': 1,
                }
            ),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (agentList) {

                var obj = $.parseJSON(agentList);

                $('#agentId').empty();
                //$('#secondaryAgentId').empty();
                var optionAgent = '<option value="">- Select -</option>';
                var optionSecondaryAgent = optionAgent;

                $.each(obj, function (agentId, agentInfo) {
                    //option += '  <option value="' + agentId + '">' + agentInfo + '</option>\n';

                    agentInfoArray = agentInfo.split("^^@@^^");
                    agentInfo1 = agentInfoArray[0];
                    externalBroker = agentInfoArray[1];
                    //if(externalBroker == '0'){
                    optionAgent += '  <option value="' + agentId + '">' + agentInfo1 + '</option>\n';
                    //}else if(externalBroker == '1'){
                    //  optionSecondaryAgent += '  <option value="' + agentId + '">' + agentInfo1 + '</option>\n';
                    //}                 //LINES 9642, 9644-46, 9650 commented for ticket ch17542

                });
                $('#agentId').append(optionAgent).trigger("chosen:updated");
                // $('#secondaryAgentId').append(optionSecondaryAgent).trigger("chosen:updated");
            }
        });
    }
}

/**
 * Get branch selected filetype, service type, agent
 */

function getBranchSelectedFileTypeLoanProgram(elmId) {

    $.ajax({
        type: 'POST',
        url: siteSSLUrl + "backoffice/getBranchFileTypeLoanProgram.php",
        data: jQuery.param({
            'executiveId': $('#branchId').val(),
            'fileType': $('#fileModule').val(),
            'option': elmId,
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            if ($('#fileModule').val() == 'HMLO') {
                $('.HMLO').css("display", "table-row");
                $('.HMLOspan').css("display", "block");
                $('.LM').hide();
            } else if ($('#fileModule').val() == 'LM') {
                $('.HMLO, .HMLOspan').hide();
                $('.LM').css("display", "table-row");
            } else {
                $('.HMLO, .HMLOspan, .LM').hide();
            }
            var obj = $.parseJSON(response);
            /**
             * Branch selected file type.
             */
            var option = '<option value="">- Select -</option>';
            var fileType = [];
            try {
                for (var f = 0; f < obj.modulesRequested.length; f++) {
                    fileType[obj.modulesRequested[f].moduleCode] = obj.modulesRequested[f].moduleName;
                    option += '  <option value="' + obj.modulesRequested[f].moduleCode + '">' + obj.modulesRequested[f].moduleName + '</option>\n';
                }
                if (elmId == 'branchId') {
                    $('#fileModule').empty();
                    $('#fileModule').append(option).trigger("chosen:updated");
                }
                $('#spFt').text("<select class=\"form-control input-sm\" name=\"fileType\">\n" + option + "</select>");

                /**
                 * Branch service type.
                 */
                $('#LMRClientType').empty();
                var option = '<option value="">- Select -</option>';
                $.each(obj.servicesRequested, function (key, serviceType) {
                    option += ' <optgroup label="' + fileType[serviceType[0]['moduleCode']] + '" id="' + serviceType[0]['moduleCode'] + '">\n';
                    for (var s = 0; s < serviceType.length; s++) {
                        option += '  <option value="' + serviceType[s].STCode + '">' + serviceType[s].serviceType + '</option>\n';
                    }
                    option += ' </optgroup>\n';
                });
                $('#LMRClientType').append(option).trigger("chosen:updated");
                $('#st').text("<select class=\"form-control input-sm\" name=\"loanPrograms\">\n" + option + "</select>");

                //Additional loan programs
                $('#additionalLoanProgram').empty().append(option).trigger("chosen:updated");
                $('#addLP').text("<select class=\"form-control input-sm\" name=\"additionalLoanProgram[]\" multiple>\n" + option + "</select>");
                if (elmId == 'branchId') {
                    /**
                     * FA Redirect url.
                     */
                    var FAUrl = "<a href='' class='updateURL' data-type='text' data-pk='FA-" + obj.branchInfo.executiveId + "' data-value='" + obj.branchInfo.redirectUrlForQA + "' data-title='Redirect URL' class='editable editable-click editable-open tip-bottom' style='border-bottom: dashed 1px white !important;' title='Click to update redirect link/URL for FA.'>" + obj.branchInfo.redirectUrl + "</a>";
                    $('#redirectUrl').html(FAUrl);
                    /**
                     * QA Redirect url.
                     */
                    var QAUrl = "<a href='' class='updateURL' data-type='text' data-pk='QA-" + obj.branchInfo.executiveId + "' data-value='" + obj.branchInfo.redirectUrlForQA + "' data-title='Redirect URL' class='editable editable-click editable-open tip-bottom' style='border-bottom: dashed 1px white !important;' title='Click to change redirect link/URL for QA.'>" + obj.branchInfo.redirectUrlForQA + "</a>";
                    $('#redirectUrlForQA').html(QAUrl);
                    /**
                     * Transaction Type.
                     */
                    var option = '';
                    $.each(obj.transactionType, function (key, trType) {
                        option += '  <option value="' + trType + '">' + trType + '</option>\n';
                    });
                    $('.trans').text("<select class=\"form-control input-sm\" name=\"transactionType\">\n" + option + "</select>");

                    /**
                     * States.
                     */
                    var option = '';
                    for (var f = 0; f < obj.States.length; f++) {
                        option += '  <option value="' + obj.States[f].stateCode + '">' + obj.States[f].stateName + '</option>\n';
                    }
                    $('.state').text("<select class=\"form-control input-sm\" name=\"State\">\n" + option + "</select>");

                    /**
                     * Entity Type.
                     */
                    var option = '';
                    for (var f = 0; f < obj.entityType.length; f++) {
                        option += '  <option value="' + obj.entityType[f] + '">' + obj.entityType[f] + '</option>\n';
                    }
                    $('.entityType').text("<select class=\"form-control input-sm\" name=\"entityType\">\n" + option + "</select>");

                    /**
                     * Exit Strategy.
                     */
                    var option = '';
                    for (var f = 0; f < obj.exitStrategy.length; f++) {
                        option += '  <option value="' + obj.exitStrategy[f] + '">' + obj.exitStrategy[f] + '</option>\n';
                    }
                    $('.exitStrategy').text("<select class=\"form-control input-sm\" name=\"exitStrategy\">\n" + option + "</select>");

                    /**
                     * Loan Term.
                     */
                    var option = '';
                    for (var f = 0; f < obj.loanTerm.length; f++) {
                        option += '  <option value="' + obj.loanTerm[f] + '">' + obj.loanTerm[f] + '</option>\n';
                    }
                    $('.loanTerm').text("<select class=\"form-control input-sm\" name=\"loanTerm\">\n" + option + "</select>");

                    /**
                     * Property Condition.
                     */
                    var option = '';
                    for (var f = 0; f < obj.propertyCondition.length; f++) {
                        option += '  <option value="' + obj.propertyCondition[f] + '">' + obj.propertyCondition[f] + '</option>\n';
                    }
                    $('.ProCondiction').text("<select class=\"form-control input-sm\" name=\"propertyCondition\">\n" + option + "</select>");

                    /**
                     * Loan Term.
                     */
                    var option = '';
                    for (var f = 0; f < obj.creditScore.length; f++) {
                        option += '  <option value="' + obj.creditScore[f] + '">' + obj.creditScore[f] + '</option>\n';
                    }
                    $('#creditScore').text("<select class=\"form-control input-sm\" name=\"creditScore\">\n" + option + "</select>");
                    /**
                     * Property Type.
                     */
                    var option = '';
                    $.each(obj.propertyType, function (proKey, proType) {
                        option += '  <option value="' + proKey + '">' + proType + '</option>\n';
                    });
                    $('.ProType').text("<select class=\"form-control input-sm\" name=\"ProType\">\n" + option + "</select>");
                    $('.loanType').text("<select name=\"loanType\" id=\"loanType\" class=\"mandatory\" tabindex=\"49\">\n  <option value=\"\"> - Select - </option>\n  <option value=\"2/28 ARM\">2/28 ARM</option>\n  <option value=\"3/27 ARM\">3/27 ARM</option>\n  <option value=\"5/25 ARM\">5/25 ARM</option>\n  <option value=\"7/1 ARM\">7/1 ARM</option>\n  <option value=\"10/1 ARM\">10/1 ARM</option>\n  <option value=\"10 Year Fix\">10 Year Fix</option>\n  <option value=\"15 Year Fix\">15 Year Fix</option>\n  <option value=\"20 Year Fix\">20 Year Fix</option>\n  <option value=\"30 Year Fix\">30 Year Fix</option>\n  <option value=\"40 Year Fix\">40 Year Fix</option>\n  <option value=\"40/30 Year Fix\">40/30 Year Fix</option>\n  <option value=\"Pay Option Arm\">Pay Option Arm</option>\n  <option value=\"HELOC\">HELOC</option>\n  <option value=\"Other\">Other</option>\n  <option value=\"ARM\">ARM</option>\n  <option value=\"Fixed Rate\">Fixed Rate</option>\n  <option value=\"Step Rate\">Step Rate</option>\n  <option value=\"Balloon\">Balloon</option></select>");
                    /**
                     * Editable function init.
                     */
                    $('.updateURL').editable({
                        url: siteSSLUrl + 'backoffice/updateBranchDetails.php',
                        response: function (upStatus) {
                        }
                    });
                    $('.with-tip, .with-children-tip > *').tip();
                }

                if (elmId == 'fileModule') {
                    option = '';
                    $.each(obj.PCStatusInfo, function (primaryStatusKey, primaryStatusVal) {
                        option += '  <option value="' + primaryStatusVal.PSID + '">' + primaryStatusVal.primaryStatus + '</option>\n';
                    });
                    $('.PrimaryStatus').text("<select class=\"form-control input-sm\" name=\"primaryStatus\">\n" + option + "</select>");
                }
            } catch (e) {
            }
        }
    });
    $('.ft').text($('#fileModule').val());
    return false;
}

function draggedEvent(event) {
    console.log('Dragging');
    event.preventDefault();

}

function dropEvent(event) {
    //alert("You Can't Drop Here..!");
    toastrNotification("You Can't Drop Here..!!", "error");
    event.preventDefault();
}

/**
 * Borrower email confirm box.
 */
function borrEmailUpdateConfirm(action) {
    /* Update Borrower Email */
    var selClientId = $('#selClientId').val();
    var selectedPC = $('#selectedPC').val();
    var borrowerEmail = $('#borrowerEmail').val();
    var activeTab = $('#activeTab').val();
    var encryptedLId = $('#encryptedLId').val();

    /* Update Borrower Email */
    if (action == 'update') {
        $.ajax({
            type: 'POST',
            url: '../JQFiles/updateBorrowerEmailForClient.php',
            data: jQuery.param({
                'selClientId': selClientId,
                'selectedPC': selectedPC,
                'borrowerEmail': borrowerEmail,
                'encryptedLId': encryptedLId
            }),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (myData) {
                var obj = $.parseJSON(myData);
                $('#selClientId').val(obj.clientId); // Remove existing client id.
                $('input[name="encryptedCId"]').val(obj.encId); // Remove existing client id.
                toastrNotification('Loan File for the corresponding borrower email field has been updated successfully. Please click on "Save" or "Save and Next" to update other section changes or updates.', "success");
                $('#orignalborEmail').val(borrowerEmail);
            }
        });
    }

    /* Create Borrower Email */
    if (action == 'create') {
        $('#CBEID').val('0'); // Create new entity.
        $('#selClientId').val('0'); // Remove existing client id.
        $('input[name="encryptedCId"]').val(''); // Remove existing client id.
        var methodOfContact = $('#methodOfContact').val();

        $.ajax({
            type: 'POST',
            url: '../JQFiles/updateBorrowerEmailForClient.php',
            data: $('#loanModForm').serialize() + "&isNewClient=1&methodOfContact=" + methodOfContact,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (myData) {
                var obj = $.parseJSON(myData);
                $('#selClientId').val(obj.newClientId); // Remove existing client id.
                $('input[name="encryptedCId"]').val(obj.encId); // Remove existing client id.
                toastrNotification('New borrower has been created successfully. Please click on "Save" or "Save and Next" to update other section changes or updates.', "success");
                $('#orignalborEmail').val(borrowerEmail);
            }
        });
    }

    /* Cancel */
    if (action == 'cancel') {
        $('#borrowerEmail').val($('#orignalborEmail').val()); //Set borr email value to original email.
    }

    return false;
}

/**
 * Confirmation box for the updation of business entity info.
 */
function entityConfirmation(action) {

    /* Update entity info */
    if (action == 'update') {
        $('.ischanged').val(0);
        $.ajax({
            type: 'POST',
            url: '../JQFiles/updateEntityInfo.php',
            data: $('#loanModForm').serialize(),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (myData) {
                var obj = $.parseJSON(myData);
                toastrNotification('Loan File for the corresponding borrower entity section has been updated successfully. Please click on "Save" or "Save and Next" to update other section changes or updates.', "success");
            }
        });
    }

    /* Create new entity */
    if (action == 'create') {
        $('.ischanged').val(0);
        $('#CBEID').val('');

        $.ajax({
            type: 'POST',
            url: '../JQFiles/updateEntityInfo.php',
            data: $('#loanModForm').serialize(),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (myData) {
                var obj = $.parseJSON(myData);
                $('#CBEID').val(obj.CBEID); // Update new CBEID
                toastrNotification('Loan File for the corresponding borrower entity section has been updated successfully. Please click on "Save" or "Save and Next" to update other section changes or updates.', "success");
            }
        });
    }

    /* Cancel */
    if (action == 'cancel') {
        $('.ischanged').val(0);
        showPCClientEntityInfoForFile($('#CBEID').val(), $('#FPCID').val());
    }

    return false;
}

/**
 * Toastr confirm box common functions.
 * @param msg = confirm message.
 * @param buttons = confirm buttons.
 * @param msgType = message type
 * Created by : Suresh Kasinathan <suresh@lendingwise.com>
 */
function toastrConfirmation(msg, btnName, msgType, acl) {
    var returnVal = '';
    if (btnName == 'Attorney' && $('#titleAttorneyEmail').val() == '') {
        $('#titleAttorneyEmail').val(' ');
    }
    /*    toastr.options = {
        tapToDismiss: false,
        timeOut: 2800,
        extendedTimeOut: 0,
        allowHtml: true,
        positionClass: "toast-center-center",
        closeButton: false,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    }*/
    confirmObject = {
        icon: 'fas fa-info-circle text-primary icon-xl',
        closeIcon: true,
        columnClass: 'col-md-8',
        title: 'Alert',
        content: '<b>' + msg + '</b>',
        type: 'red',
        backgroundDismiss: true,
        buttons: {}
    };
    var isToastFunc = function (paramType) {

        if (paramType != 'cancel') {
            chznPrimaryStatusVal = $('#primaryStatus').val();
            if ($('#LMRClientType').val() == '' || $('#LMRClientType').val() == 0) {
                toastrNotification("Please Select What kind of program are you looking for?", 'error');
                return false;
            } else if (chznPrimaryStatusVal == '' || chznPrimaryStatusVal == 0) {
                toastrNotification("Please Select Primary Client File Status", 'error');
                return false;
            } else if ($('#borrowerFName').val() == '') {
                toastrNotification("Please enter First Name", 'error');
                return false;
            } else {
                createOrUpdateSectionData(paramType);
            }
        } else {
            createOrUpdateSectionData(paramType);
        }
    };

    if (btnName == 'isClientData') {
        var allFileBtn = "";
        if (typeof acl !== "undefined" && acl != '') {
            var aclArr = acl.split(',');
            /**
             * Update current loan file as default.
             * The manager needs to give permission to enable the other two permissions
             */
            if (jQuery.inArray("1", aclArr) !== -1) {
                /*    allFileBtn += '<input type="button" style="margin:3px;" name="isToastCreate" id="isToastCreate" class="btn btn-primary btn-sm" value="This Loan & Update Borrower Profile"><img src="../assets/images/profile_icon.png" with="55" height="55"><img src="../assets/images/update_only_loan_file.png" with="30" height="30">';*/

                confirmObject.buttons["This Loan & Update Borrower Profile"] = {
                    btnClass: 'btn-blue', // class for the button
                    btnId: 'isToastCreate',
                    btnName: 'isToastCreate',
                    keys: ['enter', 'a'], // keyboard event for button
                    isHidden: false, // initially not hidden
                    isDisabled: false, // initially not disabled
                    action: function (isToastCreate) {
                        isToastFunc('create');
                    }
                };
            }
            if (jQuery.inArray("2", aclArr) !== -1) {
                /*   allFileBtn += '<input type="button" style="margin:3px;" name="isCurAll" id="isCurAll" class="btn btn-primary btn-sm" value="All Historical Loan Files & Borrower Profile"><img src="../assets/images/profile_icon.png" with="55" height="55"><img src="../assets/images/borrower_and _loan_hierarchy.png" with="40" height="40">';*/

                confirmObject.buttons["All Historical Loan Files & Borrower Profile"] = {
                    btnClass: 'btn-blue', // class for the button
                    btnId: 'isCurAll',
                    btnName: 'isCurAll',
                    keys: ['enter', 'a'], // keyboard event for button
                    isHidden: false, // initially not hidden
                    isDisabled: false, // initially not disabled
                    action: function (isCurAll) {
                        isToastFunc('updateAll');
                    }
                };
            }

            /*   msg += '<br><br><table><tr><td><input type="button" style="margin:3px;" name="isToastUpdate" id="isToastUpdate" class="btn btn-primary btn-sm" value="Only This Loan File (Not the Borrower Profile)"><img src="../assets/images/update_only_loan_file.png" with="30" height="30"> ' + allFileBtn + '<br><input style="margin:5px;" type="button" name="isToastCancel" id="isToastCancel" class="btn btn-danger btn-sm" value="CANCEL"></td></tr></table>';*/

            confirmObject.buttons["Only This Loan File (Not the Borrower Profile)"] = {
                btnClass: 'btn-blue', // class for the button
                btnId: 'isToastUpdate',
                btnName: 'isToastUpdate',
                keys: ['enter', 'a'], // keyboard event for button
                isHidden: false, // initially not hidden
                isDisabled: false, // initially not disabled
                action: function (isCurAll) {
                    isToastFunc('update');
                }
            };
        }
    } else {
        var createBtn = '';
        if (btnName != 'Investor Info') {
            /*createBtn = '<br><input type="button" name="isToastCreate" id="isToastCreate" class="btn btn-success btn-sm" style="margin:3px;" value="Create ' + btnName + ' contact and update to this file">';*/

            confirmObject.buttons["Create " + btnName + " contact and update to this file"] = {
                btnClass: 'btn-blue', // class for the button
                btnId: 'isToastCreate',
                btnName: 'isToastCreate',
                keys: ['enter', 'a'], // keyboard event for button
                isHidden: false, // initially not hidden
                isDisabled: false, // initially not disabled
                action: function (isToastCreate) {
                    isToastFunc('create');
                }
            };
        }

        /*      msg += '<table style="margin:5px;"><tr><td>' +
                '<input type="button" name="isToastUpdate" id="isToastUpdate" class="btn btn-success btn-sm" style="margin:3px;" value="Update ' + btnName + ' contact and all loan files">' + createBtn + '<br><input type="button" name="isToastCancel" style="margin:3px;" id="isToastCancel" class="btn btn-danger btn-sm" value="CANCEL"></td></tr></table>';*/

        confirmObject.buttons["Update " + btnName + " contact and all loan files"] =
            {
                btnClass: 'btn-blue', // class for the button
                btnId: 'isToastUpdate',
                btnName: 'isToastUpdate',
                keys: ['enter', 'a'], // keyboard event for button
                isHidden: false, // initially not hidden
                isDisabled: false, // initially not disabled
                action: function (isToastUpdate) {
                    isToastFunc('update');
                }
            };

        //var toast = toastr[msgType](msg).addClass("modal-lg"); // Wire up an event handler to a button in the toast, if it exists
    }
    confirmObject.buttons["CANCEL"] =
        {
            btnClass: 'btn btn-danger btn-sm',
            btnId: 'isToastCancel',
            btnName: 'isToastCancel',
            action: function (isToastUpdate) {
                isToastFunc('cancel');
            }
        };
    $.confirm(confirmObject);
    return false;


    /* When user clieck update. */
    if (toast.find('#isToastUpdate').length) {
        toast.delegate('#isToastUpdate', 'click', function () {
            chznPrimaryStatusVal = $('#primaryStatus').val();
            if ($('#LMRClientType').val() == '' || $('#LMRClientType').val() == 0) {
                toastrNotification("Please Select What kind of program are you looking for?", 'error');
                return false;
            } else if (chznPrimaryStatusVal == '' || chznPrimaryStatusVal == 0) {
                toastrNotification("Please Select Primary Client File Status", 'error');
                return false;

            } else if ($('#borrowerFName').val() == '') {
                toastrNotification("Please enter First Name", 'error');
                return false;
            } else {
                toast.remove();
                createOrUpdateSectionData('update');
            }
        });
    }

    /* When user clieck create. */
    if (toast.find('#isToastCreate').length) {
        toast.delegate('#isToastCreate', 'click', function () {
            chznPrimaryStatusVal = $('#primaryStatus').val();
            if ($('#LMRClientType').val() == '' || $('#LMRClientType').val() == 0) {
                toastrNotification("Please Select What kind of program are you looking for?", 'error');
                return false;
            } else if (chznPrimaryStatusVal == '' || chznPrimaryStatusVal == 0) {
                toastrNotification("Please Select Primary Client File Status", 'error');
                return false;

            } else if ($('#borrowerFName').val() == '') {
                toastrNotification("Please enter First Name", 'error');
                return false;
            } else {
                toast.remove();
                createOrUpdateSectionData('create');
            }
        });
    }

    /* When user clieck cancel. */
    if (toast.find('#isToastCancel').length) {
        toast.delegate('#isToastCancel', 'click', function () {
            toast.remove();
            createOrUpdateSectionData('cancel');
        });
    }

    /* When user clieck update all. */
    if (toast.find('#isCurAll').length) {
        toast.delegate('#isCurAll', 'click', function () {
            chznPrimaryStatusVal = $('#primaryStatus').val();
            if ($('#LMRClientType').val() == '' || $('#LMRClientType').val() == 0) {
                toastrNotification("Please Select What kind of program are you looking for?", 'error');
                return false;
            } else if (chznPrimaryStatusVal == '' || chznPrimaryStatusVal == 0) {
                toastrNotification("Please Select Primary Client File Status", 'error');
                return false;

            } else if ($('#borrowerFName').val() == '') {
                toastrNotification("Please enter First Name", 'error');
                return false;
            } else {
                toast.remove();
                createOrUpdateSectionData('updateAll');
            }
        });
    }

    return false;

}

/**
 * Confirmation box for the create and update section data.
 */
function createOrUpdateSectionData(action) {

    var updateType = $('#isSectionChanged').val(); // Updated section or contact type.
    var PCID = $('#FPCID').val();
    $('#isSectionChanged').val('');

    if (updateType != '') {

        if (action == 'cancel') {
            if (updateType == 'Appraiser 1') {
                showAppraiserContactsForFile($('#A1AppraiserID').val(), PCID, 1);
            } else if (updateType == 'Appraiser 2') {
                showAppraiserContactsForFile($('#A2AppraiserID').val(), PCID, 1);
            } else if (updateType == 'BPO 1') {
                showRealtorBPOContactsForFile($('#A1BPOID').val(), PCID, 1);
            } else if (updateType == 'BPO 2') {
                showRealtorBPOContactsForFile($('#A2BPOID').val(), PCID, 3);
            } else if (updateType == 'BPO 3') {
                showRealtorBPOContactsForFile($('#A3BPOID').val(), PCID, 3);
            } else if (updateType == 'HOA 1') {
                showContactsForFile($('#HOA1ContactID').val(), PCID);
            } else if (updateType == 'HOA 2') {
                showHOA2ContactsForFile($('#HOA2ContactID').val(), PCID);
            } else if (updateType == 'Title') {
                jQuery("input[name='isTitleEdited[]']").each(function () {
                    var idArr = (this.id).split('_');
                    if (this.value == 'Edited') {
                        showRepresentativeForFile($('#representativeID_' + idArr[1]).val(), PCID, idArr[1]);
                    }
                });
            } else if (updateType == 'Escrow') {
                jQuery("input[name='isEscrowEdited[]']").each(function () {
                    var idArr = (this.id).split('_');
                    if (this.value == 'Edited') {
                        showEscrowContactsForFile($('#escrowID_' + idArr[1]).val(), PCID, idArr[1]);
                    }
                });
            } else if (updateType == 'Attorney') {
                jQuery("input[name='isTitleAttorneyEdited[]']").each(function () {
                    var idArr = (this.id).split('_');
                    if (this.value == 'Edited') {
                        showTitleAttorneyForFile($('#titleAttorneyID_' + idArr[1]).val(), PCID, idArr[1]);
                    }
                });
            } else if (updateType == 'Lender') {
                showServiceLenderForFile($('#serviceLenderID').val(), PCID);
            } else if (updateType == 'Insurance') {
                showInsuranceCompanyForFile($('#insuranceCompanyID').val(), PCID);
            } else if (updateType == 'Contractor') {
                showGCContactsForFile($('#GCContactID').val(), PCID);
            } else if (updateType == 'Servicer') {
                showServicerForFile($('#servicerID').val(), PCID);
            } else if (updateType == 'Trustee') {
                showTrusteeForFile($('#trusteeID').val(), PCID);
            } else if (updateType == 'Investor Info') {
                getInvestorInfo();
            }

        } else {
            var data = $('#loanModForm').serialize();
            $.ajax({
                type: 'POST',
                url: '../JQFiles/createOrUpdateSectionData.php',
                data: data + "&updateType=" + updateType + "&confirmType=" + action,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                success: function (resData) {
                    var obj = $.parseJSON(resData);
                    if (jQuery.type(obj.CIDs) === "undefined") {
                        $('#' + obj.CID_Field).val(obj.CID);
                    } else {
                        var CIDArray = obj.CIDs;
                        var cid = '';
                        for (var c = 0; c < CIDArray.length; c++) {
                            if (c > 0) cid = '_' + c;
                            $('#investorID' + cid).val(CIDArray[c]);
                        }
                    }
                    toastrNotification('Loan File for the corresponding borrower ' + updateType + ' contacts has been updated successfully. Please click on "Save" or "Save and Next" to update other section changes or updates.', "success");
                }
            });
        }
    } else {

        /**
         * Check borrower prfile related info has changed.
         * Card #600 - Updating Borrower profile logic.
         * Added by Suresh Kasinathan <suresh@lendingwise.com>
         */
        if (action != 'cancel') {
            if (action == 'create') {
                $('#confirmType').val('Update current loan file and borrower profile');
            } else if (action == 'updateAll') {
                $('#confirmType').val('Update all file and profile');
            } else {
                $('#confirmType').val('Update current file');
            }
            document.getElementById("loanModForm").submit();
        } else {
            return false;
        }
    }
    return false;
}

/** Servicer Info contacts */
function showServicerForFile(CID, PCID) {
    var contactList = new Array();
    var contactName = '',
        address = '',
        city = '',
        state = '',
        zip = '';
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }

    for (var i = 0; i < contactList.length; i++) {
        try {
            document.getElementById('servicerRepFirstName').value = contactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('servicerRepLastName').value = contactList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('servicerCompanyName').value = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('servicerEmail').value = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('servicerPhone').value = contactList[i].getElementsByTagName("phone")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('servicerAddress').value = contactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('servicerCity').value = contactList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('servicerState').value = contactList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('servicerZip').value = contactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

    }
    $(".mask_phone").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
}

/** Trustee Info contacts */
function showTrusteeForFile(CID, PCID) {
    var contactList = new Array();
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }

    for (var i = 0; i < contactList.length; i++) {
        try {
            document.getElementById('trusteeName').value = contactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('trusteeLastName').value = contactList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('trusteeFirmName').value = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('trusteeEmail').value = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('trusteePhone').value = contactList[i].getElementsByTagName("phone")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('trusteeAddress').value = contactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('trusteeCity').value = contactList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('trusteeState').value = contactList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('trusteeZip').value = contactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('trusteeStateOfFormation').value = contactList[i].getElementsByTagName("stateOfFormation")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('trusteeEntityType').value = contactList[i].getElementsByTagName("entityType")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('trusteetollFree').value = contactList[i].getElementsByTagName("tollFree")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('trusteeFax').value = contactList[i].getElementsByTagName("faxNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('trusteeCellNo').value = contactList[i].getElementsByTagName("cellNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

    }
    $(".mask_phone").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
}

/** Investor Info contacts */
function showInvestorForFile(CID, PCID, id) {
    var conId = '';
    var arr = id.split('_');
    try {
        conId = arr[1];
    } catch (e) {
    }

    var contactList = new Array();
    var url = "../JQFiles/getContactListForFile.php";
    var qstr = "CID=" + CID + "&opt=show&PCID=" + PCID;

    if (jQuery.type(conId) === "undefined") {
        conId = '';
    } else {
        conId = '_' + conId;
    }

    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        contactList = xmlDoc.getElementsByTagName("contacts");
    } catch (e) {
    }

    for (var i = 0; i < contactList.length; i++) {
        try {
            $('#investorName' + conId).val(contactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue);
        } catch (e) {
        }
        try {
            $('#investorLastName' + conId).val(contactList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue);
        } catch (e) {
        }
        try {
            $('#investorCompanyName' + conId).val(contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue);
        } catch (e) {
        }
        try {
            $('#investorPhone' + conId).val(contactList[i].getElementsByTagName("phone")[0].childNodes[0].nodeValue);
        } catch (e) {
        }
        try {
            $('#investorEmail' + conId).val(contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue);
        } catch (e) {
        }
        try {
            $('#investorAddress' + conId).val(contactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue);
        } catch (e) {
        }
        try {
            $('#investorCity' + conId).val(contactList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue);
        } catch (e) {
        }
        try {
            $('#investorState' + conId).val(contactList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue);
        } catch (e) {
        }
        try {
            $('#investorZip' + conId).val(contactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue);
        } catch (e) {
        }
        try {
            $('#investorEntityType' + conId).val(contactList[i].getElementsByTagName("entityType")[0].childNodes[0].nodeValue);
        } catch (e) {
        }
        try {
            $('#investortollFree' + conId).val(contactList[i].getElementsByTagName("tollFree")[0].childNodes[0].nodeValue);
        } catch (e) {
        }
        try {
            $('#investorFax' + conId).val(contactList[i].getElementsByTagName("faxNumber")[0].childNodes[0].nodeValue);
        } catch (e) {
        }
        try {
            $('#investorCellNo' + conId).val(contactList[i].getElementsByTagName("cellNumber")[0].childNodes[0].nodeValue);
        } catch (e) {
        }
    }
}

function clearDependentFields(obj) {
    var secID = $(obj).parent().parent().parent().parent().attr('id');
    jQuery("#" + secID).find(':input').each(function () {
        switch (this.type) {
            case 'password':
            case 'text':
            case 'textarea':
            case 'file':
            case 'select-one':
            case 'select-multiple':
            case 'date':
            case 'number':
            case 'tel':
            case 'email':
            case 'hidden':
                jQuery(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
                break;
        }
    });
}

/* Get investor information */
function getInvestorInfo() {

    $.ajax({
        type: 'POST',
        url: '../JQFiles/getInvestorInfo.php',
        data: 'LMRId=' + $('#encryptedLId').val(),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (resData) {
            var obj = $.parseJSON(resData);

            $('.investorInfo').each(function (i) {
                if (i == 0) {
                    jQuery(this).find(':input').each(function () {
                        switch (this.type) {
                            case 'password':
                            case 'text':
                            case 'textarea':
                            case 'file':
                            case 'select-one':
                            case 'select-multiple':
                            case 'date':
                            case 'number':
                            case 'tel':
                            case 'email':
                            case 'hidden':
                                jQuery(this).val('');
                                break;
                            case 'checkbox':
                            case 'radio':
                                this.checked = false;
                                break;
                        }
                    });
                    $('.actionIcons').html("<i class='fa fa-plus-circle fa-1x icon-green cursor' onclick='addOrRemoveInvestorInfo(\"105\", \"investorInfoSection\", \"investorInfo\");' title='Click to add new row.'></i>&nbsp;<i class='fa fa-minus-circle fa-1x icon-red cursor' onclick='removeInvestorInfo(\"investorInfo\",\"106\");' title='Click to remove this investor.'></i>");
                } else {
                    $(this).remove();
                }
            });
            var invId = '';
            for (let inv = 0; inv < obj.length; inv++) {
                if (inv != 0) {
                    invId = '_' + inv;
                } else {
                    addOrRemoveInvestorInfo("105", "investorInfoSection", "investorInfo");
                }
                assignFieldValue(obj[inv].CID, 'investorID' + invId);
                assignFieldValue(obj[inv].contactName, 'investorName' + invId);
                assignFieldValue(obj[inv].contactLName, 'investorLastName' + invId);
                assignFieldValue(obj[inv].companyName, 'investorCompanyName' + invId);
                assignFieldValue(obj[inv].phone, 'investorPhone' + invId);
                assignFieldValue(obj[inv].tollFree, 'investortollFree' + invId);
                assignFieldValue(obj[inv].fax, 'investorFax' + invId);
                assignFieldValue(obj[inv].cell, 'investorCellNo' + invId);
                assignFieldValue(obj[inv].email, 'investorEmail' + invId);
                assignFieldValue(obj[inv].address, 'investorAddress' + invId);
                assignFieldValue(obj[inv].city, 'investorCity' + invId);
                assignFieldValue(obj[inv].state, 'investorState' + invId);
                assignFieldValue(obj[inv].zip, 'investorZip' + invId);
                assignFieldValue(obj[inv].stateOfFormation, 'investorStateOfFormation' + invId);
                assignFieldValue(obj[inv].entityType, 'investorEntityType' + invId);
                assignFieldValue(obj[inv].investorTitleVesting, 'investorTitleVesting' + invId);
                assignFieldValue(obj[inv].investorYield, 'investorYield' + invId);
                assignFieldValue(obj[inv].totalPaymentsReceived, 'totalPaymentsReceived' + invId);
                assignFieldValue(obj[inv].investedAmount, 'investedAmount' + invId);

                /** Expected Monthly Amount**/
                var inYield = getFieldsValue('investorYield' + invId);
                var inAmt = getFieldsValue('investedAmount' + invId);
                amtVal = (parseFloat(inAmt) * (parseFloat(inYield) / 100) / 12);
                $('#expectedMonthlyPayment' + invId).val(autoNumericConverter(amtVal.toFixed(2)));
                /**Invested Amount Percentage **/
                var totalLoanAmt = getTextValue('totalLoanAmount');
                inAmtPer = (parseFloat(inAmt) / parseFloat(totalLoanAmt)) * 100;
                $('#investedAmountPercent' + invId).val(autoNumericConverter(inAmtPer.toFixed(2)));
            }
        }
    });
}

$(document).ready(function () {
    $(".search_services_table").on("input", function () {
        $(this).next('img').show();
        tableTemp = $(this).attr('data-table');
        trTemp = $('.' + tableTemp).find("tr");
        filter = $(this).val().toUpperCase();

        table = document.getElementsByClassName(tableTemp)[0];
        tr = table.getElementsByTagName("tr");

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            tdList = tr[i].getElementsByTagName("td");
            trHide = false;
            for (itd = 2; itd < tdList.length; itd++) {
                td = tr[i].getElementsByTagName("td")[itd];
                if (td) {
                    txtValue = td.textContent.trim() || td.innerText.trim();
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        trHide = false;
                        break;
                    } else {
                        trHide = true;
                    }
                }
            }
            if (trHide) {
                tr[i].classList.add("secHide");
            } else {
                tr[i].classList.remove("secHide");
            }
        }
        $(this).next('img').hide();
    });
});

function clearBorrowerData(email) {
    /** Radio button Value assign for Background Info **/
    assignFieldValue('', 'selClientId');
    checkRadioButton('', 'isBorUSCitizen', 'borOriginAndVisaTR');
    checkRadioButton('', 'isBorDecalredBankruptPastYears', 'borDecalredBankruptTR');
    checkRadioButton('', 'isAnyBorOutstandingJudgements', 'borOutstandingJudgementsTR');
    checkRadioButton('', 'hasBorAnyActiveLawsuits', 'borActiveLawsuitsTR');
    checkRadioButton('', 'hasBorPropertyTaxLiens', 'borPropertyTaxLiensTR');
    checkRadioButton('', 'hasBorObligatedInForeclosure', 'borObligatedInForeclosureTR');
    checkRadioButton('', 'isBorPresenltyDelinquent', 'borDelinquentTR');
    checkRadioButton('', 'haveBorOtherFraudRelatedCrimes', 'borOtherFraudRelatedCrimesTR');

    /** Radio button Value assign for Experience Info **/
    checkRadioButton('', 'haveBorREInvestmentExperience', 'borRealEstateInvestmentDiv');
    checkRadioButton('', 'haveBorRehabConstructionExperience', 'borRehabConstructionExperienceDiv');
    checkRadioButton('', 'haveBorProjectCurrentlyInProgress', 'borProjectsCurrentlyProgressDiv');
    checkRadioButton('', 'haveBorOwnInvestmentProperties', 'borOwnInvestmentPropertiesDiv');
    checkRadioButton('', 'areBorMemberOfInvestmentClub', 'borMemberOfInvestmentClubDiv');
    checkRadioButton('', 'haveBorProfLicences', 'borHaveProfLicencesDiv');
    checkRadioButton('', 'haveBorSellPropertie', 'haveBorSellPropertieDiv');

    /** Input Field Value assign. Client Info **/
    assignFieldValue('', 'borrowerFName');
    assignFieldValue('', 'borrowerName');
    assignFieldValue('', 'borrowerLName');
    assignFieldValue(email, 'borrowerEmail');
    assignFieldValue(email, 'orignalborEmail');

    assignFieldValue('', 'phoneNumber');
    assignFieldValue('', 'cellNo');
    assignFieldValue('', 'presentAddress');
    assignFieldValue('', 'presentCity');
    assignFieldValue('', 'presentState');
    assignFieldValue('', 'presentZip');
    assignFieldValue('', 'borrowerDOB');
    assignFieldValue('', 'borrowerPOB');
    assignFieldValue('', 'ssn');
    assignFieldValue('', 'driverLicenseState');
    assignFieldValue('', 'driverLicenseNumber');
    assignFieldValue('', 'coBorDriverLicenseState');
    assignFieldValue('', 'coBorDriverLicenseState');


    $("#methodOfContact").val('').trigger("chosen:updated");
    $("#phoneNumber").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
    $("#cellNo").inputmask("mask", {mask: "999 - 999 - 9999"});
    $(".mask_date").inputmask("mm/dd/yyyy", {autoUnmask: !0});
    $(".mask_phone").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
    $(".mask_home_phone").inputmask("mask", {mask: "999 - 999 - 9999"});
    $(".mask_cell").inputmask("mask", {mask: "999 - 999 - 9999"});
    $(".mask_ssn").inputmask("999 - 99 - 9999", {
        placeholder: "___ - __ - ____",
        clearMaskOnLostFocus: !0
    });
    assignFieldValue('', 'serviceProvider');

    /** Input Field Value assign. Background Info **/
    assignFieldValue('', 'borDecalredBankruptExpln');
    assignFieldValue('', 'borActiveLawsuitsExpln');
    assignFieldValue('', 'borOutstandingJudgementsExpln');
    assignFieldValue('', 'borOutstandingJudgementsExpln');
    assignFieldValue('', 'borPropertyTaxLiensExpln');
    assignFieldValue('', 'borObligatedInForeclosureExpln');
    assignFieldValue('', 'borDelinquentExpln');
    assignFieldValue('', 'borOtherFraudRelatedCrimesExpln');
    assignFieldValue('', 'borBackgroundExplanation');

    /** Input Field Value assign. Experience Info **/
    assignFieldValue('', 'borNoOfFlippingExperience');
    assignFieldValue('', 'borNoOfREPropertiesCompleted');
    assignFieldValue('', 'borNoOfYearRehabExperience');
    assignFieldValue('', 'borNoOfProSellCompleted');
    assignFieldValue('', 'borNoOfProSellExperience');
    assignFieldValue('', 'borRehabPropCompleted');
    assignFieldValue('', 'borNoOfProjectCurrently');
    assignFieldValue('', 'borNoOfProjectCurrently');
    assignFieldValue('', 'borNoOfOwnProp');
    assignFieldValue('', 'borClubName');
    assignFieldValue('', 'liquidAssets');
    assignFieldValue('', 'borProfLicence');

    $("#borPrimaryInvestmentStrategy").val('').trigger("chosen:updated");
    $("#geographicAreas").val('').trigger("chosen:updated");

    checkMultiSelectValueExists('borPrimaryInvestmentStrategy', 'Other', 'borPriInvesStrategyDiv');
    assignFieldValue('', 'borPrimaryInvestmentStrategyExplain');

    assignFieldValue('', 'amountOfFinancing');
    assignFieldValue('', 'amountOfFinancingTo');
    assignFieldValue('', 'typicalPurchasePrice');
    assignFieldValue('', 'typicalPurchasePriceTo');
    assignFieldValue('', 'typicalConstructionCosts');
    assignFieldValue('', 'typicalConstructionCostsTo');
    assignFieldValue('', 'typicalSalePrice');
    assignFieldValue('', 'typicalSalePriceTo');

    assignFieldValue('', 'constructionDrawsPerProject');
    assignFieldValue('', 'constructionDrawsPerProjectTo');
    assignFieldValue('', 'monthsPurchaseDateToFirstConst');
    assignFieldValue('', 'monthsPurchaseDateToFirstConstTo');
    assignFieldValue('', 'monthsPurchaseDateUntilConst');
    assignFieldValue('', 'monthsPurchaseDateUntilConstTo');
    assignFieldValue('', 'monthsPurchaseDateToSaleDate');
    assignFieldValue('', 'monthsPurchaseDateToSaleDateTo');
    assignFieldValue('', 'NoOfSuchProjects');
    assignFieldValue('', 'NoOfSuchProjectsTo');

    /** Fliping Experience Info **/
    for (cfe = 0; cfe < 3; cfe++) {
        assignFieldValue('', 'borFlipPropType' + cfe);
        assignFieldValue('', 'borFlipPurchaseDate' + cfe);
        assignFieldValue('', 'borFlipPurchasePrice' + cfe);
        assignFieldValue('', 'borFlipAmountFinanced' + cfe);
        assignFieldValue('', 'borFlipRehabBudget' + cfe);
        assignFieldValue('', 'borFlipEntityName' + cfe);
        assignFieldValue('', 'borFlipOwnership' + cfe);
        assignFieldValue('', 'borFlipExit' + cfe);

        showHideExitPro('', 'solddiv' + cfe);

        assignFieldValue('', 'borFlipSalePrice' + cfe);
        assignFieldValue('', 'borFlipSaleDate' + cfe);
        assignFieldValue('', 'borFlipMonthlyRent' + cfe);

        assignFieldValue('', 'borFlipAddress' + cfe);
        assignFieldValue('', 'borFlipCity' + cfe);
        assignFieldValue('', 'borFlipState' + cfe);
        assignFieldValue('', 'borFlipZip' + cfe);
        assignFieldValue('', 'borOutcomeRE' + cfe);
        $('.FlipDocs_' + cfe).val('');
        $('.FlipDocs_' + cfe).html('');

    }


    var guId = 3;

    for (cfe = 0; cfe < 3; cfe++) {
        assignFieldValue('', 'borGUPropType' + cfe);
        assignFieldValue('', 'borGUPurchaseDate' + cfe);
        assignFieldValue('', 'borGUPurchasePrice' + cfe);
        assignFieldValue('', 'borGUAmountFinanced' + cfe);
        assignFieldValue('', 'borGURehabBudget' + cfe);
        assignFieldValue('', 'borGUEntityName' + cfe);
        assignFieldValue('', 'borGUOwnership' + cfe);
        assignFieldValue('', 'borGUExit' + cfe);

        showHideExitPro('', 'showhideborGUSale' + cfe);

        assignFieldValue('', 'borGUSalePrice' + cfe);
        assignFieldValue('', 'borGUSaleDate' + cfe);
        assignFieldValue('', 'borGUMonthlyRent' + cfe);

        assignFieldValue('', 'borGUAddress' + cfe);
        assignFieldValue('', 'borGUCity' + cfe);
        assignFieldValue('', 'borGUState' + cfe);
        assignFieldValue('', 'borGUZip' + cfe);
        assignFieldValue('', 'borOutcomeRC' + cfe);
        $('.GUDocs_' + cfe).val('');
        $('.GUDocs_' + cfe).html('');
        guId++;
    }


    var guId = 6;

    showAndHideborrowerUnderExperience('', 'haveBorSellPropertieDiv');
    for (cfe = 0; cfe < 3; cfe++) {
        assignFieldValue('', 'borSellPropType' + cfe);
        assignFieldValue('', 'borSellPurchaseDate' + cfe);
        assignFieldValue('', 'borSellPurchasePrice' + cfe);
        assignFieldValue('', 'borSellAmountFinanced' + cfe);
        assignFieldValue('', 'borSellRehabBudget' + cfe);
        assignFieldValue('', 'borSellEntityName' + cfe);
        assignFieldValue('', 'borSellOwnership' + cfe);
        assignFieldValue('', 'borSellExit' + cfe);

        showHideSellExitPro('', cfe);

        assignFieldValue('', 'borSellSalePrice' + cfe);
        assignFieldValue('', 'borSellSaleDate' + cfe);
        assignFieldValue('', 'borSellMonthlyRent' + cfe);

        assignFieldValue('', 'borSellAddress' + cfe);
        assignFieldValue('', 'borSellCity' + cfe);
        assignFieldValue('', 'borSellState' + cfe);
        assignFieldValue('', 'borSellZip' + cfe);
        assignFieldValue('', 'borOutcomeRC' + cfe);
        $('.SellDocs_' + cfe).val('');
        $('.SellDocs_' + cfe).html('');
        guId++;

    }


    assignFieldValue('', 'assetCheckingAccounts');
    assignFieldValue('', 'assetSavingMoneyMarket');
    assignFieldValue('', 'assetStocks');
    assignFieldValue('', 'assetIRAAccounts');
    assignFieldValue('', 'assetESPOAccounts');
    assignFieldValue('', 'assetHome');
    assignFieldValue('', 'assetORE');
    assignFieldValue('', 'assetCars');
    assignFieldValue('', 'assetLifeInsurance');
    assignFieldValue('', 'assetOther');
    assignFieldValue('', 'assetCash');
    assignFieldValue('', 'assetHomeOwed');
    assignFieldValue('', 'assetOREOwed');
    assignFieldValue('', 'assetCarsOwed');
    assignFieldValue('', 'otherAmtOwed');
    assignFieldValue('', 'assetTotalCashBankAcc');
    assignFieldValue('', 'assetTotalRetirementValue');
    assignFieldValue('', 'assetAvailabilityLinesCredit');
    assignFieldValue('', 'assetSR');
    assignFieldValue('', 'assetSROwed');
    assignFieldValue('', 'networthOfBusinessOwned');
    assignFieldValue('', 'otherDesc');
}

function toastConfimBoxGlobal(msgType, msg, id) {
    toastr.clear();
    toastr.options = {
        "positionClass": "toast-center-center",
        "closeButton": true,
        "showDuration": "100000",
        "hideDuration": "100000",
        "timeOut": "2800",
        "extendedTimeOut": "100000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "allowHtml": true,
    }
    var msg = msg + '<br><br><input type="button" id="confirmBtn' + id + '" class="btn btn-primary" value="Yes">&nbsp;<button type="button" id="cancelBtn' + id + '" class="btn btn-danger">No</button>';

    return toast = toastr[msgType](msg);
}

function addOrRemoveSheduleRealEstate(tabIndex, mainSec, innerSec) {
    //$('.with-children-tip > *').hideTip();
    var rowObj = $(".scheduleRealEstate:first").clone(true);
    var cnt = $(".scheduleRealEstate").length;
    var tabIndex = $(".scheduleRealEstate").last().find('.netRentalIncome').attr('tabindex');

    var idCnt = 0;
    var nCnt = 1;
    var displayCount = cnt + 1;
//alert(jQuery(rowObj).find(".card-label").text()+'==='+cnt);
    jQuery(rowObj).find(".card-label").text('Schedule of Real Estate Info : ' + displayCount);
    jQuery(rowObj).find(".schtoolbar").attr('data-body-id', 'body_' + displayCount);
    jQuery(rowObj).find(".card-body").attr('id', 'body_' + displayCount);
    jQuery(rowObj).find(".card-body").attr('style', 'display:block');
    jQuery(rowObj).find(':input').each(function (i) {
        switch (this.type) {
            case 'password':
            case 'text':
            case 'textarea':
            case 'file':
            case 'select-one':
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

    jQuery(rowObj).find(':input, i').each(function (i) {
        var idArr = [];
        var elmId = this.id;
        idArr = elmId.split('_');
        if (this.type != 'radio') $(this).attr('id', idArr[0] + "_" + cnt);
        $(this).attr('tabindex', tabIndex); // | Tabindex change
        if (this.type == 'radio') {
            var nameArr = [];
            var radioname = this.name;
            nameArr = radioname.split('_');
            $(this).attr('name', nameArr[0] + "_" + cnt + '[]');
            $(this).attr('onClick', "hideAndShowAcceptPurchaseAgreement('" + this.value + "', '" + nameArr[0] + "DispOpt_" + cnt + "')");
            $(this).prop("checked", false);
        } else {
            jQuery(this).val('');
        }
    });

    jQuery(rowObj).find('.anyMortgagesLiensDispOpt_0').each(function (i) {
        var idArr = [];
        var elmId = this.id;
        idArr = elmId.split('_');
        finaldivid = idArr[0] + "_" + cnt;
        $(this).attr('id', finaldivid);
        $(this).removeClass("anyMortgagesLiensDispOpt_0");
        $(this).addClass(finaldivid);
        $(this).hide();
    });

    jQuery(rowObj).find('.anyOtherMortgagesLiensDispOpt_0').each(function (i) {
        var idArr = [];
        var elmId = this.id;
        idArr = elmId.split('_');
        finaldivid = '';
        finaldivid = idArr[0] + "_" + cnt;
        $(this).attr('id', finaldivid);
        $(this).removeClass("anyOtherMortgagesLiensDispOpt_0");
        $(this).addClass(finaldivid);
        $(this).hide();
    });
    jQuery(rowObj).find('input.paidAtOrBeforeCloseCls').each(function (i) {
        try {
            $(this).attr('onchange', "toggleSwitch('allowPaidAtOrBeforeClose_" + parseInt(cnt) + "'," +
                "'paidAtOrBeforeClose_" + parseInt(cnt) + "','1','0') ");
        } catch (e) {
        }
    });
    jQuery(rowObj).find('input.paidAtOrBeforeCloseAnotherCls').each(function (i) {
        try {
            idVal = $(this).attr('id');
            innerSecDivArray = idVal.split('_');
            $(this).attr('onchange', "toggleSwitch('allowpaidAtOrBeforeCloseAnother_" + parseInt(cnt) + "'," +
                "'paidAtOrBeforeCloseAnother_" + parseInt(cnt) + "','1','0') ");
        } catch (e) {
        }
    });

    jQuery(rowObj).find('.salesDispOpt_0').each(function (i) {
        var idArr = [];
        var elmId = this.id;
        idArr = elmId.split('_');
        finaldivid = idArr[0] + "_" + cnt;
        $(this).attr('id', finaldivid);
        $(this).removeClass("salesDispOpt_0");
        $(this).addClass(finaldivid);
        $(this).hide();
    });

    jQuery(rowObj).find('.mortgageInfo_0').each(function (i) {
        var idArr = [];
        var elmId = this.id;
        idArr = elmId.split('_');
        finaldivid = idArr[0] + "_" + cnt;
        $(this).attr('id', finaldivid);
        $(this).removeClass("mortgageInfo_0");
        $(this).addClass(finaldivid);
        $(this).show();
    });


    jQuery(rowObj).find('.incomeValuesInfo_0').each(function (i) {
        var idArr = [];
        var elmId = this.id;
        idArr = elmId.split('_');
        finaldivid = idArr[0] + "_" + cnt;
        $(this).attr('id', finaldivid);
        $(this).removeClass("incomeValuesInfo_0");
        $(this).addClass(finaldivid);
        $(this).show();
    });

    //update the for value
    //this is used for the toaster msg in mandatory validation
    jQuery(rowObj).find('label').not('.radio').each(function (a) {
        var idArr = [];
        //get the last class name for the list
        if ($(this).attr('class') != '' && $(this).attr('class') != undefined) {
            var elmId = $(this).attr('class').split(' ').pop();
            if (typeof elmId != "undefined" && elmId != "") {
                idArr = elmId.split('_');
                $(this).attr('for', idArr[0] + "_" + cnt);
            }
        }
    });

    $("." + mainSec).append(rowObj);

    var ks = 0;
    jQuery("." + innerSec).each(function (i) {

        if (i != 0) {
            $(this).attr('id', "scheduleRealEstate_" + i);
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"removeSheduleRealEstate('scheduleRealEstate_" + i + "', '" + tabIndex + "')\" title=\"Click to remove property " + (i + 1) + ".\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        } else {
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass d-none \" onclick=\"removeSheduleRealEstate('scheduleRealEstate','" + tabIndex + "')\" title=\"Click to remove property " + (i + 1) + ".\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        }
        if (($('.' + innerSec).length - 1) == ks) {
            $(this).find('.actionIcons').html("<label class='col-md-2 no-padding' style='color: #0462b3'>Add Additional Real Estate</label><a href=\"javascript:void(0)\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"addOrRemoveSheduleRealEstate('" + tabIndex + "', 'scheduleRealEstateSectionBody', 'scheduleRealEstate')\" title=\"Click to add new row.\"><i class='icon-md fas fa-plus'></i></a><a class=\"fa btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" href=\"javascript:void(0)\" onclick=\"removeSheduleRealEstate('scheduleRealEstate_" + i + "','" + tabIndex + "')\" title=\"Click to remove property " + (i + 1) + ".\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        }
        ks++;
        if (i % 2 == 1) {
            $(this).addClass('even');
        } else {
            $(this).removeClass('even');
        }
    });
    jQuery(".vendorSecCnt").each(function (i) {
        $(this).html((i + 1) + ")");

    });


    lastdivId = $('.scheduleRealEstate:last').attr('id'); //get last clone div id
    jQuery('#' + lastdivId).find("input.mask_date")
        .removeClass('schPurchaseDate hasDatepicker')
        .removeData('datepicker')
        .unbind()
        .datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'mm/dd/yy',
            yearRange: '-94:' + (new Date).getFullYear()
        });
    $(".mask_date").inputmask("mm/dd/yyyy", {autoUnmask: !0});
    //enableSaveButton();

}

function removeSheduleRealEstate(rSec, tabIndex) {
    //$('.with-children-tip > *').hideTip();
    if (rSec == 'scheduleRealEstate') {
        jQuery("#" + rSec).find(':input').each(function (i) {
            switch (this.type) {
                case 'password':
                case 'text':
                case 'textarea':
                case 'file':
                case 'select-one':
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
    } else {
        try {
            var deletedScheduleId = '';
            deletedScheduleId = $('#deletedScheduleId').val();
            if (deletedScheduleId == '') {
                deletedScheduleId = $('#' + $('#' + rSec).find('.scheduleIDcls').attr("id")).val();
            } else {
                deletedScheduleId = deletedScheduleId + ',' + $('#' + $('#' + rSec).find('.scheduleIDcls').attr("id")).val();
            }
            $('#deletedScheduleId').val(deletedScheduleId);
        } catch (e) {

        }
        $('#' + rSec).remove();
        var idCnt = 0;
        var nCnt = 1;
        jQuery('.scheduleRealEstate').find(':input').each(function (i) {
            if (6 < i) {
                var idArr = [];
                $(this).attr('tabindex', tabIndex);
                var elmId = this.id;
                idArr = elmId.split('_');
                $(this).attr('id', idArr[0] + "_" + idCnt);
            }
            if (nCnt == 7) {
                idCnt++;
                nCnt = 0;
            }
            nCnt++;
        });


    }
    var ks = 0;
    jQuery(".scheduleRealEstate").each(function (i) {
        if (i != 0) {
            $(this).attr('id', "scheduleRealEstate_" + i);
            $(this).find('.actionIcons').html("<a class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" href=\"javascript:void(0)\" onclick=\"removeSheduleRealEstate('scheduleRealEstate_" + i + "', '" + tabIndex + "')\" title=\"Click to remove property " + (i + 1) + ".\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        } else {
            $(this).find('.actionIcons').html("<a class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass d-none\" href=\"javascript:void(0)\"onclick=\"removeSheduleRealEstate('scheduleRealEstate','" + tabIndex + "')\" title=\"Click to remove property " + (i + 1) + ".\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        }
        if (($('.scheduleRealEstate').length - 1) == ks) {
            $(this).find('.actionIcons').html("<label class='col-md-2 no-padding' style='color: #0462b3'>Add Additional Real Estate</label><a class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass\" href=\"javascript:void(0)\" onclick=\"addOrRemoveSheduleRealEstate('" + tabIndex + "', 'scheduleRealEstateSectionBody', 'scheduleRealEstate')\" title=\"Click to add new row.\"><i class=\" icon-md fas fa-plus \"></i></a><a class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" href=\"javascript:void(0)\" onclick=\"removeSheduleRealEstate('scheduleRealEstate_" + i + "','" + tabIndex + "')\" title=\"Click to remove property " + (i + 1) + ".\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        }
        ks++;
    });
    if ($('.scheduleRealEstate').length == 1) {
        $('#scheduleRealEstate').find('.actionIcons').html("<label class='col-md-12 no-padding' style='color: #0462b3'>Add Additional Real Estate</label><a class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass\" href=\"javascript:void(0)\" onclick=\"addOrRemoveSheduleRealEstate('" + tabIndex + "', 'scheduleRealEstateSectionBody', 'scheduleRealEstate')\" title=\"Click to add new row.\"><i class=\" icon-md fas fa-plus \"></i></a><a class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass d-none\" href=\"javascript:void(0)\" onclick=\"removeSheduleRealEstate('scheduleRealEstate','" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
    }
    enableSaveButton();
}


function addOrRemoveFinanceAndSecuritie(tabIndex, mainSec, innerSec) {
    // $('.with-children-tip > *').hideTip();
    var rowObj = $(".financeAndSecuritie:first").clone(true);
    var cnt = $(".financeAndSecuritie").length;
    var tabIndex = $(".financeAndSecuritie").last().find('.description').attr('tabindex');

    var idCnt = 0;
    var nCnt = 1;
    jQuery(rowObj).find(':input').each(function (i) {
        switch (this.type) {
            case 'password':
            case 'text':
            case 'textarea':
            case 'file':
            case 'select-one':
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

    jQuery(rowObj).find(':input, i').each(function (i) {
        var idArr = [];
        var elmId = this.id;
        idArr = elmId.split('_');
        if (this.type != 'radio') $(this).attr('id', idArr[0] + "_" + cnt);
        $(this).attr('tabindex', tabIndex); // | Tabindex change
        if (this.type == 'radio') {
            var nameArr = [];
            var radioname = this.name;
            nameArr = radioname.split('_');
            $(this).attr('name', nameArr[0] + "_" + cnt + '[]');
            $(this).prop("checked", false);
        } else {
            jQuery(this).val('');
        }
    });


    jQuery(rowObj).find('.accountTypeDispOpt_0').each(function (i) {
        var idArr = [];
        var elmId = this.id;
        idArr = elmId.split('_');
        finaldivid = idArr[0] + "_" + cnt;
        $(this).attr('id', finaldivid);
        $(this).removeClass("accountTypeDispOpt_0");
        $(this).addClass(finaldivid);
        $(this).hide();
    });

    jQuery(rowObj).find('.accountTypeDispOptOther_0').each(function (i) {
        var idArr = [];
        var elmId = this.id;
        idArr = elmId.split('_');
        finaldivid = idArr[0] + "_" + cnt;
        $(this).attr('id', finaldivid);
        $(this).removeClass("accountTypeDispOptOther_0");
        $(this).addClass(finaldivid);
        $(this).hide();
    });

    //update the for value
    //this is used for the toaster msg in mandatory validation
    jQuery(rowObj).find('label').not('.radio').each(function (a) {
        var idArr = [];
        //get the last class name for the list
        var elmId = $(this).attr('class').split(' ').pop();
        if (typeof elmId != "undefined" && elmId != "") {
            idArr = elmId.split('_');
            $(this).attr('for', idArr[0] + "_" + cnt);
        }
    });


    $("." + mainSec).append(rowObj);

    var ks = 0;
    jQuery("." + innerSec).each(function (i) {

        if (i != 0) {
            $(this).attr('id', "financeAndSecuritie_" + i);
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"removeFinanceAndSecuritie('financeAndSecuritie_" + i + "', '" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\"  icon-md fas fa-minus-circle \"></i></a>");
        } else {
            //$(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"removeFinanceAndSecuritie('financeAndSecuritie','" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\"  icon-md fas fa-minus-circle \"></i></a>");
            $(this).find('.actionIcons').html("");
        }
        if (($('.' + innerSec).length - 1) == ks) {
            $(this).find('.actionIcons').html("<label class='font-weight-bold col-md-6' style='color: #0462b3'>Add Additional Account(s)</label><a href=\"javascript:void(0)\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"addOrRemoveFinanceAndSecuritie('" + tabIndex + "', 'financeAndSecuritieDivAppendClass', 'financeAndSecuritie')\" title=\"Click to add new row.\"><i class=\" icon-md fas fa-plus \"></i></a><a  href=\"javascript:void(0)\"  class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"removeFinanceAndSecuritie('financeAndSecuritie_" + i + "','" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\" icon-md fas fa-minus-circle \"></i></a>");
        }
        ks++;
        if (i % 2 == 1) {
            $(this).addClass('bg-light');
        } else {
            $(this).removeClass('bg-light');
        }
    });
    jQuery(".financeSecCnt").each(function (i) {
        $(this).html((i + 1) + ")");

    });

    //enableSaveButton();
    $('.tooltipClass').tooltip({
        boundary: 'window',
    });
}

function removeFinanceAndSecuritie(rSec, tabIndex) {
    //$('.with-children-tip > *').hideTip();
    if (rSec == 'financeAndSecuritie') {
        jQuery("#" + rSec).find(':input').each(function (i) {
            switch (this.type) {
                case 'password':
                case 'text':
                case 'textarea':
                case 'file':
                case 'select-one':
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
        var idArr = [];
        idArr = ($('#' + rSec).find('input').first().attr('id')).split('_');
        var deleteLOCSIds = '';
        deleteLOCSIds = $('#deleteLOCSIds').val();
        if (deleteLOCSIds == '') {
            deleteLOCSIds = $('#financeID_' + idArr[1]).val();
        } else {
            deleteLOCSIds = deleteLOCSIds + ',' + $('#financeID_' + idArr[1]).val();
        }
        $('#deleteLOCSIds').val(deleteLOCSIds);
    } else {
        var idArr = [];
        idArr = ($('#' + rSec).find('input').first().attr('id')).split('_');
        var deleteLOCSIds = '';
        deleteLOCSIds = $('#deleteLOCSIds').val();
        if (deleteLOCSIds == '') {
            deleteLOCSIds = $('#financeID_' + idArr[1]).val();
        } else {
            deleteLOCSIds = deleteLOCSIds + ',' + $('#financeID_' + idArr[1]).val();
        }
        $('#deleteLOCSIds').val(deleteLOCSIds);
        $('#' + rSec).remove();
        var idCnt = 0;
        var nCnt = 1;
        jQuery('.financeAndSecuritie').find(':input').each(function (i) {
            if (6 < i) {
                var idArr = [];
                $(this).attr('tabindex', tabIndex);
                var elmId = this.id;
                idArr = elmId.split('_');
                $(this).attr('id', idArr[0] + "_" + idCnt);
            }
            if (nCnt == 7) {
                idCnt++;
                nCnt = 0;
            }
            nCnt++;
        });
    }

    var ks = 0;
    jQuery(".financeAndSecuritie").each(function (i) {
        if (i != 0) {
            $(this).attr('id', "financeAndSecuritie_" + i);
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"removeFinanceAndSecuritie('financeAndSecuritie_" + i + "', '" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\" icon-md fas fa-minus-circle \"></i></a>");
        } else {
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\"  class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"removeFinanceAndSecuritie('financeAndSecuritie','" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\" icon-md fas fa-minus-circle \"></i></a>");
        }
        if (($('.financeAndSecuritie').length - 1) == ks) {
            $(this).find('.actionIcons').html("<label class='font-weight-bold  col-md-6 ' style='color: #0462b3'>Add Additional Account(s)</label><a href=\"javascript:void(0)\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \" onclick=\"addOrRemoveFinanceAndSecuritie('" + tabIndex + "', 'financeAndSecuritieDivAppendClass', 'financeAndSecuritie')\" title=\"Click to add new row.\"><i class=\" icon-md fas fa-plus \"></i></a><a href=\"javascript:void(0)\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"removeFinanceAndSecuritie('financeAndSecuritie_" + i + "','" + tabIndex + "')\" title=\"Click to remove this row.\">  <i class=\" icon-md fas fa-minus-circle \"></i></a>");
        }
        ks++;
    });
    if ($('.financeAndSecuritie').length == 1) {
        $('#financeAndSecuritie').find('.actionIcons').html("<label class='font-weight-bold  col-md-6' style='color: #0462b3'>Add Additional Account(s)</label><a  href=\"javascript:void(0)\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"addOrRemoveFinanceAndSecuritie('" + tabIndex + "', 'financeAndSecuritieDivAppendClass', 'financeAndSecuritie')\" title=\"Click to add new row.\"><i class=\" icon-md fas fa-plus \"></i></a><a  href=\"javascript:void(0)\"  class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"removeFinanceAndSecuritie('financeAndSecuritie','" + tabIndex + "')\" title=\"Click to remove this row.\"><i class=\" icon-md fas fa-minus-circle \"></i></a>");
    }
    $('.tooltipClass').tooltip({
        boundary: 'window',
    });
    enableSaveButton();
}

function displayDependentFields(id, val) {
    var idArr = id.split('_');
    //'stocks','bonds','Non-Marketable Securities'

    if (val == 'stocks' || val == 'bonds' || val == 'Non-Marketable Securities') {
        $('#accountTypeDispOpt_' + idArr[1]).css('display', 'contents');
        $('#accountTypeDispOptOther_' + idArr[1]).css('display', 'none');

    } else if (val == 'cash value of insurance') {
        $('#accountTypeDispOptOther_' + idArr[1]).css('display', 'contents');
        $('#accountTypeDispOpt_' + idArr[1]).css('display', 'none');
    } else {
        $('#accountTypeDispOptOther_' + idArr[1]).css('display', 'none');
        $('#accountTypeDispOpt_' + idArr[1]).css('display', 'none');
    }

}


function updateExistingEmail(email, borrowerNumberOfDeals) {
    toastr.clear();
    var $toast = toastConfimBoxForUpadte('success', borrowerNumberOfDeals, 'updateEmail');
}

function toastConfimBoxForUpadte(msgType, msg, id) {
    if (msg > 1) {
        toastr.clear();
        toastr.options = {
            "positionClass": "toast-center-center",
            "closeButton": true,
            "showDuration": "100000",
            "hideDuration": "100000",
            "timeOut": "2800",
            "extendedTimeOut": "100000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "allowHtml": true,
        }
        var msg = '<br><input type="Button" class="btn btn-danger" name="allFilesUpdate" id="allFilesUpdate" value="Update E-mail for all ' + msg + ' files" onClick="borrowerEmailUpdate(this.id)"> <br><br> <input type="Button" class="btn btn-primary" name="onlyFileUpdate" id="onlyFileUpdate" value="Update E-mail for this file only" onClick="borrowerEmailUpdate(this.id)">';

        return toast = toastr[msgType](msg);
    } else {
        $("#borrowerEmail").attr("readonly", false);
        $('#updateExistingEmail').css({'display': 'none'});
        $('#isBorrowermailEdited').val('');
    }
}


function borrowerEmailUpdate(type) {
    $("#borrowerEmail").attr("readonly", false);
    $('#updateExistingEmail').css({'display': 'none'});
    if (type == 'allFilesUpdate') {
        $('#isBorrowermailEdited').val('edit');
    } else {
        $('#isBorrowermailEdited').val('');
    }
}


function calculateRemainingMonths1LienMortgage(date1, formName, srcFld, termFld, trgtFld) {
    var date2 = '',
        remainingMonths = "",
        terms = '';
    eval("date2 = document." + formName + "." + srcFld + ".value");
    //eval("terms = document." + formName + "." + termFld + ".value");
    terms = $('.1LMS').find('#' + termFld).val();

    var url = "../backoffice/calculateRemainingMonths.php";
    var qstr = "loanOriginationDate=" + date2 + "&term=" + terms;
    try {
        remainingMonths = getResponse(url, qstr);
    } catch (e) {
    }
    try {
        $('.1LMS').find('#' + trgtFld).val(remainingMonths);
    } catch (e) {
    }
}

function mirrorLoanNumber(fieldName) {
    if (fieldName == 'lienLoanNumber') {
        $('#loanNumber').val($('#lienLoanNumber').val());
        $('#loanLoanNumber').val($('#lienLoanNumber').val());
    } else if (fieldName == 'loanLoanNumber') {
        $('#loanNumber').val($('#loanLoanNumber').val());
        $('#lienLoanNumber').val($('#loanLoanNumber').val());
    } else {
        $('#lienLoanNumber').val($('#loanNumber').val());
        $('#loanLoanNumber').val($('#loanNumber').val());
    }
}

function addOrRemovePicturesOfProperty(tabIndex, mainSec, innerSec) {
    //$('.with-children-tip > *').hideTip();
    var rowObj = $(".propPicUpload:first").clone(true);
    var cnt = $(".propPicUpload").length;
    var tabIndex = $(".propPicUpload").last().find('.picpropcls').attr('tabindex');

    var idCnt = 0;
    var nCnt = 1;
    jQuery(rowObj).find(':input').each(function (i) {
        switch (this.type) {
            case 'password':
            case 'text':
            case 'textarea':
            case 'file':
            case 'select-one':
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

    jQuery(rowObj).find(':input, i').each(function (i) {
        var idArr = [];
        var elmId = this.id;
        idArr = elmId.split('_');
        if (this.type != 'radio') $(this).attr('id', idArr[0] + "_" + cnt);
        $(this).attr('tabindex', tabIndex); // | Tabindex change
        if (this.type == 'radio') {
            var nameArr = [];
            var radioname = this.name;
            nameArr = radioname.split('_');
            $(this).attr('name', nameArr[0] + "_" + cnt + '[]');
            $(this).prop("checked", false);
        } else {
            jQuery(this).val('');
        }
    });

    $("." + mainSec).append(rowObj);

    var ks = 0;
    jQuery("." + innerSec).each(function (i) {

        if (i != 0) {
            $(this).attr('id', "propPicUpload_" + i);
            $(this).find('.actionIcons').html("<a onclick=\"removePicturesOfProperty('propPicUpload_" + i + "', '" + tabIndex + "')\" href=\"javascript:void(0)\"\n" +
                "                                       class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                                       title=\"Click To Remove Row\">\n" +
                "                                        <i class=\" icon-md fas fa-minus-circle \"></i>\n" +
                "</a>");
        } else {
            $(this).find('.actionIcons').html("<a onclick=\"removePicturesOfProperty('propPicUpload','" + tabIndex + "')\" href=\"javascript:void(0)\"\n" +
                "                                       class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                                       title=\"Click To Remove Row\">\n" +
                "                                        <i class=\" icon-md fas fa-minus-circle \"></i>\n" +
                "</a>");
        }
        if (($('.' + innerSec).length - 1) == ks) {
            $(this).find('.actionIcons').html("<label class='col-md-6 no-padding' style='color: #0462b3'>Add Pictures Property</label><a onclick=\"addOrRemovePicturesOfProperty('" + tabIndex + "', 'propPicUploadSection', 'propPicUpload')\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                                       title=\"Click To Add New Row\">\n" +
                "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
                "</a><a  onclick=\"removePicturesOfProperty('propPicUpload_" + i + "','" + tabIndex + "')\" href=\"javascript:void(0)\"\n" +
                "                                       class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                                       title=\"Click To Remove Row\">\n" +
                "                                        <i class=\" icon-md fas fa-minus-circle \"></i>\n" +
                "</a>");
        }
        ks++;
        if (i % 2 == 1) {
            $(this).addClass('bg-light');
        } else {
            $(this).removeClass('bg-light');
        }
    });
    jQuery(".vendorSecCnt").each(function (i) {
        $(this).html((i + 1) + ")");

    });


    lastdivId = $('.propPicUpload:last').attr('id'); //get last clone div id

    //enableSaveButton();

}

function removePicturesOfProperty(rSec, tabIndex) {
    //   $('.with-children-tip > *').hideTip();
    if (rSec == 'propPicUpload') {
        jQuery("#" + rSec).find(':input').each(function (i) {
            switch (this.type) {
                case 'password':
                case 'text':
                case 'textarea':
                case 'file':
                case 'select-one':
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
    } else {
        $('#' + rSec).remove();
        var idCnt = 0;
        var nCnt = 1;
        jQuery('.propPicUpload').find(':input').each(function (i) {
            if (6 < i) {
                var idArr = [];
                $(this).attr('tabindex', tabIndex);
                var elmId = this.id;
                idArr = elmId.split('_');
                $(this).attr('id', idArr[0] + "_" + idCnt);
            }
            if (nCnt == 7) {
                idCnt++;
                nCnt = 0;
            }
            nCnt++;
        });


    }
    var ks = 0;
    jQuery(".propPicUpload").each(function (i) {
        if (i != 0) {
            $(this).attr('id', "propPicUpload_" + i);
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removePicturesOfProperty('propPicUpload_" + i + "', '" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                                       title=\"Click To Remove Row\"  <i class=\" icon-md fas fa-minus-circle \"></i>\n" +
                "</a>");
        } else {
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" onclick=\"removePicturesOfProperty('propPicUpload','" + tabIndex + "')\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                                       title=\"Click To Remove Row\"  <i class=\" icon-md fas fa-minus-circle \"></i>\n" +
                "</a>");
        }
        if (($('.propPicUpload').length - 1) == ks) {
            $(this).find('.actionIcons').html("<label class='col-md-6 no-padding' style='color: #0462b3'>Add Pictures Property</label><a  href=\"javascript:void(0)\" onclick=\"addOrRemovePicturesOfProperty('" + tabIndex + "', 'propPicUploadSection', 'propPicUpload')\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                                       title=\"Click To Add New Row\">\n" +
                "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
                "</a><a onclick=\"removePicturesOfProperty('propPicUpload_" + i + "','" + tabIndex + "')\"  href=\"javascript:void(0)\"\n" +
                "                                       class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
                "                                       title=\"Click To Remove Row\">\n" +
                "                                        <i class=\" icon-md fas fa-minus-circle \"></i>\n" +
                "</a>");
        }
        ks++;
    });
    if ($('.propPicUpload').length == 1) {
        $('#propPicUpload').find('.actionIcons').html("<label class='col-md-6 no-padding' style='color: #0462b3'>Add Pictures Property</label><a href=\"javascript:void(0)\" onclick=\"addOrRemovePicturesOfProperty('" + tabIndex + "', 'propPicUploadSection', 'propPicUpload')\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
            "                                       title=\"Click To Add New Row\">\n" +
            "\t<i class=\" icon-md fas fa-plus \"></i>\n" +
            "</a><a  onclick=\"removePicturesOfProperty('propPicUpload','" + tabIndex + "')\" href=\"javascript:void(0)\"\n" +
            "                                       class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \"\n" +
            "                                       title=\"Click To Remove Row\">\n" +
            "                                        <i class=\" icon-md fas fa-minus-circle \"></i>\n" +
            "</a>");
    }
}

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

function fieldLevelValidation() {
    errorCount = 0;
    errormsg = '';
    if ($('#borrowerEmail').val().trim() != '') {
        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
        valueToTest = $('#borrowerEmail').val().trim();
        if (!(testEmail.test(valueToTest))) {
            errormsg = "Please Enter valid Borrower Email.<br>";
            errorCount++;
        }
    }
    if ($('#cellNo').val().trim() != '') {
        if ($('#cellNo').val().replace(/[^0-9]/g, '').trim().length != 10) {
            errormsg = errormsg + "Please Enter valid Borrower Cell Phone Number.<br>";
            errorCount++;
        }
    }
    if ($('#presentZip').val().trim() != '') {
        if ($('#presentZip').val().trim().length != 5) {
            errormsg = errormsg + "Please Enter valid Borrower Zip Code.<br>";
            errorCount++;
        }
    }
    if ($('#ssn').val().trim() != '') {
        if ($('#ssn').val().replace(/[^0-9]/g, '').trim().length != 9) {
            errormsg = errormsg + "Please Enter valid Borrower SSN Number.<br>";
            errorCount++;
        }
    }
    try{
        if ($('#ENINo').val().trim() != '') {
            if ($('#ENINo').val().replace(/[^0-9]/g, '').trim().length != 9) {
                errormsg = errormsg + "Please Enter valid Federal Tax ID/EIN Number.<br>";
                errorCount++;
            }
        }

        if ($('#entityZip').val().trim() != '') {
            if ($('#entityZip').val().trim().length != 5) {
                errormsg = errormsg + "Please Enter valid Entity Zip Code.";
                errorCount++;
            }
        }
        var errormsglicense = '';
        if ($('#driverLicenseNumber').hasClass("mandatory") && $('#driverLicenseState').hasClass("mandatory")) {
            errormsglicense = licenseNumberValidation('driverLicenseState', 'driverLicenseNumber');
        }
        if (errormsglicense != '') {
            errormsg = errormsg + errormsglicense;
            errorCount++;
        }
    }catch (e) {

    }

    if (errorCount > 0) {
        toastrNotification(errormsg, 'error');
        return false;
    } else {
        return true;
    }
}

function licenseNumberValidation(lstate, lnumber) {
    stateCode = $('#' + lstate).val();
    licenseNumber = $('#' + lnumber).val().trim();
    error = '';
    if ($('#driverLicenseNumber').hasClass("mandatory") && $('#driverLicenseState').hasClass("mandatory")) {
        if (licenseNumber != '') {
            // from https://ntsi.com/drivers-license-format/
            // I opted only to set these three variables, because none of the other patterns are repeated
            var sevenNumeric = /^[0-9]{7}$/;
            var eightNumeric = /^[0-9]{8}$/;
            var nineNumeric = /^[0-9]{9}$/;
            if (stateCode == '') {
                error = " Please Select Driver License State";
            } else if (stateCode == 'AK' || stateCode == 'DE') {
                if (!/^[0-9]{1,7}$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 1 to 7 numeric.";
                }
            } else if (stateCode == 'AL') {
                if (!/^(\d{7}|\d{8})$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 7 to 8 numeric.";
                }
            } else if (stateCode == 'AR') {
                if (!/^([0-9]){4,9}$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 4 to 9 numeric.";
                }
            } else if (stateCode == 'AZ') {
                if (!/^[A-Za-z]{1}[0-9]{8}$/.test(licenseNumber) && !nineNumeric.test(licenseNumber)) {
                    error = "Driver License Number Must be 1 alphabetic and 8 numeric or 9 numeric.";
                }
            } else if (stateCode == 'CA') {
                if (!/^[A-Za-z]{1}[0-9]{7}$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 1 alphabetic and 7 numeric.";
                }
            } else if (stateCode == 'CO') {
                if (!(nineNumeric.test(licenseNumber)) && !(/^[A-Za-z]{1,2}[0-9]{3,5}$/.test(licenseNumber) && licenseNumber.length >= 4)) {
                    error = "Driver License Number Must be 9 numeric, or one alpha and 3 to 5 numeric, or 2 alpha and 2 to 5 numeric.";
                }
            } else if (stateCode == 'CN' || stateCode == 'CT' || stateCode == 'MS') {
                if (!nineNumeric.test(licenseNumber)) {
                    error = "Driver License Number Must be 9 numeric.";
                }
            } else if (stateCode == 'DC' || stateCode == 'TN') {
                if (!sevenNumeric.test(licenseNumber) && !nineNumeric.test(licenseNumber)) {
                    error = "Driver License Number Must be 7 or 9 numeric.";
                }
            } else if (stateCode == 'FL') {
                if (!/^[A-Za-z]{1}[0-9]{12}$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 1 alpha, 12 numeric.";
                }
            } else if (stateCode == 'GA') {
                if (!/^[0-9]{7,9}$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 7 to 9 numeric.";
                }
            } else if (stateCode == 'HI') {
                if (!(/[0-9]{8}$/.test(licenseNumber) && licenseNumber.length == 9)) {
                    error = "Driver License Number Must have 1 alpha and 8 numeric, or 9 numeric.";
                }
            } else if (stateCode == 'ID') {
                if (!nineNumeric.test(licenseNumber) && !/[A-Za-z]{2}[0-9]{6}[A-Za-z]{1}$/.test(licenseNumber)) {
                    error = "Driver License Number Must have 9 numeric, or 2 alphabetic + 6 numeric + 1 alpha.";
                }
            } else if (stateCode == 'IL') {
                if (!/^[A-Za-z]{1}[0-9]{11,12}$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 1 alphabetic 11 numeric, or 1 alpha and 12 numeric.";
                }
            } else if (stateCode == 'IN') {
                if (!(/^[A-Za-z]{0,1}[0-9]{9,10}$/.test(licenseNumber) && licenseNumber.length <= 10)) {
                    error = "Driver License Number Must be one alpha and 9 numeric, or 9 to 10 numeric.";
                }
            } else if (stateCode == 'IA') {
                if (!nineNumeric.test(licenseNumber) && !/^[0-9]{3}[A-Za-z]{2}[0-9]{4}$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 9 numeric, or 3 numeric + 2 alpha + 4 numeric.";
                }
            } else if (stateCode == 'KS') {
                if (!/^[A-Za-z]{1}[0-9]{1}[A-Za-z]{1}[0-9]{1}[A-Za-z]{1}$/.test(licenseNumber) && !(/^[A-Za-z]{0,1}[0-9]{8}$/.test(licenseNumber) && licenseNumber.length == 9)) {
                    error = "Driver License Number Must be alpha + number + alpha + number + alpha, or 1 alpha and 8 numeric, or 9 numeric.";
                }
            } else if (stateCode == 'KY') {
                if (!/^[A-Za-z]{1}[0-9]{8,9}$/.test(licenseNumber) && !nineNumeric.test(licenseNumber)) {
                    error = "Driver License Number Must be 1 alphabetic and 8 to 9 numeric, or 9 numeric.";
                }
            } else if (stateCode == 'LA' || stateCode == 'OR') {
                if (!/^[0-9]{1,9}$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 1 to 9 numeric.";
                }
            } else if (stateCode == 'ME') {
                if (!(/^[0-9]{7,8}[A-Za-z]{0,1}$/.test(licenseNumber) && licenseNumber.length <= 8)) {
                    error = "Driver License Number Must be 7 numeric, 7 numeric and one alpha, or 8 numeric.";
                }
            } else if (stateCode == 'MD' || stateCode == 'MN') {
                if (!/^[A-Za-z]{1}[0-9]{12}$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 1 alphabetic and 12 numeric.";
                }
            } else if (stateCode == 'MA') {
                if (!(/[0-9]{8}$/.test(licenseNumber) && licenseNumber.length == 9)) {
                    error = "Driver License Number Must be 1 alphabetic and 8 numeric, or 9 numeric.";
                }
            } else if (stateCode == 'MI') {
                if (!(/^[A-Za-z]{1}[0-9]{10,12}$/.test(licenseNumber) && licenseNumber.length != 12)) {
                    error = "Driver License Number Must be 1 alpha and 10 numeric, or 1 alpha and 12 numeric.";
                }
            } else if (stateCode == 'MT') {
                if (!/^[A-Za-z]{1}[0-9]{8}$/.test(licenseNumber) && !nineNumeric.test(licenseNumber) && !/^[0-9]{13,14}$/.test(licenseNumber)) {
                    error = "Driver License Number Must have one alpha and 8 numeric, or 9, 13, or 14 numeric.";
                }
            } else if (stateCode == 'NE') {
                if (!/^[A-Za-z]{1}[0-9]{6,8}$/.test(licenseNumber)) {
                    error = "Driver License Number Must have one alpha and six to eight numeric.";
                }
            } else if (stateCode == 'NV') {
                if (!(/^[0-9]{9,12}$/.test(licenseNumber) && licenseNumber.length != 11) && !/^[0-9]{8}[Xx]$/.test(licenseNumber)) {
                    error = "Driver License Number Must have 9, 10, or 12 numeric, or eight numeric + X.";
                }
            } else if (stateCode == 'NH') {
                if (!/^[0-9]{2}[A-Za-z]{3}[0-9]{5}$/.test(licenseNumber)) {
                    error = "Driver License Number Must have 2 numeric + 3 alpha + 5 numeric.";
                }
            } else if (stateCode == 'NJ') {
                if (!/^[A-Za-z]{1}[0-9]{14}$/.test(licenseNumber)) {
                    error = "Driver License Number Must have one alpha and 14 numeric.";
                }
            } else if (stateCode == 'NM') {
                if (!/^[0-9]{8,9}$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 8 or 9 numeric.";
                }
            } else if (stateCode == 'NY') {
                if (!/^[A-Za-z]{1}[0-9]{7}$/.test(licenseNumber) && !/^[A-Za-z]{1}[0-9]{18}$/.test(licenseNumber) && !eightNumeric.test(licenseNumber) && !nineNumeric.test(licenseNumber) && !/^[A-Za-z]{8}$/.test(licenseNumber)) {
                    error = "Driver License Number Must have one alpha and 7 or 18 numeric, 8 or 9 numeric, or 8 alpha.";
                }
            } else if (stateCode == 'NC') {
                if (!/^[0-9]{1,12}$/.test(licenseNumber)) {
                    error = "Driver License Number Must have 1 to 12 numeric.";
                }
            } else if (stateCode == 'ND') {
                if (!/^[A-Za-z]{3}[0-9]{6}$/.test(licenseNumber) && !nineNumeric.test(licenseNumber)) {
                    error = "Driver License Number Must have 3 alpha and 6 numeric, or 9 numeric.";
                }
            } else if (stateCode == 'OH') {
                if (!(/^[A-Za-z]{1,2}[0-9]{3,8}$/.test(licenseNumber) && licenseNumber.length >= 5 && licenseNumber.length <= 9) && !eightNumeric.test(licenseNumber)) {
                    error = "Driver License Number Must have one alpha and 4 to 8 numeric, 2 alpha and 3 to 7 numeric, or 8 numeric.";
                }
            } else if (stateCode == 'OK') {
                if (!/^[A-Za-z]{0,1}[0-9]{9}$/.test(licenseNumber)) {
                    error = "Driver License Number Must have one alpha and 9 numeric, or 9 numeric.";
                }
            } else if (stateCode == 'PA') {
                if (!eightNumeric.test(licenseNumber)) {
                    error = "Driver License Number Must have 8 numeric.";
                }
            } else if (stateCode == 'RI') {
                if (!/^[0-9]{7}[A-Za-z]{1}[0-9]{6}$/.test(licenseNumber)) {
                    error = "Driver License Number Must have 7 numeric + 1 alpha + 6 numeric.";
                }
            } else if (stateCode == 'SC') {
                if (!/(^[0-9]){5,11}$/.test(licenseNumber)) {
                    error = "Driver License Number Must have 5 to 11 numeric.";
                }
            } else if (stateCode == 'SD') {
                if (!(/(.*[0-9]){6,10}/.test(licenseNumber) && licenseNumber.length != 11)) {
                    error = "Driver License Number Must have 6 to 10 numeric or 12 numeric.";
                }
            } else if (stateCode == 'TX') {
                if (!/^[0-9]{7,8}$/.test(licenseNumber)) {
                    error = "Driver License Number Must have 7 to 8 numeric.";
                }
            } else if (stateCode == 'UT') {
                if (!/(^[0-9]){4,10}$/.test(licenseNumber)) {
                    error = "Driver License Number Must have 4 to 10 numeric.";
                }
            } else if (stateCode == 'VT') {
                if (!eightNumeric.test(licenseNumber) && !/^([0-9]{7}[Aa])$/.test(licenseNumber)) {
                    error = "Driver License Number Must have 8 numeric or 7 numeric plus 'A'.";
                }
            } else if (stateCode == 'VI') {
                if (!/^[A-Za-z]{1}[0 -9]{8,11}$/.test(licenseNumber) && !nineNumeric.test(licenseNumber)) {
                    error = "Driver License Number Must be 1 alpha and eight to 11 numeric, or 9 numeric.";
                }
            } else if (stateCode == 'WA') { //1-7Alpha+any combination of Alpha, Numeric, or * for a total of 12 characters
                if (!(/^[A-Za-z]{1,7}/.test(licenseNumber) && licenseNumber.length == 12)) {
                    error = "Driver License Number Must be 1 to 7 alpha and total 12 characters.";
                }
            } else if (stateCode == 'WV') {
                if (!sevenNumeric.test(licenseNumber) && !/^[A-Za-z]{1,2}[0-9]{5,6}$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 7 numeric, or 1 to 2 alpha and 5 to 6 numeric.";
                }
            } else if (stateCode == 'WI') {
                if (!/^[A-Za-z]{1}[0-9]{13}$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 1 alpha and 13 numeric.";
                }
            } else if (stateCode == 'WY') {
                if (!/^[0-9]{9,10}$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 9 to 10 numeric.";
                }
            } else { // if (stateCode == 'MO')
                if (!/^[A-Za-z]{1}[0-9]{5,9}$/.test(licenseNumber) && !(/^[0-9]{8,9}[A-Za-z]{1,2}$/.test(licenseNumber) && licenseNumber.length == 10) && !nineNumeric.test(licenseNumber) && !/^[A-Za-z]{1}[0-9]{6}[Rr]$/.test(licenseNumber)) {
                    error = "Driver License Number Must be 1 alphabetic and 5-9 numeric, eight numeric and two alpha, or 9 numeric and one alpha, or 9 numeric, or 1 alpha + 9 numeric + R.";
                }
            }
        }
    }
    return error;
}

function fieldValidation(id, name) {
    originalName = '';
    if (name == 'memberEmail[]' || name == 'attorneyEmail' || name == 'counselAttorneyEmail' || name == 'creditorRepEmail[]'
        || name == 'HOEmail' || name == 'HOA2Email' || name == 'intAssEmail' || name == 'stateHFAEmailAddress' || name == 'lender1Email'
        || name == 'lender2Email' || name == 'payeeEmail' || name == 'lenderEmail' || name == 'realtor1Email' || name == 'appraiser1Email'
        || name == 'coBorrowerEmail' || name == 'sellerinfoEmail' || name == 'proIncEmail' || name == 'escrowOfficerEmail'
        || name == 'titleAttorneyEmail' || name == 'sales2Email' || name == 'LBContactEmail' || name == 'creditorAgentEmail[]'
        || name == 'borrowerEmail' || name == 'borrowerSecondaryEmail' || name == 'sales1Email' || name == 'firstBuyerEmail' || name == 'buyer1Email'
        || name == 'buyer1LOEmail' || name == 'buyer1AttorneyEmail' || name == 'secondBuyerEmail' || name == 'buyer2Email' || name == 'buyer2LOEmail'
        || name == 'buyer2AttorneyEmail' || name == 'thirdBuyerEmail' || name == 'buyer3Email' || name == 'buyer3LOEmail' || name == 'buyer3AttorneyEmail'
        || name == 'paralegalEmail' || name == 'sales2Email') {
        originalName = name;
        name = 'email';
    }
    if (name == 'memberSSN[]' || name == 'ssn') {
        originalName = name;
        name = 'ssnNumber';
    }
    if (name == 'memberCell[]' || name == 'cellNo') {
        originalName = name;
        name = 'cell';
    }
    if (name == 'entityZip' || name == 'presentZip') {
        originalName = name;
        name = 'zipCode';
    }
    switch (name) {
        case 'ssnNumber':
            if ($('#' + id).val().trim() != '') {
                if ($('#' + id).val().replace(/\ - /g, '').trim().length != 9) {
                    if (originalName == 'memberSSN[]') {
                        toastrNotification("Please Enter valid Member Officers SSN Number.", 'error', '', id);
                    } else {
                        toastrNotification("Please Enter valid Borrower SSN Number.", 'error', '', id);
                    }
                }
            }
            break;
        case 'cell':
            if ($('#' + id).val().trim() != '') {
                //if ( $('#'+id).val().replace(/\ - /g, '').trim().length != 10 ){
                if ($('#' + id).val().replace(/[^0-9]+/g, "").trim().length != 10) {
                    if (originalName == 'memberCell[]') {
                        toastrNotification("Please Enter valid Member Officers Cell Number.", 'error', '', id);
                    } else {
                        //console.log($('#'+id).val().replace(/[^0-9]+/g, ""));
                        toastrNotification("Please Enter valid Borrower Cell Number.", 'error', '', id);
                    }
                }
            }
            break;
        case 'email':
            if ($('#' + id).val().trim() != '') {
                var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,12}$/i;  //increased tld to 12 for domains like .accountants
                valueToTest = $('#' + id).val().trim();
                if ($('.autocomplete').length > 0) {
                    if ($('.autocomplete').first().is(":visible")) {
                        break;
                    }
                }
                if (!(testEmail.test(valueToTest))) {
                    if (originalName == 'memberEmail[]') {
                        toastrNotification("Please Enter valid Member Officers Email.", 'error', '', id);
                    } else if (originalName == 'borrowerSecondaryEmail') {
                        toastrNotification("Please Enter valid Borrower Secondary Email.", 'error', '', id);
                    } else if (originalName == 'creditorRepEmail[]') {
                        toastrNotification("Please Enter valid Creditor Rep Email.", 'error', '', id);
                    } else if (originalName == 'creditorAgentEmail[]') {
                        toastrNotification("Please Enter valid Agent Rep Email.", 'error', '', id);
                    } else if (originalName == 'LBContactEmail') {
                        toastrNotification("Please Enter valid Property Access Email.", 'error', '', id);
                    } else if (originalName == 'sales2Email') {
                        toastrNotification("Please Enter valid Title Info Email.", 'error', '', id);
                    } else if (originalName == 'titleAttorneyEmail') {
                        toastrNotification("Please Enter valid Attorney Info Email.", 'error', '', id);
                    } else if (originalName == 'escrowOfficerEmail') {
                        toastrNotification("Please Enter valid Escrow Info Email.", 'error', '', id);
                    } else if (originalName == 'proIncEmail') {
                        toastrNotification("Please Enter valid Insurance Agent Email.", 'error', '', id);
                    } else if (originalName == 'coBorrowerEmail') {
                        toastrNotification("Please Enter valid Co-Borrower Email.", 'error', '', id);
                    } else if (originalName == 'sellerinfoEmail') {
                        toastrNotification("Please Enter valid Seller Email.", 'error', '', id);
                    } else if (originalName == 'appraiser1Email') {
                        toastrNotification("Please Enter valid Appraiser Email.", 'error', '', id);
                    } else if (originalName == 'realtor1Email') {
                        toastrNotification("Please Enter valid Realtor Email.", 'error', '', id);
                    } else if (originalName == 'lenderEmail') {
                        toastrNotification("Please Enter valid Lender Email.", 'error', '', id);
                    } else if (originalName == 'payeeEmail') {
                        toastrNotification("Please Enter valid Payee Email.", 'error', '', id);
                    } else if (originalName == 'lender1Email') {
                        toastrNotification("Please Enter valid 1st Lien Lender Email.", 'error', '', id);
                    } else if (originalName == 'lender2Email') {
                        toastrNotification("Please Enter valid 2nd Lien Lender Email.", 'error', '', id);
                    } else if (originalName == 'stateHFAEmailAddress') {
                        toastrNotification("Please Enter valid State HFA Email.", 'error', '', id);
                    } else if (originalName == 'intAssEmail') {
                        toastrNotification("Please Enter valid Internal Assessed Value Email.", 'error', '', id);
                    } else if (originalName == 'HOEmail') {
                        toastrNotification("Please Enter valid Condo/HOA Email.", 'error', '', id);
                    } else if (originalName == 'attorneyEmail') {
                        toastrNotification("Please Enter valid Attorney/Trustee Email.", 'error', '', id);
                    } else if (originalName == 'counselAttorneyEmail') {
                        toastrNotification("Please Enter valid Of Counsel Attorney Email.", 'error', '', id);
                    } else if (originalName == 'HOA2Email') {
                        toastrNotification("Please Enter valid Condo/HOA Secondary Email.", 'error', '', id);
                    } else if (originalName == 'sales1Email') {
                        toastrNotification("Please Enter valid Listing Realtor Email.", 'error', '', id);
                    } else if (originalName == 'firstBuyerEmail') {
                        toastrNotification("Please Enter valid Buyer Email.", 'error', '', id);
                    } else if (originalName == 'buyer1Email') {
                        toastrNotification("Buyer Agent/Broker Info Email.", 'error', '', id);
                    } else if (originalName == 'buyer1LOEmail') {
                        toastrNotification("Buyers Loan Officer Email.", 'error', '', id);
                    } else if (originalName == 'buyer1AttorneyEmail') {
                        toastrNotification("Buyers Attorney Email.", 'error', '', id);
                    } else if (originalName == 'secondBuyerEmail') {
                        toastrNotification("Please Enter valid 2nd Buyer Email.", 'error', '', id);
                    } else if (originalName == 'buyer2Email') {
                        toastrNotification("Please Enter valid 2nd Buyers Agent/Broker Info Email.", 'error', '', id);
                    } else if (originalName == 'buyer2LOEmail') {
                        toastrNotification("Please Enter valid 2nd Buyers Loan Officer Email.", 'error', '', id);
                    } else if (originalName == 'buyer2AttorneyEmail') {
                        toastrNotification("Please Enter valid 2nd Buyers Attorney Email.", 'error', '', id);
                    } else if (originalName == 'thirdBuyerEmail') {
                        toastrNotification("Please Enter valid 3rd Buyer Email.", 'error', '', id);
                    } else if (originalName == 'buyer3Email') {
                        toastrNotification("Please Enter valid 3rd Buyers Agent/Broker Info Email.", 'error', '', id);
                    } else if (originalName == 'buyer3LOEmail') {
                        toastrNotification("Please Enter valid 3rd Buyers Loan Officer Email.", 'error', '', id);
                    } else if (originalName == 'buyer3AttorneyEmail') {
                        toastrNotification("Please Enter valid 3rd Buyers Attorney Email.", 'error', '', id);
                    } else if (originalName == 'paralegalEmail') {
                        toastrNotification("Please Enter valid Paralegal Email.", 'error', '', id);
                    } else if (originalName == 'sales2Email') {
                        toastrNotification("Please Enter valid Title Info Email.", 'error', '', id);
                    } else {
                        toastrNotification("Please Enter valid Borrower Email.", 'error', '', id);
                    }
                }
            }
            break;
        case 'zipCode':
            if ($('#' + id).val().trim() != '') {
                if ($('#' + id).val().trim().length != 5) {
                    if (originalName == 'entityZip') {
                        toastrNotification("Please Enter valid Entity Zip Code.", 'error', '', id);
                    } else {
                        toastrNotification("Please Enter valid Borrower Zip Code.", 'error', '', id);
                    }
                }
            }
            break;
        case 'ENINo':
            if ($('#' + id).val().trim() != '') {
                if ($('#' + id).val().replace(/\ - /g, '').trim().length != 9) {
                    toastrNotification("Please Enter valid Federal Tax ID/EIN Numbers.", 'error', '', id);
                }
            }
            break;
        case 'memberDriversLicense[]':
            var idrownumb = id.substring(20);
            if ($('#' + id).val().trim() != '') {
                if ($('#memberDriversLicenseState' + idrownumb).val() == '') {
                    toastrNotification("Please select Entity Driver License State.", 'error', '', '#memberDriversLicenseState' + idrownumb);
                } else {
                    errormsg = licenseNumberValidation('memberDriversLicenseState' + idrownumb, id);
                    if (errormsg != '') {
                        toastrNotification(errormsg, 'error', '', id);
                    }
                }
            }
            break;
        case 'memberDriversLicenseState[]':
            var idrownumb = id.substring(20);
            if ($('#' + id).val().trim() != '') {
                if ($('#memberDriversLicense' + idrownumb).val() != '') {
                    errormsg = licenseNumberValidation(id, 'memberDriversLicense' + idrownumb);
                    if (errormsg != '') {
                        toastrNotification(errormsg, 'error', '', 'memberDriversLicense' + idrownumb);
                    }
                }
            } else {
                if ($('#memberDriversLicense' + idrownumb).val() != '') {
                    toastrNotification("Please select Entity Driver License State.", 'error', '', id);
                }
            }
            break;
        case 'driverLicenseNumber':
            if ($('#' + id).val().trim() != '') {
                if ($('#driverLicenseState').val() == '') {
                    if ($('#driverLicenseNumber').hasClass("mandatory") && $('#driverLicenseState').hasClass("mandatory")) {
                        toastrNotification("Please select Driver License State.", 'error', '', 'driverLicenseState');
                    }
                } else {
                    errormsg = licenseNumberValidation('driverLicenseState', id);
                    if (errormsg != '') {
                        toastrNotification(errormsg, 'error', '', id);
                    }
                }
            }
            break;
        case 'driverLicenseState':
            if ($('#' + id).val().trim() != '') {
                if ($('#driverLicenseNumber').val() != '') {
                    errormsg = licenseNumberValidation(id, 'driverLicenseNumber');
                    if (errormsg != '') {
                        toastrNotification(errormsg, 'error', '', 'driverLicenseNumber');
                    }
                }
            } else {
                if ($('#driverLicenseNumber').val() != '') {
                    if ($('#driverLicenseNumber').hasClass("mandatory") && $('#driverLicenseState').hasClass("mandatory")) {
                        toastrNotification("Please select Driver License State.", 'error', '', id);
                    }
                }
            }
            break;
    }
}


var favConfir = function (dataFileId, dataOpt) {
    $.ajax({
        type: 'POST',
        url: '../pops/addFavouriteFile.php',
        async: false,
        data: jQuery.param({
            'dataFileId': dataFileId,
            'dataOpt': dataOpt
        }),
        success: function (resultRes) {
            resultJson = JSON.parse(resultRes);
            toastrNotification(resultJson.msg, 'success', 1500)

            if (resultJson.opt == 'add') {
                $favId.find('i').removeClass('far');
                $favId.find('i').addClass('fas text-warning');
                $favId.attr('title', 'Remove as favorite');
                $favId.attr('data-opt', 'remove');
            } else if (resultJson.opt == 'remove') {
                $favId.find('i').removeClass('fas');
                $favId.find('i').removeClass('text-warning');
                $favId.find('i').addClass('far');
                $favId.attr('title', 'Add as favorite');
                $favId.attr('data-opt', 'add');
            }
        }
    });
}


$(document).ready(function () {

    $('.addAsFav').click(function () {
        $favId = $(this);
        dataFileId = $(this).attr('data-file-id');
        dataOpt = $(this).attr('data-opt');
        confirmMsg = false;

        if (dataOpt == 'remove') {

            $.confirm({
                icon: 'fa fa-warning',
                closeIcon: true,
                title: 'Confirm',
                content: "Are you sure you want to unmark as favorite?",
                type: 'red',
                backgroundDismiss: true,
                buttons: {
                    yes: function () {
                        favConfir(dataFileId, dataOpt);
                    },
                    cancel: function () {

                    },
                },
                onClose: function () {

                },
            });
        } else {
            favConfir(dataFileId, dataOpt);
        }
    });
});

function submitToAcqualify() {
    $.ajax({
        url: "../pops/submitToAcqualify.php",
        type: "post",
        dataType: 'json',
        data: {
            defaultBranchId: $('#defaultBranchId').val(),
            applicantIdentifier: $('#selClientId').val(),
            userId: $('#applicantUserid').val(),
            acqualifyPCAccountId: $('#acqualifyPCAccountId').val(),
            acqualifyPCMinCreditScore: $('#acqualifyPCMinCreditScore').val(),
            acqualifyBranchId: $('#acqualifyBranchId').val(),
            clientId: $('#selClientId').val(),
            lmrid: $('#fLMRId').val(),
            firstName: $('#borrowerFName').val(),
            lastName: $('#borrowerLName').val(),
            addrLine1: $('#presentAddress').val(),
            city: $('#presentCity').val(),
            state: $('#presentState').val(),
            zip: $('#presentZip').val(),
            dob: $('#borrowerDOB').val(),
            email: $('#borrowerEmail').val(),
            phoneNumber: $('#cellNo').val(),
            phoneNumber1: $('#phoneNumber').val(),
            pcid: $('#FPCID').val(),
        },
        beforeSend: function () {
            BlockDiv('CreditScreening');
        },
        complete: function () {
            UnBlockDiv('CreditScreening');
        },
        success: function (response, status, xhr) {
            if (response.code == 100) {
                $.dialog({
                    title: 'Info',
                    icon: 'flaticon2-check-mark icon-md ',
                    type: 'green',
                    columnClass: 'col-md-8',
                    content: atob(response.notificationList),
                });
                //  toastrNotification(atob(response.notificationList), 'success');
            } else {
                toastrNotification(response.msg, 'error');
            }
            UnBlockDiv('CreditScreening');
        },
    });
}

//focus main search after click on the magnifiy icon
function mainSearchFocus() {
    if ($('#mainSearch').length > 0) {
        setTimeout(
            function () {
                $('#mainSearch').focus();
            }, 200);
    }
}

function hmdaBorValidation() {
    var isVisible = $('.BrYes').is(":visible");
    if (isVisible) {//section enabled, check for validation
        if ($('.BrYes.mandatory').length > 0) {
            //$('.BorChildRadio').addClass('mandatory');
            //alert($('input[name="PublishBInfo"]:checked').val());
            var PublishBInfo = $('input[name="PublishBInfo"]:checked').val();
            if (PublishBInfo !== undefined && PublishBInfo == '2') { //check if (wish to furnish this info) is Mandatory
                $('.Hispanic').addClass('mandatory');
                var BEthnicity = $('input[name="BEthnicity"]:checked').val();
                if (BEthnicity !== undefined && BEthnicity == '2') {
                    $('.HispanicPrintOrigin').addClass('mandatory');
                } else {
                    $('.HispanicPrintOrigin').removeClass('mandatory');
                }
                $('.Race').addClass('mandatory');
                var Race = $('input[name="BRace"]:checked').val();
                if (Race !== undefined && (Race == '2' || Race == '4')) { //RaceSub
                    $('.Asian').addClass('mandatory');
                } else {
                    $('.Asian').removeClass('mandatory');
                }
                $('.BGender').addClass('mandatory');
                $('.BVeteran').addClass('mandatory');
            } else { //skip Mandatory if not Yes
                $('.Hispanic').removeClass('mandatory');
                $('.Race').removeClass('mandatory');
                $('.BGender').removeClass('mandatory');
                $('.BVeteran').removeClass('mandatory');

                $('.HispanicPrintOrigin').removeClass('mandatory');
                $('.Asian').removeClass('mandatory');
            }
        }
    }
}

function hmdaCoBorValidation() {
    var isCoVisible = $('.CoBrYes').is(":visible");
    if (isCoVisible) { //section enabled, check for validation
        if ($('.CoBrYes.mandatory').length > 0) { //check if (wish to furnish this info) is Mandatory
            var PublishCBInfo = $('input[name="PublishCBInfo"]:checked').val();
            if (PublishCBInfo !== undefined && PublishCBInfo == '2') {
                $('.CBHispanic').addClass('mandatory');
                var CBEthnicity = $('input[name="CBEthnicity"]:checked').val();
                if (CBEthnicity !== undefined && CBEthnicity == '2') {
                    $('.CBHispanicPrintOrigin').addClass('mandatory');
                } else {
                    $('.CBHispanicPrintOrigin').removeClass('mandatory');
                }
                $('.CBRace').addClass('mandatory');
                var CBRace = $('input[name="CBRace"]:checked').val();
                if (CBRace !== undefined && (CBRace == '2' || CBRace == '4')) { //CBRaceSub
                    $('.CBAsian').addClass('mandatory');
                } else {
                    $('.CBAsian').removeClass('mandatory');
                }
                $('.CBGender').addClass('mandatory');
                $('.CBVeteran').addClass('mandatory');
            } else {
                $('.CBHispanic').removeClass('mandatory');
                $('.CBRace').removeClass('mandatory');
                $('.CBGender').removeClass('mandatory');
                $('.CBVeteran').removeClass('mandatory');

                $('.CBHispanicPrintOrigin').removeClass('mandatory');
                $('.CBAsian').removeClass('mandatory');
            }
        }
    }
}

function checktheMirrorFields(value, name) {
    if (name == 'isBlanketLoanMirror') {
        $("#isBlanketLoan" + value).prop("checked", true);
        if (value == 'Yes') {
            $("#isBlanketLoanNo").prop("checked", false);
        } else {
            $("#isBlanketLoanYes").prop("checked", false);
        }
    } else {
        $("#isBlanketLoanMirror" + value).prop("checked", true);
        if (value == 'Yes') {
            $("#isBlanketLoanMirrorNo" + value).prop("checked", false);
        } else {
            $("#isBlanketLoanMirrorYes").prop("checked", false);
        }
    }
}

function savenoOfPropertiesAcquiringForm() {
    $('#noOfPropertiesAcquiring').val($('#noOfPropertiesAcquiring_mirror').val());
    var LMRId = 0;
    LMRId = "<?php echo $LMRId;?>";
    //if (LMRId > 0) {
    if (false) {
        var formIdToSubmit = $('#loanModForm');
        ajaxUrl = $(formIdToSubmit).attr('action');
        formData = $(formIdToSubmit).serialize();
        formData = new FormData($('#loanModForm')[0]);

        var ajaxRequest = $.ajax({
            url: ajaxUrl,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () {
                //  BlockDiv('employeeCreateDiv');
            },
            complete: function () {
                //UnBlockDiv('employeeCreateDiv');
            },
            success: function (response, status, xhr) {
                location.reload();
            },
            error: function (jqXhr, textStatus, errorMessage) {
                toastrNotification(errorMessage, 'error');
            }
        });
    } else {
        if ($('#noOfPropertiesAcquiring_mirror').val() > 1) {
            $('#addSubpropDiv').show();
        } else {
            $('#addSubpropDiv').hide();
        }
    }
}

function addSubjectProperty(tabIndex) {
    var pronoCount = $('#noOfPropertiesAcquiring').val();
    var cntDiv = $('.subPropDetails').length + 1;
    if (cntDiv <= pronoCount) {
        for (var cnt = cntDiv; cnt <= pronoCount; cnt++) {

            var rowObj = $('#PropertyDetailsSectionDiv').clone().attr('id', 'PropertyDetailsSectionDiv' + cnt);
            jQuery(rowObj).find(".card-body.parentPropertycard-body").attr('id', 'property' + cnt + 'DetailsDivId');
            jQuery(rowObj).find(".card-label.parentPropertycard-label").text('Subject Property Details ' + cnt);
            jQuery(rowObj).find(".card-toolbar.parentPropertycard-toolbar ").html('<a href="javascript:void(0)" onclick="removePropertyAddress(' + cnt + ')" class="btn btn-sm btn-danger btn-text-primary  btn-icon mr-1  tooltipClass " title="" data-original-title="Click to remove Subject Property Details ' + cnt + '">\n' +
                '<i class="  icon-md fas fa-minus-circle  "></i></a><a href="javascript:void(0)" data-toggle="tooltip" \n' +
                'data-original-title="Click To Open/Close Subject Property Details"  onclick="javascript: showAndPropertyDetails(\'property' + cnt + 'DetailsDivId\'); setOpenOrClosePropertyDetailsDiv(\'property' + cnt + 'DetailsDivId\')" data-placement="top" class="btn btn-icon btn-sm btn-hover-light-primary ml-2 property' + cnt + 'DetailsDivIdToggle">' +
                '<i class="ki ki-arrow-down icon-nm arrowClass"></i></a>');
            jQuery(rowObj).find("#divBasementFinish").attr('id', 'divBasementFinish_d' + cnt);
            jQuery(rowObj).find(".obtainInteriorAccess_disp").addClass('secHide');

            jQuery(rowObj).find("label").not('.rentRollLabel').each(function (i) {
                var attr1 = $(this).attr('for');
                if (typeof attr1 !== 'undefined' && attr1 !== false) {
                    var forVal = $(this).attr('for');
                    $(this).attr('for', forVal + cnt);
                }
            });
            jQuery(rowObj).find(".radio-solid").not('.rentRollLabel').each(function (i) {
                var attr1 = $(this).attr('for');

                // For some browsers, `attr` is undefined; for others,
                // `attr` is false.  Check for both.
                if (typeof attr1 !== 'undefined' && attr1 !== false) {
                    var forVal = $(this).attr('for');
                    if (cnt > 9) {
                        forVal = forVal.slice(0, -2);
                    } else {
                        forVal = forVal.slice(0, -1);
                    }
                    $(this).attr('for', forVal + cnt);
                }

            });


            jQuery(rowObj).find(".zillowLink").each(function (i) {

                if ($(this).attr('id') == 'zillowValueLink') {
                    var attr1 = $(this).attr('onclick');
                    // For some browsers, `attr` is undefined; for others,
                    // `attr` is false.  Check for both.
                    if (typeof attr1 !== 'undefined' && attr1 !== false) {
                        //var forVal = $(this).attr('onclick');
                        $(this).attr('onclick', "buildurlMulti(this,'" + cnt + "')");
                        $(this).attr('href', "#");
                        $(this).attr('id', 'zillowValueLink' + cnt);
                    }
                }

            });

            jQuery(rowObj).find(".rentRollSectionClass:not(:first-child)").remove();

            console.log('Rent Roll Section : ' + jQuery(rowObj).find(".rentRollSectionClass").length);

            jQuery(rowObj).find(".condoEligibility_disp").attr('class', 'propchar'+cnt+' condoEligibility'+cnt+' row form-group col-md-6 condoEligibility_disp d-none');


            jQuery(rowObj).find('.rentRollSectionClass').each(function (i) {
                $(this).removeClass(function (index, css) {
                    return (css.match(/\brentRollSection_\S+/g) || []).join(' '); // removes anything that starts with "itemnx"
                });
                var attrValId = this.id;
                innerSecDivArray = attrValId.split('_');
                if (innerSecDivArray.length == 3) {
                    $(this).attr('id', innerSecDivArray[0] + '_' + 'p' + cnt + '_' + (parseInt(innerSecDivArray[2])));
                }
                $(this).addClass('rentRollSection_p' + cnt);
            });

            jQuery(rowObj).find('.icrementIdClass').each(function (i) {
                $(this).removeClass(function (index, css) {
                    return (css.match(/\bincrementId_\S+/g) || []).join(' '); // removes anything that starts with "itemnx"
                });
                $(this).addClass('incrementId_p' + cnt);
            });

            jQuery(rowObj).find(':input.rentRollFields ').each(function (i) {
                var attrValId = this.id;
                innerSecDivArray = attrValId.split('_');
                if (innerSecDivArray.length == 3) {
                    $(this).attr('id', innerSecDivArray[0] + '_' + 'p' + cnt + '_' + (parseInt(innerSecDivArray[2])));
                }
                var attrValName = this.name;
                $(this).attr('name', attrValName.replace('[p0]', '[p' + cnt + ']'));

                if (this.type == 'radio') {
                    $(this).prop("checked", false);
                } else {
                    jQuery(this).val('');
                }
            });
            jQuery(rowObj).find('.cloneFormButtonHtml ').each(function (i) {
                $(this).html("<a href=\"javascript:void(0)\" class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass cloneFormButton\" onclick=\"cloneForm( 'rentRollSection_p" + cnt + "', 'incrementId_p" + cnt + "')\" title=\"Click to add new row.\"><i class='icon-md fas fa-plus'></i></a>");
            });
            jQuery(rowObj).find('.chosen-container ').remove();

            jQuery(rowObj).find('label.rentRollLabel').each(function (i) {
                try {
                    attrVal = $(this).attr('for');
                    innerSecDivArray = attrVal.split('_');
                    if (innerSecDivArray.length == 3) {
                        $(this).attr('for', innerSecDivArray[0] + '_' + 'p' + cnt + '_' + (parseInt(innerSecDivArray[2])));
                    }
                } catch (e) {
                }
            });


            jQuery(rowObj).find(':input, i ').not('.rentRollFields').each(function (i) {
                // var idArr = [];
                var idArr = this.id;
                // idArr = elmId.split('_');
                if (this.type != 'radio') {
                    switch (idArr) {
                        case 'propertyState':
                            subjectStateJson = $('#subjectStateJson').val();
                            if (subjectStateJson != '') {
                                $(this).empty();
                                subjectStateJson = JSON.parse(subjectStateJson);
                                $(this).append($('<option>', {
                                    text: '- Select -',
                                    value: ''
                                }));
                                Object.values(subjectStateJson).forEach(mplObject => {
                                    $(this).append($('<option>', {
                                        text: mplObject.stateName,
                                        value: mplObject.stateCode
                                    }));
                                })
                            }
                            $(this).attr('onchange', "populateStateCounty('loanModForm', '" + idArr + cnt + "','propertyCounty" + cnt + "')");
                            break;
                        case 'baseHome':
                            $(this).attr('onchange', "toggleSwitch('" + idArr + cnt + "','basementHome" + cnt + "','1','0');showmultipleBasementFinishDiv('basementHome" + cnt + "','divBasementFinish_d" + cnt + "');");
                            break;
                        case 'baseFinish':
                            $(this).attr('onchange', "toggleSwitch('baseFinish" + cnt + "','basementFinish" + cnt + "','1','0')");
                            break;
                        case 'zillowValue':
                            $(this).attr('onchange', "currencyConverter(this,this.value)");
                            break;
                        case 'waterFront1':
                            $(this).attr('onchange', "toggleSwitch('wF" + cnt + "','waterFront" + cnt + "','1','0')");
                            break;
                        case 'propertyType':
                            let subjectPropertyJson = $('#subjectPropertyJson').val();
                            if (subjectPropertyJson != '') {
                                $(this).empty();
                                let subjectPropertyJsonObj = JSON.parse(subjectPropertyJson);
                                Object.values(subjectPropertyJsonObj).forEach(mplObject => {
                                    if (mplObject.GpropertyTypeNumbKey == 1000) {
                                        $(this).append('<option disabled style="color:white;background-color: rgb(0, 130, 187);">---Residential---</option>');
                                    } else if (mplObject.GpropertyTypeNumbKey == 1001) {
                                        $(this).append('<option disabled style="color:white;background-color: rgb(0, 130, 187);">---Commercial---</option>');
                                    } else {
                                        $(this).append($('<option>', {
                                            text: mplObject.GpropertyTypeNumbVal,
                                            value: mplObject.GpropertyTypeNumbKey
                                        }));
                                    }
                                })
                            }
                            $(this).attr('onclick', "showAndHideZillowValue(this.value,'div_zillowValue');showHidecondoEligibility(this.value,'condoEligibility"+cnt+"')");
                            break;
                        case 'zillowValueLink':
                            $(this).attr('onclick', "buildurlMulti(this,'" + cnt + "')");
                            $(this).attr('href', "");
                            break;
                        case 'homeGarage':
                            $(this).attr('onchange', "toggleSwitch('homeGarage" + cnt + "','garageHome" + cnt + "','1','0')");
                            break;

                    }
                    if (idArr == 'waterFront1') {
                        $(this).attr('id', 'wF' + cnt);
                    } else {
                        $(this).attr('id', idArr + cnt);
                    }
                    $(this).attr('name', idArr + cnt);
                    //$(this).attr('for', idArr+ cnt);
                }
                $(this).attr('tabindex', tabIndex); // | Tabindex change
                if (this.type == 'radio') {
                    //var nameArr = [];
                    var radioname = this.name;
                    var idval = this.id;
                    //nameArr = radioname.split('_');
                    $(this).attr('name', radioname + cnt);
                    $(this).attr('id', idval + cnt);
                    $(this).prop("checked", false);
                } else {
                    jQuery(this).val('');
                }
            });

            $(".multipleSubProp").append(rowObj);
            $('.dateClass').datepicker({
                autoclose: true,
                changeMonth: true,
                changeYear: true,
                dateFormat: 'mm/dd/yy'
            });
            $('.chzn-select').chosen({allow_single_deselect: true})


            //   var url = siteSSLUrl + "backoffice/checkClientExists.php";


            $('.propertyTaxDueDateClass').datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: 'mm/dd/yy',
                onSelect: function (dateText, inst) {
                    $(this).focus();
                },
            });
            $(".mask_phone:enabled").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});

            //Remove / Empty the url link href after the div append
            jQuery(rowObj).find(".propertyURLLink1").each(function (i) {
                $('.propertyURLLink1:last').attr('href', "javascript:void(0)");
            });
            jQuery(rowObj).find(".propertyURLLink2").each(function (i) {
                $('.propertyURLLink2:last').attr('href', "javascript:void(0)");
            });
        }
    } else {
        toastrNotification('Can not add more than the properties collateralized', 'error')
    }

}

function removePropertyAddress(propCount) {
    if ($('.subPropDetails').length > 1) {
        $('#PropertyDetailsSectionDiv' + propCount).remove();
        var noOfProp = $('#noOfPropertiesAcquiring').val() - 1;
        $('#noOfPropertiesAcquiring').val(noOfProp);
        $('#noOfPropertiesAcquiring_mirror').val(noOfProp);
        let deleteThisId = $('#blanketLoanSID' + propCount).val();
        $('#deleteThisId' + propCount).val(deleteThisId);
        enableSaveButton();
    } /*else {
        toastrNotification('Please delete the last property address details', 'error')
    }*/
}

function addContactInfo(tabIndex, mainSec, innerSec, pcid, publicUser) {
    var rowObj = $('.' + innerSec + ':last').clone();
    var divId = rowObj.attr('id');
    var divIdArray = divId.split('_');
    var index = parseInt(divIdArray[1]);
    index = index + 1;
    jQuery(rowObj).find(".card-body").attr('style', 'display:block');
    jQuery(rowObj).attr('id', innerSec + '_' + index);
    var displayCount = ($("." + innerSec).length) + 1;
    var title = '';
    switch (innerSec) {
        case 'insuranceAgentInfoDiv':
            jQuery(rowObj).find(".instoolbar").attr('data-body-id', 'inscBody_' + index);
            jQuery(rowObj).find(".editFileContacCls").attr('onClick', "allowToEditFileContacts('insContactCls" + index + "','insPrimContactCls" + index + "','Clear');");
            jQuery(rowObj).find(".card-body").attr('id', 'inscBody_' + index);
            jQuery(rowObj).find(".card-label").text('Insurance Agent Info : ' + displayCount);
            tabIndex = $(".insuranceAgentInfoDiv").last().find('.proIncRepNotes').attr('tabindex');
            title = 'Insurance Agent Info ';
            break;
        case 'attorneyInfoDiv':
            jQuery(rowObj).find(".attorneytoolbar").attr('data-body-id', 'attorneyBody_' + index);
            jQuery(rowObj).find(".editAttrFileContacCls").attr('onClick', "allowToEditFileContacts('titleAttorneyContactCls" + index + "','titleAttorneyPrimContactCls" + index + "','Clear');");
            jQuery(rowObj).find(".card-body").attr('id', 'attorneyBody_' + index);
            jQuery(rowObj).find(".card-label").text('Attorney Info : ' + displayCount);
            tabIndex = $(".attorneyInfoDiv").last().find('.titleAttorneyZipCls').attr('tabindex');
            title = 'Attorney Info ';
            break;
        case 'escrowInfoDiv':
            jQuery(rowObj).find(".escrowtoolbar").attr('data-body-id', 'escrowBody_' + index);
            jQuery(rowObj).find(".editEscrowFileContacCls").attr('onClick', "allowToEditFileContacts('escrowContactCls" + index + "','escrowPrimContactCls" + index + "','Clear');");
            jQuery(rowObj).find(".card-body").attr('id', 'escrowBody_' + index);
            jQuery(rowObj).find(".card-label").text('Escrow Info : ' + displayCount);
            tabIndex = $(".escrowInfoDiv").last().find('.escrowZipCls').attr('tabindex');
            title = 'Escrow Info ';
            break;
        case 'titleInfoDiv':
            jQuery(rowObj).find(".titletoolbar").attr('data-body-id', 'titleBody_' + index);
            jQuery(rowObj).find(".editTitleFileContacCls").attr('onClick', "allowToEditFileContacts('titleRepContactCls" + index + "','titleRepPrimContactCls" + index + "','Clear');");
            jQuery(rowObj).find(".card-body").attr('id', 'titleBody_' + index);
            jQuery(rowObj).find(".card-label").text('Title Info : ' + displayCount);
            tabIndex = $(".titleInfoDiv").last().find('.titleNotesCls').attr('tabindex');
            title = 'Title Info ';
            break;
        case 'GOGInfoDiv':
            jQuery(rowObj).find(".gogtoolbar").attr('data-body-id', 'gogBody_' + index);
            jQuery(rowObj).find(".card-body").attr('id', 'gogBody_' + index);
            jQuery(rowObj).find(".card-label").text('Gifts Or Grants : ' + displayCount);
            tabIndex = $(".gogInfoDiv").last().find('.gogcashCls').attr('tabindex');
            jQuery(rowObj).find(".sourceTypeCls").attr('name', 'sourceType_' + displayCount + '[]');
            jQuery(rowObj).find(".sourceTypeHiddenCls").attr('name', 'sourceTypeHidden_' + displayCount + '[]');
            title = 'Gifts Or Grants ';
            break;
        case 'ONMInfoDiv':
            jQuery(rowObj).find(".ONMtoolbar").attr('data-body-id', 'ONMBody_' + index);
            jQuery(rowObj).find(".card-body").attr('id', 'ONMBody_' + index);
            jQuery(rowObj).find(".card-label").text('Other New Mortgage Loans : ' + displayCount);
            tabIndex = $(".ONMInfoDiv").last().find('.ONMCls').attr('tabindex');
            title = 'Other New Mortgage Loans ';
            break;
        case 'LOLiabilitiesDiv':
            jQuery(rowObj).find(".lotoolbar").attr('data-body-id', 'loBody_' + index);
            jQuery(rowObj).find(".card-body").attr('id', 'loBody_' + index);
            jQuery(rowObj).find(".card-label").text('Other Liabilities and Expenses : ' + displayCount);
            tabIndex = $(".LOLiabilitiesDiv").last().find('.loCls').attr('tabindex');
            title = 'Other Liabilities and Expenses ';
            break;

    }
    jQuery(rowObj).find(':input').each(function (i) {
        var idArr = this.id.split('_');
        if (this.type != 'radio') {
            $(this).attr('id', idArr[0] + '_' + index);
            if ($(this).attr('name') == 'proInsZip[]') {
                $(this).attr('class', 'form-control input-sm zipCode insContactCls' + index);
            } else if ($(this).attr('name') == 'proIncPh[]') {
                $(this).attr('class', 'form-control input-sm mask_phone insContactCls' + index);
            } else if ($(this).attr('name') == 'proInsFirstName[]') {
                $(this).attr('class', 'form-control input-sm insPrimContactCls' + index);
                if (pcid != 3572 && publicUser != 1) {
                    $(this).attr('onClick', "populateContactName('insuranceCompany', this.value," + index + ");");
                }
            } else if ($(this).attr('name') == 'proInsLastName[]') {
                if (pcid != 3572 && publicUser != 1) {
                    $(this).attr('onClick', "populateContactName('insuranceCompanyLName', this.value," + index + ");");
                }
            } else if ($(this).attr('name') == 'insuranceCompanyCarrierName[]') {
                if (pcid != 3572 && publicUser != 1) {
                    $(this).attr('onClick', "populateContactName('insuranceCompanyCName', this.value," + index + ");");
                }
            } else if ($(this).attr('name') == 'insuranceCompanyIDOnLoad[]' || $(this).attr('name') == 'titleAttorneyIDOnLoad[]' || $(this).attr('name') == 'escrowIDOnLoad[]' || $(this).attr('name') == 'representativeIDOnLoad[]') {

            } else if ($(this).attr('name') == 'titleAttorneyZip[]') {
                $(this).attr('class', 'form-control zipCode  titleAttorneyZipCls input-sm titleAttorneyContactCls' + index + ' titleAttorneyPrimContactCls' + index);
            } else if ($(this).attr('name') == 'titleAttorneyPhoneNumber[]') {
                $(this).attr('class', 'form-control input-sm mask_phone titleAttorneyPrimContactCls' + index);
            } else if ($(this).attr('name') == 'titleAttorneyName[]') {
                $(this).attr('class', 'form-control input-sm titleAttorneyPrimContactCls' + index);
                if (publicUser != 1) {
                    $(this).attr('onClick', "populateContactName('attorney', this.value," + index + ");");
                }
            } else if ($(this).attr('name') == 'titleAttorneyFirmName[]') {
                $(this).attr('class', 'form-control input-sm titleAttorneyPrimContactCls' + index);
                if (publicUser != 1) {
                    $(this).attr('onClick', "populateContactName('attorneyCName', this.value," + index + ");");
                }
            } else if ($(this).attr('name') == 'escrowOfficer[]') {
                $(this).attr('class', 'form-control input-sm escrowPrimContactCls' + index);
                if (pcid != 3572 && publicUser != 1) {
                    $(this).attr('onClick', "populateContactName('escrow', this.value," + index + ");");
                }
            } else if ($(this).attr('name') == 'escrowOfficerLName[]') {
                $(this).attr('class', 'form-control input-sm escrowPrimContactCls' + index);
                if (pcid != 3572 && publicUser != 1) {
                    $(this).attr('onClick', "populateContactName('escrowLName', this.value," + index + ");");
                }
            } else if ($(this).attr('name') == 'escrowOfficerFirmName[]') {
                $(this).attr('class', 'form-control input-sm escrowPrimContactCls' + index);
                if (pcid != 3572 && publicUser != 1) {
                    $(this).attr('onClick', "populateContactName('escrowCName', this.value," + index + ");");
                }
            } else if ($(this).attr('name') == 'escrowOfficerPhone[]' || $(this).attr('name') == 'escrowOfficertollFree[]') {
                $(this).attr('class', 'form-control input-sm escrowPhoneNumberAutoPopulate mask_phone escrowContactCls' + index);
            } else if ($(this).attr('name') == 'escrowOfficerFax[]' || $(this).attr('name') == 'escrowOfficerCell[]') {
                $(this).attr('class', 'form-control input-sm escrowPhoneNumberAutoPopulate mask_cellnew escrowContactCls' + index);
            } else if ($(this).attr('name') == 'escrowZip[]') {
                $(this).attr('class', 'form-control input-sm escrowZipCls zipCode escrowContactCls' + index);
            } else if ($(this).attr('name') == 'contact[]') {
                $(this).attr('class', 'form-control input-sm titleRepPrimContactCls' + index);
                if (pcid != 3572 && publicUser != 1) {
                    $(this).attr('onClick', "populateContactName('title', this.value," + index + ");");
                }
            } else if ($(this).attr('name') == 'titleContactLName[]') {
                $(this).attr('class', 'form-control input-sm titleRepPrimContactCls' + index);
                if (pcid != 3572 && publicUser != 1) {
                    $(this).attr('onClick', "populateContactName('titleLName', this.value," + index + ");");
                }
            } else if ($(this).attr('name') == 'tempRepresentativeCName[]') {
                $(this).attr('class', ' titleRepContactCls' + index);
            } else if ($(this).attr('name') == 'titleCo[]') {
                $(this).attr('class', 'form-control input-sm titleRepPrimContactCls' + index);
                if (pcid != 3572 && publicUser != 1) {
                    $(this).attr('onClick', "populateContactName('titleCName', this.value," + index + ");");
                }
            } else if ($(this).attr('name') == 'titlePhoneNumber[]' || $(this).attr('name') == 'titletollFree[]') {
                $(this).attr('class', 'form-control input-sm titlePhoneNumberAutoPopulate mask_phone titleRepContactCls' + index);
            } else if ($(this).attr('name') == 'tilteCellNo[]' || $(this).attr('name') == 'titleFax[]') {
                $(this).attr('class', 'form-control input-sm mask_cellnew titleCellNumberAutoPopulate titleRepContactCls' + index);
            } else if ($(this).attr('name') == 'allowLiabilityAtorBeforeClose[]') {
                $(this).attr('onchange', "toggleSwitch('allowLiabilityAtorBeforeClose_" + index + "','liabilityAtorBeforeClose_" + index + "','1','0' );");
                $(this).attr('class', 'switch-off');
                $(this).removeAttr("checked");
            } else {
                if (innerSec == 'insuranceAgentInfoDiv') {
                    $(this).attr('class', 'form-control input-sm insContactCls' + index);
                }
                if (innerSec == 'attorneyInfoDiv') {
                    if ($(this).attr('name') == 'titleAttorneyBarNo[]' || $(this).attr('name') == 'titleAttorneyEmail[]' || $(this).attr('name') == 'titleAttorneyAddress[]' || $(this).attr('name') == 'titleAttorneyCity[]' || $(this).attr('name') == 'titleAttorneyState[]') {
                        $(this).attr('class', 'form-control input-sm titleAttorneyContactCls' + index);
                    } else {
                        $(this).attr('class', 'form-control input-sm titleAttorneyPrimContactCls' + index + ' titleAttorneyContactCls' + index);
                    }

                }
                if (innerSec == 'escrowInfoDiv') {
                    $(this).attr('class', 'form-control input-sm escrowContactCls' + index);
                }
                if (innerSec == 'titleInfoDiv') {
                    $(this).attr('class', 'form-control input-sm titleRepContactCls' + index);
                }
            }

        }
        $(this).attr('tabindex', tabIndex); // | Tabindex change
        if (this.type == 'radio') {

            var radioname = this.name;
            var idval = this.id;

            if (innerSec == 'GOGInfoDiv') {
                var nameArr = [];
                nameArr = radioname.split('_');
                $(this).attr('name', nameArr[0] + '_' + displayCount);
                $(this).attr('id', idval + displayCount);
            } else {
                $(this).attr('name', radioname + index);
                $(this).attr('id', idval + index);
            }
            $(this).prop("checked", false);
        } else {
            jQuery(this).val('');
        }
    });

    jQuery(rowObj).find('.chosen-container').remove().end()
        .find('.chzn-select').show().end();

    $("." + mainSec).append(rowObj);

    if (innerSec == 'GOGInfoDiv') {
        if ($('.GOGInfoDiv').length <= 1) {
            $('#gogAdd').removeClass('d-none');
        } else {
            $('#gogAdd').addClass('d-none');
        }
    }
    if (innerSec == 'ONMInfoDiv') {
        if ($('.ONMInfoDiv').length <= 1) {
            $('#gONMAdd').removeClass('d-none');
        } else {
            $('#ONMAdd').addClass('d-none');
        }
    }
    var ks = 0;
    var rowIndex = 1;
    jQuery("." + innerSec).each(function (i) {
        var idArray = ($(this).attr('id')).split('_');
        if (i != 0) {
            //$(this).attr('id', innerSec+"_" + i);
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" onclick=\"removeContactInfo(" + (idArray[1]) + ", '" + innerSec + "','" + mainSec + "'," + pcid + "," + publicUser + ")\" title=\"Click to remove " + title + (i + 1) + ".\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        } else {
            $(this).find('.actionIcons').html("<a href=\"javascript:void(0)\" class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass d-none\" onclick=\"removeContactInfo(" + (idArray[1]) + ",'" + innerSec + "','" + mainSec + "'," + pcid + "," + publicUser + ")\" title=\"Click to remove " + title + (i + 1) + ".\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        }
        if (($('.' + innerSec).length - 1) == ks) {
            var hideAdd = '';
            if ((innerSec == 'GOGInfoDiv' && $('.GOGInfoDiv').length > 1) || (innerSec == 'ONMInfoDiv' && $('.ONMInfoDiv').length > 1)) {
                hideAdd = ' d-none ';
            }
            $(this).find('.actionIcons').html("<label class='col-md-2 no-padding " + hideAdd + " ' style='color: #0462b3'> Add " + title + "</label><a href=\"javascript:void(0)\" class='btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass " + hideAdd + "' onclick=\"addContactInfo('" + tabIndex + "', '" + mainSec + "', '" + innerSec + "'," + pcid + "," + publicUser + ")\" title=\"Click to add new row.\"><i class='icon-md fas fa-plus'></i></a><a class=\"fa btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass\" href=\"javascript:void(0)\" onclick=\"removeContactInfo(" + (idArray[1]) + ",'" + innerSec + "','" + mainSec + "'," + pcid + "," + publicUser + ")\" title=\"Click to remove " + title + (i + 1) + ".\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        }
        ks++;
    });

    $('.chzn-select').chosen({allow_single_deselect: true})
    $(".mask_phone:enabled").inputmask("mask", {mask: "(999) 999 - 9999 Ext 9999"});
    $('.zipCode:enabled').inputmask("99999");
    $('.mask_ACTNumber').inputmask('999999999999999999');
}

function cloneForm(innerSec, icrementSec) {

    /*    var rowObj = $('.' + innerSec + ':last');
        var divId = rowObj.attr('id');
        var divIdArray = divId.split('_');
        var inputIdCnt = parseInt(divIdArray[1]);
        newInputId = inputIdCnt + 1;*/

    var rowObj = $('.' + innerSec + ':last').clone();
    var divId = rowObj.attr('id');
    var divIdArray = divId.split('_');
    var inputIdCnt = parseInt(divIdArray[parseInt(divIdArray.length) - 1]);
    newInputId = inputIdCnt + 1;
    mainSecLength = $('.' + innerSec).length;

    // var i = $('.'+innerSec).length + 1;

    $('.' + innerSec).last().clone()
        .attr('id', function (idx, attrVal) {
            try {
                innerSecDivArray = attrVal.split('_');
                if (innerSecDivArray.length == 3) {
                    return innerSecDivArray[0] + '_' + innerSecDivArray[1] + '_' + (parseInt(innerSecDivArray[2]) + 1);
                }
            } catch (e) {
            }
        })
        .find(":input")
        .attr('id', function (idx, attrVal) {
            try {
                innerSecDivArray = attrVal.split('_');
                if (innerSecDivArray.length == 3) {
                    return innerSecDivArray[0] + '_' + innerSecDivArray[1] + '_' + (parseInt(innerSecDivArray[2]) + 1);
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
            if (attrVal == 'radio') {
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
                return innerSecDivArray[0] + '_' + innerSecDivArray[1] + '_' + (parseInt(innerSecDivArray[2]) + 1);
            }
        } catch (e) {
        }
    }).end()
        .find('.' + icrementSec).html(newInputId + 1).end()
        .find('.removeCloneButton').removeClass('d-none').end()
        .insertAfter('.' + innerSec + ':last');

    $('.chzn-select').chosen({allow_single_deselect: true})

    return false;

}

$(document).on('click', '.removeCloneButton', function (e) {
    if ($(this).parents('.rentRollSectionClass').length == 1) {
        $(this).parents('.rentRollSectionClass').remove();
        incrementSecCnt = 1;
        jQuery('.' + incrementSec).each(function (i) {
            $(this).html(incrementSecCnt);
            incrementSecCnt++;
        });
    }
});


/*function removeClonedForm(mainSec,innerSec,incrementSec){
    if($('.'+mainSec).length > 1){
        $('#'+innerSec).remove();
        incrementSecCnt = 1;
        jQuery('.'+incrementSec).each(function (i) {
            $(this).html(incrementSecCnt);
            incrementSecCnt++;
        });
    }
}*/

function removeContactInfo(index, clsName, mainSec, pcid, publicUser) {
    var title = '';
    switch (clsName) {
        case 'insuranceAgentInfoDiv':
            var deletedInsuranceAgentId = '';
            if (deletedInsuranceAgentId == '') {
                deletedInsuranceAgentId = $('#insuranceCompanyID_' + index).val();
            } else {
                deletedInsuranceAgentId = deletedInsuranceAgentId + ',' + $('#insuranceCompanyID_' + index).val();
            }
            $('#deletedInsuranceAgentId').val(deletedInsuranceAgentId);
            title = 'Insurance Agent Info ';
            break;
        case 'attorneyInfoDiv':
            var deletedAttorneyId = '';
            if (deletedAttorneyId == '') {
                deletedAttorneyId = $('#titleAttorneyID_' + index).val();
            } else {
                deletedAttorneyId = deletedAttorneyId + ',' + $('#titleAttorneyID_' + index).val();
            }
            $('#deletedAttorneyId').val(deletedAttorneyId);
            title = 'Attorney Info ';
            break;
        case 'escrowInfoDiv':
            var deletedEscrowId = '';
            if (deletedEscrowId == '') {
                deletedEscrowId = $('#escrowID_' + index).val();
            } else {
                deletedEscrowId = deletedEscrowId + ',' + $('#escrowID_' + index).val();
            }
            $('#deletedEscrowId').val(deletedEscrowId);
            title = 'Escrow Info ';
            break;
        case 'titleInfoDiv':
            var deletedTitleId = '';
            if (deletedTitleId == '') {
                deletedTitleId = $('#representativeID_' + index).val();
            } else {
                deletedTitleId = deletedTitleId + ',' + $('#representativeID_' + index).val();
            }
            $('#deletedTitleId').val(deletedTitleId);
            title = 'Title Info ';
            break;
        case 'GOGInfoDiv':
            var deletedGOGId = '';
            if (deletedGOGId == '') {
                deletedGOGId = $('#gogID_' + index).val();
            } else {
                deletedGOGId = deletedGOGId + ',' + $('#gogID_' + index).val();
            }
            $('#deletedGOGId').val(deletedGOGId);
            title = 'Gifts Or Grants ';
            break;
        case 'ONMInfoDiv':
            var deletedONMId = '';
            if (deletedONMId == '') {
                deletedONMId = $('#propId_' + index).val();
            } else {
                deletedONMId = deletedONMId + ',' + $('#propId_' + index).val();
            }
            $('#deletedONMId').val(deletedONMId);
            title = 'Other New Mortgage Loans ';
            break;
        case 'LOLiabilitiesDiv':
            var deletedLOLId = '';
            deletedLOLId = $('#deletedLOLId').val();
            if (deletedLOLId == '') {
                deletedLOLId = $('#LOLID_' + index).val();
            } else {
                deletedLOLId = deletedLOLId + ',' + $('#LOLID_' + index).val();
            }
            $('#deletedLOLId').val(deletedLOLId);
            title = 'Other Liabilities and Expenses ';
            break;

    }
    $('#' + clsName + '_' + index).remove();
    if (clsName == 'GOGInfoDiv') {
        if ($('.GOGInfoDiv').length <= 1) {
            $('#gogAdd').removeClass('d-none');
        } else {
            $('#gogAdd').addClass('d-none');
        }
    }
    if (clsName == 'ONMInfoDiv') {
        if ($('.ONMInfoDiv').length <= 1) {
            $('#ONMAdd').removeClass('d-none');
        } else {
            $('#ONMAdd').addClass('d-none');
        }
    }
    var ks = 0;
    jQuery("." + clsName).each(function (i) {
        var idArray = ($(this).attr('id')).split('_');
        switch (clsName) {
            case 'insuranceAgentInfoDiv':
                if (($(this).find(".card-label").text()).substring(0, 23) == 'Insurance Agent Info : ') {
                    $(this).find(".card-label").text('Insurance Agent Info : ' + (i + 1));
                }
                break;
            case 'attorneyInfoDiv':
                if (($(this).find(".card-label").text()).substring(0, 16) == 'Attorney Info : ') {
                    $(this).find(".card-label").text('Attorney Info : ' + (i + 1));
                }
                break;
            case 'escrowInfoDiv':
                if (($(this).find(".card-label").text()).substring(0, 14) == 'Escrow Info : ') {
                    $(this).find(".card-label").text('Escrow Info : ' + (i + 1));
                }
                break;
            case 'titleInfoDiv':
                if (($(this).find(".card-label").text()).substring(0, 13) == 'Title Info : ') {
                    $(this).find(".card-label").text('Title Info : ' + (i + 1));
                }
                break;
            case 'GOGInfoDiv':
                if (($(this).find(".card-label").text()).substring(0, 18) == 'Gifts Or Grants : ') {
                    $(this).find(".card-label").text('Gifts Or Grants : ' + (i + 1));
                }
                break;
            case 'ONMInfoDiv':
                if (($(this).find(".card-label").text()).substring(0, 27) == 'Other New Mortgage Loans : ') {
                    $(this).find(".card-label").text('Other New Mortgage Loans : ' + (i + 1));
                }
                break;
            case 'LOLiabilitiesDiv':
                if (($(this).find(".card-label").text()).substring(0, 33) == 'Other Liabilities and Expenses : ') {
                    $(this).find(".card-label").text('Other Liabilities and Expenses : ' + (i + 1));
                }
                break;
        }
        if (i != 0) {
            $(this).find('.actionIcons').html("<a class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" href=\"javascript:void(0)\" onclick=\"removeContactInfo(" + (idArray[1]) + ", '" + clsName + "','" + mainSec + "'," + pcid + "," + publicUser + ")\" title=\"Click to remove " + title + (i + 1) + ".\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        } else {
            $(this).find('.actionIcons').html("<a class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass d-none\" href=\"javascript:void(0)\" onclick=\"removeContactInfo(" + (idArray[1]) + ",'" + clsName + "','" + mainSec + "'," + pcid + "," + publicUser + ")\" title=\"Click to remove " + title + (i + 1) + ".\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        }
        if (($('.' + clsName).length - 1) == ks) {
            $(this).find('.actionIcons').html("<label class='col-md-2 no-padding' style='color: #0462b3'> Add " + title + "</label><a class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass\" href=\"javascript:void(0)\" onclick=\"addContactInfo('', '" + mainSec + "', '" + clsName + "'," + pcid + "," + publicUser + ")\" title=\"Click to add new row.\"><i class=\" icon-md fas fa-plus \"></i></a><a class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass \" href=\"javascript:void(0)\" onclick=\"removeContactInfo(" + (idArray[1]) + ",'" + clsName + "','" + mainSec + "'," + pcid + "," + publicUser + ")\" title=\"Click to remove " + title + (i + 1) + ".\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
        }
        ks++;
    });
    if ($('.' + clsName).length == 1) {
        $('#' + clsName + '_1').find('.actionIcons').html("<label class='col-md-12 no-padding' style='color: #0462b3'> Add " + title + "</label><a class=\"btn btn-sm btn-success btn-text-primary  btn-icon ml-2 tooltipClass\" href=\"javascript:void(0)\" onclick=\"addContactInfo('', '" + mainSec + "', '" + clsName + "'," + pcid + "," + publicUser + ")\" title=\"Click to add new row.\"><i class=\" icon-md fas fa-plus \"></i></a><a class=\"btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass d-none\" href=\"javascript:void(0)\" onclick=\"removeContactInfo(" + ($('.' + clsName).length) + ",'" + clsName + "','" + mainSec + "'," + pcid + "," + publicUser + ")\" title=\"Click to remove insurance agent info.\"><i class=\"  icon-md fas fa-minus-circle  \"></i></a>");
    }
    enableSaveButton();
}

/* This is used in automation */
$(document).ready(function () {
    $('#primaryStatus, #statusId').on('change', function () {
        let psVal = $(this).val();
        if ($('#lastUpdatedParam').length > 0 && psVal != '') {
            $('#lastUpdatedParam').val('PFS');
        }
    });
});

function isNumberOnly(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function numericValues(el, evt) {
    var beforeDecimal = 10;
    var afterDecimal = 2;

    $('#' + el.id).on('input', function () {
        this.value = this.value
            .replace(/[^\d.]/g, '')
            .replace(new RegExp("(^[\\d]{" + beforeDecimal + "})[\\d]", "g"), '$1')
            .replace(/(\..*)\./g, '$1')
            .replace(new RegExp("(\\.[\\d]{" + afterDecimal + "}).", "g"), '$1');
    })
}

function cloneFormAlternate(innerSec, icrementSec) {
    var rowObj = $('.' + innerSec + ':last').clone();
    var divId = rowObj.attr('id');
    var divIdArray = divId.split('_');
    var inputIdCnt = parseInt(divIdArray[parseInt(divIdArray.length) - 1]);
    newInputId = inputIdCnt + 1;
    mainSecLength = $('.' + innerSec).length;
    if (mainSecLength >= 2) {
        $('#alternameNameAddBtn').hide();
    } else {
        $('#alternameNameAddBtn').show();
        $('#alternameNameAddBtn').removeClass('d-none');
    }
    // var i = $('.'+innerSec).length + 1;
    tabIndex = $(".alternativeClass").last().find('.alternateNamesTabindex').attr('tabindex');
    $('.' + innerSec).last().clone()
        .attr('id', function (idx, attrVal) {
            try {
                innerSecDivArray = attrVal.split('_');
                if (innerSecDivArray.length == 2) {
                    return innerSecDivArray[0] + '_' + (parseInt(innerSecDivArray[1]) + 1);
                }
            } catch (e) {
            }
        })
        .find(":input")
        .attr('id', function (idx, attrVal) {
            try {
                innerSecDivArray = attrVal.split('_');
                if (innerSecDivArray.length == 2) {
                    return innerSecDivArray[0] + '_' + (parseInt(innerSecDivArray[1]) + 1);
                }
            } catch (e) {
            }
        })
        .attr('tabindex', function (idx, attrVal) {
            try {
                    return parseInt(tabIndex);

            } catch (e) {
            }
        })
        .attr('type', function (idx, attrVal) {
            if (attrVal == 'radio') {
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
            if (innerSecDivArray.length == 2) {
                return innerSecDivArray[0] + '_' + (parseInt(innerSecDivArray[1]) + 1);
            }
        } catch (e) {
        }
    }).end()
        .find('.removeButtonClass').html('<a href="javascript:void(0);"  class="btn btn-sm btn-danger btn-text-primary  btn-icon ml-2 tooltipClass removeAlternateDetails " title="" data-original-title="Click to Delete">\n' +
        '                                        <i class=" icon-md fas fa-minus-circle "></i>\n' +
        '                                    </a>').end()
        .find('.' + icrementSec).html(newInputId).end()
        .insertAfter('.' + innerSec + ':last');
    enableSaveButton();
}

$(document).ready(function () {
    $("body").on("click", ".removeAlternateDetails", function () {
        $(this).parents('.alternativeClass').remove();
        enableSaveButton();
        mainSecLength = $('.alternativeClass').length;
        if (mainSecLength >= 3) {
            $('#alternameNameAddBtn').hide();
        } else {
            $('#alternameNameAddBtn').show();
            $('#alternameNameAddBtn').removeClass('d-none');
        }
    });
});

function enableSaleFields(id, value) {
    var data = id.split("_");
    if (value == 'Sold') {
        $('.salesDispOpt_' + data[1]).css('display', 'block');
        $('.mortgageInfo_' + data[1]).css('display', 'none');
        $('.incomeValuesInfo_' + data[1]).css('display', 'none');
    } else {
        $('.salesDispOpt_' + data[1]).css('display', 'none');
        $('.mortgageInfo_' + data[1]).css('display', 'block');
        $('.incomeValuesInfo_' + data[1]).css('display', 'block');
    }
}


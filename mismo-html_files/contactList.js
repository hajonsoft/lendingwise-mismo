function showAndHideOtherDiv(fldVal, divId) {

    $('.showBarNo').css("display", 'none');
    $('.showEinNo').css("display", 'none');
    $('.showRepTitle').css("display", 'none');
    if (fldVal == 'Other') {
        document.getElementById(divId).style.display = 'block';
        document.getElementById('licenseNoDiv').style.display = 'none';
    } else if (fldVal == '2' || fldVal == '28') {
        document.getElementById('licenseNoDiv').style.display = 'block';
        document.getElementById(divId).style.display = 'none';
    } else if (fldVal == '3' || fldVal == '23') {
        $('.showBarNo').css("display", 'block');
    } else if (fldVal == '22' || fldVal == '36' || fldVal == '37') {
        $('.showEinNo').css("display", 'block');
        $('.showRepTitle').css("display", 'block');
    } else {
        document.getElementById('licenseNoDiv').style.display = 'none';
        document.getElementById(divId).style.display = 'none';
    }
}

function validateContactsForm() {
    if (chkIsBlank('contactForm', 'contactType', 'Please select contact type') && chkIsBlank('contactForm', 'contactName', 'Please enter contact name') && chkIsBlank('contactForm', 'companyName', 'Please enter company name') && chkIsBlank('contactForm', 'email', 'Please enter email')) {
        saveContacts();
    }
    return false;
}

function saveContacts() {
    $('#contactForm').ajaxSubmit({
        type: "POST",
        url: POPSURL + "contactsSaveNew.php",
        success: function (msg) {
            toastrNotification(msg, 'success');
            $('#contactPopupForm').modal('hide');
            window.location.reload();
        }
    });
}

function deleteCustomDocs(contactID, PCID, contactDocId) {
    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: "Are you sure to Delete the document?",
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            yes: function () {
                $.ajax({
                    url: POPSURL + "deleteContactDocs.php",
                    type: "post",
                    data: {contactID: contactID, PCID: PCID, contactDocId: contactDocId},
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    beforeSend: function () {

                    },
                    success: function (resp) {
                        if (resp > 0)
                            toastrNotification('File Deleted Successfully.', 'success', 1500);
                        else
                            toastrNotification('File Not Deleted.', 'error', 1500);
                        location.reload();

                    }
                });
            },
            cancel: function () {

            },
        },
        onClose: function () {

        },
    });
}

function editContacts(CID, LMRID, CTypeID, cRole, opt) {
    $("#CID").val(CID);
    $("#LMRID").val(LMRID);
    $("#cRole").val(cRole);

    var formIdToSubmit = $('#contactForm');

    ajaxUrl = $(formIdToSubmit).attr('action');
    var formData = $(formIdToSubmit).serialize();

    $.ajax({
        //$('#contactForm').ajaxSubmit({
        type: "POST",
        data: {'CID': CID},
        url: POPSURL + "getContactsInfo.php",
        success: function (myData) {
            var obj = jQuery.parseJSON(myData);
            $('#contactsUploadedDocsList').html('');

            if (obj["contactDocs"] !== undefined && obj['contactDocs'].length > 0) {
                var docData = '<table class="table table-bordered table-hover" id="tblContactsDocs"><thead><tr><th>Doc Name</th>';

                if (LMRID == 0 || LMRID == '') {
                    docData = docData + '<td></td>';
                }
                docData = docData + '</tr></thead>';

                for (var i = 0; i < obj['contactDocs'].length; i++) {
                    var docPath = $('#BOSSLURL').val() + 'viewDocuments.php?fn=' + obj['contactDocs'][i]['encryptedName'] + '&fd=' + obj['contactDocs'][i]['filePath'] + '&opt=enc&dn=' + obj['contactDocs'][i]['fileNameEncrypted'];

                    docData = docData + '<tr><td><a class="tip-bottom" style="text-decoration:none;" rel="nofollow" target="_blank" href="' + docPath + '" title="Click to view File Doc Info">' + obj['contactDocs'][i]['fileName'] + '</a></td>';

                    if (LMRID == 0 || LMRID == '') {
                        docData = docData + '<td><a href="javascript:void(0)"  class="actions" onclick="deleteCustomDocs(' + obj['contactDocs'][i]['contactID'] + ',' + obj['contactDocs'][i]['PCID'] + ',' + obj['contactDocs'][i]['ID'] + ')"> <i class="tooltipClass flaticon2-trash" aria-hidden="true" title="Click to delete document"></i></a></td>';
                    }

                    docData = docData + '</tr>';
                }
                docData = docData + '</table>';
                $('#contactsUploadedDocsList').html(docData);
            }
            var companyName = obj[0]["companyName"].replace('\\', '');
            var contactName = obj[0]["contactName"].replace('\\', '');
            var contactLName = obj[0]["contactLName"].replace('\\', '');

            $("#assignedToProcessingCompany").val(obj[0]["PCID"]);
            $("#PCID").val(obj[0]["PCID"]);
            $("#companyName").val(companyName);
            $("#contactType").val(obj[0]["CTypeID"]);
            $("#contactTypeonLoad").val(obj[0]["CTypeID"]);
            $("#contactName").val(contactName);
            $("#contactLName").val(contactLName);
            $("#email").val(obj[0]["email"]);
            $("#address").val(obj[0]["address"]);
            $("#city").val(obj[0]["city"]);
            $("#state").val(obj[0]["state"]);
            $("#zipCode").val(obj[0]["zip"]);
            $("#website").val(obj[0]["website"]);
            $("#phoneNumber").val(obj[0]["phone"]);
            $("#cellNumber").val(obj[0]["cell"]);
            $("#faxNumber").val(obj[0]["fax"]);
            $("#tollFree").val(obj[0]["tollFree"]);
            $('#contactFile-1').val("");
            $("#barNo").val(obj[0]["barNo"]);
            $("#stateOfFormation").val(obj[0]["stateOfFormation"]);
            $("#entityType").val(obj[0]["entityType"]);
            $("#einNo").val(obj[0]["einNo"]);
            $("#repTitle").val(obj[0]["repTitle"]);
            $("#description").val(obj[0]["description"]);
            $("#licenseNo").val(obj[0]["licenseNo"]);
            $("#other").val(obj[0]["other"]);

            $('.showBarNo').css("display", 'none');
            $('.showEinNo').css("display", 'none');
            $('.showRepTitle').css("display", 'none');
            if (obj[0]["CTypeID"] == 'Other') {
                document.getElementById('other').style.display = 'block';
                document.getElementById('licenseNoDiv').style.display = 'none';
            } else if (obj[0]["CTypeID"] == '2' || obj[0]["CTypeID"] == '28') {
                document.getElementById('licenseNoDiv').style.display = 'block';
                document.getElementById('other').style.display = 'none';
            } else if (obj[0]["CTypeID"] == '3' || obj[0]["CTypeID"] == '23') {
                $('.showBarNo').css("display", 'block');
            } else if (obj[0]["CTypeID"] == '22' || obj[0]["CTypeID"] == '36' || obj[0]["CTypeID"] == '37') {
                $('.showEinNo').css("display", 'block');
                $('.showRepTitle').css("display", 'block');
            } else {
                document.getElementById('licenseNoDiv').style.display = 'none';
                document.getElementById('other').style.display = 'none';
            }
        }
    });
    $('#contactPopupForm').modal('show');
}

function showSortableList(sortOpt, orderBy) {
    document.contactsForm.pageNumber.value = 1;
    document.contactsForm.sortOpt.value = sortOpt;
    document.contactsForm.orderBy.value = orderBy;
    document.contactsForm.submit();
}

function getContactInfo(CID, PCID) {
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
    try {
        document.getElementById('contactName').value = '';
    } catch (e) {
    }

    try {
        document.getElementById('companyName').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('contactLName').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('email').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('website').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('phoneNumber').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('tollFree').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('cellNumber').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('faxNumber').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('address').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('city').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('state').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('zipCode').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('description').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('contactType').value = '';
    } catch (e) {
    }
    try {
        document.getElementById('barNo').value = '';
    } catch (e) {
    }
    $('#stateOfFormation').val('');
    $('#entityType').val('');
    $('#einNo').val('');
    $('#repTitle').val('');
    for (var i = 0; i < contactList.length; i++) {
        try {
            document.getElementById('contactName').value = contactList[i].getElementsByTagName("contactName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('companyName').value = contactList[i].getElementsByTagName("companyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('contactLName').value = contactList[i].getElementsByTagName("contactLName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('email').value = contactList[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('website').value = contactList[i].getElementsByTagName("website")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('phoneNumber').value = contactList[i].getElementsByTagName("phoneNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('tollFree').value = contactList[i].getElementsByTagName("tollFree")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('cellNumber').value = contactList[i].getElementsByTagName("cellNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('faxNumber').value = contactList[i].getElementsByTagName("faxNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('address').value = contactList[i].getElementsByTagName("address")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('city').value = contactList[i].getElementsByTagName("city")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('state').value = contactList[i].getElementsByTagName("state")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('zipCode').value = contactList[i].getElementsByTagName("zip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('description').value = contactList[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('contactType').value = contactList[i].getElementsByTagName("CTypeID")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('barNo').value = contactList[i].getElementsByTagName("barNo")[0].childNodes[0].nodeValue;
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
            document.getElementById('einNo').value = contactList[i].getElementsByTagName("einNo")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            document.getElementById('repTitle').value = contactList[i].getElementsByTagName("repTitle")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        //$('#stateOfFormation').val(contactList[i].getElementsByTagName("stateOfFormation")[0].childNodes[0].nodeValue);
        /*$('#entityType').val(contactList[i].getElementsByTagName("entityType")[0].childNodes[0].nodeValue);
        $('#einNo').val(contactList[i].getElementsByTagName("einNo")[0].childNodes[0].nodeValue);
        $('#repTitle').val(contactList[i].getElementsByTagName("repTitle")[0].childNodes[0].nodeValue);*/
    }
}

function deleteContactInfo(CID) {
    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: "Are you sure delete this contact?",
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            yes: function () {
                var url = "../backoffice/deleteContactInfo.php";
                var qstr = "CID=" + CID;
                try {
                    xmlDoc = getXMLDoc(url, qstr);
                } catch (e) {
                }

                window.location.reload();
            },
            cancel: function () {

            },
        },

    });
}

function deleteFileContact(CID, FileID, cRole) {
    $.confirm({
        icon: 'fa fa-warning',
        closeIcon: true,
        title: 'Confirm',
        content: "Are you sure delete this contact?",
        type: 'red',
        backgroundDismiss: true,
        buttons: {
            yes: function () {
                $.ajax({
                    type: 'POST',
                    url: '../backoffice/deleteFileContact.php',
                    data: "CID=" + CID + "&FileID=" + FileID + "&cRole=" + cRole,
                    success: function (response) {
                        res = JSON.parse(response);
                        if (parseInt(res.code) === 100) {
                            toastrNotification(res.msg, 'success');
                            location.reload();
                        } else {
                            toastrNotification(res.msg, 'error');
                        }
                    }
                });

            },
            cancel: function () {

            },
        },

    });
}

function addContacts(HMLO, LMRID, tab, PCID = '') {
    $('#contactsUploadedDocsList').html('');
    $("#licenseNoDiv").hide();
    $("#other").hide();
    clear_form_elements('contactPopupForm');
    $("#contactTypeonLoad").val('');
    $('#contactPopupForm').modal('toggle');
    $("#ctLMRId").val(LMRID);
    $("#PCID").val(PCID);
    $("#assignedToProcessingCompany").val(PCID);
    showContactModal();
}

function showContactModal() {
    $("#contactPopupForm").draggable({
        handle: ".modal-header"
    });
}

function generateReport() {
    document.getElementById('generateCSV').value = 'Yes';
    $("#contactsForm").submit();
    return false;
}

/* eslint-disable no-empty */
var glTimeZoneArray = new Array("EST", "PST", "CST", "AST", "MST", "AKST", "HST", "UTC-11", "UTC+10", "IST");

function toggle_visibility(id) {
    var e = document.getElementById(id);
    if (e.style.display == 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
}

function showLoader() {
    try {
        document.getElementById("divLoader").style.display = 'block';
    } catch (e) {
    }
}

function hideLoader() {
    try {
        document.getElementById("divLoader").style.display = 'none';
    } catch (e) {
    }
}

function updatePageNumber(formName, pgNumb) {
    try {
        eval("document." + formName + ".pageNumber.value = " + pgNumb);
    } catch (e) {
        alert(e)
    }
    showLoader();
    try {
        eval("document." + formName + ".submit()");
    } catch (e) {
        alert(e)
    }
}

function toggleSwitch(divName, fldName, on, off) {
    var t1 = document.getElementById(fldName).value;
    if (t1 == on) {
        document.getElementById(fldName).value = off;
        document.getElementById(divName).className = "switch-off";
        if (fldName == 'lockLoanFileHidden') {
            document.getElementById('isFilelocked').value = 'No';
        }
    } else {
        document.getElementById(fldName).value = on;
        document.getElementById(divName).className = "switch-on";
        if (fldName == 'lockLoanFileHidden') {
            document.getElementById('isFilelocked').value = '';
        }
    }
}

function toggleSwitchSubChildShow(divName, fldName, on, off, className) {

    var t1 = document.getElementById(fldName).value;
    if (t1 == on) {
        $('.' + className).hide();
        $('.' + className + " > input").prop("readonly", true).attr("disabled", true);

        document.getElementById(fldName).value = off;
        document.getElementById(divName).className = "switch-off";
    } else {

        $('.' + className).show();
        $('.' + className + " > input").prop("readonly", false).attr("disabled", false);

        document.getElementById(fldName).value = on;
        document.getElementById(divName).className = "switch-on";

    }
}


/*
function replaceCommaValues(strInput1) {
    var strInput2 = 0;
	strInput1 = trim(strInput1);
    strInput = strInput1.replace(/,/g,'');
    strInput = strInput.replace(/ /g,'');
    strInput = strInput.replace('!@#$%^&*()','');
    strInput = strInput.replace('@','');
    strInput = strInput.replace('#','');
    strInput = strInput.replace('$','');
    strInput = strInput.replace('%','');
    strInput = strInput.replace('^','');
    strInput = strInput.replace('&','');
    strInput = strInput.replace('*','');
    strInput = strInput.replace('(','');
    strInput = strInput.replace(')','');
    strInput = strInput.replace('\'','');
    strInput = strInput.replace(/[a-zA-Z]/g,'');
    strInput = trim(strInput);
    strInput2 = trim(strInput);
    if(isNaN(strInput2)) {
        strInput = 0;
    }
    return strInput;
}
*/
function clearMyMsg(formName, fldName, textValue) {
    var inputValue = "";
    try {
        eval("inputValue = document." + formName + "." + fldName + ".value");
    } catch (e) {
    }
    inputValue = trim(inputValue);
    if (inputValue == textValue) {
        try {
            eval("document." + formName + "." + fldName + ".value = ''");
        } catch (e) {
        }
    }
}

function putMyMsg(formName, fldName, textValue) {
    var inputValue = "";
    try {
        eval("inputValue = document." + formName + "." + fldName + ".value");
    } catch (e) {
    }
    inputValue = trim(inputValue);
    if (inputValue == "") {
        try {
            eval("document." + formName + "." + fldName + ".value = textValue");
        } catch (e) {
        }
    }
}

function trim(strInput) {
    if (strInput != '' && strInput !== undefined) {
        try {
            strInput = strInput.replace(/^\s+/g, '').replace(/\s+$/g, '');
        } catch (e) {
        }
        return strInput.replace(/^\s+/g, '').replace(/\s+$/g, '');
    } else {
        return strInput;
    }
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function chkIsBlank_del(formName, fieldName, msg) {
    var fld = "", clsName = "";
    try {
        eval("fld = document." + formName + "." + fieldName + ".value");
        var clsName = document.getElementById(fieldName).className;
        if (clsName == "highlights") {
            document.getElementById(fieldName).className = "";
        }
    } catch (e) {
    }
    fld = trim(fld);
    if (fld == "") {
        var alrt = msg;
        //alert(alrt);
        toastrNotification(alrt, 'error');
        try {
            eval("document." + formName + "." + fieldName + ".focus()");
        } catch (e) {
        }
        try {
            document.getElementById(fieldName).className = "highlights";
        } catch (e) {
        }
        return false;
    } else {
        return true;
    }
}


function chkIsBlank(formName, elmId, msg) {
    var elmVal = '';
    if ($("#" + elmId).is(':visible')) {
        eval("elmVal = document." + formName + "." + elmId + ".value");
        if (elmVal == "") {
            $('#' + elmId).focus();
            toastrNotification(msg, 'error');
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

function replaceXMLProcess(inputString) {
    inputString = inputString.replace(/&ldquo;/g, '\"');
    inputString = inputString.replace(/&amp;/g, '&');
    inputString = inputString.replace(/&#60;/g, '<');
    inputString = inputString.replace(/&#62;/g, '>');
    inputString = inputString.replace(/&#39;/g, '\'');
    return inputString;
}

function isDateOK(formName, myDate, alertField) {
    var dd = 0;
    var mm = 0;
    var yy = 0;
    var lp = 0;
    var val = 0;
    var dispDate = "";
    eval("dispDate = document." + formName + "." + myDate + ".value");
    dispDate = dispDate.split("/");
    if (dispDate.length > 0) {
        for (var j = 0; j < dispDate.length; j++) {
            val = dispDate[j];
            if (parseInt(val, 10) > 0) {
                if (j == 0) {
                    yy = dispDate[2];
                }
                if (j == 1) {
                    mm = dispDate[0];
                }
                if (j == 2) {
                    dd = dispDate[1];
                }
            } else {
                //alert("Please Enter Valid Data For "+alertField);
                toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                eval("document." + formName + "." + myDate + ".focus()");
                return false;
            }
        }
    }
    if (dd == 0 || mm == 0 || yy == 0) {
        //alert("Please Enter Valid Data For "+alertField);
        toastrNotification("Please Enter Valid Data For " + alertField, 'error');
        eval("document." + formName + "." + myDate + ".focus()");
        return false;
    } else {
        if (yy.length != 4) {
            //alert("Please Enter Valid Data For "+alertField);
            toastrNotification("Please Enter Valid Data For " + alertField, 'error');
            eval("document." + formName + "." + myDate + ".focus()");
            return false;
        } else {
            lp = yy % 4;
            if (mm.length < 1) {
                //alert("Please Enter Valid Data For "+alertField);
                toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                eval("document." + formName + "." + myDate + ".focus()");
                return false;
            } else if (mm > 12) {
                //alert("Please Enter Valid Data For "+alertField);
                toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                eval("document." + formName + "." + myDate + ".focus()");
                return false;
            } else {
                if (lp == 0 && mm == 2) {
                    if (dd > 29) {
                        //alert("Please Enter Valid Data For "+alertField);
                        toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                        eval("document." + formName + "." + myDate + ".focus()");
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    if (mm == 2) {
                        if (dd > 28) {
                            //alert("Please Enter Valid Data For "+alertField);
                            toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                            eval("document." + formName + "." + myDate + ".focus()");
                            return false;
                        } else {
                            return true;
                        }
                    } else if ((mm == 4) || (mm == 6) || (mm == 9) || (mm == 11)) {
                        if (dd > 30) {
                            //alert("Please Enter Valid Data For "+alertField);
                            eval("document." + formName + "." + myDate + ".focus()");
                            toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        if (dd > 31) {
                            //alert("Please Enter Valid Data For "+alertField);
                            toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                            eval("document." + formName + "." + myDate + ".focus()");
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            }
        }
    }
}

function isDateOKForMMDDYY(formName, myDate, alertField) {
    var dd = 0;
    var mm = 0;
    var yy = 0;
    var lp = 0;
    var val = 0;
    var dispDate = "";
    try {
        eval("dispDate = document." + formName + "." + myDate + ".value");
    } catch (e) {
    }
    if (dispDate != "") {
        dispDate = dispDate.split("/");
        if (dispDate.length > 0) {
            for (var j = 0; j < dispDate.length; j++) {
                val = dispDate[j];
                if (parseInt(val, 10) > 0) {
                    if (j == 0) {
                        yy = dispDate[2];
                    }
                    if (j == 1) {
                        mm = dispDate[0];
                    }
                    if (j == 2) {
                        dd = dispDate[1];
                    }
                } else {
                    toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                    //alert("Please Enter Valid Data For "+alertField);
                    eval("document." + formName + "." + myDate + ".focus()");
                    return false;
                }
            }
        }
        if (dd == 0 || mm == 0 || yy == 0) {
            toastrNotification("Please Enter Valid Data For " + alertField, 'error');
            //alert("Please Enter Valid Data For "+alertField);
            eval("document." + formName + "." + myDate + ".focus()");
            return false;
        } else {
            if (yy.length != 4) {
                toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                //alert("Please Enter Valid Data For "+alertField);
                eval("document." + formName + "." + myDate + ".focus()");
                return false;
            } else {
                lp = yy % 4;
                if (mm.length < 1) {
                    toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                    //alert("Please Enter Valid Data For "+alertField);
                    eval("document." + formName + "." + myDate + ".focus()");
                    return false;
                } else if (mm > 12) {
                    toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                    //alert("Please Enter Valid Data For "+alertField);
                    eval("document." + formName + "." + myDate + ".focus()");
                    return false;
                } else {
                    if (lp == 0 && mm == 2) {
                        if (dd > 29) {
                            toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                            //alert("Please Enter Valid Data For "+alertField);
                            eval("document." + formName + "." + myDate + ".focus()");
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        if (mm == 2) {
                            if (dd > 28) {
                                toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                                //alert("Please Enter Valid Data For "+alertField);
                                eval("document." + formName + "." + myDate + ".focus()");
                                return false;
                            } else {
                                return true;
                            }
                        } else if ((mm == 4) || (mm == 6) || (mm == 9) || (mm == 11)) {
                            if (dd > 30) {
                                toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                                //alert("Please Enter Valid Data For "+alertField);
                                eval("document." + formName + "." + myDate + ".focus()");
                                return false;
                            } else {
                                return true;
                            }
                        } else {
                            if (dd > 31) {
                                toastrNotification("Please Enter Valid Data For " + alertField, 'error');
                                //alert("Please Enter Valid Data For "+alertField);
                                eval("document." + formName + "." + myDate + ".focus()");
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    } else {
        return true;
    }
}

function checkValidEmailId(formName, fldName) {
    var email = "", clsName = '';
    eval("email = document." + formName + "." + fldName + ".value");
    try {
        clsName = document.getElementById(fldName).className;
    } catch (e) {
    }
    try {
        if (clsName == "clsHighlights") {
            document.getElementById(fldName).className = "";
        }
    } catch (e) {
    }
    try {
        email = trim(email);
    } catch (e) {
    }
    if (email == "") {
        return true;
    }
    if ((email.indexOf("@") == -1) || (email.indexOf(".") == -1)) {
        // alert ('Enter a valid E-mail address!');
        toastrNotification('Enter a valid E-mail address!', 'error');
        eval("document." + formName + "." + fldName + ".focus()");
        eval("document." + formName + "." + fldName + ".select()");
        document.getElementById(fldName).className = "clsHighlights";
        return false;
    }
    if (!checkForSpecialCharacterEmail(formName, fldName)) {
        return false;
    } else {
        if (email.length < 8 || email.indexOf(" ") > 0) {
            toastrNotification('Check E-mail Address!', 'error');
            //alert("Check E-mail Address!");
            eval("document." + formName + "." + fldName + ".focus()");
            eval("document." + formName + "." + fldName + ".select()");
            document.getElementById(fldName).className = "clsHighlights";
            return false;
        }
    }
    return true;
}

function isEmailOk(formName, fldName) {
    var email = "";
    eval("email = document." + formName + "." + fldName + ".value");
    var clsName = document.getElementById(fldName).className;
    try {
        if (clsName.includes("highlights")) {
            document.getElementById(fldName).className = " form-control";
        }
    } catch (e) {
    }
    try {
        email = trim(email);
    } catch (e) {
    }
    if (email == "") {
        toastrNotification('Please enter E-mail address.', 'error');
        //alert ('Please enter E-mail address.');
        eval("document." + formName + "." + fldName + ".focus()");
        eval("document." + formName + "." + fldName + ".select()");
        document.getElementById(fldName).className = "highlights form-control";
        return false;
    }
    if ((email.indexOf("@") == -1) || (email.indexOf(".") == -1)) {
        toastrNotification('Enter a valid E-mail address!', 'error');
        //    	alert ('Enter a valid E-mail address!');
        eval("document." + formName + "." + fldName + ".focus()");
        eval("document." + formName + "." + fldName + ".select()");
        document.getElementById(fldName).className = "highlights form-control";
        return false;
    }
    if (!checkForSpecialCharacterEmail(formName, fldName)) {
        return false;
    } else {
        if (email.length < 8 || email.indexOf(" ") > 0) {
            toastrNotification('Check E-mail Address!', 'error');
            //            alert("Check E-mail Address!");
            eval("document." + formName + "." + fldName + ".focus()");
            eval("document." + formName + "." + fldName + ".select()");
            document.getElementById(fldName).className = "highlights form-control";
            return false;
        }
    }
    return true;
}

function checkForSpecialCharacterEmail(frmName, fldName) {
    var str = "";
    fldName = fldName;
    eval("str = trim(document." + frmName + "." + fldName + ".value)");

    if (/^[\w-+]+([\.-]?[\w-]+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(str)) {

        // Allow Single quote in email validation
        /*if (/^[\w-\\']+(\.[\w-\\']+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/.test(str)){*/
        /*alert("You have entered valid email.");*/
    } else {
        //alert("You have entered an invalid email, Special character(s) are not allowed.");
        toastrNotification('You have entered an invalid email, Special character(s) are not allowed.', 'error');
        eval("document." + frmName + "." + fldName + ".focus()");
        eval("document." + frmName + "." + fldName + ".select()");
        eval("document." + frmName + "." + fldName + ".className = 'highlights'");
        try {
            document.getElementById('divMsg').remove();
        } catch (e) {
        }
        return false;
    }
    return true;
}

function isPasswordOk(formName, fieldName1, fieldName2) {
    eval("str = document." + formName + "." + fieldName1 + ".value");
    eval("str1 = document." + formName + "." + fieldName2 + ".value");

    str = trim(str);
    str1 = trim(str1);
    if (str == "") {
        //alert("Enter Your Password.");
        toastrNotification("Enter Your Password.", 'error');
        eval("document." + formName + "." + fieldName1 + ".value=str");
        eval("document." + formName + "." + fieldName1 + ".focus()");
        eval("document." + formName + "." + fieldName1 + ".select()");
        //eval("document." + formName + "." + fieldName1 + ".className = 'highlights'");
        return false;
    }
    if (str.length < 6) {
        //alert("Your Password Should be at least 6 Characters.");
        toastrNotification("Your Password Should be at least 6 Characters.", 'error');
        eval("document." + formName + "." + fieldName1 + ".focus()");
        eval("document." + formName + "." + fieldName1 + ".select()");
        //eval("document." + formName + "." + fieldName1 + ".className = 'highlights'");
        return false;
    }
    if (str1 == "") {
        //alert("Please Confirm Your Password.");
        toastrNotification("Please Confirm Your Password.", 'error');
        eval("document." + formName + "." + fieldName1 + ".value=str1");
        eval("document." + formName + "." + fieldName2 + ".focus()");
        eval("document." + formName + "." + fieldName2 + ".select()");
        //eval("document." + formName + "." + fieldName2 + ".className = 'highlights'");
        return false;
    }
    if (str == str1) {
    } else {
        //alert("Confirm Your Password Again.");
        toastrNotification("Password does not match.", 'error');
        eval("document." + formName + "." + fieldName2 + ".value=\"\"");
        eval("document." + formName + "." + fieldName2 + ".focus()");
        eval("document." + formName + "." + fieldName2 + ".select()");
        //eval("document." + formName + "." + fieldName2 + ".className = 'highlights'");
        return false;
    }
    return true;
}

function isEmailConfirmOk(formName, fieldName1, fieldName2) {
    var email = "";
    var email1 = "";
    eval("email = document." + formName + "." + fieldName1 + ".value");
    eval("email1 = document." + formName + "." + fieldName2 + ".value");
    try {
        email = trim(email);
    } catch (e) {
    }
    try {
        email1 = trim(email1);
    } catch (e) {
    }
    if (email == "") {
        //alert ('Please enter E-mail address.');
        toastrNotification("Please enter E-mail address.", 'error');
        eval("document." + formName + "." + fieldName1 + ".focus()");
        eval("document." + formName + "." + fieldName1 + ".select()");
        eval("document." + formName + "." + fieldName1 + ".className = 'highlights'");

        return false;
    }
    if ((email.indexOf("@") == -1) || (email.indexOf(".") == -1)) {
        //alert ('Enter a valid E-mail address!');
        toastrNotification("Enter a valid E-mail address!", 'error');
        eval("document." + formName + "." + fieldName1 + ".focus()");
        eval("document." + formName + "." + fieldName1 + ".select()");
        eval("document." + formName + "." + fieldName1 + ".className = 'highlights'");
        return false;
    }

    if (email.length < 8 || email.indexOf(" ") > 0) {
        //alert("Check E-mail Address!");
        toastrNotification("Check E-mail Address!", 'error');
        eval("document." + formName + "." + fieldName1 + ".focus()");
        eval("document." + formName + "." + fieldName1 + ".select()");
        eval("document." + formName + "." + fieldName1 + ".className = 'highlights'");
        return false;
    }

    if (!checkForSpecialCharacterEmail(formName, fieldName1)) {
        return false;
    } else {
        if (email1 == "") {
            //alert("Please Confirm Your Email Address.");
            toastrNotification("Please Confirm Your Email Address.", 'error');
            eval("document." + formName + "." + fieldName1 + ".value=email");
            eval("document." + formName + "." + fieldName2 + ".focus()");
            eval("document." + formName + "." + fieldName2 + ".select()");
            eval("document." + formName + "." + fieldName2 + ".className = 'highlights'");
            return false;
        }
        if (email == email1) {
        } else {
            //alert("Confirm Your Email Address Again.");
            toastrNotification("Confirm Your Email Address Again.", 'error');
            eval("document." + formName + "." + fieldName2 + ".value=\"\"");
            eval("document." + formName + "." + fieldName2 + ".focus()");
            eval("document." + formName + "." + fieldName2 + ".select()");
            eval("document." + formName + "." + fieldName2 + ".className = 'highlights'");
            return false;
        }
    }
    return true;
}

function scriptPopUp(URL, width, height, scrollOpt) {
    if (scrollOpt == "") {
        scrollOpt = 0;
    }
    day = new Date();
    id = day.getTime();
    eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars='+scrollOpt+',location=0,statusbar=0,menubar=0,resizable=1,width='+width+',height='+height+',left=200,top=220',screenX=200,screenY=220);");
}

function autoTab(formName, srcFiled, trgtField) {
    var ph = "";
    eval("ph = document." + formName + "." + srcFiled + ".value");
    var phLen = ph.length;
    if (phLen == 3) {
        eval("document." + formName + "." + trgtField + ".focus()");
    }
}

function autoTabExt(formName, srcFiled, trgtField) {
    var ph = "";
    eval("ph = document." + formName + "." + srcFiled + ".value");
    var phLen = ph.length;
    if (phLen == 4) {
        eval("document." + formName + "." + trgtField + ".focus()");
    }
}

function autoTabSSN(formName, srcFiled, trgtField) {
    var ph = "";
    eval("ph = document." + formName + "." + srcFiled + ".value");
    var phLen = ph.length;
    if (phLen == 2) {
        eval("document." + formName + "." + trgtField + ".focus()");
    }
}

/** Check the file name having any special charcters before upload **/
function isValidFileName(str) {
    //    var iChars = "~`!#$%^*+=[]\\\';,/{}|\":<>?()@";
    var iChars = "~`!#$%^*+=\\\';/{}|\":<>?@"; /* Allow special characters such as (),[] from 2014-11-05 */
    /*for (var i = 0; i < str.length; i++) {
       if (iChars.indexOf(str.charAt(i)) != -1) {
		   alert ("File name has special characters. Please remove the special characters and upload.");
           return false;
       }
    }*/

    /* Allow all special characters from 2014-11-06 */

    var iChars = "'";/* Restrict ONLY apostrophe special characters from 2014-11-19 */
    var codes = new Array('9833', '9834', '9835', '9836', '9837', '9838', '9839'); /* Musical notes Characters */


    for (var i = 0; i < str.length; i++) {

        if ((iChars.indexOf(str.charAt(i)) != -1) || (isValueInArray(codes, str.charCodeAt(i)))) {
            //alert ("File name has special characters. Please remove the special characters and upload.");
            toastrNotification("File name has special characters. Please remove the special characters and upload.", "error");
            return false;
        }
    }
    return true;
}


function replaceCommaValues(strInput1) {
    var strInput2 = 0;
    strInput = 0;
    if (strInput1 === undefined) {
        return strInput1;
    }
    strInput1 = trim(strInput1);
    try {
        strInput = strInput1.replace(/,/g, '');
    } catch (e) {
    }
    strInput = strInput.replace(/ /g, '');
    strInput = strInput.replace('!@#$%^&*()', '');
    strInput = strInput.replace('@', '');
    strInput = strInput.replace('#', '');
    strInput = strInput.replace('$', '');
    strInput = strInput.replace('%', '');
    strInput = strInput.replace('^', '');
    strInput = strInput.replace('&', '');
    strInput = strInput.replace('*', '');
    strInput = strInput.replace('(', '');
    strInput = strInput.replace(')', '');
    strInput = strInput.replace('\'', '');
    strInput = strInput.replace(/[a-zA-Z]/g, '');
    strInput = trim(strInput);
    strInput2 = trim(strInput);
    if (isNaN(strInput2)) {
        strInput = 0;
    }
    return strInput;
}

function isValueInArray(arr, val) {
    inArray = false;
    for (i = 0; i < arr.length; i++)
        if (val == arr[i])
            inArray = true;
    return inArray;
}

function removeValuesFromString(myStr, mySubstr) {
    myStr = "," + myStr + ",";
    myStr = myStr.split("," + mySubstr + ",").join(",");
    myStr = myStr.substring(1, myStr.length - 1);
    return myStr;
}

/* Check if any of the radio button is checked off by the user. Use this for mandatory fields */
function isRadioSelected(formName, fieldName, msg) {
    var nf = 0;
    var val = false;
    var anyChecked = false;
    eval("nf = document." + formName + "." + fieldName + ".length");
    for (var i = 0; i < nf; i++) {
        eval("val = document." + formName + "." + fieldName + "[i].checked");
        if (val) {
            anyChecked = true;
        }
    }
    if (anyChecked) {
        return true;
    } else {
        // alert(msg);
        toastrNotification(msg, 'error');
        eval("document." + formName + "." + fieldName + "[0].focus()");
        return false;
    }
}

/* Change the style of a html widget */
function changeStyle(fldName, styleName) {
    document.getElementById(fldName).className = styleName;
}

function alertToEnterInput(currentvalue) {
    currentvalue1 = trim(currentvalue);
    try {
        currentvalue = replaceCommaValues(currentvalue);
    } catch (e) {
    }

    if ((currentvalue1 == '- Gross -') || (currentvalue1 == '- Net -')) {

    } else if ((currentvalue1 != "") && (currentvalue == "")) {
        toastrNotification('Please make sure you have entered only numeric values in the fields', 'error');
    } else if ((currentvalue1 > 0) && (currentvalue == 0)) {
        toastrNotification('Please make sure you have entered only numeric values in the fields', 'error');
    }
}

function chkIsCheck(formName, fieldName, msg) {
    var fld = "";
    var fldCnt = 0;
    eval("var obj = document." + formName + "." + fieldName);
    for (var i = 0; i < obj.length; i++) {
        eval("var fld = document." + formName + "." + fieldName + "[" + i + "]" + ".checked");
        if (fld) {
            fldCnt++;
        }
    }
    if (fldCnt > 0) {
        try {
            eval("document.getElementById('" + fieldName + "_bg').style.backgroundColor = ''");
        } catch (e) {
        }
        return true;
    } else {
        //alert(msg);
        toastrNotification(msg, 'error');
        try {
            eval("document." + formName + "." + fieldName + "[0].focus()");
            eval("document.getElementById('" + fieldName + "_bg').style.backgroundColor = '#ffffcc'");
        } catch (e) {
        }
        return false;
    }

}

function processString(strInput) {
    strInput = strInput.replace(/</g, '&#60;');
    strInput = strInput.replace(/>/g, '&#62;');
    strInput = strInput.replace(/&/g, '%26');
    strInput = strInput.replace(/'/g, '%27');
    strInput = strInput.replace(/"/g, '%22');
    strInput = strInput.replace(/\+/g, '%2B');
    return strInput;
}

/* Avoid using the below method */
function checkNumber(formName, fieldName, msg) {
    var fld = "";
    try {
        eval("fld = document." + formName + "." + fieldName + ".value");
        fld = trim(fld);
    } catch (e) {
    }
    if (fld < 0 || isNaN(fld) || fld == "") {
        var alrt = "Please Enter " + msg + "  as integer";
        //alert(alrt);
        toastrNotification(alrt, 'error');
        eval("document." + formName + "." + fieldName + ".focus()");
        document.getElementById(fieldName).className = "clsHighlights";
        return false;
    } else {
        return true;
    }
    return false;
}

function checkValidNumber(formName, fieldName, msg) {
    var fld = "";
    try {
        eval("fld = document." + formName + "." + fieldName + ".value");
        //document.getElementById(fieldName).className = "";
        $('#' + fieldName).removeClass("highlights");
        fld = replaceCommaValues(trim(fld));
    } catch (e) {
    }
    if (fld == "") {
        return true;
    }
    if (fld < 0 || isNaN(fld)) {
        var alrt = "Please Enter " + msg + "  as number / integer";
        //alert(alrt);
        toastrNotification(alrt, 'error');
        document.getElementById(fieldName).value = "";
        document.getElementById(fieldName).className = "highlights";
        eval("document." + formName + "." + fieldName + ".focus()");
        return false;
    } else {
        return true;
    }
    return false;
}

/*
 * Multiple checkbox with field name as an array
*/
function isMultiCheckboxSelected(formName, fldName, msg) {
    var fldValues = "", chkCnt = 0, obj = '', len = 0, chk = false, chk1 = false;
    if ($('form[name="' + formName + '"] #' + fldName).prop('disabled') === false) {
        //$('form[name="+formName+"] #'+fldName)
        try {
            eval("obj = document." + formName + "." + fldName);
            len = obj.length;
        } catch (e) {
        }
        if (len > 0) {
            for (var j = 0; j < obj.length; j++) {
                chk = false;
                chk1 = false;
                try {
                    chk = obj[j].checked;
                } catch (e) {
                }
                try {
                    chk1 = obj[j].selected;
                } catch (e) {
                }

                if (chk || chk1) {
                    chkCnt++;
                }
            }
        } else {
            chk = false;
            chk1 = false;
            try {
                chk = obj.checked;
            } catch (e) {
            }
            try {
                chk1 = obj.selected;
            } catch (e) {
            }
            if (chk || chk1) {
                chkCnt++;
            }
        }
        if (chkCnt == 0) {
            //alert(msg);
            toastrNotification(msg, 'error');
            $('#'+fldName).trigger('chosen:open');
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

function isMultiCheckboxSelectedCount(formName, fldNames, msg) {
    var fldValues = "", chkCnt = 0, obj = '', len = 0, chk = false, chk1 = false;

    var strArray = fldNames.split(",");

    // Display array values on page
    for (var i = 0; i < strArray.length; i++) {
        fldName = strArray[i];

        try {
            eval("obj = document." + formName + "." + fldName);
            len = obj.length;
        } catch (e) {
        }
        if (len > 0) {
            for (var j = 0; j < obj.length; j++) {
                chk = false;
                chk1 = false;
                try {
                    chk = obj[j].checked;
                } catch (e) {
                }
                try {
                    chk1 = obj[j].selected;
                } catch (e) {
                }

                if (chk || chk1) {
                    chkCnt++;
                }
            }
        } else {
            chk = false;
            chk1 = false;
            try {
                chk = obj.checked;
            } catch (e) {
            }
            try {
                chk1 = obj.selected;
            } catch (e) {
            }
            if (chk || chk1) {
                chkCnt++;
            }
        }


    }


    if (chkCnt == 0) {
        toastrNotification(msg, 'error');
        $('#selectALlCheckBox_1').focus();
        return false;
    } else {
        return true;
    }
}


function isFileUploaded() {
    var numItems = $('.brokerdocs').length;
    var doccount = 0;
    $(".brokerdocs").each(function () {
        if ($(this).val() != '') {
            var filename = '';
            var idval = (this.id).split('_');
            filename = $('#fileSrcDriver_' + idval[1]).val();
            if (filename == '') {
                this.focus();
                doccount++;
            }
        }
    });
    if (doccount > 0) {
        //toastrNotification('Please Upload File', 'error');
        return false;
    } else {
        return true;
    }

}

function chkPhoneNumberExtension(formName, phne) {
    str1 = eval("document." + formName + "." + phne + ".value");
    str1 = str1.replace(/[^0-9]/g, '');
    if (str1 == "") {
        toastrNotification("Please Enter Telephone Number.", 'error');
        eval("document." + formName + "." + phne + ".focus()");
        eval("document." + formName + "." + phne + ".select()");
        return false;
    } else {
        return true;
    }
}

function chkPhoneNumber(formName, ph1, ph2, ph3) {
    str1 = eval("document." + formName + "." + ph1 + ".value");
    str2 = eval("document." + formName + "." + ph2 + ".value");
    str3 = eval("document." + formName + "." + ph3 + ".value");
    try {
        str1 = trim(str1);
        str2 = trim(str2);
        str3 = trim(str3);
    } catch (e) {
    }

    if ((str1 == "") && (str2 == "") && (str3 == "")) {
        return true;
    }

    if (str1 == "") {
        toastrNotification("Please enter area code in phone number.", 'error');
        eval("document." + formName + "." + ph1 + ".focus()");
        eval("document." + formName + "." + ph1 + ".select()");
        return false;
    }
    if (str2 == "") {
        toastrNotification("Please check the phone number.", 'error');
        eval("document." + formName + "." + ph2 + ".focus()");
        eval("document." + formName + "." + ph2 + ".select()");
        return false;
    }
    if (str3 == "") {
        toastrNotification("Please check the phone number.", 'error');
        eval("document." + formName + "." + ph3 + ".focus()");
        eval("document." + formName + "." + ph3 + ".select()");
        return false;
    }
    var str = str1 + str2 + str3;
    for (var i = 0; i < str.length; i++) {
        var ch = str.substring(i, i + 1);
        if (ch < "0" || "9" < ch) {
            toastrNotification("Phone number should be numeric.", 'error');
            eval("document." + formName + "." + ph1 + ".focus()");
            eval("document." + formName + "." + ph1 + ".select()");
            return false;
        }
    }
    if (str.length != 10) {
        toastrNotification("The phone number should have 10 digits.", 'error');
        eval("document." + formName + "." + ph1 + ".focus()");
        eval("document." + formName + "." + ph1 + ".select()");
        return false;
    }
    return true;
}

function isPhoneNumber(formName, phone_number, ph1, ph2, ph3) {

    str1 = eval("document." + formName + "." + ph1 + ".value");
    str2 = eval("document." + formName + "." + ph2 + ".value");
    str3 = eval("document." + formName + "." + ph3 + ".value");

    try {
        str1 = trim(str1);
        str2 = trim(str2);
        str3 = trim(str3);
    } catch (e) {
    }

    if (str1 == "") {
        toastrNotification('Please enter area code in phone number.', 'error');
        eval("document." + formName + "." + ph1 + ".focus()");
        eval("document." + formName + "." + ph1 + ".select()");
        return false;
    }
    if (str2 == "") {
        toastrNotification('Please check the phone number.', 'error');
        eval("document." + formName + "." + ph2 + ".focus()");
        eval("document." + formName + "." + ph2 + ".select()");
        return false;
    }
    if (str3 == "") {
        toastrNotification('Please check the phone number.', 'error');
        eval("document." + formName + "." + ph3 + ".focus()");
        eval("document." + formName + "." + ph3 + ".select()");
        return false;
    }
    var str = str1 + str2 + str3;
    for (var i = 0; i < str.length; i++) {
        var ch = str.substring(i, i + 1);
        if (ch < "0" || "9" < ch) {
            toastrNotification('Phone number should be numeric.', 'error');
            eval("document." + formName + "." + ph1 + ".focus()");
            eval("document." + formName + "." + ph1 + ".select()");
            return false;
        }
    }
    if (str.length != 10) {
        toastrNotification('The phone number should have 10 digits.', 'error');
        eval("document." + formName + "." + ph1 + ".focus()");
        eval("document." + formName + "." + ph1 + ".select()");
        return false;
    }
    eval("document." + formName + "." + phone_number + ".value=" + str);
    return true;
}

function isPhoneNumberNew(formName, phone_number) {

    str1 = eval("document." + formName + "." + phone_number + ".value");
    if (str1 == '') {
        return true;
    }

    try {
        str1 = trim(str1);
    } catch (e) {
    }
    str1 = str1.replace(/[^0-9]/g, '');
    var str = str1;
    for (var i = 0; i < str.length; i++) {
        var ch = str.substring(i, i + 1);
        if (ch < "0" || "9" < ch) {
            toastrNotification('Phone number should be numeric.', 'error');
            eval("document." + formName + "." + phone_number + ".focus()");
            eval("document." + formName + "." + phone_number + ".select()");
            return false;
        }
    }
    if (str.length != 10) {
        toastrNotification('The phone number should have 10 digits.', 'error');
        eval("document." + formName + "." + phone_number + ".focus()");
        eval("document." + formName + "." + phone_number + ".select()");
        return false;
    }
    eval("document." + formName + "." + phone_number + ".value=" + str);
    return true;
}

function getMultiCheckValue(formName, sourceFldName, destinationFldName) {
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
            eval("fld = document." + formName + "." + sourceFldName + "[" + i + "]" + ".checked");
            if (fld) {
                eval("fldVal = document." + formName + "." + sourceFldName + "[" + i + "]" + ".value");
                if (t == 0) {
                    fldValues = fldVal;
                } else {
                    fldValues += ", " + fldVal;
                }
                t++;
            }
        }
    } else {
        eval("var fld = document." + formName + "." + sourceFldName + ".checked");
        if (fld) {
            eval("fldValues = document." + formName + "." + sourceFldName + ".value");
        }
    }
    try {
        eval("document." + formName + "." + destinationFldName + ".value = fldValues");
    } catch (e) {
    }
}

function isCheck(formName, fieldName) {
    var fld = "";
    eval("fld = document." + formName + "." + fieldName + ".checked");
    if (fld == false) {
        var alrt = "Please agree to the Terms And Conditions";
        toastrNotification(alrt, 'error');
        //alert(alrt);
        return false;
    } else {
        return true;
    }
}

function getRadioBtnValue(formName, fieldName) {
    var fldValues = "";
    var t = 0;
    try {
        eval("obj = document." + formName + "." + fieldName);
    } catch (e) {
    }

    for (var j = 0; j < obj.length; j++) {
        if (obj[j].checked) {
            if (t > 0) {
                fldValues += ", ";
            }
            fldValues += obj[j].value;
            t++;
        }
    }
    return fldValues;
}

/* Check the date format with reg exp old fn: isDateOKForMMDDYY */

function isDateTimeOkMMDDYY(formName, fieldName) {
    var myFldVal = "", dateOk = 0;
    try {
        eval("myFldVal = document." + formName + "." + fieldName + ".value");
    } catch (e) {
    }
    /***  Regular Expression for mm/dd/yyyy H:i:A format
     /* ---------------------------------------------------- */
        //    var RegExPattern = /^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/;

    var RegExPattern = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{4}\s(\d{1,2}):(\d{2})\s([ap]m)$/;
    var RegExPattern2 = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{4}\s(\d{1,2}):(\d{2})\s([AP]M)$/;
    var re = /^(\d{1,2}):(\d{2})\s([ap]m)?$/;
    var re2 = /^(\d{1,2}):(\d{2})\s([AP]M)?$/;
    var reTime = /^(\d{1,2}):(\d{2})$/;


    if (myFldVal == "") {
        // alert("Please Enter Date");
        toastrNotification("Please Enter Date", 'error');
        eval("document." + formName + "." + fieldName + ".focus()");
        document.getElementById(fieldName).className = "highlights";
        return false;
    } else if ((!myFldVal.match(RegExPattern)) && (!myFldVal.match(RegExPattern2))) {
        // alert("Please Enter Valid date");
        toastrNotification("Please Enter Valid Date", 'error');
        eval("document." + formName + "." + fieldName + ".focus()");
        return false;
    } else {
        var strSeparator = myFldVal.substring(2, 3);
        var arrayDate = myFldVal.split(strSeparator);

        //create a lookup for months not equal to Feb.
        var arrayLookup = {
            '01': 31, '03': 31,
            '04': 30, '05': 31,
            '06': 30, '07': 31,
            '08': 31, '09': 30,
            '10': 31, '11': 30, '12': 31
        }
        var arrayLookup1 = {
            '1': 31, '3': 31,
            '4': 30, '5': 31,
            '6': 30, '7': 31,
            '8': 31, '9': 30,
            '10': 31, '11': 30, '12': 31
        }
        var intDay = parseInt(arrayDate[1], 10);


        //check if month value and day value agree
        if ((arrayLookup[arrayDate[0]] != null) || (arrayLookup1[arrayDate[0]] != null)
        ) {
            if (intDay <= arrayLookup[arrayDate[0]] && intDay != 0) {
                dateOk = 1; //found in lookup table, good date
            } else {
                dateOk = 0;
            }
        } else {
            dateOk = 0;
        }

        //check for February (bugfix 20050322)
        //bugfix  for parseInt kevin
        //bugfix  biss year  O.Jp Voutat
        var intMonth = parseInt(arrayDate[0], 10);

        if (intMonth == 2) {
            var intYear = parseInt(arrayDate[2]);
            if (intDay > 0 && intDay < 29) {
                dateOk = 1;
            } else if (intDay == 29) {
                if ((intYear % 4 == 0) && (intYear % 100 != 0) || (intYear % 400 == 0)) {
                    // year div by 4 and ((not div by 100) or div by 400) ->ok
                    dateOk = 1;
                } else {
                    dateOk = 0;
                }
            } else {
                dateOk = 0;
            }
        } else {
            dateOk = 1;
        }


        if (dateOk == 0) {
            //alert("Please Enter Valid date");
            toastrNotification("Please Enter Valid Date", 'error');
            eval("document." + formName + "." + fieldName + ".focus()");
            return false;
        } else {

            var arrayTime = myFldVal.split(' ');
            var timeVal = arrayTime[1];

            if (timeVal.match(reTime)) {
                regs = timeVal.split(':');

                if (regs[0] < 1 || regs[0] > 12) {
                    //alert("Invalid value for hours: " + regs[0]);
                    toastrNotification("Invalid value for hours: " + regs[0], 'error');
                    eval("document." + formName + "." + fieldName + ".focus()");
                    return false;
                }
                if (regs[1] > 59) {
                    //alert("Invalid value for minutes: " + regs[1]);
                    toastrNotification("Invalid value for minutes: " + regs[1], 'error');
                    eval("document." + formName + "." + fieldName + ".focus()");
                    return false;
                }
                return true;
            }
            return false;
        }
    }
    return false;
}

function get_html_translation_table(table, quote_style) {
    var entities = {},
        hash_map = {},
        decimal;
    var constMappingTable = {},
        constMappingQuoteStyle = {};
    var useTable = {},
        useQuoteStyle = {};

    // Translate arguments
    constMappingTable[0] = 'HTML_SPECIALCHARS';
    constMappingTable[1] = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';

    useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
        throw new Error("Table: " + useTable + ' not supported');
        // return false;
    }

    entities['38'] = '&amp;';
    if (useTable === 'HTML_ENTITIES') {
        entities['160'] = '&nbsp;';
        entities['161'] = '&iexcl;';
        entities['162'] = '&cent;';
        entities['163'] = '&pound;';
        entities['164'] = '&curren;';
        entities['165'] = '&yen;';
        entities['166'] = '&brvbar;';
        entities['167'] = '&sect;';
        entities['168'] = '&uml;';
        entities['169'] = '&copy;';
        entities['170'] = '&ordf;';
        entities['171'] = '&laquo;';
        entities['172'] = '&not;';
        entities['173'] = '&shy;';
        entities['174'] = '&reg;';
        entities['175'] = '&macr;';
        entities['176'] = '&deg;';
        entities['177'] = '&plusmn;';
        entities['178'] = '&sup2;';
        entities['179'] = '&sup3;';
        entities['180'] = '&acute;';
        entities['181'] = '&micro;';
        entities['182'] = '&para;';
        entities['183'] = '&middot;';
        entities['184'] = '&cedil;';
        entities['185'] = '&sup1;';
        entities['186'] = '&ordm;';
        entities['187'] = '&raquo;';
        entities['188'] = '&frac14;';
        entities['189'] = '&frac12;';
        entities['190'] = '&frac34;';
        entities['191'] = '&iquest;';
        entities['192'] = '&Agrave;';
        entities['193'] = '&Aacute;';
        entities['194'] = '&Acirc;';
        entities['195'] = '&Atilde;';
        entities['196'] = '&Auml;';
        entities['197'] = '&Aring;';
        entities['198'] = '&AElig;';
        entities['199'] = '&Ccedil;';
        entities['200'] = '&Egrave;';
        entities['201'] = '&Eacute;';
        entities['202'] = '&Ecirc;';
        entities['203'] = '&Euml;';
        entities['204'] = '&Igrave;';
        entities['205'] = '&Iacute;';
        entities['206'] = '&Icirc;';
        entities['207'] = '&Iuml;';
        entities['208'] = '&ETH;';
        entities['209'] = '&Ntilde;';
        entities['210'] = '&Ograve;';
        entities['211'] = '&Oacute;';
        entities['212'] = '&Ocirc;';
        entities['213'] = '&Otilde;';
        entities['214'] = '&Ouml;';
        entities['215'] = '&times;';
        entities['216'] = '&Oslash;';
        entities['217'] = '&Ugrave;';
        entities['218'] = '&Uacute;';
        entities['219'] = '&Ucirc;';
        entities['220'] = '&Uuml;';
        entities['221'] = '&Yacute;';
        entities['222'] = '&THORN;';
        entities['223'] = '&szlig;';
        entities['224'] = '&agrave;';
        entities['225'] = '&aacute;';
        entities['226'] = '&acirc;';
        entities['227'] = '&atilde;';
        entities['228'] = '&auml;';
        entities['229'] = '&aring;';
        entities['230'] = '&aelig;';
        entities['231'] = '&ccedil;';
        entities['232'] = '&egrave;';
        entities['233'] = '&eacute;';
        entities['234'] = '&ecirc;';
        entities['235'] = '&euml;';
        entities['236'] = '&igrave;';
        entities['237'] = '&iacute;';
        entities['238'] = '&icirc;';
        entities['239'] = '&iuml;';
        entities['240'] = '&eth;';
        entities['241'] = '&ntilde;';
        entities['242'] = '&ograve;';
        entities['243'] = '&oacute;';
        entities['244'] = '&ocirc;';
        entities['245'] = '&otilde;';
        entities['246'] = '&ouml;';
        entities['247'] = '&divide;';
        entities['248'] = '&oslash;';
        entities['249'] = '&ugrave;';
        entities['250'] = '&uacute;';
        entities['251'] = '&ucirc;';
        entities['252'] = '&uuml;';
        entities['253'] = '&yacute;';
        entities['254'] = '&thorn;';
        entities['255'] = '&yuml;';
    }

    if (useQuoteStyle !== 'ENT_NOQUOTES') {
        entities['34'] = '&quot;';
    }
    if (useQuoteStyle === 'ENT_QUOTES') {
        entities['39'] = '&#39;';
    }
    entities['60'] = '&lt;';
    entities['62'] = '&gt;';


    // ascii decimals to real symbols
    for (decimal in entities) {
        if (entities.hasOwnProperty(decimal)) {
            hash_map[String.fromCharCode(decimal)] = entities[decimal];
        }
    }

    return hash_map;
}

function htmlentities(s, qS, cS, dE) {
    var h = {}, c = '', e = '', se = this;
    s += '';

    if (false === (h = se.get_html_translation_table('HTML_ENTITIES', qS))) {
        return false;
    }
    if (!!dE || dE == null) {
        h["'"] = '&#039;';
        for (c in h) s = s.split(c).join(h[c]);
    } else {
        s = s.replace(/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-z][\da-z]*);|$)/g, function (i, t, e) {
            return se.htmlentities(t, qS, cS) + e;
        });
    }
    return s;
}

function populateStateTimeZone(formName, srcName, targetName) {
    var propertyState = '', xmlDoc = '', timeZone = '', publicUser = 0;

    try {
        eval("publicUser = document." + formName + ".publicUser.value");
    } catch (e) {
    }
    try {
        eval("propertyState = document." + formName + "." + srcName + ".value");
    } catch (e) {
    }
    if (propertyState != "") {
        if (publicUser == 1) {
            var url = "backoffice/getTimeZoneForState.php";
        } else {
            var url = "../backoffice/getTimeZoneForState.php";
        }
        var qstr = "sc=" + propertyState;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            timeZone = xmlDoc.getElementsByTagName("timeZone")[0].firstChild.nodeValue;
        } catch (e) {
        }
        try {
            eval("document." + formName + "." + targetName + ".value = timeZone");
        } catch (e) {
        }

    }
}


function chkOldAndCrntPwd(formName, fieldName1, fieldName2) {

    eval("str = document." + formName + "." + fieldName1 + ".value");
    eval("str1 = document." + formName + "." + fieldName2 + ".value");

    str = trim(str);
    str1 = trim(str1);
    if (str == "") {
        //alert("Please enter your current password.");
        toastrNotification("Please enter your current password.", 'error');
        eval("document." + formName + "." + fieldName1 + ".value=str");
        eval("document." + formName + "." + fieldName1 + ".focus()");
        eval("document." + formName + "." + fieldName1 + ".select()");
        eval("document." + formName + "." + fieldName1 + ".className = 'highlights'");
        return false;
    }

    if (str == str1 && str1 != "") {
        //alert("Please enter a different password.");
        toastrNotification("Please enter a different password.", 'error');
        eval("document." + formName + "." + fieldName2 + ".value=\"\"");
        eval("document." + formName + "." + fieldName2 + ".focus()");
        eval("document." + formName + "." + fieldName2 + ".select()");
        eval("document." + formName + "." + fieldName2 + ".className = 'highlights'");
        return false;
    }

    return true;
}

/* Validate money fields. */

function validateAmountAllowBlank(formName, fieldName, msg) {
    var fld = "";
    RegExPattern = /(?:^[-+]?\d{1,3}(?:\,?\d{3})*(?:\.\d{0,2})?$)/;
    try {
        eval("fld = document." + formName + "." + fieldName + ".value");
        document.getElementById(fieldName).className = "";
        document.getElementById(fieldName).className = " form-control ";
    } catch (e) {
    }
    try {
        fld = trim(fld);
    } catch (e) {
    }
    if (fld == "" || fld == '- Gross -' || fld == '- Net -') {
        return true;
    } else {
        try {
            fld = replaceCommaValues(fld);
        } catch (e) {
        }
    }
    if (fld.match(RegExPattern)) {
        return true;
    } else {
        // alert(msg);
        toastrNotification(msg, 'error');
        document.getElementById(fieldName).className = "highlights";
        eval("document." + formName + "." + fieldName + ".focus()");
        return false;
    }
    return false;
}

function chkIntRate(formName, fieldName, msg) {
    RegExPattern = /(?:^\d{0,3}(?:\.?\d{0,3})?$)/;
    var val = "";
    try {
        eval("val = document." + formName + "." + fieldName + ".value");
    } catch (e) {
    }
    val = trim(val);
    if (val == "") {
        return true;
    }
    if (val.match(RegExPattern)) {
        return true;
    } else {
        //alert(msg);
        toastrNotification(msg, 'error');
        try {
            document.getElementById(fieldName).className = "highlights";
            eval("document." + formName + "." + fieldName + ".focus()");
        } catch (e) {
        }
        return false;
    }
}

function isSelectedMultiSelectbox(formName, fldName, msg) {
    var len = 0, chk = false, obj = '', chkCnt = 0;
    try {
        eval("obj = document." + formName + "['" + fldName + "']");
        len = obj.length;
    } catch (e) {
    }
    if (len > 0) {
        for (var j = 0; j < obj.length; j++) {
            chk = false;
            try {
                chk = obj[j].selected;
            } catch (e) {
            }

            if (chk) {
                chkCnt++;
            }
        }
    } else {
        chk = false;
        try {
            chk = obj.selected;
        } catch (e) {
        }
        if (chk) {
            chkCnt++;
        }
    }
    if (chkCnt == 0) {
        //alert(msg);
        toastrNotification(msg, 'error');
        return false;
    } else {
        return true;
    }

}

function isSelectedMultiCheckbox(formName, fldName, msg) {
    var len = 0, chk = false, obj = '', chkCnt = 0;
    try {
        eval("obj = document." + formName + "['" + fldName + "']");
        len = obj.length;
    } catch (e) {
    }
    if (len > 0) {
        for (var j = 0; j < obj.length; j++) {
            chk = false;
            try {
                chk = obj[j].checked;
            } catch (e) {
            }

            if (chk) {
                chkCnt++;
            }
        }
    } else {
        chk = false;
        try {
            chk = obj.checked;
        } catch (e) {
        }
        if (chk) {
            chkCnt++;
        }
    }
    if (chkCnt == 0) {
        //alert(msg);
        toastrNotification(msg, 'error');
        return false;
    } else {
        return true;
    }

}

function autoTabVendorKey(formName, srcFiled, trgtField, len) {
    var ph = "";
    eval("ph = document." + formName + "." + srcFiled + ".value");
    var phLen = ph.length;
    if (phLen == len) {
        eval("document." + formName + "." + trgtField + ".focus()");
    }
}

/* Validate Billing and Commission Form with Future Date On Nov 29, 2016 */
function checkDateIsFuture(formName, myDate, alertField) {
    var dispDate = "";
    var selectedDate = "";
    var now = "";
    try {
        eval("dispDate = document." + formName + "." + myDate + ".value");
    } catch (e) {
    }
    var selectedDate = Date.parse(dispDate);
    var dateToday = new Date();
    var dd = dateToday.getDate();
    var mm = dateToday.getMonth() + 1; //January is 0!

    var yyyy = dateToday.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var dateToday = mm + '/' + dd + '/' + yyyy;
    var today = Date.parse(dateToday);

    if (selectedDate < today) {
        if (myDate == 'purchaseCloseDate' || myDate == 'datesigned') {
            //alert("Please enter a date after today's date");
            toastrNotification("Please enter a date in the future.", 'error');
        } else {
            //alert("Please enter a date after today's date for Phase "+alertField);
            if (alertField != '') alertField = " for " + alertField;
            toastrNotification("Please enter a date in the future " + alertField, 'error');
        }
        eval("document." + formName + "." + myDate + ".focus()");
        eval("document." + formName + "." + myDate + ".value = ''");
        return false;
    } else {
        return true;
    }
}

function toggleSwitchNew(divName, fldName, onOpt, off) {
    if (onOpt == 1) {
        document.getElementById(fldName).value = 1;
        document.getElementById(divName).className = "switch-on";
    } else {
        document.getElementById(fldName).value = 0;
        document.getElementById(divName).className = "switch-off";
    }
}

/* Select All Options in the Chosen select drop down */
function selectAllOptions(id) {
    $("#" + id + " option").prop('selected', true).trigger('chosen:updated.chosen');
    setTimeout("toggle_visibility('loaderImg')", "200");
}

/* UnSelect All Options in the Chosen select drop down */
function removeAllOptions(id) {
    $("#" + id + " option").prop('selected', false).trigger('chosen:updated.chosen');
    setTimeout("toggle_visibility('loaderImg')", "200");
}

/* Remove space from the string and convert it into lowercase */
function removeSpace(strInput) {
    if (strInput != '') {
        return strInput.replace(/\s/g, '').toLowerCase();
    } else {
        return strInput;
    }
}

/* Remove space from the string and convert it into lowercase */
function removeSpaceWithSpecialChars(strInput) {
    if (strInput != '') {
        strInput = removeSpace(strInput);
        return strInput.replace(/[^a-zA-Z0-9]/g, '');
    } else {
        return strInput;
    }
}

/**

 Description    : Automatic Currency Converter
 Developer    : Viji & Venkatesh,Suresh
 Date        : Feb 24, 2017
 Modified By : Viji On Mar 10, 2017
 **/

/*function currencyConverter(thisVal, Num) {
    $(thisVal).val(autoNumericConverter(Num));
}*/
function autoNumericConverter(Num) {
    Num += '';
    Num = Num.replace(',', '');
    x = Num.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1))
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    return x1 + x2;
}

function convertDoller(tVal) {
    var result = '';
    var dVal = $(tVal).val();
    var valueArray = dVal.split('');
    var resultArray = [];
    var counter = 0;
    var temp = '';
    for (var i = valueArray.length - 1; i >= 0; i--) {
        temp += valueArray[i];
        counter++
        if (counter == 3) {
            resultArray.push(temp);
            counter = 0;
            temp = '';
        }
    }
    ;
    if (counter > 0) {
        resultArray.push(temp);
    }
    for (var i = resultArray.length - 1; i >= 0; i--) {
        var resTemp = resultArray[i].split('');
        for (var j = resTemp.length - 1; j >= 0; j--) {
            result += resTemp[j];
        }
        ;
        if (i > 0) {
            result += ','
        }
    }
    ;
    result = result.replace(".,", ".");
    result = result.replace(",.", ".");

    if (result.indexOf(".") >= 0) {
        if (result.length <= 6) {
            if (result.length != 6) result = result.replace(",", "");
        }
    }
    return result;
}

/*function currencyConverter(thisVal, Num) {
    var start = thisVal.selectionStart;
    var end = Num.length;
    $(thisVal).simpleMoneyFormat();
    if (start != end) thisVal.setSelectionRange(start, start); // Reset the cursor position
}*/
/**

 * Description : Toastr Nofication Functionality Implemented
 * Date        : Feb 22, 2018
 * Author      : Viji
 * Developer   : Venkatesh Raju
 * Display the message popup on top center

 **/

function toastrNotification(msg, msgType, timeOut, id) {
    if (!timeOut) timeOut = 2800;
    if (!id) id = '';
    toastr.clear();
    if (msgType == '') msgType = 'success';
    toastr.options = {
        "positionClass": "toast-center-center",
        "closeButton": true,
        "showDuration": "5000",
        "hideDuration": "1000",
        "timeOut": timeOut,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "allowHtml": true,
    }
    if (id != '') {
        toastr.options.onHidden = function () {
            $('#' + id).focus();
        };
    }
    Command: toastr[msgType](msg);
}


/**

 * Description : Toastr Nofication like confirm box
 * Date        : Feb 22, 2018
 * Author      : Viji
 * Developer   : Viji
 * Display the message popup on top center

 **/

function toastrConfirmNotification(msg, msgType, formName) {

    toastr.clear();

    if (msgType == '') msgType = 'success';

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
    var msg = msg + '<br><br><br><button type="button" id="okBtn" class="btn blue">OK</button><button type="button" id="cancelBtn" class="btn default" style="margin: 0 8px 0 8px">CANCEL</button>';
    var $toast = toastr[msgType](msg); // Wire up an event handler to a button in the toast, if it exists

    if ($toast.find('#okBtn').length) {
        $toast.delegate('#okBtn', 'click', function () {
            $toast.remove();
            setTimeout(function () {
                $("form#" + formName)[0].submit();
            }, 10);
        });
    }
    if ($toast.find('#cancelBtn').length) {
        $toast.delegate('#cancelBtn', 'click', function (event) {
            event.preventDefault();
        });
    }
    return false;
}

$(document).ready(function () {
    $("#searchtag").keyup(function () {
        var docWizard = 0;
        if ($('#docWizard').length > 0) {
            docWizard = 1;
        }
        $.ajax({
            url: '../JQFiles/getDynamicTagsData.php',
            type: 'POST',
            dataType: "json",
            data: {
                searchtag: $('#searchtag').val().trim(),
                PCID: $('#PCID').val(),
                docWizard: docWizard,
            },
            success: function (data) {
                $('#tagsDiv').empty();
                $('#tagsDiv').html(data);
                if ($("input[name='smartTags']:checked").val() == 'HMTags') {
                    $('.HMLOSmartTagsDispDiv').show(); // Shows
                    $('.LMSmartTagsDispDiv').hide(); // hide
                } else if ($("input[name='smartTags']:checked").val() == 'LMTags') {
                    $('.HMLOSmartTagsDispDiv').hide(); // hides
                    $('.LMSmartTagsDispDiv').show(); // Shows
                }


            }
        }).done(function (data) {
        });
    });
});

function hideandShowImportDataDiv(divId) {
    if ($('#' + divId + ':visible').length == 0) {
        $('#' + divId).show(1000);
    } else {
        $('#' + divId).hide(1000);
    }
}

function toastrNotificationWithReloadDelay(msg, msgType, timeOut) {
    if (!timeOut) timeOut = 2800;
    toastr.clear();
    if (msgType == '') msgType = 'success';
    toastr.options = {
        "positionClass": "toast-center-center",
        "closeButton": true,
        "showDuration": "5000",
        "hideDuration": "1000",
        "timeOut": timeOut,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "allowHtml": true,
    }
    toastr.options.onHidden = function () {
        // this will be executed after fadeout, i.e. 2secs after notification has been show
        window.location.reload();
        //window.setTimeout(function(){location.reload()},3000)
    };
    Command: toastr[msgType](msg);
}

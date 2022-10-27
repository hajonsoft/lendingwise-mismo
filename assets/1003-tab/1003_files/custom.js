function modalCall(modalName, modalWsize, modalRemoteUrl) {
    if (modalWsize == '') {
        modalWsize = 'modal-xl';
    }
    modalObj = $('#exampleModal1');
    modalObj.modal('show');
    modalObj.find('.modal-dialog').removeClass("modal-sm modal-lg modal-xl").addClass(modalWsize);
    modalObj.find('.modal-title').text(modalName)

    $.ajax({
        type: "GET",
        url: modalRemoteUrl,
        dataType: 'html',
        success: function (res) {
            modalObj.find('.modal-body').html(res);
            // UnBlockDiv('modal-content-id');
        },
        error: function (request, status, error) {
            toastrNotification("Error In Fetching.", "error");
        }
    });
}

function ShowBlockPage() {
    KTApp.blockPage({
        overlayColor: '#000000',
        state: 'danger',
        message: 'Please wait...'
    });
}

function UnBlockPage() {
    KTApp.unblockPage();
}

$(document).ready(function () {

   setTimeout(function(){
       UnBlockPage();
   },100)

    jQuery.validator.addMethod(
        "phoneNumberValidation",
        function (value, element) {
            if (this.optional(element)) {
                return true;                          // return true on optional element
            }
            str1 = value.replace(/[^0-9]/g, '');
            console.log(str1.length);
            if (str1.length == 10 || str1.length == 14) {
                return true;
            } else {
                return false;
            }
        },
        "Please Enter Valid Phone Number"
    );

    jQuery.validator.addMethod(
        "zipCodeValidation",
        function (value, element) {
            if (this.optional(element)) {
                return true;                          // return true on optional element
            }
            str1 = value.replace(/[^0-9]/g, '');
            console.log(str1.length);
            if (str1.length == 5) {
                return true;
            } else {
                return false;
            }
        },
        "Please Enter Valid Zip Code"
    );
    //Example: editRep2Info.php

    jQuery.validator.addMethod(
        "dateFormat",
        function(value, element) {
            var check = false;
            var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            if( re.test(value)){
                var adata = value.split('/');
                var mm = parseInt(adata[0],10);
                var dd = parseInt(adata[1],10);
                var yyyy = parseInt(adata[2],10);
                var xdata = new Date(yyyy,mm-1,dd);
                if ( ( xdata.getFullYear() === yyyy ) && ( xdata.getMonth () === mm - 1 ) && ( xdata.getDate() === dd ) ) {
                    check = true;
                }
                else {
                    check = false;
                }
            } else {
                check = false;
            }
            return this.optional(element) || check;
        },
        "Wrong date format"
    );

    //Mobile Responsive code//
    if( /Android|webOS|iPhone|iPad|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        // some code..
        $('#kt_page_sticky_card').removeClass('card-sticky');

        //Assets (Include Borrower + Co-borrower amounts if any)
        $('.card-body.assets .input-group-prepend').addClass('hidden');
        $('.card-body.assets input[type=text]').css('border-radius', '0.42rem');
        //Billing & Commission
        $('.tblBillComm .input-group-prepend').addClass('hidden');
        //$('.billcomm .input-group-append').addClass('hidden');
        $('.tblBillComm input[type=text]').css('border-radius', '0.42rem');
        //Table Data
        $('table.tblBillComm').removeClass('table-striped');
        $('table.tblBillComm > thead > tr').addClass('d-flex');
        $('table.tblBillComm > thead > tr > th').addClass('col-4');
        $('table.tblBillComm > tbody > tr').addClass('d-flex');
        $('table.tblBillComm > tbody > tr > td').addClass('col-4');
    }

});

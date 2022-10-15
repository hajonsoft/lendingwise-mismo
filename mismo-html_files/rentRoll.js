$(document).ready(function () {

    $('.dateClass').datepicker({
        autoclose: true,
        changeMonth: true,
        changeYear: true,
        dateFormat: 'mm/dd/yy'
    });
    if ($('.rentRollSecFields.secShow').length > 0) { //show title
        $(".rentRollSecFieldsClass").show();
    } else { //hide title
        $(".rentRollSecFieldsClass").hide();
    }

})

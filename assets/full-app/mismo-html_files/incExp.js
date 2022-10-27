/*
 * Calculate Primary Borrower Total HouseHold Income.
 */

function calculatePrimaryNewTotalNetMonthlyIncome(currentvalue, borrowerOpt) {

    var newNetMonthlyIncome = 0, grossIncome1 = 0, commissionOrBonus1 = 0;
    var overtime1 = 0, tipsMiscIncome1 = 0, federalTaxFICA1 = 0, otherDeductions1 = 0;
    var totalGrossIncome = militaryIncome1 = 0;

    alertToEnterInput(currentvalue);

    try {
        grossIncome1 = document.loanModForm.grossIncome1.value;
    } catch (e) {
    }
    try {
        commissionOrBonus1 = document.loanModForm.commissionOrBonus1.value;
    } catch (e) {
    }
    try {
        overtime1 = document.loanModForm.overtime1.value;
    } catch (e) {
    }
    try {
        tipsMiscIncome1 = document.loanModForm.tipsMiscIncome1.value;
    } catch (e) {
    }
    try {
        federalTaxFICA1 = document.loanModForm.federalTaxFICA1.value;
    } catch (e) {
    }
    try {
        otherDeductions1 = document.loanModForm.otherDeductions1.value;
    } catch (e) {
    }
    try {
        militaryIncome1 = document.loanModForm.militaryIncome1.value;
    } catch (e) {
    }

    try {
        grossIncome1 = replaceCommaValues(grossIncome1);
        commissionOrBonus1 = replaceCommaValues(commissionOrBonus1);
        overtime1 = replaceCommaValues(overtime1);
        tipsMiscIncome1 = replaceCommaValues(tipsMiscIncome1);
        federalTaxFICA1 = replaceCommaValues(federalTaxFICA1);
        otherDeductions1 = replaceCommaValues(otherDeductions1);
        militaryIncome1 = replaceCommaValues(militaryIncome1);
    } catch (e) {
    }

    if (grossIncome1 == "") grossIncome1 = 0;
    if (commissionOrBonus1 == "") commissionOrBonus1 = 0;
    if (overtime1 == "") overtime1 = 0;
    if (tipsMiscIncome1 == "") tipsMiscIncome1 = 0;
    if (federalTaxFICA1 == "") federalTaxFICA1 = 0;
    if (otherDeductions1 == "") otherDeductions1 = 0;
    if (militaryIncome1 == "") militaryIncome1 = 0;

    totalGrossIncome = parseFloat(grossIncome1) + parseFloat(commissionOrBonus1) + parseFloat(overtime1) + parseFloat(tipsMiscIncome1) + parseFloat(militaryIncome1);

    newNetMonthlyIncome = parseFloat(totalGrossIncome) - (parseFloat(federalTaxFICA1) + parseFloat(otherDeductions1));
    newNetMonthlyIncome = newNetMonthlyIncome.toFixed(2);
    try {
        document.loanModForm.netMonthlyIncome1.value = newNetMonthlyIncome;
    } catch (e) {
    }

    calculatePrimaryTotalHouseHoldIncome(currentvalue);
}

/*
 * Calculate Primary Borrower Total HouseHold Income.
 */

function calculatePrimaryTotalHouseHoldIncome(currentvalue) {
    var netMonthlyIncome1 = 0, commissionOrBonus1 = 0, overtime1 = 0;
    var socialSecurity1 = 0, pensionOrRetirement1 = 0, disability1 = 0;
    var childSupportOrAlimony1 = 0, rental1 = 0, earnedInterest1 = 0;
    var sonOrDaughter1 = 0, parents1 = 0, unemployment1 = 0;
    var tipsMiscIncome1 = 0, primaryTotalHouseHoldIncome = 0, coBorrowerTotalHouseHoldIncome = 0;
    var totalHouseHoldIncome = 0, totalHouseHoldExpenses = 0, totalDisposableIncome = 0;
    var otherHouseHold1 = 0, roomRental1 = 0, secondJobIncome1 = 0;
    var foodStampWelfare1 = 0, primTotalGrossIncome = 0, grossIncome1 = 0;
    var primaryTotalNetHouseHoldIncome = 0, netSocialSecurity1 = 0, netPensionOrRetirement1 = 0;
    var netUnemployment1 = 0, netEarnedInterest1 = 0, netDisability1 = 0;
    var netRoomRental1 = 0, netSecondJobIncome1 = 0, netRental = 0;
    var coBorrowerTotalNetHouseHoldIncome = 0, netRental1 = 0, netRental2 = 0;
    var totalNetHouseHoldIncome = 0, totalGrossMonthlyHouseHoldIncome = 0;
    var isCoBorrower = militaryIncome1 = 0;

    alertToEnterInput(currentvalue);
    try {
        isCoBorrower = document.loanModForm.isCoBorrowerExists.value;
        isCoBorrower = trim(isCoBorrower);
    } catch (e) {
    }

    try {
        grossIncome1 = document.loanModForm.grossIncome1.value;
    } catch (e) {
    }
    try {
        netMonthlyIncome1 = document.loanModForm.netMonthlyIncome1.value;
    } catch (e) {
    }
    try {
        commissionOrBonus1 = document.loanModForm.commissionOrBonus1.value;
    } catch (e) {
    }
    try {
        overtime1 = document.loanModForm.overtime1.value;
    } catch (e) {
    }
    try {
        socialSecurity1 = document.loanModForm.socialSecurity1.value;
    } catch (e) {
    }
    try {
        pensionOrRetirement1 = document.loanModForm.pensionOrRetirement1.value;
    } catch (e) {
    }
    try {
        disability1 = document.loanModForm.disability1.value;
    } catch (e) {
    }
    try {
        childSupportOrAlimony1 = document.loanModForm.childSupportOrAlimony1.value;
    } catch (e) {
    }
    try {
        rental1 = document.loanModForm.rental1.value;
    } catch (e) {
    }
    try {
        earnedInterest1 = document.loanModForm.earnedInterest1.value;
    } catch (e) {
    }
    try {
        sonOrDaughter1 = document.loanModForm.sonOrDaughter1.value;
    } catch (e) {
    }
    try {
        parents1 = document.loanModForm.parents1.value;
    } catch (e) {
    }
    try {
        unemployment1 = document.loanModForm.unemployment1.value;
    } catch (e) {
    }
    try {
        tipsMiscIncome1 = document.loanModForm.tipsMiscIncome1.value;
    } catch (e) {
    }
    try {
        otherHouseHold1 = document.loanModForm.otherHouseHold1.value;
    } catch (e) {
    }
    try {
        roomRental1 = document.loanModForm.roomRental1.value;
    } catch (e) {
    }
    try {
        secondJobIncome1 = document.loanModForm.secondJobIncome1.value;
    } catch (e) {
    }
    try {
        foodStampWelfare1 = document.loanModForm.foodStampWelfare1.value;
    } catch (e) {
    }
    try {
        netSocialSecurity1 = document.loanModForm.netSocialSecurity1.value;
    } catch (e) {
    }
    try {
        netPensionOrRetirement1 = document.loanModForm.netPensionOrRetirement1.value;
    } catch (e) {
    }
    try {
        netDisability1 = document.loanModForm.netDisability1.value;
    } catch (e) {
    }
    try {
        netUnemployment1 = document.loanModForm.netUnemployment1.value;
    } catch (e) {
    }
    try {
        netEarnedInterest1 = document.loanModForm.netEarnedInterest1.value;
    } catch (e) {
    }
    try {
        netRoomRental1 = document.loanModForm.netRoomRental1.value;
    } catch (e) {
    }
    try {
        netSecondJobIncome1 = document.loanModForm.netSecondJobIncome1.value;
    } catch (e) {
    }
    try {
        netRental1 = document.loanModForm.netRental1.value;
    } catch (e) {
    }
    try {
        militaryIncome1 = document.loanModForm.militaryIncome1.value;
    } catch (e) {
    }

    try {
        earnedInterest1 = replaceCommaValues(earnedInterest1);
        netEarnedInterest1 = replaceCommaValues(netEarnedInterest1);
        rental1 = replaceCommaValues(rental1);
        netRental1 = replaceCommaValues(netRental1);
        netMonthlyIncome1 = replaceCommaValues(netMonthlyIncome1);
        commissionOrBonus1 = replaceCommaValues(commissionOrBonus1);
        overtime1 = replaceCommaValues(overtime1);
        socialSecurity1 = replaceCommaValues(socialSecurity1);
        pensionOrRetirement1 = replaceCommaValues(pensionOrRetirement1);
        disability1 = replaceCommaValues(disability1);
        childSupportOrAlimony1 = replaceCommaValues(childSupportOrAlimony1);
        sonOrDaughter1 = replaceCommaValues(sonOrDaughter1);
        parents1 = replaceCommaValues(parents1);
        unemployment1 = replaceCommaValues(unemployment1);
        tipsMiscIncome1 = replaceCommaValues(tipsMiscIncome1);
        otherHouseHold1 = replaceCommaValues(otherHouseHold1);
        roomRental1 = replaceCommaValues(roomRental1);
        secondJobIncome1 = replaceCommaValues(secondJobIncome1);
        grossIncome1 = replaceCommaValues(grossIncome1);
        foodStampWelfare1 = replaceCommaValues(foodStampWelfare1);
        netSocialSecurity1 = replaceCommaValues(netSocialSecurity1);
        netPensionOrRetirement1 = replaceCommaValues(netPensionOrRetirement1);
        netDisability1 = replaceCommaValues(netDisability1);
        netUnemployment1 = replaceCommaValues(netUnemployment1);
        netRoomRental1 = replaceCommaValues(netRoomRental1);
        netSecondJobIncome1 = replaceCommaValues(netSecondJobIncome1);
        militaryIncome1 = replaceCommaValues(militaryIncome1);
    } catch (e) {
    }

    if (netMonthlyIncome1 == "") netMonthlyIncome1 = 0;
    if (grossIncome1 == "") grossIncome1 = 0;
    if (commissionOrBonus1 == "") commissionOrBonus1 = 0;
    if (overtime1 == "") overtime1 = 0;
    if (socialSecurity1 == "") socialSecurity1 = 0;
    if (pensionOrRetirement1 == "") pensionOrRetirement1 = 0;
    if (disability1 == "") disability1 = 0;
    if (childSupportOrAlimony1 == "") childSupportOrAlimony1 = 0;
    if (rental1 == "") rental1 = 0;
    if (earnedInterest1 == "") earnedInterest1 = 0;
    if (sonOrDaughter1 == "") sonOrDaughter1 = 0;
    if (parents1 == "") parents1 = 0;
    if (unemployment1 == "") unemployment1 = 0;
    if (tipsMiscIncome1 == "") tipsMiscIncome1 = 0;
    if (otherHouseHold1 == "") otherHouseHold1 = 0;
    if (isCoBorrower == "") isCoBorrower = 0;
    if (roomRental1 == "") roomRental1 = 0;
    if (secondJobIncome1 == "") secondJobIncome1 = 0;
    if (foodStampWelfare1 == "") foodStampWelfare1 = 0;
    if (netSocialSecurity1 == "") netSocialSecurity1 = 0;
    if (netPensionOrRetirement1 == "") netPensionOrRetirement1 = 0;
    if (netDisability1 == "") netDisability1 = 0;
    if (netEarnedInterest1 == "") netEarnedInterest1 = 0;
    if (netUnemployment1 == "") netUnemployment1 = 0;
    if (netRoomRental1 == "") netRoomRental1 = 0;
    if (netSecondJobIncome1 == "") netSecondJobIncome1 = 0;
    if (netRental1 == "") netRental1 = 0;
    if (militaryIncome1 == "") militaryIncome1 = 0;

    primTotalGrossIncome = parseFloat(grossIncome1) + parseFloat(commissionOrBonus1) + parseFloat(overtime1) + parseFloat(tipsMiscIncome1) + parseFloat(militaryIncome1);
    primTotalGrossIncome = parseFloat(primTotalGrossIncome);
    primTotalGrossIncome = primTotalGrossIncome.toFixed(2);

    try {
        document.getElementById("primTotalGrossIncome").innerHTML = convertInputToAbsoluteValue(primTotalGrossIncome);
    } catch (e) {
    }
    var addGrossedUp1 = false;
    try {
        eval("addGrossedUp1 = document.getElementById('addGrossedUp1').checked");
    } catch (e) {
    }
    if (addGrossedUp1) {
        socialSecurity1 = socialSecurity1 * 1.25;
    }
    primaryTotalHouseHoldIncome = parseFloat(primTotalGrossIncome);
    primaryTotalHouseHoldIncome += parseFloat(socialSecurity1) + parseFloat(pensionOrRetirement1);
    primaryTotalHouseHoldIncome += parseFloat(disability1) + parseFloat(childSupportOrAlimony1);
    primaryTotalHouseHoldIncome += parseFloat(rental1) + parseFloat(earnedInterest1);
    primaryTotalHouseHoldIncome += parseFloat(sonOrDaughter1) + parseFloat(parents1);
    primaryTotalHouseHoldIncome += parseFloat(unemployment1) + parseFloat(otherHouseHold1);
    primaryTotalHouseHoldIncome += parseFloat(roomRental1) + parseFloat(secondJobIncome1);
    primaryTotalHouseHoldIncome += parseFloat(foodStampWelfare1)
    primaryTotalHouseHoldIncome = parseFloat(primaryTotalHouseHoldIncome);
    primaryTotalHouseHoldIncome = primaryTotalHouseHoldIncome.toFixed(2);

    primaryTotalNetHouseHoldIncome = parseFloat(netMonthlyIncome1);
    primaryTotalNetHouseHoldIncome += parseFloat(netSocialSecurity1) + parseFloat(netPensionOrRetirement1);
    primaryTotalNetHouseHoldIncome += parseFloat(netDisability1) + parseFloat(netUnemployment1);
    primaryTotalNetHouseHoldIncome += parseFloat(netRental1) + parseFloat(netEarnedInterest1);
    primaryTotalNetHouseHoldIncome += parseFloat(netRoomRental1) + parseFloat(netSecondJobIncome1);
    primaryTotalNetHouseHoldIncome += parseFloat(sonOrDaughter1) + parseFloat(parents1);
    primaryTotalNetHouseHoldIncome += parseFloat(childSupportOrAlimony1) + parseFloat(otherHouseHold1);
    primaryTotalNetHouseHoldIncome += parseFloat(foodStampWelfare1);
    primaryTotalNetHouseHoldIncome = parseFloat(primaryTotalNetHouseHoldIncome);
    primaryTotalNetHouseHoldIncome = primaryTotalNetHouseHoldIncome.toFixed(2);

    try {
        document.getElementById("primTotalHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(primaryTotalHouseHoldIncome);
    } catch (e) {
    }
    try {
        document.getElementById("primTotalNetHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(primaryTotalNetHouseHoldIncome);
    } catch (e) {
    }

    if (isCoBorrower == 1) {
        /*try {
	    coBorrowerTotalHouseHoldIncome = document.getElementById("coTotalHouseHoldIncome").innerHTML;
	    coBorrowerTotalHouseHoldIncome = trim(coBorrowerTotalHouseHoldIncome);
        } catch(e) {}*/
        coBorrowerTotalHouseHoldIncome = getTextValue('coTotalHouseHoldIncome');
    }

    try {
        primaryTotalHouseHoldIncome = replaceCommaValues(primaryTotalHouseHoldIncome);
        //coBorrowerTotalHouseHoldIncome  = replaceCommaValues(coBorrowerTotalHouseHoldIncome);
    } catch (e) {
    }

    //if (coBorrowerTotalHouseHoldIncome == "")   coBorrowerTotalHouseHoldIncome = 0;
    coBorrowerTotalHouseHoldIncome = parseFloat(coBorrowerTotalHouseHoldIncome);
    totalGrossMonthlyHouseHoldIncome = parseFloat(primaryTotalHouseHoldIncome) + coBorrowerTotalHouseHoldIncome;
    totalGrossMonthlyHouseHoldIncome = parseFloat(totalGrossMonthlyHouseHoldIncome);
    totalGrossMonthlyHouseHoldIncome = totalGrossMonthlyHouseHoldIncome.toFixed(2);

    if (isCoBorrower == 1) {
        /*try {
	    coBorrowerTotalNetHouseHoldIncome = document.getElementById("coTotalNetHouseHoldIncome").innerHTML;
	    coBorrowerTotalNetHouseHoldIncome = trim(coBorrowerTotalNetHouseHoldIncome);
        } catch(e) {}*/

        coBorrowerTotalHouseHoldIncome = getTextValue('coTotalNetHouseHoldIncome');
    }
    try {
        primaryTotalNetHouseHoldIncome = replaceCommaValues(primaryTotalNetHouseHoldIncome);
        //coBorrowerTotalNetHouseHoldIncome = replaceCommaValues(coBorrowerTotalNetHouseHoldIncome);
    } catch (e) {
    }

    //if (coBorrowerTotalNetHouseHoldIncome == "")    coBorrowerTotalNetHouseHoldIncome = 0;
    coBorrowerTotalNetHouseHoldIncome = parseFloat(coBorrowerTotalHouseHoldIncome);
    totalHouseHoldIncome = parseFloat(primaryTotalNetHouseHoldIncome) + coBorrowerTotalNetHouseHoldIncome;
    totalHouseHoldIncome = parseFloat(totalHouseHoldIncome);
    totalHouseHoldIncome = totalHouseHoldIncome.toFixed(2);

    try {
        document.getElementById("totalHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(totalHouseHoldIncome);
    } catch (e) {
    }

    try {
        totalHouseHoldExpenses = document.getElementById("totalHouseHoldExpenses").innerHTML;
        totalHouseHoldExpenses = trim(totalHouseHoldExpenses);
    } catch (e) {
    }
    if (totalHouseHoldExpenses == "") totalHouseHoldExpenses = 0;
    try {
        document.getElementById("subTotalHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(totalGrossMonthlyHouseHoldIncome);
    } catch (e) {
    }
    try {
        document.getElementById("subTotalNetHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(totalHouseHoldIncome);
    } catch (e) {
    }
    try {
        document.getElementById("subTotalHouseHoldExpenses").innerHTML = convertInputToAbsoluteValue(totalHouseHoldExpenses);
    } catch (e) {
    }

    try {
        totalHouseHoldIncome = replaceCommaValues(totalHouseHoldIncome);
        totalHouseHoldExpenses = replaceCommaValues(totalHouseHoldExpenses);
    } catch (e) {
    }

    totalDisposableIncome = totalHouseHoldIncome - parseFloat(totalHouseHoldExpenses);
    totalDisposableIncome = parseFloat(totalDisposableIncome);
    totalDisposableIncome = totalDisposableIncome.toFixed(2);
    try {
        document.getElementById("totalDisposableIncome").innerHTML = convertInputToAbsoluteValue(totalDisposableIncome);
    } catch (e) {
    }

    calculateIncomeDTI();

}

/*
 * Calculate Primary Borrower Total HouseHold Income.
 */

function calculateCoBorrowerNewTotalNetMonthlyIncome(currentvalue) {

    var newNetMonthlyIncome = 0, grossIncome2 = 0, commissionOrBonus2 = 0, totalGrossIncome = 0;
    var overtime2 = 0, tipsMiscIncome2 = 0, federalTaxFICA2 = 0, otherDeductions2 = 0;

    alertToEnterInput(currentvalue);

    try {
        grossIncome2 = document.loanModForm.grossIncome2.value;
    } catch (e) {
    }
    try {
        commissionOrBonus2 = document.loanModForm.commissionOrBonus2.value;
    } catch (e) {
    }
    try {
        overtime2 = document.loanModForm.overtime2.value;
    } catch (e) {
    }
    try {
        tipsMiscIncome2 = document.loanModForm.tipsMiscIncome2.value;
    } catch (e) {
    }
    try {
        federalTaxFICA2 = document.loanModForm.federalTaxFICA2.value;
    } catch (e) {
    }
    try {
        otherDeductions2 = document.loanModForm.otherDeductions2.value;
    } catch (e) {
    }

    try {
        grossIncome2 = replaceCommaValues(grossIncome2);
        commissionOrBonus2 = replaceCommaValues(commissionOrBonus2);
        overtime2 = replaceCommaValues(overtime2);
        tipsMiscIncome2 = replaceCommaValues(tipsMiscIncome2);
        federalTaxFICA2 = replaceCommaValues(federalTaxFICA2);
        otherDeductions2 = replaceCommaValues(otherDeductions2);
    } catch (e) {
    }

    if (grossIncome2 == "") grossIncome2 = 0;
    if (commissionOrBonus2 == "") commissionOrBonus2 = 0;
    if (overtime2 == "") overtime2 = 0;
    if (tipsMiscIncome2 == "") tipsMiscIncome2 = 0;
    if (federalTaxFICA2 == "") federalTaxFICA2 = 0;
    if (otherDeductions2 == "") otherDeductions2 = 0;

    totalGrossIncome = parseFloat(grossIncome2) + parseFloat(commissionOrBonus2) + parseFloat(overtime2) + parseFloat(tipsMiscIncome2);


    newNetMonthlyIncome = parseFloat(totalGrossIncome) - (parseFloat(federalTaxFICA2) + parseFloat(otherDeductions2));
    newNetMonthlyIncome = newNetMonthlyIncome.toFixed(2);

    try {
        document.loanModForm.netMonthlyIncome2.value = newNetMonthlyIncome;
    } catch (e) {
    }

    calculateCoBorrowerTotalHouseHoldIncome(currentvalue);
}

/*
 * Calculate Co-Borrower Total HouseHold Income.
 */

function calculateCoBorrowerTotalHouseHoldIncome(currentvalue) {
    var netMonthlyIncome2 = 0, commissionOrBonus2 = 0, overtime2 = 0;
    var socialSecurity2 = 0, pensionOrRetirement2 = 0, disability2 = 0;
    var childSupportOrAlimony2 = 0, rental2 = 0, earnedInterest2 = 0;
    var sonOrDaughter2 = 0;
    var parents2 = 0;
    var unemployment2 = 0;
    var tipsMiscIncome2 = 0;
    var coBorrowerTotalHouseHoldIncome = 0;
    var primaryTotalHouseHoldIncome = 0;
    var totalHouseHoldIncome = 0;
    var totalHouseHoldExpenses = 0;
    var totalDisposableIncome = 0;
    var otherHouseHold2 = 0;
    var roomRental2 = 0;
    var secondJobIncome2 = 0;
    var foodStampWelfare2 = 0;
    var coTotalGrossIncome = 0, grossIncome2 = 0;
    var coBorrowerTotalNetHouseHoldIncome = 0, netSocialSecurity2 = 0;
    var netPensionOrRetirement2 = 0, netDisability2 = 0;
    var netUnemployment2 = 0, netEarnedInterest2 = 0, netRental = 0;
    var netRoomRental2 = 0, netSecondJobIncome2 = 0, primTotalNetHouseHoldIncome = 0;
    var totalGrossMonthlyHouseHoldIncome = 0, netRental1 = 0, netRental2 = 0;

    alertToEnterInput(currentvalue);

    try {
        netMonthlyIncome2 = document.loanModForm.netMonthlyIncome2.value;
    } catch (e) {
    }
    try {
        grossIncome2 = document.loanModForm.grossIncome2.value;
    } catch (e) {
    }
    try {
        commissionOrBonus2 = document.loanModForm.commissionOrBonus2.value;
    } catch (e) {
    }
    try {
        overtime2 = document.loanModForm.overtime2.value;
    } catch (e) {
    }
    try {
        socialSecurity2 = document.loanModForm.socialSecurity2.value;
    } catch (e) {
    }
    try {
        pensionOrRetirement2 = document.loanModForm.pensionOrRetirement2.value;
    } catch (e) {
    }
    try {
        disability2 = document.loanModForm.disability2.value;
    } catch (e) {
    }
    try {
        childSupportOrAlimony2 = document.loanModForm.childSupportOrAlimony2.value;
    } catch (e) {
    }
    try {
        rental2 = document.loanModForm.rental2.value;
    } catch (e) {
    }
    try {
        earnedInterest2 = document.loanModForm.earnedInterest2.value;
    } catch (e) {
    }
    try {
        sonOrDaughter2 = document.loanModForm.sonOrDaughter2.value;
    } catch (e) {
    }
    try {
        parents2 = document.loanModForm.parents2.value;
    } catch (e) {
    }
    try {
        unemployment2 = document.loanModForm.unemployment2.value;
    } catch (e) {
    }
    try {
        tipsMiscIncome2 = document.loanModForm.tipsMiscIncome2.value;
    } catch (e) {
    }
    try {
        otherHouseHold2 = document.loanModForm.otherHouseHold2.value;
    } catch (e) {
    }
    try {
        roomRental2 = document.loanModForm.roomRental2.value;
    } catch (e) {
    }
    try {
        secondJobIncome2 = document.loanModForm.secondJobIncome2.value;
    } catch (e) {
    }
    try {
        foodStampWelfare2 = document.loanModForm.foodStampWelfare2.value;
    } catch (e) {
    }
    try {
        netSocialSecurity2 = document.loanModForm.netSocialSecurity2.value;
    } catch (e) {
    }
    try {
        netPensionOrRetirement2 = document.loanModForm.netPensionOrRetirement2.value;
    } catch (e) {
    }
    try {
        netDisability2 = document.loanModForm.netDisability2.value;
    } catch (e) {
    }
    try {
        netUnemployment2 = document.loanModForm.netUnemployment2.value;
    } catch (e) {
    }
    try {
        netEarnedInterest2 = document.loanModForm.netEarnedInterest2.value;
    } catch (e) {
    }
    try {
        netRoomRental2 = document.loanModForm.netRoomRental2.value;
    } catch (e) {
    }
    try {
        netSecondJobIncome2 = document.loanModForm.netSecondJobIncome2.value;
    } catch (e) {
    }
    try {
        netRental2 = document.loanModForm.netRental2.value;
    } catch (e) {
    }

    try {
        rental2 = replaceCommaValues(rental2);
        earnedInterest2 = replaceCommaValues(earnedInterest2);
        netRental2 = replaceCommaValues(netRental2);
        netEarnedInterest2 = replaceCommaValues(netEarnedInterest2);
        netMonthlyIncome2 = replaceCommaValues(netMonthlyIncome2);
        commissionOrBonus2 = replaceCommaValues(commissionOrBonus2);
        overtime2 = replaceCommaValues(overtime2);
        socialSecurity2 = replaceCommaValues(socialSecurity2);
        pensionOrRetirement2 = replaceCommaValues(pensionOrRetirement2);
        disability2 = replaceCommaValues(disability2);
        childSupportOrAlimony2 = replaceCommaValues(childSupportOrAlimony2);
        sonOrDaughter2 = replaceCommaValues(sonOrDaughter2);
        parents2 = replaceCommaValues(parents2);
        unemployment2 = replaceCommaValues(unemployment2);
        tipsMiscIncome2 = replaceCommaValues(tipsMiscIncome2);
        otherHouseHold2 = replaceCommaValues(otherHouseHold2);
        roomRental2 = replaceCommaValues(roomRental2);
        secondJobIncome2 = replaceCommaValues(secondJobIncome2);
        grossIncome2 = replaceCommaValues(grossIncome2);
        foodStampWelfare2 = replaceCommaValues(foodStampWelfare2);
        netSocialSecurity2 = replaceCommaValues(netSocialSecurity2);
        netPensionOrRetirement2 = replaceCommaValues(netPensionOrRetirement2);
        netDisability2 = replaceCommaValues(netDisability2);
        netUnemployment2 = replaceCommaValues(netUnemployment2);
        netRoomRental2 = replaceCommaValues(netRoomRental2);
        netSecondJobIncome2 = replaceCommaValues(netSecondJobIncome2);
    } catch (e) {
    }

    if (netMonthlyIncome2 == "") {
        netMonthlyIncome2 = 0;
    }
    if (grossIncome2 == "") {
        grossIncome2 = 0;
    }
    if (commissionOrBonus2 == "") {
        commissionOrBonus2 = 0;
    }
    if (overtime2 == "") {
        overtime2 = 0;
    }
    if (socialSecurity2 == "") {
        socialSecurity2 = 0;
    }
    if (pensionOrRetirement2 == "") {
        pensionOrRetirement2 = 0;
    }
    if (disability2 == "") {
        disability2 = 0;
    }
    if (childSupportOrAlimony2 == "") {
        childSupportOrAlimony2 = 0;
    }
    if (rental2 == "") {
        rental2 = 0;
    }
    if (earnedInterest2 == "") {
        earnedInterest2 = 0;
    }
    if (sonOrDaughter2 == "") {
        sonOrDaughter2 = 0;
    }
    if (parents2 == "") {
        parents2 = 0;
    }
    if (unemployment2 == "") {
        unemployment2 = 0;
    }
    if (tipsMiscIncome2 == "") {
        tipsMiscIncome2 = 0;
    }
    if (otherHouseHold2 == "") {
        otherHouseHold2 = 0;
    }
    if (roomRental2 == "") {
        roomRental2 = 0;
    }
    if (secondJobIncome2 == "") {
        secondJobIncome2 = 0;
    }
    if (foodStampWelfare2 == "") {
        foodStampWelfare2 = 0;
    }
    if (netSocialSecurity2 == "") {
        netSocialSecurity2 = 0;
    }
    if (netPensionOrRetirement2 == "") {
        netPensionOrRetirement2 = 0;
    }
    if (netDisability2 == "") {
        netDisability2 = 0;
    }
    if (netEarnedInterest2 == "") {
        netEarnedInterest2 = 0;
    }
    if (netUnemployment2 == "") {
        netUnemployment2 = 0;
    }
    if (netRoomRental2 == "") {
        netRoomRental2 = 0;
    }
    if (netSecondJobIncome2 == "") {
        netSecondJobIncome2 = 0;
    }
    if (netRental2 == "") {
        netRental2 = 0;
    }

    coTotalGrossIncome = parseFloat(grossIncome2) + parseFloat(commissionOrBonus2);
    coTotalGrossIncome += parseFloat(overtime2) + parseFloat(tipsMiscIncome2);
    coTotalGrossIncome = parseFloat(coTotalGrossIncome);
    coTotalGrossIncome = coTotalGrossIncome.toFixed(2);
    try {
        document.getElementById("coTotalGrossIncome").innerHTML = convertInputToAbsoluteValue(coTotalGrossIncome);
    } catch (e) {
    }
    var addGrossedUp2 = false;
    try {
        eval("addGrossedUp2 = document.getElementById('addGrossedUp2').checked");
    } catch (e) {
    }
    if (addGrossedUp2) {
        socialSecurity2 = socialSecurity2 * 1.25;
    }

    coBorrowerTotalHouseHoldIncome = parseFloat(coTotalGrossIncome);
//        coBorrowerTotalHouseHoldIncome += parseFloat(commissionOrBonus2)+parseFloat(overtime2)+parseFloat(tipsMiscIncome2);
    coBorrowerTotalHouseHoldIncome += parseFloat(socialSecurity2) + parseFloat(pensionOrRetirement2);
    coBorrowerTotalHouseHoldIncome += parseFloat(disability2) + parseFloat(childSupportOrAlimony2);
    coBorrowerTotalHouseHoldIncome += parseFloat(rental2) + parseFloat(earnedInterest2);
    coBorrowerTotalHouseHoldIncome += parseFloat(sonOrDaughter2) + parseFloat(parents2);
    coBorrowerTotalHouseHoldIncome += parseFloat(unemployment2);
    coBorrowerTotalHouseHoldIncome += parseFloat(otherHouseHold2);
    coBorrowerTotalHouseHoldIncome += parseFloat(roomRental2) + parseFloat(secondJobIncome2);
    coBorrowerTotalHouseHoldIncome += parseFloat(foodStampWelfare2);
    coBorrowerTotalHouseHoldIncome = parseFloat(coBorrowerTotalHouseHoldIncome);
    coBorrowerTotalHouseHoldIncome = coBorrowerTotalHouseHoldIncome.toFixed(2);

    coBorrowerTotalNetHouseHoldIncome = parseFloat(netMonthlyIncome2);
//        coBorrowerTotalHouseHoldIncome += parseFloat(commissionOrBonus2)+parseFloat(overtime2)+parseFloat(tipsMiscIncome2);
    coBorrowerTotalNetHouseHoldIncome += parseFloat(netSocialSecurity2) + parseFloat(netPensionOrRetirement2);
    coBorrowerTotalNetHouseHoldIncome += parseFloat(netDisability2) + parseFloat(netUnemployment2);
    coBorrowerTotalNetHouseHoldIncome += parseFloat(netRental2) + parseFloat(netEarnedInterest2);
    coBorrowerTotalNetHouseHoldIncome += parseFloat(netRoomRental2) + parseFloat(netSecondJobIncome2);
    coBorrowerTotalNetHouseHoldIncome += parseFloat(sonOrDaughter2) + parseFloat(parents2);
    coBorrowerTotalNetHouseHoldIncome += parseFloat(childSupportOrAlimony2) + parseFloat(otherHouseHold2);
    coBorrowerTotalNetHouseHoldIncome += parseFloat(foodStampWelfare2);
    coBorrowerTotalNetHouseHoldIncome = parseFloat(coBorrowerTotalNetHouseHoldIncome);
    coBorrowerTotalNetHouseHoldIncome = coBorrowerTotalNetHouseHoldIncome.toFixed(2);
    try {
        document.getElementById("coTotalHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(coBorrowerTotalHouseHoldIncome);
    } catch (e) {
    }
    try {
        document.getElementById("coTotalNetHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(coBorrowerTotalNetHouseHoldIncome);
    } catch (e) {
    }
    try {
        primaryTotalHouseHoldIncome = document.getElementById("primTotalHouseHoldIncome").innerHTML;
        primaryTotalHouseHoldIncome = trim(primaryTotalHouseHoldIncome);
    } catch (e) {
    }
    if (primaryTotalHouseHoldIncome == "") {
        primaryTotalHouseHoldIncome = 0;
    }

    try {
        primaryTotalHouseHoldIncome = replaceCommaValues(primaryTotalHouseHoldIncome);
        coBorrowerTotalHouseHoldIncome = replaceCommaValues(coBorrowerTotalHouseHoldIncome);
    } catch (e) {
    }

    primaryTotalHouseHoldIncome = parseFloat(primaryTotalHouseHoldIncome);
    totalGrossMonthlyHouseHoldIncome = primaryTotalHouseHoldIncome + parseFloat(coBorrowerTotalHouseHoldIncome);
    totalGrossMonthlyHouseHoldIncome = parseFloat(totalGrossMonthlyHouseHoldIncome);
    totalGrossMonthlyHouseHoldIncome = totalGrossMonthlyHouseHoldIncome.toFixed(2);

    try {
        primTotalNetHouseHoldIncome = document.getElementById("primTotalNetHouseHoldIncome").innerHTML;
        primTotalNetHouseHoldIncome = trim(primTotalNetHouseHoldIncome);
        primTotalNetHouseHoldIncome = replaceCommaValues(primTotalNetHouseHoldIncome);
    } catch (e) {
    }
    if (primTotalNetHouseHoldIncome == "") {
        primTotalNetHouseHoldIncome = 0;
    }

    try {
        primTotalNetHouseHoldIncome = replaceCommaValues(primTotalNetHouseHoldIncome);
        coBorrowerTotalNetHouseHoldIncome = replaceCommaValues(coBorrowerTotalNetHouseHoldIncome);
    } catch (e) {
    }

    primTotalNetHouseHoldIncome = parseFloat(primTotalNetHouseHoldIncome);
    totalHouseHoldIncome = primTotalNetHouseHoldIncome + parseFloat(coBorrowerTotalNetHouseHoldIncome);
    totalHouseHoldIncome = parseFloat(totalHouseHoldIncome);
    totalHouseHoldIncome = totalHouseHoldIncome.toFixed(2);
    try {
        document.getElementById("subTotalNetHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(totalHouseHoldIncome);
    } catch (e) {
    }
    try {
        document.getElementById("totalHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(totalHouseHoldIncome);
    } catch (e) {
    }

    try {
        totalHouseHoldExpenses = document.getElementById("totalHouseHoldExpenses").innerHTML;
        totalHouseHoldExpenses = trim(totalHouseHoldExpenses);
    } catch (e) {
    }
    if (totalHouseHoldExpenses == "") {
        totalHouseHoldExpenses = 0;
    }
    try {
        document.getElementById("subTotalHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(totalGrossMonthlyHouseHoldIncome);
    } catch (e) {
    }

    try {
        document.getElementById("subTotalHouseHoldExpenses").innerHTML = convertInputToAbsoluteValue(totalHouseHoldExpenses);
    } catch (e) {
    }

    try {
        totalHouseHoldIncome = replaceCommaValues(totalHouseHoldIncome);
        totalHouseHoldExpenses = replaceCommaValues(totalHouseHoldExpenses);
    } catch (e) {
    }

    totalDisposableIncome = totalHouseHoldIncome - parseFloat(totalHouseHoldExpenses);
    totalDisposableIncome = parseFloat(totalDisposableIncome);
    totalDisposableIncome = totalDisposableIncome.toFixed(2);
    try {
        document.getElementById("totalDisposableIncome").innerHTML = convertInputToAbsoluteValue(totalDisposableIncome);
    } catch (e) {
    }

    calculateIncomeDTI();

}

/*
 * Calculate Primary Borrower Total HouseHold Expenses.
 */

function calculatePrimaryTotalHouseHoldExpenses(currentvalue) {

    var mortgage1MonthlyPayment = 0, mortgage2MonthlyPayment = 0, mortgage3MonthlyPayment = 0;
    var primaryMortgage1 = 0, HOAFees1 = 0, otherMortgage1 = 0;
    var taxes1 = 0, insurance1 = 0, creditCards1 = 0;
    var autoLoan1 = 0, unsecuredLoans1 = 0, studentLoans1 = 0;
    var childSupportOrAlimonyMonthly1 = 0, careAmt1 = 0, allInsurance1 = 0;
    var groceries1 = 0, carExpenses1 = 0, medicalBill1 = 0;
    var entertainment1 = 0, other1 = 0, primaryTotalHouseHoldExpenses = 0;
    var cable1 = 0, natural1 = 0, water1 = 0;
    var internet1 = 0, utilityOther1 = 0, electricity1 = 0;
    var primaryBorrowerPhone = 0, coTotalHouseHoldExpenses = 0, totalHouseHoldExpenses = "";
    var totalHouseHoldIncome = 0, totalHouseHoldExpenses = 0, totalDisposableIncome = 0;
    var isCoBorrower = 0, mortgageInsurance1 = 0, floodInsurance1 = 0;
    var rentalExp1 = 0, donation1 = 0, pets1 = 0;
    var personalLoan1 = 0, dryCleaning1 = 0, lunchPurchased1 = 0;
    var monthlyParking1 = 0, unionDues1 = 0, isHMLOOpt = 0;

    alertToEnterInput(currentvalue);

    isCoBorrower = getFieldsValue('isCoBorrowerExists');
    isHMLOOpt = getFieldsValue('isHMLOOpt');
    mortgage1MonthlyPayment = getFieldsValue('mortgage1MonthlyPayment');
    mortgage2MonthlyPayment = getFieldsValue('mortgage2MonthlyPayment');
    HOAFees1 = getFieldsValue('HOAFees1');
    if (isHMLOOpt == 1) {
        taxes1 = getFieldsValue('HMLORealEstateTaxes');
        insurance1 = getFieldsValue('totalInsurance');
    } else {
        taxes1 = getFieldsValue('taxes1');
        insurance1 = getFieldsValue('insurance1');
        floodInsurance1 = getFieldsValue('floodInsurance1');
    }
    otherMortgage1 = getFieldsValue('otherMortgage1');
    creditCards1 = getFieldsValue('creditCards1');
    autoLoan1 = getFieldsValue('autoLoan1');
    unsecuredLoans1 = getFieldsValue('unsecuredLoans1');
    studentLoans1 = getFieldsValue('studentLoans1');
    childSupportOrAlimonyMonthly1 = getFieldsValue('childSupportOrAlimonyMonthly1');
    careAmt1 = getFieldsValue('careAmt1');
    allInsurance1 = getFieldsValue('allInsurance1');
    groceries1 = getFieldsValue('groceries1');
    carExpenses1 = getFieldsValue('carExpenses1');
    medicalBill1 = getFieldsValue('medicalBill1');
    entertainment1 = getFieldsValue('entertainment1');
    other1 = getFieldsValue('other1');
    cable1 = getFieldsValue('cable1');
    natural1 = getFieldsValue('natural1');
    water1 = getFieldsValue('water1');
    internet1 = getFieldsValue('internet1');
    utilityOther1 = getFieldsValue('utilityOther1');
    electricity1 = getFieldsValue('electricity1');
    primaryBorrowerPhone = getFieldsValue('primaryBorrowerPhone');
    mortgageInsurance1 = getFieldsValue('mortgageInsurance1');
    donation1 = getFieldsValue('donation1');
    pets1 = getFieldsValue('pets1');
    monthlyParking1 = getFieldsValue('monthlyParking1');
    unionDues1 = getFieldsValue('unionDues1');
    personalLoan1 = getFieldsValue('personalLoan1');
    dryCleaning1 = getFieldsValue('dryCleaning1');
    lunchPurchased1 = getFieldsValue('lunchPurchased1');
    rentalExp1 = getFieldsValue('rentalExp1');

    primaryMortgage1 = parseFloat(mortgage1MonthlyPayment) + parseFloat(mortgage2MonthlyPayment);

    primaryTotalHouseHoldExpenses = parseFloat(primaryMortgage1) + parseFloat(HOAFees1);
    primaryTotalHouseHoldExpenses += parseFloat(taxes1) + parseFloat(insurance1);
    primaryTotalHouseHoldExpenses += parseFloat(otherMortgage1) + parseFloat(creditCards1);
    primaryTotalHouseHoldExpenses += parseFloat(autoLoan1) + parseFloat(childSupportOrAlimonyMonthly1);
    primaryTotalHouseHoldExpenses += parseFloat(unsecuredLoans1) + parseFloat(studentLoans1);
    primaryTotalHouseHoldExpenses += parseFloat(careAmt1) + parseFloat(allInsurance1) + parseFloat(groceries1);
    primaryTotalHouseHoldExpenses += parseFloat(carExpenses1) + parseFloat(medicalBill1);
    primaryTotalHouseHoldExpenses += parseFloat(entertainment1) + parseFloat(other1);
    primaryTotalHouseHoldExpenses += parseFloat(cable1) + parseFloat(natural1);
    primaryTotalHouseHoldExpenses += parseFloat(water1) + parseFloat(internet1);
    primaryTotalHouseHoldExpenses += parseFloat(utilityOther1) + parseFloat(electricity1);
    primaryTotalHouseHoldExpenses += parseFloat(primaryBorrowerPhone) + parseFloat(mortgageInsurance1);

    primaryTotalHouseHoldExpenses += parseFloat(donation1) + parseFloat(pets1);
    primaryTotalHouseHoldExpenses += parseFloat(monthlyParking1) + parseFloat(unionDues1);
    primaryTotalHouseHoldExpenses += parseFloat(personalLoan1) + parseFloat(dryCleaning1);
    primaryTotalHouseHoldExpenses += parseFloat(lunchPurchased1);
    primaryTotalHouseHoldExpenses += parseFloat(floodInsurance1);
    primaryTotalHouseHoldExpenses += parseFloat(rentalExp1);

    primaryTotalHouseHoldExpenses = parseFloat(primaryTotalHouseHoldExpenses);
    primaryTotalHouseHoldExpenses = primaryTotalHouseHoldExpenses.toFixed(2);

    try {
        document.getElementById("primTotalHouseHoldExpenses").innerHTML = convertInputToAbsoluteValue(primaryTotalHouseHoldExpenses);
    } catch (e) {
    }

    if (isCoBorrower == 1) {
        coTotalHouseHoldExpenses = getTextValue('coTotalHouseHoldExpenses');
    }
    if (coTotalHouseHoldExpenses == "") coTotalHouseHoldExpenses = 0;
    coTotalHouseHoldExpenses = parseFloat(coTotalHouseHoldExpenses);
    totalHouseHoldExpenses = parseFloat(primaryTotalHouseHoldExpenses) + coTotalHouseHoldExpenses;
    totalHouseHoldExpenses = parseFloat(totalHouseHoldExpenses);
    totalHouseHoldExpenses = totalHouseHoldExpenses.toFixed(2);
    try {
        document.getElementById("totalHouseHoldExpenses").innerHTML = convertInputToAbsoluteValue(totalHouseHoldExpenses);
    } catch (e) {
    }

    totalHouseHoldIncome = getTextValue('totalHouseHoldIncome');

    try {
        document.getElementById("subTotalNetHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(totalHouseHoldIncome);
    } catch (e) {
    }
    try {
        document.getElementById("subTotalHouseHoldExpenses").innerHTML = convertInputToAbsoluteValue(totalHouseHoldExpenses);
    } catch (e) {
    }

    try {
        totalHouseHoldIncome = replaceCommaValues(totalHouseHoldIncome);
        totalHouseHoldExpenses = replaceCommaValues(totalHouseHoldExpenses);
    } catch (e) {
    }

    totalDisposableIncome = parseFloat(totalHouseHoldIncome) - totalHouseHoldExpenses;
    totalDisposableIncome = parseFloat(totalDisposableIncome);
    totalDisposableIncome = totalDisposableIncome.toFixed(2);
    try {
        document.getElementById("totalDisposableIncome").innerHTML = convertInputToAbsoluteValue(totalDisposableIncome);
    } catch (e) {
    }


    var isHMLOOpt = 0;
    try {
        isHMLOOpt = document.loanModForm.isHMLOOpt.value;
    } catch (e) {
    }

    if (isHMLOOpt == 1) {
        calculateHMLOIncomeDTI();
    } else {
        calculateIncomeDTI();
    }
}

/*
 * Calculate CoBorrower Total HouseHold Expenses.
 */
function calculateCoBorrowerTotalHouseHoldExpenses(currentvalue) {
    var otherMortgage2 = 0, creditCards2 = 0, autoLoan2 = 0;
    var childSupportOrAlimonyMonthly2 = 0, unsecuredLoans2 = 0, studentLoans2 = 0;
    var careAmt2 = 0, allInsurance2 = 0, groceries2 = 0;
    var carExpenses2 = 0, medicalBill2 = 0, entertainment2 = 0;
    var other2 = 0, cable2 = 0, natural2 = 0;
    var water2 = 0, internet2 = 0, utilityOther2 = 0;
    var electricity2 = 0, coBorrowerPhone = 0, totalHouseHoldIncome = 0;
    var totalHouseHoldExpenses = 0, totalDisposableIncome = 0, rentalExp2 = 0;
    var coBorrowerTotalHouseHoldExpenses = 0, primaryTotalHouseHoldExpenses = "";
    var donation2 = 0, pets2 = 0, monthlyParking2 = 0, unionDues2 = 0;
    var personalLoan2 = 0, dryCleaning2 = 0, lunchPurchased2 = 0;

    alertToEnterInput(currentvalue);

    otherMortgage2 = getFieldsValue('otherMortgage2');
    creditCards2 = getFieldsValue('creditCards2');
    autoLoan2 = getFieldsValue('autoLoan2');
    unsecuredLoans2 = getFieldsValue('unsecuredLoans2');
    studentLoans2 = getFieldsValue('studentLoans2');
    childSupportOrAlimonyMonthly2 = getFieldsValue('childSupportOrAlimonyMonthly2');
    careAmt2 = getFieldsValue('careAmt2');
    allInsurance2 = getFieldsValue('allInsurance2');
    groceries2 = getFieldsValue('groceries2');
    carExpenses2 = getFieldsValue('carExpenses2');
    medicalBill2 = getFieldsValue('medicalBill2');
    entertainment2 = getFieldsValue('entertainment2');
    other2 = getFieldsValue('other2');
    cable2 = getFieldsValue('cable2');
    natural2 = getFieldsValue('natural2');
    water2 = getFieldsValue('water2');
    internet2 = getFieldsValue('internet2');
    utilityOther2 = getFieldsValue('utilityOther2');
    electricity2 = getFieldsValue('electricity2');
    coBorrowerPhone = getFieldsValue('coBorrowerPhone');
    donation2 = getFieldsValue('donation2');
    pets2 = getFieldsValue('pets2');
    monthlyParking2 = getFieldsValue('monthlyParking2');
    unionDues2 = getFieldsValue('unionDues2');
    personalLoan2 = getFieldsValue('personalLoan2');
    dryCleaning2 = getFieldsValue('dryCleaning2');
    lunchPurchased2 = getFieldsValue('lunchPurchased2');
    rentalExp2 = getFieldsValue('rentalExp2');


    coBorrowerTotalHouseHoldExpenses = parseFloat(otherMortgage2) + parseFloat(creditCards2);
    coBorrowerTotalHouseHoldExpenses += parseFloat(autoLoan2) + parseFloat(childSupportOrAlimonyMonthly2);
    coBorrowerTotalHouseHoldExpenses += parseFloat(unsecuredLoans2) + parseFloat(studentLoans2);
    coBorrowerTotalHouseHoldExpenses += parseFloat(careAmt2) + parseFloat(allInsurance2) + parseFloat(groceries2);
    coBorrowerTotalHouseHoldExpenses += parseFloat(carExpenses2) + parseFloat(medicalBill2);
    coBorrowerTotalHouseHoldExpenses += parseFloat(entertainment2) + parseFloat(other2);
    coBorrowerTotalHouseHoldExpenses += parseFloat(cable2) + parseFloat(natural2);
    coBorrowerTotalHouseHoldExpenses += parseFloat(water2) + parseFloat(internet2);
    coBorrowerTotalHouseHoldExpenses += parseFloat(utilityOther2) + parseFloat(electricity2);
    coBorrowerTotalHouseHoldExpenses += parseFloat(coBorrowerPhone);

    coBorrowerTotalHouseHoldExpenses += parseFloat(donation2) + parseFloat(pets2);
    coBorrowerTotalHouseHoldExpenses += parseFloat(monthlyParking2) + parseFloat(unionDues2);
    coBorrowerTotalHouseHoldExpenses += parseFloat(personalLoan2) + parseFloat(dryCleaning2);
    coBorrowerTotalHouseHoldExpenses += parseFloat(lunchPurchased2);
    coBorrowerTotalHouseHoldExpenses += parseFloat(rentalExp2);

    coBorrowerTotalHouseHoldExpenses = parseFloat(coBorrowerTotalHouseHoldExpenses);
    coBorrowerTotalHouseHoldExpenses = coBorrowerTotalHouseHoldExpenses.toFixed(2);

    try {
        document.getElementById("coTotalHouseHoldExpenses").innerHTML = convertInputToAbsoluteValue(coBorrowerTotalHouseHoldExpenses);
    } catch (e) {
    }
    try {
        primaryTotalHouseHoldExpenses = document.getElementById("primTotalHouseHoldExpenses").innerHTML;
        primaryTotalHouseHoldExpenses = replaceCommaValues(primaryTotalHouseHoldExpenses);
    } catch (e) {
    }
    if (primaryTotalHouseHoldExpenses == "") {
        primaryTotalHouseHoldExpenses = 0;
    }

    primaryTotalHouseHoldExpenses = parseFloat(primaryTotalHouseHoldExpenses);
    totalHouseHoldExpenses = primaryTotalHouseHoldExpenses + parseFloat(coBorrowerTotalHouseHoldExpenses);
    totalHouseHoldExpenses = parseFloat(totalHouseHoldExpenses);
    totalHouseHoldExpenses = totalHouseHoldExpenses.toFixed(2);
    try {
        document.getElementById("totalHouseHoldExpenses").innerHTML = convertInputToAbsoluteValue(totalHouseHoldExpenses);
    } catch (e) {
    }

    try {
        totalHouseHoldIncome = document.getElementById("totalHouseHoldIncome").innerHTML;
        totalHouseHoldIncome = replaceCommaValues(trim(totalHouseHoldIncome));
    } catch (e) {
    }
    if (totalHouseHoldIncome == "") totalHouseHoldIncome = 0;

    try {
        document.getElementById("subTotalNetHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(totalHouseHoldIncome);
    } catch (e) {
    }
    try {
        document.getElementById("subTotalHouseHoldExpenses").innerHTML = convertInputToAbsoluteValue(totalHouseHoldExpenses);
    } catch (e) {
    }

    try {
        totalHouseHoldIncome = replaceCommaValues(totalHouseHoldIncome);
        totalHouseHoldExpenses = replaceCommaValues(totalHouseHoldExpenses);
    } catch (e) {
    }

    totalDisposableIncome = parseFloat(totalHouseHoldIncome) - totalHouseHoldExpenses;
    totalDisposableIncome = parseFloat(totalDisposableIncome);
    totalDisposableIncome = totalDisposableIncome.toFixed(2);
    try {
        document.getElementById("totalDisposableIncome").innerHTML = convertInputToAbsoluteValue(totalDisposableIncome);
    } catch (e) {
    }
    var isHMLOOpt = 0;
    try {
        isHMLOOpt = document.loanModForm.isHMLOOpt.value;
    } catch (e) {
    }

    if (isHMLOOpt == 1) {
        calculateHMLOIncomeDTI();
    } else {
        calculateIncomeDTI();
    }
}

/*** Calculate Current DTI ***/
function calculateIncomeDTI() {

    var lien1DTI = 0, lien1PaymentPITIA = 0, lien2PaymentPITIA = 0;
    var grossIncome1 = 0, netMonthlyIncome1 = 0, commissionOrBonus1 = 0;
    var overtime1 = 0, tipsMiscIncome1 = 0, grossIncome2 = 0
    var netMonthlyIncome2 = 0, commissionOrBonus2 = 0, overtime2 = 0
    var tipsMiscIncome2 = 0, totalHouseHoldIncome = 0, grossMonthlyHouseHoldIncome = 0;
    var isCoBorrower = 0, socialSecurity1 = 0, socialSecurity2 = 0;
    var pensionOrRetirement1 = 0, pensionOrRetirement2 = 0, disability1 = 0;
    var disability2 = 0, earnedInterest1 = 0, earnedInterest2 = 0;
    var rental1 = 0, rental2 = 0, roomRental1 = 0;
    var roomRental2 = 0, unemployment1 = 0, unemployment2 = 0;
    var secondJobIncome1 = 0, secondJobIncome2 = 0, sonOrDaughter1 = 0;
    var parents1 = 0, parents2 = 0, sonOrDaughter2 = 0
    var childSupportOrAlimony1 = 0, childSupportOrAlimony2 = 0, otherHouseHold1 = 0
    var otherHouseHold2 = 0, foodStampWelfare1 = 0, foodStampWelfare2 = 0;
    var socialSecurity = 0, netSocialSecurity = 0, pensionOrRetirement = 0;
    var netPensionOrRetirement = 0, disability = 0, netDisability = 0;
    var earnedInterest = 0, netEarnedInterest = 0, rental = 0, netRental = 0;
    var roomRental = 0, netRoomRental = 0, unemployment = 0;
    var secondJobIncome = 0, netSecondJobIncome = 0, netUnemployment = 0;
    var sonOrDaughter = 0, parents = 0, childSupportOrAlimony = 0;
    var otherHouseHold = 0, foodStampWelfare = 0;
    primaryTotalHouseHoldExpenses = 0;

    try {
        isCoBorrower = document.loanModForm.isCoBorrowerExists.value;
        isCoBorrower = trim(isCoBorrower);
    } catch (e) {
    }
    try {
        isCoBorrower = document.loanModForm.isCoBorrower.value;
        isCoBorrower = trim(isCoBorrower);
    } catch (e) {
    }
    try {
        grossIncome1 = document.loanModForm.grossIncome1.value;
    } catch (e) {
    }

    try {
        netMonthlyIncome1 = document.loanModForm.netMonthlyIncome1.value;
    } catch (e) {
    }
    try {
        commissionOrBonus1 = document.loanModForm.commissionOrBonus1.value;
    } catch (e) {
    }
    try {
        overtime1 = document.loanModForm.overtime1.value;
    } catch (e) {
    }
    try {
        tipsMiscIncome1 = document.loanModForm.tipsMiscIncome1.value;
    } catch (e) {
    }

    try {
        socialSecurity1 = document.loanModForm.socialSecurity1.value;
    } catch (e) {
    }
    try {
        pensionOrRetirement1 = document.loanModForm.pensionOrRetirement1.value;
    } catch (e) {
    }
    try {
        disability1 = document.loanModForm.disability1.value;
    } catch (e) {
    }
    try {
        unemployment1 = document.loanModForm.unemployment1.value;
    } catch (e) {
    }
    try {
        rental1 = document.loanModForm.rental1.value;
    } catch (e) {
    }
    try {
        earnedInterest1 = document.loanModForm.earnedInterest1.value;
    } catch (e) {
    }
    try {
        roomRental1 = document.loanModForm.roomRental1.value;
    } catch (e) {
    }
    try {
        secondJobIncome1 = document.loanModForm.secondJobIncome1.value;
    } catch (e) {
    }
    try {
        sonOrDaughter1 = document.loanModForm.sonOrDaughter1.value;
    } catch (e) {
    }
    try {
        parents1 = document.loanModForm.parents1.value;
    } catch (e) {
    }
    try {
        childSupportOrAlimony1 = document.loanModForm.childSupportOrAlimony1.value;
    } catch (e) {
    }
    try {
        otherHouseHold1 = document.loanModForm.otherHouseHold1.value;
    } catch (e) {
    }
    try {
        foodStampWelfare1 = document.loanModForm.foodStampWelfare1.value;
    } catch (e) {
    }

    try {
        grossIncome1 = replaceCommaValues(grossIncome1);
        netMonthlyIncome1 = replaceCommaValues(netMonthlyIncome1);
        commissionOrBonus1 = replaceCommaValues(commissionOrBonus1);
        overtime1 = replaceCommaValues(overtime1);
        tipsMiscIncome1 = replaceCommaValues(tipsMiscIncome1);

        socialSecurity1 = replaceCommaValues(socialSecurity1);
        pensionOrRetirement1 = replaceCommaValues(pensionOrRetirement1);
        disability1 = replaceCommaValues(disability1);
        childSupportOrAlimony1 = replaceCommaValues(childSupportOrAlimony1);
        rental1 = replaceCommaValues(rental1);
        earnedInterest1 = replaceCommaValues(earnedInterest1);
        sonOrDaughter1 = replaceCommaValues(sonOrDaughter1);
        parents1 = replaceCommaValues(parents1);
        unemployment1 = replaceCommaValues(unemployment1);
        otherHouseHold1 = replaceCommaValues(otherHouseHold1);
        roomRental1 = replaceCommaValues(roomRental1);
        secondJobIncome1 = replaceCommaValues(secondJobIncome1);
        foodStampWelfare1 = replaceCommaValues(foodStampWelfare1);
    } catch (e) {
    }

    if (isCoBorrower == 1) {

        try {
            grossIncome2 = document.loanModForm.grossIncome2.value;
        } catch (e) {
        }
        try {
            netMonthlyIncome2 = document.loanModForm.netMonthlyIncome2.value;
        } catch (e) {
        }
        try {
            commissionOrBonus2 = document.loanModForm.commissionOrBonus2.value;
        } catch (e) {
        }
        try {
            overtime2 = document.loanModForm.overtime2.value;
        } catch (e) {
        }
        try {
            tipsMiscIncome2 = document.loanModForm.tipsMiscIncome2.value;
        } catch (e) {
        }

        try {
            socialSecurity2 = document.loanModForm.socialSecurity2.value;
        } catch (e) {
        }
        try {
            pensionOrRetirement2 = document.loanModForm.pensionOrRetirement2.value;
        } catch (e) {
        }
        try {
            disability2 = document.loanModForm.disability2.value;
        } catch (e) {
        }
        try {
            unemployment2 = document.loanModForm.unemployment2.value;
        } catch (e) {
        }
        try {
            rental2 = document.loanModForm.rental2.value;
        } catch (e) {
        }
        try {
            earnedInterest2 = document.loanModForm.earnedInterest2.value;
        } catch (e) {
        }
        try {
            roomRental2 = document.loanModForm.roomRental2.value;
        } catch (e) {
        }
        try {
            secondJobIncome2 = document.loanModForm.secondJobIncome2.value;
        } catch (e) {
        }
        try {
            sonOrDaughter2 = document.loanModForm.sonOrDaughter2.value;
        } catch (e) {
        }
        try {
            parents2 = document.loanModForm.parents2.value;
        } catch (e) {
        }
        try {
            childSupportOrAlimony2 = document.loanModForm.childSupportOrAlimony2.value;
        } catch (e) {
        }
        try {
            otherHouseHold2 = document.loanModForm.otherHouseHold2.value;
        } catch (e) {
        }
        try {
            foodStampWelfare2 = document.loanModForm.foodStampWelfare2.value;
        } catch (e) {
        }

        try {
            grossIncome2 = replaceCommaValues(grossIncome2);
            netMonthlyIncome2 = replaceCommaValues(netMonthlyIncome2);
            commissionOrBonus2 = replaceCommaValues(commissionOrBonus2);
            overtime2 = replaceCommaValues(overtime2);
            tipsMiscIncome2 = replaceCommaValues(tipsMiscIncome2);

            socialSecurity2 = replaceCommaValues(socialSecurity2);
            pensionOrRetirement2 = replaceCommaValues(pensionOrRetirement2);
            disability2 = replaceCommaValues(disability2);
            childSupportOrAlimony2 = replaceCommaValues(childSupportOrAlimony2);
            rental2 = replaceCommaValues(rental2);
            earnedInterest2 = replaceCommaValues(earnedInterest2);
            sonOrDaughter2 = replaceCommaValues(sonOrDaughter2);
            parents2 = replaceCommaValues(parents2);
            unemployment2 = replaceCommaValues(unemployment2);
            otherHouseHold2 = replaceCommaValues(otherHouseHold2);
            roomRental2 = replaceCommaValues(roomRental2);
            secondJobIncome2 = replaceCommaValues(secondJobIncome2);
            foodStampWelfare2 = replaceCommaValues(foodStampWelfare2);
        } catch (e) {
        }

    } else {
        try {
            primaryTotalHouseHoldExpenses = document.getElementById("primTotalHouseHoldExpenses").innerHTML;
            primaryTotalHouseHoldExpenses = trim(primaryTotalHouseHoldExpenses);
        } catch (e) {
        }

        try {
            document.getElementById("totalHouseHoldExpenses").innerHTML = convertInputToAbsoluteValue(primaryTotalHouseHoldExpenses);
        } catch (e) {
        }
    }

    if (netMonthlyIncome1 == "") netMonthlyIncome1 = 0;
    if (grossIncome1 == "") grossIncome1 = 0;
    if (commissionOrBonus1 == "") commissionOrBonus1 = 0;
    if (overtime1 == "") overtime1 = 0;
    if (tipsMiscIncome1 == "") tipsMiscIncome1 = 0;
    if (netMonthlyIncome2 == "") netMonthlyIncome2 = 0;
    if (grossIncome2 == "") grossIncome2 = 0;
    if (commissionOrBonus2 == "") commissionOrBonus2 = 0;
    if (overtime2 == "") overtime2 = 0;
    if (tipsMiscIncome2 == "") tipsMiscIncome2 = 0;
    if (socialSecurity1 == "") socialSecurity1 = 0;
    if (pensionOrRetirement1 == "") pensionOrRetirement1 = 0;
    if (disability1 == "") disability1 = 0;
    if (childSupportOrAlimony1 == "") childSupportOrAlimony1 = 0;
    if (rental1 == "") rental1 = 0;
    if (earnedInterest1 == "") earnedInterest1 = 0;
    if (sonOrDaughter1 == "") sonOrDaughter1 = 0;
    if (parents1 == "") parents1 = 0;
    if (unemployment1 == "") unemployment1 = 0;
    if (otherHouseHold1 == "") otherHouseHold1 = 0;
    if (roomRental1 == "") roomRental1 = 0;
    if (secondJobIncome1 == "") secondJobIncome1 = 0;
    if (foodStampWelfare1 == "") foodStampWelfare1 = 0;
    if (socialSecurity2 == "") socialSecurity2 = 0;
    if (pensionOrRetirement2 == "") pensionOrRetirement2 = 0;
    if (disability2 == "") disability2 = 0;
    if (childSupportOrAlimony2 == "") childSupportOrAlimony2 = 0;
    if (rental2 == "") rental2 = 0;
    if (earnedInterest2 == "") earnedInterest2 = 0;
    if (sonOrDaughter2 == "") sonOrDaughter2 = 0;
    if (parents2 == "") parents2 = 0;
    if (unemployment2 == "") unemployment2 = 0;
    if (otherHouseHold2 == "") otherHouseHold2 = 0;
    if (roomRental2 == "") roomRental2 = 0;
    if (secondJobIncome2 == "") secondJobIncome2 = 0;
    if (foodStampWelfare2 == "") foodStampWelfare2 = 0;
    try {
        totalHouseHoldIncome = document.getElementById("subTotalHouseHoldIncome").innerHTML;
    } catch (e) {
    }
    try {
        totalHouseHoldIncome = replaceCommaValues(totalHouseHoldIncome);
    } catch (e) {
    }
    var addGrossedUp1 = false;
    try {
        eval("addGrossedUp1 = document.getElementById('addGrossedUp1').checked");
    } catch (e) {
    }
    if (addGrossedUp1) {
        socialSecurity1 = socialSecurity1 * 1.25;
    }
    var addGrossedUp2 = false;
    try {
        eval("addGrossedUp2 = document.getElementById('addGrossedUp2').checked");
    } catch (e) {
    }
    if (addGrossedUp2) {
        socialSecurity2 = socialSecurity2 * 1.25;
    }

    if (totalHouseHoldIncome == "") totalHouseHoldIncome = 0;

    grossMonthlyHouseHoldIncome = parseFloat(grossIncome1) + parseFloat(grossIncome2);
    grossMonthlyHouseHoldIncome += parseFloat(commissionOrBonus1) + parseFloat(commissionOrBonus2);
    grossMonthlyHouseHoldIncome += parseFloat(overtime1) + parseFloat(overtime2);
    grossMonthlyHouseHoldIncome += parseFloat(tipsMiscIncome1) + parseFloat(tipsMiscIncome2);
    grossMonthlyHouseHoldIncome += parseFloat(socialSecurity1) + parseFloat(socialSecurity2);
    grossMonthlyHouseHoldIncome += parseFloat(pensionOrRetirement1) + parseFloat(pensionOrRetirement2);
    grossMonthlyHouseHoldIncome += parseFloat(disability1) + parseFloat(disability2);
    grossMonthlyHouseHoldIncome += parseFloat(childSupportOrAlimony1) + parseFloat(childSupportOrAlimony2);
    grossMonthlyHouseHoldIncome += parseFloat(rental1) + parseFloat(rental2);
    grossMonthlyHouseHoldIncome += parseFloat(earnedInterest1) + parseFloat(earnedInterest2);
    grossMonthlyHouseHoldIncome += parseFloat(sonOrDaughter1) + parseFloat(sonOrDaughter2);
    grossMonthlyHouseHoldIncome += parseFloat(parents1) + parseFloat(parents2);
    grossMonthlyHouseHoldIncome += parseFloat(unemployment1) + parseFloat(unemployment2);
    grossMonthlyHouseHoldIncome += parseFloat(otherHouseHold1) + parseFloat(otherHouseHold2);
    grossMonthlyHouseHoldIncome += parseFloat(roomRental1) + parseFloat(roomRental2);
    grossMonthlyHouseHoldIncome += parseFloat(secondJobIncome1) + parseFloat(secondJobIncome2);
    grossMonthlyHouseHoldIncome += parseFloat(foodStampWelfare1) + parseFloat(foodStampWelfare2);

    try {
        lien1PaymentPITIA = document.loanModForm.lien1PaymentPITIAValue.value;
    } catch (e) {
    }

    try {
        lien1PaymentPITIA = replaceCommaValues(lien1PaymentPITIA);
    } catch (e) {
    }

    if (lien1PaymentPITIA == "") lien1PaymentPITIA = 0;
    if (grossMonthlyHouseHoldIncome > 0) {
        lien1DTI = parseFloat(lien1PaymentPITIA);
        lien1DTI = parseFloat(lien1DTI) / parseFloat(grossMonthlyHouseHoldIncome);
        lien1DTI = lien1DTI * 100;
    }
    lien1DTI = lien1DTI.toFixed(2);

    try {
        eval("document.getElementById('lien1IncomeDTI').innerHTML = lien1DTI");
    } catch (e) {
    }
}

function saveCreditorsForm() {
    selCreditorAcctType = "", cc = 0;
    if (chkIsBlank('loanModForm', 'creditorName', 'Please enter the creditor name')) {
        saveCreditorsInfo();
    } else {
        return false;
    }
    clear_form_elements('creditorsLiabilities');

    /*document.getElementById("creditorName").value='';
    document.getElementById("creditorAcctNumber").value='';
    try
    {
        document.getElementById("alternateName").value='';
    }
    catch (e) { }
    try {
        document.getElementById("creditorType").value='';
        document.getElementById("accDesc").value='';
        document.getElementById("creditorMinPayment").value='';
        document.getElementById("creditorAcctBalance").value='';
        document.getElementById("creditorMonthsBehind").value='';
        document.getElementById("creditorRate").value='';
        document.getElementById("creditorStatus").value='';
        document.getElementById("creditorRepName").value='';
        document.getElementById("creditorRepPhoneNo1").value='';
        document.getElementById("creditorRepPhoneNo2").value='';
        document.getElementById("creditorRepPhoneNo3").value='';
        document.getElementById("creditorRepPhoneExt").value='';
        document.getElementById("creditorRepFax1").value='';
        document.getElementById("creditorRepFax1").value='';
        document.getElementById("creditorRepFax2").value='';
        document.getElementById("creditorRepFax3").value='';
        document.getElementById("creditorRepEmail").value='';
        document.getElementById("creditorRepNotes").value='';
        document.getElementById("creditorAgentName").value='';
        document.getElementById("creditorAgentPhoneNo1").value='';
        document.getElementById("creditorAgentPhoneNo2").value='';
        document.getElementById("creditorAgentPhoneNo3").value='';
        document.getElementById("creditorAgentPhoneExt").value='';
        document.getElementById("creditorAgentFax1").value='';
        document.getElementById("creditorAgentFax2").value='';
        document.getElementById("creditorAgentFax3").value='';
        document.getElementById("creditorAgentEmail").value='';
        document.getElementById("creditorAgentNotes").value='';
        document.getElementById("CIID").value='';
        document.getElementById("notificationDate").value='';

        document.getElementById("creditorAddress").value='';
        document.getElementById("creditorCity").value='';
        document.getElementById("creditorState").value='';
        document.getElementById("creditorZip").value='';

        document.getElementById("creditorAgentAddress").value='';
        document.getElementById("creditorAgentCity").value='';
        document.getElementById("creditorAgentState").value='';
        document.getElementById("creditorAgentZip").value='';
        document.getElementById("collectionAgencyName").value='';
        document.getElementById("monthsLeftToPay").value='';


        document.loanModForm.creditorAcctType[0].checked= false;
        document.loanModForm.creditorAcctType[1].checked= false;

    } catch(e) {}*/

    /*$('#creditorStatus option').each(function() {
       $(this).attr('selected','');
   });*/
    $('#creditorStatus').val('');
    $('.chzn-select').trigger("chosen:updated"); //update the select option values

}

function saveCreditorsInfo() {
    var creditorName = "", creditorAcctNumber = 0, creditorType = "", creditorAcctType = '', CIID = 0, LMRId = 0;
    var url = "", qstr = "", xmlDoc = "", creditorMinPayment = "", creditorMonthsBehind = 0, noOfMonthsBehind = 0;
    var creditorAcctBalance = 0, creditorRepName = "", creditorRepPhoneNo1 = "", creditorRepPhoneNo2 = "",
        creditorRepPhoneNo3 = "", creditorRepPhoneExt = "";
    var addLienFax1 = "", addLienFax2 = "", addLienFax3 = "", addLienEmail = "";
    var creditorRepFax1 = "", creditorRepFax2 = "", creditorRepFax3 = "", creditorRepEmail = "";
    var creditorRepNotes = "", creditorAgentName = "", creditorAgentPhoneNo1 = "", creditorAgentPhoneNo2 = "";
    var creditorAgentPhoneNo3 = "", creditorAgentPhoneExt = "", creditorAgentFax1 = "", creditorAgentFax2 = "",
        creditorAgentFax3 = "";
    var creditorAgentEmail = "", creditorAgentNotes = "", addLien3Fax3 = "", addLienEmail3 = "", creditorRate = "",
        accDesc = '', creditorStatus = "", notificationDate = '';

    var creditorAddress = '';
    var creditorCity = '';
    var creditorState = '';
    var creditorZip = '';
    var collectionAgencyName = '';
    var creditorAgentAddress = '';
    var creditorAgentCity = '';
    var creditorAgentState = '';
    var creditorAgentZip = '';
    var alternateName = '', monthsLeftToPay = '';
    var otherLiabilityNotes = '', unpaidTaxNotes = '';
    var payAtBeforeClosing = '';
    var creditorAcctStatus = '';
    var creditorPhone = '';
    var creditorMaturityDate = '';
    var creditorIsItSecured = '';
//        LMRId  = $('#LMRId').val();
    CIID = $('#CIID').val();
    if (CIID != '') {
        $("#save_saveCreditorsForm").val('Add New');
    }
    encryptedLMRId = document.loanModForm.encryptedLId.value;
    creditorName = emptyFieldChk($('#ccreditorName').val());
    creditorAcctNumber = emptyFieldChk($('#creditorAcctNumber').val());
    creditorType = emptyFieldChk($('#creditorType').val());
    creditorAcctType = emptyFieldChk($('#acctType').val());
    creditorMinPayment = emptyFieldChk($('#creditorMinPayment').val());
    creditorMonthsBehind = emptyFieldChk($('#creditorMonthsBehind').val());
    creditorAcctBalance = emptyFieldChk($('#creditorAcctBalance').val());
    creditorRepName = emptyFieldChk($('#creditorRepName').val());
    creditorRepPhoneNo1 = emptyFieldChk($('#creditorRepPhoneNo1').val());
    creditorRepPhoneNo2 = emptyFieldChk($('#creditorRepPhoneNo2').val());
    creditorRepPhoneNo3 = emptyFieldChk($('#creditorRepPhoneNo3').val());
    creditorRepPhoneExt = emptyFieldChk($('#creditorRepPhoneExt').val());
    creditorRepFax1 = emptyFieldChk($('#creditorRepFax1').val());
    creditorRepFax2 = emptyFieldChk($('#creditorRepFax2').val());
    creditorRepFax3 = emptyFieldChk($('#creditorRepFax3').val());
    creditorRepEmail = emptyFieldChk($('#creditorRepEmail').val());
    creditorRepNotes = emptyFieldChk($('#creditorRepNotes').val());
    creditorAgentName = emptyFieldChk($('#creditorAgentName').val());
    creditorAgentPhoneNo1 = emptyFieldChk($('#creditorAgentPhoneNo1').val());
    creditorAgentPhoneNo2 = emptyFieldChk($('#creditorAgentPhoneNo2').val());
    creditorAgentPhoneNo3 = emptyFieldChk($('#creditorAgentPhoneNo3').val());
    creditorAgentPhoneExt = emptyFieldChk($('#creditorAgentPhoneExt').val());
    creditorAgentFax1 = emptyFieldChk($('#creditorAgentFax1').val());
    creditorAgentFax2 = emptyFieldChk($('#creditorAgentFax2').val());
    creditorAgentFax3 = emptyFieldChk($('#creditorAgentFax3').val());
    creditorAgentEmail = emptyFieldChk($('#creditorAgentEmail').val());
    creditorAgentNotes = emptyFieldChk($('#creditorAgentNotes').val());
    creditorRate = emptyFieldChk($('#creditorRate').val());
    accDesc = emptyFieldChk($('#accDesc').val());
    creditorStatus = emptyFieldChk($('#creditorStatus').val());
    notificationDate = emptyFieldChk($('#notificationDate').val());
    creditorAddress = emptyFieldChk($('#creditorAddress').val());
    creditorCity = emptyFieldChk($('#creditorCity').val());
    creditorState = emptyFieldChk($('#creditorState').val());
    creditorZip = emptyFieldChk($('#creditorZip').val());
    creditorAgentAddress = emptyFieldChk($('#creditorAgentAddress').val());
    creditorAgentCity = emptyFieldChk($('#creditorAgentCity').val());
    creditorAgentState = emptyFieldChk($('#creditorAgentState').val());
    creditorAgentZip = emptyFieldChk($('#creditorAgentZip').val());
    collectionAgencyName = emptyFieldChk($('#collectionAgencyName').val());
    alternateName = emptyFieldChk($('#alternateName').val());
    otherLiabilityNotes = emptyFieldChk($('#otherLiabilityNotes').val());
    unpaidTaxNotes = emptyFieldChk($('#unpaidTaxNotes').val());
    if ($("input[name='payAtBeforeClosing']").is(':checked')) { //radio button val
        payAtBeforeClosing = $("input[name='payAtBeforeClosing']:checked").val();
    }
    if ($("input[name='creditorAcctStatus']").is(':checked')) {
        creditorAcctStatus = $("input[name='creditorAcctStatus']:checked").val();
    }
    creditorPhone = emptyFieldChk($('#creditorPhone').val());
    creditorMaturityDate = emptyFieldChk($('#creditorMaturityDate').val());
    creditorIsItSecured = emptyFieldChk($('#creditorIsItSecured').val());

    //try{
    monthsLeftToPay = emptyFieldChk($('#monthsLeftToPay').val());
    //} catch (e){}

    url = "../pops/saveCreditors.php";
    qstr = "LMRId=" + encryptedLMRId + "&CIID=" + CIID + "&creditorName=" + creditorName + "&creditorAcctNumber=" + creditorAcctNumber + "&creditorType=" + creditorType + "&creditorAcctType=" + creditorAcctType + "&creditorMinPayment=" +
        creditorMinPayment + "&creditorMonthsBehind=" + creditorMonthsBehind + "&creditorAcctBalance=" + creditorAcctBalance + "&creditorRepName=" + creditorRepName + "&creditorRepPhoneNo1="
        + creditorRepPhoneNo1 + "&creditorRepPhoneNo2=" + creditorRepPhoneNo2 + "&creditorRepPhoneNo3=" + creditorRepPhoneNo3 + "&creditorRepPhoneExt=" + creditorRepPhoneExt + "&creditorRepFax1=" +
        creditorRepFax1 + "&creditorRepFax2=" + creditorRepFax2 + "&creditorRepFax3=" + creditorRepFax3 + "&creditorRepEmail=" + creditorRepEmail + "&creditorRepNotes=" +
        encodeURIComponent(creditorRepNotes) + "&creditorAgentName=" + creditorAgentName + "&creditorAgentPhoneNo1=" + creditorAgentPhoneNo1 + "&creditorAgentPhoneNo2=" +
        creditorAgentPhoneNo2 + "&creditorAgentPhoneNo3=" + creditorAgentPhoneNo3 + "&creditorAgentPhoneExt=" + creditorAgentPhoneExt + "&creditorAgentFax1=" + creditorAgentFax1 + "&creditorAgentFax2=" +
        creditorAgentFax2 + "&creditorAgentFax3=" + creditorAgentFax3 + "&creditorAgentEmail=" + creditorAgentEmail + "&creditorAgentNotes=" + encodeURIComponent(creditorAgentNotes) + "&creditorRate=" +
        creditorRate + "&accDesc=" + accDesc + "&creditorStatus=" + creditorStatus + "&notificationDate=" + notificationDate + "&creditorAddress=" + creditorAddress + "&creditorCity=" + creditorCity + "&creditorState=" + creditorState + "&creditorZip=" + creditorZip + "&creditorAgentAddress=" + creditorAgentAddress +
        "&creditorAgentCity=" + creditorAgentCity + "&creditorAgentState=" + creditorAgentState + "&creditorAgentZip=" + creditorAgentZip + "&collectionAgencyName=" + collectionAgencyName + "&alternateName=" + alternateName + "&monthsLeftToPay=" + monthsLeftToPay + "&otherLiabilityNotes=" + otherLiabilityNotes + "&unpaidTaxNotes=" + unpaidTaxNotes +
        "&payAtBeforeClosing=" + payAtBeforeClosing + "&creditorAcctStatus=" + creditorAcctStatus + "&creditorPhone=" + creditorPhone + "&creditorMaturityDate=" + creditorMaturityDate + "&creditorIsItSecured=" + creditorIsItSecured;
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }

    try {
        cnt = xmlDoc.getElementsByTagName("updateCnt")[0].firstChild.nodeValue;
    } catch (e) {
    }
    showCreditorsInfo(encryptedLMRId);

}

function showCreditorsInfo(LMRId) {
    var url = "", qstr = "";
    url = "../backoffice/getCreditorsInfo.php";
    qstr = "LMRId=" + LMRId;
    var additionalListingInfoArray = new Array();
    var displayList = "";
    try {
        displayList = getResponse(url, qstr);
    } catch (e) {
    }
    try {
        document.getElementById("showCreditorsInfo").innerHTML = displayList;
    } catch (e) {
    }
    $('#CIID').val('');

    eval("ContactPop.init('" + POPSURL + "addNewCreditors.php', 'addNewCreditors.php', 'Creditors', '" + POPSURL + "','saveCreditors.php' , 850, 500)");
    try {
        ContactPop.hideOverlay(); /** Close- Popup **/
    } catch (e) {
    }
}

function deleteCreditorInfo(CID, LMRId) {
    var url = "", qstr = "", delCnt = 0, msg = '';
    var confirmMsg = confirm("Are you sure to delete this file?");
    if (confirmMsg) {
        url = "../backoffice/deleteCreditorInfo.php";
        qstr = "CID=" + CID + "&LMRId=" + LMRId;
        try {
            xmlDoc = getXMLDoc(url, qstr);
        } catch (e) {
        }
        try {
            delCnt = xmlDoc.getElementsByTagName("delCnt")[0].firstChild.nodeValue;
        } catch (e) {
        }
        try {
            msg = xmlDoc.getElementsByTagName("msg")[0].firstChild.nodeValue;
        } catch (e) {
        }
        if (msg != '') {
            var display = "<div id=\"divMsg\" style=\"width:300px;\">" + msg + "</div>";
            try {
                document.getElementById('CreditorMsgDiv').innerHTML = display;
            } catch (e) {
            }
        }
        showCreditorsInfo(LMRId);
    }
}

/*
 * Calculate Total Assets.
 */
function calculateTotalAssets(currentvalue) {

    var assetCheckingAccounts = "", assetSavingMoneyMarket = "", assetStocks = "", assetCash = "";
    var assetIRAAccounts = "", assetESPOAccounts = "", assetHome = "", assetORE = "";
    var assetCars = "", assetLifeInsurance = "", assetOther = "", totalAssets = 0;
    var totalAssetsNetValue = "", totalAssetsOwed = "", isHMLOOpt = 0, networthOfBusinessOwned = 0;
    var assetTotalCashBankAcc = assetTotalRetirementValue = assetAvailabilityLinesCredit = "";
    var assetSR = vestedInterest = otherAssets = isClient = automobilesOwned3x = "";
    var assetAccount = assetNonMarketableSecurities = '';

    alertToEnterInput(currentvalue);
    isHMLOOpt = getFieldsValue('isHMLOOpt');


    try {
        assetCheckingAccounts = parseFloat(getFieldsValue('assetCheckingAccounts'));
    } catch (e) {
    }
    try {
        assetSavingMoneyMarket = parseFloat(getFieldsValue('assetSavingMoneyMarket'));
    } catch (e) {
    }
    try {
        assetStocks = parseFloat(getFieldsValue('assetStocks'));
    } catch (e) {
    }
    try {
        assetIRAAccounts = parseFloat(getFieldsValue('assetIRAAccounts'));
    } catch (e) {
    }
    try {
        assetESPOAccounts = parseFloat(getFieldsValue('assetESPOAccounts'));
    } catch (e) {
    }
    try {
        assetTotalCashBankAcc = parseFloat(getFieldsValue('assetTotalCashBankAcc'));
    } catch (e) {
    }
    try {
        assetTotalRetirementValue = parseFloat(getFieldsValue('assetTotalRetirementValue'));
    } catch (e) {
    }
    try {
        assetAvailabilityLinesCredit = parseFloat(getFieldsValue('assetAvailabilityLinesCredit'));
    } catch (e) {
    }
    try {
        assetHome = parseFloat(getFieldsValue('assetHome'));
    } catch (e) {
    }
    try {
        assetORE = parseFloat(getFieldsValue('assetORE'));
    } catch (e) {
    }
    try {
        assetSR = parseFloat(getFieldsValue('assetSR'));
    } catch (e) {
    }
    try {
        assetCars = parseFloat(getFieldsValue('assetCars'));
    } catch (e) {
    }
    try {
        assetLifeInsurance = parseFloat(getFieldsValue('assetLifeInsurance'));
    } catch (e) {
    }
    try {
        assetOther = parseFloat(getFieldsValue('assetOther'));
    } catch (e) {
    }
    try {
        assetCash = parseFloat(getFieldsValue('assetCash'));
    } catch (e) {
    }
    try {
        isClient = parseFloat(getFieldsValue('isClient'));
    } catch (e) {
    }
    try {
        automobilesOwned3x = parseFloat(getFieldsValue('automobilesOwned3x'));
    } catch (e) {
    }
    try {
        vestedInterest = parseFloat(getFieldsValue('vestedInterest'));
    } catch (e) {
    }
    try {
        otherAssets = parseFloat(getFieldsValue('otherAssets'));
    } catch (e) {
    }
    //
    try {
        assetAccount = parseFloat(getFieldsValue('assetAccount'));
    } catch (e) {
    }
    try {
        assetNonMarketableSecurities = parseFloat(getFieldsValue('assetNonMarketableSecurities'));
    } catch (e) {
    }

    networthOfBusinessOwned = parseFloat(getFieldsValue('networthOfBusinessOwned'));

    totalAssets = assetCheckingAccounts + assetSavingMoneyMarket
        + assetStocks + assetIRAAccounts
        + assetESPOAccounts + assetHome
        + assetTotalCashBankAcc + assetTotalRetirementValue + assetAvailabilityLinesCredit
        + assetORE + assetSR + assetCars
        + assetLifeInsurance + assetOther
        + assetCash + networthOfBusinessOwned
        + otherAssets + vestedInterest + automobilesOwned3x
        + assetAccount + assetNonMarketableSecurities;

    totalAssets = parseFloat(totalAssets);
    totalAssets = totalAssets.toFixed(2);

    try {
        document.getElementById("totalAssets").innerHTML = convertInputToAbsoluteValue(totalAssets);
    } catch (e) {
    }

    try {
        document.getElementById("totalAssetsDisp").innerHTML = convertInputToAbsoluteValue(totalAssets);
    } catch (e) {
    }

    try {
        totalAssetsOwed = document.getElementById("totalAssetsOwed").innerHTML;
    } catch (e) {
    }
    //totalAssets
    if (totalAssets == '') { //required for accurate calculation
        totalAssets = 0;
    } else {
        totalAssets = replaceCommaValues(totalAssets);
    }
    //totalAssetsOwed
    if (totalAssetsOwed == '') { //required for accurate calculation
        totalAssetsOwed = 0;
    } else {
        totalAssetsOwed = replaceCommaValues(totalAssetsOwed);
    }

    totalAssetsNetValue = parseFloat(totalAssets) - parseFloat(totalAssetsOwed);
    totalAssetsNetValue = totalAssetsNetValue.toFixed(2);
    try {
        document.getElementById("totalAssetNetValue").innerHTML = convertInputToAbsoluteValue(totalAssetsNetValue);
    } catch (e) {
    }
}

/*
 * Calculate Total Assets Owed.
 */

function calculateTotalAssetsOwed(currentvalue, formName) {


    var assetHomeOwed = 0, assetOREOwed = 0;
    var assetCarsOwed = 0;
    assetSROwed = 0;
    var totalAssetsNetValue = 0, totalAssets = 0, totalAssetsOwed = 0;
    var otherAmtOwed = automobilesOwned3x1 = 0;
    var assetStocksOwed = assetIRAAccountsOwed = assetESPOAccountsOwed = assetLifeInsuranceOwed = 0;
    var assetAvailabilityLinesCreditOwed = 0;
    var assetAccountOwd = assetNonMarketableSecuritiesOwd = notesPayableToBanksOthersOwed = installmentAccountOwed = 0;
    var revolvingDebtOwed = unpaidPayableTaxesOwed = otherLiabilitiesOwed = 0;

    alertToEnterInput(currentvalue);

    try {
        assetHomeOwed = parseFloat(getFieldsValue('assetHomeOwed'));
    } catch (e) {
    }
    try {
        assetOREOwed = parseFloat(getFieldsValue('assetOREOwed'));
    } catch (e) {
    }
    try {
        assetSROwed = parseFloat(getFieldsValue('assetSROwed'));
    } catch (e) {
    }
    try {
        assetCarsOwed = parseFloat(getFieldsValue('assetCarsOwed'));
    } catch (e) {
    }
    try {
        otherAmtOwed = parseFloat(getFieldsValue('otherAmtOwed'));
    } catch (e) {
    }
    try {
        automobilesOwned3x1 = parseFloat(getFieldsValue('automobilesOwned3x1'));
    } catch (e) {
    }
    //
    try {
        assetAccountOwd = parseFloat(getFieldsValue('assetAccountOwd'));
    } catch (e) {
    }
    try {
        assetNonMarketableSecuritiesOwd = parseFloat(getFieldsValue('assetNonMarketableSecuritiesOwd'));
    } catch (e) {
    }
    try {
        notesPayableToBanksOthersOwed = parseFloat(getFieldsValue('notesPayableToBanksOthersOwed'));
    } catch (e) {
    }
    try {
        installmentAccountOwed = parseFloat(getFieldsValue('installmentAccountOwed'));
    } catch (e) {
    }
    try {
        revolvingDebtOwed = parseFloat(getFieldsValue('revolvingDebtOwed'));
    } catch (e) {
    }
    try {
        unpaidPayableTaxesOwed = parseFloat(getFieldsValue('unpaidPayableTaxesOwed'));
    } catch (e) {
    }
    try {
        otherLiabilitiesOwed = parseFloat(getFieldsValue('otherLiabilitiesOwed'));
    } catch (e) {
    }
    try {
        assetStocksOwed = parseFloat(getFieldsValue('assetStocksOwed'));
    } catch (e) {
    }
    try {
        assetIRAAccountsOwed = parseFloat(getFieldsValue('assetIRAAccountsOwed'));
    } catch (e) {
    }
    try {
        assetESPOAccountsOwed = parseFloat(getFieldsValue('assetESPOAccountsOwed'));
    } catch (e) {
    }
    try {
        assetLifeInsuranceOwed = parseFloat(getFieldsValue('assetLifeInsuranceOwed'));
    } catch (e) {
    }
    try {
        assetAvailabilityLinesCreditOwed = parseFloat(getFieldsValue('assetAvailabilityLinesCreditOwed'));
    } catch (e) {
    }
    //

    totalAssetsOwed += assetHomeOwed
        + assetOREOwed
        + assetSROwed
        + assetCarsOwed
        + otherAmtOwed
        + automobilesOwned3x1
        + assetAccountOwd
        + assetNonMarketableSecuritiesOwd
        + notesPayableToBanksOthersOwed
        + installmentAccountOwed
        + revolvingDebtOwed
        + unpaidPayableTaxesOwed
        + otherLiabilitiesOwed
        + assetStocksOwed
        + assetIRAAccountsOwed
        + assetESPOAccountsOwed
        + assetLifeInsuranceOwed
        + assetAvailabilityLinesCreditOwed;

    totalAssetsOwed = parseFloat(totalAssetsOwed);
    totalAssetsOwed = totalAssetsOwed.toFixed(2);

    try {
        document.getElementById("totalAssetsOwed").innerHTML = convertInputToAbsoluteValue(totalAssetsOwed);
    } catch (e) {
    }
    try {
        document.getElementById("totalAssetsOwedDisp").innerHTML = convertInputToAbsoluteValue(totalAssetsOwed);
    } catch (e) {
    }

    try {
        totalAssets = document.getElementById("totalAssets").innerHTML;
    } catch (e) {
    }
    totalAssetsNetValue = parseFloat(replaceCommaValues(totalAssets)) - parseFloat(replaceCommaValues(totalAssetsOwed));
    totalAssetsNetValue = parseFloat(totalAssetsNetValue);
    totalAssetsNetValue = totalAssetsNetValue.toFixed(2);
    try {
        document.getElementById("totalAssetNetValue").innerHTML = convertInputToAbsoluteValue(totalAssetsNetValue);
    } catch (e) {
    }
}

function updateGrossSocialSecurityIncome(val2, opt) {
    var socialSecurity = 0, addGrossedUp = false;
    val2 = replaceCommaValues(val2);
    if (val2 == '') {
        val2 = 0;
    }
    val2 = parseFloat(val2);
    if (opt == 'bor') {
        try {
            eval("addGrossedUp = document.getElementById('addGrossedUp1').checked");
        } catch (e) {
        }
    } else if (opt == 'coBor') {
        try {
            eval("addGrossedUp = document.getElementById('addGrossedUp2').checked");
        } catch (e) {
        }
    }
    if (addGrossedUp) {
        socialSecurity = val2 * 1.25;
    } else {
        socialSecurity = val2;
    }
    socialSecurity = parseFloat(socialSecurity);
    socialSecurity = socialSecurity.toFixed(2)

    if (opt == 'bor') {
        try {
            eval("document.getElementById('grossedUp').innerHTML = socialSecurity");
        } catch (e) {
        }
    } else if (opt == 'coBor') {
        try {
            eval("document.getElementById('grossedUp2').innerHTML = socialSecurity");
        } catch (e) {
        }
    }
}

function editCreditorsInfo(LMRId, CIID) {
    try {
        document.loanModForm.creditorAcctType[0].checked = false;
    } catch (e) {
    }
    try {
        document.loanModForm.creditorAcctType[1].checked = false;
    } catch (e) {
    }

    $('#creditorStatus option').each(function () {
        $(this).attr('selected', '');
    });
    $('.chzn-select').trigger("chosen:updated"); //update the select option values

    var url = "", qstr = "";
    var creditorAcctNumber = '';
    var creditorName = '';
    var acctType = '';
    var creditorType = '';
    var creditorMinPayment = '';
    var creditorAcctBalance = '';
    var creditorMonthsBehind = '';
    var creditorRate = '';
    var creditorRepName = '';
    var creditorRepEmail = '';
    var creditorAgentNotes = '';
    var creditorRepNotes = '';
    var creditorAgentName = '';
    var creditorAgentEmail = '';
    var accDesc = '';
    var notificationDate = '';
    var creditorInfoStatus = '';
    var creditorRepPhoneNo1 = '';
    var creditorRepPhoneNo2 = '';
    var creditorRepPhoneNo3 = '';
    var creditorRepPhoneExt = '';
    var creditorAgentPhoneNo1 = '';
    var creditorAgentPhoneNo2 = '';
    var creditorAgentPhoneNo3 = '';
    var creditorAgentPhoneExt = '';
    var creditorAgentFax3 = '';
    var creditorRepFax1 = '';
    var creditorRepFax2 = '';
    var creditorRepFax3 = '';
    var creditorAgentFax1 = '';
    var creditorAgentFax2 = '';

    var creditorAgentAddress = '';
    var creditorAgentCity = '';
    var creditorAgentState = '';
    var collectionAgencyName = '';
    var creditorZip = '';
    var creditorState = '';
    var creditorCity = '';
    var creditorAddress = '';
    var notificationDate = '';
    var creditorAgentZip = '';
    var alternateName = '';

    var otherLiabilityNotes = '';
    var unpaidTaxNotes = '';
    var payAtBeforeClosing = '';
    var creditorAcctStatus = '';
    var creditorPhone = '';
    var creditorMaturityDate = '';
    var creditorIsItSecured = '';
    var creditorStatusInfoArray = new Array();

    url = "../backoffice/getCreditorsInfo.php";
    qstr = "LMRId=" + LMRId + "&CIID=" + CIID + "&opt=Edit";
    try {
        xmlDoc = getXMLDoc(url, qstr);
    } catch (e) {
    }
    try {
        editCreditor = xmlDoc.getElementsByTagName("editCreditor");
    } catch (e) {
    }

    for (var ee = 0; ee < editCreditor.length; ee++) {

        var creditorName = "", empId = 0;

        try {
            CIID = editCreditor[ee].getElementsByTagName("CIID")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorName = editCreditor[ee].getElementsByTagName("creditorName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorAcctNumber = editCreditor[ee].getElementsByTagName("creditorAcctNumber")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            acctType = editCreditor[ee].getElementsByTagName("creditorAcctType")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorType = editCreditor[ee].getElementsByTagName("creditorType")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorMinPayment = editCreditor[ee].getElementsByTagName("creditorMinPayment")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorAcctBalance = editCreditor[ee].getElementsByTagName("creditorAcctBalance")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorMonthsBehind = editCreditor[ee].getElementsByTagName("creditorMonthsBehind")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorRate = editCreditor[ee].getElementsByTagName("creditorRate")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorRepName = editCreditor[ee].getElementsByTagName("creditorRepName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorRepEmail = editCreditor[ee].getElementsByTagName("creditorRepEmail")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorRepNotes = editCreditor[ee].getElementsByTagName("creditorRepNotes")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorAgentName = editCreditor[ee].getElementsByTagName("creditorAgentName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorAgentEmail = editCreditor[ee].getElementsByTagName("creditorAgentEmail")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorAgentNotes = editCreditor[ee].getElementsByTagName("creditorAgentNotes")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            accDesc = editCreditor[ee].getElementsByTagName("accDesc")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorInfoStatus = editCreditor[ee].getElementsByTagName("creditorStatus")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        /*try {
            creditorStatusInfoArray = creditorInfoStatus.split(", ");
        } catch(e) {}*/

        try {
            creditorRepPhoneNo1 = editCreditor[ee].getElementsByTagName("creditorRepPhoneNo1")[0].childNodes[0].nodeValue;
            creditorRepPhoneNo2 = editCreditor[ee].getElementsByTagName("creditorRepPhoneNo2")[0].childNodes[0].nodeValue;
            creditorRepPhoneNo3 = editCreditor[ee].getElementsByTagName("creditorRepPhoneNo3")[0].childNodes[0].nodeValue;
            creditorRepPhoneExt = editCreditor[ee].getElementsByTagName("creditorRepPhoneExt")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            creditorAgentPhoneNo1 = editCreditor[ee].getElementsByTagName("creditorAgentPhoneNo1")[0].childNodes[0].nodeValue;
            creditorAgentPhoneNo2 = editCreditor[ee].getElementsByTagName("creditorAgentPhoneNo2")[0].childNodes[0].nodeValue;
            creditorAgentPhoneNo3 = editCreditor[ee].getElementsByTagName("creditorAgentPhoneNo3")[0].childNodes[0].nodeValue;
            creditorAgentPhoneExt = editCreditor[ee].getElementsByTagName("creditorAgentPhoneExt")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            creditorRepFax1 = editCreditor[ee].getElementsByTagName("creditorRepFax1")[0].childNodes[0].nodeValue;
            creditorRepFax2 = editCreditor[ee].getElementsByTagName("creditorRepFax2")[0].childNodes[0].nodeValue;
            creditorRepFax3 = editCreditor[ee].getElementsByTagName("creditorRepFax3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            creditorAgentFax1 = editCreditor[ee].getElementsByTagName("creditorAgentFax1")[0].childNodes[0].nodeValue;
            creditorAgentFax2 = editCreditor[ee].getElementsByTagName("creditorAgentFax2")[0].childNodes[0].nodeValue;
            creditorAgentFax3 = editCreditor[ee].getElementsByTagName("creditorAgentFax3")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            notificationDate = editCreditor[ee].getElementsByTagName("notificationDate")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorAddress = editCreditor[ee].getElementsByTagName("creditorAddress")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorCity = editCreditor[ee].getElementsByTagName("creditorCity")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorState = editCreditor[ee].getElementsByTagName("creditorState")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorZip = editCreditor[ee].getElementsByTagName("creditorZip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            creditorAgentAddress = editCreditor[ee].getElementsByTagName("creditorAgentAddress")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorAgentCity = editCreditor[ee].getElementsByTagName("creditorAgentCity")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorAgentState = editCreditor[ee].getElementsByTagName("creditorAgentState")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorAgentZip = editCreditor[ee].getElementsByTagName("creditorAgentZip")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            collectionAgencyName = editCreditor[ee].getElementsByTagName("collectionAgencyName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            alternateName = editCreditor[ee].getElementsByTagName("alternateName")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            monthsLeftToPay = editCreditor[ee].getElementsByTagName("monthsLeftToPay")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

        try {
            otherLiabilityNotes = editCreditor[ee].getElementsByTagName("otherLiabilityNotes")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            unpaidTaxNotes = editCreditor[ee].getElementsByTagName("unpaidTaxNotes")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorAcctStatus = editCreditor[ee].getElementsByTagName("creditorAcctStatus")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorPhone = editCreditor[ee].getElementsByTagName("creditorPhone")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            payAtBeforeClosing = editCreditor[ee].getElementsByTagName("payAtBeforeClosing")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorMaturityDate = editCreditor[ee].getElementsByTagName("creditorMaturityDate")[0].childNodes[0].nodeValue;
        } catch (e) {
        }
        try {
            creditorIsItSecured = editCreditor[ee].getElementsByTagName("creditorIsItSecured")[0].childNodes[0].nodeValue;
        } catch (e) {
        }

    }
    $('#ccreditorName').val(creditorName);
    $('#alternateName').val(alternateName);

    $('#otherLiabilityNotes').val(otherLiabilityNotes);
    $('#unpaidTaxNotes').val(unpaidTaxNotes);

    try {
        var len = document.loanModForm.creditorAcctType.length;
    } catch (e) {
    }
    try {
        document.loanModForm.creditorAcctType.checked = true;
    } catch (e) {
    }
    for (var k = 0; k < len; k++) {
        if (acctType.search(document.loanModForm.creditorAcctType[k].value) > -1) {
            document.loanModForm.creditorAcctType[k].checked = true;
        }
    }
    $('#creditorAcctNumber').val(creditorAcctNumber);
    $('#creditorMinPayment').val(creditorMinPayment);
    $('#creditorAcctBalance').val(creditorAcctBalance);
    $('#creditorMonthsBehind').val(creditorMonthsBehind);
    $('#creditorRate').val(creditorRate);
    $('#creditorRepName').val(creditorRepName);
    $('#creditorRepEmail').val(creditorRepEmail);
    $('#creditorRepNotes').val(creditorRepNotes);
    $('#creditorAgentName').val(creditorAgentName);
    $('#creditorAgentEmail').val(creditorAgentEmail);
    $('#creditorAgentNotes').val(creditorAgentNotes);
    $("#accDesc").val(accDesc);
    $('#creditorRepPhoneNo1').val(creditorRepPhoneNo1);
    $('#creditorRepPhoneNo2').val(creditorRepPhoneNo2);
    $('#creditorRepPhoneNo3').val(creditorRepPhoneNo3);
    $('#creditorRepPhoneExt').val(creditorRepPhoneExt);
    $('#creditorType').val(creditorType);
    $('#creditorRepFax1').val(creditorRepFax1);
    $('#creditorRepFax2').val(creditorRepFax2);
    $('#creditorRepFax3').val(creditorRepFax3);

    $('#creditorAgentPhoneNo1').val(creditorAgentPhoneNo1);
    $('#creditorAgentPhoneNo2').val(creditorAgentPhoneNo2);
    $('#creditorAgentPhoneNo3').val(creditorAgentPhoneNo3);
    $('#creditorAgentPhoneExt').val(creditorAgentPhoneExt);
    $('#creditorAgentFax1').val(creditorAgentFax1);
    $('#creditorAgentFax2').val(creditorAgentFax2);
    $('#creditorAgentFax3').val(creditorAgentFax3);
    $('#notificationDate').val(notificationDate);

    $('#creditorAddress').val(creditorAddress);
    $('#creditorCity').val(creditorCity);
    $('#creditorState').val(creditorState);
    $('#creditorZip').val(creditorZip);

    $('#creditorAgentAddress').val(creditorAgentAddress);
    $('#creditorAgentCity').val(creditorAgentCity);
    $('#creditorAgentState').val(creditorAgentState);
    $('#creditorAgentZip').val(creditorAgentZip);

    $('#collectionAgencyName').val(collectionAgencyName);
    try {
        $('#monthsLeftToPay').val(monthsLeftToPay);
    } catch (e) {
    }
    $('#CIID').val(CIID);
    /*$('#creditorStatus option').each(function() {
          for (k=0; k<creditorStatusInfoArray.length; k++) {
              if ($(this).attr("value") == trim(creditorStatusInfoArray[k])) {
                  $(this).attr('selected','selected');
              }
          }
      });*/
    $('#creditorStatus').val(creditorInfoStatus.split(", "));

    $('.chzn-select').trigger("chosen:updated"); //update the select option values

    $("#creditorAcctStatus" + creditorAcctStatus).attr('checked', true);
    $('#creditorPhone').val(creditorPhone);
    $("#payAtBeforeClosing" + payAtBeforeClosing).attr('checked', true);
    $("#creditorMaturityDate").val(creditorMaturityDate);
    $("#creditorIsItSecured").val(creditorIsItSecured);
    $("#save_saveCreditorsForm").val('Update');
}

/* Income and Expense Tab Validation */

function validateIncomeExpForm() {
    if (isDateOKForMMDDYY('loanModForm', 'borrowerHireDate', 'Borrower Hire Date.') &&
        checkValidNumber('loanModForm', 'employer1Phone1', 'Borrower Employer phone number') &&
        checkValidNumber('loanModForm', 'employer1Phone2', 'Borrower Employer phone number') &&
        checkValidNumber('loanModForm', 'employer1Phone3', 'Borrower Employer phone number') &&
        checkValidNumber('loanModForm', 'employer1PhoneExt', 'Borrower Employer phone number') &&

        validateAmountAllowBlank('loanModForm', 'grossIncome1', 'Please Enter Correct Gross Monthly Income Amount.') &&
        validateAmountAllowBlank('loanModForm', 'commissionOrBonus1', 'Please Enter Correct Commission / Bonus Amount.') &&
        validateAmountAllowBlank('loanModForm', 'overtime1', 'Please Enter Correct Overtime Amount.') &&
        validateAmountAllowBlank('loanModForm', 'federalTaxFICA1', 'Please Enter Correct Less: Federal and State Tax, FICA Amount.') &&
        validateAmountAllowBlank('loanModForm', 'tipsMiscIncome1', 'Please Enter Correct Tips Amount.') &&
        validateAmountAllowBlank('loanModForm', 'otherDeductions1', 'Please Enter Correct Less: Other Deductions (401K, etc.) Amount.') &&
        validateAmountAllowBlank('loanModForm', 'netMonthlyIncome1', 'Please Enter Correct Total Net Monthly Income Amount.') &&
        validateAmountAllowBlank('loanModForm', 'socialSecurity1', 'Please Enter Correct Social Security Income Amount.') &&
        validateAmountAllowBlank('loanModForm', 'netSocialSecurity1', 'Please Enter Correct Social Security Income Amount.') &&
        validateAmountAllowBlank('loanModForm', 'pensionOrRetirement1', 'Please Enter Correct Pension / Retirement Income Amount.') &&
        validateAmountAllowBlank('loanModForm', 'netPensionOrRetirement1', 'Please Enter Correct Pension / Retirement Income Amount.') &&
        validateAmountAllowBlank('loanModForm', 'disability1', 'Please Enter Correct Disability Income Amount.') &&
        validateAmountAllowBlank('loanModForm', 'netDisability1', 'Please Enter Correct Disability Income Amount.') &&
        validateAmountAllowBlank('loanModForm', 'unemployment1', 'Please Enter Correct Unemployment Amount.') &&
        validateAmountAllowBlank('loanModForm', 'netUnemployment1', 'Please Enter Correct Unemployment Amount.') &&
        isDateOKForMMDDYY('loanModForm', 'unemploymentStDate1', 'Unemployment Date.') &&
        validateAmountAllowBlank('loanModForm', 'rental1', 'Please Enter Correct Rental Amount.') &&
        validateAmountAllowBlank('loanModForm', 'netRental1', 'Please Enter Correct Rental Amount.') &&
        validateAmountAllowBlank('loanModForm', 'earnedInterest1', 'Please Enter Correct Earned Interest Amount.') &&
        validateAmountAllowBlank('loanModForm', 'netEarnedInterest1', 'Please Enter Correct  Earned Interest Amount.') &&
        validateAmountAllowBlank('loanModForm', 'roomRental1', 'Please Enter Correct Room Rental Amount.') &&
        validateAmountAllowBlank('loanModForm', 'netRoomRental1', 'Please Enter Correct Room Rental Amount.') &&

        validateAmountAllowBlank('loanModForm', 'secondJobIncome1', 'Please Enter Correct Monthly Income (2nd Job) Amount.') &&
        validateAmountAllowBlank('loanModForm', 'netSecondJobIncome1', 'Please Enter Correct Monthly Income (2nd Job) Amount.') &&
        isDateOKForMMDDYY('loanModForm', 'secondJobStDate1', 'Second Job Date.') &&

        validateAmountAllowBlank('loanModForm', 'sonOrDaughter1', 'Please Enter Correct Spouse/Son/ Daughter Amount.') &&
        validateAmountAllowBlank('loanModForm', 'parents1', 'Please Enter Correct Parents Amount.') &&
        validateAmountAllowBlank('loanModForm', 'childSupportOrAlimony1', 'Please Enter Correct Child Support/Alimony Amount.') &&
        validateAmountAllowBlank('loanModForm', 'otherHouseHold1', 'Please Enter Correct Other Amount.') &&
        validateAmountAllowBlank('loanModForm', 'foodStampWelfare1', 'Please Enter Correct Food Stamps/Welfare Amount.') &&

        validateAmountAllowBlank('loanModForm', 'creditCards1', 'Please Enter Correct Credit Cards Amount.') &&
        validateAmountAllowBlank('loanModForm', 'creditCardsBalance1', 'Please Enter Correct Total Credit Card Balance(s)  Amount.') &&
        validateAmountAllowBlank('loanModForm', 'autoLoan1', 'Please Enter Correct Auto/Car Loan(s) Amount.') &&
        validateAmountAllowBlank('loanModForm', 'autoLoanBalance1', 'Please Enter Correct Total Auto Loan Balance(s) Amount.') &&
        validateAmountAllowBlank('loanModForm', 'unsecuredLoans1', 'Please Enter Correct Unsecured Loan(s) Amount.') &&
        validateAmountAllowBlank('loanModForm', 'unsecuredLoanBalance1', 'Please Enter Correct Total Unsecured Loan Balance(s) Amount.') &&
        validateAmountAllowBlank('loanModForm', 'otherMortgage1', 'Please Enter Correct Other Mortgages Amount.') &&
        validateAmountAllowBlank('loanModForm', 'otherMortgageBalance1', 'Please Enter Correct Mortgage Balance(s) Amount.') &&
        validateAmountAllowBlank('loanModForm', 'studentLoans1', 'Please Enter Correct Student Loans/Tuition Amount.') &&
        validateAmountAllowBlank('loanModForm', 'studentLoansBalance1', 'Please Enter Correct Total Student Loan Balance(s) Amount.') &&
        validateAmountAllowBlank('loanModForm', 'childSupportOrAlimonyMonthly1', 'Please Enter Correct Alimony/Child Support Amount.') &&
        validateAmountAllowBlank('loanModForm', 'careAmt1', 'Please Enter Correct Child/Dependent/Elderly Care Amount.') &&
        validateAmountAllowBlank('loanModForm', 'allInsurance1', 'Please Enter Correct Insurance (Health, life) Amount.') &&
        validateAmountAllowBlank('loanModForm', 'groceries1', 'Please Enter Correct Groceries Amount.') &&
        validateAmountAllowBlank('loanModForm', 'carExpenses1', 'Please Enter Correct Car Expenses (Ins., gas, maint.) Amount.') &&
        validateAmountAllowBlank('loanModForm', 'medicalBill1', 'Please Enter Correct Doctor/Medical Bills Amount.') &&
        validateAmountAllowBlank('loanModForm', 'entertainment1', 'Please Enter Correct Entertainment Amount.') &&
        validateAmountAllowBlank('loanModForm', 'other1', 'Please Enter Correct Other Amount.') &&
        validateAmountAllowBlank('loanModForm', 'donation1', 'Please Enter Correct Church/Club Donations Amount.') &&
        validateAmountAllowBlank('loanModForm', 'pets1', 'Please Enter Correct Pets  Amount.') &&
        validateAmountAllowBlank('loanModForm', 'monthlyParking1', 'Please Enter Correct Monthly Parking.') &&
        validateAmountAllowBlank('loanModForm', 'unionDues1', 'Please Enter Correct Union Dues Amount.') &&
        validateAmountAllowBlank('loanModForm', 'personalLoan1', 'Please Enter Correct Personal Loan Amount.') &&
        validateAmountAllowBlank('loanModForm', 'lunchPurchased1', 'Please Enter Correct School / Work Lunches Purchased Amount.') &&
        validateAmountAllowBlank('loanModForm', 'rentalExp1', 'Please Enter Correct Rental Amount.') &&

        validateAmountAllowBlank('loanModForm', 'cable1', 'Please Enter Correct Cable TV/Satellite Amount.') &&
        validateAmountAllowBlank('loanModForm', 'electricity1', 'Please Enter Correct Electricity Amount.') &&
        validateAmountAllowBlank('loanModForm', 'natural1', 'Please Enter Correct Natural Gas/Oil Amount.') &&
        validateAmountAllowBlank('loanModForm', 'primaryBorrowerPhone', 'Please Enter Correct Telephone/Cell Amount.') &&
        validateAmountAllowBlank('loanModForm', 'water1', 'Please Enter Correct Water/Sewer Amount.') &&
        validateAmountAllowBlank('loanModForm', 'internet1', 'Please Enter Correct Internet Amount.') &&
        validateAmountAllowBlank('loanModForm', 'dryCleaning1', 'Please Enter Correct Dry Cleaning/Clothing Amount.') &&
        validateAmountAllowBlank('loanModForm', 'utilityOther1', 'Please Enter Correct Other Amount.')

        /*
               isDateOKForMMDDYY('loanModForm', 'coBorrowerHireDate', 'Co-borrower Hire Date.') &&
               checkValidNumber('loanModForm','employer2Phone1','Co-borrower Employer phone number') &&
               checkValidNumber('loanModForm','employer2Phone2','Co-borrower Employer phone number') &&
               checkValidNumber('loanModForm','employer2Phone3','Co-borrower Employer phone number') &&
               checkValidNumber('loanModForm','employer2PhoneExt','Co-borrower Employer phone number') &&
               validateAmountAllowBlank('loanModForm','grossIncome2','Please Enter Correct Gross Monthly Income Amount.') &&
               validateAmountAllowBlank('loanModForm','commissionOrBonus2','Please Enter Correct Commission/Bonus Amount.') &&
               validateAmountAllowBlank('loanModForm','overtime2','Please Enter Correct Overtime Amount.') &&
               validateAmountAllowBlank('loanModForm','federalTaxFICA2','Please Enter Correct Less: Federal and State Tax, FICA Amount.') &&
               validateAmountAllowBlank('loanModForm','tipsMiscIncome2','Please Enter Correct Tips Amount.') &&
               validateAmountAllowBlank('loanModForm','otherDeductions2','Please Enter Correct Less: Other Deductions (401K, etc.) Amount.') &&
               validateAmountAllowBlank('loanModForm','netMonthlyIncome2','Please Enter Correct Total Net Monthly Income Amount.') &&
               validateAmountAllowBlank('loanModForm','socialSecurity2','Please Enter Correct Social Security Income Amount.') &&
               validateAmountAllowBlank('loanModForm','netSocialSecurity2','Please Enter Correct Social Security Income Amount.') &&
               validateAmountAllowBlank('loanModForm','pensionOrRetirement2','Please Enter Correct Pension/Retirement Income Amount.') &&
               validateAmountAllowBlank('loanModForm','netPensionOrRetirement2','Please Enter Correct Pension/Retirement Income Amount.') &&
               validateAmountAllowBlank('loanModForm','disability2','Please Enter Correct Disability Income Amount.') &&
               validateAmountAllowBlank('loanModForm','netDisability2','Please Enter Correct Disability Income Amount.') &&
               validateAmountAllowBlank('loanModForm','unemployment2','Please Enter Correct Unemployment Amount.') &&
               validateAmountAllowBlank('loanModForm','netUnemployment2','Please Enter Correct Unemployment Amount.') &&
               isDateOKForMMDDYY('loanModForm', 'unemploymentStDate2', 'Unemployment Date.') &&
               validateAmountAllowBlank('loanModForm','rental2','Please Enter Correct Rental Amount.') &&
               validateAmountAllowBlank('loanModForm','netRental2','Please Enter Correct Rental Amount.') &&
               validateAmountAllowBlank('loanModForm','earnedInterest2','Please Enter Correct Earned Interest Amount.') &&
               validateAmountAllowBlank('loanModForm','netEarnedInterest2','Please Enter Correct Earned Interest Amount.') &&
               validateAmountAllowBlank('loanModForm','roomRental2','Please Enter Correct Room Rental Amount.') &&
               validateAmountAllowBlank('loanModForm','netRoomRental2','Please Enter Correct Room Rental Amount.') &&
               validateAmountAllowBlank('loanModForm','secondJobIncome2','Please Enter Correct Monthly Income (2nd Job) Amount.') &&
               validateAmountAllowBlank('loanModForm','netSecondJobIncome2','Please Enter Correct Monthly Income (2nd Job) Amount.') &&
               isDateOKForMMDDYY('loanModForm', 'secondJobStDate2', 'Second Job Date.') &&
               validateAmountAllowBlank('loanModForm','sonOrDaughter2','Please Enter Correct Spouse/Son/Daughter Amount.') &&
               validateAmountAllowBlank('loanModForm','parents2','Please Enter Correct Parents  Amount.') &&
               validateAmountAllowBlank('loanModForm','childSupportOrAlimony2','Please Enter Correct Monthly Income (2nd Job) Amount.') &&
               validateAmountAllowBlank('loanModForm','otherHouseHold2','Please Enter Correct Monthly Income (2nd Job) Amount.') &&
               validateAmountAllowBlank('loanModForm','foodStampWelfare2','Please Enter Correct Monthly Income (2nd Job) Amount.') &&
               validateAmountAllowBlank('loanModForm','creditCards2','Please Enter Correct Credit Cards Amount.') &&
               validateAmountAllowBlank('loanModForm','creditCardsBalance2','Please Enter Correct Total Credit Card Balance(s) Amount.') &&
               validateAmountAllowBlank('loanModForm','autoLoan2','Please Enter Correct Auto/Car Loan(s) Amount.') &&
               validateAmountAllowBlank('loanModForm','autoLoanBalance2','Please Enter Correct Total Auto Loan Balance(s) Amount.') &&
               validateAmountAllowBlank('loanModForm','unsecuredLoans2','Please Enter Correct Unsecured Loan(s) Amount.') &&
               validateAmountAllowBlank('loanModForm','unsecuredLoanBalance2','Please Enter Correct Total Unsecured Loan Balance(s) Amount.') &&
               validateAmountAllowBlank('loanModForm','otherMortgage2','Please Enter Correct Other Mortgages Amount.') &&
               validateAmountAllowBlank('loanModForm','otherMortgageBalance2','Please Enter Correct Mortgage Balance(s) Amount.') &&
               validateAmountAllowBlank('loanModForm','studentLoans2','Please Enter Correct Student Loans/Tuition Amount.') &&
               validateAmountAllowBlank('loanModForm','studentLoansBalance2','Please Enter Correct Total Student Loan Balance(s)  Amount.') &&
               validateAmountAllowBlank('loanModForm','childSupportOrAlimonyMonthly2','Please Enter Correct Alimony/Child Support Amount.') &&
               validateAmountAllowBlank('loanModForm','careAmt2','Please Enter Correct Child/Dependent/Elderly Care Amount.') &&
               validateAmountAllowBlank('loanModForm','allInsurance2','Please Enter Correct Insurance (Health, life) Amount.') &&
               validateAmountAllowBlank('loanModForm','groceries2','Please Enter Correct Groceries Amount.') &&
               validateAmountAllowBlank('loanModForm','carExpenses2','Please Enter Correct Car Expenses (Ins., gas, maint.) Amount.') &&
               validateAmountAllowBlank('loanModForm','medicalBill2','Please Enter Correct Doctor/Medical Bills Amount.') &&
               validateAmountAllowBlank('loanModForm','entertainment2','Please Enter Correct Entertainment Amount.') &&
               validateAmountAllowBlank('loanModForm','other2','Please Enter Correct Other Amount.') &&
               validateAmountAllowBlank('loanModForm','donation2','Please Enter Correct Church/Club Donations Amount.') &&
               validateAmountAllowBlank('loanModForm','pets2','Please Enter Correct Pets Amount.') &&
               validateAmountAllowBlank('loanModForm','monthlyParking2','Please Enter Correct Monthly Parking Amount.') &&
               validateAmountAllowBlank('loanModForm','unionDues2','Please Enter Correct Union Dues Amount.') &&
               validateAmountAllowBlank('loanModForm','personalLoan2','Please Enter Correct Personal Loan Amount.') &&
               validateAmountAllowBlank('loanModForm','lunchPurchased2','Please Enter Correct School / Work Lunches Purchased Amount.') &&
               validateAmountAllowBlank('loanModForm','rentalExp2','Please Enter Correct Rental Amount.') &&
               validateAmountAllowBlank('loanModForm','cable2','Please Enter Correct Cable TV/Satellite Amount.') &&
               validateAmountAllowBlank('loanModForm','electricity2','Please Enter Correct Electricity Amount.') &&
               validateAmountAllowBlank('loanModForm','natural2','Please Enter Correct Natural Gas/Oil Amount.') &&
               validateAmountAllowBlank('loanModForm','coBorrowerPhone','Please Enter Correct Telephone/Cell Amount.') &&
               validateAmountAllowBlank('loanModForm','water2','Please Enter Correct Water/Sewer Amount.') &&
               validateAmountAllowBlank('loanModForm','internet2','Please Enter Correct Internet Amount.') &&
               validateAmountAllowBlank('loanModForm','dryCleaning2','Please Enter Correct Dry Cleaning/Clothing Amount.') &&
               validateAmountAllowBlank('loanModForm','utilityOther2','Please Enter Correct Other Amount.') &&

               validateAmountAllowBlank('loanModForm','mortgageDelinquencyAmount','Please Enter Correct past due Amount.') &&
               validateAmountAllowBlank('loanModForm','assetCash','Please Enter Correct Cash Amount.') &&
               validateAmountAllowBlank('loanModForm','assetCheckingAccounts','Please Enter Correct Checking Account(s) Amount.') &&
               validateAmountAllowBlank('loanModForm','assetSavingMoneyMarket','Please Enter Correct Saving / Money Market.') &&
               validateAmountAllowBlank('loanModForm','assetStocks','Please Enter Correct Stocks / Bonds / CDs Amount.') &&
               validateAmountAllowBlank('loanModForm','assetIRAAccounts','Please Enter Correct IRA / Keogh Accounts Amount.') &&
               validateAmountAllowBlank('loanModForm','assetESPOAccounts','Please Enter Correct 401k / ESPO Accounts Amount.') &&
               validateAmountAllowBlank('loanModForm','assetHome','Please Enter Correct Home Amount.') &&
               validateAmountAllowBlank('loanModForm','assetHomeOwed','Please Enter Correct Home Owed Amount.') &&
               validateAmountAllowBlank('loanModForm','assetORE','Please Enter Correct Other Real Estate Amount.') &&
               validateAmountAllowBlank('loanModForm','assetOREOwed','Please Enter Correct Other Real Estate Owed Amount.') &&
               validateAmountAllowBlank('loanModForm','assetCars','Please Enter Correct Cars Amount.') &&
               validateAmountAllowBlank('loanModForm','assetCarsOwed','Please Enter Correct Cars Owed Amount.') &&
               validateAmountAllowBlank('loanModForm','assetLifeInsurance','Please Enter Correct Life Insurance (Whole Life not Term) Amount.') &&
               validateAmountAllowBlank('loanModForm','assetOther','Please Enter Correct Other Amount.')
        */
    ) {
        return true;
    } else {
        return false;
    }
}

/* Income and Expense Tab Validation */

function calculateTotLOPresentExpenses(currentvalue) {

    var presentRent = "", presentFirstMortgage = "", presentOtherFinancing = "", presentHazardInsurance = "";

    var presentRealEstateTaxes = "", presentMortgageInsurance = "", presentHomeownerAssnDues = "", presentOther = "";


    var totalAssetsNetValue = "", totalAssetsOwed = "";

    alertToEnterInput(currentvalue);

    try {
        presentRent = document.loanModForm.presentRent.value;
    } catch (e) {
    }
    try {
        presentFirstMortgage = document.loanModForm.presentFirstMortgage.value;
    } catch (e) {
    }
    try {
        presentOtherFinancing = document.loanModForm.presentOtherFinancing.value;
    } catch (e) {
    }
    try {
        presentHazardInsurance = document.loanModForm.presentHazardInsurance.value;
    } catch (e) {
    }
    try {
        presentRealEstateTaxes = document.loanModForm.presentRealEstateTaxes.value;
    } catch (e) {
    }
    try {
        presentMortgageInsurance = document.loanModForm.presentMortgageInsurance.value;
    } catch (e) {
    }
    try {
        presentHomeownerAssnDues = document.loanModForm.presentHomeownerAssnDues.value;
    } catch (e) {
    }
    try {
        presentOther = document.loanModForm.presentOther.value;
    } catch (e) {
    }

    presentRent = replaceCommaValues(presentRent);
    presentFirstMortgage = replaceCommaValues(presentFirstMortgage);
    presentOtherFinancing = replaceCommaValues(presentOtherFinancing);
    presentHazardInsurance = replaceCommaValues(presentHazardInsurance);
    presentRealEstateTaxes = replaceCommaValues(presentRealEstateTaxes);
    presentMortgageInsurance = replaceCommaValues(presentMortgageInsurance);
    presentHomeownerAssnDues = replaceCommaValues(presentHomeownerAssnDues);
    presentOther = replaceCommaValues(presentOther);

    if (presentRent == "") presentRent = 0;
    if (presentFirstMortgage == "") presentFirstMortgage = 0;
    if (presentOtherFinancing == "") presentOtherFinancing = 0;
    if (presentHazardInsurance == "") presentHazardInsurance = 0;
    if (presentRealEstateTaxes == "") presentRealEstateTaxes = 0;
    if (presentMortgageInsurance == "") presentMortgageInsurance = 0;
    if (presentHomeownerAssnDues == "") presentHomeownerAssnDues = 0;
    if (presentOther == "") presentOther = 0;

    totalPresentAmt = parseFloat(presentRent) + parseFloat(presentFirstMortgage);
    totalPresentAmt += parseFloat(presentOtherFinancing) + parseFloat(presentHazardInsurance);
    totalPresentAmt += parseFloat(presentRealEstateTaxes) + parseFloat(presentMortgageInsurance);
    totalPresentAmt += parseFloat(presentHomeownerAssnDues) + parseFloat(presentOther);


    try {
        document.getElementById("totalPresentTotalAmt").innerHTML = convertInputToAbsoluteValue(totalPresentAmt);
    } catch (e) {
    }
}


function calculateTotLOProposedExpenses(currentvalue) {

    var proposedRent = "", proposedFirstMortgage = "", proposedOtherFinancing = "", proposedHazardInsurance = "";

    var proposedRealEstateTaxes = "", proposedMortgageInsurance = "", proposedHomeownerAssnDues = "", presentOther = "";


    var totalAssetsNetValue = "", totalAssetsOwed = "";

    alertToEnterInput(currentvalue);

    try {
        proposedRent = document.loanModForm.proposedRent.value;
    } catch (e) {
    }
    try {
        proposedFirstMortgage = document.loanModForm.proposedFirstMortgage.value;
    } catch (e) {
    }
    try {
        proposedOtherFinancing = document.loanModForm.proposedOtherFinancing.value;
    } catch (e) {
    }
    try {
        proposedHazardInsurance = document.loanModForm.proposedHazardInsurance.value;
    } catch (e) {
    }
    try {
        proposedRealEstateTaxes = document.loanModForm.proposedRealEstateTaxes.value;
    } catch (e) {
    }
    try {
        proposedMortgageInsurance = document.loanModForm.proposedMortgageInsurance.value;
    } catch (e) {
    }
    try {
        proposedHomeownerAssnDues = document.loanModForm.proposedHomeownerAssnDues.value;
    } catch (e) {
    }
    try {
        proposedOther = document.loanModForm.proposedOther.value;
    } catch (e) {
    }

    proposedRent = replaceCommaValues(proposedRent);
    proposedFirstMortgage = replaceCommaValues(proposedFirstMortgage);
    proposedOtherFinancing = replaceCommaValues(proposedOtherFinancing);
    proposedHazardInsurance = replaceCommaValues(proposedHazardInsurance);
    proposedRealEstateTaxes = replaceCommaValues(proposedRealEstateTaxes);
    proposedMortgageInsurance = replaceCommaValues(proposedMortgageInsurance);
    proposedHomeownerAssnDues = replaceCommaValues(proposedHomeownerAssnDues);
    proposedOther = replaceCommaValues(proposedOther);

    if (proposedRent == "") proposedRent = 0;
    if (proposedFirstMortgage == "") proposedFirstMortgage = 0;
    if (proposedOtherFinancing == "") proposedOtherFinancing = 0;
    if (proposedHazardInsurance == "") proposedHazardInsurance = 0;
    if (proposedRealEstateTaxes == "") proposedRealEstateTaxes = 0;
    if (proposedMortgageInsurance == "") proposedMortgageInsurance = 0;
    if (proposedHomeownerAssnDues == "") proposedHomeownerAssnDues = 0;
    if (proposedOther == "") proposedOther = 0;

    totalProposedAmt = parseFloat(proposedRent) + parseFloat(proposedFirstMortgage);
    totalProposedAmt += parseFloat(proposedOtherFinancing) + parseFloat(proposedHazardInsurance);
    totalProposedAmt += parseFloat(proposedRealEstateTaxes) + parseFloat(proposedMortgageInsurance);
    totalProposedAmt += parseFloat(proposedHomeownerAssnDues) + parseFloat(proposedOther);


    try {
        document.getElementById("totalProposedAmt").innerHTML = convertInputToAbsoluteValue(totalProposedAmt);
    } catch (e) {
    }
}

/*
 * Calculate HMLO Income & Expense Primary Borrower Total HouseHold Income. Jan 31, 2017
 */

function calculateHMLOBorrowerNetHouseholdIncome(formName, targetFld) {
    var grossIncome = 0, commissionOrBonus = 0;
    var overtime = 0, netRental = 0, netEarnedInterest = 0, otherHouseHold = 0;
    var totalBorrowerNetHouseholdIncome = 0;
    var capitalGains = partnership = militaryIncome1 = 0;

    try {
        eval("grossIncome = document." + formName + ".grossIncome1.value");
    } catch (e) {
    }
    try {
        eval("commissionOrBonus = document." + formName + ".commissionOrBonus1.value");
    } catch (e) {
    }
    try {
        eval("overtime = document." + formName + ".overtime1.value");
    } catch (e) {
    }
    try {
        eval("netRental = document." + formName + ".netRental1.value");
    } catch (e) {
    }
    try {
        eval("netEarnedInterest = document." + formName + ".netEarnedInterest1.value");
    } catch (e) {
    }
    try {
        eval("otherHouseHold = document." + formName + ".otherHouseHold1.value");
    } catch (e) {
    }
    try {
        eval("capitalGains = document." + formName + ".capitalGains1.value");
    } catch (e) {
    }
    try {
        eval("partnership = document." + formName + ".partnership1.value");
    } catch (e) {
    }
    try {
        eval("militaryIncome1 = document." + formName + ".militaryIncome1.value");
    } catch (e) {
    }

    try {
        grossIncome = replaceCommaValues(grossIncome);
        commissionOrBonus = replaceCommaValues(commissionOrBonus);
        overtime = replaceCommaValues(overtime);
        netRental = replaceCommaValues(netRental);
        netEarnedInterest = replaceCommaValues(netEarnedInterest);
        otherHouseHold = replaceCommaValues(otherHouseHold);
        capitalGains = replaceCommaValues(capitalGains);
        partnership = replaceCommaValues(partnership);
        militaryIncome1 = replaceCommaValues(militaryIncome1);
    } catch (e) {
    }

    if (grossIncome == "") grossIncome = 0;
    if (commissionOrBonus == "") commissionOrBonus = 0;
    if (overtime == "") overtime = 0;
    if (netRental == "") netRental = 0;
    if (netEarnedInterest == "") netEarnedInterest = 0;
    if (otherHouseHold == "") otherHouseHold = 0;
    if (capitalGains == "") capitalGains = 0;
    if (partnership == "") partnership = 0;
    if (militaryIncome1 == "") militaryIncome1 = 0;

    totalBorrowerNetHouseholdIncome = parseFloat(grossIncome) + parseFloat(commissionOrBonus) + parseFloat(overtime) + parseFloat(netRental) +
        parseFloat(netEarnedInterest) + parseFloat(otherHouseHold) + parseFloat(capitalGains) + parseFloat(partnership) + parseFloat(militaryIncome1);
    totalBorrowerNetHouseholdIncome = totalBorrowerNetHouseholdIncome.toFixed(2);
    try {
        eval("document.getElementById('" + targetFld + "').innerHTML = convertInputToAbsoluteValue(totalBorrowerNetHouseholdIncome)");
    } catch (e) {
    }
    calculateHMLOTotalNetHouseholdIncome(formName, targetFld);

}

function calculateHMLOCoBorrowerNetHouseholdIncome(formName, targetFld) {
    var grossIncome = 0, commissionOrBonus = 0;
    var overtime = 0, netRental = 0, netEarnedInterest = 0, otherHouseHold = 0;
    var totalCoBorrowerNetHouseholdIncome = 0;
    var capitalGains = partnership = 0;

    try {
        eval("grossIncome = document." + formName + ".grossIncome2.value");
    } catch (e) {
    }
    try {
        eval("commissionOrBonus = document." + formName + ".commissionOrBonus2.value");
    } catch (e) {
    }
    try {
        eval("overtime = document." + formName + ".overtime2.value");
    } catch (e) {
    }
    try {
        eval("netRental = document." + formName + ".netRental2.value");
    } catch (e) {
    }
    try {
        eval("netEarnedInterest = document." + formName + ".netEarnedInterest2.value");
    } catch (e) {
    }
    try {
        eval("otherHouseHold = document." + formName + ".otherHouseHold2.value");
    } catch (e) {
    }
    try {
        eval("capitalGains = document." + formName + ".capitalGains2.value");
    } catch (e) {
    }
    try {
        eval("partnership = document." + formName + ".partnership2.value");
    } catch (e) {
    }

    try {
        grossIncome = replaceCommaValues(grossIncome);
        commissionOrBonus = replaceCommaValues(commissionOrBonus);
        overtime = replaceCommaValues(overtime);
        netRental = replaceCommaValues(netRental);
        netEarnedInterest = replaceCommaValues(netEarnedInterest);
        otherHouseHold = replaceCommaValues(otherHouseHold);
        capitalGains = replaceCommaValues(capitalGains);
        partnership = replaceCommaValues(partnership);
    } catch (e) {
    }

    if (grossIncome == "") grossIncome = 0;
    if (commissionOrBonus == "") commissionOrBonus = 0;
    if (overtime == "") overtime = 0;
    if (netRental == "") netRental = 0;
    if (netEarnedInterest == "") netEarnedInterest = 0;
    if (otherHouseHold == "") otherHouseHold = 0;
    if (capitalGains == "") capitalGains = 0;
    if (partnership == "") partnership = 0;

    totalCoBorrowerNetHouseholdIncome = parseFloat(grossIncome) + parseFloat(commissionOrBonus) + parseFloat(overtime) + parseFloat(netRental) + parseFloat(netEarnedInterest) + parseFloat(otherHouseHold) + parseFloat(capitalGains) + parseFloat(partnership);
    totalCoBorrowerNetHouseholdIncome = totalCoBorrowerNetHouseholdIncome.toFixed(2);
    try {
        eval("document.getElementById('" + targetFld + "').innerHTML = convertInputToAbsoluteValue(totalCoBorrowerNetHouseholdIncome)");
    } catch (e) {
    }
    calculateHMLOTotalNetHouseholdIncome(formName, targetFld);

}

function calculateHMLOTotalNetHouseholdIncome(formName, targetFld) {
    var primaryTotalNetHouseHoldIncome = 0, coBorrowerTotalNetHouseHoldIncome = 0, isCoBorrower = 0,
        totalHouseHoldIncome = 0;
    try {
        eval("isCoBorrower = document." + formName + ".isCoBorrowerExists.value");
        isCoBorrower = trim(isCoBorrower);
    } catch (e) {
    }
    try {
        eval("isCoBorrower = document." + formName + ".isCoBorrower.value");
        isCoBorrower = trim(isCoBorrower);
    } catch (e) {
    }

    /*try {
    primaryTotalNetHouseHoldIncome = document.getElementById("primTotalNetHouseHoldIncome").innerHTML;
    primaryTotalNetHouseHoldIncome = trim(primaryTotalNetHouseHoldIncome);
    } catch(e) {}
    primaryTotalNetHouseHoldIncome = replaceCommaValues(primaryTotalNetHouseHoldIncome);

if (primaryTotalNetHouseHoldIncome == "")    primaryTotalNetHouseHoldIncome = 0;*/

    primaryTotalNetHouseHoldIncome = getTextValue('primTotalNetHouseHoldIncome');

    if (isCoBorrower == 1) {
        /*try {
	    coBorrowerTotalNetHouseHoldIncome = document.getElementById("coTotalNetHouseHoldIncome").innerHTML;
	    coBorrowerTotalNetHouseHoldIncome = trim(coBorrowerTotalNetHouseHoldIncome);
        } catch(e) {}
        coBorrowerTotalNetHouseHoldIncome = replaceCommaValues(coBorrowerTotalNetHouseHoldIncome);*/
        coBorrowerTotalNetHouseHoldIncome = getTextValue('coTotalNetHouseHoldIncome');
    }

    /*try {
        primaryTotalNetHouseHoldIncome    = replaceCommaValues(primaryTotalNetHouseHoldIncome);
        coBorrowerTotalNetHouseHoldIncome = replaceCommaValues(coBorrowerTotalNetHouseHoldIncome);
    } catch(e) {}*/

    //if (coBorrowerTotalNetHouseHoldIncome == "")    coBorrowerTotalNetHouseHoldIncome = 0;
    coBorrowerTotalNetHouseHoldIncome = parseFloat(coBorrowerTotalNetHouseHoldIncome);
    totalHouseHoldIncome = parseFloat(primaryTotalNetHouseHoldIncome) + coBorrowerTotalNetHouseHoldIncome;
    totalHouseHoldIncome = parseFloat(totalHouseHoldIncome);
    totalHouseHoldIncome = totalHouseHoldIncome.toFixed(2);
    if (totalHouseHoldIncome == "") totalHouseHoldIncome = 0;

    try {
        document.getElementById("totalHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(totalHouseHoldIncome);
    } catch (e) {
    }


    try {
        document.getElementById("subTotalNetHouseHoldIncome").innerHTML = convertInputToAbsoluteValue(totalHouseHoldIncome);
    } catch (e) {
    }

    if (isCoBorrower == 1) {
        try {
            totalHouseHoldExpenses = document.getElementById("subTotalHouseHoldExpenses").innerHTML;
        } catch (e) {
        }
    } else {
        try {
            totalHouseHoldExpenses = document.getElementById("primTotalHouseHoldExpenses").innerHTML;
        } catch (e) {
        }
    }

    try {
        totalHouseHoldIncome = replaceCommaValues(totalHouseHoldIncome);
        totalHouseHoldExpenses = replaceCommaValues(totalHouseHoldExpenses);
    } catch (e) {
    }
    try {
        totalDisposableIncome = parseFloat(totalHouseHoldIncome) - replaceCommaValues(totalHouseHoldExpenses);
        totalDisposableIncome = parseFloat(totalDisposableIncome);
        totalDisposableIncome = totalDisposableIncome.toFixed(2);
    } catch (e) {
    }
    try {
        document.getElementById("totalDisposableIncome").innerHTML = convertInputToAbsoluteValue(totalDisposableIncome);
    } catch (e) {
    }
    calculateHMLOIncomeDTI();
}

function showHMLOIncomeCalucation(formName) {
    var isCoBorrower = 0, otherMortgage1 = 0, otherMortgage2 = 0;
    try {
        eval("isCoBorrower = document." + formName + ".isCoBorrowerExists.value");
        isCoBorrower = trim(isCoBorrower);
    } catch (e) {
    }
    try {
        eval("isCoBorrower = document." + formName + ".isCoBorrower.value");
        isCoBorrower = trim(isCoBorrower);
    } catch (e) {
    }
    if (isCoBorrower == 1) {

        try {
            eval("otherMortgage1 = document." + formName + ".otherMortgage1.value");
            otherMortgage1 = trim(otherMortgage1);
        } catch (e) {
        }
        try {
            eval("otherMortgage2 = document." + formName + ".otherMortgage2.value");
            otherMortgage2 = trim(otherMortgage2);
        } catch (e) {
        }
        calculateHMLOBorrowerNetHouseholdIncome('loanModForm', 'primTotalNetHouseHoldIncome');
        calculateHMLOCoBorrowerNetHouseholdIncome('loanModForm', 'coTotalNetHouseHoldIncome');

        calculatePrimaryTotalHouseHoldExpenses(otherMortgage1);
        calculateCoBorrowerTotalHouseHoldExpenses(otherMortgage2);
    } else {
        calculateHMLOTotalNetHouseholdIncome();
//            calculateIncomeDTI();
    }
    calculateHMLOIncomeDTI();
}


/*** Calculate Current DTI for HMLO ***/
function calculateHMLOIncomeDTI() {

    var lien1DTI = 0, totalHouseHoldIncome = 0, totalHouseHoldExpenses = 0;

    try {
        totalHouseHoldIncome = document.getElementById("totalHouseHoldIncome").innerHTML;
        totalHouseHoldIncome = trim(totalHouseHoldIncome);
    } catch (e) {
    }
    try {
        totalHouseHoldExpenses = document.getElementById("totalHouseHoldExpenses").innerHTML;
        totalHouseHoldExpenses = trim(totalHouseHoldExpenses);
    } catch (e) {
    }
    try {
        totalHouseHoldIncome = replaceCommaValues(totalHouseHoldIncome);
        totalHouseHoldExpenses = replaceCommaValues(totalHouseHoldExpenses);
    } catch (e) {
    }

    if (totalHouseHoldIncome == "") totalHouseHoldIncome = 0;
    if (totalHouseHoldExpenses == "") totalHouseHoldExpenses = 0;

    if (totalHouseHoldIncome > 0) {
        lien1DTI = parseFloat(totalHouseHoldExpenses) / parseFloat(totalHouseHoldIncome);
        lien1DTI = lien1DTI * 100;
    }
    lien1DTI = lien1DTI.toFixed(2);

    try {
        eval("document.getElementById('lien1IncomeDTI').innerHTML = lien1DTI");
    } catch (e) {
    }
}

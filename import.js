// write a function that receives fnm file ex. output/barbara_loan.xml and writes a lendingWise object in json ex. assets/barbara_loan.json
const fs = require('fs')
const parser = require('xml2json');

function importToPage(fnmFile) {
    const json = parser.toJson(fnmFile);

    const lendingWiseObject = JSON.parse(json);

    // fs.writeFileSync("test.json" , json);

    
    const loanNumber = lendingWiseObject.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.LOANS.LOAN.LOAN_IDENTIFIERS.LOAN_IDENTIFIER.LoanIdentifier;

    

    // Find the loan number element in the html page
    const loanNumberElement = document.getElementById("loanNumber");

}



const fnmFile = fs.readFileSync('output/barbara_loan.xml', 'utf8');
importToPage(fnmFile);


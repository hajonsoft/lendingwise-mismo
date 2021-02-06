const { parseXml } = require('libxmljs');
const fs = require('fs')

const xsdContent = fs.readFileSync(__dirname + '/assets/reference/ReferenceModel_v3.4.0_B324/MISMO_3.4.0_B324.xsd','utf-8');
const xsd = parseXml(xsdContent, { baseUrl: __dirname + '/assets/reference/ReferenceModel_v3.4.0_B324/' });

function validate(xmlContent) {
    // const xmlContent = fs.readFileSync(__dirname + '/../output/keith_loan.xml','utf-8')
    const xml = parseXml(xmlContent);
    try {
        const result = xml.validate(xsd); 
        return xml.validationErrors;
    } catch (err){
        return [err.message]
    }
}


module.exports = { validate };


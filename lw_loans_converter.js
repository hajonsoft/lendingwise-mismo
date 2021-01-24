const {
  createMismo
} = require("./lendingWise");
const fs = require("fs");

let fileName = 'john_loan'
  let jsonFile = fs.readFileSync('./assets/'+ fileName+'.json', 'utf-8');
  let xml = createMismo(JSON.parse(jsonFile));
  fs.writeFileSync('./output/' + fileName + '.xml', xml)

   fileName = 'bobby_loan'
   jsonFile = fs.readFileSync('./assets/'+ fileName+'.json', 'utf-8');
   xml = createMismo(JSON.parse(jsonFile));
  fs.writeFileSync('./output/' + fileName + '.xml', xml)

  fileName = 'rodriguez_loan'
  jsonFile = fs.readFileSync('./assets/'+ fileName+'.json', 'utf-8');
  xml = createMismo(JSON.parse(jsonFile));
 fs.writeFileSync('./output/' + fileName + '.xml', xml)


// function createMismoTest() {
//   const mismo = createMismo(lwLoan);
//   fs.writeFileSync("./output/mismo_loan.xml", mismo, {
//     encoding: "utf8",
//     flag: "w",
//   });
//   // console.log(mismo);
//   return mismo;
// }

// global.createLendingWiseMismo = createMismoTest;

// if (process.argv[2]){
//   const jsonFile = fs.readFileSync('./assets/' + process.argv[2] + '.json', 'utf-8');
//   const xml = createMismo(JSON.parse(jsonFile));
//   fs.writeFileSync('./output/' + process.argv[2] + '.xml', xml)
// } else {
//   console.log('Usage: node . filename [file located in asset folder]' )
// }



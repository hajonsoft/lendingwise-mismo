# Overview

This project converts a lendingWise loan to MISMO format and vice versa, for code walkthrough please watch these videos

https://drive.google.com/file/d/14kSFTDopqmqOS07400SbxqTgcJgIQGbm/view?usp=sharing




# Getting Started

`node lw ayman`

converts `./assets/ayman.json` to `./output/ayman.xml`

Node is used to convert a lendingwise JSON object into its corresponding MISMO format. 

## Design

xmlbuilder2 npm package is used to easily create the xml. This is easier than php which I am not so experienced with. The code is then packaged using browserify and then echoed inside php


# Credits

xmlbuilder2
https://oozcitak.github.io/xmlbuilder2/

Mismo specs 
https://singlefamily.fanniemae.com/media/7571/display

Lending wise staging website  
https://staging.lendingwise.com/backoffice/admin.php

Lending wise production website 
https://www.theloanpost.com/backoffice/admin.php

print_r to JSON converter  
https://www.nestforms.com/php-print_r-to-json-online

Mismo explorer 
https://modelviewers.pilotfishtechnology.com/modelviewers/MISMO/index.html?page=https%3A//modelviewers.pilotfishtechnology.com/modelviewers/MISMO/model/Format.MESSAGE.DEAL_SETS.DEAL_SET.DEALS.DEAL.PARTIES.PARTY.ROLES.ROLE.ROLE_DETAIL.PartyRoleType.html

Mixing php and javascript 
https://www.youtube.com/watch?v=-3LGsHOSTec

npm i -g browserify

browserify index.js -o build/lw_mismo_converter.js

browserify importfnm.js -o assets/1003-tab/importfnm.js

Learning resources
https://singlefamily.fanniemae.com/learning-center/uniform-residential-loan-application

print_r to array replace strings
replace to get php arry from print_r
=> (.*[^,])$
=> "$1",

=>([^,])$
=>$1"",


npm i libxmljs
on Mac issues https://medium.com/flawless-app-stories/gyp-no-xcode-or-clt-version-detected-macos-catalina-anansewaa-38b536389e8d


# just for fun
To publish to github packages
create .npmrc
update package.json (name, repository, registry)
npm login --registry https://npm.pkg.github.com  
login with hajonsoft and a token ex. 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
npm publish

# Test strategy
For all dave-comments files test using the following 
1- Import a file
2- Export the same file
3- Compare the original file with the exported file, save both of them to a separate folder


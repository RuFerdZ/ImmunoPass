const fs = require('fs');
const idl = require('./target/idl/immunopass.json');

fs.writeFileSync('./app/src/idl.json', JSON.stringify(idl));

console.log("Synced idl with client successfully!")
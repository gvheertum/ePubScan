const targetPath = './src/environments/environment.ts';// Load node modules

require('dotenv').load();// `environment.ts` file structure
const fs = require('fs');
const writeFile = fs.writeFile;

const envConfigFile = `export const environment = { 
   apiUrl: '${process.env.API_URL ? process.env.API_URL : "'http://localhost/api/"}',
   production: true,
   generated: true,
};
`;

console.log('The file `environment.ts` will be written with the following content: \n');
console.log(envConfigFile);
writeFile(targetPath, envConfigFile, function (err: any) {
   if (err) {
       throw console.error(err);
   } else {
       console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
   }
});
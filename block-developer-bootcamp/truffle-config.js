require('babel-register');
require('babel-polyfill');
require('dotenv').config();
 
module.exports = {
 

  networks: {
 
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
     gas: "4500000",
     gasPrice: "90000000000",      // Ropsten has a lower block limit than mainnet
     confirmations: 2,    // # of confs to wait between deployments. (default: 0)
     timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
     skipDryRun: true  
    },
   
  },

  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
 
  compilers: {
    solc: {
     // version: "0.5.0",    // Fetch exact version from solc-bin (default: truffle's version)
     optimizer:{
       enabled: true,
       runs : 200
     }
     
    }
  },

   
};

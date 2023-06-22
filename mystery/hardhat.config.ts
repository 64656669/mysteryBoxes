import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = { 
      solidity: {
        compilers: [{ version: "0.8.18" }, { version: "0.6.6" }],
        settings: {
          optimizer: {
            enabled: false,
            runs: 2000000000000,
          },
        },
      },
      gasReporter: {
        enabled: true,
        // outputFile: "gas-report.txt",
        noColors: false,
        currency: "EUR",
        coinmarketcap: "c9549b6b-0690-4fef-833e-ee3eb5142093",
        token: "MATIC",
        gasPrice: 40,
      },
      networks:{
        'truffle-dashboard': {
          url: "http://localhost:24012/rpc"
        },
      },

      etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: "HW83XKIP6DNVKHF9IE4JFHNV8U47QFJK3S"
      }
  
};

export default config;


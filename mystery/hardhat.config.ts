import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter"

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  gasReporter: {
    enabled: true,
    // outputFile: "gas-report.txt",
    noColors: false,
    currency: "EUR",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: "MATIC",
    gasPrice: 40,
  },
};




export default config;

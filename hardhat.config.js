require("@nomicfoundation/hardhat-toolbox");

const privateKey = "05a78a752e876b28304ed67c6c0cb05545693c99df446e8f8c27734209240e8c";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [privateKey]
    }
  }
};

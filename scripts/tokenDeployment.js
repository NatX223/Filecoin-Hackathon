const hre = require("hardhat");

async function main() {

  const publicKey = "0x8A7028BE1473740c692E0Dc7C2FE064fD63b81aB";
  
  const maxSupply = 1000000;
  const Token = await hre.ethers.getContractFactory("SocialToken");
  const token = await Token.deploy(maxSupply, publicKey);

  await token.deployed();

  console.log(
    "Address", token.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

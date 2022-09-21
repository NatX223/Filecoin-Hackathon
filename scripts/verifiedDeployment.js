const hre = require("hardhat");

async function main() {
  
  const maxSupply = 1000000;
  const Verified = await hre.ethers.getContractFactory("VerifiedToken");
  const verified = await Verified.deploy("0xC160754FFB07B739BD2F7F2fEcB142A66258479B", "https://gateway.moralisipfs.com/ipfs/QmY1zpvijnBDmoMwVg5Zyab7b8zShBbSkA4i3SZuDJDA7R", "DAVERIFIED", "DVF");

  await verified.deployed();

  console.log(
    "Address", verified.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = ethers.utils.parseEther("0.001");
  
  //OPENER CONTRACT
  const Opener = await ethers.getContractFactory("Opener");
  const opener = await Opener.deploy();

  await opener.deployed();

  console.log(
    `Opener with ${ethers.utils.formatEther(lockedAmount)}ETH and unlock timestamp ${unlockTime} deployed to ${opener.address}`
  );

  //ADDREWARD CONTRACT
  const AddReward = await ethers.getContractFactory("AddReward");
  const addReward = await AddReward.deploy();

  await addReward.deployed();

  console.log(
    `AddReward with ${ethers.utils.formatEther(lockedAmount)}ETH and unlock timestamp ${unlockTime} deployed to ${addReward.address}`
  );

  //MANAGER CONTRACT
  const Manager = await ethers.getContractFactory("Manager");
  const manager = await Manager.deploy(opener.address,addReward.address);

  await manager.deployed();

  await manager.deployTransaction.wait(3);

  console.log(
    `Manager with ${ethers.utils.formatEther(lockedAmount)}ETH and unlock timestamp ${unlockTime} deployed to ${manager.address}`
  );

  // contracts verif
  await hre.run("verify:verify", {
    address: opener.address,
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: addReward.address,
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: manager.address,
    constructorArguments: [opener.address,addReward.address],
  });


}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


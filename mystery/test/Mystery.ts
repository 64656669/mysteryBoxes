import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

//

describe("Testing Manager", function(){

    describe("Test 1", function(){

        async function DeployFixture(){

            // Contracts are deployed using the first signer/account by default
            const [owner, other] = await ethers.getSigners();
            
            // Token1 contract
            const Token1 = await ethers.getContractFactory("MyToken");
            const token1 = await Token1.deploy();
            // Token2 contract
            const Token2 = await ethers.getContractFactory("MyToken");
            const token2 = await Token2.deploy();
            
            // NFT contract
            const NFT = await ethers.getContractFactory("KEY");
            const nft = await NFT.deploy();
            // 
            const KEY = await ethers.getContractFactory("KEY");
            const Key = await KEY.deploy();
            // 
            //const Manager = await ethers.getContractFactory("Manager");
            //const manager = await Manager.deploy();
            // 
            const MysteryBox = await ethers.getContractFactory("MysteryBox");
            const mysteryBox = await MysteryBox.deploy("edition1", 20,Key.address);

            return { owner, other, nft,token1,token2, mysteryBox, Key};
        }

        it("Generating & Adding Gifts/rewards to MysteryBox Edition 1", async function(){
            const {owner, other, nft, token1, token2, mysteryBox, Key} = await loadFixture(DeployFixture);
            
            const amount = 1000;
            // Mint token 1 & 2 for Mystery Box Edition 1
            await token1.mint(owner.address, amount);
            await token2.mint(owner.address, amount);
            await nft.safeMint(owner.address,'QmPckj4thDT8juCdj7J9b3rZBJHJeBNBfkAKYrVG67q3mA'); //ID 1
            // giving allowance
            await token1.approve(mysteryBox.address, amount);
            await token2.approve(mysteryBox.address, amount);
            await nft.approve(mysteryBox.address, 0);
            //
            console.log("token 1 :" + await token1.balanceOf(mysteryBox.address));
            console.log("token 2 :" + await token2.balanceOf(mysteryBox.address));
            // adding tokens to mystery box contract
            await mysteryBox.connect(owner).addReward(false, token1.address,amount);
            await mysteryBox.connect(owner).addReward(false, token2.address,amount);
            await mysteryBox.connect(owner).addReward(true, nft.address,0);
            //
            console.log("token 1 :" + await token1.balanceOf(mysteryBox.address));
            console.log("token 2 :" + await token2.balanceOf(mysteryBox.address));
            //
            console.log("Rewards Pool :" + await mysteryBox.getRewardsPool());
            // init Mystery Box avec lot
            await mysteryBox.initBoxes();
            //console.log(bal);
            //console.log("token 1 :" + await token1.balanceOf(mysteryBox.address));
            //console.log("token 2 :" + await token2.balanceOf(mysteryBox.address));
            console.log("ETH BAlance = " + await ethers.provider.getBalance(mysteryBox.address));
            // log check

            // Adding liquidity
           
            
        });

      

    });

})



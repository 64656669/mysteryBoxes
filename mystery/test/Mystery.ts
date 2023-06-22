import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

//

describe("Testing", function(){

    describe("Mystery Boxes Init", function(){

        async function DeployFixture(){

            // Contracts are deployed using the first signer/account by default
            const [owner, other] = await ethers.getSigners();
            // Token contracts
            // Used to add token rewards inside Mystery Boxes
            // Token1
            const Token1 = await ethers.getContractFactory("MyToken");
            const token1 = await Token1.deploy();
            // Token2
            const Token2 = await ethers.getContractFactory("MyToken");
            const token2 = await Token2.deploy();
            
            // NFT contracts
            //one contract used to add NFT as rewards inside Mystery Boxes
            const NFT = await ethers.getContractFactory("MysteryKey");
            const nftInsideBox = await NFT.deploy();
            //one contract used to generate Mystery Keys
            const KEY = await ethers.getContractFactory("MysteryKey");
            const Key = await KEY.deploy();
            // Opener Contract
            const Opener = await ethers.getContractFactory("Opener");
            const opener = await Opener.deploy();
            // 
            const AddReward = await ethers.getContractFactory("AddReward");
            const addReward = await AddReward.deploy();
            // Manager Contract
            const Manager = await ethers.getContractFactory("Manager");
            const manager = await Manager.deploy(opener.address,addReward.address);
            // 
            const MysteryBox = await ethers.getContractFactory("MysteryBox");
            const mysteryBox = await MysteryBox.deploy("edition1",20,Key.address, opener.address, addReward.address);

            return { owner, other, nftInsideBox,token1,token2, mysteryBox, Key, manager,addReward};
        }

        it("Should add Gifts/rewards to MysteryBox Edition 1 without Manager Contract", async function(){
            const {owner, nftInsideBox, token1, token2, mysteryBox, addReward} = await loadFixture(DeployFixture);
            const provider = ethers.getDefaultProvider();
            const amount = 1000;
            // Mint token 1 & 2 for Mystery Box Edition 1
            await token1.mint(owner.address, amount);
            await token2.mint(owner.address, amount);
            // Mint 1 NFT for Mystery Box Edition 1
            await nftInsideBox.safeMint(owner.address,'QmPckj4thDT8juCdj7J9b3rZBJHJeBNBfkAKYrVG67q3mA');
            // giving allowance
            await token1.approve(addReward.address, amount);
            await token2.approve(addReward.address, amount);
            await nftInsideBox.approve(addReward.address, 0);
            // adding tokens to mystery box contract
            await addReward.connect(owner).addReward(false,token1.address,mysteryBox.address,amount);
            await addReward.connect(owner).addReward(false,token2.address,mysteryBox.address,amount);
            await addReward.connect(owner).addReward(true, nftInsideBox.address,mysteryBox.address,0);
            //
            const rewards = (await mysteryBox.getRewardsPool()).toString()
            const expectedRewards = "1,"+amount+",false," +  token1.address + ",1,"+amount+",false," +  token2.address + ",0,0,false," +  nftInsideBox.address;
            //
            expect(rewards).to.be.equal(expectedRewards);
        });

        it("Should add Gifts/rewards to MysteryBox Edition 1 with Manager Contract", async function(){
            const {owner, nftInsideBox, token1, token2, manager, addReward} = await loadFixture(DeployFixture);
            
            const amount = 1000;
            // Mint token 1 & 2 for Mystery Box Edition 1
            await token1.mint(owner.address, amount);
            await token2.mint(owner.address, amount);
            // Mint 1 NFT for Mystery Box Edition 1
            await nftInsideBox.safeMint(owner.address,'QmPckj4thDT8juCdj7J9b3rZBJHJeBNBfkAKYrVG67q3mA');
            // creating edition from manager contract
            await manager.connect(owner).createEdition("Edition2", 50);
            const addressContractBox = await manager.connect(owner).getMysteryBoxes();
            //
            const contractBox = await ethers.getContractAt(
                "MysteryBox",
                addressContractBox[0]
            );
            // giving allowance
            await token1.approve(addReward.address, amount);
            await token2.approve(addReward.address, amount);
            await nftInsideBox.approve(addReward.address, 0);
            // adding tokens to mystery box contract
            await addReward.connect(owner).addReward(false,token1.address,addressContractBox[0],amount);
            await addReward.connect(owner).addReward(false,token2.address,addressContractBox[0],amount);
            await addReward.connect(owner).addReward(true, nftInsideBox.address,addressContractBox[0],0);
            // test
            const rewards = (await contractBox.getRewardsPool()).toString()
            const expectedRewards = "1,"+amount+",false," +  token1.address + ",1,"+amount+",false," +  token2.address + ",0,0,false," +  nftInsideBox.address;
    
            expect(rewards).to.be.equal(expectedRewards);  
        });

        it("Should create edition + emit an event containing the Mystery Box contract address", async function(){

            const {owner,manager} = await loadFixture(DeployFixture);
             
            const tx = await manager.connect(owner).createEdition("Edition2", 50);

            const contractAddress = await manager.connect(owner).getMysteryBoxes();
            
            await expect(tx).to.emit(manager, "LogAddressBox")
            .withArgs(contractAddress[0]);
            expect(contractAddress[0]).to.be.a("string");
            expect(contractAddress[0].length).to.equal(42);
        });

        it("Should create edition + emit an event containing the Mystery Key contract address", async function(){

            const {owner,manager} = await loadFixture(DeployFixture);
             
            const tx = await manager.connect(owner).createEdition("Edition2", 50);

            const contractAddress = await manager.connect(owner).getMysteryKeys();
            
            await expect(tx).to.emit(manager, "LogAddressKey")
            .withArgs(contractAddress[0]);
            expect(contractAddress[0]).to.be.a("string");
            expect(contractAddress[0].length).to.equal(42);
        });

        it("Should have 50 keys", async function(){

            const {owner,manager} = await loadFixture(DeployFixture);
             
            const tx = await manager.connect(owner).createEdition("Edition2", 50);

            const contractAddress = await manager.connect(owner).getMysteryKeys();

            const keyAmount= await manager.connect(owner).getKeyAmount(contractAddress[0]);
            
            expect(keyAmount).to.equal(50);
        });
    });

    describe("Opening Mystery Boxes", function(){

        async function DeployFixture(){

            // Contracts are deployed using the first signer/account by default
            const [owner, other] = await ethers.getSigners();
            // Token contracts
            // Used to add token rewards inside Mystery Boxes
            // Token1
            const Token1 = await ethers.getContractFactory("MyToken");
            const token1 = await Token1.deploy();
            // Token2
            const Token2 = await ethers.getContractFactory("MyToken");
            const token2 = await Token2.deploy();
            // NFT contracts
            //one contract used to add NFT as rewards inside Mystery Boxes
            const NFT = await ethers.getContractFactory("MysteryKey");
            const nftInsideBox = await NFT.deploy();
            // Opener Contract
            const Opener = await ethers.getContractFactory("Opener");
            const opener = await Opener.deploy();
            //
            const AddReward = await ethers.getContractFactory("AddReward");
            const addReward = await AddReward.deploy(); 
            // Manager Contract
            const Manager = await ethers.getContractFactory("Manager");
            const manager = await Manager.deploy(opener.address,addReward.address);
            
            return { owner,other, nftInsideBox,token1,token2, manager,opener,addReward};
        }

        it("Should not allow to Open a box if not owner of a KEY", async function(){

            const {owner,other,nftInsideBox, token1, token2, manager,opener, addReward} = await loadFixture(DeployFixture);
            
            const amount = 100;
            // Mint token 1 & 2 for Mystery Box Edition 1s
            await token1.mint(owner.address, amount);
            await token2.mint(owner.address, amount);
            // Mint 1 NFT for Mystery Box Edition 1
            await nftInsideBox.safeMint(owner.address,'QmPckj4thDT8juCdj7J9b3rZBJHJeBNBfkAKYrVG67q3mA');
            // creating edition from manager contract
            await manager.connect(owner).createEdition("Edition2", 50);
            const addressContractBox = await manager.connect(owner).getMysteryBoxes();
            const addressContractKey = await manager.connect(owner).getMysteryKeys();
            //
            const contractBox = await ethers.getContractAt(
                "MysteryBox",
                addressContractBox[0]
            );
            const contractKey = await ethers.getContractAt(
                "MysteryKey",
                addressContractKey[0]
            );
            // giving allowance
            await token1.approve(addReward.address, amount);
            await token2.approve(addReward.address, amount);
            await nftInsideBox.approve(addReward.address, 0);
            await contractKey.approve(contractBox.address, 0);
            // adding tokens to mystery box contract
            await addReward.connect(owner).addReward(false,token1.address,addressContractBox[0],amount);
            await addReward.connect(owner).addReward(false,token2.address,addressContractBox[0],amount);
            await addReward.connect(owner).addReward(true, nftInsideBox.address,addressContractBox[0],0);
            //
            const tx = opener.connect(other).openBox(addressContractBox[0],addressContractKey[0], 0);
            expect(tx).to.be.revertedWith(
                'not owner of this Key'
            );
        });

        it("Should not allow to use a Key with a wrong contract address", async function(){

            const {owner,other,nftInsideBox, token1, token2, manager,opener, addReward} = await loadFixture(DeployFixture);
            
            const amount = 100;
            // Mint token 1 & 2 for Mystery Box Edition 1s
            await token1.mint(owner.address, amount);
            await token2.mint(owner.address, amount);
            // Mint 1 NFT for Mystery Box Edition 1
            await nftInsideBox.safeMint(owner.address,'QmPckj4thDT8juCdj7J9b3rZBJHJeBNBfkAKYrVG67q3mA');
            // creating edition from manager contract
            await manager.connect(owner).createEdition("Edition2", 50);
            const addressContractBox = await manager.connect(owner).getMysteryBoxes();
            const addressContractKey = await manager.connect(owner).getMysteryKeys();
            //
            const contractBox = await ethers.getContractAt(
                "MysteryBox",
                addressContractBox[0]
            );
            const contractKey = await ethers.getContractAt(
                "MysteryKey",
                addressContractKey[0]
            );
            // giving allowance
            await token1.approve(addReward.address, amount);
            await token2.approve(addReward.address, amount);
            await nftInsideBox.approve(addReward.address, 0);
            await contractKey.approve(contractBox.address, 0);
            // adding tokens to mystery box contract
            await addReward.connect(owner).addReward(false,token1.address,addressContractBox[0],amount);
            await addReward.connect(owner).addReward(false,token2.address,addressContractBox[0],amount);
            await addReward.connect(owner).addReward(true, nftInsideBox.address,addressContractBox[0],0);
            //
            const tx = opener.connect(owner).openBox(addressContractBox[0],token2.address, 0);
            expect(tx).to.be.revertedWith(
                'wrong key contract address'
            );
        });
        it("Should open a box, transfer associated key and rewards", async function(){

            const {owner,other,nftInsideBox, token1, token2, manager,opener, addReward} = await loadFixture(DeployFixture);
            
            const amount = 100;
            // Mint token 1 & 2 for Mystery Box Edition 1s
            await token1.mint(owner.address, amount);
            await token2.mint(owner.address, amount);
            // Mint 1 NFT for Mystery Box Edition 1
            await nftInsideBox.safeMint(owner.address,'QmPckj4thDT8juCdj7J9b3rZBJHJeBNBfkAKYrVG67q3mA');
            // creating edition from manager contract
            await manager.connect(owner).createEdition("Edition2", 50);
            const addressContractBox = await manager.connect(owner).getMysteryBoxes();
            const addressContractKey = await manager.connect(owner).getMysteryKeys();
            //
            const contractBox = await ethers.getContractAt(
                "MysteryBox",
                addressContractBox[0]
            );
            const contractKey = await ethers.getContractAt(
                "MysteryKey",
                addressContractKey[0]
            );
            // giving allowance
            await token1.approve(addReward.address, amount);
            await token2.approve(addReward.address, amount);
            await nftInsideBox.approve(addReward.address, 0);
            await contractKey.approve(contractBox.address, 0);
            // adding tokens to mystery box contract
            await addReward.connect(owner).addReward(false,token1.address,addressContractBox[0],amount);
            await addReward.connect(owner).addReward(false,token2.address,addressContractBox[0],amount);
            await addReward.connect(owner).addReward(true, nftInsideBox.address,addressContractBox[0],0);
            //
            const Token1Balance = await token1.balanceOf(owner.address);
            const Token2Balance = await token2.balanceOf(owner.address);
            const tx = await opener.connect(owner).openBox(addressContractBox[0],addressContractKey[0], 0);
            const receipt = await tx.wait();
            //
            const eventNFTRewards = receipt.events?.some(e => e.event === 'LogNFTReward');
            const eventTokenRewards = receipt.events?.some(e => e.event === 'LogTokenReward');
            const eventNoTokenReward = receipt.events?.some(e => e.event === 'LogNoTokenReward');
            const eventNoNFTReward = receipt.events?.find(e => e.event === 'LogNoNFTReward');
            const keyAmount= await manager.connect(owner).getKeyAmount(addressContractKey[0]);
            //
            const newToken1Balance = await token1.balanceOf(owner.address);
            const newToken2Balance = await token2.balanceOf(owner.address);
            const newNFTBalance = await nftInsideBox.balanceOf(owner.address);
            //tests
            expect(keyAmount).to.equal(49);
            if(eventNFTRewards){
                expect(newNFTBalance).to.equal(1);
            }
            if(eventNoNFTReward){
                expect(newNFTBalance).to.equal(0);
            }
            if(eventNoTokenReward){
                expect(newToken1Balance).to.equal(Token1Balance);
                expect(newToken2Balance).to.equal(Token2Balance);
            }
            if(eventTokenRewards){
                const totalBalance = Token1Balance.toNumber() + Token2Balance.toNumber();
                const newtotalBalance = newToken1Balance.toNumber() + newToken2Balance.toNumber();
                expect(totalBalance).to.not.equal(newtotalBalance);
            }
        });
        it("Should open 50 boxes", async function(){

            const {owner,nftInsideBox, token1, token2, manager,opener, addReward} = await loadFixture(DeployFixture);
            
            const amount = 100;
            // Mint token 1 & 2 for Mystery Box Edition 1s
            await token1.mint(owner.address, amount);
            await token2.mint(owner.address, amount);
            // Mint 1 NFT for Mystery Box Edition 1
            await nftInsideBox.safeMint(owner.address,'QmPckj4thDT8juCdj7J9b3rZBJHJeBNBfkAKYrVG67q3mA');
            // creating edition from manager contract
            await manager.connect(owner).createEdition("Edition2", 50);
            const addressContractBox = await manager.connect(owner).getMysteryBoxes();
            const addressContractKey = await manager.connect(owner).getMysteryKeys();
            //
            const contractBox = await ethers.getContractAt(
                "MysteryBox",
                addressContractBox[0]
            );
            const contractKey = await ethers.getContractAt(
                "MysteryKey",
                addressContractKey[0]
            );
            // giving allowance
            await token1.approve(addReward.address, amount);
            await token2.approve(addReward.address, amount);
            await nftInsideBox.approve(addReward.address, 0);
            await contractKey.approve(contractBox.address, 0);
            // adding tokens to mystery box contract
            await addReward.connect(owner).addReward(false,token1.address,addressContractBox[0],amount);
            await addReward.connect(owner).addReward(false,token2.address,addressContractBox[0],amount);
            await addReward.connect(owner).addReward(true, nftInsideBox.address,addressContractBox[0],0);
            //
            const tx = await opener.connect(owner).openBox(addressContractBox[0],addressContractKey[0], 0);
            const receipt = await tx.wait();
            //
            for(let i=1;i <50;i++){
                await contractKey.approve(contractBox.address, i);
                await opener.connect(owner).openBox(addressContractBox[0],addressContractKey[0], i);
                console.log("token1 :" + await token1.balanceOf(owner.address));
                console.log("token2 :" + await token2.balanceOf(owner.address));
                console.log("NFTs :" + await contractKey.balanceOf(owner.address));
                console.log("-------------------------");
                
            }
            const keyAmount= await manager.connect(owner).getKeyAmount(addressContractKey[0]);
            //testing number of remaining Keys
            expect(keyAmount).to.equal(0);
        });
    });


})



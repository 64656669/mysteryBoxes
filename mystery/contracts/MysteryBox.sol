// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

//import "@openzeppelin/contracts@4.9.0/access/Ownable.sol";

//IERC721Enumerable

contract MysteryBox is IERC721Receiver {

    using SafeMath for uint256;

    // events
    event Log(string func, uint gas);

    // variables
    string editionName; 
    uint quantity;
    address keyContract;
    uint nftRewardsCount;
    uint tokenRewardsCount;
    enum Type{
        NFT,
        TOKEN
    }
    //struct

    struct Reward {
        Type _type;
        uint256 _amount_id;
        bool _gived;
        address _address;
    }

    struct Box{
        bool initialized;
        bool opened;
        Reward[] _rewards;
    }

    // Array

    Reward[] rewardsPool;

    //mapping
    mapping (uint256 => Box) boxes;

    //constructor
    constructor(string memory _editionName, uint _quantity, address _keyContract) payable {
        editionName = _editionName;
        quantity = _quantity;
        keyContract = _keyContract;
    }

    // functions
    function getRewardsPool() public view returns (Reward[] memory allRewards){
        return rewardsPool;
    }

    function pushReward(Reward memory i) private{
        rewardsPool.push(i);
    }

    function addReward(bool _type, address addressContractReward, uint256 id_or_quantity) public{
        // bool == true => NFT // bool == false => token
        // test require allowance
        Reward memory newReward;

        if(_type == false){
            IERC20(addressContractReward).transferFrom(msg.sender, address(this), id_or_quantity);
            newReward._type = Type.TOKEN;
            ++tokenRewardsCount;
        } else{
            IERC721(addressContractReward).safeTransferFrom(msg.sender, address(this), id_or_quantity);
            newReward._type = Type.NFT;
            ++nftRewardsCount;
        }

        newReward._amount_id = id_or_quantity;
        newReward._address = addressContractReward;
        pushReward(newReward);
    }

    function random(uint256 modulo) private view returns (uint) {
        uint random = uint(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp)));
        return random % modulo;
    } 

    function tokenDistribution(uint amount, address _addressToken) private{

        Reward memory tokenReward;
        uint256 rate = SafeMath.add(40,random(20)); 
        uint256 targetdropCount = SafeMath.div(SafeMath.mul(quantity, rate), 100);
        uint256 ref = SafeMath.div(amount, targetdropCount);

        // Tokens distribution
        for (uint i = 1; i < targetdropCount; i++) {
            uint randomIndex = random(quantity); 
            while(boxes[randomIndex].initialized != false){ 
                randomIndex = random(quantity);
            }
            tokenReward._type = Type.TOKEN;
            tokenReward._amount_id = ref;
            tokenReward._address = _addressToken;

            boxes[randomIndex]._rewards.push(tokenReward);
            boxes[randomIndex].initialized = true;
        }
    }

    function nftDistribution(uint id, address _addressToken) private{
        Reward memory nftReward;
        uint randomIndex = random(quantity);

        nftReward._type = Type.NFT;
        nftReward._amount_id = id;
        nftReward._address = _addressToken;

        boxes[randomIndex]._rewards.push(nftReward);
        boxes[randomIndex].initialized = true;
    }

    function initBoxes() public{
        for (uint i = 0; i < rewardsPool.length; i++) {
            if(rewardsPool[i]._type == Type.TOKEN){
                tokenDistribution(rewardsPool[i]._amount_id,rewardsPool[i]._address);
            } else {
                nftDistribution(rewardsPool[i]._amount_id, rewardsPool[i]._address );
            }
        }        
    }

    function openBox(address keyAddress, uint256 keyID) public{
        // test de l'adress du contract liée à cette clé ID
        require(keyAddress == keyContract,
            "wrong key contract address"
        );
        // Key transfer
        IERC721(keyAddress).safeTransferFrom(msg.sender, address(this), keyID);
        //
        uint randomIndex = random(quantity);
        while(boxes[randomIndex].opened == true){
            randomIndex = random(quantity);
        }
        //transfer rewards
        if(boxes[randomIndex]._rewards.length == 0){
            // EMPTY BOX
        }else {
            for (uint i=0; i< boxes[randomIndex]._rewards.length ; i++) {

                address _address = boxes[randomIndex]._rewards[i]._address;

                if(boxes[randomIndex]._rewards[i]._type == Type.TOKEN){
                    IERC20(_address).transferFrom(address(this), msg.sender, boxes[randomIndex]._rewards[i]._amount_id);
                } else {
                    IERC721(_address).safeTransferFrom(address(this),msg.sender, boxes[randomIndex]._rewards[i]._amount_id);
                }
            }
        }
    }

    /**
     * Always returns `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
    
    /*
    // Fallback function must be declared as external.
    fallback() external payable {
        // send / transfer (forwards 2300 gas to this fallback function)
        // call (forwards all of the gas)
        emit Log("fallback", gasleft());
    }

    
    // Receive is a variant of fallback that is triggered when msg.data is empty
    receive() external payable {
        emit Log("receive", gasleft());
    }*/

}
import React, { useState, useContext } from 'react';
import {TokenTransferContext} from '../../Contexts/TokenTransferContext.js'
import { CONTRACT_ABI_ADDREWARD, CONTRACT_ADDRESS_ADDREWARD } from '../../config.js';
import { EthersContext } from '../../Contexts/EthersContext.js'

import './MysteryBoxDeployed.scss';

const ethers = require("ethers") ;

function MysteryBoxDeployed(props) {

    const [addRewardsButtonState, setaddRewardsButtonState] = useState(false);
    const [returnState, setreturnState] = useState(false);
    const {TokenState, setTokenState} = useContext(TokenTransferContext);
    const {EthersDetails} = useContext(EthersContext);
    const [Reward, setReward] = useState()
    //
    const addressContract = CONTRACT_ADDRESS_ADDREWARD;
    const abi = CONTRACT_ABI_ADDREWARD;
    const signer = EthersDetails.signer;
    //
    function onClickReward(){
        setaddRewardsButtonState(true);
        setreturnState(false);
    }   

    function onClickReturn(){
        setreturnState(true);
    } 

    function onChangeQuantity(e){
        setTokenState((prev) => {
            return{...prev, [e.target.name]:e.target.value}
        })
        console.log(TokenState);
    }

    function onChangeAddress(e){
        setTokenState((prev) => {
            return{...prev, [e.target.name]:e.target.value}
        })
        console.log(TokenState);
    } 
    
    async function onClickValidation(){
        //connexion au contract manager
        const abi_token = ["function approve(address _spender, uint256 _value) public returns (bool success)","function decimals() view returns (uint8)"];

        const _contract = new ethers.Contract(addressContract, abi , signer);
        const _token = new ethers.Contract(TokenState.token_address, abi_token , signer);
        //
        if(Reward == "nft"){
            await _contract.addReward(true,TokenState.token_address,props.addressBox,TokenState.quantity);
        }
        if(Reward == "matic"){
            await _contract.addReward(false,props.addressBox,props.addressBox,TokenState.quantity);
        }
        if(Reward == "erc20"){
            const decimals = await _token.decimals();
            console.log(decimals, TokenState.quantity);
            const finalAmount = BigInt((10**decimals)*TokenState.quantity)
            
            await _token.approve(_contract.address, finalAmount);
            await _contract.addReward(false,TokenState.token_address,props.addressBox,finalAmount,{gasLimit:300000});
        }
    }

    function onChangeSelect(e){
        setReward(e.target.value);
        console.log(Reward);
    }

    return(
        <div class="contract-deployed">
            { addRewardsButtonState && !returnState
                ?   <div> 
                        <div>  
                            <h5 className="modal-title"> ADD REWARDS TO THIS EDITION</h5>
                            <p>Enter the needed information to transfer the tokens from your wallet to the MysteryBox contract address.</p>
                        </div>
                        <div className="modal-body">
                        <select onChange={onChangeSelect}>
                            <option value="erc20"selected>Token (ERC-20)</option>
                            <option value="matic" disabled>Matic (soon available)</option>
                            <option value="nft">NFT (ERC-721)</option>
                        </select>
                        </div>
                        <div className="modal-body">
                            <form id="inputs">
                                <div className="form-group mx-2 mb-3">
                                    <label for="firstname">Enter the token address you want to transfer</label>
                                    <input type="text" className="form-control" name="token_address" onChange={onChangeAddress}/>
                                </div>
                                <div className="form-group mx-2">
                                    <label for="lastname">Enter the amount to transfer (or ID if NFT)</label>
                                    <input type="text" className="form-control" name="quantity" onChange={onChangeQuantity}/>
                                </div>
                            </form>
                        </div>  
                        <button onClick={() => onClickReturn()}>return</button>
                        <div className="modal-footer justify text-14">
                            <button id="submit" type="submit" className="btn btn-primary" onClick={() => onClickValidation()}>Submit</button>
                        </div>
                    </div>
                :   <div>
                        <div>
                            <h5>Contracts Deployment</h5>
                            <h4>1/ Mystery Box</h4>
                            <p>For each new Mystery Box Edition, a new contract is deployed. You can access the contract from the link below.</p>
                            <a href={"https://mumbai.polygonscan.com/address/"+props.addressBox} target="_blank"> {props.addressBox} </a>
                        </div>
                        <br></br><br></br>
                        <div>
                            <div>
                                <h4>2/ Mystery Keys</h4>
                                <p>All mystery keys have been minted. You can access the associated ERC 721 contract from the link below.</p>
                                <a href={"https://mumbai.polygonscan.com/address/"+props.addressKey} target="_blank"> {props.addressKey} </a>
                            </div>
                            <div>
                                <p>The mystery keys have been sent to your wallet. You can check this on Opensea with the link bellow</p>
                                <a href={"https://testnets.opensea.io/fr/"+props.addressTo+"/activity"} target="_blank"> OpenSea </a>
                            </div>
                            <br></br><br></br>
                            <div>
                                <button onClick={() => onClickReward()}>Add Rewards</button>
                            </div>
                        </div>
                        </div>
            }
        </div>
    );
}

export default MysteryBoxDeployed;
import React, { useState, useContext, useEffect } from 'react';
import { OpenEditionBtnContext } from '../../Contexts/OpenEditionBtnContext.js'
import { MysteryBoxListContext } from '../../Contexts/MysteryBoxListContext.js'
import {CONTRACT_ADDRESS_MANAGER, CONTRACT_ABI_MANAGER,CONTRACT_ADDRESS_OPENER, CONTRACT_ABI_OPENER, CONTRACT_ABI_KEY, CONTRACT_ABI_BOX} from '../../config.js'
import { EthersContext } from '../../Contexts/EthersContext.js'
import { KeysOwnedContext } from '../../Contexts/KeysOwnedContext.js'
import Modal from '../Modal/Modal.js';
import Loading from '../Loading/Loading.js';

import './Open.scss';

const ethers = require("ethers") ;

function Open() {

    //context
    const {OpenEditionButtonState} = useContext(OpenEditionBtnContext);
    const {mysteryBoxList} = useContext(MysteryBoxListContext);
    const {mysteryKeyList} = useContext(MysteryBoxListContext);
    // State
    const [keyAmount, setkeyAmount] = useState(0);
    const [selectedBoxAddress,setselectedBoxAddress] = useState();
    const [selectedKeyAddress,setselectedKeyAddress] = useState();
    const [selectedKeyID, setselectedKeyID] = useState();
    //
    const {EthersDetails} = useContext(EthersContext);
    const addressContractManager = CONTRACT_ADDRESS_MANAGER;
    const abi_manager = CONTRACT_ABI_MANAGER;
    const addressContractOpener = CONTRACT_ADDRESS_OPENER;
    const abi_opener = CONTRACT_ABI_OPENER;
    const signer = EthersDetails.signer;
    const abi_key = CONTRACT_ABI_KEY;
    const abi_box = CONTRACT_ABI_BOX;

    // functions

    useEffect(()=>{
        if(!mysteryBoxList) return;
        setselectedBoxAddress(mysteryBoxList[0]);
    },[mysteryBoxList])
    
    
    useEffect(()=>{
        if(!selectedKeyAddress) return;
        checkKeys();
    },[selectedKeyAddress])
    

    function onChangeBoxSelect(e){
        setselectedBoxAddress(e.target.value);
    }

    function onChangeKeySelect(e){
        setselectedKeyAddress(e.target.value);
    }


    async function checkKeys(){
        console.log(selectedBoxAddress);
        const _contract = new ethers.Contract(addressContractManager, abi_manager , signer);
        setkeyAmount(await _contract.getKeyAmount(selectedKeyAddress));
        console.log("ici"+keyAmount)
        
    }

    async function checkKeyIDs(){
        //approval
        const _contractBox = new ethers.Contract(selectedBoxAddress, abi_box , signer);
        const _Key = new ethers.Contract(selectedKeyAddress, abi_key , signer);
        await _Key.approve(_contractBox.address, selectedKeyID);
        //opening
        const _contractOpener = new ethers.Contract(addressContractOpener, abi_opener , signer);
        await _contractOpener.openBox(selectedBoxAddress,selectedKeyAddress,selectedKeyID,{gasLimit:300000});
    }

    function onChangeID(e){
        setselectedKeyID(e.target.value);
        console.log(selectedKeyID);
    }

    if (!OpenEditionButtonState) return null;

    const getContent = () => {
        return(
            <div className="modal-content shadow">
                <div className="modal-header">
                    <h5 className="modal-title"> OPEN A MYSTERY BOX WITH A KEY</h5>
                    <p>Select the right Mystery smart contract associated to your Mystery Key</p>
                </div>
                <div className="modal-body bg-image">
                    <p>Mystery Box contracts</p>
                    <select onChange={onChangeBoxSelect}>
                        {
                            mysteryBoxList.map(opt => <option>{opt}</option>)
                        }
                    </select>
                    <p>Mystery Keys contracts</p>
                    <select onChange={onChangeKeySelect}>
                        {
                            mysteryKeyList.map(opt => <option>{opt}</option>)
                        }
                    </select>
                    <p> You own : <span>{keyAmount.toString()}</span> Mystery Keys</p>
                    <form id="inputs">
                            <div className="form-group mx-2">
                                <label for="lastname">Enter the ID of the key you want to use</label>
                                <input type="text" className="form-control" name="quantity" onChange={onChangeID}/>
                            </div>
                        </form>
                    <button onClick={()=> checkKeyIDs()}>CHECK MY KEY(S)</button>
                </div>
            </div>
        );
    }

    return (
        <Modal 
            content={ getContent() }
            isOpen={ true }
            classes="open-mystery"
            isLoading={ false }
        />
    );
    
}

export default Open;
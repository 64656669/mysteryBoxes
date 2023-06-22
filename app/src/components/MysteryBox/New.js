//import './newEdition.css';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EthersContext } from '../../Contexts/EthersContext.js'
import {CONTRACT_ADDRESS_MANAGER, CONTRACT_ABI_MANAGER} from '../../config.js'
import { NewMysteryBoxContext } from '../../Contexts/NewMysteryBoxContext.js'
import { MysteryEditionContext } from '../../Contexts/MysteryEditionContext.js'
import Loading from '../Loading/Loading.js'
import Deployed from './Deployed.js'
import Modal from '../Modal/Modal.js';

import './New.scss';


const ethers = require("ethers") ;

function  New(){    
    const navigate = useNavigate();
    //context
    const {MysteryButtonState} = useContext(NewMysteryBoxContext);
    const {MysteryEditionState,setMysteryEditionState} = useContext(MysteryEditionContext);
    const {EthersDetails} = useContext(EthersContext);
    //state
    const [isLoading, setIsLoading] = useState(false);
    const [isMysteryBoxDeployed, setisMysteryBoxDeployed] = useState(false);
    const [isMysteryKeyDeployed, setisMysteryKeyDeployed] = useState(false);
    const [AddressContractBox, setAddressContractBox] = useState({});
    const [AddressContractKey, setAddressContractKey] = useState({});
    const [AddressReceiver, setAddressReceiver] = useState({});
    //
    const addressContractManager = CONTRACT_ADDRESS_MANAGER;
    const abi = CONTRACT_ABI_MANAGER;
    const signer = EthersDetails.signer;

    useEffect(() => {
        if(!isMysteryBoxDeployed || !isMysteryKeyDeployed) return;
        navigate(`/${AddressContractBox}/${AddressContractKey}`);
    }, [isMysteryBoxDeployed, isMysteryKeyDeployed]);

    function onChangeQuantity(e){
        setMysteryEditionState((prev) => {
            return{...prev, [e.target.name]:e.target.value}
        })
        //console.log(MysteryEditionState);
    }

    function onChangeEdition(e){
        setMysteryEditionState((prev) => {
            return{...prev, [e.target.name]:e.target.value}
        })
        //console.log(MysteryEditionState);
    }   

    async function onClickValidation(){
        //connexion au contract manager
        const _contract = new ethers.Contract(addressContractManager, abi , signer);
        // listeners
        _contract.on("LogAddressBox", (address, event)=>{
            let LogAddressEvent ={
                address: address,
                eventData: event,
            }
            setAddressContractBox(LogAddressEvent.address);
            console.log(JSON.stringify(LogAddressEvent, null, 2));
            //setIsLoading(false);
            setisMysteryBoxDeployed(true);
        })
        _contract.on("LogAddressKey", (address, event)=>{
            let LogAddressEvent ={
                address: address,
                eventData: event,
            }
            setAddressContractKey(LogAddressEvent.address);
            console.log(JSON.stringify(LogAddressEvent, null, 2));
            setIsLoading(false);
            setisMysteryKeyDeployed(true);
        })
        _contract.on("LogAddressReceiver", (address, event)=>{
            let LogAddressEvent ={
                address: address,
                eventData: event,
            }
            setAddressReceiver(LogAddressEvent.address);
        })
        //création d'une nouvelle édition de mystery box
        //console.log("---------" + MysteryEditionState.editionName);
        //console.log("---------" + MysteryEditionState.quantity);
        await _contract.createEdition(MysteryEditionState.editionName,MysteryEditionState.quantity);
        //loading
        setIsLoading(true);
        //---------------------------------------------------

    }

    const getContent = () => {
        return (
            <div className="modal-content shadow">
                <div className="modal-header">
                    <h5 className="modal-title"> CREATE YOUR MYSTERY BOX</h5>
                    <p>Enter the needed information to generate a new Mystery Box edition, with associated Mystery Keys. Each Key is a NFT that will be sent to your wallet.</p>
                </div>
                <div className="modal-body bg-image">
                    <form id="inputs">
                        <div className="form-group mx-2 mb-3">
                            <label for="firstname">Edition Name</label>
                            <input type="text" className="form-control" name="editionName" onChange={onChangeEdition}/>
                        </div>
                        <div className="form-group mx-2">
                            <label for="lastname">Quantity of keys</label>
                            <input type="text" className="form-control" name="quantity" onChange={onChangeQuantity}/>
                        </div>
                    </form>
                </div>  
                <div className="modal-footer justify text-14">
                    <button id="submit" type="submit" className="btn btn-primary" onClick={() => onClickValidation()}>Submit</button>
                </div>
            </div>
        );
    }

    if (!MysteryButtonState) return null;
    
    return(
        <Modal 
            content={ getContent() }
            isOpen={ true }
            classes="new-mystery"
            isLoading={ isLoading }
        />
    )
}

export default New;



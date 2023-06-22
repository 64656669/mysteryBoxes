import './Menu.scss';
import React from 'react'
import {useState, useContext} from "react";
import { ConnectWalletContext } from '../../Contexts/ConnectWalletContext.js'
import { EthersContext } from '../../Contexts/EthersContext.js'
import TwitterLogo from '../../styles/svg/TwitterLogo';
import DiscordLogo from '../../styles/svg/DiscordLogo';
import OpenseaLogo from '../../styles/svg/OpenseaLogo';
//import {ethers} from "ethers";
const ethers = require("ethers") 



function Menu(){

    const {ConnectState,setConnectState} = useContext(ConnectWalletContext);
    const {setEthersDetails} = useContext(EthersContext);
    const [signerAddress,setsignerAddress] = useState("");

    async function connectWallet(){
        if(typeof window.ethereum != "undefined"){
            console.log("Metamask installed");
            const Provider = new ethers.providers.Web3Provider(window.ethereum, "any")
            await Provider.send("eth_requestAccounts", []);
            const Signer = Provider.getSigner();
            //-------           
            setEthersDetails({
                provider: Provider,
                signer: Signer
            })
            //-------
            setsignerAddress(await Signer.getAddress());
            console.log("Account:", signerAddress);
            setConnectState(!ConnectState);
        }
    }
    
    return(
        <nav className ="menu">
            <div className='title'>BoX</div>
            <div className='social-links'>
                <a href="" target="_blank" className='twitter' ><TwitterLogo /></a>
                <a href="" target="_blank" className='discord'><DiscordLogo /></a>
                <a href="" target="_blank" className='opensea'><OpenseaLogo /></a>
            </div>
            <div className="connect-button">
            {ConnectState 
                ? <div className='signer'>{signerAddress}</div>
                :   <button onClick={() => connectWallet()}>
                        <span className="line"></span>
                            Connect Wallet
                    </button>                   
                } 
            </div>
        </nav>

    );
}
export default Menu;
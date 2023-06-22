import {useState} from "react";
import { Outlet } from "react-router-dom";
import { ConnectWalletContext } from '../../Contexts/ConnectWalletContext.js'
import { EthersContext } from '../../Contexts/EthersContext.js'
import { NewMysteryBoxContext } from '../../Contexts/NewMysteryBoxContext.js'
import { MysteryEditionContext } from '../../Contexts/MysteryEditionContext.js'
import { OpenEditionBtnContext } from '../../Contexts/OpenEditionBtnContext.js'
import { MysteryBoxListContext } from '../../Contexts/MysteryBoxListContext.js'
import { KeysOwnedContext } from '../../Contexts/KeysOwnedContext.js'
import {TokenTransferContext} from '../../Contexts/TokenTransferContext.js'


import './App.scss';

const ethers = require("ethers");


function App() {
  const [KeysList, setKeysList] = useState([]);
  const [OpenEditionButtonState, setOpenEditionButtonState] = useState(false);
  const [mysteryBoxList,setmysteryBoxList] = useState([]);
  const [mysteryKeyList,setmysteryKeyList] = useState([]);
  const [ConnectState, setConnectState] = useState(false);
  const [MysteryButtonState, setMysteryButtonState] = useState(false);
  const [TokenState, setTokenState] = useState({
    token_address: "",
    quantity: 0,
  });
  const [MysteryEditionState, setMysteryEditionState] = useState({
    editionName: "",
    quantity: 0,
    validation: false,
  });

  const [EthersDetails, setEthersDetails] = useState({
    provider: {},
    signer: {},
  });

  return (
    <ConnectWalletContext.Provider value={{ConnectState,setConnectState}}>
      <EthersContext.Provider value={{EthersDetails,setEthersDetails}}>
        <NewMysteryBoxContext.Provider value={{MysteryButtonState,setMysteryButtonState}}>
          <MysteryEditionContext.Provider value={{MysteryEditionState,setMysteryEditionState}}>
            <OpenEditionBtnContext.Provider value={{OpenEditionButtonState,setOpenEditionButtonState}}>
              <MysteryBoxListContext.Provider value={{mysteryBoxList,setmysteryBoxList,mysteryKeyList,setmysteryKeyList}}>
                <KeysOwnedContext.Provider value={{KeysList, setKeysList}}>
                  <TokenTransferContext.Provider value={{TokenState, setTokenState}}>
                    <Outlet />
                  </TokenTransferContext.Provider>
                </KeysOwnedContext.Provider>
              </MysteryBoxListContext.Provider>
            </OpenEditionBtnContext.Provider>
          </MysteryEditionContext.Provider>
        </NewMysteryBoxContext.Provider>
      </EthersContext.Provider>
    </ConnectWalletContext.Provider>
  );
}

export default App;

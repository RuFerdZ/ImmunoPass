import React, { useEffect } from 'react';
import { getPhantomWallet, getSolflareWallet, getSolletWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { network } from '../../config';
import PassportHolderDashboard from './PassportHolderDashboard';
import { useNavigate } from 'react-router';
import {Link} from "react-router-dom";

const wallets = [
  getPhantomWallet(),
  getSolflareWallet(),
  getSolletWallet()
]

export  function PassportHolderLogin() {

  const wallet = useWallet();
  const navigate = useNavigate();

  if (!wallet.connected) {
    return (
      <div className="main-center-container text-center">
        <div className='primary-text'>
          Passport Holder
        </div>
        <div className='secondary-text mt-5'>
          Login to Continue
        </div>
        <div className='inline-flex-default'>
          <div className="button-secondary mt-3 mr-2"
                  onClick={() => navigate(-1)}
              >back
          </div>
          <div className="wallet-container mt-3">
              <WalletMultiButton />
          </div>
        </div>
          <div className='secondary-text mt-5'>
              Register Passport Profile
              <div className="reg-button-wrap">
                  <Link to="/passport-holder/register-update">
                      <div className="reg-button button-secondary mt-3 mr-2" >Click here</div>
                  </Link>
              </div>

          </div>
      </div>
    )
  }else{
    return (
      <>
        <PassportHolderDashboard />
      </>
    )
  }
}


export default function WalletConnection() {
  return (
    <ConnectionProvider endpoint={network.local}>
        <WalletProvider wallets={wallets}>
            <WalletModalProvider>
                <PassportHolderLogin />        
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>   
  ); 
}


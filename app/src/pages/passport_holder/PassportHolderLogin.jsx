import React, { useEffect } from 'react';
import { getPhantomWallet, getSolflareWallet, getSolletWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { network } from '../../config';
import PassportHolderDashboard from './PassportHolderDashboard';
import { useNavigate } from 'react-router';

const wallets = [
  getPhantomWallet(),
  getSolflareWallet(),
  getSolletWallet()
]

export  function PassportHolderLogin() {

  const wallet = useWallet();
  const navigate = useNavigate();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (wallet.connected) {
  //     navigate('/passport-holder/dashboard')
  //   }
  // },[wallet.connected]);

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


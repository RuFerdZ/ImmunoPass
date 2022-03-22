import React from 'react';
import { getPhantomWallet, getSolflareWallet, getSolletWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { network } from '../../config';
import PassportHolderDashboard from './PassportHolderDashboard';
import { Switch, Route, Redirect } from 'react-router-dom';


const wallets = [
  getPhantomWallet(),
  getSolflareWallet(),
  getSolletWallet()
]

export  function PassportHolderLogin() {

  const wallet = useWallet();

  if (!wallet.connected) {
    return (
      <div className="main-center-container">
        <div>
            Passport Holder Login To Continue
        </div>
        <div className="wallet-container">
            <WalletMultiButton />
        </div>
    </div>
    )
  } else {
    return (
      <PassportHolderDashboard />
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


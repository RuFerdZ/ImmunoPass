import React from 'react';

import { getPhantomWallet, getSolflareWallet, getSolletWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { network } from '../../config';
import VaccinationCampDashboard from './VaccinationCampDashboard';

const wallets = [
  getPhantomWallet(),
  getSolflareWallet(),
  getSolletWallet()
]

export function VaccinationCampLogin() {

  const wallet = useWallet();

  if (!wallet.connected) {
    return (
      <div className="main-center-container">
        <div>
            Vaccination Camp Login To Continue
        </div>
        <div className="wallet-container">
            <WalletMultiButton />
        </div>
    </div>
    )
  } else {
    return (
      <VaccinationCampDashboard />
    )
  }
}


export default function WalletConnection() {
  return (
    <ConnectionProvider endpoint={network.local}>
        <WalletProvider wallets={wallets}>
            <WalletModalProvider>
                <VaccinationCampDashboard />        
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>   
  ); 
}


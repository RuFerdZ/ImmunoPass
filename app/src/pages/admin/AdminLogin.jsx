import React, { useEffect } from 'react';
import { getPhantomWallet, getSolflareWallet, getSolletWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNavigate } from "react-router-dom";
import { network } from '../../config';
import AdminDashboard from './AdminDashboard';


const wallets = [
  getPhantomWallet(),
  getSolflareWallet(),
  getSolletWallet()
]

export function AdminLogin() {

  const wallet = useWallet();
  const navigate = useNavigate();

  if (!wallet.connected) {
    return (
      <div className="main-center-container text-center">
        <div className='primary-text'>
          Admin
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
  } else {
    return (
        <AdminDashboard />
    )
  }
}


export default function WalletConnection() {
  return (
    <ConnectionProvider endpoint={network.local}>
        <WalletProvider wallets={wallets}>
            <WalletModalProvider>
                <AdminLogin />        
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>   
  ); 
}


import React,  { useEffect } from 'react';
import { getPhantomWallet, getSolflareWallet, getSolletWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { network } from '../../config';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from '../admin/AdminDashboard';
import { useNavigate } from 'react-router';

const wallets = [
  getPhantomWallet(),
  getSolflareWallet(),
  getSolletWallet()
]

export function DoctorLogin() {

  const wallet = useWallet();
  const navigate = useNavigate();

  if (!wallet.connected) {
    return (
      <div className="main-center-container text-center">
        <div className='primary-text'>
          Doctor
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
      // <AdminDashboard />
      <DoctorDashboard wallet={wallet} />
    )
  }
}


export default function WalletConnection() {
  return (
    <ConnectionProvider endpoint={network.local}>
        <WalletProvider wallets={wallets}>
            <WalletModalProvider>
                <DoctorLogin />        
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>   
  ); 
}


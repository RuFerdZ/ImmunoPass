import { PublicKey } from '@solana/web3.js';
import idl from './idl.json';

export const workspace = {
    programID: new PublicKey(idl.metadata.address),
    programIdl: idl
}

export const network = {
    local: "http://127.0.0.1:8899",
    testnet: "https://testnet.solana.com",
    mainnet: "https://mainnet.solana.com",
    devnet: "https://devnet.solana.com"
}

export const opts = {
    preflightCommitment: "processed"
}
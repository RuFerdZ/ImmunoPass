import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useEffect, useState } from 'react';
import { getVaccinationRecordByPubkey, getPassportHolderByNIC, getValidationRecordsOfRecord, getPassportHolderByPubKey } from '../../api'
import { PublicKey } from '@solana/web3.js';
import { useNavigate } from 'react-router';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {publicKey} from "@project-serum/anchor/dist/cjs/utils";

export default function ValidationDashboard(){

    const navigate = useNavigate();
    const wallet = useWallet();

    const [patient, setPatient] = useState({});

    const [pubkey, setPubkey] = useState('');
    const [vaccination, setVaccination] = useState('');
    const [validationRecords, setValidationRecords] = useState('');

    const loadVaccinationRecord = async () => {

        let vacc = await getVaccinationRecordByPubkey(wallet,new PublicKey(pubkey))
        console.log(vacc)
    }

    const getDateFormatted = (timestamp) => {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', options);
    }

    return (
        <div className='doc-dashboard'>
            <div className='doc-dashboard-header'>

                <h1 className='primary-text black-color pt-3 pb-2 text-uppercase text-center'>Validate Vaccination</h1>
                <div className="button-secondary back-btn"
                     onClick={() => navigate(-1)}
                >back
                </div>

            </div>

            <div className='doc-dashboard-body'>
                <div className="box-container white-color px-4">
                    <div className="main-box mr-3">
                        <div className="light-black-card-md py-3 px-5 pb-4">
                            <div className="secondary-text text-uppercase text-center mt-3 mb-4">
                                Vaccination Data
                            </div>
                            <form onSubmit={loadVaccinationRecord}>
                                <label className="">Vaccination Public Key:</label>
                                <div className="form-group row">
                                    <div className="col-sm-12">
                                        <input className="form-control"
                                               type="text" name="pubkey"
                                               placeholder="Enter Vaccination Public Key"
                                               value={pubkey}
                                               onChange={e => setPubkey(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button className="button-secondary-reverse text-bold" type='submit'>Load Vaccination</button>
                            </form>
                            <div className="secondary-text text-uppercase my-4">Vaccination Information</div>
                            <div className="mt-3" style={{wordBreak:"break-all"}}><span className="text-bold mr-2">Vaccine: </span>
                                {vaccination.vaccine}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Batch Number: </span>
                                {vaccination.batchNumber}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Dosage: </span>
                                {vaccination.dosage}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Status: </span>
                                {vaccination.status}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Notes: </span>
                                {vaccination.notes}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Age: </span>
                                {vaccination.age}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Weight: </span>
                                {vaccination.weight}
                            </div>
                        </div>
                    </div>

                    <div className="main-box mr-3">
                        <div className="light-black-card-md py-3 px-5 pb-4">

                            <div className="secondary-text text-uppercase my-4">Patient Information</div>
                            <div className="mt-3" style={{wordBreak:"break-all"}}><span className="text-bold mr-2">Vaccine: </span>
                                {vaccination.vaccine}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Batch Number: </span>
                                {vaccination.batchNumber}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Dosage: </span>
                                {vaccination.dosage}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Status: </span>
                                {vaccination.status}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Notes: </span>
                                {vaccination.notes}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Age: </span>
                                {vaccination.age}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Weight: </span>
                                {vaccination.weight}
                            </div>
                        </div>
                    </div>

                    <div className="main-box mr-3">
                        <div className="light-black-card-md py-3 px-5 pb-4">

                            <div className="secondary-text text-uppercase my-4">Doctor Information</div>
                            <div className="mt-3" style={{wordBreak:"break-all"}}><span className="text-bold mr-2">Vaccine: </span>
                                {vaccination.vaccine}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Batch Number: </span>
                                {vaccination.batchNumber}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Dosage: </span>
                                {vaccination.dosage}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Status: </span>
                                {vaccination.status}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Notes: </span>
                                {vaccination.notes}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Age: </span>
                                {vaccination.age}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Weight: </span>
                                {vaccination.weight}
                            </div>
                        </div>
                    </div>

                    <div className="main-box mr-3">
                        <div className="light-black-card-md py-3 px-5 pb-4">


                            <div className="secondary-text text-uppercase my-4">Vaccination Camp Information</div>
                            <div className="mt-3" style={{wordBreak:"break-all"}}><span className="text-bold mr-2">Vaccine: </span>
                                {vaccination.vaccine}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Batch Number: </span>
                                {vaccination.batchNumber}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Dosage: </span>
                                {vaccination.dosage}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Status: </span>
                                {vaccination.status}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Notes: </span>
                                {vaccination.notes}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Age: </span>
                                {vaccination.age}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Weight: </span>
                                {vaccination.weight}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
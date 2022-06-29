import React from 'react';

import { useEffect, useState } from 'react';
import {
    getVaccinationRecordByPubkey,
    getValidationRecordsOfRecord,
    getPassportHolderByPubKey,
    getVaccinationByBatchNumber,
    getPassportHolderByWalletAddress,
    getVaccinationCampByPubKey,
    getDoctorByPubKey,
    getDoctorByWalletAddress, getVaccinationCampByWalletAddress
} from '../../api'
import { PublicKey } from '@solana/web3.js';
import { useNavigate } from 'react-router';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {publicKey} from "@project-serum/anchor/dist/cjs/utils";

export default function ValidationDashboard(){

    const navigate = useNavigate();
    const wallet = useWallet();

    const [passportHolder, setPassportHolder] = useState({});
    const [vaccinationCamp,setVaccinationCamp] = useState({})
    const [doctor, setDoctor] = useState({})

    const [batchNumber, setBatchNumber] = useState('');
    const [vaccination, setVaccination] = useState('');
    const [validationRecords, setValidationRecords] = useState('');

    useEffect(() => {
        if (vaccination?.publicKey){
            loadDoctor(passportHolder?.account);
            loadPassportHolder(passportHolder?.account)
            loadVaccinationCamp(passportHolder?.account)
            loadValidationRecords(passportHolder?.publicKey)
        }
    },[vaccination])

    const loadVaccinationRecord = async (e) => {
        e.preventDefault();
        let vacc = await getVaccinationByBatchNumber(wallet, batchNumber)
        console.log("vaccine - ", vacc[0])

        setVaccination(vacc[0])
    }

    const loadPassportHolder = async (v) => {
        const ph = await getPassportHolderByWalletAddress(wallet, v?.passportHolder)
        console.log("ph = ", ph)
        setPassportHolder(ph)
    }

    const loadVaccinationCamp = async (v) => {
        const vc = await getVaccinationCampByWalletAddress(wallet, v?.vaccinationCamp)
        console.log("vc = ", vc)
        setVaccinationCamp(vc)
    }

    const loadDoctor = async (v) => {
        const doc = await getDoctorByWalletAddress(wallet, v?.doctor)
        console.log("doc = ", doc)
        setDoctor(doc)
    }

    const loadValidationRecords = async (v) => {
        const records = await getValidationRecordsOfRecord(wallet, v?.publicKey)
        setValidationRecords(records)
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
                                <label className="">Vaccination Batch Code:</label>
                                <div className="form-group row">
                                    <div className="col-sm-12">
                                        <input className="form-control"
                                               type="text" name="pubkey"
                                               placeholder="Enter Vaccination Batch number"
                                               value={batchNumber}
                                               onChange={e => setBatchNumber(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button className="button-secondary-reverse text-bold" type='submit'>Load Vaccination</button>
                            </form>
                            <div className="secondary-text text-uppercase my-4">Vaccination Information</div>
                            <div className="mt-3" style={{wordBreak:"break-all"}}><span className="text-bold mr-2">Date of Vaccination: </span>
                                {getDateFormatted(vaccination?.account?.createdDate)}
                            </div>
                            <div className="mt-3" style={{wordBreak:"break-all"}}><span className="text-bold mr-2">Vaccine: </span>
                                {vaccination?.account?.vaccine}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Batch Number: </span>
                                {vaccination?.account?.batchNumber}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Dosage: </span>
                                {vaccination?.account?.dosage}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Status: </span>
                                {vaccination?.account?.status}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Notes: </span>
                                {vaccination?.account?.notes}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Age: </span>
                                {(vaccination?.account?.age).toString()} years
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Weight: </span>
                                {vaccination?.account?.weight}
                            </div>
                        </div>
                    </div>

                    <div className="main-box mr-3">
                        <div className="light-black-card-md py-3 px-5 pb-4">

                            <div className="secondary-text text-uppercase my-4">Patient Information</div>
                            <div className="mt-3"><span className="text-bold mr-2">Name: </span>
                                {passportHolder?.account?.title}. {passportHolder?.account?.firstname} {passportHolder?.account?.lastname}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Date of Birth: </span>
                                {getDateFormatted(passportHolder?.account?.dateOfBirth)}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Gender: </span>
                                {passportHolder?.account?.gender}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">ID: </span>
                                {passportHolder?.account?.nic}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Phone: </span>
                                {passportHolder?.account?.phone}
                            </div>
                        </div>
                    </div>

                    <div className="main-box mr-3">
                        <div className="light-black-card-md py-3 px-5 pb-4">

                            <div className="secondary-text text-uppercase my-4">Doctor Information</div>
                            <div className="mt-3"><span className="text-bold mr-2">Name: </span>
                                Dr. {doctor?.account?.firstname} {doctor?.account?.lastname}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">License Number: </span>
                                {doctor?.account?.licenseNumber}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">License Expiry Date: </span>
                                {getDateFormatted(doctor?.account?.licenceExpiryDate)}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Qualifications: </span>
                                {doctor?.account?.qualifications}
                            </div>
                        </div>
                    </div>

                    <div className="main-box mr-3">
                        <div className="light-black-card-md py-3 px-5 pb-4">


                            <div className="secondary-text text-uppercase my-4">Vaccination Camp Information</div>
                            <div className="mt-3"><span className="text-bold mr-2">Name: </span>
                                {vaccinationCamp?.account?.name}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Registration Number: </span>
                                {vaccinationCamp?.account?.registrationNumber}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Phone: </span>
                                {vaccinationCamp?.account?.phone}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Address: </span>
                                {vaccinationCamp?.account?.address}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Email: </span>
                                {vaccinationCamp?.account?.email}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Website: </span>
                                {vaccinationCamp?.account?.website}
                            </div>
                            <div className="mt-3"><span className="text-bold mr-2">Active: </span>
                                {vaccinationCamp?.account?.isActive ? 'True' : 'False'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
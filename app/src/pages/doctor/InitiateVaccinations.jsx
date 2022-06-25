import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useEffect, useState } from 'react';
import { getPassportHolderByNIC, initiateVaccinationRecord, getVaccinationCampByRegistrationNumber } from '../../api'
import { PublicKey } from '@solana/web3.js';
import { useNavigate } from 'react-router';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function InitiateVaccinations(){

    const [patient, setPatient] = useState({});
    const [vaccinationCamp, setVaccinationCamp] = useState({});

    const [nic, setNIC] = useState('');
    const [pubkey, setPubkey] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');

    const [vaccine, setVaccine] = useState('');
    const [batch, setBatch] = useState('');
    const [dosage, setDosage] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');

    const [regNo, setRegNo] = useState('');
    const [vcName, setVCName] = useState('');
    const [vcPubKey, setVCPubkey] = useState('');
    const [vcAddress, setVCAddress] = useState('');

    const wallet = useWallet();
    const navigate = useNavigate();

    const loadPatient= async (e) => {
        e.preventDefault();
        const pat = await getPassportHolderByNIC(wallet, nic);
        if (pat==null){
            setPubkey("Not Found!")
            setFirstname("Not Found!")
            setLastname("Not Found!")
            setDateOfBirth("Not Found!")
            setGender("Not Found!")
        } else {
            await setPatient(pat)
            await setPatientData(pat?.account)
        }
    }

    const loadVaccinationCamp = async (e) => {
      e.preventDefault();
      console.log(wallet);
      const vc = await getVaccinationCampByRegistrationNumber(wallet, regNo)
      if (vc == null){
        setVCPubkey("Not Found!");
        setVCName("Not Found!");
        setVCAddress("Not Found!");
      }else{
        setVaccinationCamp(vc);
        console.log(vc);
        setVaccinationCampData(vc?.account);
      }
    }

    const setPatientData = async (ph) => {
        setPubkey(ph?.owner?.toBase58())
        setFirstname(ph.firstname)
        setLastname(ph.lastname)
        setDateOfBirth(ph.dateOfBirth)
        setGender(ph.gender)
    }

    const setVaccinationCampData = async (vc) => {
      setVCPubkey(vc?.owner?.toBase58());
      setVCName(vc?.name);
      setVCAddress(vc?.address);
    }

    const getDateFormatted = (timestamp) => {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', options);
    }

    const createVaccinationRecord = async (e) => {
        e.preventDefault();
        console.log(wallet);
        let vaccination = {
            vaccine: vaccine,
            notes: notes,
            age: age,
            weight: weight,
            dosage: dosage,
            batchNumber: batch,
            vaccinationCamp: vaccinationCamp.publicKey,
            passportHolder: patient.publicKey,
        }
        const record = await initiateVaccinationRecord(wallet, vaccination)
    } 



    return (
        <div className='doc-dashboard'>
        <div className='doc-dashboard-header'>
          <h1 className='primary-text black-color pt-3 pb-2 text-uppercase text-center'>Initiate Vaccination</h1>
        </div>
        
        <div className='doc-dashboard-body'>
          <div className="box-container white-color px-4">
            <div className="main-box mr-3">
              <div className="light-black-card-md py-3 px-5 pb-4">
                <div className="secondary-text text-uppercase text-center mt-3 mb-4">
                  Patient
                </div>
                <form onSubmit={loadPatient}>
                  <label className="">Patient ID Number:</label>
                  <div className="form-group row">
                    <div className="col-sm-12">
                        <input className="form-control" 
                          type="text" name="patient" 
                          placeholder="Enter Identification Number"
                          value={nic} 
                          onChange={e => setNIC(e.target.value)} 
                        />
                    </div>
                  </div>
                  <button className="button-secondary-reverse text-bold" type='submit'>Load Patient</button>
                </form>
                <div className="secondary-text text-center text-uppercase my-4">Patient Information</div>
                <div className="mt-3" style={{wordBreak:"break-all"}}><span className="text-bold mr-2">Public Key: </span>
                  {pubkey}
                </div>
                <div className="mt-3"><span className="text-bold mr-2">First Name: </span>
                  {firstname}
                </div>
                <div className="mt-3"><span className="text-bold mr-2">Last Name: </span>
                  {lastname}
                </div>
                <div className="mt-3"><span className="text-bold mr-2">Date of Birth: </span>
                  {getDateFormatted(dateOfBirth)}
                </div>
                <div className="mt-3"><span className="text-bold mr-2">Gender: </span>
                  {gender}
                </div>
              </div>
            </div>
            <div className="main-box mr-3">
              <div className="light-black-card-md py-3 px-5 pb-4">
                <div className="secondary-text text-uppercase text-center mt-3 mb-4">
                  Vaccination Camp
                </div>
                <form onSubmit={loadVaccinationCamp}>
                  <label className="">Registration Number:</label>
                  <div className="form-group row">
                    <div className="col-sm-12">
                        <input className="form-control" 
                          type="text" name="vaccine" 
                          placeholder="Enter Registration Number"
                          value={regNo} 
                          onChange={e => setRegNo(e.target.value)}
                        />
                    </div>
                  </div>
                  <button className="button-secondary-reverse text-bold" type='submit'>Load Vaccination Camp</button>
                </form>
                <div className="secondary-text text-center text-uppercase my-4">Vaccination Camp Information</div>
                <div className="mt-3" style={{wordBreak:"break-all"}}><span className="text-bold mr-2">Public Key: </span>
                  {vcPubKey}
                </div>
                <div className="mt-3"><span className="text-bold mr-2">Name: </span>
                  {vcName}
                </div>
                <div className="mt-3"><span className="text-bold mr-2">Address: </span>
                  {vcAddress}
                </div>
                <div className="text-center mt-4">
                  <WalletMultiButton />
                </div>
              </div>
            </div>
            <div className="main-box">
              <div className="light-black-card-md text-center py-3 px-5 p-3">
                <div className="secondary-text text-uppercase my-3">Vaccination</div>
                <form onSubmit={createVaccinationRecord}>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Vaccine:</label>
                    <div className="col-sm-9">
                        <input className="form-control" 
                        type="text" 
                        placeholder="Enter Vaccine" 
                        name="vaccine" 
                        onChange={e => setVaccine(e.target.value)} 
                        value={vaccine} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Batch:</label>
                    <div className="col-sm-9">
                        <input className="form-control" 
                        type="text" 
                        placeholder="Enter Batch Number" 
                        name="batchNumber" 
                        onChange={e => setBatch(e.target.value)} 
                        value={batch} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Dosage:</label>
                    <div className="col-sm-9">
                        <input className="form-control" 
                        type="text" 
                        placeholder="Enter Dosage" 
                        name="dosage" 
                        onChange={e => setDosage(e.target.value)} 
                        value={dosage} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Age:</label>
                    <div className="col-sm-9">
                        <input className="form-control" 
                        type="text" 
                        placeholder="Enter Age" 
                        name="age" 
                        onChange={e => setAge(e.target.value)} 
                        value={age} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Weight:</label>
                    <div className="col-sm-9">
                        <input className="form-control" 
                        type="text" 
                        placeholder="Enter Weight" 
                        name="weight" 
                        onChange={e => setWeight(e.target.value)} 
                        value={weight} />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Notes:</label>
                    <div className="col-sm-9">
                        <textarea className="form-control" 
                        type="text" 
                        placeholder="Enter Notes" 
                        name="notes" rows="4" cols="50" onChange={e => setNotes(e.target.value)} value={notes} />
                    </div>
                  </div>
                  <button 
                    className="button-secondary-reverse text-bold" 
                    type='submit'>
                      Initiate Vaccination
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
  
    )
}
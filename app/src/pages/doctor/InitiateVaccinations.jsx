import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useEffect, useState } from 'react';
import { getPassportHolderByNIC, initiateVaccinationRecord } from '../../api'
import { PublicKey } from '@solana/web3.js';

import { useWallet } from '@solana/wallet-adapter-react';

export default function InitiateVaccinations(){

    const [patient, setPatient] = useState({});

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

    const wallet = useWallet();
    
    const loadPatient= async (e) => {
        e.preventDefault();
        const pat = await getPassportHolderByNIC(wallet, nic);
        if (pat==null){
            setPubkey("Not Found")
            setFirstname("Not Found")
            setLastname("Not Found")
            setDateOfBirth("Not Found")
            setGender("Not Found")
        } else {
            await setPatient(pat?.account)
            await setPatientData(pat?.account)
        }
        
    }

    const setPatientData = async (ph) => {
        setPubkey(ph?.owner?.toBase58())
        setFirstname(ph.firstname)
        setLastname(ph.lastname)
        setDateOfBirth(ph.dateOfBirth)
        setGender(ph.gender)
    }

    const getDateFormatted = (timestamp) => {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', options);
    }

    const initiateVaccinationRecord = async (e) => {
        e.preventDefault();

        const vaccination = {
            vaccine: vaccine,
            notes: notes,
            age: age,
            weight: weight,
            dosage: dosage,
            batchNumber: batch,
            vaccinationCamp: new PublicKey(pubkey),
            passportHolder: new PublicKey(pubkey)
        }
        const record = await initiateVaccinationRecord(wallet, vaccination)

        console.log(record)
    } 



    return (
        <div className='doc-dashboard'>
        <div className='doc-dashboard-header'>
          <h1 className='doc-dashboard-title'>Initiate Vaccination</h1>
        </div>

        
        <div className='doc-dashboard-body'>

          <div className='doc-dashboard-body-row1'>
            <div className='doc-dashboard-body-row1-col1'>
              <div className='doc-dashboard-body-row1-col1-content'>
                <div className="doctor-actions">
                  <h1>Patient</h1>
                </div>
                <div className="doctor-info">
                    <form onSubmit={loadPatient}>
                        <label>Enter Patient Identification Number: </label><br/>
                        <input className='search-patient' type="text" value={nic} onChange={e => setNIC(e.target.value)} placeholder="Enter Identification Number.."/>
                        {/* <Button className="load-patient" variant="contained" onClick={loadPatient()}>Load Patient</Button> */}
                        <button type='submit'>Load Patient</button>
                    </form>
                </div>
                <div className="patient-info">
                    <h3 className="doc-info-label">Patient Information</h3>
                    <div className="patient-content">
                        <label>Public Key: </label><br/>
                        <input className='detail-patient' type="text" name="pubkey" value={pubkey} disabled/>
                        <br/>
                        <label>First Name: </label><br/>
                        <input className='detail-patient' type="text" name="firstname" value={firstname} disabled/>
                        <br/>
                        <label>Last Name: </label><br/>
                        <input className='detail-patient' type="text" name="lastname" value={lastname} disabled />
                        <br/>
                        <label>Date of Birth: </label><br/>
                        <input className='detail-patient' type="text" name="dob" value={getDateFormatted(dateOfBirth)} disabled/>
                        <br/>
                        <label>Gender: </label><br/>
                        <input className='detail-patient' type="text" name="gender" value={gender} disabled/>
                    </div>
                </div>  
            
              </div>
            </div>

            <div className='doc-dashboard-body-row1-col2'>
            <div className='doc-dashboard-body-row1-col2-content'>
                <div className="doctor-actions">
                  <h1>Vaccination</h1>
                </div>


                <div className="vaccination-info">
                    <form onSubmit={initiateVaccinationRecord}>
                        <label>Vaccine: </label>
                        <input className='detail-patient' type="text" name="vaccine" onChange={e => setVaccine(e.target.value)} value={vaccine}/>
                        <br/>
                        <label>Batch Number: </label><br/>
                        <input className='detail-patient' type="text" name="batchNumber" onChange={e => setBatch(e.target.value)} value={batch} />
                        <br/>
                        <label>Dosage: </label><br/>
                        <input className='detail-patient' type="text" name="dosage" onChange={e => setDosage(e.target.value)} value={dosage} />
                        <br/>
                        <label>Age: </label><br/>
                        <input className='detail-patient' type="text" name="age" onChange={e => setAge(e.target.value)} value={age} />
                        <br/>
                        <label>Weight: </label><br/>
                        <input className='detail-patient' type="text" name="weight" onChange={e => setWeight(e.target.value)} value={weight} />
                        <br/>
                        <label>Notes: </label><br/>
                        <textarea className='detail-patient' name="notes" rows="4" cols="50" onChange={e => setNotes(e.target.value)} value={notes}></textarea>
                        <div className="create-record">
                            <button type='submit'>Initiate Vaccination</button>
                        </div>
                        
                    </form>
                </div>
              </div>
            </div>

          </div>
        </div>
  </div>
  
    )
}
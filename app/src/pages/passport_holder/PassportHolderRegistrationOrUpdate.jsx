
import React, { useEffect, useState } from 'react';
import { getPassportHolderByWalletAddress, createPassportHolder} from '../../api'

import { useWallet } from '@solana/wallet-adapter-react';
import {useNavigate} from "react-router-dom";
import UserExists from "../UserExists";
import RegistrationConfirmationModal from './RegistrationConfirmationModal';
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";


export default function PassportHolderRegistrationOrUpdate(){
    const navigate = useNavigate();
    const wallet = useWallet();
    const [passportHolder, setPassportHolder] = useState({});
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [birthplace, setBirthplace] = useState('');
    const [nic, setNIC] = useState('');

    //  model settings
    const [openModal, setOpenModal] = React.useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    useEffect(() => {
        loadPH()
    }, []);

    useEffect(() => {
        if (passportHolder?.publicKey){
            setAttributes(passportHolder?.publicKey);
        }
    },[passportHolder])

    const setAttributes = () => {
        setFirstname(passportHolder?.account?.firstname);
        setLastname(passportHolder?.account?.lastname);
        setDateOfBirth(passportHolder?.account?.dateOfBirth);
        setGender(passportHolder?.account?.gender);
        setTitle(passportHolder?.account?.title);
        setAddress(passportHolder?.account?.address);
        setPhone(passportHolder?.account?.phone);
        setBirthplace(passportHolder?.account?.placeOfBirth);
        setNIC(passportHolder?.account?.nic);
    }

    const loadPH = async () => {
        const ph = await getPassportHolderByWalletAddress(wallet);
        console.log(ph)
        console.log("passportHolder - ", ph?.account)
        setPassportHolder(ph);
    }

    const getDateFormatted = (timestamp) => {
        let options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', options);
    }

    const createPassportHolderAccount = async (e) => {
        e.preventDefault();
        let passportHolderRequest = {
            firstname: firstname,
            lastname: lastname,
            dateOfBirth: getTimestamp(dateOfBirth),
            gender: gender,
            title: title,
            address: address,
            phone: phone,
            placeOfBirth: birthplace,
            nic: nic
        }

        const passportHolder = await createPassportHolder(wallet, passportHolderRequest);
        console.log("passport holder - " , passportHolder)
        handleOpenModal();
    }

    const getTimestamp = (date) => {
        const dt = new Date(date)
        const timestamp = (dt.getTime()/1000).toString();
        return timestamp;
    }

    if (passportHolder === undefined || passportHolder === null || passportHolder.length === 0) {
        return (
            <div className="center-regform">
                <div className="vc-add-section p-3">
                    <form onSubmit={createPassportHolderAccount}>
                        {/* add input fields for owner, firstname, lastname, date_of_birth, gender, title, address, phone, place_of_birth, nic */}


                        <h2>Register your Vaccination Passport</h2>
                        <div className="ph-add-section-input-fields">
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">First Name</label>
                                <div className="col-sm-4">
                                    <input type="text" name="firstname" placeholder="First Name" value={firstname} onChange={e => setFirstname(e.target.value)} />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Last Name</label>
                                <div className="col-sm-4">
                                    <input type="text" name="lastname" placeholder="Last Name" value={lastname} onChange={e => setLastname(e.target.value)} />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Date of Birth</label>
                                <div className="col-sm-4">
                                    <input type="date" name="date_of_birth" placeholder="Date of Birth" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                                </div>
                            </div>

                            {/* add gender radios */}
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Gender</label>
                                <div className="col-sm-4">
                                    <input type="radio" name="gender" value="male"  onChange={e => setGender(e.target.value)} /> Male <br />
                                    <input type="radio" name="gender" value="female"  onChange={e => setGender(e.target.value)} /> Female
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Title</label>
                                <div className="col-sm-4">
                                    <input type="text" name="title" placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Address</label>
                                <div className="col-sm-4">
                                    <input type="text" name="address" placeholder="address" value={address} onChange={e => setAddress(e.target.value)}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">NIC</label>
                                <div className="col-sm-4">
                                    <input type="text" name="nic" placeholder="NIC" value={nic} onChange={e => setNIC(e.target.value)} />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">phone</label>
                                <div className="col-sm-4">
                                    <input type="text" name="phone" placeholder="Telephone" value={phone} onChange={e => setPhone(e.target.value)}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Place of Birth</label>
                                <div className="col-sm-4">
                                    <input type="text" name="birthplace" placeholder="birth place" value={birthplace} onChange={e => setBirthplace(e.target.value)} />
                                </div>
                            </div>

                        </div>
                        <div className="ph-add-section-buttons">
                            <button className="button-secondary mr-3" type="submit">Add</button>
                            <button className="button-secondary" type="reset">Reset</button> <br />
                            <div className='inline-flex-default'>
                                <div className="button-secondary mt-3 mr-2"
                                     onClick={() => navigate(-1)}
                                >back
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    } else {
        return (
            <UserExists />
        )
    }

    {openModal &&
    <RegistrationConfirmationModal
        closeModal={setOpenModal}
    />
    }
}



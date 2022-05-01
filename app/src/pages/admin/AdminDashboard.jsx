
import { useEffect, useState } from 'react';
import { getPassportHolderByWalletAddress, getDoctorByWalletAddress, getVaccinationCampByWalletAddress, createPassportHolder, createVaccinationCamp, createDoctor } from '../../api'

import { useWallet } from '@solana/wallet-adapter-react';


export default function AdminDashboard(){

    const wallet = useWallet();

    const [showForms, setShowForms] = useState(true);

    // add states for owner, licence_number, firstname, lastname, date_of_birth, license_issued_date, license_expiry_date, business_address, business_telephone, qualifications, gender, title, address, phone, birthplace, registration_number, name, email, website, opening_times
    const [owner, setOwner] = useState('');
    const [licenseNumber, setLicenceNumber] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [licenseIssuedDate, setLicenseIssuedDate] = useState('');
    const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [businessTelephone, setBusinessTelephone] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [gender, setGender] = useState('');
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [birthplace, setBirthplace] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [name, setName] = useState('');
    const [nic, setNIC] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [openingTimes, setOpeningTimes] = useState('');
    const [doctor, setDoctor] = useState('');
    const [vaccinationCamp, setVaccinationCamp] = useState('');
    const [passportHolder, setPassportHolder] = useState('');

    // useEffect(() => {
    //     // if (isDoctorAlreadyPresent === true || isVaccinationCampAlreadyPresent === true || isPassportHolderAlreadyPresent === true) { 
    //     //     setShowForms(false)
    //     // }
    //     // setOwner(wallet.publicKey.toString())
    // }, []);


    const isDoctorAlreadyPresent = async () => {
        const doctor = await getDoctorByWalletAddress(wallet);
        // if (doctor === null || doctor === undefined || doctor === '') {
        //     return false;
        // }
        // console.log("doctor - " , doctor)
        // return true;
        console.log("doctor - " , doctor)
        setDoctor(doctor);
    }

    const isPassportHolderAlreadyPresent = async () => {
        const passportHolder = await getPassportHolderByWalletAddress(wallet);
        // if (passportHolder === null || passportHolder === undefined || passportHolder === '') {
        //     return false;
        // }
        console.log("passport holder - " , passportHolder)
        // return true;
        setPassportHolder(passportHolder);
    }

    const isVaccinationCampAlreadyPresent = async () => {
        const vaccinationCamp = await getVaccinationCampByWalletAddress(wallet);
        // if (vaccinationCamp === null || vaccinationCamp === undefined || vaccinationCamp === '') {
        //     return false;
        // }
        console.log("vaccination camp - " , vaccinationCamp)
        // return true;
        setVaccinationCamp(vaccinationCamp);
    }

    const createDoctorAccount = async (e) => {
        e.preventDefault();

        let doctorRequest = {
            firstname: firstname,
            lastname: lastname,
            dateOfBirth: dateOfBirth,
            licenseNumber: licenseNumber,
            licenseIssuedDate: licenseIssuedDate,
            licenseExpiryDate: licenseExpiryDate,
            businessAddress: businessAddress,
            businessTelephone: businessTelephone,
            qualifications: qualifications,
        }
        const doctor = await createDoctor(wallet, doctorRequest);
        console.log("doctor - " , doctor)
    }

    const createPassportHolderAccount = async (e) => {
        e.preventDefault();
        let passportHolderRequest = {
            firstname: firstname,
            lastname: lastname,
            dateOfBirth: dateOfBirth,
            gender: gender,
            title: title,
            address: address,
            phone: phone,
            placeOfBirth: birthplace,
            nic: nic
        }

        const passportHolder = await createPassportHolder(wallet, passportHolderRequest);
        console.log("passport holder - " , passportHolder)
    }

    const createVaccinationCampAccount = async (e) => {
        e.preventDefault();
        let vaccinationCampRequest = {
            registrationNumber: registrationNumber,
            name: name,
            phone: phone,
            email: email,
            website: website,
            openingTimes: openingTimes,
            address: address
        }

        const vaccinationCamp = await createVaccinationCamp(wallet, vaccinationCampRequest);
        console.log("vaccination camp - " , vaccinationCamp)
    }



    if (showForms === false) {
        return (
            <div>
                <h1>You have already completed the registration process</h1>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Admin Dashboard</h1>
                
                <div className="doctor-add-section">
                    <form onSubmit={createDoctorAccount}>
                        <h3>Doctor</h3>
                        {/* add input fields owner, license_number, firstname, lastname, date_of_birth, license_issued_date, license_expiry_date, business_address, business_telephone, qualifications*/}
                        <div className="ph-add-section-input-fields">
                            <div className="ph-add-section-input-fields-owner">
                                <label>Owner</label>
                                <input type="text" name="owner" placeholder="Owner" value={owner} onChange={e => setOwner(e.target.value)}/>
                            </div>
                            <div className="ph-add-section-input-fields-license-number">
                                <label>License Number</label>
                                <input type="text" name="license_number" placeholder="License Number" value={licenseNumber} onChange={e => setLicenceNumber(e.target.value)} />
                            </div>
                            <div className="ph-add-section-input-fields-firstname">
                                <label>First Name</label>
                                <input type="text" name="firstname" placeholder="First Name" value={firstname} onChange={e => setFirstname(e.target.value)}/>
                            </div>
                            <div className="ph-add-section-input-fields-lastname">
                                <label>Last Name</label>
                                <input type="text" name="lastname" placeholder="Last Name" value={lastname} onChange={e => setLastname(e.target.value)}/>
                            </div>
                            <div className="ph-add-section-input-fields-date-of-birth">
                                <label>Date of Birth</label>
                                <input type="date" name="date_of_birth" placeholder="Date of Birth" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)}/>
                            </div>
                            <div className="ph-add-section-input-fields-license-issued-date">
                                <label>License Issued Date</label>
                                <input type="date" name="license_issued_date" placeholder="License Issued Date" value={licenseIssuedDate} onChange={e => setLicenseIssuedDate(e.target.value)}/>
                            </div>
                            <div className="ph-add-section-input-fields-license-expiry-date">
                                <label>License Expiry Date</label>
                                <input type="date" name="license_expiry_date" placeholder="License Expiry Date" value={licenseExpiryDate} onChange={e => setLicenseExpiryDate(e.target.value)}/>
                            </div>
                            <div className="ph-add-section-input-fields-business-address">
                                <label>Business Address</label>
                                <input type="text" name="business_address" placeholder="Business Address" value={businessAddress} onChange={e => setBusinessAddress(e.target.value)}/>
                            </div>
                            <div className="ph-add-section-input-fields-business-telephone">
                                <label>Business Telephone</label>
                                <input type="text" name="business_telephone" placeholder="Business Telephone" value={businessTelephone} onChange={e => setBusinessTelephone(e.target.value)}/>
                            </div>
                            <div className="ph-add-section-input-fields-qualifications">
                                <label>Qualifications</label>
                                <input type="text" name="qualifications" placeholder="Qualifications" value={qualifications} onChange={e => setQualifications(e.target.value)}/>
                            </div>
                        </div>
                        <div className="ph-add-section-buttons">
                            <button type='submit'>Add</button>
                            <button type="reset">Reset</button>
                        </div>
                    </form>
                </div>
    
                <div className="ph-add-section">
                    <form onSubmit={createPassportHolderAccount}>
                        {/* add input fields for owner, firstname, lastname, date_of_birth, gender, title, address, phone, place_of_birth, nic */}
    
    
                        <h3>Passport Holder</h3>
    <                   div className="ph-add-section-input-fields">
                            <div className="ph-add-section-input-fields-owner">
                                <label>Owner</label>
                                <input type="text" name="owner" placeholder="Owner" value={owner} onChange={e => setOwner(e.target.value)} />
                            </div>
                            <div className="ph-add-section-input-fields-firstname">
                                <label>First Name</label>
                                <input type="text" name="firstname" placeholder="First Name" value={firstname} onChange={e => setFirstname(e.target.value)}/>
                            </div>
                            <div className="ph-add-section-input-fields-lastname">
                                <label>Last Name</label>
                                <input type="text" name="lastname" placeholder="Last Name" value={lastname} onChange={e => setLastname(e.target.value)}/>
                            </div>
                            <div className="ph-add-section-input-fields-date-of-birth">
                                <label>Date of Birth</label>
                                <input type="date" name="date_of_birth" placeholder="Date of Birth" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)}/>
                            </div>
    
                            {/* add gender radios */}
                            <div className="ph-add-section-input-fields-license-issued-date">
                                <label>Gender</label>
                                <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={e => setGender(e.target.value)}/>male
                                <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={e => setGender(e.target.value)}/>female
    
                            </div> 
    
                            <div className="ph-add-section-input-fields-business-address">
                                <label>Title</label>
                                <input type="text" name="title" placeholder="title" value={title} onChange={e => setTitle(e.target.value)}/>
                            </div>
    
                            <div className="ph-add-section-input-fields-business-telephone">
                                <label>Address</label>
                                <input type="text" name="address" placeholder="address" value={address} onChange={e => setAddress(e.target.value)}/>
                            </div>

                            <div className="ph-add-section-input-fields-nic">
                                <label>NIC</label>
                                <input type="text" name="nic" placeholder="NIC" value={nic} onChange={e => setNIC(e.target.value)}/>
                            </div>
    
                            <div className="ph-add-section-input-fields-business-telephone">
                                <label>phone</label>
                                <input type="text" name="phone" placeholder="Telephone" value={phone} onChange={e => setPhone(e.target.value)}/>
                            </div>
                            <div className="ph-add-section-input-fields-qualifications">
                                <label>Place of Birth</label>
                                <input type="text" name="birthplace" placeholder="birth place" value={birthplace} onChange={e => setBirthplace(e.target.value)}/>
                            </div>
                        </div>
                        <div className="ph-add-section-buttons">
                            <button type="submit">Add</button>
                            <button type="reset">Reset</button>
                        </div>
                    </form>
                </div>
    
                <div className="vc-add-section">
                    {/* add input fields owner, registration_number, name, phone, email, website, opening_times, address */}
                    <form onSubmit={createVaccinationCampAccount}>
                        <h3>Vaccination Center</h3>
                        <div className="vc-add-section-input-fields">
                            <div className="vc-add-section-input-fields-owner">
                                <label>Owner</label>
                                <input type="text" name="owner" placeholder="Owner" value={owner} onChange={e => setOwner(e.target.value)}/>
                            </div>
                            <div className="vc-add-section-input-fields-registration-number">
                                <label>Registration Number</label>
                                <input type="text" name="registration_number" placeholder="Registration Number" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)}/>
                            </div>
                            <div className="vc-add-section-input-fields-name">
                                <label>Name</label>
                                <input type="text" name="name" placeholder="Name" value={name} onChange={e => setName(e.target.value)}/>
                            </div>
                            <div className="vc-add-section-input-fields-phone">
                                <label>Phone</label>
                                <input type="text" name="phone" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)}/>
                            </div>
                            <div className="vc-add-section-input-fields-email">
                                <label>Email</label>
                                <input type="text" name="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                            <div className="vc-add-section-input-fields-website">
                                <label>Website</label>
                                <input type="text" name="website" placeholder="Website" value={website} onChange={e => setWebsite(e.target.value)}/>
                            </div>
                            <div className="vc-add-section-input-fields-opening-times">
                                <label>Opening Times</label>
                                <input type="text" name="opening_times" placeholder="Opening Times" value={openingTimes} onChange={e => setOpeningTimes(e.target.value)} />
                            </div>
                            <div className="vc-add-section-input-fields-address">
                                <label>Address</label>
                                <input type="text" name="address" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)}/>
                            </div>
                            <div className="ph-add-section-buttons">
                                <button type="submit">Add</button>
                                <button type="reset">Reset</button>
                            </div>
                        </div>
                    </form>
                    
                </div>
        

                <br/>
                <br/>
                <br/>
                <label>Get Doctor</label>
                <input type="text" name="doctor" placeholder="Doctor" value={wallet.publicKey.toString} onChange={e => setOwner(e.target.value)} disabled/>
                <button onClick={isDoctorAlreadyPresent}>Get Doctor</button>
                <br/>
                <label>Get Passport Holder</label>
                <input type="text" name="doctor" placeholder="Doctor" value={wallet.publicKey.toString} onChange={e => setOwner(e.target.value)} disabled/>
                <button onClick={isPassportHolderAlreadyPresent}>Get PH</button>
                <br/>
                <label>Get Vaccination Camp</label>
                <input type="text" name="doctor" placeholder="Doctor" value={wallet.publicKey.toString} onChange={e => setOwner(e.target.value)} disabled/>
                <button onClick={isVaccinationCampAlreadyPresent}>Get VC</button>
            </div>
        )
    }

   
}
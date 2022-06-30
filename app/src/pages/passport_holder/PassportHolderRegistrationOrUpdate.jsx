import React, { useEffect, useState } from "react";
import {
  getPassportHolderByWalletAddress,
  createPassportHolder,
} from "../../api";

import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import UserExists from "../UserExists";
import RegistrationConfirmationModal from "./RegistrationConfirmationModal";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

export default function PassportHolderRegistrationOrUpdate() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const [passportHolder, setPassportHolder] = useState({});
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [birthplace, setBirthplace] = useState("");
  const [nic, setNIC] = useState("");

  useEffect(() => {
    loadPH();
  }, []);

  useEffect(() => {
    if (passportHolder?.publicKey) {
      setAttributes(passportHolder?.publicKey);
    }
  }, [passportHolder]);

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
  };

  const loadPH = async () => {
    try {
      const ph = await getPassportHolderByWalletAddress(wallet);
      console.log(ph);
      console.log("passportHolder - ", ph?.account);
      setPassportHolder(ph);
    } catch (error) {
      console.log(error);
    }
  };

  const createPassportHolderAccount = async (e) => {
    e.preventDefault();
    try {
      let passportHolderRequest = {
        firstname: firstname,
        lastname: lastname,
        dateOfBirth: getTimestamp(dateOfBirth),
        gender: gender,
        title: title,
        address: address,
        phone: phone,
        placeOfBirth: birthplace,
        nic: nic,
      };

      const passportHolder = await createPassportHolder(
        wallet,
        passportHolderRequest
      );
      console.log("passport holder - ", passportHolder);
      NotificationManager.success(
        "Successfully created passport holder",
        "Success"
      );
      navigate("/passport-holder/home");
    } catch (error) {
      console.log(error);
      NotificationManager.error("Couldn't create passport holder", "Error");
    }
  };

  const getTimestamp = (date) => {
    const dt = new Date(date);
    const timestamp = (dt.getTime() / 1000).toString();
    return timestamp;
  };

  if (
    passportHolder === undefined ||
    passportHolder === null ||
    passportHolder.length === 0
  ) {
    return (
      <div className="center-regform">
        <div className="vc-add-section p-3">
          <form onSubmit={createPassportHolderAccount}>
            {/* add input fields for owner, firstname, lastname, date_of_birth, gender, title, address, phone, place_of_birth, nic */}

            <div className="d-flex justify-content-between">
              <div
                className="button-secondary ml-2"
                onClick={() => navigate(-1)}
              >
                back
              </div>
              <h2 className="text-center">
                Register your Vaccination Passport
              </h2>
              <div className="button-secondary ml-2 invisible">back</div>
            </div>
            <div className="row mx-0">
              <div className="col-6 offset-4">
                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">First Name</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      name="firstname"
                      placeholder="First Name"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">Last Name</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Last Name"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">
                    Date of Birth
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="date"
                      name="date_of_birth"
                      placeholder="Date of Birth"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </div>
                </div>

                {/* add gender radios */}
                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">Gender</label>
                  <div className="col-sm-8">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      onChange={(e) => setGender(e.target.value)}
                    />{" "}
                    Male <br />
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      onChange={(e) => setGender(e.target.value)}
                    />{" "}
                    Female
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">Title</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      name="title"
                      placeholder="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">Address</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      name="address"
                      placeholder="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">NIC</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      name="nic"
                      placeholder="NIC"
                      value={nic}
                      onChange={(e) => setNIC(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">phone</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      name="phone"
                      placeholder="Telephone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">
                    Place of Birth
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      name="birthplace"
                      placeholder="birth place"
                      value={birthplace}
                      onChange={(e) => setBirthplace(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex">
              <div className="mx-auto d-flex">
                <button className="button-secondary mr-3" type="reset">
                  Reset
                </button>
                <button className="button-secondary" type="submit">
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
        <NotificationContainer />
      </div>
    );
  } else {
    return <UserExists />;
  }
}

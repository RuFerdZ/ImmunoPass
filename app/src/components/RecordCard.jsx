/* eslint-disable react-hooks/exhaustive-deps */
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  getDoctorByPubKey,
  getPassportHolderByPubKey,
  getVaccinationCampByPubKey,
} from "../api";

export default function RecordCard({
  publicKey,
  createdDate,
  notes,
  status,
  validatorType,
}) {
  const wallet = useWallet();
  const [user, setUser] = useState(null);
  const [isVc, setIsVc] = useState(false);

  const getDateFormatted = (timestamp) => {
    var options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", options);
  };

  const getUser = async () => {
    try {
      let user = null;
      if (!user) {
        user = await getDoctor();
      }
      if (!user) {
        user = await getVaccinationCamp();
        if (user) {
          setIsVc(true);
        }
      }
      if (!user) {
        user = await getPassportHolder();
      }
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctor = async () => {
    let doctor = null;
    try {
      doctor = await getDoctorByPubKey(wallet, publicKey);
      return doctor;
    } catch (error) {
      return null;
    }
  };

  const getVaccinationCamp = async () => {
    let vaccinationCamp = null;
    try {
      vaccinationCamp = await getVaccinationCampByPubKey(wallet, publicKey);
      return vaccinationCamp;
    } catch (error) {
      return null;
    }
  };

  const getPassportHolder = async () => {
    let passportHolder = null;
    try {
      passportHolder = await getPassportHolderByPubKey(wallet, publicKey);
      return passportHolder;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div
      className={`light-black-card p-4 mt-2 h-auto ${status.toLowerCase()}`}
      style={{ minHeight: "unset" }}
    >
      <div className="row mx-0">
        {user ? (
          isVc ? (
            <>{user.name}</>
          ) : (
            <>
              {user?.firstname} {user?.lastname}
            </>
          )
        ) : (
          "User"
        )}{" "}
        - {validatorType}
      </div>
      <div className="row mx-0">Status: {status}</div>
      <div className="row mx-0">Notes: {notes}</div>
      <div className="row mx-0">Date: {getDateFormatted(createdDate)}</div>
    </div>
  );
}

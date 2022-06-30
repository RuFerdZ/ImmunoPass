/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import { getValidationRecordsOfRecord } from "../api";
import RecordCard from "../components/RecordCard";

const ViewRecordModal = ({ closeVaccine, publicKey }) => {
    const wallet = useWallet();
    const [rows, setRows] = useState([]);

    const getValidationStatus = async () => {
        try {
            const res = await getValidationRecordsOfRecord(wallet, publicKey);
            setRows(res);
        } catch (error) {
            console.log(error);
            NotificationManager.error("Couldn't load validation status", "Error");
        }
    };

    useEffect(() => {
        getValidationStatus();
    }, []);

    useEffect(() => {
        if (rows.length>0) {
            rows.sort(function (x, y) {
                return y?.account?.createdDate - x?.account?.createdDate;
            })
        }
    }, [rows]);

    return (
        <div className="modal-background">
            <div className="modal-container shadow-sm">
                <div className="modal-header">
                    <h5 className="modal-title">Validator Records</h5>
                </div>
                <div className="modal-body white-color">
                    {rows.map((row, idx) => (
                        <RecordCard
                            publicKey={row.account.validator}
                            createdDate={row.account.createdDate}
                            notes={row.account.notes}
                            status={row.account.status}
                            validatorType={row.account.validatorType}
                            key={idx}
                        />
                    ))}
                </div>
                <div className="modal-footer">
                    <div className="button-secondary" onClick={() => closeVaccine(false)}>
                        Cancel
                    </div>
                </div>
            </div>
            <NotificationContainer />
        </div>
    );
};

export default ViewRecordModal;

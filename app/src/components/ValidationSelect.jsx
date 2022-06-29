/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { MenuItem, Select } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";

import NoteModal from "./NoteModal";
import { getValidationRecordsOfRecord } from "../api";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const StyledSelect = styled(Select)(({ theme }) => ({
  ".MuiSelect-select": {
    padding: "3px 5px",
  },
}));

export default function ValidationSelect({
  publicKey,
  onChangeStatus,
  validator,
}) {
  const wallet = useWallet();

  const [validationStatus, setValidationStatus] = useState("PENDING");
  const [showNoteModal, setShowNoteModal] = useState(false);

  const getValidationStatus = async () => {
    try {
      const res = await getValidationRecordsOfRecord(wallet, publicKey);
      let latestDateItem = res[0];

      res
        .filter((data) => data.account.validator.equals(validator))
        .forEach((data) => {
          const date = new Date(data.account.createdDate * 1000);
          const latestDate = new Date(
            latestDateItem.account.createdDate * 1000
          );

          if (date - latestDate > 0) {
            latestDateItem = data;
          }
        });
      setValidationStatus(latestDateItem?.account?.status || "PENDING");
    } catch (error) {
      console.log(error);
      NotificationManager.error("Couldn't load validation status", "Error");
    }
  };

  const handleChange = (e) => {
    setValidationStatus(e.target.value);
    setShowNoteModal(true);
  };

  useEffect(() => {
    getValidationStatus();
  }, []);

  return (
    <>
      <StyledSelect
        size="small"
        value={validationStatus}
        onChange={handleChange}
      >
        <MenuItem value="PENDING">Select</MenuItem>
        <MenuItem value="APPROVED">Approved</MenuItem>
        <MenuItem value="REJECTED">Rejected</MenuItem>
      </StyledSelect>

      {showNoteModal && (
        <NoteModal
          resetState={() => getValidationStatus()}
          closeModal={setShowNoteModal}
          status={validationStatus}
          onSave={(note) => onChangeStatus(validationStatus, note, publicKey)}
        />
      )}
      <NotificationContainer />
    </>
  );
}

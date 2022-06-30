import React from "react";

import { useEffect, useState } from "react";
import {
  getAssignedVaccinationsForDoctor,
  getDoctorByWalletAddress,
  getVaccinationRecordsOfPassportHolder,
  validateVaccination,
} from "../../api";
import UserNotFound from "../UserNotFound";

import Icon from "awesome-react-icons";

import { useWallet } from "@solana/wallet-adapter-react";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button from "@mui/material/Button";

import { Link, useNavigate } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import InitiateVaccinations from "./InitiateVaccinations";
import { styled } from "@mui/material/styles";
import ViewRecordModal from "../ViewRecordModal";
import ValidationSelect from "../../components/ValidationSelect";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

// table configuration
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#191c24",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function DoctorDashboard(props) {
  const wallet = useWallet();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [initiatePage, setInitiatePage] = useState(false);
  const [rows, setRows] = useState([]);

  // vaccine model settings
  const [openVaccine, setOpenVaccine] = useState(false);
  const [rowPk, setRowPk] = useState(null);

  useEffect(() => {
    loadDoctor();
  }, []);

  useEffect(() => {
    console.log("doctor - ", doctor);
    if (doctor?.publicKey) {
      loadVaccines(doctor?.publicKey);
    }
  }, [doctor]);

  useEffect(() => {
    setRows([]);
    if (vaccines) {
      setRows(vaccines);
    }
  }, [vaccines]);

  const loadDoctor = async () => {
    try {
      const doc = await getDoctorByWalletAddress(wallet);
      setDoctor(doc);
    } catch (error) {
      console.log(error);
    }
  };

  const loadVaccines = async (accountKey) => {
    try {
      const vac = await getAssignedVaccinationsForDoctor(
        wallet,
        wallet.publicKey
      );
      console.log("vacccine - ", vac);
      setVaccines(vac);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInitiatePage = () => {
    setInitiatePage(true);
  };

  const getDateFormatted = (timestamp) => {
    var options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", options);
  };

  const getStatus = (status) => {
    if (status === "COMPLETED" || status === "VALID") {
      return (
        <span style={{ color: "green", border: "1px solid" }}>{status}</span>
      );
    } else if (status === "INVALID") {
      return (
        <span style={{ color: "red", border: "1px solid" }}>{status}</span>
      );
    } else {
      return (
        <span style={{ color: "orange", border: "1px solid" }}>{status}</span>
      );
    }
  };

  const handleChangeStatus = async (value, note, key) => {
    try {
      const selectedItem = rows.find(({ publicKey }) => publicKey === key);

      const data = {
        record: selectedItem.publicKey,
        validatorType: "doctor", // doctor, vaccination_camp, passport_holder (hardcode)
        validator: selectedItem.account.doctor, // person who is validating (doctor/vaccinationCamp/passportHolder)
        status: value, // rejected, approved, pending
        notes: note,
      };

      await validateVaccination(wallet, data);

      NotificationManager.success("Successfully changed the status", "Success");
    } catch (error) {
      NotificationManager.error("Couldn't change the status", "Error");
      console.log(error);
    }
  };

  const handleOpenValidationModal = (pk) => {
    setRowPk(pk);
    setOpenVaccine(true);
  };

  if (doctor === undefined || doctor === null || doctor.length === 0) {
    return <UserNotFound />;
  }
  if (!initiatePage) {
    return (
      <div className="doc-dashboard">
        <div className="doc-dashboard-header d-flex justify-content-between">
          <div
            className="button-secondary my-auto ml-4"
            onClick={() => navigate(-1)}
          >
            back
          </div>
          <h1 className="primary-text black-color py-4 text-uppercase text-center">
            Doctor Dashboard
          </h1>
          <div className="button-secondary invisible">back</div>
        </div>

        <div className="doc-dashboard-body">
          <div className="box-container white-color px-4">
            <div className="main-box mr-3">
              <div className="light-black-card p-3 pb-4">
                <div className="secondary-text text-uppercase text-center mt-3 mb-4">
                  Your Information
                </div>
                <div className="mt-2 px-5">
                  <span className="text-bold mr-2">Doctor: </span>Dr.{" "}
                  {doctor.account.firstname} {doctor.account.lastname}
                </div>
                <div className="mt-2 px-5">
                  <span className="text-bold mr-2">License Number: </span>
                  {doctor.account.licenseNumber}
                </div>
                <div className="mt-2 px-5">
                  <span className="text-bold mr-2">License Issued Date: </span>
                  {getDateFormatted(doctor.account.licenceIssuedDate)}
                </div>
                <div className="mt-2 px-5">
                  <span className="text-bold mr-2">License Expiry Date: </span>
                  {getDateFormatted(doctor.account.licenceExpiryDate)}
                </div>
                <div className="mt-2 px-5">
                  <span className="text-bold mr-2">Business Phone: </span>
                  {doctor.account.businessTelephone}
                </div>
                <div className="mt-2 px-5">
                  <span className="text-bold mr-2">Business Address: </span>
                  {doctor.account.businessAddress}
                </div>
                <div className="mt-2 px-5">
                  <span className="text-bold mr-2">Qualifications: </span>
                  {doctor.account.qualifications}
                </div>
                <div className="wallet-container mt-3">
                  <WalletMultiButton />
                </div>
              </div>
            </div>
            <div className="main-box">
              <div className="light-black-card text-center text-uppercase p-3">
                <div className="secondary-text my-3">Actions</div>
                <div className="text-bold mt-5 px-5">
                  Initiate Vaccination:{" "}
                  <span className="approved ml-3">
                    <button
                      onClick={handleInitiatePage}
                      className="button-secondary text-bold white-color mt-4 mx-auto"
                    >
                      Initiate
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="data-table">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date of Vaccination</StyledTableCell>
                  <StyledTableCell align="left">Vaccine</StyledTableCell>
                  <StyledTableCell align="left">Batch Number</StyledTableCell>
                  <StyledTableCell align="left">Dosage</StyledTableCell>
                  <StyledTableCell align="left">Status</StyledTableCell>
                  <StyledTableCell align="left">Validate</StyledTableCell>
                  <StyledTableCell align="left"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
                      {getDateFormatted(row.account.createdDate)}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row.account.vaccine}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row.account.batchNumber}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row.account.dosage}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {getStatus(row.account.status)}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <ValidationSelect
                        onChangeStatus={handleChangeStatus}
                        publicKey={row.publicKey}
                        validator={row.account.doctor}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Button
                        size="small"
                        onClick={() => handleOpenValidationModal(row.publicKey)}
                      >
                        View Record
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {openVaccine && (
          <ViewRecordModal closeVaccine={setOpenVaccine} publicKey={rowPk} />
        )}
        <NotificationContainer />
      </div>
    );
  } else {
    return <InitiateVaccinations goBack={() => setInitiatePage(false)} />;
  }
}

import React from "react";

import { useEffect, useState } from "react";
import {
  getAssignedVaccinationsForCamp,
  getVaccinationCampByWalletAddress,
  getVaccinationRecordsOfPassportHolder,
  validateVaccination,
} from "../../api";
import UserNotFound from "../UserNotFound";
import { styled } from "@mui/material/styles";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import QRCode from "react-qr-code";

// import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet } from "@solana/wallet-adapter-react";
import ViewRecordModal from "../ViewRecordModal";
import { MenuItem } from "@mui/material";
import ValidationSelect from "../../components/ValidationSelect";
import { useNavigate } from "react-router-dom";
// import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

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

export default function VaccinationCampDashboard() {
  const wallet = useWallet();
  const navigate = useNavigate();
  const [vaccinationCamp, setVaccinationCamp] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [rows, setRows] = useState([]);

  // QR modal settings
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // vaccine model settings
  const [openVaccine, setOpenVaccine] = useState(false);
  const [rowPk, setRowPk] = useState(null);

  useEffect(() => {
    loadVC();
  }, []);

  useEffect(() => {
    if (vaccinationCamp?.publicKey) {
      loadVaccines(vaccinationCamp?.publicKey);
    }
  }, [vaccinationCamp]);

  useEffect(() => {
    setRows([]);
    if (vaccines) {
      setRows(vaccines);
    }
  }, [vaccines]);

  const loadVC = async () => {
    try {
      const vc = await getVaccinationCampByWalletAddress(wallet);
      console.log("vac -", vc);
      setVaccinationCamp(vc);
    } catch (error) {
      console.log(error);
    }
  };

  const loadVaccines = async (accountKey) => {
    try {
      const vac = await getAssignedVaccinationsForCamp(wallet, accountKey);

      setVaccines(vac);
    } catch (error) {
      console.log(error);
    }
  };

  const getDateFormatted = (timestamp) => {
    var options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", options);
  };

  const getStatus = (status) => {
    if (status === "VALID") {
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
        validatorType: "vaccination_camp", // doctor, vaccination_camp, passport_holder (hardcode)
        validator: selectedItem.account.vaccinationCamp, // person who is validating (doctor/vaccinationCamp/passportHolder)
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

  if (
    vaccinationCamp === undefined ||
    vaccinationCamp === null ||
    vaccinationCamp.length === 0
  ) {
    return <UserNotFound />;
  }

  return (
    <div className={`${openVaccine && "primary-container"} doc-dashboard`}>
      <div className="doc-dashboard-header d-flex justify-content-between">
        <div
          className="button-secondary my-auto ml-4"
          onClick={() => navigate(-1)}
        >
          back
        </div>
        <h1 className="primary-text black-color py-4 text-uppercase text-center">
          Vaccination Camp Dashboard
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
                <span className="text-bold mr-2">Name: </span>
                {vaccinationCamp.account.name}
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Registration Number: </span>
                {vaccinationCamp.account.registrationNumber}
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Phone: </span>
                {vaccinationCamp.account.phone}
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Address: </span>
                {vaccinationCamp.account.address}
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Email: </span>
                <a
                  className="website-link"
                  href={"mailto:" + vaccinationCamp.account.email}
                  target="_blank"
                >
                  {vaccinationCamp.account.email}
                </a>
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Website: </span>
                <a
                  className="website-link"
                  href={vaccinationCamp.account.website}
                  target="_blank"
                >
                  {vaccinationCamp.account.website}
                </a>
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Joined Date: </span>
                {getDateFormatted(vaccinationCamp.account.joinedDate)}
              </div>
              <div className="wallet-container mt-3">
                <WalletMultiButton />
              </div>
            </div>
          </div>
          <div className="main-box">
            <div className="light-black-card  text-uppercase p-3">
              <div className="secondary-text text-center my-3">Statistics</div>
              <div className="text-bold mt-5 px-5">
                Active: <span className="approved ml-3">True</span>
              </div>
              <div className="text-bold mt-5 px-5">
                Vaccination Count <span className="pending ml-3">{vaccines.length}</span>
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
                <StyledTableCell align="left">Vaccination Code</StyledTableCell>
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
                      validator={row.account.vaccinationCamp}
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
}

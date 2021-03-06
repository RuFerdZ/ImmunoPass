import React from "react";

import { useEffect, useState } from "react";
import {
  getPassportHolderByWalletAddress,
  getVaccinationRecordsOfPassportHolder,
  validateVaccination,
} from "../../api";
import UserNotFound from "../UserNotFound";
import { styled } from "@mui/material/styles";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import ViewRecordModal from "../ViewRecordModal";
import { MenuItem, Select } from "@mui/material";
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

export default function PassportHolderDashboard() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const [passportHolder, setPassportHolder] = useState({});
  const [vaccines, setVaccines] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("pending");

  // vaccine model settings
  const [openVaccine, setOpenVaccine] = useState(false);
  const [rowPk, setRowPk] = useState(null);

  // var accountKey = ""

  useEffect(() => {
    loadPH();
  }, []);

  useEffect(() => {
    if (passportHolder?.publicKey) {
      loadVaccines(passportHolder?.publicKey);
    }
  }, [passportHolder]);

  useEffect(() => {
    if (vaccines) {
      createRecords(vaccines);
    }
  }, [vaccines]);

  const loadPH = async () => {
    try {
      const ph = await getPassportHolderByWalletAddress(wallet);
      console.log("passportHolder - ", ph?.account);
      setPassportHolder(ph);
    } catch (error) {
      console.log(error);
    }
  };

  const loadVaccines = async (accountKey) => {
    try {
      console.log("account key - ", accountKey)
      const vac = await getVaccinationRecordsOfPassportHolder(
        wallet,
        accountKey
      );
      console.log("vacccine - ", vac);
      setVaccines(vac);
    } catch (error) {
      console.log(error);
    }
  };

  const createRecords = (vacs) => {
    setRows(vacs);
  };

  const getDateFormatted = (timestamp) => {
    let options = { year: "numeric", month: "long", day: "numeric" };
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
        validatorType: "passport_holder", // doctor, vaccination_camp, passport_holder (hardcode)
        validator: selectedItem.account.passportHolder, // person who is validating (doctor/vaccinationCamp/passportHolder)
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
    passportHolder === undefined ||
    passportHolder === null ||
    passportHolder.length === 0
  ) {
    return <UserNotFound />;
  } else {
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
            User Dashboard
          </h1>
          <div className="button-secondary invisible">back</div>
        </div>

        <div className="box-container white-color px-4">
          <div className="main-box mr-3">
            <div className="light-black-card p-3 pb-4">
              <div className="secondary-text text-uppercase text-center mt-3 mb-4">
                Your Information
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Identification Number: </span>
                {passportHolder?.account?.nic}
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Name: </span>
                {passportHolder?.account?.title +
                  " " +
                  passportHolder?.account?.firstname +
                  " " +
                  passportHolder?.account?.lastname}
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Gender: </span>
                {passportHolder?.account?.gender}
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Phone: </span>
                {passportHolder?.account?.phone}
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Address: </span>
                {passportHolder?.account?.address}
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Date of Birth: </span>
                {getDateFormatted(passportHolder?.account?.dateOfBirth)}
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Place of Birth: </span>
                {passportHolder?.account?.placeOfBirth}
              </div>
              <div className="mt-2 px-5">
                <span className="text-bold mr-2">Joined Date: </span>
                {getDateFormatted(passportHolder?.account?.joinedDate)}
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
                        validator={row.account.passportHolder}
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
}


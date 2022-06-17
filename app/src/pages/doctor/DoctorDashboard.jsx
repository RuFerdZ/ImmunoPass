import React from 'react';

import { useEffect, useState } from 'react';
import {
  getAssignedVaccinationsForDoctor,
  getDoctorByWalletAddress,
  getVaccinationRecordsOfPassportHolder
} from '../../api'
import UserNotFound from '../UserNotFound'

import Icon from "awesome-react-icons";


import { useWallet } from '@solana/wallet-adapter-react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';

import { Link } from "react-router-dom";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import InitiateVaccinations from './InitiateVaccinations'
import {styled} from "@mui/material/styles";
import ViewRecordModal from "../ViewRecordModal";

// table configuration
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#191c24',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


function createData(date, vaccine, batchNumber, dosage, status) {
  return { date, vaccine, batchNumber, dosage, status };
}

export default function DoctorDashboard(props) {
  
  const wallet = useWallet();
  const [ doctor, setDoctor ] = useState([]);
  const [ vaccines, setVaccines ] = useState([]);
  const [ initiatePage, setInitiatePage ] = useState(false);
  const [ rows, setRows ] = useState([]);

  // vaccine model settings
  const [openVaccine, setOpenVaccine] = React.useState(false);
  const handleOpenVaccine = () => setOpenVaccine(true);
  const handleCloseVaccinee = () => setOpenVaccine(false);

  useEffect(() => {
    loadDoctor()
  }, []);

  useEffect(() => {
    console.log("doctor - ", doctor)
    if (doctor?.publicKey) {
      loadVaccines(doctor?.publicKey)
    }
  }, [doctor]);

  useEffect(() => {
    setRows([])
    if (vaccines) {
      createRecords(vaccines)
    }
  }, [vaccines]);


  const loadDoctor = async () => {
    const doc = await getDoctorByWalletAddress(wallet);
    setDoctor(doc);
  }

  const loadVaccines = async (accountKey) => {
    const vac = await getAssignedVaccinationsForDoctor(wallet, wallet.publicKey);
    console.log("vacccine - ", vac)
    setVaccines(vac);
  }

  const handleInitiatePage = () => {
    setInitiatePage(true);
  }

  const getDateFormatted = (timestamp) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', options);
  }

  const createRecords = (vacs) => {
    vacs.forEach(vaccine => {
      let row = createData(vaccine?.account?.createdDate, vaccine?.account?.vaccine, vaccine?.account?.batchNumber, vaccine?.account?.dosage, vaccine?.account?.status)
      setRows(rows.concat(row))
    })
  }

  const getStatus = (status) => {
    if (status === 'COMPLETED' || status === "VALID") {
      return <span style={{color: 'green', border: '1px solid'}}>{status}</span>
    } else if (status === 'INVALID') {
      return <span style={{color: 'red', border: '1px solid'}}>{status}</span>
    } else {
      return <span style={{color: 'orange', border: '1px solid'}}>{status}</span>
    }
  }

  if (doctor === undefined || doctor === null || doctor.length === 0) {
    return (
        <UserNotFound />
    );
  } else {
    if(initiatePage === false) {
      return (
        <div className='doc-dashboard'>
          <div className='doc-dashboard-header'>
            <h1 className='primary-text black-color py-4 text-uppercase text-center'>Doctor Dashboard</h1>
          </div>
          
          <div className='doc-dashboard-body'>
            <div className="box-container white-color px-4">
              <div className="main-box mr-3">
                <div className="light-black-card p-3 pb-4">
                  <div className="secondary-text text-uppercase text-center mt-3 mb-4">
                    Your Information
                  </div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Doctor: </span>Dr. {doctor.account.firstname} {doctor.account.lastname}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">License Number: </span>{doctor.account.licenseNumber}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">License Issued Date: </span>{getDateFormatted(doctor.account.licenceIssuedDate)}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">License Expiry Date: </span>{getDateFormatted(doctor.account.licenceExpiryDate)}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Business Phone: </span>{doctor.account.businessTelephone}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Business Address: </span>{doctor.account.businessAddress}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Qualifications: </span>{doctor.account.qualifications}</div>
                  <div className="wallet-container mt-3">
                      <WalletMultiButton />
                  </div>
                </div>
              </div>
              <div className="main-box">
                <div className="light-black-card text-center text-uppercase p-3">
                  <div className="secondary-text my-3">Actions</div>
                  <div className="text-bold mt-5 px-5">Initiate Vaccination: <span className="approved ml-3">
                    <button onClick={handleInitiatePage} className="button-secondary text-bold white-color">Initiate</button>
                  </span></div>
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
                    <StyledTableCell align="left"></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell component="th" scope="row">{getDateFormatted(row.date)}</StyledTableCell>
                        <StyledTableCell align="left">{row.vaccine}</StyledTableCell>
                        <StyledTableCell align="left">{row.batchNumber}</StyledTableCell>
                        <StyledTableCell align="left">{row.dosage}</StyledTableCell>
                        <StyledTableCell align="left">{getStatus(row.status)}</StyledTableCell>
                        <StyledTableCell align="left"><Button size="small" onClick={handleOpenVaccine}>View Record</Button></StyledTableCell>
                      </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {openVaccine &&
              <ViewRecordModal
                  closeVaccine={setOpenVaccine}
              />
          }
        </div>
      );
    } else {
      return (
        <InitiateVaccinations wallet={wallet}/>
      )
    }
  }
}


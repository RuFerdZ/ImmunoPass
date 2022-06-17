import React from 'react';

import { useEffect, useState } from 'react';
import {
  getAssignedVaccinationsForCamp,
  getVaccinationCampByWalletAddress,
  getVaccinationRecordsOfPassportHolder
} from '../../api'
import UserNotFound from '../UserNotFound'
import { styled } from '@mui/material/styles';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


import QRCode from "react-qr-code";

// import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet } from '@solana/wallet-adapter-react';
import ViewRecordModal from '../ViewRecordModal';
// import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

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


export default function VaccinationCampDashboard() {


  const wallet = useWallet();
  const [ vaccinationCamp, setVaccinationCamp ] = useState([]);
  const [ vaccines, setVaccines ] = useState([]);
  const [rows, setRows] = useState([])

  // QR modal settings
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // vaccine model settings
  const [openVaccine, setOpenVaccine] = React.useState(false);
  const handleOpenVaccine = () => setOpenVaccine(true);
  const handleCloseVaccinee = () => setOpenVaccine(false);

  useEffect(() => {
    loadVC()
  }, []);

  useEffect(() => {
    if (vaccinationCamp?.publicKey) {
      loadVaccines(vaccinationCamp?.publicKey)
    }
  }, [vaccinationCamp]);

  useEffect(() => {
    setRows([])
    if (vaccines) {
      createRecords(vaccines)
    }
  }, [vaccines]);

  const loadVC = async () => {
    const vc = await getVaccinationCampByWalletAddress(wallet);
    setVaccinationCamp(vc);
  }

  const loadVaccines = async (accountKey) => {
    const vac = await getAssignedVaccinationsForCamp(wallet, accountKey);
    setVaccines(vac);
  }

  const createRecords = (vacs) => {
    vacs.forEach(vaccine => {
      let row = createData(vaccine?.account?.createdDate, vaccine?.account?.vaccine, vaccine?.account?.batchNumber, vaccine?.account?.dosage, vaccine?.account?.status)
      setRows(rows.concat(row))
      console.log("rows - ", row)
    })
    console.log(rows)
  }


  const getDateFormatted = (timestamp) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', options);
  }

  const getStatus = (status) => {
    if (status === 'VALID') {
      return <span style={{color: 'green', border: '1px solid'}}>{status}</span>
    } else if (status === 'INVALID') {
      return <span style={{color: 'red', border: '1px solid'}}>{status}</span>
    } else {
      return <span style={{color: 'orange', border: '1px solid'}}>{status}</span>
    }
  }


  if (vaccinationCamp === undefined) {
    return (
        <UserNotFound />
    );
  } else {
    return (
    <div  className= {`${openVaccine && "primary-container"} doc-dashboard`}>
      <div className='doc-dashboard-header'>
          <h1 className='primary-text black-color py-4 text-uppercase text-center'>
            Vaccination Camp Dashboard
          </h1>
      </div>
      
      <div className='doc-dashboard-body'>
        <div className="box-container white-color px-4">
              <div className="main-box mr-3">
                <div className="light-black-card p-3 pb-4">
                  <div className="secondary-text text-uppercase text-center mt-3 mb-4">
                    Your Information
                  </div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Name: </span>{vaccinationCamp.account.name}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Registration Number: </span>{vaccinationCamp.account.registrationNumber}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Phone: </span>{vaccinationCamp.account.phone}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Address: </span>{vaccinationCamp.account.address}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Email: </span><a className="website-link" href={'mailto:' + vaccinationCamp.account.email} target='_blank'>{vaccinationCamp.account.email}</a></div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Website: </span><a className="website-link" href={vaccinationCamp.account.website} target='_blank'>{vaccinationCamp.account.website}</a></div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Joined Date: </span>{getDateFormatted(vaccinationCamp.account.joinedDate)}</div>
                  <div className="wallet-container mt-3">
                      <WalletMultiButton />
                  </div>
                </div>
              </div>
              <div className="main-box">
                <div className="light-black-card text-center text-uppercase p-3">
                  <div className="secondary-text my-3">Statistics</div>
                  <div className="text-bold mt-5 px-5">Approve: <span className="approved ml-3">Yes</span></div>
                  <div className="text-bold mt-5 px-5">Pending: <span className="pending ml-3">Yes</span></div>
                  <div className="text-bold mt-5 px-5">Rejected: <span className="rejected ml-3">Yes</span></div>
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
  }
}


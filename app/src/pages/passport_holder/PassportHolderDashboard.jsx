import React from 'react';

import { useEffect, useState } from 'react';
import { getPassportHolderByWalletAddress, getVaccinationRecordsOfPassportHolder } from '../../api'
import UserNotFound from '../UserNotFound'
import { styled } from '@mui/material/styles';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import {
  Chart,
  PieSeries,
  Title
} from '@devexpress/dx-react-chart-material-ui';
  


import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from "react-router-dom";


import QRCode from "react-qr-code";

// import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet } from '@solana/wallet-adapter-react';
import ViewRecordModal from '../ViewRecordModal';
// import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #191c24',
  boxShadow: 24,
  p: 4,
};

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


function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('13-09-2022', 'Sinopharm', 'SN12390881451', '5 kg', 'VALID'),
  createData('02-11-2021', 'Pfizer', 'PF9089031841', '3 shots', 'VALID'),
  createData('11-09-2022', 'Astrazenaca', 'AZ09124901nxX', '20 g', 'PENDING'),
  createData('18-09-2022', 'Moderna', 'MD92141515MM', '3 km', 'INVALID'),
  createData('10-09-2022', 'BioNTech', 'BT1240980989015', '7 Watts', 'VALID'),
];

const data = [
  { argument:'Pending', value:10 },
  { argument:'Rejected', value:40 },
  { argument:'Approved', value:70 },
];


export default function PassportHolderDashboard() {

  const navigate = useNavigate();
  const wallet = useWallet();
  const [ passportHolder, setPassportHolder ] = useState({});
  const [ vaccines, setVaccines ] = useState([]);

  // QR modal settings
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // vaccine model settings
  const [openVaccine, setOpenVaccine] = React.useState(false);
  const handleOpenVaccine = () => setOpenVaccine(true);
  const handleCloseVaccinee = () => setOpenVaccine(false);

  useEffect(() => {
    // console.log('wallet address -', wallet.publicKey);
    loadPH()
    loadVaccines()
  }, []);


  const loadPH = async () => {
    const ph = await getPassportHolderByWalletAddress(wallet);
    console.log(ph?.account)
    setPassportHolder(ph?.account);
  }
  // console.log("passport holder - " , passportHolder)

  const loadVaccines = async () => {
    const vaccines = await getVaccinationRecordsOfPassportHolder(wallet, passportHolder.publicKey);
    setVaccines(vaccines);
  }
  // console.log("vaccines - " , vaccines)

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

  if (passportHolder === undefined || passportHolder === null || passportHolder.length === 0) {
  return (
    
      <UserNotFound />
  );
  } else {
    return ( 
      <div className= {`${openVaccine && "primary-container"} doc-dashboard`}>
            <div className='doc-dashboard-header'>
              <h1 className='primary-text black-color py-4 text-uppercase text-center'>User Dashboard</h1>
            </div>
            
            <div className="box-container white-color px-4">
              <div className="main-box mr-3">
                <div className="light-black-card p-3 pb-4">
                  <div className="secondary-text text-uppercase text-center mt-3 mb-4">
                    Your Information
                  </div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Identification Number: </span>{passportHolder.nic}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Gender: </span>{passportHolder.gender}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Phone: </span>{passportHolder.phone}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Address: </span>{passportHolder.address}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Date of Birth: </span>{getDateFormatted(passportHolder.dateOfBirth)}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Place of Birth: </span>{passportHolder.placeOfBirth}</div>
                  <div className="mt-2 px-5"><span className="text-bold mr-2">Joined Date: </span>{getDateFormatted(passportHolder.joinedDate)}</div>
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
                        <StyledTableCell component="th" scope="row">
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="left">{row.calories}</StyledTableCell>
                        <StyledTableCell align="left">{row.fat}</StyledTableCell>
                        <StyledTableCell align="left">{row.carbs}</StyledTableCell>
                        <StyledTableCell align="left">{getStatus(row.protein)}</StyledTableCell>
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
           
            
       
    )
  }
}


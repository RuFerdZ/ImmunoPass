import React from 'react';

import { useEffect, useState } from 'react';
import { getPassportHolderByWalletAddress, getVaccinationRecordsOfPassportHolder } from '../../api'
import UserNotFound from '../UserNotFound'
import { styled } from '@mui/material/styles';


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


import QRCode from "react-qr-code";

// import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet } from '@solana/wallet-adapter-react';
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
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// table configuration
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
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


export default function PassportHolderDashboard() {

  const wallet = useWallet();
  const [ passportHolder, setPassportHolder ] = useState([]);
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
    setPassportHolder(ph);
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

  if (passportHolder === undefined) {
  return (
    
      <UserNotFound />
  );
  } else {
    return (
      <div>

        {/* qr model */}
         <Modal
            keepMounted
            open={open}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
          >
            <Box sx={style}>
                <QRCode value={String(passportHolder?.publicKey)} />
                <Typography variant="body1" color="text.primary" align='center'>SCAN ME</Typography>
            </Box>
          </Modal>


           {/* vaccine model */}
          <Modal
            keepMounted
            open={openVaccine}
            onClose={handleCloseVaccinee}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
          >
            <Box sx={style}>
                <Typography variant="body1" color="text.primary" align='center'>Vaccine Data</Typography>
            </Box>
          </Modal>

          <Grid container spacing={0}>
          <div className='dashboard-header'>
            <h1>Dashboard</h1>
            </div>

            <Grid item xs={4}>
              {/* <Item>xs=8</Item> */}
              <Card sx={{ maxWidth: 450 }}>
                <CardMedia
                  component="img"
                  alt="banner"
                  height="300vh"
                  image="https://www.verywellhealth.com/thmb/lvU_kVMVODMHcE87uoBd4T_iPk8=/500x350/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1221259525-29c595c924ed4f9d8d20307413a1df99.jpg"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Welcome {passportHolder?.account?.firstname} {passportHolder?.account?.lastname}
                  </Typography>
                  <table className='user-profile-table'>
                    <tbody>
                      <tr>
                        <td>Date of Birth: </td>
                        <td>{getDateFormatted(passportHolder?.account?.dateOfBirth)}</td>
                      </tr>
                      <tr>
                        <td>Place of Birth: </td>
                          <td>{passportHolder?.account?.placeOfBirth}</td>
                      </tr>
                      <tr>
                        <td>Address: </td>
                          <td>{passportHolder?.account?.address}</td>
                      </tr>
                      <tr>
                        <td>NIC: </td>
                          <td>{passportHolder?.account?.nic}</td>
                      </tr>
                      <tr>
                        <td>Contact Number: </td>
                          <td>{passportHolder?.account?.phone}</td>
                      </tr>
                      <tr>
                        <td>Date joined: </td>
                          <td>{getDateFormatted(passportHolder?.account?.joinedDate)}</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={handleOpen}>Show QR</Button>
                  <Button size="small">Update Profile</Button>
                </CardActions>
            </Card>
            </Grid>
            <Grid item xs={8}>
              {/* <Item>xs=4</Item> */}
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
            </Grid>
          </Grid>

        
      </div>
      
    )
  }
}


import React from 'react';

import { useEffect, useState } from 'react';
import { getDoctorByWalletAddress } from '../../api'
import UserNotFound from '../UserNotFound'

import Icon from "awesome-react-icons";


import { useWallet } from '@solana/wallet-adapter-react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';

import { Link } from "react-router-dom";


function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number,
) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];


export default function DoctorDashboard(props) {
  
  const wallet = useWallet();
  const [ doctor, setDoctor ] = useState([]);
  const [ vaccines, setVaccines ] = useState([]);

  useEffect(() => {
    loadDoctor()
  }, [wallet]);

  const loadDoctor = async () => {
    const doc = await getDoctorByWalletAddress(wallet);
    setDoctor(doc?.account);
    console.log(doc)
  }

  
  const getDateFormatted = (timestamp) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', options);
  }

  if (doctor === undefined || doctor === null || doctor.length === 0) {
    return (
        <UserNotFound />
    );
  } else {
    return (
        <div className='doc-dashboard'>
            <div className='doc-dashboard-header'>
              <h1 className='doc-dashboard-title'>Doctor Dashboard</h1>
            </div>

            
            <div className='doc-dashboard-body'>

              <div className='doc-dashboard-body-row1'>
                <div className='doc-dashboard-body-row1-col1'>
                  <div className='doc-dashboard-body-row1-col1-content'>
                    <div className="doctor-welcome">
                      <h1>Welcome Dr. {doctor.firstname} {doctor.lastname}</h1>
                    </div>
                    <div className="doctor-info">
                      <h3 className="doc-info-label">Your Information</h3>
                      <p>
                        <span className='doctor-info-label'>License Number:</span> {doctor.licenseNumber}
                      </p>
                      <p>
                        <span className='doctor-info-label'>License Issued Date:</span> {getDateFormatted(doctor.licenceIssuedDate)}
                      </p>
                      <p>
                        <span className='doctor-info-label'>License Issued Date:</span> {getDateFormatted(doctor.licenceExpiryDate)}
                      </p>
                      <p>
                        <span className='doctor-info-label'>Business Phone:</span> {doctor.businessTelephone}
                      </p>
                      <p>
                        <span className='doctor-info-label'>Business Address:</span> {doctor.businessAddress}
                      </p>
                      <p>
                        <span className='doctor-info-label'>Qualifications:</span> {doctor.qualifications}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='doc-dashboard-body-row1-col2'>
                <div className='doc-dashboard-body-row1-col2-content'>
                    <div className="doctor-actions">
                      <h1>Actions</h1>
                    </div>
                    <div className="doctor-info">
                     

                      <Link to="/doctor/initiate-vaccination" className="page-link">
                        <Button variant="contained">Initiate Vaccination</Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className='doc-dashboard-body-row1-col3'>
                  
                </div>
              </div>

              
            </div>
            <div className="data-table">
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Dessert (100g serving)</TableCell>
                      <TableCell align="right">Calories</TableCell>
                      <TableCell align="right">Fat&nbsp;(g)</TableCell>
                      <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                      <TableCell align="right">Protein&nbsp;(g)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <Row key={row.name} row={row} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            
      </div>
      
    );
  }
}


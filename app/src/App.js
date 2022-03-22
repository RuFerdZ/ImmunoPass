import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import VaccinationCampLogin from './pages/vaccination_camp/VaccinationCampLogin';
import PassportHolderLogin from './pages/passport_holder/PassportHolderLogin';
import DoctorLogin from './pages/doctor/DoctorLogin';
import VaccinationCampDashboard from './pages/vaccination_camp/VaccinationCampDashboard';
import PassportHolderDashboard from './pages/passport_holder/PassportHolderDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';


import LandingPage from './pages/LandingPage'
import AdminDashboard from './pages/admin/AdminDashboard';

require('@solana/wallet-adapter-react-ui/styles.css');

export default function App() {
  return (  
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/doctor/login" element={<DoctorLogin />} />
          <Route exact path="/passportHolder/login" element={<PassportHolderLogin />} />
          <Route exact path="/vaccinationCamp/login" element={<VaccinationCampLogin />} />
          <Route exact path="/admin" element={<AdminDashboard />} />
          <Route exact path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route exact path="/passportHolder/dashboard" element={<PassportHolderDashboard />} />
          <Route exact path="/vaccinationCamp/dashboard" element={<VaccinationCampDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
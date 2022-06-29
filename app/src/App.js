import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import VaccinationCampLogin from './pages/vaccination_camp/VaccinationCampLogin';
import PassportHolderLogin from './pages/passport_holder/PassportHolderLogin';
import DoctorLogin from './pages/doctor/DoctorLogin';
import VaccinationCampDashboard from './pages/vaccination_camp/VaccinationCampDashboard';
import PassportHolderDashboard from './pages/passport_holder/PassportHolderDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import InitiateVaccinations from './pages/doctor/InitiateVaccinations';


import LandingPage from './pages/LandingPage'
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import ValidationDashboard from "./pages/validation/ValidationDashboard";
import PassportHolderSetWallet from "./pages/passport_holder/PassportHolderSetWallet";
import ValidationLogin from "./pages/validation/ValidationLogin";

require('@solana/wallet-adapter-react-ui/styles.css');

export default function App() {
  return (  
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/doctor/home" element={<DoctorLogin />} />
          <Route exact path="/passport-holder/home" element={<PassportHolderLogin />} />
          <Route exact path="/vaccination-camp/home" element={<VaccinationCampLogin />} />
          <Route exact path="/admin/home" element={<AdminLogin />} />
          <Route exact path="/admin/dashboard" element={<AdminDashboard />} />
          <Route exact path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route exact path="/doctor/initiate-vaccination" element={<InitiateVaccinations />} />
          <Route exact path="/passport-holder/dashboard" element={<PassportHolderDashboard />} />
          <Route exact path="/vaccination-camp/dashboard" element={<VaccinationCampDashboard />} />
          <Route exact path="/validate/vaccination" element={<ValidationLogin />} />
          <Route exact path="/admin/dashboard" element={<AdminLogin />} />
          <Route exact path="/passport-holder/register-update" element={<PassportHolderSetWallet />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
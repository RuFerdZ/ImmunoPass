import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div className="main-center-container">
            {/* <div className="app-name">ImmunoPass</div> */}

            <div className="role-selection"> 
                <Link to="/passport-holder/login" className="page-link">
                    <Button variant='contained'>Passport Holder Login</Button>
                </Link>
                <Link to="/doctor/login" className="page-link">
                    <Button variant='contained'>Doctor Login</Button>
                </Link>
                <Link to="/vaccination-camp/login" className="page-link">
                    <Button variant='contained'>Vaccination Camp Login</Button>
                </Link>
                <Link to="/validate/vaccination" className="page-link">
                    <Button variant='outlined'>Validate Vaccination</Button>
                </Link>
            </div>
           
        </div>
    );
}

export default LandingPage;
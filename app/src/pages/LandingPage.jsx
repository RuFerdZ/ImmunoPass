import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div className="main-center-container">
            {/* <div className="app-name">ImmunoPass</div> */}

            <div className="role-selection"> 
                <Link to="/passport-holder/home" className="page-link">
                    <Button variant='contained'>Passport Holder Login</Button>
                </Link>
                <Link to="/doctor/home" className="page-link">
                    <Button variant='contained'>Doctor Login</Button>
                </Link>
                <Link to="/vaccination-camp/home" className="page-link">
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